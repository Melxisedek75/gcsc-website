# GCSC / SmartContractor — карта проекта (где что лежит)

> Единый указатель для founder, Claude и Codex. Обновляй при переносе файлов/веток.
> Последнее обновление: 2026-07-04.

## 1. Два репозитория (пока раздельные)

| Репо | GitHub | Локальная папка | Что внутри |
|---|---|---|---|
| **gcsc-website** (главный) | `Melxisedek75/gcsc-website` | `C:\gcsc` | сайт, mobile-приложение, construction-ai, контракты, docs, ai-review |
| **gcsc-smart-contractor** (backend) | `Melxisedek75/gcsc-smart-contractor` | `C:\Users\rivne\gcsc-v3` | backend v3 (API-сервер, платежи, Postgres) |

Дополнительные локальные копии/worktree (не путать с рабочими):
- `C:\Users\rivne\gcsc-website-xpr` — вторая копия gcsc-website.
- `C:\Users\rivne\.config\superpowers\worktrees\gcsc-review\*` — временные worktree для ревью (p0-3, p1-4, p1-6).
- Планируется: объединить backend внутрь `gcsc-website/backend/` (см. `ai-review/CODEX-CONSOLIDATION-PLAN.md`).

## 2. gcsc-website (`C:\gcsc`) — ключевые файлы

- **Инструкции ИИ (идентичны):** `.claude/CLAUDE.md`, `AGENTS.md`, `GEMINI.md`
- **Review-гейт:** `AI-REVIEW-GATE.md` + скрипт `execution/ai-review-gate.ps1`
- **ai-review/**
  - `records/` — записи ревью (`2026-07-03-p0-mobile-payment-contract.md`, `-p1-1-sender-binding.md`, `-p1-3-persist.md`, `-p1-6-homepage-draft.md`, `2026-07-01-monthly-audit.md`)
  - `TEMPLATE.md` — шаблон записи
  - `CODEX-REVIEW-PROMPT.md` — задание Codex на ревью (сейчас: финальный P1-1)
  - `CODEX-CONSOLIDATION-PLAN.md` — план слияния + монорепо
  - `CODEX-WORK-PROMPT.md`, `CLAUDE-REVIEW-PROMPT.md` — прочие промты
- **Mobile-приложение:** `mobile/smartcontractor/`
  - `lib/payments.ts` (402-flow), `lib/webauth.ts` (chain ID), `lib/jobs.ts` (createBackendProject), `lib/i18n.ts`
  - `app/(homeowner)/post-job.tsx`, `app/(auth)/sign-in.tsx`
  - проверка: `npx tsc --noEmit` (из `mobile/smartcontractor`)
- **construction-ai/** — валидаторы и скрипты
  - `scripts/run-checks.mjs` — общий прогон всех проверок
  - `scripts/validate-homepage-v1-3-w3c.mjs` / `-seo.mjs` / `-performance.mjs` / `-static-draft.mjs` — 4 homepage-валидатора
  - `scripts/validate-whitepaper-v1-3-*.mjs` — валидаторы whitepaper
  - `package.json` — npm-скрипты `check:homepage:*`, `check`
- **Homepage-черновики (internal, NO-GO):** `index-v1-3-static-draft.html`, `index-v1-3-draft.html`, `whitepaper-v1-3-draft.html`
- **Публичные (НЕ менять без founder):** `index.html`, `whitepaper.html`
- **Контракты (proton-tsc):** `contracts/gcsc-core/`, `gcsctoken111/`, `gcscbuild11/`
- **Документы:** `docs/` (в т.ч. `docs/whitepaper-v1-3-*`, `docs/mppx-xpr-network.md`, `docs/PAYMENT-402-PATCH.md`)

## 3. gcsc-smart-contractor (`C:\Users\rivne\gcsc-v3`) — backend

- **Сервер:** `v3/pure-server.js`
- **Тесты:** `v3/tests/`
  - `payments-402.test.js` — payment suite (402-flow, sender binding, wallet ownership proof)
  - `postgres-storage-smoke.js`, `postgres-workflow-smoke.js`, `payment-receipts-postgres.test.js`
- **Скрипты:** `v3/package.json` → `test`, `test:pg-storage`, `test:pg-workflow`
- **НЕ коммитить:** `v3/gcsc.db` (локальная SQLite)

## 4. Как запускать проверки (команды + откуда)

**Backend** (из `C:\Users\rivne\gcsc-v3\v3`):
```
node --check pure-server.js
npx jest tests/payments-402.test.js --runInBand --detectOpenHandles
npm run test:pg-storage
npm run test:pg-workflow
```

## Local provenance inventory

`docs/architecture/2026-08-system-inventory.md` and
`docs/architecture/2026-08-component-provenance.csv` are the authoritative
local inventory for this repository. Their validator reads only `C:\gcsc` and
requires any component outside the tracked root to be marked
`EXTERNAL_SOURCE_NOT_PRESENT` until separately imported and reviewed.

**Homepage / общий прогон** (из `C:\gcsc\construction-ai`):
```
npm run check:homepage:w3c
npm run check:homepage:seo
npm run check:homepage:performance
npm run check:homepage-v1-3-static-draft
npm run check
```

**Mobile** (из `C:\gcsc\mobile\smartcontractor`):
```
npx tsc --noEmit
```

**Review-гейт** (из `C:\gcsc`):
```
powershell -ExecutionPolicy Bypass -File execution/ai-review-gate.ps1 -ReviewFile ai-review/records/<файл>.md
```

## 5. Ветки и статус (на 2026-07-04)

**gcsc-website** (main @ `d9d79c43`):
| Ветка | Head | Статус |
|---|---|---|
| `fix/p0-3-chain-id` | `8a19d5f6` | APPROVED Codex (запись на ветке `codex/review-claude-repairs-2026-07-03`) |
| `fix/p1-6-homepage-v1-3-draft` | последний | APPROVED Codex + содержит все process-докы |
| `codex/review-claude-repairs-2026-07-03` | — | записи Codex с APPROVED по P0-3 и P1-6 |

**gcsc-smart-contractor** (main @ `d62cfd03`):
| Ветка | Head | Статус |
|---|---|---|
| `fix/p1-1-sender-binding` | `9d5318b` | код APPROVED Codex; ждёт финального APPROVED после фикса flaky-тестов |
| `fix/p1-3-persist-receipts` | `a81df24b` | APPROVED Claude |

## 6. Почему слияние отложено (важно)

1. **APPROVED от Codex лежат на отдельной ветке** `codex/review-claude-repairs-2026-07-03`, а не на fix-ветках → при merge в `main` будут конфликты на файлах записей (`CHANGES_REQUESTED` vs `APPROVED` в одних строках).
2. **`fix/p1-1-sender-binding` и `fix/p1-3-persist-receipts` расходятся** — обе переписывают `v3/pure-server.js` по-разному (≈489 строк отличий). Слить обе в `main` без предварительного согласования = тяжёлые конфликты. Их надо сперва свести в одну линию.
3. `fix/p1-1` ждёт финального APPROVED Codex.

**Вывод:** сначала (а) Codex ставит финальный APPROVED по `9d5318b`; (б) сводим p1-1+p1-3 backend в одну ветку без конфликтов; (в) переносим APPROVED-записи на fix-ветки; (г) только потом чистый merge в `main`. Делаем при явном «да» founder. Deploy — отдельно, только founder.

## 7. Память и знания

- Индекс памяти: `C:\Users\rivne\.claude\projects\C--gcsc\memory\MEMORY.md`
- Состояние аудита: `.../memory/session_2026-07-03_audit-repair.md`
- Быстрые ссылки (GitHub, сайт, testnet, explorer) — в `MEMORY.md`.

## 8. Границы (стоп — только founder)
Merge в `main`, deploy, публичная замена `index.html`/`whitepaper.html`, mainnet, Railway/production, реальные платежи/займы/escrow, секреты, внешние аккаунты, XPR/FIO подписи, destructive на production.
