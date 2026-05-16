import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const closeoutPath = resolve('..', 'docs', 'smartcontractor-public-beta-invite-evidence-closeout.md');
const deploymentCloseoutPath = resolve('..', 'docs', 'smartcontractor-deployment-founder-external-setup-closeout.md');
const liveDecisionPath = resolve('..', 'docs', 'smartcontractor-deployment-live-action-decision-packet.md');
const inviteReleasePath = resolve('..', 'docs', 'smartcontractor-public-beta-invite-release-decision-packet.md');
const smokeIntakePath = resolve('..', 'docs', 'smartcontractor-public-beta-url-smoke-evidence-intake.md');
const handoffPath = resolve('..', 'docs', 'smartcontractor-public-beta-deploy-to-invite-handoff.md');
const firstCohortPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-cohort-launch-packet.md');
const founderPlanPath = resolve('..', 'docs', 'smartcontractor-public-beta-founder-execution-plan.md');
const testerInvitePath = resolve('..', 'docs', 'smartcontractor-beta-tester-invite.md');
const smokeCommandsPath = resolve('..', 'docs', 'smartcontractor-public-beta-smoke-commands.md');
const issueLogPath = resolve('..', 'docs', 'smartcontractor-beta-issue-log-template.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Public beta invite evidence closeout validation failed: ${message}`);
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
const deploymentCloseout = readRequired(deploymentCloseoutPath);
const liveDecision = readRequired(liveDecisionPath);
const inviteRelease = readRequired(inviteReleasePath);
const smokeIntake = readRequired(smokeIntakePath);
const handoff = readRequired(handoffPath);
const firstCohort = readRequired(firstCohortPath);
const founderPlan = readRequired(founderPlanPath);
const testerInvite = readRequired(testerInvitePath);
const smokeCommands = readRequired(smokeCommandsPath);
const issueLog = readRequired(issueLogPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Public Beta Invite Evidence Closeout',
  'Status: INTERNAL_INVITE_EVIDENCE_CLOSEOUT_ONLY',
  'Purpose',
  'What This Does Not Approve',
  'Source Documents',
  'Closeout States',
  'Required Evidence Fields',
  'Automatic HOLD Rules',
  'Founder Approval Boundary',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(closeout, section, closeoutPath);

for (const boundary of [
  'not approval to publish or share a public beta URL',
  'not approval to send tester invites',
  'not approval to change Vercel, GitHub Pages, Namecheap, Supabase, DNS, Auth redirects, payment providers, app stores, billing, teams, or external account settings',
  'not approval to perform a production deploy, enter secrets, update Supabase redirects, change live RLS, activate founder admin roles, enable production provider calls, or modify live systems',
  'not approval to enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, token collateral, legal/provider commitments, financial commitments, public launch, or destructive actions',
]) assertIncludes(closeout, boundary, closeoutPath);

for (const source of [
  'docs/smartcontractor-deployment-founder-external-setup-closeout.md',
  'docs/smartcontractor-deployment-live-action-decision-packet.md',
  'docs/smartcontractor-public-beta-invite-release-decision-packet.md',
  'docs/smartcontractor-public-beta-url-smoke-evidence-intake.md',
  'docs/smartcontractor-public-beta-deploy-to-invite-handoff.md',
  'docs/smartcontractor-public-beta-first-cohort-launch-packet.md',
  'docs/smartcontractor-public-beta-founder-execution-plan.md',
  'docs/smartcontractor-beta-tester-invite.md',
  'docs/smartcontractor-public-beta-smoke-commands.md',
  'docs/smartcontractor-beta-issue-log-template.md',
]) assertIncludes(closeout, source, closeoutPath);

for (const state of [
  'READY_TO_REQUEST_INVITE_APPROVAL',
  'NOT_READY_FOR_INVITES',
  'HOLD_FOR_URL_SMOKE_EVIDENCE',
  'HOLD_FOR_NO_REAL_MONEY_RECHECK',
  'HOLD_FOR_SUPPORT_ROLLBACK_OWNER',
  'HOLD_FOR_TESTER_SCOPE_REVIEW',
  'BLOCKED_FOR_EXTERNAL_ACTION',
]) assertIncludes(closeout, state, closeoutPath);

for (const field of [
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
  'invite_closeout_state',
]) assertIncludes(closeout, field, closeoutPath);

for (const holdRule of [
  'URL smoke evidence is missing, stale, unreviewed, private, tied to the wrong commit, or tied to the wrong environment',
  'The deployed commit is unknown or not confirmed against the reviewed source commit',
  'A safe request ID sample is missing',
  'security headers are not checked',
  'Auth redirect status is unknown',
  'no-real-money banner or demo-only boundary is missing',
  'payment actions, loan actions, escrow, repayment routing, stablecoin settlement, or token collateral actions appear enabled',
  'support owner, response window, rollback owner, or hold decision owner is missing',
  'tester batch is larger than 3-5 people or includes unreviewed testers',
  'tracked docs contain real tester identities',
  'invite wording omits demo-only',
  'the founder approval phrase is bundled with other approvals',
]) assertIncludes(closeout, holdRule, closeoutPath);

for (const check of [
  'npm run check:public-beta-invite-evidence-closeout',
  'npm run check:deployment-founder-external-setup-closeout',
  'npm run check:deployment-live-action-decision-packet',
  'npm run check:public-beta-url-smoke-evidence-intake',
  'npm run check:public-beta-deploy-to-invite-handoff',
  'npm run check:public-beta-invite-release-decision-packet',
  'npm run check:public-beta-first-cohort-launch-packet',
  'npm run check:public-beta-founder-execution-plan',
  'npm run check:public-beta-smoke-commands',
  'npm run check:real-status-audit',
  'npm run check',
]) assertIncludes(closeout, check, closeoutPath);

for (const [content, snippet, file] of [
  [deploymentCloseout, 'SmartContractor Deployment Founder External Setup Closeout', deploymentCloseoutPath],
  [liveDecision, 'SmartContractor Deployment Live Action Decision Packet', liveDecisionPath],
  [inviteRelease, 'SmartContractor Public Beta Invite Release Decision Packet', inviteReleasePath],
  [smokeIntake, 'SmartContractor Public Beta URL Smoke Evidence Intake', smokeIntakePath],
  [handoff, 'SmartContractor Public Beta Deploy-To-Invite Handoff', handoffPath],
  [firstCohort, 'SmartContractor Public Beta First Cohort Launch Packet', firstCohortPath],
  [founderPlan, 'SmartContractor Public Beta Founder Execution Plan', founderPlanPath],
  [testerInvite, 'SmartContractor Beta Tester Invite', testerInvitePath],
  [smokeCommands, 'SmartContractor Public Beta Smoke Commands', smokeCommandsPath],
  [issueLog, 'SmartContractor Beta Issue Log Template', issueLogPath],
]) assertIncludes(content, snippet, file);

const scriptName = 'check:public-beta-invite-evidence-closeout';

assertIncludes(context, 'Public beta invite evidence closeout', contextPath);
assertIncludes(context, scriptName, contextPath);
assertIncludes(context, 'Backlog count at latest audit', contextPath);
assertIncludes(backlog, 'Public beta invite evidence closeout', backlogPath);
assertIncludes(backlog, scriptName, backlogPath);
assertIncludes(audit, 'Public beta invite evidence closeout', auditPath);
assertIncludes(packageJson, `"${scriptName}"`, packagePath);
assertIncludes(runner, `"${scriptName}"`, runnerPath);

if (/https?:\/\/[^\s)`>"]+|sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(closeout)) {
  fail('Invite evidence closeout must not contain real URLs or secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_beta_invite_evidence_closeout: closeoutPath,
  evidence_fields_checked: 16,
  local_only: true,
  invite_and_url_sharing_blocked: true,
}, null, 2));
