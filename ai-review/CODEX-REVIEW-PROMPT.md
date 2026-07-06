# Codex — финальный re-review (P1-1 sender-binding)

Статус на 2026-07-04: три ветки Claude прошли твой независимый re-review.

| Ветка | Repo | Head | Твоё решение |
|---|---|---|---|
| `fix/p0-3-chain-id` | gcsc-website | `8a19d5f6` | ✅ APPROVED |
| `fix/p1-6-homepage-v1-3-draft` | gcsc-website | `adf9df3d` | ✅ APPROVED |
| `fix/p1-1-sender-binding` | gcsc-smart-contractor | `9d5318b` → **`4ab3be4`** | CHANGES_REQUESTED (test-flakiness закрыт на `4ab3be4`) — ждёт финального re-review |

## Что осталось: подтвердить только P1-1

Кодовые фиксы P1-1 ты уже подтвердил (wallet persistence, is_verified не форсится, sender binding, nonce/challenge + K1 recovery + on-chain key check; wallet ownership 6/6; PostgreSQL smoke PASS). В финальном re-review ты вернул 2 находки — обе закрыты на `4ab3be4` (test-only):

1. **ECONNRESET** после тяжёлого K1-теста → тестовый HTTP-клиент теперь бьёт по свежему сокету (`agent: false` + `Connection: close`).
2. **`test:pg-workflow` не успевал за 8s** (сервер грузит elliptic + @proton/js) → дедлайн готовности в обоих pg-smoke поднят до 30s.

Автор прогнал по правилу «зелёное перед передачей»: payment suite **23/23 × 3 подряд**, `test:pg-workflow` **PASS × 2**, `test:pg-storage` **PASS × 2**.

### Проверь (репо gcsc-smart-contractor, локально `C:\Users\rivne\gcsc-v3`)
```
git fetch origin
git checkout fix/p1-1-sender-binding      # head = 4ab3be4
git diff 9d5318b 4ab3be4                   # ожидается: только test-файлы (socket + 30s deadline)
node --check v3/pure-server.js
node --check v3/tests/payments-402.test.js
cd v3
npx jest tests/payments-402.test.js --runInBand --detectOpenHandles   # БЕЗ CLI --testTimeout, прогони 3 раза
npm run test:pg-storage
npm run test:pg-workflow
```
Ожидаемый результат: node --check PASS; payment suite **23/23 PASS** (стабильно 3 раза, без CLI `--testTimeout`); оба pg-smoke PASS. `v3/gcsc.db` не коммить.

### Sign-off
Если стабильно 23/23 — поставь **APPROVED** для head `4ab3be4` в
`ai-review/records/2026-07-03-p1-1-sender-binding.md` (`Reviewer AI: CODEX`, отметь, что независимо прогнал проверки).

## Границы
После APPROVED всех веток обеими сторонами merge/deploy остаются **BLOCKED** до founder approval. Не merge, не deploy, не Railway/production/mainnet/реальные платежи/секреты, не менять публичные `index.html`/`whitepaper.html`.
