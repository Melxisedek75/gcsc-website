import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const codingPath = resolve('..', 'docs', 'smartcontractor-smart-contract-coding-readiness-checklist.md');
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
];
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract coding readiness validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const coding = readRequired(codingPath);
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
  'SmartContractor Smart Contract Coding Readiness Checklist',
  'Purpose',
  'Required Inputs',
  'Allowed Local Coding Scope',
  'Not Ready For Coding',
  'Coding Start Record',
  'Required Checks',
]) assertIncludes(coding, section, codingPath);

for (const required of [
  'internal coding-readiness checklist only',
  'does not approve real escrow',
  'does not approve real loans',
  'does not approve token collateral',
  'does not approve production payments',
  'does not approve stablecoin settlement',
  'does not approve live XPR contract deployment',
  'local code scaffolding',
  'type definitions',
  'table/action name constants',
  'pure state-transition helpers',
  'validator-only fixtures',
  'serialization tests',
  'local replay harness placeholders',
  'no live XPR',
  'founder scope approval',
  'legal/provider review',
  'finance-provider review',
  'security review',
  'XPR account and permission approval',
  'private keys',
  'service-role keys',
  'seed phrases',
  'real loan approval',
  'real escrow release',
  'repayment routing',
  'token collateral liquidation',
  'stablecoin settlement',
  'AI final authority',
  'coding_start_id',
  'allowed_files',
  'blocked_files',
  'linked_design_docs',
  'fixture_set',
  'local_replay_status',
  'deployment_status',
  'BLOCKED_FOR_LIVE',
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
]) assertIncludes(coding, required, codingPath);

assertIncludes(context, 'Smart contract coding readiness', contextPath);
assertIncludes(context, 'check:smart-contract-coding-readiness', contextPath);
assertIncludes(backlog, 'Smart contract coding readiness', backlogPath);
assertIncludes(backlog, 'check:smart-contract-coding-readiness', backlogPath);
assertIncludes(realAudit, 'Smart contract coding readiness', realAuditPath);

const scriptName = 'check:smart-contract-coding-readiness';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(coding)) {
  fail('Smart contract coding readiness checklist must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_coding_readiness_checklist: codingPath,
  coding_readiness_checked: true,
}, null, 2));
