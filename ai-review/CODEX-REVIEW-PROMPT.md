# Codex — финальный re-review (P1-1 sender-binding)

Статус на 2026-07-04: три ветки Claude прошли твой независимый re-review.

| Ветка | Repo | Head | Твоё решение |
|---|---|---|---|
| `fix/p0-3-chain-id` | gcsc-website | `8a19d5f6` | ✅ APPROVED |
| `fix/p1-6-homepage-v1-3-draft` | gcsc-website | `adf9df3d` | ✅ APPROVED |
| `fix/p1-1-sender-binding` | gcsc-smart-contractor | `ca598a2` → **`9d5318b`** | CHANGES_REQUESTED (только test-flakiness) — ждёт финального re-review |

## Что осталось: подтвердить только P1-1

Кодовые фиксы P1-1 ты уже подтвердил (wallet persistence, is_verified не форсится, sender binding, nonce/challenge + K1 recovery + on-chain key check; wallet ownership 6/6; PostgreSQL smoke PASS). Единственная причина CHANGES_REQUESTED — нестабильные K1-тесты (дефолтный Jest timeout 5000ms на медленном Windows-runner: 19/23, с `--testTimeout=60000` → 22/23, один K1-кейс 5.143s).

**Правка (commit `9d5318be9c29e4f3259440e23da389cf287a741f`, test-only):** группе `describe('wallet ownership proof')` в `v3/tests/payments-402.test.js` задан явный `jest.setTimeout(60000)` (группа регистрируется последней). Production-логика не менялась.

### Проверь (репо gcsc-smart-contractor, локально `C:\Users\rivne\gcsc-v3`)
```
git fetch origin
git checkout fix/p1-1-sender-binding      # head = 9d5318b
git diff ca598a2 9d5318b                   # ожидается: только +jest.setTimeout(60000) в тесте
node --check v3/pure-server.js
node --check v3/tests/payments-402.test.js
cd v3
npx jest tests/payments-402.test.js --runInBand --detectOpenHandles   # БЕЗ CLI --testTimeout
npm run test:pg-storage
npm run test:pg-workflow
```
Ожидаемый результат: node --check PASS; payment suite **23/23 PASS** без CLI `--testTimeout`; оба pg-smoke PASS. `v3/gcsc.db` не коммить.

### Sign-off
Если стабильно 23/23 — поставь **APPROVED** для head `9d5318b` в
`ai-review/records/2026-07-03-p1-1-sender-binding.md` (`Reviewer AI: CODEX`, отметь, что независимо прогнал проверки).

## Границы
После APPROVED всех веток обеими сторонами merge/deploy остаются **BLOCKED** до founder approval. Не merge, не deploy, не Railway/production/mainnet/реальные платежи/секреты, не менять публичные `index.html`/`whitepaper.html`.
