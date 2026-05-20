import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const prepPath = resolve('..', 'docs', 'smartcontractor-founder-auth-admin-activation-prep.md');
const tonightPath = resolve('..', 'docs', 'smartcontractor-founder-tonight-checklist.md');
const troubleshootingPath = resolve('..', 'docs', 'smartcontractor-founder-auth-troubleshooting.md');
const evidencePath = resolve('..', 'docs', 'smartcontractor-founder-auth-evidence-template.md');
const runbookPath = resolve('..', 'docs', 'smartcontractor-founder-admin-activation-runbook.md');
const strictSmokePath = resolve('..', 'docs', 'smartcontractor-strict-admin-smoke-checklist.md');
const authRlsPath = resolve('..', 'docs', 'smartcontractor-auth-rls-plan.md');
const strictRlsReviewPath = resolve('..', 'docs', 'smartcontractor-strict-rls-review.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Founder Auth/Admin activation prep validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const prep = readRequired(prepPath);
const tonight = readRequired(tonightPath);
const troubleshooting = readRequired(troubleshootingPath);
const evidence = readRequired(evidencePath);
const runbook = readRequired(runbookPath);
const strictSmoke = readRequired(strictSmokePath);
const authRls = readRequired(authRlsPath);
const strictRlsReview = readRequired(strictRlsReviewPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Founder Auth/Admin Activation Prep',
  'Current Scope',
  'Founder Evening Sequence',
  'Codex Internal Work Allowed',
  'Codex Must Stop Before',
  'Ready State',
  'Not Ready States',
  'Read-Only Verification Fields',
  'Same-Browser Session Freshness Boundary',
  'Founder Evening Activation Decision Gate',
  'Live Approval Boundary',
  'Post-Activation Prep',
  'Acceptance Check',
  'Required Checks',
]) assertIncludes(prep, section, prepPath);

for (const required of [
  'INTERNAL_PREP_ONLY',
  'not approval to run live SQL',
  'not approval to assign an admin role',
  'not approval to apply strict RLS',
  'not approval to deploy production',
  'real payments',
  'real loans',
  'real escrow',
  'real repayment routing',
  'stablecoin settlement',
  'token collateral',
  'docs/smartcontractor-founder-tonight-checklist.md',
  'docs/smartcontractor-founder-auth-troubleshooting.md',
  'docs/smartcontractor-founder-auth-evidence-template.md',
  'docs/smartcontractor-founder-admin-activation-runbook.md',
  'docs/smartcontractor-strict-admin-smoke-checklist.md',
  'docs/smartcontractor-auth-rls-plan.md',
  'docs/smartcontractor-strict-rls-review.md',
  'C:\\gcsc\\construction-ai',
  'http://localhost:3001/smartcontractor.html',
  'Check Founder Auth Setup',
  'Authenticated: yes',
  'Profile linked: yes',
  'Admin roles shown: none',
  'auth_user_id',
  'public.admin_memberships',
  'profiles.auth_user_id',
  'Supabase access tokens',
  'service-role keys',
  'database passwords',
  'raw `.env` content',
  'applying live Supabase SQL',
  'inserting or updating `public.admin_memberships`',
  'applying strict RLS',
  'Founder Auth Setup ready',
  'not live approval to insert a founder role',
  'npm run check:auth',
  'npm run check:strict-gates',
  'npm run check:strict-admin-smoke',
  'same-browser session freshness',
  'fresh local `Check Founder Auth Setup` result from the same browser before any live approval request',
  'do not rely on stale screenshots, forwarded Magic Link tabs, copied session URLs, browser profiles from another device, or old request IDs',
  'if the browser, device, email tab, selected user, or request ID changes, the state returns to NOT_READY until the founder repeats the same-browser check',
  'record only non-secret freshness evidence: check time, local URL, visible ready/not-ready state, selected-user confirmation, and request ID presence',
  'FOUNDER_EVENING_AUTH_DECISION_GATE',
  'founder-present internal Auth/Admin readiness decision',
  'Ready/Review/Hold',
  'record same-browser check time, selected-user confirmation, visible admin role state, request ID presence, evidence owner, rollback owner, and blocked next action',
  'No live Supabase SQL, admin_memberships insert or update, strict RLS apply, production deploy, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, legal decision, provider commitment, or public launch is approved by this gate',
  'Do not paste the token into chat',
  'npm run check:founder-auth-admin-activation-prep',
  'npm run check:founder-tonight',
  'npm run check:founder-auth-troubleshooting',
  'npm run check:founder-auth-evidence',
  'npm run check:founder-admin-runbook',
  'npm run check:real-status-audit',
  'npm run check',
]) assertIncludes(prep, required, prepPath);

for (const [content, snippet, file] of [
  [tonight, 'Founder Auth Setup ready', tonightPath],
  [troubleshooting, 'Founder Auth Setup problem', troubleshootingPath],
  [evidence, 'SmartContractor Founder Auth Evidence Template', evidencePath],
  [runbook, 'SmartContractor Founder Admin Activation Runbook', runbookPath],
  [strictSmoke, 'SmartContractor Strict Admin Smoke Checklist', strictSmokePath],
  [authRls, 'profiles.auth_user_id', authRlsPath],
  [strictRlsReview, 'admin_memberships', strictRlsReviewPath],
]) assertIncludes(content, snippet, file);

assertIncludes(context, 'Founder Auth/Admin activation prep', contextPath);
assertIncludes(context, 'check:founder-auth-admin-activation-prep', contextPath);
assertIncludes(context, 'Founder Auth same-browser session freshness boundary', contextPath);
assertIncludes(backlog, 'Founder Auth/Admin activation prep', backlogPath);
assertIncludes(backlog, 'check:founder-auth-admin-activation-prep', backlogPath);
assertIncludes(backlog, 'Founder Auth same-browser session freshness boundary', backlogPath);
assertIncludes(audit, 'Founder Auth/Admin activation prep', auditPath);
assertIncludes(audit, 'Founder Auth same-browser session freshness boundary', auditPath);
assertIncludes(packageJson, '"check:founder-auth-admin-activation-prep"', packagePath);
assertIncludes(runner, '"check:founder-auth-admin-activation-prep"', runnerPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(prep)) {
  fail('Founder Auth/Admin activation prep must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  founder_auth_admin_activation_prep: prepPath,
  linked_founder_docs_checked: 7,
  live_stop_boundaries_checked: true,
}, null, 2));
