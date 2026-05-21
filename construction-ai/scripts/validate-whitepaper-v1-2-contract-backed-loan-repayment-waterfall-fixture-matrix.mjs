import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const matrixPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-repayment-waterfall-fixture-matrix.md');
const requirementsPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-technical-requirements.md');
const repaymentFailurePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-repayment-failure-state-matrix.md');
const readinessPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix.md');
const blockerPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-implementation-blocker-register.md');
const approvalEvidencePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-approval-evidence-template.md');
const technicalHandoffPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-technical-handoff.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciWorkflowValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message, details = {}) {
  console.error(JSON.stringify({ status: 'failed', message, ...details }, null, 2));
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail('Missing required file', { path });
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, label) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) {
    fail(`${label} missing required snippet`, { snippet });
  }
}

const matrix = readRequired(matrixPath);
const requirements = readRequired(requirementsPath);
const repaymentFailure = readRequired(repaymentFailurePath);
const readiness = readRequired(readinessPath);
const blocker = readRequired(blockerPath);
const approvalEvidence = readRequired(approvalEvidencePath);
const technicalHandoff = readRequired(technicalHandoffPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciWorkflowValidator = readRequired(ciWorkflowValidatorPath);

for (const heading of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Repayment Waterfall Fixture Matrix',
  'Status: LOCAL_ONLY_REPAYMENT_WATERFALL_FIXTURE_MATRIX',
  'Purpose',
  'Linked Inputs',
  'Fixture Fields',
  'Required Fixtures',
  'Waterfall Invariants',
  'Blocked Live Actions',
  'Required Checks',
  'Acceptance Check',
]) {
  assertIncludes(matrix, heading, matrixPath);
}

for (const snippet of [
  'not legal advice',
  'not lending approval',
  'not escrow approval',
  'not payment-provider approval',
  'not approval to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch real repayment routing',
  'not approval to launch stablecoin settlement',
  'not approval to launch token collateral',
  'not approval to move real money',
  'LOCAL_ONLY_REPAYMENT_WATERFALL_FIXTURE_MATRIX',
  'docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md',
  'docs/whitepaper-v1-2-contract-backed-loan-repayment-failure-state-matrix.md',
  'docs/whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix.md',
  'docs/whitepaper-v1-2-contract-backed-loan-implementation-blocker-register.md',
  'docs/whitepaper-v1-2-contract-backed-loan-approval-evidence-template.md',
  'docs/whitepaper-v1-2-contract-backed-loan-technical-handoff.md',
  'fixture_id',
  'fixture_state',
  'project_contract_state',
  'milestone_state',
  'milestone_gross',
  'approved_platform_fees',
  'requested_repayment',
  'outstanding_balance',
  'milestone_repayment_cap',
  'approved_loan_repayment',
  'contractor_net_payout',
  'dispute_state',
  'provider_approval_state',
  'blocked_live_gate_status',
  'audit_event_expectation',
  'WATERFALL_HAPPY_PATH_DRAFT',
  'WATERFALL_CAPS_REPAYMENT_AT_OUTSTANDING_BALANCE',
  'WATERFALL_CAPS_REPAYMENT_AT_MILESTONE_LIMIT',
  'WATERFALL_BLOCKS_NEGATIVE_CONTRACTOR_PAYOUT',
  'WATERFALL_BLOCKS_ACTIVE_DISPUTE',
  'WATERFALL_BLOCKS_UNAPPROVED_MILESTONE',
  'WATERFALL_BLOCKS_MISSING_PROVIDER_TERMS',
  'WATERFALL_BLOCKS_TOKEN_COLLATERAL_OR_STABLECOIN_ROUTE',
  'WATERFALL_RETAINAGE_HOLDBACK_DRAFT',
  'WATERFALL_CHANGE_ORDER_DRAFT',
  'DRAFT_REPAYMENT_ALLOCATION',
  'approved_loan_repayment must never exceed outstanding balance',
  'approved_loan_repayment must never exceed the milestone-level repayment cap',
  'contractor_net_payout must never be negative',
  'no repayment routing while disputed',
  'no release before milestone approval',
  'no repayment without provider/legal/payment terms',
  'every calculation must emit an audit_event',
  'BLOCKED_FOR_LIVE',
  'LIVE_REPAYMENT_ROUTING_BLOCKED',
  'LIVE_ESCROW_CUSTODY_BLOCKED',
  'LIVE_STABLECOIN_SETTLEMENT_BLOCKED',
  'LIVE_TOKEN_COLLATERAL_BLOCKED',
  'AI_FINAL_APPROVAL_BLOCKED',
  'real loan origination',
  'real escrow',
  'real repayment routing',
  'provider API calls',
  'stablecoin settlement',
  'token collateral',
  'production money movement',
  'npm run check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-fixture-matrix',
  'npm run check:whitepaper-v1-2-contract-backed-loan-technical-requirements',
  'npm run check:whitepaper-v1-2-contract-backed-loan-repayment-failure-state-matrix',
  'npm run check:whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix',
  'npm run check:whitepaper-v1-2-contract-backed-loan-implementation-blocker-register',
  'npm run check',
]) {
  assertIncludes(matrix, snippet, matrixPath);
}

for (const [content, snippet, label] of [
  [requirements, 'Repayment Waterfall Requirements', requirementsPath],
  [repaymentFailure, 'GCSC Whitepaper v1.2 Contract-Backed Loan Repayment Failure State Matrix', repaymentFailurePath],
  [readiness, 'GCSC Whitepaper v1.2 Contract-Backed Loan Implementation Readiness Matrix', readinessPath],
  [blocker, 'GCSC Whitepaper v1.2 Contract-Backed Loan Implementation Blocker Register', blockerPath],
  [approvalEvidence, 'GCSC Whitepaper v1.2 Contract-Backed Loan Approval Evidence Template', approvalEvidencePath],
  [technicalHandoff, 'GCSC Whitepaper v1.2 Contract-Backed Loan Technical Handoff', technicalHandoffPath],
]) {
  assertIncludes(content, snippet, label);
}

if (packageJson.scripts?.['check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-fixture-matrix'] !== 'node scripts/validate-whitepaper-v1-2-contract-backed-loan-repayment-waterfall-fixture-matrix.mjs') {
  fail(`${packagePath} must define check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-fixture-matrix`);
}

assertIncludes(runner, '"check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-fixture-matrix"', runnerPath);
assertIncludes(ciWorkflowValidator, "'check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-fixture-matrix'", ciWorkflowValidatorPath);
assertIncludes(context, 'Whitepaper v1.2 contract-backed loan repayment waterfall fixture matrix', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-fixture-matrix', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan repayment waterfall fixture matrix', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-fixture-matrix', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan repayment waterfall fixture matrix', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(matrix)) {
  fail('Repayment waterfall fixture matrix must not contain secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  repayment_waterfall_fixture_matrix: matrixPath,
  fixtures_checked: 10,
  safety_boundaries_checked: true,
}, null, 2));
