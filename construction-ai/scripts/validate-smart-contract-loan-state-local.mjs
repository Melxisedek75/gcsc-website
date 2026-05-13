import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  applyLoanLedgerTransition,
  BLOCKED_LOAN_FLAGS,
  DEMO_LOAN_REPAYMENT_WATERFALL_FIXTURE,
  LOAN_LEDGER_ACTIONS,
  LOAN_LEDGER_STATES,
  REQUIRED_LOAN_LEDGER_FIELDS,
} from '../src/smart-contracts/state/loanLedgerState.mjs';

const helperPath = resolve('src', 'smart-contracts', 'state', 'loanLedgerState.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract loan state local validation failed: ${message}`);
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
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realAudit = readRequired(realAuditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciValidator = readRequired(ciValidatorPath);

for (const required of [
  'LOAN_LEDGER_STATES',
  'LOAN_LEDGER_ACTIONS',
  'REQUIRED_LOAN_LEDGER_FIELDS',
  'BLOCKED_LOAN_FLAGS',
  'applyLoanLedgerTransition',
  'DEMO_LOAN_REPAYMENT_WATERFALL_FIXTURE',
  'receivables_fixture_only',
  'repayment_waterfall_label_only',
  'BLOCKED_FOR_LIVE',
  'local_only',
  'real_loan_allowed',
  'loan_origination_allowed',
  'provider_underwriting_allowed',
  'borrower_obligation_allowed',
  'lender_or_bank_claim_allowed',
  'real_payment_allowed',
  'repayment_routing_allowed',
  'real_escrow_allowed',
  'stablecoin_settlement_allowed',
  'token_collateral_liquidation_allowed',
  'ai_final_authority_allowed',
]) assertIncludes(helper, required, helperPath);

if (LOAN_LEDGER_STATES.length < 10) fail('Loan ledger state list is unexpectedly short');
if (!LOAN_LEDGER_STATES.includes('repayment_event_recorded')) fail('repayment_event_recorded state must exist');
if (!LOAN_LEDGER_ACTIONS.includes('record_repayment_event')) fail('record_repayment_event action must exist');

for (const field of REQUIRED_LOAN_LEDGER_FIELDS) {
  if (!Object.hasOwn(DEMO_LOAN_REPAYMENT_WATERFALL_FIXTURE, field)) fail(`Demo loan fixture is missing ${field}`);
}

if (!DEMO_LOAN_REPAYMENT_WATERFALL_FIXTURE.local_only) fail('Demo loan fixture must be local_only');
if (DEMO_LOAN_REPAYMENT_WATERFALL_FIXTURE.deployment_status !== 'BLOCKED_FOR_LIVE') fail('Demo loan fixture must be BLOCKED_FOR_LIVE');
if (!DEMO_LOAN_REPAYMENT_WATERFALL_FIXTURE.receivables_fixture_only) fail('Demo loan fixture must be receivables fixture only');
if (!DEMO_LOAN_REPAYMENT_WATERFALL_FIXTURE.repayment_waterfall_label_only) fail('Demo loan fixture must be repayment waterfall label only');

for (const [flag, value] of Object.entries(BLOCKED_LOAN_FLAGS)) {
  if (value !== false) fail(`${flag} must be false`);
  if (DEMO_LOAN_REPAYMENT_WATERFALL_FIXTURE[flag] !== false) fail(`Demo fixture ${flag} must be false`);
}

try {
  applyLoanLedgerTransition({ ...DEMO_LOAN_REPAYMENT_WATERFALL_FIXTURE, request_id: '' });
  fail('Loan ledger transition must reject missing request_id');
} catch (error) {
  if (!String(error.message).includes('request_id')) fail('Missing request_id error must name request_id');
}

try {
  applyLoanLedgerTransition({ ...DEMO_LOAN_REPAYMENT_WATERFALL_FIXTURE, signed_contract_receivable_id: 'sk_live_demo_secret_value' });
  fail('Loan ledger transition must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

try {
  applyLoanLedgerTransition({ ...DEMO_LOAN_REPAYMENT_WATERFALL_FIXTURE, action: 'originate_real_loan' });
  fail('Loan ledger transition must reject invalid actions');
} catch (error) {
  if (!String(error.message).includes('action')) fail('Invalid action error must name action');
}

try {
  applyLoanLedgerTransition({
    ...DEMO_LOAN_REPAYMENT_WATERFALL_FIXTURE,
    previous_state: 'requested',
    next_state: 'repaid_label',
  });
  fail('Loan ledger transition must reject invalid state changes');
} catch (error) {
  if (!String(error.message).includes('transition')) fail('Invalid transition error must name transition');
}

assertIncludes(context, 'Smart contract loan state local helper', contextPath);
assertIncludes(context, 'check:smart-contract-loan-state-local', contextPath);
assertIncludes(backlog, 'Smart contract loan state local helper', backlogPath);
assertIncludes(backlog, 'check:smart-contract-loan-state-local', backlogPath);
assertIncludes(realAudit, 'Smart contract loan state local helper', realAuditPath);

const scriptName = 'check:smart-contract-loan-state-local';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

if (/sk_live_[a-z0-9]{12,}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(helper)) {
  fail('Loan state helper must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_loan_state_local_helper: helperPath,
  states_checked: LOAN_LEDGER_STATES.length,
  blocked_loan_flags_checked: Object.keys(BLOCKED_LOAN_FLAGS).length,
}, null, 2));
