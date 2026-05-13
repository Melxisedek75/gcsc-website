import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF } from './localReplayApprovalDecisionExternalOwnerResponseHandoff.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT_FIELDS = Object.freeze([
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
  'handoff_closeout_status',
  'source_response_handoff_status',
  'closed_local_items',
  'remaining_manual_review_items',
  'blocked_live_actions',
  'blocked_response_states',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  handoff_closeout_status: 'RESPONSE_HANDOFF_CLOSEOUT_ONLY_PENDING_EXTERNAL_DECISIONS',
});

export const LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT_ITEMS = Object.freeze([
  'response_handoff_packet_built',
  'manual_review_recipients_listed',
  'blocked_live_actions_restated',
  'no_live_authority_boundary_restated',
]);

export const LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_HANDOFF_REMAINING_MANUAL_REVIEW_ITEMS = Object.freeze([
  'founder_written_decision',
  'legal_provider_written_decision',
  'finance_provider_written_decision',
  'security_written_decision',
  'xpr_authority_owner_written_decision',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay approval decision external owner response handoff closeout: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayApprovalDecisionExternalOwnerResponseHandoffCloseout(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay approval decision external owner response handoff closeout input must be an object');
  }

  const responseHandoff = input.approval_decision_external_owner_response_handoff;
  if (!responseHandoff?.local_only) {
    throw new Error('Local replay approval decision external owner response handoff closeout requires a local_only approval_decision_external_owner_response_handoff');
  }

  if (responseHandoff.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay approval decision external owner response handoff closeout handoff must be BLOCKED_FOR_LIVE');
  }

  if (responseHandoff.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay approval decision external owner response handoff closeout handoff must be PASS_LOCAL_ONLY');
  }

  if (responseHandoff.handoff_status !== 'RESPONSE_HANDOFF_ONLY_PENDING_MANUAL_OWNER_REVIEW') {
    throw new Error('Local replay approval decision external owner response handoff closeout requires RESPONSE_HANDOFF_ONLY_PENDING_MANUAL_OWNER_REVIEW status');
  }

  assertNoSecretLookingValue(input, 'local_replay_approval_decision_external_owner_response_handoff_closeout');

  const closeout = {
    approval_decision_external_owner_response_handoff_closeout_id: input.approval_decision_external_owner_response_handoff_closeout_id,
    approval_decision_external_owner_response_handoff_id: responseHandoff.approval_decision_external_owner_response_handoff_id,
    approval_decision_external_owner_response_action_plan_id: responseHandoff.approval_decision_external_owner_response_action_plan_id,
    approval_decision_external_owner_response_summary_id: responseHandoff.approval_decision_external_owner_response_summary_id,
    approval_decision_external_owner_response_intake_id: responseHandoff.approval_decision_external_owner_response_intake_id,
    approval_decision_external_owner_response_template_id: responseHandoff.approval_decision_external_owner_response_template_id,
    approval_decision_external_owner_packet_id: responseHandoff.approval_decision_external_owner_packet_id,
    approval_decision_closeout_id: responseHandoff.approval_decision_closeout_id,
    approval_decision_audit_trail_id: responseHandoff.approval_decision_audit_trail_id,
    approval_decision_routing_id: responseHandoff.approval_decision_routing_id,
    approval_decision_intake_id: responseHandoff.approval_decision_intake_id,
    approval_decision_draft_id: responseHandoff.approval_decision_draft_id,
    approval_handoff_summary_id: responseHandoff.approval_handoff_summary_id,
    approval_evidence_template_id: responseHandoff.approval_evidence_template_id,
    approval_checklist_id: responseHandoff.approval_checklist_id,
    live_gate_id: responseHandoff.live_gate_id,
    founder_packet_id: responseHandoff.founder_packet_id,
    proof_id: responseHandoff.proof_id,
    request_id: responseHandoff.request_id,
    digest_id: responseHandoff.digest_id,
    digest: responseHandoff.digest,
    source_response_handoff_status: responseHandoff.handoff_status,
    closed_local_items: LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT_ITEMS,
    remaining_manual_review_items: LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_HANDOFF_REMAINING_MANUAL_REVIEW_ITEMS,
    blocked_live_actions: responseHandoff.blocked_live_actions,
    blocked_response_states: responseHandoff.blocked_response_states,
    created_at: input.created_at,
    ...LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT_FIELDS) {
    if (closeout[field] === undefined || closeout[field] === null || closeout[field] === '') {
      throw new Error(`Missing required local replay approval decision external owner response handoff closeout field: ${field}`);
    }
  }

  return Object.freeze(closeout);
}

export const DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT = Object.freeze(createLocalReplayApprovalDecisionExternalOwnerResponseHandoffCloseout({
  approval_decision_external_owner_response_handoff_closeout_id: 'local_replay_approval_decision_external_owner_response_handoff_closeout_demo_001',
  approval_decision_external_owner_response_handoff: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF,
  created_at: '2026-05-13T00:00:00.000Z',
}));
