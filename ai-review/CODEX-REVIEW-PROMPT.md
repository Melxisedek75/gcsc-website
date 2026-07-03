# Промт для Codex — постоянная проверка работы Claude

Работай из `C:\gcsc`. Сначала прочитай `AGENTS.md`, `AI-REVIEW-GATE.md`, `ai-review/CODEX-WORK-PROMPT.md` и обе review-записи:
`ai-review/records/2026-07-01-monthly-audit.md` и `ai-review/records/2026-07-03-p1-6-homepage-draft.md`.

Ты — независимый reviewer работы Claude. Не доверяй его выводам на слово: проверяй каждый diff и прогоняй проверки сам. Это постоянный режим — ты всегда reviewer работы Claude, Claude всегда reviewer твоей работы. Автор ≠ reviewer.

## Что проверить сейчас (3 ветки Claude)

### 1. `fix/p0-3-chain-id` (репо gcsc-website) — P0-1, P0-2, P0-3
- P0-3: `mobile/smartcontractor/lib/webauth.ts` chain ID = `71ee83bc…` (совпадает с backend `XPR_TESTNET_CHAIN_ID`).
- P0-1: `mobile/smartcontractor/lib/payments.ts` retry держит JWT в `Authorization: Bearer`, tx в `X-Payment-Tx`, есть `meta` body.
- P0-2: `post-job.tsx` создаёт backend-проект через `POST /api/projects` до оплаты и шлёт `project_id` в `meta`; `lib/jobs.ts` содержит `createBackendProject`.
- Проверка: `cd mobile/smartcontractor && npx tsc --noEmit` → должен быть PASS.

### 2. `fix/p1-1-sender-binding` (репо gcsc-smart-contractor) — P1-1, P1-2, P1-5
- P1-1: `verifyHyperionTransfer` принимает `expectedFrom`; обе payment routes достают wallet юзера через `findUserById`, требуют привязанный кошелёк (409 `wallet_required`), реджектят `bad_sender`.
- P1-2: `updateProfileFromBody` сохраняет `body.wallet {account,permission}`. ВАЖНО: полного challenge/signature proof пока нет — sender-binding (P1-1) это практическая защита. Оцени, достаточно ли для testnet, или требуй proof.
- P1-5: register больше не ставит `is_verified: 1` при неподтверждённых email/phone (теперь `is_verified: 0`, статус `unverified`).
- Проверка: `node --check v3/pure-server.js` → PASS. Если можешь — подними локально и прогони payment smoke-тест (`payments-402.test.js`).

### 3. `fix/p1-6-homepage-v1-3-draft` (репо gcsc-website) — P1-6 + P1-4
- P1-6: `index-v1-3-static-draft.html` — internal draft, `noindex,nofollow`, `Publication Gate: NO-GO`, формулировки согласованы с whitepaper, без blockchain/token/escrow claims. `index-v1-3-draft.html` — Tailwind CDN стаб.
- P1-4: в `construction-ai/scripts/run-checks.mjs` зарегистрированы все 9 валидаторов (заменяет ветку `fix/p1-4-ci-runner`).
- Проверка (прогони сам из `construction-ai`):
  ```
  node scripts/validate-homepage-v1-3-static-draft.mjs
  node scripts/validate-homepage-v1-3-performance.mjs
  node scripts/validate-homepage-v1-3-seo.mjs
  node scripts/validate-homepage-v1-3-w3c.mjs
  ```
  Все 4 → exit 0. Плюс проверь, что публичные `index.html` и `whitepaper.html` НЕ изменены.

## Как оформить результат

1. Впиши reviewer notes в соответствующую review-запись (`Reviewer AI: CODEX`, поля «Reviewer independently inspected the diff: YES/NO», «independently ran required checks: YES/NO»).
2. Для каждой ветки поставь `Reviewer decision: APPROVED` или `CHANGES_REQUESTED` (со списком обязательных правок).
3. `APPROVED` ставишь только ты (reviewer), только после того как реально прогнал проверки.
4. Перед любым merge/deploy: `powershell -ExecutionPolicy Bypass -File execution/ai-review-gate.ps1 -ReviewFile ai-review/records/<файл>.md` → merge только при `AI_REVIEW_GATE=PASS` + founder approval для live-risk.

## Постоянный цикл (так работаем всегда)

- Claude сделал задачу → создал review-запись `READY_FOR_REVIEW` → ты проверяешь и ставишь decision.
- Ты сделал задачу (напр. P1-3) → создал свою review-запись → Claude проверяет и ставит decision.
- Один PR = одна задача = одна запись. Автор и reviewer всегда разные (`CLAUDE` / `CODEX`).

## Границы (стоп — только founder)
Реальные деньги (не testnet), mainnet, production release, публичная замена `index.html`/`whitepaper.html`, секреты, внешние аккаунты, реальные платежи/займы/escrow, XPR/FIO подписи, legal/provider commitments, destructive на production. Всё остальное — делаешь сам.

## Что вернуть founder
Короткий отчёт на русском: какие ветки отревьюил, что APPROVED, что CHANGES_REQUESTED и почему, что осталось. Остановись до любого live-risk действия.
