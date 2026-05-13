import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE } from './localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceTemplate.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_INTAKE_FIELDS = Object.freeze([
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
  'decision_evidence_intake_status',
  'source_decision_evidence_template_status',
  'captured_evidence_fields',
  'required_decision_slots',
  'accepted_decision_record_states',
  'blocked_live_actions',
  'blocked_response_states',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_INTAKE_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  decision_evidence_intake_status: 'RESPONSE_DECISION_EVIDENCE_INTAKE_PENDING_EXTERNAL_RECORDS',
});

export const LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ACCEPTED_STATES = Object.freeze([
  'PENDING_EXTERNAL_REVIEW',
  'HOLD',
  'REVISE',
  'NO_GO',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay approval decision external owner response decision evidence intake: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceIntake(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay approval decision external owner response decision evidence intake input must be an object');
  }

  const evidenceTemplate = input.approval_decision_external_owner_response_decision_evidence_template;
  if (!evidenceTemplate?.local_only) {
    throw new Error('Local replay approval decision external owner response decision evidence intake requires a local_only approval_decision_external_owner_response_decision_evidence_template');
  }

  if (evidenceTemplate.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay approval decision external owner response decision evidence intake template must be BLOCKED_FOR_LIVE');
  }

  if (evidenceTemplate.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay approval decision external owner response decision evidence intake template must be PASS_LOCAL_ONLY');
  }

  if (evidenceTemplate.decision_evidence_template_status !== 'RESPONSE_DECISION_EVIDENCE_TEMPLATE_ONLY_PENDING_EXTERNAL_RECORDS') {
    throw new Error('Local replay approval decision external owner response decision evidence intake requires RESPONSE_DECISION_EVIDENCE_TEMPLATE_ONLY_PENDING_EXTERNAL_RECORDS status');
  }

  assertNoSecretLookingValue(input, 'local_replay_approval_decision_external_owner_response_decision_evidence_intake');

  const acceptedDecisionStates = input.accepted_decision_record_states ?? LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ACCEPTED_STATES;
  for (const state of acceptedDecisionStates) {
    if (!LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ACCEPTED_STATES.includes(state)) {
      throw new Error(`Local replay approval decision external owner response decision evidence intake cannot accept live or autonomous decision state: ${state}`);
    }
  }

  const intake = {
    approval_decision_external_owner_response_decision_evidence_intake_id: input.approval_decision_external_owner_response_decision_evidence_intake_id,
    approval_decision_external_owner_response_decision_evidence_template_id: evidenceTemplate.approval_decision_external_owner_response_decision_evidence_template_id,
    approval_decision_external_owner_response_decision_register_closeout_id: evidenceTemplate.approval_decision_external_owner_response_decision_register_closeout_id,
    approval_decision_external_owner_response_decision_register_id: evidenceTemplate.approval_decision_external_owner_response_decision_register_id,
    approval_decision_external_owner_response_handoff_closeout_id: evidenceTemplate.approval_decision_external_owner_response_handoff_closeout_id,
    approval_decision_external_owner_response_handoff_id: evidenceTemplate.approval_decision_external_owner_response_handoff_id,
    approval_decision_external_owner_response_action_plan_id: evidenceTemplate.approval_decision_external_owner_response_action_plan_id,
    approval_decision_external_owner_response_summary_id: evidenceTemplate.approval_decision_external_owner_response_summary_id,
    approval_decision_external_owner_response_intake_id: evidenceTemplate.approval_decision_external_owner_response_intake_id,
    approval_decision_external_owner_response_template_id: evidenceTemplate.approval_decision_external_owner_response_template_id,
    approval_decision_external_owner_packet_id: evidenceTemplate.approval_decision_external_owner_packet_id,
    approval_decision_closeout_id: evidenceTemplate.approval_decision_closeout_id,
    approval_decision_audit_trail_id: evidenceTemplate.approval_decision_audit_trail_id,
    approval_decision_routing_id: evidenceTemplate.approval_decision_routing_id,
    approval_decision_intake_id: evidenceTemplate.approval_decision_intake_id,
    approval_decision_draft_id: evidenceTemplate.approval_decision_draft_id,
    approval_handoff_summary_id: evidenceTemplate.approval_handoff_summary_id,
    approval_evidence_template_id: evidenceTemplate.approval_evidence_template_id,
    approval_checklist_id: evidenceTemplate.approval_checklist_id,
    live_gate_id: evidenceTemplate.live_gate_id,
    founder_packet_id: evidenceTemplate.founder_packet_id,
    proof_id: evidenceTemplate.proof_id,
    request_id: evidenceTemplate.request_id,
    digest_id: evidenceTemplate.digest_id,
    digest: evidenceTemplate.digest,
    source_decision_evidence_template_status: evidenceTemplate.decision_evidence_template_status,
    captured_evidence_fields: evidenceTemplate.required_evidence_fields,
    required_decision_slots: evidenceTemplate.required_decision_slots,
    accepted_decision_record_states: acceptedDecisionStates,
    blocked_live_actions: evidenceTemplate.blocked_live_actions,
    blocked_response_states: evidenceTemplate.blocked_response_states,
    created_at: input.created_at,
    ...LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_INTAKE_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_INTAKE_FIELDS) {
    if (intake[field] === undefined || intake[field] === null || intake[field] === '') {
      throw new Error(`Missing required local replay approval decision external owner response decision evidence intake field: ${field}`);
    }
  }

  return Object.freeze(intake);
}

export const DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_INTAKE = Object.freeze(createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceIntake({
  approval_decision_external_owner_response_decision_evidence_intake_id: 'local_replay_approval_decision_external_owner_response_decision_evidence_intake_demo_001',
  approval_decision_external_owner_response_decision_evidence_template: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE,
  created_at: '2026-05-13T00:00:00.000Z',
}));
