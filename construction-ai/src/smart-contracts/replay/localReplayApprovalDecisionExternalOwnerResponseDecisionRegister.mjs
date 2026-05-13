import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT } from './localReplayApprovalDecisionExternalOwnerResponseHandoffCloseout.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_FIELDS = Object.freeze([
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
  'decision_register_status',
  'source_handoff_closeout_status',
  'required_external_decision_slots',
  'pending_external_decision_slots',
  'allowed_decision_record_states',
  'blocked_live_actions',
  'blocked_response_states',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  decision_register_status: 'RESPONSE_DECISION_REGISTER_PENDING_EXTERNAL_WRITTEN_DECISIONS',
});

export const LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_REQUIRED_SLOTS = Object.freeze([
  'founder_written_decision_record',
  'legal_provider_written_decision_record',
  'finance_provider_written_decision_record',
  'security_written_decision_record',
  'xpr_authority_owner_written_decision_record',
]);

export const LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_ALLOWED_STATES = Object.freeze([
  'PENDING_EXTERNAL_REVIEW',
  'HOLD',
  'REVISE',
  'NO_GO',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay approval decision external owner response decision register: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayApprovalDecisionExternalOwnerResponseDecisionRegister(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay approval decision external owner response decision register input must be an object');
  }

  const handoffCloseout = input.approval_decision_external_owner_response_handoff_closeout;
  if (!handoffCloseout?.local_only) {
    throw new Error('Local replay approval decision external owner response decision register requires a local_only approval_decision_external_owner_response_handoff_closeout');
  }

  if (handoffCloseout.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay approval decision external owner response decision register handoff closeout must be BLOCKED_FOR_LIVE');
  }

  if (handoffCloseout.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay approval decision external owner response decision register handoff closeout must be PASS_LOCAL_ONLY');
  }

  if (handoffCloseout.handoff_closeout_status !== 'RESPONSE_HANDOFF_CLOSEOUT_ONLY_PENDING_EXTERNAL_DECISIONS') {
    throw new Error('Local replay approval decision external owner response decision register requires RESPONSE_HANDOFF_CLOSEOUT_ONLY_PENDING_EXTERNAL_DECISIONS status');
  }

  assertNoSecretLookingValue(input, 'local_replay_approval_decision_external_owner_response_decision_register');

  const register = {
    approval_decision_external_owner_response_decision_register_id: input.approval_decision_external_owner_response_decision_register_id,
    approval_decision_external_owner_response_handoff_closeout_id: handoffCloseout.approval_decision_external_owner_response_handoff_closeout_id,
    approval_decision_external_owner_response_handoff_id: handoffCloseout.approval_decision_external_owner_response_handoff_id,
    approval_decision_external_owner_response_action_plan_id: handoffCloseout.approval_decision_external_owner_response_action_plan_id,
    approval_decision_external_owner_response_summary_id: handoffCloseout.approval_decision_external_owner_response_summary_id,
    approval_decision_external_owner_response_intake_id: handoffCloseout.approval_decision_external_owner_response_intake_id,
    approval_decision_external_owner_response_template_id: handoffCloseout.approval_decision_external_owner_response_template_id,
    approval_decision_external_owner_packet_id: handoffCloseout.approval_decision_external_owner_packet_id,
    approval_decision_closeout_id: handoffCloseout.approval_decision_closeout_id,
    approval_decision_audit_trail_id: handoffCloseout.approval_decision_audit_trail_id,
    approval_decision_routing_id: handoffCloseout.approval_decision_routing_id,
    approval_decision_intake_id: handoffCloseout.approval_decision_intake_id,
    approval_decision_draft_id: handoffCloseout.approval_decision_draft_id,
    approval_handoff_summary_id: handoffCloseout.approval_handoff_summary_id,
    approval_evidence_template_id: handoffCloseout.approval_evidence_template_id,
    approval_checklist_id: handoffCloseout.approval_checklist_id,
    live_gate_id: handoffCloseout.live_gate_id,
    founder_packet_id: handoffCloseout.founder_packet_id,
    proof_id: handoffCloseout.proof_id,
    request_id: handoffCloseout.request_id,
    digest_id: handoffCloseout.digest_id,
    digest: handoffCloseout.digest,
    source_handoff_closeout_status: handoffCloseout.handoff_closeout_status,
    required_external_decision_slots: LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_REQUIRED_SLOTS,
    pending_external_decision_slots: LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_REQUIRED_SLOTS,
    allowed_decision_record_states: LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_ALLOWED_STATES,
    blocked_live_actions: handoffCloseout.blocked_live_actions,
    blocked_response_states: handoffCloseout.blocked_response_states,
    created_at: input.created_at,
    ...LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_FIELDS) {
    if (register[field] === undefined || register[field] === null || register[field] === '') {
      throw new Error(`Missing required local replay approval decision external owner response decision register field: ${field}`);
    }
  }

  return Object.freeze(register);
}

export const DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER = Object.freeze(createLocalReplayApprovalDecisionExternalOwnerResponseDecisionRegister({
  approval_decision_external_owner_response_decision_register_id: 'local_replay_approval_decision_external_owner_response_decision_register_demo_001',
  approval_decision_external_owner_response_handoff_closeout: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT,
  created_at: '2026-05-13T00:00:00.000Z',
}));
