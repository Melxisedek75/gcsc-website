# GCSC — Priority Roadmap to MVP Launch

**Дата:** 2026-06-26
**Цель:** довести SmartContractor до запуска бета-теста с реальными подрядчиками и домовладельцами в одном пилотном регионе (Seattle, WA).
**Бюджет времени:** 6-8 недель до бета-запуска.

---

## Состояние сейчас

| Слой | Статус |
|---|---|
| Смарт-контракты (proton-tsc) | 11 контрактов компилируются; `gcsctoken111` задеплоен в testnet |
| Backend (`v3/pure-server.js`) | живой, на Railway, Postgres, escrow с CAS-фиксами против гонок |
| Renovation Visualizer | модуль готов в проде на main |
| Mobile MVP (Expo Router) | 10 экранов с реальным UI на mock-данных + mppx payment flow в demo |
| Сайт (gcsc-website / xprnet.org) | публичный лендинг + whitepaper v1.0 |
| Stripe | подключён только в test-режиме, реальные деньги выключены |
| mppx-xpr-network | клиент в mobile/, серверная разводка не подключена |
| WebAuth wallet | не интегрирован в мобильный |

## P0 — блокеры запуска (без этого нельзя)

**1. Backend payment endpoint для mppx 402-flow**
- Файл: `gcsc-smart-contractor/v3/pure-server.js`, новые routes `POST /api/payment/lead-token` и `POST /api/payment/job-posting`
- Что делает: 402 + `WWW-Authenticate: Payment recipient="gcsctoken111" amount="50.0000 XPR"` → верификация txHash через Hyperion
- Срок: 3-5 дней

**2. WebAuth wallet integration в mobile**
- Заменить stub `signTransfer` в `mobile/smartcontractor/lib/payments.ts` на реальный вызов `@proton/web-sdk`
- Срок: 5-7 дней (отладка iOS + Android)

**3. End-to-end testnet flow**
- Homeowner создаёт job → платит 25 XPR posting fee → contractor покупает lead за 50 XPR → выигрывает bid → загружает milestone proof → homeowner approve → выплата
- Срок: 1 неделя после P0-1 и P0-2

**4. KYC light для контракторов**
- Compliance Agent проверяет license number через государственные API (минимум WA state)
- Stripe Identity для homeowner
- Срок: 1 неделя

**5. Аудит смарт-контрактов**
- Внутренний review через `/cso` (gstack) + один sandbox-аудит CertiK/Hacken
- Срок: 2-3 недели параллельно

## P1 — качество беты

**6. Push-уведомления** (Expo Notifications) — 3-5 дней
**7. Disputes UI** — 5-7 дней
**8. Email уведомления** (Resend.com заменит заглушку `sendEmail`) — 2 дня
**9. Onboarding flow** (3 экрана) — 3-5 дней
**10. Mobile production build + TestFlight / Play Internal** — 5-7 дней

## P2 — маркетинговый запуск

**11. Whitepaper v1.3 финализация** (драфт уже есть) — 3-5 дней
**12. Landing site обновление** — 3-5 дней
**13. Demo video** (2-3 мин) — 2-3 дня
**14. Metallicus pitch deck** — 1 неделя

## P3 — отложенное

- Реальные деньги (Stripe live + SETTLEMENT_ENABLED) — только после founder + legal greenlight + CLARITY Act
- Real Estate DAO модуль
- Production AI Agents (CMA, RAA, REA, TA)
- Token launch
- Expansion на другие штаты

---

## Sprint plan (8 недель)

| Sprint | Что |
|---|---|
| 1 | P0-1 backend 402 + P0-2 WebAuth research |
| 2 | P0-2 завершение + P1-8 email |
| 3 | P0-3 end-to-end + P1-7 disputes UI |
| 4 | P0-4 KYC + P1-6 push |
| 5 | P1-9 onboarding + P2-11 whitepaper |
| 6 | P1-10 mobile production + P2-12 landing |
| 7 | P0-5 аудит + P2-13 demo video |
| 8 | P2-14 Metallicus deck + бета open |

## Метрики готовности к бета

- ✅ 100% testnet end-to-end без падений
- ✅ Mobile собирается production, ставится через TestFlight/Play Internal
- ✅ 10+ verified contractors в Seattle
- ✅ Push + email работают
- ✅ Один dispute с положительным разрешением
- ✅ Whitepaper v1.3 опубликован
- ✅ Landing с waitlist

## Что для прода (не для бета)

- Реальные ключи Stripe + SETTLEMENT_ENABLED ON
- Полный CertiK/Hacken аудит (~$30-80K)
- Legal counsel на эскроу + лицензии США
- Banking relationship → **Metallicus / Metal X** (см. partnership deck)
