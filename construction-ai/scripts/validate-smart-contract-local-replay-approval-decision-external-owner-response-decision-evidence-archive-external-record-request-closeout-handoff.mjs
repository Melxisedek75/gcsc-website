import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT } from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveExternalRecordRequestCloseout.mjs';
import {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveExternalRecordRequestCloseoutHandoff,
  DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF,
  LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_STATUS,
  LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_ITEMS,
  REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_FIELDS,
} from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveExternalRecordRequestCloseoutHandoff.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveExternalRecordRequestCloseoutHandoff.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay approval decision external owner response decision evidence archive external record request closeout handoff validation failed: ${message}`);
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
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_FIELDS',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_ITEMS',
  'createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveExternalRecordRequestCloseoutHandoff',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF',
  'RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_PENDING_EXTERNAL_RECORDS',
  'RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_PENDING_EXTERNAL_RECORDS',
  'package_external_record_request_closeout_snapshot',
  'route_founder_legal_finance_security_xpr_review',
  'preserve_pending_external_records',
  'keep_live_authority_blocked',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_ITEMS',
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_FIELDS',
  'createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveExternalRecordRequestCloseoutHandoff',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_FIELDS.length < 30) {
  fail('Required approval decision external owner response decision evidence archive external record request closeout handoff fields are unexpectedly short');
}

for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF, field)) {
    fail(`Demo approval decision external owner response decision evidence archive external record request closeout handoff is missing ${field}`);
  }
}

for (const item of ['package_external_record_request_closeout_snapshot', 'route_founder_legal_finance_security_xpr_review', 'preserve_pending_external_records', 'keep_live_authority_blocked']) {
  if (!LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_ITEMS.includes(item)) {
    fail(`Decision evidence archive external record request closeout handoff items must include ${item}`);
  }
}

if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF.approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_id !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT.approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_id) {
  fail('Demo approval decision external owner response decision evidence archive external record request closeout handoff closeout id must match source closeout');
}

for (const blockedState of ['GO_FOR_LIVE', 'LIVE_APPROVED', 'AUTO_APPROVED']) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF.accepted_decision_record_states.includes(blockedState)) {
    fail(`Decision evidence archive external record request closeout handoff must not accept ${blockedState}`);
  }
}

for (const [field, value] of Object.entries(LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF_STATUS)) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF[field] !== value) {
    fail(`Approval decision external owner response decision evidence archive external record request closeout handoff status ${field} must stay ${value}`);
  }
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveExternalRecordRequestCloseoutHandoff({
    approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_handoff_id: 'bad_response_decision_evidence_archive_external_record_request_closeout_handoff',
    approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout: { ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT, local_only: false },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response decision evidence archive external record request closeout handoff must reject non-local source closeout');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local decision evidence archive external record request closeout handoff error must name local_only');
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchiveExternalRecordRequestCloseoutHandoff({
    approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_handoff_id: 'sk_live_bad_secret_value',
    approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response decision evidence archive external record request closeout handoff must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay approval decision external owner response decision evidence archive external record request closeout handoff validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-approval-decision-external-owner-response-decision-evidence-archive-external-record-request-closeout-handoff', contextPath);
assertIncludes(backlog, 'Smart contract local replay approval decision external owner response decision evidence archive external record request closeout handoff', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay approval decision external owner response decision evidence archive external record request closeout handoff', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-approval-decision-external-owner-response-decision-evidence-archive-external-record-request-closeout-handoff';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_approval_decision_external_owner_response_decision_evidence_archive_external_record_request_closeout_handoff: helperPath,
  decision_evidence_archive_external_record_request_closeout_handoff_status: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_EXTERNAL_RECORD_REQUEST_CLOSEOUT_HANDOFF.decision_evidence_archive_external_record_request_closeout_handoff_status,
}, null, 2));
