const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const PEER_REVIEW_REWARD_STATES = Object.freeze([
  'submitted',
  'scored',
  'reward_label_recorded',
  'abuse_flagged',
  'admin_review',
  'paused',
  'archived',
]);

export const PEER_REVIEW_REWARD_ACTIONS = Object.freeze([
  'submitrev',
  'scorerev',
  'rewardrev',
  'flagabuse',
  'pauserev',
]);

export const REQUIRED_PEER_REVIEW_SAFETY_GATE = 'demo-only';
export const REQUIRED_PEER_REVIEW_ACTOR_ROLE = 'peer_reviewer';

const LOCAL_DEMO_PEER_REVIEW_IDENTIFIER_PREFIXES = Object.freeze({
  review_event_id: 'peer_review_demo_reward_',
  request_id: 'req_demo_peer_review_reward_',
  review_id: 'peer_review_demo_',
  project_contract_id: 'project_demo_',
  milestone_id: 'milestone_demo_',
  reviewer_id: 'reviewer_demo_',
  contractor_id: 'contractor_demo_',
});

export const REQUIRED_PEER_REVIEW_REWARD_FIELDS = Object.freeze([
  'review_event_id',
  'request_id',
  'review_id',
  'project_contract_id',
  'milestone_id',
  'reviewer_id',
  'contractor_id',
  'actor_role',
  'action',
  'previous_state',
  'next_state',
  'safety_gate',
  'created_at',
]);

export const BLOCKED_PEER_REVIEW_REWARD_FLAGS = Object.freeze({
  real_reward_payout_allowed: false,
  token_issuance_allowed: false,
  reviewer_compensation_allowed: false,
  reputation_penalty_allowed: false,
  public_reputation_claim_allowed: false,
  peer_review_final_authority_allowed: false,
  dispute_finality_allowed: false,
  payment_release_allowed: false,
  real_escrow_allowed: false,
  real_payment_allowed: false,
  ai_final_authority_allowed: false,
});

const ALLOWED_TRANSITIONS = Object.freeze({
  submitted: Object.freeze(['scored', 'abuse_flagged', 'paused']),
  scored: Object.freeze(['reward_label_recorded', 'abuse_flagged', 'paused']),
  reward_label_recorded: Object.freeze(['archived']),
  abuse_flagged: Object.freeze(['admin_review', 'paused', 'archived']),
  admin_review: Object.freeze(['scored', 'reward_label_recorded', 'paused', 'archived']),
  paused: Object.freeze(['admin_review', 'scored', 'archived']),
  archived: Object.freeze(['archived']),
});

function assertPlainLocalValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local peer review reward field: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertPlainLocalValue(nested, `${path}.${key}`);
    }
  }
}

function assertAllowedTransition(previousState, nextState) {
  if (!PEER_REVIEW_REWARD_STATES.includes(previousState)) {
    throw new Error(`Unsupported local peer review previous_state: ${previousState}`);
  }

  if (!PEER_REVIEW_REWARD_STATES.includes(nextState)) {
    throw new Error(`Unsupported local peer review next_state: ${nextState}`);
  }

  if (!ALLOWED_TRANSITIONS[previousState].includes(nextState)) {
    throw new Error(`Unsupported local peer review transition: ${previousState} -> ${nextState}`);
  }
}

function assertPeerReviewSafetyGate(input) {
  if (input.safety_gate !== REQUIRED_PEER_REVIEW_SAFETY_GATE) {
    throw new Error('Local peer review safety gate must remain demo-only');
  }
}

function assertPeerReviewActorRole(input) {
  if (input.actor_role !== REQUIRED_PEER_REVIEW_ACTOR_ROLE) {
    throw new Error('Local peer review actor role must remain peer_reviewer');
  }
}

function assertLocalDemoIdentifierPrefixes(input) {
  for (const [field, prefix] of Object.entries(LOCAL_DEMO_PEER_REVIEW_IDENTIFIER_PREFIXES)) {
    if (!String(input[field]).startsWith(prefix)) {
      throw new Error(`Local peer review identifier prefix must be ${prefix} for ${field}`);
    }
  }
}

export function applyPeerReviewRewardTransition(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Peer review reward transition input must be an object');
  }

  for (const field of REQUIRED_PEER_REVIEW_REWARD_FIELDS) {
    if (input[field] === undefined || input[field] === null || input[field] === '') {
      throw new Error(`Missing required local peer review reward field: ${field}`);
    }
  }

  if (!PEER_REVIEW_REWARD_ACTIONS.includes(input.action)) {
    throw new Error(`Unsupported local peer review reward action: ${input.action}`);
  }

  assertAllowedTransition(input.previous_state, input.next_state);
  assertPlainLocalValue(input, 'peer_review_reward');
  assertPeerReviewSafetyGate(input);
  assertPeerReviewActorRole(input);
  assertLocalDemoIdentifierPrefixes(input);

  return Object.freeze({
    ...input,
    deployment_status: 'BLOCKED_FOR_LIVE',
    local_only: true,
    module: 'peer_review_reward',
    reward_placeholder_only: true,
    reputation_label_only: true,
    conflict_check_fixture_only: true,
    peer_review_safety_gate_guard: 'DEMO_ONLY_REVIEW_SAFETY_GATE_REQUIRED',
    peer_review_actor_role_guard: 'LOCAL_PEER_REVIEWER_ONLY',
    peer_review_identifier_prefix_guard: 'LOCAL_DEMO_PEER_REVIEW_IDENTIFIERS_ONLY',
    ...BLOCKED_PEER_REVIEW_REWARD_FLAGS,
  });
}

export const DEMO_PEER_REVIEW_REWARD_FIXTURE = Object.freeze(applyPeerReviewRewardTransition({
  review_event_id: 'peer_review_demo_reward_001',
  request_id: 'req_demo_peer_review_reward_001',
  review_id: 'peer_review_demo_001',
  project_contract_id: 'project_demo_001',
  milestone_id: 'milestone_demo_roof_001',
  reviewer_id: 'reviewer_demo_001',
  contractor_id: 'contractor_demo_001',
  actor_role: REQUIRED_PEER_REVIEW_ACTOR_ROLE,
  action: 'rewardrev',
  previous_state: 'scored',
  next_state: 'reward_label_recorded',
  evidence_id: 'evidence_demo_roof_001',
  score_label: 'demo_score_only',
  recommendation_label: 'release_recommendation_only',
  abuse_flag: false,
  conflict_of_interest_status: 'not_flagged_demo_only',
  reward_label: 'demo_reward_label_only',
  reputation_impact_label: 'demo_reputation_impact_only',
  safety_gate: REQUIRED_PEER_REVIEW_SAFETY_GATE,
  founder_approval_status: 'required_before_public_claims',
  legal_provider_status: 'required',
  created_at: '2026-05-13T00:00:00.000Z',
}));
