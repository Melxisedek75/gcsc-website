import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_SUMMARY } from './localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceSummary.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT_FIELDS = Object.freeze([
  'approval_decision_external_owner_response_decision_evidence_closeout_id',
  'approval_decision_external_owner_response_decision_evidence_summary_id',
  'approval_decision_external_owner_response_decision_evidence_intake_id',
  'approval_decision_external_owner_response_decision_evidence_template_id',
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
  'decision_evidence_closeout_status',
  'source_decision_evidence_summary_status',
  'closed_local_evidence_items',
  'remaining_external_decision_slots',
  'accepted_decision_record_states',
  'module_order',
  'blocked_live_actions',
  'blocked_response_states',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  decision_evidence_closeout_status: 'RESPONSE_DECISION_EVIDENCE_CLOSEOUT_PENDING_EXTERNAL_RECORDS',
});

export const LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT_ITEMS = Object.freeze([
  'decision_evidence_summary_reviewed',
  'external_decision_slots_remain_pending',
  'live_authority_not_granted',
  'go_states_remain_blocked',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay approval decision external owner response decision evidence closeout: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceCloseout(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay approval decision external owner response decision evidence closeout input must be an object');
  }

  const evidenceSummary = input.approval_decision_external_owner_response_decision_evidence_summary;
  if (!evidenceSummary?.local_only) {
    throw new Error('Local replay approval decision external owner response decision evidence closeout requires a local_only approval_decision_external_owner_response_decision_evidence_summary');
  }

  if (evidenceSummary.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay approval decision external owner response decision evidence closeout summary must be BLOCKED_FOR_LIVE');
  }

  if (evidenceSummary.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay approval decision external owner response decision evidence closeout summary must be PASS_LOCAL_ONLY');
  }

  if (evidenceSummary.decision_evidence_summary_status !== 'RESPONSE_DECISION_EVIDENCE_SUMMARY_PENDING_EXTERNAL_RECORDS') {
    throw new Error('Local replay approval decision external owner response decision evidence closeout requires RESPONSE_DECISION_EVIDENCE_SUMMARY_PENDING_EXTERNAL_RECORDS status');
  }

  if (!evidenceSummary.module_order?.includes('repayment_failure')) {
    throw new Error('Local replay approval decision external owner response decision evidence closeout summary module_order must include repayment_failure');
  }

  assertNoSecretLookingValue(input, 'local_replay_approval_decision_external_owner_response_decision_evidence_closeout');

  const closeout = {
    approval_decision_external_owner_response_decision_evidence_closeout_id: input.approval_decision_external_owner_response_decision_evidence_closeout_id,
    approval_decision_external_owner_response_decision_evidence_summary_id: evidenceSummary.approval_decision_external_owner_response_decision_evidence_summary_id,
    approval_decision_external_owner_response_decision_evidence_intake_id: evidenceSummary.approval_decision_external_owner_response_decision_evidence_intake_id,
    approval_decision_external_owner_response_decision_evidence_template_id: evidenceSummary.approval_decision_external_owner_response_decision_evidence_template_id,
    approval_decision_external_owner_response_decision_register_closeout_id: evidenceSummary.approval_decision_external_owner_response_decision_register_closeout_id,
    approval_decision_external_owner_response_decision_register_id: evidenceSummary.approval_decision_external_owner_response_decision_register_id,
    approval_decision_external_owner_response_handoff_closeout_id: evidenceSummary.approval_decision_external_owner_response_handoff_closeout_id,
    approval_decision_external_owner_response_handoff_id: evidenceSummary.approval_decision_external_owner_response_handoff_id,
    approval_decision_external_owner_response_action_plan_id: evidenceSummary.approval_decision_external_owner_response_action_plan_id,
    approval_decision_external_owner_response_summary_id: evidenceSummary.approval_decision_external_owner_response_summary_id,
    approval_decision_external_owner_response_intake_id: evidenceSummary.approval_decision_external_owner_response_intake_id,
    approval_decision_external_owner_response_template_id: evidenceSummary.approval_decision_external_owner_response_template_id,
    approval_decision_external_owner_packet_id: evidenceSummary.approval_decision_external_owner_packet_id,
    approval_decision_closeout_id: evidenceSummary.approval_decision_closeout_id,
    approval_decision_audit_trail_id: evidenceSummary.approval_decision_audit_trail_id,
    approval_decision_routing_id: evidenceSummary.approval_decision_routing_id,
    approval_decision_intake_id: evidenceSummary.approval_decision_intake_id,
    approval_decision_draft_id: evidenceSummary.approval_decision_draft_id,
    approval_handoff_summary_id: evidenceSummary.approval_handoff_summary_id,
    approval_evidence_template_id: evidenceSummary.approval_evidence_template_id,
    approval_checklist_id: evidenceSummary.approval_checklist_id,
    live_gate_id: evidenceSummary.live_gate_id,
    founder_packet_id: evidenceSummary.founder_packet_id,
    proof_id: evidenceSummary.proof_id,
    request_id: evidenceSummary.request_id,
    digest_id: evidenceSummary.digest_id,
    digest: evidenceSummary.digest,
    source_decision_evidence_summary_status: evidenceSummary.decision_evidence_summary_status,
    closed_local_evidence_items: LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT_ITEMS,
    remaining_external_decision_slots: evidenceSummary.pending_external_decision_slots,
    accepted_decision_record_states: evidenceSummary.accepted_decision_record_states,
    module_order: Object.freeze([...evidenceSummary.module_order]),
    blocked_live_actions: evidenceSummary.blocked_live_actions,
    blocked_response_states: evidenceSummary.blocked_response_states,
    created_at: input.created_at,
    ...LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT_FIELDS) {
    if (closeout[field] === undefined || closeout[field] === null || closeout[field] === '') {
      throw new Error(`Missing required local replay approval decision external owner response decision evidence closeout field: ${field}`);
    }
  }

  return Object.freeze(closeout);
}

export const DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT = Object.freeze(createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceCloseout({
  approval_decision_external_owner_response_decision_evidence_closeout_id: 'local_replay_approval_decision_external_owner_response_decision_evidence_closeout_demo_001',
  approval_decision_external_owner_response_decision_evidence_summary: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_SUMMARY,
  created_at: '2026-05-13T00:00:00.000Z',
}));
