import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docsRoot = resolve('..', 'docs');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const promptScriptPath = resolve('scripts', 'prepare-kimi-agent-prompts.mjs');
const contextPath = resolve(docsRoot, 'gcsc-active-context.md');
const backlogPath = resolve(docsRoot, 'smartcontractor-backlog.md');
const auditPath = resolve(docsRoot, 'gcsc-real-status-audit-2026-05-11.md');
const quickStartPath = resolve(docsRoot, 'gcsc-founder-kimi-claude-quick-start-2026-05-14.md');
const manifestPath = resolve(docsRoot, 'gcsc-kimi-claude-codex-handoff-bundle-manifest-2026-05-14.md');

function fail(message) {
  console.error(`Kimi agent prompt validation failed: ${message}`);
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
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const quickStart = readRequired(quickStartPath);
const manifest = readRequired(manifestPath);

assert(
  packageJson.scripts?.['prepare:kimi-agent-prompts'] === 'node scripts/prepare-kimi-agent-prompts.mjs',
  `${packagePath} must define prepare:kimi-agent-prompts`
);
assert(
  packageJson.scripts?.['check:kimi-agent-prompts'] === 'node scripts/validate-kimi-agent-prompts.mjs',
  `${packagePath} must define check:kimi-agent-prompts`
);
assertIncludes(runner, '"check:kimi-agent-prompts"', runnerPath);

for (const snippet of [
  'total_agents: agents.length',
  'agents.length !== 100',
  'A',
  'F',
  'N',
  'J',
  'H',
  'I',
  'O',
  'M',
  'K',
  'L',
  'Q',
  'S',
  'Worker ID:',
  'Stop boundaries checked:',
  'No-touch confirmation:',
  'No secrets',
  'No live Supabase',
  'No deployment',
  'No real payments',
  'No legal',
]) {
  assertIncludes(promptScript, snippet, promptScriptPath);
}

const dryRun = spawnSync(process.execPath, ['scripts/prepare-kimi-agent-prompts.mjs', '--check'], {
  cwd: resolve('.'),
  encoding: 'utf8',
  shell: false,
});

if (dryRun.error) fail(dryRun.error.message);
assert(dryRun.status === 0, `prepare:kimi-agent-prompts --check failed: ${dryRun.stderr || dryRun.stdout}`);

let dryRunJson;
try {
  dryRunJson = JSON.parse(dryRun.stdout);
} catch (error) {
  fail(`prepare:kimi-agent-prompts --check must print JSON: ${error.message}`);
}

assert(dryRunJson.status === 'validated', 'dry-run status must be validated');
assert(dryRunJson.total_agents === 100, 'dry-run must validate exactly 100 agents');
assert(dryRunJson.streams_prepared === 12, 'dry-run must validate 12 streams');
assert(dryRunJson.safety_boundaries_checked === true, 'dry-run must check safety boundaries');

for (const [content, filePath, snippet] of [
  [context, contextPath, 'Kimi agent prompt generator'],
  [context, contextPath, 'prepare:kimi-agent-prompts'],
  [backlog, backlogPath, 'Kimi agent prompt generator'],
  [backlog, backlogPath, 'check:kimi-agent-prompts'],
  [audit, auditPath, 'Kimi agent prompt generator'],
  [quickStart, quickStartPath, 'npm run prepare:kimi-agent-prompts'],
  [manifest, manifestPath, 'prepare:kimi-agent-prompts'],
]) {
  assertIncludes(content, snippet, filePath);
}

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(promptScript),
  'Kimi agent prompt generator must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  package_scripts_checked: [
    'prepare:kimi-agent-prompts',
    'check:kimi-agent-prompts',
  ],
  total_agents_checked: dryRunJson.total_agents,
  streams_checked: dryRunJson.streams_prepared,
  safety_boundaries_checked: true,
}, null, 2));
