import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-issue-closure.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta issue closure validation failed: ${message}`);
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
  'SmartContractor Public Beta Issue Closure Rules',
  'Purpose',
  'Closure Inputs',
  'Closure States',
  'Close Criteria',
  'Do Not Close Criteria',
  'Verification Evidence',
  'Closure Template',
  'Blocked Data',
  'Founder Summary Template',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'demo only',
  'issue ID',
  'session code',
  'batch code',
  'tester cohort',
  'tester role',
  'X-Request-Id',
  'support queue',
  'known issues',
  'trust blocker',
  'severity',
  'P0',
  'P1',
  'P2',
  'P3',
  'open',
  'fixed locally',
  'verified',
  'deferred',
  'blocked',
  'reopened',
  'product fix',
  'technical fix',
  'founder review',
  'legal review',
  'provider review',
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

assertIncludes(context, 'public beta issue closure', contextPath);
assertIncludes(context, 'check:public-beta-issue-closure', contextPath);
assertIncludes(backlog, 'Public beta issue closure rules', backlogPath);
assertIncludes(backlog, 'check:public-beta-issue-closure', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc)) {
  fail('Issue closure rules must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  issue_closure: docPath,
  safety_boundaries_checked: true,
}, null, 2));
