import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const handoffPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-legal-provider-handoff.md');
const summaryPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-founder-decision-summary.md');
const closeoutPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-founder-review-closeout.md');
const publicUseGatePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-public-use-gate.md');
const sentenceRegisterPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-exact-sentence-register.md');
const excerptPacketPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-public-excerpt-review-packet.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan legal/provider handoff validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const handoff = readRequired(handoffPath);
const summary = readRequired(summaryPath);
const closeout = readRequired(closeoutPath);
const publicUseGate = readRequired(publicUseGatePath);
const sentenceRegister = readRequired(sentenceRegisterPath);
const excerptPacket = readRequired(excerptPacketPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Legal/Provider Handoff',
  'Purpose',
  'Handoff Packet',
  'Review Questions',
  'Required Provider Answers',
  'Blocked Until Review',
  'Required Checks',
]) {
  assertIncludes(handoff, section, handoffPath);
}

for (const required of [
  'internal legal/provider handoff only',
  'not legal advice',
  'not a request to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch token collateral',
  'not approval to launch repayment routing',
  'not approval to publish public wording',
  'public whitepaper remains unchanged',
  'classification',
  'consumer protection',
  'money movement',
  'provider roles',
  'borrower disclosures',
  'receivables language',
  'escrow boundaries',
  'prohibited promises',
  'docs/whitepaper-v1-2-contract-backed-loan-founder-decision-summary.md',
  'docs/whitepaper-v1-2-contract-backed-loan-founder-review-closeout.md',
  'docs/whitepaper-v1-2-contract-backed-loan-public-use-gate.md',
  'docs/whitepaper-v1-2-contract-backed-loan-exact-sentence-register.md',
  'docs/whitepaper-v1-2-contract-backed-loan-public-excerpt-review-packet.md',
  'Do not send passwords',
  'private keys',
  'API keys',
  'service-role keys',
  'wallet seed phrases',
  'borrower personal data',
  'bank data',
  'escrow account data',
  'lender agreements',
  'private contact lists',
  'live system credentials',
  'future receivables or working-capital eligibility',
  'collateral, lien, assignment, or guaranteed financing',
  'milestone proceeds repaying an approved provider loan',
  'GCSC is already an escrow agent, money transmitter, lender, broker, bank, or underwriter',
  'future compliant stablecoin settlement',
  'Token collateral',
  'AI as support only',
  'allowed terms',
  'blocked terms',
  'required disclaimers',
  'provider role boundaries',
  'borrower/contractor disclosure needs',
  'escrow and money-transmission boundaries',
  'lending, broker, bank, and underwriting boundaries',
  'stablecoin settlement boundaries',
  'token collateral boundaries',
  'AI verification boundaries',
  'exact sentence IDs and placement IDs',
  'live contractor loans',
  'real escrow',
  'stablecoin settlement',
  'token collateral',
  'automatic repayment routing',
  'AI milestone approval as final judge',
  'AI payment-release authority',
  'GCSC as lender, bank, broker, escrow agent, payment provider, legal advisor, underwriter, or money transmitter',
  'npm run check:whitepaper-v1-2-contract-backed-loan-legal-provider-handoff',
  'npm run check:whitepaper-v1-2-contract-backed-loan-founder-decision-summary',
  'npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate',
  'npm run check:whitepaper-v1-2-contract-backed-loan-exact-sentence-register',
  'npm run check',
]) {
  assertIncludes(handoff, required, handoffPath);
}

assertIncludes(summary, 'GCSC Whitepaper v1.2 Contract-Backed Loan Founder Decision Summary', summaryPath);
assertIncludes(closeout, 'GCSC Whitepaper v1.2 Contract-Backed Loan Founder Review Closeout', closeoutPath);
assertIncludes(publicUseGate, 'GCSC Whitepaper v1.2 Contract-Backed Loan Public Use Gate', publicUseGatePath);
assertIncludes(sentenceRegister, 'GCSC Whitepaper v1.2 Contract-Backed Loan Exact Sentence Register', sentenceRegisterPath);
assertIncludes(excerptPacket, 'GCSC Whitepaper v1.2 Contract-Backed Loan Public Excerpt Review Packet', excerptPacketPath);

assertIncludes(context, 'Whitepaper v1.2 contract-backed loan legal/provider handoff', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-legal-provider-handoff', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan legal/provider handoff', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-legal-provider-handoff', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan legal/provider handoff', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(handoff)) {
  fail('Contract-backed loan legal/provider handoff must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  contract_backed_loan_legal_provider_handoff: handoffPath,
  public_file_change_block_checked: true,
}, null, 2));
