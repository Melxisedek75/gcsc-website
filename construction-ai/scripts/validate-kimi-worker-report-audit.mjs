import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docsRoot = resolve('..', 'docs');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const auditScriptPath = resolve('scripts', 'audit-kimi-worker-reports.mjs');
const validatorPath = resolve('scripts', 'validate-kimi-worker-report-audit.mjs');
const contextPath = resolve(docsRoot, 'gcsc-active-context.md');
const backlogPath = resolve(docsRoot, 'smartcontractor-backlog.md');
const realStatusAuditPath = resolve(docsRoot, 'gcsc-real-status-audit-2026-05-11.md');
const quickStartPath = resolve(docsRoot, 'gcsc-founder-kimi-claude-quick-start-2026-05-14.md');
const manifestPath = resolve(docsRoot, 'gcsc-kimi-claude-codex-handoff-bundle-manifest-2026-05-14.md');
const trackerPath = resolve(docsRoot, 'gcsc-kimi-wave-one-progress-tracker-2026-05-14.md');

function fail(message) {
  console.error(`Kimi worker report audit validation failed: ${message}`);
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
const auditScript = readRequired(auditScriptPath);
const validator = readRequired(validatorPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realStatusAudit = readRequired(realStatusAuditPath);
const quickStart = readRequired(quickStartPath);
const manifest = readRequired(manifestPath);
const tracker = readRequired(trackerPath);

const streams = ['A', 'F', 'N', 'J', 'H', 'I', 'O', 'M', 'K', 'L', 'Q', 'S'];
const requiredReportFields = [
  'Worker ID:',
  'Stream:',
  'Files read:',
  'Files created/modified:',
  'Commands run:',
  'Result:',
  'Findings by severity:',
  'Proposed integrator action:',
  'Stop boundaries checked:',
  'No-touch confirmation:',
  'Remaining blockers:',
];

for (const stream of streams) {
  assertIncludes(auditScript, `'${stream}'`, auditScriptPath);
}

for (const field of requiredReportFields) {
  assertIncludes(auditScript, field, auditScriptPath);
}

for (const snippet of [
  'kimi-wave-one-output-intake-',
  'worker-reports',
  'expectedWorkerReportTotal = 100',
  'missing_expected_reports',
  'streams_with_reports',
  'streams_without_reports',
  'stream_mismatch',
  'secretPattern',
  'liveRiskPattern',
  'no_reports_yet',
  'blocked_for_review',
  'needs_rework',
  'needs_review',
  'safety_boundaries_checked',
  'intake-folder-map.json',
  'intake_write_allowlist',
  'intake_blocklist',
  'allowlist_paths_checked',
  'blocklist_entries_checked',
]) {
  assertIncludes(auditScript, snippet, auditScriptPath);
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
  assertIncludes(auditScript, boundary, auditScriptPath);
}

assert(
  packageJson.scripts?.['audit:kimi-worker-reports'] === 'node scripts/audit-kimi-worker-reports.mjs',
  `${packagePath} must define audit:kimi-worker-reports`
);
assert(
  packageJson.scripts?.['check:kimi-worker-report-audit'] === 'node scripts/validate-kimi-worker-report-audit.mjs',
  `${packagePath} must define check:kimi-worker-report-audit`
);
assertIncludes(runner, '"check:kimi-worker-report-audit"', runnerPath);

for (const [content, file, snippet] of [
  [context, contextPath, 'Kimi worker report audit script'],
  [context, contextPath, 'Kimi worker report audit validator'],
  [context, contextPath, 'Kimi worker report audit allowlist echo'],
  [backlog, backlogPath, 'Kimi worker report audit script'],
  [backlog, backlogPath, 'Kimi worker report audit validator'],
  [backlog, backlogPath, 'Kimi worker report audit allowlist echo'],
  [realStatusAudit, realStatusAuditPath, 'Kimi worker report audit script'],
  [realStatusAudit, realStatusAuditPath, 'Kimi worker report audit validator'],
  [realStatusAudit, realStatusAuditPath, 'Kimi worker report audit allowlist echo'],
  [quickStart, quickStartPath, 'npm run audit:kimi-worker-reports'],
  [manifest, manifestPath, 'npm run audit:kimi-worker-reports'],
  [tracker, trackerPath, 'npm run audit:kimi-worker-reports'],
]) {
  assertIncludes(content, snippet, file);
}

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(auditScript),
  'Kimi worker report audit script must not contain real secret-looking values'
);
assertIncludes(validator, 'requiredReportFields', validatorPath);

console.log(JSON.stringify({
  status: 'passed',
  streams_checked: streams.length,
  required_report_fields_checked: requiredReportFields.length,
  package_scripts_checked: [
    'audit:kimi-worker-reports',
    'check:kimi-worker-report-audit',
  ],
  safety_boundaries_checked: true,
}, null, 2));
