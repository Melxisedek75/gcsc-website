import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docsRoot = resolve('..', 'docs');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const printScriptPath = resolve('scripts', 'print-kimi-latest-intake-paths.mjs');
const contextPath = resolve(docsRoot, 'gcsc-active-context.md');
const backlogPath = resolve(docsRoot, 'smartcontractor-backlog.md');
const auditPath = resolve(docsRoot, 'gcsc-real-status-audit-2026-05-11.md');
const quickStartPath = resolve(docsRoot, 'gcsc-founder-kimi-claude-quick-start-2026-05-14.md');
const manifestPath = resolve(docsRoot, 'gcsc-kimi-claude-codex-handoff-bundle-manifest-2026-05-14.md');

function fail(message, details = {}) {
  console.error(JSON.stringify({
    status: 'failed',
    message,
    ...details,
  }, null, 2));
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
const printScript = readRequired(printScriptPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const quickStart = readRequired(quickStartPath);
const manifest = readRequired(manifestPath);

assert(
  packageJson.scripts?.['print:kimi-latest-intake-paths'] === 'node scripts/print-kimi-latest-intake-paths.mjs',
  `${packagePath} must define print:kimi-latest-intake-paths`
);
assert(
  packageJson.scripts?.['check:kimi-latest-intake-paths'] === 'node scripts/validate-kimi-latest-intake-paths.mjs',
  `${packagePath} must define check:kimi-latest-intake-paths`
);
assertIncludes(runner, '"check:kimi-latest-intake-paths"', runnerPath);

for (const snippet of [
  'kimi-wave-one-output-intake-',
  '00-controller-summary',
  '01-claude-audit',
  '02-codex-merge-queue',
  '99-blocked-or-rejected',
  'worker-reports',
  'created-or-modified-files',
  'claude-verdict',
  'intake-folder-map.json',
  'latest_intake_root',
  'No secrets',
  'No live Supabase',
  'No deployment',
  'No real payments',
  'No legal',
]) {
  assertIncludes(printScript, snippet, printScriptPath);
}

const prepareResult = spawnSync(process.execPath, ['scripts/prepare-kimi-output-intake.mjs'], {
  cwd: resolve('.'),
  encoding: 'utf8',
  shell: false,
});

if (prepareResult.error) fail(prepareResult.error.message);
assert(
  prepareResult.status === 0,
  `prepare:kimi-output-intake failed: ${prepareResult.stderr || prepareResult.stdout}`
);

const printResult = spawnSync(process.execPath, ['scripts/print-kimi-latest-intake-paths.mjs'], {
  cwd: resolve('.'),
  encoding: 'utf8',
  shell: false,
});

if (printResult.error) fail(printResult.error.message);
assert(
  printResult.status === 0,
  `print:kimi-latest-intake-paths failed: ${printResult.stderr || printResult.stdout}`
);

let printJson;
try {
  printJson = JSON.parse(printResult.stdout);
} catch (error) {
  fail(`print:kimi-latest-intake-paths must print JSON: ${error.message}`, {
    stdout: printResult.stdout.trim(),
  });
}

assert(printJson.status === 'ready', 'latest intake paths must be ready after output intake prep');
assert(printJson.latest_intake_root && existsSync(printJson.latest_intake_root), 'latest_intake_root must exist');
assert(printJson.readme && existsSync(printJson.readme), 'readme must exist');
assert(printJson.intake_folder_map && existsSync(printJson.intake_folder_map), 'intake_folder_map must exist');
assert(Array.isArray(printJson.missing_paths) && printJson.missing_paths.length === 0, 'missing_paths must be empty');

for (const key of [
  'controller_summary',
  'claude_audit',
  'codex_merge_queue',
  'blocked_or_rejected',
  'streams_root',
]) {
  assert(printJson.paths?.[key] && existsSync(printJson.paths[key]), `paths.${key} must exist`);
}

for (const stream of ['A', 'F', 'N', 'J', 'H', 'I', 'O', 'M', 'K', 'L', 'Q', 'S']) {
  const streamPaths = printJson.stream_paths?.[stream];
  assert(streamPaths, `stream_paths.${stream} must exist`);
  for (const key of ['worker_reports', 'created_or_modified_files', 'claude_verdict']) {
    assert(streamPaths[key] && existsSync(streamPaths[key]), `stream_paths.${stream}.${key} must exist`);
  }
}

for (const [content, filePath, snippet] of [
  [context, contextPath, 'Kimi latest intake paths printer'],
  [context, contextPath, 'print:kimi-latest-intake-paths'],
  [backlog, backlogPath, 'Kimi latest intake paths printer'],
  [backlog, backlogPath, 'check:kimi-latest-intake-paths'],
  [audit, auditPath, 'Kimi latest intake paths printer'],
  [quickStart, quickStartPath, 'npm run print:kimi-latest-intake-paths'],
  [manifest, manifestPath, 'print:kimi-latest-intake-paths'],
]) {
  assertIncludes(content, snippet, filePath);
}

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(printScript),
  'Kimi latest intake paths printer must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  package_scripts_checked: [
    'print:kimi-latest-intake-paths',
    'check:kimi-latest-intake-paths',
  ],
  latest_intake_root_checked: printJson.latest_intake_root,
  streams_checked: 12,
  safety_boundaries_checked: true,
}, null, 2));
