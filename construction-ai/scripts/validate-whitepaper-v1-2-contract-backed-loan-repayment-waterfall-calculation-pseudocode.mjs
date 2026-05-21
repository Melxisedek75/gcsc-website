import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const pseudocodePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-repayment-waterfall-calculation-pseudocode.md');
const fixtureMatrixPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-repayment-waterfall-fixture-matrix.md');
const technicalRequirementsPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-technical-requirements.md');
const repaymentFailurePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-repayment-failure-state-matrix.md');
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

const pseudocode = readRequired(pseudocodePath);
const fixtureMatrix = readRequired(fixtureMatrixPath);
const technicalRequirements = readRequired(technicalRequirementsPath);
const repaymentFailure = readRequired(repaymentFailurePath);
const technicalHandoff = readRequired(technicalHandoffPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciWorkflowValidator = readRequired(ciWorkflowValidatorPath);

for (const heading of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Repayment Waterfall Calculation Pseudocode',
  'Status: LOCAL_ONLY_REPAYMENT_WATERFALL_CALCULATION_PSEUDOCODE',
  'Purpose',
  'Linked Inputs',
  'Deterministic Input Contract',
  'Calculation Order',
  'Pseudocode',
  'Required Outputs',
  'Failure And Hold Mapping',
  'Blocked Live Actions',
  'Required Checks',
  'Acceptance Check',
]) {
  assertIncludes(pseudocode, heading, pseudocodePath);
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
  'LOCAL_ONLY_REPAYMENT_WATERFALL_CALCULATION_PSEUDOCODE',
  'docs/whitepaper-v1-2-contract-backed-loan-repayment-waterfall-fixture-matrix.md',
  'docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md',
  'docs/whitepaper-v1-2-contract-backed-loan-repayment-failure-state-matrix.md',
  'docs/whitepaper-v1-2-contract-backed-loan-technical-handoff.md',
  'project_contract_state',
  'milestone_state',
  'milestone_gross',
  'approved_platform_fees',
  'requested_repayment',
  'outstanding_balance',
  'milestone_repayment_cap',
  'retainage_holdback',
  'approved_change_order_amount',
  'disputed_work_amount',
  'provider_approval_state',
  'dispute_state',
  'blocked_live_gate_status',
  'audit_event',
  'normalize currency inputs',
  'reject missing provider/legal/payment terms',
  'reject active or unresolved disputes',
  'reject unapproved milestone evidence',
  'exclude retainage holdback',
  'exclude pending, stale, unsigned, disputed, or over-budget change orders',
  'cap repayment at outstanding balance',
  'cap repayment at milestone_repayment_cap',
  'block negative contractor_net_payout',
  'emit append-only audit_event',
  'function calculateDraftRepaymentWaterfall(input)',
  'return hold("HOLD_FOR_PROVIDER_TERM_REVALIDATION")',
  'return hold("HOLD_FOR_DISPUTE_WINDOW_REVIEW")',
  'return hold("HOLD_FOR_OWNER_ACCEPTANCE_REVIEW")',
  'return hold("HOLD_FOR_RETAINAGE_LIEN_REVIEW")',
  'return hold("HOLD_FOR_CHANGE_ORDER_REVIEW")',
  'return hold("HOLD_FOR_NEGATIVE_CONTRACTOR_PAYOUT_REVIEW")',
  'approved_loan_repayment = min(requested_repayment, outstanding_balance, milestone_repayment_cap, allocable_amount)',
  'contractor_net_payout = allocable_amount - approved_platform_fees - approved_loan_repayment',
  'DRAFT_REPAYMENT_ALLOCATION',
  'WATERFALL_CAPS_REPAYMENT_AT_OUTSTANDING_BALANCE',
  'WATERFALL_CAPS_REPAYMENT_AT_MILESTONE_LIMIT',
  'WATERFALL_BLOCKS_NEGATIVE_CONTRACTOR_PAYOUT',
  'WATERFALL_BLOCKS_ACTIVE_DISPUTE',
  'WATERFALL_BLOCKS_UNAPPROVED_MILESTONE',
  'WATERFALL_BLOCKS_MISSING_PROVIDER_TERMS',
  'WATERFALL_BLOCKS_TOKEN_COLLATERAL_OR_STABLECOIN_ROUTE',
  'WATERFALL_RETAINAGE_HOLDBACK_DRAFT',
  'WATERFALL_CHANGE_ORDER_DRAFT',
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
  'npm run check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-calculation-pseudocode',
  'npm run check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-fixture-matrix',
  'npm run check:whitepaper-v1-2-contract-backed-loan-technical-requirements',
  'npm run check:whitepaper-v1-2-contract-backed-loan-repayment-failure-state-matrix',
  'npm run check',
]) {
  assertIncludes(pseudocode, snippet, pseudocodePath);
}

for (const [content, snippet, label] of [
  [fixtureMatrix, 'GCSC Whitepaper v1.2 Contract-Backed Loan Repayment Waterfall Fixture Matrix', fixtureMatrixPath],
  [technicalRequirements, 'Repayment Waterfall Requirements', technicalRequirementsPath],
  [repaymentFailure, 'GCSC Whitepaper v1.2 Contract-Backed Loan Repayment Failure State Matrix', repaymentFailurePath],
  [technicalHandoff, 'GCSC Whitepaper v1.2 Contract-Backed Loan Technical Handoff', technicalHandoffPath],
]) {
  assertIncludes(content, snippet, label);
}

if (packageJson.scripts?.['check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-calculation-pseudocode'] !== 'node scripts/validate-whitepaper-v1-2-contract-backed-loan-repayment-waterfall-calculation-pseudocode.mjs') {
  fail(`${packagePath} must define check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-calculation-pseudocode`);
}

assertIncludes(runner, '"check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-calculation-pseudocode"', runnerPath);
assertIncludes(ciWorkflowValidator, "'check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-calculation-pseudocode'", ciWorkflowValidatorPath);
assertIncludes(context, 'Whitepaper v1.2 contract-backed loan repayment waterfall calculation pseudocode', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-calculation-pseudocode', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan repayment waterfall calculation pseudocode', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-calculation-pseudocode', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan repayment waterfall calculation pseudocode', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(pseudocode)) {
  fail('Repayment waterfall calculation pseudocode must not contain secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  repayment_waterfall_calculation_pseudocode: pseudocodePath,
  calculation_steps_checked: 10,
  safety_boundaries_checked: true,
}, null, 2));
