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
export const REQUIRED_PEER_REVIEW_FOUNDER_APPROVAL_STATUS = 'required_before_public_claims';
export const REQUIRED_PEER_REVIEW_LEGAL_PROVIDER_STATUS = 'required';
export const REQUIRED_PEER_REVIEW_CONFLICT_STATUS = 'not_flagged_demo_only';
export const REQUIRED_PEER_REVIEW_SCORE_LABEL = 'demo_score_only';
export const REQUIRED_PEER_REVIEW_RECOMMENDATION_LABEL = 'release_recommendation_only';
export const REQUIRED_PEER_REVIEW_REWARD_LABEL = 'demo_reward_label_only';
export const REQUIRED_PEER_REVIEW_REPUTATION_LABEL = 'demo_reputation_impact_only';
export const REQUIRED_PEER_REVIEW_ABUSE_FLAG = false;
export const REQUIRED_PEER_REVIEW_CREATED_AT = '2026-05-13T00:00:00.000Z';
export const REQUIRED_PEER_REVIEW_SCOPE = 'quality_review_only';
export const REQUIRED_PEER_REVIEW_ATTESTATION_STATUS = 'demo_attested_local_only';
export const REQUIRED_PEER_REVIEW_SOURCE_CHANNEL = 'local_demo_peer_review';
export const REQUIRED_PEER_REVIEW_EVIDENCE_REVIEW_STATUS = 'local_demo_evidence_review_pending';
export const REQUIRED_PEER_REVIEW_PUBLICATION_STATUS = 'local_demo_not_published';
export const REQUIRED_PEER_REVIEW_REWARD_CALCULATION_MODE = 'label_only_no_token_amount';
export const REQUIRED_PEER_REVIEW_PAYOUT_DESTINATION = 'none_local_demo';
export const REQUIRED_PEER_REVIEW_PAYOUT_AUTHORIZATION_STATUS = 'not_authorized_local_demo';
export const REQUIRED_PEER_REVIEW_TRANSFER_REFERENCE = 'none_local_demo';
export const REQUIRED_PEER_REVIEW_SETTLEMENT_BATCH_ID = 'none_local_demo';

const LOCAL_DEMO_PEER_REVIEW_IDENTIFIER_PREFIXES = Object.freeze({
  review_event_id: 'peer_review_demo_reward_',
  request_id: 'req_demo_peer_review_reward_',
  review_id: 'peer_review_demo_',
  project_contract_id: 'project_demo_',
  milestone_id: 'milestone_demo_',
  reviewer_id: 'reviewer_demo_',
  contractor_id: 'contractor_demo_',
});
const LOCAL_DEMO_PEER_REVIEW_EVIDENCE_PREFIX = 'evidence_demo_';

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
  'founder_approval_status',
  'legal_provider_status',
  'conflict_of_interest_status',
  'abuse_flag',
  'evidence_id',
  'review_scope',
  'reviewer_attestation_status',
  'source_channel',
  'evidence_review_status',
  'publication_status',
  'score_label',
  'recommendation_label',
  'reward_label',
  'reward_calculation_mode',
  'payout_destination',
  'payout_authorization_status',
  'transfer_reference',
  'settlement_batch_id',
  'reputation_impact_label',
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

function assertPeerReviewProviderReview(input) {
  if (
    input.founder_approval_status !== REQUIRED_PEER_REVIEW_FOUNDER_APPROVAL_STATUS ||
    input.legal_provider_status !== REQUIRED_PEER_REVIEW_LEGAL_PROVIDER_STATUS
  ) {
    throw new Error('Local peer review review status must require founder and legal provider review');
  }
}

function assertPeerReviewConflictStatus(input) {
  if (input.conflict_of_interest_status !== REQUIRED_PEER_REVIEW_CONFLICT_STATUS) {
    throw new Error('Local peer review conflict status must require local conflict check clearance');
  }
}

function assertPeerReviewLabelOnlyFields(input) {
  if (
    input.reward_label !== REQUIRED_PEER_REVIEW_REWARD_LABEL ||
    input.reputation_impact_label !== REQUIRED_PEER_REVIEW_REPUTATION_LABEL
  ) {
    throw new Error('Local peer review label-only fields must remain demo placeholders');
  }
}

function assertPeerReviewScoringLabels(input) {
  if (
    input.score_label !== REQUIRED_PEER_REVIEW_SCORE_LABEL ||
    input.recommendation_label !== REQUIRED_PEER_REVIEW_RECOMMENDATION_LABEL
  ) {
    throw new Error('Local peer review scoring label fields must remain demo placeholders');
  }
}

function assertPeerReviewAbuseFlag(input) {
  if (input.abuse_flag !== REQUIRED_PEER_REVIEW_ABUSE_FLAG) {
    throw new Error('Local peer review abuse flag must remain false before local abuse review');
  }
}

function assertLocalDemoEvidenceId(input) {
  if (!String(input.evidence_id).startsWith(LOCAL_DEMO_PEER_REVIEW_EVIDENCE_PREFIX)) {
    throw new Error('Local peer review evidence id must remain local demo evidence');
  }
}

function assertPeerReviewCreatedAt(input) {
  if (input.created_at !== REQUIRED_PEER_REVIEW_CREATED_AT) {
    throw new Error('Local peer review created_at must remain fixed fixture timestamp');
  }
}

function assertPeerReviewScope(input) {
  if (input.review_scope !== REQUIRED_PEER_REVIEW_SCOPE) {
    throw new Error('Local peer review scope must remain quality review only');
  }
}

function assertPeerReviewAttestation(input) {
  if (input.reviewer_attestation_status !== REQUIRED_PEER_REVIEW_ATTESTATION_STATUS) {
    throw new Error('Local peer review attestation status must remain demo-only');
  }
}

function assertPeerReviewSourceChannel(input) {
  if (input.source_channel !== REQUIRED_PEER_REVIEW_SOURCE_CHANNEL) {
    throw new Error('Local peer review source channel must remain local demo peer review');
  }
}

function assertPeerReviewEvidenceReviewStatus(input) {
  if (input.evidence_review_status !== REQUIRED_PEER_REVIEW_EVIDENCE_REVIEW_STATUS) {
    throw new Error('Local peer review evidence review status must remain local demo pending');
  }
}

function assertPeerReviewPublicationStatus(input) {
  if (input.publication_status !== REQUIRED_PEER_REVIEW_PUBLICATION_STATUS) {
    throw new Error('Local peer review publication status must remain local demo not published');
  }
}

function assertPeerReviewRewardCalculationMode(input) {
  if (input.reward_calculation_mode !== REQUIRED_PEER_REVIEW_REWARD_CALCULATION_MODE) {
    throw new Error('Local peer review reward calculation mode must remain label-only with no token amount');
  }
}

function assertPeerReviewPayoutDestination(input) {
  if (input.payout_destination !== REQUIRED_PEER_REVIEW_PAYOUT_DESTINATION) {
    throw new Error('Local peer review payout destination must remain none_local_demo');
  }
}

function assertPeerReviewPayoutAuthorization(input) {
  if (input.payout_authorization_status !== REQUIRED_PEER_REVIEW_PAYOUT_AUTHORIZATION_STATUS) {
    throw new Error('Local peer review payout authorization must remain not_authorized_local_demo');
  }
}

function assertPeerReviewTransferReference(input) {
  if (input.transfer_reference !== REQUIRED_PEER_REVIEW_TRANSFER_REFERENCE) {
    throw new Error('Local peer review transfer reference must remain none_local_demo');
  }
}

function assertPeerReviewSettlementBatch(input) {
  if (input.settlement_batch_id !== REQUIRED_PEER_REVIEW_SETTLEMENT_BATCH_ID) {
    throw new Error('Local peer review settlement batch must remain none_local_demo');
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
  assertPeerReviewProviderReview(input);
  assertPeerReviewConflictStatus(input);
  assertPeerReviewLabelOnlyFields(input);
  assertPeerReviewScoringLabels(input);
  assertPeerReviewAbuseFlag(input);
  assertLocalDemoEvidenceId(input);
  assertPeerReviewCreatedAt(input);
  assertPeerReviewScope(input);
  assertPeerReviewAttestation(input);
  assertPeerReviewSourceChannel(input);
  assertPeerReviewEvidenceReviewStatus(input);
  assertPeerReviewPublicationStatus(input);
  assertPeerReviewRewardCalculationMode(input);
  assertPeerReviewPayoutDestination(input);
  assertPeerReviewPayoutAuthorization(input);
  assertPeerReviewTransferReference(input);
  assertPeerReviewSettlementBatch(input);

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
    peer_review_provider_review_guard: 'FOUNDER_AND_LEGAL_PROVIDER_REVIEW_REQUIRED',
    peer_review_conflict_status_guard: 'LOCAL_CONFLICT_CHECK_REQUIRED',
    peer_review_label_only_guard: 'LOCAL_REWARD_AND_REPUTATION_LABELS_ONLY',
    peer_review_scoring_label_guard: 'LOCAL_SCORE_AND_RECOMMENDATION_LABELS_ONLY',
    peer_review_abuse_flag_guard: 'LOCAL_ABUSE_REVIEW_REQUIRED',
    peer_review_evidence_prefix_guard: 'LOCAL_DEMO_EVIDENCE_ONLY',
    peer_review_created_at_guard: 'LOCAL_FIXED_FIXTURE_TIMESTAMP_REQUIRED',
    peer_review_scope_guard: 'LOCAL_QUALITY_REVIEW_ONLY',
    peer_review_attestation_guard: 'LOCAL_REVIEWER_ATTESTATION_REQUIRED',
    peer_review_source_channel_guard: 'LOCAL_DEMO_SOURCE_CHANNEL_REQUIRED',
    peer_review_evidence_review_status_guard: 'LOCAL_EVIDENCE_REVIEW_STATUS_REQUIRED',
    peer_review_publication_status_guard: 'LOCAL_PUBLICATION_STATUS_REQUIRED',
    peer_review_reward_calculation_mode_guard: 'LOCAL_REWARD_CALCULATION_MODE_REQUIRED',
    peer_review_payout_destination_guard: 'LOCAL_NO_PAYOUT_DESTINATION_REQUIRED',
    peer_review_payout_authorization_guard: 'LOCAL_NO_PAYOUT_AUTHORIZATION_REQUIRED',
    peer_review_transfer_reference_guard: 'LOCAL_NO_TRANSFER_REFERENCE_REQUIRED',
    peer_review_settlement_batch_guard: 'LOCAL_NO_SETTLEMENT_BATCH_REQUIRED',
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
  review_scope: REQUIRED_PEER_REVIEW_SCOPE,
  reviewer_attestation_status: REQUIRED_PEER_REVIEW_ATTESTATION_STATUS,
  source_channel: REQUIRED_PEER_REVIEW_SOURCE_CHANNEL,
  evidence_review_status: REQUIRED_PEER_REVIEW_EVIDENCE_REVIEW_STATUS,
  publication_status: REQUIRED_PEER_REVIEW_PUBLICATION_STATUS,
  score_label: REQUIRED_PEER_REVIEW_SCORE_LABEL,
  recommendation_label: REQUIRED_PEER_REVIEW_RECOMMENDATION_LABEL,
  abuse_flag: REQUIRED_PEER_REVIEW_ABUSE_FLAG,
  conflict_of_interest_status: REQUIRED_PEER_REVIEW_CONFLICT_STATUS,
  reward_label: REQUIRED_PEER_REVIEW_REWARD_LABEL,
  reward_calculation_mode: REQUIRED_PEER_REVIEW_REWARD_CALCULATION_MODE,
  payout_destination: REQUIRED_PEER_REVIEW_PAYOUT_DESTINATION,
  payout_authorization_status: REQUIRED_PEER_REVIEW_PAYOUT_AUTHORIZATION_STATUS,
  transfer_reference: REQUIRED_PEER_REVIEW_TRANSFER_REFERENCE,
  settlement_batch_id: REQUIRED_PEER_REVIEW_SETTLEMENT_BATCH_ID,
  reputation_impact_label: REQUIRED_PEER_REVIEW_REPUTATION_LABEL,
  safety_gate: REQUIRED_PEER_REVIEW_SAFETY_GATE,
  founder_approval_status: REQUIRED_PEER_REVIEW_FOUNDER_APPROVAL_STATUS,
  legal_provider_status: REQUIRED_PEER_REVIEW_LEGAL_PROVIDER_STATUS,
  created_at: REQUIRED_PEER_REVIEW_CREATED_AT,
}));
