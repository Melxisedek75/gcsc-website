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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SigningRequest } from '@proton/signing-request';

const WEBAUTH_SESSION_KEY = '@gcsc/webauth/session';

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
  return Linking.createURL(`${CALLBACK_PATH}?req=${encodeURIComponent(requestKey)}`);
}

interface CallbackPayload {
  tx?: string;
  sig?: string;
  sa?: string;
  sp?: string;
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
    const sub = Linking.addEventListener('url', ({ url }) => {
      const payload = parseCallback(url);
      if (payload.req && payload.req !== requestKey) return;
      sub.remove();
      clearTimeout(timer);
      if (payload.error) {
        reject(new Error(payload.error));
        return;
      }
      if (payload.cancelled) {
        reject(new Error('User cancelled in WebAuth'));
        return;
      }
      resolve(payload);
    });
    const timer = setTimeout(() => {
      sub.remove();
      reject(new Error('WebAuth callback timeout'));
    }, timeoutMs);
  });
}

async function openSigningRequest(esrUri: string): Promise<void> {
  const can = await Linking.canOpenURL(esrUri);
  if (!can) {
    throw new Error(
      'WebAuth wallet not installed. Get it from https://webauth.com',
    );
  }
  await Linking.openURL(esrUri);
}

function newRequestKey(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
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

function encodeIdentityRequest(callback: string): string {
  const req = SigningRequest.identity(
    { callback, chainId: CHAIN_ID },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sharedSigningRequestOpts() as any,
  );
  return req.encode(true, false);
}

async function encodeTransferRequest(args: {
  recipient: string;
  amount: string;
  memo: string;
  from: string;
  permission: string;
  callback: string;
}): Promise<string> {
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
  return req.encode(true, false);
}

export async function connectWallet(): Promise<WebAuthSession> {
  const requestKey = newRequestKey();
  const callback = buildCallbackUrl(requestKey);
  const esr = encodeIdentityRequest(callback);
  await openSigningRequest(esr);
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
    const from = args.fromAccount ?? currentSession?.account;
    const permission =
      args.fromPermission ?? currentSession?.permission ?? 'active';
    if (!from) {
      throw new Error('No WebAuth session — call connectWallet() first');
    }
    const requestKey = newRequestKey();
    const callback = buildCallbackUrl(requestKey);
    const esr = await encodeTransferRequest({
      recipient: args.recipient,
      amount: args.amount,
      memo: args.memo ?? '',
      from,
      permission,
      callback,
    });
    await openSigningRequest(esr);
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
