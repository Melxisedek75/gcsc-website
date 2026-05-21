import { calculateDraftRepaymentWaterfall } from '../state/repaymentWaterfallDraft.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REPAYMENT_WATERFALL_DRAFT_ENDPOINT_PATH =
  '/api/admin/contract-backed-loan/repayment-waterfall/draft';

export const REQUIRED_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_FIXTURE_FIELDS = Object.freeze([
  'case_id',
  'method',
  'path',
  'request_body',
  'expected_http_status',
  'expected_fixture_state',
  'expected_response_subset',
  'blocked_live_gate_status',
  'local_only',
]);

export const BLOCKED_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_FIXTURE_FLAGS = Object.freeze({
  real_loan_allowed: false,
  loan_origination_allowed: false,
  provider_api_call_allowed: false,
  borrower_obligation_allowed: false,
  real_payment_allowed: false,
  repayment_routing_allowed: false,
  real_escrow_allowed: false,
  escrow_release_allowed: false,
  stablecoin_settlement_allowed: false,
  token_collateral_lock_allowed: false,
  token_collateral_liquidation_allowed: false,
  production_balance_mutation_allowed: false,
  ai_final_authority_allowed: false,
});

const BLOCKED_ENDPOINT_RESPONSE_STATUSES = Object.freeze({
  blocked_live_gate_status: 'BLOCKED_FOR_LIVE',
  live_repayment_routing_status: 'LIVE_REPAYMENT_ROUTING_BLOCKED',
  live_escrow_custody_status: 'LIVE_ESCROW_CUSTODY_BLOCKED',
  live_stablecoin_settlement_status: 'LIVE_STABLECOIN_SETTLEMENT_BLOCKED',
  live_token_collateral_status: 'LIVE_TOKEN_COLLATERAL_BLOCKED',
  ai_final_approval_status: 'AI_FINAL_APPROVAL_BLOCKED',
});

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local repayment waterfall endpoint fixture: ${path}`);
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

function normalizeFixture(input, index) {
  if (
    input.expected_response_subset?.live_repayment_routing_status !== undefined
    && input.expected_response_subset.live_repayment_routing_status !== 'LIVE_REPAYMENT_ROUTING_BLOCKED'
  ) {
    throw new Error('Repayment waterfall draft endpoint fixture must block live repayment routing');
  }

  const fixture = {
    ...input,
    method: input.method ?? 'POST',
    path: input.path ?? REPAYMENT_WATERFALL_DRAFT_ENDPOINT_PATH,
    blocked_live_gate_status: 'BLOCKED_FOR_LIVE',
    local_only: true,
    ...BLOCKED_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_FIXTURE_FLAGS,
    expected_response_subset: {
      ...(input.expected_response_subset || {}),
      ...BLOCKED_ENDPOINT_RESPONSE_STATUSES,
    },
  };

  for (const field of REQUIRED_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_FIXTURE_FIELDS) {
    if (fixture[field] === undefined || fixture[field] === null || fixture[field] === '') {
      throw new Error(`Missing required repayment waterfall draft endpoint fixture field: ${field}`);
    }
  }

  if (fixture.method !== 'POST') {
    throw new Error('Repayment waterfall draft endpoint fixture method must be POST');
  }

  if (fixture.path !== REPAYMENT_WATERFALL_DRAFT_ENDPOINT_PATH) {
    throw new Error('Repayment waterfall draft endpoint fixture path must match the local admin draft endpoint');
  }

  if (fixture.blocked_live_gate_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Repayment waterfall draft endpoint fixture must stay BLOCKED_FOR_LIVE');
  }

  if (fixture.expected_response_subset.live_repayment_routing_status !== 'LIVE_REPAYMENT_ROUTING_BLOCKED') {
    throw new Error('Repayment waterfall draft endpoint fixture must block live repayment routing');
  }

  if (fixture.expected_response_subset.live_escrow_custody_status !== 'LIVE_ESCROW_CUSTODY_BLOCKED') {
    throw new Error('Repayment waterfall draft endpoint fixture must block live escrow custody');
  }

  if (fixture.expected_response_subset.ai_final_approval_status !== 'AI_FINAL_APPROVAL_BLOCKED') {
    throw new Error('Repayment waterfall draft endpoint fixture must block AI final approval');
  }

  for (const [flag, value] of Object.entries(BLOCKED_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_FIXTURE_FLAGS)) {
    if (fixture[flag] !== value) {
      throw new Error(`Repayment waterfall draft endpoint fixture ${flag} must be false`);
    }
  }

  assertNoSecretLookingValue(fixture, `repayment_waterfall_draft_endpoint_fixture_${index}`);
  return deepFreeze(fixture);
}

export function createRepaymentWaterfallDraftEndpointFixtures(input) {
  if (!Array.isArray(input) || input.length === 0) {
    throw new Error('Repayment waterfall draft endpoint fixtures input must be a non-empty array');
  }

  return deepFreeze(input.map(normalizeFixture));
}

const baseCalculationInput = Object.freeze({
  request_id: 'req_waterfall_endpoint_fixture_001',
  project_contract_state: 'signed',
  milestone_state: 'approved',
  milestone_gross: 10000,
  approved_platform_fees: 500,
  requested_repayment: 3000,
  outstanding_balance: 4500,
  milestone_repayment_cap: 3500,
  retainage_holdback: 0,
  retainage_clearance_state: 'cleared',
  approved_change_order_amount: 0,
  change_order_state: 'none',
  disputed_work_amount: 0,
  provider_approval_state: 'reviewed_current',
  dispute_state: 'none',
  blocked_live_gate_status: 'BLOCKED_FOR_LIVE',
  audit_event: {
    request_id: 'req_waterfall_endpoint_fixture_001',
    actor_profile_id: 'profile_founder_local_fixture',
  },
});

function requestBody(caseId, overrides = {}) {
  const requestId = overrides.request_id || `req_waterfall_endpoint_fixture_${caseId}`;
  return {
    request_id: requestId,
    idempotency_key: overrides.idempotency_key || `idem_waterfall_endpoint_fixture_${caseId}`,
    actor_profile_id: overrides.actor_profile_id || 'profile_founder_local_fixture',
    actor_role: overrides.actor_role || 'founder',
    project_contract_id: 'project_contract_local_fixture_001',
    milestone_id: 'milestone_local_fixture_001',
    loan_request_id: 'loan_request_local_fixture_001',
    provider_terms_version: 'provider_terms_local_v1',
    blocked_live_gate_status: 'BLOCKED_FOR_LIVE',
    ...(overrides.replayed_input_hash ? { replayed_input_hash: overrides.replayed_input_hash } : {}),
    calculation_input: {
      ...baseCalculationInput,
      request_id: requestId,
      audit_event: {
        request_id: requestId,
        actor_profile_id: overrides.actor_profile_id || 'profile_founder_local_fixture',
      },
      ...(overrides.calculation_input || {}),
    },
  };
}

function helperSubset(input) {
  const result = calculateDraftRepaymentWaterfall(input);
  return {
    fixture_state: result.fixture_state,
    approved_loan_repayment: result.approved_loan_repayment,
    contractor_net_payout: result.contractor_net_payout,
    allocable_amount: result.allocable_amount,
    hold_reason: result.hold_reason,
  };
}

const validRequest = requestBody('allocation');
const disputeRequest = requestBody('dispute', {
  request_id: 'req_waterfall_endpoint_fixture_dispute',
  calculation_input: { dispute_state: 'active' },
});
const stablecoinBlockedRequest = requestBody('stablecoin', {
  request_id: 'req_waterfall_endpoint_fixture_stablecoin',
  calculation_input: { stablecoin_settlement_dependency: true },
});
const tokenCollateralBlockedRequest = requestBody('token_collateral', {
  request_id: 'req_waterfall_endpoint_fixture_token_collateral',
  calculation_input: { token_collateral_dependency: true },
});

export const DEMO_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_FIXTURES = Object.freeze(createRepaymentWaterfallDraftEndpointFixtures([
  {
    case_id: 'draft_allocation_local_only',
    request_body: validRequest,
    expected_http_status: 201,
    expected_fixture_state: 'DRAFT_REPAYMENT_ALLOCATION',
    expected_response_subset: {
      ...helperSubset(validRequest.calculation_input),
      request_id: validRequest.request_id,
      idempotency_key: validRequest.idempotency_key,
    },
    safety_note: 'Local-only draft allocation; no real repayment routing, escrow custody, payment movement, or borrower obligation.',
  },
  {
    case_id: 'dispute_window_hold_local_only',
    request_body: disputeRequest,
    expected_http_status: 200,
    expected_fixture_state: 'HOLD_FOR_DISPUTE_WINDOW_REVIEW',
    expected_response_subset: {
      ...helperSubset(disputeRequest.calculation_input),
      request_id: disputeRequest.request_id,
      idempotency_key: disputeRequest.idempotency_key,
    },
    safety_note: 'Active dispute blocks local repayment math before any live routing can be considered.',
  },
  {
    case_id: 'idempotency_mismatch_hold_local_only',
    request_body: requestBody('idempotency', {
      request_id: 'req_waterfall_endpoint_fixture_idempotency',
      replayed_input_hash: 'different-local-hash',
    }),
    expected_http_status: 409,
    expected_fixture_state: 'HOLD_FOR_IDEMPOTENCY_REVIEW',
    expected_response_subset: {
      fixture_state: 'HOLD_FOR_IDEMPOTENCY_REVIEW',
      hold_reason: 'replayed idempotency input hash does not match current local draft payload',
    },
    safety_note: 'Changed replay input is held for manual review and cannot mutate live balances.',
  },
  {
    case_id: 'auth_rls_hold_local_only',
    request_body: requestBody('auth', {
      request_id: 'req_waterfall_endpoint_fixture_auth',
      actor_profile_id: 'profile_contractor_self_approval_blocked',
      actor_role: 'contractor',
    }),
    expected_http_status: 403,
    expected_fixture_state: 'HOLD_FOR_AUTH_RLS_REVIEW',
    expected_response_subset: {
      fixture_state: 'HOLD_FOR_AUTH_RLS_REVIEW',
      hold_reason: 'actor is not allowed to prepare repayment waterfall draft locally',
    },
    safety_note: 'Contractor self-approval path is blocked for Auth/RLS review.',
  },
  {
    case_id: 'stablecoin_settlement_blocked_local_only',
    request_body: stablecoinBlockedRequest,
    expected_http_status: 200,
    expected_fixture_state: 'LIVE_STABLECOIN_SETTLEMENT_BLOCKED',
    expected_response_subset: {
      ...helperSubset(stablecoinBlockedRequest.calculation_input),
      request_id: stablecoinBlockedRequest.request_id,
      idempotency_key: stablecoinBlockedRequest.idempotency_key,
    },
    safety_note: 'Stablecoin settlement dependency remains blocked in local endpoint replay fixtures.',
  },
  {
    case_id: 'token_collateral_blocked_local_only',
    request_body: tokenCollateralBlockedRequest,
    expected_http_status: 200,
    expected_fixture_state: 'LIVE_TOKEN_COLLATERAL_BLOCKED',
    expected_response_subset: {
      ...helperSubset(tokenCollateralBlockedRequest.calculation_input),
      request_id: tokenCollateralBlockedRequest.request_id,
      idempotency_key: tokenCollateralBlockedRequest.idempotency_key,
    },
    safety_note: 'Token collateral dependency remains blocked in local endpoint replay fixtures.',
  },
]));
