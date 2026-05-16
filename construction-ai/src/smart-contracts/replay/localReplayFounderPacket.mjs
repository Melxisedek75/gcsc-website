import { DEMO_LOCAL_REPLAY_REVIEW_PROOF } from './localReplayReviewProof.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_FOUNDER_PACKET_FIELDS = Object.freeze([
  'founder_packet_id',
  'proof_id',
  'evidence_bundle_id',
  'replay_id',
  'request_id',
  'digest_id',
  'digest_algorithm',
  'digest',
  'decision_state',
  'founder_action_required',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_FOUNDER_PACKET_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  decision_state: 'FOUNDER_REVIEW_REQUIRED_BEFORE_LIVE',
  founder_action_required: 'Review proof only; do not sign XPR actions or enable real payments, loans, escrow, or token collateral.',
});

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay founder packet: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayFounderPacket(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay founder packet input must be an object');
  }

  const proof = input.review_proof;
  if (!proof?.local_only) {
    throw new Error('Local replay founder packet requires a local_only review_proof');
  }

  if (proof.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay founder packet review_proof must be BLOCKED_FOR_LIVE');
  }

  if (proof.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay founder packet review_proof must be PASS_LOCAL_ONLY');
  }
  if (!proof.module_order?.includes('repayment_failure')) {
    throw new Error('Local replay founder packet review_proof module_order must include repayment_failure');
  }

  assertNoSecretLookingValue(input, 'local_replay_founder_packet');

  const packet = {
    founder_packet_id: input.founder_packet_id,
    proof_id: proof.proof_id,
    evidence_bundle_id: proof.evidence_bundle_id,
    replay_id: proof.replay_id,
    request_id: proof.request_id,
    digest_id: proof.digest_id,
    digest_algorithm: proof.digest_algorithm,
    digest: proof.digest,
    scenario: proof.scenario,
    module_order: Object.freeze([...proof.module_order]),
    fixture_count: proof.fixture_count,
    step_count: proof.step_count,
    created_at: input.created_at,
    ...LOCAL_REPLAY_FOUNDER_PACKET_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_FOUNDER_PACKET_FIELDS) {
    if (packet[field] === undefined || packet[field] === null || packet[field] === '') {
      throw new Error(`Missing required local replay founder packet field: ${field}`);
    }
  }

  return Object.freeze(packet);
}

export const DEMO_LOCAL_REPLAY_FOUNDER_PACKET = Object.freeze(createLocalReplayFounderPacket({
  founder_packet_id: 'local_replay_founder_packet_demo_001',
  review_proof: DEMO_LOCAL_REPLAY_REVIEW_PROOF,
  created_at: '2026-05-13T00:00:00.000Z',
}));
