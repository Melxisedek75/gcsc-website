import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docsRoot = resolve('..', 'docs');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const printScriptPath = resolve('scripts', 'print-kimi-latest-launch-paths.mjs');
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
  packageJson.scripts?.['print:kimi-latest-launch-paths'] === 'node scripts/print-kimi-latest-launch-paths.mjs',
  `${packagePath} must define print:kimi-latest-launch-paths`
);
assert(
  packageJson.scripts?.['check:kimi-latest-launch-paths'] === 'node scripts/validate-kimi-latest-launch-paths.mjs',
  `${packagePath} must define check:kimi-latest-launch-paths`
);
assertIncludes(runner, '"check:kimi-latest-launch-paths"', runnerPath);

for (const snippet of [
  'kimi-wave-one-handoff-',
  'kimi-wave-one-agent-prompts-',
  'whitepaper-v1-2-public-draft-revision-worker-prompts-',
  'KIMI-FOUNDER-PROMPT.txt',
  'KIMI-WHITEPAPER-DISPATCH-PROMPT.txt',
  'KIMI-CONTROLLER-START-HERE.txt',
  'CONTROLLER-START-HERE.txt',
  'bundle-files.json',
  'manifest.json',
  'agent-assignment.csv',
  'latest_bundle_root',
  'latest_agent_prompt_root',
  'latest_whitepaper_revision_prompt_root',
  'controller_start_here',
  'whitepaper_revision_controller_start_here',
  'whitepaper_dispatch_prompt',
  'No secrets',
  'No live Supabase',
  'No deployment',
  'No real payments',
  'No legal',
]) {
  assertIncludes(printScript, snippet, printScriptPath);
}

const prepareResult = spawnSync(process.execPath, ['scripts/prepare-kimi-founder-launch.mjs'], {
  cwd: resolve('.'),
  encoding: 'utf8',
  shell: false,
});

if (prepareResult.error) fail(prepareResult.error.message);
assert(
  prepareResult.status === 0,
  `prepare:kimi-founder-launch failed: ${prepareResult.stderr || prepareResult.stdout}`
);

const prepareWhitepaperResult = spawnSync(
  process.execPath,
  ['scripts/prepare-whitepaper-v1-2-public-draft-revision-worker-prompts.mjs'],
  {
    cwd: resolve('.'),
    encoding: 'utf8',
    shell: false,
  }
);

if (prepareWhitepaperResult.error) fail(prepareWhitepaperResult.error.message);
assert(
  prepareWhitepaperResult.status === 0,
  `prepare:whitepaper-v1-2-public-draft-revision-worker-prompts failed: ${prepareWhitepaperResult.stderr || prepareWhitepaperResult.stdout}`
);

const printResult = spawnSync(process.execPath, ['scripts/print-kimi-latest-launch-paths.mjs'], {
  cwd: resolve('.'),
  encoding: 'utf8',
  shell: false,
});

if (printResult.error) fail(printResult.error.message);
assert(
  printResult.status === 0,
  `print:kimi-latest-launch-paths failed: ${printResult.stderr || printResult.stdout}`
);

let printJson;
try {
  printJson = JSON.parse(printResult.stdout);
} catch (error) {
  fail(`print:kimi-latest-launch-paths must print JSON: ${error.message}`, {
    stdout: printResult.stdout.trim(),
  });
}

assert(printJson.status === 'ready', 'latest launch paths must be ready after founder launch prep');
for (const key of [
  'latest_bundle_root',
  'latest_agent_prompt_root',
  'latest_whitepaper_revision_prompt_root',
  'controller_start_here',
  'whitepaper_revision_controller_start_here',
  'founder_prompt',
  'whitepaper_dispatch_prompt',
  'bundle_manifest',
  'prompt_manifest',
  'agent_assignment_csv',
]) {
  assert(printJson[key] && existsSync(printJson[key]), `Printed ${key} must exist`);
}
assert(Array.isArray(printJson.missing_files) && printJson.missing_files.length === 0, 'missing_files must be empty');

for (const [content, filePath, snippet] of [
  [context, contextPath, 'Kimi latest launch paths printer'],
  [context, contextPath, 'print:kimi-latest-launch-paths'],
  [context, contextPath, 'whitepaper revision controller start-here'],
  [backlog, backlogPath, 'Kimi latest launch paths printer'],
  [backlog, backlogPath, 'check:kimi-latest-launch-paths'],
  [backlog, backlogPath, 'whitepaper revision controller start-here'],
  [audit, auditPath, 'Kimi latest launch paths printer'],
  [audit, auditPath, 'whitepaper revision controller start-here'],
  [quickStart, quickStartPath, 'npm run print:kimi-latest-launch-paths'],
  [quickStart, quickStartPath, 'whitepaper revision controller start-here'],
  [manifest, manifestPath, 'print:kimi-latest-launch-paths'],
  [manifest, manifestPath, 'whitepaper revision controller start-here'],
]) {
  assertIncludes(content, snippet, filePath);
}

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(printScript),
  'Kimi latest launch paths printer must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  package_scripts_checked: [
    'print:kimi-latest-launch-paths',
    'check:kimi-latest-launch-paths',
  ],
  latest_bundle_root_checked: printJson.latest_bundle_root,
  latest_agent_prompt_root_checked: printJson.latest_agent_prompt_root,
  latest_whitepaper_revision_prompt_root_checked: printJson.latest_whitepaper_revision_prompt_root,
  whitepaper_revision_controller_start_here_checked: printJson.whitepaper_revision_controller_start_here,
  agent_assignment_csv_checked: printJson.agent_assignment_csv,
  safety_boundaries_checked: true,
}, null, 2));
