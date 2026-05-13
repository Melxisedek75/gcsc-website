import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const draftPath = resolve('..', 'docs', 'whitepaper-v1-2-restructure-draft.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Whitepaper v1.2 restructure validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const draft = readRequired(draftPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

for (const section of [
  'GCSC Whitepaper v1.2 Restructure Draft',
  'Purpose',
  'Source Inputs',
  'Recommended 3-Part Project Structure',
  'Part 1: SmartContractor Marketplace And Project Contract Layer',
  'Part 2: Reputation, AI Verification, And Compliance Layer',
  'Part 3: Regulated Settlement, Tokenized Agreements, DAO, And Real-World Asset Expansion',
  'Whitepaper v1.2 Proposed Table Of Contents',
  'Key Language Changes',
  'Compliance-Ready CLARITY Act Framing',
  'Phase Roadmap For Whitepaper',
  'Founder Review Questions',
  'Recommended Next Step',
]) {
  assertIncludes(draft, section, draftPath);
}

for (const required of [
  'founder review draft',
  'regulated construction-financial infrastructure network',
  'SmartContractor is the first product',
  'property owner',
  'contractor',
  'digital project contract',
  'milestones',
  'escrow-ready',
  'working capital',
  'disputes',
  'evidence',
  'audit ledger',
  'Contractor Reputation Layer',
  'Stablecoin Settlement Engine',
  'AI plus Smart Contracts',
  'Tokenized Construction Agreements',
  'Construction Operating System',
  'Digital Asset Market Clarity Act',
  'compliance-ready',
  'AML',
  'custody',
  'disclosures',
  'attorney-approved',
  'legal review',
  'provider setup',
  'founder approval',
  'no real escrow',
  'no real lending',
  'no real token collateral',
  'does not guarantee market value',
  'does not rely on unsettled legislation',
  'Do not edit `whitepaper.html` yet',
]) {
  assertIncludes(draft, required, draftPath);
}

assertIncludes(context, 'whitepaper v1.2 restructure draft', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-restructure', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 restructure draft', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-restructure', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(draft)) {
  fail('Whitepaper v1.2 restructure draft must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', draft: draftPath, safety_boundaries_checked: true }, null, 2));
