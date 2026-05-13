import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const templatePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-founder-response-template.md');
const readingOrderPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-founder-reading-order.md');
const packetPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-public-excerpt-review-packet.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan founder response template validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const template = readRequired(templatePath);
const readingOrder = readRequired(readingOrderPath);
const packet = readRequired(packetPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Founder Response Template',
  'Purpose',
  'Founder Response Table',
  'Required Founder Notes',
  'Do Not Include',
  'Blocked Approval Shortcuts',
  'Required Checks',
]) {
  assertIncludes(template, section, templatePath);
}

for (const required of [
  'internal founder response template only',
  'not legal advice',
  'not approval to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch token collateral',
  'not approval to launch repayment routing',
  'not approval to publish public wording',
  'public whitepaper remains unchanged',
  'Accept, Revise, Reject, or Hold',
  'without asking for secrets',
  'legal conclusions',
  'live provider commitments',
  'real payment setup',
  'public publication approval',
  'signed SmartContractor project contracts',
  'provider-reviewed working-capital eligibility',
  'receivables-based underwriting',
  'collateral, lien, assignment of receivables, or security interest',
  'repayment-first routing',
  'legal, technical, and provider approval',
  'SmartContractor Platform',
  'Trust Infrastructure',
  'Settlement & Tokenized Construction Network',
  'CBL-SAFE-01',
  'CBL-SAFE-02',
  'CBL-SAFE-03',
  'public-use gate review',
  'Which questions should go to legal/provider review?',
  'Which questions should go to finance-provider review?',
  'Which questions should go to technical review?',
  'passwords',
  'private keys',
  'service-role keys',
  'provider API keys',
  'lender contracts',
  'private borrower data',
  'raw payment data',
  'attorney-client privileged notes',
  'live Supabase SQL changes',
  'real-money loan, escrow, token collateral, or repayment-routing instructions',
  'live loans',
  'real escrow',
  'token collateral',
  'stablecoin settlement',
  'repayment routing',
  'public lending claims',
  'guaranteed funding',
  'instant approval',
  'AI loan approval',
  'AI automatic payment release',
  'GCSC acting as a lender, bank, broker, licensed finance provider, or escrow agent',
  'npm run check:whitepaper-v1-2-contract-backed-loan-founder-response-template',
  'npm run check:whitepaper-v1-2-contract-backed-loan-founder-reading-order',
  'npm run check:whitepaper-v1-2-contract-backed-loan-public-excerpt-review-packet',
  'npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate',
  'npm run check',
]) {
  assertIncludes(template, required, templatePath);
}

for (const linked of [
  'CBL-SAFE-01',
  'CBL-SAFE-02',
  'CBL-SAFE-03',
]) {
  assertIncludes(readingOrder, linked, readingOrderPath);
  assertIncludes(packet, linked, packetPath);
}

assertIncludes(template, 'docs/whitepaper-v1-2-contract-backed-loan-founder-reading-order.md', templatePath);
assertIncludes(packet, 'Public Excerpt Review Table', packetPath);

assertIncludes(context, 'Whitepaper v1.2 contract-backed loan founder response template', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-founder-response-template', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan founder response template', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-founder-response-template', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan founder response template', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(template)) {
  fail('Contract-backed loan founder response template must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  contract_backed_loan_founder_response_template: templatePath,
  public_file_change_block_checked: true,
}, null, 2));
