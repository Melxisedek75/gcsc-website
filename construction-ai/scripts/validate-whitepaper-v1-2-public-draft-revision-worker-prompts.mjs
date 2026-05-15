import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docsRoot = resolve('..', 'docs');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const promptScriptPath = resolve('scripts', 'prepare-whitepaper-v1-2-public-draft-revision-worker-prompts.mjs');
const workerPacketPath = resolve(docsRoot, 'whitepaper-v1-2-public-draft-revision-worker-packet.md');
const contextPath = resolve(docsRoot, 'gcsc-active-context.md');
const backlogPath = resolve(docsRoot, 'smartcontractor-backlog.md');
const realStatusPath = resolve(docsRoot, 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Whitepaper revision worker prompt validation failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function readRequired(filePath) {
  assert(existsSync(filePath), `Missing required file: ${filePath}`);
  return readFileSync(filePath, 'utf8');
}

function assertIncludes(content, snippet, filePath) {
  assert(
    content.toLowerCase().includes(snippet.toLowerCase()),
    `${filePath} must include: ${snippet}`
  );
}

const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const promptScript = readRequired(promptScriptPath);
const workerPacket = readRequired(workerPacketPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realStatus = readRequired(realStatusPath);

assert(
  packageJson.scripts?.['prepare:whitepaper-v1-2-public-draft-revision-worker-prompts'] === 'node scripts/prepare-whitepaper-v1-2-public-draft-revision-worker-prompts.mjs',
  `${packagePath} must define prepare:whitepaper-v1-2-public-draft-revision-worker-prompts`
);
assert(
  packageJson.scripts?.['check:whitepaper-v1-2-public-draft-revision-worker-prompts'] === 'node scripts/validate-whitepaper-v1-2-public-draft-revision-worker-prompts.mjs',
  `${packagePath} must define check:whitepaper-v1-2-public-draft-revision-worker-prompts`
);
assertIncludes(runner, '"check:whitepaper-v1-2-public-draft-revision-worker-prompts"', runnerPath);

for (const snippet of [
  'Kimi-A',
  'Kimi-B',
  'Kimi-C',
  'Kimi-D',
  'Kimi-E',
  'Claude-Audit',
  'Codex-Integration',
  'worker-assignment.csv',
  'total_workers: workers.length',
  'workers.length !== 7',
  'docs/whitepaper-v1-2-public-draft-revision-worker-packet.md',
  'No public publication',
  'No secrets',
  'No live Supabase',
  'No real payments',
  'No legal',
  'PASS / REVISE / HOLD:',
]) {
  assertIncludes(promptScript, snippet, promptScriptPath);
}

for (const snippet of ['Kimi-A', 'Kimi-E', 'Claude', 'Codex', 'Worker Output Format']) {
  assertIncludes(workerPacket, snippet, workerPacketPath);
}

const dryRun = spawnSync(process.execPath, [
  'scripts/prepare-whitepaper-v1-2-public-draft-revision-worker-prompts.mjs',
  '--check',
], {
  cwd: resolve('.'),
  encoding: 'utf8',
  shell: false,
});

if (dryRun.error) fail(dryRun.error.message);
assert(dryRun.status === 0, `prepare worker prompts --check failed: ${dryRun.stderr || dryRun.stdout}`);

let dryRunJson;
try {
  dryRunJson = JSON.parse(dryRun.stdout);
} catch (error) {
  fail(`prepare worker prompts --check must print JSON: ${error.message}`);
}

assert(dryRunJson.status === 'validated', 'dry-run status must be validated');
assert(dryRunJson.total_workers === 7, 'dry-run must validate exactly 7 workers');
assert(dryRunJson.source_files_checked >= 10, 'dry-run must validate source file count');
assert(dryRunJson.safety_boundaries_checked === true, 'dry-run must check safety boundaries');

for (const [content, filePath, snippet] of [
  [context, contextPath, 'Whitepaper v1.2 public draft revision worker prompts'],
  [context, contextPath, 'prepare:whitepaper-v1-2-public-draft-revision-worker-prompts'],
  [backlog, backlogPath, 'Whitepaper v1.2 public draft revision worker prompts'],
  [backlog, backlogPath, 'check:whitepaper-v1-2-public-draft-revision-worker-prompts'],
  [realStatus, realStatusPath, 'Whitepaper v1.2 public draft revision worker prompts'],
]) {
  assertIncludes(content, snippet, filePath);
}

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(promptScript),
  'Worker prompt generator must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  prepare_script_checked: 'prepare:whitepaper-v1-2-public-draft-revision-worker-prompts',
  check_script_checked: 'check:whitepaper-v1-2-public-draft-revision-worker-prompts',
  total_workers_checked: dryRunJson.total_workers,
  source_files_checked: dryRunJson.source_files_checked,
  safety_boundaries_checked: true,
}, null, 2));
