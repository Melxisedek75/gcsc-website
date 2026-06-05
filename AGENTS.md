# Agent Instructions

> This is a living document — update it as you add skills, learn from errors, and evolve the system.
> This same content is copied identically to three files for cross-environment compatibility.

---

## 🚨 CRITICAL PROJECT RULES (MUST FOLLOW EVERY SESSION)

### ⚡ Rule 1: Project Root is Source of Truth
**Project folder:** `/sessions/ecstatic-intelligent-shannon/mnt/gcsc/`

- **ВСЕГДА** начинаешь с корневой папки проекта когда пользователь спрашивает о файле, папке или компоненте
- Если вопрос о чём-либо из проекта → идёшь сюда ЖЕ и смотришь
- **НИКОГДА** не спрашиваешь "где находится этот файл?"
- **НИКОГДА** не ищешь в интернете то, что должно быть в проекте
- **НИКОГДА** не ходишь в другие папки в поиске локальных файлов проекта
- Ответ ВСЕГДА в `/sessions/ecstatic-intelligent-shannon/mnt/gcsc/`

### 💰 Rule 2: Token Economy
- Каждый поиск вместо прямой проверки корневой папки = потраченные токены пользователя
- Каждый "а где это находится?" = пустой вопрос (тратит время)
- Каждый запрос в интернет о локальном файле = критическая ошибка
- **Экономь токены пользователя — проверяй только корневую папку**

### 🇷🇺 Rule 3: Language Commitment
- **ВСЕГДА** русский язык в ответах
- Технические термины на английском допустимы
- Если заметишь, что начал отвечать по-английски → срочно переключайся на русский
- Это проект русскоговорящего разработчика

### 📋 Rule 4: Communication Style
- Прямой, конкретный ответ — без лишних вопросов
- Если знаешь ответ из контекста (CLAUDE.md, GCSC-PROJECT-KNOWLEDGE.md) → отвечаешь сразу
- Не переспрашиваешь "а что ты имеешь в виду?" если из контекста ясно
- Действуй как соразработчик, а не помощник
- Если пользователю нужно что-то сделать самому на компьютере, сайте, GitHub, Namecheap, кошельке, терминале или в другой среде — объясняй максимально просто, пошагово, как для 12-летнего новичка: что открыть, куда нажать, что вставить, что сохранить, что не трогать.

### Rule 5: Two-Minute Nonstop Continuation Mode
- For GCSC/SmartContractor work, Codex must treat 2-minute nonstop continuation as the default mode for every task, plan, weekly plan, two-week plan, backlog item, validator task, code task, documentation task, founder-prep task, and heartbeat continuation.
- After any completed safe action, scoped task, plan step, commit/push, status note, or blocker-safe handoff, Codex must pause only until the next 2-minute heartbeat and then continue with the next safe unblocked item from the active plan/backlog.
- This rule is persistent and does not need to be reactivated when a new plan is written.
- On each 2-minute continuation wakeup, Codex must read the required context files, run `git status --short --branch`, choose the next safe unblocked item, and use tools directly.
- Stop only for secrets, external accounts, paid services, live Supabase, public website replacement, real payments, real loans, real escrow, stablecoin settlement, token collateral, FIO registration, XPR signatures, legal/provider commitments, destructive actions, production release, or another founder-required live-risk boundary.

### 🔔 Rule 6: New Tools, Skills, Services, and Updates
- Как только появляется новый полезный сервис, connector, plugin, skill, MCP tool, Codex feature, OpenAI update или внешняя программа, которая может ускорить GCSC/SmartContractor, первым делом сообщи пользователю.
- Сообщение должно быть простым и конкретным:
  1. Что появилось.
  2. Что это значит простыми словами.
  3. Как это можно применить в GCSC прямо сейчас.
  4. Какие плюсы, риски, стоимость или ограничения есть.
  5. Нужна ли установка, подключение аккаунта, пароль, API key или оплата.
  6. Твоя рекомендация: внедрять сейчас, отложить или только протестировать.
- Не внедряй новый сервис/skill/plugin в постоянный workflow без решения пользователя, если это требует оплаты, доступа к аккаунту, нового внешнего сервиса, изменения архитектуры или передачи данных третьей стороне.
- Если обновление безопасное, локальное и бесплатно ускоряет работу — можно предложить применить сразу, но всё равно сначала объясни зачем.
- Формат вопроса пользователю: "Хочешь, я применю это для GCSC сейчас?"

---

## Project Context

**Project:** GCSC — Global Construction Smart Contract
**Whitepaper:** v1.0 (2025) — github.com/Melxisedek75/gcsc-website
**What we do:** Decentralized ecosystem for the $13T construction industry on XPR Network — connecting contractors, workers, and homeowners via AI agents + smart contracts. Real revenue from real business models.
**Target audience:** Construction contractors, workers (401K/real estate), homeowners (subscriptions), XPR Network / DeFi community

### About the project

GCSC is a DAO + DeFi protocol specifically for the **construction industry**, built on Proton (XPR Network) using `proton-tsc` (TypeScript → WASM smart contracts).

**Core problem solved:** The $13T global construction industry suffers from delayed payments, fraudulent contractors, zero worker benefits, no transparency. GCSC replaces trust with code.

---

### Token System

**Dual Token:**
| Token | Purpose | Notes |
|-------|---------|-------|
| `GCSC` | Governance + utility + investment | Max 1,000,000,000 supply |
| `GCST` | Internal payments stablecoin | Pegged to $1 USD |

**GCST backing:** 50% USDC/USDT + 30% staked GCSC + 20% real assets (equipment NFTs + Real Estate DAO)

**GCSC Distribution (1B total):**
- 40% Ecosystem Rewards (10-year declining emission)
- 20% Treasury/Real Estate DAO (locked until RE DAO launch)
- 15% Team & Advisors (4yr vest, 1yr cliff)
- 10% Initial Liquidity (DEX bootstrap)
- 10% Community Sale
- 5% Reserve Fund

**Burn mechanics:**
- Price < $0.50 → 50% of fees burned
- Price $0.50–$1.00 → 30% burned
- Price > $1.00 → 10% burned + 50% to stakers

**Revenue streams:**
- Lead Token Sales: $50/lead, 50% burn + 50% Treasury
- Subscriptions: $49–199/mo, 30% stakers + 40% ops + 30% Treasury
- Loan interest: 0.5–2% APR, 70% lenders + 20% Treasury + 10% buyback
- Insurance premiums: 60% reserve + 30% stakers + 10% burn
- Real estate: 100% reinvested

---

### Smart Contract Modules (proton-tsc on XPR Network)

| Contract file | Account | Purpose |
|--------------|---------|---------|
| gcsctoken111/gcsctoken111.contract.ts | gcsctoken111 | Main GCSC token |
| gcscbuild11/gcscbuild11.contract.ts | gcscbuild11 | GCSCBUILD builder token |
| gcsctoken111/gcscmember11.contract.ts | gcscmember11 | Membership (BASIC $49/STANDARD $99/PREMIUM $199 mo, fee in GCSC) |
| gcsctoken111/gcscrealty11.contract.ts | gcscrealty11 | Real Estate DAO — fund → activate → rental income → claim |
| gcsctoken111/gcscstake111.contract.ts | gcscstake111 | Staking GCSC, 12% APY, 30-day lock |
| gcsctoken111/gcscinsure11.contract.ts | gcscinsure11 | Insurance — HEALTH/LIFE/PROPERTY/GENERAL policies + claims |
| gcsctoken111/gcsctreasry1.contract.ts | gcsctreasry1 | Treasury DAO — multi-leader multi-sig, budgets, expenses |
| gcsctoken111/gcsclead1111.contract.ts | gcsclead1111 | Leadership & Governance — proposals, voting, execution |
| gcscbuild11/gcscticket1.contract.ts | gcscticket1 | Weekly lottery — 1M GCSCBUILD = 1 ticket, 3 winners 50/30/20% |
| gcscbuild11/gcscbounty1.contract.ts | gcscbounty1 | Social bounty — proof submission → compliance agent → claim |

---

### Five AI Agents (Python + LangChain + AutoGPT)

| Agent | Code | Role |
|-------|------|------|
| Contractor Matching Agent | CMA | NLP job analysis + geo-matching |
| Risk Assessment Agent | RAA | On-chain credit scoring + ML default prediction |
| Compliance Agent | CA | License verification via government APIs |
| Treasury Agent | TA | DAO treasury management + yield optimization |
| Real Estate Agent | REA | Automated valuation + tenant screening |

---

### Two Main Segments

**Segment A — DCC (Decentralized Contractor Community):**
- Lead Tokens: $50/lead in GCSC, 100% guarantee on first purchase
- Loans: 0.5–2% APR, instant via RAA, max $50K for Tier 1
- Equipment NFTs: collateral for DeFi liquidity, IoT tracked
- Worker 401K: 2–5 GCSC/day + overtime ×1.5 + loyalty bonus, auto-staked
- Real Estate: Build Tiny Homes → live rent-free → buy at 40–60% off after 10 years

**Segment B — Homeowner Platform:**
- Mobile app: SMART-CONTRACTOR (iOS/Android, WebAuth wallet, NFC)
- BASIC $49/mo | PRO $99/mo | ENTERPRISE $199/mo

**SmartContractor Contractor Credit Layer:**
- Contractors can request small working capital loans through the platform based on verified business identity, EIN, license/compliance, completed jobs, rating, dispute history, repayment history, response time, and bid accuracy.
- Purpose: reduce homeowner risk from direct upfront deposits.
- Contractor uses platform credit to buy materials/start work; homeowner pays milestones only after visible/approved progress.
- Milestone payments can repay the loan first, with remaining funds going to the contractor.
- RAA scores risk/credit, CA verifies compliance, TA manages loan pool and repayment.

---

### Roadmap

| Phase | Timeline | Milestones |
|-------|----------|-----------|
| Foundation | M1–3 | Token launch, core contracts, WebAuth, MVP app |
| Growth | M4–8 | AI Agents (CMA/RAA), Proton Loan, 100 contractors, Seattle pilot |
| Expansion | M9–18 | Real Estate DAO, 5 US states, insurance bonds, Metal Bridge |
| Maturity | M19–36 | Full AI autonomy, 10K+ contractors, first RE buyouts, gov integrations |

---

### Stack
- **Blockchain:** XPR Network (Proton) — core + staking
- **Cross-chain:** Metal Blockchain — institutional DeFi
- **Wallet:** WebAuth — biometric + NFC
- **Lending:** Proton Loan
- **Contracts:** proton-tsc (TypeScript → WASM)
- **AI:** Python + LangChain + AutoGPT + XPR/Proton Web SDK + The Graph
- **Security:** CertiK + Hacken + OpenZeppelin audits (planned)
- **DEX:** SimpleDEX (dex.protonnz.com)
- **Claude Code** — development orchestration
- **Machine Payments:** `mppx-xpr-network` v1.3.8 + `mppx` — HTTP-native платежи XPR (402 Payment Required protocol)

### mppx-xpr-network (Machine Payments Protocol)

**Пакет:** `mppx-xpr-network` v1.3.8 | Установлен локально в `node_modules/`
**Документация:** `docs/mppx-xpr-network.md`
**Назначение:** Приём XPR платежей через HTTP без газа, sub-500ms финальность

**Ключевые импорты:**
```ts
import { xpr } from 'mppx-xpr-network'          // Серверный метод
import { xprClient } from 'mppx-xpr-network'     // Клиентский метод
import { Mppx } from 'mppx/server'               // Фреймворк
```

**Два режима:**
- `xpr.charge()` — разовый платёж (Lead Token $50, услуга)
- `xpr.session()` — стриминг (подписки BASIC $49 / STANDARD $99 / PREMIUM $199)

**Как работает:**
1. Сервер возвращает `402 + WWW-Authenticate: Payment`
2. Клиент делает `eosio.token::transfer` на аккаунт `gcsctoken111`
3. Клиент повторяет запрос с `Authorization: Payment` + txHash
4. Сервер верифицирует через Hyperion → возвращает `200 + Payment-Receipt`

**Hyperion ноды (fallback):**
- https://proton.eosusa.io
- https://proton.protonuk.io
- https://proton-api.eosiomadrid.io
- https://xpr-mainnet-api.bloxprod.io
- https://proton-hyperion.luminaryvisn.com

**Применение в GCSC:**
- Lead Token Sales: `xpr.charge({ recipient: 'gcsctoken111', amount: '50.0000 XPR' })`
- Подписки: `xpr.session({ recipient: 'gcsctoken111' })`
- AI Agent-to-Agent платежи: микроплатежи между агентами

**Deploy status:** gcsctoken111 deployed. gcscbuild11/gcscticket1/gcscbounty1 — compiled, accounts pending creation. Email: gcscdao@gmail.com. Network: Proton Testnet.

---

## Architecture

The brain of the project is this file. It's copied identically to three locations so any AI environment sees the same instructions:

| File | Loaded by |
|------|-----------|
| `.claude/CLAUDE.md` | Claude Code CLI (auto-loaded as project instructions) |
| `AGENTS.md` | Cursor, Windsurf, other IDE agents |
| `GEMINI.md` | Google Gemini CLI / plugins |

One content, three entry points. When you update one — update all three.

Inside `.claude/` there are two folders:

**Skills** (`.claude/skills/<name>/`) — SOPs, loaded on demand.
- Each Skill = `SKILL.md` instructions + optional `scripts/` folder
- Frontmatter: `name`, `description`, `allowed-tools`
- One skill = one workflow. Short, focused, concrete.
- Claude auto-discovers and invokes based on your request

**Agents** (`.claude/agents/`) — sub-agents, spawned on demand.
- Lightweight agents with isolated context (cheaper, unbiased)
- Use for: research, code review, QA, classification
- Read-only reporters — all changes happen in the parent agent

**Активные агенты GCSC:**

| Агент | Файл | Назначение |
|-------|------|-----------|
| Research | `research.md` | Исследование XPR Network, строительный рынок, конкуренты, законодательство |
| Code Reviewer | `code-reviewer.md` | Ревью proton-tsc контрактов — Critical/High/Medium/Low + PASS/FAIL |
| QA | `qa.md` | Генерация и запуск тестов для контрактов и Python AI агентов |
| Classifier | `classifier.md` | Классификация лидов, заявок, клеймов, proposals → JSON с routing |

**Workflow Design & Build:**
1. Пишем код
2. Запускаем `code-reviewer` + `qa` параллельно
3. Читаем оба отчёта, применяем правки
4. Деплоим только когда оба вернули PASS

**Shared Utilities** (`execution/`) — common infrastructure scripts used across multiple skills.

**Why this works:** 90% accuracy per step = 59% success over 5 steps. Push repetitive work into deterministic scripts. Claude focuses on decision-making.

---

## Setup Protocol

When starting a fresh project with this file, create the full structure:

```
project/
  AGENTS.md              ← this file (for Cursor/Windsurf)
  GEMINI.md              ← identical copy (for Gemini)
  .claude/
    CLAUDE.md            ← identical copy (for Claude Code)
    settings.local.json  ← permissions + MCP servers
    skills/              ← SOPs (empty at start)
    agents/              ← sub-agent definitions (empty at start)
  execution/             ← shared utility scripts
  .tmp/                  ← intermediate files (never commit)
  .env                   ← API keys (never commit)
  .gitignore             ← must include: .env, .tmp/, credentials.json, token.json
```

### Identical instruction files

All three files (`.claude/CLAUDE.md`, `AGENTS.md`, `GEMINI.md`) contain the **exact same content**. They are not pointers — they are full copies. When you update one, update all three.

---

## How to Create New Skills

When the user asks to create a new workflow/process/skill:

### 1. Create the skill folder and SKILL.md:

```
.claude/skills/<skill-name>/SKILL.md
```

### 2. Use this SKILL.md template:

```markdown
---
name: [Skill Name]
description: [One sentence — what does this skill do]
allowed-tools: [Read, Write, WebSearch, WebFetch, Bash, etc.]
---

# [Skill Name]

## Goal
[What is the end result? Be specific.]

## Input
[What does the user provide to start this skill?]

## Steps
1. [First step — concrete action]
2. [Second step]
3. [Continue until output is produced]
4. Save result to `.tmp/[descriptive_filename].md`

## Output Format
[Describe or show the exact format of the deliverable]

## Learnings
- (This section is updated automatically after each run)
- (Record what worked, what failed, edge cases discovered)
```

### 3. If the skill needs scripts:

```
.claude/skills/<skill-name>/scripts/<script_name>.py
```

Scripts should be deterministic — no LLM calls inside scripts unless absolutely necessary. The skill calls pre-written, tested scripts. LLM decides which script to run and with what parameters.

### 4. Update this file

After creating a skill, add it to the "Available Skills" section below.

---

## How to Create Sub-Agents

When a task benefits from isolated context (research, review, classification):

### 1. Create the agent file:

```
.claude/agents/<agent-name>.md
```

### 2. Use this template:

```markdown
---
model: sonnet
allowed-tools: [Read, Glob, Grep, WebSearch, WebFetch]
---

# [Agent Name]

## Role
[One sentence — what does this agent do]

## Instructions
[What should this agent focus on? What format should it return?]

## Output Format
[Exact format of the report/response]
```

### When to use sub-agents vs skills:
- **Skill** = instructions the parent agent executes itself (like a checklist)
- **Sub-agent** = a separate agent instance with its own context (like delegating to a colleague)

### Recommended sub-agents (create as needed):

| Agent | Purpose | Tools |
|-------|---------|-------|
| `research.md` | Deep research via web/files. Returns compressed summaries (50x token savings) | Read, Glob, Grep, WebSearch, WebFetch |
| `code-reviewer.md` | Code review without context. Returns issues by severity + PASS/FAIL verdict | Read, Write |
| `qa.md` | Generate tests, run them, report pass/fail | Read, Write, Bash |
| `classifier.md` | Classify incoming data into categories (emails, leads, tickets) | Read, Write |

**Key principle:** All sub-agents are **read-only reporters**. They find issues and write reports. The parent agent applies fixes.

### Design & Build workflow (when code-reviewer and qa agents exist):
1. Write the code
2. Run `code-reviewer` sub-agent (in parallel)
3. Run `qa` sub-agent (in parallel)
4. Read both reports, apply fixes
5. Ship only when both checks pass

---

## Self-Annealing Loop

Errors are learning opportunities. When something breaks:

1. **Fix** the script or approach
2. **Test** it (if no paid API cost; otherwise ask first)
3. **Update SKILL.md** — add what you learned to the Learnings section
4. **System is now stronger** — the same error won't happen again

### Auto-update instructions
When you encounter a recurring mistake (2-3 times):
- Propose adding a rule to the instruction files so future sessions one-shot it
- Format: concise, actionable (1-2 lines max)
- Always ask the user before modifying instruction files

---

## Available Skills

> This section is auto-updated as skills are created. Keep it current.

| Skill | Папка | Описание |
|-------|-------|---------|
| **Script Writer** | `.claude/skills/script-writer/` | Создаёт вирусный сценарий видео в 6 ролях одновременно (Исследователь, Аналитик, Стилист, Сценарист, Наставник, Адаптер). Запускать командой: «напиши сценарий» |
| **Content Factory** | `.claude/skills/content-factory/` | Из одного сценария видео → 21 единица контента (статья + 10 тредсов + 5 рилсов + 5 постов). Запускать командой: «запусти контент-завод» |
| **LightRAG** | `.claude/skills/lightrag/` | База знаний GCSC — индексирует все документы и контракты, отвечает на вопросы через граф знаний + векторный поиск. Документация: `docs/lightrag.md` |
| **SmartContractor Daily Build** | `.claude/skills/smartcontractor-daily-build/` | Ежедневный workflow для Codex Operating System: backlog → задача дня → реализация → проверка → docs → commit/push → статус. Запускать командой: «запусти daily build» |
| **Autonomous Builder** | `.claude/skills/autonomous-builder/` | Максимально автономный режим GCSC/SmartContractor: Codex сам выбирает безопасную задачу, реализует, проверяет, обновляет docs, делает scoped commit/push; founder нужен только для секретов, live-систем, денег, внешних аккаунтов, legal и destructive действий. |

<!-- Example format:
### [Category Name]
| Skill | Description |
|-------|-------------|
| `skill-name` | One-line description of what it does |
-->

---

## Session Start Protocol

### First Run (project structure does not exist)

When this is a fresh project and `.claude/` folder doesn't exist yet:

1. Create the full folder structure (see Setup Protocol above)
2. Copy this file's content to `.claude/CLAUDE.md` and `GEMINI.md`
3. **Brief the user** — ask questions to fill in the Project Context section above:
   - "Tell me about yourself and your business — what do you do, who are your customers?"
   - "What are your current goals and priorities?"
   - "What tasks do you want AI agents to handle?"
   - "Are there things I should NEVER do? Any boundaries or rules?"
4. Update the Project Context section in all three instruction files with the answers
5. Confirm: "Architecture is ready. Say 'create a skill for [task]' to build your first workflow."

### Regular Session (architecture exists)

When the user sends a short greeting or "go" / "let's start" / "what do we do?":

1. Read this file to understand the project
2. List available skills
3. Ask what the user wants to work on
4. If the user names a specific skill — load its SKILL.md and execute
5. If the user wants a new workflow — create a skill using the template above

When the user sends a specific task — skip the menu, execute directly.

---

## Operating Principles

**1. Check before building.** Before writing a script, check `.claude/skills/` and `execution/`. Only create new code if nothing exists.

**2. Plan before building.** For non-trivial tasks: plan first (read-only, zero risk), then implement.

**3. One skill = one task.** Keep skills short and focused. 50-100 lines max. If a skill does two things — split it.

**4. Skills auto-activate.** Claude picks the right skill based on the user's request. Each skill's description in frontmatter tells Claude when to use it.

**5. Scripts are bundled.** Each skill runs its own scripts:
```bash
python3 .claude/skills/<name>/scripts/<script>.py
```

**6. Scrap & redo after 2-3 failed attempts.** Stop patching — revert to clean state, implement the best solution in one clean pass.

**7. Local files are for processing only.** Deliverables go to cloud services (Notion, Google Sheets, etc.). Everything in `.tmp/` can be deleted and regenerated.

---

## File Organization

| Directory | Purpose |
|-----------|---------|
| `.claude/CLAUDE.md` | Project instructions for Claude Code (identical to AGENTS.md) |
| `.claude/settings.local.json` | Permissions and MCP server configuration |
| `.claude/skills/<name>/` | SOPs — bundled skills (SKILL.md + scripts/) |
| `.claude/agents/` | Sub-agent definitions (created as needed) |
| `AGENTS.md` | Project instructions for Cursor/Windsurf (identical to CLAUDE.md) |
| `GEMINI.md` | Project instructions for Gemini (identical to CLAUDE.md) |
| `execution/` | Shared utility scripts |
| `.tmp/` | Intermediate files — never commit, always regenerated |
| `.env` | Environment variables and API keys — never commit |
