import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const printScriptPath = resolve('scripts', 'print-kimi-whitepaper-dispatch-prompt.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realStatusPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message, details = {}) {
  console.error(JSON.stringify({ status: 'failed', message, ...details }, null, 2));
  process.exit(1);
}

function assertIncludes(content, snippet, label) {
  if (!content.includes(snippet)) {
    fail(`${label} missing required snippet`, { snippet });
  }
}

const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
const runner = readFileSync(runnerPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const realStatus = readFileSync(realStatusPath, 'utf8');

if (packageJson.scripts?.['print:kimi-whitepaper-dispatch-prompt'] !== 'node scripts/print-kimi-whitepaper-dispatch-prompt.mjs') {
  fail(`${packagePath} must define print:kimi-whitepaper-dispatch-prompt`);
}
if (packageJson.scripts?.['check:kimi-whitepaper-dispatch-prompt'] !== 'node scripts/validate-kimi-whitepaper-dispatch-prompt.mjs') {
  fail(`${packagePath} must define check:kimi-whitepaper-dispatch-prompt`);
}

assertIncludes(runner, '"check:kimi-whitepaper-dispatch-prompt"', runnerPath);

if (!existsSync(printScriptPath)) {
  fail('Missing Kimi whitepaper dispatch prompt printer', { printScriptPath });
}

const printScript = readFileSync(printScriptPath, 'utf8');
[
  'KIMI WHITEPAPER V1.2 REVISION DISPATCH',
  'WHITEPAPER_REVISION_LOCAL_ONLY',
  'whitepaper_revision_copy_paste_dispatch',
  'Claude-Audit',
  'Codex-Integration',
  'Upload allowlist',
  'Do not upload the whole project',
  'Do not upload .env files',
  'Do not upload credentials',
  'Do not upload private customer data',
  'No secrets',
  'No public publication',
  'No real payments',
  'No legal',
].forEach((snippet) => assertIncludes(printScript, snippet, printScriptPath));

const result = spawnSync(process.execPath, ['scripts/print-kimi-whitepaper-dispatch-prompt.mjs'], {
  cwd: resolve('.'),
  encoding: 'utf8',
  shell: false,
});

if (result.error) fail(result.error.message);
if (result.status !== 0) {
  fail('print:kimi-whitepaper-dispatch-prompt failed', { stdout: result.stdout, stderr: result.stderr });
}

const output = result.stdout;
[
  'KIMI WHITEPAPER V1.2 REVISION DISPATCH',
  'WHITEPAPER_REVISION_LOCAL_ONLY',
  'Review order: Kimi workers -> Claude-Audit -> Codex-Integration',
  'Audit gate: Send every Kimi output to Claude-Audit before Codex-Integration applies anything.',
  'Required return format:',
  'worker_id:',
  'output_files_created:',
  'source_files_reviewed:',
  'blocked_items:',
  'safety_notes:',
  'status: PASS_LOCAL_ONLY or NEEDS_REVIEW',
  'Stop boundaries:',
  'No secrets',
  'No public publication',
  'No real payments',
  'No legal',
  'No live Supabase',
  'No XPR signatures',
  'No token collateral',
  'Upload allowlist',
  'Do not upload the whole project',
  'Do not upload .env files',
  'Do not upload credentials',
  'Do not upload private customer data',
].forEach((snippet) => assertIncludes(output, snippet, 'print:kimi-whitepaper-dispatch-prompt output'));

[
  'Kimi-A',
  'Kimi-B',
  'Kimi-C',
  'Kimi-D',
  'Kimi-E',
  'Claude-Audit',
  'Codex-Integration',
].forEach((workerId) => {
  assertIncludes(output, `${workerId}:`, 'print:kimi-whitepaper-dispatch-prompt output');
  assertIncludes(output, `${workerId}-prompt.md`, 'print:kimi-whitepaper-dispatch-prompt output');
});

assertIncludes(output, '.tmp', 'print:kimi-whitepaper-dispatch-prompt output');
assertIncludes(output, 'whitepaper-v1-2-public-draft-revision-worker-prompts-', 'print:kimi-whitepaper-dispatch-prompt output');
assertIncludes(output, 'prompts', 'print:kimi-whitepaper-dispatch-prompt output');

const forbiddenSecretPattern = /(sk-[A-Za-z0-9_-]{12,}|service_role\s*[:=]\s*[A-Za-z0-9._-]{12,}|BEGIN PRIVATE KEY|seed phrase|password\s*[:=]\s*['"][^'"]{4,})/i;
const combined = `${printScript}\n${output}`;
if (forbiddenSecretPattern.test(combined)) {
  fail('Kimi whitepaper dispatch prompt printer must not include secret-looking values');
}

[
  [context, contextPath, 'Kimi whitepaper dispatch prompt printer'],
  [context, contextPath, 'Kimi whitepaper dispatch prompt upload allowlist'],
  [context, contextPath, 'print:kimi-whitepaper-dispatch-prompt'],
  [context, contextPath, 'check:kimi-whitepaper-dispatch-prompt'],
  [backlog, backlogPath, 'Kimi whitepaper dispatch prompt printer'],
  [backlog, backlogPath, 'Kimi whitepaper dispatch prompt upload allowlist'],
  [backlog, backlogPath, 'check:kimi-whitepaper-dispatch-prompt'],
  [realStatus, realStatusPath, 'Kimi whitepaper dispatch prompt upload allowlist'],
  [realStatus, realStatusPath, 'print:kimi-whitepaper-dispatch-prompt'],
].forEach(([content, label, snippet]) => assertIncludes(content, snippet, label));

console.log(JSON.stringify({
  status: 'passed',
  printer: printScriptPath,
  output_lines_checked: output.split(/\r?\n/).filter(Boolean).length,
  worker_prompt_paths_checked: 7,
  docs_checked: [
    contextPath,
    backlogPath,
    realStatusPath,
  ],
}, null, 2));
