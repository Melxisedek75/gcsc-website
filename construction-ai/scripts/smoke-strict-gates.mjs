import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

function fail(message) {
  console.error(`Strict gate smoke failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
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
    headers: response.headers,
    body: await readJson(response),
  };
}

function assertClosedWithoutToken(result, path, requestId) {
  assert(
    [401, 403, 503].includes(result.status),
    `Expected ${path} to be closed without token in strict mode, got ${result.status}`
  );
  assert(
    result.headers.get('x-request-id') === requestId,
    `Expected ${path} strict gate to echo safe X-Request-Id header`
  );
  assert(
    result.body?.request_id === requestId,
    `Expected ${path} strict gate to include request_id in the response body`
  );
}

async function runOptionalRealTokenChecks(baseUrl) {
  const token = process.env.SMARTCONTRACTOR_SMOKE_ACCESS_TOKEN;
  if (!token) {
    return {
      skipped: true,
      reason: 'SMARTCONTRACTOR_SMOKE_ACCESS_TOKEN is not set',
    };
  }

  const headers = { Authorization: `Bearer ${token}` };
  const session = await request(baseUrl, '/api/auth/session-check', { headers });
  assert(session.status === 200, `Expected session-check with token to return 200, got ${session.status}`);

  const founderSetup = await request(baseUrl, '/api/admin/founder-auth-setup', { headers });
  assert(founderSetup.status === 200, `Expected founder-auth-setup with token to return 200, got ${founderSetup.status}`);
  assert(
    founderSetup.body?.current_session?.authenticated === true,
    'Founder Auth Setup must report authenticated=true when a valid smoke access token is provided'
  );

  const adminMe = await request(baseUrl, '/api/admin/me', { headers });
  const expectedAdminStatus = process.env.SMARTCONTRACTOR_SMOKE_EXPECT_FOUNDER === '1' ? 200 : [401, 403, 503];
  if (expectedAdminStatus === 200) {
    assert(adminMe.status === 200, `Expected admin/me with founder token to return 200, got ${adminMe.status}`);
    assert(
      adminMe.body?.access?.active_roles?.includes('founder'),
      'Expected founder token to include active founder role'
    );
  } else {
    assert(
      expectedAdminStatus.includes(adminMe.status),
      `Expected admin/me without founder expectation to stay closed or unavailable, got ${adminMe.status}`
    );
  }

  return {
    skipped: false,
    session_check: session.status,
    founder_auth_setup: founderSetup.status,
    founder_authenticated: founderSetup.body?.current_session?.authenticated === true,
    profile_linked: founderSetup.body?.current_session?.profile_linked === true,
    admin_me: adminMe.status,
    founder_expected: process.env.SMARTCONTRACTOR_SMOKE_EXPECT_FOUNDER === '1',
  };
}

process.env.VERCEL = '1';
process.env.SMARTCONTRACTOR_ROUTE_PROTECTION = 'strict';
process.env.SMARTCONTRACTOR_ADMIN_ENFORCEMENT_MODE = 'strict';

const app = require('../server.js');
const server = app.listen(0);

try {
  await new Promise((resolve) => server.once('listening', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  const protectionStatus = await request(baseUrl, '/api/auth/protection-status');
  assert(protectionStatus.status === 200, `Expected auth/protection-status 200, got ${protectionStatus.status}`);
  assert(protectionStatus.body?.mode === 'strict', 'Route protection mode must be strict in this smoke test');
  assert(protectionStatus.body?.enforced === true, 'Route protection must be enforced in this smoke test');

  const jobs = await request(baseUrl, '/api/smartcontractor/jobs', {
    headers: { 'X-Request-Id': 'gcsc-strict-jobs-smoke' },
  });
  assertClosedWithoutToken(jobs, '/api/smartcontractor/jobs', 'gcsc-strict-jobs-smoke');

  const riskConsole = await request(baseUrl, '/api/admin/risk-console', {
    headers: { 'X-Request-Id': 'gcsc-strict-risk-console-smoke' },
  });
  assertClosedWithoutToken(riskConsole, '/api/admin/risk-console', 'gcsc-strict-risk-console-smoke');

  const auditEvents = await request(baseUrl, '/api/audit/events', {
    headers: { 'X-Request-Id': 'gcsc-strict-audit-events-smoke' },
  });
  assertClosedWithoutToken(auditEvents, '/api/audit/events', 'gcsc-strict-audit-events-smoke');

  const adminMe = await request(baseUrl, '/api/admin/me', {
    headers: { 'X-Request-Id': 'gcsc-strict-admin-me-smoke' },
  });
  assertClosedWithoutToken(adminMe, '/api/admin/me', 'gcsc-strict-admin-me-smoke');

  const publicFounderSetup = await request(baseUrl, '/api/admin/founder-auth-setup');
  assert(publicFounderSetup.status === 200, `Expected founder-auth-setup read-only guide to stay available, got ${publicFounderSetup.status}`);

  const optionalRealToken = await runOptionalRealTokenChecks(baseUrl);

  console.log(JSON.stringify({
    status: 'passed',
    mode: 'strict',
    closed_without_token: {
      smartcontractor_jobs: jobs.status,
      admin_risk_console: riskConsole.status,
      audit_events: auditEvents.status,
      admin_me: adminMe.status,
    },
    read_only_guides: {
      founder_auth_setup: publicFounderSetup.status,
      auth_protection_status: protectionStatus.status,
    },
    optional_real_token: optionalRealToken,
  }, null, 2));
} finally {
  server.close();
}
