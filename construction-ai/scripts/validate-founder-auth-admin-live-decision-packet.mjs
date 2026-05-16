import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const packetPath = resolve('..', 'docs', 'smartcontractor-founder-auth-admin-live-decision-packet.md');
const prepPath = resolve('..', 'docs', 'smartcontractor-founder-auth-admin-activation-prep.md');
const runbookPath = resolve('..', 'docs', 'smartcontractor-founder-admin-activation-runbook.md');
const evidencePath = resolve('..', 'docs', 'smartcontractor-founder-auth-evidence-template.md');
const troubleshootingPath = resolve('..', 'docs', 'smartcontractor-founder-auth-troubleshooting.md');
const strictSmokePath = resolve('..', 'docs', 'smartcontractor-strict-admin-smoke-checklist.md');
const authRlsPath = resolve('..', 'docs', 'smartcontractor-auth-rls-plan.md');
const strictRlsReviewPath = resolve('..', 'docs', 'smartcontractor-strict-rls-review.md');
const deployPrepPath = resolve('..', 'docs', 'smartcontractor-deployment-decision-prep.md');
const dailyHookPath = resolve('..', 'docs', 'gcsc-daily-work-mode-hook.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Founder Auth/Admin live decision packet validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) {
    fail(`${file} must include: ${snippet}`);
  }
}

const packet = readRequired(packetPath);
const prep = readRequired(prepPath);
const runbook = readRequired(runbookPath);
const evidence = readRequired(evidencePath);
const troubleshooting = readRequired(troubleshootingPath);
const strictSmoke = readRequired(strictSmokePath);
const authRls = readRequired(authRlsPath);
const strictRlsReview = readRequired(strictRlsReviewPath);
const deployPrep = readRequired(deployPrepPath);
const dailyHook = readRequired(dailyHookPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Founder Auth/Admin Live Decision Packet',
  'Source Documents',
  'Decision Goal',
  'Founder Screen Checklist',
  'Safe Evidence To Record',
  'Founder Copy/Paste Report-Back',
  'Selected Auth User Mismatch Stop',
  'Codex Read-Only Verification Scope',
  'Live Approval Boundary',
  'Ready State',
  'Not Ready States',
  'Blocked For Live Action',
  'Strict RLS Boundary',
  'Required Checks',
  'Acceptance Check',
]) {
  assertIncludes(packet, section, packetPath);
}

for (const required of [
  'INTERNAL_LIVE_DECISION_PACKET_ONLY',
  'not approval to run live SQL',
  'not approval to assign a founder/admin role',
  'not approval to apply strict RLS',
  'not approval to change Supabase settings',
  'not approval to deploy production',
  'real payments',
  'real loans',
  'real escrow',
  'real repayment routing',
  'stablecoin settlement',
  'token collateral',
  'docs/smartcontractor-founder-auth-admin-activation-prep.md',
  'docs/smartcontractor-founder-admin-activation-runbook.md',
  'docs/smartcontractor-founder-auth-evidence-template.md',
  'docs/smartcontractor-founder-auth-troubleshooting.md',
  'docs/smartcontractor-strict-admin-smoke-checklist.md',
  'docs/smartcontractor-auth-rls-plan.md',
  'docs/smartcontractor-strict-rls-review.md',
  'docs/smartcontractor-deployment-decision-prep.md',
  'docs/gcsc-daily-work-mode-hook.md',
  'READY_TO_REQUEST_LIVE_APPROVAL',
  'NOT_READY',
  'BLOCKED_FOR_LIVE_ACTION',
  'C:\\gcsc\\construction-ai',
  'npm start',
  'http://localhost:3001/smartcontractor.html',
  'Founder Auth Setup',
  'Check Founder Auth Setup',
  'Authenticated: yes',
  'Profile linked: yes',
  'Admin roles shown: none',
  'Founder Auth/Admin report-back',
  'Local URL opened: http://localhost:3001/smartcontractor.html',
  'Magic Link opened in same browser: yes/no',
  'Check Founder Auth Setup clicked: yes/no',
  'Authenticated: yes/no',
  'Profile linked: yes/no',
  'Admin roles shown: none/founder/admin/unknown',
  'Selected Auth user confirmed on founder screen: yes/no/not shown',
  'I did not paste any Magic Link URL, token, service-role key, password, or raw .env value.',
  'If the selected Auth user is not shown, unclear, unexpected, or not the founder-controlled user, the packet state is NOT_READY',
  'Codex must not infer the founder Auth user from email text alone',
  'Do not insert admin_memberships when selected-user confirmation is no or not shown',
  'A mismatch requires a fresh same-browser Magic Link check and non-secret founder report-back',
  'Magic Link URL',
  'Supabase access token',
  'refresh token',
  'service-role key',
  'database password',
  'raw `.env` content',
  'public.admin_memberships',
  'profiles.auth_user_id',
  'apply live Supabase SQL',
  'change Supabase Auth redirect settings',
  'Standing approval covers internal prep only',
  'I approve live founder admin activation for the verified founder Auth user.',
  'not approval for strict RLS',
  'founder explicitly approves strict RLS separately',
  'npm run check:founder-auth-admin-live-decision-packet',
  'npm run check:founder-auth-admin-activation-prep',
  'npm run check:founder-admin-runbook',
  'npm run check:founder-auth-evidence',
  'npm run check:founder-auth-troubleshooting',
  'npm run check:strict-admin-smoke',
  'npm run check:auth',
  'npm run check:strict-gates',
  'npm run check:real-status-audit',
  'npm run check',
]) {
  assertIncludes(packet, required, packetPath);
}

for (const [content, snippet, file] of [
  [prep, 'SmartContractor Founder Auth/Admin Activation Prep', prepPath],
  [runbook, 'SmartContractor Founder Admin Activation Runbook', runbookPath],
  [evidence, 'SmartContractor Founder Auth Evidence Template', evidencePath],
  [troubleshooting, 'Founder Auth Setup problem', troubleshootingPath],
  [strictSmoke, 'SmartContractor Strict Admin Smoke Checklist', strictSmokePath],
  [authRls, 'profiles.auth_user_id', authRlsPath],
  [strictRlsReview, 'admin_memberships', strictRlsReviewPath],
  [deployPrep, 'Vercel', deployPrepPath],
  [dailyHook, 'Founder Standing Approval For Internal Evening Work', dailyHookPath],
]) {
  assertIncludes(content, snippet, file);
}

const scriptName = 'check:founder-auth-admin-live-decision-packet';

assertIncludes(context, 'Founder Auth/Admin live decision packet', contextPath);
assertIncludes(context, scriptName, contextPath);
assertIncludes(context, 'Founder Auth/Admin selected-user mismatch stop', contextPath);
assertIncludes(backlog, 'Founder Auth/Admin live decision packet', backlogPath);
assertIncludes(backlog, scriptName, backlogPath);
assertIncludes(backlog, 'Founder Auth/Admin selected-user mismatch stop', backlogPath);
assertIncludes(audit, 'Founder Auth/Admin live decision packet', auditPath);
assertIncludes(audit, 'Founder Auth/Admin selected-user mismatch stop', auditPath);
assertIncludes(audit, 'Raw backlog completion by item count', auditPath);
assertIncludes(audit, 'production-ready', auditPath);
assertIncludes(packageJson, `"${scriptName}"`, packagePath);
assertIncludes(runner, `"${scriptName}"`, runnerPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(packet)) {
  fail('Founder Auth/Admin live decision packet must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  founder_auth_admin_live_decision_packet: packetPath,
  decision_states_checked: 3,
  live_stop_boundaries_checked: true,
}, null, 2));
