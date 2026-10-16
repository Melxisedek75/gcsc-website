import assert from 'node:assert/strict';
import test from 'node:test';

import {
  describeWalletAuthError,
  runWalletAuthFlow,
  WalletAuthFlowError,
  type WalletAuthChallenge,
  type WalletAuthFlowDependencies,
  type WalletAuthProof,
} from './wallet-auth-flow';

interface TestUser {
  id: number;
  role: 'homeowner';
}

const challenge: WalletAuthChallenge = {
  requestId: '11111111-1111-4111-8111-111111111111',
  message: 'GCSC SmartContractor wallet login',
  chainId: '71ee83bcf52142d61019d95f9cc5427ba6a0d7ff8accd9e2088ae2abeaf3d3dd',
  accountName: 'walletuser11',
  permission: 'active',
  expiresAt: 1_800_000_000_000,
};

const proof: WalletAuthProof = {
  accountName: challenge.accountName,
  permission: challenge.permission,
  chainId: challenge.chainId,
  serializedTransaction: '00',
  signatures: ['SIG_K1_test'],
  publicKey: 'PUB_K1_test',
};

function dependencies(overrides: Partial<WalletAuthFlowDependencies<TestUser>> = {}) {
  const calls: string[] = [];
  const deps: WalletAuthFlowDependencies<TestUser> = {
    connectWallet: async () => {
      calls.push('connect');
      return { account: challenge.accountName, permission: challenge.permission, publicKey: proof.publicKey };
    },
    requestChallenge: async (accountName, permission) => {
      calls.push(`challenge:${accountName}@${permission}`);
      return challenge;
    },
    signChallenge: async (received) => {
      calls.push(`sign:${received.requestId}`);
      return proof;
    },
    verifyEvidence: async (requestId, received) => {
      calls.push(`verify:${requestId}:${received.accountName}`);
      return { token: 'app-jwt', user: { id: 92, role: 'homeowner' } };
    },
    commitWalletSession: async (wallet) => {
      calls.push(`wallet:commit:${wallet.account}@${wallet.permission}`);
    },
    rollbackWalletSession: async () => {
      calls.push('wallet:rollback');
    },
    persistSession: async (token, user) => {
      calls.push(`persist:${token}:${user.id}`);
    },
    ...overrides,
  };
  return { calls, deps };
}

test('connects wallet, requests its challenge, signs, verifies, then stores session', async () => {
  const { calls, deps } = dependencies();

  const user = await runWalletAuthFlow(deps);

  assert.deepEqual(user, { id: 92, role: 'homeowner' });
  assert.deepEqual(calls, [
    'connect',
    `challenge:${challenge.accountName}@${challenge.permission}`,
    `sign:${challenge.requestId}`,
    `verify:${challenge.requestId}:${challenge.accountName}`,
    `wallet:commit:${challenge.accountName}@${challenge.permission}`,
    'persist:app-jwt:92',
  ]);
});

test('does not verify or persist when WebAuth is cancelled', async () => {
  const { calls, deps } = dependencies({
    connectWallet: async () => {
      calls.push('connect');
      throw new Error('User cancelled in WebAuth');
    },
  });

  await assert.rejects(runWalletAuthFlow(deps), /cancelled/i);
  assert.deepEqual(calls, ['connect', 'wallet:rollback']);
});

test('does not persist when backend verification fails', async () => {
  const { calls, deps } = dependencies({
    verifyEvidence: async () => {
      calls.push('verify');
      throw new Error('Wallet proof verification failed');
    },
  });

  await assert.rejects(runWalletAuthFlow(deps), /verification failed/i);
  assert.equal(calls.includes('persist:app-jwt:92'), false);
  assert.equal(calls.some((call) => call.startsWith('wallet:commit:')), false);
  assert.equal(calls.at(-1), 'wallet:rollback');
});

test('identifies a backend challenge outage instead of reporting a wallet connection failure', async () => {
  const { calls, deps } = dependencies({
    requestChallenge: async () => {
      calls.push('challenge');
      throw new TypeError('Network request failed: token=SECRET');
    },
  });

  await assert.rejects(
    runWalletAuthFlow(deps),
    (error: unknown) => error instanceof WalletAuthFlowError && error.stage === 'challenge',
  );
  assert.deepEqual(calls, ['connect', 'challenge', 'wallet:rollback']);
});

test('rejects when the signing session switches to another account', async () => {
  const { calls, deps } = dependencies({
    signChallenge: async () => {
      calls.push('sign');
      return { ...proof, accountName: 'otherwallet1' };
    },
  });

  await assert.rejects(runWalletAuthFlow(deps), /account changed/i);
  assert.equal(calls.some((call) => call.startsWith('verify:')), false);
  assert.equal(calls.some((call) => call.startsWith('persist:')), false);
  assert.equal(calls.at(-1), 'wallet:rollback');
});

test('maps cancellation, timeout, mismatch, replay, and outage to safe messages', () => {
  assert.equal(
    describeWalletAuthError(new Error('User cancelled in WebAuth')),
    'WebAuth authorization was cancelled.',
  );
  assert.equal(
    describeWalletAuthError(new Error('WebAuth callback timeout')),
    'WebAuth did not return in time. Try again.',
  );
  assert.equal(
    describeWalletAuthError(new Error('WebAuth account changed during challenge signing')),
    'WebAuth account or network changed. Try again.',
  );
  assert.equal(
    describeWalletAuthError(new Error('Got response for wrong chain id')),
    'WebAuth account or network changed. Try again.',
  );
  assert.equal(
    describeWalletAuthError({ code: 'challenge_not_found', message: 'nonce:SECRET' }),
    'This login request expired. Try again.',
  );
  assert.equal(
    describeWalletAuthError(new WalletAuthFlowError('challenge', new TypeError('Network request failed: token=SECRET'))),
    'SmartContractor server could not be reached while requesting your wallet challenge. Check your connection and try again.',
  );
});

test('never echoes unknown proof details to the sign-in screen', () => {
  const message = describeWalletAuthError({
    code: 'bad_signature',
    message: 'SIG_K1_secret serializedTransaction=deadbeef jwt=secret',
  });

  assert.equal(message, 'WebAuth sign-in failed. Try again.');
  assert.doesNotMatch(message, /SIG_|serializedTransaction|jwt|secret/i);
});
