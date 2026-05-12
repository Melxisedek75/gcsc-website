import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const evidencePath = resolve('..', 'docs', 'smartcontractor-android-debug-build-evidence.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Android debug build evidence validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.includes(snippet)) fail(`${file} must include: ${snippet}`);
}

const evidence = readRequired(evidencePath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

const requiredEvidenceSnippets = [
  'SmartContractor Android Debug Build Evidence',
  'C:\\gcsc\\construction-ai\\android',
  'gradlew.bat assembleDebug',
  'app-debug.apk',
  'java -version',
  'JAVA_HOME',
  'ANDROID_HOME',
  'Request ID',
  'no secrets',
  'no Play Console',
  'Blocked',
  'Passed',
  'Failed',
  'Founder Report Back',
];

for (const snippet of requiredEvidenceSnippets) {
  assertIncludes(evidence, snippet, evidencePath);
}

assertIncludes(context, 'Android debug build evidence', contextPath);
assertIncludes(backlog, 'Android debug build evidence', backlogPath);
assertIncludes(backlog, 'check:android-debug-build-evidence', backlogPath);

console.log(JSON.stringify({
  status: 'passed',
  evidence: evidencePath,
  safety_boundaries_checked: true,
}, null, 2));
