import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEMO_LOCAL_REPLAY_DIGEST } from '../src/smart-contracts/replay/localReplayDigest.mjs';
import { DEMO_LOCAL_REPLAY_MANIFEST } from '../src/smart-contracts/replay/localReplayManifest.mjs';
import { DEMO_LOCAL_REPLAY_PACKET } from '../src/smart-contracts/replay/localReplayPacket.mjs';
import { DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE } from '../src/smart-contracts/replay/localReplayScenarioBundle.mjs';
import {
  createLocalReplayEvidenceBundle,
  DEMO_LOCAL_REPLAY_EVIDENCE_BUNDLE,
  LOCAL_REPLAY_EVIDENCE_BUNDLE_STATUS,
  REQUIRED_LOCAL_REPLAY_EVIDENCE_BUNDLE_FIELDS,
} from '../src/smart-contracts/replay/localReplayEvidenceBundle.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayEvidenceBundle.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay evidence bundle validation failed: ${message}`);
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
  'REQUIRED_LOCAL_REPLAY_EVIDENCE_BUNDLE_FIELDS',
  'LOCAL_REPLAY_EVIDENCE_BUNDLE_STATUS',
  'createLocalReplayEvidenceBundle',
  'DEMO_LOCAL_REPLAY_EVIDENCE_BUNDLE',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
  'local_only',
  'digest',
  'scenario',
  'fixture_count',
  'step_count',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_EVIDENCE_BUNDLE',
  'LOCAL_REPLAY_EVIDENCE_BUNDLE_STATUS',
  'REQUIRED_LOCAL_REPLAY_EVIDENCE_BUNDLE_FIELDS',
  'createLocalReplayEvidenceBundle',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_EVIDENCE_BUNDLE_FIELDS.length < 12) fail('Required evidence bundle fields are unexpectedly short');
for (const field of REQUIRED_LOCAL_REPLAY_EVIDENCE_BUNDLE_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_EVIDENCE_BUNDLE, field)) fail(`Demo evidence bundle is missing ${field}`);
}
if (!DEMO_LOCAL_REPLAY_EVIDENCE_BUNDLE.local_only) fail('Demo evidence bundle must be local_only');
if (DEMO_LOCAL_REPLAY_EVIDENCE_BUNDLE.deployment_status !== 'BLOCKED_FOR_LIVE') {
  fail('Demo evidence bundle must be BLOCKED_FOR_LIVE');
}
if (DEMO_LOCAL_REPLAY_EVIDENCE_BUNDLE.pass_fail_status !== 'PASS_LOCAL_ONLY') {
  fail('Demo evidence bundle must be PASS_LOCAL_ONLY');
}
if (DEMO_LOCAL_REPLAY_EVIDENCE_BUNDLE.digest !== DEMO_LOCAL_REPLAY_DIGEST.digest) {
  fail('Demo evidence bundle digest must match demo digest');
}
if (DEMO_LOCAL_REPLAY_EVIDENCE_BUNDLE.scenario !== DEMO_LOCAL_REPLAY_PACKET.scenario) {
  fail('Demo evidence bundle scenario must match demo packet scenario');
}
if (DEMO_LOCAL_REPLAY_EVIDENCE_BUNDLE.fixture_count !== DEMO_LOCAL_REPLAY_MANIFEST.fixture_count) {
  fail('Demo evidence bundle fixture_count must match manifest');
}
if (DEMO_LOCAL_REPLAY_EVIDENCE_BUNDLE.step_count !== DEMO_LOCAL_REPLAY_MANIFEST.step_count) {
  fail('Demo evidence bundle step_count must match manifest');
}

for (const [field, value] of Object.entries(LOCAL_REPLAY_EVIDENCE_BUNDLE_STATUS)) {
  if (DEMO_LOCAL_REPLAY_EVIDENCE_BUNDLE[field] !== value) fail(`Evidence bundle status ${field} must stay ${value}`);
}

try {
  createLocalReplayEvidenceBundle({
    evidence_bundle_id: 'bad_bundle',
    packet: { ...DEMO_LOCAL_REPLAY_PACKET, local_only: false },
    scenario_bundle: DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE,
    manifest: DEMO_LOCAL_REPLAY_MANIFEST,
    digest: DEMO_LOCAL_REPLAY_DIGEST,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Evidence bundle must reject non-local packet');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local packet error must name local_only');
}

try {
  createLocalReplayEvidenceBundle({
    evidence_bundle_id: 'bad_bundle',
    packet: DEMO_LOCAL_REPLAY_PACKET,
    scenario_bundle: { ...DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE, replay_packet: {} },
    manifest: DEMO_LOCAL_REPLAY_MANIFEST,
    digest: DEMO_LOCAL_REPLAY_DIGEST,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Evidence bundle must reject scenario packet mismatch');
} catch (error) {
  if (!String(error.message).includes('packet')) fail('Scenario mismatch error must name packet');
}

try {
  createLocalReplayEvidenceBundle({
    evidence_bundle_id: 'bad_bundle',
    packet: DEMO_LOCAL_REPLAY_PACKET,
    scenario_bundle: DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE,
    manifest: DEMO_LOCAL_REPLAY_MANIFEST,
    digest: { ...DEMO_LOCAL_REPLAY_DIGEST, manifest_id: 'different_manifest' },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Evidence bundle must reject digest manifest mismatch');
} catch (error) {
  if (!String(error.message).includes('digest')) fail('Digest mismatch error must name digest');
}

try {
  createLocalReplayEvidenceBundle({
    evidence_bundle_id: 'sk_live_bad_secret_value',
    packet: DEMO_LOCAL_REPLAY_PACKET,
    scenario_bundle: DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE,
    manifest: DEMO_LOCAL_REPLAY_MANIFEST,
    digest: DEMO_LOCAL_REPLAY_DIGEST,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Evidence bundle must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay evidence bundle validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-evidence-bundle', contextPath);
assertIncludes(backlog, 'Smart contract local replay evidence bundle', backlogPath);
assertIncludes(backlog, 'check:smart-contract-local-replay-evidence-bundle', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay evidence bundle', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-evidence-bundle';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_evidence_bundle: helperPath,
  digest_checked: true,
}, null, 2));
