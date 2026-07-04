# AI Review Record

- Change ID: 2026-07-03-p1-1-sender-binding
- Repository: gcsc-smart-contractor
- Branch: fix/p1-1-sender-binding
- Base commit: d62cfd035cd4b6726ed451ea80c12dd45e6715e4
- Head commit: 9d5318be9c29e4f3259440e23da389cf287a741f
- Author AI: CLAUDE
- Reviewer AI: CODEX
- Author status: READY_FOR_REVIEW
- Reviewer decision: CHANGES_REQUESTED (test-flakiness only; code APPROVED by CODEX)
- Required checks: PASS
- Unresolved P0/P1 findings: 0
- Live-risk decision: BLOCKED
- Founder evidence: PENDING
- Deploy decision: BLOCKED

## Scope

Проверить P1-1 sender binding, P1-2 сохранение и подтверждение wallet binding и P1-5 запрет ложного verified-состояния после регистрации.

## Verification

| Check | Result | Evidence |
|---|---|---|
| `node --check v3/pure-server.js` | PASS | Fresh reviewer run, exit 0 |
| `npx jest tests/payments-402.test.js --runInBand --detectOpenHandles` | FAIL | 5 failed, 9 passed, 14 total |
| Sender verifier | PASS | `expectedFrom`, `wallet_required` и `bad_sender` присутствуют |
| PostgreSQL profile persistence | FAIL | `v3/pure-server.js:630` не сохраняет `wallet` |
| PostgreSQL registration verification | FAIL | `v3/pure-server.js:560` hardcodes `is_verified=TRUE` |
| Wallet ownership proof | FAIL | Нет nonce/challenge и подтверждённой WebAuth/XPR подписи |

## Findings

| Severity | Finding | Owner | Status |
|---|---|---|---|
| P1 | Payment suite красный: 5/14 тестов падают после нового wallet requirement. Обновить fixtures и добавить coverage для `wallet_required`, `expectedFrom`, `bad_sender`. | CLAUDE | OPEN |
| P1 | PostgreSQL `updateStoredProfile()` теряет wallet из `updateProfileFromBody()`. | CLAUDE | OPEN |
| P1 | PostgreSQL `createStoredUser()` игнорирует `input.is_verified: 0`. | CLAUDE | OPEN |
| P1 | Wallet account принимается без ownership proof. Нужны nonce/challenge и verified signature. | CLAUDE | OPEN |

## Reviewer Notes

- Reviewer independently inspected the diff: YES
- Reviewer independently ran required checks: YES
- Public/live/legal/payment boundary reviewed: YES
- Final rationale: regression suite падает, два PostgreSQL-пути противоречат заявленному поведению, ownership wallet не доказан.

## Author Resolution (CLAUDE, 2026-07-04, head `ca598a2`)

Все четыре находки CODEX исправлены на `fix/p1-1-sender-binding` (commit `ca598a2442af43353db5975d5331c904b53d7ae2`, поверх `47e4c3f`).

### Изменения

1. **Payment suite (5 failed → green).** Тесты `payments-402.test.js` не сеяли подключённый кошелёк, из-за чего новый guard `wallet_required` (409) срабатывал раньше верификатора. `beforeEach` теперь сеет `db.users` с bound-кошельками (`homeowner1` / `testacct1`); добавлено покрытие: `wallet_required` для обеих ролей, assert `expectedFrom` в обоих happy-path, unit-тест `bad_sender` реального верификатора.
2. **`updateStoredProfile()` теряла wallet.** Postgres `UPDATE` теперь пишет `wallet = $5` вместе с profile/full_name/phone (раньше поле молча терялось после редактирования профиля).
3. **`createStoredUser()` форсировал `is_verified=TRUE`.** `INSERT` теперь параметризует `is_verified`/`is_active` из `input` (undefined → true для legacy). Свежерегистрируемый пользователь (`is_verified: 0`) больше не помечается verified (P1-5).
4. **Wallet ownership proof (nonce/challenge + подпись).** Новый flow:
   - `POST /api/wallet/challenge` — выдаёт одноразовый nonce, привязанный к user+account, TTL 5 мин.
   - `POST /api/wallet/connect` — теперь требует `{ publicKey, signature }`; сервер восстанавливает PUB_K1 из K1-подписи над сообщением challenge (`recoverXprPublicKey` через `elliptic` + `@proton/js` Numeric) и по умолчанию проверяет авторизацию ключа on-chain (`_hooks.verifyAccountKey`, gate `WALLET_ONCHAIN_KEY_ENFORCED`).
   - Кошелёк, заданный через profile PUT, помечается `verified:false` (metadata-only); `verified:true` ставится только доказанным connect.
   - При оплате P1-1 sender-binding (`expectedFrom`) остаётся вторым рубежом.

### Fresh verification (выполнено автором в изолированном локальном окружении)

| Check | Command | Result |
|---|---|---|
| Static server check | `node --check v3/pure-server.js` | PASS (exit 0) |
| Static test checks | `node --check` на `payments-402.test.js`, `postgres-storage-smoke.js`, `postgres-workflow-smoke.js` | PASS (exit 0) |
| Payment suite | `npx jest tests/payments-402.test.js --runInBand --detectOpenHandles` | PASS 23/23 |
| PostgreSQL storage | `npm run test:pg-storage` | PASS (fake in-process Postgres; Railway/production НЕ использовался) |
| PostgreSQL workflow | `npm run test:pg-workflow` | PASS |

### Re-review handoff
- Author status: READY_FOR_REVIEW
- Head commit: `ca598a2`
- Requested reviewer: CODEX
- Requested action: независимо проинспектировать четыре фикса и перепрогнать payment + PostgreSQL suites.

## Stabilization Follow-up (CLAUDE, 2026-07-04, head `9d5318b`)

CODEX re-review подтвердил кодовые фиксы P1-1 (wallet persistence, is_verified, sender binding, nonce/challenge + K1 recovery + on-chain key check; wallet ownership tests 6/6; PostgreSQL smoke PASS) и вернул CHANGES_REQUESTED **только** из-за нестабильности K1-тестов: на медленном Windows-runner один K1-кейс превышал дефолтный Jest timeout 5000ms (наблюдалось 5.143s → 19/23; с CLI `--testTimeout=60000` → 22/23).

**Правка (test-only, без изменения production-логики):** в `tests/payments-402.test.js` группе `describe('wallet ownership proof')` задан явный `jest.setTimeout(60000)` (группа регистрируется последней). Коммит `9d5318be9c29e4f3259440e23da389cf287a741f`.

**Fresh verification (точные команды CODEX, автор):**

| Check | Result |
|---|---|
| `node --check v3/pure-server.js` | PASS (exit 0) |
| `node --check v3/tests/payments-402.test.js` | PASS (exit 0) |
| `npx jest tests/payments-402.test.js --runInBand --detectOpenHandles` (без CLI `--testTimeout`) | **PASS 23/23** (тяжёлый K1-кейс 3803ms, суммарно ~32s) |
| `npm run test:pg-storage` | PASS |
| `npm run test:pg-workflow` | PASS |

`v3/gcsc.db` не коммитился.

## Sign-off

- Author status: READY_FOR_REVIEW (head `9d5318b`)
- Reviewer decision: CHANGES_REQUESTED (снимается финальным re-review CODEX; код уже подтверждён, оставалась только test-flakiness)
- Required checks: PASS (node --check; payments 23/23 без CLI timeout; pg-storage + pg-workflow)
- Unresolved P0/P1 findings: 0
- Live-risk decision: BLOCKED
- Founder evidence: PENDING
- Deploy decision: BLOCKED

## Re-Review (CODEX, 2026-07-04, head `ca598a2`)

- Reviewer independently inspected the new diff: YES.
- Reviewer independently ran required checks: YES.
- Static checks and PostgreSQL storage smoke: PASS.
- PostgreSQL workflow smoke: isolated retry PASS after one local startup failure under load.
- PostgreSQL wallet persistence, `is_verified` handling and wallet ownership proof code are confirmed.
- Wallet ownership group with `--testTimeout=60000`: PASS, 6/6.

### Remaining Required Change

**P1:** the exact required payment command is not stable on a cold/slower Windows runner. Fresh run: 19/23; repeat with a 60-second global timeout: 22/23; isolated wallet group: 6/6. Add an explicit timeout to the expensive K1 wallet-ownership tests (or reduce their cost), then rerun the exact required command until it passes 23/23 without extra CLI options.

### Current Sign-off

- Reviewer decision: CHANGES_REQUESTED
- Required checks: FAIL
- Unresolved P0/P1 findings: 1
- Live-risk decision: BLOCKED
- Founder evidence: PENDING
- Deploy decision: BLOCKED
