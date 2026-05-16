import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const prepPath = resolve('..', 'docs', 'smartcontractor-deployment-decision-prep.md');
const deployBriefPath = resolve('..', 'docs', 'smartcontractor-deploy-platform-decision-brief.md');
const vercelPreflightPath = resolve('..', 'docs', 'smartcontractor-vercel-preflight.md');
const vercelEnvMatrixPath = resolve('..', 'docs', 'smartcontractor-vercel-env-matrix.md');
const vercelPostdeployPath = resolve('..', 'docs', 'smartcontractor-vercel-postdeploy-checklist.md');
const publicBetaEnvReportPath = resolve('..', 'docs', 'smartcontractor-public-beta-env-report-template.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Deployment decision prep validation failed: ${message}`);
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
const deployBrief = readRequired(deployBriefPath);
const vercelPreflight = readRequired(vercelPreflightPath);
const vercelEnvMatrix = readRequired(vercelEnvMatrixPath);
const vercelPostdeploy = readRequired(vercelPostdeployPath);
const publicBetaEnvReport = readRequired(publicBetaEnvReportPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Deployment Decision Prep',
  'Status: INTERNAL_DEPLOYMENT_DECISION_PREP_ONLY',
  'Current Recommendation',
  'What This Does Not Approve',
  'Deployment Options',
  'Recommended Decision Path',
  'Founder Decisions Needed Later',
  'Blocked Live Actions',
  'Environment Categories',
  'Deployment Gates',
  'Preview Smoke Evidence Boundary',
  'Public Beta URL Smoke Evidence Boundary',
  'Preview URL Expiration And Rotation Boundary',
  'Deployment Account Session Separation Boundary',
  'No-Real-Money Public Beta Policy',
  'Founder Handoff Sequence',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(prep, section, prepPath);

for (const required of [
  'Use Vercel as the first public beta host',
  'no-real-money demo',
  'GitHub Pages',
  'Local-only',
  'Later platform',
  'custom VPS',
  'Cloudflare',
  'Render',
  'Azure',
  'Supabase Edge Functions',
  'not approval to',
  'connect Vercel',
  'production deploy',
  'change domain or DNS',
  'enter secrets or service-role keys',
  'change Supabase Auth redirect URLs',
  'enable real payments',
  'enable real loans',
  'enable real escrow',
  'enable real repayment routing',
  'enable stablecoin settlement',
  'enable token collateral',
  'announce public launch',
  'Confirm deployment host',
  'Confirm domain strategy',
  'Confirm public beta scope',
  'Confirm who enters environment variables',
  'Confirm Supabase Auth redirect URL',
  'Confirm rollback owner',
  'Vercel import',
  'GitHub Pages repository settings',
  'Namecheap',
  'environment variable entry',
  'Supabase Auth redirect changes',
  'PUBLIC_SITE_URL',
  'ALLOWED_ORIGINS',
  'SUPABASE_URL',
  'SUPABASE_PUBLISHABLE_KEY',
  'SMARTCONTRACTOR_AUTH_MODE',
  'SMARTCONTRACTOR_ROUTE_PROTECTION',
  'SMARTCONTRACTOR_ADMIN_ENFORCEMENT_MODE',
  'GCSC_XPR_RECEIVER_ACCOUNT',
  'METAL_PAY_CONNECT_ENV',
  'SUPABASE_SERVICE_ROLE_KEY',
  'payment-provider secrets',
  'lender/provider credentials',
  'real contractor loans',
  'real escrow',
  'real repayment routing',
  'stablecoin settlement',
  'token collateral locking',
  'production payment capture',
  'automatic admin assignment',
  'Founder Auth/Admin activation prep',
  'strict admin smoke plan',
  'rollback owner',
  'post-deploy checklist',
  'Preview smoke evidence is internal evidence only and is not approval for production deploy, tester invites, public launch, domain changes, DNS changes, Supabase redirect changes, payment provider setup, real loans, real escrow, repayment routing, stablecoin settlement, or token collateral',
  'Each preview smoke record must capture deploy_target, preview_url, commit_sha, check_run, tested_routes, auth_mode, route_protection_mode, admin_enforcement_mode, request_id_sample, security_headers_result, no_real_money_flags_result, tester_invite_status, rollback_status, owner, and decision',
  'Missing commit_sha, missing check_run, missing tested_routes, missing request_id_sample, missing security_headers_result, or missing no_real_money_flags_result defaults the preview decision to BLOCKED_FOR_EXTERNAL_ACTION',
  'Preview smoke evidence may support READY_FOR_FOUNDER_EXTERNAL_SETUP only after local checks pass, demo-only scope is confirmed, service-role/provider secrets remain founder-controlled, and rollback owner is recorded',
  'Before any public beta URL is treated as shareable, the founder must record public_beta_url, deployment_platform, deployed_commit, environment_label, smoke_checked_at, smoke_owner, and result',
  'Required smoke evidence must include app shell reachable, /api/health reachable, security headers present, request ID visible, Auth redirect status checked, no-real-money banner visible, payment and loan actions disabled, and rollback_or_hold_decision recorded',
  'A missing public_beta_url, deployed_commit, smoke_checked_at, request ID, disabled real-money evidence, or rollback_or_hold_decision defaults to HOLD_FOR_PUBLIC_BETA_URL_REVIEW',
  'Public beta URL smoke evidence is not production launch approval, DNS approval, Vercel account authorization, Supabase redirect approval, public tester invite approval, payment-provider setup, real loan approval, escrow approval, or legal/provider approval',
  'A preview or beta URL must record url_id, platform, deployed_commit, generated_at, last_smoke_checked_at, owner, intended_audience, expiration_or_rotation_status, and rollback_or_hold_decision before it can support tester, founder, investor, grant, partner, or provider sharing',
  'If the URL rotates, expires, points to a different commit, changes environment, loses health/security/request-id evidence, or shows any real-money capability, the URL defaults to HOLD_FOR_RESMOKE and cannot be shared until a fresh founder-controlled smoke record is captured',
  'Old preview links, screenshots, chat messages, browser history, deployment emails, or copied URLs are not share approval and cannot replace current deployed_commit, no-real-money, Auth redirect, security header, request ID, and rollback evidence',
  'Preview URL evidence never approves production deploy settings, DNS, external account changes, tester invites, payment/provider setup, legal/provider commitments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, or public launch',
  'Before external deployment setup can move from internal prep to founder action, the founder must record account_owner, browser_profile, deployment_platform, repository_scope, project_scope, mfa_status, billing_plan_status, organization_or_personal_workspace, and stop_boundary_acknowledgement',
  'Shared browser sessions, borrowed accounts, unclear workspace ownership, missing MFA, unknown billing exposure, or mismatched GitHub repository scope default to BLOCKED_FOR_EXTERNAL_ACCOUNT_REVIEW',
  'Codex may prepare checklists and read-only placeholders only; it must not click through Vercel, GitHub Pages, DNS, Supabase redirect, billing, team invite, or production project settings',
  'Account session separation review does not approve secrets entry, production deploy, DNS changes, Supabase Auth redirects, payment/provider setup, tester invites, legal/provider commitments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, or public launch',
  'npm run check:deployment-decision-prep',
  'npm run check:deploy-brief',
  'npm run check:vercel-preflight',
  'npm run check:vercel-env-matrix',
  'npm run check:vercel-postdeploy',
  'npm run check:public-beta-env-report',
  'npm run check:real-status-audit',
  'npm run check',
]) assertIncludes(prep, required, prepPath);

for (const [content, snippet, file] of [
  [deployBrief, 'SmartContractor Deploy Platform Decision Brief', deployBriefPath],
  [vercelPreflight, 'SmartContractor Vercel Preflight', vercelPreflightPath],
  [vercelEnvMatrix, 'SmartContractor Vercel Environment Matrix', vercelEnvMatrixPath],
  [vercelPostdeploy, 'SmartContractor Vercel Post-Deploy Checklist', vercelPostdeployPath],
  [publicBetaEnvReport, 'SmartContractor Public Beta Environment Report Template', publicBetaEnvReportPath],
]) assertIncludes(content, snippet, file);

assertIncludes(context, 'Deployment decision prep', contextPath);
assertIncludes(context, 'check:deployment-decision-prep', contextPath);
assertIncludes(context, 'Deployment preview smoke evidence boundary', contextPath);
assertIncludes(context, 'Deployment public beta URL smoke evidence boundary', contextPath);
assertIncludes(context, 'Deployment preview URL expiration and rotation boundary', contextPath);
assertIncludes(context, 'Deployment account session separation boundary', contextPath);
assertIncludes(backlog, 'Deployment decision prep', backlogPath);
assertIncludes(backlog, 'check:deployment-decision-prep', backlogPath);
assertIncludes(backlog, 'Deployment preview smoke evidence boundary', backlogPath);
assertIncludes(backlog, 'Deployment public beta URL smoke evidence boundary', backlogPath);
assertIncludes(backlog, 'Deployment preview URL expiration and rotation boundary', backlogPath);
assertIncludes(backlog, 'Deployment account session separation boundary', backlogPath);
assertIncludes(audit, 'Deployment decision prep', auditPath);
assertIncludes(audit, 'Deployment preview smoke evidence boundary', auditPath);
assertIncludes(audit, 'Deployment public beta URL smoke evidence boundary', auditPath);
assertIncludes(audit, 'Deployment preview URL expiration and rotation boundary', auditPath);
assertIncludes(audit, 'Deployment account session separation boundary', auditPath);
assertIncludes(packageJson, '"check:deployment-decision-prep"', packagePath);
assertIncludes(runner, '"check:deployment-decision-prep"', runnerPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(prep)) {
  fail('Deployment decision prep must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  deployment_decision_prep: prepPath,
  deployment_options_checked: 4,
  live_external_actions_blocked: true,
}, null, 2));
