import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const reportPath = resolve('..', 'docs', 'smartcontractor-public-beta-env-report-template.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Public beta env report validation failed: ${message}`);
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
  'SmartContractor Public Beta Environment Report Template',
  'No Secrets',
  'PUBLIC_SITE_URL',
  'CORS origins',
  'Supabase Auth redirect',
  'Magic Link',
  'service-role key',
  'real payments disabled',
  'real loans disabled',
  'escrow disabled',
  'token collateral disabled',
  'Vercel',
  'request ID',
  'Founder Decision',
  'Safe Report-Back',
];

for (const snippet of requiredReportSnippets) {
  assertIncludes(report, snippet, reportPath);
}

assertIncludes(context, 'public beta environment report template', contextPath);
assertIncludes(backlog, 'Public beta environment report template', backlogPath);
assertIncludes(backlog, 'check:public-beta-env-report', backlogPath);

console.log(JSON.stringify({
  status: 'passed',
  report: reportPath,
  safety_boundaries_checked: true,
}, null, 2));
