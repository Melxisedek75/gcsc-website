import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE } from './localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchive.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_FIELDS = Object.freeze([
  'approval_decision_external_owner_response_decision_evidence_archive_index_id',
  'approval_decision_external_owner_response_decision_evidence_archive_id',
  'approval_decision_external_owner_response_decision_evidence_closeout_id',
  'approval_decision_external_owner_response_decision_evidence_summary_id',
  'approval_decision_external_owner_response_decision_evidence_intake_id',
  'approval_decision_external_owner_response_decision_evidence_template_id',
  'approval_decision_external_owner_response_decision_register_closeout_id',
  'approval_decision_external_owner_response_decision_register_id',
  'approval_decision_external_owner_response_handoff_closeout_id',
  'approval_decision_external_owner_response_handoff_id',
  'approval_decision_external_owner_response_action_plan_id',
  'approval_decision_external_owner_response_summary_id',
  'approval_decision_external_owner_response_intake_id',
  'approval_decision_external_owner_response_template_id',
  'approval_decision_external_owner_packet_id',
  'approval_decision_closeout_id',
  'approval_decision_audit_trail_id',
  'approval_decision_routing_id',
  'approval_decision_intake_id',
  'approval_decision_draft_id',
  'approval_handoff_summary_id',
  'approval_evidence_template_id',
  'approval_checklist_id',
  'live_gate_id',
  'founder_packet_id',
  'proof_id',
  'request_id',
  'digest_id',
  'decision_evidence_archive_index_status',
  'source_decision_evidence_archive_status',
  'indexed_local_archive_items',
  'remaining_external_decision_slots',
  'accepted_decision_record_states',
  'module_order',
  'blocked_live_actions',
  'blocked_response_states',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  decision_evidence_archive_index_status: 'RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_PENDING_EXTERNAL_RECORDS',
});

export const LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_ITEMS = Object.freeze([
  'archive_snapshot_indexed',
  'external_decision_slots_indexed_as_pending',
  'manual_review_boundary_indexed',
  'live_authority_not_indexed_as_approved',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay approval decision external owner response decision evidence archive index: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveIndex(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay approval decision external owner response decision evidence archive index input must be an object');
  }

  const evidenceArchive = input.approval_decision_external_owner_response_decision_evidence_archive;
  if (!evidenceArchive?.local_only) {
    throw new Error('Local replay approval decision external owner response decision evidence archive index requires a local_only approval_decision_external_owner_response_decision_evidence_archive');
  }

  if (evidenceArchive.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay approval decision external owner response decision evidence archive index archive must be BLOCKED_FOR_LIVE');
  }

  if (evidenceArchive.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay approval decision external owner response decision evidence archive index archive must be PASS_LOCAL_ONLY');
  }

  if (evidenceArchive.decision_evidence_archive_status !== 'RESPONSE_DECISION_EVIDENCE_ARCHIVE_PENDING_EXTERNAL_RECORDS') {
    throw new Error('Local replay approval decision external owner response decision evidence archive index requires RESPONSE_DECISION_EVIDENCE_ARCHIVE_PENDING_EXTERNAL_RECORDS status');
  }

  if (!evidenceArchive.module_order?.includes('repayment_failure')) {
    throw new Error('Local replay approval decision external owner response decision evidence archive index archive module_order must include repayment_failure');
  }

  assertNoSecretLookingValue(input, 'local_replay_approval_decision_external_owner_response_decision_evidence_archive_index');

  const archiveIndex = {
    approval_decision_external_owner_response_decision_evidence_archive_index_id: input.approval_decision_external_owner_response_decision_evidence_archive_index_id,
    approval_decision_external_owner_response_decision_evidence_archive_id: evidenceArchive.approval_decision_external_owner_response_decision_evidence_archive_id,
    approval_decision_external_owner_response_decision_evidence_closeout_id: evidenceArchive.approval_decision_external_owner_response_decision_evidence_closeout_id,
    approval_decision_external_owner_response_decision_evidence_summary_id: evidenceArchive.approval_decision_external_owner_response_decision_evidence_summary_id,
    approval_decision_external_owner_response_decision_evidence_intake_id: evidenceArchive.approval_decision_external_owner_response_decision_evidence_intake_id,
    approval_decision_external_owner_response_decision_evidence_template_id: evidenceArchive.approval_decision_external_owner_response_decision_evidence_template_id,
    approval_decision_external_owner_response_decision_register_closeout_id: evidenceArchive.approval_decision_external_owner_response_decision_register_closeout_id,
    approval_decision_external_owner_response_decision_register_id: evidenceArchive.approval_decision_external_owner_response_decision_register_id,
    approval_decision_external_owner_response_handoff_closeout_id: evidenceArchive.approval_decision_external_owner_response_handoff_closeout_id,
    approval_decision_external_owner_response_handoff_id: evidenceArchive.approval_decision_external_owner_response_handoff_id,
    approval_decision_external_owner_response_action_plan_id: evidenceArchive.approval_decision_external_owner_response_action_plan_id,
    approval_decision_external_owner_response_summary_id: evidenceArchive.approval_decision_external_owner_response_summary_id,
    approval_decision_external_owner_response_intake_id: evidenceArchive.approval_decision_external_owner_response_intake_id,
    approval_decision_external_owner_response_template_id: evidenceArchive.approval_decision_external_owner_response_template_id,
    approval_decision_external_owner_packet_id: evidenceArchive.approval_decision_external_owner_packet_id,
    approval_decision_closeout_id: evidenceArchive.approval_decision_closeout_id,
    approval_decision_audit_trail_id: evidenceArchive.approval_decision_audit_trail_id,
    approval_decision_routing_id: evidenceArchive.approval_decision_routing_id,
    approval_decision_intake_id: evidenceArchive.approval_decision_intake_id,
    approval_decision_draft_id: evidenceArchive.approval_decision_draft_id,
    approval_handoff_summary_id: evidenceArchive.approval_handoff_summary_id,
    approval_evidence_template_id: evidenceArchive.approval_evidence_template_id,
    approval_checklist_id: evidenceArchive.approval_checklist_id,
    live_gate_id: evidenceArchive.live_gate_id,
    founder_packet_id: evidenceArchive.founder_packet_id,
    proof_id: evidenceArchive.proof_id,
    request_id: evidenceArchive.request_id,
    digest_id: evidenceArchive.digest_id,
    digest: evidenceArchive.digest,
    source_decision_evidence_archive_status: evidenceArchive.decision_evidence_archive_status,
    indexed_local_archive_items: LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_ITEMS,
    remaining_external_decision_slots: evidenceArchive.remaining_external_decision_slots,
    accepted_decision_record_states: evidenceArchive.accepted_decision_record_states,
    module_order: Object.freeze([...evidenceArchive.module_order]),
    blocked_live_actions: evidenceArchive.blocked_live_actions,
    blocked_response_states: evidenceArchive.blocked_response_states,
    created_at: input.created_at,
    ...LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_FIELDS) {
    if (archiveIndex[field] === undefined || archiveIndex[field] === null || archiveIndex[field] === '') {
      throw new Error(`Missing required local replay approval decision external owner response decision evidence archive index field: ${field}`);
    }
  }

  return Object.freeze(archiveIndex);
}

export const DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX = Object.freeze(createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveIndex({
  approval_decision_external_owner_response_decision_evidence_archive_index_id: 'local_replay_approval_decision_external_owner_response_decision_evidence_archive_index_demo_001',
  approval_decision_external_owner_response_decision_evidence_archive: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE,
  created_at: '2026-05-13T00:00:00.000Z',
}));
