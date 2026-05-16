import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const intakePath = resolve('..', 'docs', 'smartcontractor-public-beta-url-smoke-evidence-intake.md');
const deploymentPrepPath = resolve('..', 'docs', 'smartcontractor-deployment-decision-prep.md');
const smokeCommandsPath = resolve('..', 'docs', 'smartcontractor-public-beta-smoke-commands.md');
const inviteReleasePath = resolve('..', 'docs', 'smartcontractor-public-beta-invite-release-decision-packet.md');
const firstCohortPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-cohort-launch-packet.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Public beta URL smoke evidence intake validation failed: ${message}`);
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
const deploymentPrep = readRequired(deploymentPrepPath);
const smokeCommands = readRequired(smokeCommandsPath);
const inviteRelease = readRequired(inviteReleasePath);
const firstCohort = readRequired(firstCohortPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Public Beta URL Smoke Evidence Intake',
  'Status: INTERNAL_PUBLIC_BETA_URL_SMOKE_EVIDENCE_INTAKE_ONLY',
  'Purpose',
  'What This Does Not Approve',
  'Source Documents',
  'Evidence Fields',
  'Required Smoke Results',
  'Decision States',
  'HOLD Defaults',
  'Redaction Rules',
  'Safe Founder Report Back',
  'Invite Release Linkage',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(intake, section, intakePath);

for (const required of [
  'not approval to deploy',
  'not approval to share a public beta URL',
  'not approval to send tester invites',
  'not approval to change Vercel, GitHub Pages, Namecheap, Supabase, DNS, Auth redirects, payment providers, app stores, or external account settings',
  'not approval to enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, token collateral, production provider API calls, or public launch',
  'docs/smartcontractor-deployment-decision-prep.md',
  'docs/smartcontractor-public-beta-smoke-commands.md',
  'docs/smartcontractor-public-beta-invite-release-decision-packet.md',
  'docs/smartcontractor-public-beta-first-cohort-launch-packet.md',
  'url_evidence_recorded_at',
  'public_beta_url_label',
  'deployment_platform',
  'deployed_commit',
  'environment_label',
  'smoke_checked_at',
  'smoke_owner',
  'app_shell_result',
  'api_health_result',
  'beta_readiness_result',
  'mobile_install_readiness_result',
  'production_readiness_result',
  'security_headers_result',
  'request_id_sample',
  'auth_redirect_status',
  'no_real_money_banner_result',
  'payment_actions_disabled_result',
  'loan_actions_disabled_result',
  'escrow_disabled_result',
  'token_collateral_disabled_result',
  'rollback_or_hold_decision',
  'decision: HOLD_FOR_PUBLIC_BETA_URL_REVIEW, HOLD_FOR_RESMOKE, REVIEW, or READY_FOR_INVITE_RELEASE_REVIEW',
  '/api/health',
  '/api/admin/beta-readiness',
  '/api/admin/mobile-install-readiness',
  '/api/admin/production-readiness',
  'X-Request-Id',
  'Content-Security-Policy or documented equivalent',
  'Referrer-Policy',
  'Permissions-Policy',
  'X-Frame-Options',
  'HOLD_FOR_PUBLIC_BETA_URL_REVIEW',
  'HOLD_FOR_RESMOKE',
  'READY_FOR_INVITE_RELEASE_REVIEW',
  'Missing deployed_commit, smoke_checked_at, request_id_sample, disabled real-money evidence, or rollback_or_hold_decision defaults to HOLD_FOR_PUBLIC_BETA_URL_REVIEW',
  'If the URL changes, expires, rotates, points to a different commit, changes environment, loses request-id/security/no-real-money evidence, or shows live-risk capability, use HOLD_FOR_RESMOKE',
  'Do not paste real public beta URLs, tester names, tester contact details, cookies, Authorization headers, Magic Link URLs, Supabase keys, service-role keys, database URLs, payment provider keys, wallet data, customer addresses, screenshots with private data, or raw response bodies into tracked docs',
  'The real URL may stay in founder-controlled private notes; tracked docs should use public_beta_url_label or url_id only',
  'This intake can support asking for the invite release approval phrase only after every evidence field is complete and redacted',
  'This intake does not replace the exact invite release approval phrase',
  'npm run check:public-beta-url-smoke-evidence-intake',
  'npm run check:public-beta-smoke-commands',
  'npm run check:deployment-decision-prep',
  'npm run check:public-beta-invite-release-decision-packet',
  'npm run check:public-beta-first-cohort-launch-packet',
  'npm run check:real-status-audit',
  'npm run check',
]) assertIncludes(intake, required, intakePath);

for (const [content, snippet, file] of [
  [deploymentPrep, 'SmartContractor Deployment Decision Prep', deploymentPrepPath],
  [smokeCommands, 'SmartContractor Public Beta Smoke Commands', smokeCommandsPath],
  [inviteRelease, 'SmartContractor Public Beta Invite Release Decision Packet', inviteReleasePath],
  [firstCohort, 'SmartContractor Public Beta First Cohort Launch Packet', firstCohortPath],
]) assertIncludes(content, snippet, file);

assertIncludes(context, 'Public beta URL smoke evidence intake', contextPath);
assertIncludes(context, 'check:public-beta-url-smoke-evidence-intake', contextPath);
assertIncludes(backlog, 'Public beta URL smoke evidence intake', backlogPath);
assertIncludes(backlog, 'check:public-beta-url-smoke-evidence-intake', backlogPath);
assertIncludes(audit, 'Public beta URL smoke evidence intake', auditPath);
assertIncludes(packageJson, '"check:public-beta-url-smoke-evidence-intake"', packagePath);
assertIncludes(runner, '"check:public-beta-url-smoke-evidence-intake"', runnerPath);

if (/https?:\/\/(?!your-public-beta-url\.example)[^\s)`>"]+|sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(intake)) {
  fail('URL smoke evidence intake must not contain real URL or secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_beta_url_smoke_evidence_intake: intakePath,
  evidence_fields_checked: 19,
  live_risk_boundaries_checked: true,
}, null, 2));
