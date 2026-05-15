import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const packetPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-revision-worker-packet.md');
const draftPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft.md');
const reportPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-review-report.md');
const founderPacketPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-founder-review-packet.md');
const intakePath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-founder-response-intake.md');
const planPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-revision-plan.md');
const checklistPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-revision-checklist.md');
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

const packet = readRequired(packetPath);
readRequired(draftPath);
readRequired(reportPath);
readRequired(founderPacketPath);
readRequired(intakePath);
readRequired(planPath);
readRequired(checklistPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realStatus = readRequired(realStatusPath);

for (const heading of [
  '## Worker Packet Boundary',
  '## Source Files',
  '## Parallel Worker Assignments',
  '## Worker Output Format',
  '## Integration Rules',
  '## Verification Commands',
]) {
  assertIncludes(packet, heading, packetPath);
}

for (const snippet of [
  'internal local-only worker packet',
  'does not approve public publication',
  'Workers must not publish, deploy, contact providers, edit public surfaces, touch live systems, move money, sign XPR transactions, or make legal/finance/provider commitments.',
  'docs/whitepaper-v1-2-public-draft.md',
  'docs/whitepaper-v1-2-public-draft-review-report.md',
  'docs/whitepaper-v1-2-public-draft-founder-response-intake.md',
  'docs/whitepaper-v1-2-public-draft-revision-plan.md',
  'docs/whitepaper-v1-2-public-draft-revision-checklist.md',
  'Kimi-A',
  'Kimi-B',
  'Kimi-C',
  'Kimi-D',
  'Kimi-E',
  'Claude',
  'Codex',
  'PASS / REVISE / HOLD',
  'Any loan, escrow, repayment routing, stablecoin, token collateral, AI final authority, legal/provider, security, public launch, deployment, external account, or money movement request is marked `HOLD`.',
  'npm run check:whitepaper-v1-2-public-draft-revision-worker-packet',
]) {
  assertIncludes(packet, snippet, packetPath);
}

if (packageJson.scripts?.['check:whitepaper-v1-2-public-draft-revision-worker-packet'] !== 'node scripts/validate-whitepaper-v1-2-public-draft-revision-worker-packet.mjs') {
  fail(`${packagePath} must define check:whitepaper-v1-2-public-draft-revision-worker-packet`);
}

assertIncludes(runner, '"check:whitepaper-v1-2-public-draft-revision-worker-packet"', runnerPath);
assertIncludes(context, 'Whitepaper v1.2 public draft revision worker packet', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-public-draft-revision-worker-packet', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 public draft revision worker packet', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-public-draft-revision-worker-packet', backlogPath);
assertIncludes(realStatus, 'Whitepaper v1.2 public draft revision worker packet', realStatusPath);

const unsafePattern = /(publication is approved|public launch is approved|loans? (are|is) (live|available|approved|funded|originated|underwritten)|escrow (is|goes) live|repayment routing is live|stablecoin settlement is live|token collateral is active|guaranteed (yield|return|liquidity|income)|legal review is complete|provider review is complete)/i;
const safeContextPattern = /(does not|blocked|before|required|review|hold|no unless|not approved|do not|without|until|trigger|triggers|asks to|must not|say|claim|claims|marked|against|must not do)/i;
const unsafeLines = packet
  .split(/\r?\n/)
  .filter((line) => unsafePattern.test(line))
  .filter((line) => !safeContextPattern.test(line));

if (unsafeLines.length > 0) {
  fail('Worker packet must not contain unqualified public/live/money approval claims', { unsafeLines });
}

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(packet)) {
  fail('Worker packet must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_draft_revision_worker_packet: packetPath,
  linked_revision_checklist: checklistPath,
  safety_boundaries_checked: true,
}, null, 2));
