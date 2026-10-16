# GCSC Smart Contractor диагностика подключения кошелька и план для Codex

Дата: 11 октября 2026 года, UTC. Проверка GitHub выполнена около 23:41–23:43 UTC. Существенное дополнение после read-only проверки компьютера: 23:57 UTC.

Назначение: передать следующему исполнителю проверенные факты, ограничения проверки и последовательность устранения несовместимости WebAuth, клиентов и API без потери локальной работы и ослабления безопасности.

Канонический репозиторий: [Melxisedek75/gcsc-platform](https://github.com/Melxisedek75/gcsc-platform).

Проверенный remote `main`: **`a0834ac7917c3de57ebc02fb542814561469bca2`**. Дата этого коммита: 14 сентября 2026 года, 00:58:34 UTC. Перед началом новой работы повторно проверить remote: этот документ фиксирует срез, а не гарантирует неизменность ветки.

## 1 Главный вывод с учётом локальной проверки

**Важное уточнение от 11 октября, 23:57 UTC: на компьютере найдены уже закоммиченные реализации wallet-proof и wallet-login. Начинать разработку заново нельзя. Сначала нужно объединить существующие изменения из двух рабочих веток и проверить итоговый состав.**

GitHub `main` на SHA `a0834ac7917c3de57ebc02fb542814561469bca2` действительно содержит несовместимость: web-клиент отправляет identity без challenge/signature, а API требует proof. Этот вывод остаётся правильным для указанного remote SHA, но **не описывает весь существующий локальный код**.

Локальная read-only проверка установила:

- В рабочем дереве `publication` уже есть полноценные wallet-login и ownership challenge/verify маршруты и соответствующие backend-коммиты.
- В рабочем дереве `frontend` есть mobile wallet-login, а также более поздние исправления sign-only ownership и запрета metadata-only binding.
- Два поздних mobile-коммита отсутствуют в `publication`; полный новый backend из `publication` отсутствует в `frontend`.
- Релевантных незакоммиченных или untracked wallet/auth/API изменений не найдено. Найдены две посторонние изменённые review-документации, которые необходимо сохранить.

**Наиболее конкретный установленный риск — рассогласованный состав веток и публикации. Гипотеза о найденном исправлении, потерянном именно как незакоммиченный файл, этими данными не подтверждается: нужный код существует в локальных коммитах.** Это ещё не доказывает, какой именно код работает на телефоне или сервере, и не доказывает корректность найденного протокола.

Следующий Codex должен сохранить обе вершины веток, изучить готовые реализации и их зависимости, затем подготовить согласованный candidate на основе `publication` с недостающими mobile-изменениями. Cherry-pick без просмотра зависимостей и разрешения конфликтов недопустим. Старые разделы о разработке proof нужно читать как требования к аудиту и доработке найденного кода, а не как указание переписать его с нуля.

Источник remote-диагноза: [WALLET-API-CONTRACT.md на проверенном SHA](https://github.com/Melxisedek75/gcsc-platform/blob/a0834ac7917c3de57ebc02fb542814561469bca2/docs/migration/WALLET-API-CONTRACT.md). Локальные доказательства и ограничения приведены в разделе 7.

## 2 Границы поручения и разрешений

Этот документ подготовлен по запросу на диагностику и передачу Markdown-файла. Его подготовка не означала разрешения менять приложение, делать commit, push, merge, deploy или выполнять действия кошельком. Во время этой проверки таких действий не было.

Если владелец передаёт файл Codex с явным поручением исправить проблему, следует выполнять диагностику и локальные изменения в пределах этого поручения. До публикации необходимо проверить, разрешены ли commit, push, создание PR, merge и deploy. Если нужное действие не разрешено, запросить конкретное разрешение. Не считать наличие плана в этом файле отдельным разрешением на публикацию.

Обязательные границы:

- Работать с GCSC Smart Contractor и каноническим репозиторием. Не создавать заменяющий проект и не переносить работу в `xprclaw`.
- Речь идёт об **XPR Network / Proton / Antelope**, не об XRP Ledger. Не подставлять библиотеки, адреса, proof-форматы или API XRP.
- Не читать, копировать в отчёт, выводить в логи или коммитить приватные ключи, seed-фразы, токены, пароли и содержимое секретных конфигураций.
- Не импортировать реальные ключи в тестовые сценарии. Для offline-тестов допустимы только отдельно сгенерированные фикстуры в изолированной среде.
- Не выполнять реальные платежи, переводы, транзакции или broadcast ради проверки входа. Подпись настоящим кошельком требует отдельного согласованного теста с владельцем и ясным содержимым запроса.
- Не отключать ownership, signature, authority, threshold, replay или expiry проверки ради зелёного результата.
- Не выдавать mock, локальную сессию SDK или сохранённое имя аккаунта за server-verified wallet.
- Не перезаписывать современный backend архивным `pure-server.js`: архивная версия может удалить более новые защитные изменения.
- Не запускать сервер с пользовательской/боевой БД или унаследованными секретами окружения. Перед запуском выяснить, куда он пишет данные.

## 3 Четыре разных состояния системы

1. **Вход в приложение:** email/password или другой согласованный app-auth путь, JWT и профиль GCSC.
2. **Pairing с WebAuth:** SDK установил связь и вернул actor/permission, возможно signing session. Это ещё не серверная привязка.
3. **Подтверждённая привязка:** API проверил свежее доказательство владения, его контекст и полномочия ключа; только после этого пометил wallet как verified.
4. **Операция в блокчейне:** отдельное действие с отдельными параметрами, разрешением и подтверждением. Успешный вход не доказывает, что платёж работает; платёж нельзя использовать как неявную замену login-proof.

Дополнительно различать web bundle, Android APK и работающий API. Один SHA в GitHub не устанавливает, какой код работает на сайте, телефоне или сервере.

## 4 Проверенная цепочка в веб-приложении на remote main

### Получение аккаунта

`apps/web/src/services/webauth.ts` вызывает `@proton/web-sdk` и формирует `ConnectedWebAuthWallet` с `accountName`, `permission`, необязательным `publicKey` и `walletType`. `connectWebAuthWallet()` возвращает этот объект. Challenge и signature в нём отсутствуют.

Источник: [webauth.ts, строки 76–109](https://github.com/Melxisedek75/gcsc-platform/blob/a0834ac7917c3de57ebc02fb542814561469bca2/apps/web/src/services/webauth.ts#L76-L109).

### Отправка на API

`apps/web/src/services/api.ts:415` объявляет `connectWallet` только для identity-полей и отправляет тело в `/wallet/connect`. Вызова challenge в этом пути нет.

Источник: [api.ts, строки 415–417](https://github.com/Melxisedek75/gcsc-platform/blob/a0834ac7917c3de57ebc02fb542814561469bca2/apps/web/src/services/api.ts#L415-L417).

Этот helper используется в двух интерфейсах:

- [dashboard/WalletPanel.tsx, строки 13–20](https://github.com/Melxisedek75/gcsc-platform/blob/a0834ac7917c3de57ebc02fb542814561469bca2/apps/web/src/pages/dashboard/WalletPanel.tsx#L13-L20): connect SDK → connect API.
- [Wallet.tsx, строки 55–101](https://github.com/Melxisedek75/gcsc-platform/blob/a0834ac7917c3de57ebc02fb542814561469bca2/apps/web/src/pages/Wallet.tsx#L55-L101): аналогичный запрос при connect и restore.

### Требование сервера

`services/api/v3/pure-server.js` содержит:

- `POST /api/wallet/challenge`, требующий существующий app JWT;
- `POST /api/wallet/connect`, требующий `publicKey` и `signature`;
- одноразовое потребление challenge, проверку подписи и текущих полномочий ключа для аккаунта/permission.

Без proof сервер возвращает `wallet_proof_required`. Это предсказуемый результат текущего web-запроса при достижении этой ветки обработчика. До неё возможны и другие ошибки, например отсутствие app JWT.

Источник: [pure-server.js, маршруты challenge/connect](https://github.com/Melxisedek75/gcsc-platform/blob/a0834ac7917c3de57ebc02fb542814561469bca2/services/api/v3/pure-server.js#L3362-L3435).

Существующий challenge подписывается как raw-string K1 message. В строку включены account, user и nonce; полный контекст domain/chain/permission/purpose в текущую строку не включён. Не считать его уже согласованным универсальным wallet-login протоколом.

Источник: [pure-server.js, функции proof](https://github.com/Melxisedek75/gcsc-platform/blob/a0834ac7917c3de57ebc02fb542814561469bca2/services/api/v3/pure-server.js#L1554-L1645).

## 5 Проверенная цепочка в мобильном приложении на remote main

`apps/mobile/lib/webauth.ts` использует `@proton/react-native-sdk`; `connectWallet()` создаёт новую pairing-сессию и сохраняет account/permission/publicKey локально.

Источники: [native SDK connection](https://github.com/Melxisedek75/gcsc-platform/blob/a0834ac7917c3de57ebc02fb542814561469bca2/apps/mobile/lib/webauth.ts#L167-L190), [connectWallet](https://github.com/Melxisedek75/gcsc-platform/blob/a0834ac7917c3de57ebc02fb542814561469bca2/apps/mobile/lib/webauth.ts#L484-L508).

После этого `app/(auth)/connect-wallet.tsx` вызывает `updateProfile({ wallet: { account, permission } })`. `lib/auth.ts` отправляет `PUT /api/auth/profile`. Полноценный challenge/signature connect-путь здесь отсутствует.

Источники: [мобильный connect screen](https://github.com/Melxisedek75/gcsc-platform/blob/a0834ac7917c3de57ebc02fb542814561469bca2/apps/mobile/app/%28auth%29/connect-wallet.tsx#L17-L33), [updateProfile](https://github.com/Melxisedek75/gcsc-platform/blob/a0834ac7917c3de57ebc02fb542814561469bca2/apps/mobile/lib/auth.ts#L79-L85).

В `app/_layout.tsx` переход внутрь приложения определяется наличием `profile.wallet.account`. `verified` в этом условии не проверяется; локальную сессию можно заполнить из backend-профиля. Оба profile-экрана также выбирают надпись `wallet linked` по наличию account.

Источники: [startup gate](https://github.com/Melxisedek75/gcsc-platform/blob/a0834ac7917c3de57ebc02fb542814561469bca2/apps/mobile/app/_layout.tsx#L42-L53), [contractor profile](https://github.com/Melxisedek75/gcsc-platform/blob/a0834ac7917c3de57ebc02fb542814561469bca2/apps/mobile/app/%28contractor%29/profile.tsx), [homeowner profile](https://github.com/Melxisedek75/gcsc-platform/blob/a0834ac7917c3de57ebc02fb542814561469bca2/apps/mobile/app/%28homeowner%29/profile.tsx).

Следствие: видимый успех мобильного pairing не позволяет заключить, что API подтвердил владение. Этот вывод о коде не является воспроизведением конкретной ошибки на нынешнем телефоне владельца.

## 6 История и гипотеза потерянного локального исправления

GitHub path-history для проверенного `main` показала:

- web `services/webauth.ts`, mobile `lib/webauth.ts` и mobile `app/(auth)/connect-wallet.tsx` не менялись после исходного импорта `5a520f49e5087cfd47dccb7ea0b849dfd36e14ae` от 6 сентября;
- обязательный `signature` уже присутствовал в API этого исходного импорта;
- `bf3728bf77d2683ff5a5c66c27216d97e41ef208` от 13 сентября исправил сохранение app session при wallet restore error и находится в текущем `main`;
- диагностические commits `2b4f61c5f85a71cc634c57eae2c0c895f4f516fe` и `e8188048699dbf86331f54328cda5044943ad5c8` документируют незавершённый wallet contract; это не готовый implementation proof-flow.

Источники: [исходный backend proof guard](https://github.com/Melxisedek75/gcsc-platform/blob/5a520f49e5087cfd47dccb7ea0b849dfd36e14ae/services/api/v3/pure-server.js#L3382-L3410), [restore fix](https://github.com/Melxisedek75/gcsc-platform/commit/bf3728bf77d2683ff5a5c66c27216d97e41ef208), [архивирование и диагностика](https://github.com/Melxisedek75/gcsc-platform/commit/2b4f61c5f85a71cc634c57eae2c0c895f4f516fe), [уточнение карты consumers](https://github.com/Melxisedek75/gcsc-platform/commit/e8188048699dbf86331f54328cda5044943ad5c8).

В архиве репозитория сохранены 12 dirty-файлов старых checkout. Это исторические кандидаты, а не активная интеграция. Документ восстановления отдельно предупреждает, что замена современного backend старой копией удалит более новые wallet/payment protections.

Источник: [LOCAL-RECOVERY-2026-09-13.md](https://github.com/Melxisedek75/gcsc-platform/blob/a0834ac7917c3de57ebc02fb542814561469bca2/docs/migration/LOCAL-RECOVERY-2026-09-13.md).

Локальная проверка теперь подтвердила, что существенные изменения действительно находятся в других ветках и worktree; они закоммичены. Различия API endpoint, конфигурации, SDK и реально установленной/развёрнутой версии ещё требуют проверки. Не делать из истории только remote main вывод об отсутствии реализации на компьютере.

Обычная пересборка не является доказательством удаления исходников. Возврат симптома может означать, что собран другой источник или что раньше проверялся только pairing. Сначала нужны факты о конкретной сборке.

## 7 Подтверждённое локальное сравнение

Статус: **read-only сравнение завершено; файлы приложения, refs и сборки не изменялись**. Факты ниже получены при проверке компьютера 11 октября 2026 года. Они заменяют прежний статус PENDING.

### Рабочее дерево publication

- Путь: `C:\gcsc-platform\.worktrees\publication`.
- Ветка: `codex/monorepo-publication`.
- HEAD: `1712ecd9f0dbd74f420d44a28ccd065d35ba4908`.
- Сравнение с локально доступным `origin/main` на `a0834ac7917c3de57ebc02fb542814561469bca2`: 466 commits ahead, 0 behind. Это число характеризует историю ветки, а не число wallet-изменений.
- Есть маршруты `/api/auth/wallet/challenge`, `/api/auth/wallet/verify`, `/api/wallet/ownership/challenge`, `/api/wallet/ownership/verify`, а также legacy-маршруты.
- Релевантные backend-коммиты: `b95ffe75`, `c808f80a`, `43179912`, `126e2db0`, `eb760ed0`. Перед интеграцией разрешить сокращённые SHA в полные и прочитать diff каждого.
- Релевантных untracked wallet/auth/mobile/API файлов не обнаружено.
- Из незакоммиченного отмечены две не относящиеся к этому исправлению документации: `ai-review/records/2026-10-05-private-draft-api-restart-pg.md` и `docs/migration/MARKETING-CONCEPT-DISCLOSURE-REVIEW.md`. Не затирать, не включать случайно в patch и не публиковать без отдельной проверки.

### Рабочее дерево frontend

- Путь: `C:\gcsc-platform\.worktrees\frontend`.
- Ветка: `codex/mobile-wallet-probe-20260914`.
- HEAD: `1eb3b56d141df60470bd9ae910ce0cf421dd0a78`.
- Зафиксированное сравнение ветки: 31 commits ahead, 2 behind. Перед использованием чисел повторно установить точный upstream; не переносить их автоматически на сравнение с `main`.
- Релевантное рабочее дерево чистое.
- Mobile wallet-login изменения: `07002382`, `6e67d6f3`, `85a87656`.
- `cfe91271`: реализация sign-only ownership через родительский Proton Link. Здесь «реализация» означает найденный код, не новое подтверждение реальной подписи в этой проверке.
- `51758a0f`: запрещает metadata-only binding, требует challenge-proof.
- Отдельные web-only изменения: `494e7e2e`, `1eb3b56d`.

### Установленное расхождение веток

`publication` не содержит двух поздних mobile-коммитов `cfe91271` и `51758a0f`. `frontend` не содержит полный новый backend из `publication`. Поэтому сборка одного дерева без согласованной интеграции может не включить весь необходимый набор исправлений.

Для исследованных proof-коммитов `git branch -r --contains` не нашёл содержащих их remote-tracking refs. **Это результат проверки доступных локальных refs. Он не доказывает, что коммиты никогда не публиковались ни на один remote или что локальные refs полностью актуальны.** До утверждения об отсутствии на конкретном remote обновить сведения разрешённым способом и проверить именно этот remote.

### Найденный APK и bundle

- APK: `C:\gcsc-platform\.worktrees\frontend\apps\mobile\android\app\build\outputs\apk\release\app-release.apk`.
- Размер: **29 828 569 байт**.
- Версия: **0.1.4**, versionCode **6**.
- По зафиксированным локальным временным меткам 25 сентября: bundle 21:39, APK 21:43; поздние коммиты `cfe91271` и `51758a0f` отмечены 21:18 и 21:33. Часовой пояс этих меток отдельно не установлен; не интерпретировать их как UTC. Последовательность согласуется с более поздней сборкой, но сама по себе не доказывает точный source commit APK.
- В bundle обнаружены четыре перечисленных новых маршрута и строки `wallet_binding_response_invalid`, `wallet_login_request_pending`.
- SHA-256 **bundle**: `784F07F932D283A18072333875B6125CB9EAA396AEF9B0E170F759EF1724E82C`.
- Это **не SHA-256 APK**. APK hash в этих результатах не установлен.
- Не проверено, установлен ли именно этот APK на телефоне и какой backend реально развёрнут. Наличие строк в bundle не подтверждает успешный wallet-flow.

### Куда направить следующий Codex

В доступном реестре проектов Codex найден `gcsc` с корнем `C:\gcsc`; это не подтверждённый активный корень `gcsc-platform`. В поручении следующему исполнителю явно указать оба пути worktree выше и их назначение. Не запускать исправление в первом попавшемся `C:\gcsc` и не создавать там дубликат платформы.

Первый шаг — безопасно сохранить доступность обеих вершин `1712ecd9...` и `1eb3b56d...`, проверить незакоммиченное состояние и зависимости коммитов. Если сохранение требует новых refs/commit/архива, выполнять только в разрешённом scope; не менять исходные ветки до проверки. Перед любым разрешённым push проверить историю и включаемые файлы на секреты и приватные данные. Затем подготовить согласованную интеграцию существующего backend и mobile fixes, не повторяя уже выполненную разработку.

## 8 Почему существующие зелёные тесты не доказывают работу кошелька

- `tests/wallet-restore.test.mjs` извлекает реальную функцию страницы, но подменяет `api.connectWallet` заглушкой. Тесты проверяют error isolation и сохранение app session.
- `apps/web/scripts/validate-webauth-integration.mjs` ищет строки и импорты в исходниках. Название validator не превращает его в сквозной тест.
- `services/api/v3/tests/payments-402.test.js` проверяет, что запрос без proof отклоняется; положительный путь использует сгенерированные тестовые подписи и mock authority.
- SDK-тесты характеризуют возможности закреплённых codecs и transport с заменённым IO. Они не подтверждают принятие proof реальным кошельком.
- `.github/workflows/ci.yml` содержит отдельный `integration-readiness`, который намеренно остаётся красным до реализации wallet-first контракта. `npm run check` не включает этот gate.

Источники: [restore tests](https://github.com/Melxisedek75/gcsc-platform/blob/a0834ac7917c3de57ebc02fb542814561469bca2/tests/wallet-restore.test.mjs), [static validator](https://github.com/Melxisedek75/gcsc-platform/blob/a0834ac7917c3de57ebc02fb542814561469bca2/apps/web/scripts/validate-webauth-integration.mjs), [API proof tests](https://github.com/Melxisedek75/gcsc-platform/blob/a0834ac7917c3de57ebc02fb542814561469bca2/services/api/v3/tests/payments-402.test.js#L368-L510), [CI](https://github.com/Melxisedek75/gcsc-platform/blob/a0834ac7917c3de57ebc02fb542814561469bca2/.github/workflows/ci.yml), [root scripts](https://github.com/Melxisedek75/gcsc-platform/blob/a0834ac7917c3de57ebc02fb542814561469bca2/package.json).

## 9 Аудит найденного протокола перед интеграцией

**Приоритет после локального сравнения: сначала прочитать существующие реализации из раздела 7.** Требования ниже служат проверкой их корректности и основанием для узкой доработки только найденных пробелов. Документация на remote main описывает более раннее состояние и не отменяет поздние локальные коммиты.

Простое добавление `signature` в TypeScript-тип не исправит несовместимость.

Сохранённая диагностика закреплённых SDK установила ограничения обычного identity v2: изменение `info.nonce`, `info.domain` и callback не меняет проверяемый transaction digest; переданный expiry в исследованном пути игнорируется. Эти свойства отражены в characterization tests как HAZARD. Это вывод об исследованных версиях и путях, а не утверждение обо всех версиях SDK.

Полный synthetic transaction с challenge в данных context-free action даёт offline digest-binding. Однако способность настоящего кошелька безопасно отобразить, принять и вернуть нужную подпись для этого payload не подтверждена. Синтетические actions нельзя без проверки переносить в рабочую авторизацию.

Источники: [SDK diagnosis](https://github.com/Melxisedek75/gcsc-platform/blob/a0834ac7917c3de57ebc02fb542814561469bca2/docs/migration/WALLET-SDK-IDENTITY.md), [identity characterization](https://github.com/Melxisedek75/gcsc-platform/blob/a0834ac7917c3de57ebc02fb542814561469bca2/tests/wallet-sdk-identity.test.mjs), [payload experiment](https://github.com/Melxisedek75/gcsc-platform/blob/a0834ac7917c3de57ebc02fb542814561469bca2/tests/wallet-challenge-payload.test.mjs).

Перед реализацией:

1. Уточнить продуктовую цель: привязка кошелька после app login либо отдельный wallet-first login. Текущий `/api/wallet/challenge` требует JWT и не подходит без изменений для входа пользователя без JWT. Не расширять задачу до нового способа входа молча.
2. Разрешить сокращённые SHA раздела 7, изучить их diff, тесты и dependency chain; проверить фактически установленные SDK и lockfiles обеих платформ. Читать поддерживаемые signing APIs, не придумывать `signMessage`/`signArbitrary`.
3. Проверить уже реализованный версионированный proof-контракт обеих платформ. Если доказана необходимость изменения, выбрать совместимый вариант без broadcast и объяснить, какой конкретный пробел исправляется.
4. Криптографически связать purpose, audience/domain, chain, actor/permission, случайный nonce, issued-at/expiry и requesting session. Проверять точные подписанные данные, а не соседние неподписанные metadata.
5. Определить bounded parser, каноническое кодирование, lifecycle challenges и атомарное одноразовое потребление с учётом реальной модели развёртывания API. Процессный Map не считать без проверки подходящим для нескольких экземпляров сервера.
6. Сохранить проверку текущих полномочий ключа. Отдельно обозначить ограничения direct-key threshold и отсутствие полноценной поддержки delegated/parent/multisig authority.
7. Проверить transport/callback origin, source, request correlation и обработку повторов. `broadcast:false` и `noModify:true` сами по себе не являются подписанными серверными гарантиями.
8. Если требуемый proof неподдерживаем, сообщить конкретный blocker и оставить защищённую привязку недоступной. Не заменять proof фиктивной подписью, metadata-флагом, переводом средств или отключённой проверкой.

## 10 План работы Codex по контрольным точкам

### A Установить источник и сохранить локальную работу

До изменения файлов прочитать применимые `AGENTS.md` и инструкции репозитория. Начать с двух проверенных worktree раздела 7, подтвердить их текущие SHA и сохранить обе вершины. Не использовать запись проекта `gcsc` / `C:\gcsc` как доказательство выбора активного дерева. Не считать первый найденный каталог активным.

Без изменения refs собрать `git status --short --branch`, `git worktree list --porcelain`, текущие `HEAD`/branch/upstream, список staged/unstaged/untracked файлов и релевантную историю wallet/auth. Remote URL при отчёте очищать от встроенных credentials. Не выводить полный diff секретных файлов.

Сохранить **все существующие staged, unstaged и untracked изменения**. Оставить оригиналы нетронутыми; перед потенциально конфликтующим редактированием подготовить проверенный локальный checkpoint/копии в пределах разрешённого доступа. Одних `git diff` и `git bundle` недостаточно для untracked файлов. Для сохранённых файлов проверять наличие и, где уместно, хеши; секреты не включать в передаваемые архивы или отчёты. Если безопасное сохранение нельзя подтвердить, остановить зависимые изменения и спросить владельца.

Не применять `reset --hard`, `clean`, принудительный checkout, автоматический stash/pop, удаление worktree или замену проекта новой копией. Не перезаписывать незавершённую работу другого исполнителя.

**Выход A:** подтверждённый checkout, исходный SHA, перечень относящихся к задаче локальных изменений и способ их сохранения. Только после этого выбрать место исправления.

### B Воспроизвести точную проблему

Установить, где возникает наблюдаемый пользователем сбой: web или Android, app-auth или SDK pairing, callback или backend binding. Снять обезличенные URL path, статус и error code; не сохранять Authorization/Cookie, JWT, proof payload с личными данными или секреты.

Сравнить текущий клиентский request с handler выбранного API. Проверить окружение и сеть XPR, configured chain ID, requestAccount, API base URL, SDK/lockfile версии и происхождение APK/bundle. Исследовать callback/restore отдельно, если сбой возникает до запроса на API.

Серверные тесты запускать только в изолированной среде с временным fixture storage и явными test settings. Проверить `DATABASE_URL` и путь локальной `gcsc.db` до запуска, не раскрывая значения секретов.

**Выход B:** воспроизводимый failing test или документированная трасса; подтверждённая стадия сбоя; уточнение, покрывает ли описанная несовместимость конкретную жалобу.

### C Согласованно интегрировать существующие исправления

Выполнить раздел 9. Прочитать backend commits из `publication`, mobile-login и два поздних ownership commits из `frontend`. Проверить родителей, необходимые предыдущие изменения, API-типы, storage/migration зависимости, SDK и lockfiles. Отдельно оценить два web-only commits; не включать их автоматически только из-за соседства в истории.

Предпочтительный кандидат для проверки — согласованный состав на базе `publication` с недостающими mobile fixes и их необходимыми зависимостями. Это направление работы, а не разрешение на слепой cherry-pick. Сначала подготовить план переноса и убедиться, что он не перезаписывает новые эквивалентные изменения.

Использовать существующие regression tests; дополнить тестом, обнаруживающим несовместимый состав веток и фактическую жалобу. Создавать новый proof-протокол только если аудит докажет, что найденная реализация непригодна. Не выдавать повторную characterization-проверку за новый fix.

Если интеграция и локальная доработка разрешены, согласовать backend, web и mobile, включая truthful UI states. Не создавать второй независимый протокол для одной платформы без явной необходимости и документированного контракта.

Сохранять существующий restore-error fix: wallet/network error не должен разлогинивать приложение. Logout допустим только при подтверждённой проблеме app-auth с защитой от гонок и смены токена.

**Выход C:** узкий patch, описание proof-контракта и прогон focused tests; список оставшихся ограничений.

### D Проверить весь согласованный набор

Прогнать существующие команды из актуального `package.json` и новые regression tests. Отдельно фиксировать command, рабочий каталог, SHA/patch, версию runtime, exit code, число passed/failed/skipped и границы mock.

Пример существующих команд, которые нужно перепроверить по текущему checkout:

```text
npm run check
npm run test:api
npm run test:api-config
npm run test:wallet-restore
npm run test:wallet-sdk
npm run test:wallet-payload
npm run build:web
npm run lint:web
npm run check:mobile-types
npm run check:integration-contracts
```

SDK tests требуют соответствующих установленных зависимостей. Отсутствие dependency или заблокированный запуск не считать PASS. Не ослаблять или выключать красный gate ради отчёта. Если wallet-first остаётся вне согласованного scope, явно сохранить этот отдельный blocker общей readiness.

**Выход D:** результаты на точной версии patch, независимое review безопасности, список неисполненных проверок.

### E Подтвердить воспроизводимость из Git

После отдельного разрешения на commit проверить точный список включаемых файлов, отсутствие секретов и отсутствие захвата чужой работы. Зафиксировать backend, clients, contract, tests и необходимые dependency changes согласованным набором. Это может быть несколько логически связанных коммитов; нельзя объявлять готовой промежуточную несовместимую комбинацию.

В новой изолированной clean-копии проверить именно candidate SHA: lockfile-based install, сборки и тесты без скрытых файлов из старого worktree. Зафиксировать требуемые имена настроек и безопасные примеры; значения секретов не хранить в Git. Повторно проверить чистоту рабочей копии после тестов и отсутствие изменения lockfiles.

Если commit пока не разрешён, допустимо проверить отдельно сохранённый patch на чистой копии разрешённым способом, но назвать это проверкой patch, не проверкой опубликованного SHA.

После разрешённого push прочитать remote обратно и проверить SHA. Проверить CI именно этого SHA, а не старой ветки. Публикация не доказывает deploy. Production rollout, merge и установка APK требуют соответствующего разрешения и отдельной проверки.

**Выход E:** воспроизводимый candidate, точные Git/артефактные идентификаторы и прозрачный статус publication/deployment.

### F Проверить настоящий web и Android

Отдельно согласовать с владельцем sign-only сценарий, выбранную сеть, аккаунт и понятное содержимое proof. Подпись выполняет владелец в кошельке; не просить приватный ключ. Не запускать платёж для проверки входа.

Проверить connect, cancel, timeout, повторный callback, restart/restore, logout/login, смену аккаунта и неправильную сеть. Зафиксировать версию APK, hash, chain, backend version и результат без секретов.

**Выход F:** подтверждённый результат каждого сценария для web и Android. Если одна платформа не проверена, не заявлять общий E2E PASS.

## 11 Какие файлы должны составлять согласованное исправление

Перечень является планом проверки уже найденных commits и их согласованной интеграции, а не приказом менять каждый файл или повторно писать готовые функции. Сначала сопоставить существующие patch из двух веток с этим перечнем.

Backend и контракт:

- `services/api/v3/pure-server.js` либо выделенные из него proof/challenge модули при обоснованном узком рефакторинге;
- актуальный API/proof contract, включая login/link различия;
- `services/api/v3/tests/payments-402.test.js`;
- `services/api/v3/tests/wallet-binding-trust.test.js`;
- `services/api/v3/tests/wallet-authority.test.js`;
- новые handler/protocol integration tests;
- provenance/adaptation manifests, если их изменение действительно необходимо по правилам репозитория. Не обновлять их вслепую для обхода теста.

Web:

- `apps/web/src/services/webauth.ts`;
- `apps/web/src/services/api.ts`;
- `apps/web/src/pages/Wallet.tsx`;
- `apps/web/src/pages/dashboard/WalletPanel.tsx`;
- `tests/wallet-restore.test.mjs` и новые client-to-handler tests;
- статический validator только как дополнительная проверка, не замена integration test.

Mobile:

- `apps/mobile/lib/webauth.ts`;
- `apps/mobile/lib/auth.ts`, `lib/api.ts` или отдельный wallet API helper с обоснованными типами;
- `apps/mobile/app/(auth)/connect-wallet.tsx`;
- `apps/mobile/app/_layout.tsx` и profile-экраны обеих ролей для корректных состояний pairing/metadata/verified;
- callback/session обработчики, если фактическая диагностика подтверждает необходимость;
- mobile regression tests для connect, cancel, restore и account switch.

Общие проверки:

- `tests/wallet-sdk-identity.test.mjs`, `tests/wallet-challenge-payload.test.mjs`, их fixture helper;
- новый общий proof fixture/contract и тест обоих consumers против server verifier;
- `package.json`, CI workflow и lockfiles только в части действительно необходимых команд/зависимостей;
- инструкция воспроизводимой сборки с SHA/версиями без секретов.

Не включать в исправление архивные runtime-копии, unrelated UI redesign, сгенерированные APK, node_modules или пользовательские данные без отдельного обоснования и разрешения.

## 12 Минимальный набор тестов исправления

Положительный путь: challenge → поддерживаемая sign-only подпись → API verify → server-verified binding → повторное чтение сохранённого состояния. Клиентские request/response должны быть настоящими для проверяемых функций; IO кошелька можно подменять фикстурой только с явной пометкой границы такого теста.

Негативные сценарии:

- нет proof, нет challenge, повреждённая подпись, другой ключ;
- изменены nonce, audience/domain, purpose, chain, actor или permission;
- истёкший, уже использованный и одновременно повторённый challenge;
- неверный/просроченный app JWT для link;
- ключ не удовлетворяет permission/threshold; RPC lookup отказал или недоступен;
- смена account/permission не сохраняет старый verified status;
- profile metadata не даёт право на защищённые операции;
- callback не от ожидаемого origin/source или относится к другому запросу;
- cancel/timeout/retry не создают ложное connected/verified состояние;
- wallet failure сохраняет действующий app JWT; profile 401 обрабатывается отдельно;
- рестарт/restore не выдаётся за новую подпись challenge;
- новая сессия/токен, появившиеся во время запроса, не затираются старым ответом;
- в auth/link пути отсутствуют broadcast и transfer.

Для серверных concurrency/nonce тестов учитывать фактический persistent storage и число экземпляров сервиса. Успех теста in-memory Map не переносить автоматически на production multi-instance.

## 13 Критерии приёмки

- [ ] Подтверждены checkout, исходный SHA и сохранность исходной локальной работы.
- [ ] Наблюдаемый пользователем дефект воспроизведён или точно локализован; неизвестное явно отмечено.
- [x] По текущему read-only сравнению существенные wallet-исправления найдены в локальных коммитах; релевантных dirty/untracked изменений не обнаружено.
- [ ] Повторно подтверждены обе вершины и подготовлен согласованный состав backend/mobile/web без утраты изменений.
- [ ] Установлено, какая версия реально установлена/развёрнута; локальный APK не принят за установленный без проверки.
- [ ] Proof-контракт совместим с фактическими SDK и связывает все необходимые security fields.
- [ ] Web и mobile используют согласованный серверный flow; metadata не заменяет proof.
- [ ] UI различает pairing, локально восстановленную сессию и подтверждённую привязку.
- [ ] Сохранены signature/authority/threshold/replay/expiry protections и restore-error fix.
- [ ] Новые regression tests обнаруживали исходный разрыв и проходят после исправления.
- [ ] Existing checks проверены на точном candidate; PASS/FAIL/BLOCKED/NOT RUN не смешаны.
- [ ] Независимый review охватывает финальный auth/proof patch.
- [ ] Clean-копия из candidate SHA воспроизводит сборку и тесты без скрытой зависимости от dirty/untracked файлов.
- [ ] Если публикация разрешена, remote SHA прочитан обратно и CI проверен для него.
- [ ] Web sign-only E2E проверен с участием владельца либо честно остаётся NOT RUN.
- [ ] Android sign-only E2E проверен на идентифицированной версии APK либо честно остаётся NOT RUN.
- [ ] Deploy/установка не заявлены без отдельного разрешения и фактической проверки.

Частичная готовность допустима только с точным названием: например, «offline proof tests PASS; real wallet compatibility BLOCKED». Нельзя обещать, что ошибка больше никогда не повторится, на основании одной успешной сборки.

## 14 Что проверено при подготовке этого файла

**Выполнено по GitHub:** read-only чтение remote branch `main`, точных исходников, path-history, релевантных commits, существующих tests, CI и диагностических документов. Подтверждён описанный разрыв request/handler на remote SHA `a0834ac7...`.

**Выполнено на компьютере:** отдельное read-only сравнение `publication` и `frontend`, их HEAD/history/status, наличия новых routes и релевантных commits; проверка доступных remote-tracking refs; исследование найденного APK/bundle и записи проекта Codex. Результат включён в раздел 7. Он существенно меняет следующий шаг: сначала интеграция существующих fixes, а не разработка с нуля.

**Не выполнялось в этой диагностике:** изменение приложения или Git refs, запуск test suite, новая сборка web/APK, запуск API, проверка реальной БД, live RPC/chain verification, WebAuth signing, browser/device E2E, проверка фактически установленного APK или deployment SHA, commit/push/merge/deploy. Исторические записи о PASS и наличие кода не пересчитаны как новый успешный запуск.

**Остаётся установить:** фактический installed/deployed состав, актуальность remote refs, безопасность и совместимость найденного proof, необходимые зависимости для согласованной интеграции, результаты проверок финального candidate.

## 15 Формат отчёта следующего исполнителя

В финале предоставить:

1. Подтверждённую причину и список отдельно оставшихся гипотез.
2. Исходный и итоговый SHA либо идентификатор patch, используемый checkout и сохранённые пользовательские изменения.
3. Краткий список реально изменённых файлов и обоснование protocol choice.
4. Таблицу или список команд с exit codes и статусами PASS/FAIL/BLOCKED/NOT RUN.
5. Отдельные результаты offline tests, web E2E, Android E2E, CI и deployment.
6. Проверенный remote commit/PR только если публикация была разрешена и выполнена.
7. Точный оставшийся blocker и минимальное действие владельца, если завершение требует доступа, подписи, решения или разрешения.

Главная цель: добиться проверяемой и воспроизводимой совместимости кошелька, обоих клиентов и API, сохранив пользовательскую работу и действующие защитные проверки.
