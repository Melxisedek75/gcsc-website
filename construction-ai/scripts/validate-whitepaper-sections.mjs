import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const creditPath = resolve('..', 'docs', 'whitepaper-contractor-credit-section.md');
const architecturePath = resolve('..', 'docs', 'whitepaper-smartcontractor-architecture-section.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const packagePath = resolve('package.json');

function fail(message) {
  console.error(`Whitepaper sections validation failed: ${message}`);
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

for (const path of [creditPath, architecturePath]) {
  assert(existsSync(path), `${path} must exist`);
}

const credit = readFileSync(creditPath, 'utf8');
const architecture = readFileSync(architecturePath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');
const packageJson = readFileSync(packagePath, 'utf8');
const combined = `${credit}\n${architecture}`;

for (const creditTerm of [
  'Contractor Working Capital Loans',
  'upfront deposit',
  'Risk Assessment Agent',
  'Compliance Agent',
  'Treasury Agent',
  'UBI',
  'business-purpose certification',
  'security agreement',
  'Token Collateral for Larger Loans',
  'no guarantee of token price growth',
]) {
  assertIncludes(credit, creditTerm, creditPath);
}

for (const architectureTerm of [
  'SmartContractor Platform Architecture',
  'Project Contracts And Milestones',
  'Multi-Provider Payment Router',
  'Verification Provider Layer',
  'Contractor Credit And Loan Layer',
  'Token Collateral Layer',
  'Disputes, Evidence, And Peer Review',
  'Audit Ledger',
  'AI Agent Boundaries',
  'Blockchain And Smart Contract Layer',
  'Legal And Compliance Boundaries',
]) {
  assertIncludes(architecture, architectureTerm, architecturePath);
}

for (const safetyTerm of [
  'attorney review',
  'not promise token price appreciation',
  'should not silently make irreversible legal or financial decisions',
  'approve real-money loans automatically',
  'release disputed funds',
  'liquidate collateral',
  'Unfinished business rules should not be deployed irreversibly on-chain',
]) {
  assertIncludes(combined, safetyTerm, 'whitepaper sections');
}

assertIncludes(backlog, 'Whitepaper section validator', backlogPath);
assertIncludes(context, 'Whitepaper section validator', contextPath);
assertIncludes(packageJson, 'check:whitepaper-sections', packagePath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]/i.test(combined),
  'Whitepaper sections must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  sections: [creditPath, architecturePath],
  safety_boundaries_checked: true,
}, null, 2));
