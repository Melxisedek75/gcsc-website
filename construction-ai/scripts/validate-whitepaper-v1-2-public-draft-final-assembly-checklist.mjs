import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const checklistPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-checklist.md');
const planPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-plan.md');
const founderCloseoutPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-revision-founder-closeout.md');
const integrationLedgerPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-revision-integration-ledger.md');
const outputIntakePath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-revision-output-intake.md');
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

const checklist = readRequired(checklistPath);
const plan = readRequired(planPath);
const founderCloseout = readRequired(founderCloseoutPath);
const integrationLedger = readRequired(integrationLedgerPath);
const outputIntake = readRequired(outputIntakePath);
const draft = readRequired(draftPath);
const reviewReport = readRequired(reviewReportPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciWorkflowValidator = readRequired(ciWorkflowValidatorPath);

for (const heading of [
  'Whitepaper v1.2 Public Draft Final Assembly Checklist',
  'Status: LOCAL_ONLY_FINAL_ASSEMBLY_CHECKLIST',
  'Purpose',
  'Prerequisites',
  'Assembly Checklist',
  'Claim Review Checklist',
  'Redaction Checklist',
  'Review Report Checklist',
  'Founder Handoff Checklist',
  'Stop Conditions',
  'Required Checks',
  'Acceptance Check',
]) {
  assertIncludes(checklist, heading, checklistPath);
}

for (const snippet of [
  'does not approve public publication',
  'does not approve website edits',
  'does not approve external sharing',
  'does not approve deployment',
  'does not approve live Supabase',
  'does not approve payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch',
  'LOCAL_ONLY_FINAL_ASSEMBLY_CHECKLIST',
  'docs/whitepaper-v1-2-public-draft-final-assembly-plan.md',
  'docs/whitepaper-v1-2-public-draft-revision-founder-closeout.md',
  'docs/whitepaper-v1-2-public-draft-revision-integration-ledger.md',
  'docs/whitepaper-v1-2-public-draft-revision-output-intake.md',
  'docs/whitepaper-v1-2-public-draft.md',
  'docs/whitepaper-v1-2-public-draft-review-report.md',
  'source_closeout_id recorded',
  'source_integration_ids recorded',
  'source_intake_ids recorded',
  'source_commit recorded',
  'latest_check_run recorded',
  'sections_to_touch listed',
  'sections_not_to_touch listed',
  'most restrictive source state wins',
  'PUBLICATION_BLOCKED',
  'INTERNAL_DRAFT_ONLY',
  'REVIEW_REPORT_ONLY',
  'no new public claims',
  'no unreviewed legal, provider, finance, loan, escrow, repayment, stablecoin, token, securities, tax, or return language',
  'no private data, screenshots, recordings, raw logs, Magic Link URLs, provider credentials, API keys, database URLs, wallet data, payment data, or secret-looking values',
  'review report updated for every assembled change',
  'founder can review internal wording direction only',
  'publish',
  'edit whitepaper.html',
  'send investor, grant, partner, provider, legal, or finance material',
  'change live Supabase',
  'deploy',
  'enable payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-checklist',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-plan',
  'npm run check:whitepaper-v1-2-public-draft-revision-founder-closeout',
  'npm run check:whitepaper-v1-2-public-draft-revision-integration-ledger',
  'npm run check:whitepaper-v1-2-public-draft-revision-output-intake',
  'npm run check:whitepaper-v1-2-public-draft',
  'npm run check:real-status-audit',
]) {
  assertIncludes(checklist, snippet, checklistPath);
}

for (const [content, snippet, label] of [
  [plan, 'Whitepaper v1.2 Public Draft Final Assembly Plan', planPath],
  [founderCloseout, 'Whitepaper v1.2 Public Draft Revision Founder Closeout', founderCloseoutPath],
  [integrationLedger, 'Whitepaper v1.2 Public Draft Revision Integration Ledger', integrationLedgerPath],
  [outputIntake, 'Whitepaper v1.2 Public Draft Revision Output Intake', outputIntakePath],
  [draft, 'Whitepaper v1.2 Public Draft', draftPath],
  [reviewReport, 'Whitepaper v1.2 Public Draft Review Report', reviewReportPath],
]) {
  assertIncludes(content, snippet, label);
}

if (packageJson.scripts?.['check:whitepaper-v1-2-public-draft-final-assembly-checklist'] !== 'node scripts/validate-whitepaper-v1-2-public-draft-final-assembly-checklist.mjs') {
  fail(`${packagePath} must define check:whitepaper-v1-2-public-draft-final-assembly-checklist`);
}

assertIncludes(runner, '"check:whitepaper-v1-2-public-draft-final-assembly-checklist"', runnerPath);
assertIncludes(ciWorkflowValidator, "'check:whitepaper-v1-2-public-draft-final-assembly-checklist'", ciWorkflowValidatorPath);
assertIncludes(context, 'Whitepaper v1.2 public draft final assembly checklist', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-public-draft-final-assembly-checklist', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 public draft final assembly checklist', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-public-draft-final-assembly-checklist', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 public draft final assembly checklist', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(checklist)) {
  fail('Final assembly checklist must not contain secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_draft_final_assembly_checklist: checklistPath,
  checklist_groups_checked: 5,
  safety_boundaries_checked: true,
}, null, 2));
