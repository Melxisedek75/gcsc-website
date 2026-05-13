const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_AUDIT_EVENT_FIELDS = Object.freeze([
  'event_id',
  'request_id',
  'module',
  'actor_account',
  'actor_role',
  'action_name',
  'previous_state',
  'next_state',
  'safety_gate',
  'created_at',
]);

export const ALLOWED_MODULES = Object.freeze([
  'project_escrow',
  'loan_ledger',
  'token_collateral',
  'peer_review',
  'authority',
  'backend_to_chain_map',
]);

export const BLOCKED_LIVE_RISK_FLAGS = Object.freeze({
  live_xpr_deployment_allowed: false,
  real_payment_allowed: false,
  real_loan_allowed: false,
  real_escrow_allowed: false,
  repayment_routing_allowed: false,
  token_collateral_liquidation_allowed: false,
  stablecoin_settlement_allowed: false,
  ai_final_authority_allowed: false,
});

function assertPlainLocalValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local audit event field: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertPlainLocalValue(nested, `${path}.${key}`);
    }
  }
}

export function serializeSmartContractAuditEvent(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Audit event input must be an object');
  }

  for (const field of REQUIRED_AUDIT_EVENT_FIELDS) {
    if (input[field] === undefined || input[field] === null || input[field] === '') {
      throw new Error(`Missing required local audit event field: ${field}`);
    }
  }

  if (!ALLOWED_MODULES.includes(input.module)) {
    throw new Error(`Unsupported local audit event module: ${input.module}`);
  }

  assertPlainLocalValue(input, 'audit_event');

  return Object.freeze({
    ...input,
    deployment_status: 'BLOCKED_FOR_LIVE',
    local_only: true,
    money_movement_allowed: false,
    ...BLOCKED_LIVE_RISK_FLAGS,
  });
}

export const DEMO_AUDIT_EVENT_FIXTURE = Object.freeze(serializeSmartContractAuditEvent({
  event_id: 'audit_demo_001',
  request_id: 'req_demo_smart_contract_audit_001',
  module: 'backend_to_chain_map',
  actor_account: 'demo.admin',
  actor_role: 'admin',
  action_name: 'recorddemo',
  previous_state: 'draft',
  next_state: 'recorded',
  project_contract_id: 'project_demo_001',
  milestone_id: 'milestone_demo_001',
  loan_id: 'loan_demo_001',
  collateral_id: 'collateral_demo_001',
  review_id: 'review_demo_001',
  evidence_id: 'evidence_demo_001',
  safety_gate: 'demo-only',
  provider_review_status: 'not_applicable',
  founder_approval_status: 'required',
  legal_provider_status: 'required',
  created_at: '2026-05-13T00:00:00.000Z',
}));
