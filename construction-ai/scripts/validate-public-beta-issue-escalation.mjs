import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-issue-escalation.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta issue escalation validation failed: ${message}`);
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
  'SmartContractor Public Beta Issue Escalation Matrix',
  'Purpose',
  'Escalation Inputs',
  'Severity Matrix',
  'Routing Matrix',
  'Stop Conditions',
  'Owner Handoff',
  'Escalation Template',
  'Blocked Data',
  'Founder Summary Template',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'demo only',
  'session code',
  'batch code',
  'tester cohort',
  'tester role',
  'flow result',
  'issue ID',
  'X-Request-Id',
  'support queue',
  'known issues',
  'trust blocker',
  'severity',
  'P0',
  'P1',
  'P2',
  'P3',
  'product fix',
  'technical fix',
  'founder review',
  'legal review',
  'provider review',
  'blocked',
  'next action',
  'daily status',
  'weekly closeout',
  'go/no-go scorecard',
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

assertIncludes(context, 'public beta issue escalation', contextPath);
assertIncludes(context, 'check:public-beta-issue-escalation', contextPath);
assertIncludes(backlog, 'Public beta issue escalation matrix', backlogPath);
assertIncludes(backlog, 'check:public-beta-issue-escalation', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc)) {
  fail('Issue escalation matrix must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  issue_escalation: docPath,
  safety_boundaries_checked: true,
}, null, 2));
