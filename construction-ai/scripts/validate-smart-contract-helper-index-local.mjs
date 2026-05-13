import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as smartContracts from '../src/smart-contracts/index.mjs';

const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract helper index validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const index = readRequired(indexPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realAudit = readRequired(realAuditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciValidator = readRequired(ciValidatorPath);

const requiredExports = [
  'serializeSmartContractAuditEvent',
  'applyAuthorityTransition',
  'applyEscrowMilestoneTransition',
  'applyLoanLedgerTransition',
  'applyCollateralEstimateTransition',
  'applyPeerReviewRewardTransition',
  'createLocalReplayPacket',
  'createLocalReplayScenarioBundle',
  'createLocalReplayManifest',
  'createLocalReplayDigest',
  'createLocalReplayEvidenceBundle',
  'createLocalReplayReviewProof',
  'DEMO_AUDIT_EVENT_FIXTURE',
  'DEMO_AUTHORITY_PAUSE_FIXTURE',
  'DEMO_ESCROW_RELEASE_RECOMMENDATION_FIXTURE',
  'DEMO_LOAN_REPAYMENT_WATERFALL_FIXTURE',
  'DEMO_COLLATERAL_LTV_FIXTURE',
  'DEMO_PEER_REVIEW_REWARD_FIXTURE',
  'DEMO_LOCAL_REPLAY_PACKET',
  'DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE',
  'DEMO_LOCAL_REPLAY_MANIFEST',
  'DEMO_LOCAL_REPLAY_DIGEST',
  'DEMO_LOCAL_REPLAY_EVIDENCE_BUNDLE',
  'DEMO_LOCAL_REPLAY_REVIEW_PROOF',
  'LOCAL_REPLAY_DIGEST_ALGORITHM',
  'BLOCKED_LOCAL_REPLAY_FLAGS',
  'BLOCKED_REPLAY_SCENARIO_FLAGS',
];

for (const exportName of requiredExports) {
  if (!(exportName in smartContracts)) fail(`index.mjs must export ${exportName}`);
  assertIncludes(index, exportName, indexPath);
}

if (smartContracts.DEMO_LOCAL_REPLAY_PACKET.local_only !== true) fail('Demo replay packet export must stay local_only');
if (smartContracts.DEMO_LOCAL_REPLAY_PACKET.deployment_status !== 'BLOCKED_FOR_LIVE') {
  fail('Demo replay packet export must stay BLOCKED_FOR_LIVE');
}
if (smartContracts.DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE.local_only !== true) {
  fail('Demo replay scenario bundle export must stay local_only');
}
if (smartContracts.DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE.deployment_status !== 'BLOCKED_FOR_LIVE') {
  fail('Demo replay scenario bundle export must stay BLOCKED_FOR_LIVE');
}
if (smartContracts.DEMO_LOCAL_REPLAY_MANIFEST.local_only !== true) {
  fail('Demo replay manifest export must stay local_only');
}
if (smartContracts.DEMO_LOCAL_REPLAY_MANIFEST.deployment_status !== 'BLOCKED_FOR_LIVE') {
  fail('Demo replay manifest export must stay BLOCKED_FOR_LIVE');
}
if (smartContracts.DEMO_LOCAL_REPLAY_DIGEST.local_only !== true) {
  fail('Demo replay digest export must stay local_only');
}
if (smartContracts.DEMO_LOCAL_REPLAY_DIGEST.deployment_status !== 'BLOCKED_FOR_LIVE') {
  fail('Demo replay digest export must stay BLOCKED_FOR_LIVE');
}
if (smartContracts.LOCAL_REPLAY_DIGEST_ALGORITHM !== 'sha256') {
  fail('Digest algorithm export must stay sha256');
}
if (smartContracts.DEMO_LOCAL_REPLAY_EVIDENCE_BUNDLE.local_only !== true) {
  fail('Demo replay evidence bundle export must stay local_only');
}
if (smartContracts.DEMO_LOCAL_REPLAY_EVIDENCE_BUNDLE.deployment_status !== 'BLOCKED_FOR_LIVE') {
  fail('Demo replay evidence bundle export must stay BLOCKED_FOR_LIVE');
}
if (smartContracts.DEMO_LOCAL_REPLAY_REVIEW_PROOF.local_only !== true) {
  fail('Demo replay review proof export must stay local_only');
}
if (smartContracts.DEMO_LOCAL_REPLAY_REVIEW_PROOF.deployment_status !== 'BLOCKED_FOR_LIVE') {
  fail('Demo replay review proof export must stay BLOCKED_FOR_LIVE');
}

for (const [flag, value] of Object.entries(smartContracts.BLOCKED_LOCAL_REPLAY_FLAGS)) {
  if (value !== false) fail(`${flag} must stay false through the helper index`);
}
for (const [flag, value] of Object.entries(smartContracts.BLOCKED_REPLAY_SCENARIO_FLAGS)) {
  if (value !== false) fail(`${flag} must stay false through the helper index`);
}

for (const requiredSource of [
  './serialization/auditEventSerialization.mjs',
  './state/authorityControlState.mjs',
  './state/escrowMilestoneState.mjs',
  './state/loanLedgerState.mjs',
  './state/collateralEstimateState.mjs',
  './state/peerReviewRewardState.mjs',
  './replay/localReplayPacket.mjs',
  './replay/localReplayScenarioBundle.mjs',
  './replay/localReplayManifest.mjs',
  './replay/localReplayDigest.mjs',
  './replay/localReplayEvidenceBundle.mjs',
  './replay/localReplayReviewProof.mjs',
]) assertIncludes(index, requiredSource, indexPath);

assertIncludes(context, 'Smart contract helper index validator', contextPath);
assertIncludes(context, 'check:smart-contract-helper-index-local', contextPath);
assertIncludes(backlog, 'Smart contract helper index', backlogPath);
assertIncludes(backlog, 'check:smart-contract-helper-index-local', backlogPath);
assertIncludes(realAudit, 'Smart contract helper index', realAuditPath);

const scriptName = 'check:smart-contract-helper-index-local';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_helper_index: indexPath,
  exports_checked: requiredExports.length,
}, null, 2));
