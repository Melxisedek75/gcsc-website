import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const matrixPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-repayment-failure-state-matrix.md');
const requirementsPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-technical-requirements.md');
const readinessMatrixPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix.md');
const blockerRegisterPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-implementation-blocker-register.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan repayment failure state matrix validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const matrix = readRequired(matrixPath);
const requirements = readRequired(requirementsPath);
const readinessMatrix = readRequired(readinessMatrixPath);
const blockerRegister = readRequired(blockerRegisterPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Repayment Failure State Matrix',
  'Purpose',
  'Failure State Matrix',
  'Required Draft Outputs',
  'Blocked Live Actions',
  'Required Checks',
]) assertIncludes(matrix, section, matrixPath);

for (const required of [
  'internal repayment failure-state matrix only',
  'not approval to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch real repayment routing',
  'not approval to launch stablecoin settlement',
  'not approval to launch token collateral',
  'not approval to move real money',
  'MISSING_PROVIDER_TERMS',
  'MILESTONE_NOT_APPROVED',
  'ACTIVE_DISPUTE',
  'OVER_REPAYMENT_REQUEST',
  'NEGATIVE_CONTRACTOR_PAYOUT',
  'UNVERIFIED_CHANGE_ORDER',
  'PARTIAL_APPROVAL_HOLDBACK',
  'STALE_OR_CONTRADICTORY_EVIDENCE',
  'AI_ONLY_APPROVAL_ATTEMPT',
  'TOKEN_COLLATERAL_DEPENDENCY',
  'HOLD_FOR_PROVIDER_REVIEW',
  'HOLD_FOR_MILESTONE_APPROVAL',
  'HOLD_FOR_DISPUTE_REVIEW',
  'CAP_TO_OUTSTANDING_BALANCE',
  'HOLD_FOR_NEGATIVE_PAYOUT_REVIEW',
  'HOLD_FOR_CHANGE_ORDER_REVIEW',
  'HOLD_FOR_PARTIAL_MILESTONE_REVIEW',
  'HOLD_FOR_EVIDENCE_REVIEW',
  'HOLD_FOR_HUMAN_REVIEW',
  'HOLD_FOR_TOKEN_COLLATERAL_REVIEW',
  'BLOCKED_FOR_LIVE',
  'DRAFT_REPAYMENT_ALLOCATION',
  'LOCAL_DRAFT_FAILURE_STATE',
  'audit_event',
  'request_id',
  'no provider API calls',
  'no repayment routing',
  'no escrow release',
  'no stablecoin settlement',
  'no token collateral lock',
  'no AI final approval',
  'no production money movement',
  'npm run check:whitepaper-v1-2-contract-backed-loan-repayment-failure-state-matrix',
  'npm run check:whitepaper-v1-2-contract-backed-loan-technical-requirements',
  'npm run check:whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix',
  'npm run check:whitepaper-v1-2-contract-backed-loan-implementation-blocker-register',
  'npm run check',
]) assertIncludes(matrix, required, matrixPath);

for (const [content, snippet, file] of [
  [requirements, 'Repayment Waterfall Requirements', requirementsPath],
  [requirements, 'Partial Milestone And Dispute Hold Boundary', requirementsPath],
  [requirements, 'Change Order And Budget Drift Boundary', requirementsPath],
  [readinessMatrix, 'Payment provider and repayment routing', readinessMatrixPath],
  [blockerRegister, 'repayment routing', blockerRegisterPath],
]) assertIncludes(content, snippet, file);

assertIncludes(context, 'Whitepaper v1.2 contract-backed loan repayment failure state matrix', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-repayment-failure-state-matrix', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan repayment failure state matrix', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-repayment-failure-state-matrix', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan repayment failure state matrix', auditPath);
assertIncludes(packageJson, '"check:whitepaper-v1-2-contract-backed-loan-repayment-failure-state-matrix"', packagePath);
assertIncludes(runner, '"check:whitepaper-v1-2-contract-backed-loan-repayment-failure-state-matrix"', runnerPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(matrix)) {
  fail('Repayment failure state matrix must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  repayment_failure_state_matrix: matrixPath,
  failure_states_checked: 10,
  blocked_live_actions_checked: true,
}, null, 2));
