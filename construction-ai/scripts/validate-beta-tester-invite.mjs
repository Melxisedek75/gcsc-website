import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const invitePath = resolve('..', 'docs', 'smartcontractor-beta-tester-invite.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');

const invite = readFileSync(invitePath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');

function fail(message) {
  console.error(`Beta tester invite validation failed: ${message}`);
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
  '## Founder Safety Boundary',
  '## Who To Invite First',
  '## Short Invite Message',
  '## Tester Instructions',
  '## Feedback Questions',
  '## Founder Review Checklist',
  '## Acceptance Check',
]) {
  assertIncludes(invite, section, invitePath);
}

for (const requiredSnippet of [
  'demo-only',
  'no real payment',
  'no real loan',
  'no real escrow',
  'real contractor loans',
  'token collateral',
  'Do not ask testers to send',
  'passwords',
  'bank account details',
  'private keys or seed phrases',
  '3-5 people',
  'docs/smartcontractor-beta-issue-log-template.md',
]) {
  assertIncludes(invite, requiredSnippet, invitePath);
}

assertIncludes(backlog, 'Beta tester invite', backlogPath);
assertIncludes(context, 'Beta tester invite', contextPath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(invite),
  'Invite must not contain real secret-looking values'
);

assert(
  [...invite].every((char) => char.charCodeAt(0) <= 127),
  'Invite must stay ASCII-clean for Windows terminal readability'
);

console.log(JSON.stringify({
  status: 'passed',
  invite: invitePath,
  safety_boundaries_checked: true,
}, null, 2));

