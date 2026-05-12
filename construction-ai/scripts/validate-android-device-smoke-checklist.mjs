import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const checklistPath = resolve('..', 'docs', 'smartcontractor-android-device-smoke-checklist.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Android device smoke checklist validation failed: ${message}`);
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
  'SmartContractor Android Device Smoke Checklist',
  'physical Android phone',
  'USB debugging',
  'adb devices',
  'adb install',
  'app-debug.apk',
  'C:\\gcsc\\construction-ai\\android',
  'Launch app',
  'Offline check',
  'WebAuth',
  'no secrets',
  'no Play Console',
  'no real payments',
  'Blocked',
  'Passed',
  'Failed',
  'Founder Report Back',
];

for (const snippet of requiredChecklistSnippets) {
  assertIncludes(checklist, snippet, checklistPath);
}

assertIncludes(context, 'Android physical device smoke checklist', contextPath);
assertIncludes(backlog, 'Android physical device smoke checklist', backlogPath);
assertIncludes(backlog, 'check:android-device-smoke-checklist', backlogPath);

console.log(JSON.stringify({
  status: 'passed',
  checklist: checklistPath,
  safety_boundaries_checked: true,
}, null, 2));
