# GCSC Whitepaper v1.2 Contract-Backed Loan Approval Evidence Template

Status: internal approval evidence template only. This is not legal advice, not approval to launch real loans, not approval to launch real escrow, not approval to launch stablecoin settlement, not approval to launch token collateral, not approval to launch repayment routing, and not approval to publish public wording.

## Purpose

This template records non-secret approval evidence for the signed-contract working-capital concept. It is designed to support the approval index without turning any review note into public wording, live lending, escrow, repayment routing, stablecoin settlement, token collateral, or AI payment-release authority.

## Evidence Record

| Field | Entry |
|-------|-------|
| Evidence ID | TBD |
| Date | TBD |
| Reviewer role | Founder, legal/provider, finance-provider, technical, claim-review, public-use, or future live-integration reviewer |
| Related file or sentence ID | TBD |
| Reviewed topic | Founder scope, receivables, lending, escrow, stablecoin, token collateral, repayment routing, AI boundary, public wording, Auth/RLS, payment provider, or technical design |
| Decision | APPROVED, REVISION REQUIRED, REJECTED, or HOLD |
| Approved wording, if any | TBD |
| Blocked wording, if any | TBD |
| Required disclaimer | TBD |
| Technical constraint | TBD |
| Provider/legal constraint | TBD |
| Public-use status | BLOCKED unless explicitly approved |
| Live-use status | BLOCKED unless explicitly approved outside autonomous mode |
| Follow-up owner | TBD |
| Follow-up due state | TBD |

## Required Safe Evidence Rules

- do not record passwords, private keys, seed phrases, service-role keys, API keys, raw database URLs, access tokens, or payment credentials;
- do not record private borrower data, bank account details, wallet seed phrases, tax IDs, or unredacted identity documents;
- keep reviewer notes concise and non-secret;
- keep exact public wording blocked unless the public-use gate approves it;
- keep live implementation blocked unless founder, legal/provider, finance-provider, technical, security, Auth/RLS, payment/escrow provider, and production gates approve it.

## Default HOLD Rules

If any evidence field is missing or unclear, the decision remains HOLD.

HOLD blocks:

- public whitepaper wording;
- live loan origination;
- real escrow;
- stablecoin settlement;
- token collateral;
- repayment routing;
- provider API calls;
- borrower underwriting decisions;
- AI final approval;
- AI payment release;
- production money movement.

## Required Linked Files

- `docs/whitepaper-v1-2-contract-backed-loan-implementation-approval-index.md`
- `docs/whitepaper-v1-2-contract-backed-loan-implementation-blocker-register.md`
- `docs/whitepaper-v1-2-contract-backed-loan-public-use-gate.md`
- `docs/whitepaper-v1-2-contract-backed-loan-exact-sentence-register.md`

## Required Checks

- `npm run check:whitepaper-v1-2-contract-backed-loan-approval-evidence-template`
- `npm run check:whitepaper-v1-2-contract-backed-loan-implementation-approval-index`
- `npm run check:whitepaper-v1-2-contract-backed-loan-implementation-blocker-register`
- `npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate`
- `npm run check`

If any check fails, this approval evidence template remains internal draft only.
