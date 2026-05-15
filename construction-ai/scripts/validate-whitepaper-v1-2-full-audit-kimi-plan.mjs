import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const planPath = resolve('..', 'docs', 'whitepaper-v1-2-full-audit-kimi-execution-plan-2026-05-15.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realStatusPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message, details = {}) {
  console.error(JSON.stringify({ status: 'failed', message, ...details }, null, 2));
  process.exit(1);
}

function assertIncludes(content, snippet, label) {
  if (!content.includes(snippet)) {
    fail(`${label} missing required snippet`, { snippet });
  }
}

if (!existsSync(planPath)) fail('Missing whitepaper v1.2 full audit Kimi execution plan', { planPath });

const plan = readFileSync(planPath, 'utf8');
const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
const runner = readFileSync(runnerPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const realStatus = readFileSync(realStatusPath, 'utf8');

const requiredSnippets = [
  'Whitepaper v1.2 Full Audit And Kimi Execution Plan',
  'internal local-only execution plan',
  'docs/gcsc-v1-2-core-architecture-package.md',
  'docs/whitepaper-v1-2-public-wording-package.md',
  'docs/whitepaper-v1-2-claim-review-matrix.md',
  'docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md',
  'docs/whitepaper-v1-2-smart-contract-module-split-anti-backdoor-review.md',
  'docs/whitepaper-v1-2-public-draft.md',
  'docs/whitepaper-v1-2-public-draft-review-report.md',
  'construction-ai/scripts/validate-whitepaper-v1-2-public-draft.mjs',
  'This draft is not approved for public publication.',
  'Real loans, escrow, repayment routing, stablecoin settlement, token collateral',
  'Kimi Worker Split For Whitepaper',
  'Claude Audit Assignment',
  'Codex Integration Assignment',
  'Hard Stop Boundaries',
  'PASS_LOCAL_ONLY',
  'BLOCKED_EXTERNAL_REVIEW',
  'FAIL_UNSAFE',
  'npm run check:whitepaper-v1-2-public-wording-package',
  'npm run check:whitepaper-v1-2-claim-review',
  'npm run check:whitepaper-v1-2-publication-go-no-go',
];

for (const snippet of requiredSnippets) {
  assertIncludes(plan, snippet, planPath);
}

const requiredSourceFiles = [
  'docs/gcsc-v1-2-core-architecture-package.md',
  'docs/whitepaper-v1-2-restructure-draft.md',
  'docs/whitepaper-v1-2-source-map.md',
  'docs/whitepaper-v1-2-public-wording-package.md',
  'docs/whitepaper-v1-2-section-replacement-preview.md',
  'docs/whitepaper-v1-2-claim-review-matrix.md',
  'docs/whitepaper-v1-2-terms-glossary.md',
  'docs/whitepaper-v1-2-public-excerpt-guard.md',
  'docs/whitepaper-v1-2-public-edit-queue.md',
  'docs/whitepaper-v1-2-public-website-update-packet.md',
  'docs/whitepaper-v1-2-publish-gate.md',
  'docs/whitepaper-v1-2-publication-go-no-go-checklist.md',
  'docs/whitepaper-v1-2-smart-contract-architecture-draft.md',
  'docs/whitepaper-v1-2-smart-contract-module-split-anti-backdoor-review.md',
  'docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md',
  'docs/whitepaper-v1-2-legal-provider-review-prep.md',
  'docs/gcsc-kimi-stream-a-whitepaper-v1-2-public-draft-work-order.md',
];

const missingSourceFiles = requiredSourceFiles.filter((relativePath) => !existsSync(resolve('..', relativePath)));
if (missingSourceFiles.length > 0) {
  fail('Whitepaper full audit plan references missing source files', { missingSourceFiles });
}

if (packageJson.scripts?.['check:whitepaper-v1-2-full-audit-kimi-plan'] !== 'node scripts/validate-whitepaper-v1-2-full-audit-kimi-plan.mjs') {
  fail(`${packagePath} must define check:whitepaper-v1-2-full-audit-kimi-plan`);
}

assertIncludes(runner, '"check:whitepaper-v1-2-full-audit-kimi-plan"', runnerPath);
assertIncludes(context, 'Whitepaper v1.2 full audit Kimi execution plan', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-full-audit-kimi-plan', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 full audit Kimi execution plan', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-full-audit-kimi-plan', backlogPath);
assertIncludes(realStatus, 'Whitepaper v1.2 full audit Kimi execution plan', realStatusPath);

const forbiddenApprovalPattern = /(public launch is approved|real loans are active|escrow is live|token collateral is active|guaranteed yield|guaranteed return)/i;
const unsafeClaimLines = plan
  .split(/\r?\n/)
  .filter((line) => forbiddenApprovalPattern.test(line))
  .filter((line) => !/(avoid|claims|promises|blocked|forbidden|must not|do not|stop)/i.test(line));
if (unsafeClaimLines.length > 0) {
  fail('Plan must not contain public/live/money approval claims', { unsafeClaimLines });
}

console.log(JSON.stringify({
  status: 'passed',
  plan: planPath,
  source_files_checked: requiredSourceFiles.length,
  required_snippets_checked: requiredSnippets.length,
  safety_boundaries_checked: true,
}, null, 2));
