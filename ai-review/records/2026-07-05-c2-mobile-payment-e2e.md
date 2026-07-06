# AI Review Record

- Change ID: 2026-07-05-c2-mobile-payment-e2e
- Repository: gcsc-smart-contractor (mobile/smartcontractor) + live backend
- Task: C2 (WEEKLY-PLAN-2026-07-06) — mobile 402-flow e2e против задеплоенного backend
- Author AI: CLAUDE
- Environment: Railway prod `gcsc-backend-production.up.railway.app`

## Что проверено (автономно, без реальных денег)

| Шаг | Проверка | Результат |
|---|---|---|
| Сборка | `tsc --noEmit` мобильного приложения | **PASS** (exit 0) |
| Конфиг | `lib/payments.ts` + `eas.json` указывают на прод Railway, `DEMO_MODE=false` | OK |
| Регистрация | `POST /api/auth/register` (contractor, optional verify) | 200, JWT выдан, `verification_required:false` |
| Логин | `POST /api/auth/login` | 200, token (235 симв.) |
| 402 challenge | `POST /api/payment/lead-token` (Bearer, без payment header) | **402** + `WWW-Authenticate: Payment recipient="gcsctoken111" amount="50.0000 XPR" memo="gcsc:lead-token"` |
| Совпадение с конфигом | challenge vs `PAYMENT_CONFIG` (gcsctoken111 / 50.0000 XPR / gcsc:lead-token) | **точное совпадение** |
| P1-1 guard (live) | retry с tx-хэшем без подключённого кошелька | **409** `{"error":"Wallet not connected","code":"wallet_required"}` |

Клиентская логика `livePayment()` в `lib/payments.ts` соответствует контракту сервера:
402 → парс `WWW-Authenticate` → подпись WebAuth → retry с `Bearer` JWT + `X-Payment-Tx` + JSON meta.

## Что НЕ автоматизируется (нужно устройство + founder)

Финальный шаг — реальная подпись `eosio.token::transfer` через WebAuth на телефоне и настоящий on-chain перевод 50 XPR на testnet. Это интерактивное действие в кошельке WebAuth, скриптом не воспроизводится. Всё до этого шага (сервер, протокол, guard'ы) подтверждено вживую.

## Инструкция founder'у для финального on-chain прогона

1. Собрать dev-build: `cd mobile/smartcontractor && npx eas build --profile development --platform android` (или запустить `npx expo start` + Expo Go на dev-сборке).
2. В приложении: зарегистрироваться/войти → подключить WebAuth-кошелёк testnet-аккаунта (напр. `gcsccontractor15`) с ≥50 XPR (пополнить через faucet.xprnetwork.org).
3. Купить Lead Token → одобрить перевод в WebAuth → дождаться `Confirmed`.
4. Проверить tx на `testnet.explorer.xprnetwork.org`; в backend появится receipt (`/api/... ` + запись в payment_receipts).

## Тестовые артефакты
На проде созданы 2 помеченных e2e-пользователя (`e2e-mobile-*@gcsc-test.local`, id 27+) — без кошелька, платежи не проходят. Можно удалить при чистке prod-БД.
