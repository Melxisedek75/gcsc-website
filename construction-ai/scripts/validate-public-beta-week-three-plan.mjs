import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-week-three-plan.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta week-three plan validation failed: ${message}`);
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
  'SmartContractor Public Beta Week-Three Plan',
  'Purpose',
  'Required Inputs',
  'Week-Three Scope',
  'Planning Fields',
  'Automatic No-Go Gates',
  'Safe Plan Template',
  'Blocked Data',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'demo-only',
  'week-two closeout',
  'week-two day-seven readiness',
  'week-two day-six decision',
  'week-two day-five monitoring',
  'week-two day-four stabilization',
  'week-one decision',
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
  'Focused retest',
  'Limited expansion',
  'Hold expansion',
  'Reduce scope',
  'Pause beta',
  'Blocked',
  'Open P0',
  'Open P1',
  'Aging P1 issues',
  'Support SLA state',
  'Known issue changes',
  'Metrics snapshot changes',
  'Privacy/consent/data requests',
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

assertIncludes(context, 'public beta week-three plan', contextPath);
assertIncludes(context, 'check:public-beta-week-three-plan', contextPath);
assertIncludes(backlog, 'Public beta week-three plan', backlogPath);
assertIncludes(backlog, 'check:public-beta-week-three-plan', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc)) {
  fail('Week-three plan must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', week_three_plan: docPath, safety_boundaries_checked: true }, null, 2));
