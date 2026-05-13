import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const reviewPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-founder-review.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan founder review validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const review = readRequired(reviewPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Founder Review',
  'Purpose',
  'Founder Decisions',
  'Recommended Public Wording',
  'Review-Required Wording',
  'Blocked Wording',
  'Placement In The Three-Part Whitepaper',
  'Required Checks Before Public Use',
]) {
  assertIncludes(review, section, reviewPath);
}

for (const required of [
  'internal founder-review worksheet only',
  'not legal advice',
  'not approval to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch token collateral',
  'not approval to launch repayment routing',
  'contract-backed working-capital eligibility',
  'receivables-based underwriting',
  'contract collateral',
  'signed project contract creates expected milestone receivables',
  'repayment-first payment waterfall',
  'future provider-reviewed flow',
  'After a project contract is signed',
  'milestone payments can follow a repayment-first waterfall',
  'loan',
  'working capital',
  'financing partner',
  'collateral',
  'lien',
  'assignment of receivables',
  'signed contracts are legal collateral today',
  'loans are guaranteed',
  'every contract qualifies',
  'real escrow is live',
  'AI approves loans or releases payments automatically',
  'SmartContractor Platform',
  'Trust Infrastructure',
  'Settlement & Tokenized Construction Network',
  'public whitepaper remains unchanged',
  'npm run check:whitepaper-v1-2-contract-backed-loan-founder-review',
  'npm run check:whitepaper-v1-2-contract-backed-loan-flow',
  'npm run check:whitepaper-v1-2-contract-backed-loan-addendum',
  'npm run check:whitepaper-v1-2-claim-review',
  'npm run check',
]) {
  assertIncludes(review, required, reviewPath);
}

assertIncludes(context, 'Whitepaper v1.2 contract-backed loan founder review', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-founder-review', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan founder review', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-founder-review', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan founder review', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(review)) {
  fail('Contract-backed loan founder review must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  contract_backed_loan_founder_review: reviewPath,
  public_file_change_block_checked: true,
}, null, 2));
