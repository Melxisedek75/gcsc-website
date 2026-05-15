import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const planPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-revision-plan.md');
const intakePath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-founder-response-intake.md');
const packetPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-founder-review-packet.md');
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

const plan = readRequired(planPath);
readRequired(intakePath);
readRequired(packetPath);
readRequired(draftPath);
readRequired(reportPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realStatus = readRequired(realStatusPath);

for (const heading of [
  '## Revision Plan Boundary',
  '## Inputs',
  '## Revision Batches',
  '## Draft Change Rules',
  '## Blocked Revision Requests',
  '## Verification Commands',
]) {
  assertIncludes(plan, heading, planPath);
}

for (const snippet of [
  'internal local-only revision plan',
  'does not approve public publication',
  'Every revision remains local and internal',
  'docs/whitepaper-v1-2-public-draft-founder-response-intake.md',
  'docs/whitepaper-v1-2-public-draft-founder-review-packet.md',
  'docs/whitepaper-v1-2-public-draft.md',
  'docs/whitepaper-v1-2-public-draft-review-report.md',
  'docs/whitepaper-v1-2-claim-review-matrix.md',
  'docs/whitepaper-v1-2-publication-go-no-go-checklist.md',
  'WP12-RP-001',
  'HOLD_FOR_PROVIDER_REVIEW',
  'HOLD_FOR_CLAIM_REVIEW',
  'Do not edit public website, PDF, investor packet, grant packet, deck, email, social post, or announcement files from this plan.',
  'real loans are live',
  'token collateral is active',
  'AI makes final legal, financial, lending, insurance, compliance, escrow, payment-release, or admin decisions',
  'npm run check:whitepaper-v1-2-public-draft-revision-plan',
]) {
  assertIncludes(plan, snippet, planPath);
}

if (packageJson.scripts?.['check:whitepaper-v1-2-public-draft-revision-plan'] !== 'node scripts/validate-whitepaper-v1-2-public-draft-revision-plan.mjs') {
  fail(`${packagePath} must define check:whitepaper-v1-2-public-draft-revision-plan`);
}

assertIncludes(runner, '"check:whitepaper-v1-2-public-draft-revision-plan"', runnerPath);
assertIncludes(context, 'Whitepaper v1.2 public draft revision plan', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-public-draft-revision-plan', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 public draft revision plan', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-public-draft-revision-plan', backlogPath);
assertIncludes(realStatus, 'Whitepaper v1.2 public draft revision plan', realStatusPath);

const unsafePattern = /(publication is approved|public launch is approved|loans? (are|is) (live|available|approved|funded|originated|underwritten)|escrow (is|goes) live|repayment routing is live|stablecoin settlement is live|token collateral is active|guaranteed (yield|return|liquidity|income)|legal review is complete|provider review is complete)/i;
const safeContextPattern = /(does not|blocked|before|required|review|hold|no unless|not approved|do not|without|until|trigger|triggers|asks to|must not|say|claim|claims|route to)/i;
const unsafeLines = plan
  .split(/\r?\n/)
  .filter((line) => unsafePattern.test(line))
  .filter((line) => !safeContextPattern.test(line));

if (unsafeLines.length > 0) {
  fail('Revision plan must not contain unqualified public/live/money approval claims', { unsafeLines });
}

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(plan)) {
  fail('Revision plan must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_draft_revision_plan: planPath,
  linked_founder_response_intake: intakePath,
  safety_boundaries_checked: true,
}, null, 2));
