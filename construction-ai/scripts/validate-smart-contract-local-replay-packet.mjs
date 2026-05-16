import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  BLOCKED_LOCAL_REPLAY_FLAGS,
  createLocalReplayPacket,
  DEMO_LOCAL_REPLAY_PACKET,
  LOCAL_REPLAY_MODULE_ORDER,
  REQUIRED_LOCAL_REPLAY_FIELDS,
} from '../src/smart-contracts/replay/localReplayPacket.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayPacket.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay packet validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const helper = readRequired(helperPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realAudit = readRequired(realAuditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciValidator = readRequired(ciValidatorPath);

for (const required of [
  'REQUIRED_LOCAL_REPLAY_FIELDS',
  'LOCAL_REPLAY_MODULE_ORDER',
  'DEMO_REPAYMENT_FAILURE_STATE_FIXTURE',
  'BLOCKED_LOCAL_REPLAY_FLAGS',
  'createLocalReplayPacket',
  'DEMO_LOCAL_REPLAY_PACKET',
  'replay_packet_only',
  'PASS_LOCAL_ONLY',
  'BLOCKED_FOR_LIVE',
  'live_xpr_deployment_allowed',
  'real_payment_allowed',
  'real_loan_allowed',
  'real_escrow_allowed',
  'repayment_failure',
  'repayment_routing_allowed',
  'token_collateral_liquidation_allowed',
  'stablecoin_settlement_allowed',
  'real_reward_payout_allowed',
  'ai_final_authority_allowed',
]) assertIncludes(helper, required, helperPath);

if (REQUIRED_LOCAL_REPLAY_FIELDS.length < 17) fail('Required local replay field list is unexpectedly short');
if (!LOCAL_REPLAY_MODULE_ORDER.includes('backend_to_chain_map')) fail('backend_to_chain_map must be in replay module order');
if (!LOCAL_REPLAY_MODULE_ORDER.includes('repayment_failure')) fail('repayment_failure must be in replay module order');

for (const field of REQUIRED_LOCAL_REPLAY_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_PACKET, field)) fail(`Demo local replay packet is missing ${field}`);
}

if (!DEMO_LOCAL_REPLAY_PACKET.local_only) fail('Demo local replay packet must be local_only');
if (DEMO_LOCAL_REPLAY_PACKET.deployment_status !== 'BLOCKED_FOR_LIVE') fail('Demo local replay packet must be BLOCKED_FOR_LIVE');
if (!DEMO_LOCAL_REPLAY_PACKET.replay_packet_only) fail('Demo local replay packet must be replay packet only');
if (DEMO_LOCAL_REPLAY_PACKET.fixture_count < 7) fail('Demo local replay packet must include repayment failure and all module fixtures');
if (!DEMO_LOCAL_REPLAY_PACKET.fixtures.some((fixture) => fixture.module === 'repayment_failure_state')) {
  fail('Demo local replay packet must include the repayment failure fixture');
}

for (const fixture of DEMO_LOCAL_REPLAY_PACKET.fixtures) {
  if (!fixture.local_only) fail('Every replay fixture must be local_only');
  if (fixture.deployment_status !== 'BLOCKED_FOR_LIVE') fail('Every replay fixture must be BLOCKED_FOR_LIVE');
}

for (const [flag, value] of Object.entries(BLOCKED_LOCAL_REPLAY_FLAGS)) {
  if (value !== false) fail(`${flag} must be false`);
  if (DEMO_LOCAL_REPLAY_PACKET[flag] !== false) fail(`Demo replay packet ${flag} must be false`);
}

try {
  createLocalReplayPacket({ ...DEMO_LOCAL_REPLAY_PACKET, request_id: '' });
  fail('Local replay packet must reject missing request_id');
} catch (error) {
  if (!String(error.message).includes('request_id')) fail('Missing request_id error must name request_id');
}

try {
  createLocalReplayPacket({ ...DEMO_LOCAL_REPLAY_PACKET, expected_state: 'PASS_LOCAL_ONLY', observed_state: 'FAIL' });
  fail('Local replay packet must reject state mismatches');
} catch (error) {
  if (!String(error.message).includes('expected_state')) fail('State mismatch error must name expected_state');
}

try {
  createLocalReplayPacket({ ...DEMO_LOCAL_REPLAY_PACKET, backend_action: 'sk_live_demo_secret_value' });
  fail('Local replay packet must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay packet validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-packet', contextPath);
assertIncludes(backlog, 'Smart contract local replay packet', backlogPath);
assertIncludes(backlog, 'check:smart-contract-local-replay-packet', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay packet', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-packet';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_packet: helperPath,
  required_fields_checked: REQUIRED_LOCAL_REPLAY_FIELDS.length,
  fixtures_checked: DEMO_LOCAL_REPLAY_PACKET.fixture_count,
}, null, 2));
