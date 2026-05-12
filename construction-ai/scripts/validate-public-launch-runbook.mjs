import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const runbookPath = resolve('..', 'docs', 'smartcontractor-public-launch-runbook.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const packagePath = resolve('package.json');

function fail(message) {
  console.error(`Public launch runbook validation failed: ${message}`);
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

assert(existsSync(runbookPath), `${runbookPath} must exist`);

const runbook = readFileSync(runbookPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');
const packageJson = readFileSync(packagePath, 'utf8');

for (const section of [
  '## Phase 0: What Must Stay Off Until Reviewed',
  '## Phase 1: Founder-Only Setup',
  '## Phase 2: Strict RLS Review',
  '## Phase 3: Test Users',
  '## Phase 4: Environment Variables',
  '## Phase 5: Deployment Gate',
  '## Phase 6: Public Beta Scope',
  '## Emergency Rollback',
]) {
  assertIncludes(runbook, section, runbookPath);
}

for (const gate of [
  'real contractor loans',
  'real escrow',
  'automatic token collateral liquidation',
  'real payment provider production mode',
  'SUPABASE_SERVICE_ROLE_KEY',
  'frontend JavaScript',
  'npm run check',
  'GitHub Actions',
  'No public `true` RLS policies remain',
  'Anonymous users cannot read protected data',
]) {
  assertIncludes(runbook, gate, runbookPath);
}

for (const safeScope of [
  'demo jobs',
  'simulated starter loan requests',
  'simulated milestone payments',
  'disputes and evidence metadata',
  'peer review workflow',
  'admin review console',
]) {
  assertIncludes(runbook, safeScope, runbookPath);
}

assertIncludes(backlog, 'Public launch runbook validator', backlogPath);
assertIncludes(context, 'Public launch runbook validator', contextPath);
assertIncludes(packageJson, 'check:public-launch-runbook', packagePath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]/i.test(runbook),
  'Public launch runbook must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  runbook: runbookPath,
  safety_boundaries_checked: true,
}, null, 2));
