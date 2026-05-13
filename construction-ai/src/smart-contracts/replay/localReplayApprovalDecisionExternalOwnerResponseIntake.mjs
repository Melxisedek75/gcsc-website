import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE } from './localReplayApprovalDecisionExternalOwnerResponseTemplate.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;
const BLOCKED_RESPONSE_PATTERN = /GO_FOR_LIVE|APPROVED_FOR_LIVE|AUTHORIZE_/i;

export const REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE_FIELDS = Object.freeze([
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
  'response_intake_status',
  'accepted_response_states',
  'blocked_response_states',
  'required_confirmation_fields',
  'blocked_autonomous_actions',
  'blocked_live_actions',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  response_intake_status: 'RESPONSE_INTAKE_ONLY_PENDING_EXTERNAL_OWNER_CONFIRMATION',
});

export const LOCAL_REPLAY_EXTERNAL_OWNER_REQUIRED_CONFIRMATION_FIELDS = Object.freeze([
  'redaction_confirmed',
  'no_secret_confirmed',
  'no_real_money_confirmed',
  'no_live_authority_confirmed',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay approval decision external owner response intake: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

function assertNoBlockedResponseValue(value, path) {
  if (typeof value === 'string' && BLOCKED_RESPONSE_PATTERN.test(value)) {
    throw new Error(`Blocked live response is not allowed in local replay approval decision external owner response intake: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoBlockedResponseValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayApprovalDecisionExternalOwnerResponseIntake(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay approval decision external owner response intake input must be an object');
  }

  const responseTemplate = input.approval_decision_external_owner_response_template;
  if (!responseTemplate?.local_only) {
    throw new Error('Local replay approval decision external owner response intake requires a local_only approval_decision_external_owner_response_template');
  }

  if (responseTemplate.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay approval decision external owner response intake response template must be BLOCKED_FOR_LIVE');
  }

  if (responseTemplate.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay approval decision external owner response intake response template must be PASS_LOCAL_ONLY');
  }

  if (responseTemplate.template_status !== 'RESPONSE_TEMPLATE_ONLY_PENDING_EXTERNAL_OWNER_INPUT') {
    throw new Error('Local replay approval decision external owner response intake requires RESPONSE_TEMPLATE_ONLY_PENDING_EXTERNAL_OWNER_INPUT status');
  }

  assertNoSecretLookingValue(input, 'local_replay_approval_decision_external_owner_response_intake');
  assertNoBlockedResponseValue({
    decision_state: input.decision_state,
    decision_note: input.decision_note,
  }, 'local_replay_approval_decision_external_owner_response_intake.response');

  const responseIntake = {
    approval_decision_external_owner_response_intake_id: input.approval_decision_external_owner_response_intake_id,
    approval_decision_external_owner_response_template_id: responseTemplate.approval_decision_external_owner_response_template_id,
    approval_decision_external_owner_packet_id: responseTemplate.approval_decision_external_owner_packet_id,
    approval_decision_closeout_id: responseTemplate.approval_decision_closeout_id,
    approval_decision_audit_trail_id: responseTemplate.approval_decision_audit_trail_id,
    approval_decision_routing_id: responseTemplate.approval_decision_routing_id,
    approval_decision_intake_id: responseTemplate.approval_decision_intake_id,
    approval_decision_draft_id: responseTemplate.approval_decision_draft_id,
    approval_handoff_summary_id: responseTemplate.approval_handoff_summary_id,
    approval_evidence_template_id: responseTemplate.approval_evidence_template_id,
    approval_checklist_id: responseTemplate.approval_checklist_id,
    live_gate_id: responseTemplate.live_gate_id,
    founder_packet_id: responseTemplate.founder_packet_id,
    proof_id: responseTemplate.proof_id,
    request_id: responseTemplate.request_id,
    digest_id: responseTemplate.digest_id,
    digest: responseTemplate.digest,
    accepted_response_states: responseTemplate.allowed_response_states,
    blocked_response_states: responseTemplate.blocked_response_states,
    required_confirmation_fields: LOCAL_REPLAY_EXTERNAL_OWNER_REQUIRED_CONFIRMATION_FIELDS,
    blocked_autonomous_actions: responseTemplate.blocked_autonomous_actions,
    blocked_live_actions: responseTemplate.blocked_live_actions,
    created_at: input.created_at,
    ...LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE_FIELDS) {
    if (responseIntake[field] === undefined || responseIntake[field] === null || responseIntake[field] === '') {
      throw new Error(`Missing required local replay approval decision external owner response intake field: ${field}`);
    }
  }

  return Object.freeze(responseIntake);
}

export const DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE = Object.freeze(createLocalReplayApprovalDecisionExternalOwnerResponseIntake({
  approval_decision_external_owner_response_intake_id: 'local_replay_approval_decision_external_owner_response_intake_demo_001',
  approval_decision_external_owner_response_template: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE,
  decision_state: 'HOLD_FOR_EXTERNAL_REVIEW',
  redaction_confirmed: true,
  no_secret_confirmed: true,
  no_real_money_confirmed: true,
  no_live_authority_confirmed: true,
  created_at: '2026-05-13T00:00:00.000Z',
}));
