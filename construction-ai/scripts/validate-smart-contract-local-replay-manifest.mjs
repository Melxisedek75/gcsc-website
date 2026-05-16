import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  BLOCKED_REPLAY_SCENARIO_FLAGS,
  DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE,
} from '../src/smart-contracts/replay/localReplayScenarioBundle.mjs';
import {
  createLocalReplayManifest,
  DEMO_LOCAL_REPLAY_MANIFEST,
  REQUIRED_LOCAL_REPLAY_MANIFEST_FIELDS,
} from '../src/smart-contracts/replay/localReplayManifest.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayManifest.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay manifest validation failed: ${message}`);
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
  'REQUIRED_LOCAL_REPLAY_MANIFEST_FIELDS',
  'createLocalReplayManifest',
  'DEMO_LOCAL_REPLAY_MANIFEST',
  'BLOCKED_REPLAY_SCENARIO_FLAGS',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
  'local_only',
  'fixture_count',
  'step_count',
  'module_order',
  'repayment_failure',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_MANIFEST',
  'REQUIRED_LOCAL_REPLAY_MANIFEST_FIELDS',
  'createLocalReplayManifest',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_MANIFEST_FIELDS.length < 11) fail('Required manifest fields are unexpectedly short');
for (const field of REQUIRED_LOCAL_REPLAY_MANIFEST_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_MANIFEST, field)) fail(`Demo manifest is missing ${field}`);
}
if (!DEMO_LOCAL_REPLAY_MANIFEST.local_only) fail('Demo manifest must be local_only');
if (DEMO_LOCAL_REPLAY_MANIFEST.deployment_status !== 'BLOCKED_FOR_LIVE') fail('Demo manifest must be BLOCKED_FOR_LIVE');
if (DEMO_LOCAL_REPLAY_MANIFEST.pass_fail_status !== 'PASS_LOCAL_ONLY') fail('Demo manifest must be PASS_LOCAL_ONLY');
if (DEMO_LOCAL_REPLAY_MANIFEST.step_count !== DEMO_LOCAL_REPLAY_MANIFEST.module_order.length) {
  fail('Demo manifest step count must match module order length');
}
if (DEMO_LOCAL_REPLAY_MANIFEST.fixture_count !== DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE.replay_packet.fixture_count) {
  fail('Demo manifest fixture count must come from the replay packet');
}
if (!DEMO_LOCAL_REPLAY_MANIFEST.module_order.includes('repayment_failure')) {
  fail('Demo manifest must include repayment_failure in module order');
}
if (DEMO_LOCAL_REPLAY_MANIFEST.step_count < 7) {
  fail('Demo manifest must include repayment failure as its own local replay step');
}

for (const [indexNumber, step] of DEMO_LOCAL_REPLAY_MANIFEST.steps.entries()) {
  if (step.sequence !== indexNumber + 1) fail(`Manifest step ${indexNumber} has incorrect sequence`);
  if (step.module !== DEMO_LOCAL_REPLAY_MANIFEST.module_order[indexNumber]) {
    fail(`Manifest step ${indexNumber} must follow module order`);
  }
  if (step.fixture_status !== 'BLOCKED_FOR_LIVE') fail(`Manifest step ${indexNumber} must stay BLOCKED_FOR_LIVE`);
  if (step.expected_result !== 'PASS_LOCAL_ONLY') fail(`Manifest step ${indexNumber} must expect PASS_LOCAL_ONLY`);
}

for (const [flag, value] of Object.entries(BLOCKED_REPLAY_SCENARIO_FLAGS)) {
  if (value !== false) fail(`${flag} must be false`);
  if (DEMO_LOCAL_REPLAY_MANIFEST[flag] !== false) fail(`Demo manifest ${flag} must be false`);
}

try {
  createLocalReplayManifest({
    manifest_id: 'bad_manifest',
    scenario_bundle: { ...DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE, local_only: false },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Manifest must reject non-local scenario bundle');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local bundle error must name local_only');
}

try {
  createLocalReplayManifest({
    manifest_id: 'bad_manifest',
    scenario_bundle: {
      ...DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE,
      steps: DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE.steps.slice(1),
    },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Manifest must reject step count mismatch');
} catch (error) {
  if (!/steps.*module_order/i.test(String(error.message))) fail('Step count error must name module_order');
}

try {
  createLocalReplayManifest({
    manifest_id: 'bad_manifest',
    scenario_bundle: {
      ...DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE,
      steps: [
        ...DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE.steps.slice(0, 1),
        { ...DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE.steps[1], fixture_status: 'LIVE_READY' },
        ...DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE.steps.slice(2),
      ],
    },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Manifest must reject live fixture status');
} catch (error) {
  if (!String(error.message).includes('BLOCKED_FOR_LIVE')) fail('Fixture status error must name BLOCKED_FOR_LIVE');
}

try {
  createLocalReplayManifest({
    manifest_id: 'sk_live_bad_secret_value',
    scenario_bundle: DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Manifest must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay manifest validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-manifest', contextPath);
assertIncludes(backlog, 'Smart contract local replay manifest', backlogPath);
assertIncludes(backlog, 'check:smart-contract-local-replay-manifest', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay manifest', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-manifest';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_manifest: helperPath,
  manifest_steps_checked: DEMO_LOCAL_REPLAY_MANIFEST.step_count,
}, null, 2));
