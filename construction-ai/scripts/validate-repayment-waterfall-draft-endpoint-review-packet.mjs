import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  BLOCKED_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET_FLAGS,
  DEMO_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET,
  REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET_STATUS,
  REQUIRED_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET_FIELDS,
  createRepaymentWaterfallDraftEndpointReviewPacket,
} from '../src/smart-contracts/replay/repaymentWaterfallDraftEndpointReviewPacket.mjs';

const packetPath = resolve('src', 'smart-contracts', 'replay', 'repaymentWaterfallDraftEndpointReviewPacket.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Repayment waterfall draft endpoint review packet validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.includes(snippet)) fail(`${file} must include: ${snippet}`);
}

const packetSource = readRequired(packetPath);
const indexSource = readRequired(indexPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realAudit = readRequired(realAuditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciValidator = readRequired(ciValidatorPath);

for (const snippet of [
  'REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET_STATUS',
  'REQUIRED_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET_FIELDS',
  'BLOCKED_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET_FLAGS',
  'createRepaymentWaterfallDraftEndpointReviewPacket',
  'DEMO_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET',
  'DEMO_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_FIXTURES',
  'HOLD_FOR_FOUNDER_LEGAL_PROVIDER_REVIEW',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
  'DRAFT_REPAYMENT_ALLOCATION',
  'HOLD_FOR_DISPUTE_WINDOW_REVIEW',
  'HOLD_FOR_IDEMPOTENCY_REVIEW',
  'HOLD_FOR_AUTH_RLS_REVIEW',
  'LIVE_STABLECOIN_SETTLEMENT_BLOCKED',
  'LIVE_TOKEN_COLLATERAL_BLOCKED',
  'founder_review',
  'legal_provider_review',
  'finance_provider_review',
  'security_review',
  'no_real_money_test_evidence',
  'real repayment routing',
]) assertIncludes(packetSource, snippet, packetPath);

for (const exportName of [
  'DEMO_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET',
  'REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET_STATUS',
  'createRepaymentWaterfallDraftEndpointReviewPacket',
]) assertIncludes(indexSource, exportName, indexPath);

if (REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET_STATUS !== 'HOLD_FOR_FOUNDER_LEGAL_PROVIDER_REVIEW') {
  fail('Review packet status must hold for founder/legal/provider review');
}

if (REQUIRED_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET_FIELDS.length < 10) {
  fail('Required review packet fields are unexpectedly short');
}

const packet = DEMO_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET;

for (const field of REQUIRED_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET_FIELDS) {
  if (!Object.hasOwn(packet, field)) fail(`Demo review packet is missing ${field}`);
}

if (packet.status !== REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET_STATUS) {
  fail('Demo review packet status drifted');
}
if (packet.local_only !== true) fail('Demo review packet must stay local_only');
if (packet.deployment_status !== 'BLOCKED_FOR_LIVE') fail('Demo review packet must be BLOCKED_FOR_LIVE');
if (packet.pass_fail_status !== 'PASS_LOCAL_ONLY') fail('Demo review packet must stay PASS_LOCAL_ONLY');
if (packet.fixture_count < 6) fail('Demo review packet must include all endpoint fixture cases');
if (packet.endpoint_path !== '/api/admin/contract-backed-loan/repayment-waterfall/draft') {
  fail('Demo review packet endpoint path drifted');
}

for (const state of [
  'DRAFT_REPAYMENT_ALLOCATION',
  'HOLD_FOR_DISPUTE_WINDOW_REVIEW',
  'HOLD_FOR_IDEMPOTENCY_REVIEW',
  'HOLD_FOR_AUTH_RLS_REVIEW',
  'LIVE_STABLECOIN_SETTLEMENT_BLOCKED',
  'LIVE_TOKEN_COLLATERAL_BLOCKED',
]) {
  if (!packet.covered_fixture_states.includes(state)) fail(`Demo review packet must cover ${state}`);
}

for (const gate of [
  'founder_review',
  'legal_provider_review',
  'finance_provider_review',
  'security_review',
  'no_real_money_test_evidence',
]) {
  if (!packet.required_external_review_gates.includes(gate)) fail(`Demo review packet must require ${gate}`);
}

for (const blockedAction of [
  'real repayment routing',
  'real escrow custody',
  'stablecoin settlement',
  'token collateral lock or liquidation',
  'provider API call',
  'money movement',
]) {
  if (!packet.blocked_live_actions.includes(blockedAction)) fail(`Demo review packet must block ${blockedAction}`);
}

for (const [flag, value] of Object.entries(BLOCKED_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET_FLAGS)) {
  if (value !== false) fail(`${flag} must be false`);
  if (packet[flag] !== false) fail(`Demo review packet ${flag} must be false`);
}

try {
  createRepaymentWaterfallDraftEndpointReviewPacket({
    ...packet,
    status: 'GO_FOR_LIVE_REPAYMENT_ROUTING',
  });
  fail('Review packet must reject GO/live statuses');
} catch (error) {
  if (!/status|live/i.test(String(error.message))) fail('GO/live status error must name status or live');
}

try {
  createRepaymentWaterfallDraftEndpointReviewPacket({
    ...packet,
    review_packet_id: 'sk_live_bad_secret_value',
  });
  fail('Review packet must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Repayment waterfall draft endpoint review packet validator', contextPath);
assertIncludes(context, 'check:repayment-waterfall-draft-endpoint-review-packet', contextPath);
assertIncludes(backlog, 'Repayment waterfall draft endpoint review packet', backlogPath);
assertIncludes(backlog, 'check:repayment-waterfall-draft-endpoint-review-packet', backlogPath);
assertIncludes(realAudit, 'Repayment waterfall draft endpoint review packet', realAuditPath);

const scriptName = 'check:repayment-waterfall-draft-endpoint-review-packet';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  review_packet_path_checked: packetPath,
  endpoint_path_checked: packet.endpoint_path,
  fixtures_checked: packet.fixture_count,
  external_review_gates_checked: packet.required_external_review_gates.length,
  blocked_live_boundaries_checked: true,
}, null, 2));
