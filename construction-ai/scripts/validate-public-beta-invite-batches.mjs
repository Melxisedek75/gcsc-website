import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-invite-batches.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta invite batch validation failed: ${message}`);
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
  'SmartContractor Public Beta Invite Batch Tracker',
  'Purpose',
  'Safe Batch Fields',
  'Batch Size Rules',
  'Batch Gates',
  'Batch Table Template',
  'Pause Rules',
  'Blocked Data',
  'Founder Summary Template',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'demo only',
  'batch code',
  'tester cohort',
  'tester role',
  'homeowner',
  'contractor',
  'peer reviewer',
  'founder/admin',
  'invite status',
  'consent status',
  'privacy notice',
  'quickstart sent',
  'support queue',
  'known issues',
  'go/no-go scorecard',
  'daily status',
  'weekly closeout',
  'X-Request-Id',
  'founder review',
  'legal review',
  'provider review',
  'no SQL',
  'no secrets',
  'private contact details',
  'email addresses',
  'phone numbers',
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

assertIncludes(context, 'public beta invite batch', contextPath);
assertIncludes(backlog, 'Public beta invite batch tracker', backlogPath);
assertIncludes(backlog, 'check:public-beta-invite-batches', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc)) {
  fail('Invite batch tracker must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  invite_batches: docPath,
  safety_boundaries_checked: true,
}, null, 2));
