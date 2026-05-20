import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_HANDOFF_CLOSEOUT } from './localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveHandoffCloseout.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_FIELDS = Object.freeze([
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
  'decision_evidence_archive_external_record_request_status',
  'source_decision_evidence_archive_handoff_closeout_status',
  'external_record_request_items',
  'remaining_external_decision_slots',
  'accepted_decision_record_states',
  'blocked_live_actions',
  'blocked_response_states',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  decision_evidence_archive_external_record_request_status: 'RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_PENDING_EXTERNAL_RECORDS',
});

export const LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_ITEMS = Object.freeze([
  'request_founder_written_decision_record',
  'request_legal_provider_written_decision_record',
  'request_finance_provider_written_decision_record',
  'request_security_xpr_written_decision_record',
  'keep_autonomous_live_authority_blocked',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay approval decision external owner response decision evidence archive external record request: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveExternalRecordRequest(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay approval decision external owner response decision evidence archive external record request input must be an object');
  }

  const closeout = input.approval_decision_external_owner_response_decision_evidence_archive_handoff_closeout;
  if (!closeout?.local_only) {
    throw new Error('Local replay approval decision external owner response decision evidence archive external record request requires a local_only approval_decision_external_owner_response_decision_evidence_archive_handoff_closeout');
  }

  if (closeout.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay approval decision external owner response decision evidence archive external record request handoff closeout must be BLOCKED_FOR_LIVE');
  }

  if (closeout.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay approval decision external owner response decision evidence archive external record request handoff closeout must be PASS_LOCAL_ONLY');
  }

  if (closeout.decision_evidence_archive_handoff_closeout_status !== 'RESPONSE_DECISION_EVIDENCE_ARCHIVE_HANDOFF_CLOSEOUT_PENDING_EXTERNAL_RECORDS') {
    throw new Error('Local replay approval decision external owner response decision evidence archive external record request requires RESPONSE_DECISION_EVIDENCE_ARCHIVE_HANDOFF_CLOSEOUT_PENDING_EXTERNAL_RECORDS status');
  }

  if (!closeout.module_order?.includes('repayment_failure')) {
    throw new Error('Local replay approval decision external owner response decision evidence archive external record request closeout module_order must include repayment_failure');
  }

  assertNoSecretLookingValue(input, 'local_replay_approval_decision_external_owner_response_decision_evidence_archive_external_record_request');

  const request = {
    approval_decision_external_owner_response_decision_evidence_archive_external_record_request_id: input.approval_decision_external_owner_response_decision_evidence_archive_external_record_request_id,
    approval_decision_external_owner_response_decision_evidence_archive_handoff_closeout_id: closeout.approval_decision_external_owner_response_decision_evidence_archive_handoff_closeout_id,
    approval_decision_external_owner_response_decision_evidence_archive_handoff_id: closeout.approval_decision_external_owner_response_decision_evidence_archive_handoff_id,
    approval_decision_external_owner_response_decision_evidence_archive_index_closeout_id: closeout.approval_decision_external_owner_response_decision_evidence_archive_index_closeout_id,
    approval_decision_external_owner_response_decision_evidence_archive_index_id: closeout.approval_decision_external_owner_response_decision_evidence_archive_index_id,
    approval_decision_external_owner_response_decision_evidence_archive_id: closeout.approval_decision_external_owner_response_decision_evidence_archive_id,
    approval_decision_external_owner_response_decision_evidence_closeout_id: closeout.approval_decision_external_owner_response_decision_evidence_closeout_id,
    approval_decision_external_owner_response_decision_evidence_summary_id: closeout.approval_decision_external_owner_response_decision_evidence_summary_id,
    approval_decision_external_owner_response_decision_evidence_intake_id: closeout.approval_decision_external_owner_response_decision_evidence_intake_id,
    approval_decision_external_owner_response_decision_evidence_template_id: closeout.approval_decision_external_owner_response_decision_evidence_template_id,
    approval_decision_external_owner_response_decision_register_closeout_id: closeout.approval_decision_external_owner_response_decision_register_closeout_id,
    approval_decision_external_owner_response_decision_register_id: closeout.approval_decision_external_owner_response_decision_register_id,
    approval_decision_external_owner_response_handoff_closeout_id: closeout.approval_decision_external_owner_response_handoff_closeout_id,
    approval_decision_external_owner_response_handoff_id: closeout.approval_decision_external_owner_response_handoff_id,
    approval_decision_external_owner_response_action_plan_id: closeout.approval_decision_external_owner_response_action_plan_id,
    approval_decision_external_owner_response_summary_id: closeout.approval_decision_external_owner_response_summary_id,
    approval_decision_external_owner_response_intake_id: closeout.approval_decision_external_owner_response_intake_id,
    approval_decision_external_owner_response_template_id: closeout.approval_decision_external_owner_response_template_id,
    approval_decision_external_owner_packet_id: closeout.approval_decision_external_owner_packet_id,
    approval_decision_closeout_id: closeout.approval_decision_closeout_id,
    approval_decision_audit_trail_id: closeout.approval_decision_audit_trail_id,
    approval_decision_routing_id: closeout.approval_decision_routing_id,
    approval_decision_intake_id: closeout.approval_decision_intake_id,
    approval_decision_draft_id: closeout.approval_decision_draft_id,
    approval_handoff_summary_id: closeout.approval_handoff_summary_id,
    approval_evidence_template_id: closeout.approval_evidence_template_id,
    approval_checklist_id: closeout.approval_checklist_id,
    live_gate_id: closeout.live_gate_id,
    founder_packet_id: closeout.founder_packet_id,
    proof_id: closeout.proof_id,
    request_id: closeout.request_id,
    digest_id: closeout.digest_id,
    digest: closeout.digest,
    module_order: Object.freeze([...closeout.module_order]),
    source_decision_evidence_archive_handoff_closeout_status: closeout.decision_evidence_archive_handoff_closeout_status,
    external_record_request_items: LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_ITEMS,
    remaining_external_decision_slots: closeout.remaining_external_decision_slots,
    accepted_decision_record_states: closeout.accepted_decision_record_states,
    blocked_live_actions: closeout.blocked_live_actions,
    blocked_response_states: closeout.blocked_response_states,
    created_at: input.created_at,
    ...LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_FIELDS) {
    if (request[field] === undefined || request[field] === null || request[field] === '') {
      throw new Error(`Missing required local replay approval decision external owner response decision evidence archive external record request field: ${field}`);
    }
  }

  return Object.freeze(request);
}

export const DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST = Object.freeze(createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveExternalRecordRequest({
  approval_decision_external_owner_response_decision_evidence_archive_external_record_request_id: 'local_replay_approval_decision_external_owner_response_decision_evidence_archive_external_record_request_demo_001',
  approval_decision_external_owner_response_decision_evidence_archive_handoff_closeout: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_HANDOFF_CLOSEOUT,
  created_at: '2026-05-13T00:00:00.000Z',
}));
