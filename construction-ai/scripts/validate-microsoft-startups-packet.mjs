import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const applicationPath = resolve('..', 'docs', 'microsoft-startups-application-draft.md');
const packetPath = resolve('..', 'docs', 'microsoft-startups-submission-packet.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const packagePath = resolve('package.json');

function fail(message) {
  console.error(`Microsoft Startups packet validation failed: ${message}`);
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

for (const path of [applicationPath, packetPath]) {
  assert(existsSync(path), `${path} must exist`);
}

const application = readFileSync(applicationPath, 'utf8');
const packet = readFileSync(packetPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');
const packageJson = readFileSync(packagePath, 'utf8');
const combined = `${application}\n${packet}`;

for (const section of [
  '## One-Line Summary',
  '## Problem',
  '## Solution',
  '## Why Microsoft Azure / AI Credits Matter',
  '## Current Progress',
  '## Technical Stack',
  '## AI Use Cases',
  '## Impact',
  '## Requested Support',
  '## Responsible Launch Note',
]) {
  assertIncludes(application, section, applicationPath);
}

for (const packetSection of [
  '## Current Microsoft Startup Paths',
  '## Best Application Position For GCSC',
  '## Application Assets Ready',
  '## Step-By-Step For Founder Later',
  '## Risks To Avoid In The Application',
  '## Recommended Next Move',
]) {
  assertIncludes(packet, packetSection, packetPath);
}

for (const projectTerm of [
  'SmartContractor',
  'xprnet.org',
  'gcsc@xprnet.org',
  'homeowners',
  'contractors',
  'milestone payments',
  'working-capital loans',
  'dispute evidence',
  'peer review',
  'Azure AI',
  'Azure OpenAI',
  'Supabase',
  'GitHub Actions',
]) {
  assertIncludes(combined, projectTerm, 'Microsoft Startups packet');
}

for (const safetyTerm of [
  'Do not lead with token price',
  'Do not promise guaranteed token price growth',
  'Do not say real loans are already live',
  'Do not upload private keys or secret files',
  'attorney review',
]) {
  assertIncludes(packet, safetyTerm, packetPath);
}

assertIncludes(backlog, 'Microsoft/Azure application validator', backlogPath);
assertIncludes(context, 'Microsoft/Azure application validator', contextPath);
assertIncludes(packageJson, 'check:microsoft-startups', packagePath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]/i.test(combined),
  'Microsoft Startups packet must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  application: applicationPath,
  packet: packetPath,
  safety_boundaries_checked: true,
}, null, 2));
