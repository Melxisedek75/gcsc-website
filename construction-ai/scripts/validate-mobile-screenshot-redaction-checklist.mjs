import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const checklistPath = resolve('..', 'docs', 'smartcontractor-mobile-screenshot-redaction-checklist.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Mobile screenshot redaction checklist validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.includes(snippet)) fail(`${file} must include: ${snippet}`);
}

const checklist = readRequired(checklistPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

const requiredChecklistSnippets = [
  'SmartContractor Mobile Screenshot Redaction Checklist',
  'screenshots',
  'screen recordings',
  'Android',
  'iOS',
  'request_id',
  'private contact details',
  'wallet addresses',
  'payment data',
  'database URLs',
  'API keys',
  'no secrets',
  'no real payments',
  'Founder Report Back',
  'Approved',
  'Blocked',
];

for (const snippet of requiredChecklistSnippets) {
  assertIncludes(checklist, snippet, checklistPath);
}

assertIncludes(context, 'mobile screenshot redaction checklist', contextPath);
assertIncludes(backlog, 'Mobile screenshot redaction checklist', backlogPath);
assertIncludes(backlog, 'check:mobile-screenshot-redaction', backlogPath);

console.log(JSON.stringify({
  status: 'passed',
  checklist: checklistPath,
  safety_boundaries_checked: true,
}, null, 2));
