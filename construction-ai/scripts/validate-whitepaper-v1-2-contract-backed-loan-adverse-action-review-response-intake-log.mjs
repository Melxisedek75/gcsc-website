import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const logPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-intake-log.md');
const approvalEvidencePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-adverse-action-approval-evidence-template.md');
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
  console.error(`Whitepaper v1.2 contract-backed loan adverse-action review response intake log validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const log = readRequired(logPath);
const approvalEvidence = readRequired(approvalEvidencePath);
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
  'GCSC Whitepaper v1.2 Contract-Backed Loan Adverse-Action Review Response Intake Log',
  'Purpose',
  'Intake Record Fields',
  'Allowed Response Decisions',
  'Scope And Role Check',
  'Claim And Live-Action Hold',
  'Follow-Up Routing',
  'Secret And Private Data Handling',
  'Required Linked Files',
  'Required Checks',
]) assertIncludes(log, section, logPath);

for (const required of [
  'LOCAL_ONLY_ADVERSE_ACTION_RESPONSE_INTAKE',
  'not legal advice',
  'not provider approval',
  'not lender approval',
  'not a denial notice',
  'not approval to send notices',
  'not approval to deny real credit',
  'not approval for credit-bureau reporting',
  'not contractor-facing live copy',
  'response_id',
  'reviewer_role',
  'reviewer_org_or_source',
  'received_at',
  'reviewed_files',
  'reviewed_file_versions',
  'decision',
  'required_changes',
  'approved_scope',
  'blocked_public_claims',
  'blocked_live_actions',
  'follow_up_evidence_requested',
  'redaction_status',
  'owner',
  'status',
  'HOLD',
  'REVISE',
  'APPROVE_FOR_NEXT_INTERNAL_STEP',
  'ADVISORY_INPUT_ONLY',
  'founder',
  'legal_provider',
  'finance_provider',
  'compliance_reviewer',
  'human_reviewer',
  'technical_reviewer',
  'HOLD_FOR_INTAKE_COMPLETION',
  'HOLD_FOR_SCOPE_SPLIT',
  'HOLD_FOR_REDACTION',
  'HOLD_FOR_CONFLICT_RESOLUTION',
  'READY_FOR_INTERNAL_REVISION',
  'READY_FOR_NEXT_INTERNAL_STEP',
  'wrong-role conclusions stay HOLD_FOR_SCOPE_SPLIT',
  'most restrictive response controls',
  'contractor-facing notices',
  'real credit decisions',
  'credit-bureau reporting',
  'provider obligations',
  'repayment routing',
  'escrow activation',
  'stablecoin settlement',
  'token collateral',
  'public claims',
  'Secrets, credentials, Magic Link URLs, tokens, service-role keys, private keys, wallet keys, database connection strings, payment data, raw logs, screenshots, recordings, credit reports, raw applicant personal data, provider credentials, and private customer data must be removed or summarized before the response can be stored or shared.',
  'Do not paste raw reviewer emails',
  'Do not paste raw chat transcripts',
  'Do not paste raw screenshots',
  'Do not paste customer data',
  'Do not paste production URLs with tokens',
  'Do not paste provider credentials',
  'Do not paste wallet details',
  'Do not paste account identifiers',
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
  'docs/whitepaper-v1-2-contract-backed-loan-adverse-action-approval-evidence-template.md',
  'docs/whitepaper-v1-2-contract-backed-loan-adverse-action-notice-template-boundary.md',
  'docs/whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review.md',
  'docs/whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy.md',
  'npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-intake-log',
  'npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-approval-evidence-template',
  'npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-notice-template-boundary',
  'npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review',
  'npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy',
  'npm run check',
]) assertIncludes(log, required, logPath);

assertIncludes(approvalEvidence, 'Required Approval Roles', approvalEvidencePath);
assertIncludes(noticeBoundary, 'Reviewer Approval Boundary', noticeBoundaryPath);
assertIncludes(review, 'Founder/Legal/Provider Decisions Required Before Live Use', reviewPath);
assertIncludes(taxonomy, 'Notice Template Boundary', taxonomyPath);
assertIncludes(context, 'Whitepaper v1.2 contract-backed loan adverse-action review response intake log', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-intake-log', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan adverse-action review response intake log', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-intake-log', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan adverse-action review response intake log', auditPath);
assertIncludes(packageJson, '"check:whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-intake-log"', packagePath);
assertIncludes(runner, '"check:whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-intake-log"', runnerPath);
assertIncludes(ciValidator, 'check:whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-intake-log', ciValidatorPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(log)) {
  fail('Adverse-action review response intake log must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  adverse_action_review_response_intake_log: logPath,
  scope_and_role_check: true,
  secret_handling_checked: true,
  blocked_live_actions_checked: true,
}, null, 2));
