import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_SUMMARY } from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceSummary.mjs';
import {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceCloseout,
  DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT,
  LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT_STATUS,
  LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT_ITEMS,
  REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT_FIELDS,
} from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceCloseout.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceCloseout.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay approval decision external owner response decision evidence closeout validation failed: ${message}`);
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
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT_FIELDS',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT_ITEMS',
  'createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceCloseout',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT',
  'RESPONSE_DECISION_EVIDENCE_CLOSEOUT_PENDING_EXTERNAL_RECORDS',
  'RESPONSE_DECISION_EVIDENCE_SUMMARY_PENDING_EXTERNAL_RECORDS',
  'decision_evidence_summary_reviewed',
  'external_decision_slots_remain_pending',
  'live_authority_not_granted',
  'go_states_remain_blocked',
  'module_order',
  'repayment_failure',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT_ITEMS',
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT_FIELDS',
  'createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceCloseout',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT_FIELDS.length < 31) {
  fail('Required approval decision external owner response decision evidence closeout fields are unexpectedly short');
}

for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT, field)) {
    fail(`Demo approval decision external owner response decision evidence closeout is missing ${field}`);
  }
}

for (const item of ['decision_evidence_summary_reviewed', 'external_decision_slots_remain_pending', 'live_authority_not_granted', 'go_states_remain_blocked']) {
  if (!LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT_ITEMS.includes(item)) {
    fail(`Decision evidence closeout items must include ${item}`);
  }
}

if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT.approval_decision_external_owner_response_decision_evidence_summary_id !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_SUMMARY.approval_decision_external_owner_response_decision_evidence_summary_id) {
  fail('Demo approval decision external owner response decision evidence closeout summary id must match decision evidence summary');
}

if (!DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT.module_order?.includes('repayment_failure')) {
  fail('Demo approval decision external owner response decision evidence closeout module order must include repayment_failure');
}

if (JSON.stringify(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT.module_order) !== JSON.stringify(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_SUMMARY.module_order)) {
  fail('Demo approval decision external owner response decision evidence closeout module order must match decision evidence summary');
}

for (const blockedState of ['GO_FOR_LIVE', 'LIVE_APPROVED', 'AUTO_APPROVED']) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT.accepted_decision_record_states.includes(blockedState)) {
    fail(`Decision evidence closeout must not accept ${blockedState}`);
  }
}

for (const [field, value] of Object.entries(LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT_STATUS)) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT[field] !== value) {
    fail(`Approval decision external owner response decision evidence closeout status ${field} must stay ${value}`);
  }
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceCloseout({
    approval_decision_external_owner_response_decision_evidence_closeout_id: 'bad_response_decision_evidence_closeout',
    approval_decision_external_owner_response_decision_evidence_summary: { ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_SUMMARY, local_only: false },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response decision evidence closeout must reject non-local decision evidence summary');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local decision evidence summary error must name local_only');
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceCloseout({
    approval_decision_external_owner_response_decision_evidence_closeout_id: 'bad_response_decision_evidence_closeout_missing_repayment_failure',
    approval_decision_external_owner_response_decision_evidence_summary: {
      ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_SUMMARY,
      module_order: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_SUMMARY.module_order.filter((moduleName) => moduleName !== 'repayment_failure'),
    },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response decision evidence closeout must reject decision evidence summary missing repayment_failure module coverage');
} catch (error) {
  if (!String(error.message).includes('repayment_failure')) fail('Missing repayment_failure error must be explicit');
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceCloseout({
    approval_decision_external_owner_response_decision_evidence_closeout_id: 'sk_live_bad_secret_value',
    approval_decision_external_owner_response_decision_evidence_summary: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_SUMMARY,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response decision evidence closeout must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay approval decision external owner response decision evidence closeout validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-approval-decision-external-owner-response-decision-evidence-closeout', contextPath);
assertIncludes(backlog, 'Smart contract local replay approval decision external owner response decision evidence closeout', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay approval decision external owner response decision evidence closeout', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-approval-decision-external-owner-response-decision-evidence-closeout';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_approval_decision_external_owner_response_decision_evidence_closeout: helperPath,
  decision_evidence_closeout_status: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT.decision_evidence_closeout_status,
}, null, 2));
