import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-android-toolchain-preflight.md');
const androidRoot = resolve('android');
const gradleWrapperPath = resolve('android', 'gradlew.bat');

function fail(message) {
  console.error(`Android toolchain preflight validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) {
    fail(`Missing required file: ${path}`);
  }
  return readFileSync(path, 'utf8');
}

function requireIncludes(content, snippet, label) {
  if (!content.includes(snippet)) {
    fail(`${label} must include: ${snippet}`);
  }
}

const doc = readRequired(docPath);
const gradleWrapper = readRequired(gradleWrapperPath);

const requiredDocSnippets = [
  'JAVA_HOME',
  'java -version',
  'ANDROID_HOME',
  'Android SDK',
  'gradlew.bat assembleDebug',
  'C:\\gcsc\\construction-ai\\android',
  'no secrets',
  'no Play Console',
  'Founder Action Step',
];

for (const snippet of requiredDocSnippets) {
  requireIncludes(doc, snippet, docPath);
}

requireIncludes(gradleWrapper, 'Gradle', gradleWrapperPath);

const javaProbe = spawnSync('java', ['-version'], {
  encoding: 'utf8',
  windowsHide: true,
});

const javaOutput = `${javaProbe.stdout || ''}${javaProbe.stderr || ''}`;
const javaAvailable = javaProbe.status === 0 || /version/i.test(javaOutput);

console.log(JSON.stringify({
  status: 'passed',
  android_root: androidRoot,
  document: docPath,
  java_available: javaAvailable,
  java_home_set: Boolean(process.env.JAVA_HOME),
  android_home_set: Boolean(process.env.ANDROID_HOME),
  debug_build_still_blocked_without_toolchain: !javaAvailable || !process.env.JAVA_HOME || !process.env.ANDROID_HOME,
  safety_boundaries_checked: true,
}, null, 2));
