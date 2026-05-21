import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const assemblyPlanPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-plan.md');
const founderCloseoutPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-revision-founder-closeout.md');
const integrationLedgerPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-revision-integration-ledger.md');
const outputIntakePath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-revision-output-intake.md');
const draftPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft.md');
const reviewReportPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-review-report.md');
const publicationGoNoGoPath = resolve('..', 'docs', 'whitepaper-v1-2-publication-go-no-go-checklist.md');
const publicationDryRunPath = resolve('..', 'docs', 'whitepaper-v1-2-publication-dry-run.md');
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

const assemblyPlan = readRequired(assemblyPlanPath);
const founderCloseout = readRequired(founderCloseoutPath);
const integrationLedger = readRequired(integrationLedgerPath);
const outputIntake = readRequired(outputIntakePath);
const draft = readRequired(draftPath);
const reviewReport = readRequired(reviewReportPath);
const publicationGoNoGo = readRequired(publicationGoNoGoPath);
const publicationDryRun = readRequired(publicationDryRunPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciWorkflowValidator = readRequired(ciWorkflowValidatorPath);

for (const heading of [
  'Whitepaper v1.2 Public Draft Final Assembly Plan',
  'Status: LOCAL_ONLY_FINAL_ASSEMBLY_PLAN',
  'Purpose',
  'What This Does Not Approve',
  'Required Source Inputs',
  'Assembly Packet Fields',
  'Allowed Assembly States',
  'Assembly Sequence',
  'Claim And Redaction Gates',
  'Founder Review Output',
  'Still Blocked After Assembly',
  'Required Checks',
  'Acceptance Check',
]) {
  assertIncludes(assemblyPlan, heading, assemblyPlanPath);
}

for (const snippet of [
  'does not approve public publication',
  'does not approve website edits',
  'does not approve investor, grant, partner, provider, legal, or finance sharing',
  'does not approve live Supabase changes, deployment, external account changes, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, public launch, or money movement',
  'LOCAL_ONLY_FINAL_ASSEMBLY_PLAN',
  'docs/whitepaper-v1-2-public-draft-revision-founder-closeout.md',
  'docs/whitepaper-v1-2-public-draft-revision-integration-ledger.md',
  'docs/whitepaper-v1-2-public-draft-revision-output-intake.md',
  'docs/whitepaper-v1-2-public-draft.md',
  'docs/whitepaper-v1-2-public-draft-review-report.md',
  'docs/whitepaper-v1-2-publication-go-no-go-checklist.md',
  'docs/whitepaper-v1-2-publication-dry-run.md',
  'assembly_id',
  'source_closeout_id',
  'source_integration_ids',
  'source_intake_ids',
  'target_draft_version',
  'source_commit',
  'latest_check_run',
  'sections_to_touch',
  'sections_not_to_touch',
  'claim_risk_class',
  'redaction_status',
  'review_report_update_required',
  'publication_status',
  'founder_review_status',
  'blocked_next_actions',
  'assembly_evidence',
  'READY_FOR_LOCAL_ASSEMBLY',
  'ASSEMBLED_LOCAL_ONLY',
  'REVISE_LOCAL_ONLY',
  'HOLD_FOR_REDACTION',
  'HOLD_FOR_CLAIM_RISK_REVIEW',
  'HOLD_FOR_FOUNDER_REVIEW',
  'HOLD_FOR_LEGAL_PROVIDER_REVIEW',
  'PUBLICATION_BLOCKED',
  'INTERNAL_DRAFT_ONLY',
  'REVIEW_REPORT_ONLY',
  'most restrictive source state wins',
  'no new public claims',
  'no unreviewed legal, provider, finance, loan, escrow, repayment, stablecoin, token, securities, tax, or return language',
  'redaction confirmed before sharing',
  'review report updated with every assembled change',
  'founder can approve only internal wording direction',
  'publish',
  'edit whitepaper.html',
  'send investor, grant, partner, provider, legal, or finance material',
  'change live Supabase',
  'deploy',
  'enable payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-plan',
  'npm run check:whitepaper-v1-2-public-draft-revision-founder-closeout',
  'npm run check:whitepaper-v1-2-public-draft-revision-integration-ledger',
  'npm run check:whitepaper-v1-2-public-draft-revision-output-intake',
  'npm run check:whitepaper-v1-2-public-draft',
  'npm run check:whitepaper-v1-2-publication-go-no-go',
  'npm run check:real-status-audit',
  'npm run check',
]) {
  assertIncludes(assemblyPlan, snippet, assemblyPlanPath);
}

for (const [content, snippet, label] of [
  [founderCloseout, 'Whitepaper v1.2 Public Draft Revision Founder Closeout', founderCloseoutPath],
  [integrationLedger, 'Whitepaper v1.2 Public Draft Revision Integration Ledger', integrationLedgerPath],
  [outputIntake, 'Whitepaper v1.2 Public Draft Revision Output Intake', outputIntakePath],
  [draft, 'Whitepaper v1.2 Public Draft', draftPath],
  [reviewReport, 'Whitepaper v1.2 Public Draft Review Report', reviewReportPath],
  [publicationGoNoGo, 'GCSC Whitepaper v1.2 Publication Go/No-Go Checklist', publicationGoNoGoPath],
  [publicationDryRun, 'GCSC Whitepaper v1.2 Publication Dry Run', publicationDryRunPath],
]) {
  assertIncludes(content, snippet, label);
}

if (packageJson.scripts?.['check:whitepaper-v1-2-public-draft-final-assembly-plan'] !== 'node scripts/validate-whitepaper-v1-2-public-draft-final-assembly-plan.mjs') {
  fail(`${packagePath} must define check:whitepaper-v1-2-public-draft-final-assembly-plan`);
}

assertIncludes(runner, '"check:whitepaper-v1-2-public-draft-final-assembly-plan"', runnerPath);
assertIncludes(ciWorkflowValidator, "'check:whitepaper-v1-2-public-draft-final-assembly-plan'", ciWorkflowValidatorPath);
assertIncludes(context, 'Whitepaper v1.2 public draft final assembly plan', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-public-draft-final-assembly-plan', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 public draft final assembly plan', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-public-draft-final-assembly-plan', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 public draft final assembly plan', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(assemblyPlan)) {
  fail('Final assembly plan must not contain secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_draft_final_assembly_plan: assemblyPlanPath,
  assembly_states_checked: 7,
  safety_boundaries_checked: true,
}, null, 2));
