# Промт для Codex — согласованная работа с Claude

Работай из `C:\gcsc`. Сначала прочитай `AGENTS.md`, `AI-REVIEW-GATE.md`, `ai-review/records/2026-07-01-monthly-audit.md` и `ai-review/CLAUDE-REVIEW-PROMPT.md`.

Ты работаешь в паре с Claude Code над закрытием P0/P1 из аудита 2026-07-01 и подготовкой deploy. Claude уже исправил 7 из 9 находок в трёх ветках. Твоя зона — то, что осталось на backend, плюс перекрёстная проверка.

## Где мы коннектимся (общая точка)

- **Код:** ветки на GitHub. Одна ветка = одна задача = одна review-запись.
  - `gcsc-website`: репо сайта + mobile (`mobile/smartcontractor`) + `construction-ai`.
  - `gcsc-smart-contractor`: backend (`v3/pure-server.js`). Локальная рабочая копия: `C:\gcsc\.tmp\gcsc-smart-contractor-audit`.
- **Проверки и решения:** файлы в `ai-review/records/`. Каждый из нас создаёт запись из `ai-review/TEMPLATE.md`.
- **Правило:** автор и reviewer ВСЕГДА разные. Ты подписываешь `Author AI: CODEX`. Claude ставит `Reviewer AI: CLAUDE` и наоборот. `APPROVED` ставит только второй агент.

## Твоя часть работы (Codex)

### 1. P1-3 — persist payment receipts в Postgres
В `v3/pure-server.js` таблицы `payment_receipts`, `lead_tokens`, `job_posting_payments` живут только в памяти (`db.*.push`). После restart replay-защита исчезает.
- Создай Postgres-таблицы с `UNIQUE(tx_hash)` (следуй существующему паттерну `USE_POSTGRES` / `queryPostgres` / `CREATE TABLE IF NOT EXISTS`, как для `milestone_chain_txs`).
- Замени in-memory `.push` на atomic insert; полагайся на `UNIQUE(tx_hash)` для replay-защиты (лови конфликт → 409).
- Проверь на живой БД (Railway `DATABASE_URL`), не только синтаксисом.
- Ветка: `fix/p1-3-persist-receipts`. Запись: `ai-review/records/2026-07-DD-p1-3-persist.md`.

### 2. Ревью моих (Claude) веток
Проверь независимо, не доверяй на слово:
- `fix/p0-3-chain-id` (P0-1 JWT retry, P0-2 project_id, P0-3 chain ID) — mobile.
- `fix/p1-4-ci-runner` (P1-4 runner drift) — construction-ai.
- `fix/p1-1-sender-binding` (P1-1/P1-2/P1-5) — backend.
Прогони проверки сам (`tsc --noEmit`, `node --check`, `npm run check`), впиши reviewer notes в `ai-review/records/2026-07-01-monthly-audit.md`. Если P0/P1 подтверждён исправленным и проверки прошли — можешь поставить `APPROVED` для конкретной ветки (ты reviewer, я author — это разрешено).

### 3. Deploy своей части
После founder approval и `AI_REVIEW_GATE=PASS`: деплой backend (`v3/pure-server.js`) на Railway. Проверь логи и `/api` health после деплоя. Backend-миграции Postgres (P1-3) — твоя ответственность.

## Часть Claude (не трогай, только ревьюишь)

- P1-6 — homepage v1.3 draft (`index-v1-3-static-draft.html` и др.), фронт/HTML.
- Mobile/website deploy.
- Claude ревьюит твою backend-работу (P1-3) перед merge.

## Протокол цикла (повторяем)

1. Автор делает задачу в своей ветке + review-запись (scope, risk, изменённые файлы, проверки).
2. Автор пушит ветку, ставит `Author status: READY_FOR_REVIEW`.
3. Второй агент независимо проверяет diff + прогоняет проверки сам.
4. Reviewer ставит `CHANGES_REQUESTED` (с списком) или `APPROVED`.
5. Автор чинит всё P0/P1, reviewer повторяет.
6. Перед merge/deploy: `powershell -ExecutionPolicy Bypass -File execution/ai-review-gate.ps1 -ReviewFile ai-review/records/<файл>.md`.
7. Merge/deploy только при `AI_REVIEW_GATE=PASS` + founder approval для live-risk.

## Границы (стоп — только founder)

Реальные деньги (не testnet), mainnet, production release, публичная замена сайта, секреты, внешние аккаунты, live Supabase, реальные платежи/займы/escrow, XPR/FIO подписи, legal/provider commitments, destructive на production-данные. Всё остальное — делаешь сам, без переспрашивания.

## Что вернуть founder в конце
Короткий отчёт на русском: что сделал, что отревьюил у Claude, что задеплоил, что осталось. Остановись до любого live-risk действия.
