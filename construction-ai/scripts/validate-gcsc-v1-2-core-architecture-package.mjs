import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const packageDocPath = resolve('..', 'docs', 'gcsc-v1-2-core-architecture-package.md');
const blueprintPath = resolve('..', 'docs', 'gcsc-contract-backed-loan-blueprint.md');
const smartContractDraftPath = resolve('..', 'docs', 'whitepaper-v1-2-smart-contract-architecture-draft.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packageJsonPath = resolve('package.json');

function fail(message) {
  console.error(`GCSC v1.2 core architecture package validation failed: ${message}`);
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

const packageDoc = readRequired(packageDocPath);
const blueprint = readRequired(blueprintPath);
const smartContractDraft = readRequired(smartContractDraftPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = JSON.parse(readRequired(packageJsonPath));

for (const section of [
  'GCSC v1.2 Core Architecture Package',
  'Purpose',
  'Product Positioning Rule',
  'Core Architecture Thesis',
  'Contract-Backed Loan Flow',
  'Smart Contract Module Split',
  'AI And Human Control Boundary',
  'Whitepaper v1.2 Placement Map',
  'Legal And Provider Review Packet Outline',
  'Security And Anti-Backdoor Principles',
  'Blocked Claims',
  'Founder Decision Record',
  'Immediate Implementation Path',
  'Required Checks Before Public Use',
]) {
  assertIncludes(packageDoc, section, packageDocPath);
}

for (const required of [
  'internal founder-review architecture package only',
  'founder-approved internal source-of-truth architecture package',
  'FOUNDER_APPROVED_INTERNAL_SOURCE_OF_TRUTH',
  'Founder explicitly approved point 1',
  'not approval to launch real loans',
  'not legal advice',
  'not approval to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch real repayment routing',
  'not approval to launch real stablecoin settlement',
  'not approval to launch real token collateral',
  'construction trust infrastructure first',
  'SmartContractor Platform',
  'Construction Trust Infrastructure',
  'Settlement And Tokenized Construction Network',
  'not token speculation',
  'expected milestone receivables',
  'must not be described as automatic legal collateral today',
  'contract-backed working-capital eligibility',
  'receivables-based underwriting',
  'signed-project-contract credit support',
  'repayment-first milestone waterfall',
  'milestone_gross - approved_platform_fees - agreed_loan_repayment = contractor_net_payout',
  'no loan approval without provider/legal/founder gates',
  'no repayment routing while disputed',
  'no release before milestone approval',
  'no repayment above outstanding balance',
  'no negative contractor payout',
  'no AI-only approval',
  'no hidden admin drain',
  'Authority And Role Module',
  'Project Contract Registry',
  'Milestone And Escrow-Ready State Machine',
  'Contract-Backed Loan Ledger',
  'Repayment Waterfall Router',
  'Collateral And Risk Module',
  'Reputation And Review Ledger',
  'Dispute And Human Override Module',
  'Audit And Compliance Registry',
  'AI can recommend',
  'AI cannot',
  'approve loans',
  'release payments',
  'route repayments',
  'decide disputes',
  'Executive Summary',
  'Problem',
  'Solution',
  'Smart Contract Architecture',
  'Token And Settlement Layer',
  'Legal And Provider Boundaries',
  'What is explicitly disabled',
  'lending/licensing',
  'escrow/payment handling',
  'UCC/security interest treatment',
  'least-privilege roles',
  'no owner-only drain',
  'no hidden upgrade path',
  'no arbitrary balance mutation',
  'no arbitrary oracle trust',
  'no dispute-to-release bypass',
  'GCSC is a live lender',
  'signed project contracts are legal collateral today',
  'CLARITY Act, SEC, CFTC, bank, government, or regulator approval already covers GCSC',
  'evening focus shifts away from repetitive micro-validator work',
  'prioritize Contract-Backed Loan and v1.2 Core Architecture',
  'Keep `docs/gcsc-contract-backed-loan-blueprint.md` as the detailed contract-backed loan model',
  'Keep `docs/whitepaper-v1-2-smart-contract-architecture-draft.md` as the detailed smart contract narrative',
  'npm run check:gcsc-v1-2-core-architecture-package',
  'npm run check:contract-backed-loan-blueprint',
  'npm run check:whitepaper-v1-2-smart-contract-architecture',
  'npm run check:whitepaper-v1-2-contract-backed-loan-flow',
  'npm run check:legal-review',
]) {
  assertIncludes(packageDoc, required, packageDocPath);
}

for (const [content, file] of [
  [blueprint, blueprintPath],
  [smartContractDraft, smartContractDraftPath],
]) {
  assertIncludes(content, 'contract-backed working-capital', file);
  assertIncludes(content, 'repayment-first', file);
  assertIncludes(content, 'not legal advice', file);
}

for (const [content, file] of [
  [context, contextPath],
  [backlog, backlogPath],
  [audit, auditPath],
]) {
  assertIncludes(content, 'GCSC v1.2 Core Architecture Package', file);
  assertIncludes(content, 'check:gcsc-v1-2-core-architecture-package', file);
  assertIncludes(content, 'FOUNDER_APPROVED_INTERNAL_SOURCE_OF_TRUTH', file);
}

if (!packageJson.scripts?.['check:gcsc-v1-2-core-architecture-package']) {
  fail('package.json must expose check:gcsc-v1-2-core-architecture-package');
}

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(packageDoc)) {
  fail('Core architecture package must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  gcsc_v1_2_core_architecture_package: packageDocPath,
  product_first_positioning_checked: true,
  contract_backed_loan_flow_checked: true,
  anti_backdoor_boundaries_checked: true,
  live_money_block_checked: true,
}, null, 2));
