import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const reviewPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review.md');
const technicalRequirementsPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-technical-requirements.md');
const handoffPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-legal-provider-handoff.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan adverse-action legal/provider review validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const review = readRequired(reviewPath);
const technicalRequirements = readRequired(technicalRequirementsPath);
const handoff = readRequired(handoffPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);
const ciValidator = readRequired(ciValidatorPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Adverse-Action Legal/Provider Review',
  'Purpose',
  'Local-Only Review Packet',
  'Required Review Questions',
  'Required Draft Trace Fields',
  'Blocked Live Actions',
  'Founder/Legal/Provider Decisions Required Before Live Use',
  'Required Checks',
]) {
  assertIncludes(review, section, reviewPath);
}

for (const required of [
  'LOCAL_ONLY_REVIEW_PACKET',
  'not legal advice',
  'not a credit decision',
  'not provider approval',
  'not lender approval',
  'not approval to send denial notices',
  'not approval for credit-bureau reporting',
  'not approval to launch real contractor loans',
  'not approval for payment, escrow, repayment routing, stablecoin settlement, or token collateral action',
  'HOLD_FOR_ADVERSE_ACTION_REVIEW',
  'LOCAL_DRAFT_ADVERSE_ACTION_TRACE',
  'BLOCKED_FOR_LIVE_LOAN',
  'adverse_action_event_id',
  'applicant_profile_id',
  'request_id',
  'decision_type',
  'principal_reasons',
  'data_sources_used',
  'notice_template_version',
  'delivery_status',
  'appeal_window_status',
  'reviewer_role',
  'redaction_status',
  'source_file',
  'source_commit',
  'latest_check_run',
  'What contractor-facing language is allowed for held, reduced, declined, or more-info-needed working-capital requests?',
  'Which principal-reason categories are legally/provider acceptable?',
  'Which data sources may be referenced',
  'What notice timing, delivery, retention, appeal, correction, and dispute processes are required',
  'Which reviewer roles can approve notice templates',
  'How should AI risk signals be described',
  'What must stay redacted before reviewer sharing',
  'send notices',
  'deny real credit',
  'approve real credit',
  'report to credit bureaus',
  'create legal determinations',
  'create provider obligations',
  'route repayments',
  'activate escrow',
  'settle stablecoins',
  'lock token collateral',
  'launch real lending',
  'Founder/legal/provider decisions required before live use',
  'notice template ownership',
  'reason-code taxonomy',
  'reviewer escalation path',
  'retention period',
  'appeal/correction workflow',
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
  'docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md',
  'docs/whitepaper-v1-2-contract-backed-loan-legal-provider-handoff.md',
  'npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review',
  'npm run check:whitepaper-v1-2-contract-backed-loan-technical-requirements',
  'npm run check:whitepaper-v1-2-contract-backed-loan-legal-provider-handoff',
  'npm run check',
]) {
  assertIncludes(review, required, reviewPath);
}

assertIncludes(technicalRequirements, 'Adverse Action And Denial Notice Boundary', technicalRequirementsPath);
assertIncludes(technicalRequirements, 'HOLD_FOR_ADVERSE_ACTION_REVIEW', technicalRequirementsPath);
assertIncludes(handoff, 'consumer protection', handoffPath);
assertIncludes(context, 'Whitepaper v1.2 contract-backed loan adverse-action legal/provider review', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan adverse-action legal/provider review', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan adverse-action legal/provider review', auditPath);
assertIncludes(packageJson, '"check:whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review"', packagePath);
assertIncludes(runner, '"check:whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review"', runnerPath);
assertIncludes(ciValidator, 'check:whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review', ciValidatorPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(review)) {
  fail('Adverse-action legal/provider review must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  adverse_action_legal_provider_review: reviewPath,
  local_only_review_checked: true,
  blocked_live_actions_checked: true,
  no_secret_scan_checked: true,
}, null, 2));
