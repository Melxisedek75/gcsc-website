import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-trend-archive-index-internal-action-closeout-handoff-closeout-handoff-closeout.md');
const sourceDocPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-batch-support-trend-archive-index-internal-action-closeout-handoff-closeout-handoff.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Public beta first batch support trend archive index internal action closeout handoff closeout handoff closeout validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const doc = readRequired(docPath);
const sourceDoc = readRequired(sourceDocPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Public Beta First Batch Support Trend Archive Index Internal Action Closeout Handoff Closeout Handoff Closeout',
  'Status: INTERNAL_TREND_ARCHIVE_INDEX_ACTION_CLOSEOUT_HANDOFF_CLOSEOUT_HANDOFF_CLOSEOUT_ONLY',
  'Purpose',
  'Source Documents',
  'What This Does Not Approve',
  'Required Action Closeout Handoff Closeout Handoff Closeout Fields',
  'Allowed Action Closeout Handoff Closeout Handoff Closeout States',
  'Blocked Action Closeout Handoff Closeout Handoff Closeout Values',
  'Safe Evidence Rules',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(doc, section, docPath);

for (const required of [
  'redacted support trend archive index internal action closeout handoff closeout handoff records',
  'support trend archive index internal action closeout handoff closeout handoff',
  'internal archive index action closeout handoff closeout handoff closeout metadata',
  'founder decision option',
  'founder-review-ready',
  'internal-action-closeout-handoff-closeout-handoff-closeout-ready',
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
  'trend_archive_index_action_closeout_handoff_closeout_handoff_closeout_id',
  'trend_archive_index_action_closeout_handoff_closeout_handoff_id',
  'trend_archive_index_action_closeout_handoff_closeout_id',
  'safe_issue_ids_closed',
  'safe_request_ids_closed',
  'queue_item_ids_closed',
  'closeout_ids_linked',
  'archive_item_ids_linked',
  'handoff_closeout_state: CLOSED_FOR_INTERNAL_ARCHIVE, HOLD_FOR_REDACTION, HOLD_FOR_RECHECK, HOLD_FOR_FOUNDER_REWRITE, or BLOCKED_FOR_EXTERNAL_ACTION',
  'CLOSED_FOR_INTERNAL_ARCHIVE',
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
  'npm run check:public-beta-first-batch-support-trend-archive-index-internal-action-closeout-handoff-closeout-handoff-closeout',
  'npm run check:real-status-audit',
  'npm run check',
]) assertIncludes(doc, required, docPath);

const scriptName = 'check:public-beta-first-batch-support-trend-archive-index-internal-action-closeout-handoff-closeout-handoff-closeout';

assertIncludes(sourceDoc, 'SmartContractor Public Beta First Batch Support Trend Archive Index Internal Action Closeout Handoff Closeout Handoff', sourceDocPath);
assertIncludes(context, 'Public beta first batch support trend archive index internal action closeout handoff closeout handoff closeout', contextPath);
assertIncludes(context, scriptName, contextPath);
assertIncludes(context, 'Backlog count at latest audit: 930 tracked items, 913 DONE, 12 REVIEW, 3 BLOCKED, 2 LATER.', contextPath);
assertIncludes(backlog, 'Public beta first batch support trend archive index internal action closeout handoff closeout handoff closeout', backlogPath);
assertIncludes(backlog, scriptName, backlogPath);
assertIncludes(audit, 'Public beta first batch support trend archive index internal action closeout handoff closeout handoff closeout', auditPath);
assertIncludes(audit, '| DONE | 913 |', auditPath);
assertIncludes(audit, '| TOTAL | 930 |', auditPath);
assertIncludes(audit, '913 / 930', auditPath);
assertIncludes(packageJson, `"${scriptName}"`, packagePath);
assertIncludes(runner, `"${scriptName}"`, runnerPath);

if (/https?:\/\/[^\s)`>"]+|sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc)) {
  fail('Public beta first batch support trend archive index internal action closeout handoff closeout handoff closeout must not contain real URLs or secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_beta_first_batch_support_trend_archive_index_internal_action_closeout_handoff_closeout_handoff_closeout: docPath,
  trend_archive_index_action_closeout_handoff_closeout_handoff_closeout_checked: true,
  live_action_blocked: true,
}, null, 2));
