import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

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

const intake = readRequired(intakePath);
readRequired(packetPath);
readRequired(draftPath);
readRequired(reportPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realStatus = readRequired(realStatusPath);

for (const heading of [
  '## Intake Boundary',
  '## Source Files',
  '## Founder Response Slots',
  '## Revision Queue',
  '## Founder Response Triage Ladder',
  '## Automatic Hold Triggers',
  '## Safe Codex Handling',
  '## Verification Commands',
]) {
  assertIncludes(intake, heading, intakePath);
}

for (const snippet of [
  'internal non-secret intake template',
  'does not approve public publication',
  'Do not paste secrets',
  'Public use remains blocked',
  'docs/whitepaper-v1-2-public-draft.md',
  'docs/whitepaper-v1-2-public-draft-review-report.md',
  'docs/whitepaper-v1-2-public-draft-founder-review-packet.md',
  'ACCEPT / REVISE / HOLD',
  'WP12-FR-001',
  'ACCEPT -> prepare internal revision closeout only',
  'REVISE -> route notes into local revision queue',
  'HOLD -> keep public publication blocked',
  'LEGAL_PROVIDER_REVIEW -> do not publish or implement live finance claims',
  'PUBLICATION_GO_NO_GO -> separate later approval only',
  'No response path approves public publication, website edits, deployment, external accounts, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, provider commitments, legal decisions, XPR signatures, app-store actions, secrets handling, or destructive actions.',
  'Automatic Hold Triggers',
  'real loans are live',
  'token collateral is active',
  'AI makes final legal, financial, lending, insurance, compliance, escrow, payment-release, or admin decisions',
  'Codex must not publish, deploy, send, submit, announce, change public files, touch live systems, make legal/provider/finance commitments, or move money based on this intake.',
  'npm run check:whitepaper-v1-2-public-draft-founder-response-intake',
]) {
  assertIncludes(intake, snippet, intakePath);
}

if (packageJson.scripts?.['check:whitepaper-v1-2-public-draft-founder-response-intake'] !== 'node scripts/validate-whitepaper-v1-2-public-draft-founder-response-intake.mjs') {
  fail(`${packagePath} must define check:whitepaper-v1-2-public-draft-founder-response-intake`);
}

assertIncludes(runner, '"check:whitepaper-v1-2-public-draft-founder-response-intake"', runnerPath);
assertIncludes(context, 'Whitepaper v1.2 public draft founder response intake', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-public-draft-founder-response-intake', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 public draft founder response intake', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-public-draft-founder-response-intake', backlogPath);
assertIncludes(realStatus, 'Whitepaper v1.2 public draft founder response intake', realStatusPath);

const unsafePattern = /(publication is approved|public launch is approved|loans? (are|is) (live|available|approved|funded|originated|underwritten)|escrow (is|goes) live|repayment routing is live|stablecoin settlement is live|token collateral is active|guaranteed (yield|return|liquidity|income)|legal review is complete|provider review is complete)/i;
const safeContextPattern = /(does not|blocked|before|required|review|hold|no unless|not approved|do not|without|until|trigger|triggers|asks to|must not|say|claim|claims)/i;
const unsafeLines = intake
  .split(/\r?\n/)
  .filter((line) => unsafePattern.test(line))
  .filter((line) => !safeContextPattern.test(line));

if (unsafeLines.length > 0) {
  fail('Founder response intake must not contain unqualified public/live/money approval claims', { unsafeLines });
}

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(intake)) {
  fail('Founder response intake must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  founder_response_intake: intakePath,
  linked_founder_review_packet: packetPath,
  safety_boundaries_checked: true,
}, null, 2));
