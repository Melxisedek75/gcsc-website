import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const serverSource = readFileSync('server.js', 'utf8');

function fail(message) {
  throw new Error(`Repayment waterfall review packet endpoint smoke failed: ${message}`);
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
    "app.get('/api/admin/contract-backed-loan/repayment-waterfall/review-packet'",
    "requireAdminPermissions(['loan_review_prepare'])",
    'DEMO_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET',
    'HOLD_FOR_FOUNDER_LEGAL_PROVIDER_REVIEW',
    'BLOCKED_FOR_LIVE',
    'PASS_LOCAL_ONLY',
    'repayment-waterfall-review-packet',
    'real repayment routing',
    'stablecoin settlement',
    'token collateral lock or liquidation',
  ]) {
    assert(serverSource.includes(snippet), `Missing server coverage snippet: ${snippet}`);
  }
}

assertSourceCoverage();

process.env.VERCEL = '1';

const app = require('../server.js');
const server = app.listen(0);

try {
  await new Promise((resolve) => server.once('listening', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const requestId = 'gcsc-waterfall-review-packet-smoke-123';

  const health = await request(baseUrl, '/api/health');
  assert(health.status === 200, `Expected /api/health 200, got ${health.status}`);
  assert(
    health.body?.features?.includes('repayment-waterfall-review-packet'),
    'Health must advertise repayment-waterfall-review-packet',
  );

  const response = await request(baseUrl, '/api/admin/contract-backed-loan/repayment-waterfall/review-packet', {
    headers: { 'X-Request-Id': requestId },
  });

  assert(response.status === 200, `Expected review packet 200, got ${response.status}`);
  assert(response.headers.get('x-request-id') === requestId, 'Review packet endpoint must echo request id');
  assert(response.body?.request_id === requestId, 'Review packet response must include request_id');
  assert(response.body?.status === 'local_only_review_packet_ready', 'Review packet response status drifted');
  assert(response.body?.review_packet?.status === 'HOLD_FOR_FOUNDER_LEGAL_PROVIDER_REVIEW', 'Review packet must stay held for review');
  assert(response.body?.review_packet?.deployment_status === 'BLOCKED_FOR_LIVE', 'Review packet must stay blocked for live');
  assert(response.body?.review_packet?.pass_fail_status === 'PASS_LOCAL_ONLY', 'Review packet must stay PASS_LOCAL_ONLY');
  assert(response.body?.review_packet?.local_only === true, 'Review packet must stay local_only');
  assert(response.body?.review_packet?.fixture_count >= 6, 'Review packet must expose fixture coverage');
  assert(response.body?.review_packet?.live_repayment_routing_allowed === false, 'Review packet must block live repayment routing');
  assert(response.body?.review_packet?.stablecoin_settlement_allowed === false, 'Review packet must block stablecoin settlement');
  assert(response.body?.review_packet?.token_collateral_allowed === false, 'Review packet must block token collateral');
  assert(response.body?.safe_scope?.some((line) => line.includes('No real repayment routing')), 'Safe scope must block real repayment routing');
  assert(response.body?.blocked_next_action === 'FOUNDER_LEGAL_PROVIDER_SECURITY_REVIEW_REQUIRED', 'Blocked next action drifted');
  assertNoSecretLeak('Review packet response', response.body);

  console.log(JSON.stringify({
    status: 'passed',
    endpoint_checked: '/api/admin/contract-backed-loan/repayment-waterfall/review-packet',
    request_id_checked: requestId,
    fixture_count_checked: response.body.review_packet.fixture_count,
    blocked_live_boundaries_checked: true,
  }, null, 2));
} finally {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}
