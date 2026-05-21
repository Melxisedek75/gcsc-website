import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  ADVERSE_ACTION_DECISION_TYPES,
  ADVERSE_ACTION_REQUIRED_FIELDS,
  BLOCKED_ADVERSE_ACTION_FLAGS,
  DEMO_ADVERSE_ACTION_NOTICE_FIXTURE,
  createAdverseActionNoticeState,
} from '../src/smart-contracts/state/adverseActionNoticeState.mjs';

const helperPath = resolve('src', 'smart-contracts', 'state', 'adverseActionNoticeState.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract adverse-action state local validation failed: ${message}`);
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
  'ADVERSE_ACTION_DECISION_TYPES',
  'ADVERSE_ACTION_REQUIRED_FIELDS',
  'BLOCKED_ADVERSE_ACTION_FLAGS',
  'createAdverseActionNoticeState',
  'DEMO_ADVERSE_ACTION_NOTICE_FIXTURE',
  'HOLD_FOR_ADVERSE_ACTION_REVIEW',
  'LOCAL_DRAFT_ADVERSE_ACTION_TRACE',
  'BLOCKED_FOR_LIVE_LOAN',
  'local_only',
  'send_notice_allowed',
  'deny_real_credit_allowed',
  'approve_real_credit_allowed',
  'credit_bureau_reporting_allowed',
  'legal_determination_allowed',
  'provider_obligation_allowed',
  'repayment_routing_allowed',
  'escrow_activation_allowed',
  'stablecoin_settlement_allowed',
  'token_collateral_lock_allowed',
  'real_lending_launch_allowed',
  'ai_final_decision_allowed',
]) assertIncludes(helper, required, helperPath);

if (!ADVERSE_ACTION_DECISION_TYPES.includes('DECLINED')) fail('DECLINED decision type must exist');
if (!ADVERSE_ACTION_DECISION_TYPES.includes('HELD')) fail('HELD decision type must exist');
if (!ADVERSE_ACTION_DECISION_TYPES.includes('REDUCED')) fail('REDUCED decision type must exist');

for (const field of ADVERSE_ACTION_REQUIRED_FIELDS) {
  if (!Object.hasOwn(DEMO_ADVERSE_ACTION_NOTICE_FIXTURE, field)) fail(`Demo adverse-action fixture is missing ${field}`);
}

if (!DEMO_ADVERSE_ACTION_NOTICE_FIXTURE.local_only) fail('Demo adverse-action fixture must be local_only');
if (DEMO_ADVERSE_ACTION_NOTICE_FIXTURE.deployment_status !== 'BLOCKED_FOR_LIVE') fail('Demo adverse-action fixture must be BLOCKED_FOR_LIVE');
if (DEMO_ADVERSE_ACTION_NOTICE_FIXTURE.local_draft_output !== 'LOCAL_DRAFT_ADVERSE_ACTION_TRACE') fail('Demo fixture must create a local adverse-action trace only');
if (DEMO_ADVERSE_ACTION_NOTICE_FIXTURE.required_local_result !== 'HOLD_FOR_ADVERSE_ACTION_REVIEW') fail('Demo fixture must hold for adverse-action review');
if (DEMO_ADVERSE_ACTION_NOTICE_FIXTURE.blocked_live_gate_status !== 'BLOCKED_FOR_LIVE_LOAN') fail('Demo fixture must block live loans');

for (const [flag, value] of Object.entries(BLOCKED_ADVERSE_ACTION_FLAGS)) {
  if (value !== false) fail(`${flag} must be false`);
  if (DEMO_ADVERSE_ACTION_NOTICE_FIXTURE[flag] !== false) fail(`Demo fixture ${flag} must be false`);
}

try {
  createAdverseActionNoticeState({ ...DEMO_ADVERSE_ACTION_NOTICE_FIXTURE, principal_reasons: [] });
  fail('Adverse-action notice state must reject missing principal reasons');
} catch (error) {
  if (!String(error.message).includes('principal_reasons')) fail('Missing principal reasons error must name principal_reasons');
}

try {
  createAdverseActionNoticeState({ ...DEMO_ADVERSE_ACTION_NOTICE_FIXTURE, data_sources_used: [] });
  fail('Adverse-action notice state must reject missing data sources');
} catch (error) {
  if (!String(error.message).includes('data_sources_used')) fail('Missing data sources error must name data_sources_used');
}

try {
  createAdverseActionNoticeState({ ...DEMO_ADVERSE_ACTION_NOTICE_FIXTURE, decision_type: 'APPROVED' });
  fail('Adverse-action notice state must reject unsupported decision types');
} catch (error) {
  if (!String(error.message).includes('decision_type')) fail('Unsupported decision type error must name decision_type');
}

try {
  createAdverseActionNoticeState({ ...DEMO_ADVERSE_ACTION_NOTICE_FIXTURE, notice_template_version: 'sk_live_demo_secret_value' });
  fail('Adverse-action notice state must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract adverse-action state local helper', contextPath);
assertIncludes(context, 'check:smart-contract-adverse-action-state-local', contextPath);
assertIncludes(backlog, 'Smart contract adverse-action state local helper', backlogPath);
assertIncludes(backlog, 'check:smart-contract-adverse-action-state-local', backlogPath);
assertIncludes(realAudit, 'Smart contract adverse-action state local helper', realAuditPath);

const scriptName = 'check:smart-contract-adverse-action-state-local';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

if (/sk_live_[a-z0-9]{12,}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(helper)) {
  fail('Adverse-action state helper must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_adverse_action_state_local_helper: helperPath,
  decision_types_checked: ADVERSE_ACTION_DECISION_TYPES.length,
  blocked_adverse_action_flags_checked: Object.keys(BLOCKED_ADVERSE_ACTION_FLAGS).length,
}, null, 2));
