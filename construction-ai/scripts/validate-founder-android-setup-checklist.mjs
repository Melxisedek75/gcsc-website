import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const checklistPath = resolve('..', 'docs', 'smartcontractor-founder-android-setup-checklist.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Founder Android setup checklist validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.includes(snippet)) {
    fail(`${file} must include: ${snippet}`);
  }
}

const checklist = readRequired(checklistPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

const requiredChecklistSnippets = [
  'Founder Android Setup Checklist',
  'Step 1',
  'Step 2',
  'Step 3',
  'JDK 17',
  'Android Studio',
  'JAVA_HOME',
  'ANDROID_HOME',
  'java -version',
  'gradlew.bat assembleDebug',
  'C:\\gcsc\\construction-ai\\android',
  'no secrets',
  'no Play Console',
  'Do not paste passwords',
  'Report Back',
];

for (const snippet of requiredChecklistSnippets) {
  assertIncludes(checklist, snippet, checklistPath);
}

assertIncludes(context, 'Founder Android setup checklist', contextPath);
assertIncludes(backlog, 'Founder Android setup checklist', backlogPath);
assertIncludes(backlog, 'check:founder-android-setup', backlogPath);

console.log(JSON.stringify({
  status: 'passed',
  checklist: checklistPath,
  safety_boundaries_checked: true,
}, null, 2));
