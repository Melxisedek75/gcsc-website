import assert from 'node:assert/strict';
import test from 'node:test';

import { createLocalWalletAuthTestServer } from './local-wallet-auth-test-server.mjs';

test('issues a local-only XPR testnet challenge without creating a session', async (t) => {
  const service = await createLocalWalletAuthTestServer({ port: 0 });
  t.after(() => service.close());

  const response = await fetch(`${service.url}/api/auth/wallet/challenge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accountName: 'walletuser11', permission: 'active' }),
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.accountName, 'walletuser11');
  assert.equal(body.permission, 'active');
  assert.match(body.message, /^LOCAL-ONLY TEST:/);
  assert.equal('token' in body, false);
});

test('refuses verification so a local test cannot become an authenticated user', async (t) => {
  const service = await createLocalWalletAuthTestServer({ port: 0 });
  t.after(() => service.close());

  const response = await fetch(`${service.url}/api/auth/wallet/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  });
  const body = await response.json();

  assert.equal(response.status, 501);
  assert.equal(body.code, 'local_verification_disabled');
  assert.equal('token' in body, false);
});
