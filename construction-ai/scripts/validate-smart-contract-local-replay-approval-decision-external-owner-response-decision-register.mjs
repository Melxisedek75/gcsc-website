import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT } from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseHandoffCloseout.mjs';
import {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionRegister,
  DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER,
  LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_STATUS,
  LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_ALLOWED_STATES,
  LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_REQUIRED_SLOTS,
  REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_FIELDS,
} from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseDecisionRegister.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayApprovalDecisionExternalOwnerResponseDecisionRegister.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay approval decision external owner response decision register validation failed: ${message}`);
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
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_FIELDS',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_REQUIRED_SLOTS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_ALLOWED_STATES',
  'createLocalReplayApprovalDecisionExternalOwnerResponseDecisionRegister',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER',
  'RESPONSE_DECISION_REGISTER_PENDING_EXTERNAL_WRITTEN_DECISIONS',
  'RESPONSE_HANDOFF_CLOSEOUT_ONLY_PENDING_EXTERNAL_DECISIONS',
  'module_order',
  'repayment_failure',
  'founder_written_decision_record',
  'xpr_authority_owner_written_decision_record',
  'PENDING_EXTERNAL_REVIEW',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_REQUIRED_SLOTS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_ALLOWED_STATES',
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_FIELDS',
  'createLocalReplayApprovalDecisionExternalOwnerResponseDecisionRegister',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_FIELDS.length < 31) {
  fail('Required approval decision external owner response decision register fields are unexpectedly short');
}

for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER, field)) {
    fail(`Demo approval decision external owner response decision register is missing ${field}`);
  }
}

for (const slot of ['founder_written_decision_record', 'legal_provider_written_decision_record', 'finance_provider_written_decision_record', 'security_written_decision_record', 'xpr_authority_owner_written_decision_record']) {
  if (!LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_REQUIRED_SLOTS.includes(slot)) {
    fail(`Decision register required slots must include ${slot}`);
  }
  if (!DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER.pending_external_decision_slots.includes(slot)) {
    fail(`Decision register pending slots must include ${slot}`);
  }
}

for (const state of ['PENDING_EXTERNAL_REVIEW', 'HOLD', 'REVISE', 'NO_GO']) {
  if (!LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_ALLOWED_STATES.includes(state)) {
    fail(`Decision register allowed states must include ${state}`);
  }
}

for (const blockedState of ['GO_FOR_LIVE', 'LIVE_APPROVED', 'AUTO_APPROVED']) {
  if (LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_ALLOWED_STATES.includes(blockedState)) {
    fail(`Decision register must not allow ${blockedState}`);
  }
}

if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER.approval_decision_external_owner_response_handoff_closeout_id !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT.approval_decision_external_owner_response_handoff_closeout_id) {
  fail('Demo approval decision external owner response decision register closeout id must match response handoff closeout');
}

if (!DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER.module_order?.includes('repayment_failure')) {
  fail('Demo approval decision external owner response decision register module order must include repayment_failure');
}

if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER.module_order?.join('|') !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT.module_order?.join('|')) {
  fail('Demo approval decision external owner response decision register module order must match response handoff closeout');
}

for (const [field, value] of Object.entries(LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_STATUS)) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER[field] !== value) {
    fail(`Approval decision external owner response decision register status ${field} must stay ${value}`);
  }
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionRegister({
    approval_decision_external_owner_response_decision_register_id: 'bad_response_decision_register',
    approval_decision_external_owner_response_handoff_closeout: { ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT, local_only: false },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response decision register must reject non-local handoff closeout');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local handoff closeout error must name local_only');
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionRegister({
    approval_decision_external_owner_response_decision_register_id: 'bad_response_decision_register_missing_repayment_failure',
    approval_decision_external_owner_response_handoff_closeout: {
      ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT,
      module_order: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT.module_order.filter((moduleName) => moduleName !== 'repayment_failure'),
    },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response decision register must reject handoff closeout missing repayment_failure module coverage');
} catch (error) {
  if (!String(error.message).includes('repayment_failure')) fail('Missing repayment_failure handoff closeout error must name repayment_failure');
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionRegister({
    approval_decision_external_owner_response_decision_register_id: 'sk_live_bad_secret_value',
    approval_decision_external_owner_response_handoff_closeout: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response decision register must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay approval decision external owner response decision register validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-approval-decision-external-owner-response-decision-register', contextPath);
assertIncludes(backlog, 'Smart contract local replay approval decision external owner response decision register', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay approval decision external owner response decision register', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-approval-decision-external-owner-response-decision-register';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_approval_decision_external_owner_response_decision_register: helperPath,
  decision_register_status: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER.decision_register_status,
}, null, 2));
