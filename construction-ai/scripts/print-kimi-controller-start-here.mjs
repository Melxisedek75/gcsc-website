import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const tmpRoot = resolve('..', '.tmp');
const startFileName = 'KIMI-CONTROLLER-START-HERE.txt';

function fail(message, details = {}) {
  console.error(JSON.stringify({ status: 'failed', message, ...details }, null, 2));
  process.exit(1);
}

function latestDirectory(prefix) {
  if (!existsSync(tmpRoot)) return null;

  return readdirSync(tmpRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(prefix))
    .map((entry) => {
      const fullPath = join(tmpRoot, entry.name);
      return {
        name: entry.name,
        path: fullPath,
        mtimeMs: statSync(fullPath).mtimeMs,
      };
    })
    .sort((left, right) => right.mtimeMs - left.mtimeMs)[0] ?? null;
}

const latestBundle = latestDirectory('kimi-wave-one-handoff-');
const startHerePath = latestBundle ? join(latestBundle.path, startFileName) : null;

if (!startHerePath || !existsSync(startHerePath)) {
  fail('Missing latest Kimi controller start-here file', {
    expected_file: startFileName,
    latest_bundle_root: latestBundle?.path ?? null,
    next_step: 'Run npm run prepare:kimi-founder-launch from C:\\gcsc\\construction-ai.',
    stop_boundaries: [
      'No secrets.',
      'No live Supabase.',
      'No real payments.',
      'No legal decisions.',
    ],
  });
}

const content = readFileSync(startHerePath, 'utf8');

[
  'Start here for Kimi controller',
  'KIMI-FOUNDER-PROMPT.txt',
  'KIMI-WHITEPAPER-DISPATCH-PROMPT.txt',
  'agent-assignment.csv',
  'Upload allowlist',
  'Do not upload the whole project',
  'Do not upload .env files',
  'Do not upload credentials',
  'Do not upload private customer data',
  'Do not add secrets',
  'live Supabase changes',
  'real payments',
  'legal decisions',
].forEach((snippet) => {
  if (!content.includes(snippet) && !content.toLowerCase().includes(snippet.toLowerCase())) {
    fail('Latest Kimi controller start-here file is missing required content', {
      start_here_file: startHerePath,
      snippet,
    });
  }
});

process.stdout.write(content.endsWith('\n') ? content : `${content}\n`);
