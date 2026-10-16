# mppx-xpr-network — Локальная документация GCSC

> Версия: 1.3.8 | Автор: charliebot87 | Лицензия: MIT
> Репозиторий: https://github.com/charliebot87/mpp-xpr
> Playground: https://x402.charliebot.dev

---

## Что это такое

`mppx-xpr-network` — это плагин платёжного метода XPR Network для протокола **Machine Payments Protocol (MPP/mppx)**. Позволяет серверам принимать оплату токенами XPR напрямую через HTTP-запросы.

**Ключевые преимущества для GCSC:**
- **$0 газ** — никаких комиссий, сумма платежа = сумма получателя
- **< 500ms финальность** — мгновенные транзакции
- **Человекочитаемые аккаунты** — платишь `gcsctoken111`, не `0x7a58...`
- **WebAuth кошелёк** — биометрия, нет сид-фраз (уже используется в GCSC!)
- **KYC on-chain** — встроенная верификация личности
- **Бесплатное создание аккаунтов**

---

## Установка

```bash
npm install mppx-xpr-network mppx
```

---

## Основные экспорты

```ts
import {
  xpr,          // Server: xpr.charge() и xpr.session()
  xprClient,    // Client: для WebAuth / Proton Web SDK
  verifyTransfer,        // Ручная верификация транзакции
  verifySession,         // Ручная верификация сессии
  VerificationError,     // Класс ошибки верификации
  SessionVerificationError, // Класс ошибки верификации сессии
  DEFAULT_HYPERION_ENDPOINTS, // Список Hyperion нод
} from 'mppx-xpr-network'
```

---

## Серверное использование

### 1. Разовый платёж (charge)

```ts
import { Mppx } from 'mppx/server'
import { xpr } from 'mppx-xpr-network'

const mppx = Mppx.create({
  methods: [
    xpr.charge({
      recipient: 'gcsctoken111',      // XPR аккаунт получателя
      amount: '50.0000 XPR',          // Сумма по умолчанию ($50 лид)
      hyperion: 'https://proton.eosusa.io', // Нода для верификации
      rpc: 'https://api.protonnz.com',
    }),
  ],
  secretKey: process.env.MPP_SECRET_KEY,
})

// В обработчике маршрута (Express / Next.js)
export async function GET(request: Request) {
  const result = await mppx.xpr.charge({
    amount: '50.0000 XPR', // Lead Token = $50
  })(request)

  if (result.status === 402) return result.challenge  // Запрашиваем оплату

  // Оплата подтверждена — отдаём контент
  return result.withReceipt(
    Response.json({ lead: { contractorId: '...', contact: '...' } })
  )
}
```

### 2. Стриминг платёж (session) — для подписок

```ts
import { Mppx } from 'mppx/server'
import { xpr } from 'mppx-xpr-network'

const mppx = Mppx.create({
  methods: [
    xpr.session({
      recipient: 'gcsctoken111',
      rpc: 'https://api.protonnz.com',
    }),
  ],
  secretKey: process.env.MPP_SECRET_KEY,
})

// Стриминг endpoint (подписка BASIC $49/мес)
export async function GET(request: Request) {
  const result = await mppx.xpr.session({
    maxAmount: '49.0000 XPR',  // BASIC подписка
    duration: 2592000,          // 30 дней в секундах
  })(request)

  if (result.status === 402) return result.challenge

  const stream = new ReadableStream({ /* контент */ })
  return result.withReceipt(new Response(stream))
}
```

---

## Клиентское использование

```ts
import { Mppx } from 'mppx/client'
import { xprClient } from 'mppx-xpr-network'

const mppx = Mppx.create({
  methods: [
    xprClient({
      signTransaction: async (actions) => {
        // WebAuth SDK (уже используется в GCSC!)
        const result = await session.transact({ actions }, { broadcast: true })
        return { transactionId: result.processed.id }
      },
    }),
  ],
})
```

---

## Схема платёжного потока

### Разовый платёж

```
Клиент (WebAuth)          Сервер GCSC              XPR Network
    |                          |                         |
    | GET /api/lead            |                         |
    |------------------------->|                         |
    |                          |                         |
    | 402 + WWW-Authenticate   |                         |
    | Payment (challenge)      |                         |
    |<-------------------------|                         |
    |                          |                         |
    | eosio.token::transfer    |                         |
    | to=gcsctoken111          |                         |
    | memo=uuid                |                         |
    |--------------------------------------------------------->|
    |                          |                         |
    | GET /api/lead            |                         |
    | Authorization: Payment   |                         |
    | (credential + txHash)    |                         |
    |------------------------->|                         |
    |                          | verify via Hyperion     |
    |                          |------------------------>|
    |                          |                         |
    | 200 OK + Payment-Receipt |                         |
    | (данные лида)            |                         |
    |<-------------------------|                         |
```

### Сессионный платёж (подписка)

```
Клиент                    Сервер GCSC              XPR Network (vest)
    |                          |                         |
    | GET /api/subscription    |                         |
    |------------------------->|                         |
    |                          |                         |
    | 402 + challenge          |                         |
    | {vestName, maxAmount}    |                         |
    |<-------------------------|                         |
    |                          |                         |
    | transfer XPR → vest      |                         |
    | startvest(vestName)      |                         |
    |--------------------------------------------------------->|
    |                          |                         |
    | GET /api/subscription    |                         |
    | Authorization: Payment   |                         |
    |------------------------->|                         |
    |                          | verify vest table       |
    |                          |------------------------>|
    |                          |                         |
    | 200 OK + стриминг        |                         |
    |<-------------------------|                         |
    |                          |                         |
    |        ... стриминг ...  | claimvest (периодически)|
    |                          |------------------------>|
```

---

## Действия vest контракта

| Действие | Кто | Что делает |
|---------|-----|-----------|
| `eosio.token::transfer` → `vest` | Клиент | Депозит XPR (memo: "deposit") |
| `vest::startvest` | Клиент | Запуск стриминг-сессии |
| `vest::claimvest` | Сервер | Вывод накопленных токенов |
| `vest::stopvest` | Оба | Завершение сессии, возврат остатка |

---

## Конфигурация

### xpr.charge()

```ts
xpr.charge({
  recipient: 'gcsctoken111',                    // XPR аккаунт GCSC
  hyperion: 'https://proton.eosusa.io',         // Основная Hyperion нода
  hyperionEndpoints: DEFAULT_HYPERION_ENDPOINTS, // Список fallback нод
  rpc: 'https://api.protonnz.com',              // XPR Network RPC
  amount: '1.0000 XPR',                         // Сумма по умолчанию
  memo: 'gcsc-payment',                         // Мемо по умолчанию
})
```

### xpr.session()

```ts
xpr.session({
  recipient: 'gcsctoken111',
  rpc: 'https://api.protonnz.com',
})
```

---

## Hyperion ноды (по умолчанию)

```ts
export const DEFAULT_HYPERION_ENDPOINTS = [
  'https://proton.eosusa.io',
  'https://proton.protonuk.io',
  'https://proton-api.eosiomadrid.io',
  'https://xpr-mainnet-api.bloxprod.io',
  'https://proton-hyperion.luminaryvisn.com',
]
```

Сервер автоматически перебирает все ноды при верификации + делает 3 повторные попытки с задержкой (2s, 3s, 5s) для учёта задержки индексирования.

---

## HTTP заголовки

| Заголовок | Направление | Описание |
|----------|-------------|---------|
| `WWW-Authenticate: Payment` | Сервер → Клиент | 402 challenge с параметрами |
| `Authorization: Payment` | Клиент → Сервер | Credentials с txHash |
| `Payment-Receipt` | Сервер → Клиент | Подтверждение оплаты |

---

## Применение в GCSC

### Lead Token Sales ($50/лид)
```ts
xpr.charge({ recipient: 'gcsctoken111', amount: '50.0000 XPR' })
// 50% автосжигание + 50% Treasury через смарт-контракт
```

### Подписки
```ts
// BASIC $49/мес
xpr.session({ recipient: 'gcsctoken111' }) // maxAmount: '49.0000 XPR', duration: 2592000
// STANDARD $99/мес
xpr.session({ recipient: 'gcsctoken111' }) // maxAmount: '99.0000 XPR', duration: 2592000
// PREMIUM $199/мес
xpr.session({ recipient: 'gcsctoken111' }) // maxAmount: '199.0000 XPR', duration: 2592000
```

### AI Agent платежи (A2A)
```ts
// Агенты платят друг другу за сервисы автоматически
xpr.charge({ recipient: 'agent-account', amount: '0.0100 XPR' })
```

---

## Сравнение: charge vs session

| | `xpr.charge()` | `xpr.session()` |
|---|---|---|
| Применение | Разовый платёж (лид, услуга) | Подписка, стриминг |
| On-chain действий | 1 (transfer) | 2+ (deposit + startvest + claims) |
| Возврат | Нет | Да (stopvest возвращает остаток) |
| Верификация | Hyperion tx lookup | Vest table query |
| Газ | **$0** | **$0** |

---

## Ссылки

- [MPP Спецификация](https://mpp.dev)
- [Payment Authentication IETF](https://paymentauth.org)
- [XPR Network](https://xprnetwork.org)
- [WebAuth Кошелёк](https://webauth.com)
- [mppx SDK](https://github.com/wevm/mppx)
- [Playground](https://x402.charliebot.dev)
- [Репозиторий пакета](https://github.com/charliebot87/mpp-xpr)
