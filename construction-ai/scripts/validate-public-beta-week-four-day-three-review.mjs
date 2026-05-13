import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-week-four-day-three-review.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta week-four day-three review validation failed: ${message}`);
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
  'SmartContractor Public Beta Week-Four Day-Three Review',
  'Purpose',
  'Required Inputs',
  'Day-Three Fields',
  'Day-Three Decisions',
  'Automatic No-Go Gates',
  'Safe Review Template',
  'Blocked Data',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'demo-only',
  'week-four day-two checkpoint',
  'week-four day-one status',
  'week-four kickoff',
  'week-four plan',
  'week-three closeout',
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
  'session moderator checklist',
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
  'Continue stabilization retest',
  'Hold expansion',
  'Limited expansion',
  'Reduce scope',
  'Pause beta',
  'Blocked',
  'Day-one carryover',
  'Day-two carryover',
  'Open P0',
  'Open P1',
  'Aging P1 issues',
  'Support SLA state',
  'Known issue changes',
  'Tester confusion patterns',
  'Metrics snapshot changes',
  'Expansion readiness',
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

assertIncludes(context, 'public beta week-four day-three review', contextPath);
assertIncludes(context, 'check:public-beta-week-four-day-three-review', contextPath);
assertIncludes(backlog, 'Public beta week-four day-three review', backlogPath);
assertIncludes(backlog, 'check:public-beta-week-four-day-three-review', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc)) {
  fail('Week-four day-three review must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', week_four_day_three_review: docPath, safety_boundaries_checked: true }, null, 2));
