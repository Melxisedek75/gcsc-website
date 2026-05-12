import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-terms-summary.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta terms summary validation failed: ${message}`);
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
  'SmartContractor Public Beta Terms Summary',
  'Purpose',
  'Plain English Terms',
  'Tester Responsibilities',
  'What SmartContractor Does Not Promise',
  'Disabled Real-Money Features',
  'Evidence And Privacy Boundaries',
  'Founder Review Required',
  'Not Legal Terms',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'demo only',
  'PUBLIC_SITE_URL',
  'Magic Link',
  'X-Request-Id',
  'support queue',
  'redacted screenshot',
  'no SQL',
  'no secrets',
  'no investment advice',
  'no loan approval',
  'no legal advice',
  'personal IDs',
  'private contact details',
  'payment data',
  'wallet data',
  'real customer addresses',
  'real payments disabled',
  'real loans disabled',
  'escrow disabled',
  'token collateral disabled',
  'legal review',
  'privacy policy',
  'founder review',
]) {
  assertIncludes(doc, required, docPath);
}

assertIncludes(context, 'public beta terms summary', contextPath);
assertIncludes(backlog, 'Public beta terms summary', backlogPath);
assertIncludes(backlog, 'check:public-beta-terms-summary', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc)) {
  fail('Terms summary must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  terms_summary: docPath,
  safety_boundaries_checked: true,
}, null, 2));
