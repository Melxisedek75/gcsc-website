import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING } from '../src/smart-contracts/replay/localReplayApprovalDecisionRouting.mjs';
import {
  createLocalReplayApprovalDecisionAuditTrail,
  DEMO_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL,
  LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_EVENTS,
  LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL_STATUS,
  LOCAL_REPLAY_REQUIRED_EXTERNAL_DECISION_RECORDS,
  REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL_FIELDS,
} from '../src/smart-contracts/replay/localReplayApprovalDecisionAuditTrail.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayApprovalDecisionAuditTrail.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay approval decision audit trail validation failed: ${message}`);
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
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL_FIELDS',
  'LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL_STATUS',
  'LOCAL_REPLAY_REQUIRED_EXTERNAL_DECISION_RECORDS',
  'LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_EVENTS',
  'createLocalReplayApprovalDecisionAuditTrail',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL',
  'AUDIT_TRAIL_ONLY_PENDING_EXTERNAL_DECISIONS',
  'founder_written_decision_record',
  'legal_provider_written_decision_record',
  'finance_provider_written_decision_record',
  'security_written_decision_record',
  'xpr_authority_written_decision_record',
  'no_real_money_test_written_decision_record',
  'external_review_routes_defined',
  'autonomous_live_actions_blocked',
  'external_decision_records_pending',
  'module_order',
  'repayment_failure',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL',
  'LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_EVENTS',
  'LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL_STATUS',
  'LOCAL_REPLAY_REQUIRED_EXTERNAL_DECISION_RECORDS',
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL_FIELDS',
  'createLocalReplayApprovalDecisionAuditTrail',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL_FIELDS.length < 22) {
  fail('Required approval decision audit trail fields are unexpectedly short');
}

for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL, field)) {
    fail(`Demo approval decision audit trail is missing ${field}`);
  }
}

for (const record of [
  'founder_written_decision_record',
  'legal_provider_written_decision_record',
  'finance_provider_written_decision_record',
  'security_written_decision_record',
  'xpr_authority_written_decision_record',
  'no_real_money_test_written_decision_record',
]) {
  if (!LOCAL_REPLAY_REQUIRED_EXTERNAL_DECISION_RECORDS.includes(record)) {
    fail(`Required external decision records must include ${record}`);
  }
}

for (const event of [
  'decision_intake_recorded_local_only',
  'external_review_routes_defined',
  'autonomous_live_actions_blocked',
  'external_decision_records_pending',
]) {
  if (!LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_EVENTS.includes(event)) {
    fail(`Approval decision audit events must include ${event}`);
  }
}

if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL.approval_decision_routing_id !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING.approval_decision_routing_id) {
  fail('Demo approval decision audit trail approval_decision_routing_id must match decision routing');
}
if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL.digest !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING.digest) {
  fail('Demo approval decision audit trail digest must match decision routing digest');
}
if (!DEMO_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL.module_order?.includes('repayment_failure')) {
  fail('Demo approval decision audit trail module_order must include repayment_failure');
}
if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL.module_order?.join('|') !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING.module_order?.join('|')) {
  fail('Demo approval decision audit trail module_order must match decision routing module_order');
}

for (const [field, value] of Object.entries(LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL_STATUS)) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL[field] !== value) {
    fail(`Approval decision audit trail status ${field} must stay ${value}`);
  }
}

try {
  createLocalReplayApprovalDecisionAuditTrail({
    approval_decision_audit_trail_id: 'bad_approval_decision_audit_trail',
    approval_decision_routing: { ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING, local_only: false },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval decision audit trail must reject non-local decision routing');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local decision routing error must name local_only');
}

try {
  createLocalReplayApprovalDecisionAuditTrail({
    approval_decision_audit_trail_id: 'bad_approval_decision_audit_trail',
    approval_decision_routing: { ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING, routing_status: 'APPROVED_FOR_LIVE' },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval decision audit trail must reject approved routing status');
} catch (error) {
  if (!String(error.message).includes('ROUTE_ONLY_PENDING_EXTERNAL_REVIEW')) {
    fail('Bad routing status error must name ROUTE_ONLY_PENDING_EXTERNAL_REVIEW');
  }
}

try {
  createLocalReplayApprovalDecisionAuditTrail({
    approval_decision_audit_trail_id: 'bad_approval_decision_audit_trail',
    approval_decision_routing: {
      ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING,
      module_order: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING.module_order.filter((moduleName) => moduleName !== 'repayment_failure'),
    },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval decision audit trail must reject routing missing repayment_failure module coverage');
} catch (error) {
  if (!String(error.message).includes('repayment_failure')) fail('Missing repayment_failure error must name repayment_failure');
}

try {
  createLocalReplayApprovalDecisionAuditTrail({
    approval_decision_audit_trail_id: 'sk_live_bad_secret_value',
    approval_decision_routing: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval decision audit trail must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay approval decision audit trail validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-approval-decision-audit-trail', contextPath);
assertIncludes(backlog, 'Smart contract local replay approval decision audit trail', backlogPath);
assertIncludes(backlog, 'check:smart-contract-local-replay-approval-decision-audit-trail', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay approval decision audit trail', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-approval-decision-audit-trail';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_approval_decision_audit_trail: helperPath,
  audit_status: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL.audit_status,
}, null, 2));
