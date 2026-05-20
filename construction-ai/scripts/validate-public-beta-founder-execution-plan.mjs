import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const planPath = resolve('..', 'docs', 'smartcontractor-public-beta-founder-execution-plan.md');
const reviewPacketPath = resolve('..', 'docs', 'smartcontractor-public-beta-review-packet.md');
const launchReadinessPath = resolve('..', 'docs', 'smartcontractor-public-beta-launch-readiness.md');
const launchDecisionPath = resolve('..', 'docs', 'smartcontractor-public-beta-launch-decision-record.md');
const handoffPath = resolve('..', 'docs', 'smartcontractor-public-beta-handoff-checklist.md');
const launchRunbookPath = resolve('..', 'docs', 'smartcontractor-public-launch-runbook.md');
const demoScriptPath = resolve('..', 'docs', 'smartcontractor-demo-script.md');
const controlledTestPath = resolve('..', 'docs', 'smartcontractor-controlled-user-test-plan.md');
const betaSessionPath = resolve('..', 'docs', 'smartcontractor-beta-session-runbook.md');
const betaSessionSummaryPath = resolve('..', 'docs', 'smartcontractor-beta-session-summary-template.md');
const betaDecisionLogPath = resolve('..', 'docs', 'smartcontractor-beta-decision-log.md');
const knownIssuesPath = resolve('..', 'docs', 'smartcontractor-public-beta-known-issues.md');
const supportQueuePath = resolve('..', 'docs', 'smartcontractor-public-beta-support-queue.md');
const goNoGoPath = resolve('..', 'docs', 'smartcontractor-beta-go-no-go-scorecard.md');
const deploymentPath = resolve('..', 'docs', 'smartcontractor-deployment-decision-prep.md');
const founderAuthPath = resolve('..', 'docs', 'smartcontractor-founder-auth-admin-activation-prep.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const packageJsonPath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Public beta founder execution plan validation failed: ${message}`);
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

const plan = readRequired(planPath);
const reviewPacket = readRequired(reviewPacketPath);
const launchReadiness = readRequired(launchReadinessPath);
const launchDecision = readRequired(launchDecisionPath);
const handoff = readRequired(handoffPath);
const launchRunbook = readRequired(launchRunbookPath);
const demoScript = readRequired(demoScriptPath);
const controlledTest = readRequired(controlledTestPath);
const betaSession = readRequired(betaSessionPath);
const betaSessionSummary = readRequired(betaSessionSummaryPath);
const betaDecisionLog = readRequired(betaDecisionLogPath);
const knownIssues = readRequired(knownIssuesPath);
const supportQueue = readRequired(supportQueuePath);
const goNoGo = readRequired(goNoGoPath);
const deployment = readRequired(deploymentPath);
const founderAuth = readRequired(founderAuthPath);
const audit = readRequired(auditPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const packageJson = readRequired(packageJsonPath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Public Beta Founder Execution Plan',
  'Status: INTERNAL_PUBLIC_BETA_EXECUTION_PLAN_ONLY',
  'Purpose',
  'What This Does Not Approve',
  'Execution Order',
  'Founder Decision Gates',
  'Founder Evening Demo Decision Gate',
  'Demo-Safe Scope',
  'Blocked Live Actions',
  'Required Evidence',
  'Existing Documents To Use',
  'Go / Review / No-Go Rule',
  'Founder Evening Checklist',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(plan, section, planPath);

for (const required of [
  'EVENING_DEMO_DECISION_GATE',
  'founder-present demo-only beta decision',
  'Go/Review/Hold',
  'record evidence source, owner, rollback owner, and blocked next action',
  'demo-only public beta',
  'no-real-money',
  'Vercel',
  'GitHub Pages',
  'DNS',
  'Namecheap',
  'Magic Link',
  'Supabase Auth redirect',
  'live Supabase SQL',
  'RLS',
  'admin_memberships',
  'production deploy',
  'public launch',
  'real payments',
  'real loans',
  'real escrow',
  'real repayment routing',
  'stablecoin settlement',
  'token collateral',
  'legal/provider commitments',
  'No tester invites, public link sharing, production deploy changes, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, legal decisions, or provider commitments',
  '3-5 people',
  'support owner',
  'known-issue',
  'X-Request-Id',
  'database URLs',
  'API keys',
  'service-role keys',
  'Magic Link tokens',
  'payment data',
  'wallet data',
  'npm run check:public-beta-founder-execution-plan',
  'npm run check:public-beta-review-packet',
  'npm run check:public-beta-launch-readiness',
  'npm run check:public-beta-launch-decision-record',
  'npm run check:public-beta-handoff',
  'npm run check:public-launch-runbook',
  'npm run check:deployment-decision-prep',
  'npm run check:real-status-audit',
  'npm run check',
]) assertIncludes(plan, required, planPath);

for (const linkedDoc of [
  'docs/smartcontractor-public-beta-review-packet.md',
  'docs/smartcontractor-public-beta-launch-readiness.md',
  'docs/smartcontractor-public-beta-launch-decision-record.md',
  'docs/smartcontractor-public-beta-handoff-checklist.md',
  'docs/smartcontractor-public-launch-runbook.md',
  'docs/smartcontractor-demo-script.md',
  'docs/smartcontractor-controlled-user-test-plan.md',
  'docs/smartcontractor-beta-session-runbook.md',
  'docs/smartcontractor-beta-session-summary-template.md',
  'docs/smartcontractor-beta-decision-log.md',
  'docs/smartcontractor-public-beta-known-issues.md',
  'docs/smartcontractor-public-beta-support-queue.md',
  'docs/smartcontractor-beta-go-no-go-scorecard.md',
  'docs/smartcontractor-deployment-decision-prep.md',
  'docs/smartcontractor-founder-auth-admin-activation-prep.md',
]) assertIncludes(plan, linkedDoc, planPath);

for (const [content, snippet, file] of [
  [reviewPacket, 'SmartContractor Public Beta Review Packet', reviewPacketPath],
  [launchReadiness, 'SmartContractor Public Beta Launch Readiness', launchReadinessPath],
  [launchDecision, 'SmartContractor Public Beta Launch Decision Record', launchDecisionPath],
  [handoff, 'SmartContractor Public Beta Handoff Checklist', handoffPath],
  [launchRunbook, 'SmartContractor Public Launch Runbook', launchRunbookPath],
  [demoScript, 'SmartContractor MVP Demo Script', demoScriptPath],
  [controlledTest, 'SmartContractor Controlled User Test Plan', controlledTestPath],
  [betaSession, 'SmartContractor Beta Session Runbook', betaSessionPath],
  [betaSessionSummary, 'SmartContractor Beta Session Summary Template', betaSessionSummaryPath],
  [betaDecisionLog, 'SmartContractor Beta Decision Log', betaDecisionLogPath],
  [knownIssues, 'SmartContractor Public Beta Known Issues', knownIssuesPath],
  [supportQueue, 'SmartContractor Public Beta Support Queue', supportQueuePath],
  [goNoGo, 'SmartContractor Beta Go/No-Go Scorecard', goNoGoPath],
  [deployment, 'SmartContractor Deployment Decision Prep', deploymentPath],
  [founderAuth, 'SmartContractor Founder Auth/Admin Activation Prep', founderAuthPath],
]) assertIncludes(content, snippet, file);

assertIncludes(context, 'Public beta founder execution plan', contextPath);
assertIncludes(context, 'check:public-beta-founder-execution-plan', contextPath);
assertIncludes(backlog, 'Public beta founder execution plan', backlogPath);
assertIncludes(backlog, 'check:public-beta-founder-execution-plan', backlogPath);
assertIncludes(audit, 'Public beta founder execution plan', auditPath);
assertIncludes(packageJson, '"check:public-beta-founder-execution-plan"', packageJsonPath);
assertIncludes(runner, '"check:public-beta-founder-execution-plan"', runnerPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(plan)) {
  fail('Public beta founder execution plan must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_beta_founder_execution_plan: planPath,
  linked_public_beta_docs_checked: 15,
  live_risk_boundaries_checked: true,
}, null, 2));
