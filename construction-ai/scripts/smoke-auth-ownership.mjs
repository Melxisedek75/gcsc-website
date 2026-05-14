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

function assertRouteUsesSharedDatabaseWriteError(routeStart, actionSnippet) {
  const routeIndex = serverSource.indexOf(routeStart);
  assert(routeIndex >= 0, `Missing route snippet: ${routeStart}`);

  const actionIndex = serverSource.indexOf(actionSnippet, routeIndex);
  assert(actionIndex >= 0, `Missing route action snippet after ${routeStart}: ${actionSnippet}`);

  const writeBlock = serverSource.slice(routeIndex, actionIndex);
  assert(
    writeBlock.includes('databaseWriteError(res,'),
    `${routeStart} must use databaseWriteError before ${actionSnippet}`
  );
}

function assertRouteUsesSharedDatabaseError(routeStart, responseSnippet) {
  const routeIndex = serverSource.indexOf(routeStart);
  assert(routeIndex >= 0, `Missing route snippet: ${routeStart}`);

  const responseIndex = serverSource.indexOf(responseSnippet, routeIndex);
  assert(responseIndex >= 0, `Missing route response snippet after ${routeStart}: ${responseSnippet}`);

  const queryBlock = serverSource.slice(routeIndex, responseIndex);
  assert(
    queryBlock.includes('databaseError(res,'),
    `${routeStart} must use databaseError before ${responseSnippet}`
  );
}

function assertRouteBlockIncludes(routeStart, endSnippet, requiredSnippet) {
  const routeIndex = serverSource.indexOf(routeStart);
  assert(routeIndex >= 0, `Missing route snippet: ${routeStart}`);

  const endIndex = serverSource.indexOf(endSnippet, routeIndex);
  assert(endIndex >= 0, `Missing route end snippet after ${routeStart}: ${endSnippet}`);

  const routeBlock = serverSource.slice(routeIndex, endIndex);
  assert(
    routeBlock.includes(requiredSnippet),
    `${routeStart} must include ${requiredSnippet} before ${endSnippet}`
  );
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

function assertSecurityHeaders(response) {
  const expectedHeaders = {
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  };

  for (const [header, expectedValue] of Object.entries(expectedHeaders)) {
    assert(
      response.headers.get(header) === expectedValue,
      `Expected ${header} header to be ${expectedValue}`
    );
  }
  assert(response.headers.get('x-request-id'), 'Expected x-request-id header to be present');
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
    'getAdminAccess',
    'requireAdminPermissions',
    'routeProtectionMode',
    'authLimiter',
    "app.post('/api/auth/magic-link', authLimiter",
    'validateMagicLinkInput',
    'redirect_to must use localhost, 127.0.0.1, xprnet.org, www.xprnet.org, PUBLIC_SITE_URL, or ALLOWED_AUTH_REDIRECT_ORIGINS',
    'const magicLinkValidation = validateMagicLinkInput(req.body);',
    'requireProtectedRoute',
    'requireProtectedAdminRoute',
    "app.use('/api/smartcontractor', requireProtectedRoute)",
    "app.get('/api/auth/protection-status'",
    "app.get('/api/admin/me'",
    'founderActionItems',
    "app.get('/api/admin/founder-action-center'",
    'getAdminMembershipSummary',
    'getAuthProfileBindingStatus',
    "app.get('/api/admin/founder-auth-setup'",
    "app.get('/api/admin/mobile-install-readiness'",
    "app.get('/api/admin/beta-readiness'",
    'supabaseAuth',
    'supabaseAdmin',
    "app.get('/api/admin/supabase-boundary'",
    'X-Request-Id',
    'requestId(req.headers',
    'request_id: res.req?.id || null',
    'request_id: req.id || null',
    'function serviceUnavailable(res, error)',
    'return res.status(503).json({ error, request_id: res.req?.id || null });',
    'function authError(res, status, error)',
    'return res.status(status).json({ error, request_id: res.req?.id || null });',
    'function serverError(res, error)',
    'return res.status(500).json({ error, request_id: res.req?.id || null });',
    'return res.status(ownership.status).json({ error: ownership.error, request_id: res.req?.id || null });',
    'function databaseError(res, error)',
    "return serverError(res, error?.message || 'Database operation failed');",
    'function databaseWriteError(res, error)',
    'return databaseError(res, error);',
    'Invalid JSON body',
    'API route not found',
    "assertOwnedProfile(req, profile_id)",
    "assertOwnedRoleRecord(req, 'homeowners', homeowner_id, 'homeowner_id')",
    "assertOwnedRoleRecord(req, 'contractors', contractor_id, 'contractor_id')",
    "assertOwnedRoleRecord(req, 'contractors', reviewer_contractor_id, 'reviewer_contractor_id')",
    'role-ownership-guards',
    'validateLoanRequestInput',
    'principal_usd must be a positive finite number',
    'apr_percent must be a positive finite number',
    'risk_score must be between 0 and 100',
    'const loanValidationErrors = validateLoanRequestInput(req.body);',
    'validateLoanRepaymentInput',
    'source must be one of: milestone_payment, escrow_release, manual, admin_adjustment',
    'const repaymentValidation = validateLoanRepaymentInput(req.body);',
    'validateDisputeCreateInput',
    'opened_by_role must be one of: homeowner, contractor',
    'const disputeValidationErrors = validateDisputeCreateInput(req.body);',
    'validateDisputeEvidenceInput',
    'evidence_type must be one of: photo, video, document, link, note',
    'const evidenceValidationErrors = validateDisputeEvidenceInput(req.body);',
    'validateDisputeReviewInput',
    'recommendation must be one of: request_rework, release_payment, partial_refund, full_refund, needs_onsite_inspection',
    'const reviewValidationErrors = validateDisputeReviewInput(req.body);',
    'validateProfileCreateInput',
    'role must be one of: homeowner, contractor',
    'email must be a valid email address',
    'const profileValidationErrors = validateProfileCreateInput(req.body);',
    'validateContractorCreateInput',
    'profile_id and business_name are required',
    'insurance_status must be one of: pending, verified, expired, missing',
    'const contractorValidationErrors = validateContractorCreateInput(req.body);',
    'validateHomeownerCreateInput',
    'profile_id is required',
    'subscription_tier must be one of: basic, pro, enterprise',
    'const homeownerValidationErrors = validateHomeownerCreateInput(req.body);',
    'validateJobCreateInput',
    'homeowner_id, title, and description are required',
    'budget_max_usd must be greater than or equal to budget_min_usd',
    'const jobValidationErrors = validateJobCreateInput(req.body);',
    'validateBidCreateInput',
    'job_id, contractor_id, and amount_usd are required',
    'timeline_days must be a positive finite number',
    'const bidValidationErrors = validateBidCreateInput(req.body);',
    'validateProjectContractCreateInput',
    'job_id, homeowner_id, contractor_id, title, and total_amount_usd are required',
    'status must be one of: pending_signature, active, completed, cancelled, disputed',
    'const projectContractValidationErrors = validateProjectContractCreateInput(req.body);',
    'validateMilestoneCreateInput',
    'job_id, title, and amount_usd are required',
    'payment_status must be one of: not_funded, funded, released, disputed, refunded',
    'const milestoneValidationErrors = validateMilestoneCreateInput(req.body);',
    'validateBidUnlockInput',
    'bid_id and contractor_id are required',
    'price_usd must be a positive finite number',
    'const bidUnlockValidationErrors = validateBidUnlockInput(req.body, req.params);',
    'validateVerificationCheckInput',
    'subject_type and check_type are required',
    'confidence_score must be between 0 and 100',
    'const verificationCheckValidation = validateVerificationCheckInput(req.body);',
    'validateVerificationWebhookInput',
    'provider must be a supported verification provider',
    'const verificationWebhookValidation = validateVerificationWebhookInput(req.body, req.params);',
    'validatePaymentWebhookInput',
    'external_intent_id is required',
    'const paymentWebhookValidation = validatePaymentWebhookInput(req.body, req.params);',
    'validatePaymentIntentInput',
    'amount_usd must be 1000000 or less for MVP safety',
    'const paymentIntentValidation = validatePaymentIntentInput(req.body);',
    'validateAiAgentRecommendationInput',
    'entity_id is required',
    'input_refs must include at least one reference',
    'const aiRecommendationValidation = validateAiAgentRecommendationInput(req.body);',
    'validatePriceSnapshotInput',
    'token_symbol is required',
    'raw_result must be an object',
    'const priceSnapshotValidation = validatePriceSnapshotInput(req.body);',
    'validateChatInput',
    'messages array is required',
    'Message too long (max 4000 chars)',
    'const chatValidation = validateChatInput(req.body);',
    'validateQuickInput',
    'question string required (max 500 chars)',
    'const quickValidation = validateQuickInput(req.body);',
    'validateAutomationWebhookInput',
    'action must be one of: ask, generate, suggest',
    'const webhookValidation = validateAutomationWebhookInput(req.body);',
    'validateSlackEventInput',
    'Slack event type must be url_verification or event_callback',
    'const slackValidation = validateSlackEventInput(req.body);',
  ];

  for (const snippet of requiredSnippets) {
    assertSourceIncludes(snippet);
  }

  assertRouteUsesSharedDatabaseWriteError("app.post('/api/smartcontractor/jobs'", "action: 'job_created'");
  assertRouteUsesSharedDatabaseWriteError("app.post('/api/smartcontractor/bids'", "action: 'bid_submitted'");
  assertRouteUsesSharedDatabaseWriteError(
    "app.post('/api/smartcontractor/project-contracts'",
    "action: 'project_contract_created'"
  );
  assertRouteUsesSharedDatabaseWriteError(
    "app.post('/api/smartcontractor/milestones'",
    "action: 'milestone_created'"
  );
  assertRouteUsesSharedDatabaseWriteError(
    "app.post('/api/smartcontractor/bids/:bidId/unlock'",
    "action: 'bid_unlocked'"
  );
  assertRouteUsesSharedDatabaseWriteError("app.post('/api/smartcontractor/loans'", "action: 'loan_requested'");
  assertRouteUsesSharedDatabaseWriteError(
    "app.post('/api/smartcontractor/loans/:loanId/repayments'",
    "action: 'loan_repayment_recorded'"
  );
  assertRouteUsesSharedDatabaseWriteError("app.post('/api/smartcontractor/disputes'", "action: 'dispute_opened'");
  assertRouteBlockIncludes(
    "app.post('/api/smartcontractor/disputes'",
    "action: 'dispute_opened'",
    'request_id: res.req?.id || null'
  );
  assertRouteUsesSharedDatabaseWriteError(
    "app.post('/api/smartcontractor/disputes/:disputeId/evidence'",
    "action: 'dispute_evidence_added'"
  );
  assertRouteUsesSharedDatabaseError(
    "app.post('/api/smartcontractor/disputes/:disputeId/evidence'",
    ".from('dispute_evidence')"
  );
  assertRouteUsesSharedDatabaseWriteError(
    "app.post('/api/smartcontractor/disputes/:disputeId/reviews'",
    "action: 'dispute_peer_review_submitted'"
  );
  assertRouteUsesSharedDatabaseWriteError("app.post('/api/verification/checks'", "action: 'verification_check_created'");
  assertRouteUsesSharedDatabaseWriteError(
    "app.post('/api/collateral/price-snapshots'",
    "action: 'token_price_snapshot_created'"
  );
  assertRouteUsesSharedDatabaseWriteError(
    "app.post('/api/collateral/locks'",
    "action: 'token_collateral_lock_created'"
  );
  assertRouteUsesSharedDatabaseWriteError("app.post('/api/payments/intents'", "action: 'payment_intent_created'");
  assertRouteUsesSharedDatabaseWriteError(
    "app.post('/api/payments/webhooks/:provider'",
    "action: 'payment_webhook_received'"
  );
  assertRouteUsesSharedDatabaseWriteError(
    "app.post('/api/verification/webhooks/:provider'",
    "action: 'verification_webhook_received'"
  );
  assertRouteUsesSharedDatabaseError(
    "app.get('/api/verification/checks'",
    'res.json({ verification_checks: data, request_id: req.id || null })'
  );
  assertRouteUsesSharedDatabaseError(
    "app.get('/api/collateral/price-snapshots'",
    'res.json({ price_snapshots: data, request_id: req.id || null })'
  );
  assertRouteUsesSharedDatabaseError(
    "app.get('/api/collateral/locks'",
    'res.json({ collateral_locks: data, request_id: req.id || null })'
  );
  assertRouteUsesSharedDatabaseError("app.get('/api/auth/profile'", 'binding: profile');
  assertRouteUsesSharedDatabaseError(
    "app.get('/api/smartcontractor/jobs'",
    'res.json({ jobs: data, request_id: req.id || null })'
  );
  assertRouteUsesSharedDatabaseError(
    "app.get('/api/smartcontractor/bids'",
    'res.json({ bids: data, request_id: req.id || null })'
  );
  assertRouteUsesSharedDatabaseError(
    "app.get('/api/smartcontractor/project-contracts'",
    'res.json({ project_contracts: data })'
  );
  assertRouteUsesSharedDatabaseError("app.get('/api/smartcontractor/milestones'", 'res.json({ milestones: data })');
  assertRouteUsesSharedDatabaseError("app.get('/api/smartcontractor/loans'", 'res.json({ loans: data })');
  assertRouteUsesSharedDatabaseError("app.get('/api/smartcontractor/disputes'", 'res.json({ disputes: data })');
  assertRouteBlockIncludes(
    "app.post('/api/auth/magic-link'",
    "action: 'auth_magic_link_requested'",
    'request_id: res.req?.id || null'
  );
  assertRouteBlockIncludes(
    "app.post('/api/webhook'",
    "console.error('Webhook error:', err.message);",
    'request_id: res.req?.id || null'
  );
  assertRouteBlockIncludes(
    "app.get('/api/payments/metal-pay/signature'",
    "const nonce = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;",
    'request_id: res.req?.id || null'
  );
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
process.env.METAL_PAY_CONNECT_API_KEY = process.env.METAL_PAY_CONNECT_API_KEY || 'smoke_metal_pay_api_key';
process.env.METAL_PAY_CONNECT_SECRET_KEY = process.env.METAL_PAY_CONNECT_SECRET_KEY || 'smoke_metal_pay_secret_key';
const app = require('../server.js');
const server = app.listen(0);

try {
  await new Promise((resolve) => server.once('listening', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  const health = await request(baseUrl, '/api/health');
  assert(health.status === 200, `Expected /api/health 200, got ${health.status}`);
  assertSecurityHeaders(health);
  const customRequestId = 'gcsc-smoke-request-123';
  const healthWithRequestId = await request(baseUrl, '/api/health', {
    headers: { 'X-Request-Id': customRequestId },
  });
  assert(
    healthWithRequestId.headers.get('x-request-id') === customRequestId,
    'Server must echo a safe incoming X-Request-Id header'
  );
  assert(
    healthWithRequestId.body?.request_id === customRequestId,
    'Health endpoint must include request_id in the response body'
  );
  assert(health.body?.features?.includes('auth-implementation-scaffold'), 'Health must advertise auth-implementation-scaffold');
  assert(health.body?.features?.includes('auth-magic-link-rate-limit'), 'Health must advertise auth-magic-link-rate-limit');
  assert(health.body?.features?.includes('profile-ownership-binding'), 'Health must advertise profile-ownership-binding');
  assert(health.body?.features?.includes('role-ownership-guards'), 'Health must advertise role-ownership-guards');
  assert(health.body?.features?.includes('admin-role-model'), 'Health must advertise admin-role-model');
  assert(health.body?.features?.includes('admin-enforcement-scaffold'), 'Health must advertise admin-enforcement-scaffold');
  assert(health.body?.features?.includes('founder-action-center'), 'Health must advertise founder-action-center');
  assert(health.body?.features?.includes('founder-auth-setup'), 'Health must advertise founder-auth-setup');
  assert(health.body?.features?.includes('supabase-service-role-boundary'), 'Health must advertise supabase-service-role-boundary');
  assert(health.body?.features?.includes('protected-route-gate'), 'Health must advertise protected-route-gate');
  assert(health.body?.features?.includes('mobile-install-readiness'), 'Health must advertise mobile-install-readiness');
  assert(health.body?.features?.includes('controlled-beta-readiness'), 'Health must advertise controlled-beta-readiness');

  const suggestions = await request(baseUrl, '/api/suggestions?userType=contractor', {
    headers: { 'X-Request-Id': 'gcsc-suggestions-smoke' },
  });
  assert(suggestions.status === 200, `Expected suggestions 200, got ${suggestions.status}`);
  assert(
    suggestions.headers.get('x-request-id') === 'gcsc-suggestions-smoke',
    'Suggestions endpoint must echo a safe X-Request-Id header'
  );
  assert(
    suggestions.body?.request_id === 'gcsc-suggestions-smoke',
    'Suggestions endpoint must include request_id in the response body'
  );
  assert(Array.isArray(suggestions.body?.suggestions), 'Suggestions endpoint must return suggestions array');

  const paymentProviders = await request(baseUrl, '/api/payments/providers', {
    headers: { 'X-Request-Id': 'gcsc-payment-providers-smoke' },
  });
  assert(paymentProviders.status === 200, `Expected payment providers 200, got ${paymentProviders.status}`);
  assert(
    paymentProviders.headers.get('x-request-id') === 'gcsc-payment-providers-smoke',
    'Payment providers endpoint must echo a safe X-Request-Id header'
  );
  assert(
    paymentProviders.body?.request_id === 'gcsc-payment-providers-smoke',
    'Payment providers endpoint must include request_id in the response body'
  );
  assert(Array.isArray(paymentProviders.body?.providers), 'Payment providers endpoint must return providers array');

  const metalPaySignature = await request(baseUrl, '/api/payments/metal-pay/signature', {
    headers: { 'X-Request-Id': 'gcsc-metal-pay-signature-smoke' },
  });
  assert(metalPaySignature.status === 200, `Expected Metal Pay signature 200, got ${metalPaySignature.status}`);
  assert(
    metalPaySignature.headers.get('x-request-id') === 'gcsc-metal-pay-signature-smoke',
    'Metal Pay signature endpoint must echo a safe X-Request-Id header'
  );
  assert(
    metalPaySignature.body?.request_id === 'gcsc-metal-pay-signature-smoke',
    'Metal Pay signature endpoint must include request_id in the success response body'
  );
  assert(typeof metalPaySignature.body?.signature === 'string', 'Metal Pay signature endpoint must return a signature');
  assert(typeof metalPaySignature.body?.nonce === 'string', 'Metal Pay signature endpoint must return a nonce');

  const verificationProviders = await request(baseUrl, '/api/verification/providers', {
    headers: { 'X-Request-Id': 'gcsc-verification-providers-smoke' },
  });
  assert(verificationProviders.status === 200, `Expected verification providers 200, got ${verificationProviders.status}`);
  assert(
    verificationProviders.headers.get('x-request-id') === 'gcsc-verification-providers-smoke',
    'Verification providers endpoint must echo a safe X-Request-Id header'
  );
  assert(
    verificationProviders.body?.request_id === 'gcsc-verification-providers-smoke',
    'Verification providers endpoint must include request_id in the response body'
  );
  assert(Array.isArray(verificationProviders.body?.providers), 'Verification providers endpoint must return providers array');
  assertSourceIncludes(
    'res.json({ payment_intents: data, request_id: req.id || null });',
    'Payment intent list must include request_id in the response body'
  );
  assertSourceIncludes(
    'res.json({ payment_events: data, request_id: req.id || null });',
    'Payment event list must include request_id in the response body'
  );
  assertSourceIncludes(
    'res.json({ audit_events: data, request_id: req.id || null });',
    'Audit event list must include request_id in the response body'
  );
  assertSourceIncludes(
    'res.json({ verification_checks: data, request_id: req.id || null });',
    'Verification check list must include request_id in the response body'
  );
  assertSourceIncludes(
    'res.json({ price_snapshots: data, request_id: req.id || null });',
    'Price snapshot list must include request_id in the response body'
  );
  assertSourceIncludes(
    'res.json({ collateral_locks: data, request_id: req.id || null });',
    'Collateral lock list must include request_id in the response body'
  );
  assertSourceIncludes(
    'res.json({ jobs: data, request_id: req.id || null });',
    'SmartContractor job list must include request_id in the response body'
  );

  assertSourceIncludes(
    'res.json({ bids: data, request_id: req.id || null });',
    'SmartContractor bid list must include request_id in the response body'
  );

  const accessModel = await request(baseUrl, '/api/admin/access-model', {
    headers: { 'X-Request-Id': 'gcsc-admin-access-model-smoke' },
  });
  assert(accessModel.status === 200, `Expected admin/access-model 200, got ${accessModel.status}`);
  assert(
    accessModel.headers.get('x-request-id') === 'gcsc-admin-access-model-smoke',
    'Admin access model must echo a safe X-Request-Id header'
  );
  assert(
    accessModel.body?.request_id === 'gcsc-admin-access-model-smoke',
    'Admin access model must include request_id in the response body'
  );
  assert(Array.isArray(accessModel.body?.roles), 'Admin access model must return roles');
  assert(accessModel.body.roles.some((role) => role.role === 'founder'), 'Admin access model must include founder role');

  const protectionStatus = await request(baseUrl, '/api/auth/protection-status', {
    headers: { 'X-Request-Id': 'gcsc-protection-status-smoke' },
  });
  assert(protectionStatus.status === 200, `Expected auth/protection-status 200, got ${protectionStatus.status}`);
  assert(
    protectionStatus.headers.get('x-request-id') === 'gcsc-protection-status-smoke',
    'Auth protection-status must echo a safe X-Request-Id header'
  );
  assert(
    protectionStatus.body?.request_id === 'gcsc-protection-status-smoke',
    'Auth protection-status must include request_id in the response body'
  );
  assert(protectionStatus.body?.mode === 'draft', 'Route protection should default to draft mode');
  assert(protectionStatus.body?.enforced === false, 'Route protection should default to non-enforced draft mode');

  const authReadiness = await request(baseUrl, '/api/admin/auth-readiness', {
    headers: { 'X-Request-Id': 'gcsc-auth-readiness-smoke' },
  });
  assert(authReadiness.status === 200, `Expected auth-readiness 200, got ${authReadiness.status}`);
  assert(
    authReadiness.headers.get('x-request-id') === 'gcsc-auth-readiness-smoke',
    'Auth readiness must echo a safe X-Request-Id header'
  );
  assert(
    authReadiness.body?.request_id === 'gcsc-auth-readiness-smoke',
    'Auth readiness must include request_id in the response body'
  );
  assert(authReadiness.body?.mode === 'auth_decision_package', 'Auth readiness must return auth_decision_package mode');
  assert(Array.isArray(authReadiness.body?.checklist), 'Auth readiness must return checklist array');

  const launchReadiness = await request(baseUrl, '/api/admin/launch-readiness', {
    headers: { 'X-Request-Id': 'gcsc-launch-readiness-smoke' },
  });
  assert(launchReadiness.status === 200, `Expected launch-readiness 200, got ${launchReadiness.status}`);
  assert(
    launchReadiness.headers.get('x-request-id') === 'gcsc-launch-readiness-smoke',
    'Launch readiness must echo a safe X-Request-Id header'
  );
  assert(
    launchReadiness.body?.request_id === 'gcsc-launch-readiness-smoke',
    'Launch readiness must include request_id in the response body'
  );
  assert(launchReadiness.body?.mode === 'production_readiness_gate', 'Launch readiness must return production_readiness_gate mode');
  assert(Array.isArray(launchReadiness.body?.items), 'Launch readiness must return items array');

  const adminMe = await request(baseUrl, '/api/admin/me');
  assert(adminMe.status === 200, `Expected admin/me in draft mode to return 200, got ${adminMe.status}`);
  assert(adminMe.body?.access?.mode === 'draft', 'Admin me should default to draft enforcement mode');
  assert(adminMe.body?.access?.draft_bypass === true, 'Admin me should expose draft bypass for local MVP mode');

  const founderActions = await request(baseUrl, '/api/admin/founder-action-center', {
    headers: { 'X-Request-Id': 'gcsc-founder-action-center-smoke' },
  });
  assert(founderActions.status === 200, `Expected founder-action-center 200, got ${founderActions.status}`);
  assert(
    founderActions.headers.get('x-request-id') === 'gcsc-founder-action-center-smoke',
    'Founder Action Center must echo a safe X-Request-Id header'
  );
  assert(
    founderActions.body?.request_id === 'gcsc-founder-action-center-smoke',
    'Founder Action Center must include request_id in the response body'
  );
  assert(Array.isArray(founderActions.body?.actions), 'Founder Action Center must return actions array');
  assert(founderActions.body.actions.some((item) => item.id === 'reconnect_supabase_connector'), 'Founder Action Center must include Supabase reconnect action');

  const founderAuthSetup = await request(baseUrl, '/api/admin/founder-auth-setup', {
    headers: { 'X-Request-Id': 'gcsc-founder-auth-setup-smoke' },
  });
  assert(founderAuthSetup.status === 200, `Expected founder-auth-setup 200, got ${founderAuthSetup.status}`);
  assert(
    founderAuthSetup.headers.get('x-request-id') === 'gcsc-founder-auth-setup-smoke',
    'Founder Auth Setup must echo a safe X-Request-Id header'
  );
  assert(
    founderAuthSetup.body?.request_id === 'gcsc-founder-auth-setup-smoke',
    'Founder Auth Setup must include request_id in the response body'
  );
  assert(Array.isArray(founderAuthSetup.body?.checklist), 'Founder Auth Setup must return checklist array');
  assert(founderAuthSetup.body?.current_session?.authenticated === false, 'Founder Auth Setup should report no session without token');

  const boundary = await request(baseUrl, '/api/admin/supabase-boundary', {
    headers: { 'X-Request-Id': 'gcsc-supabase-boundary-smoke' },
  });
  assert(boundary.status === 200, `Expected supabase-boundary 200, got ${boundary.status}`);
  assert(
    boundary.headers.get('x-request-id') === 'gcsc-supabase-boundary-smoke',
    'Supabase boundary must echo a safe X-Request-Id header'
  );
  assert(
    boundary.body?.request_id === 'gcsc-supabase-boundary-smoke',
    'Supabase boundary must include request_id in the response body'
  );
  assert(boundary.body?.status?.service_role, 'Boundary endpoint must return service_role status without secret values');

  const mobileInstallReadiness = await request(baseUrl, '/api/admin/mobile-install-readiness', {
    headers: { 'X-Request-Id': 'gcsc-mobile-install-readiness-smoke' },
  });
  assert(mobileInstallReadiness.status === 200, `Expected mobile-install-readiness 200, got ${mobileInstallReadiness.status}`);
  assert(
    mobileInstallReadiness.headers.get('x-request-id') === 'gcsc-mobile-install-readiness-smoke',
    'Mobile install readiness must echo a safe X-Request-Id header'
  );
  assert(
    mobileInstallReadiness.body?.request_id === 'gcsc-mobile-install-readiness-smoke',
    'Mobile install readiness must include request_id in the response body'
  );
  assert(mobileInstallReadiness.body?.status === 'ready', 'Mobile install readiness should report ready for the current PWA shell');
  assert(Array.isArray(mobileInstallReadiness.body?.checks), 'Mobile install readiness must return checks array');
  assert(mobileInstallReadiness.body.checks.some((item) => item.id === 'api_cache_boundary'), 'Mobile install readiness must include API cache boundary check');

  const betaReadiness = await request(baseUrl, '/api/admin/beta-readiness', {
    headers: { 'X-Request-Id': 'gcsc-beta-readiness-smoke' },
  });
  assert(betaReadiness.status === 200, `Expected beta-readiness 200, got ${betaReadiness.status}`);
  assert(
    betaReadiness.headers.get('x-request-id') === 'gcsc-beta-readiness-smoke',
    'Beta readiness must echo a safe X-Request-Id header'
  );
  assert(
    betaReadiness.body?.request_id === 'gcsc-beta-readiness-smoke',
    'Beta readiness must include request_id in the response body'
  );
  assert(betaReadiness.body?.mode === 'controlled_beta_readiness', 'Beta readiness must return controlled_beta_readiness mode');
  assert(betaReadiness.body?.decision?.real_money_pilot === 'blocked', 'Beta readiness must keep real-money pilot blocked');
  assert(Array.isArray(betaReadiness.body?.required_docs), 'Beta readiness must return required_docs array');
  assert(betaReadiness.body?.document_summary?.total === betaReadiness.body.required_docs.length, 'Beta readiness must return document_summary totals');
  assert(Array.isArray(betaReadiness.body?.missing_docs), 'Beta readiness must return missing_docs array');
  assert(betaReadiness.body?.validation_commands?.includes('npm run check'), 'Beta readiness must return validation_commands');
  assert(betaReadiness.body?.report_back_template?.some((item) => item.includes('Do not paste tokens')), 'Beta readiness must return safe report_back_template');
  assert(betaReadiness.body?.safe_report_fields?.local_checks === 'PASS/FAIL', 'Beta readiness must return safe_report_fields');
  assert(betaReadiness.body?.safe_report_fields?.magic_link_login === 'PASS/FAIL/SKIPPED', 'Beta readiness must return safe Magic Link report values');
  assert(betaReadiness.body?.go_no_go_rules?.some((item) => item.includes('Automatic NO-GO')), 'Beta readiness must return go_no_go_rules');
  assert(betaReadiness.body?.tester_day_checklist?.some((item) => item.includes('Open SmartContractor local demo')), 'Beta readiness must return tester_day_checklist');
  assert(betaReadiness.body?.issue_intake_fields?.safe_reproduction_steps === 'required', 'Beta readiness must return issue_intake_fields');
  assert(betaReadiness.body?.evidence_retention_policy?.some((item) => item.includes('Redact screenshots')), 'Beta readiness must return evidence_retention_policy');
  assert(betaReadiness.body?.tester_handoff_packet?.includes('docs/smartcontractor-beta-tester-invite.md'), 'Beta readiness must return tester_handoff_packet');
  assert(betaReadiness.body?.session_stop_conditions?.some((item) => item.includes('Stop the session')), 'Beta readiness must return session_stop_conditions');
  assert(betaReadiness.body?.post_session_actions?.some((item) => item.includes('Update the beta decision log')), 'Beta readiness must return post_session_actions');
  assert(betaReadiness.body?.public_beta_exit_criteria?.some((item) => item.includes('Do not move to public beta')), 'Beta readiness must return public_beta_exit_criteria');
  assert(betaReadiness.body?.pre_invite_checks?.some((item) => item.includes('Do not invite testers')), 'Beta readiness must return pre_invite_checks');
  assert(betaReadiness.body?.invite_message_checklist?.some((item) => item.includes('no real-money promises')), 'Beta readiness must return invite_message_checklist');
  assert(betaReadiness.body?.tester_consent_checklist?.some((item) => item.includes('Tester understands')), 'Beta readiness must return tester_consent_checklist');
  assert(betaReadiness.body?.tester_role_briefing?.some((item) => item.includes('Homeowner tester')), 'Beta readiness must return tester_role_briefing');
  assert(betaReadiness.body?.tester_success_signals?.some((item) => item.includes('Tester can explain')), 'Beta readiness must return tester_success_signals');
  assert(betaReadiness.body?.tester_failure_signals?.some((item) => item.includes('Tester cannot explain')), 'Beta readiness must return tester_failure_signals');
  assert(betaReadiness.body?.tester_redaction_reminders?.some((item) => item.includes('Redact names')), 'Beta readiness must return tester_redaction_reminders');
  assert(betaReadiness.body?.tester_artifact_naming?.some((item) => item.includes('YYYY-MM-DD_role_flow_severity_request-id')), 'Beta readiness must return tester_artifact_naming');
  assert(betaReadiness.body?.tester_artifact_index?.some((item) => item.includes('Artifact index row')), 'Beta readiness must return tester_artifact_index');
  assert(betaReadiness.body?.tester_artifact_review_queue?.some((item) => item.includes('Review queue item')), 'Beta readiness must return tester_artifact_review_queue');
  assert(betaReadiness.body?.tester_artifact_export_guard?.some((item) => item.includes('Export guard')), 'Beta readiness must return tester_artifact_export_guard');
  assert(betaReadiness.body?.tester_artifact_purge_policy?.some((item) => item.includes('Purge policy')), 'Beta readiness must return tester_artifact_purge_policy');
  assert(betaReadiness.body?.tester_artifact_retention_clock?.some((item) => item.includes('Retention clock')), 'Beta readiness must return tester_artifact_retention_clock');
  assert(betaReadiness.body?.tester_artifact_disposal_ledger?.some((item) => item.includes('Disposal ledger row')), 'Beta readiness must return tester_artifact_disposal_ledger');
  assert(betaReadiness.body?.tester_artifact_access_roles?.some((item) => item.includes('Access roles')), 'Beta readiness must return tester_artifact_access_roles');
  assert(betaReadiness.body?.tester_artifact_chain_of_custody?.some((item) => item.includes('Chain of custody')), 'Beta readiness must return tester_artifact_chain_of_custody');
  assert(betaReadiness.body?.tester_artifact_public_summary_rules?.some((item) => item.includes('Public summary rules')), 'Beta readiness must return tester_artifact_public_summary_rules');
  assert(betaReadiness.body?.tester_artifact_anonymization_checklist?.some((item) => item.includes('Anonymization checklist')), 'Beta readiness must return tester_artifact_anonymization_checklist');
  assert(betaReadiness.body?.tester_artifact_approval_stamp?.some((item) => item.includes('Approval stamp')), 'Beta readiness must return tester_artifact_approval_stamp');
  assert(betaReadiness.body?.tester_artifact_revocation_rules?.some((item) => item.includes('Revocation rules')), 'Beta readiness must return tester_artifact_revocation_rules');
  assert(betaReadiness.body?.tester_artifact_external_packet_manifest?.some((item) => item.includes('External packet manifest')), 'Beta readiness must return tester_artifact_external_packet_manifest');
  assert(betaReadiness.body?.tester_artifact_external_packet_distribution_log?.some((item) => item.includes('Distribution log')), 'Beta readiness must return tester_artifact_external_packet_distribution_log');
  assert(betaReadiness.body?.tester_artifact_external_packet_recall_checklist?.some((item) => item.includes('Recall checklist')), 'Beta readiness must return tester_artifact_external_packet_recall_checklist');
  assert(betaReadiness.body?.tester_artifact_external_packet_correction_notice?.some((item) => item.includes('Correction notice')), 'Beta readiness must return tester_artifact_external_packet_correction_notice');
  assert(betaReadiness.body?.tester_artifact_external_packet_version_history?.some((item) => item.includes('Version history')), 'Beta readiness must return tester_artifact_external_packet_version_history');
  assert(betaReadiness.body?.tester_artifact_external_packet_claim_review?.some((item) => item.includes('Claim review')), 'Beta readiness must return tester_artifact_external_packet_claim_review');
  assert(betaReadiness.body?.tester_artifact_external_packet_audience_review?.some((item) => item.includes('Audience review')), 'Beta readiness must return tester_artifact_external_packet_audience_review');
  assert(betaReadiness.body?.tester_artifact_external_packet_recipient_acknowledgement?.some((item) => item.includes('Recipient acknowledgement')), 'Beta readiness must return tester_artifact_external_packet_recipient_acknowledgement');
  assert(betaReadiness.body?.tester_artifact_external_packet_followup_queue?.some((item) => item.includes('Follow-up queue')), 'Beta readiness must return tester_artifact_external_packet_followup_queue');
  assert(betaReadiness.body?.tester_artifact_external_packet_followup_closure_rules?.some((item) => item.includes('Follow-up closure rules')), 'Beta readiness must return tester_artifact_external_packet_followup_closure_rules');
  assert(betaReadiness.body?.tester_artifact_external_packet_followup_escalation_rules?.some((item) => item.includes('Follow-up escalation rules')), 'Beta readiness must return tester_artifact_external_packet_followup_escalation_rules');
  assert(betaReadiness.body?.tester_artifact_external_packet_followup_sla_policy?.some((item) => item.includes('Follow-up SLA policy')), 'Beta readiness must return tester_artifact_external_packet_followup_sla_policy');
  assert(betaReadiness.body?.tester_artifact_external_packet_followup_decision_summary?.some((item) => item.includes('Follow-up decision summary')), 'Beta readiness must return tester_artifact_external_packet_followup_decision_summary');
  assert(betaReadiness.body?.tester_artifact_external_packet_followup_owner_handoff?.some((item) => item.includes('Follow-up owner handoff')), 'Beta readiness must return tester_artifact_external_packet_followup_owner_handoff');
  assert(betaReadiness.body?.review_packet?.includes('docs/smartcontractor-public-beta-review-packet.md'), 'Beta readiness must return review_packet');
  assert(betaReadiness.body?.founder_present_tasks?.some((item) => item.includes('Magic Link founder login')), 'Beta readiness must return founder_present_tasks');
  assert(betaReadiness.body.required_docs.some((doc) => doc.id === 'beta_tester_invite'), 'Beta readiness must include beta tester invite doc');
  assert(betaReadiness.body.required_docs.some((doc) => doc.id === 'beta_session_runbook'), 'Beta readiness must include beta session runbook doc');
  assert(betaReadiness.body.required_docs.some((doc) => doc.id === 'beta_session_summary'), 'Beta readiness must include beta session summary doc');
  assert(betaReadiness.body.required_docs.some((doc) => doc.id === 'beta_decision_log'), 'Beta readiness must include beta decision log doc');
  assert(betaReadiness.body.required_docs.some((doc) => doc.id === 'beta_triage_rubric'), 'Beta readiness must include beta triage rubric doc');
  assert(betaReadiness.body.required_docs.some((doc) => doc.id === 'beta_issue_lifecycle'), 'Beta readiness must include beta issue lifecycle doc');
  assert(betaReadiness.body.required_docs.some((doc) => doc.id === 'beta_go_no_go_scorecard'), 'Beta readiness must include beta go/no-go scorecard doc');
  assert(betaReadiness.body.required_docs.some((doc) => doc.id === 'founder_action_queue'), 'Beta readiness must include founder action queue doc');
  assert(betaReadiness.body.next_safe_steps.some((step) => step.includes('smartcontractor-founder-action-queue.md')), 'Beta readiness must point to founder action queue next step');

  const sessionNoToken = await request(baseUrl, '/api/auth/session-check', {
    headers: { 'X-Request-Id': 'gcsc-auth-401-smoke' },
  });
  assert(sessionNoToken.status === 401, `Expected session-check without token to return 401, got ${sessionNoToken.status}`);
  assert(
    sessionNoToken.headers.get('x-request-id') === 'gcsc-auth-401-smoke',
    'Session-check 401 must echo a safe X-Request-Id header'
  );
  assert(
    sessionNoToken.body?.request_id === 'gcsc-auth-401-smoke',
    'Session-check 401 must include request_id in the response body'
  );

  const profileNoToken = await request(baseUrl, '/api/auth/profile', {
    headers: { 'X-Request-Id': 'gcsc-profile-401-smoke' },
  });
  assert(profileNoToken.status === 401, `Expected auth/profile without token to return 401, got ${profileNoToken.status}`);
  assert(
    profileNoToken.headers.get('x-request-id') === 'gcsc-profile-401-smoke',
    'Auth profile 401 must echo a safe X-Request-Id header'
  );
  assert(
    profileNoToken.body?.request_id === 'gcsc-profile-401-smoke',
    'Auth profile 401 must include request_id in the response body'
  );

  const invalidMagicLink = await request(baseUrl, '/api/auth/magic-link', {
    method: 'POST',
    headers: { 'X-Request-Id': 'gcsc-invalid-magic-link-smoke' },
    body: JSON.stringify({
      email: 'not-an-email',
      redirect_to: 'http://localhost:3002/smartcontractor.html',
    }),
  });
  assert(
    invalidMagicLink.status === 400,
    `Expected invalid magic-link request to return 400 before Supabase auth setup, got ${invalidMagicLink.status}`
  );
  assert(
    invalidMagicLink.headers.get('x-request-id') === 'gcsc-invalid-magic-link-smoke',
    'Invalid Magic Link response must echo a safe X-Request-Id header'
  );
  assert(
    invalidMagicLink.body?.request_id === 'gcsc-invalid-magic-link-smoke',
    'Invalid Magic Link response must include request_id in the response body'
  );
  let limitedMagicLink = null;
  for (let index = 0; index < 5; index += 1) {
    limitedMagicLink = await request(baseUrl, '/api/auth/magic-link', {
      method: 'POST',
      body: JSON.stringify({
        email: 'still-not-an-email',
        redirect_to: 'http://localhost:3002/smartcontractor.html',
      }),
    });
  }
  assert(
    limitedMagicLink.status === 429,
    `Expected Magic Link rate limiter to return 429 after repeated requests, got ${limitedMagicLink.status}`
  );
  assert(
    limitedMagicLink.headers.get('x-request-id') === limitedMagicLink.body?.request_id,
    'Magic Link rate-limit response must echo X-Request-Id in the JSON body'
  );

  const slackChallenge = await request(baseUrl, '/api/slack/events', {
    method: 'POST',
    body: JSON.stringify({
      type: 'url_verification',
      challenge: 'gcsc-slack-smoke-challenge',
    }),
  });
  assert(slackChallenge.status === 200, `Expected Slack challenge to return 200, got ${slackChallenge.status}`);
  assert(slackChallenge.body?.challenge === 'gcsc-slack-smoke-challenge', 'Slack challenge must echo the challenge value');

  const invalidSlackEvent = await request(baseUrl, '/api/slack/events', {
    method: 'POST',
    headers: { 'X-Request-Id': 'gcsc-invalid-slack-event-smoke' },
    body: JSON.stringify({
      type: 'unsupported_event',
      event: { type: 'message', text: 'hello' },
    }),
  });
  assert(invalidSlackEvent.status === 400, `Expected invalid Slack event to return 400, got ${invalidSlackEvent.status}`);
  assert(invalidSlackEvent.body?.error === 'Validation failed', 'Invalid Slack event must use shared validation error shape');
  assert(
    invalidSlackEvent.headers.get('x-request-id') === 'gcsc-invalid-slack-event-smoke',
    'Invalid Slack event must echo a safe X-Request-Id header'
  );
  assert(
    invalidSlackEvent.body?.request_id === 'gcsc-invalid-slack-event-smoke',
    'Invalid Slack event must include request_id in the response body'
  );

  const invalidAutomationWebhook = await request(baseUrl, '/api/webhook', {
    method: 'POST',
    headers: { 'X-Request-Id': 'gcsc-invalid-webhook-smoke' },
    body: JSON.stringify({
      action: 'unknown',
    }),
  });
  assert(
    invalidAutomationWebhook.status === 400,
    `Expected invalid automation webhook action to return 400, got ${invalidAutomationWebhook.status}`
  );
  assert(
    invalidAutomationWebhook.body?.error === 'Validation failed',
    'Invalid automation webhook action must use shared validation error shape'
  );
  assert(
    invalidAutomationWebhook.body?.details?.some((detail) => detail.includes('action must be one of')),
    'Invalid automation webhook action must explain the allowed actions'
  );
  assert(
    invalidAutomationWebhook.headers.get('x-request-id') === 'gcsc-invalid-webhook-smoke',
    'Invalid automation webhook action must echo a safe X-Request-Id header'
  );
  assert(
    invalidAutomationWebhook.body?.request_id === 'gcsc-invalid-webhook-smoke',
    'Invalid automation webhook action must include request_id in the response body'
  );

  const invalidWebhookDocumentType = await request(baseUrl, '/api/webhook', {
    method: 'POST',
    headers: { 'X-Request-Id': 'gcsc-invalid-webhook-doc-type-smoke' },
    body: JSON.stringify({
      action: 'generate',
      document_type: 'unsafe_live_loan_document',
    }),
  });
  assert(
    invalidWebhookDocumentType.status === 400,
    `Expected invalid webhook document_type to return 400, got ${invalidWebhookDocumentType.status}`
  );
  assert(
    invalidWebhookDocumentType.body?.details?.some((detail) => detail.includes('document_type must be one of')),
    'Invalid webhook document_type must explain the allowed document types'
  );
  assert(
    invalidWebhookDocumentType.headers.get('x-request-id') === 'gcsc-invalid-webhook-doc-type-smoke',
    'Invalid webhook document_type must echo a safe X-Request-Id header'
  );
  assert(
    invalidWebhookDocumentType.body?.request_id === 'gcsc-invalid-webhook-doc-type-smoke',
    'Invalid webhook document_type must include request_id in the response body'
  );

  let limitedQuickAnswer = null;
  for (let index = 0; index < 21; index += 1) {
    limitedQuickAnswer = await request(baseUrl, '/api/quick', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }
  assert(
    limitedQuickAnswer.status === 429,
    `Expected shared chat/API rate limiter to return 429, got ${limitedQuickAnswer.status}`
  );
  assert(
    limitedQuickAnswer.headers.get('x-request-id') === limitedQuickAnswer.body?.request_id,
    'Shared chat/API rate-limit response must echo X-Request-Id in the JSON body'
  );

  const invalidJson = await request(baseUrl, '/api/chat', {
    method: 'POST',
    headers: { 'X-Request-Id': 'gcsc-invalid-json-smoke' },
    body: '{"messages":',
  });
  assert(invalidJson.status === 400, `Expected invalid JSON body to return 400, got ${invalidJson.status}`);
  assert(invalidJson.body?.error === 'Invalid JSON body', 'Invalid JSON response must use a clear error message');
  assert(
    invalidJson.headers.get('x-request-id') === 'gcsc-invalid-json-smoke',
    'Invalid JSON response must echo a safe X-Request-Id header'
  );
  assert(
    invalidJson.body?.request_id === 'gcsc-invalid-json-smoke',
    'Invalid JSON response must include request_id in the response body'
  );

  const missingApiRoute = await request(baseUrl, '/api/does-not-exist', {
    headers: { 'X-Request-Id': 'gcsc-missing-api-route-smoke' },
  });
  assert(missingApiRoute.status === 404, `Expected missing API route to return 404, got ${missingApiRoute.status}`);
  assert(missingApiRoute.body?.error === 'API route not found', 'Missing API route must use JSON error response');
  assert(
    missingApiRoute.headers.get('x-request-id') === 'gcsc-missing-api-route-smoke',
    'Missing API route response must echo a safe X-Request-Id header'
  );
  assert(
    missingApiRoute.body?.request_id === 'gcsc-missing-api-route-smoke',
    'Missing API route response must include request_id in the response body'
  );

  const optionalRealSession = await runOptionalRealSessionChecks(baseUrl);

  console.log(JSON.stringify({
    status: 'passed',
    static_guard_coverage: 'passed',
    basic_endpoint_checks: {
      health: health.status,
      security_headers: 'passed',
      request_id_header: 'passed',
      suggestions: suggestions.status,
      payment_providers: paymentProviders.status,
      metal_pay_signature: metalPaySignature.status,
      verification_providers: verificationProviders.status,
      session_without_token: sessionNoToken.status,
      profile_without_token: profileNoToken.status,
      invalid_magic_link: invalidMagicLink.status,
      magic_link_rate_limit: limitedMagicLink.status,
      slack_url_verification: slackChallenge.status,
      invalid_slack_event: invalidSlackEvent.status,
      invalid_automation_webhook: invalidAutomationWebhook.status,
      invalid_webhook_document_type: invalidWebhookDocumentType.status,
      invalid_json_body: invalidJson.status,
      missing_api_route: missingApiRoute.status,
      admin_access_model: accessModel.status,
      admin_me: adminMe.status,
      auth_protection_status: protectionStatus.status,
      auth_readiness: authReadiness.status,
      launch_readiness: launchReadiness.status,
      founder_action_center: founderActions.status,
      founder_auth_setup: founderAuthSetup.status,
      supabase_boundary: boundary.status,
      mobile_install_readiness: mobileInstallReadiness.status,
      beta_readiness: betaReadiness.status,
    },
    optional_real_session: optionalRealSession,
  }, null, 2));
} finally {
  server.close();
}
