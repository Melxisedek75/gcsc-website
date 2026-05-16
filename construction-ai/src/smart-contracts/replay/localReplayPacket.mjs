import {
  DEMO_AUDIT_EVENT_FIXTURE,
  serializeSmartContractAuditEvent,
} from '../serialization/auditEventSerialization.mjs';
import { DEMO_AUTHORITY_PAUSE_FIXTURE } from '../state/authorityControlState.mjs';
import { DEMO_COLLATERAL_LTV_FIXTURE } from '../state/collateralEstimateState.mjs';
import { DEMO_ESCROW_RELEASE_RECOMMENDATION_FIXTURE } from '../state/escrowMilestoneState.mjs';
import { DEMO_LOAN_REPAYMENT_WATERFALL_FIXTURE } from '../state/loanLedgerState.mjs';
import { DEMO_PEER_REVIEW_REWARD_FIXTURE } from '../state/peerReviewRewardState.mjs';
import { DEMO_REPAYMENT_FAILURE_STATE_FIXTURE } from '../state/repaymentFailureState.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_FIELDS = Object.freeze([
  'replay_id',
  'request_id',
  'fixture_set',
  'scenario',
  'expected_state',
  'observed_state',
  'audit_event',
  'backend_action',
  'draft_xpr_action',
  'table_name',
  'pass_fail_status',
  'rollback_record_id',
  'founder_approval_status',
  'legal_provider_status',
  'finance_provider_status',
  'security_review_status',
  'created_at',
]);

export const LOCAL_REPLAY_MODULE_ORDER = Object.freeze([
  'authority',
  'project_escrow',
  'loan_ledger',
  'repayment_failure',
  'token_collateral',
  'peer_review',
  'backend_to_chain_map',
]);

export const BLOCKED_LOCAL_REPLAY_FLAGS = Object.freeze({
  live_xpr_deployment_allowed: false,
  real_payment_allowed: false,
  real_loan_allowed: false,
  real_escrow_allowed: false,
  repayment_routing_allowed: false,
  token_collateral_liquidation_allowed: false,
  stablecoin_settlement_allowed: false,
  real_reward_payout_allowed: false,
  ai_final_authority_allowed: false,
});

const FIXTURES = Object.freeze([
  DEMO_AUTHORITY_PAUSE_FIXTURE,
  DEMO_ESCROW_RELEASE_RECOMMENDATION_FIXTURE,
  DEMO_LOAN_REPAYMENT_WATERFALL_FIXTURE,
  DEMO_REPAYMENT_FAILURE_STATE_FIXTURE,
  DEMO_COLLATERAL_LTV_FIXTURE,
  DEMO_PEER_REVIEW_REWARD_FIXTURE,
  DEMO_AUDIT_EVENT_FIXTURE,
]);

function assertPlainLocalValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay field: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertPlainLocalValue(nested, `${path}.${key}`);
    }
  }
}

function assertFixtureSafety(fixture, index) {
  if (!fixture || typeof fixture !== 'object') {
    throw new Error(`Local replay fixture ${index} must be an object`);
  }

  if (!fixture.local_only) {
    throw new Error(`Local replay fixture ${index} must be local_only`);
  }

  if (fixture.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error(`Local replay fixture ${index} must be BLOCKED_FOR_LIVE`);
  }

  assertPlainLocalValue(fixture, `fixture_${index}`);
}

export function createLocalReplayPacket(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay packet input must be an object');
  }

  for (const field of REQUIRED_LOCAL_REPLAY_FIELDS) {
    if (input[field] === undefined || input[field] === null || input[field] === '') {
      throw new Error(`Missing required local replay field: ${field}`);
    }
  }

  if (input.expected_state !== input.observed_state) {
    throw new Error(`Local replay expected_state must match observed_state: ${input.expected_state} != ${input.observed_state}`);
  }

  if (input.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay pass_fail_status must be PASS_LOCAL_ONLY');
  }

  if (input.audit_event?.local_only !== true) {
    throw new Error('Local replay audit_event must be local_only');
  }

  assertPlainLocalValue(input, 'local_replay');
  FIXTURES.forEach(assertFixtureSafety);

  return Object.freeze({
    ...input,
    deployment_status: 'BLOCKED_FOR_LIVE',
    local_only: true,
    replay_packet_only: true,
    fixture_count: FIXTURES.length,
    module_order: LOCAL_REPLAY_MODULE_ORDER,
    fixtures: FIXTURES,
    ...BLOCKED_LOCAL_REPLAY_FLAGS,
  });
}

export const DEMO_LOCAL_REPLAY_PACKET = Object.freeze(createLocalReplayPacket({
  replay_id: 'local_replay_demo_001',
  request_id: 'req_demo_local_replay_001',
  fixture_set: 'smart_contract_no_real_money_fixture_set_001',
  module: 'backend_to_chain_map',
  scenario: 'accepted_bid_to_review_reward_with_repayment_and_collateral_labels',
  expected_state: 'PASS_LOCAL_ONLY',
  observed_state: 'PASS_LOCAL_ONLY',
  audit_event: serializeSmartContractAuditEvent({
    ...DEMO_AUDIT_EVENT_FIXTURE,
    event_id: 'audit_demo_local_replay_001',
    request_id: 'req_demo_local_replay_001',
    action_name: 'localreplay',
    previous_state: 'fixtures_loaded',
    next_state: 'pass_local_only',
  }),
  backend_action: 'local_replay_fixture_validation',
  draft_xpr_action: 'recorddemo',
  table_name: 'audit_events',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  rollback_record_id: 'rollback_not_required_demo_001',
  founder_approval_status: 'required_before_live',
  legal_provider_status: 'required',
  finance_provider_status: 'required',
  security_review_status: 'required',
  created_at: '2026-05-13T00:00:00.000Z',
}));
