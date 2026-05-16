import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEMO_LOCAL_REPLAY_REVIEW_PROOF } from '../src/smart-contracts/replay/localReplayReviewProof.mjs';
import {
  createLocalReplayFounderPacket,
  DEMO_LOCAL_REPLAY_FOUNDER_PACKET,
  LOCAL_REPLAY_FOUNDER_PACKET_STATUS,
  REQUIRED_LOCAL_REPLAY_FOUNDER_PACKET_FIELDS,
} from '../src/smart-contracts/replay/localReplayFounderPacket.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayFounderPacket.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay founder packet validation failed: ${message}`);
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
  'REQUIRED_LOCAL_REPLAY_FOUNDER_PACKET_FIELDS',
  'LOCAL_REPLAY_FOUNDER_PACKET_STATUS',
  'createLocalReplayFounderPacket',
  'DEMO_LOCAL_REPLAY_FOUNDER_PACKET',
  'FOUNDER_REVIEW_REQUIRED_BEFORE_LIVE',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
  'repayment_failure',
  'real payments, loans, escrow, or token collateral',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_FOUNDER_PACKET',
  'LOCAL_REPLAY_FOUNDER_PACKET_STATUS',
  'REQUIRED_LOCAL_REPLAY_FOUNDER_PACKET_FIELDS',
  'createLocalReplayFounderPacket',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_FOUNDER_PACKET_FIELDS.length < 14) fail('Required founder packet fields are unexpectedly short');
for (const field of REQUIRED_LOCAL_REPLAY_FOUNDER_PACKET_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_FOUNDER_PACKET, field)) fail(`Demo founder packet is missing ${field}`);
}

if (DEMO_LOCAL_REPLAY_FOUNDER_PACKET.digest !== DEMO_LOCAL_REPLAY_REVIEW_PROOF.digest) {
  fail('Demo founder packet digest must match review proof digest');
}
if (DEMO_LOCAL_REPLAY_FOUNDER_PACKET.proof_id !== DEMO_LOCAL_REPLAY_REVIEW_PROOF.proof_id) {
  fail('Demo founder packet proof_id must match review proof');
}
if (!DEMO_LOCAL_REPLAY_FOUNDER_PACKET.module_order.includes('repayment_failure')) {
  fail('Demo founder packet must preserve repayment_failure in module order');
}
if (DEMO_LOCAL_REPLAY_FOUNDER_PACKET.step_count < 7) {
  fail('Demo founder packet must include repayment failure as its own replay step');
}

for (const [field, value] of Object.entries(LOCAL_REPLAY_FOUNDER_PACKET_STATUS)) {
  if (DEMO_LOCAL_REPLAY_FOUNDER_PACKET[field] !== value) fail(`Founder packet status ${field} must stay ${value}`);
}

try {
  createLocalReplayFounderPacket({
    founder_packet_id: 'bad_founder_packet',
    review_proof: { ...DEMO_LOCAL_REPLAY_REVIEW_PROOF, local_only: false },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Founder packet must reject non-local review proof');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local proof error must name local_only');
}

try {
  createLocalReplayFounderPacket({
    founder_packet_id: 'bad_founder_packet',
    review_proof: { ...DEMO_LOCAL_REPLAY_REVIEW_PROOF, pass_fail_status: 'FAIL' },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Founder packet must reject non-PASS_LOCAL_ONLY proof');
} catch (error) {
  if (!String(error.message).includes('PASS_LOCAL_ONLY')) fail('Bad status error must name PASS_LOCAL_ONLY');
}

try {
  createLocalReplayFounderPacket({
    founder_packet_id: 'sk_live_bad_secret_value',
    review_proof: DEMO_LOCAL_REPLAY_REVIEW_PROOF,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Founder packet must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay founder packet validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-founder-packet', contextPath);
assertIncludes(backlog, 'Smart contract local replay founder packet', backlogPath);
assertIncludes(backlog, 'check:smart-contract-local-replay-founder-packet', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay founder packet', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-founder-packet';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_founder_packet: helperPath,
  founder_review_required: true,
}, null, 2));
