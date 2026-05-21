import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const reviewPath = resolve('..', 'docs', 'whitepaper-v1-2-smart-contract-module-split-anti-backdoor-review.md');
const architecturePackagePath = resolve('..', 'docs', 'gcsc-v1-2-core-architecture-package.md');
const smartContractDraftPath = resolve('..', 'docs', 'whitepaper-v1-2-smart-contract-architecture-draft.md');
const authorityPath = resolve('..', 'docs', 'smartcontractor-smart-contract-authority-model.md');
const auditEventMapPath = resolve('..', 'docs', 'smartcontractor-smart-contract-audit-event-map.md');
const implementationGatePath = resolve('..', 'docs', 'smartcontractor-smart-contract-implementation-gate.md');
const technicalRequirementsPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-technical-requirements.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Whitepaper v1.2 smart contract module split anti-backdoor validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const review = readRequired(reviewPath);
const architecturePackage = readRequired(architecturePackagePath);
const smartContractDraft = readRequired(smartContractDraftPath);
const authority = readRequired(authorityPath);
const auditEventMap = readRequired(auditEventMapPath);
const implementationGate = readRequired(implementationGatePath);
const technicalRequirements = readRequired(technicalRequirementsPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'GCSC Whitepaper v1.2 Smart Contract Module Split And Anti-Backdoor Review',
  'Purpose',
  'Module Split Decision',
  'Authority Model Requirements',
  'Anti-Backdoor Rules',
  'Emergency Pause Settlement Boundary',
  'Upgrade Authority Recovery Boundary',
  'Cross-Module Invariant Conflict Boundary',
  'Privileged Action Two-Person Rule Boundary',
  'Privileged Action Timelock And Expiration Boundary',
  'Privileged Action Replay And Evidence Binding Boundary',
  'Privileged Action Reviewer Revocation And Role Drift Boundary',
  'Privileged Action Dry-Run Simulation Boundary',
  'Privileged Action Post-Execution Audit Closeout Boundary',
  'Privileged Action Failed Execution Quarantine Boundary',
  'Privileged Action Recovery Rehearsal Boundary',
  'Module Interface Version Drift Boundary',
  'Audit Event Canonical Hash Boundary',
  'Non-Secret Evidence Privacy Boundary',
  'Signer Capability Scope Boundary',
  'Protected Action Denylist Precedence Boundary',
  'Delegated Authority Chain Boundary',
  'Authority Revocation Propagation Boundary',
  'Authority Evidence Supersession Boundary',
  'Authority Exception Request Boundary',
  'Authority Break-Glass Recovery Boundary',
  'Authority Closeout Reconciliation Boundary',
  'Authority Closeout Reopen Boundary',
  'Authority Closeout Appeal Boundary',
  'Authority Closeout Appeal Resolution Boundary',
  'Authority Closeout Appeal Resolution Archive Boundary',
  'Authority Closeout Appeal Resolution Archive Retention Boundary',
  'Authority Closeout Appeal Resolution Archive Retention Review Boundary',
  'Authority Closeout Appeal Resolution Archive Retention Review Closeout Boundary',
  'Authority Closeout Appeal Resolution Archive Retention Review Closeout Archive Boundary',
  'Authority Closeout Appeal Resolution Archive Retention Review Closeout Archive Index Boundary',
  'Authority Closeout Appeal Resolution Archive Retention Review Closeout Archive Index Closeout Boundary',
  'Authority Closeout Appeal Resolution Archive Retention Review Closeout Archive Index Handoff Boundary',
  'Authority Closeout Appeal Resolution Archive Retention Review Closeout Archive Index Handoff Closeout Boundary',
  'Authority Closeout Appeal Resolution Archive Retention Review Closeout Archive Index Handoff Closeout Archive Boundary',
  'Authority Closeout Appeal Resolution Archive Retention Review Closeout Archive Index Handoff Closeout Archive Index Boundary',
  'Authority Closeout Appeal Resolution Archive Retention Review Closeout Archive Index Handoff Closeout Archive Index Closeout Boundary',
  'Authority Closeout Appeal Resolution Archive Retention Review Closeout Archive Index Handoff Closeout Archive Index Closeout Archive Boundary',
  'Authority Closeout Appeal Resolution Archive Retention Review Closeout Archive Index Handoff Closeout Archive Index Closeout Archive Index Boundary',
  'Authority Closeout Appeal Resolution Archive Retention Review Closeout Archive Index Handoff Closeout Archive Index Closeout Archive Index Closeout Boundary',
  'Authority Closeout Appeal Resolution Archive Retention Review Closeout Archive Index Handoff Closeout Archive Index Closeout Archive Index Closeout Archive Boundary',
  'Authority Closeout Appeal Resolution Archive Retention Review Closeout Archive Index Handoff Closeout Archive Index Closeout Archive Index Closeout Archive Index Boundary',
  'Authority Closeout Appeal Resolution Archive Retention Review Closeout Archive Index Handoff Closeout Archive Index Closeout Archive Index Closeout Archive Index Closeout Boundary',
  'Authority Closeout Appeal Resolution Archive Retention Review Closeout Archive Index Handoff Closeout Archive Index Closeout Archive Index Closeout Archive Index Closeout Archive Boundary',
  'Founder Evening Smart Contract Authority Decision Record',
  'Founder Evening Smart Contract Security Reviewer Handoff Matrix',
  'Founder Evening Smart Contract Local Implementation Handoff Matrix',
  'State Transition Guards',
  'Audit Trail Requirements',
  'Deployment And Live-Use Gates',
  'Required Review Fixtures',
  'Required Checks',
]) assertIncludes(review, section, reviewPath);

for (const required of [
  'internal smart contract architecture review only',
  'not approval to deploy live XPR contracts',
  'not approval to launch real escrow',
  'not approval to launch real loans',
  'not approval to launch real repayment routing',
  'not approval to launch stablecoin settlement',
  'not approval to launch token collateral',
  'not approval to publish public wording',
  'not one monolith',
  'Authority And Role Module',
  'Project Contract Registry',
  'Milestone And Escrow-Ready State Machine',
  'Contract-Backed Loan Ledger',
  'Repayment Waterfall Router',
  'Collateral And Risk Module',
  'Reputation And Review Ledger',
  'Dispute And Human Override Module',
  'Audit And Compliance Registry',
  'hidden owner-only drain',
  'frontend-controlled authority',
  'single-key production deployment',
  'repayment above outstanding balance',
  'negative contractor payout',
  'auto-liquidation of real token collateral',
  'arbitrary oracle trust',
  'mutable audit history',
  'service-role key in browser code',
  'Unpause must require stronger approval than pause',
  'Emergency pause may stop new actions',
  'must not move funds',
  'Emergency pause is not a settlement primitive',
  'pause cannot approve loans, release escrow, route repayments, liquidate collateral, mutate balances, upgrade contracts, or rewrite audit history',
  'paused modules may record append-only audit events and blocked-live evidence only',
  'unpause requires founder multisig, provider review where money flows are involved, security review, and an audit event',
  'Upgrade authority is not a stealth-change path',
  'upgrade proposals must identify the module, action, migration reason, risk class, rollback path, and affected state',
  'upgrades cannot add owner drains, mutable audit history, arbitrary balance mutation, AI-only approval, dispute bypass, repayment bypass, token-collateral activation, or public-live claims',
  'rollback or recovery actions require founder multisig, security review, append-only audit evidence, and blocked-live status until external approvals are recorded',
  'If two modules disagree about status, authority, dispute state, repayment eligibility, collateral state, or live-use readiness, the most restrictive state wins.',
  'No module may downgrade BLOCKED_FOR_LIVE, DISPUTED, PAUSED, HOLD, or REVIEW_REQUIRED to a live, payable, releasable, fundable, repayable, or collateral-enabled state without append-only evidence from every affected module.',
  'Cross-module invariants must reject partial replay output, missing audit events, stale request IDs, mismatched project IDs, mismatched milestone IDs, mismatched loan IDs, or contradictory actor roles.',
  'Missing or conflicting invariant evidence keeps the workflow HOLD_FOR_REVIEW and BLOCKED_FOR_LIVE; it must never default to approval, settlement, repayment, escrow release, loan funding, stablecoin settlement, or token-collateral enablement.',
  'Every privileged action must record proposer_role, approver_role, affected_module, affected_action, request_id, evidence_hash_or_reference, approval_expiration, and blocked_live_gate_status before it can move beyond local review.',
  'The proposer and approver for deployment, upgrade, unpause, authority change, provider signer activation, emergency recovery, or live-risk enablement must be different roles and different signer identities.',
  'Founder-only, admin-only, provider-only, security-only, AI-only, frontend-only, or same-signer approval must keep the action HOLD_FOR_TWO_PERSON_REVIEW and BLOCKED_FOR_LIVE.',
  'Two-person review can only create LOCAL_DRAFT_PRIVILEGED_ACTION_APPROVAL and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, or create provider obligations.',
  'Privileged action requests must record created_at, earliest_execution_at, expires_at, review_window_reason, proposer_role, approver_role, affected_module, affected_action, request_id, and blocked_live_gate_status before any execution path is drafted.',
  'Deployment, upgrade, unpause, authority change, provider signer activation, emergency recovery, or live-risk enablement must remain PENDING_TIMELOCK_REVIEW until the review window has elapsed and all required review evidence is still current.',
  'Expired, stale, rushed, backdated, missing-window, mismatched-timestamp, or reviewer-changed privileged actions default to HOLD_FOR_TIMELOCK_REVIEW and BLOCKED_FOR_LIVE.',
  'Timelock review can only create LOCAL_DRAFT_TIMELOCK_CLEARANCE and must not execute contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, or create provider obligations.',
  'Privileged action evidence must bind request_id, actor_role, signer_identity_reference, affected_module, affected_action, prior_state_hash, expected_next_state, evidence_hash_or_reference, created_at, and nonce before local approval artifacts are generated.',
  'Replay, duplicate nonce, mismatched evidence hash, changed affected action, changed signer, stale request ID, or missing prior-state binding keeps the action HOLD_FOR_REPLAY_REVIEW and BLOCKED_FOR_LIVE.',
  'Evidence binding review must compare the proposed privileged action against the audit registry, module state snapshot, authority model, and blocked-live gate before any local clearance is recorded.',
  'Replay and evidence binding review can only create LOCAL_DRAFT_EVIDENCE_BINDING_CLEARANCE and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, or create provider obligations.',
  'Privileged action clearance must re-check reviewer_role_status, signer_status, provider_status, security_reviewer_status, founder_multisig_status, authority_version, and role_assignment_version immediately before local approval artifacts are accepted.',
  'Revoked, rotated, expired, suspended, conflicted, provider-offboarded, security-reviewer-changed, founder-signer-changed, or authority-version-drifted reviewer evidence defaults to HOLD_FOR_ROLE_DRIFT_REVIEW and BLOCKED_FOR_LIVE.',
  'Role drift review must require fresh non-secret evidence from every affected reviewer class before it can replace stale privileged-action clearance.',
  'Reviewer revocation and role drift review can only create LOCAL_DRAFT_ROLE_DRIFT_CLEARANCE and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, or create provider obligations.',
  'Privileged action dry-runs must record simulation_id, request_id, affected_module, affected_action, pre_state_snapshot_hash, expected_post_state_hash, blocked_live_gate_status, rollback_plan_reference, and reviewer_set before any live-risk clearance is drafted.',
  'Deployment, upgrade, unpause, authority change, provider signer activation, emergency recovery, or live-risk enablement that lacks a matching local replay simulation must remain HOLD_FOR_DRY_RUN_REVIEW and BLOCKED_FOR_LIVE.',
  'Simulation output that changes economic state, bypasses dispute holds, changes XPR authority, releases escrow, routes repayments, settles stablecoins, locks token collateral, or creates provider obligations is rejected for local clearance.',
  'Dry-run simulation review can only create LOCAL_DRAFT_DRY_RUN_CLEARANCE and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, or create provider obligations.',
  'Privileged action closeout must record request_id, execution_result, executed_by_role, execution_timestamp, post_state_snapshot_hash, audit_event_id, rollback_or_hold_decision, reviewer_attestation_status, and blocked_live_gate_status before any local review can be marked complete.',
  'Missing post-state evidence, missing audit event, mismatched execution result, unreviewed rollback need, or unresolved reviewer attestation keeps the action HOLD_FOR_CLOSEOUT_REVIEW and BLOCKED_FOR_LIVE.',
  'Closeout review must compare the execution result with the dry-run simulation, evidence binding record, authority model, module state snapshot, and append-only audit registry before any local closeout label is accepted.',
  'Post-execution audit closeout can only create LOCAL_DRAFT_PRIVILEGED_ACTION_CLOSEOUT and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, or create provider obligations.',
  'Failed or partially executed privileged actions must record request_id, failure_code, affected_modules, partial_state_change_summary, quarantine_started_at, recovery_owner_role, evidence_hash_or_reference, and blocked_live_gate_status before any retry, rollback, or closeout path is drafted.',
  'A failed privileged action keeps every affected module QUARANTINED_FOR_PRIVILEGED_ACTION_REVIEW and BLOCKED_FOR_LIVE until dry-run evidence, post-state audit evidence, authority evidence, and recovery-owner attestation are reconciled.',
  'Quarantine review must reject blind retries, silent rollbacks, audit deletion, state overwrite, repayment rerouting, escrow release, stablecoin settlement, token collateral lock changes, provider obligations, or public live-readiness claims.',
  'Failed execution quarantine can only create LOCAL_DRAFT_PRIVILEGED_ACTION_QUARANTINE_RECORD and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, or create provider obligations.',
  'Recovery rehearsal must record rehearsal_id, quarantined_request_id, recovery_plan_reference, affected_modules, pre_recovery_state_hash, expected_recovery_state_hash, reviewer_set, rollback_stop_condition, and blocked_live_gate_status before any quarantine release path is drafted.',
  'Recovery rehearsal output that clears quarantine, changes economic state, changes XPR authority, releases escrow, routes repayments, settles stablecoins, changes token collateral locks, deletes audit events, or creates provider obligations keeps the workflow HOLD_FOR_RECOVERY_REHEARSAL and BLOCKED_FOR_LIVE.',
  'Recovery rehearsal must compare the quarantine record, failed execution evidence, dry-run simulation, post-state audit closeout, authority model, and cross-module invariant state before local recovery clearance is accepted.',
  'Recovery rehearsal can only create LOCAL_DRAFT_PRIVILEGED_ACTION_RECOVERY_REHEARSAL and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, or create provider obligations.',
  'Module interface review must record module_name, interface_version, action_schema_version, event_schema_version, linked_module_versions, replay_fixture_version, source_commit, reviewer_role, and blocked_live_gate_status before cross-module clearance can be accepted.',
  'Stale ABI/action schema, mismatched event schema, missing linked module version, wrong replay fixture, unknown source commit, or reviewer-role drift defaults to HOLD_FOR_INTERFACE_VERSION_REVIEW and BLOCKED_FOR_LIVE.',
  'Interface version drift review can only create LOCAL_DRAFT_INTERFACE_VERSION_CLEARANCE and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, or create provider obligations.',
  'Audit event canonicalization must record audit_event_id, canonical_schema_version, module_name, action_name, actor_role, request_id, previous_state_hash, next_state_hash, evidence_hash_or_reference, created_at, and blocked_live_gate_status before any audit event can support state-transition clearance.',
  'Missing canonical schema, non-deterministic field ordering, mutable timestamp rewrites, mismatched previous or next state hashes, duplicate audit_event_id, missing request_id, or altered evidence hash defaults to HOLD_FOR_AUDIT_HASH_REVIEW and BLOCKED_FOR_LIVE.',
  'Audit hash review can only create LOCAL_DRAFT_AUDIT_EVENT_HASH_CLEARANCE and must not rewrite audit history, mutate balances, deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, or create provider obligations.',
  'Non-secret evidence records must bind evidence_id, evidence_type, redaction_status, allowed_reviewer_roles, private_data_excluded, secret_excluded, source_file_or_reference, evidence_hash_or_reference, reviewer_role, created_at, and blocked_live_gate_status before audit evidence can support any authority, deployment, escrow, loan, repayment, stablecoin, token-collateral, or provider review path.',
  'Evidence that includes raw identity documents, private keys, seed phrases, service-role keys, passwords, raw bank data, SSNs, wallet private data, unredacted customer contact details, or copied external account credentials defaults to HOLD_FOR_PRIVACY_REDACTION_REVIEW and BLOCKED_FOR_LIVE.',
  'Non-secret evidence privacy review can only create LOCAL_DRAFT_REDACTED_EVIDENCE_REFERENCE and must not expose secrets, publish private data, deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, approve loans, or create provider commitments.',
  'Signer capability records must bind signer_role, signer_identity_reference, allowed_modules, allowed_actions, denied_actions, authority_version, evidence_hash_or_reference, reviewer_role, expires_at, and blocked_live_gate_status before any signer can support a protected action.',
  'A signer scoped for founder, provider, security, admin, auditor, or reviewer work cannot approve actions outside the recorded allowed modules and allowed actions, and denied actions always win over broad role labels.',
  'Missing scope evidence, wildcard modules, wildcard actions, expired signer scope, mismatched authority version, copied signer evidence, or signer role overreach defaults to HOLD_FOR_SIGNER_SCOPE_REVIEW and BLOCKED_FOR_LIVE.',
  'Signer capability scope review can only create LOCAL_DRAFT_SIGNER_SCOPE_CLEARANCE and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, or create provider obligations.',
  'Protected action denylist records must bind action_name, affected_module, denied_roles, denied_signer_scopes, denial_reason, authority_version, evidence_hash_or_reference, reviewer_role, expires_at, and blocked_live_gate_status before any allowlist, multisig, provider signer, or founder role label can support local clearance.',
  'Denied actions always override broad role labels, signer scopes, allowlists, multisig quorum, provider signer approval, security signer approval, AI recommendations, frontend state, and copied approval records.',
  'Missing denylist evidence, stale authority version, wildcard allowlist, copied approvals, mismatched module/action, or conflicting signer scope defaults to HOLD_FOR_DENYLIST_PRECEDENCE_REVIEW and BLOCKED_FOR_LIVE.',
  'Denylist precedence review can only create LOCAL_DRAFT_DENYLIST_PRECEDENCE_CLEARANCE and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'Delegated authority records must bind delegation_id, delegator_role, delegate_role, delegate_signer_identity_reference, allowed_modules, allowed_actions, denied_actions, delegation_reason, authority_version, evidence_hash_or_reference, expires_at, and blocked_live_gate_status before any delegated signer can support a protected action.',
  'Delegated authority cannot expand beyond the delegator current allowed modules and allowed actions, cannot override denied actions or the protected action denylist, cannot extend expiration, and cannot create provider obligations or activate live money actions.',
  'Missing delegation evidence, expired delegator scope, broader delegate scope, stale authority version, chained delegation without founder and security review, or mismatched signer identity defaults to HOLD_FOR_DELEGATED_AUTHORITY_REVIEW and BLOCKED_FOR_LIVE.',
  'Delegated authority review can only create LOCAL_DRAFT_DELEGATED_AUTHORITY_CLEARANCE and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'Authority revocation records must bind revocation_id, revoked_role, revoked_signer_identity_reference, affected_modules, affected_actions, revocation_reason, authority_version, role_assignment_version, evidence_hash_or_reference, revoked_at, reviewer_role, and blocked_live_gate_status before any protected action can rely on prior signer or role evidence.',
  'Revocation must propagate to direct signer scopes, delegated authority records, allowlists, pending privileged actions, dry-run clearances, timelock windows, recovery rehearsals, and post-execution closeouts before local clearance can continue.',
  'Missing revocation evidence, stale role assignment version, unpropagated delegation, pending action overlap, copied pre-revocation approval, or conflicting signer status defaults to HOLD_FOR_REVOCATION_PROPAGATION_REVIEW and BLOCKED_FOR_LIVE.',
  'Revocation propagation review can only create LOCAL_DRAFT_REVOCATION_PROPAGATION_CLEARANCE and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'Authority evidence supersession records must bind supersession_id, superseded_evidence_hash_or_reference, replacement_evidence_hash_or_reference, affected_roles, affected_signers, affected_modules, affected_actions, supersession_reason, authority_version, role_assignment_version, created_at, reviewer_role, and blocked_live_gate_status before replaced authority evidence can support any protected action.',
  'Superseded evidence cannot approve signer scope, delegated authority, allowlist, denylist exception, privileged action, revocation propagation, recovery rehearsal, or post-execution closeout after a newer authority version or role assignment version exists.',
  'Missing supersession linkage, stale replacement evidence, conflicting evidence hashes, copied superseded approvals, unreviewed version drift, or unresolved revocation overlap defaults to HOLD_FOR_AUTHORITY_EVIDENCE_SUPERSESSION_REVIEW and BLOCKED_FOR_LIVE.',
  'Authority evidence supersession review can only create LOCAL_DRAFT_AUTHORITY_EVIDENCE_SUPERSESSION_CLEARANCE and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'Authority exception request records must bind exception_id, requested_by_role, reviewer_role, affected_module, affected_action, exception_reason, requested_scope, denied_action_check, revocation_check, supersession_check, expiration, evidence_hash_or_reference, and blocked_live_gate_status before any exception can be considered for local review.',
  'Exception requests cannot override protected action denylists, revoked signer status, superseded authority evidence, expired delegations, cross-module invariant conflicts, two-person review, timelocks, or blocked-live gates.',
  'Missing exception evidence, broad wildcard scope, stale authority version, unresolved revocation, superseded approval evidence, denied action overlap, or missing independent reviewer defaults to HOLD_FOR_AUTHORITY_EXCEPTION_REVIEW and BLOCKED_FOR_LIVE.',
  'Authority exception review can only create LOCAL_DRAFT_AUTHORITY_EXCEPTION_CLEARANCE and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'Authority break-glass recovery records must bind break_glass_id, triggering_incident_id, requested_by_role, approver_role, affected_module, affected_action, temporary_scope, start_at, expires_at, revocation_plan_reference, evidence_hash_or_reference, reviewer_role, and blocked_live_gate_status before any emergency authority path can be drafted.',
  'Break-glass authority cannot bypass protected action denylists, two-person review, timelocks where live-risk exists, revoked signer status, superseded evidence, cross-module invariant conflicts, or blocked-live gates, and cannot become permanent authority.',
  'Missing incident evidence, wildcard temporary scope, missing expiration, same-signer approval, unresolved revocation, stale authority version, or missing closeout plan defaults to HOLD_FOR_BREAK_GLASS_RECOVERY_REVIEW and BLOCKED_FOR_LIVE.',
  'Break-glass recovery review can only create LOCAL_DRAFT_BREAK_GLASS_RECOVERY_CLEARANCE and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'Authority closeout reconciliation records must bind closeout_id, source_request_id, source_request_type, affected_roles, affected_signers, affected_modules, affected_actions, final_authority_state, revocation_status, supersession_status, exception_status, break_glass_status, evidence_hash_or_reference, reviewer_role, closed_at, and blocked_live_gate_status before any authority-related request can be marked locally closed.',
  'Closeout reconciliation must compare signer scope, delegated authority, denylist precedence, revocation propagation, evidence supersession, exception requests, break-glass recovery, privileged action audit closeout, and cross-module invariant state before local closure is accepted.',
  'Missing closeout evidence, unresolved temporary scope, stale authority version, open revocation, superseded evidence still referenced, pending exception, active break-glass window, or conflicting module state defaults to HOLD_FOR_AUTHORITY_CLOSEOUT_RECONCILIATION and BLOCKED_FOR_LIVE.',
  'Authority closeout reconciliation can only create LOCAL_DRAFT_AUTHORITY_CLOSEOUT_RECORD and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'Authority closeout reopen records must bind reopen_id, prior_closeout_id, reopened_by_role, reviewer_role, reopen_reason, affected_roles, affected_signers, affected_modules, affected_actions, prior_closeout_hash_or_reference, new_evidence_hash_or_reference, authority_version, created_at, and blocked_live_gate_status before any closed authority record can be reconsidered locally.',
  'Closed authority records cannot be silently edited, deleted, overwritten, or reused after new revocation, supersession, exception, break-glass, signer scope, delegated authority, or cross-module invariant evidence appears.',
  'Missing reopen reason, missing prior closeout hash, stale authority version, same-role self-review, copied closeout evidence, unresolved live-risk action, or mismatched affected module defaults to HOLD_FOR_AUTHORITY_CLOSEOUT_REOPEN_REVIEW and BLOCKED_FOR_LIVE.',
  'Authority closeout reopen review can only create LOCAL_DRAFT_AUTHORITY_CLOSEOUT_REOPEN_RECORD and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'Authority closeout appeal records must bind appeal_id, appealed_closeout_id, appealed_by_role, reviewer_role, appeal_reason, affected_roles, affected_signers, affected_modules, affected_actions, prior_reopen_id_or_none, challenged_evidence_hash_or_reference, requested_outcome, authority_version, created_at, expires_at, and blocked_live_gate_status before any local appeal can be reviewed.',
  'Appeals cannot approve live actions, skip closeout reopen requirements, override protected action denylists, ignore revoked signer status, reuse superseded evidence, extend break-glass authority, or reverse cross-module invariant holds.',
  'Missing appeal evidence, missing challenged evidence hash, stale authority version, expired appeal window, same-role self-review, requested live-risk outcome, or conflicting reopen state defaults to HOLD_FOR_AUTHORITY_CLOSEOUT_APPEAL_REVIEW and BLOCKED_FOR_LIVE.',
  'Authority closeout appeal review can only create LOCAL_DRAFT_AUTHORITY_CLOSEOUT_APPEAL_RECORD and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'Authority closeout appeal resolution records must bind resolution_id, appeal_id, appealed_closeout_id, resolved_by_role, reviewer_role, resolution_outcome, resolution_reason, affected_roles, affected_signers, affected_modules, affected_actions, evidence_hash_or_reference, authority_version, created_at, resolved_at, and blocked_live_gate_status before any local appeal can be marked resolved.',
  'Appeal resolution cannot approve live actions, mutate the original closeout record, delete appeal records, bypass reopen evidence, reactivate revoked signers, reuse superseded evidence, extend break-glass authority, override protected action denylists, or create provider obligations.',
  'Missing resolution reason, missing appeal id, missing challenged evidence, stale authority version, same-role self-resolution, conflicting reopen state, unresolved live-risk outcome, or mismatched affected module defaults to HOLD_FOR_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_REVIEW and BLOCKED_FOR_LIVE.',
  'Authority closeout appeal resolution can only create LOCAL_DRAFT_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_RECORD and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'Authority closeout appeal resolution archive records must bind archive_id, resolution_id, appeal_id, appealed_closeout_id, archived_by_role, archive_reason, archive_status, evidence_hash_or_reference, authority_version, created_at, archived_at, retention_review_at, and blocked_live_gate_status before any local resolution archive can be marked complete.',
  'Resolution archives cannot delete source appeal records, mutate closeout or resolution records, approve live actions, bypass retention review, hide revoked signer evidence, reuse superseded evidence as current authority, override protected action denylists, or create provider obligations.',
  'Missing archive reason, missing resolution id, missing evidence hash, stale authority version, unresolved retention review, copied archive id, unresolved live-risk outcome, or mismatched appealed closeout defaults to HOLD_FOR_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_REVIEW and BLOCKED_FOR_LIVE.',
  'Authority closeout appeal resolution archiving can only create LOCAL_DRAFT_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RECORD and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'Authority closeout appeal resolution archive retention records must bind retention_id, archive_id, resolution_id, appeal_id, appealed_closeout_id, retention_owner_role, retention_reason, retention_period, retention_status, evidence_hash_or_reference, authority_version, created_at, review_due_at, and blocked_live_gate_status before any archived appeal resolution can be retained, purged, or marked for review locally.',
  'Archive retention cannot purge source appeal evidence, hide authority-risk evidence, mutate closeout or resolution records, approve live actions, bypass founder/legal/provider review, reactivate revoked signers, reuse superseded evidence as current authority, or create provider obligations.',
  'Missing retention reason, missing archive id, missing retention owner role, stale authority version, unresolved review due date, copied retention record, purge request with live-risk evidence, or mismatched closeout id defaults to HOLD_FOR_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW and BLOCKED_FOR_LIVE.',
  'Authority closeout appeal resolution archive retention can only create LOCAL_DRAFT_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_RECORD and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'Authority closeout appeal resolution archive retention review records must bind review_id, retention_id, archive_id, resolution_id, appeal_id, appealed_closeout_id, reviewer_role, review_reason, review_outcome, evidence_hash_or_reference, authority_version, created_at, reviewed_at, next_review_due_at_or_none, and blocked_live_gate_status before any retained archive can change local retention state.',
  'Retention reviews cannot purge source evidence, approve live actions, mutate authority records, shorten retention below review policy, hide revoked signer evidence, treat superseded evidence as current authority, bypass founder/legal/provider review, or create provider obligations.',
  'Missing review reason, missing retention id, missing reviewer role, stale authority version, same-role self-review, unresolved next review date, live-risk purge request, or mismatched archive id defaults to HOLD_FOR_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_RECORD and BLOCKED_FOR_LIVE.',
  'Authority closeout appeal resolution archive retention review can only create LOCAL_DRAFT_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_RECORD and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'Authority closeout appeal resolution archive retention review closeout records must bind closeout_id, review_id, retention_id, archive_id, resolution_id, appeal_id, appealed_closeout_id, closed_by_role, closeout_reason, closeout_status, evidence_hash_or_reference, authority_version, created_at, closed_at, next_review_due_at_or_none, and blocked_live_gate_status before any local retention review can be closed.',
  'Retention review closeout cannot purge source evidence, mutate authority records, approve live actions, erase review history, hide revoked signer evidence, shorten active retention periods, bypass founder/legal/provider review, or create provider obligations.',
  'Missing closeout reason, missing review id, missing retention id, stale authority version, same-role self-closeout, unresolved retention action, unresolved live-risk evidence, or mismatched archive id defaults to HOLD_FOR_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT and BLOCKED_FOR_LIVE.',
  'Authority closeout appeal resolution archive retention review closeout can only create LOCAL_DRAFT_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_RECORD and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'Authority closeout appeal resolution archive retention review closeout archive records must bind closeout_archive_id, closeout_id, review_id, retention_id, archive_id, resolution_id, appeal_id, appealed_closeout_id, archived_by_role, archive_reason, evidence_hash_or_reference, authority_version, created_at, archived_at, retention_period_or_review_due, and blocked_live_gate_status before any retention review closeout can be archived locally.',
  'Retention review closeout archives cannot purge source evidence, mutate closeout or review records, approve live actions, erase review dissent, hide revoked signer evidence, shorten retention, bypass founder/legal/provider review, or create provider obligations.',
  'Missing archive reason, missing closeout id, missing evidence hash, stale authority version, same-role self-archive, unresolved dissent, live-risk purge request, or mismatched retention id defaults to HOLD_FOR_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE and BLOCKED_FOR_LIVE.',
  'Authority closeout appeal resolution archive retention review closeout archive can only create LOCAL_DRAFT_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_RECORD and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'Authority closeout appeal resolution archive retention review closeout archive index records must bind index_id, closeout_archive_id, closeout_id, review_id, retention_id, archive_id, resolution_id, appeal_id, appealed_closeout_id, indexed_by_role, index_reason, evidence_hash_or_reference, authority_version, created_at, indexed_at, source_record_count, and blocked_live_gate_status before any local closeout archive can become discoverable in an index.',
  'Closeout archive indexes cannot purge source evidence, mutate archive or review records, approve live actions, hide reviewer dissent, hide revoked signer evidence, collapse multiple records into one untraceable entry, bypass retention policy, or create provider obligations.',
  'Missing index reason, missing archive id, missing source count, stale authority version, same-role self-index, unresolved dissent, live-risk purge request, or mismatched closeout id defaults to HOLD_FOR_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_INDEX and BLOCKED_FOR_LIVE.',
  'Authority closeout appeal resolution archive retention review closeout archive index can only create LOCAL_DRAFT_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_INDEX_RECORD and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'Authority closeout appeal resolution archive retention review closeout archive index closeout records must bind index_closeout_id, index_id, closeout_archive_id, closeout_id, review_id, retention_id, archive_id, resolution_id, appeal_id, appealed_closeout_id, closed_by_role, closeout_reason, evidence_hash_or_reference, authority_version, created_at, closed_at, source_record_count, and blocked_live_gate_status before any local archive index can be marked closed.',
  'Closeout archive index closeout cannot purge source evidence, mutate index or archive records, approve live actions, hide reviewer dissent, hide revoked signer evidence, reduce source record count without evidence, bypass retention policy, or create provider obligations.',
  'Missing closeout reason, missing index id, missing archive id, stale authority version, same-role self-closeout, unresolved dissent, live-risk purge request, or mismatched source count defaults to HOLD_FOR_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT and BLOCKED_FOR_LIVE.',
  'Authority closeout appeal resolution archive retention review closeout archive index closeout can only create LOCAL_DRAFT_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_RECORD and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'Authority closeout appeal resolution archive retention review closeout archive index handoff records must bind handoff_id, index_id, index_closeout_id, closeout_archive_id, closeout_id, review_id, retention_id, archive_id, resolution_id, appeal_id, appealed_closeout_id, handed_off_by_role, receiving_role, handoff_reason, evidence_hash_or_reference, authority_version, created_at, handed_off_at, source_record_count, and blocked_live_gate_status before any local archive index can be handed off for review.',
  'Closeout archive index handoff cannot purge source evidence, mutate index or archive records, approve live actions, hide reviewer dissent, hide revoked signer evidence, reduce source record count without evidence, bypass retention policy, assign external obligations, or create provider commitments.',
  'Missing handoff reason, missing receiving role, missing index closeout id, stale authority version, same-role self-handoff, unresolved dissent, live-risk purge request, or mismatched source count defaults to HOLD_FOR_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_INDEX_HANDOFF and BLOCKED_FOR_LIVE.',
  'Authority closeout appeal resolution archive retention review closeout archive index handoff can only create LOCAL_DRAFT_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_INDEX_HANDOFF_RECORD and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'Authority closeout appeal resolution archive retention review closeout archive index handoff closeout records must bind handoff_closeout_id, handoff_id, index_id, index_closeout_id, closeout_archive_id, closeout_id, review_id, retention_id, archive_id, resolution_id, appeal_id, appealed_closeout_id, closed_by_role, closeout_reason, evidence_hash_or_reference, authority_version, created_at, closed_at, source_record_count, receiving_role, and blocked_live_gate_status before any local archive index handoff can be marked closed.',
  'Closeout archive index handoff closeout cannot purge source evidence, mutate handoff, index, or archive records, approve live actions, hide reviewer dissent, hide revoked signer evidence, reduce source record count without evidence, bypass retention policy, mark external acceptance, or create provider commitments.',
  'Missing closeout reason, missing handoff id, missing receiving role, stale authority version, same-role self-closeout, unresolved dissent, live-risk purge request, or mismatched source count defaults to HOLD_FOR_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_INDEX_HANDOFF_CLOSEOUT and BLOCKED_FOR_LIVE.',
  'Authority closeout appeal resolution archive retention review closeout archive index handoff closeout can only create LOCAL_DRAFT_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_INDEX_HANDOFF_CLOSEOUT_RECORD and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'Authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive records must bind handoff_closeout_archive_id, handoff_closeout_id, handoff_id, index_id, index_closeout_id, closeout_archive_id, closeout_id, review_id, retention_id, archive_id, resolution_id, appeal_id, appealed_closeout_id, archived_by_role, archive_reason, evidence_hash_or_reference, authority_version, created_at, archived_at, source_record_count, receiving_role, and blocked_live_gate_status before any local archive index handoff closeout can be archived.',
  'Closeout archive index handoff closeout archive cannot purge source evidence, mutate handoff closeout, handoff, index, or archive records, approve live actions, hide reviewer dissent, hide revoked signer evidence, reduce source record count without evidence, bypass retention policy, mark external acceptance, or create provider commitments.',
  'Missing archive reason, missing handoff closeout id, missing receiving role, stale authority version, same-role self-archive, unresolved dissent, live-risk purge request, or mismatched source count defaults to HOLD_FOR_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_INDEX_HANDOFF_CLOSEOUT_ARCHIVE and BLOCKED_FOR_LIVE.',
  'Authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive can only create LOCAL_DRAFT_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_INDEX_HANDOFF_CLOSEOUT_ARCHIVE_RECORD and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'Authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index records must bind handoff_closeout_archive_index_id, handoff_closeout_archive_id, handoff_closeout_id, handoff_id, index_id, index_closeout_id, closeout_archive_id, closeout_id, review_id, retention_id, archive_id, resolution_id, appeal_id, appealed_closeout_id, indexed_by_role, index_reason, evidence_hash_or_reference, authority_version, created_at, indexed_at, source_record_count, receiving_role, and blocked_live_gate_status before any local archive index handoff closeout archive can be indexed.',
  'Closeout archive index handoff closeout archive index cannot purge source evidence, mutate handoff closeout archive, handoff closeout, handoff, index, or archive records, approve live actions, hide reviewer dissent, hide revoked signer evidence, reduce source record count without evidence, bypass retention policy, mark external acceptance, collapse records into untraceable entries, or create provider commitments.',
  'Missing index reason, missing handoff closeout archive id, missing receiving role, stale authority version, same-role self-index, unresolved dissent, live-risk purge request, or mismatched source count defaults to HOLD_FOR_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_INDEX_HANDOFF_CLOSEOUT_ARCHIVE_INDEX and BLOCKED_FOR_LIVE.',
  'Authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index can only create LOCAL_DRAFT_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_INDEX_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_RECORD and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'Authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout records must bind handoff_closeout_archive_index_closeout_id, handoff_closeout_archive_index_id, handoff_closeout_archive_id, handoff_closeout_id, handoff_id, index_id, index_closeout_id, closeout_archive_id, closeout_id, review_id, retention_id, archive_id, resolution_id, appeal_id, appealed_closeout_id, closed_by_role, closeout_reason, evidence_hash_or_reference, authority_version, created_at, closed_at, source_record_count, receiving_role, and blocked_live_gate_status before any local archive index handoff closeout archive index can be closed.',
  'Closeout archive index handoff closeout archive index closeout cannot purge source evidence, mutate handoff closeout archive index, handoff closeout archive, handoff closeout, handoff, index, or archive records, approve live actions, hide reviewer dissent, hide revoked signer evidence, reduce source record count without evidence, bypass retention policy, mark external acceptance, collapse records into untraceable entries, finalize external obligations, or create provider commitments.',
  'Missing closeout reason, missing handoff closeout archive index id, missing receiving role, stale authority version, same-role self-closeout, unresolved dissent, live-risk purge request, or mismatched source count defaults to HOLD_FOR_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_INDEX_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT and BLOCKED_FOR_LIVE.',
  'Authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout can only create LOCAL_DRAFT_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_INDEX_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_RECORD and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'Authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive records must bind handoff_closeout_archive_index_closeout_archive_id, handoff_closeout_archive_index_closeout_id, handoff_closeout_archive_index_id, handoff_closeout_archive_id, handoff_closeout_id, handoff_id, index_id, index_closeout_id, closeout_archive_id, closeout_id, review_id, retention_id, archive_id, resolution_id, appeal_id, appealed_closeout_id, archived_by_role, archive_reason, evidence_hash_or_reference, authority_version, created_at, archived_at, source_record_count, receiving_role, and blocked_live_gate_status before any local archive index handoff closeout archive index closeout can be archived.',
  'Closeout archive index handoff closeout archive index closeout archive cannot purge source evidence, mutate handoff closeout archive index closeout, handoff closeout archive index, handoff closeout archive, handoff closeout, handoff, index, or archive records, approve live actions, hide reviewer dissent, hide revoked signer evidence, reduce source record count without evidence, bypass retention policy, mark external acceptance, collapse records into untraceable entries, finalize external obligations, or create provider commitments.',
  'Missing archive reason, missing handoff closeout archive index closeout id, missing receiving role, stale authority version, same-role self-archive, unresolved dissent, live-risk purge request, or mismatched source count defaults to HOLD_FOR_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_INDEX_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_ARCHIVE and BLOCKED_FOR_LIVE.',
  'Authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive can only create LOCAL_DRAFT_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_INDEX_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_ARCHIVE_RECORD and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'Authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index records must bind handoff_closeout_archive_index_closeout_archive_index_id, handoff_closeout_archive_index_closeout_archive_id, handoff_closeout_archive_index_closeout_id, handoff_closeout_archive_index_id, handoff_closeout_archive_id, handoff_closeout_id, handoff_id, index_id, index_closeout_id, closeout_archive_id, closeout_id, review_id, retention_id, archive_id, resolution_id, appeal_id, appealed_closeout_id, indexed_by_role, index_reason, evidence_hash_or_reference, authority_version, created_at, indexed_at, source_record_count, receiving_role, and blocked_live_gate_status before any local archive index handoff closeout archive index closeout archive can be indexed.',
  'Closeout archive index handoff closeout archive index closeout archive index cannot purge source evidence, mutate handoff closeout archive index closeout archive, handoff closeout archive index closeout, handoff closeout archive index, handoff closeout archive, handoff closeout, handoff, index, or archive records, approve live actions, hide reviewer dissent, hide revoked signer evidence, reduce source record count without evidence, bypass retention policy, mark external acceptance, collapse records into untraceable entries, finalize external obligations, or create provider commitments.',
  'Missing index reason, missing handoff closeout archive index closeout archive id, missing receiving role, stale authority version, same-role self-index, unresolved dissent, live-risk purge request, or mismatched source count defaults to HOLD_FOR_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_INDEX_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_ARCHIVE_INDEX and BLOCKED_FOR_LIVE.',
  'Authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index can only create LOCAL_DRAFT_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_INDEX_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_ARCHIVE_INDEX_RECORD and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'Authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index closeout records must bind handoff_closeout_archive_index_closeout_archive_index_closeout_id, handoff_closeout_archive_index_closeout_archive_index_id, handoff_closeout_archive_index_closeout_archive_id, handoff_closeout_archive_index_closeout_id, handoff_closeout_archive_index_id, handoff_closeout_archive_id, handoff_closeout_id, handoff_id, index_id, index_closeout_id, closeout_archive_id, closeout_id, review_id, retention_id, archive_id, resolution_id, appeal_id, appealed_closeout_id, closed_by_role, closeout_reason, evidence_hash_or_reference, authority_version, created_at, closed_at, source_record_count, receiving_role, and blocked_live_gate_status before any local archive index handoff closeout archive index closeout archive index can be closed out.',
  'Closeout archive index handoff closeout archive index closeout archive index closeout cannot purge source evidence, mutate handoff closeout archive index closeout archive index, handoff closeout archive index closeout archive, handoff closeout archive index closeout, handoff closeout archive index, handoff closeout archive, handoff closeout, handoff, index, or archive records, approve live actions, hide reviewer dissent, hide revoked signer evidence, reduce source record count without evidence, bypass retention policy, mark external acceptance, collapse records into untraceable entries, finalize external obligations, or create provider commitments.',
  'Missing closeout reason, missing handoff closeout archive index closeout archive index id, missing receiving role, stale authority version, same-role self-closeout, unresolved dissent, live-risk purge request, or mismatched source count defaults to HOLD_FOR_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_INDEX_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT and BLOCKED_FOR_LIVE.',
  'Authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index closeout can only create LOCAL_DRAFT_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_INDEX_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_RECORD and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'Authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index closeout archive records must bind handoff_closeout_archive_index_closeout_archive_index_closeout_archive_id, handoff_closeout_archive_index_closeout_archive_index_closeout_id, handoff_closeout_archive_index_closeout_archive_index_id, handoff_closeout_archive_index_closeout_archive_id, handoff_closeout_archive_index_closeout_id, handoff_closeout_archive_index_id, handoff_closeout_archive_id, handoff_closeout_id, handoff_id, index_id, index_closeout_id, closeout_archive_id, closeout_id, review_id, retention_id, archive_id, resolution_id, appeal_id, appealed_closeout_id, archived_by_role, archive_reason, evidence_hash_or_reference, authority_version, created_at, archived_at, source_record_count, receiving_role, and blocked_live_gate_status before any local archive index handoff closeout archive index closeout archive index closeout can be archived.',
  'Closeout archive index handoff closeout archive index closeout archive index closeout archive cannot purge source evidence, mutate handoff closeout archive index closeout archive index closeout, handoff closeout archive index closeout archive index, handoff closeout archive index closeout archive, handoff closeout archive index closeout, handoff closeout archive index, handoff closeout archive, handoff closeout, handoff, index, or archive records, approve live actions, hide reviewer dissent, hide revoked signer evidence, reduce source record count without evidence, bypass retention policy, mark external acceptance, collapse records into untraceable entries, finalize external obligations, or create provider commitments.',
  'Missing archive reason, missing handoff closeout archive index closeout archive index closeout id, missing receiving role, stale authority version, same-role self-archive, unresolved dissent, live-risk purge request, or mismatched source count defaults to HOLD_FOR_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_INDEX_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_ARCHIVE and BLOCKED_FOR_LIVE.',
  'Authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index closeout archive can only create LOCAL_DRAFT_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_INDEX_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_ARCHIVE_RECORD and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'Authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index closeout archive index records must bind handoff_closeout_archive_index_closeout_archive_index_closeout_archive_index_id, handoff_closeout_archive_index_closeout_archive_index_closeout_archive_id, handoff_closeout_archive_index_closeout_archive_index_closeout_id, handoff_closeout_archive_index_closeout_archive_index_id, handoff_closeout_archive_index_closeout_archive_id, handoff_closeout_archive_index_closeout_id, handoff_closeout_archive_index_id, handoff_closeout_archive_id, handoff_closeout_id, handoff_id, index_id, index_closeout_id, closeout_archive_id, closeout_id, review_id, retention_id, archive_id, resolution_id, appeal_id, appealed_closeout_id, indexed_by_role, index_reason, evidence_hash_or_reference, authority_version, created_at, indexed_at, source_record_count, receiving_role, and blocked_live_gate_status before any local archive index handoff closeout archive index closeout archive index closeout archive can be indexed.',
  'Closeout archive index handoff closeout archive index closeout archive index closeout archive index cannot purge source evidence, mutate handoff closeout archive index closeout archive index closeout archive, handoff closeout archive index closeout archive index closeout, handoff closeout archive index closeout archive index, handoff closeout archive index closeout archive, handoff closeout archive index closeout, handoff closeout archive index, handoff closeout archive, handoff closeout, handoff, index, or archive records, approve live actions, hide reviewer dissent, hide revoked signer evidence, reduce source record count without evidence, bypass retention policy, mark external acceptance, collapse records into untraceable entries, finalize external obligations, or create provider commitments.',
  'Missing index reason, missing handoff closeout archive index closeout archive index closeout archive id, missing receiving role, stale authority version, same-role self-index, unresolved dissent, live-risk purge request, or mismatched source count defaults to HOLD_FOR_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_INDEX_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_ARCHIVE_INDEX and BLOCKED_FOR_LIVE.',
  'Authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index closeout archive index can only create LOCAL_DRAFT_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_INDEX_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_ARCHIVE_INDEX_RECORD and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'Authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index closeout archive index closeout records must bind handoff_closeout_archive_index_closeout_archive_index_closeout_archive_index_closeout_id, handoff_closeout_archive_index_closeout_archive_index_closeout_archive_index_id, handoff_closeout_archive_index_closeout_archive_index_closeout_archive_id, handoff_closeout_archive_index_closeout_archive_index_closeout_id, handoff_closeout_archive_index_closeout_archive_index_id, handoff_closeout_archive_index_closeout_archive_id, handoff_closeout_archive_index_closeout_id, handoff_closeout_archive_index_id, handoff_closeout_archive_id, handoff_closeout_id, handoff_id, index_id, index_closeout_id, closeout_archive_id, closeout_id, review_id, retention_id, archive_id, resolution_id, appeal_id, appealed_closeout_id, closed_out_by_role, closeout_reason, evidence_hash_or_reference, authority_version, created_at, closed_out_at, source_record_count, receiving_role, and blocked_live_gate_status before any local archive index handoff closeout archive index closeout archive index closeout archive index can be closed out.',
  'Closeout archive index handoff closeout archive index closeout archive index closeout archive index closeout cannot purge source evidence, mutate handoff closeout archive index closeout archive index closeout archive index, handoff closeout archive index closeout archive index closeout archive, handoff closeout archive index closeout archive index closeout, handoff closeout archive index closeout archive index, handoff closeout archive index closeout archive, handoff closeout archive index closeout, handoff closeout archive index, handoff closeout archive, handoff closeout, handoff, index, or archive records, approve live actions, hide reviewer dissent, hide revoked signer evidence, reduce source record count without evidence, bypass retention policy, mark external acceptance, collapse records into untraceable entries, finalize external obligations, or create provider commitments.',
  'Missing closeout reason, missing handoff closeout archive index closeout archive index closeout archive index id, missing receiving role, stale authority version, same-role self-closeout, unresolved dissent, live-risk purge request, or mismatched source count defaults to HOLD_FOR_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_INDEX_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT and BLOCKED_FOR_LIVE.',
  'Authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index closeout archive index closeout can only create LOCAL_DRAFT_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_INDEX_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_RECORD and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'Authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index closeout archive index closeout archive records must bind handoff_closeout_archive_index_closeout_archive_index_closeout_archive_index_closeout_archive_id, handoff_closeout_archive_index_closeout_archive_index_closeout_archive_index_closeout_id, handoff_closeout_archive_index_closeout_archive_index_closeout_archive_index_id, handoff_closeout_archive_index_closeout_archive_index_closeout_archive_id, handoff_closeout_archive_index_closeout_archive_index_closeout_id, handoff_closeout_archive_index_closeout_archive_index_id, handoff_closeout_archive_index_closeout_archive_id, handoff_closeout_archive_index_closeout_id, handoff_closeout_archive_index_id, handoff_closeout_archive_id, handoff_closeout_id, handoff_id, index_id, index_closeout_id, closeout_archive_id, closeout_id, review_id, retention_id, archive_id, resolution_id, appeal_id, appealed_closeout_id, archived_by_role, archive_reason, evidence_hash_or_reference, authority_version, created_at, archived_at, source_record_count, receiving_role, and blocked_live_gate_status before any local archive index handoff closeout archive index closeout archive index closeout archive index closeout can be archived.',
  'Closeout archive index handoff closeout archive index closeout archive index closeout archive index closeout archive cannot purge source evidence, mutate handoff closeout archive index closeout archive index closeout archive index closeout, handoff closeout archive index closeout archive index closeout archive index, handoff closeout archive index closeout archive index closeout archive, handoff closeout archive index closeout archive index closeout, handoff closeout archive index closeout archive index, handoff closeout archive index closeout archive, handoff closeout archive index closeout, handoff closeout archive index, handoff closeout archive, handoff closeout, handoff, index, or archive records, approve live actions, hide reviewer dissent, hide revoked signer evidence, reduce source record count without evidence, bypass retention policy, mark external acceptance, collapse records into untraceable entries, finalize external obligations, or create provider commitments.',
  'Missing archive reason, missing handoff closeout archive index closeout archive index closeout archive index closeout id, missing receiving role, stale authority version, same-role self-archive, unresolved dissent, live-risk purge request, or mismatched source count defaults to HOLD_FOR_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_INDEX_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_ARCHIVE and BLOCKED_FOR_LIVE.',
  'Authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index closeout archive index closeout archive can only create LOCAL_DRAFT_AUTHORITY_CLOSEOUT_APPEAL_RESOLUTION_ARCHIVE_RETENTION_REVIEW_CLOSEOUT_ARCHIVE_INDEX_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_ARCHIVE_RECORD and must not deploy contracts, change XPR authority, release escrow, route repayments, settle stablecoins, lock token collateral, mutate balances, approve loans, or create provider obligations.',
  'evening_smart_contract_authority_state',
  'READY_FOR_LOCAL_AUTHORITY_REVIEW, REVIEW_BLOCKERS, HOLD_FOR_SECURITY_REVIEW, HOLD_FOR_LEGAL_PROVIDER_REVIEW, HOLD_FOR_XPR_AUTHORITY_REVIEW, or NO_GO',
  'evening_smart_contract_authority_evidence',
  'evening_smart_contract_authority_blocked_action',
  'Do not deploy XPR contracts, change authority, unpause modules, activate provider signers, enable live-risk paths, or treat this record as security/legal approval',
  'security_reviewer_handoff_state',
  'READY_FOR_SECURITY_REVIEW, NEEDS_AUTHORITY_CLARIFICATION, HOLD_FOR_LEGAL_PROVIDER_REVIEW, HOLD_FOR_XPR_AUTHORITY_REVIEW, HOLD_FOR_REPLAY_EVIDENCE, or NO_GO',
  'security_reviewer_handoff_evidence',
  'security_reviewer_handoff_owner',
  'security_reviewer_handoff_blocked_action',
  'Do not treat this matrix as security-audit approval, legal approval, XPR authority approval, deployment approval, upgrade approval, unpause approval, provider signer approval, live-risk enablement, escrow approval, repayment routing approval, stablecoin settlement approval, token collateral approval, or public wording approval',
  'smart_contract_local_implementation_handoff_state',
  'READY_FOR_LOCAL_IMPLEMENTATION_PACKET, NEEDS_AUTHORITY_REFRESH, HOLD_FOR_SECURITY_REVIEW, HOLD_FOR_LEGAL_PROVIDER_REVIEW, HOLD_FOR_XPR_AUTHORITY_REVIEW, HOLD_FOR_REPLAY_EVIDENCE, or NO_GO',
  'smart_contract_local_implementation_handoff_evidence',
  'smart_contract_local_implementation_handoff_owner',
  'smart_contract_local_implementation_handoff_blocked_action',
  'Do not treat this handoff as approval to deploy XPR contracts, change authority, upgrade modules, unpause modules, activate provider signers, enable live-risk paths, release escrow, route repayments, settle stablecoins, lock token collateral, publish public wording, or move money',
  'project registry cannot create a live legal collateral claim',
  'milestone state cannot move from evidence submitted to release eligible',
  'loan ledger cannot move from requested to funded',
  'repayment router cannot compute live routing',
  'collateral module cannot enable token collateral',
  'audit registry must record actor, role, request ID, previous state, next state, safety gate, and approval status',
  'append-only and non-secret',
  'founder scope approval',
  'legal/provider review',
  'finance-provider review',
  'escrow/payment provider review',
  'stablecoin/provider/compliance review',
  'token collateral legal/custody/oracle/LTV/liquidation review',
  'security review',
  'no-real-money local tests',
  'XPR account creation and authority setup by the founder',
  'LOCAL_ONLY',
  'PASS_LOCAL_ONLY',
  'BLOCKED_FOR_LIVE',
  'APPROVED_FOR_LIVE',
  'A single-key deploy path is rejected',
  'Hidden owner-only drain is rejected',
  'Arbitrary balance mutation is rejected',
  'Hidden upgrade path is rejected',
  'Contractor self-approval is rejected',
  'AI-only final approval is rejected',
  'Dispute-to-release bypass is rejected',
  'Token collateral live enablement is rejected',
  'Authority change without audit event is rejected',
  'npm run check:whitepaper-v1-2-smart-contract-module-split-anti-backdoor',
  'npm run check:whitepaper-v1-2-smart-contract-architecture',
  'npm run check:smart-contract-authority-model',
  'npm run check:smart-contract-audit-event-map',
  'npm run check:smart-contract-implementation-gate',
  'npm run check:whitepaper-v1-2-contract-backed-loan-technical-requirements',
  'npm run check',
]) assertIncludes(review, required, reviewPath);

for (const [content, snippet, file] of [
  [architecturePackage, 'FOUNDER_APPROVED_INTERNAL_SOURCE_OF_TRUTH', architecturePackagePath],
  [smartContractDraft, 'GCSC Whitepaper v1.2 Smart Contract Architecture Draft', smartContractDraftPath],
  [authority, 'SmartContractor Smart Contract Authority Model', authorityPath],
  [auditEventMap, 'SmartContractor Smart Contract Audit Event Map', auditEventMapPath],
  [implementationGate, 'SmartContractor Smart Contract Implementation Gate', implementationGatePath],
  [technicalRequirements, 'GCSC Whitepaper v1.2 Contract-Backed Loan Technical Requirements', technicalRequirementsPath],
]) assertIncludes(content, snippet, file);

assertIncludes(context, 'Whitepaper v1.2 smart contract module split and anti-backdoor review', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-smart-contract-module-split-anti-backdoor', contextPath);
assertIncludes(context, 'Whitepaper v1.2 emergency pause settlement boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 upgrade authority recovery boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 cross-module invariant conflict boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 privileged action two-person rule boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 privileged action timelock and expiration boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 privileged action replay and evidence binding boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 privileged action reviewer revocation and role drift boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 privileged action dry-run simulation boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 privileged action post-execution audit closeout boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 privileged action failed execution quarantine boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 privileged action recovery rehearsal boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 module interface version drift boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 audit event canonical hash boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 non-secret evidence privacy boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 signer capability scope boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 protected action denylist precedence boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 delegated authority chain boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 authority revocation propagation boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 authority evidence supersession boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 authority exception request boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 authority break-glass recovery boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 authority closeout reconciliation boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 authority closeout reopen boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 authority closeout appeal boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 authority closeout appeal resolution boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 authority closeout appeal resolution archive boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 authority closeout appeal resolution archive retention boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index closeout boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index closeout boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index closeout archive boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index closeout archive index boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index closeout archive index closeout boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index closeout archive index closeout archive boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 smart contract security reviewer handoff matrix', contextPath);
assertIncludes(context, 'Whitepaper v1.2 smart contract local implementation handoff matrix', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 smart contract module split and anti-backdoor review', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-smart-contract-module-split-anti-backdoor', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 emergency pause settlement boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 upgrade authority recovery boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 cross-module invariant conflict boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 privileged action two-person rule boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 privileged action timelock and expiration boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 privileged action replay and evidence binding boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 privileged action reviewer revocation and role drift boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 privileged action dry-run simulation boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 privileged action post-execution audit closeout boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 privileged action failed execution quarantine boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 privileged action recovery rehearsal boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 module interface version drift boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 audit event canonical hash boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 non-secret evidence privacy boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 signer capability scope boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 protected action denylist precedence boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 delegated authority chain boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 authority revocation propagation boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 authority evidence supersession boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 authority exception request boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 authority break-glass recovery boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 authority closeout reconciliation boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 authority closeout reopen boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 authority closeout appeal boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 authority closeout appeal resolution boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 authority closeout appeal resolution archive boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 authority closeout appeal resolution archive retention boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index closeout boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index closeout boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index closeout archive boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index closeout archive index boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index closeout archive index closeout boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index closeout archive index closeout archive boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 smart contract security reviewer handoff matrix', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 smart contract local implementation handoff matrix', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 smart contract module split and anti-backdoor review', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 emergency pause settlement boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 upgrade authority recovery boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 cross-module invariant conflict boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 privileged action two-person rule boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 privileged action timelock and expiration boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 privileged action replay and evidence binding boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 privileged action reviewer revocation and role drift boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 privileged action dry-run simulation boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 privileged action post-execution audit closeout boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 privileged action failed execution quarantine boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 privileged action recovery rehearsal boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 module interface version drift boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 audit event canonical hash boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 non-secret evidence privacy boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 signer capability scope boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 protected action denylist precedence boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 delegated authority chain boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 authority revocation propagation boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 authority evidence supersession boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 authority exception request boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 authority break-glass recovery boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 authority closeout reconciliation boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 authority closeout reopen boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 authority closeout appeal boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 authority closeout appeal resolution boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 authority closeout appeal resolution archive boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 authority closeout appeal resolution archive retention boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index closeout boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index closeout boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index closeout archive boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index closeout archive index boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index closeout archive index closeout boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 authority closeout appeal resolution archive retention review closeout archive index handoff closeout archive index closeout archive index closeout archive index closeout archive boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 smart contract security reviewer handoff matrix', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 smart contract local implementation handoff matrix', auditPath);
assertIncludes(packageJson, '"check:whitepaper-v1-2-smart-contract-module-split-anti-backdoor"', packagePath);
assertIncludes(runner, '"check:whitepaper-v1-2-smart-contract-module-split-anti-backdoor"', runnerPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(review)) {
  fail('Smart contract module split anti-backdoor review must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_module_split_anti_backdoor_review: reviewPath,
  modules_checked: 9,
  anti_backdoor_rules_checked: true,
  live_deployment_block_checked: true,
}, null, 2));
