# GCSC Whitepaper v1.2 Contract-Backed Loan Repayment Waterfall Calculation Pseudocode

Status: LOCAL_ONLY_REPAYMENT_WATERFALL_CALCULATION_PSEUDOCODE

This document is not legal advice, not lending approval, not escrow approval, not payment-provider approval, not approval to launch real loans, not approval to launch real escrow, not approval to launch real repayment routing, not approval to launch stablecoin settlement, not approval to launch token collateral, and not approval to move real money.

## Purpose

This note converts the repayment waterfall fixture matrix into deterministic implementation pseudocode for local replay and engineering review. It defines calculation order, hold exits, capped outputs, and audit-event expectations before any code touches live loan, escrow, repayment, provider, stablecoin, token-collateral, or production money systems.

The output can only support `DRAFT_REPAYMENT_ALLOCATION`. It must not approve credit, originate loans, release escrow, route repayment, call providers, settle stablecoins, lock token collateral, mutate live balances, or move production money.

## Linked Inputs

- `docs/whitepaper-v1-2-contract-backed-loan-repayment-waterfall-fixture-matrix.md`
- `docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md`
- `docs/whitepaper-v1-2-contract-backed-loan-repayment-failure-state-matrix.md`
- `docs/whitepaper-v1-2-contract-backed-loan-technical-handoff.md`

## Deterministic Input Contract

The local calculation input must include:

- `project_contract_state`
- `milestone_state`
- `milestone_gross`
- `approved_platform_fees`
- `requested_repayment`
- `outstanding_balance`
- `milestone_repayment_cap`
- `retainage_holdback`
- `approved_change_order_amount`
- `disputed_work_amount`
- `provider_approval_state`
- `dispute_state`
- `blocked_live_gate_status`
- `audit_event`

All values are local draft values. No field is a provider approval, borrower obligation, live balance, real escrow amount, stablecoin settlement instruction, token collateral lock, or payment order.

## Calculation Order

The local implementation must process inputs in this order:

1. Normalize currency inputs and reject missing, negative, non-numeric, or unsupported precision values.
2. Reject missing provider/legal/payment terms before any repayment math.
3. Reject active or unresolved disputes before any release or repayment math.
4. Reject unapproved milestone evidence before any allocable amount is calculated.
5. Exclude retainage holdback from allocable amount until lien-waiver and jurisdiction review are complete.
6. Exclude pending, stale, unsigned, disputed, or over-budget change orders from receivables and caps.
7. Cap repayment at outstanding balance.
8. Cap repayment at milestone_repayment_cap.
9. Block negative contractor_net_payout.
10. Emit append-only audit_event with request ID, inputs, outputs, hold reason, fixture state, and blocked-live status.

## Pseudocode

```text
function calculateDraftRepaymentWaterfall(input):
  normalized = normalizeCurrencyInputs(input)
  if normalized.invalid:
    return hold("HOLD_FOR_INPUT_NORMALIZATION_REVIEW")

  if input.provider_approval_state is missing, expired, copied, unclear, or unreviewed:
    return hold("HOLD_FOR_PROVIDER_TERM_REVALIDATION")

  if input.dispute_state is active, unresolved, open-window, or contradictory:
    return hold("HOLD_FOR_DISPUTE_WINDOW_REVIEW")

  if input.milestone_state is not approved for local draft allocation:
    return hold("HOLD_FOR_OWNER_ACCEPTANCE_REVIEW")

  allocable_amount = input.milestone_gross
  allocable_amount = allocable_amount - input.disputed_work_amount

  if input.retainage_holdback is present and not fully cleared:
    allocable_amount = allocable_amount - input.retainage_holdback
    if allocable_amount is below zero:
      return hold("HOLD_FOR_RETAINAGE_LIEN_REVIEW")

  if input.approved_change_order_amount is pending, stale, unsigned, disputed, or over-budget:
    return hold("HOLD_FOR_CHANGE_ORDER_REVIEW")

  approved_loan_repayment = min(requested_repayment, outstanding_balance, milestone_repayment_cap, allocable_amount)
  contractor_net_payout = allocable_amount - approved_platform_fees - approved_loan_repayment

  if contractor_net_payout < 0:
    return hold("HOLD_FOR_NEGATIVE_CONTRACTOR_PAYOUT_REVIEW")

  return {
    fixture_state: "DRAFT_REPAYMENT_ALLOCATION",
    approved_loan_repayment,
    contractor_net_payout,
    blocked_live_gate_status: "BLOCKED_FOR_LIVE",
    audit_event: appendOnlyAuditEvent(input, approved_loan_repayment, contractor_net_payout)
  }
```

## Required Outputs

The local result must include:

- `fixture_state`: `DRAFT_REPAYMENT_ALLOCATION` or a hold state.
- `approved_loan_repayment`: capped by requested repayment, outstanding balance, milestone cap, and allocable amount.
- `contractor_net_payout`: never below zero.
- `hold_reason`: present for every rejected or blocked calculation.
- `blocked_live_gate_status`: `BLOCKED_FOR_LIVE` or stricter.
- `audit_event`: append-only local audit event with request ID, inputs, outputs, hold reason, fixture state, and blocked-live status.

## Failure And Hold Mapping

| Fixture Or Condition | Required Local Result |
| --- | --- |
| WATERFALL_CAPS_REPAYMENT_AT_OUTSTANDING_BALANCE | Cap `approved_loan_repayment` at `outstanding_balance`. |
| WATERFALL_CAPS_REPAYMENT_AT_MILESTONE_LIMIT | Cap `approved_loan_repayment` at `milestone_repayment_cap`. |
| WATERFALL_BLOCKS_NEGATIVE_CONTRACTOR_PAYOUT | Return `HOLD_FOR_NEGATIVE_CONTRACTOR_PAYOUT_REVIEW`. |
| WATERFALL_BLOCKS_ACTIVE_DISPUTE | Return `HOLD_FOR_DISPUTE_WINDOW_REVIEW`. |
| WATERFALL_BLOCKS_UNAPPROVED_MILESTONE | Return `HOLD_FOR_OWNER_ACCEPTANCE_REVIEW`. |
| WATERFALL_BLOCKS_MISSING_PROVIDER_TERMS | Return `HOLD_FOR_PROVIDER_TERM_REVALIDATION`. |
| WATERFALL_BLOCKS_TOKEN_COLLATERAL_OR_STABLECOIN_ROUTE | Return `LIVE_TOKEN_COLLATERAL_BLOCKED` and `LIVE_STABLECOIN_SETTLEMENT_BLOCKED`. |
| WATERFALL_RETAINAGE_HOLDBACK_DRAFT | Return local retainage hold or reduce allocable amount. |
| WATERFALL_CHANGE_ORDER_DRAFT | Return `HOLD_FOR_CHANGE_ORDER_REVIEW` or exclude pending change-order value. |

The required blocked gate set is:

- BLOCKED_FOR_LIVE
- LIVE_REPAYMENT_ROUTING_BLOCKED
- LIVE_ESCROW_CUSTODY_BLOCKED
- LIVE_STABLECOIN_SETTLEMENT_BLOCKED
- LIVE_TOKEN_COLLATERAL_BLOCKED
- AI_FINAL_APPROVAL_BLOCKED

## Blocked Live Actions

The pseudocode blocks:

- real loan origination
- real escrow
- real repayment routing
- provider API calls
- stablecoin settlement
- token collateral
- production money movement

## Required Checks

- `npm run check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-calculation-pseudocode`
- `npm run check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-fixture-matrix`
- `npm run check:whitepaper-v1-2-contract-backed-loan-technical-requirements`
- `npm run check:whitepaper-v1-2-contract-backed-loan-repayment-failure-state-matrix`
- `npm run check`

## Acceptance Check

This pseudocode passes when every local calculation path has ordered input normalization, provider-term hold exits, dispute hold exits, milestone approval gates, retainage handling, change-order handling, capped repayment math, non-negative contractor payout enforcement, blocked-live status, and append-only audit events without enabling real loans, escrow, repayment routing, provider API calls, stablecoin settlement, token collateral, or production money movement.
