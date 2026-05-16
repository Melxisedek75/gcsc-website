import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const routingPath = resolve('..', 'docs', 'whitepaper-v1-2-legal-provider-review-response-routing.md');
const intakeLogPath = resolve('..', 'docs', 'whitepaper-v1-2-legal-provider-review-response-intake-log.md');
const sendChecklistPath = resolve('..', 'docs', 'whitepaper-v1-2-legal-provider-review-founder-send-checklist.md');
const executiveBriefPath = resolve('..', 'docs', 'whitepaper-v1-2-legal-provider-review-executive-brief.md');
const prepPath = resolve('..', 'docs', 'whitepaper-v1-2-legal-provider-review-prep.md');
const technicalRequirementsPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-technical-requirements.md');
const moduleSplitPath = resolve('..', 'docs', 'whitepaper-v1-2-smart-contract-module-split-anti-backdoor-review.md');
const claimReviewPath = resolve('..', 'docs', 'whitepaper-v1-2-claim-review-matrix.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

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
const sendChecklist = readRequired(sendChecklistPath);
const executiveBrief = readRequired(executiveBriefPath);
const prep = readRequired(prepPath);
const technicalRequirements = readRequired(technicalRequirementsPath);
const moduleSplit = readRequired(moduleSplitPath);
const claimReview = readRequired(claimReviewPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);

for (const section of [
  'GCSC Whitepaper v1.2 Legal/Provider Review Response Routing',
  'Status: INTERNAL_RESPONSE_ROUTING_ONLY',
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
  'does not approve public publication',
  'does not approve public website edits',
  'does not approve live loans, real escrow, repayment routing, stablecoin settlement, token collateral, production payments, provider API calls, production deploys, XPR signatures, or public launch',
  'docs/whitepaper-v1-2-legal-provider-review-response-intake-log.md',
  'docs/whitepaper-v1-2-legal-provider-review-founder-send-checklist.md',
  'docs/whitepaper-v1-2-legal-provider-review-executive-brief.md',
  'docs/whitepaper-v1-2-legal-provider-review-prep.md',
  'docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md',
  'docs/whitepaper-v1-2-smart-contract-module-split-anti-backdoor-review.md',
  'docs/whitepaper-v1-2-claim-review-matrix.md',
  'HOLD_FOR_INTAKE_COMPLETION',
  'HOLD_FOR_SCOPE_SPLIT',
  'HOLD_FOR_REDACTION',
  'HOLD_FOR_CONFLICT_RESOLUTION',
  'READY_FOR_INTERNAL_REVISION',
  'READY_FOR_NEXT_INTERNAL_STEP',
  'BLOCKED_FOR_FOUNDER_OWNER_REVIEW',
  'legal',
  'finance_provider',
  'escrow_payment_provider',
  'security_smart_contract_reviewer',
  'founder_internal_review',
  'APPROVE_FOR_NEXT_INTERNAL_STEP remains same-scope only',
  'response_id',
  'reviewer_role',
  'reviewed_files',
  'reviewed_file_versions',
  'decision',
  'required_changes',
  'blocked_public_claims',
  'blocked_live_actions',
  'follow_up_evidence_requested',
  'redaction_status',
  'routing_owner',
  'next_internal_action',
  'Any missing response_id, reviewer_role, reviewed_file_versions, decision, blocked_public_claims, blocked_live_actions, redaction_status, routing_owner, or next_internal_action defaults to HOLD_FOR_INTAKE_COMPLETION',
  'Any mixed legal, finance-provider, escrow/payment-provider, security, founder, deployment, payment, lending, custody, token, or public-launch conclusion defaults to HOLD_FOR_SCOPE_SPLIT',
  'Any private data, screenshots, recordings, raw logs, Magic Link URLs, provider credentials, API keys, database URLs, wallet data, payment data, raw reviewer emails, or secret-looking value defaults to HOLD_FOR_REDACTION',
  'Any conflicting reviewer response defaults to HOLD_FOR_CONFLICT_RESOLUTION',
  'Any next step that needs external contact, legal conclusion, provider commitment, account login, live Supabase change, production deploy, real payment, real loan, real escrow, repayment routing, stablecoin settlement, token collateral, XPR signature, or public launch defaults to BLOCKED_FOR_FOUNDER_OWNER_REVIEW',
  'npm run check:whitepaper-v1-2-legal-provider-review-response-routing',
  'npm run check:whitepaper-v1-2-legal-provider-review-response-intake-log',
  'npm run check:whitepaper-v1-2-legal-provider-review-prep',
  'npm run check:whitepaper-v1-2-contract-backed-loan-technical-requirements',
  'npm run check:whitepaper-v1-2-smart-contract-module-split-anti-backdoor',
  'npm run check:real-status-audit',
]) {
  assertIncludes(routing, snippet, routingPath);
}

for (const [content, snippet, label] of [
  [intakeLog, 'GCSC Whitepaper v1.2 Legal/Provider Review Response Intake Log', intakeLogPath],
  [sendChecklist, 'GCSC Whitepaper v1.2 Legal/Provider Review Founder Send Checklist', sendChecklistPath],
  [executiveBrief, 'GCSC Whitepaper v1.2 Legal/Provider Review Executive Brief', executiveBriefPath],
  [prep, 'GCSC Whitepaper v1.2 Legal Provider Review Prep', prepPath],
  [technicalRequirements, 'Whitepaper v1.2 Contract-Backed Loan Technical Requirements', technicalRequirementsPath],
  [moduleSplit, 'GCSC Whitepaper v1.2 Smart Contract Module Split And Anti-Backdoor Review', moduleSplitPath],
  [claimReview, 'GCSC Whitepaper v1.2 Claim Review Matrix', claimReviewPath],
]) {
  assertIncludes(content, snippet, label);
}

if (packageJson.scripts?.['check:whitepaper-v1-2-legal-provider-review-response-routing'] !== 'node scripts/validate-whitepaper-v1-2-legal-provider-review-response-routing.mjs') {
  fail(`${packagePath} must define check:whitepaper-v1-2-legal-provider-review-response-routing`);
}

assertIncludes(runner, '"check:whitepaper-v1-2-legal-provider-review-response-routing"', runnerPath);
assertIncludes(context, 'Whitepaper v1.2 legal/provider review response routing', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-legal-provider-review-response-routing', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 legal/provider review response routing', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-legal-provider-review-response-routing', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 legal/provider review response routing', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(routing)) {
  fail('Legal/provider response routing must not contain secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  response_routing: routingPath,
  routing_states_checked: 7,
  role_scopes_checked: 5,
  safety_boundaries_checked: true,
}, null, 2));
