import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const packetPath = resolve('..', 'docs', 'whitepaper-v1-2-public-website-update-packet.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packageJsonPath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

const referencedDocs = [
  'gcsc-v1-2-core-architecture-package.md',
  'whitepaper-v1-2-public-wording-package.md',
  'whitepaper-v1-2-public-edit-queue.md',
  'whitepaper-v1-2-public-excerpt-guard.md',
  'whitepaper-v1-2-publication-go-no-go-checklist.md',
  'whitepaper-v1-2-contract-backed-loan-placement-map.md',
  'whitepaper-v1-2-claim-review-matrix.md',
  'whitepaper-v1-2-terms-glossary.md',
];

function fail(message) {
  console.error(`Whitepaper v1.2 public website update packet validation failed: ${message}`);
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

const packet = readRequired(packetPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = JSON.parse(readRequired(packageJsonPath));
const runner = readRequired(runnerPath);

for (const section of [
  'GCSC Whitepaper v1.2 Public Website Update Packet',
  'What This Packet Does',
  'What This Packet Does Not Approve',
  'Source Documents',
  'Approved Positioning',
  'Website Surfaces To Update Later',
  'Safe Copy Blocks',
  'Contract-Backed Loan Copy Boundaries',
  'Required Adjacent Disclaimers',
  'Blocked Claims',
  'Publication Stop Gates',
  'Founder Review Checklist',
  'Required Checks',
  'Acceptance Check',
]) {
  assertIncludes(packet, section, packetPath);
}

for (const required of [
  'INTERNAL_WEBSITE_UPDATE_PACKET_ONLY',
  'not approval to publish',
  'not approval to publish, deploy, edit the live website',
  'construction trust infrastructure',
  'SmartContractor',
  'project contracts',
  'milestone',
  'contractor reputation',
  'AI-assisted',
  'contract-backed working-capital',
  'compliant settlement roadmap',
  'GCSC',
  'GCST',
  'XPR',
  'website',
  'whitepaper',
  'PDF',
  'pitch deck',
  'email',
  'social media',
  'not a securities offer',
  'not legal advice',
  'not a lender',
  'not an escrow provider',
  'No real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral are live',
  'no live lender',
  'no real escrow',
  'no automatic AI approvals',
  'no token price/yield',
  'stablecoin settlement',
  'token collateral',
  'regulator approved',
  'guaranteed loan',
  'instant loan approval',
  'signed contracts are automatically legal collateral',
  'AI approves loans automatically',
  'publication go/no-go',
  'founder approval record',
  'legal/provider review',
  'finance-provider review',
  'technical/security review',
  'claim review matrix pass',
  'public excerpt guard pass',
  'rollback plan',
  'evidence log',
  'npm run check:whitepaper-v1-2-public-website-update-packet',
  'npm run check:whitepaper-v1-2-public-wording-package',
  'npm run check:whitepaper-v1-2-public-edit-queue',
  'npm run check:whitepaper-v1-2-public-excerpt-guard',
  'npm run check:whitepaper-v1-2-publication-go-no-go',
  'npm run check:whitepaper-v1-2-contract-backed-loan-placement-map',
  'npm run check',
]) {
  assertIncludes(packet, required, packetPath);
}

for (const docPath of referencedDocs) {
  assertIncludes(packet, docPath, packetPath);
  if (!existsSync(resolve('..', 'docs', docPath))) fail(`Referenced document must exist: ${docPath}`);
}

const scriptName = 'check:whitepaper-v1-2-public-website-update-packet';
const scriptCommand = 'scripts/validate-whitepaper-v1-2-public-website-update-packet.mjs';

assertIncludes(context, 'Whitepaper v1.2 public website update packet', contextPath);
assertIncludes(context, scriptName, contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 public website update packet', backlogPath);
assertIncludes(backlog, scriptName, backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 public website update packet', auditPath);
assertIncludes(audit, '451 / 468 = about 96%', auditPath);
assertIncludes(packageJson.scripts?.[scriptName] || '', scriptCommand, packageJsonPath);
assertIncludes(runner, scriptName, runnerPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(packet)) {
  fail('Public website update packet must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_website_update_packet: packetPath,
  public_surfaces_checked: 8,
  blocked_claims_checked: true,
  publication_gates_checked: true,
}, null, 2));
