import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const indexPath = resolve('..', 'docs', 'smartcontractor-smart-contract-local-implementation-package-index.md');
const requiredDocPaths = [
  resolve('..', 'docs', 'smartcontractor-smart-contract-local-implementation-plan.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-local-implementation-kickoff-record.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-scaffold-release-gate.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-code-ownership-plan.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-local-replay-checklist.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-audit-event-map.md'),
  resolve('..', 'docs', 'smartcontractor-backend-to-chain-map.md'),
];
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local implementation package index validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const index = readRequired(indexPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realAudit = readRequired(realAuditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciValidator = readRequired(ciValidatorPath);

for (const docPath of requiredDocPaths) readRequired(docPath);

for (const section of [
  'SmartContractor Smart Contract Local Implementation Package Index',
  'Purpose',
  'Required Inputs',
  'Package Start Order',
  'Required Package Fields',
  'Blocked Package Starts',
  'Required Checks',
]) assertIncludes(index, section, indexPath);

for (const required of [
  'internal local implementation package index only',
  'does not approve real escrow',
  'does not approve real loans',
  'does not approve token collateral',
  'does not approve production payments',
  'does not approve repayment routing',
  'does not approve stablecoin settlement',
  'does not approve live XPR contract deployment',
  'not a release plan',
  'not a public claim',
  'project escrow',
  'loan ledger',
  'token collateral',
  'peer review rewards',
  'authority controls',
  'audit serialization',
  'WP-AUDIT-LOCAL',
  'WP-AUTHORITY-LOCAL',
  'WP-ESCROW-LOCAL',
  'WP-LOAN-LOCAL',
  'WP-COLLATERAL-LOCAL',
  'WP-REVIEW-LOCAL',
  'READY_LOCAL',
  'package_index_id',
  'kickoff_record_id',
  'work_package_id',
  'package_order',
  'dependency_status',
  'allowed_files',
  'blocked_files_checked',
  'fixture_set',
  'local_replay_status',
  'audit_event_map_status',
  'backend_to_chain_map_status',
  'deployment_status',
  'BLOCKED_FOR_LIVE',
  'package_start_decision',
  'START_LOCAL_ONLY',
  'REVISE',
  'HOLD',
  'NO_GO',
  'live XPR deployment',
  'real payment',
  'real loan',
  'real escrow',
  'repayment routing',
  'token collateral liquidation',
  'stablecoin settlement',
  'AI final authority',
  'service-role keys',
  'provider credentials',
  'raw customer data',
  'public whitepaper',
  'npm run check:smart-contract-local-implementation-package-index',
  'npm run check:smart-contract-local-implementation-kickoff',
  'npm run check:smart-contract-local-implementation-plan',
  'npm run check:smart-contract-code-ownership',
  'npm run check:smart-contract-local-replay',
  'npm run check:smart-contract-audit-event-map',
  'npm run check:backend-to-chain-map',
  'npm run check',
]) assertIncludes(index, required, indexPath);

assertIncludes(context, 'Smart contract local implementation package index', contextPath);
assertIncludes(context, 'check:smart-contract-local-implementation-package-index', contextPath);
assertIncludes(backlog, 'Smart contract local implementation package index', backlogPath);
assertIncludes(backlog, 'check:smart-contract-local-implementation-package-index', backlogPath);
assertIncludes(realAudit, 'Smart contract local implementation package index', realAuditPath);

const scriptName = 'check:smart-contract-local-implementation-package-index';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(index)) {
  fail('Smart contract local implementation package index must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_implementation_package_index: indexPath,
  local_implementation_package_index_checked: true,
}, null, 2));
