import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  applyCollateralEstimateTransition,
  BLOCKED_COLLATERAL_FLAGS,
  COLLATERAL_ESTIMATE_ACTIONS,
  COLLATERAL_ESTIMATE_STATES,
  DEMO_COLLATERAL_LTV_FIXTURE,
  REQUIRED_COLLATERAL_ESTIMATE_FIELDS,
} from '../src/smart-contracts/state/collateralEstimateState.mjs';

const helperPath = resolve('src', 'smart-contracts', 'state', 'collateralEstimateState.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract collateral state local validation failed: ${message}`);
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
  'COLLATERAL_ESTIMATE_STATES',
  'COLLATERAL_ESTIMATE_ACTIONS',
  'REQUIRED_COLLATERAL_ESTIMATE_FIELDS',
  'BLOCKED_COLLATERAL_FLAGS',
  'applyCollateralEstimateTransition',
  'DEMO_COLLATERAL_LTV_FIXTURE',
  'estimate_fixture_only',
  'ltv_label_only',
  'oracle_snapshot_placeholder_guard',
  'NO_PROVIDER_ORACLE_AUTHORITY_LOCAL_ONLY',
  'placeholder_only_no_oracle_provider',
  'ltv_basis_points_guard',
  'MAX_DEMO_LTV_BASIS_POINTS',
  'TOKEN_ESTIMATE_SOURCE_LOCAL_FIXTURE_ONLY',
  'collateral_release_review_guard',
  'RELEASE_REQUIRES_FOUNDER_LEGAL_PROVIDER_REVIEW',
  'collateral_provider_review_guard',
  'LEGAL_AND_FINANCE_PROVIDER_REVIEW_REQUIRED',
  'liquidation_blocked',
  'BLOCKED_FOR_LIVE',
  'local_only',
  'real_token_lock_allowed',
  'token_custody_allowed',
  'margin_call_allowed',
  'auto_liquidation_allowed',
  'token_collateral_liquidation_allowed',
  'oracle_price_authority_allowed',
  'real_payment_allowed',
  'real_loan_allowed',
  'stablecoin_settlement_allowed',
  'ai_final_authority_allowed',
]) assertIncludes(helper, required, helperPath);

if (COLLATERAL_ESTIMATE_STATES.length < 8) fail('Collateral estimate state list is unexpectedly short');
if (!COLLATERAL_ESTIMATE_STATES.includes('liquidation_blocked')) fail('liquidation_blocked state must exist');
if (!COLLATERAL_ESTIMATE_ACTIONS.includes('ltvcheck')) fail('ltvcheck action must exist');

for (const field of REQUIRED_COLLATERAL_ESTIMATE_FIELDS) {
  if (!Object.hasOwn(DEMO_COLLATERAL_LTV_FIXTURE, field)) fail(`Demo collateral fixture is missing ${field}`);
}

if (!DEMO_COLLATERAL_LTV_FIXTURE.local_only) fail('Demo collateral fixture must be local_only');
if (DEMO_COLLATERAL_LTV_FIXTURE.deployment_status !== 'BLOCKED_FOR_LIVE') fail('Demo collateral fixture must be BLOCKED_FOR_LIVE');
if (!DEMO_COLLATERAL_LTV_FIXTURE.estimate_fixture_only) fail('Demo collateral fixture must be estimate fixture only');
if (!DEMO_COLLATERAL_LTV_FIXTURE.ltv_label_only) fail('Demo collateral fixture must be LTV label only');
if (!DEMO_COLLATERAL_LTV_FIXTURE.liquidation_blocked) fail('Demo collateral fixture must keep liquidation blocked');
if (DEMO_COLLATERAL_LTV_FIXTURE.oracle_snapshot_placeholder_guard !== 'NO_PROVIDER_ORACLE_AUTHORITY_LOCAL_ONLY') {
  fail('Demo collateral fixture must keep oracle snapshots as local placeholders only');
}
if (DEMO_COLLATERAL_LTV_FIXTURE.price_authority_status !== 'placeholder_only_no_oracle_provider') {
  fail('Demo collateral fixture must not claim oracle provider price authority');
}
if (!String(DEMO_COLLATERAL_LTV_FIXTURE.oracle_snapshot_placeholder_id || '').startsWith('oracle_snapshot_placeholder_')) {
  fail('Demo collateral fixture oracle placeholder id must use oracle_snapshot_placeholder_ prefix');
}
if (DEMO_COLLATERAL_LTV_FIXTURE.ltv_basis_points_guard !== 'MAX_DEMO_LTV_BASIS_POINTS') {
  fail('Demo collateral fixture must expose the local max LTV guard');
}
if (DEMO_COLLATERAL_LTV_FIXTURE.token_estimate_source !== 'TOKEN_ESTIMATE_SOURCE_LOCAL_FIXTURE_ONLY') {
  fail('Demo collateral fixture must keep token estimate source local fixture only');
}
if (DEMO_COLLATERAL_LTV_FIXTURE.ltv_basis_points < 0 || DEMO_COLLATERAL_LTV_FIXTURE.ltv_basis_points > 6500) {
  fail('Demo collateral fixture LTV basis points must stay inside local demo bounds');
}
if (DEMO_COLLATERAL_LTV_FIXTURE.collateral_release_review_guard !== 'RELEASE_REQUIRES_FOUNDER_LEGAL_PROVIDER_REVIEW') {
  fail('Demo collateral fixture must keep release review founder/legal/provider-gated');
}
if (DEMO_COLLATERAL_LTV_FIXTURE.release_status !== 'release_requires_founder_legal_provider_review') {
  fail('Demo collateral fixture release status must require founder/legal/provider review');
}
if (DEMO_COLLATERAL_LTV_FIXTURE.collateral_provider_review_guard !== 'LEGAL_AND_FINANCE_PROVIDER_REVIEW_REQUIRED') {
  fail('Demo collateral fixture must keep legal and finance provider review required');
}
if (DEMO_COLLATERAL_LTV_FIXTURE.legal_provider_status !== 'required') {
  fail('Demo collateral fixture legal provider status must remain required');
}
if (DEMO_COLLATERAL_LTV_FIXTURE.finance_provider_status !== 'required') {
  fail('Demo collateral fixture finance provider status must remain required');
}

for (const [flag, value] of Object.entries(BLOCKED_COLLATERAL_FLAGS)) {
  if (value !== false) fail(`${flag} must be false`);
  if (DEMO_COLLATERAL_LTV_FIXTURE[flag] !== false) fail(`Demo fixture ${flag} must be false`);
}

try {
  applyCollateralEstimateTransition({ ...DEMO_COLLATERAL_LTV_FIXTURE, request_id: '' });
  fail('Collateral estimate transition must reject missing request_id');
} catch (error) {
  if (!String(error.message).includes('request_id')) fail('Missing request_id error must name request_id');
}

try {
  applyCollateralEstimateTransition({ ...DEMO_COLLATERAL_LTV_FIXTURE, oracle_snapshot_placeholder_id: 'sk_live_demo_secret_value' });
  fail('Collateral estimate transition must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

try {
  applyCollateralEstimateTransition({ ...DEMO_COLLATERAL_LTV_FIXTURE, action: 'liquidate_real_tokens' });
  fail('Collateral estimate transition must reject invalid actions');
} catch (error) {
  if (!String(error.message).includes('action')) fail('Invalid action error must name action');
}

try {
  applyCollateralEstimateTransition({
    ...DEMO_COLLATERAL_LTV_FIXTURE,
    previous_state: 'draft',
    next_state: 'ltv_checked',
  });
  fail('Collateral estimate transition must reject invalid state changes');
} catch (error) {
  if (!String(error.message).includes('transition')) fail('Invalid transition error must name transition');
}

try {
  applyCollateralEstimateTransition({ ...DEMO_COLLATERAL_LTV_FIXTURE, ltv_basis_points: 9000 });
  fail('Collateral estimate transition must reject out-of-bounds LTV basis points');
} catch (error) {
  if (!String(error.message).includes('LTV basis points')) fail('Invalid LTV error must name LTV basis points');
}

try {
  applyCollateralEstimateTransition({ ...DEMO_COLLATERAL_LTV_FIXTURE, release_status: 'approved_for_release' });
  fail('Collateral estimate transition must reject ungated release status');
} catch (error) {
  if (!String(error.message).includes('release status')) fail('Invalid release status error must name release status');
}

try {
  applyCollateralEstimateTransition({ ...DEMO_COLLATERAL_LTV_FIXTURE, legal_provider_status: 'approved' });
  fail('Collateral estimate transition must reject approved legal provider status');
} catch (error) {
  if (!String(error.message).includes('provider status')) fail('Invalid legal provider status error must name provider status');
}

try {
  applyCollateralEstimateTransition({ ...DEMO_COLLATERAL_LTV_FIXTURE, finance_provider_status: 'waived' });
  fail('Collateral estimate transition must reject waived finance provider status');
} catch (error) {
  if (!String(error.message).includes('provider status')) fail('Invalid finance provider status error must name provider status');
}

assertIncludes(context, 'Smart contract collateral state local helper', contextPath);
assertIncludes(context, 'check:smart-contract-collateral-state-local', contextPath);
assertIncludes(backlog, 'Smart contract collateral state local helper', backlogPath);
assertIncludes(backlog, 'check:smart-contract-collateral-state-local', backlogPath);
assertIncludes(realAudit, 'Smart contract collateral state local helper', realAuditPath);

const scriptName = 'check:smart-contract-collateral-state-local';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

if (/sk_live_[a-z0-9]{12,}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(helper)) {
  fail('Collateral state helper must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_collateral_state_local_helper: helperPath,
  states_checked: COLLATERAL_ESTIMATE_STATES.length,
  blocked_collateral_flags_checked: Object.keys(BLOCKED_COLLATERAL_FLAGS).length,
}, null, 2));
