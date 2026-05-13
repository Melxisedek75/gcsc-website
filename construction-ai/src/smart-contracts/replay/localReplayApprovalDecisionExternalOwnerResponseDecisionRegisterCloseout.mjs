import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER } from './localReplayApprovalDecisionExternalOwnerResponseDecisionRegister.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT_FIELDS = Object.freeze([
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
  'decision_register_closeout_status',
  'source_decision_register_status',
  'closed_local_register_items',
  'remaining_external_decision_slots',
  'allowed_decision_record_states',
  'blocked_live_actions',
  'blocked_response_states',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  decision_register_closeout_status: 'RESPONSE_DECISION_REGISTER_CLOSEOUT_PENDING_EXTERNAL_DECISIONS',
});

export const LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT_ITEMS = Object.freeze([
  'external_decision_slots_registered',
  'blocked_live_actions_restated',
  'allowed_record_states_limited',
  'no_autonomous_live_authority_restated',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay approval decision external owner response decision register closeout: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayApprovalDecisionExternalOwnerResponseDecisionRegisterCloseout(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay approval decision external owner response decision register closeout input must be an object');
  }

  const decisionRegister = input.approval_decision_external_owner_response_decision_register;
  if (!decisionRegister?.local_only) {
    throw new Error('Local replay approval decision external owner response decision register closeout requires a local_only approval_decision_external_owner_response_decision_register');
  }

  if (decisionRegister.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay approval decision external owner response decision register closeout register must be BLOCKED_FOR_LIVE');
  }

  if (decisionRegister.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay approval decision external owner response decision register closeout register must be PASS_LOCAL_ONLY');
  }

  if (decisionRegister.decision_register_status !== 'RESPONSE_DECISION_REGISTER_PENDING_EXTERNAL_WRITTEN_DECISIONS') {
    throw new Error('Local replay approval decision external owner response decision register closeout requires RESPONSE_DECISION_REGISTER_PENDING_EXTERNAL_WRITTEN_DECISIONS status');
  }

  assertNoSecretLookingValue(input, 'local_replay_approval_decision_external_owner_response_decision_register_closeout');

  const closeout = {
    approval_decision_external_owner_response_decision_register_closeout_id: input.approval_decision_external_owner_response_decision_register_closeout_id,
    approval_decision_external_owner_response_decision_register_id: decisionRegister.approval_decision_external_owner_response_decision_register_id,
    approval_decision_external_owner_response_handoff_closeout_id: decisionRegister.approval_decision_external_owner_response_handoff_closeout_id,
    approval_decision_external_owner_response_handoff_id: decisionRegister.approval_decision_external_owner_response_handoff_id,
    approval_decision_external_owner_response_action_plan_id: decisionRegister.approval_decision_external_owner_response_action_plan_id,
    approval_decision_external_owner_response_summary_id: decisionRegister.approval_decision_external_owner_response_summary_id,
    approval_decision_external_owner_response_intake_id: decisionRegister.approval_decision_external_owner_response_intake_id,
    approval_decision_external_owner_response_template_id: decisionRegister.approval_decision_external_owner_response_template_id,
    approval_decision_external_owner_packet_id: decisionRegister.approval_decision_external_owner_packet_id,
    approval_decision_closeout_id: decisionRegister.approval_decision_closeout_id,
    approval_decision_audit_trail_id: decisionRegister.approval_decision_audit_trail_id,
    approval_decision_routing_id: decisionRegister.approval_decision_routing_id,
    approval_decision_intake_id: decisionRegister.approval_decision_intake_id,
    approval_decision_draft_id: decisionRegister.approval_decision_draft_id,
    approval_handoff_summary_id: decisionRegister.approval_handoff_summary_id,
    approval_evidence_template_id: decisionRegister.approval_evidence_template_id,
    approval_checklist_id: decisionRegister.approval_checklist_id,
    live_gate_id: decisionRegister.live_gate_id,
    founder_packet_id: decisionRegister.founder_packet_id,
    proof_id: decisionRegister.proof_id,
    request_id: decisionRegister.request_id,
    digest_id: decisionRegister.digest_id,
    digest: decisionRegister.digest,
    source_decision_register_status: decisionRegister.decision_register_status,
    closed_local_register_items: LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT_ITEMS,
    remaining_external_decision_slots: decisionRegister.pending_external_decision_slots,
    allowed_decision_record_states: decisionRegister.allowed_decision_record_states,
    blocked_live_actions: decisionRegister.blocked_live_actions,
    blocked_response_states: decisionRegister.blocked_response_states,
    created_at: input.created_at,
    ...LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT_FIELDS) {
    if (closeout[field] === undefined || closeout[field] === null || closeout[field] === '') {
      throw new Error(`Missing required local replay approval decision external owner response decision register closeout field: ${field}`);
    }
  }

  return Object.freeze(closeout);
}

export const DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT = Object.freeze(createLocalReplayApprovalDecisionExternalOwnerResponseDecisionRegisterCloseout({
  approval_decision_external_owner_response_decision_register_closeout_id: 'local_replay_approval_decision_external_owner_response_decision_register_closeout_demo_001',
  approval_decision_external_owner_response_decision_register: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER,
  created_at: '2026-05-13T00:00:00.000Z',
}));
