# XPR Network Testnet — Hyperion History Infrastructure Outage: Field Report

**Date:** 2026-07-11
**Reporter:** GCSC / SmartContractor team (building on XPR testnet)
**Severity:** High for third-party developers — silently breaks any dApp that verifies transactions via Hyperion history.
**Chain:** XPR (Proton) **testnet**, chain_id `71ee83bcf52142d61019d95f9cc5427ba6a0d7ff8accd9e2088ae2abeaf3d3dd`

---

## 1. TL;DR

A production-style payment flow (mobile app → WebAuth wallet → `eosio.token::transfer` → smart contract → backend verification) failed at the **final verification step** for ~5–7 days. Every layer was suspected and ruled out. The actual root cause was **on the testnet infrastructure side, not in our code**:

> **The XPR testnet Hyperion history API is effectively unavailable. The only public node that still exposes `/v2/history/*` returns data that is over one month stale; every other endpoint we could find either lacks the Hyperion history API entirely (`404 Unknown Endpoint`) or is down (`502` / connection refused).**

Because the transfer *did* succeed on-chain but could not be found in any history index, our backend's `/v2/history/get_transaction` verification always returned "not found" → the payment was rejected with HTTP 400 even though the funds had already moved.

We ask the XPR team to (a) restore a reliable, current public testnet Hyperion node, (b) publish an authoritative, health-monitored list of testnet endpoints separating **chain API** from **Hyperion history API**, and (c) warn third-party developers that testnet history indexing is currently unreliable so they don't lose days chasing a phantom bug in their own code.

---

## 2. What we were building

- Mobile app (React Native / Expo, `@proton/react-native-sdk`) that lets a contractor buy a "lead token" for **50.0000 XPR**.
- Payment is a standard `eosio.token::transfer` from the user's WebAuth account to our contract account `gcsctoken111`.
- Backend (Node) then **independently verifies** the transfer on-chain before granting the lead, using Hyperion `/v2/history/get_transaction?id=<txid>` and checking recipient / amount / memo / sender.

This is a very common pattern: **the client claims "I paid, here is the tx hash", and the server verifies it against chain history.** It depends entirely on a working history index.

## 3. The symptom

On the device, the payment progressed through:

`Contact endpoint → Sign in WebAuth → Broadcast transfer → Verify on Hyperion → Confirmed`

…and always died at **"Verify on Hyperion"** with **`Verification failed: 400`** — *after* the wallet had signed and broadcast the transaction. On-chain balances proved the transfer had actually happened (sender balance dropped 50 XPR each attempt), yet verification failed every time.

## 4. The full debugging path (every layer we peeled, in order)

This is the honest, complete list of everything we investigated before finding the real cause. We share it so other teams can recognize the pattern faster.

1. **App can't reach backend (401 instead of 402).** The app wasn't sending a valid JWT. → Fixed session handling; distinguished 401 from the expected 402 challenge.
2. **App crashed on launch in a standalone build** ("Native module is null", black screen). → AsyncStorage / New-Architecture issues, missing `babel.config.js` with the worklets plugin, missing crypto polyfills, wrong dependency versions (reanimated vs worklets). Standalone builds behaved differently from Expo Go.
3. **Expo Router "Unmatched Route"** when the wallet returned via deeplink. → Added an `app/webauth-callback.tsx` route.
4. **WebAuth showed "Unknown Requestor".** → Added ESR `req_account` metadata so it renders as our dApp.
5. **`esr://` deeplink not handled** ("No Activity found to handle Intent"). → XPR WebAuth registers `proton-dev://` (testnet) / `proton://`, not `esr://`. Switched schemes.
6. **"Need zlib to compress"** encoding ESR in React Native. → Encoded uncompressed.
7. **Wallet opened but signature never came back** (`WebAuth callback timeout`). Device logs (adb logcat) showed WebAuth returning to a **bare** `smartcontractor://webauth-callback` (no `?sa/?sp` params). Conclusion: **the direct-ESR deeplink cannot receive the signing result from XPR WebAuth — the result is delivered over the Proton Link channel, not the deeplink.** So we made **`@proton/react-native-sdk` (Proton Link) the only path** for connect and transfer.
8. **`JSON Parse error: Unexpected character: <` during Proton Link connect/transact.** The SDK was hitting a "chain API" endpoint that returned an **HTML error page** instead of JSON. → The endpoint we had (`https://testnet.xprnetwork.org`) is the **explorer website, not an API node** (`/v1/chain/get_info` → `404` HTML). Switched to real chain API nodes.
9. **Login worked but transfer still `JSON Parse <`.** Because login makes no chain calls, but transfer needs `get_abi` + `push_transaction`. The node we picked (`tn1.protonnz.com`) served `get_info` fine but **`502`'d on `get_abi`**. → Switched to healthier nodes with failover.
10. **App kept looping back to "Connect wallet" instead of reaching payment.** Backend stores the wallet under `wallet.accountName`; the app read `wallet.account`. Field-name mismatch. → Normalized.
11. **"No saved Proton Link session" on transfer.** SDK login sessions are in-memory and lost across app restarts; restore failed. → Fall back to a fresh login before signing.
12. **WebAuth "ping-pong"** — the wallet flashed open and closed repeatedly during transfer. Our `webauth-callback` route navigated away from the in-flight payment screen every time the wallet returned focus, unmounting the transaction. → Return to the previous screen instead of navigating away.
13. **`assertion failure: token does not exist`** — the transfer reached the chain and **our own contract reverted it.** Our `gcsctoken111` contract's `transfer` action ran on **incoming** `eosio.token` notifications and looked up `XPR` in its own stat table (which only holds our token), asserting "token does not exist". → Added `if (this.receiver != this.firstReceiver) return;` guard; redeployed.
14. **`Verification failed: 400`** on the final backend check — **the actual, last root cause (Section 5).**

Layers 1–13 were genuinely our bugs and are fixed. Layer 14 was not our bug.

## 5. Root cause (the part that is on the testnet side)

Our backend verifies via `GET {node}/v2/history/get_transaction?id=<txid>`. It also has a multi-node list to fail over. We tested every XPR testnet endpoint we could find on 2026-07-11:

| Endpoint | `/v1/chain/*` (chain API) | `/v2/history/*` (Hyperion) | Notes |
|---|---|---|---|
| `api-xprnetwork-test.saltant.io` | ✅ 200 JSON | ⚠️ 200 JSON but **STALE** | `last_indexed_block_time: 2026-06-04T15:18:14` — **over a month behind**; `get_actions` for active accounts returns `total: 0` |
| `testnet-api.alvosec.com` | ✅ 200 JSON | ❌ `404 Unknown Endpoint` | chain-only, no Hyperion |
| `tn1.protonnz.com` | ⚠️ `get_info` OK, `get_abi` **502 HTML** | ❌ | half-broken chain node |
| `testnet.xprnetwork.org` | ❌ `404` HTML (explorer site) | ❌ | not an API node at all |
| `testnet.rockerone.io` | — | ❌ `502` | down |
| `api.testnet.protonchain.com` | — | ❌ conn refused | down |
| `proton-testnet.eosusa.io` / `test.proton.eosusa.io` | mixed | ❌ `404`/no data | no Hyperion history |
| `testnet.protonkiwi.com`, `api-testnet.protonnz.com`, `proton-testnet.eosiomadrid.io`, `api.protontest.alcor.exchange`, `testnet.brotonbp.com`, `hyperion-testnet.xprnetwork.org`, `testnet.proton.cryptolions.io`, `protontestnet.greymass.com`, `proton-testnet-hyperion.blokcrafters.io` | — | ❌ down / no Hyperion | none usable |

### Honest answer to "is there only one node, or others we could fail over to?"

**There is effectively only one public XPR testnet node still exposing the Hyperion history API — `api-xprnetwork-test.saltant.io` — and it is stuck ~1 month in the past.** Every other endpoint we found either does not run Hyperion (`/v2/history` → `404 Unknown Endpoint`) or is offline. **There is no healthy alternative to automatically fail over to.** Automatic multi-node failover (which we implemented) does not help when *no* node has a current index.

So a transfer that succeeds on-chain is **invisible** to `get_transaction`, and any server that verifies via Hyperion will (correctly, from its point of view) reject the payment.

### Our workaround (client/server side)

Since the transfer is provably on-chain (balances change) but un-indexable, our backend now:
- Tries Hyperion with a short retry.
- If **no node can find the tx** (unavailable/stale, not a definitive mismatch), it **accepts the payment as `pending`** (HTTP 200) and lets a background verifier reconcile later, instead of hard-failing with 400.
- **Definitive mismatches** (tx found but wrong recipient/amount/sender) still return 400.

This unblocked us, but it is a **degradation forced by broken testnet infrastructure**, not a design we would choose. On mainnet, or on a healthy testnet, we would keep strict synchronous verification.

## 6. Impact on third-party developers

Any team building on XPR testnet that follows the standard "verify the transfer server-side via Hyperion" pattern — payments, faucets, on-chain proof, indexers, analytics, "did this action happen?" checks — will hit this. The failure is **silent and misleading**: the transaction succeeds, the wallet signs, funds move, and only the *verification* fails, so developers naturally suspect their own signing/encoding/endpoint code (as we did for days) instead of the history index.

## 7. Requests to the XPR Network team

1. **Restore at least one reliable, current public testnet Hyperion node** and keep it monitored. Ideally 2–3 for redundancy.
2. **Publish an authoritative, health-checked endpoint list** for testnet that clearly separates:
   - **Chain API** nodes (`/v1/chain/*`), and
   - **Hyperion history API** nodes (`/v2/history/*`),
   with a live "last indexed block time" / lag indicator so developers can see staleness at a glance.
3. **Add a status banner / known-issue notice** in the XPR docs and developer channels when testnet indexing is degraded, so builders don't burn days debugging a non-existent bug in their own code.
4. **Guidance for dApp authors:** document that testnet history can lag, and recommend a graceful-degradation / async-reconciliation pattern for transaction verification (like the `pending` approach above) so a stale index does not break user flows.
5. Consider a lightweight, index-independent verification primitive (e.g. a reliable `get_transaction` by id served directly from a full node's trace API) so verification doesn't depend solely on Hyperion availability.

## 8. Evidence / reproduction

- Recipient contract account: **`gcsctoken111`** — https://testnet.explorer.xprnetwork.org/account/gcsctoken111
- Sender test account: **`ownerstest15`** — https://testnet.explorer.xprnetwork.org/account/ownerstest15
- Balances on 2026-07-11 confirm multiple successful `50.0000 XPR` transfers (sender dropped from `500` → `250 XPR`; recipient rose accordingly) — i.e. transfers succeed on-chain.
- The exact same transfers are **not returned** by `api-xprnetwork-test.saltant.io/v2/history/get_transaction` (node stale at block-time `2026-06-04`), and every other node lacks the `/v2/history` endpoint.

---

*Prepared by the GCSC / SmartContractor team. Happy to provide specific tx hashes, request/response captures, and device logs on request.*
