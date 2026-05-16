import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const mapPath = resolve('..', 'docs', 'smartcontractor-deployment-founder-env-map.md');
const decisionPrepPath = resolve('..', 'docs', 'smartcontractor-deployment-decision-prep.md');
const livePacketPath = resolve('..', 'docs', 'smartcontractor-deployment-live-action-decision-packet.md');
const vercelSetupPath = resolve('..', 'docs', 'smartcontractor-vercel-founder-setup-walkthrough.md');
const publicBetaPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-cohort-launch-packet.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Deployment founder environment map validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const map = readRequired(mapPath);
const decisionPrep = readRequired(decisionPrepPath);
const livePacket = readRequired(livePacketPath);
const vercelSetup = readRequired(vercelSetupPath);
const publicBeta = readRequired(publicBetaPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Deployment Founder Environment Map',
  'Status: INTERNAL_DEPLOYMENT_ENV_MAP_ONLY',
  'Purpose',
  'Environment Categories',
  'Founder-Owned Values',
  'Codex-Owned Local Prep',
  'Do Not Put In Chat',
  'Pre-Deploy Evidence Record',
  'Preview/Beta URL Hold',
  'Required Checks',
]) assertIncludes(map, section, mapPath);

for (const required of [
  'not approval to deploy',
  'not approval to change Vercel, GitHub Pages, Namecheap, Supabase, payment provider, app store, or external account settings',
  'not approval to enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, token collateral, production provider API calls, or public launch',
  'PUBLIC_SITE_URL',
  'ALLOWED_ORIGINS',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_PUBLISHABLE_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SMARTCONTRACTOR_SMOKE_ACCESS_TOKEN',
  'PAYMENT_PROVIDER_SECRET',
  'METAL_PAY_SECRET',
  'XPR_PRIVATE_KEY',
  'APPLE_TEAM_ID',
  'ANDROID_KEYSTORE_PASSWORD',
  'founder-owned',
  'placeholder-only',
  'local-only',
  'Codex may document variable names, categories, expected surfaces, and blocked-live gates',
  'Codex must not request, receive, store, print, commit, or paste real secret values',
  'secrets, passwords, tokens, service-role keys, private keys, seed phrases, Magic Link URLs, raw .env files, database connection strings, provider credentials, signing keys, and payment data',
  'environment_record_id',
  'target_platform',
  'target_url',
  'source_commit',
  'environment_label',
  'founder_owner',
  'secrets_entered_by_founder_in_dashboard',
  'no_real_money_flags_confirmed',
  'auth_redirect_review_status',
  'rollback_owner',
  'decision: HOLD, REVIEW, or READY_FOR_FOUNDER_CONTROLLED_DEPLOY',
  'Hosted preview or public beta URL sharing remains HOLD until deployment smoke evidence records app shell, health endpoint, security headers, request ID, Auth redirect status, no-real-money banner, disabled payment/loan actions, result, and rollback_or_hold_decision.',
  'npm run check:deployment-founder-env-map',
  'npm run check:deployment-decision-prep',
  'npm run check:deployment-live-action-decision-packet',
  'npm run check:vercel-founder-setup-walkthrough',
  'npm run check:public-beta-first-cohort-launch-packet',
  'npm run check:real-status-audit',
  'npm run check',
]) assertIncludes(map, required, mapPath);

for (const [content, snippet, file] of [
  [decisionPrep, 'SmartContractor Deployment Decision Prep', decisionPrepPath],
  [livePacket, 'SmartContractor Deployment Live Action Decision Packet', livePacketPath],
  [vercelSetup, 'SmartContractor Vercel Founder Setup Walkthrough', vercelSetupPath],
  [publicBeta, 'SmartContractor Public Beta First Cohort Launch Packet', publicBetaPath],
]) assertIncludes(content, snippet, file);

assertIncludes(context, 'Deployment founder environment map', contextPath);
assertIncludes(context, 'check:deployment-founder-env-map', contextPath);
assertIncludes(backlog, 'Deployment founder environment map', backlogPath);
assertIncludes(backlog, 'check:deployment-founder-env-map', backlogPath);
assertIncludes(audit, 'Deployment founder environment map', auditPath);
assertIncludes(packageJson, '"check:deployment-founder-env-map"', packagePath);
assertIncludes(runner, '"check:deployment-founder-env-map"', runnerPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(map)) {
  fail('Deployment founder environment map must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  deployment_founder_env_map: mapPath,
  founder_owned_values_only: true,
  live_external_actions_blocked: true,
}, null, 2));
