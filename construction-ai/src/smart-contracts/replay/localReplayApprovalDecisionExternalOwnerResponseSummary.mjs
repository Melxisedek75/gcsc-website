import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE } from './localReplayApprovalDecisionExternalOwnerResponseIntake.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY_FIELDS = Object.freeze([
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
  'summary_status',
  'source_response_intake_status',
  'allowed_next_local_actions',
  'blocked_live_actions',
  'blocked_response_states',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  summary_status: 'RESPONSE_SUMMARY_ONLY_PENDING_MANUAL_REVIEW',
});

export const LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_SUMMARY_ALLOWED_NEXT_LOCAL_ACTIONS = Object.freeze([
  'record_external_owner_hold_note',
  'prepare_local_packet_revision',
  'prepare_no_go_closeout_note',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay approval decision external owner response summary: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayApprovalDecisionExternalOwnerResponseSummary(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay approval decision external owner response summary input must be an object');
  }

  const responseIntake = input.approval_decision_external_owner_response_intake;
  if (!responseIntake?.local_only) {
    throw new Error('Local replay approval decision external owner response summary requires a local_only approval_decision_external_owner_response_intake');
  }

  if (responseIntake.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay approval decision external owner response summary response intake must be BLOCKED_FOR_LIVE');
  }

  if (responseIntake.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay approval decision external owner response summary response intake must be PASS_LOCAL_ONLY');
  }

  if (responseIntake.response_intake_status !== 'RESPONSE_INTAKE_ONLY_PENDING_EXTERNAL_OWNER_CONFIRMATION') {
    throw new Error('Local replay approval decision external owner response summary requires RESPONSE_INTAKE_ONLY_PENDING_EXTERNAL_OWNER_CONFIRMATION status');
  }
  if (!responseIntake.module_order?.includes('repayment_failure')) {
    throw new Error('Local replay approval decision external owner response summary response intake module_order must include repayment_failure');
  }

  assertNoSecretLookingValue(input, 'local_replay_approval_decision_external_owner_response_summary');

  const summary = {
    approval_decision_external_owner_response_summary_id: input.approval_decision_external_owner_response_summary_id,
    approval_decision_external_owner_response_intake_id: responseIntake.approval_decision_external_owner_response_intake_id,
    approval_decision_external_owner_response_template_id: responseIntake.approval_decision_external_owner_response_template_id,
    approval_decision_external_owner_packet_id: responseIntake.approval_decision_external_owner_packet_id,
    approval_decision_closeout_id: responseIntake.approval_decision_closeout_id,
    approval_decision_audit_trail_id: responseIntake.approval_decision_audit_trail_id,
    approval_decision_routing_id: responseIntake.approval_decision_routing_id,
    approval_decision_intake_id: responseIntake.approval_decision_intake_id,
    approval_decision_draft_id: responseIntake.approval_decision_draft_id,
    approval_handoff_summary_id: responseIntake.approval_handoff_summary_id,
    approval_evidence_template_id: responseIntake.approval_evidence_template_id,
    approval_checklist_id: responseIntake.approval_checklist_id,
    live_gate_id: responseIntake.live_gate_id,
    founder_packet_id: responseIntake.founder_packet_id,
    proof_id: responseIntake.proof_id,
    request_id: responseIntake.request_id,
    digest_id: responseIntake.digest_id,
    digest: responseIntake.digest,
    module_order: Object.freeze([...responseIntake.module_order]),
    source_response_intake_status: responseIntake.response_intake_status,
    allowed_next_local_actions: LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_SUMMARY_ALLOWED_NEXT_LOCAL_ACTIONS,
    blocked_live_actions: responseIntake.blocked_live_actions,
    blocked_response_states: responseIntake.blocked_response_states,
    created_at: input.created_at,
    ...LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY_FIELDS) {
    if (summary[field] === undefined || summary[field] === null || summary[field] === '') {
      throw new Error(`Missing required local replay approval decision external owner response summary field: ${field}`);
    }
  }

  return Object.freeze(summary);
}

export const DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY = Object.freeze(createLocalReplayApprovalDecisionExternalOwnerResponseSummary({
  approval_decision_external_owner_response_summary_id: 'local_replay_approval_decision_external_owner_response_summary_demo_001',
  approval_decision_external_owner_response_intake: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE,
  created_at: '2026-05-13T00:00:00.000Z',
}));
