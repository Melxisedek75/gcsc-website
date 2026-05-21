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

## Borrower Document And Consent Boundary

Borrower document review must record document_package_id, borrower_identity_status, contractor_business_status, project_contract_reference, requested_amount_disclosure, fee_or_APR_disclosure_status, repayment_waterfall_disclosure_status, consent_timestamp, reviewer_role, and blocked_live_gate_status before a working-capital request can move beyond local draft review.

Missing borrower identity evidence, missing business evidence, unsigned or stale consent, unclear fee/APR disclosure, unclear repayment waterfall disclosure, mismatched project contract reference, or copied provider language defaults to HOLD_FOR_BORROWER_DOCUMENT_REVIEW and BLOCKED_FOR_LIVE.

Borrower documents and consent records can only create LOCAL_DRAFT_BORROWER_READINESS and must not approve credit, originate loans, create borrower obligations, charge fees, route repayments, release escrow, settle stablecoins, lock token collateral, make legal disclosures final, or create provider commitments.

## Material Draw Evidence Boundary

Material draw evidence must record material_quote_id, vendor_identity_status, purchase_order_reference, project_contract_reference, budget_line_item, owner_confirmation_status, contractor_acknowledgement_status, receipt_or_invoice_status, reviewer_role, and blocked_live_gate_status before a working-capital draw can move beyond local draft review.

Missing material quote evidence, unverified vendor identity, mismatched purchase order, missing owner confirmation, missing contractor acknowledgement, stale receipt or invoice evidence, or unclear budget-line mapping defaults to HOLD_FOR_DRAW_EVIDENCE_REVIEW and BLOCKED_FOR_LIVE.

Material draw evidence can only create LOCAL_DRAFT_DRAW_EVIDENCE and must not pay vendors, advance contractor funds, approve credit, originate loans, create borrower obligations, charge fees, route repayments, release escrow, settle stablecoins, lock token collateral, or create provider commitments.

## Owner Acceptance Evidence Boundary

Owner acceptance evidence must record acceptance_evidence_id, milestone_id, owner_identity_status, work_completion_status, punch_list_status, photo_or_video_evidence_status, contractor_acknowledgement_status, dispute_window_status, reviewer_role, and blocked_live_gate_status before milestone evidence can support local draw or repayment review.

Missing owner acceptance, disputed completion, open punch-list items, stale or missing photo/video evidence, identity mismatch, contractor disagreement, or an open dispute window defaults to HOLD_FOR_OWNER_ACCEPTANCE_REVIEW and BLOCKED_FOR_LIVE.

Owner acceptance evidence can only create LOCAL_DRAFT_OWNER_ACCEPTANCE and must not release escrow, route repayments, settle stablecoins, reduce balances, approve credit, originate loans, pay vendors, lock token collateral, or create provider commitments.

## Dispute Window Expiration Boundary

Dispute window review must record dispute_window_id, milestone_id, window_opened_at, window_closes_at, owner_notice_status, contractor_notice_status, open_dispute_count, unresolved_evidence_count, reviewer_role, and blocked_live_gate_status before a milestone can support local repayment allocation.

Missing notice evidence, unexpired dispute windows, open dispute cases, unresolved evidence, mismatched milestone references, stale timestamps, or unclear reviewer ownership defaults to HOLD_FOR_DISPUTE_WINDOW_REVIEW and BLOCKED_FOR_LIVE.

Dispute window clearance can only create LOCAL_DRAFT_DISPUTE_WINDOW_CLEARANCE and must not release escrow, route repayments, settle stablecoins, reduce balances, approve credit, originate loans, pay vendors, lock token collateral, or create provider commitments.

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

## Retainage And Lien Waiver Boundary

Retainage review must record retainage_percent, retainage_amount, lien_waiver_status, release_condition, owner_acceptance_status, provider_review_status, jurisdiction_review_status, and blocked_live_gate_status before retainage can affect draft waterfall math.

Missing lien waiver evidence, unsigned waiver evidence, unclear retainage terms, owner acceptance mismatch, provider uncertainty, or jurisdiction uncertainty defaults to HOLD_FOR_RETAINAGE_LIEN_REVIEW and BLOCKED_FOR_LIVE.

Retainage and lien waiver handling can only produce LOCAL_DRAFT_RETAINAGE_HOLD or LOCAL_DRAFT_RETAINAGE_RELEASE_CANDIDATE and must not waive legal rights, file liens, release escrow, route repayments, settle stablecoins, lock collateral, or create provider obligations.

## Provider Term Expiration And Revalidation Boundary

Provider term records must include term_version, provider_role, issued_at, expires_at, source_commit, reviewed_files, APR_or_fee_range, repayment_priority, waterfall_version, reviewer_role, and blocked_live_gate_status before they can support eligibility, repayment math, public wording, or implementation planning.

Expired, superseded, missing-expiration, copied, unknown-source, unreviewed, or mismatched provider terms default to HOLD_FOR_PROVIDER_TERM_REVALIDATION and BLOCKED_FOR_LIVE.

Provider term revalidation can only create LOCAL_DRAFT_PROVIDER_TERM_CLEARANCE and must not approve credit, fund contractors, route repayments, release escrow, settle stablecoins, lock token collateral, change live balances, charge fees, publish public lending claims, or create provider obligations.

## Requirement-To-Claim Traceability Boundary

Requirement-to-claim records must include requirement_id, claim_id, source_file, source_commit, evidence_id, reviewer_role, claim_level, public_use_status, implementation_status, owner, latest_check_run, and blocked_live_actions before technical requirements can support public wording, provider packets, investor/founder packets, or local implementation planning.

Missing requirement IDs, mismatched claim IDs, stale evidence, unknown reviewer role, copied public wording, superseded source commits, or missing blocked-live actions default to HOLD_FOR_REQUIREMENT_CLAIM_TRACEABILITY and BLOCKED_FOR_LIVE.

Requirement-to-claim traceability can only create LOCAL_DRAFT_TRACEABILITY_RECORD and must not approve public wording, implementation, provider commitments, legal conclusions, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, production deploys, or public launch.

## Founder Evening Technical Readiness Decision Record

Use this compact record during founder-present evening mode to decide whether the contract-backed loan requirements are ready for local implementation review, not live finance.

| Founder Evening Technical Readiness Field | Required Value |
| --- | --- |
| evening_technical_readiness_state | READY_FOR_LOCAL_IMPLEMENTATION_REVIEW, REVIEW_BLOCKERS, HOLD_FOR_LEGAL_PROVIDER_REVIEW, HOLD_FOR_FINANCE_PROVIDER_REVIEW, HOLD_FOR_SECURITY_REVIEW, or NO_GO |
| evening_technical_readiness_evidence | Requirements file version, source commit, readiness matrix, blocker register, approval evidence template, blueprint link, or latest check output |
| evening_technical_readiness_owner | Founder, Codex-local, legal/provider reviewer pending, finance-provider reviewer pending, security reviewer pending, or HOLD_FOR_OWNER |
| evening_technical_readiness_blocked_action | Do not start live loans, escrow, repayment routing, provider setup, public wording, smart contract deployment, or production money movement from this record |

## Founder Evening Contract-Backed Loan Reviewer Handoff Matrix

Use this matrix to route the technical requirements to the next human or external reviewer without converting an internal requirements review into live authority.

| Reviewer Handoff Field | Required Value |
| --- | --- |
| reviewer_handoff_state | READY_FOR_FOUNDER_REVIEW, NEEDS_REQUIREMENT_CLARIFICATION, HOLD_FOR_LEGAL_REVIEW, HOLD_FOR_FINANCE_PROVIDER_REVIEW, HOLD_FOR_SECURITY_REVIEW, or NO_GO |
| reviewer_handoff_evidence | Requirements version, source commit, readiness matrix, blocker register, approval evidence template, latest check run, redacted reviewer note, or linked internal decision record |
| reviewer_handoff_owner | Founder, Codex-local, legal/provider reviewer pending, finance-provider reviewer pending, security reviewer pending, technical owner, or HOLD_FOR_OWNER |
| reviewer_handoff_blocked_action | Do not treat this matrix as legal advice, finance-provider approval, lender commitment, underwriting approval, live loan approval, escrow approval, repayment routing approval, stablecoin settlement approval, token collateral approval, public wording approval, production deploy approval, or smart contract deployment approval |

## Founder Evening Contract-Backed Loan Implementation Handoff Matrix

Use this matrix only after the technical requirements and reviewer handoff are current. It decides whether the internal packet is ready for local implementation planning, not whether any live finance, provider, legal, public wording, deploy, or smart contract action is approved.

| Implementation Handoff Field | Required Value |
| --- | --- |
| contract_backed_loan_implementation_handoff_state | READY_FOR_INTERNAL_IMPLEMENTATION_PACKET, NEEDS_REQUIREMENT_REFRESH, HOLD_FOR_LEGAL_PROVIDER_REVIEW, HOLD_FOR_FINANCE_PROVIDER_REVIEW, HOLD_FOR_SECURITY_REVIEW, HOLD_FOR_PUBLIC_WORDING_REVIEW, or NO_GO |
| contract_backed_loan_implementation_handoff_evidence | Requirements version, source commit, reviewer handoff matrix, readiness matrix, blocker register, approval evidence template, latest check run, redacted founder note, or linked internal decision record |
| contract_backed_loan_implementation_handoff_owner | Founder, Codex-local, technical owner, legal/provider reviewer pending, finance-provider reviewer pending, security reviewer pending, public-wording reviewer pending, or HOLD_FOR_OWNER |
| contract_backed_loan_implementation_handoff_blocked_action | Do not treat this handoff as approval for live loans, escrow, repayment routing, stablecoin settlement, token collateral, provider or lender commitments, legal advice, public wording, production deploy, smart contract deploy, or money movement |

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
