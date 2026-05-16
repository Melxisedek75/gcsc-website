import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ledgerPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-revision-integration-ledger.md');
const outputIntakePath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-revision-output-intake.md');
const workerPacketPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-revision-worker-packet.md');
const checklistPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-revision-checklist.md');
const draftPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft.md');
const reviewReportPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-review-report.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message, details = {}) {
  console.error(JSON.stringify({ status: 'failed', message, ...details }, null, 2));
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail('Missing required file', { path });
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, label) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) {
    fail(`${label} missing required snippet`, { snippet });
  }
}

const ledger = readRequired(ledgerPath);
const outputIntake = readRequired(outputIntakePath);
const workerPacket = readRequired(workerPacketPath);
const checklist = readRequired(checklistPath);
const draft = readRequired(draftPath);
const reviewReport = readRequired(reviewReportPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);

for (const heading of [
  'Whitepaper v1.2 Public Draft Revision Integration Ledger',
  'Status: INTERNAL_INTEGRATION_LEDGER_ONLY',
  'Purpose',
  'What This Does Not Approve',
  'Source Documents',
  'Ledger Record Template',
  'Accepted Integration States',
  'Required Evidence Before Draft Update',
  'Automatic HOLD Rules',
  'Closeout Rules',
  'Required Checks',
  'Acceptance Check',
]) {
  assertIncludes(ledger, heading, ledgerPath);
}

for (const snippet of [
  'does not approve public publication',
  'does not approve website edits',
  'does not approve investor, grant, partner, provider, legal, or finance sharing',
  'does not approve live Supabase changes, deployment, external account changes, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or money movement',
  'docs/whitepaper-v1-2-public-draft-revision-output-intake.md',
  'docs/whitepaper-v1-2-public-draft-revision-worker-packet.md',
  'docs/whitepaper-v1-2-public-draft-revision-checklist.md',
  'docs/whitepaper-v1-2-public-draft.md',
  'docs/whitepaper-v1-2-public-draft-review-report.md',
  'integration_id',
  'intake_record_id',
  'source_worker',
  'source_files_read',
  'affected_sections',
  'claim_risk_class',
  'decision',
  'required_validator',
  'validator_result',
  'draft_files_changed',
  'review_report_updated',
  'owner',
  'publication_status',
  'redaction_status',
  'closeout_state',
  'INTEGRATED_LOCAL_ONLY',
  'REVISED_LOCAL_ONLY',
  'REJECTED',
  'HOLD_FOR_REVIEW',
  'HOLD_FOR_REDACTION',
  'HOLD_FOR_CLAIM_RISK_REVIEW',
  'HOLD_FOR_FOUNDER_REVIEW',
  'source_worker and intake_record_id are present',
  'required_validator has passed in the current working session',
  'review_report_updated is yes',
  'publication_status is INTERNAL_DRAFT_ONLY or REVIEW_REPORT_ONLY',
  'redaction_status is REDACTED or NO_PRIVATE_DATA_PRESENT',
  'closeout_state is INTEGRATED_LOCAL_ONLY or REVISED_LOCAL_ONLY',
  'Missing intake_record_id, missing validator_result, missing review_report_updated, missing publication_status, missing redaction_status, or missing closeout_state defaults to HOLD_FOR_REVIEW',
  'Any private data, screenshots, recordings, raw logs, Magic Link URLs, provider credentials, API keys, database URLs, wallet data, payment data, or secret-looking value defaults to HOLD_FOR_REDACTION',
  'Any unqualified claim that public publication, legal review, provider review, live loans, live escrow, repayment routing, stablecoin settlement, token collateral, AI final authority, deployment, or public launch is ready defaults to HOLD_FOR_CLAIM_RISK_REVIEW',
  'No ledger item can close as PUBLICATION_APPROVED, WEBSITE_READY, INVESTOR_READY, PROVIDER_READY, LEGAL_APPROVED, DEPLOY_READY, LIVE_READY, or MONEY_READY',
  'npm run check:whitepaper-v1-2-public-draft-revision-integration-ledger',
  'npm run check:whitepaper-v1-2-public-draft-revision-output-intake',
  'npm run check:whitepaper-v1-2-public-draft-revision-worker-packet',
  'npm run check:whitepaper-v1-2-public-draft',
  'npm run check:real-status-audit',
]) {
  assertIncludes(ledger, snippet, ledgerPath);
}

for (const [content, snippet, label] of [
  [outputIntake, 'Whitepaper v1.2 Public Draft Revision Output Intake', outputIntakePath],
  [workerPacket, 'Whitepaper v1.2 Public Draft Revision Worker Packet', workerPacketPath],
  [checklist, 'Whitepaper v1.2 Public Draft Revision Checklist', checklistPath],
  [draft, 'Whitepaper v1.2 Public Draft', draftPath],
  [reviewReport, 'Whitepaper v1.2 Public Draft Review Report', reviewReportPath],
]) {
  assertIncludes(content, snippet, label);
}

if (packageJson.scripts?.['check:whitepaper-v1-2-public-draft-revision-integration-ledger'] !== 'node scripts/validate-whitepaper-v1-2-public-draft-revision-integration-ledger.mjs') {
  fail(`${packagePath} must define check:whitepaper-v1-2-public-draft-revision-integration-ledger`);
}

assertIncludes(runner, '"check:whitepaper-v1-2-public-draft-revision-integration-ledger"', runnerPath);
assertIncludes(context, 'Whitepaper v1.2 public draft revision integration ledger', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-public-draft-revision-integration-ledger', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 public draft revision integration ledger', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-public-draft-revision-integration-ledger', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 public draft revision integration ledger', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(ledger)) {
  fail('Integration ledger must not contain secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_draft_revision_integration_ledger: ledgerPath,
  closeout_states_checked: 7,
  safety_boundaries_checked: true,
}, null, 2));
