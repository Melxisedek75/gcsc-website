import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const draftPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft.md');
const reportPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-review-report.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realStatusPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message, details = {}) {
  console.error(JSON.stringify({ status: 'failed', message, ...details }, null, 2));
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail('Missing required file', { path });
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, label) {
  if (!content.includes(snippet)) fail(`${label} missing required snippet`, { snippet });
}

const draft = readRequired(draftPath);
const report = readRequired(reportPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realStatus = readRequired(realStatusPath);

const requiredHeadings = [
  '## Publication Status And Review Boundary',
  '## Executive Summary',
  '## Construction Trust Problem',
  '## SmartContractor Product Layer',
  '## Verified Contractor And Homeowner Workflow',
  '## Contract-Backed Working Capital Roadmap',
  '## Escrow-Ready Milestone Architecture',
  '## Smart Contract Module Architecture',
  '## AI Agent Roles And Human Review Boundaries',
  '## GCSC / GCST / XPR Utility Roadmap',
  '## Security, Audit Trail, And Anti-Backdoor Controls',
  '## Public Beta And Deployment Readiness',
  '## Legal, Provider, And Finance Review Gates',
  '## Roadmap',
  '## Source And Review Appendix',
];

let previousIndex = -1;
for (const heading of requiredHeadings) {
  const index = draft.indexOf(heading);
  if (index === -1) fail('Draft missing required heading', { heading });
  if (index <= previousIndex) fail('Draft headings are out of order', { heading });
  previousIndex = index;
}

const requiredDraftSnippets = [
  'This draft is not approved for public publication.',
  'Real loans, escrow, repayment routing, stablecoin settlement, token collateral, provider integrations, and public launch require founder approval plus legal/provider, finance-provider, technical/security, and publication go/no-go review before activation.',
  '## Excerpt Reuse Boundary',
  'Do not quote or reuse isolated sentences from this draft as public marketing, investor, grant, partner, legal/provider, social, email, website, or announcement copy unless the excerpt carries its review-required context.',
  'Any excerpt that mentions working capital, escrow, repayments, stablecoins, token utility, AI review, smart contracts, public beta, or deployment must keep the same no-live-finance, no-legal-advice, no-investment-promise, and founder/legal/provider review boundaries.',
  'construction trust infrastructure',
  'SmartContractor',
  'demo-only',
  'request IDs',
  'working-capital readiness',
  'escrow-ready records',
  'no hidden owner drain',
  'no hidden upgrade path',
  'no arbitrary balance mutation',
  'no AI-only final approval',
  'AI agents in GCSC are an assistance layer',
  'does not guarantee token price',
  'Founder review: required before public use.',
  'Legal/provider review: required before public or live finance/escrow/provider claims.',
];

for (const snippet of requiredDraftSnippets) {
  assertIncludes(draft, snippet, draftPath);
}

const requiredSourceReferences = [
  'docs/gcsc-v1-2-core-architecture-package.md',
  'docs/whitepaper-v1-2-restructure-draft.md',
  'docs/whitepaper-v1-2-source-map.md',
  'docs/whitepaper-v1-2-public-wording-package.md',
  'docs/whitepaper-v1-2-claim-review-matrix.md',
  'docs/whitepaper-v1-2-smart-contract-module-split-anti-backdoor-review.md',
  'docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md',
  'docs/whitepaper-v1-2-legal-provider-review-prep.md',
  'docs/whitepaper-v1-2-full-audit-kimi-execution-plan-2026-05-15.md',
];

for (const reference of requiredSourceReferences) {
  assertIncludes(draft, reference, draftPath);
  assertIncludes(report, reference, reportPath);
}

for (const snippet of [
  'Verdict: PASS_LOCAL_ONLY.',
  'Files Created',
  'Source Files Read',
  'Claim-Risk Review',
  'Remaining Blockers',
  'npm run check:whitepaper-v1-2-public-draft',
]) {
  assertIncludes(report, snippet, reportPath);
}

if (packageJson.scripts?.['check:whitepaper-v1-2-public-draft'] !== 'node scripts/validate-whitepaper-v1-2-public-draft.mjs') {
  fail(`${packagePath} must define check:whitepaper-v1-2-public-draft`);
}

assertIncludes(runner, '"check:whitepaper-v1-2-public-draft"', runnerPath);
assertIncludes(context, 'Whitepaper v1.2 public draft', contextPath);
assertIncludes(context, 'Whitepaper v1.2 public draft excerpt reuse boundary', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-public-draft', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 public draft', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 public draft excerpt reuse boundary', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-public-draft', backlogPath);
assertIncludes(realStatus, 'Whitepaper v1.2 public draft', realStatusPath);
assertIncludes(realStatus, 'Whitepaper v1.2 public draft excerpt reuse boundary', realStatusPath);

const unsafePattern = /(loans? (are|is) (live|available|approved|funded|originated|underwritten)|escrow (is|goes) live|funds are held|repayment routing is live|stablecoin settlement is live|token collateral is active|guaranteed (yield|return|liquidity|income)|token price will|AI (approves|denies|decides) (loans|escrow|legal|financial|compliance)|legal review is complete|provider review is complete)/i;
const safeContextPattern = /(not|does not|do not|before|require|requires|required|blocked|blockers|avoid|without|until|future|roadmap|proposed|review|review-required|demo-only|no-real-money|remaining)/i;

const unsafeLines = `${draft}\n${report}`
  .split(/\r?\n/)
  .filter((line) => unsafePattern.test(line))
  .filter((line) => !safeContextPattern.test(line));

if (unsafeLines.length > 0) {
  fail('Public draft must not contain unqualified live/legal/money approval claims', { unsafeLines });
}

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(`${draft}\n${report}`)) {
  fail('Public draft package must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  draft: draftPath,
  review_report: reportPath,
  headings_checked: requiredHeadings.length,
  source_references_checked: requiredSourceReferences.length,
  safety_boundaries_checked: true,
}, null, 2));
