import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_INTAKE } from './localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceIntake.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_SUMMARY_FIELDS = Object.freeze([
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
  'decision_evidence_summary_status',
  'source_decision_evidence_intake_status',
  'summarized_evidence_fields',
  'pending_external_decision_slots',
  'accepted_decision_record_states',
  'manual_review_summary_items',
  'blocked_live_actions',
  'blocked_response_states',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_SUMMARY_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  decision_evidence_summary_status: 'RESPONSE_DECISION_EVIDENCE_SUMMARY_PENDING_EXTERNAL_RECORDS',
});

export const LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_SUMMARY_ITEMS = Object.freeze([
  'evidence_fields_captured_for_review',
  'external_decision_slots_still_pending',
  'accepted_states_limited_to_hold_revise_no_go',
  'no_live_authority_from_summary',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay approval decision external owner response decision evidence summary: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceSummary(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay approval decision external owner response decision evidence summary input must be an object');
  }

  const evidenceIntake = input.approval_decision_external_owner_response_decision_evidence_intake;
  if (!evidenceIntake?.local_only) {
    throw new Error('Local replay approval decision external owner response decision evidence summary requires a local_only approval_decision_external_owner_response_decision_evidence_intake');
  }

  if (evidenceIntake.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay approval decision external owner response decision evidence summary intake must be BLOCKED_FOR_LIVE');
  }

  if (evidenceIntake.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay approval decision external owner response decision evidence summary intake must be PASS_LOCAL_ONLY');
  }

  if (evidenceIntake.decision_evidence_intake_status !== 'RESPONSE_DECISION_EVIDENCE_INTAKE_PENDING_EXTERNAL_RECORDS') {
    throw new Error('Local replay approval decision external owner response decision evidence summary requires RESPONSE_DECISION_EVIDENCE_INTAKE_PENDING_EXTERNAL_RECORDS status');
  }
  if (!evidenceIntake.module_order?.includes('repayment_failure')) {
    throw new Error('Local replay approval decision external owner response decision evidence summary intake module_order must include repayment_failure');
  }

  assertNoSecretLookingValue(input, 'local_replay_approval_decision_external_owner_response_decision_evidence_summary');

  const summary = {
    approval_decision_external_owner_response_decision_evidence_summary_id: input.approval_decision_external_owner_response_decision_evidence_summary_id,
    approval_decision_external_owner_response_decision_evidence_intake_id: evidenceIntake.approval_decision_external_owner_response_decision_evidence_intake_id,
    approval_decision_external_owner_response_decision_evidence_template_id: evidenceIntake.approval_decision_external_owner_response_decision_evidence_template_id,
    approval_decision_external_owner_response_decision_register_closeout_id: evidenceIntake.approval_decision_external_owner_response_decision_register_closeout_id,
    approval_decision_external_owner_response_decision_register_id: evidenceIntake.approval_decision_external_owner_response_decision_register_id,
    approval_decision_external_owner_response_handoff_closeout_id: evidenceIntake.approval_decision_external_owner_response_handoff_closeout_id,
    approval_decision_external_owner_response_handoff_id: evidenceIntake.approval_decision_external_owner_response_handoff_id,
    approval_decision_external_owner_response_action_plan_id: evidenceIntake.approval_decision_external_owner_response_action_plan_id,
    approval_decision_external_owner_response_summary_id: evidenceIntake.approval_decision_external_owner_response_summary_id,
    approval_decision_external_owner_response_intake_id: evidenceIntake.approval_decision_external_owner_response_intake_id,
    approval_decision_external_owner_response_template_id: evidenceIntake.approval_decision_external_owner_response_template_id,
    approval_decision_external_owner_packet_id: evidenceIntake.approval_decision_external_owner_packet_id,
    approval_decision_closeout_id: evidenceIntake.approval_decision_closeout_id,
    approval_decision_audit_trail_id: evidenceIntake.approval_decision_audit_trail_id,
    approval_decision_routing_id: evidenceIntake.approval_decision_routing_id,
    approval_decision_intake_id: evidenceIntake.approval_decision_intake_id,
    approval_decision_draft_id: evidenceIntake.approval_decision_draft_id,
    approval_handoff_summary_id: evidenceIntake.approval_handoff_summary_id,
    approval_evidence_template_id: evidenceIntake.approval_evidence_template_id,
    approval_checklist_id: evidenceIntake.approval_checklist_id,
    live_gate_id: evidenceIntake.live_gate_id,
    founder_packet_id: evidenceIntake.founder_packet_id,
    proof_id: evidenceIntake.proof_id,
    request_id: evidenceIntake.request_id,
    digest_id: evidenceIntake.digest_id,
    digest: evidenceIntake.digest,
    module_order: Object.freeze([...evidenceIntake.module_order]),
    source_decision_evidence_intake_status: evidenceIntake.decision_evidence_intake_status,
    summarized_evidence_fields: evidenceIntake.captured_evidence_fields,
    pending_external_decision_slots: evidenceIntake.required_decision_slots,
    accepted_decision_record_states: evidenceIntake.accepted_decision_record_states,
    manual_review_summary_items: LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_SUMMARY_ITEMS,
    blocked_live_actions: evidenceIntake.blocked_live_actions,
    blocked_response_states: evidenceIntake.blocked_response_states,
    created_at: input.created_at,
    ...LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_SUMMARY_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_SUMMARY_FIELDS) {
    if (summary[field] === undefined || summary[field] === null || summary[field] === '') {
      throw new Error(`Missing required local replay approval decision external owner response decision evidence summary field: ${field}`);
    }
  }

  return Object.freeze(summary);
}

export const DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_SUMMARY = Object.freeze(createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceSummary({
  approval_decision_external_owner_response_decision_evidence_summary_id: 'local_replay_approval_decision_external_owner_response_decision_evidence_summary_demo_001',
  approval_decision_external_owner_response_decision_evidence_intake: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_INTAKE,
  created_at: '2026-05-13T00:00:00.000Z',
}));
