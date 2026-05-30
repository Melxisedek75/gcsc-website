import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const followupPath = resolve('..', 'docs', 'smartcontractor-beta-tester-followup.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const packagePath = resolve('package.json');

function fail(message) {
  console.error(`Beta tester follow-up validation failed: ${message}`);
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

assert(existsSync(followupPath), `${followupPath} must exist`);

const followup = readFileSync(followupPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');
const packageJson = readFileSync(packagePath, 'utf8');

for (const section of [
  '## Purpose',
  '## Send After',
  '## Follow-Up Message',
  '## Feedback Questions',
  '## What Not To Ask For',
  '## Acceptance Criteria',
]) {
  assertIncludes(followup, section, followupPath);
}

for (const phrase of [
  'demo-only',
  'no real loan',
  'no real escrow',
  'no production payment',
  'no sensitive personal information',
  'request_id',
  'homeowner',
  'contractor',
  'dispute',
  'peer review',
  'admin/risk',
  'smart contract review cards',
  'gcscworkcap1',
  'gcscclaim111',
  'gcsccredit11',
  'gcscadvance1',
  'live smart contract deployment',
  'ClaimBridge advance funding',
  'contract-backed working-capital funding',
  'escrow-backed advance payout',
  'repayment routing',
  'blocked for live use',
]) {
  assertIncludes(followup, phrase, followupPath);
}

assertIncludes(backlog, 'Beta tester follow-up', backlogPath);
assertIncludes(context, 'Beta tester follow-up', contextPath);
assertIncludes(packageJson, 'check:beta-tester-followup', packagePath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(followup),
  'Beta tester follow-up must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  followup: followupPath,
  safety_boundaries_checked: true,
}, null, 2));
