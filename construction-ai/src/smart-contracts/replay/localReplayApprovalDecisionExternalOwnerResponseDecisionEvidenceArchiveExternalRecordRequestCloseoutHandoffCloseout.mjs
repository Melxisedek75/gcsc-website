import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF } from './localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveExternalRecordRequestCloseoutHandoff.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT_FIELDS = Object.freeze([
  'approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_handoff_closeout_id',
  'approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_handoff_id',
  'approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_id',
  'approval_decision_external_owner_response_decision_evidence_archive_external_record_request_id',
  'approval_decision_external_owner_response_decision_evidence_archive_handoff_closeout_id',
  'approval_decision_external_owner_response_decision_evidence_archive_handoff_id',
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
  'decision_evidence_archive_external_record_request_closeout_handoff_closeout_status',
  'source_decision_evidence_archive_external_record_request_closeout_handoff_status',
  'closed_external_record_request_closeout_handoff_items',
  'remaining_external_decision_slots',
  'accepted_decision_record_states',
  'blocked_live_actions',
  'blocked_response_states',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  decision_evidence_archive_external_record_request_closeout_handoff_closeout_status: 'RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT_PENDING_EXTERNAL_RECORDS',
});

export const LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT_ITEMS = Object.freeze([
  'external_record_request_closeout_handoff_snapshot_closed',
  'founder_legal_finance_security_xpr_records_still_required',
  'external_owner_review_still_pending',
  'live_authority_remains_blocked',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay approval decision external owner response decision evidence archive external record request closeout handoff closeout: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveExternalRecordRequestCloseoutHandoffCloseout(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay approval decision external owner response decision evidence archive external record request closeout handoff closeout input must be an object');
  }

  const handoff = input.approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_handoff;
  if (!handoff?.local_only) {
    throw new Error('Local replay approval decision external owner response decision evidence archive external record request closeout handoff closeout requires a local_only approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_handoff');
  }

  if (handoff.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay approval decision external owner response decision evidence archive external record request closeout handoff closeout source handoff must be BLOCKED_FOR_LIVE');
  }

  if (handoff.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay approval decision external owner response decision evidence archive external record request closeout handoff closeout source handoff must be PASS_LOCAL_ONLY');
  }

  if (handoff.decision_evidence_archive_external_record_request_closeout_handoff_status !== 'RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_PENDING_EXTERNAL_RECORDS') {
    throw new Error('Local replay approval decision external owner response decision evidence archive external record request closeout handoff closeout requires RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_PENDING_EXTERNAL_RECORDS status');
  }

  if (!handoff.module_order?.includes('repayment_failure')) {
    throw new Error('Local replay approval decision external owner response decision evidence archive external record request closeout handoff closeout requires repayment_failure module coverage from source handoff');
  }

  assertNoSecretLookingValue(input, 'local_replay_approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_handoff_closeout');

  const closeout = {
    approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_handoff_closeout_id: input.approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_handoff_closeout_id,
    approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_handoff_id: handoff.approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_handoff_id,
    approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_id: handoff.approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_id,
    approval_decision_external_owner_response_decision_evidence_archive_external_record_request_id: handoff.approval_decision_external_owner_response_decision_evidence_archive_external_record_request_id,
    approval_decision_external_owner_response_decision_evidence_archive_handoff_closeout_id: handoff.approval_decision_external_owner_response_decision_evidence_archive_handoff_closeout_id,
    approval_decision_external_owner_response_decision_evidence_archive_handoff_id: handoff.approval_decision_external_owner_response_decision_evidence_archive_handoff_id,
    approval_decision_external_owner_response_decision_evidence_archive_index_closeout_id: handoff.approval_decision_external_owner_response_decision_evidence_archive_index_closeout_id,
    approval_decision_external_owner_response_decision_evidence_archive_index_id: handoff.approval_decision_external_owner_response_decision_evidence_archive_index_id,
    approval_decision_external_owner_response_decision_evidence_archive_id: handoff.approval_decision_external_owner_response_decision_evidence_archive_id,
    approval_decision_external_owner_response_decision_evidence_closeout_id: handoff.approval_decision_external_owner_response_decision_evidence_closeout_id,
    approval_decision_external_owner_response_decision_evidence_summary_id: handoff.approval_decision_external_owner_response_decision_evidence_summary_id,
    approval_decision_external_owner_response_decision_evidence_intake_id: handoff.approval_decision_external_owner_response_decision_evidence_intake_id,
    approval_decision_external_owner_response_decision_evidence_template_id: handoff.approval_decision_external_owner_response_decision_evidence_template_id,
    approval_decision_external_owner_response_decision_register_closeout_id: handoff.approval_decision_external_owner_response_decision_register_closeout_id,
    approval_decision_external_owner_response_decision_register_id: handoff.approval_decision_external_owner_response_decision_register_id,
    approval_decision_external_owner_response_handoff_closeout_id: handoff.approval_decision_external_owner_response_handoff_closeout_id,
    approval_decision_external_owner_response_handoff_id: handoff.approval_decision_external_owner_response_handoff_id,
    approval_decision_external_owner_response_action_plan_id: handoff.approval_decision_external_owner_response_action_plan_id,
    approval_decision_external_owner_response_summary_id: handoff.approval_decision_external_owner_response_summary_id,
    approval_decision_external_owner_response_intake_id: handoff.approval_decision_external_owner_response_intake_id,
    approval_decision_external_owner_response_template_id: handoff.approval_decision_external_owner_response_template_id,
    approval_decision_external_owner_packet_id: handoff.approval_decision_external_owner_packet_id,
    approval_decision_closeout_id: handoff.approval_decision_closeout_id,
    approval_decision_audit_trail_id: handoff.approval_decision_audit_trail_id,
    approval_decision_routing_id: handoff.approval_decision_routing_id,
    approval_decision_intake_id: handoff.approval_decision_intake_id,
    approval_decision_draft_id: handoff.approval_decision_draft_id,
    approval_handoff_summary_id: handoff.approval_handoff_summary_id,
    approval_evidence_template_id: handoff.approval_evidence_template_id,
    approval_checklist_id: handoff.approval_checklist_id,
    live_gate_id: handoff.live_gate_id,
    founder_packet_id: handoff.founder_packet_id,
    proof_id: handoff.proof_id,
    request_id: handoff.request_id,
    digest_id: handoff.digest_id,
    digest: handoff.digest,
    module_order: Object.freeze([...handoff.module_order]),
    source_decision_evidence_archive_external_record_request_closeout_handoff_status: handoff.decision_evidence_archive_external_record_request_closeout_handoff_status,
    closed_external_record_request_closeout_handoff_items: LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT_ITEMS,
    remaining_external_decision_slots: handoff.remaining_external_decision_slots,
    accepted_decision_record_states: handoff.accepted_decision_record_states,
    blocked_live_actions: handoff.blocked_live_actions,
    blocked_response_states: handoff.blocked_response_states,
    created_at: input.created_at,
    ...LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT_FIELDS) {
    if (closeout[field] === undefined || closeout[field] === null || closeout[field] === '') {
      throw new Error(`Missing required local replay approval decision external owner response decision evidence archive external record request closeout handoff closeout field: ${field}`);
    }
  }

  return Object.freeze(closeout);
}

export const DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT = Object.freeze(createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveExternalRecordRequestCloseoutHandoffCloseout({
  approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_handoff_closeout_id: 'local_replay_approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_handoff_closeout_demo_001',
  approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_handoff: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF,
  created_at: '2026-05-13T00:00:00.000Z',
}));
