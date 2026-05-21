import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const templatePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-adverse-action-approval-evidence-template.md');
const noticeBoundaryPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-adverse-action-notice-template-boundary.md');
const reviewPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review.md');
const taxonomyPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan adverse-action approval evidence template validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const template = readRequired(templatePath);
const noticeBoundary = readRequired(noticeBoundaryPath);
const review = readRequired(reviewPath);
const taxonomy = readRequired(taxonomyPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);
const ciValidator = readRequired(ciValidatorPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Adverse-Action Approval Evidence Template',
  'Purpose',
  'Evidence Record',
  'Required Approval Roles',
  'Default HOLD Rules',
  'Safe Evidence Rules',
  'Blocked Live Actions',
  'Required Linked Files',
  'Required Checks',
]) assertIncludes(template, section, templatePath);

for (const required of [
  'LOCAL_ONLY_ADVERSE_ACTION_APPROVAL_EVIDENCE',
  'not legal advice',
  'not a denial notice',
  'not provider approval',
  'not lender approval',
  'not approval to send notices',
  'not approval to deny real credit',
  'not approval for credit-bureau reporting',
  'not contractor-facing live copy',
  'HOLD_FOR_ADVERSE_ACTION_REVIEW',
  'LOCAL_DRAFT_ADVERSE_ACTION_TRACE',
  'BLOCKED_FOR_LIVE_LOAN',
  'Evidence ID',
  'Evidence date',
  'Source file',
  'Source commit',
  'Latest check run',
  'Reviewer role',
  'Reviewer decision',
  'APPROVED, REVISION_REQUIRED, REJECTED, or HOLD',
  'Reviewed artifact',
  'Notice template version',
  'Reason-code taxonomy version',
  'Decision type scope',
  'Principal reasons reviewed',
  'Data sources reviewed',
  'Delivery status reviewed',
  'Retention status reviewed',
  'Appeal/correction status reviewed',
  'Redaction status reviewed',
  'Public-use status',
  'Live-use status',
  'Founder approval required',
  'Legal/provider approval required',
  'Finance-provider approval required',
  'Human reviewer required',
  'Compliance reviewer required',
  'Technical reviewer required',
  'If any required approval field is missing or unclear, the decision remains HOLD',
  'contractor-facing notice wording',
  'real credit decision',
  'credit-bureau reporting',
  'provider obligation',
  'repayment routing',
  'escrow activation',
  'stablecoin settlement',
  'token collateral',
  'Do not record passwords',
  'private keys',
  'API keys',
  'service-role keys',
  'wallet seed phrases',
  'bank data',
  'credit reports',
  'raw applicant personal data',
  'provider credentials',
  'Magic Link URLs',
  'unredacted screenshots',
  'send notices',
  'deny real credit',
  'approve real credit',
  'report to credit bureaus',
  'create legal determinations',
  'route repayments',
  'activate escrow',
  'settle stablecoins',
  'lock token collateral',
  'create provider obligations',
  'docs/whitepaper-v1-2-contract-backed-loan-adverse-action-notice-template-boundary.md',
  'docs/whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review.md',
  'docs/whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy.md',
  'npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-approval-evidence-template',
  'npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-notice-template-boundary',
  'npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review',
  'npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy',
  'npm run check',
]) assertIncludes(template, required, templatePath);

assertIncludes(noticeBoundary, 'Reviewer Approval Boundary', noticeBoundaryPath);
assertIncludes(review, 'Founder/Legal/Provider Decisions Required Before Live Use', reviewPath);
assertIncludes(taxonomy, 'Notice Template Boundary', taxonomyPath);
assertIncludes(context, 'Whitepaper v1.2 contract-backed loan adverse-action approval evidence template', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-adverse-action-approval-evidence-template', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan adverse-action approval evidence template', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-adverse-action-approval-evidence-template', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan adverse-action approval evidence template', auditPath);
assertIncludes(packageJson, '"check:whitepaper-v1-2-contract-backed-loan-adverse-action-approval-evidence-template"', packagePath);
assertIncludes(runner, '"check:whitepaper-v1-2-contract-backed-loan-adverse-action-approval-evidence-template"', runnerPath);
assertIncludes(ciValidator, 'check:whitepaper-v1-2-contract-backed-loan-adverse-action-approval-evidence-template', ciValidatorPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(template)) {
  fail('Adverse-action approval evidence template must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  adverse_action_approval_evidence_template: templatePath,
  approval_roles_checked: 6,
  blocked_live_actions_checked: true,
  no_secret_scan_checked: true,
}, null, 2));
