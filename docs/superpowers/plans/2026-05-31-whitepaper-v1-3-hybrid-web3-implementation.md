# Whitepaper v1.3 Hybrid Web3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the new GCSC v1.3 strategy into a controlled implementation path: Construction Trust Infrastructure first, regulated Web3 construction infrastructure later.

**Architecture:** The work is split into safe local documentation, validators, public wording, website updates, product alignment, provider research, and future regulated Web3 integration gates. Codex may continue autonomously through local files, validators, demos, and scoped commits, but must stop for secrets, external accounts, live Supabase, real payments, real loans, real escrow, token collateral, legal conclusions, provider commitments, app-store actions, or destructive operations.

**Tech Stack:** Markdown docs, `construction-ai` Node.js validators, SmartContractor HTML/Express MVP, XPR Network, WebAuth, Metal/Metallicus ecosystem, FIO Protocol, future licensed escrow/lending/KYB/KYC/payment/insurance/valuation partners.

---

## Operating Rule For This Plan

Codex must execute this plan in priority order without asking "what next" after safe tasks. After each safe local task:

1. read `docs/gcsc-active-context.md`;
2. read `docs/codex-nonstop-execution-hook.md`;
3. check `git status --short`;
4. complete one scoped task from this plan;
5. run the relevant validator or search check;
6. update docs/context/backlog if status changed;
7. make a scoped commit and push when Git/network allows;
8. continue to the next safe unblocked task.

Stop only when the next step needs founder/legal/provider/live/external approval.

## Stop Gates

Codex must not autonomously:

- publish or replace `whitepaper.html` as the live public whitepaper;
- delete old whitepaper files;
- contact FIO, Metallicus, Escrow.com, lenders, banks, insurers, lawyers, appraisers, or providers;
- create external accounts or log into external accounts;
- buy, register, mint, stake, bridge, swap, transfer, escrow, or lend anything;
- make legal conclusions about securities, lending, escrow, money transmission, tax, insurance, appraisal, or contractor licensing;
- apply live Supabase changes;
- add secrets or ask the founder to paste secrets into chat;
- activate real payments, real loans, real escrow, stablecoin settlement, token collateral, or public investment claims.

## File Structure

Primary files already created:

- `docs/whitepaper-v1-3-hybrid-regulated-web3-draft.md` - new internal v1.3 strategy draft.
- `docs/gcsc-active-context.md` - session memory; already points to the v1.3 draft.

Files to create:

- `docs/whitepaper-v1-3-founder-review-packet.md` - short founder-facing explanation of the new direction.
- `docs/whitepaper-v1-3-public-outline.md` - public-safe whitepaper structure.
- `docs/whitepaper-v1-3-integration-roadmap.md` - integration roadmap for Web2/fintech partners and future Web3 rails.
- `docs/whitepaper-v1-3-claim-risk-register.md` - risky phrases, safe replacements, and approval gates.
- `docs/whitepaper-v1-3-provider-shortlist.md` - provider candidates by category with "research only" status.
- `docs/whitepaper-v1-3-fio-protocol-integration-brief.md` - FIO Protocol integration plan.
- `docs/whitepaper-v1-3-metallicus-xpr-integration-brief.md` - Metallicus/XPR/Metal/WebAuth integration plan.
- `docs/whitepaper-v1-3-public-website-update-plan.md` - safe website wording change plan.
- `docs/whitepaper-v1-3-public-draft.md` - future public-safe draft, not published.
- `docs/whitepaper-v1-3-publication-gate.md` - go/no-go checklist before replacing `whitepaper.html`.

Files to modify later:

- `docs/gcsc-active-context.md` - add each completed v1.3 artifact.
- `docs/smartcontractor-backlog.md` - add v1.3 implementation items and statuses.
- `construction-ai/package.json` - add validators only after validator scripts exist.
- `construction-ai/scripts/validate-whitepaper-v1-3-*.mjs` - validators for v1.3 docs.
- `whitepaper.html` - only after founder/publication approval.
- `index.html` - only after public-safe wording is approved.

## Priority Map

### Critical

1. Preserve and commit the v1.3 internal draft.
2. Create founder review packet.
3. Create claim risk register.
4. Create public outline.
5. Create integration roadmap.
6. Add validators so unsafe wording cannot drift into public files.
7. Prepare public-safe website update plan.

### High

8. Create FIO Protocol integration brief.
9. Create Metallicus/XPR/Metal/WebAuth integration brief.
10. Create provider shortlist for Part I safe launch.
11. Create legal/provider review packet.
12. Create public-safe v1.3 draft.
13. Create publication gate before touching `whitepaper.html`.

### Medium

14. Align SmartContractor Admin wording with v1.3 strategy.
15. Align beta tester wording with "construction trust infrastructure first."
16. Add integration placeholders to product docs without enabling providers.
17. Prepare partner outreach drafts for later founder use.
18. Prepare patent/innovation map around milestone verification, trust score, value records, and contractor underwriting.

### Small Details

19. Add glossary terms.
20. Add exact banned and safe phrases.
21. Add source link appendix.
22. Add migration checklist from v1.0/v1.2 wording to v1.3 wording.
23. Add archive plan for old whitepaper.
24. Add final PDF/site publishing checklist.

---

### Task 1: Preserve Current v1.3 Draft And Context

**Files:**
- Review: `docs/whitepaper-v1-3-hybrid-regulated-web3-draft.md`
- Review: `docs/gcsc-active-context.md`
- Optional commit: both files above

- [ ] **Step 1: Verify the new draft exists**

Run:

```powershell
Test-Path docs\whitepaper-v1-3-hybrid-regulated-web3-draft.md
```

Expected: `True`

- [ ] **Step 2: Verify active context points to v1.3**

Run:

```powershell
rg -n "whitepaper-v1-3-hybrid-regulated-web3-draft|Construction Trust Infrastructure|FIO Protocol" docs\gcsc-active-context.md
```

Expected: at least one match.

- [ ] **Step 3: Verify the draft contains the strategic thesis**

Run:

```powershell
rg -n "GCSC does not reject Web3 finance|GCSC phases Web3 finance responsibly|Part I|Part II|FIO Protocol Strategy|Metallicus" docs\whitepaper-v1-3-hybrid-regulated-web3-draft.md
```

Expected: matches for all major sections.

- [ ] **Step 4: Commit only scoped files if Git allows**

Run:

```powershell
git add -- docs/whitepaper-v1-3-hybrid-regulated-web3-draft.md docs/gcsc-active-context.md
git commit -m "Add hybrid regulated Web3 whitepaper draft"
git push
```

Expected: commit and push succeed. If Git/index/network is blocked, write a short note under `docs/autonomous-status/` and continue safe local planning.

### Task 2: Founder Review Packet

**Files:**
- Create: `docs/whitepaper-v1-3-founder-review-packet.md`
- Modify: `docs/gcsc-active-context.md`

- [ ] **Step 1: Create the packet**

Create `docs/whitepaper-v1-3-founder-review-packet.md` with this exact structure:

```markdown
# GCSC Whitepaper v1.3 Founder Review Packet

Status: internal founder review only.

This packet does not approve public publication, website changes, legal claims, provider commitments, live Supabase changes, real payments, real loans, escrow, stablecoin settlement, token collateral, XPR signatures, FIO registrations, Metallicus integration, external account changes, or public launch.

## One-Sentence Direction

GCSC becomes Construction Trust Infrastructure first, and regulated Web3 construction infrastructure second.

## What Changes

| Old Direction | New Direction |
|---|---|
| Token-first construction crypto project | Product-first construction trust infrastructure |
| GCSC directly offers finance/escrow/token upside | GCSC coordinates data, workflow, evidence, and partner-reviewed finance |
| Homeowners and contractors see Web3 language | Homeowners and contractors see normal construction workflows |
| Tokens, NFTs, and smart contracts lead the story | Tokens, smart contracts, and records become backend/future infrastructure |
| GCSC appears to be lender/escrow/bank/issuer | Licensed partners or future licensed entities perform regulated functions |

## What Stays

- SmartContractor MVP.
- Contractor verification.
- Milestone records.
- Dispute evidence.
- Working-capital concept.
- Value Mirror concept.
- XPR Network and WebAuth roadmap.
- Metal/Metallicus research path.
- FIO Protocol research path.
- Future regulated digital construction records.

## What Must Be Delayed

- real lending;
- real escrow custody;
- stablecoin settlement;
- token collateral;
- public investment token language;
- public NFT marketplace language;
- autonomous AI approvals;
- direct GCSC regulated financial activity.

## Founder Review Questions

1. Do you approve "Construction Trust Infrastructure first" as the public direction?
2. Do you want FIO Protocol included as a future optional Web3 UX layer?
3. Do you want Metallicus/XPR/Metal/WebAuth positioned as preferred infrastructure candidates, without claiming partnership?
4. Should the old token-first language be archived instead of deleted?
5. Should the next public whitepaper be v1.3, with v1.0/v1.2 retained as historical drafts?

## Recommended Founder Decision

Recommended: approve v1.3 as the internal working direction, but do not publish it until the public-safe draft, claim-risk register, website update plan, and publication gate are complete.
```

- [ ] **Step 2: Update active context**

Add one line near the v1.3 draft line:

```markdown
Whitepaper v1.3 founder review packet: `docs/whitepaper-v1-3-founder-review-packet.md`, summarizing the shift from token-first public language to Construction Trust Infrastructure first and future regulated Web3 second.
```

- [ ] **Step 3: Verify**

Run:

```powershell
rg -n "Construction Trust Infrastructure first|Founder Review Questions|FIO Protocol|Metallicus" docs\whitepaper-v1-3-founder-review-packet.md docs\gcsc-active-context.md
```

Expected: all phrases found.

- [ ] **Step 4: Commit**

Run:

```powershell
git add -- docs/whitepaper-v1-3-founder-review-packet.md docs/gcsc-active-context.md
git commit -m "Add whitepaper v1.3 founder review packet"
git push
```

### Task 3: Claim Risk Register

**Files:**
- Create: `docs/whitepaper-v1-3-claim-risk-register.md`
- Modify: `docs/gcsc-active-context.md`

- [ ] **Step 1: Create the risk register**

Create `docs/whitepaper-v1-3-claim-risk-register.md`:

```markdown
# GCSC Whitepaper v1.3 Claim Risk Register

Status: internal publication safety control.

This register does not provide legal advice. It prevents unsafe public wording until founder, legal, provider, finance, technical, and publication review are complete.

## Highest-Risk Claims

| Risky Claim | Why Risky | Safe Replacement | Required Gate |
|---|---|---|---|
| GCSC issues construction-backed investment tokens | Securities, Howey, broker/dealer, public offering risk | GCSC may support restricted digital construction records after legal review | Securities counsel |
| GCSC provides contractor loans | Lending license and consumer/business finance risk | GCSC organizes lender/provider-reviewed working-capital data | Licensed lender review |
| GCSC holds escrow | Escrow license, custody, money transmission risk | GCSC creates escrow-ready milestone records for licensed partners | Escrow provider/legal review |
| GCSC guarantees homeowner protection | Consumer protection and unfair/deceptive acts risk | GCSC improves documentation, verification, and dispute evidence | Legal/publication review |
| AI approves loans or releases funds | Adverse action, lending, escrow, accountability risk | AI assists review; final sensitive actions require human/provider approval | Legal/finance/security review |
| Contractors earn token upside from property value | Securities, tax, appraisal, property rights risk | Contractors build verified performance records and underwriting signals | Legal/tax/appraisal review |
| Stablecoin settlement is live | Stablecoin, money transmission, custody risk | Stablecoin settlement is a future provider-reviewed roadmap item | Payment/stablecoin provider review |
| FIO handles are payment approval | Misleading Web3 UX claim | FIO may reduce address/request friction in future approved flows | Technical/legal review |
| Metallicus approved GCSC | False partnership claim risk | Metallicus ecosystem is a candidate infrastructure path | Written partnership approval |
| SEC-approved or regulator-approved | False regulatory endorsement risk | Designed for compliance review under evolving digital-asset rules | Legal review |

## Safe Public Vocabulary

- construction trust infrastructure;
- verified contractor records;
- escrow-ready milestone workflow;
- partner-powered financing;
- provider-reviewed working capital;
- audit trail;
- request ID;
- future regulated Web3 layer;
- optional wallet integration;
- digital construction record;
- no-real-money beta.

## Blocked Public Vocabulary

- guaranteed return;
- risk-free;
- investment token;
- buy now;
- passive income;
- instant loan approval;
- automatic escrow release;
- SEC-approved;
- regulator-approved;
- insured profit;
- tokenized property equity;
- public NFT investment;
- guaranteed property value increase.

## Publication Rule

Any public sentence mentioning lending, escrow, stablecoins, token collateral, NFTs, staking, yield, investment, FIO payment requests, Metallicus, XPR settlement, or Value Mirror must include review-required context or remain unpublished.
```

- [ ] **Step 2: Update active context**

Add:

```markdown
Whitepaper v1.3 claim risk register: `docs/whitepaper-v1-3-claim-risk-register.md`, blocking risky public wording around loans, escrow, securities, token upside, stablecoin settlement, FIO, Metallicus, and Value Mirror until review gates are complete.
```

- [ ] **Step 3: Verify**

Run:

```powershell
rg -n "Highest-Risk Claims|Blocked Public Vocabulary|Publication Rule|Metallicus|FIO" docs\whitepaper-v1-3-claim-risk-register.md docs\gcsc-active-context.md
```

Expected: all key phrases found.

- [ ] **Step 4: Commit**

Run:

```powershell
git add -- docs/whitepaper-v1-3-claim-risk-register.md docs/gcsc-active-context.md
git commit -m "Add whitepaper v1.3 claim risk register"
git push
```

### Task 4: Public Outline

**Files:**
- Create: `docs/whitepaper-v1-3-public-outline.md`
- Modify: `docs/gcsc-active-context.md`

- [ ] **Step 1: Create public outline**

Create `docs/whitepaper-v1-3-public-outline.md`:

```markdown
# GCSC Whitepaper v1.3 Public Outline

Status: internal outline for future public-safe draft. Not approved for publication.

## Public Positioning

GCSC is Construction Trust Infrastructure for verified contractor records, escrow-ready milestone workflows, dispute evidence, partner-powered financing, and future regulated Web3 construction records.

## Table Of Contents

1. Executive Summary
2. The Construction Trust Problem
3. SmartContractor Product Layer
4. Verified Contractor And Homeowner Workflow
5. Digital Project Contracts And Milestones
6. Escrow-Ready Payment Coordination
7. Contractor Working Capital Readiness
8. Disputes, Evidence, Inspections, And Peer Review
9. Reputation, Underwriting Data, And Trust Scores
10. AI Assistance And Human Review Boundaries
11. Licensed Partner Model
12. Future Regulated Web3 Layer
13. FIO Protocol, XPR Network, WebAuth, And Metal Ecosystem Roadmap
14. Value Mirror And Digital Construction Records
15. Security, Audit Trail, And Anti-Backdoor Controls
16. Public Beta And Deployment Readiness
17. Roadmap By Phase
18. Legal, Provider, And Publication Review Gates
19. Risk Factors
20. Appendix: Source And Review Status

## Public-Safe Summary

The public draft must describe GCSC as a construction workflow and trust platform first. It may mention future Web3 infrastructure only as optional, regulated, review-required, and not live.

## Explicit Public Boundaries

- GCSC does not currently hold customer escrow funds.
- GCSC does not currently originate or approve loans.
- GCSC does not currently provide insurance.
- GCSC does not currently issue public investment tokens.
- GCSC does not currently promise token value, yield, appreciation, or returns.
- GCSC does not currently settle real payments or stablecoins in production.
- GCSC does not currently activate FIO payment requests for customer funds.
- GCSC does not currently claim Metallicus, XPR, Metal, or WebAuth partnership approval.
```

- [ ] **Step 2: Update active context**

Add:

```markdown
Whitepaper v1.3 public outline: `docs/whitepaper-v1-3-public-outline.md`, defining the future public-safe table of contents and explicit no-live-finance/no-public-token/no-partnership-claim boundaries.
```

- [ ] **Step 3: Verify**

Run:

```powershell
rg -n "Public Positioning|Table Of Contents|Explicit Public Boundaries|FIO Protocol|Value Mirror" docs\whitepaper-v1-3-public-outline.md docs\gcsc-active-context.md
```

Expected: all key phrases found.

- [ ] **Step 4: Commit**

Run:

```powershell
git add -- docs/whitepaper-v1-3-public-outline.md docs/gcsc-active-context.md
git commit -m "Add whitepaper v1.3 public outline"
git push
```

### Task 5: Integration Roadmap

**Files:**
- Create: `docs/whitepaper-v1-3-integration-roadmap.md`
- Modify: `docs/gcsc-active-context.md`

- [ ] **Step 1: Create roadmap**

Create `docs/whitepaper-v1-3-integration-roadmap.md`:

```markdown
# GCSC Whitepaper v1.3 Integration Roadmap

Status: internal implementation roadmap. No provider is approved or integrated by this document.

## Phase 0: Local Strategy And Validators

Owner: Codex.

Allowed:

- local docs;
- validators;
- SmartContractor demo wording;
- no-real-money product surfaces.

Blocked:

- external accounts;
- real payments;
- real loans;
- real escrow;
- token collateral;
- FIO registrations;
- Metallicus/XPR live actions.

## Phase 1: Safe Product MVP

Goal: prove construction trust workflow without regulated financial activity.

Build:

- project requests;
- contractor profile records;
- bid records;
- project-contract records;
- milestone evidence;
- dispute packets;
- admin review;
- request IDs;
- no-real-money payment intent records.

Checks:

- `npm run check:smartcontractor`
- `npm run check:auth`
- `npm run check:beta-readiness`

## Phase 2: Part I Provider Research

Categories:

| Category | Candidate Type | Status |
|---|---|---|
| Escrow | Escrow.com, licensed construction escrow, bank/custodian partner | Research only |
| Payments | Stripe Connect, Modern Treasury, Dwolla, bank rails | Research only |
| KYB/KYC | Middesk, Persona, Sardine, Alloy, Sumsub | Research only |
| Lending | licensed lender, embedded finance partner, lender-direct | Research only |
| Insurance | licensed broker, MGA, Next/CoverWallet-style partners | Research only |
| Valuation | HouseCanary, Clear Capital, ATTOM, appraisal partners | Research only |
| Documents | DocuSign, Dropbox Sign, PandaDoc | Research only |
| Disputes | construction mediator, AAA/ADR, attorney network | Research only |

## Phase 3: Part II Web3 Research

Categories:

| Category | Candidate | Status |
|---|---|---|
| Smart contracts | XPR Network, proton-tsc | Local/testnet only |
| Wallet/signing | WebAuth Wallet | Research/testnet only |
| Web3 identity/payment requests | FIO Protocol | Research only |
| Digital asset infrastructure | Metal Blockchain, Metallicus ecosystem | Research only |
| DeFi context | Metal X, LOAN Protocol | Research only |
| Stable-value settlement | XMD, USDC via licensed partner | Legal/provider review required |
| AML/wallet risk | Chainalysis, TRM Labs, Elliptic | Research only |
| Custody | Fireblocks, BitGo, qualified custodian | Research only |

## Phase 4: Review Packets

Required before live integration:

- legal review packet;
- lending provider review packet;
- escrow provider review packet;
- payment/stablecoin provider review packet;
- securities counsel review packet;
- tax/accounting review packet;
- technical/security review packet;
- founder approval record.

## Phase 5: Controlled Pilot

Allowed only after recorded approval:

- limited no-real-money beta;
- then limited partner pilot;
- then limited live workflow with rollback;
- then expansion by state and provider.

## Never Skip

No live integration may bypass:

- written provider approval;
- legal classification;
- consumer disclosures;
- audit logging;
- rollback plan;
- support/escalation plan;
- founder approval.
```

- [ ] **Step 2: Update active context**

Add:

```markdown
Whitepaper v1.3 integration roadmap: `docs/whitepaper-v1-3-integration-roadmap.md`, sequencing local MVP, Part I provider research, Part II Web3 research, review packets, and controlled pilots without autonomous live actions.
```

- [ ] **Step 3: Verify**

Run:

```powershell
rg -n "Phase 0|Phase 1|Phase 2|Phase 3|Phase 4|Phase 5|FIO Protocol|Metallicus" docs\whitepaper-v1-3-integration-roadmap.md docs\gcsc-active-context.md
```

Expected: all phases found.

- [ ] **Step 4: Commit**

Run:

```powershell
git add -- docs/whitepaper-v1-3-integration-roadmap.md docs/gcsc-active-context.md
git commit -m "Add whitepaper v1.3 integration roadmap"
git push
```

### Task 6: Provider Shortlist

**Files:**
- Create: `docs/whitepaper-v1-3-provider-shortlist.md`
- Modify: `docs/gcsc-active-context.md`

- [ ] **Step 1: Create shortlist**

Create `docs/whitepaper-v1-3-provider-shortlist.md`:

```markdown
# GCSC Whitepaper v1.3 Provider Shortlist

Status: research-only shortlist. No vendor, provider, or partner is approved by this document.

## Evaluation Criteria

Every provider must be reviewed for:

- legal role;
- licensing status;
- API availability;
- state coverage;
- construction-industry fit;
- KYC/KYB/AML support;
- data privacy;
- audit logs;
- pricing;
- integration complexity;
- support model;
- ability to keep GCSC out of unlicensed custody/lending/escrow roles.

## Part I Providers

| Category | Candidate | Why Consider | Main Risk |
|---|---|---|---|
| Escrow | Escrow.com | Existing escrow API and licensing footprint | Construction-specific milestone fit must be reviewed |
| Escrow | Licensed construction escrow partner | Better industry fit | State-by-state availability |
| Payments | Stripe Connect | Mature marketplace payment tooling | Not a true escrow replacement |
| Payments | Modern Treasury | Ledger/reconciliation/bank rails | Requires banking/payment partners |
| Payments | Dwolla | ACH payment orchestration | Custody/compliance boundaries |
| KYB | Middesk | Business verification | Coverage and pricing |
| KYC/KYB/Fraud | Persona | Identity workflows | Provider terms and cost |
| KYC/KYB/Fraud | Sardine | Fraud and fintech compliance | Crypto/fintech scope review |
| KYC/KYB/Fraud | Alloy | Decisioning and compliance orchestration | Integration complexity |
| Documents | DocuSign | Project-contract signatures | Cost and workflow fit |
| Valuation | ATTOM | Property data | Appraisal/legal limits |
| Valuation | HouseCanary | Property valuation data | Legal reliance limits |
| Insurance | CoverWallet-style broker | Contractor insurance workflow | Broker/product availability |
| Lending | Licensed lender partner | Avoids GCSC origination | Underwriting terms and disclosures |

## Part II Providers

| Category | Candidate | Why Consider | Main Risk |
|---|---|---|---|
| XPR smart contracts | XPR Network | Existing GCSC chain direction | Live deployment authority and security |
| Wallet/signing | WebAuth | XPR-native UX | User education and custody boundaries |
| Web3 handles | FIO Protocol | Human-readable handles and payment requests | Not a compliance substitute |
| Digital asset infra | Metallicus/Metal ecosystem | Regulated digital asset banking direction | Partnership and legal diligence required |
| DeFi context | Metal X / LOAN Protocol | Existing XPR/Metal DeFi context | Not automatically suitable for GCSC lending |
| AML analytics | Chainalysis / TRM / Elliptic | Wallet risk screening | Cost and integration complexity |
| Custody | Fireblocks / BitGo / qualified custodian | Enterprise custody controls | GCSC should not self-custody customer assets at launch |

## Next Research Actions

1. Build one-page profile per candidate.
2. Mark "usable now", "future only", "blocked", or "not suitable".
3. Do not contact vendors until founder approves outreach.
4. Do not enter credentials, API keys, or business data into vendor portals.
```

- [ ] **Step 2: Update active context**

Add:

```markdown
Whitepaper v1.3 provider shortlist: `docs/whitepaper-v1-3-provider-shortlist.md`, tracking research-only Part I and Part II provider candidates without partnership, licensing, or live integration claims.
```

- [ ] **Step 3: Verify**

Run:

```powershell
rg -n "research-only shortlist|Escrow.com|Stripe Connect|FIO Protocol|Metallicus|Next Research Actions" docs\whitepaper-v1-3-provider-shortlist.md docs\gcsc-active-context.md
```

Expected: all key phrases found.

- [ ] **Step 4: Commit**

Run:

```powershell
git add -- docs/whitepaper-v1-3-provider-shortlist.md docs/gcsc-active-context.md
git commit -m "Add whitepaper v1.3 provider shortlist"
git push
```

### Task 7: FIO Protocol Integration Brief

**Files:**
- Create: `docs/whitepaper-v1-3-fio-protocol-integration-brief.md`
- Modify: `docs/gcsc-active-context.md`

- [ ] **Step 1: Create FIO brief**

Create:

```markdown
# GCSC FIO Protocol Integration Brief

Status: internal research and architecture brief. No FIO domain, handle, transaction, integration, or customer-facing Web3 workflow is approved by this document.

## Role In GCSC

FIO Protocol is a future Web3 usability layer for human-readable handles, payment requests, and encrypted metadata.

It is not:

- KYC;
- KYB;
- AML;
- escrow;
- lending;
- custody;
- securities compliance;
- contractor licensing;
- legal approval;
- payment approval.

## Candidate Use Cases

| Use Case | Example | Phase |
|---|---|---|
| Contractor handle | `contractor@gcsc` | Future optional profile |
| Inspector handle | `inspector@gcsc` | Future optional profile |
| Project handle | `project-123@gcsc` | Research only |
| Milestone payment request | request tied to milestone id | Future legal/provider review |
| Encrypted memo | project id and invoice reference | Future technical review |
| Wallet address abstraction | prevent wrong-address copy/paste | Future UX review |

## Technical Research Questions

1. Can FIO Handles map safely to GCSC profile IDs?
2. Can FIO Requests carry a safe milestone reference without exposing private data?
3. How should encrypted FIO Data be stored in GCSC audit logs?
4. Can FIO coexist with WebAuth and XPR account names?
5. What happens if a contractor loses or changes a FIO Handle?
6. What user consent is required before a FIO Handle is shown publicly?
7. What states or countries create extra payment-request risk?

## Safe Pilot Order

1. Documentation-only design.
2. Internal admin-only test handle.
3. Testnet/no-real-money request simulation.
4. Optional contractor profile field.
5. Provider-reviewed payment request flow.

## Blocked Until Review

- registering a public GCSC FIO domain;
- asking users to create FIO Handles;
- sending real payment requests;
- exposing handles publicly;
- tying FIO requests to real escrow, loans, stablecoin settlement, or token collateral.
```

- [ ] **Step 2: Update active context**

Add:

```markdown
FIO Protocol integration brief: `docs/whitepaper-v1-3-fio-protocol-integration-brief.md`, treating FIO as future Web3 usability for handles, requests, and encrypted metadata, not as KYC/KYB/escrow/lending/compliance.
```

- [ ] **Step 3: Verify**

Run:

```powershell
rg -n "FIO Protocol|contractor@gcsc|project-123@gcsc|Technical Research Questions|Blocked Until Review" docs\whitepaper-v1-3-fio-protocol-integration-brief.md docs\gcsc-active-context.md
```

Expected: all key phrases found.

- [ ] **Step 4: Commit**

Run:

```powershell
git add -- docs/whitepaper-v1-3-fio-protocol-integration-brief.md docs/gcsc-active-context.md
git commit -m "Add FIO Protocol integration brief"
git push
```

### Task 8: Metallicus/XPR/Metal/WebAuth Integration Brief

**Files:**
- Create: `docs/whitepaper-v1-3-metallicus-xpr-integration-brief.md`
- Modify: `docs/gcsc-active-context.md`

- [ ] **Step 1: Create integration brief**

Create:

```markdown
# GCSC Metallicus, XPR, Metal, And WebAuth Integration Brief

Status: internal research and architecture brief. This does not claim partnership, approval, integration, or live production use.

## Strategic Role

The Metallicus/XPR/Metal/WebAuth ecosystem is a candidate infrastructure path for GCSC future regulated Web3 construction records, identity, smart contracts, and settlement references.

## Candidate Components

| Component | Candidate Role | Current GCSC Status |
|---|---|---|
| XPR Network | smart contracts, audit hashes, project registry, settlement references | existing project direction, local/testnet only |
| WebAuth | wallet/signing UX for future contractor/admin actions | future optional wallet layer |
| Metal Blockchain | future institutional digital asset infrastructure | research only |
| Metal X | future regulated DeFi context research | research only |
| LOAN Protocol | future borrowing/lending research reference | research only |
| Metal Pay / Metal Pay Connect | future fiat/digital asset bridge candidate | research only |
| Metal Dollar / XMD | future stable-value settlement candidate | legal/provider review required |

## Required Diligence

1. Confirm current product availability and jurisdiction coverage.
2. Confirm licensing, partner, and user eligibility requirements.
3. Confirm API/developer documentation.
4. Confirm whether GCSC can legally reference or integrate each product.
5. Confirm custody, money transmission, stablecoin, securities, and lending boundaries.
6. Confirm KYC/KYB/AML and wallet-risk monitoring requirements.
7. Confirm testnet/sandbox options before any production action.

## Safe Technical Path

1. Keep current smart contract work local/testnet.
2. Keep WebAuth optional and separate from required KYC/KYB.
3. Use XPR audit hashes before value-bearing actions.
4. Do not enable lending/borrowing through Metal X or LOAN Protocol without legal/provider review.
5. Do not use stablecoin settlement until payment/stablecoin provider review is complete.
6. Do not claim Metallicus approval without written permission.

## Blocked Until Founder/Legal/Provider Approval

- production XPR contract deployment;
- XPR signatures involving value;
- token collateral;
- stablecoin settlement;
- Metal X lending/borrowing;
- LOAN Protocol integration;
- public announcement of Metallicus partnership;
- user-facing Web3 finance workflow.
```

- [ ] **Step 2: Update active context**

Add:

```markdown
Metallicus/XPR/Metal/WebAuth integration brief: `docs/whitepaper-v1-3-metallicus-xpr-integration-brief.md`, preserving the future Web3 infrastructure path while blocking partnership claims and live value-bearing actions until approval.
```

- [ ] **Step 3: Verify**

Run:

```powershell
rg -n "Metallicus|XPR Network|WebAuth|Metal X|LOAN Protocol|Blocked Until Founder" docs\whitepaper-v1-3-metallicus-xpr-integration-brief.md docs\gcsc-active-context.md
```

Expected: all key phrases found.

- [ ] **Step 4: Commit**

Run:

```powershell
git add -- docs/whitepaper-v1-3-metallicus-xpr-integration-brief.md docs/gcsc-active-context.md
git commit -m "Add Metallicus XPR integration brief"
git push
```

### Task 9: Public Website Update Plan

**Files:**
- Create: `docs/whitepaper-v1-3-public-website-update-plan.md`
- Modify: `docs/gcsc-active-context.md`

- [ ] **Step 1: Create website plan**

Create:

```markdown
# GCSC Whitepaper v1.3 Public Website Update Plan

Status: internal website update plan. This does not approve editing or publishing `whitepaper.html`.

## Goal

Replace token-first public wording with Construction Trust Infrastructure wording after founder/publication review.

## Files To Review Before Editing

- `whitepaper.html`
- `index.html`
- `docs/whitepaper-v1-3-hybrid-regulated-web3-draft.md`
- `docs/whitepaper-v1-3-public-outline.md`
- `docs/whitepaper-v1-3-claim-risk-register.md`

## High-Risk Old Wording To Replace

| Old Wording Type | Replacement Direction |
|---|---|
| decentralized construction ecosystem | construction trust infrastructure |
| AI-managed DAO | AI-assisted review with human/provider gates |
| investment token | utility or future restricted digital record |
| staking/yield/buyback as public promise | review-required token utility roadmap |
| instant loans | lender/provider-reviewed working-capital readiness |
| escrow by GCSC | escrow-ready milestone records for licensed partners |
| NFTs for ownership/upside | future digital construction records |
| tokenized real estate returns | future regulated RWA research |

## Safe First Website Changes

1. Update whitepaper page title to v1.3 draft/review status only after approval.
2. Replace hero subtitle with "Construction Trust Infrastructure for verified project records, milestone workflows, and future regulated Web3 settlement."
3. Add clear "not live finance" boundary.
4. Move tokenomics below product and partner model.
5. Add "future regulated Web3 roadmap" section.
6. Archive v1.0 wording instead of deleting it.

## Required Before Editing Public Files

- founder approval;
- public outline complete;
- claim risk register complete;
- publication gate complete;
- targeted checks pass;
- rollback/archive plan exists.
```

- [ ] **Step 2: Update active context**

Add:

```markdown
Whitepaper v1.3 public website update plan: `docs/whitepaper-v1-3-public-website-update-plan.md`, defining safe future replacement of token-first website wording after founder/publication review.
```

- [ ] **Step 3: Verify**

Run:

```powershell
rg -n "High-Risk Old Wording|Safe First Website Changes|Required Before Editing Public Files|Construction Trust Infrastructure" docs\whitepaper-v1-3-public-website-update-plan.md docs\gcsc-active-context.md
```

Expected: all key phrases found.

- [ ] **Step 4: Commit**

Run:

```powershell
git add -- docs/whitepaper-v1-3-public-website-update-plan.md docs/gcsc-active-context.md
git commit -m "Add whitepaper v1.3 website update plan"
git push
```

### Task 10: v1.3 Validators

**Files:**
- Create: `construction-ai/scripts/validate-whitepaper-v1-3-plan.mjs`
- Modify: `construction-ai/package.json`
- Modify: `docs/gcsc-active-context.md`

- [ ] **Step 1: Create validator script**

Create `construction-ai/scripts/validate-whitepaper-v1-3-plan.mjs`:

```js
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const requiredFiles = [
  'docs/whitepaper-v1-3-hybrid-regulated-web3-draft.md',
  'docs/whitepaper-v1-3-founder-review-packet.md',
  'docs/whitepaper-v1-3-claim-risk-register.md',
  'docs/whitepaper-v1-3-public-outline.md',
  'docs/whitepaper-v1-3-integration-roadmap.md',
  'docs/whitepaper-v1-3-provider-shortlist.md',
  'docs/whitepaper-v1-3-fio-protocol-integration-brief.md',
  'docs/whitepaper-v1-3-metallicus-xpr-integration-brief.md',
  'docs/whitepaper-v1-3-public-website-update-plan.md',
];

const requiredPhrases = [
  'Construction Trust Infrastructure',
  'GCSC does not reject Web3 finance',
  'GCSC phases Web3 finance responsibly',
  'FIO Protocol',
  'XPR Network',
  'Metallicus',
  'licensed partner',
  'not approved for public publication',
];

const bannedPublicationClaims = [
  'guaranteed return',
  'risk-free',
  'SEC-approved',
  'regulator-approved',
  'instant loan approval',
  'GCSC holds escrow',
  'GCSC provides contractor loans',
];

const errors = [];

for (const file of requiredFiles) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    errors.push(`Missing required file: ${file}`);
    continue;
  }

  const text = fs.readFileSync(fullPath, 'utf8');
  for (const phrase of requiredPhrases) {
    if (!text.includes(phrase) && file.includes('whitepaper-v1-3-hybrid')) {
      errors.push(`Missing phrase in ${file}: ${phrase}`);
    }
  }

  for (const claim of bannedPublicationClaims) {
    if (text.includes(claim) && !text.includes('Blocked') && !text.includes('Risky')) {
      errors.push(`Unsafe claim appears outside risk context in ${file}: ${claim}`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 plan validation passed');
```

- [ ] **Step 2: Add package script**

In `construction-ai/package.json`, add:

```json
"check:whitepaper-v1-3-plan": "node scripts/validate-whitepaper-v1-3-plan.mjs"
```

Place it near the existing whitepaper validators.

- [ ] **Step 3: Update active context**

Add:

```markdown
Whitepaper v1.3 implementation validator: `npm run check:whitepaper-v1-3-plan`, requiring the v1.3 strategy, founder packet, claim register, public outline, integration roadmap, provider shortlist, FIO brief, Metallicus/XPR brief, and website update plan to stay present and boundary-safe.
```

- [ ] **Step 4: Run validator**

Run:

```powershell
npm run check:whitepaper-v1-3-plan
```

from `C:\gcsc\construction-ai`.

Expected: `whitepaper v1.3 plan validation passed`

- [ ] **Step 5: Commit**

Run:

```powershell
git add -- construction-ai/scripts/validate-whitepaper-v1-3-plan.mjs construction-ai/package.json docs/gcsc-active-context.md
git commit -m "Add whitepaper v1.3 plan validator"
git push
```

### Task 11: Public-Safe v1.3 Draft

**Files:**
- Create: `docs/whitepaper-v1-3-public-draft.md`
- Modify: `docs/gcsc-active-context.md`

- [ ] **Step 1: Create public draft**

Use `docs/whitepaper-v1-3-public-outline.md` and `docs/whitepaper-v1-3-claim-risk-register.md` to write the public-safe draft.

Required sections:

```markdown
# GCSC Whitepaper v1.3 Public Draft

Status: internal public-safe draft. Not approved for publication.

## Executive Summary
## The Construction Trust Problem
## SmartContractor Product Layer
## Verified Contractor Workflow
## Milestones And Escrow-Ready Records
## Partner-Powered Working Capital Readiness
## Disputes, Evidence, And Peer Review
## Reputation And Underwriting Data
## AI Assistance Boundaries
## Licensed Partner Model
## Future Regulated Web3 Layer
## FIO Protocol Roadmap
## XPR, WebAuth, Metal, And Metallicus Research Path
## Value Mirror System
## Security And Audit Trail
## Roadmap
## Review Gates
## Risk Factors
```

Each regulated feature must say "future", "provider-reviewed", "not live", or "review-required."

- [ ] **Step 2: Verify public draft language**

Run:

```powershell
rg -n "not approved for publication|not live|provider-reviewed|review-required|Construction Trust Infrastructure|FIO Protocol|Metallicus" docs\whitepaper-v1-3-public-draft.md
```

Expected: all key phrases found.

- [ ] **Step 3: Commit**

Run:

```powershell
git add -- docs/whitepaper-v1-3-public-draft.md docs/gcsc-active-context.md
git commit -m "Add whitepaper v1.3 public draft"
git push
```

### Task 12: Publication Gate

**Files:**
- Create: `docs/whitepaper-v1-3-publication-gate.md`
- Modify: `docs/gcsc-active-context.md`

- [ ] **Step 1: Create publication gate**

Create:

```markdown
# GCSC Whitepaper v1.3 Publication Gate

Status: required before publishing v1.3 to website, PDF, deck, partner packet, grant packet, investor packet, email, social, or announcement.

## Required Inputs

| Input | Required Status |
|---|---|
| Founder review packet | reviewed |
| Claim risk register | complete |
| Public outline | complete |
| Public draft | complete |
| Website update plan | complete |
| Legal/provider review | required before public regulated claims |
| Finance-provider review | required before working-capital claims |
| Technical/security review | required before smart contract or wallet claims |
| Publication approval | required before replacing `whitepaper.html` |
| Archive/rollback plan | required before public file edit |

## Go / No-Go

Default state: NO-GO.

Move to REVIEW only after all local docs and validators pass.

Move to GO only after founder approval and required external reviews are recorded.

## Blocked Public Actions

- replacing `whitepaper.html`;
- deleting old whitepaper files;
- publishing PDF;
- announcing FIO integration;
- announcing Metallicus partnership;
- announcing live lending;
- announcing live escrow;
- announcing stablecoin settlement;
- announcing public token offering;
- announcing Value Mirror as investment product.
```

- [ ] **Step 2: Update active context**

Add:

```markdown
Whitepaper v1.3 publication gate: `docs/whitepaper-v1-3-publication-gate.md`, keeping v1.3 publication default NO-GO until founder approval, review packets, validators, archive/rollback plan, and required external reviews are complete.
```

- [ ] **Step 3: Verify**

Run:

```powershell
rg -n "Default state: NO-GO|Blocked Public Actions|replacing `whitepaper.html`|FIO integration|Metallicus partnership" docs\whitepaper-v1-3-publication-gate.md docs\gcsc-active-context.md
```

Expected: all key phrases found.

- [ ] **Step 4: Commit**

Run:

```powershell
git add -- docs/whitepaper-v1-3-publication-gate.md docs/gcsc-active-context.md
git commit -m "Add whitepaper v1.3 publication gate"
git push
```

### Task 13: SmartContractor Product Wording Alignment

**Files:**
- Review: `construction-ai/public/smartcontractor.html`
- Review: `construction-ai/scripts/validate-smartcontractor.mjs`
- Modify only if safe: same files

- [ ] **Step 1: Search for risky wording**

Run:

```powershell
rg -n "investment|guaranteed|yield|staking|NFT|instant loan|escrow release|token collateral|stablecoin|Metallicus|FIO" construction-ai\public\smartcontractor.html
```

Expected: any matches should be demo-only, future, blocked, or review-required.

- [ ] **Step 2: Replace unsafe user-facing wording only if needed**

Allowed replacements:

- `instant loan` -> `working-capital review`
- `escrow release` -> `escrow-ready milestone status`
- `token collateral` -> `future token-collateral review`
- `NFT` -> `future digital construction record`
- `stablecoin settlement` -> `future provider-reviewed settlement`

- [ ] **Step 3: Run SmartContractor validator**

Run:

```powershell
npm run check:smartcontractor
```

from `C:\gcsc\construction-ai`.

Expected: PASS.

- [ ] **Step 4: Commit only if files changed**

Run:

```powershell
git add -- construction-ai/public/smartcontractor.html construction-ai/scripts/validate-smartcontractor.mjs
git commit -m "Align SmartContractor wording with v1.3 strategy"
git push
```

### Task 14: Backlog Alignment

**Files:**
- Modify: `docs/smartcontractor-backlog.md`
- Modify: `docs/gcsc-active-context.md`

- [ ] **Step 1: Add v1.3 implementation section to backlog**

Add a section:

```markdown
## NOW: Whitepaper v1.3 Hybrid Strategy Implementation

| Priority | Item | Owner | Status | Acceptance Check |
|---|---|---|---|---|
| P0 | v1.3 founder review packet | Codex | DONE/REVIEW | Founder can review direction without reading full draft |
| P0 | v1.3 claim risk register | Codex | DONE | Risky public claims have safe replacements and gates |
| P0 | v1.3 public outline | Codex | DONE | Public table of contents avoids live finance/token claims |
| P0 | v1.3 integration roadmap | Codex | DONE | Part I and Part II integrations are sequenced by approval gates |
| P1 | FIO Protocol integration brief | Codex | DONE | FIO is framed as future UX layer, not compliance or payment approval |
| P1 | Metallicus/XPR integration brief | Codex | DONE | Metallicus/XPR are framed as candidates, not approved partners |
| P1 | v1.3 provider shortlist | Codex | DONE | Candidate providers are research-only |
| P1 | v1.3 publication gate | Codex | REVIEW | Public replacement remains NO-GO until approvals |
```

- [ ] **Step 2: Update active context**

Add one line that backlog now tracks v1.3 implementation.

- [ ] **Step 3: Verify**

Run:

```powershell
rg -n "Whitepaper v1.3 Hybrid Strategy Implementation|FIO Protocol integration brief|publication gate" docs\smartcontractor-backlog.md docs\gcsc-active-context.md
```

Expected: all key phrases found.

- [ ] **Step 4: Commit**

Run:

```powershell
git add -- docs/smartcontractor-backlog.md docs/gcsc-active-context.md
git commit -m "Track whitepaper v1.3 implementation backlog"
git push
```

### Task 15: Archive Plan For Old Whitepaper

**Files:**
- Create: `docs/whitepaper-v1-3-archive-and-rollback-plan.md`
- Modify: `docs/gcsc-active-context.md`

- [ ] **Step 1: Create archive plan**

Create:

```markdown
# GCSC Whitepaper v1.3 Archive And Rollback Plan

Status: internal plan. Do not rename, delete, or replace public files until publication gate is GO.

## Current Public Files

- `whitepaper.html`
- `whitepaper-v1.1.pdf`
- `GCSC_Project_Hub/documentation/whitepaper.html`
- `GCSC_Project_Hub/documentation/whitepaper-v1.1.pdf`

## Archive Strategy

1. Keep old files until v1.3 public draft is approved.
2. Copy old `whitepaper.html` to `whitepaper-v1-0-archive.html`.
3. Add archive notice, not deletion.
4. Replace `whitepaper.html` only after publication gate GO.
5. Keep rollback instructions in this file.

## Rollback Strategy

If v1.3 publication creates issue:

1. restore archived v1.0/v1.1 HTML;
2. restore prior navigation if changed;
3. record issue in publication evidence log;
4. pause external sharing;
5. route to founder/publication/legal review.

## Blocked Until GO

- deleting old whitepaper;
- replacing public HTML;
- publishing PDF;
- changing GitHub Pages public copy;
- announcing new whitepaper externally.
```

- [ ] **Step 2: Update active context**

Add:

```markdown
Whitepaper v1.3 archive/rollback plan: `docs/whitepaper-v1-3-archive-and-rollback-plan.md`, preserving old public whitepaper files until v1.3 publication gate is GO.
```

- [ ] **Step 3: Verify**

Run:

```powershell
rg -n "Archive Strategy|Rollback Strategy|Blocked Until GO|whitepaper-v1-0-archive" docs\whitepaper-v1-3-archive-and-rollback-plan.md docs\gcsc-active-context.md
```

Expected: all key phrases found.

- [ ] **Step 4: Commit**

Run:

```powershell
git add -- docs/whitepaper-v1-3-archive-and-rollback-plan.md docs/gcsc-active-context.md
git commit -m "Add whitepaper v1.3 archive rollback plan"
git push
```

## Self-Review Checklist

- [ ] Every task has a concrete file path.
- [ ] Every autonomous task stays local-only unless explicitly approved later.
- [ ] FIO Protocol is included as future optional Web3 UX, not compliance or live payment authority.
- [ ] Metallicus/XPR/Metal/WebAuth are included as candidates, not claimed partners.
- [ ] Part I launch providers are research-only until founder outreach approval.
- [ ] Part II Web3 providers are research-only until legal/provider/security approval.
- [ ] Old whitepaper is archived later, not deleted now.
- [ ] Public publication remains NO-GO until the publication gate is complete.
- [ ] Git commits are scoped by task.
- [ ] If Git push is blocked, the worker writes a status note and continues safe local work.

## Execution Order Summary

1. Preserve and commit v1.3 draft.
2. Founder review packet.
3. Claim risk register.
4. Public outline.
5. Integration roadmap.
6. Provider shortlist.
7. FIO Protocol integration brief.
8. Metallicus/XPR/Metal/WebAuth integration brief.
9. Website update plan.
10. v1.3 validators.
11. Public-safe v1.3 draft.
12. Publication gate.
13. SmartContractor wording alignment.
14. Backlog alignment.
15. Archive and rollback plan.

## Final Boundary

This plan authorizes Codex to create, edit, validate, commit, and push local project documents, local validators, and demo-only wording. It does not authorize public publication, external outreach, live integrations, money movement, legal conclusions, or account changes.
