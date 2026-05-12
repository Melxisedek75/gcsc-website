import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-use-restriction-request.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta use restriction request validation failed: ${message}`);
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
  'SmartContractor Public Beta Use Restriction Request',
  'Purpose',
  'When To Use This',
  'Safe Restriction Fields',
  'Restricted Uses',
  'Founder Handling Steps',
  'Restriction Log Format',
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
  'redacted summary',
  'public materials',
  'partner packet',
  'grant packet',
  'investor packet',
  'founder review',
  'legal review',
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
]) {
  assertIncludes(doc, required, docPath);
}

assertIncludes(context, 'public beta use restriction request', contextPath);
assertIncludes(backlog, 'Public beta use restriction request', backlogPath);
assertIncludes(backlog, 'check:public-beta-use-restriction', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc)) {
  fail('Use restriction request must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  use_restriction_request: docPath,
  safety_boundaries_checked: true,
}, null, 2));
