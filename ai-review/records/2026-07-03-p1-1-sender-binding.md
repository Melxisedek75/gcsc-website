# AI Review Record

- Change ID: 2026-07-03-p1-1-sender-binding
- Repository: gcsc-smart-contractor
- Branch: fix/p1-1-sender-binding
- Base commit: d62cfd035cd4b6726ed451ea80c12dd45e6715e4
- Head commit: ca598a2442af43353db5975d5331c904b53d7ae2
- Author AI: CLAUDE
- Reviewer AI: CODEX
- Author status: READY_FOR_REVIEW
- Reviewer decision: CHANGES_REQUESTED
- Required checks: FAIL
- Unresolved P0/P1 findings: 1
- Live-risk decision: BLOCKED
- Founder evidence: PENDING
- Deploy decision: BLOCKED

## Scope

Проверить P1-1 sender binding, P1-2 сохранение и подтверждение wallet binding и P1-5 запрет ложного verified-состояния после регистрации.

## Changed Files

- `v3/pure-server.js`

## Verification

| Check | Command | Result | Evidence |
|---|---|---|---|
| Static server check | `node --check v3/pure-server.js` | PASS | Fresh reviewer run, exit 0 |
| Focused payment regression | `npx jest tests/payments-402.test.js --runInBand --detectOpenHandles` from `v3` | FAIL | 5 failed, 9 passed, 14 total; happy/replay/bad amount/bad recipient/job publication paths return `409 wallet_required` because fixtures were not updated |
| Sender verifier inspection | Inspect `verifyHyperionTransfer` and both payment routes | PASS | `expectedFrom`, `wallet_required` and `bad_sender` are present |
| PostgreSQL profile persistence | Inspect `updateStoredProfile()` | FAIL | `v3/pure-server.js:630` updates profile/full_name/phone but omits `wallet` |
| PostgreSQL registration verification | Inspect `createStoredUser()` | FAIL | `v3/pure-server.js:560` hardcodes `is_verified=TRUE` and ignores route input `is_verified: 0` |
| Wallet ownership proof | Inspect profile and `/api/wallet/connect` paths | FAIL | Client-supplied account is trusted without nonce/challenge and verified WebAuth signature |

## Findings

| Severity | Finding | Owner | Status |
|---|---|---|---|
| P1 | Focused payment regression suite is red: 5/14 tests fail after the new wallet requirement. Update fixtures and add explicit `wallet_required`, `expectedFrom`, and `bad_sender` coverage. | CLAUDE | OPEN |
| P1 | PostgreSQL `updateStoredProfile()` drops wallet changes accepted by `updateProfileFromBody()`. Persist the wallet column atomically with the profile update and test it against PostgreSQL. | CLAUDE | OPEN |
| P1 | PostgreSQL `createStoredUser()` hardcodes `TRUE` for `is_verified`, so P1-5 remains broken whenever `USE_POSTGRES=true`. Bind SQL to `input.is_verified` and add regression coverage. | CLAUDE | OPEN |
| P1 | Both profile wallet input and `/api/wallet/connect` accept an account name without ownership proof. Add a nonce/challenge plus verified WebAuth/XPR signature before treating the wallet as bound. | CLAUDE | OPEN |

## Resolution Log

- Sender comparison itself is present and technically useful, but the complete P1-1/P1-2/P1-5 branch contract is not green or persistence-safe.
- No merge, Railway deploy, mainnet action or payment activation was performed.

## Reviewer Notes

- Reviewer independently inspected the diff: YES
- Reviewer independently ran required checks: YES
- Public/live/legal/payment boundary reviewed: YES
- Final rationale: required regression tests fail and two PostgreSQL paths contradict the intended behavior; wallet ownership remains unproven.

## Sign-off

- Reviewer decision: CHANGES_REQUESTED
- Required checks: FAIL
- Unresolved P0/P1 findings: 4
- Live-risk decision: BLOCKED
- Founder evidence: PENDING
- Deploy decision: BLOCKED

## Re-Review (CODEX, 2026-07-04, head `ca598a2`)

- Reviewer independently inspected the new diff: YES.
- Reviewer independently ran required checks: YES.
- `node --check` for server, payment tests and PostgreSQL storage smoke: PASS.
- PostgreSQL storage smoke: PASS.
- PostgreSQL workflow smoke: first run failed to start its local server under load; isolated retry PASS.
- Code inspection confirms `updateStoredProfile()` persists `wallet` and `createStoredUser()` respects `input.is_verified` / `input.is_active`.
- Code inspection confirms nonce/challenge, K1 recovery, optional supplied-key comparison, on-chain authorization gate, and `verified:false` for profile-only wallet metadata.
- Wallet ownership group with `--testTimeout=60000`: PASS, 6/6.

### Remaining Required Change

**P1:** the required command `npx jest tests/payments-402.test.js --runInBand --detectOpenHandles` is not stable on a cold/slower Windows runner. Fresh run: 19/23 with three 5-second timeout failures plus one connection reset. A repeat with `--testTimeout=60000` reached 22/23, and the isolated wallet group passed 6/6; one ownership test took 5.143 seconds, already beyond Jest's default timeout. Add an explicit timeout for the expensive K1 wallet-ownership tests (or reduce their cost), then rerun the exact required command until it passes 23/23 without extra CLI timeout.

### Current Sign-off

- Reviewer decision: CHANGES_REQUESTED
- Required checks: FAIL
- Unresolved P0/P1 findings: 1
- Live-risk decision: BLOCKED
- Founder evidence: PENDING
- Deploy decision: BLOCKED
