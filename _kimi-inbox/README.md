# Kimi → Claude Handoff Inbox

Эта папка — почтовый ящик между **Kimi K2** (генерирует UI/контент) и **Claude Code** (интегрирует в проект).

## Как пользоваться (для founder'а)

### Шаг 1. Скажи Kimi что нужно

Открой [kimi.moonshot.cn](https://kimi.moonshot.cn) или Kimi-чат. Вставь один из готовых промтов из `templates/`, замени плейсхолдеры в `[квадратных скобках]`.

Пример: «Сгенерируй React Native screen `JobDetail.tsx` для homeowner. Кликнул на job → видит детали + milestones + статус. Stack: Expo Router, TypeScript, токены из `lib/tokens.ts` (colors.brand, spacing.md). Match style of `app/(homeowner)/post-job.tsx`. Не используй внешние UI-библиотеки.»

### Шаг 2. Положи ответ Kimi в эту папку

1. В чате Kimi нажми «Copy code» (или просто выдели + Ctrl+C)
2. Открой [github.com/Melxisedek75/gcsc-website](https://github.com/Melxisedek75/gcsc-website)
3. Зайди в папку `_kimi-inbox/`
4. Нажми **Add file → Create new file**
5. Имя файла: `YYYY-MM-DD_kratkoye-opisanie.tsx` (например `2026-06-28_job-detail-screen.tsx`)
6. Вставь код Kimi в текстовое поле
7. Внизу — **Commit new file** (можно прямо в `main`)

### Шаг 3. Claude подхватит автоматически

При коммите в `_kimi-inbox/` GitHub Action создаст issue с лейблом `kimi-handoff` и пингнёт Claude в следующей сессии.

В следующей сессии скажи Claude: **«разбери kimi-inbox»** — он:
1. Прочитает все новые файлы
2. Проверит код (typecheck, паттерны, безопасность)
3. Переместит в правильное место (`mobile/smartcontractor/app/...`)
4. Поправит импорты, типы, навигацию
5. Закоммитит и закроет issue

---

## Что отдавать Kimi (рутинка)

✅ **Хорошие задачи для Kimi:**
- UI экраны (детали job, форма bid, chat, milestones)
- Email шаблоны, push-уведомления
- Контент для сайта (FAQ, landing блоки, hero copy)
- App Store / Play Store описания, ASO keywords
- Маркетинговые посты, twitter threads
- Документация для пользователей

❌ **НЕ давать Kimi (это Claude делает):**
- Auth, payments, WebAuth integration
- Логика касающаяся JWT, AsyncStorage, contract addresses
- Backend endpoints, серверный код
- Архитектурные решения, навигация app
- Smart contracts (proton-tsc)

---

## Шаблоны промтов

Готовые шаблоны для частых задач — см. `templates/`:

- `screen.md` — генерация React Native экрана
- `email.md` — email шаблон
- `marketing-post.md` — соц-сеть пост
- `site-content.md` — блок для сайта
