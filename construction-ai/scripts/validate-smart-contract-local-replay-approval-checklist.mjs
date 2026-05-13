import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEMO_LOCAL_REPLAY_LIVE_GATE } from '../src/smart-contracts/replay/localReplayLiveGate.mjs';
import {
  createLocalReplayApprovalChecklist,
  DEMO_LOCAL_REPLAY_APPROVAL_CHECKLIST,
  LOCAL_REPLAY_APPROVAL_CHECKLIST_STATUS,
  REQUIRED_LOCAL_REPLAY_APPROVAL_CHECKLIST_FIELDS,
  REQUIRED_LOCAL_REPLAY_APPROVALS,
} from '../src/smart-contracts/replay/localReplayApprovalChecklist.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayApprovalChecklist.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay approval checklist validation failed: ${message}`);
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
  'REQUIRED_LOCAL_REPLAY_APPROVAL_CHECKLIST_FIELDS',
  'LOCAL_REPLAY_APPROVAL_CHECKLIST_STATUS',
  'REQUIRED_LOCAL_REPLAY_APPROVALS',
  'createLocalReplayApprovalChecklist',
  'DEMO_LOCAL_REPLAY_APPROVAL_CHECKLIST',
  'PENDING_EXTERNAL_APPROVALS',
  'founder_approval_pending',
  'legal_provider_review_pending',
  'finance_provider_review_pending',
  'security_review_pending',
  'xpr_authority_setup_pending',
  'no_real_money_test_evidence_pending',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_APPROVAL_CHECKLIST',
  'LOCAL_REPLAY_APPROVAL_CHECKLIST_STATUS',
  'REQUIRED_LOCAL_REPLAY_APPROVAL_CHECKLIST_FIELDS',
  'REQUIRED_LOCAL_REPLAY_APPROVALS',
  'createLocalReplayApprovalChecklist',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_APPROVAL_CHECKLIST_FIELDS.length < 13) {
  fail('Required approval checklist fields are unexpectedly short');
}

for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_CHECKLIST_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_APPROVAL_CHECKLIST, field)) {
    fail(`Demo approval checklist is missing ${field}`);
  }
}

for (const requiredApproval of [
  'founder_approval_pending',
  'legal_provider_review_pending',
  'finance_provider_review_pending',
  'security_review_pending',
  'xpr_authority_setup_pending',
  'no_real_money_test_evidence_pending',
]) {
  if (!REQUIRED_LOCAL_REPLAY_APPROVALS.includes(requiredApproval)) {
    fail(`Required approvals must include ${requiredApproval}`);
  }
}

if (DEMO_LOCAL_REPLAY_APPROVAL_CHECKLIST.live_gate_id !== DEMO_LOCAL_REPLAY_LIVE_GATE.live_gate_id) {
  fail('Demo approval checklist live_gate_id must match live gate');
}
if (DEMO_LOCAL_REPLAY_APPROVAL_CHECKLIST.digest !== DEMO_LOCAL_REPLAY_LIVE_GATE.digest) {
  fail('Demo approval checklist digest must match live gate digest');
}

for (const [field, value] of Object.entries(LOCAL_REPLAY_APPROVAL_CHECKLIST_STATUS)) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_CHECKLIST[field] !== value) {
    fail(`Approval checklist status ${field} must stay ${value}`);
  }
}

try {
  createLocalReplayApprovalChecklist({
    approval_checklist_id: 'bad_approval_checklist',
    live_gate: { ...DEMO_LOCAL_REPLAY_LIVE_GATE, local_only: false },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval checklist must reject non-local live gate');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local live gate error must name local_only');
}

try {
  createLocalReplayApprovalChecklist({
    approval_checklist_id: 'bad_approval_checklist',
    live_gate: { ...DEMO_LOCAL_REPLAY_LIVE_GATE, deployment_status: 'READY_FOR_LIVE' },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval checklist must reject live-ready gate');
} catch (error) {
  if (!String(error.message).includes('BLOCKED_FOR_LIVE')) fail('Bad deployment status error must name BLOCKED_FOR_LIVE');
}

try {
  createLocalReplayApprovalChecklist({
    approval_checklist_id: 'sk_live_bad_secret_value',
    live_gate: DEMO_LOCAL_REPLAY_LIVE_GATE,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval checklist must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay approval checklist validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-approval-checklist', contextPath);
assertIncludes(backlog, 'Smart contract local replay approval checklist', backlogPath);
assertIncludes(backlog, 'check:smart-contract-local-replay-approval-checklist', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay approval checklist', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-approval-checklist';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_approval_checklist: helperPath,
  approval_status: DEMO_LOCAL_REPLAY_APPROVAL_CHECKLIST.approval_status,
}, null, 2));
