import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-qa-signoff.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta QA signoff validation failed: ${message}`);
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
  'SmartContractor Public Beta QA Signoff',
  'Purpose',
  'Signoff Inputs',
  'Required Evidence',
  'Role Coverage',
  'Issue Gates',
  'No-Go Conditions',
  'Signoff Template',
  'Blocked Data',
  'Founder Summary Template',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'demo only',
  'public beta',
  'go/no-go scorecard',
  'daily status',
  'weekly closeout',
  'support queue',
  'known issues',
  'issue ID',
  'closure state',
  'regression checklist',
  'X-Request-Id',
  'homeowner',
  'contractor',
  'peer reviewer',
  'founder/admin',
  'P0',
  'P1',
  'P2',
  'P3',
  'open',
  'verified',
  'reopened',
  'blocked',
  'founder review',
  'legal review',
  'provider review',
  'product fix',
  'technical fix',
  'no SQL',
  'no secrets',
  'private contact details',
  'email addresses',
  'phone numbers',
  'calendar links',
  'meeting links',
  'raw recordings',
  'unredacted screenshots',
  'real customer addresses',
  'payment data',
  'wallet data',
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

assertIncludes(context, 'public beta QA signoff', contextPath);
assertIncludes(context, 'check:public-beta-qa-signoff', contextPath);
assertIncludes(backlog, 'Public beta QA signoff', backlogPath);
assertIncludes(backlog, 'check:public-beta-qa-signoff', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc)) {
  fail('QA signoff must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  qa_signoff: docPath,
  safety_boundaries_checked: true,
}, null, 2));
