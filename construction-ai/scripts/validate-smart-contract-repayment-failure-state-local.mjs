import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  BLOCKED_REPAYMENT_FAILURE_FLAGS,
  DEMO_REPAYMENT_FAILURE_STATE_FIXTURE,
  REPAYMENT_FAILURE_REQUIRED_FIELDS,
  REPAYMENT_FAILURE_STATES,
  createRepaymentFailureState,
} from '../src/smart-contracts/state/repaymentFailureState.mjs';

const helperPath = resolve('src', 'smart-contracts', 'state', 'repaymentFailureState.mjs');
const matrixPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-repayment-failure-state-matrix.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract repayment failure state local validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const helper = readRequired(helperPath);
const matrix = readRequired(matrixPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realAudit = readRequired(realAuditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciValidator = readRequired(ciValidatorPath);

for (const required of [
  'REPAYMENT_FAILURE_STATES',
  'REPAYMENT_FAILURE_REQUIRED_FIELDS',
  'BLOCKED_REPAYMENT_FAILURE_FLAGS',
  'createRepaymentFailureState',
  'DEMO_REPAYMENT_FAILURE_STATE_FIXTURE',
  'LOCAL_DRAFT_FAILURE_STATE',
  'DRAFT_REPAYMENT_ALLOCATION',
  'HOLD_FOR_DISPUTE_REVIEW',
  'CAP_TO_OUTSTANDING_BALANCE',
  'HOLD_FOR_TOKEN_COLLATERAL_REVIEW',
  'BLOCKED_FOR_LIVE',
  'local_only',
  'repayment_routing_allowed',
  'escrow_release_allowed',
  'stablecoin_settlement_allowed',
  'token_collateral_lock_allowed',
  'provider_api_calls_allowed',
  'ai_final_approval_allowed',
  'production_money_movement_allowed',
]) assertIncludes(helper, required, helperPath);

if (REPAYMENT_FAILURE_STATES.length < 10) fail('Repayment failure state list is unexpectedly short');
if (!REPAYMENT_FAILURE_STATES.includes('ACTIVE_DISPUTE')) fail('ACTIVE_DISPUTE failure state must exist');
if (!REPAYMENT_FAILURE_STATES.includes('OVER_REPAYMENT_REQUEST')) fail('OVER_REPAYMENT_REQUEST failure state must exist');

for (const field of REPAYMENT_FAILURE_REQUIRED_FIELDS) {
  if (!Object.hasOwn(DEMO_REPAYMENT_FAILURE_STATE_FIXTURE, field)) {
    fail(`Demo repayment failure fixture is missing ${field}`);
  }
}

if (!DEMO_REPAYMENT_FAILURE_STATE_FIXTURE.local_only) fail('Demo repayment failure fixture must be local_only');
if (DEMO_REPAYMENT_FAILURE_STATE_FIXTURE.deployment_status !== 'BLOCKED_FOR_LIVE') {
  fail('Demo repayment failure fixture must be BLOCKED_FOR_LIVE');
}
if (DEMO_REPAYMENT_FAILURE_STATE_FIXTURE.local_draft_output !== 'LOCAL_DRAFT_FAILURE_STATE') {
  fail('Demo repayment failure fixture must expose LOCAL_DRAFT_FAILURE_STATE');
}
if (DEMO_REPAYMENT_FAILURE_STATE_FIXTURE.draft_allocation_status !== 'DRAFT_REPAYMENT_ALLOCATION') {
  fail('Demo repayment failure fixture must expose DRAFT_REPAYMENT_ALLOCATION');
}

for (const [flag, value] of Object.entries(BLOCKED_REPAYMENT_FAILURE_FLAGS)) {
  if (value !== false) fail(`${flag} must be false`);
  if (DEMO_REPAYMENT_FAILURE_STATE_FIXTURE[flag] !== false) fail(`Demo fixture ${flag} must be false`);
}

try {
  createRepaymentFailureState({ ...DEMO_REPAYMENT_FAILURE_STATE_FIXTURE, request_id: '' });
  fail('Repayment failure state must reject missing request_id');
} catch (error) {
  if (!String(error.message).includes('request_id')) fail('Missing request_id error must name request_id');
}

try {
  createRepaymentFailureState({ ...DEMO_REPAYMENT_FAILURE_STATE_FIXTURE, failure_state: 'LIVE_REPAYMENT_SENT' });
  fail('Repayment failure state must reject unsupported failure_state');
} catch (error) {
  if (!String(error.message).includes('failure_state')) fail('Unsupported failure_state error must name failure_state');
}

try {
  createRepaymentFailureState({
    ...DEMO_REPAYMENT_FAILURE_STATE_FIXTURE,
    evidence_reference: 'sk_live_demo_secret_value',
  });
  fail('Repayment failure state must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(matrix, 'Failure State Matrix', matrixPath);
assertIncludes(matrix, 'BLOCKED_FOR_LIVE', matrixPath);
assertIncludes(context, 'Smart contract repayment failure state local helper', contextPath);
assertIncludes(context, 'check:smart-contract-repayment-failure-state-local', contextPath);
assertIncludes(backlog, 'Smart contract repayment failure state local helper', backlogPath);
assertIncludes(backlog, 'check:smart-contract-repayment-failure-state-local', backlogPath);
assertIncludes(realAudit, 'Smart contract repayment failure state local helper', realAuditPath);

const scriptName = 'check:smart-contract-repayment-failure-state-local';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

if (/sk_live_[a-z0-9]{12,}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(helper)) {
  fail('Repayment failure state helper must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_repayment_failure_state_local_helper: helperPath,
  failure_states_checked: REPAYMENT_FAILURE_STATES.length,
  blocked_repayment_failure_flags_checked: Object.keys(BLOCKED_REPAYMENT_FAILURE_FLAGS).length,
}, null, 2));
