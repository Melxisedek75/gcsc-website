# SmartContractor Legal And Financial Review Checklist

Date: 2026-05-04

This is not legal advice. It is an engineering and founder review checklist for attorney, compliance, payment, and lending conversations before SmartContractor handles real money.

## Why This Matters

SmartContractor touches several regulated or sensitive areas:

- contractor working-capital loans;
- milestone payments;
- escrow-like payment holds;
- payment routing;
- token collateral;
- dispute resolution;
- identity/business verification;
- contractor ratings and credit decisions.

The MVP can simulate these safely. Public real-money launch needs attorney/payment-provider review.

## Review Area 1: Contractor Starter Loans

Questions for attorney/compliance review:

1. Is GCSC acting as lender, broker, marketplace, servicer, or software provider?
2. Which licenses are required in the launch state?
3. Can loans be offered to business entities only, not consumers?
4. What disclosures must contractors sign before requesting credit?
5. What APR/fee language is legally safe?
6. What collection/default process is allowed?
7. Can milestone payments be contractually applied to loan repayment first?
8. What data can be used for credit/risk scoring?
9. What adverse-action or credit-decision notices are required?
10. What records must be retained for audit?

Engineering implication:

- keep loans as `requested`/simulated until legal model is approved;
- keep approval/funding backend/admin controlled;
- log every loan decision in `audit_events`;
- keep AI as recommendation only.

## Review Area 2: Escrow And Milestone Payments

Questions:

1. Are milestone holds considered escrow, money transmission, stored value, or marketplace payment processing?
2. Can GCSC hold funds directly, or must a licensed provider hold funds?
3. Which provider can support milestone release, refunds, disputes, and split payouts?
4. What terms must homeowners and contractors accept?
5. What are the dispute deadlines?
6. What happens if work is partially accepted?
7. What happens if a project is cancelled?

Engineering implication:

- use `payment_intents`, `milestones`, and ledger records first;
- do not claim regulated escrow unless a licensed partner supports it;
- use provider references and audit events instead of storing card/bank data.

## Review Area 3: Token Collateral

Questions:

1. Can GCSC tokens be accepted as business collateral?
2. Is token collateral considered securities-related, lending-related, or money transmission activity?
3. What disclosures are required about token price volatility?
4. Can collateral be locked on-chain?
5. Who controls liquidation or release?
6. Is automatic liquidation allowed?
7. What oracle/source can be used for token price?

Engineering implication:

- token collateral remains proposed/manual until reviewed;
- no automatic liquidation in MVP;
- store price snapshots and LTV rules for review;
- make final collateral movement a smart-contract module only after legal/security review.

## Review Area 4: Contractor Business-Control Language

Founder idea:

- if a new contractor receives starter credit tied to business identity, there may be stronger contractual commitments while the loan is outstanding.

Legal questions:

1. Can the platform take any ownership, lien, assignment, UCC filing, security interest, or control right over the contractor's business?
2. What is legally enforceable for a small business loan?
3. What language is too aggressive or unenforceable?
4. What must be disclosed clearly before signing?
5. What happens after repayment?
6. What happens after default?

Engineering implication:

- do not implement ownership transfer language in production forms yet;
- represent this as attorney-review-only contract language;
- if approved, store signed document reference, not just a checkbox.

## Review Area 5: Identity, KYB, License, Insurance

Questions:

1. Which checks are mandatory before bidding?
2. Which checks are mandatory before receiving a loan?
3. Which checks are mandatory before receiving payouts?
4. Which providers can verify EIN/UBI, license, insurance, identity, bank account, sanctions, and business status?
5. How long can verification evidence be stored?
6. What user consent is required?

Engineering implication:

- keep provider-agnostic `verification_checks`;
- store status, provider reference, confidence, expiration;
- avoid storing raw sensitive documents until encrypted storage and retention policy are ready.

## Review Area 6: AI Risk Scoring

Questions:

1. Can AI be used in contractor credit recommendations?
2. What inputs are allowed?
3. What explanation must be shown?
4. Is human review required for rejection or lower limit?
5. What bias/fairness testing is required?
6. What logs must be retained?

Engineering implication:

- AI should recommend, not approve;
- store risk score version, input categories, explanation, and admin decision;
- keep manual override and audit log.

## Review Area 7: Payment Providers

Provider review:

- Metal Pay Connect;
- Stripe Connect;
- PayPal;
- Coinbase Commerce;
- BTCPay;
- XPR/WebAuth;
- future ACH/open-banking partner.

Questions:

1. Which providers support marketplace payouts?
2. Which support split payments and platform fees?
3. Which support disputes/refunds?
4. Which support crypto and fiat legally for US users?
5. Which require business verification before production?
6. Which are free enough for MVP testing?

Engineering implication:

- keep payment provider adapter pattern;
- keep provider secrets server-side;
- do not enable production payments until provider terms are reviewed.

## Founder Review Packet

Before speaking with attorney/payment partners, prepare:

1. one-page GCSC/SmartContractor summary;
2. user flow diagram;
3. loan flow diagram;
4. milestone payment flow diagram;
5. dispute flow diagram;
6. token collateral concept note;
7. current database table map;
8. public beta scope with real-money features disabled.

## Current Recommendation

For the first public beta:

- allow onboarding, jobs, bids, disputes, peer review, admin review, and simulated credit;
- keep real loans disabled;
- keep real escrow disabled;
- keep token collateral disabled;
- keep provider payments in test/sandbox until terms and compliance are reviewed.

