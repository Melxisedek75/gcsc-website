import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const gatePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-public-use-gate.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan public use gate validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const gate = readRequired(gatePath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Public Use Gate',
  'Purpose',
  'Required Evidence',
  'Pass Criteria',
  'Automatic No-Go',
  'Output States',
  'Required Checks',
]) {
  assertIncludes(gate, section, gatePath);
}

for (const required of [
  'internal public-use gate only',
  'not legal advice',
  'not approval to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch token collateral',
  'not approval to launch repayment routing',
  'public whitepaper remains unchanged',
  'contract-backed working-capital eligibility',
  'receivables-based underwriting',
  'provider-reviewed funding',
  'repayment-first waterfall',
  'signed project contract as an underwriting input',
  'escrow-ready payment-state design',
  'Safest Option',
  'Moderate Option',
  'Provider-Review Option',
  'Reject for now',
  'founder approval',
  'legal/provider review',
  'finance provider review',
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
  'GO for internal draft only',
  'GO for approved public excerpt',
  'GO for whitepaper v1.2 draft',
  'REVIEW with founder',
  'REVIEW with legal/provider',
  'REVIEW with finance provider',
  'NO-GO until language is rewritten',
  'NO-GO until real legal/provider structure exists',
  'npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate',
  'npm run check:whitepaper-v1-2-contract-backed-loan-approval-routing',
  'npm run check:whitepaper-v1-2-contract-backed-loan-wording-selection-record',
  'npm run check:whitepaper-v1-2-public-excerpt-guard',
  'npm run check:whitepaper-v1-2-claim-review',
  'npm run check:whitepaper-v1-2-publish-gate',
  'npm run check',
]) {
  assertIncludes(gate, required, gatePath);
}

assertIncludes(context, 'Whitepaper v1.2 contract-backed loan public use gate', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-public-use-gate', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan public use gate', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-public-use-gate', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan public use gate', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(gate)) {
  fail('Contract-backed loan public use gate must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  contract_backed_loan_public_use_gate: gatePath,
  public_file_change_block_checked: true,
}, null, 2));
