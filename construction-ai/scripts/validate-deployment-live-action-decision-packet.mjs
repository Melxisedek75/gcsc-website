import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const packetPath = resolve('..', 'docs', 'smartcontractor-deployment-live-action-decision-packet.md');
const decisionPrepPath = resolve('..', 'docs', 'smartcontractor-deployment-decision-prep.md');
const deployBriefPath = resolve('..', 'docs', 'smartcontractor-deploy-platform-decision-brief.md');
const vercelPreflightPath = resolve('..', 'docs', 'smartcontractor-vercel-preflight.md');
const vercelEnvMatrixPath = resolve('..', 'docs', 'smartcontractor-vercel-env-matrix.md');
const vercelPostdeployPath = resolve('..', 'docs', 'smartcontractor-vercel-postdeploy-checklist.md');
const publicBetaEnvReportPath = resolve('..', 'docs', 'smartcontractor-public-beta-env-report-template.md');
const founderAuthDecisionPath = resolve('..', 'docs', 'smartcontractor-founder-auth-admin-live-decision-packet.md');
const betaExecutionPath = resolve('..', 'docs', 'smartcontractor-public-beta-founder-execution-plan.md');
const cohortPacketPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-cohort-launch-packet.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Deployment live action decision packet validation failed: ${message}`);
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
const decisionPrep = readRequired(decisionPrepPath);
const deployBrief = readRequired(deployBriefPath);
const vercelPreflight = readRequired(vercelPreflightPath);
const vercelEnvMatrix = readRequired(vercelEnvMatrixPath);
const vercelPostdeploy = readRequired(vercelPostdeployPath);
const publicBetaEnvReport = readRequired(publicBetaEnvReportPath);
const founderAuthDecision = readRequired(founderAuthDecisionPath);
const betaExecution = readRequired(betaExecutionPath);
const cohortPacket = readRequired(cohortPacketPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Deployment Live Action Decision Packet',
  'Source Documents',
  'Recommended Decision',
  'Decision States',
  'Founder External Setup Checklist',
  'Codex Internal Scope',
  'Environment Boundary',
  'Public Beta No-Real-Money Gate',
  'Rollback Gate',
  'Required Checks',
  'Acceptance Check',
]) {
  assertIncludes(packet, section, packetPath);
}

for (const required of [
  'INTERNAL_DEPLOYMENT_LIVE_ACTION_DECISION_PACKET_ONLY',
  'not approval to connect Vercel',
  'not approval to deploy production',
  'not approval to enable real payments',
  'real loans',
  'real escrow',
  'real repayment routing',
  'stablecoin settlement',
  'token collateral',
  'docs/smartcontractor-deployment-decision-prep.md',
  'docs/smartcontractor-deploy-platform-decision-brief.md',
  'docs/smartcontractor-vercel-preflight.md',
  'docs/smartcontractor-vercel-env-matrix.md',
  'docs/smartcontractor-vercel-postdeploy-checklist.md',
  'docs/smartcontractor-public-beta-env-report-template.md',
  'docs/smartcontractor-founder-auth-admin-live-decision-packet.md',
  'docs/smartcontractor-public-beta-founder-execution-plan.md',
  'docs/smartcontractor-public-beta-first-cohort-launch-packet.md',
  'READY_FOR_FOUNDER_EXTERNAL_SETUP',
  'NOT_READY_FOR_DEPLOY',
  'BLOCKED_FOR_EXTERNAL_ACTION',
  'Use Vercel as the first hosted SmartContractor public beta demo target',
  'GitHub Pages only for static docs',
  'Keep local-only',
  'Open the external dashboard personally',
  'Enter environment variables inside the deploy dashboard personally',
  'Keep service-role, payment, lender, provider, database, private key, and token values out of chat',
  'Supabase Auth redirect settings',
  'post-deploy smoke checks',
  'connect Vercel',
  'change GitHub Pages settings',
  'change Namecheap or DNS settings',
  'enter environment variable values',
  'change Supabase Auth redirect URLs',
  'trigger production deploys',
  'publish public beta links',
  'send tester invites',
  'production payment capture',
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
  'database passwords',
  'private keys',
  'seed phrases',
  'raw access tokens',
  'no production payment capture',
  'no real contractor loans',
  'no real escrow',
  'no real repayment routing',
  'no stablecoin settlement',
  'no token collateral',
  'no automatic admin assignment',
  'no legal/provider claims',
  'last known good commit',
  'rollback command or dashboard path',
  'npm run check:deployment-live-action-decision-packet',
  'npm run check:deployment-decision-prep',
  'npm run check:deploy-brief',
  'npm run check:vercel-preflight',
  'npm run check:vercel-env-matrix',
  'npm run check:vercel-postdeploy',
  'npm run check:public-beta-env-report',
  'npm run check:public-beta-founder-execution-plan',
  'npm run check:public-beta-first-cohort-launch-packet',
  'npm run check:real-status-audit',
  'npm run check',
]) {
  assertIncludes(packet, required, packetPath);
}

for (const [content, snippet, file] of [
  [decisionPrep, 'SmartContractor Deployment Decision Prep', decisionPrepPath],
  [deployBrief, 'SmartContractor Deploy Platform Decision Brief', deployBriefPath],
  [vercelPreflight, 'SmartContractor Vercel Preflight', vercelPreflightPath],
  [vercelEnvMatrix, 'SmartContractor Vercel Environment Matrix', vercelEnvMatrixPath],
  [vercelPostdeploy, 'SmartContractor Vercel Post-Deploy Checklist', vercelPostdeployPath],
  [publicBetaEnvReport, 'SmartContractor Public Beta Environment Report Template', publicBetaEnvReportPath],
  [founderAuthDecision, 'SmartContractor Founder Auth/Admin Live Decision Packet', founderAuthDecisionPath],
  [betaExecution, 'SmartContractor Public Beta Founder Execution Plan', betaExecutionPath],
  [cohortPacket, 'SmartContractor Public Beta First Cohort Launch Packet', cohortPacketPath],
]) {
  assertIncludes(content, snippet, file);
}

const scriptName = 'check:deployment-live-action-decision-packet';

assertIncludes(context, 'Deployment live action decision packet', contextPath);
assertIncludes(context, scriptName, contextPath);
assertIncludes(backlog, 'Deployment live action decision packet', backlogPath);
assertIncludes(backlog, scriptName, backlogPath);
assertIncludes(audit, 'Deployment live action decision packet', auditPath);
assertIncludes(audit, 'Raw backlog completion by item count', auditPath);
assertIncludes(audit, 'production-ready', auditPath);
assertIncludes(packageJson, `"${scriptName}"`, packagePath);
assertIncludes(runner, `"${scriptName}"`, runnerPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(packet)) {
  fail('Deployment live action decision packet must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  deployment_live_action_decision_packet: packetPath,
  decision_states_checked: 3,
  external_actions_blocked: true,
}, null, 2));
