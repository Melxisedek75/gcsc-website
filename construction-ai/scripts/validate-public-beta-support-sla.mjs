import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-support-sla.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta support SLA validation failed: ${message}`);
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
  'SmartContractor Public Beta Support SLA',
  'No Secrets',
  'Severity Windows',
  'Escalation Rules',
  'Founder-Present Actions',
  'Closure Rules',
  'Safe Report-Back',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'P0',
  'P1',
  'P2',
  '15 minutes',
  '4 hours',
  '2 business days',
  'X-Request-Id',
  'founder',
  'legal',
  'provider',
  'technical',
  'PUBLIC_SITE_URL',
  'real payments disabled',
  'real loans disabled',
  'escrow disabled',
  'token collateral disabled',
  'no SQL',
  'no secrets',
]) {
  assertIncludes(doc, required, docPath);
}

assertIncludes(context, 'public beta support SLA', contextPath);
assertIncludes(backlog, 'Public beta support SLA', backlogPath);
assertIncludes(backlog, 'check:public-beta-support-sla', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc)) {
  fail('Support SLA document must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  support_sla: docPath,
  safety_boundaries_checked: true,
}, null, 2));
