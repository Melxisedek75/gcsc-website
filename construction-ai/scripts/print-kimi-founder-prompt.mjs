import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const promptPath = resolve('..', 'docs', 'gcsc-kimi-wave-one-founder-copy-paste-prompt-2026-05-15.md');
const promptDoc = readFileSync(promptPath, 'utf8');
const match = promptDoc.match(/## Copy-Paste Prompt For Kimi\s+```text\s+([\s\S]*?)\s+```/);

function fail(message) {
  console.error(`Kimi founder prompt print failed: ${message}`);
  process.exit(1);
}

if (!match?.[1]) {
  fail(`Missing copy-paste prompt block in ${promptPath}`);
}

const prompt = match[1].trim();
const requiredSnippets = [
  'You are the Kimi controller for GCSC/SmartContractor Wave One.',
  'Dispatch exactly 100 agents',
  'Do not touch secrets',
  'BLOCKED_FOR_FOUNDER_OR_EXTERNAL_REVIEW',
  'PASS_LOCAL_ONLY',
];

for (const snippet of requiredSnippets) {
  if (!prompt.toLowerCase().includes(snippet.toLowerCase())) {
    fail(`Prompt must include: ${snippet}`);
  }
}

process.stdout.write(`${prompt}\n`);
