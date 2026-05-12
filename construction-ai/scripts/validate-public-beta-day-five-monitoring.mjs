import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-day-five-monitoring.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta day-five monitoring validation failed: ${message}`);
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
  'SmartContractor Public Beta Day-Five Monitoring',
  'Purpose',
  'Required Inputs',
  'Monitoring Cadence',
  'Monitoring Thresholds',
  'Decision Rules',
  'Safe Monitoring Template',
  'Blocked Data',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'demo only',
  'public beta',
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
  'tester cohort',
  'invite batches',
  'session schedule',
  'session postmortem',
  'consent acknowledgement',
  'privacy notice',
  'data deletion request',
  'data export request',
  'data correction request',
  'use restriction request',
  'X-Request-Id',
  'monitoring cadence',
  'monitoring thresholds',
  'continue current group',
  'hold expansion',
  'reduce scope',
  'pause beta',
  'founder review',
  'legal review',
  'provider review',
  'Blocked',
  'P0',
  'P1',
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

assertIncludes(context, 'public beta day-five monitoring', contextPath);
assertIncludes(context, 'check:public-beta-day-five-monitoring', contextPath);
assertIncludes(backlog, 'Public beta day-five monitoring', backlogPath);
assertIncludes(backlog, 'check:public-beta-day-five-monitoring', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc)) {
  fail('Day-five monitoring must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  day_five_monitoring: docPath,
  safety_boundaries_checked: true,
}, null, 2));
