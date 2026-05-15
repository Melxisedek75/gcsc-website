import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const tmpRoot = resolve('..', '.tmp');

function latestDirectory(prefix) {
  if (!existsSync(tmpRoot)) return null;

  const candidates = readdirSync(tmpRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(prefix))
    .map((entry) => {
      const fullPath = join(tmpRoot, entry.name);
      return {
        name: entry.name,
        path: fullPath,
        mtimeMs: statSync(fullPath).mtimeMs,
      };
    })
    .sort((left, right) => right.mtimeMs - left.mtimeMs);

  return candidates[0] ?? null;
}

const latestBundle = latestDirectory('kimi-wave-one-handoff-');
const latestPrompts = latestDirectory('kimi-wave-one-agent-prompts-');
const latestWhitepaperRevisionPrompts = latestDirectory('whitepaper-v1-2-public-draft-revision-worker-prompts-');

const bundleRoot = latestBundle?.path ?? null;
const promptRoot = latestPrompts?.path ?? null;
const whitepaperRevisionPromptRoot = latestWhitepaperRevisionPrompts?.path ?? null;
const controllerStartHere = bundleRoot ? join(bundleRoot, 'KIMI-CONTROLLER-START-HERE.txt') : null;
const founderPrompt = bundleRoot ? join(bundleRoot, 'KIMI-FOUNDER-PROMPT.txt') : null;
const whitepaperDispatchPrompt = bundleRoot ? join(bundleRoot, 'KIMI-WHITEPAPER-DISPATCH-PROMPT.txt') : null;
const bundleManifest = bundleRoot ? join(bundleRoot, 'bundle-files.json') : null;
const promptManifest = promptRoot ? join(promptRoot, 'manifest.json') : null;
const assignmentCsv = promptRoot ? join(promptRoot, 'agent-assignment.csv') : null;
const whitepaperRevisionControllerStartHere = whitepaperRevisionPromptRoot
  ? join(whitepaperRevisionPromptRoot, 'CONTROLLER-START-HERE.txt')
  : null;
const whitepaperRevisionWorkerAssignmentCsv = whitepaperRevisionPromptRoot
  ? join(whitepaperRevisionPromptRoot, 'worker-assignment.csv')
  : null;
const whitepaperRevisionManifest = whitepaperRevisionPromptRoot
  ? join(whitepaperRevisionPromptRoot, 'manifest.json')
  : null;

const requiredFiles = [
  controllerStartHere,
  founderPrompt,
  whitepaperDispatchPrompt,
  bundleManifest,
  promptManifest,
  assignmentCsv,
  whitepaperRevisionControllerStartHere,
  whitepaperRevisionWorkerAssignmentCsv,
  whitepaperRevisionManifest,
].filter(Boolean);

const missingFiles = requiredFiles.filter((filePath) => !existsSync(filePath));
const ready = Boolean(bundleRoot && promptRoot && whitepaperRevisionPromptRoot && missingFiles.length === 0);

console.log(JSON.stringify({
  status: ready ? 'ready' : 'missing_latest_kimi_launch_artifacts',
  tmp_root: tmpRoot,
  latest_bundle_root: bundleRoot,
  latest_agent_prompt_root: promptRoot,
  latest_whitepaper_revision_prompt_root: whitepaperRevisionPromptRoot,
  controller_start_here: controllerStartHere,
  whitepaper_revision_controller_start_here: whitepaperRevisionControllerStartHere,
  whitepaper_revision_worker_assignment_csv: whitepaperRevisionWorkerAssignmentCsv,
  whitepaper_revision_manifest: whitepaperRevisionManifest,
  founder_prompt: founderPrompt,
  whitepaper_dispatch_prompt: whitepaperDispatchPrompt,
  bundle_manifest: bundleManifest,
  prompt_manifest: promptManifest,
  agent_assignment_csv: assignmentCsv,
  missing_files: missingFiles,
  safe_commands: [
    'npm run prepare:kimi-founder-launch',
    'npm run prepare:whitepaper-v1-2-public-draft-revision-worker-prompts',
    'npm run print:kimi-operator-dashboard',
    'npm run print:kimi-latest-launch-paths',
    'npm run print:whitepaper-v1-2-public-draft-revision-controller-start-here',
    'npm run check:kimi-latest-launch-paths',
  ],
  upload_allowlist: [
    bundleRoot,
    promptRoot,
    whitepaperRevisionPromptRoot,
  ].filter(Boolean),
  upload_blocklist: [
    'Do not upload the whole project.',
    'Do not upload .env files.',
    'Do not upload credentials, private keys, tokens, or service-role keys.',
    'Do not upload private customer data, screenshots, recordings, or raw logs.',
    'Do not upload folders outside the generated .tmp launch folders unless Codex explicitly adds them later.',
  ],
  next_steps: ready ? [
    'Upload latest_bundle_root to Kimi, not the whole project.',
    'Open controller_start_here first for the exact local-only launch order.',
    'Paste founder_prompt as the Kimi launch message.',
    'Paste whitepaper_dispatch_prompt when launching the focused whitepaper v1.2 revision sprint.',
    'Open whitepaper_revision_controller_start_here before assigning the focused whitepaper revision workers.',
    'Use agent_assignment_csv to assign one prompt file per Kimi worker.',
    'Use whitepaper_revision_worker_assignment_csv for the focused seven-worker whitepaper revision sprint.',
    'Keep bundle_manifest and prompt_manifest with the handoff material.',
    'Send Kimi output to Claude before Codex integrates anything.',
  ] : [
    'Run npm run prepare:kimi-founder-launch from C:\\gcsc\\construction-ai.',
    'Run npm run prepare:whitepaper-v1-2-public-draft-revision-worker-prompts from C:\\gcsc\\construction-ai.',
    'Run npm run print:kimi-latest-launch-paths again.',
  ],
  stop_boundaries: [
    'No secrets or private account values.',
    'No live Supabase changes.',
    'No deployment, public launch, external account, app-store, or DNS changes.',
    'No real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, or XPR signatures.',
    'No legal, provider, finance, or regulator conclusions.',
  ],
}, null, 2));
