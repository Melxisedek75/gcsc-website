import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const rollbackPath = resolve('..', 'docs', 'whitepaper-v1-2-publication-rollback-plan.md');
const requiredDocs = [
  'whitepaper-v1-2-publication-dry-run.md',
  'whitepaper-v1-2-review-change-log.md',
  'whitepaper-v1-2-approval-record-template.md',
];
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Whitepaper v1.2 publication rollback plan validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const rollback = readRequired(rollbackPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

for (const section of [
  'GCSC Whitepaper v1.2 Publication Rollback Plan',
  'Purpose',
  'Rollback Scope',
  'Rollback Triggers',
  'Rollback Steps',
  'Required Commands',
  'Safe Default',
]) {
  assertIncludes(rollback, section, rollbackPath);
}

for (const required of [
  'internal rollback plan',
  'not approval to publish or edit',
  'whitepaper.html',
  'generated PDF export',
  'does not authorize publication',
  'real escrow is live',
  'real lending is live',
  'real token collateral is live',
  'contractor credit is guaranteed',
  'token price is promised',
  'yield is guaranteed',
  'AI makes automatic legal or financial decisions',
  'Digital Asset Market Clarity Act creates legal approval for GCSC',
  'attorney/provider/founder approval is optional',
  'founder approval record is missing',
  'attorney/provider review is missing',
  'technical approval is missing',
  'strict RLS/admin readiness',
  'disabled real-money gates',
  'Stop further sharing',
  'Restore the last approved public version',
  'Update the review change log',
  'Update the approval record',
  'npm run check:whitepaper-v1-2-publication-rollback-plan',
  'npm run check:whitepaper-v1-2-publication-dry-run',
  'npm run check:whitepaper-v1-2-review-change-log',
  'npm run check:whitepaper-v1-2-approval-record',
  'npm run check',
]) {
  assertIncludes(rollback, required, rollbackPath);
}

for (const docPath of requiredDocs) {
  assertIncludes(rollback, docPath, rollbackPath);
  if (!existsSync(resolve('..', 'docs', docPath))) fail(`Referenced document must exist: ${docPath}`);
}

assertIncludes(context, 'whitepaper v1.2 publication rollback plan', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-publication-rollback-plan', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 publication rollback plan', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-publication-rollback-plan', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(rollback)) {
  fail('Publication rollback plan must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', publication_rollback_plan: rollbackPath, public_edit_block_checked: true }, null, 2));
