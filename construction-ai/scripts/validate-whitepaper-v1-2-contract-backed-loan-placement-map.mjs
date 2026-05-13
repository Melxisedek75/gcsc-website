import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const mapPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-placement-map.md');
const sentenceRegisterPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-exact-sentence-register.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan placement map validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const placementMap = readRequired(mapPath);
const sentenceRegister = readRequired(sentenceRegisterPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Placement Map',
  'Purpose',
  'Approved Placement Logic',
  'Public Artifact Placement',
  'Required Context Around Any Placement',
  'Blocked Placement Patterns',
  'Required Checks',
]) {
  assertIncludes(placementMap, section, mapPath);
}

for (const required of [
  'internal placement map only',
  'not legal advice',
  'not approval to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch token collateral',
  'not approval to publish public wording',
  'public whitepaper remains unchanged',
  'contract-backed working-capital sentences',
  'secondary to the SmartContractor platform narrative',
  'CBL-SAFE-01',
  'CBL-SAFE-02',
  'CBL-SAFE-03',
  'SmartContractor Platform',
  'Contractor credit roadmap',
  'Trust Infrastructure',
  'Milestone payment workflow',
  'Settlement & Tokenized Construction Network',
  'Risk and compliance section',
  'underwriting support only',
  'future legally, technically, and provider-approved routing',
  'future compliance-reviewed roadmap language',
  'Whitepaper v1.2 draft',
  'Website excerpt',
  'Partner packet',
  'Grant packet',
  'Investor deck',
  'future compliance-reviewed roadmap concept',
  'provider-reviewed underwriting',
  'expected milestone receivables',
  'repayment-first waterfall',
  'real loans disabled until founder/legal/provider approval',
  'real escrow disabled until founder/legal/provider approval',
  'token collateral disabled until founder/legal/provider approval',
  'AI cannot approve loans or release payments automatically',
  'token economics',
  'investment return language',
  'guaranteed funding',
  'escrow is live',
  'stablecoin settlement is live',
  'npm run check:whitepaper-v1-2-contract-backed-loan-placement-map',
  'npm run check:whitepaper-v1-2-contract-backed-loan-public-excerpt-review-packet',
  'npm run check:whitepaper-v1-2-contract-backed-loan-exact-sentence-register',
  'npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate',
  'npm run check:whitepaper-v1-2-public-excerpt-guard',
  'npm run check:whitepaper-v1-2-claim-review',
  'npm run check',
]) {
  assertIncludes(placementMap, required, mapPath);
}

for (const sentenceId of ['CBL-SAFE-01', 'CBL-SAFE-02', 'CBL-SAFE-03']) {
  assertIncludes(sentenceRegister, sentenceId, sentenceRegisterPath);
}

assertIncludes(context, 'Whitepaper v1.2 contract-backed loan placement map', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-placement-map', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan placement map', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-placement-map', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan placement map', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(placementMap)) {
  fail('Contract-backed loan placement map must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  contract_backed_loan_placement_map: mapPath,
  public_file_change_block_checked: true,
}, null, 2));
