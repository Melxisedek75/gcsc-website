import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const optionsPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-public-wording-options.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan public wording options validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const options = readRequired(optionsPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Public Wording Options',
  'Purpose',
  'Safest Option',
  'Moderate Option',
  'Provider-Review Option',
  'Do Not Publish Yet',
  'Founder Selection Rule',
  'Required Checks Before Public Use',
]) {
  assertIncludes(options, section, optionsPath);
}

for (const required of [
  'internal wording options only',
  'not legal advice',
  'not approval to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch token collateral',
  'not approval to launch repayment routing',
  'public whitepaper remains unchanged',
  'contract-backed working-capital eligibility',
  'receivables-based underwriting',
  'repayment-first waterfall',
  'provider-reviewed funding',
  'finance provider',
  'signed project contract creates expected milestone receivables',
  'SmartContractor Platform',
  'Trust Infrastructure',
  'Settlement & Tokenized Construction Network',
  'contract collateral',
  'assignment of receivables',
  'lien',
  'security interest',
  'signed contracts are legal collateral today',
  'loans are guaranteed',
  'every contract qualifies',
  'real escrow is live',
  'AI approves loans or releases payments automatically',
  'choose one wording option',
  'npm run check:whitepaper-v1-2-contract-backed-loan-public-wording-options',
  'npm run check:whitepaper-v1-2-contract-backed-loan-review-questions',
  'npm run check:whitepaper-v1-2-contract-backed-loan-founder-review',
  'npm run check',
]) {
  assertIncludes(options, required, optionsPath);
}

assertIncludes(context, 'Whitepaper v1.2 contract-backed loan public wording options', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-public-wording-options', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan public wording options', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-public-wording-options', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan public wording options', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(options)) {
  fail('Contract-backed loan public wording options must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  contract_backed_loan_public_wording_options: optionsPath,
  public_file_change_block_checked: true,
}, null, 2));
