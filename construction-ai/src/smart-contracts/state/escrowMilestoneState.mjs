const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const ESCROW_MILESTONE_STATES = Object.freeze([
  'draft',
  'pending_review',
  'active',
  'milestone_submitted',
  'under_review',
  'release_recommended',
  'disputed',
  'paused',
  'completed',
  'cancelled',
  'archived',
]);

export const ESCROW_MILESTONE_ACTIONS = Object.freeze([
  'create_project',
  'activate_project',
  'submit_evidence',
  'record_review',
  'recommend_release',
  'open_dispute',
  'pause_project',
  'resolve_dispute',
  'complete_project',
  'archive_project',
  'cancel_project',
]);

export const REQUIRED_ESCROW_MILESTONE_FIELDS = Object.freeze([
  'escrow_event_id',
  'request_id',
  'project_contract_id',
  'milestone_id',
  'actor_role',
  'action',
  'previous_state',
  'next_state',
  'safety_gate',
  'created_at',
]);

export const BLOCKED_ESCROW_FLAGS = Object.freeze({
  real_escrow_allowed: false,
  real_payment_allowed: false,
  automatic_payment_release_allowed: false,
  escrow_agent_claim_allowed: false,
  provider_money_movement_allowed: false,
  stablecoin_settlement_allowed: false,
  repayment_routing_allowed: false,
  ai_final_authority_allowed: false,
});

const ALLOWED_TRANSITIONS = Object.freeze({
  draft: Object.freeze(['pending_review', 'cancelled']),
  pending_review: Object.freeze(['active', 'cancelled', 'paused']),
  active: Object.freeze(['milestone_submitted', 'paused', 'cancelled']),
  milestone_submitted: Object.freeze(['under_review', 'disputed', 'paused']),
  under_review: Object.freeze(['release_recommended', 'disputed', 'paused']),
  release_recommended: Object.freeze(['completed', 'disputed', 'paused']),
  disputed: Object.freeze(['under_review', 'paused', 'cancelled']),
  paused: Object.freeze(['active', 'under_review', 'cancelled']),
  completed: Object.freeze(['archived']),
  cancelled: Object.freeze(['archived']),
  archived: Object.freeze(['archived']),
});

function assertPlainLocalValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local escrow milestone field: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertPlainLocalValue(nested, `${path}.${key}`);
    }
  }
}

function assertAllowedTransition(previousState, nextState) {
  if (!ESCROW_MILESTONE_STATES.includes(previousState)) {
    throw new Error(`Unsupported local escrow previous_state: ${previousState}`);
  }

  if (!ESCROW_MILESTONE_STATES.includes(nextState)) {
    throw new Error(`Unsupported local escrow next_state: ${nextState}`);
  }

  if (!ALLOWED_TRANSITIONS[previousState].includes(nextState)) {
    throw new Error(`Unsupported local escrow transition: ${previousState} -> ${nextState}`);
  }
}

export function applyEscrowMilestoneTransition(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Escrow milestone transition input must be an object');
  }

  for (const field of REQUIRED_ESCROW_MILESTONE_FIELDS) {
    if (input[field] === undefined || input[field] === null || input[field] === '') {
      throw new Error(`Missing required local escrow milestone field: ${field}`);
    }
  }

  if (!ESCROW_MILESTONE_ACTIONS.includes(input.action)) {
    throw new Error(`Unsupported local escrow milestone action: ${input.action}`);
  }

  assertAllowedTransition(input.previous_state, input.next_state);
  assertPlainLocalValue(input, 'escrow_milestone');

  return Object.freeze({
    ...input,
    deployment_status: 'BLOCKED_FOR_LIVE',
    local_only: true,
    module: 'project_escrow',
    release_recommendation_only: true,
    ...BLOCKED_ESCROW_FLAGS,
  });
}

export const DEMO_ESCROW_RELEASE_RECOMMENDATION_FIXTURE = Object.freeze(applyEscrowMilestoneTransition({
  escrow_event_id: 'escrow_demo_release_001',
  request_id: 'req_demo_escrow_release_001',
  project_contract_id: 'project_demo_001',
  milestone_id: 'milestone_demo_roof_001',
  actor_role: 'inspector',
  action: 'recommend_release',
  previous_state: 'under_review',
  next_state: 'release_recommended',
  evidence_id: 'evidence_demo_roof_001',
  review_id: 'review_demo_roof_001',
  safety_gate: 'demo-only',
  founder_approval_status: 'required',
  legal_provider_status: 'required',
  payment_provider_status: 'not_connected',
  created_at: '2026-05-13T00:00:00.000Z',
}));
