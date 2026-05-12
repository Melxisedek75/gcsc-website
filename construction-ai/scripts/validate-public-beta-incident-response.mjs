import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-incident-response.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta incident response validation failed: ${message}`);
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
  'SmartContractor Public Beta Incident Response',
  'No Secrets',
  'Severity Levels',
  'First 15 Minutes',
  'Evidence To Capture',
  'Escalation Rules',
  'Do Not Do',
  'Safe Report-Back',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'P0',
  'P1',
  'P2',
  'X-Request-Id',
  'PUBLIC_SITE_URL',
  '/api/health',
  '/api/admin/beta-readiness',
  '/api/admin/production-readiness',
  'real payments disabled',
  'real loans disabled',
  'escrow disabled',
  'token collateral disabled',
  'public beta rollback drill',
  'no SQL',
  'no secrets',
  'founder',
  'legal',
  'provider',
]) {
  assertIncludes(doc, required, docPath);
}

assertIncludes(context, 'public beta incident response', contextPath);
assertIncludes(backlog, 'Public beta incident response', backlogPath);
assertIncludes(backlog, 'check:public-beta-incident-response', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc)) {
  fail('Incident response document must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  incident_response: docPath,
  safety_boundaries_checked: true,
}, null, 2));
