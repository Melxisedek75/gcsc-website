import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-day-two-checkpoint.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta day-two checkpoint validation failed: ${message}`);
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
  'SmartContractor Public Beta Day-Two Checkpoint',
  'Purpose',
  'Required Inputs',
  'Checkpoint Order',
  'Day-Two Decision States',
  'Expansion Gates',
  'Safe Checkpoint Template',
  'Blocked Data',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'demo only',
  'public beta',
  'launch day recap',
  'next-day follow-up',
  'launch status board',
  'support queue',
  'known issues',
  'daily status',
  'weekly closeout',
  'metrics snapshot',
  'launch readiness',
  'go/no-go scorecard',
  'tester cohort',
  'invite batches',
  'session schedule',
  're-invite checklist',
  'tester offboarding',
  'data deletion request',
  'data export request',
  'data correction request',
  'use restriction request',
  'consent acknowledgement',
  'privacy notice',
  'X-Request-Id',
  'Green',
  'Yellow',
  'Red',
  'Blocked',
  'P0',
  'P1',
  'founder review',
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

assertIncludes(context, 'public beta day-two checkpoint', contextPath);
assertIncludes(context, 'check:public-beta-day-two-checkpoint', contextPath);
assertIncludes(backlog, 'Public beta day-two checkpoint', backlogPath);
assertIncludes(backlog, 'check:public-beta-day-two-checkpoint', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc)) {
  fail('Day-two checkpoint must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  day_two_checkpoint: docPath,
  safety_boundaries_checked: true,
}, null, 2));
