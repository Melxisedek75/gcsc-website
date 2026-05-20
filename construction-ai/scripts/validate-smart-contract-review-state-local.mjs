import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  applyPeerReviewRewardTransition,
  BLOCKED_PEER_REVIEW_REWARD_FLAGS,
  DEMO_PEER_REVIEW_REWARD_FIXTURE,
  PEER_REVIEW_REWARD_ACTIONS,
  PEER_REVIEW_REWARD_STATES,
  REQUIRED_PEER_REVIEW_REWARD_FIELDS,
} from '../src/smart-contracts/state/peerReviewRewardState.mjs';

const helperPath = resolve('src', 'smart-contracts', 'state', 'peerReviewRewardState.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract review state local validation failed: ${message}`);
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
  'PEER_REVIEW_REWARD_STATES',
  'PEER_REVIEW_REWARD_ACTIONS',
  'REQUIRED_PEER_REVIEW_REWARD_FIELDS',
  'BLOCKED_PEER_REVIEW_REWARD_FLAGS',
  'applyPeerReviewRewardTransition',
  'DEMO_PEER_REVIEW_REWARD_FIXTURE',
  'reward_placeholder_only',
  'reputation_label_only',
  'conflict_check_fixture_only',
  'peer_review_safety_gate_guard',
  'DEMO_ONLY_REVIEW_SAFETY_GATE_REQUIRED',
  'peer_review_actor_role_guard',
  'LOCAL_PEER_REVIEWER_ONLY',
  'peer_review_identifier_prefix_guard',
  'LOCAL_DEMO_PEER_REVIEW_IDENTIFIERS_ONLY',
  'peer_review_provider_review_guard',
  'FOUNDER_AND_LEGAL_PROVIDER_REVIEW_REQUIRED',
  'peer_review_conflict_status_guard',
  'LOCAL_CONFLICT_CHECK_REQUIRED',
  'peer_review_label_only_guard',
  'LOCAL_REWARD_AND_REPUTATION_LABELS_ONLY',
  'peer_review_scoring_label_guard',
  'LOCAL_SCORE_AND_RECOMMENDATION_LABELS_ONLY',
  'peer_review_abuse_flag_guard',
  'LOCAL_ABUSE_REVIEW_REQUIRED',
  'peer_review_evidence_prefix_guard',
  'LOCAL_DEMO_EVIDENCE_ONLY',
  'BLOCKED_FOR_LIVE',
  'local_only',
  'real_reward_payout_allowed',
  'token_issuance_allowed',
  'reviewer_compensation_allowed',
  'reputation_penalty_allowed',
  'public_reputation_claim_allowed',
  'peer_review_final_authority_allowed',
  'dispute_finality_allowed',
  'payment_release_allowed',
  'real_escrow_allowed',
  'real_payment_allowed',
  'ai_final_authority_allowed',
]) assertIncludes(helper, required, helperPath);

if (PEER_REVIEW_REWARD_STATES.length < 7) fail('Peer review reward state list is unexpectedly short');
if (!PEER_REVIEW_REWARD_STATES.includes('reward_label_recorded')) fail('reward_label_recorded state must exist');
if (!PEER_REVIEW_REWARD_ACTIONS.includes('rewardrev')) fail('rewardrev action must exist');

for (const field of REQUIRED_PEER_REVIEW_REWARD_FIELDS) {
  if (!Object.hasOwn(DEMO_PEER_REVIEW_REWARD_FIXTURE, field)) fail(`Demo peer review fixture is missing ${field}`);
}

if (!DEMO_PEER_REVIEW_REWARD_FIXTURE.local_only) fail('Demo peer review fixture must be local_only');
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.deployment_status !== 'BLOCKED_FOR_LIVE') fail('Demo peer review fixture must be BLOCKED_FOR_LIVE');
if (!DEMO_PEER_REVIEW_REWARD_FIXTURE.reward_placeholder_only) fail('Demo peer review fixture must be reward placeholder only');
if (!DEMO_PEER_REVIEW_REWARD_FIXTURE.reputation_label_only) fail('Demo peer review fixture must be reputation label only');
if (!DEMO_PEER_REVIEW_REWARD_FIXTURE.conflict_check_fixture_only) fail('Demo peer review fixture must be conflict check fixture only');
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_safety_gate_guard !== 'DEMO_ONLY_REVIEW_SAFETY_GATE_REQUIRED') {
  fail('Demo peer review fixture must expose the demo-only review safety gate guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.safety_gate !== 'demo-only') fail('Demo peer review fixture safety gate must remain demo-only');
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_actor_role_guard !== 'LOCAL_PEER_REVIEWER_ONLY') {
  fail('Demo peer review fixture must expose the local peer reviewer actor guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.actor_role !== 'peer_reviewer') fail('Demo peer review fixture actor role must remain peer_reviewer');
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_identifier_prefix_guard !== 'LOCAL_DEMO_PEER_REVIEW_IDENTIFIERS_ONLY') {
  fail('Demo peer review fixture must expose the local demo identifier prefix guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_provider_review_guard !== 'FOUNDER_AND_LEGAL_PROVIDER_REVIEW_REQUIRED') {
  fail('Demo peer review fixture must expose the founder/legal provider review guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.founder_approval_status !== 'required_before_public_claims') {
  fail('Demo peer review fixture founder approval status must remain required before public claims');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.legal_provider_status !== 'required') {
  fail('Demo peer review fixture legal provider status must remain required');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_conflict_status_guard !== 'LOCAL_CONFLICT_CHECK_REQUIRED') {
  fail('Demo peer review fixture must expose the local conflict status guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.conflict_of_interest_status !== 'not_flagged_demo_only') {
  fail('Demo peer review fixture conflict status must remain not_flagged_demo_only');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_label_only_guard !== 'LOCAL_REWARD_AND_REPUTATION_LABELS_ONLY') {
  fail('Demo peer review fixture must expose the local label-only guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.reward_label !== 'demo_reward_label_only') {
  fail('Demo peer review fixture reward label must remain demo-only');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.reputation_impact_label !== 'demo_reputation_impact_only') {
  fail('Demo peer review fixture reputation impact label must remain demo-only');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_scoring_label_guard !== 'LOCAL_SCORE_AND_RECOMMENDATION_LABELS_ONLY') {
  fail('Demo peer review fixture must expose the local scoring label guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.score_label !== 'demo_score_only') {
  fail('Demo peer review fixture score label must remain demo-only');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.recommendation_label !== 'release_recommendation_only') {
  fail('Demo peer review fixture recommendation label must remain label-only');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_abuse_flag_guard !== 'LOCAL_ABUSE_REVIEW_REQUIRED') {
  fail('Demo peer review fixture must expose the local abuse flag guard');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.abuse_flag !== false) {
  fail('Demo peer review fixture abuse flag must remain false');
}
if (DEMO_PEER_REVIEW_REWARD_FIXTURE.peer_review_evidence_prefix_guard !== 'LOCAL_DEMO_EVIDENCE_ONLY') {
  fail('Demo peer review fixture must expose the local evidence prefix guard');
}
if (!String(DEMO_PEER_REVIEW_REWARD_FIXTURE.evidence_id).startsWith('evidence_demo_')) {
  fail('Demo peer review fixture evidence id must remain local demo evidence');
}

for (const [flag, value] of Object.entries(BLOCKED_PEER_REVIEW_REWARD_FLAGS)) {
  if (value !== false) fail(`${flag} must be false`);
  if (DEMO_PEER_REVIEW_REWARD_FIXTURE[flag] !== false) fail(`Demo fixture ${flag} must be false`);
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, request_id: '' });
  fail('Peer review reward transition must reject missing request_id');
} catch (error) {
  if (!String(error.message).includes('request_id')) fail('Missing request_id error must name request_id');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, evidence_id: 'sk_live_demo_secret_value' });
  fail('Peer review reward transition must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, action: 'issue_real_reward' });
  fail('Peer review reward transition must reject invalid actions');
} catch (error) {
  if (!String(error.message).includes('action')) fail('Invalid action error must name action');
}

try {
  applyPeerReviewRewardTransition({
    ...DEMO_PEER_REVIEW_REWARD_FIXTURE,
    previous_state: 'submitted',
    next_state: 'reward_label_recorded',
  });
  fail('Peer review reward transition must reject invalid state changes');
} catch (error) {
  if (!String(error.message).includes('transition')) fail('Invalid transition error must name transition');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, safety_gate: 'production-ready' });
  fail('Peer review reward transition must reject production safety gate labels');
} catch (error) {
  if (!String(error.message).includes('safety gate')) fail('Invalid safety gate error must name safety gate');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, actor_role: 'admin_operator' });
  fail('Peer review reward transition must reject non-peer-reviewer actor roles');
} catch (error) {
  if (!String(error.message).includes('actor role')) fail('Invalid actor role error must name actor role');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, request_id: 'req_prod_peer_review_reward_001' });
  fail('Peer review reward transition must reject non-demo request ids');
} catch (error) {
  if (!String(error.message).includes('identifier prefix')) fail('Invalid request id error must name identifier prefix');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, reviewer_id: 'reviewer_live_001' });
  fail('Peer review reward transition must reject non-demo reviewer ids');
} catch (error) {
  if (!String(error.message).includes('identifier prefix')) fail('Invalid reviewer id error must name identifier prefix');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, founder_approval_status: 'approved' });
  fail('Peer review reward transition must reject approved founder status');
} catch (error) {
  if (!String(error.message).includes('review status')) fail('Invalid founder status error must name review status');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, legal_provider_status: 'waived' });
  fail('Peer review reward transition must reject waived legal provider status');
} catch (error) {
  if (!String(error.message).includes('review status')) fail('Invalid legal provider status error must name review status');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, conflict_of_interest_status: 'approved' });
  fail('Peer review reward transition must reject approved conflict status');
} catch (error) {
  if (!String(error.message).includes('conflict status')) fail('Invalid conflict status error must name conflict status');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, reward_label: 'real_token_reward_25_gcsc' });
  fail('Peer review reward transition must reject real reward labels');
} catch (error) {
  if (!String(error.message).includes('label-only')) fail('Invalid reward label error must name label-only boundary');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, recommendation_label: 'release_payment_now' });
  fail('Peer review reward transition must reject payment-release recommendation labels');
} catch (error) {
  if (!String(error.message).includes('scoring label')) fail('Invalid recommendation label error must name scoring label boundary');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, abuse_flag: true });
  fail('Peer review reward transition must reject abuse-flagged reward labels');
} catch (error) {
  if (!String(error.message).includes('abuse flag')) fail('Invalid abuse flag error must name abuse flag boundary');
}

try {
  applyPeerReviewRewardTransition({ ...DEMO_PEER_REVIEW_REWARD_FIXTURE, evidence_id: 'evidence_live_roof_001' });
  fail('Peer review reward transition must reject non-demo evidence ids');
} catch (error) {
  if (!String(error.message).includes('evidence id')) fail('Invalid evidence id error must name evidence id boundary');
}

assertIncludes(context, 'Smart contract review state local helper', contextPath);
assertIncludes(context, 'check:smart-contract-review-state-local', contextPath);
assertIncludes(backlog, 'Smart contract review state local helper', backlogPath);
assertIncludes(backlog, 'check:smart-contract-review-state-local', backlogPath);
assertIncludes(realAudit, 'Smart contract review state local helper', realAuditPath);

const scriptName = 'check:smart-contract-review-state-local';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

if (/sk_live_[a-z0-9]{12,}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(helper)) {
  fail('Peer review state helper must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_review_state_local_helper: helperPath,
  states_checked: PEER_REVIEW_REWARD_STATES.length,
  blocked_review_flags_checked: Object.keys(BLOCKED_PEER_REVIEW_REWARD_FLAGS).length,
}, null, 2));
