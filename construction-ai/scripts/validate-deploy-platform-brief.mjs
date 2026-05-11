import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const briefPath = resolve('..', 'docs', 'smartcontractor-deploy-platform-decision-brief.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');

const brief = readFileSync(briefPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');

function fail(message) {
  console.error(`Deploy platform brief validation failed: ${message}`);
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

for (const section of [
  '## Recommendation',
  '## Founder Action',
  '## Platform Options',
  '## Safety Boundaries',
  '## Acceptance Check',
]) {
  assertIncludes(brief, section, briefPath);
}

for (const required of [
  'Use Vercel',
  'server-side API routes',
  'environment variables',
  'Supabase Auth redirect URLs',
  'Do not paste `SUPABASE_SERVICE_ROLE_KEY`',
  'payment providers in test or disabled mode',
]) {
  assertIncludes(brief, required, briefPath);
}

for (const blockedRisk of [
  'real contractor loans',
  'real escrow',
  'production payment provider mode',
  'automatic payment release',
  'token collateral locking',
  'USING true',
  'service-role keys in frontend',
]) {
  assertIncludes(brief, blockedRisk, briefPath);
}

assertIncludes(backlog, 'Deploy platform decision brief', backlogPath);
assertIncludes(backlog, 'Decide deploy platform', backlogPath);
assertIncludes(context, 'deploy-platform decision', contextPath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(brief),
  'Brief must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  brief: briefPath,
  safety_boundaries_checked: true,
}, null, 2));
