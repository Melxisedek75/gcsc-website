import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const matrixPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix.md');
const legalHandoffPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-legal-provider-handoff.md');
const financeHandoffPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-finance-provider-handoff.md');
const technicalHandoffPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-technical-handoff.md');
const publicUseGatePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-public-use-gate.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan implementation readiness matrix validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const matrix = readRequired(matrixPath);
const legalHandoff = readRequired(legalHandoffPath);
const financeHandoff = readRequired(financeHandoffPath);
const technicalHandoff = readRequired(technicalHandoffPath);
const publicUseGate = readRequired(publicUseGatePath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Implementation Readiness Matrix',
  'Purpose',
  'Readiness Matrix',
  'Allowed Next Actions',
  'Blocked Actions',
  'Required Linked Review Files',
  'Required Checks',
]) assertIncludes(matrix, section, matrixPath);

for (const required of [
  'internal implementation readiness matrix only',
  'not legal advice',
  'not approval to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch stablecoin settlement',
  'not approval to launch token collateral',
  'not approval to launch repayment routing',
  'not approval to publish public wording',
  'legal/provider handoff',
  'finance-provider handoff',
  'technical handoff',
  'public-use gate',
  'Founder concept decision',
  'Legal/provider classification',
  'Finance-provider underwriting',
  'Technical data model and API',
  'Auth, RLS, and admin ownership',
  'Payment provider and repayment routing',
  'Real escrow',
  'Stablecoin settlement',
  'Token collateral',
  'AI milestone verification',
  'Public wording',
  'REVIEW',
  'BLOCKED',
  'SUPPORT ONLY',
  'signed project contract supporting working-capital eligibility',
  'repayment-first waterfall is only a draft concept',
  'AI can support evidence review and recommendations only',
  'no AI final approval or payment release',
  'public wording and live implementation blocked',
  'no-real-money data model and API planning notes',
  'audit events, milestone states, dispute pause, and provider adapter states',
  'public whitepaper wording for contract-backed loans',
  'live loan origination',
  'real escrow',
  'stablecoin settlement',
  'token collateral',
  'repayment routing',
  'provider API calls',
  'borrower underwriting decisions',
  'AI final approval',
  'AI payment release',
  'production money movement',
  'GCSC is a lender, bank, broker, escrow agent, payment provider, underwriter, legal advisor, or investment issuer',
  'docs/whitepaper-v1-2-contract-backed-loan-legal-provider-handoff.md',
  'docs/whitepaper-v1-2-contract-backed-loan-finance-provider-handoff.md',
  'docs/whitepaper-v1-2-contract-backed-loan-technical-handoff.md',
  'docs/whitepaper-v1-2-contract-backed-loan-public-use-gate.md',
  'npm run check:whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix',
  'npm run check:whitepaper-v1-2-contract-backed-loan-technical-handoff',
  'npm run check:whitepaper-v1-2-contract-backed-loan-finance-provider-handoff',
  'npm run check:whitepaper-v1-2-contract-backed-loan-legal-provider-handoff',
  'npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate',
  'npm run check',
]) assertIncludes(matrix, required, matrixPath);

assertIncludes(legalHandoff, 'GCSC Whitepaper v1.2 Contract-Backed Loan Legal/Provider Handoff', legalHandoffPath);
assertIncludes(financeHandoff, 'GCSC Whitepaper v1.2 Contract-Backed Loan Finance-Provider Handoff', financeHandoffPath);
assertIncludes(technicalHandoff, 'GCSC Whitepaper v1.2 Contract-Backed Loan Technical Handoff', technicalHandoffPath);
assertIncludes(publicUseGate, 'GCSC Whitepaper v1.2 Contract-Backed Loan Public Use Gate', publicUseGatePath);

assertIncludes(context, 'Whitepaper v1.2 contract-backed loan implementation readiness matrix', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan implementation readiness matrix', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan implementation readiness matrix', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(matrix)) {
  fail('Contract-backed loan implementation readiness matrix must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  contract_backed_loan_implementation_readiness_matrix: matrixPath,
  public_file_change_block_checked: true,
}, null, 2));
