# GCSC Payment Integration Plan — Testnet → Mainnet

**Дата:** 2026-06-26
**Скоуп:** интеграция реального платёжного слоя для бета-теста (testnet) и подготовка к mainnet после CLARITY Act / GENIUS Act.

---

## Текущее состояние

| Компонент | Где | Статус |
|---|---|---|
| mppx-xpr-network client | `mobile/smartcontractor/lib/payments.ts` | DEMO_MODE стаб |
| PaymentSheet UI | `mobile/smartcontractor/components/PaymentSheet.tsx` | работает, симулирует 4 стадии |
| Wired в bid.tsx | Lead Token $50 XPR | UI готов |
| Wired в post-job.tsx | Posting fee $25 XPR | UI готов |
| Backend 402 endpoint | `v3/pure-server.js` | НЕТ |
| WebAuth signTransfer | `lib/payments.ts:142` | заглушка кидает ошибку |
| Stripe test mode | backend | OK (только test) |
| Stripe live | backend | заблокировано флагом `SETTLEMENT_ENABLED` |

## Архитектура — два рельса

**Рельс А — XPR (крипто):** mppx 402-flow на testnet, эскроу milestone-payments, Lead Token sales, stake/governance в GCSC token.

**Рельс Б — Fiat (USD):** Stripe Connect для homeowner карт, Stripe Identity для KYC, payout в bank account через Stripe Connect.

**В testnet работает только Рельс А.** Рельс Б остаётся в test-mode до явного разрешения founder + legal.

---

## Sprint 1 — Backend 402 endpoint (3-5 дней)

### 1. Helper `verifyHyperionTransfer(txHash, expectedRecipient, expectedAmount, expectedMemo)`

Fallback chain Hyperion нод (mainnet):
- `https://proton.eosusa.io`
- `https://proton.protonuk.io`
- `https://proton-api.eosiomadrid.io`
- `https://xpr-mainnet-api.bloxprod.io`
- `https://proton-hyperion.luminaryvisn.com`

Testnet: `https://testnet.protonchain.com`

Endpoint: `GET /v2/history/get_transaction?id={txHash}`

Валидация:
- `transfer.from` соответствует pre-registered wallet
- `transfer.to == "gcsctoken111"`
- `transfer.quantity == "50.0000 XPR"`
- `transfer.memo == "gcsc:lead-token"` (anti-replay)
- Транзакция final (block_num confirmed)

### 2. Route `POST /api/payment/lead-token`

Без `Authorization`:
```
402 Payment Required
WWW-Authenticate: Payment recipient="gcsctoken111" amount="50.0000 XPR" memo="gcsc:lead-token"
```

С `Authorization: Payment {txHash}`:
- Verify через `verifyHyperionTransfer()`
- Idempotency: `INSERT INTO payment_receipts (tx_hash, ...) ON CONFLICT DO NOTHING`
- Success: создать Lead Token entry, привязать к user_id
- `200 + Payment-Receipt: lead_id={uuid}`

### 3. Route `POST /api/payment/job-posting`

Тот же flow, amount `25.0000 XPR`, memo `gcsc:job-posting`. На success: `published=true` + invited contractors notification trigger.

### 4. Тесты

В `gcsc-smart-contractor/v3/tests/`:
- `payment-402-flow.test.js` — happy path
- `payment-replay-protection.test.js` — один txHash дважды → 409
- `payment-bad-amount.test.js` — wrong amount → 400
- `payment-bad-recipient.test.js` — wrong recipient → 400
- `payment-hyperion-fallback.test.js` — первая нода timeout, fallback на вторую

### Def готовности
- 5 тестов зелёные
- Локальный запрос с testnet wallet → tx → 200
- Endpoint доступен на Railway

---

## Sprint 2 — WebAuth wallet в mobile (5-7 дней)

### Установка
```powershell
cd C:\gcsc\mobile\smartcontractor
npm install @proton/web-sdk --legacy-peer-deps
```

### `lib/webauth.ts`
- `connectWallet()` — открывает WebAuth deeplink, получает user account name
- `signTransfer({ from, to, quantity, memo })` — открывает WebAuth для подписи `eosio.token::transfer`, возвращает txHash
- Обработка cancel, timeout, network errors

### Изменения в `lib/payments.ts`
- Удалить throw в `signTransfer`, подключить из `webauth.ts`
- `DEMO_MODE = false` (или через env)
- Endpoint: `https://gcsc-backend.up.railway.app/api/payment/lead-token`

### Onboarding
Wallet Setup экран: если у user нет привязанного wallet — «Connect WebAuth Wallet». Сохранять account в SecureStore (`expo-secure-store`).

### Тесты
- iOS Simulator + WebAuth testnet
- Android Emulator + WebAuth testnet
- Реальный iPhone/Android (deeplink return)

### Def готовности
Кнопка «Pay 50 XPR» открывает WebAuth → подпись → возврат в app с txHash → backend верифицирует → UI «Confirmed · {short hash}».

---

## Sprint 3 — End-to-end testnet flow (1 неделя)

### Сценарий
1. Homeowner ставит app, регистрируется
2. Подключает WebAuth wallet (testnet)
3. Создаёт job в `post-job.tsx`
4. Платит 25 XPR posting fee → job publishes
5. Contractor логинится, видит open job
6. Покупает Lead Token за 50 XPR → может submit bid
7. Submitting bid: amount + timeline
8. Homeowner видит bid, accept
9. Backend создаёт escrow on-chain (`gcscrow1111`)
10. Contractor загружает milestone proof
11. Backend проверяет через Compliance Agent (mock)
12. Homeowner approves
13. Backend triggers release → contractor получает testnet XPR

### Что нужно
- Backend `POST /api/escrow/create` — создаёт on-chain escrow
- Backend `POST /api/milestones/:id/approve` — releases funds
- Mock Compliance Agent (возвращает OK всем)
- WebSocket для real-time обновлений

### Def готовности
3 успешных end-to-end с двумя testnet wallet-парами + скрин-кэст 2-3 мин для demo video.

---

## Stripe (Рельс Б) — параллельно, но НЕ для testnet

**Сейчас:** Stripe test-mode работает в `pure-server.js`. Live ключи заблокированы.

### В testnet
- Test-карты `4242 4242 4242 4242` для UX
- Stripe Identity test-mode (instant approval)
- Никакой реальной денежной операции

### Перед live (P3)
- Legal review структуры escrow по штатам США
- Stripe live ключи в `.env` (prod-окружение)
- `SETTLEMENT_ENABLED=true` только после founder + legal
- MTL (Money Transmitter License) ИЛИ партнёрство с лицензированным провайдером — **сюда вписывается Metallicus / Metal X**

---

## Архитектура потока

```
Homeowner (mobile)         Backend              XPR Network
       |                     |                       |
       |--- POST /lead ----->|                       |
       |<-- 402 + WWW-Auth --|                       |
       |                                              |
       |--- WebAuth sign ---------------> [transfer]
       |<-- txHash --------------------------|
       |                                              |
       |--- POST + Auth:txHash -->|                  |
       |                          |-- Hyperion ----->|
       |                          |<-- transfer OK --|
       |<-- 200 + Receipt --------|                  |
       |                          |-- DB receipt     |
       |                          |-- create lead_id |
```

## Безопасность

- Replay protection: `tx_hash UNIQUE` в `payment_receipts`
- Amount validation: строгая проверка `quantity` бит-в-бит
- Recipient: только pre-registered (`gcsctoken111`)
- Memo verification: обязательный `gcsc:*` префикс
- Timestamp window: tx должна быть свежее 10 минут
- Rate limit: max 10 payment attempts/час на user_id
- HTTPS only
- Wallet keys в SecureStore (mobile), Hyperion endpoints — не секретны

## Mainnet чеклист

| Подготовка | Когда |
|---|---|
| Контракты на mainnet XPR (deploy `gcsctoken111`, `gcscrow1111`, `gcscstable11`) | После аудита, перед бета-open |
| Real Hyperion mainnet endpoints | По env |
| Реальные XPR в обороте | После liquidity bootstrap / token sale |
| Stripe live | После legal + founder approval |
| Metal Blockchain bridge | Партнёрство с Metallicus |

## Кто что делает

| Что | Кто |
|---|---|
| Backend 402 endpoint + tests | Я |
| WebAuth integration code | Я |
| Тесты на эмуляторах | Я (если эмуляторы локальные) |
| Тесты на реальном iPhone/Android | **Ты** |
| Получение testnet XPR на test wallets | **Ты** (faucet) |
| Создание test accounts через WebAuth | **Ты** |
| Stripe live keys | **Ты** (Stripe dashboard) |
| Deploy на Railway prod | Я / Ты (auto) |
| Legal review структуры | **Ты** (юрист) |
