import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const fixturePath = resolve('..', 'docs', 'smartcontractor-smart-contract-test-fixtures.md');
const designPath = resolve('..', 'docs', 'smartcontractor-smart-contract-design.md');
const gatePath = resolve('..', 'docs', 'smartcontractor-smart-contract-implementation-gate.md');
const authorityPath = resolve('..', 'docs', 'smartcontractor-smart-contract-authority-model.md');
const riskModelPath = resolve('..', 'docs', 'smartcontractor-loan-legal-risk-model.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Smart contract test fixtures validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const fixtures = readRequired(fixturePath);
const design = readRequired(designPath);
const gate = readRequired(gatePath);
const authority = readRequired(authorityPath);
const riskModel = readRequired(riskModelPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'SmartContractor Smart Contract Test Fixtures',
  'Purpose',
  'Fixture Accounts',
  'Fixture Objects',
  'Required Test Scenarios',
  'Required Links',
  'Not Allowed',
  'Required Before Fixture Execution',
  'Required Checks',
]) assertIncludes(fixtures, section, fixturePath);

for (const required of [
  'internal local test fixture plan only',
  'does not approve real escrow',
  'does not approve real loans',
  'does not approve token collateral',
  'does not approve production payments',
  'does not approve live XPR contract deployment',
  'local no-real-money fixture data',
  'action shape',
  'state transitions',
  'authority checks',
  'audit event mapping',
  'repayment waterfall logic',
  'dispute pause behavior',
  'collateral state labels',
  'peer review reward hooks',
  'demoowner111',
  'democontr111',
  'demoinspect1',
  'demoadmin111',
  'demoprovidr1',
  'demosecurty1',
  'demomulti111',
  'project fixture',
  'milestone fixture',
  'loan fixture',
  'collateral fixture',
  'peer review fixture',
  'audit fixture',
  'Project escrow happy path',
  'Dispute pause path',
  'Loan repayment waterfall path',
  'Collateral lock path',
  'Peer review reward path',
  'Authority failure path',
  'Emergency pause path',
  'no real payment moves',
  'no real loan or payment is approved',
  'liquidation remains blocked',
  'no real token reward is issued',
  'contractor self-release',
  'single-key deployment',
  'AI-only approval',
  'unauthorized unpause',
  'docs/smartcontractor-smart-contract-design.md',
  'docs/smartcontractor-smart-contract-implementation-gate.md',
  'docs/smartcontractor-smart-contract-authority-model.md',
  'docs/smartcontractor-loan-legal-risk-model.md',
  'docs/whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix.md',
  'docs/whitepaper-v1-2-contract-backed-loan-implementation-blocker-register.md',
  'Real XPR account deployment',
  'Real payment movement',
  'Real loan origination',
  'Real escrow holding or release',
  'Real token collateral locking',
  'Real repayment routing',
  'Real stablecoin settlement',
  'Auto-liquidation',
  'licensed lender, bank, escrow agent, payment provider, underwriter, broker, or legal advisor',
  'Backend-to-chain mapping',
  'Audit event mapping',
  'Authority model review',
  'No secret-looking values',
  'No production provider credentials',
  'No live Supabase migration',
  'No live XPR contract deployment',
  'npm run check:smart-contract-test-fixtures',
  'npm run check:smart-contract-authority-model',
  'npm run check:smart-contract-implementation-gate',
  'npm run check:contract-docs',
  'npm run check',
]) assertIncludes(fixtures, required, fixturePath);

assertIncludes(design, 'Project Escrow Contract', designPath);
assertIncludes(gate, 'local test fixture data with no real payments', gatePath);
assertIncludes(authority, 'Local no-real-money test fixture accounts', authorityPath);
assertIncludes(riskModel, 'SmartContractor Loan Legal Risk Model', riskModelPath);
assertIncludes(context, 'Smart contract test fixtures', contextPath);
assertIncludes(context, 'check:smart-contract-test-fixtures', contextPath);
assertIncludes(backlog, 'Smart contract test fixtures', backlogPath);
assertIncludes(backlog, 'check:smart-contract-test-fixtures', backlogPath);
assertIncludes(audit, 'Smart contract test fixtures', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(fixtures)) {
  fail('Smart contract test fixtures must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_test_fixtures: fixturePath,
  no_real_money_fixtures_checked: true,
}, null, 2));
