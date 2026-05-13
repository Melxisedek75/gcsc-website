import { createHash } from 'node:crypto';
import { DEMO_LOCAL_REPLAY_MANIFEST } from './localReplayManifest.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const LOCAL_REPLAY_DIGEST_ALGORITHM = 'sha256';

export const REQUIRED_LOCAL_REPLAY_DIGEST_FIELDS = Object.freeze([
  'digest_id',
  'manifest_id',
  'replay_id',
  'request_id',
  'digest_algorithm',
  'digest',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay digest: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(',')}}`;
  }

  return JSON.stringify(value);
}

export function createLocalReplayDigest(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay digest input must be an object');
  }

  if (!input.manifest?.local_only) {
    throw new Error('Local replay digest requires a local_only manifest');
  }

  if (input.manifest.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay digest manifest must be BLOCKED_FOR_LIVE');
  }

  if (input.manifest.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay digest manifest must be PASS_LOCAL_ONLY');
  }

  if (!Array.isArray(input.manifest.steps) || input.manifest.steps.length !== input.manifest.step_count) {
    throw new Error('Local replay digest manifest steps must match step_count');
  }

  assertNoSecretLookingValue(input, 'local_replay_digest');

  const digestInput = stableStringify({
    manifest_id: input.manifest.manifest_id,
    replay_id: input.manifest.replay_id,
    request_id: input.manifest.request_id,
    scenario: input.manifest.scenario,
    module_order: input.manifest.module_order,
    step_count: input.manifest.step_count,
    fixture_count: input.manifest.fixture_count,
    pass_fail_status: input.manifest.pass_fail_status,
    deployment_status: input.manifest.deployment_status,
    local_only: input.manifest.local_only,
    steps: input.manifest.steps,
  });

  const digest = createHash(LOCAL_REPLAY_DIGEST_ALGORITHM).update(digestInput).digest('hex');
  const record = {
    digest_id: input.digest_id,
    manifest_id: input.manifest.manifest_id,
    replay_id: input.manifest.replay_id,
    request_id: input.manifest.request_id,
    digest_algorithm: LOCAL_REPLAY_DIGEST_ALGORITHM,
    digest,
    local_only: true,
    deployment_status: 'BLOCKED_FOR_LIVE',
    pass_fail_status: 'PASS_LOCAL_ONLY',
    created_at: input.created_at,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_DIGEST_FIELDS) {
    if (record[field] === undefined || record[field] === null || record[field] === '') {
      throw new Error(`Missing required local replay digest field: ${field}`);
    }
  }

  return Object.freeze(record);
}

export const DEMO_LOCAL_REPLAY_DIGEST = Object.freeze(createLocalReplayDigest({
  digest_id: 'local_replay_digest_demo_001',
  manifest: DEMO_LOCAL_REPLAY_MANIFEST,
  created_at: '2026-05-13T00:00:00.000Z',
}));
