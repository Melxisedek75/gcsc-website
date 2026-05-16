import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const rollupPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-trend-rollup.md');
const closeoutPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-internal-action-closeout.md');
const queuePath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-internal-action-queue.md');
const decisionIntakePath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-founder-support-decision-intake.md');
const supportSummaryPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-summary.md');
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
  console.error(`Public beta first batch support trend rollup validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const rollup = readRequired(rollupPath);
const closeout = readRequired(closeoutPath);
const queue = readRequired(queuePath);
const decisionIntake = readRequired(decisionIntakePath);
const supportSummary = readRequired(supportSummaryPath);
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
  'SmartContractor Public Beta First Batch Support Trend Rollup',
  'Status: INTERNAL_TREND_ROLLUP_ONLY',
  'Purpose',
  'Source Documents',
  'What This Does Not Approve',
  'Required Rollup Fields',
  'Allowed Trend States',
  'Safe Trend Categories',
  'Blocked Rollup Outcomes',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(rollup, section, rollupPath);

for (const required of [
  'redacted support trend rollup',
  'tester-code-only',
  'safe issue IDs',
  'safe request IDs',
  'queue item IDs',
  'closeout IDs',
  'trend category',
  'support owner',
  'rollback owner',
  'no-real-money confirmation',
  'not approval for Codex to reply to testers',
  'raw public beta URL storage or sharing',
  'live Supabase writes',
  'real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral',
  'rollup_id',
  'trend_window_label',
  'safe_issue_ids',
  'safe_request_ids',
  'queue_item_ids',
  'closeout_ids',
  'trend_category',
  'trend_state',
  'trend_state: WATCH, NEEDS_LOCAL_QA, NEEDS_DOC_UPDATE, NEEDS_FOUNDER_REVIEW, HOLD_FOR_REDACTION, or BLOCKED_FOR_EXTERNAL_ACTION',
  'WATCH',
  'NEEDS_LOCAL_QA',
  'NEEDS_DOC_UPDATE',
  'NEEDS_FOUNDER_REVIEW',
  'HOLD_FOR_REDACTION',
  'BLOCKED_FOR_EXTERNAL_ACTION',
  'USABILITY',
  'AUTH',
  'MOBILE',
  'SUPPORT_PROCESS',
  'DEMO_BOUNDARY',
  'ROLLBACK_READINESS',
  'SEND_TO_TESTER',
  'SHARE_BETA_URL',
  'ENABLE_REAL_MONEY',
  'APPROVE_PUBLIC_LAUNCH',
  'CHANGE_SUPABASE',
  'SET_UP_PROVIDER',
  'LEGAL_APPROVED',
  'APP_STORE_SUBMIT',
  'Authorization header',
  'Magic Link URL',
  'service-role keys',
  'database URLs',
  'npm run check:public-beta-first-batch-support-trend-rollup',
  'npm run check:public-beta-first-batch-internal-action-closeout',
  'npm run check:public-beta-first-batch-internal-action-queue',
  'npm run check:public-beta-first-batch-founder-support-decision-intake',
  'npm run check:public-beta-first-batch-support-summary',
  'npm run check:public-beta-support-sla',
  'npm run check:public-beta-support-queue',
  'npm run check:public-beta-known-issues',
  'npm run check:public-beta-incident-response',
  'npm run check:real-status-audit',
  'npm run check',
]) assertIncludes(rollup, required, rollupPath);

for (const [content, snippet, file] of [
  [closeout, 'SmartContractor Public Beta First Batch Internal Action Closeout', closeoutPath],
  [queue, 'SmartContractor Public Beta First Batch Internal Action Queue', queuePath],
  [decisionIntake, 'SmartContractor Public Beta First Batch Founder Support Decision Intake', decisionIntakePath],
  [supportSummary, 'SmartContractor Public Beta First Batch Support Summary', supportSummaryPath],
  [supportSla, 'SmartContractor Public Beta Support SLA', supportSlaPath],
  [supportQueue, 'SmartContractor Public Beta Support Queue', supportQueuePath],
  [knownIssues, 'SmartContractor Public Beta Known Issues', knownIssuesPath],
  [incidentResponse, 'SmartContractor Public Beta Incident Response', incidentResponsePath],
]) assertIncludes(content, snippet, file);

const scriptName = 'check:public-beta-first-batch-support-trend-rollup';

assertIncludes(context, 'Public beta first batch support trend rollup', contextPath);
assertIncludes(context, scriptName, contextPath);
assertIncludes(context, 'Backlog count at latest audit', contextPath);
assertIncludes(backlog, 'Public beta first batch support trend rollup', backlogPath);
assertIncludes(backlog, scriptName, backlogPath);
assertIncludes(audit, 'Public beta first batch support trend rollup', auditPath);
assertIncludes(packageJson, `"${scriptName}"`, packagePath);
assertIncludes(runner, `"${scriptName}"`, runnerPath);

if (/https?:\/\/[^\s)`>"]+|sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(rollup)) {
  fail('Public beta first batch support trend rollup must not contain real URLs or secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_beta_first_batch_support_trend_rollup: rollupPath,
  support_trend_rollup_checked: true,
  live_action_blocked: true,
}, null, 2));
