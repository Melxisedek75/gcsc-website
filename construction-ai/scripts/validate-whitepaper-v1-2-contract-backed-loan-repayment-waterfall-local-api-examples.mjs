import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

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
  'GCSC Whitepaper v1.2 Contract-Backed Loan Repayment Waterfall Local API Examples',
  'Status: LOCAL_ONLY_REPAYMENT_WATERFALL_LOCAL_API_EXAMPLES',
  'Purpose',
  'Linked Inputs',
  'Example Data Rules',
  'Example 1: Happy Path Draft Allocation',
  'Example 2: Missing Provider Terms Hold',
  'Example 3: Active Dispute Hold',
  'Example 4: Idempotency Mismatch Hold',
  'Example 5: Token Collateral Or Stablecoin Block',
  'Example 6: Auth/RLS Hold',
  'Blocked Live Actions',
  'Required Checks',
  'Acceptance Check',
]) {
  assertIncludes(examples, heading, examplesPath);
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
  'LOCAL_ONLY_REPAYMENT_WATERFALL_LOCAL_API_EXAMPLES',
  'docs/whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-contract.md',
  'docs/whitepaper-v1-2-contract-backed-loan-repayment-waterfall-calculation-pseudocode.md',
  'docs/whitepaper-v1-2-contract-backed-loan-repayment-waterfall-fixture-matrix.md',
  'docs/smartcontractor-auth-rls-plan.md',
  'example_request',
  'example_response',
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
  'audit_event_id',
  'HOLD_FOR_PROVIDER_TERM_REVALIDATION',
  'HOLD_FOR_DISPUTE_WINDOW_REVIEW',
  'HOLD_FOR_IDEMPOTENCY_REVIEW',
  'LIVE_TOKEN_COLLATERAL_BLOCKED',
  'LIVE_STABLECOIN_SETTLEMENT_BLOCKED',
  'HOLD_FOR_AUTH_RLS_REVIEW',
  'BLOCKED_FOR_LIVE',
  'LIVE_REPAYMENT_ROUTING_BLOCKED',
  'LIVE_ESCROW_CUSTODY_BLOCKED',
  'AI_FINAL_APPROVAL_BLOCKED',
  'placeholder-only',
  'no real customer names',
  'no real bank details',
  'no real wallet secrets',
  'no provider credentials',
  'no live payment instructions',
  'real loan origination',
  'real escrow',
  'real repayment routing',
  'provider API calls',
  'stablecoin settlement',
  'token collateral',
  'production money movement',
  'npm run check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-examples',
  'npm run check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-contract',
  'npm run check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-calculation-pseudocode',
  'npm run check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-fixture-matrix',
  'npm run check:auth-rls-plan',
  'npm run check',
]) {
  assertIncludes(examples, snippet, examplesPath);
}

for (const [content, snippet, label] of [
  [apiContract, 'GCSC Whitepaper v1.2 Contract-Backed Loan Repayment Waterfall Local API Contract', apiContractPath],
  [pseudocode, 'GCSC Whitepaper v1.2 Contract-Backed Loan Repayment Waterfall Calculation Pseudocode', pseudocodePath],
  [fixtureMatrix, 'GCSC Whitepaper v1.2 Contract-Backed Loan Repayment Waterfall Fixture Matrix', fixtureMatrixPath],
  [authRlsPlan, 'SmartContractor Auth And RLS Plan', authRlsPlanPath],
]) {
  assertIncludes(content, snippet, label);
}

if (packageJson.scripts?.['check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-examples'] !== 'node scripts/validate-whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-examples.mjs') {
  fail(`${packagePath} must define check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-examples`);
}

assertIncludes(runner, '"check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-examples"', runnerPath);
assertIncludes(ciWorkflowValidator, "'check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-examples'", ciWorkflowValidatorPath);
assertIncludes(context, 'Whitepaper v1.2 contract-backed loan repayment waterfall local API examples', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-examples', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan repayment waterfall local API examples', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-examples', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan repayment waterfall local API examples', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(examples)) {
  fail('Repayment waterfall local API examples must not contain secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  repayment_waterfall_local_api_examples: examplesPath,
  examples_checked: 6,
  safety_boundaries_checked: true,
}, null, 2));
