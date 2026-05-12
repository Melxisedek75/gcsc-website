import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const onePagerPath = resolve('..', 'docs', 'smartcontractor-founder-one-pager.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const packagePath = resolve('package.json');

function fail(message) {
  console.error(`Founder one-pager validation failed: ${message}`);
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

assert(existsSync(onePagerPath), `${onePagerPath} must exist`);

const onePager = readFileSync(onePagerPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');
const packageJson = readFileSync(packagePath, 'utf8');

for (const section of [
  '## One-Line Summary',
  '## Problem',
  '## Product',
  '## Why It Matters',
  '## Current MVP Progress',
  '## Technology Stack',
  '## Business Model',
  '## Differentiation',
  '## Responsible Launch Position',
  '## Ask',
  '## Founder Note',
]) {
  assertIncludes(onePager, section, onePagerPath);
}

for (const missionTerm of [
  'verified contractors',
  'open bidding',
  'milestone payments',
  'working-capital loans',
  'dispute review',
  'AI agents',
  'XPR Network',
  'Supabase',
  'Metal Pay',
  'public launch',
  'attorney',
]) {
  assertIncludes(onePager, missionTerm, onePagerPath);
}

for (const safetyTerm of [
  'not yet for real lending',
  'production payments',
  'server-side only',
  'avoid real personal documents',
]) {
  assertIncludes(onePager, safetyTerm, onePagerPath);
}

assertIncludes(backlog, 'Founder one-pager validator', backlogPath);
assertIncludes(context, 'Founder one-pager validator', contextPath);
assertIncludes(packageJson, 'check:founder-one-pager', packagePath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]/i.test(onePager),
  'Founder one-pager must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  one_pager: onePagerPath,
  safety_boundaries_checked: true,
}, null, 2));
