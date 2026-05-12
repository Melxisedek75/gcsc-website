import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const matrixPath = resolve('..', 'docs', 'smartcontractor-mobile-release-go-no-go-matrix.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Mobile release go/no-go matrix validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.includes(snippet)) fail(`${file} must include: ${snippet}`);
}

const matrix = readRequired(matrixPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

const requiredMatrixSnippets = [
  'SmartContractor Mobile Release Go/No-Go Matrix',
  'Android debug build',
  'Android emulator smoke',
  'Android physical phone smoke',
  'iOS preflight',
  'PWA install',
  'offline shell',
  'screenshot redaction',
  'store accounts',
  'production signing keys',
  'real payments disabled',
  'real loans disabled',
  'escrow disabled',
  'token collateral disabled',
  'Founder Decision',
  'Go',
  'Review',
  'No-Go',
];

for (const snippet of requiredMatrixSnippets) {
  assertIncludes(matrix, snippet, matrixPath);
}

assertIncludes(context, 'mobile release go/no-go matrix', contextPath);
assertIncludes(backlog, 'Mobile release go/no-go matrix', backlogPath);
assertIncludes(backlog, 'check:mobile-release-go-no-go', backlogPath);

console.log(JSON.stringify({
  status: 'passed',
  matrix: matrixPath,
  safety_boundaries_checked: true,
}, null, 2));
