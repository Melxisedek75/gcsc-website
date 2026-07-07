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
const CHAIN_API = 'https://testnet.xprnetwork.org';
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
}

export interface SignResult {
  ok: boolean;
  txHash?: string;
  error?: string;
}

let currentSession: WebAuthSession | null = null;
let protonLink: ProtonLink | null = null;
let protonSession: LinkSession | null = null;

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
  await AsyncStorage.removeItem(WEBAUTH_SESSION_KEY);
}

function buildCallbackUrl(requestKey: string): string {
  // ESR wallets only substitute callback payload fields when the callback URL
  // explicitly contains placeholders like {{sa}}, {{sp}}, {{tx}}, and {{sig}}.
  // Build the standalone app scheme by hand so the braces are not URL-encoded
  // before @proton/signing-request resolves them.
  return [
    `smartcontractor:///${CALLBACK_PATH}?rid=${encodeURIComponent(requestKey)}`,
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
      endpoints: [CHAIN_API],
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

function waitForCallback(
  requestKey: string,
  timeoutMs: number,
): Promise<CallbackPayload> {
  return new Promise((resolve, reject) => {
    let settled = false;
    let lastUrl: string | null = null;

    function cleanup() {
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

function sharedSigningRequestOpts() {
  return {
    scheme: 'esr' as const,
    abiProvider: {
      getAbi: async (_account: string) => ({
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
      }),
    },
    chainApi: CHAIN_API,
  };
}

function buildIdentityRequest(callback: string): SigningRequest {
  return SigningRequest.identity(
    { callback, chainId: CHAIN_ID },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sharedSigningRequestOpts() as any,
  );
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
  return SigningRequest.create(
    { action, callback: args.callback, chainId: CHAIN_ID },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sharedSigningRequestOpts() as any,
  );
}

export async function connectWallet(): Promise<WebAuthSession> {
  try {
    const identity = await connectWithProtonNativeSdk(false);
    const session: WebAuthSession = {
      account: String(identity.auth.actor),
      permission: String(identity.auth.permission),
      publicKey: identity.publicKey?.toString(),
      connectedAt: Date.now(),
    };
    await persistSession(session);
    return session;
  } catch (linkErr) {
    console.warn(
      '[webauth] Proton Link login failed, falling back to direct ESR identity',
      linkErr,
    );
  }

  const requestKey = newRequestKey();
  const callback = buildCallbackUrl(requestKey);
  const req = buildIdentityRequest(callback);
  await openWithWallet(req);
  const payload = await waitForCallback(requestKey, 120_000);
  if (!payload.sa) {
    throw new Error('WebAuth did not return signer account');
  }
  const session: WebAuthSession = {
    account: payload.sa,
    permission: payload.sp ?? 'active',
    connectedAt: Date.now(),
  };
  await persistSession(session);
  return session;
}

export async function signTransfer(args: TransferArgs): Promise<SignResult> {
  try {
    if (!currentSession) {
      await loadWebauthSession();
    }
    const from = args.fromAccount ?? currentSession?.account;
    const permission =
      args.fromPermission ?? currentSession?.permission ?? 'active';
    if (!from) {
      throw new Error('No WebAuth session — call connectWallet() first');
    }
    try {
      let link: ProtonLink | null = protonLink;
      let session: LinkSession | null = protonSession;
      try {
        if (!link || !session) {
          session = await connectWithProtonNativeSdk(true);
          link = protonLink;
        }
      } catch {
        session = null;
      }
      if (!link && !session) {
        throw new Error('No saved Proton Link session');
      }

      const action = {
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{ actor: from, permission }],
        data: {
          from,
          to: args.recipient,
          quantity: args.amount,
          memo: args.memo ?? '',
        },
      };
      // On Android the official RN SDK delivers session requests through a
      // channel wake-up (`proton-dev://link`). Some WebAuth builds open from
      // pairing but never surface the pushed transaction prompt. Prefer a
      // direct one-shot signing request so WebAuth receives the full transfer
      // payload through the same onRequest path that successfully opens login.
      const result = link
        ? await link.transact({ action }, { broadcast: true })
        : await session!.transact({ action }, { broadcast: true });
      const txHash = extractTxHash(result);
      if (!txHash) {
        throw new Error('WebAuth did not return tx id');
      }
      return { ok: true, txHash };
    } catch (linkErr) {
      console.warn(
        '[webauth] Proton Link transfer failed, falling back to direct ESR transfer',
        linkErr,
      );
    }

    const requestKey = newRequestKey();
    const callback = buildCallbackUrl(requestKey);
    const req = await buildTransferRequest({
      recipient: args.recipient,
      amount: args.amount,
      memo: args.memo ?? '',
      from,
      permission,
      callback,
    });
    await openWithWallet(req);
    const payload = await waitForCallback(requestKey, 180_000);
    if (!payload.tx) {
      throw new Error('WebAuth did not return tx id');
    }
    return { ok: true, txHash: payload.tx };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown signing error';
    return { ok: false, error: msg };
  }
}

export const __webauthInternals = {
  buildCallbackUrl,
  parseCallback,
  CHAIN_ID,
  CHAIN_API,
  CALLBACK_PATH,
};
