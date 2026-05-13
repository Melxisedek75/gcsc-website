import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const rollbackPath = resolve('..', 'docs', 'smartcontractor-smart-contract-rollback-recovery-plan.md');
const blockersPath = resolve('..', 'docs', 'smartcontractor-smart-contract-deployment-blockers.md');
const authorityPath = resolve('..', 'docs', 'smartcontractor-smart-contract-authority-model.md');
const stateMachinePath = resolve('..', 'docs', 'smartcontractor-smart-contract-state-machine.md');
const auditMapPath = resolve('..', 'docs', 'smartcontractor-smart-contract-audit-event-map.md');
const backendMapPath = resolve('..', 'docs', 'smartcontractor-backend-to-chain-map.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract rollback recovery validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const rollback = readRequired(rollbackPath);
const blockers = readRequired(blockersPath);
const authority = readRequired(authorityPath);
const stateMachine = readRequired(stateMachinePath);
const auditMap = readRequired(auditMapPath);
const backendMap = readRequired(backendMapPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realAudit = readRequired(realAuditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciValidator = readRequired(ciValidatorPath);

for (const section of [
  'SmartContractor Smart Contract Rollback Recovery Plan',
  'Purpose',
  'Recovery States',
  'Emergency Triggers',
  'Immediate Response',
  'Module Recovery Rules',
  'Required Evidence Packet',
  'Required Links',
  'Not Allowed',
  'Required Checks',
]) assertIncludes(rollback, section, rollbackPath);

for (const required of [
  'internal rollback and emergency recovery plan only',
  'does not approve real escrow',
  'does not approve real loans',
  'does not approve token collateral',
  'does not approve production payments',
  'does not approve stablecoin settlement',
  'does not approve live XPR contract deployment',
  'emergency pause',
  'pause-only response',
  'no money movement',
  'no real loan approval',
  'no real escrow release',
  'no repayment routing',
  'no token collateral liquidation',
  'no stablecoin settlement',
  'rollback record',
  'incident_id',
  'request_id',
  'module',
  'trigger',
  'paused_by',
  'paused_at',
  'previous_state',
  'recovery_state',
  'founder_approval_status',
  'provider_review_status',
  'legal_provider_status',
  'finance_provider_status',
  'security_review_status',
  'created_at',
  'Project escrow',
  'Loan ledger',
  'Token collateral',
  'Peer review rewards',
  'Authority controls',
  'Backend-to-chain map',
  'docs/smartcontractor-smart-contract-implementation-gate.md',
  'docs/smartcontractor-smart-contract-authority-model.md',
  'docs/smartcontractor-smart-contract-test-fixtures.md',
  'docs/smartcontractor-smart-contract-action-register.md',
  'docs/smartcontractor-smart-contract-state-machine.md',
  'docs/smartcontractor-smart-contract-audit-event-map.md',
  'docs/smartcontractor-backend-to-chain-map.md',
  'docs/smartcontractor-smart-contract-deployment-blockers.md',
  'docs/smartcontractor-loan-legal-risk-model.md',
  'private keys',
  'service-role keys',
  'seed phrases',
  'deploy live contracts',
  'move real funds',
  'approve real loans',
  'release real escrow',
  'route real repayments',
  'lock real token collateral',
  'settle stablecoins',
  'issue real rewards',
  'auto-liquidate collateral',
  'AI make final approval',
  'founder approval',
  'legal/provider review',
  'finance-provider review',
  'security review',
  'authority and multisig approval',
  'npm run check:smart-contract-rollback-recovery',
  'npm run check:smart-contract-deployment-blockers',
  'npm run check:backend-to-chain-map',
  'npm run check:smart-contract-audit-event-map',
  'npm run check:smart-contract-authority-model',
  'npm run check:smart-contract-state-machine',
  'npm run check:smart-contract-implementation-gate',
  'npm run check',
]) assertIncludes(rollback, required, rollbackPath);

assertIncludes(blockers, 'rollback and emergency pause plan', blockersPath);
assertIncludes(authority, 'Emergency pause', authorityPath);
assertIncludes(stateMachine, 'emergency pause', stateMachinePath);
assertIncludes(auditMap, 'authority.emergency_pause.recorded', auditMapPath);
assertIncludes(backendMap, 'emergpause', backendMapPath);
assertIncludes(context, 'Smart contract rollback recovery', contextPath);
assertIncludes(context, 'check:smart-contract-rollback-recovery', contextPath);
assertIncludes(backlog, 'Smart contract rollback recovery', backlogPath);
assertIncludes(backlog, 'check:smart-contract-rollback-recovery', backlogPath);
assertIncludes(realAudit, 'Smart contract rollback recovery', realAuditPath);

const scriptName = 'check:smart-contract-rollback-recovery';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(rollback)) {
  fail('Smart contract rollback recovery plan must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_rollback_recovery_plan: rollbackPath,
  rollback_recovery_checked: true,
}, null, 2));
