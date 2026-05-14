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
assertIncludes(backlog, 'Deployment decision prep', backlogPath);
assertIncludes(backlog, 'check:deployment-decision-prep', backlogPath);
assertIncludes(audit, 'Deployment decision prep', auditPath);
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
