import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const checklistPath = resolve('..', 'docs', 'whitepaper-v1-2-legal-provider-review-founder-send-checklist.md');
const executiveBriefPath = resolve('..', 'docs', 'whitepaper-v1-2-legal-provider-review-executive-brief.md');
const prepPath = resolve('..', 'docs', 'whitepaper-v1-2-legal-provider-review-prep.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Whitepaper v1.2 legal/provider review founder send checklist validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const checklist = readRequired(checklistPath);
const executiveBrief = readRequired(executiveBriefPath);
const prep = readRequired(prepPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'GCSC Whitepaper v1.2 Legal/Provider Review Founder Send Checklist',
  'Purpose',
  'Pre-Send Packet Assembly',
  'Redaction Gate',
  'Audience And Scope Gate',
  'Response Request Template',
  'Do Not Send',
  'Founder Stop Conditions',
  'Founder Send Approval Boundary Record',
  'Required Checks',
]) assertIncludes(checklist, section, checklistPath);

for (const required of [
  'INTERNAL_FOUNDER_SEND_PREP_ONLY',
  'not approval to contact reviewers',
  'not legal advice',
  'not provider approval',
  'not approval to launch real loans, real escrow, real repayment routing, stablecoin settlement, token collateral, production payments, or public launch',
  'packet_id',
  'intended_audience',
  'allowed_files',
  'blocked_files',
  'source_file_versions',
  'redaction_owner',
  'redaction_status',
  'response_deadline',
  'founder_review_status',
  'docs/whitepaper-v1-2-legal-provider-review-executive-brief.md',
  'docs/whitepaper-v1-2-legal-provider-review-prep.md',
  'docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md',
  'docs/whitepaper-v1-2-smart-contract-module-split-anti-backdoor-review.md',
  'secrets',
  'credentials',
  'Magic Link URLs',
  'tokens',
  'service-role keys',
  'private keys',
  'wallet keys',
  'database connection strings',
  'raw logs',
  'screenshots',
  'recordings',
  'private customer data',
  'attorney',
  'finance_provider',
  'escrow_payment_provider',
  'security_smart_contract_reviewer',
  'founder_internal_review',
  'reviewer_role',
  'reviewed_files',
  'decision: HOLD, REVISE, or APPROVE_FOR_NEXT_INTERNAL_STEP',
  'required_changes',
  'blocked_public_claims',
  'blocked_live_actions',
  'follow_up_evidence_requested',
  'Do not send the whole repository',
  'Do not send `.env`',
  'Do not send payment setup instructions',
  'Do not send real production values',
  'Do not send provider credentials',
  'Do not send unredacted tester artifacts',
  'Founder must stop if a reviewer asks for secrets, account access, live credentials, payment setup, escrow setup, production API calls, loan activation, legal conclusions, or public launch approval',
  'founder_send_approval_state',
  'READY_FOR_FOUNDER_SEND_REVIEW, HOLD_FOR_REDACTION, HOLD_FOR_SCOPE_SPLIT, HOLD_FOR_VERSION_REFRESH, HOLD_FOR_RESPONSE_TEMPLATE, or NO_GO',
  'founder_send_approval_evidence',
  'founder_send_approval_owner',
  'founder_send_approval_blocked_action',
  'Do not treat this record as approval to contact attorneys, contact finance providers, contact escrow/payment providers, contact security reviewers, create provider commitments, state legal conclusions, publish claims, deploy production, change live Supabase, move money, originate loans, hold escrow, route repayments, settle stablecoins, lock token collateral, or launch publicly',
  'npm run check:whitepaper-v1-2-legal-provider-review-founder-send-checklist',
  'npm run check:whitepaper-v1-2-legal-provider-review-executive-brief',
  'npm run check:whitepaper-v1-2-legal-provider-review-prep',
  'npm run check:real-status-audit',
  'npm run check',
]) assertIncludes(checklist, required, checklistPath);

assertIncludes(executiveBrief, 'GCSC Whitepaper v1.2 Legal/Provider Review Executive Brief', executiveBriefPath);
assertIncludes(prep, 'GCSC Whitepaper v1.2 Legal Provider Review Prep', prepPath);
assertIncludes(context, 'Whitepaper v1.2 legal/provider review founder send checklist', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-legal-provider-review-founder-send-checklist', contextPath);
assertIncludes(context, 'Whitepaper v1.2 legal/provider founder send approval boundary record', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 legal/provider review founder send checklist', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-legal-provider-review-founder-send-checklist', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 legal/provider founder send approval boundary record', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 legal/provider review founder send checklist', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 legal/provider founder send approval boundary record', auditPath);
assertIncludes(packageJson, '"check:whitepaper-v1-2-legal-provider-review-founder-send-checklist"', packagePath);
assertIncludes(runner, '"check:whitepaper-v1-2-legal-provider-review-founder-send-checklist"', runnerPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(checklist)) {
  fail('Founder send checklist must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  founder_send_checklist: checklistPath,
  redaction_gate_checked: true,
  stop_conditions_checked: true,
}, null, 2));
