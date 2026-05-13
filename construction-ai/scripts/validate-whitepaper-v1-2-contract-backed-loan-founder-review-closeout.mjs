import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const closeoutPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-founder-review-closeout.md');
const statusPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-founder-packet-status.md');
const reviewIndexPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-founder-review-index.md');
const triagePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-founder-response-triage-log.md');
const publicUseGatePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-public-use-gate.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan founder review closeout validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const closeout = readRequired(closeoutPath);
const status = readRequired(statusPath);
const reviewIndex = readRequired(reviewIndexPath);
const triage = readRequired(triagePath);
const publicUseGate = readRequired(publicUseGatePath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Founder Review Closeout',
  'Purpose',
  'Closeout Checklist',
  'Allowed Closeout Outcomes',
  'Blocked Closeout Outcomes',
  'Required Evidence',
  'Required Checks',
]) {
  assertIncludes(closeout, section, closeoutPath);
}

for (const required of [
  'internal founder review closeout only',
  'not legal advice',
  'not approval to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch token collateral',
  'not approval to launch repayment routing',
  'not approval to publish public wording',
  'public whitepaper remains unchanged',
  'founder packet status has been reviewed',
  'founder review index has been reviewed',
  'founder reading order has been followed',
  'response template has one clear Accept, Revise, Reject, or Hold outcome',
  'response triage log has a route',
  'exact sentence register is updated',
  'placement map is updated',
  'public-use gate remains blocked',
  'live implementation remains blocked',
  'legal/provider',
  'finance-provider',
  'technical',
  'Auth/RLS/admin',
  'payment-provider',
  'security gates',
  'Close internal review',
  'Revise packet',
  'Hold for legal/provider',
  'Hold for finance-provider',
  'Hold for technical',
  'Reject concept',
  'published whitepaper changes',
  'website or deck excerpts',
  'live loans',
  'real escrow',
  'stablecoin settlement',
  'token collateral',
  'automatic repayment routing',
  'AI milestone approval as final judge',
  'AI payment release authority',
  'GCSC acting as lender, bank, broker, escrow agent, or payment provider',
  'founder response template decision ID',
  'response triage log route ID',
  'affected exact sentence IDs',
  'affected placement IDs',
  'public-use gate status',
  'Do not include passwords',
  'private keys',
  'API keys',
  'service-role keys',
  'wallet seed phrases',
  'bank information',
  'borrower personal data',
  'lender documents',
  'escrow account details',
  'private contact details',
  'npm run check:whitepaper-v1-2-contract-backed-loan-founder-review-closeout',
  'npm run check:whitepaper-v1-2-contract-backed-loan-founder-packet-status',
  'npm run check:whitepaper-v1-2-contract-backed-loan-founder-review-index',
  'npm run check:whitepaper-v1-2-contract-backed-loan-founder-response-triage-log',
  'npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate',
  'npm run check',
]) {
  assertIncludes(closeout, required, closeoutPath);
}

assertIncludes(status, 'GCSC Whitepaper v1.2 Contract-Backed Loan Founder Packet Status', statusPath);
assertIncludes(reviewIndex, 'GCSC Whitepaper v1.2 Contract-Backed Loan Founder Review Index', reviewIndexPath);
assertIncludes(triage, 'GCSC Whitepaper v1.2 Contract-Backed Loan Founder Response Triage Log', triagePath);
assertIncludes(publicUseGate, 'GCSC Whitepaper v1.2 Contract-Backed Loan Public Use Gate', publicUseGatePath);

assertIncludes(context, 'Whitepaper v1.2 contract-backed loan founder review closeout', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-founder-review-closeout', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan founder review closeout', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-founder-review-closeout', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan founder review closeout', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(closeout)) {
  fail('Contract-backed loan founder review closeout must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  contract_backed_loan_founder_review_closeout: closeoutPath,
  public_file_change_block_checked: true,
}, null, 2));
