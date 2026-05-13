import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const workflowPath = resolve('..', '.github', 'workflows', 'smartcontractor-ci.yml');
const packagePath = resolve('package.json');
const checkRunnerPath = resolve('scripts', 'run-checks.mjs');

const workflow = readFileSync(workflowPath, 'utf8');
const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
const checkRunner = readFileSync(checkRunnerPath, 'utf8');

function fail(message) {
  console.error(`CI workflow validation failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function includes(snippet) {
  return workflow.toLowerCase().includes(snippet.toLowerCase());
}

const requiredWorkflowSnippets = [
  'name: SmartContractor CI',
  'on:',
  'push:',
  'pull_request:',
  'branches:',
  '- main',
  'runs-on: ubuntu-latest',
  'actions/checkout@v4',
  'actions/setup-node@v4',
  'node-version: 20',
  'cache: npm',
  'cache-dependency-path: construction-ai/package-lock.json',
  'working-directory: construction-ai',
  'npm ci',
  'npm run check',
];

for (const snippet of requiredWorkflowSnippets) {
  assert(includes(snippet), `Workflow must include: ${snippet}`);
}

const requiredCheckScripts = [
  'check:smartcontractor',
  'check:mobile',
  'check:pwa-qa',
  'check:mobile-install-readiness',
  'check:android-preflight',
  'check:android-wrapper',
  'check:android-toolchain-preflight',
  'check:founder-android-setup',
  'check:android-debug-build-evidence',
  'check:android-emulator-smoke-evidence',
  'check:android-device-smoke-checklist',
  'check:mobile-screenshot-redaction',
  'check:mobile-release-blockers',
  'check:mobile-release-go-no-go',
  'check:mobile-founder-qa-report',
  'check:mobile-local-qa-commands',
  'check:android-qa',
  'check:ios-preflight',
  'check:mobile-release-evidence',
  'check:demo-script',
  'check:controlled-user-test',
  'check:beta-issue-log',
  'check:beta-tester-invite',
  'check:beta-tester-followup',
  'check:beta-feedback-synthesis',
  'check:beta-readiness',
  'check:beta-session',
  'check:beta-session-summary',
  'check:beta-decision-log',
  'check:public-beta-review-packet',
  'check:beta-triage-rubric',
  'check:beta-issue-lifecycle',
  'check:beta-go-no-go-scorecard',
  'check:beta-evidence-checklist',
  'check:auth',
  'check:auth-rls-plan',
  'check:strict-gates',
  'check:strict-admin-smoke',
  'check:rls-draft',
  'check:payment-ownership',
  'check:contract-docs',
  'check:ai-agent-workflows',
  'check:legal-review',
  'check:whitepaper-sections',
  'check:whitepaper-v1-2-restructure',
  'check:whitepaper-v1-2-founder-review',
  'check:whitepaper-v1-2-edit-plan',
  'check:whitepaper-v1-2-source-map',
  'check:whitepaper-v1-2-publish-gate',
  'check:whitepaper-v1-2-approval-record',
  'check:whitepaper-v1-2-founder-decision-packet',
  'check:whitepaper-v1-2-public-excerpt-guard',
  'check:whitepaper-v1-2-terms-glossary',
  'check:whitepaper-v1-2-claim-review',
  'check:whitepaper-v1-2-public-edit-queue',
  'check:whitepaper-v1-2-founder-approval-brief',
  'check:whitepaper-v1-2-redline-preview',
  'check:whitepaper-v1-2-section-replacement-preview',
  'check:whitepaper-v1-2-founder-review-worksheet',
  'check:whitepaper-v1-2-founder-response-intake',
  'check:whitepaper-v1-2-review-change-log',
  'check:whitepaper-v1-2-publication-dry-run',
  'check:whitepaper-v1-2-publication-rollback-plan',
  'check:whitepaper-v1-2-publication-evidence-log',
  'check:whitepaper-v1-2-publication-go-no-go',
  'check:whitepaper-v1-2-publication-correction-notice',
  'check:whitepaper-v1-2-publication-version-history',
  'check:whitepaper-v1-2-publication-distribution-log',
  'check:whitepaper-v1-2-publication-follow-up-queue',
  'check:whitepaper-v1-2-publication-response-boundary',
  'check:whitepaper-v1-2-publication-response-approval-stamp',
  'check:whitepaper-v1-2-smart-contract-architecture',
  'check:whitepaper-v1-2-contract-backed-loan-addendum',
  'check:whitepaper-v1-2-contract-backed-loan-flow',
  'check:whitepaper-v1-2-contract-backed-loan-founder-review',
  'check:whitepaper-v1-2-contract-backed-loan-review-questions',
  'check:whitepaper-v1-2-contract-backed-loan-public-wording-options',
  'check:whitepaper-v1-2-contract-backed-loan-wording-selection-record',
  'check:whitepaper-v1-2-contract-backed-loan-approval-routing',
  'check:whitepaper-v1-2-contract-backed-loan-public-use-gate',
  'check:whitepaper-v1-2-contract-backed-loan-exact-sentence-register',
  'check:whitepaper-v1-2-contract-backed-loan-placement-map',
  'check:whitepaper-v1-2-contract-backed-loan-public-excerpt-review-packet',
  'check:whitepaper-v1-2-contract-backed-loan-founder-reading-order',
  'check:whitepaper-v1-2-contract-backed-loan-founder-response-template',
  'check:whitepaper-v1-2-contract-backed-loan-founder-response-triage-log',
  'check:whitepaper-v1-2-contract-backed-loan-founder-review-index',
  'check:whitepaper-v1-2-contract-backed-loan-founder-packet-status',
  'check:whitepaper-v1-2-contract-backed-loan-founder-review-closeout',
  'check:whitepaper-v1-2-contract-backed-loan-founder-decision-summary',
  'check:whitepaper-v1-2-contract-backed-loan-legal-provider-handoff',
  'check:whitepaper-v1-2-contract-backed-loan-finance-provider-handoff',
  'check:whitepaper-v1-2-contract-backed-loan-technical-handoff',
  'check:whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix',
  'check:whitepaper-v1-2-contract-backed-loan-implementation-blocker-register',
  'check:whitepaper-v1-2-contract-backed-loan-implementation-approval-index',
  'check:whitepaper-v1-2-contract-backed-loan-approval-evidence-template',
  'check:target-architecture',
  'check:nonstop-hook',
  'check:automation-health',
  'check:autonomous-status',
  'check:founder-boundaries',
  'check:founder-action-queue',
  'check:founder-admin-runbook',
  'check:founder-tonight',
  'check:founder-auth-troubleshooting',
  'check:founder-auth-evidence',
  'check:founder-one-pager',
  'check:microsoft-startups',
  'check:real-status-audit',
  'check:deploy-brief',
  'check:vercel-preflight',
  'check:vercel-env-matrix',
  'check:vercel-postdeploy',
  'check:public-beta-env-report',
  'check:public-beta-smoke-commands',
  'check:public-beta-rollback-drill',
  'check:public-beta-incident-response',
  'check:public-beta-support-queue',
  'check:public-beta-support-sla',
  'check:public-beta-known-issues',
  'check:public-beta-tester-quickstart',
  'check:public-beta-founder-dashboard',
  'check:public-beta-daily-status',
  'check:public-beta-weekly-closeout',
  'check:public-beta-metrics-snapshot',
  'check:public-beta-launch-readiness',
  'check:public-beta-tester-cohort',
  'check:public-beta-invite-batches',
  'check:public-beta-session-schedule',
  'check:public-beta-session-moderator',
  'check:public-beta-session-postmortem',
  'check:public-beta-issue-escalation',
  'check:public-beta-issue-closure',
  'check:public-beta-regression-checklist',
  'check:public-beta-qa-signoff',
  'check:public-beta-launch-decision-record',
  'check:public-beta-launch-day-checklist',
  'check:public-beta-launch-status-board',
  'check:public-beta-launch-day-recap',
  'check:public-beta-next-day-followup',
  'check:public-beta-day-two-checkpoint',
  'check:public-beta-day-three-review',
  'check:public-beta-day-four-stabilization',
  'check:public-beta-day-five-monitoring',
  'check:public-beta-day-six-decision',
  'check:public-beta-day-seven-readiness',
  'check:public-beta-week-one-decision',
  'check:public-beta-week-two-plan',
  'check:public-beta-week-two-kickoff',
  'check:public-beta-week-two-day-one-status',
  'check:public-beta-week-two-day-two-checkpoint',
  'check:public-beta-week-two-day-three-review',
  'check:public-beta-week-two-day-four-stabilization',
  'check:public-beta-week-two-day-five-monitoring',
  'check:public-beta-week-two-day-six-decision',
  'check:public-beta-week-two-day-seven-readiness',
  'check:public-beta-week-two-closeout',
  'check:public-beta-week-three-plan',
  'check:public-beta-week-three-kickoff',
  'check:public-beta-week-three-day-one-status',
  'check:public-beta-week-three-day-two-checkpoint',
  'check:public-beta-week-three-day-three-review',
  'check:public-beta-week-three-day-four-stabilization',
  'check:public-beta-week-three-day-five-monitoring',
  'check:public-beta-week-three-day-six-decision',
  'check:public-beta-week-three-day-seven-readiness',
  'check:public-beta-week-three-closeout',
  'check:public-beta-week-four-plan',
  'check:public-beta-week-four-kickoff',
  'check:public-beta-week-four-day-one-status',
  'check:public-beta-week-four-day-two-checkpoint',
  'check:public-beta-week-four-day-three-review',
  'check:public-beta-week-four-day-four-stabilization',
  'check:public-beta-week-four-day-five-monitoring',
  'check:public-beta-week-four-day-six-decision',
  'check:public-beta-week-four-day-seven-readiness',
  'check:public-beta-launch-message',
  'check:public-beta-tester-faq',
  'check:public-beta-consent-ack',
  'check:public-beta-privacy-notice',
  'check:public-beta-consent-withdrawal',
  'check:public-beta-reinvite-checklist',
  'check:public-beta-data-deletion',
  'check:public-beta-data-export',
  'check:public-beta-data-correction',
  'check:public-beta-use-restriction',
  'check:public-beta-terms-summary',
  'check:public-beta-offboarding',
  'check:public-beta-handoff',
  'check:public-launch-runbook',
  'check:ci-workflow',
  'check:env-example',
  'check:claude-code-prompt',
];

const checkCommand = packageJson.scripts?.check || '';
assert(checkCommand, 'package.json must define scripts.check');
assert(
  checkCommand === 'node scripts/run-checks.mjs',
  'scripts.check must use the Windows-safe Node check runner'
);

const requiredRunnerSnippets = [
  'spawnSync',
  'npm.cmd',
  'shell: false',
  'Missing check scripts from runner',
  'Duplicate check script entries',
  'Missing check script entries in package.json',
  'packageCheckScripts',
  'checks_run',
];

for (const snippet of requiredRunnerSnippets) {
  assert(checkRunner.includes(snippet), `run-checks.mjs must include: ${snippet}`);
}

for (const scriptName of requiredCheckScripts) {
  assert(packageJson.scripts?.[scriptName], `package.json must define ${scriptName}`);
  assert(checkRunner.includes(scriptName), `run-checks.mjs must run ${scriptName}`);
}

assert(
  !/SUPABASE_SERVICE_ROLE_KEY|STRIPE_SECRET_KEY|METAL_PAY_CONNECT_API_KEY|password|secret/i.test(workflow),
  'Workflow must not contain secret names or secret values'
);

console.log(JSON.stringify({
  status: 'passed',
  workflow: workflowPath,
  check_scripts_checked: requiredCheckScripts,
}, null, 2));
