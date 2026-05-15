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

const agentPromptResult = spawnSync(
  process.execPath,
  ['scripts/prepare-kimi-agent-prompts.mjs'],
  {
    cwd: resolve('.'),
    encoding: 'utf8',
  }
);

if (agentPromptResult.status !== 0) {
  fail('prepare-kimi-agent-prompts.mjs failed', {
    exit_code: agentPromptResult.status,
    stderr: agentPromptResult.stderr.trim(),
    stdout: agentPromptResult.stdout.trim(),
  });
}

let agentPromptJson;
try {
  agentPromptJson = JSON.parse(agentPromptResult.stdout);
} catch (error) {
  fail('prepare-kimi-agent-prompts.mjs did not return JSON', {
    error: error.message,
    stdout: agentPromptResult.stdout.trim(),
  });
}

if (!agentPromptJson.output_root || !existsSync(agentPromptJson.output_root)) {
  fail('Generated Kimi agent prompt root is missing', {
    output_root: agentPromptJson.output_root,
  });
}

if (agentPromptJson.total_agents !== 100 || agentPromptJson.streams_prepared !== 12) {
  fail('Generated Kimi agent prompts must cover 100 agents across 12 streams', {
    total_agents: agentPromptJson.total_agents,
    streams_prepared: agentPromptJson.streams_prepared,
  });
}

console.log(JSON.stringify({
  status: 'prepared',
  bundle_root: bundleRoot,
  agent_prompt_root: agentPromptJson.output_root,
  upload_allowlist: [
    {
      label: 'Generated Kimi handoff bundle folder',
      path: bundleRoot,
      required_files: [
        'README.md',
        'bundle-files.json',
        'KIMI-FOUNDER-PROMPT.txt',
        'KIMI-WHITEPAPER-DISPATCH-PROMPT.txt',
        'KIMI-CONTROLLER-START-HERE.txt',
      ],
    },
    {
      label: 'Generated 100-agent prompt folder',
      path: agentPromptJson.output_root,
      required_files: [
        'README.md',
        'manifest.json',
        'agent-assignment.csv',
        'prompts/<STREAM>/<AGENT>-prompt.md',
      ],
    },
  ],
  upload_blocklist: [
    'Do not upload the whole project.',
    'Do not upload .env files.',
    'Do not upload credentials, private keys, tokens, service-role keys, Magic Link URLs, wallet material, or raw database passwords.',
    'Do not upload private customer data, screenshots, recordings, or raw logs.',
    'Do not upload files outside the generated bundle or generated agent prompt folder unless Codex explicitly adds them later.',
  ],
  prompt_file: promptFile,
  manifest_file: manifestFile,
  readme_file: readmeFile,
  copied_files: manifest.files_copied.length,
  agent_prompts: {
    total_agents: agentPromptJson.total_agents,
    streams_prepared: agentPromptJson.streams_prepared,
    stream_counts: agentPromptJson.stream_counts,
    assignment_csv: agentPromptJson.assignment_csv,
  },
  next_steps: [
    'Upload the generated bundle folder to Kimi, not the whole project.',
    'If Kimi supports per-worker prompts, also upload or distribute the generated agent prompt folder.',
    'Paste KIMI-FOUNDER-PROMPT.txt into Kimi as the launch message.',
    'Use agent-assignment.csv to assign and track one prompt file per Kimi worker.',
    'Give each Kimi worker exactly one prompts/<STREAM>/<AGENT>-prompt.md file.',
    'Keep bundle-files.json with the bundle for checksum review.',
    'Keep manifest.json with the generated agent prompts for stream count review.',
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
