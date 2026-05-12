import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const commandsPath = resolve('..', 'docs', 'smartcontractor-mobile-local-qa-commands.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Mobile local QA commands validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.includes(snippet)) fail(`${file} must include: ${snippet}`);
}

const commands = readRequired(commandsPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

const requiredCommandSnippets = [
  'SmartContractor Mobile Local QA Commands',
  'No Secrets',
  'cd C:\\gcsc\\construction-ai',
  'npm run check:mobile-install-readiness',
  'npm run check:android-wrapper',
  'npm run check:android-toolchain-preflight',
  'npm run check:android-debug-build-evidence',
  'npm run check:android-emulator-smoke-evidence',
  'npm run check:android-device-smoke-checklist',
  'npm run check:mobile-screenshot-redaction',
  'npm run check:mobile-release-go-no-go',
  'npm run check:mobile-founder-qa-report',
  'npm run check',
  'gradlew.bat assembleDebug',
  'request ID',
  'real payments disabled',
  'real loans disabled',
  'escrow disabled',
  'token collateral disabled',
];

for (const snippet of requiredCommandSnippets) {
  assertIncludes(commands, snippet, commandsPath);
}

assertIncludes(context, 'mobile local QA commands', contextPath);
assertIncludes(backlog, 'Mobile local QA commands', backlogPath);
assertIncludes(backlog, 'check:mobile-local-qa-commands', backlogPath);

console.log(JSON.stringify({
  status: 'passed',
  commands: commandsPath,
  safety_boundaries_checked: true,
}, null, 2));
