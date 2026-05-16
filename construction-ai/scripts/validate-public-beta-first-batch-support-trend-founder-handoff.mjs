import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const handoffPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-trend-founder-handoff.md');
const rollupPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-trend-rollup.md');
const closeoutPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-internal-action-closeout.md');
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
  console.error(`Public beta first batch support trend founder handoff validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const handoff = readRequired(handoffPath);
const rollup = readRequired(rollupPath);
const closeout = readRequired(closeoutPath);
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
  'SmartContractor Public Beta First Batch Support Trend Founder Handoff',
  'Status: FOUNDER_HANDOFF_ONLY',
  'Purpose',
  'Source Documents',
  'What This Does Not Approve',
  'Required Handoff Fields',
  'Founder Review Questions',
  'Allowed Handoff States',
  'Blocked Founder Handoff Outcomes',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(handoff, section, handoffPath);

for (const required of [
  'redacted founder handoff',
  'support trend rollup',
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
  'handoff_id',
  'rollup_id',
  'safe_issue_ids',
  'safe_request_ids',
  'queue_item_ids',
  'closeout_ids',
  'trend_category',
  'recommended_founder_review',
  'support_owner',
  'rollback_owner',
  'redaction_status',
  'no_real_money_status',
  'blocked_action_acknowledgement',
  'handoff_state: READY_FOR_FOUNDER_REVIEW, HOLD_FOR_REDACTION, HOLD_FOR_RECHECK, HOLD_FOR_FOUNDER_REWRITE, or BLOCKED_FOR_EXTERNAL_ACTION',
  'READY_FOR_FOUNDER_REVIEW',
  'HOLD_FOR_REDACTION',
  'HOLD_FOR_RECHECK',
  'HOLD_FOR_FOUNDER_REWRITE',
  'BLOCKED_FOR_EXTERNAL_ACTION',
  'Does this trend change first-batch tester wording?',
  'Does this trend change support priority?',
  'Does this trend change rollback readiness?',
  'Does this trend require legal/provider review?',
  'Does this trend require external account, deploy, Supabase, app store, or real-money action?',
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
]) assertIncludes(handoff, required, handoffPath);

for (const [content, snippet, file] of [
  [rollup, 'SmartContractor Public Beta First Batch Support Trend Rollup', rollupPath],
  [closeout, 'SmartContractor Public Beta First Batch Internal Action Closeout', closeoutPath],
  [queue, 'SmartContractor Public Beta First Batch Internal Action Queue', queuePath],
  [supportSummary, 'SmartContractor Public Beta First Batch Support Summary', supportSummaryPath],
  [supportSla, 'SmartContractor Public Beta Support SLA', supportSlaPath],
  [knownIssues, 'SmartContractor Public Beta Known Issues', knownIssuesPath],
  [incidentResponse, 'SmartContractor Public Beta Incident Response', incidentResponsePath],
]) assertIncludes(content, snippet, file);

const scriptName = 'check:public-beta-first-batch-support-trend-founder-handoff';

assertIncludes(context, 'Public beta first batch support trend founder handoff', contextPath);
assertIncludes(context, scriptName, contextPath);
assertIncludes(context, 'Backlog count at latest audit', contextPath);
assertIncludes(backlog, 'Public beta first batch support trend founder handoff', backlogPath);
assertIncludes(backlog, scriptName, backlogPath);
assertIncludes(audit, 'Public beta first batch support trend founder handoff', auditPath);
assertIncludes(packageJson, `"${scriptName}"`, packagePath);
assertIncludes(runner, `"${scriptName}"`, runnerPath);

if (/https?:\/\/[^\s)`>"]+|sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(handoff)) {
  fail('Public beta first batch support trend founder handoff must not contain real URLs or secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_beta_first_batch_support_trend_founder_handoff: handoffPath,
  founder_handoff_checked: true,
  live_action_blocked: true,
}, null, 2));
