# GCSC Whitepaper v1.2 Contract-Backed Loan Repayment Waterfall Fixture Matrix

Status: LOCAL_ONLY_REPAYMENT_WATERFALL_FIXTURE_MATRIX

This document is not legal advice, not lending approval, not escrow approval, not payment-provider approval, not approval to launch real loans, not approval to launch real escrow, not approval to launch real repayment routing, not approval to launch stablecoin settlement, not approval to launch token collateral, and not approval to move real money.

## Purpose

This matrix turns the contract-backed loan repayment-first waterfall into explicit local-only fixtures for implementation planning and replay tests. It defines the minimum scenarios that must be modeled before local implementation can claim coverage for repayment allocation math, dispute holds, provider-term holds, retainage, change orders, and blocked-live gates.

The matrix can only support `DRAFT_REPAYMENT_ALLOCATION` review. It must not originate loans, release escrow, route repayments, call provider APIs, settle stablecoins, lock token collateral, mutate live balances, approve credit, or move production money.

## Linked Inputs

- `docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md`
- `docs/whitepaper-v1-2-contract-backed-loan-repayment-failure-state-matrix.md`
- `docs/whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix.md`
- `docs/whitepaper-v1-2-contract-backed-loan-implementation-blocker-register.md`
- `docs/whitepaper-v1-2-contract-backed-loan-approval-evidence-template.md`
- `docs/whitepaper-v1-2-contract-backed-loan-technical-handoff.md`

## Fixture Fields

Each fixture must record:

- `fixture_id`: stable local fixture identifier.
- `fixture_state`: one local-only fixture state.
- `project_contract_state`: signed, draft, disputed, missing, stale, or blocked project-contract state.
- `milestone_state`: approved, unapproved, partial, disputed, stale, or holdback state.
- `milestone_gross`: local draft milestone amount.
- `approved_platform_fees`: locally approved draft fee amount.
- `requested_repayment`: requested draft repayment amount.
- `outstanding_balance`: local draft outstanding balance before allocation.
- `milestone_repayment_cap`: local draft cap for this milestone.
- `approved_loan_repayment`: calculated draft repayment after caps and holds.
- `contractor_net_payout`: calculated draft contractor payout after fees and repayment.
- `dispute_state`: no dispute, active dispute, partial dispute, expired window, or unresolved evidence state.
- `provider_approval_state`: provider/legal/payment terms state.
- `blocked_live_gate_status`: `BLOCKED_FOR_LIVE` or stricter.
- `audit_event_expectation`: required append-only audit event for inputs, outputs, request ID, and blocked-live status.

## Required Fixtures

| Fixture | Required Result | Live Boundary |
| --- | --- | --- |
| WATERFALL_HAPPY_PATH_DRAFT | Calculates `DRAFT_REPAYMENT_ALLOCATION` while still returning `BLOCKED_FOR_LIVE`. | No real loan origination, escrow release, provider transfer, or money movement. |
| WATERFALL_CAPS_REPAYMENT_AT_OUTSTANDING_BALANCE | Caps `approved_loan_repayment` at `outstanding_balance`. | No live outstanding-balance mutation. |
| WATERFALL_CAPS_REPAYMENT_AT_MILESTONE_LIMIT | Caps `approved_loan_repayment` at `milestone_repayment_cap`. | No repayment routing above approved milestone terms. |
| WATERFALL_BLOCKS_NEGATIVE_CONTRACTOR_PAYOUT | Holds calculation if fees plus repayment would make `contractor_net_payout` negative. | No fee charge, repayment routing, or provider transfer. |
| WATERFALL_BLOCKS_ACTIVE_DISPUTE | Returns hold state when `dispute_state` is active or unresolved. | No release, repayment routing, or AI final approval. |
| WATERFALL_BLOCKS_UNAPPROVED_MILESTONE | Returns hold state when milestone approval or release eligibility is missing. | No escrow release or repayment allocation. |
| WATERFALL_BLOCKS_MISSING_PROVIDER_TERMS | Returns provider/legal/payment hold when terms are missing, expired, copied, or unclear. | No provider API calls or borrower obligation. |
| WATERFALL_BLOCKS_TOKEN_COLLATERAL_OR_STABLECOIN_ROUTE | Returns hold when repayment depends on token collateral, oracle value, stablecoin route, lock, margin, or liquidation state. | No stablecoin settlement, token collateral, oracle reliance, margin call, or liquidation. |
| WATERFALL_RETAINAGE_HOLDBACK_DRAFT | Excludes retainage and lien-waiver holdback from allocable amount until review is complete. | No lien waiver, escrow release, route repayment, or legal rights change. |
| WATERFALL_CHANGE_ORDER_DRAFT | Excludes pending, stale, unsigned, disputed, or over-budget change-order amounts from receivables and caps. | No live contract amendment, increased principal, increased collateral value, or provider obligation. |

## Waterfall Invariants

Every fixture must enforce:

- approved_loan_repayment must never exceed outstanding balance.
- approved_loan_repayment must never exceed the milestone-level repayment cap.
- contractor_net_payout must never be negative.
- no repayment routing while disputed.
- no release before milestone approval.
- no repayment without provider/legal/payment terms.
- every calculation must emit an audit_event with request ID, inputs, outputs, fixture state, and blocked-live flag.

The required blocked gate set is:

- BLOCKED_FOR_LIVE
- LIVE_REPAYMENT_ROUTING_BLOCKED
- LIVE_ESCROW_CUSTODY_BLOCKED
- LIVE_STABLECOIN_SETTLEMENT_BLOCKED
- LIVE_TOKEN_COLLATERAL_BLOCKED
- AI_FINAL_APPROVAL_BLOCKED

## Blocked Live Actions

The following actions remain blocked by every fixture:

- real loan origination
- real escrow
- real repayment routing
- provider API calls
- stablecoin settlement
- token collateral
- production money movement

## Required Checks

- `npm run check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-fixture-matrix`
- `npm run check:whitepaper-v1-2-contract-backed-loan-technical-requirements`
- `npm run check:whitepaper-v1-2-contract-backed-loan-repayment-failure-state-matrix`
- `npm run check:whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix`
- `npm run check:whitepaper-v1-2-contract-backed-loan-implementation-blocker-register`
- `npm run check`

## Acceptance Check

This fixture matrix passes when local implementation planning has explicit fixture IDs, fixture states, project-contract states, milestone states, waterfall inputs, capped outputs, dispute states, provider approval states, blocked-live status, and audit event expectations for all required repayment waterfall paths without enabling real loans, escrow, repayment routing, provider API calls, stablecoin settlement, token collateral, or production money movement.
