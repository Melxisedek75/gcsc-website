import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const handoffPath = resolve('..', 'docs', 'smartcontractor-smart-contract-scaffold-handoff-template.md');
const requiredDocPaths = [
  resolve('..', 'docs', 'smartcontractor-smart-contract-implementation-gate.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-authority-model.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-test-fixtures.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-action-register.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-state-machine.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-audit-event-map.md'),
  resolve('..', 'docs', 'smartcontractor-backend-to-chain-map.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-deployment-blockers.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-rollback-recovery-plan.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-local-replay-checklist.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-coding-readiness-checklist.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-code-ownership-plan.md'),
];
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract scaffold handoff validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const handoff = readRequired(handoffPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realAudit = readRequired(realAuditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciValidator = readRequired(ciValidatorPath);

for (const docPath of requiredDocPaths) {
  readRequired(docPath);
}

for (const section of [
  'SmartContractor Smart Contract Scaffold Handoff Template',
  'Purpose',
  'Handoff Metadata',
  'Required Design Links',
  'Allowed Scope',
  'Blocked Scope',
  'Review Decision',
  'Required Checks',
]) assertIncludes(handoff, section, handoffPath);

for (const required of [
  'internal scaffold handoff template only',
  'does not approve real escrow',
  'does not approve real loans',
  'does not approve token collateral',
  'does not approve production payments',
  'does not approve repayment routing',
  'does not approve stablecoin settlement',
  'does not approve live XPR contract deployment',
  'local code scaffolding',
  'project escrow',
  'loan ledger',
  'token collateral',
  'peer review rewards',
  'authority controls',
  'backend-to-chain map',
  'handoff_id',
  'module_owner',
  'reviewer',
  'allowed_files',
  'blocked_files',
  'linked_design_docs',
  'fixture_set',
  'local_replay_status',
  'deployment_status',
  'BLOCKED_FOR_LIVE',
  'GO_LOCAL_ONLY',
  'REVISE',
  'HOLD',
  'NO_GO',
  'no live XPR',
  'no real payment',
  'no real loan',
  'no real escrow',
  'no repayment routing',
  'no token collateral liquidation',
  'no stablecoin settlement',
  'no AI final authority',
  'private keys',
  'service-role keys',
  'provider credentials',
  'live XPR deploy',
  'public whitepaper',
  'npm run check:smart-contract-scaffold-handoff',
  'npm run check:smart-contract-code-ownership',
  'npm run check:smart-contract-coding-readiness',
  'npm run check:smart-contract-implementation-gate',
  'npm run check:smart-contract-authority-model',
  'npm run check:smart-contract-test-fixtures',
  'npm run check:smart-contract-action-register',
  'npm run check:smart-contract-state-machine',
  'npm run check:smart-contract-audit-event-map',
  'npm run check:backend-to-chain-map',
  'npm run check:smart-contract-deployment-blockers',
  'npm run check:smart-contract-rollback-recovery',
  'npm run check:smart-contract-local-replay',
  'npm run check',
]) assertIncludes(handoff, required, handoffPath);

assertIncludes(context, 'Smart contract scaffold handoff', contextPath);
assertIncludes(context, 'check:smart-contract-scaffold-handoff', contextPath);
assertIncludes(backlog, 'Smart contract scaffold handoff', backlogPath);
assertIncludes(backlog, 'check:smart-contract-scaffold-handoff', backlogPath);
assertIncludes(realAudit, 'Smart contract scaffold handoff', realAuditPath);

const scriptName = 'check:smart-contract-scaffold-handoff';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(handoff)) {
  fail('Smart contract scaffold handoff template must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_scaffold_handoff_template: handoffPath,
  scaffold_handoff_checked: true,
}, null, 2));
