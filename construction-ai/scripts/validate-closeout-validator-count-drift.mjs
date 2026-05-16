import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const founderCloseoutValidatorPath = resolve('scripts', 'validate-founder-auth-admin-evidence-closeout.mjs');
const deploymentCloseoutValidatorPath = resolve('scripts', 'validate-deployment-founder-external-setup-closeout.mjs');
const publicBetaArchiveIndexCloseoutValidatorPaths = [
  'validate-public-beta-first-batch-support-trend-archive-index-founder-decision-intake.mjs',
  'validate-public-beta-first-batch-support-trend-archive-index-founder-decision-closeout.mjs',
  'validate-public-beta-first-batch-support-trend-archive-index-internal-action-queue.mjs',
  'validate-public-beta-first-batch-support-trend-archive-index-internal-action-closeout.mjs',
  'validate-public-beta-first-batch-support-trend-archive-index-internal-action-closeout-handoff.mjs',
  'validate-public-beta-first-batch-support-trend-archive-index-internal-action-closeout-handoff-closeout.mjs',
  'validate-public-beta-first-batch-support-trend-archive-index-internal-action-closeout-handoff-closeout-handoff.mjs',
  'validate-public-beta-first-batch-support-trend-archive-index-internal-action-closeout-handoff-closeout-handoff-closeout.mjs',
  'validate-public-beta-first-batch-support-trend-archive-index-internal-action-closeout-handoff-closeout-handoff-closeout-handoff.mjs',
].map((file) => resolve('scripts', file));
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Closeout validator count drift validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

function assertNoFixedBacklogCount(content, file) {
  if (/\d+\s+tracked items,\s+\d+\s+DONE,\s+\d+\s+REVIEW,\s+\d+\s+BLOCKED,\s+\d+\s+LATER/i.test(content)) {
    fail(`${file} must not hardcode exact backlog counts`);
  }
}

const founderCloseoutValidator = readRequired(founderCloseoutValidatorPath);
const deploymentCloseoutValidator = readRequired(deploymentCloseoutValidatorPath);
const publicBetaArchiveIndexCloseoutValidators = publicBetaArchiveIndexCloseoutValidatorPaths.map((path) => [
  readRequired(path),
  path,
]);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const [content, file] of [
  [founderCloseoutValidator, founderCloseoutValidatorPath],
  [deploymentCloseoutValidator, deploymentCloseoutValidatorPath],
  ...publicBetaArchiveIndexCloseoutValidators,
]) {
  assertNoFixedBacklogCount(content, file);
  assertIncludes(content, "assertIncludes(context, 'Backlog count at latest audit', contextPath)", file);
  assertIncludes(content, 'assertIncludes(audit,', file);
  assertIncludes(content, 'assertIncludes(backlog,', file);
}

const scriptName = 'check:closeout-validator-count-drift';

assertIncludes(context, 'Closeout validator backlog count drift guard', contextPath);
assertIncludes(context, scriptName, contextPath);
assertIncludes(context, 'Backlog count at latest audit', contextPath);
assertIncludes(backlog, 'Closeout validator backlog count drift guard', backlogPath);
assertIncludes(backlog, scriptName, backlogPath);
assertIncludes(audit, 'Closeout validator backlog count drift guard', auditPath);
assertIncludes(audit, 'public beta archive-index closeout chain validators', auditPath);
assertIncludes(audit, 'Raw backlog completion by item count', auditPath);
assertIncludes(packageJson, `"${scriptName}"`, packagePath);
assertIncludes(runner, `"${scriptName}"`, runnerPath);

console.log(JSON.stringify({
  status: 'passed',
  validators_checked: [
    founderCloseoutValidatorPath,
    deploymentCloseoutValidatorPath,
    ...publicBetaArchiveIndexCloseoutValidatorPaths,
  ],
  fixed_backlog_counts_blocked: true,
}, null, 2));
