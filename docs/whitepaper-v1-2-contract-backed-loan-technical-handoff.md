# GCSC Whitepaper v1.2 Contract-Backed Loan Technical Handoff

Status: internal technical handoff only. This is not legal advice, not approval to launch real loans, not approval to launch real escrow, not approval to launch token collateral, not approval to launch repayment routing, and not approval to publish public wording. The public whitepaper remains unchanged until founder, legal/provider, finance-provider, technical, claim-review, excerpt, and public-use gates approve exact text.

## Purpose

This handoff defines what the engineering design must prove before contract-backed working-capital language can move from internal whitepaper review toward implementation planning. It focuses on data model, API boundaries, ownership, audit trail, milestone payment controls, dispute pause, provider adapters, AI review boundaries, and no-real-money safety gates.

## Technical Review Areas

| Area | Required Review |
|------|-----------------|
| Project contract record | Signed homeowner/contractor contract must be represented as a project contract with owner IDs, contractor IDs, milestone IDs, status, and audit events |
| Eligibility record | Working-capital eligibility must be a reviewable record, not automatic loan approval |
| Provider adapter | Any lender, escrow, payment, stablecoin, or servicing provider must sit behind an adapter with disabled-by-default live mode |
| Repayment waterfall | Milestone proceeds can only model repayment-first routing in draft state until provider/legal approval exists |
| Ownership and RLS | Homeowner, contractor, admin, provider, and backend-only data must remain separated by strict ownership rules before public beta |
| Auditability | Every eligibility, review, approval, hold, rejection, dispute pause, and payment-intent event needs request ID and audit ledger coverage |
| Dispute pause | Dispute state must pause repayment routing and contractor release until review outcome is recorded |
| AI boundary | AI can assist evidence and milestone review only; it cannot approve loans, release payment, or act as final judge |

## Required Technical Answers

Before implementation planning, record non-secret answers for:

- proposed database tables and fields;
- API endpoints and request/response boundaries;
- backend-only tables;
- RLS ownership policies;
- provider adapter states;
- payment-intent and audit-event linkage;
- milestone approval and dispute-pause state machine;
- repayment waterfall draft states;
- AI recommendation fields and human override fields;
- exact public wording that must stay blocked until implementation matches the claim.

## Blocked Until Technical Review

Do not implement live:

- real loan origination;
- real escrow;
- stablecoin settlement;
- token collateral;
- repayment routing;
- provider API calls;
- borrower underwriting decisions;
- AI final approval;
- AI payment release;
- production money movement.

## Required Checks

Run these checks after any technical handoff update:

- `npm run check:whitepaper-v1-2-contract-backed-loan-technical-handoff`
- `npm run check:whitepaper-v1-2-contract-backed-loan-finance-provider-handoff`
- `npm run check:whitepaper-v1-2-contract-backed-loan-legal-provider-handoff`
- `npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate`
- `npm run check`

If any check fails, the technical handoff remains internal draft only.
