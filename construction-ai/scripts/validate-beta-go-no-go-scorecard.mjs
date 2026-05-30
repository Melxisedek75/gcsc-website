import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const scorecardPath = resolve('..', 'docs', 'smartcontractor-beta-go-no-go-scorecard.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const packagePath = resolve('package.json');

function fail(message) {
  console.error(`Beta go/no-go scorecard validation failed: ${message}`);
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

assert(existsSync(scorecardPath), `${scorecardPath} must exist`);

const scorecard = readFileSync(scorecardPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');
const packageJson = readFileSync(packagePath, 'utf8');

for (const section of [
  '## Purpose',
  '## Required Inputs',
  '## Scorecard',
  '## Automatic No-Go Conditions',
  '## Founder Decision',
  '## Acceptance Criteria',
]) {
  assertIncludes(scorecard, section, scorecardPath);
}

for (const input of [
  'docs/smartcontractor-public-beta-review-packet.md',
  'docs/smartcontractor-beta-triage-rubric.md',
  'docs/smartcontractor-beta-issue-lifecycle.md',
  'docs/smartcontractor-beta-decision-log.md',
  'npm run check',
]) {
  assertIncludes(scorecard, input, scorecardPath);
}

for (const scoringArea of [
  'auth/session',
  'homeowner flow',
  'contractor flow',
  'payment simulation',
  'dispute evidence',
  'peer review',
  'admin/risk review',
  'smart contract product surface',
  'mobile/PWA',
]) {
  assertIncludes(scorecard, scoringArea, scorecardPath);
}

for (const noGo of [
  'unresolved P0',
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
  'secret',
]) {
  assertIncludes(scorecard, noGo, scorecardPath);
}

assertIncludes(backlog, 'Beta go/no-go scorecard', backlogPath);
assertIncludes(context, 'Beta go/no-go scorecard', contextPath);
assertIncludes(packageJson, 'check:beta-go-no-go-scorecard', packagePath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(scorecard),
  'Beta go/no-go scorecard must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  scorecard: scorecardPath,
  safety_boundaries_checked: true,
}, null, 2));
