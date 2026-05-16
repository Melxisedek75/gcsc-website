import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF } from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseHandoff.mjs';
import {
  createLocalReplayApprovalDecisionExternalOwnerResponseHandoffCloseout,
  DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT,
  LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT_STATUS,
  LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT_ITEMS,
  LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_HANDOFF_REMAINING_MANUAL_REVIEW_ITEMS,
  REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT_FIELDS,
} from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseHandoffCloseout.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayApprovalDecisionExternalOwnerResponseHandoffCloseout.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay approval decision external owner response handoff closeout validation failed: ${message}`);
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
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT_FIELDS',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT_ITEMS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_HANDOFF_REMAINING_MANUAL_REVIEW_ITEMS',
  'createLocalReplayApprovalDecisionExternalOwnerResponseHandoffCloseout',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT',
  'RESPONSE_HANDOFF_CLOSEOUT_ONLY_PENDING_EXTERNAL_DECISIONS',
  'RESPONSE_HANDOFF_ONLY_PENDING_MANUAL_OWNER_REVIEW',
  'module_order',
  'repayment_failure',
  'response_handoff_packet_built',
  'no_live_authority_boundary_restated',
  'founder_written_decision',
  'xpr_authority_owner_written_decision',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT_ITEMS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_HANDOFF_REMAINING_MANUAL_REVIEW_ITEMS',
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT_FIELDS',
  'createLocalReplayApprovalDecisionExternalOwnerResponseHandoffCloseout',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT_FIELDS.length < 31) {
  fail('Required approval decision external owner response handoff closeout fields are unexpectedly short');
}

for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT, field)) {
    fail(`Demo approval decision external owner response handoff closeout is missing ${field}`);
  }
}

for (const item of ['response_handoff_packet_built', 'manual_review_recipients_listed', 'blocked_live_actions_restated', 'no_live_authority_boundary_restated']) {
  if (!LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT_ITEMS.includes(item)) fail(`Closeout items must include ${item}`);
}

for (const item of ['founder_written_decision', 'legal_provider_written_decision', 'finance_provider_written_decision', 'security_written_decision', 'xpr_authority_owner_written_decision']) {
  if (!LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_HANDOFF_REMAINING_MANUAL_REVIEW_ITEMS.includes(item)) {
    fail(`Remaining manual review items must include ${item}`);
  }
}

if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT.approval_decision_external_owner_response_handoff_id !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF.approval_decision_external_owner_response_handoff_id) {
  fail('Demo approval decision external owner response handoff closeout handoff id must match response handoff');
}

if (!DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT.module_order?.includes('repayment_failure')) {
  fail('Demo approval decision external owner response handoff closeout module order must include repayment_failure');
}

if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT.module_order?.join('|') !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF.module_order?.join('|')) {
  fail('Demo approval decision external owner response handoff closeout module order must match response handoff');
}

for (const [field, value] of Object.entries(LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT_STATUS)) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT[field] !== value) {
    fail(`Approval decision external owner response handoff closeout status ${field} must stay ${value}`);
  }
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseHandoffCloseout({
    approval_decision_external_owner_response_handoff_closeout_id: 'bad_response_handoff_closeout',
    approval_decision_external_owner_response_handoff: { ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF, local_only: false },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response handoff closeout must reject non-local response handoff');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local response handoff error must name local_only');
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseHandoffCloseout({
    approval_decision_external_owner_response_handoff_closeout_id: 'bad_response_handoff_closeout_missing_repayment_failure',
    approval_decision_external_owner_response_handoff: {
      ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF,
      module_order: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF.module_order.filter((moduleName) => moduleName !== 'repayment_failure'),
    },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response handoff closeout must reject response handoff missing repayment_failure module coverage');
} catch (error) {
  if (!String(error.message).includes('repayment_failure')) fail('Missing repayment_failure response handoff error must name repayment_failure');
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseHandoffCloseout({
    approval_decision_external_owner_response_handoff_closeout_id: 'sk_live_bad_secret_value',
    approval_decision_external_owner_response_handoff: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response handoff closeout must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay approval decision external owner response handoff closeout validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-approval-decision-external-owner-response-handoff-closeout', contextPath);
assertIncludes(backlog, 'Smart contract local replay approval decision external owner response handoff closeout', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay approval decision external owner response handoff closeout', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-approval-decision-external-owner-response-handoff-closeout';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_approval_decision_external_owner_response_handoff_closeout: helperPath,
  handoff_closeout_status: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT.handoff_closeout_status,
}, null, 2));
