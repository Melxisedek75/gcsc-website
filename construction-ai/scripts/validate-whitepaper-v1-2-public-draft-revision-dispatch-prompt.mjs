import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const printScriptPath = resolve('scripts', 'print-whitepaper-v1-2-public-draft-revision-dispatch-prompt.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realStatusPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message, details = {}) {
  console.error(JSON.stringify({
    status: 'failed',
    message,
    ...details,
  }, null, 2));
  process.exit(1);
}

function assert(condition, message, details = {}) {
  if (!condition) fail(message, details);
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
const realStatus = readRequired(realStatusPath);

assert(
  packageJson.scripts?.['print:whitepaper-v1-2-public-draft-revision-dispatch-prompt'] === 'node scripts/print-whitepaper-v1-2-public-draft-revision-dispatch-prompt.mjs',
  `${packagePath} must define print:whitepaper-v1-2-public-draft-revision-dispatch-prompt`
);
assert(
  packageJson.scripts?.['check:whitepaper-v1-2-public-draft-revision-dispatch-prompt'] === 'node scripts/validate-whitepaper-v1-2-public-draft-revision-dispatch-prompt.mjs',
  `${packagePath} must define check:whitepaper-v1-2-public-draft-revision-dispatch-prompt`
);
assertIncludes(runner, '"check:whitepaper-v1-2-public-draft-revision-dispatch-prompt"', runnerPath);

for (const snippet of [
  'whitepaper-v1-2-public-draft-revision-worker-prompts-',
  'Start here for whitepaper v1.2 public draft revision dispatch',
  'Kimi-A',
  'Kimi-B',
  'Kimi-C',
  'Kimi-D',
  'Kimi-E',
  'Claude-Audit',
  'Codex-Integration',
  'worker-assignment.csv',
  'manifest.json',
  'Kimi workers -> Claude-Audit -> Codex-Integration',
  'Do not publish',
  'Do not add secrets',
  'Do not perform live Supabase changes',
  'Do not perform real payments',
  'Do not make legal',
]) {
  assertIncludes(printScript, snippet, printScriptPath);
}

const prepareResult = spawnSync(process.execPath, [
  'scripts/prepare-whitepaper-v1-2-public-draft-revision-worker-prompts.mjs',
], {
  cwd: resolve('.'),
  encoding: 'utf8',
  shell: false,
});

if (prepareResult.error) fail(prepareResult.error.message);
assert(
  prepareResult.status === 0,
  'prepare:whitepaper-v1-2-public-draft-revision-worker-prompts failed',
  { stdout: prepareResult.stdout, stderr: prepareResult.stderr }
);

const printResult = spawnSync(process.execPath, [
  'scripts/print-whitepaper-v1-2-public-draft-revision-dispatch-prompt.mjs',
], {
  cwd: resolve('.'),
  encoding: 'utf8',
  shell: false,
});

if (printResult.error) fail(printResult.error.message);
assert(
  printResult.status === 0,
  'print:whitepaper-v1-2-public-draft-revision-dispatch-prompt failed',
  { stdout: printResult.stdout, stderr: printResult.stderr }
);

const output = printResult.stdout;
for (const snippet of [
  'Start here for whitepaper v1.2 public draft revision dispatch',
  'Use this local-only prompt bundle in this order:',
  'worker-assignment.csv',
  'manifest.json',
  'Kimi-A-prompt.md',
  'Kimi-B-prompt.md',
  'Kimi-C-prompt.md',
  'Kimi-D-prompt.md',
  'Kimi-E-prompt.md',
  'Claude-Audit-prompt.md',
  'Codex-Integration-prompt.md',
  'Kimi workers -> Claude-Audit -> Codex-Integration',
  'Do not publish',
  'Do not add secrets',
  'Do not perform live Supabase changes',
  'Do not perform real payments',
  'Do not make legal',
]) {
  assertIncludes(output, snippet, 'dispatch prompt output');
}

for (const [content, filePath, snippet] of [
  [context, contextPath, 'Whitepaper v1.2 public draft revision dispatch prompt printer'],
  [context, contextPath, 'print:whitepaper-v1-2-public-draft-revision-dispatch-prompt'],
  [backlog, backlogPath, 'Whitepaper v1.2 public draft revision dispatch prompt printer'],
  [backlog, backlogPath, 'check:whitepaper-v1-2-public-draft-revision-dispatch-prompt'],
  [realStatus, realStatusPath, 'Whitepaper v1.2 public draft revision dispatch prompt printer'],
]) {
  assertIncludes(content, snippet, filePath);
}

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(`${printScript}\n${output}`),
  'Dispatch prompt printer must not contain secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  print_script_checked: 'print:whitepaper-v1-2-public-draft-revision-dispatch-prompt',
  output_lines_checked: output.trim().split(/\r?\n/).length,
  safety_boundaries_checked: true,
}, null, 2));
