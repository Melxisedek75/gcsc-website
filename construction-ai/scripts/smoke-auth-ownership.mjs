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
  assertSecurityHeaders(health);
  const customRequestId = 'gcsc-smoke-request-123';
  const healthWithRequestId = await request(baseUrl, '/api/health', {
    headers: { 'X-Request-Id': customRequestId },
  });
  assert(
    healthWithRequestId.headers.get('x-request-id') === customRequestId,
    'Server must echo a safe incoming X-Request-Id header'
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

  const accessModel = await request(baseUrl, '/api/admin/access-model');
  assert(accessModel.status === 200, `Expected admin/access-model 200, got ${accessModel.status}`);
  assert(Array.isArray(accessModel.body?.roles), 'Admin access model must return roles');
  assert(accessModel.body.roles.some((role) => role.role === 'founder'), 'Admin access model must include founder role');

  const protectionStatus = await request(baseUrl, '/api/auth/protection-status');
  assert(protectionStatus.status === 200, `Expected auth/protection-status 200, got ${protectionStatus.status}`);
  assert(protectionStatus.body?.mode === 'draft', 'Route protection should default to draft mode');
  assert(protectionStatus.body?.enforced === false, 'Route protection should default to non-enforced draft mode');

  const adminMe = await request(baseUrl, '/api/admin/me');
  assert(adminMe.status === 200, `Expected admin/me in draft mode to return 200, got ${adminMe.status}`);
  assert(adminMe.body?.access?.mode === 'draft', 'Admin me should default to draft enforcement mode');
  assert(adminMe.body?.access?.draft_bypass === true, 'Admin me should expose draft bypass for local MVP mode');

  const founderActions = await request(baseUrl, '/api/admin/founder-action-center');
  assert(founderActions.status === 200, `Expected founder-action-center 200, got ${founderActions.status}`);
  assert(Array.isArray(founderActions.body?.actions), 'Founder Action Center must return actions array');
  assert(founderActions.body.actions.some((item) => item.id === 'reconnect_supabase_connector'), 'Founder Action Center must include Supabase reconnect action');

  const founderAuthSetup = await request(baseUrl, '/api/admin/founder-auth-setup');
  assert(founderAuthSetup.status === 200, `Expected founder-auth-setup 200, got ${founderAuthSetup.status}`);
  assert(Array.isArray(founderAuthSetup.body?.checklist), 'Founder Auth Setup must return checklist array');
  assert(founderAuthSetup.body?.current_session?.authenticated === false, 'Founder Auth Setup should report no session without token');

  const boundary = await request(baseUrl, '/api/admin/supabase-boundary');
  assert(boundary.status === 200, `Expected supabase-boundary 200, got ${boundary.status}`);
  assert(boundary.body?.status?.service_role, 'Boundary endpoint must return service_role status without secret values');

  const mobileInstallReadiness = await request(baseUrl, '/api/admin/mobile-install-readiness');
  assert(mobileInstallReadiness.status === 200, `Expected mobile-install-readiness 200, got ${mobileInstallReadiness.status}`);
  assert(mobileInstallReadiness.body?.status === 'ready', 'Mobile install readiness should report ready for the current PWA shell');
  assert(Array.isArray(mobileInstallReadiness.body?.checks), 'Mobile install readiness must return checks array');
  assert(mobileInstallReadiness.body.checks.some((item) => item.id === 'api_cache_boundary'), 'Mobile install readiness must include API cache boundary check');

  const betaReadiness = await request(baseUrl, '/api/admin/beta-readiness');
  assert(betaReadiness.status === 200, `Expected beta-readiness 200, got ${betaReadiness.status}`);
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

  const invalidJson = await request(baseUrl, '/api/chat', {
    method: 'POST',
    body: '{"messages":',
  });
  assert(invalidJson.status === 400, `Expected invalid JSON body to return 400, got ${invalidJson.status}`);
  assert(invalidJson.body?.error === 'Invalid JSON body', 'Invalid JSON response must use a clear error message');
  assert(Boolean(invalidJson.body?.request_id), 'Invalid JSON response must include request_id');

  const missingApiRoute = await request(baseUrl, '/api/does-not-exist');
  assert(missingApiRoute.status === 404, `Expected missing API route to return 404, got ${missingApiRoute.status}`);
  assert(missingApiRoute.body?.error === 'API route not found', 'Missing API route must use JSON error response');
  assert(Boolean(missingApiRoute.body?.request_id), 'Missing API route response must include request_id');

  const optionalRealSession = await runOptionalRealSessionChecks(baseUrl);

  console.log(JSON.stringify({
    status: 'passed',
    static_guard_coverage: 'passed',
    basic_endpoint_checks: {
      health: health.status,
      security_headers: 'passed',
      request_id_header: 'passed',
      session_without_token: sessionNoToken.status,
      profile_without_token: profileNoToken.status,
      invalid_magic_link: invalidMagicLink.status,
      magic_link_rate_limit: limitedMagicLink.status,
      invalid_json_body: invalidJson.status,
      missing_api_route: missingApiRoute.status,
      admin_access_model: accessModel.status,
      admin_me: adminMe.status,
      auth_protection_status: protectionStatus.status,
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
