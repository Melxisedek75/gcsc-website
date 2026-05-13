import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  ALLOWED_MODULES,
  BLOCKED_LIVE_RISK_FLAGS,
  DEMO_AUDIT_EVENT_FIXTURE,
  REQUIRED_AUDIT_EVENT_FIELDS,
  serializeSmartContractAuditEvent,
} from '../src/smart-contracts/serialization/auditEventSerialization.mjs';

const helperPath = resolve('src', 'smart-contracts', 'serialization', 'auditEventSerialization.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract audit serialization local validation failed: ${message}`);
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
  'REQUIRED_AUDIT_EVENT_FIELDS',
  'ALLOWED_MODULES',
  'BLOCKED_LIVE_RISK_FLAGS',
  'serializeSmartContractAuditEvent',
  'DEMO_AUDIT_EVENT_FIXTURE',
  'BLOCKED_FOR_LIVE',
  'local_only',
  'money_movement_allowed',
  'live_xpr_deployment_allowed',
  'real_payment_allowed',
  'real_loan_allowed',
  'real_escrow_allowed',
  'repayment_routing_allowed',
  'token_collateral_liquidation_allowed',
  'stablecoin_settlement_allowed',
  'ai_final_authority_allowed',
]) assertIncludes(helper, required, helperPath);

if (REQUIRED_AUDIT_EVENT_FIELDS.length < 10) fail('Required audit event field list is unexpectedly short');
if (!ALLOWED_MODULES.includes('backend_to_chain_map')) fail('backend_to_chain_map module must be allowed for local serialization');

for (const field of REQUIRED_AUDIT_EVENT_FIELDS) {
  if (!Object.hasOwn(DEMO_AUDIT_EVENT_FIXTURE, field)) fail(`Demo audit event fixture is missing ${field}`);
}

if (!DEMO_AUDIT_EVENT_FIXTURE.local_only) fail('Demo audit event fixture must be local_only');
if (DEMO_AUDIT_EVENT_FIXTURE.deployment_status !== 'BLOCKED_FOR_LIVE') fail('Demo audit event fixture must be BLOCKED_FOR_LIVE');
if (DEMO_AUDIT_EVENT_FIXTURE.money_movement_allowed !== false) fail('Demo audit event fixture must not allow money movement');

for (const [flag, value] of Object.entries(BLOCKED_LIVE_RISK_FLAGS)) {
  if (value !== false) fail(`${flag} must be false`);
  if (DEMO_AUDIT_EVENT_FIXTURE[flag] !== false) fail(`Demo fixture ${flag} must be false`);
}

try {
  serializeSmartContractAuditEvent({ ...DEMO_AUDIT_EVENT_FIXTURE, request_id: '' });
  fail('Serializer must reject missing request_id');
} catch (error) {
  if (!String(error.message).includes('request_id')) fail('Missing request_id error must name request_id');
}

try {
  serializeSmartContractAuditEvent({ ...DEMO_AUDIT_EVENT_FIXTURE, actor_account: 'sk_live_demo_secret_value' });
  fail('Serializer must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract audit serialization local helper', contextPath);
assertIncludes(context, 'check:smart-contract-audit-serialization-local', contextPath);
assertIncludes(backlog, 'Smart contract audit serialization local helper', backlogPath);
assertIncludes(backlog, 'check:smart-contract-audit-serialization-local', backlogPath);
assertIncludes(realAudit, 'Smart contract audit serialization local helper', realAuditPath);

const scriptName = 'check:smart-contract-audit-serialization-local';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

if (/sk_live_[a-z0-9]{12,}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(helper)) {
  fail('Audit serialization helper must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_audit_serialization_local_helper: helperPath,
  required_fields_checked: REQUIRED_AUDIT_EVENT_FIELDS.length,
  blocked_live_risk_flags_checked: Object.keys(BLOCKED_LIVE_RISK_FLAGS).length,
}, null, 2));
