import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const serverSource = readFileSync('server.js', 'utf8');

function fail(message) {
  console.error(`Auth ownership smoke failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function assertSourceIncludes(snippet, message) {
  assert(serverSource.includes(snippet), message || `Missing server snippet: ${snippet}`);
}

async function readJson(response) {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

async function request(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  return {
    status: response.status,
    body: await readJson(response),
  };
}

function checkStaticGuardCoverage() {
  const requiredSnippets = [
    "app.get('/api/auth/session-check'",
    "app.get('/api/auth/profile'",
    'getAuthenticatedUser',
    'getOptionalAuthenticatedUser',
    'assertOwnedProfile',
    'assertOwnedRoleRecord',
    'rejectOwnership',
    'adminRoleModel',
    "app.get('/api/admin/access-model'",
    'supabaseAuth',
    'supabaseAdmin',
    "app.get('/api/admin/supabase-boundary'",
    "assertOwnedProfile(req, profile_id)",
    "assertOwnedRoleRecord(req, 'homeowners', homeowner_id, 'homeowner_id')",
    "assertOwnedRoleRecord(req, 'contractors', contractor_id, 'contractor_id')",
    "assertOwnedRoleRecord(req, 'contractors', reviewer_contractor_id, 'reviewer_contractor_id')",
    'role-ownership-guards',
  ];

  for (const snippet of requiredSnippets) {
    assertSourceIncludes(snippet);
  }
}

async function runOptionalRealSessionChecks(baseUrl) {
  const token = process.env.SMARTCONTRACTOR_SMOKE_ACCESS_TOKEN;
  if (!token) {
    return {
      skipped: true,
      reason: 'SMARTCONTRACTOR_SMOKE_ACCESS_TOKEN is not set',
    };
  }

  const headers = { Authorization: `Bearer ${token}` };
  const checks = [];

  const session = await request(baseUrl, '/api/auth/session-check', { headers });
  assert(session.status === 200, `Expected session-check with token to return 200, got ${session.status}`);
  checks.push({ name: 'session-check-token', status: session.status });

  const profile = await request(baseUrl, '/api/auth/profile', { headers });
  assert(profile.status === 200, `Expected auth/profile with token to return 200, got ${profile.status}`);
  checks.push({ name: 'auth-profile-token', status: profile.status, has_profile: Boolean(profile.body?.profile) });

  const foreignHomeownerId = process.env.SMARTCONTRACTOR_SMOKE_FOREIGN_HOMEOWNER_ID;
  if (foreignHomeownerId) {
    const blockedJob = await request(baseUrl, '/api/smartcontractor/jobs', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        homeowner_id: foreignHomeownerId,
        title: 'Smoke blocked job',
        description: 'This should be blocked by role ownership guards.',
        trade: 'smoke',
        location_city: 'Seattle',
        location_state: 'WA',
        location_zip: '98101',
        budget_min_usd: 1,
        budget_max_usd: 2,
      }),
    });
    assert(blockedJob.status === 403, `Expected wrong homeowner_id job create to return 403, got ${blockedJob.status}`);
    checks.push({ name: 'wrong-homeowner-blocked', status: blockedJob.status });
  }

  const foreignContractorId = process.env.SMARTCONTRACTOR_SMOKE_FOREIGN_CONTRACTOR_ID;
  if (foreignContractorId) {
    const blockedLoan = await request(baseUrl, '/api/smartcontractor/loans', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        contractor_id: foreignContractorId,
        principal_usd: 100,
        purpose: 'Smoke blocked loan',
      }),
    });
    assert(blockedLoan.status === 403, `Expected wrong contractor_id loan request to return 403, got ${blockedLoan.status}`);
    checks.push({ name: 'wrong-contractor-blocked', status: blockedLoan.status });
  }

  return {
    skipped: false,
    checks,
    optional_wrong_owner_checks: {
      foreign_homeowner_id_configured: Boolean(foreignHomeownerId),
      foreign_contractor_id_configured: Boolean(foreignContractorId),
    },
  };
}

checkStaticGuardCoverage();

process.env.VERCEL = '1';
const app = require('../server.js');
const server = app.listen(0);

try {
  await new Promise((resolve) => server.once('listening', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  const health = await request(baseUrl, '/api/health');
  assert(health.status === 200, `Expected /api/health 200, got ${health.status}`);
  assert(health.body?.features?.includes('auth-implementation-scaffold'), 'Health must advertise auth-implementation-scaffold');
  assert(health.body?.features?.includes('profile-ownership-binding'), 'Health must advertise profile-ownership-binding');
  assert(health.body?.features?.includes('role-ownership-guards'), 'Health must advertise role-ownership-guards');
  assert(health.body?.features?.includes('admin-role-model'), 'Health must advertise admin-role-model');
  assert(health.body?.features?.includes('supabase-service-role-boundary'), 'Health must advertise supabase-service-role-boundary');

  const accessModel = await request(baseUrl, '/api/admin/access-model');
  assert(accessModel.status === 200, `Expected admin/access-model 200, got ${accessModel.status}`);
  assert(Array.isArray(accessModel.body?.roles), 'Admin access model must return roles');
  assert(accessModel.body.roles.some((role) => role.role === 'founder'), 'Admin access model must include founder role');

  const boundary = await request(baseUrl, '/api/admin/supabase-boundary');
  assert(boundary.status === 200, `Expected supabase-boundary 200, got ${boundary.status}`);
  assert(boundary.body?.status?.service_role, 'Boundary endpoint must return service_role status without secret values');

  const sessionNoToken = await request(baseUrl, '/api/auth/session-check');
  assert(sessionNoToken.status === 401, `Expected session-check without token to return 401, got ${sessionNoToken.status}`);

  const profileNoToken = await request(baseUrl, '/api/auth/profile');
  assert(profileNoToken.status === 401, `Expected auth/profile without token to return 401, got ${profileNoToken.status}`);

  const invalidMagicLink = await request(baseUrl, '/api/auth/magic-link', {
    method: 'POST',
    body: JSON.stringify({
      email: 'not-an-email',
      redirect_to: 'http://localhost:3002/smartcontractor.html',
    }),
  });
  assert(
    invalidMagicLink.status === 400 || invalidMagicLink.status === 503,
    `Expected invalid magic-link request to return 400 or 503 when Supabase is not configured, got ${invalidMagicLink.status}`
  );

  const optionalRealSession = await runOptionalRealSessionChecks(baseUrl);

  console.log(JSON.stringify({
    status: 'passed',
    static_guard_coverage: 'passed',
    basic_endpoint_checks: {
      health: health.status,
      session_without_token: sessionNoToken.status,
      profile_without_token: profileNoToken.status,
      invalid_magic_link: invalidMagicLink.status,
      admin_access_model: accessModel.status,
      supabase_boundary: boundary.status,
    },
    optional_real_session: optionalRealSession,
  }, null, 2));
} finally {
  server.close();
}
