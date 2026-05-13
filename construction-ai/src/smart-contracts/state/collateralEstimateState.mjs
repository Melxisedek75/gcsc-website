const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const COLLATERAL_ESTIMATE_STATES = Object.freeze([
  'draft',
  'demo_locked',
  'price_snapshot_recorded',
  'ltv_checked',
  'release_label_recorded',
  'liquidation_blocked',
  'paused',
  'cancelled',
  'archived',
]);

export const COLLATERAL_ESTIMATE_ACTIONS = Object.freeze([
  'lockdemo',
  'snapprice',
  'ltvcheck',
  'releasecol',
  'blockliq',
]);

export const REQUIRED_COLLATERAL_ESTIMATE_FIELDS = Object.freeze([
  'collateral_event_id',
  'request_id',
  'collateral_id',
  'loan_id',
  'contractor_id',
  'actor_role',
  'action',
  'previous_state',
  'next_state',
  'safety_gate',
  'created_at',
]);

export const BLOCKED_COLLATERAL_FLAGS = Object.freeze({
  real_token_lock_allowed: false,
  token_custody_allowed: false,
  margin_call_allowed: false,
  auto_liquidation_allowed: false,
  token_collateral_liquidation_allowed: false,
  oracle_price_authority_allowed: false,
  real_payment_allowed: false,
  real_loan_allowed: false,
  stablecoin_settlement_allowed: false,
  ai_final_authority_allowed: false,
});

const ALLOWED_TRANSITIONS = Object.freeze({
  draft: Object.freeze(['demo_locked', 'cancelled']),
  demo_locked: Object.freeze(['price_snapshot_recorded', 'paused', 'cancelled']),
  price_snapshot_recorded: Object.freeze(['ltv_checked', 'paused', 'cancelled']),
  ltv_checked: Object.freeze(['release_label_recorded', 'liquidation_blocked', 'paused']),
  liquidation_blocked: Object.freeze(['release_label_recorded', 'paused', 'archived']),
  release_label_recorded: Object.freeze(['archived']),
  paused: Object.freeze(['ltv_checked', 'release_label_recorded', 'archived']),
  cancelled: Object.freeze(['archived']),
  archived: Object.freeze(['archived']),
});

function assertPlainLocalValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local collateral estimate field: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertPlainLocalValue(nested, `${path}.${key}`);
    }
  }
}

function assertAllowedTransition(previousState, nextState) {
  if (!COLLATERAL_ESTIMATE_STATES.includes(previousState)) {
    throw new Error(`Unsupported local collateral previous_state: ${previousState}`);
  }

  if (!COLLATERAL_ESTIMATE_STATES.includes(nextState)) {
    throw new Error(`Unsupported local collateral next_state: ${nextState}`);
  }

  if (!ALLOWED_TRANSITIONS[previousState].includes(nextState)) {
    throw new Error(`Unsupported local collateral transition: ${previousState} -> ${nextState}`);
  }
}

export function applyCollateralEstimateTransition(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Collateral estimate transition input must be an object');
  }

  for (const field of REQUIRED_COLLATERAL_ESTIMATE_FIELDS) {
    if (input[field] === undefined || input[field] === null || input[field] === '') {
      throw new Error(`Missing required local collateral estimate field: ${field}`);
    }
  }

  if (!COLLATERAL_ESTIMATE_ACTIONS.includes(input.action)) {
    throw new Error(`Unsupported local collateral estimate action: ${input.action}`);
  }

  assertAllowedTransition(input.previous_state, input.next_state);
  assertPlainLocalValue(input, 'collateral_estimate');

  return Object.freeze({
    ...input,
    deployment_status: 'BLOCKED_FOR_LIVE',
    local_only: true,
    module: 'token_collateral_estimate',
    estimate_fixture_only: true,
    ltv_label_only: true,
    liquidation_blocked: true,
    ...BLOCKED_COLLATERAL_FLAGS,
  });
}

export const DEMO_COLLATERAL_LTV_FIXTURE = Object.freeze(applyCollateralEstimateTransition({
  collateral_event_id: 'collateral_demo_ltv_001',
  request_id: 'req_demo_collateral_ltv_001',
  collateral_id: 'collateral_demo_001',
  loan_id: 'loan_demo_001',
  contractor_id: 'contractor_demo_001',
  actor_role: 'risk_admin',
  action: 'ltvcheck',
  previous_state: 'price_snapshot_recorded',
  next_state: 'ltv_checked',
  token_estimate_label: 'demo_token_estimate_only',
  ltv_label: 'demo_ltv_label_only',
  oracle_snapshot_placeholder_id: 'oracle_snapshot_placeholder_demo_001',
  lock_status: 'demo_locked_label_only',
  release_status: 'release_requires_founder_legal_provider_review',
  legal_provider_status: 'required',
  finance_provider_status: 'required',
  safety_gate: 'demo-only',
  created_at: '2026-05-13T00:00:00.000Z',
}));
