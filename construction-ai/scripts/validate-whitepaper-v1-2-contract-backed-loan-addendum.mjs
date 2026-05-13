import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const addendumPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-addendum.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan addendum validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const addendum = readRequired(addendumPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Addendum',
  'Purpose',
  'Whitepaper Placement',
  'Safe Whitepaper Language',
  'Product Flow',
  'Smart Contract Implication',
  'Legal And Provider Boundary',
  'Required Checks Before Public Use',
]) {
  assertIncludes(addendum, section, addendumPath);
}

for (const required of [
  'internal founder-review addendum only',
  'not legal advice',
  'not approval to launch real loans',
  'not approval to treat signed project contracts as legal collateral today',
  'contract-backed working-capital eligibility',
  'receivables-based underwriting',
  'milestone receivables',
  'escrow-ready repayment routing',
  'risk-scored contractor credit',
  'payment waterfall',
  'repayment-first milestone routing',
  'homeowner deposit reduction',
  'signed contracts are legal collateral today',
  'contractor credit is guaranteed',
  'milestone repayment is legally enforceable without lender/provider/legal approval',
  'real loans are live',
  'real escrow is live',
  'stablecoin settlement is live',
  'token collateral is live',
  'AI-assisted verification',
  'repayment priority',
  'dispute pause',
  'attorney review',
  'lender/provider review',
  'escrow/payment provider review',
  'founder approval',
  'No autonomous process may activate real loans',
  'npm run check:whitepaper-v1-2-contract-backed-loan-addendum',
  'npm run check:whitepaper-v1-2-smart-contract-architecture',
  'npm run check:whitepaper-v1-2-claim-review',
  'npm run check:whitepaper-v1-2-terms-glossary',
  'npm run check:whitepaper-v1-2-public-edit-queue',
  'npm run check',
]) {
  assertIncludes(addendum, required, addendumPath);
}

assertIncludes(context, 'Whitepaper v1.2 contract-backed loan addendum', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-addendum', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan addendum', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-addendum', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan addendum', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(addendum)) {
  fail('Contract-backed loan addendum must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  contract_backed_loan_addendum: addendumPath,
  public_file_change_block_checked: true,
}, null, 2));
