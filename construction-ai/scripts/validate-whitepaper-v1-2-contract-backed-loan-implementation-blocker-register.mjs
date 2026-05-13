import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const registerPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-implementation-blocker-register.md');
const matrixPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix.md');
const publicUseGatePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-public-use-gate.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan implementation blocker register validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const register = readRequired(registerPath);
const matrix = readRequired(matrixPath);
const publicUseGate = readRequired(publicUseGatePath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Implementation Blocker Register',
  'Purpose',
  'Blocker Register',
  'Allowed While Blocked',
  'Not Allowed While Blocked',
  'Required Linked Files',
  'Required Checks',
]) assertIncludes(register, section, registerPath);

for (const required of [
  'internal blocker register only',
  'not legal advice',
  'not approval to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch stablecoin settlement',
  'not approval to launch token collateral',
  'not approval to launch repayment routing',
  'not approval to publish public wording',
  'Founder exact scope',
  'Legal/provider classification',
  'Finance-provider underwriting',
  'Payment and repayment provider',
  'Real escrow provider',
  'Stablecoin settlement provider',
  'Token collateral language',
  'Auth/RLS/admin ownership',
  'AI milestone review boundary',
  'Public whitepaper wording',
  'REVIEW',
  'BLOCKED',
  'Approved concept scope, exact terms, and allowed whitepaper placement',
  'Written review of receivables, lending, escrow, stablecoin, token collateral, AI, and public claims',
  'Disabled-by-default provider adapter',
  'AI remains evidence support only',
  'no payment-release authority',
  'public whitepaper claims that GCSC provides loans, escrow, payment services, token collateral, or regulated settlement',
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
  'docs/whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix.md',
  'docs/whitepaper-v1-2-contract-backed-loan-legal-provider-handoff.md',
  'docs/whitepaper-v1-2-contract-backed-loan-finance-provider-handoff.md',
  'docs/whitepaper-v1-2-contract-backed-loan-technical-handoff.md',
  'docs/whitepaper-v1-2-contract-backed-loan-public-use-gate.md',
  'npm run check:whitepaper-v1-2-contract-backed-loan-implementation-blocker-register',
  'npm run check:whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix',
  'npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate',
  'npm run check',
]) assertIncludes(register, required, registerPath);

assertIncludes(matrix, 'GCSC Whitepaper v1.2 Contract-Backed Loan Implementation Readiness Matrix', matrixPath);
assertIncludes(publicUseGate, 'GCSC Whitepaper v1.2 Contract-Backed Loan Public Use Gate', publicUseGatePath);
assertIncludes(context, 'Whitepaper v1.2 contract-backed loan implementation blocker register', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-implementation-blocker-register', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan implementation blocker register', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-implementation-blocker-register', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan implementation blocker register', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(register)) {
  fail('Contract-backed loan implementation blocker register must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  contract_backed_loan_implementation_blocker_register: registerPath,
  public_file_change_block_checked: true,
}, null, 2));
