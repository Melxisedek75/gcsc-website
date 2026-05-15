import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docsRoot = resolve('..', 'docs');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const printScriptPath = resolve('scripts', 'print-kimi-latest-merge-queue-paths.mjs');
const contextPath = resolve(docsRoot, 'gcsc-active-context.md');
const backlogPath = resolve(docsRoot, 'smartcontractor-backlog.md');
const auditPath = resolve(docsRoot, 'gcsc-real-status-audit-2026-05-11.md');
const quickStartPath = resolve(docsRoot, 'gcsc-founder-kimi-claude-quick-start-2026-05-14.md');
const manifestPath = resolve(docsRoot, 'gcsc-kimi-claude-codex-handoff-bundle-manifest-2026-05-14.md');
const trackerPath = resolve(docsRoot, 'gcsc-kimi-wave-one-progress-tracker-2026-05-14.md');

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
const tracker = readRequired(trackerPath);

assert(
  packageJson.scripts?.['print:kimi-latest-merge-queue-paths'] === 'node scripts/print-kimi-latest-merge-queue-paths.mjs',
  `${packagePath} must define print:kimi-latest-merge-queue-paths`
);
assert(
  packageJson.scripts?.['check:kimi-latest-merge-queue-paths'] === 'node scripts/validate-kimi-latest-merge-queue-paths.mjs',
  `${packagePath} must define check:kimi-latest-merge-queue-paths`
);
assertIncludes(runner, '"check:kimi-latest-merge-queue-paths"', runnerPath);

for (const snippet of [
  'codex-kimi-integration-merge-queue-wave-one-',
  'gcsc-codex-kimi-integration-merge-queue-template-2026-05-14.md',
  'gcsc-kimi-output-integration-intake-checklist-2026-05-14.md',
  'gcsc-kimi-worker-output-package-template-2026-05-14.md',
  'gcsc-claude-kimi-audit-report-template-2026-05-14.md',
  'kimi-wave-one-output-intake-',
  '02-codex-merge-queue',
  '99-blocked-or-rejected',
  'latest_merge_queue',
  'PASS_LOCAL_ONLY',
  'No secrets',
  'No live Supabase',
  'No deployment',
  'No real payments',
  'No legal',
]) {
  assertIncludes(printScript, snippet, printScriptPath);
}

const printResult = spawnSync(process.execPath, ['scripts/print-kimi-latest-merge-queue-paths.mjs'], {
  cwd: resolve('.'),
  encoding: 'utf8',
  shell: false,
});

if (printResult.error) fail(printResult.error.message);
assert(
  printResult.status === 0,
  `print:kimi-latest-merge-queue-paths failed: ${printResult.stderr || printResult.stdout}`
);

let printJson;
try {
  printJson = JSON.parse(printResult.stdout);
} catch (error) {
  fail(`print:kimi-latest-merge-queue-paths must print JSON: ${error.message}`, {
    stdout: printResult.stdout.trim(),
  });
}

assert(printJson.status === 'ready', 'latest Kimi merge queue paths must be ready after merge queue prep');
assert(printJson.latest_merge_queue && existsSync(printJson.latest_merge_queue), 'latest_merge_queue must exist');
assert(Array.isArray(printJson.missing_paths) && printJson.missing_paths.length === 0, 'missing_paths must be empty');

for (const key of [
  'merge_queue',
  'merge_queue_template',
  'output_intake_checklist',
  'worker_output_template',
  'claude_audit_template',
]) {
  assert(printJson.paths?.[key] && existsSync(printJson.paths[key]), `paths.${key} must exist`);
}

assert(
  !printJson.paths.latest_intake_root || existsSync(printJson.paths.latest_intake_root),
  'paths.latest_intake_root must exist when present'
);

for (const [content, filePath, snippet] of [
  [context, contextPath, 'Kimi latest merge queue paths printer'],
  [context, contextPath, 'print:kimi-latest-merge-queue-paths'],
  [backlog, backlogPath, 'Kimi latest merge queue paths printer'],
  [backlog, backlogPath, 'check:kimi-latest-merge-queue-paths'],
  [audit, auditPath, 'Kimi latest merge queue paths printer'],
  [quickStart, quickStartPath, 'npm run print:kimi-latest-merge-queue-paths'],
  [manifest, manifestPath, 'print:kimi-latest-merge-queue-paths'],
  [tracker, trackerPath, 'npm run print:kimi-latest-merge-queue-paths'],
]) {
  assertIncludes(content, snippet, filePath);
}

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(printScript),
  'Kimi latest merge queue paths printer must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  package_scripts_checked: [
    'print:kimi-latest-merge-queue-paths',
    'check:kimi-latest-merge-queue-paths',
  ],
  latest_merge_queue_checked: printJson.latest_merge_queue,
  safety_boundaries_checked: true,
}, null, 2));
