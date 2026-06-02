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
    "app.get('/api/admin/smartcontractor-workflow-readiness'",
    'Unsupported workflow readiness queue_filter',
    'No live workflow action was attempted.',
    'no_live_action_attempted: true',
    "app.get('/api/admin/contract-backed-loan/repayment-waterfall/review-packet'",
    "app.get('/api/admin/smart-contract-helper-index'",
    'selected_helper_category_filter',
    'valid_helper_category_filter_ids',
    'Unsupported smart contract helper category_filter',
    'No live helper-index action was attempted.',
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
    'res.json({ project_contracts: data, request_id: req.id || null })'
  );
  assertRouteUsesSharedDatabaseError(
    "app.get('/api/smartcontractor/milestones'",
    'res.json({ milestones: data, request_id: req.id || null })'
  );
  assertRouteUsesSharedDatabaseError(
    "app.get('/api/smartcontractor/loans'",
    'res.json({ loans: data, request_id: req.id || null })'
  );
  assertRouteUsesSharedDatabaseError(
    "app.get('/api/smartcontractor/disputes'",
    'res.json({ disputes: data, request_id: req.id || null })'
  );
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
  assert(health.body?.features?.includes('smartcontractor-workflow-readiness'), 'Health must advertise smartcontractor-workflow-readiness');
  assert(health.body?.features?.includes('repayment-waterfall-review-packet'), 'Health must advertise repayment-waterfall-review-packet');

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
    'res.status(201).json({ payment_intent: intent, request_id: req.id || null });',
    'Payment intent create success must include request_id in the response body'
  );
  assertSourceIncludes(
    'res.status(202).json({ payment_event: paymentEvent, payment_intent: updatedIntent, request_id: req.id || null });',
    'Payment webhook success must include request_id in the response body'
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
    'res.status(201).json({ verification_check: data, request_id: req.id || null });',
    'Verification check create success must include request_id in the response body'
  );
  assertSourceIncludes(
    'res.status(202).json({ verification_event: event, verification_check: updatedCheck, request_id: req.id || null });',
    'Verification webhook success must include request_id in the response body'
  );
  assertSourceIncludes(
    'res.json({ price_snapshots: data, request_id: req.id || null });',
    'Price snapshot list must include request_id in the response body'
  );
  assertSourceIncludes(
    'res.status(201).json({ price_snapshot: data, request_id: req.id || null });',
    'Price snapshot create success must include request_id in the response body'
  );
  assertSourceIncludes(
    'res.json({ collateral_locks: data, request_id: req.id || null });',
    'Collateral lock list must include request_id in the response body'
  );
  assertSourceIncludes(
    'res.status(201).json({ collateral_lock: data, request_id: req.id || null });',
    'Collateral lock create success must include request_id in the response body'
  );
  assertSourceIncludes(
    'res.status(201).json({ profile: data, request_id: req.id || null });',
    'SmartContractor profile create success must include request_id in the response body'
  );
  assertSourceIncludes(
    'res.status(201).json({ contractor: data, request_id: req.id || null });',
    'SmartContractor contractor create success must include request_id in the response body'
  );
  assertSourceIncludes(
    'res.status(201).json({ homeowner: data, request_id: req.id || null });',
    'SmartContractor homeowner create success must include request_id in the response body'
  );
  assertSourceIncludes(
    'res.json({ jobs: data, request_id: req.id || null });',
    'SmartContractor job list must include request_id in the response body'
  );
  assertSourceIncludes(
    'res.status(201).json({ job: data, request_id: req.id || null });',
    'SmartContractor job create success must include request_id in the response body'
  );

  assertSourceIncludes(
    'res.json({ bids: data, request_id: req.id || null });',
    'SmartContractor bid list must include request_id in the response body'
  );
  assertSourceIncludes(
    'res.status(201).json({ bid: data, request_id: req.id || null });',
    'SmartContractor bid create success must include request_id in the response body'
  );

  assertSourceIncludes(
    'res.json({ project_contracts: data, request_id: req.id || null });',
    'SmartContractor project contract list must include request_id in the response body'
  );
  assertSourceIncludes(
    'res.status(201).json({ project_contract: data, request_id: req.id || null });',
    'SmartContractor project contract create success must include request_id in the response body'
  );

  assertSourceIncludes(
    'res.json({ milestones: data, request_id: req.id || null });',
    'SmartContractor milestone list must include request_id in the response body'
  );
  assertSourceIncludes(
    'res.status(201).json({ milestone: data, request_id: req.id || null });',
    'SmartContractor milestone create success must include request_id in the response body'
  );

  assertSourceIncludes(
    'res.json({ loans: data, request_id: req.id || null });',
    'SmartContractor loan list must include request_id in the response body'
  );
  assertSourceIncludes(
    'res.status(201).json({ loan: data, request_id: req.id || null });',
    'SmartContractor loan request create success must include request_id in the response body'
  );
  assertSourceIncludes(
    'res.status(201).json({ repayment, loan: updatedLoan, request_id: req.id || null });',
    'SmartContractor loan repayment create success must include request_id in the response body'
  );
  assertSourceIncludes(
    'res.json({ disputes: data, request_id: req.id || null });',
    'SmartContractor dispute list must include request_id in the response body'
  );
  assertSourceIncludes(
    'res.status(201).json({ dispute: data, request_id: req.id || null });',
    'SmartContractor dispute create success must include request_id in the response body'
  );
  assertSourceIncludes(
    'res.status(201).json({ evidence: data, request_id: req.id || null });',
    'SmartContractor dispute evidence create success must include request_id in the response body'
  );
  assertSourceIncludes(
    'res.status(201).json({ review: data, request_id: req.id || null });',
    'SmartContractor dispute peer review create success must include request_id in the response body'
  );
  assertSourceIncludes(
    "res.json({\n    request_id: req.id || null,\n    generated_at: new Date().toISOString(),\n    mode: 'mvp_review_console',",
    'Admin risk console must include request_id in the response body'
  );
  assertSourceIncludes(
    "res.json({\n    authenticated: true,\n    request_id: req.id || null,\n    user:",
    'Auth session-check success must include request_id in the response body'
  );
  assertSourceIncludes(
    "res.json({\n    authenticated: true,\n    request_id: req.id || null,\n    user: {\n      id: req.authUser.id,\n      email: req.authUser.email || null,\n      role: req.authUser.role || null,\n    },\n    profile,",
    'Auth profile success must include request_id in the response body'
  );
  assertSourceIncludes(
    'res.json({ answer: response.choices[0].message.content, request_id: req.id || null });',
    'Quick answer success must include request_id in the response body'
  );
  assertSourceIncludes(
    "answer: response.choices[0]?.message?.content,\n        request_id: req.id || null,",
    'Automation webhook ask success must include request_id in the response body'
  );
  assertSourceIncludes(
    "document: response.choices[0]?.message?.content,\n        request_id: req.id || null,",
    'Automation webhook generate success must include request_id in the response body'
  );
  assertSourceIncludes(
    "suggestions: response.choices[0]?.message?.content,\n        request_id: req.id || null,",
    'Automation webhook suggest success must include request_id in the response body'
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

  const founderAuthSetupReport = await request(baseUrl, '/api/admin/founder-auth-setup/report', {
    headers: { 'X-Request-Id': 'gcsc-founder-auth-setup-report-smoke' },
  });
  assert(founderAuthSetupReport.status === 200, `Expected founder-auth-setup report 200, got ${founderAuthSetupReport.status}`);
  assert(
    founderAuthSetupReport.headers.get('x-request-id') === 'gcsc-founder-auth-setup-report-smoke',
    'Founder Auth Setup report must echo a safe X-Request-Id header'
  );
  assert(
    founderAuthSetupReport.body?.request_id === 'gcsc-founder-auth-setup-report-smoke',
    'Founder Auth Setup report must include request_id in the response body'
  );
  assert(
    founderAuthSetupReport.body?.mode === 'founder_auth_setup_report',
    'Founder Auth Setup report must expose founder_auth_setup_report mode'
  );
  assert(Array.isArray(founderAuthSetupReport.body?.report_sections), 'Founder Auth Setup report must return report_sections array');
  assert(
    founderAuthSetupReport.body?.copyable_founder_steps?.includes('Magic Link'),
    'Founder Auth Setup report must include copyable Magic Link steps'
  );
  assert(
    founderAuthSetupReport.body?.report_gate?.founder_admin_membership_approval_blocked === 'blocked',
    'Founder Auth Setup report must block founder admin membership approval'
  );
  assert(
    founderAuthSetupReport.body?.no_live_action_attempted === true,
    'Founder Auth Setup report must not attempt live actions'
  );

  const founderAuthSetupPrintTemplate = await request(baseUrl, '/api/admin/founder-auth-setup/print-template', {
    headers: { 'X-Request-Id': 'gcsc-founder-auth-setup-print-template-smoke' },
  });
  assert(
    founderAuthSetupPrintTemplate.status === 200,
    `Expected founder-auth-setup print template 200, got ${founderAuthSetupPrintTemplate.status}`
  );
  assert(
    founderAuthSetupPrintTemplate.headers.get('x-request-id') === 'gcsc-founder-auth-setup-print-template-smoke',
    'Founder Auth Setup print template must echo a safe X-Request-Id header'
  );
  assert(
    founderAuthSetupPrintTemplate.body?.request_id === 'gcsc-founder-auth-setup-print-template-smoke',
    'Founder Auth Setup print template must include request_id in the response body'
  );
  assert(
    founderAuthSetupPrintTemplate.body?.mode === 'founder_auth_setup_print_template',
    'Founder Auth Setup print template must expose founder_auth_setup_print_template mode'
  );
  assert(
    founderAuthSetupPrintTemplate.body?.print_template_sections?.some((item) => item.id === 'founder_session_evidence'),
    'Founder Auth Setup print template must include founder_session_evidence section'
  );
  assert(
    founderAuthSetupPrintTemplate.body?.evidence_redaction_attestation?.no_magic_link_urls_in_template === true,
    'Founder Auth Setup print template must block Magic Link URLs from the template'
  );
  assert(
    founderAuthSetupPrintTemplate.body?.export_gate?.external_send === 'blocked',
    'Founder Auth Setup print template must block external send'
  );
  assert(
    founderAuthSetupPrintTemplate.body?.copyable_markdown_preview?.includes('Founder Auth Setup Print Template'),
    'Founder Auth Setup print template must include copyable markdown preview'
  );
  assert(
    founderAuthSetupPrintTemplate.body?.no_live_action_attempted === true,
    'Founder Auth Setup print template must not attempt live actions'
  );

  const strictAdminSmokeReadiness = await request(baseUrl, '/api/admin/strict-admin-smoke-readiness', {
    headers: { 'X-Request-Id': 'gcsc-strict-admin-smoke-readiness-smoke' },
  });
  assert(
    strictAdminSmokeReadiness.status === 200,
    `Expected strict-admin-smoke-readiness 200, got ${strictAdminSmokeReadiness.status}`
  );
  assert(
    strictAdminSmokeReadiness.headers.get('x-request-id') === 'gcsc-strict-admin-smoke-readiness-smoke',
    'Strict admin smoke readiness must echo a safe X-Request-Id header'
  );
  assert(
    strictAdminSmokeReadiness.body?.request_id === 'gcsc-strict-admin-smoke-readiness-smoke',
    'Strict admin smoke readiness must include request_id in the response body'
  );
  assert(
    strictAdminSmokeReadiness.body?.mode === 'strict_admin_smoke_readiness',
    'Strict admin smoke readiness must expose strict_admin_smoke_readiness mode'
  );
  assert(
    strictAdminSmokeReadiness.body?.smoke_readiness_sections?.some((item) => item.id === 'same_browser_founder_session'),
    'Strict admin smoke readiness must include same_browser_founder_session section'
  );
  assert(
    strictAdminSmokeReadiness.body?.strict_admin_smoke_gate?.founder_admin_membership_required === 'blocked_or_review',
    'Strict admin smoke readiness must require founder admin membership before strict smoke'
  );
  assert(
    strictAdminSmokeReadiness.body?.copyable_smoke_commands?.includes('npm run check:strict-gates'),
    'Strict admin smoke readiness must include local strict-gates command'
  );
  assert(
    strictAdminSmokeReadiness.body?.copyable_smoke_commands?.includes('npm run check:strict-admin-smoke'),
    'Strict admin smoke readiness must include local strict-admin-smoke command'
  );
  assert(
    strictAdminSmokeReadiness.body?.no_live_action_attempted === true,
    'Strict admin smoke readiness must not attempt live actions'
  );

  const strictAdminSmokeOutputTemplate = await request(baseUrl, '/api/admin/strict-admin-smoke-output-template', {
    headers: { 'X-Request-Id': 'gcsc-strict-admin-smoke-output-template-smoke' },
  });
  assert(
    strictAdminSmokeOutputTemplate.status === 200,
    `Expected strict-admin-smoke-output-template 200, got ${strictAdminSmokeOutputTemplate.status}`
  );
  assert(
    strictAdminSmokeOutputTemplate.headers.get('x-request-id') === 'gcsc-strict-admin-smoke-output-template-smoke',
    'Strict admin smoke output template must echo a safe X-Request-Id header'
  );
  assert(
    strictAdminSmokeOutputTemplate.body?.request_id === 'gcsc-strict-admin-smoke-output-template-smoke',
    'Strict admin smoke output template must include request_id in the response body'
  );
  assert(
    strictAdminSmokeOutputTemplate.body?.mode === 'strict_admin_smoke_output_template',
    'Strict admin smoke output template must expose strict_admin_smoke_output_template mode'
  );
  assert(
    strictAdminSmokeOutputTemplate.body?.output_template_sections?.some((item) => item.id === 'strict_gates_output_capture'),
    'Strict admin smoke output template must include strict_gates_output_capture section'
  );
  assert(
    strictAdminSmokeOutputTemplate.body?.output_capture_gate?.live_supabase_change === 'blocked',
    'Strict admin smoke output template must block live Supabase changes'
  );
  assert(
    strictAdminSmokeOutputTemplate.body?.copyable_output_template?.includes('npm run check:strict-gates'),
    'Strict admin smoke output template must include strict-gates command in copyable output template'
  );
  assert(
    strictAdminSmokeOutputTemplate.body?.copyable_output_template?.includes('npm run check:strict-admin-smoke'),
    'Strict admin smoke output template must include strict-admin-smoke command in copyable output template'
  );
  assert(
    strictAdminSmokeOutputTemplate.body?.no_live_action_attempted === true,
    'Strict admin smoke output template must not attempt live actions'
  );

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
  assert(Array.isArray(boundary.body?.boundary_checks), 'Supabase boundary must return boundary_checks array');
  assert(
    boundary.body.boundary_checks.some((item) => item.id === 'service_role_server_only_check'),
    'Supabase boundary checks must include service_role_server_only_check'
  );
  assert(
    boundary.body.boundary_checks.some((item) => item.id === 'browser_publishable_only_check'),
    'Supabase boundary checks must include browser_publishable_only_check'
  );
  assert(
    boundary.body.boundary_checks.some((item) => item.id === 'live_supabase_change_block'),
    'Supabase boundary checks must include live_supabase_change_block'
  );
  assert(
    boundary.body?.public_beta_gate?.strict_admin_public_beta_gate,
    'Supabase boundary must return strict_admin_public_beta_gate'
  );
  assert(
    boundary.body?.public_beta_gate?.live_supabase_change === 'blocked',
    'Supabase boundary must block live Supabase changes'
  );

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
  assert(Array.isArray(mobileInstallReadiness.body?.evidence_checklist), 'Mobile install readiness must return evidence_checklist array');
  assert(
    mobileInstallReadiness.body.evidence_checklist.some((item) => item.id === 'offline_shell_check'),
    'Mobile install readiness evidence checklist must include offline_shell_check'
  );
  assert(
    mobileInstallReadiness.body.evidence_checklist.some((item) => item.id === 'service_worker_api_boundary_check'),
    'Mobile install readiness evidence checklist must include service_worker_api_boundary_check'
  );
  assert(
    mobileInstallReadiness.body.evidence_checklist.some((item) => item.id === 'no_store_submission_or_real_money_release'),
    'Mobile install readiness evidence checklist must include no_store_submission_or_real_money_release'
  );
  assert(
    mobileInstallReadiness.body?.release_gate?.app_store_submission === 'blocked',
    'Mobile install readiness must block app store submission'
  );
  assert(
    mobileInstallReadiness.body?.release_gate?.real_money_mobile_release === 'blocked',
    'Mobile install readiness must block real-money mobile release'
  );

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
  assert(betaReadiness.body?.go_no_go_rules?.some((item) => item.includes('gcscworkcap1')), 'Beta readiness must no-go live smart contract product-surface confusion');
  assert(betaReadiness.body?.tester_day_checklist?.some((item) => item.includes('Open SmartContractor local demo')), 'Beta readiness must return tester_day_checklist');
  assert(betaReadiness.body?.tester_day_checklist?.some((item) => item.includes('gcscadvance1')), 'Beta readiness must include smart contract product-surface tester step');
  assert(betaReadiness.body?.issue_intake_fields?.safe_reproduction_steps === 'required', 'Beta readiness must return issue_intake_fields');
  assert(betaReadiness.body?.issue_intake_fields?.smart_contract_product_surface?.includes('gcscworkcap1'), 'Beta readiness must return smart contract product surface issue intake');
  assert(betaReadiness.body?.evidence_retention_policy?.some((item) => item.includes('Redact screenshots')), 'Beta readiness must return evidence_retention_policy');

  const repaymentWaterfallReviewPacket = await request(baseUrl, '/api/admin/contract-backed-loan/repayment-waterfall/review-packet', {
    headers: { 'X-Request-Id': 'gcsc-waterfall-review-packet-auth-smoke' },
  });
  assert(repaymentWaterfallReviewPacket.status === 200, `Expected repayment-waterfall review-packet 200, got ${repaymentWaterfallReviewPacket.status}`);
  assert(
    repaymentWaterfallReviewPacket.headers.get('x-request-id') === 'gcsc-waterfall-review-packet-auth-smoke',
    'Repayment waterfall review packet endpoint must echo a safe X-Request-Id header'
  );
  assert(
    repaymentWaterfallReviewPacket.body?.request_id === 'gcsc-waterfall-review-packet-auth-smoke',
    'Repayment waterfall review packet endpoint must include request_id in the response body'
  );
  assert(
    repaymentWaterfallReviewPacket.body?.review_packet?.status === 'HOLD_FOR_FOUNDER_LEGAL_PROVIDER_REVIEW',
    'Repayment waterfall review packet endpoint must keep review-held status'
  );
  assert(
    repaymentWaterfallReviewPacket.body?.review_packet?.deployment_status === 'BLOCKED_FOR_LIVE',
    'Repayment waterfall review packet endpoint must keep live deployment blocked'
  );
  assert(
    repaymentWaterfallReviewPacket.body?.review_packet?.local_only === true,
    'Repayment waterfall review packet endpoint must stay local_only'
  );
  assert(
    repaymentWaterfallReviewPacket.body?.blocked_next_action === 'FOUNDER_LEGAL_PROVIDER_SECURITY_REVIEW_REQUIRED',
    'Repayment waterfall review packet endpoint must require founder/legal/provider/security review'
  );

  const helperIndex = await request(baseUrl, '/api/admin/smart-contract-helper-index?category_filter=all_helper_categories', {
    headers: { 'X-Request-Id': 'gcsc-helper-index-auth-smoke' },
  });
  assert(helperIndex.status === 200, `Expected smart-contract-helper-index 200, got ${helperIndex.status}`);
  assert(
    helperIndex.headers.get('x-request-id') === 'gcsc-helper-index-auth-smoke',
    'Smart contract helper index endpoint must echo a safe X-Request-Id header'
  );
  assert(
    helperIndex.body?.request_id === 'gcsc-helper-index-auth-smoke',
    'Smart contract helper index endpoint must include request_id in the response body'
  );
  assert(helperIndex.body?.mode === 'smart_contract_helper_index', 'Smart contract helper index must return smart_contract_helper_index mode');
  assert(helperIndex.body?.local_only === true, 'Smart contract helper index must stay local_only');
  assert(helperIndex.body?.deployment_status === 'BLOCKED_FOR_LIVE', 'Smart contract helper index must keep live deployment blocked');
  assert(
    helperIndex.body?.selected_helper_category_filter?.id === 'all_helper_categories',
    'Smart contract helper index must echo the selected all-helper category filter'
  );
  assert(
    Array.isArray(helperIndex.body?.filtered_helper_categories) && helperIndex.body.filtered_helper_categories.length === 4,
    'Smart contract helper index must return all four local helper categories for the all-helper filter'
  );
  assert(
    helperIndex.body?.blocked_live_actions?.includes('xpr_signature_request') &&
      helperIndex.body?.blocked_live_actions?.includes('real_loan_approval') &&
      helperIndex.body?.blocked_live_actions?.includes('token_collateral_lock'),
    'Smart contract helper index must keep signature, real-loan, and token-collateral actions blocked'
  );

  const helperIndexInvalid = await request(baseUrl, '/api/admin/smart-contract-helper-index?category_filter=approve_real_loan', {
    headers: { 'X-Request-Id': 'gcsc-helper-index-invalid-filter-smoke' },
  });
  assert(helperIndexInvalid.status === 400, `Expected invalid helper-index filter 400, got ${helperIndexInvalid.status}`);
  assert(
    helperIndexInvalid.headers.get('x-request-id') === 'gcsc-helper-index-invalid-filter-smoke',
    'Invalid smart contract helper index filter response must echo a safe X-Request-Id header'
  );
  assert(
    helperIndexInvalid.body?.request_id === 'gcsc-helper-index-invalid-filter-smoke',
    'Invalid smart contract helper index filter response must include request_id in the response body'
  );
  assert(
    helperIndexInvalid.body?.error === 'Unsupported smart contract helper category_filter',
    'Invalid smart contract helper index filter must return a clear unsupported-filter error'
  );
  assert(
    helperIndexInvalid.body?.deployment_status === 'BLOCKED_FOR_LIVE',
    'Invalid smart contract helper index filter must keep live deployment blocked'
  );
  assert(
    helperIndexInvalid.body?.no_live_action_attempted === true,
    'Invalid smart contract helper index filter must confirm no live action was attempted'
  );
  assert(
    Array.isArray(helperIndexInvalid.body?.valid_helper_category_filter_ids) &&
      helperIndexInvalid.body.valid_helper_category_filter_ids.includes('all_helper_categories'),
    'Invalid smart contract helper index filter must return valid local-only filter IDs'
  );
  assert(betaReadiness.body?.tester_handoff_packet?.includes('docs/smartcontractor-beta-tester-invite.md'), 'Beta readiness must return tester_handoff_packet');
  assert(betaReadiness.body?.session_stop_conditions?.some((item) => item.includes('Stop the session')), 'Beta readiness must return session_stop_conditions');
  assert(betaReadiness.body?.post_session_actions?.some((item) => item.includes('Update the beta decision log')), 'Beta readiness must return post_session_actions');
  assert(betaReadiness.body?.public_beta_exit_criteria?.some((item) => item.includes('Do not move to public beta')), 'Beta readiness must return public_beta_exit_criteria');
  assert(betaReadiness.body?.pre_invite_checks?.some((item) => item.includes('Do not invite testers')), 'Beta readiness must return pre_invite_checks');
  assert(betaReadiness.body?.invite_message_checklist?.some((item) => item.includes('no real-money promises')), 'Beta readiness must return invite_message_checklist');
  assert(betaReadiness.body?.tester_consent_checklist?.some((item) => item.includes('Tester understands')), 'Beta readiness must return tester_consent_checklist');
  assert(betaReadiness.body?.tester_role_briefing?.some((item) => item.includes('Homeowner tester')), 'Beta readiness must return tester_role_briefing');
  assert(betaReadiness.body?.tester_success_signals?.some((item) => item.includes('Tester can explain')), 'Beta readiness must return tester_success_signals');
  assert(betaReadiness.body?.tester_success_signals?.some((item) => item.includes('gcscclaim111')), 'Beta readiness must return smart contract product-surface success signals');
  assert(betaReadiness.body?.tester_failure_signals?.some((item) => item.includes('Tester cannot explain')), 'Beta readiness must return tester_failure_signals');
  assert(betaReadiness.body?.tester_failure_signals?.some((item) => item.includes('gcsccredit11')), 'Beta readiness must return smart contract product-surface failure signals');
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
  assert(betaReadiness.body.required_docs.some((doc) => doc.id === 'beta_evidence_checklist'), 'Beta readiness must include beta evidence checklist doc');
  assert(betaReadiness.body.required_docs.some((doc) => doc.id === 'beta_tester_followup'), 'Beta readiness must include beta tester follow-up doc');
  assert(betaReadiness.body.required_docs.some((doc) => doc.id === 'founder_action_queue'), 'Beta readiness must include founder action queue doc');
  assert(betaReadiness.body.checks.some((item) => item.id === 'smart_contract_product_surfaces_demo_only'), 'Beta readiness must include smart contract product surface gate');
  assert(betaReadiness.body.next_safe_steps.some((step) => step.includes('token custody approvals')), 'Beta readiness must keep smart contract approvals separated');
  assert(betaReadiness.body.next_safe_steps.some((step) => step.includes('ClaimBridge advance funding')), 'Beta readiness must keep ClaimBridge advance funding approvals separated');
  assert(betaReadiness.body.next_safe_steps.some((step) => step.includes('contract-backed working-capital funding')), 'Beta readiness must keep contract-backed working-capital funding approvals separated');
  assert(betaReadiness.body.next_safe_steps.some((step) => step.includes('escrow-backed advance payout')), 'Beta readiness must keep escrow-backed advance payout approvals separated');
  assert(betaReadiness.body.next_safe_steps.some((step) => step.includes('repayment routing')), 'Beta readiness must keep repayment routing approvals separated');
  assert(betaReadiness.body.blocked_until_founder.some((item) => item.includes('live smart contract deployment')), 'Beta readiness must keep live smart contract deployment founder-blocked');
  assert(betaReadiness.body.next_safe_steps.some((step) => step.includes('smartcontractor-founder-action-queue.md')), 'Beta readiness must point to founder action queue next step');

  const workflowReadiness = await request(baseUrl, '/api/admin/smartcontractor-workflow-readiness', {
    headers: { 'X-Request-Id': 'gcsc-workflow-readiness-auth-smoke' },
  });
  assert(workflowReadiness.status === 200, `Expected smartcontractor-workflow-readiness 200, got ${workflowReadiness.status}`);
  assert(
    workflowReadiness.headers.get('x-request-id') === 'gcsc-workflow-readiness-auth-smoke',
    'SmartContractor workflow readiness must echo a safe X-Request-Id header'
  );
  assert(
    workflowReadiness.body?.request_id === 'gcsc-workflow-readiness-auth-smoke',
    'SmartContractor workflow readiness must include request_id in the response body'
  );
  assert(
    workflowReadiness.body?.positioning === 'Construction Trust Infrastructure',
    'SmartContractor workflow readiness must expose Construction Trust Infrastructure positioning'
  );
  assert(
    workflowReadiness.body?.workflow_steps?.some((step) => step.id === 'escrow_ready_milestones'),
    'SmartContractor workflow readiness must include escrow-ready milestones'
  );
  assert(
    workflowReadiness.body?.workflow_steps?.every((step) => step.live_action_status === 'BLOCKED_FOR_LIVE'),
    'SmartContractor workflow readiness must keep every workflow step blocked for live action'
  );
  assert(
    workflowReadiness.body?.demo_only_boundaries?.includes('no_real_payments'),
    'SmartContractor workflow readiness must keep real payments blocked'
  );

  const workflowReadinessFiltered = await request(baseUrl, '/api/admin/smartcontractor-workflow-readiness?queue_filter=working_capital_review', {
    headers: { 'X-Request-Id': 'gcsc-workflow-readiness-filter-smoke' },
  });
  assert(workflowReadinessFiltered.status === 200, `Expected filtered smartcontractor-workflow-readiness 200, got ${workflowReadinessFiltered.status}`);
  assert(
    workflowReadinessFiltered.headers.get('x-request-id') === 'gcsc-workflow-readiness-filter-smoke',
    'Filtered SmartContractor workflow readiness must echo a safe X-Request-Id header'
  );
  assert(
    workflowReadinessFiltered.body?.request_id === 'gcsc-workflow-readiness-filter-smoke',
    'Filtered SmartContractor workflow readiness must include request_id in the response body'
  );
  assert(
    workflowReadinessFiltered.body?.selected_checkpoint_queue_filter?.id === 'working_capital_review',
    'Filtered SmartContractor workflow readiness must echo the selected working-capital queue filter'
  );
  assert(
    Array.isArray(workflowReadinessFiltered.body?.filtered_checkpoint_action_queue) &&
      workflowReadinessFiltered.body.filtered_checkpoint_action_queue.length === 1 &&
      workflowReadinessFiltered.body.filtered_checkpoint_action_queue[0]?.checkpoint_id === 'working_capital_review_ready',
    'Filtered SmartContractor workflow readiness must return only the working-capital queue item'
  );
  assert(
    workflowReadinessFiltered.body?.selected_checkpoint_queue_review_context?.blocked_live_actions?.includes('approve_real_loan'),
    'Filtered SmartContractor workflow readiness must keep real loan approval blocked'
  );
  assert(
    workflowReadinessFiltered.body?.selected_checkpoint_queue_review_links?.some((link) => link.review_packet_target === 'working_capital_provider_review_packet'),
    'Filtered SmartContractor workflow readiness must return the working-capital provider review packet link'
  );

  const workflowReadinessInvalid = await request(baseUrl, '/api/admin/smartcontractor-workflow-readiness?queue_filter=approve_real_loan', {
    headers: { 'X-Request-Id': 'gcsc-workflow-readiness-invalid-filter-smoke' },
  });
  assert(workflowReadinessInvalid.status === 400, `Expected invalid workflow readiness filter 400, got ${workflowReadinessInvalid.status}`);
  assert(
    workflowReadinessInvalid.headers.get('x-request-id') === 'gcsc-workflow-readiness-invalid-filter-smoke',
    'Invalid workflow readiness filter response must echo a safe X-Request-Id header'
  );
  assert(
    workflowReadinessInvalid.body?.request_id === 'gcsc-workflow-readiness-invalid-filter-smoke',
    'Invalid workflow readiness filter response must include request_id in the response body'
  );
  assert(
    workflowReadinessInvalid.body?.error === 'Unsupported workflow readiness queue_filter',
    'Invalid workflow readiness filter must return a clear unsupported-filter error'
  );
  assert(
    workflowReadinessInvalid.body?.status === 'BLOCKED_FOR_LIVE',
    'Invalid workflow readiness filter must keep live workflow action blocked'
  );
  assert(
    workflowReadinessInvalid.body?.no_live_action_attempted === true,
    'Invalid workflow readiness filter must confirm no live action was attempted'
  );
  assert(
    Array.isArray(workflowReadinessInvalid.body?.valid_checkpoint_queue_filter_ids) &&
      workflowReadinessInvalid.body.valid_checkpoint_queue_filter_ids.includes('all_review_items'),
    'Invalid workflow readiness filter must return valid local-only queue filter IDs'
  );

  const disputeEvidenceReadiness = await request(baseUrl, '/api/admin/dispute-evidence-readiness', {
    headers: { 'X-Request-Id': 'gcsc-dispute-evidence-readiness-smoke' },
  });
  assert(disputeEvidenceReadiness.status === 200, `Expected dispute evidence readiness 200, got ${disputeEvidenceReadiness.status}`);
  assert(
    disputeEvidenceReadiness.headers.get('x-request-id') === 'gcsc-dispute-evidence-readiness-smoke',
    'Dispute evidence readiness must echo a safe X-Request-Id header'
  );
  assert(
    disputeEvidenceReadiness.body?.request_id === 'gcsc-dispute-evidence-readiness-smoke',
    'Dispute evidence readiness must include request_id in the response body'
  );
  assert(
    disputeEvidenceReadiness.body?.mode === 'dispute_evidence_readiness',
    'Dispute evidence readiness must expose the dispute_evidence_readiness mode'
  );
  assert(
    disputeEvidenceReadiness.body?.readiness_checks?.some((item) => item.id === 'dispute_intake_check'),
    'Dispute evidence readiness must include dispute intake check'
  );
  assert(
    disputeEvidenceReadiness.body?.readiness_checks?.some((item) => item.id === 'evidence_metadata_check'),
    'Dispute evidence readiness must include evidence metadata check'
  );
  assert(
    disputeEvidenceReadiness.body?.readiness_checks?.some((item) => item.id === 'peer_review_check'),
    'Dispute evidence readiness must include peer review check'
  );
  assert(
    disputeEvidenceReadiness.body?.readiness_checks?.some((item) => item.id === 'legal_escrow_payment_block'),
    'Dispute evidence readiness must include legal escrow payment block'
  );
  assert(
    disputeEvidenceReadiness.body?.public_beta_gate?.live_dispute_decision === 'blocked',
    'Dispute evidence readiness must block live dispute decisions'
  );
  assert(
    disputeEvidenceReadiness.body?.blocked_live_actions?.includes('release_escrow'),
    'Dispute evidence readiness must block escrow release'
  );

  const milestoneEvidenceReadiness = await request(baseUrl, '/api/admin/milestone-evidence-readiness', {
    headers: { 'X-Request-Id': 'gcsc-milestone-evidence-readiness-smoke' },
  });
  assert(milestoneEvidenceReadiness.status === 200, `Expected milestone evidence readiness 200, got ${milestoneEvidenceReadiness.status}`);
  assert(
    milestoneEvidenceReadiness.headers.get('x-request-id') === 'gcsc-milestone-evidence-readiness-smoke',
    'Milestone evidence readiness must echo a safe X-Request-Id header'
  );
  assert(
    milestoneEvidenceReadiness.body?.request_id === 'gcsc-milestone-evidence-readiness-smoke',
    'Milestone evidence readiness must include request_id in the response body'
  );
  assert(
    milestoneEvidenceReadiness.body?.mode === 'milestone_evidence_readiness',
    'Milestone evidence readiness must expose the milestone_evidence_readiness mode'
  );
  assert(
    milestoneEvidenceReadiness.body?.readiness_checks?.some((item) => item.id === 'project_contract_context_check'),
    'Milestone evidence readiness must include project contract context check'
  );
  assert(
    milestoneEvidenceReadiness.body?.readiness_checks?.some((item) => item.id === 'milestone_scope_check'),
    'Milestone evidence readiness must include milestone scope check'
  );
  assert(
    milestoneEvidenceReadiness.body?.readiness_checks?.some((item) => item.id === 'work_progress_evidence_check'),
    'Milestone evidence readiness must include work progress evidence check'
  );
  assert(
    milestoneEvidenceReadiness.body?.readiness_checks?.some((item) => item.id === 'payment_escrow_release_block'),
    'Milestone evidence readiness must include payment escrow release block'
  );
  assert(
    milestoneEvidenceReadiness.body?.release_gate?.live_escrow_release === 'blocked',
    'Milestone evidence readiness must block live escrow release'
  );
  assert(
    milestoneEvidenceReadiness.body?.blocked_live_actions?.includes('move_payment'),
    'Milestone evidence readiness must block payment movement'
  );

  const workingCapitalReadiness = await request(baseUrl, '/api/admin/working-capital-readiness', {
    headers: { 'X-Request-Id': 'gcsc-working-capital-readiness-smoke' },
  });
  assert(workingCapitalReadiness.status === 200, `Expected working capital readiness 200, got ${workingCapitalReadiness.status}`);
  assert(
    workingCapitalReadiness.headers.get('x-request-id') === 'gcsc-working-capital-readiness-smoke',
    'Working capital readiness must echo a safe X-Request-Id header'
  );
  assert(
    workingCapitalReadiness.body?.request_id === 'gcsc-working-capital-readiness-smoke',
    'Working capital readiness must include request_id in the response body'
  );
  assert(
    workingCapitalReadiness.body?.mode === 'working_capital_readiness',
    'Working capital readiness must expose the working_capital_readiness mode'
  );
  assert(
    workingCapitalReadiness.body?.readiness_checks?.some((item) => item.id === 'contractor_identity_credit_check'),
    'Working capital readiness must include contractor identity and credit check'
  );
  assert(
    workingCapitalReadiness.body?.readiness_checks?.some((item) => item.id === 'project_contract_collateral_check'),
    'Working capital readiness must include project contract collateral check'
  );
  assert(
    workingCapitalReadiness.body?.readiness_checks?.some((item) => item.id === 'risk_score_affordability_check'),
    'Working capital readiness must include risk score affordability check'
  );
  assert(
    workingCapitalReadiness.body?.readiness_checks?.some((item) => item.id === 'repayment_waterfall_readiness_check'),
    'Working capital readiness must include repayment waterfall readiness check'
  );
  assert(
    workingCapitalReadiness.body?.readiness_checks?.some((item) => item.id === 'funding_approval_block'),
    'Working capital readiness must include funding approval block'
  );
  assert(
    workingCapitalReadiness.body?.funding_gate?.live_loan_approval === 'blocked',
    'Working capital readiness must block live loan approval'
  );
  assert(
    workingCapitalReadiness.body?.blocked_live_actions?.includes('fund_contractor'),
    'Working capital readiness must block contractor funding'
  );

  const contractorReputationReadiness = await request(baseUrl, '/api/admin/contractor-reputation-readiness', {
    headers: { 'X-Request-Id': 'gcsc-contractor-reputation-readiness-smoke' },
  });
  assert(
    contractorReputationReadiness.status === 200,
    `Expected contractor reputation readiness 200, got ${contractorReputationReadiness.status}`
  );
  assert(
    contractorReputationReadiness.headers.get('x-request-id') === 'gcsc-contractor-reputation-readiness-smoke',
    'Contractor reputation readiness must echo a safe X-Request-Id header'
  );
  assert(
    contractorReputationReadiness.body?.request_id === 'gcsc-contractor-reputation-readiness-smoke',
    'Contractor reputation readiness must include request_id in the response body'
  );
  assert(
    contractorReputationReadiness.body?.mode === 'contractor_reputation_readiness',
    'Contractor reputation readiness must expose the contractor_reputation_readiness mode'
  );
  assert(
    contractorReputationReadiness.body?.readiness_checks?.some((item) => item.id === 'completed_job_history_check'),
    'Contractor reputation readiness must include completed job history check'
  );
  assert(
    contractorReputationReadiness.body?.readiness_checks?.some((item) => item.id === 'rating_review_check'),
    'Contractor reputation readiness must include rating review check'
  );
  assert(
    contractorReputationReadiness.body?.readiness_checks?.some((item) => item.id === 'dispute_repayment_signal_check'),
    'Contractor reputation readiness must include dispute and repayment signal check'
  );
  assert(
    contractorReputationReadiness.body?.readiness_checks?.some((item) => item.id === 'bid_accuracy_response_check'),
    'Contractor reputation readiness must include bid accuracy and response check'
  );
  assert(
    contractorReputationReadiness.body?.readiness_checks?.some((item) => item.id === 'reputation_decision_block'),
    'Contractor reputation readiness must include reputation decision block'
  );
  assert(
    contractorReputationReadiness.body?.reputation_gate?.public_reputation_score === 'blocked',
    'Contractor reputation readiness must block public reputation score'
  );
  assert(
    contractorReputationReadiness.body?.blocked_live_actions?.includes('publish_reputation_score'),
    'Contractor reputation readiness must block publishing reputation score'
  );

  const contractorVerificationReadiness = await request(baseUrl, '/api/admin/contractor-verification-readiness', {
    headers: { 'X-Request-Id': 'gcsc-contractor-verification-readiness-smoke' },
  });
  assert(
    contractorVerificationReadiness.status === 200,
    `Expected contractor verification readiness 200, got ${contractorVerificationReadiness.status}`
  );
  assert(
    contractorVerificationReadiness.headers.get('x-request-id') === 'gcsc-contractor-verification-readiness-smoke',
    'Contractor verification readiness must echo a safe X-Request-Id header'
  );
  assert(
    contractorVerificationReadiness.body?.request_id === 'gcsc-contractor-verification-readiness-smoke',
    'Contractor verification readiness must include request_id in the response body'
  );
  assert(
    contractorVerificationReadiness.body?.mode === 'contractor_verification_readiness',
    'Contractor verification readiness must expose the contractor_verification_readiness mode'
  );
  assert(
    contractorVerificationReadiness.body?.readiness_checks?.some((item) => item.id === 'license_evidence_check'),
    'Contractor verification readiness must include license evidence check'
  );
  assert(
    contractorVerificationReadiness.body?.readiness_checks?.some((item) => item.id === 'insurance_evidence_check'),
    'Contractor verification readiness must include insurance evidence check'
  );
  assert(
    contractorVerificationReadiness.body?.readiness_checks?.some((item) => item.id === 'business_identity_check'),
    'Contractor verification readiness must include business identity check'
  );
  assert(
    contractorVerificationReadiness.body?.readiness_checks?.some((item) => item.id === 'compliance_provider_boundary_check'),
    'Contractor verification readiness must include compliance provider boundary check'
  );
  assert(
    contractorVerificationReadiness.body?.readiness_checks?.some((item) => item.id === 'verification_decision_block'),
    'Contractor verification readiness must include verification decision block'
  );
  assert(
    contractorVerificationReadiness.body?.verification_gate?.live_license_verification === 'blocked',
    'Contractor verification readiness must block live license verification'
  );
  assert(
    contractorVerificationReadiness.body?.blocked_live_actions?.includes('verify_contractor_live'),
    'Contractor verification readiness must block live contractor verification'
  );

  const adminReadinessOverview = await request(baseUrl, '/api/admin/readiness-overview?surface_filter=all_readiness_surfaces', {
    headers: { 'X-Request-Id': 'gcsc-admin-readiness-overview-smoke' },
  });
  assert(
    adminReadinessOverview.status === 200,
    `Expected admin readiness overview 200, got ${adminReadinessOverview.status}`
  );
  assert(
    adminReadinessOverview.headers.get('x-request-id') === 'gcsc-admin-readiness-overview-smoke',
    'Admin readiness overview must echo a safe X-Request-Id header'
  );
  assert(
    adminReadinessOverview.body?.request_id === 'gcsc-admin-readiness-overview-smoke',
    'Admin readiness overview must include request_id in the response body'
  );
  assert(
    adminReadinessOverview.body?.mode === 'admin_readiness_overview',
    'Admin readiness overview must expose the admin_readiness_overview mode'
  );
  assert(
    adminReadinessOverview.body?.readiness_surfaces?.some((item) => item.mode === 'contractor_verification_readiness'),
    'Admin readiness overview must include contractor verification readiness'
  );
  assert(
    adminReadinessOverview.body?.readiness_surfaces?.some((item) => item.mode === 'contractor_reputation_readiness'),
    'Admin readiness overview must include contractor reputation readiness'
  );
  assert(
    adminReadinessOverview.body?.readiness_surfaces?.some((item) => item.mode === 'working_capital_readiness'),
    'Admin readiness overview must include working capital readiness'
  );
  assert(
    adminReadinessOverview.body?.readiness_surfaces?.some((item) => item.mode === 'milestone_evidence_readiness'),
    'Admin readiness overview must include milestone evidence readiness'
  );
  assert(
    adminReadinessOverview.body?.readiness_surfaces?.some((item) => item.mode === 'dispute_evidence_readiness'),
    'Admin readiness overview must include dispute evidence readiness'
  );
  assert(
    adminReadinessOverview.body?.overview_gate?.provider_legal_money_boundary === 'blocked',
    'Admin readiness overview must block provider, legal, and money actions'
  );
  assert(
    adminReadinessOverview.body?.blocked_live_actions?.includes('provider_commitment'),
    'Admin readiness overview must block provider commitment'
  );

  const filteredAdminReadinessOverview = await request(baseUrl, '/api/admin/readiness-overview?surface_filter=working_capital', {
    headers: { 'X-Request-Id': 'gcsc-admin-readiness-overview-filter-smoke' },
  });
  assert(
    filteredAdminReadinessOverview.status === 200,
    `Expected filtered admin readiness overview 200, got ${filteredAdminReadinessOverview.status}`
  );
  assert(
    filteredAdminReadinessOverview.body?.selected_readiness_surface_filter?.id === 'working_capital',
    'Filtered admin readiness overview must select the working_capital surface filter'
  );
  assert(
    filteredAdminReadinessOverview.body?.readiness_surfaces?.length === 1,
    'Filtered admin readiness overview must return one selected readiness surface'
  );
  assert(
    filteredAdminReadinessOverview.body?.readiness_surfaces?.[0]?.mode === 'working_capital_readiness',
    'Filtered admin readiness overview must return working capital readiness'
  );
  assert(
    filteredAdminReadinessOverview.body?.overview_gate?.provider_legal_money_boundary === 'blocked',
    'Filtered admin readiness overview must keep provider/legal/money boundary blocked'
  );

  const invalidAdminReadinessOverviewFilter = await request(baseUrl, '/api/admin/readiness-overview?surface_filter=live_money', {
    headers: { 'X-Request-Id': 'gcsc-admin-readiness-overview-invalid-filter-smoke' },
  });
  assert(
    invalidAdminReadinessOverviewFilter.status === 400,
    `Expected readiness_overview_filter_invalid 400, got ${invalidAdminReadinessOverviewFilter.status}`
  );
  assert(
    invalidAdminReadinessOverviewFilter.body?.status === 'readiness_overview_filter_invalid',
    'Invalid admin readiness overview filter must use readiness_overview_filter_invalid status'
  );
  assert(
    invalidAdminReadinessOverviewFilter.body?.error === 'Unsupported readiness overview surface_filter',
    'Invalid admin readiness overview filter must return unsupported surface_filter error'
  );
  assert(
    invalidAdminReadinessOverviewFilter.body?.no_live_action_attempted === true,
    'Invalid admin readiness overview filter must not attempt live actions'
  );

  const providerEvidencePacket = await request(baseUrl, '/api/admin/provider-evidence-packet?surface_filter=contractor_verification', {
    headers: { 'X-Request-Id': 'gcsc-provider-evidence-packet-smoke' },
  });
  assert(
    providerEvidencePacket.status === 200,
    `Expected provider evidence packet 200, got ${providerEvidencePacket.status}`
  );
  assert(
    providerEvidencePacket.headers.get('x-request-id') === 'gcsc-provider-evidence-packet-smoke',
    'Provider evidence packet must echo a safe X-Request-Id header'
  );
  assert(
    providerEvidencePacket.body?.request_id === 'gcsc-provider-evidence-packet-smoke',
    'Provider evidence packet must include request_id in the response body'
  );
  assert(
    providerEvidencePacket.body?.mode === 'provider_evidence_packet',
    'Provider evidence packet must expose provider_evidence_packet mode'
  );
  assert(
    providerEvidencePacket.body?.selected_readiness_surface_filter?.id === 'contractor_verification',
    'Provider evidence packet must select contractor_verification filter'
  );
  assert(
    providerEvidencePacket.body?.packet_sections?.some((item) => item.mode === 'contractor_verification_readiness'),
    'Provider evidence packet must include contractor verification packet section'
  );
  assert(
    providerEvidencePacket.body?.redaction_checklist?.some((item) => item.id === 'private_identifier_redaction'),
    'Provider evidence packet must include private identifier redaction checklist'
  );
  assert(
    providerEvidencePacket.body?.packet_gate?.provider_submission === 'blocked',
    'Provider evidence packet must block provider submission'
  );
  assert(
    providerEvidencePacket.body?.blocked_live_actions?.includes('provider_submission'),
    'Provider evidence packet must block provider submission action'
  );

  const invalidProviderEvidencePacketFilter = await request(baseUrl, '/api/admin/provider-evidence-packet?surface_filter=live_provider_submission', {
    headers: { 'X-Request-Id': 'gcsc-provider-evidence-packet-invalid-filter-smoke' },
  });
  assert(
    invalidProviderEvidencePacketFilter.status === 400,
    `Expected provider_evidence_packet_filter_invalid 400, got ${invalidProviderEvidencePacketFilter.status}`
  );
  assert(
    invalidProviderEvidencePacketFilter.body?.status === 'provider_evidence_packet_filter_invalid',
    'Invalid provider evidence packet filter must use provider_evidence_packet_filter_invalid status'
  );
  assert(
    invalidProviderEvidencePacketFilter.body?.error === 'Unsupported provider evidence packet surface_filter',
    'Invalid provider evidence packet filter must return unsupported surface_filter error'
  );
  assert(
    invalidProviderEvidencePacketFilter.body?.no_live_action_attempted === true,
    'Invalid provider evidence packet filter must not attempt live actions'
  );

  const providerEvidencePacketPrintTemplate = await request(baseUrl, '/api/admin/provider-evidence-packet/print-template?surface_filter=contractor_verification', {
    headers: { 'X-Request-Id': 'gcsc-provider-evidence-packet-print-template-smoke' },
  });
  assert(
    providerEvidencePacketPrintTemplate.status === 200,
    `Expected provider evidence packet print template 200, got ${providerEvidencePacketPrintTemplate.status}`
  );
  assert(
    providerEvidencePacketPrintTemplate.headers.get('x-request-id') === 'gcsc-provider-evidence-packet-print-template-smoke',
    'Provider evidence packet print template must echo a safe X-Request-Id header'
  );
  assert(
    providerEvidencePacketPrintTemplate.body?.request_id === 'gcsc-provider-evidence-packet-print-template-smoke',
    'Provider evidence packet print template must include request_id in the response body'
  );
  assert(
    providerEvidencePacketPrintTemplate.body?.mode === 'provider_evidence_packet_print_template',
    'Provider evidence packet print template must expose provider_evidence_packet_print_template mode'
  );
  assert(
    providerEvidencePacketPrintTemplate.body?.selected_readiness_surface_filter?.id === 'contractor_verification',
    'Provider evidence packet print template must select contractor_verification filter'
  );
  assert(
    providerEvidencePacketPrintTemplate.body?.print_template_sections?.some((item) => item.id === 'packet_section_summary'),
    'Provider evidence packet print template must include a packet section summary'
  );
  assert(
    providerEvidencePacketPrintTemplate.body?.print_redaction_attestation?.no_secrets_in_template === true,
    'Provider evidence packet print template must attest no secrets are included'
  );
  assert(
    providerEvidencePacketPrintTemplate.body?.export_gate?.external_send === 'blocked',
    'Provider evidence packet print template must block external send'
  );
  assert(
    providerEvidencePacketPrintTemplate.body?.copyable_markdown_preview?.includes('Provider Evidence Packet Print Template'),
    'Provider evidence packet print template must include a copyable markdown preview'
  );

  const invalidProviderEvidencePacketPrintTemplateFilter = await request(baseUrl, '/api/admin/provider-evidence-packet/print-template?surface_filter=live_provider_submission', {
    headers: { 'X-Request-Id': 'gcsc-provider-evidence-packet-print-template-invalid-filter-smoke' },
  });
  assert(
    invalidProviderEvidencePacketPrintTemplateFilter.status === 400,
    `Expected provider_evidence_packet_print_template_filter_invalid 400, got ${invalidProviderEvidencePacketPrintTemplateFilter.status}`
  );
  assert(
    invalidProviderEvidencePacketPrintTemplateFilter.body?.status === 'provider_evidence_packet_print_template_filter_invalid',
    'Invalid provider evidence packet print template filter must use provider_evidence_packet_print_template_filter_invalid status'
  );
  assert(
    invalidProviderEvidencePacketPrintTemplateFilter.body?.error === 'Unsupported provider evidence packet print template surface_filter',
    'Invalid provider evidence packet print template filter must return unsupported surface_filter error'
  );
  assert(
    invalidProviderEvidencePacketPrintTemplateFilter.body?.no_live_action_attempted === true,
    'Invalid provider evidence packet print template filter must not attempt live actions'
  );

  const providerEvidencePacketRedactionQa = await request(baseUrl, '/api/admin/provider-evidence-packet/redaction-qa?surface_filter=contractor_verification', {
    headers: { 'X-Request-Id': 'gcsc-provider-evidence-packet-redaction-qa-smoke' },
  });
  assert(
    providerEvidencePacketRedactionQa.status === 200,
    `Expected provider evidence packet redaction QA 200, got ${providerEvidencePacketRedactionQa.status}`
  );
  assert(
    providerEvidencePacketRedactionQa.headers.get('x-request-id') === 'gcsc-provider-evidence-packet-redaction-qa-smoke',
    'Provider evidence packet redaction QA must echo a safe X-Request-Id header'
  );
  assert(
    providerEvidencePacketRedactionQa.body?.request_id === 'gcsc-provider-evidence-packet-redaction-qa-smoke',
    'Provider evidence packet redaction QA must include request_id in the response body'
  );
  assert(
    providerEvidencePacketRedactionQa.body?.mode === 'provider_evidence_packet_redaction_qa',
    'Provider evidence packet redaction QA must expose provider_evidence_packet_redaction_qa mode'
  );
  assert(
    providerEvidencePacketRedactionQa.body?.selected_readiness_surface_filter?.id === 'contractor_verification',
    'Provider evidence packet redaction QA must select contractor_verification filter'
  );
  assert(
    providerEvidencePacketRedactionQa.body?.redaction_findings?.some((item) => item.id === 'secret_phrase_scan'),
    'Provider evidence packet redaction QA must include secret phrase scan finding'
  );
  assert(
    providerEvidencePacketRedactionQa.body?.redaction_qa_gate?.blocked_external_use === 'blocked',
    'Provider evidence packet redaction QA must block external use'
  );
  assert(
    providerEvidencePacketRedactionQa.body?.forbidden_phrase_scan?.matched_count === 0,
    'Provider evidence packet redaction QA must report zero matched forbidden phrases for the local safe template'
  );

  const invalidProviderEvidencePacketRedactionQaFilter = await request(baseUrl, '/api/admin/provider-evidence-packet/redaction-qa?surface_filter=live_provider_submission', {
    headers: { 'X-Request-Id': 'gcsc-provider-evidence-packet-redaction-qa-invalid-filter-smoke' },
  });
  assert(
    invalidProviderEvidencePacketRedactionQaFilter.status === 400,
    `Expected provider_evidence_packet_redaction_qa_filter_invalid 400, got ${invalidProviderEvidencePacketRedactionQaFilter.status}`
  );
  assert(
    invalidProviderEvidencePacketRedactionQaFilter.body?.status === 'provider_evidence_packet_redaction_qa_filter_invalid',
    'Invalid provider evidence packet redaction QA filter must use provider_evidence_packet_redaction_qa_filter_invalid status'
  );
  assert(
    invalidProviderEvidencePacketRedactionQaFilter.body?.error === 'Unsupported provider evidence packet redaction qa surface_filter',
    'Invalid provider evidence packet redaction QA filter must return unsupported surface_filter error'
  );
  assert(
    invalidProviderEvidencePacketRedactionQaFilter.body?.no_live_action_attempted === true,
    'Invalid provider evidence packet redaction QA filter must not attempt live actions'
  );

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
    headers: { 'X-Request-Id': 'gcsc-slack-challenge-smoke' },
    body: JSON.stringify({
      type: 'url_verification',
      challenge: 'gcsc-slack-smoke-challenge',
    }),
  });
  assert(slackChallenge.status === 200, `Expected Slack challenge to return 200, got ${slackChallenge.status}`);
  assert(slackChallenge.body?.challenge === 'gcsc-slack-smoke-challenge', 'Slack challenge must echo the challenge value');
  assert(
    slackChallenge.headers.get('x-request-id') === 'gcsc-slack-challenge-smoke',
    'Slack challenge must echo a safe X-Request-Id header'
  );
  assert(
    slackChallenge.body?.request_id === 'gcsc-slack-challenge-smoke',
    'Slack challenge must include request_id in the response body'
  );

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
      smartcontractor_workflow_readiness: workflowReadiness.status,
      smartcontractor_workflow_readiness_filtered: workflowReadinessFiltered.status,
      workflow_readiness_filter_invalid: workflowReadinessInvalid.status,
      repayment_waterfall_review_packet: repaymentWaterfallReviewPacket.status,
      smart_contract_helper_index: helperIndex.status,
      helper_index_filter_invalid: helperIndexInvalid.status,
    },
    optional_real_session: optionalRealSession,
  }, null, 2));
} finally {
  server.close();
}
