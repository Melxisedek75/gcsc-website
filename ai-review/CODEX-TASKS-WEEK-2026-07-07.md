# CODEX — задачи на неделю 2026-07-07 → 2026-07-13

Ты — CODEX, второй инженер пары (протокол `AI-REVIEW-GATE.md`, правило «зелёное перед передачей»). Работай автономно, по-русски. Автор ≠ reviewer: твои ветки ревьюит CLAUDE, его — ты.

## Разделение на неделю

- **CODEX** — владелец mobile-трека: подпись транзакции WebAuth (в работе), затем backend/CI задачи ниже.
- **CLAUDE** — ревью твоих веток, сайт v1.3, whitepaper, android-preflight, контракты, пятничный статус.

## Репозитории

| Что | Путь | Remote |
|---|---|---|
| Website + mobile + docs | `C:\gcsc` | github.com/Melxisedek75/gcsc-website |
| Backend v3 | `C:\Users\rivne\gcsc-v3` | gcsc-smart-contractor |

Перед стартом каждой задачи: `git pull` в обоих репо.

---

## X0 — [В РАБОТЕ] Подпись транзакции WebAuth: «unknown transaction» (приоритет 1)

Симптом: приложение работает, кошелёк подключается, но при оплате bid WebAuth показывает «неизвестная транзакция» и перевод не подписывается.

Это твоя текущая задача — продолжай. Необязательные подсказки от CLAUDE (проверь/отбрось):
1. **Минимальный рукописный ABI** в `sharedSigningRequestOpts()` (`lib/webauth.ts`) — abiProvider отдаёт самодельный eosio.token ABI; если кошелёк не может корректно раскодировать action, он показывает запрос как «unknown». Вариант: тянуть настоящий ABI с `https://testnet.xprnetwork.org/v1/chain/get_abi` или собирать transaction без abiProvider-заглушки.
2. **CHAIN_ID**: testnet `71ee83bc…` — если аккаунт в кошельке mainnet (или кошелёк не в testnet-режиме), запрос чужой сети может отображаться как unknown.
3. **Подмена схемы + несжатый ESR** (`openWithWallet()` меняет префикс `esr:` на `proton-dev:`): проверь, что payload после подмены остаётся валидным SigningRequest для WebAuth (декодируй обратно и сравни).
4. Callback-формат: identity-запрос вернулся успешно (pairing работал), значит транспорт ок — фокус на кодировании transfer-запроса.

Итог: фикс в ветке (одна переменная за раз), запись `ai-review/records/2026-07-07-webauth-signing.md`, READY_FOR_REVIEW → CLAUDE. Финальная проверка — реальная подпись 50.0000 XPR на testnet founder'ом.

## X1 — Пост-мердж ревью backend main (~1 сессия)

Repo `C:\Users\rivne\gcsc-v3`, merge-коммит `92f6cb3` (интеграция p1-3 + p1-1, конфликты разрешал CLAUDE).

1. Инспектируй merge-diff: не потерян ли код (expectedFrom, wallet_required, UNIQUE(tx_hash), K1 challenge/connect).
2. Прогони: `npx jest tests/payments-402.test.js --runInBand --detectOpenHandles` (ожидание 24/24), `npm run test:pg-storage` ×2, `npm run test:pg-workflow` ×2.
3. Вердикт в `C:\gcsc\ai-review\records\2026-07-05-integration-merge.md` (секция Post-merge Review, Reviewer: CODEX).

## X2 — Rate limiting на auth/payment (~1-2 сессии)

Repo `C:\Users\rivne\gcsc-v3`, ветка `fix/rate-limiting`.

1. In-memory limiter в `v3/pure-server.js` (без новых зависимостей): скользящее окно на IP+route.
2. Лимиты: `/api/auth/login`, `/api/auth/register` — 10/мин; `/api/payment/*` — 30/мин; `/api/wallet/challenge`, `/api/wallet/connect` — 10/мин. Ответ 429 `{"error":"Too many requests","code":"rate_limited"}`.
3. Тесты отдельным файлом; полный прогон всех suites до стабильного зелёного (2-3 раза, медленный Windows-runner).
4. Запись `ai-review/records/2026-07-07-rate-limiting.md` → READY_FOR_REVIEW.

## X3 — GitHub Actions CI (~1 сессия)

Billing проверен — блокировки нет. Ветки `ci/github-actions` в обоих репо.

1. **gcsc-smart-contractor**: workflow push/PR — `node --check v3/pure-server.js` + payments suite + pg-storage (service container postgres:16-alpine, ubuntu-latest).
2. **gcsc-website**: workflow — `run-checks.mjs` (чек `check:android-preflight` сейчас падает — пометь `continue-on-error`, его чинит CLAUDE) + `tsc --noEmit` для mobile (npm ci, `.npmrc` legacy-peer-deps уже в репо).
3. НЕ мержи: READY_FOR_REVIEW + ветки, merge после ревью CLAUDE и «да» founder.

## X4 — Гигиена веток и worktree (~0.5 сессии)

1. В обоих репо: `git branch --merged main` → удалить только ветки-предки main. Force-удаление несмёрженных запрещено.
2. Устаревшая `fix/p1-4-ci-runner` — удалить локально и на origin.
3. Отчёт `ai-review/records/2026-07-07-branch-hygiene.md`: что удалено/оставлено и почему.

## X5 — Mobile UX мелочи (после X0, ~0.5 сессии)

Ветка `fix/mobile-ux-small`.

1. `app/_layout.tsx`: overlay спиннера — `pointerEvents="none"` → `"auto"` (сейчас тапы проходят сквозь спиннер).
2. `app/(auth)/sign-in.tsx`: no-op кнопку «Continue with WebAuth wallet» скрыть с TODO-комментарием.
3. `npx tsc --noEmit` PASS, запись, READY_FOR_REVIEW.

## Границы (стандартные)

Без merge в main без ревью+founder, без deploy/production release, без реальных денег/mainnet/секретов (EXPO_TOKEN спрашивай у founder, НЕ коммить), публичные `index.html`/`whitepaper.html` не трогать. Flaky-тесты гоняй 2-3 раза до стабильного зелёного ПЕРЕД передачей.
