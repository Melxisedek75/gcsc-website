# GCSC Whitepaper v1.2 Smart Contract Module Split And Anti-Backdoor Review

Status: internal smart contract architecture review only.

This review is not legal advice, not securities advice, not tax advice, not provider approval, not security-audit approval, not approval to deploy live XPR contracts, not approval to launch real escrow, not approval to launch real loans, not approval to launch real repayment routing, not approval to launch stablecoin settlement, not approval to launch token collateral, not approval to move real money, and not approval to publish public wording.

## Purpose

This document locks the founder-present evening direction for the next smart contract architecture step: GCSC must not become one large contract with broad owner powers. It must be split into small modules with explicit authority, audit trails, pause controls, state transition guards, and anti-backdoor rules before any local coding, public whitepaper wording, live XPR deployment, or real-money action.

Source documents:

- `docs/gcsc-v1-2-core-architecture-package.md`
- `docs/whitepaper-v1-2-smart-contract-architecture-draft.md`
- `docs/smartcontractor-smart-contract-authority-model.md`
- `docs/smartcontractor-smart-contract-audit-event-map.md`
- `docs/smartcontractor-smart-contract-implementation-gate.md`
- `docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md`

## Module Split Decision

The future smart contract architecture should be a coordinated module system, not one monolith.

| Module | Core responsibility | Must depend on | Must not do |
| --- | --- | --- | --- |
| Authority And Role Module | Roles, multisig, provider signer, security signer, pause authority, upgrade authority, protected action permissions. | Audit registry, founder/security/provider review evidence. | Hidden owner-only drain, frontend-controlled authority, unaudited role changes, single-key production deployment. |
| Project Contract Registry | Accepted project relationship, participant roles, signed agreement references, milestone references, status history. | Authority module, audit registry, backend project contract records. | Claim the chain record is the signed legal contract before legal/provider review. |
| Milestone And Escrow-Ready State Machine | Evidence submission, review, approval, dispute hold, release eligibility, refund/adjustment labels, archive state. | Project registry, dispute module, audit registry, provider/payment gates. | Claim live escrow, release funds before approval, bypass dispute hold. |
| Contract-Backed Loan Ledger | Working-capital request state, provider review state, approved-principal reference, outstanding balance, repayment event records, closeout. | Project registry, repayment router, authority module, audit registry. | Originate real loans, approve borrowers, create legal collateral status, change repayment history without audit. |
| Repayment Waterfall Router | Deterministic draft allocation after approved milestone and no-dispute checks. | Milestone state machine, loan ledger, payment/provider terms, audit registry. | Route real repayments, overpay above outstanding balance, create negative contractor payout, run while disputed. |
| Collateral And Risk Module | Future collateral references, LTV policy references, oracle snapshot references, risk labels, disabled/enabled collateral state. | Authority module, audit registry, legal/provider/custody/oracle evidence. | Lock real token collateral, auto-liquidate, trust arbitrary oracle data, mutate collateral balances. |
| Reputation And Review Ledger | Completed work signals, review outcomes, dispute ratio, repayment behavior where legally usable, fraud flags, correction path. | Milestone state machine, dispute module, audit registry. | Illegal blacklisting, unexplained automated denial, AI-only final negative decision. |
| Dispute And Human Override Module | Dispute pause, review route, resolution record, refund/adjustment labels, human/admin/provider override record. | Authority module, milestone state machine, audit registry. | Release or repay while dispute is active, let one party self-resolve critical disputes. |
| Audit And Compliance Registry | Append-only non-secret evidence of roles, actions, state transitions, blocked-live flags, request IDs, approvals, and review references. | Every module. | Store secrets, raw identity documents, private keys, service-role keys, SSNs, raw bank data, or mutable history. |

## Authority Model Requirements

Production authority must be least-privilege and role-specific:

- homeowner or project owner can approve draft project records and review milestone evidence in the app, but cannot directly release live funds;
- contractor can accept terms and submit evidence, but cannot self-approve milestone release, loan approval, repayment routing, or dispute resolution;
- inspector, peer reviewer, or admin can record review evidence and recommendations, but cannot move funds directly;
- platform admin can pause local flows, flag disputes, and prepare review records, but cannot replace founder/legal/provider approval;
- founder multisig signer is required for deployment, authority changes, upgrade actions, unpause actions, and live-risk enablement decisions;
- provider signer is required for future regulated payment, escrow, lending, stablecoin, or repayment routing workflows;
- security signer is required for deployment, upgrade, authority change, emergency recovery, and post-audit approval.

Unpause must require stronger approval than pause. Emergency pause may stop new actions, but it must not move funds, approve loans, release escrow, route repayments, liquidate collateral, or rewrite history.

## Anti-Backdoor Rules

No module may include:

- hidden owner-only drain;
- arbitrary balance mutation;
- hidden upgrade path;
- unaudited authority change;
- frontend-controlled protected authority;
- contractor self-approval;
- AI-only final approval;
- dispute-to-release bypass;
- repayment routing while disputed;
- repayment above outstanding balance;
- negative contractor payout;
- auto-liquidation of real token collateral;
- arbitrary oracle trust;
- mutable audit history;
- secret storage on-chain;
- service-role key in browser code;
- public claim that a roadmap feature is live.

Any future code review must fail the module if one of these patterns is found.

## Emergency Pause Settlement Boundary

Emergency pause is not a settlement primitive. It may stop new protected actions while founder, provider, security, and legal/provider reviewers inspect evidence, but pause cannot approve loans, release escrow, route repayments, liquidate collateral, mutate balances, upgrade contracts, or rewrite audit history.

During a pause, paused modules may record append-only audit events and blocked-live evidence only. They may not change economic state, clear disputes, mark repayment complete, unlock token collateral, alter authority, or convert draft records into live approvals.

Unpause requires founder multisig, provider review where money flows are involved, security review, and an audit event. Unpause must restore the prior safe state or route to a separately approved recovery plan; it must never silently settle funds or erase the reason for the pause.

## Upgrade Authority Recovery Boundary

Upgrade authority is not a stealth-change path. It exists only to route explicit, reviewed module changes through founder, security, provider, and audit gates before any code or authority change can affect a protected workflow.

All upgrade proposals must identify the module, action, migration reason, risk class, rollback path, and affected state. Each proposal must also name the expected audit event, blocked-live status, and review evidence required before it can move beyond local planning.

Upgrades cannot add owner drains, mutable audit history, arbitrary balance mutation, AI-only approval, dispute bypass, repayment bypass, token-collateral activation, or public-live claims. A proposed upgrade that introduces any of those patterns must fail local review and remain `BLOCKED_FOR_LIVE`.

Rollback or recovery actions require founder multisig, security review, append-only audit evidence, and blocked-live status until external approvals are recorded. Recovery may restore a prior safe state or freeze a module for review, but it must not settle funds, approve loans, release escrow, route repayments, unlock collateral, or erase evidence.

## Cross-Module Invariant Conflict Boundary

If two modules disagree about status, authority, dispute state, repayment eligibility, collateral state, or live-use readiness, the most restrictive state wins.

No module may downgrade BLOCKED_FOR_LIVE, DISPUTED, PAUSED, HOLD, or REVIEW_REQUIRED to a live, payable, releasable, fundable, repayable, or collateral-enabled state without append-only evidence from every affected module.

Cross-module invariants must reject partial replay output, missing audit events, stale request IDs, mismatched project IDs, mismatched milestone IDs, mismatched loan IDs, or contradictory actor roles.

Missing or conflicting invariant evidence keeps the workflow HOLD_FOR_REVIEW and BLOCKED_FOR_LIVE; it must never default to approval, settlement, repayment, escrow release, loan funding, stablecoin settlement, or token-collateral enablement.

## Privileged Action Two-Person Rule Boundary

Every privileged action must record proposer_role, approver_role, affected_module, affected_action, request_id, evidence_hash_or_reference, approval_expiration, and blocked_live_gate_status before it can move beyond local review.

The proposer and approver for deployment, upgrade, unpause, authority change, provider signer activation, emergency recovery, or live-risk enablement must be different roles and different signer identities.

Founder-only, admin-only, provider-only, security-only, AI-only, frontend-only, or same-signer approval must keep the action HOLD_FOR_TWO_PERSON_REVIEW and BLOCKED_FOR_LIVE.

Two-person review can only create LOCAL_DRAFT_PRIVILEGED_ACTION_APPROVAL and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, or create provider obligations.

## Privileged Action Timelock And Expiration Boundary

Privileged action requests must record created_at, earliest_execution_at, expires_at, review_window_reason, proposer_role, approver_role, affected_module, affected_action, request_id, and blocked_live_gate_status before any execution path is drafted.

Deployment, upgrade, unpause, authority change, provider signer activation, emergency recovery, or live-risk enablement must remain PENDING_TIMELOCK_REVIEW until the review window has elapsed and all required review evidence is still current.

Expired, stale, rushed, backdated, missing-window, mismatched-timestamp, or reviewer-changed privileged actions default to HOLD_FOR_TIMELOCK_REVIEW and BLOCKED_FOR_LIVE.

Timelock review can only create LOCAL_DRAFT_TIMELOCK_CLEARANCE and must not execute contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, or create provider obligations.

## Privileged Action Replay And Evidence Binding Boundary

Privileged action evidence must bind request_id, actor_role, signer_identity_reference, affected_module, affected_action, prior_state_hash, expected_next_state, evidence_hash_or_reference, created_at, and nonce before local approval artifacts are generated.

Replay, duplicate nonce, mismatched evidence hash, changed affected action, changed signer, stale request ID, or missing prior-state binding keeps the action HOLD_FOR_REPLAY_REVIEW and BLOCKED_FOR_LIVE.

Evidence binding review must compare the proposed privileged action against the audit registry, module state snapshot, authority model, and blocked-live gate before any local clearance is recorded.

Replay and evidence binding review can only create LOCAL_DRAFT_EVIDENCE_BINDING_CLEARANCE and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, or create provider obligations.

## Privileged Action Reviewer Revocation And Role Drift Boundary

Privileged action clearance must re-check reviewer_role_status, signer_status, provider_status, security_reviewer_status, founder_multisig_status, authority_version, and role_assignment_version immediately before local approval artifacts are accepted.

Revoked, rotated, expired, suspended, conflicted, provider-offboarded, security-reviewer-changed, founder-signer-changed, or authority-version-drifted reviewer evidence defaults to HOLD_FOR_ROLE_DRIFT_REVIEW and BLOCKED_FOR_LIVE.

Role drift review must require fresh non-secret evidence from every affected reviewer class before it can replace stale privileged-action clearance.

Reviewer revocation and role drift review can only create LOCAL_DRAFT_ROLE_DRIFT_CLEARANCE and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, or create provider obligations.

## Privileged Action Dry-Run Simulation Boundary

Privileged action dry-runs must record simulation_id, request_id, affected_module, affected_action, pre_state_snapshot_hash, expected_post_state_hash, blocked_live_gate_status, rollback_plan_reference, and reviewer_set before any live-risk clearance is drafted.

Deployment, upgrade, unpause, authority change, provider signer activation, emergency recovery, or live-risk enablement that lacks a matching local replay simulation must remain HOLD_FOR_DRY_RUN_REVIEW and BLOCKED_FOR_LIVE.

Simulation output that changes economic state, bypasses dispute holds, changes XPR authority, releases escrow, routes repayments, settles stablecoins, locks token collateral, or creates provider obligations is rejected for local clearance.

Dry-run simulation review can only create LOCAL_DRAFT_DRY_RUN_CLEARANCE and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, or create provider obligations.

## Privileged Action Post-Execution Audit Closeout Boundary

Privileged action closeout must record request_id, execution_result, executed_by_role, execution_timestamp, post_state_snapshot_hash, audit_event_id, rollback_or_hold_decision, reviewer_attestation_status, and blocked_live_gate_status before any local review can be marked complete.

Missing post-state evidence, missing audit event, mismatched execution result, unreviewed rollback need, or unresolved reviewer attestation keeps the action HOLD_FOR_CLOSEOUT_REVIEW and BLOCKED_FOR_LIVE.

Closeout review must compare the execution result with the dry-run simulation, evidence binding record, authority model, module state snapshot, and append-only audit registry before any local closeout label is accepted.

Post-execution audit closeout can only create LOCAL_DRAFT_PRIVILEGED_ACTION_CLOSEOUT and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, or create provider obligations.

## Privileged Action Failed Execution Quarantine Boundary

Failed or partially executed privileged actions must record request_id, failure_code, affected_modules, partial_state_change_summary, quarantine_started_at, recovery_owner_role, evidence_hash_or_reference, and blocked_live_gate_status before any retry, rollback, or closeout path is drafted.

A failed privileged action keeps every affected module QUARANTINED_FOR_PRIVILEGED_ACTION_REVIEW and BLOCKED_FOR_LIVE until dry-run evidence, post-state audit evidence, authority evidence, and recovery-owner attestation are reconciled.

Quarantine review must reject blind retries, silent rollbacks, audit deletion, state overwrite, repayment rerouting, escrow release, stablecoin settlement, token collateral lock changes, provider obligations, or public live-readiness claims.

Failed execution quarantine can only create LOCAL_DRAFT_PRIVILEGED_ACTION_QUARANTINE_RECORD and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, or create provider obligations.

## Privileged Action Recovery Rehearsal Boundary

Recovery rehearsal must record rehearsal_id, quarantined_request_id, recovery_plan_reference, affected_modules, pre_recovery_state_hash, expected_recovery_state_hash, reviewer_set, rollback_stop_condition, and blocked_live_gate_status before any quarantine release path is drafted.

Recovery rehearsal output that clears quarantine, changes economic state, changes XPR authority, releases escrow, routes repayments, settles stablecoins, changes token collateral locks, deletes audit events, or creates provider obligations keeps the workflow HOLD_FOR_RECOVERY_REHEARSAL and BLOCKED_FOR_LIVE.

Recovery rehearsal must compare the quarantine record, failed execution evidence, dry-run simulation, post-state audit closeout, authority model, and cross-module invariant state before local recovery clearance is accepted.

Recovery rehearsal can only create LOCAL_DRAFT_PRIVILEGED_ACTION_RECOVERY_REHEARSAL and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, or create provider obligations.

## Module Interface Version Drift Boundary

Module interface review must record module_name, interface_version, action_schema_version, event_schema_version, linked_module_versions, replay_fixture_version, source_commit, reviewer_role, and blocked_live_gate_status before cross-module clearance can be accepted.

Stale ABI/action schema, mismatched event schema, missing linked module version, wrong replay fixture, unknown source commit, or reviewer-role drift defaults to HOLD_FOR_INTERFACE_VERSION_REVIEW and BLOCKED_FOR_LIVE.

Interface version drift review can only create LOCAL_DRAFT_INTERFACE_VERSION_CLEARANCE and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, or create provider obligations.

## Audit Event Canonical Hash Boundary

Audit event canonicalization must record audit_event_id, canonical_schema_version, module_name, action_name, actor_role, request_id, previous_state_hash, next_state_hash, evidence_hash_or_reference, created_at, and blocked_live_gate_status before any audit event can support state-transition clearance.

Missing canonical schema, non-deterministic field ordering, mutable timestamp rewrites, mismatched previous or next state hashes, duplicate audit_event_id, missing request_id, or altered evidence hash defaults to HOLD_FOR_AUDIT_HASH_REVIEW and BLOCKED_FOR_LIVE.

Audit hash review can only create LOCAL_DRAFT_AUDIT_EVENT_HASH_CLEARANCE and must not rewrite audit history, mutate balances, deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, or create provider obligations.

## Signer Capability Scope Boundary

Signer capability records must bind signer_role, signer_identity_reference, allowed_modules, allowed_actions, denied_actions, authority_version, evidence_hash_or_reference, reviewer_role, expires_at, and blocked_live_gate_status before any signer can support a protected action.

A signer scoped for founder, provider, security, admin, auditor, or reviewer work cannot approve actions outside the recorded allowed modules and allowed actions, and denied actions always win over broad role labels.

Missing scope evidence, wildcard modules, wildcard actions, expired signer scope, mismatched authority version, copied signer evidence, or signer role overreach defaults to HOLD_FOR_SIGNER_SCOPE_REVIEW and BLOCKED_FOR_LIVE.

Signer capability scope review can only create LOCAL_DRAFT_SIGNER_SCOPE_CLEARANCE and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, or create provider obligations.

## Protected Action Denylist Precedence Boundary

Protected action denylist records must bind action_name, affected_module, denied_roles, denied_signer_scopes, denial_reason, authority_version, evidence_hash_or_reference, reviewer_role, expires_at, and blocked_live_gate_status before any allowlist, multisig, provider signer, or founder role label can support local clearance.

Denied actions always override broad role labels, signer scopes, allowlists, multisig quorum, provider signer approval, security signer approval, AI recommendations, frontend state, and copied approval records.

Missing denylist evidence, stale authority version, wildcard allowlist, copied approvals, mismatched module/action, or conflicting signer scope defaults to HOLD_FOR_DENYLIST_PRECEDENCE_REVIEW and BLOCKED_FOR_LIVE.

Denylist precedence review can only create LOCAL_DRAFT_DENYLIST_PRECEDENCE_CLEARANCE and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.

## Delegated Authority Chain Boundary

Delegated authority records must bind delegation_id, delegator_role, delegate_role, delegate_signer_identity_reference, allowed_modules, allowed_actions, denied_actions, delegation_reason, authority_version, evidence_hash_or_reference, expires_at, and blocked_live_gate_status before any delegated signer can support a protected action.

Delegated authority cannot expand beyond the delegator current allowed modules and allowed actions, cannot override denied actions or the protected action denylist, cannot extend expiration, and cannot create provider obligations or activate live money actions.

Missing delegation evidence, expired delegator scope, broader delegate scope, stale authority version, chained delegation without founder and security review, or mismatched signer identity defaults to HOLD_FOR_DELEGATED_AUTHORITY_REVIEW and BLOCKED_FOR_LIVE.

Delegated authority review can only create LOCAL_DRAFT_DELEGATED_AUTHORITY_CLEARANCE and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.

## Authority Revocation Propagation Boundary

Authority revocation records must bind revocation_id, revoked_role, revoked_signer_identity_reference, affected_modules, affected_actions, revocation_reason, authority_version, role_assignment_version, evidence_hash_or_reference, revoked_at, reviewer_role, and blocked_live_gate_status before any protected action can rely on prior signer or role evidence.

Revocation must propagate to direct signer scopes, delegated authority records, allowlists, pending privileged actions, dry-run clearances, timelock windows, recovery rehearsals, and post-execution closeouts before local clearance can continue.

Missing revocation evidence, stale role assignment version, unpropagated delegation, pending action overlap, copied pre-revocation approval, or conflicting signer status defaults to HOLD_FOR_REVOCATION_PROPAGATION_REVIEW and BLOCKED_FOR_LIVE.

Revocation propagation review can only create LOCAL_DRAFT_REVOCATION_PROPAGATION_CLEARANCE and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.

## Authority Evidence Supersession Boundary

Authority evidence supersession records must bind supersession_id, superseded_evidence_hash_or_reference, replacement_evidence_hash_or_reference, affected_roles, affected_signers, affected_modules, affected_actions, supersession_reason, authority_version, role_assignment_version, created_at, reviewer_role, and blocked_live_gate_status before replaced authority evidence can support any protected action.

Superseded evidence cannot approve signer scope, delegated authority, allowlist, denylist exception, privileged action, revocation propagation, recovery rehearsal, or post-execution closeout after a newer authority version or role assignment version exists.

Missing supersession linkage, stale replacement evidence, conflicting evidence hashes, copied superseded approvals, unreviewed version drift, or unresolved revocation overlap defaults to HOLD_FOR_AUTHORITY_EVIDENCE_SUPERSESSION_REVIEW and BLOCKED_FOR_LIVE.

Authority evidence supersession review can only create LOCAL_DRAFT_AUTHORITY_EVIDENCE_SUPERSESSION_CLEARANCE and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.

## Authority Exception Request Boundary

Authority exception request records must bind exception_id, requested_by_role, reviewer_role, affected_module, affected_action, exception_reason, requested_scope, denied_action_check, revocation_check, supersession_check, expiration, evidence_hash_or_reference, and blocked_live_gate_status before any exception can be considered for local review.

Exception requests cannot override protected action denylists, revoked signer status, superseded authority evidence, expired delegations, cross-module invariant conflicts, two-person review, timelocks, or blocked-live gates.

Missing exception evidence, broad wildcard scope, stale authority version, unresolved revocation, superseded approval evidence, denied action overlap, or missing independent reviewer defaults to HOLD_FOR_AUTHORITY_EXCEPTION_REVIEW and BLOCKED_FOR_LIVE.

Authority exception review can only create LOCAL_DRAFT_AUTHORITY_EXCEPTION_CLEARANCE and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.

## Authority Break-Glass Recovery Boundary

Authority break-glass recovery records must bind break_glass_id, triggering_incident_id, requested_by_role, approver_role, affected_module, affected_action, temporary_scope, start_at, expires_at, revocation_plan_reference, evidence_hash_or_reference, reviewer_role, and blocked_live_gate_status before any emergency authority path can be drafted.

Break-glass authority cannot bypass protected action denylists, two-person review, timelocks where live-risk exists, revoked signer status, superseded evidence, cross-module invariant conflicts, or blocked-live gates, and cannot become permanent authority.

Missing incident evidence, wildcard temporary scope, missing expiration, same-signer approval, unresolved revocation, stale authority version, or missing closeout plan defaults to HOLD_FOR_BREAK_GLASS_RECOVERY_REVIEW and BLOCKED_FOR_LIVE.

Break-glass recovery review can only create LOCAL_DRAFT_BREAK_GLASS_RECOVERY_CLEARANCE and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.

## State Transition Guards

Every state transition must be explicit and replayable.

Required transition guards:

- project registry cannot create a live legal collateral claim;
- milestone state cannot move from evidence submitted to release eligible without review, approval, no active dispute, and audit event;
- loan ledger cannot move from requested to funded without external provider review evidence and blocked-live gate clearance;
- repayment router cannot compute live routing without approved milestone, no active dispute, outstanding-balance cap, provider/payment/legal terms, and audit event;
- collateral module cannot enable token collateral without custody, oracle, LTV, liquidation, legal, provider, security, and founder approvals;
- reputation module must preserve correction/review path;
- dispute module must block release and repayment until resolution conditions are recorded;
- audit registry must record actor, role, request ID, previous state, next state, safety gate, and approval status.

## Audit Trail Requirements

Every module must emit audit events for:

- role grants, role revokes, authority changes, multisig evidence, provider gate evidence, security gate evidence;
- project creation, milestone creation, evidence submission, review, approval recommendation, dispute pause, dispute resolution, archive;
- loan request, score recommendation, provider review record, offer draft, repayment plan draft, repayment allocation draft, closeout label;
- collateral estimate, price snapshot, LTV check, collateral blocked/unblocked status, liquidation blocked status;
- reputation review, score record, abuse flag, correction record;
- emergency pause, unpause, upgrade proposal, upgrade approval, rollback or recovery action.

Audit events must be append-only and non-secret. They must include request ID, module, action name, actor role, previous state, next state, safety gate, provider review status, founder approval status, legal/provider status, and created timestamp where applicable.

## Deployment And Live-Use Gates

Smart contract modules remain local-only until all required gates are recorded outside the autonomous system:

- founder scope approval;
- legal/provider review;
- finance-provider review where contractor credit or repayment is involved;
- escrow/payment provider review where funds or custody are involved;
- stablecoin/provider/compliance review where settlement is involved;
- token collateral legal/custody/oracle/LTV/liquidation review where collateral is involved;
- security review;
- no-real-money local tests;
- XPR account creation and authority setup by the founder;
- multisig threshold approval;
- public wording review;
- final deployment approval.

Until then, the correct status is `LOCAL_ONLY`, `PASS_LOCAL_ONLY`, or `BLOCKED_FOR_LIVE`, never `APPROVED_FOR_LIVE`.

## Required Review Fixtures

The module split review must be covered by local fixtures that prove:

1. A single-key deploy path is rejected.
2. Hidden owner-only drain is rejected.
3. Arbitrary balance mutation is rejected.
4. Hidden upgrade path is rejected.
5. Contractor self-approval is rejected.
6. AI-only final approval is rejected.
7. Dispute-to-release bypass is rejected.
8. Repayment above outstanding balance is rejected.
9. Negative contractor payout is rejected.
10. Token collateral live enablement is rejected.
11. Authority change without audit event is rejected.
12. Live deployment remains `BLOCKED_FOR_LIVE` without external founder/legal/provider/security/XPR evidence.

## Required Checks

- `npm run check:whitepaper-v1-2-smart-contract-module-split-anti-backdoor`
- `npm run check:whitepaper-v1-2-smart-contract-architecture`
- `npm run check:smart-contract-authority-model`
- `npm run check:smart-contract-audit-event-map`
- `npm run check:smart-contract-implementation-gate`
- `npm run check:whitepaper-v1-2-contract-backed-loan-technical-requirements`
- `npm run check`
