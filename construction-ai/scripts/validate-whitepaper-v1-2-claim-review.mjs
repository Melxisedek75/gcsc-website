import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const matrixPath = resolve('..', 'docs', 'whitepaper-v1-2-claim-review-matrix.md');
const sourceMapPath = resolve('..', 'docs', 'whitepaper-v1-2-source-map.md');
const termsPath = resolve('..', 'docs', 'whitepaper-v1-2-terms-glossary.md');
const excerptGuardPath = resolve('..', 'docs', 'whitepaper-v1-2-public-excerpt-guard.md');
const publishGatePath = resolve('..', 'docs', 'whitepaper-v1-2-publish-gate.md');
const approvalRecordPath = resolve('..', 'docs', 'whitepaper-v1-2-approval-record-template.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Whitepaper v1.2 claim review validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const matrix = readRequired(matrixPath);
const sourceMap = readRequired(sourceMapPath);
const terms = readRequired(termsPath);
const excerptGuard = readRequired(excerptGuardPath);
const publishGate = readRequired(publishGatePath);
const approvalRecord = readRequired(approvalRecordPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

for (const section of [
  'GCSC Whitepaper v1.2 Claim Review Matrix',
  'Purpose',
  'Safe Product Claims',
  'Review-Required Claims',
  'Blocked Claims',
  'Evidence To Check',
  'Required Commands',
  'Safe Default',
]) {
  assertIncludes(matrix, section, matrixPath);
}

for (const required of [
  'SmartContractor Marketplace',
  'project contracts',
  'milestones',
  'Contractor Reputation Layer',
  'AI-assisted',
  'escrow-ready',
  'credit-ready',
  'stablecoin settlement roadmap',
  'Digital Asset Market Clarity Act',
  'policy context',
  'not a legal conclusion',
  'attorney/provider/founder approval',
  'real escrow is live',
  'real lending is live',
  'real token collateral is live',
  'guaranteed contractor credit',
  'guaranteed yield',
  'token price promise',
  'AI makes automatic legal or financial decisions',
  'whitepaper-v1-2-source-map.md',
  'whitepaper-v1-2-terms-glossary.md',
  'whitepaper-v1-2-public-excerpt-guard.md',
  'whitepaper-v1-2-publish-gate.md',
  'whitepaper-v1-2-approval-record-template.md',
  'npm run check:whitepaper-v1-2-claim-review',
  'npm run check:whitepaper-v1-2-terms-glossary',
  'npm run check:whitepaper-v1-2-public-excerpt-guard',
  'npm run check',
]) {
  assertIncludes(matrix, required, matrixPath);
}

assertIncludes(sourceMap, 'Risk Factors And Launch Gates', sourceMapPath);
assertIncludes(terms, 'Blocked Terms', termsPath);
assertIncludes(excerptGuard, 'Blocked Excerpt Claims', excerptGuardPath);
assertIncludes(publishGate, 'Legal And Financial Gate', publishGatePath);
assertIncludes(approvalRecord, 'Approval Record', approvalRecordPath);
assertIncludes(context, 'whitepaper v1.2 claim review matrix', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-claim-review', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 claim review matrix', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-claim-review', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(matrix)) {
  fail('Claim review matrix must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', claim_review_matrix: matrixPath, claim_boundaries_checked: true }, null, 2));
