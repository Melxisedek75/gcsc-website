import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  createLocalReplayApprovalDecisionExternalOwnerResponseTemplate,
  DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE,
  LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE_STATUS,
  LOCAL_REPLAY_EXTERNAL_OWNER_ALLOWED_RESPONSE_STATES,
  LOCAL_REPLAY_EXTERNAL_OWNER_BLOCKED_RESPONSE_STATES,
  LOCAL_REPLAY_EXTERNAL_OWNER_REQUIRED_RESPONSE_FIELDS,
  REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE_FIELDS,
} from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseTemplate.mjs';
import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET } from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerPacket.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayApprovalDecisionExternalOwnerResponseTemplate.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay approval decision external owner response template validation failed: ${message}`);
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
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE_FIELDS',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_ALLOWED_RESPONSE_STATES',
  'LOCAL_REPLAY_EXTERNAL_OWNER_BLOCKED_RESPONSE_STATES',
  'LOCAL_REPLAY_EXTERNAL_OWNER_REQUIRED_RESPONSE_FIELDS',
  'createLocalReplayApprovalDecisionExternalOwnerResponseTemplate',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE',
  'RESPONSE_TEMPLATE_ONLY_PENDING_EXTERNAL_OWNER_INPUT',
  'HOLD_FOR_EXTERNAL_REVIEW',
  'REVISE_LOCAL_PACKET',
  'NO_GO_FOR_LIVE',
  'GO_FOR_LIVE',
  'APPROVED_FOR_LIVE',
  'AUTHORIZE_XPR_SIGNATURE',
  'AUTHORIZE_REAL_PAYMENT',
  'AUTHORIZE_REAL_LOAN',
  'AUTHORIZE_REAL_ESCROW',
  'AUTHORIZE_TOKEN_COLLATERAL',
  'redaction_confirmed',
  'no_secret_confirmed',
  'no_real_money_confirmed',
  'module_order',
  'repayment_failure',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_ALLOWED_RESPONSE_STATES',
  'LOCAL_REPLAY_EXTERNAL_OWNER_BLOCKED_RESPONSE_STATES',
  'LOCAL_REPLAY_EXTERNAL_OWNER_REQUIRED_RESPONSE_FIELDS',
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE_FIELDS',
  'createLocalReplayApprovalDecisionExternalOwnerResponseTemplate',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE_FIELDS.length < 27) {
  fail('Required approval decision external owner response template fields are unexpectedly short');
}

for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE, field)) {
    fail(`Demo approval decision external owner response template is missing ${field}`);
  }
}

for (const state of ['HOLD_FOR_EXTERNAL_REVIEW', 'REVISE_LOCAL_PACKET', 'NO_GO_FOR_LIVE']) {
  if (!LOCAL_REPLAY_EXTERNAL_OWNER_ALLOWED_RESPONSE_STATES.includes(state)) fail(`Allowed response states must include ${state}`);
}

for (const state of ['GO_FOR_LIVE', 'APPROVED_FOR_LIVE', 'AUTHORIZE_XPR_SIGNATURE', 'AUTHORIZE_REAL_PAYMENT', 'AUTHORIZE_REAL_LOAN', 'AUTHORIZE_REAL_ESCROW', 'AUTHORIZE_TOKEN_COLLATERAL']) {
  if (!LOCAL_REPLAY_EXTERNAL_OWNER_BLOCKED_RESPONSE_STATES.includes(state)) fail(`Blocked response states must include ${state}`);
}

for (const field of ['reviewer_role', 'decision_state', 'decision_note', 'evidence_reference_id', 'redaction_confirmed', 'no_secret_confirmed', 'no_real_money_confirmed']) {
  if (!LOCAL_REPLAY_EXTERNAL_OWNER_REQUIRED_RESPONSE_FIELDS.includes(field)) fail(`Required response fields must include ${field}`);
}

if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE.approval_decision_external_owner_packet_id !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET.approval_decision_external_owner_packet_id) {
  fail('Demo approval decision external owner response template packet id must match external owner packet');
}
if (!DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE.module_order?.includes('repayment_failure')) {
  fail('Demo approval decision external owner response template module_order must include repayment_failure');
}
if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE.module_order?.join('|') !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET.module_order?.join('|')) {
  fail('Demo approval decision external owner response template module_order must match external owner packet module_order');
}

for (const [field, value] of Object.entries(LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE_STATUS)) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE[field] !== value) {
    fail(`Approval decision external owner response template status ${field} must stay ${value}`);
  }
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseTemplate({
    approval_decision_external_owner_response_template_id: 'bad_response_template',
    approval_decision_external_owner_packet: { ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET, local_only: false },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response template must reject non-local owner packet');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local owner packet error must name local_only');
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseTemplate({
    approval_decision_external_owner_response_template_id: 'bad_response_template',
    approval_decision_external_owner_packet: {
      ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET,
      module_order: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET.module_order.filter((moduleName) => moduleName !== 'repayment_failure'),
    },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response template must reject owner packet missing repayment_failure module coverage');
} catch (error) {
  if (!String(error.message).includes('repayment_failure')) fail('Missing repayment_failure error must name repayment_failure');
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseTemplate({
    approval_decision_external_owner_response_template_id: 'sk_live_bad_secret_value',
    approval_decision_external_owner_packet: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response template must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay approval decision external owner response template validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-approval-decision-external-owner-response-template', contextPath);
assertIncludes(backlog, 'Smart contract local replay approval decision external owner response template', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay approval decision external owner response template', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-approval-decision-external-owner-response-template';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_approval_decision_external_owner_response_template: helperPath,
  template_status: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE.template_status,
}, null, 2));
