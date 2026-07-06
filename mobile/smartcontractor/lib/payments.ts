// Client wrapper around mppx-xpr-network 402-flow.
// Server expects: fetch(endpoint) -> 402 + WWW-Authenticate: Payment
//                 client signs eosio.token::transfer via WebAuth
//                 fetch(endpoint, { Authorization: 'Payment <txHash>' }) -> 200 + Payment-Receipt
// Until a live backend is wired, DEMO_MODE simulates the round-trip so the UI flow is real.

import { signTransfer as webauthSignTransfer } from './webauth';
import { getToken, clearSession } from './api';

// Thrown when the backend rejects the caller's JWT (missing/expired/stale token
// from a previous backend). Callers can catch this to route the user back to
// sign-in. The stored session is cleared as a side effect before this is thrown.
export class SessionExpiredError extends Error {
  constructor() {
    super('Your session has expired. Please sign in again.');
    this.name = 'SessionExpiredError';
  }
}

export type PaymentMode = 'charge' | 'session';

export interface PaymentRequest {
  mode: PaymentMode;
  amount: string;
  recipient: string;
  memo?: string;
  endpoint?: string;
  // Extra JSON body sent on the verification (post-signature) request —
  // e.g. { project_id } required by /api/payment/job-posting.
  meta?: Record<string, unknown>;
}

export interface PaymentReceipt {
  ok: boolean;
  txHash?: string;
  amount: string;
  recipient: string;
  timestamp: number;
  error?: string;
}

export type PaymentStage =
  | 'idle'
  | 'requesting'
  | 'awaiting_signature'
  | 'broadcasting'
  | 'verifying'
  | 'confirmed'
  | 'failed';

export interface PaymentProgress {
  stage: PaymentStage;
  detail: string;
}

const DEMO_MODE = false;

const STAGE_FLOW: { stage: PaymentStage; detail: string; delayMs: number }[] = [
  { stage: 'requesting', detail: 'Contacting payment endpoint…', delayMs: 400 },
  { stage: 'awaiting_signature', detail: 'Approve in WebAuth wallet', delayMs: 1200 },
  { stage: 'broadcasting', detail: 'Submitting transfer to XPR Network', delayMs: 700 },
  { stage: 'verifying', detail: 'Verifying via Hyperion', delayMs: 600 },
];

export async function requestPayment(
  req: PaymentRequest,
  onProgress: (p: PaymentProgress) => void,
): Promise<PaymentReceipt> {
  if (DEMO_MODE || !req.endpoint) {
    return simulatePayment(req, onProgress);
  }
  return livePayment(req, onProgress);
}

async function simulatePayment(
  req: PaymentRequest,
  onProgress: (p: PaymentProgress) => void,
): Promise<PaymentReceipt> {
  for (const step of STAGE_FLOW) {
    onProgress({ stage: step.stage, detail: step.detail });
    await wait(step.delayMs);
  }
  const txHash = mockTxHash();
  onProgress({ stage: 'confirmed', detail: `Confirmed · ${shortHash(txHash)}` });
  return {
    ok: true,
    txHash,
    amount: req.amount,
    recipient: req.recipient,
    timestamp: Date.now(),
  };
}

async function livePayment(
  req: PaymentRequest,
  onProgress: (p: PaymentProgress) => void,
): Promise<PaymentReceipt> {
  try {
    onProgress({ stage: 'requesting', detail: 'Contacting payment endpoint…' });
    const token = getToken();
    const baseHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    const first = await fetch(req.endpoint!, { method: 'POST', headers: baseHeaders });
    // 401/403 = the JWT is missing, expired, or from a previous backend. Clear
    // the stale session so the app can route back to sign-in, and surface a
    // human-readable message instead of a raw status code.
    if (first.status === 401 || first.status === 403) {
      await clearSession();
      throw new SessionExpiredError();
    }
    if (first.status !== 402) {
      throw new Error(`Expected 402, got ${first.status}`);
    }
    const challenge = parsePaymentChallenge(first.headers.get('WWW-Authenticate'));

    onProgress({ stage: 'awaiting_signature', detail: 'Approve in WebAuth wallet' });
    const txHash = await signTransfer({
      recipient: challenge.recipient ?? req.recipient,
      amount: challenge.amount ?? req.amount,
      memo: req.memo,
    });

    onProgress({ stage: 'broadcasting', detail: 'Submitting transfer to XPR Network' });
    // Keep JWT in Authorization: Bearer so backend getUser() still authenticates
    // the retry, and pass the settled tx hash in X-Payment-Tx (backend reads it
    // there). Send any payment metadata (e.g. project_id) as the JSON body.
    const secondHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Payment-Tx': txHash,
    };
    if (token) secondHeaders.Authorization = `Bearer ${token}`;
    const second = await fetch(req.endpoint!, {
      method: 'POST',
      headers: secondHeaders,
      body: req.meta ? JSON.stringify(req.meta) : undefined,
    });
    if (!second.ok) {
      throw new Error(`Verification failed: ${second.status}`);
    }
    onProgress({ stage: 'verifying', detail: 'Verifying via Hyperion' });
    onProgress({ stage: 'confirmed', detail: `Confirmed · ${shortHash(txHash)}` });
    return {
      ok: true,
      txHash,
      amount: req.amount,
      recipient: req.recipient,
      timestamp: Date.now(),
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    onProgress({ stage: 'failed', detail: msg });
    return {
      ok: false,
      amount: req.amount,
      recipient: req.recipient,
      timestamp: Date.now(),
      error: msg,
    };
  }
}

interface PaymentChallenge {
  recipient?: string;
  amount?: string;
  memo?: string;
}

function parsePaymentChallenge(header: string | null): PaymentChallenge {
  if (!header) return {};
  const challenge: PaymentChallenge = {};
  const re = /(\w+)="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(header)) !== null) {
    const [, key, value] = m;
    if (key === 'recipient') challenge.recipient = value;
    if (key === 'amount') challenge.amount = value;
    if (key === 'memo') challenge.memo = value;
  }
  return challenge;
}

async function signTransfer(args: {
  recipient: string;
  amount: string;
  memo?: string;
}): Promise<string> {
  const result = await webauthSignTransfer(args);
  if (!result.ok || !result.txHash) {
    throw new Error(result.error ?? 'WebAuth signing failed');
  }
  return result.txHash;
}

function wait(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function mockTxHash(): string {
  const chars = 'abcdef0123456789';
  let h = '';
  for (let i = 0; i < 64; i++) h += chars[Math.floor(Math.random() * chars.length)];
  return h;
}

function shortHash(h: string): string {
  return `${h.slice(0, 6)}…${h.slice(-4)}`;
}

// Live backend on Railway (auto-deployed from gcsc-smart-contractor/main).
// Override via env at build time (Expo: app.config.ts extra block).
const RAILWAY_BACKEND = 'https://gcsc-backend-production.up.railway.app';
const API_BASE: string =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_BASE_URL) ||
  RAILWAY_BACKEND;

export const PAYMENT_CONFIG = {
  LEAD_TOKEN_RECIPIENT: 'gcsctoken111',
  LEAD_TOKEN_AMOUNT: '50.0000 XPR',
  LEAD_TOKEN_MEMO: 'gcsc:lead-token',
  JOB_POSTING_RECIPIENT: 'gcsctoken111',
  JOB_POSTING_AMOUNT: '25.0000 XPR',
  JOB_POSTING_MEMO: 'gcsc:job-posting',
  ESCROW_RECIPIENT: 'gcsctoken111',
  API_BASE,
  LEAD_TOKEN_ENDPOINT: `${API_BASE}/api/payment/lead-token`,
  JOB_POSTING_ENDPOINT: `${API_BASE}/api/payment/job-posting`,
} as const;
