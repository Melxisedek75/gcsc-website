import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN } from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseActionPlan.mjs';
import {
  createLocalReplayApprovalDecisionExternalOwnerResponseHandoff,
  DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF,
  LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_STATUS,
  LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_HANDOFF_ITEMS,
  LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_HANDOFF_RECIPIENTS,
  REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_FIELDS,
} from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseHandoff.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayApprovalDecisionExternalOwnerResponseHandoff.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay approval decision external owner response handoff validation failed: ${message}`);
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
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_FIELDS',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_HANDOFF_RECIPIENTS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_HANDOFF_ITEMS',
  'createLocalReplayApprovalDecisionExternalOwnerResponseHandoff',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF',
  'RESPONSE_HANDOFF_ONLY_PENDING_MANUAL_OWNER_REVIEW',
  'ACTION_PLAN_ONLY_PENDING_MANUAL_OWNER_REVIEW',
  'module_order',
  'repayment_failure',
  'founder',
  'legal_provider',
  'finance_provider',
  'security_reviewer',
  'xpr_authority_owner',
  'no_live_authority_boundary',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_HANDOFF_ITEMS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_HANDOFF_RECIPIENTS',
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_FIELDS',
  'createLocalReplayApprovalDecisionExternalOwnerResponseHandoff',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_FIELDS.length < 30) {
  fail('Required approval decision external owner response handoff fields are unexpectedly short');
}

for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF, field)) {
    fail(`Demo approval decision external owner response handoff is missing ${field}`);
  }
}

for (const recipient of ['founder', 'legal_provider', 'finance_provider', 'security_reviewer', 'xpr_authority_owner']) {
  if (!LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_HANDOFF_RECIPIENTS.includes(recipient)) {
    fail(`Handoff recipients must include ${recipient}`);
  }
}

for (const item of ['response_summary', 'response_action_plan', 'manual_review_checkpoints', 'blocked_live_actions', 'no_live_authority_boundary']) {
  if (!LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_HANDOFF_ITEMS.includes(item)) fail(`Handoff items must include ${item}`);
}

if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF.approval_decision_external_owner_response_action_plan_id !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN.approval_decision_external_owner_response_action_plan_id) {
  fail('Demo approval decision external owner response handoff action plan id must match response action plan');
}

if (!DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF.module_order?.includes('repayment_failure')) {
  fail('Demo approval decision external owner response handoff module order must include repayment_failure');
}

if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF.module_order?.join('|') !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN.module_order?.join('|')) {
  fail('Demo approval decision external owner response handoff module order must match response action plan');
}

for (const [field, value] of Object.entries(LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_STATUS)) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF[field] !== value) {
    fail(`Approval decision external owner response handoff status ${field} must stay ${value}`);
  }
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseHandoff({
    approval_decision_external_owner_response_handoff_id: 'bad_response_handoff',
    approval_decision_external_owner_response_action_plan: { ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN, local_only: false },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response handoff must reject non-local response action plan');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local response action plan error must name local_only');
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseHandoff({
    approval_decision_external_owner_response_handoff_id: 'bad_response_handoff_missing_repayment_failure',
    approval_decision_external_owner_response_action_plan: {
      ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN,
      module_order: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN.module_order.filter((moduleName) => moduleName !== 'repayment_failure'),
    },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response handoff must reject response action plan missing repayment_failure module coverage');
} catch (error) {
  if (!String(error.message).includes('repayment_failure')) fail('Missing repayment_failure response action plan error must name repayment_failure');
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseHandoff({
    approval_decision_external_owner_response_handoff_id: 'sk_live_bad_secret_value',
    approval_decision_external_owner_response_action_plan: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response handoff must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay approval decision external owner response handoff validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-approval-decision-external-owner-response-handoff', contextPath);
assertIncludes(backlog, 'Smart contract local replay approval decision external owner response handoff', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay approval decision external owner response handoff', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-approval-decision-external-owner-response-handoff';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_approval_decision_external_owner_response_handoff: helperPath,
  handoff_status: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF.handoff_status,
}, null, 2));
