import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { LOCAL_REPLAY_DIGEST_ALGORITHM } from '../src/smart-contracts/replay/localReplayDigest.mjs';
import { DEMO_LOCAL_REPLAY_EVIDENCE_BUNDLE } from '../src/smart-contracts/replay/localReplayEvidenceBundle.mjs';
import {
  createLocalReplayReviewProof,
  DEMO_LOCAL_REPLAY_REVIEW_PROOF,
  LOCAL_REPLAY_REVIEW_PROOF_STATUS,
  REQUIRED_LOCAL_REPLAY_REVIEW_PROOF_FIELDS,
} from '../src/smart-contracts/replay/localReplayReviewProof.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayReviewProof.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay review proof validation failed: ${message}`);
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
const index = readRequired(indexPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realAudit = readRequired(realAuditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciValidator = readRequired(ciValidatorPath);

for (const required of [
  'REQUIRED_LOCAL_REPLAY_REVIEW_PROOF_FIELDS',
  'LOCAL_REPLAY_REVIEW_PROOF_STATUS',
  'createLocalReplayReviewProof',
  'DEMO_LOCAL_REPLAY_REVIEW_PROOF',
  'LOCAL_REVIEW_ONLY_NO_LIVE_XPR_NO_REAL_MONEY',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
  'sha256',
  'local_only',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_REVIEW_PROOF',
  'LOCAL_REPLAY_REVIEW_PROOF_STATUS',
  'REQUIRED_LOCAL_REPLAY_REVIEW_PROOF_FIELDS',
  'createLocalReplayReviewProof',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_REVIEW_PROOF_FIELDS.length < 16) fail('Required review proof fields are unexpectedly short');
for (const field of REQUIRED_LOCAL_REPLAY_REVIEW_PROOF_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_REVIEW_PROOF, field)) fail(`Demo review proof is missing ${field}`);
}

if (DEMO_LOCAL_REPLAY_REVIEW_PROOF.digest !== DEMO_LOCAL_REPLAY_EVIDENCE_BUNDLE.digest) {
  fail('Demo review proof digest must match evidence bundle digest');
}
if (DEMO_LOCAL_REPLAY_REVIEW_PROOF.digest_algorithm !== LOCAL_REPLAY_DIGEST_ALGORITHM) {
  fail('Demo review proof digest_algorithm must match local replay digest algorithm');
}
if (DEMO_LOCAL_REPLAY_REVIEW_PROOF.module_order.length !== DEMO_LOCAL_REPLAY_REVIEW_PROOF.step_count) {
  fail('Demo review proof module_order must match step_count');
}
if (DEMO_LOCAL_REPLAY_REVIEW_PROOF.fixture_count !== DEMO_LOCAL_REPLAY_EVIDENCE_BUNDLE.fixture_count) {
  fail('Demo review proof fixture_count must match evidence bundle');
}

for (const [field, value] of Object.entries(LOCAL_REPLAY_REVIEW_PROOF_STATUS)) {
  if (DEMO_LOCAL_REPLAY_REVIEW_PROOF[field] !== value) fail(`Review proof status ${field} must stay ${value}`);
}

try {
  createLocalReplayReviewProof({
    proof_id: 'bad_review_proof',
    evidence_bundle: { ...DEMO_LOCAL_REPLAY_EVIDENCE_BUNDLE, local_only: false },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Review proof must reject non-local evidence bundle');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local evidence error must name local_only');
}

try {
  createLocalReplayReviewProof({
    proof_id: 'bad_review_proof',
    evidence_bundle: { ...DEMO_LOCAL_REPLAY_EVIDENCE_BUNDLE, digest: 'not_a_sha256_digest' },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Review proof must reject malformed digest');
} catch (error) {
  if (!String(error.message).includes('sha256')) fail('Malformed digest error must name sha256');
}

try {
  createLocalReplayReviewProof({
    proof_id: 'bad_review_proof',
    evidence_bundle: { ...DEMO_LOCAL_REPLAY_EVIDENCE_BUNDLE, step_count: 999 },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Review proof must reject module_order and step_count mismatch');
} catch (error) {
  if (!String(error.message).includes('step_count')) fail('Step-count mismatch error must name step_count');
}

try {
  createLocalReplayReviewProof({
    proof_id: 'sk_live_bad_secret_value',
    evidence_bundle: DEMO_LOCAL_REPLAY_EVIDENCE_BUNDLE,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Review proof must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay review proof validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-review-proof', contextPath);
assertIncludes(backlog, 'Smart contract local replay review proof', backlogPath);
assertIncludes(backlog, 'check:smart-contract-local-replay-review-proof', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay review proof', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-review-proof';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_review_proof: helperPath,
  digest_algorithm: LOCAL_REPLAY_DIGEST_ALGORITHM,
}, null, 2));
