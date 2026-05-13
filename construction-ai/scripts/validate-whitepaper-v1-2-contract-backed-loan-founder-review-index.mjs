import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const indexPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-founder-review-index.md');
const readingOrderPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-founder-reading-order.md');
const responseTemplatePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-founder-response-template.md');
const triageLogPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-founder-response-triage-log.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan founder review index validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const index = readRequired(indexPath);
const readingOrder = readRequired(readingOrderPath);
const responseTemplate = readRequired(responseTemplatePath);
const triageLog = readRequired(triageLogPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Founder Review Index',
  'Purpose',
  'Review Order',
  'Review Meaning',
  'Required Checks',
]) {
  assertIncludes(index, section, indexPath);
}

for (const required of [
  'internal founder review index only',
  'not legal advice',
  'not approval to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch token collateral',
  'not approval to launch repayment routing',
  'not approval to publish public wording',
  'public whitepaper remains unchanged',
  'signed-contract-as-underwriting idea',
  'public lending, escrow, collateral, token, repayment, stablecoin, or AI approval promise',
  'docs/whitepaper-v1-2-contract-backed-loan-addendum.md',
  'docs/whitepaper-v1-2-contract-backed-loan-flow.md',
  'docs/whitepaper-v1-2-contract-backed-loan-founder-review.md',
  'docs/whitepaper-v1-2-contract-backed-loan-review-questions.md',
  'docs/whitepaper-v1-2-contract-backed-loan-public-wording-options.md',
  'docs/whitepaper-v1-2-contract-backed-loan-wording-selection-record.md',
  'docs/whitepaper-v1-2-contract-backed-loan-approval-routing-checklist.md',
  'docs/whitepaper-v1-2-contract-backed-loan-public-use-gate.md',
  'docs/whitepaper-v1-2-contract-backed-loan-exact-sentence-register.md',
  'docs/whitepaper-v1-2-contract-backed-loan-placement-map.md',
  'docs/whitepaper-v1-2-contract-backed-loan-public-excerpt-review-packet.md',
  'docs/whitepaper-v1-2-contract-backed-loan-founder-reading-order.md',
  'docs/whitepaper-v1-2-contract-backed-loan-founder-response-template.md',
  'docs/whitepaper-v1-2-contract-backed-loan-founder-response-triage-log.md',
  'Accept means keep an internal candidate alive',
  'Revise means update internal wording',
  'Reject means remove the candidate',
  'Hold means route to legal/provider, finance-provider, or technical review',
  'live loans',
  'real escrow',
  'token collateral',
  'stablecoin settlement',
  'repayment routing',
  'public lending claims',
  'guaranteed funding',
  'instant approval',
  'AI loan approval',
  'AI automatic payment release',
  'GCSC acting as a lender, bank, broker, licensed finance provider, or escrow agent',
  'npm run check:whitepaper-v1-2-contract-backed-loan-founder-review-index',
  'npm run check:whitepaper-v1-2-contract-backed-loan-founder-reading-order',
  'npm run check:whitepaper-v1-2-contract-backed-loan-founder-response-template',
  'npm run check:whitepaper-v1-2-contract-backed-loan-founder-response-triage-log',
  'npm run check',
]) {
  assertIncludes(index, required, indexPath);
}

assertIncludes(readingOrder, 'GCSC Whitepaper v1.2 Contract-Backed Loan Founder Reading Order', readingOrderPath);
assertIncludes(responseTemplate, 'GCSC Whitepaper v1.2 Contract-Backed Loan Founder Response Template', responseTemplatePath);
assertIncludes(triageLog, 'GCSC Whitepaper v1.2 Contract-Backed Loan Founder Response Triage Log', triageLogPath);

assertIncludes(context, 'Whitepaper v1.2 contract-backed loan founder review index', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-founder-review-index', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan founder review index', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-founder-review-index', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan founder review index', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(index)) {
  fail('Contract-backed loan founder review index must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  contract_backed_loan_founder_review_index: indexPath,
  public_file_change_block_checked: true,
}, null, 2));
