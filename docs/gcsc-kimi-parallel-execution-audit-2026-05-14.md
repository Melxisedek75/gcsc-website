# GCSC / SmartContractor Parallel Execution Audit For Kimi

Date: 2026-05-14 PT

Status: founder-requested acceleration audit and delegation plan.

Purpose: replace slow one-by-one micro-work with a clear parallel work map that Kimi or another multi-agent system can execute quickly while Codex and Claude keep architecture, safety, review, and integration control.

This document is not legal advice, not deployment approval, not public launch approval, not approval for real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, live Supabase changes, external account changes, or secrets handling.

## Executive Summary

The project has strong internal architecture and validation coverage, but the public surface is behind the internal plan.

Main finding:

- Internal GCSC v1.2 architecture is now coherent: SmartContractor first, construction trust infrastructure, contract-backed working-capital readiness, AI as support only, modular smart contracts, legal/provider gates.
- Public `whitepaper.html` is still v1.0 and token/AI/DeFi-first. It contains language that must be replaced before public v1.2 use.
- SmartContractor MVP is much more advanced than a landing page: local backend, frontend, request IDs, Auth prep, admin/risk surfaces, payment/provider scaffolds, dispute flow, beta docs, mobile/PWA prep, and 285 local checks pass through `npm run check`.
- The remaining launch speed problem is not lack of tasks. It is too many small tasks being executed serially. The fix is to split work into independent packages with strict file ownership and machine-checkable acceptance tests.

Recommended execution model:

- Kimi handles 70-80%: routine file creation, copy migration, validator creation, static audits, QA matrices, docs expansion, endpoint inventory, frontend polish tickets, test harnesses, non-secret handoff packets.
- Codex handles 15-20%: integration, repo state, final check runs, scoped commits, conflict resolution, backend/smart-contract architecture decisions, validator design.
- Claude handles 5-10%: deep code review, security review, public wording risk review, cross-document consistency review.

## Current Verified State

Fresh local verification:

- `npm run check:auth` passed.
- `npm run check:real-status-audit` passed.
- `git diff --check` passed with line-ending warnings only.
- `npm run check` passed from `C:\gcsc\construction-ai`; runner executed 285 checks.
- Latest pushed commit: `7a4a265 Add homeowner request id coverage`.

Repository inventory observed:

- `docs/`: 346 Markdown files, 13 PDF files, 5 SQL files, 4 DOCX files, 1 HTML file, plus support artifacts.
- `construction-ai/` excluding dependency/build folders: 331 `.mjs` files, 8 `.js` files, 6 `.html` files, Android/PWA assets, validators, local smart-contract helper modules.
- Check scripts: 286 `check*` npm scripts including the umbrella `check`; the full runner currently executes 285 validation checks.
- Public whitepaper source: `whitepaper.html`.
- Existing public PDF: `whitepaper-v1.1.pdf`.

## Whitepaper Audit

### Internal v1.2 Sources Are Strong

These are the current internal source-of-truth files Kimi must read before touching public whitepaper or website text:

- `docs/gcsc-v1-2-core-architecture-package.md`
- `docs/whitepaper-v1-2-public-wording-package.md`
- `docs/whitepaper-v1-2-source-map.md`
- `docs/whitepaper-v1-2-restructure-draft.md`
- `docs/whitepaper-v1-2-section-replacement-preview.md`
- `docs/whitepaper-v1-2-public-website-update-packet.md`
- `docs/whitepaper-v1-2-claim-review-matrix.md`
- `docs/whitepaper-v1-2-public-edit-queue.md`
- `docs/whitepaper-v1-2-publish-gate.md`
- `docs/whitepaper-v1-2-legal-provider-review-prep.md`
- `docs/gcsc-contract-backed-loan-blueprint.md`
- `docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md`
- `docs/whitepaper-v1-2-smart-contract-module-split-anti-backdoor-review.md`

Core approved direction:

- Lead with SmartContractor as practical construction trust infrastructure.
- Explain jobs, bids, accepted project contracts, milestones, evidence, disputes, reputation, and admin/risk review before token economics.
- Use contract-backed working-capital readiness, not live lending.
- Use escrow-ready and settlement-ready language, not live escrow or live settlement.
- Keep AI recommendation-only.
- Keep GCSC/GCST as planned utility/settlement roadmap components without price, yield, liquidity, legal-status, or regulatory approval promises.
- Keep public use blocked until founder/legal/provider/technical/security/publication gates are recorded.

### Public `whitepaper.html` Is Outdated

The public file still presents v1.0. Examples of content that must be revised or heavily qualified before public v1.2:

- Token/DAO-first positioning before product workflow.
- "code-enforced guarantees" language.
- AI agents operating "without human intervention".
- "Instant via RAA AI Agent" lending decision language.
- Up to `$50,000` contractor loan wording without enough provider/legal boundary.
- "funds are released" and milestone repayments in ways that can read as live finance.
- GCST backing and stablecoin language without current approval boundary.
- APY/staking/yield and fee distribution language that needs legal/token review.
- "GCSC tokens are registered as Utility Tokens in compliance with SEC guidelines."
- smart contracts insured through named protocols without verified current evidence.
- "tokenomics model ensures sustainable growth without speculative bubbles."
- public `Trade GCSC on SimpleDEX` call-to-action should be reviewed before launch context.

Conclusion: Kimi should not patch small sentences in `whitepaper.html`. The better path is a full v1.2 replacement draft from approved internal sources, then final review by Codex/Claude/founder/legal.

## Main Workstreams

### Stream A: Public Whitepaper v1.2

Goal: create a public-ready v1.2 draft package while keeping publication blocked until review gates pass.

File ownership:

- Create `docs/whitepaper-v1-2-public-draft.md`.
- Create `docs/whitepaper-v1-2-public-draft-review-report.md`.
- Create `construction-ai/scripts/validate-whitepaper-v1-2-public-draft.mjs`.
- Modify `construction-ai/package.json` only to add `check:whitepaper-v1-2-public-draft`.
- Do not modify `whitepaper.html` in this first package.

Kimi tasks:

1. Build full public draft from the v1.2 source map.
2. Use this section order:
   - Executive Summary.
   - Construction Trust Problem.
   - SmartContractor Marketplace.
   - Project Contracts And Milestones.
   - Evidence, Disputes, And Contractor Reputation.
   - AI-Assisted Workflows And AI Boundaries.
   - Contract-Backed Working-Capital Readiness.
   - Escrow-Ready And Settlement-Ready Roadmap.
   - Smart Contract Module Roadmap.
   - GCSC/GCST Utility And DAO Roadmap.
   - Legal, Provider, Custody, AML, Escrow, Lending, Stablecoin, Token, And AI Boundaries.
   - Roadmap And Launch Gates.
3. Include blocked-claims section in plain language.
4. Add source references at the bottom mapping each section back to internal docs.
5. Add a validator that rejects unsafe phrases unless they appear in a blocked-claims context.
6. Run:
   - `npm run check:whitepaper-v1-2-public-draft`
   - `npm run check:whitepaper-v1-2-public-wording-package`
   - `npm run check:whitepaper-v1-2-claim-review`
   - `npm run check:whitepaper-v1-2-publish-gate`
   - `npm run check`

Acceptance:

- Draft is readable as a real whitepaper, not a checklist.
- No claim says or implies live lending, live escrow, live stablecoin settlement, live token collateral, automatic AI approval, guaranteed yield, token price appreciation, or regulatory approval.
- Validator fails if unsafe phrases are introduced outside approved blocked-claim lists.

### Stream B: HTML Whitepaper Replacement

Goal: turn the approved public draft into a new `whitepaper.html` structure after Stream A review.

File ownership:

- Modify `whitepaper.html`.
- Optionally modify `css/whitepaper.css` if the existing layout breaks.
- Create `docs/whitepaper-v1-2-html-migration-report.md`.
- Create `construction-ai/scripts/validate-whitepaper-html-v1-2.mjs`.

Kimi tasks:

1. Update title, meta description, visible version, and table of contents from v1.0 to v1.2.
2. Replace token-first sections with product-first sections.
3. Move tokenomics after product/trust/compliance.
4. Add visible risk and launch-gate section.
5. Remove or qualify outdated public claims from the audit list above.
6. Preserve website styling and navigation.

Acceptance:

- `whitepaper.html` has no mojibake in visible text.
- All TOC links resolve.
- Unsafe v1.0 claims are removed or moved into review-boundary language.
- Run:
  - `npm run check:whitepaper-html-v1-2`
  - `npm run check:whitepaper-v1-2-public-draft`
  - `npm run check`

### Stream C: Public Website Copy Alignment

Goal: align homepage and public website copy with v1.2 without enabling public launch.

File ownership:

- Audit and modify only existing public website files after inventory.
- Likely files: `index.html`, `css/style.css`, `whitepaper.html`.
- Create `docs/website-v1-2-copy-alignment-report.md`.
- Create `construction-ai/scripts/validate-website-v1-2-copy.mjs`.

Kimi tasks:

1. Inventory public pages and sections.
2. Replace token-first hero/CTA copy with SmartContractor construction trust infrastructure language.
3. Add no-real-money public beta boundaries.
4. Make token section roadmap/utility focused.
5. Add FAQ copy for no live lender, no live escrow, no automatic AI approval, no guaranteed token/yield.

Acceptance:

- Website copy does not contradict the v1.2 public draft.
- No external account, DNS, or deployment action is attempted.
- Run `npm run check:website-v1-2-copy` and `npm run check`.

### Stream D: Whitepaper PDF / DOCX Publication Pipeline

Goal: create a repeatable offline build path for v1.2 PDF and optional DOCX review artifacts.

File ownership:

- Create `docs/whitepaper-v1-2-publication-artifact-plan.md`.
- Create `docs/whitepaper-v1-2-pdf-export-checklist.md`.
- Optionally create `execution/build-whitepaper-v1-2-pdf.ps1` if it uses only local tooling.

Kimi tasks:

1. Define source-of-truth input file.
2. Define exact output artifact names.
3. Define metadata/versioning rules.
4. Define redaction and rollback rules.
5. Define visual QA checklist for PDF.

Acceptance:

- No public PDF is presented as approved.
- Export steps are reproducible and local.
- Existing `whitepaper-v1.1.pdf` is not overwritten without approval.

### Stream E: Backend API Modularization

Goal: reduce `construction-ai/server.js` risk without changing behavior.

File ownership:

- Create `construction-ai/src/server/appFactory.mjs`.
- Create route modules under `construction-ai/src/server/routes/`.
- Create validation modules under `construction-ai/src/server/validation/`.
- Create `docs/smartcontractor-backend-modularization-plan.md`.
- Modify `server.js` only as an entrypoint after tests exist.

Kimi tasks:

1. Inventory all endpoints in `server.js`.
2. Generate route map: method, path, auth mode, database tables, request_id behavior, live-risk boundary.
3. Write static endpoint-map validator first.
4. Move one low-risk route group at a time: health/readiness first, then public providers, then SmartContractor core, then admin.
5. Preserve request IDs, security headers, validation behavior, and existing check output.

Acceptance:

- No endpoint behavior changes unless explicitly tested.
- `npm run check:auth` and `npm run check` pass after each route group.

### Stream F: API Contract / OpenAPI Inventory

Goal: give frontend, QA, Kimi agents, and future providers a single API contract.

File ownership:

- Create `docs/smartcontractor-openapi-inventory.md`.
- Create `docs/smartcontractor-api-contract-v1.yaml`.
- Create `construction-ai/scripts/validate-openapi-inventory.mjs`.

Kimi tasks:

1. Extract all Express routes from `server.js`.
2. Document request body, response body, status codes, request_id behavior, auth mode, and live-risk boundary.
3. Mark demo-only endpoints clearly.
4. Add validator checking that every route has an inventory row.

Acceptance:

- Every `/api/*` route is documented.
- Any missing route fails the validator.
- No secrets or live URLs are included.

### Stream G: Frontend QA And UX Polish

Goal: make the clickable MVP smoother for founder demos and public beta without changing architecture.

File ownership:

- `construction-ai/public/smartcontractor.html`
- `construction-ai/public/*.css`
- Create `docs/smartcontractor-frontend-qa-report.md`.
- Create or extend `construction-ai/scripts/validate-smartcontractor.mjs`.

Kimi tasks:

1. Audit mobile widths: 360, 390, 768, 1024, desktop.
2. Check all demo flows: Owner -> Contractor -> Loan -> Dispute -> Admin.
3. Verify warnings are visible without scrolling too far.
4. Check empty/loading/error states.
5. Ensure all forms show request_id on success/failure where supported.

Acceptance:

- Screens fit without broken text overlap.
- Demo-only warnings remain visible.
- `npm run check:smartcontractor`, `npm run check:pwa-qa`, and `npm run check` pass.

### Stream H: Auth / RLS / Founder Admin Activation Prep

Goal: prepare everything around founder Auth without touching live Supabase.

File ownership:

- Create `docs/smartcontractor-founder-auth-admin-kimi-audit.md`.
- Create `docs/smartcontractor-rls-policy-test-matrix.md`.
- Create `construction-ai/scripts/validate-rls-policy-test-matrix.mjs`.

Kimi tasks:

1. Compare Auth docs, RLS drafts, admin role model, and founder activation prep.
2. Build one matrix of tables, policies, allowed roles, denied roles, backend-only tables, required smoke tests.
3. Identify gaps before strict RLS live apply.
4. Write a local-only validator for the matrix.

Acceptance:

- No live SQL apply.
- No service-role key request.
- Founder actions remain clearly separated.

### Stream I: Deployment / Vercel / Public Beta Prep

Goal: make public beta deployment founder-ready without connecting accounts.

File ownership:

- Create `docs/smartcontractor-vercel-kimi-predeploy-audit.md`.
- Create `docs/smartcontractor-public-beta-one-week-launch-plan.md`.
- Extend validators only if needed.

Kimi tasks:

1. Audit deployment docs for contradictions.
2. Produce one founder checklist for Vercel import, root directory, env variable categories, Supabase redirect, rollback, post-deploy smoke.
3. Produce one beta-week runbook: day 0 preflight, day 1 invite, day 2 support, day 3 issue triage, day 7 closeout.
4. Keep public beta demo-only.

Acceptance:

- Founder can follow steps without exposing secrets.
- No external account action is performed by agents.

### Stream J: Smart Contract Module Implementation Prep

Goal: move from docs-only module split to local implementation packages and tests.

File ownership:

- `construction-ai/src/smart-contracts/`
- `construction-ai/scripts/validate-smart-contract-*.mjs`
- Create `docs/smartcontractor-smart-contract-kimi-build-map.md`.

Kimi tasks:

1. Map current local helper modules to the nine approved modules.
2. Identify which modules are docs-only versus code-backed.
3. Add missing local-only replay fixtures for anti-backdoor rules.
4. Add tests for:
   - hidden owner drain rejected;
   - hidden upgrade path rejected;
   - arbitrary balance mutation rejected;
   - contractor self-approval rejected;
   - AI-only final approval rejected;
   - dispute-to-release bypass rejected;
   - overpayment above outstanding balance rejected;
   - negative contractor payout rejected;
   - token collateral live enablement rejected;
   - live deployment remains `BLOCKED_FOR_LIVE`.

Acceptance:

- No live XPR deployment.
- No real token movement.
- `npm run check:smart-contract-state-helpers-local`, replay checks, and full `npm run check` pass.

### Stream K: Proton / XPR Contract Code Audit

Goal: audit existing proton-tsc contract folders without deploying anything.

File ownership:

- Read-only first pass over `gcsctoken111/`, `gcscbuild11/`, and `xprclaw/`.
- Create `docs/xpr-contract-code-audit-kimi-report.md`.
- Create `docs/xpr-contract-deployment-blockers-kimi-report.md`.

Kimi tasks:

1. Inventory contract files, accounts, actions, tables, permissions, and tests.
2. Compare against approved v1.2 module split.
3. Flag mismatches, unsafe authority, missing tests, hidden owner powers, token/treasury risks.
4. Do not compile/deploy unless local compile command is already documented and safe.

Acceptance:

- Findings ranked Critical/High/Medium/Low.
- PASS/FAIL verdict for local readiness only.
- Live deployment remains blocked.

### Stream L: AI Agent Implementation Scaffolds

Goal: turn AI-agent concept into safe local support tools, not autonomous money/legal decision makers.

File ownership:

- Create `docs/smartcontractor-ai-agent-implementation-map.md`.
- Create `construction-ai/src/ai-agents/` local simulator modules if missing.
- Create `construction-ai/scripts/validate-ai-agent-boundaries.mjs`.

Kimi tasks:

1. Define CMA, RAA, CA, TA, REA as recommendation-only modules.
2. Implement local pure-function prototypes or fixtures for scope summary, risk signal, compliance checklist, treasury queue, real estate note.
3. Add tests proving agents cannot return final approval for loans, escrow, repayments, disputes, legal outcomes, or token collateral.

Acceptance:

- No external AI/provider calls required.
- No LangChain/OpenAI dependency required unless already present and mocked.
- AI output states are `RECOMMENDATION`, `REVIEW_REQUIRED`, or `BLOCKED_FOR_LIVE`, never final approval.

### Stream M: Mobile / Android / iOS

Goal: finish local mobile readiness tasks that do not need Apple/Google accounts.

File ownership:

- `construction-ai/android/`
- `docs/smartcontractor-android-*`
- `docs/smartcontractor-ios-*`
- `docs/smartcontractor-mobile-*`

Kimi tasks:

1. Audit Android wrapper state.
2. Produce exact build blocker list: JDK, Android SDK, `JAVA_HOME`, `ANDROID_HOME`, emulator/device.
3. Add screenshot QA checklist tied to public beta demo paths.
4. Prepare store asset checklist without creating store listing.

Acceptance:

- No Play Console or Apple account action.
- No signing keys requested.
- `npm run check:android-preflight`, `npm run check:android-wrapper`, mobile checks, and full check pass.

### Stream N: Security / Secrets / Public Artifact Scan

Goal: prevent accidental secret or unsafe claim leakage before Kimi parallel work expands file count.

File ownership:

- Create `construction-ai/scripts/validate-public-artifact-safety.mjs`.
- Create `docs/public-artifact-safety-audit.md`.

Kimi tasks:

1. Scan docs, HTML, public assets, and env examples for secret-looking values.
2. Scan public artifacts for blocked claims.
3. Scan for mojibake in public files.
4. Add validator with allowlists for intentional blocked-claim lists.

Acceptance:

- Fails on obvious API keys, service-role keys, seed phrase language with values, private keys, raw database URLs with passwords, or unsafe live finance claims.
- Full check passes.

### Stream O: Investor / Grant / Partner Package Alignment

Goal: align outbound materials with v1.2 without public overclaims.

File ownership:

- `docs/smartcontractor-investor-founder-package.md`
- `docs/smartcontractor-founder-one-pager.md`
- Create `docs/gcsc-v1-2-investor-package-alignment-report.md`.

Kimi tasks:

1. Compare investor/founder materials against public wording package.
2. Remove or flag token/yield/legal/provider overclaims.
3. Add one conservative demo narrative.
4. Add evidence links to MVP checks and audit status.

Acceptance:

- Claims are conservative and evidence-backed.
- No public fundraising/security/legal claims are introduced.

## Parallel Agent Assignment Model

Use this model for Kimi:

| Agent group | Count | Work |
| --- | ---:| --- |
| Whitepaper writers | 10 | Draft sections independently from source map; one section per agent. |
| Whitepaper reviewers | 8 | Claim safety, readability, source trace, legal/provider boundary review. |
| Website/HTML agents | 8 | HTML migration, styling, link checks, copy alignment, FAQ. |
| Backend inventory agents | 10 | Endpoint map, request/response docs, route ownership, OpenAPI. |
| Backend refactor agents | 8 | Route modules and validation modules, one route group at a time. |
| QA/validator agents | 12 | Validators, check scripts, regression fixtures, smoke coverage. |
| Frontend QA agents | 8 | Mobile/desktop layout, flows, form states, request IDs. |
| Auth/RLS agents | 6 | Matrix, local policy tests, founder admin prep. |
| Deploy/beta agents | 6 | Vercel prep, beta week plan, support/known issue docs. |
| Smart contract local agents | 10 | Module mapping, state helpers, replay fixtures, anti-backdoor checks. |
| XPR/proton-tsc audit agents | 4 | Read-only contract audit and deployment blockers. |
| AI-agent scaffold agents | 4 | Recommendation-only local modules and boundary tests. |
| Mobile agents | 4 | Android/iOS readiness and QA checklists. |
| Security/public safety agents | 2 | Secret/claim/mojibake scanners. |

Total: 100 agents.

## File Conflict Rules For Kimi

1. Each agent gets an exclusive file set.
2. No two agents edit `construction-ai/package.json` at the same time. Instead, each agent proposes script additions in its report; one integrator applies them.
3. No two agents edit `server.js` at the same time. Backend refactor must use route-group branches or staged order.
4. Public `whitepaper.html` is locked until public draft review is complete.
5. Do not edit `AGENTS.md`, `CLAUDE.md`, or `GEMINI.md` unless founder explicitly approves instruction changes.
6. Do not touch `.env`, secrets, live Supabase, Vercel, Namecheap, payment providers, app stores, or wallets.
7. Every agent must produce:
   - files changed;
   - commands run;
   - pass/fail;
   - remaining risks;
   - whether any live/legal/money boundary was encountered.

## Kimi Worker Prompt Template

Use this prompt for each Kimi worker:

```text
You are working in C:\gcsc on GCSC / SmartContractor.

Language for reports: Russian.

Read first:
- AGENTS.md
- docs/gcsc-active-context.md
- docs/gcsc-kimi-parallel-execution-audit-2026-05-14.md
- the source files listed in your assigned work package

Safety:
- No secrets.
- No live Supabase changes.
- No external account changes.
- No real payments, loans, escrow, repayment routing, stablecoin settlement, token collateral.
- No legal conclusions.
- No public launch.
- Do not edit files outside your assigned file set.

Task:
[paste one Stream task here]

Output:
- Short summary.
- Files created/modified.
- Exact commands run and result.
- Findings or blockers.
- Suggested next integration step.
```

## What Codex Should Keep

Codex should not waste time doing hundreds of small content files serially. Codex should keep:

- final architecture decisions;
- validator patterns;
- integration of Kimi patches;
- conflict resolution;
- full `npm run check` runs;
- scoped commits/pushes;
- final public whitepaper review before founder/legal/provider handoff;
- backend/smart-contract authority/security decisions;
- stop-boundary enforcement.

## What Claude Should Review

Claude should review:

- public v1.2 whitepaper draft for overclaims and narrative quality;
- `whitepaper.html` diff before publication;
- backend refactor diff for regressions;
- smart contract module and authority model for backdoors;
- Auth/RLS plan for owner-access mistakes;
- deployment/public beta plan for unsafe public launch assumptions.

## One-Week Parallel Schedule

Day 1:

- Freeze source docs.
- Run Stream A, F, N, and J audits in parallel.
- Codex integrates public draft validator and safety scanner.

Day 2:

- Run Stream B, C, E endpoint inventory, G frontend QA, H Auth/RLS matrix.
- Claude reviews Stream A public draft.

Day 3:

- Apply whitepaper draft revisions.
- Start HTML migration.
- Start backend route extraction only after endpoint inventory is complete.
- Start smart contract anti-backdoor fixture additions.

Day 4:

- Finish website copy alignment.
- Finish OpenAPI inventory.
- Finish Auth/RLS test matrix.
- Finish AI-agent boundary scaffold.

Day 5:

- Full QA sweep: frontend, backend, validators, mobile, deployment docs.
- Kimi produces issue list only; Codex fixes integration conflicts.

Day 6:

- Claude performs security/public wording/code review.
- Codex applies fixes and runs full `npm run check`.

Day 7:

- Founder packet:
  - v1.2 public draft;
  - v1.2 HTML preview;
  - website copy diff;
  - beta deploy checklist;
  - legal/provider packet;
  - remaining blockers.

## Immediate Next Actions

1. Give Kimi this document.
2. Assign Stream A first. Public v1.2 draft is the highest-leverage task.
3. In parallel, assign Stream F and Stream N. They reduce integration risk.
4. Keep `whitepaper.html` locked until Stream A draft and validator are reviewed.
5. Use Codex/Claude as final reviewers and integrators, not as serial content factories.

## Current Stop Boundaries

Still blocked:

- live Supabase role assignment or RLS apply;
- Vercel/GitHub Pages/Namecheap settings;
- production environment secrets;
- real payment providers;
- real lending/provider commitments;
- real escrow/custody;
- real repayment routing;
- stablecoin settlement;
- token collateral;
- public launch;
- legal, tax, securities, escrow, lending, or provider conclusions.

Safe to parallelize:

- internal drafts;
- validators;
- static audits;
- local-only fixtures;
- non-secret checklists;
- frontend demo polish;
- local API inventory;
- local smart-contract replay helpers;
- public-copy drafts marked internal/review-only.
