# Agent Instructions

> This is a living document â€” update it as you add skills, learn from errors, and evolve the system.
> This same content is copied identically to three files for cross-environment compatibility.

## ðŸš¨ CRITICAL: Root Project Folder

**All projects and files are in:** `C:\gcsc` on the user's computer.
This folder is mounted to the VM at a session-specific path (e.g. `/sessions/<session-id>/mnt/gcsc/`).

**Rules (MUST follow every session):**
- ALWAYS start from the mounted gcsc folder when asked about any file or project
- NEVER ask "where is this file?" â€” it's in the gcsc folder
- NEVER search the internet for something that should be in the project
- Sub-projects currently in this folder: `construction-ai/`, `xprclaw/`, `gcsctoken111/`, `gcscbuild11/`, `docs/`
- Language: ALWAYS respond in **Russian** (English only for technical terms)


### User Step-by-Step Rule
- Если пользователю нужно что-то сделать самому на компьютере, сайте, GitHub, Namecheap, кошельке, терминале или в другой среде — объясняй максимально просто, пошагово, как для 12-летнего новичка: что открыть, куда нажать, что вставить, что сохранить, что не трогать.

### New Tools, Skills, Services, and Updates Rule
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

### ðŸ’» Rule 5: Windows Terminal Commands
- User works in **Windows PowerShell** (not bash, not CMD)
- ALWAYS provide the full command block starting with `cd C:\gcsc\<project-folder>`
- ALWAYS specify "ÐžÑ‚ÐºÑ€Ð¾Ð¹ Windows PowerShell" before any terminal instructions
- Commands must be copy-paste ready as a single block

## Project Context

**Project:** GCSC â€” Global Construction Smart Contract
**Whitepaper:** v1.0 (2025) â€” github.com/Melxisedek75/gcsc-website
**What we do:** Decentralized ecosystem for the $13T construction industry on XPR Network â€” connecting contractors, workers, and homeowners via AI agents + smart contracts. Real revenue from real business models.
**Target audience:** Construction contractors, workers (401K/real estate), homeowners (subscriptions), XPR Network / DeFi community

### About the project

GCSC is a DAO + DeFi protocol specifically for the **construction industry**, built on Proton (XPR Network) using `proton-tsc` (TypeScript â†’ WASM smart contracts).

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
- Price < $0.50 â†’ 50% of fees burned
- Price $0.50â€“$1.00 â†’ 30% burned
- Price > $1.00 â†’ 10% burned + 50% to stakers

**Revenue streams:**
- Lead Token Sales: $50/lead, 50% burn + 50% Treasury
- Subscriptions: $49â€“199/mo, 30% stakers + 40% ops + 30% Treasury
- Loan interest: 0.5â€“2% APR, 70% lenders + 20% Treasury + 10% buyback
- Insurance premiums: 60% reserve + 30% stakers + 10% burn
- Real estate: 100% reinvested

---

### Smart Contract Modules (proton-tsc on XPR Network)

| Contract file | Account | Purpose |
|--------------|---------|---------|
| gcsctoken111/gcsctoken111.contract.ts | gcsctoken111 | Main GCSC token |
| gcscbuild11/gcscbuild11.contract.ts | gcscbuild11 | GCSCBUILD builder token |
| gcsctoken111/gcscmember11.contract.ts | gcscmember11 | Membership (BASIC $49/STANDARD $99/PREMIUM $199 mo, fee in GCSC) |
| gcsctoken111/gcscrealty11.contract.ts | gcscrealty11 | Real Estate DAO â€” fund â†’ activate â†’ rental income â†’ claim |
| gcsctoken111/gcscstake111.contract.ts | gcscstake111 | Staking GCSC, 12% APY, 30-day lock |
| gcsctoken111/gcscinsure11.contract.ts | gcscinsure11 | Insurance â€” HEALTH/LIFE/PROPERTY/GENERAL policies + claims |
| gcsctoken111/gcsctreasry1.contract.ts | gcsctreasry1 | Treasury DAO â€” multi-leader multi-sig, budgets, expenses |
| gcsctoken111/gcsclead1111.contract.ts | gcsclead1111 | Leadership & Governance â€” proposals, voting, execution |
| gcscbuild11/gcscticket1.contract.ts | gcscticket1 | Weekly lottery â€” 1M GCSCBUILD = 1 ticket, 3 winners 50/30/20% |
| gcscbuild11/gcscbounty1.contract.ts | gcscbounty1 | Social bounty â€” proof submission â†’ compliance agent â†’ claim |

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

**Segment A â€” DCC (Decentralized Contractor Community):**
- Lead Tokens: $50/lead in GCSC, 100% guarantee on first purchase
- Loans: 0.5â€“2% APR, instant via RAA, max $50K for Tier 1
- Equipment NFTs: collateral for DeFi liquidity, IoT tracked
- Worker 401K: 2â€“5 GCSC/day + overtime Ã—1.5 + loyalty bonus, auto-staked
- Real Estate: Build Tiny Homes â†’ live rent-free â†’ buy at 40â€“60% off after 10 years

**Segment B â€” Homeowner Platform:**
- Mobile app: SMART-CONTRACTOR (iOS/Android, WebAuth wallet, NFC)
- BASIC $49/mo | PRO $99/mo | ENTERPRISE $199/mo

---

### Roadmap

| Phase | Timeline | Milestones |
|-------|----------|-----------|
| Foundation | M1â€“3 | Token launch, core contracts, WebAuth, MVP app |
| Growth | M4â€“8 | AI Agents (CMA/RAA), Proton Loan, 100 contractors, Seattle pilot |
| Expansion | M9â€“18 | Real Estate DAO, 5 US states, insurance bonds, Metal Bridge |
| Maturity | M19â€“36 | Full AI autonomy, 10K+ contractors, first RE buyouts, gov integrations |

---

### Stack
- **Blockchain:** XPR Network (Proton) â€” core + staking
- **Cross-chain:** Metal Blockchain â€” institutional DeFi
- **Wallet:** WebAuth â€” biometric + NFC
- **Lending:** Proton Loan
- **Contracts:** proton-tsc (TypeScript â†’ WASM)
- **AI:** Python + LangChain + AutoGPT + XPR/Proton Web SDK + The Graph
- **Security:** CertiK + Hacken + OpenZeppelin audits (planned)
- **DEX:** SimpleDEX (dex.protonnz.com)
- **Claude Code** â€” development orchestration
- **Machine Payments:** `mppx-xpr-network` v1.3.8 + `mppx` â€” HTTP-native Ð¿Ð»Ð°Ñ‚ÐµÐ¶Ð¸ XPR (402 Payment Required protocol)

### mppx-xpr-network (Machine Payments Protocol)

**ÐŸÐ°ÐºÐµÑ‚:** `mppx-xpr-network` v1.3.8 | Ð£ÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½ Ð»Ð¾ÐºÐ°Ð»ÑŒÐ½Ð¾ Ð² `node_modules/`
**Ð”Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð°Ñ†Ð¸Ñ:** `docs/mppx-xpr-network.md`
**ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ:** ÐŸÑ€Ð¸Ñ‘Ð¼ XPR Ð¿Ð»Ð°Ñ‚ÐµÐ¶ÐµÐ¹ Ñ‡ÐµÑ€ÐµÐ· HTTP Ð±ÐµÐ· Ð³Ð°Ð·Ð°, sub-500ms Ñ„Ð¸Ð½Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚ÑŒ

**ÐšÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ðµ Ð¸Ð¼Ð¿Ð¾Ñ€Ñ‚Ñ‹:**
```ts
import { xpr } from 'mppx-xpr-network'          // Ð¡ÐµÑ€Ð²ÐµÑ€Ð½Ñ‹Ð¹ Ð¼ÐµÑ‚Ð¾Ð´
import { xprClient } from 'mppx-xpr-network'     // ÐšÐ»Ð¸ÐµÐ½Ñ‚ÑÐºÐ¸Ð¹ Ð¼ÐµÑ‚Ð¾Ð´
import { Mppx } from 'mppx/server'               // Ð¤Ñ€ÐµÐ¹Ð¼Ð²Ð¾Ñ€Ðº
```

**Ð”Ð²Ð° Ñ€ÐµÐ¶Ð¸Ð¼Ð°:**
- `xpr.charge()` â€” Ñ€Ð°Ð·Ð¾Ð²Ñ‹Ð¹ Ð¿Ð»Ð°Ñ‚Ñ‘Ð¶ (Lead Token $50, ÑƒÑÐ»ÑƒÐ³Ð°)
- `xpr.session()` â€” ÑÑ‚Ñ€Ð¸Ð¼Ð¸Ð½Ð³ (Ð¿Ð¾Ð´Ð¿Ð¸ÑÐºÐ¸ BASIC $49 / STANDARD $99 / PREMIUM $199)

**ÐšÐ°Ðº Ñ€Ð°Ð±Ð¾Ñ‚Ð°ÐµÑ‚:**
1. Ð¡ÐµÑ€Ð²ÐµÑ€ Ð²Ð¾Ð·Ð²Ñ€Ð°Ñ‰Ð°ÐµÑ‚ `402 + WWW-Authenticate: Payment`
2. ÐšÐ»Ð¸ÐµÐ½Ñ‚ Ð´ÐµÐ»Ð°ÐµÑ‚ `eosio.token::transfer` Ð½Ð° Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚ `gcsctoken111`
3. ÐšÐ»Ð¸ÐµÐ½Ñ‚ Ð¿Ð¾Ð²Ñ‚Ð¾Ñ€ÑÐµÑ‚ Ð·Ð°Ð¿Ñ€Ð¾Ñ Ñ `Authorization: Payment` + txHash
4. Ð¡ÐµÑ€Ð²ÐµÑ€ Ð²ÐµÑ€Ð¸Ñ„Ð¸Ñ†Ð¸Ñ€ÑƒÐµÑ‚ Ñ‡ÐµÑ€ÐµÐ· Hyperion â†’ Ð²Ð¾Ð·Ð²Ñ€Ð°Ñ‰Ð°ÐµÑ‚ `200 + Payment-Receipt`

**Hyperion Ð½Ð¾Ð´Ñ‹ (fallback):**
- https://proton.eosusa.io
- https://proton.protonuk.io
- https://proton-api.eosiomadrid.io
- https://xpr-mainnet-api.bloxprod.io
- https://proton-hyperion.luminaryvisn.com

**ÐŸÑ€Ð¸Ð¼ÐµÐ½ÐµÐ½Ð¸Ðµ Ð² GCSC:**
- Lead Token Sales: `xpr.charge({ recipient: 'gcsctoken111', amount: '50.0000 XPR' })`
- ÐŸÐ¾Ð´Ð¿Ð¸ÑÐºÐ¸: `xpr.session({ recipient: 'gcsctoken111' })`
- AI Agent-to-Agent Ð¿Ð»Ð°Ñ‚ÐµÐ¶Ð¸: Ð¼Ð¸ÐºÑ€Ð¾Ð¿Ð»Ð°Ñ‚ÐµÐ¶Ð¸ Ð¼ÐµÐ¶Ð´Ñƒ Ð°Ð³ÐµÐ½Ñ‚Ð°Ð¼Ð¸

**Deploy status:** gcsctoken111 deployed. gcscbuild11/gcscticket1/gcscbounty1 â€” compiled, accounts pending creation. Email: gcscdao@gmail.com. Network: Proton Testnet.

---

## Architecture

The brain of the project is this file. It's copied identically to three locations so any AI environment sees the same instructions:

| File | Loaded by |
|------|-----------|
| `.claude/CLAUDE.md` | Claude Code CLI (auto-loaded as project instructions) |
| `AGENTS.md` | Cursor, Windsurf, other IDE agents |
| `GEMINI.md` | Google Gemini CLI / plugins |

One content, three entry points. When you update one â€” update all three.

Inside `.claude/` there are two folders:

**Skills** (`.claude/skills/<name>/`) â€” SOPs, loaded on demand.
- Each Skill = `SKILL.md` instructions + optional `scripts/` folder
- Frontmatter: `name`, `description`, `allowed-tools`
- One skill = one workflow. Short, focused, concrete.
- Claude auto-discovers and invokes based on your request

**Agents** (`.claude/agents/`) â€” sub-agents, spawned on demand.
- Lightweight agents with isolated context (cheaper, unbiased)
- Use for: research, code review, QA, classification
- Read-only reporters â€” all changes happen in the parent agent

**ÐÐºÑ‚Ð¸Ð²Ð½Ñ‹Ðµ Ð°Ð³ÐµÐ½Ñ‚Ñ‹ GCSC:**

| ÐÐ³ÐµÐ½Ñ‚ | Ð¤Ð°Ð¹Ð» | ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ |
|-------|------|-----------|
| Research | `research.md` | Ð˜ÑÑÐ»ÐµÐ´Ð¾Ð²Ð°Ð½Ð¸Ðµ XPR Network, ÑÑ‚Ñ€Ð¾Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ð¹ Ñ€Ñ‹Ð½Ð¾Ðº, ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚Ñ‹, Ð·Ð°ÐºÐ¾Ð½Ð¾Ð´Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð¾ |
| Code Reviewer | `code-reviewer.md` | Ð ÐµÐ²ÑŒÑŽ proton-tsc ÐºÐ¾Ð½Ñ‚Ñ€Ð°ÐºÑ‚Ð¾Ð² â€” Critical/High/Medium/Low + PASS/FAIL |
| QA | `qa.md` | Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ Ð¸ Ð·Ð°Ð¿ÑƒÑÐº Ñ‚ÐµÑÑ‚Ð¾Ð² Ð´Ð»Ñ ÐºÐ¾Ð½Ñ‚Ñ€Ð°ÐºÑ‚Ð¾Ð² Ð¸ Python AI Ð°Ð³ÐµÐ½Ñ‚Ð¾Ð² |
| Classifier | `classifier.md` | ÐšÐ»Ð°ÑÑÐ¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ñ Ð»Ð¸Ð´Ð¾Ð², Ð·Ð°ÑÐ²Ð¾Ðº, ÐºÐ»ÐµÐ¹Ð¼Ð¾Ð², proposals â†’ JSON Ñ routing |

**Workflow Design & Build:**
1. ÐŸÐ¸ÑˆÐµÐ¼ ÐºÐ¾Ð´
2. Ð—Ð°Ð¿ÑƒÑÐºÐ°ÐµÐ¼ `code-reviewer` + `qa` Ð¿Ð°Ñ€Ð°Ð»Ð»ÐµÐ»ÑŒÐ½Ð¾
3. Ð§Ð¸Ñ‚Ð°ÐµÐ¼ Ð¾Ð±Ð° Ð¾Ñ‚Ñ‡Ñ‘Ñ‚Ð°, Ð¿Ñ€Ð¸Ð¼ÐµÐ½ÑÐµÐ¼ Ð¿Ñ€Ð°Ð²ÐºÐ¸
4. Ð”ÐµÐ¿Ð»Ð¾Ð¸Ð¼ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ ÐºÐ¾Ð³Ð´Ð° Ð¾Ð±Ð° Ð²ÐµÑ€Ð½ÑƒÐ»Ð¸ PASS

**Shared Utilities** (`execution/`) â€” common infrastructure scripts used across multiple skills.

**Why this works:** 90% accuracy per step = 59% success over 5 steps. Push repetitive work into deterministic scripts. Claude focuses on decision-making.

---

## Setup Protocol

When starting a fresh project with this file, create the full structure:

```
project/
  AGENTS.md              â† this file (for Cursor/Windsurf)
  GEMINI.md              â† identical copy (for Gemini)
  .claude/
    CLAUDE.md            â† identical copy (for Claude Code)
    settings.local.json  â† permissions + MCP servers
    skills/              â† SOPs (empty at start)
    agents/              â† sub-agent definitions (empty at start)
  execution/             â† shared utility scripts
  .tmp/                  â† intermediate files (never commit)
  .env                   â† API keys (never commit)
  .gitignore             â† must include: .env, .tmp/, credentials.json, token.json
```

### Identical instruction files

All three files (`.claude/CLAUDE.md`, `AGENTS.md`, `GEMINI.md`) contain the **exact same content**. They are not pointers â€” they are full copies. When you update one, update all three.

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
description: [One sentence â€” what does this skill do]
allowed-tools: [Read, Write, WebSearch, WebFetch, Bash, etc.]
---

# [Skill Name]

## Goal
[What is the end result? Be specific.]

## Input
[What does the user provide to start this skill?]

## Steps
1. [First step â€” concrete action]
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

Scripts should be deterministic â€” no LLM calls inside scripts unless absolutely necessary. The skill calls pre-written, tested scripts. LLM decides which script to run and with what parameters.

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
[One sentence â€” what does this agent do]

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
3. **Update SKILL.md** â€” add what you learned to the Learnings section
4. **System is now stronger** â€” the same error won't happen again

### Auto-update instructions
When you encounter a recurring mistake (2-3 times):
- Propose adding a rule to the instruction files so future sessions one-shot it
- Format: concise, actionable (1-2 lines max)
- Always ask the user before modifying instruction files

---

## Available Skills

> This section is auto-updated as skills are created. Keep it current.

| Skill | ÐŸÐ°Ð¿ÐºÐ° | ÐžÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ |
|-------|-------|---------|
| **Script Writer** | `.claude/skills/script-writer/` | Ð¡Ð¾Ð·Ð´Ð°Ñ‘Ñ‚ Ð²Ð¸Ñ€ÑƒÑÐ½Ñ‹Ð¹ ÑÑ†ÐµÐ½Ð°Ñ€Ð¸Ð¹ Ð²Ð¸Ð´ÐµÐ¾ Ð² 6 Ñ€Ð¾Ð»ÑÑ… Ð¾Ð´Ð½Ð¾Ð²Ñ€ÐµÐ¼ÐµÐ½Ð½Ð¾ (Ð˜ÑÑÐ»ÐµÐ´Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒ, ÐÐ½Ð°Ð»Ð¸Ñ‚Ð¸Ðº, Ð¡Ñ‚Ð¸Ð»Ð¸ÑÑ‚, Ð¡Ñ†ÐµÐ½Ð°Ñ€Ð¸ÑÑ‚, ÐÐ°ÑÑ‚Ð°Ð²Ð½Ð¸Ðº, ÐÐ´Ð°Ð¿Ñ‚ÐµÑ€). Ð—Ð°Ð¿ÑƒÑÐºÐ°Ñ‚ÑŒ ÐºÐ¾Ð¼Ð°Ð½Ð´Ð¾Ð¹: Â«Ð½Ð°Ð¿Ð¸ÑˆÐ¸ ÑÑ†ÐµÐ½Ð°Ñ€Ð¸Ð¹Â» |
| **Content Factory** | `.claude/skills/content-factory/` | Ð˜Ð· Ð¾Ð´Ð½Ð¾Ð³Ð¾ ÑÑ†ÐµÐ½Ð°Ñ€Ð¸Ñ Ð²Ð¸Ð´ÐµÐ¾ â†’ 21 ÐµÐ´Ð¸Ð½Ð¸Ñ†Ð° ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ð° (ÑÑ‚Ð°Ñ‚ÑŒÑ + 10 Ñ‚Ñ€ÐµÐ´ÑÐ¾Ð² + 5 Ñ€Ð¸Ð»ÑÐ¾Ð² + 5 Ð¿Ð¾ÑÑ‚Ð¾Ð²). Ð—Ð°Ð¿ÑƒÑÐºÐ°Ñ‚ÑŒ ÐºÐ¾Ð¼Ð°Ð½Ð´Ð¾Ð¹: Â«Ð·Ð°Ð¿ÑƒÑÑ‚Ð¸ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚-Ð·Ð°Ð²Ð¾Ð´Â» |
| **LightRAG** | `.claude/skills/lightrag/` | Ð‘Ð°Ð·Ð° Ð·Ð½Ð°Ð½Ð¸Ð¹ GCSC â€” Ð¸Ð½Ð´ÐµÐºÑÐ¸Ñ€ÑƒÐµÑ‚ Ð²ÑÐµ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ñ‹ Ð¸ ÐºÐ¾Ð½Ñ‚Ñ€Ð°ÐºÑ‚Ñ‹, Ð¾Ñ‚Ð²ÐµÑ‡Ð°ÐµÑ‚ Ð½Ð° Ð²Ð¾Ð¿Ñ€Ð¾ÑÑ‹ Ñ‡ÐµÑ€ÐµÐ· Ð³Ñ€Ð°Ñ„ Ð·Ð½Ð°Ð½Ð¸Ð¹ + Ð²ÐµÐºÑ‚Ð¾Ñ€Ð½Ñ‹Ð¹ Ð¿Ð¾Ð¸ÑÐº. Ð”Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð°Ñ†Ð¸Ñ: `docs/lightrag.md` |

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
3. **Brief the user** â€” ask questions to fill in the Project Context section above:
   - "Tell me about yourself and your business â€” what do you do, who are your customers?"
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
4. If the user names a specific skill â€” load its SKILL.md and execute
5. If the user wants a new workflow â€” create a skill using the template above

When the user sends a specific task â€” skip the menu, execute directly.

---

## Operating Principles

**1. Check before building.** Before writing a script, check `.claude/skills/` and `execution/`. Only create new code if nothing exists.

**2. Plan before building.** For non-trivial tasks: plan first (read-only, zero risk), then implement.

**3. One skill = one task.** Keep skills short and focused. 50-100 lines max. If a skill does two things â€” split it.

**4. Skills auto-activate.** Claude picks the right skill based on the user's request. Each skill's description in frontmatter tells Claude when to use it.

**5. Scripts are bundled.** Each skill runs its own scripts:
```bash
python3 .claude/skills/<name>/scripts/<script>.py
```

**6. Scrap & redo after 2-3 failed attempts.** Stop patching â€” revert to clean state, implement the best solution in one clean pass.

**7. Local files are for processing only.** Deliverables go to cloud services (Notion, Google Sheets, etc.). Everything in `.tmp/` can be deleted and regenerated.

---

## File Organization

| Directory | Purpose |
|-----------|---------|
| `.claude/CLAUDE.md` | Project instructions for Claude Code (identical to AGENTS.md) |
| `.claude/settings.local.json` | Permissions and MCP server configuration |
| `.claude/skills/<name>/` | SOPs â€” bundled skills (SKILL.md + scripts/) |
| `.claude/agents/` | Sub-agent definitions (created as needed) |
| `AGENTS.md` | Project instructions for Cursor/Windsurf (identical to CLAUDE.md) |
| `GEMINI.md` | Project instructions for Gemini (identical to CLAUDE.md) |
| `execution/` | Shared utility scripts |
| `.tmp/` | Intermediate files â€” never commit, always regenerated |
| `.env` | Environment variables and API keys â€” never commit |

