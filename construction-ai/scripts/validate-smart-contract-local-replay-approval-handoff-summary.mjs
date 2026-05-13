import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEMO_LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE } from '../src/smart-contracts/replay/localReplayApprovalEvidenceTemplate.mjs';
import {
  createLocalReplayApprovalHandoffSummary,
  DEMO_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY,
  LOCAL_REPLAY_APPROVAL_HANDOFF_ACTIONS,
  LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY_STATUS,
  LOCAL_REPLAY_BLOCKED_LIVE_ACTIONS,
  REQUIRED_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY_FIELDS,
} from '../src/smart-contracts/replay/localReplayApprovalHandoffSummary.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayApprovalHandoffSummary.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay approval handoff summary validation failed: ${message}`);
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
  'REQUIRED_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY_FIELDS',
  'LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY_STATUS',
  'LOCAL_REPLAY_APPROVAL_HANDOFF_ACTIONS',
  'LOCAL_REPLAY_BLOCKED_LIVE_ACTIONS',
  'createLocalReplayApprovalHandoffSummary',
  'DEMO_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY',
  'FOUNDER_EXTERNAL_REVIEW_HANDOFF_PENDING',
  'review_founder_approval_evidence',
  'review_legal_provider_evidence',
  'review_finance_provider_evidence',
  'review_security_evidence',
  'review_xpr_authority_evidence',
  'review_no_real_money_test_evidence',
  'no_live_xpr_signature',
  'no_real_payment',
  'no_real_loan',
  'no_real_escrow',
  'no_token_collateral_lock',
  'no_public_live_readiness_claim',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY',
  'LOCAL_REPLAY_APPROVAL_HANDOFF_ACTIONS',
  'LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY_STATUS',
  'LOCAL_REPLAY_BLOCKED_LIVE_ACTIONS',
  'REQUIRED_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY_FIELDS',
  'createLocalReplayApprovalHandoffSummary',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY_FIELDS.length < 15) {
  fail('Required approval handoff summary fields are unexpectedly short');
}

for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY, field)) {
    fail(`Demo approval handoff summary is missing ${field}`);
  }
}

for (const ownerAction of [
  'review_founder_approval_evidence',
  'review_legal_provider_evidence',
  'review_finance_provider_evidence',
  'review_security_evidence',
  'review_xpr_authority_evidence',
  'review_no_real_money_test_evidence',
]) {
  if (!LOCAL_REPLAY_APPROVAL_HANDOFF_ACTIONS.includes(ownerAction)) {
    fail(`Handoff actions must include ${ownerAction}`);
  }
}

for (const blockedAction of [
  'no_live_xpr_signature',
  'no_real_payment',
  'no_real_loan',
  'no_real_escrow',
  'no_token_collateral_lock',
  'no_public_live_readiness_claim',
]) {
  if (!LOCAL_REPLAY_BLOCKED_LIVE_ACTIONS.includes(blockedAction)) {
    fail(`Blocked live actions must include ${blockedAction}`);
  }
}

if (DEMO_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY.approval_evidence_template_id !== DEMO_LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE.approval_evidence_template_id) {
  fail('Demo approval handoff summary approval_evidence_template_id must match approval evidence template');
}
if (DEMO_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY.digest !== DEMO_LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE.digest) {
  fail('Demo approval handoff summary digest must match approval evidence template digest');
}

for (const [field, value] of Object.entries(LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY_STATUS)) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY[field] !== value) {
    fail(`Approval handoff summary status ${field} must stay ${value}`);
  }
}

try {
  createLocalReplayApprovalHandoffSummary({
    approval_handoff_summary_id: 'bad_approval_handoff_summary',
    approval_evidence_template: { ...DEMO_LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE, local_only: false },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval handoff summary must reject non-local evidence template');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local evidence template error must name local_only');
}

try {
  createLocalReplayApprovalHandoffSummary({
    approval_handoff_summary_id: 'bad_approval_handoff_summary',
    approval_evidence_template: { ...DEMO_LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE, evidence_status: 'EVIDENCE_APPROVED_FOR_LIVE' },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval handoff summary must reject approved evidence template');
} catch (error) {
  if (!String(error.message).includes('TEMPLATE_ONLY_PENDING_EXTERNAL_EVIDENCE')) {
    fail('Bad evidence status error must name TEMPLATE_ONLY_PENDING_EXTERNAL_EVIDENCE');
  }
}

try {
  createLocalReplayApprovalHandoffSummary({
    approval_handoff_summary_id: 'sk_live_bad_secret_value',
    approval_evidence_template: DEMO_LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval handoff summary must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay approval handoff summary validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-approval-handoff-summary', contextPath);
assertIncludes(backlog, 'Smart contract local replay approval handoff summary', backlogPath);
assertIncludes(backlog, 'check:smart-contract-local-replay-approval-handoff-summary', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay approval handoff summary', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-approval-handoff-summary';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_approval_handoff_summary: helperPath,
  handoff_status: DEMO_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY.handoff_status,
}, null, 2));
