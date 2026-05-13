import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const statusPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-founder-packet-status.md');
const reviewIndexPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-founder-review-index.md');
const readingOrderPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-founder-reading-order.md');
const publicUseGatePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-public-use-gate.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan founder packet status validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const status = readRequired(statusPath);
const reviewIndex = readRequired(reviewIndexPath);
const readingOrder = readRequired(readingOrderPath);
const publicUseGate = readRequired(publicUseGatePath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Founder Packet Status',
  'Purpose',
  'Current Packet Status',
  'Founder Review Ready Items',
  'Required Blockers To Clear Later',
  'Required Checks',
]) {
  assertIncludes(status, section, statusPath);
}

for (const required of [
  'internal founder packet status only',
  'not legal advice',
  'not approval to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch token collateral',
  'not approval to launch repayment routing',
  'not approval to publish public wording',
  'public whitepaper remains unchanged',
  'docs/whitepaper-v1-2-contract-backed-loan-founder-review-index.md',
  'ready for internal founder review',
  'blocked for public use',
  'blocked for live implementation',
  'Internal concept review',
  'Public whitepaper use',
  'Website or deck excerpts',
  'Live loans',
  'Real escrow',
  'Token collateral',
  'Repayment routing',
  'AI approval or release',
  'No founder/legal/provider/finance-provider/technical/claim-review approval record',
  'No legal/provider approval',
  'No approved escrow provider',
  'No approved token-collateral policy',
  'No approved payment provider',
  'AI can support review only',
  'cannot approve loans',
  'release payments',
  'act as final judge',
  'Accept, Revise, Reject, or Hold',
  'response template',
  'triage log',
  'public-use gate',
  'future, provider-reviewed, legally reviewed, and not live',
  'founder approval record',
  'legal/provider review',
  'finance-provider review',
  'technical review',
  'claim-review matrix pass',
  'public-use gate pass',
  'public excerpt guard pass',
  'production payment/provider setup',
  'strict Auth/RLS/admin controls',
  'no secret exposure',
  'no real-money actions from autonomous Codex',
  'npm run check:whitepaper-v1-2-contract-backed-loan-founder-packet-status',
  'npm run check:whitepaper-v1-2-contract-backed-loan-founder-review-index',
  'npm run check:whitepaper-v1-2-contract-backed-loan-founder-reading-order',
  'npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate',
  'npm run check',
]) {
  assertIncludes(status, required, statusPath);
}

assertIncludes(reviewIndex, 'GCSC Whitepaper v1.2 Contract-Backed Loan Founder Review Index', reviewIndexPath);
assertIncludes(readingOrder, 'GCSC Whitepaper v1.2 Contract-Backed Loan Founder Reading Order', readingOrderPath);
assertIncludes(publicUseGate, 'GCSC Whitepaper v1.2 Contract-Backed Loan Public Use Gate', publicUseGatePath);

assertIncludes(context, 'Whitepaper v1.2 contract-backed loan founder packet status', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-founder-packet-status', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan founder packet status', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-founder-packet-status', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan founder packet status', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(status)) {
  fail('Contract-backed loan founder packet status must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  contract_backed_loan_founder_packet_status: statusPath,
  public_file_change_block_checked: true,
}, null, 2));
