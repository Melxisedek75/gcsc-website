# GCSC Whitepaper v1.2 Contract-Backed Loan Implementation Approval Index

Status: internal approval index only. This is not legal advice, not approval to launch real loans, not approval to launch real escrow, not approval to launch stablecoin settlement, not approval to launch token collateral, not approval to launch repayment routing, and not approval to publish public wording.

## Purpose

This index defines the approval order for the signed-contract working-capital concept before it can move from internal whitepaper planning to public wording, no-real-money implementation planning, or any future live provider integration. It ties the readiness matrix and blocker register to one explicit approval path.

## Approval Order

| Step | Approval Gate | Required Evidence | Output |
|------|---------------|-------------------|--------|
| 1 | Founder scope approval | Founder confirms concept scope, excluded claims, and preferred placement | Internal scope can move to reviewer packets |
| 2 | Legal/provider review | Attorney/provider reviews receivables, lending, escrow, stablecoin, token collateral, AI, and public claims | Allowed terms, blocked terms, and required disclaimers |
| 3 | Finance-provider review | Finance provider reviews eligibility, underwriting, repayment waterfall, disclosures, servicing, and role boundaries | Provider-approved finance model or hold/reject decision |
| 4 | Technical no-real-money design review | Engineering reviews schema, APIs, ownership/RLS, audit events, dispute pause, provider adapters, and AI boundaries | Draft implementation plan without live money movement |
| 5 | Claim and public wording review | Founder, legal/provider, finance-provider, and claim-review gates approve exact sentences | Approved or blocked public wording |
| 6 | Public-use gate | Public-use gate confirms all required approvals and checks are present | Public wording can be used only if explicitly approved |
| 7 | Future live integration gate | Founder, legal/provider, finance-provider, payment/escrow provider, security, Auth/RLS, and production checks pass | Live implementation can be planned outside autonomous mode |

## Required Approval Evidence

- approval date;
- reviewer role;
- reviewed document or sentence ID;
- decision: APPROVED, REVISION REQUIRED, REJECTED, or HOLD;
- exact allowed wording if any;
- exact blocked wording if any;
- required disclaimers;
- technical constraints;
- public-use status;
- no-real-money or live-risk boundary.

## Current Default Decision

Until all approval gates are cleared, the default decision is HOLD.

HOLD means:

- no public whitepaper wording;
- no live loan origination;
- no real escrow;
- no stablecoin settlement;
- no token collateral;
- no repayment routing;
- no provider API calls;
- no borrower underwriting decisions;
- no AI final approval;
- no AI payment release;
- no production money movement.

## Required Linked Files

- `docs/whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix.md`
- `docs/whitepaper-v1-2-contract-backed-loan-implementation-blocker-register.md`
- `docs/whitepaper-v1-2-contract-backed-loan-approval-routing-checklist.md`
- `docs/whitepaper-v1-2-contract-backed-loan-public-use-gate.md`
- `docs/whitepaper-v1-2-claim-review-matrix.md`

## Required Checks

- `npm run check:whitepaper-v1-2-contract-backed-loan-implementation-approval-index`
- `npm run check:whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix`
- `npm run check:whitepaper-v1-2-contract-backed-loan-implementation-blocker-register`
- `npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate`
- `npm run check`

If any check fails, this approval index remains internal draft only.
