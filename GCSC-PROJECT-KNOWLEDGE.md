# GCSC — Global Construction Smart Contract
## Полная база знаний проекта

---

## 1. О проекте

**Проект:** GCSC — Global Construction Smart Contract  
**GitHub:** github.com/Melxisedek75/gcsc-website  
**Email:** gcscdao@gmail.com  
**Whitepaper:** v1.0 (2025)  
**Сеть:** XPR Network (Proton) — Testnet (Mainnet в планах)  
**Статус деплоя:** gcsctoken111 задеплоен. gcscbuild11/gcscticket1/gcscbounty1 — скомпилированы, аккаунты ожидают создания.

**Что делаем:** Децентрализованная экосистема для строительной отрасли стоимостью $13 трлн на XPR Network — соединяем подрядчиков, рабочих и домовладельцев через AI-агентов и смарт-контракты. Реальный доход от реальных бизнес-моделей.

**Целевая аудитория:** Строительные подрядчики, рабочие (401K/недвижимость), домовладельцы (подписки), сообщество XPR Network / DeFi.

**Основная проблема:** Строительная отрасль страдает от задержек платежей, мошеннических подрядчиков, отсутствия льгот для рабочих и полной непрозрачности. GCSC заменяет доверие кодом.

---

## 2. Токен-система

### Два токена

| Токен | Назначение | Примечание |
|-------|-----------|-----------|
| `GCSC` | Управление + утилита + инвестиции | Макс. 1 000 000 000 |
| `GCST` | Внутренний стейблкоин платежей | Привязан к $1 USD |

### Обеспечение GCST
50% USDC/USDT + 30% застейканный GCSC + 20% реальные активы (NFT оборудования + Real Estate DAO)

### Распределение GCSC (1 млрд итого)
- 40% — Ecosystem Rewards (10-летняя убывающая эмиссия)
- 20% — Treasury/Real Estate DAO (заблокировано до запуска RE DAO)
- 15% — Team & Advisors (4yr вестинг, 1yr клифф)
- 10% — Initial Liquidity (DEX bootstrap)
- 10% — Community Sale
- 5% — Reserve Fund

### Механика сжигания (burn)
- Цена < $0.50 → 50% комиссий сжигается
- Цена $0.50–$1.00 → 30% сжигается
- Цена > $1.00 → 10% сжигается + 50% стейкерам

### Потоки доходов
- Lead Token Sales: $50/лид, 50% burn + 50% Treasury
- Подписки: $49–199/мес, 30% стейкерам + 40% операции + 30% Treasury
- Кредитные проценты: 0.5–2% APR, 70% кредиторам + 20% Treasury + 10% выкуп
- Страховые взносы: 60% резерв + 30% стейкерам + 10% burn
- Недвижимость: 100% реинвестируется

---

## 3. Смарт-контракты (proton-tsc на XPR Network)

| Файл контракта | Аккаунт | Назначение |
|----------------|---------|-----------|
| gcsctoken111/gcsctoken111.contract.ts | gcsctoken111 | Основной токен GCSC |
| gcscbuild11/gcscbuild11.contract.ts | gcscbuild11 | Билдер-токен GCSCBUILD |
| gcsctoken111/gcscmember11.contract.ts | gcscmember11 | Членство (BASIC $49 / STANDARD $99 / PREMIUM $199 мес, оплата в GCSC) |
| gcsctoken111/gcscrealty11.contract.ts | gcscrealty11 | Real Estate DAO — fund → activate → rental income → claim |
| gcsctoken111/gcscstake111.contract.ts | gcscstake111 | Стейкинг GCSC, 12% APY, 30-дневная блокировка |
| gcsctoken111/gcscinsure11.contract.ts | gcscinsure11 | Страхование — HEALTH / LIFE / PROPERTY / GENERAL полисы + клеймы |
| gcsctoken111/gcsctreasry1.contract.ts | gcsctreasry1 | Treasury DAO — мульти-подпись лидеров, бюджеты, расходы |
| gcsctoken111/gcsclead1111.contract.ts | gcsclead1111 | Управление (Leadership & Governance) — proposals, voting, execution |
| gcscbuild11/gcscticket1.contract.ts | gcscticket1 | Еженедельная лотерея — 1M GCSCBUILD = 1 билет, 3 победителя 50/30/20% |
| gcscbuild11/gcscbounty1.contract.ts | gcscbounty1 | Social bounty — отправка доказательств → compliance agent → claim |

---

## 4. Пять AI-агентов (Python + LangChain + AutoGPT)

| Агент | Код | Роль |
|-------|-----|------|
| Contractor Matching Agent | CMA | NLP-анализ вакансий + гео-матчинг |
| Risk Assessment Agent | RAA | On-chain кредитный скоринг + ML прогноз дефолта |
| Compliance Agent | CA | Верификация лицензий через гос. API |
| Treasury Agent | TA | Управление Treasury DAO + оптимизация доходности |
| Real Estate Agent | REA | Автоматическая оценка + проверка арендаторов |

### Sub-агенты в репозитории (.claude/agents/)
| Агент | Назначение |
|-------|-----------|
| research.md | Исследование XPR Network, строительный рынок, конкуренты |
| code-reviewer.md | Ревью proton-tsc контрактов → Critical/High/Medium/Low + PASS/FAIL |
| qa.md | Генерация и запуск тестов для контрактов и Python AI агентов |
| classifier.md | Классификация лидов, заявок, клеймов, proposals → JSON с routing |

---

## 5. Два сегмента

### Segment A — DCC (Decentralized Contractor Community)
- **Lead Tokens:** $50/лид в GCSC, 100% гарантия на первую покупку
- **Кредиты:** 0.5–2% APR, мгновенно через RAA, макс. $50K для Tier 1
- **Equipment NFTs:** залог для DeFi ликвидности, IoT-трекинг
- **Worker 401K:** 2–5 GCSC/день + сверхурочные ×1.5 + бонус за стаж, автостейкинг
- **Real Estate:** строим Tiny Homes → живёшь бесплатно → покупаешь за 40–60% от рыночной после 10 лет

### Segment B — Homeowner Platform
- Мобильное приложение: SMART-CONTRACTOR (iOS/Android, WebAuth wallet, NFC)
- BASIC $49/мес | PRO $99/мес | ENTERPRISE $199/мес

### SmartContractor Contractor Credit Layer
- Подрядчики смогут брать небольшие working capital loans под свой бизнес и репутацию на платформе.
- Цель: убрать рискованную модель, где homeowner даёт большой аванс напрямую подрядчику.
- Подрядчик покупает материалы и начинает работу через платформенный loan, а homeowner оплачивает milestone только после видимого/подтверждённого прогресса.
- Loan eligibility зависит от EIN/business verification, лицензии, insurance/compliance, количества завершённых работ, рейтинга, dispute history, repayment history, response time и bid accuracy.
- RAA рассчитывает contractor credit/risk score.
- CA проверяет бизнес, лицензии, insurance и compliance.
- TA управляет loan pool, repayment routing, delinquency alerts и treasury reporting.
- Milestone payments могут автоматически погашать loan сначала, затем остаток идёт подрядчику.
- Репутация подрядчика превращается в credit asset внутри GCSC.

---

## 6. Дорожная карта (Roadmap)

| Фаза | Сроки | Ключевые события |
|------|-------|-----------------|
| Foundation | M1–3 | Запуск токена, основные контракты, WebAuth, MVP приложение |
| Growth | M4–8 | AI Agents (CMA/RAA), Proton Loan, 100 подрядчиков, пилот в Сиэтле |
| Expansion | M9–18 | Real Estate DAO, 5 штатов США, страховые бонды, Metal Bridge |
| Maturity | M19–36 | Полная AI-автономия, 10K+ подрядчиков, первые RE-выкупы, гос. интеграции |

---

## 7. Технический стек

- **Блокчейн:** XPR Network (Proton) — core + staking
- **Cross-chain:** Metal Blockchain — institutional DeFi
- **Кошелёк:** WebAuth — биометрия + NFC
- **Кредитование:** Proton Loan
- **Контракты:** proton-tsc (TypeScript → WASM)
- **AI:** Python + LangChain + AutoGPT + XPR/Proton Web SDK + The Graph
- **Безопасность:** CertiK + Hacken + OpenZeppelin аудиты (планируются)
- **DEX:** SimpleDEX (dex.protonnz.com)
- **Машинные платежи:** `mppx-xpr-network` v1.3.8

---

## 8. Machine Payments Protocol (mppx-xpr-network)

**Пакет:** `mppx-xpr-network` v1.3.8 | Установлен в `node_modules/`  
**Назначение:** Приём XPR платежей через HTTP без газа, sub-500ms финальность

### Два режима
- `xpr.charge()` — разовый платёж (Lead Token $50, услуга)
- `xpr.session()` — стриминг (подписки BASIC/STANDARD/PREMIUM)

### Как работает (402 Payment Required protocol)
1. Сервер → `402 + WWW-Authenticate: Payment`
2. Клиент → `eosio.token::transfer` на аккаунт `gcsctoken111`
3. Клиент повторяет запрос с `Authorization: Payment` + txHash
4. Сервер верифицирует через Hyperion → `200 + Payment-Receipt`

### Hyperion ноды (fallback)
- https://proton.eosusa.io
- https://proton.protonuk.io
- https://proton-api.eosiomadrid.io
- https://xpr-mainnet-api.bloxprod.io
- https://proton-hyperion.luminaryvisn.com

### Применение в GCSC
- Lead Token Sales: `xpr.charge({ recipient: 'gcsctoken111', amount: '50.0000 XPR' })`
- Подписки: `xpr.session({ recipient: 'gcsctoken111' })`
- AI Agent-to-Agent: микроплатежи между агентами

---

## 9. Структура файлов проекта

```
C:\gcsc\
  .claude/CLAUDE.md          ← инструкции для Claude Code
  AGENTS.md                  ← инструкции для Cursor/Windsurf
  GEMINI.md                  ← инструкции для Gemini
  .claude/skills/            ← навыки / SOP-процессы
    script-writer/           ← создаёт вирусный сценарий видео (6 ролей)
    content-factory/         ← из сценария → 21 единица контента
    lightrag/                ← база знаний через граф + векторный поиск
  .claude/agents/            ← sub-агенты (research, code-reviewer, qa, classifier)
  gcsctoken111/              ← смарт-контракты основного токена
  gcscbuild11/               ← смарт-контракты builder-токена
  docs/                      ← документация
  assets/                    ← медиа ресурсы
  construction-ai/           ← AI-агенты Python
  execution/                 ← общие утилиты
```

---

## 10. Принципы работы с AI

1. **Проверяй перед созданием** — смотри `.claude/skills/` и `execution/` прежде чем писать новый код
2. **Планируй перед реализацией** — для нетривиальных задач: сначала план, потом код
3. **Один навык = одна задача** — 50-100 строк макс.
4. **Workflow разработки:** пишем код → запускаем code-reviewer + qa параллельно → применяем правки → деплоим только когда оба PASS
5. **После 2-3 неудачных попыток** — откатываемся и делаем заново с нуля
