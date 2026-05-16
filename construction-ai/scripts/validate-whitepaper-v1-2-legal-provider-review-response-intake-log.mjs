import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const logPath = resolve('..', 'docs', 'whitepaper-v1-2-legal-provider-review-response-intake-log.md');
const sendChecklistPath = resolve('..', 'docs', 'whitepaper-v1-2-legal-provider-review-founder-send-checklist.md');
const executiveBriefPath = resolve('..', 'docs', 'whitepaper-v1-2-legal-provider-review-executive-brief.md');
const prepPath = resolve('..', 'docs', 'whitepaper-v1-2-legal-provider-review-prep.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Whitepaper v1.2 legal/provider review response intake log validation failed: ${message}`);
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
const sendChecklist = readRequired(sendChecklistPath);
const executiveBrief = readRequired(executiveBriefPath);
const prep = readRequired(prepPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'GCSC Whitepaper v1.2 Legal/Provider Review Response Intake Log',
  'Purpose',
  'Intake Record Fields',
  'Allowed Response Decisions',
  'Scope And Role Check',
  'Claim And Live-Action Hold',
  'Follow-Up Routing',
  'Secret And Private Data Handling',
  'Required Checks',
]) assertIncludes(log, section, logPath);

for (const required of [
  'INTERNAL_RESPONSE_INTAKE_ONLY',
  'not legal advice',
  'not provider approval',
  'not approval to launch real loans, real escrow, real repayment routing, stablecoin settlement, token collateral, production payments, or public launch',
  'response_id',
  'reviewer_role',
  'reviewer_org_or_source',
  'received_at',
  'reviewed_files',
  'reviewed_file_versions',
  'decision',
  'required_changes',
  'blocked_public_claims',
  'blocked_live_actions',
  'follow_up_evidence_requested',
  'owner',
  'status',
  'HOLD',
  'REVISE',
  'APPROVE_FOR_NEXT_INTERNAL_STEP',
  'ADVISORY_INPUT_ONLY',
  'legal',
  'finance_provider',
  'escrow_payment_provider',
  'security_smart_contract_reviewer',
  'founder_internal_review',
  'wrong-role conclusions stay HOLD_FOR_SCOPE_SPLIT',
  'Public claims, provider commitments, compliance claims, live loan origination, escrow custody, repayment routing, stablecoin settlement, token collateral, production provider API calls, production deploys, and public launch remain blocked unless the matching approval scope is explicit.',
  'Secrets, credentials, Magic Link URLs, tokens, service-role keys, private keys, wallet keys, database connection strings, payment data, raw logs, screenshots, recordings, and private customer data must be removed or summarized before the response can be stored or shared.',
  'npm run check:whitepaper-v1-2-legal-provider-review-response-intake-log',
  'npm run check:whitepaper-v1-2-legal-provider-review-founder-send-checklist',
  'npm run check:whitepaper-v1-2-legal-provider-review-prep',
  'npm run check:real-status-audit',
  'npm run check',
]) assertIncludes(log, required, logPath);

assertIncludes(sendChecklist, 'GCSC Whitepaper v1.2 Legal/Provider Review Founder Send Checklist', sendChecklistPath);
assertIncludes(executiveBrief, 'GCSC Whitepaper v1.2 Legal/Provider Review Executive Brief', executiveBriefPath);
assertIncludes(prep, 'GCSC Whitepaper v1.2 Legal Provider Review Prep', prepPath);
assertIncludes(context, 'Whitepaper v1.2 legal/provider review response intake log', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-legal-provider-review-response-intake-log', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 legal/provider review response intake log', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-legal-provider-review-response-intake-log', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 legal/provider review response intake log', auditPath);
assertIncludes(packageJson, '"check:whitepaper-v1-2-legal-provider-review-response-intake-log"', packagePath);
assertIncludes(runner, '"check:whitepaper-v1-2-legal-provider-review-response-intake-log"', runnerPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(log)) {
  fail('Legal/provider review response intake log must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  response_intake_log: logPath,
  scope_and_role_check: true,
  secret_handling_checked: true,
}, null, 2));
