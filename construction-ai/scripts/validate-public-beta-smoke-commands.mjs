import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-public-beta-smoke-commands.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta smoke commands validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.includes(snippet)) fail(`${file} must include: ${snippet}`);
}

const doc = readRequired(docPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

const requiredDocSnippets = [
  'SmartContractor Public Beta Smoke Commands',
  'No Secrets',
  'PUBLIC_SITE_URL',
  'read-only',
  'Invoke-WebRequest',
  '/api/health',
  '/api/admin/beta-readiness',
  '/api/admin/mobile-install-readiness',
  '/api/admin/production-readiness',
  'X-Request-Id',
  'security headers',
  'real payments disabled',
  'real loans disabled',
  'escrow disabled',
  'token collateral disabled',
  'Do not run',
  'Safe Report-Back',
];

for (const snippet of requiredDocSnippets) {
  assertIncludes(doc, snippet, docPath);
}

assertIncludes(context, 'public beta smoke commands', contextPath);
assertIncludes(backlog, 'Public beta smoke commands', backlogPath);
assertIncludes(backlog, 'check:public-beta-smoke-commands', backlogPath);

console.log(JSON.stringify({
  status: 'passed',
  commands: docPath,
  safety_boundaries_checked: true,
}, null, 2));
