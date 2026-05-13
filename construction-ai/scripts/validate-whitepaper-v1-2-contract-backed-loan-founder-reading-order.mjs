import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const readingOrderPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-founder-reading-order.md');
const packetPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-public-excerpt-review-packet.md');
const sentenceRegisterPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-exact-sentence-register.md');
const placementMapPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-placement-map.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan founder reading order validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const readingOrder = readRequired(readingOrderPath);
const packet = readRequired(packetPath);
const sentenceRegister = readRequired(sentenceRegisterPath);
const placementMap = readRequired(placementMapPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Founder Reading Order',
  'Purpose',
  'Reading Sequence',
  'Founder Decision Points',
  'Study Notes For Founder',
  'Blocked Claims',
  'Required Checks',
]) {
  assertIncludes(readingOrder, section, readingOrderPath);
}

for (const required of [
  'internal founder reading order only',
  'not legal advice',
  'not approval to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch token collateral',
  'not approval to launch repayment routing',
  'not approval to publish public wording',
  'public whitepaper remains unchanged',
  'signed-project-contract working-capital concept',
  'signed SmartContractor project contract',
  'expected milestone receivables',
  'provider-reviewed contractor working-capital eligibility',
  'repayment-first waterfall',
  'dispute pause enforced',
  'legally, technically, and provider-approved',
  'legal/provider',
  'finance-provider',
  'technical',
  'public-wording review',
  'exact sentence IDs',
  'not paraphrases',
  'CBL-SAFE-01',
  'CBL-SAFE-02',
  'CBL-SAFE-03',
  'exact sentence ID',
  'allowed placement',
  'adjacent disclaimer',
  'blocked claims',
  'approval status',
  'Accept, Revise, Reject, or Hold',
  'receivables-based underwriting',
  'working-capital eligibility',
  'collateral, lien, or security interest',
  'SmartContractor Platform',
  'Trust Infrastructure',
  'Settlement & Tokenized Construction Network',
  'future infrastructure',
  'not a live lending product',
  'guaranteed funding',
  'real loans',
  'real escrow',
  'token collateral',
  'stablecoin settlement',
  'repayment routing disabled until approval',
  'AI approves loans',
  'AI automatically releases payments',
  'GCSC is a lender, bank, broker, licensed finance provider, or escrow agent',
  'npm run check:whitepaper-v1-2-contract-backed-loan-founder-reading-order',
  'npm run check:whitepaper-v1-2-contract-backed-loan-public-excerpt-review-packet',
  'npm run check:whitepaper-v1-2-contract-backed-loan-exact-sentence-register',
  'npm run check:whitepaper-v1-2-contract-backed-loan-placement-map',
  'npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate',
  'npm run check',
]) {
  assertIncludes(readingOrder, required, readingOrderPath);
}

for (const linkedDoc of [
  'docs/whitepaper-v1-2-contract-backed-loan-addendum.md',
  'docs/whitepaper-v1-2-contract-backed-loan-flow.md',
  'docs/whitepaper-v1-2-contract-backed-loan-review-questions.md',
  'docs/whitepaper-v1-2-contract-backed-loan-public-wording-options.md',
  'docs/whitepaper-v1-2-contract-backed-loan-exact-sentence-register.md',
  'docs/whitepaper-v1-2-contract-backed-loan-placement-map.md',
  'docs/whitepaper-v1-2-contract-backed-loan-public-excerpt-review-packet.md',
  'docs/whitepaper-v1-2-contract-backed-loan-public-use-gate.md',
]) {
  assertIncludes(readingOrder, linkedDoc, readingOrderPath);
}

for (const sentenceId of ['CBL-SAFE-01', 'CBL-SAFE-02', 'CBL-SAFE-03']) {
  assertIncludes(sentenceRegister, sentenceId, sentenceRegisterPath);
  assertIncludes(placementMap, sentenceId, placementMapPath);
  assertIncludes(packet, sentenceId, packetPath);
}

assertIncludes(context, 'Whitepaper v1.2 contract-backed loan founder reading order', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-founder-reading-order', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan founder reading order', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-founder-reading-order', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan founder reading order', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(readingOrder)) {
  fail('Contract-backed loan founder reading order must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  contract_backed_loan_founder_reading_order: readingOrderPath,
  public_file_change_block_checked: true,
}, null, 2));
