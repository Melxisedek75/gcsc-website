import {
  BLOCKED_REPLAY_SCENARIO_FLAGS,
  DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE,
} from './localReplayScenarioBundle.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_MANIFEST_FIELDS = Object.freeze([
  'manifest_id',
  'replay_id',
  'request_id',
  'scenario',
  'module_order',
  'step_count',
  'fixture_count',
  'pass_fail_status',
  'deployment_status',
  'local_only',
  'created_at',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay manifest: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

function normalizeManifestStep(step, index, moduleOrder) {
  if (step.sequence !== index + 1) {
    throw new Error('Local replay manifest step sequence must be contiguous');
  }

  if (step.module !== moduleOrder[index]) {
    throw new Error('Local replay manifest steps must follow module_order');
  }

  if (step.fixture_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay manifest step fixture_status must be BLOCKED_FOR_LIVE');
  }

  if (step.expected_result !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay manifest step expected_result must be PASS_LOCAL_ONLY');
  }

  return Object.freeze({
    step_id: step.step_id,
    sequence: step.sequence,
    module: step.module,
    fixture_status: step.fixture_status,
    expected_result: step.expected_result,
  });
}

export function createLocalReplayManifest(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay manifest input must be an object');
  }

  if (!input.scenario_bundle?.local_only) {
    throw new Error('Local replay manifest requires a local_only scenario_bundle');
  }

  if (input.scenario_bundle.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay manifest scenario_bundle must be BLOCKED_FOR_LIVE');
  }

  if (input.scenario_bundle.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay manifest scenario_bundle must be PASS_LOCAL_ONLY');
  }

  const moduleOrder = input.scenario_bundle.module_order;
  const steps = input.scenario_bundle.steps;
  if (!Array.isArray(moduleOrder) || !Array.isArray(steps) || steps.length !== moduleOrder.length) {
    throw new Error('Local replay manifest steps must match module_order length');
  }
  if (!moduleOrder.includes('repayment_failure')) {
    throw new Error('Local replay manifest module_order must include repayment_failure');
  }

  const manifestSteps = steps.map((step, index) => normalizeManifestStep(step, index, moduleOrder));

  for (const [flag, value] of Object.entries(BLOCKED_REPLAY_SCENARIO_FLAGS)) {
    if (value !== false || input.scenario_bundle[flag] !== false) {
      throw new Error(`Local replay manifest blocked flag must stay false: ${flag}`);
    }
  }

  assertNoSecretLookingValue(input, 'local_replay_manifest');

  const manifest = {
    manifest_id: input.manifest_id,
    replay_id: input.scenario_bundle.replay_id,
    request_id: input.scenario_bundle.request_id,
    scenario: input.scenario_bundle.scenario,
    module_order: Object.freeze([...moduleOrder]),
    step_count: manifestSteps.length,
    fixture_count: input.scenario_bundle.replay_packet.fixture_count,
    pass_fail_status: 'PASS_LOCAL_ONLY',
    deployment_status: 'BLOCKED_FOR_LIVE',
    local_only: true,
    steps: Object.freeze(manifestSteps),
    created_at: input.created_at,
    ...BLOCKED_REPLAY_SCENARIO_FLAGS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_MANIFEST_FIELDS) {
    if (manifest[field] === undefined || manifest[field] === null || manifest[field] === '') {
      throw new Error(`Missing required local replay manifest field: ${field}`);
    }
  }

  return Object.freeze(manifest);
}

export const DEMO_LOCAL_REPLAY_MANIFEST = Object.freeze(createLocalReplayManifest({
  manifest_id: 'local_replay_manifest_demo_001',
  scenario_bundle: DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE,
  created_at: '2026-05-13T00:00:00.000Z',
}));
