import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const wordingPath = resolve('..', 'docs', 'whitepaper-v1-2-public-wording-package.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const packageJsonPath = resolve('package.json');

const referencedDocs = [
  'gcsc-v1-2-core-architecture-package.md',
  'whitepaper-v1-2-restructure-draft.md',
  'whitepaper-v1-2-section-replacement-preview.md',
  'whitepaper-v1-2-claim-review-matrix.md',
  'whitepaper-v1-2-terms-glossary.md',
  'whitepaper-v1-2-public-excerpt-guard.md',
  'whitepaper-v1-2-publish-gate.md',
];

function fail(message) {
  console.error(`Whitepaper v1.2 public wording package validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) {
    fail(`${file} must include: ${snippet}`);
  }
}

const wording = readRequired(wordingPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const packageJson = JSON.parse(readRequired(packageJsonPath));

for (const section of [
  'GCSC Whitepaper v1.2 Public Wording Package',
  'Public Positioning Rule',
  'Executive Summary Wording',
  'Problem Wording',
  'Solution Wording',
  'Contract-Backed Working Capital Wording',
  'Smart Escrow And Settlement Wording',
  'AI Wording',
  'GCSC And GCST Wording',
  'Public Section Order',
  'Exact Safe Sentences',
  'Blocked Public Claims',
  'Review Gates Before Public Use',
  'Required Commands',
  'Safe Default',
]) {
  assertIncludes(wording, section, wordingPath);
}

for (const required of [
  'internal public-wording package',
  'not publication approval',
  'construction trust infrastructure',
  'SmartContractor',
  'project contracts',
  'milestones',
  'evidence',
  'reputation',
  'payment-readiness records',
  'dispute workflows',
  'audit trails',
  'Do not position GCSC as a token sale',
  'live lender',
  'live escrow company',
  'automatic AI finance engine',
  'guaranteed-yield product',
  'regulator-approved financial institution',
  'escrow-ready',
  'credit-ready',
  'settlement-ready',
  'real escrow, lending, stablecoin settlement, repayment routing, and token collateral require attorney review',
  'finance-provider terms',
  'attorney-approved documents',
  'founder approval',
  'technical/security readiness',
  'contract-backed working-capital workflows',
  'a signed project contract is automatically legal collateral',
  'AI approves or denies loans automatically',
  'Early SmartContractor versions can organize project contracts, milestones, payment intents, disputes, and audit records',
  'AI is an assistance layer',
  'not a final authority',
  'GCSC and GCST are planned utility and settlement components',
  'Neither token language should be read as a guarantee of price, liquidity, yield, legal status, or availability',
  'Contract-backed working capital is a proposed readiness workflow, not a live lending product',
  'Escrow-ready records do not mean GCSC currently holds homeowner funds',
  'Stablecoin settlement and tokenized construction agreements remain future regulated roadmap items',
  'Public token language must avoid price promises',
  'real repayment routing is live',
  'Digital Asset Market Clarity Act, SEC, CFTC, bank, government, provider, or attorney approval already covers GCSC',
  'publication go/no-go record',
  'npm run check:whitepaper-v1-2-public-wording-package',
  'npm run check:whitepaper-v1-2-claim-review',
  'npm run check:whitepaper-v1-2-public-excerpt-guard',
  'npm run check:whitepaper-v1-2-publish-gate',
  'npm run check',
]) {
  assertIncludes(wording, required, wordingPath);
}

for (const docPath of referencedDocs) {
  assertIncludes(wording, docPath, wordingPath);
  if (!existsSync(resolve('..', 'docs', docPath))) fail(`Referenced document must exist: ${docPath}`);
}

assertIncludes(context, 'whitepaper v1.2 public wording package', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-public-wording-package', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 public wording package', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-public-wording-package', backlogPath);
assertIncludes(packageJson.scripts?.['check:whitepaper-v1-2-public-wording-package'] || '', 'scripts/validate-whitepaper-v1-2-public-wording-package.mjs', packageJsonPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(wording)) {
  fail('Public wording package must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_wording_package: wordingPath,
  construction_trust_positioning_checked: true,
  blocked_live_finance_claims_checked: true,
  ai_boundary_checked: true,
  token_claim_boundary_checked: true,
}, null, 2));
