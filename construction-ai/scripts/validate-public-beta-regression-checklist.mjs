import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-regression-checklist.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta regression checklist validation failed: ${message}`);
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
  'SmartContractor Public Beta Regression Checklist',
  'Purpose',
  'When To Run',
  'Regression Inputs',
  'Core Paths',
  'Safety Gates',
  'Retest Matrix',
  'Issue Linkage',
  'Regression Report Template',
  'Blocked Data',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'demo only',
  'issue ID',
  'closure state',
  'X-Request-Id',
  'homeowner',
  'contractor',
  'peer reviewer',
  'founder/admin',
  'job post',
  'bid submission',
  'starter loan',
  'milestone',
  'dispute',
  'evidence',
  'peer review',
  'admin review',
  'support queue',
  'known issues',
  'daily status',
  'weekly closeout',
  'go/no-go scorecard',
  'open',
  'fixed locally',
  'verified',
  'reopened',
  'product fix',
  'technical fix',
  'founder review',
  'legal review',
  'provider review',
  'blocked',
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

assertIncludes(context, 'public beta regression checklist', contextPath);
assertIncludes(context, 'check:public-beta-regression-checklist', contextPath);
assertIncludes(backlog, 'Public beta regression checklist', backlogPath);
assertIncludes(backlog, 'check:public-beta-regression-checklist', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc)) {
  fail('Regression checklist must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  regression_checklist: docPath,
  safety_boundaries_checked: true,
}, null, 2));
