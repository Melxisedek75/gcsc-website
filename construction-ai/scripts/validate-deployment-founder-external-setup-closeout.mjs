import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const closeoutPath = resolve('..', 'docs', 'smartcontractor-deployment-founder-external-setup-closeout.md');
const decisionPrepPath = resolve('..', 'docs', 'smartcontractor-deployment-decision-prep.md');
const envMapPath = resolve('..', 'docs', 'smartcontractor-deployment-founder-env-map.md');
const liveDecisionPath = resolve('..', 'docs', 'smartcontractor-deployment-live-action-decision-packet.md');
const deployBriefPath = resolve('..', 'docs', 'smartcontractor-deploy-platform-decision-brief.md');
const vercelPreflightPath = resolve('..', 'docs', 'smartcontractor-vercel-preflight.md');
const vercelWalkthroughPath = resolve('..', 'docs', 'smartcontractor-vercel-founder-setup-walkthrough.md');
const vercelEnvMatrixPath = resolve('..', 'docs', 'smartcontractor-vercel-env-matrix.md');
const vercelPostdeployPath = resolve('..', 'docs', 'smartcontractor-vercel-postdeploy-checklist.md');
const publicBetaEnvReportPath = resolve('..', 'docs', 'smartcontractor-public-beta-env-report-template.md');
const publicBetaSmokeCommandsPath = resolve('..', 'docs', 'smartcontractor-public-beta-smoke-commands.md');
const publicBetaUrlSmokePath = resolve('..', 'docs', 'smartcontractor-public-beta-url-smoke-evidence-intake.md');
const publicBetaHandoffPath = resolve('..', 'docs', 'smartcontractor-public-beta-deploy-to-invite-handoff.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Deployment founder external setup closeout validation failed: ${message}`);
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
const decisionPrep = readRequired(decisionPrepPath);
const envMap = readRequired(envMapPath);
const liveDecision = readRequired(liveDecisionPath);
const deployBrief = readRequired(deployBriefPath);
const vercelPreflight = readRequired(vercelPreflightPath);
const vercelWalkthrough = readRequired(vercelWalkthroughPath);
const vercelEnvMatrix = readRequired(vercelEnvMatrixPath);
const vercelPostdeploy = readRequired(vercelPostdeployPath);
const publicBetaEnvReport = readRequired(publicBetaEnvReportPath);
const publicBetaSmokeCommands = readRequired(publicBetaSmokeCommandsPath);
const publicBetaUrlSmoke = readRequired(publicBetaUrlSmokePath);
const publicBetaHandoff = readRequired(publicBetaHandoffPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Deployment Founder External Setup Closeout',
  'Status: INTERNAL_EXTERNAL_SETUP_CLOSEOUT_ONLY',
  'Purpose',
  'Source Documents',
  'Closeout States',
  'Required Founder-Controlled Evidence',
  'Automatic HOLD Rules',
  'Founder Copy/Paste Closeout',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(closeout, section, closeoutPath);

for (const boundary of [
  'does not approve connecting Vercel',
  'GitHub Pages',
  'Namecheap',
  'Supabase',
  'DNS',
  'app stores',
  'payment providers',
  'external accounts',
  'production deploy',
  'entering secrets',
  'changing Supabase Auth redirects',
  'publishing a public beta URL',
  'sending tester invites',
  'real payments',
  'real loans',
  'real escrow',
  'repayment routing',
  'stablecoin settlement',
  'token collateral',
  'legal/provider decisions',
  'public launch',
  'destructive actions',
]) assertIncludes(closeout, boundary, closeoutPath);

for (const state of [
  'READY_FOR_FOUNDER_EXTERNAL_SETUP',
  'NOT_READY_FOR_DEPLOY',
  'HOLD_FOR_ENV_VALUE_REDACTION',
  'HOLD_FOR_ACCOUNT_OWNERSHIP_REVIEW',
  'HOLD_FOR_SMOKE_EVIDENCE',
  'BLOCKED_FOR_EXTERNAL_ACTION',
]) assertIncludes(closeout, state, closeoutPath);

for (const field of [
  'deployment_mode_selected',
  'external_account_owner_confirmed',
  'account_browser_profile_confirmed',
  'billing_plan_reviewed',
  'mfa_status_confirmed',
  'github_repository_scope_confirmed',
  'environment_names_reviewed_no_values',
  'founder_enters_values_directly',
  'supabase_redirect_change_needed',
  'preview_or_public_url_status',
  'postdeploy_smoke_status',
  'request_id_sample_present',
  'no_real_money_flags_confirmed',
  'rollback_owner_confirmed',
  'tester_invites_status',
  'closeout_state',
]) assertIncludes(closeout, field, closeoutPath);

for (const holdRule of [
  'deployment host is unclear',
  'external account owner is unclear',
  'browser profile or workspace ownership is unclear',
  'MFA status is missing',
  'billing exposure is unknown',
  'GitHub repository/project scope is mismatched or unclear',
  'environment names are missing',
  'any environment value appears in chat, docs, screenshots, logs, or commits',
  'service-role key',
  'API key',
  'token',
  'password',
  'webhook secret',
  'database URL',
  'private key',
  'seed phrase',
  'raw `.env`',
  'preview/public URL exists without post-deploy smoke evidence',
  'request ID sample is missing',
  'no-real-money flags are missing',
  'rollback owner or rollback trigger is missing',
  'tester invites are requested before smoke evidence is closed',
]) assertIncludes(closeout, holdRule, closeoutPath);

for (const liveBlock of [
  'connect Vercel',
  'change GitHub Pages settings',
  'change Namecheap or DNS',
  'import/connect a repository in an external dashboard',
  'enter environment variable values',
  'change Supabase Auth redirect URLs',
  'enter service-role keys',
  'trigger production deploys',
  'publish public beta links',
  'send tester invites',
  'enable production payment capture',
  'enable real loans',
  'enable real escrow',
  'enable repayment routing',
  'enable stablecoin settlement',
  'enable token collateral',
  'make legal/provider commitments',
  'launch publicly',
  'perform destructive action',
]) assertIncludes(closeout, liveBlock, closeoutPath);

for (const check of [
  'npm run check:deployment-founder-external-setup-closeout',
  'npm run check:deployment-live-action-decision-packet',
  'npm run check:deployment-decision-prep',
  'npm run check:deployment-founder-env-map',
  'npm run check:deploy-brief',
  'npm run check:vercel-preflight',
  'npm run check:vercel-founder-setup-walkthrough',
  'npm run check:vercel-env-matrix',
  'npm run check:vercel-postdeploy',
  'npm run check:public-beta-env-report',
  'npm run check:public-beta-smoke-commands',
  'npm run check:public-beta-url-smoke-evidence-intake',
  'npm run check:public-beta-deploy-to-invite-handoff',
  'npm run check:real-status-audit',
  'npm run check',
]) assertIncludes(closeout, check, closeoutPath);

for (const [content, snippet, file] of [
  [decisionPrep, 'SmartContractor Deployment Decision Prep', decisionPrepPath],
  [envMap, 'SmartContractor Deployment Founder Environment Map', envMapPath],
  [liveDecision, 'SmartContractor Deployment Live Action Decision Packet', liveDecisionPath],
  [deployBrief, 'SmartContractor Deploy Platform Decision Brief', deployBriefPath],
  [vercelPreflight, 'SmartContractor Vercel Preflight', vercelPreflightPath],
  [vercelWalkthrough, 'SmartContractor Vercel Founder Setup Walkthrough', vercelWalkthroughPath],
  [vercelEnvMatrix, 'SmartContractor Vercel Environment Matrix', vercelEnvMatrixPath],
  [vercelPostdeploy, 'SmartContractor Vercel Post-Deploy Checklist', vercelPostdeployPath],
  [publicBetaEnvReport, 'SmartContractor Public Beta Environment Report Template', publicBetaEnvReportPath],
  [publicBetaSmokeCommands, 'SmartContractor Public Beta Smoke Commands', publicBetaSmokeCommandsPath],
  [publicBetaUrlSmoke, 'SmartContractor Public Beta URL Smoke Evidence Intake', publicBetaUrlSmokePath],
  [publicBetaHandoff, 'SmartContractor Public Beta Deploy-To-Invite Handoff', publicBetaHandoffPath],
]) assertIncludes(content, snippet, file);

const scriptName = 'check:deployment-founder-external-setup-closeout';

assertIncludes(context, 'Deployment founder external setup closeout', contextPath);
assertIncludes(context, scriptName, contextPath);
assertIncludes(context, '899 tracked items, 882 DONE, 12 REVIEW, 3 BLOCKED, 2 LATER', contextPath);
assertIncludes(backlog, 'Deployment founder external setup closeout', backlogPath);
assertIncludes(backlog, scriptName, backlogPath);
assertIncludes(audit, 'Deployment founder external setup closeout', auditPath);
assertIncludes(packageJson, `"${scriptName}"`, packagePath);
assertIncludes(runner, `"${scriptName}"`, runnerPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(closeout)) {
  fail('Deployment founder external setup closeout must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  deployment_founder_external_setup_closeout: closeoutPath,
  local_only: true,
  external_actions_blocked: true,
}, null, 2));
