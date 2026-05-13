import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const blockersPath = resolve('..', 'docs', 'smartcontractor-smart-contract-deployment-blockers.md');
const gatePath = resolve('..', 'docs', 'smartcontractor-smart-contract-implementation-gate.md');
const authorityPath = resolve('..', 'docs', 'smartcontractor-smart-contract-authority-model.md');
const fixturesPath = resolve('..', 'docs', 'smartcontractor-smart-contract-test-fixtures.md');
const auditMapPath = resolve('..', 'docs', 'smartcontractor-smart-contract-audit-event-map.md');
const backendMapPath = resolve('..', 'docs', 'smartcontractor-backend-to-chain-map.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Smart contract deployment blockers validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const blockers = readRequired(blockersPath);
const gate = readRequired(gatePath);
const authority = readRequired(authorityPath);
const fixtures = readRequired(fixturesPath);
const auditMap = readRequired(auditMapPath);
const backendMap = readRequired(backendMapPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realAudit = readRequired(realAuditPath);

for (const section of [
  'SmartContractor Smart Contract Deployment Blockers',
  'Purpose',
  'Blocker States',
  'Deployment Blockers',
  'Module Readiness Matrix',
  'Required Evidence Packet',
  'Required Links',
  'Not Allowed',
  'Required Checks',
]) assertIncludes(blockers, section, blockersPath);

for (const required of [
  'internal deployment-blocker register only',
  'does not approve real escrow',
  'does not approve real loans',
  'does not approve token collateral',
  'does not approve production payments',
  'does not approve live XPR contract deployment',
  'Default state for all money-touching smart contract work is `BLOCKED`',
  'Founder module scope approval',
  'Legal/provider escrow review',
  'Finance-provider lending review',
  'Token collateral legal/provider review',
  'Stablecoin settlement provider review',
  'Authority and multisig approval',
  'Security review',
  'XPR account approval',
  'Backend-to-chain mapping approval',
  'Audit event map approval',
  'No-real-money fixture tests',
  'Public wording approval',
  'Project escrow',
  'Loan ledger',
  'Token collateral',
  'Peer review rewards',
  'Authority controls',
  'Backend-to-chain map',
  'Required Evidence Packet',
  'founder scope approval',
  'legal/provider escrow review',
  'finance-provider lending review',
  'token collateral review',
  'stablecoin settlement review',
  'authority and multisig approval',
  'security review',
  'XPR account and permission approval',
  'backend-to-chain mapping approval',
  'audit event map approval',
  'no-real-money fixture test results',
  'rollback and emergency pause plan',
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
  'licensed lender, bank, escrow agent, payment provider, underwriter, broker, or legal advisor',
  'docs/smartcontractor-smart-contract-implementation-gate.md',
  'docs/smartcontractor-smart-contract-authority-model.md',
  'docs/smartcontractor-smart-contract-test-fixtures.md',
  'docs/smartcontractor-smart-contract-audit-event-map.md',
  'docs/smartcontractor-backend-to-chain-map.md',
  'npm run check:smart-contract-deployment-blockers',
  'npm run check:backend-to-chain-map',
  'npm run check:smart-contract-audit-event-map',
  'npm run check:smart-contract-authority-model',
  'npm run check:smart-contract-implementation-gate',
  'npm run check',
]) assertIncludes(blockers, required, blockersPath);

assertIncludes(gate, 'Deployment planning remains blocked until', gatePath);
assertIncludes(authority, 'Required Before Deployment', authorityPath);
assertIncludes(fixtures, 'No live XPR contract deployment', fixturesPath);
assertIncludes(auditMap, 'does not approve live XPR contract deployment', auditMapPath);
assertIncludes(backendMap, 'does not approve live XPR contract deployment', backendMapPath);
assertIncludes(context, 'Smart contract deployment blockers', contextPath);
assertIncludes(context, 'check:smart-contract-deployment-blockers', contextPath);
assertIncludes(backlog, 'Smart contract deployment blockers', backlogPath);
assertIncludes(backlog, 'check:smart-contract-deployment-blockers', backlogPath);
assertIncludes(realAudit, 'Smart contract deployment blockers', realAuditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(blockers)) {
  fail('Smart contract deployment blockers must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_deployment_blockers: blockersPath,
  blockers_checked: true,
}, null, 2));
