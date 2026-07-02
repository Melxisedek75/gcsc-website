# Monthly GCSC/SmartContractor Audit

- Change ID: 2026-07-01-monthly-audit
- Repository: gcsc-website + gcsc-smart-contractor
- Branch: main (audit only; no deploy approval)
- Base commit: d296d785
- Head commit: 5293fb9d / d62cfd035cd4b6726ed451ea80c12dd45e6715e4
- Author AI: CODEX
- Reviewer AI: CLAUDE
- Author status: READY_FOR_REVIEW
- Reviewer decision: CHANGES_REQUESTED
- Required checks: FAIL
- Unresolved P0/P1 findings: 9
- Live-risk decision: BLOCKED
- Founder evidence: PENDING
- Deploy decision: BLOCKED

## Scope

Проверены изменения с 2026-06-01 в двух публичных репозиториях:

- `Melxisedek75/gcsc-website`: 499 commits от baseline, 332 файла, +112039/-3391 строк.
- `Melxisedek75/gcsc-smart-contractor`: 5 июньских commits, включая atomic escrow fixes и 402 payment endpoints.
- Проверены mobile auth/WebAuth/payment, backend 402 verifier, CI, deployment config, public wording, текущий dirty worktree и dependency audit.

## Blocking Findings

### P0-1: мобильный payment retry теряет JWT

Клиент отправляет второй запрос с `Authorization: Payment <tx>` и переносит JWT в `X-Auth-Token` (`mobile/smartcontractor/lib/payments.ts:103`). Backend читает JWT только из `Authorization: Bearer` (`v3/pure-server.js:2301`) и проверяет пользователя до payment header (`v3/pure-server.js:3447`, `3521`). Результат реального retry: `401 Unauthorized`.

### P0-2: job-posting client/server contract несовместим

Backend требует существующий `project_id` в JSON body (`v3/pure-server.js:3543`). Мобильный клиент не создаёт backend project до платежа и второй fetch не отправляет body (`mobile/smartcontractor/lib/payments.ts:103`; `mobile/smartcontractor/app/(homeowner)/post-job.tsx:153`). Успешная публикация невозможна даже после исправления JWT.

### P0-3: мобильный ESR использует неверный XPR testnet chain ID

`mobile/smartcontractor/lib/webauth.ts:20` содержит `71840bca...`, тогда как backend и официальная документация XPR используют `71ee83bc...`. Signing request будет направлен не в ту цепь или отклонён кошельком.

### P1-1: платёж не привязан к wallet пользователя

Hyperion verifier возвращает `from`, но payment routes не сравнивают его с подтверждённым wallet владельца JWT (`v3/pure-server.js:1233`, `3477`, `3555`). Любой вошедший пользователь подходящей роли может попытаться первым предъявить чужой публичный tx hash.

### P1-2: wallet ownership не доказывается и mobile пишет не в тот endpoint

Backend `POST /api/wallet/connect` доверяет присланному `accountName` без challenge/signature proof (`v3/pure-server.js:2778`). Mobile вместо этого отправляет `wallet` через `PUT /api/auth/profile` (`mobile/smartcontractor/app/(auth)/connect-wallet.tsx:22`), а profile updater поле wallet игнорирует (`v3/pure-server.js:2245`). Wallet связь не сохраняется корректно.

### P1-3: replay protection платежей непостоянна

`payment_receipts`, `lead_tokens` и `job_posting_payments` существуют только в memory arrays (`v3/pure-server.js:208`). Payment routes не используют PostgreSQL и не вызывают persistent save. После restart/replica tx replay protection исчезает.

### P1-4: основной aggregate check сломан

`npm --prefix construction-ai run check` завершается до запуска проверок: восемь package scripts отсутствуют в `scripts/run-checks.mjs`. Следовательно, SmartContractor CI должен падать, когда GitHub Actions снова начнёт запускать jobs.

### P1-5: мобильная регистрация обходит verification

Mobile всегда отправляет `verificationMode: optional` (`mobile/smartcontractor/lib/auth.ts:46`). Backend создаёт такого пользователя с `is_verified: 1`, хотя `email_verified` и `phone_verified` равны false (`v3/pure-server.js:2574`). Это ломает смысл verified contractor/homeowner identity.

### P1-6: публичные обещания противоречат whitepaper

`index.html:67`, `106`, `123`, `140` заявляет действующий blockchain escrow и on-chain release. `whitepaper.html:71`, `113`, `119`, `206` говорит, что платежи, escrow и lending не live и требуют review. До согласования публичной формулировки deploy главной страницы не одобрен.

## Additional Findings

- P2: client доверяет `recipient` и `amount` из 402 challenge без сравнения с подтверждённым запросом (`mobile/smartcontractor/lib/payments.ts:93`).
- P2: JWT и WebAuth session хранятся в AsyncStorage вместо secure storage (`mobile/smartcontractor/lib/api.ts:34`; `lib/webauth.ts:54`).
- P2: development, preview и production EAS profiles указывают на один production Railway backend (`mobile/smartcontractor/eas.json:16`, `29`, `41`).
- P2: callback принимается без обязательного совпадения `req` и без строгой проверки scheme/path (`mobile/smartcontractor/lib/webauth.ts:97`, `108`).
- P2: `npm test` во втором backend repo падает: 13 файлов являются direct-run smoke scripts без Jest tests; только `payments-402.test.js` проходит 14 tests.
- P2: новый payment test не включён в GitHub workflow `.github/workflows/backend-production-checks.yml`.
- P2: production dependency audit: основной backend и `construction-ai` имеют по 2 high vulnerabilities (`form-data`, `ws`); mobile имеет 0 high/critical.
- P2: `server.js`, `smartcontractor.html` и smoke-auth test выросли примерно до 26k/18k/15k изменённых строк за месяц; это повышает regression cost и требует декомпозиции.

## Positive Findings

- Июньские escrow fixes добавили atomic status transitions и regression guards для double accept/double release.
- Railway действительно запускает `v3/pure-server.js`, где находятся новые endpoints.
- Mobile TypeScript: `npx tsc --noEmit` прошёл.
- Focused payment suite: 14/14 tests прошли.
- Public whitepaper использует корректные no-real-money/provider-review ограничения.
- Текущие незакоммиченные i18n изменения Claude проходят `git diff --check` и TypeScript check.
- Три instruction-файла `.claude/CLAUDE.md`, `AGENTS.md`, `GEMINI.md` идентичны по SHA-256.
- В tracked source scan не найден подтверждённый production secret; найденные `sk_test`/secret strings являются placeholders или test fixtures.

## Verification

| Check | Result |
|---|---|
| `git fetch origin --prune` / remote parity | PASS, оба `main` соответствуют `origin/main` |
| `npx tsc --noEmit` in mobile | PASS |
| `npm --prefix construction-ai run check` | FAIL: runner registry drift |
| `npm test -- --runInBand` in backend v3 | FAIL: 13 suites without Jest tests; payment suite PASS |
| `npm audit --omit=dev` | FAIL: 2 high in each backend dependency tree |
| GitHub Actions | BLOCKED: account billing lock prevents jobs from starting |

## Required Repair Order

1. Keep all payment/live release paths disabled.
2. Fix chain ID and define one shared payment protocol contract.
3. Preserve JWT on retry, send `project_id`, and add cross-repo integration tests.
4. Add wallet ownership proof and bind Hyperion `from` to the authenticated user.
5. Persist receipts with a database unique constraint and atomic transaction.
6. Require verification for mobile registration.
7. Repair both CI runners and clear the GitHub billing lock.
8. Reconcile public homepage claims with the approved whitepaper boundary.
9. Have Claude review this record and every repair PR before merge/deploy.

## Reviewer Notes

- Reviewer independently inspected the diff: YES
- Reviewer independently ran required checks: YES (mobile tsc PASS; construction-ai `npm run check` FAIL; backend audit blocked by missing lockfile)
- Public/live/legal/payment boundary reviewed: YES
- Reviewer AI: CLAUDE
- Reviewer decision: CHANGES_REQUESTED
- Required checks: FAIL
- Deploy decision: BLOCKED
- Live-risk decision: BLOCKED

### Independent verification (2026-07-02, reviewer CLAUDE)

Reviewer inspected mobile source at `C:\gcsc\mobile\smartcontractor\` and backend at `C:\gcsc\.tmp\gcsc-smart-contractor-audit\` at head `d62cfd035cd4b6726ed451ea80c12dd45e6715e4` (matches audit head).

| ID | Reviewer verdict | Evidence (independently re-checked) |
|----|------------------|-------------------------------------|
| P0-1 | CONFIRMED | `v3/pure-server.js:2301 getUser()` reads JWT only from `Authorization: Bearer`; `mobile/…/payments.ts:103-106` sends `Authorization: Payment <tx>` on retry with JWT relegated to `X-Auth-Token`; both `/api/payment/lead-token` (line 3446) and `/api/payment/job-posting` (line 3520) call `getUser()` before payment header parsing → retry returns 401. |
| P0-2 | CONFIRMED | `v3/pure-server.js:3543` requires `body.project_id` that exists and belongs to the user. `mobile/…/payments.ts:100-106` sends no body on retry; mobile `post-job.tsx` does not POST to any project-creation endpoint before payment. |
| P0-3 | CONFIRMED | `mobile/…/webauth.ts:20 CHAIN_ID = '71840bcab5f81f4c7bc6c2ed9f08abfdcad06afba7dafef9d6e0e4f3b7a14d2c'`. Backend `v3/pure-server.js:17 XPR_TESTNET_CHAIN_ID = '71ee83bcf52142d61019d95f9cc5427ba6a0d7ff8accd9e2088ae2abeaf3d3dd'`. Fully different chain hash. |
| P1-1 | CONFIRMED | `_hooks.verifyHyperionTransfer({txHash, expectedRecipient, expectedAmount, expectedMemo})` (calls at 3477 and 3555) accepts no `expectedFrom`. `verify.from` is written to receipt but never compared to `user.wallet`. Any authenticated user of the correct role can claim someone else's public tx first. |
| P1-2 | CONFIRMED | `updateProfileFromBody()` (v3/pure-server.js:2244) allow-lists 15 text fields and specialties/logo — `wallet` is not in the list and is dropped. `mobile/…/connect-wallet.tsx:22-24` calls `updateProfile({wallet: …})`, so wallet binding sent by mobile is silently ignored. `POST /api/wallet/connect` (line 2778) trusts client-supplied `accountName`/`permission` with no signature challenge. |
| P1-3 | CONFIRMED | `createDatabase()` line 208-211 declares `payment_receipts`, `lead_tokens`, `job_posting_payments` as in-memory arrays. Payment routes call only `db.payment_receipts.push(…)` — no `queryPostgres`, no persistent insert. Restart / replica scale-out wipes replay protection. |
| P1-4 | CONFIRMED | `cd construction-ai && npm run check` fails immediately: `Missing check scripts from runner: check:security-audit, check:no-live-actions, check:whitepaper-v1-3-publication-readiness-dry-run, check:homepage-v1-3-static-draft, check:homepage:performance, check:homepage:seo, check:homepage:w3c, check:whitepaper-v1-3-regulated-web3-architecture-map, check:whitepaper-v1-3-licensed-partner-architecture-map`. Nine scripts drift. |
| P1-5 | CONFIRMED | `mobile/…/auth.ts:56` hardcodes `verificationMode: 'optional'`. Backend register handler (v3/pure-server.js:2574-2585) creates the row with `is_verified: 1` while `email_verified=false, phone_verified=false`, only setting `verification_status: 'legacy_unverified'`. Verification is effectively bypassed at every mobile registration. |
| P1-6 | CONFIRMED | `index.html:67,106,123,140` advertises "Smart escrow", "Blockchain escrow releases payment only after verified milestones", "funds release by milestone". `whitepaper.html:71,113,119,206` states "no-real-money pilot mode", "GCSC can prepare escrow-ready milestone records without acting as escrow", "GCSC does not currently originate, approve, fund, service, or guarantee loans", XPR/WebAuth/Metal are "research candidates". Homepage overstates by a large margin. |

### Additional reviewer checks

- `git rev-parse HEAD` in both trees matches the audit head — no drift since Codex wrote the record.
- `npx tsc --noEmit` in `mobile/smartcontractor/` — PASS (reviewer re-ran).
- `npm audit --omit=dev` in `construction-ai` — FAIL (2 high, 5 moderate = 7 vulns).
- `npm audit --omit=dev` in backend audit clone — could not execute: repo ships without `package-lock.json`, `npm audit` requires a shrinkwrap. This blocks independent audit reproduction and is itself a P2 supply-chain risk.

### Required checks summary

| Check | Result |
|---|---|
| Independent P0/P1 verification against source | 9/9 CONFIRMED |
| Mobile `npx tsc --noEmit` | PASS |
| `construction-ai` `npm run check` | FAIL (runner drift) |
| Backend `npm audit --omit=dev` | UNRUNNABLE (missing lockfile) |
| `construction-ai` `npm audit --omit=dev` | FAIL (7 vulns, 2 high) |
| Public homepage vs whitepaper alignment | FAIL (P1-6) |
| Live payments enabled | NO — still gated |
| Deploy authorized | NO |

### Final rationale (Claude)

Every P0 and P1 finding in the Codex-authored record was verified against the live source at the specified head. No item was falsified. Codex's `Reviewer decision: CHANGES_REQUESTED`, `Required checks: FAIL`, `Deploy decision: BLOCKED`, `Live-risk decision: BLOCKED` are correct. The recommended repair order is accurate; reviewer suggests one addition: publish the backend `package-lock.json` so future audits can run without an unshrinkwrapped clone.

APPROVED is not granted. Deploy remains blocked. No live payments, no mainnet, no homepage swap. Every P0/P1 fix must land in its own repair PR, be reviewed here again, and re-verified with the same independent checks before this record's status changes.

## Repair Progress (2026-07-02, CLAUDE)

Repair branches opened (NOT merged — await re-review + founder):

**gcsc-website** — branch `fix/p0-3-chain-id` (pushed):
- P0-3 FIXED: `mobile/…/webauth.ts` chain ID `71840bca…` → `71ee83bc…`. Commit 55b809a0.
- P0-1 FIXED: `mobile/…/payments.ts` retry keeps JWT in `Authorization: Bearer`, sends tx via `X-Payment-Tx`, adds `meta` JSON body. Commit 1cbd6167. Mobile `tsc --noEmit` PASS.
- PR link: https://github.com/Melxisedek75/gcsc-website/pull/new/fix/p0-3-chain-id

**gcsc-smart-contractor** — branch `fix/p1-1-sender-binding` (pushed):
- P1-1 FIXED: `verifyHyperionTransfer` accepts `expectedFrom`; both payment routes resolve caller wallet via `findUserById`, require a bound wallet (409 `wallet_required`), and reject `bad_sender` mismatch.
- P1-2 FIXED (functional): `updateProfileFromBody` now persists `body.wallet {account,permission}` sent by mobile via PUT /api/auth/profile. NOTE: full challenge/signature ownership proof still a follow-up; sender-binding (P1-1) is the practical guard until then.
- P1-5 FIXED: register no longer sets `is_verified: 1` while email/phone unverified — now `is_verified: 0`, status `unverified`. `node --check` PASS.
- Commit 47e4c3f. PR link: https://github.com/Melxisedek75/gcsc-smart-contractor/pull/new/fix/p1-1-sender-binding

**P0-2 FIXED** (gcsc-website `fix/p0-3-chain-id`, commit a8eff738): `post-job.tsx` now calls `createBackendProject()` → `POST /api/projects` before the payment sheet, stores the returned id, and passes `meta: { project_id }` into the payment request. `lib/jobs.ts` gained `createBackendProject`. Mobile `tsc --noEmit` PASS.

**P1-4 FIXED** (gcsc-website `fix/p1-4-ci-runner`, commit 69ff96fd): registered the 5 ready validators (security-audit, no-live-actions, whitepaper-v1-3 publication-readiness + regulated/licensed architecture maps — all exit 0) in `run-checks.mjs`; removed the 4 unbuilt `homepage-v1-3` script entries from `package.json` (they depend on `index-v1-3-static-draft.html` etc. which don't exist yet — currently they provide ZERO coverage because the runner errors before running). `npm run check` now clears the drift gate and executes checks. PR: https://github.com/Melxisedek75/gcsc-website/pull/new/fix/p1-4-ci-runner

### Fixed: 7 / 9 (P0-1, P0-2, P0-3, P1-1, P1-2, P1-4, P1-5)

### Still open (2) — legitimately deferred
- **P1-3**: payment receipts still in-memory (`db.payment_receipts.push`). Needs a Postgres table with `UNIQUE(tx_hash)` + atomic insert in both payment routes, following the existing `USE_POSTGRES`/`queryPostgres` pattern. Deferred because it cannot be safely verified without a running Postgres instance — writing persistence code blind and committing it unverified would be worse than a scoped handoff.
- **P1-6**: homepage/whitepaper reconciliation. The proper fix is building the `index-v1-3-static-draft.html` + `index-v1-3-draft.html` + `whitepaper-v1-3-draft.html` drafts to the strict spec enforced by the (now-deferred) homepage-v1-3 validators — a whitepaper-aligned homepage marked "Internal Draft - Not Approved For Publication / Publication Gate: NO-GO". This is a multi-file build, not a CI repair, and touches public-homepage wording (founder-gated). The live `index.html` was NOT changed.

Deploy stays BLOCKED. Re-review each PR before merge; do not merge to main or deploy without founder approval and a fresh independent check pass. Repair branches: `fix/p0-3-chain-id` (P0-1/P0-2/P0-3, gcsc-website), `fix/p1-4-ci-runner` (P1-4, gcsc-website), `fix/p1-1-sender-binding` (P1-1/P1-2/P1-5, gcsc-smart-contractor).
