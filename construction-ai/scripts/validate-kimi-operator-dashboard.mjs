import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const dashboardPath = resolve('scripts', 'print-kimi-operator-dashboard.mjs');
const pipelinePath = resolve('scripts', 'print-kimi-pipeline-commands.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const quickStartPath = resolve('..', 'docs', 'gcsc-founder-kimi-claude-quick-start-2026-05-14.md');
const manifestPath = resolve('..', 'docs', 'gcsc-kimi-claude-codex-handoff-bundle-manifest-2026-05-14.md');
const trackerPath = resolve('..', 'docs', 'gcsc-kimi-wave-one-progress-tracker-2026-05-14.md');
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
const dashboard = readFileSync(dashboardPath, 'utf8');
const pipeline = readFileSync(pipelinePath, 'utf8');
const context = readFileSync(contextPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const quickStart = readFileSync(quickStartPath, 'utf8');
const manifest = readFileSync(manifestPath, 'utf8');
const tracker = readFileSync(trackerPath, 'utf8');
const realStatus = readFileSync(realStatusPath, 'utf8');

if (packageJson.scripts?.['print:kimi-operator-dashboard'] !== 'node scripts/print-kimi-operator-dashboard.mjs') {
  fail(`${packagePath} must define print:kimi-operator-dashboard`);
}
if (packageJson.scripts?.['check:kimi-operator-dashboard'] !== 'node scripts/validate-kimi-operator-dashboard.mjs') {
  fail(`${packagePath} must define check:kimi-operator-dashboard`);
}

assertIncludes(runner, '"check:kimi-operator-dashboard"', runnerPath);
assertIncludes(pipeline, 'npm run print:kimi-operator-dashboard', pipelinePath);

[
  'kimi_wave_one_operator_dashboard',
  'latest_paths',
  'whitepaper_revision_dispatch_brief',
  'whitepaper_revision_worker_prompt_files',
  'whitepaper_revision_copy_paste_dispatch',
  'whitepaper_revision_prompt_root',
  'whitepaper_revision_readme',
  'whitepaper_revision_worker_assignment_csv',
  'missing_required_docs',
  'missing_latest_artifacts',
  'fastest_safe_sequence',
  'required_checks_before_codex_merge',
  'No secrets',
  'No live Supabase writes',
  'No real payments',
  'PASS_LOCAL_ONLY',
].forEach((snippet) => assertIncludes(dashboard, snippet, dashboardPath));

const result = spawnSync(process.execPath, ['scripts/print-kimi-operator-dashboard.mjs'], {
  cwd: resolve('.'),
  encoding: 'utf8',
  shell: false,
});

if (result.error) fail(result.error.message);
if (result.status !== 0) {
  fail('print:kimi-operator-dashboard failed', { stdout: result.stdout, stderr: result.stderr });
}

let parsed;
try {
  parsed = JSON.parse(result.stdout);
} catch (error) {
  fail(`print:kimi-operator-dashboard must print JSON: ${error.message}`, { stdout: result.stdout });
}

if (parsed.status !== 'ready_local_only') {
  fail('operator dashboard must be ready_local_only when required docs exist', { parsed });
}

[
  'dashboard',
  'docs_root',
  'tmp_root',
  'latest_paths',
  'whitepaper_revision_dispatch_brief',
  'whitepaper_revision_worker_prompt_files',
  'whitepaper_revision_copy_paste_dispatch',
  'fastest_safe_sequence',
  'required_checks_before_codex_merge',
  'stop_boundaries',
].forEach((key) => {
  if (!(key in parsed)) fail('operator dashboard missing JSON key', { key, parsed });
});

if (!parsed.latest_paths?.codex_merge_queue_file || !existsSync(parsed.latest_paths.codex_merge_queue_file)) {
  fail('operator dashboard must point at the latest Codex merge queue file', { latest_paths: parsed.latest_paths });
}
if (!parsed.latest_paths?.whitepaper_revision_prompt_root || !existsSync(parsed.latest_paths.whitepaper_revision_prompt_root)) {
  fail('operator dashboard must point at the latest whitepaper revision prompt root', { latest_paths: parsed.latest_paths });
}
if (!parsed.latest_paths?.whitepaper_revision_worker_assignment_csv || !existsSync(parsed.latest_paths.whitepaper_revision_worker_assignment_csv)) {
  fail('operator dashboard must point at the latest whitepaper revision worker assignment CSV', {
    latest_paths: parsed.latest_paths,
  });
}
if (!parsed.latest_paths?.whitepaper_revision_readme || !existsSync(parsed.latest_paths.whitepaper_revision_readme)) {
  fail('operator dashboard must point at the latest whitepaper revision README', {
    latest_paths: parsed.latest_paths,
  });
}
if (parsed.whitepaper_revision_dispatch_brief?.safe_use !== 'local_only') {
  fail('operator dashboard must expose a local-only whitepaper revision dispatch brief', {
    whitepaper_revision_dispatch_brief: parsed.whitepaper_revision_dispatch_brief,
  });
}
if (parsed.whitepaper_revision_dispatch_brief?.total_workers !== 7) {
  fail('operator dashboard whitepaper revision dispatch brief must expose the seven-worker split', {
    whitepaper_revision_dispatch_brief: parsed.whitepaper_revision_dispatch_brief,
  });
}
[
  'Kimi workers',
  'Claude-Audit',
  'Codex-Integration',
].forEach((reviewStep) => {
  if (!parsed.whitepaper_revision_dispatch_brief?.review_order?.includes(reviewStep)) {
    fail('operator dashboard whitepaper revision dispatch brief missing review order step', {
      reviewStep,
      whitepaper_revision_dispatch_brief: parsed.whitepaper_revision_dispatch_brief,
    });
  }
});
if (!parsed.whitepaper_revision_dispatch_brief?.audit_gate?.includes('Claude-Audit')) {
  fail('operator dashboard whitepaper revision dispatch brief must keep Claude-Audit as the audit gate', {
    whitepaper_revision_dispatch_brief: parsed.whitepaper_revision_dispatch_brief,
  });
}
if (!parsed.whitepaper_revision_worker_prompt_files || Object.keys(parsed.whitepaper_revision_worker_prompt_files).length !== 7) {
  fail('operator dashboard must expose all seven whitepaper revision worker prompt files', {
    whitepaper_revision_worker_prompt_files: parsed.whitepaper_revision_worker_prompt_files,
  });
}
[
  'Kimi-A',
  'Kimi-B',
  'Kimi-C',
  'Kimi-D',
  'Kimi-E',
  'Claude-Audit',
  'Codex-Integration',
].forEach((workerId) => {
  const promptPath = parsed.whitepaper_revision_worker_prompt_files?.[workerId];
  if (!promptPath || !existsSync(promptPath)) {
    fail('operator dashboard whitepaper revision worker prompt file missing or does not exist', {
      workerId,
      promptPath,
      whitepaper_revision_worker_prompt_files: parsed.whitepaper_revision_worker_prompt_files,
    });
  }
});
if (!Array.isArray(parsed.whitepaper_revision_copy_paste_dispatch) || parsed.whitepaper_revision_copy_paste_dispatch.length !== 7) {
  fail('operator dashboard must expose seven whitepaper revision copy-paste dispatch lines', {
    whitepaper_revision_copy_paste_dispatch: parsed.whitepaper_revision_copy_paste_dispatch,
  });
}
[
  'Kimi-A',
  'Kimi-B',
  'Kimi-C',
  'Kimi-D',
  'Kimi-E',
  'Claude-Audit',
  'Codex-Integration',
].forEach((workerId) => {
  const dispatchLine = parsed.whitepaper_revision_copy_paste_dispatch?.find((line) => line.startsWith(`${workerId}: `));
  if (!dispatchLine || !dispatchLine.includes(parsed.whitepaper_revision_worker_prompt_files?.[workerId])) {
    fail('operator dashboard whitepaper revision copy-paste dispatch line missing worker prompt path', {
      workerId,
      dispatchLine,
      promptPath: parsed.whitepaper_revision_worker_prompt_files?.[workerId],
      whitepaper_revision_copy_paste_dispatch: parsed.whitepaper_revision_copy_paste_dispatch,
    });
  }
});
if (!Array.isArray(parsed.fastest_safe_sequence) || !parsed.fastest_safe_sequence.includes('npm run print:kimi-operator-dashboard')) {
  fail('operator dashboard fastest sequence must include itself for reprintability', {
    fastest_safe_sequence: parsed.fastest_safe_sequence,
  });
}
if (!parsed.fastest_safe_sequence.includes('npm run print:whitepaper-v1-2-public-draft-revision-worker-prompt-paths')) {
  fail('operator dashboard fastest sequence must include the whitepaper revision prompt path printer', {
    fastest_safe_sequence: parsed.fastest_safe_sequence,
  });
}
if (!Array.isArray(parsed.required_checks_before_codex_merge) || !parsed.required_checks_before_codex_merge.includes('npm run check:kimi-operator-dashboard')) {
  fail('operator dashboard required checks must include its validator', {
    required_checks_before_codex_merge: parsed.required_checks_before_codex_merge,
  });
}
if (!parsed.required_checks_before_codex_merge.includes('npm run check:whitepaper-v1-2-public-draft-revision-worker-prompt-paths')) {
  fail('operator dashboard required checks must include the whitepaper revision prompt path validator', {
    required_checks_before_codex_merge: parsed.required_checks_before_codex_merge,
  });
}

[
  [context, contextPath, 'Kimi operator dashboard printer'],
  [context, contextPath, 'print:kimi-operator-dashboard'],
  [backlog, backlogPath, 'Kimi operator dashboard printer'],
  [backlog, backlogPath, 'check:kimi-operator-dashboard'],
  [quickStart, quickStartPath, 'npm run print:kimi-operator-dashboard'],
  [manifest, manifestPath, 'print:kimi-operator-dashboard'],
  [tracker, trackerPath, 'npm run print:kimi-operator-dashboard'],
  [realStatus, realStatusPath, 'Kimi operator dashboard printer'],
].forEach(([content, label, snippet]) => assertIncludes(content, snippet, label));

const forbiddenSecretPattern = /(sk-[A-Za-z0-9_-]{12,}|service_role\s*[:=]\s*[A-Za-z0-9._-]{12,}|BEGIN PRIVATE KEY|seed phrase|password\s*[:=]\s*['"][^'"]{4,})/i;
const combined = `${dashboard}\n${result.stdout}`;
if (forbiddenSecretPattern.test(combined)) {
  fail('operator dashboard output must not include secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  operator_dashboard: dashboardPath,
  latest_merge_queue: parsed.latest_paths.codex_merge_queue_file,
  latest_artifacts_checked: Object.keys(parsed.latest_paths).length,
  fastest_sequence_steps_checked: parsed.fastest_safe_sequence.length,
  required_checks_checked: parsed.required_checks_before_codex_merge.length,
  safety_boundaries_checked: parsed.stop_boundaries.length,
}, null, 2));
