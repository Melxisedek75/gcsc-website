import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const runbookPath = resolve('..', 'docs', 'smartcontractor-beta-session-runbook.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');

const runbook = readFileSync(runbookPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');

function fail(message) {
  console.error(`Beta session runbook validation failed: ${message}`);
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
  '## Roles',
  '## Pre-Session Checklist',
  '## Session Agenda',
  '## Evidence To Record',
  '## Pass Criteria',
  '## Stop Conditions',
  '## After-Session Steps',
]) {
  assertIncludes(runbook, section, runbookPath);
}

for (const requiredSnippet of [
  '3-5 trusted people',
  'real contractor loans',
  'automatic payment release',
  'production payment provider mode',
  'token collateral',
  'Magic Link URLs',
  'service-role keys',
  'Founder/admin',
  'Homeowner tester',
  'Contractor tester',
  'Peer reviewer tester',
  'Run `npm run check`',
  'Refresh Controlled Beta Readiness',
  'real-money pilot is blocked',
  'simulated starter loan',
  'simulated payment intent only',
  'peer-review recommendation',
  'Top 3 trust blockers:',
  'Real money involved: no',
  'Secrets/private data recorded: no',
  'Stop the session immediately',
]) {
  assertIncludes(runbook, requiredSnippet, runbookPath);
}

for (const forbiddenPattern of [
  /sk_live_[a-z0-9]/i,
  /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
  /xox[baprs]-[0-9]/i,
  /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/,
]) {
  assert(!forbiddenPattern.test(runbook), 'Runbook must not contain real secret-looking values');
}

assertIncludes(backlog, 'Beta session runbook', backlogPath);
assertIncludes(context, 'beta session runbook', contextPath);

assert(
  [...runbook].every((char) => char.charCodeAt(0) <= 127),
  'Runbook must stay ASCII-clean for Windows terminal readability'
);

console.log(JSON.stringify({
  status: 'passed',
  runbook: runbookPath,
  safety_boundaries_checked: true,
}, null, 2));
