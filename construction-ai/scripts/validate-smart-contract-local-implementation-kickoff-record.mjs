import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const kickoffPath = resolve('..', 'docs', 'smartcontractor-smart-contract-local-implementation-kickoff-record.md');
const requiredDocPaths = [
  resolve('..', 'docs', 'smartcontractor-smart-contract-local-implementation-plan.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-scaffold-release-gate.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-scaffold-merge-record.md'),
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
  console.error(`Smart contract local implementation kickoff validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const kickoff = readRequired(kickoffPath);
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
  'SmartContractor Smart Contract Local Implementation Kickoff Record',
  'Purpose',
  'Required Inputs',
  'Work Package IDs',
  'Required Kickoff Fields',
  'Kickoff Decision States',
  'Blocked Kickoff Triggers',
  'Required Checks',
]) assertIncludes(kickoff, section, kickoffPath);

for (const required of [
  'internal local implementation kickoff record only',
  'does not approve real escrow',
  'does not approve real loans',
  'does not approve token collateral',
  'does not approve production payments',
  'does not approve repayment routing',
  'does not approve stablecoin settlement',
  'does not approve live XPR contract deployment',
  'not deployment approval',
  'not production release',
  'not legal approval',
  'not finance-provider approval',
  'local files',
  'deterministic fixtures',
  'local replay evidence',
  'validator checks',
  'project escrow',
  'loan ledger',
  'token collateral',
  'peer review rewards',
  'authority controls',
  'backend-to-chain map',
  'WP-ESCROW-LOCAL',
  'WP-LOAN-LOCAL',
  'WP-COLLATERAL-LOCAL',
  'WP-REVIEW-LOCAL',
  'WP-AUTHORITY-LOCAL',
  'WP-AUDIT-LOCAL',
  'kickoff_record_id',
  'implementation_plan_id',
  'release_gate_id',
  'merge_record_id',
  'work_package_id',
  'module_owner',
  'reviewer',
  'allowed_files',
  'blocked_files_checked',
  'fixture_set',
  'local_replay_status',
  'audit_event_map_status',
  'backend_to_chain_map_status',
  'deployment_status',
  'BLOCKED_FOR_LIVE',
  'kickoff_decision',
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
  'production webhook payloads',
  'public whitepaper',
  'npm run check:smart-contract-local-implementation-kickoff',
  'npm run check:smart-contract-local-implementation-plan',
  'npm run check:smart-contract-scaffold-release-gate',
  'npm run check:smart-contract-scaffold-merge-record',
  'npm run check:smart-contract-code-ownership',
  'npm run check:smart-contract-local-replay',
  'npm run check:smart-contract-audit-event-map',
  'npm run check:backend-to-chain-map',
  'npm run check',
]) assertIncludes(kickoff, required, kickoffPath);

assertIncludes(context, 'Smart contract local implementation kickoff', contextPath);
assertIncludes(context, 'check:smart-contract-local-implementation-kickoff', contextPath);
assertIncludes(backlog, 'Smart contract local implementation kickoff', backlogPath);
assertIncludes(backlog, 'check:smart-contract-local-implementation-kickoff', backlogPath);
assertIncludes(realAudit, 'Smart contract local implementation kickoff', realAuditPath);

const scriptName = 'check:smart-contract-local-implementation-kickoff';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(kickoff)) {
  fail('Smart contract local implementation kickoff record must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_implementation_kickoff_record: kickoffPath,
  local_implementation_kickoff_checked: true,
}, null, 2));
