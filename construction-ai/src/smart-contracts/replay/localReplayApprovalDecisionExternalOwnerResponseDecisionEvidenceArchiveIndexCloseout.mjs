import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX } from './localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveIndex.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT_FIELDS = Object.freeze([
  'approval_decision_external_owner_response_decision_evidence_archive_index_closeout_id',
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
  'module_order',
  'decision_evidence_archive_index_closeout_status',
  'source_decision_evidence_archive_index_status',
  'closed_local_archive_index_items',
  'remaining_external_decision_slots',
  'accepted_decision_record_states',
  'blocked_live_actions',
  'blocked_response_states',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  decision_evidence_archive_index_closeout_status: 'RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT_PENDING_EXTERNAL_RECORDS',
});

export const LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT_ITEMS = Object.freeze([
  'archive_index_snapshot_closed',
  'external_decision_slots_remain_pending',
  'manual_review_boundary_closed_local_only',
  'live_authority_not_closed_as_approved',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay approval decision external owner response decision evidence archive index closeout: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveIndexCloseout(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay approval decision external owner response decision evidence archive index closeout input must be an object');
  }

  const archiveIndex = input.approval_decision_external_owner_response_decision_evidence_archive_index;
  if (!archiveIndex?.local_only) {
    throw new Error('Local replay approval decision external owner response decision evidence archive index closeout requires a local_only approval_decision_external_owner_response_decision_evidence_archive_index');
  }

  if (archiveIndex.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay approval decision external owner response decision evidence archive index closeout archive index must be BLOCKED_FOR_LIVE');
  }

  if (archiveIndex.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay approval decision external owner response decision evidence archive index closeout archive index must be PASS_LOCAL_ONLY');
  }

  if (archiveIndex.decision_evidence_archive_index_status !== 'RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_PENDING_EXTERNAL_RECORDS') {
    throw new Error('Local replay approval decision external owner response decision evidence archive index closeout requires RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_PENDING_EXTERNAL_RECORDS status');
  }

  if (!archiveIndex.module_order?.includes('repayment_failure')) {
    throw new Error('Local replay approval decision external owner response decision evidence archive index closeout archive index module_order must include repayment_failure');
  }

  assertNoSecretLookingValue(input, 'local_replay_approval_decision_external_owner_response_decision_evidence_archive_index_closeout');

  const closeout = {
    approval_decision_external_owner_response_decision_evidence_archive_index_closeout_id: input.approval_decision_external_owner_response_decision_evidence_archive_index_closeout_id,
    approval_decision_external_owner_response_decision_evidence_archive_index_id: archiveIndex.approval_decision_external_owner_response_decision_evidence_archive_index_id,
    approval_decision_external_owner_response_decision_evidence_archive_id: archiveIndex.approval_decision_external_owner_response_decision_evidence_archive_id,
    approval_decision_external_owner_response_decision_evidence_closeout_id: archiveIndex.approval_decision_external_owner_response_decision_evidence_closeout_id,
    approval_decision_external_owner_response_decision_evidence_summary_id: archiveIndex.approval_decision_external_owner_response_decision_evidence_summary_id,
    approval_decision_external_owner_response_decision_evidence_intake_id: archiveIndex.approval_decision_external_owner_response_decision_evidence_intake_id,
    approval_decision_external_owner_response_decision_evidence_template_id: archiveIndex.approval_decision_external_owner_response_decision_evidence_template_id,
    approval_decision_external_owner_response_decision_register_closeout_id: archiveIndex.approval_decision_external_owner_response_decision_register_closeout_id,
    approval_decision_external_owner_response_decision_register_id: archiveIndex.approval_decision_external_owner_response_decision_register_id,
    approval_decision_external_owner_response_handoff_closeout_id: archiveIndex.approval_decision_external_owner_response_handoff_closeout_id,
    approval_decision_external_owner_response_handoff_id: archiveIndex.approval_decision_external_owner_response_handoff_id,
    approval_decision_external_owner_response_action_plan_id: archiveIndex.approval_decision_external_owner_response_action_plan_id,
    approval_decision_external_owner_response_summary_id: archiveIndex.approval_decision_external_owner_response_summary_id,
    approval_decision_external_owner_response_intake_id: archiveIndex.approval_decision_external_owner_response_intake_id,
    approval_decision_external_owner_response_template_id: archiveIndex.approval_decision_external_owner_response_template_id,
    approval_decision_external_owner_packet_id: archiveIndex.approval_decision_external_owner_packet_id,
    approval_decision_closeout_id: archiveIndex.approval_decision_closeout_id,
    approval_decision_audit_trail_id: archiveIndex.approval_decision_audit_trail_id,
    approval_decision_routing_id: archiveIndex.approval_decision_routing_id,
    approval_decision_intake_id: archiveIndex.approval_decision_intake_id,
    approval_decision_draft_id: archiveIndex.approval_decision_draft_id,
    approval_handoff_summary_id: archiveIndex.approval_handoff_summary_id,
    approval_evidence_template_id: archiveIndex.approval_evidence_template_id,
    approval_checklist_id: archiveIndex.approval_checklist_id,
    live_gate_id: archiveIndex.live_gate_id,
    founder_packet_id: archiveIndex.founder_packet_id,
    proof_id: archiveIndex.proof_id,
    request_id: archiveIndex.request_id,
    digest_id: archiveIndex.digest_id,
    digest: archiveIndex.digest,
    module_order: Object.freeze([...archiveIndex.module_order]),
    source_decision_evidence_archive_index_status: archiveIndex.decision_evidence_archive_index_status,
    closed_local_archive_index_items: LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT_ITEMS,
    remaining_external_decision_slots: archiveIndex.remaining_external_decision_slots,
    accepted_decision_record_states: archiveIndex.accepted_decision_record_states,
    blocked_live_actions: archiveIndex.blocked_live_actions,
    blocked_response_states: archiveIndex.blocked_response_states,
    created_at: input.created_at,
    ...LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT_FIELDS) {
    if (closeout[field] === undefined || closeout[field] === null || closeout[field] === '') {
      throw new Error(`Missing required local replay approval decision external owner response decision evidence archive index closeout field: ${field}`);
    }
  }

  return Object.freeze(closeout);
}

export const DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT = Object.freeze(createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveIndexCloseout({
  approval_decision_external_owner_response_decision_evidence_archive_index_closeout_id: 'local_replay_approval_decision_external_owner_response_decision_evidence_archive_index_closeout_demo_001',
  approval_decision_external_owner_response_decision_evidence_archive_index: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX,
  created_at: '2026-05-13T00:00:00.000Z',
}));
