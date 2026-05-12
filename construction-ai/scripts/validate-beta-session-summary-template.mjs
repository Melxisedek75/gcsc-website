import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const templatePath = resolve('..', 'docs', 'smartcontractor-beta-session-summary-template.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');

const template = readFileSync(templatePath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');

function fail(message) {
  console.error(`Beta session summary template validation failed: ${message}`);
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
  '## Session Summary',
  '## Flow Results',
  '## Issues Opened',
  '## Trust And Product Signals',
  '## Launch Decision',
  '## Required Follow-Up',
]) {
  assertIncludes(template, section, templatePath);
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
  'Build or commit tested:',
  'Real money involved: no',
  'Secrets/private data recorded: no',
  'Homeowner job flow: pass/fail',
  'Simulated starter loan flow: pass/fail',
  'Dispute/peer-review flow: pass/fail',
  'P0 issues:',
  'Top 3 trust blockers:',
  'Safe for real-money pilot: no',
  'Legal/payment/provider review still required: yes',
]) {
  assertIncludes(template, requiredSnippet, templatePath);
}

for (const forbiddenPattern of [
  /sk_live_[a-z0-9]/i,
  /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
  /xox[baprs]-[0-9]/i,
  /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/,
]) {
  assert(!forbiddenPattern.test(template), 'Template must not contain real secret-looking values');
}

assertIncludes(backlog, 'Beta session summary template', backlogPath);
assertIncludes(context, 'beta session summary template', contextPath);

assert(
  [...template].every((char) => char.charCodeAt(0) <= 127),
  'Template must stay ASCII-clean for Windows terminal readability'
);

console.log(JSON.stringify({
  status: 'passed',
  template: templatePath,
  safety_boundaries_checked: true,
}, null, 2));
