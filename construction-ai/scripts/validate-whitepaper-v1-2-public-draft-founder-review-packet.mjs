import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

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

const packet = readRequired(packetPath);
readRequired(draftPath);
readRequired(reportPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realStatus = readRequired(realStatusPath);

for (const heading of [
  '## Founder Review Boundary',
  '## Files To Open',
  '## Founder Tonight 10-Minute Review Path',
  '## Fast Founder Decision Table',
  '## Accept / Revise / Hold Checklist',
  '## Required External Reviews Before Public Use',
  '## Safe Next Actions',
  '## Report-Back Format',
  '## Verification Commands',
]) {
  assertIncludes(packet, heading, packetPath);
}

for (const snippet of [
  'internal founder-review packet',
  'does not approve public publication',
  'docs/whitepaper-v1-2-public-draft.md',
  'docs/whitepaper-v1-2-public-draft-review-report.md',
  'docs/whitepaper-v1-2-public-wording-package.md',
  'docs/whitepaper-v1-2-claim-review-matrix.md',
  'docs/whitepaper-v1-2-publication-go-no-go-checklist.md',
  '10-minute review path',
  'Minute 0-2: open the draft and confirm the title, product-first positioning, and no-publication banner.',
  'Minute 2-5: scan SmartContractor, contract-backed working capital, escrow-ready records, AI boundary, token utility, and safety sections.',
  'Minute 5-8: open the review report and compare any flagged claim-risk notes against the draft wording.',
  'Minute 8-10: choose ACCEPT, REVISE, or HOLD in the Report-Back Format without approving public publication.',
  'Stop immediately if the review requires legal, finance-provider, deployment, external account, payment, loan, escrow, stablecoin, token collateral, or public-launch action.',
  'ACCEPT_FOR_INTERNAL_REVIEW',
  'HOLD_PUBLICATION',
  'REVIEW_WITH_LEGAL_PROVIDER',
  'This draft is not approved for public publication.',
  'construction trust infrastructure',
  'founder written go/no-go',
  'legal/provider review',
  'finance-provider review',
  'technical/security review',
  'publication go/no-go review',
  'Permission to publish or change public site: NO unless separately approved after reviews',
  'npm run check:whitepaper-v1-2-public-draft-founder-review-packet',
  'npm run check:whitepaper-v1-2-public-draft',
]) {
  assertIncludes(packet, snippet, packetPath);
}

if (packageJson.scripts?.['check:whitepaper-v1-2-public-draft-founder-review-packet'] !== 'node scripts/validate-whitepaper-v1-2-public-draft-founder-review-packet.mjs') {
  fail(`${packagePath} must define check:whitepaper-v1-2-public-draft-founder-review-packet`);
}

assertIncludes(runner, '"check:whitepaper-v1-2-public-draft-founder-review-packet"', runnerPath);
assertIncludes(context, 'Whitepaper v1.2 public draft founder review packet', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-public-draft-founder-review-packet', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 public draft founder review packet', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-public-draft-founder-review-packet', backlogPath);
assertIncludes(realStatus, 'Whitepaper v1.2 public draft founder review packet', realStatusPath);

const unsafePattern = /(publication is approved|public launch is approved|loans? (are|is) (live|available|approved|funded|originated|underwritten)|escrow (is|goes) live|repayment routing is live|stablecoin settlement is live|token collateral is active|guaranteed (yield|return|liquidity|income)|legal review is complete|provider review is complete)/i;
const safeContextPattern = /(does not|blocked|before|required|review|hold|no unless|not approved|do not|without|until|separately approved)/i;
const unsafeLines = packet
  .split(/\r?\n/)
  .filter((line) => unsafePattern.test(line))
  .filter((line) => !safeContextPattern.test(line));

if (unsafeLines.length > 0) {
  fail('Founder review packet must not contain unqualified public/live/money approval claims', { unsafeLines });
}

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(packet)) {
  fail('Founder review packet must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  founder_review_packet: packetPath,
  linked_draft: draftPath,
  linked_review_report: reportPath,
  safety_boundaries_checked: true,
}, null, 2));
