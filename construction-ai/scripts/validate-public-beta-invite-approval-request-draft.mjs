import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const draftPath = resolve('..', 'docs', 'smartcontractor-public-beta-invite-approval-request-draft.md');
const closeoutPath = resolve('..', 'docs', 'smartcontractor-public-beta-invite-evidence-closeout.md');
const releasePacketPath = resolve('..', 'docs', 'smartcontractor-public-beta-invite-release-decision-packet.md');
const smokeIntakePath = resolve('..', 'docs', 'smartcontractor-public-beta-url-smoke-evidence-intake.md');
const handoffPath = resolve('..', 'docs', 'smartcontractor-public-beta-deploy-to-invite-handoff.md');
const firstCohortPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-cohort-launch-packet.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Public beta invite approval request draft validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const draft = readRequired(draftPath);
const closeout = readRequired(closeoutPath);
const releasePacket = readRequired(releasePacketPath);
const smokeIntake = readRequired(smokeIntakePath);
const handoff = readRequired(handoffPath);
const firstCohort = readRequired(firstCohortPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Public Beta Invite Approval Request Draft',
  'Status: INTERNAL_INVITE_APPROVAL_REQUEST_DRAFT_ONLY',
  'Purpose',
  'Required Current Evidence',
  'Request Draft Template',
  'Allowed Codex Scope After Approval',
  'Blocked Scope',
  'Recheck Before Use',
  'Required Checks',
]) assertIncludes(draft, section, draftPath);

for (const required of [
  'not approval to send invites',
  'not approval to share a public beta URL',
  'not approval to deploy production',
  'not approval to change external accounts',
  'not approval to enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral',
  'READY_TO_REQUEST_INVITE_APPROVAL',
  'deploy_closeout_state',
  'public_beta_url_status',
  'url_smoke_checked_at',
  'deployed_commit_confirmed',
  'request_id_sample_present',
  'security_headers_checked',
  'auth_redirect_status',
  'no_real_money_banner_visible',
  'disabled_payment_loan_actions_confirmed',
  'support_owner_confirmed',
  'rollback_owner_confirmed',
  'tester_batch_scope',
  'tester_code_only_confirmed',
  'redaction_status',
  'founder_invite_release_phrase_status',
  'If the public beta URL changes, expires, rotates, points to a different commit, loses request-id/security/no-real-money evidence, or shows live-risk capability, the request draft returns to NOT_READY',
  'Public beta invite approval request draft',
  'Current local evidence status: READY_TO_REQUEST_INVITE_APPROVAL',
  'Tester batch scope: [3-5 tester codes only]',
  'I approve releasing the first demo-only public beta invite batch using the reviewed URL evidence and tester-code list only.',
  'This approval is only for releasing the reviewed first demo-only invite batch through a founder-controlled channel using tester codes and redacted support intake.',
  'This approval is not approval for public launch, public announcement, DNS changes, Vercel or GitHub Pages changes, Supabase Auth redirect changes, payment/provider setup, real loans, escrow, repayment routing, stablecoin settlement, token collateral, app store release, legal/provider commitments, adding unreviewed testers, or destructive action.',
  'Do not bundle this request with any other live, external, legal, money, deploy, DNS, Supabase, payment, loan, escrow, stablecoin, token collateral, provider, app store, public launch, or destructive action request.',
  'Codex may mark the invite approval as recorded in local docs',
  'Codex may prepare a redacted founder-controlled send checklist that uses tester codes only',
  'Codex must stop before sending any invite, sharing any public URL, opening external dashboards, entering secrets, changing deploy settings, changing Supabase redirects, enabling provider integrations, or touching any live money feature',
  'Public URL sharing stays separate',
  'Sending actual tester invites stays founder-controlled',
  'Production deploy and external account settings stay separate',
  'Supabase Auth redirects, live SQL, strict RLS, and founder admin activation stay separate',
  'Payment/provider setup stays separate',
  'Real loan, escrow, repayment routing, stablecoin settlement, and token collateral stay separate',
  'Legal/provider commitments stay separate',
  'Public launch stays separate',
  'BLOCKED_FOR_EXTERNAL_ACTION',
  'npm run check:public-beta-invite-approval-request-draft',
  'npm run check:public-beta-invite-evidence-closeout',
  'npm run check:public-beta-invite-release-decision-packet',
  'npm run check:public-beta-url-smoke-evidence-intake',
  'npm run check:public-beta-deploy-to-invite-handoff',
  'npm run check:public-beta-first-cohort-launch-packet',
  'npm run check:real-status-audit',
  'npm run check',
]) assertIncludes(draft, required, draftPath);

for (const [content, snippet, file] of [
  [closeout, 'SmartContractor Public Beta Invite Evidence Closeout', closeoutPath],
  [releasePacket, 'SmartContractor Public Beta Invite Release Decision Packet', releasePacketPath],
  [smokeIntake, 'SmartContractor Public Beta URL Smoke Evidence Intake', smokeIntakePath],
  [handoff, 'SmartContractor Public Beta Deploy-To-Invite Handoff', handoffPath],
  [firstCohort, 'SmartContractor Public Beta First Cohort Launch Packet', firstCohortPath],
]) assertIncludes(content, snippet, file);

const scriptName = 'check:public-beta-invite-approval-request-draft';

assertIncludes(context, 'Public beta invite approval request draft', contextPath);
assertIncludes(context, scriptName, contextPath);
assertIncludes(context, 'Backlog count at latest audit', contextPath);
assertIncludes(backlog, 'Public beta invite approval request draft', backlogPath);
assertIncludes(backlog, scriptName, backlogPath);
assertIncludes(audit, 'Public beta invite approval request draft', auditPath);
assertIncludes(packageJson, `"${scriptName}"`, packagePath);
assertIncludes(runner, `"${scriptName}"`, runnerPath);

if (/https?:\/\/[^\s)`>"]+|sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(draft)) {
  fail('Public beta invite approval request draft must not contain real URLs or secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_beta_invite_approval_request_draft: draftPath,
  approval_phrase_checked: true,
  separate_scope_boundaries_checked: true,
}, null, 2));
