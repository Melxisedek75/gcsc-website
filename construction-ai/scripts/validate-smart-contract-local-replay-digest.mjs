import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  DEMO_LOCAL_REPLAY_MANIFEST,
} from '../src/smart-contracts/replay/localReplayManifest.mjs';
import {
  createLocalReplayDigest,
  DEMO_LOCAL_REPLAY_DIGEST,
  LOCAL_REPLAY_DIGEST_ALGORITHM,
  REQUIRED_LOCAL_REPLAY_DIGEST_FIELDS,
} from '../src/smart-contracts/replay/localReplayDigest.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayDigest.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay digest validation failed: ${message}`);
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
  'LOCAL_REPLAY_DIGEST_ALGORITHM',
  'REQUIRED_LOCAL_REPLAY_DIGEST_FIELDS',
  'createLocalReplayDigest',
  'DEMO_LOCAL_REPLAY_DIGEST',
  'createHash',
  'sha256',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
  'stableStringify',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_DIGEST',
  'LOCAL_REPLAY_DIGEST_ALGORITHM',
  'REQUIRED_LOCAL_REPLAY_DIGEST_FIELDS',
  'createLocalReplayDigest',
]) assertIncludes(index, exportName, indexPath);

if (LOCAL_REPLAY_DIGEST_ALGORITHM !== 'sha256') fail('Digest algorithm must stay sha256');
if (REQUIRED_LOCAL_REPLAY_DIGEST_FIELDS.length < 10) fail('Required digest fields are unexpectedly short');
for (const field of REQUIRED_LOCAL_REPLAY_DIGEST_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_DIGEST, field)) fail(`Demo digest is missing ${field}`);
}
if (!DEMO_LOCAL_REPLAY_DIGEST.local_only) fail('Demo digest must be local_only');
if (DEMO_LOCAL_REPLAY_DIGEST.deployment_status !== 'BLOCKED_FOR_LIVE') fail('Demo digest must be BLOCKED_FOR_LIVE');
if (DEMO_LOCAL_REPLAY_DIGEST.pass_fail_status !== 'PASS_LOCAL_ONLY') fail('Demo digest must be PASS_LOCAL_ONLY');
if (!/^[a-f0-9]{64}$/.test(DEMO_LOCAL_REPLAY_DIGEST.digest)) fail('Demo digest must be a sha256 hex digest');

const repeatedDigest = createLocalReplayDigest({
  digest_id: 'local_replay_digest_repeat_001',
  manifest: DEMO_LOCAL_REPLAY_MANIFEST,
  created_at: '2026-05-13T00:00:00.000Z',
});
if (repeatedDigest.digest !== DEMO_LOCAL_REPLAY_DIGEST.digest) fail('Digest must be deterministic for the same manifest');

const tamperedDigest = createLocalReplayDigest({
  digest_id: 'local_replay_digest_tampered_001',
  manifest: {
    ...DEMO_LOCAL_REPLAY_MANIFEST,
    steps: [
      ...DEMO_LOCAL_REPLAY_MANIFEST.steps.slice(0, 1),
      { ...DEMO_LOCAL_REPLAY_MANIFEST.steps[1], step_id: 'local_replay_step_02_tampered' },
      ...DEMO_LOCAL_REPLAY_MANIFEST.steps.slice(2),
    ],
  },
  created_at: '2026-05-13T00:00:00.000Z',
});
if (tamperedDigest.digest === DEMO_LOCAL_REPLAY_DIGEST.digest) fail('Digest must change when manifest evidence changes');

try {
  createLocalReplayDigest({
    digest_id: 'bad_digest',
    manifest: { ...DEMO_LOCAL_REPLAY_MANIFEST, local_only: false },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Digest must reject non-local manifest');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local manifest error must name local_only');
}

try {
  createLocalReplayDigest({
    digest_id: 'bad_digest',
    manifest: { ...DEMO_LOCAL_REPLAY_MANIFEST, steps: DEMO_LOCAL_REPLAY_MANIFEST.steps.slice(1) },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Digest must reject step count mismatch');
} catch (error) {
  if (!String(error.message).includes('step_count')) fail('Step count error must name step_count');
}

try {
  createLocalReplayDigest({
    digest_id: 'sk_live_bad_secret_value',
    manifest: DEMO_LOCAL_REPLAY_MANIFEST,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Digest must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay digest validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-digest', contextPath);
assertIncludes(backlog, 'Smart contract local replay digest', backlogPath);
assertIncludes(backlog, 'check:smart-contract-local-replay-digest', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay digest', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-digest';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_digest: helperPath,
  digest_algorithm: LOCAL_REPLAY_DIGEST_ALGORITHM,
}, null, 2));
