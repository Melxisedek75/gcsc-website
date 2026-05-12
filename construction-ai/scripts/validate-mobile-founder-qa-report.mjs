import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const reportPath = resolve('..', 'docs', 'smartcontractor-mobile-founder-qa-report-template.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Mobile founder QA report validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.includes(snippet)) fail(`${file} must include: ${snippet}`);
}

const report = readRequired(reportPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

const requiredReportSnippets = [
  'SmartContractor Mobile Founder QA Report Template',
  'Android debug build',
  'Android emulator smoke',
  'Android physical phone smoke',
  'PWA install',
  'offline shell',
  'iOS preflight',
  'request ID',
  'screenshot redaction',
  'real payments disabled',
  'real loans disabled',
  'escrow disabled',
  'token collateral disabled',
  'No Secrets',
  'Founder Decision',
  'Safe Report-Back',
];

for (const snippet of requiredReportSnippets) {
  assertIncludes(report, snippet, reportPath);
}

assertIncludes(context, 'mobile founder QA report template', contextPath);
assertIncludes(backlog, 'Mobile founder QA report template', backlogPath);
assertIncludes(backlog, 'check:mobile-founder-qa-report', backlogPath);

console.log(JSON.stringify({
  status: 'passed',
  report: reportPath,
  safety_boundaries_checked: true,
}, null, 2));
