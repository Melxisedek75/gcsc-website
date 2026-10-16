# P0-1 Backend 402-flow — Implementation Patch (Founder Review)

**Дата:** 2026-06-26
**Статус:** Реализовано локально, 14/14 тестов зелёные, smoke-test confirmed. **НЕ запушено** в `gcsc-smart-contractor/main` — нужен твой ревью из-за расхождения.

---

## Что произошло

Локальный `C:/Users/rivne/gcsc-v3` был на 153 коммита позади origin/main. За эту неделю pure-server.js вырос с 394 строк до 3474 — добавился Postgres, async chainTx verifier (`hyperionTransactionHasExpectedAction`, `fetchHyperionTransaction`, `verifyStoredChainTx`), CORS allowlist, stripe payment intents, audit events, escrow CAS-фиксы.

Мой patch был написан под старую 394-строчную версию. После `git fetch + reset --hard origin/main` я НЕ стал автоматически вмёрживать — модель `chainTx` в новой версии **другая** (async background verifier vs. мой синхронный 402-flow), и без понимания твоего дизайна риск сломать прод эскроу слишком высок.

## Что было сделано локально (работает, 14/14 тестов passing)

### 1. Новые in-memory db tables

```js
db.payment_receipts = []  // {id, tx_hash, kind, user_id, from_account, amount, block_num, project_id?, created_at}
db.lead_tokens      = []  // {id, user_id, tx_hash, status, created_at}
db.job_posting_payments = []  // {id, user_id, project_id, tx_hash, created_at}
```

### 2. Хелперы

`fetchJson(url, timeoutMs)` — обёртка над `http/https.get` с таймаутом и JSON.parse.

`verifyHyperionTransfer({ txHash, expectedRecipient, expectedAmount, expectedMemo, network })`:
- Валидирует txHash (64-hex)
- Fallback chain Hyperion-нод (mainnet 5, testnet 2)
- Endpoint: `GET {node}/v2/history/get_transaction?id={txHash}`
- Ищет `actions[].act.name === 'transfer' && act.account === 'eosio.token'`
- Строгая проверка `data.to`, `data.quantity`, `data.memo`
- Anti-replay: tx должна быть моложе 10 минут (`XPR_PAYMENT_MAX_AGE_MS`)
- Возвращает `{ok, from, block_num, error?, detail?}`

### 3. Тестовый hook

```js
const _hooks = { verifyHyperionTransfer: null };
// ... after function defined:
_hooks.verifyHyperionTransfer = verifyHyperionTransfer;
```

Routes вызывают `_hooks.verifyHyperionTransfer(...)` чтобы тесты могли мокать без monkey-patching модуля.

### 4. Routes

**`POST /api/payment/lead-token`** (Contractor-only, 50 XPR):

```
NO Authorization header  -> 401
JWT not contractor       -> 403
NO X-Payment-Tx          -> 402 + WWW-Authenticate: Payment recipient="gcsctoken111" amount="50.0000 XPR" memo="gcsc:lead-token" network="testnet"
Duplicate tx_hash        -> 409
verify.ok === false      -> 400 + {code, detail}
verify OK                -> 200 + Payment-Receipt: lead_id=...; tx=... + body {message, lead_id, tx_hash, block_num}
```

**`POST /api/payment/job-posting`** (Homeowner-only, 25 XPR, требует body `{project_id}`):
- Те же гейты + проверка `db.projects.find(p => p.id === projectId && p.homeowner_id === user.userId)` -> 400 если чужой проект
- Успех: `project.published = true`, `project.published_at = ISO`

### 5. Module exports refactor

```js
if (require.main === module) {
  server.listen(PORT, '0.0.0.0', () => { ... });
}
module.exports = server;
module.exports.db = db;
module.exports._hooks = _hooks;
module.exports.verifyHyperionTransfer = verifyHyperionTransfer;
module.exports.fetchJson = fetchJson;
module.exports.jwtSign = jwtSign;
```

### 6. ENV переменные

```
XPR_NETWORK              = testnet | mainnet         (default testnet)
XPR_PAYMENT_RECIPIENT    = gcsctoken111              (default)
XPR_PAYMENT_MAX_AGE_MS   = 600000                    (10 min replay window)
```

---

## Что нужно ревью

1. **Интеграция с существующим `chainTx` verifier.** У вас уже есть `fetchHyperionTransaction()`, `verifyStoredChainTx()`, `hyperionTransactionHasExpectedAction()` — но они работают через background interval (300s). Для 402-flow нужна синхронная верификация на запросе. Решение:
   - **Вариант A (предпочтительно):** Зарефакторить — выделить из `verifyStoredChainTx` синхронный `verifyTransferAction({txId, contract, action, expectedData})`, вызывать его и в 402-routes, и в background loop.
   - **Вариант B:** Оставить мой `verifyHyperionTransfer` независимым (использует `getXprHyperionUrls()` для списка нод).

2. **DB модель.** Постгрес-таблицы для `payment_receipts`, `lead_tokens`, `job_posting_payments`. Колонки + UNIQUE INDEX на `tx_hash`. Я сделал только in-memory. Нужно добавить в `initStorage()`.

3. **CORS.** Мобильное приложение (`mobile/smartcontractor`) ещё не в `CORS_ALLOWED_ORIGINS`. Для нативного приложения CORS не критичен, но если будут web-тестеры — добавить.

4. **Rate limiting.** В новом коде есть `rateLimitStore: Map`. Применить к payment routes (max 10/час на user_id из плана).

---

## Локальный артефакт

Тестовый файл сохранён в `/tmp/payments-402.test.js.bak` (Git Bash temp). Скопировать в новый branch:

```powershell
cd C:\Users\rivne\gcsc-v3
git checkout -b feat/payment-402-flow
cp /tmp/payments-402.test.js.bak v3/tests/payments-402.test.js
```

Тесты используют моки через `_hooks.verifyHyperionTransfer` — переносимы под любую реализацию, если она экспортирует `_hooks`.

## Следующий шаг (мой план)

Не задерживаюсь на интеграции этого patch'а. Пока ты ревьюишь — иду в **P0-2: WebAuth wallet integration в mobile** (другой репо, нет конфликтов). Возвращаюсь к 402 routes после твоего sign-off на вариант A/B.
