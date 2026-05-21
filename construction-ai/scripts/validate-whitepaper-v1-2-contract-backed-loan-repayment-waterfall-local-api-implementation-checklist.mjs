import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const checklistPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-implementation-checklist.md');
const examplesPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-examples.md');
const apiContractPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-contract.md');
const pseudocodePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-repayment-waterfall-calculation-pseudocode.md');
const fixtureMatrixPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-repayment-waterfall-fixture-matrix.md');
const authRlsPlanPath = resolve('..', 'docs', 'smartcontractor-auth-rls-plan.md');
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

const checklist = readRequired(checklistPath);
const examples = readRequired(examplesPath);
const apiContract = readRequired(apiContractPath);
const pseudocode = readRequired(pseudocodePath);
const fixtureMatrix = readRequired(fixtureMatrixPath);
const authRlsPlan = readRequired(authRlsPlanPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciWorkflowValidator = readRequired(ciWorkflowValidatorPath);

for (const heading of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Repayment Waterfall Local API Implementation Checklist',
  'Status: LOCAL_ONLY_REPAYMENT_WATERFALL_LOCAL_API_IMPLEMENTATION_CHECKLIST',
  'Purpose',
  'Linked Inputs',
  'Implementation Scope',
  'Required Local Modules',
  'Required Endpoint Checks',
  'Required Hold Checks',
  'Required Auth And RLS Checks',
  'Required Audit Checks',
  'Blocked Live Actions',
  'Required Checks',
  'Acceptance Check',
]) {
  assertIncludes(checklist, heading, checklistPath);
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
  'LOCAL_ONLY_REPAYMENT_WATERFALL_LOCAL_API_IMPLEMENTATION_CHECKLIST',
  'docs/whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-examples.md',
  'docs/whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-contract.md',
  'docs/whitepaper-v1-2-contract-backed-loan-repayment-waterfall-calculation-pseudocode.md',
  'docs/whitepaper-v1-2-contract-backed-loan-repayment-waterfall-fixture-matrix.md',
  'docs/smartcontractor-auth-rls-plan.md',
  'local handler only',
  'local calculation helper',
  'local idempotency helper',
  'local audit event helper',
  'local fixture replay helper',
  'POST /api/admin/contract-backed-loan/repayment-waterfall/draft',
  'request_id',
  'idempotency_key',
  'actor_profile_id',
  'project_contract_id',
  'milestone_id',
  'loan_request_id',
  'provider_terms_version',
  'calculation_input',
  'DRAFT_REPAYMENT_ALLOCATION',
  'approved_loan_repayment',
  'contractor_net_payout',
  'HOLD_FOR_PROVIDER_TERM_REVALIDATION',
  'HOLD_FOR_DISPUTE_WINDOW_REVIEW',
  'HOLD_FOR_OWNER_ACCEPTANCE_REVIEW',
  'HOLD_FOR_RETAINAGE_LIEN_REVIEW',
  'HOLD_FOR_CHANGE_ORDER_REVIEW',
  'HOLD_FOR_NEGATIVE_CONTRACTOR_PAYOUT_REVIEW',
  'HOLD_FOR_IDEMPOTENCY_REVIEW',
  'HOLD_FOR_AUTH_RLS_REVIEW',
  'LIVE_TOKEN_COLLATERAL_BLOCKED',
  'LIVE_STABLECOIN_SETTLEMENT_BLOCKED',
  'no service-role key in browser code',
  'no anonymous access',
  'no borrower-facing endpoint',
  'no contractor self-approval',
  'no RLS bypass for public clients',
  'audit_event must include request_id',
  'audit_event must include actor_profile_id',
  'audit_event must include input_hash',
  'audit_event must include output_hash',
  'audit_event must include blocked_live_gate_status',
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
  'npm run check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-implementation-checklist',
  'npm run check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-examples',
  'npm run check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-contract',
  'npm run check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-calculation-pseudocode',
  'npm run check:auth-rls-plan',
  'npm run check',
]) {
  assertIncludes(checklist, snippet, checklistPath);
}

for (const [content, snippet, label] of [
  [examples, 'GCSC Whitepaper v1.2 Contract-Backed Loan Repayment Waterfall Local API Examples', examplesPath],
  [apiContract, 'GCSC Whitepaper v1.2 Contract-Backed Loan Repayment Waterfall Local API Contract', apiContractPath],
  [pseudocode, 'GCSC Whitepaper v1.2 Contract-Backed Loan Repayment Waterfall Calculation Pseudocode', pseudocodePath],
  [fixtureMatrix, 'GCSC Whitepaper v1.2 Contract-Backed Loan Repayment Waterfall Fixture Matrix', fixtureMatrixPath],
  [authRlsPlan, 'SmartContractor Auth And RLS Plan', authRlsPlanPath],
]) {
  assertIncludes(content, snippet, label);
}

if (packageJson.scripts?.['check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-implementation-checklist'] !== 'node scripts/validate-whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-implementation-checklist.mjs') {
  fail(`${packagePath} must define check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-implementation-checklist`);
}

assertIncludes(runner, '"check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-implementation-checklist"', runnerPath);
assertIncludes(ciWorkflowValidator, "'check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-implementation-checklist'", ciWorkflowValidatorPath);
assertIncludes(context, 'Whitepaper v1.2 contract-backed loan repayment waterfall local API implementation checklist', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-implementation-checklist', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan repayment waterfall local API implementation checklist', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-implementation-checklist', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan repayment waterfall local API implementation checklist', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(checklist)) {
  fail('Repayment waterfall local API implementation checklist must not contain secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  repayment_waterfall_local_api_implementation_checklist: checklistPath,
  implementation_checks_checked: 6,
  safety_boundaries_checked: true,
}, null, 2));
