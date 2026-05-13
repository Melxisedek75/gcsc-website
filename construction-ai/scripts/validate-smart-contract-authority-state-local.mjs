import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  applyAuthorityTransition,
  AUTHORITY_ACTIONS,
  AUTHORITY_MODULES,
  BLOCKED_AUTHORITY_FLAGS,
  DEMO_AUTHORITY_PAUSE_FIXTURE,
  REQUIRED_AUTHORITY_EVENT_FIELDS,
} from '../src/smart-contracts/state/authorityControlState.mjs';

const helperPath = resolve('src', 'smart-contracts', 'state', 'authorityControlState.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract authority state local validation failed: ${message}`);
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
  'REQUIRED_AUTHORITY_EVENT_FIELDS',
  'AUTHORITY_MODULES',
  'AUTHORITY_ACTIONS',
  'BLOCKED_AUTHORITY_FLAGS',
  'applyAuthorityTransition',
  'DEMO_AUTHORITY_PAUSE_FIXTURE',
  'BLOCKED_FOR_LIVE',
  'local_only',
  'live_xpr_permission_change_allowed',
  'setcode_allowed',
  'setabi_allowed',
  'updateauth_allowed',
  'linkauth_allowed',
  'single_key_production_authority_allowed',
  'unreviewed_upgrade_allowed',
  'money_movement_allowed',
  'ai_final_authority_allowed',
]) assertIncludes(helper, required, helperPath);

if (REQUIRED_AUTHORITY_EVENT_FIELDS.length < 9) fail('Required authority event field list is unexpectedly short');
if (!AUTHORITY_MODULES.includes('project_escrow')) fail('project_escrow module must be allowed for local authority state');
if (!AUTHORITY_ACTIONS.includes('record_emergency_pause')) fail('record_emergency_pause action must be allowed');

for (const field of REQUIRED_AUTHORITY_EVENT_FIELDS) {
  if (!Object.hasOwn(DEMO_AUTHORITY_PAUSE_FIXTURE, field)) fail(`Demo authority fixture is missing ${field}`);
}

if (!DEMO_AUTHORITY_PAUSE_FIXTURE.local_only) fail('Demo authority fixture must be local_only');
if (DEMO_AUTHORITY_PAUSE_FIXTURE.deployment_status !== 'BLOCKED_FOR_LIVE') fail('Demo authority fixture must be BLOCKED_FOR_LIVE');

for (const [flag, value] of Object.entries(BLOCKED_AUTHORITY_FLAGS)) {
  if (value !== false) fail(`${flag} must be false`);
  if (DEMO_AUTHORITY_PAUSE_FIXTURE[flag] !== false) fail(`Demo fixture ${flag} must be false`);
}

try {
  applyAuthorityTransition({ ...DEMO_AUTHORITY_PAUSE_FIXTURE, request_id: '' });
  fail('Authority transition must reject missing request_id');
} catch (error) {
  if (!String(error.message).includes('request_id')) fail('Missing request_id error must name request_id');
}

try {
  applyAuthorityTransition({ ...DEMO_AUTHORITY_PAUSE_FIXTURE, actor_role: 'sk_live_demo_secret_value' });
  fail('Authority transition must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

try {
  applyAuthorityTransition({ ...DEMO_AUTHORITY_PAUSE_FIXTURE, module: 'live_permission_update' });
  fail('Authority transition must reject invalid modules');
} catch (error) {
  if (!String(error.message).includes('module')) fail('Invalid module error must name module');
}

try {
  applyAuthorityTransition({
    ...DEMO_AUTHORITY_PAUSE_FIXTURE,
    action: 'request_unpause',
    previous_state: 'active',
    next_state: 'active',
  });
  fail('Authority transition must reject invalid state changes');
} catch (error) {
  if (!String(error.message).includes('transition')) fail('Invalid transition error must name transition');
}

assertIncludes(context, 'Smart contract authority state local helper', contextPath);
assertIncludes(context, 'check:smart-contract-authority-state-local', contextPath);
assertIncludes(backlog, 'Smart contract authority state local helper', backlogPath);
assertIncludes(backlog, 'check:smart-contract-authority-state-local', backlogPath);
assertIncludes(realAudit, 'Smart contract authority state local helper', realAuditPath);

const scriptName = 'check:smart-contract-authority-state-local';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

if (/sk_live_[a-z0-9]{12,}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(helper)) {
  fail('Authority state helper must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_authority_state_local_helper: helperPath,
  required_fields_checked: REQUIRED_AUTHORITY_EVENT_FIELDS.length,
  blocked_authority_flags_checked: Object.keys(BLOCKED_AUTHORITY_FLAGS).length,
}, null, 2));
