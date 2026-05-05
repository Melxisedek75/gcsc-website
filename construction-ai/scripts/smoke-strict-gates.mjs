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
    body: await readJson(response),
  };
}

function assertClosedWithoutToken(result, path) {
  assert(
    [401, 403, 503].includes(result.status),
    `Expected ${path} to be closed without token in strict mode, got ${result.status}`
  );
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

  const jobs = await request(baseUrl, '/api/smartcontractor/jobs');
  assertClosedWithoutToken(jobs, '/api/smartcontractor/jobs');

  const riskConsole = await request(baseUrl, '/api/admin/risk-console');
  assertClosedWithoutToken(riskConsole, '/api/admin/risk-console');

  const auditEvents = await request(baseUrl, '/api/audit/events');
  assertClosedWithoutToken(auditEvents, '/api/audit/events');

  const adminMe = await request(baseUrl, '/api/admin/me');
  assertClosedWithoutToken(adminMe, '/api/admin/me');

  const publicFounderSetup = await request(baseUrl, '/api/admin/founder-auth-setup');
  assert(publicFounderSetup.status === 200, `Expected founder-auth-setup read-only guide to stay available, got ${publicFounderSetup.status}`);

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
  }, null, 2));
} finally {
  server.close();
}
