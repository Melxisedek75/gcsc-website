import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const blockersPath = resolve('..', 'docs', 'smartcontractor-mobile-release-blockers.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Mobile release blockers validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.includes(snippet)) fail(`${file} must include: ${snippet}`);
}

const blockers = readRequired(blockersPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

const requiredBlockerSnippets = [
  'SmartContractor Mobile Release Blockers',
  'Android',
  'iOS',
  'JDK 17',
  'JAVA_HOME',
  'ANDROID_HOME',
  'gradlew.bat assembleDebug',
  'emulator smoke',
  'physical Android phone',
  'Apple Developer',
  'App Store Connect',
  'production signing keys',
  'Google Play Console',
  'no real payments',
  'no real loans',
  'no escrow',
  'no token collateral',
  'Founder Go / No-Go',
];

for (const snippet of requiredBlockerSnippets) {
  assertIncludes(blockers, snippet, blockersPath);
}

assertIncludes(context, 'mobile release blockers', contextPath);
assertIncludes(backlog, 'Mobile release blockers', backlogPath);
assertIncludes(backlog, 'check:mobile-release-blockers', backlogPath);

console.log(JSON.stringify({
  status: 'passed',
  blockers: blockersPath,
  safety_boundaries_checked: true,
}, null, 2));
