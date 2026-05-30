import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const lifecyclePath = resolve('..', 'docs', 'smartcontractor-beta-issue-lifecycle.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const packagePath = resolve('package.json');

function fail(message) {
  console.error(`Beta issue lifecycle validation failed: ${message}`);
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

assert(existsSync(lifecyclePath), `${lifecyclePath} must exist`);

const lifecycle = readFileSync(lifecyclePath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');
const packageJson = readFileSync(packagePath, 'utf8');

for (const section of [
  '## Purpose',
  '## Status Flow',
  '## Intake Fields',
  '## Fix Workflow',
  '## Retest Workflow',
  '## Founder Approval Gates',
  '## Acceptance Criteria',
]) {
  assertIncludes(lifecycle, section, lifecyclePath);
}

for (const status of [
  'new',
  'triaged',
  'fixing',
  'ready for retest',
  'verified',
  'deferred',
  'blocked founder',
]) {
  assertIncludes(lifecycle, status, lifecyclePath);
}

for (const requiredField of [
  'issue id',
  'severity',
  'trust category',
  'request_id',
  'tester role',
  'expected result',
  'actual result',
  'evidence link',
  'retest result',
  'gcscworkcap1',
  'gcscclaim111',
  'gcsccredit11',
  'gcscadvance1',
]) {
  assertIncludes(lifecycle, requiredField, lifecyclePath);
}

for (const gate of [
  'real loan',
  'real escrow',
  'token collateral',
  'production payment',
  'live smart contract deployment',
  'ClaimBridge advance funding',
  'contract-backed working-capital funding',
  'escrow-backed advance payout',
  'repayment routing',
  'token custody',
  'live Supabase',
  'legal/provider review',
]) {
  assertIncludes(lifecycle, gate, lifecyclePath);
}

assertIncludes(backlog, 'Beta issue lifecycle', backlogPath);
assertIncludes(context, 'Beta issue lifecycle', contextPath);
assertIncludes(packageJson, 'check:beta-issue-lifecycle', packagePath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(lifecycle),
  'Beta issue lifecycle must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  lifecycle: lifecyclePath,
  safety_boundaries_checked: true,
}, null, 2));
