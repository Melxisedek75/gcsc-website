import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const prepareScriptPath = resolve('scripts', 'prepare-whitepaper-v1-2-public-draft-revision-worker-prompts.mjs');
const printScriptPath = resolve('scripts', 'print-whitepaper-v1-2-public-draft-revision-controller-start-here.mjs');
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
const prepareScript = readRequired(prepareScriptPath);
const printScript = readRequired(printScriptPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realStatus = readRequired(realStatusPath);

assert(
  packageJson.scripts?.['print:whitepaper-v1-2-public-draft-revision-controller-start-here'] === 'node scripts/print-whitepaper-v1-2-public-draft-revision-controller-start-here.mjs',
  `${packagePath} must define print:whitepaper-v1-2-public-draft-revision-controller-start-here`
);
assert(
  packageJson.scripts?.['check:whitepaper-v1-2-public-draft-revision-controller-start-here'] === 'node scripts/validate-whitepaper-v1-2-public-draft-revision-controller-start-here.mjs',
  `${packagePath} must define check:whitepaper-v1-2-public-draft-revision-controller-start-here`
);
assertIncludes(runner, '"check:whitepaper-v1-2-public-draft-revision-controller-start-here"', runnerPath);

for (const snippet of [
  'CONTROLLER-START-HERE.txt',
  'Start here for whitepaper v1.2 public draft revision controller',
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
  'Upload allowlist',
  'Do not upload the whole project',
  'Do not upload .env files',
  'Do not upload credentials',
  'Do not upload private customer data',
  'Do not publish',
  'Do not add secrets',
  'Do not perform live Supabase changes',
  'Do not perform real payments',
  'Do not make legal',
]) {
  assertIncludes(prepareScript, snippet, prepareScriptPath);
}

for (const snippet of [
  'whitepaper-v1-2-public-draft-revision-worker-prompts-',
  'CONTROLLER-START-HERE.txt',
  'Start here for whitepaper v1.2 public draft revision controller',
  'worker-assignment.csv',
  'manifest.json',
  'Kimi-A-prompt.md',
  'Claude-Audit-prompt.md',
  'Codex-Integration-prompt.md',
  'Upload allowlist',
  'Do not upload the whole project',
  'Do not upload .env files',
  'Do not upload credentials',
  'Do not upload private customer data',
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

let prepareJson;
try {
  prepareJson = JSON.parse(prepareResult.stdout);
} catch (error) {
  fail(`prepare worker prompts must print JSON: ${error.message}`, { stdout: prepareResult.stdout });
}

const outputRoot = prepareJson.output_root;
assert(outputRoot, 'prepare output must include output_root');

const controllerStartHerePath = join(outputRoot, 'CONTROLLER-START-HERE.txt');
const controllerStartHere = readRequired(controllerStartHerePath);

for (const snippet of [
  'Start here for whitepaper v1.2 public draft revision controller',
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
  'Upload allowlist',
  'Do not upload the whole project',
  'Do not upload .env files',
  'Do not upload credentials',
  'Do not upload private customer data',
  'Do not publish',
  'Do not add secrets',
  'Do not perform live Supabase changes',
  'Do not perform real payments',
  'Do not make legal',
]) {
  assertIncludes(controllerStartHere, snippet, controllerStartHerePath);
}

const printResult = spawnSync(process.execPath, [
  'scripts/print-whitepaper-v1-2-public-draft-revision-controller-start-here.mjs',
], {
  cwd: resolve('.'),
  encoding: 'utf8',
  shell: false,
});

if (printResult.error) fail(printResult.error.message);
assert(
  printResult.status === 0,
  'print:whitepaper-v1-2-public-draft-revision-controller-start-here failed',
  { stdout: printResult.stdout, stderr: printResult.stderr }
);

for (const snippet of [
  'Start here for whitepaper v1.2 public draft revision controller',
  'worker-assignment.csv',
  'manifest.json',
  'Kimi-A-prompt.md',
  'Claude-Audit-prompt.md',
  'Codex-Integration-prompt.md',
  'Kimi workers -> Claude-Audit -> Codex-Integration',
  'Upload allowlist',
  'Do not upload the whole project',
  'Do not upload .env files',
  'Do not upload credentials',
  'Do not upload private customer data',
  'Do not publish',
  'Do not add secrets',
  'Do not perform live Supabase changes',
  'Do not perform real payments',
  'Do not make legal',
]) {
  assertIncludes(printResult.stdout, snippet, 'controller start-here output');
}

for (const [content, filePath, snippet] of [
  [context, contextPath, 'Whitepaper v1.2 public draft revision controller start-here file'],
  [context, contextPath, 'print:whitepaper-v1-2-public-draft-revision-controller-start-here'],
  [context, contextPath, 'controller upload allowlist'],
  [backlog, backlogPath, 'Whitepaper v1.2 public draft revision controller start-here file'],
  [backlog, backlogPath, 'check:whitepaper-v1-2-public-draft-revision-controller-start-here'],
  [backlog, backlogPath, 'Whitepaper revision controller upload allowlist'],
  [realStatus, realStatusPath, 'Whitepaper v1.2 public draft revision controller start-here file'],
  [realStatus, realStatusPath, 'Whitepaper revision controller upload allowlist'],
]) {
  assertIncludes(content, snippet, filePath);
}

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(`${prepareScript}\n${printScript}\n${controllerStartHere}\n${printResult.stdout}`),
  'Controller start-here files must not contain secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  print_script_checked: 'print:whitepaper-v1-2-public-draft-revision-controller-start-here',
  controller_start_here_checked: controllerStartHerePath,
  output_lines_checked: printResult.stdout.trim().split(/\r?\n/).length,
  safety_boundaries_checked: true,
}, null, 2));
