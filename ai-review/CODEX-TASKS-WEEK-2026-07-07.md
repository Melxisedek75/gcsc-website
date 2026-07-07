# CODEX — задачи на неделю 2026-07-07 → 2026-07-13

Ты — CODEX, второй инженер пары (протокол `AI-REVIEW-GATE.md`, правило «зелёное перед передачей»). Работай автономно, по-русски. Автор ≠ reviewer: твои ветки ревьюит CLAUDE, его — ты.

## Контекст (что уже сделано)

- Месячный аудит: 9/9 P0/P1 закрыты, все 4 ветки APPROVED и смёржены в main обоих репо.
- Backend жив на Railway: `https://gcsc-backend-production.up.railway.app` (health 200, `database: postgres`).
- Mobile blackscreen: твой фикс `a642db90` (root-layout lifecycle) — **APPROVED CLAUDE** (`7c11ed1c`), APK собран, ждём подтверждения founder на устройстве. В main НЕ смёржен.
- GitHub billing: проверен, блокировки нет — CI можно включать.

## Репозитории

| Что | Путь | Remote |
|---|---|---|
| Website + mobile + docs | `C:\gcsc` | github.com/Melxisedek75/gcsc-website |
| Backend v3 | `C:\Users\rivne\gcsc-v3` | gcsc-smart-contractor |

Перед стартом каждой задачи: `git pull` в обоих репо.

---

## X1 — Пост-мердж ревью backend main (приоритет 1, ~1 сессия)

Repo `C:\Users\rivne\gcsc-v3`, merge-коммит `92f6cb3` (интеграция p1-3 + p1-1: Postgres receipts + sender binding + wallet ownership, конфликты разрешал CLAUDE).

1. Инспектируй merge-diff: не потерян ли код одной из веток (expectedFrom, wallet_required, UNIQUE(tx_hash), K1 challenge/connect).
2. Прогони: `npx jest tests/payments-402.test.js --runInBand --detectOpenHandles` (ожидание 24/24), `npm run test:pg-storage` ×2, `npm run test:pg-workflow` ×2.
3. Вердикт в `C:\gcsc\ai-review\records\2026-07-05-integration-merge.md` (секция Post-merge Review, Author: CLAUDE, Reviewer: CODEX).

## X2 — Rate limiting на auth/payment (приоритет 2, ~1-2 сессии)

Repo `C:\Users\rivne\gcsc-v3`, ветка `fix/rate-limiting`.

1. In-memory limiter в `v3/pure-server.js` (без новых зависимостей): скользящее окно на IP+route.
2. Лимиты: `/api/auth/login` и `/api/auth/register` — 10/мин; `/api/payment/*` — 30/мин; `/api/wallet/challenge` + `/api/wallet/connect` — 10/мин. Ответ 429 `{"error":"Too many requests","code":"rate_limited"}`.
3. Тесты в отдельном файле (не трогай существующие suites), полный прогон всех трёх suites до зелёного.
4. Запись `ai-review/records/2026-07-07-rate-limiting.md` → READY_FOR_REVIEW (CLAUDE).

## X3 — GitHub Actions CI (приоритет 3, ~1 сессия)

Billing OK. Ветки `ci/github-actions` в обоих репо.

1. **gcsc-smart-contractor**: workflow на push/PR — `node --check v3/pure-server.js` + payments suite + pg-storage (postgres service container postgres:16-alpine, ubuntu-latest).
2. **gcsc-website**: workflow — `node construction-ai/scripts/run-checks.mjs` (учти: `check:android-preflight` сейчас падает из-за отсутствующего `public/smartcontractor.html` — этот чек пометь `continue-on-error` или исключи с комментарием, его чинит CLAUDE, задача C5) + `tsc --noEmit` для `mobile/smartcontractor` (npm ci с `.npmrc` legacy-peer-deps).
3. НЕ мержи: READY_FOR_REVIEW запись + PR-ветки, merge после ревью CLAUDE и «да» founder.

## X4 — Гигиена веток и worktree (приоритет 4, ~0.5 сессии)

1. В обоих репо: список веток, чьи головы — предки main (`git branch --merged main`) → кандидаты на удаление. УДАЛЯЙ только после проверки ancestor; force-удаление несмёрженных — запрещено.
2. Устаревшая `fix/p1-4-ci-runner` (заменена p1-6) — удалить локально и на origin.
3. Отчёт одним файлом `ai-review/records/2026-07-07-branch-hygiene.md`: что удалено, что оставлено и почему. `fix/mobile-blackscreen` НЕ трогай до merge.

## X5 — Mobile мелочи после подтверждения blackscreen-фикса (~0.5 сессии)

Ветка `fix/mobile-ux-small` поверх `fix/mobile-blackscreen` (или main после его merge). Только после того, как founder подтвердит, что APK открывается.

1. `app/_layout.tsx`: overlay спиннера — убрать `pointerEvents="none"` (сейчас тапы проходят сквозь спиннер к экрану под ним) → `pointerEvents="auto"`.
2. `app/(auth)/sign-in.tsx`: кнопка «Continue with WebAuth wallet» — no-op (`onPress={() => {}}`). Скрой её (закомментируй с TODO) — реализация wallet-login отдельной задачей позже.
3. `npx tsc --noEmit` PASS, запись, READY_FOR_REVIEW.

## Backlog (НЕ начинать без координации)

- Lazy-load `@proton/signing-request` (dynamic import в момент подписи) — только если blackscreen вернётся; правило одной переменной.
- `newArchEnabled: false` — только как отдельная ветка-гипотеза, если фикс a642db90 не подтвердится на устройстве.

## Границы (стандартные)

Без merge в main без ревью+founder, без deploy/production release, без реальных денег/mainnet/секретов (EXPO_TOKEN спрашивай у founder, НЕ коммить), публичные `index.html`/`whitepaper.html` не трогать. Все прогоны — на медленном Windows-runner founder'а: flaky-тесты гоняй 2-3 раза до стабильного зелёного ПЕРЕД передачей.
