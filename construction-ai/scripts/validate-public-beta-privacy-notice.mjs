import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-privacy-notice.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta privacy notice validation failed: ${message}`);
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
  'SmartContractor Public Beta Privacy Notice',
  'Purpose',
  'Plain English Notice',
  'What Testers Should Not Submit',
  'What Safe Feedback Can Include',
  'Evidence Handling',
  'Founder Review Required',
  'Not A Full Privacy Policy',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'demo only',
  'PUBLIC_SITE_URL',
  'Magic Link',
  'X-Request-Id',
  'redacted screenshot',
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
  'legal review',
  'privacy policy',
  'founder',
]) {
  assertIncludes(doc, required, docPath);
}

assertIncludes(context, 'public beta privacy notice', contextPath);
assertIncludes(backlog, 'Public beta privacy notice', backlogPath);
assertIncludes(backlog, 'check:public-beta-privacy-notice', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc)) {
  fail('Privacy notice must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  privacy_notice: docPath,
  safety_boundaries_checked: true,
}, null, 2));
