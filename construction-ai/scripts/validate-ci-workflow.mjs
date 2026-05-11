import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const workflowPath = resolve('..', '.github', 'workflows', 'smartcontractor-ci.yml');
const packagePath = resolve('package.json');

const workflow = readFileSync(workflowPath, 'utf8');
const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));

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
  'check:android-preflight',
  'check:android-qa',
  'check:ios-preflight',
  'check:mobile-release-evidence',
  'check:demo-script',
  'check:auth',
  'check:strict-gates',
  'check:rls-draft',
  'check:payment-ownership',
  'check:contract-docs',
  'check:ai-agent-workflows',
  'check:legal-review',
  'check:nonstop-hook',
  'check:automation-health',
  'check:autonomous-status',
  'check:founder-boundaries',
  'check:founder-admin-runbook',
  'check:deploy-brief',
  'check:ci-workflow',
  'check:env-example',
  'check:claude-code-prompt',
];

const checkCommand = packageJson.scripts?.check || '';
assert(checkCommand, 'package.json must define scripts.check');

for (const scriptName of requiredCheckScripts) {
  assert(packageJson.scripts?.[scriptName], `package.json must define ${scriptName}`);
  assert(checkCommand.includes(`npm run ${scriptName}`), `scripts.check must run ${scriptName}`);
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
