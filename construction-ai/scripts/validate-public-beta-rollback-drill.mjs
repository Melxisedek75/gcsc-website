import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-rollback-drill.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta rollback drill validation failed: ${message}`);
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
  'SmartContractor Public Beta Rollback Drill',
  'No Secrets',
  'Trigger Conditions',
  'Founder-Controlled Rollback Paths',
  'Read-Only Verification',
  'Do Not Do',
  'Safe Report-Back',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'PUBLIC_SITE_URL',
  'SMARTCONTRACTOR_ROUTE_PROTECTION=draft',
  'SMARTCONTRACTOR_ADMIN_ENFORCEMENT_MODE=draft',
  'Supabase Auth redirect',
  'Vercel',
  'previous deployment',
  'npm run check',
  '/api/health',
  '/api/admin/beta-readiness',
  '/api/admin/production-readiness',
  'X-Request-Id',
  'real payments disabled',
  'real loans disabled',
  'escrow disabled',
  'token collateral disabled',
  'no SQL',
  'no secrets',
]) {
  assertIncludes(doc, required, docPath);
}

assertIncludes(context, 'public beta rollback drill', contextPath);
assertIncludes(backlog, 'Public beta rollback drill', backlogPath);
assertIncludes(backlog, 'check:public-beta-rollback-drill', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]/i.test(doc)) {
  fail('Rollback drill must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  drill: docPath,
  safety_boundaries_checked: true,
}, null, 2));
