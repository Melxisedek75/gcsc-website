import { DEMO_LOCAL_REPLAY_PACKET, LOCAL_REPLAY_MODULE_ORDER } from './localReplayPacket.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_REPLAY_SCENARIO_STEP_FIELDS = Object.freeze([
  'step_id',
  'sequence',
  'module',
  'fixture_index',
  'fixture_status',
  'expected_result',
]);

export const BLOCKED_REPLAY_SCENARIO_FLAGS = Object.freeze({
  live_xpr_deployment_allowed: false,
  real_payment_allowed: false,
  real_loan_allowed: false,
  real_escrow_allowed: false,
  repayment_routing_allowed: false,
  token_collateral_liquidation_allowed: false,
  stablecoin_settlement_allowed: false,
  real_reward_payout_allowed: false,
  ai_final_authority_allowed: false,
});

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay scenario: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

function normalizeStep(input, index) {
  const step = {
    ...input,
    sequence: index + 1,
    expected_result: input.expected_result ?? 'PASS_LOCAL_ONLY',
  };

  for (const field of REQUIRED_REPLAY_SCENARIO_STEP_FIELDS) {
    if (step[field] === undefined || step[field] === null || step[field] === '') {
      throw new Error(`Missing required local replay scenario step field: ${field}`);
    }
  }

  if (!LOCAL_REPLAY_MODULE_ORDER.includes(step.module)) {
    throw new Error(`Unknown local replay scenario module: ${step.module}`);
  }

  if (step.expected_result !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay scenario step expected_result must be PASS_LOCAL_ONLY');
  }

  if (step.fixture_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay scenario step fixture_status must be BLOCKED_FOR_LIVE');
  }

  assertNoSecretLookingValue(step, `step_${index}`);
  return Object.freeze(step);
}

export function createLocalReplayScenarioBundle(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay scenario bundle input must be an object');
  }

  if (!input.replay_packet?.local_only) {
    throw new Error('Local replay scenario bundle requires a local_only replay_packet');
  }

  if (input.replay_packet.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay scenario bundle replay_packet must be BLOCKED_FOR_LIVE');
  }

  if (!Array.isArray(input.steps) || input.steps.length !== LOCAL_REPLAY_MODULE_ORDER.length) {
    throw new Error('Local replay scenario bundle steps must match the module order length');
  }

  const steps = input.steps.map(normalizeStep);
  const stepModules = steps.map((step) => step.module);
  if (stepModules.join('|') !== LOCAL_REPLAY_MODULE_ORDER.join('|')) {
    throw new Error('Local replay scenario bundle steps must follow LOCAL_REPLAY_MODULE_ORDER');
  }

  assertNoSecretLookingValue(input, 'local_replay_scenario_bundle');

  return Object.freeze({
    scenario_bundle_id: input.scenario_bundle_id,
    replay_id: input.replay_packet.replay_id,
    request_id: input.replay_packet.request_id,
    scenario: input.replay_packet.scenario,
    local_only: true,
    deployment_status: 'BLOCKED_FOR_LIVE',
    pass_fail_status: 'PASS_LOCAL_ONLY',
    replay_packet: input.replay_packet,
    module_order: LOCAL_REPLAY_MODULE_ORDER,
    step_count: steps.length,
    steps,
    created_at: input.created_at,
    ...BLOCKED_REPLAY_SCENARIO_FLAGS,
  });
}

export const DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE = Object.freeze(createLocalReplayScenarioBundle({
  scenario_bundle_id: 'local_replay_scenario_bundle_demo_001',
  replay_packet: DEMO_LOCAL_REPLAY_PACKET,
  steps: LOCAL_REPLAY_MODULE_ORDER.map((module, index) => ({
    step_id: `local_replay_step_${String(index + 1).padStart(2, '0')}`,
    module,
    fixture_index: index,
    fixture_status: 'BLOCKED_FOR_LIVE',
  })),
  created_at: '2026-05-13T00:00:00.000Z',
}));
