# GCSC v1.2 Core Architecture Package

Status: founder-approved internal source-of-truth architecture package.

Approval marker: FOUNDER_APPROVED_INTERNAL_SOURCE_OF_TRUTH.

Previous review state: internal founder-review architecture package only.

This package does not edit the published whitepaper, website, PDF, partner packet, grant packet, investor packet, deck, email, social post, or announcement. It is not legal advice, securities advice, tax advice, lender approval, escrow approval, payment-provider approval, stablecoin approval, token-collateral approval, not approval to launch real loans, not approval to launch real escrow, not approval to launch real repayment routing, not approval to launch real stablecoin settlement, not approval to launch real token collateral, not approval to launch real payments, and not approval to launch automatic legal/financial decisions.

## Purpose

This is the founder-level source-of-truth package for the next GCSC whitepaper v1.2 architecture pass.

The goal is to position GCSC as construction trust infrastructure first, not as a token-first crypto project. The architecture connects:

- SmartContractor construction workflows;
- signed project contracts;
- milestone-based work and evidence;
- escrow-ready payment coordination;
- contract-backed working-capital eligibility;
- repayment-first milestone waterfall;
- AI-assisted verification with human/provider controls;
- modular smart contracts;
- legal/provider review gates;
- future GCSC/GCST settlement, utility, governance, and network hooks.

## Product Positioning Rule

Whitepaper v1.2 should follow this order:

1. SmartContractor Platform: construction jobs, bids, signed project contracts, milestones, evidence, reviews, disputes, and admin/risk controls.
2. Construction Trust Infrastructure: identity, contractor verification, compliance documents, reputation, AI-assisted milestone verification, audit trails, dispute routing, and provider-ready payment states.
3. Settlement And Tokenized Construction Network: smart contract modules, XPR Network, GCSC/GCST utility, compliant stablecoin settlement roadmap, DAO governance hooks, treasury controls, tokenized construction agreements, and future RWA/Real Estate DAO.

The first impression should be practical construction coordination and trust, not token speculation, DeFi promises, or an unreviewed lending product.

## Core Architecture Thesis

GCSC turns construction work into structured, auditable project objects:

- a homeowner or property owner creates a project;
- a contractor submits a bid;
- an accepted bid becomes a signed project contract;
- the contract defines milestones, evidence, reviews, dispute rules, and payment schedule;
- each milestone creates an auditable completion state;
- approved milestone receivables can support future contractor working-capital underwriting;
- provider-approved milestone payments can apply a repayment-first waterfall before the contractor receives the remaining net payout;
- smart contracts eventually record high-value states, settlement events, reputation events, repayment events, and audit events only after legal, provider, founder, and security approval.

This makes the signed project contract a verified underwriting package and workflow anchor. It must not be described as automatic legal collateral today.

## Contract-Backed Loan Flow

Preferred public-safe wording:

- contract-backed working-capital eligibility;
- receivables-based underwriting;
- signed-project-contract credit support;
- repayment-first milestone waterfall;
- provider-reviewed working capital;
- escrow-ready payment coordination.

Flow:

1. Owner and contractor sign a SmartContractor project contract.
2. The contract stores references to parties, scope, milestones, evidence requirements, payment schedule, review rules, and dispute rules.
3. Contractor requests working capital against expected milestone receivables.
4. GCSC prepares a risk package using identity, license, insurance, project value, milestone timing, reputation, dispute history, repayment history, and verification status.
5. AI agents produce recommendations only.
6. A lender, finance provider, or approved admin/provider workflow reviews the package.
7. If approved outside the autonomous system, the contractor receives working capital through approved rails.
8. When a milestone is completed, evidence is submitted and reviewed.
9. If the milestone is approved and not disputed, the payment waterfall applies.
10. The agreed repayment amount is routed first, and the remaining net amount goes to the contractor.
11. Audit events preserve every state transition and calculation input.

Formula:

```text
milestone_gross - approved_platform_fees - agreed_loan_repayment = contractor_net_payout
```

Required controls:

- no loan approval without provider/legal/founder gates;
- no repayment routing while disputed;
- no release before milestone approval;
- no repayment above outstanding balance;
- no negative contractor payout;
- no AI-only approval;
- no hidden admin drain;
- no token collateral without collateral, oracle, custody, legal, and provider review.

## Smart Contract Module Split

Future smart contract implementation should be split into focused modules, not one large contract.

### Authority And Role Module

Purpose: records roles, multisig/admin quorum, emergency pause authority, and protected action permissions.

Hard boundary: no hidden owner-only drain, no frontend-controlled protected authority, no unlogged privileged action.

### Project Contract Registry

Purpose: records accepted project relationships, participant roles, signed agreement references, milestone references, and status history.

Hard boundary: the on-chain record is not the signed legal contract unless attorney/provider/jurisdiction review approves that treatment.

### Milestone And Escrow-Ready State Machine

Purpose: tracks milestone work states, evidence submission, review, approval, release eligibility, dispute hold, refund/adjustment state, and archive state.

Hard boundary: escrow-ready does not mean live regulated escrow.

### Contract-Backed Loan Ledger

Purpose: tracks working-capital request state, provider review state, approved principal reference, outstanding balance, repayment events, and closeout.

Hard boundary: no autonomous lending approval and no real loan activation without external provider approval.

### Repayment Waterfall Router

Purpose: calculates repayment-first milestone routing after approval and no-dispute checks.

Hard boundary: no repayment routing without release eligibility, provider approval, payment-provider terms, and legal/provider gate completion.

### Collateral And Risk Module

Purpose: records future collateral references, risk scores, LTV policy references, price snapshot references, and blocked/unblocked collateral status.

Hard boundary: token collateral remains disabled until custody, oracle, collateral agreement, legal, finance-provider, and founder approval exist.

### Reputation And Review Ledger

Purpose: records completed projects, milestone quality, dispute ratio, repayment behavior where legally applicable, review outcomes, correction events, and fraud flags.

Hard boundary: no unexplained automated denial and no illegal blacklisting.

### Dispute And Human Override Module

Purpose: pauses releases, captures review routes, records resolution outcomes, and prevents payment/repayment bypass while a dispute is active.

Hard boundary: dispute state must block release and repayment routing until resolution rules are satisfied.

### Audit And Compliance Registry

Purpose: records non-secret evidence that required checks, approvals, reviews, and state transitions occurred.

Hard boundary: no private documents, passwords, private keys, service-role keys, seed phrases, SSNs, raw bank data, or raw identity documents on-chain.

## AI And Human Control Boundary

AI can recommend:

- contractor-job match;
- missing evidence list;
- milestone confidence score;
- risk signals;
- fraud indicators;
- compliance checklist status;
- dispute triage route.

AI cannot:

- approve loans;
- release payments;
- route repayments;
- decide disputes;
- create legal collateral status;
- decide stablecoin/payment compliance;
- approve token collateral;
- override founder/provider/legal/security gates.

Human, provider, admin, legal, and security review remain required for critical money, legal, credit, escrow, collateral, and public-claim decisions.

## Whitepaper v1.2 Placement Map

### Executive Summary

Lead with SmartContractor as construction trust infrastructure for project contracts, milestones, evidence, reviews, disputes, payments, and contractor reputation.

Avoid leading with token supply, investment return, DeFi yield, or speculative token language.

### Problem

Explain construction trust failure:

- delayed payments;
- risky upfront deposits;
- weak contractor verification;
- unclear progress evidence;
- disputes without structured records;
- small contractors lacking safe working capital;
- homeowners lacking protection from unverified work.

### Solution

Explain:

- signed project contracts;
- milestone-based workflows;
- escrow-ready payment states;
- AI-assisted evidence review;
- human/inspector/peer/admin review;
- contract-backed working-capital eligibility;
- repayment-first milestone waterfall;
- audit and compliance records.

### Smart Contract Architecture

Place the module split after the product workflow is understood.

Use smart contracts as settlement and audit infrastructure, not as a replacement for legal review or provider rails.

### Token And Settlement Layer

Place GCSC/GCST after the construction workflow and trust layer.

Describe token utility, governance, network participation, future settlement coordination, and roadmap modules conservatively.

### Legal And Provider Boundaries

Make review gates explicit:

- real loans disabled until provider/legal/founder approval;
- real escrow disabled until licensed/provider rails exist;
- real repayment routing disabled until provider/payment/legal terms exist;
- token collateral disabled until legal/oracle/custody/provider review;
- stablecoin settlement disabled until payment/provider/compliance review.

## Legal And Provider Review Packet Outline

The review packet should give a lawyer or finance/payment provider a clean map:

1. What GCSC does now: demo/local coordination, project contracts, milestones, evidence, risk/admin review, and disabled real-money gates.
2. What GCSC wants to do later: contract-backed working capital, repayment-first milestone waterfall, escrow-ready payment coordination, stablecoin settlement, token collateral roadmap.
3. What is explicitly disabled: real loans, live escrow, real repayment routing, token collateral, stablecoin settlement, live money movement, legal collateral claims, automatic AI decisions.
4. What needs review: lending/licensing, escrow/payment handling, money transmission, UCC/security interest treatment, consumer protection, contractor finance disclosures, stablecoin rails, token collateral, privacy/data retention, state-by-state construction rules.
5. What evidence exists: blueprint, smart contract architecture draft, claim review matrix, legal review validator, implementation blocker register, approval evidence templates.
6. What founder must decide: preferred wording, provider path, launch scope, public beta scope, legal reviewer route, finance-provider review route.

## Security And Anti-Backdoor Principles

Implementation must preserve:

- least-privilege roles;
- multisig or quorum for privileged actions;
- append-only audit events;
- deterministic state transitions;
- replayable waterfall calculations;
- emergency pause with audit trail;
- no owner-only drain;
- no hidden upgrade path;
- no arbitrary balance mutation;
- no arbitrary oracle trust;
- no dispute-to-release bypass;
- no contractor self-approval;
- no AI-only approval;
- no service-role key in browser code;
- no secret-looking values in docs or public artifacts.

## Blocked Claims

Do not use these claims in public whitepaper v1.2, website copy, decks, partner packets, grant packets, investor packets, emails, social posts, or announcements:

- GCSC is a live lender;
- GCSC is a live escrow company;
- real escrow is live;
- real loans are live;
- contract-backed loans are live;
- signed project contracts are legal collateral today;
- repayment routing is legally enforceable without provider/legal approval;
- stablecoin settlement is live;
- token collateral is live;
- GCSC/GCST is guaranteed to increase in value;
- passive income, guaranteed yield, or guaranteed returns are available;
- AI makes final legal, financial, lending, escrow, payment, collateral, or dispute decisions;
- CLARITY Act, SEC, CFTC, bank, government, or regulator approval already covers GCSC.

## Founder Decision Record

Founder approval:

- 2026-05-13 PT: Founder explicitly approved point 1 with "Утверждаю пункт 1".
- Decision: this package is now the internal source of truth for GCSC v1.2 architecture.
- Scope: architecture, whitepaper direction, contract-backed loan framing, module split, AI boundaries, and legal/provider gates.
- Non-scope: this is not approval to launch real loans, real escrow, real repayment routing, stablecoin settlement, token collateral, production payments, live Supabase changes, deployment settings, external account changes, or legal/financial decisions.

Current founder direction:

- evening focus shifts away from repetitive micro-validator work;
- prioritize Contract-Backed Loan and v1.2 Core Architecture;
- position GCSC as construction trust infrastructure first;
- treat signed project contracts as underwriting support and expected receivables, not automatic legal collateral today;
- require AI recommendation-only boundaries;
- require modular smart contract split;
- keep legal/provider review gates before live claims and public real-money language.

## Immediate Implementation Path

1. Use this package as the v1.2 source-of-truth index.
2. Keep `docs/gcsc-contract-backed-loan-blueprint.md` as the detailed contract-backed loan model.
3. Keep `docs/whitepaper-v1-2-smart-contract-architecture-draft.md` as the detailed smart contract narrative.
4. Update public whitepaper wording only after founder/legal/provider/technical approvals.
5. Build local smart contract modules only as local state-machine and replay-test packages before any live XPR deployment.
6. Keep real loans, real escrow, real repayment routing, token collateral, and stablecoin settlement blocked until external approvals exist.

## Required Checks Before Public Use

- `npm run check:gcsc-v1-2-core-architecture-package`
- `npm run check:contract-backed-loan-blueprint`
- `npm run check:whitepaper-v1-2-smart-contract-architecture`
- `npm run check:whitepaper-v1-2-contract-backed-loan-flow`
- `npm run check:whitepaper-v1-2-contract-backed-loan-legal-provider-handoff`
- `npm run check:whitepaper-v1-2-contract-backed-loan-finance-provider-handoff`
- `npm run check:whitepaper-v1-2-claim-review`
- `npm run check:legal-review`
- `npm run check`
