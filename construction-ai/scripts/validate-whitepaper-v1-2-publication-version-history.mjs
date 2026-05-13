import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const versionHistoryPath = resolve('..', 'docs', 'whitepaper-v1-2-publication-version-history.md');
const requiredDocs = [
  'whitepaper-v1-2-publication-go-no-go-checklist.md',
  'whitepaper-v1-2-publication-correction-notice.md',
  'whitepaper-v1-2-publication-evidence-log.md',
  'whitepaper-v1-2-publication-rollback-plan.md',
  'whitepaper-v1-2-public-edit-queue.md',
  'whitepaper-v1-2-approval-record-template.md',
];
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Whitepaper v1.2 publication version history validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const versionHistory = readRequired(versionHistoryPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

for (const section of [
  'GCSC Whitepaper v1.2 Publication Version History',
  'Purpose',
  'Version States',
  'Version Record Template',
  'Required Version Boundaries',
  'Automatic No-Go Triggers',
  'Required Commands',
  'Safe Default',
]) {
  assertIncludes(versionHistory, section, versionHistoryPath);
}

for (const required of [
  'internal version history template',
  'not approval to publish, edit, recall, supersede, or replace',
  'whitepaper.html',
  'Draft',
  'Review',
  'Approved',
  'Published',
  'Corrected',
  'Superseded',
  'Recalled',
  'Archived',
  'public edit queue is locked',
  'founder approval',
  'attorney/provider approval',
  'technical approval',
  'claim review',
  'publication evidence',
  'rollback readiness',
  'correction notice',
  'real escrow is live',
  'real lending is live',
  'real token collateral is live',
  'contractor credit is guaranteed',
  'token price is promised',
  'yield is guaranteed',
  'AI makes automatic legal or financial decisions',
  'Digital Asset Market Clarity Act creates legal approval for GCSC',
  'attorney/provider/founder approval is optional',
  'npm run check:whitepaper-v1-2-publication-version-history',
  'npm run check:whitepaper-v1-2-publication-go-no-go',
  'npm run check:whitepaper-v1-2-publication-correction-notice',
  'npm run check:whitepaper-v1-2-publication-evidence-log',
  'npm run check:whitepaper-v1-2-publication-rollback-plan',
  'npm run check',
]) {
  assertIncludes(versionHistory, required, versionHistoryPath);
}

for (const docPath of requiredDocs) {
  assertIncludes(versionHistory, docPath, versionHistoryPath);
  if (!existsSync(resolve('..', 'docs', docPath))) fail(`Referenced document must exist: ${docPath}`);
}

assertIncludes(context, 'whitepaper v1.2 publication version history', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-publication-version-history', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 publication version history', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-publication-version-history', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(versionHistory)) {
  fail('Publication version history must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', publication_version_history: versionHistoryPath, public_edit_block_checked: true }, null, 2));
