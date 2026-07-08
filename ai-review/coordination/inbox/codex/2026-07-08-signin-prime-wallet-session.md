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

---

## UPDATE 2026-07-08 10:57 — новый трейс с устройства founder (APK b5d712c5, gcsc account)

ПРОГРЕСС: wallet pairing РАБОТАЕТ — кошелёк привязан, трейс показывает `Preparing transfer as ownerstest15@active`. Callback-route фикс подтверждён на устройстве для identity flow.

Оплата теперь падает на transfer-этапе. Полный трейс с экрана:

```
WebAuth callback timeout | Preparing transfer as ownerstest15@active
 -> Opening WebAuth direct transaction request
 -> Proton Link transfer failed: JSON Parse error: Unexpected character: <
 -> Opening fallback direct ESR transfer
[итог: WebAuth callback timeout после ~180s]
```

Разбор:
1. В трейсе НЕТ «Restoring Proton Link session» → protonLink/protonSession уже были в памяти (pairing шёл через SDK login путь?).
2. `link.transact()` упал с «JSON Parse error: Unexpected character: <» → какой-то HTTP-эндпоинт вернул HTML (страница ошибки). Кандидаты: callback-сервис anchor (cb.anchor.link / buoy) или chain API. Проверь, какие endpoints реально использует ProtonRNSDK-путь при transact.
3. Fallback direct ESR transfer открылся, но callback за 180s не пришёл. Вопрос: открывался ли WebAuth второй раз и показывал ли transfer prompt? (Founder не сообщил о втором открытии кошелька.) Гипотезы: (a) второй deeplink подряд после Link-попытки игнорируется/теряется; (b) кошелёк не может раскодировать transfer ESR (минимальный рукописный ABI в sharedSigningRequestOpts) и молча дропает; (c) return_path/rid при transfer-callback не совпадает.

Предложения (по одной переменной):
- Если Link-сессии от логина нет/канал ненадёжен — пропускать link.transact() ПОЛНОСТЬЮ и идти сразу в direct ESR transfer (симметрично identity-пути, который на устройстве работает).
- Для (b): подтянуть реальный ABI eosio.token с testnet.xprnetwork.org/v1/chain/get_abi вместо самодельного.

Related: исходная задача этого файла (sign-in prime wallet session) остаётся в силе.
