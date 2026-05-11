import { readFileSync, existsSync } from 'node:fs';

function fail(message) {
  console.error(`SmartContractor PWA QA checklist failed: ${message}`);
  process.exit(1);
}

const requiredFiles = [
  '../docs/smartcontractor-pwa-qa-checklist.md',
  'public/smartcontractor.html',
  'public/manifest.webmanifest',
  'public/service-worker.js',
  'public/offline.html',
];

for (const file of requiredFiles) {
  if (!existsSync(file)) fail(`Missing required PWA QA file: ${file}`);
}

const checklist = readFileSync('../docs/smartcontractor-pwa-qa-checklist.md', 'utf8');
const requiredChecklistText = [
  'http://localhost:3002/smartcontractor.html',
  '390 x 844',
  '412 x 915',
  '360 x 740',
  'no horizontal scrolling',
  'Install app',
  'Add to Home Screen',
  'Offline Checks',
  'MVP Flow Checks On Phone Width',
  'Known MVP Limits',
  'Pass Criteria',
];

for (const text of requiredChecklistText) {
  if (!checklist.includes(text)) {
    fail(`PWA QA checklist must include: ${text}`);
  }
}

const manifest = JSON.parse(readFileSync('public/manifest.webmanifest', 'utf8'));
if (manifest.display !== 'standalone') {
  fail('PWA manifest display must remain standalone');
}
if (!Array.isArray(manifest.icons) || manifest.icons.length === 0) {
  fail('PWA manifest must include at least one icon');
}
if (!Array.isArray(manifest.shortcuts) || manifest.shortcuts.length < 3) {
  fail('PWA manifest must keep shortcuts for jobs, loans, and disputes');
}

const serviceWorker = readFileSync('public/service-worker.js', 'utf8');
for (const shellFile of ['/smartcontractor.html', '/offline.html', '/manifest.webmanifest', '/gcsc-logo.svg']) {
  if (!serviceWorker.includes(shellFile)) {
    fail(`Service worker must cache ${shellFile}`);
  }
}
if (!serviceWorker.includes("requestUrl.pathname.startsWith('/api/')")) {
  fail('Service worker must not cache API routes');
}
if (!serviceWorker.includes("caches.match('/offline.html')")) {
  fail('Service worker must fall back to offline.html for navigation failures');
}

const offline = readFileSync('public/offline.html', 'utf8');
if (!offline.includes('SmartContractor is offline') || !offline.includes('/smartcontractor.html')) {
  fail('Offline page must explain offline state and link back to SmartContractor');
}

console.log('SmartContractor PWA QA checklist passed.');
