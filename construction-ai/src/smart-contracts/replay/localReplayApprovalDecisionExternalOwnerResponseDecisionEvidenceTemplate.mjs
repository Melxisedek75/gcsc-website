import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT } from './localReplayApprovalDecisionExternalOwnerResponseDecisionRegisterCloseout.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE_FIELDS = Object.freeze([
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
  'decision_evidence_template_status',
  'source_decision_register_closeout_status',
  'required_evidence_fields',
  'required_decision_slots',
  'allowed_decision_record_states',
  'blocked_live_actions',
  'blocked_response_states',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  decision_evidence_template_status: 'RESPONSE_DECISION_EVIDENCE_TEMPLATE_ONLY_PENDING_EXTERNAL_RECORDS',
});

export const LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_REQUIRED_FIELDS = Object.freeze([
  'review_owner_role',
  'review_decision_state',
  'review_decision_date',
  'redacted_evidence_reference',
  'no_secret_confirmation',
  'no_live_action_confirmation',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay approval decision external owner response decision evidence template: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceTemplate(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay approval decision external owner response decision evidence template input must be an object');
  }

  const registerCloseout = input.approval_decision_external_owner_response_decision_register_closeout;
  if (!registerCloseout?.local_only) {
    throw new Error('Local replay approval decision external owner response decision evidence template requires a local_only approval_decision_external_owner_response_decision_register_closeout');
  }

  if (registerCloseout.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay approval decision external owner response decision evidence template register closeout must be BLOCKED_FOR_LIVE');
  }

  if (registerCloseout.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay approval decision external owner response decision evidence template register closeout must be PASS_LOCAL_ONLY');
  }

  if (registerCloseout.decision_register_closeout_status !== 'RESPONSE_DECISION_REGISTER_CLOSEOUT_PENDING_EXTERNAL_DECISIONS') {
    throw new Error('Local replay approval decision external owner response decision evidence template requires RESPONSE_DECISION_REGISTER_CLOSEOUT_PENDING_EXTERNAL_DECISIONS status');
  }
  if (!registerCloseout.module_order?.includes('repayment_failure')) {
    throw new Error('Local replay approval decision external owner response decision evidence template register closeout module_order must include repayment_failure');
  }

  assertNoSecretLookingValue(input, 'local_replay_approval_decision_external_owner_response_decision_evidence_template');

  const template = {
    approval_decision_external_owner_response_decision_evidence_template_id: input.approval_decision_external_owner_response_decision_evidence_template_id,
    approval_decision_external_owner_response_decision_register_closeout_id: registerCloseout.approval_decision_external_owner_response_decision_register_closeout_id,
    approval_decision_external_owner_response_decision_register_id: registerCloseout.approval_decision_external_owner_response_decision_register_id,
    approval_decision_external_owner_response_handoff_closeout_id: registerCloseout.approval_decision_external_owner_response_handoff_closeout_id,
    approval_decision_external_owner_response_handoff_id: registerCloseout.approval_decision_external_owner_response_handoff_id,
    approval_decision_external_owner_response_action_plan_id: registerCloseout.approval_decision_external_owner_response_action_plan_id,
    approval_decision_external_owner_response_summary_id: registerCloseout.approval_decision_external_owner_response_summary_id,
    approval_decision_external_owner_response_intake_id: registerCloseout.approval_decision_external_owner_response_intake_id,
    approval_decision_external_owner_response_template_id: registerCloseout.approval_decision_external_owner_response_template_id,
    approval_decision_external_owner_packet_id: registerCloseout.approval_decision_external_owner_packet_id,
    approval_decision_closeout_id: registerCloseout.approval_decision_closeout_id,
    approval_decision_audit_trail_id: registerCloseout.approval_decision_audit_trail_id,
    approval_decision_routing_id: registerCloseout.approval_decision_routing_id,
    approval_decision_intake_id: registerCloseout.approval_decision_intake_id,
    approval_decision_draft_id: registerCloseout.approval_decision_draft_id,
    approval_handoff_summary_id: registerCloseout.approval_handoff_summary_id,
    approval_evidence_template_id: registerCloseout.approval_evidence_template_id,
    approval_checklist_id: registerCloseout.approval_checklist_id,
    live_gate_id: registerCloseout.live_gate_id,
    founder_packet_id: registerCloseout.founder_packet_id,
    proof_id: registerCloseout.proof_id,
    request_id: registerCloseout.request_id,
    digest_id: registerCloseout.digest_id,
    digest: registerCloseout.digest,
    module_order: Object.freeze([...registerCloseout.module_order]),
    source_decision_register_closeout_status: registerCloseout.decision_register_closeout_status,
    required_evidence_fields: LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_REQUIRED_FIELDS,
    required_decision_slots: registerCloseout.remaining_external_decision_slots,
    allowed_decision_record_states: registerCloseout.allowed_decision_record_states,
    blocked_live_actions: registerCloseout.blocked_live_actions,
    blocked_response_states: registerCloseout.blocked_response_states,
    created_at: input.created_at,
    ...LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE_FIELDS) {
    if (template[field] === undefined || template[field] === null || template[field] === '') {
      throw new Error(`Missing required local replay approval decision external owner response decision evidence template field: ${field}`);
    }
  }

  return Object.freeze(template);
}

export const DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE = Object.freeze(createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceTemplate({
  approval_decision_external_owner_response_decision_evidence_template_id: 'local_replay_approval_decision_external_owner_response_decision_evidence_template_demo_001',
  approval_decision_external_owner_response_decision_register_closeout: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT,
  created_at: '2026-05-13T00:00:00.000Z',
}));
