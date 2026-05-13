import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const briefPath = resolve('..', 'docs', 'whitepaper-v1-2-founder-approval-brief.md');
const referencedDocs = [
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
  console.error(`Whitepaper v1.2 founder approval brief validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const brief = readRequired(briefPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

for (const section of [
  'GCSC Whitepaper v1.2 Founder Approval Brief',
  'Purpose',
  'Founder Decision Needed',
  'Must Stay Blocked',
  'Review Packet',
  'Approval Record Needed',
  'Required Commands',
  'Safe Default',
]) {
  assertIncludes(brief, section, briefPath);
}

for (const required of [
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
  'real escrow is live',
  'real lending is live',
  'real token collateral is live',
  'token price promise',
  'guaranteed yield',
  'guaranteed contractor credit',
  'AI makes automatic legal or financial decisions',
  'attorney/provider/founder approval is optional',
  'founder approval recorded',
  'technical approval recorded',
  'disabled real-money gates',
  'whitepaper.html',
  'npm run check:whitepaper-v1-2-founder-approval-brief',
  'npm run check:whitepaper-v1-2-public-edit-queue',
  'npm run check:whitepaper-v1-2-claim-review',
  'npm run check',
]) {
  assertIncludes(brief, required, briefPath);
}

for (const docPath of referencedDocs) {
  assertIncludes(brief, docPath, briefPath);
  if (!existsSync(resolve('..', 'docs', docPath))) fail(`Referenced document must exist: ${docPath}`);
}

assertIncludes(context, 'whitepaper v1.2 founder approval brief', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-founder-approval-brief', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 founder approval brief', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-founder-approval-brief', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(brief)) {
  fail('Founder approval brief must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', founder_approval_brief: briefPath, approval_boundary_checked: true }, null, 2));
