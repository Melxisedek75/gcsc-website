import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const closeoutDocPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-trend-founder-decision-closeout.md');
const intakePath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-trend-founder-decision-intake.md');
const handoffPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-trend-founder-handoff.md');
const rollupPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-trend-rollup.md');
const actionCloseoutPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-internal-action-closeout.md');
const queuePath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-internal-action-queue.md');
const supportSummaryPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-summary.md');
const supportSlaPath = resolve('..', 'docs', 'smartcontractor-public-beta-support-sla.md');
const knownIssuesPath = resolve('..', 'docs', 'smartcontractor-public-beta-known-issues.md');
const incidentResponsePath = resolve('..', 'docs', 'smartcontractor-public-beta-incident-response.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Public beta first batch support trend founder decision closeout validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const closeoutDoc = readRequired(closeoutDocPath);
const intake = readRequired(intakePath);
const handoff = readRequired(handoffPath);
const rollup = readRequired(rollupPath);
const actionCloseout = readRequired(actionCloseoutPath);
const queue = readRequired(queuePath);
const supportSummary = readRequired(supportSummaryPath);
const supportSla = readRequired(supportSlaPath);
const knownIssues = readRequired(knownIssuesPath);
const incidentResponse = readRequired(incidentResponsePath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Public Beta First Batch Support Trend Founder Decision Closeout',
  'Status: INTERNAL_FOUNDER_TREND_DECISION_CLOSEOUT_ONLY',
  'Purpose',
  'Source Documents',
  'What This Does Not Approve',
  'Required Closeout Fields',
  'Allowed Closeout States',
  'Blocked Closeout Values',
  'Safe Evidence Rules',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(closeoutDoc, section, closeoutDocPath);

for (const required of [
  'redacted founder trend decision intake',
  'first-batch support trend founder decision',
  'internal closeout metadata',
  'tester-code-only',
  'safe issue IDs',
  'safe request IDs',
  'queue item IDs',
  'closeout IDs',
  'trend category',
  'founder decision summary label',
  'support owner',
  'rollback owner',
  'no-real-money status',
  'not approval for Codex to reply to testers',
  'raw public beta URL storage or sharing',
  'live Supabase writes',
  'real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral',
  'trend_decision_closeout_id',
  'trend_decision_intake_id',
  'handoff_id',
  'rollup_id',
  'safe_issue_ids_closed',
  'safe_request_ids_closed',
  'queue_item_ids_closed',
  'closeout_ids_reconciled',
  'trend_category',
  'founder_decision_owner',
  'founder_decision_summary_label',
  'support_owner',
  'rollback_owner',
  'redaction_status',
  'no_real_money_status',
  'blocked_action_acknowledgement',
  'next_safe_internal_action',
  'closeout_state: CLOSED_TO_INTERNAL_QUEUE, HOLD_FOR_REDACTION, HOLD_FOR_RECHECK, HOLD_FOR_FOUNDER_REWRITE, or BLOCKED_FOR_EXTERNAL_ACTION',
  'CLOSED_TO_INTERNAL_QUEUE',
  'HOLD_FOR_REDACTION',
  'HOLD_FOR_RECHECK',
  'HOLD_FOR_FOUNDER_REWRITE',
  'BLOCKED_FOR_EXTERNAL_ACTION',
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
  'production support',
  'Codex to reply to testers',
  'change Supabase redirects',
  'service-role keys',
  'database URLs',
  'npm run check:public-beta-first-batch-support-trend-founder-decision-closeout',
  'npm run check:public-beta-first-batch-support-trend-founder-decision-intake',
  'npm run check:public-beta-first-batch-support-trend-founder-handoff',
  'npm run check:public-beta-first-batch-support-trend-rollup',
  'npm run check:public-beta-first-batch-internal-action-closeout',
  'npm run check:public-beta-first-batch-internal-action-queue',
  'npm run check:public-beta-first-batch-support-summary',
  'npm run check:public-beta-support-sla',
  'npm run check:public-beta-known-issues',
  'npm run check:public-beta-incident-response',
  'npm run check:real-status-audit',
  'npm run check',
]) assertIncludes(closeoutDoc, required, closeoutDocPath);

for (const [content, snippet, file] of [
  [intake, 'SmartContractor Public Beta First Batch Support Trend Founder Decision Intake', intakePath],
  [handoff, 'SmartContractor Public Beta First Batch Support Trend Founder Handoff', handoffPath],
  [rollup, 'SmartContractor Public Beta First Batch Support Trend Rollup', rollupPath],
  [actionCloseout, 'SmartContractor Public Beta First Batch Internal Action Closeout', actionCloseoutPath],
  [queue, 'SmartContractor Public Beta First Batch Internal Action Queue', queuePath],
  [supportSummary, 'SmartContractor Public Beta First Batch Support Summary', supportSummaryPath],
  [supportSla, 'SmartContractor Public Beta Support SLA', supportSlaPath],
  [knownIssues, 'SmartContractor Public Beta Known Issues', knownIssuesPath],
  [incidentResponse, 'SmartContractor Public Beta Incident Response', incidentResponsePath],
]) assertIncludes(content, snippet, file);

const scriptName = 'check:public-beta-first-batch-support-trend-founder-decision-closeout';

assertIncludes(context, 'Public beta first batch support trend founder decision closeout', contextPath);
assertIncludes(context, scriptName, contextPath);
assertIncludes(context, 'Backlog count at latest audit', contextPath);
assertIncludes(backlog, 'Public beta first batch support trend founder decision closeout', backlogPath);
assertIncludes(backlog, scriptName, backlogPath);
assertIncludes(audit, 'Public beta first batch support trend founder decision closeout', auditPath);
assertIncludes(packageJson, `"${scriptName}"`, packagePath);
assertIncludes(runner, `"${scriptName}"`, runnerPath);

if (/https?:\/\/[^\s)`>"]+|sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(closeoutDoc)) {
  fail('Public beta first batch support trend founder decision closeout must not contain real URLs or secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_beta_first_batch_support_trend_founder_decision_closeout: closeoutDocPath,
  trend_decision_closeout_checked: true,
  live_action_blocked: true,
}, null, 2));
