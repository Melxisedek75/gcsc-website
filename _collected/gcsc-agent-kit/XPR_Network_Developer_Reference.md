# XPR Network — Developer Reference

> Сохранено: 27 марта 2026 г.
> Источник: https://github.com/XPRNetwork/developer-examples
> Документация: https://docs.xprnetwork.org

---

## Что такое XPR Network

XPR Network (бывший Proton) — высокопроизводительный блокчейн с поддержкой TypeScript смарт-контрактов. Основные характеристики:

- **4000 TPS** — смарт-контракты компилируются в WASM
- **Бесплатные транзакции** для конечных пользователей (нет gas fees)
- **Compliant** — встроенная KYC-верификация через WebAuth
- **NFT** — стандарт Atomic Assets с маркетплейсом
- **DeFi** — DEX Metal X, lending protocol

---

## Репозитории XPRNetwork на GitHub

| Репозиторий | Описание | Ссылка |
|-------------|----------|--------|
| **developer-examples** | Все примеры курса разработчика | https://github.com/XPRNetwork/developer-examples |
| **ts-smart-contracts** | TypeScript смарт-контракты | https://github.com/XPRNetwork/ts-smart-contracts |
| **proton-boilerplate** | Boilerplate: контракт + фронтенд + тесты | https://github.com/XPRNetwork/proton-boilerplate |
| **proton-cli** | CLI инструмент | https://github.com/XPRNetwork/proton-cli |
| **proton-web-sdk** | Web SDK для фронтенда | https://github.com/XPRNetwork/proton-web-sdk |
| **xpr-backend-examples** | Backend примеры транзакций | https://github.com/XPRNetwork/xpr-backend-examples |
| **xpr-ide** | IDE для TypeScript контрактов | https://github.com/XPRNetwork/xpr-ide |
| **xpr-ai-nft-mint** | AI + NFT mint пример | https://github.com/XPRNetwork/xpr-ai-nft-mint |
| **xpr-loan-liquidation-bot** | Бот ликвидации займов | https://github.com/XPRNetwork/xpr-loan-liquidation-bot |
| **xpr.start** | Стартовый шаблон | https://github.com/XPRNetwork/xpr.start |
| **hyperion-api** | Hyperion API примеры | https://github.com/XPRNetwork/hyperion-api |

---

## Установка CLI

```bash
# через npm
npm i -g @proton/cli

# через yarn
yarn global add @proton/cli

# Если ошибка доступа на Mac/Linux:
sudo chown -R $USER /usr/local/lib/node_modules
sudo chown -R $USER /usr/local/bin
```

**Зависимости:** NodeJS (рекомендуется через NVM)

```bash
# Установка NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

---

## CLI — Основные команды

### Создание проекта

```bash
# Boilerplate проект (контракт + фронтенд + тесты)
proton boilerplate [FOLDER]

# Новый смарт-контракт
proton generate:contract [CONTRACTNAME]

# Добавить action к контракту
proton generate:action

# Сгенерировать TypeScript таблицы
proton generate:table [TABLENAME]
```

> **Требования к именам:** 1–12 символов, только a-z и цифры 1-5

### Деплой

```bash
# Деплой контракта (WASM + ABI)
proton contract:set [ACCOUNT] [SOURCE]
```

### Тестирование

```bash
# Playground — быстрое тестирование action через @proton/vert
# Полные тесты — Mocha + Chai
npm test
```

---

## Web SDK (@proton/web-sdk)

### Установка

```bash
npm i @proton/web-sdk
# или
yarn add @proton/web-sdk
```

### Базовая интеграция (React / Next.js)

```typescript
import { ConnectWallet } from '@proton/web-sdk'

// ConnectWallet экспонирует только 2 функции: ConnectWallet и disconnect
const result = await ConnectWallet({
  linkOptions: {
    endpoints: ['https://proton.greymass.com'],
    restoreSession: true
  },
  selectorOptions: {
    appName: 'My DApp',
    enabledWalletTypes: ['proton', 'webauth']
  },
  transportOptions: {
    requestAccount: 'myaccount'
  }
})
```

### Конфигурация SDK

```typescript
const ProtonSDK = {
  chainId: 'YOUR_CHAIN_ID',
  endpoints: [
    'https://proton.greymass.com',    // fault tolerance
    'https://proton.eoscalidad.io'
  ],
  appName: 'My App',
  requestAccount: 'myaccount'
}
```

**Документация Web SDK:** https://docs.xprnetwork.org/client-sdks/web.html
**Примеры:** https://github.com/XPRNetwork/proton-web-sdk/tree/master/examples

---

## Backend Examples (xpr-backend-examples)

Репозиторий: https://github.com/XPRNetwork/xpr-backend-examples

### Setup

```bash
git clone https://github.com/XPRNetwork/xpr-backend-examples
cd xpr-backend-examples
cp .env.example .env      # вставить приватный ключ
npm install
# Отредактировать index.js — выбрать нужную функцию
node index.js
```

### Доступные примеры

- **Transfer NFT** — передача NFT токенов
- **Get Creator Fee Balances** — получение баланса комиссий
- **Withdraw Creator Fees** — вывод комиссий создателя
- **FOOBAR Faucet** — демо фaucet с тестовыми токенами
- **Liquidation Bot** — поиск и исполнение ликвидаций займов

---

## AI + NFT: xpr-ai-nft-mint

Репозиторий: https://github.com/XPRNetwork/xpr-ai-nft-mint

Полный стек приложения **MintMe**:
1. Пользователь подключает WebAuth кошелёк
2. Эскроу токены для получения "tickets"
3. Генерация AI изображения через tickets
4. Минт изображения как NFT в Atomic Assets коллекцию

---

## NFT разработка (Atomic Assets)

### Основные операции

- Создание коллекций (collections)
- Создание схем (schemas)
- Создание шаблонов (templates)
- Минт ассетов (assets)
- White label NFT маркетплейс

### Полезные ссылки

- **NFT маркетплейс:** https://nft.xprnetwork.org
- **Гайд для разработчиков (часть 1):** https://xprnetwork.org/blog/guide-to-nfts-on-xpr-network-for-developers
- **Гайд для разработчиков (часть 2):** https://xprnetwork.org/blog/nfts-on-xpr-network-for-developers-part-2

---

## Смарт-контракты (TypeScript)

### Структура проекта

```
my-contract/
├── assembly/
│   ├── index.ts       # точка входа контракта
│   ├── contract.ts    # логика контракта
│   └── *.spec.ts      # тесты
├── include/
├── build/             # скомпилированный WASM + ABI
├── playground.ts      # быстрое тестирование
└── package.json
```

### Пример Action

```typescript
import { Contract, Name, check } from "proton-tsc"

@contract
class HelloContract extends Contract {
  @action("hello")
  hello(name: Name): void {
    check(name.toString() !== "", "Name cannot be empty")
    print(`Hello, ${name}!`)
  }
}
```

### Пример Table (inline storage)

```typescript
@table("accounts")
class Account extends Table {
  constructor(
    public account: Name = new Name(),
    public balance: u64 = 0
  ) { super() }

  @primary
  get primary(): u64 { return this.account.value }
}
```

---

## Полезные ресурсы

| Ресурс | Ссылка |
|--------|--------|
| Главная документация | https://docs.xprnetwork.org |
| Intro / Getting Started | https://docs.xprnetwork.org/getting-started/introduction |
| CLI Usage | https://docs.xprnetwork.org/cli/usage |
| Написать первый контракт | https://docs.xprnetwork.org/smart-contracts/write-your-first-smart-contract.html |
| Первый DApp с Web SDK | https://docs.xprnetwork.org/your-first-dapp-with-the-web-sdk/your-first-dapp-with-the-web-sdk |
| Тестирование контрактов | https://docs.xprnetwork.org/contract-sdk/testing.html |
| Безопасность | https://docs.xprnetwork.org/contract-sdk/security.html |
| Storage / Tables | https://docs.xprnetwork.org/contract-sdk/storage.html |
| Бесплатный аккаунт (CLI) | https://docs.xprnetwork.org/cli/examples/free-new-account.html |
| React Native SDK | https://docs.xprnetwork.org/client-sdks/react-native.html |
| Kotlin SDK | https://docs.xprnetwork.org/client-sdks/kotlin.html |
| Built with XPR Network | https://docs.xprnetwork.org/built-with-xpr-network |
| GitHub организация | https://github.com/XPRNetwork |

---

## Тестовая сеть

- **Testnet boilerplate:** https://github.com/XPRNetwork/xpr-testnet.start
- **FOOBAR токены** — тестовые токены через фaucet

---

## Экосистема

| Приложение | Описание |
|------------|----------|
| **WebAuth.com** | Кошелёк / аутентификация |
| **Metal X** | DEX (децентрализованная биржа) |
| **NFT Market** | Маркетплейс NFT (nft.xprnetwork.org) |
| **Lending Protocol** | Протокол займов |

---

*Файл создан автоматически 27 марта 2026. При необходимости обновить — запустить повторную загрузку из https://github.com/XPRNetwork/developer-examples*
