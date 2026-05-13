import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const registerPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-exact-sentence-register.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan exact sentence register validation failed: ${message}`);
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
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Exact Sentence Register',
  'Purpose',
  'Safe Sentence Candidates',
  'Required Review Before Use',
  'Blocked Sentence Patterns',
  'Sentence Change Rule',
  'Required Checks',
]) {
  assertIncludes(register, section, registerPath);
}

for (const required of [
  'internal exact-sentence register only',
  'not legal advice',
  'not approval to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch token collateral',
  'not approval to launch repayment routing',
  'public whitepaper remains unchanged',
  'contract-backed working-capital language',
  'CBL-SAFE-01',
  'CBL-SAFE-02',
  'CBL-SAFE-03',
  'contractor working-capital eligibility',
  'expected milestone receivables',
  'provider-reviewed underwriting',
  'repayment-first waterfall',
  'future compliance-reviewed roadmap concept',
  'SmartContractor Platform',
  'Trust Infrastructure',
  'Settlement & Tokenized Construction Network',
  'founder approval',
  'legal/provider review',
  'finance provider review',
  'technical review',
  'claim review matrix approval',
  'public excerpt guard approval',
  'public use gate approval',
  'contract collateral',
  'assignment of receivables',
  'lien',
  'security interest',
  'loans are guaranteed',
  'every contract qualifies',
  'real escrow is live',
  'token collateral is active',
  'stablecoin settlement is live',
  'AI approves loans or releases payments automatically',
  'GCSC is already operating as a lender, escrow agent, bank, broker, or licensed finance provider',
  'Any change to an approved sentence creates a new sentence ID',
  'Approved public excerpt',
  'Approved whitepaper v1.2 draft',
  'Blocked pending legal/provider review',
  'npm run check:whitepaper-v1-2-contract-backed-loan-exact-sentence-register',
  'npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate',
  'npm run check:whitepaper-v1-2-contract-backed-loan-approval-routing',
  'npm run check:whitepaper-v1-2-public-excerpt-guard',
  'npm run check:whitepaper-v1-2-claim-review',
  'npm run check',
]) {
  assertIncludes(register, required, registerPath);
}

assertIncludes(context, 'Whitepaper v1.2 contract-backed loan exact sentence register', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-exact-sentence-register', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan exact sentence register', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-exact-sentence-register', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan exact sentence register', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(register)) {
  fail('Contract-backed loan exact sentence register must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  contract_backed_loan_exact_sentence_register: registerPath,
  public_file_change_block_checked: true,
}, null, 2));
