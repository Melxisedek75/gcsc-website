import { DEMO_LOCAL_REPLAY_LIVE_GATE } from './localReplayLiveGate.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_APPROVAL_CHECKLIST_FIELDS = Object.freeze([
  'approval_checklist_id',
  'live_gate_id',
  'founder_packet_id',
  'proof_id',
  'request_id',
  'digest_id',
  'module_order',
  'approval_status',
  'required_approvals',
  'blocked_until',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_APPROVAL_CHECKLIST_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  approval_status: 'PENDING_EXTERNAL_APPROVALS',
  blocked_until: 'Founder approval, legal/provider review, finance-provider review, security review, XPR authority setup, and no-real-money test evidence are all recorded outside the local replay.',
});

export const REQUIRED_LOCAL_REPLAY_APPROVALS = Object.freeze([
  'founder_approval_pending',
  'legal_provider_review_pending',
  'finance_provider_review_pending',
  'security_review_pending',
  'xpr_authority_setup_pending',
  'no_real_money_test_evidence_pending',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay approval checklist: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayApprovalChecklist(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay approval checklist input must be an object');
  }

  const liveGate = input.live_gate;
  if (!liveGate?.local_only) {
    throw new Error('Local replay approval checklist requires a local_only live_gate');
  }

  if (liveGate.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay approval checklist live_gate must be BLOCKED_FOR_LIVE');
  }

  if (liveGate.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay approval checklist live_gate must be PASS_LOCAL_ONLY');
  }

  if (!String(liveGate.live_gate_status || '').includes('HOLD_FOR_FOUNDER')) {
    throw new Error('Local replay approval checklist live_gate must remain on HOLD_FOR_FOUNDER review status');
  }
  if (!liveGate.module_order?.includes('repayment_failure')) {
    throw new Error('Local replay approval checklist live_gate module_order must include repayment_failure');
  }

  assertNoSecretLookingValue(input, 'local_replay_approval_checklist');

  const checklist = {
    approval_checklist_id: input.approval_checklist_id,
    live_gate_id: liveGate.live_gate_id,
    founder_packet_id: liveGate.founder_packet_id,
    proof_id: liveGate.proof_id,
    request_id: liveGate.request_id,
    digest_id: liveGate.digest_id,
    digest: liveGate.digest,
    module_order: Object.freeze([...liveGate.module_order]),
    required_approvals: REQUIRED_LOCAL_REPLAY_APPROVALS,
    created_at: input.created_at,
    ...LOCAL_REPLAY_APPROVAL_CHECKLIST_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_CHECKLIST_FIELDS) {
    if (checklist[field] === undefined || checklist[field] === null || checklist[field] === '') {
      throw new Error(`Missing required local replay approval checklist field: ${field}`);
    }
  }

  return Object.freeze(checklist);
}

export const DEMO_LOCAL_REPLAY_APPROVAL_CHECKLIST = Object.freeze(createLocalReplayApprovalChecklist({
  approval_checklist_id: 'local_replay_approval_checklist_demo_001',
  live_gate: DEMO_LOCAL_REPLAY_LIVE_GATE,
  created_at: '2026-05-13T00:00:00.000Z',
}));
