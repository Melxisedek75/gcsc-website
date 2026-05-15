import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docsRoot = resolve('..', 'docs');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const contextPath = resolve(docsRoot, 'gcsc-active-context.md');
const backlogPath = resolve(docsRoot, 'smartcontractor-backlog.md');
const auditPath = resolve(docsRoot, 'gcsc-real-status-audit-2026-05-11.md');

const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
const runner = readFileSync(runnerPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const audit = readFileSync(auditPath, 'utf8');

function fail(message) {
  console.error(`Kimi handoff bundle validation failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function readDoc(relativePath) {
  const filePath = resolve(docsRoot, relativePath);
  assert(existsSync(filePath), `Missing required document: ${relativePath}`);
  return {
    filePath,
    content: readFileSync(filePath, 'utf8'),
  };
}

function assertIncludes(content, snippet, file) {
  assert(
    content.toLowerCase().includes(snippet.toLowerCase()),
    `${file} must include: ${snippet}`
  );
}

const requiredDocs = [
  'gcsc-kimi-parallel-execution-audit-2026-05-14.md',
  'gcsc-kimi-stream-a-whitepaper-v1-2-public-draft-work-order.md',
  'gcsc-kimi-stream-f-n-api-and-public-safety-work-order.md',
  'gcsc-kimi-100-agent-dispatch-board-2026-05-14.md',
  'gcsc-kimi-output-integration-intake-checklist-2026-05-14.md',
  'gcsc-kimi-stream-j-smart-contract-local-build-map-work-order.md',
  'gcsc-kimi-stream-h-auth-rls-admin-work-order.md',
  'gcsc-kimi-stream-i-deployment-public-beta-work-order.md',
  'gcsc-kimi-stream-o-investor-partner-alignment-work-order.md',
  'gcsc-kimi-stream-m-mobile-readiness-work-order.md',
  'gcsc-kimi-stream-k-contract-backed-loan-implementation-work-order.md',
  'gcsc-kimi-stream-l-legal-provider-review-work-order.md',
  'gcsc-kimi-wave-one-founder-handoff-index-2026-05-14.md',
  'gcsc-kimi-wave-one-controller-launch-packet-2026-05-14.md',
  'gcsc-claude-kimi-output-audit-work-order-2026-05-14.md',
  'gcsc-founder-kimi-claude-quick-start-2026-05-14.md',
  'gcsc-kimi-claude-codex-handoff-bundle-manifest-2026-05-14.md',
  'gcsc-kimi-worker-output-package-template-2026-05-14.md',
];

const docs = new Map(requiredDocs.map((relativePath) => [relativePath, readDoc(relativePath)]));

const stopBoundarySnippets = [
  'live Supabase',
  'real payments',
  'real loans',
  'escrow',
  'repayment routing',
  'stablecoin settlement',
  'token collateral',
  'legal decisions',
  'external account',
  'secrets',
];

for (const [relativePath, { content }] of docs) {
  assert(
    !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(content),
    `${relativePath} must not contain real secret-looking values`
  );
}

for (const relativePath of [
  'gcsc-kimi-wave-one-founder-handoff-index-2026-05-14.md',
  'gcsc-kimi-wave-one-controller-launch-packet-2026-05-14.md',
  'gcsc-claude-kimi-output-audit-work-order-2026-05-14.md',
  'gcsc-founder-kimi-claude-quick-start-2026-05-14.md',
  'gcsc-kimi-claude-codex-handoff-bundle-manifest-2026-05-14.md',
]) {
  const content = docs.get(relativePath).content;
  for (const snippet of stopBoundarySnippets) {
    assertIncludes(content, snippet, relativePath);
  }
}

const handoffIndex = docs.get('gcsc-kimi-wave-one-founder-handoff-index-2026-05-14.md').content;
for (const stream of ['A', 'F', 'N', 'J', 'H', 'I', 'O', 'M', 'K', 'L', 'Q', 'S']) {
  assertIncludes(handoffIndex, `| ${stream} |`, 'gcsc-kimi-wave-one-founder-handoff-index-2026-05-14.md');
}
assertIncludes(handoffIndex, 'Total first wave: 100 agents.', 'gcsc-kimi-wave-one-founder-handoff-index-2026-05-14.md');
assertIncludes(handoffIndex, 'Required Worker Report Format', 'gcsc-kimi-wave-one-founder-handoff-index-2026-05-14.md');

const controllerPacket = docs.get('gcsc-kimi-wave-one-controller-launch-packet-2026-05-14.md').content;
for (const snippet of [
  'Copy-Paste Controller Prompt',
  'Seven-Day Execution Rhythm',
  'Controller Summary Format',
  'Acceptable Results',
  'Unacceptable outputs',
  'Codex Intake After Kimi Returns',
]) {
  assertIncludes(controllerPacket, snippet, 'gcsc-kimi-wave-one-controller-launch-packet-2026-05-14.md');
}

const claudeAudit = docs.get('gcsc-claude-kimi-output-audit-work-order-2026-05-14.md').content;
for (const snippet of [
  'Mandatory Audit Questions',
  'Stream-Specific Review',
  'Hard Reject Conditions',
  'Claude Output Format',
  'Recommended Codex Response To Claude',
]) {
  assertIncludes(claudeAudit, snippet, 'gcsc-claude-kimi-output-audit-work-order-2026-05-14.md');
}

const quickStart = docs.get('gcsc-founder-kimi-claude-quick-start-2026-05-14.md').content;
for (const snippet of [
  'Step 1: Start Kimi',
  'Step 2: Save Kimi Output',
  'Step 3: Send To Claude',
  'Step 4: Return To Codex',
  'Do Not Paste These Anywhere',
]) {
  assertIncludes(quickStart, snippet, 'gcsc-founder-kimi-claude-quick-start-2026-05-14.md');
}

const manifest = docs.get('gcsc-kimi-claude-codex-handoff-bundle-manifest-2026-05-14.md').content;
for (const relativePath of requiredDocs) {
  assertIncludes(manifest, relativePath, 'gcsc-kimi-claude-codex-handoff-bundle-manifest-2026-05-14.md');
}
for (const snippet of ['Kimi Bundle', 'Claude Bundle', 'Codex Bundle', 'Bundle Ownership', 'Current Recommended Next Action']) {
  assertIncludes(manifest, snippet, 'gcsc-kimi-claude-codex-handoff-bundle-manifest-2026-05-14.md');
}

const workerTemplate = docs.get('gcsc-kimi-worker-output-package-template-2026-05-14.md').content;
for (const snippet of [
  'Required File Naming',
  'Required Header',
  'Required Sections',
  'Safety Confirmation',
  'No-Touch Confirmation',
  'Worker Final Verdict',
  'Controller Bundle Requirement',
]) {
  assertIncludes(workerTemplate, snippet, 'gcsc-kimi-worker-output-package-template-2026-05-14.md');
}
for (const verdict of [
  'ACCEPT_LOCAL_ONLY',
  'ACCEPT_AFTER_INTEGRATOR_EDIT',
  'REWORK_REQUIRED',
  'REJECT_UNTIL_REWORKED',
  'BLOCKED_FOR_FOUNDER_OR_EXTERNAL_REVIEW',
]) {
  assertIncludes(workerTemplate, verdict, 'gcsc-kimi-worker-output-package-template-2026-05-14.md');
}

const checkName = 'check:kimi-handoff-bundle';
assert(
  packageJson.scripts?.[checkName] === 'node scripts/validate-kimi-handoff-bundle.mjs',
  `${packagePath} must define ${checkName}`
);
assertIncludes(runner, `"${checkName}"`, runnerPath);
assertIncludes(context, 'Kimi handoff bundle validator', contextPath);
assertIncludes(context, 'Kimi worker output package template', contextPath);
assertIncludes(backlog, 'Kimi handoff bundle validator', backlogPath);
assertIncludes(backlog, 'Kimi worker output package template', backlogPath);
assertIncludes(audit, 'Kimi handoff bundle validator', auditPath);
assertIncludes(audit, 'Kimi worker output package template', auditPath);

console.log(JSON.stringify({
  status: 'passed',
  docs_checked: requiredDocs.length,
  streams_checked: 12,
  stop_boundary_snippets_checked: stopBoundarySnippets.length,
  package_script_checked: checkName,
}, null, 2));
