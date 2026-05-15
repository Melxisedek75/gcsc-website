import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const printScriptPath = resolve('scripts', 'print-kimi-controller-start-here.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

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
const audit = readFileSync(auditPath, 'utf8');

if (packageJson.scripts?.['print:kimi-controller-start-here'] !== 'node scripts/print-kimi-controller-start-here.mjs') {
  fail(`${packagePath} must define print:kimi-controller-start-here`);
}
if (packageJson.scripts?.['check:kimi-controller-start-here'] !== 'node scripts/validate-kimi-controller-start-here.mjs') {
  fail(`${packagePath} must define check:kimi-controller-start-here`);
}

assertIncludes(runner, '"check:kimi-controller-start-here"', runnerPath);
if (!existsSync(printScriptPath)) {
  fail('Missing Kimi controller start-here printer', { printScriptPath });
}

const printScript = readFileSync(printScriptPath, 'utf8');
[
  'KIMI-CONTROLLER-START-HERE.txt',
  'kimi-wave-one-handoff-',
  'Start here for Kimi controller',
  'No secrets',
  'No live Supabase',
  'No real payments',
  'No legal',
].forEach((snippet) => assertIncludes(printScript, snippet, printScriptPath));

const prepareResult = spawnSync(process.execPath, ['scripts/prepare-kimi-founder-launch.mjs'], {
  cwd: resolve('.'),
  encoding: 'utf8',
  shell: false,
});
if (prepareResult.error) fail(prepareResult.error.message);
if (prepareResult.status !== 0) {
  fail('prepare:kimi-founder-launch failed before controller start-here print', {
    stdout: prepareResult.stdout,
    stderr: prepareResult.stderr,
  });
}

const result = spawnSync(process.execPath, ['scripts/print-kimi-controller-start-here.mjs'], {
  cwd: resolve('.'),
  encoding: 'utf8',
  shell: false,
});
if (result.error) fail(result.error.message);
if (result.status !== 0) {
  fail('print:kimi-controller-start-here failed', {
    stdout: result.stdout,
    stderr: result.stderr,
  });
}

const output = result.stdout;
[
  'Start here for Kimi controller',
  'Use this local-only bundle in this order:',
  'KIMI-FOUNDER-PROMPT.txt',
  'KIMI-WHITEPAPER-DISPATCH-PROMPT.txt',
  'kimi-wave-one-agent-prompts-',
  'agent-assignment.csv',
  'Claude-Audit',
  'Codex may integrate only Claude-approved PASS_LOCAL_ONLY output after local checks pass.',
  'Stop boundaries:',
  'Do not add secrets',
  'live Supabase changes',
  'real payments',
  'real loans',
  'escrow',
  'repayment routing',
  'stablecoin settlement',
  'token collateral',
  'XPR signatures',
].forEach((snippet) => assertIncludes(output, snippet, 'print:kimi-controller-start-here output'));

const forbiddenSecretPattern = /(sk-[A-Za-z0-9_-]{12,}|service_role\s*[:=]\s*[A-Za-z0-9._-]{12,}|BEGIN PRIVATE KEY|seed phrase|password\s*[:=]\s*['"][^'"]{4,})/i;
if (forbiddenSecretPattern.test(`${printScript}\n${output}`)) {
  fail('Kimi controller start-here printer must not include secret-looking values');
}

[
  [context, contextPath, 'Kimi controller start-here printer'],
  [context, contextPath, 'print:kimi-controller-start-here'],
  [backlog, backlogPath, 'Kimi controller start-here printer'],
  [backlog, backlogPath, 'check:kimi-controller-start-here'],
  [audit, auditPath, 'Kimi controller start-here printer'],
].forEach(([content, label, snippet]) => assertIncludes(content, snippet, label));

console.log(JSON.stringify({
  status: 'passed',
  printer: printScriptPath,
  output_lines_checked: output.split(/\r?\n/).filter(Boolean).length,
  docs_checked: [contextPath, backlogPath, auditPath],
  safety_boundaries_checked: true,
}, null, 2));
