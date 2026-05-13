import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE } from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseIntake.mjs';
import {
  createLocalReplayApprovalDecisionExternalOwnerResponseSummary,
  DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY,
  LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY_STATUS,
  LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_SUMMARY_ALLOWED_NEXT_LOCAL_ACTIONS,
  REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY_FIELDS,
} from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseSummary.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayApprovalDecisionExternalOwnerResponseSummary.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay approval decision external owner response summary validation failed: ${message}`);
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
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY_FIELDS',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_SUMMARY_ALLOWED_NEXT_LOCAL_ACTIONS',
  'createLocalReplayApprovalDecisionExternalOwnerResponseSummary',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY',
  'RESPONSE_SUMMARY_ONLY_PENDING_MANUAL_REVIEW',
  'RESPONSE_INTAKE_ONLY_PENDING_EXTERNAL_OWNER_CONFIRMATION',
  'record_external_owner_hold_note',
  'prepare_local_packet_revision',
  'prepare_no_go_closeout_note',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_SUMMARY_ALLOWED_NEXT_LOCAL_ACTIONS',
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY_FIELDS',
  'createLocalReplayApprovalDecisionExternalOwnerResponseSummary',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY_FIELDS.length < 26) {
  fail('Required approval decision external owner response summary fields are unexpectedly short');
}

for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY, field)) {
    fail(`Demo approval decision external owner response summary is missing ${field}`);
  }
}

for (const action of ['record_external_owner_hold_note', 'prepare_local_packet_revision', 'prepare_no_go_closeout_note']) {
  if (!LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_SUMMARY_ALLOWED_NEXT_LOCAL_ACTIONS.includes(action)) {
    fail(`Allowed next local actions must include ${action}`);
  }
}

if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY.approval_decision_external_owner_response_intake_id !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE.approval_decision_external_owner_response_intake_id) {
  fail('Demo approval decision external owner response summary intake id must match response intake');
}

for (const [field, value] of Object.entries(LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY_STATUS)) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY[field] !== value) {
    fail(`Approval decision external owner response summary status ${field} must stay ${value}`);
  }
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseSummary({
    approval_decision_external_owner_response_summary_id: 'bad_response_summary',
    approval_decision_external_owner_response_intake: { ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE, local_only: false },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response summary must reject non-local response intake');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local response intake error must name local_only');
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseSummary({
    approval_decision_external_owner_response_summary_id: 'sk_live_bad_secret_value',
    approval_decision_external_owner_response_intake: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response summary must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay approval decision external owner response summary validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-approval-decision-external-owner-response-summary', contextPath);
assertIncludes(backlog, 'Smart contract local replay approval decision external owner response summary', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay approval decision external owner response summary', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-approval-decision-external-owner-response-summary';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_approval_decision_external_owner_response_summary: helperPath,
  summary_status: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY.summary_status,
}, null, 2));
