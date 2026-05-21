import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const routingPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-routing.md');
const intakeLogPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-intake-log.md');
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

const routing = readRequired(routingPath);
const intakeLog = readRequired(intakeLogPath);
const approvalEvidence = readRequired(approvalEvidencePath);
const noticeBoundary = readRequired(noticeBoundaryPath);
const review = readRequired(reviewPath);
const taxonomy = readRequired(taxonomyPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciValidator = readRequired(ciValidatorPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Adverse-Action Review Response Routing',
  'Status: LOCAL_ONLY_ADVERSE_ACTION_RESPONSE_ROUTING',
  'Purpose',
  'What This Does Not Approve',
  'Source Documents',
  'Routing States',
  'Role-Specific Allowed Use',
  'Required Evidence Before Routing',
  'Automatic HOLD Rules',
  'Founder Next-Step Summary',
  'Required Checks',
  'Acceptance Check',
]) {
  assertIncludes(routing, section, routingPath);
}

for (const snippet of [
  'not legal advice',
  'not provider approval',
  'not lender approval',
  'does not approve contractor-facing notices',
  'does not approve adverse-action delivery',
  'does not approve real credit denial',
  'does not approve real credit approval',
  'does not approve credit-bureau reporting',
  'does not approve public claims',
  'docs/whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-intake-log.md',
  'docs/whitepaper-v1-2-contract-backed-loan-adverse-action-approval-evidence-template.md',
  'docs/whitepaper-v1-2-contract-backed-loan-adverse-action-notice-template-boundary.md',
  'docs/whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review.md',
  'docs/whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy.md',
  'HOLD_FOR_INTAKE_COMPLETION',
  'HOLD_FOR_SCOPE_SPLIT',
  'HOLD_FOR_REDACTION',
  'HOLD_FOR_CONFLICT_RESOLUTION',
  'HOLD_FOR_APPROVAL_EVIDENCE',
  'READY_FOR_INTERNAL_REVISION',
  'READY_FOR_NEXT_INTERNAL_STEP',
  'BLOCKED_FOR_FOUNDER_OWNER_REVIEW',
  'founder',
  'legal_provider',
  'finance_provider',
  'compliance_reviewer',
  'human_reviewer',
  'technical_reviewer',
  'APPROVE_FOR_NEXT_INTERNAL_STEP remains same-scope only',
  'response_id',
  'reviewer_role',
  'reviewed_files',
  'reviewed_file_versions',
  'decision',
  'required_changes',
  'approved_scope',
  'blocked_public_claims',
  'blocked_live_actions',
  'follow_up_evidence_requested',
  'redaction_status',
  'routing_owner',
  'next_internal_action',
  'approval_evidence_id',
  'Any missing response_id, reviewer_role, reviewed_file_versions, decision, approved_scope, blocked_public_claims, blocked_live_actions, redaction_status, routing_owner, or next_internal_action defaults to HOLD_FOR_INTAKE_COMPLETION',
  'Any mixed founder, legal, finance-provider, compliance, technical, payment, lending, custody, token, credit-bureau, or public-claim conclusion defaults to HOLD_FOR_SCOPE_SPLIT',
  'Any private data, screenshots, recordings, raw logs, Magic Link URLs, provider credentials, API keys, database URLs, wallet data, payment data, raw reviewer emails, credit reports, applicant personal data, or secret-looking value defaults to HOLD_FOR_REDACTION',
  'Any conflicting reviewer response defaults to HOLD_FOR_CONFLICT_RESOLUTION',
  'Any response that claims approval but lacks a linked approval_evidence_id defaults to HOLD_FOR_APPROVAL_EVIDENCE',
  'Any next step that needs external contact, legal conclusion, provider commitment, account login, live Supabase change, production deploy, real payment, real loan, real escrow, repayment routing, stablecoin settlement, token collateral, credit-bureau reporting, adverse-action delivery, XPR signature, or public launch defaults to BLOCKED_FOR_FOUNDER_OWNER_REVIEW',
  'most restrictive response controls',
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
  'npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-routing',
  'npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-intake-log',
  'npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-approval-evidence-template',
  'npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-notice-template-boundary',
  'npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review',
  'npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy',
  'npm run check:real-status-audit',
  'npm run check',
]) {
  assertIncludes(routing, snippet, routingPath);
}

for (const [content, snippet, label] of [
  [intakeLog, 'GCSC Whitepaper v1.2 Contract-Backed Loan Adverse-Action Review Response Intake Log', intakeLogPath],
  [approvalEvidence, 'GCSC Whitepaper v1.2 Contract-Backed Loan Adverse-Action Approval Evidence Template', approvalEvidencePath],
  [noticeBoundary, 'GCSC Whitepaper v1.2 Contract-Backed Loan Adverse-Action Notice Template Boundary', noticeBoundaryPath],
  [review, 'GCSC Whitepaper v1.2 Contract-Backed Loan Adverse-Action Legal/Provider Review', reviewPath],
  [taxonomy, 'GCSC Whitepaper v1.2 Contract-Backed Loan Adverse-Action Reason-Code Taxonomy', taxonomyPath],
]) {
  assertIncludes(content, snippet, label);
}

const checkName = 'check:whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-routing';
if (packageJson.scripts?.[checkName] !== 'node scripts/validate-whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-routing.mjs') {
  fail(`${packagePath} must define ${checkName}`);
}

assertIncludes(runner, `"${checkName}"`, runnerPath);
assertIncludes(ciValidator, checkName, ciValidatorPath);
assertIncludes(context, 'Whitepaper v1.2 contract-backed loan adverse-action review response routing', contextPath);
assertIncludes(context, checkName, contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan adverse-action review response routing', backlogPath);
assertIncludes(backlog, checkName, backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan adverse-action review response routing', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(routing)) {
  fail('Adverse-action review response routing must not contain secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  adverse_action_review_response_routing: routingPath,
  routing_states_checked: 8,
  role_scopes_checked: 6,
  safety_boundaries_checked: true,
}, null, 2));
