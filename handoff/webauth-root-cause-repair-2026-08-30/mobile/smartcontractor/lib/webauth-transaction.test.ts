import assert from 'node:assert/strict';
import test from 'node:test';

import { submitXprTransfer } from './webauth-transaction';

test('submits the payment through the authenticated session', async () => {
  const calls: unknown[][] = [];
  const session = {
    transact: async (...args: unknown[]) => {
      calls.push(args);
      return { transaction: { id: { toString: () => 'a'.repeat(64) } } };
    },
  };

  const result = await submitXprTransfer(session, {
    account: 'walletuser11',
    permission: 'active',
    recipient: 'gcsctoken111',
    amount: '50.0000 XPR',
    memo: 'gcsc:lead-token',
  });

  assert.equal(result.transaction.id.toString(), 'a'.repeat(64));
  assert.deepEqual(calls, [[
    {
      actions: [{
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{ actor: 'walletuser11', permission: 'active' }],
        data: {
          from: 'walletuser11',
          to: 'gcsctoken111',
          quantity: '50.0000 XPR',
          memo: 'gcsc:lead-token',
        },
      }],
    },
    { broadcast: true },
  ]]);
});
