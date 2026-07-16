// WebAuth wallet integration for SmartContractor mobile.
//
// Strategy: React Native cannot run @proton/web-sdk directly (it requires DOM).
// Instead we build an ESR (EOSIO Signing Request) on-device, encode it as an
// `esr://` deeplink, hand it off to the WebAuth mobile app via expo-linking,
// then await a callback deeplink (`smartcontractor://webauth-callback?...`)
// containing the signed transaction id.
//
// Status: scaffolded. Device-side flow (deeplink open + callback listener) is
// wired but requires a physical device + installed WebAuth app to verify
// end-to-end. Session persistence is in-memory; AsyncStorage wiring is a TODO
// once the device round-trip is confirmed.

import * as Linking from 'expo-linking';
import { AppState } from 'react-native';
import { safeStorage as AsyncStorage } from './storage';
import { SigningRequest } from '@proton/signing-request';
import ProtonRNSDK, {
  type LinkSession,
  type ProtonLink,
} from '@proton/react-native-sdk';
import {
  type LinkStorage,
} from '@proton/link';

const WEBAUTH_SESSION_KEY = '@gcsc/webauth/session';
const PROTON_LINK_STORAGE_PREFIX = '@gcsc/proton-link/';

// XPR (Proton) testnet chain ID — must match backend v3/pure-server.js
// XPR_TESTNET_CHAIN_ID and the official XPR docs. A mismatch routes the
// signing request to the wrong chain or gets rejected by the wallet.
const CHAIN_ID =
  '71ee83bcf52142d61019d95f9cc5427ba6a0d7ff8accd9e2088ae2abeaf3d3dd'; // Proton testnet
// IMPORTANT: these must be real XPR testnet CHAIN API nodes, not the website.
// History of bad nodes (each produced "JSON Parse error: Unexpected character: <"
// because an HTML error page was parsed as JSON):
//  - testnet.xprnetwork.org → explorer site, 404 HTML on /v1/chain/*
//  - tn1.protonnz.com → get_info OK but get_abi → 502 HTML (verified 2026-07-11),
//    which is why wallet LOGIN worked (no chain calls) while TRANSFER failed
//    (needs get_abi + push_transaction).
// Both nodes below verified 2026-07-11: get_abi → 200 JSON, chain_id 71ee83bc….
// Override the primary via EXPO_PUBLIC_XPR_CHAIN_API.
const CHAIN_ENDPOINTS: string[] = [
  ...((typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_XPR_CHAIN_API)
    ? [process.env.EXPO_PUBLIC_XPR_CHAIN_API]
    : []),
  'https://testnet-api.alvosec.com',
  'https://api-xprnetwork-test.saltant.io',
];
const CHAIN_API = CHAIN_ENDPOINTS[0];
const CALLBACK_PATH = 'webauth-callback';
const REQUEST_ACCOUNT = 'gcsctoken111';

export interface WebAuthSession {
  account: string;
  permission: string;
  publicKey?: string;
  connectedAt: number;
}

export interface TransferArgs {
  recipient: string;
  amount: string;
  memo?: string;
  fromAccount?: string;
  fromPermission?: string;
  onDebug?: (message: string) => void;
}

export interface SignResult {
  ok: boolean;
  txHash?: string;
  error?: string;
}

let currentSession: WebAuthSession | null = null;
let protonLink: ProtonLink | null = null;
let protonSession: LinkSession | null = null;
const callbackHandlers = new Set<(url: string) => boolean>();
const pendingCallbackUrls: string[] = [];

export function getSession(): WebAuthSession | null {
  return currentSession;
}

export async function loadWebauthSession(): Promise<WebAuthSession | null> {
  const raw = await AsyncStorage.getItem(WEBAUTH_SESSION_KEY);
  if (!raw) return null;
  try {
    currentSession = JSON.parse(raw) as WebAuthSession;
    return currentSession;
  } catch {
    return null;
  }
}

async function persistSession(s: WebAuthSession): Promise<void> {
  currentSession = s;
  await AsyncStorage.setItem(WEBAUTH_SESSION_KEY, JSON.stringify(s));
}

export async function primeSessionFromBackend(
  account: string,
  permission: string,
): Promise<WebAuthSession> {
  const s: WebAuthSession = { account, permission, connectedAt: Date.now() };
  await persistSession(s);
  return s;
}

export async function clearSession(): Promise<void> {
  currentSession = null;
  // Also drop the Proton Link session (in-memory + SDK storage). Without this,
  // a later transfer restores the PREVIOUS wallet account's session, so after
  // switching accounts every payment fails the profile-wallet match check no
  // matter which account the user picks in WebAuth.
  try {
    await protonSession?.remove();
  } catch {
    // best effort — a broken stored session must not block disconnect
  }
  protonLink = null;
  protonSession = null;
  await AsyncStorage.removeItem(WEBAUTH_SESSION_KEY);
}

function buildCallbackUrl(requestKey: string): string {
  // ESR wallets only substitute callback payload fields when the callback URL
  // explicitly contains placeholders like {{sa}}, {{sp}}, {{tx}}, and {{sig}}.
  // Match the official React Native SDK return URL shape (`app://screen`) so
  // Android routes the callback through the host-based intent filter.
  return [
    `smartcontractor://${CALLBACK_PATH}?rid=${encodeURIComponent(requestKey)}`,
    'sa={{sa}}',
    'sp={{sp}}',
    'tx={{tx}}',
    'sig={{sig}}',
    'cid={{cid}}',
  ].join('&');
}

const linkStorage: LinkStorage = {
  read: (key: string) => AsyncStorage.getItem(`${PROTON_LINK_STORAGE_PREFIX}${key}`),
  write: (key: string, data: string) =>
    AsyncStorage.setItem(`${PROTON_LINK_STORAGE_PREFIX}${key}`, data),
  remove: (key: string) => AsyncStorage.removeItem(`${PROTON_LINK_STORAGE_PREFIX}${key}`),
};

async function openSigningRequestWithWallet(req: SigningRequest): Promise<void> {
  const encoded = req.encode(true, false);
  const payload = encoded.replace(/^esr:(\/\/)?/i, '');
  const errors: string[] = [];
  for (const scheme of WALLET_SCHEMES) {
    const uri = `${scheme}://${payload}`;
    try {
      await Linking.openURL(uri);
      return;
    } catch (err) {
      errors.push(`${scheme}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  throw new Error(
    `Could not open the WebAuth wallet. Install WebAuth (testnet) from https://webauth.com. Tried schemes — ${errors.join(' | ')}`,
  );
}

async function connectWithProtonNativeSdk(restoreSession = false): Promise<LinkSession> {
  const result = await ProtonRNSDK({
    linkOptions: {
      chainId: CHAIN_ID,
      endpoints: CHAIN_ENDPOINTS,
      storage: linkStorage,
      storagePrefix: PROTON_LINK_STORAGE_PREFIX,
      restoreSession,
    },
    transportOptions: {
      requestAccount: REQUEST_ACCOUNT,
      getReturnUrl: () => `smartcontractor://${CALLBACK_PATH}`,
    },
  });

  if (!result.link || !result.session) {
    throw new Error('WebAuth did not return a Proton Link session');
  }
  protonLink = result.link;
  protonSession = result.session;
  return result.session;
}

interface CallbackPayload {
  tx?: string;
  sig?: string;
  sa?: string;
  sp?: string;
  rid?: string;
  req?: string;
  cancelled?: string;
  error?: string;
}

function parseCallback(url: string): CallbackPayload {
  const parsed = Linking.parse(url);
  const qp = parsed.queryParams ?? {};
  const out: CallbackPayload = {};
  for (const k of Object.keys(qp)) {
    const v = qp[k];
    if (typeof v === 'string') (out as Record<string, string>)[k] = v;
  }
  return out;
}

export function dispatchWebAuthCallbackUrl(url: string): boolean {
  let handled = false;
  for (const handler of Array.from(callbackHandlers)) {
    handled = handler(url) || handled;
  }
  if (!handled) {
    pendingCallbackUrls.push(url);
    if (pendingCallbackUrls.length > 10) pendingCallbackUrls.shift();
  }
  return handled;
}

function waitForCallback(
  requestKey: string,
  timeoutMs: number,
): Promise<CallbackPayload> {
  return new Promise((resolve, reject) => {
    let settled = false;
    let lastUrl: string | null = null;

    function cleanup() {
      callbackHandlers.delete(acceptUrl);
      sub.remove();
      appStateSub.remove();
      clearTimeout(timer);
    }

    function acceptUrl(url: string): boolean {
      if (settled || url === lastUrl) return true;
      lastUrl = url;
      const payload = parseCallback(url);
      if (payload.rid !== requestKey && payload.req !== requestKey) return false;
      settled = true;
      cleanup();
      if (payload.error) {
        reject(new Error(payload.error));
        return true;
      }
      if (payload.cancelled) {
        reject(new Error('User cancelled in WebAuth'));
        return true;
      }
      resolve(payload);
      return true;
    }

    const sub = Linking.addEventListener('url', ({ url }) => {
      acceptUrl(url);
    });

    const appStateSub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') return;
      Linking.getInitialURL()
        .then((url) => {
          if (url) acceptUrl(url);
        })
        .catch(() => {});
    });

    Linking.getInitialURL()
      .then((url) => {
        if (url) acceptUrl(url);
      })
      .catch(() => {});

    callbackHandlers.add(acceptUrl);
    for (const url of [...pendingCallbackUrls]) {
      if (acceptUrl(url)) {
        const idx = pendingCallbackUrls.indexOf(url);
        if (idx >= 0) pendingCallbackUrls.splice(idx, 1);
      }
    }

    const timer = setTimeout(() => {
      settled = true;
      cleanup();
      reject(new Error('WebAuth callback timeout'));
    }, timeoutMs);
  });
}

// XPR WebAuth registers its own URL scheme, NOT `esr://`. Testnet WebAuth uses
// `proton-dev://`, mainnet uses `proton://`; some builds also accept `esr://`.
// Override/reorder via EXPO_PUBLIC_WEBAUTH_SCHEMES (comma-separated).
const WALLET_SCHEMES: string[] = (
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_WEBAUTH_SCHEMES) ||
  'proton-dev,proton,esr'
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// Encode the same ESR payload under each candidate scheme and open the first
// one the OS can resolve, so the WebAuth handoff works across wallet variants.
async function openWithWallet(req: SigningRequest): Promise<void> {
  // compress=false: React Native has no zlib ("Need zlib to compress").
  // slashes=true: produce `esr://<payload>`. The ESR payload is scheme-agnostic,
  // so we swap the `esr` prefix for each candidate wallet scheme.
  const encoded = req.encode(false, true);
  const payload = encoded.replace(/^esr:(\/\/)?/i, '');
  const errors: string[] = [];
  for (const scheme of WALLET_SCHEMES) {
    const uri = `${scheme}://${payload}`;
    try {
      await Linking.openURL(uri);
      return;
    } catch (err) {
      errors.push(`${scheme}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  throw new Error(
    `Could not open the WebAuth wallet. Install WebAuth (testnet) from https://webauth.com. Tried schemes — ${errors.join(' | ')}`,
  );
}

function newRequestKey(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function extractTxHash(result: any): string | undefined {
  return (
    result?.transaction?.id?.toString?.() ??
    result?.processed?.id ??
    result?.payload?.tx
  );
}

function debugTransfer(args: TransferArgs, trace: string[], message: string): void {
  trace.push(message);
  args.onDebug?.(message);
}

function describeError(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${Math.round(timeoutMs / 1000)}s`));
    }, timeoutMs);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

function addSameDeviceInfo(req: SigningRequest): SigningRequest {
  // DEVICE LOG (2026-07-08, SM-N976U): with `same_device` + `return_path` set,
  // WebAuth returned to a BARE `smartcontractor://webauth-callback` (no
  // ?sa/?sp/?tx params) → waitForCallback never got the signer account → 120s
  // timeout → "no connect". WebAuth was using return_path as the return target
  // instead of substituting placeholders into the ESR callback.
  //
  // Fix: keep ONLY `req_account` (drives the "GCSC Token @gcsctoken111" label).
  // Dropping same_device/return_path makes WebAuth deliver the result through
  // the ESR `callback` URL, which carries the {{sa}}/{{sp}}/{{tx}}/{{sig}}
  // placeholders we need.
  req.setInfoKey('req_account', REQUEST_ACCOUNT);
  // return_path brings focus back to the app after signing; the actual signed
  // result travels over the Proton Link channel (not the deeplink), so a bare
  // return here is fine and expected.
  req.setInfoKey('same_device', true);
  req.setInfoKey('return_path', `smartcontractor://${CALLBACK_PATH}`);
  return req;
}

// Fallback ABI used only when the chain API is unreachable. A hand-written
// minimal ABI can make WebAuth silently drop/mis-render the transfer prompt,
// so the real on-chain ABI is fetched (and cached) whenever possible.
const FALLBACK_TOKEN_ABI = {
  version: 'eosio::abi/1.1',
  types: [],
  structs: [
    {
      name: 'transfer',
      base: '',
      fields: [
        { name: 'from', type: 'name' },
        { name: 'to', type: 'name' },
        { name: 'quantity', type: 'asset' },
        { name: 'memo', type: 'string' },
      ],
    },
  ],
  actions: [{ name: 'transfer', type: 'transfer', ricardian_contract: '' }],
  tables: [],
  ricardian_clauses: [],
  error_messages: [],
  abi_extensions: [],
  variants: [],
};

const abiCache = new Map<string, unknown>();

async function fetchChainAbi(account: string): Promise<unknown> {
  if (abiCache.has(account)) return abiCache.get(account);
  try {
    const res = await withTimeout(
      fetch(`${CHAIN_API}/v1/chain/get_abi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_name: account }),
      }),
      10_000,
      'get_abi',
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.abi) {
        abiCache.set(account, data.abi);
        return data.abi;
      }
    }
  } catch {
    // fall through to the minimal ABI
  }
  return FALLBACK_TOKEN_ABI;
}

function sharedSigningRequestOpts() {
  return {
    scheme: 'esr' as const,
    abiProvider: {
      getAbi: async (account: string) => fetchChainAbi(account || 'eosio.token'),
    },
    chainApi: CHAIN_API,
  };
}

function buildIdentityRequest(callback: string): SigningRequest {
  const req = SigningRequest.identity(
    { callback, chainId: CHAIN_ID },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sharedSigningRequestOpts() as any,
  );
  return addSameDeviceInfo(req);
}

async function buildTransferRequest(args: {
  recipient: string;
  amount: string;
  memo: string;
  from: string;
  permission: string;
  callback: string;
}): Promise<SigningRequest> {
  const action = {
    account: 'eosio.token',
    name: 'transfer',
    authorization: [{ actor: args.from, permission: args.permission }],
    data: {
      from: args.from,
      to: args.recipient,
      quantity: args.amount,
      memo: args.memo,
    },
  };
  const req = await SigningRequest.create(
    { action, callback: args.callback, chainId: CHAIN_ID },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sharedSigningRequestOpts() as any,
  );
  return addSameDeviceInfo(req);
}

export async function connectWallet(): Promise<WebAuthSession> {
  // Device logs (SM-N976U, 2026-07-08) proved the direct-ESR deeplink CANNOT
  // receive the identity result from XPR WebAuth — WebAuth delivers the signed
  // result over the Proton Link channel, not the deeplink callback. So the
  // Proton Link SDK is the ONLY working path; it just needed a real chain API
  // node (see CHAIN_API). Use it as the sole connect path.
  // Fresh pairing must not inherit a previous account's session state.
  protonLink = null;
  protonSession = null;
  const identity = await withTimeout(
    connectWithProtonNativeSdk(false),
    90_000,
    'Proton Link login',
  );
  const session: WebAuthSession = {
    account: String(identity.auth.actor),
    permission: String(identity.auth.permission),
    publicKey: identity.publicKey?.toString(),
    connectedAt: Date.now(),
  };
  await persistSession(session);
  return session;
}

export async function signTransfer(args: TransferArgs): Promise<SignResult> {
  const trace: string[] = [];
  try {
    if (!currentSession) {
      debugTransfer(args, trace, 'Loading stored WebAuth session');
      await loadWebauthSession();
    }
    const from = args.fromAccount ?? currentSession?.account;
    const permission =
      args.fromPermission ?? currentSession?.permission ?? 'active';
    if (!from) {
      throw new Error('No WebAuth session — call connectWallet() first');
    }
    debugTransfer(args, trace, `Preparing transfer as ${from}@${permission}`);

    // Device logs proved direct-ESR deeplink cannot receive the signed result
    // from XPR WebAuth (result comes over the Proton Link channel). So sign the
    // transfer through the Proton Link session — the same channel that now works
    // once CHAIN_API points at a real API node.
    let link: ProtonLink | null = protonLink;
    let session: LinkSession | null = protonSession;
    if (!link || !session) {
      try {
        debugTransfer(args, trace, 'Restoring Proton Link session');
        session = await withTimeout(
          connectWithProtonNativeSdk(true),
          90_000,
          'Proton Link session restore',
        );
        link = protonLink;
      } catch (restoreErr) {
        // A stored session can't always be restored (SDK login sessions are
        // in-memory and lost across app restarts). Fall back to a fresh login,
        // which re-opens WebAuth to re-establish a signable Proton Link session.
        debugTransfer(args, trace, `Restore failed: ${describeError(restoreErr)}; re-authenticating`);
        session = await withTimeout(
          connectWithProtonNativeSdk(false),
          90_000,
          'Proton Link re-login',
        );
        link = protonLink;
      }
    }
    if (!link) {
      throw new Error('No Proton Link session');
    }

    const signerAccount = session?.auth?.actor ? String(session.auth.actor) : from;
    const signerPermission = session?.auth?.permission
      ? String(session.auth.permission)
      : permission;
    if (from && signerAccount !== from) {
      throw new Error(
        `Payment must be signed by your linked wallet ${from}, but WebAuth is using ${signerAccount}. ` +
          'To switch accounts: open Profile -> Disconnect wallet -> Connect WebAuth and pick the account you want.',
      );
    }
    const action = {
      account: 'eosio.token',
      name: 'transfer',
      authorization: [{ actor: signerAccount, permission: signerPermission }],
      data: {
        from: signerAccount,
        to: args.recipient,
        quantity: args.amount,
        memo: args.memo ?? '',
      },
    };
    debugTransfer(args, trace, 'Opening Proton Link transaction request');
    let result;
    try {
      result = await withTimeout(
        link.transact({ actions: [action] }, { broadcast: true }),
        180_000,
        'WebAuth transaction',
      );
    } catch (txErr) {
      // A session restored from storage can be stale after a reinstall or a
      // fresh registration: the chain rejects its session key with "declares
      // authority ... but does not have signatures". Self-heal by discarding
      // the stale session, pairing fresh in WebAuth, and retrying once.
      const txMsg = txErr instanceof Error ? txErr.message : String(txErr);
      if (!/does not have signatures|unsatisfied|missing.*signature/i.test(txMsg)) {
        throw txErr;
      }
      debugTransfer(args, trace, 'Stale session signature rejected; re-pairing');
      protonLink = null;
      protonSession = null;
      await connectWithProtonNativeSdk(false);
      // connectWithProtonNativeSdk repopulates the module-level protonLink;
      // the cast re-widens the type TS narrowed to null above.
      link = protonLink as ProtonLink | null;
      if (!link) {
        throw new Error('Re-pairing with WebAuth failed');
      }
      result = await withTimeout(
        link.transact({ actions: [action] }, { broadcast: true }),
        180_000,
        'WebAuth transaction (retry)',
      );
    }
    const txHash = extractTxHash(result);
    if (!txHash) {
      throw new Error('WebAuth did not return tx id');
    }
    return { ok: true, txHash };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown signing error';
    return { ok: false, error: trace.length ? `${msg} | ${trace.join(' -> ')}` : msg };
  }
}

export const __webauthInternals = {
  buildCallbackUrl,
  parseCallback,
  CHAIN_ID,
  CHAIN_API,
  CALLBACK_PATH,
};
