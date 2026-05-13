import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX } from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveIndex.mjs';
import {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveIndexCloseout,
  DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT,
  LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT_STATUS,
  LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT_ITEMS,
  REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT_FIELDS,
} from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveIndexCloseout.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveIndexCloseout.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay approval decision external owner response decision evidence archive index closeout validation failed: ${message}`);
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
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT_FIELDS',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT_ITEMS',
  'createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveIndexCloseout',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT',
  'RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT_PENDING_EXTERNAL_RECORDS',
  'RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_PENDING_EXTERNAL_RECORDS',
  'archive_index_snapshot_closed',
  'external_decision_slots_remain_pending',
  'manual_review_boundary_closed_local_only',
  'live_authority_not_closed_as_approved',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT_ITEMS',
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT_FIELDS',
  'createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveIndexCloseout',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT_FIELDS.length < 30) {
  fail('Required approval decision external owner response decision evidence archive index closeout fields are unexpectedly short');
}

for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT, field)) {
    fail(`Demo approval decision external owner response decision evidence archive index closeout is missing ${field}`);
  }
}

for (const item of ['archive_index_snapshot_closed', 'external_decision_slots_remain_pending', 'manual_review_boundary_closed_local_only', 'live_authority_not_closed_as_approved']) {
  if (!LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT_ITEMS.includes(item)) {
    fail(`Decision evidence archive index closeout items must include ${item}`);
  }
}

if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT.approval_decision_external_owner_response_decision_evidence_archive_index_id !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX.approval_decision_external_owner_response_decision_evidence_archive_index_id) {
  fail('Demo approval decision external owner response decision evidence archive index closeout archive index id must match decision evidence archive index');
}

for (const blockedState of ['GO_FOR_LIVE', 'LIVE_APPROVED', 'AUTO_APPROVED']) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT.accepted_decision_record_states.includes(blockedState)) {
    fail(`Decision evidence archive index closeout must not accept ${blockedState}`);
  }
}

for (const [field, value] of Object.entries(LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT_STATUS)) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT[field] !== value) {
    fail(`Approval decision external owner response decision evidence archive index closeout status ${field} must stay ${value}`);
  }
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveIndexCloseout({
    approval_decision_external_owner_response_decision_evidence_archive_index_closeout_id: 'bad_response_decision_evidence_archive_index_closeout',
    approval_decision_external_owner_response_decision_evidence_archive_index: { ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX, local_only: false },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response decision evidence archive index closeout must reject non-local decision evidence archive index');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local decision evidence archive index error must name local_only');
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveIndexCloseout({
    approval_decision_external_owner_response_decision_evidence_archive_index_closeout_id: 'sk_live_bad_secret_value',
    approval_decision_external_owner_response_decision_evidence_archive_index: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response decision evidence archive index closeout must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay approval decision external owner response decision evidence archive index closeout validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-approval-decision-external-owner-response-decision-evidence-archive-index-closeout', contextPath);
assertIncludes(backlog, 'Smart contract local replay approval decision external owner response decision evidence archive index closeout', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay approval decision external owner response decision evidence archive index closeout', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-approval-decision-external-owner-response-decision-evidence-archive-index-closeout';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_approval_decision_external_owner_response_decision_evidence_archive_index_closeout: helperPath,
  decision_evidence_archive_index_closeout_status: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_INDEX_CLOSEOUT.decision_evidence_archive_index_closeout_status,
}, null, 2));
