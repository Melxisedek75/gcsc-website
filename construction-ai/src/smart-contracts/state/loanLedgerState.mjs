const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const LOAN_LEDGER_STATES = Object.freeze([
  'requested',
  'scoring',
  'provider_review',
  'offer_recorded',
  'repayment_plan_recorded',
  'repayment_event_recorded',
  'disputed',
  'default_label',
  'repaid_label',
  'declined',
  'paused',
  'archived',
]);

export const LOAN_LEDGER_ACTIONS = Object.freeze([
  'record_request',
  'record_score',
  'record_offer',
  'record_repayment_plan',
  'record_repayment_event',
  'record_default_label',
  'record_dispute',
  'pause_loan',
  'decline_request',
  'archive_loan',
]);

export const REQUIRED_LOAN_LEDGER_FIELDS = Object.freeze([
  'loan_event_id',
  'request_id',
  'loan_id',
  'project_contract_id',
  'contractor_id',
  'actor_role',
  'action',
  'previous_state',
  'next_state',
  'safety_gate',
  'created_at',
]);

export const BLOCKED_LOAN_FLAGS = Object.freeze({
  real_loan_allowed: false,
  loan_origination_allowed: false,
  provider_underwriting_allowed: false,
  borrower_obligation_allowed: false,
  lender_or_bank_claim_allowed: false,
  real_payment_allowed: false,
  repayment_routing_allowed: false,
  real_escrow_allowed: false,
  stablecoin_settlement_allowed: false,
  token_collateral_liquidation_allowed: false,
  ai_final_authority_allowed: false,
});

const ALLOWED_TRANSITIONS = Object.freeze({
  requested: Object.freeze(['scoring', 'declined', 'paused']),
  scoring: Object.freeze(['provider_review', 'declined', 'paused']),
  provider_review: Object.freeze(['offer_recorded', 'declined', 'paused']),
  offer_recorded: Object.freeze(['repayment_plan_recorded', 'declined', 'paused']),
  repayment_plan_recorded: Object.freeze(['repayment_event_recorded', 'disputed', 'paused']),
  repayment_event_recorded: Object.freeze(['repaid_label', 'default_label', 'disputed', 'paused']),
  disputed: Object.freeze(['provider_review', 'paused', 'declined']),
  default_label: Object.freeze(['provider_review', 'archived']),
  repaid_label: Object.freeze(['archived']),
  declined: Object.freeze(['archived']),
  paused: Object.freeze(['scoring', 'provider_review', 'repayment_plan_recorded', 'archived']),
  archived: Object.freeze(['archived']),
});

function assertPlainLocalValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local loan ledger field: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertPlainLocalValue(nested, `${path}.${key}`);
    }
  }
}

function assertAllowedTransition(previousState, nextState) {
  if (!LOAN_LEDGER_STATES.includes(previousState)) {
    throw new Error(`Unsupported local loan previous_state: ${previousState}`);
  }

  if (!LOAN_LEDGER_STATES.includes(nextState)) {
    throw new Error(`Unsupported local loan next_state: ${nextState}`);
  }

  if (!ALLOWED_TRANSITIONS[previousState].includes(nextState)) {
    throw new Error(`Unsupported local loan transition: ${previousState} -> ${nextState}`);
  }
}

export function applyLoanLedgerTransition(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Loan ledger transition input must be an object');
  }

  for (const field of REQUIRED_LOAN_LEDGER_FIELDS) {
    if (input[field] === undefined || input[field] === null || input[field] === '') {
      throw new Error(`Missing required local loan ledger field: ${field}`);
    }
  }

  if (!LOAN_LEDGER_ACTIONS.includes(input.action)) {
    throw new Error(`Unsupported local loan ledger action: ${input.action}`);
  }

  assertAllowedTransition(input.previous_state, input.next_state);
  assertPlainLocalValue(input, 'loan_ledger');

  return Object.freeze({
    ...input,
    deployment_status: 'BLOCKED_FOR_LIVE',
    local_only: true,
    module: 'loan_ledger',
    receivables_fixture_only: true,
    repayment_waterfall_label_only: true,
    ...BLOCKED_LOAN_FLAGS,
  });
}

export const DEMO_LOAN_REPAYMENT_WATERFALL_FIXTURE = Object.freeze(applyLoanLedgerTransition({
  loan_event_id: 'loan_demo_repayment_001',
  request_id: 'req_demo_loan_repayment_001',
  loan_id: 'loan_demo_001',
  project_contract_id: 'project_demo_001',
  contractor_id: 'contractor_demo_001',
  actor_role: 'admin',
  action: 'record_repayment_event',
  previous_state: 'repayment_plan_recorded',
  next_state: 'repayment_event_recorded',
  signed_contract_receivable_id: 'receivable_demo_project_001',
  milestone_id: 'milestone_demo_roof_001',
  simulated_milestone_amount_label: 'demo_amount_only',
  simulated_repayment_priority_label: 'loan_first_then_contractor_remainder',
  provider_review_status: 'required',
  finance_provider_status: 'required',
  legal_provider_status: 'required',
  safety_gate: 'demo-only',
  created_at: '2026-05-13T00:00:00.000Z',
}));
