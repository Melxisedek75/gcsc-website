import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const previewPath = resolve('..', 'docs', 'whitepaper-v1-2-section-replacement-preview.md');
const referencedDocs = [
  'whitepaper-v1-2-founder-approval-brief.md',
  'whitepaper-v1-2-redline-preview.md',
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
  console.error(`Whitepaper v1.2 section replacement preview validation failed: ${message}`);
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
  'GCSC Whitepaper v1.2 Section Replacement Preview',
  'Purpose',
  'Proposed Opening Replacement',
  'Proposed Trust Layer Replacement',
  'Proposed Finance Roadmap Replacement',
  'Proposed Policy Context Replacement',
  'Proposed Utility And DAO Placement',
  'Must Stay Blocked',
  'Review Inputs',
  'Required Commands',
  'Safe Default',
]) {
  assertIncludes(preview, section, previewPath);
}

for (const required of [
  'internal section replacement preview',
  'not approval to edit or publish',
  'SmartContractor Marketplace',
  'project contracts',
  'milestones',
  'Contractor Reputation Layer',
  'AI-assisted workflows',
  'AI does not make automatic legal, financial, escrow, lending, token collateral, or payment release decisions',
  'escrow-ready and credit-ready',
  'not live escrow or live lending',
  'payment intent ownership model',
  'disabled real-money gates',
  'GCST',
  'stablecoin settlement',
  'tokenized construction agreements',
  'GCSC/GCST utility',
  'Digital Asset Market Clarity Act',
  'policy context',
  'do not create automatic legal approval',
  'Real Estate DAO',
  'strict RLS/admin readiness',
  'real escrow is live',
  'real lending is live',
  'real token collateral is live',
  'contractor credit is guaranteed',
  'token price is promised',
  'yield is guaranteed',
  'attorney/provider/founder approval is optional',
  'whitepaper.html',
  'npm run check:whitepaper-v1-2-section-replacement-preview',
  'npm run check:whitepaper-v1-2-redline-preview',
  'npm run check:whitepaper-v1-2-claim-review',
  'npm run check',
]) {
  assertIncludes(preview, required, previewPath);
}

for (const docPath of referencedDocs) {
  assertIncludes(preview, docPath, previewPath);
  if (!existsSync(resolve('..', 'docs', docPath))) fail(`Referenced document must exist: ${docPath}`);
}

assertIncludes(context, 'whitepaper v1.2 section replacement preview', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-section-replacement-preview', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 section replacement preview', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-section-replacement-preview', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(preview)) {
  fail('Section replacement preview must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', section_replacement_preview: previewPath, public_edit_block_checked: true }, null, 2));
