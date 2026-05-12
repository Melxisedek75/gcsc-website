import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-week-two-day-five-monitoring.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta week-two day-five monitoring validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const doc = readRequired(docPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

for (const section of [
  'SmartContractor Public Beta Week-Two Day-Five Monitoring',
  'Purpose',
  'Required Inputs',
  'Monitoring Fields',
  'Monitoring Decisions',
  'Automatic Stop Gates',
  'Safe Monitoring Template',
  'Blocked Data',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'demo-only',
  'week-two plan',
  'week-two kickoff',
  'week-two day-one status',
  'week-two day-two checkpoint',
  'week-two day-three review',
  'week-two day-four stabilization',
  'week-one decision',
  'launch status board',
  'daily status',
  'support queue',
  'support SLA',
  'known issues',
  'issue escalation matrix',
  'issue closure rules',
  'metrics snapshot',
  'regression checklist',
  'QA signoff',
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
  'public beta terms summary',
  'tester offboarding',
  'X-Request-Id',
  'Continue current group',
  'Hold expansion',
  'Run focused retest',
  'Prepare week-two decision',
  'Reduce scope',
  'Pause beta',
  'Blocked',
  'Day-one carryover',
  'Day-two carryover',
  'Day-three carryover',
  'Day-four carryover',
  'Open P0',
  'Open P1',
  'Aging P1 issues',
  'Support SLA state',
  'Tester confusion patterns',
  'Metrics snapshot changes',
  'Week-two decision readiness',
  'Founder review',
  'Legal review',
  'Provider review',
  'Automatic Stop',
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
  'real payments',
  'real loans',
  'escrow',
  'token collateral',
  'investment advice',
  'loan approval',
  'token appreciation claim',
]) {
  assertIncludes(doc, required, docPath);
}

assertIncludes(context, 'public beta week-two day-five monitoring', contextPath);
assertIncludes(context, 'check:public-beta-week-two-day-five-monitoring', contextPath);
assertIncludes(backlog, 'Public beta week-two day-five monitoring', backlogPath);
assertIncludes(backlog, 'check:public-beta-week-two-day-five-monitoring', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc)) {
  fail('Week-two day-five monitoring must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', week_two_day_five_monitoring: docPath, safety_boundaries_checked: true }, null, 2));
