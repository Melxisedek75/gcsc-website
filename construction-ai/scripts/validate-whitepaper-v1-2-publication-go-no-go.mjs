import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const checklistPath = resolve('..', 'docs', 'whitepaper-v1-2-publication-go-no-go-checklist.md');
const requiredDocs = [
  'whitepaper-v1-2-publication-evidence-log.md',
  'whitepaper-v1-2-publication-dry-run.md',
  'whitepaper-v1-2-publication-rollback-plan.md',
  'whitepaper-v1-2-approval-record-template.md',
  'whitepaper-v1-2-claim-review-matrix.md',
  'whitepaper-v1-2-public-edit-queue.md',
];
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Whitepaper v1.2 publication go/no-go validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const checklist = readRequired(checklistPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

for (const section of [
  'GCSC Whitepaper v1.2 Publication Go/No-Go Checklist',
  'Purpose',
  'Decision States',
  'Required Go Criteria',
  'Automatic No-Go Triggers',
  'Required Commands',
  'Safe Default',
]) {
  assertIncludes(checklist, section, checklistPath);
}

for (const required of [
  'internal go/no-go checklist',
  'not approval to publish or edit',
  'whitepaper.html',
  'Founder approval',
  'Attorney/provider approval',
  'Technical approval',
  'Claim review',
  'Public edit queue',
  'Publication dry run',
  'Rollback readiness',
  'Evidence log',
  'strict RLS/admin readiness',
  'disabled real-money gates',
  'real escrow is live',
  'real lending is live',
  'real token collateral is live',
  'contractor credit is guaranteed',
  'token price is promised',
  'yield is guaranteed',
  'AI makes automatic legal or financial decisions',
  'Digital Asset Market Clarity Act creates legal approval for GCSC',
  'attorney/provider/founder approval is optional',
  'public files can be changed before approvals are recorded',
  'npm run check:whitepaper-v1-2-publication-go-no-go',
  'npm run check:whitepaper-v1-2-publication-evidence-log',
  'npm run check:whitepaper-v1-2-publication-dry-run',
  'npm run check:whitepaper-v1-2-publication-rollback-plan',
  'npm run check:whitepaper-v1-2-approval-record',
  'npm run check:whitepaper-v1-2-claim-review',
  'npm run check',
]) {
  assertIncludes(checklist, required, checklistPath);
}

for (const docPath of requiredDocs) {
  assertIncludes(checklist, docPath, checklistPath);
  if (!existsSync(resolve('..', 'docs', docPath))) fail(`Referenced document must exist: ${docPath}`);
}

assertIncludes(context, 'whitepaper v1.2 publication go/no-go checklist', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-publication-go-no-go', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 publication go/no-go checklist', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-publication-go-no-go', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(checklist)) {
  fail('Publication go/no-go checklist must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', publication_go_no_go: checklistPath, public_edit_block_checked: true }, null, 2));
