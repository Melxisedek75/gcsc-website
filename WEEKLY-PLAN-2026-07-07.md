# GCSC — недельный план 2026-07-07 → 2026-07-13

Разделение: **CODEX** — mobile-подпись WebAuth (X0) + backend/CI (X1–X5, см. `ai-review/CODEX-TASKS-WEEK-2026-07-07.md`). **CLAUDE** — задачи ниже. Founder — только подписи в кошельке, решения по merge/deploy и «да» на публичные изменения.

## CLAUDE — задачи

### C1 — Ревью-циклы веток Codex (постоянно, приоритет 1)
По мере READY_FOR_REVIEW: webauth-signing (X0), rate-limiting (X2), CI (X3), mobile-ux (X5). Независимый прогон тех же команд, вердикт в записи, один круг до APPROVED. После APPROVED + «да» founder — merge.

### C2 — Homepage v1.3: сравнение для решения founder (~1 сессия)
Драфты готовы (`index-v1-3-static-draft.html`, `index-v1-3-draft.html`). Сделать наглядное сравнение «текущая публичная vs v1.3» (скриншоты + таблица отличий: гибридная модель, whitepaper-соответствие, CTA), прогнать 4 homepage-валидатора, отдать founder на решение «меняем/не меняем». Публичный `index.html` НЕ трогать.

### C3 — Whitepaper v1.3: консистентность (~1 сессия)
`whitepaper-v1-3-draft.html`: вычитка против гибридной модели («trust infrastructure сейчас, token/Web3 — vision»), сверка цифр токеномики с CLAUDE.md, прогон narrative-aligner (сайт ↔ whitepaper ↔ инструкции). Отчёт с находками, правки в драфте.

### C4 — android-preflight: зелёный run-checks (~0.5 сессии)
`check:android-preflight` падает (нет `public/smartcontractor.html` / `capacitor.config.json`). Разобраться, что валидатор ожидает: восстановить файлы или обновить валидатор под текущую структуру (mobile переехал на Expo). Цель: `node construction-ai/scripts/run-checks.mjs` — все чеки PASS.

### C5 — Смарт-контракты: статус testnet-деплоя (~1 сессия)
По CLAUDE.md: gcsctoken111 задеплоен; gcscbuild11/gcscticket1/gcscbounty1 — скомпилированы, аккаунты не созданы. Проверить фактический статус на testnet (explorer/API), составить деплой-план: какие аккаунты создать, какие команды, что требует подписи founder. Сам деплой — только с founder.

### C6 — Пятничный статус (2026-07-11)
Полный прогон проверок обоих репо + короткий статус founder'у: что закрыто, что открыто, блокеры, план на следующую неделю.

## Вехи недели

1. 🔑 Подпись 50 XPR проходит на телефоне (X0 Codex + ревью CLAUDE + подпись founder).
2. 🏠 Решение founder по homepage v1.3 (C2).
3. 🟢 Все проверки repo зелёные (C4) + CI включён (X3).

## Границы
Merge в main — после кросс-ревью + «да» founder. Без deploy, реальных денег, mainnet, секретов. Публичные `index.html`/`whitepaper.html` — только после решения founder по C2.
