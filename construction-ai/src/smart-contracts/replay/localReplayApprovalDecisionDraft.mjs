import { DEMO_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY } from './localReplayApprovalHandoffSummary.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;
const BLOCKED_DECISION_PATTERN = /GO_FOR_LIVE|APPROVED_FOR_LIVE|AUTHORIZE_/i;

export const REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT_FIELDS = Object.freeze([
  'approval_decision_draft_id',
  'approval_handoff_summary_id',
  'approval_evidence_template_id',
  'approval_checklist_id',
  'live_gate_id',
  'founder_packet_id',
  'proof_id',
  'request_id',
  'digest_id',
  'decision_status',
  'allowed_decision_states',
  'blocked_decision_states',
  'blocked_live_actions',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_APPROVAL_DECISION_DRAFT_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  decision_status: 'DRAFT_ONLY_PENDING_EXTERNAL_DECISION',
});

export const LOCAL_REPLAY_ALLOWED_DECISION_STATES = Object.freeze([
  'HOLD_FOR_EXTERNAL_REVIEW',
  'REVISE_LOCAL_PACKET',
  'NO_GO_FOR_LIVE',
]);

export const LOCAL_REPLAY_BLOCKED_DECISION_STATES = Object.freeze([
  'GO_FOR_LIVE',
  'APPROVED_FOR_LIVE',
  'AUTHORIZE_XPR_SIGNATURE',
  'AUTHORIZE_REAL_PAYMENT',
  'AUTHORIZE_REAL_LOAN',
  'AUTHORIZE_REAL_ESCROW',
  'AUTHORIZE_TOKEN_COLLATERAL',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay approval decision draft: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

function assertNoBlockedDecisionValue(value, path) {
  if (typeof value === 'string' && BLOCKED_DECISION_PATTERN.test(value)) {
    throw new Error(`Blocked decision is not allowed in local replay approval decision draft: ${path}`);
  }

  if (Array.isArray(value)) {
    for (const [index, nested] of value.entries()) {
      assertNoBlockedDecisionValue(nested, `${path}[${index}]`);
    }
    return;
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoBlockedDecisionValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayApprovalDecisionDraft(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay approval decision draft input must be an object');
  }

  const handoffSummary = input.approval_handoff_summary;
  if (!handoffSummary?.local_only) {
    throw new Error('Local replay approval decision draft requires a local_only approval_handoff_summary');
  }

  if (handoffSummary.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay approval decision draft approval_handoff_summary must be BLOCKED_FOR_LIVE');
  }

  if (handoffSummary.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay approval decision draft approval_handoff_summary must be PASS_LOCAL_ONLY');
  }

  if (handoffSummary.handoff_status !== 'FOUNDER_EXTERNAL_REVIEW_HANDOFF_PENDING') {
    throw new Error('Local replay approval decision draft requires FOUNDER_EXTERNAL_REVIEW_HANDOFF_PENDING status');
  }

  assertNoSecretLookingValue(input, 'local_replay_approval_decision_draft');
  assertNoBlockedDecisionValue({
    decision_status: input.decision_status,
    requested_decision: input.requested_decision,
    owner_decision: input.owner_decision,
  }, 'local_replay_approval_decision_draft.requested_decision');

  const draft = {
    approval_decision_draft_id: input.approval_decision_draft_id,
    approval_handoff_summary_id: handoffSummary.approval_handoff_summary_id,
    approval_evidence_template_id: handoffSummary.approval_evidence_template_id,
    approval_checklist_id: handoffSummary.approval_checklist_id,
    live_gate_id: handoffSummary.live_gate_id,
    founder_packet_id: handoffSummary.founder_packet_id,
    proof_id: handoffSummary.proof_id,
    request_id: handoffSummary.request_id,
    digest_id: handoffSummary.digest_id,
    digest: handoffSummary.digest,
    allowed_decision_states: LOCAL_REPLAY_ALLOWED_DECISION_STATES,
    blocked_decision_states: LOCAL_REPLAY_BLOCKED_DECISION_STATES,
    blocked_live_actions: handoffSummary.blocked_live_actions,
    created_at: input.created_at,
    ...LOCAL_REPLAY_APPROVAL_DECISION_DRAFT_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT_FIELDS) {
    if (draft[field] === undefined || draft[field] === null || draft[field] === '') {
      throw new Error(`Missing required local replay approval decision draft field: ${field}`);
    }
  }

  return Object.freeze(draft);
}

export const DEMO_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT = Object.freeze(createLocalReplayApprovalDecisionDraft({
  approval_decision_draft_id: 'local_replay_approval_decision_draft_demo_001',
  approval_handoff_summary: DEMO_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY,
  requested_decision: 'HOLD_FOR_EXTERNAL_REVIEW',
  created_at: '2026-05-13T00:00:00.000Z',
}));
