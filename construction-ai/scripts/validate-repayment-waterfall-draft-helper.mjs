import {
  BLOCKED_REPAYMENT_WATERFALL_FLAGS,
  DEMO_REPAYMENT_WATERFALL_DRAFT_FIXTURE,
  REPAYMENT_WATERFALL_HOLD_STATES,
  REQUIRED_REPAYMENT_WATERFALL_FIELDS,
  calculateDraftRepaymentWaterfall,
} from '../src/smart-contracts/state/repaymentWaterfallDraft.mjs';

function fail(message) {
  console.error(`Repayment waterfall draft helper validation failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

const baseInput = Object.freeze({
  request_id: 'req_waterfall_helper_001',
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
    request_id: 'req_waterfall_helper_001',
    actor_profile_id: 'profile_founder_local',
  },
});

function calculate(overrides = {}) {
  return calculateDraftRepaymentWaterfall({ ...baseInput, ...overrides });
}

const requiredExports = [
  calculateDraftRepaymentWaterfall,
  DEMO_REPAYMENT_WATERFALL_DRAFT_FIXTURE,
  REQUIRED_REPAYMENT_WATERFALL_FIELDS,
  REPAYMENT_WATERFALL_HOLD_STATES,
  BLOCKED_REPAYMENT_WATERFALL_FLAGS,
];
for (const exportedValue of requiredExports) {
  assert(exportedValue !== undefined, 'required repayment waterfall helper export must exist');
}

for (const requiredField of [
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
]) {
  assert(REQUIRED_REPAYMENT_WATERFALL_FIELDS.includes(requiredField), `missing required field export: ${requiredField}`);
}

for (const holdState of [
  'HOLD_FOR_INPUT_NORMALIZATION_REVIEW',
  'HOLD_FOR_PROVIDER_TERM_REVALIDATION',
  'HOLD_FOR_DISPUTE_WINDOW_REVIEW',
  'HOLD_FOR_OWNER_ACCEPTANCE_REVIEW',
  'HOLD_FOR_RETAINAGE_LIEN_REVIEW',
  'HOLD_FOR_CHANGE_ORDER_REVIEW',
  'HOLD_FOR_NEGATIVE_CONTRACTOR_PAYOUT_REVIEW',
  'LIVE_TOKEN_COLLATERAL_BLOCKED',
  'LIVE_STABLECOIN_SETTLEMENT_BLOCKED',
]) {
  assert(REPAYMENT_WATERFALL_HOLD_STATES.includes(holdState), `missing hold state export: ${holdState}`);
}

for (const [flag, value] of Object.entries(BLOCKED_REPAYMENT_WATERFALL_FLAGS)) {
  assert(value === false, `${flag} must stay false`);
}

const happyPath = calculate();
assert(happyPath.fixture_state === 'DRAFT_REPAYMENT_ALLOCATION', 'happy path must return DRAFT_REPAYMENT_ALLOCATION');
assert(happyPath.approved_loan_repayment === 3000, 'happy path repayment must use requested repayment');
assert(happyPath.contractor_net_payout === 6500, 'happy path contractor net payout must subtract fees and repayment');
assert(happyPath.blocked_live_gate_status === 'BLOCKED_FOR_LIVE', 'happy path must stay BLOCKED_FOR_LIVE');
assert(happyPath.audit_event?.request_id === baseInput.request_id, 'audit event must include request_id');
assert(happyPath.audit_event?.input_hash, 'audit event must include input_hash');
assert(happyPath.audit_event?.output_hash, 'audit event must include output_hash');
assert(happyPath.audit_event?.blocked_live_gate_status === 'BLOCKED_FOR_LIVE', 'audit event must include blocked live gate');

const capsOutstanding = calculate({ requested_repayment: 7000, outstanding_balance: 2500, milestone_repayment_cap: 6000 });
assert(capsOutstanding.approved_loan_repayment === 2500, 'repayment must cap at outstanding balance');

const capsMilestone = calculate({ requested_repayment: 7000, outstanding_balance: 8000, milestone_repayment_cap: 3200 });
assert(capsMilestone.approved_loan_repayment === 3200, 'repayment must cap at milestone limit');

const negativePayout = calculate({ milestone_gross: 1000, approved_platform_fees: 800, requested_repayment: 500 });
assert(negativePayout.fixture_state === 'HOLD_FOR_NEGATIVE_CONTRACTOR_PAYOUT_REVIEW', 'negative contractor payout must hold');
assert(negativePayout.hold_reason?.includes('contractor_net_payout'), 'negative payout hold must explain net payout');

const activeDispute = calculate({ dispute_state: 'active' });
assert(activeDispute.fixture_state === 'HOLD_FOR_DISPUTE_WINDOW_REVIEW', 'active dispute must hold');

const unapprovedMilestone = calculate({ milestone_state: 'unapproved' });
assert(unapprovedMilestone.fixture_state === 'HOLD_FOR_OWNER_ACCEPTANCE_REVIEW', 'unapproved milestone must hold');

const missingProviderTerms = calculate({ provider_approval_state: 'missing' });
assert(missingProviderTerms.fixture_state === 'HOLD_FOR_PROVIDER_TERM_REVALIDATION', 'missing provider terms must hold');

const tokenCollateral = calculate({ token_collateral_dependency: true });
assert(tokenCollateral.fixture_state === 'LIVE_TOKEN_COLLATERAL_BLOCKED', 'token collateral dependency must block');

const stablecoinRoute = calculate({ stablecoin_settlement_dependency: true });
assert(stablecoinRoute.fixture_state === 'LIVE_STABLECOIN_SETTLEMENT_BLOCKED', 'stablecoin dependency must block');

const retainageDraft = calculate({ retainage_holdback: 1000, retainage_clearance_state: 'pending_lien_waiver' });
assert(retainageDraft.fixture_state === 'DRAFT_REPAYMENT_ALLOCATION', 'retainage draft can continue after excluding holdback');
assert(retainageDraft.allocable_amount === 9000, 'retainage holdback must be excluded from allocable amount');
assert(retainageDraft.contractor_net_payout === 5500, 'retainage draft net payout must use reduced allocable amount');

const retainageOverdraw = calculate({ milestone_gross: 500, retainage_holdback: 600, retainage_clearance_state: 'pending_lien_waiver' });
assert(retainageOverdraw.fixture_state === 'HOLD_FOR_RETAINAGE_LIEN_REVIEW', 'retainage overdraw must hold');

const pendingChangeOrder = calculate({ approved_change_order_amount: 500, change_order_state: 'pending' });
assert(pendingChangeOrder.fixture_state === 'HOLD_FOR_CHANGE_ORDER_REVIEW', 'pending change order must hold');

const invalidCurrency = calculate({ requested_repayment: -1 });
assert(invalidCurrency.fixture_state === 'HOLD_FOR_INPUT_NORMALIZATION_REVIEW', 'invalid currency must hold');

assert(DEMO_REPAYMENT_WATERFALL_DRAFT_FIXTURE.local_only === true, 'demo fixture must stay local_only');
assert(DEMO_REPAYMENT_WATERFALL_DRAFT_FIXTURE.deployment_status === 'BLOCKED_FOR_LIVE', 'demo fixture must stay BLOCKED_FOR_LIVE');
assert(DEMO_REPAYMENT_WATERFALL_DRAFT_FIXTURE.real_loan_allowed === false, 'demo fixture must block real loans');
assert(DEMO_REPAYMENT_WATERFALL_DRAFT_FIXTURE.repayment_routing_allowed === false, 'demo fixture must block repayment routing');

console.log(JSON.stringify({
  status: 'passed',
  helper: 'src/smart-contracts/state/repaymentWaterfallDraft.mjs',
  cases_checked: 13,
  blocked_live_flags_checked: Object.keys(BLOCKED_REPAYMENT_WATERFALL_FLAGS).length,
}, null, 2));
