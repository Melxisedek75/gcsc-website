import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const planPath = resolve('..', 'docs', 'whitepaper-v1-2-edit-plan.md');
const draftPath = resolve('..', 'docs', 'whitepaper-v1-2-restructure-draft.md');
const reviewPath = resolve('..', 'docs', 'whitepaper-v1-2-founder-review-checklist.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Whitepaper v1.2 edit plan validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const plan = readRequired(planPath);
const draft = readRequired(draftPath);
const review = readRequired(reviewPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

for (const section of [
  'GCSC Whitepaper v1.2 Edit Plan',
  'Scope',
  'Inputs',
  'Do Not Edit Yet',
  'Pass 1: Structure',
  'Pass 2: Product Narrative',
  'Pass 3: Trust And Compliance',
  'Pass 4: Token And Settlement Language',
  'Pass 5: Risk Factors And Gates',
  'Verification Plan',
  'Founder Approval Required',
]) {
  assertIncludes(plan, section, planPath);
}

for (const required of [
  'founder approval required',
  'do not edit `whitepaper.html` yet',
  'whitepaper-v1-2-restructure-draft.md',
  'whitepaper-v1-2-founder-review-checklist.md',
  'SmartContractor Marketplace',
  'project contracts',
  'milestones',
  'escrow-ready',
  'contractor credit',
  'Contractor Reputation Layer',
  'AI boundaries',
  'Digital Asset Market Clarity Act',
  'compliance-ready',
  'GCSC/GCST token economics',
  'stablecoin settlement',
  'Real Estate DAO',
  'no real escrow',
  'no real lending',
  'no real token collateral',
  'no token price promise',
  'attorney/provider/founder approval',
  'npm run check:whitepaper-v1-2-restructure',
  'npm run check:whitepaper-v1-2-founder-review',
  'npm run check',
]) {
  assertIncludes(plan, required, planPath);
}

assertIncludes(draft, 'Whitepaper v1.2 Proposed Table Of Contents', draftPath);
assertIncludes(review, 'Decision 7: Publish Path', reviewPath);
assertIncludes(context, 'whitepaper v1.2 edit plan', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-edit-plan', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 edit plan', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-edit-plan', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(plan)) {
  fail('Whitepaper edit plan must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', plan: planPath, safety_boundaries_checked: true }, null, 2));
