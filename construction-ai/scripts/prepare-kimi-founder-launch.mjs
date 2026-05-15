import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = resolve('..');

const REQUIRED_PROMPT_SNIPPETS = [
  'Dispatch exactly 100 agents',
  'Do not touch secrets',
  'BLOCKED_FOR_FOUNDER_OR_EXTERNAL_REVIEW',
];

function fail(message, details = {}) {
  console.error(JSON.stringify({
    status: 'failed',
    message,
    ...details,
  }, null, 2));
  process.exit(1);
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) {
    fail(`${file} must include: ${snippet}`);
  }
}

const prepareResult = spawnSync(
  process.execPath,
  ['scripts/prepare-kimi-handoff-bundle.mjs'],
  {
    cwd: resolve('.'),
    encoding: 'utf8',
  }
);

if (prepareResult.status !== 0) {
  fail('prepare-kimi-handoff-bundle.mjs failed', {
    exit_code: prepareResult.status,
    stderr: prepareResult.stderr.trim(),
    stdout: prepareResult.stdout.trim(),
  });
}

let prepareJson;
try {
  prepareJson = JSON.parse(prepareResult.stdout);
} catch (error) {
  fail('prepare-kimi-handoff-bundle.mjs did not return JSON', {
    error: error.message,
    stdout: prepareResult.stdout.trim(),
  });
}

const bundleRoot = prepareJson.bundle_root;
if (!bundleRoot || !existsSync(bundleRoot)) {
  fail('Generated Kimi bundle root is missing', { bundle_root: bundleRoot });
}

const promptFile = resolve(bundleRoot, 'KIMI-FOUNDER-PROMPT.txt');
const manifestFile = resolve(bundleRoot, 'bundle-files.json');
const readmeFile = resolve(bundleRoot, 'README.md');

for (const file of [promptFile, manifestFile, readmeFile]) {
  if (!existsSync(file)) {
    fail('Generated Kimi bundle is incomplete', { missing_file: file });
  }
}

const prompt = readFileSync(promptFile, 'utf8');
for (const snippet of REQUIRED_PROMPT_SNIPPETS) {
  assertIncludes(prompt, snippet, promptFile);
}

const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
if (!Array.isArray(manifest.files_copied) || manifest.files_copied.length < 27) {
  fail('bundle-files.json must include at least 27 copied/generated files', {
    file_count: manifest.files_copied?.length,
  });
}

console.log(JSON.stringify({
  status: 'prepared',
  bundle_root: bundleRoot,
  prompt_file: promptFile,
  manifest_file: manifestFile,
  readme_file: readmeFile,
  copied_files: manifest.files_copied.length,
  next_steps: [
    'Upload the generated bundle folder to Kimi, not the whole project.',
    'Paste KIMI-FOUNDER-PROMPT.txt into Kimi as the launch message.',
    'Keep bundle-files.json with the bundle for checksum review.',
    'Do not upload .env, credentials, screenshots, private customer data, secrets, or files outside the generated bundle.',
    'Send Kimi output to Claude before Codex integrates anything.',
  ],
  stop_boundaries: [
    'No live Supabase changes.',
    'No external account changes.',
    'No legal, provider, finance, deployment, public launch, app-store, or destructive actions.',
    'No real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, or XPR signatures.',
  ],
  project_root: projectRoot,
}, null, 2));
