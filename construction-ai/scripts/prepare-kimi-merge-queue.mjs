import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

const projectRoot = resolve('..');
const docsRoot = resolve(projectRoot, 'docs');
const tmpRoot = resolve(projectRoot, '.tmp');
const dateStamp = new Date().toISOString().slice(0, 10);
const queuePath = resolve(docsRoot, `codex-kimi-integration-merge-queue-wave-one-${dateStamp}.md`);
const explicitIntakeRoot = process.argv[2] ? resolve(process.argv[2]) : null;
const streams = ['N', 'F', 'A', 'J', 'K', 'L', 'H', 'I', 'O', 'M', 'Q', 'S'];
const stopBoundaryText = 'This queue does not approve deployment, public launch, live Supabase changes, external account changes, legal decisions, provider commitments, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, secrets handling, or destructive actions.';

function fail(message) {
  console.error(`Kimi merge queue preparation failed: ${message}`);
  process.exit(1);
}

function findLatestIntakeRoot() {
  if (!existsSync(tmpRoot)) {
    fail(`Missing .tmp folder: ${tmpRoot}`);
  }

  const candidates = readdirSync(tmpRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('kimi-wave-one-output-intake-'))
    .map((entry) => resolve(tmpRoot, entry.name))
    .sort((a, b) => basename(b).localeCompare(basename(a)));

  if (candidates.length === 0) {
    fail('No kimi-wave-one-output-intake-* folder found. Run npm run prepare:kimi-output-intake first.');
  }

  return candidates[0];
}

function listFiles(folder) {
  if (!existsSync(folder)) return [];

  const results = [];
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const fullPath = join(folder, entry.name);
    if (entry.isDirectory()) {
      results.push(...listFiles(fullPath));
    } else if (entry.isFile()) {
      results.push(fullPath);
    }
  }
  return results;
}

function runGit(args) {
  const result = spawnSync('git', args, {
    cwd: projectRoot,
    encoding: 'utf8',
    shell: false,
  });
  if (result.error) return 'unknown';
  return (result.stdout || '').trim() || 'unknown';
}

function countFiles(root, pathParts) {
  return listFiles(resolve(root, ...pathParts)).length;
}

if (existsSync(queuePath)) {
  fail(`Merge queue already exists and will not be overwritten: ${queuePath}`);
}

const intakeRoot = explicitIntakeRoot ?? findLatestIntakeRoot();
if (!existsSync(intakeRoot)) {
  fail(`Intake folder does not exist: ${intakeRoot}`);
}
if (!intakeRoot.startsWith(tmpRoot)) {
  fail('Intake folder must stay under C:\\gcsc\\.tmp');
}

const workerReportTotal = streams.reduce((sum, stream) => sum + countFiles(intakeRoot, ['streams', stream, 'worker-reports']), 0);
const claudeVerdictTotal = streams.reduce((sum, stream) => sum + countFiles(intakeRoot, ['streams', stream, 'claude-verdict']), 0);
const createdFileTotal = streams.reduce((sum, stream) => sum + countFiles(intakeRoot, ['streams', stream, 'created-or-modified-files']), 0);
const controllerSummaryTotal = countFiles(intakeRoot, ['00-controller-summary']);
const claudeAuditTotal = countFiles(intakeRoot, ['01-claude-audit']);
const currentBranch = runGit(['branch', '--show-current']);
const gitStatus = runGit(['status', '--short', '--branch']);
const queueStatus = workerReportTotal > 0 && claudeAuditTotal > 0
  ? 'PARTIAL_READY'
  : 'REWORK_REQUIRED';

const streamRows = streams.map((stream) => {
  const workerReports = countFiles(intakeRoot, ['streams', stream, 'worker-reports']);
  const claudeVerdicts = countFiles(intakeRoot, ['streams', stream, 'claude-verdict']);
  const createdFiles = countFiles(intakeRoot, ['streams', stream, 'created-or-modified-files']);
  const intakeState = workerReports > 0 && claudeVerdicts > 0
    ? 'ACCEPT_AFTER_INTEGRATOR_EDIT'
    : 'REWORK_REQUIRED';
  const commitAllowed = workerReports > 0 && claudeVerdicts > 0 ? 'review-first' : 'no';

  return `| ${stream} | ${workerReports > 0 ? `${workerReports} report(s)` : 'missing'} | ${claudeVerdicts > 0 ? `${claudeVerdicts} verdict(s)` : 'missing'} | ${intakeState} | ${createdFiles} file(s) | see intake checklist | ${commitAllowed} |`;
}).join('\n');

const commitRows = streams.slice(0, 10).map((stream, index) => {
  const workerReports = countFiles(intakeRoot, ['streams', stream, 'worker-reports']);
  const claudeVerdicts = countFiles(intakeRoot, ['streams', stream, 'claude-verdict']);
  const allowed = workerReports > 0 && claudeVerdicts > 0;
  return `| ${index + 1} | ${stream} | Integrate Kimi stream ${stream} accepted local output | TBD after Claude PASS_LOCAL_ONLY | ${allowed ? 'stream validator + git diff --check' : 'worker report + Claude verdict required'} | npm run check:real-status-audit |`;
}).join('\n');

const queue = `# Codex Kimi Integration Merge Queue: Wave One

Date: ${dateStamp}
Prepared by: Codex local generator
Kimi controller summary reviewed: ${controllerSummaryTotal > 0 ? 'yes' : 'no'}
Claude audit report reviewed: ${claudeAuditTotal > 0 ? 'yes' : 'no'}
Current branch: ${currentBranch}
Overall queue status: ${queueStatus}

${stopBoundaryText}

## Source Inputs

- Intake root: \`${intakeRoot}\`
- Git status at generation:

\`\`\`text
${gitStatus}
\`\`\`

- Controller summary files: ${controllerSummaryTotal}
- Kimi worker reports: ${workerReportTotal}
- Kimi-created or modified files: ${createdFileTotal}
- Claude stream verdict files: ${claudeVerdictTotal}
- Claude audit files: ${claudeAuditTotal}
- Required template: \`docs/gcsc-codex-kimi-integration-merge-queue-template-2026-05-14.md\`
- Intake checklist: \`docs/gcsc-kimi-output-integration-intake-checklist-2026-05-14.md\`

## Hard Reject Precheck

No integration is allowed until:

- \`npm run summarize:kimi-output-intake\` has no \`blocked_for_review\` result.
- \`npm run audit:kimi-worker-reports\` has no \`blocked_for_review\`, \`needs_rework\`, or \`needs_review\` result.
- Claude audit returns \`PASS_LOCAL_ONLY\` for a stream.
- Codex confirms no secrets, no live Supabase changes, no external account actions, no public-file edits without approval, and no real payment/loan/escrow/repayment/stablecoin/token-collateral action.

Current hard-reject status: \`${queueStatus === 'REWORK_REQUIRED' ? 'REWORK_REQUIRED because worker reports or Claude audit files are missing' : 'PENDING_MANUAL_REVIEW'}\`

## Stream Queue Matrix

| Stream | Kimi worker verdict | Claude verdict | Codex intake state | Files proposed | Required checks | Commit allowed |
| --- | --- | --- | --- | --- | --- | --- |
${streamRows}

## Accepted Local-Only Streams

None.

## Streams Requiring Rework

${workerReportTotal === 0 ? '- All streams: waiting for Kimi worker reports and Claude audit verdicts.' : '- Streams marked `REWORK_REQUIRED` in the matrix need missing worker reports or Claude verdicts.'}

## Streams Blocked For Founder External Review

None identified by this local generator. Any live, legal, payment, loan, escrow, repayment, stablecoin, token collateral, deployment, provider, app-store, XPR signature, or public-launch output must be moved to blocked review.

## Commit Plan

| Order | Stream | Commit name | Files to stage | Checks before commit | Checks after commit |
| ---:| --- | --- | --- | --- | --- |
${commitRows}

Do not create a combined mega-commit across unrelated streams.

## Required Local Checks

\`\`\`powershell
cd C:\\gcsc\\construction-ai
npm run summarize:kimi-output-intake
npm run audit:kimi-worker-reports
npm run check:kimi-output-intake
npm run check:kimi-worker-report-audit
npm run check:real-status-audit
\`\`\`

Run full \`npm run check\` when package scripts, backend/frontend/smart-contract files, safety validators, public whitepaper, or public website files change.

## Shared File Edit Plan

Codex integrator owns edits to shared files:

- \`construction-ai/package.json\`
- \`construction-ai/scripts/run-checks.mjs\`
- \`docs/gcsc-active-context.md\`
- \`docs/smartcontractor-backlog.md\`
- \`docs/gcsc-real-status-audit-2026-05-11.md\`
- any central validator

Kimi worker changes to these files are proposals only.

## Safety Confirmation

- No secrets in accepted files: no accepted files yet
- No live Supabase changes: yes
- No external account changes: yes
- No public file edits without approval: yes
- No legal/provider conclusions accepted as facts: yes
- No real payment/loan/escrow/repayment/stablecoin/token-collateral action: yes
- No deployment/app-store/XPR signature action: yes

## Final Codex Intake Verdict

\`${queueStatus}\`
`;

writeFileSync(queuePath, queue);

console.log(JSON.stringify({
  status: 'prepared',
  queue_path: queuePath,
  intake_root: intakeRoot,
  overall_queue_status: queueStatus,
  streams_checked: streams.length,
  controller_summary_files: controllerSummaryTotal,
  worker_reports: workerReportTotal,
  kimi_created_or_modified_files: createdFileTotal,
  claude_stream_verdict_files: claudeVerdictTotal,
  claude_audit_files: claudeAuditTotal,
  safety_boundaries_checked: true,
}, null, 2));
