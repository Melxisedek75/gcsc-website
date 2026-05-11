import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const promptPath = resolve('..', 'docs', 'claude-code-global-nonstop-prompt.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');

function fail(message) {
  console.error(`Claude Code global prompt validation failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function assertIncludes(content, snippet, file) {
  assert(
    content.toLowerCase().includes(snippet.toLowerCase()),
    `${file} must include: ${snippet}`
  );
}

const prompt = readFileSync(promptPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');

for (const phrase of [
  'GLOBAL NONSTOP CLAUDE CODE OPERATING SYSTEM',
  '~/.claude',
  'settings.json',
  'CLAUDE.md',
  'global-nonstop-rewake.ps1',
  'global-nonstop-build',
  'global-code-reviewer',
  'global-qa',
  'asyncRewake',
  'Start-Sleep -Seconds 30',
  'exit 2',
  'Do not ask "what next"',
  'Restart Claude Code',
]) {
  assertIncludes(prompt, phrase, promptPath);
}

for (const boundary of [
  'passwords',
  'API keys',
  'private keys',
  'seed phrases',
  'service-role keys',
  'live production changes',
  'real payments',
  'legal/financial decisions',
  'destructive operations',
]) {
  assertIncludes(prompt, boundary, promptPath);
}

assertIncludes(backlog, 'Claude Code global nonstop prompt', backlogPath);
assertIncludes(context, 'Claude Code global nonstop prompt', contextPath);

console.log(JSON.stringify({
  status: 'passed',
  prompt: promptPath,
  safety_boundaries_checked: true,
}, null, 2));
