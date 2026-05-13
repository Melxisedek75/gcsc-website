import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY } from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseSummary.mjs';
import {
  createLocalReplayApprovalDecisionExternalOwnerResponseActionPlan,
  DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN,
  LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN_STATUS,
  LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN_MANUAL_CHECKPOINTS,
  REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN_FIELDS,
} from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseActionPlan.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayApprovalDecisionExternalOwnerResponseActionPlan.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay approval decision external owner response action plan validation failed: ${message}`);
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
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN_FIELDS',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN_MANUAL_CHECKPOINTS',
  'createLocalReplayApprovalDecisionExternalOwnerResponseActionPlan',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN',
  'ACTION_PLAN_ONLY_PENDING_MANUAL_OWNER_REVIEW',
  'RESPONSE_SUMMARY_ONLY_PENDING_MANUAL_REVIEW',
  'founder_reviews_response_summary',
  'legal_provider_reviews_live_implications',
  'finance_provider_reviews_money_movement_boundary',
  'security_reviews_xpr_signature_boundary',
  'owner_records_no_live_authority_confirmation',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN_MANUAL_CHECKPOINTS',
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN_FIELDS',
  'createLocalReplayApprovalDecisionExternalOwnerResponseActionPlan',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN_FIELDS.length < 28) {
  fail('Required approval decision external owner response action plan fields are unexpectedly short');
}

for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN, field)) {
    fail(`Demo approval decision external owner response action plan is missing ${field}`);
  }
}

for (const checkpoint of [
  'founder_reviews_response_summary',
  'legal_provider_reviews_live_implications',
  'finance_provider_reviews_money_movement_boundary',
  'security_reviews_xpr_signature_boundary',
  'owner_records_no_live_authority_confirmation',
]) {
  if (!LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN_MANUAL_CHECKPOINTS.includes(checkpoint)) {
    fail(`Manual checkpoints must include ${checkpoint}`);
  }
}

if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN.approval_decision_external_owner_response_summary_id !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY.approval_decision_external_owner_response_summary_id) {
  fail('Demo approval decision external owner response action plan summary id must match response summary');
}

for (const [field, value] of Object.entries(LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN_STATUS)) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN[field] !== value) {
    fail(`Approval decision external owner response action plan status ${field} must stay ${value}`);
  }
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseActionPlan({
    approval_decision_external_owner_response_action_plan_id: 'bad_response_action_plan',
    approval_decision_external_owner_response_summary: { ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY, local_only: false },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response action plan must reject non-local response summary');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local response summary error must name local_only');
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseActionPlan({
    approval_decision_external_owner_response_action_plan_id: 'sk_live_bad_secret_value',
    approval_decision_external_owner_response_summary: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response action plan must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay approval decision external owner response action plan validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-approval-decision-external-owner-response-action-plan', contextPath);
assertIncludes(backlog, 'Smart contract local replay approval decision external owner response action plan', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay approval decision external owner response action plan', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-approval-decision-external-owner-response-action-plan';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_approval_decision_external_owner_response_action_plan: helperPath,
  action_plan_status: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN.action_plan_status,
}, null, 2));
