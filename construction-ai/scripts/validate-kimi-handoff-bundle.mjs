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
const prepareScriptPath = resolve('scripts', 'prepare-kimi-handoff-bundle.mjs');
const printPromptScriptPath = resolve('scripts', 'print-kimi-founder-prompt.mjs');
const outputIntakeScriptPath = resolve('scripts', 'prepare-kimi-output-intake.mjs');
const prepareScript = readFileSync(prepareScriptPath, 'utf8');
const printPromptScript = readFileSync(printPromptScriptPath, 'utf8');
const outputIntakeScript = readFileSync(outputIntakeScriptPath, 'utf8');
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
  'gcsc-kimi-wave-one-progress-tracker-2026-05-14.md',
  'gcsc-kimi-stream-j-smart-contract-local-build-map-work-order.md',
  'gcsc-kimi-stream-h-auth-rls-admin-work-order.md',
  'gcsc-kimi-stream-i-deployment-public-beta-work-order.md',
  'gcsc-kimi-stream-o-investor-partner-alignment-work-order.md',
  'gcsc-kimi-stream-m-mobile-readiness-work-order.md',
  'gcsc-kimi-stream-k-contract-backed-loan-implementation-work-order.md',
  'gcsc-kimi-stream-l-legal-provider-review-work-order.md',
  'gcsc-kimi-wave-one-founder-handoff-index-2026-05-14.md',
  'gcsc-kimi-claude-codex-accelerated-build-master-plan-2026-05-15.md',
  'gcsc-kimi-wave-one-launch-ready-brief-2026-05-15.md',
  'gcsc-kimi-wave-one-founder-copy-paste-prompt-2026-05-15.md',
  'gcsc-kimi-wave-one-controller-launch-packet-2026-05-14.md',
  'gcsc-claude-kimi-output-audit-work-order-2026-05-14.md',
  'gcsc-founder-kimi-claude-quick-start-2026-05-14.md',
  'gcsc-kimi-claude-codex-handoff-bundle-manifest-2026-05-14.md',
  'gcsc-kimi-worker-output-package-template-2026-05-14.md',
  'gcsc-claude-kimi-audit-report-template-2026-05-14.md',
  'gcsc-codex-kimi-integration-merge-queue-template-2026-05-14.md',
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
  'gcsc-kimi-claude-codex-accelerated-build-master-plan-2026-05-15.md',
  'gcsc-kimi-wave-one-launch-ready-brief-2026-05-15.md',
  'gcsc-kimi-wave-one-founder-copy-paste-prompt-2026-05-15.md',
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
  'docs/gcsc-kimi-claude-codex-accelerated-build-master-plan-2026-05-15.md',
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
assertIncludes(
  claudeAudit,
  'docs/gcsc-claude-kimi-audit-report-template-2026-05-14.md',
  'gcsc-claude-kimi-output-audit-work-order-2026-05-14.md'
);

const quickStart = docs.get('gcsc-founder-kimi-claude-quick-start-2026-05-14.md').content;
for (const snippet of [
  'Step 1: Start Kimi',
  'Step 2: Save Kimi Output',
  'Step 3: Send To Claude',
  'Step 4: Return To Codex',
  'docs/gcsc-kimi-wave-one-launch-ready-brief-2026-05-15.md',
  'docs/gcsc-kimi-wave-one-founder-copy-paste-prompt-2026-05-15.md',
  'Do Not Paste These Anywhere',
]) {
  assertIncludes(quickStart, snippet, 'gcsc-founder-kimi-claude-quick-start-2026-05-14.md');
}

const founderCopyPastePrompt = docs.get('gcsc-kimi-wave-one-founder-copy-paste-prompt-2026-05-15.md').content;
for (const snippet of [
  'Copy-Paste Prompt For Kimi',
  'Dispatch exactly 100 agents',
  'docs/gcsc-kimi-worker-output-package-template-2026-05-14.md',
  'Do not touch secrets',
  'BLOCKED_FOR_FOUNDER_OR_EXTERNAL_REVIEW',
  'READY_LOCAL_ONLY_FOR_KIMI_COPY_PASTE_LAUNCH',
]) {
  assertIncludes(founderCopyPastePrompt, snippet, 'gcsc-kimi-wave-one-founder-copy-paste-prompt-2026-05-15.md');
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

const progressTracker = docs.get('gcsc-kimi-wave-one-progress-tracker-2026-05-14.md').content;
for (const snippet of [
  'Allowed Status Values',
  'Hard Stop Values',
  'Stream Progress Matrix',
  'Per-Agent Row Template',
  'Controller Summary Template',
  'PASS_LOCAL_ONLY',
  'BLOCKED_EXTERNAL_REVIEW',
  'FAIL_UNSAFE',
  'MERGED_LOCAL',
]) {
  assertIncludes(progressTracker, snippet, 'gcsc-kimi-wave-one-progress-tracker-2026-05-14.md');
}
assertIncludes(progressTracker, 'Total first wave: 100 agents.', 'gcsc-kimi-wave-one-progress-tracker-2026-05-14.md');

const claudeTemplate = docs.get('gcsc-claude-kimi-audit-report-template-2026-05-14.md').content;
for (const snippet of [
  'Required File Naming',
  'Required Header',
  'Required Verdicts',
  'Stream Verdict Matrix',
  'Finding Format',
  'Hard Fail Rules',
  'Recommended Codex Merge Order',
  'No-Touch Confirmation',
  'Codex Intake Rule',
]) {
  assertIncludes(claudeTemplate, snippet, 'gcsc-claude-kimi-audit-report-template-2026-05-14.md');
}
for (const verdict of ['PASS_LOCAL_ONLY', 'REWORK', 'BLOCKED_EXTERNAL_REVIEW', 'FAIL_UNSAFE']) {
  assertIncludes(claudeTemplate, verdict, 'gcsc-claude-kimi-audit-report-template-2026-05-14.md');
}

const mergeQueueTemplate = docs.get('gcsc-codex-kimi-integration-merge-queue-template-2026-05-14.md').content;
for (const snippet of [
  'Required File Naming',
  'Required Inputs',
  'Hard Reject Precheck',
  'Stream Queue Matrix',
  'Commit Plan',
  'Required Local Checks',
  'Shared File Edit Plan',
  'Safety Confirmation',
  'Final Codex Intake Verdict',
]) {
  assertIncludes(mergeQueueTemplate, snippet, 'gcsc-codex-kimi-integration-merge-queue-template-2026-05-14.md');
}
for (const state of [
  'READY_LOCAL_ONLY',
  'PARTIAL_READY',
  'REWORK_REQUIRED',
  'BLOCKED_EXTERNAL_REVIEW',
  'FAIL_UNSAFE',
]) {
  assertIncludes(mergeQueueTemplate, state, 'gcsc-codex-kimi-integration-merge-queue-template-2026-05-14.md');
}

const checkName = 'check:kimi-handoff-bundle';
assert(
  packageJson.scripts?.[checkName] === 'node scripts/validate-kimi-handoff-bundle.mjs',
  `${packagePath} must define ${checkName}`
);
assert(
  packageJson.scripts?.['prepare:kimi-handoff-bundle'] === 'node scripts/prepare-kimi-handoff-bundle.mjs',
  `${packagePath} must define prepare:kimi-handoff-bundle`
);
assert(
  packageJson.scripts?.['print:kimi-founder-prompt'] === 'node scripts/print-kimi-founder-prompt.mjs',
  `${packagePath} must define print:kimi-founder-prompt`
);
assert(
  packageJson.scripts?.['prepare:kimi-output-intake'] === 'node scripts/prepare-kimi-output-intake.mjs',
  `${packagePath} must define prepare:kimi-output-intake`
);
assert(existsSync(prepareScriptPath), `${prepareScriptPath} must exist`);
for (const snippet of [
  '.tmp',
  'kimi-wave-one-handoff',
  'sha256',
  'file_integrity',
  'Integrity Manifest',
  'KIMI-FOUNDER-PROMPT.txt',
  'extractFounderPrompt',
  'docs/gcsc-founder-kimi-claude-quick-start-2026-05-14.md',
  'docs/gcsc-kimi-claude-codex-accelerated-build-master-plan-2026-05-15.md',
  'docs/gcsc-kimi-wave-one-launch-ready-brief-2026-05-15.md',
  'docs/gcsc-kimi-wave-one-founder-copy-paste-prompt-2026-05-15.md',
  'docs/gcsc-kimi-wave-one-progress-tracker-2026-05-14.md',
  'docs/gcsc-codex-kimi-integration-merge-queue-template-2026-05-14.md',
  'Do not add secrets',
]) {
  assertIncludes(prepareScript, snippet, prepareScriptPath);
}
assert(existsSync(printPromptScriptPath), `${printPromptScriptPath} must exist`);
for (const snippet of [
  'gcsc-kimi-wave-one-founder-copy-paste-prompt-2026-05-15.md',
  'Copy-Paste Prompt For Kimi',
  'Dispatch exactly 100 agents',
  'Do not touch secrets',
  'BLOCKED_FOR_FOUNDER_OR_EXTERNAL_REVIEW',
]) {
  assertIncludes(printPromptScript, snippet, printPromptScriptPath);
}
assert(existsSync(outputIntakeScriptPath), `${outputIntakeScriptPath} must exist`);
for (const snippet of [
  '.tmp',
  'kimi-wave-one-output-intake',
  '00-controller-summary',
  '01-claude-audit',
  '02-codex-merge-queue',
  '99-blocked-or-rejected',
  'Do not place secrets',
]) {
  assertIncludes(outputIntakeScript, snippet, outputIntakeScriptPath);
}
for (const stream of ['A', 'F', 'N', 'J', 'H', 'I', 'O', 'M', 'K', 'L', 'Q', 'S']) {
  assertIncludes(outputIntakeScript, `'${stream}'`, outputIntakeScriptPath);
}
assertIncludes(runner, `"${checkName}"`, runnerPath);
assertIncludes(context, 'Kimi handoff bundle validator', contextPath);
assertIncludes(context, 'Kimi worker output package template', contextPath);
assertIncludes(context, 'Claude Kimi audit report template', contextPath);
assertIncludes(context, 'Codex Kimi integration merge queue template', contextPath);
assertIncludes(context, 'Kimi handoff bundle local prepare script', contextPath);
assertIncludes(context, 'Kimi bundle generated prompt file', contextPath);
assertIncludes(context, 'Kimi founder prompt print script', contextPath);
assertIncludes(context, 'Kimi handoff bundle integrity manifest', contextPath);
assertIncludes(context, 'Kimi output intake local prepare script', contextPath);
assertIncludes(context, 'Kimi Wave One progress tracker', contextPath);
assertIncludes(context, 'Kimi Wave One progress tracker validator', contextPath);
assertIncludes(context, 'Kimi Wave One founder copy-paste prompt', contextPath);
assertIncludes(backlog, 'Kimi handoff bundle validator', backlogPath);
assertIncludes(backlog, 'Kimi worker output package template', backlogPath);
assertIncludes(backlog, 'Claude Kimi audit report template', backlogPath);
assertIncludes(backlog, 'Codex Kimi integration merge queue template', backlogPath);
assertIncludes(backlog, 'Kimi handoff bundle local prepare script', backlogPath);
assertIncludes(backlog, 'Kimi bundle generated prompt file', backlogPath);
assertIncludes(backlog, 'Kimi founder prompt print script', backlogPath);
assertIncludes(backlog, 'Kimi handoff bundle integrity manifest', backlogPath);
assertIncludes(backlog, 'Kimi output intake local prepare script', backlogPath);
assertIncludes(backlog, 'Kimi Wave One progress tracker', backlogPath);
assertIncludes(backlog, 'Kimi Wave One progress tracker validator', backlogPath);
assertIncludes(backlog, 'Kimi Wave One founder copy-paste prompt', backlogPath);
assertIncludes(audit, 'Kimi handoff bundle validator', auditPath);
assertIncludes(audit, 'Kimi worker output package template', auditPath);
assertIncludes(audit, 'Claude Kimi audit report template', auditPath);
assertIncludes(audit, 'Codex Kimi integration merge queue template', auditPath);
assertIncludes(audit, 'Kimi handoff bundle local prepare script', auditPath);
assertIncludes(audit, 'Kimi bundle generated prompt file', auditPath);
assertIncludes(audit, 'Kimi founder prompt print script', auditPath);
assertIncludes(audit, 'Kimi handoff bundle integrity manifest', auditPath);
assertIncludes(audit, 'Kimi output intake local prepare script', auditPath);
assertIncludes(audit, 'Kimi Wave One progress tracker', auditPath);
assertIncludes(audit, 'Kimi Wave One progress tracker validator', auditPath);
assertIncludes(audit, 'Kimi Wave One founder copy-paste prompt', auditPath);

console.log(JSON.stringify({
  status: 'passed',
  docs_checked: requiredDocs.length,
  streams_checked: 12,
  stop_boundary_snippets_checked: stopBoundarySnippets.length,
  package_script_checked: checkName,
}, null, 2));
