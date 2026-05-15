import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docsRoot = resolve('..', 'docs');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const summaryScriptPath = resolve('scripts', 'summarize-kimi-output-intake.mjs');
const validatorPath = resolve('scripts', 'validate-kimi-output-intake-summary.mjs');
const contextPath = resolve(docsRoot, 'gcsc-active-context.md');
const backlogPath = resolve(docsRoot, 'smartcontractor-backlog.md');
const auditPath = resolve(docsRoot, 'gcsc-real-status-audit-2026-05-11.md');
const quickStartPath = resolve(docsRoot, 'gcsc-founder-kimi-claude-quick-start-2026-05-14.md');
const manifestPath = resolve(docsRoot, 'gcsc-kimi-claude-codex-handoff-bundle-manifest-2026-05-14.md');
const trackerPath = resolve(docsRoot, 'gcsc-kimi-wave-one-progress-tracker-2026-05-14.md');

function fail(message) {
  console.error(`Kimi output intake summary validation failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function readRequired(filePath) {
  assert(existsSync(filePath), `Missing required file: ${filePath}`);
  return readFileSync(filePath, 'utf8');
}

function assertIncludes(content, snippet, file) {
  assert(
    content.toLowerCase().includes(snippet.toLowerCase()),
    `${file} must include: ${snippet}`
  );
}

const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const summaryScript = readRequired(summaryScriptPath);
const validator = readRequired(validatorPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const quickStart = readRequired(quickStartPath);
const manifest = readRequired(manifestPath);
const tracker = readRequired(trackerPath);

const streams = ['A', 'F', 'N', 'J', 'H', 'I', 'O', 'M', 'K', 'L', 'Q', 'S'];
for (const stream of streams) {
  assertIncludes(summaryScript, `'${stream}'`, summaryScriptPath);
}

for (const snippet of [
  'kimi-wave-one-output-intake-',
  'worker-reports',
  'created-or-modified-files',
  'claude-verdict',
  '00-controller-summary',
  '01-claude-audit',
  '02-codex-merge-queue',
  '99-blocked-or-rejected',
  'streams_with_worker_reports',
  'secretPattern',
  'liveRiskPattern',
  'blocked_for_review',
  'safety_boundaries_checked',
]) {
  assertIncludes(summaryScript, snippet, summaryScriptPath);
}

for (const boundary of [
  'live Supabase',
  'deployment',
  'public launch',
  'legal decisions',
  'real payments',
  'real loans',
  'escrow',
  'repayment routing',
  'stablecoin settlement',
  'token collateral',
  'XPR signatures',
]) {
  assertIncludes(summaryScript, boundary, summaryScriptPath);
}

assert(
  packageJson.scripts?.['summarize:kimi-output-intake'] === 'node scripts/summarize-kimi-output-intake.mjs',
  `${packagePath} must define summarize:kimi-output-intake`
);
assert(
  packageJson.scripts?.['check:kimi-output-intake-summary'] === 'node scripts/validate-kimi-output-intake-summary.mjs',
  `${packagePath} must define check:kimi-output-intake-summary`
);
assertIncludes(runner, '"check:kimi-output-intake-summary"', runnerPath);

for (const [content, file, snippet] of [
  [context, contextPath, 'Kimi output intake summary script'],
  [context, contextPath, 'Kimi output intake summary validator'],
  [backlog, backlogPath, 'Kimi output intake summary script'],
  [backlog, backlogPath, 'Kimi output intake summary validator'],
  [audit, auditPath, 'Kimi output intake summary script'],
  [audit, auditPath, 'Kimi output intake summary validator'],
  [quickStart, quickStartPath, 'npm run summarize:kimi-output-intake'],
  [manifest, manifestPath, 'npm run summarize:kimi-output-intake'],
  [tracker, trackerPath, 'npm run summarize:kimi-output-intake'],
]) {
  assertIncludes(content, snippet, file);
}

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(summaryScript),
  'Kimi output intake summary script must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  streams_checked: streams.length,
  package_scripts_checked: [
    'summarize:kimi-output-intake',
    'check:kimi-output-intake-summary',
  ],
  safety_boundaries_checked: true,
}, null, 2));
