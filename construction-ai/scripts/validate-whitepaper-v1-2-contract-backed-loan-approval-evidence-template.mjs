import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const templatePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-approval-evidence-template.md');
const approvalIndexPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-implementation-approval-index.md');
const blockerRegisterPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-implementation-blocker-register.md');
const publicUseGatePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-public-use-gate.md');
const exactSentenceRegisterPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-exact-sentence-register.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan approval evidence template validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const template = readRequired(templatePath);
const approvalIndex = readRequired(approvalIndexPath);
const blockerRegister = readRequired(blockerRegisterPath);
const publicUseGate = readRequired(publicUseGatePath);
const exactSentenceRegister = readRequired(exactSentenceRegisterPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Approval Evidence Template',
  'Purpose',
  'Evidence Record',
  'Required Safe Evidence Rules',
  'Default HOLD Rules',
  'Required Linked Files',
  'Required Checks',
]) assertIncludes(template, section, templatePath);

for (const required of [
  'internal approval evidence template only',
  'not legal advice',
  'not approval to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch stablecoin settlement',
  'not approval to launch token collateral',
  'not approval to launch repayment routing',
  'not approval to publish public wording',
  'Evidence ID',
  'Reviewer role',
  'Related file or sentence ID',
  'Reviewed topic',
  'Decision',
  'APPROVED, REVISION REQUIRED, REJECTED, or HOLD',
  'Approved wording, if any',
  'Blocked wording, if any',
  'Required disclaimer',
  'Technical constraint',
  'Provider/legal constraint',
  'Public-use status',
  'Live-use status',
  'do not record passwords, private keys, seed phrases, service-role keys, API keys, raw database URLs, access tokens, or payment credentials',
  'do not record private borrower data',
  'keep exact public wording blocked',
  'public-use gate approves it',
  'live implementation blocked',
  'If any evidence field is missing or unclear, the decision remains HOLD',
  'public whitepaper wording',
  'live loan origination',
  'real escrow',
  'stablecoin settlement',
  'token collateral',
  'repayment routing',
  'provider API calls',
  'borrower underwriting decisions',
  'AI final approval',
  'AI payment release',
  'production money movement',
  'docs/whitepaper-v1-2-contract-backed-loan-implementation-approval-index.md',
  'docs/whitepaper-v1-2-contract-backed-loan-implementation-blocker-register.md',
  'docs/whitepaper-v1-2-contract-backed-loan-public-use-gate.md',
  'docs/whitepaper-v1-2-contract-backed-loan-exact-sentence-register.md',
  'npm run check:whitepaper-v1-2-contract-backed-loan-approval-evidence-template',
  'npm run check:whitepaper-v1-2-contract-backed-loan-implementation-approval-index',
  'npm run check:whitepaper-v1-2-contract-backed-loan-implementation-blocker-register',
  'npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate',
  'npm run check',
]) assertIncludes(template, required, templatePath);

assertIncludes(approvalIndex, 'GCSC Whitepaper v1.2 Contract-Backed Loan Implementation Approval Index', approvalIndexPath);
assertIncludes(blockerRegister, 'GCSC Whitepaper v1.2 Contract-Backed Loan Implementation Blocker Register', blockerRegisterPath);
assertIncludes(publicUseGate, 'GCSC Whitepaper v1.2 Contract-Backed Loan Public Use Gate', publicUseGatePath);
assertIncludes(exactSentenceRegister, 'GCSC Whitepaper v1.2 Contract-Backed Loan Exact Sentence Register', exactSentenceRegisterPath);
assertIncludes(context, 'Whitepaper v1.2 contract-backed loan approval evidence template', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-approval-evidence-template', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan approval evidence template', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-approval-evidence-template', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan approval evidence template', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(template)) {
  fail('Contract-backed loan approval evidence template must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  contract_backed_loan_approval_evidence_template: templatePath,
  public_file_change_block_checked: true,
}, null, 2));
