# GCSC — Месячный план + Kimi 2.6 Handoff

> Цель: Kimi 2.6 (до 100 параллельных агентов) делает 80–90% рутины.
> Claude (я) держу ядро: money-paths, архитектура, безопасность, ревью, интеграция, деплой.
> Founder: внешние аккаунты, домены/DNS, секреты, разрешение на реальные деньги.

---

## Принцип разделения труда

| Делает **Kimi 2.6** (рутина, параллельно) | Делаю **Claude** (ядро, последовательно) |
|---|---|
| UI-компоненты и страницы (gcsc-store, маркетинг-сайт) | Backend money-paths (escrow/settlement/auth) в `pure-server.js` |
| Контент/копирайт в гибридном голосе, чистка «блокчейн»-слов на homeowner-UI | Архитектурное решение `pure-server.js` vs миграция на `routes/` |
| Renovation Visualizer — фронт (визард, компоненты) | Renovation Visualizer — backend-логика, сервисы, миграция БД |
| Маркетинг-секции, SEO-мета, адаптив, a11y-полировка | Security-ревью всего, что выдал Kimi |
| Скелеты тестов (unit/component/E2E) | Интеграция фронта Kimi с реальным API |
| Генерация доков, README, дизайн-токенов | Верификация (tsc, eslint, 17 валидаторов, build, smoke) и **деплой** |

**Поток:** Kimi → отдельные ветки/PR → я ревьюю и проверяю → интегрирую → деплою. Kimi **никогда** не пушит в main, не деплоит, не трогает backend money-код и секреты.

---

## План на 4 недели

### Неделя 1 (2026-06-13 → 06-19) — Фундамент и гибридное сообщение
- **Kimi:** взять свой новый дизайн сайта, применить гибридные правила контента (убрать блокчейн/крипто/токен/wallet/XPR со всех homeowner-facing поверхностей; заменить на «Protected Project Agreement», «Milestone Payments», «Verified Progress»). Прогнать по всем страницам маркетинг-сайта и gcsc-store. Выдать ветками.
- **Kimi:** Renovation Visualizer — весь фронт (визард, 9 компонентов, 2 страницы) под Vite+React Router.
- **Claude:** Renovation Visualizer — backend (сервисы, endpoints, миграция БД, mock-AI). Решить escrow-архитектуру. Ревью Kimi-веток №1.

### Неделя 2 (06-20 → 06-26) — Достройка функционала
- **Kimi:** полировка dashboard, маркетинг-страницы (Pricing/About/Security/Contact) в гибридном голосе, SEO-мета + структурные данные, скелеты тестов.
- **Claude:** интеграция Renovation-фронта с API, money-path задачи, security-ревью, слияние проверенных Kimi-веток.

### Неделя 3 (06-27 → 07-03) — Подготовка к деплою
- **Kimi:** адаптив (320/768/1024/1440), accessibility (WCAG AA), perf-полировка (Core Web Vitals), E2E-скелеты, обновление доков.
- **Claude:** деплой-пайплайн (Railway фронт+бэк), финальный QA, чек-лист домена/DNS для founder.

### Неделя 4 (07-04 → 07-10) — Запуск и стабилизация
- **Kimi:** пакеты багфиксов по моему списку, расширение контента.
- **Claude:** прод-деплой обновлённого сайта, привязка домена (с founder), мониторинг, пост-релизные фиксы.

---

## Founder action items (только ты можешь)
- Домен gcsc.store → указать на Railway (DNS-записи). Я дам точные значения.
- Подтверждение замены публичного сайта на новую версию.
- Любые API-ключи (реальный AI-провайдер для Renovation, email-провайдер) — по необходимости.
- Реальные деньги (Stripe live / SETTLEMENT_ENABLED) — НЕ включаем без тебя + legal.

## Мои гейты перед деплоем (на каждую Kimi-партию)
`npx tsc -b --noEmit` ✓ · `npx eslint` ✓ · 17 валидаторов `check:*` ✓ · `npm run build` ✓ · backend smoke ✓ · security-ревью ✓ · гибридный голос соблюдён ✓

---

## ============ MASTER PROMPT ДЛЯ KIMI 2.6 ============
> Скопируй блок ниже целиком в Kimi 2.6. Он рассчитан на запуск множества параллельных агентов.

```
ROLE
You are a senior full-stack engineering swarm. You will spawn independent parallel
agents, each owning ONE self-contained task from the batches below. You produce
production-quality frontend code and content for the GCSC platform. Another engineer
(Claude) reviews, integrates, and deploys your output — you NEVER deploy or push to
main yourself.

PROJECT
GCSC = trust infrastructure for the $13T construction industry. Homeowners fund a
project escrow; verified contractors build; money releases milestone-by-milestone.
POSITIONING IS HYBRID: "trust infrastructure NOW" is the product; token / Web3 /
crypto is a LONG-TERM vision shown only in clearly-labeled investor/vision sections.

THREE REPOS (work only in the two frontend ones; NEVER touch the backend):
1. gcsc-website  (marketing site)  — repo Melxisedek75/gcsc-website  — domain xprnet.org / gcsc.io
2. gcsc-store    (the web app)      — repo Melxisedek75/gcsc-store, branch api-backend — domain gcsc.store
   STACK: Vite + React + TypeScript + Tailwind + React Router. NOT Next.js. Pages are
   React Router routes registered in src/App.tsx (lazy-loaded). API calls go through
   src/services/api.ts (fetch + Bearer token from localStorage 'gcsc_auth_token').
3. gcsc-smart-contractor (backend)  — DO NOT TOUCH. Off-limits. It holds money logic.

HARD RULES (every agent must obey)
- MESSAGING: On any homeowner-facing surface, NEVER use the words blockchain, crypto,
  token, wallet, XPR, on-chain, smart contract, Web3, staking, DeFi. Use instead:
  "Protected Project Agreement", "Milestone Payments", "Verified Progress",
  "Secure Escrow". Token/Web3 content is allowed ONLY inside a section explicitly
  labeled as future vision / investor info.
- STACK: Match Vite + React Router exactly. No Next.js APIs, no /pages or /app router,
  no getServerSideProps. Reuse existing components, design tokens, and Tailwind setup.
- SCOPE: Never edit the backend repo, never touch money/escrow/auth/settlement code,
  never read or write .env or secrets, never call real payment or AI keys (use mocks).
- OUTPUT: Each agent works on its own git branch named kimi/<area>-<task>. Open a PR
  per task with: summary, list of files, screenshots if UI, and a self-check result
  (tsc, eslint, build). NEVER push to main/api-backend directly. NEVER deploy.
- QUALITY: Code must compile (npx tsc -b --noEmit), pass eslint, and build
  (npm run build). Keep every file under 800 lines. Mobile-first responsive at
  320/768/1024/1440. WCAG AA (contrast 4.5:1, focus states, alt text, keyboard nav).
  SVG icons only (no emoji). Respect prefers-reduced-motion.
- DESIGN: Keep your strong visual design, but it must read as a serious corporate /
  premium fintech product — not a generic template. Intentional hierarchy, real
  typography pairing, designed hover/focus states.

TASK BATCHES (spawn agents in parallel; each task is independent)

BATCH A — Hybrid messaging sweep (highest priority)
A1. Audit every homeowner-facing page/component in gcsc-website and gcsc-store for the
    banned words list. Replace with the approved trust-infrastructure vocabulary.
A2. Keep all token/Web3 content but move it into a clearly-labeled "Vision" / "For
    Investors" section, gated and visually separated.
A3. Produce a report listing every file changed and every phrase replaced.

BATCH B — Marketing site (gcsc-website)
B1. Homepage: keep the new premium design, apply hybrid messaging, ensure a path-
    selection ("I'm a Homeowner" / "I'm a Contractor") and trust signals.
B2. Pages: Pricing, About, Security, Contact, How-it-works — consistent design system,
    hybrid voice, responsive, SEO meta + JSON-LD structured data per page.
B3. Performance: inline critical CSS, lazy-load below-fold, optimized images
    (WebP/AVIF, explicit width/height), Core Web Vitals targets (LCP<2.5s, CLS<0.1).

BATCH C — App (gcsc-store)
C1. Dashboard polish: consistent spacing/typography, designed empty/loading/error
    states across all panels.
C2. Renovation Visualizer FRONTEND ONLY (backend is built by Claude; just call the
    documented endpoints via api.ts). Route /renovation-visualizer = step wizard
    (project-type selector, image upload with client-side validation ≤5MB images,
    prompt input, style selector [modern/classic/luxury/budget/energy-efficient],
    budget range, ZIP/address, Generate). Route /project-drafts/:id = before/after,
    scope, cost, timeline, milestones, "Convert to Protected Project Agreement" button.
    Components: ProjectTypeSelector, ImageUploadPanel, RenovationPromptInput,
    VisualResultCard, ScopeOfWorkPanel, CostEstimatePanel, PermitRiskPanel,
    MilestoneBuilder, ConvertButton. Register routes lazily in src/App.tsx.
    Show the permit disclaimer verbatim: "Preliminary permit/code risk screening only.
    Final approval requires licensed professionals and local jurisdiction review."
C3. Responsive + a11y pass across the whole app.

BATCH D — Tests & docs (scaffolding)
D1. Component/unit test skeletons for new and key existing components.
D2. Playwright E2E skeletons for: homepage load, register/login, post a project,
    submit a bid, renovation wizard happy path.
D3. Update READMEs and a CHANGELOG of everything the swarm changed.

HANDOFF FORMAT (for Claude's review)
For each PR include: (1) one-paragraph summary, (2) changed files list, (3) the exact
commands you ran and their pass/fail (tsc, eslint, build), (4) any TODO or assumption,
(5) screenshots for UI tasks. Group PRs by batch. Do not merge anything yourself.

DELIVER: a set of reviewable branches/PRs implementing all batches, with the messaging
report (A3) and the changelog (D3) at the top of the handoff.
```

## ============ КОНЕЦ ПРОМТА ============

После того как Kimi выдаст код — пришли мне ветки/PR/архив. Я прогоню гейты выше, поправлю что нужно, интегрирую с реальным backend и задеплою.

---

## ОБНОВЛЕНИЕ 2026-06-13 — сайт уже готов у Kimi

Kimi уже построил полный скелет нового сайта с дизайном (founder подтвердил). Поэтому
**фронт-батчи B и C из промта выше НЕ нужны** — пропусти их. Актуально из старого промта
только **Batch A** (чистка блокчейн-слов → гибридный голос), если в дизайне Kimi осталась
старая блокчейн-лексика.

Новое разделение: **backend Renovation дробим.** Kimi делает БЕЗОПАСНУЮ половину —
чистые модули-логику без БД/денег/секретов. Claude делает money-часть, storage-слой,
endpoints в `pure-server.js`, convert-to-contract, smoke и деплой.

Claude уже сделал: `v3/database/renovation-migration.sql` (две таблицы) и владеет
интеграцией. Kimi реализует модули ПРОТИВ контракта ниже.

## ============ KIMI BACKEND PROMPT (модули Renovation) ============
```
ROLE
You are an engineering swarm. Spawn parallel agents, each implementing ONE module
below. Output PLAIN Node.js (CommonJS, module.exports), ZERO npm dependencies, pure
and side-effect-free. Another engineer (Claude) wires these into the live server,
owns the database and all money logic, reviews and deploys. You NEVER touch
v3/pure-server.js, the database, .env, secrets, money/escrow/auth code, and you NEVER
deploy. Put your files under v3/services/renovation/ on a branch kimi/renovation-services
and open a PR. Each file < 300 lines. Include unit tests (plain `node:assert`, runnable
with `node`).

CONTEXT
GCSC backend is a single zero-dep Node file. These modules add a homeowner "Renovation
Visualizer": given a project type + description + budget + style, return scope, cost
range, timeline, permit-risk, and milestones. Project types: siding, window, door,
bathroom, kitchen, room_addition, deck, roofing, fence, exterior_paint, interior_remodel.

IMPLEMENT THESE MODULES (exact export contracts — Claude depends on them):

1) v3/services/renovation/permit-risk.js
   module.exports.assessPermitRisk(projectType, userDescription) =>
     { level: 'low'|'medium'|'high', notes: string, disclaimer: string }
   - disclaimer is EXACTLY: "Preliminary permit/code risk screening only. Final approval
     requires licensed professionals and local jurisdiction review."
   - Base level by type: low = exterior_paint, interior_remodel(cosmetic), basic flooring,
     cabinet swap; medium = window, door, siding, roofing, bathroom, kitchen;
     high = room_addition, deck, plus anything structural.
   - Escalate to high if userDescription matches (case-insensitive) any of: structural,
     load-bearing, foundation, addition, electrical panel, rewire, plumbing relocation,
     move wall, remove wall, knock down wall.
   - notes explains the drivers in plain homeowner-friendly English.

2) v3/services/renovation/milestones.js
   module.exports.generateMilestones(projectType) =>
     Array<{ title: string, description: string, percent: number }>  // percents sum to 100
   - Provide tailored templates per project type. Use these two as references:
     siding: Site inspection & measurements; Material delivery; Demo/removal; Weather
       barrier/waterproofing; Siding installation; Trim/detail; Final inspection & approval.
     window/door: Measure & order; Delivery verification; Old unit removal; Framing/rough
       opening; Waterproofing/flashing; Installation; Finish trim & seal; Final approval.
   - For other types, produce sensible 5–8 step sequences. Last step is always homeowner
     approval. Distribute percent weights realistically (sum exactly 100).

3) v3/services/renovation/analysis.js
   module.exports.analyzeRenovation(input) => object, where input =
     { projectType, userDescription, address, zipCode, stylePreference, budgetMin, budgetMax }
   returns:
     { generatedConceptPrompt, scopeOfWork: string[], materialCategories: string[],
       costRange: { min, max }, timelineRange: { minDays, maxDays },
       permitRiskLevel, permitRiskNotes, permitDisclaimer,
       suggestedMilestones: <from generateMilestones>,
       homeownerChecklist: string[], contractorChecklist: string[] }
   - Use assessPermitRisk and generateMilestones internally (require the sibling modules).
   - costRange: derive from projectType base ranges, adjusted by stylePreference
     (budget < modern < classic < energy-efficient < luxury multipliers) and clamped toward
     the provided budgetMin/budgetMax when present. timelineRange: heuristic by type/scope.
   - generatedConceptPrompt: a vivid text prompt describing the desired after-state, for a
     downstream image generator (do NOT call any image API).
   - All pure: no I/O, no randomness that breaks tests (seed or avoid Math.random in values
     that tests assert; a deterministic concept string is fine).

4) v3/services/renovation/visual-provider.js
   - Define a provider interface: { name, generate({ imageUrl, prompt, projectType }) =>
     Promise<{ generatedImageUrl, status: 'mock'|'ok'|'error', providerMetadata }> }.
   - Export class MockVisualProvider implementing it: returns a deterministic placeholder
     URL (e.g. a data: or /placeholder path) with status 'mock' and providerMetadata
     { provider: 'mock', note: 'image generation not connected' }. NO network calls.
   - Export getVisualProvider() factory: returns MockVisualProvider unless
     process.env.RENOVATION_VISUAL_PROVIDER names a real one (leave a clear TODO stub).

5) v3/services/renovation/__tests__ (or *.test.js):
   - Deterministic unit tests for permit-risk (each level + escalation keywords) and
     milestones (each type sums to 100, last step is approval). Use node:assert; exit
     non-zero on failure. No external test runner.

6) v3/services/renovation/README.md
   - Explain each module, the export contracts above, and how to swap MockVisualProvider
     for a real image/AI provider later.

HARD RULES
- Plain CommonJS, zero deps, pure functions, < 300 lines/file, deterministic tests.
- Do NOT require pg, fetch external APIs, read env secrets, or import pure-server.js.
- Homeowner-friendly wording in all strings; NO blockchain/crypto/token words.
- Deliver as branch kimi/renovation-services + PR with: file list, the commands you ran
  (node on each test file) and their pass/fail. Do not merge or deploy.
```
## ============ КОНЕЦ KIMI BACKEND PROMPT ============

Claude доделает поверх модулей Kimi: storage-слой (queryPostgres + in-memory fallback для
двух таблиц), 5 endpoints в `pure-server.js` с auth-гейтами, `convert-to-contract`
(money-path → создание проекта/escrow), smoke-тесты и деплой.
