import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN } from './localReplayApprovalDecisionExternalOwnerResponseActionPlan.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_FIELDS = Object.freeze([
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
  'handoff_status',
  'source_action_plan_status',
  'handoff_recipients',
  'handoff_items',
  'blocked_live_actions',
  'blocked_response_states',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  handoff_status: 'RESPONSE_HANDOFF_ONLY_PENDING_MANUAL_OWNER_REVIEW',
});

export const LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_HANDOFF_RECIPIENTS = Object.freeze([
  'founder',
  'legal_provider',
  'finance_provider',
  'security_reviewer',
  'xpr_authority_owner',
]);

export const LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_HANDOFF_ITEMS = Object.freeze([
  'response_summary',
  'response_action_plan',
  'manual_review_checkpoints',
  'blocked_live_actions',
  'no_live_authority_boundary',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay approval decision external owner response handoff: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayApprovalDecisionExternalOwnerResponseHandoff(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay approval decision external owner response handoff input must be an object');
  }

  const actionPlan = input.approval_decision_external_owner_response_action_plan;
  if (!actionPlan?.local_only) {
    throw new Error('Local replay approval decision external owner response handoff requires a local_only approval_decision_external_owner_response_action_plan');
  }

  if (actionPlan.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay approval decision external owner response handoff action plan must be BLOCKED_FOR_LIVE');
  }

  if (actionPlan.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay approval decision external owner response handoff action plan must be PASS_LOCAL_ONLY');
  }

  if (actionPlan.action_plan_status !== 'ACTION_PLAN_ONLY_PENDING_MANUAL_OWNER_REVIEW') {
    throw new Error('Local replay approval decision external owner response handoff requires ACTION_PLAN_ONLY_PENDING_MANUAL_OWNER_REVIEW status');
  }
  if (!actionPlan.module_order?.includes('repayment_failure')) {
    throw new Error('Local replay approval decision external owner response handoff action plan module_order must include repayment_failure');
  }

  assertNoSecretLookingValue(input, 'local_replay_approval_decision_external_owner_response_handoff');

  const handoff = {
    approval_decision_external_owner_response_handoff_id: input.approval_decision_external_owner_response_handoff_id,
    approval_decision_external_owner_response_action_plan_id: actionPlan.approval_decision_external_owner_response_action_plan_id,
    approval_decision_external_owner_response_summary_id: actionPlan.approval_decision_external_owner_response_summary_id,
    approval_decision_external_owner_response_intake_id: actionPlan.approval_decision_external_owner_response_intake_id,
    approval_decision_external_owner_response_template_id: actionPlan.approval_decision_external_owner_response_template_id,
    approval_decision_external_owner_packet_id: actionPlan.approval_decision_external_owner_packet_id,
    approval_decision_closeout_id: actionPlan.approval_decision_closeout_id,
    approval_decision_audit_trail_id: actionPlan.approval_decision_audit_trail_id,
    approval_decision_routing_id: actionPlan.approval_decision_routing_id,
    approval_decision_intake_id: actionPlan.approval_decision_intake_id,
    approval_decision_draft_id: actionPlan.approval_decision_draft_id,
    approval_handoff_summary_id: actionPlan.approval_handoff_summary_id,
    approval_evidence_template_id: actionPlan.approval_evidence_template_id,
    approval_checklist_id: actionPlan.approval_checklist_id,
    live_gate_id: actionPlan.live_gate_id,
    founder_packet_id: actionPlan.founder_packet_id,
    proof_id: actionPlan.proof_id,
    request_id: actionPlan.request_id,
    digest_id: actionPlan.digest_id,
    digest: actionPlan.digest,
    module_order: Object.freeze([...actionPlan.module_order]),
    source_action_plan_status: actionPlan.action_plan_status,
    handoff_recipients: LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_HANDOFF_RECIPIENTS,
    handoff_items: LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_HANDOFF_ITEMS,
    blocked_live_actions: actionPlan.blocked_live_actions,
    blocked_response_states: actionPlan.blocked_response_states,
    created_at: input.created_at,
    ...LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_FIELDS) {
    if (handoff[field] === undefined || handoff[field] === null || handoff[field] === '') {
      throw new Error(`Missing required local replay approval decision external owner response handoff field: ${field}`);
    }
  }

  return Object.freeze(handoff);
}

export const DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF = Object.freeze(createLocalReplayApprovalDecisionExternalOwnerResponseHandoff({
  approval_decision_external_owner_response_handoff_id: 'local_replay_approval_decision_external_owner_response_handoff_demo_001',
  approval_decision_external_owner_response_action_plan: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN,
  created_at: '2026-05-13T00:00:00.000Z',
}));
