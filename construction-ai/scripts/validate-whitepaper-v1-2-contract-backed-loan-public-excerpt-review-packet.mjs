import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const packetPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-public-excerpt-review-packet.md');
const sentenceRegisterPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-exact-sentence-register.md');
const placementMapPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-placement-map.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan public excerpt review packet validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const packet = readRequired(packetPath);
const sentenceRegister = readRequired(sentenceRegisterPath);
const placementMap = readRequired(placementMapPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Public Excerpt Review Packet',
  'Purpose',
  'Required Inputs',
  'Public Excerpt Review Table',
  'Required Approval Gates',
  'Blocked Language',
  'Required Checks',
]) {
  assertIncludes(packet, section, packetPath);
}

for (const required of [
  'internal review packet only',
  'not legal advice',
  'not approval to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch token collateral',
  'not approval to launch repayment routing',
  'not approval to publish public wording',
  'public whitepaper remains unchanged',
  'contract-backed working-capital idea',
  'exact sentence register',
  'placement map',
  'public use gate',
  'public excerpt guard',
  'approval routing checklist',
  'claim review matrix',
  'signed SmartContractor project contract',
  'expected milestone receivables',
  'provider-reviewed contractor working-capital eligibility',
  'repayment-first waterfall',
  'remaining funds go to the contractor',
  'Selected Exact Sentence ID',
  'Allowed Placement',
  'Required Adjacent Disclaimer',
  'Blocked Claims',
  'Approval Status',
  'Whitepaper v1.2 draft',
  'Website excerpt',
  'Partner packet',
  'Grant packet',
  'Investor deck',
  'CBL-SAFE-01',
  'CBL-SAFE-02',
  'CBL-SAFE-03',
  'future compliance-reviewed roadmap concept',
  'real loans, escrow, token collateral, and repayment routing remain disabled until approval',
  'founder approval',
  'legal/provider review',
  'finance provider review',
  'technical review',
  'claim review matrix approval',
  'public excerpt guard approval',
  'public use gate approval',
  'contract collateral',
  'lien',
  'assignment of receivables',
  'security interest',
  'guaranteed funding',
  'instant approval',
  'live escrow',
  'live stablecoin settlement',
  'AI automatically releases payments',
  'AI approves loans',
  'GCSC is a lender, bank, broker, licensed finance provider, or escrow agent',
  'token collateral is active',
  'repayment routing is live',
  'npm run check:whitepaper-v1-2-contract-backed-loan-public-excerpt-review-packet',
  'npm run check:whitepaper-v1-2-contract-backed-loan-exact-sentence-register',
  'npm run check:whitepaper-v1-2-contract-backed-loan-placement-map',
  'npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate',
  'npm run check:whitepaper-v1-2-public-excerpt-guard',
  'npm run check:whitepaper-v1-2-claim-review',
  'npm run check',
]) {
  assertIncludes(packet, required, packetPath);
}

for (const sentenceId of ['CBL-SAFE-01', 'CBL-SAFE-02', 'CBL-SAFE-03']) {
  assertIncludes(sentenceRegister, sentenceId, sentenceRegisterPath);
  assertIncludes(placementMap, sentenceId, placementMapPath);
  assertIncludes(packet, sentenceId, packetPath);
}

assertIncludes(context, 'Whitepaper v1.2 contract-backed loan public excerpt review packet', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-public-excerpt-review-packet', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan public excerpt review packet', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-public-excerpt-review-packet', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan public excerpt review packet', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(packet)) {
  fail('Contract-backed loan public excerpt review packet must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  contract_backed_loan_public_excerpt_review_packet: packetPath,
  public_file_change_block_checked: true,
}, null, 2));
