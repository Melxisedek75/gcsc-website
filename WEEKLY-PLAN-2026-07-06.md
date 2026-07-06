# Недельный план 2026-07-06 → 2026-07-12

Контекст: все 9 P0/P1 месячного аудита закрыты, 4 ветки смёржены в main (founder «да» 2026-07-05).
Деплой backend ждёт DATABASE_URL (Railway) от founder.

## Задачи CLAUDE

| # | Задача | Приоритет | Критерий готовности |
|---|--------|-----------|---------------------|
| C1 | Deploy backend на Railway после получения DATABASE_URL: прогнать `payment-receipts-postgres.test.js` против staging-БД, проверить `/health`, `DB: postgres` | P0 | live health-check + запись в ai-review |
| C2 | Mobile: собрать Expo dev-build с новым 402-flow (JWT retry, project_id, chain id `71ee83bc`) и прогнать e2e против задеплоенного backend | P0 | Lead Token 50 XPR проходит end-to-end на testnet |
| C3 | Homepage v1.3: подготовить финальный вариант `index-v1-3-draft.html` → предложение founder'у по замене публичного `index.html` (сам НЕ заменяю) | P1 | side-by-side сравнение + чек-лист для founder |
| C4 | Wallet connect UI: экран challenge → sign (WebAuth) → connect в mobile под новый ownership-proof API | P1 | экран работает против testnet, код в ветке + review-запись |
| C5 | Убрать pre-existing FAIL `check:android-preflight` (отсутствует `public/smartcontractor.html`) — восстановить файл или скорректировать проверку | P2 | `run-checks.mjs` полностью зелёный |
| C6 | Пятничный мини-аудит: прогнать все валидаторы + тесты в обоих репо, статус founder'у | P2 | статус-отчёт 2026-07-11 |

## Задачи CODEX

| # | Задача | Приоритет | Критерий готовности |
|---|--------|-----------|---------------------|
| X1 | Post-merge review `92f6cb3` в gcsc-smart-contractor (разрешение конфликтов P1-3×P1-1) по `ai-review/records/2026-07-05-integration-merge.md` | P0 | вердикт в записи; exact-команды: payments 24/24, pg-storage, pg-workflow |
| X2 | LOW из прошлого цикла: явный timeout в `beforeAll` в `v3/tests/payment-receipts-postgres.test.js` (холодный старт > 5s) | P1 | test-only коммит + зелёный прогон против Docker postgres:16-alpine |
| X3 | Rate limiting на payment/auth endpoints (`/api/payment/*`, `/api/auth/*`, `/api/wallet/*`) — по аудиту security-чеклиста | P1 | ветка + тесты + review-запись для Claude |
| X4 | Консолидация по `ai-review/CODEX-CONSOLIDATION-PLAN.md`: удалить устаревшую ветку `fix/p1-4-ci-runner`, вычистить дубли клонов (`.tmp` и worktrees) | P2 | PROJECT-MAP.md обновлён |
| X5 | CI: GitHub Actions workflow (node --check + jest + валидаторы) — подготовить, НЕ включать до снятия billing lock | P2 | workflow-файл в ветке, готов к merge |

## Ждём от FOUNDER
1. **DATABASE_URL** (Railway) — блокирует C1/C2.
2. **GitHub billing lock** снять — блокирует X5 (Actions).
3. Решение по замене публичного `index.html` на v1.3 (после C3).

## Правила недели
- Автор ≠ reviewer (AI-REVIEW-GATE), «зелёное перед передачей», один круг ревью.
- Без founder: никаких mainnet, реальных денег, замены публичных страниц, новых платных сервисов.
