import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const userHome = process.env.USERPROFILE || 'C:\\Users\\rivne';
const automationsRoot = resolve(userHome, '.codex', 'automations');
const heartbeatPath = resolve(automationsRoot, 'gcsc-nonstop-next-task-hook', 'automation.toml');
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
assertIncludes(heartbeat, 'id = "gcsc-nonstop-next-task-hook"', heartbeatPath);
assertIncludes(heartbeat, 'rrule = "FREQ=MINUTELY;INTERVAL=2"', heartbeatPath);
assertIncludes(heartbeat, 'target_thread_id = "', heartbeatPath);
assertIncludes(heartbeat, 'C:\\\\gcsc', heartbeatPath);
assertIncludes(heartbeat, 'docs/gcsc-active-context.md', heartbeatPath);
assertIncludes(heartbeat, 'docs/gcsc-daily-work-mode-hook.md', heartbeatPath);
assertIncludes(heartbeat, 'docs/smartcontractor-backlog.md', heartbeatPath);
assertIncludes(heartbeat, 'current product/code plans', heartbeatPath);
assertIncludes(heartbeat, '2-minute nonstop continuation hook', heartbeatPath);
assertIncludes(heartbeat, 'Two-minute continuation mode is mandatory', heartbeatPath);
assertIncludes(heartbeat, 'next 2-minute heartbeat', heartbeatPath);
assertIncludes(heartbeat, 'future weekly/two-week plans', heartbeatPath);
assertIncludes(heartbeat, 'execute the next safe unblocked item', heartbeatPath);
assertIncludes(heartbeat, 'use tools directly', heartbeatPath);
assertIncludes(heartbeat, 'keep heartbeat status concise', heartbeatPath);
assertIncludes(heartbeat, 'After 17:00 America/Los_Angeles', heartbeatPath);
assertIncludes(heartbeat, 'stop repetitive micro-validator/backlog/audit loops', heartbeatPath);
assertIncludes(heartbeat, 'Founder-Present Evening Mode', heartbeatPath);
assertIncludes(heartbeat, 'stop for founder', heartbeatPath);

const targetThreadId = getTomlString(heartbeat, 'target_thread_id');
assert(/^[0-9a-f-]{36}$/i.test(targetThreadId), 'heartbeat target_thread_id must look like a UUID');

assertIncludes(hourly, 'kind = "cron"', hourlyPath);
assertIncludes(hourly, 'rrule = "FREQ=HOURLY;INTERVAL=1"', hourlyPath);
assertIncludes(hourly, 'execution_environment = "local"', hourlyPath);
assertIncludes(hourly, 'cwds = ["C:\\\\gcsc"]', hourlyPath);
assertIncludes(hourly, 'docs/codex-nonstop-execution-hook.md', hourlyPath);
assertIncludes(hourly, 'gcsc-hourly-autonomous-builder', hourlyPath);
assertIncludes(hourly, 'Silent worker mode', hourlyPath);
assertIncludes(hourly, 'do not write progress chatter', hourlyPath);
assertIncludes(hourly, 'status notes only for blocked', hourlyPath);
assertIncludes(hourly, 'keep commits scoped', hourlyPath);

assertIncludes(hook, 'interval: every 2 minutes', hookPath);
assertIncludes(hook, 'Two-Minute Continuation Mode', hookPath);
assertIncludes(hook, 'gcsc-nonstop-next-task-hook', hookPath);
assertIncludes(hook, 'not a reliable 30-second schedule', hookPath);
assertIncludes(hook, 'target thread', hookPath);
assertIncludes(hook, 'target thread must be the current GCSC/SmartContractor work thread', hookPath);
assertIncludes(hook, 'automation prompt must remain readable UTF-8, not mojibake/corrupted text', hookPath);
assertIncludes(hook, 'docs/whitepaper-v1-3-autonomous-continuation-rule.md', hookPath);
assertIncludes(hook, 'docs/superpowers/plans/2026-05-31-whitepaper-v1-3-hybrid-web3-implementation.md', hookPath);
assertIncludes(hook, 'docs/superpowers/plans/2026-05-31-gcsc-two-week-autonomous-implementation.md', hookPath);
assertIncludes(hook, 'Founder-Present Evening Mode', hookPath);
assertIncludes(hook, 'After 17:00 founder local time', hookPath);
assertIncludes(hook, 'docs/gcsc-daily-work-mode-hook.md', hookPath);
assertIncludes(context, 'heartbeat `gcsc-nonstop-next-task-hook`', contextPath);
assertIncludes(context, 'every 2 minutes', contextPath);
assertIncludes(context, 'Daily work mode hook', contextPath);
assertIncludes(context, 'automation prompt encoding guard', contextPath);
assertIncludes(context, 'automation health target-thread UUID guard', contextPath);
assertIncludes(context, 'automation health target-thread doc-link guard', contextPath);
assertIncludes(backlog, 'Automation health validator', backlogPath);
assertIncludes(backlog, 'Automation health prompt encoding guard', backlogPath);
assertIncludes(backlog, 'Automation health target-thread UUID guard', backlogPath);
assertIncludes(backlog, 'Automation health target-thread doc-link guard', backlogPath);
assertIncludes(backlog, '2 minutes', backlogPath);

console.log(JSON.stringify({
  status: 'passed',
  heartbeat: heartbeatPath,
  hourly: hourlyPath,
  target_thread_id: targetThreadId,
  target_thread_uuid_checked: true,
  target_thread_doc_links_checked: true,
  daily_work_mode_hook_checked: true,
  whitepaper_v1_3_heartbeat_binding_checked: true,
  mojibake_guard_checked: true,
  secret_guard_checked: true,
}, null, 2));
