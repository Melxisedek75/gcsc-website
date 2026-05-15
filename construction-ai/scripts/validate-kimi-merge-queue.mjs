import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const docsRoot = resolve('..', 'docs');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const prepareScriptPath = resolve('scripts', 'prepare-kimi-merge-queue.mjs');
const validatorPath = resolve('scripts', 'validate-kimi-merge-queue.mjs');
const contextPath = resolve(docsRoot, 'gcsc-active-context.md');
const backlogPath = resolve(docsRoot, 'smartcontractor-backlog.md');
const realStatusAuditPath = resolve(docsRoot, 'gcsc-real-status-audit-2026-05-11.md');
const quickStartPath = resolve(docsRoot, 'gcsc-founder-kimi-claude-quick-start-2026-05-14.md');
const manifestPath = resolve(docsRoot, 'gcsc-kimi-claude-codex-handoff-bundle-manifest-2026-05-14.md');
const trackerPath = resolve(docsRoot, 'gcsc-kimi-wave-one-progress-tracker-2026-05-14.md');
const expectedQueueName = `codex-kimi-integration-merge-queue-wave-one-${new Date().toISOString().slice(0, 10)}.md`;
const queuePath = resolve(docsRoot, expectedQueueName);

function fail(message) {
  console.error(`Kimi merge queue validation failed: ${message}`);
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
const prepareScript = readRequired(prepareScriptPath);
const validator = readRequired(validatorPath);
const queue = readRequired(queuePath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realStatusAudit = readRequired(realStatusAuditPath);
const quickStart = readRequired(quickStartPath);
const manifest = readRequired(manifestPath);
const tracker = readRequired(trackerPath);

const streams = ['N', 'F', 'A', 'J', 'K', 'L', 'H', 'I', 'O', 'M', 'Q', 'S'];
const requiredHeadings = [
  '## Source Inputs',
  '## Hard Reject Precheck',
  '## Stream Queue Matrix',
  '## Accepted Local-Only Streams',
  '## Streams Requiring Rework',
  '## Streams Blocked For Founder External Review',
  '## Commit Plan',
  '## Required Local Checks',
  '## Shared File Edit Plan',
  '## Safety Confirmation',
  '## Final Codex Intake Verdict',
];

for (const stream of streams) {
  assertIncludes(prepareScript, `'${stream}'`, prepareScriptPath);
  assertIncludes(queue, `| ${stream} |`, queuePath);
}

for (const heading of requiredHeadings) {
  assertIncludes(prepareScript, heading, prepareScriptPath);
  assertIncludes(queue, heading, queuePath);
}

for (const snippet of [
  'kimi-wave-one-output-intake-',
  'codex-kimi-integration-merge-queue-wave-one-',
  'REWORK_REQUIRED',
  'PARTIAL_READY',
  'PASS_LOCAL_ONLY',
  'summarize:kimi-output-intake',
  'audit:kimi-worker-reports',
  'check:kimi-output-intake',
  'check:kimi-worker-report-audit',
  'check:real-status-audit',
  'will not be overwritten',
]) {
  assertIncludes(prepareScript, snippet, prepareScriptPath);
}

for (const boundary of [
  'live Supabase changes',
  'deployment',
  'public launch',
  'external account changes',
  'legal decisions',
  'provider commitments',
  'real payments',
  'real loans',
  'escrow',
  'repayment routing',
  'stablecoin settlement',
  'token collateral',
  'XPR signatures',
  'app-store actions',
  'secrets handling',
]) {
  assertIncludes(prepareScript, boundary, prepareScriptPath);
  assertIncludes(queue, boundary, queuePath);
}

assert(
  packageJson.scripts?.['prepare:kimi-merge-queue'] === 'node scripts/prepare-kimi-merge-queue.mjs',
  `${packagePath} must define prepare:kimi-merge-queue`
);
assert(
  packageJson.scripts?.['check:kimi-merge-queue'] === 'node scripts/validate-kimi-merge-queue.mjs',
  `${packagePath} must define check:kimi-merge-queue`
);
assertIncludes(runner, '"check:kimi-merge-queue"', runnerPath);

for (const [content, file, snippet] of [
  [context, contextPath, 'Kimi merge queue local prepare script'],
  [context, contextPath, 'Kimi merge queue validator'],
  [context, contextPath, expectedQueueName],
  [backlog, backlogPath, 'Kimi merge queue local prepare script'],
  [backlog, backlogPath, 'Kimi merge queue validator'],
  [realStatusAudit, realStatusAuditPath, 'Kimi merge queue local prepare script'],
  [realStatusAudit, realStatusAuditPath, 'Kimi merge queue validator'],
  [quickStart, quickStartPath, 'npm run prepare:kimi-merge-queue'],
  [manifest, manifestPath, 'npm run prepare:kimi-merge-queue'],
  [tracker, trackerPath, 'npm run prepare:kimi-merge-queue'],
]) {
  assertIncludes(content, snippet, file);
}

const queueFiles = readdirSync(docsRoot).filter((file) => file.startsWith('codex-kimi-integration-merge-queue-wave-one-') && file.endsWith('.md'));
assert(queueFiles.includes(expectedQueueName), `${docsRoot} must include ${expectedQueueName}`);
assertIncludes(validator, 'requiredHeadings', validatorPath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(prepareScript + queue),
  'Kimi merge queue files must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  queue_checked: queuePath,
  streams_checked: streams.length,
  required_headings_checked: requiredHeadings.length,
  package_scripts_checked: [
    'prepare:kimi-merge-queue',
    'check:kimi-merge-queue',
  ],
  safety_boundaries_checked: true,
}, null, 2));
