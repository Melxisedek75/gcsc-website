import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

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
  'Whitepaper v1.2 Public Draft Final Assembly Founder Wording Decision Record',
  'Status: LOCAL_ONLY_FOUNDER_WORDING_DECISION_RECORD',
  'Purpose',
  'Decision Inputs',
  'Decision Record Fields',
  'Allowed Founder Decisions',
  'Founder Wording Notes',
  'Non-Approval Boundary',
  'Post-Decision Routing',
  'Required Checks',
  'Acceptance Check',
]) {
  assertIncludes(decisionRecord, heading, decisionRecordPath);
}

for (const snippet of [
  'does not approve public publication',
  'does not approve website edits',
  'does not approve external sharing',
  'does not approve deployment',
  'does not approve live Supabase',
  'does not approve payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch',
  'LOCAL_ONLY_FOUNDER_WORDING_DECISION_RECORD',
  'docs/whitepaper-v1-2-public-draft-final-assembly-review-packet.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-checklist.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-plan.md',
  'docs/whitepaper-v1-2-public-draft.md',
  'docs/whitepaper-v1-2-public-draft-review-report.md',
  'decision_record_id',
  'review_packet_id',
  'assembly_id',
  'founder_decision',
  'decision_scope',
  'wording_sections_accepted',
  'wording_sections_to_revise',
  'claim_risk_notes',
  'redaction_notes',
  'review_report_update_required',
  'latest_check_run',
  'blocked_next_actions',
  'ACCEPT_INTERNAL_WORDING_DIRECTION',
  'REVISE_LOCAL_ONLY',
  'HOLD_FOR_CLAIM_RISK_REVIEW',
  'HOLD_FOR_REDACTION',
  'HOLD_FOR_LEGAL_PROVIDER_REVIEW',
  'NO_PUBLICATION_AUTHORITY',
  'founder can approve only internal wording direction',
  'most restrictive source state wins',
  'no new public claims',
  'redaction confirmed before sharing',
  'publish',
  'edit whitepaper.html',
  'send investor, grant, partner, provider, legal, or finance material',
  'change live Supabase',
  'deploy',
  'enable payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-wording-decision-record',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-review-packet',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-checklist',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-plan',
  'npm run check:whitepaper-v1-2-public-draft',
  'npm run check:real-status-audit',
  'npm run check',
]) {
  assertIncludes(decisionRecord, snippet, decisionRecordPath);
}

for (const [content, snippet, label] of [
  [reviewPacket, 'Whitepaper v1.2 Public Draft Final Assembly Review Packet', reviewPacketPath],
  [checklist, 'Whitepaper v1.2 Public Draft Final Assembly Checklist', checklistPath],
  [plan, 'Whitepaper v1.2 Public Draft Final Assembly Plan', planPath],
  [draft, 'Whitepaper v1.2 Public Draft', draftPath],
  [reviewReport, 'Whitepaper v1.2 Public Draft Review Report', reviewReportPath],
]) {
  assertIncludes(content, snippet, label);
}

if (packageJson.scripts?.['check:whitepaper-v1-2-public-draft-final-assembly-founder-wording-decision-record'] !== 'node scripts/validate-whitepaper-v1-2-public-draft-final-assembly-founder-wording-decision-record.mjs') {
  fail(`${packagePath} must define check:whitepaper-v1-2-public-draft-final-assembly-founder-wording-decision-record`);
}

assertIncludes(runner, '"check:whitepaper-v1-2-public-draft-final-assembly-founder-wording-decision-record"', runnerPath);
assertIncludes(ciWorkflowValidator, "'check:whitepaper-v1-2-public-draft-final-assembly-founder-wording-decision-record'", ciWorkflowValidatorPath);
assertIncludes(context, 'Whitepaper v1.2 public draft final assembly founder wording decision record', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-public-draft-final-assembly-founder-wording-decision-record', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 public draft final assembly founder wording decision record', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-public-draft-final-assembly-founder-wording-decision-record', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 public draft final assembly founder wording decision record', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(decisionRecord)) {
  fail('Founder wording decision record must not contain secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  founder_wording_decision_record: decisionRecordPath,
  allowed_decisions_checked: 6,
  safety_boundaries_checked: true,
}, null, 2));
