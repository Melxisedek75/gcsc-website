import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING } from './localReplayApprovalDecisionRouting.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL_FIELDS = Object.freeze([
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
  'audit_status',
  'audit_events',
  'required_external_decision_records',
  'blocked_autonomous_actions',
  'blocked_live_actions',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  audit_status: 'AUDIT_TRAIL_ONLY_PENDING_EXTERNAL_DECISIONS',
});

export const LOCAL_REPLAY_REQUIRED_EXTERNAL_DECISION_RECORDS = Object.freeze([
  'founder_written_decision_record',
  'legal_provider_written_decision_record',
  'finance_provider_written_decision_record',
  'security_written_decision_record',
  'xpr_authority_written_decision_record',
  'no_real_money_test_written_decision_record',
]);

export const LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_EVENTS = Object.freeze([
  'decision_intake_recorded_local_only',
  'external_review_routes_defined',
  'autonomous_live_actions_blocked',
  'external_decision_records_pending',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay approval decision audit trail: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayApprovalDecisionAuditTrail(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay approval decision audit trail input must be an object');
  }

  const decisionRouting = input.approval_decision_routing;
  if (!decisionRouting?.local_only) {
    throw new Error('Local replay approval decision audit trail requires a local_only approval_decision_routing');
  }

  if (decisionRouting.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay approval decision audit trail approval_decision_routing must be BLOCKED_FOR_LIVE');
  }

  if (decisionRouting.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay approval decision audit trail approval_decision_routing must be PASS_LOCAL_ONLY');
  }

  if (decisionRouting.routing_status !== 'ROUTE_ONLY_PENDING_EXTERNAL_REVIEW') {
    throw new Error('Local replay approval decision audit trail requires ROUTE_ONLY_PENDING_EXTERNAL_REVIEW status');
  }
  if (!decisionRouting.module_order?.includes('repayment_failure')) {
    throw new Error('Local replay approval decision audit trail approval_decision_routing module_order must include repayment_failure');
  }

  assertNoSecretLookingValue(input, 'local_replay_approval_decision_audit_trail');

  const auditTrail = {
    approval_decision_audit_trail_id: input.approval_decision_audit_trail_id,
    approval_decision_routing_id: decisionRouting.approval_decision_routing_id,
    approval_decision_intake_id: decisionRouting.approval_decision_intake_id,
    approval_decision_draft_id: decisionRouting.approval_decision_draft_id,
    approval_handoff_summary_id: decisionRouting.approval_handoff_summary_id,
    approval_evidence_template_id: decisionRouting.approval_evidence_template_id,
    approval_checklist_id: decisionRouting.approval_checklist_id,
    live_gate_id: decisionRouting.live_gate_id,
    founder_packet_id: decisionRouting.founder_packet_id,
    proof_id: decisionRouting.proof_id,
    request_id: decisionRouting.request_id,
    digest_id: decisionRouting.digest_id,
    digest: decisionRouting.digest,
    module_order: Object.freeze([...decisionRouting.module_order]),
    audit_events: LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_EVENTS,
    required_external_decision_records: LOCAL_REPLAY_REQUIRED_EXTERNAL_DECISION_RECORDS,
    blocked_autonomous_actions: decisionRouting.blocked_autonomous_actions,
    blocked_live_actions: decisionRouting.blocked_live_actions,
    created_at: input.created_at,
    ...LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL_FIELDS) {
    if (auditTrail[field] === undefined || auditTrail[field] === null || auditTrail[field] === '') {
      throw new Error(`Missing required local replay approval decision audit trail field: ${field}`);
    }
  }

  return Object.freeze(auditTrail);
}

export const DEMO_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL = Object.freeze(createLocalReplayApprovalDecisionAuditTrail({
  approval_decision_audit_trail_id: 'local_replay_approval_decision_audit_trail_demo_001',
  approval_decision_routing: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING,
  created_at: '2026-05-13T00:00:00.000Z',
}));
