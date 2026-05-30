import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const checklistPath = resolve('..', 'docs', 'smartcontractor-beta-evidence-checklist.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const packagePath = resolve('package.json');

function fail(message) {
  console.error(`Beta evidence checklist validation failed: ${message}`);
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

assert(existsSync(checklistPath), `${checklistPath} must exist`);

const checklist = readFileSync(checklistPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');
const packageJson = readFileSync(packagePath, 'utf8');

for (const section of [
  '## Purpose',
  '## What To Capture',
  '## Evidence Naming',
  '## What Not To Capture',
  '## Session Checklist',
  '## Acceptance Criteria',
]) {
  assertIncludes(checklist, section, checklistPath);
}

for (const required of [
  'request_id',
  'screenshot',
  'screen recording',
  'browser console',
  'network response',
  'mobile viewport',
  'no secrets',
  'no real payment',
  'no real loan',
  'no real escrow',
  'token collateral',
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
]) {
  assertIncludes(checklist, required, checklistPath);
}

for (const reference of [
  'docs/smartcontractor-beta-session-runbook.md',
  'docs/smartcontractor-beta-session-summary-template.md',
  'docs/smartcontractor-beta-issue-log-template.md',
  'docs/smartcontractor-beta-go-no-go-scorecard.md',
  'npm run check',
]) {
  assertIncludes(checklist, reference, checklistPath);
}

assertIncludes(backlog, 'Beta evidence checklist', backlogPath);
assertIncludes(context, 'Beta evidence checklist', contextPath);
assertIncludes(packageJson, 'check:beta-evidence-checklist', packagePath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role|postgresql:\/\/|password\s*[:=]/i.test(checklist),
  'Beta evidence checklist must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  checklist: checklistPath,
  safety_boundaries_checked: true,
}, null, 2));
