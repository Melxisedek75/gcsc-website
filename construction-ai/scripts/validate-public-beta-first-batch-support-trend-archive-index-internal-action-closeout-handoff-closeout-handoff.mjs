import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const handoffCloseoutHandoffDocPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-trend-archive-index-internal-action-closeout-handoff-closeout-handoff.md');
const handoffCloseoutDocPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-trend-archive-index-internal-action-closeout-handoff-closeout.md');
const closeoutHandoffDocPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-trend-archive-index-internal-action-closeout-handoff.md');
const actionCloseoutDocPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-trend-archive-index-internal-action-closeout.md');
const actionQueueDocPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-trend-archive-index-internal-action-queue.md');
const archiveDecisionCloseoutPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-trend-archive-index-founder-decision-closeout.md');
const archiveDecisionIntakePath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-trend-archive-index-founder-decision-intake.md');
const handoffDocPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-trend-archive-index-handoff.md');
const indexCloseoutPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-trend-archive-index-closeout.md');
const indexPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-trend-archive-index.md');
const archivePath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-trend-internal-action-archive.md');
const trendCloseoutPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-trend-internal-action-closeout.md');
const trendQueuePath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-trend-internal-action-queue.md');
const decisionCloseoutPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-trend-founder-decision-closeout.md');
const decisionIntakePath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-trend-founder-decision-intake.md');
const trendHandoffPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-trend-founder-handoff.md');
const rollupPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-trend-rollup.md');
const actionCloseoutPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-internal-action-closeout.md');
const internalQueuePath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-internal-action-queue.md');
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
  console.error(`Public beta first batch support trend archive index internal action closeout handoff closeout handoff validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const handoffCloseoutHandoffDoc = readRequired(handoffCloseoutHandoffDocPath);
const handoffCloseoutDoc = readRequired(handoffCloseoutDocPath);
const closeoutHandoffDoc = readRequired(closeoutHandoffDocPath);
const actionCloseoutDoc = readRequired(actionCloseoutDocPath);
const actionQueueDoc = readRequired(actionQueueDocPath);
const archiveDecisionCloseout = readRequired(archiveDecisionCloseoutPath);
const archiveDecisionIntake = readRequired(archiveDecisionIntakePath);
const handoffDoc = readRequired(handoffDocPath);
const indexCloseout = readRequired(indexCloseoutPath);
const indexDoc = readRequired(indexPath);
const archive = readRequired(archivePath);
const trendCloseout = readRequired(trendCloseoutPath);
const trendQueue = readRequired(trendQueuePath);
const decisionCloseout = readRequired(decisionCloseoutPath);
const decisionIntake = readRequired(decisionIntakePath);
const trendHandoff = readRequired(trendHandoffPath);
const rollup = readRequired(rollupPath);
const actionCloseout = readRequired(actionCloseoutPath);
const internalQueue = readRequired(internalQueuePath);
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
  'SmartContractor Public Beta First Batch Support Trend Archive Index Internal Action Closeout Handoff Closeout Handoff',
  'Status: INTERNAL_TREND_ARCHIVE_INDEX_ACTION_CLOSEOUT_HANDOFF_CLOSEOUT_HANDOFF_ONLY',
  'Purpose',
  'Source Documents',
  'What This Does Not Approve',
  'Required Action Closeout Handoff Closeout Handoff Fields',
  'Allowed Action Closeout Handoff Closeout Handoff States',
  'Blocked Action Closeout Handoff Closeout Handoff Values',
  'Safe Evidence Rules',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(handoffCloseoutHandoffDoc, section, handoffCloseoutHandoffDocPath);

for (const required of [
  'redacted support trend archive index internal action closeout handoff closeout records',
  'support trend archive index internal action closeout handoff closeout',
  'internal archive index action closeout handoff closeout handoff metadata',
  'founder decision option',
  'founder-review-ready',
  'internal-action-closeout-handoff-closeout-handoff-ready',
  'tester-code-only',
  'safe issue IDs',
  'safe request IDs',
  'queue item IDs',
  'closeout IDs',
  'archive item IDs',
  'trend category',
  'founder decision summary label',
  'action owner',
  'support owner',
  'rollback owner',
  'handoff owner',
  'no-real-money status',
  'not approval for Codex to reply to testers',
  'raw public beta URL storage or sharing',
  'live Supabase writes',
  'real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral',
  'trend_archive_index_action_closeout_handoff_closeout_handoff_id',
  'trend_archive_index_action_closeout_handoff_closeout_id',
  'trend_archive_index_action_closeout_handoff_id',
  'trend_archive_index_action_closeout_id',
  'trend_archive_index_action_queue_id',
  'trend_archive_index_decision_closeout_id',
  'trend_archive_index_decision_intake_id',
  'trend_archive_index_handoff_id',
  'trend_archive_index_closeout_id',
  'trend_archive_index_id',
  'trend_action_archive_id',
  'trend_action_closeout_id',
  'trend_action_queue_id',
  'trend_decision_closeout_id',
  'trend_decision_intake_id',
  'handoff_id',
  'rollup_id',
  'safe_issue_ids_handed_off',
  'safe_request_ids_handed_off',
  'queue_item_ids_handed_off',
  'closeout_ids_linked',
  'archive_item_ids_linked',
  'trend_category',
  'founder_decision_summary_label',
  'founder_decision_option',
  'action_owner',
  'support_owner',
  'rollback_owner',
  'handoff_owner',
  'redaction_status',
  'no_real_money_status',
  'blocked_action_acknowledgement',
  'next_safe_internal_action',
  'handoff_handoff_state: READY_FOR_INTERNAL_ARCHIVE_REVIEW, HOLD_FOR_REDACTION, HOLD_FOR_RECHECK, HOLD_FOR_FOUNDER_REWRITE, or BLOCKED_FOR_EXTERNAL_ACTION',
  'READY_FOR_INTERNAL_ARCHIVE_REVIEW',
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
  'npm run check:public-beta-first-batch-support-trend-archive-index-internal-action-closeout-handoff-closeout-handoff',
  'npm run check:public-beta-first-batch-support-trend-archive-index-internal-action-closeout-handoff-closeout',
  'npm run check:public-beta-first-batch-support-trend-archive-index-internal-action-closeout-handoff',
  'npm run check:public-beta-first-batch-support-trend-archive-index-internal-action-closeout',
  'npm run check:public-beta-first-batch-support-trend-archive-index-internal-action-queue',
  'npm run check:real-status-audit',
  'npm run check',
]) assertIncludes(handoffCloseoutHandoffDoc, required, handoffCloseoutHandoffDocPath);

for (const [content, snippet, file] of [
  [handoffCloseoutDoc, 'SmartContractor Public Beta First Batch Support Trend Archive Index Internal Action Closeout Handoff Closeout', handoffCloseoutDocPath],
  [closeoutHandoffDoc, 'SmartContractor Public Beta First Batch Support Trend Archive Index Internal Action Closeout Handoff', closeoutHandoffDocPath],
  [actionCloseoutDoc, 'SmartContractor Public Beta First Batch Support Trend Archive Index Internal Action Closeout', actionCloseoutDocPath],
  [actionQueueDoc, 'SmartContractor Public Beta First Batch Support Trend Archive Index Internal Action Queue', actionQueueDocPath],
  [archiveDecisionCloseout, 'SmartContractor Public Beta First Batch Support Trend Archive Index Founder Decision Closeout', archiveDecisionCloseoutPath],
  [archiveDecisionIntake, 'SmartContractor Public Beta First Batch Support Trend Archive Index Founder Decision Intake', archiveDecisionIntakePath],
  [handoffDoc, 'SmartContractor Public Beta First Batch Support Trend Archive Index Handoff', handoffDocPath],
  [indexCloseout, 'SmartContractor Public Beta First Batch Support Trend Archive Index Closeout', indexCloseoutPath],
  [indexDoc, 'SmartContractor Public Beta First Batch Support Trend Archive Index', indexPath],
  [archive, 'SmartContractor Public Beta First Batch Support Trend Internal Action Archive', archivePath],
  [trendCloseout, 'SmartContractor Public Beta First Batch Support Trend Internal Action Closeout', trendCloseoutPath],
  [trendQueue, 'SmartContractor Public Beta First Batch Support Trend Internal Action Queue', trendQueuePath],
  [decisionCloseout, 'SmartContractor Public Beta First Batch Support Trend Founder Decision Closeout', decisionCloseoutPath],
  [decisionIntake, 'SmartContractor Public Beta First Batch Support Trend Founder Decision Intake', decisionIntakePath],
  [trendHandoff, 'SmartContractor Public Beta First Batch Support Trend Founder Handoff', trendHandoffPath],
  [rollup, 'SmartContractor Public Beta First Batch Support Trend Rollup', rollupPath],
  [actionCloseout, 'SmartContractor Public Beta First Batch Internal Action Closeout', actionCloseoutPath],
  [internalQueue, 'SmartContractor Public Beta First Batch Internal Action Queue', internalQueuePath],
  [supportSummary, 'SmartContractor Public Beta First Batch Support Summary', supportSummaryPath],
  [supportSla, 'SmartContractor Public Beta Support SLA', supportSlaPath],
  [knownIssues, 'SmartContractor Public Beta Known Issues', knownIssuesPath],
  [incidentResponse, 'SmartContractor Public Beta Incident Response', incidentResponsePath],
]) assertIncludes(content, snippet, file);

const scriptName = 'check:public-beta-first-batch-support-trend-archive-index-internal-action-closeout-handoff-closeout-handoff';

assertIncludes(context, 'Public beta first batch support trend archive index internal action closeout handoff closeout handoff', contextPath);
assertIncludes(context, scriptName, contextPath);
assertIncludes(context, 'Backlog count at latest audit: 931 tracked items, 914 DONE, 12 REVIEW, 3 BLOCKED, 2 LATER.', contextPath);
assertIncludes(backlog, 'Public beta first batch support trend archive index internal action closeout handoff closeout handoff', backlogPath);
assertIncludes(backlog, scriptName, backlogPath);
assertIncludes(audit, 'Public beta first batch support trend archive index internal action closeout handoff closeout handoff', auditPath);
assertIncludes(audit, '| DONE | 914 |', auditPath);
assertIncludes(audit, '| TOTAL | 931 |', auditPath);
assertIncludes(audit, '914 / 931', auditPath);
assertIncludes(packageJson, `"${scriptName}"`, packagePath);
assertIncludes(runner, `"${scriptName}"`, runnerPath);

if (/https?:\/\/[^\s)`>"]+|sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(handoffCloseoutHandoffDoc)) {
  fail('Public beta first batch support trend archive index internal action closeout handoff closeout handoff must not contain real URLs or secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_beta_first_batch_support_trend_archive_index_internal_action_closeout_handoff_closeout_handoff: handoffCloseoutHandoffDocPath,
  trend_archive_index_action_closeout_handoff_closeout_handoff_checked: true,
  live_action_blocked: true,
}, null, 2));
