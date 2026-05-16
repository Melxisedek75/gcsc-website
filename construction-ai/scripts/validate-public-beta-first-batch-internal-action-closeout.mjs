import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const closeoutPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-internal-action-closeout.md');
const queuePath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-internal-action-queue.md');
const decisionIntakePath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-founder-support-decision-intake.md');
const handoffPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-founder-support-handoff.md');
const supportSummaryPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-summary.md');
const supportQueuePath = resolve('..', 'docs', 'smartcontractor-public-beta-support-queue.md');
const knownIssuesPath = resolve('..', 'docs', 'smartcontractor-public-beta-known-issues.md');
const incidentResponsePath = resolve('..', 'docs', 'smartcontractor-public-beta-incident-response.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Public beta first batch internal action closeout validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const closeout = readRequired(closeoutPath);
const queue = readRequired(queuePath);
const decisionIntake = readRequired(decisionIntakePath);
const handoff = readRequired(handoffPath);
const supportSummary = readRequired(supportSummaryPath);
const supportQueue = readRequired(supportQueuePath);
const knownIssues = readRequired(knownIssuesPath);
const incidentResponse = readRequired(incidentResponsePath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Public Beta First Batch Internal Action Closeout',
  'Status: INTERNAL_CLOSEOUT_ONLY',
  'Purpose',
  'Source Documents',
  'What This Does Not Approve',
  'Required Closeout Fields',
  'Allowed Closeout States',
  'Safe Completion Evidence',
  'Blocked Closeout Outcomes',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(closeout, section, closeoutPath);

for (const required of [
  'redacted internal action closeout',
  'tester code',
  'safe issue ID',
  'safe request ID',
  'queue item ID',
  'closeout state',
  'support owner',
  'rollback owner',
  'no-real-money confirmation',
  'not approval for Codex to reply to testers',
  'raw public beta URL storage or sharing',
  'live Supabase writes',
  'real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral',
  'closeout_id',
  'queue_item_id',
  'safe_issue_id',
  'safe_request_id',
  'action_type_completed',
  'completion_summary_label',
  'internal_owner',
  'support_owner',
  'rollback_owner',
  'redaction_status',
  'no_real_money_status',
  'blocked_action_acknowledgement',
  'closeout_state: CLOSED_LOCAL_ONLY, HOLD_FOR_FOUNDER_REVIEW, HOLD_FOR_REDACTION, HOLD_FOR_RECHECK, or BLOCKED_FOR_EXTERNAL_ACTION',
  'CLOSED_LOCAL_ONLY',
  'HOLD_FOR_FOUNDER_REVIEW',
  'HOLD_FOR_REDACTION',
  'HOLD_FOR_RECHECK',
  'BLOCKED_FOR_EXTERNAL_ACTION',
  'DOC_UPDATE',
  'LOCAL_QA',
  'TRIAGE_RECHECK',
  'SUPPORT_LABEL_UPDATE',
  'ROLLBACK_PREP',
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
  'npm run check:public-beta-first-batch-internal-action-closeout',
  'npm run check:public-beta-first-batch-internal-action-queue',
  'npm run check:public-beta-first-batch-founder-support-decision-intake',
  'npm run check:public-beta-first-batch-founder-support-handoff',
  'npm run check:public-beta-first-batch-support-summary',
  'npm run check:public-beta-support-queue',
  'npm run check:public-beta-known-issues',
  'npm run check:public-beta-incident-response',
  'npm run check:real-status-audit',
  'npm run check',
]) assertIncludes(closeout, required, closeoutPath);

for (const [content, snippet, file] of [
  [queue, 'SmartContractor Public Beta First Batch Internal Action Queue', queuePath],
  [decisionIntake, 'SmartContractor Public Beta First Batch Founder Support Decision Intake', decisionIntakePath],
  [handoff, 'SmartContractor Public Beta First Batch Founder Support Handoff', handoffPath],
  [supportSummary, 'SmartContractor Public Beta First Batch Support Summary', supportSummaryPath],
  [supportQueue, 'SmartContractor Public Beta Support Queue', supportQueuePath],
  [knownIssues, 'SmartContractor Public Beta Known Issues', knownIssuesPath],
  [incidentResponse, 'SmartContractor Public Beta Incident Response', incidentResponsePath],
]) assertIncludes(content, snippet, file);

const scriptName = 'check:public-beta-first-batch-internal-action-closeout';

assertIncludes(context, 'Public beta first batch internal action closeout', contextPath);
assertIncludes(context, scriptName, contextPath);
assertIncludes(context, 'Backlog count at latest audit', contextPath);
assertIncludes(backlog, 'Public beta first batch internal action closeout', backlogPath);
assertIncludes(backlog, scriptName, backlogPath);
assertIncludes(audit, 'Public beta first batch internal action closeout', auditPath);
assertIncludes(packageJson, `"${scriptName}"`, packagePath);
assertIncludes(runner, `"${scriptName}"`, runnerPath);

if (/https?:\/\/[^\s)`>"]+|sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(closeout)) {
  fail('Public beta first batch internal action closeout must not contain real URLs or secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_beta_first_batch_internal_action_closeout: closeoutPath,
  internal_action_closeout_checked: true,
  live_action_blocked: true,
}, null, 2));
