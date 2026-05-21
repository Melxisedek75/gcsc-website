import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const taxonomyPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy.md');
const reviewPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review.md');
const requirementsPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-technical-requirements.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan adverse-action reason-code taxonomy validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const taxonomy = readRequired(taxonomyPath);
const review = readRequired(reviewPath);
const requirements = readRequired(requirementsPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);
const ciValidator = readRequired(ciValidatorPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Adverse-Action Reason-Code Taxonomy',
  'Purpose',
  'Status Boundaries',
  'Local Draft Reason Codes',
  'Data Source Mapping',
  'Notice Template Boundary',
  'Escalation And Review',
  'Blocked Live Actions',
  'Required Checks',
]) assertIncludes(taxonomy, section, taxonomyPath);

for (const required of [
  'LOCAL_ONLY_REASON_CODE_TAXONOMY',
  'not legal advice',
  'not a denial notice',
  'not provider approval',
  'not lender approval',
  'not approval to deny real credit',
  'not approval to send notices',
  'not approval for credit-bureau reporting',
  'HOLD_FOR_ADVERSE_ACTION_REVIEW',
  'LOCAL_DRAFT_ADVERSE_ACTION_TRACE',
  'BLOCKED_FOR_LIVE_LOAN',
  'MORE_INFO_NEEDED_DRAFT',
  'HELD_FOR_REVIEW_DRAFT',
  'REDUCED_AMOUNT_DRAFT',
  'DECLINED_DRAFT',
  'MISSING_IDENTITY_OR_BUSINESS_VERIFICATION',
  'MISSING_LICENSE_OR_INSURANCE_VERIFICATION',
  'INSUFFICIENT_PROJECT_CONTRACT_EVIDENCE',
  'UNVERIFIED_OWNER_ACCEPTANCE',
  'OPEN_DISPUTE_OR_UNRESOLVED_EVIDENCE',
  'MATERIAL_DRAW_EVIDENCE_INCOMPLETE',
  'PROVIDER_TERMS_MISSING_OR_EXPIRED',
  'REPAYMENT_WATERFALL_DISCLOSURE_INCOMPLETE',
  'OUTSTANDING_EXPOSURE_REVIEW_REQUIRED',
  'AI_SIGNAL_REQUIRES_HUMAN_REVIEW',
  'data_sources_used',
  'principal_reasons',
  'reviewer_role',
  'notice_template_version',
  'appeal_window_status',
  'redaction_status',
  'source_commit',
  'identity/business verification record',
  'license/insurance verification record',
  'project contract and milestone evidence',
  'owner acceptance or dispute-window evidence',
  'draw evidence or vendor evidence',
  'provider term record',
  'borrower document and consent record',
  'AI recommendation record',
  'Every notice template remains a placeholder',
  'No contractor-facing live copy',
  'No automatic denial',
  'No automated-only AI reason',
  'Founder/legal/provider review required',
  'send denial notices',
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
  'docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md',
  'npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy',
  'npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review',
  'npm run check:whitepaper-v1-2-contract-backed-loan-technical-requirements',
  'npm run check',
]) assertIncludes(taxonomy, required, taxonomyPath);

assertIncludes(review, 'reason-code taxonomy', reviewPath);
assertIncludes(requirements, 'Adverse Action And Denial Notice Boundary', requirementsPath);
assertIncludes(context, 'Whitepaper v1.2 contract-backed loan adverse-action reason-code taxonomy', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan adverse-action reason-code taxonomy', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan adverse-action reason-code taxonomy', auditPath);
assertIncludes(packageJson, '"check:whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy"', packagePath);
assertIncludes(runner, '"check:whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy"', runnerPath);
assertIncludes(ciValidator, 'check:whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy', ciValidatorPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(taxonomy)) {
  fail('Adverse-action reason-code taxonomy must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  adverse_action_reason_code_taxonomy: taxonomyPath,
  reason_codes_checked: 10,
  live_notice_boundary_checked: true,
  no_secret_scan_checked: true,
}, null, 2));
