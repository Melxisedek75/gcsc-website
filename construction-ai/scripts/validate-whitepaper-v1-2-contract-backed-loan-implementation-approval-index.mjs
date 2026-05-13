import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const indexPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-implementation-approval-index.md');
const matrixPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix.md');
const blockerRegisterPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-implementation-blocker-register.md');
const approvalRoutingPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-approval-routing-checklist.md');
const publicUseGatePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-public-use-gate.md');
const claimReviewPath = resolve('..', 'docs', 'whitepaper-v1-2-claim-review-matrix.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan implementation approval index validation failed: ${message}`);
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
const matrix = readRequired(matrixPath);
const blockerRegister = readRequired(blockerRegisterPath);
const approvalRouting = readRequired(approvalRoutingPath);
const publicUseGate = readRequired(publicUseGatePath);
const claimReview = readRequired(claimReviewPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Implementation Approval Index',
  'Purpose',
  'Approval Order',
  'Required Approval Evidence',
  'Current Default Decision',
  'Required Linked Files',
  'Required Checks',
]) assertIncludes(index, section, indexPath);

for (const required of [
  'internal approval index only',
  'not legal advice',
  'not approval to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch stablecoin settlement',
  'not approval to launch token collateral',
  'not approval to launch repayment routing',
  'not approval to publish public wording',
  'Founder scope approval',
  'Legal/provider review',
  'Finance-provider review',
  'Technical no-real-money design review',
  'Claim and public wording review',
  'Public-use gate',
  'Future live integration gate',
  'reviewer role',
  'reviewed document or sentence ID',
  'APPROVED, REVISION REQUIRED, REJECTED, or HOLD',
  'exact allowed wording',
  'exact blocked wording',
  'required disclaimers',
  'technical constraints',
  'public-use status',
  'no-real-money or live-risk boundary',
  'default decision is HOLD',
  'no public whitepaper wording',
  'no live loan origination',
  'no real escrow',
  'no stablecoin settlement',
  'no token collateral',
  'no repayment routing',
  'no provider API calls',
  'no borrower underwriting decisions',
  'no AI final approval',
  'no AI payment release',
  'no production money movement',
  'docs/whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix.md',
  'docs/whitepaper-v1-2-contract-backed-loan-implementation-blocker-register.md',
  'docs/whitepaper-v1-2-contract-backed-loan-approval-routing-checklist.md',
  'docs/whitepaper-v1-2-contract-backed-loan-public-use-gate.md',
  'docs/whitepaper-v1-2-claim-review-matrix.md',
  'npm run check:whitepaper-v1-2-contract-backed-loan-implementation-approval-index',
  'npm run check:whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix',
  'npm run check:whitepaper-v1-2-contract-backed-loan-implementation-blocker-register',
  'npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate',
  'npm run check',
]) assertIncludes(index, required, indexPath);

assertIncludes(matrix, 'GCSC Whitepaper v1.2 Contract-Backed Loan Implementation Readiness Matrix', matrixPath);
assertIncludes(blockerRegister, 'GCSC Whitepaper v1.2 Contract-Backed Loan Implementation Blocker Register', blockerRegisterPath);
assertIncludes(approvalRouting, 'GCSC Whitepaper v1.2 Contract-Backed Loan Approval Routing Checklist', approvalRoutingPath);
assertIncludes(publicUseGate, 'GCSC Whitepaper v1.2 Contract-Backed Loan Public Use Gate', publicUseGatePath);
assertIncludes(claimReview, 'Whitepaper v1.2 Claim Review Matrix', claimReviewPath);
assertIncludes(context, 'Whitepaper v1.2 contract-backed loan implementation approval index', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-implementation-approval-index', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan implementation approval index', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-implementation-approval-index', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan implementation approval index', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(index)) {
  fail('Contract-backed loan implementation approval index must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  contract_backed_loan_implementation_approval_index: indexPath,
  public_file_change_block_checked: true,
}, null, 2));
