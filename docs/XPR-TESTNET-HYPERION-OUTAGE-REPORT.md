# XPR Network Testnet — Hyperion History: Field Report on Endpoint Health & Staleness Reporting

**Date:** 2026-07-11, **substantially corrected 2026-07-15**
**Reporter:** GCSC / SmartContractor team (building on XPR testnet)
**Chain:** XPR (Proton) **testnet**, chain_id `71ee83bcf52142d61019d95f9cc5427ba6a0d7ff8accd9e2088ae2abeaf3d3dd`

---

## 0. Correction notice (2026-07-15)

**An earlier draft of this report claimed the XPR testnet Hyperion history API was "effectively unavailable" with "no healthy alternative to fail over to". That claim was wrong, and we retract it.**

On 2026-07-15 we found **`https://test.proton.eosusa.io`** healthy and fully current — its index tracks the chain head to within ~1 block, and it returns our transfers correctly. The earlier draft listed that hostname grouped together with `proton-testnet.eosusa.io` (which is genuinely dead, connection refused) in a single row marked "no Hyperion history". Conflating a dead host with a working one produced a false negative for the working one. We cannot retroactively prove whether `test.proton.eosusa.io` was also healthy on 2026-07-11; what we can state is that our conclusion was not supported by reliable evidence for that node.

**The primary cause of our multi-day verification failure was therefore on our side: our backend's node list contained only stale or dead endpoints.** That is fixed.

What remains genuinely worth the XPR team's attention is narrower, and is the substance of this report:

1. A stale Hyperion node reports itself as healthy (`/v2/health` → `OK`) while its index is weeks behind.
2. A stale node and a current node are **indistinguishable** on a normal query, which is what let a client-side misconfiguration masquerade as an infrastructure outage for days.
3. Several endpoints in community circulation are dead.

---

## 1. TL;DR for the XPR team

- `api-xprnetwork-test.saltant.io` serves `/v2/history/*` with an index **~6 weeks behind** (`last_indexed_block_time: 2026-06-04`) while its own `/v2/health` reports every service `OK`. Its Elasticsearch section simultaneously reports `total_indexed_blocks: 0` and `last_indexed_block: 1`. **A node in this state should not report itself healthy.**
- `GET /v2/history/get_transaction?id=<unknown-tx>` returns **`HTTP 200 + executed:false`** — and a node whose index is 6 weeks stale returns **exactly the same response** for a transaction that exists. The only way a client can tell "this tx does not exist" from "I cannot know" is to compare `last_indexed_block` against `lib` itself. This is a sharp edge that costs third-party teams real time.
- Several endpoints commonly passed around for testnet are dead: `proton-testnet.eosusa.io`, `testnet.rockerone.io` (502), `api.testnet.protonchain.com` (conn refused), and others (Section 3).
- `https://testnet.xprnetwork.org` is the **explorer website**, not an API node (`/v1/chain/get_info` → 404 HTML), yet it reads like an API base URL and is easy to misconfigure.

**Ask:** an authoritative, health-checked public endpoint list for testnet that separates **chain API** (`/v1/chain/*`) from **Hyperion history** (`/v2/history/*`), with a visible index-lag indicator — plus a `/v2/health` that turns non-`OK` when the index falls behind.

---

## 2. What we were building

- Mobile app (React Native / Expo, `@proton/react-native-sdk`) where a contractor buys a "lead token" for **50.0000 XPR**.
- Payment is a standard `eosio.token::transfer` from the user's WebAuth account to our contract account `gcsctoken111`.
- Backend (Node) then **independently verifies** the transfer on-chain before granting the lead, via Hyperion `/v2/history/get_transaction?id=<txid>`, checking recipient / amount / memo / sender.

This is a common pattern: the client claims "I paid, here is the tx hash", and the server verifies against chain history. It depends on a working — and *current* — history index.

## 3. Endpoint survey

Re-verified **2026-07-15** unless noted.

| Endpoint | `/v1/chain/*` | `/v2/history/*` | Notes |
|---|---|---|---|
| `test.proton.eosusa.io` | ✅ 200 | ✅ **200, current** | Index ~1 block behind head. **Healthy.** Missed by our 2026-07-11 survey. |
| `api-xprnetwork-test.saltant.io` | ✅ 200 | ⚠️ 200 but **~6 weeks stale** | `last_indexed_block_time: 2026-06-04`; `/v2/health` still reports `OK` |
| `testnet-api.alvosec.com` | ✅ 200 | ❌ `404 Unknown Endpoint` | chain-only, no Hyperion (expected, not a fault) |
| `tn1.protonnz.com` | ⚠️ `get_info` OK, `get_abi` **502 HTML** | ❌ | half-broken chain node (2026-07-11) |
| `testnet.xprnetwork.org` | ❌ 404 HTML | ❌ | explorer site, not an API node |
| `proton-testnet.eosusa.io` | ❌ conn refused | ❌ | dead |
| `testnet.rockerone.io` | — | ❌ 502 | down (2026-07-11) |
| `api.testnet.protonchain.com` | — | ❌ conn refused | down (2026-07-11) |
| `testnet-api.xprdata.org`, `testnet-api.xprcore.com` | — | ❌ 404 | no Hyperion |
| `testnet.protonkiwi.com`, `api-testnet.protonnz.com`, `proton-testnet.eosiomadrid.io`, `api.protontest.alcor.exchange`, `testnet.brotonbp.com`, `hyperion-testnet.xprnetwork.org`, `testnet.proton.cryptolions.io`, `protontestnet.greymass.com`, `proton-testnet-hyperion.blokcrafters.io` | — | ❌ down / no Hyperion | not usable (2026-07-11) |

**Conclusion:** a healthy public testnet Hyperion node **does exist** (`test.proton.eosusa.io`). The practical problem is that finding it is guesswork, and a stale node in the list actively misleads you.

## 4. The staleness trap, concretely

Both responses below are `HTTP 200`, for the *same* unknown transaction id, captured 2026-07-15:

```jsonc
// test.proton.eosusa.io — index at head: "not found" is the truth
{ "executed": false, "lib": 395482660, "last_indexed_block": 395482996,
  "last_indexed_block_time": "2026-07-15T19:39:41.500" }

// api-xprnetwork-test.saltant.io — index 6 weeks behind: it simply cannot know
{ "executed": false, "lib": 395482660, "last_indexed_block": 388431093,
  "last_indexed_block_time": "2026-06-04T15:18:14.500" }
```

Identical status, identical `executed`, identical shape. A client that trusts `executed:false` as "the transfer did not happen" will **reject a valid payment** when it happens to hit the stale node. A client that treats it as "unknown" will **accept an unpaid claim** when it hits a healthy node. Neither is safe without manually comparing `last_indexed_block` to `lib`.

Note that `lib` is reported correctly even by the stale node (it comes from nodeos), which is what makes the comparison possible at all. We now gate on `last_indexed_block >= lib - 200`; anything less, and we treat the node's answer as non-authoritative rather than as evidence.

We would much rather Hyperion expressed this itself — e.g. a distinct status or an explicit `index_healthy` / `index_lag_blocks` field on the response — than have every dApp reinvent this heuristic.

## 5. The full debugging path (for other teams)

Everything we peeled before reaching the verification layer. Layers 1–13 were genuinely **our** bugs and are fixed; we list them because the pattern may save another team days.

1. **App can't reach backend (401 instead of 402).** App wasn't sending a valid JWT. → Fixed session handling; distinguished 401 from the expected 402 challenge.
2. **App crashed on launch in a standalone build** ("Native module is null", black screen). → AsyncStorage / New-Architecture issues, missing `babel.config.js` worklets plugin, missing crypto polyfills, reanimated-vs-worklets version mismatch. Standalone builds behaved differently from Expo Go.
3. **Expo Router "Unmatched Route"** on wallet deeplink return. → Added an `app/webauth-callback.tsx` route.
4. **WebAuth showed "Unknown Requestor".** → Added ESR `req_account` metadata.
5. **`esr://` deeplink not handled.** XPR WebAuth registers `proton-dev://` (testnet) / `proton://`, not `esr://`. → Switched schemes.
6. **"Need zlib to compress"** encoding ESR in React Native. → Encoded uncompressed.
7. **Wallet opened but signature never returned** (`WebAuth callback timeout`). `adb logcat` showed WebAuth returning to a **bare** `smartcontractor://webauth-callback` with no `?sa/?sp` params. → **The direct-ESR deeplink cannot receive the signing result; it arrives over the Proton Link channel.** Made `@proton/react-native-sdk` (Proton Link) the only path for connect and transfer.
8. **`JSON Parse error: Unexpected character: <`** during Proton Link connect/transact. The SDK was hitting `https://testnet.xprnetwork.org`, which is the **explorer site, not an API node** (returns HTML). → Switched to real chain API nodes.
9. **Login worked but transfer still failed with `JSON Parse <`.** Login makes no chain calls; transfer needs `get_abi` + `push_transaction`. `tn1.protonnz.com` served `get_info` but **502'd on `get_abi`**. → Switched nodes, added failover.
10. **App looped back to "Connect wallet" instead of reaching payment.** Backend stored the wallet under `wallet.accountName`; the app read `wallet.account`. → Normalized.
11. **"No saved Proton Link session" on transfer.** SDK login sessions are in-memory and lost across restarts. → Fall back to a fresh login before signing.
12. **WebAuth "ping-pong"** — wallet flashed open/closed during transfer. Our `webauth-callback` route navigated away from the in-flight payment screen, unmounting the transaction. → Return to the previous screen instead.
13. **`assertion failure: token does not exist`** — the transfer reached the chain and **our own contract reverted it.** Our `gcsctoken111` contract's `transfer` action ran on **incoming** `eosio.token` notifications and looked up `XPR` in its own stat table. → Added `if (this.receiver != this.firstReceiver) return;` guard; redeployed.
14. **`Verification failed: 400`** on the final backend check → **our stale/dead node list** (Section 0), compounded by the staleness trap (Section 4).

## 6. What we changed on our side

- Node list now leads with a node verified healthy **by real transaction lookup**, not by `/v2/health`.
- Verification treats a node's answer as authoritative **only** when `last_indexed_block >= lib - 200`.
- An authoritative "not found" now rejects the payment (strict). "No authoritative node reachable" records the payment as *unproven*, **withholds the goods**, and a background reconciler settles it later. We no longer grant anything on an unverified hash.

## 7. Requests to the XPR Network team

1. **Make `/v2/health` reflect index lag.** A node 6 weeks behind reporting all services `OK` (with `total_indexed_blocks: 0`) is the single most misleading signal we hit.
2. **Publish an authoritative, health-checked testnet endpoint list**, separating **chain API** (`/v1/chain/*`) from **Hyperion history** (`/v2/history/*`), with a visible last-indexed-block / lag column. Prune the dead hosts in Section 3.
3. **Make staleness explicit in query responses** — e.g. an `index_healthy` / `index_lag_blocks` field, or a distinct status for "cannot answer" vs "does not exist" — so clients don't have to derive it from `last_indexed_block` vs `lib`.
4. **Consider an index-independent verification primitive** (a reliable `get_transaction` by id from a full node's trace API), so server-side verification doesn't depend solely on Hyperion.
5. **Rename or redirect `testnet.xprnetwork.org`** guidance in docs — it reads like an API base URL but is the explorer, and silently returns HTML to SDKs.

## 8. Evidence / reproduction

- Recipient contract account: **`gcsctoken111`** — https://testnet.explorer.xprnetwork.org/account/gcsctoken111
- Sender test account: **`ownerstest15`** — https://testnet.explorer.xprnetwork.org/account/ownerstest15
- Reference transfer, **2026-07-15T19:27:15**, tx `73db5534d18b8f152a606a1c8da52ceac35bf6349224c1c1759b67f647f65f0a`: `ownerstest15 → gcsctoken111`, `50.0000 XPR`, memo `gcsc:lead-token`.
  - `test.proton.eosusa.io/v2/history/get_transaction` → `executed: true`, full action data.
  - `api-xprnetwork-test.saltant.io/v2/history/get_transaction` → `executed: false`, `last_indexed_block_time: 2026-06-04` (same tx, stale index).

---

*Prepared by the GCSC / SmartContractor team. Section 0 documents where our own earlier analysis was wrong; we would rather correct the record than have the XPR team chase an outage that wasn't one. Happy to provide request/response captures and device logs on request.*
