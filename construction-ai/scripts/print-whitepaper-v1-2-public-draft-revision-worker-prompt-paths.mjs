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
    .sort((left, right) => right.mtimeMs - left.mtimeMs || right.name.localeCompare(left.name));

  return candidates[0] ?? null;
}

const latestPromptFolder = latestDirectory('whitepaper-v1-2-public-draft-revision-worker-prompts-');
const promptRoot = latestPromptFolder?.path ?? null;
const promptFolder = promptRoot ? join(promptRoot, 'prompts') : null;
const workerAssignmentCsv = promptRoot ? join(promptRoot, 'worker-assignment.csv') : null;
const manifest = promptRoot ? join(promptRoot, 'manifest.json') : null;
const readme = promptRoot ? join(promptRoot, 'README.md') : null;

const workerIds = [
  'Kimi-A',
  'Kimi-B',
  'Kimi-C',
  'Kimi-D',
  'Kimi-E',
  'Claude-Audit',
  'Codex-Integration',
];

const workerPromptFiles = Object.fromEntries(workerIds.map((workerId) => [
  workerId,
  promptFolder ? join(promptFolder, `${workerId}-prompt.md`) : null,
]));

const requiredFiles = [
  workerAssignmentCsv,
  manifest,
  readme,
  ...Object.values(workerPromptFiles),
].filter(Boolean);

const missingFiles = requiredFiles.filter((filePath) => !existsSync(filePath));
const ready = Boolean(promptRoot && missingFiles.length === 0);

console.log(JSON.stringify({
  status: ready ? 'ready' : 'missing_latest_whitepaper_revision_prompt_artifacts',
  tmp_root: tmpRoot,
  latest_prompt_root: promptRoot,
  prompt_folder: promptFolder,
  worker_assignment_csv: workerAssignmentCsv,
  manifest,
  readme,
  worker_prompt_files: workerPromptFiles,
  worker_prompt_upload_allowlist: ready ? [
    promptRoot,
    promptFolder,
    workerAssignmentCsv,
    manifest,
    readme,
    ...Object.values(workerPromptFiles),
  ].filter(Boolean) : [],
  worker_prompt_upload_blocklist: [
    'Do not upload the whole project.',
    'Do not upload .env files.',
    'Do not upload credentials, private keys, tokens, service-role keys, Magic Link URLs, or wallet material.',
    'Do not upload private customer data, screenshots, recordings, or raw logs.',
    'Do not upload folders outside the generated whitepaper revision worker prompt folder unless Codex explicitly adds them later.',
  ],
  dispatch_brief: {
    safe_use: 'local_only',
    total_workers: workerIds.length,
    review_order: [
      'Kimi workers',
      'Claude-Audit',
      'Codex-Integration',
    ],
    first_action: 'Give each Kimi worker exactly one prompt from worker_prompt_files.',
    audit_gate: 'Send every Kimi output to Claude-Audit before Codex-Integration applies anything.',
  },
  missing_files: missingFiles,
  next_steps: ready ? [
    'Give each worker exactly one prompt from worker_prompt_files.',
    'Use worker_assignment_csv to track ownership and expected output.',
    'Keep manifest with the local-only handoff material.',
    'Send Kimi outputs to Claude-Audit before Codex-Integration applies anything.',
  ] : [
    'Run npm run prepare:whitepaper-v1-2-public-draft-revision-worker-prompts from C:\\gcsc\\construction-ai.',
    'Run npm run print:whitepaper-v1-2-public-draft-revision-worker-prompt-paths again.',
  ],
  stop_boundaries: [
    'No secrets or private account values.',
    'No public publication, website, PDF, deck, email, social, grant, investor, or announcement use.',
    'No live Supabase changes, deployment, external account, provider, app-store, wallet, or DNS changes.',
    'No real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, or XPR signatures.',
    'No legal, provider, finance, regulator, or public-launch conclusions.',
  ],
}, null, 2));
