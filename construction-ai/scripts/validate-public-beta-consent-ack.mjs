import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-consent-acknowledgement.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta consent acknowledgement validation failed: ${message}`);
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
  'SmartContractor Public Beta Consent Acknowledgement',
  'Purpose',
  'Plain English Acknowledgement',
  'Tester Confirms',
  'Tester Must Not Share',
  'Founder Review Required',
  'Safe Record Fields',
  'Do Not Use As Legal Advice',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'demo only',
  'PUBLIC_SITE_URL',
  'Magic Link',
  'homeowner',
  'contractor',
  'peer reviewer',
  'X-Request-Id',
  'no SQL',
  'no secrets',
  'real payments disabled',
  'real loans disabled',
  'escrow disabled',
  'token collateral disabled',
  'no investment advice',
  'no loan approval',
  'legal review',
  'provider review',
  'founder',
  'redacted screenshot',
]) {
  assertIncludes(doc, required, docPath);
}

assertIncludes(context, 'public beta consent acknowledgement', contextPath);
assertIncludes(backlog, 'Public beta consent acknowledgement', backlogPath);
assertIncludes(backlog, 'check:public-beta-consent-ack', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc)) {
  fail('Consent acknowledgement must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  consent_acknowledgement: docPath,
  safety_boundaries_checked: true,
}, null, 2));
