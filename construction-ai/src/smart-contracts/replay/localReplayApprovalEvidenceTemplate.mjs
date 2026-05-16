import { DEMO_LOCAL_REPLAY_APPROVAL_CHECKLIST } from './localReplayApprovalChecklist.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE_FIELDS = Object.freeze([
  'approval_evidence_template_id',
  'approval_checklist_id',
  'live_gate_id',
  'founder_packet_id',
  'proof_id',
  'request_id',
  'digest_id',
  'module_order',
  'evidence_status',
  'evidence_slots',
  'redaction_required',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  evidence_status: 'TEMPLATE_ONLY_PENDING_EXTERNAL_EVIDENCE',
  redaction_required: true,
});

export const LOCAL_REPLAY_APPROVAL_EVIDENCE_SLOTS = Object.freeze([
  'founder_approval_evidence_placeholder',
  'legal_provider_review_evidence_placeholder',
  'finance_provider_review_evidence_placeholder',
  'security_review_evidence_placeholder',
  'xpr_authority_setup_evidence_placeholder',
  'no_real_money_test_evidence_placeholder',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay approval evidence template: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayApprovalEvidenceTemplate(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay approval evidence template input must be an object');
  }

  const approvalChecklist = input.approval_checklist;
  if (!approvalChecklist?.local_only) {
    throw new Error('Local replay approval evidence template requires a local_only approval_checklist');
  }

  if (approvalChecklist.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay approval evidence template approval_checklist must be BLOCKED_FOR_LIVE');
  }

  if (approvalChecklist.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay approval evidence template approval_checklist must be PASS_LOCAL_ONLY');
  }

  if (approvalChecklist.approval_status !== 'PENDING_EXTERNAL_APPROVALS') {
    throw new Error('Local replay approval evidence template requires PENDING_EXTERNAL_APPROVALS status');
  }
  if (!approvalChecklist.module_order?.includes('repayment_failure')) {
    throw new Error('Local replay approval evidence template approval_checklist module_order must include repayment_failure');
  }

  assertNoSecretLookingValue(input, 'local_replay_approval_evidence_template');

  const evidenceTemplate = {
    approval_evidence_template_id: input.approval_evidence_template_id,
    approval_checklist_id: approvalChecklist.approval_checklist_id,
    live_gate_id: approvalChecklist.live_gate_id,
    founder_packet_id: approvalChecklist.founder_packet_id,
    proof_id: approvalChecklist.proof_id,
    request_id: approvalChecklist.request_id,
    digest_id: approvalChecklist.digest_id,
    digest: approvalChecklist.digest,
    module_order: Object.freeze([...approvalChecklist.module_order]),
    evidence_slots: LOCAL_REPLAY_APPROVAL_EVIDENCE_SLOTS,
    created_at: input.created_at,
    ...LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE_FIELDS) {
    if (evidenceTemplate[field] === undefined || evidenceTemplate[field] === null || evidenceTemplate[field] === '') {
      throw new Error(`Missing required local replay approval evidence template field: ${field}`);
    }
  }

  return Object.freeze(evidenceTemplate);
}

export const DEMO_LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE = Object.freeze(createLocalReplayApprovalEvidenceTemplate({
  approval_evidence_template_id: 'local_replay_approval_evidence_template_demo_001',
  approval_checklist: DEMO_LOCAL_REPLAY_APPROVAL_CHECKLIST,
  created_at: '2026-05-13T00:00:00.000Z',
}));
