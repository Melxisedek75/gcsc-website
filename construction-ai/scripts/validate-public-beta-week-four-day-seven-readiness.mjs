import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-week-four-day-seven-readiness.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta week-four day-seven readiness validation failed: ${message}`);
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
  'SmartContractor Public Beta Week-Four Day-Seven Readiness',
  'Purpose',
  'Required Inputs',
  'Day-Seven Fields',
  'Day-Seven Decisions',
  'Automatic No-Go Gates',
  'Safe Readiness Template',
  'Blocked Data',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'demo-only',
  'week-four day-six decision',
  'week-four day-five monitoring',
  'week-four day-four stabilization',
  'week-four day-three review',
  'week-four day-two checkpoint',
  'week-four day-one status',
  'week-four kickoff',
  'week-four plan',
  'week-three closeout',
  'week-four closeout readiness',
  'Prepare week-four closeout',
  'Continue current group',
  'Closeout only',
  'Hold expansion',
  'Reduce scope',
  'Pause beta',
  'Blocked',
  'Day-one carryover',
  'Day-two carryover',
  'Day-three carryover',
  'Day-four carryover',
  'Day-five carryover',
  'Day-six carryover',
  'Open P0',
  'Open P1',
  'Aging P1 issues',
  'Support queue',
  'Support SLA state',
  'Known issue changes',
  'Tester confusion patterns',
  'Metrics snapshot changes',
  'Privacy/consent/data requests',
  'Founder review',
  'Legal review',
  'Provider review',
  'Automatic No-Go',
  'no SQL',
  'no secrets',
  'private contact details',
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
  'X-Request-Id',
]) {
  assertIncludes(doc, required, docPath);
}

assertIncludes(context, 'public beta week-four day-seven readiness', contextPath);
assertIncludes(context, 'check:public-beta-week-four-day-seven-readiness', contextPath);
assertIncludes(backlog, 'Public beta week-four day-seven readiness', backlogPath);
assertIncludes(backlog, 'check:public-beta-week-four-day-seven-readiness', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc)) {
  fail('Week-four day-seven readiness must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', week_four_day_seven_readiness: docPath, safety_boundaries_checked: true }, null, 2));
