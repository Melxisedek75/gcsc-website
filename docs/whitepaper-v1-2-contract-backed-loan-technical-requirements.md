# GCSC Whitepaper v1.2 Contract-Backed Loan Technical Requirements

Status: internal technical requirements and blocked-live gates only.

This document is not legal advice, not lending approval, not escrow approval, not payment-provider approval, not securities advice, not approval to launch real loans, not approval to launch real escrow, not approval to launch real repayment routing, not approval to launch stablecoin settlement, not approval to launch token collateral, not approval to move real money, not approval to publish public wording, and not approval to make AI final legal, financial, lending, escrow, payment, collateral, or dispute decisions.

## Purpose

This document converts the founder-approved contract-backed working-capital model into implementation-grade technical requirements while keeping every live-money action blocked.

Source documents:

- `docs/gcsc-v1-2-core-architecture-package.md`
- `docs/gcsc-contract-backed-loan-blueprint.md`
- `docs/whitepaper-v1-2-contract-backed-loan-technical-handoff.md`
- `docs/whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix.md`
- `docs/whitepaper-v1-2-contract-backed-loan-implementation-blocker-register.md`
- `docs/whitepaper-v1-2-contract-backed-loan-approval-evidence-template.md`

The goal is to give engineering one clear local-only target: model signed-project-contract working-capital eligibility, receivables-based underwriting inputs, repayment-first waterfall math, audit events, and blocked-live gates without enabling real lending, real escrow, real repayment routing, stablecoin settlement, token collateral, provider API calls, or production money movement.

## Required Data Entities

Before any live use can be considered, the local model must support these entities as explicit records, not loose text fields:

| Entity | Required purpose | Live boundary |
| --- | --- | --- |
| `project_contract` | Links owner, contractor, accepted bid, scope, signed reference, status, and audit trail. | Signed reference is underwriting support, not automatic legal collateral. |
| `milestone` | Stores milestone amount, due window, evidence requirements, approval state, and dispute state. | No release before approval and no release while disputed. |
| `contractor_profile` | Stores contractor identity, business, license, insurance, rating, dispute, and repayment references. | No final credit decision from profile data alone. |
| `verification_status` | Tracks identity, business, license, insurance, wallet, bank, and provider verification states. | Missing required verification blocks draft eligibility. |
| `loan_request` | Stores requested amount, linked contract, underwriting inputs, review state, and provider/founder gates. | No autonomous loan origination. |
| `loan_ledger` | Stores approved-principal reference, outstanding balance, repayment events, and closeout state. | Ledger is local/draft until provider/legal/founder approvals exist. |
| `repayment_schedule` | Stores agreed repayment caps, schedule, milestone linkage, and outstanding-balance rules. | No repayment above outstanding balance. |
| `payment_intent` | Stores payment provider intent reference, participant ownership, amount, and status. | No provider API calls or live money movement from draft records. |
| `repayment_allocation` | Stores waterfall inputs and outputs for each approved milestone. | No negative contractor payout. |
| `dispute_case` | Stores dispute status, reason, evidence references, resolution route, and hold state. | Active dispute blocks release and repayment routing. |
| `audit_event` | Stores actor, role, action, request ID, before/after state, blocked-live flag, and references. | Audit history must be append-only. |
| `approval_record` | Stores founder, legal/provider, finance-provider, technical, security, and public-use decisions. | Missing or unclear evidence defaults to HOLD. |

## Eligibility Requirements

A contract-backed working-capital request can enter local draft eligibility only when all required checks are present:

1. A signed project contract exists with owner ID, contractor ID, accepted bid ID, milestone IDs, project amount, and audit events.
2. Contractor identity, business identity, license, insurance where applicable, and ownership binding are reviewable.
3. Milestone schedule, expected receivables, evidence rules, dispute rules, and payment schedule are defined.
4. Owner or project owner confirmation is recorded without implying live escrow or repayment authority.
5. No active blocking dispute exists on the project contract or milestone.
6. Risk package includes rating, dispute history, repayment history where legally usable, bid accuracy, response time, project risk, and outstanding exposure.
7. Founder, legal/provider, finance-provider, technical, Auth/RLS, payment, escrow, stablecoin, token-collateral, AI, security, and public wording gates are either marked `REVIEW`, `BLOCKED`, `SUPPORT_ONLY`, or `HOLD`; none may be treated as live approval by default.

If any required item is missing, the output must be `INELIGIBLE_DRAFT` or `MORE_INFO_NEEDED`, never `APPROVED_FOR_LIVE`.

## Underwriting Inputs

The local underwriting package must be explainable and replayable. Required inputs:

- contract value;
- milestone gross amount;
- milestone due dates and expected receivables;
- requested working-capital amount;
- contractor identity and business verification state;
- license and insurance verification state;
- completed jobs and rating;
- dispute history and unresolved dispute count;
- repayment history where legally and contractually permitted;
- bid accuracy and change-order pattern;
- response time and communication record;
- project type, project risk, property/project owner status, and evidence requirements;
- outstanding exposure across active requests;
- provider review state and approval record state.

AI may produce recommendation fields and risk signals only. AI cannot approve loans, reject borrowers as a final decision, release payments, route repayments, decide disputes, or override provider/legal/founder/security gates.

## Repayment Waterfall Requirements

The repayment-first waterfall must be deterministic and testable:

```text
milestone_gross - approved_platform_fees - approved_loan_repayment = contractor_net_payout
```

Required invariants:

- `approved_loan_repayment` must never exceed outstanding balance.
- `approved_loan_repayment` must never exceed the milestone-level repayment cap.
- `contractor_net_payout` must never be negative.
- no repayment routing while disputed;
- no release before milestone approval;
- no release without release eligibility;
- no repayment without provider/legal/payment terms;
- no fee above the approved fee schedule;
- every calculation must emit an `audit_event` with request ID, inputs, outputs, and blocked-live flag.

The local implementation may calculate `DRAFT_REPAYMENT_ALLOCATION` only. It must not initiate real repayment routing, provider transfer, stablecoin transfer, token collateral movement, or production money movement.

## Partial Milestone And Dispute Hold Boundary

Partial milestone approval must record approved_work_amount, disputed_work_amount, holdback_amount, owner_confirmation_status, contractor_acknowledgement_status, dispute_status, calculation_owner, and blocked_live_gate_status before any draft repayment allocation is calculated.

If any part of a milestone is disputed, unverified, over budget, missing evidence, missing owner confirmation, or subject to change order review, the disputed_work_amount and holdback_amount stay excluded from DRAFT_REPAYMENT_ALLOCATION.

A partial approval can only create LOCAL_DRAFT_ALLOCABLE_AMOUNT and must not release escrow, route repayments, settle stablecoins, reduce live outstanding balance, charge fees, lock collateral, or create provider obligations.

Missing partial-approval evidence, unresolved dispute evidence, contradictory owner/contractor records, or stale milestone evidence defaults to HOLD_FOR_PARTIAL_MILESTONE_REVIEW and BLOCKED_FOR_LIVE.

## Change Order And Budget Drift Boundary

Change-order review must record original_contract_amount, approved_change_order_amount, pending_change_order_amount, revised_contract_amount, budget_delta_reason, owner_approval_status, contractor_acknowledgement_status, and blocked_live_gate_status before revised repayment math can be drafted.

Pending, disputed, verbal, stale, unsigned, or over-budget change orders must not increase eligible_receivables, milestone_gross, repayment_cap, contractor_net_payout, collateral value, or loan principal in local calculations.

Any change-order adjustment can only produce LOCAL_DRAFT_REVISED_WATERFALL and must not amend a live contract, increase a live loan balance, route repayments, release escrow, settle stablecoins, lock token collateral, or create provider obligations.

Missing change-order evidence, conflicting owner/contractor approval, stale budget evidence, or provider/legal uncertainty defaults to HOLD_FOR_CHANGE_ORDER_REVIEW and BLOCKED_FOR_LIVE.

## Blocked-Live Gates

The implementation must keep these gates explicit and disabled-by-default:

| Gate | Meaning | Required state before live |
| --- | --- | --- |
| `LIVE_LOAN_ORIGINATION_BLOCKED` | No real contractor loan can be originated by GCSC locally. | Founder, legal/provider, finance-provider, security, Auth/RLS, payment, and provider approvals recorded. |
| `LIVE_ESCROW_CUSTODY_BLOCKED` | No live regulated escrow or custody claim is active. | Licensed/provider escrow or payment structure approved. |
| `LIVE_REPAYMENT_ROUTING_BLOCKED` | No real repayment routing may execute from milestone payments. | Provider/payment/legal terms approved and tested with no-real-money evidence. |
| `LIVE_STABLECOIN_SETTLEMENT_BLOCKED` | Stablecoin settlement is roadmap only. | Stablecoin, provider, compliance, tax, accounting, and security review complete. |
| `LIVE_TOKEN_COLLATERAL_BLOCKED` | Token collateral is disabled. | Collateral agreement, custody, oracle, LTV, liquidation, legal, provider, and founder approvals complete. |
| `AI_FINAL_APPROVAL_BLOCKED` | AI cannot make final decisions. | Human/provider/admin final review remains mandatory. |
| `PUBLIC_CLAIM_BLOCKED` | Public wording cannot claim live lending, escrow, repayment routing, stablecoin settlement, token collateral, or legal collateral status. | Public-use approval evidence recorded. |

## Local API Requirements

Allowed local-only service behavior:

- validate project contract and milestone inputs;
- compute draft eligibility;
- compute draft risk package;
- compute draft repayment waterfall;
- emit audit events;
- report missing gates;
- return `BLOCKED_FOR_LIVE` for live-risk actions.

Blocked service behavior:

- real loan origination;
- real escrow;
- real repayment routing;
- stablecoin settlement;
- token collateral;
- provider API calls;
- borrower underwriting decisions;
- AI final approval;
- AI payment release;
- production money movement.

## Smart Contract Requirements

Future smart contract code must start as local state-machine and replay-test work only. Required modules:

- authority and role module;
- project contract registry;
- milestone and escrow-ready state machine;
- contract-backed loan ledger;
- repayment waterfall router;
- collateral and risk module;
- reputation and review ledger;
- dispute and human override module;
- audit and compliance registry.

Security requirements:

- least-privilege roles;
- multisig or quorum for privileged actions;
- emergency pause with audit trail;
- no owner-only drain;
- no hidden upgrade path;
- no arbitrary balance mutation;
- no arbitrary oracle trust;
- no dispute-to-release bypass;
- no contractor self-approval;
- no AI-only approval;
- no frontend-controlled protected authority;
- no service-role key in browser code;
- append-only audit events;
- deterministic replay tests for state transitions and waterfall calculations.

## Required Test Fixtures

The local test fixture set must cover:

1. Happy path draft eligibility where every live gate still returns `BLOCKED_FOR_LIVE`.
2. Missing contractor verification returns `MORE_INFO_NEEDED`.
3. Active dispute blocks release and repayment routing.
4. Milestone not approved blocks release and repayment routing.
5. Overpayment is capped at outstanding balance.
6. Negative contractor payout is blocked.
7. AI-only approval is rejected.
8. Missing provider/legal/payment approval blocks live routing.
9. Token collateral request remains blocked.
10. Audit event is emitted for every eligibility, waterfall, dispute, and blocked-live decision.

## Stop Conditions

Stop before any action involving:

- live Supabase changes;
- production deployment settings;
- external account settings;
- secrets, API keys, service-role keys, private keys, seed phrases, or passwords;
- real payments;
- real loans;
- real escrow;
- real repayment routing;
- stablecoin settlement;
- token collateral;
- legal decisions;
- financial/provider commitments;
- public launch.

## Required Checks

- `npm run check:whitepaper-v1-2-contract-backed-loan-technical-requirements`
- `npm run check:whitepaper-v1-2-contract-backed-loan-technical-handoff`
- `npm run check:whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix`
- `npm run check:whitepaper-v1-2-contract-backed-loan-implementation-blocker-register`
- `npm run check:whitepaper-v1-2-contract-backed-loan-approval-evidence-template`
- `npm run check:contract-backed-loan-blueprint`
- `npm run check:gcsc-v1-2-core-architecture-package`
- `npm run check`
