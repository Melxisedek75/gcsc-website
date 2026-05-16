import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT } from './localReplayApprovalDecisionDraft.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;
const BLOCKED_LIVE_DECISION_PATTERN = /GO_FOR_LIVE|APPROVED_FOR_LIVE|AUTHORIZE_/i;

export const REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE_FIELDS = Object.freeze([
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
  'intake_status',
  'intake_fields',
  'allowed_intake_states',
  'blocked_decision_states',
  'blocked_live_actions',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_APPROVAL_DECISION_INTAKE_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  intake_status: 'INTAKE_ONLY_PENDING_FOUNDER_EXTERNAL_RESPONSE',
});

export const LOCAL_REPLAY_APPROVAL_DECISION_INTAKE_FIELDS = Object.freeze([
  'founder_decision_placeholder',
  'legal_provider_decision_placeholder',
  'finance_provider_decision_placeholder',
  'security_decision_placeholder',
  'xpr_authority_decision_placeholder',
  'no_real_money_test_decision_placeholder',
]);

export const LOCAL_REPLAY_APPROVAL_DECISION_INTAKE_STATES = Object.freeze([
  'HOLD_FOR_EXTERNAL_REVIEW',
  'REVISE_LOCAL_PACKET',
  'NO_GO_FOR_LIVE',
]);

export const LOCAL_REPLAY_APPROVAL_DECISION_INTAKE_BLOCKED_STATES = Object.freeze([
  'GO_FOR_LIVE',
  'APPROVED_FOR_LIVE',
  'AUTHORIZE_REAL_PAYMENT',
  'AUTHORIZE_REAL_LOAN',
  'AUTHORIZE_REAL_ESCROW',
  'AUTHORIZE_TOKEN_COLLATERAL',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay approval decision intake: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

function assertNoBlockedLiveDecision(value, path) {
  if (typeof value === 'string' && BLOCKED_LIVE_DECISION_PATTERN.test(value)) {
    throw new Error(`Blocked live decision is not allowed in local replay approval decision intake: ${path}`);
  }

  if (Array.isArray(value)) {
    for (const [index, nested] of value.entries()) {
      assertNoBlockedLiveDecision(nested, `${path}[${index}]`);
    }
    return;
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoBlockedLiveDecision(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayApprovalDecisionIntake(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay approval decision intake input must be an object');
  }

  const decisionDraft = input.approval_decision_draft;
  if (!decisionDraft?.local_only) {
    throw new Error('Local replay approval decision intake requires a local_only approval_decision_draft');
  }

  if (decisionDraft.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay approval decision intake approval_decision_draft must be BLOCKED_FOR_LIVE');
  }

  if (decisionDraft.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay approval decision intake approval_decision_draft must be PASS_LOCAL_ONLY');
  }

  if (decisionDraft.decision_status !== 'DRAFT_ONLY_PENDING_EXTERNAL_DECISION') {
    throw new Error('Local replay approval decision intake requires DRAFT_ONLY_PENDING_EXTERNAL_DECISION status');
  }
  if (!decisionDraft.module_order?.includes('repayment_failure')) {
    throw new Error('Local replay approval decision intake approval_decision_draft module_order must include repayment_failure');
  }

  assertNoSecretLookingValue(input, 'local_replay_approval_decision_intake');
  assertNoBlockedLiveDecision({
    founder_decision: input.founder_decision,
    legal_provider_decision: input.legal_provider_decision,
    finance_provider_decision: input.finance_provider_decision,
    security_decision: input.security_decision,
    xpr_authority_decision: input.xpr_authority_decision,
    no_real_money_test_decision: input.no_real_money_test_decision,
  }, 'local_replay_approval_decision_intake.decisions');

  const intake = {
    approval_decision_intake_id: input.approval_decision_intake_id,
    approval_decision_draft_id: decisionDraft.approval_decision_draft_id,
    approval_handoff_summary_id: decisionDraft.approval_handoff_summary_id,
    approval_evidence_template_id: decisionDraft.approval_evidence_template_id,
    approval_checklist_id: decisionDraft.approval_checklist_id,
    live_gate_id: decisionDraft.live_gate_id,
    founder_packet_id: decisionDraft.founder_packet_id,
    proof_id: decisionDraft.proof_id,
    request_id: decisionDraft.request_id,
    digest_id: decisionDraft.digest_id,
    digest: decisionDraft.digest,
    module_order: Object.freeze([...decisionDraft.module_order]),
    intake_fields: LOCAL_REPLAY_APPROVAL_DECISION_INTAKE_FIELDS,
    allowed_intake_states: LOCAL_REPLAY_APPROVAL_DECISION_INTAKE_STATES,
    blocked_decision_states: decisionDraft.blocked_decision_states,
    blocked_live_actions: decisionDraft.blocked_live_actions,
    created_at: input.created_at,
    ...LOCAL_REPLAY_APPROVAL_DECISION_INTAKE_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE_FIELDS) {
    if (intake[field] === undefined || intake[field] === null || intake[field] === '') {
      throw new Error(`Missing required local replay approval decision intake field: ${field}`);
    }
  }

  return Object.freeze(intake);
}

export const DEMO_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE = Object.freeze(createLocalReplayApprovalDecisionIntake({
  approval_decision_intake_id: 'local_replay_approval_decision_intake_demo_001',
  approval_decision_draft: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT,
  founder_decision: 'HOLD_FOR_EXTERNAL_REVIEW',
  created_at: '2026-05-13T00:00:00.000Z',
}));
