import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  applyEscrowMilestoneTransition,
  BLOCKED_ESCROW_FLAGS,
  DEMO_ESCROW_RELEASE_RECOMMENDATION_FIXTURE,
  ESCROW_MILESTONE_ACTIONS,
  ESCROW_MILESTONE_STATES,
  REQUIRED_ESCROW_MILESTONE_FIELDS,
} from '../src/smart-contracts/state/escrowMilestoneState.mjs';

const helperPath = resolve('src', 'smart-contracts', 'state', 'escrowMilestoneState.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract escrow state local validation failed: ${message}`);
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
  'ESCROW_MILESTONE_STATES',
  'ESCROW_MILESTONE_ACTIONS',
  'REQUIRED_ESCROW_MILESTONE_FIELDS',
  'BLOCKED_ESCROW_FLAGS',
  'applyEscrowMilestoneTransition',
  'DEMO_ESCROW_RELEASE_RECOMMENDATION_FIXTURE',
  'release_recommendation_only',
  'BLOCKED_FOR_LIVE',
  'local_only',
  'real_escrow_allowed',
  'real_payment_allowed',
  'automatic_payment_release_allowed',
  'escrow_agent_claim_allowed',
  'provider_money_movement_allowed',
  'stablecoin_settlement_allowed',
  'repayment_routing_allowed',
  'ai_final_authority_allowed',
]) assertIncludes(helper, required, helperPath);

if (ESCROW_MILESTONE_STATES.length < 10) fail('Escrow milestone state list is unexpectedly short');
if (!ESCROW_MILESTONE_STATES.includes('release_recommended')) fail('release_recommended state must exist');
if (!ESCROW_MILESTONE_ACTIONS.includes('recommend_release')) fail('recommend_release action must exist');

for (const field of REQUIRED_ESCROW_MILESTONE_FIELDS) {
  if (!Object.hasOwn(DEMO_ESCROW_RELEASE_RECOMMENDATION_FIXTURE, field)) fail(`Demo escrow fixture is missing ${field}`);
}

if (!DEMO_ESCROW_RELEASE_RECOMMENDATION_FIXTURE.local_only) fail('Demo escrow fixture must be local_only');
if (DEMO_ESCROW_RELEASE_RECOMMENDATION_FIXTURE.deployment_status !== 'BLOCKED_FOR_LIVE') fail('Demo escrow fixture must be BLOCKED_FOR_LIVE');
if (!DEMO_ESCROW_RELEASE_RECOMMENDATION_FIXTURE.release_recommendation_only) fail('Demo escrow fixture must be recommendation-only');

for (const [flag, value] of Object.entries(BLOCKED_ESCROW_FLAGS)) {
  if (value !== false) fail(`${flag} must be false`);
  if (DEMO_ESCROW_RELEASE_RECOMMENDATION_FIXTURE[flag] !== false) fail(`Demo fixture ${flag} must be false`);
}

try {
  applyEscrowMilestoneTransition({ ...DEMO_ESCROW_RELEASE_RECOMMENDATION_FIXTURE, request_id: '' });
  fail('Escrow milestone transition must reject missing request_id');
} catch (error) {
  if (!String(error.message).includes('request_id')) fail('Missing request_id error must name request_id');
}

try {
  applyEscrowMilestoneTransition({ ...DEMO_ESCROW_RELEASE_RECOMMENDATION_FIXTURE, evidence_id: 'sk_live_demo_secret_value' });
  fail('Escrow milestone transition must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

try {
  applyEscrowMilestoneTransition({ ...DEMO_ESCROW_RELEASE_RECOMMENDATION_FIXTURE, action: 'release_funds' });
  fail('Escrow milestone transition must reject invalid actions');
} catch (error) {
  if (!String(error.message).includes('action')) fail('Invalid action error must name action');
}

try {
  applyEscrowMilestoneTransition({
    ...DEMO_ESCROW_RELEASE_RECOMMENDATION_FIXTURE,
    previous_state: 'active',
    next_state: 'completed',
  });
  fail('Escrow milestone transition must reject invalid state changes');
} catch (error) {
  if (!String(error.message).includes('transition')) fail('Invalid transition error must name transition');
}

assertIncludes(context, 'Smart contract escrow state local helper', contextPath);
assertIncludes(context, 'check:smart-contract-escrow-state-local', contextPath);
assertIncludes(backlog, 'Smart contract escrow state local helper', backlogPath);
assertIncludes(backlog, 'check:smart-contract-escrow-state-local', backlogPath);
assertIncludes(realAudit, 'Smart contract escrow state local helper', realAuditPath);

const scriptName = 'check:smart-contract-escrow-state-local';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

if (/sk_live_[a-z0-9]{12,}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(helper)) {
  fail('Escrow state helper must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_escrow_state_local_helper: helperPath,
  states_checked: ESCROW_MILESTONE_STATES.length,
  blocked_escrow_flags_checked: Object.keys(BLOCKED_ESCROW_FLAGS).length,
}, null, 2));
