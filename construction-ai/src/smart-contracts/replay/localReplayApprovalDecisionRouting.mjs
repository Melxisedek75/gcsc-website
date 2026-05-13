import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE } from './localReplayApprovalDecisionIntake.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING_FIELDS = Object.freeze([
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
  'routing_status',
  'owner_routes',
  'blocked_autonomous_actions',
  'blocked_live_actions',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_APPROVAL_DECISION_ROUTING_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  routing_status: 'ROUTE_ONLY_PENDING_EXTERNAL_REVIEW',
});

export const LOCAL_REPLAY_APPROVAL_DECISION_ROUTING_OWNER_ROUTES = Object.freeze([
  'founder_external_review',
  'legal_provider_external_review',
  'finance_provider_external_review',
  'security_external_review',
  'xpr_authority_external_review',
  'no_real_money_test_external_review',
]);

export const LOCAL_REPLAY_BLOCKED_AUTONOMOUS_ACTIONS = Object.freeze([
  'no_autonomous_go_for_live',
  'no_autonomous_xpr_signature',
  'no_autonomous_real_payment',
  'no_autonomous_real_loan',
  'no_autonomous_real_escrow',
  'no_autonomous_token_collateral',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay approval decision routing: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayApprovalDecisionRouting(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay approval decision routing input must be an object');
  }

  const decisionIntake = input.approval_decision_intake;
  if (!decisionIntake?.local_only) {
    throw new Error('Local replay approval decision routing requires a local_only approval_decision_intake');
  }

  if (decisionIntake.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay approval decision routing approval_decision_intake must be BLOCKED_FOR_LIVE');
  }

  if (decisionIntake.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay approval decision routing approval_decision_intake must be PASS_LOCAL_ONLY');
  }

  if (decisionIntake.intake_status !== 'INTAKE_ONLY_PENDING_FOUNDER_EXTERNAL_RESPONSE') {
    throw new Error('Local replay approval decision routing requires INTAKE_ONLY_PENDING_FOUNDER_EXTERNAL_RESPONSE status');
  }

  assertNoSecretLookingValue(input, 'local_replay_approval_decision_routing');

  const routing = {
    approval_decision_routing_id: input.approval_decision_routing_id,
    approval_decision_intake_id: decisionIntake.approval_decision_intake_id,
    approval_decision_draft_id: decisionIntake.approval_decision_draft_id,
    approval_handoff_summary_id: decisionIntake.approval_handoff_summary_id,
    approval_evidence_template_id: decisionIntake.approval_evidence_template_id,
    approval_checklist_id: decisionIntake.approval_checklist_id,
    live_gate_id: decisionIntake.live_gate_id,
    founder_packet_id: decisionIntake.founder_packet_id,
    proof_id: decisionIntake.proof_id,
    request_id: decisionIntake.request_id,
    digest_id: decisionIntake.digest_id,
    digest: decisionIntake.digest,
    owner_routes: LOCAL_REPLAY_APPROVAL_DECISION_ROUTING_OWNER_ROUTES,
    blocked_autonomous_actions: LOCAL_REPLAY_BLOCKED_AUTONOMOUS_ACTIONS,
    blocked_live_actions: decisionIntake.blocked_live_actions,
    created_at: input.created_at,
    ...LOCAL_REPLAY_APPROVAL_DECISION_ROUTING_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING_FIELDS) {
    if (routing[field] === undefined || routing[field] === null || routing[field] === '') {
      throw new Error(`Missing required local replay approval decision routing field: ${field}`);
    }
  }

  return Object.freeze(routing);
}

export const DEMO_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING = Object.freeze(createLocalReplayApprovalDecisionRouting({
  approval_decision_routing_id: 'local_replay_approval_decision_routing_demo_001',
  approval_decision_intake: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE,
  created_at: '2026-05-13T00:00:00.000Z',
}));
