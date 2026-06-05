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
    "app.get('/api/admin/week-two-mobile-release-readiness'",
    "app.get('/api/admin/beta-readiness'",
    "app.get('/api/admin/payment-intent-ownership-readiness'",
    'paymentIntentOwnershipReadinessItems',
    'payment_intent_ownership_readiness',
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
  assert(health.body?.features?.includes('founder-auth-next-step-readiness'), 'Health must advertise founder-auth-next-step-readiness');
  assert(
    health.body?.features?.includes('week-two-auth-admin-execution-checklist'),
    'Health must advertise week-two-auth-admin-execution-checklist'
  );
  assert(health.body?.features?.includes('deployment-next-step-readiness'), 'Health must advertise deployment-next-step-readiness');
  assert(
    health.body?.features?.includes('week-two-deployment-public-beta-execution-checklist'),
    'Health must advertise week-two-deployment-public-beta-execution-checklist'
  );
  assert(health.body?.features?.includes('week-two-legal-provider-readiness'), 'Health must advertise week-two-legal-provider-readiness');
  assert(
    health.body?.features?.includes('week-two-legal-provider-execution-checklist'),
    'Health must advertise week-two-legal-provider-execution-checklist'
  );
  assert(health.body?.features?.includes('week-two-investor-founder-package-alignment'), 'Health must advertise week-two-investor-founder-package-alignment');
  assert(
    health.body?.features?.includes('week-two-investor-founder-package-execution-checklist'),
    'Health must advertise week-two-investor-founder-package-execution-checklist'
  );
  assert(
    health.body?.features?.includes('payment-intent-ownership-readiness'),
    'Health must advertise payment-intent-ownership-readiness'
  );
  assert(
    health.body?.features?.includes('week-two-local-validation-pass-readiness'),
    'Health must advertise week-two-local-validation-pass-readiness'
  );
  assert(
    health.body?.features?.includes('week-two-local-validation-pass-execution-checklist'),
    'Health must advertise week-two-local-validation-pass-execution-checklist'
  );
  assert(
    health.body?.features?.includes('week-two-two-week-closeout-readiness'),
    'Health must advertise week-two-two-week-closeout-readiness'
  );
  assert(health.body?.features?.includes('legal-provider-next-step-readiness'), 'Health must advertise legal-provider-next-step-readiness');
  assert(health.body?.features?.includes('public-beta-next-step-readiness'), 'Health must advertise public-beta-next-step-readiness');
  assert(
    health.body?.features?.includes('public-beta-next-step-execution-checklist'),
    'Health must advertise public-beta-next-step-execution-checklist'
  );
  assert(health.body?.features?.includes('founder-auth-setup'), 'Health must advertise founder-auth-setup');
  assert(health.body?.features?.includes('supabase-service-role-boundary'), 'Health must advertise supabase-service-role-boundary');
  assert(health.body?.features?.includes('protected-route-gate'), 'Health must advertise protected-route-gate');
  assert(health.body?.features?.includes('mobile-install-readiness'), 'Health must advertise mobile-install-readiness');
  assert(health.body?.features?.includes('week-two-mobile-release-readiness'), 'Health must advertise week-two-mobile-release-readiness');
  assert(
    health.body?.features?.includes('week-two-mobile-release-execution-checklist'),
    'Health must advertise week-two-mobile-release-execution-checklist'
  );
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
  assert(
    Array.isArray(founderActions.body?.week_two_founder_action_board),
    'Founder Action Center must return week_two_founder_action_board array'
  );
  const weekTwoFounderActionIds = founderActions.body.week_two_founder_action_board.map((item) => item.id);
  const weekTwoFounderActionPhases = founderActions.body.week_two_founder_action_board.map((item) => item.phase);
  const weekTwoFounderActionStatuses = founderActions.body.week_two_founder_action_board.map((item) => item.status);
  const weekTwoFounderPhaseOptionIds = (founderActions.body.week_two_phase_options || []).map((item) => item.id);
  const weekTwoFounderBlockedActions = founderActions.body.week_two_founder_action_board.flatMap((item) =>
    Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
  );
  assert(
    weekTwoFounderActionIds.includes('week_two_auth_admin_evidence') &&
      weekTwoFounderActionIds.includes('week_two_deployment_public_beta_prep') &&
      weekTwoFounderActionIds.includes('week_two_legal_provider_questions') &&
      weekTwoFounderActionIds.includes('week_two_investor_packet_claim_review') &&
      weekTwoFounderActionIds.includes('week_two_mobile_release_blocker_scan'),
    'Founder Action Center Week 2 board must include Auth/Admin, deploy/public beta, legal/provider, investor, and mobile items'
  );
  assert(
    weekTwoFounderActionPhases.includes('auth_admin') &&
      weekTwoFounderActionPhases.includes('deployment_public_beta') &&
      weekTwoFounderActionPhases.includes('legal_provider') &&
      weekTwoFounderActionPhases.includes('investor_founder_package') &&
      weekTwoFounderActionPhases.includes('mobile_release'),
    'Founder Action Center Week 2 board must expose expected phase routing'
  );
  assert(
    weekTwoFounderActionStatuses.includes('blocked') && weekTwoFounderActionStatuses.includes('review'),
    'Founder Action Center Week 2 board must keep blocked and review states visible'
  );
  assert(
    weekTwoFounderPhaseOptionIds.includes('all_week_two_phases') &&
      weekTwoFounderPhaseOptionIds.includes('auth_admin') &&
      weekTwoFounderPhaseOptionIds.includes('deployment_public_beta') &&
      weekTwoFounderPhaseOptionIds.includes('legal_provider') &&
      weekTwoFounderPhaseOptionIds.includes('investor_founder_package') &&
      weekTwoFounderPhaseOptionIds.includes('mobile_release') &&
      founderActions.body.week_two_phase_options.every((item) => item.live_action_status === 'BLOCKED_FOR_LIVE'),
    'Founder Action Center Week 2 board must expose local-only phase filter options'
  );
  assert(
    weekTwoFounderBlockedActions.includes('admin_memberships_insert') &&
      weekTwoFounderBlockedActions.includes('vercel_import') &&
      weekTwoFounderBlockedActions.includes('legal_conclusion') &&
      weekTwoFounderBlockedActions.includes('investor_outreach') &&
      weekTwoFounderBlockedActions.includes('app_store_submission'),
    'Founder Action Center Week 2 board must keep live Auth/Admin, deploy, legal/provider, investor, and mobile actions blocked'
  );
  assert(
    founderActions.body?.week_two_phase_counts?.auth_admin === 1 &&
      founderActions.body?.week_two_status_counts?.blocked >= 2 &&
      founderActions.body?.week_two_next_action_count === founderActions.body.week_two_founder_action_board.length &&
      founderActions.body?.selected_week_two_phase_filter === 'all_week_two_phases' &&
      Array.isArray(founderActions.body?.valid_week_two_phase_filter_ids) &&
      founderActions.body.valid_week_two_phase_filter_ids.includes('all_week_two_phases') &&
      Array.isArray(founderActions.body?.filtered_week_two_founder_action_board) &&
      founderActions.body.filtered_week_two_founder_action_board.length === founderActions.body.week_two_founder_action_board.length &&
      founderActions.body?.filtered_week_two_board_count === founderActions.body.week_two_founder_action_board.length &&
      founderActions.body?.filtered_week_two_next_action_count === founderActions.body.week_two_next_action_count &&
      founderActions.body?.no_week_two_live_action_attempted === true,
    'Founder Action Center Week 2 board must expose phase/status/next-action/filter counts and no-live boundary'
  );

  const founderActionsAuthAdminFilter = await request(
    baseUrl,
    '/api/admin/founder-action-center?phase_filter=auth_admin',
    {
      headers: { 'X-Request-Id': 'gcsc-founder-action-center-auth-admin-filter-smoke' },
    }
  );
  assert(
    founderActionsAuthAdminFilter.status === 200,
    `Expected founder-action-center auth_admin filter 200, got ${founderActionsAuthAdminFilter.status}`
  );
  assert(
    founderActionsAuthAdminFilter.headers.get('x-request-id') === 'gcsc-founder-action-center-auth-admin-filter-smoke' &&
      founderActionsAuthAdminFilter.body?.request_id === 'gcsc-founder-action-center-auth-admin-filter-smoke',
    'Founder Action Center filtered phase response must preserve request-id traceability'
  );
  assert(
    founderActionsAuthAdminFilter.body?.selected_week_two_phase_filter === 'auth_admin' &&
      founderActionsAuthAdminFilter.body?.filtered_week_two_board_count === 1 &&
      founderActionsAuthAdminFilter.body?.filtered_week_two_next_action_count === 1 &&
      founderActionsAuthAdminFilter.body?.filtered_week_two_founder_action_board?.every((item) => item.phase === 'auth_admin') &&
      founderActionsAuthAdminFilter.body?.filtered_week_two_next_actions?.every((item) => item.phase === 'auth_admin') &&
      founderActionsAuthAdminFilter.body?.no_week_two_live_action_attempted === true,
    'Founder Action Center auth_admin phase filter must return only local Auth/Admin Week 2 items without live action'
  );

  const founderActionsInvalidPhaseFilter = await request(
    baseUrl,
    '/api/admin/founder-action-center?phase_filter=approve_live_deploy',
    {
      headers: { 'X-Request-Id': 'gcsc-founder-action-center-invalid-phase-filter-smoke' },
    }
  );
  assert(
    founderActionsInvalidPhaseFilter.status === 400,
    `Expected founder-action-center invalid phase filter 400, got ${founderActionsInvalidPhaseFilter.status}`
  );
  assert(
    founderActionsInvalidPhaseFilter.headers.get('x-request-id') === 'gcsc-founder-action-center-invalid-phase-filter-smoke' &&
      founderActionsInvalidPhaseFilter.body?.request_id === 'gcsc-founder-action-center-invalid-phase-filter-smoke',
    'Founder Action Center invalid phase filter response must preserve request-id traceability'
  );
  assert(
    founderActionsInvalidPhaseFilter.body?.status === 'week_two_phase_filter_invalid' &&
      founderActionsInvalidPhaseFilter.body?.rejected_week_two_phase_filter === 'approve_live_deploy' &&
      founderActionsInvalidPhaseFilter.body?.valid_week_two_phase_filter_ids?.includes('all_week_two_phases') &&
      founderActionsInvalidPhaseFilter.body?.valid_week_two_phase_filter_ids?.includes('mobile_release') &&
      founderActionsInvalidPhaseFilter.body?.blocked_live_actions?.includes('deploy_account_change') &&
      founderActionsInvalidPhaseFilter.body?.blocked_live_actions?.includes('xpr_signature') &&
      founderActionsInvalidPhaseFilter.body?.no_week_two_live_action_attempted === true &&
      founderActionsInvalidPhaseFilter.body?.no_live_action_attempted === true,
    'Founder Action Center invalid phase filter must return safe valid filters and keep live actions blocked'
  );

  const founderAuthNextStepReadiness = await request(baseUrl, '/api/admin/founder-auth-next-step-readiness', {
    headers: { 'X-Request-Id': 'gcsc-founder-auth-next-step-readiness-smoke' },
  });
  assert(
    founderAuthNextStepReadiness.status === 200,
    `Expected founder-auth-next-step-readiness 200, got ${founderAuthNextStepReadiness.status}`
  );
  assert(
    founderAuthNextStepReadiness.headers.get('x-request-id') === 'gcsc-founder-auth-next-step-readiness-smoke' &&
      founderAuthNextStepReadiness.body?.request_id === 'gcsc-founder-auth-next-step-readiness-smoke',
    'Founder Auth next-step readiness endpoint must preserve request-id traceability'
  );
  const directFounderAuthNextStepIds = (founderAuthNextStepReadiness.body?.items || []).map((item) => item.id);
  assert(
      founderAuthNextStepReadiness.body?.mode === 'founder_auth_next_step_readiness' &&
      founderAuthNextStepReadiness.body?.status === 'blocked_for_live_actions' &&
      founderAuthNextStepReadiness.body?.item_count === 3 &&
      directFounderAuthNextStepIds.includes('founder_auth_same_browser_magic_link') &&
      directFounderAuthNextStepIds.includes('founder_auth_profile_binding_review') &&
      directFounderAuthNextStepIds.includes('founder_admin_activation_stop_gate'),
    'Founder Auth next-step readiness endpoint must expose the three Auth/Admin next-step rows'
  );
  assert(
    founderAuthNextStepReadiness.body?.readiness_state_counts?.FOUNDER_MAGIC_LINK_REQUIRED === 1 &&
      founderAuthNextStepReadiness.body?.readiness_state_counts?.PROFILE_BINDING_EVIDENCE_REQUIRED === 1 &&
      founderAuthNextStepReadiness.body?.readiness_state_counts?.BLOCKED_UNTIL_EXPLICIT_LIVE_APPROVAL === 1 &&
      founderAuthNextStepReadiness.body?.required_evidence_count >= 12,
    'Founder Auth next-step readiness endpoint must summarize readiness states and required evidence'
  );
  assert(
    founderAuthNextStepReadiness.body?.safe_report_fields?.includes('founder_auth_setup_request_id') &&
      founderAuthNextStepReadiness.body?.safe_report_fields?.includes('no_secret_confirmation') &&
      founderAuthNextStepReadiness.body?.blocked_live_actions?.includes('admin_memberships_insert') &&
      founderAuthNextStepReadiness.body?.blocked_live_actions?.includes('strict_rls_apply') &&
      founderAuthNextStepReadiness.body?.blocked_live_actions?.includes('production_release') &&
      founderAuthNextStepReadiness.body?.no_magic_link_url_requested === true &&
      founderAuthNextStepReadiness.body?.no_auth_token_requested === true &&
      founderAuthNextStepReadiness.body?.no_service_role_key_requested === true &&
      founderAuthNextStepReadiness.body?.no_admin_membership_insert_attempted === true &&
      founderAuthNextStepReadiness.body?.no_live_action_attempted === true,
    'Founder Auth next-step readiness endpoint must expose safe report fields and block secrets/live Auth/Admin actions'
  );

  const weekTwoAuthAdminReadiness = await request(baseUrl, '/api/admin/week-two-auth-admin-readiness', {
    headers: { 'X-Request-Id': 'gcsc-week-two-auth-admin-readiness-smoke' },
  });
  assert(
    weekTwoAuthAdminReadiness.status === 200,
    `Expected week-two-auth-admin-readiness 200, got ${weekTwoAuthAdminReadiness.status}`
  );
  assert(
    weekTwoAuthAdminReadiness.headers.get('x-request-id') === 'gcsc-week-two-auth-admin-readiness-smoke' &&
      weekTwoAuthAdminReadiness.body?.request_id === 'gcsc-week-two-auth-admin-readiness-smoke',
    'Week 2 Auth/Admin readiness endpoint must preserve request-id traceability'
  );
  const directWeekTwoAuthAdminIds = (weekTwoAuthAdminReadiness.body?.items || []).map((item) => item.id);
  assert(
    weekTwoAuthAdminReadiness.body?.mode === 'week_two_auth_admin_readiness' &&
      weekTwoAuthAdminReadiness.body?.status === 'blocked_for_founder_live_actions' &&
      weekTwoAuthAdminReadiness.body?.item_count === 4 &&
      directWeekTwoAuthAdminIds.includes('week_two_magic_link_same_browser_checklist') &&
      directWeekTwoAuthAdminIds.includes('week_two_founder_profile_binding_checklist') &&
      directWeekTwoAuthAdminIds.includes('week_two_admin_membership_live_approval_gate') &&
      directWeekTwoAuthAdminIds.includes('week_two_strict_rls_decision_packet_checklist'),
    'Week 2 Auth/Admin readiness endpoint must expose the four Week 2 checklist rows'
  );
  assert(
    weekTwoAuthAdminReadiness.body?.readiness_state_counts?.FOUNDER_MAGIC_LINK_EVIDENCE_REQUIRED === 1 &&
      weekTwoAuthAdminReadiness.body?.readiness_state_counts?.FOUNDER_PROFILE_BINDING_EVIDENCE_REQUIRED === 1 &&
      weekTwoAuthAdminReadiness.body?.readiness_state_counts?.ADMIN_MEMBERSHIP_LIVE_APPROVAL_BLOCKED === 1 &&
      weekTwoAuthAdminReadiness.body?.readiness_state_counts?.STRICT_RLS_REVIEW_PACKET_READY_LIVE_APPLY_BLOCKED === 1 &&
      weekTwoAuthAdminReadiness.body?.checklist_phase_counts?.magic_link_evidence === 1 &&
      weekTwoAuthAdminReadiness.body?.checklist_phase_counts?.strict_rls_decision_packet === 1 &&
      weekTwoAuthAdminReadiness.body?.required_evidence_count >= 19 &&
      weekTwoAuthAdminReadiness.body?.founder_report_field_count >= 20,
    'Week 2 Auth/Admin readiness endpoint must summarize states, phases, required evidence, and founder report fields'
  );
  assert(
    weekTwoAuthAdminReadiness.body?.safe_report_fields?.includes('same_browser_opened') &&
      weekTwoAuthAdminReadiness.body?.safe_report_fields?.includes('strict_rls_packet_review_status') &&
      weekTwoAuthAdminReadiness.body?.blocked_live_actions?.includes('magic_link_url_paste') &&
      weekTwoAuthAdminReadiness.body?.blocked_live_actions?.includes('admin_memberships_insert') &&
      weekTwoAuthAdminReadiness.body?.blocked_live_actions?.includes('strict_rls_apply') &&
      weekTwoAuthAdminReadiness.body?.blocked_live_actions?.includes('live_supabase_write') &&
      weekTwoAuthAdminReadiness.body?.no_magic_link_url_requested === true &&
      weekTwoAuthAdminReadiness.body?.no_service_role_key_requested === true &&
      weekTwoAuthAdminReadiness.body?.no_profile_repair_attempted === true &&
      weekTwoAuthAdminReadiness.body?.no_admin_membership_insert_attempted === true &&
      weekTwoAuthAdminReadiness.body?.no_strict_rls_apply_attempted === true &&
      weekTwoAuthAdminReadiness.body?.no_live_supabase_write_attempted === true &&
      weekTwoAuthAdminReadiness.body?.no_live_action_attempted === true,
    'Week 2 Auth/Admin readiness endpoint must expose safe report fields and block secrets/live Auth/Admin/RLS actions'
  );

  const weekTwoAuthAdminExecutionChecklist = await request(
    baseUrl,
    '/api/admin/week-two-auth-admin-execution-checklist',
    {
      headers: { 'X-Request-Id': 'gcsc-week-two-auth-admin-execution-checklist-smoke' },
    }
  );
  assert(
    weekTwoAuthAdminExecutionChecklist.status === 200,
    `Expected week-two-auth-admin-execution-checklist 200, got ${weekTwoAuthAdminExecutionChecklist.status}`
  );
  assert(
    weekTwoAuthAdminExecutionChecklist.headers.get('x-request-id') ===
      'gcsc-week-two-auth-admin-execution-checklist-smoke' &&
      weekTwoAuthAdminExecutionChecklist.body?.request_id ===
        'gcsc-week-two-auth-admin-execution-checklist-smoke',
    'Week 2 Auth/Admin execution checklist endpoint must preserve request-id traceability'
  );
  const directWeekTwoAuthAdminExecutionIds = (weekTwoAuthAdminExecutionChecklist.body?.items || []).map(
    (item) => item.id
  );
  assert(
    weekTwoAuthAdminExecutionChecklist.body?.mode === 'week_two_auth_admin_execution_checklist' &&
      weekTwoAuthAdminExecutionChecklist.body?.status === 'blocked_until_current_thread_founder_evidence' &&
      weekTwoAuthAdminExecutionChecklist.body?.item_count === 4 &&
      weekTwoAuthAdminExecutionChecklist.body?.execution_checklist_count === 4 &&
      directWeekTwoAuthAdminExecutionIds.includes('week_two_auth_admin_report_back_intake') &&
      directWeekTwoAuthAdminExecutionIds.includes('week_two_auth_admin_selected_user_confirmation') &&
      directWeekTwoAuthAdminExecutionIds.includes('week_two_auth_admin_live_request_hold') &&
      directWeekTwoAuthAdminExecutionIds.includes('week_two_auth_admin_post_activation_smoke_order_hold'),
    'Week 2 Auth/Admin execution checklist endpoint must expose the four execution checklist rows'
  );
  assert(
    weekTwoAuthAdminExecutionChecklist.body?.readiness_state_counts?.CURRENT_THREAD_REPORT_BACK_REQUIRED === 1 &&
      weekTwoAuthAdminExecutionChecklist.body?.readiness_state_counts?.SELECTED_USER_CONFIRMATION_REQUIRED === 1 &&
      weekTwoAuthAdminExecutionChecklist.body?.readiness_state_counts?.LIVE_ADMIN_ACTIVATION_REQUEST_HELD === 1 &&
      weekTwoAuthAdminExecutionChecklist.body?.readiness_state_counts
        ?.POST_ACTIVATION_SMOKE_ORDER_READY_LIVE_BLOCKED === 1 &&
      weekTwoAuthAdminExecutionChecklist.body?.execution_phase_counts?.founder_report_back_intake === 1 &&
      weekTwoAuthAdminExecutionChecklist.body?.execution_phase_counts?.post_activation_smoke_order === 1 &&
      weekTwoAuthAdminExecutionChecklist.body?.required_evidence_count >= 16 &&
      weekTwoAuthAdminExecutionChecklist.body?.founder_report_field_count >= 16,
    'Week 2 Auth/Admin execution checklist endpoint must summarize states, phases, required evidence, and report fields'
  );
  assert(
    weekTwoAuthAdminExecutionChecklist.body?.safe_report_fields?.includes('selected_user_status') &&
      weekTwoAuthAdminExecutionChecklist.body?.safe_report_fields?.includes('redacted_output_template_status') &&
      weekTwoAuthAdminExecutionChecklist.body?.blocked_live_actions?.includes('raw_founder_identity_storage') &&
      weekTwoAuthAdminExecutionChecklist.body?.blocked_live_actions?.includes('admin_memberships_insert') &&
      weekTwoAuthAdminExecutionChecklist.body?.blocked_live_actions?.includes('strict_admin_smoke_live_run') &&
      weekTwoAuthAdminExecutionChecklist.body?.blocked_live_actions?.includes('live_supabase_write') &&
      weekTwoAuthAdminExecutionChecklist.body?.no_raw_identity_storage_attempted === true &&
      weekTwoAuthAdminExecutionChecklist.body?.no_selected_user_screenshot_storage_attempted === true &&
      weekTwoAuthAdminExecutionChecklist.body?.no_admin_membership_insert_attempted === true &&
      weekTwoAuthAdminExecutionChecklist.body?.no_strict_admin_smoke_live_run_attempted === true &&
      weekTwoAuthAdminExecutionChecklist.body?.no_strict_rls_apply_attempted === true &&
      weekTwoAuthAdminExecutionChecklist.body?.no_live_supabase_write_attempted === true &&
      weekTwoAuthAdminExecutionChecklist.body?.no_xpr_signature_attempted === true &&
      weekTwoAuthAdminExecutionChecklist.body?.no_live_action_attempted === true,
    'Week 2 Auth/Admin execution checklist endpoint must expose safe report fields and block raw identity/live Auth/Admin/RLS actions'
  );

  const deploymentNextStepReadiness = await request(baseUrl, '/api/admin/deployment-next-step-readiness', {
    headers: { 'X-Request-Id': 'gcsc-deployment-next-step-readiness-smoke' },
  });
  assert(
    deploymentNextStepReadiness.status === 200,
    `Expected deployment-next-step-readiness 200, got ${deploymentNextStepReadiness.status}`
  );
  assert(
    deploymentNextStepReadiness.headers.get('x-request-id') === 'gcsc-deployment-next-step-readiness-smoke' &&
      deploymentNextStepReadiness.body?.request_id === 'gcsc-deployment-next-step-readiness-smoke',
    'Deployment next-step readiness endpoint must preserve request-id traceability'
  );
  const directDeploymentNextStepIds = (deploymentNextStepReadiness.body?.items || []).map((item) => item.id);
  const directDeploymentNextStepBlockedActions = (deploymentNextStepReadiness.body?.blocked_live_actions || []);
  assert(
    deploymentNextStepReadiness.body?.mode === 'deployment_next_step_readiness' &&
      deploymentNextStepReadiness.body?.status === 'blocked_for_external_account_or_public_release' &&
      deploymentNextStepReadiness.body?.item_count === 4 &&
      directDeploymentNextStepIds.includes('deployment_target_selection_review') &&
      directDeploymentNextStepIds.includes('deployment_account_session_boundary') &&
      directDeploymentNextStepIds.includes('public_beta_url_smoke_evidence_intake') &&
      directDeploymentNextStepIds.includes('supabase_redirect_env_owner_boundary'),
    'Deployment next-step readiness endpoint must expose the four deployment/public beta next-step rows'
  );
  assert(
    deploymentNextStepReadiness.body?.readiness_state_counts?.READY_FOR_FOUNDER_DEPLOY_TARGET_REVIEW === 1 &&
      deploymentNextStepReadiness.body?.readiness_state_counts?.BLOCKED_FOR_FOUNDER_ACCOUNT_SESSION_REVIEW === 1 &&
      deploymentNextStepReadiness.body?.readiness_state_counts?.LOCAL_EVIDENCE_TEMPLATE_READY_URL_PENDING === 1 &&
      deploymentNextStepReadiness.body?.readiness_state_counts?.BLOCKED_EXTERNAL_ACTION_FOUNDER_ONLY === 1 &&
      deploymentNextStepReadiness.body?.required_evidence_count >= 17,
    'Deployment next-step readiness endpoint must summarize readiness states and required evidence'
  );
  assert(
    deploymentNextStepReadiness.body?.safe_report_fields?.includes('deployment_target_choice') &&
      deploymentNextStepReadiness.body?.safe_report_fields?.includes('redacted_public_beta_url_label') &&
      deploymentNextStepReadiness.body?.safe_report_fields?.includes('rollback_or_hold_decision') &&
      directDeploymentNextStepBlockedActions.includes('vercel_import') &&
      directDeploymentNextStepBlockedActions.includes('public_url_share') &&
      directDeploymentNextStepBlockedActions.includes('tester_invite') &&
      directDeploymentNextStepBlockedActions.includes('supabase_redirect_update') &&
      directDeploymentNextStepBlockedActions.includes('payment_or_loan_action') &&
      directDeploymentNextStepBlockedActions.includes('production_release') &&
      deploymentNextStepReadiness.body?.no_external_account_login_attempted === true &&
      deploymentNextStepReadiness.body?.no_external_account_change_attempted === true &&
      deploymentNextStepReadiness.body?.no_deploy_setting_change_attempted === true &&
      deploymentNextStepReadiness.body?.no_dns_change_attempted === true &&
      deploymentNextStepReadiness.body?.no_supabase_redirect_change_attempted === true &&
      deploymentNextStepReadiness.body?.no_public_url_share_attempted === true &&
      deploymentNextStepReadiness.body?.no_tester_invite_attempted === true &&
      deploymentNextStepReadiness.body?.no_live_action_attempted === true,
    'Deployment next-step readiness endpoint must expose safe report fields and block account/deploy/DNS/redirect/share/invite/live actions'
  );

  const weekTwoDeploymentPublicBetaReadiness = await request(baseUrl, '/api/admin/week-two-deployment-public-beta-readiness', {
    headers: { 'X-Request-Id': 'gcsc-week-two-deployment-public-beta-readiness-smoke' },
  });
  assert(
    weekTwoDeploymentPublicBetaReadiness.status === 200,
    `Expected week-two-deployment-public-beta-readiness 200, got ${weekTwoDeploymentPublicBetaReadiness.status}`
  );
  assert(
    weekTwoDeploymentPublicBetaReadiness.headers.get('x-request-id') === 'gcsc-week-two-deployment-public-beta-readiness-smoke' &&
      weekTwoDeploymentPublicBetaReadiness.body?.request_id === 'gcsc-week-two-deployment-public-beta-readiness-smoke',
    'Week 2 deployment/public beta readiness endpoint must preserve request-id traceability'
  );
  const directWeekTwoDeploymentPublicBetaIds = (weekTwoDeploymentPublicBetaReadiness.body?.items || []).map((item) => item.id);
  const directWeekTwoDeploymentPublicBetaBlockedActions = weekTwoDeploymentPublicBetaReadiness.body?.blocked_live_actions || [];
  assert(
    weekTwoDeploymentPublicBetaReadiness.body?.mode === 'week_two_deployment_public_beta_readiness' &&
      weekTwoDeploymentPublicBetaReadiness.body?.status === 'blocked_for_founder_deploy_public_beta_actions' &&
      weekTwoDeploymentPublicBetaReadiness.body?.item_count === 4 &&
      directWeekTwoDeploymentPublicBetaIds.includes('week_two_deploy_target_review_checklist') &&
      directWeekTwoDeploymentPublicBetaIds.includes('week_two_public_url_smoke_template_checklist') &&
      directWeekTwoDeploymentPublicBetaIds.includes('week_two_supabase_redirect_env_boundary_checklist') &&
      directWeekTwoDeploymentPublicBetaIds.includes('week_two_public_beta_invite_gate_checklist'),
    'Week 2 deployment/public beta readiness endpoint must expose the four Week 2 deploy/public beta checklist rows'
  );
  assert(
    weekTwoDeploymentPublicBetaReadiness.body?.readiness_state_counts?.FOUNDER_DEPLOY_TARGET_REVIEW_REQUIRED === 1 &&
      weekTwoDeploymentPublicBetaReadiness.body?.readiness_state_counts?.PUBLIC_URL_SMOKE_TEMPLATE_READY_URL_PENDING === 1 &&
      weekTwoDeploymentPublicBetaReadiness.body?.readiness_state_counts?.SUPABASE_REDIRECT_ENV_FOUNDER_ONLY_BLOCKED === 1 &&
      weekTwoDeploymentPublicBetaReadiness.body?.readiness_state_counts?.PUBLIC_BETA_INVITE_APPROVAL_BLOCKED === 1 &&
      weekTwoDeploymentPublicBetaReadiness.body?.checklist_phase_counts?.deploy_target_review === 1 &&
      weekTwoDeploymentPublicBetaReadiness.body?.checklist_phase_counts?.public_beta_invite_gate === 1 &&
      weekTwoDeploymentPublicBetaReadiness.body?.required_evidence_count >= 16 &&
      weekTwoDeploymentPublicBetaReadiness.body?.founder_report_field_count >= 20,
    'Week 2 deployment/public beta readiness endpoint must summarize states, phases, required evidence, and founder report fields'
  );
  assert(
    weekTwoDeploymentPublicBetaReadiness.body?.safe_report_fields?.includes('deploy_target_choice') &&
      weekTwoDeploymentPublicBetaReadiness.body?.safe_report_fields?.includes('redacted_public_beta_url_label') &&
      weekTwoDeploymentPublicBetaReadiness.body?.safe_report_fields?.includes('supabase_redirect_status') &&
      weekTwoDeploymentPublicBetaReadiness.body?.safe_report_fields?.includes('invite_batch_size') &&
      directWeekTwoDeploymentPublicBetaBlockedActions.includes('vercel_import') &&
      directWeekTwoDeploymentPublicBetaBlockedActions.includes('supabase_redirect_update') &&
      directWeekTwoDeploymentPublicBetaBlockedActions.includes('real_public_url_in_repo') &&
      directWeekTwoDeploymentPublicBetaBlockedActions.includes('public_url_share') &&
      directWeekTwoDeploymentPublicBetaBlockedActions.includes('tester_invite') &&
      directWeekTwoDeploymentPublicBetaBlockedActions.includes('public_beta_flip') &&
      directWeekTwoDeploymentPublicBetaBlockedActions.includes('production_release') &&
      weekTwoDeploymentPublicBetaReadiness.body?.no_external_account_login_attempted === true &&
      weekTwoDeploymentPublicBetaReadiness.body?.no_deploy_setting_change_attempted === true &&
      weekTwoDeploymentPublicBetaReadiness.body?.no_supabase_redirect_change_attempted === true &&
      weekTwoDeploymentPublicBetaReadiness.body?.no_public_url_share_attempted === true &&
      weekTwoDeploymentPublicBetaReadiness.body?.no_tester_invite_attempted === true &&
      weekTwoDeploymentPublicBetaReadiness.body?.no_public_beta_flip_attempted === true &&
      weekTwoDeploymentPublicBetaReadiness.body?.no_live_action_attempted === true,
    'Week 2 deployment/public beta readiness endpoint must expose safe report fields and block deploy/URL/invite/Supabase/live actions'
  );

  const weekTwoDeploymentPublicBetaExecutionChecklist = await request(
    baseUrl,
    '/api/admin/week-two-deployment-public-beta-execution-checklist',
    {
      headers: {
        'X-Request-Id': 'gcsc-week-two-deployment-public-beta-execution-checklist-smoke',
      },
    }
  );
  assert(
    weekTwoDeploymentPublicBetaExecutionChecklist.status === 200,
    `Expected week-two-deployment-public-beta-execution-checklist 200, got ${weekTwoDeploymentPublicBetaExecutionChecklist.status}`
  );
  assert(
    weekTwoDeploymentPublicBetaExecutionChecklist.headers.get('x-request-id') ===
      'gcsc-week-two-deployment-public-beta-execution-checklist-smoke' &&
      weekTwoDeploymentPublicBetaExecutionChecklist.body?.request_id ===
        'gcsc-week-two-deployment-public-beta-execution-checklist-smoke',
    'Week 2 deployment/public beta execution checklist endpoint must preserve request-id traceability'
  );
  const directWeekTwoDeploymentPublicBetaExecutionIds =
    (weekTwoDeploymentPublicBetaExecutionChecklist.body?.items || []).map((item) => item.id);
  const directWeekTwoDeploymentPublicBetaExecutionBlockedActions =
    weekTwoDeploymentPublicBetaExecutionChecklist.body?.blocked_live_actions || [];
  assert(
    weekTwoDeploymentPublicBetaExecutionChecklist.body?.mode ===
      'week_two_deployment_public_beta_execution_checklist' &&
      weekTwoDeploymentPublicBetaExecutionChecklist.body?.status ===
        'blocked_until_founder_deploy_public_beta_evidence' &&
      weekTwoDeploymentPublicBetaExecutionChecklist.body?.item_count === 4 &&
      weekTwoDeploymentPublicBetaExecutionChecklist.body?.execution_checklist_count === 4 &&
      directWeekTwoDeploymentPublicBetaExecutionIds.includes('week_two_deployment_account_report_back_intake') &&
      directWeekTwoDeploymentPublicBetaExecutionIds.includes('week_two_public_url_smoke_report_back_intake') &&
      directWeekTwoDeploymentPublicBetaExecutionIds.includes('week_two_public_beta_invite_request_hold') &&
      directWeekTwoDeploymentPublicBetaExecutionIds.includes('week_two_supabase_redirect_env_change_hold'),
    'Week 2 deployment/public beta execution checklist endpoint must expose the four execution checklist rows'
  );
  assert(
    weekTwoDeploymentPublicBetaExecutionChecklist.body?.readiness_state_counts
      ?.DEPLOYMENT_ACCOUNT_REPORT_BACK_REQUIRED === 1 &&
      weekTwoDeploymentPublicBetaExecutionChecklist.body?.readiness_state_counts
        ?.PUBLIC_URL_SMOKE_EVIDENCE_REQUIRED_URL_PRIVATE === 1 &&
      weekTwoDeploymentPublicBetaExecutionChecklist.body?.readiness_state_counts
        ?.PUBLIC_BETA_INVITE_REQUEST_HELD === 1 &&
      weekTwoDeploymentPublicBetaExecutionChecklist.body?.readiness_state_counts
        ?.SUPABASE_REDIRECT_ENV_CHANGE_HELD === 1 &&
      weekTwoDeploymentPublicBetaExecutionChecklist.body?.execution_phase_counts
        ?.deployment_account_report_back === 1 &&
      weekTwoDeploymentPublicBetaExecutionChecklist.body?.execution_phase_counts
        ?.public_url_smoke_report_back === 1 &&
      weekTwoDeploymentPublicBetaExecutionChecklist.body?.execution_phase_counts?.invite_request_hold === 1 &&
      weekTwoDeploymentPublicBetaExecutionChecklist.body?.execution_phase_counts?.supabase_redirect_env_hold === 1 &&
      weekTwoDeploymentPublicBetaExecutionChecklist.body?.required_evidence_count >= 16 &&
      weekTwoDeploymentPublicBetaExecutionChecklist.body?.founder_report_field_count >= 22,
    'Week 2 deployment/public beta execution checklist endpoint must summarize states, phases, required evidence, and report fields'
  );
  assert(
    weekTwoDeploymentPublicBetaExecutionChecklist.body?.safe_report_fields?.includes('deployment_platform_label') &&
      weekTwoDeploymentPublicBetaExecutionChecklist.body?.safe_report_fields?.includes('redacted_public_beta_url_label') &&
      weekTwoDeploymentPublicBetaExecutionChecklist.body?.safe_report_fields?.includes('public_beta_invite_approval_phrase_status') &&
      weekTwoDeploymentPublicBetaExecutionChecklist.body?.safe_report_fields?.includes('supabase_redirect_owner') &&
      directWeekTwoDeploymentPublicBetaExecutionBlockedActions.includes('external_account_session_storage') &&
      directWeekTwoDeploymentPublicBetaExecutionBlockedActions.includes('supabase_project_setting_change') &&
      directWeekTwoDeploymentPublicBetaExecutionBlockedActions.includes('real_public_url_storage') &&
      directWeekTwoDeploymentPublicBetaExecutionBlockedActions.includes('public_url_share') &&
      directWeekTwoDeploymentPublicBetaExecutionBlockedActions.includes('tester_invite') &&
      directWeekTwoDeploymentPublicBetaExecutionBlockedActions.includes('public_beta_flip') &&
      directWeekTwoDeploymentPublicBetaExecutionBlockedActions.includes('live_supabase_write') &&
      directWeekTwoDeploymentPublicBetaExecutionBlockedActions.includes('xpr_signature') &&
      directWeekTwoDeploymentPublicBetaExecutionBlockedActions.includes('production_release') &&
      weekTwoDeploymentPublicBetaExecutionChecklist.body?.no_external_account_session_storage_attempted === true &&
      weekTwoDeploymentPublicBetaExecutionChecklist.body?.no_real_public_url_storage_attempted === true &&
      weekTwoDeploymentPublicBetaExecutionChecklist.body?.no_live_supabase_write_attempted === true &&
      weekTwoDeploymentPublicBetaExecutionChecklist.body?.no_xpr_signature_attempted === true &&
      weekTwoDeploymentPublicBetaExecutionChecklist.body?.no_live_action_attempted === true,
    'Week 2 deployment/public beta execution checklist endpoint must expose safe report fields and block account/URL/invite/Supabase/XPR/live actions'
  );

  const weekTwoMobileReleaseReadiness = await request(baseUrl, '/api/admin/week-two-mobile-release-readiness', {
    headers: { 'X-Request-Id': 'gcsc-week-two-mobile-release-readiness-smoke' },
  });
  assert(
    weekTwoMobileReleaseReadiness.status === 200,
    `Expected week-two-mobile-release-readiness 200, got ${weekTwoMobileReleaseReadiness.status}`
  );
  assert(
    weekTwoMobileReleaseReadiness.headers.get('x-request-id') === 'gcsc-week-two-mobile-release-readiness-smoke' &&
      weekTwoMobileReleaseReadiness.body?.request_id === 'gcsc-week-two-mobile-release-readiness-smoke',
    'Week 2 mobile release readiness endpoint must preserve request-id traceability'
  );
  const directWeekTwoMobileReleaseIds = (weekTwoMobileReleaseReadiness.body?.items || []).map((item) => item.id);
  const directWeekTwoMobileReleaseBlockedActions = weekTwoMobileReleaseReadiness.body?.blocked_live_actions || [];
  assert(
    weekTwoMobileReleaseReadiness.body?.mode === 'week_two_mobile_release_readiness' &&
      weekTwoMobileReleaseReadiness.body?.status === 'blocked_until_founder_device_store_account_review' &&
      weekTwoMobileReleaseReadiness.body?.item_count === 4 &&
      directWeekTwoMobileReleaseIds.includes('week_two_pwa_install_offline_recheck') &&
      directWeekTwoMobileReleaseIds.includes('week_two_android_debug_qa_blocker_recheck') &&
      directWeekTwoMobileReleaseIds.includes('week_two_ios_store_signing_blocker_recheck') &&
      directWeekTwoMobileReleaseIds.includes('week_two_mobile_release_decision_stop_gate'),
    'Week 2 mobile release readiness endpoint must expose the four Week 2 mobile release rows'
  );
  assert(
    weekTwoMobileReleaseReadiness.body?.readiness_state_counts?.PWA_INSTALL_OFFLINE_RECHECK_REQUIRED === 1 &&
      weekTwoMobileReleaseReadiness.body?.readiness_state_counts?.ANDROID_DEBUG_QA_RECHECK_REQUIRED === 1 &&
      weekTwoMobileReleaseReadiness.body?.readiness_state_counts?.IOS_STORE_SIGNING_BLOCKED_FOUNDER_ACCOUNT_REQUIRED === 1 &&
      weekTwoMobileReleaseReadiness.body?.readiness_state_counts?.MOBILE_RELEASE_DECISION_BLOCKED === 1 &&
      weekTwoMobileReleaseReadiness.body?.readiness_area_counts?.pwa_install_offline === 1 &&
      weekTwoMobileReleaseReadiness.body?.readiness_area_counts?.android_debug_qa === 1 &&
      weekTwoMobileReleaseReadiness.body?.readiness_area_counts?.ios_store_signing === 1 &&
      weekTwoMobileReleaseReadiness.body?.readiness_area_counts?.mobile_release_decision === 1 &&
      weekTwoMobileReleaseReadiness.body?.required_evidence_count >= 16 &&
      weekTwoMobileReleaseReadiness.body?.founder_report_field_count >= 20 &&
      Array.isArray(weekTwoMobileReleaseReadiness.body?.linked_surfaces) &&
      weekTwoMobileReleaseReadiness.body.linked_surfaces.includes('/api/admin/mobile-install-readiness'),
    'Week 2 mobile release readiness endpoint must summarize states, areas, evidence, founder report fields, and linked surfaces'
  );
  assert(
    weekTwoMobileReleaseReadiness.body?.safe_report_fields?.includes('readiness_area') &&
      weekTwoMobileReleaseReadiness.body?.safe_report_fields?.includes('platform_scope') &&
      weekTwoMobileReleaseReadiness.body?.safe_report_fields?.includes('required_phrase_status') &&
      directWeekTwoMobileReleaseBlockedActions.includes('app_store_submission') &&
      directWeekTwoMobileReleaseBlockedActions.includes('play_console_submission') &&
      directWeekTwoMobileReleaseBlockedActions.includes('testflight_submission') &&
      directWeekTwoMobileReleaseBlockedActions.includes('play_testing_release') &&
      directWeekTwoMobileReleaseBlockedActions.includes('signing_key_upload') &&
      directWeekTwoMobileReleaseBlockedActions.includes('certificate_upload') &&
      directWeekTwoMobileReleaseBlockedActions.includes('provisioning_profile_upload') &&
      directWeekTwoMobileReleaseBlockedActions.includes('keystore_upload') &&
      directWeekTwoMobileReleaseBlockedActions.includes('public_release') &&
      directWeekTwoMobileReleaseBlockedActions.includes('real_payment') &&
      directWeekTwoMobileReleaseBlockedActions.includes('real_loan') &&
      directWeekTwoMobileReleaseBlockedActions.includes('real_escrow') &&
      directWeekTwoMobileReleaseBlockedActions.includes('stablecoin_settlement') &&
      directWeekTwoMobileReleaseBlockedActions.includes('token_collateral_lock') &&
      directWeekTwoMobileReleaseBlockedActions.includes('xpr_signature') &&
      directWeekTwoMobileReleaseBlockedActions.includes('production_release') &&
      weekTwoMobileReleaseReadiness.body?.no_secret_requested === true &&
      weekTwoMobileReleaseReadiness.body?.no_external_account_login_attempted === true &&
      weekTwoMobileReleaseReadiness.body?.no_app_store_submission_attempted === true &&
      weekTwoMobileReleaseReadiness.body?.no_play_console_submission_attempted === true &&
      weekTwoMobileReleaseReadiness.body?.no_testflight_submission_attempted === true &&
      weekTwoMobileReleaseReadiness.body?.no_play_testing_release_attempted === true &&
      weekTwoMobileReleaseReadiness.body?.no_signing_key_upload_attempted === true &&
      weekTwoMobileReleaseReadiness.body?.no_certificate_upload_attempted === true &&
      weekTwoMobileReleaseReadiness.body?.no_provisioning_profile_upload_attempted === true &&
      weekTwoMobileReleaseReadiness.body?.no_keystore_upload_attempted === true &&
      weekTwoMobileReleaseReadiness.body?.no_public_release_attempted === true &&
      weekTwoMobileReleaseReadiness.body?.no_live_finance_action_attempted === true &&
      weekTwoMobileReleaseReadiness.body?.no_xpr_signature_attempted === true &&
      weekTwoMobileReleaseReadiness.body?.no_live_action_attempted === true,
    'Week 2 mobile release readiness endpoint must expose safe report fields and block store/signing/release/finance/XPR/live actions'
  );

  const weekTwoMobileReleaseExecutionChecklist = await request(
    baseUrl,
    '/api/admin/week-two-mobile-release-execution-checklist',
    {
      headers: { 'X-Request-Id': 'gcsc-week-two-mobile-release-execution-checklist-smoke' },
    }
  );
  assert(
    weekTwoMobileReleaseExecutionChecklist.status === 200,
    `Expected week-two-mobile-release-execution-checklist 200, got ${weekTwoMobileReleaseExecutionChecklist.status}`
  );
  assert(
    weekTwoMobileReleaseExecutionChecklist.headers.get('x-request-id') ===
      'gcsc-week-two-mobile-release-execution-checklist-smoke' &&
      weekTwoMobileReleaseExecutionChecklist.body?.request_id ===
        'gcsc-week-two-mobile-release-execution-checklist-smoke',
    'Week 2 mobile release execution checklist endpoint must preserve request-id traceability'
  );
  const directWeekTwoMobileReleaseExecutionIds = (
    weekTwoMobileReleaseExecutionChecklist.body?.items || []
  ).map((item) => item.id);
  const directWeekTwoMobileReleaseExecutionBlockedActions =
    weekTwoMobileReleaseExecutionChecklist.body?.blocked_live_actions || [];
  assert(
    weekTwoMobileReleaseExecutionChecklist.body?.mode === 'week_two_mobile_release_execution_checklist' &&
      weekTwoMobileReleaseExecutionChecklist.body?.status === 'blocked_until_founder_mobile_release_evidence' &&
      weekTwoMobileReleaseExecutionChecklist.body?.item_count === 4 &&
      weekTwoMobileReleaseExecutionChecklist.body?.mobile_release_execution_checklist_count === 4 &&
      weekTwoMobileReleaseExecutionChecklist.body?.execution_checklist_count === 4 &&
      directWeekTwoMobileReleaseExecutionIds.includes('week_two_mobile_pwa_install_report_back_intake') &&
      directWeekTwoMobileReleaseExecutionIds.includes('week_two_android_debug_qa_report_back_intake') &&
      directWeekTwoMobileReleaseExecutionIds.includes('week_two_ios_store_signing_request_hold') &&
      directWeekTwoMobileReleaseExecutionIds.includes('week_two_mobile_release_decision_hold'),
    'Week 2 mobile release execution checklist endpoint must expose the four execution checklist rows'
  );
  assert(
    weekTwoMobileReleaseExecutionChecklist.body?.readiness_state_counts?.PWA_INSTALL_REPORT_BACK_REQUIRED === 1 &&
      weekTwoMobileReleaseExecutionChecklist.body?.readiness_state_counts?.ANDROID_DEBUG_QA_REPORT_BACK_REQUIRED === 1 &&
      weekTwoMobileReleaseExecutionChecklist.body?.readiness_state_counts?.IOS_STORE_SIGNING_REQUEST_HELD === 1 &&
      weekTwoMobileReleaseExecutionChecklist.body?.readiness_state_counts?.MOBILE_RELEASE_DECISION_HELD === 1 &&
      weekTwoMobileReleaseExecutionChecklist.body?.execution_phase_counts?.pwa_install_report_back === 1 &&
      weekTwoMobileReleaseExecutionChecklist.body?.execution_phase_counts?.android_debug_qa_report_back === 1 &&
      weekTwoMobileReleaseExecutionChecklist.body?.execution_phase_counts?.ios_store_signing_hold === 1 &&
      weekTwoMobileReleaseExecutionChecklist.body?.execution_phase_counts?.mobile_release_decision_hold === 1 &&
      weekTwoMobileReleaseExecutionChecklist.body?.required_evidence_count >= 16 &&
      weekTwoMobileReleaseExecutionChecklist.body?.founder_report_field_count >= 23 &&
      Array.isArray(weekTwoMobileReleaseExecutionChecklist.body?.linked_surfaces) &&
      weekTwoMobileReleaseExecutionChecklist.body.linked_surfaces.includes('/api/admin/week-two-mobile-release-readiness'),
    'Week 2 mobile release execution checklist endpoint must summarize states, phases, evidence, founder report fields, and linked surfaces'
  );
  assert(
    weekTwoMobileReleaseExecutionChecklist.body?.safe_report_fields?.includes('device_class_label') &&
      weekTwoMobileReleaseExecutionChecklist.body?.safe_report_fields?.includes('android_environment_label') &&
      weekTwoMobileReleaseExecutionChecklist.body?.safe_report_fields?.includes('apple_account_owner_status') &&
      weekTwoMobileReleaseExecutionChecklist.body?.safe_report_fields?.includes('mobile_release_decision_phrase_status') &&
      directWeekTwoMobileReleaseExecutionBlockedActions.includes('app_store_connect_login') &&
      directWeekTwoMobileReleaseExecutionBlockedActions.includes('testflight_submission') &&
      directWeekTwoMobileReleaseExecutionBlockedActions.includes('play_testing_release') &&
      directWeekTwoMobileReleaseExecutionBlockedActions.includes('signing_key_upload') &&
      directWeekTwoMobileReleaseExecutionBlockedActions.includes('device_identifier_storage') &&
      directWeekTwoMobileReleaseExecutionBlockedActions.includes('public_release') &&
      directWeekTwoMobileReleaseExecutionBlockedActions.includes('xpr_signature') &&
      weekTwoMobileReleaseExecutionChecklist.body?.no_external_account_session_storage_attempted === true &&
      weekTwoMobileReleaseExecutionChecklist.body?.no_app_store_submission_attempted === true &&
      weekTwoMobileReleaseExecutionChecklist.body?.no_play_console_submission_attempted === true &&
      weekTwoMobileReleaseExecutionChecklist.body?.no_signing_key_upload_attempted === true &&
      weekTwoMobileReleaseExecutionChecklist.body?.no_device_identifier_storage_attempted === true &&
      weekTwoMobileReleaseExecutionChecklist.body?.no_public_release_attempted === true &&
      weekTwoMobileReleaseExecutionChecklist.body?.no_xpr_signature_attempted === true &&
      weekTwoMobileReleaseExecutionChecklist.body?.no_live_action_attempted === true,
    'Week 2 mobile release execution checklist endpoint must expose safe report fields and block store/session/signing/device/release/XPR/live actions'
  );

  const legalProviderNextStepReadiness = await request(baseUrl, '/api/admin/legal-provider-next-step-readiness', {
    headers: { 'X-Request-Id': 'gcsc-legal-provider-next-step-readiness-smoke' },
  });
  assert(
    legalProviderNextStepReadiness.status === 200,
    `Expected legal-provider-next-step-readiness 200, got ${legalProviderNextStepReadiness.status}`
  );
  assert(
    legalProviderNextStepReadiness.headers.get('x-request-id') === 'gcsc-legal-provider-next-step-readiness-smoke' &&
      legalProviderNextStepReadiness.body?.request_id === 'gcsc-legal-provider-next-step-readiness-smoke',
    'Legal/provider next-step readiness endpoint must preserve request-id traceability'
  );
  const directLegalProviderNextStepIds = (legalProviderNextStepReadiness.body?.items || []).map((item) => item.id);
  const directLegalProviderNextStepBlockedActions = legalProviderNextStepReadiness.body?.blocked_live_actions || [];
  assert(
    legalProviderNextStepReadiness.body?.mode === 'legal_provider_next_step_readiness' &&
      legalProviderNextStepReadiness.body?.status === 'blocked_for_external_legal_provider_review' &&
      legalProviderNextStepReadiness.body?.item_count === 4 &&
      directLegalProviderNextStepIds.includes('working_capital_legal_provider_question_prep') &&
      directLegalProviderNextStepIds.includes('escrow_payment_provider_question_prep') &&
      directLegalProviderNextStepIds.includes('claimbridge_advance_provider_question_prep') &&
      directLegalProviderNextStepIds.includes('token_collateral_security_legal_question_prep'),
    'Legal/provider next-step readiness endpoint must expose the four legal/provider question-prep rows'
  );
  assert(
    legalProviderNextStepReadiness.body?.readiness_state_counts?.BLOCKED_FOR_EXTERNAL_LEGAL_PROVIDER_REVIEW === 1 &&
      legalProviderNextStepReadiness.body?.readiness_state_counts?.BLOCKED_FOR_ESCROW_PAYMENT_PROVIDER_REVIEW === 1 &&
      legalProviderNextStepReadiness.body?.readiness_state_counts?.BLOCKED_FOR_ADVANCE_PROVIDER_REVIEW === 1 &&
      legalProviderNextStepReadiness.body?.readiness_state_counts?.BLOCKED_FOR_TOKEN_COLLATERAL_REVIEW === 1 &&
      legalProviderNextStepReadiness.body?.review_area_counts?.working_capital === 1 &&
      legalProviderNextStepReadiness.body?.required_evidence_count >= 16,
    'Legal/provider next-step readiness endpoint must summarize readiness states, review areas, and required evidence'
  );
  assert(
    legalProviderNextStepReadiness.body?.safe_report_fields?.includes('question_area') &&
      legalProviderNextStepReadiness.body?.safe_report_fields?.includes('blocked_next_action') &&
      legalProviderNextStepReadiness.body?.safe_report_fields?.includes('no_secret_confirmation') &&
      directLegalProviderNextStepBlockedActions.includes('legal_conclusion') &&
      directLegalProviderNextStepBlockedActions.includes('provider_commitment') &&
      directLegalProviderNextStepBlockedActions.includes('real_payment') &&
      directLegalProviderNextStepBlockedActions.includes('real_loan') &&
      directLegalProviderNextStepBlockedActions.includes('real_escrow') &&
      directLegalProviderNextStepBlockedActions.includes('repayment_routing') &&
      directLegalProviderNextStepBlockedActions.includes('stablecoin_settlement') &&
      directLegalProviderNextStepBlockedActions.includes('token_collateral_lock') &&
      directLegalProviderNextStepBlockedActions.includes('xpr_signature') &&
      directLegalProviderNextStepBlockedActions.includes('production_release') &&
      legalProviderNextStepReadiness.body?.no_secret_requested === true &&
      legalProviderNextStepReadiness.body?.no_external_send_attempted === true &&
      legalProviderNextStepReadiness.body?.no_provider_commitment_attempted === true &&
      legalProviderNextStepReadiness.body?.no_legal_decision_attempted === true &&
      legalProviderNextStepReadiness.body?.no_live_finance_action_attempted === true &&
      legalProviderNextStepReadiness.body?.no_xpr_signature_attempted === true &&
      legalProviderNextStepReadiness.body?.no_live_action_attempted === true,
    'Legal/provider next-step readiness endpoint must expose safe report fields and block legal/provider/finance/XPR/live actions'
  );

  const weekTwoLegalProviderReadiness = await request(baseUrl, '/api/admin/week-two-legal-provider-readiness', {
    headers: { 'X-Request-Id': 'gcsc-week-two-legal-provider-readiness-smoke' },
  });
  assert(
    weekTwoLegalProviderReadiness.status === 200,
    `Expected week-two-legal-provider-readiness 200, got ${weekTwoLegalProviderReadiness.status}`
  );
  assert(
    weekTwoLegalProviderReadiness.headers.get('x-request-id') === 'gcsc-week-two-legal-provider-readiness-smoke' &&
      weekTwoLegalProviderReadiness.body?.request_id === 'gcsc-week-two-legal-provider-readiness-smoke',
    'Week 2 legal/provider readiness endpoint must preserve request-id traceability'
  );
  const directWeekTwoLegalProviderIds = (weekTwoLegalProviderReadiness.body?.items || []).map((item) => item.id);
  const directWeekTwoLegalProviderBlockedActions = weekTwoLegalProviderReadiness.body?.blocked_live_actions || [];
  assert(
    weekTwoLegalProviderReadiness.body?.mode === 'week_two_legal_provider_readiness' &&
      weekTwoLegalProviderReadiness.body?.status === 'blocked_for_external_legal_provider_review' &&
      weekTwoLegalProviderReadiness.body?.item_count === 4 &&
      directWeekTwoLegalProviderIds.includes('week_two_working_capital_review_question_checklist') &&
      directWeekTwoLegalProviderIds.includes('week_two_escrow_payment_review_question_checklist') &&
      directWeekTwoLegalProviderIds.includes('week_two_claimbridge_advance_review_question_checklist') &&
      directWeekTwoLegalProviderIds.includes('week_two_token_collateral_review_question_checklist'),
    'Week 2 legal/provider readiness endpoint must expose the four Week 2 legal/provider checklist rows'
  );
  assert(
    weekTwoLegalProviderReadiness.body?.readiness_state_counts?.WORKING_CAPITAL_PROVIDER_QUESTIONS_READY_REVIEW_REQUIRED === 1 &&
      weekTwoLegalProviderReadiness.body?.readiness_state_counts?.ESCROW_PAYMENT_PROVIDER_QUESTIONS_READY_REVIEW_REQUIRED === 1 &&
      weekTwoLegalProviderReadiness.body?.readiness_state_counts?.CLAIMBRIDGE_ADVANCE_PROVIDER_QUESTIONS_READY_REVIEW_REQUIRED === 1 &&
      weekTwoLegalProviderReadiness.body?.readiness_state_counts?.TOKEN_COLLATERAL_SECURITY_LEGAL_QUESTIONS_READY_REVIEW_REQUIRED === 1 &&
      weekTwoLegalProviderReadiness.body?.checklist_phase_counts?.working_capital_question_review === 1 &&
      weekTwoLegalProviderReadiness.body?.review_area_counts?.token_collateral === 1 &&
      weekTwoLegalProviderReadiness.body?.required_evidence_count >= 16 &&
      weekTwoLegalProviderReadiness.body?.founder_report_field_count >= 28 &&
      Array.isArray(weekTwoLegalProviderReadiness.body?.linked_surfaces) &&
      weekTwoLegalProviderReadiness.body.linked_surfaces.includes('/api/admin/legal-provider-next-step-readiness'),
    'Week 2 legal/provider readiness endpoint must summarize states, phases, review areas, evidence, founder report fields, and linked surfaces'
  );
  assert(
    weekTwoLegalProviderReadiness.body?.safe_report_fields?.includes('provider_submission_status') &&
      weekTwoLegalProviderReadiness.body?.safe_report_fields?.includes('legal_decision_status') &&
      weekTwoLegalProviderReadiness.body?.safe_report_fields?.includes('no_secret_confirmation') &&
      directWeekTwoLegalProviderBlockedActions.includes('provider_submission') &&
      directWeekTwoLegalProviderBlockedActions.includes('external_send') &&
      directWeekTwoLegalProviderBlockedActions.includes('real_payment') &&
      directWeekTwoLegalProviderBlockedActions.includes('real_loan') &&
      directWeekTwoLegalProviderBlockedActions.includes('real_escrow') &&
      directWeekTwoLegalProviderBlockedActions.includes('repayment_routing') &&
      directWeekTwoLegalProviderBlockedActions.includes('stablecoin_settlement') &&
      directWeekTwoLegalProviderBlockedActions.includes('token_collateral_lock') &&
      directWeekTwoLegalProviderBlockedActions.includes('token_custody') &&
      directWeekTwoLegalProviderBlockedActions.includes('smart_contract_deployment') &&
      directWeekTwoLegalProviderBlockedActions.includes('xpr_signature') &&
      directWeekTwoLegalProviderBlockedActions.includes('public_claim_approval') &&
      directWeekTwoLegalProviderBlockedActions.includes('production_release') &&
      weekTwoLegalProviderReadiness.body?.no_secret_requested === true &&
      weekTwoLegalProviderReadiness.body?.no_external_send_attempted === true &&
      weekTwoLegalProviderReadiness.body?.no_provider_submission_attempted === true &&
      weekTwoLegalProviderReadiness.body?.no_provider_commitment_attempted === true &&
      weekTwoLegalProviderReadiness.body?.no_legal_decision_attempted === true &&
      weekTwoLegalProviderReadiness.body?.no_live_finance_action_attempted === true &&
      weekTwoLegalProviderReadiness.body?.no_xpr_signature_attempted === true &&
      weekTwoLegalProviderReadiness.body?.no_smart_contract_deployment_attempted === true &&
      weekTwoLegalProviderReadiness.body?.no_public_claim_approval_attempted === true &&
      weekTwoLegalProviderReadiness.body?.no_live_action_attempted === true,
    'Week 2 legal/provider readiness endpoint must expose safe report fields and block provider submission/legal/provider/finance/collateral/XPR/live actions'
  );

  const weekTwoLegalProviderExecutionChecklist = await request(
    baseUrl,
    '/api/admin/week-two-legal-provider-execution-checklist',
    {
      headers: { 'X-Request-Id': 'gcsc-week-two-legal-provider-execution-checklist-smoke' },
    }
  );
  assert(
    weekTwoLegalProviderExecutionChecklist.status === 200,
    `Expected week-two-legal-provider-execution-checklist 200, got ${weekTwoLegalProviderExecutionChecklist.status}`
  );
  assert(
    weekTwoLegalProviderExecutionChecklist.headers.get('x-request-id') ===
      'gcsc-week-two-legal-provider-execution-checklist-smoke' &&
      weekTwoLegalProviderExecutionChecklist.body?.request_id ===
        'gcsc-week-two-legal-provider-execution-checklist-smoke',
    'Week 2 legal/provider execution checklist endpoint must preserve request-id traceability'
  );
  const directWeekTwoLegalProviderExecutionIds = (
    weekTwoLegalProviderExecutionChecklist.body?.items || []
  ).map((item) => item.id);
  const directWeekTwoLegalProviderExecutionBlockedActions =
    weekTwoLegalProviderExecutionChecklist.body?.blocked_live_actions || [];
  assert(
    weekTwoLegalProviderExecutionChecklist.body?.mode === 'week_two_legal_provider_execution_checklist' &&
      weekTwoLegalProviderExecutionChecklist.body?.status ===
        'blocked_until_founder_legal_provider_execution_evidence' &&
      weekTwoLegalProviderExecutionChecklist.body?.item_count === 4 &&
      weekTwoLegalProviderExecutionChecklist.body?.legal_provider_execution_checklist_count === 4 &&
      weekTwoLegalProviderExecutionChecklist.body?.execution_checklist_count === 4 &&
      directWeekTwoLegalProviderExecutionIds.includes(
        'week_two_legal_provider_question_packet_report_back_intake'
      ) &&
      directWeekTwoLegalProviderExecutionIds.includes('week_two_provider_response_summary_hold') &&
      directWeekTwoLegalProviderExecutionIds.includes('week_two_finance_escrow_live_action_request_hold') &&
      directWeekTwoLegalProviderExecutionIds.includes('week_two_public_claim_legal_wording_decision_hold'),
    'Week 2 legal/provider execution checklist endpoint must expose the four execution checklist rows'
  );
  assert(
    weekTwoLegalProviderExecutionChecklist.body?.readiness_state_counts?.QUESTION_PACKET_REPORT_BACK_REQUIRED === 1 &&
      weekTwoLegalProviderExecutionChecklist.body?.readiness_state_counts?.PROVIDER_RESPONSE_SUMMARY_HELD === 1 &&
      weekTwoLegalProviderExecutionChecklist.body?.readiness_state_counts
        ?.FINANCE_ESCROW_LIVE_ACTION_REQUEST_HELD === 1 &&
      weekTwoLegalProviderExecutionChecklist.body?.readiness_state_counts
        ?.PUBLIC_CLAIM_LEGAL_WORDING_DECISION_HELD === 1 &&
      weekTwoLegalProviderExecutionChecklist.body?.execution_phase_counts?.question_packet_report_back === 1 &&
      weekTwoLegalProviderExecutionChecklist.body?.execution_phase_counts?.provider_response_summary_hold === 1 &&
      weekTwoLegalProviderExecutionChecklist.body?.execution_phase_counts?.finance_escrow_live_action_hold === 1 &&
      weekTwoLegalProviderExecutionChecklist.body?.execution_phase_counts?.public_claim_legal_wording_hold === 1 &&
      weekTwoLegalProviderExecutionChecklist.body?.review_area_counts?.provider_response === 1 &&
      weekTwoLegalProviderExecutionChecklist.body?.required_evidence_count >= 16 &&
      weekTwoLegalProviderExecutionChecklist.body?.founder_report_field_count >= 24 &&
      Array.isArray(weekTwoLegalProviderExecutionChecklist.body?.linked_surfaces) &&
      weekTwoLegalProviderExecutionChecklist.body.linked_surfaces.includes(
        '/api/admin/week-two-legal-provider-readiness'
      ),
    'Week 2 legal/provider execution checklist endpoint must summarize states, phases, review areas, evidence, founder report fields, and linked surfaces'
  );
  assert(
    weekTwoLegalProviderExecutionChecklist.body?.safe_report_fields?.includes('question_packet_id') &&
      weekTwoLegalProviderExecutionChecklist.body?.safe_report_fields?.includes('provider_response_status') &&
      weekTwoLegalProviderExecutionChecklist.body?.safe_report_fields?.includes('live_action_category_label') &&
      weekTwoLegalProviderExecutionChecklist.body?.safe_report_fields?.includes('public_claim_approval_status') &&
      directWeekTwoLegalProviderExecutionBlockedActions.includes('external_send') &&
      directWeekTwoLegalProviderExecutionBlockedActions.includes('provider_submission') &&
      directWeekTwoLegalProviderExecutionBlockedActions.includes('reviewer_response_storage') &&
      directWeekTwoLegalProviderExecutionBlockedActions.includes('raw_legal_advice_storage') &&
      directWeekTwoLegalProviderExecutionBlockedActions.includes('legal_conclusion') &&
      directWeekTwoLegalProviderExecutionBlockedActions.includes('provider_commitment') &&
      directWeekTwoLegalProviderExecutionBlockedActions.includes('real_payment') &&
      directWeekTwoLegalProviderExecutionBlockedActions.includes('real_loan') &&
      directWeekTwoLegalProviderExecutionBlockedActions.includes('real_escrow') &&
      directWeekTwoLegalProviderExecutionBlockedActions.includes('repayment_routing') &&
      directWeekTwoLegalProviderExecutionBlockedActions.includes('stablecoin_settlement') &&
      directWeekTwoLegalProviderExecutionBlockedActions.includes('token_collateral_lock') &&
      directWeekTwoLegalProviderExecutionBlockedActions.includes('token_custody') &&
      directWeekTwoLegalProviderExecutionBlockedActions.includes('smart_contract_deployment') &&
      directWeekTwoLegalProviderExecutionBlockedActions.includes('xpr_signature') &&
      directWeekTwoLegalProviderExecutionBlockedActions.includes('public_claim_approval') &&
      directWeekTwoLegalProviderExecutionBlockedActions.includes('production_release') &&
      weekTwoLegalProviderExecutionChecklist.body?.no_secret_requested === true &&
      weekTwoLegalProviderExecutionChecklist.body?.no_external_send_attempted === true &&
      weekTwoLegalProviderExecutionChecklist.body?.no_provider_submission_attempted === true &&
      weekTwoLegalProviderExecutionChecklist.body?.no_provider_commitment_attempted === true &&
      weekTwoLegalProviderExecutionChecklist.body?.no_raw_reviewer_response_stored === true &&
      weekTwoLegalProviderExecutionChecklist.body?.no_attorney_advice_stored === true &&
      weekTwoLegalProviderExecutionChecklist.body?.no_legal_conclusion_recorded === true &&
      weekTwoLegalProviderExecutionChecklist.body?.no_live_finance_action_attempted === true &&
      weekTwoLegalProviderExecutionChecklist.body?.no_xpr_signature_attempted === true &&
      weekTwoLegalProviderExecutionChecklist.body?.no_smart_contract_deployment_attempted === true &&
      weekTwoLegalProviderExecutionChecklist.body?.no_public_claim_approval_attempted === true &&
      weekTwoLegalProviderExecutionChecklist.body?.no_live_action_attempted === true,
    'Week 2 legal/provider execution checklist endpoint must expose safe report fields and block response/legal/provider/finance/collateral/XPR/live actions'
  );

  const weekTwoInvestorFounderPackageAlignment = await request(baseUrl, '/api/admin/week-two-investor-founder-package-alignment', {
    headers: { 'X-Request-Id': 'gcsc-week-two-investor-founder-package-alignment-smoke' },
  });
  assert(
    weekTwoInvestorFounderPackageAlignment.status === 200,
    `Expected week-two-investor-founder-package-alignment 200, got ${weekTwoInvestorFounderPackageAlignment.status}`
  );
  assert(
    weekTwoInvestorFounderPackageAlignment.headers.get('x-request-id') === 'gcsc-week-two-investor-founder-package-alignment-smoke' &&
      weekTwoInvestorFounderPackageAlignment.body?.request_id === 'gcsc-week-two-investor-founder-package-alignment-smoke',
    'Week 2 investor/founder package alignment endpoint must preserve request-id traceability'
  );
  const directWeekTwoInvestorAlignmentIds = (weekTwoInvestorFounderPackageAlignment.body?.items || []).map((item) => item.id);
  const directWeekTwoInvestorAlignmentBlockedActions = weekTwoInvestorFounderPackageAlignment.body?.blocked_live_actions || [];
  assert(
    weekTwoInvestorFounderPackageAlignment.body?.mode === 'week_two_investor_founder_package_alignment' &&
      weekTwoInvestorFounderPackageAlignment.body?.status === 'blocked_until_founder_external_sharing_review' &&
      weekTwoInvestorFounderPackageAlignment.body?.item_count === 4 &&
      directWeekTwoInvestorAlignmentIds.includes('week_two_investor_live_finance_claim_alignment') &&
      directWeekTwoInvestorAlignmentIds.includes('week_two_investor_escrow_token_claim_alignment') &&
      directWeekTwoInvestorAlignmentIds.includes('week_two_investor_ai_authority_claim_alignment') &&
      directWeekTwoInvestorAlignmentIds.includes('week_two_investor_external_send_stop_gate'),
    'Week 2 investor/founder package alignment endpoint must expose the four Week 2 alignment rows'
  );
  assert(
    weekTwoInvestorFounderPackageAlignment.body?.alignment_state_counts?.LIVE_FINANCE_CLAIMS_REVIEW_REQUIRED === 1 &&
      weekTwoInvestorFounderPackageAlignment.body?.alignment_state_counts?.ESCROW_TOKEN_CLAIMS_REVIEW_REQUIRED === 1 &&
      weekTwoInvestorFounderPackageAlignment.body?.alignment_state_counts?.AI_AUTHORITY_CLAIMS_REVIEW_REQUIRED === 1 &&
      weekTwoInvestorFounderPackageAlignment.body?.alignment_state_counts?.EXTERNAL_SEND_APPROVAL_BLOCKED === 1 &&
      weekTwoInvestorFounderPackageAlignment.body?.alignment_area_counts?.live_finance_claims === 1 &&
      weekTwoInvestorFounderPackageAlignment.body?.alignment_area_counts?.escrow_token_claims === 1 &&
      weekTwoInvestorFounderPackageAlignment.body?.alignment_area_counts?.ai_authority_claims === 1 &&
      weekTwoInvestorFounderPackageAlignment.body?.alignment_area_counts?.external_send_stop_gate === 1 &&
      weekTwoInvestorFounderPackageAlignment.body?.required_evidence_count >= 16 &&
      weekTwoInvestorFounderPackageAlignment.body?.founder_report_field_count >= 28 &&
      Array.isArray(weekTwoInvestorFounderPackageAlignment.body?.linked_surfaces) &&
      weekTwoInvestorFounderPackageAlignment.body.linked_surfaces.includes('/api/admin/week-two-legal-provider-readiness'),
    'Week 2 investor/founder package alignment endpoint must summarize states, areas, evidence, founder report fields, and linked surfaces'
  );
  assert(
    weekTwoInvestorFounderPackageAlignment.body?.safe_report_fields?.includes('alignment_area') &&
      weekTwoInvestorFounderPackageAlignment.body?.safe_report_fields?.includes('claim_review_status') &&
      weekTwoInvestorFounderPackageAlignment.body?.safe_report_fields?.includes('redaction_status') &&
      directWeekTwoInvestorAlignmentBlockedActions.includes('investor_outreach') &&
      directWeekTwoInvestorAlignmentBlockedActions.includes('grant_submission') &&
      directWeekTwoInvestorAlignmentBlockedActions.includes('provider_outreach') &&
      directWeekTwoInvestorAlignmentBlockedActions.includes('attorney_outreach') &&
      directWeekTwoInvestorAlignmentBlockedActions.includes('external_send') &&
      directWeekTwoInvestorAlignmentBlockedActions.includes('deck_publication') &&
      directWeekTwoInvestorAlignmentBlockedActions.includes('public_claim_approval') &&
      directWeekTwoInvestorAlignmentBlockedActions.includes('live_finance_claim') &&
      directWeekTwoInvestorAlignmentBlockedActions.includes('real_payment') &&
      directWeekTwoInvestorAlignmentBlockedActions.includes('real_loan') &&
      directWeekTwoInvestorAlignmentBlockedActions.includes('real_escrow') &&
      directWeekTwoInvestorAlignmentBlockedActions.includes('stablecoin_settlement') &&
      directWeekTwoInvestorAlignmentBlockedActions.includes('token_collateral_lock') &&
      directWeekTwoInvestorAlignmentBlockedActions.includes('token_custody') &&
      directWeekTwoInvestorAlignmentBlockedActions.includes('xpr_signature') &&
      directWeekTwoInvestorAlignmentBlockedActions.includes('fio_registration') &&
      directWeekTwoInvestorAlignmentBlockedActions.includes('metallicus_partnership_claim') &&
      directWeekTwoInvestorAlignmentBlockedActions.includes('ai_credit_approval_claim') &&
      directWeekTwoInvestorAlignmentBlockedActions.includes('ai_legal_decision_claim') &&
      directWeekTwoInvestorAlignmentBlockedActions.includes('production_release') &&
      weekTwoInvestorFounderPackageAlignment.body?.no_secret_requested === true &&
      weekTwoInvestorFounderPackageAlignment.body?.no_external_send_attempted === true &&
      weekTwoInvestorFounderPackageAlignment.body?.no_investor_outreach_attempted === true &&
      weekTwoInvestorFounderPackageAlignment.body?.no_grant_submission_attempted === true &&
      weekTwoInvestorFounderPackageAlignment.body?.no_provider_outreach_attempted === true &&
      weekTwoInvestorFounderPackageAlignment.body?.no_publication_attempted === true &&
      weekTwoInvestorFounderPackageAlignment.body?.no_public_url_share_attempted === true &&
      weekTwoInvestorFounderPackageAlignment.body?.no_live_finance_action_attempted === true &&
      weekTwoInvestorFounderPackageAlignment.body?.no_public_claim_approval_attempted === true &&
      weekTwoInvestorFounderPackageAlignment.body?.no_xpr_signature_attempted === true &&
      weekTwoInvestorFounderPackageAlignment.body?.no_fio_registration_attempted === true &&
      weekTwoInvestorFounderPackageAlignment.body?.no_legal_provider_decision_attempted === true &&
      weekTwoInvestorFounderPackageAlignment.body?.no_production_release_attempted === true &&
      weekTwoInvestorFounderPackageAlignment.body?.no_live_action_attempted === true,
    'Week 2 investor/founder package alignment endpoint must expose safe report fields and block outreach/publication/finance/token/AI/legal/provider/live actions'
  );

  const weekTwoInvestorFounderPackageExecutionChecklist = await request(
    baseUrl,
    '/api/admin/week-two-investor-founder-package-execution-checklist',
    {
      headers: { 'X-Request-Id': 'gcsc-week-two-investor-founder-package-execution-checklist-smoke' },
    }
  );
  assert(
    weekTwoInvestorFounderPackageExecutionChecklist.status === 200,
    `Expected week-two-investor-founder-package-execution-checklist 200, got ${weekTwoInvestorFounderPackageExecutionChecklist.status}`
  );
  assert(
    weekTwoInvestorFounderPackageExecutionChecklist.headers.get('x-request-id') ===
      'gcsc-week-two-investor-founder-package-execution-checklist-smoke' &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.request_id ===
        'gcsc-week-two-investor-founder-package-execution-checklist-smoke',
    'Week 2 investor/founder package execution checklist endpoint must preserve request-id traceability'
  );
  const directWeekTwoInvestorExecutionIds = (weekTwoInvestorFounderPackageExecutionChecklist.body?.items || []).map(
    (item) => item.id
  );
  const directWeekTwoInvestorExecutionBlockedActions =
    weekTwoInvestorFounderPackageExecutionChecklist.body?.blocked_live_actions || [];
  assert(
    weekTwoInvestorFounderPackageExecutionChecklist.body?.mode ===
      'week_two_investor_founder_package_execution_checklist' &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.status ===
        'blocked_until_founder_investor_package_execution_evidence' &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.item_count === 4 &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.investor_founder_package_execution_checklist_count === 4 &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.execution_checklist_count === 4 &&
      directWeekTwoInvestorExecutionIds.includes('week_two_investor_packet_review_report_back_intake') &&
      directWeekTwoInvestorExecutionIds.includes('week_two_investor_claim_correction_hold') &&
      directWeekTwoInvestorExecutionIds.includes('week_two_investor_external_send_request_hold') &&
      directWeekTwoInvestorExecutionIds.includes('week_two_investor_followup_response_hold'),
    'Week 2 investor/founder package execution checklist endpoint must expose the four execution rows'
  );
  assert(
    weekTwoInvestorFounderPackageExecutionChecklist.body?.readiness_state_counts
      ?.INVESTOR_PACKET_REVIEW_REPORT_BACK_REQUIRED === 1 &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.readiness_state_counts?.INVESTOR_CLAIM_CORRECTION_HELD ===
        1 &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.readiness_state_counts
        ?.INVESTOR_EXTERNAL_SEND_REQUEST_HELD === 1 &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.readiness_state_counts?.INVESTOR_FOLLOWUP_RESPONSE_HELD ===
        1 &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.execution_phase_counts?.packet_review_report_back === 1 &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.execution_phase_counts?.claim_correction_hold === 1 &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.execution_phase_counts?.external_send_request_hold === 1 &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.execution_phase_counts?.followup_response_hold === 1 &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.review_area_counts?.packet_review === 1 &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.review_area_counts?.claim_review === 1 &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.review_area_counts?.external_send === 1 &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.review_area_counts?.followup === 1 &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.required_evidence_count >= 20 &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.founder_report_field_count >= 32 &&
      Array.isArray(weekTwoInvestorFounderPackageExecutionChecklist.body?.linked_surfaces) &&
      weekTwoInvestorFounderPackageExecutionChecklist.body.linked_surfaces.includes(
        '/api/admin/week-two-investor-founder-package-alignment'
      ),
    'Week 2 investor/founder package execution checklist endpoint must summarize states, phases, areas, evidence, founder report fields, and linked surfaces'
  );
  assert(
    weekTwoInvestorFounderPackageExecutionChecklist.body?.safe_report_fields?.includes('packet_version_label') &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.safe_report_fields?.includes('recipient_category') &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.safe_report_fields?.includes('sensitive_question_route') &&
      directWeekTwoInvestorExecutionBlockedActions.includes('recipient_data_collection') &&
      directWeekTwoInvestorExecutionBlockedActions.includes('investor_outreach') &&
      directWeekTwoInvestorExecutionBlockedActions.includes('grant_submission') &&
      directWeekTwoInvestorExecutionBlockedActions.includes('provider_outreach') &&
      directWeekTwoInvestorExecutionBlockedActions.includes('attorney_outreach') &&
      directWeekTwoInvestorExecutionBlockedActions.includes('external_send') &&
      directWeekTwoInvestorExecutionBlockedActions.includes('deck_publication') &&
      directWeekTwoInvestorExecutionBlockedActions.includes('public_claim_approval') &&
      directWeekTwoInvestorExecutionBlockedActions.includes('live_finance_claim') &&
      directWeekTwoInvestorExecutionBlockedActions.includes('real_payment') &&
      directWeekTwoInvestorExecutionBlockedActions.includes('real_loan') &&
      directWeekTwoInvestorExecutionBlockedActions.includes('real_escrow') &&
      directWeekTwoInvestorExecutionBlockedActions.includes('stablecoin_settlement') &&
      directWeekTwoInvestorExecutionBlockedActions.includes('token_collateral_lock') &&
      directWeekTwoInvestorExecutionBlockedActions.includes('token_custody') &&
      directWeekTwoInvestorExecutionBlockedActions.includes('xpr_signature') &&
      directWeekTwoInvestorExecutionBlockedActions.includes('fio_registration') &&
      directWeekTwoInvestorExecutionBlockedActions.includes('metallicus_partnership_claim') &&
      directWeekTwoInvestorExecutionBlockedActions.includes('ai_credit_approval_claim') &&
      directWeekTwoInvestorExecutionBlockedActions.includes('ai_legal_decision_claim') &&
      directWeekTwoInvestorExecutionBlockedActions.includes('production_release') &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.no_secret_requested === true &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.no_recipient_contact_data_requested === true &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.no_external_send_attempted === true &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.no_investor_outreach_attempted === true &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.no_grant_submission_attempted === true &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.no_provider_outreach_attempted === true &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.no_publication_attempted === true &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.no_public_url_share_attempted === true &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.no_live_finance_action_attempted === true &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.no_public_claim_approval_attempted === true &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.no_xpr_signature_attempted === true &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.no_fio_registration_attempted === true &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.no_legal_provider_decision_attempted === true &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.no_production_release_attempted === true &&
      weekTwoInvestorFounderPackageExecutionChecklist.body?.no_live_action_attempted === true,
    'Week 2 investor/founder package execution checklist endpoint must expose safe report fields and block recipient/outreach/publication/finance/token/AI/legal/provider/live actions'
  );

  const paymentIntentOwnershipReadiness = await request(baseUrl, '/api/admin/payment-intent-ownership-readiness', {
    headers: { 'X-Request-Id': 'gcsc-payment-intent-ownership-readiness-smoke' },
  });
  assert(
    paymentIntentOwnershipReadiness.status === 200,
    `Expected payment-intent-ownership-readiness 200, got ${paymentIntentOwnershipReadiness.status}`
  );
  assert(
    paymentIntentOwnershipReadiness.headers.get('x-request-id') ===
      'gcsc-payment-intent-ownership-readiness-smoke' &&
      paymentIntentOwnershipReadiness.body?.request_id === 'gcsc-payment-intent-ownership-readiness-smoke',
    'Payment intent ownership readiness endpoint must preserve request-id traceability'
  );
  const paymentOwnershipIds = (paymentIntentOwnershipReadiness.body?.items || []).map((item) => item.id);
  const paymentOwnershipBlockedActions = paymentIntentOwnershipReadiness.body?.blocked_live_actions || [];
  const paymentOwnershipColumns = paymentIntentOwnershipReadiness.body?.typed_ownership_columns || [];
  assert(
    paymentIntentOwnershipReadiness.body?.mode === 'payment_intent_ownership_readiness' &&
      paymentIntentOwnershipReadiness.body?.status === 'payment_ownership_ready_for_review_live_sql_blocked' &&
      paymentIntentOwnershipReadiness.body?.item_count === 4 &&
      paymentIntentOwnershipReadiness.body?.payment_ownership_readiness_count === 4 &&
      paymentIntentOwnershipReadiness.body?.typed_ownership_column_count === 7 &&
      paymentOwnershipIds.includes('payment_intent_ownership_sql_draft_review') &&
      paymentOwnershipIds.includes('payment_intent_participant_mapping_review') &&
      paymentOwnershipIds.includes('payment_intent_backend_write_boundary') &&
      paymentOwnershipIds.includes('payment_intent_live_rls_stop_gate'),
    'Payment intent ownership readiness endpoint must expose the four ownership readiness rows'
  );
  assert(
    paymentIntentOwnershipReadiness.body?.readiness_state_counts?.SQL_DRAFT_VALIDATED_LOCAL_ONLY === 1 &&
      paymentIntentOwnershipReadiness.body?.readiness_state_counts?.PARTICIPANT_MAPPING_REVIEW_REQUIRED === 1 &&
      paymentIntentOwnershipReadiness.body?.readiness_state_counts?.BACKEND_WRITES_ONLY_HELD === 1 &&
      paymentIntentOwnershipReadiness.body?.readiness_state_counts?.LIVE_RLS_APPLY_BLOCKED_FOR_FOUNDER === 1 &&
      paymentIntentOwnershipReadiness.body?.readiness_phase_counts?.sql_draft_review === 1 &&
      paymentIntentOwnershipReadiness.body?.readiness_phase_counts?.participant_mapping === 1 &&
      paymentIntentOwnershipReadiness.body?.readiness_phase_counts?.backend_write_boundary === 1 &&
      paymentIntentOwnershipReadiness.body?.readiness_phase_counts?.live_rls_stop_gate === 1 &&
      paymentIntentOwnershipReadiness.body?.review_area_counts?.strict_rls_payment_visibility === 1 &&
      paymentIntentOwnershipReadiness.body?.review_area_counts?.payer_visibility_rules === 1 &&
      paymentIntentOwnershipReadiness.body?.review_area_counts?.payment_provider_safety === 1 &&
      paymentIntentOwnershipReadiness.body?.review_area_counts?.founder_live_approval === 1,
    'Payment intent ownership readiness endpoint must summarize states, phases, and review areas'
  );
  assert(
    paymentOwnershipColumns.includes('payer_profile_id') &&
      paymentOwnershipColumns.includes('homeowner_id') &&
      paymentOwnershipColumns.includes('contractor_id') &&
      paymentOwnershipColumns.includes('job_id') &&
      paymentOwnershipColumns.includes('loan_id') &&
      paymentOwnershipColumns.includes('project_contract_id') &&
      paymentOwnershipColumns.includes('milestone_id') &&
      paymentIntentOwnershipReadiness.body?.required_evidence_count >= 14 &&
      paymentIntentOwnershipReadiness.body?.linked_surfaces?.includes('/api/admin/beta-readiness'),
    'Payment intent ownership readiness endpoint must summarize typed ownership columns, evidence, and linked surfaces'
  );
  assert(
    paymentIntentOwnershipReadiness.body?.safe_report_fields?.includes('typed_ownership_columns') &&
      paymentIntentOwnershipReadiness.body?.safe_report_fields?.includes('blocked_live_actions') &&
      paymentOwnershipBlockedActions.includes('payment_intents_sql_apply') &&
      paymentOwnershipBlockedActions.includes('strict_rls_apply') &&
      paymentOwnershipBlockedActions.includes('service_role_key_use') &&
      paymentOwnershipBlockedActions.includes('real_payment') &&
      paymentOwnershipBlockedActions.includes('xpr_transfer') &&
      paymentOwnershipBlockedActions.includes('stablecoin_settlement') &&
      paymentOwnershipBlockedActions.includes('escrow_release') &&
      paymentOwnershipBlockedActions.includes('repayment_routing') &&
      paymentOwnershipBlockedActions.includes('token_collateral_lock') &&
      paymentOwnershipBlockedActions.includes('production_release') &&
      paymentIntentOwnershipReadiness.body?.no_secret_requested === true &&
      paymentIntentOwnershipReadiness.body?.no_live_supabase_write_attempted === true &&
      paymentIntentOwnershipReadiness.body?.no_payment_sql_apply_attempted === true &&
      paymentIntentOwnershipReadiness.body?.no_strict_rls_apply_attempted === true &&
      paymentIntentOwnershipReadiness.body?.no_service_role_key_used === true &&
      paymentIntentOwnershipReadiness.body?.no_payment_provider_activation_attempted === true &&
      paymentIntentOwnershipReadiness.body?.no_real_payment_attempted === true &&
      paymentIntentOwnershipReadiness.body?.no_escrow_release_attempted === true &&
      paymentIntentOwnershipReadiness.body?.no_repayment_routing_attempted === true &&
      paymentIntentOwnershipReadiness.body?.no_stablecoin_settlement_attempted === true &&
      paymentIntentOwnershipReadiness.body?.no_token_collateral_lock_attempted === true &&
      paymentIntentOwnershipReadiness.body?.no_wallet_signature_attempted === true &&
      paymentIntentOwnershipReadiness.body?.no_legal_provider_decision_attempted === true &&
      paymentIntentOwnershipReadiness.body?.no_production_release_attempted === true &&
      paymentIntentOwnershipReadiness.body?.no_live_action_attempted === true,
    'Payment intent ownership readiness endpoint must expose safe fields and block SQL/payment/XPR/stablecoin/escrow/repayment/token/legal/live actions'
  );

  const weekTwoLocalValidationPassReadiness = await request(baseUrl, '/api/admin/week-two-local-validation-pass-readiness', {
    headers: { 'X-Request-Id': 'gcsc-week-two-local-validation-pass-readiness-smoke' },
  });
  assert(
    weekTwoLocalValidationPassReadiness.status === 200,
    `Expected week-two-local-validation-pass-readiness 200, got ${weekTwoLocalValidationPassReadiness.status}`
  );
  assert(
    weekTwoLocalValidationPassReadiness.headers.get('x-request-id') ===
      'gcsc-week-two-local-validation-pass-readiness-smoke' &&
      weekTwoLocalValidationPassReadiness.body?.request_id === 'gcsc-week-two-local-validation-pass-readiness-smoke',
    'Week 2 local validation pass readiness endpoint must preserve request-id traceability'
  );
  const directWeekTwoValidationIds = (weekTwoLocalValidationPassReadiness.body?.items || []).map((item) => item.id);
  const directWeekTwoValidationBlockedActions = weekTwoLocalValidationPassReadiness.body?.blocked_live_actions || [];
  assert(
    weekTwoLocalValidationPassReadiness.body?.mode === 'week_two_local_validation_pass_readiness' &&
      weekTwoLocalValidationPassReadiness.body?.status === 'local_validation_pass_ready_public_live_actions_blocked' &&
      weekTwoLocalValidationPassReadiness.body?.item_count === 4 &&
      weekTwoLocalValidationPassReadiness.body?.validation_readiness_count === 4 &&
      directWeekTwoValidationIds.includes('week_two_validation_targeted_checks_queue') &&
      directWeekTwoValidationIds.includes('week_two_validation_public_file_guard') &&
      directWeekTwoValidationIds.includes('week_two_validation_evidence_report_back') &&
      directWeekTwoValidationIds.includes('week_two_validation_failure_triage_hold'),
    'Week 2 local validation pass readiness endpoint must expose the four validation rows'
  );
  assert(
    weekTwoLocalValidationPassReadiness.body?.readiness_state_counts?.TARGETED_VALIDATION_QUEUE_READY === 1 &&
      weekTwoLocalValidationPassReadiness.body?.readiness_state_counts?.PUBLIC_FILE_GUARD_REQUIRED === 1 &&
      weekTwoLocalValidationPassReadiness.body?.readiness_state_counts
        ?.VALIDATION_EVIDENCE_REPORT_BACK_REQUIRED === 1 &&
      weekTwoLocalValidationPassReadiness.body?.readiness_state_counts?.FAILED_CHECK_TRIAGE_HELD === 1 &&
      weekTwoLocalValidationPassReadiness.body?.validation_phase_counts?.targeted_checks === 1 &&
      weekTwoLocalValidationPassReadiness.body?.validation_phase_counts?.public_file_guard === 1 &&
      weekTwoLocalValidationPassReadiness.body?.validation_phase_counts?.evidence_report_back === 1 &&
      weekTwoLocalValidationPassReadiness.body?.validation_phase_counts?.failure_triage_hold === 1 &&
      weekTwoLocalValidationPassReadiness.body?.review_area_counts?.targeted_validation === 1 &&
      weekTwoLocalValidationPassReadiness.body?.review_area_counts?.public_file_safety === 1 &&
      weekTwoLocalValidationPassReadiness.body?.review_area_counts?.evidence_reporting === 1 &&
      weekTwoLocalValidationPassReadiness.body?.review_area_counts?.failed_check_triage === 1 &&
      weekTwoLocalValidationPassReadiness.body?.required_command_count >= 12 &&
      weekTwoLocalValidationPassReadiness.body?.founder_report_field_count >= 23 &&
      Array.isArray(weekTwoLocalValidationPassReadiness.body?.linked_surfaces) &&
      weekTwoLocalValidationPassReadiness.body.linked_surfaces.includes('/api/admin/beta-readiness'),
    'Week 2 local validation pass readiness endpoint must summarize states, phases, areas, commands, founder report fields, and linked surfaces'
  );
  assert(
    weekTwoLocalValidationPassReadiness.body?.safe_report_fields?.includes('command_label') &&
      weekTwoLocalValidationPassReadiness.body?.safe_report_fields?.includes('public_file_guard_status') &&
      weekTwoLocalValidationPassReadiness.body?.safe_report_fields?.includes('failing_command') &&
      directWeekTwoValidationBlockedActions.includes('secret_entry') &&
      directWeekTwoValidationBlockedActions.includes('live_supabase_write') &&
      directWeekTwoValidationBlockedActions.includes('strict_rls_apply') &&
      directWeekTwoValidationBlockedActions.includes('external_account_change') &&
      directWeekTwoValidationBlockedActions.includes('deploy_setting_change') &&
      directWeekTwoValidationBlockedActions.includes('public_file_edit') &&
      directWeekTwoValidationBlockedActions.includes('public_whitepaper_html_replacement') &&
      directWeekTwoValidationBlockedActions.includes('public_url_share') &&
      directWeekTwoValidationBlockedActions.includes('tester_invite') &&
      directWeekTwoValidationBlockedActions.includes('real_payment') &&
      directWeekTwoValidationBlockedActions.includes('real_loan') &&
      directWeekTwoValidationBlockedActions.includes('real_escrow') &&
      directWeekTwoValidationBlockedActions.includes('stablecoin_settlement') &&
      directWeekTwoValidationBlockedActions.includes('token_collateral_lock') &&
      directWeekTwoValidationBlockedActions.includes('xpr_signature') &&
      directWeekTwoValidationBlockedActions.includes('fio_registration') &&
      directWeekTwoValidationBlockedActions.includes('provider_commitment') &&
      directWeekTwoValidationBlockedActions.includes('legal_conclusion') &&
      directWeekTwoValidationBlockedActions.includes('destructive_git_action') &&
      directWeekTwoValidationBlockedActions.includes('production_release') &&
      weekTwoLocalValidationPassReadiness.body?.no_secret_requested === true &&
      weekTwoLocalValidationPassReadiness.body?.no_live_supabase_write_attempted === true &&
      weekTwoLocalValidationPassReadiness.body?.no_strict_rls_apply_attempted === true &&
      weekTwoLocalValidationPassReadiness.body?.no_external_account_change_attempted === true &&
      weekTwoLocalValidationPassReadiness.body?.no_deploy_setting_change_attempted === true &&
      weekTwoLocalValidationPassReadiness.body?.no_public_file_edit_attempted === true &&
      weekTwoLocalValidationPassReadiness.body?.no_public_url_share_attempted === true &&
      weekTwoLocalValidationPassReadiness.body?.no_tester_invite_attempted === true &&
      weekTwoLocalValidationPassReadiness.body?.no_live_finance_action_attempted === true &&
      weekTwoLocalValidationPassReadiness.body?.no_xpr_signature_attempted === true &&
      weekTwoLocalValidationPassReadiness.body?.no_fio_registration_attempted === true &&
      weekTwoLocalValidationPassReadiness.body?.no_legal_provider_decision_attempted === true &&
      weekTwoLocalValidationPassReadiness.body?.no_production_release_attempted === true &&
      weekTwoLocalValidationPassReadiness.body?.no_destructive_git_action_attempted === true &&
      weekTwoLocalValidationPassReadiness.body?.no_live_action_attempted === true,
    'Week 2 local validation pass readiness endpoint must expose safe report fields and block public/live/finance/XPR/FIO/legal/provider/destructive actions'
  );

  const weekTwoLocalValidationPassExecutionChecklist = await request(
    baseUrl,
    '/api/admin/week-two-local-validation-pass-execution-checklist',
    {
      headers: { 'X-Request-Id': 'gcsc-week-two-local-validation-pass-execution-checklist-smoke' },
    }
  );
  assert(
    weekTwoLocalValidationPassExecutionChecklist.status === 200,
    `Expected week-two-local-validation-pass-execution-checklist 200, got ${weekTwoLocalValidationPassExecutionChecklist.status}`
  );
  assert(
    weekTwoLocalValidationPassExecutionChecklist.headers.get('x-request-id') ===
      'gcsc-week-two-local-validation-pass-execution-checklist-smoke' &&
      weekTwoLocalValidationPassExecutionChecklist.body?.request_id ===
        'gcsc-week-two-local-validation-pass-execution-checklist-smoke',
    'Week 2 local validation pass execution checklist endpoint must preserve request-id traceability'
  );
  const directWeekTwoValidationExecutionIds = (
    weekTwoLocalValidationPassExecutionChecklist.body?.items || []
  ).map((item) => item.id);
  const directWeekTwoValidationExecutionBlockedActions =
    weekTwoLocalValidationPassExecutionChecklist.body?.blocked_live_actions || [];
  assert(
    weekTwoLocalValidationPassExecutionChecklist.body?.mode ===
      'week_two_local_validation_pass_execution_checklist' &&
      weekTwoLocalValidationPassExecutionChecklist.body?.status ===
        'local_validation_pass_execution_held_until_safe_scoped_checks' &&
      weekTwoLocalValidationPassExecutionChecklist.body?.item_count === 4 &&
      weekTwoLocalValidationPassExecutionChecklist.body?.validation_execution_checklist_count === 4 &&
      directWeekTwoValidationExecutionIds.includes('week_two_validation_command_run_order_hold') &&
      directWeekTwoValidationExecutionIds.includes('week_two_validation_public_file_diff_hold') &&
      directWeekTwoValidationExecutionIds.includes('week_two_validation_failure_rerun_hold') &&
      directWeekTwoValidationExecutionIds.includes('week_two_validation_commit_report_hold'),
    'Week 2 local validation pass execution checklist endpoint must expose the four validation execution rows'
  );
  assert(
    weekTwoLocalValidationPassExecutionChecklist.body?.readiness_state_counts
      ?.VALIDATION_COMMAND_RUN_ORDER_HELD === 1 &&
      weekTwoLocalValidationPassExecutionChecklist.body?.readiness_state_counts?.PUBLIC_FILE_DIFF_HELD === 1 &&
      weekTwoLocalValidationPassExecutionChecklist.body?.readiness_state_counts
        ?.FAILED_VALIDATION_RERUN_HELD === 1 &&
      weekTwoLocalValidationPassExecutionChecklist.body?.readiness_state_counts
        ?.VALIDATION_COMMIT_REPORT_HELD === 1 &&
      weekTwoLocalValidationPassExecutionChecklist.body?.execution_phase_counts?.command_run_order_hold === 1 &&
      weekTwoLocalValidationPassExecutionChecklist.body?.execution_phase_counts?.public_file_diff_hold === 1 &&
      weekTwoLocalValidationPassExecutionChecklist.body?.execution_phase_counts?.failure_rerun_hold === 1 &&
      weekTwoLocalValidationPassExecutionChecklist.body?.execution_phase_counts?.commit_report_hold === 1 &&
      weekTwoLocalValidationPassExecutionChecklist.body?.review_area_counts?.command_order === 1 &&
      weekTwoLocalValidationPassExecutionChecklist.body?.review_area_counts?.public_file_guard === 1 &&
      weekTwoLocalValidationPassExecutionChecklist.body?.review_area_counts?.failure_rerun === 1 &&
      weekTwoLocalValidationPassExecutionChecklist.body?.review_area_counts?.commit_report === 1 &&
      weekTwoLocalValidationPassExecutionChecklist.body?.required_command_count >= 12 &&
      weekTwoLocalValidationPassExecutionChecklist.body?.founder_report_field_count >= 25 &&
      Array.isArray(weekTwoLocalValidationPassExecutionChecklist.body?.linked_surfaces) &&
      weekTwoLocalValidationPassExecutionChecklist.body.linked_surfaces.includes('/api/admin/beta-readiness'),
    'Week 2 local validation pass execution checklist endpoint must summarize states, phases, areas, commands, founder report fields, and linked surfaces'
  );
  assert(
    weekTwoLocalValidationPassExecutionChecklist.body?.safe_report_fields?.includes('command_order') &&
      weekTwoLocalValidationPassExecutionChecklist.body?.safe_report_fields?.includes('cached_public_diff_status') &&
      weekTwoLocalValidationPassExecutionChecklist.body?.safe_report_fields?.includes('failing_command') &&
      directWeekTwoValidationExecutionBlockedActions.includes('secret_entry') &&
      directWeekTwoValidationExecutionBlockedActions.includes('live_supabase_write') &&
      directWeekTwoValidationExecutionBlockedActions.includes('strict_rls_apply') &&
      directWeekTwoValidationExecutionBlockedActions.includes('external_account_change') &&
      directWeekTwoValidationExecutionBlockedActions.includes('deploy_setting_change') &&
      directWeekTwoValidationExecutionBlockedActions.includes('public_file_edit') &&
      directWeekTwoValidationExecutionBlockedActions.includes('public_whitepaper_html_replacement') &&
      directWeekTwoValidationExecutionBlockedActions.includes('public_url_share') &&
      directWeekTwoValidationExecutionBlockedActions.includes('tester_invite') &&
      directWeekTwoValidationExecutionBlockedActions.includes('real_payment') &&
      directWeekTwoValidationExecutionBlockedActions.includes('real_loan') &&
      directWeekTwoValidationExecutionBlockedActions.includes('real_escrow') &&
      directWeekTwoValidationExecutionBlockedActions.includes('stablecoin_settlement') &&
      directWeekTwoValidationExecutionBlockedActions.includes('token_collateral_lock') &&
      directWeekTwoValidationExecutionBlockedActions.includes('xpr_signature') &&
      directWeekTwoValidationExecutionBlockedActions.includes('fio_registration') &&
      directWeekTwoValidationExecutionBlockedActions.includes('provider_commitment') &&
      directWeekTwoValidationExecutionBlockedActions.includes('legal_conclusion') &&
      directWeekTwoValidationExecutionBlockedActions.includes('destructive_git_action') &&
      directWeekTwoValidationExecutionBlockedActions.includes('production_release') &&
      weekTwoLocalValidationPassExecutionChecklist.body?.no_secret_requested === true &&
      weekTwoLocalValidationPassExecutionChecklist.body?.no_live_supabase_write_attempted === true &&
      weekTwoLocalValidationPassExecutionChecklist.body?.no_strict_rls_apply_attempted === true &&
      weekTwoLocalValidationPassExecutionChecklist.body?.no_external_account_change_attempted === true &&
      weekTwoLocalValidationPassExecutionChecklist.body?.no_deploy_setting_change_attempted === true &&
      weekTwoLocalValidationPassExecutionChecklist.body?.no_public_file_edit_attempted === true &&
      weekTwoLocalValidationPassExecutionChecklist.body?.no_public_url_share_attempted === true &&
      weekTwoLocalValidationPassExecutionChecklist.body?.no_tester_invite_attempted === true &&
      weekTwoLocalValidationPassExecutionChecklist.body?.no_live_finance_action_attempted === true &&
      weekTwoLocalValidationPassExecutionChecklist.body?.no_xpr_signature_attempted === true &&
      weekTwoLocalValidationPassExecutionChecklist.body?.no_fio_registration_attempted === true &&
      weekTwoLocalValidationPassExecutionChecklist.body?.no_legal_provider_decision_attempted === true &&
      weekTwoLocalValidationPassExecutionChecklist.body?.no_production_release_attempted === true &&
      weekTwoLocalValidationPassExecutionChecklist.body?.no_destructive_git_action_attempted === true &&
      weekTwoLocalValidationPassExecutionChecklist.body?.no_external_send_attempted === true &&
      weekTwoLocalValidationPassExecutionChecklist.body?.no_live_action_attempted === true,
    'Week 2 local validation pass execution checklist endpoint must expose safe report fields and block raw/public/live/finance/XPR/FIO/legal/provider/destructive actions'
  );

  const weekTwoTwoWeekCloseoutReadiness = await request(baseUrl, '/api/admin/week-two-two-week-closeout-readiness', {
    headers: { 'X-Request-Id': 'gcsc-week-two-two-week-closeout-readiness-smoke' },
  });
  assert(
    weekTwoTwoWeekCloseoutReadiness.status === 200,
    `Expected week-two-two-week-closeout-readiness 200, got ${weekTwoTwoWeekCloseoutReadiness.status}`
  );
  assert(
    weekTwoTwoWeekCloseoutReadiness.headers.get('x-request-id') ===
      'gcsc-week-two-two-week-closeout-readiness-smoke' &&
      weekTwoTwoWeekCloseoutReadiness.body?.request_id === 'gcsc-week-two-two-week-closeout-readiness-smoke',
    'Week 2 two-week closeout readiness endpoint must preserve request-id traceability'
  );
  const directWeekTwoCloseoutIds = (weekTwoTwoWeekCloseoutReadiness.body?.items || []).map((item) => item.id);
  const directWeekTwoCloseoutBlockedActions = weekTwoTwoWeekCloseoutReadiness.body?.blocked_live_actions || [];
  assert(
    weekTwoTwoWeekCloseoutReadiness.body?.mode === 'week_two_two_week_closeout_readiness' &&
      weekTwoTwoWeekCloseoutReadiness.body?.status ===
        'two_week_closeout_readiness_local_only_live_actions_blocked' &&
      weekTwoTwoWeekCloseoutReadiness.body?.item_count === 4 &&
      weekTwoTwoWeekCloseoutReadiness.body?.closeout_readiness_count === 4 &&
      directWeekTwoCloseoutIds.includes('week_two_closeout_done_inventory_review') &&
      directWeekTwoCloseoutIds.includes('week_two_closeout_validation_evidence_review') &&
      directWeekTwoCloseoutIds.includes('week_two_closeout_founder_action_queue_review') &&
      directWeekTwoCloseoutIds.includes('week_two_closeout_next_plan_seed_review'),
    'Week 2 two-week closeout readiness endpoint must expose the four closeout rows'
  );
  assert(
    weekTwoTwoWeekCloseoutReadiness.body?.readiness_state_counts?.DONE_INVENTORY_REVIEW_READY === 1 &&
      weekTwoTwoWeekCloseoutReadiness.body?.readiness_state_counts?.VALIDATION_EVIDENCE_REVIEW_READY === 1 &&
      weekTwoTwoWeekCloseoutReadiness.body?.readiness_state_counts?.FOUNDER_ACTION_QUEUE_REVIEW_READY === 1 &&
      weekTwoTwoWeekCloseoutReadiness.body?.readiness_state_counts?.NEXT_TWO_WEEK_PLAN_SEED_READY === 1 &&
      weekTwoTwoWeekCloseoutReadiness.body?.checklist_phase_counts?.done_inventory === 1 &&
      weekTwoTwoWeekCloseoutReadiness.body?.checklist_phase_counts?.validation_evidence === 1 &&
      weekTwoTwoWeekCloseoutReadiness.body?.checklist_phase_counts?.founder_actions === 1 &&
      weekTwoTwoWeekCloseoutReadiness.body?.checklist_phase_counts?.next_plan_seed === 1 &&
      weekTwoTwoWeekCloseoutReadiness.body?.review_area_counts?.completed_scope === 1 &&
      weekTwoTwoWeekCloseoutReadiness.body?.review_area_counts?.local_checks === 1 &&
      weekTwoTwoWeekCloseoutReadiness.body?.review_area_counts?.founder_blockers === 1 &&
      weekTwoTwoWeekCloseoutReadiness.body?.review_area_counts?.next_plan === 1 &&
      weekTwoTwoWeekCloseoutReadiness.body?.required_evidence_count >= 20 &&
      weekTwoTwoWeekCloseoutReadiness.body?.founder_report_field_count >= 24 &&
      Array.isArray(weekTwoTwoWeekCloseoutReadiness.body?.linked_surfaces) &&
      weekTwoTwoWeekCloseoutReadiness.body.linked_surfaces.includes('/api/admin/beta-readiness'),
    'Week 2 two-week closeout readiness endpoint must summarize states, phases, areas, evidence, founder report fields, and linked surfaces'
  );
  assert(
    weekTwoTwoWeekCloseoutReadiness.body?.safe_report_fields?.includes('completed_surface_id') &&
      weekTwoTwoWeekCloseoutReadiness.body?.safe_report_fields?.includes('public_file_guard_status') &&
      weekTwoTwoWeekCloseoutReadiness.body?.safe_report_fields?.includes('founder_action_id') &&
      weekTwoTwoWeekCloseoutReadiness.body?.safe_report_fields?.includes('next_plan_theme') &&
      directWeekTwoCloseoutBlockedActions.includes('secret_entry') &&
      directWeekTwoCloseoutBlockedActions.includes('magic_link_url_paste') &&
      directWeekTwoCloseoutBlockedActions.includes('service_role_key_use') &&
      directWeekTwoCloseoutBlockedActions.includes('live_supabase_write') &&
      directWeekTwoCloseoutBlockedActions.includes('admin_membership_insert') &&
      directWeekTwoCloseoutBlockedActions.includes('strict_rls_apply') &&
      directWeekTwoCloseoutBlockedActions.includes('external_account_change') &&
      directWeekTwoCloseoutBlockedActions.includes('deploy_setting_change') &&
      directWeekTwoCloseoutBlockedActions.includes('public_file_edit') &&
      directWeekTwoCloseoutBlockedActions.includes('public_whitepaper_html_replacement') &&
      directWeekTwoCloseoutBlockedActions.includes('public_url_share') &&
      directWeekTwoCloseoutBlockedActions.includes('tester_invite') &&
      directWeekTwoCloseoutBlockedActions.includes('external_send') &&
      directWeekTwoCloseoutBlockedActions.includes('real_payment') &&
      directWeekTwoCloseoutBlockedActions.includes('real_loan') &&
      directWeekTwoCloseoutBlockedActions.includes('real_escrow') &&
      directWeekTwoCloseoutBlockedActions.includes('stablecoin_settlement') &&
      directWeekTwoCloseoutBlockedActions.includes('token_collateral_lock') &&
      directWeekTwoCloseoutBlockedActions.includes('xpr_signature') &&
      directWeekTwoCloseoutBlockedActions.includes('fio_registration') &&
      directWeekTwoCloseoutBlockedActions.includes('provider_commitment') &&
      directWeekTwoCloseoutBlockedActions.includes('legal_conclusion') &&
      directWeekTwoCloseoutBlockedActions.includes('destructive_git_action') &&
      directWeekTwoCloseoutBlockedActions.includes('production_release') &&
      weekTwoTwoWeekCloseoutReadiness.body?.no_secret_requested === true &&
      weekTwoTwoWeekCloseoutReadiness.body?.no_magic_link_url_requested === true &&
      weekTwoTwoWeekCloseoutReadiness.body?.no_service_role_key_used === true &&
      weekTwoTwoWeekCloseoutReadiness.body?.no_live_supabase_write_attempted === true &&
      weekTwoTwoWeekCloseoutReadiness.body?.no_admin_membership_insert_attempted === true &&
      weekTwoTwoWeekCloseoutReadiness.body?.no_strict_rls_apply_attempted === true &&
      weekTwoTwoWeekCloseoutReadiness.body?.no_external_account_change_attempted === true &&
      weekTwoTwoWeekCloseoutReadiness.body?.no_deploy_setting_change_attempted === true &&
      weekTwoTwoWeekCloseoutReadiness.body?.no_public_file_edit_attempted === true &&
      weekTwoTwoWeekCloseoutReadiness.body?.no_public_url_share_attempted === true &&
      weekTwoTwoWeekCloseoutReadiness.body?.no_tester_invite_attempted === true &&
      weekTwoTwoWeekCloseoutReadiness.body?.no_external_send_attempted === true &&
      weekTwoTwoWeekCloseoutReadiness.body?.no_live_finance_action_attempted === true &&
      weekTwoTwoWeekCloseoutReadiness.body?.no_xpr_signature_attempted === true &&
      weekTwoTwoWeekCloseoutReadiness.body?.no_fio_registration_attempted === true &&
      weekTwoTwoWeekCloseoutReadiness.body?.no_legal_provider_decision_attempted === true &&
      weekTwoTwoWeekCloseoutReadiness.body?.no_production_release_attempted === true &&
      weekTwoTwoWeekCloseoutReadiness.body?.no_destructive_git_action_attempted === true &&
      weekTwoTwoWeekCloseoutReadiness.body?.no_live_action_attempted === true,
    'Week 2 two-week closeout readiness endpoint must expose safe report fields and block secret/Auth/public/external/live/finance/XPR/FIO/legal/provider/destructive actions'
  );

  const publicBetaNextStepReadiness = await request(baseUrl, '/api/admin/public-beta-next-step-readiness', {
    headers: { 'X-Request-Id': 'gcsc-public-beta-next-step-readiness-smoke' },
  });
  assert(
    publicBetaNextStepReadiness.status === 200,
    `Expected public-beta-next-step-readiness 200, got ${publicBetaNextStepReadiness.status}`
  );
  assert(
    publicBetaNextStepReadiness.headers.get('x-request-id') === 'gcsc-public-beta-next-step-readiness-smoke' &&
      publicBetaNextStepReadiness.body?.request_id === 'gcsc-public-beta-next-step-readiness-smoke',
    'Public beta next-step readiness endpoint must preserve request-id traceability'
  );
  const directPublicBetaNextStepIds = (publicBetaNextStepReadiness.body?.items || []).map((item) => item.id);
  const directPublicBetaNextStepBlockedActions = publicBetaNextStepReadiness.body?.blocked_live_actions || [];
  assert(
    publicBetaNextStepReadiness.body?.mode === 'public_beta_next_step_readiness' &&
      publicBetaNextStepReadiness.body?.status === 'blocked_until_founder_public_beta_scope_and_invite_review' &&
      publicBetaNextStepReadiness.body?.item_count === 4 &&
      directPublicBetaNextStepIds.includes('public_beta_scope_decision_review') &&
      directPublicBetaNextStepIds.includes('public_beta_url_smoke_evidence_review') &&
      directPublicBetaNextStepIds.includes('public_beta_invite_approval_stop_gate') &&
      directPublicBetaNextStepIds.includes('public_beta_support_triage_readiness'),
    'Public beta next-step readiness endpoint must expose the four public beta review rows'
  );
  assert(
    publicBetaNextStepReadiness.body?.readiness_state_counts?.BLOCKED_UNTIL_PUBLIC_BETA_SCOPE_REVIEW === 1 &&
      publicBetaNextStepReadiness.body?.readiness_state_counts?.URL_PENDING_FOUNDER_DEPLOYMENT_REQUIRED === 1 &&
      publicBetaNextStepReadiness.body?.readiness_state_counts?.BLOCKED_UNTIL_PUBLIC_BETA_INVITE_ACTION_RECORDED === 1 &&
      publicBetaNextStepReadiness.body?.readiness_state_counts?.LOCAL_SUPPORT_TRIAGE_READY_REVIEW === 1 &&
      publicBetaNextStepReadiness.body?.review_area_counts?.scope === 1 &&
      publicBetaNextStepReadiness.body?.review_area_counts?.url_smoke === 1 &&
      publicBetaNextStepReadiness.body?.review_area_counts?.invite_approval === 1 &&
      publicBetaNextStepReadiness.body?.review_area_counts?.support_triage === 1 &&
      publicBetaNextStepReadiness.body?.required_evidence_count >= 16,
    'Public beta next-step readiness endpoint must summarize readiness states, review areas, and required evidence'
  );
  assert(
    publicBetaNextStepReadiness.body?.safe_report_fields?.includes('redacted_public_beta_url_label') &&
      publicBetaNextStepReadiness.body?.safe_report_fields?.includes('invite_scope') &&
      publicBetaNextStepReadiness.body?.safe_report_fields?.includes('rollback_or_hold_decision') &&
      publicBetaNextStepReadiness.body?.safe_report_fields?.includes('no_secret_confirmation') &&
      directPublicBetaNextStepBlockedActions.includes('public_beta_launch') &&
      directPublicBetaNextStepBlockedActions.includes('real_public_url_in_repo') &&
      directPublicBetaNextStepBlockedActions.includes('public_url_share') &&
      directPublicBetaNextStepBlockedActions.includes('tester_invite') &&
      directPublicBetaNextStepBlockedActions.includes('external_send') &&
      directPublicBetaNextStepBlockedActions.includes('production_release') &&
      directPublicBetaNextStepBlockedActions.includes('payment_or_loan_action') &&
      directPublicBetaNextStepBlockedActions.includes('legal_or_provider_decision') &&
      publicBetaNextStepReadiness.body?.no_secret_requested === true &&
      publicBetaNextStepReadiness.body?.no_external_send_attempted === true &&
      publicBetaNextStepReadiness.body?.no_public_url_share_attempted === true &&
      publicBetaNextStepReadiness.body?.no_tester_invite_attempted === true &&
      publicBetaNextStepReadiness.body?.no_deploy_setting_change_attempted === true &&
      publicBetaNextStepReadiness.body?.no_supabase_redirect_change_attempted === true &&
      publicBetaNextStepReadiness.body?.no_live_finance_action_attempted === true &&
      publicBetaNextStepReadiness.body?.no_legal_provider_decision_attempted === true &&
      publicBetaNextStepReadiness.body?.no_production_release_attempted === true &&
      publicBetaNextStepReadiness.body?.no_live_action_attempted === true,
    'Public beta next-step readiness endpoint must expose safe report fields and block share/invite/external-send/live actions'
  );

  const publicBetaNextStepExecutionChecklist = await request(baseUrl, '/api/admin/public-beta-next-step-execution-checklist', {
    headers: { 'X-Request-Id': 'gcsc-public-beta-next-step-execution-checklist-smoke' },
  });
  assert(
    publicBetaNextStepExecutionChecklist.status === 200,
    `Expected public-beta-next-step-execution-checklist 200, got ${publicBetaNextStepExecutionChecklist.status}`
  );
  assert(
    publicBetaNextStepExecutionChecklist.headers.get('x-request-id') ===
      'gcsc-public-beta-next-step-execution-checklist-smoke' &&
      publicBetaNextStepExecutionChecklist.body?.request_id === 'gcsc-public-beta-next-step-execution-checklist-smoke',
    'Public beta next-step execution checklist endpoint must preserve request-id traceability'
  );
  const directPublicBetaExecutionIds = (publicBetaNextStepExecutionChecklist.body?.items || []).map((item) => item.id);
  const directPublicBetaExecutionBlockedActions =
    publicBetaNextStepExecutionChecklist.body?.blocked_live_actions || [];
  assert(
    publicBetaNextStepExecutionChecklist.body?.mode === 'public_beta_next_step_execution_checklist' &&
      publicBetaNextStepExecutionChecklist.body?.status === 'blocked_until_founder_public_beta_execution_evidence' &&
      publicBetaNextStepExecutionChecklist.body?.item_count === 4 &&
      publicBetaNextStepExecutionChecklist.body?.public_beta_execution_checklist_count === 4 &&
      publicBetaNextStepExecutionChecklist.body?.execution_checklist_count === 4 &&
      directPublicBetaExecutionIds.includes('public_beta_scope_report_back_intake') &&
      directPublicBetaExecutionIds.includes('public_beta_url_smoke_report_back_intake') &&
      directPublicBetaExecutionIds.includes('public_beta_invite_request_hold') &&
      directPublicBetaExecutionIds.includes('public_beta_support_triage_hold'),
    'Public beta next-step execution checklist endpoint must expose the four execution checklist rows'
  );
  assert(
    publicBetaNextStepExecutionChecklist.body?.readiness_state_counts?.PUBLIC_BETA_SCOPE_REPORT_BACK_REQUIRED === 1 &&
      publicBetaNextStepExecutionChecklist.body?.readiness_state_counts?.PUBLIC_BETA_URL_SMOKE_REPORT_BACK_REQUIRED === 1 &&
      publicBetaNextStepExecutionChecklist.body?.readiness_state_counts?.PUBLIC_BETA_INVITE_REQUEST_HELD === 1 &&
      publicBetaNextStepExecutionChecklist.body?.readiness_state_counts?.PUBLIC_BETA_SUPPORT_TRIAGE_HELD === 1 &&
      publicBetaNextStepExecutionChecklist.body?.execution_phase_counts?.scope_report_back === 1 &&
      publicBetaNextStepExecutionChecklist.body?.execution_phase_counts?.url_smoke_report_back === 1 &&
      publicBetaNextStepExecutionChecklist.body?.execution_phase_counts?.invite_request_hold === 1 &&
      publicBetaNextStepExecutionChecklist.body?.execution_phase_counts?.support_triage_hold === 1 &&
      publicBetaNextStepExecutionChecklist.body?.review_area_counts?.scope === 1 &&
      publicBetaNextStepExecutionChecklist.body?.review_area_counts?.url_smoke === 1 &&
      publicBetaNextStepExecutionChecklist.body?.review_area_counts?.invite === 1 &&
      publicBetaNextStepExecutionChecklist.body?.review_area_counts?.support_triage === 1 &&
      publicBetaNextStepExecutionChecklist.body?.required_evidence_count >= 16 &&
      publicBetaNextStepExecutionChecklist.body?.founder_report_field_count >= 20,
    'Public beta next-step execution checklist endpoint must summarize readiness states, execution phases, review areas, and evidence fields'
  );
  assert(
    publicBetaNextStepExecutionChecklist.body?.safe_report_fields?.includes('redacted_public_beta_url_label') &&
      publicBetaNextStepExecutionChecklist.body?.safe_report_fields?.includes('health_request_id') &&
      publicBetaNextStepExecutionChecklist.body?.safe_report_fields?.includes('public_beta_invite_decision_phrase_status') &&
      publicBetaNextStepExecutionChecklist.body?.safe_report_fields?.includes('support_followup_hold_status') &&
      directPublicBetaExecutionBlockedActions.includes('public_beta_launch') &&
      directPublicBetaExecutionBlockedActions.includes('real_public_url_storage') &&
      directPublicBetaExecutionBlockedActions.includes('public_url_share') &&
      directPublicBetaExecutionBlockedActions.includes('tester_invite') &&
      directPublicBetaExecutionBlockedActions.includes('external_send') &&
      directPublicBetaExecutionBlockedActions.includes('sensitive_data_collection') &&
      directPublicBetaExecutionBlockedActions.includes('supabase_redirect_update') &&
      directPublicBetaExecutionBlockedActions.includes('service_role_key_entry') &&
      directPublicBetaExecutionBlockedActions.includes('live_supabase_write') &&
      directPublicBetaExecutionBlockedActions.includes('payment_or_loan_action') &&
      directPublicBetaExecutionBlockedActions.includes('xpr_signature') &&
      directPublicBetaExecutionBlockedActions.includes('legal_or_provider_decision') &&
      publicBetaNextStepExecutionChecklist.body?.no_secret_requested === true &&
      publicBetaNextStepExecutionChecklist.body?.no_external_send_attempted === true &&
      publicBetaNextStepExecutionChecklist.body?.no_public_url_share_attempted === true &&
      publicBetaNextStepExecutionChecklist.body?.no_tester_invite_attempted === true &&
      publicBetaNextStepExecutionChecklist.body?.no_sensitive_data_collection_attempted === true &&
      publicBetaNextStepExecutionChecklist.body?.no_deploy_setting_change_attempted === true &&
      publicBetaNextStepExecutionChecklist.body?.no_supabase_redirect_change_attempted === true &&
      publicBetaNextStepExecutionChecklist.body?.no_live_supabase_write_attempted === true &&
      publicBetaNextStepExecutionChecklist.body?.no_live_finance_action_attempted === true &&
      publicBetaNextStepExecutionChecklist.body?.no_xpr_signature_attempted === true &&
      publicBetaNextStepExecutionChecklist.body?.no_legal_provider_decision_attempted === true &&
      publicBetaNextStepExecutionChecklist.body?.no_production_release_attempted === true &&
      publicBetaNextStepExecutionChecklist.body?.no_live_action_attempted === true,
    'Public beta next-step execution checklist endpoint must expose safe report fields and block launch/share/invite/secret/finance/XPR/legal/live actions'
  );

  const adminEvidenceExportPreviewFounderActionCenter = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=founder_action_center',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-founder-action-center-smoke' },
    }
  );
  const founderActionCenterExportBoundary =
    'No founder secrets, passwords, API keys, service-role keys, wallet keys, raw env values, external account session data, connector tokens, Magic Link URLs, Auth tokens, live Supabase approvals, admin membership approvals, deploy/share/invite approvals, payment/loan/escrow/token/XPR approvals, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this founder Action Center preview.';
  const founderActionCenterSource =
    adminEvidenceExportPreviewFounderActionCenter.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewFounderActionCenter.status === 200,
    `Expected Founder Action Center admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewFounderActionCenter.status}`
  );
  assert(
    adminEvidenceExportPreviewFounderActionCenter.body?.selected_source_filter === 'founder_action_center' &&
      adminEvidenceExportPreviewFounderActionCenter.body?.valid_source_filters?.includes('founder_action_center'),
    'Founder Action Center admin evidence export preview must accept the founder_action_center source filter'
  );
  assert(
    adminEvidenceExportPreviewFounderActionCenter.body?.evidence_sources?.length === 1 &&
      founderActionCenterSource?.id === 'founder_action_center',
    'Founder Action Center admin evidence export preview must return only the founder_action_center source'
  );
  assert(
    adminEvidenceExportPreviewFounderActionCenter.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewFounderActionCenter.body.review_router.targets[0]?.source_id === 'founder_action_center' &&
      adminEvidenceExportPreviewFounderActionCenter.body.review_router.targets[0]?.ui_anchor === 'founderActionGrid',
    'Founder Action Center admin evidence export preview review router must point to founderActionGrid'
  );
  assert(
    founderActionCenterSource?.allowed_fields?.includes('action_item_count') &&
      founderActionCenterSource?.allowed_fields?.includes('action_phase_counts') &&
      founderActionCenterSource?.allowed_fields?.includes('action_status_counts') &&
      founderActionCenterSource?.allowed_fields?.includes('week_two_board_count') &&
      founderActionCenterSource?.allowed_fields?.includes('selected_week_two_phase_filter') &&
      founderActionCenterSource?.allowed_fields?.includes('valid_week_two_phase_filter_ids') &&
      founderActionCenterSource?.allowed_fields?.includes('filtered_week_two_board_count') &&
      founderActionCenterSource?.allowed_fields?.includes('week_two_phase_counts') &&
      founderActionCenterSource?.allowed_fields?.includes('week_two_status_counts') &&
      founderActionCenterSource?.allowed_fields?.includes('week_two_phase_options') &&
      founderActionCenterSource?.allowed_fields?.includes('week_two_next_action_count') &&
      founderActionCenterSource?.allowed_fields?.includes('filtered_week_two_next_action_count') &&
      founderActionCenterSource?.allowed_fields?.includes('founder_decision_needed') &&
      founderActionCenterSource?.allowed_fields?.includes('codex_next_safe_action') &&
      founderActionCenterSource?.allowed_fields?.includes('evidence_sources') &&
      founderActionCenterSource?.allowed_fields?.includes('connector_status') &&
      founderActionCenterSource?.allowed_fields?.includes('safety_rule_count') &&
      founderActionCenterSource?.allowed_fields?.includes('no_external_account_change_attempted') &&
      founderActionCenterSource?.allowed_fields?.includes('no_service_role_key_paste_attempted') &&
      founderActionCenterSource?.allowed_fields?.includes('no_admin_membership_insert_attempted') &&
      founderActionCenterSource?.allowed_fields?.includes('no_live_supabase_change_attempted') &&
      founderActionCenterSource?.allowed_fields?.includes('no_deploy_setting_change_attempted') &&
      founderActionCenterSource?.allowed_fields?.includes('no_week_two_live_action_attempted') &&
      founderActionCenterSource?.allowed_fields?.includes('no_external_export_attempted') &&
      founderActionCenterSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Founder Action Center admin evidence export preview must allow action-center metadata and boundary fields only'
  );
  assert(
    founderActionCenterSource?.blocked_fields?.includes('founder_secret') &&
      founderActionCenterSource?.blocked_fields?.includes('password') &&
      founderActionCenterSource?.blocked_fields?.includes('api_key') &&
      founderActionCenterSource?.blocked_fields?.includes('service_role_key') &&
      founderActionCenterSource?.blocked_fields?.includes('external_account_session') &&
      founderActionCenterSource?.blocked_fields?.includes('connector_token') &&
      founderActionCenterSource?.blocked_fields?.includes('magic_link_url') &&
      founderActionCenterSource?.blocked_fields?.includes('auth_token') &&
      founderActionCenterSource?.blocked_fields?.includes('admin_memberships_insert_sql') &&
      founderActionCenterSource?.blocked_fields?.includes('admin_membership_insert_approval') &&
      founderActionCenterSource?.blocked_fields?.includes('live_supabase_write_approval') &&
      founderActionCenterSource?.blocked_fields?.includes('live_supabase_change_approval') &&
      founderActionCenterSource?.blocked_fields?.includes('deploy_account_approval') &&
      founderActionCenterSource?.blocked_fields?.includes('deploy_setting_change_approval') &&
      founderActionCenterSource?.blocked_fields?.includes('public_beta_approval') &&
      founderActionCenterSource?.blocked_fields?.includes('week_two_live_approval') &&
      founderActionCenterSource?.blocked_fields?.includes('app_store_submission_approval') &&
      founderActionCenterSource?.blocked_fields?.includes('public_release_approval') &&
      founderActionCenterSource?.blocked_fields?.includes('payment_or_loan_action_approval') &&
      founderActionCenterSource?.blocked_fields?.includes('external_send_approval') &&
      founderActionCenterSource?.blocked_fields?.includes('xpr_signature_approval') &&
      founderActionCenterSource?.blocked_fields?.includes('legal_decision') &&
      founderActionCenterSource?.blocked_fields?.includes('live_action_approval'),
    'Founder Action Center admin evidence export preview must block secret/account/Auth/admin/live Supabase/deploy/beta/finance/XPR/legal/live fields'
  );
  assert(
    founderActionCenterSource?.raw_content_storage_boundary === founderActionCenterExportBoundary,
    'Founder Action Center admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewFounderActionCenter.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewFounderActionCenter.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewFounderActionCenter.body?.no_live_action_attempted === true,
    'Founder Action Center admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

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

  const adminEvidenceExportPreviewFounderAuthSetup = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=founder_auth_setup',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-founder-auth-setup-smoke' },
    }
  );
  const founderAuthSetupExportBoundary =
    'No Magic Link URLs, Auth tokens, session cookies, raw founder identity data, raw current_session payloads, selected-user screenshots, service-role keys, raw env values, admin_memberships insert approvals or SQL, profile repair approvals, Auth role change approvals, strict RLS apply approvals, live Supabase changes, deploy/public beta approvals, payment/loan/escrow/token/XPR approvals, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this founder Auth setup preview.';
  const founderAuthSetupSource = adminEvidenceExportPreviewFounderAuthSetup.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewFounderAuthSetup.status === 200,
    `Expected founder Auth setup admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewFounderAuthSetup.status}`
  );
  assert(
    adminEvidenceExportPreviewFounderAuthSetup.body?.selected_source_filter === 'founder_auth_setup' &&
      adminEvidenceExportPreviewFounderAuthSetup.body?.valid_source_filters?.includes('founder_auth_setup'),
    'Founder Auth setup admin evidence export preview must accept the founder_auth_setup source filter'
  );
  assert(
    adminEvidenceExportPreviewFounderAuthSetup.body?.evidence_sources?.length === 1 &&
      founderAuthSetupSource?.id === 'founder_auth_setup',
    'Founder Auth setup admin evidence export preview must return only the founder_auth_setup source'
  );
  assert(
    adminEvidenceExportPreviewFounderAuthSetup.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewFounderAuthSetup.body.review_router.targets[0]?.source_id === 'founder_auth_setup' &&
      adminEvidenceExportPreviewFounderAuthSetup.body.review_router.targets[0]?.ui_anchor === 'founderAuthSetupGrid',
    'Founder Auth setup admin evidence export preview review router must point to founderAuthSetupGrid'
  );
  assert(
    founderAuthSetupSource?.allowed_fields?.includes('setup_checklist_count') &&
      founderAuthSetupSource?.allowed_fields?.includes('setup_summary_counts') &&
      founderAuthSetupSource?.allowed_fields?.includes('membership_summary_status') &&
      founderAuthSetupSource?.allowed_fields?.includes('current_session_status') &&
      founderAuthSetupSource?.allowed_fields?.includes('safe_scope_count') &&
      founderAuthSetupSource?.allowed_fields?.includes('no_magic_link_url_paste_attempted') &&
      founderAuthSetupSource?.allowed_fields?.includes('no_auth_token_paste_attempted') &&
      founderAuthSetupSource?.allowed_fields?.includes('no_service_role_key_paste_attempted') &&
      founderAuthSetupSource?.allowed_fields?.includes('no_admin_membership_insert_attempted') &&
      founderAuthSetupSource?.allowed_fields?.includes('no_strict_rls_apply_attempted') &&
      founderAuthSetupSource?.allowed_fields?.includes('no_external_export_attempted') &&
      founderAuthSetupSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Founder Auth setup admin evidence export preview must allow setup metadata and boundary fields only'
  );
  assert(
    founderAuthSetupSource?.blocked_fields?.includes('current_session') &&
      founderAuthSetupSource?.blocked_fields?.includes('raw_current_session') &&
      founderAuthSetupSource?.blocked_fields?.includes('auth_binding_payload') &&
      founderAuthSetupSource?.blocked_fields?.includes('selected_user_screenshot') &&
      founderAuthSetupSource?.blocked_fields?.includes('magic_link_url') &&
      founderAuthSetupSource?.blocked_fields?.includes('auth_token') &&
      founderAuthSetupSource?.blocked_fields?.includes('session_cookie') &&
      founderAuthSetupSource?.blocked_fields?.includes('service_role_key') &&
      founderAuthSetupSource?.blocked_fields?.includes('admin_memberships_insert_sql') &&
      founderAuthSetupSource?.blocked_fields?.includes('profile_repair_approval') &&
      founderAuthSetupSource?.blocked_fields?.includes('auth_role_change_approval') &&
      founderAuthSetupSource?.blocked_fields?.includes('strict_rls_apply_approval') &&
      founderAuthSetupSource?.blocked_fields?.includes('live_supabase_change_approval') &&
      founderAuthSetupSource?.blocked_fields?.includes('deploy_setting_change_approval') &&
      founderAuthSetupSource?.blocked_fields?.includes('public_beta_approval') &&
      founderAuthSetupSource?.blocked_fields?.includes('payment_or_loan_action_approval') &&
      founderAuthSetupSource?.blocked_fields?.includes('xpr_signature_approval') &&
      founderAuthSetupSource?.blocked_fields?.includes('legal_decision') &&
      founderAuthSetupSource?.blocked_fields?.includes('live_action_approval'),
    'Founder Auth setup admin evidence export preview must block current-session, Auth token, raw identity, admin insert, profile repair, strict RLS, live Supabase, deploy, beta, finance/XPR, legal, and live fields'
  );
  assert(
    founderAuthSetupSource?.raw_content_storage_boundary === founderAuthSetupExportBoundary,
    'Founder Auth setup admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewFounderAuthSetup.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewFounderAuthSetup.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewFounderAuthSetup.body?.no_live_action_attempted === true,
    'Founder Auth setup admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

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

  const adminEvidenceExportPreviewFounderAuthSetupReport = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=founder_auth_setup_report',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-founder-auth-setup-report-smoke' },
    }
  );
  const founderAuthSetupReportExportBoundary =
    'No copyable founder steps, report sections, founder Auth live action gate board details, Magic Link URLs, Auth tokens, session cookies, raw founder identity data, selected-user screenshots, service-role keys, raw env values, admin_memberships insert approvals or SQL, profile repair approvals, Auth role change approvals, strict RLS apply approvals, live Supabase changes, deploy/public beta approvals, payment/loan/escrow/token/XPR approvals, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this founder Auth setup report preview.';
  const founderAuthSetupReportSource =
    adminEvidenceExportPreviewFounderAuthSetupReport.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewFounderAuthSetupReport.status === 200,
    `Expected founder Auth setup report admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewFounderAuthSetupReport.status}`
  );
  assert(
    adminEvidenceExportPreviewFounderAuthSetupReport.body?.selected_source_filter === 'founder_auth_setup_report' &&
      adminEvidenceExportPreviewFounderAuthSetupReport.body?.valid_source_filters?.includes('founder_auth_setup_report'),
    'Founder Auth setup report admin evidence export preview must accept the founder_auth_setup_report source filter'
  );
  assert(
    adminEvidenceExportPreviewFounderAuthSetupReport.body?.evidence_sources?.length === 1 &&
      founderAuthSetupReportSource?.id === 'founder_auth_setup_report',
    'Founder Auth setup report admin evidence export preview must return only the founder_auth_setup_report source'
  );
  assert(
    adminEvidenceExportPreviewFounderAuthSetupReport.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewFounderAuthSetupReport.body.review_router.targets[0]?.source_id === 'founder_auth_setup_report' &&
      adminEvidenceExportPreviewFounderAuthSetupReport.body.review_router.targets[0]?.ui_anchor === 'founderAuthSetupGrid',
    'Founder Auth setup report admin evidence export preview review router must point to founderAuthSetupGrid'
  );
  assert(
    founderAuthSetupReportSource?.allowed_fields?.includes('report_section_count') &&
      founderAuthSetupReportSource?.allowed_fields?.includes('live_action_gate_board_count') &&
      founderAuthSetupReportSource?.allowed_fields?.includes('report_gate_status') &&
      founderAuthSetupReportSource?.allowed_fields?.includes('safe_report_fields') &&
      founderAuthSetupReportSource?.allowed_fields?.includes('no_magic_link_url_paste_attempted') &&
      founderAuthSetupReportSource?.allowed_fields?.includes('no_auth_token_paste_attempted') &&
      founderAuthSetupReportSource?.allowed_fields?.includes('no_service_role_key_paste_attempted') &&
      founderAuthSetupReportSource?.allowed_fields?.includes('no_admin_membership_insert_attempted') &&
      founderAuthSetupReportSource?.allowed_fields?.includes('no_strict_rls_apply_attempted') &&
      founderAuthSetupReportSource?.allowed_fields?.includes('no_external_export_attempted') &&
      founderAuthSetupReportSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Founder Auth setup report admin evidence export preview must allow report metadata and boundary fields only'
  );
  assert(
    founderAuthSetupReportSource?.blocked_fields?.includes('copyable_founder_steps') &&
      founderAuthSetupReportSource?.blocked_fields?.includes('report_sections') &&
      founderAuthSetupReportSource?.blocked_fields?.includes('founder_auth_live_action_gate_board') &&
      founderAuthSetupReportSource?.blocked_fields?.includes('selected_user_screenshot') &&
      founderAuthSetupReportSource?.blocked_fields?.includes('magic_link_url') &&
      founderAuthSetupReportSource?.blocked_fields?.includes('auth_token') &&
      founderAuthSetupReportSource?.blocked_fields?.includes('session_cookie') &&
      founderAuthSetupReportSource?.blocked_fields?.includes('service_role_key') &&
      founderAuthSetupReportSource?.blocked_fields?.includes('admin_memberships_insert_sql') &&
      founderAuthSetupReportSource?.blocked_fields?.includes('profile_repair_approval') &&
      founderAuthSetupReportSource?.blocked_fields?.includes('auth_role_change_approval') &&
      founderAuthSetupReportSource?.blocked_fields?.includes('strict_rls_apply_approval') &&
      founderAuthSetupReportSource?.blocked_fields?.includes('live_supabase_change_approval') &&
      founderAuthSetupReportSource?.blocked_fields?.includes('deploy_setting_change_approval') &&
      founderAuthSetupReportSource?.blocked_fields?.includes('public_beta_approval') &&
      founderAuthSetupReportSource?.blocked_fields?.includes('payment_or_loan_action_approval') &&
      founderAuthSetupReportSource?.blocked_fields?.includes('xpr_signature_approval') &&
      founderAuthSetupReportSource?.blocked_fields?.includes('legal_decision') &&
      founderAuthSetupReportSource?.blocked_fields?.includes('live_action_approval'),
    'Founder Auth setup report admin evidence export preview must block copyable report, Auth token, raw identity, admin insert, profile repair, strict RLS, live Supabase, deploy, beta, finance/XPR, legal, and live fields'
  );
  assert(
    founderAuthSetupReportSource?.raw_content_storage_boundary === founderAuthSetupReportExportBoundary,
    'Founder Auth setup report admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewFounderAuthSetupReport.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewFounderAuthSetupReport.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewFounderAuthSetupReport.body?.no_live_action_attempted === true,
    'Founder Auth setup report admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
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

  const adminEvidenceExportPreviewFounderAuthSetupPrintTemplate = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=founder_auth_setup_print_template',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-founder-auth-setup-print-template-smoke' },
    }
  );
  const founderAuthSetupPrintTemplateExportBoundary =
    'No copyable markdown preview, print template sections, Magic Link URLs, Auth tokens, session cookies, raw founder identity data, selected-user screenshots, service-role keys, raw env values, admin_memberships insert approvals or SQL, profile repair approvals, Auth role change approvals, strict RLS apply approvals, live Supabase changes, deploy/public beta approvals, payment/loan/escrow/token/XPR approvals, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this founder Auth setup print template preview.';
  const founderAuthSetupPrintTemplateSource =
    adminEvidenceExportPreviewFounderAuthSetupPrintTemplate.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewFounderAuthSetupPrintTemplate.status === 200,
    `Expected founder Auth setup print template admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewFounderAuthSetupPrintTemplate.status}`
  );
  assert(
    adminEvidenceExportPreviewFounderAuthSetupPrintTemplate.body?.selected_source_filter === 'founder_auth_setup_print_template' &&
      adminEvidenceExportPreviewFounderAuthSetupPrintTemplate.body?.valid_source_filters?.includes('founder_auth_setup_print_template'),
    'Founder Auth setup print template admin evidence export preview must accept the founder_auth_setup_print_template source filter'
  );
  assert(
    adminEvidenceExportPreviewFounderAuthSetupPrintTemplate.body?.evidence_sources?.length === 1 &&
      founderAuthSetupPrintTemplateSource?.id === 'founder_auth_setup_print_template',
    'Founder Auth setup print template admin evidence export preview must return only the founder_auth_setup_print_template source'
  );
  assert(
    adminEvidenceExportPreviewFounderAuthSetupPrintTemplate.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewFounderAuthSetupPrintTemplate.body.review_router.targets[0]?.source_id === 'founder_auth_setup_print_template' &&
      adminEvidenceExportPreviewFounderAuthSetupPrintTemplate.body.review_router.targets[0]?.ui_anchor === 'founderAuthSetupGrid',
    'Founder Auth setup print template admin evidence export preview review router must point to founderAuthSetupGrid'
  );
  assert(
    founderAuthSetupPrintTemplateSource?.allowed_fields?.includes('print_template_section_count') &&
      founderAuthSetupPrintTemplateSource?.allowed_fields?.includes('print_export_gate_status') &&
      founderAuthSetupPrintTemplateSource?.allowed_fields?.includes('redaction_requirement_count') &&
      founderAuthSetupPrintTemplateSource?.allowed_fields?.includes('evidence_redaction_attestation') &&
      founderAuthSetupPrintTemplateSource?.allowed_fields?.includes('no_magic_link_url_paste_attempted') &&
      founderAuthSetupPrintTemplateSource?.allowed_fields?.includes('no_auth_token_paste_attempted') &&
      founderAuthSetupPrintTemplateSource?.allowed_fields?.includes('no_service_role_key_paste_attempted') &&
      founderAuthSetupPrintTemplateSource?.allowed_fields?.includes('no_admin_membership_insert_attempted') &&
      founderAuthSetupPrintTemplateSource?.allowed_fields?.includes('no_strict_rls_apply_attempted') &&
      founderAuthSetupPrintTemplateSource?.allowed_fields?.includes('no_external_export_attempted') &&
      founderAuthSetupPrintTemplateSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Founder Auth setup print template admin evidence export preview must allow print-template metadata and boundary fields only'
  );
  assert(
    founderAuthSetupPrintTemplateSource?.blocked_fields?.includes('copyable_markdown_preview') &&
      founderAuthSetupPrintTemplateSource?.blocked_fields?.includes('print_template_sections') &&
      founderAuthSetupPrintTemplateSource?.blocked_fields?.includes('selected_user_screenshot') &&
      founderAuthSetupPrintTemplateSource?.blocked_fields?.includes('magic_link_url') &&
      founderAuthSetupPrintTemplateSource?.blocked_fields?.includes('auth_token') &&
      founderAuthSetupPrintTemplateSource?.blocked_fields?.includes('session_cookie') &&
      founderAuthSetupPrintTemplateSource?.blocked_fields?.includes('service_role_key') &&
      founderAuthSetupPrintTemplateSource?.blocked_fields?.includes('admin_memberships_insert_sql') &&
      founderAuthSetupPrintTemplateSource?.blocked_fields?.includes('profile_repair_approval') &&
      founderAuthSetupPrintTemplateSource?.blocked_fields?.includes('auth_role_change_approval') &&
      founderAuthSetupPrintTemplateSource?.blocked_fields?.includes('strict_rls_apply_approval') &&
      founderAuthSetupPrintTemplateSource?.blocked_fields?.includes('live_supabase_change_approval') &&
      founderAuthSetupPrintTemplateSource?.blocked_fields?.includes('deploy_setting_change_approval') &&
      founderAuthSetupPrintTemplateSource?.blocked_fields?.includes('public_beta_approval') &&
      founderAuthSetupPrintTemplateSource?.blocked_fields?.includes('payment_or_loan_action_approval') &&
      founderAuthSetupPrintTemplateSource?.blocked_fields?.includes('xpr_signature_approval') &&
      founderAuthSetupPrintTemplateSource?.blocked_fields?.includes('legal_decision') &&
      founderAuthSetupPrintTemplateSource?.blocked_fields?.includes('live_action_approval'),
    'Founder Auth setup print template admin evidence export preview must block copyable template, Auth token, raw identity, admin insert, profile repair, strict RLS, live Supabase, deploy, beta, finance/XPR, legal, and live fields'
  );
  assert(
    founderAuthSetupPrintTemplateSource?.raw_content_storage_boundary === founderAuthSetupPrintTemplateExportBoundary,
    'Founder Auth setup print template admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewFounderAuthSetupPrintTemplate.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewFounderAuthSetupPrintTemplate.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewFounderAuthSetupPrintTemplate.body?.no_live_action_attempted === true,
    'Founder Auth setup print template admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
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

  const homepageDecisionExportBoundary =
    'No raw founder decision text, PUBLICATION_GO text, issue excerpts, secrets, payment data, identity data, provider/legal decisions, public replacement approvals, deploy approvals, URL-share approvals, tester-invite approvals, production approvals, external sends, or live-action approvals are stored in this history.';
  const adminEvidenceExportPreviewHomepageDecisionHistory = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=homepage_publication_decision_validation_history',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-homepage-decision-history-smoke' },
    }
  );
  const homepageDecisionHistorySource = adminEvidenceExportPreviewHomepageDecisionHistory.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewHomepageDecisionHistory.status === 200,
    `Expected homepage decision history admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewHomepageDecisionHistory.status}`
  );
  assert(
    adminEvidenceExportPreviewHomepageDecisionHistory.body?.selected_source_filter === 'homepage_publication_decision_validation_history' &&
      adminEvidenceExportPreviewHomepageDecisionHistory.body?.valid_source_filters?.includes('homepage_publication_decision_validation_history'),
    'Homepage decision history admin evidence export preview must accept the homepage publication decision validation history source filter'
  );
  assert(
    adminEvidenceExportPreviewHomepageDecisionHistory.body?.evidence_sources?.length === 1 &&
      homepageDecisionHistorySource?.id === 'homepage_publication_decision_validation_history',
    'Homepage decision history admin evidence export preview must return only the homepage publication decision validation history source'
  );
  assert(
    adminEvidenceExportPreviewHomepageDecisionHistory.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewHomepageDecisionHistory.body.review_router.targets[0]?.source_id === 'homepage_publication_decision_validation_history' &&
      adminEvidenceExportPreviewHomepageDecisionHistory.body.review_router.targets[0]?.ui_anchor === 'homepagePublicationDecisionValidationHistoryGrid',
    'Homepage decision history admin evidence export preview review router must point to homepagePublicationDecisionValidationHistoryGrid'
  );
  assert(
    homepageDecisionHistorySource?.allowed_fields?.includes('homepage_publication_decision_validation_metadata_history_only') &&
      homepageDecisionHistorySource?.allowed_fields?.includes('accepted_phrase_count') &&
      homepageDecisionHistorySource?.allowed_fields?.includes('publication_go_detected') &&
      homepageDecisionHistorySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Homepage decision history admin evidence export preview must allow metadata-only phrase counts and source boundary fields'
  );
  assert(
    homepageDecisionHistorySource?.blocked_fields?.includes('raw_founder_decision_text') &&
      homepageDecisionHistorySource?.blocked_fields?.includes('publication_go_text') &&
      homepageDecisionHistorySource?.blocked_fields?.includes('issue_excerpt') &&
      homepageDecisionHistorySource?.blocked_fields?.includes('deploy_approval'),
    'Homepage decision history admin evidence export preview must block raw founder decision text, PUBLICATION_GO text, issue excerpts, and deploy approvals'
  );
  assert(
    homepageDecisionHistorySource?.raw_content_storage_boundary === homepageDecisionExportBoundary,
    'Homepage decision history admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewHomepageDecisionHistory.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewHomepageDecisionHistory.body?.no_live_action_attempted === true,
    'Homepage decision history admin evidence export preview must remain no-storage and no-live-action'
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

  const adminEvidenceExportPreviewHomepageEvidenceChecklist = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=homepage_publication_evidence_checklist',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-homepage-evidence-checklist-smoke' },
    }
  );
  const homepageEvidenceChecklistExportBoundary =
    'No public replacement approval, PUBLICATION_GO approval text, raw founder notes, screenshot files, deploy approvals, URL-share approvals, tester-invite approvals, legal/provider decisions, payment data, wallet data, server storage, external sends, or live-action approvals are exported from this homepage publication evidence checklist preview.';
  const homepageEvidenceChecklistSource = adminEvidenceExportPreviewHomepageEvidenceChecklist.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewHomepageEvidenceChecklist.status === 200,
    `Expected homepage evidence checklist admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewHomepageEvidenceChecklist.status}`
  );
  assert(
    adminEvidenceExportPreviewHomepageEvidenceChecklist.body?.selected_source_filter === 'homepage_publication_evidence_checklist' &&
      adminEvidenceExportPreviewHomepageEvidenceChecklist.body?.valid_source_filters?.includes('homepage_publication_evidence_checklist'),
    'Homepage evidence checklist admin evidence export preview must accept the homepage publication evidence checklist source filter'
  );
  assert(
    adminEvidenceExportPreviewHomepageEvidenceChecklist.body?.evidence_sources?.length === 1 &&
      homepageEvidenceChecklistSource?.id === 'homepage_publication_evidence_checklist',
    'Homepage evidence checklist admin evidence export preview must return only the homepage publication evidence checklist source'
  );
  assert(
    adminEvidenceExportPreviewHomepageEvidenceChecklist.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewHomepageEvidenceChecklist.body.review_router.targets[0]?.source_id === 'homepage_publication_evidence_checklist' &&
      adminEvidenceExportPreviewHomepageEvidenceChecklist.body.review_router.targets[0]?.ui_anchor === 'betaReadinessGrid',
    'Homepage evidence checklist admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    homepageEvidenceChecklistSource?.allowed_fields?.includes('checklist_item_count') &&
      homepageEvidenceChecklistSource?.allowed_fields?.includes('viewport_guard_present') &&
      homepageEvidenceChecklistSource?.allowed_fields?.includes('required_browser_viewports') &&
      homepageEvidenceChecklistSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Homepage evidence checklist admin evidence export preview must allow checklist metadata and viewport boundary fields only'
  );
  assert(
    homepageEvidenceChecklistSource?.blocked_fields?.includes('public_replacement_approval') &&
      homepageEvidenceChecklistSource?.blocked_fields?.includes('publication_go_approval') &&
      homepageEvidenceChecklistSource?.blocked_fields?.includes('raw_browser_screenshot') &&
      homepageEvidenceChecklistSource?.blocked_fields?.includes('deploy_approval') &&
      homepageEvidenceChecklistSource?.blocked_fields?.includes('url_share_approval') &&
      homepageEvidenceChecklistSource?.blocked_fields?.includes('tester_invite_approval') &&
      homepageEvidenceChecklistSource?.blocked_fields?.includes('legal_decision') &&
      homepageEvidenceChecklistSource?.blocked_fields?.includes('payment_data'),
    'Homepage evidence checklist admin evidence export preview must block public replacement, publication, screenshot, deploy/share/invite, legal, payment, and live evidence'
  );
  assert(
    homepageEvidenceChecklistSource?.raw_content_storage_boundary === homepageEvidenceChecklistExportBoundary,
    'Homepage evidence checklist admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewHomepageEvidenceChecklist.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewHomepageEvidenceChecklist.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewHomepageEvidenceChecklist.body?.no_live_action_attempted === true,
    'Homepage evidence checklist admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewHomepageSequenceGate = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=homepage_publication_sequence_gate',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-homepage-sequence-gate-smoke' },
    }
  );
  const homepageSequenceGateExportBoundary =
    'No PUBLICATION_GO approval text, public replacement approval, copy direction approval, exact file replacement approval, deploy setup approval, URL-share approval, tester-invite approval, raw founder notes, raw homepage copy, final copy approvals, screenshot files, legal/provider decisions, payment data, wallet data, server storage, external sends, or live-action approvals are exported from this homepage publication sequence gate preview.';
  const homepageSequenceGateSource =
    adminEvidenceExportPreviewHomepageSequenceGate.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewHomepageSequenceGate.status === 200,
    `Expected homepage sequence gate admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewHomepageSequenceGate.status}`
  );
  assert(
    adminEvidenceExportPreviewHomepageSequenceGate.body?.selected_source_filter === 'homepage_publication_sequence_gate' &&
      adminEvidenceExportPreviewHomepageSequenceGate.body?.valid_source_filters?.includes('homepage_publication_sequence_gate'),
    'Homepage sequence gate admin evidence export preview must accept the homepage_publication_sequence_gate source filter'
  );
  assert(
    adminEvidenceExportPreviewHomepageSequenceGate.body?.evidence_sources?.length === 1 &&
      homepageSequenceGateSource?.id === 'homepage_publication_sequence_gate',
    'Homepage sequence gate admin evidence export preview must return only the homepage publication sequence gate source'
  );
  assert(
    adminEvidenceExportPreviewHomepageSequenceGate.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewHomepageSequenceGate.body.review_router.targets[0]?.source_id === 'homepage_publication_sequence_gate' &&
      adminEvidenceExportPreviewHomepageSequenceGate.body.review_router.targets[0]?.ui_anchor === 'betaReadinessGrid',
    'Homepage sequence gate admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    homepageSequenceGateSource?.allowed_fields?.includes('sequence_gate_count') &&
      homepageSequenceGateSource?.allowed_fields?.includes('gate_state_counts') &&
      homepageSequenceGateSource?.allowed_fields?.includes('required_decisions') &&
      homepageSequenceGateSource?.allowed_fields?.includes('required_evidence') &&
      homepageSequenceGateSource?.allowed_fields?.includes('next_safe_actions') &&
      homepageSequenceGateSource?.allowed_fields?.includes('evidence_sources') &&
      homepageSequenceGateSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Homepage sequence gate admin evidence export preview must allow sequence metadata, decisions, evidence, next actions, source metadata, and boundary fields only'
  );
  assert(
    homepageSequenceGateSource?.blocked_fields?.includes('publication_go_approval') &&
      homepageSequenceGateSource?.blocked_fields?.includes('copy_direction_approval') &&
      homepageSequenceGateSource?.blocked_fields?.includes('exact_file_replacement_approval') &&
      homepageSequenceGateSource?.blocked_fields?.includes('public_index_html_replacement_approval') &&
      homepageSequenceGateSource?.blocked_fields?.includes('public_whitepaper_edit_approval') &&
      homepageSequenceGateSource?.blocked_fields?.includes('deploy_setup_approval') &&
      homepageSequenceGateSource?.blocked_fields?.includes('deploy_setting_change_approval') &&
      homepageSequenceGateSource?.blocked_fields?.includes('url_smoke_approval') &&
      homepageSequenceGateSource?.blocked_fields?.includes('public_url_share_approval') &&
      homepageSequenceGateSource?.blocked_fields?.includes('tester_invite_approval') &&
      homepageSequenceGateSource?.blocked_fields?.includes('public_beta_invite_approval') &&
      homepageSequenceGateSource?.blocked_fields?.includes('final_copy_approval') &&
      homepageSequenceGateSource?.blocked_fields?.includes('raw_founder_notes') &&
      homepageSequenceGateSource?.blocked_fields?.includes('raw_homepage_copy') &&
      homepageSequenceGateSource?.blocked_fields?.includes('raw_browser_screenshot') &&
      homepageSequenceGateSource?.blocked_fields?.includes('legal_decision') &&
      homepageSequenceGateSource?.blocked_fields?.includes('payment_data') &&
      homepageSequenceGateSource?.blocked_fields?.includes('stablecoin_settlement_approval') &&
      homepageSequenceGateSource?.blocked_fields?.includes('token_collateral_lock_approval') &&
      homepageSequenceGateSource?.blocked_fields?.includes('live_action_approval'),
    'Homepage sequence gate admin evidence export preview must block publication/copy/file replacement, deploy/share/invite, final copy, raw notes/copy/screenshots, legal, payment, stablecoin, token collateral, and live evidence'
  );
  assert(
    homepageSequenceGateSource?.raw_content_storage_boundary === homepageSequenceGateExportBoundary,
    'Homepage sequence gate admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewHomepageSequenceGate.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewHomepageSequenceGate.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewHomepageSequenceGate.body?.no_live_action_attempted === true,
    'Homepage sequence gate admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewHomepageReviewPacket = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=homepage_publication_review_packet',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-homepage-review-packet-smoke' },
    }
  );
  const homepageReviewPacketExportBoundary =
    'No PUBLICATION_GO approval text, public replacement approval, raw founder notes, raw homepage copy, final copy approvals, public claim approvals, deploy/share/invite approvals, legal/provider decisions, payment data, wallet data, server storage, external sends, or live-action approvals are exported from this homepage publication review packet preview.';
  const homepageReviewPacketSource =
    adminEvidenceExportPreviewHomepageReviewPacket.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewHomepageReviewPacket.status === 200,
    `Expected homepage review packet admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewHomepageReviewPacket.status}`
  );
  assert(
    adminEvidenceExportPreviewHomepageReviewPacket.body?.selected_source_filter === 'homepage_publication_review_packet' &&
      adminEvidenceExportPreviewHomepageReviewPacket.body?.valid_source_filters?.includes('homepage_publication_review_packet'),
    'Homepage review packet admin evidence export preview must accept the homepage_publication_review_packet source filter'
  );
  assert(
    adminEvidenceExportPreviewHomepageReviewPacket.body?.evidence_sources?.length === 1 &&
      homepageReviewPacketSource?.id === 'homepage_publication_review_packet',
    'Homepage review packet admin evidence export preview must return only the homepage publication review packet source'
  );
  assert(
    adminEvidenceExportPreviewHomepageReviewPacket.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewHomepageReviewPacket.body.review_router.targets[0]?.source_id === 'homepage_publication_review_packet' &&
      adminEvidenceExportPreviewHomepageReviewPacket.body.review_router.targets[0]?.ui_anchor === 'betaReadinessGrid',
    'Homepage review packet admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    homepageReviewPacketSource?.allowed_fields?.includes('packet_state') &&
      homepageReviewPacketSource?.allowed_fields?.includes('founder_question') &&
      homepageReviewPacketSource?.allowed_fields?.includes('safe_public_promise') &&
      homepageReviewPacketSource?.allowed_fields?.includes('required_decisions') &&
      homepageReviewPacketSource?.allowed_fields?.includes('required_evidence_sources') &&
      homepageReviewPacketSource?.allowed_fields?.includes('blocked_public_claims') &&
      homepageReviewPacketSource?.allowed_fields?.includes('blocked_live_actions') &&
      homepageReviewPacketSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Homepage review packet admin evidence export preview must allow packet state, founder question, safe promise, required decisions, evidence sources, blocked claims/actions, and boundary metadata only'
  );
  assert(
    homepageReviewPacketSource?.blocked_fields?.includes('publication_go_approval') &&
      homepageReviewPacketSource?.blocked_fields?.includes('copy_direction_approval') &&
      homepageReviewPacketSource?.blocked_fields?.includes('public_claim_approval') &&
      homepageReviewPacketSource?.blocked_fields?.includes('public_index_html_replacement_approval') &&
      homepageReviewPacketSource?.blocked_fields?.includes('public_whitepaper_edit_approval') &&
      homepageReviewPacketSource?.blocked_fields?.includes('final_copy_approval') &&
      homepageReviewPacketSource?.blocked_fields?.includes('raw_founder_notes') &&
      homepageReviewPacketSource?.blocked_fields?.includes('raw_homepage_copy') &&
      homepageReviewPacketSource?.blocked_fields?.includes('deploy_setting_change_approval') &&
      homepageReviewPacketSource?.blocked_fields?.includes('public_url_share_approval') &&
      homepageReviewPacketSource?.blocked_fields?.includes('tester_invite_approval') &&
      homepageReviewPacketSource?.blocked_fields?.includes('legal_decision') &&
      homepageReviewPacketSource?.blocked_fields?.includes('payment_data') &&
      homepageReviewPacketSource?.blocked_fields?.includes('stablecoin_settlement_approval') &&
      homepageReviewPacketSource?.blocked_fields?.includes('token_collateral_lock_approval') &&
      homepageReviewPacketSource?.blocked_fields?.includes('live_action_approval'),
    'Homepage review packet admin evidence export preview must block publication/copy/claim approvals, raw notes/copy, deploy/share/invite, legal, payment, stablecoin, token collateral, and live evidence'
  );
  assert(
    homepageReviewPacketSource?.raw_content_storage_boundary === homepageReviewPacketExportBoundary,
    'Homepage review packet admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewHomepageReviewPacket.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewHomepageReviewPacket.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewHomepageReviewPacket.body?.no_live_action_attempted === true,
    'Homepage review packet admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewHomepageStaticAssetCandidate = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=homepage_static_asset_candidate',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-homepage-static-asset-candidate-smoke' },
    }
  );
  const homepageStaticAssetCandidateExportBoundary =
    'No PUBLICATION_GO approval text, public replacement approval, raw founder notes, raw HTML/CSS contents, screenshot files, external asset upload approvals, deploy/share/invite approvals, legal/provider decisions, payment data, wallet data, server storage, external sends, or live-action approvals are exported from this homepage static asset candidate preview.';
  const homepageStaticAssetCandidateSource =
    adminEvidenceExportPreviewHomepageStaticAssetCandidate.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewHomepageStaticAssetCandidate.status === 200,
    `Expected homepage static asset candidate admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewHomepageStaticAssetCandidate.status}`
  );
  assert(
    adminEvidenceExportPreviewHomepageStaticAssetCandidate.body?.selected_source_filter === 'homepage_static_asset_candidate' &&
      adminEvidenceExportPreviewHomepageStaticAssetCandidate.body?.valid_source_filters?.includes('homepage_static_asset_candidate'),
    'Homepage static asset candidate admin evidence export preview must accept the homepage_static_asset_candidate source filter'
  );
  assert(
    adminEvidenceExportPreviewHomepageStaticAssetCandidate.body?.evidence_sources?.length === 1 &&
      homepageStaticAssetCandidateSource?.id === 'homepage_static_asset_candidate',
    'Homepage static asset candidate admin evidence export preview must return only the homepage_static_asset_candidate source'
  );
  assert(
    adminEvidenceExportPreviewHomepageStaticAssetCandidate.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewHomepageStaticAssetCandidate.body.review_router.targets[0]?.source_id === 'homepage_static_asset_candidate' &&
      adminEvidenceExportPreviewHomepageStaticAssetCandidate.body.review_router.targets[0]?.ui_anchor === 'betaReadinessGrid',
    'Homepage static asset candidate admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    homepageStaticAssetCandidateSource?.allowed_fields?.includes('static_candidate_count') &&
      homepageStaticAssetCandidateSource?.allowed_fields?.includes('candidate_state') &&
      homepageStaticAssetCandidateSource?.allowed_fields?.includes('source_file') &&
      homepageStaticAssetCandidateSource?.allowed_fields?.includes('validator') &&
      homepageStaticAssetCandidateSource?.allowed_fields?.includes('asset_posture_count') &&
      homepageStaticAssetCandidateSource?.allowed_fields?.includes('browser_evidence_count') &&
      homepageStaticAssetCandidateSource?.allowed_fields?.includes('qa_caveat') &&
      homepageStaticAssetCandidateSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Homepage static asset candidate admin evidence export preview must allow candidate metadata, asset posture, browser evidence, caveat, and boundary fields only'
  );
  assert(
    homepageStaticAssetCandidateSource?.blocked_fields?.includes('publication_go_approval') &&
      homepageStaticAssetCandidateSource?.blocked_fields?.includes('public_replacement_approval') &&
      homepageStaticAssetCandidateSource?.blocked_fields?.includes('public_index_html_replacement_approval') &&
      homepageStaticAssetCandidateSource?.blocked_fields?.includes('raw_homepage_html') &&
      homepageStaticAssetCandidateSource?.blocked_fields?.includes('raw_css_contents') &&
      homepageStaticAssetCandidateSource?.blocked_fields?.includes('raw_browser_screenshot') &&
      homepageStaticAssetCandidateSource?.blocked_fields?.includes('external_asset_upload_approval') &&
      homepageStaticAssetCandidateSource?.blocked_fields?.includes('deploy_setting_change_approval') &&
      homepageStaticAssetCandidateSource?.blocked_fields?.includes('public_url_share_approval') &&
      homepageStaticAssetCandidateSource?.blocked_fields?.includes('tester_invite_approval') &&
      homepageStaticAssetCandidateSource?.blocked_fields?.includes('legal_decision') &&
      homepageStaticAssetCandidateSource?.blocked_fields?.includes('payment_data') &&
      homepageStaticAssetCandidateSource?.blocked_fields?.includes('stablecoin_settlement_approval') &&
      homepageStaticAssetCandidateSource?.blocked_fields?.includes('token_collateral_lock_approval'),
    'Homepage static asset candidate admin evidence export preview must block publication, raw HTML/CSS, screenshot, external asset, deploy/share/invite, legal, payment, stablecoin, token collateral, and live evidence'
  );
  assert(
    homepageStaticAssetCandidateSource?.raw_content_storage_boundary === homepageStaticAssetCandidateExportBoundary,
    'Homepage static asset candidate admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewHomepageStaticAssetCandidate.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewHomepageStaticAssetCandidate.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewHomepageStaticAssetCandidate.body?.no_live_action_attempted === true,
    'Homepage static asset candidate admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewHomepageDecisionSummary = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=homepage_publication_decision_summary',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-homepage-decision-summary-smoke' },
    }
  );
  const homepageDecisionSummaryExportBoundary =
    'No PUBLICATION_GO approval text, public replacement approval, raw founder notes, final copy approvals, screenshot files, deploy/share/invite approvals, legal/provider decisions, payment data, wallet data, server storage, external sends, or live-action approvals are exported from this homepage publication decision summary preview.';
  const homepageDecisionSummarySource =
    adminEvidenceExportPreviewHomepageDecisionSummary.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewHomepageDecisionSummary.status === 200,
    `Expected homepage decision summary admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewHomepageDecisionSummary.status}`
  );
  assert(
    adminEvidenceExportPreviewHomepageDecisionSummary.body?.selected_source_filter === 'homepage_publication_decision_summary' &&
      adminEvidenceExportPreviewHomepageDecisionSummary.body?.valid_source_filters?.includes('homepage_publication_decision_summary'),
    'Homepage decision summary admin evidence export preview must accept the homepage_publication_decision_summary source filter'
  );
  assert(
    adminEvidenceExportPreviewHomepageDecisionSummary.body?.evidence_sources?.length === 1 &&
      homepageDecisionSummarySource?.id === 'homepage_publication_decision_summary',
    'Homepage decision summary admin evidence export preview must return only the homepage publication decision summary source'
  );
  assert(
    adminEvidenceExportPreviewHomepageDecisionSummary.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewHomepageDecisionSummary.body.review_router.targets[0]?.source_id === 'homepage_publication_decision_summary' &&
      adminEvidenceExportPreviewHomepageDecisionSummary.body.review_router.targets[0]?.ui_anchor === 'betaReadinessGrid',
    'Homepage decision summary admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    homepageDecisionSummarySource?.allowed_fields?.includes('summary_state') &&
      homepageDecisionSummarySource?.allowed_fields?.includes('current_candidate') &&
      homepageDecisionSummarySource?.allowed_fields?.includes('recommended_founder_response') &&
      homepageDecisionSummarySource?.allowed_fields?.includes('current_public_state') &&
      homepageDecisionSummarySource?.allowed_fields?.includes('ready_local_evidence') &&
      homepageDecisionSummarySource?.allowed_fields?.includes('remaining_blockers') &&
      homepageDecisionSummarySource?.allowed_fields?.includes('next_safe_actions') &&
      homepageDecisionSummarySource?.allowed_fields?.includes('source_docs') &&
      homepageDecisionSummarySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Homepage decision summary admin evidence export preview must allow summary, candidate, founder response, public state, evidence, blockers, next actions, source docs, and boundary metadata only'
  );
  assert(
    homepageDecisionSummarySource?.blocked_fields?.includes('publication_go_approval') &&
      homepageDecisionSummarySource?.blocked_fields?.includes('public_index_html_replacement_approval') &&
      homepageDecisionSummarySource?.blocked_fields?.includes('public_whitepaper_edit_approval') &&
      homepageDecisionSummarySource?.blocked_fields?.includes('final_copy_approval') &&
      homepageDecisionSummarySource?.blocked_fields?.includes('raw_founder_notes') &&
      homepageDecisionSummarySource?.blocked_fields?.includes('raw_homepage_copy') &&
      homepageDecisionSummarySource?.blocked_fields?.includes('raw_browser_screenshot') &&
      homepageDecisionSummarySource?.blocked_fields?.includes('deploy_setting_change_approval') &&
      homepageDecisionSummarySource?.blocked_fields?.includes('public_url_share_approval') &&
      homepageDecisionSummarySource?.blocked_fields?.includes('tester_invite_approval') &&
      homepageDecisionSummarySource?.blocked_fields?.includes('legal_decision') &&
      homepageDecisionSummarySource?.blocked_fields?.includes('payment_data') &&
      homepageDecisionSummarySource?.blocked_fields?.includes('stablecoin_settlement_approval') &&
      homepageDecisionSummarySource?.blocked_fields?.includes('token_collateral_lock_approval') &&
      homepageDecisionSummarySource?.blocked_fields?.includes('live_action_approval'),
    'Homepage decision summary admin evidence export preview must block publication, final copy, raw notes/copy/screenshots, deploy/share/invite, legal, payment, stablecoin, token collateral, and live evidence'
  );
  assert(
    homepageDecisionSummarySource?.raw_content_storage_boundary === homepageDecisionSummaryExportBoundary,
    'Homepage decision summary admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewHomepageDecisionSummary.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewHomepageDecisionSummary.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewHomepageDecisionSummary.body?.no_live_action_attempted === true,
    'Homepage decision summary admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewHomepageFinalQaHold = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=homepage_publication_final_qa_hold',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-homepage-final-qa-hold-smoke' },
    }
  );
  const homepageFinalQaHoldExportBoundary =
    'No PUBLICATION_GO approval text, public replacement approval, raw founder notes, screenshot files, archive execution approvals, deploy/share/invite approvals, legal/provider decisions, payment data, wallet data, server storage, external sends, or live-action approvals are exported from this homepage final QA hold preview.';
  const homepageFinalQaHoldSource = adminEvidenceExportPreviewHomepageFinalQaHold.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewHomepageFinalQaHold.status === 200,
    `Expected homepage final QA hold admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewHomepageFinalQaHold.status}`
  );
  assert(
    adminEvidenceExportPreviewHomepageFinalQaHold.body?.selected_source_filter === 'homepage_publication_final_qa_hold' &&
      adminEvidenceExportPreviewHomepageFinalQaHold.body?.valid_source_filters?.includes('homepage_publication_final_qa_hold'),
    'Homepage final QA hold admin evidence export preview must accept the homepage publication final QA hold source filter'
  );
  assert(
    adminEvidenceExportPreviewHomepageFinalQaHold.body?.evidence_sources?.length === 1 &&
      homepageFinalQaHoldSource?.id === 'homepage_publication_final_qa_hold',
    'Homepage final QA hold admin evidence export preview must return only the homepage publication final QA hold source'
  );
  assert(
    adminEvidenceExportPreviewHomepageFinalQaHold.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewHomepageFinalQaHold.body.review_router.targets[0]?.source_id === 'homepage_publication_final_qa_hold' &&
      adminEvidenceExportPreviewHomepageFinalQaHold.body.review_router.targets[0]?.ui_anchor === 'betaReadinessGrid',
    'Homepage final QA hold admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    homepageFinalQaHoldSource?.allowed_fields?.includes('final_qa_hold_item_count') &&
      homepageFinalQaHoldSource?.allowed_fields?.includes('hold_state_counts') &&
      homepageFinalQaHoldSource?.allowed_fields?.includes('candidate_file') &&
      homepageFinalQaHoldSource?.allowed_fields?.includes('publication_allowed') &&
      homepageFinalQaHoldSource?.allowed_fields?.includes('required_before_publication_go') &&
      homepageFinalQaHoldSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Homepage final QA hold admin evidence export preview must allow final QA metadata and boundary fields only'
  );
  assert(
    homepageFinalQaHoldSource?.blocked_fields?.includes('publication_go_approval') &&
      homepageFinalQaHoldSource?.blocked_fields?.includes('public_index_html_replacement_approval') &&
      homepageFinalQaHoldSource?.blocked_fields?.includes('archive_execution_approval') &&
      homepageFinalQaHoldSource?.blocked_fields?.includes('raw_browser_screenshot') &&
      homepageFinalQaHoldSource?.blocked_fields?.includes('deploy_setting_change_approval') &&
      homepageFinalQaHoldSource?.blocked_fields?.includes('public_url_share_approval') &&
      homepageFinalQaHoldSource?.blocked_fields?.includes('tester_invite_approval') &&
      homepageFinalQaHoldSource?.blocked_fields?.includes('legal_decision') &&
      homepageFinalQaHoldSource?.blocked_fields?.includes('payment_data') &&
      homepageFinalQaHoldSource?.blocked_fields?.includes('stablecoin_settlement_approval') &&
      homepageFinalQaHoldSource?.blocked_fields?.includes('token_collateral_lock_approval'),
    'Homepage final QA hold admin evidence export preview must block publication, public replacement, archive, screenshot, deploy/share/invite, legal, payment, stablecoin, token collateral, and live evidence'
  );
  assert(
    homepageFinalQaHoldSource?.raw_content_storage_boundary === homepageFinalQaHoldExportBoundary,
    'Homepage final QA hold admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewHomepageFinalQaHold.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewHomepageFinalQaHold.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewHomepageFinalQaHold.body?.no_live_action_attempted === true,
    'Homepage final QA hold admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewWhitepaperV13PublicationGate = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=whitepaper_v1_3_publication_gate',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-whitepaper-v13-publication-gate-smoke' },
    }
  );
  const whitepaperV13PublicationGateExportBoundary =
    'No founder publication approval, PUBLICATION_GO approval text, public replacement approval, archive execution approval, raw founder notes, raw whitepaper copy, PDF/deck/email/social send approvals, legal/provider decisions, payment data, wallet data, XPR/FIO actions, server storage, external sends, or live-action approvals are exported from this whitepaper v1.3 publication gate preview.';
  const whitepaperV13PublicationGateSource =
    adminEvidenceExportPreviewWhitepaperV13PublicationGate.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewWhitepaperV13PublicationGate.status === 200,
    `Expected whitepaper v1.3 publication gate admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewWhitepaperV13PublicationGate.status}`
  );
  assert(
    adminEvidenceExportPreviewWhitepaperV13PublicationGate.body?.selected_source_filter === 'whitepaper_v1_3_publication_gate' &&
      adminEvidenceExportPreviewWhitepaperV13PublicationGate.body?.valid_source_filters?.includes('whitepaper_v1_3_publication_gate'),
    'Whitepaper v1.3 publication gate admin evidence export preview must accept the whitepaper_v1_3_publication_gate source filter'
  );
  assert(
    adminEvidenceExportPreviewWhitepaperV13PublicationGate.body?.evidence_sources?.length === 1 &&
      whitepaperV13PublicationGateSource?.id === 'whitepaper_v1_3_publication_gate',
    'Whitepaper v1.3 publication gate admin evidence export preview must return only the whitepaper v1.3 publication gate source'
  );
  assert(
    adminEvidenceExportPreviewWhitepaperV13PublicationGate.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewWhitepaperV13PublicationGate.body.review_router.targets[0]?.source_id === 'whitepaper_v1_3_publication_gate' &&
      adminEvidenceExportPreviewWhitepaperV13PublicationGate.body.review_router.targets[0]?.ui_anchor === 'betaReadinessGrid',
    'Whitepaper v1.3 publication gate admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    whitepaperV13PublicationGateSource?.allowed_fields?.includes('gate_state') &&
      whitepaperV13PublicationGateSource?.allowed_fields?.includes('publication_allowed') &&
      whitepaperV13PublicationGateSource?.allowed_fields?.includes('current_decision') &&
      whitepaperV13PublicationGateSource?.allowed_fields?.includes('required_before_review') &&
      whitepaperV13PublicationGateSource?.allowed_fields?.includes('required_before_go') &&
      whitepaperV13PublicationGateSource?.allowed_fields?.includes('no_go_reasons') &&
      whitepaperV13PublicationGateSource?.allowed_fields?.includes('blocked_public_actions') &&
      whitepaperV13PublicationGateSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Whitepaper v1.3 publication gate admin evidence export preview must allow gate state, decision, evidence, blocker, blocked-action, and boundary metadata only'
  );
  assert(
    whitepaperV13PublicationGateSource?.blocked_fields?.includes('founder_publication_approval') &&
      whitepaperV13PublicationGateSource?.blocked_fields?.includes('publication_go_approval') &&
      whitepaperV13PublicationGateSource?.blocked_fields?.includes('public_whitepaper_html_replacement_approval') &&
      whitepaperV13PublicationGateSource?.blocked_fields?.includes('public_index_html_replacement_approval') &&
      whitepaperV13PublicationGateSource?.blocked_fields?.includes('archive_execution_approval') &&
      whitepaperV13PublicationGateSource?.blocked_fields?.includes('raw_whitepaper_copy') &&
      whitepaperV13PublicationGateSource?.blocked_fields?.includes('pdf_publication_approval') &&
      whitepaperV13PublicationGateSource?.blocked_fields?.includes('email_announcement_approval') &&
      whitepaperV13PublicationGateSource?.blocked_fields?.includes('social_announcement_approval') &&
      whitepaperV13PublicationGateSource?.blocked_fields?.includes('legal_decision') &&
      whitepaperV13PublicationGateSource?.blocked_fields?.includes('payment_data') &&
      whitepaperV13PublicationGateSource?.blocked_fields?.includes('xpr_signature') &&
      whitepaperV13PublicationGateSource?.blocked_fields?.includes('fio_registration') &&
      whitepaperV13PublicationGateSource?.blocked_fields?.includes('live_action_approval'),
    'Whitepaper v1.3 publication gate admin evidence export preview must block publication approvals, public file replacement, archive execution, raw copy, send approvals, legal, payment, XPR/FIO, and live evidence'
  );
  assert(
    whitepaperV13PublicationGateSource?.raw_content_storage_boundary === whitepaperV13PublicationGateExportBoundary,
    'Whitepaper v1.3 publication gate admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewWhitepaperV13PublicationGate.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewWhitepaperV13PublicationGate.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewWhitepaperV13PublicationGate.body?.no_live_action_attempted === true,
    'Whitepaper v1.3 publication gate admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewStrictAdminSmokeReadiness = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=strict_admin_smoke_readiness',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-strict-admin-smoke-readiness-smoke' },
    }
  );
  const strictAdminSmokeReadinessExportBoundary =
    'No Magic Link URLs, Auth tokens, session cookies, service-role keys, raw env values, raw strict admin smoke command output, admin_memberships insert approvals or SQL, profile repair approvals, Auth role change approvals, strict RLS apply approvals, live Supabase changes, deploy/public beta approvals, payment/loan/escrow/token/XPR approvals, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this strict admin smoke readiness preview.';
  const strictAdminSmokeReadinessSource =
    adminEvidenceExportPreviewStrictAdminSmokeReadiness.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewStrictAdminSmokeReadiness.status === 200,
    `Expected strict admin smoke readiness admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewStrictAdminSmokeReadiness.status}`
  );
  assert(
    adminEvidenceExportPreviewStrictAdminSmokeReadiness.body?.selected_source_filter === 'strict_admin_smoke_readiness' &&
      adminEvidenceExportPreviewStrictAdminSmokeReadiness.body?.valid_source_filters?.includes('strict_admin_smoke_readiness'),
    'Strict admin smoke readiness admin evidence export preview must accept the strict_admin_smoke_readiness source filter'
  );
  assert(
    adminEvidenceExportPreviewStrictAdminSmokeReadiness.body?.evidence_sources?.length === 1 &&
      strictAdminSmokeReadinessSource?.id === 'strict_admin_smoke_readiness',
    'Strict admin smoke readiness admin evidence export preview must return only the strict_admin_smoke_readiness source'
  );
  assert(
    adminEvidenceExportPreviewStrictAdminSmokeReadiness.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewStrictAdminSmokeReadiness.body.review_router.targets[0]?.source_id === 'strict_admin_smoke_readiness' &&
      adminEvidenceExportPreviewStrictAdminSmokeReadiness.body.review_router.targets[0]?.ui_anchor === 'strictAdminSmokeReadinessGrid',
    'Strict admin smoke readiness admin evidence export preview review router must point to strictAdminSmokeReadinessGrid'
  );
  assert(
    strictAdminSmokeReadinessSource?.allowed_fields?.includes('strict_smoke_gate_count') &&
      strictAdminSmokeReadinessSource?.allowed_fields?.includes('strict_admin_smoke_evidence_gate_count') &&
      strictAdminSmokeReadinessSource?.allowed_fields?.includes('strict_admin_smoke_evidence_gate_board') &&
      strictAdminSmokeReadinessSource?.allowed_fields?.includes('strict_admin_smoke_gate') &&
      strictAdminSmokeReadinessSource?.allowed_fields?.includes('no_magic_link_url_paste_attempted') &&
      strictAdminSmokeReadinessSource?.allowed_fields?.includes('no_service_role_key_paste_attempted') &&
      strictAdminSmokeReadinessSource?.allowed_fields?.includes('no_admin_membership_insert_attempted') &&
      strictAdminSmokeReadinessSource?.allowed_fields?.includes('no_strict_rls_apply_attempted') &&
      strictAdminSmokeReadinessSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Strict admin smoke readiness admin evidence export preview must allow strict smoke readiness metadata and boundary fields only'
  );
  assert(
    strictAdminSmokeReadinessSource?.blocked_fields?.includes('magic_link_url') &&
      strictAdminSmokeReadinessSource?.blocked_fields?.includes('auth_token') &&
      strictAdminSmokeReadinessSource?.blocked_fields?.includes('session_cookie') &&
      strictAdminSmokeReadinessSource?.blocked_fields?.includes('service_role_key') &&
      strictAdminSmokeReadinessSource?.blocked_fields?.includes('raw_command_output') &&
      strictAdminSmokeReadinessSource?.blocked_fields?.includes('strict_admin_smoke_raw_output') &&
      strictAdminSmokeReadinessSource?.blocked_fields?.includes('admin_memberships_insert_sql') &&
      strictAdminSmokeReadinessSource?.blocked_fields?.includes('profile_repair_approval') &&
      strictAdminSmokeReadinessSource?.blocked_fields?.includes('auth_role_change_approval') &&
      strictAdminSmokeReadinessSource?.blocked_fields?.includes('strict_rls_apply_approval') &&
      strictAdminSmokeReadinessSource?.blocked_fields?.includes('live_supabase_change_approval') &&
      strictAdminSmokeReadinessSource?.blocked_fields?.includes('deploy_setting_change_approval') &&
      strictAdminSmokeReadinessSource?.blocked_fields?.includes('public_beta_approval') &&
      strictAdminSmokeReadinessSource?.blocked_fields?.includes('payment_or_loan_action_approval') &&
      strictAdminSmokeReadinessSource?.blocked_fields?.includes('xpr_signature_approval') &&
      strictAdminSmokeReadinessSource?.blocked_fields?.includes('legal_decision') &&
      strictAdminSmokeReadinessSource?.blocked_fields?.includes('live_action_approval'),
    'Strict admin smoke readiness admin evidence export preview must block Auth token, raw output, admin insert, profile repair, strict RLS, live Supabase, deploy, beta, finance/XPR, legal, and live fields'
  );
  assert(
    strictAdminSmokeReadinessSource?.raw_content_storage_boundary === strictAdminSmokeReadinessExportBoundary,
    'Strict admin smoke readiness admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewStrictAdminSmokeReadiness.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewStrictAdminSmokeReadiness.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewStrictAdminSmokeReadiness.body?.no_live_action_attempted === true,
    'Strict admin smoke readiness admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewStrictAdminSmokeOutputTemplate = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=strict_admin_smoke_output_template',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-strict-admin-smoke-output-template-smoke' },
    }
  );
  const strictAdminSmokeOutputTemplateExportBoundary =
    'No copyable output template text, raw strict admin smoke command output, stdout/stderr details, Magic Link URLs, Auth tokens, session cookies, service-role keys, raw env values, admin_memberships insert approvals or SQL, profile repair approvals, strict RLS apply approvals, live Supabase changes, deploy/public beta approvals, payment/loan/escrow/token/XPR approvals, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this strict admin smoke output template preview.';
  const strictAdminSmokeOutputTemplateSource =
    adminEvidenceExportPreviewStrictAdminSmokeOutputTemplate.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewStrictAdminSmokeOutputTemplate.status === 200,
    `Expected strict admin smoke output template admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewStrictAdminSmokeOutputTemplate.status}`
  );
  assert(
    adminEvidenceExportPreviewStrictAdminSmokeOutputTemplate.body?.selected_source_filter === 'strict_admin_smoke_output_template' &&
      adminEvidenceExportPreviewStrictAdminSmokeOutputTemplate.body?.valid_source_filters?.includes('strict_admin_smoke_output_template'),
    'Strict admin smoke output template admin evidence export preview must accept the strict_admin_smoke_output_template source filter'
  );
  assert(
    adminEvidenceExportPreviewStrictAdminSmokeOutputTemplate.body?.evidence_sources?.length === 1 &&
      strictAdminSmokeOutputTemplateSource?.id === 'strict_admin_smoke_output_template',
    'Strict admin smoke output template admin evidence export preview must return only the strict_admin_smoke_output_template source'
  );
  assert(
    adminEvidenceExportPreviewStrictAdminSmokeOutputTemplate.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewStrictAdminSmokeOutputTemplate.body.review_router.targets[0]?.source_id === 'strict_admin_smoke_output_template' &&
      adminEvidenceExportPreviewStrictAdminSmokeOutputTemplate.body.review_router.targets[0]?.ui_anchor === 'strictAdminSmokeReadinessGrid',
    'Strict admin smoke output template admin evidence export preview review router must point to strictAdminSmokeReadinessGrid'
  );
  assert(
    strictAdminSmokeOutputTemplateSource?.allowed_fields?.includes('output_template_section_count') &&
      strictAdminSmokeOutputTemplateSource?.allowed_fields?.includes('output_capture_gate_status') &&
      strictAdminSmokeOutputTemplateSource?.allowed_fields?.includes('redaction_requirement_count') &&
      strictAdminSmokeOutputTemplateSource?.allowed_fields?.includes('no_magic_link_urls') &&
      strictAdminSmokeOutputTemplateSource?.allowed_fields?.includes('no_service_role_keys') &&
      strictAdminSmokeOutputTemplateSource?.allowed_fields?.includes('no_payment_or_wallet_data') &&
      strictAdminSmokeOutputTemplateSource?.allowed_fields?.includes('no_external_export_attempted') &&
      strictAdminSmokeOutputTemplateSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Strict admin smoke output template admin evidence export preview must allow output-template metadata and boundary fields only'
  );
  assert(
    strictAdminSmokeOutputTemplateSource?.blocked_fields?.includes('copyable_output_template') &&
      strictAdminSmokeOutputTemplateSource?.blocked_fields?.includes('output_template_sections') &&
      strictAdminSmokeOutputTemplateSource?.blocked_fields?.includes('raw_command_output') &&
      strictAdminSmokeOutputTemplateSource?.blocked_fields?.includes('raw_stdout') &&
      strictAdminSmokeOutputTemplateSource?.blocked_fields?.includes('raw_stderr') &&
      strictAdminSmokeOutputTemplateSource?.blocked_fields?.includes('stdout_summary') &&
      strictAdminSmokeOutputTemplateSource?.blocked_fields?.includes('stderr_summary') &&
      strictAdminSmokeOutputTemplateSource?.blocked_fields?.includes('magic_link_url') &&
      strictAdminSmokeOutputTemplateSource?.blocked_fields?.includes('auth_token') &&
      strictAdminSmokeOutputTemplateSource?.blocked_fields?.includes('session_cookie') &&
      strictAdminSmokeOutputTemplateSource?.blocked_fields?.includes('service_role_key') &&
      strictAdminSmokeOutputTemplateSource?.blocked_fields?.includes('admin_memberships_insert_sql') &&
      strictAdminSmokeOutputTemplateSource?.blocked_fields?.includes('profile_repair_approval') &&
      strictAdminSmokeOutputTemplateSource?.blocked_fields?.includes('strict_rls_apply_approval') &&
      strictAdminSmokeOutputTemplateSource?.blocked_fields?.includes('deploy_setting_change_approval') &&
      strictAdminSmokeOutputTemplateSource?.blocked_fields?.includes('public_beta_approval') &&
      strictAdminSmokeOutputTemplateSource?.blocked_fields?.includes('payment_or_loan_action_approval') &&
      strictAdminSmokeOutputTemplateSource?.blocked_fields?.includes('xpr_signature_approval') &&
      strictAdminSmokeOutputTemplateSource?.blocked_fields?.includes('legal_decision') &&
      strictAdminSmokeOutputTemplateSource?.blocked_fields?.includes('live_action_approval'),
    'Strict admin smoke output template admin evidence export preview must block copyable template, raw output, Auth token, admin insert, profile repair, strict RLS, deploy, beta, finance/XPR, legal, and live fields'
  );
  assert(
    strictAdminSmokeOutputTemplateSource?.raw_content_storage_boundary === strictAdminSmokeOutputTemplateExportBoundary,
    'Strict admin smoke output template admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewStrictAdminSmokeOutputTemplate.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewStrictAdminSmokeOutputTemplate.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewStrictAdminSmokeOutputTemplate.body?.no_live_action_attempted === true,
    'Strict admin smoke output template admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewFounderAuthNextStepReadiness = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=founder_auth_next_step_readiness',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-founder-auth-next-step-readiness-smoke' },
    }
  );
  const founderAuthNextStepReadinessExportBoundary =
    'No Magic Link URLs, Auth tokens, session cookies, raw founder identity data, profile repair approvals, admin_memberships insert approvals, service-role keys, strict RLS apply approvals, deploy setting approvals, public beta approvals, payment data, wallet data, legal/provider decisions, server storage, external sends, or live-action approvals are exported from this founder Auth next-step readiness preview.';
  const founderAuthNextStepReadinessSource =
    adminEvidenceExportPreviewFounderAuthNextStepReadiness.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewFounderAuthNextStepReadiness.status === 200,
    `Expected founder Auth next-step readiness admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewFounderAuthNextStepReadiness.status}`
  );
  assert(
    adminEvidenceExportPreviewFounderAuthNextStepReadiness.body?.selected_source_filter === 'founder_auth_next_step_readiness' &&
      adminEvidenceExportPreviewFounderAuthNextStepReadiness.body?.valid_source_filters?.includes('founder_auth_next_step_readiness'),
    'Founder Auth next-step readiness admin evidence export preview must accept the founder_auth_next_step_readiness source filter'
  );
  assert(
    adminEvidenceExportPreviewFounderAuthNextStepReadiness.body?.evidence_sources?.length === 1 &&
      founderAuthNextStepReadinessSource?.id === 'founder_auth_next_step_readiness',
    'Founder Auth next-step readiness admin evidence export preview must return only the founder_auth_next_step_readiness source'
  );
  assert(
    adminEvidenceExportPreviewFounderAuthNextStepReadiness.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewFounderAuthNextStepReadiness.body.review_router.targets[0]?.source_id === 'founder_auth_next_step_readiness' &&
      adminEvidenceExportPreviewFounderAuthNextStepReadiness.body.review_router.targets[0]?.ui_anchor === 'betaReadinessGrid',
    'Founder Auth next-step readiness admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    founderAuthNextStepReadinessSource?.allowed_fields?.includes('auth_item_count') &&
      founderAuthNextStepReadinessSource?.allowed_fields?.includes('readiness_state_counts') &&
      founderAuthNextStepReadinessSource?.allowed_fields?.includes('required_evidence_count') &&
      founderAuthNextStepReadinessSource?.allowed_fields?.includes('no_admin_membership_insert_attempted') &&
      founderAuthNextStepReadinessSource?.allowed_fields?.includes('no_strict_rls_apply_attempted') &&
      founderAuthNextStepReadinessSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Founder Auth next-step readiness admin evidence export preview must allow Auth/Admin metadata and boundary fields only'
  );
  assert(
    founderAuthNextStepReadinessSource?.blocked_fields?.includes('magic_link_url') &&
      founderAuthNextStepReadinessSource?.blocked_fields?.includes('auth_token') &&
      founderAuthNextStepReadinessSource?.blocked_fields?.includes('session_cookie') &&
      founderAuthNextStepReadinessSource?.blocked_fields?.includes('profile_repair_approval') &&
      founderAuthNextStepReadinessSource?.blocked_fields?.includes('admin_membership_insert_approval') &&
      founderAuthNextStepReadinessSource?.blocked_fields?.includes('service_role_key') &&
      founderAuthNextStepReadinessSource?.blocked_fields?.includes('strict_rls_apply_approval') &&
      founderAuthNextStepReadinessSource?.blocked_fields?.includes('deploy_setting_change_approval') &&
      founderAuthNextStepReadinessSource?.blocked_fields?.includes('public_beta_approval') &&
      founderAuthNextStepReadinessSource?.blocked_fields?.includes('payment_data') &&
      founderAuthNextStepReadinessSource?.blocked_fields?.includes('legal_decision') &&
      founderAuthNextStepReadinessSource?.blocked_fields?.includes('live_action_approval'),
    'Founder Auth next-step readiness admin evidence export preview must block Auth token, admin insert, strict RLS, deploy, beta, payment, legal, and live fields'
  );
  assert(
    founderAuthNextStepReadinessSource?.raw_content_storage_boundary === founderAuthNextStepReadinessExportBoundary,
    'Founder Auth next-step readiness admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewFounderAuthNextStepReadiness.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewFounderAuthNextStepReadiness.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewFounderAuthNextStepReadiness.body?.no_live_action_attempted === true,
    'Founder Auth next-step readiness admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewWeekTwoAuthAdminReadiness = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=week_two_auth_admin_readiness',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-week-two-auth-admin-readiness-smoke' },
    }
  );
  const weekTwoAuthAdminReadinessExportBoundary =
    'No Magic Link URLs, Auth tokens, session cookies, raw founder identity data, profile repair approvals, admin_memberships insert approvals or SQL, service-role keys, strict RLS apply approvals, deploy setting approvals, public beta approvals, payment data, wallet data, legal/provider decisions, server storage, external sends, or live-action approvals are exported from this Week 2 Auth/Admin readiness preview.';
  const weekTwoAuthAdminReadinessSource =
    adminEvidenceExportPreviewWeekTwoAuthAdminReadiness.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewWeekTwoAuthAdminReadiness.status === 200,
    `Expected Week 2 Auth/Admin readiness admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewWeekTwoAuthAdminReadiness.status}`
  );
  assert(
    adminEvidenceExportPreviewWeekTwoAuthAdminReadiness.body?.selected_source_filter === 'week_two_auth_admin_readiness' &&
      adminEvidenceExportPreviewWeekTwoAuthAdminReadiness.body?.valid_source_filters?.includes('week_two_auth_admin_readiness'),
    'Week 2 Auth/Admin readiness admin evidence export preview must accept the week_two_auth_admin_readiness source filter'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoAuthAdminReadiness.body?.evidence_sources?.length === 1 &&
      weekTwoAuthAdminReadinessSource?.id === 'week_two_auth_admin_readiness',
    'Week 2 Auth/Admin readiness admin evidence export preview must return only the week_two_auth_admin_readiness source'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoAuthAdminReadiness.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewWeekTwoAuthAdminReadiness.body.review_router.targets[0]?.source_id === 'week_two_auth_admin_readiness' &&
      adminEvidenceExportPreviewWeekTwoAuthAdminReadiness.body.review_router.targets[0]?.ui_anchor === 'betaReadinessGrid',
    'Week 2 Auth/Admin readiness admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    weekTwoAuthAdminReadinessSource?.allowed_fields?.includes('auth_admin_checklist_count') &&
      weekTwoAuthAdminReadinessSource?.allowed_fields?.includes('checklist_phase_counts') &&
      weekTwoAuthAdminReadinessSource?.allowed_fields?.includes('founder_report_field_count') &&
      weekTwoAuthAdminReadinessSource?.allowed_fields?.includes('linked_surfaces') &&
      weekTwoAuthAdminReadinessSource?.allowed_fields?.includes('no_live_supabase_write_attempted') &&
      weekTwoAuthAdminReadinessSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Week 2 Auth/Admin readiness admin evidence export preview must allow checklist metadata and boundary fields only'
  );
  assert(
    weekTwoAuthAdminReadinessSource?.blocked_fields?.includes('magic_link_url') &&
      weekTwoAuthAdminReadinessSource?.blocked_fields?.includes('auth_token') &&
      weekTwoAuthAdminReadinessSource?.blocked_fields?.includes('session_cookie') &&
      weekTwoAuthAdminReadinessSource?.blocked_fields?.includes('selected_user_screenshot') &&
      weekTwoAuthAdminReadinessSource?.blocked_fields?.includes('admin_membership_insert_approval') &&
      weekTwoAuthAdminReadinessSource?.blocked_fields?.includes('admin_memberships_update_sql') &&
      weekTwoAuthAdminReadinessSource?.blocked_fields?.includes('service_role_key') &&
      weekTwoAuthAdminReadinessSource?.blocked_fields?.includes('strict_rls_apply_approval') &&
      weekTwoAuthAdminReadinessSource?.blocked_fields?.includes('supabase_project_setting_change_approval') &&
      weekTwoAuthAdminReadinessSource?.blocked_fields?.includes('xpr_signature_approval') &&
      weekTwoAuthAdminReadinessSource?.blocked_fields?.includes('live_action_approval'),
    'Week 2 Auth/Admin readiness admin evidence export preview must block Auth token, screenshot, admin insert/update, strict RLS, Supabase, XPR, and live fields'
  );
  assert(
    weekTwoAuthAdminReadinessSource?.raw_content_storage_boundary === weekTwoAuthAdminReadinessExportBoundary,
    'Week 2 Auth/Admin readiness admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoAuthAdminReadiness.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewWeekTwoAuthAdminReadiness.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewWeekTwoAuthAdminReadiness.body?.no_live_action_attempted === true,
    'Week 2 Auth/Admin readiness admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewWeekTwoAuthAdminExecutionChecklist = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=week_two_auth_admin_execution_checklist',
    {
      headers: {
        'X-Request-Id': 'gcsc-admin-evidence-export-preview-week-two-auth-admin-execution-checklist-smoke',
      },
    }
  );
  const weekTwoAuthAdminExecutionChecklistExportBoundary =
    'No Magic Link URLs, Auth tokens, session cookies, raw founder identity data, selected-user screenshots, profile repair approvals, admin_memberships insert approvals or SQL, service-role keys, raw strict admin smoke output, strict RLS apply approvals, live Supabase changes, deploy approvals, public URL-share approvals, tester-invite approvals, public beta approvals, payment data, wallet data, XPR signatures, legal/provider decisions, server storage, external sends, or live-action approvals are exported from this Week 2 Auth/Admin execution checklist preview.';
  const weekTwoAuthAdminExecutionChecklistSource =
    adminEvidenceExportPreviewWeekTwoAuthAdminExecutionChecklist.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewWeekTwoAuthAdminExecutionChecklist.status === 200,
    `Expected Week 2 Auth/Admin execution checklist admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewWeekTwoAuthAdminExecutionChecklist.status}`
  );
  assert(
    adminEvidenceExportPreviewWeekTwoAuthAdminExecutionChecklist.body?.selected_source_filter ===
      'week_two_auth_admin_execution_checklist' &&
      adminEvidenceExportPreviewWeekTwoAuthAdminExecutionChecklist.body?.valid_source_filters?.includes(
        'week_two_auth_admin_execution_checklist'
      ),
    'Week 2 Auth/Admin execution checklist admin evidence export preview must accept the source filter'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoAuthAdminExecutionChecklist.body?.evidence_sources?.length === 1 &&
      weekTwoAuthAdminExecutionChecklistSource?.id === 'week_two_auth_admin_execution_checklist',
    'Week 2 Auth/Admin execution checklist admin evidence export preview must return only the execution checklist source'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoAuthAdminExecutionChecklist.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewWeekTwoAuthAdminExecutionChecklist.body.review_router.targets[0]?.source_id ===
        'week_two_auth_admin_execution_checklist' &&
      adminEvidenceExportPreviewWeekTwoAuthAdminExecutionChecklist.body.review_router.targets[0]?.ui_anchor ===
        'betaReadinessGrid',
    'Week 2 Auth/Admin execution checklist admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    weekTwoAuthAdminExecutionChecklistSource?.allowed_fields?.includes('execution_checklist_count') &&
      weekTwoAuthAdminExecutionChecklistSource?.allowed_fields?.includes('execution_phase_counts') &&
      weekTwoAuthAdminExecutionChecklistSource?.allowed_fields?.includes('founder_report_field_count') &&
      weekTwoAuthAdminExecutionChecklistSource?.allowed_fields?.includes('no_raw_identity_storage_attempted') &&
      weekTwoAuthAdminExecutionChecklistSource?.allowed_fields?.includes('no_strict_admin_smoke_live_run_attempted') &&
      weekTwoAuthAdminExecutionChecklistSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Week 2 Auth/Admin execution checklist admin evidence export preview must allow checklist metadata and boundary fields only'
  );
  assert(
    weekTwoAuthAdminExecutionChecklistSource?.blocked_fields?.includes('magic_link_url') &&
      weekTwoAuthAdminExecutionChecklistSource?.blocked_fields?.includes('auth_token') &&
      weekTwoAuthAdminExecutionChecklistSource?.blocked_fields?.includes('selected_user_screenshot') &&
      weekTwoAuthAdminExecutionChecklistSource?.blocked_fields?.includes('admin_memberships_insert_sql') &&
      weekTwoAuthAdminExecutionChecklistSource?.blocked_fields?.includes('strict_admin_smoke_raw_output') &&
      weekTwoAuthAdminExecutionChecklistSource?.blocked_fields?.includes('strict_admin_smoke_live_run_approval') &&
      weekTwoAuthAdminExecutionChecklistSource?.blocked_fields?.includes('service_role_key') &&
      weekTwoAuthAdminExecutionChecklistSource?.blocked_fields?.includes('strict_rls_apply_approval') &&
      weekTwoAuthAdminExecutionChecklistSource?.blocked_fields?.includes('xpr_signature') &&
      weekTwoAuthAdminExecutionChecklistSource?.blocked_fields?.includes('live_action_approval'),
    'Week 2 Auth/Admin execution checklist admin evidence export preview must block Auth token, screenshot, raw smoke, admin insert, strict RLS, XPR, and live fields'
  );
  assert(
    weekTwoAuthAdminExecutionChecklistSource?.raw_content_storage_boundary ===
      weekTwoAuthAdminExecutionChecklistExportBoundary,
    'Week 2 Auth/Admin execution checklist admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoAuthAdminExecutionChecklist.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewWeekTwoAuthAdminExecutionChecklist.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewWeekTwoAuthAdminExecutionChecklist.body?.no_live_action_attempted === true,
    'Week 2 Auth/Admin execution checklist admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewDeploymentNextStepReadiness = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=deployment_next_step_readiness',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-deployment-next-step-readiness-smoke' },
    }
  );
  const deploymentNextStepReadinessExportBoundary =
    'No external account login/session details, Vercel account connections, GitHub Pages setting approvals, DNS/Namecheap changes, production env values, service-role keys, Supabase redirect approvals, real public URLs, URL-share approvals, tester-invite approvals, payment data, wallet data, legal/provider decisions, server storage, external sends, or live-action approvals are exported from this deployment next-step readiness preview.';
  const deploymentNextStepReadinessSource =
    adminEvidenceExportPreviewDeploymentNextStepReadiness.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewDeploymentNextStepReadiness.status === 200,
    `Expected deployment next-step readiness admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewDeploymentNextStepReadiness.status}`
  );
  assert(
    adminEvidenceExportPreviewDeploymentNextStepReadiness.body?.selected_source_filter === 'deployment_next_step_readiness' &&
      adminEvidenceExportPreviewDeploymentNextStepReadiness.body?.valid_source_filters?.includes('deployment_next_step_readiness'),
    'Deployment next-step readiness admin evidence export preview must accept the deployment_next_step_readiness source filter'
  );
  assert(
    adminEvidenceExportPreviewDeploymentNextStepReadiness.body?.evidence_sources?.length === 1 &&
      deploymentNextStepReadinessSource?.id === 'deployment_next_step_readiness',
    'Deployment next-step readiness admin evidence export preview must return only the deployment_next_step_readiness source'
  );
  assert(
    adminEvidenceExportPreviewDeploymentNextStepReadiness.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewDeploymentNextStepReadiness.body.review_router.targets[0]?.source_id === 'deployment_next_step_readiness' &&
      adminEvidenceExportPreviewDeploymentNextStepReadiness.body.review_router.targets[0]?.ui_anchor === 'betaReadinessGrid',
    'Deployment next-step readiness admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    deploymentNextStepReadinessSource?.allowed_fields?.includes('deployment_item_count') &&
      deploymentNextStepReadinessSource?.allowed_fields?.includes('readiness_state_counts') &&
      deploymentNextStepReadinessSource?.allowed_fields?.includes('required_evidence_count') &&
      deploymentNextStepReadinessSource?.allowed_fields?.includes('no_deploy_setting_change_attempted') &&
      deploymentNextStepReadinessSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Deployment next-step readiness admin evidence export preview must allow deployment metadata and boundary fields only'
  );
  assert(
    deploymentNextStepReadinessSource?.blocked_fields?.includes('external_account_login') &&
      deploymentNextStepReadinessSource?.blocked_fields?.includes('vercel_account_connection') &&
      deploymentNextStepReadinessSource?.blocked_fields?.includes('github_pages_setting_change_approval') &&
      deploymentNextStepReadinessSource?.blocked_fields?.includes('dns_change_approval') &&
      deploymentNextStepReadinessSource?.blocked_fields?.includes('production_env_var_value') &&
      deploymentNextStepReadinessSource?.blocked_fields?.includes('service_role_key') &&
      deploymentNextStepReadinessSource?.blocked_fields?.includes('supabase_redirect_update_approval') &&
      deploymentNextStepReadinessSource?.blocked_fields?.includes('real_public_url') &&
      deploymentNextStepReadinessSource?.blocked_fields?.includes('public_url_share_approval') &&
      deploymentNextStepReadinessSource?.blocked_fields?.includes('tester_invite_approval') &&
      deploymentNextStepReadinessSource?.blocked_fields?.includes('payment_data') &&
      deploymentNextStepReadinessSource?.blocked_fields?.includes('legal_decision') &&
      deploymentNextStepReadinessSource?.blocked_fields?.includes('live_action_approval'),
    'Deployment next-step readiness admin evidence export preview must block account/deploy/DNS/env/URL/invite/payment/legal/live fields'
  );
  assert(
    deploymentNextStepReadinessSource?.raw_content_storage_boundary === deploymentNextStepReadinessExportBoundary,
    'Deployment next-step readiness admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewDeploymentNextStepReadiness.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewDeploymentNextStepReadiness.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewDeploymentNextStepReadiness.body?.no_live_action_attempted === true,
    'Deployment next-step readiness admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewWeekTwoDeploymentPublicBetaReadiness = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=week_two_deployment_public_beta_readiness',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-week-two-deployment-public-beta-readiness-smoke' },
    }
  );
  const weekTwoDeploymentPublicBetaReadinessExportBoundary =
    'No external account session details, Vercel account connections, GitHub Pages setting approvals, DNS/Namecheap changes, production env values, service-role keys, Supabase redirect approvals, real public URLs, private URLs, public URL-share approvals, tester-invite approvals, public beta launch approvals, payment data, wallet data, loan/escrow/repayment approvals, stablecoin settlement approvals, token collateral lock approvals, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this Week 2 deployment/public beta readiness preview.';
  const weekTwoDeploymentPublicBetaReadinessSource =
    adminEvidenceExportPreviewWeekTwoDeploymentPublicBetaReadiness.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewWeekTwoDeploymentPublicBetaReadiness.status === 200,
    `Expected Week 2 deployment/public beta readiness admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewWeekTwoDeploymentPublicBetaReadiness.status}`
  );
  assert(
    adminEvidenceExportPreviewWeekTwoDeploymentPublicBetaReadiness.body?.selected_source_filter === 'week_two_deployment_public_beta_readiness' &&
      adminEvidenceExportPreviewWeekTwoDeploymentPublicBetaReadiness.body?.valid_source_filters?.includes('week_two_deployment_public_beta_readiness'),
    'Week 2 deployment/public beta readiness admin evidence export preview must accept the week_two_deployment_public_beta_readiness source filter'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoDeploymentPublicBetaReadiness.body?.evidence_sources?.length === 1 &&
      weekTwoDeploymentPublicBetaReadinessSource?.id === 'week_two_deployment_public_beta_readiness',
    'Week 2 deployment/public beta readiness admin evidence export preview must return only the week_two_deployment_public_beta_readiness source'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoDeploymentPublicBetaReadiness.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewWeekTwoDeploymentPublicBetaReadiness.body.review_router.targets[0]?.source_id === 'week_two_deployment_public_beta_readiness' &&
      adminEvidenceExportPreviewWeekTwoDeploymentPublicBetaReadiness.body.review_router.targets[0]?.ui_anchor === 'betaReadinessGrid',
    'Week 2 deployment/public beta readiness admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    weekTwoDeploymentPublicBetaReadinessSource?.allowed_fields?.includes('deployment_public_beta_checklist_count') &&
      weekTwoDeploymentPublicBetaReadinessSource?.allowed_fields?.includes('checklist_phase_counts') &&
      weekTwoDeploymentPublicBetaReadinessSource?.allowed_fields?.includes('founder_report_field_count') &&
      weekTwoDeploymentPublicBetaReadinessSource?.allowed_fields?.includes('linked_surfaces') &&
      weekTwoDeploymentPublicBetaReadinessSource?.allowed_fields?.includes('no_public_beta_flip_attempted') &&
      weekTwoDeploymentPublicBetaReadinessSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Week 2 deployment/public beta readiness admin evidence export preview must allow checklist metadata and boundary fields only'
  );
  assert(
    weekTwoDeploymentPublicBetaReadinessSource?.blocked_fields?.includes('external_account_session') &&
      weekTwoDeploymentPublicBetaReadinessSource?.blocked_fields?.includes('vercel_account_connection') &&
      weekTwoDeploymentPublicBetaReadinessSource?.blocked_fields?.includes('github_pages_setting_change_approval') &&
      weekTwoDeploymentPublicBetaReadinessSource?.blocked_fields?.includes('dns_change_approval') &&
      weekTwoDeploymentPublicBetaReadinessSource?.blocked_fields?.includes('production_env_value') &&
      weekTwoDeploymentPublicBetaReadinessSource?.blocked_fields?.includes('service_role_key') &&
      weekTwoDeploymentPublicBetaReadinessSource?.blocked_fields?.includes('supabase_redirect_update_approval') &&
      weekTwoDeploymentPublicBetaReadinessSource?.blocked_fields?.includes('real_public_url') &&
      weekTwoDeploymentPublicBetaReadinessSource?.blocked_fields?.includes('private_url') &&
      weekTwoDeploymentPublicBetaReadinessSource?.blocked_fields?.includes('public_url_share_approval') &&
      weekTwoDeploymentPublicBetaReadinessSource?.blocked_fields?.includes('tester_invite_approval') &&
      weekTwoDeploymentPublicBetaReadinessSource?.blocked_fields?.includes('public_beta_launch_approval') &&
      weekTwoDeploymentPublicBetaReadinessSource?.blocked_fields?.includes('repayment_routing_approval') &&
      weekTwoDeploymentPublicBetaReadinessSource?.blocked_fields?.includes('token_collateral_lock_approval') &&
      weekTwoDeploymentPublicBetaReadinessSource?.blocked_fields?.includes('live_action_approval'),
    'Week 2 deployment/public beta readiness admin evidence export preview must block account/deploy/DNS/env/URL/invite/beta/finance/token/live fields'
  );
  assert(
    weekTwoDeploymentPublicBetaReadinessSource?.raw_content_storage_boundary === weekTwoDeploymentPublicBetaReadinessExportBoundary,
    'Week 2 deployment/public beta readiness admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoDeploymentPublicBetaReadiness.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewWeekTwoDeploymentPublicBetaReadiness.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewWeekTwoDeploymentPublicBetaReadiness.body?.no_live_action_attempted === true,
    'Week 2 deployment/public beta readiness admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewWeekTwoDeploymentPublicBetaExecutionChecklist = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=week_two_deployment_public_beta_execution_checklist',
    {
      headers: {
        'X-Request-Id':
          'gcsc-admin-evidence-export-preview-week-two-deployment-public-beta-execution-checklist-smoke',
      },
    }
  );
  const weekTwoDeploymentPublicBetaExecutionChecklistExportBoundary =
    'No external account login/session details, deployment account sessions, Vercel account connections, GitHub Pages setting approvals, DNS/Namecheap changes, production env values, service-role keys, Supabase redirect approvals, Supabase project setting approvals, real public URLs, URL-share approvals, tester-invite approvals, public beta approvals, production deploy approvals, payment data, wallet data, XPR signatures, legal/provider decisions, server storage, external sends, or live-action approvals are exported from this Week 2 deployment/public beta execution checklist preview.';
  const weekTwoDeploymentPublicBetaExecutionChecklistSource =
    adminEvidenceExportPreviewWeekTwoDeploymentPublicBetaExecutionChecklist.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewWeekTwoDeploymentPublicBetaExecutionChecklist.status === 200,
    `Expected Week 2 deployment/public beta execution checklist admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewWeekTwoDeploymentPublicBetaExecutionChecklist.status}`
  );
  assert(
    adminEvidenceExportPreviewWeekTwoDeploymentPublicBetaExecutionChecklist.body?.selected_source_filter ===
      'week_two_deployment_public_beta_execution_checklist' &&
      adminEvidenceExportPreviewWeekTwoDeploymentPublicBetaExecutionChecklist.body?.valid_source_filters?.includes(
        'week_two_deployment_public_beta_execution_checklist'
      ),
    'Week 2 deployment/public beta execution checklist admin evidence export preview must accept the source filter'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoDeploymentPublicBetaExecutionChecklist.body?.evidence_sources?.length === 1 &&
      weekTwoDeploymentPublicBetaExecutionChecklistSource?.id ===
        'week_two_deployment_public_beta_execution_checklist',
    'Week 2 deployment/public beta execution checklist admin evidence export preview must return only the execution checklist source'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoDeploymentPublicBetaExecutionChecklist.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewWeekTwoDeploymentPublicBetaExecutionChecklist.body.review_router.targets[0]
        ?.source_id === 'week_two_deployment_public_beta_execution_checklist' &&
      adminEvidenceExportPreviewWeekTwoDeploymentPublicBetaExecutionChecklist.body.review_router.targets[0]
        ?.ui_anchor === 'betaReadinessGrid',
    'Week 2 deployment/public beta execution checklist admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    weekTwoDeploymentPublicBetaExecutionChecklistSource?.allowed_fields?.includes(
      'deployment_public_beta_execution_checklist_count'
    ) &&
      weekTwoDeploymentPublicBetaExecutionChecklistSource?.allowed_fields?.includes('execution_phase_counts') &&
      weekTwoDeploymentPublicBetaExecutionChecklistSource?.allowed_fields?.includes('founder_report_field_count') &&
      weekTwoDeploymentPublicBetaExecutionChecklistSource?.allowed_fields?.includes('linked_surfaces') &&
      weekTwoDeploymentPublicBetaExecutionChecklistSource?.allowed_fields?.includes(
        'no_external_account_session_storage_attempted'
      ) &&
      weekTwoDeploymentPublicBetaExecutionChecklistSource?.allowed_fields?.includes(
        'no_real_public_url_storage_attempted'
      ) &&
      weekTwoDeploymentPublicBetaExecutionChecklistSource?.allowed_fields?.includes(
        'no_live_supabase_write_attempted'
      ) &&
      weekTwoDeploymentPublicBetaExecutionChecklistSource?.allowed_fields?.includes('no_xpr_signature_attempted') &&
      weekTwoDeploymentPublicBetaExecutionChecklistSource?.allowed_fields?.includes(
        'raw_content_storage_boundary'
      ),
    'Week 2 deployment/public beta execution checklist admin evidence export preview must allow execution metadata and boundary fields only'
  );
  assert(
    weekTwoDeploymentPublicBetaExecutionChecklistSource?.blocked_fields?.includes('external_account_session') &&
      weekTwoDeploymentPublicBetaExecutionChecklistSource?.blocked_fields?.includes('deployment_account_session') &&
      weekTwoDeploymentPublicBetaExecutionChecklistSource?.blocked_fields?.includes(
        'vercel_account_connection_approval'
      ) &&
      weekTwoDeploymentPublicBetaExecutionChecklistSource?.blocked_fields?.includes(
        'github_pages_setting_approval'
      ) &&
      weekTwoDeploymentPublicBetaExecutionChecklistSource?.blocked_fields?.includes('dns_change_approval') &&
      weekTwoDeploymentPublicBetaExecutionChecklistSource?.blocked_fields?.includes('production_env_value') &&
      weekTwoDeploymentPublicBetaExecutionChecklistSource?.blocked_fields?.includes('service_role_key') &&
      weekTwoDeploymentPublicBetaExecutionChecklistSource?.blocked_fields?.includes('supabase_redirect_approval') &&
      weekTwoDeploymentPublicBetaExecutionChecklistSource?.blocked_fields?.includes(
        'supabase_project_setting_change_approval'
      ) &&
      weekTwoDeploymentPublicBetaExecutionChecklistSource?.blocked_fields?.includes('real_public_url') &&
      weekTwoDeploymentPublicBetaExecutionChecklistSource?.blocked_fields?.includes('public_url_share_approval') &&
      weekTwoDeploymentPublicBetaExecutionChecklistSource?.blocked_fields?.includes('tester_invite_approval') &&
      weekTwoDeploymentPublicBetaExecutionChecklistSource?.blocked_fields?.includes('public_beta_approval') &&
      weekTwoDeploymentPublicBetaExecutionChecklistSource?.blocked_fields?.includes('production_deploy_approval') &&
      weekTwoDeploymentPublicBetaExecutionChecklistSource?.blocked_fields?.includes('payment_data') &&
      weekTwoDeploymentPublicBetaExecutionChecklistSource?.blocked_fields?.includes('wallet_data') &&
      weekTwoDeploymentPublicBetaExecutionChecklistSource?.blocked_fields?.includes('xpr_signature') &&
      weekTwoDeploymentPublicBetaExecutionChecklistSource?.blocked_fields?.includes('legal_or_provider_decision') &&
      weekTwoDeploymentPublicBetaExecutionChecklistSource?.blocked_fields?.includes('live_action_approval'),
    'Week 2 deployment/public beta execution checklist admin evidence export preview must block account/deploy/DNS/env/URL/invite/beta/payment/XPR/legal/live fields'
  );
  assert(
    weekTwoDeploymentPublicBetaExecutionChecklistSource?.raw_content_storage_boundary ===
      weekTwoDeploymentPublicBetaExecutionChecklistExportBoundary,
    'Week 2 deployment/public beta execution checklist admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoDeploymentPublicBetaExecutionChecklist.body?.export_gate?.external_send ===
      'blocked' &&
      adminEvidenceExportPreviewWeekTwoDeploymentPublicBetaExecutionChecklist.body?.no_server_storage_attempted ===
        true &&
      adminEvidenceExportPreviewWeekTwoDeploymentPublicBetaExecutionChecklist.body?.no_live_action_attempted === true,
    'Week 2 deployment/public beta execution checklist admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewWeekTwoMobileReleaseReadiness = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=week_two_mobile_release_readiness',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-week-two-mobile-release-readiness-smoke' },
    }
  );
  const weekTwoMobileReleaseReadinessExportBoundary =
    'No App Store Connect approvals, Apple Developer approvals, Play Console approvals, TestFlight approvals, Play testing approvals, signing keys, certificates, provisioning profiles, keystores, store metadata approvals, screenshot files, device identifiers, external account sessions, public release approvals, deploy approvals, live Supabase approvals, payment data, wallet data, loan approvals, escrow approvals, stablecoin settlement approvals, token collateral approvals, XPR signatures, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this Week 2 mobile release readiness preview.';
  const weekTwoMobileReleaseReadinessSource =
    adminEvidenceExportPreviewWeekTwoMobileReleaseReadiness.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewWeekTwoMobileReleaseReadiness.status === 200,
    `Expected Week 2 mobile release readiness admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewWeekTwoMobileReleaseReadiness.status}`
  );
  assert(
    adminEvidenceExportPreviewWeekTwoMobileReleaseReadiness.body?.selected_source_filter === 'week_two_mobile_release_readiness' &&
      adminEvidenceExportPreviewWeekTwoMobileReleaseReadiness.body?.valid_source_filters?.includes('week_two_mobile_release_readiness'),
    'Week 2 mobile release readiness admin evidence export preview must accept the week_two_mobile_release_readiness source filter'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoMobileReleaseReadiness.body?.evidence_sources?.length === 1 &&
      weekTwoMobileReleaseReadinessSource?.id === 'week_two_mobile_release_readiness',
    'Week 2 mobile release readiness admin evidence export preview must return only the week_two_mobile_release_readiness source'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoMobileReleaseReadiness.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewWeekTwoMobileReleaseReadiness.body.review_router.targets[0]?.source_id === 'week_two_mobile_release_readiness' &&
      adminEvidenceExportPreviewWeekTwoMobileReleaseReadiness.body.review_router.targets[0]?.ui_anchor === 'betaReadinessGrid',
    'Week 2 mobile release readiness admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    weekTwoMobileReleaseReadinessSource?.allowed_fields?.includes('mobile_release_item_count') &&
      weekTwoMobileReleaseReadinessSource?.allowed_fields?.includes('readiness_state_counts') &&
      weekTwoMobileReleaseReadinessSource?.allowed_fields?.includes('readiness_area_counts') &&
      weekTwoMobileReleaseReadinessSource?.allowed_fields?.includes('founder_report_field_count') &&
      weekTwoMobileReleaseReadinessSource?.allowed_fields?.includes('linked_surfaces') &&
      weekTwoMobileReleaseReadinessSource?.allowed_fields?.includes('no_app_store_submission_attempted') &&
      weekTwoMobileReleaseReadinessSource?.allowed_fields?.includes('no_play_console_submission_attempted') &&
      weekTwoMobileReleaseReadinessSource?.allowed_fields?.includes('no_signing_key_upload_attempted') &&
      weekTwoMobileReleaseReadinessSource?.allowed_fields?.includes('no_xpr_signature_attempted') &&
      weekTwoMobileReleaseReadinessSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Week 2 mobile release readiness admin evidence export preview must allow mobile-release metadata and boundary fields only'
  );
  assert(
    weekTwoMobileReleaseReadinessSource?.blocked_fields?.includes('app_store_connect_session') &&
      weekTwoMobileReleaseReadinessSource?.blocked_fields?.includes('apple_developer_account_session') &&
      weekTwoMobileReleaseReadinessSource?.blocked_fields?.includes('play_console_account_session') &&
      weekTwoMobileReleaseReadinessSource?.blocked_fields?.includes('testflight_submission_approval') &&
      weekTwoMobileReleaseReadinessSource?.blocked_fields?.includes('play_testing_release_approval') &&
      weekTwoMobileReleaseReadinessSource?.blocked_fields?.includes('signing_key') &&
      weekTwoMobileReleaseReadinessSource?.blocked_fields?.includes('certificate') &&
      weekTwoMobileReleaseReadinessSource?.blocked_fields?.includes('provisioning_profile') &&
      weekTwoMobileReleaseReadinessSource?.blocked_fields?.includes('keystore') &&
      weekTwoMobileReleaseReadinessSource?.blocked_fields?.includes('device_identifier') &&
      weekTwoMobileReleaseReadinessSource?.blocked_fields?.includes('public_release_approval') &&
      weekTwoMobileReleaseReadinessSource?.blocked_fields?.includes('payment_or_wallet_data') &&
      weekTwoMobileReleaseReadinessSource?.blocked_fields?.includes('loan_approval') &&
      weekTwoMobileReleaseReadinessSource?.blocked_fields?.includes('stablecoin_settlement_approval') &&
      weekTwoMobileReleaseReadinessSource?.blocked_fields?.includes('token_collateral_lock_approval') &&
      weekTwoMobileReleaseReadinessSource?.blocked_fields?.includes('xpr_signature') &&
      weekTwoMobileReleaseReadinessSource?.blocked_fields?.includes('legal_decision') &&
      weekTwoMobileReleaseReadinessSource?.blocked_fields?.includes('live_action_approval'),
    'Week 2 mobile release readiness admin evidence export preview must block store/account/signing/device/release/finance/XPR/legal/live fields'
  );
  assert(
    weekTwoMobileReleaseReadinessSource?.raw_content_storage_boundary === weekTwoMobileReleaseReadinessExportBoundary,
    'Week 2 mobile release readiness admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoMobileReleaseReadiness.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewWeekTwoMobileReleaseReadiness.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewWeekTwoMobileReleaseReadiness.body?.no_live_action_attempted === true,
    'Week 2 mobile release readiness admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewWeekTwoMobileReleaseExecutionChecklist = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=week_two_mobile_release_execution_checklist',
    {
      headers: {
        'X-Request-Id': 'gcsc-admin-evidence-export-preview-week-two-mobile-release-execution-checklist-smoke',
      },
    }
  );
  const weekTwoMobileReleaseExecutionChecklistExportBoundary =
    'No App Store Connect sessions, Apple Developer sessions, Play Console sessions, external account sessions, TestFlight approvals, Play testing approvals, App Store submission approvals, Play Console submission approvals, signing keys, certificates, provisioning profiles, keystores, store metadata approvals, screenshot files, device identifiers, public release approvals, public URL-share approvals, tester-invite approvals, live Supabase approvals, payment data, wallet data, loan approvals, escrow approvals, stablecoin settlement approvals, token collateral approvals, XPR signatures, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this Week 2 mobile release execution checklist preview.';
  const weekTwoMobileReleaseExecutionChecklistSource =
    adminEvidenceExportPreviewWeekTwoMobileReleaseExecutionChecklist.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewWeekTwoMobileReleaseExecutionChecklist.status === 200,
    `Expected Week 2 mobile release execution checklist admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewWeekTwoMobileReleaseExecutionChecklist.status}`
  );
  assert(
    adminEvidenceExportPreviewWeekTwoMobileReleaseExecutionChecklist.body?.selected_source_filter ===
      'week_two_mobile_release_execution_checklist' &&
      adminEvidenceExportPreviewWeekTwoMobileReleaseExecutionChecklist.body?.valid_source_filters?.includes(
        'week_two_mobile_release_execution_checklist'
      ),
    'Week 2 mobile release execution checklist admin evidence export preview must accept the week_two_mobile_release_execution_checklist source filter'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoMobileReleaseExecutionChecklist.body?.evidence_sources?.length === 1 &&
      weekTwoMobileReleaseExecutionChecklistSource?.id === 'week_two_mobile_release_execution_checklist',
    'Week 2 mobile release execution checklist admin evidence export preview must return only the week_two_mobile_release_execution_checklist source'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoMobileReleaseExecutionChecklist.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewWeekTwoMobileReleaseExecutionChecklist.body.review_router.targets[0]?.source_id ===
        'week_two_mobile_release_execution_checklist' &&
      adminEvidenceExportPreviewWeekTwoMobileReleaseExecutionChecklist.body.review_router.targets[0]?.ui_anchor ===
        'betaReadinessGrid',
    'Week 2 mobile release execution checklist admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    weekTwoMobileReleaseExecutionChecklistSource?.allowed_fields?.includes(
      'mobile_release_execution_checklist_count'
    ) &&
      weekTwoMobileReleaseExecutionChecklistSource?.allowed_fields?.includes('execution_phase_counts') &&
      weekTwoMobileReleaseExecutionChecklistSource?.allowed_fields?.includes('founder_report_field_count') &&
      weekTwoMobileReleaseExecutionChecklistSource?.allowed_fields?.includes('linked_surfaces') &&
      weekTwoMobileReleaseExecutionChecklistSource?.allowed_fields?.includes('no_app_store_submission_attempted') &&
      weekTwoMobileReleaseExecutionChecklistSource?.allowed_fields?.includes('no_signing_key_upload_attempted') &&
      weekTwoMobileReleaseExecutionChecklistSource?.allowed_fields?.includes(
        'no_device_identifier_storage_attempted'
      ) &&
      weekTwoMobileReleaseExecutionChecklistSource?.allowed_fields?.includes('no_public_release_attempted') &&
      weekTwoMobileReleaseExecutionChecklistSource?.allowed_fields?.includes('no_xpr_signature_attempted') &&
      weekTwoMobileReleaseExecutionChecklistSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Week 2 mobile release execution checklist admin evidence export preview must allow mobile-execution metadata and boundary fields only'
  );
  assert(
    weekTwoMobileReleaseExecutionChecklistSource?.blocked_fields?.includes('app_store_connect_session') &&
      weekTwoMobileReleaseExecutionChecklistSource?.blocked_fields?.includes('apple_developer_account_session') &&
      weekTwoMobileReleaseExecutionChecklistSource?.blocked_fields?.includes('play_console_account_session') &&
      weekTwoMobileReleaseExecutionChecklistSource?.blocked_fields?.includes('testflight_submission_approval') &&
      weekTwoMobileReleaseExecutionChecklistSource?.blocked_fields?.includes('play_testing_release_approval') &&
      weekTwoMobileReleaseExecutionChecklistSource?.blocked_fields?.includes('signing_key') &&
      weekTwoMobileReleaseExecutionChecklistSource?.blocked_fields?.includes('certificate') &&
      weekTwoMobileReleaseExecutionChecklistSource?.blocked_fields?.includes('provisioning_profile') &&
      weekTwoMobileReleaseExecutionChecklistSource?.blocked_fields?.includes('keystore') &&
      weekTwoMobileReleaseExecutionChecklistSource?.blocked_fields?.includes('store_metadata_approval') &&
      weekTwoMobileReleaseExecutionChecklistSource?.blocked_fields?.includes('device_identifier') &&
      weekTwoMobileReleaseExecutionChecklistSource?.blocked_fields?.includes('public_release_approval') &&
      weekTwoMobileReleaseExecutionChecklistSource?.blocked_fields?.includes('public_url_share_approval') &&
      weekTwoMobileReleaseExecutionChecklistSource?.blocked_fields?.includes('tester_invite_approval') &&
      weekTwoMobileReleaseExecutionChecklistSource?.blocked_fields?.includes('xpr_signature') &&
      weekTwoMobileReleaseExecutionChecklistSource?.blocked_fields?.includes('legal_decision') &&
      weekTwoMobileReleaseExecutionChecklistSource?.blocked_fields?.includes('live_action_approval'),
    'Week 2 mobile release execution checklist admin evidence export preview must block store/account/signing/device/release/finance/XPR/legal/live fields'
  );
  assert(
    weekTwoMobileReleaseExecutionChecklistSource?.raw_content_storage_boundary ===
      weekTwoMobileReleaseExecutionChecklistExportBoundary,
    'Week 2 mobile release execution checklist admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoMobileReleaseExecutionChecklist.body?.export_gate?.external_send ===
      'blocked' &&
      adminEvidenceExportPreviewWeekTwoMobileReleaseExecutionChecklist.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewWeekTwoMobileReleaseExecutionChecklist.body?.no_live_action_attempted === true,
    'Week 2 mobile release execution checklist admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewLegalProviderNextStepReadiness = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=legal_provider_next_step_readiness',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-legal-provider-next-step-readiness-smoke' },
    }
  );
  const legalProviderNextStepReadinessExportBoundary =
    'No raw reviewer responses, attorney advice, legal conclusions, provider commitments, external-send approvals, provider credentials, payment data, wallet data, credit approvals, loan origination approvals, escrow release approvals, repayment routing approvals, stablecoin settlement approvals, token collateral lock approvals, XPR signatures, public claim approvals, server storage, external sends, or live-action approvals are exported from this legal/provider next-step readiness preview.';
  const legalProviderNextStepReadinessSource =
    adminEvidenceExportPreviewLegalProviderNextStepReadiness.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewLegalProviderNextStepReadiness.status === 200,
    `Expected legal/provider next-step readiness admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewLegalProviderNextStepReadiness.status}`
  );
  assert(
    adminEvidenceExportPreviewLegalProviderNextStepReadiness.body?.selected_source_filter === 'legal_provider_next_step_readiness' &&
      adminEvidenceExportPreviewLegalProviderNextStepReadiness.body?.valid_source_filters?.includes('legal_provider_next_step_readiness'),
    'Legal/provider next-step readiness admin evidence export preview must accept the legal_provider_next_step_readiness source filter'
  );
  assert(
    adminEvidenceExportPreviewLegalProviderNextStepReadiness.body?.evidence_sources?.length === 1 &&
      legalProviderNextStepReadinessSource?.id === 'legal_provider_next_step_readiness',
    'Legal/provider next-step readiness admin evidence export preview must return only the legal_provider_next_step_readiness source'
  );
  assert(
    adminEvidenceExportPreviewLegalProviderNextStepReadiness.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewLegalProviderNextStepReadiness.body.review_router.targets[0]?.source_id === 'legal_provider_next_step_readiness' &&
      adminEvidenceExportPreviewLegalProviderNextStepReadiness.body.review_router.targets[0]?.ui_anchor === 'betaReadinessGrid',
    'Legal/provider next-step readiness admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    legalProviderNextStepReadinessSource?.allowed_fields?.includes('legal_provider_item_count') &&
      legalProviderNextStepReadinessSource?.allowed_fields?.includes('readiness_state_counts') &&
      legalProviderNextStepReadinessSource?.allowed_fields?.includes('review_area_counts') &&
      legalProviderNextStepReadinessSource?.allowed_fields?.includes('no_provider_commitment_attempted') &&
      legalProviderNextStepReadinessSource?.allowed_fields?.includes('no_legal_decision_attempted') &&
      legalProviderNextStepReadinessSource?.allowed_fields?.includes('no_xpr_signature_attempted') &&
      legalProviderNextStepReadinessSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Legal/provider next-step readiness admin evidence export preview must allow legal/provider metadata and boundary fields only'
  );
  assert(
    legalProviderNextStepReadinessSource?.blocked_fields?.includes('raw_reviewer_response') &&
      legalProviderNextStepReadinessSource?.blocked_fields?.includes('attorney_advice') &&
      legalProviderNextStepReadinessSource?.blocked_fields?.includes('legal_conclusion') &&
      legalProviderNextStepReadinessSource?.blocked_fields?.includes('provider_commitment') &&
      legalProviderNextStepReadinessSource?.blocked_fields?.includes('external_send_approval') &&
      legalProviderNextStepReadinessSource?.blocked_fields?.includes('provider_credentials') &&
      legalProviderNextStepReadinessSource?.blocked_fields?.includes('payment_data') &&
      legalProviderNextStepReadinessSource?.blocked_fields?.includes('wallet_data') &&
      legalProviderNextStepReadinessSource?.blocked_fields?.includes('loan_origination_approval') &&
      legalProviderNextStepReadinessSource?.blocked_fields?.includes('escrow_release_approval') &&
      legalProviderNextStepReadinessSource?.blocked_fields?.includes('repayment_routing_approval') &&
      legalProviderNextStepReadinessSource?.blocked_fields?.includes('stablecoin_settlement_approval') &&
      legalProviderNextStepReadinessSource?.blocked_fields?.includes('token_collateral_lock_approval') &&
      legalProviderNextStepReadinessSource?.blocked_fields?.includes('xpr_signature_approval') &&
      legalProviderNextStepReadinessSource?.blocked_fields?.includes('public_claim_approval') &&
      legalProviderNextStepReadinessSource?.blocked_fields?.includes('live_action_approval'),
    'Legal/provider next-step readiness admin evidence export preview must block reviewer/legal/provider/finance/XPR/public-claim/live fields'
  );
  assert(
    legalProviderNextStepReadinessSource?.raw_content_storage_boundary === legalProviderNextStepReadinessExportBoundary,
    'Legal/provider next-step readiness admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewLegalProviderNextStepReadiness.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewLegalProviderNextStepReadiness.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewLegalProviderNextStepReadiness.body?.no_live_action_attempted === true,
    'Legal/provider next-step readiness admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewWeekTwoLegalProviderReadiness = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=week_two_legal_provider_readiness',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-week-two-legal-provider-readiness-smoke' },
    }
  );
  const weekTwoLegalProviderReadinessExportBoundary =
    'No raw reviewer responses, attorney advice, legal conclusions, provider commitments, provider submissions, external-send approvals, provider credentials, payment data, wallet data, credit approvals, loan origination approvals, escrow release approvals, refund or payout instructions, repayment routing approvals, stablecoin settlement approvals, token collateral lock approvals, token custody approvals, XPR signatures, smart-contract deployment approvals, public claim approvals, server storage, external sends, or live-action approvals are exported from this Week 2 legal/provider readiness preview.';
  const weekTwoLegalProviderReadinessSource =
    adminEvidenceExportPreviewWeekTwoLegalProviderReadiness.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewWeekTwoLegalProviderReadiness.status === 200,
    `Expected Week 2 legal/provider readiness admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewWeekTwoLegalProviderReadiness.status}`
  );
  assert(
    adminEvidenceExportPreviewWeekTwoLegalProviderReadiness.body?.selected_source_filter === 'week_two_legal_provider_readiness' &&
      adminEvidenceExportPreviewWeekTwoLegalProviderReadiness.body?.valid_source_filters?.includes('week_two_legal_provider_readiness'),
    'Week 2 legal/provider readiness admin evidence export preview must accept the week_two_legal_provider_readiness source filter'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoLegalProviderReadiness.body?.evidence_sources?.length === 1 &&
      weekTwoLegalProviderReadinessSource?.id === 'week_two_legal_provider_readiness',
    'Week 2 legal/provider readiness admin evidence export preview must return only the week_two_legal_provider_readiness source'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoLegalProviderReadiness.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewWeekTwoLegalProviderReadiness.body.review_router.targets[0]?.source_id === 'week_two_legal_provider_readiness' &&
      adminEvidenceExportPreviewWeekTwoLegalProviderReadiness.body.review_router.targets[0]?.ui_anchor === 'betaReadinessGrid',
    'Week 2 legal/provider readiness admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    weekTwoLegalProviderReadinessSource?.allowed_fields?.includes('legal_provider_checklist_count') &&
      weekTwoLegalProviderReadinessSource?.allowed_fields?.includes('checklist_phase_counts') &&
      weekTwoLegalProviderReadinessSource?.allowed_fields?.includes('review_area_counts') &&
      weekTwoLegalProviderReadinessSource?.allowed_fields?.includes('founder_report_field_count') &&
      weekTwoLegalProviderReadinessSource?.allowed_fields?.includes('linked_surfaces') &&
      weekTwoLegalProviderReadinessSource?.allowed_fields?.includes('no_provider_submission_attempted') &&
      weekTwoLegalProviderReadinessSource?.allowed_fields?.includes('no_smart_contract_deployment_attempted') &&
      weekTwoLegalProviderReadinessSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Week 2 legal/provider readiness admin evidence export preview must allow checklist metadata and boundary fields only'
  );
  assert(
    weekTwoLegalProviderReadinessSource?.blocked_fields?.includes('raw_reviewer_response') &&
      weekTwoLegalProviderReadinessSource?.blocked_fields?.includes('attorney_advice') &&
      weekTwoLegalProviderReadinessSource?.blocked_fields?.includes('legal_conclusion') &&
      weekTwoLegalProviderReadinessSource?.blocked_fields?.includes('provider_commitment') &&
      weekTwoLegalProviderReadinessSource?.blocked_fields?.includes('provider_submission_approval') &&
      weekTwoLegalProviderReadinessSource?.blocked_fields?.includes('external_send_approval') &&
      weekTwoLegalProviderReadinessSource?.blocked_fields?.includes('provider_credentials') &&
      weekTwoLegalProviderReadinessSource?.blocked_fields?.includes('payment_data') &&
      weekTwoLegalProviderReadinessSource?.blocked_fields?.includes('wallet_data') &&
      weekTwoLegalProviderReadinessSource?.blocked_fields?.includes('loan_origination_approval') &&
      weekTwoLegalProviderReadinessSource?.blocked_fields?.includes('escrow_release_approval') &&
      weekTwoLegalProviderReadinessSource?.blocked_fields?.includes('refund_instruction_approval') &&
      weekTwoLegalProviderReadinessSource?.blocked_fields?.includes('contractor_payout_approval') &&
      weekTwoLegalProviderReadinessSource?.blocked_fields?.includes('repayment_routing_approval') &&
      weekTwoLegalProviderReadinessSource?.blocked_fields?.includes('stablecoin_settlement_approval') &&
      weekTwoLegalProviderReadinessSource?.blocked_fields?.includes('token_collateral_lock_approval') &&
      weekTwoLegalProviderReadinessSource?.blocked_fields?.includes('token_custody_approval') &&
      weekTwoLegalProviderReadinessSource?.blocked_fields?.includes('xpr_signature_approval') &&
      weekTwoLegalProviderReadinessSource?.blocked_fields?.includes('smart_contract_deployment_approval') &&
      weekTwoLegalProviderReadinessSource?.blocked_fields?.includes('public_claim_approval') &&
      weekTwoLegalProviderReadinessSource?.blocked_fields?.includes('live_action_approval'),
    'Week 2 legal/provider readiness admin evidence export preview must block reviewer/legal/provider/finance/collateral/XPR/public-claim/live fields'
  );
  assert(
    weekTwoLegalProviderReadinessSource?.raw_content_storage_boundary === weekTwoLegalProviderReadinessExportBoundary,
    'Week 2 legal/provider readiness admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoLegalProviderReadiness.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewWeekTwoLegalProviderReadiness.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewWeekTwoLegalProviderReadiness.body?.no_live_action_attempted === true,
    'Week 2 legal/provider readiness admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewWeekTwoLegalProviderExecutionChecklist = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=week_two_legal_provider_execution_checklist',
    {
      headers: {
        'X-Request-Id': 'gcsc-admin-evidence-export-preview-week-two-legal-provider-execution-checklist-smoke',
      },
    }
  );
  const weekTwoLegalProviderExecutionChecklistExportBoundary =
    'No raw reviewer responses, attorney advice, legal conclusions, provider commitments, provider submissions, external-send approvals, provider credentials, payment data, wallet data, credit approvals, loan origination approvals, escrow release approvals, refund or payout instructions, repayment routing approvals, stablecoin settlement approvals, token collateral lock approvals, token custody approvals, XPR signatures, smart-contract deployment approvals, public claim approvals, production approvals, server storage, external sends, or live-action approvals are exported from this Week 2 legal/provider execution checklist preview.';
  const weekTwoLegalProviderExecutionChecklistSource =
    adminEvidenceExportPreviewWeekTwoLegalProviderExecutionChecklist.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewWeekTwoLegalProviderExecutionChecklist.status === 200,
    `Expected Week 2 legal/provider execution checklist admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewWeekTwoLegalProviderExecutionChecklist.status}`
  );
  assert(
    adminEvidenceExportPreviewWeekTwoLegalProviderExecutionChecklist.body?.selected_source_filter ===
      'week_two_legal_provider_execution_checklist' &&
      adminEvidenceExportPreviewWeekTwoLegalProviderExecutionChecklist.body?.valid_source_filters?.includes(
        'week_two_legal_provider_execution_checklist'
      ),
    'Week 2 legal/provider execution checklist admin evidence export preview must accept the week_two_legal_provider_execution_checklist source filter'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoLegalProviderExecutionChecklist.body?.evidence_sources?.length === 1 &&
      weekTwoLegalProviderExecutionChecklistSource?.id === 'week_two_legal_provider_execution_checklist',
    'Week 2 legal/provider execution checklist admin evidence export preview must return only the week_two_legal_provider_execution_checklist source'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoLegalProviderExecutionChecklist.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewWeekTwoLegalProviderExecutionChecklist.body.review_router.targets[0]?.source_id ===
        'week_two_legal_provider_execution_checklist' &&
      adminEvidenceExportPreviewWeekTwoLegalProviderExecutionChecklist.body.review_router.targets[0]?.ui_anchor ===
        'betaReadinessGrid',
    'Week 2 legal/provider execution checklist admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    weekTwoLegalProviderExecutionChecklistSource?.allowed_fields?.includes(
      'legal_provider_execution_checklist_count'
    ) &&
      weekTwoLegalProviderExecutionChecklistSource?.allowed_fields?.includes('execution_phase_counts') &&
      weekTwoLegalProviderExecutionChecklistSource?.allowed_fields?.includes('review_area_counts') &&
      weekTwoLegalProviderExecutionChecklistSource?.allowed_fields?.includes('founder_report_field_count') &&
      weekTwoLegalProviderExecutionChecklistSource?.allowed_fields?.includes('no_raw_reviewer_response_stored') &&
      weekTwoLegalProviderExecutionChecklistSource?.allowed_fields?.includes('no_attorney_advice_stored') &&
      weekTwoLegalProviderExecutionChecklistSource?.allowed_fields?.includes('no_legal_conclusion_recorded') &&
      weekTwoLegalProviderExecutionChecklistSource?.allowed_fields?.includes('no_smart_contract_deployment_attempted') &&
      weekTwoLegalProviderExecutionChecklistSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Week 2 legal/provider execution checklist admin evidence export preview must allow execution metadata and boundary fields only'
  );
  assert(
    weekTwoLegalProviderExecutionChecklistSource?.blocked_fields?.includes('raw_reviewer_response') &&
      weekTwoLegalProviderExecutionChecklistSource?.blocked_fields?.includes('raw_provider_response') &&
      weekTwoLegalProviderExecutionChecklistSource?.blocked_fields?.includes('attorney_advice') &&
      weekTwoLegalProviderExecutionChecklistSource?.blocked_fields?.includes('legal_conclusion') &&
      weekTwoLegalProviderExecutionChecklistSource?.blocked_fields?.includes('provider_commitment') &&
      weekTwoLegalProviderExecutionChecklistSource?.blocked_fields?.includes('provider_submission_approval') &&
      weekTwoLegalProviderExecutionChecklistSource?.blocked_fields?.includes('external_send_approval') &&
      weekTwoLegalProviderExecutionChecklistSource?.blocked_fields?.includes('provider_credentials') &&
      weekTwoLegalProviderExecutionChecklistSource?.blocked_fields?.includes('payment_data') &&
      weekTwoLegalProviderExecutionChecklistSource?.blocked_fields?.includes('wallet_data') &&
      weekTwoLegalProviderExecutionChecklistSource?.blocked_fields?.includes('loan_origination_approval') &&
      weekTwoLegalProviderExecutionChecklistSource?.blocked_fields?.includes('escrow_release_approval') &&
      weekTwoLegalProviderExecutionChecklistSource?.blocked_fields?.includes('repayment_routing_approval') &&
      weekTwoLegalProviderExecutionChecklistSource?.blocked_fields?.includes('stablecoin_settlement_approval') &&
      weekTwoLegalProviderExecutionChecklistSource?.blocked_fields?.includes('token_collateral_lock_approval') &&
      weekTwoLegalProviderExecutionChecklistSource?.blocked_fields?.includes('token_custody_approval') &&
      weekTwoLegalProviderExecutionChecklistSource?.blocked_fields?.includes('xpr_signature_approval') &&
      weekTwoLegalProviderExecutionChecklistSource?.blocked_fields?.includes('smart_contract_deployment_approval') &&
      weekTwoLegalProviderExecutionChecklistSource?.blocked_fields?.includes('public_claim_approval') &&
      weekTwoLegalProviderExecutionChecklistSource?.blocked_fields?.includes('publication_approval') &&
      weekTwoLegalProviderExecutionChecklistSource?.blocked_fields?.includes('live_action_approval'),
    'Week 2 legal/provider execution checklist admin evidence export preview must block reviewer/legal/provider/finance/collateral/XPR/publication/live fields'
  );
  assert(
    weekTwoLegalProviderExecutionChecklistSource?.raw_content_storage_boundary ===
      weekTwoLegalProviderExecutionChecklistExportBoundary,
    'Week 2 legal/provider execution checklist admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoLegalProviderExecutionChecklist.body?.export_gate?.external_send ===
      'blocked' &&
      adminEvidenceExportPreviewWeekTwoLegalProviderExecutionChecklist.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewWeekTwoLegalProviderExecutionChecklist.body?.no_live_action_attempted === true,
    'Week 2 legal/provider execution checklist admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewPublicBetaNextStepReadiness = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=public_beta_next_step_readiness',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-public-beta-next-step-readiness-smoke' },
    }
  );
  const publicBetaNextStepReadinessExportBoundary =
    'No real public URLs, private URLs, invite recipient details, tester private data, public URL share approvals, tester-invite approvals, external-send approvals, deploy/Supabase setting approvals, payment data, wallet data, loan/escrow/repayment approvals, legal/provider decisions, server storage, external sends, or live-action approvals are exported from this public beta next-step readiness preview.';
  const publicBetaNextStepReadinessSource =
    adminEvidenceExportPreviewPublicBetaNextStepReadiness.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewPublicBetaNextStepReadiness.status === 200,
    `Expected public beta next-step readiness admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewPublicBetaNextStepReadiness.status}`
  );
  assert(
    adminEvidenceExportPreviewPublicBetaNextStepReadiness.body?.selected_source_filter === 'public_beta_next_step_readiness' &&
      adminEvidenceExportPreviewPublicBetaNextStepReadiness.body?.valid_source_filters?.includes('public_beta_next_step_readiness'),
    'Public beta next-step readiness admin evidence export preview must accept the public_beta_next_step_readiness source filter'
  );
  assert(
    adminEvidenceExportPreviewPublicBetaNextStepReadiness.body?.evidence_sources?.length === 1 &&
      publicBetaNextStepReadinessSource?.id === 'public_beta_next_step_readiness',
    'Public beta next-step readiness admin evidence export preview must return only the public_beta_next_step_readiness source'
  );
  assert(
    adminEvidenceExportPreviewPublicBetaNextStepReadiness.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewPublicBetaNextStepReadiness.body.review_router.targets[0]?.source_id === 'public_beta_next_step_readiness' &&
      adminEvidenceExportPreviewPublicBetaNextStepReadiness.body.review_router.targets[0]?.ui_anchor === 'betaReadinessGrid',
    'Public beta next-step readiness admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    publicBetaNextStepReadinessSource?.allowed_fields?.includes('public_beta_item_count') &&
      publicBetaNextStepReadinessSource?.allowed_fields?.includes('readiness_state_counts') &&
      publicBetaNextStepReadinessSource?.allowed_fields?.includes('review_area_counts') &&
      publicBetaNextStepReadinessSource?.allowed_fields?.includes('required_phrase') &&
      publicBetaNextStepReadinessSource?.allowed_fields?.includes('no_public_url_share_attempted') &&
      publicBetaNextStepReadinessSource?.allowed_fields?.includes('no_tester_invite_attempted') &&
      publicBetaNextStepReadinessSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Public beta next-step readiness admin evidence export preview must allow beta metadata and boundary fields only'
  );
  assert(
    publicBetaNextStepReadinessSource?.blocked_fields?.includes('real_public_url') &&
      publicBetaNextStepReadinessSource?.blocked_fields?.includes('public_url') &&
      publicBetaNextStepReadinessSource?.blocked_fields?.includes('invite_recipient') &&
      publicBetaNextStepReadinessSource?.blocked_fields?.includes('tester_contact_details') &&
      publicBetaNextStepReadinessSource?.blocked_fields?.includes('public_url_share_approval') &&
      publicBetaNextStepReadinessSource?.blocked_fields?.includes('tester_invite_approval') &&
      publicBetaNextStepReadinessSource?.blocked_fields?.includes('external_send_approval') &&
      publicBetaNextStepReadinessSource?.blocked_fields?.includes('supabase_redirect_update_approval') &&
      publicBetaNextStepReadinessSource?.blocked_fields?.includes('payment_data') &&
      publicBetaNextStepReadinessSource?.blocked_fields?.includes('loan_approval') &&
      publicBetaNextStepReadinessSource?.blocked_fields?.includes('escrow_release_approval') &&
      publicBetaNextStepReadinessSource?.blocked_fields?.includes('legal_decision') &&
      publicBetaNextStepReadinessSource?.blocked_fields?.includes('public_beta_launch_approval') &&
      publicBetaNextStepReadinessSource?.blocked_fields?.includes('live_action_approval'),
    'Public beta next-step readiness admin evidence export preview must block URL/invite/external-send/finance/legal/live fields'
  );
  assert(
    publicBetaNextStepReadinessSource?.raw_content_storage_boundary === publicBetaNextStepReadinessExportBoundary,
    'Public beta next-step readiness admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewPublicBetaNextStepReadiness.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewPublicBetaNextStepReadiness.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewPublicBetaNextStepReadiness.body?.no_live_action_attempted === true,
    'Public beta next-step readiness admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewPublicBetaNextStepExecutionChecklist = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=public_beta_next_step_execution_checklist',
    {
      headers: {
        'X-Request-Id': 'gcsc-admin-evidence-export-preview-public-beta-next-step-execution-checklist-smoke',
      },
    }
  );
  const publicBetaNextStepExecutionChecklistExportBoundary =
    'No public beta launch approvals, real public URLs, public URL-share approvals, tester-invite approvals, invite-recipient data, external-send approvals, sensitive tester data, deploy setting approvals, Supabase redirect approvals, production env values, service-role keys, payment data, wallet data, loan approvals, escrow approvals, repayment routing approvals, stablecoin settlement approvals, token collateral approvals, XPR signatures, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this public beta next-step execution checklist preview.';
  const publicBetaNextStepExecutionChecklistSource =
    adminEvidenceExportPreviewPublicBetaNextStepExecutionChecklist.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewPublicBetaNextStepExecutionChecklist.status === 200,
    `Expected public beta next-step execution checklist admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewPublicBetaNextStepExecutionChecklist.status}`
  );
  assert(
    adminEvidenceExportPreviewPublicBetaNextStepExecutionChecklist.body?.selected_source_filter ===
      'public_beta_next_step_execution_checklist' &&
      adminEvidenceExportPreviewPublicBetaNextStepExecutionChecklist.body?.valid_source_filters?.includes(
        'public_beta_next_step_execution_checklist'
      ),
    'Public beta next-step execution checklist admin evidence export preview must accept the public_beta_next_step_execution_checklist source filter'
  );
  assert(
    adminEvidenceExportPreviewPublicBetaNextStepExecutionChecklist.body?.evidence_sources?.length === 1 &&
      publicBetaNextStepExecutionChecklistSource?.id === 'public_beta_next_step_execution_checklist',
    'Public beta next-step execution checklist admin evidence export preview must return only the public_beta_next_step_execution_checklist source'
  );
  assert(
    adminEvidenceExportPreviewPublicBetaNextStepExecutionChecklist.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewPublicBetaNextStepExecutionChecklist.body.review_router.targets[0]?.source_id ===
        'public_beta_next_step_execution_checklist' &&
      adminEvidenceExportPreviewPublicBetaNextStepExecutionChecklist.body.review_router.targets[0]?.ui_anchor ===
        'betaReadinessGrid',
    'Public beta next-step execution checklist admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    publicBetaNextStepExecutionChecklistSource?.allowed_fields?.includes('public_beta_execution_checklist_count') &&
      publicBetaNextStepExecutionChecklistSource?.allowed_fields?.includes('execution_checklist_count') &&
      publicBetaNextStepExecutionChecklistSource?.allowed_fields?.includes('readiness_state_counts') &&
      publicBetaNextStepExecutionChecklistSource?.allowed_fields?.includes('execution_phase_counts') &&
      publicBetaNextStepExecutionChecklistSource?.allowed_fields?.includes('review_area_counts') &&
      publicBetaNextStepExecutionChecklistSource?.allowed_fields?.includes('founder_report_field_count') &&
      publicBetaNextStepExecutionChecklistSource?.allowed_fields?.includes('founder_report_fields') &&
      publicBetaNextStepExecutionChecklistSource?.allowed_fields?.includes('required_phrase') &&
      publicBetaNextStepExecutionChecklistSource?.allowed_fields?.includes('no_sensitive_data_collection_attempted') &&
      publicBetaNextStepExecutionChecklistSource?.allowed_fields?.includes('no_live_supabase_write_attempted') &&
      publicBetaNextStepExecutionChecklistSource?.allowed_fields?.includes('no_xpr_signature_attempted') &&
      publicBetaNextStepExecutionChecklistSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Public beta next-step execution checklist admin evidence export preview must allow execution metadata and boundary fields only'
  );
  assert(
    publicBetaNextStepExecutionChecklistSource?.blocked_fields?.includes('public_beta_launch_approval') &&
      publicBetaNextStepExecutionChecklistSource?.blocked_fields?.includes('real_public_url') &&
      publicBetaNextStepExecutionChecklistSource?.blocked_fields?.includes('public_url_share_approval') &&
      publicBetaNextStepExecutionChecklistSource?.blocked_fields?.includes('tester_invite_approval') &&
      publicBetaNextStepExecutionChecklistSource?.blocked_fields?.includes('invite_recipient_data') &&
      publicBetaNextStepExecutionChecklistSource?.blocked_fields?.includes('external_send_approval') &&
      publicBetaNextStepExecutionChecklistSource?.blocked_fields?.includes('sensitive_tester_data') &&
      publicBetaNextStepExecutionChecklistSource?.blocked_fields?.includes('deploy_setting_change_approval') &&
      publicBetaNextStepExecutionChecklistSource?.blocked_fields?.includes('supabase_redirect_update_approval') &&
      publicBetaNextStepExecutionChecklistSource?.blocked_fields?.includes('production_env_value') &&
      publicBetaNextStepExecutionChecklistSource?.blocked_fields?.includes('service_role_key') &&
      publicBetaNextStepExecutionChecklistSource?.blocked_fields?.includes('payment_data') &&
      publicBetaNextStepExecutionChecklistSource?.blocked_fields?.includes('loan_approval') &&
      publicBetaNextStepExecutionChecklistSource?.blocked_fields?.includes('escrow_approval') &&
      publicBetaNextStepExecutionChecklistSource?.blocked_fields?.includes('repayment_routing_approval') &&
      publicBetaNextStepExecutionChecklistSource?.blocked_fields?.includes('stablecoin_settlement_approval') &&
      publicBetaNextStepExecutionChecklistSource?.blocked_fields?.includes('token_collateral_approval') &&
      publicBetaNextStepExecutionChecklistSource?.blocked_fields?.includes('xpr_signature') &&
      publicBetaNextStepExecutionChecklistSource?.blocked_fields?.includes('legal_or_provider_decision') &&
      publicBetaNextStepExecutionChecklistSource?.blocked_fields?.includes('live_action_approval'),
    'Public beta next-step execution checklist admin evidence export preview must block launch/URL/invite/secret/finance/XPR/legal/live fields'
  );
  assert(
    publicBetaNextStepExecutionChecklistSource?.raw_content_storage_boundary ===
      publicBetaNextStepExecutionChecklistExportBoundary,
    'Public beta next-step execution checklist admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewPublicBetaNextStepExecutionChecklist.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewPublicBetaNextStepExecutionChecklist.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewPublicBetaNextStepExecutionChecklist.body?.no_live_action_attempted === true,
    'Public beta next-step execution checklist admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewFounderHandoffToday = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=founder_handoff_today',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-founder-handoff-today-smoke' },
    }
  );
  const founderHandoffTodayExportBoundary =
    'No founder secrets, Magic Link URLs, Auth tokens, raw founder notes, live Supabase writes, admin membership approvals, deploy approvals, public URL-share approvals, tester-invite approvals, public file replacement approvals, legal/provider decisions, payment data, wallet data, server storage, external sends, or live-action approvals are exported from this founder handoff today preview.';
  const founderHandoffTodaySource = adminEvidenceExportPreviewFounderHandoffToday.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewFounderHandoffToday.status === 200,
    `Expected founder handoff today admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewFounderHandoffToday.status}`
  );
  assert(
    adminEvidenceExportPreviewFounderHandoffToday.body?.selected_source_filter === 'founder_handoff_today' &&
      adminEvidenceExportPreviewFounderHandoffToday.body?.valid_source_filters?.includes('founder_handoff_today'),
    'Founder handoff today admin evidence export preview must accept the founder_handoff_today source filter'
  );
  assert(
    adminEvidenceExportPreviewFounderHandoffToday.body?.evidence_sources?.length === 1 &&
      founderHandoffTodaySource?.id === 'founder_handoff_today',
    'Founder handoff today admin evidence export preview must return only the founder_handoff_today source'
  );
  assert(
    adminEvidenceExportPreviewFounderHandoffToday.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewFounderHandoffToday.body.review_router.targets[0]?.source_id === 'founder_handoff_today' &&
      adminEvidenceExportPreviewFounderHandoffToday.body.review_router.targets[0]?.ui_anchor === 'betaReadinessGrid',
    'Founder handoff today admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    founderHandoffTodaySource?.allowed_fields?.includes('handoff_item_count') &&
      founderHandoffTodaySource?.allowed_fields?.includes('handoff_state_counts') &&
      founderHandoffTodaySource?.allowed_fields?.includes('required_report_fields') &&
      founderHandoffTodaySource?.allowed_fields?.includes('blocked_live_actions') &&
      founderHandoffTodaySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Founder handoff today admin evidence export preview must allow handoff metadata and boundary fields only'
  );
  assert(
    founderHandoffTodaySource?.blocked_fields?.includes('magic_link_url') &&
      founderHandoffTodaySource?.blocked_fields?.includes('auth_user_id') &&
      founderHandoffTodaySource?.blocked_fields?.includes('admin_membership_approval') &&
      founderHandoffTodaySource?.blocked_fields?.includes('live_supabase_write_approval') &&
      founderHandoffTodaySource?.blocked_fields?.includes('deploy_approval') &&
      founderHandoffTodaySource?.blocked_fields?.includes('public_url_share_approval') &&
      founderHandoffTodaySource?.blocked_fields?.includes('tester_invite_approval') &&
      founderHandoffTodaySource?.blocked_fields?.includes('public_index_html_replacement_approval') &&
      founderHandoffTodaySource?.blocked_fields?.includes('legal_decision') &&
      founderHandoffTodaySource?.blocked_fields?.includes('payment_data') &&
      founderHandoffTodaySource?.blocked_fields?.includes('xpr_signature'),
    'Founder handoff today admin evidence export preview must block secret/Auth/admin/deploy/share/public-file/legal/payment/XPR/live fields'
  );
  assert(
    founderHandoffTodaySource?.raw_content_storage_boundary === founderHandoffTodayExportBoundary,
    'Founder handoff today admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewFounderHandoffToday.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewFounderHandoffToday.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewFounderHandoffToday.body?.no_live_action_attempted === true,
    'Founder handoff today admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewWeekOneCloseoutHandoff = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=week_one_closeout_handoff',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-week-one-closeout-handoff-smoke' },
    }
  );
  const weekOneCloseoutHandoffExportBoundary =
    'No founder secrets, Magic Link URLs, Auth tokens, raw founder notes, live Supabase writes, admin membership approvals, deploy approvals, public URL-share approvals, tester-invite approvals, public file replacement approvals, legal/provider decisions, payment data, wallet data, XPR signatures, server storage, external sends, or live-action approvals are exported from this Week 1 closeout handoff preview.';
  const weekOneCloseoutHandoffSource = adminEvidenceExportPreviewWeekOneCloseoutHandoff.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewWeekOneCloseoutHandoff.status === 200,
    `Expected Week 1 closeout handoff admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewWeekOneCloseoutHandoff.status}`
  );
  assert(
    adminEvidenceExportPreviewWeekOneCloseoutHandoff.body?.selected_source_filter === 'week_one_closeout_handoff' &&
      adminEvidenceExportPreviewWeekOneCloseoutHandoff.body?.valid_source_filters?.includes('week_one_closeout_handoff'),
    'Week 1 closeout handoff admin evidence export preview must accept the week_one_closeout_handoff source filter'
  );
  assert(
    adminEvidenceExportPreviewWeekOneCloseoutHandoff.body?.evidence_sources?.length === 1 &&
      weekOneCloseoutHandoffSource?.id === 'week_one_closeout_handoff',
    'Week 1 closeout handoff admin evidence export preview must return only the week_one_closeout_handoff source'
  );
  assert(
    adminEvidenceExportPreviewWeekOneCloseoutHandoff.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewWeekOneCloseoutHandoff.body.review_router.targets[0]?.source_id === 'week_one_closeout_handoff' &&
      adminEvidenceExportPreviewWeekOneCloseoutHandoff.body.review_router.targets[0]?.ui_anchor === 'betaReadinessGrid',
    'Week 1 closeout handoff admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    weekOneCloseoutHandoffSource?.allowed_fields?.includes('closeout_item_count') &&
      weekOneCloseoutHandoffSource?.allowed_fields?.includes('closeout_state_counts') &&
      weekOneCloseoutHandoffSource?.allowed_fields?.includes('completed_evidence') &&
      weekOneCloseoutHandoffSource?.allowed_fields?.includes('required_report_fields') &&
      weekOneCloseoutHandoffSource?.allowed_fields?.includes('blocked_live_actions') &&
      weekOneCloseoutHandoffSource?.allowed_fields?.includes('no_live_action_attempted') &&
      weekOneCloseoutHandoffSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Week 1 closeout handoff admin evidence export preview must allow closeout metadata and boundary fields only'
  );
  assert(
    weekOneCloseoutHandoffSource?.blocked_fields?.includes('magic_link_url') &&
      weekOneCloseoutHandoffSource?.blocked_fields?.includes('auth_user_id') &&
      weekOneCloseoutHandoffSource?.blocked_fields?.includes('admin_memberships_insert_approval') &&
      weekOneCloseoutHandoffSource?.blocked_fields?.includes('live_supabase_write_approval') &&
      weekOneCloseoutHandoffSource?.blocked_fields?.includes('deploy_setting_change_approval') &&
      weekOneCloseoutHandoffSource?.blocked_fields?.includes('supabase_redirect_update_approval') &&
      weekOneCloseoutHandoffSource?.blocked_fields?.includes('public_url_share_approval') &&
      weekOneCloseoutHandoffSource?.blocked_fields?.includes('tester_invite_approval') &&
      weekOneCloseoutHandoffSource?.blocked_fields?.includes('public_index_html_replacement_approval') &&
      weekOneCloseoutHandoffSource?.blocked_fields?.includes('legal_decision') &&
      weekOneCloseoutHandoffSource?.blocked_fields?.includes('payment_data') &&
      weekOneCloseoutHandoffSource?.blocked_fields?.includes('stablecoin_settlement_approval') &&
      weekOneCloseoutHandoffSource?.blocked_fields?.includes('token_collateral_lock_approval') &&
      weekOneCloseoutHandoffSource?.blocked_fields?.includes('xpr_signature'),
    'Week 1 closeout handoff admin evidence export preview must block secret/Auth/admin/deploy/share/invite/legal/payment/stablecoin/token/XPR/live fields'
  );
  assert(
    weekOneCloseoutHandoffSource?.raw_content_storage_boundary === weekOneCloseoutHandoffExportBoundary,
    'Week 1 closeout handoff admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewWeekOneCloseoutHandoff.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewWeekOneCloseoutHandoff.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewWeekOneCloseoutHandoff.body?.no_live_action_attempted === true,
    'Week 1 closeout handoff admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewInvestorFounderPackageReadiness = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=investor_founder_package_readiness',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-investor-founder-package-readiness-smoke' },
    }
  );
  const investorFounderPackageReadinessExportBoundary =
    'No founder secrets, recipient names, private recipient contact data, investor notes, Magic Link URLs, Auth tokens, raw founder notes, live Supabase writes, external sends, deck/PDF/email/social publication approvals, public URL-share approvals, provider commitments, legal/provider decisions, payment data, wallet data, XPR signatures, server storage, or live-action approvals are exported from this investor/founder package readiness preview.';
  const investorFounderPackageReadinessSource =
    adminEvidenceExportPreviewInvestorFounderPackageReadiness.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewInvestorFounderPackageReadiness.status === 200,
    `Expected investor/founder package readiness admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewInvestorFounderPackageReadiness.status}`
  );
  assert(
    adminEvidenceExportPreviewInvestorFounderPackageReadiness.body?.selected_source_filter === 'investor_founder_package_readiness' &&
      adminEvidenceExportPreviewInvestorFounderPackageReadiness.body?.valid_source_filters?.includes('investor_founder_package_readiness'),
    'Investor/founder package readiness admin evidence export preview must accept the investor_founder_package_readiness source filter'
  );
  assert(
    adminEvidenceExportPreviewInvestorFounderPackageReadiness.body?.evidence_sources?.length === 1 &&
      investorFounderPackageReadinessSource?.id === 'investor_founder_package_readiness',
    'Investor/founder package readiness admin evidence export preview must return only the investor_founder_package_readiness source'
  );
  assert(
    adminEvidenceExportPreviewInvestorFounderPackageReadiness.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewInvestorFounderPackageReadiness.body.review_router.targets[0]?.source_id === 'investor_founder_package_readiness' &&
      adminEvidenceExportPreviewInvestorFounderPackageReadiness.body.review_router.targets[0]?.ui_anchor === 'betaReadinessGrid',
    'Investor/founder package readiness admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    investorFounderPackageReadinessSource?.allowed_fields?.includes('readiness_item_count') &&
      investorFounderPackageReadinessSource?.allowed_fields?.includes('readiness_state_counts') &&
      investorFounderPackageReadinessSource?.allowed_fields?.includes('required_artifacts') &&
      investorFounderPackageReadinessSource?.allowed_fields?.includes('required_report_fields') &&
      investorFounderPackageReadinessSource?.allowed_fields?.includes('blocked_claims') &&
      investorFounderPackageReadinessSource?.allowed_fields?.includes('required_phrase') &&
      investorFounderPackageReadinessSource?.allowed_fields?.includes('blocked_live_actions') &&
      investorFounderPackageReadinessSource?.allowed_fields?.includes('no_external_send_attempted') &&
      investorFounderPackageReadinessSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Investor/founder package readiness admin evidence export preview must allow package metadata and boundary fields only'
  );
  assert(
    investorFounderPackageReadinessSource?.blocked_fields?.includes('recipient_email') &&
      investorFounderPackageReadinessSource?.blocked_fields?.includes('private_investor_notes') &&
      investorFounderPackageReadinessSource?.blocked_fields?.includes('external_send_approval') &&
      investorFounderPackageReadinessSource?.blocked_fields?.includes('investor_outreach_approval') &&
      investorFounderPackageReadinessSource?.blocked_fields?.includes('grant_submission_approval') &&
      investorFounderPackageReadinessSource?.blocked_fields?.includes('provider_commitment') &&
      investorFounderPackageReadinessSource?.blocked_fields?.includes('legal_decision') &&
      investorFounderPackageReadinessSource?.blocked_fields?.includes('deck_publication_approval') &&
      investorFounderPackageReadinessSource?.blocked_fields?.includes('public_claim_approval') &&
      investorFounderPackageReadinessSource?.blocked_fields?.includes('payment_data') &&
      investorFounderPackageReadinessSource?.blocked_fields?.includes('xpr_signature') &&
      investorFounderPackageReadinessSource?.blocked_fields?.includes('live_action_approval'),
    'Investor/founder package readiness admin evidence export preview must block recipient/send/publication/legal/payment/XPR/live fields'
  );
  assert(
    investorFounderPackageReadinessSource?.raw_content_storage_boundary === investorFounderPackageReadinessExportBoundary,
    'Investor/founder package readiness admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewInvestorFounderPackageReadiness.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewInvestorFounderPackageReadiness.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewInvestorFounderPackageReadiness.body?.no_live_action_attempted === true,
    'Investor/founder package readiness admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewWeekTwoInvestorFounderPackageAlignment = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=week_two_investor_founder_package_alignment',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-week-two-investor-founder-package-alignment-smoke' },
    }
  );
  const weekTwoInvestorFounderPackageAlignmentExportBoundary =
    'No recipient names, recipient contact details, private investor notes, raw deck copy, raw PDF copy, raw email copy, raw social copy, external-send approvals, investor outreach approvals, grant submission approvals, provider outreach approvals, attorney outreach approvals, public URL-share approvals, public claim approvals, live finance claims, real payment approvals, loan approvals, escrow approvals, repayment routing approvals, stablecoin settlement approvals, token collateral approvals, token custody approvals, XPR signatures, FIO registrations, Metallicus partnership approvals, approved provider claims, AI credit approval claims, AI legal decision claims, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this Week 2 investor/founder package alignment preview.';
  const weekTwoInvestorFounderPackageAlignmentSource =
    adminEvidenceExportPreviewWeekTwoInvestorFounderPackageAlignment.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewWeekTwoInvestorFounderPackageAlignment.status === 200,
    `Expected Week 2 investor/founder package alignment admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewWeekTwoInvestorFounderPackageAlignment.status}`
  );
  assert(
    adminEvidenceExportPreviewWeekTwoInvestorFounderPackageAlignment.body?.selected_source_filter === 'week_two_investor_founder_package_alignment' &&
      adminEvidenceExportPreviewWeekTwoInvestorFounderPackageAlignment.body?.valid_source_filters?.includes('week_two_investor_founder_package_alignment'),
    'Week 2 investor/founder package alignment admin evidence export preview must accept the week_two_investor_founder_package_alignment source filter'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoInvestorFounderPackageAlignment.body?.evidence_sources?.length === 1 &&
      weekTwoInvestorFounderPackageAlignmentSource?.id === 'week_two_investor_founder_package_alignment',
    'Week 2 investor/founder package alignment admin evidence export preview must return only the week_two_investor_founder_package_alignment source'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoInvestorFounderPackageAlignment.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewWeekTwoInvestorFounderPackageAlignment.body.review_router.targets[0]?.source_id === 'week_two_investor_founder_package_alignment' &&
      adminEvidenceExportPreviewWeekTwoInvestorFounderPackageAlignment.body.review_router.targets[0]?.ui_anchor === 'betaReadinessGrid',
    'Week 2 investor/founder package alignment admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    weekTwoInvestorFounderPackageAlignmentSource?.allowed_fields?.includes('investor_founder_alignment_count') &&
      weekTwoInvestorFounderPackageAlignmentSource?.allowed_fields?.includes('alignment_state_counts') &&
      weekTwoInvestorFounderPackageAlignmentSource?.allowed_fields?.includes('alignment_area_counts') &&
      weekTwoInvestorFounderPackageAlignmentSource?.allowed_fields?.includes('required_evidence_count') &&
      weekTwoInvestorFounderPackageAlignmentSource?.allowed_fields?.includes('founder_report_field_count') &&
      weekTwoInvestorFounderPackageAlignmentSource?.allowed_fields?.includes('linked_surfaces') &&
      weekTwoInvestorFounderPackageAlignmentSource?.allowed_fields?.includes('blocked_claims') &&
      weekTwoInvestorFounderPackageAlignmentSource?.allowed_fields?.includes('blocked_live_actions') &&
      weekTwoInvestorFounderPackageAlignmentSource?.allowed_fields?.includes('no_investor_outreach_attempted') &&
      weekTwoInvestorFounderPackageAlignmentSource?.allowed_fields?.includes('no_fio_registration_attempted') &&
      weekTwoInvestorFounderPackageAlignmentSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Week 2 investor/founder package alignment admin evidence export preview must allow alignment metadata and boundary fields only'
  );
  assert(
    weekTwoInvestorFounderPackageAlignmentSource?.blocked_fields?.includes('recipient_contact_details') &&
      weekTwoInvestorFounderPackageAlignmentSource?.blocked_fields?.includes('raw_deck_copy') &&
      weekTwoInvestorFounderPackageAlignmentSource?.blocked_fields?.includes('external_send_approval') &&
      weekTwoInvestorFounderPackageAlignmentSource?.blocked_fields?.includes('investor_outreach_approval') &&
      weekTwoInvestorFounderPackageAlignmentSource?.blocked_fields?.includes('grant_submission_approval') &&
      weekTwoInvestorFounderPackageAlignmentSource?.blocked_fields?.includes('attorney_outreach_approval') &&
      weekTwoInvestorFounderPackageAlignmentSource?.blocked_fields?.includes('public_claim_approval') &&
      weekTwoInvestorFounderPackageAlignmentSource?.blocked_fields?.includes('live_finance_claim') &&
      weekTwoInvestorFounderPackageAlignmentSource?.blocked_fields?.includes('stablecoin_settlement_approval') &&
      weekTwoInvestorFounderPackageAlignmentSource?.blocked_fields?.includes('token_custody_approval') &&
      weekTwoInvestorFounderPackageAlignmentSource?.blocked_fields?.includes('xpr_signature') &&
      weekTwoInvestorFounderPackageAlignmentSource?.blocked_fields?.includes('fio_registration_approval') &&
      weekTwoInvestorFounderPackageAlignmentSource?.blocked_fields?.includes('metallicus_partnership_approval') &&
      weekTwoInvestorFounderPackageAlignmentSource?.blocked_fields?.includes('ai_credit_approval_claim') &&
      weekTwoInvestorFounderPackageAlignmentSource?.blocked_fields?.includes('ai_legal_decision_claim') &&
      weekTwoInvestorFounderPackageAlignmentSource?.blocked_fields?.includes('live_action_approval'),
    'Week 2 investor/founder package alignment admin evidence export preview must block recipient/send/publication/live-finance/token/AI/legal/provider/live fields'
  );
  assert(
    weekTwoInvestorFounderPackageAlignmentSource?.raw_content_storage_boundary === weekTwoInvestorFounderPackageAlignmentExportBoundary,
    'Week 2 investor/founder package alignment admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoInvestorFounderPackageAlignment.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewWeekTwoInvestorFounderPackageAlignment.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewWeekTwoInvestorFounderPackageAlignment.body?.no_live_action_attempted === true,
    'Week 2 investor/founder package alignment admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewWeekTwoInvestorFounderPackageExecutionChecklist = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=week_two_investor_founder_package_execution_checklist',
    {
      headers: {
        'X-Request-Id': 'gcsc-admin-evidence-export-preview-week-two-investor-founder-package-execution-checklist-smoke',
      },
    }
  );
  const weekTwoInvestorFounderPackageExecutionChecklistExportBoundary =
    'No recipient contact data, investor outreach approvals, grant submission approvals, provider outreach approvals, attorney outreach approvals, external-send approvals, deck publication approvals, PDF publication approvals, email/social publication approvals, public URL-share approvals, public claim approvals, raw founder notes, raw reviewer responses, provider commitments, payment data, wallet data, real finance approvals, loan approvals, escrow approvals, repayment routing approvals, stablecoin settlement approvals, token collateral approvals, token custody approvals, XPR signatures, FIO registrations, Metallicus/provider approval claims, AI authority claims, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this Week 2 investor/founder package execution checklist preview.';
  const weekTwoInvestorFounderPackageExecutionChecklistSource =
    adminEvidenceExportPreviewWeekTwoInvestorFounderPackageExecutionChecklist.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewWeekTwoInvestorFounderPackageExecutionChecklist.status === 200,
    `Expected Week 2 investor/founder package execution checklist admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewWeekTwoInvestorFounderPackageExecutionChecklist.status}`
  );
  assert(
    adminEvidenceExportPreviewWeekTwoInvestorFounderPackageExecutionChecklist.body?.selected_source_filter ===
      'week_two_investor_founder_package_execution_checklist' &&
      adminEvidenceExportPreviewWeekTwoInvestorFounderPackageExecutionChecklist.body?.valid_source_filters?.includes(
        'week_two_investor_founder_package_execution_checklist'
      ),
    'Week 2 investor/founder package execution checklist admin evidence export preview must accept the week_two_investor_founder_package_execution_checklist source filter'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoInvestorFounderPackageExecutionChecklist.body?.evidence_sources?.length === 1 &&
      weekTwoInvestorFounderPackageExecutionChecklistSource?.id ===
        'week_two_investor_founder_package_execution_checklist',
    'Week 2 investor/founder package execution checklist admin evidence export preview must return only the week_two_investor_founder_package_execution_checklist source'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoInvestorFounderPackageExecutionChecklist.body?.review_router?.targets?.length ===
      1 &&
      adminEvidenceExportPreviewWeekTwoInvestorFounderPackageExecutionChecklist.body.review_router.targets[0]
        ?.source_id === 'week_two_investor_founder_package_execution_checklist' &&
      adminEvidenceExportPreviewWeekTwoInvestorFounderPackageExecutionChecklist.body.review_router.targets[0]
        ?.ui_anchor === 'betaReadinessGrid',
    'Week 2 investor/founder package execution checklist admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    weekTwoInvestorFounderPackageExecutionChecklistSource?.allowed_fields?.includes(
      'investor_founder_package_execution_checklist_count'
    ) &&
      weekTwoInvestorFounderPackageExecutionChecklistSource?.allowed_fields?.includes('execution_checklist_count') &&
      weekTwoInvestorFounderPackageExecutionChecklistSource?.allowed_fields?.includes('readiness_state_counts') &&
      weekTwoInvestorFounderPackageExecutionChecklistSource?.allowed_fields?.includes('execution_phase_counts') &&
      weekTwoInvestorFounderPackageExecutionChecklistSource?.allowed_fields?.includes('review_area_counts') &&
      weekTwoInvestorFounderPackageExecutionChecklistSource?.allowed_fields?.includes('required_evidence_count') &&
      weekTwoInvestorFounderPackageExecutionChecklistSource?.allowed_fields?.includes('founder_report_field_count') &&
      weekTwoInvestorFounderPackageExecutionChecklistSource?.allowed_fields?.includes('safe_report_fields') &&
      weekTwoInvestorFounderPackageExecutionChecklistSource?.allowed_fields?.includes(
        'no_recipient_contact_data_requested'
      ) &&
      weekTwoInvestorFounderPackageExecutionChecklistSource?.allowed_fields?.includes(
        'raw_content_storage_boundary'
      ),
    'Week 2 investor/founder package execution checklist admin evidence export preview must allow execution metadata and boundary fields only'
  );
  assert(
    weekTwoInvestorFounderPackageExecutionChecklistSource?.blocked_fields?.includes('recipient_contact_data') &&
      weekTwoInvestorFounderPackageExecutionChecklistSource?.blocked_fields?.includes('external_send_approval') &&
      weekTwoInvestorFounderPackageExecutionChecklistSource?.blocked_fields?.includes('investor_outreach_approval') &&
      weekTwoInvestorFounderPackageExecutionChecklistSource?.blocked_fields?.includes('grant_submission_approval') &&
      weekTwoInvestorFounderPackageExecutionChecklistSource?.blocked_fields?.includes('attorney_outreach_approval') &&
      weekTwoInvestorFounderPackageExecutionChecklistSource?.blocked_fields?.includes('public_claim_approval') &&
      weekTwoInvestorFounderPackageExecutionChecklistSource?.blocked_fields?.includes('real_finance_approval') &&
      weekTwoInvestorFounderPackageExecutionChecklistSource?.blocked_fields?.includes('stablecoin_settlement_approval') &&
      weekTwoInvestorFounderPackageExecutionChecklistSource?.blocked_fields?.includes('token_custody_approval') &&
      weekTwoInvestorFounderPackageExecutionChecklistSource?.blocked_fields?.includes('xpr_signature') &&
      weekTwoInvestorFounderPackageExecutionChecklistSource?.blocked_fields?.includes('fio_registration_approval') &&
      weekTwoInvestorFounderPackageExecutionChecklistSource?.blocked_fields?.includes(
        'metallicus_provider_approval_claim'
      ) &&
      weekTwoInvestorFounderPackageExecutionChecklistSource?.blocked_fields?.includes(
        'ai_authority_claim_approval'
      ) &&
      weekTwoInvestorFounderPackageExecutionChecklistSource?.blocked_fields?.includes('live_action_approval'),
    'Week 2 investor/founder package execution checklist admin evidence export preview must block recipient/send/publication/finance/token/AI/legal/provider/live fields'
  );
  assert(
    weekTwoInvestorFounderPackageExecutionChecklistSource?.raw_content_storage_boundary ===
      weekTwoInvestorFounderPackageExecutionChecklistExportBoundary,
    'Week 2 investor/founder package execution checklist admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoInvestorFounderPackageExecutionChecklist.body?.export_gate?.external_send ===
      'blocked' &&
      adminEvidenceExportPreviewWeekTwoInvestorFounderPackageExecutionChecklist.body?.no_server_storage_attempted ===
        true &&
      adminEvidenceExportPreviewWeekTwoInvestorFounderPackageExecutionChecklist.body?.no_live_action_attempted === true,
    'Week 2 investor/founder package execution checklist admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewPaymentIntentOwnershipReadiness = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=payment_intent_ownership_readiness',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-payment-intent-ownership-readiness-smoke' },
    }
  );
  const paymentIntentOwnershipReadinessExportBoundary =
    'No payment-intent row data, SQL apply approvals, service-role keys, provider credentials, card/ACH/XPR/stablecoin approvals, wallet data, loan approvals, escrow approvals, repayment routing approvals, token collateral approvals, strict RLS apply approvals, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this payment intent ownership readiness preview.';
  const paymentIntentOwnershipReadinessSource =
    adminEvidenceExportPreviewPaymentIntentOwnershipReadiness.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewPaymentIntentOwnershipReadiness.status === 200,
    `Expected payment intent ownership readiness admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewPaymentIntentOwnershipReadiness.status}`
  );
  assert(
    adminEvidenceExportPreviewPaymentIntentOwnershipReadiness.body?.selected_source_filter ===
      'payment_intent_ownership_readiness' &&
      adminEvidenceExportPreviewPaymentIntentOwnershipReadiness.body?.valid_source_filters?.includes(
        'payment_intent_ownership_readiness'
      ),
    'Payment intent ownership readiness admin evidence export preview must accept the payment_intent_ownership_readiness source filter'
  );
  assert(
    adminEvidenceExportPreviewPaymentIntentOwnershipReadiness.body?.evidence_sources?.length === 1 &&
      paymentIntentOwnershipReadinessSource?.id === 'payment_intent_ownership_readiness',
    'Payment intent ownership readiness admin evidence export preview must return only the payment_intent_ownership_readiness source'
  );
  assert(
    adminEvidenceExportPreviewPaymentIntentOwnershipReadiness.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewPaymentIntentOwnershipReadiness.body.review_router.targets[0]?.source_id ===
        'payment_intent_ownership_readiness' &&
      adminEvidenceExportPreviewPaymentIntentOwnershipReadiness.body.review_router.targets[0]?.ui_anchor ===
        'betaReadinessGrid',
    'Payment intent ownership readiness admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    paymentIntentOwnershipReadinessSource?.allowed_fields?.includes('payment_ownership_readiness_count') &&
      paymentIntentOwnershipReadinessSource?.allowed_fields?.includes('readiness_state_counts') &&
      paymentIntentOwnershipReadinessSource?.allowed_fields?.includes('readiness_phase_counts') &&
      paymentIntentOwnershipReadinessSource?.allowed_fields?.includes('review_area_counts') &&
      paymentIntentOwnershipReadinessSource?.allowed_fields?.includes('typed_ownership_column_count') &&
      paymentIntentOwnershipReadinessSource?.allowed_fields?.includes('typed_ownership_columns') &&
      paymentIntentOwnershipReadinessSource?.allowed_fields?.includes('required_evidence_count') &&
      paymentIntentOwnershipReadinessSource?.allowed_fields?.includes('blocked_live_actions') &&
      paymentIntentOwnershipReadinessSource?.allowed_fields?.includes('no_payment_sql_apply_attempted') &&
      paymentIntentOwnershipReadinessSource?.allowed_fields?.includes('no_payment_provider_activation_attempted') &&
      paymentIntentOwnershipReadinessSource?.allowed_fields?.includes('no_real_payment_attempted') &&
      paymentIntentOwnershipReadinessSource?.allowed_fields?.includes('no_live_action_attempted') &&
      paymentIntentOwnershipReadinessSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Payment intent ownership readiness admin evidence export preview must allow payment ownership metadata and boundary fields only'
  );
  assert(
    paymentIntentOwnershipReadinessSource?.blocked_fields?.includes('payment_intent_row') &&
      paymentIntentOwnershipReadinessSource?.blocked_fields?.includes('payment_data') &&
      paymentIntentOwnershipReadinessSource?.blocked_fields?.includes('wallet_data') &&
      paymentIntentOwnershipReadinessSource?.blocked_fields?.includes('card_charge_approval') &&
      paymentIntentOwnershipReadinessSource?.blocked_fields?.includes('ach_movement_approval') &&
      paymentIntentOwnershipReadinessSource?.blocked_fields?.includes('xpr_transfer_approval') &&
      paymentIntentOwnershipReadinessSource?.blocked_fields?.includes('stablecoin_settlement_approval') &&
      paymentIntentOwnershipReadinessSource?.blocked_fields?.includes('loan_approval') &&
      paymentIntentOwnershipReadinessSource?.blocked_fields?.includes('escrow_release_approval') &&
      paymentIntentOwnershipReadinessSource?.blocked_fields?.includes('repayment_routing_approval') &&
      paymentIntentOwnershipReadinessSource?.blocked_fields?.includes('token_collateral_lock_approval') &&
      paymentIntentOwnershipReadinessSource?.blocked_fields?.includes('payment_intents_sql_apply_approval') &&
      paymentIntentOwnershipReadinessSource?.blocked_fields?.includes('strict_rls_apply_approval') &&
      paymentIntentOwnershipReadinessSource?.blocked_fields?.includes('provider_api_key') &&
      paymentIntentOwnershipReadinessSource?.blocked_fields?.includes('live_action_approval'),
    'Payment intent ownership readiness admin evidence export preview must block payment/SQL/provider/token/legal/live fields'
  );
  assert(
    paymentIntentOwnershipReadinessSource?.raw_content_storage_boundary ===
      paymentIntentOwnershipReadinessExportBoundary,
    'Payment intent ownership readiness admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewPaymentIntentOwnershipReadiness.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewPaymentIntentOwnershipReadiness.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewPaymentIntentOwnershipReadiness.body?.no_live_action_attempted === true,
    'Payment intent ownership readiness admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewWeekTwoLocalValidationPassReadiness = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=week_two_local_validation_pass_readiness',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-week-two-local-validation-pass-readiness-smoke' },
    }
  );
  const weekTwoLocalValidationPassReadinessExportBoundary =
    'No secrets, raw terminal logs, raw failure excerpts, raw public copy, publication approvals, public file replacement approvals, deploy approvals, public URL-share approvals, tester-invite approvals, live Supabase approvals, strict RLS apply approvals, external account approvals, payment data, wallet data, real finance approvals, loan approvals, escrow approvals, repayment routing approvals, stablecoin settlement approvals, token collateral approvals, XPR signatures, FIO registrations, legal/provider decisions, destructive git approvals, production approvals, server storage, external sends, or live-action approvals are exported from this Week 2 local validation pass readiness preview.';
  const weekTwoLocalValidationPassReadinessSource =
    adminEvidenceExportPreviewWeekTwoLocalValidationPassReadiness.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewWeekTwoLocalValidationPassReadiness.status === 200,
    `Expected Week 2 local validation pass readiness admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewWeekTwoLocalValidationPassReadiness.status}`
  );
  assert(
    adminEvidenceExportPreviewWeekTwoLocalValidationPassReadiness.body?.selected_source_filter ===
      'week_two_local_validation_pass_readiness' &&
      adminEvidenceExportPreviewWeekTwoLocalValidationPassReadiness.body?.valid_source_filters?.includes(
        'week_two_local_validation_pass_readiness'
      ),
    'Week 2 local validation pass readiness admin evidence export preview must accept the week_two_local_validation_pass_readiness source filter'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoLocalValidationPassReadiness.body?.evidence_sources?.length === 1 &&
      weekTwoLocalValidationPassReadinessSource?.id === 'week_two_local_validation_pass_readiness',
    'Week 2 local validation pass readiness admin evidence export preview must return only the week_two_local_validation_pass_readiness source'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoLocalValidationPassReadiness.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewWeekTwoLocalValidationPassReadiness.body.review_router.targets[0]?.source_id ===
        'week_two_local_validation_pass_readiness' &&
      adminEvidenceExportPreviewWeekTwoLocalValidationPassReadiness.body.review_router.targets[0]?.ui_anchor ===
        'betaReadinessGrid',
    'Week 2 local validation pass readiness admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    weekTwoLocalValidationPassReadinessSource?.allowed_fields?.includes('validation_readiness_count') &&
      weekTwoLocalValidationPassReadinessSource?.allowed_fields?.includes('readiness_state_counts') &&
      weekTwoLocalValidationPassReadinessSource?.allowed_fields?.includes('validation_phase_counts') &&
      weekTwoLocalValidationPassReadinessSource?.allowed_fields?.includes('required_command_count') &&
      weekTwoLocalValidationPassReadinessSource?.allowed_fields?.includes('required_commands') &&
      weekTwoLocalValidationPassReadinessSource?.allowed_fields?.includes('founder_report_field_count') &&
      weekTwoLocalValidationPassReadinessSource?.allowed_fields?.includes('no_strict_rls_apply_attempted') &&
      weekTwoLocalValidationPassReadinessSource?.allowed_fields?.includes('no_destructive_git_action_attempted') &&
      weekTwoLocalValidationPassReadinessSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Week 2 local validation pass readiness admin evidence export preview must allow validation metadata and boundary fields only'
  );
  assert(
    weekTwoLocalValidationPassReadinessSource?.blocked_fields?.includes('raw_terminal_log') &&
      weekTwoLocalValidationPassReadinessSource?.blocked_fields?.includes('raw_failure_excerpt') &&
      weekTwoLocalValidationPassReadinessSource?.blocked_fields?.includes('public_file_replacement_approval') &&
      weekTwoLocalValidationPassReadinessSource?.blocked_fields?.includes(
        'public_whitepaper_html_replacement_approval'
      ) &&
      weekTwoLocalValidationPassReadinessSource?.blocked_fields?.includes('deploy_setting_change_approval') &&
      weekTwoLocalValidationPassReadinessSource?.blocked_fields?.includes('live_supabase_write_approval') &&
      weekTwoLocalValidationPassReadinessSource?.blocked_fields?.includes('strict_rls_apply_approval') &&
      weekTwoLocalValidationPassReadinessSource?.blocked_fields?.includes('external_account_approval') &&
      weekTwoLocalValidationPassReadinessSource?.blocked_fields?.includes('real_finance_approval') &&
      weekTwoLocalValidationPassReadinessSource?.blocked_fields?.includes('stablecoin_settlement_approval') &&
      weekTwoLocalValidationPassReadinessSource?.blocked_fields?.includes('token_collateral_approval') &&
      weekTwoLocalValidationPassReadinessSource?.blocked_fields?.includes('xpr_signature') &&
      weekTwoLocalValidationPassReadinessSource?.blocked_fields?.includes('fio_registration_approval') &&
      weekTwoLocalValidationPassReadinessSource?.blocked_fields?.includes('destructive_git_approval') &&
      weekTwoLocalValidationPassReadinessSource?.blocked_fields?.includes('live_action_approval'),
    'Week 2 local validation pass readiness admin evidence export preview must block raw/log/public/live/destructive fields'
  );
  assert(
    weekTwoLocalValidationPassReadinessSource?.raw_content_storage_boundary ===
      weekTwoLocalValidationPassReadinessExportBoundary,
    'Week 2 local validation pass readiness admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoLocalValidationPassReadiness.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewWeekTwoLocalValidationPassReadiness.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewWeekTwoLocalValidationPassReadiness.body?.no_live_action_attempted === true,
    'Week 2 local validation pass readiness admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewWeekTwoLocalValidationPassExecutionChecklist = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=week_two_local_validation_pass_execution_checklist',
    {
      headers: {
        'X-Request-Id': 'gcsc-admin-evidence-export-preview-week-two-local-validation-pass-execution-checklist-smoke',
      },
    }
  );
  const weekTwoLocalValidationPassExecutionChecklistExportBoundary =
    'No secrets, raw terminal logs, raw failure excerpts, raw public copy, validation bypass approvals, publication approvals, public file replacement approvals, deploy approvals, public URL-share approvals, tester-invite approvals, live Supabase approvals, strict RLS apply approvals, external account approvals, payment data, wallet data, real finance approvals, loan approvals, escrow approvals, repayment routing approvals, stablecoin settlement approvals, token collateral approvals, XPR signatures, FIO registrations, legal/provider decisions, destructive git approvals, production approvals, server storage, external sends, or live-action approvals are exported from this Week 2 local validation pass execution checklist preview.';
  const weekTwoLocalValidationPassExecutionChecklistSource =
    adminEvidenceExportPreviewWeekTwoLocalValidationPassExecutionChecklist.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewWeekTwoLocalValidationPassExecutionChecklist.status === 200,
    `Expected Week 2 local validation pass execution checklist admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewWeekTwoLocalValidationPassExecutionChecklist.status}`
  );
  assert(
    adminEvidenceExportPreviewWeekTwoLocalValidationPassExecutionChecklist.body?.selected_source_filter ===
      'week_two_local_validation_pass_execution_checklist' &&
      adminEvidenceExportPreviewWeekTwoLocalValidationPassExecutionChecklist.body?.valid_source_filters?.includes(
        'week_two_local_validation_pass_execution_checklist'
      ),
    'Week 2 local validation pass execution checklist admin evidence export preview must accept the week_two_local_validation_pass_execution_checklist source filter'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoLocalValidationPassExecutionChecklist.body?.evidence_sources?.length === 1 &&
      weekTwoLocalValidationPassExecutionChecklistSource?.id ===
        'week_two_local_validation_pass_execution_checklist',
    'Week 2 local validation pass execution checklist admin evidence export preview must return only the week_two_local_validation_pass_execution_checklist source'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoLocalValidationPassExecutionChecklist.body?.review_router?.targets?.length ===
      1 &&
      adminEvidenceExportPreviewWeekTwoLocalValidationPassExecutionChecklist.body.review_router.targets[0]
        ?.source_id === 'week_two_local_validation_pass_execution_checklist' &&
      adminEvidenceExportPreviewWeekTwoLocalValidationPassExecutionChecklist.body.review_router.targets[0]
        ?.ui_anchor === 'betaReadinessGrid',
    'Week 2 local validation pass execution checklist admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    weekTwoLocalValidationPassExecutionChecklistSource?.allowed_fields?.includes(
      'validation_execution_checklist_count'
    ) &&
      weekTwoLocalValidationPassExecutionChecklistSource?.allowed_fields?.includes('execution_checklist_count') &&
      weekTwoLocalValidationPassExecutionChecklistSource?.allowed_fields?.includes('readiness_state_counts') &&
      weekTwoLocalValidationPassExecutionChecklistSource?.allowed_fields?.includes('execution_phase_counts') &&
      weekTwoLocalValidationPassExecutionChecklistSource?.allowed_fields?.includes('review_area_counts') &&
      weekTwoLocalValidationPassExecutionChecklistSource?.allowed_fields?.includes('required_command_count') &&
      weekTwoLocalValidationPassExecutionChecklistSource?.allowed_fields?.includes('required_commands') &&
      weekTwoLocalValidationPassExecutionChecklistSource?.allowed_fields?.includes('founder_report_field_count') &&
      weekTwoLocalValidationPassExecutionChecklistSource?.allowed_fields?.includes('no_external_send_attempted') &&
      weekTwoLocalValidationPassExecutionChecklistSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Week 2 local validation pass execution checklist admin evidence export preview must allow execution metadata and boundary fields only'
  );
  assert(
    weekTwoLocalValidationPassExecutionChecklistSource?.blocked_fields?.includes('validation_bypass_approval') &&
      weekTwoLocalValidationPassExecutionChecklistSource?.blocked_fields?.includes('raw_terminal_log') &&
      weekTwoLocalValidationPassExecutionChecklistSource?.blocked_fields?.includes('raw_failure_excerpt') &&
      weekTwoLocalValidationPassExecutionChecklistSource?.blocked_fields?.includes(
        'public_whitepaper_html_replacement_approval'
      ) &&
      weekTwoLocalValidationPassExecutionChecklistSource?.blocked_fields?.includes('deploy_setting_change_approval') &&
      weekTwoLocalValidationPassExecutionChecklistSource?.blocked_fields?.includes('live_supabase_write_approval') &&
      weekTwoLocalValidationPassExecutionChecklistSource?.blocked_fields?.includes('strict_rls_apply_approval') &&
      weekTwoLocalValidationPassExecutionChecklistSource?.blocked_fields?.includes('external_account_approval') &&
      weekTwoLocalValidationPassExecutionChecklistSource?.blocked_fields?.includes('real_finance_approval') &&
      weekTwoLocalValidationPassExecutionChecklistSource?.blocked_fields?.includes('stablecoin_settlement_approval') &&
      weekTwoLocalValidationPassExecutionChecklistSource?.blocked_fields?.includes('token_collateral_approval') &&
      weekTwoLocalValidationPassExecutionChecklistSource?.blocked_fields?.includes('xpr_signature') &&
      weekTwoLocalValidationPassExecutionChecklistSource?.blocked_fields?.includes('fio_registration_approval') &&
      weekTwoLocalValidationPassExecutionChecklistSource?.blocked_fields?.includes('destructive_git_approval') &&
      weekTwoLocalValidationPassExecutionChecklistSource?.blocked_fields?.includes('live_action_approval'),
    'Week 2 local validation pass execution checklist admin evidence export preview must block raw/log/public/live/destructive fields'
  );
  assert(
    weekTwoLocalValidationPassExecutionChecklistSource?.raw_content_storage_boundary ===
      weekTwoLocalValidationPassExecutionChecklistExportBoundary,
    'Week 2 local validation pass execution checklist admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoLocalValidationPassExecutionChecklist.body?.export_gate?.external_send ===
      'blocked' &&
      adminEvidenceExportPreviewWeekTwoLocalValidationPassExecutionChecklist.body?.no_server_storage_attempted ===
        true &&
      adminEvidenceExportPreviewWeekTwoLocalValidationPassExecutionChecklist.body?.no_live_action_attempted === true,
    'Week 2 local validation pass execution checklist admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewWeekTwoTwoWeekCloseoutReadiness = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=week_two_two_week_closeout_readiness',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-week-two-two-week-closeout-readiness-smoke' },
    }
  );
  const weekTwoTwoWeekCloseoutReadinessExportBoundary =
    'No secrets, Magic Link URLs, Auth tokens, service-role keys, raw env values, raw terminal logs, raw founder notes, private IDs, recipient contact data, external-send approvals, investor outreach approvals, grant submission approvals, provider outreach approvals, attorney outreach approvals, deploy approvals, public file replacement approvals, public URL-share approvals, tester-invite approvals, live Supabase approvals, admin membership insert approvals, strict RLS apply approvals, App Store or Play Console approvals, payment data, wallet data, real finance approvals, loan approvals, escrow approvals, repayment routing approvals, stablecoin settlement approvals, token collateral approvals, XPR signatures, FIO registrations, legal/provider decisions, destructive git approvals, production approvals, server storage, external sends, or live-action approvals are exported from this Week 2 two-week closeout readiness preview.';
  const weekTwoTwoWeekCloseoutReadinessSource =
    adminEvidenceExportPreviewWeekTwoTwoWeekCloseoutReadiness.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewWeekTwoTwoWeekCloseoutReadiness.status === 200,
    `Expected Week 2 two-week closeout readiness admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewWeekTwoTwoWeekCloseoutReadiness.status}`
  );
  assert(
    adminEvidenceExportPreviewWeekTwoTwoWeekCloseoutReadiness.body?.selected_source_filter ===
      'week_two_two_week_closeout_readiness' &&
      adminEvidenceExportPreviewWeekTwoTwoWeekCloseoutReadiness.body?.valid_source_filters?.includes(
        'week_two_two_week_closeout_readiness'
      ),
    'Week 2 two-week closeout readiness admin evidence export preview must accept the week_two_two_week_closeout_readiness source filter'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoTwoWeekCloseoutReadiness.body?.evidence_sources?.length === 1 &&
      weekTwoTwoWeekCloseoutReadinessSource?.id === 'week_two_two_week_closeout_readiness',
    'Week 2 two-week closeout readiness admin evidence export preview must return only the week_two_two_week_closeout_readiness source'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoTwoWeekCloseoutReadiness.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewWeekTwoTwoWeekCloseoutReadiness.body.review_router.targets[0]?.source_id ===
        'week_two_two_week_closeout_readiness' &&
      adminEvidenceExportPreviewWeekTwoTwoWeekCloseoutReadiness.body.review_router.targets[0]?.ui_anchor ===
        'betaReadinessGrid',
    'Week 2 two-week closeout readiness admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    weekTwoTwoWeekCloseoutReadinessSource?.allowed_fields?.includes('closeout_readiness_count') &&
      weekTwoTwoWeekCloseoutReadinessSource?.allowed_fields?.includes('readiness_state_counts') &&
      weekTwoTwoWeekCloseoutReadinessSource?.allowed_fields?.includes('checklist_phase_counts') &&
      weekTwoTwoWeekCloseoutReadinessSource?.allowed_fields?.includes('review_area_counts') &&
      weekTwoTwoWeekCloseoutReadinessSource?.allowed_fields?.includes('required_evidence_count') &&
      weekTwoTwoWeekCloseoutReadinessSource?.allowed_fields?.includes('required_evidence') &&
      weekTwoTwoWeekCloseoutReadinessSource?.allowed_fields?.includes('founder_report_field_count') &&
      weekTwoTwoWeekCloseoutReadinessSource?.allowed_fields?.includes('no_magic_link_url_requested') &&
      weekTwoTwoWeekCloseoutReadinessSource?.allowed_fields?.includes('no_admin_membership_insert_attempted') &&
      weekTwoTwoWeekCloseoutReadinessSource?.allowed_fields?.includes('no_external_send_attempted') &&
      weekTwoTwoWeekCloseoutReadinessSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Week 2 two-week closeout readiness admin evidence export preview must allow closeout metadata and boundary fields only'
  );
  assert(
    weekTwoTwoWeekCloseoutReadinessSource?.blocked_fields?.includes('magic_link_url') &&
      weekTwoTwoWeekCloseoutReadinessSource?.blocked_fields?.includes('auth_token') &&
      weekTwoTwoWeekCloseoutReadinessSource?.blocked_fields?.includes('service_role_key') &&
      weekTwoTwoWeekCloseoutReadinessSource?.blocked_fields?.includes('raw_terminal_log') &&
      weekTwoTwoWeekCloseoutReadinessSource?.blocked_fields?.includes('recipient_contact_data') &&
      weekTwoTwoWeekCloseoutReadinessSource?.blocked_fields?.includes('external_send_approval') &&
      weekTwoTwoWeekCloseoutReadinessSource?.blocked_fields?.includes('admin_membership_insert_approval') &&
      weekTwoTwoWeekCloseoutReadinessSource?.blocked_fields?.includes('strict_rls_apply_approval') &&
      weekTwoTwoWeekCloseoutReadinessSource?.blocked_fields?.includes('public_whitepaper_html_replacement_approval') &&
      weekTwoTwoWeekCloseoutReadinessSource?.blocked_fields?.includes('signing_key_upload_approval') &&
      weekTwoTwoWeekCloseoutReadinessSource?.blocked_fields?.includes('real_finance_approval') &&
      weekTwoTwoWeekCloseoutReadinessSource?.blocked_fields?.includes('stablecoin_settlement_approval') &&
      weekTwoTwoWeekCloseoutReadinessSource?.blocked_fields?.includes('token_collateral_approval') &&
      weekTwoTwoWeekCloseoutReadinessSource?.blocked_fields?.includes('xpr_signature') &&
      weekTwoTwoWeekCloseoutReadinessSource?.blocked_fields?.includes('fio_registration_approval') &&
      weekTwoTwoWeekCloseoutReadinessSource?.blocked_fields?.includes('destructive_git_approval') &&
      weekTwoTwoWeekCloseoutReadinessSource?.blocked_fields?.includes('live_action_approval'),
    'Week 2 two-week closeout readiness admin evidence export preview must block secret/Auth/raw/external/public/live fields'
  );
  assert(
    weekTwoTwoWeekCloseoutReadinessSource?.raw_content_storage_boundary ===
      weekTwoTwoWeekCloseoutReadinessExportBoundary,
    'Week 2 two-week closeout readiness admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewWeekTwoTwoWeekCloseoutReadiness.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewWeekTwoTwoWeekCloseoutReadiness.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewWeekTwoTwoWeekCloseoutReadiness.body?.no_live_action_attempted === true,
    'Week 2 two-week closeout readiness admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const adminEvidenceExportPreviewFounderLiveBlockerHandoffPack = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=founder_live_blocker_handoff_pack',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-founder-live-blocker-handoff-pack-smoke' },
    }
  );
  const founderLiveBlockerHandoffPackExportBoundary =
    'No founder secrets, Magic Link URLs, Auth tokens, raw founder notes, private IDs, live Supabase writes, admin membership approvals, deploy approvals, public URL-share approvals, tester-invite approvals, public file replacement approvals, legal/provider decisions, payment data, wallet data, XPR signatures, XPR registration approvals, server storage, external sends, or live-action approvals are exported from this founder live blocker handoff pack preview.';
  const founderLiveBlockerHandoffPackSource =
    adminEvidenceExportPreviewFounderLiveBlockerHandoffPack.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewFounderLiveBlockerHandoffPack.status === 200,
    `Expected founder live blocker handoff pack admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewFounderLiveBlockerHandoffPack.status}`
  );
  assert(
    adminEvidenceExportPreviewFounderLiveBlockerHandoffPack.body?.selected_source_filter === 'founder_live_blocker_handoff_pack' &&
      adminEvidenceExportPreviewFounderLiveBlockerHandoffPack.body?.valid_source_filters?.includes('founder_live_blocker_handoff_pack'),
    'Founder live blocker handoff pack admin evidence export preview must accept the founder_live_blocker_handoff_pack source filter'
  );
  assert(
    adminEvidenceExportPreviewFounderLiveBlockerHandoffPack.body?.evidence_sources?.length === 1 &&
      founderLiveBlockerHandoffPackSource?.id === 'founder_live_blocker_handoff_pack',
    'Founder live blocker handoff pack admin evidence export preview must return only the founder_live_blocker_handoff_pack source'
  );
  assert(
    adminEvidenceExportPreviewFounderLiveBlockerHandoffPack.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewFounderLiveBlockerHandoffPack.body.review_router.targets[0]?.source_id === 'founder_live_blocker_handoff_pack' &&
      adminEvidenceExportPreviewFounderLiveBlockerHandoffPack.body.review_router.targets[0]?.ui_anchor === 'betaReadinessGrid',
    'Founder live blocker handoff pack admin evidence export preview review router must point to betaReadinessGrid'
  );
  assert(
    founderLiveBlockerHandoffPackSource?.allowed_fields?.includes('blocker_item_count') &&
      founderLiveBlockerHandoffPackSource?.allowed_fields?.includes('blocker_group_count') &&
      founderLiveBlockerHandoffPackSource?.allowed_fields?.includes('blocked_live_actions') &&
      founderLiveBlockerHandoffPackSource?.allowed_fields?.includes('no_xpr_signature_attempted') &&
      founderLiveBlockerHandoffPackSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Founder live blocker handoff pack admin evidence export preview must allow blocker metadata and boundary fields only'
  );
  assert(
    founderLiveBlockerHandoffPackSource?.blocked_fields?.includes('magic_link_url') &&
      founderLiveBlockerHandoffPackSource?.blocked_fields?.includes('auth_user_id') &&
      founderLiveBlockerHandoffPackSource?.blocked_fields?.includes('admin_membership_approval') &&
      founderLiveBlockerHandoffPackSource?.blocked_fields?.includes('live_supabase_write_approval') &&
      founderLiveBlockerHandoffPackSource?.blocked_fields?.includes('deploy_setting_change_approval') &&
      founderLiveBlockerHandoffPackSource?.blocked_fields?.includes('public_url_share_approval') &&
      founderLiveBlockerHandoffPackSource?.blocked_fields?.includes('tester_invite_approval') &&
      founderLiveBlockerHandoffPackSource?.blocked_fields?.includes('legal_decision') &&
      founderLiveBlockerHandoffPackSource?.blocked_fields?.includes('payment_data') &&
      founderLiveBlockerHandoffPackSource?.blocked_fields?.includes('stablecoin_settlement_approval') &&
      founderLiveBlockerHandoffPackSource?.blocked_fields?.includes('token_collateral_lock_approval') &&
      founderLiveBlockerHandoffPackSource?.blocked_fields?.includes('xpr_signature') &&
      founderLiveBlockerHandoffPackSource?.blocked_fields?.includes('xpr_registration_approval'),
    'Founder live blocker handoff pack admin evidence export preview must block secret/Auth/admin/deploy/share/invite/legal/payment/stablecoin/token/XPR/live fields'
  );
  assert(
    founderLiveBlockerHandoffPackSource?.raw_content_storage_boundary === founderLiveBlockerHandoffPackExportBoundary,
    'Founder live blocker handoff pack admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewFounderLiveBlockerHandoffPack.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewFounderLiveBlockerHandoffPack.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewFounderLiveBlockerHandoffPack.body?.no_live_action_attempted === true,
    'Founder live blocker handoff pack admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
  );

  const founderLiveBlockerHandoffPackEndpoint = await request(
    baseUrl,
    '/api/admin/founder-live-blocker-handoff-pack',
    {
      headers: { 'X-Request-Id': 'gcsc-founder-live-blocker-handoff-pack-endpoint-smoke' },
    }
  );
  assert(
    founderLiveBlockerHandoffPackEndpoint.status === 200,
    `Expected founder live blocker handoff pack endpoint 200, got ${founderLiveBlockerHandoffPackEndpoint.status}`
  );
  assert(
    founderLiveBlockerHandoffPackEndpoint.headers.get('x-request-id') ===
      'gcsc-founder-live-blocker-handoff-pack-endpoint-smoke' &&
      founderLiveBlockerHandoffPackEndpoint.body?.request_id ===
        'gcsc-founder-live-blocker-handoff-pack-endpoint-smoke' &&
      founderLiveBlockerHandoffPackEndpoint.body?.request_id_header ===
        'gcsc-founder-live-blocker-handoff-pack-endpoint-smoke',
    'Founder live blocker handoff pack endpoint must preserve X-Request-Id in the header and JSON body'
  );
  const founderLiveBlockerHandoffPackEndpointBody = founderLiveBlockerHandoffPackEndpoint.body || {};
  const founderLiveBlockerHandoffPackItems = founderLiveBlockerHandoffPackEndpointBody.handoff_pack || [];
  assert(
    founderLiveBlockerHandoffPackEndpointBody.mode === 'founder_live_blocker_handoff_pack' &&
      founderLiveBlockerHandoffPackEndpointBody.request_path === '/api/admin/founder-live-blocker-handoff-pack' &&
      founderLiveBlockerHandoffPackEndpointBody.request_method === 'GET' &&
      founderLiveBlockerHandoffPackEndpointBody.status === 'FOUNDER_REVIEW_ONLY' &&
      founderLiveBlockerHandoffPackEndpointBody.item_count === 6 &&
      founderLiveBlockerHandoffPackItems.includes(
        'Auth/Admin blocker: founder Magic Link, profile binding, admin_memberships activation, and strict admin smoke remain founder-present; Codex can prepare evidence only.'
      ) &&
      founderLiveBlockerHandoffPackItems.includes(
        'Deploy blocker: Vercel/public URL, Supabase Auth redirect URLs, production env vars, and domain settings require founder account control; no autonomous account changes.'
      ) &&
      founderLiveBlockerHandoffPackItems.some((item) => item.includes('Contract review next step')) &&
      founderLiveBlockerHandoffPackItems.some((item) => item.includes('Beta invite blocker')) &&
      founderLiveBlockerHandoffPackEndpointBody.blocked_live_actions?.includes('magic_link_url_paste') &&
      founderLiveBlockerHandoffPackEndpointBody.blocked_live_actions?.includes('live_supabase_write') &&
      founderLiveBlockerHandoffPackEndpointBody.blocked_live_actions?.includes('admin_membership_activation') &&
      founderLiveBlockerHandoffPackEndpointBody.blocked_live_actions?.includes('deploy_setting_change') &&
      founderLiveBlockerHandoffPackEndpointBody.blocked_live_actions?.includes('public_url_share') &&
      founderLiveBlockerHandoffPackEndpointBody.blocked_live_actions?.includes('real_payment') &&
      founderLiveBlockerHandoffPackEndpointBody.blocked_live_actions?.includes('real_loan') &&
      founderLiveBlockerHandoffPackEndpointBody.blocked_live_actions?.includes('real_escrow') &&
      founderLiveBlockerHandoffPackEndpointBody.blocked_live_actions?.includes('token_collateral_lock') &&
      founderLiveBlockerHandoffPackEndpointBody.blocked_live_actions?.includes('xpr_signature') &&
      founderLiveBlockerHandoffPackEndpointBody.blocked_live_actions?.includes('fio_registration') &&
      founderLiveBlockerHandoffPackEndpointBody.safe_report_fields?.includes('request_id') &&
      founderLiveBlockerHandoffPackEndpointBody.linked_surfaces?.includes('/api/admin/beta-readiness') &&
      founderLiveBlockerHandoffPackEndpointBody.no_magic_link_url_requested === true &&
      founderLiveBlockerHandoffPackEndpointBody.no_auth_token_requested === true &&
      founderLiveBlockerHandoffPackEndpointBody.no_service_role_key_used === true &&
      founderLiveBlockerHandoffPackEndpointBody.no_live_supabase_write_attempted === true &&
      founderLiveBlockerHandoffPackEndpointBody.no_admin_membership_insert_attempted === true &&
      founderLiveBlockerHandoffPackEndpointBody.no_strict_rls_apply_attempted === true &&
      founderLiveBlockerHandoffPackEndpointBody.no_external_account_change_attempted === true &&
      founderLiveBlockerHandoffPackEndpointBody.no_deploy_setting_change_attempted === true &&
      founderLiveBlockerHandoffPackEndpointBody.no_public_url_share_attempted === true &&
      founderLiveBlockerHandoffPackEndpointBody.no_tester_invite_attempted === true &&
      founderLiveBlockerHandoffPackEndpointBody.no_real_payment_attempted === true &&
      founderLiveBlockerHandoffPackEndpointBody.no_real_loan_attempted === true &&
      founderLiveBlockerHandoffPackEndpointBody.no_escrow_release_attempted === true &&
      founderLiveBlockerHandoffPackEndpointBody.no_repayment_routing_attempted === true &&
      founderLiveBlockerHandoffPackEndpointBody.no_stablecoin_settlement_attempted === true &&
      founderLiveBlockerHandoffPackEndpointBody.no_token_collateral_lock_attempted === true &&
      founderLiveBlockerHandoffPackEndpointBody.no_xpr_signature_attempted === true &&
      founderLiveBlockerHandoffPackEndpointBody.no_fio_registration_attempted === true &&
      founderLiveBlockerHandoffPackEndpointBody.no_legal_provider_decision_attempted === true &&
      founderLiveBlockerHandoffPackEndpointBody.no_production_release_attempted === true &&
      founderLiveBlockerHandoffPackEndpointBody.no_server_storage_attempted === true &&
      founderLiveBlockerHandoffPackEndpointBody.no_external_send_attempted === true &&
      founderLiveBlockerHandoffPackEndpointBody.no_live_action_attempted === true,
    'Founder live blocker handoff pack endpoint must expose request trace metadata, founder-only blocker items, blocked live actions, safe report fields, and no-live boundaries'
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

  const adminEvidenceExportPreviewSupabaseBoundary = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=supabase_boundary',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-supabase-boundary-smoke' },
    }
  );
  const supabaseBoundaryExportBoundary =
    'No service-role keys, database passwords, raw env values, Supabase access tokens, Magic Link URLs, Auth/session tokens, admin_memberships insert approvals or SQL, profile repair approvals, strict RLS apply approvals, live Supabase changes, Supabase project settings, deploy/public beta approvals, payment/wallet data, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this Supabase Boundary preview.';
  const supabaseBoundarySource = adminEvidenceExportPreviewSupabaseBoundary.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewSupabaseBoundary.status === 200,
    `Expected Supabase Boundary admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewSupabaseBoundary.status}`
  );
  assert(
    adminEvidenceExportPreviewSupabaseBoundary.body?.selected_source_filter === 'supabase_boundary' &&
      adminEvidenceExportPreviewSupabaseBoundary.body?.valid_source_filters?.includes('supabase_boundary'),
    'Supabase Boundary admin evidence export preview must accept the supabase_boundary source filter'
  );
  assert(
    adminEvidenceExportPreviewSupabaseBoundary.body?.evidence_sources?.length === 1 &&
      supabaseBoundarySource?.id === 'supabase_boundary',
    'Supabase Boundary admin evidence export preview must return only the supabase_boundary source'
  );
  assert(
    adminEvidenceExportPreviewSupabaseBoundary.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewSupabaseBoundary.body.review_router.targets[0]?.source_id === 'supabase_boundary' &&
      adminEvidenceExportPreviewSupabaseBoundary.body.review_router.targets[0]?.ui_anchor === 'supabaseBoundaryGrid',
    'Supabase Boundary admin evidence export preview review router must point to supabaseBoundaryGrid'
  );
  assert(
    supabaseBoundarySource?.allowed_fields?.includes('boundary_item_count') &&
      supabaseBoundarySource?.allowed_fields?.includes('boundary_status_counts') &&
      supabaseBoundarySource?.allowed_fields?.includes('publishable_client_status') &&
      supabaseBoundarySource?.allowed_fields?.includes('service_role_boundary_status') &&
      supabaseBoundarySource?.allowed_fields?.includes('auth_admin_boundary_status') &&
      supabaseBoundarySource?.allowed_fields?.includes('strict_admin_public_beta_gate') &&
      supabaseBoundarySource?.allowed_fields?.includes('live_supabase_change_status') &&
      supabaseBoundarySource?.allowed_fields?.includes('no_service_role_key_exposed') &&
      supabaseBoundarySource?.allowed_fields?.includes('no_raw_env_value_exposed') &&
      supabaseBoundarySource?.allowed_fields?.includes('no_database_password_exposed') &&
      supabaseBoundarySource?.allowed_fields?.includes('no_auth_token_exposed') &&
      supabaseBoundarySource?.allowed_fields?.includes('no_admin_membership_insert_attempted') &&
      supabaseBoundarySource?.allowed_fields?.includes('no_strict_rls_apply_attempted') &&
      supabaseBoundarySource?.allowed_fields?.includes('no_live_supabase_change_attempted') &&
      supabaseBoundarySource?.allowed_fields?.includes('no_deploy_setting_change_attempted') &&
      supabaseBoundarySource?.allowed_fields?.includes('no_external_export_attempted') &&
      supabaseBoundarySource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Supabase Boundary admin evidence export preview must allow boundary metadata and no-secret/no-live fields only'
  );
  assert(
    supabaseBoundarySource?.blocked_fields?.includes('service_role_key') &&
      supabaseBoundarySource?.blocked_fields?.includes('database_password') &&
      supabaseBoundarySource?.blocked_fields?.includes('database_url') &&
      supabaseBoundarySource?.blocked_fields?.includes('raw_env_value') &&
      supabaseBoundarySource?.blocked_fields?.includes('supabase_access_token') &&
      supabaseBoundarySource?.blocked_fields?.includes('supabase_project_jwt_secret') &&
      supabaseBoundarySource?.blocked_fields?.includes('supabase_anon_key_raw') &&
      supabaseBoundarySource?.blocked_fields?.includes('magic_link_url') &&
      supabaseBoundarySource?.blocked_fields?.includes('auth_token') &&
      supabaseBoundarySource?.blocked_fields?.includes('admin_memberships_insert_sql') &&
      supabaseBoundarySource?.blocked_fields?.includes('admin_membership_insert_approval') &&
      supabaseBoundarySource?.blocked_fields?.includes('profile_repair_approval') &&
      supabaseBoundarySource?.blocked_fields?.includes('strict_rls_apply_approval') &&
      supabaseBoundarySource?.blocked_fields?.includes('live_supabase_change_approval') &&
      supabaseBoundarySource?.blocked_fields?.includes('supabase_project_setting_change_approval') &&
      supabaseBoundarySource?.blocked_fields?.includes('supabase_redirect_update_approval') &&
      supabaseBoundarySource?.blocked_fields?.includes('deploy_setting_change_approval') &&
      supabaseBoundarySource?.blocked_fields?.includes('public_beta_approval') &&
      supabaseBoundarySource?.blocked_fields?.includes('payment_or_wallet_data') &&
      supabaseBoundarySource?.blocked_fields?.includes('legal_decision') &&
      supabaseBoundarySource?.blocked_fields?.includes('live_action_approval'),
    'Supabase Boundary admin evidence export preview must block secret, Auth, admin insert, profile repair, strict RLS, live Supabase, deploy, beta, payment/wallet, legal, and live fields'
  );
  assert(
    supabaseBoundarySource?.raw_content_storage_boundary === supabaseBoundaryExportBoundary,
    'Supabase Boundary admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewSupabaseBoundary.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewSupabaseBoundary.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewSupabaseBoundary.body?.no_live_action_attempted === true,
    'Supabase Boundary admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
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

  const adminEvidenceExportPreviewMobileInstallReadiness = await request(
    baseUrl,
    '/api/admin/admin-evidence-export-preview?source_filter=mobile_install_readiness',
    {
      headers: { 'X-Request-Id': 'gcsc-admin-evidence-export-preview-mobile-install-readiness-smoke' },
    }
  );
  const mobileInstallReadinessExportBoundary =
    'No app-store approvals, Play Console approvals, signing keys, certificates, provisioning profiles, keystores, external account sessions, production deploy approvals, public release approvals, payment/wallet data, real loan approvals, escrow release approvals, stablecoin settlement approvals, token collateral approvals, XPR signatures, legal/provider decisions, server storage, external sends, or live-action approvals are exported from this Mobile Install Readiness preview.';
  const mobileInstallReadinessSource =
    adminEvidenceExportPreviewMobileInstallReadiness.body?.evidence_sources?.[0];
  assert(
    adminEvidenceExportPreviewMobileInstallReadiness.status === 200,
    `Expected Mobile install readiness admin-evidence-export-preview 200, got ${adminEvidenceExportPreviewMobileInstallReadiness.status}`
  );
  assert(
    adminEvidenceExportPreviewMobileInstallReadiness.body?.selected_source_filter === 'mobile_install_readiness' &&
      adminEvidenceExportPreviewMobileInstallReadiness.body?.valid_source_filters?.includes('mobile_install_readiness'),
    'Mobile install readiness admin evidence export preview must accept the mobile_install_readiness source filter'
  );
  assert(
    adminEvidenceExportPreviewMobileInstallReadiness.body?.evidence_sources?.length === 1 &&
      mobileInstallReadinessSource?.id === 'mobile_install_readiness',
    'Mobile install readiness admin evidence export preview must return only the mobile_install_readiness source'
  );
  assert(
    adminEvidenceExportPreviewMobileInstallReadiness.body?.review_router?.targets?.length === 1 &&
      adminEvidenceExportPreviewMobileInstallReadiness.body.review_router.targets[0]?.source_id === 'mobile_install_readiness' &&
      adminEvidenceExportPreviewMobileInstallReadiness.body.review_router.targets[0]?.ui_anchor === 'mobileInstallReadinessGrid',
    'Mobile install readiness admin evidence export preview review router must point to mobileInstallReadinessGrid'
  );
  assert(
    mobileInstallReadinessSource?.allowed_fields?.includes('pwa_file_count') &&
      mobileInstallReadinessSource?.allowed_fields?.includes('pwa_check_count') &&
      mobileInstallReadinessSource?.allowed_fields?.includes('evidence_checklist_count') &&
      mobileInstallReadinessSource?.allowed_fields?.includes('app_store_submission_status') &&
      mobileInstallReadinessSource?.allowed_fields?.includes('play_console_submission_status') &&
      mobileInstallReadinessSource?.allowed_fields?.includes('real_money_mobile_release_status') &&
      mobileInstallReadinessSource?.allowed_fields?.includes('service_worker_api_boundary_status') &&
      mobileInstallReadinessSource?.allowed_fields?.includes('mobile_viewport_evidence_status') &&
      mobileInstallReadinessSource?.allowed_fields?.includes('no_app_store_submission_attempted') &&
      mobileInstallReadinessSource?.allowed_fields?.includes('no_play_console_submission_attempted') &&
      mobileInstallReadinessSource?.allowed_fields?.includes('no_native_wrapper_release_attempted') &&
      mobileInstallReadinessSource?.allowed_fields?.includes('no_real_money_mobile_release_attempted') &&
      mobileInstallReadinessSource?.allowed_fields?.includes('no_xpr_signature_attempted') &&
      mobileInstallReadinessSource?.allowed_fields?.includes('no_external_export_attempted') &&
      mobileInstallReadinessSource?.allowed_fields?.includes('raw_content_storage_boundary'),
    'Mobile install readiness admin evidence export preview must allow PWA/mobile metadata and no-store/no-live fields only'
  );
  assert(
    mobileInstallReadinessSource?.blocked_fields?.includes('app_store_submission_approval') &&
      mobileInstallReadinessSource?.blocked_fields?.includes('play_console_submission_approval') &&
      mobileInstallReadinessSource?.blocked_fields?.includes('native_wrapper_release_approval') &&
      mobileInstallReadinessSource?.blocked_fields?.includes('certificate') &&
      mobileInstallReadinessSource?.blocked_fields?.includes('provisioning_profile') &&
      mobileInstallReadinessSource?.blocked_fields?.includes('signing_key') &&
      mobileInstallReadinessSource?.blocked_fields?.includes('app_signing_key') &&
      mobileInstallReadinessSource?.blocked_fields?.includes('keystore') &&
      mobileInstallReadinessSource?.blocked_fields?.includes('apple_developer_account_session') &&
      mobileInstallReadinessSource?.blocked_fields?.includes('play_console_account_session') &&
      mobileInstallReadinessSource?.blocked_fields?.includes('external_account_session') &&
      mobileInstallReadinessSource?.blocked_fields?.includes('production_deploy_approval') &&
      mobileInstallReadinessSource?.blocked_fields?.includes('public_release_approval') &&
      mobileInstallReadinessSource?.blocked_fields?.includes('raw_mobile_screenshot') &&
      mobileInstallReadinessSource?.blocked_fields?.includes('payment_or_wallet_data') &&
      mobileInstallReadinessSource?.blocked_fields?.includes('escrow_release_approval') &&
      mobileInstallReadinessSource?.blocked_fields?.includes('stablecoin_settlement_approval') &&
      mobileInstallReadinessSource?.blocked_fields?.includes('token_collateral_lock_approval') &&
      mobileInstallReadinessSource?.blocked_fields?.includes('xpr_signature_approval') &&
      mobileInstallReadinessSource?.blocked_fields?.includes('legal_decision') &&
      mobileInstallReadinessSource?.blocked_fields?.includes('live_action_approval'),
    'Mobile install readiness admin evidence export preview must block store, signing, account, release, screenshot, finance, XPR, legal, and live fields'
  );
  assert(
    mobileInstallReadinessSource?.raw_content_storage_boundary === mobileInstallReadinessExportBoundary,
    'Mobile install readiness admin evidence export preview must expose the source-level raw-content storage boundary'
  );
  assert(
    adminEvidenceExportPreviewMobileInstallReadiness.body?.export_gate?.external_send === 'blocked' &&
      adminEvidenceExportPreviewMobileInstallReadiness.body?.no_server_storage_attempted === true &&
      adminEvidenceExportPreviewMobileInstallReadiness.body?.no_live_action_attempted === true,
    'Mobile install readiness admin evidence export preview must remain no-storage, no-external-send, and no-live-action'
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
  assert(
    Array.isArray(betaReadiness.body?.founder_auth_next_step_readiness),
    'Beta readiness must return founder_auth_next_step_readiness array'
  );
  const founderAuthNextStepIds = betaReadiness.body.founder_auth_next_step_readiness.map((item) => item.id);
  const founderAuthNextStepStates = betaReadiness.body.founder_auth_next_step_readiness.map((item) => item.readiness_state);
  const founderAuthNextStepBlockedActions = betaReadiness.body.founder_auth_next_step_readiness.flatMap((item) =>
    Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
  );
  assert(
    founderAuthNextStepIds.includes('founder_auth_same_browser_magic_link') &&
      founderAuthNextStepIds.includes('founder_auth_profile_binding_review') &&
      founderAuthNextStepIds.includes('founder_admin_activation_stop_gate') &&
      founderAuthNextStepStates.includes('FOUNDER_MAGIC_LINK_REQUIRED') &&
      founderAuthNextStepStates.includes('PROFILE_BINDING_EVIDENCE_REQUIRED') &&
      founderAuthNextStepStates.includes('BLOCKED_UNTIL_EXPLICIT_LIVE_APPROVAL') &&
      founderAuthNextStepBlockedActions.includes('magic_link_url_paste') &&
      founderAuthNextStepBlockedActions.includes('profiles_auth_user_id_update') &&
      founderAuthNextStepBlockedActions.includes('admin_memberships_insert') &&
      founderAuthNextStepBlockedActions.includes('strict_rls_apply') &&
      founderAuthNextStepBlockedActions.includes('deploy_setting_change') &&
      founderAuthNextStepBlockedActions.includes('payment_or_loan_action') &&
      betaReadiness.body.founder_auth_next_step_readiness.every((item) => item.no_secret_requested === true) &&
      betaReadiness.body.founder_auth_next_step_readiness.every((item) => item.no_profile_repair_attempted === true) &&
      betaReadiness.body.founder_auth_next_step_readiness.every((item) => item.no_admin_membership_insert_attempted === true) &&
      betaReadiness.body.founder_auth_next_step_readiness.every((item) => item.no_strict_rls_apply_attempted === true) &&
      betaReadiness.body.founder_auth_next_step_readiness.every((item) => item.no_live_action_attempted === true),
    'Beta readiness founder Auth next-step readiness must expose Magic Link, profile binding, admin activation stop gates, and no-live boundaries'
  );
  assert(
    Array.isArray(betaReadiness.body?.week_two_auth_admin_readiness),
    'Beta readiness must return week_two_auth_admin_readiness array'
  );
  const weekTwoAuthAdminReadinessIds = betaReadiness.body.week_two_auth_admin_readiness.map((item) => item.id);
  const weekTwoAuthAdminReadinessStates = betaReadiness.body.week_two_auth_admin_readiness.map((item) => item.readiness_state);
  const weekTwoAuthAdminReadinessPhases = betaReadiness.body.week_two_auth_admin_readiness.map((item) => item.checklist_phase);
  const weekTwoAuthAdminBlockedActions = betaReadiness.body.week_two_auth_admin_readiness.flatMap((item) =>
    Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
  );
  assert(
    weekTwoAuthAdminReadinessIds.includes('week_two_magic_link_same_browser_checklist') &&
      weekTwoAuthAdminReadinessIds.includes('week_two_founder_profile_binding_checklist') &&
      weekTwoAuthAdminReadinessIds.includes('week_two_admin_membership_live_approval_gate') &&
      weekTwoAuthAdminReadinessIds.includes('week_two_strict_rls_decision_packet_checklist') &&
      weekTwoAuthAdminReadinessStates.includes('FOUNDER_MAGIC_LINK_EVIDENCE_REQUIRED') &&
      weekTwoAuthAdminReadinessStates.includes('FOUNDER_PROFILE_BINDING_EVIDENCE_REQUIRED') &&
      weekTwoAuthAdminReadinessStates.includes('ADMIN_MEMBERSHIP_LIVE_APPROVAL_BLOCKED') &&
      weekTwoAuthAdminReadinessStates.includes('STRICT_RLS_REVIEW_PACKET_READY_LIVE_APPLY_BLOCKED') &&
      weekTwoAuthAdminReadinessPhases.includes('magic_link_evidence') &&
      weekTwoAuthAdminReadinessPhases.includes('strict_rls_decision_packet') &&
      weekTwoAuthAdminBlockedActions.includes('magic_link_url_paste') &&
      weekTwoAuthAdminBlockedActions.includes('service_role_key_use') &&
      weekTwoAuthAdminBlockedActions.includes('profiles_auth_user_id_update') &&
      weekTwoAuthAdminBlockedActions.includes('admin_memberships_insert') &&
      weekTwoAuthAdminBlockedActions.includes('strict_rls_apply') &&
      weekTwoAuthAdminBlockedActions.includes('live_supabase_write') &&
      betaReadiness.body.week_two_auth_admin_readiness.every((item) => item.no_magic_link_url_requested === true) &&
      betaReadiness.body.week_two_auth_admin_readiness.every((item) => item.no_service_role_key_requested === true) &&
      betaReadiness.body.week_two_auth_admin_readiness.every((item) => item.no_profile_repair_attempted === true) &&
      betaReadiness.body.week_two_auth_admin_readiness.every((item) => item.no_admin_membership_insert_attempted === true) &&
      betaReadiness.body.week_two_auth_admin_readiness.every((item) => item.no_strict_rls_apply_attempted === true) &&
      betaReadiness.body.week_two_auth_admin_readiness.every((item) => item.no_live_supabase_write_attempted === true) &&
      betaReadiness.body.week_two_auth_admin_readiness.every((item) => item.no_live_action_attempted === true),
    'Beta readiness Week 2 Auth/Admin readiness must expose Magic Link, profile, admin membership, strict RLS, and no-live boundaries'
  );
  assert(
    Array.isArray(betaReadiness.body?.week_two_auth_admin_execution_checklist),
    'Beta readiness must return week_two_auth_admin_execution_checklist array'
  );
  const weekTwoAuthAdminExecutionIds = betaReadiness.body.week_two_auth_admin_execution_checklist.map((item) => item.id);
  const weekTwoAuthAdminExecutionStates = betaReadiness.body.week_two_auth_admin_execution_checklist.map(
    (item) => item.readiness_state
  );
  const weekTwoAuthAdminExecutionPhases = betaReadiness.body.week_two_auth_admin_execution_checklist.map(
    (item) => item.execution_phase
  );
  const weekTwoAuthAdminExecutionBlockedActions = betaReadiness.body.week_two_auth_admin_execution_checklist.flatMap(
    (item) => (Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : [])
  );
  assert(
    weekTwoAuthAdminExecutionIds.includes('week_two_auth_admin_report_back_intake') &&
      weekTwoAuthAdminExecutionIds.includes('week_two_auth_admin_selected_user_confirmation') &&
      weekTwoAuthAdminExecutionIds.includes('week_two_auth_admin_live_request_hold') &&
      weekTwoAuthAdminExecutionIds.includes('week_two_auth_admin_post_activation_smoke_order_hold') &&
      weekTwoAuthAdminExecutionStates.includes('CURRENT_THREAD_REPORT_BACK_REQUIRED') &&
      weekTwoAuthAdminExecutionStates.includes('SELECTED_USER_CONFIRMATION_REQUIRED') &&
      weekTwoAuthAdminExecutionStates.includes('LIVE_ADMIN_ACTIVATION_REQUEST_HELD') &&
      weekTwoAuthAdminExecutionStates.includes('POST_ACTIVATION_SMOKE_ORDER_READY_LIVE_BLOCKED') &&
      weekTwoAuthAdminExecutionPhases.includes('founder_report_back_intake') &&
      weekTwoAuthAdminExecutionPhases.includes('post_activation_smoke_order') &&
      weekTwoAuthAdminExecutionBlockedActions.includes('raw_founder_identity_storage') &&
      weekTwoAuthAdminExecutionBlockedActions.includes('selected_user_screenshot_storage') &&
      weekTwoAuthAdminExecutionBlockedActions.includes('admin_memberships_insert') &&
      weekTwoAuthAdminExecutionBlockedActions.includes('strict_admin_smoke_live_run') &&
      weekTwoAuthAdminExecutionBlockedActions.includes('live_supabase_write') &&
      weekTwoAuthAdminExecutionBlockedActions.includes('xpr_signature') &&
      betaReadiness.body.week_two_auth_admin_execution_checklist.every(
        (item) => item.no_raw_identity_storage_attempted === true
      ) &&
      betaReadiness.body.week_two_auth_admin_execution_checklist.every(
        (item) => item.no_selected_user_screenshot_storage_attempted === true
      ) &&
      betaReadiness.body.week_two_auth_admin_execution_checklist.every(
        (item) => item.no_admin_membership_insert_attempted === true
      ) &&
      betaReadiness.body.week_two_auth_admin_execution_checklist.every(
        (item) => item.no_strict_admin_smoke_live_run_attempted === true
      ) &&
      betaReadiness.body.week_two_auth_admin_execution_checklist.every(
        (item) => item.no_live_supabase_write_attempted === true
      ) &&
      betaReadiness.body.week_two_auth_admin_execution_checklist.every(
        (item) => item.no_live_action_attempted === true
      ),
    'Beta readiness Week 2 Auth/Admin execution checklist must expose report-back, selected user, live request hold, post-smoke order, and no-live boundaries'
  );
  assert(
    Array.isArray(betaReadiness.body?.deployment_next_step_readiness),
    'Beta readiness must return deployment_next_step_readiness array'
  );
  const deploymentNextStepIds = betaReadiness.body.deployment_next_step_readiness.map((item) => item.id);
  const deploymentNextStepStates = betaReadiness.body.deployment_next_step_readiness.map((item) => item.readiness_state);
  const deploymentNextStepBlockedActions = betaReadiness.body.deployment_next_step_readiness.flatMap((item) =>
    Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
  );
  assert(
    deploymentNextStepIds.includes('deployment_target_selection_review') &&
      deploymentNextStepIds.includes('deployment_account_session_boundary') &&
      deploymentNextStepIds.includes('public_beta_url_smoke_evidence_intake') &&
      deploymentNextStepIds.includes('supabase_redirect_env_owner_boundary') &&
      deploymentNextStepStates.includes('READY_FOR_FOUNDER_DEPLOY_TARGET_REVIEW') &&
      deploymentNextStepStates.includes('BLOCKED_FOR_FOUNDER_ACCOUNT_SESSION_REVIEW') &&
      deploymentNextStepStates.includes('LOCAL_EVIDENCE_TEMPLATE_READY_URL_PENDING') &&
      deploymentNextStepStates.includes('BLOCKED_EXTERNAL_ACTION_FOUNDER_ONLY') &&
      deploymentNextStepBlockedActions.includes('vercel_import') &&
      deploymentNextStepBlockedActions.includes('github_pages_setting_change') &&
      deploymentNextStepBlockedActions.includes('dns_change') &&
      deploymentNextStepBlockedActions.includes('supabase_redirect_update') &&
      deploymentNextStepBlockedActions.includes('production_env_var_change') &&
      deploymentNextStepBlockedActions.includes('public_url_share') &&
      deploymentNextStepBlockedActions.includes('tester_invite') &&
      deploymentNextStepBlockedActions.includes('production_deploy') &&
      deploymentNextStepBlockedActions.includes('payment_or_loan_action') &&
      deploymentNextStepBlockedActions.includes('legal_or_provider_decision') &&
      betaReadiness.body.deployment_next_step_readiness.every((item) => item.no_external_account_change_attempted === true) &&
      betaReadiness.body.deployment_next_step_readiness.every((item) => item.no_deploy_setting_change_attempted === true) &&
      betaReadiness.body.deployment_next_step_readiness.every((item) => item.no_dns_change_attempted === true) &&
      betaReadiness.body.deployment_next_step_readiness.every((item) => item.no_supabase_redirect_change_attempted === true) &&
      betaReadiness.body.deployment_next_step_readiness.every((item) => item.no_public_url_share_attempted === true) &&
      betaReadiness.body.deployment_next_step_readiness.every((item) => item.no_tester_invite_attempted === true) &&
      betaReadiness.body.deployment_next_step_readiness.every((item) => item.no_live_action_attempted === true),
    'Beta readiness deployment next-step readiness must expose founder-only deployment, account, URL smoke, Supabase redirect, and no-live boundaries'
  );
  assert(
    Array.isArray(betaReadiness.body?.week_two_deployment_public_beta_readiness),
    'Beta readiness must return week_two_deployment_public_beta_readiness array'
  );
  const weekTwoDeploymentPublicBetaReadinessIds = betaReadiness.body.week_two_deployment_public_beta_readiness.map((item) => item.id);
  const weekTwoDeploymentPublicBetaReadinessStates = betaReadiness.body.week_two_deployment_public_beta_readiness.map((item) => item.readiness_state);
  const weekTwoDeploymentPublicBetaReadinessPhases = betaReadiness.body.week_two_deployment_public_beta_readiness.map((item) => item.checklist_phase);
  const weekTwoDeploymentPublicBetaBlockedActions = betaReadiness.body.week_two_deployment_public_beta_readiness.flatMap((item) =>
    Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
  );
  assert(
    weekTwoDeploymentPublicBetaReadinessIds.includes('week_two_deploy_target_review_checklist') &&
      weekTwoDeploymentPublicBetaReadinessIds.includes('week_two_public_url_smoke_template_checklist') &&
      weekTwoDeploymentPublicBetaReadinessIds.includes('week_two_supabase_redirect_env_boundary_checklist') &&
      weekTwoDeploymentPublicBetaReadinessIds.includes('week_two_public_beta_invite_gate_checklist') &&
      weekTwoDeploymentPublicBetaReadinessStates.includes('FOUNDER_DEPLOY_TARGET_REVIEW_REQUIRED') &&
      weekTwoDeploymentPublicBetaReadinessStates.includes('PUBLIC_URL_SMOKE_TEMPLATE_READY_URL_PENDING') &&
      weekTwoDeploymentPublicBetaReadinessStates.includes('SUPABASE_REDIRECT_ENV_FOUNDER_ONLY_BLOCKED') &&
      weekTwoDeploymentPublicBetaReadinessStates.includes('PUBLIC_BETA_INVITE_APPROVAL_BLOCKED') &&
      weekTwoDeploymentPublicBetaReadinessPhases.includes('deploy_target_review') &&
      weekTwoDeploymentPublicBetaReadinessPhases.includes('public_url_smoke_template') &&
      weekTwoDeploymentPublicBetaReadinessPhases.includes('supabase_redirect_env_boundary') &&
      weekTwoDeploymentPublicBetaReadinessPhases.includes('public_beta_invite_gate') &&
      weekTwoDeploymentPublicBetaBlockedActions.includes('vercel_import') &&
      weekTwoDeploymentPublicBetaBlockedActions.includes('supabase_redirect_update') &&
      weekTwoDeploymentPublicBetaBlockedActions.includes('real_public_url_in_repo') &&
      weekTwoDeploymentPublicBetaBlockedActions.includes('public_url_share') &&
      weekTwoDeploymentPublicBetaBlockedActions.includes('tester_invite') &&
      weekTwoDeploymentPublicBetaBlockedActions.includes('public_beta_flip') &&
      weekTwoDeploymentPublicBetaBlockedActions.includes('production_release') &&
      betaReadiness.body.week_two_deployment_public_beta_readiness.every((item) => item.no_external_account_login_attempted === true) &&
      betaReadiness.body.week_two_deployment_public_beta_readiness.every((item) => item.no_deploy_setting_change_attempted === true) &&
      betaReadiness.body.week_two_deployment_public_beta_readiness.every((item) => item.no_supabase_redirect_change_attempted === true) &&
      betaReadiness.body.week_two_deployment_public_beta_readiness.every((item) => item.no_public_url_share_attempted === true) &&
      betaReadiness.body.week_two_deployment_public_beta_readiness.every((item) => item.no_tester_invite_attempted === true) &&
      betaReadiness.body.week_two_deployment_public_beta_readiness.every((item) => item.no_public_beta_flip_attempted === true) &&
      betaReadiness.body.week_two_deployment_public_beta_readiness.every((item) => item.no_live_action_attempted === true),
    'Beta readiness Week 2 deployment/public beta readiness must expose deploy target, URL smoke, Supabase redirect/env, invite gate, and no-live boundaries'
  );
  assert(
    Array.isArray(betaReadiness.body?.week_two_deployment_public_beta_execution_checklist),
    'Beta readiness must return week_two_deployment_public_beta_execution_checklist array'
  );
  const weekTwoDeploymentPublicBetaExecutionIds =
    betaReadiness.body.week_two_deployment_public_beta_execution_checklist.map((item) => item.id);
  const weekTwoDeploymentPublicBetaExecutionStates =
    betaReadiness.body.week_two_deployment_public_beta_execution_checklist.map((item) => item.readiness_state);
  const weekTwoDeploymentPublicBetaExecutionPhases =
    betaReadiness.body.week_two_deployment_public_beta_execution_checklist.map((item) => item.execution_phase);
  const weekTwoDeploymentPublicBetaExecutionBlockedActions =
    betaReadiness.body.week_two_deployment_public_beta_execution_checklist.flatMap((item) =>
      Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
    );
  assert(
    weekTwoDeploymentPublicBetaExecutionIds.includes('week_two_deployment_account_report_back_intake') &&
      weekTwoDeploymentPublicBetaExecutionIds.includes('week_two_public_url_smoke_report_back_intake') &&
      weekTwoDeploymentPublicBetaExecutionIds.includes('week_two_public_beta_invite_request_hold') &&
      weekTwoDeploymentPublicBetaExecutionIds.includes('week_two_supabase_redirect_env_change_hold') &&
      weekTwoDeploymentPublicBetaExecutionStates.includes('DEPLOYMENT_ACCOUNT_REPORT_BACK_REQUIRED') &&
      weekTwoDeploymentPublicBetaExecutionStates.includes('PUBLIC_URL_SMOKE_EVIDENCE_REQUIRED_URL_PRIVATE') &&
      weekTwoDeploymentPublicBetaExecutionStates.includes('PUBLIC_BETA_INVITE_REQUEST_HELD') &&
      weekTwoDeploymentPublicBetaExecutionStates.includes('SUPABASE_REDIRECT_ENV_CHANGE_HELD') &&
      weekTwoDeploymentPublicBetaExecutionPhases.includes('deployment_account_report_back') &&
      weekTwoDeploymentPublicBetaExecutionPhases.includes('public_url_smoke_report_back') &&
      weekTwoDeploymentPublicBetaExecutionPhases.includes('invite_request_hold') &&
      weekTwoDeploymentPublicBetaExecutionPhases.includes('supabase_redirect_env_hold') &&
      weekTwoDeploymentPublicBetaExecutionBlockedActions.includes('external_account_session_storage') &&
      weekTwoDeploymentPublicBetaExecutionBlockedActions.includes('supabase_project_setting_change') &&
      weekTwoDeploymentPublicBetaExecutionBlockedActions.includes('real_public_url_storage') &&
      weekTwoDeploymentPublicBetaExecutionBlockedActions.includes('public_url_share') &&
      weekTwoDeploymentPublicBetaExecutionBlockedActions.includes('tester_invite') &&
      weekTwoDeploymentPublicBetaExecutionBlockedActions.includes('public_beta_flip') &&
      weekTwoDeploymentPublicBetaExecutionBlockedActions.includes('live_supabase_write') &&
      weekTwoDeploymentPublicBetaExecutionBlockedActions.includes('xpr_signature') &&
      betaReadiness.body.week_two_deployment_public_beta_execution_checklist.every(
        (item) => item.no_external_account_session_storage_attempted === true
      ) &&
      betaReadiness.body.week_two_deployment_public_beta_execution_checklist.every(
        (item) => item.no_real_public_url_storage_attempted === true
      ) &&
      betaReadiness.body.week_two_deployment_public_beta_execution_checklist.every(
        (item) => item.no_public_url_share_attempted === true
      ) &&
      betaReadiness.body.week_two_deployment_public_beta_execution_checklist.every(
        (item) => item.no_tester_invite_attempted === true
      ) &&
      betaReadiness.body.week_two_deployment_public_beta_execution_checklist.every(
        (item) => item.no_live_supabase_write_attempted === true
      ) &&
      betaReadiness.body.week_two_deployment_public_beta_execution_checklist.every(
        (item) => item.no_xpr_signature_attempted === true
      ) &&
      betaReadiness.body.week_two_deployment_public_beta_execution_checklist.every(
        (item) => item.no_live_action_attempted === true
      ),
    'Beta readiness Week 2 deployment/public beta execution checklist must expose account report-back, URL smoke, invite hold, Supabase env hold, and no-live boundaries'
  );
  assert(
    Array.isArray(betaReadiness.body?.week_two_mobile_release_readiness),
    'Beta readiness must return week_two_mobile_release_readiness array'
  );
  const weekTwoMobileReleaseReadinessIds = betaReadiness.body.week_two_mobile_release_readiness.map((item) => item.id);
  const weekTwoMobileReleaseReadinessStates = betaReadiness.body.week_two_mobile_release_readiness.map((item) => item.readiness_state);
  const weekTwoMobileReleaseReadinessAreas = betaReadiness.body.week_two_mobile_release_readiness.map((item) => item.readiness_area);
  const weekTwoMobileReleaseBlockedActions = betaReadiness.body.week_two_mobile_release_readiness.flatMap((item) =>
    Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
  );
  assert(
    weekTwoMobileReleaseReadinessIds.includes('week_two_pwa_install_offline_recheck') &&
      weekTwoMobileReleaseReadinessIds.includes('week_two_android_debug_qa_blocker_recheck') &&
      weekTwoMobileReleaseReadinessIds.includes('week_two_ios_store_signing_blocker_recheck') &&
      weekTwoMobileReleaseReadinessIds.includes('week_two_mobile_release_decision_stop_gate') &&
      weekTwoMobileReleaseReadinessStates.includes('PWA_INSTALL_OFFLINE_RECHECK_REQUIRED') &&
      weekTwoMobileReleaseReadinessStates.includes('ANDROID_DEBUG_QA_RECHECK_REQUIRED') &&
      weekTwoMobileReleaseReadinessStates.includes('IOS_STORE_SIGNING_BLOCKED_FOUNDER_ACCOUNT_REQUIRED') &&
      weekTwoMobileReleaseReadinessStates.includes('MOBILE_RELEASE_DECISION_BLOCKED') &&
      weekTwoMobileReleaseReadinessAreas.includes('pwa_install_offline') &&
      weekTwoMobileReleaseReadinessAreas.includes('android_debug_qa') &&
      weekTwoMobileReleaseReadinessAreas.includes('ios_store_signing') &&
      weekTwoMobileReleaseReadinessAreas.includes('mobile_release_decision') &&
      betaReadiness.body.week_two_mobile_release_readiness.some((item) => item.required_phrase === 'MOBILE_RELEASE_DECISION_RECORDED') &&
      weekTwoMobileReleaseBlockedActions.includes('app_store_submission') &&
      weekTwoMobileReleaseBlockedActions.includes('play_console_submission') &&
      weekTwoMobileReleaseBlockedActions.includes('testflight_submission') &&
      weekTwoMobileReleaseBlockedActions.includes('play_testing_release') &&
      weekTwoMobileReleaseBlockedActions.includes('signing_key_upload') &&
      weekTwoMobileReleaseBlockedActions.includes('certificate_upload') &&
      weekTwoMobileReleaseBlockedActions.includes('provisioning_profile_upload') &&
      weekTwoMobileReleaseBlockedActions.includes('keystore_upload') &&
      weekTwoMobileReleaseBlockedActions.includes('public_release') &&
      weekTwoMobileReleaseBlockedActions.includes('real_payment') &&
      weekTwoMobileReleaseBlockedActions.includes('real_loan') &&
      weekTwoMobileReleaseBlockedActions.includes('real_escrow') &&
      weekTwoMobileReleaseBlockedActions.includes('stablecoin_settlement') &&
      weekTwoMobileReleaseBlockedActions.includes('token_collateral_lock') &&
      weekTwoMobileReleaseBlockedActions.includes('xpr_signature') &&
      weekTwoMobileReleaseBlockedActions.includes('production_release') &&
      betaReadiness.body.week_two_mobile_release_readiness.every((item) => item.no_secret_requested === true) &&
      betaReadiness.body.week_two_mobile_release_readiness.every((item) => item.no_external_account_login_attempted === true) &&
      betaReadiness.body.week_two_mobile_release_readiness.every((item) => item.no_app_store_submission_attempted === true) &&
      betaReadiness.body.week_two_mobile_release_readiness.every((item) => item.no_play_console_submission_attempted === true) &&
      betaReadiness.body.week_two_mobile_release_readiness.every((item) => item.no_testflight_submission_attempted === true) &&
      betaReadiness.body.week_two_mobile_release_readiness.every((item) => item.no_play_testing_release_attempted === true) &&
      betaReadiness.body.week_two_mobile_release_readiness.every((item) => item.no_signing_key_upload_attempted === true) &&
      betaReadiness.body.week_two_mobile_release_readiness.every((item) => item.no_certificate_upload_attempted === true) &&
      betaReadiness.body.week_two_mobile_release_readiness.every((item) => item.no_provisioning_profile_upload_attempted === true) &&
      betaReadiness.body.week_two_mobile_release_readiness.every((item) => item.no_keystore_upload_attempted === true) &&
      betaReadiness.body.week_two_mobile_release_readiness.every((item) => item.no_public_release_attempted === true) &&
      betaReadiness.body.week_two_mobile_release_readiness.every((item) => item.no_live_finance_action_attempted === true) &&
      betaReadiness.body.week_two_mobile_release_readiness.every((item) => item.no_xpr_signature_attempted === true) &&
      betaReadiness.body.week_two_mobile_release_readiness.every((item) => item.no_live_action_attempted === true),
    'Beta readiness Week 2 mobile release readiness must expose PWA, Android, iOS, release-decision gates and no-store/no-signing/no-finance/no-XPR/no-live boundaries'
  );
  assert(
    Array.isArray(betaReadiness.body?.week_two_mobile_release_execution_checklist),
    'Beta readiness must return week_two_mobile_release_execution_checklist array'
  );
  const weekTwoMobileReleaseExecutionChecklistIds =
    betaReadiness.body.week_two_mobile_release_execution_checklist.map((item) => item.id);
  const weekTwoMobileReleaseExecutionChecklistStates =
    betaReadiness.body.week_two_mobile_release_execution_checklist.map((item) => item.readiness_state);
  const weekTwoMobileReleaseExecutionChecklistPhases =
    betaReadiness.body.week_two_mobile_release_execution_checklist.map((item) => item.execution_phase);
  const weekTwoMobileReleaseExecutionBlockedActions =
    betaReadiness.body.week_two_mobile_release_execution_checklist.flatMap((item) =>
      Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
    );
  assert(
    weekTwoMobileReleaseExecutionChecklistIds.includes('week_two_mobile_pwa_install_report_back_intake') &&
      weekTwoMobileReleaseExecutionChecklistIds.includes('week_two_android_debug_qa_report_back_intake') &&
      weekTwoMobileReleaseExecutionChecklistIds.includes('week_two_ios_store_signing_request_hold') &&
      weekTwoMobileReleaseExecutionChecklistIds.includes('week_two_mobile_release_decision_hold') &&
      weekTwoMobileReleaseExecutionChecklistStates.includes('PWA_INSTALL_REPORT_BACK_REQUIRED') &&
      weekTwoMobileReleaseExecutionChecklistStates.includes('ANDROID_DEBUG_QA_REPORT_BACK_REQUIRED') &&
      weekTwoMobileReleaseExecutionChecklistStates.includes('IOS_STORE_SIGNING_REQUEST_HELD') &&
      weekTwoMobileReleaseExecutionChecklistStates.includes('MOBILE_RELEASE_DECISION_HELD') &&
      weekTwoMobileReleaseExecutionChecklistPhases.includes('pwa_install_report_back') &&
      weekTwoMobileReleaseExecutionChecklistPhases.includes('android_debug_qa_report_back') &&
      weekTwoMobileReleaseExecutionChecklistPhases.includes('ios_store_signing_hold') &&
      weekTwoMobileReleaseExecutionChecklistPhases.includes('mobile_release_decision_hold') &&
      betaReadiness.body.week_two_mobile_release_execution_checklist.some(
        (item) => item.required_phrase === 'MOBILE_RELEASE_DECISION_RECORDED'
      ) &&
      weekTwoMobileReleaseExecutionBlockedActions.includes('app_store_connect_login') &&
      weekTwoMobileReleaseExecutionBlockedActions.includes('play_console_login') &&
      weekTwoMobileReleaseExecutionBlockedActions.includes('testflight_submission') &&
      weekTwoMobileReleaseExecutionBlockedActions.includes('play_testing_release') &&
      weekTwoMobileReleaseExecutionBlockedActions.includes('signing_key_upload') &&
      weekTwoMobileReleaseExecutionBlockedActions.includes('device_identifier_storage') &&
      weekTwoMobileReleaseExecutionBlockedActions.includes('public_release') &&
      weekTwoMobileReleaseExecutionBlockedActions.includes('live_supabase_write') &&
      weekTwoMobileReleaseExecutionBlockedActions.includes('payment_or_loan_action') &&
      weekTwoMobileReleaseExecutionBlockedActions.includes('stablecoin_settlement') &&
      weekTwoMobileReleaseExecutionBlockedActions.includes('token_collateral_lock') &&
      weekTwoMobileReleaseExecutionBlockedActions.includes('xpr_signature') &&
      weekTwoMobileReleaseExecutionBlockedActions.includes('production_release') &&
      betaReadiness.body.week_two_mobile_release_execution_checklist.every((item) => item.no_secret_requested === true) &&
      betaReadiness.body.week_two_mobile_release_execution_checklist.every(
        (item) => item.no_external_account_session_storage_attempted === true
      ) &&
      betaReadiness.body.week_two_mobile_release_execution_checklist.every(
        (item) => item.no_app_store_submission_attempted === true
      ) &&
      betaReadiness.body.week_two_mobile_release_execution_checklist.every(
        (item) => item.no_play_console_submission_attempted === true
      ) &&
      betaReadiness.body.week_two_mobile_release_execution_checklist.every(
        (item) => item.no_signing_key_upload_attempted === true
      ) &&
      betaReadiness.body.week_two_mobile_release_execution_checklist.every(
        (item) => item.no_device_identifier_storage_attempted === true
      ) &&
      betaReadiness.body.week_two_mobile_release_execution_checklist.every((item) => item.no_public_release_attempted === true) &&
      betaReadiness.body.week_two_mobile_release_execution_checklist.every((item) => item.no_xpr_signature_attempted === true) &&
      betaReadiness.body.week_two_mobile_release_execution_checklist.every((item) => item.no_live_action_attempted === true),
    'Beta readiness Week 2 mobile release execution checklist must expose report-back/hold gates and no-store/no-signing/no-device/no-public/no-XPR/no-live boundaries'
  );
  assert(
    Array.isArray(betaReadiness.body?.legal_provider_next_step_readiness),
    'Beta readiness must return legal_provider_next_step_readiness array'
  );
  const legalProviderNextStepIds = betaReadiness.body.legal_provider_next_step_readiness.map((item) => item.id);
  const legalProviderNextStepStates = betaReadiness.body.legal_provider_next_step_readiness.map((item) => item.readiness_state);
  const legalProviderNextStepAreas = betaReadiness.body.legal_provider_next_step_readiness.map((item) => item.review_area);
  const legalProviderNextStepBlockedActions = betaReadiness.body.legal_provider_next_step_readiness.flatMap((item) =>
    Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
  );
  assert(
    legalProviderNextStepIds.includes('working_capital_legal_provider_question_prep') &&
      legalProviderNextStepIds.includes('escrow_payment_provider_question_prep') &&
      legalProviderNextStepIds.includes('claimbridge_advance_provider_question_prep') &&
      legalProviderNextStepIds.includes('token_collateral_security_legal_question_prep') &&
      legalProviderNextStepStates.includes('BLOCKED_FOR_EXTERNAL_LEGAL_PROVIDER_REVIEW') &&
      legalProviderNextStepStates.includes('BLOCKED_FOR_ESCROW_PAYMENT_PROVIDER_REVIEW') &&
      legalProviderNextStepStates.includes('BLOCKED_FOR_ADVANCE_PROVIDER_REVIEW') &&
      legalProviderNextStepStates.includes('BLOCKED_FOR_TOKEN_COLLATERAL_REVIEW') &&
      legalProviderNextStepAreas.includes('working_capital') &&
      legalProviderNextStepAreas.includes('escrow_payment') &&
      legalProviderNextStepAreas.includes('claimbridge_advance') &&
      legalProviderNextStepAreas.includes('token_collateral') &&
      legalProviderNextStepBlockedActions.includes('legal_conclusion') &&
      legalProviderNextStepBlockedActions.includes('provider_commitment') &&
      legalProviderNextStepBlockedActions.includes('real_payment') &&
      legalProviderNextStepBlockedActions.includes('real_loan') &&
      legalProviderNextStepBlockedActions.includes('real_escrow') &&
      legalProviderNextStepBlockedActions.includes('repayment_routing') &&
      legalProviderNextStepBlockedActions.includes('stablecoin_settlement') &&
      legalProviderNextStepBlockedActions.includes('token_collateral_lock') &&
      legalProviderNextStepBlockedActions.includes('xpr_signature') &&
      betaReadiness.body.legal_provider_next_step_readiness.every((item) => item.no_secret_requested === true) &&
      betaReadiness.body.legal_provider_next_step_readiness.every((item) => item.no_external_send_attempted === true) &&
      betaReadiness.body.legal_provider_next_step_readiness.every((item) => item.no_provider_commitment_attempted === true) &&
      betaReadiness.body.legal_provider_next_step_readiness.every((item) => item.no_legal_decision_attempted === true) &&
      betaReadiness.body.legal_provider_next_step_readiness.every((item) => item.no_live_finance_action_attempted === true) &&
      betaReadiness.body.legal_provider_next_step_readiness.every((item) => item.no_xpr_signature_attempted === true) &&
      betaReadiness.body.legal_provider_next_step_readiness.every((item) => item.no_live_action_attempted === true),
    'Beta readiness legal/provider next-step readiness must expose question-prep areas and no-legal/no-provider/no-finance/no-XPR/no-live boundaries'
  );
  assert(
    Array.isArray(betaReadiness.body?.week_two_legal_provider_readiness),
    'Beta readiness must return week_two_legal_provider_readiness array'
  );
  const weekTwoLegalProviderIds = betaReadiness.body.week_two_legal_provider_readiness.map((item) => item.id);
  const weekTwoLegalProviderStates = betaReadiness.body.week_two_legal_provider_readiness.map((item) => item.readiness_state);
  const weekTwoLegalProviderPhases = betaReadiness.body.week_two_legal_provider_readiness.map((item) => item.checklist_phase);
  const weekTwoLegalProviderAreas = betaReadiness.body.week_two_legal_provider_readiness.map((item) => item.review_area);
  const weekTwoLegalProviderBlockedActions = betaReadiness.body.week_two_legal_provider_readiness.flatMap((item) =>
    Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
  );
  assert(
    weekTwoLegalProviderIds.includes('week_two_working_capital_review_question_checklist') &&
      weekTwoLegalProviderIds.includes('week_two_escrow_payment_review_question_checklist') &&
      weekTwoLegalProviderIds.includes('week_two_claimbridge_advance_review_question_checklist') &&
      weekTwoLegalProviderIds.includes('week_two_token_collateral_review_question_checklist') &&
      weekTwoLegalProviderStates.includes('WORKING_CAPITAL_PROVIDER_QUESTIONS_READY_REVIEW_REQUIRED') &&
      weekTwoLegalProviderStates.includes('ESCROW_PAYMENT_PROVIDER_QUESTIONS_READY_REVIEW_REQUIRED') &&
      weekTwoLegalProviderStates.includes('CLAIMBRIDGE_ADVANCE_PROVIDER_QUESTIONS_READY_REVIEW_REQUIRED') &&
      weekTwoLegalProviderStates.includes('TOKEN_COLLATERAL_SECURITY_LEGAL_QUESTIONS_READY_REVIEW_REQUIRED') &&
      weekTwoLegalProviderPhases.includes('working_capital_question_review') &&
      weekTwoLegalProviderPhases.includes('escrow_payment_question_review') &&
      weekTwoLegalProviderPhases.includes('claimbridge_advance_question_review') &&
      weekTwoLegalProviderPhases.includes('token_collateral_question_review') &&
      weekTwoLegalProviderAreas.includes('working_capital') &&
      weekTwoLegalProviderAreas.includes('escrow_payment') &&
      weekTwoLegalProviderAreas.includes('claimbridge_advance') &&
      weekTwoLegalProviderAreas.includes('token_collateral') &&
      weekTwoLegalProviderBlockedActions.includes('provider_submission') &&
      weekTwoLegalProviderBlockedActions.includes('external_send') &&
      weekTwoLegalProviderBlockedActions.includes('real_payment') &&
      weekTwoLegalProviderBlockedActions.includes('real_loan') &&
      weekTwoLegalProviderBlockedActions.includes('real_escrow') &&
      weekTwoLegalProviderBlockedActions.includes('repayment_routing') &&
      weekTwoLegalProviderBlockedActions.includes('stablecoin_settlement') &&
      weekTwoLegalProviderBlockedActions.includes('token_collateral_lock') &&
      weekTwoLegalProviderBlockedActions.includes('token_custody') &&
      weekTwoLegalProviderBlockedActions.includes('smart_contract_deployment') &&
      weekTwoLegalProviderBlockedActions.includes('xpr_signature') &&
      weekTwoLegalProviderBlockedActions.includes('public_claim_approval') &&
      betaReadiness.body.week_two_legal_provider_readiness.every((item) => item.no_secret_requested === true) &&
      betaReadiness.body.week_two_legal_provider_readiness.every((item) => item.no_external_send_attempted === true) &&
      betaReadiness.body.week_two_legal_provider_readiness.every((item) => item.no_provider_submission_attempted === true) &&
      betaReadiness.body.week_two_legal_provider_readiness.every((item) => item.no_provider_commitment_attempted === true) &&
      betaReadiness.body.week_two_legal_provider_readiness.every((item) => item.no_legal_decision_attempted === true) &&
      betaReadiness.body.week_two_legal_provider_readiness.every((item) => item.no_live_finance_action_attempted === true) &&
      betaReadiness.body.week_two_legal_provider_readiness.every((item) => item.no_xpr_signature_attempted === true) &&
      betaReadiness.body.week_two_legal_provider_readiness.every((item) => item.no_smart_contract_deployment_attempted === true) &&
      betaReadiness.body.week_two_legal_provider_readiness.every((item) => item.no_public_claim_approval_attempted === true) &&
      betaReadiness.body.week_two_legal_provider_readiness.every((item) => item.no_live_action_attempted === true),
    'Beta readiness Week 2 legal/provider readiness must expose question checklist phases and no-legal/no-provider/no-finance/no-XPR/no-live boundaries'
  );
  assert(
    Array.isArray(betaReadiness.body?.week_two_legal_provider_execution_checklist),
    'Beta readiness must return week_two_legal_provider_execution_checklist array'
  );
  const weekTwoLegalProviderExecutionChecklistIds =
    betaReadiness.body.week_two_legal_provider_execution_checklist.map((item) => item.id);
  const weekTwoLegalProviderExecutionChecklistStates =
    betaReadiness.body.week_two_legal_provider_execution_checklist.map((item) => item.readiness_state);
  const weekTwoLegalProviderExecutionChecklistPhases =
    betaReadiness.body.week_two_legal_provider_execution_checklist.map((item) => item.execution_phase);
  const weekTwoLegalProviderExecutionChecklistAreas =
    betaReadiness.body.week_two_legal_provider_execution_checklist.map((item) => item.review_area);
  const weekTwoLegalProviderExecutionBlockedActions =
    betaReadiness.body.week_two_legal_provider_execution_checklist.flatMap((item) =>
      Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
    );
  assert(
    weekTwoLegalProviderExecutionChecklistIds.includes(
      'week_two_legal_provider_question_packet_report_back_intake'
    ) &&
      weekTwoLegalProviderExecutionChecklistIds.includes('week_two_provider_response_summary_hold') &&
      weekTwoLegalProviderExecutionChecklistIds.includes('week_two_finance_escrow_live_action_request_hold') &&
      weekTwoLegalProviderExecutionChecklistIds.includes('week_two_public_claim_legal_wording_decision_hold') &&
      weekTwoLegalProviderExecutionChecklistStates.includes('QUESTION_PACKET_REPORT_BACK_REQUIRED') &&
      weekTwoLegalProviderExecutionChecklistStates.includes('PROVIDER_RESPONSE_SUMMARY_HELD') &&
      weekTwoLegalProviderExecutionChecklistStates.includes('FINANCE_ESCROW_LIVE_ACTION_REQUEST_HELD') &&
      weekTwoLegalProviderExecutionChecklistStates.includes('PUBLIC_CLAIM_LEGAL_WORDING_DECISION_HELD') &&
      weekTwoLegalProviderExecutionChecklistPhases.includes('question_packet_report_back') &&
      weekTwoLegalProviderExecutionChecklistPhases.includes('provider_response_summary_hold') &&
      weekTwoLegalProviderExecutionChecklistPhases.includes('finance_escrow_live_action_hold') &&
      weekTwoLegalProviderExecutionChecklistPhases.includes('public_claim_legal_wording_hold') &&
      weekTwoLegalProviderExecutionChecklistAreas.includes('question_packet') &&
      weekTwoLegalProviderExecutionChecklistAreas.includes('provider_response') &&
      weekTwoLegalProviderExecutionChecklistAreas.includes('finance_escrow_live_action') &&
      weekTwoLegalProviderExecutionChecklistAreas.includes('public_claim_wording') &&
      betaReadiness.body.week_two_legal_provider_execution_checklist.some(
        (item) => item.required_phrase === 'LEGAL_PROVIDER_EXECUTION_DECISION_RECORDED'
      ) &&
      weekTwoLegalProviderExecutionBlockedActions.includes('external_send') &&
      weekTwoLegalProviderExecutionBlockedActions.includes('provider_submission') &&
      weekTwoLegalProviderExecutionBlockedActions.includes('reviewer_response_storage') &&
      weekTwoLegalProviderExecutionBlockedActions.includes('raw_legal_advice_storage') &&
      weekTwoLegalProviderExecutionBlockedActions.includes('legal_conclusion') &&
      weekTwoLegalProviderExecutionBlockedActions.includes('provider_commitment') &&
      weekTwoLegalProviderExecutionBlockedActions.includes('real_payment') &&
      weekTwoLegalProviderExecutionBlockedActions.includes('real_loan') &&
      weekTwoLegalProviderExecutionBlockedActions.includes('real_escrow') &&
      weekTwoLegalProviderExecutionBlockedActions.includes('repayment_routing') &&
      weekTwoLegalProviderExecutionBlockedActions.includes('stablecoin_settlement') &&
      weekTwoLegalProviderExecutionBlockedActions.includes('token_collateral_lock') &&
      weekTwoLegalProviderExecutionBlockedActions.includes('token_custody') &&
      weekTwoLegalProviderExecutionBlockedActions.includes('smart_contract_deployment') &&
      weekTwoLegalProviderExecutionBlockedActions.includes('xpr_signature') &&
      weekTwoLegalProviderExecutionBlockedActions.includes('public_claim_approval') &&
      betaReadiness.body.week_two_legal_provider_execution_checklist.every((item) => item.no_secret_requested === true) &&
      betaReadiness.body.week_two_legal_provider_execution_checklist.every(
        (item) => item.no_external_send_attempted === true
      ) &&
      betaReadiness.body.week_two_legal_provider_execution_checklist.every(
        (item) => item.no_provider_submission_attempted === true
      ) &&
      betaReadiness.body.week_two_legal_provider_execution_checklist.every(
        (item) => item.no_provider_commitment_attempted === true
      ) &&
      betaReadiness.body.week_two_legal_provider_execution_checklist.every(
        (item) => item.no_raw_reviewer_response_stored === true
      ) &&
      betaReadiness.body.week_two_legal_provider_execution_checklist.every(
        (item) => item.no_attorney_advice_stored === true
      ) &&
      betaReadiness.body.week_two_legal_provider_execution_checklist.every(
        (item) => item.no_legal_conclusion_recorded === true
      ) &&
      betaReadiness.body.week_two_legal_provider_execution_checklist.every(
        (item) => item.no_live_finance_action_attempted === true
      ) &&
      betaReadiness.body.week_two_legal_provider_execution_checklist.every(
        (item) => item.no_xpr_signature_attempted === true
      ) &&
      betaReadiness.body.week_two_legal_provider_execution_checklist.every(
        (item) => item.no_smart_contract_deployment_attempted === true
      ) &&
      betaReadiness.body.week_two_legal_provider_execution_checklist.every(
        (item) => item.no_public_claim_approval_attempted === true
      ) &&
      betaReadiness.body.week_two_legal_provider_execution_checklist.every((item) => item.no_live_action_attempted === true),
    'Beta readiness Week 2 legal/provider execution checklist must expose report-back/hold phases and no-legal/no-provider/no-finance/no-XPR/no-live boundaries'
  );
  assert(
    Array.isArray(betaReadiness.body?.public_beta_next_step_readiness),
    'Beta readiness must return public_beta_next_step_readiness array'
  );
  const publicBetaNextStepIds = betaReadiness.body.public_beta_next_step_readiness.map((item) => item.id);
  const publicBetaNextStepStates = betaReadiness.body.public_beta_next_step_readiness.map((item) => item.readiness_state);
  const publicBetaNextStepAreas = betaReadiness.body.public_beta_next_step_readiness.map((item) => item.review_area);
  const publicBetaNextStepBlockedActions = betaReadiness.body.public_beta_next_step_readiness.flatMap((item) =>
    Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
  );
  assert(
    publicBetaNextStepIds.includes('public_beta_scope_decision_review') &&
      publicBetaNextStepIds.includes('public_beta_url_smoke_evidence_review') &&
      publicBetaNextStepIds.includes('public_beta_invite_approval_stop_gate') &&
      publicBetaNextStepIds.includes('public_beta_support_triage_readiness') &&
      publicBetaNextStepStates.includes('BLOCKED_UNTIL_PUBLIC_BETA_SCOPE_REVIEW') &&
      publicBetaNextStepStates.includes('URL_PENDING_FOUNDER_DEPLOYMENT_REQUIRED') &&
      publicBetaNextStepStates.includes('BLOCKED_UNTIL_PUBLIC_BETA_INVITE_ACTION_RECORDED') &&
      publicBetaNextStepStates.includes('LOCAL_SUPPORT_TRIAGE_READY_REVIEW') &&
      publicBetaNextStepAreas.includes('scope') &&
      publicBetaNextStepAreas.includes('url_smoke') &&
      publicBetaNextStepAreas.includes('invite_approval') &&
      publicBetaNextStepAreas.includes('support_triage') &&
      publicBetaNextStepBlockedActions.includes('public_beta_launch') &&
      publicBetaNextStepBlockedActions.includes('real_public_url_in_repo') &&
      publicBetaNextStepBlockedActions.includes('public_url_share') &&
      publicBetaNextStepBlockedActions.includes('tester_invite') &&
      publicBetaNextStepBlockedActions.includes('external_send') &&
      publicBetaNextStepBlockedActions.includes('production_release') &&
      publicBetaNextStepBlockedActions.includes('payment_or_loan_action') &&
      publicBetaNextStepBlockedActions.includes('legal_or_provider_decision') &&
      betaReadiness.body.public_beta_next_step_readiness.every((item) => item.no_secret_requested === true) &&
      betaReadiness.body.public_beta_next_step_readiness.every((item) => item.no_external_send_attempted === true) &&
      betaReadiness.body.public_beta_next_step_readiness.every((item) => item.no_public_url_share_attempted === true) &&
      betaReadiness.body.public_beta_next_step_readiness.every((item) => item.no_tester_invite_attempted === true) &&
      betaReadiness.body.public_beta_next_step_readiness.every((item) => item.no_deploy_setting_change_attempted === true) &&
      betaReadiness.body.public_beta_next_step_readiness.every((item) => item.no_supabase_redirect_change_attempted === true) &&
      betaReadiness.body.public_beta_next_step_readiness.every((item) => item.no_live_finance_action_attempted === true) &&
      betaReadiness.body.public_beta_next_step_readiness.every((item) => item.no_legal_provider_decision_attempted === true) &&
      betaReadiness.body.public_beta_next_step_readiness.every((item) => item.no_production_release_attempted === true) &&
      betaReadiness.body.public_beta_next_step_readiness.every((item) => item.no_live_action_attempted === true),
    'Beta readiness public beta next-step readiness must expose scope, URL smoke, invite approval, support triage, and no-share/no-invite/no-live boundaries'
  );
  assert(
    Array.isArray(betaReadiness.body?.public_beta_next_step_execution_checklist),
    'Beta readiness must return public_beta_next_step_execution_checklist array'
  );
  const publicBetaExecutionIds = betaReadiness.body.public_beta_next_step_execution_checklist.map((item) => item.id);
  const publicBetaExecutionStates = betaReadiness.body.public_beta_next_step_execution_checklist.map(
    (item) => item.readiness_state
  );
  const publicBetaExecutionPhases = betaReadiness.body.public_beta_next_step_execution_checklist.map(
    (item) => item.execution_phase
  );
  const publicBetaExecutionAreas = betaReadiness.body.public_beta_next_step_execution_checklist.map(
    (item) => item.review_area
  );
  const publicBetaExecutionBlockedActions = betaReadiness.body.public_beta_next_step_execution_checklist.flatMap((item) =>
    Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
  );
  assert(
    publicBetaExecutionIds.includes('public_beta_scope_report_back_intake') &&
      publicBetaExecutionIds.includes('public_beta_url_smoke_report_back_intake') &&
      publicBetaExecutionIds.includes('public_beta_invite_request_hold') &&
      publicBetaExecutionIds.includes('public_beta_support_triage_hold') &&
      publicBetaExecutionStates.includes('PUBLIC_BETA_SCOPE_REPORT_BACK_REQUIRED') &&
      publicBetaExecutionStates.includes('PUBLIC_BETA_URL_SMOKE_REPORT_BACK_REQUIRED') &&
      publicBetaExecutionStates.includes('PUBLIC_BETA_INVITE_REQUEST_HELD') &&
      publicBetaExecutionStates.includes('PUBLIC_BETA_SUPPORT_TRIAGE_HELD') &&
      publicBetaExecutionPhases.includes('scope_report_back') &&
      publicBetaExecutionPhases.includes('url_smoke_report_back') &&
      publicBetaExecutionPhases.includes('invite_request_hold') &&
      publicBetaExecutionPhases.includes('support_triage_hold') &&
      publicBetaExecutionAreas.includes('scope') &&
      publicBetaExecutionAreas.includes('url_smoke') &&
      publicBetaExecutionAreas.includes('invite') &&
      publicBetaExecutionAreas.includes('support_triage') &&
      publicBetaExecutionBlockedActions.includes('public_beta_launch') &&
      publicBetaExecutionBlockedActions.includes('real_public_url_storage') &&
      publicBetaExecutionBlockedActions.includes('public_url_share') &&
      publicBetaExecutionBlockedActions.includes('tester_invite') &&
      publicBetaExecutionBlockedActions.includes('external_send') &&
      publicBetaExecutionBlockedActions.includes('sensitive_data_collection') &&
      publicBetaExecutionBlockedActions.includes('live_supabase_write') &&
      publicBetaExecutionBlockedActions.includes('payment_or_loan_action') &&
      publicBetaExecutionBlockedActions.includes('xpr_signature') &&
      publicBetaExecutionBlockedActions.includes('legal_or_provider_decision') &&
      betaReadiness.body.public_beta_next_step_execution_checklist.every((item) => item.no_secret_requested === true) &&
      betaReadiness.body.public_beta_next_step_execution_checklist.every((item) => item.no_external_send_attempted === true) &&
      betaReadiness.body.public_beta_next_step_execution_checklist.every((item) => item.no_public_url_share_attempted === true) &&
      betaReadiness.body.public_beta_next_step_execution_checklist.every((item) => item.no_tester_invite_attempted === true) &&
      betaReadiness.body.public_beta_next_step_execution_checklist.every((item) => item.no_sensitive_data_collection_attempted === true) &&
      betaReadiness.body.public_beta_next_step_execution_checklist.every((item) => item.no_deploy_setting_change_attempted === true) &&
      betaReadiness.body.public_beta_next_step_execution_checklist.every((item) => item.no_supabase_redirect_change_attempted === true) &&
      betaReadiness.body.public_beta_next_step_execution_checklist.every((item) => item.no_live_supabase_write_attempted === true) &&
      betaReadiness.body.public_beta_next_step_execution_checklist.every((item) => item.no_live_finance_action_attempted === true) &&
      betaReadiness.body.public_beta_next_step_execution_checklist.every((item) => item.no_xpr_signature_attempted === true) &&
      betaReadiness.body.public_beta_next_step_execution_checklist.every((item) => item.no_legal_provider_decision_attempted === true) &&
      betaReadiness.body.public_beta_next_step_execution_checklist.every((item) => item.no_production_release_attempted === true) &&
      betaReadiness.body.public_beta_next_step_execution_checklist.every((item) => item.no_live_action_attempted === true),
    'Beta readiness public beta next-step execution checklist must expose report-back/hold phases and no-launch/no-share/no-invite/no-live boundaries'
  );

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
  assert(
    betaReadiness.body?.homepage_publication_review_packet?.id === 'homepage_publication_review_packet' &&
      betaReadiness.body.homepage_publication_review_packet.label === 'Homepage publication review packet' &&
      betaReadiness.body.homepage_publication_review_packet.packet_state === 'LOCAL_REVIEW_ONLY' &&
      betaReadiness.body.homepage_publication_review_packet.safe_public_promise?.includes('Construction trust infrastructure for verified project records') &&
      betaReadiness.body.homepage_publication_review_packet.required_decisions?.some((item) =>
        item.includes('Standalone PUBLICATION_GO before any public index.html replacement')
      ) &&
      betaReadiness.body.homepage_publication_review_packet.blocked_public_claims?.includes('Metallicus/LOAN partnership approved') &&
      betaReadiness.body.homepage_publication_review_packet.blocked_live_actions?.includes('public_homepage_replacement') &&
      betaReadiness.body.homepage_publication_review_packet.blocked_live_actions?.includes('public_whitepaper_edit') &&
      betaReadiness.body.homepage_publication_review_packet.blocked_live_actions?.includes('public_url_share') &&
      betaReadiness.body.homepage_publication_review_packet.blocked_live_actions?.includes('tester_invite') &&
      betaReadiness.body.homepage_publication_review_packet.no_public_homepage_edit_attempted === true &&
      betaReadiness.body.homepage_publication_review_packet.no_public_whitepaper_edit_attempted === true &&
      betaReadiness.body.homepage_publication_review_packet.no_deploy_setting_change_attempted === true &&
      betaReadiness.body.homepage_publication_review_packet.no_public_url_share_attempted === true &&
      betaReadiness.body.homepage_publication_review_packet.no_live_action_attempted === true,
    'Beta readiness homepage publication review packet must expose founder decisions, safe public promise, blocked public claims/actions, and no-public/no-deploy/no-live boundaries'
  );
  assert(
    Array.isArray(betaReadiness.body?.homepage_publication_founder_decision_script),
    'Beta readiness must return homepage_publication_founder_decision_script array'
  );
  const homepageDecisionScriptIds = betaReadiness.body.homepage_publication_founder_decision_script.map((item) => item.id);
  const homepageDecisionScriptPhrases = betaReadiness.body.homepage_publication_founder_decision_script.map((item) => item.exact_phrase || '');
  const homepageDecisionScriptDocs = betaReadiness.body.homepage_publication_founder_decision_script.flatMap((item) => item.source_docs || []);
  assert(
    homepageDecisionScriptIds.includes('approve_traditional_first_homepage_direction') &&
      homepageDecisionScriptIds.includes('approve_hidden_future_infrastructure_language') &&
      homepageDecisionScriptIds.includes('accept_local_browser_qa_evidence') &&
      homepageDecisionScriptIds.includes('choose_public_asset_policy') &&
      homepageDecisionScriptIds.includes('keep_public_replacement_on_hold') &&
      homepageDecisionScriptIds.includes('standalone_publication_go') &&
      homepageDecisionScriptPhrases.some((phrase) => phrase.includes('APPROVE_TRADITIONAL_FIRST_HOMEPAGE_DIRECTION')) &&
      homepageDecisionScriptPhrases.some((phrase) => phrase.includes('APPROVE_HIDDEN_FUTURE_INFRASTRUCTURE_LANGUAGE')) &&
      homepageDecisionScriptPhrases.some((phrase) => phrase.includes('ACCEPT_LOCAL_BROWSER_QA_EVIDENCE')) &&
      homepageDecisionScriptPhrases.some((phrase) => phrase.includes('REQUIRE_COMPILED_PUBLIC_CSS')) &&
      homepageDecisionScriptPhrases.some((phrase) => phrase.includes('KEEP_PUBLIC_REPLACEMENT_ON_HOLD')) &&
      homepageDecisionScriptPhrases.some((phrase) => phrase.includes('PUBLICATION_GO')) &&
      homepageDecisionScriptDocs.includes('docs/smartcontractor-public-homepage-asset-decision-packet-2026-06-03.md') &&
      betaReadiness.body.homepage_publication_founder_decision_script.every((item) => Array.isArray(item.what_it_allows)) &&
      betaReadiness.body.homepage_publication_founder_decision_script.every((item) => Array.isArray(item.what_it_does_not_allow)) &&
      betaReadiness.body.homepage_publication_founder_decision_script.every((item) => item.no_public_homepage_edit_attempted === true) &&
      betaReadiness.body.homepage_publication_founder_decision_script.every((item) => item.no_public_whitepaper_edit_attempted === true) &&
      betaReadiness.body.homepage_publication_founder_decision_script.every((item) => item.no_deploy_setting_change_attempted === true) &&
      betaReadiness.body.homepage_publication_founder_decision_script.every((item) => item.no_public_url_share_attempted === true) &&
      betaReadiness.body.homepage_publication_founder_decision_script.every((item) => item.no_live_action_attempted === true),
    'Beta readiness homepage publication founder decision script must expose exact phrases, allowed/not-allowed outcomes, source docs, and no-public/no-deploy/no-live boundaries'
  );
  assert(
    Array.isArray(betaReadiness.body?.homepage_publication_evidence_checklist),
    'Beta readiness must return homepage_publication_evidence_checklist array'
  );
  const homepageEvidenceIds = betaReadiness.body.homepage_publication_evidence_checklist.map((item) => item.id);
  const homepageEvidenceStates = betaReadiness.body.homepage_publication_evidence_checklist.map((item) => item.evidence_state);
  const homepageEvidenceBlockers = betaReadiness.body.homepage_publication_evidence_checklist.map((item) => item.current_blocker || '');
  assert(
    homepageEvidenceIds.includes('homepage_visual_qa_evidence') &&
      homepageEvidenceIds.includes('homepage_final_claim_risk_scan') &&
      homepageEvidenceIds.includes('homepage_integration_port_state_guard') &&
      homepageEvidenceIds.includes('homepage_first_viewport_evidence_rail_guard') &&
      homepageEvidenceIds.includes('homepage_browser_viewport_evidence_guard') &&
      homepageEvidenceIds.includes('homepage_external_asset_decision') &&
      homepageEvidenceIds.includes('homepage_archive_rollback_path') &&
      homepageEvidenceIds.includes('homepage_exact_file_replacement_diff') &&
      homepageEvidenceIds.includes('homepage_deploy_url_smoke_evidence') &&
      homepageEvidenceIds.includes('homepage_invite_share_separation') &&
      homepageEvidenceStates.includes('PASS_BROWSER_SESSION_LOCAL_ONLY') &&
      homepageEvidenceStates.includes('ASSET_PACKET_PREPARED_FOUNDER_PENDING') &&
      homepageEvidenceStates.includes('ROLLBACK_PACKET_PREPARED_FOUNDER_PENDING') &&
      homepageEvidenceStates.includes('DRY_RUN_DIFF_PREPARED_FINAL_APPROVAL_PENDING') &&
      homepageEvidenceStates.includes('PASS_STATIC_GUARD_LOCAL_ONLY') &&
      homepageEvidenceStates.includes('REVIEW_REQUIRED') &&
      homepageEvidenceStates.includes('BLOCKED_EXTERNAL_ACTION') &&
      homepageEvidenceStates.includes('BLOCKED_FOUNDER_DECISION') &&
      homepageEvidenceBlockers.some((item) => item.includes('public replacement still needs standalone PUBLICATION_GO')) &&
      homepageEvidenceBlockers.some((item) => item.includes('Integration ports are preserved in the local static candidate only')) &&
      homepageEvidenceBlockers.some((item) => item.includes('Evidence rail is visible in the local static candidate only')) &&
      homepageEvidenceBlockers.some((item) => item.includes('Required viewport evidence is captured for the local static candidate only')) &&
      homepageEvidenceBlockers.some((item) => item.includes('founder still must choose the public CSS/font posture')) &&
      homepageEvidenceBlockers.some((item) => item.includes('Rollback packet exists')) &&
      betaReadiness.body.homepage_publication_evidence_checklist.every((item) => item.no_public_homepage_edit_attempted === true) &&
      betaReadiness.body.homepage_publication_evidence_checklist.every((item) => item.no_public_whitepaper_edit_attempted === true) &&
      betaReadiness.body.homepage_publication_evidence_checklist.every((item) => item.no_deploy_setting_change_attempted === true) &&
      betaReadiness.body.homepage_publication_evidence_checklist.every((item) => item.no_public_url_share_attempted === true) &&
      betaReadiness.body.homepage_publication_evidence_checklist.every((item) => item.no_live_action_attempted === true),
    'Beta readiness homepage publication evidence checklist must expose visual QA, claim scan, asset, rollback, exact diff, deploy smoke, invite/share evidence states and no-public/no-deploy/no-live boundaries'
  );
  assert(
    Array.isArray(betaReadiness.body?.homepage_static_asset_candidate),
    'Beta readiness must return homepage_static_asset_candidate array'
  );
  const homepageStaticCandidate = betaReadiness.body.homepage_static_asset_candidate;
  const homepageStaticCandidatePosture = homepageStaticCandidate.flatMap((item) =>
    Array.isArray(item.asset_posture) ? item.asset_posture : []
  );
  const homepageStaticCandidateBrowserEvidence = homepageStaticCandidate.flatMap((item) =>
    Array.isArray(item.browser_evidence) ? item.browser_evidence : []
  );
  const homepageStaticCandidateBlockedActions = homepageStaticCandidate.flatMap((item) =>
    Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
  );
  assert(
    homepageStaticCandidate.some((item) => item.id === 'homepage_static_asset_candidate') &&
      homepageStaticCandidate.some((item) => item.candidate_state === 'STATIC_CANDIDATE_READY_LOCAL_ONLY') &&
      homepageStaticCandidate.some((item) => item.source_file === 'index-v1-3-static-draft.html') &&
      homepageStaticCandidate.some((item) => item.validator?.includes('check:homepage-v1-3-static-draft')) &&
      homepageStaticCandidate.some((item) =>
        item.evidence_source === 'docs/smartcontractor-public-homepage-static-asset-draft-2026-06-03.md'
      ) &&
      homepageStaticCandidatePosture.includes('no_tailwind_cdn') &&
      homepageStaticCandidatePosture.includes('no_google_fonts') &&
      homepageStaticCandidatePosture.includes('no_external_asset_urls') &&
      homepageStaticCandidateBrowserEvidence.some((item) => item.includes('390 x 844')) &&
      homepageStaticCandidate.some((item) => item.qa_caveat?.includes('clean Browser session before public replacement evidence')) &&
      homepageStaticCandidateBlockedActions.includes('public_homepage_replacement') &&
      homepageStaticCandidateBlockedActions.includes('public_url_share') &&
      homepageStaticCandidateBlockedActions.includes('tester_invite') &&
      homepageStaticCandidateBlockedActions.includes('real_payment') &&
      homepageStaticCandidateBlockedActions.includes('real_loan') &&
      homepageStaticCandidateBlockedActions.includes('stablecoin_settlement') &&
      homepageStaticCandidateBlockedActions.includes('token_collateral_lock') &&
      homepageStaticCandidate.every((item) => item.no_public_homepage_edit_attempted === true) &&
      homepageStaticCandidate.every((item) => item.no_public_whitepaper_edit_attempted === true) &&
      homepageStaticCandidate.every((item) => item.no_deploy_setting_change_attempted === true) &&
      homepageStaticCandidate.every((item) => item.no_public_url_share_attempted === true) &&
      homepageStaticCandidate.every((item) => item.no_tester_invite_attempted === true) &&
      homepageStaticCandidate.every((item) => item.no_live_action_attempted === true),
    'Beta readiness homepage static asset candidate must expose static draft source, validator, asset posture, Browser evidence, caveat, blocked live actions, and no-public/no-live boundaries'
  );
  const homepageDecisionSummary = betaReadiness.body?.homepage_publication_decision_summary || {};
  assert(
    homepageDecisionSummary.id === 'homepage_publication_decision_summary' &&
      homepageDecisionSummary.summary_state === 'LOCAL_READY_PUBLICATION_BLOCKED' &&
      homepageDecisionSummary.current_candidate === 'index-v1-3-static-draft.html' &&
      homepageDecisionSummary.current_public_state?.homepage === 'UNCHANGED_PUBLIC_INDEX_HTML' &&
      homepageDecisionSummary.current_public_state?.whitepaper === 'UNCHANGED_PUBLIC_WHITEPAPER_HTML' &&
      homepageDecisionSummary.current_public_state?.deploy_settings === 'UNCHANGED_EXTERNAL_DEPLOY_SETTINGS' &&
      homepageDecisionSummary.recommended_founder_response?.includes('APPROVE_TRADITIONAL_FIRST_HOMEPAGE_DIRECTION') &&
      homepageDecisionSummary.recommended_founder_response?.includes('APPROVE_HIDDEN_FUTURE_INFRASTRUCTURE_LANGUAGE') &&
      homepageDecisionSummary.recommended_founder_response?.includes('ACCEPT_LOCAL_BROWSER_QA_EVIDENCE') &&
      homepageDecisionSummary.recommended_founder_response?.includes('REQUIRE_COMPILED_PUBLIC_CSS') &&
      homepageDecisionSummary.recommended_founder_response?.includes('KEEP_PUBLIC_REPLACEMENT_ON_HOLD') &&
      homepageDecisionSummary.ready_local_evidence?.includes('static no-external-asset candidate prepared') &&
      homepageDecisionSummary.remaining_blockers?.includes('standalone PUBLICATION_GO not provided') &&
      homepageDecisionSummary.remaining_blockers?.includes('final exact public-file replacement diff not approved') &&
      homepageDecisionSummary.next_safe_actions?.includes('Keep public index.html and whitepaper.html unchanged.') &&
      homepageDecisionSummary.source_docs?.includes('docs/smartcontractor-homepage-founder-ready-decision-summary-2026-06-03.md') &&
      homepageDecisionSummary.blocked_live_actions?.includes('public_homepage_replacement') &&
      homepageDecisionSummary.blocked_live_actions?.includes('public_url_share') &&
      homepageDecisionSummary.blocked_live_actions?.includes('tester_invite') &&
      homepageDecisionSummary.blocked_live_actions?.includes('public_beta_launch') &&
      homepageDecisionSummary.blocked_live_actions?.includes('real_payment') &&
      homepageDecisionSummary.blocked_live_actions?.includes('stablecoin_settlement') &&
      homepageDecisionSummary.blocked_live_actions?.includes('token_collateral_lock') &&
      homepageDecisionSummary.no_public_homepage_edit_attempted === true &&
      homepageDecisionSummary.no_public_whitepaper_edit_attempted === true &&
      homepageDecisionSummary.no_deploy_setting_change_attempted === true &&
      homepageDecisionSummary.no_public_url_share_attempted === true &&
      homepageDecisionSummary.no_tester_invite_attempted === true &&
      homepageDecisionSummary.no_live_action_attempted === true,
    'Beta readiness homepage publication decision summary must expose local-ready/public-blocked state, recommended founder response, unchanged public state, blockers, and no-public/no-live boundaries'
  );
  const homepageDecisionSummaryEndpoint = await request(baseUrl, '/api/admin/homepage-publication-decision-summary', {
    headers: { 'X-Request-Id': 'gcsc-homepage-publication-decision-summary-endpoint-smoke' },
  });
  assert(
    homepageDecisionSummaryEndpoint.status === 200,
    `Expected homepage publication decision summary endpoint 200, got ${homepageDecisionSummaryEndpoint.status}`
  );
  assert(
    homepageDecisionSummaryEndpoint.headers.get('x-request-id') ===
      'gcsc-homepage-publication-decision-summary-endpoint-smoke' &&
      homepageDecisionSummaryEndpoint.body?.request_id ===
        'gcsc-homepage-publication-decision-summary-endpoint-smoke' &&
      homepageDecisionSummaryEndpoint.body?.request_id_header ===
        'gcsc-homepage-publication-decision-summary-endpoint-smoke',
    'Homepage publication decision summary endpoint must preserve X-Request-Id in the header and JSON body'
  );
  const homepageDecisionSummaryEndpointBody = homepageDecisionSummaryEndpoint.body || {};
  const homepageDecisionSummaryEndpointSummary = homepageDecisionSummaryEndpointBody.summary || {};
  assert(
    homepageDecisionSummaryEndpointBody.mode === 'homepage_publication_decision_summary' &&
      homepageDecisionSummaryEndpointBody.request_path === '/api/admin/homepage-publication-decision-summary' &&
      homepageDecisionSummaryEndpointBody.request_method === 'GET' &&
      homepageDecisionSummaryEndpointBody.status === 'LOCAL_READY_PUBLICATION_BLOCKED' &&
      homepageDecisionSummaryEndpointBody.summary_state === 'LOCAL_READY_PUBLICATION_BLOCKED' &&
      homepageDecisionSummaryEndpointBody.recommended_founder_response_count === 5 &&
      homepageDecisionSummaryEndpointBody.ready_local_evidence_count === 6 &&
      homepageDecisionSummaryEndpointBody.remaining_blocker_count === 6 &&
      homepageDecisionSummaryEndpointBody.next_safe_action_count === 4 &&
      homepageDecisionSummaryEndpointBody.source_doc_count === 4 &&
      homepageDecisionSummaryEndpointSummary.id === 'homepage_publication_decision_summary' &&
      homepageDecisionSummaryEndpointSummary.current_candidate === 'index-v1-3-static-draft.html' &&
      homepageDecisionSummaryEndpointSummary.current_public_state?.homepage === 'UNCHANGED_PUBLIC_INDEX_HTML' &&
      homepageDecisionSummaryEndpointSummary.current_public_state?.whitepaper === 'UNCHANGED_PUBLIC_WHITEPAPER_HTML' &&
      homepageDecisionSummaryEndpointSummary.recommended_founder_response?.includes('KEEP_PUBLIC_REPLACEMENT_ON_HOLD') &&
      homepageDecisionSummaryEndpointSummary.remaining_blockers?.includes('standalone PUBLICATION_GO not provided') &&
      homepageDecisionSummaryEndpointSummary.next_safe_actions?.includes(
        'Keep public index.html and whitepaper.html unchanged.'
      ) &&
      homepageDecisionSummaryEndpointBody.blocked_live_actions?.includes('public_homepage_replacement') &&
      homepageDecisionSummaryEndpointBody.blocked_live_actions?.includes('public_whitepaper_edit') &&
      homepageDecisionSummaryEndpointBody.blocked_live_actions?.includes('deploy_setting_change') &&
      homepageDecisionSummaryEndpointBody.blocked_live_actions?.includes('public_url_share') &&
      homepageDecisionSummaryEndpointBody.blocked_live_actions?.includes('tester_invite') &&
      homepageDecisionSummaryEndpointBody.blocked_live_actions?.includes('public_beta_launch') &&
      homepageDecisionSummaryEndpointBody.blocked_live_actions?.includes('real_payment') &&
      homepageDecisionSummaryEndpointBody.blocked_live_actions?.includes('token_collateral_lock') &&
      homepageDecisionSummaryEndpointBody.safe_report_fields?.includes('request_id') &&
      homepageDecisionSummaryEndpointBody.safe_report_fields?.includes('summary_state') &&
      homepageDecisionSummaryEndpointBody.linked_surfaces?.includes('/api/admin/beta-readiness') &&
      homepageDecisionSummaryEndpointBody.linked_surfaces?.includes(
        '/api/admin/admin-evidence-export-preview?source_filter=homepage_publication_decision_summary'
      ) &&
      homepageDecisionSummaryEndpointBody.no_public_homepage_edit_attempted === true &&
      homepageDecisionSummaryEndpointBody.no_public_whitepaper_edit_attempted === true &&
      homepageDecisionSummaryEndpointBody.no_publication_attempted === true &&
      homepageDecisionSummaryEndpointBody.no_archive_execution_attempted === true &&
      homepageDecisionSummaryEndpointBody.no_deploy_setting_change_attempted === true &&
      homepageDecisionSummaryEndpointBody.no_public_url_share_attempted === true &&
      homepageDecisionSummaryEndpointBody.no_tester_invite_attempted === true &&
      homepageDecisionSummaryEndpointBody.no_public_beta_launch_attempted === true &&
      homepageDecisionSummaryEndpointBody.no_real_payment_attempted === true &&
      homepageDecisionSummaryEndpointBody.no_real_loan_attempted === true &&
      homepageDecisionSummaryEndpointBody.no_real_escrow_attempted === true &&
      homepageDecisionSummaryEndpointBody.no_stablecoin_settlement_attempted === true &&
      homepageDecisionSummaryEndpointBody.no_token_collateral_lock_attempted === true &&
      homepageDecisionSummaryEndpointBody.no_xpr_signature_attempted === true &&
      homepageDecisionSummaryEndpointBody.no_fio_registration_attempted === true &&
      homepageDecisionSummaryEndpointBody.no_legal_provider_decision_attempted === true &&
      homepageDecisionSummaryEndpointBody.no_production_release_attempted === true &&
      homepageDecisionSummaryEndpointBody.no_server_storage_attempted === true &&
      homepageDecisionSummaryEndpointBody.no_external_send_attempted === true &&
      homepageDecisionSummaryEndpointBody.no_live_action_attempted === true,
    'Homepage publication decision summary endpoint must expose request trace metadata, unchanged public state, blockers, safe fields, and no-public/no-live boundaries'
  );
  assert(
    Array.isArray(betaReadiness.body?.homepage_publication_final_qa_hold),
    'Beta readiness must return homepage_publication_final_qa_hold array'
  );
  const homepageFinalQaHold = betaReadiness.body.homepage_publication_final_qa_hold;
  const homepageFinalQaRequiredEvidence = homepageFinalQaHold.flatMap((item) =>
    Array.isArray(item.required_before_publication_go) ? item.required_before_publication_go : []
  );
  const homepageFinalQaPreparedEvidence = homepageFinalQaHold.flatMap((item) =>
    Array.isArray(item.already_prepared_local_evidence) ? item.already_prepared_local_evidence : []
  );
  const homepageFinalQaBlockedActions = homepageFinalQaHold.flatMap((item) =>
    Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
  );
  assert(
    homepageFinalQaHold.some((item) => item.id === 'homepage_static_candidate_final_qa_hold') &&
      homepageFinalQaHold.some((item) => item.hold_state === 'FINAL_QA_HOLD_LOCAL_ONLY') &&
      homepageFinalQaHold.some((item) => item.candidate_file === 'index-v1-3-static-draft.html') &&
      homepageFinalQaHold.some((item) => item.public_target_file === 'index.html') &&
      homepageFinalQaHold.some((item) => item.publication_allowed === false) &&
      homepageFinalQaRequiredEvidence.some((item) => item.includes('final public-file claim scan')) &&
      homepageFinalQaRequiredEvidence.some((item) => item.includes('clean Browser desktop/mobile screenshot evidence')) &&
      homepageFinalQaRequiredEvidence.some((item) => item.includes('link and CTA route check')) &&
      homepageFinalQaRequiredEvidence.some((item) => item.includes('archive and rollback hash check')) &&
      homepageFinalQaPreparedEvidence.includes('static no-external-asset homepage candidate prepared') &&
      homepageFinalQaBlockedActions.includes('public_homepage_replacement') &&
      homepageFinalQaBlockedActions.includes('archive_execution') &&
      homepageFinalQaBlockedActions.includes('public_url_share') &&
      homepageFinalQaBlockedActions.includes('tester_invite') &&
      homepageFinalQaBlockedActions.includes('real_payment') &&
      homepageFinalQaBlockedActions.includes('stablecoin_settlement') &&
      homepageFinalQaBlockedActions.includes('token_collateral_lock') &&
      homepageFinalQaHold.every((item) => item.no_public_homepage_edit_attempted === true) &&
      homepageFinalQaHold.every((item) => item.no_public_whitepaper_edit_attempted === true) &&
      homepageFinalQaHold.every((item) => item.no_archive_execution_attempted === true) &&
      homepageFinalQaHold.every((item) => item.no_deploy_setting_change_attempted === true) &&
      homepageFinalQaHold.every((item) => item.no_public_url_share_attempted === true) &&
      homepageFinalQaHold.every((item) => item.no_tester_invite_attempted === true) &&
      homepageFinalQaHold.every((item) => item.no_live_action_attempted === true),
    'Beta readiness homepage final public QA hold must expose exact candidate, required final QA evidence, publication_allowed false, blocked actions, and no-public/no-live boundaries'
  );
  const whitepaperV13PublicationGate = betaReadiness.body?.whitepaper_v1_3_publication_gate || {};
  assert(
    whitepaperV13PublicationGate.id === 'whitepaper_v1_3_publication_gate' &&
      whitepaperV13PublicationGate.label === 'Whitepaper v1.3 publication gate' &&
      whitepaperV13PublicationGate.gate_state === 'NO_GO' &&
      whitepaperV13PublicationGate.publication_allowed === false &&
      whitepaperV13PublicationGate.current_decision === 'Default state: NO-GO' &&
      whitepaperV13PublicationGate.required_before_review?.includes('local validators pass') &&
      whitepaperV13PublicationGate.required_before_go?.includes('founder publication approval recorded') &&
      whitepaperV13PublicationGate.no_go_reasons?.includes('founder publication approval is not recorded') &&
      whitepaperV13PublicationGate.blocked_public_actions?.includes('whitepaper_html_replacement') &&
      whitepaperV13PublicationGate.blocked_public_actions?.includes('index_html_replacement') &&
      whitepaperV13PublicationGate.blocked_public_actions?.includes('pdf_publication') &&
      whitepaperV13PublicationGate.blocked_public_actions?.includes('partner_packet_send') &&
      whitepaperV13PublicationGate.blocked_public_actions?.includes('email_announcement') &&
      whitepaperV13PublicationGate.blocked_public_actions?.includes('social_announcement') &&
      whitepaperV13PublicationGate.blocked_public_actions?.includes('fio_integration_announcement') &&
      whitepaperV13PublicationGate.blocked_public_actions?.includes('metallicus_partnership_announcement') &&
      whitepaperV13PublicationGate.blocked_public_actions?.includes('live_lending_announcement') &&
      whitepaperV13PublicationGate.blocked_public_actions?.includes('live_escrow_announcement') &&
      whitepaperV13PublicationGate.evidence_sources?.includes('docs/whitepaper-v1-3-publication-gate.md') &&
      whitepaperV13PublicationGate.no_public_homepage_edit_attempted === true &&
      whitepaperV13PublicationGate.no_public_whitepaper_edit_attempted === true &&
      whitepaperV13PublicationGate.no_publication_attempted === true &&
      whitepaperV13PublicationGate.no_archive_execution_attempted === true &&
      whitepaperV13PublicationGate.no_external_send_attempted === true &&
      whitepaperV13PublicationGate.no_provider_outreach_attempted === true &&
      whitepaperV13PublicationGate.no_legal_provider_decision_attempted === true &&
      whitepaperV13PublicationGate.no_live_finance_action_attempted === true &&
      whitepaperV13PublicationGate.no_xpr_signature_attempted === true &&
      whitepaperV13PublicationGate.no_fio_registration_attempted === true &&
      whitepaperV13PublicationGate.no_production_release_attempted === true &&
      whitepaperV13PublicationGate.no_live_action_attempted === true,
    'Beta readiness whitepaper v1.3 publication gate must expose NO-GO, publication_allowed false, blocked public actions, evidence sources, and no-public/no-send/no-XPR/FIO/no-live boundaries'
  );
  const whitepaperV13PublicationGateEndpoint = await request(
    baseUrl,
    '/api/admin/whitepaper-v1-3-publication-gate',
    {
      headers: { 'X-Request-Id': 'gcsc-whitepaper-v13-publication-gate-endpoint-smoke' },
    }
  );
  assert(
    whitepaperV13PublicationGateEndpoint.status === 200,
    `Expected whitepaper v1.3 publication gate endpoint 200, got ${whitepaperV13PublicationGateEndpoint.status}`
  );
  assert(
    whitepaperV13PublicationGateEndpoint.headers.get('x-request-id') ===
      'gcsc-whitepaper-v13-publication-gate-endpoint-smoke' &&
      whitepaperV13PublicationGateEndpoint.body?.request_id ===
        'gcsc-whitepaper-v13-publication-gate-endpoint-smoke' &&
      whitepaperV13PublicationGateEndpoint.body?.request_id_header ===
        'gcsc-whitepaper-v13-publication-gate-endpoint-smoke',
    'Whitepaper v1.3 publication gate endpoint must preserve X-Request-Id in the header and JSON body'
  );
  const whitepaperV13PublicationGateEndpointBody = whitepaperV13PublicationGateEndpoint.body || {};
  const whitepaperV13PublicationGateEndpointGate = whitepaperV13PublicationGateEndpointBody.gate || {};
  assert(
    whitepaperV13PublicationGateEndpointBody.mode === 'whitepaper_v1_3_publication_gate' &&
      whitepaperV13PublicationGateEndpointBody.request_path === '/api/admin/whitepaper-v1-3-publication-gate' &&
      whitepaperV13PublicationGateEndpointBody.request_method === 'GET' &&
      whitepaperV13PublicationGateEndpointBody.status === 'NO_GO' &&
      whitepaperV13PublicationGateEndpointBody.publication_allowed === false &&
      whitepaperV13PublicationGateEndpointGate.id === 'whitepaper_v1_3_publication_gate' &&
      whitepaperV13PublicationGateEndpointGate.gate_state === 'NO_GO' &&
      whitepaperV13PublicationGateEndpointGate.publication_allowed === false &&
      whitepaperV13PublicationGateEndpointGate.blocked_public_actions?.includes('whitepaper_html_replacement') &&
      whitepaperV13PublicationGateEndpointGate.blocked_public_actions?.includes('index_html_replacement') &&
      whitepaperV13PublicationGateEndpointGate.blocked_public_actions?.includes('fio_integration_announcement') &&
      whitepaperV13PublicationGateEndpointGate.blocked_public_actions?.includes('metallicus_partnership_announcement') &&
      whitepaperV13PublicationGateEndpointGate.evidence_sources?.includes(
        'docs/whitepaper-v1-3-publication-gate.md'
      ) &&
      whitepaperV13PublicationGateEndpointBody.linked_surfaces?.includes('/api/admin/beta-readiness') &&
      whitepaperV13PublicationGateEndpointBody.safe_report_fields?.includes('request_id') &&
      whitepaperV13PublicationGateEndpointBody.no_public_homepage_edit_attempted === true &&
      whitepaperV13PublicationGateEndpointBody.no_public_whitepaper_edit_attempted === true &&
      whitepaperV13PublicationGateEndpointBody.no_publication_attempted === true &&
      whitepaperV13PublicationGateEndpointBody.no_archive_execution_attempted === true &&
      whitepaperV13PublicationGateEndpointBody.no_external_send_attempted === true &&
      whitepaperV13PublicationGateEndpointBody.no_provider_outreach_attempted === true &&
      whitepaperV13PublicationGateEndpointBody.no_legal_provider_decision_attempted === true &&
      whitepaperV13PublicationGateEndpointBody.no_live_finance_action_attempted === true &&
      whitepaperV13PublicationGateEndpointBody.no_xpr_signature_attempted === true &&
      whitepaperV13PublicationGateEndpointBody.no_fio_registration_attempted === true &&
      whitepaperV13PublicationGateEndpointBody.no_production_release_attempted === true &&
      whitepaperV13PublicationGateEndpointBody.no_live_action_attempted === true,
    'Whitepaper v1.3 publication gate endpoint must expose request trace metadata, NO-GO state, publication_allowed false, blocked public/Web3 actions, and no-live boundaries'
  );
  const homepageFinalQaPreflight = await request(
    baseUrl,
    '/api/admin/homepage-publication-final-qa-preflight',
    {
      headers: { 'X-Request-Id': 'gcsc-homepage-final-qa-preflight-smoke' },
    }
  );
  assert(
    homepageFinalQaPreflight.status === 200,
    `Expected homepage final QA preflight 200, got ${homepageFinalQaPreflight.status}`
  );
  const homepageFinalQaPreflightBody = homepageFinalQaPreflight.body || {};
  const homepageFinalQaPreflightChecks = homepageFinalQaPreflightBody.checks || [];
  const homepageFinalQaPreflightCheckIds = homepageFinalQaPreflightChecks.map((item) => item.id);
  assert(
    homepageFinalQaPreflightBody.request_id === 'gcsc-homepage-final-qa-preflight-smoke' &&
      homepageFinalQaPreflightBody.mode === 'homepage_publication_final_qa_preflight' &&
      homepageFinalQaPreflightBody.preflight_state === 'LOCAL_PREFLIGHT_READY_PUBLICATION_BLOCKED' &&
      homepageFinalQaPreflightBody.publication_allowed === false &&
      homepageFinalQaPreflightBody.candidate?.file === 'index-v1-3-static-draft.html' &&
      homepageFinalQaPreflightBody.candidate?.exists === true &&
      typeof homepageFinalQaPreflightBody.candidate?.sha256 === 'string' &&
      homepageFinalQaPreflightBody.candidate.sha256.length === 64 &&
      Array.isArray(homepageFinalQaPreflightBody.candidate?.blocked_claims_found) &&
      homepageFinalQaPreflightBody.candidate.blocked_claims_found.length === 0 &&
      Array.isArray(homepageFinalQaPreflightBody.candidate?.external_asset_urls) &&
      homepageFinalQaPreflightBody.candidate.external_asset_urls.length === 0 &&
      Array.isArray(homepageFinalQaPreflightBody.candidate?.missing_first_viewport_signals) &&
      homepageFinalQaPreflightBody.candidate.missing_first_viewport_signals.length === 0 &&
      Array.isArray(homepageFinalQaPreflightBody.candidate?.required_first_viewport_signals) &&
      homepageFinalQaPreflightBody.candidate.required_first_viewport_signals.some((item) => item.id === 'product_name' && item.token === 'SmartContractor by GCSC') &&
      homepageFinalQaPreflightBody.candidate.required_first_viewport_signals.some((item) => item.id === 'homepage_evidence_rail' && item.token === 'Homepage Evidence Rail') &&
      homepageFinalQaPreflightBody.candidate.required_first_viewport_signals.some((item) => item.id === 'project_intake_evidence' && item.token === 'Project intake') &&
      homepageFinalQaPreflightBody.candidate.required_first_viewport_signals.some((item) => item.id === 'milestone_evidence_signal' && item.token === 'Milestone evidence') &&
      homepageFinalQaPreflightBody.candidate.required_first_viewport_signals.some((item) => item.id === 'dispute_packet_signal' && item.token === 'Dispute packet') &&
      homepageFinalQaPreflightBody.candidate.required_first_viewport_signals.some((item) => item.id === 'provider_review_data_signal' && item.token === 'Provider review data') &&
      Array.isArray(homepageFinalQaPreflightBody.candidate?.missing_product_section_signals) &&
      homepageFinalQaPreflightBody.candidate.missing_product_section_signals.length === 0 &&
      Array.isArray(homepageFinalQaPreflightBody.candidate?.required_product_section_signals) &&
      homepageFinalQaPreflightBody.candidate.required_product_section_signals.some((item) => item.id === 'product_review_order' && item.token === 'Traditional Product Review Order') &&
      homepageFinalQaPreflightBody.candidate.required_product_section_signals.some((item) => item.id === 'working_capital_provider_review' && item.token === 'Working-capital readiness packet for future provider review') &&
      Array.isArray(homepageFinalQaPreflightBody.candidate?.missing_integration_port_signals) &&
      homepageFinalQaPreflightBody.candidate.missing_integration_port_signals.length === 0 &&
      Array.isArray(homepageFinalQaPreflightBody.candidate?.required_integration_port_signals) &&
      homepageFinalQaPreflightBody.candidate.required_integration_port_signals.some((item) => item.id === 'integration_ports' && item.token === 'Integration Readiness Ports') &&
      homepageFinalQaPreflightBody.candidate.required_integration_port_signals.some((item) => item.id === 'port_states_future_review' && item.token === 'future_review_required') &&
      Array.isArray(homepageFinalQaPreflightBody.candidate?.visual_style_findings) &&
      homepageFinalQaPreflightBody.candidate.visual_style_findings.length === 0 &&
      Array.isArray(homepageFinalQaPreflightBody.candidate?.missing_visual_tokens) &&
      homepageFinalQaPreflightBody.candidate.missing_visual_tokens.length === 0 &&
      Array.isArray(homepageFinalQaPreflightBody.candidate?.required_visual_tokens) &&
      homepageFinalQaPreflightBody.candidate.required_visual_tokens.some((item) => item.id === 'construction_trust_brand' && item.token === '--brand: #2f6f8f') &&
      Array.isArray(homepageFinalQaPreflightBody.candidate?.required_browser_viewports) &&
      homepageFinalQaPreflightBody.candidate.required_browser_viewports.some((item) => item.id === 'desktop_first_viewport_hero_fit' && item.viewport === '1280 x 720') &&
      homepageFinalQaPreflightBody.candidate.required_browser_viewports.some((item) => item.id === 'mobile_first_viewport_hero_fit' && item.viewport === '390 x 844') &&
      homepageFinalQaPreflightBody.public_targets?.homepage?.exists === true &&
      homepageFinalQaPreflightBody.public_targets?.whitepaper?.exists === true &&
      homepageFinalQaPreflightCheckIds.includes('candidate_file_present') &&
      homepageFinalQaPreflightCheckIds.includes('first_viewport_product_signal_guard') &&
      homepageFinalQaPreflightCheckIds.includes('product_section_order_guard') &&
      homepageFinalQaPreflightCheckIds.includes('integration_port_state_guard') &&
      homepageFinalQaPreflightCheckIds.includes('blocked_public_claim_scan') &&
      homepageFinalQaPreflightCheckIds.includes('external_asset_scan') &&
      homepageFinalQaPreflightCheckIds.includes('section_anchor_scan') &&
      homepageFinalQaPreflightCheckIds.includes('local_link_cta_scan') &&
      homepageFinalQaPreflightCheckIds.includes('static_visual_style_guard') &&
      homepageFinalQaPreflightCheckIds.includes('browser_viewport_evidence_guard') &&
      homepageFinalQaPreflightCheckIds.includes('public_file_hash_snapshot') &&
      homepageFinalQaPreflightCheckIds.includes('publication_permission_gate') &&
      homepageFinalQaPreflightBody.blocked_live_actions?.includes('public_homepage_replacement') &&
      homepageFinalQaPreflightBody.blocked_live_actions?.includes('archive_execution') &&
      homepageFinalQaPreflightBody.blocked_live_actions?.includes('tester_invite') &&
      homepageFinalQaPreflightBody.no_public_homepage_edit_attempted === true &&
      homepageFinalQaPreflightBody.no_public_whitepaper_edit_attempted === true &&
      homepageFinalQaPreflightBody.no_archive_execution_attempted === true &&
      homepageFinalQaPreflightBody.no_deploy_setting_change_attempted === true &&
      homepageFinalQaPreflightBody.no_public_url_share_attempted === true &&
      homepageFinalQaPreflightBody.no_tester_invite_attempted === true &&
      homepageFinalQaPreflightBody.no_live_action_attempted === true,
    'Homepage final QA preflight must scan local static candidate, record public hashes, keep publication_allowed false, and block public/live actions'
  );
  const homepageDecisionRecommendedText = [
    'APPROVE_TRADITIONAL_FIRST_HOMEPAGE_DIRECTION',
    'APPROVE_HIDDEN_FUTURE_INFRASTRUCTURE_LANGUAGE',
    'ACCEPT_LOCAL_BROWSER_QA_EVIDENCE',
    'REQUIRE_COMPILED_PUBLIC_CSS',
    'KEEP_PUBLIC_REPLACEMENT_ON_HOLD',
  ].join('\n');
  const homepageDecisionSafe = await request(
    baseUrl,
    '/api/admin/beta-readiness/homepage-publication-decision/validate',
    {
      method: 'POST',
      headers: { 'X-Request-Id': 'gcsc-homepage-decision-safe-smoke' },
      body: JSON.stringify({
        decision_text: homepageDecisionRecommendedText,
      }),
    }
  );
  assert(
    homepageDecisionSafe.status === 200,
    `Expected safe homepage publication decision 200, got ${homepageDecisionSafe.status}`
  );
  assert(
    homepageDecisionSafe.body?.request_id === 'gcsc-homepage-decision-safe-smoke' &&
      homepageDecisionSafe.body?.mode === 'local_beta_homepage_publication_decision_validation' &&
      homepageDecisionSafe.body?.status === 'safe_local_homepage_decision_hold' &&
      homepageDecisionSafe.body?.validation_type === 'homepage_publication_decision_validation' &&
      homepageDecisionSafe.body?.publication_go_detected === false,
    'Safe homepage publication decision response must return local hold validation status without PUBLICATION_GO'
  );
  assert(
    Array.isArray(homepageDecisionSafe.body?.accepted_phrases) &&
      homepageDecisionSafe.body.accepted_phrases.length === 5 &&
      Array.isArray(homepageDecisionSafe.body?.missing_recommended_phrases) &&
      homepageDecisionSafe.body.missing_recommended_phrases.length === 0 &&
      homepageDecisionSafe.body?.no_decision_text_storage === true &&
      homepageDecisionSafe.body?.no_public_replacement_attempted === true &&
      homepageDecisionSafe.body?.no_deploy_attempted === true &&
      homepageDecisionSafe.body?.no_url_share_attempted === true &&
      homepageDecisionSafe.body?.no_tester_invite_attempted === true &&
      homepageDecisionSafe.body?.no_live_action_attempted === true,
    'Safe homepage publication decision response must confirm accepted phrases and no storage, public replacement, deploy, URL share, tester invite, or live action'
  );
  const homepageDecisionPublicationGo = await request(
    baseUrl,
    '/api/admin/beta-readiness/homepage-publication-decision/validate',
    {
      method: 'POST',
      headers: { 'X-Request-Id': 'gcsc-homepage-decision-publication-go-smoke' },
      body: JSON.stringify({
        decision_text: `${homepageDecisionRecommendedText}\nPUBLICATION_GO`,
      }),
    }
  );
  assert(
    homepageDecisionPublicationGo.status === 200,
    `Expected PUBLICATION_GO homepage publication decision review-only 200, got ${homepageDecisionPublicationGo.status}`
  );
  assert(
    homepageDecisionPublicationGo.body?.request_id === 'gcsc-homepage-decision-publication-go-smoke' &&
      homepageDecisionPublicationGo.body?.status === 'homepage_publication_go_detected_review_only' &&
      homepageDecisionPublicationGo.body?.publication_go_detected === true &&
      homepageDecisionPublicationGo.body?.requires_founder_review === true &&
      homepageDecisionPublicationGo.body?.accepted_phrases?.includes('PUBLICATION_GO'),
    'PUBLICATION_GO homepage publication decision response must be review-only and require founder review'
  );
  assert(
    homepageDecisionPublicationGo.body?.homepage_publication_decision_gate?.public_homepage_edit === 'blocked' &&
      homepageDecisionPublicationGo.body?.homepage_publication_decision_gate?.deploy_setting_change === 'blocked' &&
      homepageDecisionPublicationGo.body?.homepage_publication_decision_gate?.public_url_share === 'blocked' &&
      homepageDecisionPublicationGo.body?.homepage_publication_decision_gate?.tester_invite === 'blocked' &&
      homepageDecisionPublicationGo.body?.no_public_replacement_attempted === true &&
      homepageDecisionPublicationGo.body?.no_deploy_attempted === true &&
      homepageDecisionPublicationGo.body?.no_url_share_attempted === true &&
      homepageDecisionPublicationGo.body?.no_tester_invite_attempted === true &&
      homepageDecisionPublicationGo.body?.no_live_action_attempted === true,
    'PUBLICATION_GO homepage publication decision response must keep public edit, deploy, URL share, tester invite, and live actions blocked'
  );
  const homepageDecisionUnsafe = await request(
    baseUrl,
    '/api/admin/beta-readiness/homepage-publication-decision/validate',
    {
      method: 'POST',
      headers: { 'X-Request-Id': 'gcsc-homepage-decision-unsafe-smoke' },
      body: JSON.stringify({
        decision_text: 'Replace public index.html and deploy now. API key password included.',
      }),
    }
  );
  assert(
    homepageDecisionUnsafe.status === 400,
    `Expected unsafe homepage publication decision 400, got ${homepageDecisionUnsafe.status}`
  );
  assert(
    homepageDecisionUnsafe.body?.request_id === 'gcsc-homepage-decision-unsafe-smoke' &&
      homepageDecisionUnsafe.body?.mode === 'local_beta_homepage_publication_decision_validation' &&
      homepageDecisionUnsafe.body?.status === 'homepage_decision_blocked_for_redaction',
    'Unsafe homepage publication decision response must return blocked-for-redaction status'
  );
  assert(
    Array.isArray(homepageDecisionUnsafe.body?.issues) &&
      homepageDecisionUnsafe.body.issues.some((issue) => issue.id === 'secret_or_key_reference') &&
      homepageDecisionUnsafe.body.issues.some((issue) => issue.id === 'immediate_public_replacement_or_deploy_action') &&
      homepageDecisionUnsafe.body?.no_decision_text_storage === true &&
      homepageDecisionUnsafe.body?.no_public_replacement_attempted === true &&
      homepageDecisionUnsafe.body?.no_deploy_attempted === true &&
      homepageDecisionUnsafe.body?.no_url_share_attempted === true &&
      homepageDecisionUnsafe.body?.no_live_action_attempted === true,
    'Unsafe homepage publication decision response must flag secrets/public replacement/deploy action and still block storage and live actions'
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
      betaReadiness.body.founder_evening_action_summary.some((item) => item.includes('Homepage publication')) &&
      betaReadiness.body.founder_evening_action_summary.some((item) => item.includes('No live action approval')),
    'Beta readiness must return founder_evening_action_summary with copyable founder next actions'
  );
  assert(
    betaReadiness.body?.founder_evening_decision_matrix?.some((item) => item.label?.includes('Auth/Admin decision')) &&
      betaReadiness.body.founder_evening_decision_matrix.some((item) => item.label?.includes('Deploy/public URL decision')) &&
      betaReadiness.body.founder_evening_decision_matrix.some((item) => item.label?.includes('Homepage publication decision')) &&
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
      betaReadiness.body.founder_evening_command_board.some((item) => item.label?.includes('Step 6 Homepage publication sequence review')) &&
      betaReadiness.body.founder_evening_command_board.some((item) => item.command_state === 'HOLD_FOR_PUBLICATION_GO') &&
      betaReadiness.body.founder_evening_command_board.some((item) =>
        item.blocked_live_actions?.some((action) => action.includes('No live command execution'))
      ),
    'Beta readiness must return founder_evening_command_board with ordered founder evening commands and no-live boundary'
  );
  assert(Array.isArray(betaReadiness.body?.founder_handoff_today), 'Beta readiness must return founder_handoff_today array');
  const founderHandoffTodayIds = betaReadiness.body.founder_handoff_today.map((item) => item.id);
  const founderHandoffTodayStates = betaReadiness.body.founder_handoff_today.map((item) => item.handoff_state);
  const founderHandoffTodayBlockedActions = betaReadiness.body.founder_handoff_today.flatMap((item) =>
    Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
  );
  assert(
    founderHandoffTodayIds.includes('auth_admin_live_blocker') &&
      founderHandoffTodayIds.includes('deployment_public_url_blocker') &&
      founderHandoffTodayIds.includes('homepage_publication_blocker') &&
      founderHandoffTodayIds.includes('contract_review_next_step') &&
      founderHandoffTodayIds.includes('legal_provider_finance_blocker') &&
      founderHandoffTodayStates.includes('FOUNDER_EVIDENCE_REQUIRED') &&
      founderHandoffTodayStates.includes('FOUNDER_ACCOUNT_REQUIRED') &&
      founderHandoffTodayStates.includes('PUBLICATION_GO_REQUIRED') &&
      founderHandoffTodayStates.includes('GO_LOCAL_REVIEW_ONLY') &&
      founderHandoffTodayStates.includes('BLOCKED_FOR_EXTERNAL_REVIEW') &&
      founderHandoffTodayBlockedActions.includes('admin_memberships_insert') &&
      founderHandoffTodayBlockedActions.includes('vercel_import') &&
      founderHandoffTodayBlockedActions.includes('public_index_html_replacement') &&
      founderHandoffTodayBlockedActions.includes('xpr_signature_request') &&
      founderHandoffTodayBlockedActions.includes('real_loan') &&
      betaReadiness.body.founder_handoff_today.every((item) => item.no_secret_requested === true) &&
      betaReadiness.body.founder_handoff_today.every((item) => item.no_live_supabase_write_attempted === true) &&
      betaReadiness.body.founder_handoff_today.every((item) => item.no_external_account_change_attempted === true) &&
      betaReadiness.body.founder_handoff_today.every((item) => item.no_public_file_edit_attempted === true) &&
      betaReadiness.body.founder_handoff_today.every((item) => item.no_public_url_share_attempted === true) &&
      betaReadiness.body.founder_handoff_today.every((item) => item.no_tester_invite_attempted === true) &&
      betaReadiness.body.founder_handoff_today.every((item) => item.no_live_finance_action_attempted === true) &&
      betaReadiness.body.founder_handoff_today.every((item) => item.no_legal_provider_decision_attempted === true) &&
      betaReadiness.body.founder_handoff_today.every((item) => item.no_production_release_attempted === true),
    'Beta readiness founder handoff today must expose founder blockers, report fields, and no-live boundaries'
  );
  const founderHandoffTodayEndpoint = await request(baseUrl, '/api/admin/founder-handoff-today', {
    headers: { 'X-Request-Id': 'gcsc-founder-handoff-today-endpoint-smoke' },
  });
  assert(
    founderHandoffTodayEndpoint.status === 200,
    `Expected founder handoff today endpoint 200, got ${founderHandoffTodayEndpoint.status}`
  );
  assert(
    founderHandoffTodayEndpoint.headers.get('x-request-id') === 'gcsc-founder-handoff-today-endpoint-smoke' &&
      founderHandoffTodayEndpoint.body?.request_id === 'gcsc-founder-handoff-today-endpoint-smoke' &&
      founderHandoffTodayEndpoint.body?.request_id_header === 'gcsc-founder-handoff-today-endpoint-smoke',
    'Founder handoff today endpoint must preserve X-Request-Id in the header and JSON body'
  );
  const founderHandoffTodayEndpointBody = founderHandoffTodayEndpoint.body || {};
  const founderHandoffTodayEndpointItems = founderHandoffTodayEndpointBody.items || [];
  const founderHandoffTodayEndpointIds = founderHandoffTodayEndpointItems.map((item) => item.id);
  const founderHandoffTodayEndpointStates = founderHandoffTodayEndpointItems.map((item) => item.handoff_state);
  const founderHandoffTodayEndpointBlockedActions = founderHandoffTodayEndpointItems.flatMap((item) =>
    Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
  );
  assert(
    founderHandoffTodayEndpointBody.mode === 'founder_handoff_today' &&
      founderHandoffTodayEndpointBody.request_path === '/api/admin/founder-handoff-today' &&
      founderHandoffTodayEndpointBody.request_method === 'GET' &&
      founderHandoffTodayEndpointBody.status === 'LOCAL_HANDOFF_ONLY' &&
      founderHandoffTodayEndpointBody.item_count === 5 &&
      founderHandoffTodayEndpointBody.handoff_item_count === 5 &&
      founderHandoffTodayEndpointBody.handoff_state_counts?.FOUNDER_EVIDENCE_REQUIRED === 1 &&
      founderHandoffTodayEndpointBody.handoff_state_counts?.FOUNDER_ACCOUNT_REQUIRED === 1 &&
      founderHandoffTodayEndpointBody.handoff_state_counts?.PUBLICATION_GO_REQUIRED === 1 &&
      founderHandoffTodayEndpointBody.handoff_state_counts?.GO_LOCAL_REVIEW_ONLY === 1 &&
      founderHandoffTodayEndpointBody.handoff_state_counts?.BLOCKED_FOR_EXTERNAL_REVIEW === 1 &&
      founderHandoffTodayEndpointIds.includes('auth_admin_live_blocker') &&
      founderHandoffTodayEndpointIds.includes('deployment_public_url_blocker') &&
      founderHandoffTodayEndpointIds.includes('homepage_publication_blocker') &&
      founderHandoffTodayEndpointIds.includes('contract_review_next_step') &&
      founderHandoffTodayEndpointIds.includes('legal_provider_finance_blocker') &&
      founderHandoffTodayEndpointStates.includes('FOUNDER_EVIDENCE_REQUIRED') &&
      founderHandoffTodayEndpointStates.includes('FOUNDER_ACCOUNT_REQUIRED') &&
      founderHandoffTodayEndpointStates.includes('PUBLICATION_GO_REQUIRED') &&
      founderHandoffTodayEndpointStates.includes('GO_LOCAL_REVIEW_ONLY') &&
      founderHandoffTodayEndpointStates.includes('BLOCKED_FOR_EXTERNAL_REVIEW') &&
      founderHandoffTodayEndpointBlockedActions.includes('admin_memberships_insert') &&
      founderHandoffTodayEndpointBlockedActions.includes('vercel_import') &&
      founderHandoffTodayEndpointBlockedActions.includes('public_index_html_replacement') &&
      founderHandoffTodayEndpointBlockedActions.includes('xpr_signature_request') &&
      founderHandoffTodayEndpointBlockedActions.includes('real_loan') &&
      founderHandoffTodayEndpointBody.blocked_live_actions?.includes('live_supabase_write') &&
      founderHandoffTodayEndpointBody.blocked_live_actions?.includes('public_url_share') &&
      founderHandoffTodayEndpointBody.blocked_live_actions?.includes('token_collateral_lock') &&
      founderHandoffTodayEndpointBody.safe_report_fields?.includes('request_id') &&
      founderHandoffTodayEndpointBody.safe_report_fields?.includes('handoff_item_id') &&
      founderHandoffTodayEndpointBody.linked_surfaces?.includes('/api/admin/beta-readiness') &&
      founderHandoffTodayEndpointBody.linked_surfaces?.includes(
        '/api/admin/admin-evidence-export-preview?source_filter=founder_handoff_today'
      ) &&
      founderHandoffTodayEndpointBody.no_magic_link_url_requested === true &&
      founderHandoffTodayEndpointBody.no_auth_token_requested === true &&
      founderHandoffTodayEndpointBody.no_service_role_key_used === true &&
      founderHandoffTodayEndpointBody.no_live_supabase_write_attempted === true &&
      founderHandoffTodayEndpointBody.no_admin_membership_insert_attempted === true &&
      founderHandoffTodayEndpointBody.no_strict_rls_apply_attempted === true &&
      founderHandoffTodayEndpointBody.no_external_account_change_attempted === true &&
      founderHandoffTodayEndpointBody.no_public_file_edit_attempted === true &&
      founderHandoffTodayEndpointBody.no_public_url_share_attempted === true &&
      founderHandoffTodayEndpointBody.no_tester_invite_attempted === true &&
      founderHandoffTodayEndpointBody.no_real_payment_attempted === true &&
      founderHandoffTodayEndpointBody.no_real_loan_attempted === true &&
      founderHandoffTodayEndpointBody.no_escrow_release_attempted === true &&
      founderHandoffTodayEndpointBody.no_repayment_routing_attempted === true &&
      founderHandoffTodayEndpointBody.no_stablecoin_settlement_attempted === true &&
      founderHandoffTodayEndpointBody.no_token_collateral_lock_attempted === true &&
      founderHandoffTodayEndpointBody.no_xpr_signature_attempted === true &&
      founderHandoffTodayEndpointBody.no_fio_registration_attempted === true &&
      founderHandoffTodayEndpointBody.no_legal_provider_decision_attempted === true &&
      founderHandoffTodayEndpointBody.no_production_release_attempted === true &&
      founderHandoffTodayEndpointBody.no_server_storage_attempted === true &&
      founderHandoffTodayEndpointBody.no_external_send_attempted === true &&
      founderHandoffTodayEndpointBody.no_live_action_attempted === true &&
      founderHandoffTodayEndpointItems.every((item) => item.no_live_action_attempted === true),
    'Founder handoff today endpoint must expose request trace metadata, five founder handoff rows, blocked live actions, safe report fields, and no-live boundaries'
  );
  assert(Array.isArray(betaReadiness.body?.week_one_closeout_handoff), 'Beta readiness must return week_one_closeout_handoff array');
  const weekOneCloseoutHandoffIds = betaReadiness.body.week_one_closeout_handoff.map((item) => item.id);
  const weekOneCloseoutHandoffStates = betaReadiness.body.week_one_closeout_handoff.map((item) => item.closeout_state);
  const weekOneCloseoutHandoffBlockedActions = betaReadiness.body.week_one_closeout_handoff.flatMap((item) =>
    Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
  );
  assert(
    weekOneCloseoutHandoffIds.includes('week_one_completed_local_surfaces') &&
      weekOneCloseoutHandoffIds.includes('week_two_auth_admin_start') &&
      weekOneCloseoutHandoffIds.includes('week_two_deploy_public_beta_hold') &&
      weekOneCloseoutHandoffIds.includes('week_two_legal_provider_review') &&
      weekOneCloseoutHandoffStates.includes('PASS_LOCAL_ONLY') &&
      weekOneCloseoutHandoffStates.includes('FOUNDER_EVIDENCE_REQUIRED') &&
      weekOneCloseoutHandoffStates.includes('FOUNDER_ACCOUNT_REQUIRED') &&
      weekOneCloseoutHandoffStates.includes('BLOCKED_FOR_EXTERNAL_REVIEW') &&
      weekOneCloseoutHandoffBlockedActions.includes('admin_memberships_insert') &&
      weekOneCloseoutHandoffBlockedActions.includes('strict_rls_apply') &&
      weekOneCloseoutHandoffBlockedActions.includes('public_url_share') &&
      weekOneCloseoutHandoffBlockedActions.includes('tester_invite') &&
      weekOneCloseoutHandoffBlockedActions.includes('payment_charge') &&
      weekOneCloseoutHandoffBlockedActions.includes('real_loan') &&
      weekOneCloseoutHandoffBlockedActions.includes('real_escrow') &&
      weekOneCloseoutHandoffBlockedActions.includes('stablecoin_settlement') &&
      weekOneCloseoutHandoffBlockedActions.includes('token_collateral_lock') &&
      weekOneCloseoutHandoffBlockedActions.includes('xpr_signature') &&
      betaReadiness.body.week_one_closeout_handoff.every((item) => item.no_secret_requested === true) &&
      betaReadiness.body.week_one_closeout_handoff.every((item) => item.no_live_supabase_write_attempted === true) &&
      betaReadiness.body.week_one_closeout_handoff.every((item) => item.no_external_account_change_attempted === true) &&
      betaReadiness.body.week_one_closeout_handoff.every((item) => item.no_deploy_setting_change_attempted === true) &&
      betaReadiness.body.week_one_closeout_handoff.every((item) => item.no_public_file_edit_attempted === true) &&
      betaReadiness.body.week_one_closeout_handoff.every((item) => item.no_public_url_share_attempted === true) &&
      betaReadiness.body.week_one_closeout_handoff.every((item) => item.no_tester_invite_attempted === true) &&
      betaReadiness.body.week_one_closeout_handoff.every((item) => item.no_live_finance_action_attempted === true) &&
      betaReadiness.body.week_one_closeout_handoff.every((item) => item.no_legal_provider_decision_attempted === true) &&
      betaReadiness.body.week_one_closeout_handoff.every((item) => item.no_production_release_attempted === true) &&
      betaReadiness.body.week_one_closeout_handoff.every((item) => item.no_live_action_attempted === true),
    'Beta readiness Week 1 closeout handoff must expose Week 2 handoff gates and no-live boundaries'
  );
  const weekOneCloseoutHandoffEndpoint = await request(baseUrl, '/api/admin/week-one-closeout-handoff', {
    headers: { 'X-Request-Id': 'gcsc-week-one-closeout-handoff-endpoint-smoke' },
  });
  assert(
    weekOneCloseoutHandoffEndpoint.status === 200,
    `Expected Week 1 closeout handoff endpoint 200, got ${weekOneCloseoutHandoffEndpoint.status}`
  );
  assert(
    weekOneCloseoutHandoffEndpoint.headers.get('x-request-id') ===
      'gcsc-week-one-closeout-handoff-endpoint-smoke' &&
      weekOneCloseoutHandoffEndpoint.body?.request_id === 'gcsc-week-one-closeout-handoff-endpoint-smoke' &&
      weekOneCloseoutHandoffEndpoint.body?.request_id_header === 'gcsc-week-one-closeout-handoff-endpoint-smoke',
    'Week 1 closeout handoff endpoint must preserve X-Request-Id in the header and JSON body'
  );
  const weekOneCloseoutHandoffEndpointBody = weekOneCloseoutHandoffEndpoint.body || {};
  const weekOneCloseoutHandoffEndpointItems = weekOneCloseoutHandoffEndpointBody.items || [];
  const weekOneCloseoutHandoffEndpointIds = weekOneCloseoutHandoffEndpointItems.map((item) => item.id);
  const weekOneCloseoutHandoffEndpointStates = weekOneCloseoutHandoffEndpointItems.map((item) => item.closeout_state);
  const weekOneCloseoutHandoffEndpointBlockedActions = weekOneCloseoutHandoffEndpointItems.flatMap((item) =>
    Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
  );
  assert(
    weekOneCloseoutHandoffEndpointBody.mode === 'week_one_closeout_handoff' &&
      weekOneCloseoutHandoffEndpointBody.request_path === '/api/admin/week-one-closeout-handoff' &&
      weekOneCloseoutHandoffEndpointBody.request_method === 'GET' &&
      weekOneCloseoutHandoffEndpointBody.status === 'LOCAL_CLOSEOUT_HANDOFF_ONLY' &&
      weekOneCloseoutHandoffEndpointBody.item_count === 4 &&
      weekOneCloseoutHandoffEndpointBody.closeout_item_count === 4 &&
      weekOneCloseoutHandoffEndpointBody.closeout_state_counts?.PASS_LOCAL_ONLY === 1 &&
      weekOneCloseoutHandoffEndpointBody.closeout_state_counts?.FOUNDER_EVIDENCE_REQUIRED === 1 &&
      weekOneCloseoutHandoffEndpointBody.closeout_state_counts?.FOUNDER_ACCOUNT_REQUIRED === 1 &&
      weekOneCloseoutHandoffEndpointBody.closeout_state_counts?.BLOCKED_FOR_EXTERNAL_REVIEW === 1 &&
      weekOneCloseoutHandoffEndpointIds.includes('week_one_completed_local_surfaces') &&
      weekOneCloseoutHandoffEndpointIds.includes('week_two_auth_admin_start') &&
      weekOneCloseoutHandoffEndpointIds.includes('week_two_deploy_public_beta_hold') &&
      weekOneCloseoutHandoffEndpointIds.includes('week_two_legal_provider_review') &&
      weekOneCloseoutHandoffEndpointStates.includes('PASS_LOCAL_ONLY') &&
      weekOneCloseoutHandoffEndpointStates.includes('FOUNDER_EVIDENCE_REQUIRED') &&
      weekOneCloseoutHandoffEndpointStates.includes('FOUNDER_ACCOUNT_REQUIRED') &&
      weekOneCloseoutHandoffEndpointStates.includes('BLOCKED_FOR_EXTERNAL_REVIEW') &&
      weekOneCloseoutHandoffEndpointBlockedActions.includes('admin_memberships_insert') &&
      weekOneCloseoutHandoffEndpointBlockedActions.includes('strict_rls_apply') &&
      weekOneCloseoutHandoffEndpointBlockedActions.includes('public_url_share') &&
      weekOneCloseoutHandoffEndpointBlockedActions.includes('tester_invite') &&
      weekOneCloseoutHandoffEndpointBlockedActions.includes('payment_charge') &&
      weekOneCloseoutHandoffEndpointBlockedActions.includes('real_loan') &&
      weekOneCloseoutHandoffEndpointBlockedActions.includes('real_escrow') &&
      weekOneCloseoutHandoffEndpointBlockedActions.includes('stablecoin_settlement') &&
      weekOneCloseoutHandoffEndpointBlockedActions.includes('token_collateral_lock') &&
      weekOneCloseoutHandoffEndpointBlockedActions.includes('xpr_signature') &&
      weekOneCloseoutHandoffEndpointBody.safe_report_fields?.includes('request_id') &&
      weekOneCloseoutHandoffEndpointBody.safe_report_fields?.includes('closeout_item_id') &&
      weekOneCloseoutHandoffEndpointBody.linked_surfaces?.includes('/api/admin/beta-readiness') &&
      weekOneCloseoutHandoffEndpointBody.linked_surfaces?.includes(
        '/api/admin/admin-evidence-export-preview?source_filter=week_one_closeout_handoff'
      ) &&
      weekOneCloseoutHandoffEndpointBody.no_magic_link_url_requested === true &&
      weekOneCloseoutHandoffEndpointBody.no_auth_token_requested === true &&
      weekOneCloseoutHandoffEndpointBody.no_service_role_key_used === true &&
      weekOneCloseoutHandoffEndpointBody.no_live_supabase_write_attempted === true &&
      weekOneCloseoutHandoffEndpointBody.no_admin_membership_insert_attempted === true &&
      weekOneCloseoutHandoffEndpointBody.no_strict_rls_apply_attempted === true &&
      weekOneCloseoutHandoffEndpointBody.no_external_account_change_attempted === true &&
      weekOneCloseoutHandoffEndpointBody.no_deploy_setting_change_attempted === true &&
      weekOneCloseoutHandoffEndpointBody.no_public_file_edit_attempted === true &&
      weekOneCloseoutHandoffEndpointBody.no_public_url_share_attempted === true &&
      weekOneCloseoutHandoffEndpointBody.no_tester_invite_attempted === true &&
      weekOneCloseoutHandoffEndpointBody.no_real_payment_attempted === true &&
      weekOneCloseoutHandoffEndpointBody.no_real_loan_attempted === true &&
      weekOneCloseoutHandoffEndpointBody.no_escrow_release_attempted === true &&
      weekOneCloseoutHandoffEndpointBody.no_repayment_routing_attempted === true &&
      weekOneCloseoutHandoffEndpointBody.no_stablecoin_settlement_attempted === true &&
      weekOneCloseoutHandoffEndpointBody.no_token_collateral_lock_attempted === true &&
      weekOneCloseoutHandoffEndpointBody.no_xpr_signature_attempted === true &&
      weekOneCloseoutHandoffEndpointBody.no_fio_registration_attempted === true &&
      weekOneCloseoutHandoffEndpointBody.no_legal_provider_decision_attempted === true &&
      weekOneCloseoutHandoffEndpointBody.no_production_release_attempted === true &&
      weekOneCloseoutHandoffEndpointBody.no_server_storage_attempted === true &&
      weekOneCloseoutHandoffEndpointBody.no_external_send_attempted === true &&
      weekOneCloseoutHandoffEndpointBody.no_live_action_attempted === true &&
      weekOneCloseoutHandoffEndpointItems.every((item) => item.no_live_action_attempted === true),
    'Week 1 closeout handoff endpoint must expose request trace metadata, four closeout rows, blocked live actions, safe report fields, and no-live boundaries'
  );
  assert(
    Array.isArray(betaReadiness.body?.investor_founder_package_readiness),
    'Beta readiness must return investor_founder_package_readiness array'
  );
  const investorFounderPackageReadinessIds = betaReadiness.body.investor_founder_package_readiness.map((item) => item.id);
  const investorFounderPackageReadinessStates = betaReadiness.body.investor_founder_package_readiness.map(
    (item) => item.readiness_state
  );
  const investorFounderPackageBlockedActions = betaReadiness.body.investor_founder_package_readiness.flatMap((item) =>
    Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : []
  );
  const investorFounderPackageBlockedClaims = betaReadiness.body.investor_founder_package_readiness.flatMap((item) =>
    Array.isArray(item.blocked_claims) ? item.blocked_claims : []
  );
  assert(
    investorFounderPackageReadinessIds.includes('investor_package_internal_snapshot') &&
      investorFounderPackageReadinessIds.includes('investor_package_evidence_freshness') &&
      investorFounderPackageReadinessIds.includes('investor_package_claim_review_gate') &&
      investorFounderPackageReadinessIds.includes('investor_package_send_approval_stop') &&
      investorFounderPackageReadinessStates.includes('INTERNAL_PACKAGE_ONLY') &&
      investorFounderPackageReadinessStates.includes('REFRESH_BEFORE_EXTERNAL_USE') &&
      investorFounderPackageReadinessStates.includes('HOLD_FOR_CLAIM_REVIEW') &&
      investorFounderPackageReadinessStates.includes('EXTERNAL_SEND_BLOCKED') &&
      betaReadiness.body.investor_founder_package_readiness.some(
        (item) => item.required_phrase === 'INVESTOR_PACKET_SEND_ACTION_RECORDED'
      ) &&
      investorFounderPackageBlockedClaims.includes('approved_lender') &&
      investorFounderPackageBlockedClaims.includes('licensed_escrow') &&
      investorFounderPackageBlockedClaims.includes('provider_partnership_secured') &&
      investorFounderPackageBlockedActions.includes('investor_outreach') &&
      investorFounderPackageBlockedActions.includes('grant_submission') &&
      investorFounderPackageBlockedActions.includes('provider_commitment') &&
      investorFounderPackageBlockedActions.includes('legal_conclusion') &&
      investorFounderPackageBlockedActions.includes('deck_publication') &&
      investorFounderPackageBlockedActions.includes('public_url_share') &&
      investorFounderPackageBlockedActions.includes('payment_charge') &&
      investorFounderPackageBlockedActions.includes('real_loan') &&
      investorFounderPackageBlockedActions.includes('real_escrow') &&
      investorFounderPackageBlockedActions.includes('xpr_signature') &&
      betaReadiness.body.investor_founder_package_readiness.every((item) => item.no_secret_requested === true) &&
      betaReadiness.body.investor_founder_package_readiness.every((item) => item.no_external_send_attempted === true) &&
      betaReadiness.body.investor_founder_package_readiness.every((item) => item.no_public_file_edit_attempted === true) &&
      betaReadiness.body.investor_founder_package_readiness.every((item) => item.no_public_url_share_attempted === true) &&
      betaReadiness.body.investor_founder_package_readiness.every((item) => item.no_deploy_setting_change_attempted === true) &&
      betaReadiness.body.investor_founder_package_readiness.every((item) => item.no_live_finance_action_attempted === true) &&
      betaReadiness.body.investor_founder_package_readiness.every((item) => item.no_legal_provider_decision_attempted === true) &&
      betaReadiness.body.investor_founder_package_readiness.every((item) => item.no_production_release_attempted === true) &&
      betaReadiness.body.investor_founder_package_readiness.every((item) => item.no_live_action_attempted === true),
    'Beta readiness investor/founder package readiness must expose internal package, freshness, claim review, send-stop gates, blocked claims/actions, and no-live boundaries'
  );
  const investorFounderPackageReadinessEndpoint = await request(baseUrl, '/api/admin/investor-founder-package-readiness', {
    headers: { 'X-Request-Id': 'gcsc-investor-founder-package-readiness-endpoint-smoke' },
  });
  assert(
    investorFounderPackageReadinessEndpoint.status === 200,
    `Expected investor/founder package readiness endpoint 200, got ${investorFounderPackageReadinessEndpoint.status}`
  );
  assert(
    investorFounderPackageReadinessEndpoint.headers.get('x-request-id') ===
      'gcsc-investor-founder-package-readiness-endpoint-smoke' &&
      investorFounderPackageReadinessEndpoint.body?.request_id ===
        'gcsc-investor-founder-package-readiness-endpoint-smoke' &&
      investorFounderPackageReadinessEndpoint.body?.request_id_header ===
        'gcsc-investor-founder-package-readiness-endpoint-smoke',
    'Investor/founder package readiness endpoint must preserve X-Request-Id in the header and JSON body'
  );
  const investorFounderPackageReadinessEndpointBody = investorFounderPackageReadinessEndpoint.body || {};
  const investorFounderPackageReadinessEndpointItems = investorFounderPackageReadinessEndpointBody.items || [];
  const investorFounderPackageReadinessEndpointIds = investorFounderPackageReadinessEndpointItems.map((item) => item.id);
  const investorFounderPackageReadinessEndpointStates = investorFounderPackageReadinessEndpointItems.map(
    (item) => item.readiness_state
  );
  const investorFounderPackageReadinessEndpointBlockedActions = investorFounderPackageReadinessEndpointItems.flatMap(
    (item) => (Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : [])
  );
  const investorFounderPackageReadinessEndpointBlockedClaims = investorFounderPackageReadinessEndpointItems.flatMap(
    (item) => (Array.isArray(item.blocked_claims) ? item.blocked_claims : [])
  );
  assert(
    investorFounderPackageReadinessEndpointBody.mode === 'investor_founder_package_readiness' &&
      investorFounderPackageReadinessEndpointBody.request_path === '/api/admin/investor-founder-package-readiness' &&
      investorFounderPackageReadinessEndpointBody.request_method === 'GET' &&
      investorFounderPackageReadinessEndpointBody.status === 'LOCAL_PACKAGE_REVIEW_ONLY' &&
      investorFounderPackageReadinessEndpointBody.item_count === 4 &&
      investorFounderPackageReadinessEndpointBody.readiness_item_count === 4 &&
      investorFounderPackageReadinessEndpointBody.readiness_state_counts?.INTERNAL_PACKAGE_ONLY === 1 &&
      investorFounderPackageReadinessEndpointBody.readiness_state_counts?.REFRESH_BEFORE_EXTERNAL_USE === 1 &&
      investorFounderPackageReadinessEndpointBody.readiness_state_counts?.HOLD_FOR_CLAIM_REVIEW === 1 &&
      investorFounderPackageReadinessEndpointBody.readiness_state_counts?.EXTERNAL_SEND_BLOCKED === 1 &&
      investorFounderPackageReadinessEndpointIds.includes('investor_package_internal_snapshot') &&
      investorFounderPackageReadinessEndpointIds.includes('investor_package_evidence_freshness') &&
      investorFounderPackageReadinessEndpointIds.includes('investor_package_claim_review_gate') &&
      investorFounderPackageReadinessEndpointIds.includes('investor_package_send_approval_stop') &&
      investorFounderPackageReadinessEndpointStates.includes('INTERNAL_PACKAGE_ONLY') &&
      investorFounderPackageReadinessEndpointStates.includes('REFRESH_BEFORE_EXTERNAL_USE') &&
      investorFounderPackageReadinessEndpointStates.includes('HOLD_FOR_CLAIM_REVIEW') &&
      investorFounderPackageReadinessEndpointStates.includes('EXTERNAL_SEND_BLOCKED') &&
      investorFounderPackageReadinessEndpointItems.some(
        (item) => item.required_phrase === 'INVESTOR_PACKET_SEND_ACTION_RECORDED'
      ) &&
      investorFounderPackageReadinessEndpointBlockedClaims.includes('approved_lender') &&
      investorFounderPackageReadinessEndpointBlockedClaims.includes('licensed_escrow') &&
      investorFounderPackageReadinessEndpointBlockedClaims.includes('provider_partnership_secured') &&
      investorFounderPackageReadinessEndpointBlockedActions.includes('investor_outreach') &&
      investorFounderPackageReadinessEndpointBlockedActions.includes('grant_submission') &&
      investorFounderPackageReadinessEndpointBlockedActions.includes('provider_commitment') &&
      investorFounderPackageReadinessEndpointBlockedActions.includes('legal_conclusion') &&
      investorFounderPackageReadinessEndpointBlockedActions.includes('deck_publication') &&
      investorFounderPackageReadinessEndpointBlockedActions.includes('public_url_share') &&
      investorFounderPackageReadinessEndpointBlockedActions.includes('payment_charge') &&
      investorFounderPackageReadinessEndpointBlockedActions.includes('real_loan') &&
      investorFounderPackageReadinessEndpointBlockedActions.includes('real_escrow') &&
      investorFounderPackageReadinessEndpointBlockedActions.includes('xpr_signature') &&
      investorFounderPackageReadinessEndpointBody.safe_report_fields?.includes('request_id') &&
      investorFounderPackageReadinessEndpointBody.safe_report_fields?.includes('readiness_item_id') &&
      investorFounderPackageReadinessEndpointBody.linked_surfaces?.includes('/api/admin/beta-readiness') &&
      investorFounderPackageReadinessEndpointBody.linked_surfaces?.includes(
        '/api/admin/admin-evidence-export-preview?source_filter=investor_founder_package_readiness'
      ) &&
      investorFounderPackageReadinessEndpointBody.no_recipient_contact_data_requested === true &&
      investorFounderPackageReadinessEndpointBody.no_external_send_attempted === true &&
      investorFounderPackageReadinessEndpointBody.no_investor_outreach_attempted === true &&
      investorFounderPackageReadinessEndpointBody.no_grant_submission_attempted === true &&
      investorFounderPackageReadinessEndpointBody.no_publication_attempted === true &&
      investorFounderPackageReadinessEndpointBody.no_public_file_edit_attempted === true &&
      investorFounderPackageReadinessEndpointBody.no_public_url_share_attempted === true &&
      investorFounderPackageReadinessEndpointBody.no_public_claim_approval_attempted === true &&
      investorFounderPackageReadinessEndpointBody.no_deploy_setting_change_attempted === true &&
      investorFounderPackageReadinessEndpointBody.no_real_payment_attempted === true &&
      investorFounderPackageReadinessEndpointBody.no_real_loan_attempted === true &&
      investorFounderPackageReadinessEndpointBody.no_escrow_release_attempted === true &&
      investorFounderPackageReadinessEndpointBody.no_repayment_routing_attempted === true &&
      investorFounderPackageReadinessEndpointBody.no_stablecoin_settlement_attempted === true &&
      investorFounderPackageReadinessEndpointBody.no_token_collateral_lock_attempted === true &&
      investorFounderPackageReadinessEndpointBody.no_xpr_signature_attempted === true &&
      investorFounderPackageReadinessEndpointBody.no_fio_registration_attempted === true &&
      investorFounderPackageReadinessEndpointBody.no_legal_provider_decision_attempted === true &&
      investorFounderPackageReadinessEndpointBody.no_production_release_attempted === true &&
      investorFounderPackageReadinessEndpointBody.no_server_storage_attempted === true &&
      investorFounderPackageReadinessEndpointBody.no_live_action_attempted === true &&
      investorFounderPackageReadinessEndpointItems.every((item) => item.no_live_action_attempted === true),
    'Investor/founder package readiness endpoint must expose request trace metadata, four readiness rows, blocked claims/actions, safe report fields, and no-live boundaries'
  );
  assert(
    Array.isArray(betaReadiness.body?.week_two_investor_founder_package_alignment),
    'Beta readiness must return week_two_investor_founder_package_alignment array'
  );
  const weekTwoInvestorAlignmentIds = betaReadiness.body.week_two_investor_founder_package_alignment.map((item) => item.id);
  const weekTwoInvestorAlignmentStates = betaReadiness.body.week_two_investor_founder_package_alignment.map(
    (item) => item.alignment_state
  );
  const weekTwoInvestorAlignmentAreas = betaReadiness.body.week_two_investor_founder_package_alignment.map(
    (item) => item.alignment_area
  );
  const weekTwoInvestorAlignmentBlockedActions = betaReadiness.body.week_two_investor_founder_package_alignment.flatMap(
    (item) => (Array.isArray(item.blocked_live_actions) ? item.blocked_live_actions : [])
  );
  const weekTwoInvestorAlignmentBlockedClaims = betaReadiness.body.week_two_investor_founder_package_alignment.flatMap(
    (item) => (Array.isArray(item.blocked_claims) ? item.blocked_claims : [])
  );
  assert(
    weekTwoInvestorAlignmentIds.includes('week_two_investor_live_finance_claim_alignment') &&
      weekTwoInvestorAlignmentIds.includes('week_two_investor_escrow_token_claim_alignment') &&
      weekTwoInvestorAlignmentIds.includes('week_two_investor_ai_authority_claim_alignment') &&
      weekTwoInvestorAlignmentIds.includes('week_two_investor_external_send_stop_gate') &&
      weekTwoInvestorAlignmentStates.includes('LIVE_FINANCE_CLAIMS_REVIEW_REQUIRED') &&
      weekTwoInvestorAlignmentStates.includes('ESCROW_TOKEN_CLAIMS_REVIEW_REQUIRED') &&
      weekTwoInvestorAlignmentStates.includes('AI_AUTHORITY_CLAIMS_REVIEW_REQUIRED') &&
      weekTwoInvestorAlignmentStates.includes('EXTERNAL_SEND_APPROVAL_BLOCKED') &&
      weekTwoInvestorAlignmentAreas.includes('live_finance_claims') &&
      weekTwoInvestorAlignmentAreas.includes('escrow_token_claims') &&
      weekTwoInvestorAlignmentAreas.includes('ai_authority_claims') &&
      weekTwoInvestorAlignmentAreas.includes('external_send_stop_gate') &&
      betaReadiness.body.week_two_investor_founder_package_alignment.some(
        (item) => item.required_phrase === 'INVESTOR_PACKET_SEND_ACTION_RECORDED'
      ) &&
      weekTwoInvestorAlignmentBlockedClaims.includes('live_loan_available') &&
      weekTwoInvestorAlignmentBlockedClaims.includes('token_collateral_live') &&
      weekTwoInvestorAlignmentBlockedClaims.includes('ai_credit_approval') &&
      weekTwoInvestorAlignmentBlockedClaims.includes('deck_publication_approval') &&
      weekTwoInvestorAlignmentBlockedActions.includes('investor_outreach') &&
      weekTwoInvestorAlignmentBlockedActions.includes('grant_submission') &&
      weekTwoInvestorAlignmentBlockedActions.includes('provider_outreach') &&
      weekTwoInvestorAlignmentBlockedActions.includes('attorney_outreach') &&
      weekTwoInvestorAlignmentBlockedActions.includes('external_send') &&
      weekTwoInvestorAlignmentBlockedActions.includes('deck_publication') &&
      weekTwoInvestorAlignmentBlockedActions.includes('public_url_share') &&
      weekTwoInvestorAlignmentBlockedActions.includes('public_claim_approval') &&
      weekTwoInvestorAlignmentBlockedActions.includes('live_finance_claim') &&
      weekTwoInvestorAlignmentBlockedActions.includes('real_payment') &&
      weekTwoInvestorAlignmentBlockedActions.includes('real_loan') &&
      weekTwoInvestorAlignmentBlockedActions.includes('real_escrow') &&
      weekTwoInvestorAlignmentBlockedActions.includes('stablecoin_settlement') &&
      weekTwoInvestorAlignmentBlockedActions.includes('token_collateral_lock') &&
      weekTwoInvestorAlignmentBlockedActions.includes('token_custody') &&
      weekTwoInvestorAlignmentBlockedActions.includes('xpr_signature') &&
      weekTwoInvestorAlignmentBlockedActions.includes('fio_registration') &&
      weekTwoInvestorAlignmentBlockedActions.includes('metallicus_partnership_claim') &&
      weekTwoInvestorAlignmentBlockedActions.includes('ai_credit_approval_claim') &&
      weekTwoInvestorAlignmentBlockedActions.includes('ai_legal_decision_claim') &&
      betaReadiness.body.week_two_investor_founder_package_alignment.every((item) => item.no_secret_requested === true) &&
      betaReadiness.body.week_two_investor_founder_package_alignment.every((item) => item.no_external_send_attempted === true) &&
      betaReadiness.body.week_two_investor_founder_package_alignment.every((item) => item.no_investor_outreach_attempted === true) &&
      betaReadiness.body.week_two_investor_founder_package_alignment.every((item) => item.no_grant_submission_attempted === true) &&
      betaReadiness.body.week_two_investor_founder_package_alignment.every((item) => item.no_provider_outreach_attempted === true) &&
      betaReadiness.body.week_two_investor_founder_package_alignment.every((item) => item.no_publication_attempted === true) &&
      betaReadiness.body.week_two_investor_founder_package_alignment.every((item) => item.no_public_url_share_attempted === true) &&
      betaReadiness.body.week_two_investor_founder_package_alignment.every((item) => item.no_live_finance_action_attempted === true) &&
      betaReadiness.body.week_two_investor_founder_package_alignment.every((item) => item.no_public_claim_approval_attempted === true) &&
      betaReadiness.body.week_two_investor_founder_package_alignment.every((item) => item.no_xpr_signature_attempted === true) &&
      betaReadiness.body.week_two_investor_founder_package_alignment.every((item) => item.no_fio_registration_attempted === true) &&
      betaReadiness.body.week_two_investor_founder_package_alignment.every((item) => item.no_legal_provider_decision_attempted === true) &&
      betaReadiness.body.week_two_investor_founder_package_alignment.every((item) => item.no_production_release_attempted === true) &&
      betaReadiness.body.week_two_investor_founder_package_alignment.every((item) => item.no_live_action_attempted === true),
    'Beta readiness Week 2 investor/founder package alignment must expose alignment rows, blocked claims/actions, and no-outreach/no-publication/no-finance/no-XPR/FIO/no-live boundaries'
  );
  assert(
    Array.isArray(betaReadiness.body?.week_two_investor_founder_package_execution_checklist),
    'Beta readiness must return week_two_investor_founder_package_execution_checklist array'
  );
  const weekTwoInvestorExecutionIds = betaReadiness.body.week_two_investor_founder_package_execution_checklist.map(
    (item) => item.id
  );
  const weekTwoInvestorExecutionStates =
    betaReadiness.body.week_two_investor_founder_package_execution_checklist.map((item) => item.readiness_state);
  const weekTwoInvestorExecutionPhases =
    betaReadiness.body.week_two_investor_founder_package_execution_checklist.map((item) => item.execution_phase);
  const weekTwoInvestorExecutionAreas =
    betaReadiness.body.week_two_investor_founder_package_execution_checklist.map((item) => item.review_area);
  const weekTwoInvestorExecutionBlockedActions =
    betaReadiness.body.week_two_investor_founder_package_execution_checklist.flatMap(
      (item) => item.blocked_live_actions || []
    );
  assert(
    weekTwoInvestorExecutionIds.includes('week_two_investor_packet_review_report_back_intake') &&
      weekTwoInvestorExecutionIds.includes('week_two_investor_claim_correction_hold') &&
      weekTwoInvestorExecutionIds.includes('week_two_investor_external_send_request_hold') &&
      weekTwoInvestorExecutionIds.includes('week_two_investor_followup_response_hold') &&
      weekTwoInvestorExecutionStates.includes('INVESTOR_PACKET_REVIEW_REPORT_BACK_REQUIRED') &&
      weekTwoInvestorExecutionStates.includes('INVESTOR_CLAIM_CORRECTION_HELD') &&
      weekTwoInvestorExecutionStates.includes('INVESTOR_EXTERNAL_SEND_REQUEST_HELD') &&
      weekTwoInvestorExecutionStates.includes('INVESTOR_FOLLOWUP_RESPONSE_HELD') &&
      weekTwoInvestorExecutionPhases.includes('packet_review_report_back') &&
      weekTwoInvestorExecutionPhases.includes('claim_correction_hold') &&
      weekTwoInvestorExecutionPhases.includes('external_send_request_hold') &&
      weekTwoInvestorExecutionPhases.includes('followup_response_hold') &&
      weekTwoInvestorExecutionAreas.includes('packet_review') &&
      weekTwoInvestorExecutionAreas.includes('claim_review') &&
      weekTwoInvestorExecutionAreas.includes('external_send') &&
      weekTwoInvestorExecutionAreas.includes('followup') &&
      weekTwoInvestorExecutionBlockedActions.includes('recipient_data_collection') &&
      weekTwoInvestorExecutionBlockedActions.includes('investor_outreach') &&
      weekTwoInvestorExecutionBlockedActions.includes('grant_submission') &&
      weekTwoInvestorExecutionBlockedActions.includes('provider_outreach') &&
      weekTwoInvestorExecutionBlockedActions.includes('attorney_outreach') &&
      weekTwoInvestorExecutionBlockedActions.includes('external_send') &&
      weekTwoInvestorExecutionBlockedActions.includes('deck_publication') &&
      weekTwoInvestorExecutionBlockedActions.includes('public_claim_approval') &&
      weekTwoInvestorExecutionBlockedActions.includes('live_finance_claim') &&
      weekTwoInvestorExecutionBlockedActions.includes('real_payment') &&
      weekTwoInvestorExecutionBlockedActions.includes('real_loan') &&
      weekTwoInvestorExecutionBlockedActions.includes('real_escrow') &&
      weekTwoInvestorExecutionBlockedActions.includes('stablecoin_settlement') &&
      weekTwoInvestorExecutionBlockedActions.includes('token_collateral_lock') &&
      weekTwoInvestorExecutionBlockedActions.includes('token_custody') &&
      weekTwoInvestorExecutionBlockedActions.includes('xpr_signature') &&
      weekTwoInvestorExecutionBlockedActions.includes('fio_registration') &&
      weekTwoInvestorExecutionBlockedActions.includes('metallicus_partnership_claim') &&
      weekTwoInvestorExecutionBlockedActions.includes('ai_credit_approval_claim') &&
      weekTwoInvestorExecutionBlockedActions.includes('ai_legal_decision_claim') &&
      weekTwoInvestorExecutionBlockedActions.includes('production_release') &&
      betaReadiness.body.week_two_investor_founder_package_execution_checklist.every(
        (item) => item.no_secret_requested === true
      ) &&
      betaReadiness.body.week_two_investor_founder_package_execution_checklist.every(
        (item) => item.no_recipient_contact_data_requested === true
      ) &&
      betaReadiness.body.week_two_investor_founder_package_execution_checklist.every(
        (item) => item.no_external_send_attempted === true
      ) &&
      betaReadiness.body.week_two_investor_founder_package_execution_checklist.every(
        (item) => item.no_investor_outreach_attempted === true
      ) &&
      betaReadiness.body.week_two_investor_founder_package_execution_checklist.every(
        (item) => item.no_grant_submission_attempted === true
      ) &&
      betaReadiness.body.week_two_investor_founder_package_execution_checklist.every(
        (item) => item.no_provider_outreach_attempted === true
      ) &&
      betaReadiness.body.week_two_investor_founder_package_execution_checklist.every(
        (item) => item.no_publication_attempted === true
      ) &&
      betaReadiness.body.week_two_investor_founder_package_execution_checklist.every(
        (item) => item.no_public_url_share_attempted === true
      ) &&
      betaReadiness.body.week_two_investor_founder_package_execution_checklist.every(
        (item) => item.no_live_finance_action_attempted === true
      ) &&
      betaReadiness.body.week_two_investor_founder_package_execution_checklist.every(
        (item) => item.no_public_claim_approval_attempted === true
      ) &&
      betaReadiness.body.week_two_investor_founder_package_execution_checklist.every(
        (item) => item.no_xpr_signature_attempted === true
      ) &&
      betaReadiness.body.week_two_investor_founder_package_execution_checklist.every(
        (item) => item.no_fio_registration_attempted === true
      ) &&
      betaReadiness.body.week_two_investor_founder_package_execution_checklist.every(
        (item) => item.no_legal_provider_decision_attempted === true
      ) &&
      betaReadiness.body.week_two_investor_founder_package_execution_checklist.every(
        (item) => item.no_production_release_attempted === true
      ) &&
      betaReadiness.body.week_two_investor_founder_package_execution_checklist.every(
        (item) => item.no_live_action_attempted === true
      ),
    'Beta readiness Week 2 investor/founder package execution checklist must expose execution rows and no-recipient/no-outreach/no-publication/no-finance/no-XPR/FIO/no-live boundaries'
  );
  assert(
    Array.isArray(betaReadiness.body?.payment_intent_ownership_readiness),
    'Beta readiness must return payment_intent_ownership_readiness array'
  );
  const betaPaymentOwnershipIds = betaReadiness.body.payment_intent_ownership_readiness.map((item) => item.id);
  const betaPaymentOwnershipStates = betaReadiness.body.payment_intent_ownership_readiness.map(
    (item) => item.readiness_state
  );
  const betaPaymentOwnershipPhases = betaReadiness.body.payment_intent_ownership_readiness.map(
    (item) => item.readiness_phase
  );
  const betaPaymentOwnershipBlockedActions = betaReadiness.body.payment_intent_ownership_readiness.flatMap(
    (item) => item.blocked_live_actions || []
  );
  const betaPaymentOwnershipColumns = betaReadiness.body.payment_intent_ownership_readiness.flatMap(
    (item) => item.typed_ownership_columns || []
  );
  assert(
    betaPaymentOwnershipIds.includes('payment_intent_ownership_sql_draft_review') &&
      betaPaymentOwnershipIds.includes('payment_intent_participant_mapping_review') &&
      betaPaymentOwnershipIds.includes('payment_intent_backend_write_boundary') &&
      betaPaymentOwnershipIds.includes('payment_intent_live_rls_stop_gate') &&
      betaPaymentOwnershipStates.includes('SQL_DRAFT_VALIDATED_LOCAL_ONLY') &&
      betaPaymentOwnershipStates.includes('PARTICIPANT_MAPPING_REVIEW_REQUIRED') &&
      betaPaymentOwnershipStates.includes('BACKEND_WRITES_ONLY_HELD') &&
      betaPaymentOwnershipStates.includes('LIVE_RLS_APPLY_BLOCKED_FOR_FOUNDER') &&
      betaPaymentOwnershipPhases.includes('sql_draft_review') &&
      betaPaymentOwnershipPhases.includes('participant_mapping') &&
      betaPaymentOwnershipPhases.includes('backend_write_boundary') &&
      betaPaymentOwnershipPhases.includes('live_rls_stop_gate') &&
      betaPaymentOwnershipColumns.includes('payer_profile_id') &&
      betaPaymentOwnershipColumns.includes('homeowner_id') &&
      betaPaymentOwnershipColumns.includes('contractor_id') &&
      betaPaymentOwnershipColumns.includes('job_id') &&
      betaPaymentOwnershipColumns.includes('loan_id') &&
      betaPaymentOwnershipColumns.includes('project_contract_id') &&
      betaPaymentOwnershipColumns.includes('milestone_id') &&
      betaPaymentOwnershipBlockedActions.includes('payment_intents_sql_apply') &&
      betaPaymentOwnershipBlockedActions.includes('strict_rls_apply') &&
      betaPaymentOwnershipBlockedActions.includes('service_role_key_use') &&
      betaPaymentOwnershipBlockedActions.includes('real_payment') &&
      betaPaymentOwnershipBlockedActions.includes('xpr_transfer') &&
      betaPaymentOwnershipBlockedActions.includes('stablecoin_settlement') &&
      betaPaymentOwnershipBlockedActions.includes('escrow_release') &&
      betaPaymentOwnershipBlockedActions.includes('repayment_routing') &&
      betaPaymentOwnershipBlockedActions.includes('token_collateral_lock') &&
      betaReadiness.body.payment_intent_ownership_readiness.every((item) => item.no_secret_requested === true) &&
      betaReadiness.body.payment_intent_ownership_readiness.every(
        (item) => item.no_live_supabase_write_attempted === true
      ) &&
      betaReadiness.body.payment_intent_ownership_readiness.every(
        (item) => item.no_payment_sql_apply_attempted === true
      ) &&
      betaReadiness.body.payment_intent_ownership_readiness.every(
        (item) => item.no_strict_rls_apply_attempted === true
      ) &&
      betaReadiness.body.payment_intent_ownership_readiness.every(
        (item) => item.no_payment_provider_activation_attempted === true
      ) &&
      betaReadiness.body.payment_intent_ownership_readiness.every(
        (item) => item.no_real_payment_attempted === true
      ) &&
      betaReadiness.body.payment_intent_ownership_readiness.every(
        (item) => item.no_stablecoin_settlement_attempted === true
      ) &&
      betaReadiness.body.payment_intent_ownership_readiness.every(
        (item) => item.no_token_collateral_lock_attempted === true
      ) &&
      betaReadiness.body.payment_intent_ownership_readiness.every((item) => item.no_live_action_attempted === true),
    'Beta readiness payment intent ownership must expose ownership rows, typed columns, and no-SQL/no-payment/no-live boundaries'
  );
  assert(
    Array.isArray(betaReadiness.body?.week_two_local_validation_pass_readiness),
    'Beta readiness must return week_two_local_validation_pass_readiness array'
  );
  const weekTwoValidationIds = betaReadiness.body.week_two_local_validation_pass_readiness.map((item) => item.id);
  const weekTwoValidationStates = betaReadiness.body.week_two_local_validation_pass_readiness.map(
    (item) => item.readiness_state
  );
  const weekTwoValidationPhases = betaReadiness.body.week_two_local_validation_pass_readiness.map(
    (item) => item.validation_phase
  );
  const weekTwoValidationBlockedActions = betaReadiness.body.week_two_local_validation_pass_readiness.flatMap(
    (item) => item.blocked_live_actions || []
  );
  assert(
    weekTwoValidationIds.includes('week_two_validation_targeted_checks_queue') &&
      weekTwoValidationIds.includes('week_two_validation_public_file_guard') &&
      weekTwoValidationIds.includes('week_two_validation_evidence_report_back') &&
      weekTwoValidationIds.includes('week_two_validation_failure_triage_hold') &&
      weekTwoValidationStates.includes('TARGETED_VALIDATION_QUEUE_READY') &&
      weekTwoValidationStates.includes('PUBLIC_FILE_GUARD_REQUIRED') &&
      weekTwoValidationStates.includes('VALIDATION_EVIDENCE_REPORT_BACK_REQUIRED') &&
      weekTwoValidationStates.includes('FAILED_CHECK_TRIAGE_HELD') &&
      weekTwoValidationPhases.includes('targeted_checks') &&
      weekTwoValidationPhases.includes('public_file_guard') &&
      weekTwoValidationPhases.includes('evidence_report_back') &&
      weekTwoValidationPhases.includes('failure_triage_hold') &&
      weekTwoValidationBlockedActions.includes('secret_entry') &&
      weekTwoValidationBlockedActions.includes('live_supabase_write') &&
      weekTwoValidationBlockedActions.includes('strict_rls_apply') &&
      weekTwoValidationBlockedActions.includes('public_whitepaper_html_replacement') &&
      weekTwoValidationBlockedActions.includes('destructive_git_action') &&
      weekTwoValidationBlockedActions.includes('production_release') &&
      betaReadiness.body.week_two_local_validation_pass_readiness.every((item) => item.no_secret_requested === true) &&
      betaReadiness.body.week_two_local_validation_pass_readiness.every(
        (item) => item.no_strict_rls_apply_attempted === true
      ) &&
      betaReadiness.body.week_two_local_validation_pass_readiness.every(
        (item) => item.no_public_file_edit_attempted === true
      ) &&
      betaReadiness.body.week_two_local_validation_pass_readiness.every(
        (item) => item.no_destructive_git_action_attempted === true
      ) &&
      betaReadiness.body.week_two_local_validation_pass_readiness.every((item) => item.no_live_action_attempted === true),
    'Beta readiness Week 2 local validation pass readiness must expose validation rows and no-live/no-public/no-destructive boundaries'
  );
  assert(
    Array.isArray(betaReadiness.body?.week_two_local_validation_pass_execution_checklist),
    'Beta readiness must return week_two_local_validation_pass_execution_checklist array'
  );
  const weekTwoValidationExecutionIds =
    betaReadiness.body.week_two_local_validation_pass_execution_checklist.map((item) => item.id);
  const weekTwoValidationExecutionStates =
    betaReadiness.body.week_two_local_validation_pass_execution_checklist.map((item) => item.readiness_state);
  const weekTwoValidationExecutionPhases =
    betaReadiness.body.week_two_local_validation_pass_execution_checklist.map((item) => item.execution_phase);
  const weekTwoValidationExecutionBlockedActions =
    betaReadiness.body.week_two_local_validation_pass_execution_checklist.flatMap(
      (item) => item.blocked_live_actions || []
    );
  assert(
    weekTwoValidationExecutionIds.includes('week_two_validation_command_run_order_hold') &&
      weekTwoValidationExecutionIds.includes('week_two_validation_public_file_diff_hold') &&
      weekTwoValidationExecutionIds.includes('week_two_validation_failure_rerun_hold') &&
      weekTwoValidationExecutionIds.includes('week_two_validation_commit_report_hold') &&
      weekTwoValidationExecutionStates.includes('VALIDATION_COMMAND_RUN_ORDER_HELD') &&
      weekTwoValidationExecutionStates.includes('PUBLIC_FILE_DIFF_HELD') &&
      weekTwoValidationExecutionStates.includes('FAILED_VALIDATION_RERUN_HELD') &&
      weekTwoValidationExecutionStates.includes('VALIDATION_COMMIT_REPORT_HELD') &&
      weekTwoValidationExecutionPhases.includes('command_run_order_hold') &&
      weekTwoValidationExecutionPhases.includes('public_file_diff_hold') &&
      weekTwoValidationExecutionPhases.includes('failure_rerun_hold') &&
      weekTwoValidationExecutionPhases.includes('commit_report_hold') &&
      weekTwoValidationExecutionBlockedActions.includes('secret_entry') &&
      weekTwoValidationExecutionBlockedActions.includes('live_supabase_write') &&
      weekTwoValidationExecutionBlockedActions.includes('strict_rls_apply') &&
      weekTwoValidationExecutionBlockedActions.includes('public_whitepaper_html_replacement') &&
      weekTwoValidationExecutionBlockedActions.includes('destructive_git_action') &&
      weekTwoValidationExecutionBlockedActions.includes('production_release') &&
      betaReadiness.body.week_two_local_validation_pass_execution_checklist.every(
        (item) => item.no_secret_requested === true
      ) &&
      betaReadiness.body.week_two_local_validation_pass_execution_checklist.every(
        (item) => item.no_strict_rls_apply_attempted === true
      ) &&
      betaReadiness.body.week_two_local_validation_pass_execution_checklist.every(
        (item) => item.no_public_file_edit_attempted === true
      ) &&
      betaReadiness.body.week_two_local_validation_pass_execution_checklist.every(
        (item) => item.no_destructive_git_action_attempted === true
      ) &&
      betaReadiness.body.week_two_local_validation_pass_execution_checklist.every(
        (item) => item.no_external_send_attempted === true
      ) &&
      betaReadiness.body.week_two_local_validation_pass_execution_checklist.every(
        (item) => item.no_live_action_attempted === true
      ),
    'Beta readiness Week 2 local validation pass execution checklist must expose execution rows and no-live/no-public/no-destructive boundaries'
  );
  assert(
    Array.isArray(betaReadiness.body?.week_two_two_week_closeout_readiness),
    'Beta readiness must return week_two_two_week_closeout_readiness array'
  );
  const weekTwoCloseoutIds = betaReadiness.body.week_two_two_week_closeout_readiness.map((item) => item.id);
  const weekTwoCloseoutStates = betaReadiness.body.week_two_two_week_closeout_readiness.map(
    (item) => item.readiness_state
  );
  const weekTwoCloseoutPhases = betaReadiness.body.week_two_two_week_closeout_readiness.map(
    (item) => item.checklist_phase
  );
  const weekTwoCloseoutBlockedActions = betaReadiness.body.week_two_two_week_closeout_readiness.flatMap(
    (item) => item.blocked_live_actions || []
  );
  assert(
    weekTwoCloseoutIds.includes('week_two_closeout_done_inventory_review') &&
      weekTwoCloseoutIds.includes('week_two_closeout_validation_evidence_review') &&
      weekTwoCloseoutIds.includes('week_two_closeout_founder_action_queue_review') &&
      weekTwoCloseoutIds.includes('week_two_closeout_next_plan_seed_review') &&
      weekTwoCloseoutStates.includes('DONE_INVENTORY_REVIEW_READY') &&
      weekTwoCloseoutStates.includes('VALIDATION_EVIDENCE_REVIEW_READY') &&
      weekTwoCloseoutStates.includes('FOUNDER_ACTION_QUEUE_REVIEW_READY') &&
      weekTwoCloseoutStates.includes('NEXT_TWO_WEEK_PLAN_SEED_READY') &&
      weekTwoCloseoutPhases.includes('done_inventory') &&
      weekTwoCloseoutPhases.includes('validation_evidence') &&
      weekTwoCloseoutPhases.includes('founder_actions') &&
      weekTwoCloseoutPhases.includes('next_plan_seed') &&
      weekTwoCloseoutBlockedActions.includes('magic_link_url_paste') &&
      weekTwoCloseoutBlockedActions.includes('service_role_key_use') &&
      weekTwoCloseoutBlockedActions.includes('admin_membership_insert') &&
      weekTwoCloseoutBlockedActions.includes('external_send') &&
      weekTwoCloseoutBlockedActions.includes('public_whitepaper_html_replacement') &&
      weekTwoCloseoutBlockedActions.includes('stablecoin_settlement') &&
      weekTwoCloseoutBlockedActions.includes('token_collateral_lock') &&
      weekTwoCloseoutBlockedActions.includes('xpr_signature') &&
      weekTwoCloseoutBlockedActions.includes('fio_registration') &&
      weekTwoCloseoutBlockedActions.includes('destructive_git_action') &&
      weekTwoCloseoutBlockedActions.includes('production_release') &&
      betaReadiness.body.week_two_two_week_closeout_readiness.every((item) => item.no_secret_requested === true) &&
      betaReadiness.body.week_two_two_week_closeout_readiness.every(
        (item) => item.no_magic_link_url_requested === true
      ) &&
      betaReadiness.body.week_two_two_week_closeout_readiness.every(
        (item) => item.no_admin_membership_insert_attempted === true
      ) &&
      betaReadiness.body.week_two_two_week_closeout_readiness.every(
        (item) => item.no_external_send_attempted === true
      ) &&
      betaReadiness.body.week_two_two_week_closeout_readiness.every(
        (item) => item.no_public_file_edit_attempted === true
      ) &&
      betaReadiness.body.week_two_two_week_closeout_readiness.every(
        (item) => item.no_live_finance_action_attempted === true
      ) &&
      betaReadiness.body.week_two_two_week_closeout_readiness.every(
        (item) => item.no_destructive_git_action_attempted === true
      ) &&
      betaReadiness.body.week_two_two_week_closeout_readiness.every((item) => item.no_live_action_attempted === true),
    'Beta readiness Week 2 two-week closeout readiness must expose closeout rows and no-secret/no-live/no-public/no-external/no-finance/no-XPR/FIO boundaries'
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
      week_two_auth_admin_readiness: weekTwoAuthAdminReadiness.status,
      week_two_auth_admin_execution_checklist: weekTwoAuthAdminExecutionChecklist.status,
      week_two_deployment_public_beta_readiness: weekTwoDeploymentPublicBetaReadiness.status,
      week_two_deployment_public_beta_execution_checklist: weekTwoDeploymentPublicBetaExecutionChecklist.status,
      week_two_mobile_release_readiness: weekTwoMobileReleaseReadiness.status,
      week_two_mobile_release_execution_checklist: weekTwoMobileReleaseExecutionChecklist.status,
      week_two_legal_provider_readiness: weekTwoLegalProviderReadiness.status,
      week_two_legal_provider_execution_checklist: weekTwoLegalProviderExecutionChecklist.status,
      week_two_investor_founder_package_alignment: weekTwoInvestorFounderPackageAlignment.status,
      week_two_investor_founder_package_execution_checklist: weekTwoInvestorFounderPackageExecutionChecklist.status,
      week_two_local_validation_pass_readiness: weekTwoLocalValidationPassReadiness.status,
      week_two_local_validation_pass_execution_checklist: weekTwoLocalValidationPassExecutionChecklist.status,
      week_two_two_week_closeout_readiness: weekTwoTwoWeekCloseoutReadiness.status,
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
