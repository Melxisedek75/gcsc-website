import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-launch-message.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta launch message validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) {
    fail(`${file} must include: ${snippet}`);
  }
}

const doc = readRequired(docPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

for (const section of [
  'SmartContractor Public Beta Launch Message',
  'Purpose',
  'Short Invite',
  'What Testers Can Do',
  'What Is Not Live',
  'What To Report',
  'Founder Send Checklist',
  'Do Not Promise',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'PUBLIC_SITE_URL',
  'X-Request-Id',
  'Magic Link',
  'homeowner',
  'contractor',
  'peer reviewer',
  'support queue',
  'known issues',
  'real payments disabled',
  'real loans disabled',
  'escrow disabled',
  'token collateral disabled',
  'no SQL',
  'no secrets',
  'founder',
  'legal',
  'provider',
  'no investment advice',
  'no loan approval',
]) {
  assertIncludes(doc, required, docPath);
}

assertIncludes(context, 'public beta launch message', contextPath);
assertIncludes(backlog, 'Public beta launch message', backlogPath);
assertIncludes(backlog, 'check:public-beta-launch-message', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc)) {
  fail('Launch message must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  launch_message: docPath,
  safety_boundaries_checked: true,
}, null, 2));
