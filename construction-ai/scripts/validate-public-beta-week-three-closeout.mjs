import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-week-three-closeout.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta week-three closeout validation failed: ${message}`);
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
  'SmartContractor Public Beta Week-Three Closeout',
  'Purpose',
  'Required Inputs',
  'Closeout Fields',
  'Closeout Decisions',
  'Automatic No-Go Gates',
  'Safe Closeout Template',
  'Blocked Data',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'demo-only',
  'week-three plan',
  'week-three kickoff',
  'week-three day-one status',
  'week-three day-two checkpoint',
  'week-three day-three review',
  'week-three day-four stabilization',
  'week-three day-five monitoring',
  'week-three day-six decision',
  'week-three day-seven readiness',
  'week-two closeout',
  'launch status board',
  'daily status',
  'weekly closeout',
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
  'Prepare week four',
  'Run focused retest',
  'Reduce scope',
  'Pause beta',
  'Blocked',
  'Week-two closeout carryover',
  'Day-one carryover',
  'Day-two carryover',
  'Day-three carryover',
  'Day-four carryover',
  'Day-five carryover',
  'Day-six carryover',
  'Day-seven carryover',
  'Open P0',
  'Open P1',
  'Aging P1 issues',
  'Support SLA state',
  'Tester confusion patterns',
  'Metrics snapshot changes',
  'Week-four recommendation',
  'Founder review',
  'Legal review',
  'Provider review',
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
  'deployment setting changes',
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

assertIncludes(context, 'public beta week-three closeout', contextPath);
assertIncludes(context, 'check:public-beta-week-three-closeout', contextPath);
assertIncludes(backlog, 'Public beta week-three closeout', backlogPath);
assertIncludes(backlog, 'check:public-beta-week-three-closeout', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc)) {
  fail('Week-three closeout must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', week_three_closeout: docPath, safety_boundaries_checked: true }, null, 2));
