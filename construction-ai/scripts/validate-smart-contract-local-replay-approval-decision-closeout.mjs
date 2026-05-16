import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL } from '../src/smart-contracts/replay/localReplayApprovalDecisionAuditTrail.mjs';
import {
  createLocalReplayApprovalDecisionCloseout,
  DEMO_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT,
  LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT_STATUS,
  LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT_SUMMARY,
  REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT_FIELDS,
} from '../src/smart-contracts/replay/localReplayApprovalDecisionCloseout.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayApprovalDecisionCloseout.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay approval decision closeout validation failed: ${message}`);
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
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT_FIELDS',
  'LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT_STATUS',
  'LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT_SUMMARY',
  'createLocalReplayApprovalDecisionCloseout',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT',
  'LOCAL_CLOSEOUT_READY_FOR_EXTERNAL_OWNER_REVIEW',
  'local_replay_evidence_complete',
  'approval_decision_records_still_external',
  'no_autonomous_live_authority_granted',
  'no_xpr_signature_or_real_money_step_allowed',
  'AUDIT_TRAIL_ONLY_PENDING_EXTERNAL_DECISIONS',
  'module_order',
  'repayment_failure',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT',
  'LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT_STATUS',
  'LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT_SUMMARY',
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT_FIELDS',
  'createLocalReplayApprovalDecisionCloseout',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT_FIELDS.length < 23) {
  fail('Required approval decision closeout fields are unexpectedly short');
}

for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT, field)) {
    fail(`Demo approval decision closeout is missing ${field}`);
  }
}

for (const summaryItem of [
  'local_replay_evidence_complete',
  'approval_decision_records_still_external',
  'no_autonomous_live_authority_granted',
  'no_xpr_signature_or_real_money_step_allowed',
]) {
  if (!LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT_SUMMARY.includes(summaryItem)) {
    fail(`Approval decision closeout summary must include ${summaryItem}`);
  }
}

if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT.approval_decision_audit_trail_id !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL.approval_decision_audit_trail_id) {
  fail('Demo approval decision closeout approval_decision_audit_trail_id must match decision audit trail');
}
if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT.digest !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL.digest) {
  fail('Demo approval decision closeout digest must match decision audit trail digest');
}
if (!DEMO_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT.module_order?.includes('repayment_failure')) {
  fail('Demo approval decision closeout module_order must include repayment_failure');
}
if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT.module_order?.join('|') !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL.module_order?.join('|')) {
  fail('Demo approval decision closeout module_order must match decision audit trail module_order');
}

for (const [field, value] of Object.entries(LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT_STATUS)) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT[field] !== value) {
    fail(`Approval decision closeout status ${field} must stay ${value}`);
  }
}

try {
  createLocalReplayApprovalDecisionCloseout({
    approval_decision_closeout_id: 'bad_approval_decision_closeout',
    approval_decision_audit_trail: { ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL, local_only: false },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval decision closeout must reject non-local decision audit trail');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local decision audit trail error must name local_only');
}

try {
  createLocalReplayApprovalDecisionCloseout({
    approval_decision_closeout_id: 'bad_approval_decision_closeout',
    approval_decision_audit_trail: { ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL, audit_status: 'APPROVED_FOR_LIVE' },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval decision closeout must reject approved audit status');
} catch (error) {
  if (!String(error.message).includes('AUDIT_TRAIL_ONLY_PENDING_EXTERNAL_DECISIONS')) {
    fail('Bad audit status error must name AUDIT_TRAIL_ONLY_PENDING_EXTERNAL_DECISIONS');
  }
}

try {
  createLocalReplayApprovalDecisionCloseout({
    approval_decision_closeout_id: 'bad_approval_decision_closeout',
    approval_decision_audit_trail: {
      ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL,
      module_order: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL.module_order.filter((moduleName) => moduleName !== 'repayment_failure'),
    },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval decision closeout must reject audit trail missing repayment_failure module coverage');
} catch (error) {
  if (!String(error.message).includes('repayment_failure')) fail('Missing repayment_failure error must name repayment_failure');
}

try {
  createLocalReplayApprovalDecisionCloseout({
    approval_decision_closeout_id: 'sk_live_bad_secret_value',
    approval_decision_audit_trail: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval decision closeout must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay approval decision closeout validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-approval-decision-closeout', contextPath);
assertIncludes(backlog, 'Smart contract local replay approval decision closeout', backlogPath);
assertIncludes(backlog, 'check:smart-contract-local-replay-approval-decision-closeout', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay approval decision closeout', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-approval-decision-closeout';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_approval_decision_closeout: helperPath,
  closeout_status: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT.closeout_status,
}, null, 2));
