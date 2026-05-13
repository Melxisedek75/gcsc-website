import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const previewPath = resolve('..', 'docs', 'whitepaper-v1-2-redline-preview.md');
const referencedDocs = [
  'whitepaper-v1-2-founder-approval-brief.md',
  'whitepaper-v1-2-founder-decision-packet.md',
  'whitepaper-v1-2-public-edit-queue.md',
  'whitepaper-v1-2-claim-review-matrix.md',
  'whitepaper-v1-2-terms-glossary.md',
  'whitepaper-v1-2-public-excerpt-guard.md',
  'whitepaper-v1-2-publish-gate.md',
  'whitepaper-v1-2-approval-record-template.md',
];
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Whitepaper v1.2 redline preview validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const preview = readRequired(previewPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

for (const section of [
  'GCSC Whitepaper v1.2 Internal Redline Preview',
  'Purpose',
  'Redline Scope',
  'Section Preview',
  'Must Not Enter Public Redline',
  'Review Inputs',
  'Required Commands',
  'Safe Default',
]) {
  assertIncludes(preview, section, previewPath);
}

for (const required of [
  'internal redline preview',
  'not a published whitepaper edit',
  'SmartContractor Marketplace',
  'project contracts',
  'milestones',
  'Contractor Reputation Layer',
  'AI-assisted',
  'AI boundaries',
  'escrow-ready',
  'credit-ready',
  'stablecoin settlement roadmap',
  'tokenized construction agreements',
  'Digital Asset Market Clarity Act',
  'policy context',
  'not a legal conclusion',
  'Real Estate DAO',
  'token economics',
  'GCSC/GCST utility',
  'strict RLS/admin',
  'security review',
  'real escrow is live',
  'real lending is live',
  'real token collateral is live',
  'guaranteed contractor credit',
  'token price promise',
  'guaranteed yield',
  'AI makes automatic legal or financial decisions',
  'attorney/provider/founder approval is optional',
  'whitepaper.html',
  'npm run check:whitepaper-v1-2-redline-preview',
  'npm run check:whitepaper-v1-2-founder-approval-brief',
  'npm run check:whitepaper-v1-2-public-edit-queue',
  'npm run check',
]) {
  assertIncludes(preview, required, previewPath);
}

for (const docPath of referencedDocs) {
  assertIncludes(preview, docPath, previewPath);
  if (!existsSync(resolve('..', 'docs', docPath))) fail(`Referenced document must exist: ${docPath}`);
}

assertIncludes(context, 'whitepaper v1.2 redline preview', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-redline-preview', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 internal redline preview', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-redline-preview', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(preview)) {
  fail('Redline preview must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', redline_preview: previewPath, public_edit_block_checked: true }, null, 2));
