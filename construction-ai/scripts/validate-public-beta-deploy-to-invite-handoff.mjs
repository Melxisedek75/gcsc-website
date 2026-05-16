import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const handoffPath = resolve('..', 'docs', 'smartcontractor-public-beta-deploy-to-invite-handoff.md');
const deploymentPrepPath = resolve('..', 'docs', 'smartcontractor-deployment-decision-prep.md');
const vercelWalkthroughPath = resolve('..', 'docs', 'smartcontractor-vercel-founder-setup-walkthrough.md');
const envReportPath = resolve('..', 'docs', 'smartcontractor-public-beta-env-report-template.md');
const smokeCommandsPath = resolve('..', 'docs', 'smartcontractor-public-beta-smoke-commands.md');
const smokeIntakePath = resolve('..', 'docs', 'smartcontractor-public-beta-url-smoke-evidence-intake.md');
const inviteReleasePath = resolve('..', 'docs', 'smartcontractor-public-beta-invite-release-decision-packet.md');
const firstCohortPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-cohort-launch-packet.md');
const launchDecisionPath = resolve('..', 'docs', 'smartcontractor-public-beta-launch-decision-record.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Public beta deploy-to-invite handoff validation failed: ${message}`);
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
const deploymentPrep = readRequired(deploymentPrepPath);
const vercelWalkthrough = readRequired(vercelWalkthroughPath);
const envReport = readRequired(envReportPath);
const smokeCommands = readRequired(smokeCommandsPath);
const smokeIntake = readRequired(smokeIntakePath);
const inviteRelease = readRequired(inviteReleasePath);
const firstCohort = readRequired(firstCohortPath);
const launchDecision = readRequired(launchDecisionPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Public Beta Deploy-To-Invite Handoff',
  'Status: INTERNAL_DEPLOY_TO_INVITE_HANDOFF_ONLY',
  'Purpose',
  'What This Does Not Approve',
  'Source Documents',
  'Four Gate Sequence',
  'Gate 1: Founder External Setup',
  'Gate 2: URL Smoke Evidence',
  'Gate 3: Invite Release Review',
  'Gate 4: First Batch Send/Hold',
  'Founder Copy/Paste Status',
  'Automatic HOLD Rules',
  'Stop Before These Actions',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(handoff, section, handoffPath);

for (const required of [
  'not approval to deploy',
  'not approval to share a public beta URL',
  'not approval to send tester invites',
  'not approval to change Vercel, GitHub Pages, Namecheap, Supabase, DNS, Auth redirects, payment providers, app stores, billing, teams, or external account settings',
  'not approval to enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, token collateral, production provider API calls, or public launch',
  'docs/smartcontractor-deployment-decision-prep.md',
  'docs/smartcontractor-vercel-founder-setup-walkthrough.md',
  'docs/smartcontractor-public-beta-env-report-template.md',
  'docs/smartcontractor-public-beta-smoke-commands.md',
  'docs/smartcontractor-public-beta-url-smoke-evidence-intake.md',
  'docs/smartcontractor-public-beta-invite-release-decision-packet.md',
  'docs/smartcontractor-public-beta-first-cohort-launch-packet.md',
  'docs/smartcontractor-public-beta-launch-decision-record.md',
  'HOLD_FOR_EXTERNAL_SETUP',
  'HOLD_FOR_PUBLIC_BETA_URL_REVIEW',
  'HOLD_FOR_RESMOKE',
  'READY_FOR_INVITE_RELEASE_REVIEW',
  'READY_TO_REQUEST_PUBLIC_BETA_INVITE_RELEASE',
  'HOLD_FOR_TESTER_REVIEW',
  'HOLD_FOR_REDACTION',
  'founder opens Vercel or selected host directly',
  'Codex does not click external dashboards, enter secrets, connect accounts, change DNS, change Supabase redirects, or deploy',
  'PUBLIC_SITE_URL is labeled, not pasted as a raw tracked URL',
  'deployed_commit is recorded',
  'request_id_sample is present',
  'security headers are checked',
  'real payments disabled, real loans disabled, escrow disabled, and token collateral disabled are confirmed',
  'rollback_or_hold_decision is recorded',
  'exact invite release approval phrase',
  'I approve releasing the first demo-only public beta invite batch using the reviewed URL evidence and tester-code list only.',
  'first batch remains 3-5 testers',
  'tester-code list is reviewed',
  'private tester identity/contact map stays outside tracked docs',
  'support_owner is known',
  'known issues are acceptable for demo-only testing',
  'public launch approval: no',
  'live-risk actions taken: none',
  'If the deployed URL changes, expires, rotates, points to a different commit, loses request-id/security/no-real-money evidence, or shows live-risk capability, return to Gate 2 and use HOLD_FOR_RESMOKE',
  'If tester names, emails, phone numbers, addresses, account IDs, wallet data, Magic Link URLs, cookies, Authorization headers, or unredacted screenshots enter tracked docs, use HOLD_FOR_REDACTION',
  'If any real payment, real loan, escrow, repayment routing, stablecoin settlement, token collateral, provider credential, legal decision, DNS change, Supabase redirect change, app store setting, or public launch step is needed, stop before live action',
  'npm run check:public-beta-deploy-to-invite-handoff',
  'npm run check:deployment-decision-prep',
  'npm run check:vercel-founder-setup-walkthrough',
  'npm run check:public-beta-env-report',
  'npm run check:public-beta-smoke-commands',
  'npm run check:public-beta-url-smoke-evidence-intake',
  'npm run check:public-beta-invite-release-decision-packet',
  'npm run check:public-beta-first-cohort-launch-packet',
  'npm run check:public-beta-launch-decision-record',
  'npm run check:real-status-audit',
  'npm run check',
]) assertIncludes(handoff, required, handoffPath);

for (const [content, snippet, file] of [
  [deploymentPrep, 'SmartContractor Deployment Decision Prep', deploymentPrepPath],
  [vercelWalkthrough, 'SmartContractor Vercel Founder Setup Walkthrough', vercelWalkthroughPath],
  [envReport, 'SmartContractor Public Beta Environment Report Template', envReportPath],
  [smokeCommands, 'SmartContractor Public Beta Smoke Commands', smokeCommandsPath],
  [smokeIntake, 'SmartContractor Public Beta URL Smoke Evidence Intake', smokeIntakePath],
  [inviteRelease, 'SmartContractor Public Beta Invite Release Decision Packet', inviteReleasePath],
  [firstCohort, 'SmartContractor Public Beta First Cohort Launch Packet', firstCohortPath],
  [launchDecision, 'SmartContractor Public Beta Launch Decision Record', launchDecisionPath],
]) assertIncludes(content, snippet, file);

assertIncludes(context, 'Public beta deploy-to-invite handoff', contextPath);
assertIncludes(context, 'check:public-beta-deploy-to-invite-handoff', contextPath);
assertIncludes(backlog, 'Public beta deploy-to-invite handoff', backlogPath);
assertIncludes(backlog, 'check:public-beta-deploy-to-invite-handoff', backlogPath);
assertIncludes(audit, 'Public beta deploy-to-invite handoff', auditPath);
assertIncludes(packageJson, '"check:public-beta-deploy-to-invite-handoff"', packagePath);
assertIncludes(runner, '"check:public-beta-deploy-to-invite-handoff"', runnerPath);

if (/https?:\/\/[^\s)`>"]+|sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(handoff)) {
  fail('Deploy-to-invite handoff must not contain real URLs or secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_beta_deploy_to_invite_handoff: handoffPath,
  gates_checked: 4,
  live_risk_boundaries_checked: true,
}, null, 2));
