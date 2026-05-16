import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY } from './localReplayApprovalDecisionExternalOwnerResponseSummary.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN_FIELDS = Object.freeze([
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
  'action_plan_status',
  'source_response_summary_status',
  'next_local_actions',
  'required_manual_review_checkpoints',
  'blocked_live_actions',
  'blocked_response_states',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  action_plan_status: 'ACTION_PLAN_ONLY_PENDING_MANUAL_OWNER_REVIEW',
});

export const LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN_MANUAL_CHECKPOINTS = Object.freeze([
  'founder_reviews_response_summary',
  'legal_provider_reviews_live_implications',
  'finance_provider_reviews_money_movement_boundary',
  'security_reviews_xpr_signature_boundary',
  'owner_records_no_live_authority_confirmation',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay approval decision external owner response action plan: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayApprovalDecisionExternalOwnerResponseActionPlan(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay approval decision external owner response action plan input must be an object');
  }

  const responseSummary = input.approval_decision_external_owner_response_summary;
  if (!responseSummary?.local_only) {
    throw new Error('Local replay approval decision external owner response action plan requires a local_only approval_decision_external_owner_response_summary');
  }

  if (responseSummary.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay approval decision external owner response action plan response summary must be BLOCKED_FOR_LIVE');
  }

  if (responseSummary.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay approval decision external owner response action plan response summary must be PASS_LOCAL_ONLY');
  }

  if (responseSummary.summary_status !== 'RESPONSE_SUMMARY_ONLY_PENDING_MANUAL_REVIEW') {
    throw new Error('Local replay approval decision external owner response action plan requires RESPONSE_SUMMARY_ONLY_PENDING_MANUAL_REVIEW status');
  }
  if (!responseSummary.module_order?.includes('repayment_failure')) {
    throw new Error('Local replay approval decision external owner response action plan response summary module_order must include repayment_failure');
  }

  assertNoSecretLookingValue(input, 'local_replay_approval_decision_external_owner_response_action_plan');

  const actionPlan = {
    approval_decision_external_owner_response_action_plan_id: input.approval_decision_external_owner_response_action_plan_id,
    approval_decision_external_owner_response_summary_id: responseSummary.approval_decision_external_owner_response_summary_id,
    approval_decision_external_owner_response_intake_id: responseSummary.approval_decision_external_owner_response_intake_id,
    approval_decision_external_owner_response_template_id: responseSummary.approval_decision_external_owner_response_template_id,
    approval_decision_external_owner_packet_id: responseSummary.approval_decision_external_owner_packet_id,
    approval_decision_closeout_id: responseSummary.approval_decision_closeout_id,
    approval_decision_audit_trail_id: responseSummary.approval_decision_audit_trail_id,
    approval_decision_routing_id: responseSummary.approval_decision_routing_id,
    approval_decision_intake_id: responseSummary.approval_decision_intake_id,
    approval_decision_draft_id: responseSummary.approval_decision_draft_id,
    approval_handoff_summary_id: responseSummary.approval_handoff_summary_id,
    approval_evidence_template_id: responseSummary.approval_evidence_template_id,
    approval_checklist_id: responseSummary.approval_checklist_id,
    live_gate_id: responseSummary.live_gate_id,
    founder_packet_id: responseSummary.founder_packet_id,
    proof_id: responseSummary.proof_id,
    request_id: responseSummary.request_id,
    digest_id: responseSummary.digest_id,
    digest: responseSummary.digest,
    module_order: Object.freeze([...responseSummary.module_order]),
    source_response_summary_status: responseSummary.summary_status,
    next_local_actions: responseSummary.allowed_next_local_actions,
    required_manual_review_checkpoints: LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN_MANUAL_CHECKPOINTS,
    blocked_live_actions: responseSummary.blocked_live_actions,
    blocked_response_states: responseSummary.blocked_response_states,
    created_at: input.created_at,
    ...LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN_FIELDS) {
    if (actionPlan[field] === undefined || actionPlan[field] === null || actionPlan[field] === '') {
      throw new Error(`Missing required local replay approval decision external owner response action plan field: ${field}`);
    }
  }

  return Object.freeze(actionPlan);
}

export const DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN = Object.freeze(createLocalReplayApprovalDecisionExternalOwnerResponseActionPlan({
  approval_decision_external_owner_response_action_plan_id: 'local_replay_approval_decision_external_owner_response_action_plan_demo_001',
  approval_decision_external_owner_response_summary: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY,
  created_at: '2026-05-13T00:00:00.000Z',
}));
