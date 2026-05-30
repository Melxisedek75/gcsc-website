import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const replayPath = resolve('..', 'docs', 'smartcontractor-smart-contract-local-replay-checklist.md');
const fixturesPath = resolve('..', 'docs', 'smartcontractor-smart-contract-test-fixtures.md');
const stateMachinePath = resolve('..', 'docs', 'smartcontractor-smart-contract-state-machine.md');
const actionRegisterPath = resolve('..', 'docs', 'smartcontractor-smart-contract-action-register.md');
const auditMapPath = resolve('..', 'docs', 'smartcontractor-smart-contract-audit-event-map.md');
const backendMapPath = resolve('..', 'docs', 'smartcontractor-backend-to-chain-map.md');
const rollbackPath = resolve('..', 'docs', 'smartcontractor-smart-contract-rollback-recovery-plan.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const replay = readRequired(replayPath);
const fixtures = readRequired(fixturesPath);
const stateMachine = readRequired(stateMachinePath);
const actionRegister = readRequired(actionRegisterPath);
const auditMap = readRequired(auditMapPath);
const backendMap = readRequired(backendMapPath);
const rollback = readRequired(rollbackPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realAudit = readRequired(realAuditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciValidator = readRequired(ciValidatorPath);

for (const section of [
  'SmartContractor Smart Contract Local Replay Checklist',
  'Purpose',
  'Replay Scope',
  'Required Fixtures',
  'Replay Steps',
  'Pass/Fail Gates',
  'Evidence Fields',
  'Not Allowed',
  'Required Links',
  'Required Checks',
]) assertIncludes(replay, section, replayPath);

for (const required of [
  'internal local replay checklist only',
  'does not approve real escrow',
  'does not approve real loans',
  'does not approve token collateral',
  'does not approve production payments',
  'does not approve stablecoin settlement',
  'does not approve live XPR contract deployment',
  'no-real-money replay steps',
  'Project escrow',
  'Loan ledger',
  'Token collateral',
  'Peer review rewards',
  'Authority controls',
  'Backend-to-chain map',
  'gcscworkcap1',
  'gcscclaim111',
  'gcsccredit11',
  'gcscadvance1',
  'reqworkcap',
  'reqclaimadv',
  'reqtokcredit',
  'reqescadv',
  'workcapreqs',
  'claimadvs',
  'creditreqs',
  'escadvs',
  'workcap.request.recorded',
  'claim.advance.request.recorded',
  'credit.token_collateral.request.recorded',
  'advance.escrow.request.recorded',
  'fixture `gcscworkcap1` review row',
  'fixture `gcscclaim111` review row',
  'fixture `gcsccredit11` review row',
  'fixture `gcscadvance1` review row',
  'loan issuance, payment-right assignment, repayment routing, token transfer, lien automation, or UCC filing automation',
  'assignment of benefits, insurer integration, claim financing, repayment from insurance proceeds, or token transfer',
  'token custody, collateral lock, live loan issuance, liquidation, collateral seizure, or token transfer',
  'escrow custody, milestone release, payout instruction, live advance issuance, repayment routing, or token transfer',
  'Replay the four fresh contract product surfaces',
  'fixture project contract',
  'fixture milestone',
  'fixture loan ledger entry',
  'fixture repayment waterfall',
  'fixture token collateral lock',
  'fixture peer review reward',
  'fixture authority action',
  'fixture emergency pause',
  'fixture rollback record',
  'fixture audit event with `request_id`',
  'fixture backend-to-chain map row',
  'repayment-first waterfall',
  'emergency pause',
  'rollback record',
  'BLOCKED_FOR_LIVE',
  'replay_id',
  'request_id',
  'fixture_set',
  'module',
  'scenario',
  'expected_state',
  'observed_state',
  'audit_event',
  'backend_action',
  'draft_xpr_action',
  'table_name',
  'pass_fail_status',
  'rollback_record_id',
  'founder_approval_status',
  'legal_provider_status',
  'finance_provider_status',
  'security_review_status',
  'created_at',
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
  'docs/smartcontractor-smart-contract-test-fixtures.md',
  'docs/smartcontractor-smart-contract-state-machine.md',
  'docs/smartcontractor-smart-contract-action-register.md',
  'docs/smartcontractor-smart-contract-audit-event-map.md',
  'docs/smartcontractor-backend-to-chain-map.md',
  'docs/smartcontractor-smart-contract-deployment-blockers.md',
  'docs/smartcontractor-smart-contract-rollback-recovery-plan.md',
  'docs/smartcontractor-smart-contract-authority-model.md',
  'docs/smartcontractor-smart-contract-implementation-gate.md',
  'npm run check:smart-contract-local-replay',
  'npm run check:smart-contract-test-fixtures',
  'npm run check:smart-contract-state-machine',
  'npm run check:smart-contract-action-register',
  'npm run check:smart-contract-audit-event-map',
  'npm run check:backend-to-chain-map',
  'npm run check:smart-contract-rollback-recovery',
  'npm run check:smart-contract-deployment-blockers',
  'npm run check',
]) assertIncludes(replay, required, replayPath);

assertIncludes(fixtures, 'repayment waterfall', fixturesPath);
assertIncludes(stateMachine, 'terminal state', stateMachinePath);
assertIncludes(actionRegister, 'Draft Table', actionRegisterPath);
assertIncludes(auditMap, 'request_id', auditMapPath);
assertIncludes(backendMap, 'Draft Chain Action', backendMapPath);
assertIncludes(rollback, 'rollback record', rollbackPath);
assertIncludes(context, 'Smart contract local replay', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay', contextPath);
assertIncludes(backlog, 'Smart contract local replay', backlogPath);
assertIncludes(backlog, 'check:smart-contract-local-replay', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay', realAuditPath);

const scriptName = 'check:smart-contract-local-replay';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(replay)) {
  fail('Smart contract local replay checklist must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_checklist: replayPath,
  local_replay_checked: true,
}, null, 2));
