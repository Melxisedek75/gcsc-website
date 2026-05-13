import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const summaryPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-founder-decision-summary.md');
const closeoutPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-founder-review-closeout.md');
const responseTemplatePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-founder-response-template.md');
const triagePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-founder-response-triage-log.md');
const publicUseGatePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-public-use-gate.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan founder decision summary validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const summary = readRequired(summaryPath);
const closeout = readRequired(closeoutPath);
const responseTemplate = readRequired(responseTemplatePath);
const triage = readRequired(triagePath);
const publicUseGate = readRequired(publicUseGatePath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Founder Decision Summary',
  'Purpose',
  'Decision Fields',
  'Allowed Summary Outcomes',
  'Blocked Summary Outcomes',
  'Safe Decision Template',
  'Required Checks',
]) {
  assertIncludes(summary, section, summaryPath);
}

for (const required of [
  'internal founder decision summary only',
  'not legal advice',
  'not approval to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch token collateral',
  'not approval to launch repayment routing',
  'not approval to publish public wording',
  'public whitepaper remains unchanged',
  'founder review closeout',
  'legal/provider',
  'finance-provider',
  'technical',
  'claim-review',
  'public-use review',
  'Decision ID',
  'Packet version',
  'Founder outcome',
  'Accept / Revise / Reject / Hold',
  'response template and triage log',
  'No legal conclusions or provider promises',
  'Exact sentence IDs',
  'exact sentence register',
  'Placement IDs',
  'placement map',
  'Public-use status',
  'GO requires all approval records',
  'Live implementation status',
  'Live loans, escrow, token collateral, repayment routing, and AI payment release remain blocked',
  'Accept for internal review only',
  'Revise internal wording',
  'Reject the concept',
  'Hold for legal/provider review',
  'Hold for finance-provider review',
  'Hold for technical review',
  'Hold for claim-review or public-use gate review',
  'public whitepaper publication',
  'website, deck, grant, partner, investor, email, social, or announcement excerpts',
  'live contractor loans',
  'real escrow',
  'stablecoin settlement',
  'token collateral',
  'automatic repayment routing',
  'AI as final milestone judge',
  'AI payment-release authority',
  'GCSC acting as lender, bank, broker, escrow agent, payment provider, legal advisor, or underwriter',
  'Public-use status: Blocked',
  'Live implementation status: Blocked',
  'npm run check:whitepaper-v1-2-contract-backed-loan-founder-decision-summary',
  'npm run check:whitepaper-v1-2-contract-backed-loan-founder-review-closeout',
  'npm run check:whitepaper-v1-2-contract-backed-loan-founder-response-template',
  'npm run check:whitepaper-v1-2-contract-backed-loan-founder-response-triage-log',
  'npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate',
  'npm run check',
]) {
  assertIncludes(summary, required, summaryPath);
}

assertIncludes(closeout, 'GCSC Whitepaper v1.2 Contract-Backed Loan Founder Review Closeout', closeoutPath);
assertIncludes(responseTemplate, 'GCSC Whitepaper v1.2 Contract-Backed Loan Founder Response Template', responseTemplatePath);
assertIncludes(triage, 'GCSC Whitepaper v1.2 Contract-Backed Loan Founder Response Triage Log', triagePath);
assertIncludes(publicUseGate, 'GCSC Whitepaper v1.2 Contract-Backed Loan Public Use Gate', publicUseGatePath);

assertIncludes(context, 'Whitepaper v1.2 contract-backed loan founder decision summary', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-founder-decision-summary', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan founder decision summary', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-founder-decision-summary', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan founder decision summary', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(summary)) {
  fail('Contract-backed loan founder decision summary must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  contract_backed_loan_founder_decision_summary: summaryPath,
  public_file_change_block_checked: true,
}, null, 2));
