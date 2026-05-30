import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const rubricPath = resolve('..', 'docs', 'smartcontractor-beta-triage-rubric.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const packagePath = resolve('package.json');

function fail(message) {
  console.error(`Beta triage rubric validation failed: ${message}`);
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

assert(existsSync(rubricPath), `${rubricPath} must exist`);

const rubric = readFileSync(rubricPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');
const packageJson = readFileSync(packagePath, 'utf8');

for (const section of [
  '## Purpose',
  '## Severity Levels',
  '## Trust Categories',
  '## Decision Routing',
  '## Founder-Only Escalations',
  '## Required Evidence',
  '## Acceptance Criteria',
]) {
  assertIncludes(rubric, section, rubricPath);
}

for (const severity of ['P0', 'P1', 'P2', 'P3']) {
  assertIncludes(rubric, severity, rubricPath);
}

for (const category of [
  'auth/session',
  'contractor trust',
  'homeowner trust',
  'payment simulation',
  'dispute evidence',
  'peer review',
  'admin/risk review',
  'smart contract product surface',
  'mobile/PWA',
]) {
  assertIncludes(rubric, category, rubricPath);
}

for (const blockedAction of [
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
  'gcscworkcap1',
  'gcscclaim111',
  'gcsccredit11',
  'gcscadvance1',
  'live Supabase',
  'legal/provider review',
]) {
  assertIncludes(rubric, blockedAction, rubricPath);
}

for (const evidence of [
  'request_id',
  'browser',
  'viewport',
  'tester role',
  'expected result',
  'actual result',
  'screenshot or short video',
]) {
  assertIncludes(rubric, evidence, rubricPath);
}

assertIncludes(backlog, 'Beta triage rubric', backlogPath);
assertIncludes(context, 'Beta triage rubric', contextPath);
assertIncludes(packageJson, 'check:beta-triage-rubric', packagePath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(rubric),
  'Beta triage rubric must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  rubric: rubricPath,
  safety_boundaries_checked: true,
}, null, 2));
