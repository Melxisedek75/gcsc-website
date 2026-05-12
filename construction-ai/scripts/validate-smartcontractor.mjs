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
if (!html.includes('loadBetaReadiness') || !html.includes('betaReadinessGrid') || !html.includes('/api/admin/beta-readiness')) {
  fail('smartcontractor.html must include the Controlled Beta Readiness UI');
}
if (!html.includes('Next Safe Steps') || !html.includes('data.next_safe_steps')) {
  fail('Controlled Beta Readiness UI must show next_safe_steps from the backend');
}
if (!html.includes('Required Beta Documents') || !html.includes('data.required_docs.map')) {
  fail('Controlled Beta Readiness UI must show required_docs status from the backend');
}
if (!html.includes('${doc.id}: ${doc.status} (${doc.file})')) {
  fail('Controlled Beta Readiness UI must show required_docs file paths, not only IDs');
}
if (!html.includes('data.document_summary') || !html.includes('data.missing_docs') || !html.includes('Missing docs')) {
  fail('Controlled Beta Readiness UI must show backend document_summary and missing_docs state');
}
if (!html.includes('Validation Commands') || !html.includes('data.validation_commands')) {
  fail('Controlled Beta Readiness UI must show backend validation_commands');
}
if (!html.includes('Safe Report Back') || !html.includes('data.report_back_template')) {
  fail('Controlled Beta Readiness UI must show backend report_back_template');
}
if (!html.includes('Safe Report Fields') || !html.includes('data.safe_report_fields')) {
  fail('Controlled Beta Readiness UI must show backend safe_report_fields');
}
if (!html.includes('Go/No-Go Rules') || !html.includes('data.go_no_go_rules')) {
  fail('Controlled Beta Readiness UI must show backend go_no_go_rules');
}
if (!html.includes('Tester Day Checklist') || !html.includes('data.tester_day_checklist')) {
  fail('Controlled Beta Readiness UI must show backend tester_day_checklist');
}
if (!html.includes('Issue Intake Fields') || !html.includes('data.issue_intake_fields')) {
  fail('Controlled Beta Readiness UI must show backend issue_intake_fields');
}
if (!html.includes('Evidence Retention Policy') || !html.includes('data.evidence_retention_policy')) {
  fail('Controlled Beta Readiness UI must show backend evidence_retention_policy');
}
if (!html.includes('Tester Handoff Packet') || !html.includes('data.tester_handoff_packet')) {
  fail('Controlled Beta Readiness UI must show backend tester_handoff_packet');
}
if (!html.includes('Session Stop Conditions') || !html.includes('data.session_stop_conditions')) {
  fail('Controlled Beta Readiness UI must show backend session_stop_conditions');
}
if (!html.includes('Post-Session Actions') || !html.includes('data.post_session_actions')) {
  fail('Controlled Beta Readiness UI must show backend post_session_actions');
}
if (!html.includes('Public Beta Exit Criteria') || !html.includes('data.public_beta_exit_criteria')) {
  fail('Controlled Beta Readiness UI must show backend public_beta_exit_criteria');
}
if (!html.includes('Pre-Invite Checks') || !html.includes('data.pre_invite_checks')) {
  fail('Controlled Beta Readiness UI must show backend pre_invite_checks');
}
if (!html.includes('Invite Message Checklist') || !html.includes('data.invite_message_checklist')) {
  fail('Controlled Beta Readiness UI must show backend invite_message_checklist');
}
if (!html.includes('Tester Consent Checklist') || !html.includes('data.tester_consent_checklist')) {
  fail('Controlled Beta Readiness UI must show backend tester_consent_checklist');
}
if (!html.includes('Tester Role Briefing') || !html.includes('data.tester_role_briefing')) {
  fail('Controlled Beta Readiness UI must show backend tester_role_briefing');
}
if (!html.includes('Tester Success Signals') || !html.includes('data.tester_success_signals')) {
  fail('Controlled Beta Readiness UI must show backend tester_success_signals');
}
if (!html.includes('Tester Failure Signals') || !html.includes('data.tester_failure_signals')) {
  fail('Controlled Beta Readiness UI must show backend tester_failure_signals');
}
if (!html.includes('Tester Redaction Reminders') || !html.includes('data.tester_redaction_reminders')) {
  fail('Controlled Beta Readiness UI must show backend tester_redaction_reminders');
}
if (!html.includes('Tester Artifact Naming') || !html.includes('data.tester_artifact_naming')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_naming');
}
if (!html.includes('Tester Artifact Index') || !html.includes('data.tester_artifact_index')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_index');
}
if (!html.includes('Tester Artifact Review Queue') || !html.includes('data.tester_artifact_review_queue')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_review_queue');
}
if (!html.includes('Tester Artifact Export Guard') || !html.includes('data.tester_artifact_export_guard')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_export_guard');
}
if (!html.includes('Tester Artifact Purge Policy') || !html.includes('data.tester_artifact_purge_policy')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_purge_policy');
}
if (!html.includes('Tester Artifact Retention Clock') || !html.includes('data.tester_artifact_retention_clock')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_retention_clock');
}
if (!html.includes('Tester Artifact Disposal Ledger') || !html.includes('data.tester_artifact_disposal_ledger')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_disposal_ledger');
}
if (!html.includes('Tester Artifact Access Roles') || !html.includes('data.tester_artifact_access_roles')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_access_roles');
}
if (!html.includes('Tester Artifact Chain Of Custody') || !html.includes('data.tester_artifact_chain_of_custody')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_chain_of_custody');
}
if (!html.includes('Tester Artifact Public Summary Rules') || !html.includes('data.tester_artifact_public_summary_rules')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_public_summary_rules');
}
if (!html.includes('Tester Artifact Anonymization Checklist') || !html.includes('data.tester_artifact_anonymization_checklist')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_anonymization_checklist');
}
if (!html.includes('Tester Artifact Approval Stamp') || !html.includes('data.tester_artifact_approval_stamp')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_approval_stamp');
}
if (!html.includes('Tester Artifact Revocation Rules') || !html.includes('data.tester_artifact_revocation_rules')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_revocation_rules');
}
if (!html.includes('Tester Artifact External Packet Manifest') || !html.includes('data.tester_artifact_external_packet_manifest')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_external_packet_manifest');
}
if (!html.includes('Tester Artifact External Packet Distribution Log') || !html.includes('data.tester_artifact_external_packet_distribution_log')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_external_packet_distribution_log');
}
if (!html.includes('Tester Artifact External Packet Recall Checklist') || !html.includes('data.tester_artifact_external_packet_recall_checklist')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_external_packet_recall_checklist');
}
if (!html.includes('Founder Review Packet') || !html.includes('data.review_packet')) {
  fail('Controlled Beta Readiness UI must show backend review_packet');
}
if (!html.includes('Founder Present Tasks') || !html.includes('data.founder_present_tasks')) {
  fail('Controlled Beta Readiness UI must show backend founder_present_tasks');
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
if (!server.includes('auth-magic-link-rate-limit')) {
  fail('health check must advertise auth-magic-link-rate-limit');
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
if (!server.includes('Invalid JSON body') || !server.includes("err instanceof SyntaxError")) {
  fail('server.js must return a clear 400 error for invalid JSON bodies');
}
if (!server.includes("app.use('/api'") || !server.includes('API route not found')) {
  fail('server.js must return a JSON 404 for unknown API routes');
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
if (!authSmoke.includes('invalid_json_body') || !authSmoke.includes('Invalid JSON body')) {
  fail('auth smoke harness must verify invalid JSON body handling');
}
if (!authSmoke.includes('missing_api_route') || !authSmoke.includes('API route not found')) {
  fail('auth smoke harness must verify unknown API route handling');
}

console.log('SmartContractor validation passed.');
