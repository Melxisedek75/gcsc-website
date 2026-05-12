import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const architecturePath = resolve('..', 'docs', 'gcsc-target-architecture.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const packagePath = resolve('package.json');

function fail(message) {
  console.error(`Target architecture validation failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function assertIncludes(content, snippet, file) {
  assert(
    content.toLowerCase().includes(snippet.toLowerCase()),
    `${file} must include: ${snippet}`
  );
}

assert(existsSync(architecturePath), `${architecturePath} must exist`);

const architecture = readFileSync(architecturePath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');
const packageJson = readFileSync(packagePath, 'utf8');

for (const section of [
  '## Purpose',
  '## Comparable Product Lessons',
  '## Target Architecture Map',
  '## Core Domain Modules',
  '## Database Groups To Lock Early',
  '## API Groups To Build',
  '## Step-By-Step Build Order',
  '## Whitepaper Sections That Must Be Updated',
  '## Do Not Build Yet',
  '## Immediate Next Engineering Tasks',
]) {
  assertIncludes(architecture, section, architecturePath);
}

for (const moduleName of [
  'Identity And Verification',
  'Jobs And Milestones',
  'Bids Marketplace',
  'Project Contract Layer',
  'Payment Router',
  'Escrow And Release Ledger',
  'Contractor Credit Engine',
  'Token Collateral Layer',
  'Dispute Center',
  'Peer Review And Inspector Network',
  'Reputation System',
  'Compliance And Documents',
  'AI Agents',
  'Audit Ledger',
  'Admin And Risk Console',
  'Mobile And PWA Layer',
  'Smart Contracts',
]) {
  assertIncludes(architecture, moduleName, architecturePath);
}

for (const safetyBoundary of [
  'if regulated escrow is required, use a licensed payment/escrow partner',
  'automatic liquidation before legal, oracle, and smart contract design are reviewed',
  'AI recommends; critical money movement and legal actions require deterministic rules and human/admin approval',
  'move finalized settlement and token logic on-chain after legal/security review',
  'promising guaranteed returns from token appreciation',
  'sending sensitive user documents to AI models by default',
]) {
  assertIncludes(architecture, safetyBoundary, architecturePath);
}

for (const completedTask of [
  'Add `audit_events`. DONE.',
  'Add payment webhook skeletons. DONE.',
  'Add Admin / Risk Console MVP. DONE.',
  'Add Auth Implementation Scaffold. DONE.',
  'Add Profile Ownership Binding draft. REVIEW.',
  'Add Supabase Service-Role Boundary. REVIEW.',
  'Add Admin Role Model. REVIEW.',
]) {
  assertIncludes(architecture, completedTask, architecturePath);
}

assertIncludes(backlog, 'Target architecture validator', backlogPath);
assertIncludes(context, 'Target architecture validator', contextPath);
assertIncludes(packageJson, 'check:target-architecture', packagePath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]/i.test(architecture),
  'Target architecture must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  architecture: architecturePath,
  safety_boundaries_checked: true,
}, null, 2));
