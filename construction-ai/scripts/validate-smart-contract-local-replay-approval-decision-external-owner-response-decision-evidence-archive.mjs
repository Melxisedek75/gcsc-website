import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT } from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceCloseout.mjs';
import {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchive,
  DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE,
  LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_STATUS,
  LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_ITEMS,
  REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_FIELDS,
} from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchive.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchive.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay approval decision external owner response decision evidence archive validation failed: ${message}`);
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
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_FIELDS',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_ITEMS',
  'createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchive',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE',
  'RESPONSE_DECISION_EVIDENCE_ARCHIVE_PENDING_EXTERNAL_RECORDS',
  'RESPONSE_DECISION_EVIDENCE_CLOSEOUT_PENDING_EXTERNAL_RECORDS',
  'local_closeout_snapshot_archived',
  'external_decision_slots_preserved',
  'manual_review_boundary_preserved',
  'live_authority_not_archived_as_approved',
  'module_order',
  'repayment_failure',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_ITEMS',
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_FIELDS',
  'createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchive',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_FIELDS.length < 31) {
  fail('Required approval decision external owner response decision evidence archive fields are unexpectedly short');
}

for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE, field)) {
    fail(`Demo approval decision external owner response decision evidence archive is missing ${field}`);
  }
}

for (const item of ['local_closeout_snapshot_archived', 'external_decision_slots_preserved', 'manual_review_boundary_preserved', 'live_authority_not_archived_as_approved']) {
  if (!LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_ITEMS.includes(item)) {
    fail(`Decision evidence archive items must include ${item}`);
  }
}

if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE.approval_decision_external_owner_response_decision_evidence_closeout_id !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT.approval_decision_external_owner_response_decision_evidence_closeout_id) {
  fail('Demo approval decision external owner response decision evidence archive closeout id must match decision evidence closeout');
}

if (!DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE.module_order?.includes('repayment_failure')) {
  fail('Demo approval decision external owner response decision evidence archive module order must include repayment_failure');
}

if (JSON.stringify(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE.module_order) !== JSON.stringify(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT.module_order)) {
  fail('Demo approval decision external owner response decision evidence archive module order must match decision evidence closeout');
}

for (const blockedState of ['GO_FOR_LIVE', 'LIVE_APPROVED', 'AUTO_APPROVED']) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE.accepted_decision_record_states.includes(blockedState)) {
    fail(`Decision evidence archive must not accept ${blockedState}`);
  }
}

for (const [field, value] of Object.entries(LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_STATUS)) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE[field] !== value) {
    fail(`Approval decision external owner response decision evidence archive status ${field} must stay ${value}`);
  }
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchive({
    approval_decision_external_owner_response_decision_evidence_archive_id: 'bad_response_decision_evidence_archive',
    approval_decision_external_owner_response_decision_evidence_closeout: { ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT, local_only: false },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response decision evidence archive must reject non-local decision evidence closeout');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local decision evidence closeout error must name local_only');
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchive({
    approval_decision_external_owner_response_decision_evidence_archive_id: 'bad_response_decision_evidence_archive_missing_repayment_failure',
    approval_decision_external_owner_response_decision_evidence_closeout: {
      ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT,
      module_order: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT.module_order.filter((moduleName) => moduleName !== 'repayment_failure'),
    },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response decision evidence archive must reject decision evidence closeout missing repayment_failure module coverage');
} catch (error) {
  if (!String(error.message).includes('repayment_failure')) fail('Missing repayment_failure error must be explicit');
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchive({
    approval_decision_external_owner_response_decision_evidence_archive_id: 'sk_live_bad_secret_value',
    approval_decision_external_owner_response_decision_evidence_closeout: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response decision evidence archive must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay approval decision external owner response decision evidence archive validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-approval-decision-external-owner-response-decision-evidence-archive', contextPath);
assertIncludes(backlog, 'Smart contract local replay approval decision external owner response decision evidence archive', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay approval decision external owner response decision evidence archive', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-approval-decision-external-owner-response-decision-evidence-archive';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_approval_decision_external_owner_response_decision_evidence_archive: helperPath,
  decision_evidence_archive_status: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE.decision_evidence_archive_status,
}, null, 2));
