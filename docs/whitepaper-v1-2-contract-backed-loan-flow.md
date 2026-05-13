# GCSC Whitepaper v1.2 Contract-Backed Loan Flow

Status: internal founder-review flow draft only.

This document does not edit the published whitepaper, website, PDF, partner packet, grant packet, investor packet, deck, email, social post, or announcement. It is not legal advice, not lending approval, not escrow approval, not payment provider approval, not collateral approval, not approval to launch real loans, not approval to launch real escrow, not approval to launch real token collateral, and not approval to launch real repayment routing.

## Purpose

This flow turns the contract-backed loan addendum into a clear step-by-step operating model for future whitepaper v1.2 review.

The whitepaper should explain the idea as construction finance infrastructure:

- a signed SmartContractor project contract creates verified project receivables;
- the contractor may request working capital against those expected milestone receivables;
- provider-approved capital can help the contractor start work without a large homeowner upfront deposit;
- approved milestone payments can follow a repayment-first waterfall;
- all states remain reviewable, auditable, and paused during disputes.

## Flow Overview

1. Homeowner/property owner posts a project.
2. Contractor submits a bid.
3. Bid is accepted.
4. Accepted bid becomes a signed SmartContractor project contract.
5. Project contract creates milestones, evidence requirements, approval roles, dispute route, and expected receivables.
6. Contractor requests working capital against the signed project contract.
7. Risk engine prepares a recommendation from verification, reputation, repayment history, dispute history, milestone schedule, and project value.
8. Future lender/provider reviews and approves or rejects funding.
9. Contractor completes milestone work.
10. Evidence is uploaded.
11. AI-assisted verification and human/inspector/admin review produce a milestone decision.
12. If approved and undisputed, milestone payment becomes release-eligible.
13. Payment waterfall routes agreed repayment first.
14. Remaining net milestone proceeds go to contractor.
15. Audit ledger records repayment, payout, balance, dispute state, and evidence references.

## State Machine

| State | Meaning | Allowed Next States |
|-------|---------|---------------------|
| Draft Project | Project exists but no accepted bid | Bid Submitted, Cancelled |
| Bid Accepted | Homeowner/property owner selected contractor | Contract Signed, Cancelled |
| Contract Signed | Signed project contract and milestone schedule exist | Loan Requested, Work Started, Disputed |
| Loan Requested | Contractor asks for working capital tied to contract receivables | Risk Review, Withdrawn |
| Risk Review | System prepares risk and eligibility recommendation | Provider Review, Rejected |
| Provider Review | Future lender/provider reviews funding request | Loan Approved, Rejected, More Info Needed |
| Loan Approved | Provider-approved funds can be recorded as available in the workflow | Work Started, Disputed |
| Work Started | Contractor performs milestone work | Evidence Submitted, Disputed |
| Evidence Submitted | Photos, videos, invoices, inspection notes, or other proof uploaded | AI Review, Human Review, Disputed |
| AI Review | AI-assisted verification creates a recommendation only | Human Review, More Evidence Needed, Disputed |
| Human Review | Homeowner, inspector, peer reviewer, or admin reviews the milestone | Milestone Approved, More Evidence Needed, Disputed |
| Milestone Approved | Work is accepted under project rules | Release Eligible, Disputed |
| Release Eligible | Payment can enter the waterfall if no pause exists | Repayment Routed, Disputed |
| Repayment Routed | Agreed loan repayment is routed first | Contractor Net Paid, Balance Updated |
| Contractor Net Paid | Remaining milestone proceeds are paid to contractor | Next Milestone, Project Complete |
| Disputed | Payment release and repayment routing pause | Resolved, More Evidence Needed, Cancelled |
| Resolved | Dispute outcome is recorded | Release Eligible, Refund/Adjustment, Next Milestone |
| Project Complete | All milestones are closed | Archived |

## Payment Waterfall

For approved milestones only, the future settlement workflow can calculate:

1. milestone gross amount;
2. required provider/platform fees if approved;
3. agreed repayment amount;
4. remaining contractor net payout;
5. updated loan balance;
6. audit event references.

Example formula:

`milestone_gross - approved_fees - agreed_repayment = contractor_net_payout`

Safety boundary: this is a future waterfall design. It must not claim that repayment routing is live, legally enforceable, provider-approved, escrow-approved, or automatic without legal/provider/founder approval.

## Data Fields For Future Smart Contract Or Backend Model

- project_contract_id;
- contractor_profile_id;
- homeowner_profile_id;
- provider_id;
- loan_id;
- milestone_id;
- milestone_gross_amount;
- approved_fee_amount;
- agreed_repayment_amount;
- contractor_net_payout;
- remaining_loan_balance;
- release_eligibility_state;
- dispute_state;
- evidence_reference;
- approval_reference;
- audit_event_id.

## Whitepaper Wording

Preferred:

- signed project contract;
- expected milestone receivables;
- contract-backed working-capital eligibility;
- receivables-based underwriting;
- provider-reviewed funding;
- repayment-first payment waterfall;
- escrow-ready milestone routing;
- reduced upfront homeowner deposit risk;
- auditable contractor working capital.

Blocked:

- legal collateral is active today;
- loans are guaranteed;
- every signed contract qualifies;
- repayments are legally enforceable without lender/provider/legal approval;
- escrow repayment routing is live;
- stablecoin repayment is live;
- token collateral is active;
- homeowners have zero risk;
- lenders have guaranteed repayment;
- AI approves loans or releases payments automatically.

## Review Gates

Before public or real use, this flow requires:

- founder approval;
- attorney review;
- lender/provider review;
- escrow/payment provider review;
- borrower disclosure review;
- data/privacy review;
- repayment authorization review;
- jurisdiction review;
- technical security review.

No autonomous task may activate real lending, real escrow, real repayment routing, liens, receivable assignments, token collateral, stablecoin settlement, or production payment movement.

## Required Checks Before Public Use

- `npm run check:whitepaper-v1-2-contract-backed-loan-flow`
- `npm run check:whitepaper-v1-2-contract-backed-loan-addendum`
- `npm run check:whitepaper-v1-2-smart-contract-architecture`
- `npm run check:whitepaper-v1-2-claim-review`
- `npm run check`
