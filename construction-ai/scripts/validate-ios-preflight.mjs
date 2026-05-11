import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-ios-preflight.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const roadmapPath = resolve('..', 'docs', 'smartcontractor-mobile-roadmap.md');

function fail(message) {
  console.error(`iOS preflight validation failed: ${message}`);
  process.exit(1);
}

function read(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.includes(snippet)) {
    fail(`${file} must include: ${snippet}`);
  }
}

const doc = read(docPath);
const backlog = read(backlogPath);
const context = read(contextPath);
const roadmap = read(roadmapPath);

for (const section of [
  '## What This Allows',
  '## Required Local State',
  '## Local Checks Before iOS Wrapper Work',
  '## Founder-Controlled Inputs Needed Later',
  '## Safe Command Boundary',
  '## Current Decision',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'com.gcsc.smartcontractor',
  'SmartContractor',
  'webDir: public',
  'npm run check:mobile',
  'npm run check:pwa-qa',
  'Apple Developer Program',
  'App Store Connect',
  'Apple Team ID',
  'npx cap add ios',
  'npx cap sync ios',
  'Do not run `npx cap open ios` on Windows',
]) {
  assertIncludes(doc, required, docPath);
}

for (const blockedRisk of [
  'real payments',
  'loans',
  'escrow',
  'token collateral',
  'live Supabase data',
  'production deployment settings',
  'service-role keys',
]) {
  assertIncludes(doc, blockedRisk, docPath);
}

const forbiddenPatterns = [
  /SUPABASE_SERVICE_ROLE_KEY\s*=\s*[^<\s]/,
  /APPLE_TEAM_ID\s*=\s*[A-Z0-9]{10}/,
  /APP_STORE_CONNECT_API_KEY\s*=\s*[^<\s]/,
  /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
  /password\s*:/i,
  /seed phrase\s*:/i,
  /private key\s*:/i,
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc)) {
    fail(`iOS preflight doc contains forbidden secret-like value: ${pattern}`);
  }
}

assertIncludes(backlog, 'iOS preflight validator', backlogPath);
assertIncludes(context, 'iOS preflight validator', contextPath);
assertIncludes(roadmap, 'npm run check:ios-preflight', roadmapPath);

console.log(JSON.stringify({
  status: 'passed',
  document: docPath,
  safety_boundaries_checked: true,
}, null, 2));
