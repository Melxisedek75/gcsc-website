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

const bundleRoot = latestBundle?.path ?? null;
const promptRoot = latestPrompts?.path ?? null;
const founderPrompt = bundleRoot ? join(bundleRoot, 'KIMI-FOUNDER-PROMPT.txt') : null;
const bundleManifest = bundleRoot ? join(bundleRoot, 'bundle-files.json') : null;
const promptManifest = promptRoot ? join(promptRoot, 'manifest.json') : null;
const assignmentCsv = promptRoot ? join(promptRoot, 'agent-assignment.csv') : null;

const requiredFiles = [
  founderPrompt,
  bundleManifest,
  promptManifest,
  assignmentCsv,
].filter(Boolean);

const missingFiles = requiredFiles.filter((filePath) => !existsSync(filePath));
const ready = Boolean(bundleRoot && promptRoot && missingFiles.length === 0);

console.log(JSON.stringify({
  status: ready ? 'ready' : 'missing_latest_kimi_launch_artifacts',
  tmp_root: tmpRoot,
  latest_bundle_root: bundleRoot,
  latest_agent_prompt_root: promptRoot,
  founder_prompt: founderPrompt,
  bundle_manifest: bundleManifest,
  prompt_manifest: promptManifest,
  agent_assignment_csv: assignmentCsv,
  missing_files: missingFiles,
  next_steps: ready ? [
    'Upload latest_bundle_root to Kimi, not the whole project.',
    'Paste founder_prompt as the Kimi launch message.',
    'Use agent_assignment_csv to assign one prompt file per Kimi worker.',
    'Keep bundle_manifest and prompt_manifest with the handoff material.',
    'Send Kimi output to Claude before Codex integrates anything.',
  ] : [
    'Run npm run prepare:kimi-founder-launch from C:\\gcsc\\construction-ai.',
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
