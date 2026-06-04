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

function assertGateMatrixRecommendedRouteSet(body, expectedFirstFilterId = '') {
  const recommendedReviewOrder = body?.recommended_review_order;
  assert(
    Array.isArray(recommendedReviewOrder) && recommendedReviewOrder.length > 0,
    'Smart contract review workbench gate matrix must include a recommended_review_order route set'
  );

  const firstRoute = recommendedReviewOrder[0] || {};
  if (expectedFirstFilterId) {
    assert(
      firstRoute.filter_id === expectedFirstFilterId,
      `Smart contract review workbench gate matrix route set must start with ${expectedFirstFilterId}`
    );
  }

  assert(
    firstRoute.local_review_route_set === true &&
      firstRoute.local_only === true &&
      firstRoute.live_actions_blocked === true,
    'Smart contract review workbench gate matrix recommended route set must stay local-only with live actions blocked'
  );

  const requiredRoutes = [
    ['workbench_endpoint', '/api/admin/smart-contract-review-workbench?category_filter='],
    ['dry_run_endpoint', '/api/admin/smart-contract-local-replay-dry-run?category_filter='],
    ['dry_run_packet_endpoint', '/api/admin/smart-contract-local-replay-dry-run/evidence-packet?category_filter='],
    ['handoff_summary_endpoint', '/api/admin/smart-contract-review-workbench/handoff-summary?category_filter='],
  ];
  for (const [field, prefix] of requiredRoutes) {
    assert(
      typeof firstRoute[field] === 'string' && firstRoute[field].startsWith(prefix) && firstRoute[field].includes(encodeURIComponent(firstRoute.filter_id || '')),
      `Smart contract review workbench gate matrix recommended route set must include ${field}`
    );
  }

  return {
    smart_contract_review_workbench_gate_matrix_route_set_checked: true,
    recommended_review_order_count: recommendedReviewOrder.length,
    smart_contract_review_workbench_gate_matrix_route_set_first_filter: firstRoute.filter_id,
  };
}

function assertGateMatrixRouteSetSummary(body, expectedRouteSetCount = 0) {
  const recommendedReviewOrder = Array.isArray(body?.recommended_review_order) ? body.recommended_review_order : [];
  const routeSetSummary = body?.route_set_summary;
  assert(
    routeSetSummary && typeof routeSetSummary === 'object',
    'Smart contract review workbench gate matrix must include route_set_summary'
  );
  assert(
    routeSetSummary.route_set_count === recommendedReviewOrder.length,
    'Smart contract review workbench gate matrix route_set_summary.route_set_count must match recommended_review_order length'
  );
  if (expectedRouteSetCount > 0) {
    assert(
      routeSetSummary.route_set_count === expectedRouteSetCount,
      `Smart contract review workbench gate matrix route_set_summary.route_set_count must be ${expectedRouteSetCount}`
    );
  }
  assert(
    routeSetSummary.local_only_route_set_count === routeSetSummary.route_set_count &&
      routeSetSummary.live_blocked_route_set_count === routeSetSummary.route_set_count,
    'Smart contract review workbench gate matrix route_set_summary must count only local-only, live-blocked route sets'
  );
  const requiredEndpointTypes = [
    'workbench_endpoint',
    'dry_run_endpoint',
    'dry_run_packet_endpoint',
    'handoff_summary_endpoint',
  ];
  assert(
    Array.isArray(routeSetSummary.available_endpoint_types) &&
      requiredEndpointTypes.every((type) => routeSetSummary.available_endpoint_types.includes(type)),
    'Smart contract review workbench gate matrix route_set_summary.available_endpoint_types must include local review route types'
  );
  assert(
    routeSetSummary.local_review_route_set === true &&
      routeSetSummary.local_only === true &&
      routeSetSummary.live_actions_blocked === true,
    'Smart contract review workbench gate matrix route_set_summary must stay local-only with live actions blocked'
  );

  return {
    smart_contract_review_workbench_gate_matrix_route_set_summary_checked: true,
    smart_contract_review_workbench_gate_matrix_route_set_summary_count: routeSetSummary.route_set_count,
    smart_contract_review_workbench_gate_matrix_route_set_summary_endpoint_type_count:
      routeSetSummary.available_endpoint_types.length,
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
    "app.get('/api/smartcontractor/job-fit-snapshot'",
    'job_fit_snapshot',
    'fit_score',
    'fit_factors',
    'demo_only_matching_gate',
    'validateJobFitSnapshotQuery',
    'job_fit_snapshot_validation_error',
    'budget_min_usd must be a non-negative finite number',
    'budget_max_usd must be a non-negative finite number',
    'budget_max_usd must be greater than or equal to budget_min_usd',
    'contractor_rating must be a number from 0 to 5',
    'available_working_capital_usd must be a non-negative finite number',
    'const jobFitValidationErrors = validateJobFitSnapshotQuery(req.query);',
    'no_real_lead_routing_attempted',
    'job_fit_snapshot_history',
    'local_history_only',
    'metadata_only',
    'no_real_lead_routing_history_stored',
    'no_live_matching_action_attempted',
    "app.get('/api/smartcontractor/bid-readiness-comparison'",
    'bid_readiness_comparison',
    'readiness_score',
    'readiness_factors',
    'demo_only_selection_gate',
    'validateBidReadinessComparisonQuery',
    'bid_readiness_comparison_validation_error',
    'bid_amount_usd must be a non-negative finite number',
    'timeline_days must be a non-negative finite integer',
    'contractor_rating must be a number from 0 to 5',
    'budget_max_usd must be greater than or equal to budget_min_usd',
    'const bidReadinessValidationErrors = validateBidReadinessComparisonQuery(req.query);',
    'no_winning_bid_selected',
    'bid_readiness_comparison_history',
    'local_history_only',
    'metadata_only',
    'no_winning_bid_history_stored',
    'no_live_selection_action_attempted',
    "app.get('/api/smartcontractor/milestone-acceptance-snapshot'",
    'milestone_acceptance_snapshot',
    'acceptance_score',
    'acceptance_factors',
    'demo_only_acceptance_gate',
    'validateMilestoneAcceptanceSnapshotQuery',
    'evidence_count must be a non-negative finite integer',
    'requested_release_usd must be a non-negative finite number',
    'work_status must be one of: submitted, approved, completed, needs_rework',
    'payment_status must be one of: funded, not_funded, released, disputed',
    'milestone_acceptance_snapshot_validation_error',
    'const milestoneAcceptanceValidationErrors = validateMilestoneAcceptanceSnapshotQuery(req.query);',
    'no_milestone_approval_attempted',
    'no_escrow_release_attempted',
    'no_payment_movement_attempted',
    'milestone_acceptance_snapshot_history',
    'local_history_only',
    'metadata_only',
    'no_milestone_approval_history_stored',
    'no_escrow_release_history_stored',
    'no_payment_movement_history_stored',
    "app.get('/api/smartcontractor/repayment-allocation-preview'",
    'repayment_allocation_preview',
    'validateRepaymentAllocationPreviewQuery',
    'milestone_payment_usd must be a positive finite number',
    'loan_outstanding_usd must be a non-negative finite number',
    'repayment_allocation_preview_validation_error',
    'loan_repayment_hold_usd',
    'contractor_remainder_usd',
    'loan_remaining_after_preview_usd',
    'no_real_repayment_routing_attempted',
    'no_payment_movement_attempted',
    'no_escrow_release_attempted',
    'repayment_allocation_preview_history',
    'repayment_allocation_preview_metadata_history_only',
    'no_raw_payment_references_stored',
    'no_payment_tx_hashes_stored',
    'no_loan_ids_stored',
    'no_real_repayment_routing_history_stored',
    'no_payment_movement_history_stored',
    'no_escrow_release_history_stored',
    "app.get('/api/smartcontractor/repayment-readiness-snapshot'",
    'repayment_readiness_snapshot',
    'validateRepaymentReadinessSnapshotQuery',
    'repayment_readiness_snapshot_validation_error',
    'evidence_status must be one of: missing, partial, submitted, verified',
    'dispute_status must be one of: none, open, unresolved',
    'payment_status must be one of: not_funded, funded, disputed, released',
    'readiness_score',
    'readiness_factors',
    'demo_only_repayment_readiness_gate',
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
    "app.get('/api/admin/admin-evidence-export-preview'",
    'admin_evidence_export_preview',
    'metadata_allowlist',
    'blocked_fields',
    'export_gate',
    'raw_draft_text',
    'copyable_report_markdown',
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
  assert(health.body?.features?.includes('job-fit-snapshot'), 'Health must advertise job-fit-snapshot');
  assert(health.body?.features?.includes('bid-readiness-comparison'), 'Health must advertise bid-readiness-comparison');
  assert(health.body?.features?.includes('milestone-acceptance-snapshot'), 'Health must advertise milestone-acceptance-snapshot');
  assert(health.body?.features?.includes('repayment-allocation-preview'), 'Health must advertise repayment-allocation-preview');

  const jobFitSnapshot = await request(
    baseUrl,
    '/api/smartcontractor/job-fit-snapshot?job_id=job-smoke-1&job_trade=roofing&job_state=WA&job_zip=98101&budget_min_usd=5000&budget_max_usd=12000&contractor_trade=roofing&contractor_state=WA&contractor_zip=98109&contractor_rating=4.7&available_working_capital_usd=2500',
    { headers: { 'X-Request-Id': 'gcsc-job-fit-snapshot-smoke' } }
  );
  assert(jobFitSnapshot.status === 200, `Expected job-fit-snapshot 200, got ${jobFitSnapshot.status}`);
  assert(
    jobFitSnapshot.headers.get('x-request-id') === 'gcsc-job-fit-snapshot-smoke',
    'Job fit snapshot must echo a safe X-Request-Id header'
  );
  assert(
    jobFitSnapshot.body?.request_id === 'gcsc-job-fit-snapshot-smoke',
    'Job fit snapshot must include request_id in the response body'
  );
  assert(jobFitSnapshot.body?.mode === 'job_fit_snapshot', 'Job fit snapshot must expose job_fit_snapshot mode');
  assert(
    Number.isFinite(jobFitSnapshot.body?.fit_score),
    'Job fit snapshot must return a numeric fit_score'
  );
  assert(Array.isArray(jobFitSnapshot.body?.fit_factors), 'Job fit snapshot must return fit_factors array');
  assert(
    jobFitSnapshot.body?.fit_factors?.some((item) => item.id === 'trade_match'),
    'Job fit snapshot must include trade_match factor'
  );
  assert(
    jobFitSnapshot.body?.demo_only_matching_gate?.real_lead_routing === 'blocked',
    'Job fit snapshot must block real lead routing'
  );
  assert(
    jobFitSnapshot.body?.no_real_lead_routing_attempted === true,
    'Job fit snapshot must not attempt real lead routing'
  );
  assert(
    jobFitSnapshot.body?.no_live_action_attempted === true,
    'Job fit snapshot must not attempt live actions'
  );

  const invalidJobFitSnapshot = await request(
    baseUrl,
    '/api/smartcontractor/job-fit-snapshot?job_id=job-smoke-1&job_trade=roofing&job_state=WA&job_zip=98101&budget_min_usd=-5&budget_max_usd=-10&contractor_trade=roofing&contractor_state=WA&contractor_zip=98109&contractor_rating=7&available_working_capital_usd=-10',
    { headers: { 'X-Request-Id': 'gcsc-job-fit-invalid-smoke' } }
  );
  assert(
    invalidJobFitSnapshot.status === 400,
    `Expected invalid job-fit-snapshot 400, got ${invalidJobFitSnapshot.status}`
  );
  assert(
    invalidJobFitSnapshot.headers.get('x-request-id') === 'gcsc-job-fit-invalid-smoke',
    'Invalid job fit snapshot must echo a safe X-Request-Id header'
  );
  assert(
    invalidJobFitSnapshot.body?.request_id === 'gcsc-job-fit-invalid-smoke',
    'Invalid job fit snapshot must include request_id in the response body'
  );
  assert(
    invalidJobFitSnapshot.body?.mode === 'job_fit_snapshot_validation_error',
    'Invalid job fit snapshot must expose job_fit_snapshot_validation_error mode'
  );
  assert(
    invalidJobFitSnapshot.body?.details?.includes('budget_min_usd must be a non-negative finite number'),
    'Invalid job fit snapshot must describe invalid budget_min_usd'
  );
  assert(
    invalidJobFitSnapshot.body?.details?.includes('budget_max_usd must be a non-negative finite number'),
    'Invalid job fit snapshot must describe invalid budget_max_usd'
  );
  assert(
    invalidJobFitSnapshot.body?.details?.includes('budget_max_usd must be greater than or equal to budget_min_usd'),
    'Invalid job fit snapshot must describe invalid budget order'
  );
  assert(
    invalidJobFitSnapshot.body?.details?.includes('contractor_rating must be a number from 0 to 5'),
    'Invalid job fit snapshot must describe invalid contractor_rating'
  );
  assert(
    invalidJobFitSnapshot.body?.details?.includes('available_working_capital_usd must be a non-negative finite number'),
    'Invalid job fit snapshot must describe invalid available_working_capital_usd'
  );
  assert(
    invalidJobFitSnapshot.body?.no_real_lead_routing_attempted === true,
    'Invalid job fit snapshot must not attempt real lead routing'
  );
  assert(
    invalidJobFitSnapshot.body?.no_live_matching_action_attempted === true,
    'Invalid job fit snapshot must not attempt live matching'
  );
  assert(
    invalidJobFitSnapshot.body?.no_live_action_attempted === true,
    'Invalid job fit snapshot must not attempt live actions'
  );

  const bidReadinessComparison = await request(
    baseUrl,
    '/api/smartcontractor/bid-readiness-comparison?job_id=job-smoke-1&bid_id=bid-smoke-1&job_trade=roofing&contractor_trade=roofing&budget_min_usd=5000&budget_max_usd=12000&bid_amount_usd=9800&timeline_days=21&contractor_rating=4.7',
    { headers: { 'X-Request-Id': 'gcsc-bid-readiness-smoke' } }
  );
  assert(
    bidReadinessComparison.status === 200,
    `Expected bid-readiness-comparison 200, got ${bidReadinessComparison.status}`
  );
  assert(
    bidReadinessComparison.headers.get('x-request-id') === 'gcsc-bid-readiness-smoke',
    'Bid readiness comparison must echo a safe X-Request-Id header'
  );
  assert(
    bidReadinessComparison.body?.request_id === 'gcsc-bid-readiness-smoke',
    'Bid readiness comparison must include request_id in the response body'
  );
  assert(
    bidReadinessComparison.body?.mode === 'bid_readiness_comparison',
    'Bid readiness comparison must expose bid_readiness_comparison mode'
  );
  assert(
    Number.isFinite(bidReadinessComparison.body?.readiness_score),
    'Bid readiness comparison must return a numeric readiness_score'
  );
  assert(
    Array.isArray(bidReadinessComparison.body?.readiness_factors),
    'Bid readiness comparison must return readiness_factors array'
  );
  assert(
    bidReadinessComparison.body?.readiness_factors?.some((item) => item.id === 'budget_fit'),
    'Bid readiness comparison must include budget_fit factor'
  );
  assert(
    bidReadinessComparison.body?.demo_only_selection_gate?.winning_bid_selection === 'blocked',
    'Bid readiness comparison must block winning bid selection'
  );
  assert(
    bidReadinessComparison.body?.history_boundary?.mode === 'bid_readiness_comparison_history',
    'Bid readiness comparison must expose bid_readiness_comparison_history boundary'
  );
  assert(
    bidReadinessComparison.body?.history_boundary?.scope === 'local_history_only',
    'Bid readiness comparison history boundary must be local_history_only'
  );
  assert(
    bidReadinessComparison.body?.history_boundary?.metadata_only === true,
    'Bid readiness comparison history boundary must be metadata_only'
  );
  assert(
    bidReadinessComparison.body?.history_boundary?.no_winning_bid_history_stored === true,
    'Bid readiness comparison history must not store winning-bid history'
  );
  assert(
    bidReadinessComparison.body?.history_boundary?.no_live_selection_action_attempted === true,
    'Bid readiness comparison history must not attempt live selection actions'
  );
  assert(
    bidReadinessComparison.body?.no_winning_bid_selected === true,
    'Bid readiness comparison must not select a winning bid'
  );
  assert(
    bidReadinessComparison.body?.no_live_action_attempted === true,
    'Bid readiness comparison must not attempt live actions'
  );

  const invalidBidReadinessComparison = await request(
    baseUrl,
    '/api/smartcontractor/bid-readiness-comparison?job_id=job-smoke-1&bid_id=bid-smoke-1&job_trade=roofing&contractor_trade=roofing&budget_min_usd=5000&budget_max_usd=1000&bid_amount_usd=-50&timeline_days=2.5&contractor_rating=8',
    { headers: { 'X-Request-Id': 'gcsc-bid-readiness-invalid-smoke' } }
  );
  assert(
    invalidBidReadinessComparison.status === 400,
    `Expected invalid bid-readiness-comparison 400, got ${invalidBidReadinessComparison.status}`
  );
  assert(
    invalidBidReadinessComparison.headers.get('x-request-id') === 'gcsc-bid-readiness-invalid-smoke',
    'Invalid bid readiness comparison must echo a safe X-Request-Id header'
  );
  assert(
    invalidBidReadinessComparison.body?.request_id === 'gcsc-bid-readiness-invalid-smoke',
    'Invalid bid readiness comparison must include request_id in the response body'
  );
  assert(
    invalidBidReadinessComparison.body?.mode === 'bid_readiness_comparison_validation_error',
    'Invalid bid readiness comparison must expose bid_readiness_comparison_validation_error mode'
  );
  assert(
    invalidBidReadinessComparison.body?.details?.includes('budget_max_usd must be greater than or equal to budget_min_usd'),
    'Invalid bid readiness comparison must describe invalid budget order'
  );
  assert(
    invalidBidReadinessComparison.body?.details?.includes('bid_amount_usd must be a non-negative finite number'),
    'Invalid bid readiness comparison must describe invalid bid_amount_usd'
  );
  assert(
    invalidBidReadinessComparison.body?.details?.includes('timeline_days must be a non-negative finite integer'),
    'Invalid bid readiness comparison must describe invalid timeline_days'
  );
  assert(
    invalidBidReadinessComparison.body?.details?.includes('contractor_rating must be a number from 0 to 5'),
    'Invalid bid readiness comparison must describe invalid contractor_rating'
  );
  assert(
    invalidBidReadinessComparison.body?.no_winning_bid_selected === true,
    'Invalid bid readiness comparison must not select a winning bid'
  );
  assert(
    invalidBidReadinessComparison.body?.no_contractor_assignment_attempted === true,
    'Invalid bid readiness comparison must not assign a contractor'
  );
  assert(
    invalidBidReadinessComparison.body?.no_live_selection_action_attempted === true,
    'Invalid bid readiness comparison must not attempt live selection actions'
  );
  assert(
    invalidBidReadinessComparison.body?.no_live_action_attempted === true,
    'Invalid bid readiness comparison must not attempt live actions'
  );

  const milestoneAcceptanceSnapshot = await request(
    baseUrl,
    '/api/smartcontractor/milestone-acceptance-snapshot?job_id=job-smoke-1&milestone_id=milestone-smoke-1&milestone_title=Rough-in%20inspection&scope_summary=Visible%20rough-in%20work%20complete&evidence_count=4&photo_count=2&video_count=1&note_count=1&homeowner_confirms_visible_work=yes&contractor_reports_complete=yes&work_status=submitted&payment_status=funded&requested_release_usd=2500',
    { headers: { 'X-Request-Id': 'gcsc-milestone-acceptance-smoke' } }
  );
  assert(
    milestoneAcceptanceSnapshot.status === 200,
    `Expected milestone-acceptance-snapshot 200, got ${milestoneAcceptanceSnapshot.status}`
  );
  assert(
    milestoneAcceptanceSnapshot.headers.get('x-request-id') === 'gcsc-milestone-acceptance-smoke',
    'Milestone acceptance snapshot must echo a safe X-Request-Id header'
  );
  assert(
    milestoneAcceptanceSnapshot.body?.request_id === 'gcsc-milestone-acceptance-smoke',
    'Milestone acceptance snapshot must include request_id in the response body'
  );
  assert(
    milestoneAcceptanceSnapshot.body?.mode === 'milestone_acceptance_snapshot',
    'Milestone acceptance snapshot must expose milestone_acceptance_snapshot mode'
  );
  assert(
    Number.isFinite(milestoneAcceptanceSnapshot.body?.acceptance_score),
    'Milestone acceptance snapshot must return a numeric acceptance_score'
  );
  assert(
    milestoneAcceptanceSnapshot.body?.acceptance_factors?.some((item) => item.id === 'visible_work_evidence'),
    'Milestone acceptance snapshot must include visible_work_evidence factor'
  );
  assert(
    milestoneAcceptanceSnapshot.body?.demo_only_acceptance_gate?.milestone_approval === 'blocked',
    'Milestone acceptance snapshot must block milestone approval'
  );
  assert(
    milestoneAcceptanceSnapshot.body?.demo_only_acceptance_gate?.escrow_release === 'blocked',
    'Milestone acceptance snapshot must block escrow release'
  );
  assert(
    milestoneAcceptanceSnapshot.body?.history_boundary?.mode === 'milestone_acceptance_snapshot_history',
    'Milestone acceptance snapshot must expose milestone_acceptance_snapshot_history boundary'
  );
  assert(
    milestoneAcceptanceSnapshot.body?.history_boundary?.scope === 'local_history_only',
    'Milestone acceptance snapshot history boundary must be local_history_only'
  );
  assert(
    milestoneAcceptanceSnapshot.body?.history_boundary?.metadata_only === true,
    'Milestone acceptance snapshot history boundary must be metadata_only'
  );
  assert(
    milestoneAcceptanceSnapshot.body?.history_boundary?.no_milestone_approval_history_stored === true,
    'Milestone acceptance snapshot history must not store approval history'
  );
  assert(
    milestoneAcceptanceSnapshot.body?.history_boundary?.no_escrow_release_history_stored === true,
    'Milestone acceptance snapshot history must not store escrow release history'
  );
  assert(
    milestoneAcceptanceSnapshot.body?.history_boundary?.no_payment_movement_history_stored === true,
    'Milestone acceptance snapshot history must not store payment movement history'
  );
  assert(
    milestoneAcceptanceSnapshot.body?.no_milestone_approval_attempted === true,
    'Milestone acceptance snapshot must not approve milestones'
  );
  assert(
    milestoneAcceptanceSnapshot.body?.no_escrow_release_attempted === true,
    'Milestone acceptance snapshot must not release escrow'
  );
  assert(
    milestoneAcceptanceSnapshot.body?.no_payment_movement_attempted === true,
    'Milestone acceptance snapshot must not move payment'
  );

  const invalidMilestoneAcceptanceSnapshot = await request(
    baseUrl,
    '/api/smartcontractor/milestone-acceptance-snapshot?evidence_count=-1&photo_count=two&work_status=live_release&payment_status=settled&requested_release_usd=-50',
    { headers: { 'X-Request-Id': 'gcsc-milestone-acceptance-invalid-smoke' } }
  );
  assert(
    invalidMilestoneAcceptanceSnapshot.status === 400,
    `Expected invalid milestone-acceptance-snapshot 400, got ${invalidMilestoneAcceptanceSnapshot.status}`
  );
  assert(
    invalidMilestoneAcceptanceSnapshot.headers.get('x-request-id') === 'gcsc-milestone-acceptance-invalid-smoke',
    'Invalid milestone acceptance snapshot must echo a safe X-Request-Id header'
  );
  assert(
    invalidMilestoneAcceptanceSnapshot.body?.request_id === 'gcsc-milestone-acceptance-invalid-smoke',
    'Invalid milestone acceptance snapshot must include request_id in the response body'
  );
  assert(
    invalidMilestoneAcceptanceSnapshot.body?.mode === 'milestone_acceptance_snapshot_validation_error',
    'Invalid milestone acceptance snapshot must expose milestone_acceptance_snapshot_validation_error mode'
  );
  assert(
    invalidMilestoneAcceptanceSnapshot.body?.details?.includes('evidence_count must be a non-negative finite integer'),
    'Invalid milestone acceptance snapshot must reject negative evidence_count'
  );
  assert(
    invalidMilestoneAcceptanceSnapshot.body?.details?.includes('photo_count must be a non-negative finite integer'),
    'Invalid milestone acceptance snapshot must reject non-numeric photo_count'
  );
  assert(
    invalidMilestoneAcceptanceSnapshot.body?.details?.includes('work_status must be one of: submitted, approved, completed, needs_rework'),
    'Invalid milestone acceptance snapshot must reject unsupported work_status'
  );
  assert(
    invalidMilestoneAcceptanceSnapshot.body?.details?.includes('payment_status must be one of: funded, not_funded, released, disputed'),
    'Invalid milestone acceptance snapshot must reject unsupported payment_status'
  );
  assert(
    invalidMilestoneAcceptanceSnapshot.body?.details?.includes('requested_release_usd must be a non-negative finite number'),
    'Invalid milestone acceptance snapshot must reject negative requested_release_usd'
  );
  assert(
    invalidMilestoneAcceptanceSnapshot.body?.no_milestone_approval_attempted === true,
    'Invalid milestone acceptance snapshot must not approve milestones'
  );
  assert(
    invalidMilestoneAcceptanceSnapshot.body?.no_escrow_release_attempted === true,
    'Invalid milestone acceptance snapshot must not release escrow'
  );
  assert(
    invalidMilestoneAcceptanceSnapshot.body?.no_payment_movement_attempted === true,
    'Invalid milestone acceptance snapshot must not move payment'
  );
  assert(
    invalidMilestoneAcceptanceSnapshot.body?.no_live_action_attempted === true,
    'Invalid milestone acceptance snapshot must not attempt live actions'
  );

  const repaymentAllocationPreview = await request(
    baseUrl,
    '/api/smartcontractor/repayment-allocation-preview?milestone_payment_usd=2500&loan_outstanding_usd=1800&contractor_invoice_usd=3000',
    { headers: { 'X-Request-Id': 'gcsc-repayment-allocation-preview-smoke' } }
  );
  assert(
    repaymentAllocationPreview.status === 200,
    `Expected repayment-allocation-preview 200, got ${repaymentAllocationPreview.status}`
  );
  assert(
    repaymentAllocationPreview.headers.get('x-request-id') === 'gcsc-repayment-allocation-preview-smoke',
    'Repayment allocation preview must echo a safe X-Request-Id header'
  );
  assert(
    repaymentAllocationPreview.body?.request_id === 'gcsc-repayment-allocation-preview-smoke',
    'Repayment allocation preview must include request_id in the response body'
  );
  assert(
    repaymentAllocationPreview.body?.mode === 'repayment_allocation_preview',
    'Repayment allocation preview must expose repayment_allocation_preview mode'
  );
  assert(
    repaymentAllocationPreview.body?.allocation?.loan_repayment_hold_usd === 1800 &&
      repaymentAllocationPreview.body?.allocation?.contractor_remainder_usd === 700 &&
      repaymentAllocationPreview.body?.allocation?.loan_remaining_after_preview_usd === 0,
    'Repayment allocation preview must allocate milestone payment to loan first and contractor remainder second'
  );
  assert(
    repaymentAllocationPreview.body?.demo_only_repayment_allocation_gate?.repayment_routing === 'blocked' &&
      repaymentAllocationPreview.body?.demo_only_repayment_allocation_gate?.payment_movement === 'blocked' &&
      repaymentAllocationPreview.body?.demo_only_repayment_allocation_gate?.escrow_release === 'blocked',
    'Repayment allocation preview must block repayment routing, payment movement, and escrow release'
  );
  assert(
    repaymentAllocationPreview.body?.no_real_repayment_routing_attempted === true &&
      repaymentAllocationPreview.body?.no_payment_movement_attempted === true &&
      repaymentAllocationPreview.body?.no_escrow_release_attempted === true &&
      repaymentAllocationPreview.body?.no_live_action_attempted === true,
    'Repayment allocation preview must remain local-only with no live actions'
  );

  const invalidRepaymentAllocationPreview = await request(
    baseUrl,
    '/api/smartcontractor/repayment-allocation-preview?milestone_payment_usd=-1&loan_outstanding_usd=-5&contractor_invoice_usd=not-a-number',
    { headers: { 'X-Request-Id': 'gcsc-repayment-allocation-preview-invalid-smoke' } }
  );
  assert(
    invalidRepaymentAllocationPreview.status === 400,
    `Expected invalid repayment-allocation-preview 400, got ${invalidRepaymentAllocationPreview.status}`
  );
  assert(
    invalidRepaymentAllocationPreview.headers.get('x-request-id') === 'gcsc-repayment-allocation-preview-invalid-smoke',
    'Invalid repayment allocation preview must echo a safe X-Request-Id header'
  );
  assert(
    invalidRepaymentAllocationPreview.body?.request_id === 'gcsc-repayment-allocation-preview-invalid-smoke',
    'Invalid repayment allocation preview must include request_id in the response body'
  );
  assert(
    invalidRepaymentAllocationPreview.body?.mode === 'repayment_allocation_preview_validation_error',
    'Invalid repayment allocation preview must expose repayment_allocation_preview_validation_error mode'
  );
  assert(
    invalidRepaymentAllocationPreview.body?.details?.includes('milestone_payment_usd must be a positive finite number') &&
      invalidRepaymentAllocationPreview.body?.details?.includes('loan_outstanding_usd must be a non-negative finite number') &&
      invalidRepaymentAllocationPreview.body?.details?.includes('contractor_invoice_usd must be a non-negative finite number'),
    'Invalid repayment allocation preview must describe invalid numeric fields'
  );
  assert(
    invalidRepaymentAllocationPreview.body?.no_real_repayment_routing_attempted === true &&
      invalidRepaymentAllocationPreview.body?.no_payment_movement_attempted === true &&
      invalidRepaymentAllocationPreview.body?.no_escrow_release_attempted === true &&
      invalidRepaymentAllocationPreview.body?.no_live_action_attempted === true,
    'Invalid repayment allocation preview must remain no-routing, no-payment, no-escrow, and no-live-action'
  );

  const repaymentReadinessSnapshot = await request(
    baseUrl,
    '/api/smartcontractor/repayment-readiness-snapshot?milestone_payment_usd=2500&loan_outstanding_usd=1800&contractor_invoice_usd=3000&evidence_status=verified&dispute_status=none&payment_status=funded',
    { headers: { 'X-Request-Id': 'gcsc-repayment-readiness-smoke' } }
  );
  assert(
    repaymentReadinessSnapshot.status === 200,
    `Expected repayment-readiness-snapshot 200, got ${repaymentReadinessSnapshot.status}`
  );
  assert(
    repaymentReadinessSnapshot.headers.get('x-request-id') === 'gcsc-repayment-readiness-smoke',
    'Repayment readiness snapshot must echo a safe X-Request-Id header'
  );
  assert(
    repaymentReadinessSnapshot.body?.request_id === 'gcsc-repayment-readiness-smoke',
    'Repayment readiness snapshot must include request_id in the response body'
  );
  assert(
    repaymentReadinessSnapshot.body?.mode === 'repayment_readiness_snapshot',
    'Repayment readiness snapshot must expose repayment_readiness_snapshot mode'
  );
  assert(
    Number.isFinite(repaymentReadinessSnapshot.body?.readiness_score),
    'Repayment readiness snapshot must return a numeric readiness_score'
  );
  assert(
    repaymentReadinessSnapshot.body?.readiness_factors?.some((item) => item.id === 'evidence_status') &&
      repaymentReadinessSnapshot.body?.readiness_factors?.some((item) => item.id === 'dispute_status') &&
      repaymentReadinessSnapshot.body?.readiness_factors?.some((item) => item.id === 'payment_status'),
    'Repayment readiness snapshot must include evidence, dispute, and payment status factors'
  );
  assert(
    repaymentReadinessSnapshot.body?.demo_only_repayment_readiness_gate?.repayment_routing === 'blocked' &&
      repaymentReadinessSnapshot.body?.demo_only_repayment_readiness_gate?.payment_movement === 'blocked' &&
      repaymentReadinessSnapshot.body?.demo_only_repayment_readiness_gate?.escrow_release === 'blocked',
    'Repayment readiness snapshot must block repayment routing, payment movement, and escrow release'
  );
  assert(
    repaymentReadinessSnapshot.body?.no_real_repayment_routing_attempted === true &&
      repaymentReadinessSnapshot.body?.no_payment_movement_attempted === true &&
      repaymentReadinessSnapshot.body?.no_escrow_release_attempted === true &&
      repaymentReadinessSnapshot.body?.no_live_action_attempted === true,
    'Repayment readiness snapshot must remain local-only with no live actions'
  );

  const invalidRepaymentReadinessSnapshot = await request(
    baseUrl,
    '/api/smartcontractor/repayment-readiness-snapshot?milestone_payment_usd=-1&loan_outstanding_usd=-5&contractor_invoice_usd=not-a-number&evidence_status=live_verified&dispute_status=court_ordered&payment_status=settled',
    { headers: { 'X-Request-Id': 'gcsc-repayment-readiness-invalid-smoke' } }
  );
  assert(
    invalidRepaymentReadinessSnapshot.status === 400,
    `Expected invalid repayment-readiness-snapshot 400, got ${invalidRepaymentReadinessSnapshot.status}`
  );
  assert(
    invalidRepaymentReadinessSnapshot.headers.get('x-request-id') === 'gcsc-repayment-readiness-invalid-smoke',
    'Invalid repayment readiness snapshot must echo a safe X-Request-Id header'
  );
  assert(
    invalidRepaymentReadinessSnapshot.body?.request_id === 'gcsc-repayment-readiness-invalid-smoke',
    'Invalid repayment readiness snapshot must include request_id in the response body'
  );
  assert(
    invalidRepaymentReadinessSnapshot.body?.mode === 'repayment_readiness_snapshot_validation_error',
    'Invalid repayment readiness snapshot must expose repayment_readiness_snapshot_validation_error mode'
  );
  assert(
    invalidRepaymentReadinessSnapshot.body?.details?.includes('milestone_payment_usd must be a positive finite number') &&
      invalidRepaymentReadinessSnapshot.body?.details?.includes('loan_outstanding_usd must be a non-negative finite number') &&
      invalidRepaymentReadinessSnapshot.body?.details?.includes('contractor_invoice_usd must be a non-negative finite number') &&
      invalidRepaymentReadinessSnapshot.body?.details?.includes('evidence_status must be one of: missing, partial, submitted, verified') &&
      invalidRepaymentReadinessSnapshot.body?.details?.includes('dispute_status must be one of: none, open, unresolved') &&
      invalidRepaymentReadinessSnapshot.body?.details?.includes('payment_status must be one of: not_funded, funded, disputed, released'),
    'Invalid repayment readiness snapshot must describe invalid numeric and status fields'
  );
  assert(
    invalidRepaymentReadinessSnapshot.body?.no_real_repayment_routing_attempted === true &&
      invalidRepaymentReadinessSnapshot.body?.no_payment_movement_attempted === true &&
      invalidRepaymentReadinessSnapshot.body?.no_escrow_release_attempted === true &&
      invalidRepaymentReadinessSnapshot.body?.no_live_action_attempted === true,
    'Invalid repayment readiness snapshot must remain no-routing, no-payment, no-escrow, and no-live-action'
  );

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
    Array.isArray(founderAuthSetupReport.body?.founder_auth_live_action_gate_board),
    'Founder Auth Setup report must return founder_auth_live_action_gate_board array'
  );
  assert(
    founderAuthSetupReport.body.founder_auth_live_action_gate_board.some((item) => item.label === 'Same-browser Magic Link gate') &&
      founderAuthSetupReport.body.founder_auth_live_action_gate_board.some((item) => item.label === 'Profile binding gate') &&
      founderAuthSetupReport.body.founder_auth_live_action_gate_board.some((item) => item.label === 'Admin membership approval gate') &&
      founderAuthSetupReport.body.founder_auth_live_action_gate_board.some((item) => item.label === 'Strict RLS and deploy gate') &&
      founderAuthSetupReport.body.founder_auth_live_action_gate_board.some((item) => item.label === 'Regulated finance action gate'),
    'Founder Auth Setup report must include founder live action gate rows'
  );
  const founderAuthBlockedActions = founderAuthSetupReport.body.founder_auth_live_action_gate_board.flatMap((item) =>
    Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
  );
  assert(
    founderAuthBlockedActions.includes('admin_memberships_insert') &&
      founderAuthBlockedActions.includes('strict_rls_apply') &&
      founderAuthBlockedActions.includes('public_beta_flip'),
    'Founder Auth Setup report must block admin membership insert, strict RLS apply, and public beta flip in the gate board'
  );
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
    Array.isArray(strictAdminSmokeReadiness.body?.strict_admin_smoke_evidence_gate_board),
    'Strict admin smoke readiness must return strict_admin_smoke_evidence_gate_board array'
  );
  assert(
    strictAdminSmokeReadiness.body.strict_admin_smoke_evidence_gate_board.some((item) => item.label === 'Same-browser session evidence gate') &&
      strictAdminSmokeReadiness.body.strict_admin_smoke_evidence_gate_board.some((item) => item.label === 'Admin membership evidence gate') &&
      strictAdminSmokeReadiness.body.strict_admin_smoke_evidence_gate_board.some((item) => item.label === 'Service-role boundary evidence gate') &&
      strictAdminSmokeReadiness.body.strict_admin_smoke_evidence_gate_board.some((item) => item.label === 'Strict command output gate') &&
      strictAdminSmokeReadiness.body.strict_admin_smoke_evidence_gate_board.some((item) => item.label === 'Post-smoke live-action stop gate'),
    'Strict admin smoke readiness must include strict smoke evidence gate rows'
  );
  const strictSmokeBlockedActions = strictAdminSmokeReadiness.body.strict_admin_smoke_evidence_gate_board.flatMap((item) =>
    Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
  );
  assert(
    strictSmokeBlockedActions.includes('admin_memberships_insert') &&
      strictSmokeBlockedActions.includes('strict_rls_apply') &&
      strictSmokeBlockedActions.includes('public_beta_flip'),
    'Strict admin smoke readiness must block admin membership insert, strict RLS apply, and public beta flip in the evidence gate board'
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

  const strictAdminSmokeDraftValidation = await request(baseUrl, '/api/admin/strict-admin-smoke-output-draft/validate', {
    method: 'POST',
    headers: { 'X-Request-Id': 'gcsc-strict-admin-smoke-draft-validation-smoke' },
    body: JSON.stringify({
      source_request_id: strictAdminSmokeOutputTemplate.body?.request_id,
      draft_text: [
        '# Strict Admin Smoke Output Template',
        'Command: npm run check:strict-gates',
        'Exit code: 0',
        'Request ID: gcsc-strict-gates-local-safe',
        'Safe stdout summary: strict route checks echoed safe request IDs only.',
        'Safe stderr summary: none.',
        'Secret redaction confirmed: yes',
        'No admin_memberships insert, profile repair write, strict RLS apply, live Supabase change, deploy setting change, public beta flip, payment, loan, escrow, stablecoin settlement, token collateral, XPR signature, legal decision, provider commitment, or production release was attempted.',
      ].join('\n'),
    }),
  });
  assert(
    strictAdminSmokeDraftValidation.status === 200,
    `Expected strict-admin-smoke-output-draft validation 200, got ${strictAdminSmokeDraftValidation.status}`
  );
  assert(
    strictAdminSmokeDraftValidation.headers.get('x-request-id') === 'gcsc-strict-admin-smoke-draft-validation-smoke',
    'Strict admin smoke draft validation must echo a safe X-Request-Id header'
  );
  assert(
    strictAdminSmokeDraftValidation.body?.request_id === 'gcsc-strict-admin-smoke-draft-validation-smoke',
    'Strict admin smoke draft validation must include request_id in the response body'
  );
  assert(
    strictAdminSmokeDraftValidation.body?.mode === 'strict_admin_smoke_output_draft_validation',
    'Strict admin smoke draft validation must expose strict_admin_smoke_output_draft_validation mode'
  );
  assert(
    strictAdminSmokeDraftValidation.body?.draft_validation_sections?.some((item) => item.id === 'draft_redaction_scan'),
    'Strict admin smoke draft validation must include draft_redaction_scan section'
  );
  assert(
    Array.isArray(strictAdminSmokeDraftValidation.body?.forbidden_content_findings),
    'Strict admin smoke draft validation must expose forbidden_content_findings'
  );
  assert(
    strictAdminSmokeDraftValidation.body?.draft_validation_gate?.external_send === 'blocked',
    'Strict admin smoke draft validation must block external send'
  );
  assert(
    strictAdminSmokeDraftValidation.body?.safe_copy_summary?.includes('strict admin smoke'),
    'Strict admin smoke draft validation must include a safe copy summary'
  );
  assert(
    strictAdminSmokeDraftValidation.body?.no_server_storage_attempted === true,
    'Strict admin smoke draft validation must not store draft text server-side'
  );
  assert(
    strictAdminSmokeDraftValidation.body?.no_live_action_attempted === true,
    'Strict admin smoke draft validation must not attempt live actions'
  );

  const requestTraceReport = await request(baseUrl, '/api/admin/request-trace-report', {
    method: 'POST',
    headers: { 'X-Request-Id': 'gcsc-request-trace-report-smoke' },
    body: JSON.stringify({
      source_surface: 'strict_admin_smoke',
      request_ids: [
        'gcsc-strict-admin-smoke-readiness-smoke',
        'gcsc-strict-admin-smoke-output-template-smoke',
        strictAdminSmokeDraftValidation.body?.request_id,
      ],
      report_notes: 'Local founder/admin report for strict admin smoke request IDs only. No secrets, Magic Link URLs, tokens, service-role keys, live Supabase writes, payments, loans, escrow, provider commitments, legal decisions, or production release.',
    }),
  });
  assert(
    requestTraceReport.status === 200,
    `Expected request-trace-report 200, got ${requestTraceReport.status}`
  );
  assert(
    requestTraceReport.headers.get('x-request-id') === 'gcsc-request-trace-report-smoke',
    'Request trace report must echo a safe X-Request-Id header'
  );
  assert(
    requestTraceReport.body?.request_id === 'gcsc-request-trace-report-smoke',
    'Request trace report must include request_id in the response body'
  );
  assert(
    requestTraceReport.body?.mode === 'request_trace_report',
    'Request trace report must expose request_trace_report mode'
  );
  assert(
    requestTraceReport.body?.request_trace_report_sections?.some((item) => item.id === 'request_id_collection'),
    'Request trace report must include request_id_collection section'
  );
  assert(
    requestTraceReport.body?.safe_request_ids?.includes('gcsc-strict-admin-smoke-readiness-smoke'),
    'Request trace report must preserve safe request IDs'
  );
  assert(
    requestTraceReport.body?.request_trace_report_gate?.external_send === 'blocked',
    'Request trace report must block external send'
  );
  assert(
    requestTraceReport.body?.copyable_report_markdown?.includes('Request Trace Report'),
    'Request trace report must include copyable markdown'
  );
  assert(
    requestTraceReport.body?.no_server_storage_attempted === true,
    'Request trace report must not store report content server-side'
  );
  assert(
    requestTraceReport.body?.no_live_action_attempted === true,
    'Request trace report must not attempt live actions'
  );

  const requestTraceReportRedaction = await request(baseUrl, '/api/admin/request-trace-report', {
    method: 'POST',
    headers: { 'X-Request-Id': 'gcsc-request-trace-report-redaction-smoke' },
    body: JSON.stringify({
      source_surface: 'strict_admin_smoke',
      request_ids: ['https://example.test/magic?access_token=redacted-placeholder-token'],
      report_notes: 'Local scanner test only.',
    }),
  });
  assert(
    requestTraceReportRedaction.status === 200,
    `Expected request-trace-report redaction 200, got ${requestTraceReportRedaction.status}`
  );
  assert(
    requestTraceReportRedaction.body?.status === 'blocked_for_redaction',
    'Request trace report must block raw request ID inputs that include secret-looking URLs'
  );
  assert(
    requestTraceReportRedaction.body?.forbidden_content_findings?.some((item) => item.id === 'magic_link_url'),
    'Request trace report must scan raw request ID input for Magic Link or private auth URLs before sanitizing IDs'
  );
  assert(
    requestTraceReportRedaction.body?.no_server_storage_attempted === true &&
      requestTraceReportRedaction.body?.no_live_action_attempted === true,
    'Request trace report redaction scan must remain no-storage and no-live-action'
  );

  const requestTraceReportInputLimits = await request(baseUrl, '/api/admin/request-trace-report', {
    method: 'POST',
    headers: { 'X-Request-Id': 'gcsc-request-trace-report-input-limits-smoke' },
    body: JSON.stringify({
      source_surface: 'strict_admin_smoke',
      request_ids: Array.from({ length: 24 }, (_, index) => `gcsc-safe-request-${index + 1}`),
      report_notes: 'Local scanner test only. '.repeat(240),
    }),
  });
  assert(
    requestTraceReportInputLimits.status === 200,
    `Expected request-trace-report input limits 200, got ${requestTraceReportInputLimits.status}`
  );
  assert(
    requestTraceReportInputLimits.body?.status === 'local_report_ready_with_input_limits',
    'Request trace report must disclose safe local input limits instead of silently trimming oversized local report inputs'
  );
  assert(
    requestTraceReportInputLimits.body?.input_limit_warnings?.some((item) => item.id === 'request_ids_trimmed_to_20') &&
      requestTraceReportInputLimits.body?.input_limit_warnings?.some((item) => item.id === 'report_notes_truncated_to_4000'),
    'Request trace report must return input_limit_warnings for trimmed request IDs and truncated notes'
  );
  assert(
    requestTraceReportInputLimits.body?.request_trace_report_sections?.some((item) => item.id === 'request_trace_report_input_limits'),
    'Request trace report must include a request_trace_report_input_limits review section'
  );
  assert(
    requestTraceReportInputLimits.body?.safe_request_ids?.length === 20,
    'Request trace report must keep only the first 20 sanitized request IDs'
  );
  assert(
    requestTraceReportInputLimits.body?.no_server_storage_attempted === true &&
      requestTraceReportInputLimits.body?.no_live_action_attempted === true,
    'Request trace report input-limit handling must remain no-storage and no-live-action'
  );

  const adminEvidenceExportPreview = await request(baseUrl, '/api/admin/admin-evidence-export-preview', {
    headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-smoke' },
  });
  assert(
    adminEvidenceExportPreview.status === 200,
    `Expected admin-evidence-export-preview 200, got ${adminEvidenceExportPreview.status}`
  );
  assert(
    adminEvidenceExportPreview.headers.get('x-request-id') === 'gcsc-admin-evidence-export-preview-smoke',
    'Admin evidence export preview must echo a safe X-Request-Id header'
  );
  assert(
    adminEvidenceExportPreview.body?.request_id === 'gcsc-admin-evidence-export-preview-smoke',
    'Admin evidence export preview must include request_id in the response body'
  );
  assert(
    adminEvidenceExportPreview.body?.mode === 'admin_evidence_export_preview',
    'Admin evidence export preview must expose admin_evidence_export_preview mode'
  );
  assert(
    adminEvidenceExportPreview.body?.metadata_allowlist?.includes('generated_at') &&
      adminEvidenceExportPreview.body?.metadata_allowlist?.includes('safe_request_ids'),
    'Admin evidence export preview must expose safe metadata_allowlist fields'
  );
  assert(
    adminEvidenceExportPreview.body?.blocked_fields?.includes('raw_draft_text') &&
      adminEvidenceExportPreview.body?.blocked_fields?.includes('copyable_report_markdown'),
    'Admin evidence export preview must block raw draft text and copyable markdown from metadata export'
  );
  assert(
    adminEvidenceExportPreview.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreview.body?.export_gate?.server_storage === 'blocked',
    'Admin evidence export preview must block external send and server storage'
  );
  assert(
    adminEvidenceExportPreview.body?.export_gate?.real_money_or_token_action === 'blocked',
    'Admin evidence export preview must block real money or token actions'
  );
  assert(
    adminEvidenceExportPreview.body?.preview_sections?.some((item) => item.id === 'metadata_allowlist_review'),
    'Admin evidence export preview must include metadata_allowlist_review section'
  );
  assert(
    adminEvidenceExportPreview.body?.review_router?.mode === 'admin_evidence_export_preview_review_router',
    'Admin evidence export preview must expose admin_evidence_export_preview_review_router mode'
  );
  assert(
    adminEvidenceExportPreview.body?.review_router?.scope === 'local_ui_navigation_only',
    'Admin evidence export preview review router must stay local UI navigation only'
  );
  assert(
    adminEvidenceExportPreview.body?.review_router?.no_server_storage_attempted === true &&
      adminEvidenceExportPreview.body?.review_router?.no_external_export_attempted === true &&
      adminEvidenceExportPreview.body?.review_router?.no_live_action_attempted === true,
    'Admin evidence export preview review router must remain no-storage, no-export, and no-live-action'
  );
  assert(
    adminEvidenceExportPreview.body?.review_router?.targets?.some((target) => target.ui_anchor === 'requestTraceReportHistoryGrid'),
    'Admin evidence export preview review router must include requestTraceReportHistoryGrid target'
  );
  assert(
    adminEvidenceExportPreview.body?.evidence_sources?.every((source) => Array.isArray(source.review_targets) && source.review_targets.length > 0),
    'Admin evidence export preview evidence sources must expose review_targets'
  );
  assert(
    adminEvidenceExportPreview.body?.no_server_storage_attempted === true,
    'Admin evidence export preview must not store export content server-side'
  );
  assert(
    adminEvidenceExportPreview.body?.no_live_action_attempted === true,
    'Admin evidence export preview must not attempt live actions'
  );

  const adminEvidenceExportPreviewFiltered = await request(baseUrl, '/api/admin/admin-evidence-export-preview?source_filter=request_trace_report_history', {
    headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-filtered-smoke' },
  });
  assert(
    adminEvidenceExportPreviewFiltered.status === 200,
    `Expected filtered admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewFiltered.status}`
  );
  assert(
    adminEvidenceExportPreviewFiltered.body?.selected_source_filter === 'request_trace_report_history',
    'Filtered admin evidence export preview must echo selected_source_filter'
  );
  assert(
    adminEvidenceExportPreviewFiltered.body?.valid_source_filters?.includes('request_trace_report_history'),
    'Filtered admin evidence export preview must expose valid_source_filters'
  );
  assert(
    adminEvidenceExportPreviewFiltered.body?.evidence_sources?.length === 1 &&
      adminEvidenceExportPreviewFiltered.body.evidence_sources[0]?.id === 'request_trace_report_history',
    'Filtered admin evidence export preview must return only the selected local evidence source'
  );
  assert(
    adminEvidenceExportPreviewFiltered.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewFiltered.body.review_router.targets[0]?.source_id === 'request_trace_report_history' &&
      adminEvidenceExportPreviewFiltered.body.review_router.targets[0]?.ui_anchor === 'requestTraceReportHistoryGrid',
    'Filtered admin evidence export preview review router must return only the selected local source target'
  );
  assert(
    adminEvidenceExportPreviewFiltered.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewFiltered.body?.no_live_action_attempted === true,
    'Filtered admin evidence export preview must remain no-storage and no-live-action'
  );

  const publicCopyExportBoundary =
    'No raw public copy drafts, issue excerpts, secrets, payment data, identity data, provider/legal decisions, public beta approvals, production approvals, external sends, or live-action approvals are stored in this history.';
  const adminEvidenceExportPreviewPublicCopyHistory = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=traditional_first_public_copy_validation_history',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-public-copy-history-smoke' },
    }
  );
  const publicCopyHistorySource = adminEvidenceExportPreviewPublicCopyHistory.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewPublicCopyHistory.status === 200,
    `Expected public-copy history admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewPublicCopyHistory.status}`
  );
  assert(
    adminEvidenceExportPreviewPublicCopyHistory.body?.selected_source_filter === 'traditional_first_public_copy_validation_history' &&
      adminEvidenceExportPreviewPublicCopyHistory.body?.valid_source_filters?.includes('traditional_first_public_copy_validation_history'),
    'Public-copy history admin evidence export preview must accept the traditional-first public copy validation history source filter'
  );
  assert(
    adminEvidenceExportPreviewPublicCopyHistory.body?.evidence_sources?.length === 1 &&
      publicCopyHistorySource?.id === 'traditional_first_public_copy_validation_history',
    'Public-copy history admin evidence export preview must return only the traditional-first public copy validation history source'
  );
  assert(
    adminEvidenceExportPreviewPublicCopyHistory.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewPublicCopyHistory.body.review_router.targets[0]?.source_id === 'traditional_first_public_copy_validation_history' &&
      adminEvidenceExportPreviewPublicCopyHistory.body.review_router.targets[0]?.ui_anchor === 'traditionalFirstPublicCopyValidationHistoryGrid',
    'Public-copy history admin evidence export preview review router must point to traditionalFirstPublicCopyValidationHistoryGrid'
  );
  assert(
    publicCopyHistorySource?.allowed_fields?.includes('public_copy_validation_metadata_history_only') &&
      publicCopyHistorySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Public-copy history admin evidence export preview must allow metadata-only history and source boundary fields'
  );
  assert(
    publicCopyHistorySource?.blocked_fields?.includes('raw_public_copy_draft') &&
      publicCopyHistorySource?.blocked_fields?.includes('copy_text') &&
      publicCopyHistorySource?.blocked_fields?.includes('issue_excerpt'),
    'Public-copy history admin evidence export preview must block raw public copy drafts, copy text, and issue excerpts'
  );
  assert(
    publicCopyHistorySource?.raw_content_storage_boundary === publicCopyExportBoundary,
    'Public-copy history admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewPublicCopyHistory.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewPublicCopyHistory.body?.no_live_action_attempted === true,
    'Public-copy history admin evidence export preview must remain no-storage and no-live-action'
  );

  const adminEvidenceExportPreviewReviewerNoteHistory = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=beta_finance_contract_reviewer_note_validation_history',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-reviewer-note-history-smoke' },
    }
  );
  const reviewerNoteExportBoundary =
    'No raw reviewer notes, issue excerpts, secrets, payment data, identity data, signed contract text, XPR signatures, provider/legal decisions, public beta approvals, production approvals, external sends, or live-action approvals are stored in this history.';
  const reviewerNoteHistorySource = adminEvidenceExportPreviewReviewerNoteHistory.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewReviewerNoteHistory.status === 200,
    `Expected reviewer-note history admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewReviewerNoteHistory.status}`
  );
  assert(
    adminEvidenceExportPreviewReviewerNoteHistory.body?.selected_source_filter === 'beta_finance_contract_reviewer_note_validation_history' &&
      adminEvidenceExportPreviewReviewerNoteHistory.body?.valid_source_filters?.includes('beta_finance_contract_reviewer_note_validation_history'),
    'Reviewer-note history admin evidence export preview must accept the reviewer note validation history source filter'
  );
  assert(
    adminEvidenceExportPreviewReviewerNoteHistory.body?.evidence_sources?.length === 1 &&
      reviewerNoteHistorySource?.id === 'beta_finance_contract_reviewer_note_validation_history',
    'Reviewer-note history admin evidence export preview must return only the reviewer note validation history source'
  );
  assert(
    adminEvidenceExportPreviewReviewerNoteHistory.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewReviewerNoteHistory.body.review_router.targets[0]?.source_id === 'beta_finance_contract_reviewer_note_validation_history' &&
      adminEvidenceExportPreviewReviewerNoteHistory.body.review_router.targets[0]?.ui_anchor === 'betaFinanceContractReviewerNoteValidationHistoryGrid',
    'Reviewer-note history admin evidence export preview review router must point to betaFinanceContractReviewerNoteValidationHistoryGrid'
  );
  assert(
    reviewerNoteHistorySource?.allowed_fields?.includes('reviewer_note_validation_metadata_history_only') &&
      reviewerNoteHistorySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Reviewer-note history admin evidence export preview must allow metadata-only history and source boundary fields'
  );
  assert(
    reviewerNoteHistorySource?.blocked_fields?.includes('raw_reviewer_note') &&
      reviewerNoteHistorySource?.blocked_fields?.includes('issue_excerpt'),
    'Reviewer-note history admin evidence export preview must block raw reviewer notes and issue excerpts'
  );
  assert(
    reviewerNoteHistorySource?.raw_content_storage_boundary === reviewerNoteExportBoundary,
    'Reviewer-note history admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewReviewerNoteHistory.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewReviewerNoteHistory.body?.no_live_action_attempted === true,
    'Reviewer-note history admin evidence export preview must remain no-storage and no-live-action'
  );

  const liveConfusionExportBoundary =
    'No raw live-confusion notes, issue excerpts, secrets, payment data, identity data, signed contract text, XPR signatures, provider/legal decisions, public beta approvals, external follow-up approvals, production approvals, external sends, or live-action approvals are stored in this history.';
  const adminEvidenceExportPreviewLiveConfusionHistory = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=beta_finance_contract_live_confusion_validation_history',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-live-confusion-history-smoke' },
    }
  );
  const liveConfusionHistorySource = adminEvidenceExportPreviewLiveConfusionHistory.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewLiveConfusionHistory.status === 200,
    `Expected live-confusion history admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewLiveConfusionHistory.status}`
  );
  assert(
    adminEvidenceExportPreviewLiveConfusionHistory.body?.selected_source_filter === 'beta_finance_contract_live_confusion_validation_history' &&
      adminEvidenceExportPreviewLiveConfusionHistory.body?.valid_source_filters?.includes('beta_finance_contract_live_confusion_validation_history'),
    'Live-confusion history admin evidence export preview must accept the live-confusion validation history source filter'
  );
  assert(
    adminEvidenceExportPreviewLiveConfusionHistory.body?.evidence_sources?.length === 1 &&
      liveConfusionHistorySource?.id === 'beta_finance_contract_live_confusion_validation_history',
    'Live-confusion history admin evidence export preview must return only the live-confusion validation history source'
  );
  assert(
    adminEvidenceExportPreviewLiveConfusionHistory.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewLiveConfusionHistory.body.review_router.targets[0]?.source_id === 'beta_finance_contract_live_confusion_validation_history' &&
      adminEvidenceExportPreviewLiveConfusionHistory.body.review_router.targets[0]?.ui_anchor === 'betaFinanceContractLiveConfusionValidationHistoryGrid',
    'Live-confusion history admin evidence export preview review router must point to betaFinanceContractLiveConfusionValidationHistoryGrid'
  );
  assert(
    liveConfusionHistorySource?.allowed_fields?.includes('live_confusion_validation_metadata_history_only') &&
      liveConfusionHistorySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Live-confusion history admin evidence export preview must allow metadata-only history and source boundary fields'
  );
  assert(
    liveConfusionHistorySource?.blocked_fields?.includes('raw_live_confusion_note') &&
      liveConfusionHistorySource?.blocked_fields?.includes('live_confusion_issue_excerpt'),
    'Live-confusion history admin evidence export preview must block raw live-confusion notes and issue excerpts'
  );
  assert(
    liveConfusionHistorySource?.raw_content_storage_boundary === liveConfusionExportBoundary,
    'Live-confusion history admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewLiveConfusionHistory.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewLiveConfusionHistory.body?.no_live_action_attempted === true,
    'Live-confusion history admin evidence export preview must remain no-storage and no-live-action'
  );

  const sessionSafetyExportBoundary =
    'No raw session-safety notes, issue excerpts, secrets, payment data, identity data, signed contract text, XPR signatures, stablecoin settlement approvals, token collateral approvals, provider/legal decisions, public beta approvals, external follow-up approvals, production approvals, external sends, or live-action approvals are stored in this history.';
  const adminEvidenceExportPreviewSessionSafetyHistory = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=beta_finance_contract_session_safety_validation_history',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-session-safety-history-smoke' },
    }
  );
  const sessionSafetyHistorySource = adminEvidenceExportPreviewSessionSafetyHistory.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewSessionSafetyHistory.status === 200,
    `Expected session-safety history admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewSessionSafetyHistory.status}`
  );
  assert(
    adminEvidenceExportPreviewSessionSafetyHistory.body?.selected_source_filter === 'beta_finance_contract_session_safety_validation_history' &&
      adminEvidenceExportPreviewSessionSafetyHistory.body?.valid_source_filters?.includes('beta_finance_contract_session_safety_validation_history'),
    'Session-safety history admin evidence export preview must accept the session-safety validation history source filter'
  );
  assert(
    adminEvidenceExportPreviewSessionSafetyHistory.body?.evidence_sources?.length === 1 &&
      sessionSafetyHistorySource?.id === 'beta_finance_contract_session_safety_validation_history',
    'Session-safety history admin evidence export preview must return only the session-safety validation history source'
  );
  assert(
    adminEvidenceExportPreviewSessionSafetyHistory.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewSessionSafetyHistory.body.review_router.targets[0]?.source_id === 'beta_finance_contract_session_safety_validation_history' &&
      adminEvidenceExportPreviewSessionSafetyHistory.body.review_router.targets[0]?.ui_anchor === 'betaFinanceContractSessionSafetyValidationHistoryGrid',
    'Session-safety history admin evidence export preview review router must point to betaFinanceContractSessionSafetyValidationHistoryGrid'
  );
  assert(
    sessionSafetyHistorySource?.allowed_fields?.includes('session_safety_validation_metadata_history_only') &&
      sessionSafetyHistorySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Session-safety history admin evidence export preview must allow metadata-only history and source boundary fields'
  );
  assert(
    sessionSafetyHistorySource?.blocked_fields?.includes('raw_session_safety_note') &&
      sessionSafetyHistorySource?.blocked_fields?.includes('session_safety_issue_excerpt'),
    'Session-safety history admin evidence export preview must block raw session-safety notes and issue excerpts'
  );
  assert(
    sessionSafetyHistorySource?.raw_content_storage_boundary === sessionSafetyExportBoundary,
    'Session-safety history admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewSessionSafetyHistory.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewSessionSafetyHistory.body?.no_live_action_attempted === true,
    'Session-safety history admin evidence export preview must remain no-storage and no-live-action'
  );

  const safeHandoffReportExportBoundary =
    'No copyable markdown, raw notes, issue excerpts, secrets, payment data, identity data, signed contract text, XPR signatures, stablecoin approvals, token collateral approvals, provider/legal decisions, public beta approvals, production approvals, external sends, server storage, or live-action approvals are stored in this history.';
  const adminEvidenceExportPreviewSafeHandoffReportHistory = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=beta_finance_contract_safe_handoff_report_history',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-safe-handoff-report-history-smoke' },
    }
  );
  const safeHandoffReportHistorySource = adminEvidenceExportPreviewSafeHandoffReportHistory.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewSafeHandoffReportHistory.status === 200,
    `Expected safe handoff report history admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewSafeHandoffReportHistory.status}`
  );
  assert(
    adminEvidenceExportPreviewSafeHandoffReportHistory.body?.selected_source_filter === 'beta_finance_contract_safe_handoff_report_history' &&
      adminEvidenceExportPreviewSafeHandoffReportHistory.body?.valid_source_filters?.includes('beta_finance_contract_safe_handoff_report_history'),
    'Safe handoff report history admin evidence export preview must accept the safe handoff report history source filter'
  );
  assert(
    adminEvidenceExportPreviewSafeHandoffReportHistory.body?.evidence_sources?.length === 1 &&
      safeHandoffReportHistorySource?.id === 'beta_finance_contract_safe_handoff_report_history',
    'Safe handoff report history admin evidence export preview must return only the safe handoff report history source'
  );
  assert(
    adminEvidenceExportPreviewSafeHandoffReportHistory.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewSafeHandoffReportHistory.body.review_router.targets[0]?.source_id === 'beta_finance_contract_safe_handoff_report_history' &&
      adminEvidenceExportPreviewSafeHandoffReportHistory.body.review_router.targets[0]?.ui_anchor === 'betaFinanceContractSafeHandoffReportHistoryGrid',
    'Safe handoff report history admin evidence export preview review router must point to betaFinanceContractSafeHandoffReportHistoryGrid'
  );
  assert(
    safeHandoffReportHistorySource?.allowed_fields?.includes('safe_handoff_report_metadata_history_only') &&
      safeHandoffReportHistorySource?.allowed_fields?.includes('no_copyable_markdown_storage') &&
      safeHandoffReportHistorySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Safe handoff report history admin evidence export preview must allow report metadata-only history and source boundary fields'
  );
  assert(
    safeHandoffReportHistorySource?.blocked_fields?.includes('copyable_markdown') &&
      safeHandoffReportHistorySource?.blocked_fields?.includes('raw_notes') &&
      safeHandoffReportHistorySource?.blocked_fields?.includes('issue_excerpts') &&
      safeHandoffReportHistorySource?.blocked_fields?.includes('stablecoin_approval') &&
      safeHandoffReportHistorySource?.blocked_fields?.includes('token_collateral_approval'),
    'Safe handoff report history admin evidence export preview must block copyable markdown, raw notes, issue excerpts, stablecoin approvals, and token collateral approvals'
  );
  assert(
    safeHandoffReportHistorySource?.raw_content_storage_boundary === safeHandoffReportExportBoundary,
    'Safe handoff report history admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewSafeHandoffReportHistory.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewSafeHandoffReportHistory.body?.no_live_action_attempted === true,
    'Safe handoff report history admin evidence export preview must remain no-storage and no-live-action'
  );

  const adminEvidenceExportPreviewJobFitHistory = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=job_fit_snapshot_history',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-job-fit-history-smoke' },
    }
  );
  const jobFitExportBoundary =
    'No raw job details, real lead routing history, contractor assignment approvals, live matching actions, external sends, server storage, or live-action approvals are stored in this history.';
  const jobFitHistorySource = adminEvidenceExportPreviewJobFitHistory.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewJobFitHistory.status === 200,
    `Expected job fit history admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewJobFitHistory.status}`
  );
  assert(
    adminEvidenceExportPreviewJobFitHistory.body?.selected_source_filter === 'job_fit_snapshot_history' &&
      adminEvidenceExportPreviewJobFitHistory.body?.valid_source_filters?.includes('job_fit_snapshot_history'),
    'Job fit history admin evidence export preview must accept the job fit snapshot history source filter'
  );
  assert(
    adminEvidenceExportPreviewJobFitHistory.body?.evidence_sources?.length === 1 &&
      adminEvidenceExportPreviewJobFitHistory.body.evidence_sources[0]?.id === 'job_fit_snapshot_history',
    'Job fit history admin evidence export preview must return only the job fit snapshot history source'
  );
  assert(
    adminEvidenceExportPreviewJobFitHistory.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewJobFitHistory.body.review_router.targets[0]?.source_id === 'job_fit_snapshot_history' &&
      adminEvidenceExportPreviewJobFitHistory.body.review_router.targets[0]?.ui_anchor === 'jobFitSnapshotHistoryGrid',
    'Job fit history admin evidence export preview review router must point to jobFitSnapshotHistoryGrid'
  );
  assert(
    jobFitHistorySource?.allowed_fields?.includes('fit_score') &&
      jobFitHistorySource?.allowed_fields?.includes('no_real_lead_routing_history_stored') &&
      jobFitHistorySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Job fit history admin evidence export preview must allow job fit metadata and source boundary fields only'
  );
  assert(
    jobFitHistorySource?.blocked_fields?.includes('raw_job_details') &&
      jobFitHistorySource?.blocked_fields?.includes('real_lead_routing') &&
      jobFitHistorySource?.blocked_fields?.includes('contractor_assignment_approval') &&
      jobFitHistorySource?.blocked_fields?.includes('live_matching_action'),
    'Job fit history admin evidence export preview must block raw job details, real lead routing, contractor assignment approvals, and live matching evidence'
  );
  assert(
    jobFitHistorySource?.raw_content_storage_boundary === jobFitExportBoundary,
    'Job fit history admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewJobFitHistory.body?.export_gate?.real_money_or_token_action === 'blocked' &&
      adminEvidenceExportPreviewJobFitHistory.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewJobFitHistory.body?.no_live_action_attempted === true,
    'Job fit history admin evidence export preview must remain no-storage, no-money, and no-live-action'
  );

  const adminEvidenceExportPreviewBidReadinessHistory = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=bid_readiness_comparison_history',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-bid-readiness-history-smoke' },
    }
  );
  const bidReadinessExportBoundary =
    'No raw bid details, winning bid selection history, contractor assignment approvals, live selection actions, external sends, server storage, or live-action approvals are stored in this history.';
  const bidReadinessHistorySource = adminEvidenceExportPreviewBidReadinessHistory.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewBidReadinessHistory.status === 200,
    `Expected bid readiness history admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewBidReadinessHistory.status}`
  );
  assert(
    adminEvidenceExportPreviewBidReadinessHistory.body?.selected_source_filter === 'bid_readiness_comparison_history' &&
      adminEvidenceExportPreviewBidReadinessHistory.body?.valid_source_filters?.includes('bid_readiness_comparison_history'),
    'Bid readiness history admin evidence export preview must accept the bid readiness comparison history source filter'
  );
  assert(
    adminEvidenceExportPreviewBidReadinessHistory.body?.evidence_sources?.length === 1 &&
      adminEvidenceExportPreviewBidReadinessHistory.body.evidence_sources[0]?.id === 'bid_readiness_comparison_history',
    'Bid readiness history admin evidence export preview must return only the bid readiness comparison history source'
  );
  assert(
    adminEvidenceExportPreviewBidReadinessHistory.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewBidReadinessHistory.body.review_router.targets[0]?.source_id === 'bid_readiness_comparison_history' &&
      adminEvidenceExportPreviewBidReadinessHistory.body.review_router.targets[0]?.ui_anchor === 'bidReadinessComparisonHistoryGrid',
    'Bid readiness history admin evidence export preview review router must point to bidReadinessComparisonHistoryGrid'
  );
  assert(
    bidReadinessHistorySource?.allowed_fields?.includes('bid_readiness_comparison_metadata_history_only') &&
      bidReadinessHistorySource?.allowed_fields?.includes('readiness_score') &&
      bidReadinessHistorySource?.allowed_fields?.includes('no_winning_bid_history_stored') &&
      bidReadinessHistorySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Bid readiness history admin evidence export preview must allow bid readiness metadata and source boundary fields only'
  );
  assert(
    bidReadinessHistorySource?.blocked_fields?.includes('raw_bid_details') &&
      bidReadinessHistorySource?.blocked_fields?.includes('winning_bid_selection') &&
      bidReadinessHistorySource?.blocked_fields?.includes('contractor_assignment_approval') &&
      bidReadinessHistorySource?.blocked_fields?.includes('live_selection_action'),
    'Bid readiness history admin evidence export preview must block raw bid details, winning bid selection, contractor assignment approvals, and live selection evidence'
  );
  assert(
    bidReadinessHistorySource?.raw_content_storage_boundary === bidReadinessExportBoundary,
    'Bid readiness history admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewBidReadinessHistory.body?.export_gate?.real_money_or_token_action === 'blocked' &&
      adminEvidenceExportPreviewBidReadinessHistory.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewBidReadinessHistory.body?.no_live_action_attempted === true,
    'Bid readiness history admin evidence export preview must remain no-storage, no-money, and no-live-action'
  );

  const adminEvidenceExportPreviewRepaymentReadinessHistory = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=repayment_readiness_snapshot_history',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-repayment-readiness-history-smoke' },
    }
  );
  const repaymentReadinessExportBoundary =
    'No raw payment references, payment tx hashes, loan IDs, borrower identity data, payment data, wallet data, repayment readiness approvals, repayment routing approvals, escrow release approvals, contractor payout approvals, legal/provider decisions, external sends, server storage, or live-action approvals are stored in this history.';
  const repaymentReadinessHistorySource = adminEvidenceExportPreviewRepaymentReadinessHistory.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewRepaymentReadinessHistory.status === 200,
    `Expected repayment readiness history admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewRepaymentReadinessHistory.status}`
  );
  assert(
    adminEvidenceExportPreviewRepaymentReadinessHistory.body?.selected_source_filter === 'repayment_readiness_snapshot_history' &&
      adminEvidenceExportPreviewRepaymentReadinessHistory.body?.valid_source_filters?.includes('repayment_readiness_snapshot_history'),
    'Repayment readiness history admin evidence export preview must accept the repayment readiness snapshot history source filter'
  );
  assert(
    adminEvidenceExportPreviewRepaymentReadinessHistory.body?.evidence_sources?.length === 1 &&
      adminEvidenceExportPreviewRepaymentReadinessHistory.body.evidence_sources[0]?.id === 'repayment_readiness_snapshot_history',
    'Repayment readiness history admin evidence export preview must return only the repayment readiness snapshot history source'
  );
  assert(
    adminEvidenceExportPreviewRepaymentReadinessHistory.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewRepaymentReadinessHistory.body.review_router.targets[0]?.source_id === 'repayment_readiness_snapshot_history' &&
      adminEvidenceExportPreviewRepaymentReadinessHistory.body.review_router.targets[0]?.ui_anchor === 'repaymentReadinessSnapshotHistoryGrid',
    'Repayment readiness history admin evidence export preview review router must point to repaymentReadinessSnapshotHistoryGrid'
  );
  assert(
    repaymentReadinessHistorySource?.allowed_fields?.includes('repayment_readiness_snapshot_metadata_history_only') &&
      repaymentReadinessHistorySource?.allowed_fields?.includes('readiness_score') &&
      repaymentReadinessHistorySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Repayment readiness history admin evidence export preview must allow readiness metadata and source boundary fields only'
  );
  assert(
    repaymentReadinessHistorySource?.blocked_fields?.includes('raw_payment_reference') &&
      repaymentReadinessHistorySource?.blocked_fields?.includes('payment_tx_hash') &&
      repaymentReadinessHistorySource?.blocked_fields?.includes('loan_id') &&
      repaymentReadinessHistorySource?.blocked_fields?.includes('repayment_readiness_approval') &&
      repaymentReadinessHistorySource?.blocked_fields?.includes('repayment_routing_approval') &&
      repaymentReadinessHistorySource?.blocked_fields?.includes('escrow_release_approval') &&
      repaymentReadinessHistorySource?.blocked_fields?.includes('contractor_payout_approval'),
    'Repayment readiness history admin evidence export preview must block raw payment references, tx hashes, loan IDs, approvals, and live routing evidence'
  );
  assert(
    repaymentReadinessHistorySource?.raw_content_storage_boundary === repaymentReadinessExportBoundary,
    'Repayment readiness history admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewRepaymentReadinessHistory.body?.export_gate?.real_money_or_token_action === 'blocked' &&
      adminEvidenceExportPreviewRepaymentReadinessHistory.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewRepaymentReadinessHistory.body?.no_live_action_attempted === true,
    'Repayment readiness history admin evidence export preview must remain no-storage, no-money, and no-live-action'
  );

  const adminEvidenceExportPreviewRepaymentAllocationHistory = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=repayment_allocation_preview_history',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-repayment-allocation-history-smoke' },
    }
  );
  const repaymentAllocationExportBoundary =
    'No raw payment references, payment tx hashes, loan IDs, borrower identity data, payment data, wallet data, repayment routing approvals, escrow release approvals, contractor payout approvals, legal/provider decisions, external sends, server storage, or live-action approvals are stored in this history.';
  const repaymentAllocationHistorySource = adminEvidenceExportPreviewRepaymentAllocationHistory.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewRepaymentAllocationHistory.status === 200,
    `Expected repayment allocation history admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewRepaymentAllocationHistory.status}`
  );
  assert(
    adminEvidenceExportPreviewRepaymentAllocationHistory.body?.selected_source_filter === 'repayment_allocation_preview_history' &&
      adminEvidenceExportPreviewRepaymentAllocationHistory.body?.valid_source_filters?.includes('repayment_allocation_preview_history'),
    'Repayment allocation history admin evidence export preview must accept the repayment allocation preview history source filter'
  );
  assert(
    adminEvidenceExportPreviewRepaymentAllocationHistory.body?.evidence_sources?.length === 1 &&
      adminEvidenceExportPreviewRepaymentAllocationHistory.body.evidence_sources[0]?.id === 'repayment_allocation_preview_history',
    'Repayment allocation history admin evidence export preview must return only the repayment allocation preview history source'
  );
  assert(
    adminEvidenceExportPreviewRepaymentAllocationHistory.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewRepaymentAllocationHistory.body.review_router.targets[0]?.source_id === 'repayment_allocation_preview_history' &&
      adminEvidenceExportPreviewRepaymentAllocationHistory.body.review_router.targets[0]?.ui_anchor === 'repaymentAllocationPreviewHistoryGrid',
    'Repayment allocation history admin evidence export preview review router must point to repaymentAllocationPreviewHistoryGrid'
  );
  assert(
    repaymentAllocationHistorySource?.allowed_fields?.includes('repayment_allocation_preview_metadata_history_only') &&
      repaymentAllocationHistorySource?.allowed_fields?.includes('loan_repayment_hold_usd') &&
      repaymentAllocationHistorySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Repayment allocation history admin evidence export preview must allow allocation metadata and source boundary fields only'
  );
  assert(
    repaymentAllocationHistorySource?.blocked_fields?.includes('raw_payment_reference') &&
      repaymentAllocationHistorySource?.blocked_fields?.includes('payment_tx_hash') &&
      repaymentAllocationHistorySource?.blocked_fields?.includes('loan_id') &&
      repaymentAllocationHistorySource?.blocked_fields?.includes('repayment_routing_approval') &&
      repaymentAllocationHistorySource?.blocked_fields?.includes('escrow_release_approval') &&
      repaymentAllocationHistorySource?.blocked_fields?.includes('contractor_payout_approval'),
    'Repayment allocation history admin evidence export preview must block raw payment references, tx hashes, loan IDs, approvals, and live routing evidence'
  );
  assert(
    repaymentAllocationHistorySource?.raw_content_storage_boundary === repaymentAllocationExportBoundary,
    'Repayment allocation history admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewRepaymentAllocationHistory.body?.export_gate?.real_money_or_token_action === 'blocked' &&
      adminEvidenceExportPreviewRepaymentAllocationHistory.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewRepaymentAllocationHistory.body?.no_live_action_attempted === true,
    'Repayment allocation history admin evidence export preview must remain no-storage, no-money, and no-live-action'
  );

  const adminEvidenceExportPreviewMilestoneAcceptanceHistory = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=milestone_acceptance_snapshot_history',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-milestone-acceptance-history-smoke' },
    }
  );
  const milestoneAcceptanceExportBoundary =
    'No raw milestone evidence, milestone approval history, escrow release history, payment movement history, repayment routing approvals, external sends, server storage, or live-action approvals are stored in this history.';
  const milestoneAcceptanceHistorySource = adminEvidenceExportPreviewMilestoneAcceptanceHistory.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewMilestoneAcceptanceHistory.status === 200,
    `Expected milestone acceptance history admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewMilestoneAcceptanceHistory.status}`
  );
  assert(
    adminEvidenceExportPreviewMilestoneAcceptanceHistory.body?.selected_source_filter === 'milestone_acceptance_snapshot_history' &&
      adminEvidenceExportPreviewMilestoneAcceptanceHistory.body?.valid_source_filters?.includes('milestone_acceptance_snapshot_history'),
    'Milestone acceptance history admin evidence export preview must accept the milestone acceptance snapshot history source filter'
  );
  assert(
    adminEvidenceExportPreviewMilestoneAcceptanceHistory.body?.evidence_sources?.length === 1 &&
      adminEvidenceExportPreviewMilestoneAcceptanceHistory.body.evidence_sources[0]?.id === 'milestone_acceptance_snapshot_history',
    'Milestone acceptance history admin evidence export preview must return only the milestone acceptance snapshot history source'
  );
  assert(
    adminEvidenceExportPreviewMilestoneAcceptanceHistory.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewMilestoneAcceptanceHistory.body.review_router.targets[0]?.source_id === 'milestone_acceptance_snapshot_history' &&
      adminEvidenceExportPreviewMilestoneAcceptanceHistory.body.review_router.targets[0]?.ui_anchor === 'milestoneAcceptanceSnapshotHistoryGrid',
    'Milestone acceptance history admin evidence export preview review router must point to milestoneAcceptanceSnapshotHistoryGrid'
  );
  assert(
    milestoneAcceptanceHistorySource?.allowed_fields?.includes('acceptance_score') &&
      milestoneAcceptanceHistorySource?.allowed_fields?.includes('no_milestone_approval_history_stored') &&
      milestoneAcceptanceHistorySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Milestone acceptance history admin evidence export preview must allow milestone acceptance metadata and source boundary fields only'
  );
  assert(
    milestoneAcceptanceHistorySource?.blocked_fields?.includes('raw_milestone_evidence') &&
      milestoneAcceptanceHistorySource?.blocked_fields?.includes('milestone_approval_history') &&
      milestoneAcceptanceHistorySource?.blocked_fields?.includes('escrow_release_history') &&
      milestoneAcceptanceHistorySource?.blocked_fields?.includes('payment_movement_history') &&
      milestoneAcceptanceHistorySource?.blocked_fields?.includes('repayment_routing_approval'),
    'Milestone acceptance history admin evidence export preview must block raw milestone evidence, milestone approvals, escrow releases, payment movement, and live routing evidence'
  );
  assert(
    milestoneAcceptanceHistorySource?.raw_content_storage_boundary === milestoneAcceptanceExportBoundary,
    'Milestone acceptance history admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewMilestoneAcceptanceHistory.body?.export_gate?.real_money_or_token_action === 'blocked' &&
      adminEvidenceExportPreviewMilestoneAcceptanceHistory.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewMilestoneAcceptanceHistory.body?.no_live_action_attempted === true,
    'Milestone acceptance history admin evidence export preview must remain no-storage, no-money, and no-live-action'
  );

  const disputePacketExportBoundary =
    'No dispute evidence packet sections, markdown previews, redaction attestation values, raw evidence, peer review details, secrets, payment data, wallet data, provider submissions, legal decisions, liability decisions, escrow releases, refund issues, payment movements, payment routing approvals, Auth/RLS changes, or production approvals are stored in this dispute evidence review packet history.';
  const adminEvidenceExportPreviewDisputePacketHistory = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=dispute_evidence_review_packet_history',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-dispute-packet-history-smoke' },
    }
  );
  const disputePacketHistorySource = adminEvidenceExportPreviewDisputePacketHistory.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewDisputePacketHistory.status === 200,
    `Expected dispute evidence review packet history admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewDisputePacketHistory.status}`
  );
  assert(
    adminEvidenceExportPreviewDisputePacketHistory.body?.selected_source_filter === 'dispute_evidence_review_packet_history' &&
      adminEvidenceExportPreviewDisputePacketHistory.body?.valid_source_filters?.includes('dispute_evidence_review_packet_history'),
    'Dispute evidence review packet history admin evidence export preview must accept the dispute packet history source filter'
  );
  assert(
    adminEvidenceExportPreviewDisputePacketHistory.body?.evidence_sources?.length === 1 &&
      disputePacketHistorySource?.id === 'dispute_evidence_review_packet_history',
    'Dispute evidence review packet history admin evidence export preview must return only the dispute packet history source'
  );
  assert(
    adminEvidenceExportPreviewDisputePacketHistory.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewDisputePacketHistory.body.review_router.targets[0]?.source_id === 'dispute_evidence_review_packet_history' &&
      adminEvidenceExportPreviewDisputePacketHistory.body.review_router.targets[0]?.ui_anchor === 'disputeEvidenceReviewPacketHistoryGrid',
    'Dispute evidence review packet history admin evidence export preview review router must point to disputeEvidenceReviewPacketHistoryGrid'
  );
  assert(
    disputePacketHistorySource?.allowed_fields?.includes('dispute_evidence_review_packet_metadata_history_only') &&
      disputePacketHistorySource?.allowed_fields?.includes('packet_section_count') &&
      disputePacketHistorySource?.allowed_fields?.includes('no_dispute_review_packet_content_stored') &&
      disputePacketHistorySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Dispute evidence review packet history admin evidence export preview must allow dispute packet metadata and source boundary fields only'
  );
  assert(
    disputePacketHistorySource?.blocked_fields?.includes('packet_sections') &&
      disputePacketHistorySource?.blocked_fields?.includes('copyable_markdown') &&
      disputePacketHistorySource?.blocked_fields?.includes('redaction_attestation') &&
      disputePacketHistorySource?.blocked_fields?.includes('raw_evidence') &&
      disputePacketHistorySource?.blocked_fields?.includes('liability_decision') &&
      disputePacketHistorySource?.blocked_fields?.includes('escrow_release') &&
      disputePacketHistorySource?.blocked_fields?.includes('auth_rls_change'),
    'Dispute evidence review packet history admin evidence export preview must block packet content, raw evidence, liability, escrow, payment, provider/legal/Auth/RLS, and live-action evidence'
  );
  assert(
    disputePacketHistorySource?.raw_content_storage_boundary === disputePacketExportBoundary,
    'Dispute evidence review packet history admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewDisputePacketHistory.body?.export_gate?.real_money_or_token_action === 'blocked' &&
      adminEvidenceExportPreviewDisputePacketHistory.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewDisputePacketHistory.body?.no_live_action_attempted === true,
    'Dispute evidence review packet history admin evidence export preview must remain no-storage, no-money, and no-live-action'
  );

  const milestonePacketExportBoundary =
    'No milestone evidence packet sections, markdown previews, redaction attestation values, raw evidence, secrets, payment data, wallet data, provider submissions, legal decisions, milestone approvals, escrow releases, payment movements, repayment routing approvals, stablecoin settlements, token collateral locks, Auth/RLS changes, or production approvals are stored in this milestone evidence review packet history.';
  const adminEvidenceExportPreviewMilestonePacketHistory = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=milestone_evidence_review_packet_history',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-milestone-packet-history-smoke' },
    }
  );
  const milestonePacketHistorySource = adminEvidenceExportPreviewMilestonePacketHistory.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewMilestonePacketHistory.status === 200,
    `Expected milestone evidence review packet history admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewMilestonePacketHistory.status}`
  );
  assert(
    adminEvidenceExportPreviewMilestonePacketHistory.body?.selected_source_filter === 'milestone_evidence_review_packet_history' &&
      adminEvidenceExportPreviewMilestonePacketHistory.body?.valid_source_filters?.includes('milestone_evidence_review_packet_history'),
    'Milestone evidence review packet history admin evidence export preview must accept the milestone packet history source filter'
  );
  assert(
    adminEvidenceExportPreviewMilestonePacketHistory.body?.evidence_sources?.length === 1 &&
      milestonePacketHistorySource?.id === 'milestone_evidence_review_packet_history',
    'Milestone evidence review packet history admin evidence export preview must return only the milestone packet history source'
  );
  assert(
    adminEvidenceExportPreviewMilestonePacketHistory.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewMilestonePacketHistory.body.review_router.targets[0]?.source_id === 'milestone_evidence_review_packet_history' &&
      adminEvidenceExportPreviewMilestonePacketHistory.body.review_router.targets[0]?.ui_anchor === 'milestoneEvidenceReviewPacketHistoryGrid',
    'Milestone evidence review packet history admin evidence export preview review router must point to milestoneEvidenceReviewPacketHistoryGrid'
  );
  assert(
    milestonePacketHistorySource?.allowed_fields?.includes('milestone_evidence_review_packet_metadata_history_only') &&
      milestonePacketHistorySource?.allowed_fields?.includes('packet_section_count') &&
      milestonePacketHistorySource?.allowed_fields?.includes('no_milestone_review_packet_content_stored') &&
      milestonePacketHistorySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Milestone evidence review packet history admin evidence export preview must allow milestone packet metadata and source boundary fields only'
  );
  assert(
    milestonePacketHistorySource?.blocked_fields?.includes('packet_sections') &&
      milestonePacketHistorySource?.blocked_fields?.includes('copyable_markdown') &&
      milestonePacketHistorySource?.blocked_fields?.includes('redaction_attestation') &&
      milestonePacketHistorySource?.blocked_fields?.includes('raw_evidence') &&
      milestonePacketHistorySource?.blocked_fields?.includes('milestone_acceptance') &&
      milestonePacketHistorySource?.blocked_fields?.includes('repayment_routing') &&
      milestonePacketHistorySource?.blocked_fields?.includes('token_collateral_lock') &&
      milestonePacketHistorySource?.blocked_fields?.includes('auth_rls_change'),
    'Milestone evidence review packet history admin evidence export preview must block packet content, raw evidence, milestone approval, repayment, token collateral, provider/legal/Auth/RLS, and live-action evidence'
  );
  assert(
    milestonePacketHistorySource?.raw_content_storage_boundary === milestonePacketExportBoundary,
    'Milestone evidence review packet history admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewMilestonePacketHistory.body?.export_gate?.real_money_or_token_action === 'blocked' &&
      adminEvidenceExportPreviewMilestonePacketHistory.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewMilestonePacketHistory.body?.no_live_action_attempted === true,
    'Milestone evidence review packet history admin evidence export preview must remain no-storage, no-money, and no-live-action'
  );

  const workingCapitalPacketExportBoundary =
    'No working-capital review packet sections, markdown previews, redaction attestation values, contractor identity data, project contract details, repayment waterfall details, funding approval evidence, secrets, payment data, wallet data, provider submissions, legal decisions, credit approvals, contractor funding actions, loan originations, payment movements, repayment routing approvals, escrow releases, stablecoin settlements, token collateral locks, Auth/RLS changes, or production approvals are stored in this working-capital review packet history.';
  const adminEvidenceExportPreviewWorkingCapitalPacketHistory = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=working_capital_review_packet_history',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-working-capital-packet-history-smoke' },
    }
  );
  const workingCapitalPacketHistorySource = adminEvidenceExportPreviewWorkingCapitalPacketHistory.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewWorkingCapitalPacketHistory.status === 200,
    `Expected working capital review packet history admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewWorkingCapitalPacketHistory.status}`
  );
  assert(
    adminEvidenceExportPreviewWorkingCapitalPacketHistory.body?.selected_source_filter === 'working_capital_review_packet_history' &&
      adminEvidenceExportPreviewWorkingCapitalPacketHistory.body?.valid_source_filters?.includes('working_capital_review_packet_history'),
    'Working capital review packet history admin evidence export preview must accept the working-capital packet history source filter'
  );
  assert(
    adminEvidenceExportPreviewWorkingCapitalPacketHistory.body?.evidence_sources?.length === 1 &&
      workingCapitalPacketHistorySource?.id === 'working_capital_review_packet_history',
    'Working capital review packet history admin evidence export preview must return only the working-capital packet history source'
  );
  assert(
    adminEvidenceExportPreviewWorkingCapitalPacketHistory.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewWorkingCapitalPacketHistory.body.review_router.targets[0]?.source_id === 'working_capital_review_packet_history' &&
      adminEvidenceExportPreviewWorkingCapitalPacketHistory.body.review_router.targets[0]?.ui_anchor === 'workingCapitalReviewPacketHistoryGrid',
    'Working capital review packet history admin evidence export preview review router must point to workingCapitalReviewPacketHistoryGrid'
  );
  assert(
    workingCapitalPacketHistorySource?.allowed_fields?.includes('working_capital_review_packet_metadata_history_only') &&
      workingCapitalPacketHistorySource?.allowed_fields?.includes('packet_section_count') &&
      workingCapitalPacketHistorySource?.allowed_fields?.includes('no_working_capital_review_packet_content_stored') &&
      workingCapitalPacketHistorySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Working capital review packet history admin evidence export preview must allow working-capital packet metadata and source boundary fields only'
  );
  assert(
    workingCapitalPacketHistorySource?.blocked_fields?.includes('packet_sections') &&
      workingCapitalPacketHistorySource?.blocked_fields?.includes('copyable_markdown') &&
      workingCapitalPacketHistorySource?.blocked_fields?.includes('redaction_attestation') &&
      workingCapitalPacketHistorySource?.blocked_fields?.includes('contractor_identity_data') &&
      workingCapitalPacketHistorySource?.blocked_fields?.includes('credit_approval') &&
      workingCapitalPacketHistorySource?.blocked_fields?.includes('contractor_funding') &&
      workingCapitalPacketHistorySource?.blocked_fields?.includes('repayment_routing') &&
      workingCapitalPacketHistorySource?.blocked_fields?.includes('token_collateral_lock') &&
      workingCapitalPacketHistorySource?.blocked_fields?.includes('auth_rls_change'),
    'Working capital review packet history admin evidence export preview must block packet content, identity, credit approval, funding, repayment, token collateral, provider/legal/Auth/RLS, and live-action evidence'
  );
  assert(
    workingCapitalPacketHistorySource?.raw_content_storage_boundary === workingCapitalPacketExportBoundary,
    'Working capital review packet history admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewWorkingCapitalPacketHistory.body?.export_gate?.real_money_or_token_action === 'blocked' &&
      adminEvidenceExportPreviewWorkingCapitalPacketHistory.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewWorkingCapitalPacketHistory.body?.no_live_action_attempted === true,
    'Working capital review packet history admin evidence export preview must remain no-storage, no-money, and no-live-action'
  );

  const contractorReputationPacketExportBoundary =
    'No contractor reputation packet sections, markdown previews, redaction attestation values, raw media, raw evidence, secrets, payment data, wallet data, provider submissions, legal decisions, public score approvals, contractor rankings, credit approvals, credit denials, adverse-action outputs, contractor assignments, Auth/RLS changes, or production approvals are stored in this contractor reputation review packet history.';
  const adminEvidenceExportPreviewContractorReputationPacketHistory = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=contractor_reputation_review_packet_history',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-contractor-reputation-packet-history-smoke' },
    }
  );
  const contractorReputationPacketHistorySource = adminEvidenceExportPreviewContractorReputationPacketHistory.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewContractorReputationPacketHistory.status === 200,
    `Expected contractor reputation review packet history admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewContractorReputationPacketHistory.status}`
  );
  assert(
    adminEvidenceExportPreviewContractorReputationPacketHistory.body?.selected_source_filter === 'contractor_reputation_review_packet_history' &&
      adminEvidenceExportPreviewContractorReputationPacketHistory.body?.valid_source_filters?.includes('contractor_reputation_review_packet_history'),
    'Contractor reputation review packet history admin evidence export preview must accept the contractor reputation packet history source filter'
  );
  assert(
    adminEvidenceExportPreviewContractorReputationPacketHistory.body?.evidence_sources?.length === 1 &&
      contractorReputationPacketHistorySource?.id === 'contractor_reputation_review_packet_history',
    'Contractor reputation review packet history admin evidence export preview must return only the contractor reputation packet history source'
  );
  assert(
    adminEvidenceExportPreviewContractorReputationPacketHistory.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewContractorReputationPacketHistory.body.review_router.targets[0]?.source_id === 'contractor_reputation_review_packet_history' &&
      adminEvidenceExportPreviewContractorReputationPacketHistory.body.review_router.targets[0]?.ui_anchor === 'contractorReputationReviewPacketHistoryGrid',
    'Contractor reputation review packet history admin evidence export preview review router must point to contractorReputationReviewPacketHistoryGrid'
  );
  assert(
    contractorReputationPacketHistorySource?.allowed_fields?.includes('contractor_reputation_review_packet_metadata_history_only') &&
      contractorReputationPacketHistorySource?.allowed_fields?.includes('packet_section_count') &&
      contractorReputationPacketHistorySource?.allowed_fields?.includes('no_contractor_reputation_review_packet_content_stored') &&
      contractorReputationPacketHistorySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Contractor reputation review packet history admin evidence export preview must allow contractor reputation packet metadata and source boundary fields only'
  );
  assert(
    contractorReputationPacketHistorySource?.blocked_fields?.includes('packet_sections') &&
      contractorReputationPacketHistorySource?.blocked_fields?.includes('copyable_markdown') &&
      contractorReputationPacketHistorySource?.blocked_fields?.includes('redaction_attestation') &&
      contractorReputationPacketHistorySource?.blocked_fields?.includes('raw_media') &&
      contractorReputationPacketHistorySource?.blocked_fields?.includes('public_score_approval') &&
      contractorReputationPacketHistorySource?.blocked_fields?.includes('contractor_ranking') &&
      contractorReputationPacketHistorySource?.blocked_fields?.includes('credit_approval') &&
      contractorReputationPacketHistorySource?.blocked_fields?.includes('credit_denial') &&
      contractorReputationPacketHistorySource?.blocked_fields?.includes('adverse_action_output') &&
      contractorReputationPacketHistorySource?.blocked_fields?.includes('contractor_assignment') &&
      contractorReputationPacketHistorySource?.blocked_fields?.includes('auth_rls_change'),
    'Contractor reputation review packet history admin evidence export preview must block packet content, raw media/evidence, public score, ranking, credit, adverse-action, assignment, provider/legal/Auth/RLS, and live-action evidence'
  );
  assert(
    contractorReputationPacketHistorySource?.raw_content_storage_boundary === contractorReputationPacketExportBoundary,
    'Contractor reputation review packet history admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewContractorReputationPacketHistory.body?.export_gate?.real_money_or_token_action === 'blocked' &&
      adminEvidenceExportPreviewContractorReputationPacketHistory.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewContractorReputationPacketHistory.body?.no_live_action_attempted === true,
    'Contractor reputation review packet history admin evidence export preview must remain no-storage, no-money, and no-live-action'
  );

  const contractorVerificationPacketExportBoundary =
    'No contractor verification packet sections, markdown previews, redaction attestation values, raw evidence, secrets, payment data, wallet data, provider submissions, legal decisions, eligibility approvals, eligibility denials, real lead routing, Auth/RLS changes, or production approvals are stored in this contractor verification review packet history.';
  const adminEvidenceExportPreviewContractorVerificationPacketHistory = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=contractor_verification_review_packet_history',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-contractor-verification-packet-history-smoke' },
    }
  );
  const contractorVerificationPacketHistorySource = adminEvidenceExportPreviewContractorVerificationPacketHistory.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewContractorVerificationPacketHistory.status === 200,
    `Expected contractor verification review packet history admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewContractorVerificationPacketHistory.status}`
  );
  assert(
    adminEvidenceExportPreviewContractorVerificationPacketHistory.body?.selected_source_filter === 'contractor_verification_review_packet_history' &&
      adminEvidenceExportPreviewContractorVerificationPacketHistory.body?.valid_source_filters?.includes('contractor_verification_review_packet_history'),
    'Contractor verification review packet history admin evidence export preview must accept the contractor verification packet history source filter'
  );
  assert(
    adminEvidenceExportPreviewContractorVerificationPacketHistory.body?.evidence_sources?.length === 1 &&
      contractorVerificationPacketHistorySource?.id === 'contractor_verification_review_packet_history',
    'Contractor verification review packet history admin evidence export preview must return only the contractor verification packet history source'
  );
  assert(
    adminEvidenceExportPreviewContractorVerificationPacketHistory.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewContractorVerificationPacketHistory.body.review_router.targets[0]?.source_id === 'contractor_verification_review_packet_history' &&
      adminEvidenceExportPreviewContractorVerificationPacketHistory.body.review_router.targets[0]?.ui_anchor === 'contractorVerificationReviewPacketHistoryGrid',
    'Contractor verification review packet history admin evidence export preview review router must point to contractorVerificationReviewPacketHistoryGrid'
  );
  assert(
    contractorVerificationPacketHistorySource?.allowed_fields?.includes('contractor_verification_review_packet_metadata_history_only') &&
      contractorVerificationPacketHistorySource?.allowed_fields?.includes('packet_section_count') &&
      contractorVerificationPacketHistorySource?.allowed_fields?.includes('no_contractor_verification_review_packet_content_stored') &&
      contractorVerificationPacketHistorySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Contractor verification review packet history admin evidence export preview must allow contractor verification packet metadata and source boundary fields only'
  );
  assert(
    contractorVerificationPacketHistorySource?.blocked_fields?.includes('packet_sections') &&
      contractorVerificationPacketHistorySource?.blocked_fields?.includes('copyable_markdown') &&
      contractorVerificationPacketHistorySource?.blocked_fields?.includes('redaction_attestation') &&
      contractorVerificationPacketHistorySource?.blocked_fields?.includes('raw_evidence') &&
      contractorVerificationPacketHistorySource?.blocked_fields?.includes('provider_submission') &&
      contractorVerificationPacketHistorySource?.blocked_fields?.includes('eligibility_approval') &&
      contractorVerificationPacketHistorySource?.blocked_fields?.includes('eligibility_denial') &&
      contractorVerificationPacketHistorySource?.blocked_fields?.includes('real_lead_routing') &&
      contractorVerificationPacketHistorySource?.blocked_fields?.includes('auth_rls_change'),
    'Contractor verification review packet history admin evidence export preview must block packet content, raw evidence, provider/legal, eligibility, real lead routing, Auth/RLS, and live-action evidence'
  );
  assert(
    contractorVerificationPacketHistorySource?.raw_content_storage_boundary === contractorVerificationPacketExportBoundary,
    'Contractor verification review packet history admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewContractorVerificationPacketHistory.body?.export_gate?.real_money_or_token_action === 'blocked' &&
      adminEvidenceExportPreviewContractorVerificationPacketHistory.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewContractorVerificationPacketHistory.body?.no_live_action_attempted === true,
    'Contractor verification review packet history admin evidence export preview must remain no-storage, no-money, and no-live-action'
  );

  const readinessOverviewPacketExportBoundary =
    'No readiness overview packet sections, markdown previews, redaction attestation values, raw evidence, secrets, payment data, wallet data, provider submissions, legal decisions, credit approvals, escrow releases, Auth/RLS changes, or production approvals are stored in this readiness overview review packet history.';
  const adminEvidenceExportPreviewReadinessOverviewPacketHistory = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=readiness_overview_review_packet_history',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-readiness-overview-packet-history-smoke' },
    }
  );
  const readinessOverviewPacketHistorySource = adminEvidenceExportPreviewReadinessOverviewPacketHistory.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewReadinessOverviewPacketHistory.status === 200,
    `Expected readiness overview review packet history admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewReadinessOverviewPacketHistory.status}`
  );
  assert(
    adminEvidenceExportPreviewReadinessOverviewPacketHistory.body?.selected_source_filter === 'readiness_overview_review_packet_history' &&
      adminEvidenceExportPreviewReadinessOverviewPacketHistory.body?.valid_source_filters?.includes('readiness_overview_review_packet_history'),
    'Readiness overview review packet history admin evidence export preview must accept the readiness overview packet history source filter'
  );
  assert(
    adminEvidenceExportPreviewReadinessOverviewPacketHistory.body?.evidence_sources?.length === 1 &&
      readinessOverviewPacketHistorySource?.id === 'readiness_overview_review_packet_history',
    'Readiness overview review packet history admin evidence export preview must return only the readiness overview packet history source'
  );
  assert(
    adminEvidenceExportPreviewReadinessOverviewPacketHistory.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewReadinessOverviewPacketHistory.body.review_router.targets[0]?.source_id === 'readiness_overview_review_packet_history' &&
      adminEvidenceExportPreviewReadinessOverviewPacketHistory.body.review_router.targets[0]?.ui_anchor === 'readinessOverviewReviewPacketHistoryGrid',
    'Readiness overview review packet history admin evidence export preview review router must point to readinessOverviewReviewPacketHistoryGrid'
  );
  assert(
    readinessOverviewPacketHistorySource?.allowed_fields?.includes('readiness_overview_review_packet_metadata_history_only') &&
      readinessOverviewPacketHistorySource?.allowed_fields?.includes('packet_section_count') &&
      readinessOverviewPacketHistorySource?.allowed_fields?.includes('no_admin_readiness_overview_review_packet_content_stored') &&
      readinessOverviewPacketHistorySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Readiness overview review packet history admin evidence export preview must allow readiness overview packet metadata and source boundary fields only'
  );
  assert(
    readinessOverviewPacketHistorySource?.blocked_fields?.includes('packet_sections') &&
      readinessOverviewPacketHistorySource?.blocked_fields?.includes('copyable_markdown') &&
      readinessOverviewPacketHistorySource?.blocked_fields?.includes('redaction_attestation') &&
      readinessOverviewPacketHistorySource?.blocked_fields?.includes('raw_evidence') &&
      readinessOverviewPacketHistorySource?.blocked_fields?.includes('provider_submission') &&
      readinessOverviewPacketHistorySource?.blocked_fields?.includes('credit_approval') &&
      readinessOverviewPacketHistorySource?.blocked_fields?.includes('escrow_release') &&
      readinessOverviewPacketHistorySource?.blocked_fields?.includes('auth_rls_change'),
    'Readiness overview review packet history admin evidence export preview must block packet content, raw evidence, provider/legal, credit, escrow, Auth/RLS, and live-action evidence'
  );
  assert(
    readinessOverviewPacketHistorySource?.raw_content_storage_boundary === readinessOverviewPacketExportBoundary,
    'Readiness overview review packet history admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewReadinessOverviewPacketHistory.body?.export_gate?.real_money_or_token_action === 'blocked' &&
      adminEvidenceExportPreviewReadinessOverviewPacketHistory.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewReadinessOverviewPacketHistory.body?.no_live_action_attempted === true,
    'Readiness overview review packet history admin evidence export preview must remain no-storage, no-money, and no-live-action'
  );

  const providerEvidencePacketExportBoundary =
    'No packet sections, markdown previews, redaction findings, raw evidence, secrets, payment data, wallet data, provider submissions, legal decisions, credit approvals, escrow releases, Auth/RLS changes, or production approvals are stored in this history.';
  const adminEvidenceExportPreviewProviderEvidencePacketHistory = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=provider_evidence_packet_history',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-provider-packet-history-smoke' },
    }
  );
  const providerEvidencePacketHistorySource = adminEvidenceExportPreviewProviderEvidencePacketHistory.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewProviderEvidencePacketHistory.status === 200,
    `Expected provider evidence packet history admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewProviderEvidencePacketHistory.status}`
  );
  assert(
    adminEvidenceExportPreviewProviderEvidencePacketHistory.body?.selected_source_filter === 'provider_evidence_packet_history' &&
      adminEvidenceExportPreviewProviderEvidencePacketHistory.body?.valid_source_filters?.includes('provider_evidence_packet_history'),
    'Provider evidence packet history admin evidence export preview must accept the provider packet history source filter'
  );
  assert(
    adminEvidenceExportPreviewProviderEvidencePacketHistory.body?.evidence_sources?.length === 1 &&
      providerEvidencePacketHistorySource?.id === 'provider_evidence_packet_history',
    'Provider evidence packet history admin evidence export preview must return only the provider packet history source'
  );
  assert(
    adminEvidenceExportPreviewProviderEvidencePacketHistory.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewProviderEvidencePacketHistory.body.review_router.targets[0]?.source_id === 'provider_evidence_packet_history' &&
      adminEvidenceExportPreviewProviderEvidencePacketHistory.body.review_router.targets[0]?.ui_anchor === 'providerEvidencePacketHistoryGrid',
    'Provider evidence packet history admin evidence export preview review router must point to providerEvidencePacketHistoryGrid'
  );
  assert(
    providerEvidencePacketHistorySource?.allowed_fields?.includes('provider_packet_metadata_history_only') &&
      providerEvidencePacketHistorySource?.allowed_fields?.includes('packet_section_count') &&
      providerEvidencePacketHistorySource?.allowed_fields?.includes('no_provider_evidence_packet_content_stored') &&
      providerEvidencePacketHistorySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Provider evidence packet history admin evidence export preview must allow provider packet metadata and source boundary fields only'
  );
  assert(
    providerEvidencePacketHistorySource?.blocked_fields?.includes('packet_sections') &&
      providerEvidencePacketHistorySource?.blocked_fields?.includes('copyable_markdown') &&
      providerEvidencePacketHistorySource?.blocked_fields?.includes('redaction_findings') &&
      providerEvidencePacketHistorySource?.blocked_fields?.includes('raw_evidence') &&
      providerEvidencePacketHistorySource?.blocked_fields?.includes('provider_submission') &&
      providerEvidencePacketHistorySource?.blocked_fields?.includes('credit_approval') &&
      providerEvidencePacketHistorySource?.blocked_fields?.includes('escrow_release') &&
      providerEvidencePacketHistorySource?.blocked_fields?.includes('auth_rls_change'),
    'Provider evidence packet history admin evidence export preview must block packet content, redaction findings, raw evidence, provider/legal, credit, escrow, Auth/RLS, and live-action evidence'
  );
  assert(
    providerEvidencePacketHistorySource?.raw_content_storage_boundary === providerEvidencePacketExportBoundary,
    'Provider evidence packet history admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewProviderEvidencePacketHistory.body?.export_gate?.real_money_or_token_action === 'blocked' &&
      adminEvidenceExportPreviewProviderEvidencePacketHistory.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewProviderEvidencePacketHistory.body?.no_live_action_attempted === true,
    'Provider evidence packet history admin evidence export preview must remain no-storage, no-money, and no-live-action'
  );

  const providerPrintTemplateExportBoundary =
    'No print template sections, markdown previews, redaction attestations, raw packet content, secrets, payment data, wallet data, provider submissions, legal decisions, credit approvals, escrow releases, Auth/RLS changes, or production approvals are stored in this print template history.';
  const adminEvidenceExportPreviewProviderPrintTemplateHistory = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=provider_evidence_packet_print_template_history',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-provider-print-template-history-smoke' },
    }
  );
  const providerPrintTemplateHistorySource = adminEvidenceExportPreviewProviderPrintTemplateHistory.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewProviderPrintTemplateHistory.status === 200,
    `Expected provider evidence packet print template history admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewProviderPrintTemplateHistory.status}`
  );
  assert(
    adminEvidenceExportPreviewProviderPrintTemplateHistory.body?.selected_source_filter === 'provider_evidence_packet_print_template_history' &&
      adminEvidenceExportPreviewProviderPrintTemplateHistory.body?.valid_source_filters?.includes('provider_evidence_packet_print_template_history'),
    'Provider evidence packet print template history admin evidence export preview must accept the provider print template history source filter'
  );
  assert(
    adminEvidenceExportPreviewProviderPrintTemplateHistory.body?.evidence_sources?.length === 1 &&
      providerPrintTemplateHistorySource?.id === 'provider_evidence_packet_print_template_history',
    'Provider evidence packet print template history admin evidence export preview must return only the provider print template history source'
  );
  assert(
    adminEvidenceExportPreviewProviderPrintTemplateHistory.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewProviderPrintTemplateHistory.body.review_router.targets[0]?.source_id === 'provider_evidence_packet_print_template_history' &&
      adminEvidenceExportPreviewProviderPrintTemplateHistory.body.review_router.targets[0]?.ui_anchor === 'providerEvidencePacketPrintTemplateHistoryGrid',
    'Provider evidence packet print template history admin evidence export preview review router must point to providerEvidencePacketPrintTemplateHistoryGrid'
  );
  assert(
    providerPrintTemplateHistorySource?.allowed_fields?.includes('provider_print_template_metadata_history_only') &&
      providerPrintTemplateHistorySource?.allowed_fields?.includes('print_template_section_count') &&
      providerPrintTemplateHistorySource?.allowed_fields?.includes('no_provider_print_template_content_stored') &&
      providerPrintTemplateHistorySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Provider evidence packet print template history admin evidence export preview must allow provider print template metadata and source boundary fields only'
  );
  assert(
    providerPrintTemplateHistorySource?.blocked_fields?.includes('print_template_sections') &&
      providerPrintTemplateHistorySource?.blocked_fields?.includes('copyable_markdown') &&
      providerPrintTemplateHistorySource?.blocked_fields?.includes('redaction_attestation') &&
      providerPrintTemplateHistorySource?.blocked_fields?.includes('raw_packet_content') &&
      providerPrintTemplateHistorySource?.blocked_fields?.includes('provider_submission') &&
      providerPrintTemplateHistorySource?.blocked_fields?.includes('credit_approval') &&
      providerPrintTemplateHistorySource?.blocked_fields?.includes('escrow_release') &&
      providerPrintTemplateHistorySource?.blocked_fields?.includes('auth_rls_change'),
    'Provider evidence packet print template history admin evidence export preview must block print template, markdown, redaction, raw packet, provider/legal, credit, escrow, Auth/RLS, and live-action evidence'
  );
  assert(
    providerPrintTemplateHistorySource?.raw_content_storage_boundary === providerPrintTemplateExportBoundary,
    'Provider evidence packet print template history admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewProviderPrintTemplateHistory.body?.export_gate?.real_money_or_token_action === 'blocked' &&
      adminEvidenceExportPreviewProviderPrintTemplateHistory.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewProviderPrintTemplateHistory.body?.no_live_action_attempted === true,
    'Provider evidence packet print template history admin evidence export preview must remain no-storage, no-money, and no-live-action'
  );

  const providerRedactionQaExportBoundary =
    'No redaction finding details, matched terms, forbidden phrase source text, markdown previews, print template sections, redaction attestations, raw packet content, secrets, payment data, wallet data, provider submissions, legal decisions, credit approvals, escrow releases, Auth/RLS changes, or production approvals are stored in this redaction QA history.';
  const adminEvidenceExportPreviewProviderRedactionQaHistory = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=provider_evidence_packet_redaction_qa_history',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-provider-redaction-qa-history-smoke' },
    }
  );
  const providerRedactionQaHistorySource = adminEvidenceExportPreviewProviderRedactionQaHistory.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewProviderRedactionQaHistory.status === 200,
    `Expected provider evidence packet redaction QA history admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewProviderRedactionQaHistory.status}`
  );
  assert(
    adminEvidenceExportPreviewProviderRedactionQaHistory.body?.selected_source_filter === 'provider_evidence_packet_redaction_qa_history' &&
      adminEvidenceExportPreviewProviderRedactionQaHistory.body?.valid_source_filters?.includes('provider_evidence_packet_redaction_qa_history'),
    'Provider evidence packet redaction QA history admin evidence export preview must accept the provider redaction QA history source filter'
  );
  assert(
    adminEvidenceExportPreviewProviderRedactionQaHistory.body?.evidence_sources?.length === 1 &&
      providerRedactionQaHistorySource?.id === 'provider_evidence_packet_redaction_qa_history',
    'Provider evidence packet redaction QA history admin evidence export preview must return only the provider redaction QA history source'
  );
  assert(
    adminEvidenceExportPreviewProviderRedactionQaHistory.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewProviderRedactionQaHistory.body.review_router.targets[0]?.source_id === 'provider_evidence_packet_redaction_qa_history' &&
      adminEvidenceExportPreviewProviderRedactionQaHistory.body.review_router.targets[0]?.ui_anchor === 'providerEvidencePacketRedactionQaHistoryGrid',
    'Provider evidence packet redaction QA history admin evidence export preview review router must point to providerEvidencePacketRedactionQaHistoryGrid'
  );
  assert(
    providerRedactionQaHistorySource?.allowed_fields?.includes('provider_redaction_qa_metadata_history_only') &&
      providerRedactionQaHistorySource?.allowed_fields?.includes('redaction_finding_count') &&
      providerRedactionQaHistorySource?.allowed_fields?.includes('no_provider_redaction_qa_content_stored') &&
      providerRedactionQaHistorySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Provider evidence packet redaction QA history admin evidence export preview must allow provider redaction QA metadata and source boundary fields only'
  );
  assert(
    providerRedactionQaHistorySource?.blocked_fields?.includes('redaction_findings') &&
      providerRedactionQaHistorySource?.blocked_fields?.includes('redaction_finding_details') &&
      providerRedactionQaHistorySource?.blocked_fields?.includes('matched_terms') &&
      providerRedactionQaHistorySource?.blocked_fields?.includes('forbidden_phrase_source_text') &&
      providerRedactionQaHistorySource?.blocked_fields?.includes('markdown_preview') &&
      providerRedactionQaHistorySource?.blocked_fields?.includes('print_template_sections') &&
      providerRedactionQaHistorySource?.blocked_fields?.includes('redaction_attestation') &&
      providerRedactionQaHistorySource?.blocked_fields?.includes('raw_packet_content') &&
      providerRedactionQaHistorySource?.blocked_fields?.includes('provider_submission') &&
      providerRedactionQaHistorySource?.blocked_fields?.includes('credit_approval') &&
      providerRedactionQaHistorySource?.blocked_fields?.includes('escrow_release') &&
      providerRedactionQaHistorySource?.blocked_fields?.includes('auth_rls_change'),
    'Provider evidence packet redaction QA history admin evidence export preview must block finding details, matched terms, raw packet, provider/legal, credit, escrow, Auth/RLS, and live-action evidence'
  );
  assert(
    providerRedactionQaHistorySource?.raw_content_storage_boundary === providerRedactionQaExportBoundary,
    'Provider evidence packet redaction QA history admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewProviderRedactionQaHistory.body?.export_gate?.real_money_or_token_action === 'blocked' &&
      adminEvidenceExportPreviewProviderRedactionQaHistory.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewProviderRedactionQaHistory.body?.no_live_action_attempted === true,
    'Provider evidence packet redaction QA history admin evidence export preview must remain no-storage, no-money, and no-live-action'
  );

  const providerReviewChainExportBoundary =
    'No provider review chain step details, packet sections, print template sections, redaction finding details, matched terms, markdown previews, redaction attestations, raw evidence, secrets, payment data, wallet data, provider submissions, legal decisions, credit approvals, escrow releases, Auth/RLS changes, production approvals, external sends, or live-action approvals are stored in this provider review chain history.';
  const adminEvidenceExportPreviewProviderReviewChainHistory = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=provider_evidence_review_chain_history',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-provider-review-chain-history-smoke' },
    }
  );
  const providerReviewChainHistorySource = adminEvidenceExportPreviewProviderReviewChainHistory.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewProviderReviewChainHistory.status === 200,
    `Expected provider evidence review chain history admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewProviderReviewChainHistory.status}`
  );
  assert(
    adminEvidenceExportPreviewProviderReviewChainHistory.body?.selected_source_filter === 'provider_evidence_review_chain_history' &&
      adminEvidenceExportPreviewProviderReviewChainHistory.body?.valid_source_filters?.includes('provider_evidence_review_chain_history'),
    'Provider evidence review chain history admin evidence export preview must accept the provider review chain history source filter'
  );
  assert(
    adminEvidenceExportPreviewProviderReviewChainHistory.body?.evidence_sources?.length === 1 &&
      providerReviewChainHistorySource?.id === 'provider_evidence_review_chain_history',
    'Provider evidence review chain history admin evidence export preview must return only the provider review chain history source'
  );
  assert(
    adminEvidenceExportPreviewProviderReviewChainHistory.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewProviderReviewChainHistory.body.review_router.targets[0]?.source_id === 'provider_evidence_review_chain_history' &&
      adminEvidenceExportPreviewProviderReviewChainHistory.body.review_router.targets[0]?.ui_anchor === 'providerEvidenceReviewChainHistoryGrid',
    'Provider evidence review chain history admin evidence export preview review router must point to providerEvidenceReviewChainHistoryGrid'
  );
  assert(
    providerReviewChainHistorySource?.allowed_fields?.includes('provider_review_chain_metadata_history_only') &&
      providerReviewChainHistorySource?.allowed_fields?.includes('chain_step_count') &&
      providerReviewChainHistorySource?.allowed_fields?.includes('no_provider_review_chain_content_stored') &&
      providerReviewChainHistorySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Provider evidence review chain history admin evidence export preview must allow provider review chain metadata and source boundary fields only'
  );
  assert(
    providerReviewChainHistorySource?.blocked_fields?.includes('review_chain_steps') &&
      providerReviewChainHistorySource?.blocked_fields?.includes('packet_sections') &&
      providerReviewChainHistorySource?.blocked_fields?.includes('print_template_sections') &&
      providerReviewChainHistorySource?.blocked_fields?.includes('redaction_findings') &&
      providerReviewChainHistorySource?.blocked_fields?.includes('raw_evidence') &&
      providerReviewChainHistorySource?.blocked_fields?.includes('provider_submission') &&
      providerReviewChainHistorySource?.blocked_fields?.includes('credit_approval') &&
      providerReviewChainHistorySource?.blocked_fields?.includes('escrow_release') &&
      providerReviewChainHistorySource?.blocked_fields?.includes('auth_rls_change'),
    'Provider evidence review chain history admin evidence export preview must block chain details, packet content, redaction details, raw evidence, provider/legal, credit, escrow, Auth/RLS, and live-action evidence'
  );
  assert(
    providerReviewChainHistorySource?.raw_content_storage_boundary === providerReviewChainExportBoundary,
    'Provider evidence review chain history admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewProviderReviewChainHistory.body?.export_gate?.real_money_or_token_action === 'blocked' &&
      adminEvidenceExportPreviewProviderReviewChainHistory.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewProviderReviewChainHistory.body?.no_live_action_attempted === true,
    'Provider evidence review chain history admin evidence export preview must remain no-storage, no-money, and no-live-action'
  );

  const smartContractLocalReplayDryRunExportBoundary =
    'No local replay dry-run step details, helper exports, demo fixtures, evidence packet sections, handoff summary sections, workbench card details, raw smart-contract helper payloads, secrets, signatures, payment data, loan approvals, escrow releases, repayment routing approvals, stablecoin settlements, token collateral locks, provider commitments, legal decisions, production approvals, external sends, or live-action approvals are stored in this smart contract local replay dry-run history.';
  const adminEvidenceExportPreviewSmartContractLocalReplayDryRunHistory = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=smart_contract_local_replay_dry_run_history',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-smart-contract-local-replay-dry-run-history-smoke' },
    }
  );
  const smartContractLocalReplayDryRunHistorySource = adminEvidenceExportPreviewSmartContractLocalReplayDryRunHistory.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewSmartContractLocalReplayDryRunHistory.status === 200,
    `Expected smart contract local replay dry-run history admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewSmartContractLocalReplayDryRunHistory.status}`
  );
  assert(
    adminEvidenceExportPreviewSmartContractLocalReplayDryRunHistory.body?.selected_source_filter === 'smart_contract_local_replay_dry_run_history' &&
      adminEvidenceExportPreviewSmartContractLocalReplayDryRunHistory.body?.valid_source_filters?.includes('smart_contract_local_replay_dry_run_history'),
    'Smart contract local replay dry-run history admin evidence export preview must accept the smart contract local replay dry-run history source filter'
  );
  assert(
    adminEvidenceExportPreviewSmartContractLocalReplayDryRunHistory.body?.evidence_sources?.length === 1 &&
      smartContractLocalReplayDryRunHistorySource?.id === 'smart_contract_local_replay_dry_run_history',
    'Smart contract local replay dry-run history admin evidence export preview must return only the smart contract local replay dry-run history source'
  );
  assert(
    adminEvidenceExportPreviewSmartContractLocalReplayDryRunHistory.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewSmartContractLocalReplayDryRunHistory.body.review_router.targets[0]?.source_id === 'smart_contract_local_replay_dry_run_history' &&
      adminEvidenceExportPreviewSmartContractLocalReplayDryRunHistory.body.review_router.targets[0]?.ui_anchor === 'smartContractLocalReplayDryRunHistoryGrid',
    'Smart contract local replay dry-run history admin evidence export preview review router must point to smartContractLocalReplayDryRunHistoryGrid'
  );
  assert(
    smartContractLocalReplayDryRunHistorySource?.allowed_fields?.includes('smart_contract_local_replay_dry_run_metadata_history_only') &&
      smartContractLocalReplayDryRunHistorySource?.allowed_fields?.includes('dry_run_step_count') &&
      smartContractLocalReplayDryRunHistorySource?.allowed_fields?.includes('no_smart_contract_local_replay_dry_run_content_stored') &&
      smartContractLocalReplayDryRunHistorySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Smart contract local replay dry-run history admin evidence export preview must allow dry-run metadata and source boundary fields only'
  );
  assert(
    smartContractLocalReplayDryRunHistorySource?.blocked_fields?.includes('dry_run_steps') &&
      smartContractLocalReplayDryRunHistorySource?.blocked_fields?.includes('helper_exports') &&
      smartContractLocalReplayDryRunHistorySource?.blocked_fields?.includes('demo_fixtures') &&
      smartContractLocalReplayDryRunHistorySource?.blocked_fields?.includes('evidence_packet_sections') &&
      smartContractLocalReplayDryRunHistorySource?.blocked_fields?.includes('handoff_summary_sections') &&
      smartContractLocalReplayDryRunHistorySource?.blocked_fields?.includes('workbench_card_details') &&
      smartContractLocalReplayDryRunHistorySource?.blocked_fields?.includes('raw_smart_contract_helper_payloads') &&
      smartContractLocalReplayDryRunHistorySource?.blocked_fields?.includes('xpr_signature_request') &&
      smartContractLocalReplayDryRunHistorySource?.blocked_fields?.includes('payment_movement') &&
      smartContractLocalReplayDryRunHistorySource?.blocked_fields?.includes('real_loan_approval') &&
      smartContractLocalReplayDryRunHistorySource?.blocked_fields?.includes('escrow_release') &&
      smartContractLocalReplayDryRunHistorySource?.blocked_fields?.includes('repayment_routing_approval') &&
      smartContractLocalReplayDryRunHistorySource?.blocked_fields?.includes('stablecoin_settlement') &&
      smartContractLocalReplayDryRunHistorySource?.blocked_fields?.includes('token_collateral_lock') &&
      smartContractLocalReplayDryRunHistorySource?.blocked_fields?.includes('provider_commitment') &&
      smartContractLocalReplayDryRunHistorySource?.blocked_fields?.includes('legal_decision') &&
      smartContractLocalReplayDryRunHistorySource?.blocked_fields?.includes('production_release'),
    'Smart contract local replay dry-run history admin evidence export preview must block dry-run, helper, fixture, packet, handoff, workbench, raw payload, signature, finance, provider/legal, and live-action evidence'
  );
  assert(
    smartContractLocalReplayDryRunHistorySource?.raw_content_storage_boundary === smartContractLocalReplayDryRunExportBoundary,
    'Smart contract local replay dry-run history admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewSmartContractLocalReplayDryRunHistory.body?.export_gate?.real_money_or_token_action === 'blocked' &&
      adminEvidenceExportPreviewSmartContractLocalReplayDryRunHistory.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewSmartContractLocalReplayDryRunHistory.body?.no_live_action_attempted === true,
    'Smart contract local replay dry-run history admin evidence export preview must remain no-storage, no-money, and no-live-action'
  );

  const smartContractLocalReplayDryRunEvidencePacketExportBoundary =
    'No dry-run packet sections, markdown previews, redaction attestation values, local replay dry-run step details, helper exports, demo fixtures, workbench card details, handoff summary sections, raw smart-contract helper payloads, secrets, signatures, payment data, loan approvals, escrow releases, repayment routing approvals, stablecoin settlements, token collateral locks, provider commitments, legal decisions, production approvals, external sends, or live-action approvals are stored in this smart contract local replay dry-run evidence packet history.';
  const adminEvidenceExportPreviewSmartContractLocalReplayDryRunEvidencePacketHistory = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=smart_contract_local_replay_dry_run_evidence_packet_history',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-smart-contract-local-replay-dry-run-evidence-packet-history-smoke' },
    }
  );
  const smartContractLocalReplayDryRunEvidencePacketHistorySource =
    adminEvidenceExportPreviewSmartContractLocalReplayDryRunEvidencePacketHistory.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewSmartContractLocalReplayDryRunEvidencePacketHistory.status === 200,
    `Expected smart contract local replay dry-run evidence packet history admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewSmartContractLocalReplayDryRunEvidencePacketHistory.status}`
  );
  assert(
    adminEvidenceExportPreviewSmartContractLocalReplayDryRunEvidencePacketHistory.body?.selected_source_filter === 'smart_contract_local_replay_dry_run_evidence_packet_history' &&
      adminEvidenceExportPreviewSmartContractLocalReplayDryRunEvidencePacketHistory.body?.valid_source_filters?.includes('smart_contract_local_replay_dry_run_evidence_packet_history'),
    'Smart contract local replay dry-run evidence packet history admin evidence export preview must accept the evidence packet history source filter'
  );
  assert(
    adminEvidenceExportPreviewSmartContractLocalReplayDryRunEvidencePacketHistory.body?.evidence_sources?.length === 1 &&
      smartContractLocalReplayDryRunEvidencePacketHistorySource?.id === 'smart_contract_local_replay_dry_run_evidence_packet_history',
    'Smart contract local replay dry-run evidence packet history admin evidence export preview must return only the evidence packet history source'
  );
  assert(
    adminEvidenceExportPreviewSmartContractLocalReplayDryRunEvidencePacketHistory.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewSmartContractLocalReplayDryRunEvidencePacketHistory.body.review_router.targets[0]?.source_id === 'smart_contract_local_replay_dry_run_evidence_packet_history' &&
      adminEvidenceExportPreviewSmartContractLocalReplayDryRunEvidencePacketHistory.body.review_router.targets[0]?.ui_anchor === 'smartContractLocalReplayDryRunEvidencePacketHistoryGrid',
    'Smart contract local replay dry-run evidence packet history admin evidence export preview review router must point to smartContractLocalReplayDryRunEvidencePacketHistoryGrid'
  );
  assert(
    smartContractLocalReplayDryRunEvidencePacketHistorySource?.allowed_fields?.includes('smart_contract_local_replay_dry_run_evidence_packet_metadata_history_only') &&
      smartContractLocalReplayDryRunEvidencePacketHistorySource?.allowed_fields?.includes('packet_section_count') &&
      smartContractLocalReplayDryRunEvidencePacketHistorySource?.allowed_fields?.includes('no_dry_run_packet_content_stored') &&
      smartContractLocalReplayDryRunEvidencePacketHistorySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Smart contract local replay dry-run evidence packet history admin evidence export preview must allow packet metadata and source boundary fields only'
  );
  assert(
    smartContractLocalReplayDryRunEvidencePacketHistorySource?.blocked_fields?.includes('packet_sections') &&
      smartContractLocalReplayDryRunEvidencePacketHistorySource?.blocked_fields?.includes('copyable_markdown') &&
      smartContractLocalReplayDryRunEvidencePacketHistorySource?.blocked_fields?.includes('markdown_preview') &&
      smartContractLocalReplayDryRunEvidencePacketHistorySource?.blocked_fields?.includes('redaction_attestation') &&
      smartContractLocalReplayDryRunEvidencePacketHistorySource?.blocked_fields?.includes('redaction_attestation_values') &&
      smartContractLocalReplayDryRunEvidencePacketHistorySource?.blocked_fields?.includes('dry_run_steps') &&
      smartContractLocalReplayDryRunEvidencePacketHistorySource?.blocked_fields?.includes('helper_exports') &&
      smartContractLocalReplayDryRunEvidencePacketHistorySource?.blocked_fields?.includes('demo_fixtures') &&
      smartContractLocalReplayDryRunEvidencePacketHistorySource?.blocked_fields?.includes('workbench_card_details') &&
      smartContractLocalReplayDryRunEvidencePacketHistorySource?.blocked_fields?.includes('handoff_summary_sections') &&
      smartContractLocalReplayDryRunEvidencePacketHistorySource?.blocked_fields?.includes('raw_smart_contract_helper_payloads') &&
      smartContractLocalReplayDryRunEvidencePacketHistorySource?.blocked_fields?.includes('xpr_signature_request') &&
      smartContractLocalReplayDryRunEvidencePacketHistorySource?.blocked_fields?.includes('payment_movement') &&
      smartContractLocalReplayDryRunEvidencePacketHistorySource?.blocked_fields?.includes('real_loan_approval') &&
      smartContractLocalReplayDryRunEvidencePacketHistorySource?.blocked_fields?.includes('escrow_release') &&
      smartContractLocalReplayDryRunEvidencePacketHistorySource?.blocked_fields?.includes('repayment_routing_approval') &&
      smartContractLocalReplayDryRunEvidencePacketHistorySource?.blocked_fields?.includes('stablecoin_settlement') &&
      smartContractLocalReplayDryRunEvidencePacketHistorySource?.blocked_fields?.includes('token_collateral_lock') &&
      smartContractLocalReplayDryRunEvidencePacketHistorySource?.blocked_fields?.includes('provider_commitment') &&
      smartContractLocalReplayDryRunEvidencePacketHistorySource?.blocked_fields?.includes('legal_decision') &&
      smartContractLocalReplayDryRunEvidencePacketHistorySource?.blocked_fields?.includes('production_release') &&
      smartContractLocalReplayDryRunEvidencePacketHistorySource?.blocked_fields?.includes('external_send'),
    'Smart contract local replay dry-run evidence packet history admin evidence export preview must block packet, markdown, redaction, dry-run, helper, fixture, workbench, handoff, raw payload, signature, finance, provider/legal, external-send, and live-action evidence'
  );
  assert(
    smartContractLocalReplayDryRunEvidencePacketHistorySource?.raw_content_storage_boundary === smartContractLocalReplayDryRunEvidencePacketExportBoundary,
    'Smart contract local replay dry-run evidence packet history admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewSmartContractLocalReplayDryRunEvidencePacketHistory.body?.export_gate?.real_money_or_token_action === 'blocked' &&
      adminEvidenceExportPreviewSmartContractLocalReplayDryRunEvidencePacketHistory.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewSmartContractLocalReplayDryRunEvidencePacketHistory.body?.no_live_action_attempted === true,
    'Smart contract local replay dry-run evidence packet history admin evidence export preview must remain no-storage, no-money, and no-live-action'
  );

  const smartContractReviewWorkbenchExportBoundary =
    'No workbench card details, helper exports, demo fixtures, dry-run step details, evidence packet sections, handoff summary sections, raw smart-contract helper payloads, secrets, signatures, payment data, loan approvals, escrow releases, repayment routing approvals, stablecoin settlements, token collateral locks, provider commitments, legal decisions, production approvals, external sends, or live-action approvals are stored in this smart contract review workbench history.';
  const adminEvidenceExportPreviewSmartContractReviewWorkbenchHistory = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=smart_contract_review_workbench_history',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-smart-contract-review-workbench-history-smoke' },
    }
  );
  const smartContractReviewWorkbenchHistorySource = adminEvidenceExportPreviewSmartContractReviewWorkbenchHistory.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewSmartContractReviewWorkbenchHistory.status === 200,
    `Expected smart contract review workbench history admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewSmartContractReviewWorkbenchHistory.status}`
  );
  assert(
    adminEvidenceExportPreviewSmartContractReviewWorkbenchHistory.body?.selected_source_filter === 'smart_contract_review_workbench_history' &&
      adminEvidenceExportPreviewSmartContractReviewWorkbenchHistory.body?.valid_source_filters?.includes('smart_contract_review_workbench_history'),
    'Smart contract review workbench history admin evidence export preview must accept the smart contract review workbench history source filter'
  );
  assert(
    adminEvidenceExportPreviewSmartContractReviewWorkbenchHistory.body?.evidence_sources?.length === 1 &&
      smartContractReviewWorkbenchHistorySource?.id === 'smart_contract_review_workbench_history',
    'Smart contract review workbench history admin evidence export preview must return only the smart contract review workbench history source'
  );
  assert(
    adminEvidenceExportPreviewSmartContractReviewWorkbenchHistory.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewSmartContractReviewWorkbenchHistory.body.review_router.targets[0]?.source_id === 'smart_contract_review_workbench_history' &&
      adminEvidenceExportPreviewSmartContractReviewWorkbenchHistory.body.review_router.targets[0]?.ui_anchor === 'smartContractReviewWorkbenchHistoryGrid',
    'Smart contract review workbench history admin evidence export preview review router must point to smartContractReviewWorkbenchHistoryGrid'
  );
  assert(
    smartContractReviewWorkbenchHistorySource?.allowed_fields?.includes('smart_contract_review_workbench_metadata_history_only') &&
      smartContractReviewWorkbenchHistorySource?.allowed_fields?.includes('workbench_card_count') &&
      smartContractReviewWorkbenchHistorySource?.allowed_fields?.includes('no_smart_contract_review_workbench_content_stored') &&
      smartContractReviewWorkbenchHistorySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Smart contract review workbench history admin evidence export preview must allow workbench metadata and source boundary fields only'
  );
  assert(
    smartContractReviewWorkbenchHistorySource?.blocked_fields?.includes('workbench_cards') &&
      smartContractReviewWorkbenchHistorySource?.blocked_fields?.includes('workbench_card_details') &&
      smartContractReviewWorkbenchHistorySource?.blocked_fields?.includes('helper_exports') &&
      smartContractReviewWorkbenchHistorySource?.blocked_fields?.includes('demo_fixtures') &&
      smartContractReviewWorkbenchHistorySource?.blocked_fields?.includes('dry_run_steps') &&
      smartContractReviewWorkbenchHistorySource?.blocked_fields?.includes('evidence_packet_sections') &&
      smartContractReviewWorkbenchHistorySource?.blocked_fields?.includes('packet_sections') &&
      smartContractReviewWorkbenchHistorySource?.blocked_fields?.includes('handoff_summary_sections') &&
      smartContractReviewWorkbenchHistorySource?.blocked_fields?.includes('raw_smart_contract_helper_payloads') &&
      smartContractReviewWorkbenchHistorySource?.blocked_fields?.includes('xpr_signature_request') &&
      smartContractReviewWorkbenchHistorySource?.blocked_fields?.includes('payment_movement') &&
      smartContractReviewWorkbenchHistorySource?.blocked_fields?.includes('real_loan_approval') &&
      smartContractReviewWorkbenchHistorySource?.blocked_fields?.includes('escrow_release') &&
      smartContractReviewWorkbenchHistorySource?.blocked_fields?.includes('repayment_routing_approval') &&
      smartContractReviewWorkbenchHistorySource?.blocked_fields?.includes('stablecoin_settlement') &&
      smartContractReviewWorkbenchHistorySource?.blocked_fields?.includes('token_collateral_lock') &&
      smartContractReviewWorkbenchHistorySource?.blocked_fields?.includes('provider_commitment') &&
      smartContractReviewWorkbenchHistorySource?.blocked_fields?.includes('legal_decision') &&
      smartContractReviewWorkbenchHistorySource?.blocked_fields?.includes('production_release') &&
      smartContractReviewWorkbenchHistorySource?.blocked_fields?.includes('external_send'),
    'Smart contract review workbench history admin evidence export preview must block workbench, helper, fixture, dry-run, packet, handoff, raw payload, signature, finance, provider/legal, external-send, and live-action evidence'
  );
  assert(
    smartContractReviewWorkbenchHistorySource?.raw_content_storage_boundary === smartContractReviewWorkbenchExportBoundary,
    'Smart contract review workbench history admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewSmartContractReviewWorkbenchHistory.body?.export_gate?.real_money_or_token_action === 'blocked' &&
      adminEvidenceExportPreviewSmartContractReviewWorkbenchHistory.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewSmartContractReviewWorkbenchHistory.body?.no_live_action_attempted === true,
    'Smart contract review workbench history admin evidence export preview must remain no-storage, no-money, and no-live-action'
  );

  const smartContractReviewWorkbenchHandoffSummaryExportBoundary =
    'No handoff summary section details, markdown previews, redaction attestation values, workbench card details, helper exports, demo fixtures, dry-run step details, evidence packet sections, raw smart-contract helper payloads, secrets, signatures, payment data, loan approvals, escrow releases, repayment routing approvals, stablecoin settlements, token collateral locks, provider commitments, legal decisions, production approvals, external sends, or live-action approvals are stored in this smart contract review workbench handoff summary history.';
  const adminEvidenceExportPreviewSmartContractReviewWorkbenchHandoffSummaryHistory = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=smart_contract_review_workbench_handoff_summary_history',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-smart-contract-review-workbench-handoff-summary-history-smoke' },
    }
  );
  const smartContractReviewWorkbenchHandoffSummaryHistorySource =
    adminEvidenceExportPreviewSmartContractReviewWorkbenchHandoffSummaryHistory.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewSmartContractReviewWorkbenchHandoffSummaryHistory.status === 200,
    `Expected smart contract review workbench handoff summary history admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewSmartContractReviewWorkbenchHandoffSummaryHistory.status}`
  );
  assert(
    adminEvidenceExportPreviewSmartContractReviewWorkbenchHandoffSummaryHistory.body?.selected_source_filter ===
      'smart_contract_review_workbench_handoff_summary_history' &&
      adminEvidenceExportPreviewSmartContractReviewWorkbenchHandoffSummaryHistory.body?.valid_source_filters?.includes(
        'smart_contract_review_workbench_handoff_summary_history'
      ),
    'Smart contract review workbench handoff summary history admin evidence export preview must accept the handoff summary history source filter'
  );
  assert(
    adminEvidenceExportPreviewSmartContractReviewWorkbenchHandoffSummaryHistory.body?.evidence_sources?.length === 1 &&
      smartContractReviewWorkbenchHandoffSummaryHistorySource?.id === 'smart_contract_review_workbench_handoff_summary_history',
    'Smart contract review workbench handoff summary history admin evidence export preview must return only the handoff summary history source'
  );
  assert(
    adminEvidenceExportPreviewSmartContractReviewWorkbenchHandoffSummaryHistory.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewSmartContractReviewWorkbenchHandoffSummaryHistory.body.review_router.targets[0]?.source_id ===
        'smart_contract_review_workbench_handoff_summary_history' &&
      adminEvidenceExportPreviewSmartContractReviewWorkbenchHandoffSummaryHistory.body.review_router.targets[0]?.ui_anchor ===
        'smartContractReviewWorkbenchHandoffSummaryHistoryGrid',
    'Smart contract review workbench handoff summary history admin evidence export preview review router must point to smartContractReviewWorkbenchHandoffSummaryHistoryGrid'
  );
  assert(
    smartContractReviewWorkbenchHandoffSummaryHistorySource?.allowed_fields?.includes(
      'smart_contract_review_workbench_handoff_summary_metadata_history_only'
    ) &&
      smartContractReviewWorkbenchHandoffSummaryHistorySource?.allowed_fields?.includes('handoff_section_count') &&
      smartContractReviewWorkbenchHandoffSummaryHistorySource?.allowed_fields?.includes(
        'no_smart_contract_review_workbench_handoff_summary_content_stored'
      ) &&
      smartContractReviewWorkbenchHandoffSummaryHistorySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Smart contract review workbench handoff summary history admin evidence export preview must allow handoff summary metadata and source boundary fields only'
  );
  assert(
    smartContractReviewWorkbenchHandoffSummaryHistorySource?.blocked_fields?.includes('handoff_summary_sections') &&
      smartContractReviewWorkbenchHandoffSummaryHistorySource?.blocked_fields?.includes('handoff_summary_section_details') &&
      smartContractReviewWorkbenchHandoffSummaryHistorySource?.blocked_fields?.includes('copyable_markdown') &&
      smartContractReviewWorkbenchHandoffSummaryHistorySource?.blocked_fields?.includes('markdown_preview') &&
      smartContractReviewWorkbenchHandoffSummaryHistorySource?.blocked_fields?.includes('redaction_attestation') &&
      smartContractReviewWorkbenchHandoffSummaryHistorySource?.blocked_fields?.includes('redaction_attestation_values') &&
      smartContractReviewWorkbenchHandoffSummaryHistorySource?.blocked_fields?.includes('workbench_cards') &&
      smartContractReviewWorkbenchHandoffSummaryHistorySource?.blocked_fields?.includes('workbench_card_details') &&
      smartContractReviewWorkbenchHandoffSummaryHistorySource?.blocked_fields?.includes('helper_exports') &&
      smartContractReviewWorkbenchHandoffSummaryHistorySource?.blocked_fields?.includes('demo_fixtures') &&
      smartContractReviewWorkbenchHandoffSummaryHistorySource?.blocked_fields?.includes('dry_run_steps') &&
      smartContractReviewWorkbenchHandoffSummaryHistorySource?.blocked_fields?.includes('evidence_packet_sections') &&
      smartContractReviewWorkbenchHandoffSummaryHistorySource?.blocked_fields?.includes('packet_sections') &&
      smartContractReviewWorkbenchHandoffSummaryHistorySource?.blocked_fields?.includes('raw_smart_contract_helper_payloads') &&
      smartContractReviewWorkbenchHandoffSummaryHistorySource?.blocked_fields?.includes('xpr_signature_request') &&
      smartContractReviewWorkbenchHandoffSummaryHistorySource?.blocked_fields?.includes('payment_movement') &&
      smartContractReviewWorkbenchHandoffSummaryHistorySource?.blocked_fields?.includes('real_loan_approval') &&
      smartContractReviewWorkbenchHandoffSummaryHistorySource?.blocked_fields?.includes('escrow_release') &&
      smartContractReviewWorkbenchHandoffSummaryHistorySource?.blocked_fields?.includes('repayment_routing_approval') &&
      smartContractReviewWorkbenchHandoffSummaryHistorySource?.blocked_fields?.includes('stablecoin_settlement') &&
      smartContractReviewWorkbenchHandoffSummaryHistorySource?.blocked_fields?.includes('token_collateral_lock') &&
      smartContractReviewWorkbenchHandoffSummaryHistorySource?.blocked_fields?.includes('provider_commitment') &&
      smartContractReviewWorkbenchHandoffSummaryHistorySource?.blocked_fields?.includes('legal_decision') &&
      smartContractReviewWorkbenchHandoffSummaryHistorySource?.blocked_fields?.includes('production_release') &&
      smartContractReviewWorkbenchHandoffSummaryHistorySource?.blocked_fields?.includes('external_send'),
    'Smart contract review workbench handoff summary history admin evidence export preview must block handoff, markdown, redaction, workbench, helper, fixture, dry-run, packet, raw payload, signature, finance, provider/legal, external-send, and live-action evidence'
  );
  assert(
    smartContractReviewWorkbenchHandoffSummaryHistorySource?.raw_content_storage_boundary ===
      smartContractReviewWorkbenchHandoffSummaryExportBoundary,
    'Smart contract review workbench handoff summary history admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewSmartContractReviewWorkbenchHandoffSummaryHistory.body?.export_gate?.real_money_or_token_action === 'blocked' &&
      adminEvidenceExportPreviewSmartContractReviewWorkbenchHandoffSummaryHistory.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewSmartContractReviewWorkbenchHandoffSummaryHistory.body?.no_live_action_attempted === true,
    'Smart contract review workbench handoff summary history admin evidence export preview must remain no-storage, no-money, and no-live-action'
  );

  const smartContractReviewGateMatrixExportBoundary =
    'No gate matrix row details, review gate row details, recommended review order details, helper exports, demo fixtures, dry-run steps, evidence packet sections, handoff summary sections, raw smart-contract helper payloads, secrets, signatures, payment data, loan approvals, escrow releases, repayment routing approvals, stablecoin settlements, token collateral locks, provider commitments, legal decisions, production approvals, external sends, or live-action approvals are stored in this smart contract review gate matrix history.';
  const adminEvidenceExportPreviewSmartContractReviewGateMatrixHistory = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=smart_contract_review_workbench_gate_matrix_history',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-smart-contract-review-gate-matrix-history-smoke' },
    }
  );
  const smartContractReviewGateMatrixHistorySource = adminEvidenceExportPreviewSmartContractReviewGateMatrixHistory.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewSmartContractReviewGateMatrixHistory.status === 200,
    `Expected smart contract review gate matrix history admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewSmartContractReviewGateMatrixHistory.status}`
  );
  assert(
    adminEvidenceExportPreviewSmartContractReviewGateMatrixHistory.body?.selected_source_filter ===
      'smart_contract_review_workbench_gate_matrix_history' &&
      adminEvidenceExportPreviewSmartContractReviewGateMatrixHistory.body?.valid_source_filters?.includes(
        'smart_contract_review_workbench_gate_matrix_history'
      ),
    'Smart contract review gate matrix history admin evidence export preview must accept the gate matrix history source filter'
  );
  assert(
    adminEvidenceExportPreviewSmartContractReviewGateMatrixHistory.body?.evidence_sources?.length === 1 &&
      smartContractReviewGateMatrixHistorySource?.id === 'smart_contract_review_workbench_gate_matrix_history',
    'Smart contract review gate matrix history admin evidence export preview must return only the gate matrix history source'
  );
  assert(
    adminEvidenceExportPreviewSmartContractReviewGateMatrixHistory.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewSmartContractReviewGateMatrixHistory.body.review_router.targets[0]?.source_id ===
        'smart_contract_review_workbench_gate_matrix_history' &&
      adminEvidenceExportPreviewSmartContractReviewGateMatrixHistory.body.review_router.targets[0]?.ui_anchor ===
        'smartContractReviewWorkbenchGateMatrixHistoryGrid',
    'Smart contract review gate matrix history admin evidence export preview review router must point to smartContractReviewWorkbenchGateMatrixHistoryGrid'
  );
  assert(
    smartContractReviewGateMatrixHistorySource?.allowed_fields?.includes('smart_contract_review_gate_matrix_metadata_history_only') &&
      smartContractReviewGateMatrixHistorySource?.allowed_fields?.includes('gate_matrix_row_count') &&
      smartContractReviewGateMatrixHistorySource?.allowed_fields?.includes('no_smart_contract_review_gate_matrix_content_stored') &&
      smartContractReviewGateMatrixHistorySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Smart contract review gate matrix history admin evidence export preview must allow gate matrix metadata and source boundary fields only'
  );
  assert(
    smartContractReviewGateMatrixHistorySource?.blocked_fields?.includes('gate_matrix_rows') &&
      smartContractReviewGateMatrixHistorySource?.blocked_fields?.includes('gate_matrix_row_details') &&
      smartContractReviewGateMatrixHistorySource?.blocked_fields?.includes('review_gate_rows') &&
      smartContractReviewGateMatrixHistorySource?.blocked_fields?.includes('review_gate_row_details') &&
      smartContractReviewGateMatrixHistorySource?.blocked_fields?.includes('recommended_review_order') &&
      smartContractReviewGateMatrixHistorySource?.blocked_fields?.includes('recommended_review_order_details') &&
      smartContractReviewGateMatrixHistorySource?.blocked_fields?.includes('helper_exports') &&
      smartContractReviewGateMatrixHistorySource?.blocked_fields?.includes('demo_fixtures') &&
      smartContractReviewGateMatrixHistorySource?.blocked_fields?.includes('dry_run_steps') &&
      smartContractReviewGateMatrixHistorySource?.blocked_fields?.includes('evidence_packet_sections') &&
      smartContractReviewGateMatrixHistorySource?.blocked_fields?.includes('handoff_summary_sections') &&
      smartContractReviewGateMatrixHistorySource?.blocked_fields?.includes('raw_smart_contract_helper_payloads') &&
      smartContractReviewGateMatrixHistorySource?.blocked_fields?.includes('xpr_signature_request') &&
      smartContractReviewGateMatrixHistorySource?.blocked_fields?.includes('payment_movement') &&
      smartContractReviewGateMatrixHistorySource?.blocked_fields?.includes('real_loan_approval') &&
      smartContractReviewGateMatrixHistorySource?.blocked_fields?.includes('escrow_release') &&
      smartContractReviewGateMatrixHistorySource?.blocked_fields?.includes('repayment_routing_approval') &&
      smartContractReviewGateMatrixHistorySource?.blocked_fields?.includes('stablecoin_settlement') &&
      smartContractReviewGateMatrixHistorySource?.blocked_fields?.includes('token_collateral_lock') &&
      smartContractReviewGateMatrixHistorySource?.blocked_fields?.includes('provider_commitment') &&
      smartContractReviewGateMatrixHistorySource?.blocked_fields?.includes('legal_decision') &&
      smartContractReviewGateMatrixHistorySource?.blocked_fields?.includes('production_release') &&
      smartContractReviewGateMatrixHistorySource?.blocked_fields?.includes('external_send'),
    'Smart contract review gate matrix history admin evidence export preview must block gate matrix rows, review rows, recommended order, helper, fixture, dry-run, packet, handoff, raw payload, signature, finance, provider/legal, external-send, and live-action evidence'
  );
  assert(
    smartContractReviewGateMatrixHistorySource?.raw_content_storage_boundary === smartContractReviewGateMatrixExportBoundary,
    'Smart contract review gate matrix history admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewSmartContractReviewGateMatrixHistory.body?.export_gate?.real_money_or_token_action === 'blocked' &&
      adminEvidenceExportPreviewSmartContractReviewGateMatrixHistory.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewSmartContractReviewGateMatrixHistory.body?.no_live_action_attempted === true,
    'Smart contract review gate matrix history admin evidence export preview must remain no-storage, no-money, and no-live-action'
  );

  const adminEvidenceExportPreviewInvalidFilter = await request(baseUrl, '/api/admin/admin-evidence-export-preview?source_filter=live_external_export', {
    headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-invalid-filter-smoke' },
  });
  assert(
    adminEvidenceExportPreviewInvalidFilter.status === 400,
    `Expected invalid admin-evidence-export-preview filter 400, got ${adminEvidenceExportPreviewInvalidFilter.status}`
  );
  assert(
    adminEvidenceExportPreviewInvalidFilter.body?.status === 'invalid_source_filter',
    'Invalid admin evidence export preview source filter must return invalid_source_filter status'
  );
  assert(
    adminEvidenceExportPreviewInvalidFilter.body?.rejected_source_filter === 'live_external_export',
    'Invalid admin evidence export preview source filter must echo rejected_source_filter'
  );
  assert(
    adminEvidenceExportPreviewInvalidFilter.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewInvalidFilter.body?.no_live_action_attempted === true,
    'Invalid admin evidence export preview source filter must block external send and live actions'
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
  assert(
    helperIndex.body?.local_replay_readiness_summary?.mode === 'local_replay_readiness_summary',
    'Smart contract helper index must expose local_replay_readiness_summary mode'
  );
  assert(
    helperIndex.body?.local_replay_readiness_summary?.ready_for_local_replay_review === 4,
    'Smart contract helper index must mark all four helper categories ready for local replay review'
  );
  assert(
    helperIndex.body?.local_replay_readiness_summary?.blocked_for_live_replay === true &&
      helperIndex.body?.local_replay_readiness_summary?.no_live_replay_action_attempted === true,
    'Smart contract helper index local replay readiness summary must keep live replay blocked'
  );
  assert(
    helperIndex.body?.local_replay_readiness_summary?.review_routes?.some((route) => route.category_id === 'local_replay_approval_helpers'),
    'Smart contract helper index local replay readiness summary must include local replay approval route'
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

  const localReplayDryRun = await request(baseUrl, '/api/admin/smart-contract-local-replay-dry-run?category_filter=local_replay_approval_helpers', {
    headers: { 'X-Request-Id': 'gcsc-smart-contract-local-replay-dry-run-smoke' },
  });
  assert(localReplayDryRun.status === 200, `Expected smart-contract-local-replay-dry-run 200, got ${localReplayDryRun.status}`);
  assert(
    localReplayDryRun.headers.get('x-request-id') === 'gcsc-smart-contract-local-replay-dry-run-smoke',
    'Smart contract local replay dry-run endpoint must echo a safe X-Request-Id header'
  );
  assert(
    localReplayDryRun.body?.request_id === 'gcsc-smart-contract-local-replay-dry-run-smoke',
    'Smart contract local replay dry-run endpoint must include request_id in the response body'
  );
  assert(
    localReplayDryRun.body?.mode === 'smart_contract_local_replay_dry_run',
    'Smart contract local replay dry-run endpoint must return smart_contract_local_replay_dry_run mode'
  );
  assert(
    localReplayDryRun.body?.selected_helper_category_filter?.id === 'local_replay_approval_helpers',
    'Smart contract local replay dry-run endpoint must echo the selected local replay helper filter'
  );
  assert(
    Array.isArray(localReplayDryRun.body?.dry_run_steps) && localReplayDryRun.body.dry_run_steps.length > 0,
    'Smart contract local replay dry-run endpoint must return dry_run_steps'
  );
  assert(
    localReplayDryRun.body?.dry_run_gate?.live_replay_execution === 'blocked' &&
      localReplayDryRun.body?.dry_run_gate?.xpr_contract_deployment === 'blocked' &&
      localReplayDryRun.body?.dry_run_gate?.stablecoin_settlement === 'blocked' &&
      localReplayDryRun.body?.dry_run_gate?.token_collateral_lock === 'blocked',
    'Smart contract local replay dry-run endpoint must keep dry_run_gate live replay, XPR deploy, stablecoin, and token collateral actions blocked'
  );
  assert(
    localReplayDryRun.body?.no_server_storage_attempted === true &&
      localReplayDryRun.body?.no_live_replay_action_attempted === true &&
      localReplayDryRun.body?.no_live_action_attempted === true,
    'Smart contract local replay dry-run endpoint must confirm no server storage, live replay, or live action was attempted'
  );

  const localReplayDryRunInvalid = await request(baseUrl, '/api/admin/smart-contract-local-replay-dry-run?category_filter=approve_real_replay', {
    headers: { 'X-Request-Id': 'gcsc-smart-contract-local-replay-dry-run-invalid-smoke' },
  });
  assert(
    localReplayDryRunInvalid.status === 400,
    `Expected invalid smart-contract-local-replay-dry-run filter 400, got ${localReplayDryRunInvalid.status}`
  );
  assert(
    localReplayDryRunInvalid.headers.get('x-request-id') === 'gcsc-smart-contract-local-replay-dry-run-invalid-smoke',
    'Invalid smart contract local replay dry-run filter response must echo a safe X-Request-Id header'
  );
  assert(
    localReplayDryRunInvalid.body?.request_id === 'gcsc-smart-contract-local-replay-dry-run-invalid-smoke',
    'Invalid smart contract local replay dry-run filter response must include request_id in the response body'
  );
  assert(
    localReplayDryRunInvalid.body?.status === 'smart_contract_local_replay_dry_run_filter_invalid',
    'Invalid smart contract local replay dry-run filter must return smart_contract_local_replay_dry_run_filter_invalid status'
  );
  assert(
    localReplayDryRunInvalid.body?.error === 'Unsupported smart contract local replay dry run category_filter',
    'Invalid smart contract local replay dry-run filter must return a clear unsupported-filter error'
  );
  assert(
    Array.isArray(localReplayDryRunInvalid.body?.valid_helper_category_filter_ids) &&
      localReplayDryRunInvalid.body.valid_helper_category_filter_ids.includes('local_replay_approval_helpers'),
    'Invalid smart contract local replay dry-run filter must return valid local-only helper filter IDs'
  );
  assert(
    Array.isArray(localReplayDryRunInvalid.body?.smart_contract_local_replay_dry_run_filter_recovery_actions) &&
      localReplayDryRunInvalid.body.smart_contract_local_replay_dry_run_filter_recovery_actions.some((action) =>
        String(action.label || '').includes('Apply safe replay dry-run filter')
      ),
    'Invalid smart contract local replay dry-run filter must return safe recovery actions'
  );
  assert(
    localReplayDryRunInvalid.body?.dry_run_gate?.live_replay_execution === 'blocked' &&
      localReplayDryRunInvalid.body?.no_server_storage_attempted === true &&
      localReplayDryRunInvalid.body?.no_live_replay_action_attempted === true &&
      localReplayDryRunInvalid.body?.no_live_action_attempted === true,
    'Invalid smart contract local replay dry-run filter must keep dry_run_gate blocked and confirm no live action was attempted'
  );

  const localReplayDryRunEvidencePacket = await request(baseUrl, '/api/admin/smart-contract-local-replay-dry-run/evidence-packet?category_filter=local_replay_approval_helpers', {
    headers: { 'X-Request-Id': 'gcsc-smart-contract-local-replay-dry-run-evidence-packet-smoke' },
  });
  assert(
    localReplayDryRunEvidencePacket.status === 200,
    `Expected smart-contract-local-replay-dry-run evidence packet 200, got ${localReplayDryRunEvidencePacket.status}`
  );
  assert(
    localReplayDryRunEvidencePacket.headers.get('x-request-id') === 'gcsc-smart-contract-local-replay-dry-run-evidence-packet-smoke',
    'Smart contract local replay dry-run evidence packet endpoint must echo a safe X-Request-Id header'
  );
  assert(
    localReplayDryRunEvidencePacket.body?.request_id === 'gcsc-smart-contract-local-replay-dry-run-evidence-packet-smoke',
    'Smart contract local replay dry-run evidence packet endpoint must include request_id in the response body'
  );
  assert(
    localReplayDryRunEvidencePacket.body?.mode === 'smart_contract_local_replay_dry_run_evidence_packet',
    'Smart contract local replay dry-run evidence packet endpoint must return smart_contract_local_replay_dry_run_evidence_packet mode'
  );
  assert(
    localReplayDryRunEvidencePacket.body?.selected_helper_category_filter?.id === 'local_replay_approval_helpers',
    'Smart contract local replay dry-run evidence packet endpoint must echo the selected local replay helper filter'
  );
  assert(
    Array.isArray(localReplayDryRunEvidencePacket.body?.packet_sections) &&
      localReplayDryRunEvidencePacket.body.packet_sections.some((section) => section.id === 'dry_run_step_results') &&
      localReplayDryRunEvidencePacket.body.packet_sections.some((section) => section.id === 'dry_run_gate'),
    'Smart contract local replay dry-run evidence packet endpoint must return packet_sections with dry-run steps and gate sections'
  );
  assert(
    localReplayDryRunEvidencePacket.body?.packet_gate?.live_replay_execution === 'blocked' &&
      localReplayDryRunEvidencePacket.body?.packet_gate?.external_send === 'blocked' &&
      localReplayDryRunEvidencePacket.body?.packet_gate?.xpr_signature_request === 'blocked' &&
      localReplayDryRunEvidencePacket.body?.packet_gate?.token_collateral_lock === 'blocked',
    'Smart contract local replay dry-run evidence packet endpoint must keep packet_gate live replay, external send, signature, and token collateral actions blocked'
  );
  assert(
    typeof localReplayDryRunEvidencePacket.body?.copyable_markdown === 'string' &&
      localReplayDryRunEvidencePacket.body.copyable_markdown.includes('Smart Contract Local Replay Dry Run Evidence Packet') &&
      localReplayDryRunEvidencePacket.body.copyable_markdown.includes('No live smart contract replay action attempted'),
    'Smart contract local replay dry-run evidence packet endpoint must return safe copyable_markdown'
  );
  assert(
    localReplayDryRunEvidencePacket.body?.redaction_attestation?.secrets_included === false &&
      localReplayDryRunEvidencePacket.body?.no_server_storage_attempted === true &&
      localReplayDryRunEvidencePacket.body?.no_dry_run_packet_content_stored === true &&
      localReplayDryRunEvidencePacket.body?.no_live_replay_action_attempted === true &&
      localReplayDryRunEvidencePacket.body?.no_live_action_attempted === true,
    'Smart contract local replay dry-run evidence packet endpoint must confirm redaction, no server storage, no packet storage, no live replay, and no live action'
  );

  const localReplayDryRunEvidencePacketInvalid = await request(baseUrl, '/api/admin/smart-contract-local-replay-dry-run/evidence-packet?category_filter=approve_real_replay', {
    headers: { 'X-Request-Id': 'gcsc-smart-contract-local-replay-dry-run-evidence-packet-invalid-smoke' },
  });
  assert(
    localReplayDryRunEvidencePacketInvalid.status === 400,
    `Expected invalid smart-contract-local-replay-dry-run evidence packet filter 400, got ${localReplayDryRunEvidencePacketInvalid.status}`
  );
  assert(
    localReplayDryRunEvidencePacketInvalid.headers.get('x-request-id') === 'gcsc-smart-contract-local-replay-dry-run-evidence-packet-invalid-smoke',
    'Invalid smart contract local replay dry-run evidence packet filter response must echo a safe X-Request-Id header'
  );
  assert(
    localReplayDryRunEvidencePacketInvalid.body?.request_id === 'gcsc-smart-contract-local-replay-dry-run-evidence-packet-invalid-smoke',
    'Invalid smart contract local replay dry-run evidence packet filter response must include request_id in the response body'
  );
  assert(
    localReplayDryRunEvidencePacketInvalid.body?.status === 'smart_contract_local_replay_dry_run_evidence_packet_filter_invalid',
    'Invalid smart contract local replay dry-run evidence packet filter must return smart_contract_local_replay_dry_run_evidence_packet_filter_invalid status'
  );
  assert(
    localReplayDryRunEvidencePacketInvalid.body?.error === 'Unsupported smart contract local replay dry run evidence packet category_filter',
    'Invalid smart contract local replay dry-run evidence packet filter must return a clear unsupported-filter error'
  );
  assert(
    Array.isArray(localReplayDryRunEvidencePacketInvalid.body?.smart_contract_local_replay_dry_run_evidence_packet_filter_recovery_actions) &&
      localReplayDryRunEvidencePacketInvalid.body.smart_contract_local_replay_dry_run_evidence_packet_filter_recovery_actions.some((action) =>
        String(action.label || '').includes('Apply safe dry-run packet filter')
      ),
    'Invalid smart contract local replay dry-run evidence packet filter must return safe recovery actions'
  );
  assert(
    localReplayDryRunEvidencePacketInvalid.body?.packet_gate?.live_replay_execution === 'blocked' &&
      localReplayDryRunEvidencePacketInvalid.body?.no_server_storage_attempted === true &&
      localReplayDryRunEvidencePacketInvalid.body?.no_dry_run_packet_content_stored === true &&
      localReplayDryRunEvidencePacketInvalid.body?.no_live_replay_action_attempted === true &&
      localReplayDryRunEvidencePacketInvalid.body?.no_live_action_attempted === true,
    'Invalid smart contract local replay dry-run evidence packet filter must keep packet_gate blocked and confirm no live action was attempted'
  );

  const smartContractReviewWorkbench = await request(baseUrl, '/api/admin/smart-contract-review-workbench?category_filter=local_replay_approval_helpers', {
    headers: { 'X-Request-Id': 'gcsc-smart-contract-review-workbench-smoke' },
  });
  assert(
    smartContractReviewWorkbench.status === 200,
    `Expected smart-contract-review-workbench 200, got ${smartContractReviewWorkbench.status}`
  );
  assert(
    smartContractReviewWorkbench.headers.get('x-request-id') === 'gcsc-smart-contract-review-workbench-smoke',
    'Smart contract review workbench endpoint must echo a safe X-Request-Id header'
  );
  assert(
    smartContractReviewWorkbench.body?.request_id === 'gcsc-smart-contract-review-workbench-smoke',
    'Smart contract review workbench endpoint must include request_id in the response body'
  );
  assert(
    smartContractReviewWorkbench.body?.mode === 'smart_contract_review_workbench',
    'Smart contract review workbench endpoint must return smart_contract_review_workbench mode'
  );
  assert(
    smartContractReviewWorkbench.body?.selected_helper_category_filter?.id === 'local_replay_approval_helpers',
    'Smart contract review workbench endpoint must echo the selected local replay helper filter'
  );
  assert(
    Array.isArray(smartContractReviewWorkbench.body?.workbench_cards) &&
      smartContractReviewWorkbench.body.workbench_cards.some((card) => card.id === 'helper_index') &&
      smartContractReviewWorkbench.body.workbench_cards.some((card) => card.id === 'dry_run_evidence_packet'),
    'Smart contract review workbench endpoint must return helper index and dry-run packet workbench cards'
  );
  assert(
    smartContractReviewWorkbench.body?.review_gate?.live_replay_execution === 'blocked' &&
      smartContractReviewWorkbench.body?.review_gate?.xpr_contract_deployment === 'blocked' &&
      smartContractReviewWorkbench.body?.review_gate?.payment_movement === 'blocked' &&
      smartContractReviewWorkbench.body?.review_gate?.token_collateral_lock === 'blocked',
    'Smart contract review workbench endpoint must keep review_gate live replay, XPR deploy, payment, and token collateral actions blocked'
  );
  assert(
    smartContractReviewWorkbench.body?.no_server_storage_attempted === true &&
      smartContractReviewWorkbench.body?.no_live_replay_action_attempted === true &&
      smartContractReviewWorkbench.body?.no_live_action_attempted === true,
    'Smart contract review workbench endpoint must confirm no server storage, live replay, or live action was attempted'
  );

  const smartContractReviewWorkbenchInvalid = await request(baseUrl, '/api/admin/smart-contract-review-workbench?category_filter=approve_real_replay', {
    headers: { 'X-Request-Id': 'gcsc-smart-contract-review-workbench-invalid-smoke' },
  });
  assert(
    smartContractReviewWorkbenchInvalid.status === 400,
    `Expected invalid smart-contract-review-workbench filter 400, got ${smartContractReviewWorkbenchInvalid.status}`
  );
  assert(
    smartContractReviewWorkbenchInvalid.headers.get('x-request-id') === 'gcsc-smart-contract-review-workbench-invalid-smoke',
    'Invalid smart contract review workbench filter response must echo a safe X-Request-Id header'
  );
  assert(
    smartContractReviewWorkbenchInvalid.body?.request_id === 'gcsc-smart-contract-review-workbench-invalid-smoke',
    'Invalid smart contract review workbench filter response must include request_id in the response body'
  );
  assert(
    smartContractReviewWorkbenchInvalid.body?.status === 'smart_contract_review_workbench_filter_invalid',
    'Invalid smart contract review workbench filter must return smart_contract_review_workbench_filter_invalid status'
  );
  assert(
    smartContractReviewWorkbenchInvalid.body?.error === 'Unsupported smart contract review workbench category_filter',
    'Invalid smart contract review workbench filter must return a clear unsupported-filter error'
  );
  assert(
    Array.isArray(smartContractReviewWorkbenchInvalid.body?.smart_contract_review_workbench_filter_recovery_actions) &&
      smartContractReviewWorkbenchInvalid.body.smart_contract_review_workbench_filter_recovery_actions.some((action) =>
        String(action.label || '').includes('Apply safe workbench filter')
      ),
    'Invalid smart contract review workbench filter must return safe recovery actions'
  );
  assert(
    smartContractReviewWorkbenchInvalid.body?.review_gate?.live_replay_execution === 'blocked' &&
      smartContractReviewWorkbenchInvalid.body?.no_server_storage_attempted === true &&
      smartContractReviewWorkbenchInvalid.body?.no_live_replay_action_attempted === true &&
      smartContractReviewWorkbenchInvalid.body?.no_live_action_attempted === true,
    'Invalid smart contract review workbench filter must keep review_gate blocked and confirm no live action was attempted'
  );

  const smartContractReviewWorkbenchHandoffSummary = await request(baseUrl, '/api/admin/smart-contract-review-workbench/handoff-summary?category_filter=local_replay_approval_helpers', {
    headers: { 'X-Request-Id': 'gcsc-smart-contract-review-workbench-handoff-summary-smoke' },
  });
  assert(
    smartContractReviewWorkbenchHandoffSummary.status === 200,
    `Expected smart-contract-review-workbench handoff summary 200, got ${smartContractReviewWorkbenchHandoffSummary.status}`
  );
  assert(
    smartContractReviewWorkbenchHandoffSummary.headers.get('x-request-id') === 'gcsc-smart-contract-review-workbench-handoff-summary-smoke',
    'Smart contract review workbench handoff summary endpoint must echo a safe X-Request-Id header'
  );
  assert(
    smartContractReviewWorkbenchHandoffSummary.body?.request_id === 'gcsc-smart-contract-review-workbench-handoff-summary-smoke',
    'Smart contract review workbench handoff summary endpoint must include request_id in the response body'
  );
  assert(
    smartContractReviewWorkbenchHandoffSummary.body?.mode === 'smart_contract_review_workbench_handoff_summary',
    'Smart contract review workbench handoff summary endpoint must return smart_contract_review_workbench_handoff_summary mode'
  );
  assert(
    smartContractReviewWorkbenchHandoffSummary.body?.selected_helper_category_filter?.id === 'local_replay_approval_helpers',
    'Smart contract review workbench handoff summary endpoint must echo the selected local replay helper filter'
  );
  assert(
    Array.isArray(smartContractReviewWorkbenchHandoffSummary.body?.handoff_summary_sections) &&
      smartContractReviewWorkbenchHandoffSummary.body.handoff_summary_sections.some((section) => section.id === 'review_gate') &&
      smartContractReviewWorkbenchHandoffSummary.body.handoff_summary_sections.some((section) => section.id === 'blocked_live_actions'),
    'Smart contract review workbench handoff summary endpoint must return review gate and blocked live action sections'
  );
  assert(
    smartContractReviewWorkbenchHandoffSummary.body?.handoff_gate?.live_replay_execution === 'blocked' &&
      smartContractReviewWorkbenchHandoffSummary.body?.handoff_gate?.external_send === 'blocked' &&
      smartContractReviewWorkbenchHandoffSummary.body?.handoff_gate?.payment_movement === 'blocked' &&
      smartContractReviewWorkbenchHandoffSummary.body?.handoff_gate?.token_collateral_lock === 'blocked',
    'Smart contract review workbench handoff summary endpoint must keep handoff_gate live replay, external send, payment, and token collateral actions blocked'
  );
  assert(
    typeof smartContractReviewWorkbenchHandoffSummary.body?.copyable_markdown === 'string' &&
      smartContractReviewWorkbenchHandoffSummary.body.copyable_markdown.includes('Smart Contract Review Workbench Handoff Summary') &&
      smartContractReviewWorkbenchHandoffSummary.body.copyable_markdown.includes('No live smart contract replay action attempted'),
    'Smart contract review workbench handoff summary endpoint must return safe copyable_markdown'
  );
  assert(
    smartContractReviewWorkbenchHandoffSummary.body?.redaction_attestation?.secrets_included === false &&
      smartContractReviewWorkbenchHandoffSummary.body?.no_server_storage_attempted === true &&
      smartContractReviewWorkbenchHandoffSummary.body?.no_handoff_summary_content_stored === true &&
      smartContractReviewWorkbenchHandoffSummary.body?.no_live_replay_action_attempted === true &&
      smartContractReviewWorkbenchHandoffSummary.body?.no_live_action_attempted === true,
    'Smart contract review workbench handoff summary endpoint must confirm redaction, no server storage, no handoff storage, no live replay, and no live action'
  );

  const smartContractReviewWorkbenchHandoffSummaryInvalid = await request(baseUrl, '/api/admin/smart-contract-review-workbench/handoff-summary?category_filter=approve_real_replay', {
    headers: { 'X-Request-Id': 'gcsc-smart-contract-review-workbench-handoff-summary-invalid-smoke' },
  });
  assert(
    smartContractReviewWorkbenchHandoffSummaryInvalid.status === 400,
    `Expected invalid smart-contract-review-workbench handoff summary filter 400, got ${smartContractReviewWorkbenchHandoffSummaryInvalid.status}`
  );
  assert(
    smartContractReviewWorkbenchHandoffSummaryInvalid.headers.get('x-request-id') === 'gcsc-smart-contract-review-workbench-handoff-summary-invalid-smoke',
    'Invalid smart contract review workbench handoff summary filter response must echo a safe X-Request-Id header'
  );
  assert(
    smartContractReviewWorkbenchHandoffSummaryInvalid.body?.request_id === 'gcsc-smart-contract-review-workbench-handoff-summary-invalid-smoke',
    'Invalid smart contract review workbench handoff summary filter response must include request_id in the response body'
  );
  assert(
    smartContractReviewWorkbenchHandoffSummaryInvalid.body?.status === 'smart_contract_review_workbench_handoff_summary_filter_invalid',
    'Invalid smart contract review workbench handoff summary filter must return smart_contract_review_workbench_handoff_summary_filter_invalid status'
  );
  assert(
    smartContractReviewWorkbenchHandoffSummaryInvalid.body?.error === 'Unsupported smart contract review workbench handoff summary category_filter',
    'Invalid smart contract review workbench handoff summary filter must return a clear unsupported-filter error'
  );
  assert(
    Array.isArray(smartContractReviewWorkbenchHandoffSummaryInvalid.body?.smart_contract_review_workbench_handoff_summary_filter_recovery_actions) &&
      smartContractReviewWorkbenchHandoffSummaryInvalid.body.smart_contract_review_workbench_handoff_summary_filter_recovery_actions.some((action) =>
        String(action.label || '').includes('Apply safe workbench handoff filter')
      ),
    'Invalid smart contract review workbench handoff summary filter must return safe recovery actions'
  );
  assert(
    smartContractReviewWorkbenchHandoffSummaryInvalid.body?.handoff_gate?.live_replay_execution === 'blocked' &&
      smartContractReviewWorkbenchHandoffSummaryInvalid.body?.no_server_storage_attempted === true &&
      smartContractReviewWorkbenchHandoffSummaryInvalid.body?.no_handoff_summary_content_stored === true &&
      smartContractReviewWorkbenchHandoffSummaryInvalid.body?.no_live_replay_action_attempted === true &&
      smartContractReviewWorkbenchHandoffSummaryInvalid.body?.no_live_action_attempted === true,
    'Invalid smart contract review workbench handoff summary filter must keep handoff_gate blocked and confirm no live action was attempted'
  );

  const smartContractReviewWorkbenchGateMatrix = await request(baseUrl, '/api/admin/smart-contract-review-workbench/gate-matrix', {
    headers: { 'X-Request-Id': 'gcsc-smart-contract-review-workbench-gate-matrix-smoke' },
  });
  assert(
    smartContractReviewWorkbenchGateMatrix.status === 200,
    `Expected smart-contract-review-workbench gate matrix 200, got ${smartContractReviewWorkbenchGateMatrix.status}`
  );
  assert(
    smartContractReviewWorkbenchGateMatrix.headers.get('x-request-id') === 'gcsc-smart-contract-review-workbench-gate-matrix-smoke',
    'Smart contract review workbench gate matrix endpoint must echo a safe X-Request-Id header'
  );
  assert(
    smartContractReviewWorkbenchGateMatrix.body?.request_id === 'gcsc-smart-contract-review-workbench-gate-matrix-smoke',
    'Smart contract review workbench gate matrix endpoint must include request_id in the response body'
  );
  assert(
    smartContractReviewWorkbenchGateMatrix.body?.mode === 'smart_contract_review_workbench_gate_matrix',
    'Smart contract review workbench gate matrix endpoint must return smart_contract_review_workbench_gate_matrix mode'
  );
  assert(
    Array.isArray(smartContractReviewWorkbenchGateMatrix.body?.gate_matrix_rows) &&
      smartContractReviewWorkbenchGateMatrix.body.gate_matrix_rows.length >= 4 &&
      smartContractReviewWorkbenchGateMatrix.body.gate_matrix_rows.every((row) => row.review_gate?.live_replay_execution === 'blocked'),
    'Smart contract review workbench gate matrix endpoint must return rows with blocked live replay gates'
  );
  assert(
    smartContractReviewWorkbenchGateMatrix.body?.gate_matrix_summary?.review_required_row_count >= 0 &&
      smartContractReviewWorkbenchGateMatrix.body?.gate_matrix_summary?.blocked_live_action_count > 0 &&
      Array.isArray(smartContractReviewWorkbenchGateMatrix.body?.recommended_review_order) &&
      smartContractReviewWorkbenchGateMatrix.body.recommended_review_order.length >= 4,
    'Smart contract review workbench gate matrix endpoint must return summary counts and recommended review order'
  );
  const smartContractReviewWorkbenchGateMatrixRouteSet = assertGateMatrixRecommendedRouteSet(
    smartContractReviewWorkbenchGateMatrix.body
  );
  const smartContractReviewWorkbenchGateMatrixRouteSetSummary = assertGateMatrixRouteSetSummary(
    smartContractReviewWorkbenchGateMatrix.body
  );
  assert(
    smartContractReviewWorkbenchGateMatrix.body?.gate_matrix_gate?.server_storage === 'blocked' &&
      smartContractReviewWorkbenchGateMatrix.body?.gate_matrix_gate?.external_send === 'blocked' &&
      smartContractReviewWorkbenchGateMatrix.body?.gate_matrix_gate?.live_replay_execution === 'blocked' &&
      smartContractReviewWorkbenchGateMatrix.body?.gate_matrix_gate?.payment_movement === 'blocked' &&
      smartContractReviewWorkbenchGateMatrix.body?.gate_matrix_gate?.token_collateral_lock === 'blocked',
    'Smart contract review workbench gate matrix endpoint must keep server storage, external send, live replay, payment, and token collateral blocked'
  );
  assert(
    smartContractReviewWorkbenchGateMatrix.body?.no_server_storage_attempted === true &&
      smartContractReviewWorkbenchGateMatrix.body?.no_gate_matrix_content_stored === true &&
      smartContractReviewWorkbenchGateMatrix.body?.no_live_replay_action_attempted === true &&
      smartContractReviewWorkbenchGateMatrix.body?.no_live_action_attempted === true,
    'Smart contract review workbench gate matrix endpoint must confirm no server storage, no matrix storage, no live replay, and no live action'
  );

  const smartContractReviewWorkbenchGateMatrixFiltered = await request(baseUrl, '/api/admin/smart-contract-review-workbench/gate-matrix?category_filter=local_replay_approval_helpers', {
    headers: { 'X-Request-Id': 'gcsc-smart-contract-review-workbench-gate-matrix-filtered-smoke' },
  });
  assert(
    smartContractReviewWorkbenchGateMatrixFiltered.status === 200,
    `Expected filtered smart-contract-review-workbench gate matrix 200, got ${smartContractReviewWorkbenchGateMatrixFiltered.status}`
  );
  assert(
    smartContractReviewWorkbenchGateMatrixFiltered.headers.get('x-request-id') === 'gcsc-smart-contract-review-workbench-gate-matrix-filtered-smoke',
    'Filtered smart contract review workbench gate matrix endpoint must echo a safe X-Request-Id header'
  );
  assert(
    smartContractReviewWorkbenchGateMatrixFiltered.body?.request_id === 'gcsc-smart-contract-review-workbench-gate-matrix-filtered-smoke',
    'Filtered smart contract review workbench gate matrix endpoint must include request_id in the response body'
  );
  assert(
    smartContractReviewWorkbenchGateMatrixFiltered.body?.selected_helper_category_filter?.id === 'local_replay_approval_helpers',
    'Filtered smart contract review workbench gate matrix endpoint must echo the selected local replay helper filter'
  );
  const smartContractReviewWorkbenchGateMatrixFilteredRouteSet = assertGateMatrixRecommendedRouteSet(
    smartContractReviewWorkbenchGateMatrixFiltered.body,
    'local_replay_approval_helpers'
  );
  const smartContractReviewWorkbenchGateMatrixFilteredRouteSetSummary = assertGateMatrixRouteSetSummary(
    smartContractReviewWorkbenchGateMatrixFiltered.body,
    1
  );
  assert(
    Array.isArray(smartContractReviewWorkbenchGateMatrixFiltered.body?.gate_matrix_rows) &&
      smartContractReviewWorkbenchGateMatrixFiltered.body.gate_matrix_rows.length === 1 &&
      smartContractReviewWorkbenchGateMatrixFiltered.body.gate_matrix_rows[0]?.filter_id === 'local_replay_approval_helpers',
    'Filtered smart contract review workbench gate matrix endpoint must return only the selected filter row'
  );
  assert(
    smartContractReviewWorkbenchGateMatrixFiltered.body?.gate_matrix_gate?.live_replay_execution === 'blocked' &&
      smartContractReviewWorkbenchGateMatrixFiltered.body?.no_server_storage_attempted === true &&
      smartContractReviewWorkbenchGateMatrixFiltered.body?.no_gate_matrix_content_stored === true &&
      smartContractReviewWorkbenchGateMatrixFiltered.body?.no_live_replay_action_attempted === true &&
      smartContractReviewWorkbenchGateMatrixFiltered.body?.no_live_action_attempted === true,
    'Filtered smart contract review workbench gate matrix endpoint must keep gate blocked and confirm no live action was attempted'
  );

  const smartContractReviewWorkbenchGateMatrixInvalid = await request(baseUrl, '/api/admin/smart-contract-review-workbench/gate-matrix?category_filter=approve_real_replay', {
    headers: { 'X-Request-Id': 'gcsc-smart-contract-review-workbench-gate-matrix-invalid-smoke' },
  });
  assert(
    smartContractReviewWorkbenchGateMatrixInvalid.status === 400,
    `Expected invalid smart-contract-review-workbench gate matrix filter 400, got ${smartContractReviewWorkbenchGateMatrixInvalid.status}`
  );
  assert(
    smartContractReviewWorkbenchGateMatrixInvalid.headers.get('x-request-id') === 'gcsc-smart-contract-review-workbench-gate-matrix-invalid-smoke',
    'Invalid smart contract review workbench gate matrix filter response must echo a safe X-Request-Id header'
  );
  assert(
    smartContractReviewWorkbenchGateMatrixInvalid.body?.request_id === 'gcsc-smart-contract-review-workbench-gate-matrix-invalid-smoke',
    'Invalid smart contract review workbench gate matrix filter response must include request_id in the response body'
  );
  assert(
    smartContractReviewWorkbenchGateMatrixInvalid.body?.status === 'smart_contract_review_workbench_gate_matrix_filter_invalid',
    'Invalid smart contract review workbench gate matrix filter must return smart_contract_review_workbench_gate_matrix_filter_invalid status'
  );
  assert(
    smartContractReviewWorkbenchGateMatrixInvalid.body?.error === 'Unsupported smart contract review workbench gate matrix category_filter',
    'Invalid smart contract review workbench gate matrix filter must return a clear unsupported-filter error'
  );
  assert(
    Array.isArray(smartContractReviewWorkbenchGateMatrixInvalid.body?.smart_contract_review_workbench_gate_matrix_filter_recovery_actions) &&
      smartContractReviewWorkbenchGateMatrixInvalid.body.smart_contract_review_workbench_gate_matrix_filter_recovery_actions.some((action) =>
        String(action.label || '').includes('Apply safe gate matrix filter')
      ),
    'Invalid smart contract review workbench gate matrix filter must return safe recovery actions'
  );
  assert(
    smartContractReviewWorkbenchGateMatrixInvalid.body?.gate_matrix_gate?.live_replay_execution === 'blocked' &&
      smartContractReviewWorkbenchGateMatrixInvalid.body?.no_server_storage_attempted === true &&
      smartContractReviewWorkbenchGateMatrixInvalid.body?.no_gate_matrix_content_stored === true &&
      smartContractReviewWorkbenchGateMatrixInvalid.body?.no_live_replay_action_attempted === true &&
      smartContractReviewWorkbenchGateMatrixInvalid.body?.no_live_action_attempted === true,
    'Invalid smart contract review workbench gate matrix filter must keep gate blocked and confirm no live action was attempted'
  );
  assert(betaReadiness.body?.tester_handoff_packet?.includes('docs/smartcontractor-beta-tester-invite.md'), 'Beta readiness must return tester_handoff_packet');
  assert(betaReadiness.body?.session_stop_conditions?.some((item) => item.includes('Stop the session')), 'Beta readiness must return session_stop_conditions');
  assert(betaReadiness.body?.post_session_actions?.some((item) => item.includes('Update the beta decision log')), 'Beta readiness must return post_session_actions');
  assert(betaReadiness.body?.public_beta_exit_criteria?.some((item) => item.includes('Do not move to public beta')), 'Beta readiness must return public_beta_exit_criteria');
  assert(betaReadiness.body?.pre_invite_checks?.some((item) => item.includes('Do not invite testers')), 'Beta readiness must return pre_invite_checks');
  assert(betaReadiness.body?.invite_message_checklist?.some((item) => item.includes('no real-money promises')), 'Beta readiness must return invite_message_checklist');
  assert(betaReadiness.body?.tester_consent_checklist?.some((item) => item.includes('Tester understands')), 'Beta readiness must return tester_consent_checklist');
  assert(
    Array.isArray(betaReadiness.body?.traditional_first_public_copy_gate),
    'Beta readiness must return traditional_first_public_copy_gate array'
  );
  assert(
    betaReadiness.body.traditional_first_public_copy_gate.some((item) => item.id === 'traditional_first_public_default') &&
      betaReadiness.body.traditional_first_public_copy_gate.some((item) => item.id === 'future_web3_integration_port') &&
      betaReadiness.body.traditional_first_public_copy_gate.some((item) => item.id === 'public_copy_review_before_publish') &&
      betaReadiness.body.traditional_first_public_copy_gate.every((item) => item.no_public_website_edit_attempted === true) &&
      betaReadiness.body.traditional_first_public_copy_gate.every((item) => item.no_external_provider_claim_attempted === true) &&
      betaReadiness.body.traditional_first_public_copy_gate.every((item) => item.no_live_action_attempted === true),
    'Beta readiness must return traditional-first public copy gates with no public website edit, no external provider claim, and no live action'
  );
  const traditionalFirstCopyStates = betaReadiness.body.traditional_first_public_copy_gate.map((item) => item.copy_state);
  const traditionalFirstBlockedClaims = betaReadiness.body.traditional_first_public_copy_gate.flatMap((item) =>
    Array.isArray(item.blocked_public_claims) ? item.blocked_public_claims : []
  );
  const traditionalFirstInternalTerms = betaReadiness.body.traditional_first_public_copy_gate.flatMap((item) =>
    Array.isArray(item.internal_only_terms_until_review) ? item.internal_only_terms_until_review : []
  );
  assert(
    traditionalFirstCopyStates.includes('TRADITIONAL_FIRST_PUBLIC_SAFE') &&
      traditionalFirstCopyStates.includes('FUTURE_PROVIDER_REVIEW_ONLY') &&
      traditionalFirstCopyStates.includes('FOUNDER_REVIEW_REQUIRED') &&
      traditionalFirstInternalTerms.includes('blockchain') &&
      traditionalFirstInternalTerms.includes('XPR') &&
      traditionalFirstInternalTerms.includes('stablecoin') &&
      traditionalFirstInternalTerms.includes('LOAN integration') &&
      traditionalFirstBlockedClaims.includes('live blockchain service') &&
      traditionalFirstBlockedClaims.includes('provider partnership') &&
      traditionalFirstBlockedClaims.includes('LOAN integration live') &&
      traditionalFirstBlockedClaims.includes('real-money pilot approved'),
    'Beta readiness traditional-first public copy gate must keep blockchain/Web3/provider/LOAN claims internal or founder-review-only'
  );
  assert(
    Array.isArray(betaReadiness.body?.homepage_publication_sequence_gate),
    'Beta readiness must return homepage_publication_sequence_gate array'
  );
  assert(
    betaReadiness.body.homepage_publication_sequence_gate.some((item) => item.id === 'homepage_copy_direction_gate') &&
      betaReadiness.body.homepage_publication_sequence_gate.some((item) => item.id === 'homepage_publication_go_gate') &&
      betaReadiness.body.homepage_publication_sequence_gate.some((item) => item.id === 'homepage_public_file_replacement_gate') &&
      betaReadiness.body.homepage_publication_sequence_gate.some((item) => item.id === 'homepage_deploy_share_separation_gate') &&
      betaReadiness.body.homepage_publication_sequence_gate.every((item) => item.no_public_homepage_edit_attempted === true) &&
      betaReadiness.body.homepage_publication_sequence_gate.every((item) => item.no_public_whitepaper_edit_attempted === true) &&
      betaReadiness.body.homepage_publication_sequence_gate.every((item) => item.no_deploy_setting_change_attempted === true) &&
      betaReadiness.body.homepage_publication_sequence_gate.every((item) => item.no_public_url_share_attempted === true) &&
      betaReadiness.body.homepage_publication_sequence_gate.every((item) => item.no_live_action_attempted === true),
    'Beta readiness must return homepage publication sequence gates with no public edit, no deploy change, no URL share, and no live action'
  );
  const homepageSequenceStates = betaReadiness.body.homepage_publication_sequence_gate.map((item) => item.gate_state);
  const homepageSequenceDecisions = betaReadiness.body.homepage_publication_sequence_gate.map((item) => item.required_decision);
  const homepageSequenceBlockedActions = betaReadiness.body.homepage_publication_sequence_gate.flatMap((item) =>
    Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
  );
  assert(
    homepageSequenceStates.includes('COPY_DIRECTION_REVIEW_ONLY') &&
      homepageSequenceStates.includes('PUBLICATION_NO_GO') &&
      homepageSequenceStates.includes('NO_PUBLIC_FILE_EDIT') &&
      homepageSequenceStates.includes('DEPLOYMENT_AND_SHARE_SEPARATE') &&
      homepageSequenceDecisions.some((decision) => decision.includes('PUBLICATION_GO')) &&
      homepageSequenceDecisions.some((decision) => decision.includes('DEPLOYMENT_EXTERNAL_ACTION_RECORDED')) &&
      homepageSequenceBlockedActions.includes('public_homepage_replacement') &&
      homepageSequenceBlockedActions.includes('vercel_import') &&
      homepageSequenceBlockedActions.includes('public_url_share') &&
      homepageSequenceBlockedActions.includes('tester_invite') &&
      homepageSequenceBlockedActions.includes('real_payment'),
    'Beta readiness homepage sequence gate must separate copy, publication, public-file replacement, deployment, URL smoke, invite/share, and live-finance approvals'
  );
  const traditionalFirstSafePublicCopy = await request(
    baseUrl,
    '/api/admin/beta-readiness/public-copy/validate',
    {
      method: 'POST',
      headers: { 'X-Request-Id': 'gcsc-beta-public-copy-safe-smoke' },
      body: JSON.stringify({
        copy_text: [
          'SmartContractor is a construction trust platform for contractor matching, project records, milestone evidence, dispute readiness, and admin review.',
          'This is a demo-only local workflow review with no real-money pilot, no live finance, no payment movement, and no escrow release.',
          'Founder review is required before publish and before public use.',
        ].join('\n'),
      }),
    }
  );
  assert(
    traditionalFirstSafePublicCopy.status === 200,
    `Expected safe traditional-first public copy 200, got ${traditionalFirstSafePublicCopy.status}`
  );
  assert(
    traditionalFirstSafePublicCopy.body?.request_id === 'gcsc-beta-public-copy-safe-smoke' &&
      traditionalFirstSafePublicCopy.body?.mode === 'local_beta_traditional_first_public_copy_validation' &&
      traditionalFirstSafePublicCopy.body?.status === 'safe_traditional_first_public_copy' &&
      traditionalFirstSafePublicCopy.body?.validation_type === 'traditional_first_public_copy_validation',
    'Safe traditional-first public copy response must return safe local validation status'
  );
  assert(
    traditionalFirstSafePublicCopy.body?.no_public_copy_storage === true &&
      traditionalFirstSafePublicCopy.body?.no_public_website_edit_attempted === true &&
      traditionalFirstSafePublicCopy.body?.no_external_provider_claim_attempted === true &&
      traditionalFirstSafePublicCopy.body?.no_public_beta_flip_attempted === true &&
      traditionalFirstSafePublicCopy.body?.no_live_action_attempted === true &&
      Array.isArray(traditionalFirstSafePublicCopy.body?.missing_required_fields) &&
      traditionalFirstSafePublicCopy.body.missing_required_fields.length === 0,
    'Safe traditional-first public copy response must confirm no storage, public website edit, provider claim, public beta flip, or live action'
  );
  const traditionalFirstUnsafePublicCopy = await request(
    baseUrl,
    '/api/admin/beta-readiness/public-copy/validate',
    {
      method: 'POST',
      headers: { 'X-Request-Id': 'gcsc-beta-public-copy-unsafe-smoke' },
      body: JSON.stringify({
        copy_text: [
          'SmartContractor blockchain Web3 token XPR stablecoin LOAN integration is live.',
          'Provider partnership and legal approved public beta approved for production launch.',
        ].join('\n'),
      }),
    }
  );
  assert(
    traditionalFirstUnsafePublicCopy.status === 400,
    `Expected unsafe traditional-first public copy 400, got ${traditionalFirstUnsafePublicCopy.status}`
  );
  assert(
    traditionalFirstUnsafePublicCopy.body?.request_id === 'gcsc-beta-public-copy-unsafe-smoke' &&
      traditionalFirstUnsafePublicCopy.body?.mode === 'local_beta_traditional_first_public_copy_validation' &&
      traditionalFirstUnsafePublicCopy.body?.status === 'public_copy_blocked_for_redaction',
    'Unsafe traditional-first public copy response must return blocked-for-redaction status'
  );
  assert(
    Array.isArray(traditionalFirstUnsafePublicCopy.body?.issues) &&
      traditionalFirstUnsafePublicCopy.body.issues.some((issue) => issue.id === 'web3_or_token_public_claim') &&
      traditionalFirstUnsafePublicCopy.body.issues.some((issue) => issue.id === 'live_finance_provider_or_legal_claim') &&
      traditionalFirstUnsafePublicCopy.body?.no_public_copy_storage === true &&
      traditionalFirstUnsafePublicCopy.body?.no_public_website_edit_attempted === true &&
      traditionalFirstUnsafePublicCopy.body?.no_external_provider_claim_attempted === true &&
      traditionalFirstUnsafePublicCopy.body?.no_live_action_attempted === true,
    'Unsafe traditional-first public copy response must flag Web3/live claims and still block storage, public website edit, provider claim, and live action'
  );
  assert(
    Array.isArray(betaReadiness.body?.tester_finance_contract_quickstart),
    'Beta readiness must return tester_finance_contract_quickstart array'
  );
  assert(
    betaReadiness.body.tester_finance_contract_quickstart.some((item) => item.id === 'open_finance_contract_demo') &&
      betaReadiness.body.tester_finance_contract_quickstart.some((item) => item.id === 'capture_safe_request_ids') &&
      betaReadiness.body.tester_finance_contract_quickstart.some((item) => item.id === 'stop_before_live_interpretation') &&
      betaReadiness.body.tester_finance_contract_quickstart.every((item) => item.report_code === 'FINANCE_CONTRACT_TESTER_QUICKSTART') &&
      betaReadiness.body.tester_finance_contract_quickstart.every((item) => item.no_server_storage_attempted === true) &&
      betaReadiness.body.tester_finance_contract_quickstart.every((item) => item.no_external_followup_attempted === true) &&
      betaReadiness.body.tester_finance_contract_quickstart.every((item) => item.no_public_beta_flip_attempted === true) &&
      betaReadiness.body.tester_finance_contract_quickstart.every((item) => item.no_live_action_attempted === true),
    'Beta readiness must return finance/contract quickstart rows with no server storage, no external follow-up, no public beta flip, and no live action'
  );
  const betaFinanceQuickstartActions = betaReadiness.body.tester_finance_contract_quickstart.flatMap((item) =>
    Array.isArray(item.safe_tester_actions) ? item.safe_tester_actions : []
  );
  const betaFinanceQuickstartBlocked = betaReadiness.body.tester_finance_contract_quickstart.flatMap((item) =>
    Array.isArray(item.blocked_live_interpretations) ? item.blocked_live_interpretations : []
  );
  const betaFinanceQuickstartReportFields = betaReadiness.body.tester_finance_contract_quickstart.flatMap((item) =>
    Array.isArray(item.report_back_fields) ? item.report_back_fields : []
  );
  assert(
    betaFinanceQuickstartActions.some((item) => item.includes('Payment Router')) &&
      betaFinanceQuickstartActions.some((item) => item.includes('Request ID')) &&
      betaFinanceQuickstartBlocked.some((item) => item.includes('No card charge or XPR transfer occurred')) &&
      betaFinanceQuickstartBlocked.some((item) => item.includes('No loan was approved or funded')) &&
      betaFinanceQuickstartBlocked.some((item) => item.includes('No contract was signed')) &&
      betaFinanceQuickstartReportFields.includes('request_id') &&
      betaFinanceQuickstartReportFields.includes('boundary_confusion') &&
      betaFinanceQuickstartReportFields.includes('next_local_only_action'),
    'Beta readiness finance/contract quickstart must expose allowed tester actions, blocked live interpretations, and safe report-back fields'
  );
  assert(
    Array.isArray(betaReadiness.body?.tester_finance_contract_walkthrough_gate),
    'Beta readiness must return tester_finance_contract_walkthrough_gate array'
  );
  assert(
    betaReadiness.body.tester_finance_contract_walkthrough_gate.some((item) => item.id === 'quickstart_acknowledgement_gate') &&
      betaReadiness.body.tester_finance_contract_walkthrough_gate.some((item) => item.id === 'walkthrough_stop_gate') &&
      betaReadiness.body.tester_finance_contract_walkthrough_gate.some((item) => item.id === 'debrief_handoff_gate') &&
      betaReadiness.body.tester_finance_contract_walkthrough_gate.every((item) => item.no_server_storage_attempted === true) &&
      betaReadiness.body.tester_finance_contract_walkthrough_gate.every((item) => item.no_external_followup_attempted === true) &&
      betaReadiness.body.tester_finance_contract_walkthrough_gate.every((item) => item.no_public_beta_flip_attempted === true) &&
      betaReadiness.body.tester_finance_contract_walkthrough_gate.every((item) => item.no_live_action_attempted === true),
    'Beta readiness must return finance/contract walkthrough gates with no server storage, external follow-up, public beta flip, or live action'
  );
  const betaWalkthroughGateStates = betaReadiness.body.tester_finance_contract_walkthrough_gate.map((item) => item.gate_state);
  const betaWalkthroughGateRoutes = betaReadiness.body.tester_finance_contract_walkthrough_gate.map((item) => item.route);
  const betaWalkthroughGateActions = betaReadiness.body.tester_finance_contract_walkthrough_gate.flatMap((item) =>
    Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
  );
  assert(
    betaWalkthroughGateStates.includes('REQUIRED_BEFORE_WALKTHROUGH') &&
      betaWalkthroughGateStates.includes('STOP_ON_LIVE_CONFUSION') &&
      betaWalkthroughGateStates.includes('REQUIRED_AFTER_WALKTHROUGH') &&
      betaWalkthroughGateRoutes.includes('/api/admin/beta-readiness/finance-contract-quickstart/acknowledgement/validate') &&
      betaWalkthroughGateRoutes.includes('/api/admin/beta-readiness/finance-contract-walkthrough/live-confusion/validate') &&
      betaWalkthroughGateRoutes.includes('/api/admin/beta-readiness/finance-contract-walkthrough/debrief/validate') &&
      betaWalkthroughGateActions.includes('payment_charge') &&
      betaWalkthroughGateActions.includes('loan_approval') &&
      betaWalkthroughGateActions.includes('escrow_release') &&
      betaWalkthroughGateActions.includes('signed_contract_creation') &&
      betaWalkthroughGateActions.includes('xpr_signature') &&
      betaWalkthroughGateActions.includes('stablecoin_settlement') &&
      betaWalkthroughGateActions.includes('token_collateral_lock') &&
      betaWalkthroughGateActions.includes('public_beta_flip') &&
      betaWalkthroughGateActions.includes('production_release'),
    'Beta readiness finance/contract walkthrough gate must link quickstart/live-confusion/debrief routes and block money, contract, XPR, token, public beta, and production actions'
  );
  assert(
    betaReadiness.body?.tester_finance_contract_boundary_pack?.some((item) => item.includes('demo_only_finance_contract_boundary_pack')) &&
      betaReadiness.body.tester_finance_contract_boundary_pack.some((item) => item.includes('No real payments')) &&
      betaReadiness.body.tester_finance_contract_boundary_pack.some((item) => item.includes('No live loan approval')) &&
      betaReadiness.body.tester_finance_contract_boundary_pack.some((item) => item.includes('No escrow release')) &&
      betaReadiness.body.tester_finance_contract_boundary_pack.some((item) => item.includes('No signed contract')) &&
      betaReadiness.body.tester_finance_contract_boundary_pack.some((item) => item.includes('No token collateral')),
    'Beta readiness must return tester_finance_contract_boundary_pack finance/contract demo-only boundaries'
  );
  assert(
    Array.isArray(betaReadiness.body?.tester_finance_contract_walkthrough_script),
    'Beta readiness must return tester_finance_contract_walkthrough_script array'
  );
  assert(
    betaReadiness.body.tester_finance_contract_walkthrough_script.some((item) => item.label === 'Finance/contract walkthrough opening') &&
      betaReadiness.body.tester_finance_contract_walkthrough_script.some((item) => item.label === 'Payment router checkpoint') &&
      betaReadiness.body.tester_finance_contract_walkthrough_script.some((item) => item.label === 'Starter-loan checkpoint') &&
      betaReadiness.body.tester_finance_contract_walkthrough_script.some((item) => item.label === 'Milestone/escrow checkpoint') &&
      betaReadiness.body.tester_finance_contract_walkthrough_script.some((item) => item.label === 'Smart contract review checkpoint'),
    'Beta readiness must return tester finance/contract walkthrough prompts'
  );
  const betaWalkthroughBlockedActions = betaReadiness.body.tester_finance_contract_walkthrough_script.flatMap((item) =>
    Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
  );
  assert(
    betaWalkthroughBlockedActions.includes('payment_charge') &&
      betaWalkthroughBlockedActions.includes('loan_approval') &&
      betaWalkthroughBlockedActions.includes('escrow_release') &&
      betaWalkthroughBlockedActions.includes('xpr_signature'),
    'Beta readiness tester finance/contract walkthrough must block payment charge, loan approval, escrow release, and XPR signature actions'
  );
  assert(
    Array.isArray(betaReadiness.body?.tester_finance_contract_walkthrough_triage_matrix),
    'Beta readiness must return tester_finance_contract_walkthrough_triage_matrix array'
  );
  assert(
    betaReadiness.body.tester_finance_contract_walkthrough_triage_matrix.some((item) => item.label === 'Real-money expectation triage') &&
      betaReadiness.body.tester_finance_contract_walkthrough_triage_matrix.some((item) => item.label === 'Sensitive data entry triage') &&
      betaReadiness.body.tester_finance_contract_walkthrough_triage_matrix.some((item) => item.label === 'Binding contract expectation triage') &&
      betaReadiness.body.tester_finance_contract_walkthrough_triage_matrix.some((item) => item.label === 'Escrow or refund expectation triage') &&
      betaReadiness.body.tester_finance_contract_walkthrough_triage_matrix.some((item) => item.label === 'Smart contract live-action expectation triage'),
    'Beta readiness must return tester finance/contract walkthrough triage rows'
  );
  const betaWalkthroughTriageActions = betaReadiness.body.tester_finance_contract_walkthrough_triage_matrix.flatMap((item) =>
    Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
  );
  assert(
    betaWalkthroughTriageActions.includes('payment_charge') &&
      betaWalkthroughTriageActions.includes('sensitive_data_collection') &&
      betaWalkthroughTriageActions.includes('signed_contract_creation') &&
      betaWalkthroughTriageActions.includes('xpr_signature'),
    'Beta readiness tester finance/contract walkthrough triage must block money, sensitive data, binding contract, and XPR actions'
  );
  assert(
    Array.isArray(betaReadiness.body?.tester_finance_contract_walkthrough_debrief_packet),
    'Beta readiness must return tester_finance_contract_walkthrough_debrief_packet array'
  );
  assert(
    betaReadiness.body.tester_finance_contract_walkthrough_debrief_packet.some((item) => item.label === 'Finance/contract debrief summary') &&
      betaReadiness.body.tester_finance_contract_walkthrough_debrief_packet.some((item) => item.label === 'Boundary clarity rating') &&
      betaReadiness.body.tester_finance_contract_walkthrough_debrief_packet.some((item) => item.label === 'Confusion triage summary') &&
      betaReadiness.body.tester_finance_contract_walkthrough_debrief_packet.some((item) => item.label === 'Safe issue handoff') &&
      betaReadiness.body.tester_finance_contract_walkthrough_debrief_packet.some((item) => item.label === 'Founder review hold'),
    'Beta readiness must return tester finance/contract walkthrough debrief fields'
  );
  const betaWalkthroughDebriefActions = betaReadiness.body.tester_finance_contract_walkthrough_debrief_packet.flatMap((item) =>
    Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
  );
  assert(
    betaWalkthroughDebriefActions.includes('external_send') &&
      betaWalkthroughDebriefActions.includes('sensitive_data_storage') &&
      betaWalkthroughDebriefActions.includes('payment_charge') &&
      betaWalkthroughDebriefActions.includes('production_release'),
    'Beta readiness tester finance/contract walkthrough debrief must block external send, sensitive storage, payment charge, and production release'
  );
  assert(
    Array.isArray(betaReadiness.body?.tester_finance_contract_reviewer_notes),
    'Beta readiness must return tester_finance_contract_reviewer_notes array'
  );
  assert(
    betaReadiness.body.tester_finance_contract_reviewer_notes.some((item) => item.id === 'reviewer_demo_boundary_prompt') &&
      betaReadiness.body.tester_finance_contract_reviewer_notes.some((item) => item.id === 'reviewer_must_capture_request_id') &&
      betaReadiness.body.tester_finance_contract_reviewer_notes.some((item) => item.id === 'reviewer_stop_before_live_action') &&
      betaReadiness.body.tester_finance_contract_reviewer_notes.every((item) => item.report_code === 'SAFE_REVIEWER_NOTE'),
    'Beta readiness must return reviewer finance/contract notes with safe prompt, request-id, stop-gate, and SAFE_REVIEWER_NOTE code'
  );
  const betaReviewerNoteBlockedActions = betaReadiness.body.tester_finance_contract_reviewer_notes.flatMap((item) =>
    Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
  );
  assert(
    betaReviewerNoteBlockedActions.includes('payment_charge') &&
      betaReviewerNoteBlockedActions.includes('loan_approval') &&
      betaReviewerNoteBlockedActions.includes('escrow_release') &&
      betaReviewerNoteBlockedActions.includes('signed_contract_creation') &&
      betaReviewerNoteBlockedActions.includes('xpr_signature') &&
      betaReviewerNoteBlockedActions.includes('external_send'),
    'Beta readiness reviewer finance/contract notes must block payment, loan, escrow, contract, XPR, and external-send actions'
  );
  assert(
    Array.isArray(betaReadiness.body?.tester_finance_contract_live_confusion_safety_pack),
    'Beta readiness must return tester_finance_contract_live_confusion_safety_pack array'
  );
  assert(
    betaReadiness.body.tester_finance_contract_live_confusion_safety_pack.some((item) => item.id === 'live_confusion_preflight_check') &&
      betaReadiness.body.tester_finance_contract_live_confusion_safety_pack.some((item) => item.id === 'live_confusion_stop_script') &&
      betaReadiness.body.tester_finance_contract_live_confusion_safety_pack.some((item) => item.id === 'live_confusion_safe_issue_handoff') &&
      betaReadiness.body.tester_finance_contract_live_confusion_safety_pack.every((item) => item.report_code === 'LIVE_CONFUSION_REVIEW_ONLY') &&
      betaReadiness.body.tester_finance_contract_live_confusion_safety_pack.every((item) => item.no_public_beta_flip === true) &&
      betaReadiness.body.tester_finance_contract_live_confusion_safety_pack.every((item) => item.no_external_followup === true),
    'Beta readiness must return finance/contract live-confusion preflight, stop script, and safe issue handoff with no public beta or external follow-up'
  );
  const betaLiveConfusionBlockedActions = betaReadiness.body.tester_finance_contract_live_confusion_safety_pack.flatMap((item) =>
    Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
  );
  assert(
    betaLiveConfusionBlockedActions.includes('payment_charge') &&
      betaLiveConfusionBlockedActions.includes('loan_approval') &&
      betaLiveConfusionBlockedActions.includes('escrow_release') &&
      betaLiveConfusionBlockedActions.includes('xpr_signature') &&
      betaLiveConfusionBlockedActions.includes('public_beta_flip') &&
      betaLiveConfusionBlockedActions.includes('external_followup') &&
      betaLiveConfusionBlockedActions.includes('production_release'),
    'Beta readiness finance/contract live-confusion safety pack must block money, escrow, XPR, public beta, external follow-up, and production actions'
  );
  assert(
    Array.isArray(betaReadiness.body?.tester_finance_contract_session_safety_checklist),
    'Beta readiness must return tester_finance_contract_session_safety_checklist array'
  );
  assert(
    betaReadiness.body.tester_finance_contract_session_safety_checklist.some((item) => item.id === 'session_safety_preflight') &&
      betaReadiness.body.tester_finance_contract_session_safety_checklist.some((item) => item.id === 'session_safety_during_walkthrough') &&
      betaReadiness.body.tester_finance_contract_session_safety_checklist.some((item) => item.id === 'session_safety_handoff') &&
      betaReadiness.body.tester_finance_contract_session_safety_checklist.every((item) => item.report_code === 'FINANCE_CONTRACT_SESSION_SAFETY') &&
      betaReadiness.body.tester_finance_contract_session_safety_checklist.every((item) => item.no_server_storage_attempted === true) &&
      betaReadiness.body.tester_finance_contract_session_safety_checklist.every((item) => item.no_external_followup_attempted === true) &&
      betaReadiness.body.tester_finance_contract_session_safety_checklist.every((item) => item.no_public_beta_flip_attempted === true) &&
      betaReadiness.body.tester_finance_contract_session_safety_checklist.every((item) => item.no_live_action_attempted === true),
    'Beta readiness must return finance/contract session safety checklist rows with no server storage, external follow-up, public beta flip, or live action'
  );
  const betaSessionSafetyPhases = betaReadiness.body.tester_finance_contract_session_safety_checklist.map((item) => item.phase);
  const betaSessionSafetyEvidence = betaReadiness.body.tester_finance_contract_session_safety_checklist.flatMap((item) =>
    Array.isArray(item.required_safe_evidence) ? item.required_safe_evidence : []
  );
  const betaSessionSafetyStops = betaReadiness.body.tester_finance_contract_session_safety_checklist.flatMap((item) =>
    Array.isArray(item.stop_if) ? item.stop_if : []
  );
  const betaSessionSafetyBlockedActions = betaReadiness.body.tester_finance_contract_session_safety_checklist.flatMap((item) =>
    Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
  );
  assert(
    betaSessionSafetyPhases.includes('BEFORE_WALKTHROUGH') &&
      betaSessionSafetyPhases.includes('DURING_WALKTHROUGH') &&
      betaSessionSafetyPhases.includes('AFTER_WALKTHROUGH') &&
      betaSessionSafetyEvidence.includes('FINANCE_CONTRACT_TESTER_QUICKSTART acknowledgement') &&
      betaSessionSafetyEvidence.includes('SAFE_DEBRIEF_NOTE') &&
      betaSessionSafetyStops.includes('tester expects payment charge') &&
      betaSessionSafetyStops.includes('tester enters card or bank data') &&
      betaSessionSafetyBlockedActions.includes('payment_charge') &&
      betaSessionSafetyBlockedActions.includes('sensitive_data_collection') &&
      betaSessionSafetyBlockedActions.includes('public_beta_flip') &&
      betaSessionSafetyBlockedActions.includes('production_release'),
    'Beta readiness finance/contract session safety checklist must cover before/during/after phases, safe evidence, stop triggers, and blocked live actions'
  );
  assert(
    Array.isArray(betaReadiness.body?.tester_finance_contract_safe_handoff_summary),
    'Beta readiness must return tester_finance_contract_safe_handoff_summary array'
  );
  assert(
    betaReadiness.body.tester_finance_contract_safe_handoff_summary.some(
      (item) =>
        item.id === 'finance_contract_safe_handoff_summary' &&
        item.report_code === 'FINANCE_CONTRACT_SAFE_HANDOFF_SUMMARY' &&
        item.summary_state === 'LOCAL_REVIEW_ONLY' &&
        item.no_server_storage_attempted === true &&
        item.no_external_followup_attempted === true &&
        item.no_external_export_attempted === true &&
        item.no_public_beta_flip_attempted === true &&
        item.no_live_action_attempted === true
    ),
    'Beta readiness must return a local-only finance/contract safe handoff summary with no storage/export/live-action flags'
  );
  const betaSafeHandoffSources = betaReadiness.body.tester_finance_contract_safe_handoff_summary.flatMap((item) =>
    Array.isArray(item.required_sources) ? item.required_sources : []
  );
  const betaSafeHandoffFields = betaReadiness.body.tester_finance_contract_safe_handoff_summary.flatMap((item) =>
    Array.isArray(item.handoff_fields) ? item.handoff_fields : []
  );
  const betaSafeHandoffHistories = betaReadiness.body.tester_finance_contract_safe_handoff_summary.flatMap((item) =>
    Array.isArray(item.metadata_only_history_sources) ? item.metadata_only_history_sources : []
  );
  const betaSafeHandoffRoutes = betaReadiness.body.tester_finance_contract_safe_handoff_summary.flatMap((item) =>
    Array.isArray(item.review_routes) ? item.review_routes : []
  );
  const betaSafeHandoffBlockedActions = betaReadiness.body.tester_finance_contract_safe_handoff_summary.flatMap((item) =>
    Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
  );
  assert(
    betaSafeHandoffSources.includes('tester_finance_contract_quickstart') &&
      betaSafeHandoffSources.includes('tester_finance_contract_session_safety_checklist') &&
      betaSafeHandoffSources.includes('tester_finance_contract_live_confusion_safety_pack') &&
      betaSafeHandoffSources.includes('tester_finance_contract_reviewer_notes') &&
      betaSafeHandoffSources.includes('tester_finance_contract_walkthrough_debrief_packet') &&
      betaSafeHandoffHistories.includes('beta_finance_contract_session_safety_validation_history') &&
      betaSafeHandoffHistories.includes('beta_finance_contract_live_confusion_validation_history') &&
      betaSafeHandoffHistories.includes('beta_finance_contract_reviewer_note_validation_history') &&
      betaSafeHandoffHistories.includes('beta_finance_contract_safe_handoff_report_history') &&
      betaSafeHandoffFields.includes('request_id') &&
      betaSafeHandoffFields.includes('safe_evidence_summary') &&
      betaSafeHandoffRoutes.includes('/api/admin/admin-evidence-export-preview?source_filter=beta_finance_contract_session_safety_validation_history') &&
      betaSafeHandoffRoutes.includes('/api/admin/admin-evidence-export-preview?source_filter=beta_finance_contract_live_confusion_validation_history') &&
      betaSafeHandoffRoutes.includes('/api/admin/admin-evidence-export-preview?source_filter=beta_finance_contract_reviewer_note_validation_history') &&
      betaSafeHandoffRoutes.includes('/api/admin/admin-evidence-export-preview?source_filter=beta_finance_contract_safe_handoff_report_history') &&
      betaSafeHandoffBlockedActions.includes('server_storage') &&
      betaSafeHandoffBlockedActions.includes('external_export') &&
      betaSafeHandoffBlockedActions.includes('payment_charge') &&
      betaSafeHandoffBlockedActions.includes('loan_approval') &&
      betaSafeHandoffBlockedActions.includes('escrow_release') &&
      betaSafeHandoffBlockedActions.includes('signed_contract_creation') &&
      betaSafeHandoffBlockedActions.includes('xpr_signature') &&
      betaSafeHandoffBlockedActions.includes('stablecoin_settlement') &&
      betaSafeHandoffBlockedActions.includes('token_collateral_lock') &&
      betaSafeHandoffBlockedActions.includes('provider_commitment') &&
      betaSafeHandoffBlockedActions.includes('legal_decision') &&
      betaSafeHandoffBlockedActions.includes('production_release'),
    'Beta readiness finance/contract safe handoff summary must link safe sources/history/export routes and block storage, finance, contract, XPR, provider/legal, and production actions'
  );
  const betaFinanceContractSafeSessionSafety = await request(
    baseUrl,
    '/api/admin/beta-readiness/finance-contract-walkthrough/session-safety/validate',
    {
      method: 'POST',
      headers: { 'X-Request-Id': 'gcsc-beta-finance-session-safety-safe-smoke' },
      body: JSON.stringify({
        session_safety_note: [
          'Reviewer role: founder/admin',
          'Tester role: homeowner',
          'Phase: BEFORE_WALKTHROUGH',
          'Flow: payment router',
          'Checkpoint: session safety preflight',
          'Request ID: gcsc-beta-readiness-smoke',
          'Safe evidence summary: tester repeated no real payment, no loan approval, no escrow release, no signed contract, no XPR signature',
          'Stop state: clear',
          'Next local action: continue local demo',
          'FINANCE_CONTRACT_SESSION_SAFETY',
        ].join('\n'),
        source_request_id: 'gcsc-beta-readiness-smoke',
      }),
    }
  );
  assert(
    betaFinanceContractSafeSessionSafety.status === 200,
    `Expected safe finance/contract session-safety validation 200, got ${betaFinanceContractSafeSessionSafety.status}`
  );
  assert(
    betaFinanceContractSafeSessionSafety.body?.request_id === 'gcsc-beta-finance-session-safety-safe-smoke' &&
      betaFinanceContractSafeSessionSafety.body?.mode === 'local_beta_finance_contract_session_safety_validation' &&
      betaFinanceContractSafeSessionSafety.body?.status === 'safe_local_session_safety_review' &&
      betaFinanceContractSafeSessionSafety.body?.validation_type === 'tester_finance_contract_session_safety_validation',
    'Safe finance/contract session-safety response must return safe local validation status'
  );
  assert(
    betaFinanceContractSafeSessionSafety.body?.session_safety_validation_gate?.server_storage === 'blocked' &&
      betaFinanceContractSafeSessionSafety.body?.session_safety_validation_gate?.external_followup === 'blocked' &&
      betaFinanceContractSafeSessionSafety.body?.session_safety_validation_gate?.public_beta_flip === 'blocked' &&
      betaFinanceContractSafeSessionSafety.body?.no_session_safety_note_storage === true &&
      betaFinanceContractSafeSessionSafety.body?.no_external_followup_attempted === true &&
      betaFinanceContractSafeSessionSafety.body?.no_public_beta_flip === true &&
      betaFinanceContractSafeSessionSafety.body?.no_live_action_attempted === true,
    'Safe finance/contract session-safety response must confirm no storage, external follow-up, public beta flip, or live action'
  );
  const betaFinanceContractUnsafeSessionSafety = await request(
    baseUrl,
    '/api/admin/beta-readiness/finance-contract-walkthrough/session-safety/validate',
    {
      method: 'POST',
      headers: { 'X-Request-Id': 'gcsc-beta-finance-session-safety-unsafe-smoke' },
      body: JSON.stringify({
        session_safety_note: [
          'Reviewer role: founder/admin',
          'Tester role: homeowner',
          'Phase: DURING_WALKTHROUGH',
          'Flow: payment router',
          'Checkpoint: Payment router checkpoint',
          'Request ID: gcsc-beta-readiness-smoke',
          'Safe evidence summary: tester asks to charge card and approve loan now',
          'Stop state: stop',
          'Next local action: remove unsafe live wording',
          'FINANCE_CONTRACT_SESSION_SAFETY',
        ].join('\n'),
      }),
    }
  );
  assert(
    betaFinanceContractUnsafeSessionSafety.status === 400,
    `Expected unsafe finance/contract session-safety validation 400, got ${betaFinanceContractUnsafeSessionSafety.status}`
  );
  assert(
    betaFinanceContractUnsafeSessionSafety.body?.request_id === 'gcsc-beta-finance-session-safety-unsafe-smoke' &&
      betaFinanceContractUnsafeSessionSafety.body?.mode === 'local_beta_finance_contract_session_safety_validation' &&
      betaFinanceContractUnsafeSessionSafety.body?.status === 'session_safety_blocked_for_redaction',
    'Unsafe finance/contract session-safety response must return blocked-for-redaction status'
  );
  assert(
    Array.isArray(betaFinanceContractUnsafeSessionSafety.body?.issues) &&
      betaFinanceContractUnsafeSessionSafety.body.issues.some((issue) => issue.id === 'live_finance_or_contract_action') &&
      betaFinanceContractUnsafeSessionSafety.body?.no_session_safety_note_storage === true &&
      betaFinanceContractUnsafeSessionSafety.body?.no_public_beta_flip === true &&
      betaFinanceContractUnsafeSessionSafety.body?.no_live_action_attempted === true,
    'Unsafe finance/contract session-safety response must flag live finance wording and still block storage, public beta, and live action'
  );
  const betaFinanceContractSafeQuickstartAck = await request(
    baseUrl,
    '/api/admin/beta-readiness/finance-contract-quickstart/acknowledgement/validate',
    {
      method: 'POST',
      headers: { 'X-Request-Id': 'gcsc-beta-finance-quickstart-ack-safe-smoke' },
      body: JSON.stringify({
        acknowledgement_text: [
          'Tester role: homeowner',
          'Flow: payment router',
          'Checkpoint: quickstart preflight',
          'Request ID: gcsc-beta-readiness-smoke',
          'Quickstart understood: yes, local demo-only walkthrough',
          'Allowed local action: open Payment Router and capture request ID',
          'Blocked live interpretation: no card charge, no loan approval, no escrow release, no signed contract, no XPR signature',
          'Next local action: continue local demo and log request id',
          'FINANCE_CONTRACT_TESTER_QUICKSTART',
        ].join('\n'),
      }),
    }
  );
  assert(
    betaFinanceContractSafeQuickstartAck.status === 200,
    `Expected safe beta finance/contract quickstart acknowledgement 200, got ${betaFinanceContractSafeQuickstartAck.status}`
  );
  assert(
    betaFinanceContractSafeQuickstartAck.headers.get('x-request-id') === 'gcsc-beta-finance-quickstart-ack-safe-smoke',
    'Safe beta finance/contract quickstart acknowledgement response must echo a safe X-Request-Id header'
  );
  assert(
    betaFinanceContractSafeQuickstartAck.body?.request_id === 'gcsc-beta-finance-quickstart-ack-safe-smoke' &&
      betaFinanceContractSafeQuickstartAck.body?.mode === 'local_beta_finance_contract_quickstart_acknowledgement_validation' &&
      betaFinanceContractSafeQuickstartAck.body?.status === 'safe_local_quickstart_acknowledgement' &&
      betaFinanceContractSafeQuickstartAck.body?.validation_type === 'tester_finance_contract_quickstart_acknowledgement_validation',
    'Safe beta finance/contract quickstart acknowledgement response must return safe local validation status'
  );
  assert(
    betaFinanceContractSafeQuickstartAck.body?.no_acknowledgement_storage === true &&
      betaFinanceContractSafeQuickstartAck.body?.no_server_storage_attempted === true &&
      betaFinanceContractSafeQuickstartAck.body?.no_external_followup_attempted === true &&
      betaFinanceContractSafeQuickstartAck.body?.no_public_beta_flip_attempted === true &&
      betaFinanceContractSafeQuickstartAck.body?.no_live_action_attempted === true,
    'Safe beta finance/contract quickstart acknowledgement response must confirm no storage, external follow-up, public beta flip, or live action'
  );
  assert(
    Array.isArray(betaFinanceContractSafeQuickstartAck.body?.required_fields) &&
      betaFinanceContractSafeQuickstartAck.body.required_fields.includes('FINANCE_CONTRACT_TESTER_QUICKSTART') &&
      Array.isArray(betaFinanceContractSafeQuickstartAck.body?.missing_required_fields) &&
      betaFinanceContractSafeQuickstartAck.body.missing_required_fields.length === 0,
    'Safe beta finance/contract quickstart acknowledgement response must include required fields and no missing fields'
  );
  const betaFinanceContractUnsafeQuickstartAck = await request(
    baseUrl,
    '/api/admin/beta-readiness/finance-contract-quickstart/acknowledgement/validate',
    {
      method: 'POST',
      headers: { 'X-Request-Id': 'gcsc-beta-finance-quickstart-ack-unsafe-smoke' },
      body: JSON.stringify({
        acknowledgement_text: [
          'Tester role: contractor',
          'Flow: starter loan',
          'Checkpoint: quickstart preflight',
          'Request ID: gcsc-beta-readiness-smoke',
          'Quickstart understood: approve loan and go live',
          'Allowed local action: release escrow and charge card',
          'Blocked live interpretation: none',
          'Next local action: public beta flip and production release',
          'FINANCE_CONTRACT_TESTER_QUICKSTART',
        ].join('\n'),
      }),
    }
  );
  assert(
    betaFinanceContractUnsafeQuickstartAck.status === 400,
    `Expected unsafe beta finance/contract quickstart acknowledgement 400, got ${betaFinanceContractUnsafeQuickstartAck.status}`
  );
  assert(
    betaFinanceContractUnsafeQuickstartAck.body?.request_id === 'gcsc-beta-finance-quickstart-ack-unsafe-smoke' &&
      betaFinanceContractUnsafeQuickstartAck.body?.mode === 'local_beta_finance_contract_quickstart_acknowledgement_validation' &&
      betaFinanceContractUnsafeQuickstartAck.body?.status === 'quickstart_acknowledgement_blocked_for_redaction',
    'Unsafe beta finance/contract quickstart acknowledgement response must return blocked-for-redaction status'
  );
  assert(
    Array.isArray(betaFinanceContractUnsafeQuickstartAck.body?.issues) &&
      betaFinanceContractUnsafeQuickstartAck.body.issues.some((issue) => issue.id === 'live_finance_or_contract_action') &&
      betaFinanceContractUnsafeQuickstartAck.body?.no_acknowledgement_storage === true &&
      betaFinanceContractUnsafeQuickstartAck.body?.no_external_followup_attempted === true &&
      betaFinanceContractUnsafeQuickstartAck.body?.no_public_beta_flip_attempted === true &&
      betaFinanceContractUnsafeQuickstartAck.body?.no_live_action_attempted === true,
    'Unsafe beta finance/contract quickstart acknowledgement response must flag live wording and still block storage, external follow-up, public beta, and live action'
  );
  const betaFinanceContractSafeLiveConfusion = await request(
    baseUrl,
    '/api/admin/beta-readiness/finance-contract-walkthrough/live-confusion/validate',
    {
      method: 'POST',
      headers: { 'X-Request-Id': 'gcsc-beta-finance-live-confusion-safe-smoke' },
      body: JSON.stringify({
        confusion_note: [
          'Reviewer role: founder/admin',
          'Tester role: homeowner',
          'Flow: milestone escrow',
          'Checkpoint: Milestone/escrow checkpoint',
          'Request ID: gcsc-beta-readiness-smoke',
          'Confusion signal: tester expected live action from local demo screen',
          'Stop script response: tester accepted local demo boundary',
          'Safe issue handoff: improve boundary copy with redacted metadata only',
          'Next local action: log issue for founder/admin review',
          'LIVE_CONFUSION_REVIEW_ONLY',
        ].join('\n'),
      }),
    }
  );
  assert(
    betaFinanceContractSafeLiveConfusion.status === 200,
    `Expected safe beta finance/contract live-confusion note 200, got ${betaFinanceContractSafeLiveConfusion.status}`
  );
  assert(
    betaFinanceContractSafeLiveConfusion.headers.get('x-request-id') === 'gcsc-beta-finance-live-confusion-safe-smoke',
    'Safe beta finance/contract live-confusion response must echo a safe X-Request-Id header'
  );
  assert(
    betaFinanceContractSafeLiveConfusion.body?.request_id === 'gcsc-beta-finance-live-confusion-safe-smoke' &&
      betaFinanceContractSafeLiveConfusion.body?.mode === 'local_beta_finance_contract_live_confusion_validation' &&
      betaFinanceContractSafeLiveConfusion.body?.status === 'safe_local_live_confusion_review' &&
      betaFinanceContractSafeLiveConfusion.body?.validation_type === 'tester_finance_contract_live_confusion_validation',
    'Safe beta finance/contract live-confusion response must return safe local validation status'
  );
  assert(
    betaFinanceContractSafeLiveConfusion.body?.no_live_confusion_note_storage === true &&
      betaFinanceContractSafeLiveConfusion.body?.no_server_storage_attempted === true &&
      betaFinanceContractSafeLiveConfusion.body?.no_public_beta_flip === true &&
      betaFinanceContractSafeLiveConfusion.body?.no_external_followup === true &&
      betaFinanceContractSafeLiveConfusion.body?.no_live_action_attempted === true,
    'Safe beta finance/contract live-confusion response must confirm no storage, public beta flip, external follow-up, or live action'
  );
  assert(
    Array.isArray(betaFinanceContractSafeLiveConfusion.body?.missing_required_fields) &&
      betaFinanceContractSafeLiveConfusion.body.missing_required_fields.length === 0 &&
      Array.isArray(betaFinanceContractSafeLiveConfusion.body?.required_fields) &&
      betaFinanceContractSafeLiveConfusion.body.required_fields.includes('LIVE_CONFUSION_REVIEW_ONLY'),
    'Safe beta finance/contract live-confusion response must include required fields and no missing fields'
  );
  const betaFinanceContractUnsafeLiveConfusion = await request(
    baseUrl,
    '/api/admin/beta-readiness/finance-contract-walkthrough/live-confusion/validate',
    {
      method: 'POST',
      headers: { 'X-Request-Id': 'gcsc-beta-finance-live-confusion-unsafe-smoke' },
      body: JSON.stringify({
        confusion_note: [
          'Reviewer role: founder/admin',
          'Tester role: homeowner',
          'Flow: milestone escrow',
          'Checkpoint: Milestone/escrow checkpoint',
          'Request ID: gcsc-beta-readiness-smoke',
          'Confusion signal: tester asked to release escrow and go live',
          'Stop script response: continue anyway',
          'Safe issue handoff: unsafe live request',
          'Next local action: approve production release',
          'LIVE_CONFUSION_REVIEW_ONLY',
        ].join('\n'),
      }),
    }
  );
  assert(
    betaFinanceContractUnsafeLiveConfusion.status === 400,
    `Expected unsafe beta finance/contract live-confusion note 400, got ${betaFinanceContractUnsafeLiveConfusion.status}`
  );
  assert(
    betaFinanceContractUnsafeLiveConfusion.body?.mode === 'local_beta_finance_contract_live_confusion_validation' &&
      betaFinanceContractUnsafeLiveConfusion.body?.status === 'live_confusion_blocked_for_redaction',
    'Unsafe beta finance/contract live-confusion response must return live_confusion_blocked_for_redaction status'
  );
  assert(
    betaFinanceContractUnsafeLiveConfusion.body?.issues?.some((issue) => issue.id === 'live_finance_or_contract_action') &&
      betaFinanceContractUnsafeLiveConfusion.body?.no_live_confusion_note_storage === true &&
      betaFinanceContractUnsafeLiveConfusion.body?.no_public_beta_flip === true &&
      betaFinanceContractUnsafeLiveConfusion.body?.no_external_followup === true &&
      betaFinanceContractUnsafeLiveConfusion.body?.no_live_action_attempted === true,
    'Unsafe beta finance/contract live-confusion response must flag live wording and still block storage, public beta, external follow-up, and live action'
  );
  const betaFinanceContractSafeReviewerNote = await request(
    baseUrl,
    '/api/admin/beta-readiness/finance-contract-walkthrough/reviewer-note/validate',
    {
      method: 'POST',
      headers: { 'X-Request-Id': 'gcsc-beta-finance-reviewer-note-safe-smoke' },
      body: JSON.stringify({
        note_text: [
          'Reviewer role: founder/admin',
          'Tester role: homeowner',
          'Flow: payment router',
          'Checkpoint: Payment router checkpoint',
          'Request ID: gcsc-beta-readiness-smoke',
          'Boundary response: tester repeated no real payment and no escrow release',
          'Stop gate state: clear',
          'Next safe action: continue local demo and log request id',
          'SAFE_REVIEWER_NOTE',
        ].join('\n'),
      }),
    }
  );
  assert(
    betaFinanceContractSafeReviewerNote.status === 200,
    `Expected safe beta finance/contract reviewer note 200, got ${betaFinanceContractSafeReviewerNote.status}`
  );
  assert(
    betaFinanceContractSafeReviewerNote.headers.get('x-request-id') === 'gcsc-beta-finance-reviewer-note-safe-smoke',
    'Safe beta finance/contract reviewer note response must echo a safe X-Request-Id header'
  );
  assert(
    betaFinanceContractSafeReviewerNote.body?.request_id === 'gcsc-beta-finance-reviewer-note-safe-smoke' &&
      betaFinanceContractSafeReviewerNote.body?.mode === 'local_beta_finance_contract_reviewer_note_validation' &&
      betaFinanceContractSafeReviewerNote.body?.status === 'safe_local_reviewer_note' &&
      betaFinanceContractSafeReviewerNote.body?.validation_type === 'tester_finance_contract_reviewer_note_validation',
    'Safe beta finance/contract reviewer note response must return safe local validation status'
  );
  assert(
    betaFinanceContractSafeReviewerNote.body?.no_reviewer_note_storage === true &&
      betaFinanceContractSafeReviewerNote.body?.no_server_storage_attempted === true &&
      betaFinanceContractSafeReviewerNote.body?.no_live_action_attempted === true,
    'Safe beta finance/contract reviewer note response must confirm no reviewer note storage and no live action'
  );
  assert(
    Array.isArray(betaFinanceContractSafeReviewerNote.body?.missing_required_fields) &&
      betaFinanceContractSafeReviewerNote.body.missing_required_fields.length === 0 &&
      Array.isArray(betaFinanceContractSafeReviewerNote.body?.required_fields) &&
      betaFinanceContractSafeReviewerNote.body.required_fields.includes('SAFE_REVIEWER_NOTE'),
    'Safe beta finance/contract reviewer note response must include required fields and no missing fields'
  );
  const betaFinanceContractUnsafeReviewerNote = await request(
    baseUrl,
    '/api/admin/beta-readiness/finance-contract-walkthrough/reviewer-note/validate',
    {
      method: 'POST',
      headers: { 'X-Request-Id': 'gcsc-beta-finance-reviewer-note-unsafe-smoke' },
      body: JSON.stringify({
        note_text: [
          'Reviewer role: founder/admin',
          'Tester role: contractor',
          'Flow: starter loan',
          'Request ID: gcsc-beta-readiness-smoke',
          'SAFE_REVIEWER_NOTE',
          'Reviewer says approve loan, charge card, release escrow, sign contract, request XPR signature, and send externally.',
        ].join('\n'),
      }),
    }
  );
  assert(
    betaFinanceContractUnsafeReviewerNote.status === 400,
    `Expected unsafe beta finance/contract reviewer note 400, got ${betaFinanceContractUnsafeReviewerNote.status}`
  );
  assert(
    betaFinanceContractUnsafeReviewerNote.body?.request_id === 'gcsc-beta-finance-reviewer-note-unsafe-smoke' &&
      betaFinanceContractUnsafeReviewerNote.body?.mode === 'local_beta_finance_contract_reviewer_note_validation' &&
      betaFinanceContractUnsafeReviewerNote.body?.status === 'reviewer_note_blocked_for_redaction',
    'Unsafe beta finance/contract reviewer note response must return reviewer_note_blocked_for_redaction status'
  );
  assert(
    Array.isArray(betaFinanceContractUnsafeReviewerNote.body?.issues) &&
      betaFinanceContractUnsafeReviewerNote.body.issues.some((issue) => issue.id === 'live_finance_or_contract_action') &&
      betaFinanceContractUnsafeReviewerNote.body?.no_reviewer_note_storage === true &&
      betaFinanceContractUnsafeReviewerNote.body?.no_live_action_attempted === true,
    'Unsafe beta finance/contract reviewer note response must flag live wording and still block storage/live action'
  );
  const betaFinanceContractSafeDebriefDraft = await request(
    baseUrl,
    '/api/admin/beta-readiness/finance-contract-walkthrough/debrief/validate',
    {
      method: 'POST',
      headers: { 'X-Request-Id': 'gcsc-beta-finance-debrief-safe-smoke' },
      body: JSON.stringify({
        draft_text: [
          'Role: homeowner tester',
          'Flow: payment router',
          'Checkpoints: Payment router checkpoint; Starter-loan checkpoint; Milestone/escrow checkpoint; Smart contract review checkpoint',
          'Request ID: gcsc-beta-readiness-smoke',
          'Boundary clarity rating: CLEAR',
          'Triage labels: none',
          'Safe issue handoff: no issue, request ID copied',
          'Founder review hold: none',
          'SAFE_DEBRIEF_NOTE',
        ].join('\n'),
      }),
    }
  );
  assert(
    betaFinanceContractSafeDebriefDraft.status === 200,
    `Expected safe beta finance/contract debrief draft 200, got ${betaFinanceContractSafeDebriefDraft.status}`
  );
  assert(
    betaFinanceContractSafeDebriefDraft.headers.get('x-request-id') === 'gcsc-beta-finance-debrief-safe-smoke',
    'Safe beta finance/contract debrief draft response must echo a safe X-Request-Id header'
  );
  assert(
    betaFinanceContractSafeDebriefDraft.body?.request_id === 'gcsc-beta-finance-debrief-safe-smoke',
    'Safe beta finance/contract debrief draft response must include request_id in the body'
  );
  assert(
    betaFinanceContractSafeDebriefDraft.body?.mode === 'local_beta_finance_contract_debrief_validation' &&
      betaFinanceContractSafeDebriefDraft.body?.status === 'safe_local_debrief_review',
    'Safe beta finance/contract debrief draft response must return safe local validation status'
  );
  assert(
    betaFinanceContractSafeDebriefDraft.body?.validation_type === 'tester_finance_contract_debrief_draft_validation' &&
      betaFinanceContractSafeDebriefDraft.body?.no_server_storage === true &&
      betaFinanceContractSafeDebriefDraft.body?.no_server_storage_attempted === true &&
      betaFinanceContractSafeDebriefDraft.body?.no_live_action_attempted === true,
    'Safe beta finance/contract debrief draft response must confirm no server storage and no live action'
  );
  assert(
    Array.isArray(betaFinanceContractSafeDebriefDraft.body?.issues) &&
      betaFinanceContractSafeDebriefDraft.body.issues.length === 0 &&
      Array.isArray(betaFinanceContractSafeDebriefDraft.body?.required_fields) &&
      betaFinanceContractSafeDebriefDraft.body.required_fields.includes('SAFE_DEBRIEF_NOTE'),
    'Safe beta finance/contract debrief draft response must include required fields and no issues'
  );
  assert(
    Array.isArray(betaFinanceContractSafeDebriefDraft.body?.blocked_live_actions) &&
      betaFinanceContractSafeDebriefDraft.body.blocked_live_actions.includes('payment_charge') &&
      betaFinanceContractSafeDebriefDraft.body.blocked_live_actions.includes('loan_approval') &&
      betaFinanceContractSafeDebriefDraft.body.blocked_live_actions.includes('escrow_release') &&
      betaFinanceContractSafeDebriefDraft.body.blocked_live_actions.includes('signed_contract_creation') &&
      betaFinanceContractSafeDebriefDraft.body.blocked_live_actions.includes('xpr_signature') &&
      betaFinanceContractSafeDebriefDraft.body.blocked_live_actions.includes('provider_commitment') &&
      betaFinanceContractSafeDebriefDraft.body.blocked_live_actions.includes('legal_decision') &&
      betaFinanceContractSafeDebriefDraft.body.blocked_live_actions.includes('public_beta_flip') &&
      betaFinanceContractSafeDebriefDraft.body.blocked_live_actions.includes('production_release'),
    'Safe beta finance/contract debrief draft response must list blocked live actions'
  );

  const betaFinanceContractUnsafeDebriefDraft = await request(
    baseUrl,
    '/api/admin/beta-readiness/finance-contract-walkthrough/debrief/validate',
    {
      method: 'POST',
      headers: { 'X-Request-Id': 'gcsc-beta-finance-debrief-unsafe-smoke' },
      body: JSON.stringify({
        draft_text: [
          'Role: contractor tester',
          'Flow: starter loan',
          'Request ID: gcsc-beta-readiness-smoke',
          'SAFE_DEBRIEF_NOTE',
          'Tester says approve loan, charge card, release escrow, sign contract, use XPR signature, and paste service-role token.',
        ].join('\n'),
      }),
    }
  );
  assert(
    betaFinanceContractUnsafeDebriefDraft.status === 400,
    `Expected unsafe beta finance/contract debrief draft 400, got ${betaFinanceContractUnsafeDebriefDraft.status}`
  );
  assert(
    betaFinanceContractUnsafeDebriefDraft.headers.get('x-request-id') === 'gcsc-beta-finance-debrief-unsafe-smoke',
    'Unsafe beta finance/contract debrief draft response must echo a safe X-Request-Id header'
  );
  assert(
    betaFinanceContractUnsafeDebriefDraft.body?.request_id === 'gcsc-beta-finance-debrief-unsafe-smoke' &&
      betaFinanceContractUnsafeDebriefDraft.body?.mode === 'local_beta_finance_contract_debrief_validation' &&
      betaFinanceContractUnsafeDebriefDraft.body?.status === 'blocked_for_redaction',
    'Unsafe beta finance/contract debrief draft response must return blocked_for_redaction status'
  );
  assert(
    Array.isArray(betaFinanceContractUnsafeDebriefDraft.body?.issues) &&
      betaFinanceContractUnsafeDebriefDraft.body.issues.some((issue) => issue.id === 'secret_or_key_reference') &&
      betaFinanceContractUnsafeDebriefDraft.body.issues.some((issue) => issue.id === 'live_finance_or_contract_action'),
    'Unsafe beta finance/contract debrief draft response must flag secret references and live finance/contract wording'
  );
  assert(
    betaFinanceContractUnsafeDebriefDraft.body?.no_server_storage === true &&
      betaFinanceContractUnsafeDebriefDraft.body?.no_server_storage_attempted === true &&
      betaFinanceContractUnsafeDebriefDraft.body?.no_live_action_attempted === true,
    'Unsafe beta finance/contract debrief draft response must still confirm no server storage and no live action'
  );
  const betaFinanceContractOversizedDebriefDraft = await request(
    baseUrl,
    '/api/admin/beta-readiness/finance-contract-walkthrough/debrief/validate',
    {
      method: 'POST',
      headers: { 'X-Request-Id': 'gcsc-beta-finance-debrief-oversized-smoke' },
      body: JSON.stringify({
        draft_text: [
          'Role: homeowner tester',
          'Flow: payment router',
          'Checkpoints: Payment router checkpoint',
          'Request ID: gcsc-beta-readiness-smoke',
          'Boundary clarity rating: REVIEW',
          'Triage labels: none',
          'Safe issue handoff: trim oversized note',
          'Founder review hold: review',
          'SAFE_DEBRIEF_NOTE',
          'A'.repeat(4200),
        ].join('\n'),
      }),
    }
  );
  assert(
    betaFinanceContractOversizedDebriefDraft.status === 400,
    `Expected oversized beta finance/contract debrief draft 400, got ${betaFinanceContractOversizedDebriefDraft.status}`
  );
  assert(
    betaFinanceContractOversizedDebriefDraft.body?.request_id === 'gcsc-beta-finance-debrief-oversized-smoke' &&
      betaFinanceContractOversizedDebriefDraft.body?.mode === 'local_beta_finance_contract_debrief_validation' &&
      betaFinanceContractOversizedDebriefDraft.body?.status === 'input_limit_exceeded',
    'Oversized beta finance/contract debrief draft response must return input_limit_exceeded status'
  );
  assert(
    Array.isArray(betaFinanceContractOversizedDebriefDraft.body?.input_limit_warnings) &&
      betaFinanceContractOversizedDebriefDraft.body.input_limit_warnings.includes('draft_text_max_4000_exceeded') &&
      Array.isArray(betaFinanceContractOversizedDebriefDraft.body?.debrief_draft_recovery_actions) &&
      betaFinanceContractOversizedDebriefDraft.body.debrief_draft_recovery_actions.some((action) =>
        String(action.id || '').includes('trim_to_required_debrief_fields')
      ),
    'Oversized beta finance/contract debrief draft response must return input warnings and safe recovery actions'
  );
  assert(
    betaFinanceContractOversizedDebriefDraft.body?.no_server_storage === true &&
      betaFinanceContractOversizedDebriefDraft.body?.no_server_storage_attempted === true &&
      betaFinanceContractOversizedDebriefDraft.body?.no_live_action_attempted === true,
    'Oversized beta finance/contract debrief draft response must still confirm no server storage and no live action'
  );
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
  assert(
    betaReadiness.body?.founder_live_blocker_handoff_pack?.some((item) => item.includes('founder_live_blocker_handoff_pack')) &&
      betaReadiness.body.founder_live_blocker_handoff_pack.some((item) => item.includes('Auth/Admin blocker')) &&
      betaReadiness.body.founder_live_blocker_handoff_pack.some((item) => item.includes('Deploy blocker')) &&
      betaReadiness.body.founder_live_blocker_handoff_pack.some((item) => item.includes('Contract review next step')) &&
      betaReadiness.body.founder_live_blocker_handoff_pack.some((item) => item.includes('Beta invite blocker')),
    'Beta readiness must return founder_live_blocker_handoff_pack with founder blockers and contract review next steps'
  );
  assert(
    betaReadiness.body?.founder_evening_action_summary?.some((item) => item.includes('founder_evening_action_summary')) &&
      betaReadiness.body.founder_evening_action_summary.some((item) => item.includes('Magic Link login')) &&
      betaReadiness.body.founder_evening_action_summary.some((item) => item.includes('Profile/admin membership')) &&
      betaReadiness.body.founder_evening_action_summary.some((item) => item.includes('Contract review')) &&
      betaReadiness.body.founder_evening_action_summary.some((item) => item.includes('Public beta invite')) &&
      betaReadiness.body.founder_evening_action_summary.some((item) => item.includes('No live action approval')),
    'Beta readiness must return founder_evening_action_summary with copyable founder next actions'
  );
  assert(
    betaReadiness.body?.founder_evening_decision_matrix?.some((item) => item.label?.includes('Auth/Admin decision')) &&
      betaReadiness.body.founder_evening_decision_matrix.some((item) => item.label?.includes('Deploy/public URL decision')) &&
      betaReadiness.body.founder_evening_decision_matrix.some((item) => item.label?.includes('Contract review decision')) &&
      betaReadiness.body.founder_evening_decision_matrix.some((item) => item.label?.includes('Public beta invite decision')) &&
      betaReadiness.body.founder_evening_decision_matrix.some((item) => item.label?.includes('Legal/provider decision')) &&
      betaReadiness.body.founder_evening_decision_matrix.some((item) =>
        item.blocked_live_actions?.some((action) => action.includes('No live action approval'))
      ),
    'Beta readiness must return founder_evening_decision_matrix with founder decision gates and no-live boundary'
  );
  assert(
    betaReadiness.body?.founder_evening_command_board?.some((item) => item.label?.includes('Step 1 Auth/Admin evidence intake')) &&
      betaReadiness.body.founder_evening_command_board.some((item) => item.label?.includes('Step 2 Contract review scan')) &&
      betaReadiness.body.founder_evening_command_board.some((item) => item.label?.includes('Step 3 Deploy/public URL smoke intake')) &&
      betaReadiness.body.founder_evening_command_board.some((item) => item.label?.includes('Step 4 Public beta invite hold/review')) &&
      betaReadiness.body.founder_evening_command_board.some((item) => item.label?.includes('Step 5 Legal/provider question prep')) &&
      betaReadiness.body.founder_evening_command_board.some((item) =>
        item.blocked_live_actions?.some((action) => action.includes('No live command execution'))
      ),
    'Beta readiness must return founder_evening_command_board with ordered founder evening commands and no-live boundary'
  );
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
    disputeEvidenceReadiness.body?.dispute_review_action_queue?.some((item) => item.id === 'dispute_intake_packet_review'),
    'Dispute evidence readiness must include dispute intake packet review action'
  );
  assert(
    disputeEvidenceReadiness.body?.dispute_review_action_queue?.some((item) => item.id === 'evidence_redaction_packet_review'),
    'Dispute evidence readiness must include evidence redaction packet review action'
  );
  assert(
    disputeEvidenceReadiness.body?.dispute_review_action_queue?.some((item) => item.id === 'peer_review_packet_review'),
    'Dispute evidence readiness must include peer review packet review action'
  );
  assert(
    disputeEvidenceReadiness.body?.dispute_review_action_queue?.some((item) => item.id === 'legal_escrow_payment_gate_review'),
    'Dispute evidence readiness must include legal escrow payment gate review action'
  );
  assert(
    disputeEvidenceReadiness.body?.action_queue_summary?.blocked_for_live_count === disputeEvidenceReadiness.body?.dispute_review_action_queue?.length,
    'Dispute evidence readiness action queue summary must mark all actions blocked for live use'
  );
  assert(
    disputeEvidenceReadiness.body?.dispute_review_action_queue?.every((action) => action.action_live_status === 'BLOCKED_FOR_LIVE'),
    'Dispute evidence readiness action queue items must remain blocked for live use'
  );
  assert(
    disputeEvidenceReadiness.body?.public_beta_gate?.live_dispute_decision === 'blocked',
    'Dispute evidence readiness must block live dispute decisions'
  );
  assert(
    disputeEvidenceReadiness.body?.blocked_live_actions?.includes('release_escrow'),
    'Dispute evidence readiness must block escrow release'
  );

  const disputeEvidenceReviewPacket = await request(baseUrl, '/api/admin/dispute-evidence-readiness/review-packet', {
    headers: { 'X-Request-Id': 'gcsc-dispute-evidence-review-packet-smoke' },
  });
  assert(
    disputeEvidenceReviewPacket.status === 200,
    `Expected dispute evidence review packet 200, got ${disputeEvidenceReviewPacket.status}`
  );
  assert(
    disputeEvidenceReviewPacket.headers.get('x-request-id') === 'gcsc-dispute-evidence-review-packet-smoke',
    'Dispute evidence review packet must echo a safe X-Request-Id header'
  );
  assert(
    disputeEvidenceReviewPacket.body?.request_id === 'gcsc-dispute-evidence-review-packet-smoke',
    'Dispute evidence review packet must include request_id in the response body'
  );
  assert(
    disputeEvidenceReviewPacket.body?.mode === 'dispute_evidence_review_packet',
    'Dispute evidence review packet must expose dispute_evidence_review_packet mode'
  );
  assert(
    Array.isArray(disputeEvidenceReviewPacket.body?.packet_sections) &&
      disputeEvidenceReviewPacket.body.packet_sections.some((section) => section.id === 'dispute_review_action_queue') &&
      disputeEvidenceReviewPacket.body.packet_sections.some((section) => section.id === 'dispute_blocked_live_gate'),
    'Dispute evidence review packet must include action queue and blocked live gate sections'
  );
  assert(
    disputeEvidenceReviewPacket.body?.redaction_attestation?.secrets === 'blocked' &&
      disputeEvidenceReviewPacket.body?.review_packet_gate?.escrow_release === 'blocked' &&
      disputeEvidenceReviewPacket.body?.review_packet_gate?.provider_submission === 'blocked',
    'Dispute evidence review packet must block secrets, escrow release, and provider submission'
  );
  assert(
    typeof disputeEvidenceReviewPacket.body?.copyable_markdown === 'string' &&
      disputeEvidenceReviewPacket.body.copyable_markdown.includes('Dispute Evidence Review Packet'),
    'Dispute evidence review packet must include copyable markdown'
  );
  assert(
    disputeEvidenceReviewPacket.body?.no_server_storage_attempted === true &&
      disputeEvidenceReviewPacket.body?.no_dispute_review_packet_content_stored === true &&
      disputeEvidenceReviewPacket.body?.no_live_action_attempted === true,
    'Dispute evidence review packet must not store packet content or attempt live actions'
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
    milestoneEvidenceReadiness.body?.milestone_review_action_queue?.some((item) => item.id === 'scope_evidence_packet_review'),
    'Milestone evidence readiness must include scope evidence packet review action'
  );
  assert(
    milestoneEvidenceReadiness.body?.milestone_review_action_queue?.some((item) => item.id === 'visible_progress_packet_review'),
    'Milestone evidence readiness must include visible progress packet review action'
  );
  assert(
    milestoneEvidenceReadiness.body?.milestone_review_action_queue?.some((item) => item.id === 'payment_status_boundary_review'),
    'Milestone evidence readiness must include payment status boundary review action'
  );
  assert(
    milestoneEvidenceReadiness.body?.milestone_review_action_queue?.some((item) => item.id === 'escrow_release_gate_review'),
    'Milestone evidence readiness must include escrow release gate review action'
  );
  assert(
    milestoneEvidenceReadiness.body?.action_queue_summary?.blocked_for_live_count === milestoneEvidenceReadiness.body?.milestone_review_action_queue?.length,
    'Milestone evidence readiness action queue summary must mark all actions blocked for live use'
  );
  assert(
    milestoneEvidenceReadiness.body?.milestone_review_action_queue?.every((action) => action.action_live_status === 'BLOCKED_FOR_LIVE'),
    'Milestone evidence readiness action queue items must remain blocked for live use'
  );
  assert(
    milestoneEvidenceReadiness.body?.release_gate?.live_escrow_release === 'blocked',
    'Milestone evidence readiness must block live escrow release'
  );
  assert(
    milestoneEvidenceReadiness.body?.blocked_live_actions?.includes('move_payment'),
    'Milestone evidence readiness must block payment movement'
  );

  const milestoneEvidenceReviewPacket = await request(baseUrl, '/api/admin/milestone-evidence-readiness/review-packet', {
    headers: { 'X-Request-Id': 'gcsc-milestone-evidence-review-packet-smoke' },
  });
  assert(
    milestoneEvidenceReviewPacket.status === 200,
    `Expected milestone evidence review packet 200, got ${milestoneEvidenceReviewPacket.status}`
  );
  assert(
    milestoneEvidenceReviewPacket.headers.get('x-request-id') === 'gcsc-milestone-evidence-review-packet-smoke',
    'Milestone evidence review packet must echo a safe X-Request-Id header'
  );
  assert(
    milestoneEvidenceReviewPacket.body?.request_id === 'gcsc-milestone-evidence-review-packet-smoke',
    'Milestone evidence review packet must include request_id in the response body'
  );
  assert(
    milestoneEvidenceReviewPacket.body?.mode === 'milestone_evidence_review_packet',
    'Milestone evidence review packet must expose milestone_evidence_review_packet mode'
  );
  assert(
    Array.isArray(milestoneEvidenceReviewPacket.body?.packet_sections) &&
      milestoneEvidenceReviewPacket.body.packet_sections.some((section) => section.id === 'milestone_review_action_queue') &&
      milestoneEvidenceReviewPacket.body.packet_sections.some((section) => section.id === 'milestone_blocked_live_gate'),
    'Milestone evidence review packet must include action queue and blocked live gate sections'
  );
  assert(
    milestoneEvidenceReviewPacket.body?.redaction_attestation?.secrets === 'blocked' &&
      milestoneEvidenceReviewPacket.body?.review_packet_gate?.escrow_release === 'blocked' &&
      milestoneEvidenceReviewPacket.body?.review_packet_gate?.provider_submission === 'blocked',
    'Milestone evidence review packet must block secrets, escrow release, and provider submission'
  );
  assert(
    typeof milestoneEvidenceReviewPacket.body?.copyable_markdown === 'string' &&
      milestoneEvidenceReviewPacket.body.copyable_markdown.includes('Milestone Evidence Review Packet'),
    'Milestone evidence review packet must include copyable markdown'
  );
  assert(
    milestoneEvidenceReviewPacket.body?.no_server_storage_attempted === true &&
      milestoneEvidenceReviewPacket.body?.no_milestone_review_packet_content_stored === true &&
      milestoneEvidenceReviewPacket.body?.no_live_action_attempted === true,
    'Milestone evidence review packet must not store packet content or attempt live actions'
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
  assert(
    Array.isArray(workingCapitalReadiness.body?.working_capital_review_action_queue) &&
      workingCapitalReadiness.body.working_capital_review_action_queue.some((action) => action.id === 'identity_packet_review') &&
      workingCapitalReadiness.body.working_capital_review_action_queue.some((action) => action.id === 'repayment_waterfall_packet_review') &&
      workingCapitalReadiness.body.working_capital_review_action_queue.some((action) => action.id === 'funding_gate_review'),
    'Working capital readiness must return a local review action queue for identity, repayment waterfall, and funding gates'
  );
  assert(
    workingCapitalReadiness.body.working_capital_review_action_queue.every((action) =>
      action.action_live_status === 'BLOCKED_FOR_LIVE' &&
      Array.isArray(action.required_evidence) &&
      Array.isArray(action.blocked_live_actions)
    ),
    'Working capital review action queue must keep every action BLOCKED_FOR_LIVE with evidence and blocked-action metadata'
  );
  assert(
    Array.isArray(workingCapitalReadiness.body?.working_capital_repayment_waterfall_board) &&
      workingCapitalReadiness.body.working_capital_repayment_waterfall_board.some((item) => item.label === 'Contractor identity gate') &&
      workingCapitalReadiness.body.working_capital_repayment_waterfall_board.some((item) => item.label === 'Signed project contract gate') &&
      workingCapitalReadiness.body.working_capital_repayment_waterfall_board.some((item) => item.label === 'Milestone evidence gate') &&
      workingCapitalReadiness.body.working_capital_repayment_waterfall_board.some((item) => item.label === 'Repayment waterfall gate') &&
      workingCapitalReadiness.body.working_capital_repayment_waterfall_board.some((item) => item.label === 'Funding gate') &&
      workingCapitalReadiness.body.working_capital_repayment_waterfall_board.some((item) => item.board_state === 'BLOCKED_FOR_LIVE') &&
      workingCapitalReadiness.body.working_capital_repayment_waterfall_board.some((item) => item.blocked_live_actions?.includes('route_repayment')),
    'Working capital readiness must return working_capital_repayment_waterfall_board with local repayment gates and route_repayment blocked'
  );

  const workingCapitalReviewPacket = await request(baseUrl, '/api/admin/working-capital-readiness/review-packet', {
    headers: { 'X-Request-Id': 'gcsc-working-capital-review-packet-smoke' },
  });
  assert(
    workingCapitalReviewPacket.status === 200,
    `Expected working capital review packet 200, got ${workingCapitalReviewPacket.status}`
  );
  assert(
    workingCapitalReviewPacket.headers.get('x-request-id') === 'gcsc-working-capital-review-packet-smoke',
    'Working capital review packet must echo a safe X-Request-Id header'
  );
  assert(
    workingCapitalReviewPacket.body?.request_id === 'gcsc-working-capital-review-packet-smoke',
    'Working capital review packet must include request_id in the response body'
  );
  assert(
    workingCapitalReviewPacket.body?.mode === 'working_capital_review_packet',
    'Working capital review packet must expose working_capital_review_packet mode'
  );
  assert(
    Array.isArray(workingCapitalReviewPacket.body?.packet_sections) &&
      workingCapitalReviewPacket.body.packet_sections.some((section) => section.id === 'working_capital_review_action_queue') &&
      workingCapitalReviewPacket.body.packet_sections.some((section) => section.id === 'working_capital_blocked_live_gate'),
    'Working capital review packet must include action queue and blocked live gate sections'
  );
  assert(
    workingCapitalReviewPacket.body?.redaction_attestation?.secrets === 'blocked' &&
      workingCapitalReviewPacket.body?.review_packet_gate?.credit_approval === 'blocked' &&
      workingCapitalReviewPacket.body?.review_packet_gate?.provider_submission === 'blocked',
    'Working capital review packet must block secrets, credit approval, and provider submission'
  );
  assert(
    typeof workingCapitalReviewPacket.body?.copyable_markdown === 'string' &&
      workingCapitalReviewPacket.body.copyable_markdown.includes('Working Capital Review Packet'),
    'Working capital review packet must include copyable markdown'
  );
  assert(
    workingCapitalReviewPacket.body?.no_server_storage_attempted === true &&
      workingCapitalReviewPacket.body?.no_review_packet_content_stored === true &&
      workingCapitalReviewPacket.body?.no_live_action_attempted === true,
    'Working capital review packet must not store packet content or attempt live actions'
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
    contractorReputationReadiness.body?.reputation_review_action_queue?.some((item) => item.id === 'reputation_signal_packet_review'),
    'Contractor reputation readiness must include reputation signal packet review action'
  );
  assert(
    contractorReputationReadiness.body?.reputation_review_action_queue?.some((item) => item.id === 'moderation_appeal_packet_review'),
    'Contractor reputation readiness must include moderation and appeal packet review action'
  );
  assert(
    contractorReputationReadiness.body?.reputation_review_action_queue?.some((item) => item.id === 'credit_boundary_packet_review'),
    'Contractor reputation readiness must include credit boundary packet review action'
  );
  assert(
    contractorReputationReadiness.body?.reputation_review_action_queue?.some((item) => item.id === 'public_score_gate_review'),
    'Contractor reputation readiness must include public score gate review action'
  );
  assert(
    contractorReputationReadiness.body?.action_queue_summary?.blocked_for_live_count === contractorReputationReadiness.body?.reputation_review_action_queue?.length,
    'Contractor reputation readiness action queue items must remain blocked for live use'
  );
  assert(
    contractorReputationReadiness.body?.reputation_gate?.public_reputation_score === 'blocked',
    'Contractor reputation readiness must block public reputation score'
  );
  assert(
    contractorReputationReadiness.body?.blocked_live_actions?.includes('publish_reputation_score'),
    'Contractor reputation readiness must block publishing reputation score'
  );
  assert(
    Array.isArray(contractorReputationReadiness.body?.contractor_reputation_public_score_board) &&
      contractorReputationReadiness.body.contractor_reputation_public_score_board.some((item) => item.label === 'Signal ownership gate') &&
      contractorReputationReadiness.body.contractor_reputation_public_score_board.some((item) => item.label === 'Privacy and moderation gate') &&
      contractorReputationReadiness.body.contractor_reputation_public_score_board.some((item) => item.label === 'Credit use boundary gate') &&
      contractorReputationReadiness.body.contractor_reputation_public_score_board.some((item) => item.label === 'Lead routing gate') &&
      contractorReputationReadiness.body.contractor_reputation_public_score_board.some((item) => item.label === 'Public score release gate') &&
      contractorReputationReadiness.body.contractor_reputation_public_score_board.some((item) => item.board_state === 'BLOCKED_FOR_LIVE') &&
      contractorReputationReadiness.body.contractor_reputation_public_score_board.some((item) => item.blocked_live_actions?.includes('publish_reputation_score')) &&
      contractorReputationReadiness.body.contractor_reputation_public_score_board.some((item) => item.blocked_live_actions?.includes('rank_contractors_publicly')),
    'Contractor reputation readiness must return contractor_reputation_public_score_board with public score, ranking, and lead-routing gates blocked'
  );

  const contractorReputationReviewPacket = await request(baseUrl, '/api/admin/contractor-reputation-readiness/review-packet', {
    headers: { 'X-Request-Id': 'gcsc-contractor-reputation-review-packet-smoke' },
  });
  assert(
    contractorReputationReviewPacket.status === 200,
    `Expected contractor reputation review packet 200, got ${contractorReputationReviewPacket.status}`
  );
  assert(
    contractorReputationReviewPacket.headers.get('x-request-id') === 'gcsc-contractor-reputation-review-packet-smoke',
    'Contractor reputation review packet must echo a safe X-Request-Id header'
  );
  assert(
    contractorReputationReviewPacket.body?.request_id === 'gcsc-contractor-reputation-review-packet-smoke',
    'Contractor reputation review packet must include request_id in the response body'
  );
  assert(
    contractorReputationReviewPacket.body?.mode === 'contractor_reputation_review_packet',
    'Contractor reputation review packet must expose contractor_reputation_review_packet mode'
  );
  assert(
    Array.isArray(contractorReputationReviewPacket.body?.packet_sections) &&
      contractorReputationReviewPacket.body.packet_sections.some((section) => section.id === 'contractor_reputation_review_action_queue') &&
      contractorReputationReviewPacket.body.packet_sections.some((section) => section.id === 'contractor_reputation_blocked_live_gate'),
    'Contractor reputation review packet must include action queue and blocked live gate sections'
  );
  assert(
    contractorReputationReviewPacket.body?.redaction_attestation?.secrets === 'blocked' &&
      contractorReputationReviewPacket.body?.review_packet_gate?.public_reputation_score === 'blocked' &&
      contractorReputationReviewPacket.body?.review_packet_gate?.lead_routing_priority === 'blocked',
    'Contractor reputation review packet must block secrets, public reputation score, and lead routing'
  );
  assert(
    typeof contractorReputationReviewPacket.body?.copyable_markdown === 'string' &&
      contractorReputationReviewPacket.body.copyable_markdown.includes('Contractor Reputation Review Packet'),
    'Contractor reputation review packet must include copyable markdown'
  );
  assert(
    contractorReputationReviewPacket.body?.no_server_storage_attempted === true &&
      contractorReputationReviewPacket.body?.no_contractor_reputation_review_packet_content_stored === true &&
      contractorReputationReviewPacket.body?.no_live_action_attempted === true,
    'Contractor reputation review packet must not store packet content or attempt live actions'
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
    contractorVerificationReadiness.body?.verification_review_action_queue?.some((item) => item.id === 'license_packet_review'),
    'Contractor verification readiness must include license packet review action'
  );
  assert(
    contractorVerificationReadiness.body?.verification_review_action_queue?.some((item) => item.id === 'insurance_packet_review'),
    'Contractor verification readiness must include insurance packet review action'
  );
  assert(
    contractorVerificationReadiness.body?.verification_review_action_queue?.some((item) => item.id === 'business_identity_packet_review'),
    'Contractor verification readiness must include business identity packet review action'
  );
  assert(
    contractorVerificationReadiness.body?.verification_review_action_queue?.some((item) => item.id === 'provider_boundary_packet_review'),
    'Contractor verification readiness must include provider boundary packet review action'
  );
  assert(
    contractorVerificationReadiness.body?.verification_review_action_queue?.some((item) => item.id === 'eligibility_gate_review'),
    'Contractor verification readiness must include eligibility gate review action'
  );
  assert(
    contractorVerificationReadiness.body?.action_queue_summary?.blocked_for_live_count === contractorVerificationReadiness.body?.verification_review_action_queue?.length,
    'Contractor verification readiness action queue summary must mark all actions blocked for live use'
  );
  assert(
    contractorVerificationReadiness.body?.verification_review_action_queue?.every((action) => action.action_live_status === 'BLOCKED_FOR_LIVE'),
    'Contractor verification readiness action queue items must remain blocked for live use'
  );
  assert(
    contractorVerificationReadiness.body?.verification_gate?.live_license_verification === 'blocked',
    'Contractor verification readiness must block live license verification'
  );
  assert(
    contractorVerificationReadiness.body?.blocked_live_actions?.includes('verify_contractor_live'),
    'Contractor verification readiness must block live contractor verification'
  );
  assert(
    Array.isArray(contractorVerificationReadiness.body?.contractor_verification_eligibility_board) &&
      contractorVerificationReadiness.body.contractor_verification_eligibility_board.some((item) => item.label === 'License evidence gate') &&
      contractorVerificationReadiness.body.contractor_verification_eligibility_board.some((item) => item.label === 'Insurance evidence gate') &&
      contractorVerificationReadiness.body.contractor_verification_eligibility_board.some((item) => item.label === 'Business identity gate') &&
      contractorVerificationReadiness.body.contractor_verification_eligibility_board.some((item) => item.label === 'Provider lookup gate') &&
      contractorVerificationReadiness.body.contractor_verification_eligibility_board.some((item) => item.label === 'Eligibility/Auth/RLS gate') &&
      contractorVerificationReadiness.body.contractor_verification_eligibility_board.some((item) => item.board_state === 'BLOCKED_FOR_LIVE') &&
      contractorVerificationReadiness.body.contractor_verification_eligibility_board.some((item) => item.blocked_live_actions?.includes('verify_contractor_live')) &&
      contractorVerificationReadiness.body.contractor_verification_eligibility_board.some((item) => item.blocked_live_actions?.includes('run_kyb_kyc_lookup')) &&
      contractorVerificationReadiness.body.contractor_verification_eligibility_board.some((item) => item.blocked_live_actions?.includes('change_auth_role')),
    'Contractor verification readiness must return contractor_verification_eligibility_board with live verification, KYB/KYC, and Auth/RLS gates blocked'
  );

  const contractorVerificationReviewPacket = await request(baseUrl, '/api/admin/contractor-verification-readiness/review-packet', {
    headers: { 'X-Request-Id': 'gcsc-contractor-verification-review-packet-smoke' },
  });
  assert(
    contractorVerificationReviewPacket.status === 200,
    `Expected contractor verification review packet 200, got ${contractorVerificationReviewPacket.status}`
  );
  assert(
    contractorVerificationReviewPacket.headers.get('x-request-id') === 'gcsc-contractor-verification-review-packet-smoke',
    'Contractor verification review packet must echo a safe X-Request-Id header'
  );
  assert(
    contractorVerificationReviewPacket.body?.request_id === 'gcsc-contractor-verification-review-packet-smoke',
    'Contractor verification review packet must include request_id in the response body'
  );
  assert(
    contractorVerificationReviewPacket.body?.mode === 'contractor_verification_review_packet',
    'Contractor verification review packet must expose contractor_verification_review_packet mode'
  );
  assert(
    Array.isArray(contractorVerificationReviewPacket.body?.packet_sections) &&
      contractorVerificationReviewPacket.body.packet_sections.some((section) => section.id === 'contractor_verification_review_action_queue') &&
      contractorVerificationReviewPacket.body.packet_sections.some((section) => section.id === 'contractor_verification_blocked_live_gate'),
    'Contractor verification review packet must include action queue and blocked live gate sections'
  );
  assert(
    contractorVerificationReviewPacket.body?.redaction_attestation?.secrets === 'blocked' &&
      contractorVerificationReviewPacket.body?.review_packet_gate?.provider_submission === 'blocked' &&
      contractorVerificationReviewPacket.body?.review_packet_gate?.eligibility_decision === 'blocked',
    'Contractor verification review packet must block secrets, provider submission, and eligibility decisions'
  );
  assert(
    typeof contractorVerificationReviewPacket.body?.copyable_markdown === 'string' &&
      contractorVerificationReviewPacket.body.copyable_markdown.includes('Contractor Verification Review Packet'),
    'Contractor verification review packet must include copyable markdown'
  );
  assert(
    contractorVerificationReviewPacket.body?.no_server_storage_attempted === true &&
      contractorVerificationReviewPacket.body?.no_contractor_verification_review_packet_content_stored === true &&
      contractorVerificationReviewPacket.body?.no_live_action_attempted === true,
    'Contractor verification review packet must not store packet content or attempt live actions'
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
    adminReadinessOverview.body?.no_live_action_attempted === true,
    'Admin readiness overview success must not attempt live actions'
  );
  assert(
    adminReadinessOverview.body?.blocked_live_actions?.includes('provider_commitment'),
    'Admin readiness overview must block provider commitment'
  );
  assert(
    Array.isArray(adminReadinessOverview.body?.review_action_queue_rollup) &&
      adminReadinessOverview.body.review_action_queue_rollup.some((action) =>
        action.surface_id === 'working_capital' &&
        action.action_id === 'funding_gate_review' &&
        action.action_live_status === 'BLOCKED_FOR_LIVE'
      ),
    'Admin readiness overview must roll up working capital funding gate review actions as BLOCKED_FOR_LIVE'
  );
  assert(
    Array.isArray(adminReadinessOverview.body?.review_action_queue_rollup) &&
      adminReadinessOverview.body.review_action_queue_rollup.some((action) =>
        action.surface_id === 'dispute_evidence' &&
        action.action_id === 'legal_escrow_payment_gate_review' &&
        action.action_live_status === 'BLOCKED_FOR_LIVE'
      ),
    'Admin readiness overview must roll up dispute evidence legal escrow payment gate review actions as BLOCKED_FOR_LIVE'
  );
  assert(
    adminReadinessOverview.body?.summary?.review_action_queue_count >= 5 &&
      adminReadinessOverview.body?.summary?.blocked_review_action_queue_count >= 5,
    'Admin readiness overview summary must count blocked review action queue items'
  );
  assert(
    adminReadinessOverview.body?.readiness_surfaces?.some((surface) =>
      surface.id === 'working_capital' &&
      surface.review_action_queue_count >= 5 &&
      surface.blocked_review_action_queue_count >= 5
    ),
    'Admin readiness overview working capital surface must expose review action queue counts'
  );

  const adminReadinessOverviewReviewPacket = await request(baseUrl, '/api/admin/readiness-overview/review-packet?surface_filter=all_readiness_surfaces', {
    headers: { 'X-Request-Id': 'gcsc-admin-readiness-overview-review-packet-smoke' },
  });
  assert(
    adminReadinessOverviewReviewPacket.status === 200,
    `Expected admin readiness overview review packet 200, got ${adminReadinessOverviewReviewPacket.status}`
  );
  assert(
    adminReadinessOverviewReviewPacket.headers.get('x-request-id') === 'gcsc-admin-readiness-overview-review-packet-smoke',
    'Admin readiness overview review packet must echo a safe X-Request-Id header'
  );
  assert(
    adminReadinessOverviewReviewPacket.body?.request_id === 'gcsc-admin-readiness-overview-review-packet-smoke',
    'Admin readiness overview review packet must include request_id in the response body'
  );
  assert(
    adminReadinessOverviewReviewPacket.body?.mode === 'admin_readiness_overview_review_packet',
    'Admin readiness overview review packet must expose admin_readiness_overview_review_packet mode'
  );
  assert(
    Array.isArray(adminReadinessOverviewReviewPacket.body?.packet_sections) &&
      adminReadinessOverviewReviewPacket.body.packet_sections.some((section) => section.id === 'readiness_overview_surface_index') &&
      adminReadinessOverviewReviewPacket.body.packet_sections.some((section) => section.id === 'readiness_overview_review_action_queue_rollup') &&
      adminReadinessOverviewReviewPacket.body.packet_sections.some((section) => section.id === 'readiness_overview_blocked_live_gate'),
    'Admin readiness overview review packet must include surface index, action queue rollup, and blocked live gate sections'
  );
  assert(
    adminReadinessOverviewReviewPacket.body?.redaction_attestation?.secrets === 'blocked' &&
      adminReadinessOverviewReviewPacket.body?.review_packet_gate?.provider_legal_money_boundary === 'blocked' &&
      adminReadinessOverviewReviewPacket.body?.review_packet_gate?.live_money_actions === 'blocked',
    'Admin readiness overview review packet must block secrets, provider/legal/money, and live money actions'
  );
  assert(
    typeof adminReadinessOverviewReviewPacket.body?.copyable_markdown === 'string' &&
      adminReadinessOverviewReviewPacket.body.copyable_markdown.includes('Admin Readiness Overview Review Packet'),
    'Admin readiness overview review packet must include copyable markdown'
  );
  assert(
    adminReadinessOverviewReviewPacket.body?.no_server_storage_attempted === true &&
      adminReadinessOverviewReviewPacket.body?.no_admin_readiness_overview_review_packet_content_stored === true &&
      adminReadinessOverviewReviewPacket.body?.no_live_action_attempted === true,
    'Admin readiness overview review packet must not store packet content or attempt live actions'
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
  assert(
    filteredAdminReadinessOverview.body?.no_live_action_attempted === true,
    'Filtered admin readiness overview success must not attempt live actions'
  );
  assert(
    filteredAdminReadinessOverview.body?.summary?.review_action_queue_count === 5 &&
      filteredAdminReadinessOverview.body?.summary?.blocked_review_action_queue_count === 5,
    'Filtered working capital readiness overview must count exactly five blocked review actions'
  );
  assert(
    filteredAdminReadinessOverview.body?.review_action_queue_rollup?.every((action) =>
      action.surface_id === 'working_capital' &&
      action.action_live_status === 'BLOCKED_FOR_LIVE' &&
      Array.isArray(action.blocked_live_actions)
    ),
    'Filtered working capital readiness overview queue rollup must stay working-capital-only and BLOCKED_FOR_LIVE'
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

  const providerEvidenceReviewChain = await request(baseUrl, '/api/admin/provider-evidence-review-chain?surface_filter=contractor_verification', {
    headers: { 'X-Request-Id': 'gcsc-provider-evidence-review-chain-smoke' },
  });
  assert(
    providerEvidenceReviewChain.status === 200,
    `Expected provider evidence review chain 200, got ${providerEvidenceReviewChain.status}`
  );
  assert(
    providerEvidenceReviewChain.headers.get('x-request-id') === 'gcsc-provider-evidence-review-chain-smoke',
    'Provider evidence review chain must echo a safe X-Request-Id header'
  );
  assert(
    providerEvidenceReviewChain.body?.request_id === 'gcsc-provider-evidence-review-chain-smoke',
    'Provider evidence review chain must include request_id in the response body'
  );
  assert(
    providerEvidenceReviewChain.body?.mode === 'provider_evidence_review_chain',
    'Provider evidence review chain must expose provider_evidence_review_chain mode'
  );
  assert(
    providerEvidenceReviewChain.body?.selected_readiness_surface_filter?.id === 'contractor_verification',
    'Provider evidence review chain must select contractor_verification filter'
  );
  assert(
    providerEvidenceReviewChain.body?.chain_steps?.some((item) => item.id === 'provider_evidence_packet'),
    'Provider evidence review chain must include provider evidence packet chain step'
  );
  assert(
    providerEvidenceReviewChain.body?.chain_steps?.some((item) => item.id === 'provider_evidence_packet_print_template'),
    'Provider evidence review chain must include provider print template chain step'
  );
  assert(
    providerEvidenceReviewChain.body?.chain_steps?.some((item) => item.id === 'provider_evidence_packet_redaction_qa'),
    'Provider evidence review chain must include provider redaction QA chain step'
  );
  assert(
    providerEvidenceReviewChain.body?.review_gate?.provider_submission === 'blocked',
    'Provider evidence review chain must block provider submission'
  );
  assert(
    providerEvidenceReviewChain.body?.no_server_storage_attempted === true,
    'Provider evidence review chain must not attempt server storage'
  );
  assert(
    providerEvidenceReviewChain.body?.no_live_action_attempted === true,
    'Provider evidence review chain must not attempt live actions'
  );

  const invalidProviderEvidenceReviewChainFilter = await request(baseUrl, '/api/admin/provider-evidence-review-chain?surface_filter=live_provider_submission', {
    headers: { 'X-Request-Id': 'gcsc-provider-evidence-review-chain-invalid-filter-smoke' },
  });
  assert(
    invalidProviderEvidenceReviewChainFilter.status === 400,
    `Expected provider_evidence_review_chain_filter_invalid 400, got ${invalidProviderEvidenceReviewChainFilter.status}`
  );
  assert(
    invalidProviderEvidenceReviewChainFilter.body?.status === 'provider_evidence_review_chain_filter_invalid',
    'Invalid provider evidence review chain filter must use provider_evidence_review_chain_filter_invalid status'
  );
  assert(
    invalidProviderEvidenceReviewChainFilter.body?.error === 'Unsupported provider evidence review chain surface_filter',
    'Invalid provider evidence review chain filter must return unsupported surface_filter error'
  );
  assert(
    invalidProviderEvidenceReviewChainFilter.body?.no_server_storage_attempted === true,
    'Invalid provider evidence review chain filter must not attempt server storage'
  );
  assert(
    invalidProviderEvidenceReviewChainFilter.body?.no_live_action_attempted === true,
    'Invalid provider evidence review chain filter must not attempt live actions'
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
      smart_contract_local_replay_dry_run: localReplayDryRun.status,
      smart_contract_local_replay_dry_run_filter_invalid: localReplayDryRunInvalid.status,
      smart_contract_local_replay_dry_run_evidence_packet: localReplayDryRunEvidencePacket.status,
      smart_contract_local_replay_dry_run_evidence_packet_filter_invalid: localReplayDryRunEvidencePacketInvalid.status,
      smart_contract_review_workbench: smartContractReviewWorkbench.status,
      smart_contract_review_workbench_filter_invalid: smartContractReviewWorkbenchInvalid.status,
      smart_contract_review_workbench_handoff_summary: smartContractReviewWorkbenchHandoffSummary.status,
      smart_contract_review_workbench_handoff_summary_filter_invalid: smartContractReviewWorkbenchHandoffSummaryInvalid.status,
      smart_contract_review_workbench_gate_matrix: smartContractReviewWorkbenchGateMatrix.status,
      smart_contract_review_workbench_gate_matrix_filtered: smartContractReviewWorkbenchGateMatrixFiltered.status,
      smart_contract_review_workbench_gate_matrix_filter_invalid: smartContractReviewWorkbenchGateMatrixInvalid.status,
      smart_contract_review_workbench_gate_matrix_route_set_checked:
        smartContractReviewWorkbenchGateMatrixRouteSet.smart_contract_review_workbench_gate_matrix_route_set_checked,
      smart_contract_review_workbench_gate_matrix_route_set_first_filter:
        smartContractReviewWorkbenchGateMatrixRouteSet.smart_contract_review_workbench_gate_matrix_route_set_first_filter,
      smart_contract_review_workbench_gate_matrix_filtered_route_set_checked:
        smartContractReviewWorkbenchGateMatrixFilteredRouteSet.smart_contract_review_workbench_gate_matrix_route_set_checked,
      smart_contract_review_workbench_gate_matrix_filtered_route_set_first_filter:
        smartContractReviewWorkbenchGateMatrixFilteredRouteSet.smart_contract_review_workbench_gate_matrix_route_set_first_filter,
      smart_contract_review_workbench_gate_matrix_route_set_summary_checked:
        smartContractReviewWorkbenchGateMatrixRouteSetSummary.smart_contract_review_workbench_gate_matrix_route_set_summary_checked,
      smart_contract_review_workbench_gate_matrix_route_set_summary_count:
        smartContractReviewWorkbenchGateMatrixRouteSetSummary.smart_contract_review_workbench_gate_matrix_route_set_summary_count,
      smart_contract_review_workbench_gate_matrix_filtered_route_set_summary_checked:
        smartContractReviewWorkbenchGateMatrixFilteredRouteSetSummary.smart_contract_review_workbench_gate_matrix_route_set_summary_checked,
      smart_contract_review_workbench_gate_matrix_filtered_route_set_summary_count:
        smartContractReviewWorkbenchGateMatrixFilteredRouteSetSummary.smart_contract_review_workbench_gate_matrix_route_set_summary_count,
    },
    optional_real_session: optionalRealSession,
  }, null, 2));
} finally {
  server.close();
}
