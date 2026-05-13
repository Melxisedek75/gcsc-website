import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const handoffPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-finance-provider-handoff.md');
const legalHandoffPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-legal-provider-handoff.md');
const summaryPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-founder-decision-summary.md');
const flowPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-flow.md');
const wordingPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-public-wording-options.md');
const publicUseGatePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-public-use-gate.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan finance-provider handoff validation failed: ${message}`);
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
const legalHandoff = readRequired(legalHandoffPath);
const summary = readRequired(summaryPath);
const flow = readRequired(flowPath);
const wording = readRequired(wordingPath);
const publicUseGate = readRequired(publicUseGatePath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Finance-Provider Handoff',
  'Purpose',
  'Handoff Packet',
  'Finance Review Questions',
  'Required Finance Answers',
  'Blocked Until Review',
  'Required Checks',
]) assertIncludes(handoff, section, handoffPath);

for (const required of [
  'internal finance-provider handoff only',
  'not legal advice',
  'not a request to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch token collateral',
  'not approval to launch repayment routing',
  'not approval to publish public wording',
  'receivables-based eligibility',
  'underwriting inputs',
  'repayment waterfalls',
  'milestone payment controls',
  'provider responsibilities',
  'prohibited promises',
  'docs/whitepaper-v1-2-contract-backed-loan-founder-decision-summary.md',
  'docs/whitepaper-v1-2-contract-backed-loan-legal-provider-handoff.md',
  'docs/whitepaper-v1-2-contract-backed-loan-flow.md',
  'docs/whitepaper-v1-2-contract-backed-loan-public-wording-options.md',
  'docs/whitepaper-v1-2-contract-backed-loan-public-use-gate.md',
  'Do not include passwords',
  'private keys',
  'API keys',
  'service-role keys',
  'wallet seed phrases',
  'bank account details',
  'borrower personal data',
  'lender contracts',
  'private contact lists',
  'escrow account details',
  'live payment credentials',
  'signed-contract fields',
  'public promise of approval',
  'business identity, license, insurance, contract value, milestone schedule, dispute history, repayment history, bid accuracy, and provider risk score',
  'future milestone proceeds',
  'assignment, lien, collateral, or guaranteed collectability',
  'approved milestone proceeds repay provider credit first',
  'ledger, payment-intent, audit, ownership, and dispute-pause controls',
  'licensed lender, credit provider, escrow provider, payment provider, or servicing partner',
  'loan size, duration, APR, geography, contractor tier, industry category, dispute status, and default handling',
  'approved eligibility inputs',
  'blocked eligibility claims',
  'underwriting and adverse-action boundaries',
  'repayment waterfall requirements',
  'milestone approval and dispute-pause requirements',
  'provider-of-record responsibilities',
  'borrower/contractor disclosure requirements',
  'pricing and APR disclosure boundaries',
  'default, chargeback, and cancellation handling',
  'exact sentence ID and placement ID',
  'guaranteed financing',
  'automatic loan approval',
  'live contractor loans',
  'real repayment routing',
  'real escrow',
  'stablecoin settlement',
  'token collateral',
  'AI as lender, underwriter, final milestone judge, or payment releaser',
  'GCSC as lender, bank, broker, escrow agent, payment provider, servicer, or underwriter',
  'npm run check:whitepaper-v1-2-contract-backed-loan-finance-provider-handoff',
  'npm run check:whitepaper-v1-2-contract-backed-loan-legal-provider-handoff',
  'npm run check:whitepaper-v1-2-contract-backed-loan-founder-decision-summary',
  'npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate',
  'npm run check',
]) assertIncludes(handoff, required, handoffPath);

assertIncludes(legalHandoff, 'GCSC Whitepaper v1.2 Contract-Backed Loan Legal/Provider Handoff', legalHandoffPath);
assertIncludes(summary, 'GCSC Whitepaper v1.2 Contract-Backed Loan Founder Decision Summary', summaryPath);
assertIncludes(flow, 'GCSC Whitepaper v1.2 Contract-Backed Loan Flow', flowPath);
assertIncludes(wording, 'GCSC Whitepaper v1.2 Contract-Backed Loan Public Wording Options', wordingPath);
assertIncludes(publicUseGate, 'GCSC Whitepaper v1.2 Contract-Backed Loan Public Use Gate', publicUseGatePath);

assertIncludes(context, 'Whitepaper v1.2 contract-backed loan finance-provider handoff', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-finance-provider-handoff', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan finance-provider handoff', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-finance-provider-handoff', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan finance-provider handoff', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(handoff)) {
  fail('Contract-backed loan finance-provider handoff must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  contract_backed_loan_finance_provider_handoff: handoffPath,
  public_file_change_block_checked: true,
}, null, 2));
