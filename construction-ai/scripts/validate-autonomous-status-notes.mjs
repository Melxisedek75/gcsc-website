import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const statusDir = resolve('..', 'docs', 'autonomous-status');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');

function fail(message) {
  console.error(`Autonomous status notes validation failed: ${message}`);
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

assert(existsSync(statusDir), `${statusDir} must exist`);

const statusFiles = readdirSync(statusDir)
  .filter((fileName) => fileName.endsWith('.md'))
  .sort();

assert(statusFiles.length > 0, `${statusDir} must contain at least one status note`);

const secretPattern = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|SUPABASE_SERVICE_ROLE_KEY\s*=\s*[^<\s]/i;

for (const fileName of statusFiles) {
  const filePath = resolve(statusDir, fileName);
  const content = readFileSync(filePath, 'utf8');
  const lower = content.toLowerCase();

  assertIncludes(content, '# Autonomous Status:', filePath);
  assertIncludes(content, 'Time:', filePath);
  assert(
    lower.includes('automation:') || lower.includes('worker:'),
    `${filePath} must include Automation: or Worker:`
  );
  assertIncludes(content, 'gcsc-hourly-autonomous-builder', filePath);
  assert(!secretPattern.test(content), `${filePath} must not contain secret-looking values`);

  if (lower.includes('blocked') || lower.includes('permission denied') || lower.includes('founder action')) {
    assertIncludes(content, '## Founder Action Step', filePath);
  }
}

const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');

assertIncludes(backlog, 'Autonomous status note validator', backlogPath);
assertIncludes(context, 'autonomous status note validator', contextPath);

console.log(JSON.stringify({
  status: 'passed',
  notes_checked: statusFiles.length,
  status_dir: statusDir,
}, null, 2));
