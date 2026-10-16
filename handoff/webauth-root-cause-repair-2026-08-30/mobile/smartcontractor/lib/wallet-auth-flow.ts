export interface WalletAuthChallenge {
  requestId: string;
  message: string;
  chainId: string;
  accountName: string;
  permission: string;
  expiresAt: number;
}

export interface WalletAuthProof {
  accountName: string;
  permission: string;
  chainId: string;
  serializedTransaction: string;
  signatures: string[];
  publicKey?: string;
}

export interface WalletSelection {
  account: string;
  permission: string;
  publicKey?: string;
}

export interface WalletAuthVerification<User> {
  token: string;
  user: User;
}

export type WalletAuthStage = 'wallet' | 'challenge' | 'proof' | 'verify' | 'session';

export class WalletAuthFlowError extends Error {
  readonly stage: WalletAuthStage;
  readonly cause: unknown;

  constructor(stage: WalletAuthStage, cause: unknown) {
    super(cause instanceof Error ? cause.message : `Wallet authorization failed during ${stage}`);
    this.name = 'WalletAuthFlowError';
    this.stage = stage;
    this.cause = cause;
  }
}

export interface WalletAuthFlowDependencies<User> {
  connectWallet(): Promise<WalletSelection>;
  requestChallenge(accountName: string, permission: string): Promise<WalletAuthChallenge>;
  signChallenge(challenge: WalletAuthChallenge): Promise<WalletAuthProof>;
  verifyEvidence(
    requestId: string,
    proof: WalletAuthProof,
  ): Promise<WalletAuthVerification<User>>;
  commitWalletSession(wallet: WalletSelection): Promise<void>;
  rollbackWalletSession(): Promise<void>;
  persistSession(token: string, user: User): Promise<void>;
}

function requireSame(label: string, expected: string, actual: string): void {
  if (actual !== expected) {
    throw new Error(`WebAuth ${label} changed during wallet authorization`);
  }
}

export function describeWalletAuthError(error: unknown): string {
  const wrapped = error instanceof WalletAuthFlowError ? error.cause : error;
  const record = wrapped && typeof wrapped === 'object'
    ? wrapped as { code?: unknown; message?: unknown }
    : {};
  const code = typeof record.code === 'string' ? record.code.toLowerCase() : '';
  const message = typeof record.message === 'string'
    ? record.message.toLowerCase()
    : String(wrapped || '').toLowerCase();

  if (/cancel/.test(message)) {
    return 'WebAuth authorization was cancelled.';
  }
  if (/timeout|timed out/.test(message)) {
    return 'WebAuth did not return in time. Try again.';
  }
  if (wrapped instanceof TypeError || /network request|fetch failed|backend unavailable/.test(message)) {
    if (error instanceof WalletAuthFlowError && error.stage === 'challenge') {
      return 'SmartContractor server could not be reached while requesting your wallet challenge. Check your connection and try again.';
    }
    return 'SmartContractor is unavailable. Try again.';
  }
  if (/account|permission|network|wrong_chain|wrong chain|chain id/.test(`${code} ${message}`)) {
    return 'WebAuth account or network changed. Try again.';
  }
  if (['challenge_not_found', 'challenge_expired', 'challenge_mismatch'].includes(code)) {
    return 'This login request expired. Try again.';
  }
  return 'WebAuth sign-in failed. Try again.';
}

export async function runWalletAuthFlow<User>(
  dependencies: WalletAuthFlowDependencies<User>,
): Promise<User> {
  let stage: WalletAuthStage = 'wallet';
  try {
    const wallet = await dependencies.connectWallet();
    stage = 'challenge';
    const challenge = await dependencies.requestChallenge(wallet.account, wallet.permission);

    requireSame('account', wallet.account, challenge.accountName);
    requireSame('permission', wallet.permission, challenge.permission);

    stage = 'proof';
    const proof = await dependencies.signChallenge(challenge);
    requireSame('account', challenge.accountName, proof.accountName);
    requireSame('permission', challenge.permission, proof.permission);
    requireSame('network', challenge.chainId, proof.chainId);

    stage = 'verify';
    const verified = await dependencies.verifyEvidence(challenge.requestId, proof);
    stage = 'session';
    await dependencies.commitWalletSession(wallet);
    await dependencies.persistSession(verified.token, verified.user);
    return verified.user;
  } catch (error) {
    try {
      await dependencies.rollbackWalletSession();
    } catch {
      // Cleanup is best effort and must not replace the original login error.
    }
    if (error instanceof WalletAuthFlowError) throw error;
    throw new WalletAuthFlowError(stage, error);
  }
}
