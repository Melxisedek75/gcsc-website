import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const triagePath = resolve('..', 'docs', 'smartcontractor-public-beta-first-response-triage.md');
const postSendIntakePath = resolve('..', 'docs', 'smartcontractor-public-beta-invite-post-send-intake.md');
const sendChecklistPath = resolve('..', 'docs', 'smartcontractor-public-beta-invite-founder-send-checklist.md');
const rubricPath = resolve('..', 'docs', 'smartcontractor-beta-triage-rubric.md');
const issueLogPath = resolve('..', 'docs', 'smartcontractor-beta-issue-log-template.md');
const knownIssuesPath = resolve('..', 'docs', 'smartcontractor-public-beta-known-issues.md');
const supportQueuePath = resolve('..', 'docs', 'smartcontractor-public-beta-support-queue.md');
const incidentResponsePath = resolve('..', 'docs', 'smartcontractor-public-beta-incident-response.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Public beta first response triage validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const triage = readRequired(triagePath);
const postSendIntake = readRequired(postSendIntakePath);
const sendChecklist = readRequired(sendChecklistPath);
const rubric = readRequired(rubricPath);
const issueLog = readRequired(issueLogPath);
const knownIssues = readRequired(knownIssuesPath);
const supportQueue = readRequired(supportQueuePath);
const incidentResponse = readRequired(incidentResponsePath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Public Beta First Response Triage',
  'Status: INTERNAL_FIRST_RESPONSE_TRIAGE_ONLY',
  'Purpose',
  'Source Documents',
  'What This Does Not Approve',
  'Required Triage Fields',
  'Severity Routing',
  'Trust Categories',
  'Triage States',
  'Safe Evidence Rules',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(triage, section, triagePath);

for (const required of [
  'classify the first tester responses',
  'tester-code-only feedback',
  'request IDs',
  'issue IDs',
  'support ownership',
  'rollback ownership',
  'not approval for Codex to reply to testers',
  'raw public beta URL storage',
  'private tester names',
  'live Supabase writes',
  'real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral',
  'legal decisions or provider commitments',
  'response_batch_id',
  'invite_batch_id',
  'tester_code',
  'received_at_label',
  'channel_label',
  'flow_area',
  'safe_request_id',
  'safe_issue_id',
  'severity: P0, P1, P2, or P3',
  'trust_category',
  'reported_expected_result',
  'reported_actual_result',
  'redacted_screenshot_status',
  'support_owner',
  'rollback_owner',
  'triage_state: ACCEPTED_FOR_LOCAL_FIX, QUEUED_FOR_REVIEW, HOLD_FOR_REDACTION, HOLD_FOR_RECHECK, HOLD_FOR_FOUNDER_REPLY, or BLOCKED_FOR_EXTERNAL_ACTION',
  'next_safe_action',
  'P0',
  'P1',
  'P2',
  'P3',
  'auth/session',
  'contractor trust',
  'homeowner trust',
  'payment simulation',
  'dispute evidence',
  'peer review',
  'admin/risk review',
  'mobile/PWA',
  'support/rollback',
  'privacy/redaction',
  'public beta access',
  'ACCEPTED_FOR_LOCAL_FIX',
  'QUEUED_FOR_REVIEW',
  'HOLD_FOR_REDACTION',
  'HOLD_FOR_RECHECK',
  'HOLD_FOR_FOUNDER_REPLY',
  'BLOCKED_FOR_EXTERNAL_ACTION',
  'Authorization header',
  'Magic Link URL',
  'request ID evidence is missing',
  'human response to the tester is needed',
  'Codex to reply to testers',
  'open dashboards',
  'change Supabase redirects',
  'safe request IDs',
  'safe issue IDs',
  'service-role keys',
  'database URLs',
  'npm run check:public-beta-first-response-triage',
  'npm run check:public-beta-invite-post-send-intake',
  'npm run check:public-beta-invite-founder-send-checklist',
  'npm run check:beta-triage-rubric',
  'npm run check:beta-issue-log',
  'npm run check:public-beta-known-issues',
  'npm run check:public-beta-support-queue',
  'npm run check:public-beta-incident-response',
  'npm run check:real-status-audit',
  'npm run check',
]) assertIncludes(triage, required, triagePath);

for (const [content, snippet, file] of [
  [postSendIntake, 'SmartContractor Public Beta Invite Post-Send Intake', postSendIntakePath],
  [sendChecklist, 'SmartContractor Public Beta Invite Founder Send Checklist', sendChecklistPath],
  [rubric, 'SmartContractor Beta Triage Rubric', rubricPath],
  [issueLog, 'SmartContractor Beta Issue Log Template', issueLogPath],
  [knownIssues, 'SmartContractor Public Beta Known Issues', knownIssuesPath],
  [supportQueue, 'SmartContractor Public Beta Support Queue', supportQueuePath],
  [incidentResponse, 'SmartContractor Public Beta Incident Response', incidentResponsePath],
]) assertIncludes(content, snippet, file);

const scriptName = 'check:public-beta-first-response-triage';

assertIncludes(context, 'Public beta first response triage', contextPath);
assertIncludes(context, scriptName, contextPath);
assertIncludes(context, 'Backlog count at latest audit', contextPath);
assertIncludes(backlog, 'Public beta first response triage', backlogPath);
assertIncludes(backlog, scriptName, backlogPath);
assertIncludes(audit, 'Public beta first response triage', auditPath);
assertIncludes(packageJson, `"${scriptName}"`, packagePath);
assertIncludes(runner, `"${scriptName}"`, runnerPath);

if (/https?:\/\/[^\s)`>"]+|sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(triage)) {
  fail('Public beta first response triage must not contain real URLs or secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_beta_first_response_triage: triagePath,
  severity_routing_checked: true,
  codex_reply_blocked: true,
}, null, 2));
