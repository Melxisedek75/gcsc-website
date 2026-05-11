import { readFileSync, existsSync } from 'node:fs';

function fail(message) {
  console.error(`Android QA runbook validation failed: ${message}`);
  process.exit(1);
}

function read(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

const runbook = read('../docs/smartcontractor-android-qa-runbook.md');
const backlog = read('../docs/smartcontractor-backlog.md');
const activeContext = read('../docs/gcsc-active-context.md');

const requiredRunbookSnippets = [
  'local developer QA only',
  'npm run check:android-preflight',
  'npm run check:android-qa',
  'Google Play Console upload',
  'signing release builds with production keys',
  'live Supabase migrations',
  'real payment provider production mode',
  'real lending',
  'real payment',
  'real loan',
  'real escrow',
  'token collateral',
  'service-role keys',
  'private keys',
  'Founder Action Step',
  'Do not install system-level SDKs',
];

for (const snippet of requiredRunbookSnippets) {
  if (!runbook.includes(snippet)) {
    fail(`Runbook must include: ${snippet}`);
  }
}

const forbiddenPatterns = [
  /SUPABASE_SERVICE_ROLE_KEY\s*=\s*[^<\s]/,
  /STRIPE_SECRET_KEY\s*=\s*[^<\s]/,
  /METAL_PAY_CONNECT_API_KEY\s*=\s*[^<\s]/,
  /seed phrase\s*:/i,
  /private key\s*:/i,
  /password\s*:/i,
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(runbook)) {
    fail(`Runbook contains forbidden secret-like assignment: ${pattern}`);
  }
}

if (!backlog.includes('Android QA runbook validator')) {
  fail('Backlog must record the Android QA runbook validator');
}

if (!activeContext.includes('Android QA runbook validator')) {
  fail('Active context must record the Android QA runbook validator');
}

console.log('SmartContractor Android QA runbook validation passed.');
