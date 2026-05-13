import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET } from './localReplayApprovalDecisionExternalOwnerPacket.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE_FIELDS = Object.freeze([
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
  'template_status',
  'allowed_response_states',
  'blocked_response_states',
  'required_response_fields',
  'remaining_external_decision_records',
  'blocked_autonomous_actions',
  'blocked_live_actions',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  template_status: 'RESPONSE_TEMPLATE_ONLY_PENDING_EXTERNAL_OWNER_INPUT',
});

export const LOCAL_REPLAY_EXTERNAL_OWNER_ALLOWED_RESPONSE_STATES = Object.freeze([
  'HOLD_FOR_EXTERNAL_REVIEW',
  'REVISE_LOCAL_PACKET',
  'NO_GO_FOR_LIVE',
]);

export const LOCAL_REPLAY_EXTERNAL_OWNER_BLOCKED_RESPONSE_STATES = Object.freeze([
  'GO_FOR_LIVE',
  'APPROVED_FOR_LIVE',
  'AUTHORIZE_XPR_SIGNATURE',
  'AUTHORIZE_REAL_PAYMENT',
  'AUTHORIZE_REAL_LOAN',
  'AUTHORIZE_REAL_ESCROW',
  'AUTHORIZE_TOKEN_COLLATERAL',
]);

export const LOCAL_REPLAY_EXTERNAL_OWNER_REQUIRED_RESPONSE_FIELDS = Object.freeze([
  'reviewer_role',
  'decision_state',
  'decision_note',
  'evidence_reference_id',
  'redaction_confirmed',
  'no_secret_confirmed',
  'no_real_money_confirmed',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay approval decision external owner response template: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayApprovalDecisionExternalOwnerResponseTemplate(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay approval decision external owner response template input must be an object');
  }

  const ownerPacket = input.approval_decision_external_owner_packet;
  if (!ownerPacket?.local_only) {
    throw new Error('Local replay approval decision external owner response template requires a local_only approval_decision_external_owner_packet');
  }

  if (ownerPacket.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay approval decision external owner response template approval_decision_external_owner_packet must be BLOCKED_FOR_LIVE');
  }

  if (ownerPacket.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay approval decision external owner response template approval_decision_external_owner_packet must be PASS_LOCAL_ONLY');
  }

  if (ownerPacket.packet_status !== 'OWNER_PACKET_ONLY_PENDING_EXTERNAL_REVIEW') {
    throw new Error('Local replay approval decision external owner response template requires OWNER_PACKET_ONLY_PENDING_EXTERNAL_REVIEW status');
  }

  assertNoSecretLookingValue(input, 'local_replay_approval_decision_external_owner_response_template');

  const responseTemplate = {
    approval_decision_external_owner_response_template_id: input.approval_decision_external_owner_response_template_id,
    approval_decision_external_owner_packet_id: ownerPacket.approval_decision_external_owner_packet_id,
    approval_decision_closeout_id: ownerPacket.approval_decision_closeout_id,
    approval_decision_audit_trail_id: ownerPacket.approval_decision_audit_trail_id,
    approval_decision_routing_id: ownerPacket.approval_decision_routing_id,
    approval_decision_intake_id: ownerPacket.approval_decision_intake_id,
    approval_decision_draft_id: ownerPacket.approval_decision_draft_id,
    approval_handoff_summary_id: ownerPacket.approval_handoff_summary_id,
    approval_evidence_template_id: ownerPacket.approval_evidence_template_id,
    approval_checklist_id: ownerPacket.approval_checklist_id,
    live_gate_id: ownerPacket.live_gate_id,
    founder_packet_id: ownerPacket.founder_packet_id,
    proof_id: ownerPacket.proof_id,
    request_id: ownerPacket.request_id,
    digest_id: ownerPacket.digest_id,
    digest: ownerPacket.digest,
    allowed_response_states: LOCAL_REPLAY_EXTERNAL_OWNER_ALLOWED_RESPONSE_STATES,
    blocked_response_states: LOCAL_REPLAY_EXTERNAL_OWNER_BLOCKED_RESPONSE_STATES,
    required_response_fields: LOCAL_REPLAY_EXTERNAL_OWNER_REQUIRED_RESPONSE_FIELDS,
    remaining_external_decision_records: ownerPacket.remaining_external_decision_records,
    blocked_autonomous_actions: ownerPacket.blocked_autonomous_actions,
    blocked_live_actions: ownerPacket.blocked_live_actions,
    created_at: input.created_at,
    ...LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE_FIELDS) {
    if (responseTemplate[field] === undefined || responseTemplate[field] === null || responseTemplate[field] === '') {
      throw new Error(`Missing required local replay approval decision external owner response template field: ${field}`);
    }
  }

  return Object.freeze(responseTemplate);
}

export const DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE = Object.freeze(createLocalReplayApprovalDecisionExternalOwnerResponseTemplate({
  approval_decision_external_owner_response_template_id: 'local_replay_approval_decision_external_owner_response_template_demo_001',
  approval_decision_external_owner_packet: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET,
  created_at: '2026-05-13T00:00:00.000Z',
}));
