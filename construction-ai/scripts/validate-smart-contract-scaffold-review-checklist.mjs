import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const reviewPath = resolve('..', 'docs', 'smartcontractor-smart-contract-scaffold-review-checklist.md');
const requiredDocPaths = [
  resolve('..', 'docs', 'smartcontractor-smart-contract-code-ownership-plan.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-scaffold-handoff-template.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-scaffold-file-manifest.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-coding-readiness-checklist.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-local-replay-checklist.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-audit-event-map.md'),
];
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract scaffold review validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const review = readRequired(reviewPath);
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
  'SmartContractor Smart Contract Scaffold Review Checklist',
  'Purpose',
  'Required Inputs',
  'Review Checklist',
  'Decision States',
  'Blocked Merge Triggers',
  'Required Checks',
]) assertIncludes(review, section, reviewPath);

for (const required of [
  'internal scaffold review checklist only',
  'does not approve real escrow',
  'does not approve real loans',
  'does not approve token collateral',
  'does not approve production payments',
  'does not approve repayment routing',
  'does not approve stablecoin settlement',
  'does not approve live XPR contract deployment',
  'local constants',
  'type definitions',
  'pure state-transition helpers',
  'validator-only fixtures',
  'serialization tests',
  'local replay harness placeholders',
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
  'raw customer data',
  'public whitepaper',
  'npm run check:smart-contract-scaffold-review',
  'npm run check:smart-contract-scaffold-file-manifest',
  'npm run check:smart-contract-scaffold-handoff',
  'npm run check:smart-contract-code-ownership',
  'npm run check:smart-contract-coding-readiness',
  'npm run check:smart-contract-local-replay',
  'npm run check:smart-contract-audit-event-map',
  'npm run check',
]) assertIncludes(review, required, reviewPath);

assertIncludes(context, 'Smart contract scaffold review', contextPath);
assertIncludes(context, 'check:smart-contract-scaffold-review', contextPath);
assertIncludes(backlog, 'Smart contract scaffold review', backlogPath);
assertIncludes(backlog, 'check:smart-contract-scaffold-review', backlogPath);
assertIncludes(realAudit, 'Smart contract scaffold review', realAuditPath);

const scriptName = 'check:smart-contract-scaffold-review';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(review)) {
  fail('Smart contract scaffold review checklist must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_scaffold_review_checklist: reviewPath,
  scaffold_review_checked: true,
}, null, 2));
