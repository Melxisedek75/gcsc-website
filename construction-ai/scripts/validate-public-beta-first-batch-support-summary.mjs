import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const summaryPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-summary.md');
const replyCloseoutPath = resolve('..', 'docs', 'smartcontractor-public-beta-founder-reply-record-closeout.md');
const replyBoundaryPath = resolve('..', 'docs', 'smartcontractor-public-beta-founder-reply-boundary.md');
const triagePath = resolve('..', 'docs', 'smartcontractor-public-beta-first-response-triage.md');
const postSendIntakePath = resolve('..', 'docs', 'smartcontractor-public-beta-invite-post-send-intake.md');
const issueLogPath = resolve('..', 'docs', 'smartcontractor-beta-issue-log-template.md');
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
  console.error(`Public beta first batch support summary validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const summary = readRequired(summaryPath);
const replyCloseout = readRequired(replyCloseoutPath);
const replyBoundary = readRequired(replyBoundaryPath);
const triage = readRequired(triagePath);
const postSendIntake = readRequired(postSendIntakePath);
const issueLog = readRequired(issueLogPath);
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
  'SmartContractor Public Beta First Batch Support Summary',
  'Status: INTERNAL_FIRST_BATCH_SUPPORT_SUMMARY_ONLY',
  'Purpose',
  'Source Documents',
  'What This Does Not Approve',
  'Required Summary Fields',
  'Summary States',
  'Safe Evidence Rules',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(summary, section, summaryPath);

for (const required of [
  'redacted first-batch beta support state',
  'tester code',
  'safe issue ID',
  'safe request ID',
  'severity counts',
  'state counts',
  'support owner',
  'rollback owner',
  'not approval for Codex to reply to testers',
  'raw public beta URL storage or sharing',
  'live Supabase writes',
  'real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral',
  'support_summary_id',
  'invite_batch_id',
  'response_batch_id',
  'summary_window_label',
  'tester_codes_in_scope',
  'issue_ids_in_scope',
  'safe_request_ids_seen',
  'severity_counts: P0=, P1=, P2=, P3=',
  'state_counts: CLOSED_SENT_BY_FOUNDER=, QUEUED_FOR_FOUNDER_REVIEW=, HOLD_FOR_REDACTION=, HOLD_FOR_RECHECK=, HOLD_FOR_FOUNDER_REWRITE=, BLOCKED_FOR_EXTERNAL_ACTION=',
  'redaction_status',
  'no_real_money_status',
  'next_safe_actions',
  'summary_state: SUMMARY_RECORDED, QUEUED_FOR_FOUNDER_REVIEW, HOLD_FOR_REDACTION, HOLD_FOR_RECHECK, or BLOCKED_FOR_EXTERNAL_ACTION',
  'SUMMARY_RECORDED',
  'QUEUED_FOR_FOUNDER_REVIEW',
  'HOLD_FOR_REDACTION',
  'HOLD_FOR_RECHECK',
  'BLOCKED_FOR_EXTERNAL_ACTION',
  'Authorization header',
  'Magic Link URL',
  'production support',
  'Codex to reply to testers',
  'change Supabase redirects',
  'service-role keys',
  'database URLs',
  'npm run check:public-beta-first-batch-support-summary',
  'npm run check:public-beta-founder-reply-record-closeout',
  'npm run check:public-beta-founder-reply-boundary',
  'npm run check:public-beta-first-response-triage',
  'npm run check:public-beta-invite-post-send-intake',
  'npm run check:beta-issue-log',
  'npm run check:public-beta-support-sla',
  'npm run check:public-beta-support-queue',
  'npm run check:public-beta-known-issues',
  'npm run check:public-beta-incident-response',
  'npm run check:real-status-audit',
  'npm run check',
]) assertIncludes(summary, required, summaryPath);

for (const [content, snippet, file] of [
  [replyCloseout, 'SmartContractor Public Beta Founder Reply Record Closeout', replyCloseoutPath],
  [replyBoundary, 'SmartContractor Public Beta Founder Reply Boundary', replyBoundaryPath],
  [triage, 'SmartContractor Public Beta First Response Triage', triagePath],
  [postSendIntake, 'SmartContractor Public Beta Invite Post-Send Intake', postSendIntakePath],
  [issueLog, 'SmartContractor Beta Issue Log Template', issueLogPath],
  [supportSla, 'SmartContractor Public Beta Support SLA', supportSlaPath],
  [supportQueue, 'SmartContractor Public Beta Support Queue', supportQueuePath],
  [knownIssues, 'SmartContractor Public Beta Known Issues', knownIssuesPath],
  [incidentResponse, 'SmartContractor Public Beta Incident Response', incidentResponsePath],
]) assertIncludes(content, snippet, file);

const scriptName = 'check:public-beta-first-batch-support-summary';

assertIncludes(context, 'Public beta first batch support summary', contextPath);
assertIncludes(context, scriptName, contextPath);
assertIncludes(context, 'Backlog count at latest audit', contextPath);
assertIncludes(backlog, 'Public beta first batch support summary', backlogPath);
assertIncludes(backlog, scriptName, backlogPath);
assertIncludes(audit, 'Public beta first batch support summary', auditPath);
assertIncludes(packageJson, `"${scriptName}"`, packagePath);
assertIncludes(runner, `"${scriptName}"`, runnerPath);

if (/https?:\/\/[^\s)`>"]+|sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(summary)) {
  fail('Public beta first batch support summary must not contain real URLs or secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_beta_first_batch_support_summary: summaryPath,
  redacted_first_batch_support_summary_checked: true,
  codex_reply_blocked: true,
}, null, 2));
