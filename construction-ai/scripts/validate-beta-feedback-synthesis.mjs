import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const synthesisPath = resolve('..', 'docs', 'smartcontractor-beta-feedback-synthesis.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');

const synthesis = readFileSync(synthesisPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');

function fail(message) {
  console.error(`Beta feedback synthesis validation failed: ${message}`);
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

for (const section of [
  '## Safety Boundary',
  '## Feedback Batch Header',
  '## Signal Summary',
  '## Issue Triage',
  '## Product Decision Notes',
  '## Red-Line Check',
  '## Founder Decision Summary',
  '## Acceptance Check',
]) {
  assertIncludes(synthesis, section, synthesisPath);
}

for (const requiredSnippet of [
  'docs/smartcontractor-controlled-user-test-plan.md',
  'docs/smartcontractor-beta-issue-log-template.md',
  'Top 3 confusing moments',
  'Top 3 trust blockers',
  'P0 must fix before any public beta',
  'Needs founder/legal/provider decision',
  'Did feedback support homeowner trust?',
  'Did any tester enter sensitive data?',
  'real loans',
  'real escrow',
  'production payment mode',
  'token collateral',
  'live smart contract deployment',
  'ClaimBridge advance funding',
  'contract-backed working-capital funding',
  'escrow-backed advance payout',
  'repayment routing',
  'gcscworkcap1',
  'gcscclaim111',
  'gcsccredit11',
  'gcscadvance1',
  'token custody',
  'strict RLS apply',
]) {
  assertIncludes(synthesis, requiredSnippet, synthesisPath);
}

for (const safetyBoundary of [
  'Supabase access tokens',
  'Magic Link URLs',
  'service-role keys',
  'database passwords',
  'private keys or seed phrases',
  'investment or token appreciation claims',
]) {
  assertIncludes(synthesis, safetyBoundary, synthesisPath);
}

assertIncludes(backlog, 'Beta feedback synthesis', backlogPath);
assertIncludes(context, 'Beta feedback synthesis', contextPath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(synthesis),
  'Synthesis template must not contain real secret-looking values'
);

assert(
  [...synthesis].every((char) => char.charCodeAt(0) <= 127),
  'Synthesis template must stay ASCII-clean for Windows terminal readability'
);

console.log(JSON.stringify({
  status: 'passed',
  synthesis: synthesisPath,
  safety_boundaries_checked: true,
}, null, 2));
