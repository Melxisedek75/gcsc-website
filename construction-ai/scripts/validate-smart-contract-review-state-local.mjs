import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  applyPeerReviewRewardTransition,
  BLOCKED_PEER_REVIEW_REWARD_FLAGS,
  DEMO_PEER_REVIEW_REWARD_FIXTURE,
  PEER_REVIEW_REWARD_ACTIONS,
  PEER_REVIEW_REWARD_STATES,
  REQUIRED_PEER_REVIEW_REWARD_FIELDS,
} from '../src/smart-contracts/state/peerReviewRewardState.mjs';

const helperPath = resolve('src', 'smart-contracts', 'state', 'peerReviewRewardState.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract review state local validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const helper = readRequired(helperPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realAudit = readRequired(realAuditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciValidator = readRequired(ciValidatorPath);

for (const required of [
  'PEER_REVIEW_REWARD_STATES',
  'PEER_REVIEW_REWARD_ACTIONS',
  'REQUIRED_PEER_REVIEW_REWARD_FIELDS',
  'BLOCKED_PEER_REVIEW_REWARD_FLAGS',
  'applyPeerReviewRewardTransition',
  'DEMO_PEER_REVIEW_REWARD_FIXTURE',
  'reward_placeholder_only',
  'reputation_label_only',
  'conflict_check_fixture_only',
  'peer_review_safety_gate_guard',
  'DEMO_ONLY_REVIEW_SAFETY_GATE_REQUIRED',
  'peer_review_actor_role_guard',
  'LOCAL_PEER_REVIEWER_ONLY',
  'peer_review_identifier_prefix_guard',
  'LOCAL_DEMO_PEER_REVIEW_IDENTIFIERS_ONLY',
  'peer_review_provider_review_guard',
  'FOUNDER_AND_LEGAL_PROVIDER_REVIEW_REQUIRED',
  'peer_review_conflict_status_guard',
  'LOCAL_CONFLICT_CHECK_REQUIRED',
  'peer_review_label_only_guard',
  'LOCAL_REWARD_AND_REPUTATION_LABELS_ONLY',
  'peer_review_scoring_label_guard',
  'LOCAL_SCORE_AND_RECOMMENDATION_LABELS_ONLY',
  'peer_review_abuse_flag_guard',
  'LOCAL_ABUSE_REVIEW_REQUIRED',
  'peer_review_evidence_prefix_guard',
  'LOCAL_DEMO_EVIDENCE_ONLY',
  'peer_review_created_at_guard',
  'LOCAL_FIXED_FIXTURE_TIMESTAMP_REQUIRED',
  'peer_review_scope_guard',
  'LOCAL_QUALITY_REVIEW_ONLY',
  'peer_review_attestation_guard',
  'LOCAL_REVIEWER_ATTESTATION_REQUIRED',
  'peer_review_source_channel_guard',
  'LOCAL_DEMO_SOURCE_CHANNEL_REQUIRED',
  'peer_review_evidence_review_status_guard',
  'LOCAL_EVIDENCE_REVIEW_STATUS_REQUIRED',
  'peer_review_publication_status_guard',
  'LOCAL_PUBLICATION_STATUS_REQUIRED',
  'peer_review_reward_calculation_mode_guard',
  'LOCAL_REWARD_CALCULATION_MODE_REQUIRED',
  'peer_review_payout_destination_guard',
  'LOCAL_NO_PAYOUT_DESTINATION_REQUIRED',
  'peer_review_payout_authorization_guard',
  'LOCAL_NO_PAYOUT_AUTHORIZATION_REQUIRED',
  'peer_review_transfer_reference_guard',
  'LOCAL_NO_TRANSFER_REFERENCE_REQUIRED',
  'peer_review_settlement_batch_guard',
  'LOCAL_NO_SETTLEMENT_BATCH_REQUIRED',
  'peer_review_disbursement_status_guard',
  'LOCAL_NO_DISBURSEMENT_REQUIRED',
  'peer_review_ledger_posting_guard',
  'LOCAL_NO_LEDGER_POSTING_REQUIRED',
  'peer_review_external_notification_guard',
  'LOCAL_NO_EXTERNAL_NOTIFICATION_REQUIRED',
  'peer_review_appeal_window_guard',
  'LOCAL_APPEAL_WINDOW_REQUIRED',
  'peer_review_appeal_resolution_guard',
  'LOCAL_APPEAL_RESOLUTION_PENDING_REQUIRED',
  'peer_review_appeal_evidence_guard',
  'LOCAL_APPEAL_EVIDENCE_PENDING_REQUIRED',
  'peer_review_appeal_moderator_assignment_guard',
  'LOCAL_NO_APPEAL_MODERATOR_ASSIGNMENT_REQUIRED',
  'peer_review_appeal_moderator_conflict_guard',
  'LOCAL_NO_APPEAL_MODERATOR_CONFLICT_REVIEW_REQUIRED',
  'peer_review_appeal_moderator_decision_guard',
  'LOCAL_NO_APPEAL_MODERATOR_DECISION_REQUIRED',
  'peer_review_appeal_party_notification_guard',
  'LOCAL_NO_APPEAL_PARTY_NOTIFICATION_REQUIRED',
  'peer_review_appeal_notification_acknowledgement_guard',
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REQUIRED',
  'peer_review_appeal_notification_acknowledgement_evidence_guard',
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_EVIDENCE_REQUIRED',
  'peer_review_appeal_notification_acknowledgement_replay_guard',
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_REQUIRED',
  'peer_review_appeal_notification_acknowledgement_replay_digest_guard',
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_REQUIRED',
  'peer_review_appeal_notification_acknowledgement_replay_digest_archive_guard',
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_ARCHIVE_REQUIRED',
  'peer_review_appeal_notification_acknowledgement_replay_digest_archive_index_guard',
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_ARCHIVE_INDEX_REQUIRED',
  'peer_review_appeal_notification_acknowledgement_replay_digest_archive_index_closeout_guard',
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_ARCHIVE_INDEX_CLOSEOUT_REQUIRED',
  'peer_review_appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_guard',
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_REQUIRED',
  'peer_review_appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_guard',
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_REQUIRED',
  'peer_review_appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_guard',
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_ARCHIVE_REQUIRED',
  'peer_review_appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_guard',
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_REQUIRED',
  'peer_review_appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_closeout_guard',
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_REQUIRED',
  'peer_review_appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_closeout_handoff_guard',
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_REQUIRED',
  'peer_review_appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_closeout_handoff_closeout_guard',
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_REQUIRED',
  'peer_review_appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_closeout_handoff_closeout_archive_guard',
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_ARCHIVE_REQUIRED',
  'peer_review_appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_closeout_handoff_closeout_archive_index_guard',
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_REQUIRED',
  'peer_review_appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_closeout_handoff_closeout_archive_index_closeout_guard',
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_REQUIRED',
  'peer_review_appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_closeout_handoff_closeout_archive_index_closeout_handoff_guard',
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_REQUIRED',
  'BLOCKED_FOR_LIVE',
  'local_only',
  'real_reward_payout_allowed',
  'token_issuance_allowed',
  'reviewer_compensation_allowed',
  'reputation_penalty_allowed',
  'public_reputation_claim_allowed',
  'peer_review_final_authority_allowed',
  'dispute_finality_allowed',
  'payment_release_allowed',
  'real_escrow_allowed',
  'real_payment_allowed',
  'ai_final_authority_allowed',
]) assertIncludes(helper, required, helperPath);

if (PEER_REVIEW_REWARD_STATES.length < 7) fail('Peer review reward state list is unexpectedly short');
if (!PEER_REVIEW_REWARD_STATES.includes('reward_label_recorded')) fail('reward_label_recorded state must exist');
if (!PEER_REVIEW_REWARD_ACTIONS.includes('rewardrev')) fail('rewardrev action must exist');

for (const field of REQUIRED_PEER_REVIEW_REWARD_FIELDS) {
  if (!Object.hasOwn(DEMO_PEER_REVIEW_REWARD_FIXTURE, field)) fail(`Demo peer review fixture is missing ${field}`);
}

if (!DEMO_PEER_REVIEW_REWARD_FIXTURE.local_only) fail('Demo peer review fixture must be local_only');
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.deployment_status !== 'BLOCKED_FOR_LIVE') fail('Demo peer review fixture must be BLOCKED_FOR_LIVE');
if (!DEMO_PEER_REVIEW_REWARD_FIXTURE.reward_placeholder_only) fail('Demo peer review fixture must be reward placeholder only');
if (!DEMO_PEER_REVIEW_REWARD_FIXTURE.reputation_label_only) fail('Demo peer review fixture must be reputation label only');
if (!DEMO_PEER_REVIEW_REWARD_FIXTURE.conflict_check_fixture_only) fail('Demo peer review fixture must be conflict check fixture only');
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_safety_gate_guard !== 'DEMO_ONLY_REVIEW_SAFETY_GATE_REQUIRED') {
  fail('Demo peer review fixture must expose the demo-only review safety gate guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.safety_gate !== 'demo-only') fail('Demo peer review fixture safety gate must remain demo-only');
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_actor_role_guard !== 'LOCAL_PEER_REVIEWER_ONLY') {
  fail('Demo peer review fixture must expose the local peer reviewer actor guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.actor_role !== 'peer_reviewer') fail('Demo peer review fixture actor role must remain peer_reviewer');
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_identifier_prefix_guard !== 'LOCAL_DEMO_PEER_REVIEW_IDENTIFIERS_ONLY') {
  fail('Demo peer review fixture must expose the local demo identifier prefix guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_provider_review_guard !== 'FOUNDER_AND_LEGAL_PROVIDER_REVIEW_REQUIRED') {
  fail('Demo peer review fixture must expose the founder/legal provider review guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.founder_approval_status !== 'required_before_public_claims') {
  fail('Demo peer review fixture founder approval status must remain required before public claims');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.legal_provider_status !== 'required') {
  fail('Demo peer review fixture legal provider status must remain required');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_conflict_status_guard !== 'LOCAL_CONFLICT_CHECK_REQUIRED') {
  fail('Demo peer review fixture must expose the local conflict status guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.conflict_of_interest_status !== 'not_flagged_demo_only') {
  fail('Demo peer review fixture conflict status must remain not_flagged_demo_only');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_label_only_guard !== 'LOCAL_REWARD_AND_REPUTATION_LABELS_ONLY') {
  fail('Demo peer review fixture must expose the local label-only guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.reward_label !== 'demo_reward_label_only') {
  fail('Demo peer review fixture reward label must remain demo-only');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.reputation_impact_label !== 'demo_reputation_impact_only') {
  fail('Demo peer review fixture reputation impact label must remain demo-only');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_scoring_label_guard !== 'LOCAL_SCORE_AND_RECOMMENDATION_LABELS_ONLY') {
  fail('Demo peer review fixture must expose the local scoring label guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.score_label !== 'demo_score_only') {
  fail('Demo peer review fixture score label must remain demo-only');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.recommendation_label !== 'release_recommendation_only') {
  fail('Demo peer review fixture recommendation label must remain label-only');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_abuse_flag_guard !== 'LOCAL_ABUSE_REVIEW_REQUIRED') {
  fail('Demo peer review fixture must expose the local abuse flag guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.abuse_flag !== false) {
  fail('Demo peer review fixture abuse flag must remain false');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_evidence_prefix_guard !== 'LOCAL_DEMO_EVIDENCE_ONLY') {
  fail('Demo peer review fixture must expose the local evidence prefix guard');
}
if (!String(DEMO_PEER_REVIEW_REWARD_FIXTURE.evidence_id).startsWith('evidence_demo_')) {
  fail('Demo peer review fixture evidence id must remain local demo evidence');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_created_at_guard !== 'LOCAL_FIXED_FIXTURE_TIMESTAMP_REQUIRED') {
  fail('Demo peer review fixture must expose the fixed timestamp guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.created_at !== '2026-05-13T00:00:00.000Z') {
  fail('Demo peer review fixture created_at must remain the fixed local fixture timestamp');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_scope_guard !== 'LOCAL_QUALITY_REVIEW_ONLY') {
  fail('Demo peer review fixture must expose the local quality review scope guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.review_scope !== 'quality_review_only') {
  fail('Demo peer review fixture scope must remain quality_review_only');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_attestation_guard !== 'LOCAL_REVIEWER_ATTESTATION_REQUIRED') {
  fail('Demo peer review fixture must expose the reviewer attestation guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.reviewer_attestation_status !== 'demo_attested_local_only') {
  fail('Demo peer review fixture reviewer attestation status must remain demo_attested_local_only');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_source_channel_guard !== 'LOCAL_DEMO_SOURCE_CHANNEL_REQUIRED') {
  fail('Demo peer review fixture must expose the local demo source channel guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.source_channel !== 'local_demo_peer_review') {
  fail('Demo peer review fixture source channel must remain local_demo_peer_review');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_evidence_review_status_guard !== 'LOCAL_EVIDENCE_REVIEW_STATUS_REQUIRED') {
  fail('Demo peer review fixture must expose the local evidence review status guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.evidence_review_status !== 'local_demo_evidence_review_pending') {
  fail('Demo peer review fixture evidence review status must remain local_demo_evidence_review_pending');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_publication_status_guard !== 'LOCAL_PUBLICATION_STATUS_REQUIRED') {
  fail('Demo peer review fixture must expose the local publication status guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.publication_status !== 'local_demo_not_published') {
  fail('Demo peer review fixture publication status must remain local_demo_not_published');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_reward_calculation_mode_guard !== 'LOCAL_REWARD_CALCULATION_MODE_REQUIRED') {
  fail('Demo peer review fixture must expose the local reward calculation mode guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.reward_calculation_mode !== 'label_only_no_token_amount') {
  fail('Demo peer review fixture reward calculation mode must remain label-only with no token amount');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_payout_destination_guard !== 'LOCAL_NO_PAYOUT_DESTINATION_REQUIRED') {
  fail('Demo peer review fixture must expose the local no payout destination guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.payout_destination !== 'none_local_demo') {
  fail('Demo peer review fixture payout destination must remain none_local_demo');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_payout_authorization_guard !== 'LOCAL_NO_PAYOUT_AUTHORIZATION_REQUIRED') {
  fail('Demo peer review fixture must expose the local no payout authorization guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.payout_authorization_status !== 'not_authorized_local_demo') {
  fail('Demo peer review fixture payout authorization status must remain not_authorized_local_demo');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_transfer_reference_guard !== 'LOCAL_NO_TRANSFER_REFERENCE_REQUIRED') {
  fail('Demo peer review fixture must expose the local no transfer reference guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.transfer_reference !== 'none_local_demo') {
  fail('Demo peer review fixture transfer reference must remain none_local_demo');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_settlement_batch_guard !== 'LOCAL_NO_SETTLEMENT_BATCH_REQUIRED') {
  fail('Demo peer review fixture must expose the local no settlement batch guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.settlement_batch_id !== 'none_local_demo') {
  fail('Demo peer review fixture settlement batch id must remain none_local_demo');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_disbursement_status_guard !== 'LOCAL_NO_DISBURSEMENT_REQUIRED') {
  fail('Demo peer review fixture must expose the local no disbursement guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.disbursement_status !== 'not_disbursed_local_demo') {
  fail('Demo peer review fixture disbursement status must remain not_disbursed_local_demo');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_ledger_posting_guard !== 'LOCAL_NO_LEDGER_POSTING_REQUIRED') {
  fail('Demo peer review fixture must expose the local no ledger posting guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.ledger_posting_status !== 'not_posted_local_demo') {
  fail('Demo peer review fixture ledger posting status must remain not_posted_local_demo');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_external_notification_guard !== 'LOCAL_NO_EXTERNAL_NOTIFICATION_REQUIRED') {
  fail('Demo peer review fixture must expose the local no external notification guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.external_notification_status !== 'not_sent_local_demo') {
  fail('Demo peer review fixture external notification status must remain not_sent_local_demo');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_appeal_window_guard !== 'LOCAL_APPEAL_WINDOW_REQUIRED') {
  fail('Demo peer review fixture must expose the local appeal window guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.appeal_window_status !== 'open_local_demo') {
  fail('Demo peer review fixture appeal window status must remain open_local_demo');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_appeal_resolution_guard !== 'LOCAL_APPEAL_RESOLUTION_PENDING_REQUIRED') {
  fail('Demo peer review fixture must expose the local appeal resolution guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.appeal_resolution_status !== 'pending_local_demo') {
  fail('Demo peer review fixture appeal resolution status must remain pending_local_demo');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_appeal_evidence_guard !== 'LOCAL_APPEAL_EVIDENCE_PENDING_REQUIRED') {
  fail('Demo peer review fixture must expose the local appeal evidence guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.appeal_evidence_status !== 'pending_local_demo') {
  fail('Demo peer review fixture appeal evidence status must remain pending_local_demo');
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_appeal_moderator_assignment_guard !==
  'LOCAL_NO_APPEAL_MODERATOR_ASSIGNMENT_REQUIRED'
) {
  fail('Demo peer review fixture must expose the local no appeal moderator assignment guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.appeal_moderator_assignment_status !== 'unassigned_local_demo') {
  fail('Demo peer review fixture appeal moderator assignment status must remain unassigned_local_demo');
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_appeal_moderator_conflict_guard !==
  'LOCAL_NO_APPEAL_MODERATOR_CONFLICT_REVIEW_REQUIRED'
) {
  fail('Demo peer review fixture must expose the local no appeal moderator conflict review guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.appeal_moderator_conflict_status !== 'not_reviewed_local_demo') {
  fail('Demo peer review fixture appeal moderator conflict status must remain not_reviewed_local_demo');
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_appeal_moderator_decision_guard !==
  'LOCAL_NO_APPEAL_MODERATOR_DECISION_REQUIRED'
) {
  fail('Demo peer review fixture must expose the local no appeal moderator decision guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.appeal_moderator_decision_status !== 'pending_local_demo') {
  fail('Demo peer review fixture appeal moderator decision status must remain pending_local_demo');
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_appeal_party_notification_guard !==
  'LOCAL_NO_APPEAL_PARTY_NOTIFICATION_REQUIRED'
) {
  fail('Demo peer review fixture must expose the local no appeal party notification guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.appeal_party_notification_status !== 'not_sent_local_demo') {
  fail('Demo peer review fixture appeal party notification status must remain not_sent_local_demo');
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_appeal_notification_acknowledgement_guard !==
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REQUIRED'
) {
  fail('Demo peer review fixture must expose the local no appeal notification acknowledgement guard');
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.appeal_notification_acknowledgement_status !== 'not_acknowledged_local_demo'
) {
  fail('Demo peer review fixture appeal notification acknowledgement status must remain not_acknowledged_local_demo');
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_appeal_notification_acknowledgement_evidence_guard !==
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_EVIDENCE_REQUIRED'
) {
  fail('Demo peer review fixture must expose the local no appeal notification acknowledgement evidence guard');
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.appeal_notification_acknowledgement_evidence_status !==
  'not_recorded_local_demo'
) {
  fail(
    'Demo peer review fixture appeal notification acknowledgement evidence status must remain not_recorded_local_demo',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_appeal_notification_acknowledgement_replay_guard !==
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_REQUIRED'
) {
  fail('Demo peer review fixture must expose the local no appeal notification acknowledgement replay guard');
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.appeal_notification_acknowledgement_replay_status !==
  'not_replayed_local_demo'
) {
  fail(
    'Demo peer review fixture appeal notification acknowledgement replay status must remain not_replayed_local_demo',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_appeal_notification_acknowledgement_replay_digest_guard !==
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_REQUIRED'
) {
  fail('Demo peer review fixture must expose the local no appeal notification acknowledgement replay digest guard');
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.appeal_notification_acknowledgement_replay_digest_status !==
  'not_generated_local_demo'
) {
  fail(
    'Demo peer review fixture appeal notification acknowledgement replay digest status must remain not_generated_local_demo',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_appeal_notification_acknowledgement_replay_digest_archive_guard !==
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_ARCHIVE_REQUIRED'
) {
  fail('Demo peer review fixture must expose the local no appeal notification acknowledgement replay digest archive guard');
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.appeal_notification_acknowledgement_replay_digest_archive_status !==
  'not_archived_local_demo'
) {
  fail(
    'Demo peer review fixture appeal notification acknowledgement replay digest archive status must remain not_archived_local_demo',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_appeal_notification_acknowledgement_replay_digest_archive_index_guard !==
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_ARCHIVE_INDEX_REQUIRED'
) {
  fail(
    'Demo peer review fixture must expose the local no appeal notification acknowledgement replay digest archive index guard',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.appeal_notification_acknowledgement_replay_digest_archive_index_status !==
  'not_indexed_local_demo'
) {
  fail(
    'Demo peer review fixture appeal notification acknowledgement replay digest archive index status must remain not_indexed_local_demo',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_appeal_notification_acknowledgement_replay_digest_archive_index_closeout_guard !==
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_ARCHIVE_INDEX_CLOSEOUT_REQUIRED'
) {
  fail(
    'Demo peer review fixture must expose the local no appeal notification acknowledgement replay digest archive index closeout guard',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.appeal_notification_acknowledgement_replay_digest_archive_index_closeout_status !==
  'not_closed_local_demo'
) {
  fail(
    'Demo peer review fixture appeal notification acknowledgement replay digest archive index closeout status must remain not_closed_local_demo',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_guard !==
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_REQUIRED'
) {
  fail(
    'Demo peer review fixture must expose the local no appeal notification acknowledgement replay digest archive index closeout handoff guard',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_status !==
  'not_handed_off_local_demo'
) {
  fail(
    'Demo peer review fixture appeal notification acknowledgement replay digest archive index closeout handoff status must remain not_handed_off_local_demo',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_guard !==
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_REQUIRED'
) {
  fail(
    'Demo peer review fixture must expose the local no appeal notification acknowledgement replay digest archive index closeout handoff closeout guard',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_status !==
  'not_closed_local_demo'
) {
  fail(
    'Demo peer review fixture appeal notification acknowledgement replay digest archive index closeout handoff closeout status must remain not_closed_local_demo',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_guard !==
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_ARCHIVE_REQUIRED'
) {
  fail(
    'Demo peer review fixture must expose the local no appeal notification acknowledgement replay digest archive index closeout handoff closeout archive guard',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_status !==
  'not_archived_local_demo'
) {
  fail(
    'Demo peer review fixture appeal notification acknowledgement replay digest archive index closeout handoff closeout archive status must remain not_archived_local_demo',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_guard !==
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_REQUIRED'
) {
  fail(
    'Demo peer review fixture must expose the local no appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index guard',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_status !==
  'not_indexed_local_demo'
) {
  fail(
    'Demo peer review fixture appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index status must remain not_indexed_local_demo',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_closeout_guard !==
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_REQUIRED'
) {
  fail(
    'Demo peer review fixture must expose the local no appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout guard',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_closeout_status !==
  'not_closed_local_demo'
) {
  fail(
    'Demo peer review fixture appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout status must remain not_closed_local_demo',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_closeout_handoff_guard !==
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_REQUIRED'
) {
  fail(
    'Demo peer review fixture must expose the local no appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff guard',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_closeout_handoff_status !==
  'not_handed_off_local_demo'
) {
  fail(
    'Demo peer review fixture appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff status must remain not_handed_off_local_demo',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_closeout_handoff_closeout_guard !==
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_REQUIRED'
) {
  fail(
    'Demo peer review fixture must expose the local no appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout guard',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_closeout_handoff_closeout_status !==
  'not_closed_local_demo'
) {
  fail(
    'Demo peer review fixture appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout status must remain not_closed_local_demo',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_closeout_handoff_closeout_archive_guard !==
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_ARCHIVE_REQUIRED'
) {
  fail(
    'Demo peer review fixture must expose the local no appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout archive guard',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_closeout_handoff_closeout_archive_status !==
  'not_archived_local_demo'
) {
  fail(
    'Demo peer review fixture appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout archive status must remain not_archived_local_demo',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_closeout_handoff_closeout_archive_index_guard !==
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_REQUIRED'
) {
  fail(
    'Demo peer review fixture must expose the local no appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout archive index guard',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_closeout_handoff_closeout_archive_index_status !==
  'not_indexed_local_demo'
) {
  fail(
    'Demo peer review fixture appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout archive index status must remain not_indexed_local_demo',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_closeout_handoff_closeout_archive_index_closeout_guard !==
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_REQUIRED'
) {
  fail(
    'Demo peer review fixture must expose the local no appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout archive index closeout guard',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_closeout_handoff_closeout_archive_index_closeout_status !==
  'not_closed_local_demo'
) {
  fail(
    'Demo peer review fixture appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout archive index closeout status must remain not_closed_local_demo',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_closeout_handoff_closeout_archive_index_closeout_handoff_guard !==
  'LOCAL_NO_APPEAL_NOTIFICATION_ACKNOWLEDGEMENT_REPLAY_DIGEST_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_CLOSEOUT_ARCHIVE_INDEX_CLOSEOUT_HANDOFF_REQUIRED'
) {
  fail(
    'Demo peer review fixture must expose the local no appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout archive index closeout handoff guard',
  );
}
if (
  DEMO_PEER_REVIEW_REWARD_FIXTURE.appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_closeout_handoff_closeout_archive_index_closeout_handoff_status !==
  'not_handed_off_local_demo'
) {
  fail(
    'Demo peer review fixture appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout archive index closeout handoff status must remain not_handed_off_local_demo',
  );
}

for (const [flag, value] of Object.entries(BLOCKED_PEER_REVIEW_REWARD_FLAGS)) {
  if (value !== false) fail(`${flag} must be false`);
  if (DEMO_PEER_REVIEW_REWARD_FIXTURE[flag] !== false) fail(`Demo fixture ${flag} must be false`);
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, request_id: '' });
  fail('Peer review reward transition must reject missing request_id');
} catch (error) {
  if (!String(error.message).includes('request_id')) fail('Missing request_id error must name request_id');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, evidence_id: 'sk_live_demo_secret_value' });
  fail('Peer review reward transition must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, action: 'issue_real_reward' });
  fail('Peer review reward transition must reject invalid actions');
} catch (error) {
  if (!String(error.message).includes('action')) fail('Invalid action error must name action');
}

try {
  applyPeerReviewRewardTransition({
    ...DEMO_PEER_REVIEW_REWARD_FIXTURE,
    previous_state: 'submitted',
    next_state: 'reward_label_recorded',
  });
  fail('Peer review reward transition must reject invalid state changes');
} catch (error) {
  if (!String(error.message).includes('transition')) fail('Invalid transition error must name transition');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, safety_gate: 'production-ready' });
  fail('Peer review reward transition must reject production safety gate labels');
} catch (error) {
  if (!String(error.message).includes('safety gate')) fail('Invalid safety gate error must name safety gate');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, actor_role: 'admin_operator' });
  fail('Peer review reward transition must reject non-peer-reviewer actor roles');
} catch (error) {
  if (!String(error.message).includes('actor role')) fail('Invalid actor role error must name actor role');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, request_id: 'req_prod_peer_review_reward_001' });
  fail('Peer review reward transition must reject non-demo request ids');
} catch (error) {
  if (!String(error.message).includes('identifier prefix')) fail('Invalid request id error must name identifier prefix');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, reviewer_id: 'reviewer_live_001' });
  fail('Peer review reward transition must reject non-demo reviewer ids');
} catch (error) {
  if (!String(error.message).includes('identifier prefix')) fail('Invalid reviewer id error must name identifier prefix');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, founder_approval_status: 'approved' });
  fail('Peer review reward transition must reject approved founder status');
} catch (error) {
  if (!String(error.message).includes('review status')) fail('Invalid founder status error must name review status');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, legal_provider_status: 'waived' });
  fail('Peer review reward transition must reject waived legal provider status');
} catch (error) {
  if (!String(error.message).includes('review status')) fail('Invalid legal provider status error must name review status');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, conflict_of_interest_status: 'approved' });
  fail('Peer review reward transition must reject approved conflict status');
} catch (error) {
  if (!String(error.message).includes('conflict status')) fail('Invalid conflict status error must name conflict status');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, reward_label: 'real_token_reward_25_gcsc' });
  fail('Peer review reward transition must reject real reward labels');
} catch (error) {
  if (!String(error.message).includes('label-only')) fail('Invalid reward label error must name label-only boundary');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, recommendation_label: 'release_payment_now' });
  fail('Peer review reward transition must reject payment-release recommendation labels');
} catch (error) {
  if (!String(error.message).includes('scoring label')) fail('Invalid recommendation label error must name scoring label boundary');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, abuse_flag: true });
  fail('Peer review reward transition must reject abuse-flagged reward labels');
} catch (error) {
  if (!String(error.message).includes('abuse flag')) fail('Invalid abuse flag error must name abuse flag boundary');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, evidence_id: 'evidence_live_roof_001' });
  fail('Peer review reward transition must reject non-demo evidence ids');
} catch (error) {
  if (!String(error.message).includes('evidence id')) fail('Invalid evidence id error must name evidence id boundary');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, created_at: '2026-05-14T00:00:00.000Z' });
  fail('Peer review reward transition must reject non-fixed fixture timestamps');
} catch (error) {
  if (!String(error.message).includes('created_at')) fail('Invalid created_at error must name created_at boundary');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, review_scope: 'payment_release_authority' });
  fail('Peer review reward transition must reject payment authority review scope');
} catch (error) {
  if (!String(error.message).includes('review scope')) fail('Invalid review scope error must name review scope boundary');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, reviewer_attestation_status: 'attested_for_payment_release' });
  fail('Peer review reward transition must reject payment-release attestation status');
} catch (error) {
  if (!String(error.message).includes('attestation')) fail('Invalid attestation status error must name attestation boundary');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, source_channel: 'production_provider_api' });
  fail('Peer review reward transition must reject production source channels');
} catch (error) {
  if (!String(error.message).includes('source channel')) fail('Invalid source channel error must name source channel boundary');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, evidence_review_status: 'provider_verified_for_payment_release' });
  fail('Peer review reward transition must reject provider-verified evidence review status');
} catch (error) {
  if (!String(error.message).includes('evidence review status')) fail('Invalid evidence review status error must name evidence review status boundary');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, publication_status: 'public_reputation_published' });
  fail('Peer review reward transition must reject public publication status');
} catch (error) {
  if (!String(error.message).includes('publication status')) fail('Invalid publication status error must name publication status boundary');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, reward_calculation_mode: 'calculate_token_amount' });
  fail('Peer review reward transition must reject token reward calculation modes');
} catch (error) {
  if (!String(error.message).includes('reward calculation mode')) fail('Invalid reward calculation mode error must name reward calculation mode boundary');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, payout_destination: 'reviewer_wallet_xpr_001' });
  fail('Peer review reward transition must reject payout destinations');
} catch (error) {
  if (!String(error.message).includes('payout destination')) fail('Invalid payout destination error must name payout destination boundary');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, payout_authorization_status: 'authorized_for_transfer' });
  fail('Peer review reward transition must reject payout authorization status');
} catch (error) {
  if (!String(error.message).includes('payout authorization')) fail('Invalid payout authorization error must name payout authorization boundary');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, transfer_reference: 'xpr_transfer_tx_001' });
  fail('Peer review reward transition must reject transfer references');
} catch (error) {
  if (!String(error.message).includes('transfer reference')) fail('Invalid transfer reference error must name transfer reference boundary');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, settlement_batch_id: 'settlement_batch_live_001' });
  fail('Peer review reward transition must reject settlement batch ids');
} catch (error) {
  if (!String(error.message).includes('settlement batch')) fail('Invalid settlement batch error must name settlement batch boundary');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, disbursement_status: 'disbursed' });
  fail('Peer review reward transition must reject disbursement statuses');
} catch (error) {
  if (!String(error.message).includes('disbursement status')) fail('Invalid disbursement status error must name disbursement status boundary');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, ledger_posting_status: 'posted_to_reward_ledger' });
  fail('Peer review reward transition must reject ledger posting statuses');
} catch (error) {
  if (!String(error.message).includes('ledger posting')) fail('Invalid ledger posting status error must name ledger posting boundary');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, external_notification_status: 'sent_to_provider' });
  fail('Peer review reward transition must reject external notification statuses');
} catch (error) {
  if (!String(error.message).includes('external notification')) fail('Invalid external notification status error must name external notification boundary');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, appeal_window_status: 'closed_final' });
  fail('Peer review reward transition must reject closed appeal windows');
} catch (error) {
  if (!String(error.message).includes('appeal window')) fail('Invalid appeal window status error must name appeal window boundary');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, appeal_resolution_status: 'resolved_final' });
  fail('Peer review reward transition must reject final appeal resolutions');
} catch (error) {
  if (!String(error.message).includes('appeal resolution')) fail('Invalid appeal resolution status error must name appeal resolution boundary');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, appeal_evidence_status: 'accepted_final' });
  fail('Peer review reward transition must reject final appeal evidence statuses');
} catch (error) {
  if (!String(error.message).includes('appeal evidence')) fail('Invalid appeal evidence status error must name appeal evidence boundary');
}

try {
  applyPeerReviewRewardTransition({
    ...DEMO_PEER_REVIEW_REWARD_FIXTURE,
    appeal_moderator_assignment_status: 'assigned_to_live_moderator',
  });
  fail('Peer review reward transition must reject appeal moderator assignments');
} catch (error) {
  if (!String(error.message).includes('appeal moderator')) {
    fail('Invalid appeal moderator assignment error must name appeal moderator boundary');
  }
}

try {
  applyPeerReviewRewardTransition({
    ...DEMO_PEER_REVIEW_REWARD_FIXTURE,
    appeal_moderator_conflict_status: 'cleared_for_live_moderator',
  });
  fail('Peer review reward transition must reject appeal moderator conflict clearance');
} catch (error) {
  if (!String(error.message).includes('appeal moderator conflict')) {
    fail('Invalid appeal moderator conflict status error must name appeal moderator conflict boundary');
  }
}

try {
  applyPeerReviewRewardTransition({
    ...DEMO_PEER_REVIEW_REWARD_FIXTURE,
    appeal_moderator_decision_status: 'final_decision_live_release',
  });
  fail('Peer review reward transition must reject appeal moderator decisions');
} catch (error) {
  if (!String(error.message).includes('appeal moderator decision')) {
    fail('Invalid appeal moderator decision status error must name appeal moderator decision boundary');
  }
}

try {
  applyPeerReviewRewardTransition({
    ...DEMO_PEER_REVIEW_REWARD_FIXTURE,
    appeal_party_notification_status: 'sent_to_live_parties',
  });
  fail('Peer review reward transition must reject appeal party notifications');
} catch (error) {
  if (!String(error.message).includes('appeal party notification')) {
    fail('Invalid appeal party notification status error must name appeal party notification boundary');
  }
}

try {
  applyPeerReviewRewardTransition({
    ...DEMO_PEER_REVIEW_REWARD_FIXTURE,
    appeal_notification_acknowledgement_status: 'acknowledged_for_live_finality',
  });
  fail('Peer review reward transition must reject appeal notification acknowledgement');
} catch (error) {
  if (!String(error.message).includes('appeal notification acknowledgement')) {
    fail('Invalid appeal notification acknowledgement status error must name appeal notification acknowledgement boundary');
  }
}

try {
  applyPeerReviewRewardTransition({
    ...DEMO_PEER_REVIEW_REWARD_FIXTURE,
    appeal_notification_acknowledgement_evidence_status: 'recorded_for_live_finality',
  });
  fail('Peer review reward transition must reject appeal notification acknowledgement evidence');
} catch (error) {
  if (!String(error.message).includes('appeal notification acknowledgement evidence')) {
    fail(
      'Invalid appeal notification acknowledgement evidence status error must name appeal notification acknowledgement evidence boundary',
    );
  }
}

try {
  applyPeerReviewRewardTransition({
    ...DEMO_PEER_REVIEW_REWARD_FIXTURE,
    appeal_notification_acknowledgement_replay_status: 'replayed_for_live_finality',
  });
  fail('Peer review reward transition must reject appeal notification acknowledgement replay');
} catch (error) {
  if (!String(error.message).includes('appeal notification acknowledgement replay')) {
    fail(
      'Invalid appeal notification acknowledgement replay status error must name appeal notification acknowledgement replay boundary',
    );
  }
}

try {
  applyPeerReviewRewardTransition({
    ...DEMO_PEER_REVIEW_REWARD_FIXTURE,
    appeal_notification_acknowledgement_replay_digest_status: 'generated_for_live_finality',
  });
  fail('Peer review reward transition must reject appeal notification acknowledgement replay digest');
} catch (error) {
  if (!String(error.message).includes('appeal notification acknowledgement replay digest')) {
    fail(
      'Invalid appeal notification acknowledgement replay digest status error must name appeal notification acknowledgement replay digest boundary',
    );
  }
}

try {
  applyPeerReviewRewardTransition({
    ...DEMO_PEER_REVIEW_REWARD_FIXTURE,
    appeal_notification_acknowledgement_replay_digest_archive_status: 'archived_for_live_finality',
  });
  fail('Peer review reward transition must reject appeal notification acknowledgement replay digest archive');
} catch (error) {
  if (!String(error.message).includes('appeal notification acknowledgement replay digest archive')) {
    fail(
      'Invalid appeal notification acknowledgement replay digest archive status error must name appeal notification acknowledgement replay digest archive boundary',
    );
  }
}

try {
  applyPeerReviewRewardTransition({
    ...DEMO_PEER_REVIEW_REWARD_FIXTURE,
    appeal_notification_acknowledgement_replay_digest_archive_index_status: 'indexed_for_live_finality',
  });
  fail('Peer review reward transition must reject appeal notification acknowledgement replay digest archive index');
} catch (error) {
  if (!String(error.message).includes('appeal notification acknowledgement replay digest archive index')) {
    fail(
      'Invalid appeal notification acknowledgement replay digest archive index status error must name appeal notification acknowledgement replay digest archive index boundary',
    );
  }
}

try {
  applyPeerReviewRewardTransition({
    ...DEMO_PEER_REVIEW_REWARD_FIXTURE,
    appeal_notification_acknowledgement_replay_digest_archive_index_closeout_status: 'closed_for_live_finality',
  });
  fail('Peer review reward transition must reject appeal notification acknowledgement replay digest archive index closeout');
} catch (error) {
  if (!String(error.message).includes('appeal notification acknowledgement replay digest archive index closeout')) {
    fail(
      'Invalid appeal notification acknowledgement replay digest archive index closeout status error must name appeal notification acknowledgement replay digest archive index closeout boundary',
    );
  }
}

try {
  applyPeerReviewRewardTransition({
    ...DEMO_PEER_REVIEW_REWARD_FIXTURE,
    appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_status:
      'handed_off_for_live_finality',
  });
  fail('Peer review reward transition must reject appeal notification acknowledgement replay digest archive index closeout handoff');
} catch (error) {
  if (!String(error.message).includes('appeal notification acknowledgement replay digest archive index closeout handoff')) {
    fail(
      'Invalid appeal notification acknowledgement replay digest archive index closeout handoff status error must name appeal notification acknowledgement replay digest archive index closeout handoff boundary',
    );
  }
}

try {
  applyPeerReviewRewardTransition({
    ...DEMO_PEER_REVIEW_REWARD_FIXTURE,
    appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_status:
      'closed_for_live_finality',
  });
  fail('Peer review reward transition must reject appeal notification acknowledgement replay digest archive index closeout handoff closeout');
} catch (error) {
  if (
    !String(error.message).includes(
      'appeal notification acknowledgement replay digest archive index closeout handoff closeout',
    )
  ) {
    fail(
      'Invalid appeal notification acknowledgement replay digest archive index closeout handoff closeout status error must name appeal notification acknowledgement replay digest archive index closeout handoff closeout boundary',
    );
  }
}

try {
  applyPeerReviewRewardTransition({
    ...DEMO_PEER_REVIEW_REWARD_FIXTURE,
    appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_status:
      'archived_for_live_finality',
  });
  fail(
    'Peer review reward transition must reject appeal notification acknowledgement replay digest archive index closeout handoff closeout archive',
  );
} catch (error) {
  if (
    !String(error.message).includes(
      'appeal notification acknowledgement replay digest archive index closeout handoff closeout archive',
    )
  ) {
    fail(
      'Invalid appeal notification acknowledgement replay digest archive index closeout handoff closeout archive status error must name appeal notification acknowledgement replay digest archive index closeout handoff closeout archive boundary',
    );
  }
}

try {
  applyPeerReviewRewardTransition({
    ...DEMO_PEER_REVIEW_REWARD_FIXTURE,
    appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_status:
      'indexed_for_live_finality',
  });
  fail(
    'Peer review reward transition must reject appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index',
  );
} catch (error) {
  if (
    !String(error.message).includes(
      'appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index',
    )
  ) {
    fail(
      'Invalid appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index status error must name appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index boundary',
    );
  }
}

try {
  applyPeerReviewRewardTransition({
    ...DEMO_PEER_REVIEW_REWARD_FIXTURE,
    appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_closeout_status:
      'closed_for_live_finality',
  });
  fail(
    'Peer review reward transition must reject appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout',
  );
} catch (error) {
  if (
    !String(error.message).includes(
      'appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout',
    )
  ) {
    fail(
      'Invalid appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout status error must name appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout boundary',
    );
  }
}

try {
  applyPeerReviewRewardTransition({
    ...DEMO_PEER_REVIEW_REWARD_FIXTURE,
    appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_closeout_handoff_status:
      'handed_off_for_live_finality',
  });
  fail(
    'Peer review reward transition must reject appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff',
  );
} catch (error) {
  if (
    !String(error.message).includes(
      'appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff',
    )
  ) {
    fail(
      'Invalid appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff status error must name appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff boundary',
    );
  }
}

try {
  applyPeerReviewRewardTransition({
    ...DEMO_PEER_REVIEW_REWARD_FIXTURE,
    appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_closeout_handoff_closeout_status:
      'closed_for_live_finality',
  });
  fail(
    'Peer review reward transition must reject appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout',
  );
} catch (error) {
  if (
    !String(error.message).includes(
      'appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout',
    )
  ) {
    fail(
      'Invalid appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout status error must name appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout boundary',
    );
  }
}

try {
  applyPeerReviewRewardTransition({
    ...DEMO_PEER_REVIEW_REWARD_FIXTURE,
    appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_closeout_handoff_closeout_archive_status:
      'archived_for_live_finality',
  });
  fail(
    'Peer review reward transition must reject appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout archive',
  );
} catch (error) {
  if (
    !String(error.message).includes(
      'appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout archive',
    )
  ) {
    fail(
      'Invalid appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout archive status error must name appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout archive boundary',
    );
  }
}

try {
  applyPeerReviewRewardTransition({
    ...DEMO_PEER_REVIEW_REWARD_FIXTURE,
    appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_closeout_handoff_closeout_archive_index_status:
      'indexed_for_live_finality',
  });
  fail(
    'Peer review reward transition must reject appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout archive index',
  );
} catch (error) {
  if (
    !String(error.message).includes(
      'appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout archive index',
    )
  ) {
    fail(
      'Invalid appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout archive index status error must name appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout archive index boundary',
    );
  }
}

try {
  applyPeerReviewRewardTransition({
    ...DEMO_PEER_REVIEW_REWARD_FIXTURE,
    appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_closeout_handoff_closeout_archive_index_closeout_status:
      'closed_for_live_finality',
  });
  fail(
    'Peer review reward transition must reject appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout archive index closeout',
  );
} catch (error) {
  if (
    !String(error.message).includes(
      'appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout archive index closeout',
    )
  ) {
    fail(
      'Invalid appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout archive index closeout status error must name appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout archive index closeout boundary',
    );
  }
}

try {
  applyPeerReviewRewardTransition({
    ...DEMO_PEER_REVIEW_REWARD_FIXTURE,
    appeal_notification_acknowledgement_replay_digest_archive_index_closeout_handoff_closeout_archive_index_closeout_handoff_closeout_archive_index_closeout_handoff_status:
      'handed_off_for_live_finality',
  });
  fail(
    'Peer review reward transition must reject appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout archive index closeout handoff',
  );
} catch (error) {
  if (
    !String(error.message).includes(
      'appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout archive index closeout handoff',
    )
  ) {
    fail(
      'Invalid appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout archive index closeout handoff status error must name appeal notification acknowledgement replay digest archive index closeout handoff closeout archive index closeout handoff closeout archive index closeout handoff boundary',
    );
  }
}

assertIncludes(context, 'Smart contract review state local helper', contextPath);
assertIncludes(context, 'check:smart-contract-review-state-local', contextPath);
assertIncludes(backlog, 'Smart contract review state local helper', backlogPath);
assertIncludes(backlog, 'check:smart-contract-review-state-local', backlogPath);
assertIncludes(realAudit, 'Smart contract review state local helper', realAuditPath);

const scriptName = 'check:smart-contract-review-state-local';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

if (/sk_live_[a-z0-9]{12,}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(helper)) {
  fail('Peer review state helper must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_review_state_local_helper: helperPath,
  states_checked: PEER_REVIEW_REWARD_STATES.length,
  blocked_review_flags_checked: Object.keys(BLOCKED_PEER_REVIEW_REWARD_FLAGS).length,
}, null, 2));
