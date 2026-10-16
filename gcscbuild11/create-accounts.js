/**
 * create-accounts.js
 * Creates gcscbuild11, gcscticket1, gcscbounty1 on XPR testnet
 * using gcsctoken111 as the creator/RAM payer.
 *
 * Pushes a 3-action bundle per account:
 *   eosio::newaccount + eosio::buyrambytes + eosio::delegatebw
 */

const { Api, JsSignatureProvider, JsonRpc } = require('@proton/js');
const fetch = require('cross-fetch');

// ── Config ────────────────────────────────────────────────────────────────────
const ENDPOINT   = 'https://api-xprnetwork-test.saltant.io';
const CREATOR    = 'gcsctoken111';
const CREATOR_PK = 'PVT_K1_2Po4qANUbJJqBhZfWbGpDoHFQxJvqUDuLF7WGkTTVDc9mxsH9b'; // gcsctoken111 active key

const ACCOUNTS = [
    {
        name:      'gcscbuild11',
        publicKey: 'PUB_K1_6QJznDbNagpvGhTTaMy1BxtcvRzbrjPHCyqK1uv5giXqxuuNVe',
    },
    {
        name:      'gcscticket1',
        publicKey: 'PUB_K1_697z4FXPbueNfirGJyjQDZrzZo5j5uZM2PFo9hpU484xSo9Wtm',
    },
    {
        name:      'gcscbounty1',
        publicKey: 'PUB_K1_5UjSQBFjcg9BnwWE9sbaTq1UN2hLWxV79PeJAQw9NuNmLYr4i4',
    },
];

const RAM_BYTES  = 65536;       // 64 KB per new account
const NET_SYS    = '10.0000 SYS';
const CPU_SYS    = '10.0000 SYS';

// ── RPC + API ─────────────────────────────────────────────────────────────────
const rpc = new JsonRpc(ENDPOINT, { fetch });
const sig = new JsSignatureProvider([CREATOR_PK]);
const api = new Api({ rpc, signatureProvider: sig, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

function buildPermission(pubKey) {
    return {
        threshold: 1,
        keys:      [{ key: pubKey, weight: 1 }],
        accounts:  [],
        waits:     [],
    };
}

async function accountExists(name) {
    try { await rpc.get_account(name); return true; }
    catch (_) { return false; }
}

async function createAccount({ name, publicKey }) {
    console.log(`\n→ Creating ${name} ...`);

    if (await accountExists(name)) {
        console.log(`  ✓ ${name} already exists — skipping`);
        return;
    }

    const perm = buildPermission(publicKey);

    const result = await api.transact(
        {
            actions: [
                // newaccount only — XPR testnet uses buyrambsys (wlcm.proton managed)
                {
                    account: 'eosio',
                    name:    'newaccount',
                    authorization: [{ actor: CREATOR, permission: 'active' }],
                    data: {
                        creator: CREATOR,
                        name:    name,
                        owner:   perm,
                        active:  perm,
                    },
                },
            ],
        },
        { blocksBehind: 3, expireSeconds: 30 }
    );

    console.log(`  ✓ ${name} created — tx: ${result.transaction_id}`);
}

// ── Main ─────────────────────────────────────────────────────────────────────
(async () => {
    console.log(`Creating accounts on XPR testnet via ${ENDPOINT}`);
    console.log(`Creator: ${CREATOR}\n`);

    for (const acct of ACCOUNTS) {
        try {
            await createAccount(acct);
        } catch (err) {
            console.error(`  ✗ Failed to create ${acct.name}:`, err.message || err);
        }
    }

    console.log('\nDone.');
})();
