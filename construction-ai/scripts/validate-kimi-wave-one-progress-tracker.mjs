import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docsRoot = resolve('..', 'docs');
const trackerPath = resolve(docsRoot, 'gcsc-kimi-wave-one-progress-tracker-2026-05-14.md');
const contextPath = resolve(docsRoot, 'gcsc-active-context.md');
const backlogPath = resolve(docsRoot, 'smartcontractor-backlog.md');
const auditPath = resolve(docsRoot, 'gcsc-real-status-audit-2026-05-11.md');
const quickStartPath = resolve(docsRoot, 'gcsc-founder-kimi-claude-quick-start-2026-05-14.md');
const manifestPath = resolve(docsRoot, 'gcsc-kimi-claude-codex-handoff-bundle-manifest-2026-05-14.md');
const controllerPath = resolve(docsRoot, 'gcsc-kimi-wave-one-controller-launch-packet-2026-05-14.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const prepareBundlePath = resolve('scripts', 'prepare-kimi-handoff-bundle.mjs');
const handoffValidatorPath = resolve('scripts', 'validate-kimi-handoff-bundle.mjs');

function fail(message) {
  console.error(`Kimi Wave One progress tracker validation failed: ${message}`);
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

const tracker = readRequired(trackerPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const quickStart = readRequired(quickStartPath);
const manifest = readRequired(manifestPath);
const controller = readRequired(controllerPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const prepareBundle = readRequired(prepareBundlePath);
const handoffValidator = readRequired(handoffValidatorPath);

const streams = ['A', 'F', 'N', 'J', 'H', 'I', 'O', 'M', 'K', 'L', 'Q', 'S'];
const statuses = [
  'NOT_STARTED',
  'ASSIGNED',
  'IN_PROGRESS',
  'RETURNED',
  'MISSING_REPORT_FIELDS',
  'Q_INTAKE_REVIEW',
  'S_SAFETY_REVIEW',
  'READY_FOR_CLAUDE',
  'CLAUDE_REVIEW',
  'PASS_LOCAL_ONLY',
  'REWORK',
  'BLOCKED_EXTERNAL_REVIEW',
  'FAIL_UNSAFE',
  'CODEX_INTAKE',
  'MERGED_LOCAL',
  'REJECTED',
];

for (const status of statuses) {
  assertIncludes(tracker, status, trackerPath);
}

for (const stream of streams) {
  assertIncludes(tracker, `| ${stream} |`, trackerPath);
  assertIncludes(tracker, `stream-${stream}/`, trackerPath);
}

for (const snippet of [
  'Total first wave: 100 agents.',
  'Per-Agent Row Template',
  'Controller Summary Template',
  'Rows by status',
  'Q Verdict',
  'S Verdict',
  'Claude Verdict',
  'Codex Action',
  'npm run prepare:kimi-handoff-bundle',
  'npm run prepare:kimi-output-intake',
  'npm run check:kimi-output-intake',
  'npm run check:kimi-wave-one-progress-tracker',
  'npm run check',
]) {
  assertIncludes(tracker, snippet, trackerPath);
}

for (const boundary of [
  'live Supabase changes',
  'deployment',
  'external account changes',
  'public launch',
  'legal decisions',
  'real payments',
  'real loans',
  'escrow',
  'repayment routing',
  'stablecoin settlement',
  'token collateral',
  'XPR signatures',
  'app-store actions',
  'secrets',
  'destructive actions',
]) {
  assertIncludes(tracker, boundary, trackerPath);
}

const checkName = 'check:kimi-wave-one-progress-tracker';
assert(
  packageJson.scripts?.[checkName] === 'node scripts/validate-kimi-wave-one-progress-tracker.mjs',
  `${packagePath} must define ${checkName}`
);
assertIncludes(runner, `"${checkName}"`, runnerPath);
assertIncludes(prepareBundle, 'docs/gcsc-kimi-wave-one-progress-tracker-2026-05-14.md', prepareBundlePath);
assertIncludes(handoffValidator, 'gcsc-kimi-wave-one-progress-tracker-2026-05-14.md', handoffValidatorPath);

for (const [content, file, snippet] of [
  [context, contextPath, 'Kimi Wave One progress tracker'],
  [context, contextPath, 'Kimi Wave One progress tracker validator'],
  [backlog, backlogPath, 'Kimi Wave One progress tracker'],
  [backlog, backlogPath, 'Kimi Wave One progress tracker validator'],
  [audit, auditPath, 'Kimi Wave One progress tracker'],
  [audit, auditPath, 'Kimi Wave One progress tracker validator'],
  [quickStart, quickStartPath, 'docs/gcsc-kimi-wave-one-progress-tracker-2026-05-14.md'],
  [manifest, manifestPath, 'docs/gcsc-kimi-wave-one-progress-tracker-2026-05-14.md'],
  [controller, controllerPath, 'docs/gcsc-kimi-wave-one-progress-tracker-2026-05-14.md'],
]) {
  assertIncludes(content, snippet, file);
}

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(tracker),
  'Kimi Wave One progress tracker must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  streams_checked: streams.length,
  statuses_checked: statuses.length,
  package_script_checked: checkName,
  safety_boundaries_checked: true,
}, null, 2));
