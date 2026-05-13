import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const questionsPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-review-questions.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan review questions validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const questions = readRequired(questionsPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Review Questions',
  'Purpose',
  'Founder Questions',
  'Legal Questions',
  'Finance Provider Questions',
  'Technical Architecture Questions',
  'Public Wording Questions',
  'Stop Conditions',
  'Required Checks Before Public Use',
]) {
  assertIncludes(questions, section, questionsPath);
}

for (const required of [
  'internal review-question list only',
  'not legal advice',
  'not approval to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch token collateral',
  'not approval to launch repayment routing',
  'contract-backed working-capital eligibility',
  'receivables-based underwriting',
  'repayment-first waterfall',
  'assignment of receivables',
  'lien',
  'security interest',
  'provider-reviewed funding',
  'human override',
  'dispute pause',
  'AI must not approve loans or release payments automatically',
  'public whitepaper remains unchanged',
  'signed contracts are legal collateral today',
  'loans are guaranteed',
  'every contract qualifies',
  'real escrow is live',
  'npm run check:whitepaper-v1-2-contract-backed-loan-review-questions',
  'npm run check:whitepaper-v1-2-contract-backed-loan-founder-review',
  'npm run check:whitepaper-v1-2-contract-backed-loan-flow',
  'npm run check',
]) {
  assertIncludes(questions, required, questionsPath);
}

assertIncludes(context, 'Whitepaper v1.2 contract-backed loan review questions', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-review-questions', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan review questions', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-review-questions', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan review questions', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(questions)) {
  fail('Contract-backed loan review questions must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  contract_backed_loan_review_questions: questionsPath,
  public_file_change_block_checked: true,
}, null, 2));
