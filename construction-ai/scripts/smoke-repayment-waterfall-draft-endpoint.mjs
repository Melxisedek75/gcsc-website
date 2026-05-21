import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const serverSource = readFileSync('server.js', 'utf8');

function fail(message) {
  throw new Error(`Repayment waterfall draft endpoint smoke failed: ${message}`);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function assertNoSecretLeak(label, body) {
  const text = JSON.stringify(body || '').toLowerCase();
  for (const forbidden of [
    'supabase_service_role_key',
    'service_role_key',
    'private_key',
    'seed phrase',
    'password',
    'bearer ',
    'sk_live',
    'whsec_',
    'postgresql://',
  ]) {
    assert(!text.includes(forbidden), `${label} must not expose ${forbidden}`);
  }
}

async function readJson(response) {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

async function request(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  return {
    status: response.status,
    headers: response.headers,
    body: await readJson(response),
  };
}

function assertSourceCoverage() {
  for (const snippet of [
    "app.post('/api/admin/contract-backed-loan/repayment-waterfall/draft'",
    "requireAdminPermissions(['loan_review_prepare'])",
    'buildRepaymentWaterfallDraftEndpointHold',
    'calculateDraftRepaymentWaterfall',
    'HOLD_FOR_IDEMPOTENCY_REVIEW',
    'HOLD_FOR_AUTH_RLS_REVIEW',
    'LIVE_REPAYMENT_ROUTING_BLOCKED',
    'LIVE_ESCROW_CUSTODY_BLOCKED',
    'LIVE_STABLECOIN_SETTLEMENT_BLOCKED',
    'LIVE_TOKEN_COLLATERAL_BLOCKED',
    'AI_FINAL_APPROVAL_BLOCKED',
    'no real loan origination',
    'no live repayment routing',
  ]) {
    assert(serverSource.includes(snippet), `Missing server coverage snippet: ${snippet}`);
  }
}

const basePayload = Object.freeze({
  request_id: 'req_waterfall_endpoint_smoke_001',
  idempotency_key: 'idem_waterfall_endpoint_smoke_001',
  actor_profile_id: 'profile_founder_local',
  actor_role: 'founder',
  project_contract_id: 'project_contract_local_001',
  milestone_id: 'milestone_local_001',
  loan_request_id: 'loan_request_local_001',
  provider_terms_version: 'provider_terms_local_v1',
  blocked_live_gate_status: 'BLOCKED_FOR_LIVE',
  calculation_input: {
    request_id: 'req_waterfall_endpoint_smoke_001',
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
      request_id: 'req_waterfall_endpoint_smoke_001',
      actor_profile_id: 'profile_founder_local',
    },
  },
});

function withPayload(overrides = {}) {
  return JSON.stringify({
    ...basePayload,
    ...overrides,
    calculation_input: {
      ...basePayload.calculation_input,
      ...(overrides.calculation_input || {}),
    },
  });
}

assertSourceCoverage();

process.env.VERCEL = '1';

const app = require('../server.js');
const server = app.listen(0);

try {
  await new Promise((resolve) => server.once('listening', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const requestId = 'gcsc-waterfall-endpoint-smoke-123';

  const health = await request(baseUrl, '/api/health');
  assert(health.status === 200, `Expected /api/health 200, got ${health.status}`);
  assert(
    health.body?.features?.includes('repayment-waterfall-draft-review'),
    'Health must advertise repayment-waterfall-draft-review',
  );

  const valid = await request(baseUrl, '/api/admin/contract-backed-loan/repayment-waterfall/draft', {
    method: 'POST',
    headers: { 'X-Request-Id': requestId },
    body: withPayload(),
  });
  assert(valid.status === 201, `Expected valid draft 201, got ${valid.status}`);
  assert(valid.headers.get('x-request-id') === requestId, 'Draft endpoint must echo request id');
  assert(valid.body?.request_id === basePayload.request_id, 'Draft response must include request_id');
  assert(valid.body?.idempotency_key === basePayload.idempotency_key, 'Draft response must include idempotency_key');
  assert(valid.body?.fixture_state === 'DRAFT_REPAYMENT_ALLOCATION', 'Valid draft must allocate locally');
  assert(valid.body?.approved_loan_repayment === 3000, 'Valid draft repayment must match helper result');
  assert(valid.body?.contractor_net_payout === 6500, 'Valid draft net payout must match helper result');
  assert(valid.body?.blocked_live_gate_status === 'BLOCKED_FOR_LIVE', 'Valid draft must stay BLOCKED_FOR_LIVE');
  assert(valid.body?.audit_event_id, 'Valid draft must include audit_event_id');
  assert(valid.body?.audit_event?.input_hash, 'Valid draft must include audit input hash');
  assert(valid.body?.audit_event?.output_hash, 'Valid draft must include audit output hash');
  assert(valid.body?.local_only === true, 'Valid draft must stay local_only');
  assert(valid.body?.real_loan_allowed === false, 'Valid draft must block real loans');
  assert(valid.body?.repayment_routing_allowed === false, 'Valid draft must block repayment routing');
  assert(valid.body?.live_repayment_routing_status === 'LIVE_REPAYMENT_ROUTING_BLOCKED', 'Valid draft must block live routing');
  assert(valid.body?.live_escrow_custody_status === 'LIVE_ESCROW_CUSTODY_BLOCKED', 'Valid draft must block live escrow');
  assert(valid.body?.ai_final_approval_status === 'AI_FINAL_APPROVAL_BLOCKED', 'Valid draft must block AI final approval');
  assertNoSecretLeak('Valid draft response', valid.body);

  const disputeHold = await request(baseUrl, '/api/admin/contract-backed-loan/repayment-waterfall/draft', {
    method: 'POST',
    body: withPayload({
      request_id: 'req_waterfall_endpoint_dispute',
      idempotency_key: 'idem_waterfall_endpoint_dispute',
      calculation_input: {
        request_id: 'req_waterfall_endpoint_dispute',
        dispute_state: 'active',
      },
    }),
  });
  assert(disputeHold.status === 200, `Expected dispute hold 200, got ${disputeHold.status}`);
  assert(disputeHold.body?.fixture_state === 'HOLD_FOR_DISPUTE_WINDOW_REVIEW', 'Active dispute must hold');
  assert(disputeHold.body?.blocked_live_gate_status === 'BLOCKED_FOR_LIVE', 'Dispute hold must stay blocked');
  assertNoSecretLeak('Dispute hold response', disputeHold.body);

  const idempotencyHold = await request(baseUrl, '/api/admin/contract-backed-loan/repayment-waterfall/draft', {
    method: 'POST',
    body: withPayload({
      request_id: 'req_waterfall_endpoint_idem',
      idempotency_key: 'idem_waterfall_endpoint_idem',
      replayed_input_hash: 'different-local-hash',
      calculation_input: {
        request_id: 'req_waterfall_endpoint_idem',
      },
    }),
  });
  assert(idempotencyHold.status === 409, `Expected idempotency hold 409, got ${idempotencyHold.status}`);
  assert(idempotencyHold.body?.fixture_state === 'HOLD_FOR_IDEMPOTENCY_REVIEW', 'Reused idempotency with changed hash must hold');
  assert(idempotencyHold.body?.audit_event_id, 'Idempotency hold must include audit_event_id');
  assertNoSecretLeak('Idempotency hold response', idempotencyHold.body);

  const authHold = await request(baseUrl, '/api/admin/contract-backed-loan/repayment-waterfall/draft', {
    method: 'POST',
    body: withPayload({
      request_id: 'req_waterfall_endpoint_auth',
      idempotency_key: 'idem_waterfall_endpoint_auth',
      actor_profile_id: 'profile_contractor_self_approval_blocked',
      actor_role: 'contractor',
      calculation_input: {
        request_id: 'req_waterfall_endpoint_auth',
      },
    }),
  });
  assert(authHold.status === 403, `Expected auth hold 403, got ${authHold.status}`);
  assert(authHold.body?.fixture_state === 'HOLD_FOR_AUTH_RLS_REVIEW', 'Missing/invalid actor must hold for Auth/RLS review');
  assert(authHold.body?.blocked_live_gate_status === 'BLOCKED_FOR_LIVE', 'Auth hold must stay blocked');
  assertNoSecretLeak('Auth hold response', authHold.body);

  const invalid = await request(baseUrl, '/api/admin/contract-backed-loan/repayment-waterfall/draft', {
    method: 'POST',
    body: JSON.stringify({
      request_id: 'req_waterfall_endpoint_invalid',
      idempotency_key: 'idem_waterfall_endpoint_invalid',
    }),
  });
  assert(invalid.status === 400, `Expected invalid request 400, got ${invalid.status}`);
  assert(invalid.body?.error === 'Validation failed', 'Invalid request must return validation failure');
  assertNoSecretLeak('Invalid response', invalid.body);

  const secret = await request(baseUrl, '/api/admin/contract-backed-loan/repayment-waterfall/draft', {
    method: 'POST',
    body: withPayload({
      request_id: 'req_waterfall_endpoint_secret',
      idempotency_key: 'idem_waterfall_endpoint_secret',
      calculation_input: {
        request_id: 'req_waterfall_endpoint_secret',
        provider_approval_state: 'sk_live_secret_demo_value',
      },
    }),
  });
  assert(secret.status === 400, `Expected secret-looking request 400, got ${secret.status}`);
  assert(secret.body?.details?.some((detail) => detail.includes('secret-looking values')), 'Secret request must explain secret boundary');
  assertNoSecretLeak('Secret response', secret.body);

  console.log(JSON.stringify({
    status: 'passed',
    endpoint_checked: '/api/admin/contract-backed-loan/repayment-waterfall/draft',
    request_id_checked: requestId,
    cases_checked: 6,
    blocked_live_boundaries_checked: true,
  }, null, 2));
} finally {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}
