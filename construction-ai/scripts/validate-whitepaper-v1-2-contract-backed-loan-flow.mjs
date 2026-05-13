import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const flowPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-flow.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan flow validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const flow = readRequired(flowPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Flow',
  'Purpose',
  'Flow Overview',
  'State Machine',
  'Payment Waterfall',
  'Data Fields For Future Smart Contract Or Backend Model',
  'Whitepaper Wording',
  'Review Gates',
  'Required Checks Before Public Use',
]) {
  assertIncludes(flow, section, flowPath);
}

for (const required of [
  'internal founder-review flow draft only',
  'not legal advice',
  'not approval to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch real token collateral',
  'not approval to launch real repayment routing',
  'signed SmartContractor project contract creates verified project receivables',
  'working capital against those expected milestone receivables',
  'repayment-first waterfall',
  'all states remain reviewable, auditable, and paused during disputes',
  'Contract Signed',
  'Loan Requested',
  'Risk Review',
  'Provider Review',
  'Loan Approved',
  'Release Eligible',
  'Repayment Routed',
  'Contractor Net Paid',
  'Disputed',
  'milestone_gross - approved_fees - agreed_repayment = contractor_net_payout',
  'future waterfall design',
  'repayment routing is live',
  'legally enforceable',
  'provider-approved',
  'escrow-approved',
  'project_contract_id',
  'agreed_repayment_amount',
  'contractor_net_payout',
  'remaining_loan_balance',
  'contract-backed working-capital eligibility',
  'receivables-based underwriting',
  'provider-reviewed funding',
  'reduced upfront homeowner deposit risk',
  'legal collateral is active today',
  'loans are guaranteed',
  'every signed contract qualifies',
  'stablecoin repayment is live',
  'AI approves loans or releases payments automatically',
  'No autonomous task may activate real lending',
  'npm run check:whitepaper-v1-2-contract-backed-loan-flow',
  'npm run check:whitepaper-v1-2-contract-backed-loan-addendum',
  'npm run check:whitepaper-v1-2-smart-contract-architecture',
  'npm run check:whitepaper-v1-2-claim-review',
  'npm run check',
]) {
  assertIncludes(flow, required, flowPath);
}

assertIncludes(context, 'Whitepaper v1.2 contract-backed loan flow', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-flow', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan flow', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-flow', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan flow', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(flow)) {
  fail('Contract-backed loan flow must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  contract_backed_loan_flow: flowPath,
  public_file_change_block_checked: true,
}, null, 2));
