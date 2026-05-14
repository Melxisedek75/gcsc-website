import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const walkthroughPath = resolve('..', 'docs', 'smartcontractor-vercel-founder-setup-walkthrough.md');
const deploymentPacketPath = resolve('..', 'docs', 'smartcontractor-deployment-live-action-decision-packet.md');
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
  console.error(`Vercel founder setup walkthrough validation failed: ${message}`);
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

const walkthrough = readRequired(walkthroughPath);
const deploymentPacket = readRequired(deploymentPacketPath);
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
  'SmartContractor Vercel Founder Setup Walkthrough',
  'Source Documents',
  'Use This Only When',
  'Founder Steps In Vercel',
  'Environment Entry Rules',
  'Supabase Redirect Rule',
  'Post-Deploy Smoke Checks',
  'Automatic Stop Conditions',
  'Report Back Format',
  'Required Checks',
  'Acceptance Check',
]) {
  assertIncludes(walkthrough, section, walkthroughPath);
}

for (const required of [
  'INTERNAL_FOUNDER_SETUP_WALKTHROUGH_ONLY',
  'does not connect Vercel',
  'does not approve production deploy',
  'real payments',
  'real loans',
  'real escrow',
  'real repayment routing',
  'stablecoin settlement',
  'token collateral',
  'legal/provider commitments',
  'docs/smartcontractor-deployment-live-action-decision-packet.md',
  'docs/smartcontractor-vercel-preflight.md',
  'docs/smartcontractor-vercel-env-matrix.md',
  'docs/smartcontractor-vercel-postdeploy-checklist.md',
  'docs/smartcontractor-public-beta-env-report-template.md',
  'npm run check',
  'founder is present at the computer',
  'Root Directory to `construction-ai`',
  'Framework Preset to `Other`',
  'Install Command to `npm ci`',
  'Build Command to `npm run check`',
  'Keep every secret value out of chat',
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
  'database passwords',
  'private keys',
  'seed phrases',
  'raw access tokens',
  'Magic Link URLs',
  'authorization headers',
  'cookies',
  'Do not change Supabase Auth redirect URLs',
  'Codex must not change Supabase dashboard settings autonomously',
  '/api/health',
  'X-Request-Id',
  'real payments remain disabled',
  'real loans remain disabled',
  'real escrow remains disabled',
  'real repayment routing remains disabled',
  'stablecoin settlement remains disabled',
  'token collateral remains disabled',
  'Vercel setup walkthrough:',
  'Project import: completed / blocked / not started',
  'Decision: Go / Review / No-Go',
  'npm run check:vercel-founder-setup-walkthrough',
  'npm run check:deployment-live-action-decision-packet',
  'npm run check:vercel-preflight',
  'npm run check:vercel-env-matrix',
  'npm run check:vercel-postdeploy',
  'npm run check:public-beta-env-report',
  'npm run check:real-status-audit',
]) {
  assertIncludes(walkthrough, required, walkthroughPath);
}

for (const [content, snippet, file] of [
  [deploymentPacket, 'SmartContractor Deployment Live Action Decision Packet', deploymentPacketPath],
  [vercelPreflight, 'SmartContractor Vercel Preflight', vercelPreflightPath],
  [vercelEnvMatrix, 'SmartContractor Vercel Environment Matrix', vercelEnvMatrixPath],
  [vercelPostdeploy, 'SmartContractor Vercel Post-Deploy Checklist', vercelPostdeployPath],
  [publicBetaEnvReport, 'SmartContractor Public Beta Environment Report Template', publicBetaEnvReportPath],
]) {
  assertIncludes(content, snippet, file);
}

const scriptName = 'check:vercel-founder-setup-walkthrough';

assertIncludes(context, 'Vercel founder setup walkthrough', contextPath);
assertIncludes(context, scriptName, contextPath);
assertIncludes(backlog, 'Vercel founder setup walkthrough', backlogPath);
assertIncludes(backlog, scriptName, backlogPath);
assertIncludes(audit, 'Vercel founder setup walkthrough', auditPath);
assertIncludes(audit, 'about 96%', auditPath);
assertIncludes(packageJson, `"${scriptName}"`, packagePath);
assertIncludes(runner, `"${scriptName}"`, runnerPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(walkthrough)) {
  fail('Vercel founder setup walkthrough must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  vercel_founder_setup_walkthrough: walkthroughPath,
  founder_steps_checked: 12,
  external_actions_blocked: true,
}, null, 2));
