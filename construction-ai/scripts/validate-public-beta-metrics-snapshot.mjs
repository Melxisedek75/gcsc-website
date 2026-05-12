import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-metrics-snapshot.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta metrics snapshot validation failed: ${message}`);
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
  'SmartContractor Public Beta Metrics Snapshot',
  'Purpose',
  'When To Use This',
  'Safe Metrics Fields',
  'Metric Groups',
  'Founder Review Rules',
  'Metrics Snapshot Format',
  'Blocked Actions',
  'Founder Summary Template',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'demo only',
  'PUBLIC_SITE_URL',
  'week label',
  'tester count',
  'tester role',
  'session count',
  'issue ID',
  'X-Request-Id',
  'support queue',
  'daily status',
  'weekly closeout',
  'job posts',
  'bid submissions',
  'starter loan requests',
  'milestone views',
  'dispute submissions',
  'peer review submissions',
  'admin review views',
  'known issues',
  'go/no-go scorecard',
  'completion rate',
  'trust signal',
  'blocked flow',
  'founder review',
  'legal review',
  'provider review',
  'no SQL',
  'no secrets',
  'personal IDs',
  'private contact details',
  'payment data',
  'wallet data',
  'real customer addresses',
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

assertIncludes(context, 'public beta metrics snapshot', contextPath);
assertIncludes(backlog, 'Public beta metrics snapshot', backlogPath);
assertIncludes(backlog, 'check:public-beta-metrics-snapshot', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc)) {
  fail('Metrics snapshot must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  metrics_snapshot: docPath,
  safety_boundaries_checked: true,
}, null, 2));
