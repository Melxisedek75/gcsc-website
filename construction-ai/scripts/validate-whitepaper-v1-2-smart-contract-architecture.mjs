import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const draftPath = resolve('..', 'docs', 'whitepaper-v1-2-smart-contract-architecture-draft.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Whitepaper v1.2 smart contract architecture validation failed: ${message}`);
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

const draft = readRequired(draftPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'GCSC Whitepaper v1.2 Smart Contract Architecture Draft',
  'Purpose',
  'Whitepaper Structure Impact',
  'Smart Contract Module Map',
  'Serious Evening Implementation Path',
  'CLARITY-Aware Positioning',
  'Founder Review Questions',
  'Blocked Claims',
  'Required Checks Before Public Use',
]) {
  assertIncludes(draft, section, draftPath);
}

for (const required of [
  'internal founder-review draft only',
  'not legal advice',
  'not approval to launch real escrow',
  'not approval to launch real lending',
  'not approval to launch real stablecoin settlement',
  'not approval to launch real token collateral',
  'not approval to launch real payments',
  'SmartContractor construction platform',
  'trust infrastructure',
  'settlement and network layer',
  'should not be introduced as a coin, token, crypto app',
  'Part 1: SmartContractor Platform',
  'Part 2: Trust Infrastructure',
  'Part 3: Settlement And Tokenized Construction Network',
  'Project Contract Registry',
  'Milestone Contract Engine',
  'Escrow-Ready Payment State Machine',
  'AI-Assisted Verification Oracle',
  'Human Review And Dispute Override',
  'Contractor Reputation Ledger',
  'Stablecoin Settlement Router',
  'Contract-Backed Loan Eligibility Layer',
  'Tokenized Construction Agreement Layer',
  'Compliance And Audit Registry',
  'GCSC/GCST Utility And Governance Hooks',
  'Whitepaper architecture rewrite package',
  'Contract-backed loan package',
  'Smart contract module split package',
  'escrow and milestones',
  'contract-backed loan and repayment routing',
  'reputation, audit, and dispute controls',
  'move blockchain, tokenization, GCSC, GCST, DAO, stablecoin settlement, RWA, and smart contract language into the second or third layer',
  'directly improves investor/founder narrative, product architecture, and future smart contract implementation boundaries',
  'escrow-ready, payment coordination, and settlement-ready wording',
  'contract-backed working-capital eligibility',
  'receivables-based underwriting',
  'signed-project-contract credit support',
  'route an agreed repayment amount first',
  'signed contract is not automatically legal collateral',
  'AI is not the final judge',
  'human override',
  'disputes should pause release eligibility',
  'tokenized construction agreement is a programmable workflow representation',
  'does not replace the signed legal contract on day one',
  'compliance-ready does not mean legally approved',
  'Digital Asset Market Clarity Act creates legal approval for GCSC',
  'no investment-return promises',
  'real escrow is live',
  'real lending is live',
  'real token collateral is live',
  'stablecoin settlement is live',
  'signed project contracts are legally accepted loan collateral today',
  'contract-backed loans are live',
  'milestone repayments are legally enforceable without lender/provider/legal approval',
  'contractor credit is guaranteed',
  'token price is promised',
  'yield is guaranteed',
  'AI makes automatic legal or financial decisions',
  'smart contracts replace legal contracts today',
  'attorney/provider/founder approval is optional',
  'npm run check:whitepaper-v1-2-smart-contract-architecture',
  'npm run check:whitepaper-v1-2-claim-review',
  'npm run check:whitepaper-v1-2-terms-glossary',
  'npm run check:whitepaper-v1-2-public-edit-queue',
  'npm run check:whitepaper-v1-2-publication-go-no-go',
  'npm run check',
]) {
  assertIncludes(draft, required, draftPath);
}

assertIncludes(context, 'Whitepaper v1.2 smart contract architecture draft', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-smart-contract-architecture', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 smart contract architecture draft', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-smart-contract-architecture', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 smart contract architecture draft', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(draft)) {
  fail('Smart contract architecture draft must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_architecture_draft: draftPath,
  public_file_change_block_checked: true,
}, null, 2));
