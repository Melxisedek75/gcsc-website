import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const checklistPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-revision-checklist.md');
const planPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-revision-plan.md');
const intakePath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-founder-response-intake.md');
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

const checklist = readRequired(checklistPath);
readRequired(planPath);
readRequired(intakePath);
readRequired(draftPath);
readRequired(reportPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realStatus = readRequired(realStatusPath);

for (const heading of [
  '## Checklist Boundary',
  '## Required Inputs',
  '## Execution Checklist',
  '## Automatic Stop Conditions',
  '## Required Verification',
]) {
  assertIncludes(checklist, heading, checklistPath);
}

for (const snippet of [
  'internal local-only checklist',
  'does not approve public publication',
  'Every checked item remains internal and local',
  'WP12-RP-*',
  'No public file edited',
  'No unrelated files staged',
  'HOLD_FOR_REVIEW',
  'real loans are live',
  'token collateral is active',
  'AI makes final legal, financial, lending, insurance, compliance, escrow, payment-release, or admin decisions',
  'npm run check:whitepaper-v1-2-public-draft-revision-checklist',
  'npm run check:whitepaper-v1-2-public-draft-revision-plan',
  'npm run check:whitepaper-v1-2-public-draft-founder-response-intake',
  'npm run check:whitepaper-v1-2-public-draft',
]) {
  assertIncludes(checklist, snippet, checklistPath);
}

if (packageJson.scripts?.['check:whitepaper-v1-2-public-draft-revision-checklist'] !== 'node scripts/validate-whitepaper-v1-2-public-draft-revision-checklist.mjs') {
  fail(`${packagePath} must define check:whitepaper-v1-2-public-draft-revision-checklist`);
}

assertIncludes(runner, '"check:whitepaper-v1-2-public-draft-revision-checklist"', runnerPath);
assertIncludes(context, 'Whitepaper v1.2 public draft revision checklist', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-public-draft-revision-checklist', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 public draft revision checklist', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-public-draft-revision-checklist', backlogPath);
assertIncludes(realStatus, 'Whitepaper v1.2 public draft revision checklist', realStatusPath);

const unsafePattern = /(publication is approved|public launch is approved|loans? (are|is) (live|available|approved|funded|originated|underwritten)|escrow (is|goes) live|repayment routing is live|stablecoin settlement is live|token collateral is active|guaranteed (yield|return|liquidity|income)|legal review is complete|provider review is complete)/i;
const safeContextPattern = /(does not|blocked|before|required|review|hold|no unless|not approved|do not|without|until|trigger|triggers|asks to|must not|say|claim|claims|stop|route to)/i;
const unsafeLines = checklist
  .split(/\r?\n/)
  .filter((line) => unsafePattern.test(line))
  .filter((line) => !safeContextPattern.test(line));

if (unsafeLines.length > 0) {
  fail('Revision checklist must not contain unqualified public/live/money approval claims', { unsafeLines });
}

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(checklist)) {
  fail('Revision checklist must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_draft_revision_checklist: checklistPath,
  linked_revision_plan: planPath,
  safety_boundaries_checked: true,
}, null, 2));
