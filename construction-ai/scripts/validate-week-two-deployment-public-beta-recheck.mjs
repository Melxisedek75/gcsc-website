import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const recheckPath = resolve('..', 'docs', 'smartcontractor-week-two-deployment-public-beta-recheck-2026-06-06.md');
const deploymentPrepPath = resolve('..', 'docs', 'smartcontractor-deployment-decision-prep.md');
const vercelWalkthroughPath = resolve('..', 'docs', 'smartcontractor-vercel-founder-setup-walkthrough.md');
const vercelPreflightPath = resolve('..', 'docs', 'smartcontractor-vercel-preflight.md');
const vercelEnvMatrixPath = resolve('..', 'docs', 'smartcontractor-vercel-env-matrix.md');
const vercelPostdeployPath = resolve('..', 'docs', 'smartcontractor-vercel-postdeploy-checklist.md');
const urlSmokeIntakePath = resolve('..', 'docs', 'smartcontractor-public-beta-url-smoke-evidence-intake.md');
const authAdminRecheckPath = resolve('..', 'docs', 'smartcontractor-week-two-auth-admin-readiness-recheck-2026-06-06.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Week 2 deployment/public beta recheck validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const recheck = readRequired(recheckPath);
const deploymentPrep = readRequired(deploymentPrepPath);
const vercelWalkthrough = readRequired(vercelWalkthroughPath);
const vercelPreflight = readRequired(vercelPreflightPath);
const vercelEnvMatrix = readRequired(vercelEnvMatrixPath);
const vercelPostdeploy = readRequired(vercelPostdeployPath);
const urlSmokeIntake = readRequired(urlSmokeIntakePath);
const authAdminRecheck = readRequired(authAdminRecheckPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Week 2 Deployment/Public Beta Recheck',
  'Status: LOCAL_RECHECK_ONLY',
  'Source Documents And Surfaces',
  'Week 2 Deployment Recheck Sequence',
  'Current Hold State Matrix',
  'Founder Safe Report-Back',
  'Decision State Matrix',
  'Supabase Redirect And Env Boundary',
  'Public URL And Invite Boundary',
  'Codex Scope',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(recheck, section, recheckPath);

for (const required of [
  'This recheck does not approve deployment, public beta, external account work',
  'docs/smartcontractor-deployment-decision-prep.md',
  'docs/smartcontractor-vercel-founder-setup-walkthrough.md',
  'docs/smartcontractor-vercel-preflight.md',
  'docs/smartcontractor-vercel-env-matrix.md',
  'docs/smartcontractor-vercel-postdeploy-checklist.md',
  'docs/smartcontractor-public-beta-url-smoke-evidence-intake.md',
  'docs/smartcontractor-public-beta-invite-founder-send-checklist.md',
  'docs/smartcontractor-public-beta-founder-execution-plan.md',
  'docs/smartcontractor-week-two-auth-admin-readiness-recheck-2026-06-06.md',
  '/api/admin/deployment-next-step-readiness',
  '/api/admin/week-two-deployment-public-beta-readiness',
  '/api/admin/week-two-deployment-public-beta-execution-checklist',
  'Confirm the deployment target label',
  'root directory remains `construction-ai`',
  'Confirm environment variable names only',
  'Confirm Supabase redirect owner, but do not update Supabase redirects from this recheck',
  'public_beta_url_label',
  'url_id',
  'no-real-money evidence',
  'rollback owner',
  'NOT_READY_FOR_DEPLOYMENT',
  'BLOCKED_FOR_EXTERNAL_ACTION',
  'HOLD_FOR_PUBLIC_BETA_URL_REVIEW',
  'HOLD_FOR_RESMOKE',
  'HOLD_FOR_INVITE_RELEASE_REVIEW',
  'Deployment/Public Beta Week 2 Recheck',
  'environment_values_pasted_to_chat: no',
  'supabase_redirect_changed: no',
  'real_public_url_pasted_to_chat_or_tracked_docs: no',
  'tester_invite_requested: no',
  'Live-risk actions taken: none',
  'READY_FOR_FOUNDER_ACCOUNT_REVIEW',
  'READY_FOR_PUBLIC_URL_SMOKE_REVIEW',
  'READY_FOR_INVITE_RELEASE_REVIEW',
  'Vercel import',
  'GitHub Pages setting change',
  'DNS/Namecheap change',
  'production env value entry',
  'Supabase redirect update',
  'public URL share',
  'tester invite send',
  'Supabase redirect review remains separate from deployment target review',
  'Do not update Supabase Auth redirects until a founder-controlled deployed URL exists',
  'Do not paste `SUPABASE_SERVICE_ROLE_KEY`',
  'Do not paste a real public beta URL into chat or tracked docs',
  'Tracked docs may use only `public_beta_url_label` or `url_id`',
  'Tester invite release remains a separate founder decision',
  'Codex must stop before external account login',
  'npm run check:week-two-deployment-public-beta-recheck',
  'npm run check:deployment-decision-prep',
  'npm run check:vercel-founder-setup-walkthrough',
  'npm run check:public-beta-url-smoke-evidence-intake',
  'no-external-account, no-deploy, no-public-URL-share, no-tester-invite, no-live-Supabase, no-real-money, no-legal/provider, no-XPR-signature, no-public-launch, and no-production boundaries',
]) assertIncludes(recheck, required, recheckPath);

for (const [content, snippet, file] of [
  [deploymentPrep, 'SmartContractor Deployment Decision Prep', deploymentPrepPath],
  [vercelWalkthrough, 'SmartContractor Vercel Founder Setup Walkthrough', vercelWalkthroughPath],
  [vercelPreflight, 'SmartContractor Vercel Preflight', vercelPreflightPath],
  [vercelEnvMatrix, 'SmartContractor Vercel Environment Matrix', vercelEnvMatrixPath],
  [vercelPostdeploy, 'SmartContractor Vercel Post-Deploy Checklist', vercelPostdeployPath],
  [urlSmokeIntake, 'SmartContractor Public Beta URL Smoke Evidence Intake', urlSmokeIntakePath],
  [authAdminRecheck, 'SmartContractor Week 2 Auth/Admin Readiness Recheck', authAdminRecheckPath],
]) assertIncludes(content, snippet, file);

assertIncludes(context, 'Week 2 deployment/public beta recheck', contextPath);
assertIncludes(context, 'check:week-two-deployment-public-beta-recheck', contextPath);
assertIncludes(backlog, 'Week 2 deployment/public beta recheck', backlogPath);
assertIncludes(backlog, 'check:week-two-deployment-public-beta-recheck', backlogPath);
assertIncludes(packageJson, '"check:week-two-deployment-public-beta-recheck"', packagePath);
assertIncludes(runner, '"check:week-two-deployment-public-beta-recheck"', runnerPath);

if (/https?:\/\/(?!localhost(?::\d+)?(?:\/|\s|$)|127\.0\.0\.1(?::\d+)?(?:\/|\s|$))[^\s)`>"]+|sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(recheck)) {
  fail('Week 2 deployment/public beta recheck must not contain real URL or secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  week_two_deployment_public_beta_recheck: recheckPath,
  linked_source_docs_checked: 7,
  live_stop_boundaries_checked: true,
}, null, 2));
