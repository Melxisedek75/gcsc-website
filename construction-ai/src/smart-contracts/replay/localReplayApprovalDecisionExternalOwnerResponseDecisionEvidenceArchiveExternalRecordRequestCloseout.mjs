import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST } from './localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveExternalRecordRequest.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_FIELDS = Object.freeze([
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
  'decision_evidence_archive_external_record_request_closeout_status',
  'source_decision_evidence_archive_external_record_request_status',
  'closed_external_record_request_items',
  'remaining_external_decision_slots',
  'accepted_decision_record_states',
  'blocked_live_actions',
  'blocked_response_states',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  decision_evidence_archive_external_record_request_closeout_status: 'RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_PENDING_EXTERNAL_RECORDS',
});

export const LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_ITEMS = Object.freeze([
  'external_record_request_snapshot_closed',
  'founder_written_decision_still_required',
  'legal_finance_security_xpr_records_still_required',
  'live_authority_remains_blocked',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay approval decision external owner response decision evidence archive external record request closeout: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveExternalRecordRequestCloseout(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay approval decision external owner response decision evidence archive external record request closeout input must be an object');
  }

  const request = input.approval_decision_external_owner_response_decision_evidence_archive_external_record_request;
  if (!request?.local_only) {
    throw new Error('Local replay approval decision external owner response decision evidence archive external record request closeout requires a local_only approval_decision_external_owner_response_decision_evidence_archive_external_record_request');
  }

  if (request.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay approval decision external owner response decision evidence archive external record request closeout source request must be BLOCKED_FOR_LIVE');
  }

  if (request.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay approval decision external owner response decision evidence archive external record request closeout source request must be PASS_LOCAL_ONLY');
  }

  if (request.decision_evidence_archive_external_record_request_status !== 'RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_PENDING_EXTERNAL_RECORDS') {
    throw new Error('Local replay approval decision external owner response decision evidence archive external record request closeout requires RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_PENDING_EXTERNAL_RECORDS status');
  }

  assertNoSecretLookingValue(input, 'local_replay_approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout');

  const closeout = {
    approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_id: input.approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_id,
    approval_decision_external_owner_response_decision_evidence_archive_external_record_request_id: request.approval_decision_external_owner_response_decision_evidence_archive_external_record_request_id,
    approval_decision_external_owner_response_decision_evidence_archive_handoff_closeout_id: request.approval_decision_external_owner_response_decision_evidence_archive_handoff_closeout_id,
    approval_decision_external_owner_response_decision_evidence_archive_handoff_id: request.approval_decision_external_owner_response_decision_evidence_archive_handoff_id,
    approval_decision_external_owner_response_decision_evidence_archive_index_closeout_id: request.approval_decision_external_owner_response_decision_evidence_archive_index_closeout_id,
    approval_decision_external_owner_response_decision_evidence_archive_index_id: request.approval_decision_external_owner_response_decision_evidence_archive_index_id,
    approval_decision_external_owner_response_decision_evidence_archive_id: request.approval_decision_external_owner_response_decision_evidence_archive_id,
    approval_decision_external_owner_response_decision_evidence_closeout_id: request.approval_decision_external_owner_response_decision_evidence_closeout_id,
    approval_decision_external_owner_response_decision_evidence_summary_id: request.approval_decision_external_owner_response_decision_evidence_summary_id,
    approval_decision_external_owner_response_decision_evidence_intake_id: request.approval_decision_external_owner_response_decision_evidence_intake_id,
    approval_decision_external_owner_response_decision_evidence_template_id: request.approval_decision_external_owner_response_decision_evidence_template_id,
    approval_decision_external_owner_response_decision_register_closeout_id: request.approval_decision_external_owner_response_decision_register_closeout_id,
    approval_decision_external_owner_response_decision_register_id: request.approval_decision_external_owner_response_decision_register_id,
    approval_decision_external_owner_response_handoff_closeout_id: request.approval_decision_external_owner_response_handoff_closeout_id,
    approval_decision_external_owner_response_handoff_id: request.approval_decision_external_owner_response_handoff_id,
    approval_decision_external_owner_response_action_plan_id: request.approval_decision_external_owner_response_action_plan_id,
    approval_decision_external_owner_response_summary_id: request.approval_decision_external_owner_response_summary_id,
    approval_decision_external_owner_response_intake_id: request.approval_decision_external_owner_response_intake_id,
    approval_decision_external_owner_response_template_id: request.approval_decision_external_owner_response_template_id,
    approval_decision_external_owner_packet_id: request.approval_decision_external_owner_packet_id,
    approval_decision_closeout_id: request.approval_decision_closeout_id,
    approval_decision_audit_trail_id: request.approval_decision_audit_trail_id,
    approval_decision_routing_id: request.approval_decision_routing_id,
    approval_decision_intake_id: request.approval_decision_intake_id,
    approval_decision_draft_id: request.approval_decision_draft_id,
    approval_handoff_summary_id: request.approval_handoff_summary_id,
    approval_evidence_template_id: request.approval_evidence_template_id,
    approval_checklist_id: request.approval_checklist_id,
    live_gate_id: request.live_gate_id,
    founder_packet_id: request.founder_packet_id,
    proof_id: request.proof_id,
    request_id: request.request_id,
    digest_id: request.digest_id,
    digest: request.digest,
    source_decision_evidence_archive_external_record_request_status: request.decision_evidence_archive_external_record_request_status,
    closed_external_record_request_items: LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_ITEMS,
    remaining_external_decision_slots: request.remaining_external_decision_slots,
    accepted_decision_record_states: request.accepted_decision_record_states,
    blocked_live_actions: request.blocked_live_actions,
    blocked_response_states: request.blocked_response_states,
    created_at: input.created_at,
    ...LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_FIELDS) {
    if (closeout[field] === undefined || closeout[field] === null || closeout[field] === '') {
      throw new Error(`Missing required local replay approval decision external owner response decision evidence archive external record request closeout field: ${field}`);
    }
  }

  return Object.freeze(closeout);
}

export const DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT = Object.freeze(createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveExternalRecordRequestCloseout({
  approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_id: 'local_replay_approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_demo_001',
  approval_decision_external_owner_response_decision_evidence_archive_external_record_request: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST,
  created_at: '2026-05-13T00:00:00.000Z',
}));
