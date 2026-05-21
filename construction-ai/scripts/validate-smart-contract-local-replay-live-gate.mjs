import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEMO_LOCAL_REPLAY_FOUNDER_PACKET } from '../src/smart-contracts/replay/localReplayFounderPacket.mjs';
import {
  createLocalReplayLiveGate,
  DEMO_LOCAL_REPLAY_LIVE_GATE,
  LOCAL_REPLAY_LIVE_GATE_STATUS,
  REQUIRED_LOCAL_REPLAY_LIVE_GATE_FIELDS,
} from '../src/smart-contracts/replay/localReplayLiveGate.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayLiveGate.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay live gate validation failed: ${message}`);
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
  'REQUIRED_LOCAL_REPLAY_LIVE_GATE_FIELDS',
  'LOCAL_REPLAY_LIVE_GATE_STATUS',
  'createLocalReplayLiveGate',
  'DEMO_LOCAL_REPLAY_LIVE_GATE',
  'HOLD_FOR_FOUNDER_LEGAL_PROVIDER_SECURITY_REVIEW',
  'module_order',
  'repayment_failure',
  'adverse_action',
  'founder approval',
  'legal/provider review',
  'finance provider review',
  'security review',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_LIVE_GATE',
  'LOCAL_REPLAY_LIVE_GATE_STATUS',
  'REQUIRED_LOCAL_REPLAY_LIVE_GATE_FIELDS',
  'createLocalReplayLiveGate',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_LIVE_GATE_FIELDS.length < 13) fail('Required live gate fields are unexpectedly short');
for (const field of REQUIRED_LOCAL_REPLAY_LIVE_GATE_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_LIVE_GATE, field)) fail(`Demo live gate is missing ${field}`);
}

if (DEMO_LOCAL_REPLAY_LIVE_GATE.founder_packet_id !== DEMO_LOCAL_REPLAY_FOUNDER_PACKET.founder_packet_id) {
  fail('Demo live gate founder_packet_id must match founder packet');
}
if (DEMO_LOCAL_REPLAY_LIVE_GATE.digest !== DEMO_LOCAL_REPLAY_FOUNDER_PACKET.digest) {
  fail('Demo live gate digest must match founder packet digest');
}
if (!DEMO_LOCAL_REPLAY_LIVE_GATE.module_order?.includes('repayment_failure')) {
  fail('Demo live gate module_order must include repayment_failure');
}
if (!DEMO_LOCAL_REPLAY_LIVE_GATE.module_order?.includes('adverse_action')) {
  fail('Demo live gate module_order must include adverse_action');
}
if (DEMO_LOCAL_REPLAY_LIVE_GATE.module_order?.join('|') !== DEMO_LOCAL_REPLAY_FOUNDER_PACKET.module_order?.join('|')) {
  fail('Demo live gate module_order must match founder packet module_order');
}

for (const [field, value] of Object.entries(LOCAL_REPLAY_LIVE_GATE_STATUS)) {
  if (Array.isArray(value)) {
    if (DEMO_LOCAL_REPLAY_LIVE_GATE[field].join('|') !== value.join('|')) fail(`Live gate status ${field} must stay stable`);
  } else if (DEMO_LOCAL_REPLAY_LIVE_GATE[field] !== value) {
    fail(`Live gate status ${field} must stay ${value}`);
  }
}

try {
  createLocalReplayLiveGate({
    live_gate_id: 'bad_live_gate',
    founder_packet: { ...DEMO_LOCAL_REPLAY_FOUNDER_PACKET, local_only: false },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Live gate must reject non-local founder packet');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local founder packet error must name local_only');
}

try {
  createLocalReplayLiveGate({
    live_gate_id: 'bad_live_gate',
    founder_packet: { ...DEMO_LOCAL_REPLAY_FOUNDER_PACKET, deployment_status: 'READY_FOR_LIVE' },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Live gate must reject live-ready founder packet');
} catch (error) {
  if (!String(error.message).includes('BLOCKED_FOR_LIVE')) fail('Bad deployment status error must name BLOCKED_FOR_LIVE');
}

try {
  createLocalReplayLiveGate({
    live_gate_id: 'bad_live_gate',
    founder_packet: {
      ...DEMO_LOCAL_REPLAY_FOUNDER_PACKET,
      module_order: DEMO_LOCAL_REPLAY_FOUNDER_PACKET.module_order.filter((moduleName) => moduleName !== 'repayment_failure'),
    },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Live gate must reject founder packet without repayment_failure coverage');
} catch (error) {
  if (!String(error.message).includes('repayment_failure')) fail('Missing repayment_failure error must name repayment_failure');
}

try {
  createLocalReplayLiveGate({
    live_gate_id: 'bad_live_gate',
    founder_packet: {
      ...DEMO_LOCAL_REPLAY_FOUNDER_PACKET,
      module_order: DEMO_LOCAL_REPLAY_FOUNDER_PACKET.module_order.filter((moduleName) => moduleName !== 'adverse_action'),
    },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Live gate must reject founder packet without adverse_action coverage');
} catch (error) {
  if (!String(error.message).includes('adverse_action')) fail('Missing adverse_action error must name adverse_action');
}

try {
  createLocalReplayLiveGate({
    live_gate_id: 'sk_live_bad_secret_value',
    founder_packet: DEMO_LOCAL_REPLAY_FOUNDER_PACKET,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Live gate must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay live gate validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-live-gate', contextPath);
assertIncludes(backlog, 'Smart contract local replay live gate', backlogPath);
assertIncludes(backlog, 'check:smart-contract-local-replay-live-gate', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay live gate', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-live-gate';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_live_gate: helperPath,
  live_gate_status: DEMO_LOCAL_REPLAY_LIVE_GATE.live_gate_status,
}, null, 2));
