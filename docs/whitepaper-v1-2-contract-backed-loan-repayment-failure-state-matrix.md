# GCSC Whitepaper v1.2 Contract-Backed Loan Repayment Failure State Matrix

Status: internal repayment failure-state matrix only.

This document is not legal advice, not lending approval, not escrow approval, not payment-provider approval, not securities advice, not approval to launch real loans, not approval to launch real escrow, not approval to launch real repayment routing, not approval to launch stablecoin settlement, not approval to launch token collateral, not approval to move real money, and not approval to publish public wording.

## Purpose

This matrix turns repayment-first waterfall edge cases into explicit local draft states. It keeps the technical requirements testable before local implementation while making every live-money path default to `BLOCKED_FOR_LIVE`.

Source documents:

- `docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md`
- `docs/whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix.md`
- `docs/whitepaper-v1-2-contract-backed-loan-implementation-blocker-register.md`

## Failure State Matrix

| Failure state | Trigger | Required local draft result | Live boundary |
| --- | --- | --- | --- |
| `MISSING_PROVIDER_TERMS` | Legal, finance-provider, payment-provider, or repayment terms are missing or unclear. | `HOLD_FOR_PROVIDER_REVIEW` | No provider API calls, no repayment routing, and no production money movement. |
| `MILESTONE_NOT_APPROVED` | Milestone evidence is incomplete, owner approval is missing, or release eligibility is false. | `HOLD_FOR_MILESTONE_APPROVAL` | No escrow release, no repayment routing, and no stablecoin settlement. |
| `ACTIVE_DISPUTE` | Project contract, milestone, owner approval, contractor acknowledgement, or evidence is disputed. | `HOLD_FOR_DISPUTE_REVIEW` | No repayment routing, no escrow release, and no AI final approval. |
| `OVER_REPAYMENT_REQUEST` | Requested repayment exceeds outstanding balance or milestone repayment cap. | `CAP_TO_OUTSTANDING_BALANCE` | No live balance reduction and no provider transfer. |
| `NEGATIVE_CONTRACTOR_PAYOUT` | Fees plus repayment would make contractor payout below zero. | `HOLD_FOR_NEGATIVE_PAYOUT_REVIEW` | No fee charge, no repayment routing, and no production money movement. |
| `UNVERIFIED_CHANGE_ORDER` | Pending, verbal, unsigned, stale, disputed, or over-budget change order affects receivables. | `HOLD_FOR_CHANGE_ORDER_REVIEW` | No live contract amendment, no increased loan principal, and no increased collateral value. |
| `PARTIAL_APPROVAL_HOLDBACK` | Only part of a milestone is approved, or holdback/disputed amount remains. | `HOLD_FOR_PARTIAL_MILESTONE_REVIEW` | No release or repayment based on disputed or held amounts. |
| `STALE_OR_CONTRADICTORY_EVIDENCE` | Owner, contractor, provider, payment, or milestone records conflict or are stale. | `HOLD_FOR_EVIDENCE_REVIEW` | No live routing, no public claim, and no approval evidence reuse. |
| `AI_ONLY_APPROVAL_ATTEMPT` | AI recommendation is presented as final approval or payment-release authority. | `HOLD_FOR_HUMAN_REVIEW` | No AI final approval and no AI payment release. |
| `TOKEN_COLLATERAL_DEPENDENCY` | Repayment or eligibility depends on token collateral, oracle value, lock, margin, or liquidation state. | `HOLD_FOR_TOKEN_COLLATERAL_REVIEW` | No token collateral lock, oracle reliance, margin call, or liquidation action. |

## Required Draft Outputs

Every failed repayment allocation attempt must create or expose these local-only fields:

- `LOCAL_DRAFT_FAILURE_STATE`
- `DRAFT_REPAYMENT_ALLOCATION`
- `BLOCKED_FOR_LIVE`
- `request_id`
- `audit_event`
- `failure_state`
- `blocked_live_actions`
- `required_human_review`
- `required_provider_or_legal_review`
- `safe_next_local_action`

The local draft may calculate capped or held values for review, but it must not mutate a live loan ledger, release escrow, route repayments, settle stablecoins, lock token collateral, call provider APIs, or move money.

## Blocked Live Actions

The matrix must keep these actions blocked until separate founder, legal/provider, finance-provider, payment-provider, security, Auth/RLS, and no-real-money evidence approvals exist:

- real loan origination;
- real escrow release;
- real repayment routing;
- stablecoin settlement;
- token collateral lock;
- provider API calls;
- live outstanding-balance mutation;
- fee charge;
- AI final approval;
- production money movement.

## Required Checks

- `npm run check:whitepaper-v1-2-contract-backed-loan-repayment-failure-state-matrix`
- `npm run check:whitepaper-v1-2-contract-backed-loan-technical-requirements`
- `npm run check:whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix`
- `npm run check:whitepaper-v1-2-contract-backed-loan-implementation-blocker-register`
- `npm run check`
