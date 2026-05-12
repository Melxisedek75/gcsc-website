import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const logPath = resolve('..', 'docs', 'smartcontractor-beta-decision-log.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');

const log = readFileSync(logPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');

function fail(message) {
  console.error(`Beta decision log validation failed: ${message}`);
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
  '## Decision Categories',
  '## Decision Entry Template',
  '## Launch Gate Rules',
  '## Review Cadence',
]) {
  assertIncludes(log, section, logPath);
}

for (const requiredSnippet of [
  'Magic Link URLs',
  'service-role keys',
  'private keys or seed phrases',
  'real loans',
  'real escrow',
  'real payment release',
  'production payment provider mode',
  'token collateral',
  'strict RLS apply',
  'fix-now',
  'fix-before-public-beta',
  'founder-review',
  'legal-review',
  'provider-review',
  'Decision ID:',
  'Related issue IDs:',
  'Risk if ignored:',
  'Secrets/private data included: no',
  'Real money approved: no',
  'Keep public beta blocked',
  'Keep real-money pilot blocked',
  'written founder approval',
]) {
  assertIncludes(log, requiredSnippet, logPath);
}

for (const forbiddenPattern of [
  /sk_live_[a-z0-9]/i,
  /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
  /xox[baprs]-[0-9]/i,
  /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/,
]) {
  assert(!forbiddenPattern.test(log), 'Decision log must not contain real secret-looking values');
}

assertIncludes(backlog, 'Beta decision log', backlogPath);
assertIncludes(context, 'beta decision log', contextPath);

assert(
  [...log].every((char) => char.charCodeAt(0) <= 127),
  'Decision log must stay ASCII-clean for Windows terminal readability'
);

console.log(JSON.stringify({
  status: 'passed',
  decision_log: logPath,
  safety_boundaries_checked: true,
}, null, 2));
