import { DEMO_LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE } from './localReplayApprovalEvidenceTemplate.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY_FIELDS = Object.freeze([
  'approval_handoff_summary_id',
  'approval_evidence_template_id',
  'approval_checklist_id',
  'live_gate_id',
  'founder_packet_id',
  'proof_id',
  'request_id',
  'digest_id',
  'handoff_status',
  'next_owner_actions',
  'blocked_live_actions',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  handoff_status: 'FOUNDER_EXTERNAL_REVIEW_HANDOFF_PENDING',
});

export const LOCAL_REPLAY_APPROVAL_HANDOFF_ACTIONS = Object.freeze([
  'review_founder_approval_evidence',
  'review_legal_provider_evidence',
  'review_finance_provider_evidence',
  'review_security_evidence',
  'review_xpr_authority_evidence',
  'review_no_real_money_test_evidence',
]);

export const LOCAL_REPLAY_BLOCKED_LIVE_ACTIONS = Object.freeze([
  'no_live_xpr_signature',
  'no_real_payment',
  'no_real_loan',
  'no_real_escrow',
  'no_token_collateral_lock',
  'no_public_live_readiness_claim',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay approval handoff summary: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayApprovalHandoffSummary(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay approval handoff summary input must be an object');
  }

  const evidenceTemplate = input.approval_evidence_template;
  if (!evidenceTemplate?.local_only) {
    throw new Error('Local replay approval handoff summary requires a local_only approval_evidence_template');
  }

  if (evidenceTemplate.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay approval handoff summary approval_evidence_template must be BLOCKED_FOR_LIVE');
  }

  if (evidenceTemplate.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay approval handoff summary approval_evidence_template must be PASS_LOCAL_ONLY');
  }

  if (evidenceTemplate.evidence_status !== 'TEMPLATE_ONLY_PENDING_EXTERNAL_EVIDENCE') {
    throw new Error('Local replay approval handoff summary requires TEMPLATE_ONLY_PENDING_EXTERNAL_EVIDENCE status');
  }

  assertNoSecretLookingValue(input, 'local_replay_approval_handoff_summary');

  const summary = {
    approval_handoff_summary_id: input.approval_handoff_summary_id,
    approval_evidence_template_id: evidenceTemplate.approval_evidence_template_id,
    approval_checklist_id: evidenceTemplate.approval_checklist_id,
    live_gate_id: evidenceTemplate.live_gate_id,
    founder_packet_id: evidenceTemplate.founder_packet_id,
    proof_id: evidenceTemplate.proof_id,
    request_id: evidenceTemplate.request_id,
    digest_id: evidenceTemplate.digest_id,
    digest: evidenceTemplate.digest,
    next_owner_actions: LOCAL_REPLAY_APPROVAL_HANDOFF_ACTIONS,
    blocked_live_actions: LOCAL_REPLAY_BLOCKED_LIVE_ACTIONS,
    created_at: input.created_at,
    ...LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY_FIELDS) {
    if (summary[field] === undefined || summary[field] === null || summary[field] === '') {
      throw new Error(`Missing required local replay approval handoff summary field: ${field}`);
    }
  }

  return Object.freeze(summary);
}

export const DEMO_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY = Object.freeze(createLocalReplayApprovalHandoffSummary({
  approval_handoff_summary_id: 'local_replay_approval_handoff_summary_demo_001',
  approval_evidence_template: DEMO_LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE,
  created_at: '2026-05-13T00:00:00.000Z',
}));
