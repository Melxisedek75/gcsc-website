import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL } from './localReplayApprovalDecisionAuditTrail.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT_FIELDS = Object.freeze([
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
  'closeout_status',
  'closeout_summary',
  'remaining_external_decision_records',
  'blocked_autonomous_actions',
  'blocked_live_actions',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  closeout_status: 'LOCAL_CLOSEOUT_READY_FOR_EXTERNAL_OWNER_REVIEW',
});

export const LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT_SUMMARY = Object.freeze([
  'local_replay_evidence_complete',
  'approval_decision_records_still_external',
  'no_autonomous_live_authority_granted',
  'no_xpr_signature_or_real_money_step_allowed',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay approval decision closeout: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayApprovalDecisionCloseout(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay approval decision closeout input must be an object');
  }

  const auditTrail = input.approval_decision_audit_trail;
  if (!auditTrail?.local_only) {
    throw new Error('Local replay approval decision closeout requires a local_only approval_decision_audit_trail');
  }

  if (auditTrail.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay approval decision closeout approval_decision_audit_trail must be BLOCKED_FOR_LIVE');
  }

  if (auditTrail.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay approval decision closeout approval_decision_audit_trail must be PASS_LOCAL_ONLY');
  }

  if (auditTrail.audit_status !== 'AUDIT_TRAIL_ONLY_PENDING_EXTERNAL_DECISIONS') {
    throw new Error('Local replay approval decision closeout requires AUDIT_TRAIL_ONLY_PENDING_EXTERNAL_DECISIONS status');
  }

  assertNoSecretLookingValue(input, 'local_replay_approval_decision_closeout');

  const closeout = {
    approval_decision_closeout_id: input.approval_decision_closeout_id,
    approval_decision_audit_trail_id: auditTrail.approval_decision_audit_trail_id,
    approval_decision_routing_id: auditTrail.approval_decision_routing_id,
    approval_decision_intake_id: auditTrail.approval_decision_intake_id,
    approval_decision_draft_id: auditTrail.approval_decision_draft_id,
    approval_handoff_summary_id: auditTrail.approval_handoff_summary_id,
    approval_evidence_template_id: auditTrail.approval_evidence_template_id,
    approval_checklist_id: auditTrail.approval_checklist_id,
    live_gate_id: auditTrail.live_gate_id,
    founder_packet_id: auditTrail.founder_packet_id,
    proof_id: auditTrail.proof_id,
    request_id: auditTrail.request_id,
    digest_id: auditTrail.digest_id,
    digest: auditTrail.digest,
    closeout_summary: LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT_SUMMARY,
    remaining_external_decision_records: auditTrail.required_external_decision_records,
    blocked_autonomous_actions: auditTrail.blocked_autonomous_actions,
    blocked_live_actions: auditTrail.blocked_live_actions,
    created_at: input.created_at,
    ...LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT_FIELDS) {
    if (closeout[field] === undefined || closeout[field] === null || closeout[field] === '') {
      throw new Error(`Missing required local replay approval decision closeout field: ${field}`);
    }
  }

  return Object.freeze(closeout);
}

export const DEMO_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT = Object.freeze(createLocalReplayApprovalDecisionCloseout({
  approval_decision_closeout_id: 'local_replay_approval_decision_closeout_demo_001',
  approval_decision_audit_trail: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL,
  created_at: '2026-05-13T00:00:00.000Z',
}));
