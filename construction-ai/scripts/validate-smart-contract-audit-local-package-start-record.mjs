import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const recordPath = resolve('..', 'docs', 'smartcontractor-smart-contract-audit-local-package-start-record.md');
const requiredDocPaths = [
  resolve('..', 'docs', 'smartcontractor-smart-contract-local-package-start-template.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-local-implementation-package-index.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-local-implementation-kickoff-record.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-local-implementation-plan.md'),
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
  console.error(`Smart contract audit local package start validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const record = readRequired(recordPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realAudit = readRequired(realAuditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciValidator = readRequired(ciValidatorPath);

for (const docPath of requiredDocPaths) readRequired(docPath);

for (const section of [
  'SmartContractor Smart Contract Audit Local Package Start Record',
  'Purpose',
  'Required Inputs',
  'IDs',
  'Ownership',
  'Scope',
  'Decision',
  'Blocked Trigger Review',
  'Required Checks',
]) assertIncludes(record, section, recordPath);

for (const required of [
  'internal local package start record only',
  'does not approve real escrow',
  'does not approve real loans',
  'does not approve token collateral',
  'does not approve production payments',
  'does not approve repayment routing',
  'does not approve stablecoin settlement',
  'does not approve live XPR contract deployment',
  'WP-AUDIT-LOCAL',
  'audit-event serialization',
  'request-id mapping',
  'deterministic no-real-money fixture',
  'not a release record',
  'not a deployment approval',
  'not a public claim',
  'not legal approval',
  'not finance-provider approval',
  'project escrow',
  'loan ledger',
  'token collateral',
  'peer review rewards',
  'authority controls',
  'package_start_record_id',
  'SC-AUDIT-LOCAL-START-001',
  'package_index_id',
  'SC-LOCAL-PACKAGE-INDEX-001',
  'kickoff_record_id',
  'SC-LOCAL-KICKOFF-001',
  'implementation_plan_id',
  'SC-LOCAL-IMPLEMENTATION-PLAN-001',
  'work_package_id',
  'module_owner',
  'reviewer',
  'allowed_files',
  'blocked_files_checked',
  'fixture_set',
  'dependency_status',
  'local_replay_status',
  'READY_LOCAL',
  'audit_event_map_status',
  'backend_to_chain_map_status',
  'package_start_decision',
  'START_LOCAL_ONLY',
  'decision_reason',
  'deployment_status',
  'BLOCKED_FOR_LIVE',
  'live_xpr_deployment_checked',
  'real_payment_checked',
  'real_loan_checked',
  'real_escrow_checked',
  'repayment_routing_checked',
  'token_collateral_liquidation_checked',
  'stablecoin_settlement_checked',
  'ai_final_authority_checked',
  'secrets_checked',
  'public_claims_checked',
  'no secrets allowed',
  'no public claims allowed',
  'npm run check:smart-contract-audit-local-package-start',
  'npm run check:smart-contract-local-package-start-template',
  'npm run check:smart-contract-local-implementation-package-index',
  'npm run check:smart-contract-local-implementation-kickoff',
  'npm run check:smart-contract-local-implementation-plan',
  'npm run check:smart-contract-code-ownership',
  'npm run check:smart-contract-local-replay',
  'npm run check:smart-contract-audit-event-map',
  'npm run check:backend-to-chain-map',
  'npm run check',
]) assertIncludes(record, required, recordPath);

assertIncludes(context, 'Smart contract audit local package start', contextPath);
assertIncludes(context, 'check:smart-contract-audit-local-package-start', contextPath);
assertIncludes(backlog, 'Smart contract audit local package start', backlogPath);
assertIncludes(backlog, 'check:smart-contract-audit-local-package-start', backlogPath);
assertIncludes(realAudit, 'Smart contract audit local package start', realAuditPath);

const scriptName = 'check:smart-contract-audit-local-package-start';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(record)) {
  fail('Smart contract audit local package start record must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_audit_local_package_start_record: recordPath,
  audit_local_package_start_checked: true,
}, null, 2));
