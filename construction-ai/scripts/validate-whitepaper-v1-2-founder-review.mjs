import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const reviewPath = resolve('..', 'docs', 'whitepaper-v1-2-founder-review-checklist.md');
const draftPath = resolve('..', 'docs', 'whitepaper-v1-2-restructure-draft.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Whitepaper v1.2 founder review validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const review = readRequired(reviewPath);
const draft = readRequired(draftPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

for (const section of [
  'GCSC Whitepaper v1.2 Founder Review Checklist',
  'Review Goal',
  'Recommended Reading Order',
  'Decision 1: Project Structure',
  'Decision 2: First Product Positioning',
  'Decision 3: Contractor Credit Placement',
  'Decision 4: Token Economics Placement',
  'Decision 5: Real Estate DAO Placement',
  'Decision 6: CLARITY And Compliance Language',
  'Decision 7: Publish Path',
  'Founder Notes Template',
  'Blocked Until Founder Approval',
]) {
  assertIncludes(review, section, reviewPath);
}

for (const required of [
  'founder review only',
  'do not edit `whitepaper.html` yet',
  '3-part structure',
  '2-part structure',
  'SmartContractor Marketplace',
  'Construction Contract Marketplace',
  'Smart Construction Operating Layer',
  'property owners',
  'contractors',
  'contractor credit',
  'GCSC/GCST token economics',
  'Real Estate DAO',
  'Digital Asset Market Clarity Act',
  'compliance-ready',
  'no legal conclusion',
  'no real escrow',
  'no real lending',
  'no real token collateral',
  'no token price promise',
  'attorney/provider/founder approval',
  'approve',
  'revise',
  'block',
]) {
  assertIncludes(review, required, reviewPath);
}

assertIncludes(draft, 'Founder Review Questions', draftPath);
assertIncludes(draft, 'Recommended Next Step', draftPath);
assertIncludes(context, 'whitepaper v1.2 founder review checklist', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-founder-review', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 founder review checklist', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-founder-review', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(review)) {
  fail('Founder review checklist must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', checklist: reviewPath, safety_boundaries_checked: true }, null, 2));
