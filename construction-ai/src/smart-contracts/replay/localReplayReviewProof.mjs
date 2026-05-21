import { LOCAL_REPLAY_DIGEST_ALGORITHM } from './localReplayDigest.mjs';
import { DEMO_LOCAL_REPLAY_EVIDENCE_BUNDLE } from './localReplayEvidenceBundle.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;
const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/;

export const REQUIRED_LOCAL_REPLAY_REVIEW_PROOF_FIELDS = Object.freeze([
  'proof_id',
  'evidence_bundle_id',
  'replay_id',
  'request_id',
  'digest_id',
  'digest_algorithm',
  'digest',
  'scenario',
  'module_order',
  'fixture_count',
  'step_count',
  'review_scope',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_REVIEW_PROOF_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  review_scope: 'LOCAL_REVIEW_ONLY_NO_LIVE_XPR_NO_REAL_MONEY',
});

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay review proof: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayReviewProof(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay review proof input must be an object');
  }

  const evidenceBundle = input.evidence_bundle;
  if (!evidenceBundle?.local_only) {
    throw new Error('Local replay review proof requires a local_only evidence_bundle');
  }

  if (evidenceBundle.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay review proof evidence_bundle must be BLOCKED_FOR_LIVE');
  }

  if (evidenceBundle.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay review proof evidence_bundle must be PASS_LOCAL_ONLY');
  }

  if (!SHA256_HEX_PATTERN.test(evidenceBundle.digest)) {
    throw new Error('Local replay review proof evidence_bundle digest must be a sha256 hex digest');
  }

  if (!Array.isArray(evidenceBundle.module_order) || evidenceBundle.module_order.length !== evidenceBundle.step_count) {
    throw new Error('Local replay review proof module_order must match step_count');
  }
  if (!evidenceBundle.module_order.includes('repayment_failure')) {
    throw new Error('Local replay review proof module_order must include repayment_failure');
  }
  if (!evidenceBundle.module_order.includes('adverse_action')) {
    throw new Error('Local replay review proof module_order must include adverse_action');
  }

  assertNoSecretLookingValue(input, 'local_replay_review_proof');

  const proof = {
    proof_id: input.proof_id,
    evidence_bundle_id: evidenceBundle.evidence_bundle_id,
    replay_id: evidenceBundle.replay_id,
    request_id: evidenceBundle.request_id,
    digest_id: evidenceBundle.digest_id,
    digest_algorithm: LOCAL_REPLAY_DIGEST_ALGORITHM,
    digest: evidenceBundle.digest,
    scenario: input.scenario ?? evidenceBundle.scenario,
    module_order: Object.freeze([...evidenceBundle.module_order]),
    fixture_count: evidenceBundle.fixture_count,
    step_count: evidenceBundle.step_count,
    created_at: input.created_at,
    ...LOCAL_REPLAY_REVIEW_PROOF_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_REVIEW_PROOF_FIELDS) {
    if (proof[field] === undefined || proof[field] === null || proof[field] === '') {
      throw new Error(`Missing required local replay review proof field: ${field}`);
    }
  }

  return Object.freeze(proof);
}

export const DEMO_LOCAL_REPLAY_REVIEW_PROOF = Object.freeze(createLocalReplayReviewProof({
  proof_id: 'local_replay_review_proof_demo_001',
  evidence_bundle: DEMO_LOCAL_REPLAY_EVIDENCE_BUNDLE,
  created_at: '2026-05-13T00:00:00.000Z',
}));
