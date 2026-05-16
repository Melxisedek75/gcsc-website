import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER } from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseDecisionRegister.mjs';
import {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionRegisterCloseout,
  DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT,
  LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT_STATUS,
  LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT_ITEMS,
  REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT_FIELDS,
} from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseDecisionRegisterCloseout.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayApprovalDecisionExternalOwnerResponseDecisionRegisterCloseout.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay approval decision external owner response decision register closeout validation failed: ${message}`);
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
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT_FIELDS',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT_ITEMS',
  'createLocalReplayApprovalDecisionExternalOwnerResponseDecisionRegisterCloseout',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT',
  'RESPONSE_DECISION_REGISTER_CLOSEOUT_PENDING_EXTERNAL_DECISIONS',
  'RESPONSE_DECISION_REGISTER_PENDING_EXTERNAL_WRITTEN_DECISIONS',
  'module_order',
  'repayment_failure',
  'external_decision_slots_registered',
  'no_autonomous_live_authority_restated',
  'remaining_external_decision_slots',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT_ITEMS',
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT_FIELDS',
  'createLocalReplayApprovalDecisionExternalOwnerResponseDecisionRegisterCloseout',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT_FIELDS.length < 31) {
  fail('Required approval decision external owner response decision register closeout fields are unexpectedly short');
}

for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT, field)) {
    fail(`Demo approval decision external owner response decision register closeout is missing ${field}`);
  }
}

for (const item of ['external_decision_slots_registered', 'blocked_live_actions_restated', 'allowed_record_states_limited', 'no_autonomous_live_authority_restated']) {
  if (!LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT_ITEMS.includes(item)) fail(`Decision register closeout items must include ${item}`);
}

if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT.approval_decision_external_owner_response_decision_register_id !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER.approval_decision_external_owner_response_decision_register_id) {
  fail('Demo approval decision external owner response decision register closeout register id must match response decision register');
}

if (!DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT.module_order?.includes('repayment_failure')) {
  fail('Demo approval decision external owner response decision register closeout module order must include repayment_failure');
}

if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT.module_order?.join('|') !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER.module_order?.join('|')) {
  fail('Demo approval decision external owner response decision register closeout module order must match response decision register');
}

for (const [field, value] of Object.entries(LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT_STATUS)) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT[field] !== value) {
    fail(`Approval decision external owner response decision register closeout status ${field} must stay ${value}`);
  }
}

for (const blockedState of ['GO_FOR_LIVE', 'LIVE_APPROVED', 'AUTO_APPROVED']) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT.allowed_decision_record_states.includes(blockedState)) {
    fail(`Decision register closeout must not allow ${blockedState}`);
  }
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionRegisterCloseout({
    approval_decision_external_owner_response_decision_register_closeout_id: 'bad_response_decision_register_closeout',
    approval_decision_external_owner_response_decision_register: { ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER, local_only: false },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response decision register closeout must reject non-local decision register');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local decision register error must name local_only');
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionRegisterCloseout({
    approval_decision_external_owner_response_decision_register_closeout_id: 'bad_response_decision_register_closeout_missing_repayment_failure',
    approval_decision_external_owner_response_decision_register: {
      ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER,
      module_order: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER.module_order.filter((moduleName) => moduleName !== 'repayment_failure'),
    },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response decision register closeout must reject decision register missing repayment_failure module coverage');
} catch (error) {
  if (!String(error.message).includes('repayment_failure')) fail('Missing repayment_failure decision register error must name repayment_failure');
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionRegisterCloseout({
    approval_decision_external_owner_response_decision_register_closeout_id: 'sk_live_bad_secret_value',
    approval_decision_external_owner_response_decision_register: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response decision register closeout must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay approval decision external owner response decision register closeout validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-approval-decision-external-owner-response-decision-register-closeout', contextPath);
assertIncludes(backlog, 'Smart contract local replay approval decision external owner response decision register closeout', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay approval decision external owner response decision register closeout', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-approval-decision-external-owner-response-decision-register-closeout';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_approval_decision_external_owner_response_decision_register_closeout: helperPath,
  decision_register_closeout_status: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT.decision_register_closeout_status,
}, null, 2));
