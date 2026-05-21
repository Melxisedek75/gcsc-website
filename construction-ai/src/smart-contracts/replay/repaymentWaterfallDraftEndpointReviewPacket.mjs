import {
  DEMO_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_FIXTURES,
  REPAYMENT_WATERFALL_DRAFT_ENDPOINT_PATH,
} from './repaymentWaterfallDraftEndpointFixtures.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET_STATUS =
  'HOLD_FOR_FOUNDER_LEGAL_PROVIDER_REVIEW';

export const REQUIRED_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET_FIELDS = Object.freeze([
  'review_packet_id',
  'status',
  'endpoint_path',
  'fixture_count',
  'covered_fixture_states',
  'required_external_review_gates',
  'blocked_live_actions',
  'fixtures',
  'deployment_status',
  'pass_fail_status',
  'local_only',
]);

export const BLOCKED_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET_FLAGS = Object.freeze({
  live_repayment_routing_allowed: false,
  live_escrow_custody_allowed: false,
  stablecoin_settlement_allowed: false,
  token_collateral_allowed: false,
  provider_api_call_allowed: false,
  real_loan_allowed: false,
  real_payment_allowed: false,
  production_balance_mutation_allowed: false,
  ai_final_authority_allowed: false,
});

const REQUIRED_EXTERNAL_REVIEW_GATES = Object.freeze([
  'founder_review',
  'legal_provider_review',
  'finance_provider_review',
  'security_review',
  'no_real_money_test_evidence',
]);

const BLOCKED_LIVE_ACTIONS = Object.freeze([
  'real repayment routing',
  'real escrow custody',
  'stablecoin settlement',
  'token collateral lock or liquidation',
  'provider API call',
  'money movement',
]);

const REQUIRED_COVERED_FIXTURE_STATES = Object.freeze([
  'DRAFT_REPAYMENT_ALLOCATION',
  'HOLD_FOR_DISPUTE_WINDOW_REVIEW',
  'HOLD_FOR_IDEMPOTENCY_REVIEW',
  'HOLD_FOR_AUTH_RLS_REVIEW',
  'LIVE_STABLECOIN_SETTLEMENT_BLOCKED',
  'LIVE_TOKEN_COLLATERAL_BLOCKED',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in repayment waterfall draft endpoint review packet: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

function deepFreeze(value) {
  if (value && typeof value === 'object') {
    Object.freeze(value);
    for (const nested of Object.values(value)) deepFreeze(nested);
  }
  return value;
}

function unique(values) {
  return [...new Set(values)];
}

export function createRepaymentWaterfallDraftEndpointReviewPacket(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Repayment waterfall draft endpoint review packet input must be an object');
  }

  if (String(input.status || '').toUpperCase().includes('GO') || String(input.status || '').toUpperCase().includes('LIVE')) {
    throw new Error('Repayment waterfall draft endpoint review packet status cannot approve live action');
  }

  const fixtures = input.fixtures || DEMO_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_FIXTURES;
  if (!Array.isArray(fixtures) || fixtures.length === 0) {
    throw new Error('Repayment waterfall draft endpoint review packet requires local fixtures');
  }

  for (const fixture of fixtures) {
    if (fixture.local_only !== true) {
      throw new Error('Repayment waterfall draft endpoint review packet fixtures must stay local_only');
    }
    if (fixture.blocked_live_gate_status !== 'BLOCKED_FOR_LIVE') {
      throw new Error('Repayment waterfall draft endpoint review packet fixtures must stay BLOCKED_FOR_LIVE');
    }
  }

  const coveredFixtureStates = unique(fixtures.map((fixture) => fixture.expected_fixture_state));
  const packet = {
    review_packet_id: input.review_packet_id,
    status: input.status || REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET_STATUS,
    endpoint_path: input.endpoint_path || REPAYMENT_WATERFALL_DRAFT_ENDPOINT_PATH,
    fixture_count: fixtures.length,
    covered_fixture_states: input.covered_fixture_states || coveredFixtureStates,
    required_external_review_gates: input.required_external_review_gates || REQUIRED_EXTERNAL_REVIEW_GATES,
    blocked_live_actions: input.blocked_live_actions || BLOCKED_LIVE_ACTIONS,
    fixtures,
    deployment_status: 'BLOCKED_FOR_LIVE',
    pass_fail_status: 'PASS_LOCAL_ONLY',
    local_only: true,
    evidence_sources: input.evidence_sources || [
      'repayment_waterfall_draft_helper',
      'repayment_waterfall_draft_endpoint_smoke',
      'repayment_waterfall_draft_endpoint_fixtures',
    ],
    owner_next_step: input.owner_next_step || 'Founder/legal/provider/security review before any real repayment routing.',
    ...BLOCKED_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET_FLAGS,
  };

  for (const field of REQUIRED_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET_FIELDS) {
    if (packet[field] === undefined || packet[field] === null || packet[field] === '') {
      throw new Error(`Missing required repayment waterfall draft endpoint review packet field: ${field}`);
    }
  }

  if (packet.status !== REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET_STATUS) {
    throw new Error('Repayment waterfall draft endpoint review packet status must remain review-held');
  }

  if (packet.endpoint_path !== REPAYMENT_WATERFALL_DRAFT_ENDPOINT_PATH) {
    throw new Error('Repayment waterfall draft endpoint review packet endpoint path drifted');
  }

  if (packet.fixture_count !== packet.fixtures.length) {
    throw new Error('Repayment waterfall draft endpoint review packet fixture_count must match fixtures length');
  }

  for (const gate of REQUIRED_EXTERNAL_REVIEW_GATES) {
    if (!packet.required_external_review_gates.includes(gate)) {
      throw new Error(`Repayment waterfall draft endpoint review packet must require ${gate}`);
    }
  }

  for (const action of BLOCKED_LIVE_ACTIONS) {
    if (!packet.blocked_live_actions.includes(action)) {
      throw new Error(`Repayment waterfall draft endpoint review packet must block ${action}`);
    }
  }

  for (const state of REQUIRED_COVERED_FIXTURE_STATES) {
    if (!packet.covered_fixture_states.includes(state)) {
      throw new Error(`Repayment waterfall draft endpoint review packet must cover ${state}`);
    }
  }

  for (const [flag, value] of Object.entries(BLOCKED_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET_FLAGS)) {
    if (packet[flag] !== value) {
      throw new Error(`Repayment waterfall draft endpoint review packet ${flag} must be false`);
    }
  }

  assertNoSecretLookingValue(packet, 'repayment_waterfall_draft_endpoint_review_packet');
  return deepFreeze(packet);
}

export const DEMO_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET = Object.freeze(
  createRepaymentWaterfallDraftEndpointReviewPacket({
    review_packet_id: 'repayment_waterfall_draft_endpoint_review_packet_demo_001',
    status: REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET_STATUS,
  }),
);
