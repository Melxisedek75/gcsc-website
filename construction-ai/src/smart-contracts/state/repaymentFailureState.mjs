const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REPAYMENT_FAILURE_STATES = Object.freeze([
  'MISSING_PROVIDER_TERMS',
  'MILESTONE_NOT_APPROVED',
  'ACTIVE_DISPUTE',
  'OVER_REPAYMENT_REQUEST',
  'NEGATIVE_CONTRACTOR_PAYOUT',
  'UNVERIFIED_CHANGE_ORDER',
  'PARTIAL_APPROVAL_HOLDBACK',
  'STALE_OR_CONTRADICTORY_EVIDENCE',
  'AI_ONLY_APPROVAL_ATTEMPT',
  'TOKEN_COLLATERAL_DEPENDENCY',
]);

export const REPAYMENT_FAILURE_REQUIRED_FIELDS = Object.freeze([
  'failure_event_id',
  'request_id',
  'project_contract_id',
  'milestone_id',
  'loan_id',
  'failure_state',
  'required_local_result',
  'evidence_reference',
  'required_human_review',
  'required_provider_or_legal_review',
  'safe_next_local_action',
  'created_at',
]);

export const BLOCKED_REPAYMENT_FAILURE_FLAGS = Object.freeze({
  repayment_routing_allowed: false,
  escrow_release_allowed: false,
  stablecoin_settlement_allowed: false,
  token_collateral_lock_allowed: false,
  provider_api_calls_allowed: false,
  ai_final_approval_allowed: false,
  production_money_movement_allowed: false,
  live_ledger_mutation_allowed: false,
  fee_charge_allowed: false,
  public_live_claim_allowed: false,
});

const REQUIRED_LOCAL_RESULTS = Object.freeze([
  'HOLD_FOR_PROVIDER_REVIEW',
  'HOLD_FOR_MILESTONE_APPROVAL',
  'HOLD_FOR_DISPUTE_REVIEW',
  'CAP_TO_OUTSTANDING_BALANCE',
  'HOLD_FOR_NEGATIVE_PAYOUT_REVIEW',
  'HOLD_FOR_CHANGE_ORDER_REVIEW',
  'HOLD_FOR_PARTIAL_MILESTONE_REVIEW',
  'HOLD_FOR_EVIDENCE_REVIEW',
  'HOLD_FOR_HUMAN_REVIEW',
  'HOLD_FOR_TOKEN_COLLATERAL_REVIEW',
]);

function assertPlainLocalValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local repayment failure field: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertPlainLocalValue(nested, `${path}.${key}`);
    }
  }
}

export function createRepaymentFailureState(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Repayment failure state input must be an object');
  }

  for (const field of REPAYMENT_FAILURE_REQUIRED_FIELDS) {
    if (input[field] === undefined || input[field] === null || input[field] === '') {
      throw new Error(`Missing required local repayment failure field: ${field}`);
    }
  }

  if (!REPAYMENT_FAILURE_STATES.includes(input.failure_state)) {
    throw new Error(`Unsupported local repayment failure_state: ${input.failure_state}`);
  }

  if (!REQUIRED_LOCAL_RESULTS.includes(input.required_local_result)) {
    throw new Error(`Unsupported local repayment failure required_local_result: ${input.required_local_result}`);
  }

  assertPlainLocalValue(input, 'repayment_failure_state');

  return Object.freeze({
    ...input,
    deployment_status: 'BLOCKED_FOR_LIVE',
    local_only: true,
    local_draft_output: 'LOCAL_DRAFT_FAILURE_STATE',
    draft_allocation_status: 'DRAFT_REPAYMENT_ALLOCATION',
    module: 'repayment_failure_state',
    audit_event_required: true,
    blocked_live_gate_status: 'BLOCKED_FOR_LIVE',
    ...BLOCKED_REPAYMENT_FAILURE_FLAGS,
  });
}

export const DEMO_REPAYMENT_FAILURE_STATE_FIXTURE = Object.freeze(createRepaymentFailureState({
  failure_event_id: 'repayment_failure_demo_001',
  request_id: 'req_demo_repayment_failure_001',
  project_contract_id: 'project_demo_001',
  milestone_id: 'milestone_demo_roof_001',
  loan_id: 'loan_demo_001',
  failure_state: 'ACTIVE_DISPUTE',
  required_local_result: 'HOLD_FOR_DISPUTE_REVIEW',
  evidence_reference: 'local_evidence_demo_dispute_001',
  required_human_review: true,
  required_provider_or_legal_review: true,
  safe_next_local_action: 'collect_redacted_dispute_evidence_before_repayment_review',
  blocked_live_actions: Object.freeze([
    'no_repayment_routing',
    'no_escrow_release',
    'no_stablecoin_settlement',
    'no_token_collateral_lock',
    'no_provider_api_calls',
    'no_ai_final_approval',
    'no_production_money_movement',
  ]),
  created_at: '2026-05-16T00:00:00.000Z',
}));
