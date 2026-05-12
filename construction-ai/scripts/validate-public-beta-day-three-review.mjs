import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-day-three-review.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta day-three review validation failed: ${message}`);
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
  'SmartContractor Public Beta Day-Three Review',
  'Purpose',
  'Required Inputs',
  'Review Order',
  'Day-Three Decision States',
  'Founder Review Packet',
  'Safe Review Template',
  'Blocked Data',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'demo only',
  'public beta',
  'launch day recap',
  'next-day follow-up',
  'day-two checkpoint',
  'launch status board',
  'support queue',
  'support SLA',
  'known issues',
  'daily status',
  'weekly closeout',
  'metrics snapshot',
  'issue escalation matrix',
  'issue closure rules',
  'regression checklist',
  'QA signoff',
  'launch readiness',
  'go/no-go scorecard',
  'tester cohort',
  'invite batches',
  'session schedule',
  'session postmortem',
  'data deletion request',
  'data export request',
  'data correction request',
  'use restriction request',
  'privacy notice',
  'consent acknowledgement',
  'X-Request-Id',
  'Continue',
  'Limited expand',
  'Pause',
  'Shrink',
  'Founder review',
  'Blocked',
  'P0',
  'P1',
  'legal review',
  'provider review',
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

assertIncludes(context, 'public beta day-three review', contextPath);
assertIncludes(context, 'check:public-beta-day-three-review', contextPath);
assertIncludes(backlog, 'Public beta day-three review', backlogPath);
assertIncludes(backlog, 'check:public-beta-day-three-review', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc)) {
  fail('Day-three review must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  day_three_review: docPath,
  safety_boundaries_checked: true,
}, null, 2));
