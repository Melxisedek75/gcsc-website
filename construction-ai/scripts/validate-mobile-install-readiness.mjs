import { readFileSync } from 'node:fs';

function fail(message) {
  console.error(`Mobile install readiness validation failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

const server = readFileSync('server.js', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
const context = readFileSync('../docs/gcsc-active-context.md', 'utf8');
const backlog = readFileSync('../docs/smartcontractor-backlog.md', 'utf8');

for (const snippet of [
  "app.get('/api/admin/mobile-install-readiness'",
  'manifest.webmanifest',
  'service-worker.js',
  'offline.html',
  'gcsc-logo.svg',
  'requestUrl.pathname.startsWith',
  'next_safe_step',
  'blocked_until_founder',
  'mobile-install-readiness',
]) {
  assert(server.includes(snippet), `server.js must include: ${snippet}`);
}

assert(
  packageJson.scripts?.['check:mobile-install-readiness'] === 'node scripts/validate-mobile-install-readiness.mjs',
  'package.json must define check:mobile-install-readiness'
);
assert(
  packageJson.scripts?.check === 'node scripts/run-checks.mjs',
  'npm run check must use scripts/run-checks.mjs'
);
assert(
  readFileSync('scripts/run-checks.mjs', 'utf8').includes('check:mobile-install-readiness'),
  'run-checks.mjs must include check:mobile-install-readiness'
);

assert(context.includes('mobile install readiness endpoint'), 'active context must mention mobile install readiness endpoint');
assert(backlog.includes('Mobile install readiness endpoint'), 'backlog must include Mobile install readiness endpoint');

console.log(JSON.stringify({
  status: 'passed',
  endpoint: '/api/admin/mobile-install-readiness',
  safety_boundaries_checked: true,
}, null, 2));
