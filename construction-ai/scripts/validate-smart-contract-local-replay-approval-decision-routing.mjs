import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE } from '../src/smart-contracts/replay/localReplayApprovalDecisionIntake.mjs';
import {
  createLocalReplayApprovalDecisionRouting,
  DEMO_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING,
  LOCAL_REPLAY_APPROVAL_DECISION_ROUTING_OWNER_ROUTES,
  LOCAL_REPLAY_APPROVAL_DECISION_ROUTING_STATUS,
  LOCAL_REPLAY_BLOCKED_AUTONOMOUS_ACTIONS,
  REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING_FIELDS,
} from '../src/smart-contracts/replay/localReplayApprovalDecisionRouting.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayApprovalDecisionRouting.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay approval decision routing validation failed: ${message}`);
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
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING_FIELDS',
  'LOCAL_REPLAY_APPROVAL_DECISION_ROUTING_STATUS',
  'LOCAL_REPLAY_APPROVAL_DECISION_ROUTING_OWNER_ROUTES',
  'LOCAL_REPLAY_BLOCKED_AUTONOMOUS_ACTIONS',
  'createLocalReplayApprovalDecisionRouting',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING',
  'ROUTE_ONLY_PENDING_EXTERNAL_REVIEW',
  'founder_external_review',
  'legal_provider_external_review',
  'finance_provider_external_review',
  'security_external_review',
  'xpr_authority_external_review',
  'no_real_money_test_external_review',
  'no_autonomous_go_for_live',
  'no_autonomous_xpr_signature',
  'no_autonomous_real_payment',
  'no_autonomous_real_loan',
  'no_autonomous_real_escrow',
  'no_autonomous_token_collateral',
  'module_order',
  'repayment_failure',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING',
  'LOCAL_REPLAY_APPROVAL_DECISION_ROUTING_OWNER_ROUTES',
  'LOCAL_REPLAY_APPROVAL_DECISION_ROUTING_STATUS',
  'LOCAL_REPLAY_BLOCKED_AUTONOMOUS_ACTIONS',
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING_FIELDS',
  'createLocalReplayApprovalDecisionRouting',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING_FIELDS.length < 20) {
  fail('Required approval decision routing fields are unexpectedly short');
}

for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING, field)) {
    fail(`Demo approval decision routing is missing ${field}`);
  }
}

for (const route of [
  'founder_external_review',
  'legal_provider_external_review',
  'finance_provider_external_review',
  'security_external_review',
  'xpr_authority_external_review',
  'no_real_money_test_external_review',
]) {
  if (!LOCAL_REPLAY_APPROVAL_DECISION_ROUTING_OWNER_ROUTES.includes(route)) {
    fail(`Decision routing owner routes must include ${route}`);
  }
}

for (const blockedAction of [
  'no_autonomous_go_for_live',
  'no_autonomous_xpr_signature',
  'no_autonomous_real_payment',
  'no_autonomous_real_loan',
  'no_autonomous_real_escrow',
  'no_autonomous_token_collateral',
]) {
  if (!LOCAL_REPLAY_BLOCKED_AUTONOMOUS_ACTIONS.includes(blockedAction)) {
    fail(`Blocked autonomous actions must include ${blockedAction}`);
  }
}

if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING.approval_decision_intake_id !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE.approval_decision_intake_id) {
  fail('Demo approval decision routing approval_decision_intake_id must match decision intake');
}
if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING.digest !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE.digest) {
  fail('Demo approval decision routing digest must match decision intake digest');
}
if (!DEMO_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING.module_order?.includes('repayment_failure')) {
  fail('Demo approval decision routing module_order must include repayment_failure');
}
if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING.module_order?.join('|') !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE.module_order?.join('|')) {
  fail('Demo approval decision routing module_order must match decision intake module_order');
}

for (const [field, value] of Object.entries(LOCAL_REPLAY_APPROVAL_DECISION_ROUTING_STATUS)) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING[field] !== value) {
    fail(`Approval decision routing status ${field} must stay ${value}`);
  }
}

try {
  createLocalReplayApprovalDecisionRouting({
    approval_decision_routing_id: 'bad_approval_decision_routing',
    approval_decision_intake: { ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE, local_only: false },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval decision routing must reject non-local decision intake');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local decision intake error must name local_only');
}

try {
  createLocalReplayApprovalDecisionRouting({
    approval_decision_routing_id: 'bad_approval_decision_routing',
    approval_decision_intake: { ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE, intake_status: 'APPROVED_FOR_LIVE' },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval decision routing must reject approved intake status');
} catch (error) {
  if (!String(error.message).includes('INTAKE_ONLY_PENDING_FOUNDER_EXTERNAL_RESPONSE')) {
    fail('Bad intake status error must name INTAKE_ONLY_PENDING_FOUNDER_EXTERNAL_RESPONSE');
  }
}

try {
  createLocalReplayApprovalDecisionRouting({
    approval_decision_routing_id: 'bad_approval_decision_routing',
    approval_decision_intake: {
      ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE,
      module_order: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE.module_order.filter((moduleName) => moduleName !== 'repayment_failure'),
    },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval decision routing must reject intake missing repayment_failure module coverage');
} catch (error) {
  if (!String(error.message).includes('repayment_failure')) fail('Missing repayment_failure error must name repayment_failure');
}

try {
  createLocalReplayApprovalDecisionRouting({
    approval_decision_routing_id: 'sk_live_bad_secret_value',
    approval_decision_intake: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval decision routing must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay approval decision routing validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-approval-decision-routing', contextPath);
assertIncludes(backlog, 'Smart contract local replay approval decision routing', backlogPath);
assertIncludes(backlog, 'check:smart-contract-local-replay-approval-decision-routing', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay approval decision routing', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-approval-decision-routing';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_approval_decision_routing: helperPath,
  routing_status: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING.routing_status,
}, null, 2));
