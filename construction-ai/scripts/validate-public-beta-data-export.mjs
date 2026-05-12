import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-data-export-request.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta data export request validation failed: ${message}`);
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
  'SmartContractor Public Beta Data Export Request',
  'Purpose',
  'When To Use This',
  'Safe Export Fields',
  'What Not To Export',
  'Founder Handling Steps',
  'Export Package Format',
  'Blocked Actions',
  'Tester Reply Template',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'demo only',
  'PUBLIC_SITE_URL',
  'tester role',
  'issue ID',
  'X-Request-Id',
  'support queue',
  'redacted screenshot',
  'redacted summary',
  'no SQL',
  'no secrets',
  'personal IDs',
  'private contact details',
  'payment data',
  'wallet data',
  'real customer addresses',
  'database URLs',
  'API keys',
  'Magic Link tokens',
  'service-role keys',
  'real payments disabled',
  'real loans disabled',
  'escrow disabled',
  'token collateral disabled',
  'privacy policy',
  'legal review',
  'founder review',
]) {
  assertIncludes(doc, required, docPath);
}

assertIncludes(context, 'public beta data export request', contextPath);
assertIncludes(backlog, 'Public beta data export request', backlogPath);
assertIncludes(backlog, 'check:public-beta-data-export', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc)) {
  fail('Data export request must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  data_export_request: docPath,
  safety_boundaries_checked: true,
}, null, 2));
