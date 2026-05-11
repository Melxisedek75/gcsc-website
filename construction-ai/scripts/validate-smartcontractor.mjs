import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';

const requiredFiles = [
  'server.js',
  'public/smartcontractor.html',
  'public/manifest.webmanifest',
  'public/service-worker.js',
  'public/offline.html',
  'scripts/smoke-auth-ownership.mjs',
  '../docs/gcsc-target-architecture.md',
  '../docs/smartcontractor-api.md',
  '../docs/smartcontractor-admin-enforcement-scaffold.md',
  '../docs/smartcontractor-founder-action-center.md',
  '../docs/smartcontractor-admin-role-model.md',
  '../docs/smartcontractor-admin-role-model-draft.sql',
  '../docs/smartcontractor-auth-smoke-tests.md',
  '../docs/smartcontractor-auth-decision-package.md',
  '../docs/smartcontractor-auth-rls-plan.md',
  '../docs/smartcontractor-backlog.md',
  '../docs/smartcontractor-profile-ownership-draft.sql',
  '../docs/smartcontractor-role-ownership-guards.md',
  '../docs/smartcontractor-supabase-service-role-boundary.md',
  '../docs/smartcontractor-pwa-qa-checklist.md',
  '../docs/smartcontractor-ai-agent-workflows.md',
];

function fail(message) {
  console.error(`SmartContractor check failed: ${message}`);
  process.exit(1);
}

for (const file of requiredFiles) {
  if (!existsSync(file)) fail(`Missing required file: ${file}`);
}

execFileSync(process.execPath, ['--check', 'server.js'], { stdio: 'inherit' });
execFileSync(process.execPath, ['--check', 'public/service-worker.js'], { stdio: 'inherit' });
execFileSync(process.execPath, ['--check', 'scripts/smoke-auth-ownership.mjs'], { stdio: 'inherit' });

const html = readFileSync('public/smartcontractor.html', 'utf8');
if (!html.includes('<link rel="manifest" href="/manifest.webmanifest">')) {
  fail('smartcontractor.html must link the PWA manifest');
}
if (!html.includes('navigator.serviceWorker.register')) {
  fail('smartcontractor.html must register the service worker');
}
if (html.includes('SUPABASE_SERVICE_ROLE_KEY')) {
  fail('public HTML must not mention SUPABASE_SERVICE_ROLE_KEY');
}
if (!html.includes('data-tab="admin"') || !html.includes('loadAdminConsole')) {
  fail('smartcontractor.html must include the Admin / Risk Console tab and loader');
}
if (!html.includes('adminRiskFilter') || !html.includes('saveAdminDraftNote') || !html.includes('gcsc-admin-drafts')) {
  fail('Admin / Risk Console must include filters, local draft notes, and draft persistence');
}
if (!html.includes('loadLaunchReadiness') || !html.includes('launchReadinessGrid')) {
  fail('smartcontractor.html must include the Production Readiness Gate UI');
}
if (!html.includes('loadAuthReadiness') || !html.includes('authReadinessGrid')) {
  fail('smartcontractor.html must include the Auth Decision Package UI');
}
if (!html.includes('loadFounderActionCenter') || !html.includes('founderActionGrid')) {
  fail('smartcontractor.html must include the Founder Action Center UI');
}
if (!html.includes('sendMagicLink') || !html.includes('checkAuthSession') || !html.includes('gcsc-auth-access-token')) {
  fail('smartcontractor.html must include Magic Link request, session check, and local token capture scaffold');
}
if (!html.includes('checkLinkedProfile') || !html.includes('Check Linked Profile')) {
  fail('smartcontractor.html must include linked profile ownership check UI');
}

const inlineScripts = [...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)];
if (inlineScripts.length === 0) {
  fail('No inline scripts found in public/smartcontractor.html');
}
inlineScripts.forEach((match, index) => {
  new vm.Script(match[1], {
    filename: `public/smartcontractor.html:inline-script-${index + 1}.js`,
  });
});

const manifest = JSON.parse(readFileSync('public/manifest.webmanifest', 'utf8'));
const requiredManifestFields = ['name', 'short_name', 'id', 'start_url', 'scope', 'display', 'icons'];
for (const field of requiredManifestFields) {
  if (!manifest[field]) fail(`Manifest is missing required field: ${field}`);
}
if (manifest.display !== 'standalone') {
  fail('Manifest display must be standalone for PWA install flow');
}
if (!Array.isArray(manifest.icons) || manifest.icons.length === 0) {
  fail('Manifest must define at least one icon');
}
if (!Array.isArray(manifest.shortcuts) || manifest.shortcuts.length < 3) {
  fail('Manifest should include shortcuts for jobs, loans, and disputes');
}

const serviceWorker = readFileSync('public/service-worker.js', 'utf8');
if (!serviceWorker.includes('/offline.html')) {
  fail('service-worker.js must cache offline.html');
}
if (!serviceWorker.includes("requestUrl.pathname.startsWith('/api/')")) {
  fail('service-worker.js must keep API requests network-only');
}

const offline = readFileSync('public/offline.html', 'utf8');
if (!offline.includes('SmartContractor is offline')) {
  fail('offline.html must include a clear offline message');
}

const server = readFileSync('server.js', 'utf8');
const authSmoke = readFileSync('scripts/smoke-auth-ownership.mjs', 'utf8');
if (!server.includes("app.get('/api/admin/risk-console'")) {
  fail('server.js must expose /api/admin/risk-console for founder risk review');
}
if (!server.includes('admin-risk-console')) {
  fail('health check must advertise admin-risk-console');
}
if (!server.includes("app.get('/api/admin/access-model'") || !server.includes('adminRoleModel') || !server.includes('adminProtectedSurfaces')) {
  fail('server.js must expose the Admin role model endpoint and model data');
}
if (!server.includes('admin-role-model')) {
  fail('health check must advertise admin-role-model');
}
if (!server.includes('getAdminAccess') || !server.includes('requireAdminPermissions') || !server.includes("app.get('/api/admin/me'")) {
  fail('server.js must include admin enforcement helper and /api/admin/me endpoint');
}
if (!server.includes('admin-enforcement-scaffold')) {
  fail('health check must advertise admin-enforcement-scaffold');
}
if (!server.includes("app.get('/api/admin/launch-readiness'")) {
  fail('server.js must expose /api/admin/launch-readiness for production preflight');
}
if (!server.includes('launch-readiness-gate')) {
  fail('health check must advertise launch-readiness-gate');
}
if (!server.includes("app.get('/api/admin/auth-readiness'")) {
  fail('server.js must expose /api/admin/auth-readiness for auth decision planning');
}
if (!server.includes('auth-decision-package')) {
  fail('health check must advertise auth-decision-package');
}
if (!server.includes("app.get('/api/admin/founder-action-center'") || !server.includes('founderActionItems')) {
  fail('server.js must expose the Founder Action Center endpoint and action model');
}
if (!server.includes('founder-action-center')) {
  fail('health check must advertise founder-action-center');
}
if (!server.includes("app.post('/api/auth/magic-link'") || !server.includes("app.get('/api/auth/session-check'") || !server.includes('getAuthenticatedUser')) {
  fail('server.js must expose auth implementation scaffold endpoints and token verification helper');
}
if (!server.includes('const authLimiter = rateLimit') || !server.includes("app.post('/api/auth/magic-link', authLimiter")) {
  fail('server.js must rate limit Magic Link auth requests');
}
if (!server.includes('auth-implementation-scaffold')) {
  fail('health check must advertise auth-implementation-scaffold');
}
if (!server.includes("app.get('/api/auth/profile'") || !server.includes('auth_user_id') || !server.includes('getOptionalAuthenticatedUser')) {
  fail('server.js must expose profile ownership binding scaffold');
}
if (!server.includes('profile-ownership-binding')) {
  fail('health check must advertise profile-ownership-binding');
}
if (!server.includes('assertOwnedRoleRecord') || !server.includes('assertOwnedProfile') || !server.includes('role-ownership-guards')) {
  fail('server.js must include role ownership guards and advertise them in health');
}
if (!server.includes('supabaseAuth') || !server.includes('supabaseAdmin') || !server.includes("app.get('/api/admin/supabase-boundary'")) {
  fail('server.js must separate Supabase auth/admin clients and expose the boundary endpoint');
}
if (!server.includes('supabase-service-role-boundary')) {
  fail('health check must advertise supabase-service-role-boundary');
}
for (const header of ['X-Content-Type-Options', 'X-Frame-Options', 'Referrer-Policy', 'Permissions-Policy']) {
  if (!server.includes(header)) {
    fail(`server.js must set ${header} security header`);
  }
}
if (!server.includes('X-Request-Id') || !server.includes('crypto.randomUUID') || !server.includes('req.id')) {
  fail('server.js must set and reuse X-Request-Id for traceable requests');
}
if (!authSmoke.includes('SMARTCONTRACTOR_SMOKE_ACCESS_TOKEN') || !authSmoke.includes('wrong-homeowner-blocked') || !authSmoke.includes('wrong-contractor-blocked')) {
  fail('auth smoke harness must support optional real-token and wrong-owner checks');
}
if (!authSmoke.includes('request_id_header') || !authSmoke.includes('gcsc-smoke-request-123')) {
  fail('auth smoke harness must verify X-Request-Id response behavior');
}
if (!authSmoke.includes('magic_link_rate_limit') || !authSmoke.includes('limitedMagicLink.status === 429')) {
  fail('auth smoke harness must verify Magic Link rate limiting behavior');
}

console.log('SmartContractor validation passed.');
