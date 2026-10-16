# XPR Network — Quick Reference

> Обновлено: 27 марта 2026 | Полная версия: `XPR_Network_Developer_Reference.md`

---

## Быстрый старт

```bash
npm i -g @proton/cli           # установить CLI
proton boilerplate my-project  # создать проект
cd my-project && npm test      # запустить тесты
proton contract:set ACCOUNT .  # задеплоить
```

---

## Ключевые команды CLI

| Команда | Описание |
|---------|----------|
| `proton boilerplate [FOLDER]` | Новый проект (контракт + UI + тесты) |
| `proton generate:contract [NAME]` | Новый смарт-контракт |
| `proton generate:action` | Добавить action |
| `proton generate:table [NAME]` | Добавить таблицу |
| `proton contract:set [ACCOUNT] [DIR]` | Деплой контракта |

---

## Web SDK — минимальная интеграция

```typescript
import { ConnectWallet } from '@proton/web-sdk'

const { link, session } = await ConnectWallet({
  linkOptions: { endpoints: ['https://proton.greymass.com'] },
  selectorOptions: { appName: 'My App' },
  transportOptions: { requestAccount: 'myaccount' }
})
```

---

## Важные ссылки

| | |
|--|--|
| 📚 Документация | https://docs.xprnetwork.org |
| 💻 GitHub | https://github.com/XPRNetwork |
| 🔧 developer-examples | https://github.com/XPRNetwork/developer-examples |
| 🛠 CLI usage | https://docs.xprnetwork.org/cli/usage |
| 🖥 Web SDK | https://docs.xprnetwork.org/client-sdks/web.html |
| 🤖 AI+NFT пример | https://github.com/XPRNetwork/xpr-ai-nft-mint |
| 🧪 Тестирование | https://docs.xprnetwork.org/contract-sdk/testing.html |
| 🏦 Backend примеры | https://github.com/XPRNetwork/xpr-backend-examples |

---

## Установка пакетов

```bash
npm i @proton/web-sdk    # фронтенд / React
npm i -g @proton/cli     # CLI глобально
npm i @proton/vert       # тестирование контрактов
```

---

## Структура контракта (минимальная)

```typescript
import { Contract, Name } from "proton-tsc"

@contract
class MyContract extends Contract {
  @action("myaction")
  myAction(user: Name): void {
    print(`Hello ${user}!`)
  }
}
```

---

*Подробности → `XPR_Network_Developer_Reference.md`*
