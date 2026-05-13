const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const AUTHORITY_MODULES = Object.freeze([
  'project_escrow',
  'loan_ledger',
  'token_collateral',
  'peer_review',
  'authority',
  'backend_to_chain_map',
]);

export const AUTHORITY_ACTIONS = Object.freeze([
  'pause',
  'request_unpause',
  'record_emergency_pause',
  'block_upgrade',
  'record_rollback',
]);

export const REQUIRED_AUTHORITY_EVENT_FIELDS = Object.freeze([
  'authority_event_id',
  'request_id',
  'module',
  'actor_role',
  'action',
  'previous_state',
  'next_state',
  'safety_gate',
  'created_at',
]);

export const BLOCKED_AUTHORITY_FLAGS = Object.freeze({
  live_xpr_permission_change_allowed: false,
  setcode_allowed: false,
  setabi_allowed: false,
  updateauth_allowed: false,
  linkauth_allowed: false,
  single_key_production_authority_allowed: false,
  unreviewed_upgrade_allowed: false,
  money_movement_allowed: false,
  ai_final_authority_allowed: false,
});

function assertPlainLocalValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local authority event field: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertPlainLocalValue(nested, `${path}.${key}`);
    }
  }
}

function assertAllowedTransition(action, previousState, nextState) {
  const allowed = (
    (action === 'pause' && nextState === 'paused') ||
    (action === 'record_emergency_pause' && nextState === 'paused') ||
    (action === 'request_unpause' && previousState === 'paused' && nextState === 'unpause_requested') ||
    (action === 'block_upgrade' && nextState === 'upgrade_blocked') ||
    (action === 'record_rollback' && nextState === 'rollback_recorded')
  );

  if (!allowed) {
    throw new Error(`Unsupported local authority transition: ${action} ${previousState} -> ${nextState}`);
  }
}

export function applyAuthorityTransition(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Authority transition input must be an object');
  }

  for (const field of REQUIRED_AUTHORITY_EVENT_FIELDS) {
    if (input[field] === undefined || input[field] === null || input[field] === '') {
      throw new Error(`Missing required local authority event field: ${field}`);
    }
  }

  if (!AUTHORITY_MODULES.includes(input.module)) {
    throw new Error(`Unsupported local authority module: ${input.module}`);
  }

  if (!AUTHORITY_ACTIONS.includes(input.action)) {
    throw new Error(`Unsupported local authority action: ${input.action}`);
  }

  assertAllowedTransition(input.action, input.previous_state, input.next_state);
  assertPlainLocalValue(input, 'authority_event');

  return Object.freeze({
    ...input,
    deployment_status: 'BLOCKED_FOR_LIVE',
    local_only: true,
    ...BLOCKED_AUTHORITY_FLAGS,
  });
}

export const DEMO_AUTHORITY_PAUSE_FIXTURE = Object.freeze(applyAuthorityTransition({
  authority_event_id: 'authority_demo_pause_001',
  request_id: 'req_demo_authority_pause_001',
  module: 'project_escrow',
  actor_role: 'admin',
  action: 'pause',
  previous_state: 'active',
  next_state: 'paused',
  reason_code: 'local_replay_dispute_pause',
  safety_gate: 'demo-only',
  founder_approval_status: 'required',
  legal_provider_status: 'required',
  security_review_status: 'required',
  created_at: '2026-05-13T00:00:00.000Z',
}));
