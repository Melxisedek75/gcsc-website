import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const checklistPath = resolve('..', 'docs', 'smartcontractor-public-beta-invite-founder-send-checklist.md');
const approvalDraftPath = resolve('..', 'docs', 'smartcontractor-public-beta-invite-approval-request-draft.md');
const closeoutPath = resolve('..', 'docs', 'smartcontractor-public-beta-invite-evidence-closeout.md');
const releasePacketPath = resolve('..', 'docs', 'smartcontractor-public-beta-invite-release-decision-packet.md');
const testerInvitePath = resolve('..', 'docs', 'smartcontractor-beta-tester-invite.md');
const issueLogPath = resolve('..', 'docs', 'smartcontractor-beta-issue-log-template.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Public beta invite founder send checklist validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const checklist = readRequired(checklistPath);
const approvalDraft = readRequired(approvalDraftPath);
const closeout = readRequired(closeoutPath);
const releasePacket = readRequired(releasePacketPath);
const testerInvite = readRequired(testerInvitePath);
const issueLog = readRequired(issueLogPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Public Beta Invite Founder Send Checklist',
  'Status: INTERNAL_FOUNDER_CONTROLLED_INVITE_SEND_CHECKLIST_ONLY',
  'Purpose',
  'Preconditions',
  'Founder-Controlled Send Steps',
  'Do Not Store',
  'Hold Rules',
  'Post-Send Local Record',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(checklist, section, checklistPath);

for (const required of [
  'not approval for Codex to send invites',
  'share a public beta URL',
  'open external accounts',
  'change deploy settings',
  'change Supabase redirects',
  'enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral',
  'READY_TO_REQUEST_INVITE_APPROVAL',
  'exact approval phrase',
  'first batch remains 3-5 testers',
  'tester-code list is reviewed',
  'private tester identity/contact map stays outside tracked repo docs',
  'public beta URL is shared only through a founder-controlled channel',
  'support owner and rollback owner are confirmed',
  'no-real-money banner and disabled payment/loan actions are confirmed',
  'Use tester codes, not names, in tracked notes',
  'Paste only the reviewed demo-only invite wording',
  'Share the public beta URL only inside the founder-controlled channel',
  'no real payment, no real loan, no real escrow, no repayment routing, no stablecoin settlement, no token collateral, and no legal decision',
  'do not enter passwords, bank data, card data, SSN, government ID photos, private keys, seed phrases, real customer addresses, or private project contracts',
  'tester code, page/flow, device/browser, expected result, actual result, and redacted screenshot status',
  'real public beta URL',
  'tester names',
  'tester emails',
  'Authorization headers',
  'Magic Link URLs',
  'HOLD_FOR_RECHECK',
  'HOLD_FOR_TESTER_SCOPE_REVIEW',
  'HOLD_FOR_REDACTION',
  'BLOCKED_FOR_EXTERNAL_ACTION',
  'invite_batch_id',
  'approval_phrase_recorded_at',
  'source_commit',
  'public_beta_url_label',
  'tester_codes_sent',
  'sent_by_founder',
  'send_state: SENT_BY_FOUNDER, HOLD_FOR_RECHECK, HOLD_FOR_TESTER_SCOPE_REVIEW, HOLD_FOR_REDACTION, or BLOCKED_FOR_EXTERNAL_ACTION',
  'npm run check:public-beta-invite-founder-send-checklist',
  'npm run check:public-beta-invite-approval-request-draft',
  'npm run check:public-beta-invite-evidence-closeout',
  'npm run check:public-beta-invite-release-decision-packet',
  'npm run check:beta-tester-invite',
  'npm run check:beta-issue-log',
  'npm run check:real-status-audit',
  'npm run check',
]) assertIncludes(checklist, required, checklistPath);

for (const [content, snippet, file] of [
  [approvalDraft, 'SmartContractor Public Beta Invite Approval Request Draft', approvalDraftPath],
  [closeout, 'SmartContractor Public Beta Invite Evidence Closeout', closeoutPath],
  [releasePacket, 'SmartContractor Public Beta Invite Release Decision Packet', releasePacketPath],
  [testerInvite, 'SmartContractor Beta Tester Invite', testerInvitePath],
  [issueLog, 'SmartContractor Beta Issue Log Template', issueLogPath],
]) assertIncludes(content, snippet, file);

const scriptName = 'check:public-beta-invite-founder-send-checklist';

assertIncludes(context, 'Public beta invite founder send checklist', contextPath);
assertIncludes(context, scriptName, contextPath);
assertIncludes(context, 'Backlog count at latest audit', contextPath);
assertIncludes(backlog, 'Public beta invite founder send checklist', backlogPath);
assertIncludes(backlog, scriptName, backlogPath);
assertIncludes(audit, 'Public beta invite founder send checklist', auditPath);
assertIncludes(packageJson, `"${scriptName}"`, packagePath);
assertIncludes(runner, `"${scriptName}"`, runnerPath);

if (/https?:\/\/[^\s)`>"]+|sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(checklist)) {
  fail('Public beta invite founder send checklist must not contain real URLs or secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_beta_invite_founder_send_checklist: checklistPath,
  founder_controlled_send_checked: true,
  codex_send_blocked: true,
}, null, 2));
