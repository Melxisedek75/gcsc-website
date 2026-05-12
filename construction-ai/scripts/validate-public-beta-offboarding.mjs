import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-tester-offboarding.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta tester offboarding validation failed: ${message}`);
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
  'SmartContractor Public Beta Tester Offboarding',
  'Purpose',
  'When To Run This',
  'Offboarding Checklist',
  'Support Queue Closure',
  'Evidence Cleanup',
  'Access And Account Notes',
  'Blocked Actions',
  'Founder Summary Template',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'demo only',
  'PUBLIC_SITE_URL',
  'Magic Link',
  'tester role',
  'issue ID',
  'X-Request-Id',
  'support queue',
  'redacted screenshot',
  'delete raw artifacts',
  '24-hour review/purge window',
  'no SQL',
  'no secrets',
  'personal IDs',
  'private contact details',
  'payment data',
  'wallet data',
  'real customer addresses',
  'real payments disabled',
  'real loans disabled',
  'escrow disabled',
  'token collateral disabled',
  'no investment advice',
  'no loan approval',
  'no legal advice',
  'founder review',
]) {
  assertIncludes(doc, required, docPath);
}

assertIncludes(context, 'public beta tester offboarding', contextPath);
assertIncludes(backlog, 'Public beta tester offboarding', backlogPath);
assertIncludes(backlog, 'check:public-beta-offboarding', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc)) {
  fail('Offboarding checklist must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  offboarding: docPath,
  safety_boundaries_checked: true,
}, null, 2));
