import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const routingPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-approval-routing-checklist.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan approval routing validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const routing = readRequired(routingPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Approval Routing Checklist',
  'Purpose',
  'Required Inputs',
  'Approval Routes',
  'Blocked Claims',
  'Approval Outcome States',
  'Required Checks Before Public Use',
]) {
  assertIncludes(routing, section, routingPath);
}

for (const required of [
  'internal approval routing checklist only',
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
  'Founder route',
  'Legal route',
  'Finance provider route',
  'Technical route',
  'Public-use route',
  'Safest Option',
  'Moderate Option',
  'Provider-Review Option',
  'Reject for now',
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
  'Approved for internal draft only',
  'Approved for founder-only review',
  'Approved for legal/provider review',
  'Approved for public excerpt',
  'Approved for whitepaper v1.2 draft',
  'Rejected for now',
  'Blocked pending legal/provider review',
  'founder approval',
  'legal/provider review',
  'npm run check:whitepaper-v1-2-contract-backed-loan-approval-routing',
  'npm run check:whitepaper-v1-2-contract-backed-loan-wording-selection-record',
  'npm run check:whitepaper-v1-2-contract-backed-loan-public-wording-options',
  'npm run check:whitepaper-v1-2-public-excerpt-guard',
  'npm run check:whitepaper-v1-2-claim-review',
  'npm run check',
]) {
  assertIncludes(routing, required, routingPath);
}

assertIncludes(context, 'Whitepaper v1.2 contract-backed loan approval routing checklist', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-approval-routing', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan approval routing checklist', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-approval-routing', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan approval routing checklist', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(routing)) {
  fail('Contract-backed loan approval routing checklist must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  contract_backed_loan_approval_routing: routingPath,
  public_file_change_block_checked: true,
}, null, 2));
