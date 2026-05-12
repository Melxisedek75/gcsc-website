import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-week-one-decision.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta week-one decision validation failed: ${message}`);
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
  'SmartContractor Public Beta Week-One Decision',
  'Purpose',
  'Required Inputs',
  'Decision Options',
  'Required Checks',
  'Automatic No-Go Gates',
  'Safe Decision Template',
  'Blocked Data',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'demo-only',
  'public beta',
  'week-one decision',
  'public beta day-seven readiness',
  'day-six decision',
  'day-five monitoring',
  'day-four stabilization',
  'day-three review',
  'day-two checkpoint',
  'next-day follow-up',
  'launch day recap',
  'launch status board',
  'daily status',
  'weekly closeout',
  'metrics snapshot',
  'support queue',
  'support SLA',
  'known issues',
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
  'privacy notice',
  'consent acknowledgement',
  'consent withdrawal request',
  'data deletion request',
  'data export request',
  'data correction request',
  'use restriction request',
  'X-Request-Id',
  'Continue current group',
  'Expand one small batch',
  'Hold expansion',
  'Reduce scope',
  'Pause beta',
  'Blocked',
  'P0',
  'P1',
  'Founder review',
  'legal review',
  'provider review',
  'Automatic No-Go',
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
  'investment advice',
  'loan approval',
  'token appreciation claim',
]) {
  assertIncludes(doc, required, docPath);
}

assertIncludes(context, 'public beta week-one decision', contextPath);
assertIncludes(context, 'check:public-beta-week-one-decision', contextPath);
assertIncludes(backlog, 'Public beta week-one decision', backlogPath);
assertIncludes(backlog, 'check:public-beta-week-one-decision', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc)) {
  fail('Week-one decision must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  week_one_decision: docPath,
  safety_boundaries_checked: true,
}, null, 2));
