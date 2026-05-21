import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  BLOCKED_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_FIXTURE_FLAGS,
  DEMO_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_FIXTURES,
  REPAYMENT_WATERFALL_DRAFT_ENDPOINT_PATH,
  REQUIRED_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_FIXTURE_FIELDS,
  createRepaymentWaterfallDraftEndpointFixtures,
} from '../src/smart-contracts/replay/repaymentWaterfallDraftEndpointFixtures.mjs';

const fixturePath = resolve('src', 'smart-contracts', 'replay', 'repaymentWaterfallDraftEndpointFixtures.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Repayment waterfall draft endpoint fixtures validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.includes(snippet)) fail(`${file} must include: ${snippet}`);
}

const fixtureSource = readRequired(fixturePath);
const indexSource = readRequired(indexPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realAudit = readRequired(realAuditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciValidator = readRequired(ciValidatorPath);

for (const snippet of [
  'REPAYMENT_WATERFALL_DRAFT_ENDPOINT_PATH',
  'REQUIRED_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_FIXTURE_FIELDS',
  'BLOCKED_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_FIXTURE_FLAGS',
  'createRepaymentWaterfallDraftEndpointFixtures',
  'DEMO_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_FIXTURES',
  'DRAFT_REPAYMENT_ALLOCATION',
  'HOLD_FOR_DISPUTE_WINDOW_REVIEW',
  'HOLD_FOR_IDEMPOTENCY_REVIEW',
  'HOLD_FOR_AUTH_RLS_REVIEW',
  'LIVE_STABLECOIN_SETTLEMENT_BLOCKED',
  'LIVE_TOKEN_COLLATERAL_BLOCKED',
  'LIVE_REPAYMENT_ROUTING_BLOCKED',
  'LIVE_ESCROW_CUSTODY_BLOCKED',
  'AI_FINAL_APPROVAL_BLOCKED',
  'BLOCKED_FOR_LIVE',
  'local_only',
  'no real repayment routing',
]) assertIncludes(fixtureSource, snippet, fixturePath);

for (const exportName of [
  'DEMO_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_FIXTURES',
  'REPAYMENT_WATERFALL_DRAFT_ENDPOINT_PATH',
  'createRepaymentWaterfallDraftEndpointFixtures',
]) assertIncludes(indexSource, exportName, indexPath);

if (REPAYMENT_WATERFALL_DRAFT_ENDPOINT_PATH !== '/api/admin/contract-backed-loan/repayment-waterfall/draft') {
  fail('Fixture endpoint path must match the local admin draft endpoint');
}

if (REQUIRED_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_FIXTURE_FIELDS.length < 8) {
  fail('Required fixture fields are unexpectedly short');
}

if (!Array.isArray(DEMO_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_FIXTURES)) {
  fail('Demo endpoint fixtures must be an array');
}

if (DEMO_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_FIXTURES.length < 5) {
  fail('Demo endpoint fixtures must cover allocation, dispute, idempotency, Auth/RLS, and blocked-live cases');
}

const expectedStates = new Set([
  'DRAFT_REPAYMENT_ALLOCATION',
  'HOLD_FOR_DISPUTE_WINDOW_REVIEW',
  'HOLD_FOR_IDEMPOTENCY_REVIEW',
  'HOLD_FOR_AUTH_RLS_REVIEW',
  'LIVE_STABLECOIN_SETTLEMENT_BLOCKED',
  'LIVE_TOKEN_COLLATERAL_BLOCKED',
]);
const observedStates = new Set();

for (const [indexNumber, fixture] of DEMO_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_FIXTURES.entries()) {
  for (const field of REQUIRED_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_FIXTURE_FIELDS) {
    if (!Object.hasOwn(fixture, field)) fail(`Endpoint fixture ${indexNumber} is missing ${field}`);
  }
  if (fixture.path !== REPAYMENT_WATERFALL_DRAFT_ENDPOINT_PATH) fail(`Endpoint fixture ${indexNumber} path drifted`);
  if (fixture.method !== 'POST') fail(`Endpoint fixture ${indexNumber} method must be POST`);
  if (fixture.local_only !== true) fail(`Endpoint fixture ${indexNumber} must stay local_only`);
  if (fixture.blocked_live_gate_status !== 'BLOCKED_FOR_LIVE') fail(`Endpoint fixture ${indexNumber} must be BLOCKED_FOR_LIVE`);
  if (fixture.expected_response_subset?.blocked_live_gate_status !== 'BLOCKED_FOR_LIVE') {
    fail(`Endpoint fixture ${indexNumber} expected response must be BLOCKED_FOR_LIVE`);
  }
  if (fixture.expected_response_subset?.live_repayment_routing_status !== 'LIVE_REPAYMENT_ROUTING_BLOCKED') {
    fail(`Endpoint fixture ${indexNumber} must block live repayment routing`);
  }
  if (fixture.expected_response_subset?.live_escrow_custody_status !== 'LIVE_ESCROW_CUSTODY_BLOCKED') {
    fail(`Endpoint fixture ${indexNumber} must block live escrow custody`);
  }
  if (fixture.expected_response_subset?.ai_final_approval_status !== 'AI_FINAL_APPROVAL_BLOCKED') {
    fail(`Endpoint fixture ${indexNumber} must block AI final approval`);
  }
  observedStates.add(fixture.expected_fixture_state);
}

for (const state of expectedStates) {
  if (!observedStates.has(state)) fail(`Demo endpoint fixtures must cover ${state}`);
}

for (const [flag, value] of Object.entries(BLOCKED_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_FIXTURE_FLAGS)) {
  if (value !== false) fail(`${flag} must be false`);
  for (const fixture of DEMO_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_FIXTURES) {
    if (fixture[flag] !== false) fail(`Endpoint fixture ${fixture.case_id} ${flag} must be false`);
  }
}

try {
  createRepaymentWaterfallDraftEndpointFixtures([
    {
      ...DEMO_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_FIXTURES[0],
      request_body: {
        ...DEMO_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_FIXTURES[0].request_body,
        provider_terms_version: 'sk_live_bad_secret_value',
      },
    },
  ]);
  fail('Endpoint fixtures must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

try {
  createRepaymentWaterfallDraftEndpointFixtures([
    {
      ...DEMO_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_FIXTURES[0],
      expected_response_subset: {
        ...DEMO_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_FIXTURES[0].expected_response_subset,
        live_repayment_routing_status: 'LIVE_REPAYMENT_ROUTING_ENABLED',
      },
    },
  ]);
  fail('Endpoint fixtures must reject live repayment routing');
} catch (error) {
  if (!String(error.message).includes('repayment routing')) fail('Live routing error must name repayment routing');
}

assertIncludes(context, 'Repayment waterfall draft endpoint fixtures validator', contextPath);
assertIncludes(context, 'check:repayment-waterfall-draft-endpoint-fixtures', contextPath);
assertIncludes(backlog, 'Repayment waterfall draft endpoint fixtures', backlogPath);
assertIncludes(backlog, 'check:repayment-waterfall-draft-endpoint-fixtures', backlogPath);
assertIncludes(realAudit, 'Repayment waterfall draft endpoint fixtures', realAuditPath);

const scriptName = 'check:repayment-waterfall-draft-endpoint-fixtures';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  endpoint_fixture_path_checked: fixturePath,
  endpoint_path_checked: REPAYMENT_WATERFALL_DRAFT_ENDPOINT_PATH,
  fixtures_checked: DEMO_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_FIXTURES.length,
  states_checked: [...observedStates].sort(),
  blocked_live_boundaries_checked: true,
}, null, 2));
