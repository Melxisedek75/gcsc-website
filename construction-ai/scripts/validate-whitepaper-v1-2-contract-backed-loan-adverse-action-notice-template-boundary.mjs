import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const boundaryPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-adverse-action-notice-template-boundary.md');
const reviewPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review.md');
const taxonomyPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy.md');
const requirementsPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-technical-requirements.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan adverse-action notice template boundary validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const boundary = readRequired(boundaryPath);
const review = readRequired(reviewPath);
const taxonomy = readRequired(taxonomyPath);
const requirements = readRequired(requirementsPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);
const ciValidator = readRequired(ciValidatorPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Adverse-Action Notice Template Boundary',
  'Purpose',
  'Status Boundary',
  'Placeholder Template Fields',
  'Required Placeholder Sections',
  'Language Boundaries',
  'Delivery And Retention Boundary',
  'Reviewer Approval Boundary',
  'Blocked Live Actions',
  'Required Checks',
]) assertIncludes(boundary, section, boundaryPath);

for (const required of [
  'LOCAL_ONLY_NOTICE_TEMPLATE_BOUNDARY',
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
  'MORE_INFO_NEEDED_DRAFT',
  'HELD_FOR_REVIEW_DRAFT',
  'REDUCED_AMOUNT_DRAFT',
  'DECLINED_DRAFT',
  'notice_template_version',
  'applicant_profile_id',
  'request_id',
  'decision_type',
  'principal_reasons',
  'data_sources_used',
  'reviewer_role',
  'appeal_window_status',
  'delivery_status',
  'retention_status',
  'redaction_status',
  'source_commit',
  'No final adverse-action wording',
  'No automated-only AI explanation',
  'No APR, fee, repayment, escrow, stablecoin, token collateral, or provider commitment',
  'Human reviewer required',
  'Legal/provider approval required',
  'Finance-provider approval required',
  'Founder approval required',
  'no secrets',
  'Do not send passwords',
  'private keys',
  'API keys',
  'service-role keys',
  'wallet seed phrases',
  'bank data',
  'credit reports',
  'raw applicant personal data',
  'provider credentials',
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
  'docs/whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review.md',
  'docs/whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy.md',
  'docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md',
  'npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-notice-template-boundary',
  'npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy',
  'npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review',
  'npm run check',
]) assertIncludes(boundary, required, boundaryPath);

assertIncludes(review, 'notice template ownership', reviewPath);
assertIncludes(taxonomy, 'Notice Template Boundary', taxonomyPath);
assertIncludes(requirements, 'Adverse Action And Denial Notice Boundary', requirementsPath);
assertIncludes(context, 'Whitepaper v1.2 contract-backed loan adverse-action notice template boundary', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-adverse-action-notice-template-boundary', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan adverse-action notice template boundary', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-adverse-action-notice-template-boundary', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan adverse-action notice template boundary', auditPath);
assertIncludes(packageJson, '"check:whitepaper-v1-2-contract-backed-loan-adverse-action-notice-template-boundary"', packagePath);
assertIncludes(runner, '"check:whitepaper-v1-2-contract-backed-loan-adverse-action-notice-template-boundary"', runnerPath);
assertIncludes(ciValidator, 'check:whitepaper-v1-2-contract-backed-loan-adverse-action-notice-template-boundary', ciValidatorPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(boundary)) {
  fail('Adverse-action notice template boundary must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  adverse_action_notice_template_boundary: boundaryPath,
  local_only_boundary_checked: true,
  placeholder_notice_fields_checked: true,
  no_secret_scan_checked: true,
}, null, 2));
