import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const gatePath = resolve('..', 'docs', 'smartcontractor-smart-contract-implementation-gate.md');
const designPath = resolve('..', 'docs', 'smartcontractor-smart-contract-design.md');
const riskModelPath = resolve('..', 'docs', 'smartcontractor-loan-legal-risk-model.md');
const readinessMatrixPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix.md');
const blockerRegisterPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-implementation-blocker-register.md');
const evidenceTemplatePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-approval-evidence-template.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Smart contract implementation gate validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const gate = readRequired(gatePath);
const design = readRequired(designPath);
const riskModel = readRequired(riskModelPath);
const readinessMatrix = readRequired(readinessMatrixPath);
const blockerRegister = readRequired(blockerRegisterPath);
const evidenceTemplate = readRequired(evidenceTemplatePath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'SmartContractor Smart Contract Implementation Gate',
  'Purpose',
  'Module Gate',
  'Required Before Coding',
  'Required Before Deployment',
  'Not Allowed',
  'Required Linked Files',
  'Required Checks',
]) assertIncludes(gate, section, gatePath);

for (const required of [
  'internal implementation gate only',
  'Not deployed',
  'Not legal advice',
  'does not approve real escrow',
  'does not approve real loans',
  'does not approve token collateral',
  'does not approve production payments',
  'does not approve live XPR contract deployment',
  'Project escrow contract',
  'Loan ledger contract',
  'Token collateral lock',
  'Peer review reward hook',
  'REVIEW',
  'local-only test fixture planning',
  'Escrow/payment provider review',
  'Lending legal review',
  'finance-provider review',
  'Legal/provider review',
  'token-collateral approval',
  'Abuse controls',
  'final draft account names or local placeholder names',
  'action names and table names',
  'backend-to-chain mapping',
  'audit event mapping',
  'authority model',
  'local test fixture data with no real payments',
  'explicit blocked live actions',
  'legal/provider review checklist',
  'founder approves the exact module scope',
  'attorney/provider review is complete',
  'security review is complete',
  'no-real-money local tests pass',
  'XPR account names are confirmed and created by the founder',
  'authority and multisig model is approved',
  'production payment, escrow, and finance providers are selected and approved',
  'public wording matches the actual approved implementation',
  'deploy live contracts',
  'move real money',
  'originate real loans',
  'hold real escrow',
  'lock real token collateral',
  'route real repayments',
  'replace licensed payment or escrow providers',
  'auto-liquidate tokens',
  'AI approve loans, release payments, or make final legal decisions',
  'licensed lender, bank, escrow agent, payment provider, underwriter, broker, or legal advisor',
  'docs/smartcontractor-smart-contract-design.md',
  'docs/smartcontractor-loan-legal-risk-model.md',
  'docs/whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix.md',
  'docs/whitepaper-v1-2-contract-backed-loan-implementation-blocker-register.md',
  'docs/whitepaper-v1-2-contract-backed-loan-approval-evidence-template.md',
  'npm run check:smart-contract-implementation-gate',
  'npm run check:contract-docs',
  'npm run check:whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix',
  'npm run check:whitepaper-v1-2-contract-backed-loan-implementation-blocker-register',
  'npm run check',
]) assertIncludes(gate, required, gatePath);

assertIncludes(design, 'SmartContractor Smart Contract Design Draft', designPath);
assertIncludes(design, 'Project Escrow Contract', designPath);
assertIncludes(design, 'Contractor Loan Ledger Contract', designPath);
assertIncludes(design, 'Token Collateral Lock Contract', designPath);
assertIncludes(design, 'Peer Review Reward Hook', designPath);
assertIncludes(riskModel, 'SmartContractor Loan Legal Risk Model', riskModelPath);
assertIncludes(readinessMatrix, 'GCSC Whitepaper v1.2 Contract-Backed Loan Implementation Readiness Matrix', readinessMatrixPath);
assertIncludes(blockerRegister, 'GCSC Whitepaper v1.2 Contract-Backed Loan Implementation Blocker Register', blockerRegisterPath);
assertIncludes(evidenceTemplate, 'GCSC Whitepaper v1.2 Contract-Backed Loan Approval Evidence Template', evidenceTemplatePath);
assertIncludes(context, 'Smart contract implementation gate', contextPath);
assertIncludes(context, 'check:smart-contract-implementation-gate', contextPath);
assertIncludes(backlog, 'Smart contract implementation gate', backlogPath);
assertIncludes(backlog, 'check:smart-contract-implementation-gate', backlogPath);
assertIncludes(audit, 'Smart contract implementation gate', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(gate)) {
  fail('Smart contract implementation gate must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_implementation_gate: gatePath,
  live_deployment_block_checked: true,
}, null, 2));
