import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-known-issues.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta known issues validation failed: ${message}`);
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
  'SmartContractor Public Beta Known Issues',
  'No Secrets',
  'Known Beta Limitations',
  'Issue States',
  'Tester-Facing Language',
  'Founder-Only Follow-Up',
  'Safe Report-Back',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'P0',
  'P1',
  'P2',
  'PUBLIC_SITE_URL',
  'X-Request-Id',
  'Magic Link',
  'Supabase Auth',
  'Vercel',
  'real payments disabled',
  'real loans disabled',
  'escrow disabled',
  'token collateral disabled',
  'no SQL',
  'no secrets',
  'founder',
  'legal',
  'provider',
]) {
  assertIncludes(doc, required, docPath);
}

assertIncludes(context, 'public beta known issues', contextPath);
assertIncludes(backlog, 'Public beta known issues', backlogPath);
assertIncludes(backlog, 'check:public-beta-known-issues', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc)) {
  fail('Known issues document must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  known_issues: docPath,
  safety_boundaries_checked: true,
}, null, 2));
