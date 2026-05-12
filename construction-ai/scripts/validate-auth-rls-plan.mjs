import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const planPath = resolve('..', 'docs', 'smartcontractor-auth-rls-plan.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const packagePath = resolve('package.json');

function fail(message) {
  console.error(`Auth/RLS plan validation failed: ${message}`);
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

assert(existsSync(planPath), `${planPath} must exist`);

const plan = readFileSync(planPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');
const packageJson = readFileSync(packagePath, 'utf8');

for (const section of [
  '## Recommendation',
  '## Production Access Model',
  '## Identity Binding',
  '## RLS Policy Goals',
  '## Tables That Should Be Backend-Only',
  '## Required Backend Changes Before Applying Strict RLS',
  '## Founder Decision',
  '## Profile Ownership Binding Draft',
  '## Role Ownership Guards',
  '## Auth Smoke-Test Harness',
  '## Supabase Service-Role Boundary',
  '## Admin Role Model',
  '## Admin Enforcement Scaffold',
]) {
  assertIncludes(plan, section, planPath);
}

for (const required of [
  'Use Supabase Auth with email magic link',
  'SUPABASE_PUBLISHABLE_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'The browser must never receive',
  'profiles.auth_user_id',
  'auth.users.id = profiles.auth_user_id',
  'Anonymous users should only be able to',
  'Authenticated Homeowner',
  'Authenticated Contractor',
  'Admin and system actions should go through the backend service role',
  'payment_events',
  'audit_events',
  'BLOCKED until founder/deployment secret setup',
  'founder approval',
  'SMARTCONTRACTOR_ROUTE_PROTECTION=draft|strict',
  'SMARTCONTRACTOR_ADMIN_ENFORCEMENT_MODE=strict',
]) {
  assertIncludes(plan, required, planPath);
}

assertIncludes(backlog, 'Auth/RLS plan validator', backlogPath);
assertIncludes(context, 'Auth/RLS plan validator', contextPath);
assertIncludes(packageJson, 'check:auth-rls-plan', packagePath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]/i.test(plan),
  'Auth/RLS plan must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  plan: planPath,
  safety_boundaries_checked: true,
}, null, 2));
