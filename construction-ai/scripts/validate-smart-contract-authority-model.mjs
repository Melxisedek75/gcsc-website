import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const authorityPath = resolve('..', 'docs', 'smartcontractor-smart-contract-authority-model.md');
const designPath = resolve('..', 'docs', 'smartcontractor-smart-contract-design.md');
const gatePath = resolve('..', 'docs', 'smartcontractor-smart-contract-implementation-gate.md');
const riskModelPath = resolve('..', 'docs', 'smartcontractor-loan-legal-risk-model.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Smart contract authority model validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const authority = readRequired(authorityPath);
const design = readRequired(designPath);
const gate = readRequired(gatePath);
const riskModel = readRequired(riskModelPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'SmartContractor Smart Contract Authority Model',
  'Purpose',
  'Module Authority Matrix',
  'Required Roles',
  'Multisig And Pause Rules',
  'Not Allowed',
  'Required Before Coding',
  'Required Before Deployment',
  'Required Linked Files',
  'Required Checks',
]) assertIncludes(authority, section, authorityPath);

for (const required of [
  'internal design draft only',
  'does not approve real escrow',
  'does not approve real loans',
  'does not approve token collateral',
  'does not approve production payments',
  'does not approve live XPR contract deployment',
  'Project escrow contract',
  'Loan ledger contract',
  'Token collateral lock',
  'Peer review reward hook',
  'local fixture accounts only',
  'Founder approval',
  'legal/provider review',
  'escrow/payment provider review',
  'lending legal review',
  'finance-provider review',
  'token-collateral approval',
  'oracle review',
  'abuse controls',
  'approved multisig',
  'homeowner or project owner',
  'contractor',
  'inspector or peer reviewer',
  'platform admin',
  'founder multisig signer',
  'provider signer',
  'security signer',
  'Production deployment must require approved multisig',
  'Upgrade actions must be separated',
  'Pause actions must exist',
  'Unpause actions must require stronger approval',
  'Emergency pause',
  'Authority changes must be recorded',
  'Single-key production deployment',
  'Developer-only owner authority',
  'AI-only release',
  'Contractor self-release',
  'Auto-liquidation of real token collateral',
  'Real repayment routing',
  'licensed lender, bank, escrow agent, payment provider, underwriter, broker, or legal advisor',
  'Backend-to-chain mapping',
  'Audit event mapping',
  'Local no-real-money test fixture accounts',
  'Draft XPR account names',
  'Founder approval of module scope',
  'Legal/provider review checklist',
  'Security review checklist',
  'XPR account names are confirmed and created by the founder',
  'Multisig threshold is approved and documented',
  'Attorney/provider review is complete',
  'Security review is complete',
  'No-real-money local tests pass',
  'Production payment, escrow, finance, and stablecoin providers are selected and approved',
  'Public wording matches the actual approved implementation',
  'docs/smartcontractor-smart-contract-design.md',
  'docs/smartcontractor-smart-contract-implementation-gate.md',
  'docs/smartcontractor-loan-legal-risk-model.md',
  'docs/whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix.md',
  'docs/whitepaper-v1-2-contract-backed-loan-implementation-blocker-register.md',
  'docs/whitepaper-v1-2-contract-backed-loan-approval-evidence-template.md',
  'npm run check:smart-contract-authority-model',
  'npm run check:smart-contract-implementation-gate',
  'npm run check:contract-docs',
  'npm run check',
]) assertIncludes(authority, required, authorityPath);

assertIncludes(design, 'Project Escrow Contract', designPath);
assertIncludes(gate, 'authority model', gatePath);
assertIncludes(riskModel, 'SmartContractor Loan Legal Risk Model', riskModelPath);
assertIncludes(context, 'Smart contract authority model', contextPath);
assertIncludes(context, 'check:smart-contract-authority-model', contextPath);
assertIncludes(backlog, 'Smart contract authority model', backlogPath);
assertIncludes(backlog, 'check:smart-contract-authority-model', backlogPath);
assertIncludes(audit, 'Smart contract authority model', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(authority)) {
  fail('Smart contract authority model must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_authority_model: authorityPath,
  multisig_pause_boundaries_checked: true,
}, null, 2));
