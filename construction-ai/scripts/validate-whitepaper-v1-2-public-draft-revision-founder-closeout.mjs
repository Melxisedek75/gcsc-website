import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const closeoutPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-revision-founder-closeout.md');
const outputIntakePath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-revision-output-intake.md');
const integrationLedgerPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-revision-integration-ledger.md');
const workerPacketPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-revision-worker-packet.md');
const draftPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft.md');
const reviewReportPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-review-report.md');
const founderReviewPacketPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-founder-review-packet.md');
const goNoGoPath = resolve('..', 'docs', 'whitepaper-v1-2-publication-go-no-go-checklist.md');
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

const closeout = readRequired(closeoutPath);
const outputIntake = readRequired(outputIntakePath);
const integrationLedger = readRequired(integrationLedgerPath);
const workerPacket = readRequired(workerPacketPath);
const draft = readRequired(draftPath);
const reviewReport = readRequired(reviewReportPath);
const founderReviewPacket = readRequired(founderReviewPacketPath);
const goNoGo = readRequired(goNoGoPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);

for (const heading of [
  'Whitepaper v1.2 Public Draft Revision Founder Closeout',
  'Status: INTERNAL_FOUNDER_CLOSEOUT_ONLY',
  'Purpose',
  'What This Does Not Approve',
  'Source Documents',
  'Founder Closeout Summary',
  'Closeout Decision Options',
  'Required Evidence Before Founder Review',
  'Automatic HOLD Rules',
  'Founder Copy/Paste Closeout',
  'Required Checks',
  'Acceptance Check',
]) {
  assertIncludes(closeout, heading, closeoutPath);
}

for (const snippet of [
  'does not approve public publication',
  'does not approve website edits',
  'does not approve investor, grant, partner, provider, legal, or finance sharing',
  'does not approve live Supabase changes, deployment, external account changes, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, public launch, or money movement',
  'docs/whitepaper-v1-2-public-draft-revision-output-intake.md',
  'docs/whitepaper-v1-2-public-draft-revision-integration-ledger.md',
  'docs/whitepaper-v1-2-public-draft-revision-worker-packet.md',
  'docs/whitepaper-v1-2-public-draft.md',
  'docs/whitepaper-v1-2-public-draft-review-report.md',
  'docs/whitepaper-v1-2-public-draft-founder-review-packet.md',
  'docs/whitepaper-v1-2-publication-go-no-go-checklist.md',
  'READY_FOR_FOUNDER_REVIEW',
  'REVISE_LOCAL_ONLY',
  'HOLD_FOR_REDACTION',
  'HOLD_FOR_CLAIM_RISK_REVIEW',
  'HOLD_FOR_LEGAL_PROVIDER_REVIEW',
  'PUBLICATION_BLOCKED',
  'INTERNAL_DRAFT_ONLY',
  'REVIEW_REPORT_ONLY',
  'source_worker and intake_record_id are present',
  'integration ledger closeout_state is INTEGRATED_LOCAL_ONLY or REVISED_LOCAL_ONLY',
  'required_validator has passed in the current working session',
  'redaction_status is REDACTED or NO_PRIVATE_DATA_PRESENT',
  'publication_status is INTERNAL_DRAFT_ONLY, REVIEW_REPORT_ONLY, or PUBLICATION_BLOCKED',
  'founder review can approve only internal wording direction',
  'Missing intake linkage, missing validator evidence, missing redaction status, missing publication status, or missing review-report update defaults to HOLD_FOR_REDACTION or HOLD_FOR_CLAIM_RISK_REVIEW',
  'Any private data, screenshots, recordings, raw logs, Magic Link URLs, provider credentials, API keys, database URLs, wallet data, payment data, or secret-looking value defaults to HOLD_FOR_REDACTION',
  'Any claim that public publication, legal review, provider review, live loans, live escrow, repayment routing, stablecoin settlement, token collateral, AI final authority, deployment, or public launch is ready defaults to HOLD_FOR_CLAIM_RISK_REVIEW',
  'Any legal/provider/finance-provider wording that needs outside judgment defaults to HOLD_FOR_LEGAL_PROVIDER_REVIEW',
  'Do not publish',
  'Do not edit whitepaper.html',
  'Do not send investor, grant, partner, legal, or provider material',
  'Do not change live Supabase, deployment, payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store settings, or public launch status',
  'npm run check:whitepaper-v1-2-public-draft-revision-founder-closeout',
  'npm run check:whitepaper-v1-2-public-draft-revision-output-intake',
  'npm run check:whitepaper-v1-2-public-draft-revision-integration-ledger',
  'npm run check:whitepaper-v1-2-public-draft',
  'npm run check:real-status-audit',
]) {
  assertIncludes(closeout, snippet, closeoutPath);
}

for (const [content, snippet, label] of [
  [outputIntake, 'Whitepaper v1.2 Public Draft Revision Output Intake', outputIntakePath],
  [integrationLedger, 'Whitepaper v1.2 Public Draft Revision Integration Ledger', integrationLedgerPath],
  [workerPacket, 'Whitepaper v1.2 Public Draft Revision Worker Packet', workerPacketPath],
  [draft, 'Whitepaper v1.2 Public Draft', draftPath],
  [reviewReport, 'Whitepaper v1.2 Public Draft Review Report', reviewReportPath],
  [founderReviewPacket, 'Whitepaper v1.2 Public Draft Founder Review Packet', founderReviewPacketPath],
  [goNoGo, 'GCSC Whitepaper v1.2 Publication Go/No-Go Checklist', goNoGoPath],
]) {
  assertIncludes(content, snippet, label);
}

if (packageJson.scripts?.['check:whitepaper-v1-2-public-draft-revision-founder-closeout'] !== 'node scripts/validate-whitepaper-v1-2-public-draft-revision-founder-closeout.mjs') {
  fail(`${packagePath} must define check:whitepaper-v1-2-public-draft-revision-founder-closeout`);
}

assertIncludes(runner, '"check:whitepaper-v1-2-public-draft-revision-founder-closeout"', runnerPath);
assertIncludes(context, 'Whitepaper v1.2 public draft revision founder closeout', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-public-draft-revision-founder-closeout', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 public draft revision founder closeout', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-public-draft-revision-founder-closeout', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 public draft revision founder closeout', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(closeout)) {
  fail('Founder closeout must not contain secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_draft_revision_founder_closeout: closeoutPath,
  decision_options_checked: 5,
  safety_boundaries_checked: true,
}, null, 2));
