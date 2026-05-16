import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const intakePath = resolve('..', 'docs', 'smartcontractor-public-beta-invite-post-send-intake.md');
const sendChecklistPath = resolve('..', 'docs', 'smartcontractor-public-beta-invite-founder-send-checklist.md');
const approvalDraftPath = resolve('..', 'docs', 'smartcontractor-public-beta-invite-approval-request-draft.md');
const closeoutPath = resolve('..', 'docs', 'smartcontractor-public-beta-invite-evidence-closeout.md');
const releasePacketPath = resolve('..', 'docs', 'smartcontractor-public-beta-invite-release-decision-packet.md');
const firstCohortPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-cohort-launch-packet.md');
const testerInvitePath = resolve('..', 'docs', 'smartcontractor-beta-tester-invite.md');
const issueLogPath = resolve('..', 'docs', 'smartcontractor-beta-issue-log-template.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Public beta invite post-send intake validation failed: ${message}`);
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
const sendChecklist = readRequired(sendChecklistPath);
const approvalDraft = readRequired(approvalDraftPath);
const closeout = readRequired(closeoutPath);
const releasePacket = readRequired(releasePacketPath);
const firstCohort = readRequired(firstCohortPath);
const testerInvite = readRequired(testerInvitePath);
const issueLog = readRequired(issueLogPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Public Beta Invite Post-Send Intake',
  'Status: INTERNAL_POST_SEND_INTAKE_ONLY',
  'Purpose',
  'Source Documents',
  'What This Does Not Approve',
  'Required Intake Fields',
  'State Options',
  'Safe Evidence Rules',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(intake, section, intakePath);

for (const required of [
  'redacted founder report-back',
  'founder sends the first public beta invite batch outside Codex',
  'tester-code-only',
  'request-id-based',
  'issue-id-based',
  'support-owned',
  'rollback-owned',
  'not approval for Codex to send invites',
  'raw public beta URL storage',
  'private tester names',
  'external account changes',
  'deploy setting changes',
  'Supabase redirect changes',
  'provider setup',
  'real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral',
  'legal decisions or provider commitments',
  'public launch or app store work',
  'invite_batch_id',
  'approval_phrase_recorded_at',
  'founder_send_confirmed_at',
  'source_commit',
  'public_beta_url_label',
  'tester_codes_sent',
  'tester_count',
  'channel_label',
  'sent_by_founder',
  'support_owner',
  'rollback_owner',
  'first_checkin_window',
  'safe_request_ids',
  'safe_issue_ids',
  'known_issue_link_label',
  'redaction_status',
  'post_send_state: SENT_BY_FOUNDER_RECORDED, HOLD_FOR_REDACTION, HOLD_FOR_RECHECK, HOLD_FOR_TESTER_SCOPE_REVIEW, or BLOCKED_FOR_EXTERNAL_ACTION',
  'HOLD_FOR_REDACTION',
  'HOLD_FOR_RECHECK',
  'HOLD_FOR_TESTER_SCOPE_REVIEW',
  'BLOCKED_FOR_EXTERNAL_ACTION',
  'support owner and rollback owner are named',
  'raw URL',
  'tester identity',
  'Authorization header',
  'Magic Link URL',
  'source commit does not match',
  'batch is larger than 3-5 testers',
  'Codex to send invites',
  'open dashboards',
  'change Supabase redirects',
  'safe request IDs',
  'safe issue IDs',
  'redacted screenshot status',
  'service-role keys',
  'database URLs',
  'npm run check:public-beta-invite-post-send-intake',
  'npm run check:public-beta-invite-founder-send-checklist',
  'npm run check:public-beta-invite-approval-request-draft',
  'npm run check:public-beta-invite-evidence-closeout',
  'npm run check:public-beta-invite-release-decision-packet',
  'npm run check:public-beta-first-cohort-launch-packet',
  'npm run check:beta-tester-invite',
  'npm run check:beta-issue-log',
  'npm run check:real-status-audit',
  'npm run check',
]) assertIncludes(intake, required, intakePath);

for (const [content, snippet, file] of [
  [sendChecklist, 'SmartContractor Public Beta Invite Founder Send Checklist', sendChecklistPath],
  [approvalDraft, 'SmartContractor Public Beta Invite Approval Request Draft', approvalDraftPath],
  [closeout, 'SmartContractor Public Beta Invite Evidence Closeout', closeoutPath],
  [releasePacket, 'SmartContractor Public Beta Invite Release Decision Packet', releasePacketPath],
  [firstCohort, 'SmartContractor Public Beta First Cohort Launch Packet', firstCohortPath],
  [testerInvite, 'SmartContractor Beta Tester Invite', testerInvitePath],
  [issueLog, 'SmartContractor Beta Issue Log Template', issueLogPath],
]) assertIncludes(content, snippet, file);

const scriptName = 'check:public-beta-invite-post-send-intake';

assertIncludes(context, 'Public beta invite post-send intake', contextPath);
assertIncludes(context, scriptName, contextPath);
assertIncludes(context, 'Backlog count at latest audit', contextPath);
assertIncludes(backlog, 'Public beta invite post-send intake', backlogPath);
assertIncludes(backlog, scriptName, backlogPath);
assertIncludes(audit, 'Public beta invite post-send intake', auditPath);
assertIncludes(packageJson, `"${scriptName}"`, packagePath);
assertIncludes(runner, `"${scriptName}"`, runnerPath);

if (/https?:\/\/[^\s)`>"]+|sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(intake)) {
  fail('Public beta invite post-send intake must not contain real URLs or secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_beta_invite_post_send_intake: intakePath,
  founder_report_back_checked: true,
  codex_send_blocked: true,
}, null, 2));
