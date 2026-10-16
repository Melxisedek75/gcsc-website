# KIMI TASKS — Неделя 2026-06-18

> Этот файл читай В НАЧАЛЕ каждой сессии. Он определяет что делать, что не трогать, и в каком порядке.

---

## 🚨 ПРАВИЛА (обязательно прочитать перед стартом)

### ✅ Можешь делать
- Редактировать фронт: `C:\gcsc-store\src\pages\` и `C:\gcsc-store\src\components\`
- Создавать новые `.tsx` компоненты
- Писать контент (тексты, посты, документы)
- Пушить в ветку `api-backend` репо `gcsc-store`

### 🚫 НИКОГДА не трогай
- `gcsc-smart-contractor/v3/pure-server.js` — живой прод-бэкенд
- `gcsc-smart-contractor/v3/database/` — миграции и схемы
- `gcsc-smart-contractor/routes/` — мёртвый код, не трогать
- Stripe / escrow логику — только founder + legal
- Ветку `main` в `gcsc-smart-contractor` — только через PR
- `/token/*` endpoints — не реализованы, не создавать
- Реальные деньги, платежи, Stripe live ключи

### ⚠️ Перед постройкой любой фичи
1. Сделай `grep` по существующему коду — возможно уже сделано
2. Прочитай `C:\gcsc\.claude\CLAUDE.md` для контекста проекта
3. Не переписывай готовое — добавляй или улучшай

---

## 📋 ЗАДАЧИ НА НЕДЕЛЮ

### 🔴 Приоритет 1 — Запуск gcsc.store

#### ЗАДАЧА 1: SEO мета-теги для всех страниц
**Файл:** `C:\gcsc-store\src\` (index.html + компоненты страниц)
**Что сделать:**
- `<title>` для каждой страницы (Home, About, Contact, Security, Token)
- `<meta name="description">` — уникальная для каждой страницы
- Open Graph теги: `og:title`, `og:description`, `og:image`, `og:url`
- Twitter Card: `twitter:card`, `twitter:title`, `twitter:description`
- Canonical URL: `https://gcsc.store`

**Тексты для Home:**
- Title: `GCSC — Global Construction Smart Contract | XPR Network`
- Description: `Decentralized ecosystem for the $13T construction industry. AI agents + smart contracts connecting contractors, workers, and homeowners.`

---

#### ЗАДАЧА 2: Страница /contact — форма обратной связи
**Файл:** `C:\gcsc-store\src\pages\Contact.tsx`
**Что сделать:**
- Добавить рабочую форму: поля Имя, Email, Тема (выпадающий список), Сообщение
- Темы: `General`, `Contractor Sign-up`, `Investor Inquiry`, `Technical Support`
- При отправке → `POST https://gcsc-backend.up.railway.app/api/contact` (если endpoint не существует — показывать mailto: `gcscdao@gmail.com`)
- Успех: показать "Message sent! We'll reply within 24 hours."
- Ошибка: показать inline сообщение, не редиректить
- Стиль: тёмная тема, соответствует текущему дизайну gcsc.store

---

#### ЗАДАЧА 3: Страница /about — секция Roadmap
**Файл:** `C:\gcsc-store\src\pages\About.tsx`
**Что сделать:**
- Добавить секцию "Roadmap" после существующего контента
- 4 фазы (timeline вертикальный или горизонтальный):

| Фаза | Период | Ключевые события |
|------|--------|-----------------|
| Foundation | M1–3 | Token launch, core contracts, WebAuth, MVP app |
| Growth | M4–8 | AI Agents (CMA/RAA), Proton Loan, 100 contractors, Seattle pilot |
| Expansion | M9–18 | Real Estate DAO, 5 US states, insurance bonds, Metal Bridge |
| Maturity | M19–36 | Full AI autonomy, 10K+ contractors, first RE buyouts |

- Текущая фаза (Foundation) — выделить визуально как "ACTIVE"
- Стиль: тёмная тема, акцент цвет из существующего дизайна

---

### 🟡 Приоритет 2 — Маркетинг

#### ЗАДАЧА 4: 5 твитов для запуска gcsc.store
**Сохранить в:** `C:\gcsc\social-posts-launch.md`
**Что сделать:**
- 5 отдельных твитов (до 280 символов каждый)
- Тема: запуск нового сайта gcsc.store
- Упомянуть: XPR Network, $13T строительный рынок, AI + smart contracts
- Хэштеги: #GCSC #XPRNetwork #DeFi #Construction #SmartContract
- Тон: профессиональный, без хайпа — факты
- НЕ обещать доходность, токен-прайс, "to the moon"

---

#### ЗАДАЧА 5: Email для подрядчиков (холодный outreach)
**Сохранить в:** `C:\gcsc\email-contractor-outreach.md`
**Что сделать:**
- Subject line (3 варианта A/B/C)
- Тело письма (300–400 слов)
- Аудитория: независимые подрядчики в США (строительство, ремонт)
- Боли: нет лидов, нет доверия от клиентов, нет финансирования
- Решение: GCSC Lead Token ($50/лид), проверка подрядчика, рабочий кредит
- CTA: "Register at gcsc.store"
- НЕ упоминать токен как инвестицию

---

#### ЗАДАЧА 6: Investor One-Pager (HTML)
**Сохранить в:** `C:\gcsc\investor-one-pager.html`
**Что сделать:**
- Одна HTML страница, print-ready (A4)
- Тёмный дизайн, логотип GCSC
- Секции:
  1. The Problem ($13T индустрия, 3 боли: задержки, мошенники, нет льгот)
  2. The Solution (GCSC ecosystem: AI + smart contracts)
  3. Business Model (Lead Tokens $50, подписки $49–199/мо, кредиты 0.5–2%)
  4. Token Economics (1B GCSC, dual token, burn mechanics)
  5. Traction (testnet deployed, MVP ready, gcsc.store live)
  6. Team / Contact (gcscdao@gmail.com, gcsc.store)
- НЕ указывать конкретные цены токена или прогнозы ROI

---

### 🟢 Приоритет 3 — Технический долг

#### ЗАДАЧА 7: Удалить избыточный файл
**Файл для удаления:** `C:\gcsc-smart-contractor\v3\database\renovation-migration.sql`
**Причина:** дублирует inline-миграцию в pure-server.js, к тому же без поля `converted_project_id`. Просто удалить и закоммитить с сообщением `chore: remove redundant renovation-migration.sql (duplicates inline migration in pure-server.js)`.

---

## 📊 СТАТУС ЗАДАЧ

| # | Задача | Статус |
|---|--------|--------|
| 1 | SEO мета-теги | ⬜ Не начато |
| 2 | Contact форма | ⬜ Не начато |
| 3 | Roadmap секция в /about | ⬜ Не начато |
| 4 | 5 твитов для запуска | ⬜ Не начато |
| 5 | Email outreach для подрядчиков | ⬜ Не начато |
| 6 | Investor one-pager | ⬜ Не начато |
| 7 | Удалить renovation-migration.sql | ⬜ Не начато |

> Обновляй статус: ⬜ Не начато → 🔄 В процессе → ✅ Готово → ❌ Заблокировано

---

## 🔗 Контекст проекта

- **Сайт:** https://gcsc.store (Vercel, Kimi dark дизайн)
- **Бэкенд:** https://gcsc-backend.up.railway.app
- **GitHub фронт:** https://github.com/Melxisedek75/gcsc-store (ветка `api-backend`)
- **GitHub бэкенд:** https://github.com/Melxisedek75/gcsc-smart-contractor (ветка `main`)
- **Email:** gcscdao@gmail.com
- **Полный контекст:** читай `C:\gcsc\.claude\CLAUDE.md`
