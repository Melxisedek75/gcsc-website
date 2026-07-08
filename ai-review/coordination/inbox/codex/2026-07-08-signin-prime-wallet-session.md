# Task: sign-in не праймит WebAuth-сессию из профиля

Status: QUEUED | Owner: CODEX | Author-to-be: CODEX | Reviewer: CLAUDE | Created: 2026-07-08

## Симптом (устройство founder, APK b5d712c5 @ gcsc account, head 9ff8547f + owner-switch)

Свежая установка → вход по email в существующий аккаунт (в профиле wallet ЕСТЬ) → Pay → ошибка `No WebAuth session — call connectWallet() first | Loading stored WebAuth session`.

## Причина

`app/(auth)/sign-in.tsx`: после `login()` при `user.wallet?.account` роутит сразу в jobs, НЕ вызывая `primeSessionFromBackend(account, permission)`. Локальная WebAuth-сессия создаётся только в `_layout.tsx` hydrate (холодный старт с токеном). Поэтому первый платёж после логина в свежей установке падает до открытия кошелька.

## Фикс (предложение)

В `sign-in.tsx` после успешного login, при наличии `user.wallet?.account`: `await primeSessionFromBackend(user.wallet.account, user.wallet.permission ?? 'active')` перед роутингом в jobs. Аналогично проверить register-путь (там wallet ещё нет — не актуально) и любой другой вход в приложение мимо hydrate.

Ветка поверх `fix/mobile-webauth-session-recovery`, tsc + export PASS, запись в records, READY_FOR_REVIEW → CLAUDE.

## Обходной путь для founder (уже передан)

Полный перезапуск приложения после логина (hydrate праймит сессию из профиля) либо reconnect кошелька через Connect WebAuth.
