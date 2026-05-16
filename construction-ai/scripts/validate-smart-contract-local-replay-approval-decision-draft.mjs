import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEMO_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY } from '../src/smart-contracts/replay/localReplayApprovalHandoffSummary.mjs';
import {
  createLocalReplayApprovalDecisionDraft,
  DEMO_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT,
  LOCAL_REPLAY_ALLOWED_DECISION_STATES,
  LOCAL_REPLAY_APPROVAL_DECISION_DRAFT_STATUS,
  LOCAL_REPLAY_BLOCKED_DECISION_STATES,
  REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT_FIELDS,
} from '../src/smart-contracts/replay/localReplayApprovalDecisionDraft.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayApprovalDecisionDraft.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay approval decision draft validation failed: ${message}`);
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
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT_FIELDS',
  'LOCAL_REPLAY_APPROVAL_DECISION_DRAFT_STATUS',
  'LOCAL_REPLAY_ALLOWED_DECISION_STATES',
  'LOCAL_REPLAY_BLOCKED_DECISION_STATES',
  'createLocalReplayApprovalDecisionDraft',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT',
  'DRAFT_ONLY_PENDING_EXTERNAL_DECISION',
  'module_order',
  'repayment_failure',
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
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT',
  'LOCAL_REPLAY_ALLOWED_DECISION_STATES',
  'LOCAL_REPLAY_APPROVAL_DECISION_DRAFT_STATUS',
  'LOCAL_REPLAY_BLOCKED_DECISION_STATES',
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT_FIELDS',
  'createLocalReplayApprovalDecisionDraft',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT_FIELDS.length < 18) {
  fail('Required approval decision draft fields are unexpectedly short');
}

for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT, field)) {
    fail(`Demo approval decision draft is missing ${field}`);
  }
}

for (const allowedState of [
  'HOLD_FOR_EXTERNAL_REVIEW',
  'REVISE_LOCAL_PACKET',
  'NO_GO_FOR_LIVE',
]) {
  if (!LOCAL_REPLAY_ALLOWED_DECISION_STATES.includes(allowedState)) {
    fail(`Allowed decision states must include ${allowedState}`);
  }
}

for (const blockedState of [
  'GO_FOR_LIVE',
  'APPROVED_FOR_LIVE',
  'AUTHORIZE_XPR_SIGNATURE',
  'AUTHORIZE_REAL_PAYMENT',
  'AUTHORIZE_REAL_LOAN',
  'AUTHORIZE_REAL_ESCROW',
  'AUTHORIZE_TOKEN_COLLATERAL',
]) {
  if (!LOCAL_REPLAY_BLOCKED_DECISION_STATES.includes(blockedState)) {
    fail(`Blocked decision states must include ${blockedState}`);
  }
}

if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT.approval_handoff_summary_id !== DEMO_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY.approval_handoff_summary_id) {
  fail('Demo approval decision draft approval_handoff_summary_id must match approval handoff summary');
}
if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT.digest !== DEMO_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY.digest) {
  fail('Demo approval decision draft digest must match approval handoff summary digest');
}
if (!DEMO_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT.module_order?.includes('repayment_failure')) {
  fail('Demo approval decision draft module_order must include repayment_failure');
}
if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT.module_order?.join('|') !== DEMO_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY.module_order?.join('|')) {
  fail('Demo approval decision draft module_order must match approval handoff summary module_order');
}

for (const [field, value] of Object.entries(LOCAL_REPLAY_APPROVAL_DECISION_DRAFT_STATUS)) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT[field] !== value) {
    fail(`Approval decision draft status ${field} must stay ${value}`);
  }
}

try {
  createLocalReplayApprovalDecisionDraft({
    approval_decision_draft_id: 'bad_approval_decision_draft',
    approval_handoff_summary: { ...DEMO_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY, local_only: false },
    requested_decision: 'HOLD_FOR_EXTERNAL_REVIEW',
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval decision draft must reject non-local handoff summary');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local handoff summary error must name local_only');
}

try {
  createLocalReplayApprovalDecisionDraft({
    approval_decision_draft_id: 'bad_approval_decision_draft',
    approval_handoff_summary: {
      ...DEMO_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY,
      module_order: DEMO_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY.module_order.filter((moduleName) => moduleName !== 'repayment_failure'),
    },
    requested_decision: 'HOLD_FOR_EXTERNAL_REVIEW',
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval decision draft must reject approval handoff summary without repayment_failure coverage');
} catch (error) {
  if (!String(error.message).includes('repayment_failure')) fail('Missing repayment_failure error must name repayment_failure');
}

try {
  createLocalReplayApprovalDecisionDraft({
    approval_decision_draft_id: 'bad_approval_decision_draft',
    approval_handoff_summary: { ...DEMO_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY, deployment_status: 'READY_FOR_LIVE' },
    requested_decision: 'HOLD_FOR_EXTERNAL_REVIEW',
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval decision draft must reject live-ready handoff summary');
} catch (error) {
  if (!String(error.message).includes('BLOCKED_FOR_LIVE')) fail('Bad deployment status error must name BLOCKED_FOR_LIVE');
}

try {
  createLocalReplayApprovalDecisionDraft({
    approval_decision_draft_id: 'bad_approval_decision_draft',
    approval_handoff_summary: DEMO_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY,
    requested_decision: 'GO_FOR_LIVE',
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval decision draft must reject GO_FOR_LIVE');
} catch (error) {
  if (!String(error.message).includes('Blocked decision')) fail('Blocked decision error must be explicit');
}

try {
  createLocalReplayApprovalDecisionDraft({
    approval_decision_draft_id: 'sk_live_bad_secret_value',
    approval_handoff_summary: DEMO_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY,
    requested_decision: 'HOLD_FOR_EXTERNAL_REVIEW',
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval decision draft must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay approval decision draft validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-approval-decision-draft', contextPath);
assertIncludes(backlog, 'Smart contract local replay approval decision draft', backlogPath);
assertIncludes(backlog, 'check:smart-contract-local-replay-approval-decision-draft', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay approval decision draft', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-approval-decision-draft';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_approval_decision_draft: helperPath,
  decision_status: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT.decision_status,
}, null, 2));
