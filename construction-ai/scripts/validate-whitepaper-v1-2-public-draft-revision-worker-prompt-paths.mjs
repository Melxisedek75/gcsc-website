import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docsRoot = resolve('..', 'docs');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const printScriptPath = resolve('scripts', 'print-whitepaper-v1-2-public-draft-revision-worker-prompt-paths.mjs');
const prepareScriptPath = resolve('scripts', 'prepare-whitepaper-v1-2-public-draft-revision-worker-prompts.mjs');
const contextPath = resolve(docsRoot, 'gcsc-active-context.md');
const backlogPath = resolve(docsRoot, 'smartcontractor-backlog.md');
const realStatusPath = resolve(docsRoot, 'gcsc-real-status-audit-2026-05-11.md');

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
const prepareScript = readRequired(prepareScriptPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realStatus = readRequired(realStatusPath);

assert(
  packageJson.scripts?.['print:whitepaper-v1-2-public-draft-revision-worker-prompt-paths'] === 'node scripts/print-whitepaper-v1-2-public-draft-revision-worker-prompt-paths.mjs',
  `${packagePath} must define print:whitepaper-v1-2-public-draft-revision-worker-prompt-paths`
);
assert(
  packageJson.scripts?.['check:whitepaper-v1-2-public-draft-revision-worker-prompt-paths'] === 'node scripts/validate-whitepaper-v1-2-public-draft-revision-worker-prompt-paths.mjs',
  `${packagePath} must define check:whitepaper-v1-2-public-draft-revision-worker-prompt-paths`
);
assertIncludes(runner, '"check:whitepaper-v1-2-public-draft-revision-worker-prompt-paths"', runnerPath);

for (const snippet of [
  'whitepaper-v1-2-public-draft-revision-worker-prompts-',
  'worker-assignment.csv',
  'manifest.json',
  'Kimi-A',
  'Kimi-B',
  'Kimi-C',
  'Kimi-D',
  'Kimi-E',
  'Claude-Audit',
  'Codex-Integration',
  'latest_prompt_root',
  'worker_prompt_files',
  'worker_prompt_upload_allowlist',
  'worker_prompt_upload_blocklist',
  'whole project',
  '.env',
  'credentials',
  'private customer data',
  'dispatch_brief',
  'total_workers',
  'review_order',
  'No secrets',
  'No public publication',
  'No live Supabase',
  'No real payments',
  'No legal',
]) {
  assertIncludes(printScript, snippet, printScriptPath);
}

assertIncludes(prepareScript, 'worker-assignment.csv', prepareScriptPath);

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
  'scripts/print-whitepaper-v1-2-public-draft-revision-worker-prompt-paths.mjs',
], {
  cwd: resolve('.'),
  encoding: 'utf8',
  shell: false,
});

if (printResult.error) fail(printResult.error.message);
assert(
  printResult.status === 0,
  'print:whitepaper-v1-2-public-draft-revision-worker-prompt-paths failed',
  { stdout: printResult.stdout, stderr: printResult.stderr }
);

let printJson;
try {
  printJson = JSON.parse(printResult.stdout);
} catch (error) {
  fail(`print worker prompt paths must print JSON: ${error.message}`, {
    stdout: printResult.stdout.trim(),
  });
}

assert(printJson.status === 'ready', 'latest worker prompt paths must be ready after prompt prep', { printJson });
assert(printJson.dispatch_brief?.total_workers === 7, 'dispatch_brief must report the seven-worker revision packet', { printJson });
assert(printJson.dispatch_brief?.safe_use === 'local_only', 'dispatch_brief must keep the packet local-only', { printJson });
assert(Array.isArray(printJson.worker_prompt_upload_allowlist), 'worker_prompt_upload_allowlist must be an array', { printJson });
assert(Array.isArray(printJson.worker_prompt_upload_blocklist), 'worker_prompt_upload_blocklist must be an array', { printJson });
assert(
  Array.isArray(printJson.dispatch_brief?.review_order) &&
    printJson.dispatch_brief.review_order.join('>').includes('Kimi workers>Claude-Audit>Codex-Integration'),
  'dispatch_brief must preserve the Kimi -> Claude -> Codex review order',
  { printJson }
);
for (const key of ['latest_prompt_root', 'prompt_folder', 'worker_assignment_csv', 'manifest', 'readme']) {
  assert(printJson[key] && existsSync(printJson[key]), `Printed ${key} must exist`, { printJson });
}
for (const allowedPath of [
  printJson.latest_prompt_root,
  printJson.prompt_folder,
  printJson.worker_assignment_csv,
  printJson.manifest,
  printJson.readme,
]) {
  assert(
    printJson.worker_prompt_upload_allowlist.includes(allowedPath),
    `worker_prompt_upload_allowlist must include ${allowedPath}`,
    { printJson }
  );
}
for (const workerId of ['Kimi-A', 'Kimi-B', 'Kimi-C', 'Kimi-D', 'Kimi-E', 'Claude-Audit', 'Codex-Integration']) {
  const promptPath = printJson.worker_prompt_files?.[workerId];
  assert(promptPath && existsSync(promptPath), `Printed worker prompt must exist for ${workerId}`, { printJson });
  assert(
    printJson.worker_prompt_upload_allowlist.includes(promptPath),
    `worker_prompt_upload_allowlist must include ${workerId} prompt`,
    { printJson }
  );
}
for (const blockedSnippet of ['whole project', '.env', 'credentials', 'private customer data']) {
  assert(
    printJson.worker_prompt_upload_blocklist.some((entry) => entry.toLowerCase().includes(blockedSnippet)),
    `worker_prompt_upload_blocklist must include ${blockedSnippet}`,
    { printJson }
  );
}
assert(Array.isArray(printJson.missing_files) && printJson.missing_files.length === 0, 'missing_files must be empty');

for (const [content, filePath, snippet] of [
  [context, contextPath, 'Whitepaper v1.2 public draft revision worker prompt paths printer'],
  [context, contextPath, 'print:whitepaper-v1-2-public-draft-revision-worker-prompt-paths'],
  [context, contextPath, 'worker prompt upload allowlist'],
  [backlog, backlogPath, 'Whitepaper v1.2 public draft revision worker prompt paths printer'],
  [backlog, backlogPath, 'check:whitepaper-v1-2-public-draft-revision-worker-prompt-paths'],
  [backlog, backlogPath, 'Whitepaper revision worker prompt upload allowlist'],
  [realStatus, realStatusPath, 'Whitepaper v1.2 public draft revision worker prompt paths printer'],
  [realStatus, realStatusPath, 'Whitepaper revision worker prompt upload allowlist'],
]) {
  assertIncludes(content, snippet, filePath);
}

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(`${printScript}\n${printResult.stdout}`),
  'Worker prompt path printer must not contain secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  print_script_checked: 'print:whitepaper-v1-2-public-draft-revision-worker-prompt-paths',
  latest_prompt_root_checked: printJson.latest_prompt_root,
  worker_assignment_csv_checked: printJson.worker_assignment_csv,
  worker_prompts_checked: Object.keys(printJson.worker_prompt_files).length,
  safety_boundaries_checked: true,
}, null, 2));
