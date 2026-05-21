import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ledgerPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger.md');
const localChangePacketPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-local-change-packet.md');
const decisionRecordPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-founder-wording-decision-record.md');
const reviewPacketPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-review-packet.md');
const checklistPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-checklist.md');
const planPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-plan.md');
const draftPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft.md');
const reviewReportPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-review-report.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciWorkflowValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

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
const localChangePacket = readRequired(localChangePacketPath);
const decisionRecord = readRequired(decisionRecordPath);
const reviewPacket = readRequired(reviewPacketPath);
const checklist = readRequired(checklistPath);
const plan = readRequired(planPath);
const draft = readRequired(draftPath);
const reviewReport = readRequired(reviewReportPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciWorkflowValidator = readRequired(ciWorkflowValidatorPath);

for (const heading of [
  'Whitepaper v1.2 Public Draft Final Assembly Review Report Delta Ledger',
  'Status: LOCAL_ONLY_REVIEW_REPORT_DELTA_LEDGER',
  'Purpose',
  'Linked Inputs',
  'Ledger Entry Fields',
  'Allowed Delta States',
  'Review Report Delta Rules',
  'Claim And Redaction Gates',
  'Blocked Next Actions',
  'Required Checks',
  'Acceptance Check',
]) {
  assertIncludes(ledger, heading, ledgerPath);
}

for (const snippet of [
  'does not approve public publication',
  'does not approve website edits',
  'does not approve external sharing',
  'does not approve deployment',
  'does not approve live Supabase',
  'does not approve payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch',
  'LOCAL_ONLY_REVIEW_REPORT_DELTA_LEDGER',
  'docs/whitepaper-v1-2-public-draft-final-assembly-local-change-packet.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-founder-wording-decision-record.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-review-packet.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-checklist.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-plan.md',
  'docs/whitepaper-v1-2-public-draft.md',
  'docs/whitepaper-v1-2-public-draft-review-report.md',
  'delta_ledger_id',
  'change_packet_id',
  'decision_record_id',
  'review_report_section',
  'draft_section',
  'source_before_summary',
  'local_after_summary',
  'claim_risk_delta',
  'redaction_delta',
  'blocked_action_delta',
  'latest_check_run',
  'reviewer_notes',
  'READY_FOR_DELTA_ENTRY',
  'APPLY_REVIEW_REPORT_DELTA_LOCAL_ONLY',
  'REVISE_DELTA_LOCAL_ONLY',
  'HOLD_FOR_FOUNDER_REVIEW',
  'HOLD_FOR_CLAIM_RISK_REVIEW',
  'HOLD_FOR_REDACTION',
  'HOLD_FOR_LEGAL_PROVIDER_REVIEW',
  'PUBLICATION_BLOCKED',
  'INTERNAL_REVIEW_ONLY',
  'most restrictive source state wins',
  'every local wording change must have a review report delta',
  'no new public claims',
  'redaction confirmed before sharing',
  'review report updated before external use',
  'publish',
  'edit whitepaper.html',
  'send investor, grant, partner, provider, legal, or finance material',
  'change live Supabase',
  'deploy',
  'enable payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-local-change-packet',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-wording-decision-record',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-review-packet',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-checklist',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-plan',
  'npm run check:whitepaper-v1-2-public-draft',
  'npm run check:real-status-audit',
  'npm run check',
]) {
  assertIncludes(ledger, snippet, ledgerPath);
}

for (const [content, snippet, label] of [
  [localChangePacket, 'Whitepaper v1.2 Public Draft Final Assembly Local Change Packet', localChangePacketPath],
  [decisionRecord, 'Whitepaper v1.2 Public Draft Final Assembly Founder Wording Decision Record', decisionRecordPath],
  [reviewPacket, 'Whitepaper v1.2 Public Draft Final Assembly Review Packet', reviewPacketPath],
  [checklist, 'Whitepaper v1.2 Public Draft Final Assembly Checklist', checklistPath],
  [plan, 'Whitepaper v1.2 Public Draft Final Assembly Plan', planPath],
  [draft, 'Whitepaper v1.2 Public Draft', draftPath],
  [reviewReport, 'Whitepaper v1.2 Public Draft Review Report', reviewReportPath],
]) {
  assertIncludes(content, snippet, label);
}

if (packageJson.scripts?.['check:whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger'] !== 'node scripts/validate-whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger.mjs') {
  fail(`${packagePath} must define check:whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger`);
}

assertIncludes(runner, '"check:whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger"', runnerPath);
assertIncludes(ciWorkflowValidator, "'check:whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger'", ciWorkflowValidatorPath);
assertIncludes(context, 'Whitepaper v1.2 public draft final assembly review report delta ledger', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 public draft final assembly review report delta ledger', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 public draft final assembly review report delta ledger', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(ledger)) {
  fail('Review report delta ledger must not contain secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  review_report_delta_ledger: ledgerPath,
  delta_states_checked: 8,
  safety_boundaries_checked: true,
}, null, 2));
