import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-weekly-closeout.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta weekly closeout validation failed: ${message}`);
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
  'SmartContractor Public Beta Weekly Closeout',
  'Purpose',
  'When To Use This',
  'Safe Closeout Fields',
  'Weekly Review Sections',
  'Founder Decision Options',
  'Closeout Log Format',
  'Blocked Actions',
  'Founder Summary Template',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'demo only',
  'PUBLIC_SITE_URL',
  'tester count',
  'tester role',
  'issue ID',
  'X-Request-Id',
  'support queue',
  'known issues',
  'daily status',
  'go/no-go scorecard',
  'consent acknowledgement',
  'privacy notice',
  'consent withdrawal request',
  'data deletion request',
  'data export request',
  'data correction request',
  'use restriction request',
  'founder review',
  'legal review',
  'provider review',
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

assertIncludes(context, 'public beta weekly closeout', contextPath);
assertIncludes(backlog, 'Public beta weekly closeout', backlogPath);
assertIncludes(backlog, 'check:public-beta-weekly-closeout', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc)) {
  fail('Weekly closeout must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  weekly_closeout: docPath,
  safety_boundaries_checked: true,
}, null, 2));
