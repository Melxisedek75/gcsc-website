import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  BLOCKED_REPLAY_SCENARIO_FLAGS,
  createLocalReplayScenarioBundle,
  DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE,
  REQUIRED_REPLAY_SCENARIO_STEP_FIELDS,
} from '../src/smart-contracts/replay/localReplayScenarioBundle.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayScenarioBundle.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay scenario bundle validation failed: ${message}`);
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
const index = readRequired(indexPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realAudit = readRequired(realAuditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciValidator = readRequired(ciValidatorPath);

for (const required of [
  'REQUIRED_REPLAY_SCENARIO_STEP_FIELDS',
  'BLOCKED_REPLAY_SCENARIO_FLAGS',
  'createLocalReplayScenarioBundle',
  'DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE',
  'LOCAL_REPLAY_MODULE_ORDER',
  'repayment_failure',
  'adverse_action',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
  'live_xpr_deployment_allowed',
  'real_payment_allowed',
  'real_loan_allowed',
  'real_escrow_allowed',
  'repayment_routing_allowed',
  'token_collateral_liquidation_allowed',
  'stablecoin_settlement_allowed',
  'real_reward_payout_allowed',
  'ai_final_authority_allowed',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE',
  'REQUIRED_REPLAY_SCENARIO_STEP_FIELDS',
  'createLocalReplayScenarioBundle',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_REPLAY_SCENARIO_STEP_FIELDS.length < 6) fail('Required replay scenario step fields are unexpectedly short');
if (!DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE.local_only) fail('Demo replay scenario bundle must be local_only');
if (DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE.deployment_status !== 'BLOCKED_FOR_LIVE') {
  fail('Demo replay scenario bundle must be BLOCKED_FOR_LIVE');
}
if (DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE.pass_fail_status !== 'PASS_LOCAL_ONLY') {
  fail('Demo replay scenario bundle must be PASS_LOCAL_ONLY');
}
if (DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE.step_count !== DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE.module_order.length) {
  fail('Demo replay scenario step count must match module order length');
}
if (!DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE.module_order.includes('repayment_failure')) {
  fail('Demo replay scenario bundle must include repayment_failure in module order');
}
if (!DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE.module_order.includes('adverse_action')) {
  fail('Demo replay scenario bundle must include adverse_action in module order');
}
if (DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE.step_count < 8) {
  fail('Demo replay scenario bundle must include repayment failure and adverse action as local replay steps');
}

for (const [indexNumber, step] of DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE.steps.entries()) {
  for (const field of REQUIRED_REPLAY_SCENARIO_STEP_FIELDS) {
    if (!Object.hasOwn(step, field)) fail(`Scenario step ${indexNumber} is missing ${field}`);
  }
  if (step.sequence !== indexNumber + 1) fail(`Scenario step ${indexNumber} has incorrect sequence`);
  if (step.module !== DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE.module_order[indexNumber]) {
    fail(`Scenario step ${indexNumber} must follow module order`);
  }
  if (step.fixture_status !== 'BLOCKED_FOR_LIVE') fail(`Scenario step ${indexNumber} must stay BLOCKED_FOR_LIVE`);
  if (step.expected_result !== 'PASS_LOCAL_ONLY') fail(`Scenario step ${indexNumber} must expect PASS_LOCAL_ONLY`);
}

for (const [flag, value] of Object.entries(BLOCKED_REPLAY_SCENARIO_FLAGS)) {
  if (value !== false) fail(`${flag} must be false`);
  if (DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE[flag] !== false) fail(`Demo replay scenario bundle ${flag} must be false`);
}

try {
  createLocalReplayScenarioBundle({
    ...DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE,
    steps: [...DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE.steps].reverse(),
  });
  fail('Replay scenario bundle must reject out-of-order steps');
} catch (error) {
  if (!/module.*order/i.test(String(error.message))) fail('Out-of-order error must name module order');
}

try {
  createLocalReplayScenarioBundle({
    ...DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE,
    replay_packet: { ...DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE.replay_packet, local_only: false },
  });
  fail('Replay scenario bundle must reject non-local replay packet');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local packet error must name local_only');
}

try {
  createLocalReplayScenarioBundle({
    ...DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE,
    steps: [
      ...DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE.steps.slice(0, 1),
      { ...DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE.steps[1], step_id: 'sk_live_bad_secret_value' },
      ...DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE.steps.slice(2),
    ],
  });
  fail('Replay scenario bundle must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay scenario bundle validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-scenario-bundle', contextPath);
assertIncludes(backlog, 'Smart contract local replay scenario bundle', backlogPath);
assertIncludes(backlog, 'check:smart-contract-local-replay-scenario-bundle', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay scenario bundle', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-scenario-bundle';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_scenario_bundle: helperPath,
  steps_checked: DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE.step_count,
}, null, 2));
