import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const handoffPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-technical-handoff.md');
const financeHandoffPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-finance-provider-handoff.md');
const legalHandoffPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-legal-provider-handoff.md');
const publicUseGatePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-public-use-gate.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan technical handoff validation failed: ${message}`);
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
const financeHandoff = readRequired(financeHandoffPath);
const legalHandoff = readRequired(legalHandoffPath);
const publicUseGate = readRequired(publicUseGatePath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Technical Handoff',
  'Purpose',
  'Technical Review Areas',
  'Required Technical Answers',
  'Blocked Until Technical Review',
  'Required Checks',
]) assertIncludes(handoff, section, handoffPath);

for (const required of [
  'internal technical handoff only',
  'not legal advice',
  'not approval to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch token collateral',
  'not approval to launch repayment routing',
  'not approval to publish public wording',
  'data model',
  'API boundaries',
  'ownership',
  'audit trail',
  'milestone payment controls',
  'dispute pause',
  'provider adapters',
  'AI review boundaries',
  'no-real-money safety gates',
  'project contract with owner IDs, contractor IDs, milestone IDs, status, and audit events',
  'reviewable record, not automatic loan approval',
  'disabled-by-default live mode',
  'repayment-first routing in draft state',
  'strict ownership rules',
  'request ID and audit ledger coverage',
  'Dispute state must pause repayment routing',
  'AI can assist evidence and milestone review only',
  'cannot approve loans, release payment, or act as final judge',
  'proposed database tables and fields',
  'API endpoints and request/response boundaries',
  'backend-only tables',
  'RLS ownership policies',
  'provider adapter states',
  'payment-intent and audit-event linkage',
  'milestone approval and dispute-pause state machine',
  'repayment waterfall draft states',
  'AI recommendation fields and human override fields',
  'exact public wording that must stay blocked',
  'real loan origination',
  'real escrow',
  'stablecoin settlement',
  'token collateral',
  'repayment routing',
  'provider API calls',
  'borrower underwriting decisions',
  'AI final approval',
  'AI payment release',
  'production money movement',
  'npm run check:whitepaper-v1-2-contract-backed-loan-technical-handoff',
  'npm run check:whitepaper-v1-2-contract-backed-loan-finance-provider-handoff',
  'npm run check:whitepaper-v1-2-contract-backed-loan-legal-provider-handoff',
  'npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate',
  'npm run check',
]) assertIncludes(handoff, required, handoffPath);

assertIncludes(financeHandoff, 'GCSC Whitepaper v1.2 Contract-Backed Loan Finance-Provider Handoff', financeHandoffPath);
assertIncludes(legalHandoff, 'GCSC Whitepaper v1.2 Contract-Backed Loan Legal/Provider Handoff', legalHandoffPath);
assertIncludes(publicUseGate, 'GCSC Whitepaper v1.2 Contract-Backed Loan Public Use Gate', publicUseGatePath);

assertIncludes(context, 'Whitepaper v1.2 contract-backed loan technical handoff', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-technical-handoff', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan technical handoff', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-technical-handoff', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan technical handoff', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(handoff)) {
  fail('Contract-backed loan technical handoff must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  contract_backed_loan_technical_handoff: handoffPath,
  public_file_change_block_checked: true,
}, null, 2));
