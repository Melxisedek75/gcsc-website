const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const ADVERSE_ACTION_DECISION_TYPES = Object.freeze([
  'DECLINED',
  'HELD',
  'REDUCED',
]);

export const ADVERSE_ACTION_REQUIRED_FIELDS = Object.freeze([
  'adverse_action_event_id',
  'applicant_profile_id',
  'request_id',
  'decision_type',
  'principal_reasons',
  'data_sources_used',
  'reviewer_role',
  'notice_template_version',
  'delivery_status',
  'appeal_window_status',
  'blocked_live_action',
  'created_at',
]);

export const BLOCKED_ADVERSE_ACTION_FLAGS = Object.freeze({
  send_notice_allowed: false,
  deny_real_credit_allowed: false,
  approve_real_credit_allowed: false,
  credit_bureau_reporting_allowed: false,
  legal_determination_allowed: false,
  provider_obligation_allowed: false,
  repayment_routing_allowed: false,
  escrow_activation_allowed: false,
  stablecoin_settlement_allowed: false,
  token_collateral_lock_allowed: false,
  real_lending_launch_allowed: false,
  ai_final_decision_allowed: false,
});

function assertPlainLocalValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local adverse-action field: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertPlainLocalValue(nested, `${path}.${key}`);
    }
  }
}

function assertNonEmptyArray(value, field) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`Missing required local adverse-action field: ${field}`);
  }
}

export function createAdverseActionNoticeState(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Adverse-action notice state input must be an object');
  }

  for (const field of ADVERSE_ACTION_REQUIRED_FIELDS) {
    if (input[field] === undefined || input[field] === null || input[field] === '') {
      throw new Error(`Missing required local adverse-action field: ${field}`);
    }
  }

  assertNonEmptyArray(input.principal_reasons, 'principal_reasons');
  assertNonEmptyArray(input.data_sources_used, 'data_sources_used');

  if (!ADVERSE_ACTION_DECISION_TYPES.includes(input.decision_type)) {
    throw new Error(`Unsupported local adverse-action decision_type: ${input.decision_type}`);
  }

  assertPlainLocalValue(input, 'adverse_action_notice');

  return Object.freeze({
    ...input,
    deployment_status: 'BLOCKED_FOR_LIVE',
    local_only: true,
    local_draft_output: 'LOCAL_DRAFT_ADVERSE_ACTION_TRACE',
    required_local_result: 'HOLD_FOR_ADVERSE_ACTION_REVIEW',
    module: 'adverse_action_notice',
    notice_preparation_only: true,
    blocked_live_gate_status: 'BLOCKED_FOR_LIVE_LOAN',
    ...BLOCKED_ADVERSE_ACTION_FLAGS,
  });
}

export const DEMO_ADVERSE_ACTION_NOTICE_FIXTURE = Object.freeze(createAdverseActionNoticeState({
  adverse_action_event_id: 'adverse_action_demo_001',
  applicant_profile_id: 'contractor_profile_demo_001',
  request_id: 'req_demo_adverse_action_001',
  decision_type: 'HELD',
  principal_reasons: Object.freeze([
    'stale_compliance_evidence',
    'missing_provider_review',
  ]),
  data_sources_used: Object.freeze([
    'local_demo_contractor_profile',
    'local_demo_loan_request',
    'local_demo_compliance_status',
  ]),
  reviewer_role: 'admin_local_review',
  notice_template_version: 'local_template_v0',
  delivery_status: 'NOT_SENT_LOCAL_DRAFT',
  appeal_window_status: 'LOCAL_REVIEW_ONLY',
  blocked_live_action: 'BLOCKED_FOR_LIVE_LOAN',
  created_at: '2026-05-21T00:00:00.000Z',
}));
