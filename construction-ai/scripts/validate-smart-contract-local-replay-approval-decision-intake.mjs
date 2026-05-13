import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT } from '../src/smart-contracts/replay/localReplayApprovalDecisionDraft.mjs';
import {
  createLocalReplayApprovalDecisionIntake,
  DEMO_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE,
  LOCAL_REPLAY_APPROVAL_DECISION_INTAKE_FIELDS,
  LOCAL_REPLAY_APPROVAL_DECISION_INTAKE_STATUS,
  LOCAL_REPLAY_APPROVAL_DECISION_INTAKE_STATES,
  REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE_FIELDS,
} from '../src/smart-contracts/replay/localReplayApprovalDecisionIntake.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayApprovalDecisionIntake.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay approval decision intake validation failed: ${message}`);
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
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE_FIELDS',
  'LOCAL_REPLAY_APPROVAL_DECISION_INTAKE_STATUS',
  'LOCAL_REPLAY_APPROVAL_DECISION_INTAKE_FIELDS',
  'LOCAL_REPLAY_APPROVAL_DECISION_INTAKE_STATES',
  'createLocalReplayApprovalDecisionIntake',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE',
  'INTAKE_ONLY_PENDING_FOUNDER_EXTERNAL_RESPONSE',
  'founder_decision_placeholder',
  'legal_provider_decision_placeholder',
  'finance_provider_decision_placeholder',
  'security_decision_placeholder',
  'xpr_authority_decision_placeholder',
  'no_real_money_test_decision_placeholder',
  'HOLD_FOR_EXTERNAL_REVIEW',
  'REVISE_LOCAL_PACKET',
  'NO_GO_FOR_LIVE',
  'GO_FOR_LIVE',
  'APPROVED_FOR_LIVE',
  'AUTHORIZE_REAL_PAYMENT',
  'AUTHORIZE_REAL_LOAN',
  'AUTHORIZE_REAL_ESCROW',
  'AUTHORIZE_TOKEN_COLLATERAL',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE',
  'LOCAL_REPLAY_APPROVAL_DECISION_INTAKE_FIELDS',
  'LOCAL_REPLAY_APPROVAL_DECISION_INTAKE_STATUS',
  'LOCAL_REPLAY_APPROVAL_DECISION_INTAKE_STATES',
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE_FIELDS',
  'createLocalReplayApprovalDecisionIntake',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE_FIELDS.length < 19) {
  fail('Required approval decision intake fields are unexpectedly short');
}

for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE, field)) {
    fail(`Demo approval decision intake is missing ${field}`);
  }
}

for (const intakeField of [
  'founder_decision_placeholder',
  'legal_provider_decision_placeholder',
  'finance_provider_decision_placeholder',
  'security_decision_placeholder',
  'xpr_authority_decision_placeholder',
  'no_real_money_test_decision_placeholder',
]) {
  if (!LOCAL_REPLAY_APPROVAL_DECISION_INTAKE_FIELDS.includes(intakeField)) {
    fail(`Decision intake fields must include ${intakeField}`);
  }
}

for (const intakeState of [
  'HOLD_FOR_EXTERNAL_REVIEW',
  'REVISE_LOCAL_PACKET',
  'NO_GO_FOR_LIVE',
]) {
  if (!LOCAL_REPLAY_APPROVAL_DECISION_INTAKE_STATES.includes(intakeState)) {
    fail(`Decision intake states must include ${intakeState}`);
  }
}

if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE.approval_decision_draft_id !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT.approval_decision_draft_id) {
  fail('Demo approval decision intake approval_decision_draft_id must match decision draft');
}
if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE.digest !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT.digest) {
  fail('Demo approval decision intake digest must match decision draft digest');
}

for (const [field, value] of Object.entries(LOCAL_REPLAY_APPROVAL_DECISION_INTAKE_STATUS)) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE[field] !== value) {
    fail(`Approval decision intake status ${field} must stay ${value}`);
  }
}

try {
  createLocalReplayApprovalDecisionIntake({
    approval_decision_intake_id: 'bad_approval_decision_intake',
    approval_decision_draft: { ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT, local_only: false },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval decision intake must reject non-local decision draft');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local decision draft error must name local_only');
}

try {
  createLocalReplayApprovalDecisionIntake({
    approval_decision_intake_id: 'bad_approval_decision_intake',
    approval_decision_draft: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT,
    founder_decision: 'GO_FOR_LIVE',
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval decision intake must reject GO_FOR_LIVE');
} catch (error) {
  if (!String(error.message).includes('Blocked live decision')) fail('Blocked live decision error must be explicit');
}

try {
  createLocalReplayApprovalDecisionIntake({
    approval_decision_intake_id: 'sk_live_bad_secret_value',
    approval_decision_draft: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval decision intake must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay approval decision intake validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-approval-decision-intake', contextPath);
assertIncludes(backlog, 'Smart contract local replay approval decision intake', backlogPath);
assertIncludes(backlog, 'check:smart-contract-local-replay-approval-decision-intake', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay approval decision intake', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-approval-decision-intake';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_approval_decision_intake: helperPath,
  intake_status: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE.intake_status,
}, null, 2));
