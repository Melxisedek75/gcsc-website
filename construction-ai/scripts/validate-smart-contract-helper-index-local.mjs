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
  'createLocalReplayFounderPacket',
  'createLocalReplayLiveGate',
  'createLocalReplayApprovalChecklist',
  'createLocalReplayApprovalEvidenceTemplate',
  'createLocalReplayApprovalHandoffSummary',
  'createLocalReplayApprovalDecisionDraft',
  'createLocalReplayApprovalDecisionIntake',
  'createLocalReplayApprovalDecisionRouting',
  'createLocalReplayApprovalDecisionAuditTrail',
  'createLocalReplayApprovalDecisionCloseout',
  'createLocalReplayApprovalDecisionExternalOwnerPacket',
  'createLocalReplayApprovalDecisionExternalOwnerResponseTemplate',
  'createLocalReplayApprovalDecisionExternalOwnerResponseIntake',
  'createLocalReplayApprovalDecisionExternalOwnerResponseSummary',
  'createLocalReplayApprovalDecisionExternalOwnerResponseActionPlan',
  'createLocalReplayApprovalDecisionExternalOwnerResponseHandoff',
  'createLocalReplayApprovalDecisionExternalOwnerResponseHandoffCloseout',
  'createLocalReplayApprovalDecisionExternalOwnerResponseDecisionRegister',
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
  'DEMO_LOCAL_REPLAY_FOUNDER_PACKET',
  'DEMO_LOCAL_REPLAY_LIVE_GATE',
  'DEMO_LOCAL_REPLAY_APPROVAL_CHECKLIST',
  'DEMO_LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE',
  'DEMO_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER',
  'REQUIRED_LOCAL_REPLAY_APPROVALS',
  'LOCAL_REPLAY_APPROVAL_EVIDENCE_SLOTS',
  'LOCAL_REPLAY_BLOCKED_LIVE_ACTIONS',
  'LOCAL_REPLAY_BLOCKED_DECISION_STATES',
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
if (smartContracts.DEMO_LOCAL_REPLAY_FOUNDER_PACKET.local_only !== true) {
  fail('Demo replay founder packet export must stay local_only');
}
if (smartContracts.DEMO_LOCAL_REPLAY_FOUNDER_PACKET.deployment_status !== 'BLOCKED_FOR_LIVE') {
  fail('Demo replay founder packet export must stay BLOCKED_FOR_LIVE');
}
if (smartContracts.DEMO_LOCAL_REPLAY_LIVE_GATE.local_only !== true) {
  fail('Demo replay live gate export must stay local_only');
}
if (smartContracts.DEMO_LOCAL_REPLAY_LIVE_GATE.deployment_status !== 'BLOCKED_FOR_LIVE') {
  fail('Demo replay live gate export must stay BLOCKED_FOR_LIVE');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_CHECKLIST.local_only !== true) {
  fail('Demo replay approval checklist export must stay local_only');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_CHECKLIST.deployment_status !== 'BLOCKED_FOR_LIVE') {
  fail('Demo replay approval checklist export must stay BLOCKED_FOR_LIVE');
}
if (!smartContracts.REQUIRED_LOCAL_REPLAY_APPROVALS.includes('founder_approval_pending')) {
  fail('Required replay approvals export must include founder_approval_pending');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE.local_only !== true) {
  fail('Demo replay approval evidence template export must stay local_only');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE.deployment_status !== 'BLOCKED_FOR_LIVE') {
  fail('Demo replay approval evidence template export must stay BLOCKED_FOR_LIVE');
}
if (!smartContracts.LOCAL_REPLAY_APPROVAL_EVIDENCE_SLOTS.includes('founder_approval_evidence_placeholder')) {
  fail('Approval evidence slots export must include founder_approval_evidence_placeholder');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY.local_only !== true) {
  fail('Demo replay approval handoff summary export must stay local_only');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_HANDOFF_SUMMARY.deployment_status !== 'BLOCKED_FOR_LIVE') {
  fail('Demo replay approval handoff summary export must stay BLOCKED_FOR_LIVE');
}
if (!smartContracts.LOCAL_REPLAY_BLOCKED_LIVE_ACTIONS.includes('no_live_xpr_signature')) {
  fail('Blocked live actions export must include no_live_xpr_signature');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT.local_only !== true) {
  fail('Demo replay approval decision draft export must stay local_only');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_DECISION_DRAFT.deployment_status !== 'BLOCKED_FOR_LIVE') {
  fail('Demo replay approval decision draft export must stay BLOCKED_FOR_LIVE');
}
if (!smartContracts.LOCAL_REPLAY_BLOCKED_DECISION_STATES.includes('GO_FOR_LIVE')) {
  fail('Blocked decision states export must include GO_FOR_LIVE');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE.local_only !== true) {
  fail('Demo replay approval decision intake export must stay local_only');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_DECISION_INTAKE.deployment_status !== 'BLOCKED_FOR_LIVE') {
  fail('Demo replay approval decision intake export must stay BLOCKED_FOR_LIVE');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING.local_only !== true) {
  fail('Demo replay approval decision routing export must stay local_only');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_DECISION_ROUTING.deployment_status !== 'BLOCKED_FOR_LIVE') {
  fail('Demo replay approval decision routing export must stay BLOCKED_FOR_LIVE');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL.local_only !== true) {
  fail('Demo replay approval decision audit trail export must stay local_only');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_DECISION_AUDIT_TRAIL.deployment_status !== 'BLOCKED_FOR_LIVE') {
  fail('Demo replay approval decision audit trail export must stay BLOCKED_FOR_LIVE');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT.local_only !== true) {
  fail('Demo replay approval decision closeout export must stay local_only');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT.deployment_status !== 'BLOCKED_FOR_LIVE') {
  fail('Demo replay approval decision closeout export must stay BLOCKED_FOR_LIVE');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET.local_only !== true) {
  fail('Demo replay approval decision external owner packet export must stay local_only');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET.deployment_status !== 'BLOCKED_FOR_LIVE') {
  fail('Demo replay approval decision external owner packet export must stay BLOCKED_FOR_LIVE');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE.local_only !== true) {
  fail('Demo replay approval decision external owner response template export must stay local_only');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_TEMPLATE.deployment_status !== 'BLOCKED_FOR_LIVE') {
  fail('Demo replay approval decision external owner response template export must stay BLOCKED_FOR_LIVE');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE.local_only !== true) {
  fail('Demo replay approval decision external owner response intake export must stay local_only');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_INTAKE.deployment_status !== 'BLOCKED_FOR_LIVE') {
  fail('Demo replay approval decision external owner response intake export must stay BLOCKED_FOR_LIVE');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY.local_only !== true) {
  fail('Demo replay approval decision external owner response summary export must stay local_only');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_SUMMARY.deployment_status !== 'BLOCKED_FOR_LIVE') {
  fail('Demo replay approval decision external owner response summary export must stay BLOCKED_FOR_LIVE');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN.local_only !== true) {
  fail('Demo replay approval decision external owner response action plan export must stay local_only');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_ACTION_PLAN.deployment_status !== 'BLOCKED_FOR_LIVE') {
  fail('Demo replay approval decision external owner response action plan export must stay BLOCKED_FOR_LIVE');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF.local_only !== true) {
  fail('Demo replay approval decision external owner response handoff export must stay local_only');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF.deployment_status !== 'BLOCKED_FOR_LIVE') {
  fail('Demo replay approval decision external owner response handoff export must stay BLOCKED_FOR_LIVE');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT.local_only !== true) {
  fail('Demo replay approval decision external owner response handoff closeout export must stay local_only');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_HANDOFF_CLOSEOUT.deployment_status !== 'BLOCKED_FOR_LIVE') {
  fail('Demo replay approval decision external owner response handoff closeout export must stay BLOCKED_FOR_LIVE');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER.local_only !== true) {
  fail('Demo replay approval decision external owner response decision register export must stay local_only');
}
if (smartContracts.DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER.deployment_status !== 'BLOCKED_FOR_LIVE') {
  fail('Demo replay approval decision external owner response decision register export must stay BLOCKED_FOR_LIVE');
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
  './replay/localReplayFounderPacket.mjs',
  './replay/localReplayLiveGate.mjs',
  './replay/localReplayApprovalChecklist.mjs',
  './replay/localReplayApprovalEvidenceTemplate.mjs',
  './replay/localReplayApprovalHandoffSummary.mjs',
  './replay/localReplayApprovalDecisionDraft.mjs',
  './replay/localReplayApprovalDecisionIntake.mjs',
  './replay/localReplayApprovalDecisionRouting.mjs',
  './replay/localReplayApprovalDecisionAuditTrail.mjs',
  './replay/localReplayApprovalDecisionCloseout.mjs',
  './replay/localReplayApprovalDecisionExternalOwnerPacket.mjs',
  './replay/localReplayApprovalDecisionExternalOwnerResponseTemplate.mjs',
  './replay/localReplayApprovalDecisionExternalOwnerResponseIntake.mjs',
  './replay/localReplayApprovalDecisionExternalOwnerResponseSummary.mjs',
  './replay/localReplayApprovalDecisionExternalOwnerResponseActionPlan.mjs',
  './replay/localReplayApprovalDecisionExternalOwnerResponseHandoff.mjs',
  './replay/localReplayApprovalDecisionExternalOwnerResponseHandoffCloseout.mjs',
  './replay/localReplayApprovalDecisionExternalOwnerResponseDecisionRegister.mjs',
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
