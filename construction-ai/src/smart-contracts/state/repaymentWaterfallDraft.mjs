import crypto from 'node:crypto';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_REPAYMENT_WATERFALL_FIELDS = Object.freeze([
  'request_id',
  'project_contract_state',
  'milestone_state',
  'milestone_gross',
  'approved_platform_fees',
  'requested_repayment',
  'outstanding_balance',
  'milestone_repayment_cap',
  'retainage_holdback',
  'approved_change_order_amount',
  'disputed_work_amount',
  'provider_approval_state',
  'dispute_state',
  'blocked_live_gate_status',
  'audit_event',
]);

export const REPAYMENT_WATERFALL_HOLD_STATES = Object.freeze([
  'HOLD_FOR_INPUT_NORMALIZATION_REVIEW',
  'HOLD_FOR_PROVIDER_TERM_REVALIDATION',
  'HOLD_FOR_DISPUTE_WINDOW_REVIEW',
  'HOLD_FOR_OWNER_ACCEPTANCE_REVIEW',
  'HOLD_FOR_RETAINAGE_LIEN_REVIEW',
  'HOLD_FOR_CHANGE_ORDER_REVIEW',
  'HOLD_FOR_NEGATIVE_CONTRACTOR_PAYOUT_REVIEW',
  'LIVE_TOKEN_COLLATERAL_BLOCKED',
  'LIVE_STABLECOIN_SETTLEMENT_BLOCKED',
]);

export const BLOCKED_REPAYMENT_WATERFALL_FLAGS = Object.freeze({
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

const PROVIDER_TERM_HOLD_STATES = new Set(['missing', 'expired', 'copied', 'unclear', 'unreviewed', 'superseded']);
const REVIEWED_PROVIDER_STATES = new Set(['reviewed_current', 'approved_local_terms', 'current_reviewed']);
const DISPUTE_HOLD_STATES = new Set(['active', 'unresolved', 'open-window', 'open_window', 'contradictory', 'partial_dispute']);
const APPROVED_MILESTONE_STATES = new Set(['approved', 'owner_accepted', 'release_eligible']);
const CHANGE_ORDER_HOLD_STATES = new Set(['pending', 'stale', 'unsigned', 'disputed', 'over_budget', 'over-budget']);
const CLEARED_RETAINAGE_STATES = new Set(['cleared', 'not_applicable', 'none']);

function assertPlainLocalValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local repayment waterfall field: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertPlainLocalValue(nested, `${path}.${key}`);
    }
  }
}

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function hashLocalValue(value) {
  return crypto.createHash('sha256').update(stableJson(value)).digest('hex');
}

function toCents(value) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value === 'string' && !/^\d+(\.\d{1,2})?$/.test(value.trim())) return null;
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) return null;
  const cents = Math.round(numeric * 100);
  if (Math.abs(cents / 100 - numeric) > 0.000001) return null;
  return cents;
}

function fromCents(value) {
  return Number((value / 100).toFixed(2));
}

function createAuditEvent(input, output) {
  return Object.freeze({
    audit_event_id: `audit_${hashLocalValue({ request_id: input?.request_id, output }).slice(0, 16)}`,
    request_id: input?.request_id || input?.audit_event?.request_id || null,
    actor_profile_id: input?.audit_event?.actor_profile_id || input?.actor_profile_id || null,
    input_hash: hashLocalValue(input || {}),
    output_hash: hashLocalValue(output || {}),
    endpoint_name: 'local_repayment_waterfall_draft_helper',
    fixture_state: output.fixture_state,
    hold_reason: output.hold_reason,
    blocked_live_gate_status: 'BLOCKED_FOR_LIVE',
    created_at: 'LOCAL_DRAFT_TIMESTAMP',
  });
}

function buildResult(input, output) {
  const auditEvent = createAuditEvent(input, output);
  return Object.freeze({
    ...output,
    audit_event_id: auditEvent.audit_event_id,
    audit_event: auditEvent,
    local_only: true,
    deployment_status: 'BLOCKED_FOR_LIVE',
    ...BLOCKED_REPAYMENT_WATERFALL_FLAGS,
  });
}

function hold(input, fixtureState, holdReason) {
  return buildResult(input, {
    fixture_state: fixtureState,
    approved_loan_repayment: 0,
    contractor_net_payout: 0,
    allocable_amount: 0,
    hold_reason: holdReason,
    blocked_live_gate_status: 'BLOCKED_FOR_LIVE',
  });
}

function normalizeCurrencyInputs(input) {
  const currencyFields = [
    'milestone_gross',
    'approved_platform_fees',
    'requested_repayment',
    'outstanding_balance',
    'milestone_repayment_cap',
    'retainage_holdback',
    'approved_change_order_amount',
    'disputed_work_amount',
  ];
  const normalized = {};
  for (const field of currencyFields) {
    const cents = toCents(input[field]);
    if (cents === null) return { invalid: true, field };
    normalized[field] = cents;
  }
  return { invalid: false, normalized };
}

export function calculateDraftRepaymentWaterfall(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return hold(input, 'HOLD_FOR_INPUT_NORMALIZATION_REVIEW', 'calculation input must be a local object');
  }

  assertPlainLocalValue(input, 'repayment_waterfall');

  for (const field of REQUIRED_REPAYMENT_WATERFALL_FIELDS) {
    if (input[field] === undefined || input[field] === null || input[field] === '') {
      return hold(input, 'HOLD_FOR_INPUT_NORMALIZATION_REVIEW', `missing required field: ${field}`);
    }
  }

  const normalizedResult = normalizeCurrencyInputs(input);
  if (normalizedResult.invalid) {
    return hold(input, 'HOLD_FOR_INPUT_NORMALIZATION_REVIEW', `invalid currency field: ${normalizedResult.field}`);
  }

  if (input.token_collateral_dependency === true || input.token_collateral_route === true) {
    return hold(input, 'LIVE_TOKEN_COLLATERAL_BLOCKED', 'token collateral dependency is blocked for local draft waterfall review');
  }

  if (input.stablecoin_settlement_dependency === true || input.stablecoin_route === true) {
    return hold(input, 'LIVE_STABLECOIN_SETTLEMENT_BLOCKED', 'stablecoin settlement dependency is blocked for local draft waterfall review');
  }

  const providerState = String(input.provider_approval_state).toLowerCase();
  if (PROVIDER_TERM_HOLD_STATES.has(providerState) || !REVIEWED_PROVIDER_STATES.has(providerState)) {
    return hold(input, 'HOLD_FOR_PROVIDER_TERM_REVALIDATION', 'provider/legal/payment terms require local revalidation');
  }

  const disputeState = String(input.dispute_state).toLowerCase();
  if (DISPUTE_HOLD_STATES.has(disputeState)) {
    return hold(input, 'HOLD_FOR_DISPUTE_WINDOW_REVIEW', 'dispute state blocks repayment waterfall math');
  }

  const milestoneState = String(input.milestone_state).toLowerCase();
  if (!APPROVED_MILESTONE_STATES.has(milestoneState)) {
    return hold(input, 'HOLD_FOR_OWNER_ACCEPTANCE_REVIEW', 'owner acceptance or milestone approval is missing');
  }

  const {
    milestone_gross,
    approved_platform_fees,
    requested_repayment,
    outstanding_balance,
    milestone_repayment_cap,
    retainage_holdback,
    approved_change_order_amount,
    disputed_work_amount,
  } = normalizedResult.normalized;

  let allocableAmount = milestone_gross - disputed_work_amount;
  if (allocableAmount < 0) {
    return hold(input, 'HOLD_FOR_DISPUTE_WINDOW_REVIEW', 'disputed work exceeds milestone gross');
  }

  const retainageState = String(input.retainage_clearance_state || 'none').toLowerCase();
  if (retainage_holdback > 0 && !CLEARED_RETAINAGE_STATES.has(retainageState)) {
    allocableAmount -= retainage_holdback;
    if (allocableAmount < 0) {
      return hold(input, 'HOLD_FOR_RETAINAGE_LIEN_REVIEW', 'retainage or lien waiver holdback exceeds allocable amount');
    }
  }

  const changeOrderState = String(input.change_order_state || 'none').toLowerCase();
  if (approved_change_order_amount > 0 && CHANGE_ORDER_HOLD_STATES.has(changeOrderState)) {
    return hold(input, 'HOLD_FOR_CHANGE_ORDER_REVIEW', 'change order state blocks receivable or cap expansion');
  }

  const approvedLoanRepayment = Math.min(
    requested_repayment,
    outstanding_balance,
    milestone_repayment_cap,
    allocableAmount,
  );
  const contractorNetPayout = allocableAmount - approved_platform_fees - approvedLoanRepayment;

  if (contractorNetPayout < 0) {
    return hold(input, 'HOLD_FOR_NEGATIVE_CONTRACTOR_PAYOUT_REVIEW', 'contractor_net_payout would be negative after fees and repayment');
  }

  return buildResult(input, {
    fixture_state: 'DRAFT_REPAYMENT_ALLOCATION',
    approved_loan_repayment: fromCents(approvedLoanRepayment),
    contractor_net_payout: fromCents(contractorNetPayout),
    allocable_amount: fromCents(allocableAmount),
    hold_reason: null,
    blocked_live_gate_status: 'BLOCKED_FOR_LIVE',
  });
}

export const DEMO_REPAYMENT_WATERFALL_DRAFT_FIXTURE = Object.freeze(calculateDraftRepaymentWaterfall({
  request_id: 'req_demo_repayment_waterfall_draft_001',
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
    request_id: 'req_demo_repayment_waterfall_draft_001',
    actor_profile_id: 'profile_founder_local_demo',
  },
}));
