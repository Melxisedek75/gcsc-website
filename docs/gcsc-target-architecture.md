# GCSC Target Architecture

Date: 2026-05-03

## Purpose

This document defines what must be included in the GCSC and SmartContractor architecture before the project grows too far.

Goal:

- avoid rewriting backend, smart contracts, database, mobile apps, and whitepaper later;
- keep marketplace, loans, payments, disputes, AI agents, and token economy connected;
- make every new feature fit into one stable product model.

## Comparable Product Lessons

### Upwork

Lesson:

- fixed-price projects are built around funded milestones;
- work is submitted for review before funds are released;
- disputes need deadlines, evidence, and a clear resolution path.

GCSC decision:

- every construction project must be milestone-based;
- each milestone must have status, evidence, inspection, payment readiness, dispute window, and release rules;
- contractor credit repayment should be connected to milestone payments.

Source:

- https://support.upwork.com/hc/en-us/articles/211062568-How-Upwork-protects-your-payments
- https://support.upwork.com/hc/en-us/articles/211062068-Respond-to-an-escrow-dispute

### Procore

Lesson:

- construction payments are not just checkout;
- payment decisions depend on project documents, compliance, invoices, insurance, lien waivers, and payment readiness.

GCSC decision:

- build a construction-specific payment readiness layer, not a generic checkout page;
- add lien waiver, insurance, license, inspection, and project document states before public launch.

Source:

- https://www.procore.com/pay
- https://support.procore.com/products/online/user-guide/company-level/payments

### Stripe Connect

Lesson:

- marketplaces need onboarding, verification, payouts, platform fees, refunds, chargebacks, tax reporting, and multi-party money movement.

GCSC decision:

- payment providers must be adapters behind one payment router;
- GCSC should never store raw credit card numbers;
- store provider references, payment intent IDs, status, amount, purpose, and receipt/transaction hashes.

Source:

- https://stripe.com/us/connect
- https://stripe.com/us/connect/features

### Metal Pay Connect and Metallicus

Lesson:

- Metal Pay Connect uses backend-generated HMAC signatures and API keys;
- production integration requires partner/API credentials and likely Metallicus approval.

GCSC decision:

- keep Metal Pay as a first-class payment provider;
- keep the secret key server-side only;
- expose only a backend signature endpoint to the frontend.

Source:

- https://connect-docs.metalpay.com/docs/getting-started
- https://connect-docs.metalpay.com/docs/authentication-flow
- https://www.metallicus.com/blog/metallicus-launches-metal-pay-api

### Plaid and Stripe Identity

Lesson:

- credit, payments, and fraud prevention need identity, bank-account ownership, income/assets, and document verification.

GCSC decision:

- build verification as a modular provider layer;
- do not hard-code one identity vendor into the core user model;
- store verification result/status, not sensitive raw documents.

Source:

- https://plaid.com/docs/identity/
- https://plaid.com/docs/assets/
- https://stripe.com/identity

## Target Architecture Map

```mermaid
flowchart TD
  "Users" --> "Identity And Verification"
  "Identity And Verification" --> "Profiles And Roles"
  "Profiles And Roles" --> "Jobs And Milestones"
  "Jobs And Milestones" --> "Bids Marketplace"
  "Bids Marketplace" --> "Project Contract"
  "Project Contract" --> "Payment Router"
  "Project Contract" --> "Escrow And Release Ledger"
  "Payment Router" --> "Cards / ACH / PayPal"
  "Payment Router" --> "Metal Pay / XPR / Crypto"
  "Escrow And Release Ledger" --> "Loan Repayment"
  "Loan Repayment" --> "Contractor Credit Engine"
  "Jobs And Milestones" --> "Evidence And Inspections"
  "Evidence And Inspections" --> "Dispute Center"
  "Dispute Center" --> "Peer Review"
  "Peer Review" --> "Reputation And Rewards"
  "Reputation And Rewards" --> "Token Economy"
  "All Events" --> "Audit Ledger"
  "Audit Ledger" --> "AI Agents"
  "AI Agents" --> "Risk / Matching / Compliance / Treasury"
```

## Core Domain Modules

### 1. Identity And Verification

Why:

- every contractor loan, bid, payout, and dispute depends on verified identity.

Must include:

- user profile;
- role: homeowner, contractor, worker, inspector, peer reviewer, admin, DAO member;
- email/phone verification;
- wallet address;
- business identity: EIN, UBI, license number, insurance status;
- verification provider references;
- verification status and expiration dates.

Do not store:

- raw SSN;
- raw credit card numbers;
- raw identity documents unless encrypted storage and legal policy are ready.

### 2. Jobs And Milestones

Why:

- construction payments should be released by milestone, not as a vague one-time job payment.

Must include:

- job;
- scope of work;
- location;
- budget;
- attachments;
- milestone list;
- milestone amount;
- expected start/end dates;
- required permits;
- inspection status;
- payment readiness status.

### 3. Bids Marketplace

Why:

- contractors need open jobs, competitive bids, and paid lead visibility.

Must include:

- bid amount;
- timeline;
- contractor qualifications;
- bid message;
- bid status;
- paid competitor-bid unlock;
- lead purchase/refund policy;
- anti-spam and duplicate bid checks.

### 4. Project Contract Layer

Why:

- the platform needs one object that connects job, homeowner, contractor, milestones, payments, disputes, and loans.

Must include:

- accepted bid;
- signed agreement reference;
- homeowner;
- contractor;
- milestone schedule;
- change orders;
- payment terms;
- dispute window;
- lien waiver requirements;
- termination rules.

### 5. Payment Router

Why:

- GCSC must support cards, debit, ACH, XPR, GCSC, GCST, Metal Pay, stablecoins, and future providers without rewriting workflows.

Must include:

- provider registry;
- payment intent;
- provider reference ID;
- purpose: lead, membership, milestone, loan repayment, collateral, dispute reward;
- status: created, pending, paid, failed, refunded, disputed;
- webhook handler;
- idempotency key;
- audit event.

Providers:

- XPR Network / WebAuth;
- Metal Pay Connect;
- Stripe;
- PayPal Pay with Crypto;
- Coinbase Commerce;
- BTCPay Server;
- future ACH/open-banking provider such as Dwolla or Plaid-compatible rails.

### 6. Escrow And Release Ledger

Why:

- homeowners need protection, contractors need payment certainty, and lenders need repayment order.

Must include:

- funded milestone;
- pending release;
- partial release;
- hold;
- refund;
- dispute hold;
- loan-first repayment waterfall;
- remaining payout to contractor;
- platform fee;
- token burn/buyback allocation.

Important:

- if regulated escrow is required, use a licensed payment/escrow partner instead of pretending the platform is a bank.

### 7. Contractor Credit Engine

Why:

- contractor loans are central to the SmartContractor model.

Must include:

- starter loan eligibility;
- business verification;
- job-linked loan purpose;
- risk score;
- credit tier;
- credit limit;
- collateral value;
- token collateral;
- repayment history;
- dispute penalty;
- completed job bonus;
- default workflow.

Credit inputs:

- verified EIN/UBI/license;
- platform volume;
- completed jobs;
- ratings;
- dispute history;
- repayment history;
- token collateral;
- insurance/compliance status.

### 8. Token Collateral Layer

Why:

- future contractors should be able to use GCSC token holdings as collateral for larger loans.

Must include:

- token balance snapshot;
- collateral lock;
- loan-to-value ratio;
- oracle price source;
- margin warning;
- liquidation or repayment rule;
- unlock condition.

Must not include yet:

- automatic liquidation before legal, oracle, and smart contract design are reviewed.

### 9. Dispute Center

Why:

- construction work quality is subjective; disputes need evidence and independent review.

Must include:

- dispute case;
- claimant role;
- reason category;
- evidence;
- peer reviewer assignment;
- remote review;
- onsite inspection option;
- quality score;
- recommendation;
- resolution;
- effect on payment, rating, credit, and token reward.

### 10. Peer Review And Inspector Network

Why:

- GCSC can become stronger than generic marketplaces by using verified contractors to review work quality.

Must include:

- reviewer eligibility;
- conflict-of-interest check;
- review type: remote or onsite;
- reward amount;
- rating points;
- loan-score points;
- appeal process.

### 11. Reputation System

Why:

- loans, bid priority, homeowner trust, and peer review eligibility all depend on reputation.

Must include:

- public rating;
- private risk score;
- verification score;
- repayment score;
- dispute score;
- response-time score;
- bid accuracy score;
- peer-review contribution score.

Do not use one simple star rating for credit decisions.

### 12. Compliance And Documents

Why:

- construction has licenses, permits, insurance, lien waivers, change orders, inspections, and state-by-state rules.

Must include:

- document templates;
- signed document references;
- permit checklist;
- insurance certificate status;
- lien waiver status;
- change order flow;
- document audit trail.

### 13. AI Agents

Why:

- AI should not be a chat decoration; it should automate matching, compliance, risk, documents, and treasury.

Agents:

- Contractor Matching Agent;
- Risk Assessment Agent;
- Compliance Agent;
- Treasury Agent;
- Real Estate Agent;
- Dispute Triage Agent;
- Payment Routing Agent;
- Document Generation Agent.

Rule:

- AI recommends; critical money movement and legal actions require deterministic rules and human/admin approval.

### 14. Audit Ledger

Why:

- every payment, dispute, loan, score change, token reward, and admin action must be explainable.

Must include:

- actor;
- action;
- entity type;
- entity ID;
- old value;
- new value;
- timestamp;
- source: user, admin, API, AI agent, webhook, smart contract.

### 15. Admin And Risk Console

Why:

- before automation is trusted, humans need a control room.

Must include:

- users pending verification;
- loans pending review;
- disputes pending review;
- payment failures;
- suspicious activity;
- manual override with audit log;
- provider status.

### 16. Mobile And PWA Layer

Why:

- homeowners and contractors will use phones on job sites.

Must include:

- PWA install;
- responsive web app;
- offline draft mode for evidence;
- camera upload;
- push notifications;
- Android Capacitor shell;
- iOS Capacitor shell.

### 17. Smart Contracts

Why:

- blockchain should hold high-value settlement events and token/collateral rules, not every UI click.

Must include:

- token contract;
- membership contract;
- staking contract;
- treasury contract;
- loan ledger contract;
- collateral lock contract;
- milestone escrow/release contract;
- dispute reward contract.

Rule:

- start with database ledger for MVP;
- move finalized settlement and token logic on-chain after legal/security review.

## Database Groups To Lock Early

Lock these groups before large frontend expansion:

1. `profiles`, `contractors`, `homeowners`, `workers`, `admins`.
2. `verification_checks`, `business_documents`, `licenses`, `insurance_certificates`.
3. `jobs`, `milestones`, `change_orders`, `attachments`.
4. `bids`, `bid_unlocks`, `lead_purchases`, `lead_refunds`.
5. `project_contracts`, `contract_signatures`.
6. `payment_intents`, `payment_events`, `provider_webhooks`.
7. `escrow_ledger`, `milestone_releases`, `payouts`.
8. `contractor_loans`, `loan_repayments`, `credit_scores`.
9. `token_collateral_locks`, `token_price_snapshots`.
10. `disputes`, `dispute_evidence`, `dispute_reviews`, `inspections`.
11. `ratings`, `reputation_events`, `reviewer_rewards`.
12. `audit_events`, `notifications`, `admin_actions`.

## API Groups To Build

1. `/api/auth/*`
2. `/api/profiles/*`
3. `/api/verification/*`
4. `/api/jobs/*`
5. `/api/milestones/*`
6. `/api/bids/*`
7. `/api/contracts/*`
8. `/api/payments/*`
9. `/api/escrow/*`
10. `/api/loans/*`
11. `/api/collateral/*`
12. `/api/disputes/*`
13. `/api/reputation/*`
14. `/api/ai-agents/*`
15. `/api/admin/*`
16. `/api/webhooks/*`

## Step-By-Step Build Order

### Step 1: Freeze Core Domain Language

Do now:

- define `Job`, `Milestone`, `Bid`, `Project Contract`, `Payment Intent`, `Loan`, `Dispute`, `Review`, `Reputation Event`.

Why:

- if names keep changing, database, API, whitepaper, and smart contracts will drift.

### Step 2: Add Audit Events

Do next:

- create `audit_events`;
- write audit events for job, bid, loan, repayment, dispute, review, payment intent.

Why:

- this prevents black-box behavior and helps with disputes, investors, and compliance.

### Step 3: Add Payment Event Storage

Do next:

- create `payment_intents`;
- create `payment_events`;
- add webhook-ready status changes.

Why:

- payment providers cannot stay as temporary JSON responses.

### Step 4: Add Milestone Entity

Do next:

- create job milestones;
- connect milestones to payment intents, loan repayments, evidence, and disputes.

Why:

- construction workflow depends on progress payments, not only whole-job payments.

### Step 5: Add Project Contract Entity

Do after milestones:

- accepted bid becomes a project contract;
- contract owns milestones, change orders, payment rules, dispute windows.

Why:

- this is the central object that will later map to smart contracts.

### Step 6: Add Verification Layer

Do after contract flow works:

- verification checks for person, business, license, insurance, wallet, bank account.

Why:

- loan limits and payouts should not be based on self-reported information.

### Step 7: Add Credit Score Versioning

Do after verification:

- score snapshots;
- model version;
- inputs used;
- explanation;
- manual override.

Why:

- credit decisions must be explainable and reproducible.

### Step 8: Add Token Collateral Model

Do before larger loans:

- collateral lock record;
- token price snapshot;
- LTV rule;
- unlock/repay/default states.

Why:

- token-backed credit cannot be safely added as a simple loan field.

### Step 9: Add Admin Console

Do before public launch:

- pending verifications;
- pending disputes;
- pending loans;
- payment exceptions;
- provider status.

Why:

- automation without admin review is too risky for money, credit, and disputes.

### Step 10: Move Finalized Rules On-Chain

Do after MVP proves workflows:

- milestone escrow events;
- loan ledger;
- collateral locks;
- peer review rewards;
- token fee/burn allocations.

Why:

- putting unfinished business logic on-chain too early makes fixes expensive.

## Whitepaper Sections That Must Be Updated

1. SmartContractor marketplace architecture.
2. Milestone-based project contract model.
3. Contractor starter loan and credit tiers.
4. Token collateral for larger loans.
5. Multi-provider payment router.
6. Metal Pay and XPR Network integration.
7. Escrow/payment readiness and lien waiver model.
8. Dispute and peer-review reward model.
9. AI agent responsibilities and boundaries.
10. Legal/compliance disclaimers for loans, escrow, insurance, and token collateral.

## Do Not Build Yet

Avoid these until the architecture above is stable:

- fully automated real-money loan approval;
- automatic token collateral liquidation;
- storing credit card data;
- representing GCSC as a licensed lender, bank, or escrow company without legal review;
- promising guaranteed returns from token appreciation;
- sending sensitive user documents to AI models by default;
- irreversible smart contract deployment for unfinished business rules.

## Immediate Next Engineering Tasks

1. Add `audit_events`. DONE.
2. Add `payment_intents` and `payment_events` tables. DONE.
3. Add `milestones`. DONE.
4. Add `project_contracts`. DONE.
5. Add payment webhook skeletons. DONE.
6. Add verification provider abstraction. DONE.
7. Update whitepaper with this architecture.
