import { DEMO_LOCAL_REPLAY_DIGEST } from './localReplayDigest.mjs';
import { DEMO_LOCAL_REPLAY_MANIFEST } from './localReplayManifest.mjs';
import { DEMO_LOCAL_REPLAY_PACKET } from './localReplayPacket.mjs';
import { DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE } from './localReplayScenarioBundle.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_EVIDENCE_BUNDLE_FIELDS = Object.freeze([
  'evidence_bundle_id',
  'replay_id',
  'request_id',
  'scenario',
  'packet_id',
  'scenario_bundle_id',
  'manifest_id',
  'digest_id',
  'digest',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_EVIDENCE_BUNDLE_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
});

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay evidence bundle: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

function assertLocalReplayRecord(record, name) {
  if (!record?.local_only) {
    throw new Error(`Local replay evidence bundle requires local_only ${name}`);
  }

  if (record.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error(`Local replay evidence bundle ${name} must be BLOCKED_FOR_LIVE`);
  }

  if (record.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error(`Local replay evidence bundle ${name} must be PASS_LOCAL_ONLY`);
  }
}

export function createLocalReplayEvidenceBundle(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay evidence bundle input must be an object');
  }

  const packet = input.packet;
  const scenarioBundle = input.scenario_bundle;
  const manifest = input.manifest;
  const digest = input.digest;

  assertLocalReplayRecord(packet, 'packet');
  assertLocalReplayRecord(scenarioBundle, 'scenario_bundle');
  assertLocalReplayRecord(manifest, 'manifest');
  assertLocalReplayRecord(digest, 'digest');

  if (scenarioBundle.replay_packet !== packet) {
    throw new Error('Local replay evidence bundle scenario_bundle must reference the packet');
  }

  if (manifest.replay_id !== packet.replay_id || manifest.request_id !== packet.request_id) {
    throw new Error('Local replay evidence bundle manifest must match packet replay_id and request_id');
  }

  if (digest.manifest_id !== manifest.manifest_id || digest.replay_id !== manifest.replay_id) {
    throw new Error('Local replay evidence bundle digest must match manifest');
  }

  assertNoSecretLookingValue(input, 'local_replay_evidence_bundle');

  const bundle = {
    evidence_bundle_id: input.evidence_bundle_id,
    replay_id: packet.replay_id,
    request_id: packet.request_id,
    scenario: packet.scenario,
    packet_id: packet.replay_id,
    scenario_bundle_id: scenarioBundle.scenario_bundle_id,
    manifest_id: manifest.manifest_id,
    digest_id: digest.digest_id,
    digest: digest.digest,
    module_order: Object.freeze([...manifest.module_order]),
    fixture_count: manifest.fixture_count,
    step_count: manifest.step_count,
    created_at: input.created_at,
    ...LOCAL_REPLAY_EVIDENCE_BUNDLE_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_EVIDENCE_BUNDLE_FIELDS) {
    if (bundle[field] === undefined || bundle[field] === null || bundle[field] === '') {
      throw new Error(`Missing required local replay evidence bundle field: ${field}`);
    }
  }

  return Object.freeze(bundle);
}

export const DEMO_LOCAL_REPLAY_EVIDENCE_BUNDLE = Object.freeze(createLocalReplayEvidenceBundle({
  evidence_bundle_id: 'local_replay_evidence_bundle_demo_001',
  packet: DEMO_LOCAL_REPLAY_PACKET,
  scenario_bundle: DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE,
  manifest: DEMO_LOCAL_REPLAY_MANIFEST,
  digest: DEMO_LOCAL_REPLAY_DIGEST,
  created_at: '2026-05-13T00:00:00.000Z',
}));
