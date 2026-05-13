# GCSC Whitepaper v1.2 Contract-Backed Loan Addendum

Status: internal founder-review addendum only.

This document does not edit the published whitepaper, website, PDF, partner packet, grant packet, investor packet, deck, email, social post, or announcement. It is not legal advice, not lending approval, not escrow approval, not payment provider approval, not securities advice, not approval to launch real loans, and not approval to treat signed project contracts as legal collateral today.

## Purpose

This addendum preserves the founder idea that a signed SmartContractor project contract can become the underwriting basis for contractor working capital.

The core idea:

1. A homeowner/property owner and contractor sign a project contract.
2. The project contract defines scope, milestones, evidence, estimated value, inspection/review path, and payment schedule.
3. The contractor may request working capital against the expected milestone receivables.
4. The risk engine evaluates contractor identity, business verification, license, insurance, reputation, disputes, prior repayment, contract value, milestone schedule, and project risk.
5. If approved by the future lender/provider workflow, the loan helps the contractor buy materials, mobilize labor, and start work without requiring a large upfront homeowner deposit.
6. When an approved milestone payment becomes release-eligible, the payment flow can route an agreed repayment amount first and send the remaining milestone proceeds to the contractor.

## Whitepaper Placement

This idea should appear in whitepaper v1.2 after the SmartContractor project-contract and milestone sections, before token economics.

Recommended placement:

- Part 1: SmartContractor Platform - explain accepted bid to signed project contract.
- Part 2: Trust Infrastructure - explain contractor verification, reputation, risk scoring, evidence, milestones, and dispute pause.
- Part 3: Settlement And Tokenized Construction Network - explain future contract-backed working-capital routing, escrow-ready milestone repayment, stablecoin settlement roadmap, and tokenized construction agreement logic.

Do not present this as a crypto feature first. Present it as construction finance infrastructure that reduces risky upfront deposits.

## Safe Whitepaper Language

Preferred:

- signed project contract;
- contract-backed working-capital eligibility;
- receivables-based underwriting;
- milestone receivables;
- escrow-ready repayment routing;
- lender/provider-reviewed working capital;
- risk-scored contractor credit;
- payment waterfall;
- repayment-first milestone routing;
- homeowner deposit reduction.

Review-required:

- collateral;
- legally enforceable assignment of receivables;
- lien;
- loan approval;
- escrow account;
- real lender integration;
- stablecoin repayment;
- token collateral;
- insured repayment;
- guaranteed repayment.

Blocked:

- signed contracts are legal collateral today;
- every signed project contract can receive a loan;
- contractor credit is guaranteed;
- milestone repayment is legally enforceable without lender/provider/legal approval;
- real loans are live;
- real escrow is live;
- stablecoin settlement is live;
- token collateral is live;
- homeowners are risk-free;
- lenders have guaranteed repayment.

## Product Flow

### Step 1: Contract Creation

An accepted bid becomes a signed SmartContractor project contract with:

- homeowner/property owner identity;
- contractor identity;
- scope;
- contract value;
- milestone schedule;
- evidence requirements;
- approval roles;
- dispute route;
- payment schedule.

### Step 2: Loan Eligibility Review

The contractor may request working capital tied to the signed project contract. The system evaluates:

- verified contractor profile;
- license and insurance status;
- project contract value;
- milestone amount and timing;
- contractor reputation;
- dispute history;
- bid accuracy;
- prior repayment history;
- evidence quality;
- homeowner/project risk.

### Step 3: Provider Approval

A future lender, finance partner, or regulated provider decides whether to approve funds. GCSC can provide structured project data, risk scoring, and audit trail, but should not claim autonomous legal loan approval.

### Step 4: Milestone Completion

The contractor completes work and uploads evidence. AI-assisted verification, human review, inspector review, or admin review may support the milestone decision.

### Step 5: Repayment Waterfall

After a milestone is approved and payment becomes release-eligible:

1. required fees or provider charges are calculated;
2. agreed loan repayment amount is routed first;
3. remaining milestone proceeds go to the contractor;
4. audit events record repayment, release, dispute state, and remaining balance.

## Smart Contract Implication

The future smart contract or settlement workflow should model:

- project contract id;
- lender/provider id;
- loan id;
- milestone id;
- principal amount;
- repayment cap;
- repayment priority;
- repayment percentage or fixed amount;
- release eligibility;
- dispute pause;
- repayment event;
- contractor net payout event;
- audit hash/reference.

This is a payment waterfall design, not a live legal lending system.

## Legal And Provider Boundary

Before public or real use, this concept requires:

- attorney review;
- lender/provider review;
- escrow/payment provider review;
- jurisdiction review;
- consumer protection review;
- borrower disclosure review;
- repayment authorization review;
- data/privacy review;
- founder approval.

No autonomous process may activate real loans, real escrow, real repayment routing, token collateral, liens, assignments of receivables, or stablecoin settlement without those approvals.

## Required Checks Before Public Use

- `npm run check:whitepaper-v1-2-contract-backed-loan-addendum`
- `npm run check:whitepaper-v1-2-smart-contract-architecture`
- `npm run check:whitepaper-v1-2-claim-review`
- `npm run check:whitepaper-v1-2-terms-glossary`
- `npm run check:whitepaper-v1-2-public-edit-queue`
- `npm run check`
