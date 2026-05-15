import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docsRoot = resolve('..', 'docs');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const intakeScriptPath = resolve('scripts', 'prepare-kimi-output-intake.mjs');
const claudeAuditBundleScriptPath = resolve('scripts', 'prepare-claude-kimi-audit-bundle.mjs');
const contextPath = resolve(docsRoot, 'gcsc-active-context.md');
const backlogPath = resolve(docsRoot, 'smartcontractor-backlog.md');
const auditPath = resolve(docsRoot, 'gcsc-real-status-audit-2026-05-11.md');
const quickStartPath = resolve(docsRoot, 'gcsc-founder-kimi-claude-quick-start-2026-05-14.md');
const manifestPath = resolve(docsRoot, 'gcsc-kimi-claude-codex-handoff-bundle-manifest-2026-05-14.md');

const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
const runner = readFileSync(runnerPath, 'utf8');
const intakeScript = readFileSync(intakeScriptPath, 'utf8');
const claudeAuditBundleScript = readFileSync(claudeAuditBundleScriptPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const audit = readFileSync(auditPath, 'utf8');
const quickStart = readFileSync(quickStartPath, 'utf8');
const manifest = readFileSync(manifestPath, 'utf8');

function fail(message) {
  console.error(`Kimi output intake validation failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function assertIncludes(content, snippet, file) {
  assert(
    content.toLowerCase().includes(snippet.toLowerCase()),
    `${file} must include: ${snippet}`
  );
}

const streams = ['A', 'F', 'N', 'J', 'H', 'I', 'O', 'M', 'K', 'L', 'Q', 'S'];
const requiredFolders = [
  '00-controller-summary',
  '01-claude-audit',
  '02-codex-merge-queue',
  '99-blocked-or-rejected',
  'worker-reports',
  'created-or-modified-files',
  'claude-verdict',
];

assert(existsSync(intakeScriptPath), `${intakeScriptPath} must exist`);
for (const snippet of [
  '.tmp',
  'kimi-wave-one-output-intake',
  'intake-folder-map.json',
  'README.md',
  'Do not place secrets',
  'Use this intake folder for local/internal review routing only',
]) {
  assertIncludes(intakeScript, snippet, intakeScriptPath);
}

for (const stream of streams) {
  assertIncludes(intakeScript, `'${stream}'`, intakeScriptPath);
}

for (const folder of requiredFolders) {
  assertIncludes(intakeScript, folder, intakeScriptPath);
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
]) {
  assertIncludes(intakeScript, boundary, intakeScriptPath);
}

assert(
  packageJson.scripts?.['prepare:kimi-output-intake'] === 'node scripts/prepare-kimi-output-intake.mjs',
  `${packagePath} must define prepare:kimi-output-intake`
);
assert(
  packageJson.scripts?.['prepare:claude-kimi-audit-bundle'] === 'node scripts/prepare-claude-kimi-audit-bundle.mjs',
  `${packagePath} must define prepare:claude-kimi-audit-bundle`
);
assert(
  packageJson.scripts?.['check:kimi-output-intake'] === 'node scripts/validate-kimi-output-intake.mjs',
  `${packagePath} must define check:kimi-output-intake`
);
assertIncludes(runner, '"check:kimi-output-intake"', runnerPath);

assert(existsSync(claudeAuditBundleScriptPath), `${claudeAuditBundleScriptPath} must exist`);
for (const snippet of [
  'claude-kimi-audit',
  'CLAUDE-AUDIT-PROMPT.txt',
  'kimi-output-to-add',
  'docs/gcsc-claude-kimi-output-audit-work-order-2026-05-14.md',
  'docs/gcsc-claude-kimi-audit-report-template-2026-05-14.md',
  'PASS_LOCAL_ONLY',
  'REWORK',
  'BLOCKED_EXTERNAL_REVIEW',
  'FAIL_UNSAFE',
  'Do not ask Claude to perform live Supabase changes',
  'real payments',
  'real loans',
  'repayment routing',
  'stablecoin settlement',
  'token collateral',
]) {
  assertIncludes(claudeAuditBundleScript, snippet, claudeAuditBundleScriptPath);
}

for (const doc of [
  [context, 'Kimi output intake local prepare script', contextPath],
  [context, 'Kimi output intake validator', contextPath],
  [context, 'Claude Kimi audit bundle prepare script', contextPath],
  [backlog, 'Kimi output intake local prepare script', backlogPath],
  [backlog, 'Kimi output intake validator', backlogPath],
  [backlog, 'Claude Kimi audit bundle prepare script', backlogPath],
  [audit, 'Kimi output intake local prepare script', auditPath],
  [audit, 'Kimi output intake validator', auditPath],
  [audit, 'Claude Kimi audit bundle prepare script', auditPath],
  [quickStart, 'npm run prepare:kimi-output-intake', quickStartPath],
  [quickStart, 'npm run prepare:claude-kimi-audit-bundle', quickStartPath],
  [manifest, 'npm run prepare:kimi-output-intake', manifestPath],
  [manifest, 'npm run prepare:claude-kimi-audit-bundle', manifestPath],
]) {
  assertIncludes(doc[0], doc[1], doc[2]);
}

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(intakeScript),
  'Kimi output intake script must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  streams_checked: streams.length,
  folders_checked: requiredFolders.length,
  package_scripts_checked: [
    'prepare:kimi-output-intake',
    'check:kimi-output-intake',
  ],
  safety_boundaries_checked: true,
}, null, 2));
