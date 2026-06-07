# Repayment Waterfall Algorithm Spec

Date: 2026-06-06 PT

Status: LOCAL_REPAYMENT_WATERFALL_SPEC_ONLY

Purpose: define one deterministic local repayment waterfall algorithm for SmartContractor review packets, fake-data fixtures, and admin-only draft endpoints. This spec connects the existing smart-contract design docs, contract-backed loan docs, and local repayment waterfall helper without approving live money movement.

This spec does not approve live loans, loan origination, borrower obligations, real payments, real escrow, escrow release, contractor payout, repayment routing, stablecoin settlement, token collateral, token custody, provider API calls, legal conclusions, public claims, XPR signatures, XPR deployment, production release, or AI final authority.

## Source Documents

- `docs/smartcontractor-smart-contract-design.md`
- `docs/smartcontractor-smart-contract-state-machine.md`
- `docs/smartcontractor-smart-contract-action-register.md`
- `docs/smartcontractor-backend-to-chain-map.md`
- `docs/smartcontractor-loan-legal-risk-model.md`
- `docs/smartcontractor-smart-contract-test-fixtures.md`
- `docs/smart-contract-complete-boundary-matrix.md`
- `docs/smart-contract-deployment-blocker-spec.md`
- `docs/whitepaper-v1-2-contract-backed-loan-repayment-waterfall-fixture-matrix.md`
- `docs/whitepaper-v1-2-contract-backed-loan-repayment-waterfall-calculation-pseudocode.md`
- `docs/whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-contract.md`
- `construction-ai/src/smart-contracts/state/repaymentWaterfallDraft.mjs`
- `construction-ai/src/smart-contracts/replay/repaymentWaterfallDraftEndpointFixtures.mjs`

## Local Algorithm Inputs

These inputs are local labels or fake-data fixture values only. They must not contain real customer private data, payment instructions, provider credentials, wallet secrets, bank/card data, legal advice, or live repayment instructions.

| Input | Meaning |
| --- | --- |
| `request_id` | Safe trace id for local review and audit correlation. |
| `project_contract_state` | Local state label for signed or review-held project contract. |
| `milestone_state` | Local milestone state such as `approved`, `owner_accepted`, or a hold state. |
| `milestone_gross` | Simulated milestone amount label. |
| `approved_platform_fees` | Simulated platform-fee label already approved for local math. |
| `requested_repayment` | Simulated requested repayment label. |
| `outstanding_balance` | Simulated outstanding loan balance label. |
| `milestone_repayment_cap` | Simulated cap for how much this milestone may apply to repayment. |
| `retainage_holdback` | Simulated retainage or lien-waiver holdback label. |
| `approved_change_order_amount` | Simulated change-order label if reviewed. |
| `disputed_work_amount` | Simulated disputed work amount excluded from allocation. |
| `provider_approval_state` | Local provider/legal/payment term state; missing or stale terms force hold. |
| `dispute_state` | Local dispute label; active or unresolved disputes force hold. |
| `blocked_live_gate_status` | Must remain `BLOCKED_FOR_LIVE`. |
| `founder_approval_status` | Local founder-review label only; not live authority. |
| `provider_review_status` | Local provider-review label only; not provider commitment. |
| `audit_event` | Local append-only audit reference with request id and actor label. |

## Local Outputs

| Output | Meaning |
| --- | --- |
| `fixture_state` | Local result state such as `DRAFT_REPAYMENT_ALLOCATION` or a hold state. |
| `repayment_allocation_label` | Human-readable label for the simulated repayment allocation. |
| `approved_loan_repayment` | Simulated capped repayment amount from the local helper. |
| `contractor_remainder_label` | Human-readable label for contractor remainder after local fees and repayment. |
| `contractor_net_payout` | Simulated contractor remainder amount from the local helper. |
| `platform_fee_label` | Simulated platform-fee label; not a live charge. |
| `holdback_label` | Simulated retainage/dispute/change-order holdback label. |
| `blocked_live_reason` | Required explanation for why live action is blocked. |
| `next_review_step` | Local-only next review step for founder/legal/provider/security review. |
| `audit_event_id` | Local generated audit id or source audit reference. |
| `blocked_live_gate_status` | Must remain `BLOCKED_FOR_LIVE`. |

## Precedence Rules

1. Dispute, pause, HOLD, and BLOCKED states win over repayment math and contractor release labels.
2. Missing, stale, copied, unclear, unreviewed, expired, or superseded provider terms force `HOLD_FOR_PROVIDER_TERM_REVALIDATION`.
3. Payment, provider, and legal evidence that is not current and reviewed cannot support allocation beyond local labels.
4. If no loan exists, or `outstanding_balance` is zero, the repayment label is zero and the contractor remainder label receives the local allocable amount after fees and holdbacks.
5. Repayment allocation must never exceed `requested_repayment`, `outstanding_balance`, `milestone_repayment_cap`, or local allocable amount.
6. Contractor remainder must never be negative.
7. Platform fee, retainage, lien-waiver, dispute, and change-order values are local labels only; no funds move.
8. No repayment label is produced while a dispute is active or unresolved.
9. Token collateral, stablecoin settlement, escrow custody, and provider payment routes are blocked dependencies, not calculation paths.
10. AI and frontend surfaces may recommend or display labels only; they cannot approve loans, release escrow, route repayments, or settle payments.
11. Every output must include `request_id`, `blocked_live_gate_status`, and an audit reference.

## Deterministic Local Calculation Order

```text
function calculateLocalRepaymentWaterfall(input):
  require local object input
  reject secret-looking values
  require request_id and audit_event
  require blocked_live_gate_status == BLOCKED_FOR_LIVE

  normalize milestone_gross
  normalize approved_platform_fees
  normalize requested_repayment
  normalize outstanding_balance
  normalize milestone_repayment_cap
  normalize retainage_holdback
  normalize approved_change_order_amount
  normalize disputed_work_amount

  if token_collateral_dependency:
    return HOLD(LIVE_TOKEN_COLLATERAL_BLOCKED)

  if stablecoin_settlement_dependency:
    return HOLD(LIVE_STABLECOIN_SETTLEMENT_BLOCKED)

  if provider_approval_state is not current reviewed local terms:
    return HOLD(HOLD_FOR_PROVIDER_TERM_REVALIDATION)

  if dispute_state is active, open, unresolved, contradictory, or partial_dispute:
    return HOLD(HOLD_FOR_DISPUTE_WINDOW_REVIEW)

  if milestone_state is not approved, owner_accepted, or release_eligible:
    return HOLD(HOLD_FOR_OWNER_ACCEPTANCE_REVIEW)

  allocable_amount = milestone_gross - disputed_work_amount

  if retainage_holdback exists and retainage is not cleared:
    allocable_amount = allocable_amount - retainage_holdback
    if allocable_amount < 0:
      return HOLD(HOLD_FOR_RETAINAGE_LIEN_REVIEW)

  if approved_change_order_amount exists and change_order_state is pending/stale/unsigned/disputed/over_budget:
    return HOLD(HOLD_FOR_CHANGE_ORDER_REVIEW)

  approved_loan_repayment = min(
    requested_repayment,
    outstanding_balance,
    milestone_repayment_cap,
    allocable_amount
  )

  contractor_net_payout = allocable_amount - approved_platform_fees - approved_loan_repayment

  if contractor_net_payout < 0:
    return HOLD(HOLD_FOR_NEGATIVE_CONTRACTOR_PAYOUT_REVIEW)

  return DRAFT_REPAYMENT_ALLOCATION with local-only audit labels
```

## Fake Data Cases

All cases below are `FAKE_DATA_ONLY`, local review examples. They are not payment instructions and do not create borrower obligations.

| Case | Input Shape | Expected Local Result |
| --- | --- | --- |
| No loan | `outstanding_balance: 0`, `requested_repayment: 0`, approved milestone, reviewed terms | `DRAFT_REPAYMENT_ALLOCATION`, `approved_loan_repayment: 0`, contractor remainder label after fees. |
| Loan greater than milestone | `outstanding_balance > allocable_amount`, cap reviewed | Repayment is capped by requested amount, outstanding balance, milestone cap, and allocable amount. |
| Loan smaller than milestone | `outstanding_balance < allocable_amount`, reviewed terms | Repayment is capped at outstanding balance; remaining local amount becomes contractor remainder label. |
| Disputed milestone | `dispute_state: active` | `HOLD_FOR_DISPUTE_WINDOW_REVIEW`; no repayment or payout label. |
| Provider review missing | `provider_approval_state: missing` | `HOLD_FOR_PROVIDER_TERM_REVALIDATION`; no repayment or payout label. |
| Token/stablecoin dependency | `token_collateral_dependency: true` or `stablecoin_settlement_dependency: true` | `LIVE_TOKEN_COLLATERAL_BLOCKED` or `LIVE_STABLECOIN_SETTLEMENT_BLOCKED`. |
| Negative payout | fees plus repayment exceed allocable local amount | `HOLD_FOR_NEGATIVE_CONTRACTOR_PAYOUT_REVIEW`. |

## Required Local Checks

Run these checks before using this spec as current local evidence:

```powershell
npm --prefix construction-ai run check:repayment-waterfall-draft-helper
npm --prefix construction-ai run check:repayment-waterfall-draft-endpoint-fixtures
npm --prefix construction-ai run check:repayment-waterfall-draft-endpoint-review-packet
npm --prefix construction-ai run check:repayment-waterfall-review-packet-endpoint
npm --prefix construction-ai run check:smart-contract-repayment-failure-state-local
npm --prefix construction-ai run check:smart-contract-local-replay-live-gate
npm --prefix construction-ai run check:smart-contract-test-fixtures
npm --prefix construction-ai run check:smart-contract-deployment-blockers
```

If any check fails, the algorithm remains `HOLD_FOR_EVIDENCE` and `BLOCKED_FOR_LIVE`.

## Closeout Rule

Any future repayment waterfall review must close with this shape:

```text
waterfall_review_state:
local_algorithm_spec:
source_helper:
source_fixtures:
checks_run:
public_files_changed: no
live_actions_taken: no
repayment_routing_approved: no
loan_approved: no
escrow_release_approved: no
token_collateral_approved: no
stablecoin_settlement_approved: no
blocked_next_action:
```

The only acceptable autonomous values are `public_files_changed: no`, `live_actions_taken: no`, and every approval field set to `no`.
