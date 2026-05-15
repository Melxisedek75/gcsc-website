import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docsRoot = resolve('..', 'docs');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const printScriptPath = resolve('scripts', 'print-claude-kimi-latest-audit-bundle-paths.mjs');
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
  packageJson.scripts?.['print:claude-kimi-latest-audit-bundle-paths'] === 'node scripts/print-claude-kimi-latest-audit-bundle-paths.mjs',
  `${packagePath} must define print:claude-kimi-latest-audit-bundle-paths`
);
assert(
  packageJson.scripts?.['check:claude-kimi-latest-audit-bundle-paths'] === 'node scripts/validate-claude-kimi-latest-audit-bundle-paths.mjs',
  `${packagePath} must define check:claude-kimi-latest-audit-bundle-paths`
);
assertIncludes(runner, '"check:claude-kimi-latest-audit-bundle-paths"', runnerPath);

for (const snippet of [
  'claude-kimi-audit-',
  'CLAUDE-AUDIT-PROMPT.txt',
  'kimi-output-to-add',
  'PUT-KIMI-OUTPUT-HERE.txt',
  'gcsc-claude-kimi-output-audit-work-order-2026-05-14.md',
  'gcsc-claude-kimi-audit-report-template-2026-05-14.md',
  'latest_audit_bundle_root',
  'claude_upload_allowlist',
  'claude_upload_blocklist',
  'No secrets',
  '.env',
  'credentials',
  'private customer data',
  'whole project',
  'No live Supabase',
  'No deployment',
  'No real payments',
  'No legal',
]) {
  assertIncludes(printScript, snippet, printScriptPath);
}

const prepareResult = spawnSync(process.execPath, ['scripts/prepare-claude-kimi-audit-bundle.mjs'], {
  cwd: resolve('.'),
  encoding: 'utf8',
  shell: false,
});

if (prepareResult.error) fail(prepareResult.error.message);
assert(
  prepareResult.status === 0,
  `prepare:claude-kimi-audit-bundle failed: ${prepareResult.stderr || prepareResult.stdout}`
);

const printResult = spawnSync(process.execPath, ['scripts/print-claude-kimi-latest-audit-bundle-paths.mjs'], {
  cwd: resolve('.'),
  encoding: 'utf8',
  shell: false,
});

if (printResult.error) fail(printResult.error.message);
assert(
  printResult.status === 0,
  `print:claude-kimi-latest-audit-bundle-paths failed: ${printResult.stderr || printResult.stdout}`
);

let printJson;
try {
  printJson = JSON.parse(printResult.stdout);
} catch (error) {
  fail(`print:claude-kimi-latest-audit-bundle-paths must print JSON: ${error.message}`, {
    stdout: printResult.stdout.trim(),
  });
}

assert(printJson.status === 'ready', 'latest Claude Kimi audit bundle paths must be ready after bundle prep');
assert(printJson.latest_audit_bundle_root && existsSync(printJson.latest_audit_bundle_root), 'latest_audit_bundle_root must exist');
assert(Array.isArray(printJson.missing_paths) && printJson.missing_paths.length === 0, 'missing_paths must be empty');
assert(Array.isArray(printJson.claude_upload_allowlist), 'claude_upload_allowlist must be an array');
assert(Array.isArray(printJson.claude_upload_blocklist), 'claude_upload_blocklist must be an array');

for (const key of [
  'bundle_root',
  'readme',
  'prompt_file',
  'kimi_output_folder',
  'kimi_output_placeholder',
]) {
  assert(printJson.paths?.[key] && existsSync(printJson.paths[key]), `paths.${key} must exist`);
}
for (const allowedPath of [
  printJson.paths?.bundle_root,
  printJson.paths?.kimi_output_folder,
  printJson.paths?.prompt_file,
].filter(Boolean)) {
  assert(
    printJson.claude_upload_allowlist.includes(allowedPath),
    `claude_upload_allowlist must include ${allowedPath}`
  );
}
for (const blockedSnippet of [
  'whole project',
  '.env',
  'credentials',
  'private customer data',
]) {
  assert(
    printJson.claude_upload_blocklist.some((entry) => entry.includes(blockedSnippet)),
    `claude_upload_blocklist must include ${blockedSnippet}`
  );
}

for (const [relativePath, fullPath] of Object.entries(printJson.paths?.copied_files ?? {})) {
  assert(fullPath && existsSync(fullPath), `copied_files.${relativePath} must exist`);
}
assert(Object.keys(printJson.paths?.copied_files ?? {}).length === 7, 'copied_files must include seven audit source files');

for (const [content, filePath, snippet] of [
  [context, contextPath, 'Claude Kimi latest audit bundle paths printer'],
  [context, contextPath, 'print:claude-kimi-latest-audit-bundle-paths'],
  [context, contextPath, 'Claude upload allowlist'],
  [backlog, backlogPath, 'Claude Kimi latest audit bundle paths printer'],
  [backlog, backlogPath, 'check:claude-kimi-latest-audit-bundle-paths'],
  [backlog, backlogPath, 'Claude Kimi audit upload allowlist'],
  [audit, auditPath, 'Claude Kimi latest audit bundle paths printer'],
  [audit, auditPath, 'Claude Kimi audit upload allowlist'],
  [quickStart, quickStartPath, 'npm run print:claude-kimi-latest-audit-bundle-paths'],
  [manifest, manifestPath, 'print:claude-kimi-latest-audit-bundle-paths'],
]) {
  assertIncludes(content, snippet, filePath);
}

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(printScript),
  'Claude Kimi latest audit bundle paths printer must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  package_scripts_checked: [
    'print:claude-kimi-latest-audit-bundle-paths',
    'check:claude-kimi-latest-audit-bundle-paths',
  ],
  latest_audit_bundle_root_checked: printJson.latest_audit_bundle_root,
  copied_files_checked: Object.keys(printJson.paths.copied_files).length,
  safety_boundaries_checked: true,
}, null, 2));
