import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-launch-readiness.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta launch readiness validation failed: ${message}`);
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
  'SmartContractor Public Beta Launch Readiness',
  'Purpose',
  'Readiness Inputs',
  'Green Conditions',
  'Review Conditions',
  'No-Go Conditions',
  'Founder Launch Snapshot',
  'Blocked Actions',
  'Founder Decision Template',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'demo only',
  'PUBLIC_SITE_URL',
  'npm run check',
  'public beta review packet',
  'public beta handoff checklist',
  'public beta metrics snapshot',
  'public beta launch message',
  'public beta tester FAQ',
  'public beta consent acknowledgement',
  'public beta privacy notice',
  'support queue',
  'known issues',
  'go/no-go scorecard',
  'daily status',
  'weekly closeout',
  'X-Request-Id',
  'Founder Action Center',
  'Magic Link',
  'Supabase Auth redirect',
  'Vercel',
  'founder review',
  'legal review',
  'provider review',
  'no SQL',
  'no secrets',
  'database URLs',
  'API keys',
  'service-role keys',
  'Magic Link tokens',
  'private contact details',
  'payment data',
  'wallet data',
  'real payments disabled',
  'real loans disabled',
  'escrow disabled',
  'token collateral disabled',
  'not production-ready',
]) {
  assertIncludes(doc, required, docPath);
}

assertIncludes(context, 'public beta launch readiness', contextPath);
assertIncludes(backlog, 'Public beta launch readiness', backlogPath);
assertIncludes(backlog, 'check:public-beta-launch-readiness', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc)) {
  fail('Launch readiness must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  launch_readiness: docPath,
  safety_boundaries_checked: true,
}, null, 2));
