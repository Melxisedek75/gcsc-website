// Load .env manually (cross-platform compatible)
const fs = require('fs');
try {
  const envContent = fs.readFileSync(__dirname + '/.env', 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  });
} catch (e) { /* .env not found, use system env */ }
const express = require('express');
const rateLimit = require('express-rate-limit');
const OpenAI = require('openai');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const crypto = require('crypto');
const { SYSTEM_PROMPT } = require('./knowledge/system-prompt');

const app = express();
const PORT = process.env.PORT || 3001;

function isPlaceholderSecret(value) {
  return !value || /^(your_|sk_test_your_|xoxb-your|https:\/\/your-)/i.test(value);
}

const supabaseAuth = process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY)
  : null;
const supabaseAdmin = process.env.SUPABASE_URL && !isPlaceholderSecret(process.env.SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;
const supabase = supabaseAdmin || supabaseAuth;

const adminRoleModel = [
  {
    role: 'founder',
    label: 'Founder',
    status: 'required_before_public_launch',
    permissions: [
      'admin_console_read',
      'launch_readiness_read',
      'loan_review_prepare',
      'payment_exception_review',
      'verification_review',
      'collateral_review',
      'legal_queue_read',
      'treasury_queue_read',
      'provider_setup_review',
    ],
    cannot_do_alone: [
      'execute_real_loan_approval_without_legal_review',
      'release_real_escrow_without_payment_provider_approval',
      'override_risk_model_without_audit_event',
    ],
  },
  {
    role: 'risk_reviewer',
    label: 'Risk Reviewer',
    status: 'planned',
    permissions: [
      'admin_console_read',
      'loan_review_prepare',
      'dispute_review_prepare',
      'collateral_review',
    ],
    cannot_do_alone: [
      'move_money',
      'approve_legal_language',
      'change_provider_keys',
    ],
  },
  {
    role: 'compliance_reviewer',
    label: 'Compliance Reviewer',
    status: 'planned',
    permissions: [
      'verification_review',
      'license_review',
      'insurance_review',
      'business_identity_review',
    ],
    cannot_do_alone: [
      'approve_real_loan',
      'move_money',
      'edit_payment_events',
    ],
  },
  {
    role: 'treasury_reviewer',
    label: 'Treasury Reviewer',
    status: 'planned',
    permissions: [
      'treasury_queue_read',
      'payment_exception_review',
      'loan_pool_review',
      'collateral_review',
    ],
    cannot_do_alone: [
      'approve_loan_contract_terms',
      'change_user_identity',
      'skip_audit_log',
    ],
  },
  {
    role: 'legal_reviewer',
    label: 'Legal Reviewer',
    status: 'planned_external',
    permissions: [
      'legal_queue_read',
      'loan_terms_review',
      'escrow_terms_review',
      'contract_language_review',
    ],
    cannot_do_alone: [
      'change_database_records',
      'move_money',
      'change_auth_or_rls',
    ],
  },
  {
    role: 'support',
    label: 'Support',
    status: 'later',
    permissions: [
      'read_non_secret_support_context',
      'request_more_evidence',
      'create_support_note',
    ],
    cannot_do_alone: [
      'view_secret_keys',
      'approve_loans',
      'change_payment_status',
      'view_full_verification_raw_results',
    ],
  },
];

const adminProtectedSurfaces = [
  {
    surface: '/api/admin/risk-console',
    current_mode: 'local_mvp_review',
    required_before_public: ['founder', 'risk_reviewer', 'compliance_reviewer', 'treasury_reviewer'],
  },
  {
    surface: '/api/admin/launch-readiness',
    current_mode: 'safe_status_public_to_local_operator',
    required_before_public: ['founder'],
  },
  {
    surface: '/api/admin/supabase-boundary',
    current_mode: 'safe_status_public_to_local_operator',
    required_before_public: ['founder'],
  },
  {
    surface: 'real loan approval',
    current_mode: 'blocked',
    required_before_public: ['founder', 'risk_reviewer', 'legal_reviewer', 'treasury_reviewer'],
  },
  {
    surface: 'real payment release / escrow release',
    current_mode: 'blocked',
    required_before_public: ['founder', 'treasury_reviewer', 'legal_reviewer'],
  },
  {
    surface: 'verification override',
    current_mode: 'review',
    required_before_public: ['founder', 'compliance_reviewer'],
  },
];

function adminEnforcementMode() {
  return process.env.SMARTCONTRACTOR_ADMIN_ENFORCEMENT_MODE === 'strict' ? 'strict' : 'draft';
}

function routeProtectionMode() {
  return process.env.SMARTCONTRACTOR_ROUTE_PROTECTION === 'strict' ? 'strict' : 'draft';
}

function isRouteProtectionStrict() {
  return routeProtectionMode() === 'strict';
}

function permissionsForAdminRoles(roles) {
  const permissions = new Set();
  for (const role of roles) {
    const model = adminRoleModel.find((item) => item.role === role);
    if (!model) continue;
    model.permissions.forEach((permission) => permissions.add(permission));
    if (role === 'founder') permissions.add('founder_all');
  }
  return [...permissions].sort();
}

function hasRequiredAdminPermission(activeRoles, permissions, requiredPermissions) {
  if (!requiredPermissions.length) return true;
  if (activeRoles.includes('founder') || permissions.includes('founder_all')) return true;
  return requiredPermissions.every((permission) => permissions.includes(permission));
}

async function getAdminMemberships(authUserId) {
  if (!supabase) {
    return { memberships: [], error: 'Supabase is not configured' };
  }

  const { data, error } = await supabase
    .from('admin_memberships')
    .select('id,auth_user_id,role,status,permissions,note,created_at,updated_at')
    .eq('auth_user_id', authUserId)
    .eq('status', 'active');

  if (error) return { memberships: [], error: error.message };
  return { memberships: data || [], error: null };
}

async function getAdminMembershipSummary() {
  if (!supabase) {
    return {
      reachable: false,
      total_active: null,
      founder_active: null,
      roles: {},
      error: 'Supabase is not configured',
    };
  }

  const { data, error } = await supabase
    .from('admin_memberships')
    .select('role,status')
    .eq('status', 'active');

  if (error) {
    return {
      reachable: false,
      total_active: null,
      founder_active: null,
      roles: {},
      error: error.message,
    };
  }

  const roles = (data || []).reduce((summary, item) => {
    summary[item.role] = (summary[item.role] || 0) + 1;
    return summary;
  }, {});

  return {
    reachable: true,
    total_active: data?.length || 0,
    founder_active: roles.founder || 0,
    roles,
    error: null,
  };
}

async function getAuthProfileBindingStatus(req) {
  const token = getBearerToken(req);
  if (!token) {
    return {
      authenticated: false,
      profile_linked: false,
      admin_roles_active: [],
      next_step: 'Send Magic Link, open the email link in this browser, then click Check Founder Auth Setup.',
    };
  }

  const auth = await getAuthenticatedUser(req);
  if (auth.error) {
    return {
      authenticated: false,
      profile_linked: false,
      admin_roles_active: [],
      error: auth.error,
      next_step: 'Send a fresh Magic Link because the current browser token is invalid or expired.',
    };
  }

  if (!supabase) {
    return {
      authenticated: true,
      user: {
        id: auth.user.id,
        email: auth.user.email || null,
      },
      profile_linked: false,
      admin_roles_active: [],
      error: 'Supabase database client is not configured',
      next_step: 'Configure Supabase backend environment before linking SmartContractor profiles.',
    };
  }

  const [{ data: profile, error: profileError }, membershipsResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('id,role,email,full_name,auth_user_id,created_at')
      .eq('auth_user_id', auth.user.id)
      .maybeSingle(),
    getAdminMemberships(auth.user.id),
  ]);

  if (profileError) {
    return {
      authenticated: true,
      user: {
        id: auth.user.id,
        email: auth.user.email || null,
      },
      profile_linked: false,
      admin_roles_active: [],
      error: profileError.message,
      next_step: 'Fix profile lookup before strict ownership/RLS testing.',
    };
  }

  const activeRoles = membershipsResult.memberships.map((item) => item.role);
  const nextStep = activeRoles.includes('founder')
    ? 'Founder admin membership is active. Next safe step is strict admin smoke testing before strict RLS.'
    : profile
    ? 'Profile is linked. Next step: founder must explicitly approve adding this auth_user_id as founder in admin_memberships.'
    : 'Create or link one SmartContractor profile while logged in with this Magic Link session.';

  return {
    authenticated: true,
    user: {
      id: auth.user.id,
      email: auth.user.email || null,
    },
    profile_linked: Boolean(profile),
    profile,
    admin_roles_active: activeRoles,
    admin_membership_error: membershipsResult.error,
    next_step: nextStep,
  };
}

async function getAdminAccess(req, requiredPermissions = []) {
  const mode = adminEnforcementMode();
  const token = getBearerToken(req);
  if (!token && mode === 'draft') {
    return {
      allowed: true,
      status: 200,
      mode,
      enforced: false,
      draft_bypass: true,
      reason: 'Draft mode allows local MVP admin review without a bearer token. Strict mode must be enabled before public launch.',
      user: null,
      active_roles: [],
      permissions: [],
      required_permissions: requiredPermissions,
    };
  }
  if (!token) {
    return {
      allowed: false,
      status: 401,
      mode,
      enforced: true,
      error: 'Missing bearer token',
      required_permissions: requiredPermissions,
    };
  }

  const auth = await getAuthenticatedUser(req);
  if (auth.error) {
    return {
      allowed: false,
      status: auth.status,
      mode,
      enforced: mode === 'strict',
      error: auth.error,
      required_permissions: requiredPermissions,
    };
  }

  const { memberships, error } = await getAdminMemberships(auth.user.id);
  if (error) {
    return {
      allowed: mode === 'draft',
      status: mode === 'draft' ? 200 : 503,
      mode,
      enforced: mode === 'strict',
      draft_bypass: mode === 'draft',
      error: mode === 'draft' ? null : error,
      warning: error,
      user: { id: auth.user.id, email: auth.user.email || null },
      active_roles: [],
      permissions: [],
      required_permissions: requiredPermissions,
    };
  }

  const activeRoles = memberships.map((membership) => membership.role);
  const rolePermissions = permissionsForAdminRoles(activeRoles);
  const explicitPermissions = memberships.flatMap((membership) => (
    Array.isArray(membership.permissions) ? membership.permissions : []
  ));
  const permissions = [...new Set([...rolePermissions, ...explicitPermissions])].sort();
  const hasPermission = hasRequiredAdminPermission(activeRoles, permissions, requiredPermissions);

  return {
    allowed: hasPermission || mode === 'draft',
    status: hasPermission || mode === 'draft' ? 200 : 403,
    mode,
    enforced: mode === 'strict',
    draft_bypass: !hasPermission && mode === 'draft',
    error: hasPermission || mode === 'draft' ? null : 'Admin role does not include required permissions',
    user: { id: auth.user.id, email: auth.user.email || null },
    active_roles: activeRoles,
    permissions,
    required_permissions: requiredPermissions,
    memberships: memberships.map(({ id, role, status, note, created_at, updated_at }) => ({
      id,
      role,
      status,
      note,
      created_at,
      updated_at,
    })),
  };
}

function requireAdminPermissions(requiredPermissions = []) {
  return async (req, res, next) => {
    const access = await getAdminAccess(req, requiredPermissions);
    if (!access.allowed) {
      return res.status(access.status).json({
        error: access.error,
        mode: access.mode,
        required_permissions: access.required_permissions,
      });
    }
    req.adminAccess = access;
    return next();
  };
}

function supabaseBoundaryStatus() {
  return {
    auth_client: supabaseAuth ? 'configured' : 'missing',
    database_client: supabase ? 'configured' : 'missing',
    database_client_mode: supabaseAdmin ? 'service_role_server_only' : supabaseAuth ? 'publishable_demo_fallback' : 'missing',
    service_role: supabaseAdmin ? 'configured_server_only' : 'missing_or_placeholder',
    boundary: supabaseAdmin
      ? 'Trusted backend database operations use a server-only service role client. Browser code never receives the service role key.'
      : 'Local demo can still use the publishable client, but public launch remains blocked until SUPABASE_SERVICE_ROLE_KEY is configured server-side.',
  };
}

function requireSupabase(res) {
  if (supabase) return true;
  res.status(503).json({ error: 'Supabase is not configured' });
  return false;
}

function requireSupabaseAuth(res) {
  if (supabaseAuth) return true;
  res.status(503).json({ error: 'Supabase Auth client is not configured' });
  return false;
}

function requireSupabaseAdmin(res) {
  if (supabaseAdmin) return true;
  res.status(503).json({ error: 'Supabase service-role client is not configured server-side' });
  return false;
}

function getBearerToken(req) {
  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : '';
}

function isEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function maskEmail(email) {
  const [name, domain] = String(email || '').split('@');
  if (!name || !domain) return 'unknown';
  return `${name.slice(0, 2)}***@${domain}`;
}

function safeAuthRedirectUrl(value) {
  if (!value) return null;
  let parsed;
  try {
    parsed = new URL(value);
  } catch (error) {
    return null;
  }

  const allowedOrigins = new Set([
    'https://xprnet.org',
    'https://www.xprnet.org',
  ]);
  if (process.env.PUBLIC_SITE_URL) {
    try {
      allowedOrigins.add(new URL(process.env.PUBLIC_SITE_URL).origin);
    } catch (error) {
      // Ignore invalid optional config.
    }
  }
  String(process.env.ALLOWED_AUTH_REDIRECT_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
    .forEach((origin) => allowedOrigins.add(origin));

  const isLocalhost = ['localhost', '127.0.0.1'].includes(parsed.hostname);
  if (isLocalhost && ['http:', 'https:'].includes(parsed.protocol)) return parsed.toString();
  if (allowedOrigins.has(parsed.origin)) return parsed.toString();
  return null;
}

async function getAuthenticatedUser(req) {
  if (!supabaseAuth) {
    return { user: null, status: 503, error: 'Supabase Auth client is not configured' };
  }
  const token = getBearerToken(req);
  if (!token) {
    return { user: null, status: 401, error: 'Missing bearer token' };
  }

  const { data, error } = await supabaseAuth.auth.getUser(token);
  if (error || !data?.user) {
    return { user: null, status: 401, error: 'Invalid or expired session' };
  }
  return { user: data.user, status: 200, error: null };
}

async function getOptionalAuthenticatedUser(req) {
  if (!getBearerToken(req)) return { user: null, status: 200, error: null };
  return getAuthenticatedUser(req);
}

function ownershipPass(extra = {}) {
  return { allowed: true, status: 200, error: null, ...extra };
}

function ownershipFail(status, error) {
  return { allowed: false, status, error };
}

async function getOwnershipAuthUser(req) {
  const authResult = await getOptionalAuthenticatedUser(req);
  if (authResult.error) return { user: null, error: authResult.error, status: authResult.status };
  return { user: authResult.user, error: null, status: 200 };
}

async function assertOwnedProfile(req, profileId) {
  const auth = await getOwnershipAuthUser(req);
  if (auth.error) return ownershipFail(auth.status, auth.error);
  if (!auth.user) return ownershipPass({ enforced: false });

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id,auth_user_id,role')
    .eq('id', profileId)
    .maybeSingle();
  if (error) return ownershipFail(500, error.message);
  if (!profile || profile.auth_user_id !== auth.user.id) {
    return ownershipFail(403, 'Authenticated user does not own this profile_id');
  }
  return ownershipPass({ enforced: true, auth_user_id: auth.user.id, profile });
}

async function assertOwnedRoleRecord(req, table, id, fieldName) {
  const auth = await getOwnershipAuthUser(req);
  if (auth.error) return ownershipFail(auth.status, auth.error);
  if (!auth.user) return ownershipPass({ enforced: false });

  const { data: record, error: recordError } = await supabase
    .from(table)
    .select('id,profile_id')
    .eq('id', id)
    .maybeSingle();
  if (recordError) return ownershipFail(500, recordError.message);
  if (!record) return ownershipFail(403, `Authenticated user does not own this ${fieldName}`);

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id,auth_user_id,role')
    .eq('id', record.profile_id)
    .maybeSingle();
  if (profileError) return ownershipFail(500, profileError.message);
  if (!profile || profile.auth_user_id !== auth.user.id) {
    return ownershipFail(403, `Authenticated user does not own this ${fieldName}`);
  }
  return ownershipPass({ enforced: true, auth_user_id: auth.user.id, profile, record });
}

function rejectOwnership(res, ownership) {
  return res.status(ownership.status).json({ error: ownership.error });
}

async function requireAuthenticatedUser(req, res, next) {
  const result = await getAuthenticatedUser(req);
  if (result.error) return res.status(result.status).json({ error: result.error });
  req.authUser = result.user;
  return next();
}

async function requireProtectedRoute(req, res, next) {
  if (!isRouteProtectionStrict()) {
    req.routeProtection = {
      mode: routeProtectionMode(),
      enforced: false,
      reason: 'Draft mode keeps local demo routes open while Supabase test users and RLS are being prepared.',
    };
    return next();
  }
  return requireAuthenticatedUser(req, res, next);
}

async function requireProtectedAdminRoute(req, res, next) {
  if (!isRouteProtectionStrict()) {
    req.routeProtection = {
      mode: routeProtectionMode(),
      enforced: false,
      reason: 'Draft mode keeps local admin review open. Strict mode requires Supabase Auth and admin role checks.',
    };
    return next();
  }
  return requireAdminPermissions(['admin_console_read'])(req, res, next);
}

function validationError(res, errors) {
  return res.status(400).json({
    error: 'Validation failed',
    details: Array.isArray(errors) ? errors : [errors],
  });
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateOptionalFiniteNumber(value, fieldName, errors) {
  if (value === undefined) return;
  if (value === null || value === '' || !Number.isFinite(Number(value))) {
    errors.push(`${fieldName} must be a finite number`);
  }
}

function validateLoanRequestInput(body = {}) {
  const errors = [];
  const { contractor_id, principal_usd, apr_percent, risk_score } = body || {};

  if (!contractor_id || principal_usd === undefined || principal_usd === null || principal_usd === '') {
    errors.push('contractor_id and principal_usd are required');
  }

  if (principal_usd !== undefined && principal_usd !== null && principal_usd !== '') {
    const principal = Number(principal_usd);
    if (!Number.isFinite(principal) || principal <= 0) {
      errors.push('principal_usd must be a positive finite number');
    }
  }

  if (apr_percent !== undefined && apr_percent !== null && apr_percent !== '') {
    const apr = Number(apr_percent);
    if (!Number.isFinite(apr) || apr <= 0) {
      errors.push('apr_percent must be a positive finite number');
    }
  }

  if (risk_score !== undefined && risk_score !== null && risk_score !== '') {
    const riskScore = Number(risk_score);
    if (!Number.isFinite(riskScore)) {
      errors.push('risk_score must be a finite number');
    } else if (riskScore < 0 || riskScore > 100) {
      errors.push('risk_score must be between 0 and 100');
    }
  }

  return errors;
}

function validateLoanRepaymentInput(body = {}) {
  const errors = [];
  const allowedSources = ['milestone_payment', 'escrow_release', 'manual', 'admin_adjustment'];
  const { amount_usd, source = 'milestone_payment', payment_tx_hash } = body || {};
  const repaymentAmount = parsePositiveNumber(amount_usd, 'amount_usd', errors);
  validateOptionalString(source, 'source', errors, 80);
  validateOptionalString(payment_tx_hash, 'payment_tx_hash', errors, 160);
  if (source && !allowedSources.includes(source)) {
    errors.push('source must be one of: milestone_payment, escrow_release, manual, admin_adjustment');
  }
  return {
    errors,
    repaymentAmount,
    source,
    payment_tx_hash,
  };
}

function validateDisputeCreateInput(body = {}) {
  const errors = [];
  const { job_id, opened_by_role, title, description } = body || {};

  if (!job_id || !opened_by_role || !title || !description) {
    errors.push('job_id, opened_by_role, title, and description are required');
  }

  if (opened_by_role && !['homeowner', 'contractor'].includes(opened_by_role)) {
    errors.push('opened_by_role must be one of: homeowner, contractor');
  }
  validateOptionalString(title, 'title', errors, 140);
  validateOptionalString(description, 'description', errors, 2000);

  return errors;
}

function validateDisputeEvidenceInput(body = {}) {
  const errors = [];
  const { evidence_type, evidence_url, notes } = body || {};
  const allowedEvidenceTypes = ['photo', 'video', 'document', 'link', 'note'];

  if (!evidence_type && !notes) {
    errors.push('evidence_type or notes is required');
  }

  if (evidence_type && !allowedEvidenceTypes.includes(evidence_type)) {
    errors.push('evidence_type must be one of: photo, video, document, link, note');
  }
  validateOptionalString(evidence_type, 'evidence_type', errors, 40);
  validateOptionalString(evidence_url, 'evidence_url', errors, 500);
  validateOptionalString(notes, 'notes', errors, 2000);

  return errors;
}

function validateDisputeReviewInput(body = {}) {
  const errors = [];
  const {
    reviewer_contractor_id,
    review_type = 'remote',
    quality_score,
    finding,
    recommendation,
    token_reward_amount,
    rating_points_awarded,
    loan_score_points,
  } = body || {};
  const allowedReviewTypes = ['remote', 'onsite', 'document_review'];
  const allowedRecommendations = [
    'request_rework',
    'release_payment',
    'partial_refund',
    'full_refund',
    'needs_onsite_inspection',
  ];
  const recommendationError = 'recommendation must be one of: request_rework, release_payment, partial_refund, full_refund, needs_onsite_inspection';

  if (!reviewer_contractor_id || !finding || !recommendation) {
    errors.push('reviewer_contractor_id, finding, and recommendation are required');
  }

  validateOptionalEnum(review_type, allowedReviewTypes, 'review_type', errors);
  if (recommendation && !allowedRecommendations.includes(recommendation)) {
    errors.push(recommendationError);
  }
  validateOptionalFiniteNumber(quality_score, 'quality_score', errors);
  if (quality_score !== undefined && quality_score !== null && quality_score !== '') {
    const score = Number(quality_score);
    if (Number.isFinite(score) && (score < 0 || score > 100)) {
      errors.push('quality_score must be between 0 and 100');
    }
  }
  validateOptionalString(finding, 'finding', errors, 2000);
  validateOptionalString(recommendation, 'recommendation', errors, 80);
  validateOptionalString(review_type, 'review_type', errors, 40);
  if (token_reward_amount !== undefined) parseNonNegativeNumber(token_reward_amount, 'token_reward_amount', errors);
  if (rating_points_awarded !== undefined) parseNonNegativeNumber(rating_points_awarded, 'rating_points_awarded', errors);
  if (loan_score_points !== undefined) parseNonNegativeNumber(loan_score_points, 'loan_score_points', errors);

  return errors;
}

function validateProfileCreateInput(body = {}) {
  const errors = [];
  const { role, email, full_name, phone, xpr_account, wallet_public_key } = body || {};
  const allowedRoles = ['homeowner', 'contractor'];

  if (!role || !email) {
    errors.push('role and email are required');
  }
  validateOptionalEnum(role, allowedRoles, 'role', errors);
  validateOptionalString(role, 'role', errors, 40);
  validateOptionalString(email, 'email', errors, 254);
  if (email && (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    errors.push('email must be a valid email address');
  }
  validateOptionalString(full_name, 'full_name', errors, 120);
  validateOptionalString(phone, 'phone', errors, 40);
  validateOptionalString(xpr_account, 'xpr_account', errors, 64);
  validateOptionalString(wallet_public_key, 'wallet_public_key', errors, 200);

  return errors;
}

function validateContractorCreateInput(body = {}) {
  const errors = [];
  const { profile_id, business_name, ein, license_number, license_state, insurance_status } = body || {};
  const allowedInsuranceStatuses = ['pending', 'verified', 'expired', 'missing'];

  if (!profile_id || !business_name) {
    errors.push('profile_id and business_name are required');
  }
  validateOptionalString(profile_id, 'profile_id', errors, 120);
  validateOptionalString(business_name, 'business_name', errors, 160);
  validateOptionalString(ein, 'ein', errors, 40);
  validateOptionalString(license_number, 'license_number', errors, 80);
  validateOptionalString(license_state, 'license_state', errors, 20);
  validateOptionalString(insurance_status, 'insurance_status', errors, 40);
  if (insurance_status && !allowedInsuranceStatuses.includes(insurance_status)) {
    errors.push('insurance_status must be one of: pending, verified, expired, missing');
  }

  return errors;
}

function validateHomeownerCreateInput(body = {}) {
  const errors = [];
  const { profile_id, display_name, default_zip, subscription_tier } = body || {};
  const allowedSubscriptionTiers = ['basic', 'pro', 'enterprise'];

  if (!profile_id) {
    errors.push('profile_id is required');
  }
  validateOptionalString(profile_id, 'profile_id', errors, 120);
  validateOptionalString(display_name, 'display_name', errors, 120);
  validateOptionalString(default_zip, 'default_zip', errors, 20);
  validateOptionalString(subscription_tier, 'subscription_tier', errors, 40);
  if (subscription_tier && !allowedSubscriptionTiers.includes(subscription_tier)) {
    errors.push('subscription_tier must be one of: basic, pro, enterprise');
  }

  return errors;
}

function validateJobCreateInput(body = {}) {
  const errors = [];
  const {
    homeowner_id,
    title,
    description,
    trade,
    location_city,
    location_state,
    location_zip,
    budget_min_usd,
    budget_max_usd,
  } = body || {};

  if (!homeowner_id || !title || !description) {
    errors.push('homeowner_id, title, and description are required');
  }
  validateOptionalString(homeowner_id, 'homeowner_id', errors, 120);
  validateOptionalString(title, 'title', errors, 140);
  validateOptionalString(description, 'description', errors, 2000);
  validateOptionalString(trade, 'trade', errors, 80);
  validateOptionalString(location_city, 'location_city', errors, 80);
  validateOptionalString(location_state, 'location_state', errors, 40);
  validateOptionalString(location_zip, 'location_zip', errors, 20);
  validateOptionalFiniteNumber(budget_min_usd, 'budget_min_usd', errors);
  validateOptionalFiniteNumber(budget_max_usd, 'budget_max_usd', errors);

  const hasMinBudget = budget_min_usd !== undefined && budget_min_usd !== null && budget_min_usd !== '';
  const hasMaxBudget = budget_max_usd !== undefined && budget_max_usd !== null && budget_max_usd !== '';
  if (hasMinBudget && Number.isFinite(Number(budget_min_usd)) && Number(budget_min_usd) < 0) {
    errors.push('budget_min_usd must be a number greater than or equal to 0');
  }
  if (hasMaxBudget && Number.isFinite(Number(budget_max_usd)) && Number(budget_max_usd) < 0) {
    errors.push('budget_max_usd must be a number greater than or equal to 0');
  }
  if (
    hasMinBudget &&
    hasMaxBudget &&
    Number.isFinite(Number(budget_min_usd)) &&
    Number.isFinite(Number(budget_max_usd)) &&
    Number(budget_max_usd) < Number(budget_min_usd)
  ) {
    errors.push('budget_max_usd must be greater than or equal to budget_min_usd');
  }

  return errors;
}

function validateBidCreateInput(body = {}) {
  const errors = [];
  const { job_id, contractor_id, amount_usd, timeline_days, message } = body || {};

  if (!job_id || !contractor_id || amount_usd === undefined || amount_usd === null || amount_usd === '') {
    errors.push('job_id, contractor_id, and amount_usd are required');
  }
  validateOptionalString(job_id, 'job_id', errors, 120);
  validateOptionalString(contractor_id, 'contractor_id', errors, 120);
  if (amount_usd !== undefined && amount_usd !== null && amount_usd !== '') {
    const amount = Number(amount_usd);
    if (!Number.isFinite(amount) || amount <= 0) {
      errors.push('amount_usd must be a positive finite number');
    }
  }
  if (timeline_days !== undefined && timeline_days !== null && timeline_days !== '') {
    const timeline = Number(timeline_days);
    if (!Number.isFinite(timeline) || timeline <= 0) {
      errors.push('timeline_days must be a positive finite number');
    }
  }
  validateOptionalString(message, 'message', errors, 2000);

  return errors;
}

function validateProjectContractCreateInput(body = {}) {
  const errors = [];
  const {
    job_id,
    accepted_bid_id,
    homeowner_id,
    contractor_id,
    title,
    terms_summary,
    total_amount_usd,
    platform_fee_usd = 0,
    status = 'pending_signature',
  } = body || {};
  const allowedStatuses = ['pending_signature', 'active', 'completed', 'cancelled', 'disputed'];

  if (!job_id || !homeowner_id || !contractor_id || !title || total_amount_usd === undefined || total_amount_usd === null || total_amount_usd === '') {
    errors.push('job_id, homeowner_id, contractor_id, title, and total_amount_usd are required');
  }
  validateOptionalString(job_id, 'job_id', errors, 120);
  validateOptionalString(accepted_bid_id, 'accepted_bid_id', errors, 120);
  validateOptionalString(homeowner_id, 'homeowner_id', errors, 120);
  validateOptionalString(contractor_id, 'contractor_id', errors, 120);
  validateOptionalString(title, 'title', errors, 160);
  validateOptionalString(terms_summary, 'terms_summary', errors, 3000);
  validateOptionalString(status, 'status', errors, 60);
  if (status && !allowedStatuses.includes(status)) {
    errors.push('status must be one of: pending_signature, active, completed, cancelled, disputed');
  }
  if (total_amount_usd !== undefined && total_amount_usd !== null && total_amount_usd !== '') {
    const total = Number(total_amount_usd);
    if (!Number.isFinite(total) || total <= 0) {
      errors.push('total_amount_usd must be a positive finite number');
    }
  }
  if (platform_fee_usd !== undefined && platform_fee_usd !== null && platform_fee_usd !== '') {
    const fee = Number(platform_fee_usd);
    if (!Number.isFinite(fee) || fee < 0) {
      errors.push('platform_fee_usd must be a number greater than or equal to 0');
    }
  }

  return errors;
}

function validateMilestoneCreateInput(body = {}) {
  const errors = [];
  const {
    project_contract_id,
    job_id,
    title,
    description,
    sequence_number = 1,
    amount_usd,
    payment_status = 'not_funded',
    work_status = 'not_started',
    due_at,
  } = body || {};
  const allowedPaymentStatuses = ['not_funded', 'funded', 'released', 'disputed', 'refunded'];
  const allowedWorkStatuses = ['not_started', 'in_progress', 'submitted', 'approved', 'rework_requested', 'rejected'];

  if (!job_id || !title || amount_usd === undefined || amount_usd === null || amount_usd === '') {
    errors.push('job_id, title, and amount_usd are required');
  }
  validateOptionalString(project_contract_id, 'project_contract_id', errors, 120);
  validateOptionalString(job_id, 'job_id', errors, 120);
  validateOptionalString(title, 'title', errors, 160);
  validateOptionalString(description, 'description', errors, 2000);
  validateOptionalString(payment_status, 'payment_status', errors, 60);
  validateOptionalString(work_status, 'work_status', errors, 60);
  validateOptionalString(due_at, 'due_at', errors, 80);
  if (payment_status && !allowedPaymentStatuses.includes(payment_status)) {
    errors.push('payment_status must be one of: not_funded, funded, released, disputed, refunded');
  }
  if (work_status && !allowedWorkStatuses.includes(work_status)) {
    errors.push('work_status must be one of: not_started, in_progress, submitted, approved, rework_requested, rejected');
  }
  if (!Number.isInteger(Number(sequence_number)) || Number(sequence_number) <= 0) {
    errors.push('sequence_number must be a positive integer');
  }
  if (amount_usd !== undefined && amount_usd !== null && amount_usd !== '') {
    const amount = Number(amount_usd);
    if (!Number.isFinite(amount) || amount <= 0) {
      errors.push('amount_usd must be a positive finite number');
    }
  }

  return errors;
}

function validateBidUnlockInput(body = {}, params = {}) {
  const errors = [];
  const bid_id = params?.bidId;
  const { contractor_id, payment_tx_hash, price_usd = 5 } = body || {};

  if (!bid_id || !contractor_id) {
    errors.push('bid_id and contractor_id are required');
  }
  validateOptionalString(bid_id, 'bid_id', errors, 120);
  validateOptionalString(contractor_id, 'contractor_id', errors, 120);
  validateOptionalString(payment_tx_hash, 'payment_tx_hash', errors, 160);
  if (price_usd !== undefined && price_usd !== null && price_usd !== '') {
    const price = Number(price_usd);
    if (!Number.isFinite(price) || price <= 0) {
      errors.push('price_usd must be a positive finite number');
    }
  }

  return errors;
}

function validateVerificationCheckInput(body = {}) {
  const errors = [];
  const {
    subject_type,
    subject_id,
    provider = 'manual',
    check_type,
    status = 'pending',
    confidence_score,
    provider_reference,
    result_summary,
    evidence_url,
    expires_at,
    raw_result = {},
  } = body || {};

  if (!isNonEmptyString(subject_type) || !isNonEmptyString(check_type)) {
    errors.push('subject_type and check_type are required');
  }
  validateOptionalString(subject_type, 'subject_type', errors, 80);
  validateOptionalString(subject_id, 'subject_id', errors, 120);
  validateOptionalString(provider, 'provider', errors, 80);
  validateOptionalString(check_type, 'check_type', errors, 80);
  validateOptionalString(provider_reference, 'provider_reference', errors, 160);
  validateOptionalString(result_summary, 'result_summary', errors, 500);
  validateOptionalString(evidence_url, 'evidence_url', errors, 500);
  validateOptionalEnum(status, ['pending', 'in_review', 'verified', 'rejected', 'expired', 'needs_more_info', 'failed'], 'status', errors);

  let confidence = null;
  if (confidence_score !== undefined && confidence_score !== null && confidence_score !== '') {
    confidence = parseNonNegativeNumber(confidence_score, 'confidence_score', errors);
    if (confidence !== null && confidence > 100) errors.push('confidence_score must be between 0 and 100');
  }
  if (expires_at && Number.isNaN(Date.parse(expires_at))) {
    errors.push('expires_at must be a valid date string');
  }
  if (raw_result !== null && typeof raw_result !== 'object') {
    errors.push('raw_result must be an object');
  }

  return { errors, confidence };
}

function validateVerificationWebhookInput(body = {}, params = {}) {
  const errors = [];
  const supportedProviders = [
    'manual',
    'stripe_identity',
    'persona',
    'plaid',
    'middesk',
    'state_license_board',
    'insurance_carrier',
    'metal_pay',
    'xpr_network',
  ];
  const { provider } = params || {};
  const {
    verification_check_id,
    provider_reference,
    event_type = 'verification_provider_event_received',
    status,
  } = body || {};

  validateOptionalString(provider, 'provider', errors, 80);
  if (!provider || !supportedProviders.includes(provider)) {
    errors.push('provider must be a supported verification provider');
  }
  validateOptionalString(verification_check_id, 'verification_check_id', errors, 120);
  validateOptionalString(provider_reference, 'provider_reference', errors, 160);
  validateOptionalString(event_type, 'event_type', errors, 80);
  validateOptionalEnum(status, ['pending', 'in_review', 'verified', 'rejected', 'expired', 'needs_more_info', 'failed'], 'status', errors);

  return errors;
}

function validatePaymentWebhookInput(body = {}, params = {}) {
  const errors = [];
  const { provider } = params || {};
  const {
    external_intent_id,
    event_type = 'provider_webhook_received',
    status,
    amount_usd,
    provider_reference,
    tx_hash,
  } = body || {};

  validateOptionalString(provider, 'provider', errors, 80);
  if (!provider || !paymentProviders.some((item) => item.id === provider)) {
    errors.push(`Unsupported provider: ${provider}`);
  }
  if (!isNonEmptyString(external_intent_id)) errors.push('external_intent_id is required');
  validateOptionalString(external_intent_id, 'external_intent_id', errors, 160);
  validateOptionalString(event_type, 'event_type', errors, 80);
  validateOptionalEnum(status, ['created', 'provider_setup_required', 'pending', 'paid', 'failed', 'refunded', 'disputed', 'cancelled'], 'status', errors);
  validateOptionalString(provider_reference, 'provider_reference', errors, 160);
  validateOptionalString(tx_hash, 'tx_hash', errors, 160);

  let amount = null;
  if (amount_usd !== undefined && amount_usd !== null && amount_usd !== '') {
    amount = parsePositiveNumber(amount_usd, 'amount_usd', errors);
  }

  return { errors, amount };
}

function parsePositiveNumber(value, fieldName, errors) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) {
    errors.push(`${fieldName} must be a number greater than 0`);
    return null;
  }
  return number;
}

function parseNonNegativeNumber(value, fieldName, errors) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    errors.push(`${fieldName} must be a number greater than or equal to 0`);
    return null;
  }
  return number;
}

function validateOptionalEnum(value, allowedValues, fieldName, errors) {
  if (value === undefined || value === null || value === '') return;
  if (!allowedValues.includes(value)) {
    errors.push(`${fieldName} must be one of: ${allowedValues.join(', ')}`);
  }
}

function validateOptionalString(value, fieldName, errors, maxLength = 200) {
  if (value === undefined || value === null) return;
  if (typeof value !== 'string') {
    errors.push(`${fieldName} must be a string`);
    return;
  }
  if (value.length > maxLength) {
    errors.push(`${fieldName} must be ${maxLength} characters or less`);
  }
}

async function recordAuditEvent({
  actor_type = 'system',
  actor_id = null,
  action,
  entity_type,
  entity_id = null,
  old_value = null,
  new_value = null,
  source = 'api',
  req = null,
}) {
  if (!supabase || !action || !entity_type) return;
  const event = {
    actor_type,
    actor_id,
    action,
    entity_type,
    entity_id,
    old_value,
    new_value,
    source,
    request_id: req?.id || req?.headers?.['x-request-id'] || null,
    ip_address: req?.ip || null,
    user_agent: req?.headers?.['user-agent'] || null,
  };
  const { error } = await supabase.from('audit_events').insert(event);
  if (error) console.error('Audit event error:', error.message);
}

const paymentProviders = [
  {
    id: 'metal_pay',
    name: 'Metal Pay Connect',
    rail: 'crypto_onramp',
    status: process.env.METAL_PAY_CONNECT_API_KEY && process.env.METAL_PAY_CONNECT_SECRET_KEY ? 'ready' : 'needs_keys',
    best_for: 'Metallicus ecosystem payments, crypto buying/selling, XPR-compatible user onboarding',
    env_required: ['METAL_PAY_CONNECT_API_KEY', 'METAL_PAY_CONNECT_SECRET_KEY'],
  },
  {
    id: 'xpr_network',
    name: 'XPR Network / WebAuth',
    rail: 'native_crypto',
    status: 'ready',
    best_for: 'GCSC, GCST, XPR wallet payments, lead tokens, memberships, agent-to-agent micropayments',
    env_required: ['GCSC_XPR_RECEIVER_ACCOUNT'],
  },
  {
    id: 'stripe',
    name: 'Stripe',
    rail: 'cards_ach_wallets_stablecoins',
    status: process.env.STRIPE_SECRET_KEY ? 'ready' : 'needs_keys',
    best_for: 'credit cards, debit cards, ACH, subscriptions, Apple Pay, Google Pay, stablecoin payments where approved',
    env_required: ['STRIPE_SECRET_KEY'],
  },
  {
    id: 'paypal_crypto',
    name: 'PayPal Pay with Crypto',
    rail: 'paypal_cards_crypto',
    status: process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET ? 'ready' : 'needs_keys',
    best_for: 'mainstream PayPal checkout, global crypto buyers, automatic crypto-to-fiat settlement',
    env_required: ['PAYPAL_CLIENT_ID', 'PAYPAL_CLIENT_SECRET'],
  },
  {
    id: 'coinbase_commerce',
    name: 'Coinbase Commerce',
    rail: 'onchain_usdc_crypto',
    status: process.env.COINBASE_COMMERCE_API_KEY ? 'ready' : 'needs_keys',
    best_for: 'USDC/onchain checkout with hosted payment pages and Coinbase account support',
    env_required: ['COINBASE_COMMERCE_API_KEY'],
  },
  {
    id: 'btcpay',
    name: 'BTCPay Server',
    rail: 'self_hosted_bitcoin',
    status: process.env.BTCPAY_SERVER_URL && process.env.BTCPAY_API_KEY ? 'ready' : 'needs_keys',
    best_for: 'self-hosted Bitcoin/Lightning payments with no processor lock-in',
    env_required: ['BTCPAY_SERVER_URL', 'BTCPAY_API_KEY'],
  },
];

function paymentIntentId(provider) {
  return `gcsc_${provider}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

function requestId(value) {
  if (typeof value === 'string' && /^[a-zA-Z0-9._:-]{8,100}$/.test(value.trim())) {
    return value.trim();
  }
  return crypto.randomUUID();
}

// ─── OpenRouter Client (compatible with OpenAI SDK) ───────────────────────────
const openai = new OpenAI({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://gcsc.io',
    'X-Title': 'GCSC BuilderAI',
  },
});

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  req.id = requestId(req.headers['x-request-id']);
  res.setHeader('X-Request-Id', req.id);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-Id');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: '50kb' }));
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Invalid JSON body',
      request_id: req.id || null,
    });
  }
  return next(err);
});
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/smartcontractor', requireProtectedRoute);
app.use('/api/admin/risk-console', requireProtectedAdminRoute);
app.use('/api/audit/events', requireProtectedAdminRoute);

// ─── Rate Limiting ─────────────────────────────────────────────────────────────
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute window
  max: 20,                    // 20 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a moment.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minute window
  max: 5,                     // limit Magic Link email requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many Magic Link requests. Please wait before requesting another login email.',
  },
});

// ─── Chat Endpoint ─────────────────────────────────────────────────────────────
app.post('/api/chat', chatLimiter, async (req, res) => {
  const { messages, context } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  // Validate message structure
  const validRoles = ['user', 'assistant'];
  for (const msg of messages) {
    if (!validRoles.includes(msg.role) || typeof msg.content !== 'string') {
      return res.status(400).json({ error: 'Invalid message format' });
    }
    if (msg.content.length > 4000) {
      return res.status(400).json({ error: 'Message too long (max 4000 chars)' });
    }
  }

  // Build system prompt — inject context if provided (e.g. user role: contractor/homeowner)
  let systemPrompt = SYSTEM_PROMPT;
  if (context?.userType) {
    systemPrompt += `\n\n---\n## CURRENT SESSION CONTEXT\nUser type: ${context.userType === 'contractor' ? 'CONTRACTOR — focus on business protection, lien rights, payment terms, licensing, leads.' : 'HOMEOWNER — focus on consumer protections, how to vet contractors, contract review, fair pricing.'}`;
  }
  if (context?.projectType) {
    systemPrompt += `\nProject type: ${context.projectType}`;
  }
  if (context?.location) {
    systemPrompt += `\nUser location: ${context.location} — mention applicable local codes/laws when relevant.`;
  }

  try {
    // Stream the response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    const allMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-20),
    ];

    const stream = await openai.chat.completions.create({
      model: 'anthropic/claude-sonnet-4-5',
      max_tokens: 1500,
      messages: allMessages,
      stream: true,
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || '';
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (err) {
    console.error('Anthropic API error:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'AI service temporarily unavailable. Please try again.' });
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`);
      res.end();
    }
  }
});

// ─── Quick Questions Endpoint (non-streaming, for short answers) ───────────────
app.post('/api/quick', chatLimiter, async (req, res) => {
  const { question, context } = req.body;

  if (!question || typeof question !== 'string' || question.length > 500) {
    return res.status(400).json({ error: 'question string required (max 500 chars)' });
  }

  let systemPrompt = SYSTEM_PROMPT + '\n\nFor this request, give a CONCISE answer in 2–4 sentences maximum.';

  try {
    const response = await openai.chat.completions.create({
      model: 'anthropic/claude-haiku-4-5',
      max_tokens: 300,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
      ],
    });

    res.json({ answer: response.choices[0].message.content });
  } catch (err) {
    console.error('Quick API error:', err.message);
    res.status(500).json({ error: 'Service temporarily unavailable' });
  }
});

// ─── Suggested Questions Endpoint ─────────────────────────────────────────────
app.get('/api/suggestions', (req, res) => {
  const { userType } = req.query;

  const contractorSuggestions = [
    "How do I write a solid lien waiver to protect my payment?",
    "What insurance do I need as a general contractor?",
    "How should I price a change order?",
    "Can an owner withhold retainage after substantial completion?",
    "What's the difference between pay-when-paid and pay-if-paid?",
    "How do I file a mechanics lien in my state?",
    "What should be in my subcontractor agreement?",
    "How do I handle a customer who won't pay the final invoice?",
  ];

  const homeownerSuggestions = [
    "What questions should I ask before hiring a contractor?",
    "How much can a contractor ask for as a down payment?",
    "What should be in a home improvement contract?",
    "How do I verify a contractor's license and insurance?",
    "What is a retainage and should I use it?",
    "My contractor abandoned the project — what are my options?",
    "How do I handle a dispute over work quality?",
    "What permits do I need for a kitchen remodel?",
  ];

  const generalSuggestions = [
    "What is a change order and when is it required?",
    "Explain the construction phases for a new home",
    "What building codes apply to residential construction?",
    "What is a punch list and when does it happen?",
    "How long does a contractor warranty last?",
    "What is substantial completion?",
    "What does 'cost plus' mean in a construction contract?",
    "How do smart contracts improve construction payment security?",
  ];

  const suggestions = userType === 'contractor'
    ? contractorSuggestions
    : userType === 'homeowner'
    ? homeownerSuggestions
    : generalSuggestions;

  res.json({ suggestions });
});

// Payment provider router: keeps cards, wallets, crypto, and future providers behind one API.
app.get('/api/payments/providers', (req, res) => {
  res.json({
    providers: paymentProviders.map(({ env_required, ...provider }) => ({
      ...provider,
      setup_hint: env_required.length ? `Set ${env_required.join(', ')} in the server environment.` : 'No private provider keys required.',
    })),
  });
});

app.get('/api/payments/metal-pay/signature', (req, res) => {
  const apiKey = process.env.METAL_PAY_CONNECT_API_KEY;
  const secretKey = process.env.METAL_PAY_CONNECT_SECRET_KEY;
  if (!apiKey || !secretKey) {
    return res.status(503).json({
      error: 'Metal Pay Connect is not configured',
      required_env: ['METAL_PAY_CONNECT_API_KEY', 'METAL_PAY_CONNECT_SECRET_KEY'],
    });
  }

  const nonce = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(nonce + apiKey)
    .digest('hex');

  res.json({
    apiKey,
    signature,
    nonce,
    environment: process.env.METAL_PAY_CONNECT_ENV || 'dev',
    networks: ['xpr-network'],
  });
});

app.post('/api/payments/intents', async (req, res) => {
  const {
    provider = 'xpr_network',
    amount_usd,
    currency = 'USD',
    purpose = 'smartcontractor_payment',
    payer_role,
    reference_id,
  } = req.body;

  const providerConfig = paymentProviders.find((item) => item.id === provider);
  if (!providerConfig) {
    return res.status(400).json({ error: `Unsupported provider: ${provider}` });
  }

  const errors = [];
  const amount = parsePositiveNumber(amount_usd, 'amount_usd', errors);
  validateOptionalEnum(payer_role, ['homeowner', 'contractor', 'smartcontractor_user', 'admin', 'dao', 'system', 'unknown'], 'payer_role', errors);
  validateOptionalString(purpose, 'purpose', errors, 80);
  validateOptionalString(reference_id, 'reference_id', errors, 120);

  if (!/^[A-Z]{3,8}$/.test(String(currency))) {
    errors.push('currency must be an uppercase code like USD, USDC, XPR, GCSC, or GCST');
  }
  if (amount && amount > 1000000) {
    errors.push('amount_usd must be 1000000 or less for MVP safety');
  }
  if (errors.length) return validationError(res, errors);

  const externalIntentId = paymentIntentId(provider);
  const intent = {
    id: externalIntentId,
    provider,
    provider_name: providerConfig.name,
    amount_usd: amount,
    currency,
    purpose,
    payer_role: payer_role || 'unknown',
    reference_id: reference_id || null,
    status: providerConfig.status === 'ready' ? 'created' : 'provider_setup_required',
    checkout_url: null,
    instructions: '',
    metadata: {},
  };

  if (provider === 'metal_pay') {
    intent.instructions = 'Use Metal Pay Connect signature endpoint, then render the Metal Pay Connect SDK on the client.';
    intent.metadata.signature_endpoint = '/api/payments/metal-pay/signature';
    intent.metadata.networks = ['xpr-network'];
  }

  if (provider === 'xpr_network') {
    intent.instructions = 'Use WebAuth Wallet / XPR Network transfer and return transaction hash to GCSC.';
    intent.metadata.recipient = process.env.GCSC_XPR_RECEIVER_ACCOUNT || 'gcsctoken111';
    intent.metadata.accepted_assets = ['XPR', 'GCSC', 'GCST'];
  }

  if (provider === 'stripe') {
    intent.instructions = 'Create a Stripe Checkout Session or PaymentIntent on the server once Stripe keys are connected.';
    intent.metadata.supported_methods = ['card', 'debit_card', 'ach', 'apple_pay', 'google_pay', 'stablecoin_where_available'];
  }

  if (provider === 'paypal_crypto') {
    intent.instructions = 'Create a PayPal order with crypto payment method after PayPal business approval.';
    intent.metadata.supported_methods = ['paypal', 'card', 'pay_with_crypto_where_available'];
  }

  if (provider === 'coinbase_commerce') {
    intent.instructions = 'Create a Coinbase Commerce charge or hosted checkout for USDC/onchain settlement.';
    intent.metadata.supported_methods = ['USDC', 'onchain_crypto'];
  }

  if (provider === 'btcpay') {
    intent.instructions = 'Create a BTCPay invoice on your self-hosted BTCPay Server.';
    intent.metadata.supported_methods = ['bitcoin', 'lightning'];
  }

  if (supabase) {
    const { data: storedIntent, error: intentError } = await supabase
      .from('payment_intents')
      .insert({
        external_intent_id: externalIntentId,
        provider: intent.provider,
        provider_name: intent.provider_name,
        amount_usd: intent.amount_usd,
        currency: intent.currency,
        purpose: intent.purpose,
        payer_role: intent.payer_role,
        reference_id: intent.reference_id,
        status: intent.status,
        checkout_url: intent.checkout_url,
        instructions: intent.instructions,
        metadata: intent.metadata,
      })
      .select()
      .single();

    if (intentError) return res.status(500).json({ error: intentError.message });
    intent.database_id = storedIntent.id;

    await supabase.from('payment_events').insert({
      payment_intent_id: storedIntent.id,
      external_intent_id: externalIntentId,
      provider: intent.provider,
      event_type: 'payment_intent_created',
      status: intent.status,
      amount_usd: intent.amount_usd,
      raw_event: intent,
    });

    await recordAuditEvent({
      actor_type: 'system',
      action: 'payment_intent_created',
      entity_type: 'payment_intent',
      entity_id: storedIntent.id,
      new_value: intent,
      source: 'api',
      req,
    });
  }

  res.status(201).json({ payment_intent: intent });
});

app.get('/api/payments/intents', async (req, res) => {
  if (!requireSupabase(res)) return;

  const { provider, status = 'all', reference_id } = req.query;
  let query = supabase
    .from('payment_intents')
    .select('id,external_intent_id,provider,provider_name,amount_usd,currency,purpose,payer_role,reference_id,status,checkout_url,instructions,metadata,created_at,updated_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (provider) query = query.eq('provider', provider);
  if (status !== 'all') query = query.eq('status', status);
  if (reference_id) query = query.eq('reference_id', reference_id);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ payment_intents: data });
});

app.get('/api/payments/events', async (req, res) => {
  if (!requireSupabase(res)) return;

  const { provider, external_intent_id, payment_intent_id } = req.query;
  let query = supabase
    .from('payment_events')
    .select('id,payment_intent_id,external_intent_id,provider,event_type,status,amount_usd,provider_reference,tx_hash,raw_event,received_at')
    .order('received_at', { ascending: false })
    .limit(50);

  if (provider) query = query.eq('provider', provider);
  if (external_intent_id) query = query.eq('external_intent_id', external_intent_id);
  if (payment_intent_id) query = query.eq('payment_intent_id', payment_intent_id);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ payment_events: data });
});

app.post('/api/payments/webhooks/:provider', async (req, res) => {
  const paymentWebhookValidation = validatePaymentWebhookInput(req.body, req.params);
  if (paymentWebhookValidation.errors.length) return validationError(res, paymentWebhookValidation.errors);

  if (!requireSupabase(res)) return;

  const { provider } = req.params;
  const {
    external_intent_id,
    event_type = 'provider_webhook_received',
    status,
    provider_reference,
    tx_hash,
  } = req.body;
  const { amount } = paymentWebhookValidation;

  const { data: intent } = await supabase
    .from('payment_intents')
    .select('id,status')
    .eq('external_intent_id', external_intent_id)
    .maybeSingle();

  const { data: paymentEvent, error: eventError } = await supabase
    .from('payment_events')
    .insert({
      payment_intent_id: intent?.id || null,
      external_intent_id,
      provider,
      event_type,
      status,
      amount_usd: amount,
      provider_reference,
      tx_hash,
      raw_event: req.body,
    })
    .select()
    .single();

  if (eventError) return res.status(500).json({ error: eventError.message });

  let updatedIntent = null;
  if (intent?.id && status) {
    const { data, error } = await supabase
      .from('payment_intents')
      .update({ status })
      .eq('id', intent.id)
      .select('id,external_intent_id,provider,status,updated_at')
      .single();
    if (error) return res.status(500).json({ error: error.message });
    updatedIntent = data;
  }

  await recordAuditEvent({
    actor_type: 'webhook',
    action: 'payment_webhook_received',
    entity_type: 'payment_event',
    entity_id: paymentEvent.id,
    old_value: intent ? { status: intent.status } : null,
    new_value: { payment_event: paymentEvent, payment_intent: updatedIntent },
    source: 'webhook',
    req,
  });

  res.status(202).json({ payment_event: paymentEvent, payment_intent: updatedIntent });
});

app.get('/api/audit/events', async (req, res) => {
  if (!requireSupabase(res)) return;

  const { entity_type, entity_id, action, actor_type } = req.query;
  let query = supabase
    .from('audit_events')
    .select('id,actor_type,actor_id,action,entity_type,entity_id,old_value,new_value,source,request_id,created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  if (entity_type) query = query.eq('entity_type', entity_type);
  if (entity_id) query = query.eq('entity_id', entity_id);
  if (action) query = query.eq('action', action);
  if (actor_type) query = query.eq('actor_type', actor_type);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ audit_events: data });
});

function groupByStatus(rows, field = 'status') {
  return rows.reduce((counts, row) => {
    const key = row[field] || 'unknown';
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function envConfigured(name) {
  return !isPlaceholderSecret(process.env[name]);
}

function readinessItem(id, label, status, detail, owner = 'codex') {
  return { id, label, status, detail, owner };
}

function readinessSummary(items) {
  return items.reduce((summary, item) => {
    summary[item.status] = (summary[item.status] || 0) + 1;
    return summary;
  }, { ready: 0, review: 0, blocked: 0, missing: 0 });
}

function readinessDecision(items) {
  const demoRequired = new Set([
    'local_backend',
    'smartcontractor_pwa',
    'supabase_public_config',
    'admin_console',
    'audit_ledger',
  ]);
  const demoBlocked = items.some((item) => demoRequired.has(item.id) && (item.status === 'blocked' || item.status === 'missing'));
  const publicBlockingStatuses = new Set(['blocked', 'missing', 'review']);
  const publicBlocked = items.some((item) => publicBlockingStatuses.has(item.status));
  return {
    demo_launch: demoBlocked ? 'blocked' : 'ready',
    public_launch: publicBlocked ? 'blocked' : 'ready',
    real_money_launch: 'blocked',
    reason: demoBlocked
      ? 'Demo-critical requirements are still missing.'
      : publicBlocked
      ? 'Demo path can continue, but public/real-money launch still needs review, legal, payment, auth, and deployment items cleared.'
      : 'Demo and public-readiness checks are clear; real-money launch remains blocked until final legal/payment approvals.',
  };
}

function founderActionItems() {
  const authMode = process.env.SMARTCONTRACTOR_AUTH_MODE || 'undecided';
  return [
    {
      id: 'reconnect_supabase_connector',
      phase: 'account_access',
      label: 'Reconnect Supabase connector',
      status: 'blocked',
      owner: 'founder',
      why: 'Codex cannot inspect live Supabase tables or advisors because the connector token expired.',
      action_steps: [
        'Open Codex plugins/connectors.',
        'Find Supabase.',
        'Click reconnect or sign in again.',
        'Return to this chat and say: Supabase reconnected.',
      ],
      safe_handling: 'No database changes are made by this action. It only restores read/admin connector access.',
    },
    {
      id: 'approve_magic_link',
      phase: 'auth',
      label: 'Approve Magic Link for MVP',
      status: authMode === 'magic_link' ? 'ready' : 'review',
      owner: 'founder',
      why: 'The MVP needs one login method before strict ownership, RLS, and admin smoke tests.',
      action_steps: [
        'Review the Auth Decision Package in the Admin tab.',
        'Approve Magic Link for first public MVP unless you explicitly want passwords now.',
        'After approval, set the backend environment auth mode to magic_link.',
      ],
      safe_handling: 'This decision does not expose secrets and does not apply RLS by itself.',
    },
    {
      id: 'configure_service_role_secret',
      phase: 'secrets',
      label: 'Configure Supabase service-role secret server-side',
      status: supabaseAdmin ? 'ready' : 'blocked',
      owner: 'founder',
      why: 'Strict backend database operations and admin membership checks need a server-only Supabase service role.',
      action_steps: [
        'Open Supabase project settings.',
        'Open API keys.',
        'Copy the service-role key only into local or deployment environment secrets.',
        'Do not paste the key into chat, GitHub, frontend code, or public files.',
        'Restart backend and run npm run check:auth.',
      ],
      safe_handling: 'The app may report configured/missing status, but it must never print the secret value.',
    },
    {
      id: 'apply_profile_ownership_staging',
      phase: 'database',
      label: 'Apply profile ownership SQL in staging first',
      status: 'review',
      owner: 'founder+codex',
      why: 'profiles.auth_user_id must exist before real Auth/RLS ownership can be enforced.',
      action_steps: [
        'Review docs/smartcontractor-profile-ownership-draft.sql.',
        'Apply it only to staging or confirmed demo Supabase project first.',
        'Create one homeowner test user and one contractor test user.',
        'Run auth smoke tests with real access tokens.',
      ],
      safe_handling: 'Do not apply directly to production until test users pass.',
    },
    {
      id: 'apply_admin_memberships_staging',
      phase: 'database',
      label: 'Apply admin membership SQL in staging first',
      status: 'review',
      owner: 'founder+codex',
      why: 'Founder/risk/compliance/treasury/legal roles must be database-backed before strict admin endpoints are exposed.',
      action_steps: [
        'Review docs/smartcontractor-admin-role-model-draft.sql.',
        'Apply it only after service-role secret is configured server-side.',
        'Add founder account as active founder role.',
        'Run GET /api/admin/me with a real Supabase access token.',
      ],
      safe_handling: 'Admin roles must never rely on user-editable metadata.',
    },
    {
      id: 'legal_loan_review',
      phase: 'legal',
      label: 'Attorney review for contractor loans',
      status: 'blocked',
      owner: 'founder',
      why: 'Real starter loans, collateral, repayment waterfall, default, and ownership language need legal review before activation.',
      action_steps: [
        'Prepare loan terms, borrower disclosures, repayment rules, and default workflow.',
        'Ask attorney whether GCSC is lender, broker, marketplace, or needs a licensed partner.',
        'Do not activate real loan approvals until written legal guidance is received.',
      ],
      safe_handling: 'MVP may simulate loans. Real money decisions stay blocked.',
    },
    {
      id: 'escrow_payment_partner_review',
      phase: 'legal_payments',
      label: 'Escrow and milestone payment partner review',
      status: 'blocked',
      owner: 'founder',
      why: 'Holding or releasing homeowner money may trigger escrow, money transmission, consumer protection, or payment-provider requirements.',
      action_steps: [
        'Decide whether the first MVP uses licensed payment provider escrow, direct milestone payment, or no held funds.',
        'Review Stripe/Metal Pay/ACH options with legal and provider terms.',
        'Keep escrow release disabled until partner/legal path is approved.',
      ],
      safe_handling: 'Never store card numbers. Never hold real funds without approved rails.',
    },
    {
      id: 'payment_provider_keys',
      phase: 'payments',
      label: 'Configure payment provider keys',
      status: envConfigured('METAL_PAY_CONNECT_API_KEY') || envConfigured('STRIPE_SECRET_KEY') ? 'review' : 'blocked',
      owner: 'founder',
      why: 'Real checkout needs provider credentials, but each provider must remain behind the backend payment router.',
      action_steps: [
        'Choose first real payment provider for MVP.',
        'Create or verify provider account.',
        'Put secret keys only into backend/deployment secrets.',
        'Run provider sandbox payments before any real charge.',
      ],
      safe_handling: 'Provider secrets never go into frontend, GitHub, or chat.',
    },
    {
      id: 'deploy_platform_decision',
      phase: 'deployment',
      label: 'Choose deployment platform',
      status: 'blocked',
      owner: 'founder',
      why: 'GitHub Pages can serve static site, but backend/Auth/admin/payment endpoints need a real backend host.',
      action_steps: [
        'Choose Vercel, Supabase Edge Functions, Azure App Service, or another backend host.',
        'Connect GitHub repository.',
        'Add environment variables in deployment secrets.',
        'Run production readiness gate after deploy.',
      ],
      safe_handling: 'Do not put secrets in GitHub Pages static frontend.',
    },
  ];
}

async function safeConsoleQuery(name, queryBuilder) {
  try {
    const { data, error } = await queryBuilder();
    if (error) return { name, data: [], error: error.message };
    return { name, data: data || [], error: null };
  } catch (error) {
    return { name, data: [], error: error.message };
  }
}

function normalizeAgentInputRefs(inputRefs) {
  if (!Array.isArray(inputRefs)) {
    return ['contractor', 'job', 'loan', 'verification_checks', 'audit_events'];
  }
  return inputRefs
    .filter((item) => typeof item === 'string' && item.trim())
    .map((item) => item.trim())
    .slice(0, 12);
}

function buildStarterLoanReviewRecommendation({ entity_id, input_refs, facts = {} }) {
  const principal = Number(facts.principal_usd || facts.requested_amount_usd || 0);
  const riskScore = Number(facts.risk_score || 0);
  const verificationStatus = String(facts.verification_status || 'unknown');
  const hasSignedProjectContract = Boolean(facts.has_signed_project_contract);
  const hasRepaymentWaterfall = Boolean(facts.has_repayment_waterfall);
  const reasons = [];

  if (!hasSignedProjectContract) reasons.push('signed project contract evidence is missing');
  if (!hasRepaymentWaterfall) reasons.push('repayment waterfall needs founder/legal/provider review');
  if (!verificationStatus || ['unknown', 'missing', 'failed', 'expired'].includes(verificationStatus)) {
    reasons.push('business, license, insurance, or identity verification is incomplete');
  }
  if (principal > 5000) reasons.push('requested amount is above the local starter-loan demo cap');
  if (riskScore > 0 && riskScore < 65) reasons.push('risk score is below the local review threshold');
  if (!reasons.length) reasons.push('local-only review packet is ready for human review');

  const recommendation = reasons.some((reason) => reason.includes('above') || reason.includes('below'))
    ? 'high_risk_manual_review'
    : 'manual_review';

  return {
    agent: 'risk_assessment_agent',
    workflow: 'starter_loan_review',
    version: 'draft-2026-05-14',
    entity_type: 'contractor_loan',
    entity_id,
    input_refs: normalizeAgentInputRefs(input_refs),
    recommendation,
    confidence: recommendation === 'high_risk_manual_review' ? 0.64 : 0.72,
    reasons,
    required_human_review: true,
    blocked_actions: [
      'approve_real_loan',
      'fund_contractor',
      'route_repayment',
      'release_escrow',
      'settle_stablecoin',
      'lock_token_collateral',
      'move_money',
      'legal_decision',
    ],
    audit_event_required: true,
    local_only: true,
    live_action_status: 'BLOCKED_FOR_LIVE',
  };
}

function buildAiAgentWorkflowCatalog() {
  return [
    {
      agent: 'risk_assessment_agent',
      workflow: 'starter_loan_review',
      entity_type: 'contractor_loan',
      version: 'draft-2026-05-14',
      mode: 'local_structured_recommendation_only',
      required_permission: 'loan_review_prepare',
      required_human_review: true,
      audit_event_required: true,
      local_only: true,
      live_action_status: 'BLOCKED_FOR_LIVE',
      supported_facts: [
        'principal_usd',
        'requested_amount_usd',
        'risk_score',
        'verification_status',
        'has_signed_project_contract',
        'has_repayment_waterfall',
      ],
      required_input_refs: ['contractor', 'project_contract', 'milestones', 'verification_checks'],
      blocked_actions: [
        'approve_real_loan',
        'fund_contractor',
        'route_repayment',
        'release_escrow',
        'settle_stablecoin',
        'lock_token_collateral',
        'move_money',
        'legal_decision',
      ],
    },
  ];
}

app.get('/api/admin/ai-agents/workflows', requireAdminPermissions(['loan_review_prepare']), (req, res) => {
  res.json({
    status: 'local_only',
    supported_workflows: buildAiAgentWorkflowCatalog(),
    safety_boundaries: [
      'AI recommendations are draft support only.',
      'Deterministic rules and humans approve.',
      'No real loan, escrow, repayment, stablecoin, token collateral, money movement, legal, or provider action is enabled.',
    ],
  });
});

app.post('/api/admin/ai-agents/recommendations', requireAdminPermissions(['loan_review_prepare']), async (req, res) => {
  const { workflow, entity_type = 'contractor_loan', entity_id, input_refs, facts = {} } = req.body || {};
  const errors = [];
  if (workflow !== 'starter_loan_review') errors.push('workflow must be starter_loan_review');
  if (entity_type !== 'contractor_loan') errors.push('entity_type must be contractor_loan');
  if (!isNonEmptyString(entity_id)) errors.push('entity_id is required');
  if (input_refs !== undefined) {
    if (!Array.isArray(input_refs) || input_refs.some((item) => !isNonEmptyString(item))) {
      errors.push('input_refs must be an array of non-empty strings');
    } else if (!input_refs.length) {
      errors.push('input_refs must include at least one reference');
    }
  }
  if (facts === null || typeof facts !== 'object' || Array.isArray(facts)) errors.push('facts must be an object');
  if (facts && typeof facts === 'object' && !Array.isArray(facts)) {
    validateOptionalFiniteNumber(facts.principal_usd, 'principal_usd', errors);
    validateOptionalFiniteNumber(facts.requested_amount_usd, 'requested_amount_usd', errors);
    validateOptionalFiniteNumber(facts.risk_score, 'risk_score', errors);
    if (facts.risk_score !== undefined && facts.risk_score !== null && facts.risk_score !== '') {
      const riskScore = Number(facts.risk_score);
      if (Number.isFinite(riskScore) && (riskScore < 0 || riskScore > 100)) {
        errors.push('risk_score must be between 0 and 100');
      }
    }
  }
  if (errors.length) return validationError(res, errors);

  const recommendation = buildStarterLoanReviewRecommendation({
    entity_id: entity_id.trim(),
    input_refs,
    facts,
  });

  const skipAuditForSmoke = process.env.SMARTCONTRACTOR_AI_AGENT_AUDIT_MODE === 'skip';
  const auditEventAttempted = Boolean(supabase) && !skipAuditForSmoke;
  if (auditEventAttempted) {
    recordAuditEvent({
      actor_type: 'admin',
      action: 'ai_recommendation_generated',
      entity_type: recommendation.entity_type,
      entity_id: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(recommendation.entity_id)
        ? recommendation.entity_id
        : null,
      new_value: recommendation,
      source: 'api',
      req,
    }).catch((error) => {
      console.error('AI recommendation audit event error:', error.message);
    });
  }

  res.status(201).json({
    recommendation,
    audit_event_attempted: auditEventAttempted,
    safe_scope: [
      'This endpoint creates a local structured recommendation only.',
      'It does not approve real loans, fund contractors, route repayment, release escrow, settle stablecoins, lock token collateral, or make legal decisions.',
      'Human founder/admin/legal/provider review remains required before any live action.',
    ],
  });
});

app.get('/api/admin/risk-console', async (req, res) => {
  if (!requireSupabase(res)) return;

  const [
    loans,
    disputes,
    paymentIntents,
    verificationChecks,
    auditEvents,
    collateralLocks,
  ] = await Promise.all([
    safeConsoleQuery('loans', () => supabase
      .from('contractor_loans')
      .select('id,contractor_id,job_id,principal_usd,outstanding_usd,apr_percent,purpose,status,risk_score,created_at')
      .order('created_at', { ascending: false })
      .limit(25)),
    safeConsoleQuery('disputes', () => supabase
      .from('disputes')
      .select('id,job_id,homeowner_id,contractor_id,opened_by_role,title,description,status,resolution,created_at')
      .order('created_at', { ascending: false })
      .limit(25)),
    safeConsoleQuery('payment_intents', () => supabase
      .from('payment_intents')
      .select('id,external_intent_id,provider,provider_name,amount_usd,currency,purpose,payer_role,reference_id,status,created_at,updated_at')
      .order('created_at', { ascending: false })
      .limit(25)),
    safeConsoleQuery('verification_checks', () => supabase
      .from('verification_checks')
      .select('id,subject_type,subject_id,provider,check_type,status,confidence_score,result_summary,expires_at,created_at,updated_at')
      .order('created_at', { ascending: false })
      .limit(25)),
    safeConsoleQuery('audit_events', () => supabase
      .from('audit_events')
      .select('id,actor_type,action,entity_type,entity_id,source,created_at')
      .order('created_at', { ascending: false })
      .limit(25)),
    safeConsoleQuery('collateral_locks', () => supabase
      .from('token_collateral_locks')
      .select('id,contractor_id,loan_id,wallet_account,token_symbol,collateral_value_usd,ltv_percent,max_borrow_usd,status,risk_note,created_at,updated_at')
      .order('created_at', { ascending: false })
      .limit(25)),
  ]);

  const loanRows = loans.data;
  const disputeRows = disputes.data;
  const paymentRows = paymentIntents.data;
  const verificationRows = verificationChecks.data;
  const collateralRows = collateralLocks.data;

  const pendingLoans = loanRows.filter((loan) => ['requested', 'manual_review', 'pending_review'].includes(loan.status));
  const activeLoanExposureUsd = loanRows
    .filter((loan) => !['repaid', 'cancelled', 'rejected'].includes(loan.status))
    .reduce((total, loan) => total + Number(loan.outstanding_usd || 0), 0);
  const openDisputes = disputeRows.filter((dispute) => !['resolved', 'closed', 'cancelled'].includes(dispute.status));
  const paymentExceptions = paymentRows.filter((intent) => ['provider_setup_required', 'failed', 'refunded', 'disputed', 'cancelled'].includes(intent.status));
  const pendingVerifications = verificationRows.filter((check) => ['pending', 'in_review', 'needs_more_info', 'failed', 'expired'].includes(check.status));
  const collateralReview = collateralRows.filter((lock) => ['proposed', 'pending_review', 'margin_warning'].includes(lock.status));

  const actionQueue = [
    ...pendingLoans.slice(0, 5).map((loan) => ({
      priority: Number(loan.risk_score || 0) < 65 ? 'high' : 'medium',
      type: 'loan_review',
      title: `Review loan ${loan.id}`,
      detail: `$${Number(loan.principal_usd || 0).toLocaleString()} requested, risk score ${loan.risk_score || 'not scored'}`,
      entity_id: loan.id,
    })),
    ...openDisputes.slice(0, 5).map((dispute) => ({
      priority: 'high',
      type: 'dispute_review',
      title: dispute.title,
      detail: `Status ${dispute.status}; opened by ${dispute.opened_by_role}`,
      entity_id: dispute.id,
    })),
    ...paymentExceptions.slice(0, 5).map((intent) => ({
      priority: intent.status === 'provider_setup_required' ? 'medium' : 'high',
      type: 'payment_exception',
      title: `${intent.provider_name || intent.provider} payment ${intent.status}`,
      detail: `$${Number(intent.amount_usd || 0).toLocaleString()} ${intent.purpose || 'payment'} needs review`,
      entity_id: intent.id,
    })),
    ...pendingVerifications.slice(0, 5).map((check) => ({
      priority: check.status === 'failed' || check.status === 'expired' ? 'high' : 'medium',
      type: 'verification_review',
      title: `${check.check_type} verification ${check.status}`,
      detail: `${check.provider} check for ${check.subject_type}`,
      entity_id: check.id,
    })),
  ].slice(0, 12);

  res.json({
    generated_at: new Date().toISOString(),
    mode: 'mvp_review_console',
    summary: {
      pending_loans: pendingLoans.length,
      active_loan_exposure_usd: activeLoanExposureUsd,
      open_disputes: openDisputes.length,
      payment_exceptions: paymentExceptions.length,
      pending_verifications: pendingVerifications.length,
      collateral_items_for_review: collateralReview.length,
      provider_setup_required: paymentProviders.filter((provider) => provider.status === 'needs_keys').length,
    },
    status_breakdown: {
      loans: groupByStatus(loanRows),
      disputes: groupByStatus(disputeRows),
      payments: groupByStatus(paymentRows),
      verifications: groupByStatus(verificationRows),
      collateral: groupByStatus(collateralRows),
    },
    action_queue: actionQueue,
    provider_status: paymentProviders.map(({ env_required, ...provider }) => ({
      ...provider,
      setup_hint: env_required.length ? `Set ${env_required.join(', ')} in the server environment.` : 'No private provider keys required.',
    })),
    recent: {
      loans: loanRows.slice(0, 8),
      disputes: disputeRows.slice(0, 8),
      payment_intents: paymentRows.slice(0, 8),
      verification_checks: verificationRows.slice(0, 8),
      collateral_locks: collateralRows.slice(0, 8),
      audit_events: auditEvents.data.slice(0, 12),
    },
    query_errors: [loans, disputes, paymentIntents, verificationChecks, auditEvents, collateralLocks]
      .filter((result) => result.error)
      .map((result) => ({ table: result.name, error: result.error })),
    warnings: [
      'Admin console is an MVP review surface, not a production permission system.',
      'Real loan approvals, payment releases, collateral locks, and legal decisions require admin authorization and legal review.',
      'Connect Supabase Auth and strict RLS before exposing this endpoint publicly.',
    ],
  });
});

app.get('/api/admin/launch-readiness', (req, res) => {
  const domain = process.env.PUBLIC_SITE_URL || 'https://xprnet.org';
  const authMode = process.env.SMARTCONTRACTOR_AUTH_MODE || 'undecided';
  const items = [
    readinessItem(
      'local_backend',
      'Local backend',
      'ready',
      'Express backend is running and this readiness endpoint responded.'
    ),
    readinessItem(
      'smartcontractor_pwa',
      'SmartContractor PWA',
      fs.existsSync(path.join(__dirname, 'public', 'smartcontractor.html')) &&
      fs.existsSync(path.join(__dirname, 'public', 'manifest.webmanifest')) &&
      fs.existsSync(path.join(__dirname, 'public', 'service-worker.js'))
        ? 'ready'
        : 'missing',
      'PWA shell, manifest, and service worker are required for demo and mobile install flow.'
    ),
    readinessItem(
      'mobile_readiness',
      'Mobile readiness checks',
      fs.existsSync(path.join(__dirname, 'capacitor.config.json')) &&
      fs.existsSync(path.join(__dirname, 'scripts', 'validate-mobile-readiness.mjs'))
        ? 'ready'
        : 'missing',
      'Capacitor config and mobile readiness validation are prepared for future Android/iOS wrappers.'
    ),
    readinessItem(
      'supabase_public_config',
      'Supabase public config',
      envConfigured('SUPABASE_URL') && envConfigured('SUPABASE_PUBLISHABLE_KEY') ? 'ready' : 'missing',
      'Supabase URL and publishable key must be configured. Service-role keys must stay server-only.'
    ),
    readinessItem(
      'supabase_service_role_boundary',
      'Supabase service-role boundary',
      supabaseAdmin ? 'ready' : 'missing',
      supabaseAdmin
        ? 'Server-only Supabase service-role client is configured for trusted backend database operations.'
        : 'Public launch remains blocked until SUPABASE_SERVICE_ROLE_KEY is configured server-side. Demo may use publishable fallback only locally.',
      'founder'
    ),
    readinessItem(
      'supabase_auth',
      'Supabase Auth',
      authMode === 'magic_link' || authMode === 'password' ? 'review' : 'blocked',
      authMode === 'undecided'
        ? 'Founder must choose magic link or password login before public launch.'
        : `Founder selected ${authMode}; login scaffold and session verification endpoint exist, but strict role ownership/RLS smoke tests are still required before public launch.`,
      'founder'
    ),
    readinessItem(
      'supabase_rls',
      'Strict Supabase RLS',
      'review',
      'Production RLS draft exists but must not be applied live until auth ownership rules are approved.',
      'founder'
    ),
    readinessItem(
      'domain_https',
      'Production domain / HTTPS',
      domain.startsWith('https://') ? 'review' : 'blocked',
      `Target domain is ${domain}. GitHub Pages/HTTPS must be verified before public traffic.`,
      'founder'
    ),
    readinessItem(
      'admin_console',
      'Admin / Risk Console',
      'ready',
      'Founder review queue and local draft notes exist for MVP review.'
    ),
    readinessItem(
      'admin_role_model',
      'Admin role model',
      'review',
      'Founder/Admin/Treasury/Legal/Risk role model is drafted; public admin endpoints must be role-gated before launch.',
      'founder'
    ),
    readinessItem(
      'admin_enforcement_scaffold',
      'Admin enforcement scaffold',
      adminEnforcementMode() === 'strict' ? 'review' : 'ready',
      adminEnforcementMode() === 'strict'
        ? 'Strict admin enforcement mode is enabled; run real admin smoke tests before public launch.'
        : 'Draft admin enforcement helper and /api/admin/me exist. Strict mode must be enabled before public launch.',
      'founder'
    ),
    readinessItem(
      'auth_scaffold',
      'Auth implementation scaffold',
      'ready',
      'Magic Link request endpoint, session-check endpoint, and browser auth panel are prepared without exposing secrets.'
    ),
    readinessItem(
      'audit_ledger',
      'Audit ledger',
      'ready',
      'Core actions write audit events when Supabase is configured.'
    ),
    readinessItem(
      'xpr_payments',
      'XPR payment rail',
      envConfigured('GCSC_XPR_RECEIVER_ACCOUNT') ? 'ready' : 'missing',
      'XPR receiver account is required for native XPR/GCSC/GCST payment handoff.'
    ),
    readinessItem(
      'metal_pay',
      'Metal Pay Connect',
      envConfigured('METAL_PAY_CONNECT_API_KEY') && envConfigured('METAL_PAY_CONNECT_SECRET_KEY') ? 'ready' : 'missing',
      'Metal Pay Connect requires partner/API keys before production checkout.',
      'founder'
    ),
    readinessItem(
      'card_payments',
      'Card/debit/ACH provider',
      envConfigured('STRIPE_SECRET_KEY') ? 'ready' : 'missing',
      'A card/debit/ACH provider key is required before real card payments.',
      'founder'
    ),
    readinessItem(
      'legal_loans',
      'Real contractor loans',
      'blocked',
      'Real loan approvals, loan agreements, ownership/collateral language, collections, and disclosures require attorney review.',
      'founder'
    ),
    readinessItem(
      'real_escrow',
      'Real escrow / milestone release',
      'blocked',
      'Milestone escrow or held funds must use approved legal/payment rails before real homeowner money is held or released.',
      'founder'
    ),
    readinessItem(
      'token_collateral',
      'Token collateral',
      'review',
      'Token collateral model exists, but oracle, custody, liquidation, securities, and legal review are required before activation.',
      'founder'
    ),
  ];

  res.json({
    generated_at: new Date().toISOString(),
    mode: 'production_readiness_gate',
    decision: readinessDecision(items),
    summary: readinessSummary(items),
    items,
    environment: {
      node_env: process.env.NODE_ENV || 'development',
      public_site_url_configured: Boolean(process.env.PUBLIC_SITE_URL),
      target_domain: domain,
      auth_mode: authMode,
      secrets_policy: 'Only configured/missing status is returned. Secret values are never exposed.',
    },
    next_owner_actions: items
      .filter((item) => item.owner === 'founder' && ['missing', 'blocked', 'review'].includes(item.status))
      .map((item) => ({
        id: item.id,
        action: item.label,
        status: item.status,
        detail: item.detail,
      })),
  });
});

app.get('/api/admin/mobile-install-readiness', (req, res) => {
  const publicDir = path.join(__dirname, 'public');
  const manifestPath = path.join(publicDir, 'manifest.webmanifest');
  const serviceWorkerPath = path.join(publicDir, 'service-worker.js');
  const offlinePath = path.join(publicDir, 'offline.html');
  const smartContractorPath = path.join(publicDir, 'smartcontractor.html');

  const files = [
    ['smartcontractor_html', smartContractorPath],
    ['manifest', manifestPath],
    ['service_worker', serviceWorkerPath],
    ['offline_shell', offlinePath],
    ['app_icon', path.join(publicDir, 'gcsc-logo.svg')],
  ].map(([id, filePath]) => ({
    id,
    path: path.relative(__dirname, filePath).replace(/\\/g, '/'),
    status: fs.existsSync(filePath) ? 'ready' : 'missing',
  }));

  let manifest = null;
  let manifestError = null;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    manifestError = error.message;
  }

  const serviceWorker = fs.existsSync(serviceWorkerPath)
    ? fs.readFileSync(serviceWorkerPath, 'utf8')
    : '';
  const offline = fs.existsSync(offlinePath)
    ? fs.readFileSync(offlinePath, 'utf8')
    : '';

  const checks = [
    readinessItem(
      'pwa_files',
      'PWA files',
      files.every((file) => file.status === 'ready') ? 'ready' : 'missing',
      'SmartContractor HTML, manifest, service worker, offline shell, and icon must exist before Android/iOS wrapper testing.'
    ),
    readinessItem(
      'manifest_parse',
      'Manifest JSON',
      manifest && !manifestError ? 'ready' : 'missing',
      manifestError || 'Manifest parses as JSON.'
    ),
    readinessItem(
      'manifest_identity',
      'Manifest identity',
      manifest?.id === '/smartcontractor.html' &&
      manifest?.start_url === '/smartcontractor.html?source=pwa' &&
      manifest?.display === 'standalone' &&
      manifest?.orientation === 'portrait-primary'
        ? 'ready'
        : 'review',
      'Manifest must keep SmartContractor as the installable app entrypoint.'
    ),
    readinessItem(
      'manifest_shortcuts',
      'Manifest shortcuts',
      Array.isArray(manifest?.shortcuts) && manifest.shortcuts.length >= 3 ? 'ready' : 'review',
      'Installed app should expose Jobs, Loans, and Disputes shortcuts.'
    ),
    readinessItem(
      'service_worker_shell',
      'Service worker shell cache',
      serviceWorker.includes('/smartcontractor.html') &&
      serviceWorker.includes('/offline.html') &&
      serviceWorker.includes('/manifest.webmanifest') &&
      serviceWorker.includes('/gcsc-logo.svg')
        ? 'ready'
        : 'review',
      'Service worker must cache the app shell and offline fallback assets.'
    ),
    readinessItem(
      'api_cache_boundary',
      'API cache boundary',
      serviceWorker.includes("requestUrl.pathname.startsWith('/api/')") ? 'ready' : 'blocked',
      'Service worker must not cache API routes because SmartContractor payments, Auth, disputes, and admin data are dynamic.'
    ),
    readinessItem(
      'offline_fallback',
      'Offline fallback',
      offline.includes('SmartContractor is offline') && offline.includes('/smartcontractor.html') ? 'ready' : 'review',
      'Offline page should clearly explain offline mode and link back to SmartContractor.'
    ),
  ];
  res.json({
    status: checks.every((check) => check.status === 'ready') ? 'ready' : 'review',
    app: {
      name: manifest?.name || 'SmartContractor',
      id: manifest?.id || null,
      start_url: manifest?.start_url || null,
      display: manifest?.display || null,
      orientation: manifest?.orientation || null,
    },
    files,
    checks,
    next_safe_step: 'Run npm run check:pwa-qa and capture mobile screenshots before generating native Android/iOS wrappers.',
    blocked_until_founder: [
      'Apple Developer account and certificates for iOS release.',
      'Play Console signing/release decisions for Android public release.',
      'Production deployment secrets and external account connections.',
    ],
  });
});

app.get('/api/admin/beta-readiness', (req, res) => {
  const docsDir = path.join(__dirname, '..', 'docs');
  const requiredDocs = [
    ['controlled_user_test_plan', 'smartcontractor-controlled-user-test-plan.md'],
    ['beta_issue_log_template', 'smartcontractor-beta-issue-log-template.md'],
    ['beta_tester_invite', 'smartcontractor-beta-tester-invite.md'],
    ['beta_feedback_synthesis', 'smartcontractor-beta-feedback-synthesis.md'],
    ['beta_session_runbook', 'smartcontractor-beta-session-runbook.md'],
    ['beta_session_summary', 'smartcontractor-beta-session-summary-template.md'],
    ['beta_decision_log', 'smartcontractor-beta-decision-log.md'],
    ['beta_triage_rubric', 'smartcontractor-beta-triage-rubric.md'],
    ['beta_issue_lifecycle', 'smartcontractor-beta-issue-lifecycle.md'],
    ['beta_go_no_go_scorecard', 'smartcontractor-beta-go-no-go-scorecard.md'],
    ['public_beta_handoff', 'smartcontractor-public-beta-handoff-checklist.md'],
    ['founder_action_queue', 'smartcontractor-founder-action-queue.md'],
    ['founder_auth_evidence', 'smartcontractor-founder-auth-evidence-template.md'],
    ['strict_admin_smoke', 'smartcontractor-strict-admin-smoke-checklist.md'],
    ['legal_financial_review', 'smartcontractor-legal-financial-review-checklist.md'],
  ].map(([id, fileName]) => {
    const filePath = path.join(docsDir, fileName);
    return {
      id,
      file: `docs/${fileName}`,
      status: fs.existsSync(filePath) ? 'ready' : 'missing',
    };
  });
  const readyDocs = requiredDocs.filter((doc) => doc.status === 'ready');
  const missingDocs = requiredDocs.filter((doc) => doc.status !== 'ready');

  const checks = [
    readinessItem(
      'controlled_test_docs',
      'Controlled beta documents',
      requiredDocs.every((doc) => doc.status === 'ready') ? 'ready' : 'missing',
      'Controlled beta requires test plan, invite, issue log, feedback synthesis, session runbook, session summary, decision log, triage rubric, issue lifecycle, go/no-go scorecard, handoff, founder action queue, auth evidence, admin smoke, and legal review docs.'
    ),
    readinessItem(
      'local_smoke_checks',
      'Local smoke checks',
      'ready',
      'npm run check validates MVP syntax, docs, Auth scaffolds, mobile readiness, CI wiring, and safety validators.'
    ),
    readinessItem(
      'real_money_disabled',
      'Real-money features disabled',
      'ready',
      'Controlled beta must keep real loans, real escrow, production payments, automatic payment release, and token collateral disabled.'
    ),
    readinessItem(
      'founder_auth_gate',
      'Founder Auth/Admin gate',
      'review',
      'Founder Magic Link, profile binding, admin membership activation, and strict admin smoke remain founder-present steps before broader public beta.',
      'founder'
    ),
    readinessItem(
      'strict_rls_gate',
      'Strict RLS gate',
      'review',
      'Strict RLS draft exists, but must not be applied until founder/admin smoke tests pass and founder approves the exact SQL.',
      'founder'
    ),
    readinessItem(
      'legal_payment_gate',
      'Legal/payment gate',
      'blocked',
      'Real loans, escrow, production payments, token collateral, and legal ownership language remain blocked until attorney/provider/founder review.',
      'founder'
    ),
  ];
  const validationCommands = [
    'npm run check',
    'npm run check:beta-readiness',
    'npm run check:auth',
    'npm run check:strict-gates',
  ];
  const reportBackTemplate = [
    'Local npm run check: PASS/FAIL',
    'Magic Link login: PASS/FAIL/SKIPPED',
    'Founder profile linked: YES/NO/UNKNOWN',
    'Admin membership active: YES/NO/UNKNOWN',
    'Missing beta docs: list only non-secret file names',
    'Do not paste tokens, passwords, database URLs, service-role keys, or private IDs.',
  ];
  const safeReportFields = {
    local_checks: 'PASS/FAIL',
    magic_link_login: 'PASS/FAIL/SKIPPED',
    founder_profile_linked: 'YES/NO/UNKNOWN',
    admin_membership_active: 'YES/NO/UNKNOWN',
    missing_beta_docs: 'file names only',
    forbidden_values: 'no tokens, passwords, database URLs, service-role keys, private IDs, or payment details',
  };
  const goNoGoRules = [
    'GO: local npm run check passes and all required beta docs are ready.',
    'REVIEW: Magic Link, profile binding, admin membership, deploy URL, or strict RLS still need founder-present verification.',
    'Automatic NO-GO: real loans, escrow, production payments, token collateral, legal ownership language, or sensitive data are required for the test.',
    'Automatic NO-GO: tester reports include secrets, passwords, database URLs, service-role keys, private IDs, card data, or bank data.',
  ];
  const testerDayChecklist = [
    'Open SmartContractor local demo and confirm the Admin workspace loads.',
    'Run npm run check and record only PASS/FAIL.',
    'Use the 5-minute demo script for homeowner, contractor, dispute, peer review, and admin review flows.',
    'Capture request IDs and screenshots only when they contain no secrets, private IDs, card data, bank data, or real addresses.',
    'Log issues with severity, role, flow, request ID, and safe reproduction steps.',
  ];
  const issueIntakeFields = {
    severity: 'required',
    role: 'required',
    flow: 'required',
    request_id: 'preferred when visible',
    safe_reproduction_steps: 'required',
    screenshot_or_recording: 'optional, only when no secrets or sensitive data are visible',
    live_risk_category: 'required when issue touches loans, escrow, payments, Auth, RLS, legal, or token collateral',
  };
  const evidenceRetentionPolicy = [
    'Keep beta evidence local to project docs until founder approves sharing.',
    'Use request IDs and non-sensitive metadata for debugging whenever possible.',
    'Do not store private IDs, bank data, card data, passwords, database URLs, service-role keys, or real addresses.',
    'Redact screenshots and recordings before sharing outside founder/admin review.',
  ];
  const testerHandoffPacket = [
    'docs/smartcontractor-beta-tester-invite.md',
    'docs/smartcontractor-demo-script.md',
    'docs/smartcontractor-beta-issue-log-template.md',
    'docs/smartcontractor-beta-evidence-checklist.md',
    'docs/smartcontractor-beta-tester-followup.md',
  ];
  const sessionStopConditions = [
    'Stop the session if a tester tries to enter real card, bank, password, database, or private ID data.',
    'Stop the session if a flow requires real loans, escrow, payments, token collateral, or legal approval.',
    'Stop the session if Auth/admin behavior is unclear and move the issue to founder review.',
    'Stop the session if screenshots or recordings reveal sensitive information that cannot be redacted immediately.',
  ];
  const postSessionActions = [
    'Save non-secret notes, request IDs, and redacted evidence in the beta issue log.',
    'Group issues by severity, role, flow, trust blocker, and live-risk category.',
    'Update the beta decision log before changing public beta scope or launch timing.',
    'Do not send tester evidence outside founder/admin review until screenshots and recordings are redacted.',
  ];
  const publicBetaExitCriteria = [
    'Do not move to public beta until local npm run check passes and the beta decision log shows GO or REVIEW with owner approval.',
    'Do not move to public beta while P0 tester issues, Auth/admin ambiguity, deploy URL blockers, or sensitive evidence leaks remain open.',
    'Do not move to public beta if any required flow depends on real loans, escrow, production payments, token collateral, or legal approval.',
    'Public beta can proceed only as a demo/no-real-money scope until founder, legal, provider, and strict RLS gates are cleared.',
  ];
  const preInviteChecks = [
    'Do not invite testers until npm run check passes in the local workspace.',
    'Confirm the tester handoff packet, issue log, evidence checklist, and follow-up message are ready.',
    'Confirm the demo scope is no-real-money and does not require passwords, private IDs, card data, bank data, or real addresses.',
    'Confirm the founder knows the session stop conditions before sharing any tester invite.',
  ];
  const inviteMessageChecklist = [
    'State that this is a controlled demo test, not a production launch.',
    'Include no real-money promises, no loan approval promises, and no token appreciation claims.',
    'Tell testers not to enter passwords, private IDs, card data, bank data, or real addresses.',
    'Ask testers to report issues with role, flow, severity, request ID when visible, and safe reproduction steps.',
  ];
  const testerConsentChecklist = [
    'Tester understands this is a demo-only controlled beta, not a production service.',
    'Tester understands they must not enter passwords, private IDs, card data, bank data, or real addresses.',
    'Tester understands no real loans, escrow, payments, token collateral, or legal decisions are being offered.',
    'Tester agrees that screenshots or recordings must be redacted before they are shared outside founder/admin review.',
  ];
  const testerRoleBriefing = [
    'Homeowner tester: open job discovery, contractor trust, milestone, dispute, and evidence flows without entering real addresses or payment data.',
    'Contractor tester: review open bids, submit demo bids, inspect starter loan screens, and report whether trust/credit language is clear.',
    'Peer reviewer tester: review dispute evidence, submit demo recommendations, and flag unclear quality or reward expectations.',
    'Founder/admin tester: review readiness, admin queue, stop conditions, and issue logs without approving real payments, loans, Auth/RLS, or legal changes.',
  ];
  const testerSuccessSignals = [
    'Tester can explain how a homeowner posts a job, reviews contractor trust signals, and avoids direct upfront deposits.',
    'Tester can explain how a contractor submits a demo bid, reviews starter credit language, and stays inside no-real-money scope.',
    'Tester can explain how dispute evidence and peer review affect quality decisions without creating legal or payment approvals.',
    'Tester can report one clear trust blocker, one confusing screen, and one improvement using safe issue intake fields.',
  ];
  const testerFailureSignals = [
    'Tester cannot explain what SmartContractor does for either homeowners or contractors after the walkthrough.',
    'Tester cannot find where to submit a bid, open a dispute, review evidence, or report a safe issue.',
    'Tester believes the demo approves real loans, escrow, payments, token collateral, or legal decisions.',
    'Tester tries to enter private IDs, card data, bank data, passwords, real addresses, or other sensitive production data.',
  ];
  const testerRedactionReminders = [
    'Redact names, emails, phone numbers, real addresses, license numbers, and private IDs before sharing screenshots.',
    'Redact card data, bank data, wallet secrets, passwords, tokens, API keys, and any browser autofill content.',
    'Keep raw recordings local for founder/admin review only until sensitive details are removed.',
    'Use request IDs, role, flow, severity, and safe reproduction steps instead of private user details.',
  ];
  const testerArtifactNaming = [
    'Use YYYY-MM-DD_role_flow_severity_request-id for screenshots, recordings, and issue notes when a request ID exists.',
    'Use no-request-id only when the screen or issue has no visible backend request ID.',
    'Keep artifact names short, ASCII-safe, and free of personal names, emails, phone numbers, addresses, or account IDs.',
    'Link artifact names back to the beta issue log entry instead of embedding private details in the filename.',
  ];
  const testerArtifactIndex = [
    'Artifact index row: filename, tester role, flow, severity, request ID when visible, linked issue ID, and redaction status.',
    'Mark redaction status as pending, redacted, approved-for-founder-review, or do-not-share.',
    'Store artifact references in the beta issue log or session summary; do not paste private file contents into chat.',
    'Do not attach artifacts to public grant, investor, or partner packets until founder/admin review confirms they are redacted.',
  ];
  const testerArtifactReviewQueue = [
    'Review queue item: issue ID, artifact filename, owner, review status, redaction status, and next action.',
    'Review status should be new, needs-redaction, founder-review, approved-for-internal-use, blocked, or archived.',
    'Founder/admin review must happen before any beta artifact is shared with public testers, partners, grant reviewers, or investors.',
    'Do not move artifacts from internal review into public packets when they contain private user, payment, wallet, or account data.',
  ];
  const testerArtifactExportGuard = [
    'Export guard: only share artifacts when status is redacted and approved-for-founder-review or approved-for-internal-use.',
    'Block export when an artifact contains passwords, tokens, private IDs, card data, bank data, wallet secrets, account URLs, or real addresses.',
    'Grant, partner, investor, and public-beta packets may include only summarized findings unless founder/admin explicitly approves the redacted artifact.',
    'If export status is unclear, keep the artifact local and record the blocker in the beta decision log before any outside sharing.',
  ];
  const testerArtifactPurgePolicy = [
    'Purge policy: delete raw recordings, unredacted screenshots, and local logs after the founder/admin review decision is recorded.',
    'Keep only redacted artifacts, issue IDs, request IDs, severity, flow, and summarized findings needed for product decisions.',
    'Immediately purge artifacts that accidentally include passwords, tokens, private IDs, card data, bank data, wallet secrets, or real addresses.',
    'Record purge status as pending, purged, retained-redacted, or retained-with-founder-approval in the beta issue log.',
  ];
  const testerArtifactRetentionClock = [
    'Retention clock: review beta artifacts within 24 hours of a tester session and mark each as purged, retained-redacted, or blocked.',
    'Raw recordings and unredacted screenshots should not stay in working folders after the founder/admin review window closes.',
    'Retained redacted artifacts should be tied to issue ID, decision-log entry, and owner so they can be deleted later if no longer needed.',
    'If legal, payment, identity, or wallet data appears in an artifact, purge it immediately and record only a non-sensitive summary.',
  ];
  const testerArtifactDisposalLedger = [
    'Disposal ledger row: artifact filename, linked issue ID, decision-log entry, disposal action, reviewer, and timestamp.',
    'Allowed disposal actions are purged, retained-redacted, blocked-sensitive-data, and retained-with-founder-approval.',
    'Never include passwords, tokens, card data, wallet secrets, raw addresses, or private IDs in the disposal ledger.',
    'Use the ledger to prove cleanup happened without preserving the sensitive artifact itself.',
  ];
  const testerArtifactAccessRoles = [
    'Access roles: founder/admin can review raw local artifacts during the 24-hour window; testers and outside partners cannot.',
    'Product notes may reference only redacted summaries, issue IDs, request IDs, severity, flow, and decision-log entries.',
    'Grant, investor, or partner packets can use approved redacted artifacts only after founder/admin review.',
    'If access level is unclear, treat the artifact as founder/admin-only and record the blocker in the disposal ledger.',
  ];
  const testerArtifactChainOfCustody = [
    'Chain of custody: record who captured, reviewed, redacted, approved, exported, purged, or retained each beta artifact.',
    'Each handoff should reference artifact filename, issue ID, request ID when visible, action, reviewer role, and timestamp.',
    'Do not move a raw artifact outside local founder/admin review; outside packets can reference only approved redacted artifacts or summaries.',
    'If the chain is incomplete, block sharing and record the gap in the beta decision log before any public, partner, grant, or investor use.',
  ];
  const testerArtifactPublicSummaryRules = [
    'Public summary rules: share only aggregate findings, redacted flow notes, issue severity counts, and non-sensitive product decisions.',
    'Do not include raw recordings, unredacted screenshots, tester names, emails, addresses, account IDs, wallet data, request bodies, or private URLs.',
    'Public, partner, grant, and investor summaries should cite issue IDs or decision-log entries, not private artifact filenames unless approved.',
    'When a finding depends on sensitive evidence, summarize the product lesson and keep the artifact local under founder/admin review.',
  ];
  const testerArtifactAnonymizationChecklist = [
    'Anonymization checklist: remove names, emails, phone numbers, street addresses, account IDs, wallet addresses, and payment identifiers before sharing.',
    'Blur browser tabs, URL query strings, profile avatars, uploaded documents, map pins, notes, filenames, and visible request bodies in screenshots or recordings.',
    'Replace tester-specific facts with role labels such as homeowner tester, contractor tester, peer reviewer, admin, issue ID, and request ID.',
    'If an artifact cannot be anonymized quickly, keep it local, summarize only the product lesson, and record the blocker in the disposal ledger.',
  ];
  const testerArtifactApprovalStamp = [
    'Approval stamp: every artifact leaving local founder/admin review must show approved-by role, approval date, artifact type, redaction status, and intended audience.',
    'Allowed audiences are internal-only, public-beta-summary, partner-packet, grant-packet, investor-packet, or blocked.',
    'Never approve raw recordings, unredacted screenshots, payment data, wallet data, private addresses, secrets, or identity documents for outside sharing.',
    'If the approval stamp is missing or stale, treat the artifact as blocked and share only a non-sensitive product summary.',
  ];
  const testerArtifactRevocationRules = [
    'Revocation rules: revoke artifact approval immediately if sensitive data, wrong audience, stale consent, incorrect redaction, or real-money evidence is discovered.',
    'Record revoked-by role, timestamp, reason, affected packet, replacement summary, and whether downstream copies were removed or corrected.',
    'When approval is revoked, remove the artifact from public, partner, grant, and investor packets and keep only a non-sensitive issue or decision-log reference.',
    'If downstream removal cannot be confirmed, mark the artifact as blocked and escalate to founder/admin review before any further sharing.',
  ];
  const testerArtifactExternalPacketManifest = [
    'External packet manifest: list every artifact, summary, screenshot, quote, metric, and issue reference included in a public, partner, grant, or investor packet.',
    'Each manifest row should include packet name, artifact or summary ID, audience, approval stamp, redaction status, source issue ID, and owner.',
    'Do not include raw local filenames, tester contact details, private URLs, wallet data, payment data, or secret-looking values in the external manifest.',
    'If a packet changes after approval, update the manifest and rerun artifact approval or revocation review before sharing the packet again.',
  ];
  const testerArtifactExternalPacketDistributionLog = [
    'Distribution log: record every approved external packet share with packet name, audience category, version, share date, channel category, owner, and approval stamp.',
    'Allowed channel categories are founder-direct, partner-review, grant-submission, investor-review, public-summary, or blocked; do not store private recipient contact details.',
    'Each distribution row should point back to the external packet manifest and the beta decision log so revoked or corrected evidence can be traced.',
    'If an artifact approval is revoked after sharing, update the distribution log with recall status, correction status, and founder/admin follow-up owner.',
  ];
  const testerArtifactExternalPacketRecallChecklist = [
    'Recall checklist: when an external packet artifact is revoked, identify every packet version, audience category, channel category, and owner from the distribution log.',
    'Mark each affected packet as recall-pending, corrected, replaced-with-summary, or blocked; do not keep unsafe evidence in public, partner, grant, or investor materials.',
    'Record only safe recall metadata: packet ID, artifact or summary ID, reason category, follow-up owner, correction status, and decision-log reference.',
    'If recall completion cannot be confirmed, keep the packet blocked and require founder/admin review before any new external sharing.',
  ];
  const testerArtifactExternalPacketCorrectionNotice = [
    'Correction notice: if an external packet is corrected after sharing, state what changed at a high level without repeating unsafe artifact content.',
    'Allowed fields are packet version, audience category, correction reason category, replacement summary ID, correction date, founder/admin approver, and decision-log reference.',
    'Do not include tester names, contact details, private URLs, raw screenshots, wallet/payment data, or exact sensitive values in a correction notice.',
    'If the correction affects product claims, legal/financial language, or real-money readiness, mark the packet blocked until founder/legal review is complete.',
  ];
  const testerArtifactExternalPacketVersionHistory = [
    'Version history: every public, partner, grant, or investor packet should record version ID, date, audience category, approval stamp, manifest ID, and owner.',
    'Each version should show whether it is draft, approved, distributed, corrected, recalled, superseded, or blocked.',
    'Keep version notes high-level and non-sensitive; reference redacted summary IDs instead of raw screenshots, recordings, private URLs, or tester contact details.',
    'If a packet changes after distribution, create a new version and link it to the correction notice, recall checklist, and beta decision log.',
  ];
  const testerArtifactExternalPacketClaimReview = [
    'Claim review: before sharing an external packet, check every product, traction, security, AI, payment, loan, escrow, token, and launch-readiness claim against current demo-safe evidence.',
    'Each reviewed claim should map to a packet version, source document or endpoint, evidence type, reviewer role, review date, and status: approved, needs-edit, legal-review, founder-review, or blocked.',
    'Do not approve claims that imply live loans, real escrow, token appreciation, legal compliance, production payments, guaranteed returns, or verified public launch readiness before founder/legal/provider review.',
    'If a claim cannot be verified with non-sensitive evidence, replace it with a conservative product summary or mark it blocked until the founder updates the packet.',
  ];
  const testerArtifactExternalPacketAudienceReview = [
    'Audience review: label every external packet as public-summary, partner-review, grant-submission, investor-review, provider-review, legal-review, or blocked before sharing.',
    'Public summaries may include only aggregate lessons and demo-safe product status; partner, grant, investor, provider, or legal packets may include deeper redacted evidence only after approval stamp and claim review.',
    'Do not send loan, escrow, token collateral, payment-provider, legal compliance, or production launch claims to any audience unless the packet status is founder-review, legal-review, provider-review, or blocked.',
    'If the audience changes, rerun manifest, approval stamp, claim review, and distribution log checks before reusing the same packet content.',
  ];
  const testerArtifactExternalPacketRecipientAcknowledgement = [
    'Recipient acknowledgement: for every external packet share, record only non-contact acknowledgement metadata: packet version, audience category, channel category, acknowledgement status, date, and owner.',
    'Allowed statuses are sent, received, reviewed, needs-follow-up, corrected, recalled, blocked, or no-response; do not store private recipient email, phone, address, or personal account handles.',
    'If a recipient asks for more detail, create a new approved packet version instead of sending raw tester artifacts, private URLs, screenshots, recordings, or sensitive operational logs.',
    'If the acknowledgement mentions legal, provider, investment, payment, loan, escrow, or token-risk questions, route it to founder/legal/provider review before any follow-up packet is shared.',
  ];
  const testerArtifactExternalPacketFollowupQueue = [
    'Follow-up queue: track only safe follow-up tasks after an external packet is sent, using packet version, audience category, request category, owner, due window, status, and decision-log reference.',
    'Allowed request categories are product-demo, technical-architecture, grant-application, partner-integration, provider-review, legal-review, investor-review, correction, recall, or blocked.',
    'Do not include private recipient contact details, raw tester artifacts, payment data, legal advice, or token-price promises in the follow-up queue.',
    'If a follow-up needs secrets, external account access, production payment setup, real loan/escrow action, or legal judgment, mark it founder-required or blocked instead of assigning it to autonomous Codex.',
  ];
  const testerArtifactExternalPacketFollowupClosureRules = [
    'Follow-up closure rules: close external packet follow-up only when the request category, owner, resolution summary, evidence reference, and decision-log link are recorded without private recipient details.',
    'Allowed closure states are answered, scheduled-demo, routed-to-founder, routed-to-legal, routed-to-provider, corrected, recalled, blocked, or no-response-expired.',
    'Do not close a follow-up as answered if it depends on secrets, external account access, production payment setup, real loan or escrow action, token-price claims, or legal advice.',
    'If follow-up changes product, legal, provider, investor, grant, or public claims, create a new packet version and rerun claim review, audience review, and approval stamp before sharing.',
  ];
  const testerArtifactExternalPacketFollowupEscalationRules = [
    'Follow-up escalation rules: escalate any external packet follow-up when the due window expires, the request changes audience, or the response asks for legal, provider, investment, payment, loan, escrow, token, or production access decisions.',
    'Escalation owners are founder, legal, provider, product, technical, grant, investor, or blocked; autonomous Codex can only prepare drafts and local validation evidence.',
    'Escalate immediately if a recipient requests secrets, private tester artifacts, private contact details, production credentials, bank/card data, token-price projections, or real-money pilot commitments.',
    'Every escalation must reference packet version, reason, owner, next safe action, and decision-log entry before another external packet is sent.',
  ];
  const testerArtifactExternalPacketFollowupSlaPolicy = [
    'Follow-up SLA policy: every external packet follow-up must have an owner, due window, request category, severity, and next safe action before it is considered active.',
    'Suggested due windows are 1 business day for corrections or recall, 2 business days for legal/provider/investor/grant questions, and 5 business days for general product-demo follow-up.',
    'If the due window expires without safe closure, escalate to founder-required or blocked rather than sending unapproved details, raw artifacts, production promises, or real-money commitments.',
    'SLA tracking is informational for beta governance only and must not create legal, payment, loan, escrow, token, or provider obligations without founder review.',
  ];
  const testerArtifactExternalPacketFollowupDecisionSummary = [
    'Follow-up decision summary: summarize each closed or escalated external packet follow-up with packet version, request category, decision state, owner role, evidence reference, and decision-log entry.',
    'Allowed summary states are closed-answered, closed-corrected, closed-recalled, routed-founder, routed-legal, routed-provider, routed-product, routed-technical, no-response-expired, or blocked.',
    'Do not include private recipient contact details, raw tester artifacts, private URLs, secrets, payment data, legal advice, token-price projections, or real-money commitments in the summary.',
    'If the summary changes public, partner, grant, investor, provider, or legal claims, create a new packet version and rerun claim review, audience review, approval stamp, and distribution log before sharing.',
  ];
  const testerArtifactExternalPacketFollowupOwnerHandoff = [
    'Follow-up owner handoff: when a follow-up changes owner, record packet version, previous owner role, new owner role, reason, current status, due window, and next safe action.',
    'Allowed owner roles are founder, product, technical, legal, provider, grant, investor, or blocked; do not assign secrets, external account access, live payments, legal advice, or production launch authority to autonomous Codex.',
    'A handoff is incomplete until the receiving owner has the decision-log reference, evidence reference, redaction status, and latest approved packet version.',
    'If owner handoff involves legal, payment, loan, escrow, token collateral, provider onboarding, or external account decisions, keep the item founder-required or blocked until the founder explicitly approves the next step.',
  ];
  const reviewPacket = [
    'docs/smartcontractor-public-beta-review-packet.md',
    'docs/smartcontractor-public-beta-handoff-checklist.md',
    'docs/smartcontractor-beta-go-no-go-scorecard.md',
    'docs/smartcontractor-founder-action-queue.md',
  ];
  const founderPresentTasks = [
    'Magic Link founder login: sign in with founder email and report only PASS/FAIL.',
    'Founder profile binding: confirm the current Auth user is linked to a SmartContractor profile.',
    'Admin membership activation: approve the prepared SQL only after the real auth_user_id is verified.',
    'Deploy account connection: connect Vercel or selected platform without sharing passwords in chat.',
  ];

  res.json({
    generated_at: new Date().toISOString(),
    mode: 'controlled_beta_readiness',
    decision: {
      local_controlled_beta_without_real_money: checks.some((item) => item.status === 'missing') ? 'blocked' : 'ready',
      public_beta_without_real_money: 'review',
      real_money_pilot: 'blocked',
    },
    summary: readinessSummary(checks),
    document_summary: {
      ready: readyDocs.length,
      missing: missingDocs.length,
      total: requiredDocs.length,
    },
    checks,
    validation_commands: validationCommands,
    report_back_template: reportBackTemplate,
    safe_report_fields: safeReportFields,
    go_no_go_rules: goNoGoRules,
    tester_day_checklist: testerDayChecklist,
    issue_intake_fields: issueIntakeFields,
    evidence_retention_policy: evidenceRetentionPolicy,
    tester_handoff_packet: testerHandoffPacket,
    session_stop_conditions: sessionStopConditions,
    post_session_actions: postSessionActions,
    public_beta_exit_criteria: publicBetaExitCriteria,
    pre_invite_checks: preInviteChecks,
    invite_message_checklist: inviteMessageChecklist,
    tester_consent_checklist: testerConsentChecklist,
    tester_role_briefing: testerRoleBriefing,
    tester_success_signals: testerSuccessSignals,
    tester_failure_signals: testerFailureSignals,
    tester_redaction_reminders: testerRedactionReminders,
    tester_artifact_naming: testerArtifactNaming,
    tester_artifact_index: testerArtifactIndex,
    tester_artifact_review_queue: testerArtifactReviewQueue,
    tester_artifact_export_guard: testerArtifactExportGuard,
    tester_artifact_purge_policy: testerArtifactPurgePolicy,
    tester_artifact_retention_clock: testerArtifactRetentionClock,
    tester_artifact_disposal_ledger: testerArtifactDisposalLedger,
    tester_artifact_access_roles: testerArtifactAccessRoles,
    tester_artifact_chain_of_custody: testerArtifactChainOfCustody,
    tester_artifact_public_summary_rules: testerArtifactPublicSummaryRules,
    tester_artifact_anonymization_checklist: testerArtifactAnonymizationChecklist,
    tester_artifact_approval_stamp: testerArtifactApprovalStamp,
    tester_artifact_revocation_rules: testerArtifactRevocationRules,
    tester_artifact_external_packet_manifest: testerArtifactExternalPacketManifest,
    tester_artifact_external_packet_distribution_log: testerArtifactExternalPacketDistributionLog,
    tester_artifact_external_packet_recall_checklist: testerArtifactExternalPacketRecallChecklist,
    tester_artifact_external_packet_correction_notice: testerArtifactExternalPacketCorrectionNotice,
    tester_artifact_external_packet_version_history: testerArtifactExternalPacketVersionHistory,
    tester_artifact_external_packet_claim_review: testerArtifactExternalPacketClaimReview,
    tester_artifact_external_packet_audience_review: testerArtifactExternalPacketAudienceReview,
    tester_artifact_external_packet_recipient_acknowledgement: testerArtifactExternalPacketRecipientAcknowledgement,
    tester_artifact_external_packet_followup_queue: testerArtifactExternalPacketFollowupQueue,
    tester_artifact_external_packet_followup_closure_rules: testerArtifactExternalPacketFollowupClosureRules,
    tester_artifact_external_packet_followup_escalation_rules: testerArtifactExternalPacketFollowupEscalationRules,
    tester_artifact_external_packet_followup_sla_policy: testerArtifactExternalPacketFollowupSlaPolicy,
    tester_artifact_external_packet_followup_decision_summary: testerArtifactExternalPacketFollowupDecisionSummary,
    tester_artifact_external_packet_followup_owner_handoff: testerArtifactExternalPacketFollowupOwnerHandoff,
    review_packet: reviewPacket,
    founder_present_tasks: founderPresentTasks,
    required_docs: requiredDocs,
    missing_docs: missingDocs,
    tester_scope: {
      first_round_size: '3-5 people',
      roles: ['founder/admin', 'homeowner', 'contractor', 'peer reviewer'],
      evidence_policy: 'Use non-sensitive evidence metadata only. Do not upload private IDs, bank data, card data, passwords, or private addresses.',
    },
    next_safe_steps: [
      'Run npm run check before inviting testers.',
      'Use docs/smartcontractor-beta-tester-invite.md for the first 3-5 people.',
      'Record issues with docs/smartcontractor-beta-issue-log-template.md.',
      'Synthesize feedback with docs/smartcontractor-beta-feedback-synthesis.md.',
      'Use docs/smartcontractor-founder-action-queue.md for founder-only deploy, Auth, admin, RLS, legal, provider, and grant steps.',
    ],
    blocked_until_founder: [
      'Founder Magic Link/Admin activation for strict admin smoke tests.',
      'Deploy account and public URL configuration.',
      'Supabase Auth redirect URLs for deployed domain.',
      'Attorney/provider review before real loans, escrow, payments, or token collateral.',
    ],
  });
});

app.get('/api/admin/auth-readiness', (req, res) => {
  const authMode = process.env.SMARTCONTRACTOR_AUTH_MODE || 'undecided';
  const recommendation = 'magic_link';
  const modes = [
    {
      id: 'magic_link',
      label: 'Magic Link',
      recommendation: 'recommended_for_mvp',
      why: [
        'No password reset support needed on day one.',
        'Lower leaked-password risk for homeowners and contractors.',
        'Good fit for PWA and later iOS/Android wrappers.',
        'Simpler onboarding for non-technical users.',
      ],
      tradeoffs: [
        'User must have access to email.',
        'Email deliverability must be monitored.',
        'Some contractors may prefer a persistent password later.',
      ],
    },
    {
      id: 'password',
      label: 'Email + Password',
      recommendation: 'later',
      why: [
        'Familiar dashboard login for frequent contractor use.',
        'Works well after support and recovery flows exist.',
      ],
      tradeoffs: [
        'Requires password reset and account recovery support.',
        'Higher user-support burden.',
        'More security education needed for users.',
      ],
    },
  ];

  const checklist = [
    readinessItem(
      'founder_auth_decision',
      'Founder chooses auth mode',
      authMode === 'magic_link' || authMode === 'password' ? 'ready' : 'blocked',
      'Set SMARTCONTRACTOR_AUTH_MODE=magic_link for the recommended MVP path, or password if founder chooses password login.',
      'founder'
    ),
    readinessItem(
      'profile_auth_user_id',
      'profiles.auth_user_id ownership',
      'review',
      'Backend now binds profiles.auth_user_id when a valid Supabase bearer token is present; database column/index and smoke tests still need review before live RLS.'
    ),
    readinessItem(
      'backend_session_middleware',
      'Backend session verification',
      'ready',
      'Express can verify Supabase bearer tokens through the shared getAuthenticatedUser helper and protected session-check route.'
    ),
    readinessItem(
      'frontend_auth_ui',
      'Frontend login UI',
      'ready',
      'SmartContractor has a Magic Link request panel, local access-token capture, logout, and session-check button for MVP testing.'
    ),
    readinessItem(
      'role_ownership_guards',
      'Role ownership guards',
      'ready',
      'When a bearer token is present, backend writes verify owned profile_id, homeowner_id, contractor_id, reviewer_contractor_id, and evidence profile ownership before insert.'
    ),
    readinessItem(
      'service_role_boundary',
      'Server-only service role boundary',
      supabaseAdmin ? 'ready' : 'missing',
      supabaseAdmin
        ? 'Server-only service role client is available to backend code and never exposed to browser code.'
        : 'Service role key is missing or placeholder. It must be configured only in backend environment before public launch.'
    ),
    readinessItem(
      'strict_rls_apply_plan',
      'Strict RLS apply plan',
      'review',
      'RLS SQL draft exists locally, but must be applied only after auth smoke tests pass.'
    ),
    readinessItem(
      'auth_smoke_tests',
      'Auth smoke tests',
      'review',
      'Need anonymous, homeowner, contractor, and admin/system smoke tests before public launch.'
    ),
  ];

  res.json({
    generated_at: new Date().toISOString(),
    mode: 'auth_decision_package',
    selected_mode: authMode,
    recommendation,
    public_launch_status: authMode === 'magic_link' || authMode === 'password' ? 'review' : 'blocked',
    founder_next_action: authMode === 'undecided'
      ? 'Approve Magic Link for MVP or explicitly choose Password Login.'
      : `Auth mode is ${authMode}; next step is Supabase Auth smoke testing and strict RLS ownership review.`,
    modes,
    checklist,
    summary: readinessSummary(checklist),
    safe_scope: [
      'This endpoint does not enable Supabase Auth.',
      'This endpoint does not apply RLS.',
      'This endpoint does not expose secrets.',
      'This endpoint only prepares the founder decision and implementation checklist.',
    ],
  });
});

app.get('/api/admin/founder-action-center', (req, res) => {
  const actions = founderActionItems();
  const summary = readinessSummary(actions);
  const nextActions = actions
    .filter((item) => ['blocked', 'review', 'missing'].includes(item.status))
    .map(({ id, phase, label, status, owner, why }) => ({
      id,
      phase,
      label,
      status,
      owner,
      why,
    }));

  res.json({
    generated_at: new Date().toISOString(),
    mode: 'founder_action_center',
    summary,
    actions,
    next_actions: nextActions,
    connector_status: {
      supabase_connector: 'requires_reconnect_if_tool_returns token_expired',
      github_push: 'available_from_local_git',
    },
    safety_rules: [
      'Do not paste passwords, API keys, service-role keys, provider secrets, wallet private keys, or recovery phrases into chat.',
      'All real loans, escrow, token collateral, and legal decisions stay blocked until founder and attorney review.',
      'External accounts may be inspected only after founder login/approval; changes require explicit founder confirmation.',
      'Secrets belong only in local environment files or deployment secret managers.',
    ],
  });
});

app.get('/api/admin/founder-auth-setup', async (req, res) => {
  const [membershipSummary, authBinding] = await Promise.all([
    getAdminMembershipSummary(),
    getAuthProfileBindingStatus(req),
  ]);

  const checklist = [
    readinessItem(
      'supabase_auth_client',
      'Supabase Auth client',
      supabaseAuth ? 'ready' : 'missing',
      supabaseAuth
        ? 'Backend can validate Supabase Magic Link access tokens.'
        : 'SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are missing or placeholder.'
    ),
    readinessItem(
      'service_role_boundary',
      'Server-only service role boundary',
      supabaseAdmin ? 'ready' : 'review',
      supabaseAdmin
        ? 'Backend has a server-only service-role client for trusted admin checks.'
        : 'Local demo can continue, but public strict admin enforcement needs server-only service-role configuration.'
    ),
    readinessItem(
      'admin_memberships_table',
      'Admin memberships table',
      membershipSummary.reachable ? 'ready' : 'missing',
      membershipSummary.reachable
        ? `Active admin memberships visible: ${membershipSummary.total_active}.`
        : `Admin membership table is not reachable: ${membershipSummary.error || 'unknown error'}.`
    ),
    readinessItem(
      'magic_link_session',
      'Magic Link browser session',
      authBinding.authenticated ? 'ready' : 'blocked',
      authBinding.authenticated
        ? `Authenticated as ${maskEmail(authBinding.user?.email || '')}.`
        : authBinding.next_step,
      'founder'
    ),
    readinessItem(
      'profile_auth_binding',
      'SmartContractor profile linked to Auth user',
      authBinding.profile_linked ? 'ready' : 'review',
      authBinding.profile_linked
        ? 'profiles.auth_user_id is linked to the current Magic Link user.'
        : 'A founder profile must be created or linked while logged in before strict RLS smoke tests.',
      'founder+codex'
    ),
    readinessItem(
      'founder_admin_membership',
      'Founder admin membership',
      authBinding.admin_roles_active?.includes('founder') ? 'ready' : 'review',
      authBinding.admin_roles_active?.includes('founder')
        ? 'Current Auth user has active founder role.'
        : 'Founder must explicitly approve adding the current auth_user_id as active founder. No automatic live write is performed here.',
      'founder+codex'
    ),
  ];

  res.json({
    generated_at: new Date().toISOString(),
    mode: 'founder_auth_setup',
    summary: readinessSummary(checklist),
    public_launch_status: checklist.some((item) => ['blocked', 'missing', 'review'].includes(item.status)) ? 'blocked' : 'review',
    membership_summary: membershipSummary,
    current_session: authBinding,
    checklist,
    next_step: authBinding.next_step,
    safe_scope: [
      'This endpoint is read-only.',
      'It does not create users.',
      'It does not assign founder/admin roles.',
      'It does not apply RLS or change Supabase settings.',
      'It never returns service-role keys, database passwords, or bearer tokens.',
    ],
  });
});

app.get('/api/admin/supabase-boundary', (req, res) => {
  res.json({
    generated_at: new Date().toISOString(),
    mode: 'supabase_service_role_boundary',
    status: supabaseBoundaryStatus(),
    safe_scope: [
      'Secret values are never returned.',
      'Browser code must use only SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.',
      'Server-side trusted database operations prefer SUPABASE_SERVICE_ROLE_KEY when configured.',
      'Publishable fallback is local-demo only and blocks public launch.',
    ],
    next_steps: supabaseAdmin
      ? [
          'Run auth smoke tests with real test users.',
          'Apply profiles.auth_user_id draft in staging after review.',
          'Run strict RLS smoke tests before public launch.',
        ]
      : [
          'Keep demo local until a server-only service role key is configured.',
          'Do not paste SUPABASE_SERVICE_ROLE_KEY into chat.',
          'Set SUPABASE_SERVICE_ROLE_KEY only in backend environment or deployment secrets.',
        ],
  });
});

app.get('/api/admin/access-model', (req, res) => {
  res.json({
    generated_at: new Date().toISOString(),
    mode: 'admin_role_model',
    public_launch_status: 'review',
    enforcement_mode: adminEnforcementMode(),
    roles: adminRoleModel,
    protected_surfaces: adminProtectedSurfaces,
    required_database_draft: 'docs/smartcontractor-admin-role-model-draft.sql',
    safe_scope: [
      'This endpoint describes the access model only.',
      'It does not grant admin permissions.',
      'It does not approve loans, release money, or change legal status.',
      'Real admin enforcement must use Supabase Auth, service-role backend checks, audit events, and strict RLS.',
    ],
    next_steps: [
      'Founder chooses the first founder/admin auth user.',
      'Apply admin role table draft only after service-role boundary and auth smoke tests are ready.',
      'Protect admin endpoints with role checks before public launch.',
    ],
  });
});

app.get('/api/admin/me', async (req, res) => {
  const access = await getAdminAccess(req, []);
  res.status(access.status).json({
    generated_at: new Date().toISOString(),
    mode: 'admin_enforcement_scaffold',
    access,
    public_launch_status: access.mode === 'strict' && access.allowed ? 'review' : 'blocked',
    safe_scope: [
      'This endpoint reports admin access state only.',
      'Draft mode may allow local MVP admin review without granting production permissions.',
      'Strict mode must be enabled before public admin endpoints are exposed.',
      'No secret values are returned.',
    ],
  });
});

app.post('/api/auth/magic-link', authLimiter, async (req, res) => {
  if (!requireSupabaseAuth(res)) return;

  const { email, redirect_to } = req.body || {};
  const errors = [];
  if (!isEmail(email)) errors.push('email must be a valid email address');
  const redirectTo = redirect_to ? safeAuthRedirectUrl(redirect_to) : null;
  if (redirect_to && !redirectTo) {
    errors.push('redirect_to must use localhost, 127.0.0.1, xprnet.org, www.xprnet.org, PUBLIC_SITE_URL, or ALLOWED_AUTH_REDIRECT_ORIGINS');
  }
  if (errors.length) return validationError(res, errors);

  const authMode = process.env.SMARTCONTRACTOR_AUTH_MODE || 'undecided';
  if (authMode !== 'magic_link') {
    return res.status(409).json({
      error: 'Magic Link auth is not enabled yet',
      selected_mode: authMode,
      next_step: 'Founder should approve Magic Link, then set SMARTCONTRACTOR_AUTH_MODE=magic_link in the backend environment.',
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const { error } = await supabaseAuth.auth.signInWithOtp({
    email: normalizedEmail,
    options: redirectTo ? { emailRedirectTo: redirectTo } : undefined,
  });
  if (error) return res.status(502).json({ error: error.message });

  await recordAuditEvent({
    actor_type: 'anonymous',
    action: 'auth_magic_link_requested',
    entity_type: 'auth_session',
    new_value: {
      email_hint: maskEmail(normalizedEmail),
      redirect_to: redirectTo,
      auth_mode: authMode,
    },
    req,
  });

  res.status(202).json({
    sent: true,
    mode: authMode,
    email_hint: maskEmail(normalizedEmail),
    redirect_to: redirectTo,
    note: 'Check the email inbox for the Supabase Magic Link.',
  });
});

app.get('/api/auth/session-check', requireAuthenticatedUser, (req, res) => {
  res.json({
    authenticated: true,
    user: {
      id: req.authUser.id,
      email: req.authUser.email || null,
      role: req.authUser.role || null,
    },
  });
});

app.get('/api/auth/profile', requireAuthenticatedUser, async (req, res) => {
  if (!requireSupabase(res)) return;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id,auth_user_id,role,email,full_name,phone,xpr_account,wallet_public_key,created_at')
    .eq('auth_user_id', req.authUser.id)
    .maybeSingle();
  if (profileError) return res.status(500).json({ error: profileError.message });

  let homeowner = null;
  let contractor = null;
  if (profile) {
    const [homeownerResult, contractorResult] = await Promise.all([
      supabase
        .from('homeowners')
        .select('id,profile_id,display_name,default_zip,subscription_tier,created_at')
        .eq('profile_id', profile.id)
        .maybeSingle(),
      supabase
        .from('contractors')
        .select('id,profile_id,business_name,ein,license_number,license_state,insurance_status,rating,created_at')
        .eq('profile_id', profile.id)
        .maybeSingle(),
    ]);
    if (homeownerResult.error) return res.status(500).json({ error: homeownerResult.error.message });
    if (contractorResult.error) return res.status(500).json({ error: contractorResult.error.message });
    homeowner = homeownerResult.data;
    contractor = contractorResult.data;
  }

  res.json({
    authenticated: true,
    user: {
      id: req.authUser.id,
      email: req.authUser.email || null,
      role: req.authUser.role || null,
    },
    profile,
    homeowner,
    contractor,
    binding: profile
      ? 'profiles.auth_user_id matches the authenticated Supabase user.'
      : 'No SmartContractor profile is linked to this authenticated user yet.',
  });
});

app.get('/api/auth/protection-status', (req, res) => {
  res.json({
    mode: routeProtectionMode(),
    enforced: isRouteProtectionStrict(),
    auth_client: supabaseAuth ? 'configured' : 'missing',
    protected_api_prefixes: [
      '/api/smartcontractor',
      '/api/admin/risk-console',
      '/api/audit/events',
    ],
    frontend_protected_tabs: [
      'contractor',
      'loan',
      'dispute',
      'payment',
      'admin',
    ],
    next_step: isRouteProtectionStrict()
      ? 'Send Authorization: Bearer <Supabase access token> for protected routes.'
      : 'Set SMARTCONTRACTOR_ROUTE_PROTECTION=strict after test users, RLS, and admin memberships are ready.',
  });
});

app.get('/api/verification/providers', (req, res) => {
  res.json({
    providers: [
      {
        id: 'manual',
        name: 'Manual Review',
        status: 'ready',
        best_for: 'MVP verification, founder/admin review, contractor onboarding before paid providers.',
      },
      {
        id: 'stripe_identity',
        name: 'Stripe Identity',
        status: process.env.STRIPE_SECRET_KEY ? 'keys_available' : 'needs_keys',
        best_for: 'Person identity document and selfie verification.',
      },
      {
        id: 'persona',
        name: 'Persona',
        status: process.env.PERSONA_API_KEY ? 'keys_available' : 'needs_keys',
        best_for: 'Configurable KYC/KYB workflows and document checks.',
      },
      {
        id: 'plaid',
        name: 'Plaid',
        status: process.env.PLAID_CLIENT_ID && process.env.PLAID_SECRET ? 'keys_available' : 'needs_keys',
        best_for: 'Bank account ownership, income/assets, account-risk signals.',
      },
      {
        id: 'middesk',
        name: 'Middesk',
        status: process.env.MIDDESK_API_KEY ? 'keys_available' : 'needs_keys',
        best_for: 'US business verification, EIN, address, secretary of state data.',
      },
      {
        id: 'state_license_board',
        name: 'State License Board',
        status: 'manual_or_api_required',
        best_for: 'Contractor license status by state.',
      },
      {
        id: 'insurance_carrier',
        name: 'Insurance Carrier / Certificate Check',
        status: 'manual_or_api_required',
        best_for: 'General liability, bond, workers comp, expiration checks.',
      },
      {
        id: 'metal_pay',
        name: 'Metal Pay',
        status: process.env.METAL_PAY_CONNECT_API_KEY ? 'keys_available' : 'needs_keys',
        best_for: 'Metallicus account/payment readiness and crypto wallet onboarding.',
      },
      {
        id: 'xpr_network',
        name: 'XPR Network',
        status: 'ready',
        best_for: 'Wallet/account ownership and on-chain activity checks.',
      },
    ],
  });
});

app.get('/api/verification/checks', async (req, res) => {
  if (!requireSupabase(res)) return;

  const { subject_type, subject_id, provider, check_type, status = 'all' } = req.query;
  let query = supabase
    .from('verification_checks')
    .select('id,subject_type,subject_id,provider,check_type,status,confidence_score,provider_reference,result_summary,evidence_url,expires_at,raw_result,created_at,updated_at')
    .order('created_at', { ascending: false })
    .limit(100);

  if (subject_type) query = query.eq('subject_type', subject_type);
  if (subject_id) query = query.eq('subject_id', subject_id);
  if (provider) query = query.eq('provider', provider);
  if (check_type) query = query.eq('check_type', check_type);
  if (status !== 'all') query = query.eq('status', status);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ verification_checks: data });
});

app.post('/api/verification/checks', async (req, res) => {
  const verificationCheckValidation = validateVerificationCheckInput(req.body);
  if (verificationCheckValidation.errors.length) return validationError(res, verificationCheckValidation.errors);

  if (!requireSupabase(res)) return;

  const {
    subject_type,
    subject_id,
    provider = 'manual',
    check_type,
    status = 'pending',
    confidence_score,
    provider_reference,
    result_summary,
    evidence_url,
    expires_at,
    raw_result = {},
  } = req.body;
  const { confidence } = verificationCheckValidation;

  const { data, error } = await supabase
    .from('verification_checks')
    .insert({
      subject_type,
      subject_id,
      provider,
      check_type,
      status,
      confidence_score: confidence,
      provider_reference,
      result_summary,
      evidence_url,
      expires_at,
      raw_result,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  await recordAuditEvent({
    actor_type: 'system',
    action: 'verification_check_created',
    entity_type: 'verification_check',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ verification_check: data });
});

app.post('/api/verification/webhooks/:provider', async (req, res) => {
  const verificationWebhookValidation = validateVerificationWebhookInput(req.body, req.params);
  if (verificationWebhookValidation.length) return validationError(res, verificationWebhookValidation);

  if (!requireSupabase(res)) return;

  const { provider } = req.params;
  const {
    verification_check_id,
    provider_reference,
    event_type = 'verification_provider_event_received',
    status,
  } = req.body;

  const { data: event, error: eventError } = await supabase
    .from('verification_provider_events')
    .insert({
      verification_check_id,
      provider,
      event_type,
      status,
      provider_reference,
      raw_event: req.body,
    })
    .select()
    .single();

  if (eventError) return res.status(500).json({ error: eventError.message });

  let updatedCheck = null;
  if (verification_check_id && status) {
    const { data, error } = await supabase
      .from('verification_checks')
      .update({ status, provider_reference })
      .eq('id', verification_check_id)
      .select('id,subject_type,subject_id,provider,check_type,status,updated_at')
      .single();
    if (error) return res.status(500).json({ error: error.message });
    updatedCheck = data;
  }

  await recordAuditEvent({
    actor_type: 'webhook',
    action: 'verification_webhook_received',
    entity_type: 'verification_provider_event',
    entity_id: event.id,
    new_value: { event, verification_check: updatedCheck },
    source: 'webhook',
    req,
  });

  res.status(202).json({ verification_event: event, verification_check: updatedCheck });
});

app.get('/api/collateral/price-snapshots', async (req, res) => {
  if (!requireSupabase(res)) return;

  const { token_symbol } = req.query;
  let query = supabase
    .from('token_price_snapshots')
    .select('id,token_symbol,price_usd,source,provider_reference,captured_at,raw_result')
    .order('captured_at', { ascending: false })
    .limit(50);

  if (token_symbol) query = query.eq('token_symbol', String(token_symbol).toUpperCase());

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ price_snapshots: data });
});

app.post('/api/collateral/price-snapshots', async (req, res) => {
  if (!requireSupabase(res)) return;

  const {
    token_symbol,
    price_usd,
    source = 'manual',
    provider_reference,
    raw_result = {},
  } = req.body;

  const errors = [];
  if (!isNonEmptyString(token_symbol)) errors.push('token_symbol is required');
  const price = parseNonNegativeNumber(price_usd, 'price_usd', errors);
  validateOptionalString(source, 'source', errors, 80);
  validateOptionalString(provider_reference, 'provider_reference', errors, 160);
  if (raw_result !== null && typeof raw_result !== 'object') {
    errors.push('raw_result must be an object');
  }
  if (errors.length) return validationError(res, errors);

  const { data, error } = await supabase
    .from('token_price_snapshots')
    .insert({
      token_symbol: String(token_symbol).toUpperCase(),
      price_usd: price,
      source,
      provider_reference,
      raw_result,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  await recordAuditEvent({
    actor_type: 'admin',
    action: 'token_price_snapshot_created',
    entity_type: 'token_price_snapshot',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ price_snapshot: data });
});

app.get('/api/collateral/locks', async (req, res) => {
  if (!requireSupabase(res)) return;

  const { contractor_id, loan_id, token_symbol, status = 'all' } = req.query;
  let query = supabase
    .from('token_collateral_locks')
    .select('id,contractor_id,loan_id,wallet_account,token_symbol,token_amount,price_snapshot_id,collateral_value_usd,ltv_percent,max_borrow_usd,status,lock_tx_hash,release_tx_hash,risk_note,created_at,updated_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (contractor_id) query = query.eq('contractor_id', contractor_id);
  if (loan_id) query = query.eq('loan_id', loan_id);
  if (token_symbol) query = query.eq('token_symbol', String(token_symbol).toUpperCase());
  if (status !== 'all') query = query.eq('status', status);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ collateral_locks: data });
});

app.post('/api/collateral/locks', async (req, res) => {
  if (!requireSupabase(res)) return;

  const {
    contractor_id,
    loan_id,
    wallet_account,
    token_symbol = 'GCSC',
    token_amount,
    price_usd,
    price_snapshot_id,
    ltv_percent = 25,
    status = 'proposed',
    lock_tx_hash,
    risk_note,
  } = req.body;

  const errors = [];
  if (!isNonEmptyString(contractor_id)) errors.push('contractor_id is required');
  validateOptionalString(loan_id, 'loan_id', errors, 120);
  validateOptionalString(wallet_account, 'wallet_account', errors, 80);
  validateOptionalString(token_symbol, 'token_symbol', errors, 20);
  validateOptionalString(price_snapshot_id, 'price_snapshot_id', errors, 120);
  validateOptionalString(lock_tx_hash, 'lock_tx_hash', errors, 160);
  validateOptionalString(risk_note, 'risk_note', errors, 500);

  const tokenAmount = parsePositiveNumber(token_amount, 'token_amount', errors);
  let manualPrice = 0;
  if (price_usd !== undefined && price_usd !== null && price_usd !== '') {
    manualPrice = parsePositiveNumber(price_usd, 'price_usd', errors);
  }
  const ltv = parseNonNegativeNumber(ltv_percent, 'ltv_percent', errors);
  if (ltv !== null && ltv > 100) errors.push('ltv_percent must be between 0 and 100');
  validateOptionalEnum(status, ['proposed', 'locked', 'released', 'partially_released', 'called', 'defaulted', 'cancelled'], 'status', errors);
  if (!price_snapshot_id && !manualPrice) {
    errors.push('price_usd or price_snapshot_id is required');
  }
  if (errors.length) return validationError(res, errors);

  const ownership = await assertOwnedRoleRecord(req, 'contractors', contractor_id, 'contractor_id');
  if (!ownership.allowed) return rejectOwnership(res, ownership);

  let snapshotId = price_snapshot_id || null;
  let effectivePrice = Number(manualPrice || 0);

  if (!snapshotId && effectivePrice > 0) {
    const { data: snapshot, error: snapshotError } = await supabase
      .from('token_price_snapshots')
      .insert({
        token_symbol: String(token_symbol).toUpperCase(),
        price_usd: effectivePrice,
        source: 'manual',
        raw_result: { reason: 'collateral_lock_creation' },
      })
      .select()
      .single();
    if (snapshotError) return res.status(500).json({ error: snapshotError.message });
    snapshotId = snapshot.id;
  }

  if (snapshotId && effectivePrice === 0) {
    const { data: snapshot, error: snapshotError } = await supabase
      .from('token_price_snapshots')
      .select('price_usd')
      .eq('id', snapshotId)
      .single();
    if (snapshotError) return res.status(500).json({ error: snapshotError.message });
    effectivePrice = Number(snapshot.price_usd || 0);
  }

  const collateralValueUsd = tokenAmount * effectivePrice;
  const maxBorrowUsd = Math.round((collateralValueUsd * ltv) / 100);

  const { data, error } = await supabase
    .from('token_collateral_locks')
    .insert({
      contractor_id,
      loan_id,
      wallet_account,
      token_symbol: String(token_symbol).toUpperCase(),
      token_amount: tokenAmount,
      price_snapshot_id: snapshotId,
      collateral_value_usd: collateralValueUsd,
      ltv_percent: ltv,
      max_borrow_usd: maxBorrowUsd,
      status,
      lock_tx_hash,
      risk_note: risk_note || 'MVP collateral record only. No automatic liquidation before legal, oracle, and smart contract review.',
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  await recordAuditEvent({
    actor_type: 'contractor',
    actor_id: data.contractor_id,
    action: 'token_collateral_lock_created',
    entity_type: 'token_collateral_lock',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ collateral_lock: data });
});

// SmartContractor MVP API: jobs, bids, paid bid unlocks, and contractor credit.
app.post('/api/smartcontractor/profiles', async (req, res) => {
  const profileValidationErrors = validateProfileCreateInput(req.body);
  if (profileValidationErrors.length) return validationError(res, profileValidationErrors);

  if (!requireSupabase(res)) return;

  const authResult = await getOptionalAuthenticatedUser(req);
  if (authResult.error) return res.status(authResult.status).json({ error: authResult.error });

  const { role, email, full_name, phone, xpr_account, wallet_public_key } = req.body;
  const profileInsert = {
    role,
    email,
    full_name,
    phone,
    xpr_account,
    wallet_public_key,
  };
  if (authResult.user?.id) profileInsert.auth_user_id = authResult.user.id;

  const { data, error } = await supabase
    .from('profiles')
    .insert(profileInsert)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  await recordAuditEvent({
    actor_type: role,
    actor_id: authResult.user?.id || null,
    action: 'profile_created',
    entity_type: 'profile',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ profile: data });
});

app.post('/api/smartcontractor/contractors', async (req, res) => {
  const contractorValidationErrors = validateContractorCreateInput(req.body);
  if (contractorValidationErrors.length) return validationError(res, contractorValidationErrors);

  if (!requireSupabase(res)) return;

  const {
    profile_id,
    business_name,
    ein,
    license_number,
    license_state,
    insurance_status,
  } = req.body;

  const ownership = await assertOwnedProfile(req, profile_id);
  if (!ownership.allowed) return rejectOwnership(res, ownership);

  const { data, error } = await supabase
    .from('contractors')
    .insert({
      profile_id,
      business_name,
      ein,
      license_number,
      license_state,
      insurance_status,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  await recordAuditEvent({
    actor_type: 'contractor',
    actor_id: data.id,
    action: 'contractor_created',
    entity_type: 'contractor',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ contractor: data });
});

app.post('/api/smartcontractor/homeowners', async (req, res) => {
  const homeownerValidationErrors = validateHomeownerCreateInput(req.body);
  if (homeownerValidationErrors.length) return validationError(res, homeownerValidationErrors);

  if (!requireSupabase(res)) return;

  const { profile_id, display_name, default_zip, subscription_tier } = req.body;
  const ownership = await assertOwnedProfile(req, profile_id);
  if (!ownership.allowed) return rejectOwnership(res, ownership);

  const { data, error } = await supabase
    .from('homeowners')
    .insert({ profile_id, display_name, default_zip, subscription_tier })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  await recordAuditEvent({
    actor_type: 'homeowner',
    actor_id: data.id,
    action: 'homeowner_created',
    entity_type: 'homeowner',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ homeowner: data });
});

app.get('/api/smartcontractor/jobs', async (req, res) => {
  if (!requireSupabase(res)) return;

  const { status = 'open', trade, state, zip } = req.query;
  let query = supabase
    .from('jobs')
    .select('id,title,description,trade,location_city,location_state,location_zip,budget_min_usd,budget_max_usd,status,created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (status !== 'all') query = query.eq('status', status);
  if (trade) query = query.eq('trade', trade);
  if (state) query = query.eq('location_state', state);
  if (zip) query = query.eq('location_zip', zip);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ jobs: data });
});

app.post('/api/smartcontractor/jobs', async (req, res) => {
  const jobValidationErrors = validateJobCreateInput(req.body);
  if (jobValidationErrors.length) return validationError(res, jobValidationErrors);

  if (!requireSupabase(res)) return;

  const {
    homeowner_id,
    title,
    description,
    trade,
    location_city,
    location_state,
    location_zip,
    budget_min_usd,
    budget_max_usd,
  } = req.body;

  const ownership = await assertOwnedRoleRecord(req, 'homeowners', homeowner_id, 'homeowner_id');
  if (!ownership.allowed) return rejectOwnership(res, ownership);

  const { data, error } = await supabase
    .from('jobs')
    .insert({
      homeowner_id,
      title,
      description,
      trade,
      location_city,
      location_state,
      location_zip,
      budget_min_usd,
      budget_max_usd,
      status: 'open',
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  await recordAuditEvent({
    actor_type: 'homeowner',
    actor_id: data.homeowner_id,
    action: 'job_created',
    entity_type: 'job',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ job: data });
});

app.post('/api/smartcontractor/bids', async (req, res) => {
  const bidValidationErrors = validateBidCreateInput(req.body);
  if (bidValidationErrors.length) return validationError(res, bidValidationErrors);

  if (!requireSupabase(res)) return;

  const { job_id, contractor_id, amount_usd, timeline_days, message } = req.body;
  const ownership = await assertOwnedRoleRecord(req, 'contractors', contractor_id, 'contractor_id');
  if (!ownership.allowed) return rejectOwnership(res, ownership);

  const { data, error } = await supabase
    .from('bids')
    .insert({ job_id, contractor_id, amount_usd, timeline_days, message })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  await recordAuditEvent({
    actor_type: 'contractor',
    actor_id: data.contractor_id,
    action: 'bid_submitted',
    entity_type: 'bid',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ bid: data });
});

app.get('/api/smartcontractor/bids', async (req, res) => {
  if (!requireSupabase(res)) return;

  const { job_id, contractor_id } = req.query;
  let query = supabase
    .from('bids')
    .select('id,job_id,contractor_id,amount_usd,timeline_days,message,status,created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (job_id) query = query.eq('job_id', job_id);
  if (contractor_id) query = query.eq('contractor_id', contractor_id);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ bids: data });
});

app.get('/api/smartcontractor/project-contracts', async (req, res) => {
  if (!requireSupabase(res)) return;

  const { job_id, contractor_id, homeowner_id, status = 'all' } = req.query;
  let query = supabase
    .from('project_contracts')
    .select('id,job_id,accepted_bid_id,homeowner_id,contractor_id,title,terms_summary,total_amount_usd,platform_fee_usd,status,signed_at,started_at,completed_at,created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (job_id) query = query.eq('job_id', job_id);
  if (contractor_id) query = query.eq('contractor_id', contractor_id);
  if (homeowner_id) query = query.eq('homeowner_id', homeowner_id);
  if (status !== 'all') query = query.eq('status', status);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ project_contracts: data });
});

app.post('/api/smartcontractor/project-contracts', async (req, res) => {
  const projectContractValidationErrors = validateProjectContractCreateInput(req.body);
  if (projectContractValidationErrors.length) return validationError(res, projectContractValidationErrors);

  if (!requireSupabase(res)) return;

  const {
    job_id,
    accepted_bid_id,
    homeowner_id,
    contractor_id,
    title,
    terms_summary,
    total_amount_usd,
    platform_fee_usd = 0,
    status = 'pending_signature',
  } = req.body;

  const homeownerOwnership = await assertOwnedRoleRecord(req, 'homeowners', homeowner_id, 'homeowner_id');
  if (!homeownerOwnership.allowed) return rejectOwnership(res, homeownerOwnership);

  const { data, error } = await supabase
    .from('project_contracts')
    .insert({
      job_id,
      accepted_bid_id,
      homeowner_id,
      contractor_id,
      title,
      terms_summary,
      total_amount_usd,
      platform_fee_usd,
      status,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  await recordAuditEvent({
    actor_type: 'homeowner',
    actor_id: data.homeowner_id,
    action: 'project_contract_created',
    entity_type: 'project_contract',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ project_contract: data });
});

app.get('/api/smartcontractor/milestones', async (req, res) => {
  if (!requireSupabase(res)) return;

  const { project_contract_id, job_id, work_status = 'all', payment_status = 'all' } = req.query;
  let query = supabase
    .from('milestones')
    .select('id,project_contract_id,job_id,title,description,sequence_number,amount_usd,payment_status,work_status,due_at,submitted_at,approved_at,released_at,created_at')
    .order('sequence_number', { ascending: true })
    .limit(100);

  if (project_contract_id) query = query.eq('project_contract_id', project_contract_id);
  if (job_id) query = query.eq('job_id', job_id);
  if (work_status !== 'all') query = query.eq('work_status', work_status);
  if (payment_status !== 'all') query = query.eq('payment_status', payment_status);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ milestones: data });
});

app.post('/api/smartcontractor/milestones', async (req, res) => {
  const milestoneValidationErrors = validateMilestoneCreateInput(req.body);
  if (milestoneValidationErrors.length) return validationError(res, milestoneValidationErrors);

  if (!requireSupabase(res)) return;

  const {
    project_contract_id,
    job_id,
    title,
    description,
    sequence_number = 1,
    amount_usd,
    payment_status = 'not_funded',
    work_status = 'not_started',
    due_at,
  } = req.body;

  const { data, error } = await supabase
    .from('milestones')
    .insert({
      project_contract_id,
      job_id,
      title,
      description,
      sequence_number,
      amount_usd,
      payment_status,
      work_status,
      due_at,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  await recordAuditEvent({
    actor_type: 'system',
    action: 'milestone_created',
    entity_type: 'milestone',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ milestone: data });
});

app.post('/api/smartcontractor/bids/:bidId/unlock', async (req, res) => {
  const bidUnlockValidationErrors = validateBidUnlockInput(req.body, req.params);
  if (bidUnlockValidationErrors.length) return validationError(res, bidUnlockValidationErrors);

  if (!requireSupabase(res)) return;

  const { contractor_id, payment_tx_hash, price_usd = 5 } = req.body;
  const ownership = await assertOwnedRoleRecord(req, 'contractors', contractor_id, 'contractor_id');
  if (!ownership.allowed) return rejectOwnership(res, ownership);

  const { data, error } = await supabase
    .from('bid_unlocks')
    .insert({
      bid_id: req.params.bidId,
      unlocked_by_contractor_id: contractor_id,
      payment_tx_hash,
      price_usd,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  await recordAuditEvent({
    actor_type: 'contractor',
    actor_id: data.unlocked_by_contractor_id,
    action: 'bid_unlocked',
    entity_type: 'bid_unlock',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ unlock: data });
});

app.post('/api/smartcontractor/loans', async (req, res) => {
  const loanValidationErrors = validateLoanRequestInput(req.body);
  if (loanValidationErrors.length) return validationError(res, loanValidationErrors);

  if (!requireSupabase(res)) return;

  const { contractor_id, job_id, principal_usd, apr_percent = 2, purpose, risk_score } = req.body;
  const principal = Number(principal_usd);

  const ownership = await assertOwnedRoleRecord(req, 'contractors', contractor_id, 'contractor_id');
  if (!ownership.allowed) return rejectOwnership(res, ownership);

  const { data, error } = await supabase
    .from('contractor_loans')
    .insert({
      contractor_id,
      job_id,
      principal_usd: principal,
      outstanding_usd: principal,
      apr_percent: Number(apr_percent),
      purpose,
      risk_score: risk_score === undefined || risk_score === null || risk_score === '' ? null : Number(risk_score),
      status: 'requested',
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  await recordAuditEvent({
    actor_type: 'contractor',
    actor_id: data.contractor_id,
    action: 'loan_requested',
    entity_type: 'contractor_loan',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ loan: data });
});

app.get('/api/smartcontractor/loans', async (req, res) => {
  if (!requireSupabase(res)) return;

  const { contractor_id, job_id, status = 'all' } = req.query;
  let query = supabase
    .from('contractor_loans')
    .select('id,contractor_id,job_id,principal_usd,outstanding_usd,apr_percent,purpose,status,risk_score,created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (contractor_id) query = query.eq('contractor_id', contractor_id);
  if (job_id) query = query.eq('job_id', job_id);
  if (status !== 'all') query = query.eq('status', status);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ loans: data });
});

app.post('/api/smartcontractor/loans/:loanId/repayments', async (req, res) => {
  const repaymentValidation = validateLoanRepaymentInput(req.body);
  if (repaymentValidation.errors.length) return validationError(res, repaymentValidation.errors);

  if (!requireSupabase(res)) return;

  const { repaymentAmount, source, payment_tx_hash } = repaymentValidation;

  const { data: loan, error: loanError } = await supabase
    .from('contractor_loans')
    .select('id,contractor_id,outstanding_usd,status')
    .eq('id', req.params.loanId)
    .single();

  if (loanError) return res.status(500).json({ error: loanError.message });

  const ownership = await assertOwnedRoleRecord(req, 'contractors', loan.contractor_id, 'contractor_id');
  if (!ownership.allowed) return rejectOwnership(res, ownership);

  const currentOutstanding = Number(loan.outstanding_usd);
  const newOutstanding = Math.max(currentOutstanding - repaymentAmount, 0);
  const nextStatus = newOutstanding === 0 ? 'repaid' : loan.status === 'requested' ? 'active' : loan.status;

  const { data: repayment, error: repaymentError } = await supabase
    .from('loan_repayments')
    .insert({
      loan_id: req.params.loanId,
      amount_usd: repaymentAmount,
      source,
      payment_tx_hash,
    })
    .select()
    .single();

  if (repaymentError) return res.status(500).json({ error: repaymentError.message });

  const { data: updatedLoan, error: updateError } = await supabase
    .from('contractor_loans')
    .update({ outstanding_usd: newOutstanding, status: nextStatus })
    .eq('id', req.params.loanId)
    .select('id,principal_usd,outstanding_usd,status')
    .single();

  if (updateError) return res.status(500).json({ error: updateError.message });
  await recordAuditEvent({
    actor_type: 'contractor',
    action: 'loan_repayment_recorded',
    entity_type: 'loan_repayment',
    entity_id: repayment.id,
    old_value: { loan },
    new_value: { repayment, loan: updatedLoan },
    req,
  });
  res.status(201).json({ repayment, loan: updatedLoan });
});

app.get('/api/smartcontractor/disputes', async (req, res) => {
  if (!requireSupabase(res)) return;

  const { status = 'open', job_id } = req.query;
  let query = supabase
    .from('disputes')
    .select('id,job_id,homeowner_id,contractor_id,opened_by_role,title,description,status,resolution,created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (status !== 'all') query = query.eq('status', status);
  if (job_id) query = query.eq('job_id', job_id);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ disputes: data });
});

app.post('/api/smartcontractor/disputes', async (req, res) => {
  const {
    job_id,
    homeowner_id,
    contractor_id,
    opened_by_role,
    title,
    description,
  } = req.body;

  const disputeValidationErrors = validateDisputeCreateInput(req.body);
  if (disputeValidationErrors.length) return validationError(res, disputeValidationErrors);

  if (!requireSupabase(res)) return;

  if (opened_by_role === 'homeowner') {
    if (getBearerToken(req) && !homeowner_id) {
      return res.status(400).json({ error: 'homeowner_id is required for authenticated homeowner disputes' });
    }
    if (homeowner_id) {
      const ownership = await assertOwnedRoleRecord(req, 'homeowners', homeowner_id, 'homeowner_id');
      if (!ownership.allowed) return rejectOwnership(res, ownership);
    }
  }
  if (opened_by_role === 'contractor') {
    if (getBearerToken(req) && !contractor_id) {
      return res.status(400).json({ error: 'contractor_id is required for authenticated contractor disputes' });
    }
    if (contractor_id) {
      const ownership = await assertOwnedRoleRecord(req, 'contractors', contractor_id, 'contractor_id');
      if (!ownership.allowed) return rejectOwnership(res, ownership);
    }
  }

  const { data, error } = await supabase
    .from('disputes')
    .insert({
      job_id,
      homeowner_id,
      contractor_id,
      opened_by_role,
      title,
      description,
      status: 'evidence_collection',
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  await recordAuditEvent({
    actor_type: opened_by_role,
    actor_id: opened_by_role === 'homeowner' ? data.homeowner_id : data.contractor_id,
    action: 'dispute_opened',
    entity_type: 'dispute',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ dispute: data });
});

app.post('/api/smartcontractor/disputes/:disputeId/evidence', async (req, res) => {
  const evidenceValidationErrors = validateDisputeEvidenceInput(req.body);
  if (evidenceValidationErrors.length) return validationError(res, evidenceValidationErrors);

  if (!requireSupabase(res)) return;

  const { uploaded_by_profile_id, evidence_type, evidence_url, notes } = req.body;

  let safeUploadedByProfileId = uploaded_by_profile_id || null;
  if (uploaded_by_profile_id) {
    const ownership = await assertOwnedProfile(req, uploaded_by_profile_id);
    if (!ownership.allowed) return rejectOwnership(res, ownership);
  } else if (getBearerToken(req)) {
    const auth = await getOwnershipAuthUser(req);
    if (auth.error) return res.status(auth.status).json({ error: auth.error });
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('auth_user_id', auth.user.id)
      .maybeSingle();
    if (profileError) return res.status(500).json({ error: profileError.message });
    if (!profile) return res.status(403).json({ error: 'Authenticated user does not have a linked profile for evidence upload' });
    safeUploadedByProfileId = profile.id;
  }

  const { data, error } = await supabase
    .from('dispute_evidence')
    .insert({
      dispute_id: req.params.disputeId,
      uploaded_by_profile_id: safeUploadedByProfileId,
      evidence_type: evidence_type || 'note',
      evidence_url,
      notes,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  await recordAuditEvent({
    actor_type: 'homeowner',
    actor_id: uploaded_by_profile_id,
    action: 'dispute_evidence_added',
    entity_type: 'dispute_evidence',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ evidence: data });
});

app.post('/api/smartcontractor/disputes/:disputeId/reviews', async (req, res) => {
  const reviewValidationErrors = validateDisputeReviewInput(req.body);
  if (reviewValidationErrors.length) return validationError(res, reviewValidationErrors);

  if (!requireSupabase(res)) return;

  const {
    reviewer_contractor_id,
    review_type = 'remote',
    quality_score,
    finding,
    recommendation,
    token_reward_amount = 25,
    rating_points_awarded = 1,
    loan_score_points = 1,
  } = req.body;

  const ownership = await assertOwnedRoleRecord(req, 'contractors', reviewer_contractor_id, 'reviewer_contractor_id');
  if (!ownership.allowed) return rejectOwnership(res, ownership);

  const { data, error } = await supabase
    .from('dispute_reviews')
    .insert({
      dispute_id: req.params.disputeId,
      reviewer_contractor_id,
      review_type,
      quality_score,
      finding,
      recommendation,
      token_reward_amount,
      rating_points_awarded,
      loan_score_points,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  await recordAuditEvent({
    actor_type: 'peer_reviewer',
    actor_id: data.reviewer_contractor_id,
    action: 'dispute_peer_review_submitted',
    entity_type: 'dispute_review',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ review: data });
});

// ─── Slack Bot Endpoint ────────────────────────────────────────────────────────
// Setup: create Slack app at api.slack.com → Event Subscriptions → set Request URL
// to https://your-domain.com/api/slack/events
// Required scopes: app_mentions:read, chat:write, channels:history
// Set SLACK_BOT_TOKEN in .env
app.post('/api/slack/events', async (req, res) => {
  const { type, challenge, event } = req.body;

  // Step 1: Slack URL verification
  if (type === 'url_verification') {
    return res.json({ challenge });
  }

  // Respond immediately (Slack requires <3s response)
  res.sendStatus(200);

  // Handle app_mention events (when someone @mentions the bot)
  if (type === 'event_callback' && event && (event.type === 'app_mention' || event.type === 'message')) {
    if (event.bot_id) return; // Ignore bot messages

    const question = (event.text || '').replace(/<@[A-Z0-9]+>/g, '').trim();
    if (!question) return;

    const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
    if (!SLACK_BOT_TOKEN) return;

    try {
      // Generate AI response
      const aiResponse = await openai.chat.completions.create({
        model: 'anthropic/claude-sonnet-4-5',
        max_tokens: 1200,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT + '\n\nYou are responding via Slack. Use Slack markdown: *bold*, _italic_, `code`. Keep answers concise (under 800 chars for Slack). End with 2-3 action suggestions.' },
          { role: 'user', content: question },
        ],
      });

      const answer = aiResponse.choices[0]?.message?.content || 'Unable to process request.';

      // Post response back to Slack
      await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel: event.channel,
          thread_ts: event.ts,
          text: answer,
        }),
      });
    } catch (err) {
      console.error('Slack bot error:', err.message);
    }
  }
});

// ─── Zapier / Make.com Webhook ─────────────────────────────────────────────────
// Use this URL in Zapier as a "Webhooks by Zapier" action target
// or in Make.com as an HTTP module POST target
// Supports: ask AI a question, generate a document, get suggestions
app.post('/api/webhook', chatLimiter, async (req, res) => {
  const { action, question, document_type, context, source } = req.body;

  if (!action) {
    return res.status(400).json({ error: 'action field required (ask | generate | suggest)' });
  }

  try {
    if (action === 'ask') {
      if (!question) return res.status(400).json({ error: 'question required' });

      const response = await openai.chat.completions.create({
        model: 'anthropic/claude-haiku-4-5',
        max_tokens: 500,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT + '\n\nGive a concise answer in 3-5 sentences.' },
          { role: 'user', content: question },
        ],
      });

      return res.json({
        success: true,
        source: source || 'webhook',
        action,
        answer: response.choices[0]?.message?.content,
      });
    }

    if (action === 'generate') {
      if (!document_type) return res.status(400).json({ error: 'document_type required (lien_waiver | change_order | contract | demand_letter | punch_list)' });

      let prompt = `Generate a complete, professional ${document_type.replace('_', ' ')} template. Use [PLACEHOLDER] format for variable fields. Make it legally sound and industry-standard.`;
      if (context) prompt + `\n\nContext: ${context}`;

      const response = await openai.chat.completions.create({
        model: 'anthropic/claude-sonnet-4-5',
        max_tokens: 2000,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
      });

      return res.json({
        success: true,
        action,
        document_type,
        document: response.choices[0]?.message?.content,
      });
    }

    if (action === 'suggest') {
      const userType = req.body.user_type || 'general';
      const response = await openai.chat.completions.create({
        model: 'anthropic/claude-haiku-4-5',
        max_tokens: 300,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Generate 5 proactive construction tips or action items for a ${userType} today. Format as a JSON array of strings.` },
        ],
      });

      return res.json({
        success: true,
        action,
        suggestions: response.choices[0]?.message?.content,
      });
    }

    res.status(400).json({ error: `Unknown action: ${action}. Use: ask | generate | suggest` });

  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(500).json({ error: 'Service temporarily unavailable' });
  }
});

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'GCSC BuilderAI',
    version: '2.0.0',
    model: 'claude-sonnet-4-5',
    features: [
      'chat',
      'streaming',
      'memory',
      'slack-bot',
      'zapier-webhook',
      'document-generation',
      'smartcontractor-jobs',
      'smartcontractor-bids',
      'smartcontractor-loans',
      'smartcontractor-disputes',
      'smartcontractor-peer-reviews',
      'multi-provider-payments',
      'metal-pay-connect-signature',
      'payment-event-ledger',
      'audit-event-ledger',
      'project-contracts',
      'milestones',
      'payment-webhook-skeletons',
      'verification-provider-abstraction',
      'token-collateral-ledger',
      'admin-risk-console',
      'admin-role-model',
      'admin-enforcement-scaffold',
      'launch-readiness-gate',
      'auth-decision-package',
      'auth-implementation-scaffold',
      'auth-magic-link-rate-limit',
      'protected-route-gate',
      'founder-action-center',
      'founder-auth-setup',
      'profile-ownership-binding',
      'role-ownership-guards',
      'supabase-service-role-boundary',
      'mobile-install-readiness',
      'controlled-beta-readiness',
      'ai-agent-workflow-catalog',
      'ai-agent-local-recommendation',
    ],
  });
});

// ─── Serve widget files ────────────────────────────────────────────────────────
app.get('/widget.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'widget.js'));
});

app.get('/widget.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'widget.css'));
});

app.use('/api', (req, res) => {
  res.status(404).json({
    error: 'API route not found',
    path: req.originalUrl,
    request_id: req.id || null,
  });
});

// ─── Start (local) / Export (Vercel) ──────────────────────────────────────────
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n🏗️  GCSC BuilderAI running on http://localhost:${PORT}`);
    console.log(`📡  API: http://localhost:${PORT}/api/chat`);
    console.log(`🔧  Demo: http://localhost:${PORT}\n`);
  });
}

module.exports = app;
