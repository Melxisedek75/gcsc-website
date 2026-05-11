import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const userHome = process.env.USERPROFILE || 'C:\\Users\\rivne';
const automationsRoot = resolve(userHome, '.codex', 'automations');
const heartbeatPath = resolve(automationsRoot, 'xprnet-org-https', 'automation.toml');
const hourlyPath = resolve(automationsRoot, 'gcsc-hourly-autonomous-builder', 'automation.toml');
const hookPath = resolve('..', 'docs', 'codex-nonstop-execution-hook.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Automation health validation failed: ${message}`);
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

function readRequired(file) {
  assert(existsSync(file), `Missing required file: ${file}`);
  return readFileSync(file, 'utf8');
}

function getTomlString(content, key) {
  const match = content.match(new RegExp(`^${key}\\s*=\\s*\"([^\"]*)\"`, 'm'));
  return match?.[1] || '';
}

const heartbeat = readRequired(heartbeatPath);
const hourly = readRequired(hourlyPath);
const hook = readRequired(hookPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

for (const [name, content, file] of [
  ['heartbeat', heartbeat, heartbeatPath],
  ['hourly worker', hourly, hourlyPath],
]) {
  assertIncludes(content, 'status = "ACTIVE"', file);
  assert(!/[ÐÑ�]/.test(content), `${name} automation prompt appears mojibake/corrupted`);
  assert(!/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|SUPABASE_SERVICE_ROLE_KEY\s*=\s*[^<\s]/i.test(content), `${name} automation must not contain secret-looking values`);
}

assertIncludes(heartbeat, 'kind = "heartbeat"', heartbeatPath);
assertIncludes(heartbeat, 'rrule = "FREQ=MINUTELY;INTERVAL=1"', heartbeatPath);
assertIncludes(heartbeat, 'target_thread_id = "', heartbeatPath);
assertIncludes(heartbeat, 'C:\\\\gcsc', heartbeatPath);
assertIncludes(heartbeat, 'docs/gcsc-active-context.md', heartbeatPath);
assertIncludes(heartbeat, 'docs/smartcontractor-backlog.md', heartbeatPath);
assertIncludes(heartbeat, 'Autonomous Builder', heartbeatPath);
assertIncludes(heartbeat, 'Do not only promise', heartbeatPath);

const targetThreadId = getTomlString(heartbeat, 'target_thread_id');
assert(/^[0-9a-f-]{36}$/i.test(targetThreadId), 'heartbeat target_thread_id must look like a UUID');

assertIncludes(hourly, 'kind = "cron"', hourlyPath);
assertIncludes(hourly, 'rrule = "FREQ=HOURLY;INTERVAL=1"', hourlyPath);
assertIncludes(hourly, 'execution_environment = "local"', hourlyPath);
assertIncludes(hourly, 'cwds = ["C:\\\\gcsc"]', hourlyPath);
assertIncludes(hourly, 'docs/codex-nonstop-execution-hook.md', hourlyPath);
assertIncludes(hourly, 'gcsc-hourly-autonomous-builder', hourlyPath);

assertIncludes(hook, 'interval: every 1 minute', hookPath);
assertIncludes(hook, 'target thread', hookPath);
assertIncludes(context, 'heartbeat `xprnet-org-https`', contextPath);
assertIncludes(backlog, 'Automation health validator', backlogPath);

console.log(JSON.stringify({
  status: 'passed',
  heartbeat: heartbeatPath,
  hourly: hourlyPath,
  target_thread_id: targetThreadId,
}, null, 2));
