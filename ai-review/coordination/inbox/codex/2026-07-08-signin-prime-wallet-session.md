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

---

## UPDATE 2026-07-08 (вечер) — ROOT CAUSE найден через adb logcat (устройство SM-N976U)

CLAUDE подключил телефон по USB и снял живой лог при попытке connect+pay. Ключевые строки:

```
... dat=smartcontractor://webauth-callback flg=0x10000000 cmp=com.gcsc.smartcontractor/.MainActivity from uid 10768
W/ReactNativeJS: '[webauth] Direct ESR identity failed, falling back to Proton Link login', [Error: WebAuth callback timeout]
```

**ROOT CAUSE:** WebAuth возвращается в приложение по `smartcontractor://webauth-callback` **БЕЗ query-параметров** (нет `?sa=&sp=`). Причина — `addSameDeviceInfo()` ставил `same_device:true` + `return_path`; WebAuth использовал return_path как цель возврата (bare) вместо подстановки `{{sa}}/{{sp}}` в ESR callback. → `waitForCallback` не получал `payload.sa` → 120s timeout → "нет коннекта". Identity/pairing открывал кошелёк, но данные подписи терялись на возврате.

**FIX (commit `72b793b9`, ветка fix/mobile-webauth-gcsc-owner):** в `addSameDeviceInfo()` убраны `same_device` и `return_path`, оставлен только `req_account` (метка "GCSC Token @gcsctoken111"). Теперь WebAuth должен отдавать результат через ESR `callback` с placeholder'ами. tsc PASS. Собирается APK 4a8e7a89 (gcsc account).

**Вторичное (не блокер, для Codex позже):** в логе спамится `'[Layout children]: No route named "(auth)" exists in nested children'` — expo-router видит routes плоскими (`(auth)/sign-in` и т.д.), а `_layout.tsx` объявляет `<Stack.Screen name="(auth)" />`. Предупреждение безвредно, но стоит убрать лишние `<Stack.Screen name="(auth)/(homeowner)/(contractor)" />` или привести к фактической структуре.

**Ещё раньше (b33c8c47):** direct ESR transfer сделан primary (Link был primary и падал JSON parse `<`), + реальный chain ABI из get_abi, + sign-in primes wallet session. Всё в этой же ветке.

Автор фиксов: CLAUDE (Codex был недоступен). Нужен re-review Codex когда вернётся + device-подтверждение founder на APK 4a8e7a89.

---

## UPDATE 2026-07-08 (поздний вечер) — device log #2, APK 4a8e7a89 (commit 72b793b9)

CLAUDE снял второй adb-лог после фикса `72b793b9` (убрал same_device/return_path). РЕЗУЛЬТАТ: стало иначе, но НЕ лучше.

Ключевое из лога (PID 7746 = наш app, 7813 = com.metallicus.webauth):
```
=== ActivityManager callback intent: ПУСТО (в прошлый раз был dat=smartcontractor://webauth-callback) ===
07-08 23:23:25 W/ReactNativeJS(7746): '[webauth] Direct ESR identity failed... [Error: WebAuth callback timeout]'
07-08 23:23:25 onUserLeaveHint / onHostPause  ← founder вернулся ВРУЧНУЮ
7813 (WebAuth): "Fetching actions from Hyperion { act.name: transfer, symbol XPR }" ← WebAuth показал tx у себя
```

**ВЫВОД (подтверждён двумя device-логами):**
1. С `return_path` (b33c8c47 и раньше) → WebAuth ВОЗВРАЩАЕТСЯ в app, но по BARE deeplink без `?sa` → timeout.
2. Без `return_path` (72b793b9) → WebAuth НЕ возвращается вообще (нет callback-intent), founder вернулся руками → timeout.
→ **Прямой ESR-deeplink НЕ способен получить результат identity/signing от XPR WebAuth.** Результат отдаётся по каналу Proton Link (WebSocket/buoy), а не через deeplink callback. return_path лишь возвращает фокус в app, данные — по каналу.

**Значит рабочий путь ТОЛЬКО через ProtonRNSDK** (`connectWithProtonNativeSdk`). Его текущая ошибка: `link.transact` / login → `JSON Parse error: Unexpected character: <` = SDK-транспорт POSTит на callback/buoy-сервис и получает HTML.

`connectWithProtonNativeSdk` сейчас:
```
ProtonRNSDK({ linkOptions:{ chainId, endpoints:[CHAIN_API], storage, storagePrefix, restoreSession },
  transportOptions:{ requestAccount: REQUEST_ACCOUNT, getReturnUrl: ()=>`smartcontractor://webauth-callback` } })
```
Гипотеза: не задан правильный **buoy/callback-service** для XPR (SDK по умолчанию бьёт в anchor `cb.anchor.link`, который отдаёт HTML/недоступен). Нужно из исходников `@proton/react-native-sdk` найти опцию transport service (buoy) и указать корректный XPR-сервис, ИЛИ понять, почему транспорт получает HTML. Это итеративная работа с device-тестом.

**РЕКОМЕНДАЦИЯ CLAUDE:** сделать ProtonRNSDK-путь ЕДИНСТВЕННЫМ и primary для connect И transfer (убрать direct-ESR как способ получения результата — он не работает), вернуть `return_path` (нужен для возврата фокуса), и сфокусировать фикс на transport/buoy конфиге SDK (источник «JSON parse <»). direct-ESR можно оставить максимум как «разбудить кошелёк», но результат читать только через SDK-канал.

Все правки этой сессии авторства CLAUDE (Codex был недоступен). Ветка `fix/mobile-webauth-gcsc-owner`. adb настроен: `C:\gcsc\.tmp\platform-tools\adb.exe`, устройство SM-N976U (R3CMB0JDFAR) авторизовано.
