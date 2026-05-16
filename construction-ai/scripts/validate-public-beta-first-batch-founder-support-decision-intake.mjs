import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const intakePath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-founder-support-decision-intake.md');
const handoffPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-founder-support-handoff.md');
const supportSummaryPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-summary.md');
const replyCloseoutPath = resolve('..', 'docs', 'smartcontractor-public-beta-founder-reply-record-closeout.md');
const replyBoundaryPath = resolve('..', 'docs', 'smartcontractor-public-beta-founder-reply-boundary.md');
const triagePath = resolve('..', 'docs', 'smartcontractor-public-beta-first-response-triage.md');
const supportSlaPath = resolve('..', 'docs', 'smartcontractor-public-beta-support-sla.md');
const supportQueuePath = resolve('..', 'docs', 'smartcontractor-public-beta-support-queue.md');
const knownIssuesPath = resolve('..', 'docs', 'smartcontractor-public-beta-known-issues.md');
const incidentResponsePath = resolve('..', 'docs', 'smartcontractor-public-beta-incident-response.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Public beta first batch founder support decision intake validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const intake = readRequired(intakePath);
const handoff = readRequired(handoffPath);
const supportSummary = readRequired(supportSummaryPath);
const replyCloseout = readRequired(replyCloseoutPath);
const replyBoundary = readRequired(replyBoundaryPath);
const triage = readRequired(triagePath);
const supportSla = readRequired(supportSlaPath);
const supportQueue = readRequired(supportQueuePath);
const knownIssues = readRequired(knownIssuesPath);
const incidentResponse = readRequired(incidentResponsePath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Public Beta First Batch Founder Support Decision Intake',
  'Status: INTERNAL_FOUNDER_SUPPORT_DECISION_INTAKE_ONLY',
  'Purpose',
  'Source Documents',
  'What This Does Not Approve',
  'Required Decision Fields',
  'Allowed Decision States',
  'Blocked Decision Values',
  'Safe Evidence Rules',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(intake, section, intakePath);

for (const required of [
  'redacted founder support decision intake',
  'tester code',
  'safe issue ID',
  'safe request ID',
  'support owner',
  'rollback owner',
  'not approval for Codex to reply to testers',
  'raw public beta URL storage or sharing',
  'live Supabase writes',
  'real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral',
  'decision_intake_id',
  'handoff_id',
  'support_summary_id',
  'response_batch_id',
  'founder_decision_owner',
  'safe_issue_ids_decided',
  'safe_request_ids_decided',
  'decision_summary_label',
  'support_owner',
  'rollback_owner',
  'redaction_status',
  'no_real_money_status',
  'blocked_action_acknowledgement',
  'next_safe_internal_action',
  'decision_state: RECORDED_FOR_INTERNAL_QUEUE, HOLD_FOR_REDACTION, HOLD_FOR_RECHECK, HOLD_FOR_FOUNDER_REWRITE, or BLOCKED_FOR_EXTERNAL_ACTION',
  'RECORDED_FOR_INTERNAL_QUEUE',
  'HOLD_FOR_REDACTION',
  'HOLD_FOR_RECHECK',
  'HOLD_FOR_FOUNDER_REWRITE',
  'BLOCKED_FOR_EXTERNAL_ACTION',
  'SEND_TO_TESTER',
  'SHARE_BETA_URL',
  'ENABLE_REAL_MONEY',
  'APPROVE_PUBLIC_LAUNCH',
  'Authorization header',
  'Magic Link URL',
  'production support',
  'Codex to reply to testers',
  'change Supabase redirects',
  'service-role keys',
  'database URLs',
  'npm run check:public-beta-first-batch-founder-support-decision-intake',
  'npm run check:public-beta-first-batch-founder-support-handoff',
  'npm run check:public-beta-first-batch-support-summary',
  'npm run check:public-beta-founder-reply-record-closeout',
  'npm run check:public-beta-founder-reply-boundary',
  'npm run check:public-beta-first-response-triage',
  'npm run check:public-beta-support-sla',
  'npm run check:public-beta-support-queue',
  'npm run check:public-beta-known-issues',
  'npm run check:public-beta-incident-response',
  'npm run check:real-status-audit',
  'npm run check',
]) assertIncludes(intake, required, intakePath);

for (const [content, snippet, file] of [
  [handoff, 'SmartContractor Public Beta First Batch Founder Support Handoff', handoffPath],
  [supportSummary, 'SmartContractor Public Beta First Batch Support Summary', supportSummaryPath],
  [replyCloseout, 'SmartContractor Public Beta Founder Reply Record Closeout', replyCloseoutPath],
  [replyBoundary, 'SmartContractor Public Beta Founder Reply Boundary', replyBoundaryPath],
  [triage, 'SmartContractor Public Beta First Response Triage', triagePath],
  [supportSla, 'SmartContractor Public Beta Support SLA', supportSlaPath],
  [supportQueue, 'SmartContractor Public Beta Support Queue', supportQueuePath],
  [knownIssues, 'SmartContractor Public Beta Known Issues', knownIssuesPath],
  [incidentResponse, 'SmartContractor Public Beta Incident Response', incidentResponsePath],
]) assertIncludes(content, snippet, file);

const scriptName = 'check:public-beta-first-batch-founder-support-decision-intake';

assertIncludes(context, 'Public beta first batch founder support decision intake', contextPath);
assertIncludes(context, scriptName, contextPath);
assertIncludes(context, 'Backlog count at latest audit', contextPath);
assertIncludes(backlog, 'Public beta first batch founder support decision intake', backlogPath);
assertIncludes(backlog, scriptName, backlogPath);
assertIncludes(audit, 'Public beta first batch founder support decision intake', auditPath);
assertIncludes(packageJson, `"${scriptName}"`, packagePath);
assertIncludes(runner, `"${scriptName}"`, runnerPath);

if (/https?:\/\/[^\s)`>"]+|sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(intake)) {
  fail('Public beta first batch founder support decision intake must not contain real URLs or secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_beta_first_batch_founder_support_decision_intake: intakePath,
  founder_support_decision_intake_checked: true,
  codex_reply_blocked: true,
}, null, 2));
