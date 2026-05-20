import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF } from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveExternalRecordRequestCloseoutHandoff.mjs';
import {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveExternalRecordRequestCloseoutHandoffCloseout,
  DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT,
  LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT_STATUS,
  LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT_ITEMS,
  REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT_FIELDS,
} from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveExternalRecordRequestCloseoutHandoffCloseout.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveExternalRecordRequestCloseoutHandoffCloseout.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay approval decision external owner response decision evidence archive external record request closeout handoff closeout validation failed: ${message}`);
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
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT_FIELDS',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT_ITEMS',
  'createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveExternalRecordRequestCloseoutHandoffCloseout',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT',
  'RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT_PENDING_EXTERNAL_RECORDS',
  'RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_PENDING_EXTERNAL_RECORDS',
  'external_record_request_closeout_handoff_snapshot_closed',
  'founder_legal_finance_security_xpr_records_still_required',
  'external_owner_review_still_pending',
  'live_authority_remains_blocked',
  'module_order',
  'repayment_failure',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT_ITEMS',
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT_FIELDS',
  'createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveExternalRecordRequestCloseoutHandoffCloseout',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT_FIELDS.length < 31) {
  fail('Required approval decision external owner response decision evidence archive external record request closeout handoff closeout fields are unexpectedly short');
}

for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT, field)) {
    fail(`Demo approval decision external owner response decision evidence archive external record request closeout handoff closeout is missing ${field}`);
  }
}

for (const item of ['external_record_request_closeout_handoff_snapshot_closed', 'founder_legal_finance_security_xpr_records_still_required', 'external_owner_review_still_pending', 'live_authority_remains_blocked']) {
  if (!LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT_ITEMS.includes(item)) {
    fail(`Decision evidence archive external record request closeout handoff closeout items must include ${item}`);
  }
}

if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT.approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_handoff_id !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF.approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_handoff_id) {
  fail('Demo approval decision external owner response decision evidence archive external record request closeout handoff closeout handoff id must match source handoff');
}

if (!DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT.module_order?.includes('repayment_failure')) {
  fail('Demo approval decision external owner response decision evidence archive external record request closeout handoff closeout must preserve repayment_failure module coverage');
}

if (JSON.stringify(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT.module_order) !== JSON.stringify(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF.module_order)) {
  fail('Demo approval decision external owner response decision evidence archive external record request closeout handoff closeout module order must match source handoff');
}

for (const blockedState of ['GO_FOR_LIVE', 'LIVE_APPROVED', 'AUTO_APPROVED']) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT.accepted_decision_record_states.includes(blockedState)) {
    fail(`Decision evidence archive external record request closeout handoff closeout must not accept ${blockedState}`);
  }
}

for (const [field, value] of Object.entries(LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT_STATUS)) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT[field] !== value) {
    fail(`Approval decision external owner response decision evidence archive external record request closeout handoff closeout status ${field} must stay ${value}`);
  }
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveExternalRecordRequestCloseoutHandoffCloseout({
    approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_handoff_closeout_id: 'bad_response_decision_evidence_archive_external_record_request_closeout_handoff_closeout',
    approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_handoff: { ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF, local_only: false },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response decision evidence archive external record request closeout handoff closeout must reject non-local source handoff');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local decision evidence archive external record request closeout handoff closeout error must name local_only');
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveExternalRecordRequestCloseoutHandoffCloseout({
    approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_handoff_closeout_id: 'sk_live_bad_secret_value',
    approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_handoff: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response decision evidence archive external record request closeout handoff closeout must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveExternalRecordRequestCloseoutHandoffCloseout({
    approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_handoff_closeout_id: 'bad_response_decision_evidence_archive_external_record_request_closeout_handoff_closeout_missing_repayment_failure',
    approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_handoff: {
      ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF,
      module_order: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF.module_order.filter((moduleName) => moduleName !== 'repayment_failure'),
    },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response decision evidence archive external record request closeout handoff closeout must reject source handoffs without repayment_failure module coverage');
} catch (error) {
  if (!String(error.message).includes('repayment_failure')) fail('Missing repayment_failure error must be explicit');
}

assertIncludes(context, 'Smart contract local replay approval decision external owner response decision evidence archive external record request closeout handoff closeout validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-approval-decision-external-owner-response-decision-evidence-archive-external-record-request-closeout-handoff-closeout', contextPath);
assertIncludes(backlog, 'Smart contract local replay approval decision external owner response decision evidence archive external record request closeout handoff closeout', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay approval decision external owner response decision evidence archive external record request closeout handoff closeout', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-approval-decision-external-owner-response-decision-evidence-archive-external-record-request-closeout-handoff-closeout';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_handoff_closeout: helperPath,
  decision_evidence_archive_external_record_request_closeout_handoff_closeout_status: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_CLOSEOUT.decision_evidence_archive_external_record_request_closeout_handoff_closeout_status,
}, null, 2));
