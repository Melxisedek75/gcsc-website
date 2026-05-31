# GCSC Two-Week Autonomous Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move GCSC from the v1.3 strategy package into a disciplined two-week implementation track: public-safe whitepaper readiness, SmartContractor alignment, integration architecture, provider/legal review prep, and safe local validation.

**Architecture:** The next two weeks split work into safe local documentation, static validators, local HTML draft polish, SmartContractor product wording alignment, future provider/Web3 integration maps, and founder/legal/provider review gates. Codex may work autonomously on local files, validators, drafts, review packets, and scoped commits, but must stop before live/public/legal/provider/money/Web3 actions.

**Tech Stack:** Markdown docs, `construction-ai` Node.js validators, local HTML/CSS drafts, SmartContractor static/admin MVP surfaces, XPR Network/WebAuth/FIO/Metallicus research notes, future licensed escrow/lending/KYC/KYB/payment/insurance/appraisal partners.

---

## Source Of Truth

The autonomous engine is `docs/codex-nonstop-execution-hook.md`.

The current v1.3 continuation rule is `docs/whitepaper-v1-3-autonomous-continuation-rule.md`.

The primary v1.3 implementation plan is `docs/superpowers/plans/2026-05-31-whitepaper-v1-3-hybrid-web3-implementation.md`.

This two-week plan becomes the current priority plan for 2026-05-31 through 2026-06-13.

## Operating Rule

After every completed safe task, Codex must:

1. read `docs/gcsc-active-context.md`;
2. read `docs/codex-nonstop-execution-hook.md`;
3. read `docs/whitepaper-v1-3-autonomous-continuation-rule.md`;
4. read this plan;
5. run `git status --short`;
6. choose the next safe unblocked task from this plan;
7. implement one scoped local change;
8. run the relevant validator or search check;
9. commit and push only scoped files when Git/network allows;
10. continue to the next safe task without asking "what next".

## Absolute Stop Boundaries

Codex must stop before:

- replacing `whitepaper.html`;
- replacing `index.html`;
- publishing PDF/deck/social/email materials;
- contacting FIO, Metallicus, banks, lenders, escrow providers, insurers, appraisers, attorneys, or regulators;
- creating external accounts or logging into external accounts;
- using or requesting secrets, API keys, passwords, seed phrases, private keys, service-role keys, or live tokens;
- live Supabase changes;
- real payments, loans, escrow, stablecoin settlement, token collateral, wallet signatures, FIO registrations, minting, staking, bridging, swaps, or transfers;
- legal conclusions, securities conclusions, lending/escrow/money-transmission conclusions, tax conclusions, insurance conclusions, appraisal conclusions, or contractor-licensing conclusions;
- destructive Git/filesystem operations.

## Priority Order

1. Keep nonstop/autonomous controls active and validated.
2. Finish v1.3 whitepaper/public website readiness without publishing.
3. Improve local draft QA evidence and static asset safety.
4. Align SmartContractor product wording with Construction Trust Infrastructure.
5. Prepare legal/provider/founder review packets.
6. Prepare FIO Protocol and Metallicus/XPR/WebAuth integration maps as research-only architecture.
7. Prepare product placeholder plan for future licensed partners.
8. Maintain validators so unsafe claims cannot drift back.
9. Produce weekly and final two-week closeouts.

## Week 1: 2026-05-31 To 2026-06-06

| Date | Main Focus | Safe Autonomous Work | Stop Gate |
|---|---|---|---|
| 2026-05-31 | Plan + nonstop binding | Create this plan, validate heartbeat binding, keep v1.3 queue explicit | Do not change live/public files |
| 2026-06-01 | v1.3 evidence package | Strengthen publication evidence, local browser review notes, screenshot checklist, and draft smoke checks | Do not claim visual QA complete without screenshots |
| 2026-06-02 | Draft website polish | Improve `whitepaper-v1-3-draft.html`, `whitepaper-v1-3-draft.css`, and `index-v1-3-draft.html` only as local drafts | Do not replace `whitepaper.html` or `index.html` |
| 2026-06-03 | SmartContractor wording alignment | Scan product/admin/beta wording for token-first or live-finance claims; prepare safe replacement plan | Do not alter live Supabase or real user flows |
| 2026-06-04 | Legal/provider review prep | Consolidate review questions for escrow, lending, KYC/KYB, insurance, appraisals, FIO, XPR/WebAuth/Metal/Metallicus | Do not contact providers |
| 2026-06-05 | Future integration architecture | Create local architecture maps for Web2 licensed partners first, Web3 regulated partners second | Do not claim partnership or approval |
| 2026-06-06 | Week-one closeout | Run targeted validators, document completed/blocked items, commit/push scoped files | Stop if only founder/legal/provider/live actions remain |

## Week 2: 2026-06-07 To 2026-06-13

| Date | Main Focus | Safe Autonomous Work | Stop Gate |
|---|---|---|---|
| 2026-06-07 | SmartContractor product integration map | Map v1.3 concepts into product modules: projects, milestones, evidence, disputes, reputation, working-capital readiness | Do not enable real finance |
| 2026-06-08 | FIO Protocol research architecture | Draft FIO naming/payment-request UX as optional future Web3 identity/UX layer | Do not register FIO names |
| 2026-06-09 | Metallicus/XPR/WebAuth research architecture | Draft XPR/WebAuth/Metal/Metallicus pathway as future regulated infrastructure candidate | Do not claim partnership or connect wallets |
| 2026-06-10 | Claim-risk hardening | Expand validators and checklists for banned claims: investment, yield, staking return, live escrow, instant loans, partnership claims | Do not publish |
| 2026-06-11 | Founder review packet closeout | Prepare a concise founder packet: approve review, hold, revise, or publish later | Founder decision required before GO |
| 2026-06-12 | Publication readiness dry run | Verify archive/rollback/publication evidence templates without replacing public files | Do not execute replacement |
| 2026-06-13 | Two-week closeout | Produce done/tested/blocked/next-plan summary and prepare next two-week plan | Founder chooses live/external priorities |

## Task 1: Bind This Plan To The Nonstop Hook

**Files:**
- Modify: `docs/codex-nonstop-execution-hook.md`
- Modify: `docs/whitepaper-v1-3-autonomous-continuation-rule.md`
- Modify: `construction-ai/scripts/validate-automation-health.mjs`

- [ ] **Step 1: Add this plan to the nonstop hook**

Add this exact path to the current v1.3 attachment:

```text
docs/superpowers/plans/2026-05-31-gcsc-two-week-autonomous-implementation.md
```

- [ ] **Step 2: Add this plan to the v1.3 continuation rule**

The v1.3 rule must say that Codex reads this two-week plan before choosing the next safe v1.3 task.

- [ ] **Step 3: Validate automation binding**

Run:

```powershell
npm run check:automation-health
```

Expected: PASS and `whitepaper_v1_3_heartbeat_binding_checked: true`.

- [ ] **Step 4: Commit scoped files**

Run:

```powershell
git add -- docs/codex-nonstop-execution-hook.md docs/whitepaper-v1-3-autonomous-continuation-rule.md construction-ai/scripts/validate-automation-health.mjs docs/superpowers/plans/2026-05-31-gcsc-two-week-autonomous-implementation.md
git commit -m "Add GCSC two-week autonomous implementation plan"
git push
```

Expected: commit and push succeed.

## Task 2: Keep V1.3 Drafts Public-Safe But Not Published

**Files:**
- Review: `whitepaper-v1-3-draft.html`
- Review: `whitepaper-v1-3-draft.css`
- Review: `index-v1-3-draft.html`
- Modify: `construction-ai/scripts/validate-whitepaper-v1-3-draft-html-smoke.mjs`
- Modify: `docs/whitepaper-v1-3-local-browser-review-notes.md`

- [ ] **Step 1: Check local draft asset dependencies**

Run:

```powershell
rg -n "css/style\\.css|css/whitepaper\\.css|assets/gcsc-logo\\.png" whitepaper-v1-3-draft.html index-v1-3-draft.html
```

Expected: no matches in v1.3 draft files.

- [ ] **Step 2: Check for mojibake**

Run:

```powershell
rg -n "â|Ã|�" whitepaper-v1-3-draft.html index-v1-3-draft.html whitepaper-v1-3-draft.css
```

Expected: no matches.

- [ ] **Step 3: Run draft smoke check**

Run:

```powershell
npm run check:whitepaper-v1-3-draft-html-smoke
```

Expected: PASS.

- [ ] **Step 4: Record screenshot limitation honestly**

If no local browser executable is available, keep screenshot status PENDING in `docs/whitepaper-v1-3-local-browser-review-notes.md`.

## Task 3: SmartContractor Wording Alignment

**Files:**
- Review: `construction-ai/public/smartcontractor.html`
- Review: `docs/smartcontractor-backlog.md`
- Create or modify: `docs/whitepaper-v1-3-smartcontractor-wording-alignment.md`
- Create or modify: `construction-ai/scripts/validate-whitepaper-v1-3-smartcontractor-wording.mjs`
- Modify: `construction-ai/package.json`

- [ ] **Step 1: Scan for risky wording**

Run:

```powershell
rg -n "investment|staking|yield|passive income|instant loan|smart escrow|NFT|token collateral|all on blockchain|reputation as collateral" construction-ai/public docs -g "*.html" -g "*.md"
```

Expected: matches are classified as legacy, risk-register, or blocked wording.

- [ ] **Step 2: Create wording alignment doc**

Create `docs/whitepaper-v1-3-smartcontractor-wording-alignment.md` with safe replacements:

```markdown
# GCSC Whitepaper v1.3 SmartContractor Wording Alignment

Status: internal wording alignment. This does not publish public changes.

## Safe Product Position

SmartContractor should speak as construction workflow software: project records, milestones, evidence, dispute packets, reputation, and partner-reviewed working-capital readiness.

## Blocked Product Claims

- investment product;
- yield or passive income;
- instant loan approval;
- live escrow custody by GCSC;
- automatic on-chain payment release;
- public NFT marketplace;
- token collateral as live;
- approved Metallicus/FIO/XPR partnership.

## Safe Replacements

| Risky wording | Safe wording |
|---|---|
| smart escrow | escrow-ready milestone records |
| instant loan | partner-reviewed working-capital readiness |
| NFT | future verified digital construction record |
| staking/yield | not used in product-facing copy |
| reputation as collateral | reputation as underwriting context |
```

- [ ] **Step 3: Add validator**

Create a validator that checks the alignment doc exists and that public-facing SmartContractor wording does not introduce blocked standalone claims.

- [ ] **Step 4: Run targeted checks**

Run:

```powershell
npm run check:smartcontractor
npm run check:whitepaper-v1-3-smartcontractor-wording
```

Expected: PASS.

## Task 4: Provider And Legal Review Prep

**Files:**
- Modify: `docs/whitepaper-v1-3-legal-provider-review-packet.md`
- Modify: `docs/whitepaper-v1-3-provider-shortlist.md`
- Create: `docs/whitepaper-v1-3-provider-question-register.md`

- [ ] **Step 1: Create provider question register**

Create questions grouped by:

- escrow custody;
- lending/working capital;
- KYC/KYB/AML;
- payment processing/stablecoin settlement;
- insurance/bonding;
- appraisal/valuation;
- FIO Protocol;
- XPR/WebAuth/Metal/Metallicus;
- data privacy and audit logs.

- [ ] **Step 2: Mark every provider item research-only**

Every provider entry must explicitly say:

```text
Research-only. No partnership, endorsement, integration, account setup, or provider approval is claimed.
```

- [ ] **Step 3: Run v1.3 validators**

Run:

```powershell
npm run check:whitepaper-v1-3-plan
```

Expected: PASS.

## Task 5: Future Web3 Integration Architecture

**Files:**
- Modify: `docs/whitepaper-v1-3-fio-protocol-integration-brief.md`
- Modify: `docs/whitepaper-v1-3-metallicus-xpr-integration-brief.md`
- Create: `docs/whitepaper-v1-3-regulated-web3-architecture-map.md`

- [ ] **Step 1: Create architecture map**

The map must split:

- current no-real-money construction workflow;
- licensed partner services;
- future regulated Web3 identity/records/payment rails;
- blocked live actions.

- [ ] **Step 2: Add FIO Protocol as optional UX layer**

Describe FIO only as future research for human-readable handles, payment-request UX, and identity-routing UX.

- [ ] **Step 3: Add XPR/WebAuth/Metal/Metallicus as candidate infrastructure**

Describe only as candidate future infrastructure. Do not claim partnership, approval, or live integration.

## Task 6: Publication Readiness Without Publication

**Files:**
- Modify: `docs/whitepaper-v1-3-publication-evidence-template.md`
- Modify: `docs/whitepaper-v1-3-final-publication-checklist.md`
- Modify: `docs/whitepaper-v1-3-publication-gate.md`
- Modify: `docs/whitepaper-v1-3-archive-execution-checklist.md`

- [ ] **Step 1: Keep gate NO-GO**

Verify:

```powershell
rg -n "NO-GO|Default state: NO-GO|Recommended current decision: \\*\\*NO-GO" docs/whitepaper-v1-3-*.md
```

Expected: all publication docs still show NO-GO until founder approval and review evidence are recorded.

- [ ] **Step 2: Confirm public files were not replaced**

Run:

```powershell
git diff -- whitepaper.html index.html
```

Expected: no autonomous v1.3 replacement diff unless founder has explicitly approved publication.

## Task 7: Weekly Closeouts

**Files:**
- Create: `docs/whitepaper-v1-3-week-one-closeout-2026-06-06.md`
- Create: `docs/whitepaper-v1-3-two-week-closeout-2026-06-13.md`

- [ ] **Step 1: Week-one closeout**

Record:

- completed safe tasks;
- validators run;
- commits pushed;
- public/live/legal/provider/money/Web3 blockers;
- next safe task.

- [ ] **Step 2: Two-week closeout**

Record:

- what is ready for founder review;
- what remains NO-GO;
- what requires attorney/provider review;
- what can continue autonomously next.

## Validation Commands

Run these after scoped changes:

```powershell
cd C:\gcsc\construction-ai
npm run check:automation-health
npm run check:nonstop-hook
npm run check:whitepaper-v1-3-plan
npm run check:whitepaper-v1-3-public-html-plan
npm run check:whitepaper-v1-3-draft-html-smoke
```

Do not run full `npm run check` unless the scoped change justifies the longer suite.

## Current Founder-Only Decisions

Founder/legal/provider approval is required before:

- public v1.3 publication;
- replacing current public site files;
- contacting providers;
- legal claims;
- live Supabase changes;
- real lending/escrow/payment/token/Web3 actions;
- FIO registration;
- wallet signatures;
- Metallicus/XPR partnership claims.
