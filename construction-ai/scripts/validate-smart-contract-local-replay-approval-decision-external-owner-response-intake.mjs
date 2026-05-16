import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE } from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseTemplate.mjs';
import {
  createLocalReplayApprovalDecisionExternalOwnerResponseIntake,
  DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE,
  LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE_STATUS,
  LOCAL_REPLAY_EXTERNAL_OWNER_REQUIRED_CONFIRMATION_FIELDS,
  REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE_FIELDS,
} from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseIntake.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayApprovalDecisionExternalOwnerResponseIntake.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay approval decision external owner response intake validation failed: ${message}`);
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
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE_FIELDS',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_REQUIRED_CONFIRMATION_FIELDS',
  'createLocalReplayApprovalDecisionExternalOwnerResponseIntake',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE',
  'RESPONSE_INTAKE_ONLY_PENDING_EXTERNAL_OWNER_CONFIRMATION',
  'redaction_confirmed',
  'no_secret_confirmed',
  'no_real_money_confirmed',
  'no_live_authority_confirmed',
  'module_order',
  'repayment_failure',
  'HOLD_FOR_EXTERNAL_REVIEW',
  'GO_FOR_LIVE',
  'APPROVED_FOR_LIVE',
  'AUTHORIZE_',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_REQUIRED_CONFIRMATION_FIELDS',
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE_FIELDS',
  'createLocalReplayApprovalDecisionExternalOwnerResponseIntake',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE_FIELDS.length < 27) {
  fail('Required approval decision external owner response intake fields are unexpectedly short');
}

for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE, field)) {
    fail(`Demo approval decision external owner response intake is missing ${field}`);
  }
}

for (const field of ['redaction_confirmed', 'no_secret_confirmed', 'no_real_money_confirmed', 'no_live_authority_confirmed']) {
  if (!LOCAL_REPLAY_EXTERNAL_OWNER_REQUIRED_CONFIRMATION_FIELDS.includes(field)) fail(`Required confirmation fields must include ${field}`);
}

if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE.approval_decision_external_owner_response_template_id !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE.approval_decision_external_owner_response_template_id) {
  fail('Demo approval decision external owner response intake template id must match response template');
}
if (!DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE.module_order?.includes('repayment_failure')) {
  fail('Demo approval decision external owner response intake module_order must include repayment_failure');
}
if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE.module_order?.join('|') !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE.module_order?.join('|')) {
  fail('Demo approval decision external owner response intake module_order must match response template module_order');
}

for (const [field, value] of Object.entries(LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE_STATUS)) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE[field] !== value) {
    fail(`Approval decision external owner response intake status ${field} must stay ${value}`);
  }
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseIntake({
    approval_decision_external_owner_response_intake_id: 'bad_response_intake',
    approval_decision_external_owner_response_template: { ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE, local_only: false },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response intake must reject non-local response template');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local response template error must name local_only');
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseIntake({
    approval_decision_external_owner_response_intake_id: 'bad_response_intake',
    approval_decision_external_owner_response_template: {
      ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE,
      module_order: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE.module_order.filter((moduleName) => moduleName !== 'repayment_failure'),
    },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response intake must reject response template missing repayment_failure module coverage');
} catch (error) {
  if (!String(error.message).includes('repayment_failure')) fail('Missing repayment_failure error must name repayment_failure');
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseIntake({
    approval_decision_external_owner_response_intake_id: 'bad_response_intake',
    approval_decision_external_owner_response_template: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE,
    decision_state: 'GO_FOR_LIVE',
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response intake must reject GO_FOR_LIVE');
} catch (error) {
  if (!String(error.message).includes('Blocked live response')) fail('Blocked live response error must be explicit');
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseIntake({
    approval_decision_external_owner_response_intake_id: 'sk_live_bad_secret_value',
    approval_decision_external_owner_response_template: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response intake must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay approval decision external owner response intake validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-approval-decision-external-owner-response-intake', contextPath);
assertIncludes(backlog, 'Smart contract local replay approval decision external owner response intake', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay approval decision external owner response intake', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-approval-decision-external-owner-response-intake';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_approval_decision_external_owner_response_intake: helperPath,
  response_intake_status: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE.response_intake_status,
}, null, 2));
