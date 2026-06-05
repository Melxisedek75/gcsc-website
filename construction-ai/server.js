// Load .env manually (cross-platform compatible)
const fs = require('fs');
try {
  const envContent = fs.readFileSync(__dirname + '/.env', 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      if (process.env[key] === undefined) process.env[key] = match[2].trim();
    }
  });
} catch (e) { /* .env not found, use system env */ }
const express = require('express');
const rateLimit = require('express-rate-limit');
const OpenAI = require('openai');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const crypto = require('crypto');
const { SYSTEM_PROMPT } = require('./knowledge/system-prompt');
const smartContractorWorkflowReadiness = require('./src/smartcontractor/workflow-readiness.cjs');

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
        request_id: req.id || null,
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

function serviceUnavailable(res, error) {
  return res.status(503).json({ error, request_id: res.req?.id || null });
}

function authError(res, status, error) {
  return res.status(status).json({ error, request_id: res.req?.id || null });
}

function serverError(res, error) {
  return res.status(500).json({ error, request_id: res.req?.id || null });
}

function databaseError(res, error) {
  return serverError(res, error?.message || 'Database operation failed');
}

function databaseWriteError(res, error) {
  return databaseError(res, error);
}

function requireSupabase(res) {
  if (supabase) return true;
  serviceUnavailable(res, 'Supabase is not configured');
  return false;
}

function requireSupabaseAuth(res) {
  if (supabaseAuth) return true;
  serviceUnavailable(res, 'Supabase Auth client is not configured');
  return false;
}

function requireSupabaseAdmin(res) {
  if (supabaseAdmin) return true;
  serviceUnavailable(res, 'Supabase service-role client is not configured server-side');
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
  return res.status(ownership.status).json({ error: ownership.error, request_id: res.req?.id || null });
}

async function requireAuthenticatedUser(req, res, next) {
  const result = await getAuthenticatedUser(req);
  if (result.error) return res.status(result.status).json({ error: result.error, request_id: req.id || null });
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
    request_id: res.req?.id || null,
  });
}

function aiRecommendationValidationError(res, errors) {
  return res.status(400).json({
    error: 'Validation failed',
    details: Array.isArray(errors) ? errors : [errors],
    request_id: res.req?.id || null,
    safe_scope: [
      'The request failed local validation.',
      'No recommendation draft is returned.',
      'No live audit write, payment, loan, escrow, collateral, provider, or legal action is attempted.',
    ],
    no_recommendation_draft: true,
    audit_event_attempted: false,
  });
}

function buildAiWorkflowCatalogErrorResponse(req, details = ['workflow catalog could not be loaded from local configuration']) {
  return {
    error: 'Workflow catalog unavailable',
    details: Array.isArray(details) ? details : [details],
    request_id: req?.id || null,
    safe_scope: [
      'The request failed local workflow discovery.',
      'No supported workflow menu is returned.',
      'No recommendation draft is returned.',
      'No live audit write, payment, loan, escrow, collateral, provider, or legal action is attempted.',
    ],
    no_supported_workflows: true,
    no_workflow_execution_attempted: true,
  };
}

const repaymentWaterfallDraftActorRoles = [
  'founder',
  'admin',
  'legal_reviewer',
  'finance_provider_reviewer',
  'security_reviewer',
  'codex_local_reviewer',
];

const repaymentWaterfallDraftRequiredFields = [
  'request_id',
  'idempotency_key',
  'actor_profile_id',
  'actor_role',
  'project_contract_id',
  'milestone_id',
  'loan_request_id',
  'provider_terms_version',
  'calculation_input',
  'blocked_live_gate_status',
];

const repaymentWaterfallDraftBlockedStatuses = {
  live_repayment_routing_status: 'LIVE_REPAYMENT_ROUTING_BLOCKED',
  live_escrow_custody_status: 'LIVE_ESCROW_CUSTODY_BLOCKED',
  live_stablecoin_settlement_status: 'LIVE_STABLECOIN_SETTLEMENT_BLOCKED',
  live_token_collateral_status: 'LIVE_TOKEN_COLLATERAL_BLOCKED',
  ai_final_approval_status: 'AI_FINAL_APPROVAL_BLOCKED',
};

const repaymentWaterfallDraftSafeScope = [
  'Local repayment waterfall draft review only.',
  'There is no real loan origination, no live repayment routing, no real escrow custody, no stablecoin settlement, no token collateral, no provider call, and no production money movement.',
  'Founder/admin/legal/provider/security review remains required before any live action.',
];

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateOptionalFiniteNumber(value, fieldName, errors) {
  if (value === undefined) return;
  if (value === null || value === '' || !Number.isFinite(Number(value))) {
    errors.push(`${fieldName} must be a finite number`);
  }
}

function validateMagicLinkInput(body = {}) {
  const errors = [];
  const { email, redirect_to } = body || {};
  let redirectTo = null;

  if (!isEmail(email)) errors.push('email must be a valid email address');
  if (typeof email === 'string' && email.trim().length > 254) {
    errors.push('email must be 254 characters or less');
  }

  if (redirect_to !== undefined && redirect_to !== null && redirect_to !== '') {
    if (typeof redirect_to !== 'string' || redirect_to.length > 500) {
      errors.push('redirect_to must be a string under 500 characters');
    } else {
      redirectTo = safeAuthRedirectUrl(redirect_to);
      if (!redirectTo) {
        errors.push('redirect_to must use localhost, 127.0.0.1, xprnet.org, www.xprnet.org, PUBLIC_SITE_URL, or ALLOWED_AUTH_REDIRECT_ORIGINS');
      }
    }
  }

  return {
    errors,
    email,
    redirectTo,
  };
}

function validateChatInput(body = {}) {
  const errors = [];
  const { messages, context } = body || {};
  const validRoles = ['user', 'assistant'];

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    errors.push('messages array is required');
  } else {
    for (const msg of messages) {
      if (!msg || !validRoles.includes(msg.role) || typeof msg.content !== 'string') {
        errors.push('Invalid message format');
        break;
      }
      if (msg.content.length > 4000) {
        errors.push('Message too long (max 4000 chars)');
        break;
      }
    }
  }

  if (context !== undefined && (context === null || typeof context !== 'object' || Array.isArray(context))) {
    errors.push('context must be an object');
  } else if (context) {
    validateOptionalEnum(context.userType, ['contractor', 'homeowner'], 'context.userType', errors);
    validateOptionalString(context.projectType, 'context.projectType', errors, 120);
    validateOptionalString(context.location, 'context.location', errors, 120);
  }

  return { errors, messages, context };
}

function validateQuickInput(body = {}) {
  const errors = [];
  const { question, context } = body || {};

  if (!question || typeof question !== 'string' || question.length > 500) {
    errors.push('question string required (max 500 chars)');
  }
  if (context !== undefined && (context === null || typeof context !== 'object' || Array.isArray(context))) {
    errors.push('context must be an object');
  }

  return { errors, question, context };
}

function validateAutomationWebhookInput(body = {}) {
  const errors = [];
  const allowedActions = ['ask', 'generate', 'suggest'];
  const allowedDocumentTypes = ['lien_waiver', 'change_order', 'contract', 'demand_letter', 'punch_list'];
  const {
    action,
    question,
    document_type,
    context,
    source,
    user_type = 'general',
  } = body || {};

  if (!isNonEmptyString(action)) {
    errors.push('action field required (ask | generate | suggest)');
  } else if (!allowedActions.includes(action)) {
    errors.push('action must be one of: ask, generate, suggest');
  }

  if (action === 'ask' && !isNonEmptyString(question)) {
    errors.push('question required');
  }
  if (action === 'generate') {
    if (!isNonEmptyString(document_type)) {
      errors.push('document_type required (lien_waiver | change_order | contract | demand_letter | punch_list)');
    } else if (!allowedDocumentTypes.includes(document_type)) {
      errors.push('document_type must be one of: lien_waiver, change_order, contract, demand_letter, punch_list');
    }
  }

  validateOptionalString(question, 'question', errors, 1000);
  validateOptionalString(context, 'context', errors, 2000);
  validateOptionalString(source, 'source', errors, 120);
  validateOptionalString(user_type, 'user_type', errors, 120);

  return {
    errors,
    action,
    question,
    document_type,
    context,
    source,
    user_type,
  };
}

function validateSlackEventInput(body = {}) {
  const errors = [];
  const { type, challenge, event } = body || {};

  if (!['url_verification', 'event_callback'].includes(type)) {
    errors.push('Slack event type must be url_verification or event_callback');
  }

  if (type === 'url_verification') {
    if (!isNonEmptyString(challenge)) {
      errors.push('Slack url_verification challenge is required');
    }
    validateOptionalString(challenge, 'challenge', errors, 500);
  }

  if (type === 'event_callback') {
    if (!event || typeof event !== 'object' || Array.isArray(event)) {
      errors.push('Slack event_callback event object is required');
    } else {
      validateOptionalEnum(event.type, ['app_mention', 'message'], 'event.type', errors);
      validateOptionalString(event.text, 'event.text', errors, 4000);
      validateOptionalString(event.channel, 'event.channel', errors, 120);
      validateOptionalString(event.ts, 'event.ts', errors, 120);
      validateOptionalString(event.bot_id, 'event.bot_id', errors, 120);
    }
  }

  return {
    errors,
    type,
    challenge,
    event,
  };
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

function validatePaymentIntentInput(body = {}) {
  const errors = [];
  const {
    provider = 'xpr_network',
    amount_usd,
    currency = 'USD',
    purpose = 'smartcontractor_payment',
    payer_role,
    reference_id,
  } = body || {};

  const providerConfig = paymentProviders.find((item) => item.id === provider);
  if (!providerConfig) {
    errors.push(`Unsupported provider: ${provider}`);
  }

  const amount = parsePositiveNumber(amount_usd, 'amount_usd', errors);
  validateOptionalEnum(payer_role, ['homeowner', 'contractor', 'smartcontractor_user', 'admin', 'dao', 'system', 'unknown'], 'payer_role', errors);
  validateOptionalString(provider, 'provider', errors, 80);
  validateOptionalString(purpose, 'purpose', errors, 80);
  validateOptionalString(reference_id, 'reference_id', errors, 120);

  if (typeof currency !== 'string' || !/^[A-Z]{3,8}$/.test(currency)) {
    errors.push('currency must be an uppercase code like USD, USDC, XPR, GCSC, or GCST');
  }
  if (amount && amount > 1000000) {
    errors.push('amount_usd must be 1000000 or less for MVP safety');
  }

  return { errors, amount, providerConfig };
}

function validateAiAgentRecommendationInput(body = {}) {
  const errors = [];
  const {
    workflow,
    entity_type = 'contractor_loan',
    entity_id,
    input_refs,
    facts = {},
  } = body || {};

  if (workflow === 'repayment_waterfall_review_packet') {
    errors.push('workflow repayment_waterfall_review_packet is catalog-only; use GET /api/admin/ai-agents/workflows');
  } else if (!['starter_loan_review', 'verification_triage', 'payment_exception_review', 'dispute_evidence_summary', 'draft_document_packet', 'job_match_ranking'].includes(workflow)) {
    errors.push('workflow must be starter_loan_review, verification_triage, payment_exception_review, dispute_evidence_summary, draft_document_packet, or job_match_ranking');
  }
  if (workflow === 'starter_loan_review' && entity_type !== 'contractor_loan') {
    errors.push('entity_type must be contractor_loan');
  }
  if (workflow === 'verification_triage' && entity_type !== 'verification_check') {
    errors.push('entity_type must be verification_check');
  }
  if (workflow === 'payment_exception_review' && entity_type !== 'payment_exception') {
    errors.push('entity_type must be payment_exception');
  }
  if (workflow === 'dispute_evidence_summary' && entity_type !== 'dispute') {
    errors.push('entity_type must be dispute');
  }
  if (workflow === 'draft_document_packet' && entity_type !== 'document_packet') {
    errors.push('entity_type must be document_packet');
  }
  if (workflow === 'job_match_ranking' && entity_type !== 'job_match') {
    errors.push('entity_type must be job_match');
  }
  if (!isNonEmptyString(entity_id)) errors.push('entity_id is required');

  validateOptionalString(workflow, 'workflow', errors, 80);
  validateOptionalString(entity_type, 'entity_type', errors, 80);
  validateOptionalString(entity_id, 'entity_id', errors, 160);

  if (input_refs !== undefined) {
    if (!Array.isArray(input_refs) || input_refs.some((item) => !isNonEmptyString(item))) {
      errors.push('input_refs must be an array of non-empty strings');
    } else if (!input_refs.length) {
      errors.push('input_refs must include at least one reference');
    } else if (input_refs.length > 12) {
      errors.push('input_refs must include 12 references or fewer');
    } else {
      input_refs.forEach((item, index) => validateOptionalString(item, `input_refs[${index}]`, errors, 120));
    }
  }

  if (facts === null || typeof facts !== 'object' || Array.isArray(facts)) {
    errors.push('facts must be an object');
  } else {
    validateOptionalFiniteNumber(facts.principal_usd, 'principal_usd', errors);
    validateOptionalFiniteNumber(facts.requested_amount_usd, 'requested_amount_usd', errors);
    validateOptionalFiniteNumber(facts.risk_score, 'risk_score', errors);

    ['principal_usd', 'requested_amount_usd'].forEach((fieldName) => {
      const value = facts[fieldName];
      if (value !== undefined && value !== null && value !== '') {
        const number = Number(value);
        if (Number.isFinite(number) && number <= 0) {
          errors.push(`${fieldName} must be a positive finite number`);
        }
      }
    });

    if (facts.risk_score !== undefined && facts.risk_score !== null && facts.risk_score !== '') {
      const riskScore = Number(facts.risk_score);
      if (Number.isFinite(riskScore) && (riskScore < 0 || riskScore > 100)) {
        errors.push('risk_score must be between 0 and 100');
      }
    }
    validateOptionalString(facts.verification_status, 'verification_status', errors, 80);
    validateOptionalString(facts.license_status, 'license_status', errors, 80);
    validateOptionalString(facts.insurance_status, 'insurance_status', errors, 80);
    validateOptionalString(facts.business_identity_status, 'business_identity_status', errors, 80);
    validateOptionalString(facts.payment_status, 'payment_status', errors, 80);
    validateOptionalString(facts.webhook_status, 'webhook_status', errors, 80);
    validateOptionalString(facts.ledger_status, 'ledger_status', errors, 80);
    validateOptionalString(facts.dispute_status, 'dispute_status', errors, 80);
    validateOptionalString(facts.evidence_status, 'evidence_status', errors, 80);
    validateOptionalString(facts.milestone_status, 'milestone_status', errors, 80);
    validateOptionalString(facts.peer_review_status, 'peer_review_status', errors, 80);
    validateOptionalString(facts.contract_status, 'contract_status', errors, 80);
    validateOptionalString(facts.scope_status, 'scope_status', errors, 80);
    validateOptionalString(facts.attorney_review_status, 'attorney_review_status', errors, 80);
    validateOptionalString(facts.signature_status, 'signature_status', errors, 80);
    validateOptionalString(facts.job_status, 'job_status', errors, 80);
    validateOptionalString(facts.contractor_status, 'contractor_status', errors, 80);
    validateOptionalString(facts.geo_match_status, 'geo_match_status', errors, 80);
    validateOptionalString(facts.license_match_status, 'license_match_status', errors, 80);
    validateOptionalString(facts.availability_status, 'availability_status', errors, 80);
  }

  return {
    errors,
    workflow,
    entity_type,
    entity_id,
    input_refs,
    facts,
  };
}

function stableLocalJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableLocalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableLocalJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function localSha256(value) {
  return crypto.createHash('sha256').update(stableLocalJson(value)).digest('hex');
}

function containsSecretLookingValue(value) {
  const secretPattern = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;
  if (typeof value === 'string') return secretPattern.test(value);
  if (Array.isArray(value)) return value.some((item) => containsSecretLookingValue(item));
  if (value && typeof value === 'object') {
    return Object.values(value).some((item) => containsSecretLookingValue(item));
  }
  return false;
}

function validateRepaymentWaterfallDraftEndpointInput(body = {}) {
  const errors = [];

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    errors.push('request body must be an object');
    return { errors };
  }

  for (const field of repaymentWaterfallDraftRequiredFields) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      errors.push(`${field} is required`);
    }
  }

  for (const field of [
    'request_id',
    'idempotency_key',
    'actor_profile_id',
    'actor_role',
    'project_contract_id',
    'milestone_id',
    'loan_request_id',
    'provider_terms_version',
    'blocked_live_gate_status',
    'replayed_input_hash',
  ]) {
    validateOptionalString(body[field], field, errors, 160);
  }

  if (body.calculation_input === null || typeof body.calculation_input !== 'object' || Array.isArray(body.calculation_input)) {
    errors.push('calculation_input must be an object');
  }

  if (body.blocked_live_gate_status && body.blocked_live_gate_status !== 'BLOCKED_FOR_LIVE') {
    errors.push('blocked_live_gate_status must be BLOCKED_FOR_LIVE');
  }

  if (containsSecretLookingValue(body)) {
    errors.push('request must not contain secret-looking values or live payment instructions');
  }

  return {
    errors,
    request_id: typeof body.request_id === 'string' ? body.request_id.trim() : body.request_id,
    idempotency_key: typeof body.idempotency_key === 'string' ? body.idempotency_key.trim() : body.idempotency_key,
    actor_profile_id: typeof body.actor_profile_id === 'string' ? body.actor_profile_id.trim() : body.actor_profile_id,
    actor_role: typeof body.actor_role === 'string' ? body.actor_role.trim() : body.actor_role,
    project_contract_id: body.project_contract_id,
    milestone_id: body.milestone_id,
    loan_request_id: body.loan_request_id,
    provider_terms_version: body.provider_terms_version,
    calculation_input: body.calculation_input,
    replayed_input_hash: body.replayed_input_hash,
  };
}

function buildRepaymentWaterfallDraftEndpointHold(req, input, fixtureState, holdReason) {
  const output = {
    request_id: input?.request_id || req?.id || null,
    idempotency_key: input?.idempotency_key || null,
    actor_profile_id: input?.actor_profile_id || null,
    actor_role: input?.actor_role || null,
    project_contract_id: input?.project_contract_id || null,
    milestone_id: input?.milestone_id || null,
    loan_request_id: input?.loan_request_id || null,
    provider_terms_version: input?.provider_terms_version || null,
    fixture_state: fixtureState,
    approved_loan_repayment: 0,
    contractor_net_payout: 0,
    allocable_amount: 0,
    hold_reason: holdReason,
    blocked_live_gate_status: 'BLOCKED_FOR_LIVE',
    local_only: true,
    deployment_status: 'BLOCKED_FOR_LIVE',
    real_loan_allowed: false,
    repayment_routing_allowed: false,
    ...repaymentWaterfallDraftBlockedStatuses,
    safe_scope: repaymentWaterfallDraftSafeScope,
  };

  const auditEvent = {
    audit_event_id: `audit_${localSha256({ request_id: output.request_id, fixture_state: fixtureState, hold_reason: holdReason }).slice(0, 16)}`,
    request_id: output.request_id,
    actor_profile_id: output.actor_profile_id,
    input_hash: localSha256(input || {}),
    output_hash: localSha256(output),
    endpoint_name: 'local_repayment_waterfall_draft_endpoint',
    fixture_state: fixtureState,
    hold_reason: holdReason,
    blocked_live_gate_status: 'BLOCKED_FOR_LIVE',
    created_at: 'LOCAL_DRAFT_TIMESTAMP',
  };

  return {
    ...output,
    audit_event_id: auditEvent.audit_event_id,
    audit_event: auditEvent,
  };
}

function buildRepaymentWaterfallDraftEndpointResponse(req, input, draftResult, inputHash) {
  return {
    request_id: input.request_id,
    idempotency_key: input.idempotency_key,
    actor_profile_id: input.actor_profile_id,
    actor_role: input.actor_role,
    project_contract_id: input.project_contract_id,
    milestone_id: input.milestone_id,
    loan_request_id: input.loan_request_id,
    provider_terms_version: input.provider_terms_version,
    route_input_hash: inputHash,
    fixture_state: draftResult.fixture_state,
    approved_loan_repayment: draftResult.approved_loan_repayment,
    contractor_net_payout: draftResult.contractor_net_payout,
    allocable_amount: draftResult.allocable_amount,
    hold_reason: draftResult.hold_reason,
    blocked_live_gate_status: 'BLOCKED_FOR_LIVE',
    audit_event_id: draftResult.audit_event_id,
    audit_event: draftResult.audit_event,
    local_only: true,
    deployment_status: 'BLOCKED_FOR_LIVE',
    real_loan_allowed: false,
    repayment_routing_allowed: false,
    ...repaymentWaterfallDraftBlockedStatuses,
    safe_scope: repaymentWaterfallDraftSafeScope,
    request_trace_id: req?.id || null,
  };
}

function validatePriceSnapshotInput(body = {}) {
  const errors = [];
  const {
    token_symbol,
    price_usd,
    source = 'manual',
    provider_reference,
    raw_result = {},
  } = body || {};

  if (!isNonEmptyString(token_symbol)) errors.push('token_symbol is required');
  validateOptionalString(token_symbol, 'token_symbol', errors, 20);
  validateOptionalString(source, 'source', errors, 80);
  validateOptionalString(provider_reference, 'provider_reference', errors, 160);
  const price = parseNonNegativeNumber(price_usd, 'price_usd', errors);
  if (raw_result === null || typeof raw_result !== 'object' || Array.isArray(raw_result)) {
    errors.push('raw_result must be an object');
  }

  return {
    errors,
    price,
    token_symbol,
    source,
    provider_reference,
    raw_result,
  };
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
function rateLimitHandler(message) {
  return (req, res) => {
    return res.status(429).json({
      error: message,
      request_id: req.id || null,
    });
  };
}

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute window
  max: 20,                    // 20 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Too many requests. Please wait a moment.'),
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minute window
  max: 5,                     // limit Magic Link email requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Too many Magic Link requests. Please wait before requesting another login email.'),
});

// ─── Chat Endpoint ─────────────────────────────────────────────────────────────
app.post('/api/chat', chatLimiter, async (req, res) => {
  const chatValidation = validateChatInput(req.body);
  if (chatValidation.errors.length) return validationError(res, chatValidation.errors);
  const { messages, context } = chatValidation;

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
      serverError(res, 'AI service temporarily unavailable. Please try again.');
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`);
      res.end();
    }
  }
});

// ─── Quick Questions Endpoint (non-streaming, for short answers) ───────────────
app.post('/api/quick', chatLimiter, async (req, res) => {
  const quickValidation = validateQuickInput(req.body);
  if (quickValidation.errors.length) return validationError(res, quickValidation.errors);
  const { question } = quickValidation;

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

    res.json({ answer: response.choices[0].message.content, request_id: req.id || null });
  } catch (err) {
    console.error('Quick API error:', err.message);
    serverError(res, 'Service temporarily unavailable');
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

  res.json({
    request_id: req.id || null,
    suggestions,
  });
});

// Payment provider router: keeps cards, wallets, crypto, and future providers behind one API.
app.get('/api/payments/providers', (req, res) => {
  res.json({
    request_id: req.id || null,
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
      request_id: res.req?.id || null,
    });
  }

  const nonce = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(nonce + apiKey)
    .digest('hex');

  res.json({
    request_id: req.id || null,
    apiKey,
    signature,
    nonce,
    environment: process.env.METAL_PAY_CONNECT_ENV || 'dev',
    networks: ['xpr-network'],
  });
});

app.post('/api/payments/intents', async (req, res) => {
  const paymentIntentValidation = validatePaymentIntentInput(req.body);
  if (paymentIntentValidation.errors.length) return validationError(res, paymentIntentValidation.errors);

  const {
    provider = 'xpr_network',
    currency = 'USD',
    purpose = 'smartcontractor_payment',
    payer_role,
    reference_id,
  } = req.body;
  const { amount, providerConfig } = paymentIntentValidation;

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

    if (intentError) return databaseWriteError(res, intentError);
    intent.database_id = storedIntent.id;

    const { error: eventError } = await supabase.from('payment_events').insert({
      payment_intent_id: storedIntent.id,
      external_intent_id: externalIntentId,
      provider: intent.provider,
      event_type: 'payment_intent_created',
      status: intent.status,
      amount_usd: intent.amount_usd,
      raw_event: intent,
    });
    if (eventError) return databaseWriteError(res, eventError);

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

  res.status(201).json({ payment_intent: intent, request_id: req.id || null });
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
  if (error) return databaseError(res, error);
  res.json({ payment_intents: data, request_id: req.id || null });
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
  if (error) return databaseError(res, error);
  res.json({ payment_events: data, request_id: req.id || null });
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

  if (eventError) return databaseWriteError(res, eventError);

  let updatedIntent = null;
  if (intent?.id && status) {
    const { data, error } = await supabase
      .from('payment_intents')
      .update({ status })
      .eq('id', intent.id)
      .select('id,external_intent_id,provider,status,updated_at')
      .single();
    if (error) return databaseWriteError(res, error);
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

  res.status(202).json({ payment_event: paymentEvent, payment_intent: updatedIntent, request_id: req.id || null });
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
  if (error) return databaseError(res, error);
  res.json({ audit_events: data, request_id: req.id || null });
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

function weekTwoFounderActionBoard() {
  return [
    {
      id: 'week_two_auth_admin_evidence',
      phase: 'auth_admin',
      label: 'Week 2 Auth/Admin evidence intake',
      status: 'blocked',
      owner: 'Founder + Codex-local',
      founder_decision_needed:
        'Founder records Magic Link, profile binding, and admin membership evidence as PASS/FAIL/SKIPPED with safe request IDs only.',
      codex_next_safe_action:
        'Prepare redacted notes and request-trace reports only; stop before service-role use, admin_memberships insert, profile repair, strict RLS, deploy, or live Supabase write.',
      evidence_sources: [
        'docs/smartcontractor-founder-auth-evidence-template.md',
        'docs/smartcontractor-founder-auth-admin-live-decision-packet.md',
      ],
      blocked_live_actions: [
        'magic_link_url_paste',
        'service_role_key_use',
        'admin_memberships_insert',
        'profile_repair_write',
        'strict_rls_apply',
        'live_supabase_write',
        'production_release',
      ],
      no_secret_requested: true,
      no_live_supabase_write_attempted: true,
      no_external_account_change_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_live_finance_action_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'week_two_deployment_public_beta_prep',
      phase: 'deployment_public_beta',
      label: 'Week 2 deployment/public beta prep',
      status: 'blocked',
      owner: 'Founder',
      founder_decision_needed:
        'Founder chooses deploy target, account owner, env owner, rollback owner, and redacted public URL smoke path before any external account or share action.',
      codex_next_safe_action:
        'Keep deploy prep local and refresh only checklists, redacted smoke templates, request IDs, and no-real-money public beta gates.',
      evidence_sources: [
        'docs/smartcontractor-deployment-decision-prep.md',
        'docs/smartcontractor-public-beta-url-smoke-evidence-intake.md',
      ],
      blocked_live_actions: [
        'vercel_import',
        'github_pages_setting_change',
        'dns_change',
        'namecheap_change',
        'supabase_redirect_update',
        'production_env_var_change',
        'public_url_share',
        'tester_invite',
        'production_deploy',
      ],
      no_secret_requested: true,
      no_live_supabase_write_attempted: true,
      no_external_account_change_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_public_url_share_attempted: true,
      no_tester_invite_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'week_two_legal_provider_questions',
      phase: 'legal_provider',
      label: 'Week 2 legal/provider question packet',
      status: 'review',
      owner: 'Founder/legal/provider',
      founder_decision_needed:
        'Founder selects review owners and decides which attorney/provider questions are ready for external review; Codex does not decide legal or provider outcomes.',
      codex_next_safe_action:
        'Consolidate local questions from working-capital, escrow, repayment, stablecoin, token collateral, and XPR review packets without sending them externally.',
      evidence_sources: [
        'docs/whitepaper-v1-3-legal-provider-review-packet.md',
        'docs/smartcontractor-public-beta-deploy-to-invite-handoff.md',
      ],
      blocked_live_actions: [
        'legal_conclusion',
        'provider_commitment',
        'payment_charge',
        'real_loan',
        'real_escrow',
        'repayment_routing',
        'stablecoin_settlement',
        'token_collateral_lock',
        'xpr_signature',
        'production_release',
      ],
      no_external_send_attempted: true,
      no_live_finance_action_attempted: true,
      no_legal_provider_decision_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'week_two_investor_packet_claim_review',
      phase: 'investor_founder_package',
      label: 'Week 2 investor/founder packet claim review',
      status: 'review',
      owner: 'Founder + claim/redaction reviewer',
      founder_decision_needed:
        'Founder chooses Share, Revise, or Hold for the internal packet and keeps external send blocked unless the bounded phrase and non-secret fields are recorded.',
      codex_next_safe_action:
        'Refresh safe metrics, source commit, evidence date, redaction state, blocked claims, and Request Trace IDs before any founder packet draft.',
      evidence_sources: [
        'docs/smartcontractor-investor-founder-package.md',
        'docs/smartcontractor-founder-one-pager.md',
        'docs/smartcontractor-demo-script.md',
      ],
      required_phrase: 'INVESTOR_PACKET_SEND_ACTION_RECORDED',
      blocked_live_actions: [
        'investor_outreach',
        'grant_submission',
        'provider_commitment',
        'legal_conclusion',
        'public_claim_approval',
        'deck_publication',
        'pdf_publication',
        'email_campaign',
        'public_url_share',
        'payment_charge',
        'real_loan',
        'real_escrow',
        'xpr_signature',
        'public_launch',
      ],
      no_external_send_attempted: true,
      no_public_file_edit_attempted: true,
      no_public_url_share_attempted: true,
      no_live_finance_action_attempted: true,
      no_legal_provider_decision_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'week_two_mobile_release_blocker_scan',
      phase: 'mobile_release',
      label: 'Week 2 mobile release blocker scan',
      status: 'review',
      owner: 'Founder + Codex-local',
      founder_decision_needed:
        'Founder decides whether mobile work stays PWA-only, Android review-only, iOS review-only, or app-store-prep hold.',
      codex_next_safe_action:
        'Recheck PWA/mobile install readiness and screenshot/redaction blockers locally without store account, signing, release, payment, or production action.',
      evidence_sources: [
        'docs/smartcontractor-mobile-release-decision-prep.md',
        'docs/smartcontractor-mobile-screenshot-redaction-checklist.md',
      ],
      blocked_live_actions: [
        'app_store_submission',
        'play_console_submission',
        'signing_key_entry',
        'certificate_upload',
        'store_account_change',
        'public_release',
        'payment_charge',
        'real_loan',
        'real_escrow',
        'xpr_signature',
        'production_release',
      ],
      no_secret_requested: true,
      no_external_account_change_attempted: true,
      no_public_release_attempted: true,
      no_live_finance_action_attempted: true,
      no_live_action_attempted: true,
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

function normalizeAgentInputRefs(inputRefs, defaultRefs = ['contractor', 'job', 'loan', 'verification_checks', 'audit_events']) {
  if (!Array.isArray(inputRefs)) {
    return defaultRefs;
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

function buildVerificationTriageRecommendation({ entity_id, input_refs, facts = {} }) {
  const licenseStatus = String(facts.license_status || 'unknown').toLowerCase();
  const insuranceStatus = String(facts.insurance_status || 'unknown').toLowerCase();
  const businessIdentityStatus = String(facts.business_identity_status || 'unknown').toLowerCase();
  const reasons = [];

  if (!['passed', 'verified', 'active'].includes(licenseStatus)) {
    reasons.push('license verification evidence is incomplete');
  }
  if (!['passed', 'verified', 'active'].includes(insuranceStatus)) {
    reasons.push('insurance verification evidence is incomplete');
  }
  if (!['passed', 'verified', 'active'].includes(businessIdentityStatus)) {
    reasons.push('business identity verification evidence is incomplete');
  }
  if (!reasons.length) reasons.push('local-only verification triage packet is ready for human review');

  const recommendation = reasons.length === 1 && reasons[0].includes('ready for human review')
    ? 'manual_review'
    : 'collect_missing_verification_evidence';

  return {
    agent: 'compliance_agent',
    workflow: 'verification_triage',
    version: 'draft-2026-05-15',
    entity_type: 'verification_check',
    entity_id,
    input_refs: normalizeAgentInputRefs(input_refs, ['contractor', 'license', 'insurance', 'business_identity', 'audit_events']),
    recommendation,
    confidence: recommendation === 'manual_review' ? 0.7 : 0.68,
    reasons,
    required_human_review: true,
    blocked_actions: [
      'approve_contractor_verification',
      'override_license_check',
      'activate_provider_account',
      'approve_real_loan',
      'fund_contractor',
      'move_money',
      'legal_decision',
    ],
    audit_event_required: true,
    local_only: true,
    live_action_status: 'BLOCKED_FOR_LIVE',
  };
}

function buildPaymentExceptionReviewRecommendation({ entity_id, input_refs, facts = {} }) {
  const paymentStatus = String(facts.payment_status || 'unknown').toLowerCase();
  const webhookStatus = String(facts.webhook_status || 'unknown').toLowerCase();
  const ledgerStatus = String(facts.ledger_status || 'unknown').toLowerCase();
  const reasons = [];

  if (!['matched', 'captured', 'settled'].includes(paymentStatus)) {
    reasons.push('payment intent status needs reconciliation');
  }
  if (!['verified', 'received', 'matched'].includes(webhookStatus)) {
    reasons.push('provider webhook evidence is incomplete');
  }
  if (!['reconciled', 'balanced', 'matched'].includes(ledgerStatus)) {
    reasons.push('payment ledger reconciliation is incomplete');
  }
  if (!reasons.length) reasons.push('local-only payment exception packet is ready for treasury review');

  const recommendation = reasons.length === 1 && reasons[0].includes('ready for treasury review')
    ? 'treasury_manual_review'
    : 'reconcile_payment_exception';

  return {
    agent: 'treasury_agent',
    workflow: 'payment_exception_review',
    version: 'draft-2026-05-15',
    entity_type: 'payment_exception',
    entity_id,
    input_refs: normalizeAgentInputRefs(input_refs, ['payment_intent', 'payment_event', 'provider_webhook', 'audit_event']),
    recommendation,
    confidence: recommendation === 'treasury_manual_review' ? 0.69 : 0.66,
    reasons,
    required_human_review: true,
    blocked_actions: [
      'issue_refund',
      'release_escrow',
      'change_payout_destination',
      'execute_treasury_action',
      'move_money',
      'approve_real_loan',
      'legal_decision',
    ],
    audit_event_required: true,
    local_only: true,
    live_action_status: 'BLOCKED_FOR_LIVE',
  };
}

function buildDisputeEvidenceSummaryRecommendation({ entity_id, input_refs, facts = {} }) {
  const evidenceStatus = String(facts.evidence_status || 'unknown').toLowerCase();
  const milestoneStatus = String(facts.milestone_status || 'unknown').toLowerCase();
  const peerReviewStatus = String(facts.peer_review_status || 'unknown').toLowerCase();
  const reasons = [];

  if (!['complete', 'documented', 'attached'].includes(evidenceStatus)) {
    reasons.push('dispute evidence metadata is incomplete');
  }
  if (!['documented', 'matched', 'approved'].includes(milestoneStatus)) {
    reasons.push('milestone or scope status needs documentation');
  }
  if (!['available', 'complete', 'scheduled'].includes(peerReviewStatus)) {
    reasons.push('peer review or inspection notes are incomplete');
  }
  if (!reasons.length) reasons.push('local-only dispute evidence packet is ready for human review');

  const recommendation = reasons.length === 1 && reasons[0].includes('ready for human review')
    ? 'dispute_manual_review'
    : 'collect_missing_dispute_evidence';

  return {
    agent: 'dispute_triage_agent',
    workflow: 'dispute_evidence_summary',
    version: 'draft-2026-05-15',
    entity_type: 'dispute',
    entity_id,
    input_refs: normalizeAgentInputRefs(input_refs, ['dispute', 'evidence', 'milestone', 'peer_review', 'audit_event']),
    recommendation,
    confidence: recommendation === 'dispute_manual_review' ? 0.67 : 0.65,
    reasons,
    required_human_review: true,
    blocked_actions: [
      'decide_dispute',
      'release_escrow',
      'issue_refund',
      'assign_final_liability',
      'move_money',
      'legal_decision',
    ],
    audit_event_required: true,
    local_only: true,
    live_action_status: 'BLOCKED_FOR_LIVE',
  };
}

function buildDraftDocumentPacketRecommendation({ entity_id, input_refs, facts = {} }) {
  const contractStatus = String(facts.contract_status || 'unknown').toLowerCase();
  const milestoneStatus = String(facts.milestone_status || 'unknown').toLowerCase();
  const scopeStatus = String(facts.scope_status || 'unknown').toLowerCase();
  const attorneyReviewStatus = String(facts.attorney_review_status || 'unknown').toLowerCase();
  const signatureStatus = String(facts.signature_status || 'unknown').toLowerCase();
  const reasons = [];

  if (!['drafted', 'documented', 'approved_internal'].includes(contractStatus)) {
    reasons.push('project contract draft metadata is incomplete');
  }
  if (!['documented', 'attached', 'matched'].includes(milestoneStatus)) {
    reasons.push('milestone schedule needs documentation');
  }
  if (!['documented', 'attached', 'matched'].includes(scopeStatus)) {
    reasons.push('scope or change-order references need documentation');
  }
  if (!['pending', 'scheduled', 'required', 'complete'].includes(attorneyReviewStatus)) {
    reasons.push('attorney review status must remain explicit');
  }
  if (!['pending', 'not_ready', 'ready_for_review', 'complete'].includes(signatureStatus)) {
    reasons.push('signature readiness status must remain explicit');
  }
  if (!reasons.length) reasons.push('local-only document packet outline is ready for attorney/founder review');

  const recommendation = reasons.length === 1 && reasons[0].includes('ready for attorney/founder review')
    ? 'document_packet_manual_review'
    : 'collect_missing_document_packet_inputs';

  return {
    agent: 'document_generation_agent',
    workflow: 'draft_document_packet',
    version: 'draft-2026-05-15',
    entity_type: 'document_packet',
    entity_id,
    input_refs: normalizeAgentInputRefs(input_refs, ['project_contract', 'milestones', 'scope', 'change_orders', 'attorney_review']),
    recommendation,
    confidence: recommendation === 'document_packet_manual_review' ? 0.66 : 0.64,
    reasons,
    required_human_review: true,
    blocked_actions: [
      'send_legal_document',
      'bind_contract',
      'request_signature',
      'file_lien_waiver',
      'move_money',
      'legal_decision',
    ],
    audit_event_required: true,
    local_only: true,
    live_action_status: 'BLOCKED_FOR_LIVE',
  };
}

function buildJobMatchRankingRecommendation({ entity_id, input_refs, facts = {} }) {
  const jobStatus = String(facts.job_status || 'unknown').toLowerCase();
  const contractorStatus = String(facts.contractor_status || 'unknown').toLowerCase();
  const geoMatchStatus = String(facts.geo_match_status || 'unknown').toLowerCase();
  const licenseMatchStatus = String(facts.license_match_status || 'unknown').toLowerCase();
  const availabilityStatus = String(facts.availability_status || 'unknown').toLowerCase();
  const reasons = [];

  if (!['draft', 'documented', 'ready_for_review'].includes(jobStatus)) {
    reasons.push('job scope/status metadata is incomplete');
  }
  if (!['verified_local', 'documented', 'ready_for_review'].includes(contractorStatus)) {
    reasons.push('contractor profile or verification status is incomplete');
  }
  if (!['matched', 'nearby', 'within_service_area'].includes(geoMatchStatus)) {
    reasons.push('job-to-contractor geography needs confirmation');
  }
  if (!['matched', 'documented', 'not_required'].includes(licenseMatchStatus)) {
    reasons.push('license or trade fit needs confirmation');
  }
  if (!['available', 'tentative', 'scheduled'].includes(availabilityStatus)) {
    reasons.push('contractor availability needs confirmation');
  }
  if (!reasons.length) reasons.push('local-only job match packet is ready for founder/admin review');

  const recommendation = reasons.length === 1 && reasons[0].includes('ready for founder/admin review')
    ? 'job_match_manual_review'
    : 'collect_missing_job_match_inputs';

  return {
    agent: 'contractor_matching_agent',
    workflow: 'job_match_ranking',
    version: 'draft-2026-05-15',
    entity_type: 'job_match',
    entity_id,
    input_refs: normalizeAgentInputRefs(input_refs, ['job', 'contractor', 'license', 'availability', 'audit_event']),
    recommendation,
    confidence: recommendation === 'job_match_manual_review' ? 0.68 : 0.63,
    reasons,
    required_human_review: true,
    blocked_actions: [
      'publish_real_lead',
      'assign_contractor',
      'start_escrow',
      'charge_lead_token',
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
    {
      agent: 'risk_assessment_agent',
      workflow: 'repayment_waterfall_review_packet',
      entity_type: 'repayment_waterfall_review_packet',
      version: 'draft-2026-05-21',
      mode: 'local_structured_review_packet_only',
      required_permission: 'loan_review_prepare',
      required_human_review: true,
      audit_event_required: true,
      local_only: true,
      live_action_status: 'BLOCKED_FOR_LIVE',
      supported_facts: [
        'fixture_count',
        'covered_fixture_states',
        'review_packet_status',
        'deployment_status',
        'pass_fail_status',
        'local_only',
      ],
      required_input_refs: [
        'repayment_waterfall_fixtures',
        'endpoint_smoke',
        'review_packet',
        'external_review_gates',
        'blocked_live_actions',
      ],
      blocked_actions: [
        'approve_real_loan',
        'fund_contractor',
        'route_repayment',
        'release_escrow',
        'settle_stablecoin',
        'lock_token_collateral',
        'provider_api_call',
        'move_money',
        'legal_decision',
      ],
    },
    {
      agent: 'compliance_agent',
      workflow: 'verification_triage',
      entity_type: 'verification_check',
      version: 'draft-2026-05-15',
      mode: 'local_structured_recommendation_only',
      required_permission: 'loan_review_prepare',
      required_human_review: true,
      audit_event_required: true,
      local_only: true,
      live_action_status: 'BLOCKED_FOR_LIVE',
      supported_facts: [
        'license_status',
        'insurance_status',
        'business_identity_status',
      ],
      required_input_refs: ['contractor', 'license', 'insurance', 'business_identity'],
      blocked_actions: [
        'approve_contractor_verification',
        'override_license_check',
        'activate_provider_account',
        'approve_real_loan',
        'fund_contractor',
        'move_money',
        'legal_decision',
      ],
    },
    {
      agent: 'treasury_agent',
      workflow: 'payment_exception_review',
      entity_type: 'payment_exception',
      version: 'draft-2026-05-15',
      mode: 'local_structured_recommendation_only',
      required_permission: 'loan_review_prepare',
      required_human_review: true,
      audit_event_required: true,
      local_only: true,
      live_action_status: 'BLOCKED_FOR_LIVE',
      supported_facts: [
        'payment_status',
        'webhook_status',
        'ledger_status',
      ],
      required_input_refs: ['payment_intent', 'payment_event', 'provider_webhook', 'audit_event'],
      blocked_actions: [
        'issue_refund',
        'release_escrow',
        'change_payout_destination',
        'execute_treasury_action',
        'move_money',
        'approve_real_loan',
        'legal_decision',
      ],
    },
    {
      agent: 'dispute_triage_agent',
      workflow: 'dispute_evidence_summary',
      entity_type: 'dispute',
      version: 'draft-2026-05-15',
      mode: 'local_structured_recommendation_only',
      required_permission: 'loan_review_prepare',
      required_human_review: true,
      audit_event_required: true,
      local_only: true,
      live_action_status: 'BLOCKED_FOR_LIVE',
      supported_facts: [
        'dispute_status',
        'evidence_status',
        'milestone_status',
        'peer_review_status',
      ],
      required_input_refs: ['dispute', 'evidence', 'milestone', 'peer_review'],
      blocked_actions: [
        'decide_dispute',
        'release_escrow',
        'issue_refund',
        'assign_final_liability',
        'move_money',
        'legal_decision',
      ],
    },
    {
      agent: 'document_generation_agent',
      workflow: 'draft_document_packet',
      entity_type: 'document_packet',
      version: 'draft-2026-05-15',
      mode: 'local_structured_recommendation_only',
      required_permission: 'loan_review_prepare',
      required_human_review: true,
      audit_event_required: true,
      local_only: true,
      live_action_status: 'BLOCKED_FOR_LIVE',
      supported_facts: [
        'contract_status',
        'milestone_status',
        'scope_status',
        'attorney_review_status',
        'signature_status',
      ],
      required_input_refs: ['project_contract', 'milestones', 'scope', 'change_orders'],
      blocked_actions: [
        'send_legal_document',
        'bind_contract',
        'request_signature',
        'file_lien_waiver',
        'move_money',
        'legal_decision',
      ],
    },
    {
      agent: 'contractor_matching_agent',
      workflow: 'job_match_ranking',
      entity_type: 'job_match',
      version: 'draft-2026-05-15',
      mode: 'local_structured_recommendation_only',
      required_permission: 'loan_review_prepare',
      required_human_review: true,
      audit_event_required: true,
      local_only: true,
      live_action_status: 'BLOCKED_FOR_LIVE',
      supported_facts: [
        'job_status',
        'contractor_status',
        'geo_match_status',
        'license_match_status',
        'availability_status',
      ],
      required_input_refs: ['job', 'contractor', 'license', 'availability'],
      blocked_actions: [
        'publish_real_lead',
        'assign_contractor',
        'start_escrow',
        'charge_lead_token',
        'move_money',
        'legal_decision',
      ],
    },
  ];
}

app.get('/api/admin/ai-agents/workflows', requireAdminPermissions(['loan_review_prepare']), (req, res) => {
  try {
    if (process.env.SMARTCONTRACTOR_AI_WORKFLOW_CATALOG_ERROR_MODE === 'force') {
      throw new Error('forced local workflow catalog discovery failure');
    }
    res.json({
      request_id: req.id || null,
      generated_at: new Date().toISOString(),
      status: 'local_only',
      supported_workflows: buildAiAgentWorkflowCatalog(),
      safety_boundaries: [
        'AI recommendations are draft support only.',
        'Deterministic rules and humans approve.',
        'No real loan, escrow, repayment, stablecoin, token collateral, money movement, legal, or provider action is enabled.',
      ],
    });
  } catch (error) {
    res.status(503).json(buildAiWorkflowCatalogErrorResponse(req, [
      'workflow catalog could not be loaded from local configuration',
    ]));
  }
});

app.get('/api/admin/contract-backed-loan/repayment-waterfall/review-packet', requireAdminPermissions(['loan_review_prepare']), async (req, res) => {
  try {
    const {
      DEMO_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET,
    } = await import('./src/smart-contracts/replay/repaymentWaterfallDraftEndpointReviewPacket.mjs');

    res.json({
      request_id: req.id || null,
      generated_at: new Date().toISOString(),
      status: 'local_only_review_packet_ready',
      review_packet: DEMO_REPAYMENT_WATERFALL_DRAFT_ENDPOINT_REVIEW_PACKET,
      review_packet_requirements: [
        'HOLD_FOR_FOUNDER_LEGAL_PROVIDER_REVIEW',
        'BLOCKED_FOR_LIVE',
        'PASS_LOCAL_ONLY',
      ],
      safe_scope: [
        'No real repayment routing is approved.',
        'No escrow custody, stablecoin settlement, token collateral lock or liquidation, provider API call, or money movement is enabled.',
        'Founder, legal, provider, finance, and security review are required before any live action.',
      ],
      blocked_next_action: 'FOUNDER_LEGAL_PROVIDER_SECURITY_REVIEW_REQUIRED',
    });
  } catch (error) {
    res.status(503).json({
      error: 'Local repayment waterfall review packet could not be loaded',
      request_id: req.id || null,
      status: 'BLOCKED_FOR_LIVE',
    });
  }
});

app.post('/api/admin/contract-backed-loan/repayment-waterfall/draft', requireAdminPermissions(['loan_review_prepare']), async (req, res) => {
  const draftValidation = validateRepaymentWaterfallDraftEndpointInput(req.body);
  if (draftValidation.errors.length) return validationError(res, draftValidation.errors);

  const actorAllowed = isNonEmptyString(draftValidation.actor_profile_id)
    && repaymentWaterfallDraftActorRoles.includes(draftValidation.actor_role);
  if (!actorAllowed) {
    return res.status(403).json(buildRepaymentWaterfallDraftEndpointHold(
      req,
      draftValidation,
      'HOLD_FOR_AUTH_RLS_REVIEW',
      'founder/admin reviewer identity or role requires local Auth/RLS review',
    ));
  }

  const calculationInput = {
    ...draftValidation.calculation_input,
    request_id: draftValidation.request_id,
    blocked_live_gate_status: 'BLOCKED_FOR_LIVE',
    audit_event: {
      ...(draftValidation.calculation_input.audit_event || {}),
      request_id: draftValidation.request_id,
      actor_profile_id: draftValidation.actor_profile_id,
      actor_role: draftValidation.actor_role,
    },
  };
  const inputHash = localSha256(calculationInput);

  if (draftValidation.replayed_input_hash && draftValidation.replayed_input_hash !== inputHash) {
    return res.status(409).json(buildRepaymentWaterfallDraftEndpointHold(
      req,
      { ...draftValidation, route_input_hash: inputHash },
      'HOLD_FOR_IDEMPOTENCY_REVIEW',
      'idempotency key replayed with a changed local input hash',
    ));
  }

  try {
    const { calculateDraftRepaymentWaterfall } = await import('./src/smart-contracts/state/repaymentWaterfallDraft.mjs');
    const draftResult = calculateDraftRepaymentWaterfall(calculationInput);
    const responseBody = buildRepaymentWaterfallDraftEndpointResponse(req, draftValidation, draftResult, inputHash);
    res.status(draftResult.fixture_state === 'DRAFT_REPAYMENT_ALLOCATION' ? 201 : 200).json(responseBody);
  } catch (error) {
    validationError(res, 'request must not contain secret-looking values or live payment instructions');
  }
});

app.post('/api/admin/ai-agents/recommendations', requireAdminPermissions(['loan_review_prepare']), async (req, res) => {
  const aiRecommendationValidation = validateAiAgentRecommendationInput(req.body);
  if (aiRecommendationValidation.errors.length) return aiRecommendationValidationError(res, aiRecommendationValidation.errors);
  const { workflow, entity_id, input_refs, facts } = aiRecommendationValidation;

  const recommendationBuilders = {
    starter_loan_review: buildStarterLoanReviewRecommendation,
    verification_triage: buildVerificationTriageRecommendation,
    payment_exception_review: buildPaymentExceptionReviewRecommendation,
    dispute_evidence_summary: buildDisputeEvidenceSummaryRecommendation,
    draft_document_packet: buildDraftDocumentPacketRecommendation,
    job_match_ranking: buildJobMatchRankingRecommendation,
  };
  const recommendationBuilder = recommendationBuilders[workflow] || buildStarterLoanReviewRecommendation;
  const recommendation = recommendationBuilder({
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
    request_id: req.id || null,
    generated_at: new Date().toISOString(),
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
    request_id: req.id || null,
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
    request_id: req.id || null,
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
  const evidenceChecklist = [
    readinessItem(
      'install_prompt_check',
      'Install prompt check',
      'review',
      'Record local Chrome/Edge install prompt or Add to Home Screen behavior with browser, device, OS, viewport, and date before native wrapper testing.',
      'founder'
    ),
    readinessItem(
      'offline_shell_check',
      'Offline shell check',
      'review',
      'Capture a local offline fallback screenshot or browser devtools offline test showing the SmartContractor shell returns safely without API data.',
      'founder'
    ),
    readinessItem(
      'service_worker_api_boundary_check',
      'Service worker API boundary check',
      serviceWorker.includes("requestUrl.pathname.startsWith('/api/')") ? 'ready' : 'blocked',
      'Confirm service-worker.js keeps /api/ requests network-only so Auth, payments, disputes, loans, admin, and token-collateral data are not cached.',
      'codex'
    ),
    readinessItem(
      'mobile_viewport_screenshot_check',
      'Mobile viewport screenshot check',
      'review',
      'Capture 390px and 430px local SmartContractor screenshots with request IDs and private values redacted before founder mobile QA.',
      'founder'
    ),
    readinessItem(
      'no_store_submission_or_real_money_release',
      'No store or real-money release',
      'blocked',
      'Do not submit to App Store, Play Console, public deployment, real payments, real loans, escrow release, stablecoin settlement, token collateral, or XPR signature flow from this local readiness endpoint.',
      'founder'
    ),
  ];
  const releaseGate = {
    local_pwa_demo: checks.every((check) => check.status === 'ready') ? 'ready' : 'review',
    native_wrapper_testing: 'review',
    app_store_submission: 'blocked',
    play_console_submission: 'blocked',
    real_money_mobile_release: 'blocked',
    reason: 'Mobile install evidence is local-review only. Store submission, production release, payments, loans, escrow, stablecoin settlement, token collateral, and XPR signatures require founder approval plus external account/legal/provider/security review.',
  };
  res.json({
    request_id: req.id || null,
    status: checks.every((check) => check.status === 'ready') ? 'ready' : 'review',
    mode: 'mobile_install_readiness',
    app: {
      name: manifest?.name || 'SmartContractor',
      id: manifest?.id || null,
      start_url: manifest?.start_url || null,
      display: manifest?.display || null,
      orientation: manifest?.orientation || null,
    },
    files,
    checks,
    evidence_checklist: evidenceChecklist,
    release_gate: releaseGate,
    safe_report_fields: {
      local_pwa_demo: 'PASS/FAIL',
      install_prompt_check: 'PASS/FAIL/SKIPPED',
      offline_shell_check: 'PASS/FAIL/SKIPPED',
      service_worker_api_boundary_check: 'PASS/FAIL',
      mobile_viewport_screenshot_check: 'PASS/FAIL/SKIPPED',
      request_id: 'safe request ID only',
    },
    validation_commands: [
      'npm run check:smartcontractor',
      'npm run check:mobile-install-readiness',
      'npm run check:pwa-qa',
    ],
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
    ['beta_evidence_checklist', 'smartcontractor-beta-evidence-checklist.md'],
    ['beta_tester_followup', 'smartcontractor-beta-tester-followup.md'],
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
      'Controlled beta requires test plan, invite, issue log, feedback synthesis, session runbook, session summary, decision log, triage rubric, issue lifecycle, go/no-go scorecard, evidence checklist, tester follow-up, handoff, founder action queue, auth evidence, admin smoke, and legal review docs.'
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
      'smart_contract_product_surfaces_demo_only',
      'Smart contract product surfaces demo-only',
      'ready',
      'Controlled beta may show gcscworkcap1, gcscclaim111, gcsccredit11, and gcscadvance1 only as demo status cards; live smart contract deployment, ClaimBridge advance funding, contract-backed working-capital funding, escrow-backed advance payout, repayment routing, and token custody stay blocked.'
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
    'Automatic NO-GO: gcscworkcap1, gcscclaim111, gcsccredit11, or gcscadvance1 is interpreted as live or implies ClaimBridge funding, working-capital funding, escrow-backed advance payout, repayment routing, token custody, or live smart contract deployment.',
    'Automatic NO-GO: tester reports include secrets, passwords, database URLs, service-role keys, private IDs, card data, or bank data.',
  ];
  const testerDayChecklist = [
    'Open SmartContractor local demo and confirm the Admin workspace loads.',
    'Run npm run check and record only PASS/FAIL.',
    'Use the 5-minute demo script for homeowner, contractor, dispute, peer review, and admin review flows.',
    'Review gcscworkcap1, gcscclaim111, gcsccredit11, and gcscadvance1 only as demo-only smart contract product surfaces.',
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
    smart_contract_product_surface: 'required when issue touches gcscworkcap1, gcscclaim111, gcsccredit11, or gcscadvance1',
    live_risk_category: 'required when issue touches loans, escrow, payments, Auth, RLS, legal, token collateral, live deployment, ClaimBridge, working capital, advance payout, repayment routing, or token custody',
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
    'Stop the session if gcscworkcap1, gcscclaim111, gcsccredit11, or gcscadvance1 is treated as live deployment, ClaimBridge funding, working-capital funding, escrow-backed advance payout, repayment routing, or token custody.',
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
    'Tester understands gcscworkcap1, gcscclaim111, gcsccredit11, and gcscadvance1 are demo-only and do not deploy contracts, fund ClaimBridge, fund working capital, pay advances, route repayments, or custody tokens.',
    'Tester agrees that screenshots or recordings must be redacted before they are shared outside founder/admin review.',
  ];
  const traditionalFirstPublicCopyGate = [
    {
      id: 'traditional_first_public_default',
      label: 'Traditional-first public default',
      copy_state: 'TRADITIONAL_FIRST_PUBLIC_SAFE',
      safe_public_positioning: [
        'SmartContractor is a construction trust platform for contractor matching, project records, milestone evidence, dispute readiness, and admin review.',
        'Public beta copy should describe demo-only workflow review, not blockchain settlement, token value, DeFi, or live lending.',
      ],
      internal_only_terms_until_review: ['blockchain', 'smart contract', 'token', 'XPR', 'stablecoin', 'Metal', 'FIO', 'Web3', 'DeFi', 'DAO', 'LOAN integration'],
      blocked_public_claims: ['live blockchain service', 'licensed lending provider', 'approved escrow provider', 'stablecoin settlement', 'token collateral', 'provider partnership', 'legal compliance approval', 'production launch'],
      next_safe_action: 'Use traditional construction trust wording in public beta and keep Web3/blockchain language internal or founder-review-only.',
      review_source: 'docs/whitepaper-v1-3-traditional-first-web3-ready-appendix.md',
      no_public_website_edit_attempted: true,
      no_external_provider_claim_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'future_web3_integration_port',
      label: 'Future Web3 integration port',
      copy_state: 'FUTURE_PROVIDER_REVIEW_ONLY',
      safe_public_positioning: [
        'The product can preserve future integration ports for regulated infrastructure after laws, providers, licensing, technical review, and founder approval are clear.',
        'Future Metallicus/LOAN-style, XPR, FIO, stablecoin, token collateral, custody, or smart-contract language must stay non-public or review-only until approved.',
      ],
      internal_only_terms_until_review: ['Metallicus/LOAN-style path', 'XPR Network', 'FIO registration', 'stablecoin rails', 'token collateral lock', 'smart contract execution', 'custody provider'],
      blocked_public_claims: ['Metallicus partnership approved', 'LOAN integration live', 'XPR settlement live', 'FIO registration live', 'stablecoin payment approved', 'token collateral product available', 'custody provider selected'],
      next_safe_action: 'Keep future integration wording as internal architecture until founder/legal/provider approval gates are complete.',
      review_source: 'docs/whitepaper-v1-3-legal-provider-review-packet.md',
      no_public_website_edit_attempted: true,
      no_external_provider_claim_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'public_copy_review_before_publish',
      label: 'Public copy review before publish',
      copy_state: 'FOUNDER_REVIEW_REQUIRED',
      safe_public_positioning: [
        'Before any public website, invite, deck, or packet update, compare wording against the traditional-first appendix, claim risk register, and publication gate.',
        'Autonomous Codex may prepare local draft wording and validators, but cannot publish or replace public pages.',
      ],
      internal_only_terms_until_review: ['real loan', 'escrow release', 'XPR signature', 'provider commitment', 'legal approval', 'public launch approval', 'production release'],
      blocked_public_claims: ['real-money pilot approved', 'public beta approved', 'legal review complete', 'provider onboarding complete', 'production payment setup complete'],
      next_safe_action: 'Route public copy changes to founder review and keep whitepaper.html and index.html unchanged until explicit approval.',
      review_source: 'docs/whitepaper-v1-3-publication-gate.md',
      no_public_website_edit_attempted: true,
      no_external_provider_claim_attempted: true,
      no_live_action_attempted: true,
    },
  ];
  const homepagePublicationSequenceGate = [
    {
      id: 'homepage_copy_direction_gate',
      label: 'Homepage copy direction gate',
      gate_state: 'COPY_DIRECTION_REVIEW_ONLY',
      required_decision: 'APPROVE_COPY_DIRECTION_ONLY or REQUEST_REVISIONS',
      required_evidence: [
        'docs/smartcontractor-public-homepage-founder-review-draft-2026-06-03.md',
        'docs/smartcontractor-public-homepage-publication-readiness-2026-06-03.md',
      ],
      next_safe_action: 'Review or revise local homepage copy only; do not replace public index.html or publish from copy-direction approval.',
      blocked_live_actions: ['public_homepage_replacement', 'public_whitepaper_replacement', 'deploy_setting_change', 'public_url_share', 'tester_invite', 'live_finance_action'],
      evidence_source: 'docs/smartcontractor-public-homepage-founder-decision-packet-2026-06-03.md',
      no_public_homepage_edit_attempted: true,
      no_public_whitepaper_edit_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_public_url_share_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'homepage_publication_go_gate',
      label: 'Homepage publication GO gate',
      gate_state: 'PUBLICATION_NO_GO',
      required_decision: 'Standalone PUBLICATION_GO after evidence is complete',
      required_evidence: [
        'desktop/mobile/click visual QA evidence',
        'final claim-risk scan',
        'Tailwind/Google Fonts asset decision',
        'archive/rollback owner and path',
      ],
      next_safe_action: 'Keep public homepage replacement blocked until final evidence and standalone PUBLICATION_GO exist.',
      blocked_live_actions: ['public_homepage_replacement', 'public_whitepaper_replacement', 'pdf_publication', 'deck_publication', 'social_post', 'email_campaign', 'provider_claim'],
      evidence_source: 'docs/smartcontractor-public-homepage-publication-readiness-2026-06-03.md',
      no_public_homepage_edit_attempted: true,
      no_public_whitepaper_edit_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_public_url_share_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'homepage_public_file_replacement_gate',
      label: 'Homepage public file replacement gate',
      gate_state: 'NO_PUBLIC_FILE_EDIT',
      required_decision: 'PUBLICATION_GO plus exact-file replacement package',
      required_evidence: [
        'docs/smartcontractor-public-homepage-dry-run-replacement-diff-package-2026-06-03.md',
        'final exact diff from index.html to approved candidate',
        'rollback instructions that do not use destructive reset',
      ],
      next_safe_action: 'Prepare only the future exact-file package after approval; keep current public index.html and whitepaper.html unchanged now.',
      blocked_live_actions: ['index_html_edit', 'whitepaper_html_edit', 'git_pages_publish', 'vercel_publish', 'dns_change', 'production_release'],
      evidence_source: 'docs/smartcontractor-public-homepage-dry-run-replacement-diff-package-2026-06-03.md',
      no_public_homepage_edit_attempted: true,
      no_public_whitepaper_edit_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_public_url_share_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'homepage_deploy_share_separation_gate',
      label: 'Homepage deploy and share separation gate',
      gate_state: 'DEPLOYMENT_AND_SHARE_SEPARATE',
      required_decision: 'DEPLOYMENT_EXTERNAL_ACTION_RECORDED, URL smoke evidence, then separate invite/share approval',
      required_evidence: [
        'docs/smartcontractor-public-homepage-deploy-sequencing-2026-06-03.md',
        'docs/smartcontractor-deployment-decision-prep.md',
        'docs/smartcontractor-public-beta-deploy-to-invite-handoff.md',
      ],
      next_safe_action: 'Treat deployment setup, URL smoke, and invite/share as separate founder-controlled gates after homepage publication review.',
      blocked_live_actions: ['vercel_import', 'github_pages_setting_change', 'dns_change', 'supabase_redirect_change', 'public_url_share', 'tester_invite', 'public_launch', 'real_payment', 'real_loan', 'escrow_release', 'stablecoin_settlement', 'token_collateral_lock'],
      evidence_source: 'docs/smartcontractor-public-homepage-deploy-sequencing-2026-06-03.md',
      no_public_homepage_edit_attempted: true,
      no_public_whitepaper_edit_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_public_url_share_attempted: true,
      no_live_action_attempted: true,
    },
  ];
  const homepagePublicationReviewPacket = {
    id: 'homepage_publication_review_packet',
    label: 'Homepage publication review packet',
    packet_state: 'LOCAL_REVIEW_ONLY',
    founder_question: 'Approve copy direction, request revisions, or keep publication blocked before any public homepage replacement.',
    safe_public_promise:
      'Construction trust infrastructure for verified project records, milestone evidence, contractor reputation, and provider-ready working-capital review.',
    required_decisions: [
      'APPROVE_COPY_DIRECTION_ONLY or REQUEST_REVISIONS for local homepage copy.',
      'Standalone PUBLICATION_GO before any public index.html replacement.',
      'Exact-file replacement package review before touching public files.',
      'Founder-controlled deploy setup and URL smoke evidence before public URL sharing.',
      'Separate invite/share approval before tester invitations or public announcement.',
    ],
    required_evidence_sources: [
      'docs/smartcontractor-public-site-end-of-week-plan-2026-06-03.md',
      'docs/smartcontractor-public-homepage-founder-decision-packet-2026-06-03.md',
      'docs/smartcontractor-public-homepage-publication-readiness-2026-06-03.md',
      'docs/smartcontractor-public-homepage-dry-run-replacement-diff-package-2026-06-03.md',
      'docs/smartcontractor-public-homepage-deploy-sequencing-2026-06-03.md',
    ],
    blocked_public_claims: [
      'live blockchain service',
      'instant loan approval',
      'GCSC escrow custody',
      'stablecoin settlement live',
      'token collateral product available',
      'Metallicus/LOAN partnership approved',
      'legal/provider review complete',
      'production release approved',
    ],
    blocked_live_actions: [
      'public_homepage_replacement',
      'public_whitepaper_edit',
      'github_pages_change',
      'vercel_import',
      'dns_change',
      'supabase_redirect_change',
      'public_url_share',
      'tester_invite',
      'real_payment',
      'real_loan',
      'real_escrow',
      'stablecoin_settlement',
      'token_collateral',
      'provider_commitment',
      'legal_decision',
      'production_release',
    ],
    no_public_homepage_edit_attempted: true,
    no_public_whitepaper_edit_attempted: true,
    no_deploy_setting_change_attempted: true,
    no_public_url_share_attempted: true,
    no_live_action_attempted: true,
  };
  const homepagePublicationFounderDecisionScript = [
    {
      id: 'approve_traditional_first_homepage_direction',
      label: 'Approve traditional-first homepage direction',
      decision_state: 'READY_FOR_FOUNDER_REVIEW',
      exact_phrase: 'APPROVE_TRADITIONAL_FIRST_HOMEPAGE_DIRECTION',
      what_it_allows: [
        'Continue final local homepage prep around construction records, milestone evidence, disputes, reputation, request IDs, and provider-ready review.',
        'Keep blockchain/Web3/provider-specific wording hidden from public homepage copy unless later reviewed and approved.',
      ],
      what_it_does_not_allow: [
        'No public index.html replacement.',
        'No public whitepaper replacement.',
        'No deployment setup, public URL sharing, tester invite, public launch, or live finance action.',
      ],
      required_before_next_step: 'Use before final local copy lock; still requires asset policy, final claim scan, rollback review, and standalone PUBLICATION_GO.',
      source_docs: [
        'docs/smartcontractor-homepage-founder-ready-decision-summary-2026-06-03.md',
        'docs/smartcontractor-public-homepage-founder-decision-packet-2026-06-03.md',
      ],
      no_public_homepage_edit_attempted: true,
      no_public_whitepaper_edit_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_public_url_share_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'approve_hidden_future_infrastructure_language',
      label: 'Approve hidden future-infrastructure language',
      decision_state: 'READY_FOR_FOUNDER_REVIEW',
      exact_phrase: 'APPROVE_HIDDEN_FUTURE_INFRASTRUCTURE_LANGUAGE',
      what_it_allows: [
        'Keep future infrastructure wording generic, private, provider-reviewed, and legal-review-required in public-facing homepage copy.',
        'Preserve internal plug-in architecture for future regulated providers without making public partnership or live-product claims.',
      ],
      what_it_does_not_allow: [
        'No public blockchain, Web3, token, XPR, FIO, stablecoin, loan, escrow, collateral, Metallicus, or LOAN-style claim.',
        'No provider commitment, legal conclusion, wallet signature, external infrastructure action, or production release.',
      ],
      required_before_next_step: 'Use before any final public-copy scan; do not treat it as provider/legal approval.',
      source_docs: [
        'docs/whitepaper-v1-3-traditional-first-web3-ready-appendix.md',
        'docs/smartcontractor-public-site-end-of-week-plan-2026-06-03.md',
      ],
      no_public_homepage_edit_attempted: true,
      no_public_whitepaper_edit_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_public_url_share_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'accept_local_browser_qa_evidence',
      label: 'Accept local browser QA evidence',
      decision_state: 'LOCAL_EVIDENCE_READY_FOR_REVIEW',
      exact_phrase: 'ACCEPT_LOCAL_BROWSER_QA_EVIDENCE',
      what_it_allows: [
        'Use the captured local browser session as internal draft-readiness evidence.',
        'Continue toward final public-file QA planning after any approved copy or asset-policy change.',
      ],
      what_it_does_not_allow: [
        'No public publication approval.',
        'No replacement of index.html, deploy settings change, public URL share, tester invite, or live action.',
      ],
      required_before_next_step: 'Use only for draft evidence acceptance; final public replacement still needs final-file QA after PUBLICATION_GO.',
      source_docs: ['docs/smartcontractor-public-homepage-browser-qa-evidence-status-2026-06-03.md'],
      no_public_homepage_edit_attempted: true,
      no_public_whitepaper_edit_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_public_url_share_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'choose_public_asset_policy',
      label: 'Choose public asset policy',
      decision_state: 'FOUNDER_ASSET_POLICY_PENDING',
      exact_phrase: 'ALLOW_TAILWIND_CDN_FOR_DRAFT_ONLY + REQUIRE_COMPILED_PUBLIC_CSS + REQUIRE_SYSTEM_OR_SELF_HOSTED_FONTS + KEEP_AOS_OFF_HOMEPAGE_DRAFT',
      what_it_allows: [
        'Set the preferred CSS/font direction before public homepage replacement.',
        'Allow future local-only CSS preparation after a scoped implementation decision.',
      ],
      what_it_does_not_allow: [
        'No dependency installation, public index.html edit, deploy setup, external account change, or public URL share by itself.',
        'No production asset policy is final until founder confirms the exact phrase.',
      ],
      required_before_next_step: 'Required before PUBLICATION_GO if the replacement homepage must avoid Tailwind CDN or external font dependencies.',
      source_docs: ['docs/smartcontractor-public-homepage-asset-decision-packet-2026-06-03.md'],
      no_public_homepage_edit_attempted: true,
      no_public_whitepaper_edit_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_public_url_share_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'keep_public_replacement_on_hold',
      label: 'Keep public replacement on hold',
      decision_state: 'SAFE_HOLD_AVAILABLE',
      exact_phrase: 'KEEP_PUBLIC_REPLACEMENT_ON_HOLD',
      what_it_allows: [
        'Continue internal prep, local QA, documentation, and Admin readiness work without public replacement.',
        'Avoid accidental publication while founder reviews copy, assets, rollback, and deployment sequencing.',
      ],
      what_it_does_not_allow: [
        'No public homepage replacement, public whitepaper edit, deploy setting change, URL share, tester invite, or live action.',
      ],
      required_before_next_step: 'Use when founder wants more review time or wants CSS/publication prep to stay local.',
      source_docs: [
        'docs/smartcontractor-homepage-founder-ready-decision-summary-2026-06-03.md',
        'docs/smartcontractor-public-homepage-deploy-sequencing-2026-06-03.md',
      ],
      no_public_homepage_edit_attempted: true,
      no_public_whitepaper_edit_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_public_url_share_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'standalone_publication_go',
      label: 'Standalone publication GO',
      decision_state: 'BLOCKED_UNTIL_COMPLETE_EVIDENCE_AND_FOUNDER',
      exact_phrase: 'PUBLICATION_GO',
      what_it_allows: [
        'Only after all evidence is complete, prepare and execute the exact approved public index.html replacement package.',
        'Run final public-file diff, rollback archive, public-file QA, and scoped commit checks.',
      ],
      what_it_does_not_allow: [
        'No Vercel/GitHub Pages/DNS/Supabase external setup.',
        'No public URL share, tester invite, public beta launch, real finance, provider commitment, legal conclusion, or production release.',
      ],
      required_before_next_step: 'Must be standalone and explicit; do not infer it from copy approval, asset approval, browser QA acceptance, or deploy discussion.',
      source_docs: [
        'docs/smartcontractor-public-homepage-publication-readiness-2026-06-03.md',
        'docs/smartcontractor-public-homepage-rollback-packet-2026-06-03.md',
        'docs/smartcontractor-public-homepage-deploy-sequencing-2026-06-03.md',
      ],
      no_public_homepage_edit_attempted: true,
      no_public_whitepaper_edit_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_public_url_share_attempted: true,
      no_live_action_attempted: true,
    },
  ];
  const homepagePublicationEvidenceChecklist = [
    {
      id: 'homepage_visual_qa_evidence',
      label: 'Desktop/mobile/click visual QA evidence',
      evidence_state: 'PASS_BROWSER_SESSION_LOCAL_ONLY',
      required_before: 'PUBLICATION_GO',
      required_evidence: [
        'desktop screenshot evidence for index-v1-3-draft.html',
        'mobile screenshot evidence for index-v1-3-draft.html',
        'CTA and anchor click results',
        'text overlap and first-viewport inspection notes',
      ],
      current_blocker: 'Local browser QA is captured for the draft only; public replacement still needs standalone PUBLICATION_GO and final public-file QA after any approved copy or CSS change.',
      next_safe_action: 'Use the working local URL for founder review, then keep public replacement blocked until standalone PUBLICATION_GO and final public-file QA exist.',
      evidence_source: 'docs/smartcontractor-public-homepage-browser-qa-evidence-status-2026-06-03.md',
      no_public_homepage_edit_attempted: true,
      no_public_whitepaper_edit_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_public_url_share_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'homepage_final_claim_risk_scan',
      label: 'Final homepage claim-risk scan',
      evidence_state: 'REVIEW_REQUIRED',
      required_before: 'PUBLICATION_GO',
      required_evidence: [
        'approved final candidate scan',
        'blocked blockchain/Web3/token/loan/escrow/provider claims review',
        'traditional-first public promise confirmation',
      ],
      current_blocker: 'The local draft has a claim-risk scan, but the final approved candidate must be scanned again after any copy change.',
      next_safe_action: 'Re-scan the exact approved local candidate against claim-risk rules before any public replacement.',
      evidence_source: 'docs/smartcontractor-public-homepage-claim-risk-scan-2026-06-03.md',
      no_public_homepage_edit_attempted: true,
      no_public_whitepaper_edit_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_public_url_share_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'homepage_integration_port_state_guard',
      label: 'Integration port state guard',
      evidence_state: 'PASS_STATIC_GUARD_LOCAL_ONLY',
      required_before: 'PUBLICATION_GO',
      required_evidence: [
        'Integration Readiness Ports section in index-v1-3-static-draft.html',
        'contractor profile, project contract, milestone evidence, working-capital readiness, repayment context, dispute evidence, request-id/audit, and public wording ports',
        'traditional_only, provider_ready, and future_review_required state pills',
        'integration_port_state_guard pass in /api/admin/homepage-publication-final-qa-preflight',
      ],
      current_blocker: 'Integration ports are preserved in the local static candidate only; public replacement still needs standalone PUBLICATION_GO and final public-file QA.',
      next_safe_action: 'Keep plug-in ports visible as local readiness architecture while public files, deploy settings, URL sharing, tester invites, and live finance remain blocked.',
      evidence_source: 'docs/smartcontractor-public-homepage-static-asset-draft-2026-06-03.md',
      no_public_homepage_edit_attempted: true,
      no_public_whitepaper_edit_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_public_url_share_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'homepage_first_viewport_evidence_rail_guard',
      label: 'First-viewport evidence rail guard',
      evidence_state: 'PASS_BROWSER_SESSION_LOCAL_ONLY',
      required_before: 'PUBLICATION_GO',
      required_evidence: [
        'Homepage Evidence Rail in index-v1-3-static-draft.html',
        'Project intake, Milestone evidence, Dispute packet, and Provider review data visible in the first viewport',
        'desktop 1280 x 720 Browser evidence',
        'mobile 390 x 844 Browser evidence',
        'first_viewport_product_signal_guard pass in /api/admin/homepage-publication-final-qa-preflight',
      ],
      current_blocker: 'Evidence rail is visible in the local static candidate only; public replacement still needs standalone PUBLICATION_GO, final public-file QA, and no deploy/share/live action.',
      next_safe_action: 'Keep Homepage Evidence Rail visible in local founder review and rerun desktop/mobile Browser QA after any first-viewport layout change.',
      evidence_source: 'docs/smartcontractor-public-homepage-browser-qa-evidence-status-2026-06-03.md',
      no_public_homepage_edit_attempted: true,
      no_public_whitepaper_edit_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_public_url_share_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'homepage_browser_viewport_evidence_guard',
      label: 'Required Browser viewport evidence guard',
      evidence_state: 'PASS_BROWSER_SESSION_LOCAL_ONLY',
      required_before: 'PUBLICATION_GO',
      required_evidence: [
        'required_browser_viewports exposed by /api/admin/homepage-publication-final-qa-preflight',
        'desktop_first_viewport_hero_fit: 1280 x 720',
        'mobile_first_viewport_hero_fit: 390 x 844',
        'browser_viewport_evidence_guard review row in /api/admin/homepage-publication-final-qa-preflight',
      ],
      current_blocker: 'Required viewport evidence is captured for the local static candidate only; any hero, CTA, first-viewport, or evidence-rail edit must rerun Browser QA before standalone PUBLICATION_GO.',
      next_safe_action: 'Keep the 1280 x 720 and 390 x 844 viewport requirements visible in Admin readiness and rerun local Browser QA before any public replacement package.',
      evidence_source: 'docs/smartcontractor-public-homepage-browser-qa-evidence-status-2026-06-03.md',
      no_public_homepage_edit_attempted: true,
      no_public_whitepaper_edit_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_public_url_share_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'homepage_external_asset_decision',
      label: 'External asset and font decision',
      evidence_state: 'ASSET_PACKET_PREPARED_FOUNDER_PENDING',
      required_before: 'PUBLICATION_GO',
      required_evidence: [
        'asset decision packet with Tailwind CDN, Google Fonts, and AOS inventory',
        'Tailwind CDN decision',
        'Google Fonts decision',
        'fallback/static asset plan',
        'public performance and privacy review note',
      ],
      current_blocker: 'The asset decision packet is prepared, but the founder still must choose the public CSS/font posture before publication.',
      next_safe_action: 'Review ALLOW_TAILWIND_CDN_FOR_DRAFT_ONLY, REQUIRE_COMPILED_PUBLIC_CSS, REQUIRE_SYSTEM_OR_SELF_HOSTED_FONTS, and KEEP_AOS_OFF_HOMEPAGE_DRAFT before PUBLICATION_GO.',
      evidence_source: 'docs/smartcontractor-public-homepage-asset-decision-packet-2026-06-03.md',
      no_public_homepage_edit_attempted: true,
      no_public_whitepaper_edit_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_public_url_share_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'homepage_archive_rollback_path',
      label: 'Archive and rollback path',
      evidence_state: 'ROLLBACK_PACKET_PREPARED_FOUNDER_PENDING',
      required_before: 'PUBLICATION_GO',
      required_evidence: [
        'current public index.html archive path',
        'approved replacement file path',
        'non-destructive rollback instructions',
        'proposed archive path docs/public-homepage-archives/index-pre-v1-3-publication-go-2026-06-03.html',
        'rollback owner and timestamp plan',
      ],
      current_blocker: 'Rollback packet exists, but archive copying and public replacement must not run until standalone PUBLICATION_GO.',
      next_safe_action: 'Review the rollback packet, confirm archive date/owner, and do not execute archive or replacement commands yet.',
      evidence_source: 'docs/smartcontractor-public-homepage-rollback-packet-2026-06-03.md',
      no_public_homepage_edit_attempted: true,
      no_public_whitepaper_edit_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_public_url_share_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'homepage_exact_file_replacement_diff',
      label: 'Exact-file replacement diff',
      evidence_state: 'DRY_RUN_DIFF_PREPARED_FINAL_APPROVAL_PENDING',
      required_before: 'PUBLICATION_GO',
      required_evidence: [
        'dry-run replacement diff package',
        'final exact diff from current public index.html to approved candidate',
        'public whitepaper unchanged evidence',
      ],
      current_blocker: 'Dry-run diff exists, but the final exact replacement diff must be rerun after final candidate approval.',
      next_safe_action: 'Keep exact-file replacement as a future package only until standalone PUBLICATION_GO exists.',
      evidence_source: 'docs/smartcontractor-public-homepage-dry-run-replacement-diff-package-2026-06-03.md',
      no_public_homepage_edit_attempted: true,
      no_public_whitepaper_edit_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_public_url_share_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'homepage_deploy_url_smoke_evidence',
      label: 'Deploy and URL smoke evidence',
      evidence_state: 'BLOCKED_EXTERNAL_ACTION',
      required_before: 'PUBLIC_URL_SHARE',
      required_evidence: [
        'founder-controlled deploy setup record',
        'safe public URL smoke evidence',
        'Supabase redirect/domain decision record if applicable',
        'separate no-real-money public beta boundary',
      ],
      current_blocker: 'Deploy setup, public URL smoke, DNS/Vercel/GitHub Pages, and Supabase redirect changes require founder-controlled external actions.',
      next_safe_action: 'Prepare local evidence fields only; do not change external deploy settings or share a public URL.',
      evidence_source: 'docs/smartcontractor-public-homepage-deploy-sequencing-2026-06-03.md',
      no_public_homepage_edit_attempted: true,
      no_public_whitepaper_edit_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_public_url_share_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'homepage_invite_share_separation',
      label: 'Invite/share separation evidence',
      evidence_state: 'BLOCKED_FOUNDER_DECISION',
      required_before: 'TESTER_INVITE_OR_PUBLIC_SHARE',
      required_evidence: [
        'separate invite/share approval',
        'safe tester copy approval',
        'no-real-money public beta boundary',
        'support/issue intake readiness',
      ],
      current_blocker: 'Public URL sharing and tester invites remain separate founder decisions after publication/deploy smoke.',
      next_safe_action: 'Keep invite/share blocked until publication evidence, URL smoke, and separate founder approval are complete.',
      evidence_source: 'docs/smartcontractor-public-beta-deploy-to-invite-handoff.md',
      no_public_homepage_edit_attempted: true,
      no_public_whitepaper_edit_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_public_url_share_attempted: true,
      no_live_action_attempted: true,
    },
  ];
  const homepageStaticAssetCandidate = [
    {
      id: 'homepage_static_asset_candidate',
      label: 'Homepage static asset candidate',
      candidate_state: 'STATIC_CANDIDATE_READY_LOCAL_ONLY',
      source_file: 'index-v1-3-static-draft.html',
      validator: 'npm --prefix construction-ai run check:homepage-v1-3-static-draft',
      evidence_source: 'docs/smartcontractor-public-homepage-static-asset-draft-2026-06-03.md',
      asset_posture: [
        'hand-authored static CSS',
        'system fonts only',
        'no_tailwind_cdn',
        'no_google_fonts',
        'no_aos',
        'no_external_asset_urls',
      ],
      browser_evidence: [
        'desktop local Browser QA passed at 1280 x 720',
        'mobile local Browser QA passed at 390 x 844',
        'CTA click to #products passed',
        'no horizontal overflow detected on mobile viewport',
        'risky public Web3/token/loan/escrow wording absent from the candidate DOM',
      ],
      current_blocker:
        'The candidate is ready for local founder review only; public replacement, deploy setup, URL sharing, tester invites, and live actions remain blocked until standalone PUBLICATION_GO and final public-file QA.',
      next_safe_action:
        'Use this static candidate as the preferred local homepage review file, then rerun final claim-risk, diff, rollback, and browser QA after any founder-approved copy change before public replacement.',
      qa_caveat:
        'Earlier Browser console history retained stale Tailwind CDN warnings from the old draft route; use a clean Browser session before public replacement evidence.',
      blocked_live_actions: [
        'public_homepage_replacement',
        'public_whitepaper_edit',
        'deploy_setting_change',
        'public_url_share',
        'tester_invite',
        'real_payment',
        'real_loan',
        'real_escrow',
        'stablecoin_settlement',
        'token_collateral_lock',
        'provider_commitment',
        'legal_decision',
        'production_release',
      ],
      no_public_homepage_edit_attempted: true,
      no_public_whitepaper_edit_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_public_url_share_attempted: true,
      no_tester_invite_attempted: true,
      no_live_action_attempted: true,
    },
  ];
  const homepagePublicationDecisionSummary = {
    id: 'homepage_publication_decision_summary',
    label: 'Homepage publication decision summary',
    summary_state: 'LOCAL_READY_PUBLICATION_BLOCKED',
    current_candidate: 'index-v1-3-static-draft.html',
    recommended_founder_response: [
      'APPROVE_TRADITIONAL_FIRST_HOMEPAGE_DIRECTION',
      'APPROVE_HIDDEN_FUTURE_INFRASTRUCTURE_LANGUAGE',
      'ACCEPT_LOCAL_BROWSER_QA_EVIDENCE',
      'REQUIRE_COMPILED_PUBLIC_CSS',
      'KEEP_PUBLIC_REPLACEMENT_ON_HOLD',
    ],
    current_public_state: {
      homepage: 'UNCHANGED_PUBLIC_INDEX_HTML',
      whitepaper: 'UNCHANGED_PUBLIC_WHITEPAPER_HTML',
      deploy_settings: 'UNCHANGED_EXTERNAL_DEPLOY_SETTINGS',
      public_url_share: 'NOT_ATTEMPTED',
      tester_invites: 'NOT_ATTEMPTED',
    },
    ready_local_evidence: [
      'traditional-first homepage direction prepared',
      'future infrastructure language hidden from public homepage copy',
      'static no-external-asset candidate prepared',
      'desktop local Browser QA recorded',
      'mobile local Browser QA recorded',
      'homepage static draft validator passing',
    ],
    remaining_blockers: [
      'standalone PUBLICATION_GO not provided',
      'final exact public-file replacement diff not approved',
      'final claim-risk scan must rerun after any founder-approved copy change',
      'archive/rollback execution remains blocked until PUBLICATION_GO',
      'deploy setup and public URL smoke require founder-controlled external actions',
      'tester invite/share approval remains separate from publication approval',
    ],
    next_safe_actions: [
      'Keep public index.html and whitepaper.html unchanged.',
      'Use the static candidate for local founder review.',
      'If founder approves copy direction only, continue local QA and final diff prep without public replacement.',
      'If founder provides standalone PUBLICATION_GO later, prepare exact-file replacement package and rerun final public-file QA before commit.',
    ],
    source_docs: [
      'docs/smartcontractor-homepage-founder-ready-decision-summary-2026-06-03.md',
      'docs/smartcontractor-public-homepage-publication-readiness-2026-06-03.md',
      'docs/smartcontractor-public-homepage-static-asset-draft-2026-06-03.md',
      'docs/smartcontractor-public-homepage-deploy-sequencing-2026-06-03.md',
    ],
    blocked_live_actions: [
      'public_homepage_replacement',
      'public_whitepaper_edit',
      'deploy_setting_change',
      'public_url_share',
      'tester_invite',
      'public_beta_launch',
      'real_payment',
      'real_loan',
      'real_escrow',
      'stablecoin_settlement',
      'token_collateral_lock',
      'provider_commitment',
      'legal_decision',
      'production_release',
    ],
    no_public_homepage_edit_attempted: true,
    no_public_whitepaper_edit_attempted: true,
    no_deploy_setting_change_attempted: true,
    no_public_url_share_attempted: true,
    no_tester_invite_attempted: true,
    no_live_action_attempted: true,
  };
  const homepagePublicationFinalQaHold = [
    {
      id: 'homepage_static_candidate_final_qa_hold',
      label: 'Homepage final public QA hold',
      hold_state: 'FINAL_QA_HOLD_LOCAL_ONLY',
      candidate_file: 'index-v1-3-static-draft.html',
      public_target_file: 'index.html',
      whitepaper_target_file: 'whitepaper.html',
      publication_allowed: false,
      required_before_publication_go: [
        'final public-file claim scan on index-v1-3-static-draft.html',
        'clean Browser desktop/mobile screenshot evidence',
        'link and CTA route check from the approved local candidate',
        'external asset and font policy confirmation',
        'archive and rollback hash check for current index.html',
        'exact diff preview from current index.html to approved candidate',
      ],
      already_prepared_local_evidence: [
        'static no-external-asset homepage candidate prepared',
        'local Browser desktop/mobile evidence recorded for draft review',
        'dry-run replacement diff package prepared',
        'rollback packet prepared but not executed',
      ],
      current_hold_reason:
        'Final QA is still a local preflight. Standalone PUBLICATION_GO, final public-file QA, archive execution, public file replacement, deploy setup, URL sharing, and tester invites remain blocked.',
      next_safe_action:
        'Keep public index.html and whitepaper.html unchanged while collecting final QA evidence against the exact local candidate.',
      source_docs: [
        'docs/smartcontractor-public-homepage-static-asset-draft-2026-06-03.md',
        'docs/smartcontractor-public-homepage-publication-readiness-2026-06-03.md',
        'docs/smartcontractor-public-homepage-visual-qa-rollback-checklist-2026-06-03.md',
        'docs/smartcontractor-public-homepage-rollback-packet-2026-06-03.md',
      ],
      blocked_live_actions: [
        'public_homepage_replacement',
        'public_whitepaper_edit',
        'archive_execution',
        'deploy_setting_change',
        'public_url_share',
        'tester_invite',
        'public_beta_launch',
        'real_payment',
        'real_loan',
        'real_escrow',
        'stablecoin_settlement',
        'token_collateral_lock',
        'provider_commitment',
        'legal_decision',
        'production_release',
      ],
      no_public_homepage_edit_attempted: true,
      no_public_whitepaper_edit_attempted: true,
      no_archive_execution_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_public_url_share_attempted: true,
      no_tester_invite_attempted: true,
      no_live_action_attempted: true,
    },
  ];
  const testerFinanceContractQuickstart = [
    {
      id: 'open_finance_contract_demo',
      label: 'Open finance/contract demo screens only',
      quickstart_code: 'finance_contract_tester_quickstart',
      safe_tester_actions: [
        'Open Payment Router, Starter Loan, Milestone/Escrow, Smart Contract Review, and Request Trace screens in the local demo app.',
        'Use visible demo badges, request IDs, and status labels as product evidence.',
      ],
      blocked_live_interpretations: [
        'No card charge or XPR transfer occurred.',
        'No loan was approved or funded.',
        'No escrow was released.',
        'No contract was signed.',
        'No token collateral was locked.',
        'No provider, legal, or production decision was made.',
      ],
      report_back_fields: ['tester_role', 'flow_name', 'checkpoint', 'request_id', 'boundary_confusion', 'next_local_only_action'],
      next_safe_step: 'Capture the visible request ID and continue the local walkthrough only.',
      report_code: 'FINANCE_CONTRACT_TESTER_QUICKSTART',
      no_server_storage_attempted: true,
      no_external_followup_attempted: true,
      no_public_beta_flip_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'capture_safe_request_ids',
      label: 'Capture safe request IDs',
      quickstart_code: 'finance_contract_tester_quickstart',
      safe_tester_actions: [
        'Record Request ID, role, flow, checkpoint, and PASS/REVIEW/STOP state when a finance or contract demo screen is unclear.',
        'Use redacted local notes instead of screenshots when a screen might contain private data.',
      ],
      blocked_live_interpretations: [
        'No server storage, external send, provider submission, legal review, or public beta approval is triggered by a tester note.',
        'No payment, loan, escrow, signed contract, XPR signature, stablecoin, repayment, or token custody action is approved.',
      ],
      report_back_fields: ['tester_role', 'flow_name', 'checkpoint', 'request_id', 'issue_severity', 'boundary_confusion', 'next_local_only_action'],
      next_safe_step: 'Log only metadata and route unclear finance/contract wording to founder/admin review.',
      report_code: 'FINANCE_CONTRACT_TESTER_QUICKSTART',
      no_server_storage_attempted: true,
      no_external_followup_attempted: true,
      no_public_beta_flip_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'stop_before_live_interpretation',
      label: 'Stop before live interpretation',
      quickstart_code: 'finance_contract_tester_quickstart',
      safe_tester_actions: [
        'Pause the walkthrough if the tester expects real money, binding contract effect, XPR signing, provider review, legal decision, or production availability.',
        'Restart only after the tester can restate that this is local demo review with no live action.',
      ],
      blocked_live_interpretations: [
        'No public beta flip, external follow-up, production release, payment charge, loan approval, escrow release, signed contract, XPR signature, provider commitment, legal decision, or token collateral lock can happen from this quickstart.',
      ],
      report_back_fields: ['tester_role', 'flow_name', 'checkpoint', 'request_id', 'blocked_live_action', 'boundary_confusion', 'next_local_only_action'],
      next_safe_step: 'Mark the item REVIEW or STOP and keep the next action local-only until founder/admin review.',
      report_code: 'FINANCE_CONTRACT_TESTER_QUICKSTART',
      no_server_storage_attempted: true,
      no_external_followup_attempted: true,
      no_public_beta_flip_attempted: true,
      no_live_action_attempted: true,
    },
  ];
  const testerFinanceContractWalkthroughGate = [
    {
      id: 'quickstart_acknowledgement_gate',
      label: 'Quickstart acknowledgement gate',
      gate_state: 'REQUIRED_BEFORE_WALKTHROUGH',
      required_before: ['payment_router', 'starter_loan', 'milestone_escrow', 'contract_review', 'smart_contract_review'],
      required_evidence: ['FINANCE_CONTRACT_TESTER_QUICKSTART acknowledgement', 'request_id', 'tester_role', 'flow', 'checkpoint'],
      next_safe_action: 'Validate the local quickstart acknowledgement before opening finance/contract walkthrough screens.',
      route: '/api/admin/beta-readiness/finance-contract-quickstart/acknowledgement/validate',
      blocked_live_actions: ['payment_charge', 'loan_approval', 'escrow_release', 'signed_contract_creation', 'xpr_signature', 'stablecoin_settlement', 'token_collateral_lock', 'provider_commitment', 'legal_decision', 'public_beta_flip', 'production_release'],
      no_server_storage_attempted: true,
      no_external_followup_attempted: true,
      no_public_beta_flip_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'walkthrough_stop_gate',
      label: 'Walkthrough stop gate',
      gate_state: 'STOP_ON_LIVE_CONFUSION',
      required_before: ['continuing_after_confusion'],
      required_evidence: ['LIVE_CONFUSION_REVIEW_ONLY note or SAFE_REVIEWER_NOTE', 'blocked_live_action', 'request_id', 'next_local_action'],
      next_safe_action: 'Pause and validate reviewer/live-confusion notes when a tester expects live money, escrow, contract, XPR, provider, legal, public beta, or production action.',
      route: '/api/admin/beta-readiness/finance-contract-walkthrough/live-confusion/validate',
      blocked_live_actions: ['payment_charge', 'loan_approval', 'escrow_release', 'signed_contract_creation', 'xpr_signature', 'stablecoin_settlement', 'token_collateral_lock', 'provider_commitment', 'legal_decision', 'external_followup', 'public_beta_flip', 'production_release'],
      no_server_storage_attempted: true,
      no_external_followup_attempted: true,
      no_public_beta_flip_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'debrief_handoff_gate',
      label: 'Debrief handoff gate',
      gate_state: 'REQUIRED_AFTER_WALKTHROUGH',
      required_before: ['issue_handoff', 'next_tester_batch'],
      required_evidence: ['SAFE_DEBRIEF_NOTE', 'boundary_clarity_rating', 'triage_labels', 'founder_review_hold'],
      next_safe_action: 'Validate the local debrief before issue handoff or the next tester batch.',
      route: '/api/admin/beta-readiness/finance-contract-walkthrough/debrief/validate',
      blocked_live_actions: ['external_send', 'payment_charge', 'loan_approval', 'escrow_release', 'signed_contract_creation', 'xpr_signature', 'stablecoin_settlement', 'token_collateral_lock', 'provider_commitment', 'legal_decision', 'public_beta_flip', 'production_release'],
      no_server_storage_attempted: true,
      no_external_followup_attempted: true,
      no_public_beta_flip_attempted: true,
      no_live_action_attempted: true,
    },
  ];
  const testerFinanceContractBoundaryPack = [
    'demo_only_finance_contract_boundary_pack: show this pack before testers exercise payment, starter-loan, milestone, dispute, contract, ClaimBridge, or smart contract review flows.',
    'No real payments: payment-router demos create local review records only; they do not charge cards, move XPR, release escrow, settle stablecoins, repay loans, or lock token collateral.',
    'No live loan approval: working-capital and starter-loan screens are review prep only; they do not approve credit, fund contractors, originate loans, or route repayment.',
    'No escrow release: milestones, disputes, ClaimBridge, and escrow-backed advance flows are demo records only until founder/legal/provider review.',
    'No signed contract: bids, project contracts, milestone approvals, and dispute outcomes are product walkthrough artifacts only and cannot create legal obligations.',
    'No token collateral: smart contract helper and replay surfaces cannot deploy contracts, request XPR signatures, settle stablecoins, or lock collateral.',
    'Reviewer script: ask testers to report whether these boundaries are visible before they try a finance, contract, milestone, dispute, or smart-contract review flow.',
  ];
  const testerFinanceContractWalkthroughScript = [
    {
      step: 1,
      label: 'Finance/contract walkthrough opening',
      tester_prompt: 'Before any finance or contract screen, ask the tester to say back that this is a demo-only walkthrough.',
      expected_signal: 'Tester says no real payment, no live loan, no escrow release, no signed contract, and no token collateral.',
      stop_condition: 'Stop if tester expects real money or binding contract action.',
      blocked_live_actions: ['payment_charge', 'loan_approval', 'escrow_release', 'signed_contract_creation', 'token_collateral_lock'],
    },
    {
      step: 2,
      label: 'Payment router checkpoint',
      tester_prompt: 'Open Payment Router and ask whether the screen clearly says local review record only.',
      expected_signal: 'Tester understands no card charge, XPR transfer, escrow release, stablecoin settlement, repayment routing, or collateral lock occurs.',
      stop_condition: 'Stop if tester tries to enter card, bank, wallet-secret, or real payment data.',
      blocked_live_actions: ['payment_charge', 'xpr_transfer', 'stablecoin_settlement', 'repayment_routing', 'token_collateral_lock'],
    },
    {
      step: 3,
      label: 'Starter-loan checkpoint',
      tester_prompt: 'Open starter-loan or working-capital screens and ask what would still be needed before real funding.',
      expected_signal: 'Tester identifies founder/legal/provider review and understands the local score does not approve or originate credit.',
      stop_condition: 'Stop if tester treats score, readiness, or repayment waterfall as real credit approval.',
      blocked_live_actions: ['loan_approval', 'loan_origination', 'contractor_funding', 'repayment_routing', 'provider_commitment'],
    },
    {
      step: 4,
      label: 'Milestone/escrow checkpoint',
      tester_prompt: 'Open milestone, dispute, or ClaimBridge screens and ask whether any funds can be released from the demo.',
      expected_signal: 'Tester understands milestone evidence and disputes are review records only and cannot release escrow, issue refunds, or decide liability.',
      stop_condition: 'Stop if tester expects escrow release, refund, legal decision, or provider submission from the demo.',
      blocked_live_actions: ['escrow_release', 'refund_issue', 'liability_decision', 'provider_submission', 'legal_decision'],
    },
    {
      step: 5,
      label: 'Smart contract review checkpoint',
      tester_prompt: 'Open contract helper/replay surfaces and ask whether gcscworkcap1, gcscclaim111, gcsccredit11, or gcscadvance1 is live.',
      expected_signal: 'Tester understands the contract surfaces are local review/demo fixtures only, not deployed finance infrastructure.',
      stop_condition: 'Stop if tester expects XPR deployment, XPR signature, ClaimBridge funding, working-capital funding, or token custody.',
      blocked_live_actions: ['xpr_deploy', 'xpr_signature', 'claimbridge_funding', 'working_capital_funding', 'token_custody'],
    },
  ];
  const testerFinanceContractWalkthroughTriageMatrix = [
    {
      id: 'real_money_expectation',
      label: 'Real-money expectation triage',
      severity: 'STOP_SESSION',
      tester_signal: 'Tester expects card charge, XPR transfer, live loan funding, repayment routing, or token collateral.',
      safe_next_action: 'Pause the walkthrough, restate demo-only scope, log a product clarity issue, and continue only if the tester understands no money moves.',
      report_code: 'SAFE_CONFUSION_NOTE',
      blocked_live_actions: ['payment_charge', 'xpr_transfer', 'loan_approval', 'contractor_funding', 'repayment_routing', 'token_collateral_lock'],
    },
    {
      id: 'sensitive_data_entry',
      label: 'Sensitive data entry triage',
      severity: 'STOP_AND_REDACT',
      tester_signal: 'Tester tries to enter private ID, card, bank, password, service-role, wallet-secret, real address, or token-bearing URL data.',
      safe_next_action: 'Stop the session, clear or redact the screen, record only non-sensitive issue metadata, and keep artifacts founder/admin-only.',
      report_code: 'SAFE_CONFUSION_NOTE',
      blocked_live_actions: ['sensitive_data_collection', 'credential_capture', 'payment_data_storage', 'wallet_secret_capture', 'external_send'],
    },
    {
      id: 'binding_contract_expectation',
      label: 'Binding contract expectation triage',
      severity: 'REVIEW_BEFORE_CONTINUE',
      tester_signal: 'Tester believes a bid, project contract, milestone approval, or dispute outcome creates a legal obligation.',
      safe_next_action: 'Clarify that all contract screens are walkthrough artifacts only and route unclear wording to founder/legal review.',
      report_code: 'SAFE_CONFUSION_NOTE',
      blocked_live_actions: ['signed_contract_creation', 'legal_decision', 'provider_commitment', 'production_contract_publish'],
    },
    {
      id: 'escrow_refund_expectation',
      label: 'Escrow or refund expectation triage',
      severity: 'STOP_SESSION',
      tester_signal: 'Tester expects milestone evidence, dispute review, ClaimBridge, or admin notes to release escrow or issue a refund.',
      safe_next_action: 'Stop the live-action interpretation, log the screen and request ID, and keep the issue in founder/legal/provider review.',
      report_code: 'SAFE_CONFUSION_NOTE',
      blocked_live_actions: ['escrow_release', 'refund_issue', 'liability_decision', 'provider_submission', 'payment_movement'],
    },
    {
      id: 'smart_contract_live_action_expectation',
      label: 'Smart contract live-action expectation triage',
      severity: 'STOP_SESSION',
      tester_signal: 'Tester believes gcscworkcap1, gcscclaim111, gcsccredit11, or gcscadvance1 is deployed or ready for XPR signatures.',
      safe_next_action: 'Reframe the contract screens as local review fixtures and move any live-action question to founder/security/provider/legal/XPR review.',
      report_code: 'SAFE_CONFUSION_NOTE',
      blocked_live_actions: ['xpr_deploy', 'xpr_signature', 'claimbridge_funding', 'working_capital_funding', 'token_custody'],
    },
  ];
  const testerFinanceContractWalkthroughDebriefPacket = [
    {
      id: 'debrief_summary',
      label: 'Finance/contract debrief summary',
      prompt: 'Record the tester role, completed checkpoint labels, request IDs when visible, and one sentence on whether the demo-only boundary was understood.',
      safe_capture: 'Role, flow, checkpoint labels, request IDs, PASS/REVIEW/STOP state, and redacted notes only.',
      report_code: 'SAFE_DEBRIEF_NOTE',
      blocked_live_actions: ['external_send', 'sensitive_data_storage', 'payment_charge', 'loan_approval', 'production_release'],
    },
    {
      id: 'boundary_clarity_rating',
      label: 'Boundary clarity rating',
      prompt: 'Rate payment, loan, escrow, contract, and smart-contract boundary clarity as CLEAR, CONFUSING, or STOPPED.',
      safe_capture: 'Ratings and short redacted reason; no card, bank, private ID, wallet, address, or secret values.',
      report_code: 'SAFE_DEBRIEF_NOTE',
      blocked_live_actions: ['sensitive_data_collection', 'payment_data_storage', 'wallet_secret_capture', 'external_send'],
    },
    {
      id: 'confusion_triage_summary',
      label: 'Confusion triage summary',
      prompt: 'If any triage row fired, record the triage label, severity, safe next action, and whether the session paused or stopped.',
      safe_capture: 'Triage label, severity, safe next action, request ID, and redacted issue note.',
      report_code: 'SAFE_DEBRIEF_NOTE',
      blocked_live_actions: ['escrow_release', 'refund_issue', 'signed_contract_creation', 'xpr_signature', 'legal_decision'],
    },
    {
      id: 'safe_issue_handoff',
      label: 'Safe issue handoff',
      prompt: 'Create a local issue handoff with severity, role, flow, request ID, repro steps, and which boundary copy should change.',
      safe_capture: 'Issue metadata only; raw screenshots, recordings, private URLs, and personal data stay out of the packet.',
      report_code: 'SAFE_DEBRIEF_NOTE',
      blocked_live_actions: ['external_send', 'sensitive_data_storage', 'provider_submission', 'public_packet_publish', 'production_release'],
    },
    {
      id: 'founder_review_hold',
      label: 'Founder review hold',
      prompt: 'Mark any finance, contract, escrow, XPR, provider, legal, or production question as founder-review before next tester batch.',
      safe_capture: 'Founder-review hold reason, owner, blocker category, and next local-only action.',
      report_code: 'SAFE_DEBRIEF_NOTE',
      blocked_live_actions: ['provider_commitment', 'legal_decision', 'public_beta_flip', 'xpr_deploy', 'production_release'],
    },
  ];
  const testerFinanceContractReviewerNotes = [
    {
      id: 'reviewer_demo_boundary_prompt',
      label: 'Reviewer demo-boundary prompt',
      note_prompt: 'Ask the tester to repeat which finance or contract action is demo-only before moving to the next screen.',
      safe_capture: 'Boundary understood as yes/no/review plus role and flow only.',
      report_code: 'SAFE_REVIEWER_NOTE',
      blocked_live_actions: ['payment_charge', 'loan_approval', 'escrow_release', 'signed_contract_creation', 'token_collateral_lock'],
    },
    {
      id: 'reviewer_must_capture_request_id',
      label: 'Reviewer request-id capture',
      note_prompt: 'Capture the visible request ID or mark no-request-id before logging a finance/contract issue.',
      safe_capture: 'Request ID, role, flow, checkpoint label, and redacted issue metadata only.',
      report_code: 'SAFE_REVIEWER_NOTE',
      blocked_live_actions: ['external_send', 'sensitive_data_storage', 'provider_submission', 'public_packet_publish', 'production_release'],
    },
    {
      id: 'reviewer_stop_before_live_action',
      label: 'Reviewer stop-before-live gate',
      note_prompt: 'Stop the session if the tester expects a charge, loan approval, escrow release, signed contract, XPR signature, or provider/legal decision.',
      safe_capture: 'STOP/REVIEW state, blocked live action category, request ID when visible, and next local-only action.',
      report_code: 'SAFE_REVIEWER_NOTE',
      blocked_live_actions: ['payment_charge', 'loan_approval', 'escrow_release', 'signed_contract_creation', 'xpr_signature', 'legal_decision'],
    },
  ];
  const testerFinanceContractLiveConfusionSafetyPack = [
    {
      id: 'live_confusion_preflight_check',
      label: 'Live-confusion preflight check',
      reviewer_prompt: 'Before finance/contract testing starts, ask the tester to identify what would make the session unsafe or live-action adjacent.',
      expected_tester_signal: 'Tester says real payment, loan approval, escrow release, signed contract, XPR signature, provider/legal decision, public beta approval, or production release must stop the walkthrough.',
      safe_capture: 'Capture only role, flow, checkpoint, request ID when visible, and LIVE_CONFUSION_REVIEW_ONLY state.',
      report_code: 'LIVE_CONFUSION_REVIEW_ONLY',
      no_public_beta_flip: true,
      no_external_followup: true,
      blocked_live_actions: ['payment_charge', 'loan_approval', 'escrow_release', 'signed_contract_creation', 'xpr_signature', 'provider_commitment', 'legal_decision', 'public_beta_flip', 'production_release'],
    },
    {
      id: 'live_confusion_stop_script',
      label: 'Live-confusion stop script',
      reviewer_prompt: 'If a tester expects live money, binding contracts, provider review, legal effect, XPR signing, or production availability, pause and read the local demo-only boundary back before continuing.',
      expected_tester_signal: 'Tester restates that SmartContractor beta is local demo/review only and accepts that live action questions move to founder review.',
      safe_capture: 'Record STOP/REVIEW/CLEAR plus the blocked live-action category, not the tester private data or raw artifact.',
      report_code: 'LIVE_CONFUSION_REVIEW_ONLY',
      no_public_beta_flip: true,
      no_external_followup: true,
      blocked_live_actions: ['money_movement', 'repayment_routing', 'stablecoin_settlement', 'token_collateral_lock', 'provider_submission', 'auth_rls_change', 'external_send', 'production_release'],
    },
    {
      id: 'live_confusion_safe_issue_handoff',
      label: 'Live-confusion safe issue handoff',
      reviewer_prompt: 'When confusion remains after the stop script, create a local issue handoff with the confused screen, request ID, blocked action, and safer copy suggestion.',
      expected_tester_signal: 'Issue is routed to founder/admin review without public beta change, external follow-up, provider commitment, legal decision, or production action.',
      safe_capture: 'Use redacted metadata, issue severity, request ID, boundary copy suggestion, and next local-only action.',
      report_code: 'LIVE_CONFUSION_REVIEW_ONLY',
      no_public_beta_flip: true,
      no_external_followup: true,
      blocked_live_actions: ['public_beta_flip', 'external_followup', 'provider_commitment', 'legal_decision', 'payment_charge', 'loan_approval', 'escrow_release', 'production_release'],
    },
  ];
  const testerFinanceContractSessionSafetyChecklist = [
    {
      id: 'session_safety_preflight',
      label: 'Session safety preflight',
      phase: 'BEFORE_WALKTHROUGH',
      checklist_prompt: 'Before opening finance or contract screens, confirm the tester can repeat the no-real-money, no-live-loan, no-escrow-release, no-signed-contract, no-XPR-signature boundary.',
      required_safe_evidence: ['tester_role', 'flow', 'checkpoint', 'request_id when visible', 'FINANCE_CONTRACT_TESTER_QUICKSTART acknowledgement'],
      stop_if: ['tester expects payment charge', 'tester expects loan approval', 'tester expects escrow release', 'tester expects binding contract', 'tester expects XPR signature'],
      report_code: 'FINANCE_CONTRACT_SESSION_SAFETY',
      blocked_live_actions: ['payment_charge', 'loan_approval', 'escrow_release', 'signed_contract_creation', 'xpr_signature', 'public_beta_flip', 'production_release'],
      no_server_storage_attempted: true,
      no_external_followup_attempted: true,
      no_public_beta_flip_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'session_safety_during_walkthrough',
      label: 'During-walkthrough safety scan',
      phase: 'DURING_WALKTHROUGH',
      checklist_prompt: 'At Payment Router, Starter Loan, Milestone/Escrow, Contract Review, and Smart Contract Review checkpoints, ask whether the screen feels live or demo-only.',
      required_safe_evidence: ['checkpoint_label', 'boundary_clear_or_confusing', 'request_id when visible', 'SAFE_REVIEWER_NOTE or LIVE_CONFUSION_REVIEW_ONLY if unclear'],
      stop_if: ['tester enters card or bank data', 'tester enters private IDs', 'tester expects repayment routing', 'tester expects token collateral lock', 'tester expects provider or legal review'],
      report_code: 'FINANCE_CONTRACT_SESSION_SAFETY',
      blocked_live_actions: ['sensitive_data_collection', 'payment_data_storage', 'repayment_routing', 'stablecoin_settlement', 'token_collateral_lock', 'provider_submission', 'legal_decision'],
      no_server_storage_attempted: true,
      no_external_followup_attempted: true,
      no_public_beta_flip_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'session_safety_handoff',
      label: 'Post-session safe handoff',
      phase: 'AFTER_WALKTHROUGH',
      checklist_prompt: 'After the walkthrough, save only redacted metadata, request IDs, boundary clarity rating, triage labels, and next local-only action.',
      required_safe_evidence: ['SAFE_DEBRIEF_NOTE', 'boundary_clarity_rating', 'triage_labels', 'founder_review_hold when needed'],
      stop_if: ['raw screenshots are unredacted', 'notes include secrets', 'notes include payment or identity data', 'handoff implies public beta approval', 'handoff implies production approval'],
      report_code: 'FINANCE_CONTRACT_SESSION_SAFETY',
      blocked_live_actions: ['external_send', 'raw_artifact_export', 'public_packet_publish', 'public_beta_flip', 'production_release', 'provider_commitment', 'legal_decision'],
      no_server_storage_attempted: true,
      no_external_followup_attempted: true,
      no_public_beta_flip_attempted: true,
      no_live_action_attempted: true,
    },
  ];
  const testerFinanceContractSafeHandoffSummary = [
    {
      id: 'finance_contract_safe_handoff_summary',
      label: 'Finance/contract safe handoff summary',
      summary_state: 'LOCAL_REVIEW_ONLY',
      report_code: 'FINANCE_CONTRACT_SAFE_HANDOFF_SUMMARY',
      required_sources: [
        'tester_finance_contract_quickstart',
        'tester_finance_contract_walkthrough_gate',
        'tester_finance_contract_session_safety_checklist',
        'tester_finance_contract_live_confusion_safety_pack',
        'tester_finance_contract_reviewer_notes',
        'tester_finance_contract_walkthrough_debrief_packet',
        'beta_finance_contract_session_safety_validation_history',
        'beta_finance_contract_live_confusion_validation_history',
        'beta_finance_contract_reviewer_note_validation_history',
      ],
      handoff_fields: [
        'tester_role',
        'flow',
        'checkpoint',
        'request_id',
        'boundary_clarity_rating',
        'triage_label',
        'safe_evidence_summary',
        'founder_review_hold',
        'next_local_action',
      ],
      metadata_only_history_sources: [
        'beta_finance_contract_session_safety_validation_history',
        'beta_finance_contract_live_confusion_validation_history',
        'beta_finance_contract_reviewer_note_validation_history',
        'beta_finance_contract_safe_handoff_report_history',
      ],
      review_routes: [
        '/api/admin/beta-readiness/finance-contract-quickstart/acknowledgement/validate',
        '/api/admin/beta-readiness/finance-contract-walkthrough/session-safety/validate',
        '/api/admin/beta-readiness/finance-contract-walkthrough/live-confusion/validate',
        '/api/admin/beta-readiness/finance-contract-walkthrough/reviewer-note/validate',
        '/api/admin/beta-readiness/finance-contract-walkthrough/debrief/validate',
        '/api/admin/admin-evidence-export-preview?source_filter=beta_finance_contract_session_safety_validation_history',
        '/api/admin/admin-evidence-export-preview?source_filter=beta_finance_contract_live_confusion_validation_history',
        '/api/admin/admin-evidence-export-preview?source_filter=beta_finance_contract_reviewer_note_validation_history',
        '/api/admin/admin-evidence-export-preview?source_filter=beta_finance_contract_safe_handoff_report_history',
      ],
      next_safe_action: 'Use this single local-only summary before founder/tester handoff; copy only request IDs, statuses, labels, and redacted product lessons.',
      blocked_live_actions: [
        'server_storage',
        'external_followup',
        'external_export',
        'public_beta_flip',
        'payment_charge',
        'loan_approval',
        'escrow_release',
        'signed_contract_creation',
        'xpr_signature',
        'stablecoin_settlement',
        'token_collateral_lock',
        'provider_commitment',
        'legal_decision',
        'production_release',
      ],
      no_server_storage_attempted: true,
      no_external_followup_attempted: true,
      no_external_export_attempted: true,
      no_public_beta_flip_attempted: true,
      no_live_action_attempted: true,
    },
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
    'Tester can explain that gcscworkcap1, gcscclaim111, gcsccredit11, and gcscadvance1 are demo-only product surfaces with blocked live actions.',
    'Tester can report one clear trust blocker, one confusing screen, and one improvement using safe issue intake fields.',
  ];
  const testerFailureSignals = [
    'Tester cannot explain what SmartContractor does for either homeowners or contractors after the walkthrough.',
    'Tester cannot find where to submit a bid, open a dispute, review evidence, or report a safe issue.',
    'Tester believes the demo approves real loans, escrow, payments, token collateral, or legal decisions.',
    'Tester believes gcscworkcap1, gcscclaim111, gcsccredit11, or gcscadvance1 deploys live contracts, funds ClaimBridge, funds working capital, pays advances, routes repayments, or custodies tokens.',
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
    'docs/smartcontractor-beta-decision-log.md',
    'docs/smartcontractor-founder-action-queue.md',
  ];
  const founderPresentTasks = [
    'Magic Link founder login: sign in with founder email and report only PASS/FAIL.',
    'Founder profile binding: confirm the current Auth user is linked to a SmartContractor profile.',
    'Admin membership activation: approve the prepared SQL only after the real auth_user_id is verified.',
    'Deploy account connection: connect Vercel or selected platform without sharing passwords in chat.',
  ];
  const founderLiveBlockerHandoffPack = [
    'founder_live_blocker_handoff_pack: keep this local and use it for founder evening review before public beta, deploy, Auth/Admin, strict RLS, contract review, legal/provider, payment, loan, escrow, token collateral, or production decisions.',
    'Auth/Admin blocker: founder Magic Link, profile binding, admin_memberships activation, and strict admin smoke remain founder-present; Codex can prepare evidence only.',
    'Deploy blocker: Vercel/public URL, Supabase Auth redirect URLs, production env vars, and domain settings require founder account control; no autonomous account changes.',
    'Contract review next step: keep gcscworkcap1, gcscclaim111, gcsccredit11, and gcscadvance1 in local review packets until founder/security/provider/legal/XPR review clears live deployment, ClaimBridge funding, working-capital funding, escrow-backed advance payout, repayment routing, and token custody.',
    'Beta invite blocker: public beta can invite only the first 3-5 no-real-money testers after local checks, safe invite copy, and founder decision log are ready.',
    'Report format: record PASS/FAIL/SKIPPED, request IDs, evidence docs, owner, next safe action, and blocked live action; do not paste secrets, tokens, service-role keys, private IDs, URLs with tokens, card or bank data, or wallet secrets.',
  ];
  const weekOneCloseoutHandoff = [
    {
      id: 'week_one_completed_local_surfaces',
      label: 'Week 1 completed local surfaces closeout',
      closeout_state: 'PASS_LOCAL_ONLY',
      owner: 'Codex-local',
      completed_evidence: [
        'SmartContractor homepage static candidate and Admin publication gates remain local-ready/public-blocked.',
        'Founder handoff today and founder live blocker handoff pack are exposed in Admin readiness.',
        'Founder Auth/Admin evening prep status is recorded in docs/autonomous-status/2026-06-04-2251-founder-auth-admin-evening-prep.md.',
      ],
      required_report_fields: ['closeout_state', 'completed_evidence', 'next_safe_action', 'blocked_live_actions'],
      next_safe_action:
        'Start Week 2 from founder Auth/Admin evidence intake, deploy/public beta decision prep, and legal/provider review packet prep without live action.',
      evidence_source: 'docs/smartcontractor-two-week-plan-2026-05-30.md',
      blocked_live_actions: [
        'public_index_html_replacement',
        'whitepaper_html_edit',
        'public_url_share',
        'tester_invite',
        'production_release',
      ],
      no_secret_requested: true,
      no_live_supabase_write_attempted: true,
      no_external_account_change_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_public_file_edit_attempted: true,
      no_public_url_share_attempted: true,
      no_tester_invite_attempted: true,
      no_live_finance_action_attempted: true,
      no_legal_provider_decision_attempted: true,
      no_production_release_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'week_two_auth_admin_start',
      label: 'Week 2 Auth/Admin founder evidence start',
      closeout_state: 'FOUNDER_EVIDENCE_REQUIRED',
      owner: 'Founder + Codex-local',
      completed_evidence: [
        'Founder Auth/Admin live decision packet is local-ready.',
        'Admin activation prep and founder runbook validators pass locally.',
        'Same-browser Magic Link evidence still requires founder-controlled Auth session.',
      ],
      required_report_fields: ['magic_link_status', 'profile_binding_status', 'admin_membership_status', 'safe_request_id', 'next_decision'],
      next_safe_action:
        'Founder records PASS/FAIL/SKIPPED evidence only; Codex prepares follow-up notes and stays blocked before live admin_memberships insert or strict RLS.',
      evidence_source: 'docs/smartcontractor-founder-auth-admin-live-decision-packet.md',
      blocked_live_actions: [
        'magic_link_url_paste',
        'service_role_key_use',
        'admin_memberships_insert',
        'auth_role_mutation',
        'strict_rls_apply',
        'live_supabase_write',
      ],
      no_secret_requested: true,
      no_live_supabase_write_attempted: true,
      no_external_account_change_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_public_file_edit_attempted: true,
      no_public_url_share_attempted: true,
      no_tester_invite_attempted: true,
      no_live_finance_action_attempted: true,
      no_legal_provider_decision_attempted: true,
      no_production_release_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'week_two_deploy_public_beta_hold',
      label: 'Week 2 deploy/public beta hold',
      closeout_state: 'FOUNDER_ACCOUNT_REQUIRED',
      owner: 'Founder',
      completed_evidence: [
        'Deployment decision prep and public beta URL smoke intake templates are available locally.',
        'Homepage publication sequence gate separates PUBLICATION_GO, file replacement, deploy setup, URL smoke, and invite/share approval.',
        'Public beta invite remains limited to 3-5 no-real-money testers after founder decision log approval.',
      ],
      required_report_fields: ['deploy_target_status', 'public_url_smoke_status', 'rollback_or_hold_decision', 'safe_request_id'],
      next_safe_action:
        'Founder reviews external account, deploy target, redirect URL, and public URL smoke evidence outside Codex before any share or invite decision.',
      evidence_source: 'docs/smartcontractor-public-beta-url-smoke-evidence-intake.md',
      blocked_live_actions: [
        'vercel_import',
        'github_pages_setting_change',
        'dns_change',
        'supabase_redirect_update',
        'production_env_var_change',
        'public_url_share',
        'tester_invite',
        'public_beta_flip',
      ],
      no_secret_requested: true,
      no_live_supabase_write_attempted: true,
      no_external_account_change_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_public_file_edit_attempted: true,
      no_public_url_share_attempted: true,
      no_tester_invite_attempted: true,
      no_live_finance_action_attempted: true,
      no_legal_provider_decision_attempted: true,
      no_production_release_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'week_two_legal_provider_review',
      label: 'Week 2 legal/provider finance review prep',
      closeout_state: 'BLOCKED_FOR_EXTERNAL_REVIEW',
      owner: 'Founder/legal/provider',
      completed_evidence: [
        'Working-capital, milestone, dispute, repayment, and smart-contract review packets remain local/demo-only.',
        'Live payment, real loan, real escrow, stablecoin settlement, token collateral, XPR signature, and production release remain blocked.',
        'Codex can prepare question packets, not legal conclusions or provider commitments.',
      ],
      required_report_fields: ['question_area', 'review_owner', 'risk_level', 'blocked_next_action'],
      next_safe_action:
        'Prepare attorney/provider question lists from local packets only; stop before commitments, account changes, signatures, funds, or regulated finance actions.',
      evidence_source: 'docs/whitepaper-v1-3-legal-provider-review-packet.md',
      blocked_live_actions: [
        'legal_conclusion',
        'provider_commitment',
        'payment_charge',
        'real_loan',
        'real_escrow',
        'stablecoin_settlement',
        'token_collateral_lock',
        'xpr_signature',
        'production_release',
      ],
      no_secret_requested: true,
      no_live_supabase_write_attempted: true,
      no_external_account_change_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_public_file_edit_attempted: true,
      no_public_url_share_attempted: true,
      no_tester_invite_attempted: true,
      no_live_finance_action_attempted: true,
      no_legal_provider_decision_attempted: true,
      no_production_release_attempted: true,
      no_live_action_attempted: true,
    },
  ];
  const investorFounderPackageReadiness = [
    {
      id: 'investor_package_internal_snapshot',
      label: 'Investor/founder internal package snapshot',
      readiness_state: 'INTERNAL_PACKAGE_ONLY',
      owner: 'Founder + Codex-local',
      package_scope: 'investor_grant_partner_founder_review',
      evidence_source: 'docs/smartcontractor-investor-founder-package.md',
      required_artifacts: [
        'docs/smartcontractor-investor-founder-package.md',
        'docs/smartcontractor-founder-one-pager.md',
        'docs/smartcontractor-demo-script.md',
        'docs/smartcontractor-real-status-audit-2026-05-16.md',
        'docs/smartcontractor-public-beta-review-packet.md',
      ],
      required_report_fields: ['readiness_state', 'package_scope', 'evidence_source', 'required_artifacts', 'blocked_live_actions'],
      next_safe_action:
        'Review the package locally and choose Share, Revise, or Hold inside founder notes only; do not send, publish, deploy, or promise live finance.',
      blocked_claims: [
        'approved_lender',
        'licensed_escrow',
        'guaranteed_contractor_loan',
        'token_return',
        'production_payments_ready',
        'public_launch_complete',
        'provider_partnership_secured',
      ],
      blocked_live_actions: [
        'investor_outreach',
        'grant_submission',
        'partner_outreach',
        'provider_commitment',
        'legal_conclusion',
        'public_claim_approval',
        'deck_publication',
        'pdf_publication',
        'email_campaign',
        'social_post',
        'public_url_share',
        'production_deploy',
        'payment_charge',
        'real_loan',
        'real_escrow',
        'repayment_routing',
        'stablecoin_settlement',
        'token_collateral_lock',
        'xpr_signature',
        'public_launch',
      ],
      no_secret_requested: true,
      no_external_send_attempted: true,
      no_public_file_edit_attempted: true,
      no_public_url_share_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_live_finance_action_attempted: true,
      no_legal_provider_decision_attempted: true,
      no_production_release_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'investor_package_evidence_freshness',
      label: 'Investor/founder package evidence freshness',
      readiness_state: 'REFRESH_BEFORE_EXTERNAL_USE',
      owner: 'Codex-local + Founder review',
      package_scope: 'latest_check_run_and_source_commit_required',
      evidence_source: 'docs/smartcontractor-investor-founder-package.md',
      required_artifacts: [
        'latest full local check run count',
        'source commit',
        'evidence dates',
        'redaction status',
        'claim-source binding',
      ],
      required_report_fields: ['latest_check_run', 'source_commit', 'evidence_date', 'redaction_status', 'claim_source_binding'],
      next_safe_action:
        'Refresh evidence metadata locally before any founder packet draft; keep recipient data, private notes, and external-send approval out of tracked docs.',
      blocked_claims: [
        'stale_metrics',
        'old_deck_claims',
        'unbound_claim_source',
        'unredacted_private_evidence',
        'unreviewed_public_claim',
      ],
      blocked_live_actions: [
        'investor_outreach',
        'grant_submission',
        'provider_commitment',
        'legal_conclusion',
        'public_claim_approval',
        'external_send',
        'public_url_share',
        'production_deploy',
        'payment_charge',
        'real_loan',
        'real_escrow',
        'xpr_signature',
      ],
      no_secret_requested: true,
      no_external_send_attempted: true,
      no_public_file_edit_attempted: true,
      no_public_url_share_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_live_finance_action_attempted: true,
      no_legal_provider_decision_attempted: true,
      no_production_release_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'investor_package_claim_review_gate',
      label: 'Investor/founder package claim review gate',
      readiness_state: 'HOLD_FOR_CLAIM_REVIEW',
      owner: 'Founder/legal/provider/claim reviewer',
      package_scope: 'conservative_claims_only',
      evidence_source: 'docs/smartcontractor-investor-founder-package.md',
      required_artifacts: [
        'blocked claims list',
        'safe replacement wording',
        'audience-specific packet delta review',
        'legal/provider question list',
      ],
      required_report_fields: ['claim_id', 'audience', 'claim_level', 'safe_replacement', 'blocked_next_action'],
      next_safe_action:
        'Route risky investor, grant, provider, loan, escrow, token, launch, and partnership claims to founder/legal/provider review before any packet leaves internal review.',
      blocked_claims: [
        'approved_lender',
        'licensed_escrow',
        'guaranteed_returns',
        'guaranteed_contractor_loan',
        'token_or_yield_promise',
        'stablecoin_settlement_live',
        'public_beta_live',
        'provider_partnership_secured',
      ],
      blocked_live_actions: [
        'investor_outreach',
        'grant_submission',
        'provider_commitment',
        'legal_conclusion',
        'public_claim_approval',
        'fundraising_terms',
        'securities_law_conclusion',
        'payment_provider_setup',
        'real_loan',
        'real_escrow',
        'stablecoin_settlement',
        'token_collateral_lock',
        'production_release',
      ],
      no_secret_requested: true,
      no_external_send_attempted: true,
      no_public_file_edit_attempted: true,
      no_public_url_share_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_live_finance_action_attempted: true,
      no_legal_provider_decision_attempted: true,
      no_production_release_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'investor_package_send_approval_stop',
      label: 'Investor/founder package external send stop',
      readiness_state: 'EXTERNAL_SEND_BLOCKED',
      owner: 'Founder',
      package_scope: 'one_bounded_send_review_action_only',
      evidence_source: 'docs/smartcontractor-investor-founder-package.md',
      required_phrase: 'INVESTOR_PACKET_SEND_ACTION_RECORDED',
      required_artifacts: [
        'audience',
        'packet_version',
        'source_commit',
        'latest_check_run',
        'evidence_date',
        'redaction_status',
        'blocked_claims_review',
      ],
      required_report_fields: ['required_phrase', 'audience', 'packet_version', 'source_commit', 'latest_check_run', 'blocked_claims_review'],
      next_safe_action:
        'Founder records the exact bounded phrase with non-secret fields outside live systems; Codex still must not send packets, submit grants, contact providers, publish decks/PDFs, or share URLs.',
      blocked_claims: [
        'broad_outreach_approval',
        'fundraising_approval',
        'legal_approval',
        'provider_approval',
        'live_finance_approval',
        'public_launch_approval',
      ],
      blocked_live_actions: [
        'investor_outreach',
        'grant_submission',
        'partner_outreach',
        'provider_commitment',
        'legal_conclusion',
        'external_send',
        'deck_publication',
        'pdf_publication',
        'email_campaign',
        'social_post',
        'public_url_share',
        'production_deploy',
        'payment_charge',
        'real_loan',
        'real_escrow',
        'repayment_routing',
        'stablecoin_settlement',
        'token_collateral_lock',
        'xpr_signature',
        'public_launch',
      ],
      no_secret_requested: true,
      no_external_send_attempted: true,
      no_public_file_edit_attempted: true,
      no_public_url_share_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_live_finance_action_attempted: true,
      no_legal_provider_decision_attempted: true,
      no_production_release_attempted: true,
      no_live_action_attempted: true,
    },
  ];
  const founderEveningActionSummary = [
    'founder_evening_action_summary: copy this local-only list into the founder evening note after checks pass; it does not approve live changes.',
    'Magic Link login: founder signs in with the real founder email and records only PASS/FAIL/SKIPPED plus safe request ID evidence.',
    'Profile/admin membership: confirm profile binding and admin membership readiness, but keep auth_user_id/private IDs out of chat and require explicit founder approval before any live admin_memberships insert.',
    'Contract review: review gcscworkcap1, gcscclaim111, gcsccredit11, and gcscadvance1 local packets only; do not request XPR signatures, deploy contracts, fund ClaimBridge, route repayment, or custody tokens.',
    'Public beta invite: hold invite sending until local checks pass, safe invite copy is ready, and the founder decision log approves the first 3-5 no-real-money testers.',
    'Deploy/public URL: founder controls Vercel, Supabase redirect URLs, domain settings, and production env values; Codex can prepare checklist/evidence only.',
    'Homepage publication: review copy direction, PUBLICATION_GO, exact-file replacement, deploy/share sequencing, and keep public index.html / whitepaper.html unchanged until explicit approval.',
    'No live action approval: this summary blocks live Supabase writes, external account changes, legal/provider commitments, payments, loans, escrow, stablecoin settlement, token collateral, XPR registration/signature, and production release.',
  ];
  const founderEveningDecisionMatrix = [
    {
      id: 'auth_admin',
      label: 'Auth/Admin decision',
      current_state: 'REVIEW',
      owner: 'Founder',
      next_safe_action: 'Record Magic Link, profile binding, and admin membership evidence as PASS/FAIL/SKIPPED without private IDs in chat.',
      blocked_live_actions: [
        'No live action approval: live admin_memberships insert, Auth role changes, strict RLS apply, service-role use, and Supabase writes stay blocked.',
      ],
      evidence_source: 'docs/smartcontractor-founder-auth-evidence-template.md',
    },
    {
      id: 'deploy_public_url',
      label: 'Deploy/public URL decision',
      current_state: 'HOLD',
      owner: 'Founder',
      next_safe_action: 'Review deploy target, redirect URL checklist, and safe public URL smoke evidence before any account setting change.',
      blocked_live_actions: [
        'No live action approval: Vercel/domain settings, Supabase redirect URL changes, production env values, and public release stay blocked.',
      ],
      evidence_source: 'docs/smartcontractor-public-beta-url-smoke-evidence-intake.md',
    },
    {
      id: 'homepage_publication',
      label: 'Homepage publication decision',
      current_state: 'HOLD',
      owner: 'Founder',
      next_safe_action: 'Review copy direction, PUBLICATION_GO, public file replacement, deploy/share separation, and evidence gates before any public homepage replacement.',
      blocked_live_actions: [
        'No live action approval: public index.html replacement, whitepaper.html edit, GitHub Pages/Vercel/DNS/Supabase changes, public URL sharing, tester invites, live finance, legal/provider commitments, and production release stay blocked.',
      ],
      evidence_source: 'docs/smartcontractor-public-homepage-deploy-sequencing-2026-06-03.md',
    },
    {
      id: 'contract_review',
      label: 'Contract review decision',
      current_state: 'GO_LOCAL_REVIEW',
      owner: 'Founder/security/provider/legal review',
      next_safe_action: 'Review gcscworkcap1, gcscclaim111, gcsccredit11, and gcscadvance1 local packets before any XPR or finance action.',
      blocked_live_actions: [
        'No live action approval: XPR deployment, signature request, ClaimBridge funding, working-capital funding, escrow-backed advance payout, repayment routing, and token custody stay blocked.',
      ],
      evidence_source: 'docs/smartcontractor-public-beta-deploy-to-invite-handoff.md',
    },
    {
      id: 'public_beta_invite',
      label: 'Public beta invite decision',
      current_state: 'HOLD',
      owner: 'Founder',
      next_safe_action: 'Approve or revise the first 3-5 tester invite copy only after local checks and decision-log evidence are ready.',
      blocked_live_actions: [
        'No live action approval: invite sending, public launch, real-money pilot, payment setup, and production tester onboarding stay blocked.',
      ],
      evidence_source: 'docs/smartcontractor-public-beta-invite-founder-send-checklist.md',
    },
    {
      id: 'legal_provider',
      label: 'Legal/provider decision',
      current_state: 'BLOCKED',
      owner: 'Founder/legal/provider',
      next_safe_action: 'Use local review packets to prepare questions; attorney/provider choices and commitments remain outside autonomous Codex.',
      blocked_live_actions: [
        'No live action approval: legal conclusions, provider commitments, real loans, escrow release, payment movement, stablecoin settlement, and token collateral stay blocked.',
      ],
      evidence_source: 'docs/whitepaper-v1-3-legal-provider-review-packet.md',
    },
  ];
  const founderEveningCommandBoard = [
    {
      order: 1,
      board_title: 'Founder evening command board',
      label: 'Step 1 Auth/Admin evidence intake',
      command_state: 'FOUNDER_LOCAL_REVIEW',
      decision_ref: 'auth_admin',
      founder_prompt: 'Record Magic Link, profile binding, and admin readiness as PASS/FAIL/SKIPPED with safe request ID evidence only.',
      evidence_target: 'docs/smartcontractor-founder-auth-evidence-template.md',
      blocked_live_actions: [
        'No live command execution: live admin_memberships insert, Auth role mutation, service-role use, strict RLS apply, and Supabase writes stay blocked.',
      ],
    },
    {
      order: 2,
      label: 'Step 2 Contract review scan',
      command_state: 'GO_LOCAL_REVIEW_ONLY',
      decision_ref: 'contract_review',
      founder_prompt: 'Scan gcscworkcap1, gcscclaim111, gcsccredit11, and gcscadvance1 local packets for questions before any live XPR or finance action.',
      evidence_target: 'docs/smartcontractor-public-beta-deploy-to-invite-handoff.md',
      blocked_live_actions: [
        'No live command execution: XPR deploy, signature request, ClaimBridge funding, working-capital funding, escrow-backed advance payout, repayment routing, and token custody stay blocked.',
      ],
    },
    {
      order: 3,
      label: 'Step 3 Deploy/public URL smoke intake',
      command_state: 'HOLD_FOR_FOUNDER_ACCOUNT',
      decision_ref: 'deploy_public_url',
      founder_prompt: 'Use founder-controlled deploy/public URL smoke evidence fields before any Vercel, domain, redirect URL, or env setting change.',
      evidence_target: 'docs/smartcontractor-public-beta-url-smoke-evidence-intake.md',
      blocked_live_actions: [
        'No live command execution: external account changes, DNS changes, Supabase redirect changes, production env edits, and public release stay blocked.',
      ],
    },
    {
      order: 4,
      label: 'Step 4 Public beta invite hold/review',
      command_state: 'HOLD_FOR_DECISION_LOG',
      decision_ref: 'public_beta_invite',
      founder_prompt: 'Review invite copy and first 3-5 no-real-money tester scope after local checks and decision-log evidence are ready.',
      evidence_target: 'docs/smartcontractor-public-beta-invite-founder-send-checklist.md',
      blocked_live_actions: [
        'No live command execution: invite sending, public beta release, real-money pilot, payment setup, and production tester onboarding stay blocked.',
      ],
    },
    {
      order: 5,
      label: 'Step 5 Legal/provider question prep',
      command_state: 'BLOCKED_FOR_EXTERNAL_REVIEW',
      decision_ref: 'legal_provider',
      founder_prompt: 'Collect local questions for attorney/provider review without deciding legal conclusions, providers, or regulated finance actions.',
      evidence_target: 'docs/whitepaper-v1-3-legal-provider-review-packet.md',
      blocked_live_actions: [
        'No live command execution: legal conclusions, provider commitments, real loans, escrow release, payments, stablecoin settlement, token collateral, and production commitments stay blocked.',
      ],
    },
    {
      order: 6,
      label: 'Step 6 Homepage publication sequence review',
      command_state: 'HOLD_FOR_PUBLICATION_GO',
      decision_ref: 'homepage_publication',
      founder_prompt: 'Review homepage copy direction, PUBLICATION_GO evidence, exact-file replacement package, deploy setup, URL smoke, and invite/share separation before any public homepage action.',
      evidence_target: 'docs/smartcontractor-public-homepage-deploy-sequencing-2026-06-03.md',
      blocked_live_actions: [
        'No live command execution: public index.html replacement, whitepaper.html edit, GitHub Pages/Vercel/DNS/Supabase changes, URL sharing, tester invites, live finance, provider/legal commitments, and production release stay blocked.',
      ],
    },
  ];
  const founderHandoffToday = [
    {
      id: 'auth_admin_live_blocker',
      label: 'Auth/Admin live blocker',
      handoff_state: 'FOUNDER_EVIDENCE_REQUIRED',
      owner: 'Founder',
      founder_action: 'Run same-browser Magic Link, profile binding, and founder admin readiness evidence; report only PASS/FAIL/SKIPPED and safe request IDs.',
      evidence_source: 'docs/smartcontractor-founder-auth-evidence-template.md',
      required_report_fields: ['magic_link_status', 'profile_binding_status', 'admin_membership_status', 'safe_request_id', 'next_decision'],
      blocked_live_actions: [
        'magic_link_url_paste',
        'service_role_key_use',
        'admin_memberships_insert',
        'auth_role_mutation',
        'strict_rls_apply',
        'live_supabase_write',
        'production_release',
      ],
      no_secret_requested: true,
      no_live_supabase_write_attempted: true,
      no_external_account_change_attempted: true,
      no_public_file_edit_attempted: true,
      no_public_url_share_attempted: true,
      no_tester_invite_attempted: true,
      no_live_finance_action_attempted: true,
      no_legal_provider_decision_attempted: true,
      no_production_release_attempted: true,
    },
    {
      id: 'deployment_public_url_blocker',
      label: 'Deploy/public URL blocker',
      handoff_state: 'FOUNDER_ACCOUNT_REQUIRED',
      owner: 'Founder',
      founder_action: 'Choose or hold deployment target, account owner, env owner, rollback owner, and public URL smoke evidence path before any external setup.',
      evidence_source: 'docs/smartcontractor-deployment-decision-prep.md',
      required_report_fields: ['deploy_target', 'account_owner', 'environment_owner', 'rollback_owner', 'public_url_smoke_status'],
      blocked_live_actions: [
        'vercel_import',
        'github_pages_setting_change',
        'dns_change',
        'namecheap_change',
        'supabase_redirect_update',
        'production_env_var_change',
        'public_url_share',
        'tester_invite',
        'production_deploy',
      ],
      no_secret_requested: true,
      no_live_supabase_write_attempted: true,
      no_external_account_change_attempted: true,
      no_public_file_edit_attempted: true,
      no_public_url_share_attempted: true,
      no_tester_invite_attempted: true,
      no_live_finance_action_attempted: true,
      no_legal_provider_decision_attempted: true,
      no_production_release_attempted: true,
    },
    {
      id: 'homepage_publication_blocker',
      label: 'Homepage publication blocker',
      handoff_state: 'PUBLICATION_GO_REQUIRED',
      owner: 'Founder',
      founder_action: 'Review local homepage direction, final QA, exact replacement diff, rollback owner, and standalone PUBLICATION_GO before any public index.html change.',
      evidence_source: 'docs/smartcontractor-public-homepage-deploy-sequencing-2026-06-03.md',
      required_report_fields: ['copy_direction_decision', 'final_qa_status', 'replacement_diff_status', 'rollback_owner', 'publication_decision'],
      blocked_live_actions: [
        'public_index_html_replacement',
        'public_whitepaper_html_edit',
        'github_pages_setting_change',
        'vercel_import',
        'dns_change',
        'public_url_share',
        'tester_invite',
        'production_release',
      ],
      no_secret_requested: true,
      no_live_supabase_write_attempted: true,
      no_external_account_change_attempted: true,
      no_public_file_edit_attempted: true,
      no_public_url_share_attempted: true,
      no_tester_invite_attempted: true,
      no_live_finance_action_attempted: true,
      no_legal_provider_decision_attempted: true,
      no_production_release_attempted: true,
    },
    {
      id: 'contract_review_next_step',
      label: 'Contract review next step',
      handoff_state: 'GO_LOCAL_REVIEW_ONLY',
      owner: 'Founder/security/provider/legal review',
      founder_action: 'Review local gcscworkcap1, gcscclaim111, gcsccredit11, and gcscadvance1 packets before any XPR, ClaimBridge, credit, advance, repayment, or custody action.',
      evidence_source: 'docs/smartcontractor-smart-contract-deployment-blockers.md',
      required_report_fields: ['contract_module', 'review_owner', 'open_question', 'decision_state', 'blocked_next_action'],
      blocked_live_actions: [
        'xpr_signature_request',
        'xpr_deployment',
        'claimbridge_funding',
        'working_capital_funding',
        'escrow_backed_advance_payout',
        'repayment_routing',
        'token_custody',
        'token_collateral_lock',
      ],
      no_secret_requested: true,
      no_live_supabase_write_attempted: true,
      no_external_account_change_attempted: true,
      no_public_file_edit_attempted: true,
      no_public_url_share_attempted: true,
      no_tester_invite_attempted: true,
      no_live_finance_action_attempted: true,
      no_legal_provider_decision_attempted: true,
      no_production_release_attempted: true,
    },
    {
      id: 'legal_provider_finance_blocker',
      label: 'Legal/provider finance blocker',
      handoff_state: 'BLOCKED_FOR_EXTERNAL_REVIEW',
      owner: 'Founder/legal/provider',
      founder_action: 'Use local review packets to prepare attorney/provider questions for working capital, escrow, payments, repayment routing, stablecoin settlement, and token collateral.',
      evidence_source: 'docs/whitepaper-v1-3-legal-provider-review-packet.md',
      required_report_fields: ['question_area', 'review_owner', 'evidence_source', 'risk_level', 'blocked_next_action'],
      blocked_live_actions: [
        'legal_conclusion',
        'provider_commitment',
        'real_payment',
        'real_loan',
        'real_escrow',
        'repayment_routing',
        'stablecoin_settlement',
        'token_collateral_lock',
        'production_release',
      ],
      no_secret_requested: true,
      no_live_supabase_write_attempted: true,
      no_external_account_change_attempted: true,
      no_public_file_edit_attempted: true,
      no_public_url_share_attempted: true,
      no_tester_invite_attempted: true,
      no_live_finance_action_attempted: true,
      no_legal_provider_decision_attempted: true,
      no_production_release_attempted: true,
    },
  ];
  const founderAuthNextStepReadiness = [
    {
      id: 'founder_auth_same_browser_magic_link',
      label: 'Same-browser Magic Link next step',
      readiness_state: 'FOUNDER_MAGIC_LINK_REQUIRED',
      owner: 'Founder',
      required_evidence: [
        'Magic Link email received: yes/no',
        'Magic Link opened in same browser: yes/no',
        'Check Founder Auth Setup clicked: yes/no',
        'safe X-Request-Id from the local Founder Auth Setup screen',
      ],
      next_safe_action:
        'Founder signs in locally, then records only non-secret PASS/FAIL/SKIPPED status from the same browser.',
      route: '/api/admin/founder-auth-setup',
      evidence_source: 'docs/smartcontractor-founder-auth-evidence-template.md',
      blocked_live_actions: [
        'magic_link_url_paste',
        'token_paste',
        'service_role_key_use',
        'admin_memberships_insert',
        'profile_repair_write',
        'strict_rls_apply',
        'deploy_setting_change',
        'public_beta_flip',
        'payment_or_loan_action',
        'escrow_or_repayment_action',
        'stablecoin_settlement',
        'token_collateral_lock',
        'legal_or_provider_decision',
        'production_release',
      ],
      no_secret_requested: true,
      no_profile_repair_attempted: true,
      no_admin_membership_insert_attempted: true,
      no_strict_rls_apply_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'founder_auth_profile_binding_review',
      label: 'Founder profile binding review',
      readiness_state: 'PROFILE_BINDING_EVIDENCE_REQUIRED',
      owner: 'Founder + Codex-local',
      required_evidence: [
        'Authenticated: yes/no',
        'Profile linked: yes/no',
        'Selected Auth user confirmed on founder screen: yes/no/not shown',
        'Visible admin role status: none/founder/admin/unknown',
      ],
      next_safe_action:
        'If profile linked is no, keep the result in review and prepare a separate profile-link repair request without writing live rows.',
      route: '/api/admin/founder-auth-setup/report',
      evidence_source: 'docs/smartcontractor-founder-auth-admin-activation-prep.md',
      blocked_live_actions: [
        'profiles_auth_user_id_update',
        'profile_merge_or_delete',
        'admin_memberships_insert',
        'auth_role_mutation',
        'strict_rls_apply',
        'live_supabase_write',
        'deploy_setting_change',
        'public_beta_flip',
        'payment_or_loan_action',
        'escrow_or_repayment_action',
        'legal_or_provider_decision',
        'production_release',
      ],
      no_secret_requested: true,
      no_profile_repair_attempted: true,
      no_admin_membership_insert_attempted: true,
      no_strict_rls_apply_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'founder_admin_activation_stop_gate',
      label: 'Founder admin activation stop gate',
      readiness_state: 'BLOCKED_UNTIL_EXPLICIT_LIVE_APPROVAL',
      owner: 'Founder',
      required_evidence: [
        'current-thread same-browser Founder Auth Setup evidence',
        'selected founder Auth user confirmation',
        'profile linked: yes',
        'admin roles shown: none, unless already verified',
        'separate founder approval phrase for live admin activation',
      ],
      next_safe_action:
        'Prepare only the written request draft; do not insert admin_memberships, apply strict RLS, deploy, invite testers, or enable finance.',
      route: '/api/admin/founder-auth-setup/report',
      evidence_source: 'docs/smartcontractor-founder-auth-admin-live-decision-packet.md',
      blocked_live_actions: [
        'admin_memberships_insert',
        'admin_memberships_update',
        'auth_role_mutation',
        'strict_rls_apply',
        'live_supabase_write',
        'deploy_setting_change',
        'public_url_share',
        'tester_invite',
        'public_beta_flip',
        'payment_or_loan_action',
        'escrow_or_repayment_action',
        'stablecoin_settlement',
        'token_collateral_lock',
        'legal_or_provider_decision',
        'production_release',
      ],
      no_secret_requested: true,
      no_profile_repair_attempted: true,
      no_admin_membership_insert_attempted: true,
      no_strict_rls_apply_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_live_action_attempted: true,
    },
  ];
  const deploymentNextStepReadiness = [
    {
      id: 'deployment_target_selection_review',
      label: 'Deployment target selection review',
      readiness_state: 'READY_FOR_FOUNDER_DEPLOY_TARGET_REVIEW',
      owner: 'Founder + Codex-local',
      required_evidence: [
        'preferred host: Vercel first app host, GitHub Pages docs/static-only, or local-only hold',
        'repository/root scope reviewed: construction-ai for app deployment',
        'latest local check run recorded before external setup',
        'rollback owner and hold decision recorded before any public URL sharing',
      ],
      next_safe_action:
        'Keep deployment prep local and use the founder decision packet before any Vercel import, GitHub Pages setting, DNS, or public URL action.',
      evidence_source: 'docs/smartcontractor-deployment-decision-prep.md',
      blocked_live_actions: [
        'vercel_import',
        'github_pages_setting_change',
        'dns_change',
        'namecheap_change',
        'production_env_var_change',
        'public_url_share',
        'tester_invite',
        'production_deploy',
        'payment_or_loan_action',
        'escrow_or_repayment_action',
        'stablecoin_settlement',
        'token_collateral_lock',
        'legal_or_provider_decision',
        'production_release',
      ],
      no_external_account_change_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_dns_change_attempted: true,
      no_supabase_redirect_change_attempted: true,
      no_public_url_share_attempted: true,
      no_tester_invite_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'deployment_account_session_boundary',
      label: 'Deployment account session boundary',
      readiness_state: 'BLOCKED_FOR_FOUNDER_ACCOUNT_SESSION_REVIEW',
      owner: 'Founder',
      required_evidence: [
        'account owner identified without credentials in chat',
        'browser profile/session owner identified by founder',
        'MFA and billing exposure reviewed by founder outside Codex',
        'external account stop boundary acknowledged before setup',
      ],
      next_safe_action:
        'Founder reviews account/session ownership directly in the external service; Codex prepares only checklists and local evidence.',
      evidence_source: 'docs/smartcontractor-deployment-founder-env-map.md',
      blocked_live_actions: [
        'external_account_login',
        'vercel_account_connection',
        'github_pages_setting_change',
        'billing_plan_change',
        'team_or_org_invite',
        'production_env_var_change',
        'service_role_key_entry',
        'public_url_share',
        'tester_invite',
        'production_deploy',
        'payment_or_loan_action',
        'legal_or_provider_decision',
        'production_release',
      ],
      no_external_account_change_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_dns_change_attempted: true,
      no_supabase_redirect_change_attempted: true,
      no_public_url_share_attempted: true,
      no_tester_invite_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'public_beta_url_smoke_evidence_intake',
      label: 'Public beta URL smoke evidence intake',
      readiness_state: 'LOCAL_EVIDENCE_TEMPLATE_READY_URL_PENDING',
      owner: 'Founder + Codex-local',
      required_evidence: [
        'public_beta_url_label or url_id only; no real URL in tracked docs',
        'deployed commit and environment label',
        'app shell, /api/health, request ID, security headers, Auth redirect status',
        'no-real-money banner, disabled payment/loan/escrow/token collateral evidence',
        'rollback_or_hold_decision before invite/share review',
      ],
      next_safe_action:
        'Use the redacted intake template after founder-controlled deployment; keep share/invite blocked until smoke evidence is complete.',
      evidence_source: 'docs/smartcontractor-public-beta-url-smoke-evidence-intake.md',
      blocked_live_actions: [
        'real_public_url_in_repo',
        'public_url_share',
        'tester_invite',
        'supabase_redirect_update',
        'dns_change',
        'production_deploy',
        'payment_or_loan_action',
        'escrow_or_repayment_action',
        'stablecoin_settlement',
        'token_collateral_lock',
        'provider_commitment',
        'legal_or_provider_decision',
        'production_release',
      ],
      no_external_account_change_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_dns_change_attempted: true,
      no_supabase_redirect_change_attempted: true,
      no_public_url_share_attempted: true,
      no_tester_invite_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'supabase_redirect_env_owner_boundary',
      label: 'Supabase redirect and env owner boundary',
      readiness_state: 'BLOCKED_EXTERNAL_ACTION_FOUNDER_ONLY',
      owner: 'Founder',
      required_evidence: [
        'deployed URL exists and is smoke-checked first',
        'Auth redirect callback path reviewed without Magic Link URL or tokens',
        'environment owner recorded for public browser keys and server-only secrets',
        'service-role/provider secrets remain founder-controlled and out of repo/chat',
      ],
      next_safe_action:
        'Prepare only placeholder names and redacted evidence fields; founder changes redirects and environment values directly if approved later.',
      evidence_source: 'docs/smartcontractor-deployment-founder-env-map.md',
      blocked_live_actions: [
        'supabase_redirect_update',
        'supabase_project_setting_change',
        'service_role_key_entry',
        'production_env_var_change',
        'payment_provider_secret_entry',
        'vercel_env_change',
        'public_url_share',
        'tester_invite',
        'payment_or_loan_action',
        'escrow_or_repayment_action',
        'stablecoin_settlement',
        'token_collateral_lock',
        'legal_or_provider_decision',
        'production_release',
      ],
      no_external_account_change_attempted: true,
      no_deploy_setting_change_attempted: true,
      no_dns_change_attempted: true,
      no_supabase_redirect_change_attempted: true,
      no_public_url_share_attempted: true,
      no_tester_invite_attempted: true,
      no_live_action_attempted: true,
    },
  ];

  res.json({
    request_id: req.id || null,
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
    traditional_first_public_copy_gate: traditionalFirstPublicCopyGate,
    founder_auth_next_step_readiness: founderAuthNextStepReadiness,
    deployment_next_step_readiness: deploymentNextStepReadiness,
    homepage_publication_sequence_gate: homepagePublicationSequenceGate,
    homepage_publication_review_packet: homepagePublicationReviewPacket,
    homepage_publication_founder_decision_script: homepagePublicationFounderDecisionScript,
    homepage_publication_evidence_checklist: homepagePublicationEvidenceChecklist,
    homepage_static_asset_candidate: homepageStaticAssetCandidate,
    homepage_publication_decision_summary: homepagePublicationDecisionSummary,
    homepage_publication_final_qa_hold: homepagePublicationFinalQaHold,
    tester_finance_contract_quickstart: testerFinanceContractQuickstart,
    tester_finance_contract_walkthrough_gate: testerFinanceContractWalkthroughGate,
    tester_finance_contract_boundary_pack: testerFinanceContractBoundaryPack,
    tester_finance_contract_walkthrough_script: testerFinanceContractWalkthroughScript,
    tester_finance_contract_walkthrough_triage_matrix: testerFinanceContractWalkthroughTriageMatrix,
    tester_finance_contract_walkthrough_debrief_packet: testerFinanceContractWalkthroughDebriefPacket,
    tester_finance_contract_reviewer_notes: testerFinanceContractReviewerNotes,
    tester_finance_contract_live_confusion_safety_pack: testerFinanceContractLiveConfusionSafetyPack,
    tester_finance_contract_session_safety_checklist: testerFinanceContractSessionSafetyChecklist,
    tester_finance_contract_safe_handoff_summary: testerFinanceContractSafeHandoffSummary,
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
    founder_live_blocker_handoff_pack: founderLiveBlockerHandoffPack,
    week_one_closeout_handoff: weekOneCloseoutHandoff,
    investor_founder_package_readiness: investorFounderPackageReadiness,
    founder_evening_action_summary: founderEveningActionSummary,
    founder_evening_decision_matrix: founderEveningDecisionMatrix,
    founder_evening_command_board: founderEveningCommandBoard,
    founder_handoff_today: founderHandoffToday,
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
      'Keep gcscworkcap1, gcscclaim111, gcsccredit11, and gcscadvance1 feedback separated from live deployment, ClaimBridge advance funding, contract-backed working-capital funding, escrow-backed advance payout, repayment routing, and token custody approvals.',
      'Use docs/smartcontractor-founder-action-queue.md for founder-only deploy, Auth, admin, RLS, legal, provider, and grant steps.',
    ],
    blocked_until_founder: [
      'Founder Magic Link/Admin activation for strict admin smoke tests.',
      'Deploy account and public URL configuration.',
      'Supabase Auth redirect URLs for deployed domain.',
      'Attorney/provider review before real loans, escrow, payments, or token collateral.',
      'Founder/legal/provider/security/XPR review before live smart contract deployment, ClaimBridge advance funding, contract-backed working-capital funding, escrow-backed advance payout, repayment routing, or token custody.',
    ],
  });
});

app.get('/api/admin/homepage-publication-final-qa-preflight', (req, res) => {
  const projectRoot = path.join(__dirname, '..');
  const candidateRelative = 'index-v1-3-static-draft.html';
  const publicHomepageRelative = 'index.html';
  const publicWhitepaperRelative = 'whitepaper.html';
  const candidatePath = path.join(projectRoot, candidateRelative);
  const publicHomepagePath = path.join(projectRoot, publicHomepageRelative);
  const publicWhitepaperPath = path.join(projectRoot, publicWhitepaperRelative);
  const readLocalText = (filePath) => (fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '');
  const hashText = (value) => crypto.createHash('sha256').update(value).digest('hex');
  const candidateText = readLocalText(candidatePath);
  const publicHomepageText = readLocalText(publicHomepagePath);
  const publicWhitepaperText = readLocalText(publicWhitepaperPath);
  const externalAssetUrls = candidateText.match(/\b(?:https?:\/\/|\/\/)[^\s"'<>]+/gi) || [];
  const blockedClaimPatterns = [
    ['blockchain', /\bblockchain\b/i],
    ['web3', /\bweb3\b/i],
    ['token', /\btoken\b/i],
    ['xpr', /\bxpr\b/i],
    ['fio', /\bfio\b/i],
    ['metallicus', /\bmetallicus\b/i],
    ['stablecoin', /\bstablecoin\b/i],
    ['defi', /\bdefi\b/i],
    ['dao', /\bdao\b/i],
    ['instant loan', /\binstant\s+loans?\b/i],
    ['decentralized escrow', /\bdecentralized\s+escrow\b/i],
    ['payments released on blockchain', /\bpayments?\s+released\s+on\s+blockchain\b/i],
    ['reputation as collateral', /\breputation\s+as\s+collateral\b/i],
  ];
  const blockedClaimsFound = blockedClaimPatterns
    .filter(([, pattern]) => pattern.test(candidateText))
    .map(([id]) => id);
  const requiredSections = ['mission', 'products', 'technology', 'review'];
  const missingSections = requiredSections.filter((sectionId) => !new RegExp(`id=["']${sectionId}["']`, 'i').test(candidateText));
  const requiredLocalLinks = ['href="#products"', 'href="whitepaper-v1-3-draft.html"', 'href="whitepaper.html"'];
  const missingLocalLinks = requiredLocalLinks.filter((link) => !candidateText.includes(link));
  const requiredFirstViewportSignals = [
    ['product_name', 'SmartContractor by GCSC'],
    ['homepage_evidence_rail', 'Homepage Evidence Rail'],
    ['project_intake_evidence', 'Project intake'],
    ['milestone_evidence_signal', 'Milestone evidence'],
    ['dispute_packet_signal', 'Dispute packet'],
    ['provider_review_data_signal', 'Provider review data'],
    ['construction_trust_role', 'Construction Trust Infrastructure'],
    ['workflow_headline', 'Trust infrastructure for'],
    ['construction_workflows_headline', 'construction workflows'],
    ['demo_status_publication_gate', 'Publication Gate: NO-GO'],
  ];
  const missingFirstViewportSignals = requiredFirstViewportSignals
    .filter(([, token]) => !candidateText.includes(token))
    .map(([id]) => id);
  const requiredProductSectionSignals = [
    ['product_review_order', 'Traditional Product Review Order'],
    ['homeowner_project_request', 'Homeowner project request'],
    ['contractor_profile_verification', 'Contractor profile and verification readiness'],
    ['bid_contract_records', 'Bid records and project contract records'],
    ['milestone_evidence_approval', 'Milestone evidence and approval readiness'],
    ['dispute_evidence_peer_review', 'Dispute evidence and peer review'],
    ['contractor_reputation_history', 'Contractor reputation and completion history'],
    ['working_capital_provider_review', 'Working-capital readiness packet for future provider review'],
    ['admin_audit_request_ids', 'Admin audit trail and request IDs'],
    ['future_reviewed_infrastructure_layer', 'Future reviewed infrastructure layer'],
  ];
  const missingProductSectionSignals = requiredProductSectionSignals
    .filter(([, token]) => !candidateText.includes(token))
    .map(([id]) => id);
  const requiredIntegrationPortSignals = [
    ['integration_ports', 'Integration Readiness Ports'],
    ['contractor_profile_port', 'Contractor profile port'],
    ['project_contract_port', 'Project contract port'],
    ['milestone_evidence_port', 'Milestone evidence port'],
    ['working_capital_readiness_port', 'Working-capital readiness port'],
    ['repayment_context_port', 'Repayment context port'],
    ['dispute_evidence_port', 'Dispute evidence port'],
    ['request_id_audit_port', 'Request-id and audit port'],
    ['public_wording_port', 'Public wording port'],
    ['port_states_traditional_only', 'traditional_only'],
    ['port_states_provider_ready', 'provider_ready'],
    ['port_states_future_review', 'future_review_required'],
  ];
  const missingIntegrationPortSignals = requiredIntegrationPortSignals
    .filter(([, token]) => !candidateText.includes(token))
    .map(([id]) => id);
  const requiredVisualTokens = [
    ['construction_trust_background', '--bg: #101214'],
    ['construction_trust_panel', '--panel: #161a1f'],
    ['construction_trust_card_panel', '--panel-2: #1f252c'],
    ['construction_trust_brand', '--brand: #2f6f8f'],
    ['construction_trust_teal', '--brand-2: #38a3a5'],
    ['safety_amber_accent', '--orange: #f59e0b'],
    ['success_status', '--success: #22c55e'],
    ['compact_radius', '--radius: 8px'],
    ['desktop_fixed_heading_type', 'font-size: 48px;'],
    ['tablet_fixed_heading_type', 'font-size: 44px;'],
    ['mobile_fixed_heading_type', 'font-size: 34px;'],
  ];
  const missingVisualTokens = requiredVisualTokens
    .filter(([, token]) => !candidateText.includes(token))
    .map(([id]) => id);
  const requiredBrowserViewports = [
    {
      id: 'desktop_first_viewport_hero_fit',
      viewport: '1280 x 720',
      required_evidence: 'Homepage Evidence Rail, headline, lead copy, and hero CTA controls fully visible in the first viewport.',
      evidence_source: 'docs/smartcontractor-public-homepage-browser-qa-evidence-status-2026-06-03.md',
    },
    {
      id: 'mobile_first_viewport_hero_fit',
      viewport: '390 x 844',
      required_evidence: 'Homepage Evidence Rail, headline, lead copy, and stacked hero CTA controls fully visible with no horizontal overflow.',
      evidence_source: 'docs/smartcontractor-public-homepage-browser-qa-evidence-status-2026-06-03.md',
    },
  ];
  const blockedVisualStylePatterns = [
    ['legacy_purple_brand_hex', /#8b5cf6/i],
    ['legacy_purple_secondary_hex', /#a78bfa/i],
    ['legacy_purple_panel_hex', /#12121e/i],
    ['legacy_purple_panel_2_hex', /#1a1a2e/i],
    ['legacy_near_black_purple_bg_hex', /#0a0a0f/i],
    ['legacy_purple_deep_hex', /#5b21b6/i],
    ['legacy_purple_hover_hex', /#7c3aed/i],
    ['legacy_purple_rgba', /rgba\(139,\s*92,\s*246/i],
    ['legacy_radial_purple_rgba', /rgba\(124,\s*58,\s*237/i],
    ['decorative_hero_radial_glow', /radial-gradient/i],
    ['hero_pseudo_glow', /\.hero::before/i],
    ['viewport_scaled_type', /clamp\(/i],
  ];
  const visualStyleFindings = blockedVisualStylePatterns
    .filter(([, pattern]) => pattern.test(candidateText))
    .map(([id]) => id);
  const checks = [
    {
      id: 'candidate_file_present',
      label: 'Candidate file present',
      status: candidateText ? 'pass' : 'blocked',
      evidence: candidateText ? candidateRelative : 'missing local candidate',
      next_safe_action: candidateText ? 'Continue local preflight only.' : 'Restore the local static candidate before founder review.',
    },
    {
      id: 'first_viewport_product_signal_guard',
      label: 'First viewport product signal guard',
      status: missingFirstViewportSignals.length ? 'blocked' : 'pass',
      evidence: missingFirstViewportSignals.length
        ? `Missing first viewport signals: ${missingFirstViewportSignals.join(', ')}`
        : 'SmartContractor by GCSC, homepage evidence rail, construction trust role, workflow headline, and NO-GO status are present in the local candidate.',
      next_safe_action: missingFirstViewportSignals.length
        ? 'Restore required first-viewport product signals before founder homepage review.'
        : 'Keep the first viewport product signal visible after future homepage edits.',
    },
    {
      id: 'product_section_order_guard',
      label: 'Product section order guard',
      status: missingProductSectionSignals.length ? 'blocked' : 'pass',
      evidence: missingProductSectionSignals.length
        ? `Missing product section signals: ${missingProductSectionSignals.join(', ')}`
        : 'Traditional product review order covers homeowner request, contractor readiness, bid/contract records, milestone evidence, dispute review, reputation, working-capital readiness, admin audit, and future reviewed infrastructure.',
      next_safe_action: missingProductSectionSignals.length
        ? 'Restore the traditional product section order before founder homepage review.'
        : 'Keep product sections traditional-first and future infrastructure lower in the page.',
    },
    {
      id: 'integration_port_state_guard',
      label: 'Integration port state guard',
      status: missingIntegrationPortSignals.length ? 'blocked' : 'pass',
      evidence: missingIntegrationPortSignals.length
        ? `Missing integration port signals: ${missingIntegrationPortSignals.join(', ')}`
        : 'Integration readiness ports and traditional/provider/future-review states are present without approving live infrastructure.',
      next_safe_action: missingIntegrationPortSignals.length
        ? 'Restore integration port and state signals before founder homepage review.'
        : 'Keep plug-in ports visible as local readiness architecture without public live-action claims.',
    },
    {
      id: 'blocked_public_claim_scan',
      label: 'Blocked public claim scan',
      status: blockedClaimsFound.length ? 'blocked' : 'pass',
      evidence: blockedClaimsFound.length ? blockedClaimsFound.join(', ') : 'No blocked blockchain/Web3/token/provider finance claims found in candidate.',
      next_safe_action: blockedClaimsFound.length ? 'Revise the local candidate before any founder publication review.' : 'Keep candidate wording traditional-first.',
    },
    {
      id: 'external_asset_scan',
      label: 'External asset scan',
      status: externalAssetUrls.length ? 'review' : 'pass',
      evidence: externalAssetUrls.length ? externalAssetUrls.join(', ') : 'No external asset URLs found in candidate.',
      next_safe_action: externalAssetUrls.length ? 'Confirm or remove external assets before PUBLICATION_GO.' : 'Keep static CSS/system-font posture.',
    },
    {
      id: 'section_anchor_scan',
      label: 'Section anchor scan',
      status: missingSections.length ? 'blocked' : 'pass',
      evidence: missingSections.length ? `Missing sections: ${missingSections.join(', ')}` : `Required sections present: ${requiredSections.join(', ')}`,
      next_safe_action: missingSections.length ? 'Restore required section anchors before browser QA.' : 'Continue local link and visual QA.',
    },
    {
      id: 'local_link_cta_scan',
      label: 'Local link and CTA scan',
      status: missingLocalLinks.length ? 'review' : 'pass',
      evidence: missingLocalLinks.length ? `Missing local links: ${missingLocalLinks.join(', ')}` : 'Required local review links and #products CTA are present.',
      next_safe_action: missingLocalLinks.length ? 'Review local navigation links before founder browser QA.' : 'Continue local-only founder review.',
    },
    {
      id: 'static_visual_style_guard',
      label: 'Static visual style guard',
      status: visualStyleFindings.length || missingVisualTokens.length ? 'blocked' : 'pass',
      evidence: visualStyleFindings.length || missingVisualTokens.length
        ? `Findings: ${visualStyleFindings.join(', ') || 'none'}; missing tokens: ${missingVisualTokens.join(', ') || 'none'}`
        : 'Construction trust palette, 8px radius, no decorative radial hero glow, and fixed responsive type are present.',
      next_safe_action: visualStyleFindings.length || missingVisualTokens.length
        ? 'Restore static visual polish before any founder publication review.'
        : 'Keep visual guard passing after future homepage CSS edits.',
    },
    {
      id: 'browser_viewport_evidence_guard',
      label: 'Browser viewport evidence guard',
      status: 'review',
      evidence: 'Required local Browser QA viewports are desktop 1280 x 720 and mobile 390 x 844 for the exact static homepage candidate.',
      next_safe_action: 'Rerun and attach local Browser QA evidence after any first-viewport layout, hero, CTA, or evidence-rail edit before PUBLICATION_GO.',
    },
    {
      id: 'public_file_hash_snapshot',
      label: 'Public file hash snapshot',
      status: publicHomepageText && publicWhitepaperText ? 'review' : 'blocked',
      evidence: publicHomepageText && publicWhitepaperText ? 'Current public homepage and whitepaper hashes recorded for rollback review.' : 'Public homepage or whitepaper file missing.',
      next_safe_action: 'Use hashes for review only; do not archive, replace, deploy, or share without founder-controlled approval.',
    },
    {
      id: 'publication_permission_gate',
      label: 'Publication permission gate',
      status: 'blocked',
      evidence: 'publication_allowed=false; standalone PUBLICATION_GO and final public-file QA are not present in this local preflight.',
      next_safe_action: 'Stop before public index.html replacement, archive execution, deploy settings, URL sharing, tester invites, or live actions.',
    },
  ];
  const passed = checks.filter((item) => item.status === 'pass').length;
  const review = checks.filter((item) => item.status === 'review').length;
  const blocked = checks.filter((item) => item.status === 'blocked').length;
  res.json({
    request_id: req.id || null,
    generated_at: new Date().toISOString(),
    mode: 'homepage_publication_final_qa_preflight',
    preflight_state: blocked > 1 ? 'BLOCKED_LOCAL_PREFLIGHT' : 'LOCAL_PREFLIGHT_READY_PUBLICATION_BLOCKED',
    publication_allowed: false,
    candidate: {
      file: candidateRelative,
      exists: Boolean(candidateText),
      sha256: candidateText ? hashText(candidateText) : null,
      blocked_claims_found: blockedClaimsFound,
      external_asset_urls: externalAssetUrls,
      missing_sections: missingSections,
      missing_local_links: missingLocalLinks,
      missing_first_viewport_signals: missingFirstViewportSignals,
      required_first_viewport_signals: requiredFirstViewportSignals.map(([id, token]) => ({ id, token })),
      missing_product_section_signals: missingProductSectionSignals,
      required_product_section_signals: requiredProductSectionSignals.map(([id, token]) => ({ id, token })),
      missing_integration_port_signals: missingIntegrationPortSignals,
      required_integration_port_signals: requiredIntegrationPortSignals.map(([id, token]) => ({ id, token })),
      visual_style_findings: visualStyleFindings,
      missing_visual_tokens: missingVisualTokens,
      required_visual_tokens: requiredVisualTokens.map(([id, token]) => ({ id, token })),
      required_browser_viewports: requiredBrowserViewports,
    },
    public_targets: {
      homepage: {
        file: publicHomepageRelative,
        exists: Boolean(publicHomepageText),
        sha256: publicHomepageText ? hashText(publicHomepageText) : null,
      },
      whitepaper: {
        file: publicWhitepaperRelative,
        exists: Boolean(publicWhitepaperText),
        sha256: publicWhitepaperText ? hashText(publicWhitepaperText) : null,
      },
    },
    summary: { passed, review, blocked, total: checks.length },
    checks,
    required_next_evidence: [
      'clean Browser desktop/mobile screenshot evidence for the exact candidate',
      'final visual overlap and first-viewport inspection',
      'first viewport product signal guard after any future hero copy edit',
      'product section order guard after any future product-copy edit',
      'integration port state guard after any future architecture-copy edit',
      'static visual style guard after any future CSS edit',
      'Browser QA viewport evidence for 1280 x 720 desktop and 390 x 844 mobile',
      'final exact diff preview after founder copy approval',
      'archive/rollback owner and timestamp review',
      'standalone PUBLICATION_GO before any public file replacement',
    ],
    blocked_live_actions: [
      'public_homepage_replacement',
      'public_whitepaper_edit',
      'archive_execution',
      'deploy_setting_change',
      'public_url_share',
      'tester_invite',
      'public_beta_launch',
      'real_payment',
      'real_loan',
      'real_escrow',
      'stablecoin_settlement',
      'token_collateral_lock',
      'provider_commitment',
      'legal_decision',
      'production_release',
    ],
    no_public_homepage_edit_attempted: true,
    no_public_whitepaper_edit_attempted: true,
    no_archive_execution_attempted: true,
    no_deploy_setting_change_attempted: true,
    no_public_url_share_attempted: true,
    no_tester_invite_attempted: true,
    no_live_action_attempted: true,
  });
});

const betaFinanceContractDebriefDraftRequiredFields = [
  { id: 'role', label: 'role', pattern: /\brole\s*:/i },
  { id: 'flow', label: 'flow', pattern: /\bflow\s*:/i },
  { id: 'checkpoint_labels', label: 'checkpoint labels', pattern: /\bcheckpoints?\s*:/i },
  { id: 'request_ids', label: 'request IDs', pattern: /\brequest[-_ ]?ids?\s*:/i },
  { id: 'boundary_clarity_rating', label: 'boundary clarity rating', pattern: /\bboundary clarity rating\s*:/i },
  { id: 'triage_labels', label: 'triage labels', pattern: /\btriage labels?\s*:/i },
  { id: 'safe_issue_handoff', label: 'safe issue handoff', pattern: /\bsafe issue handoff\s*:/i },
  { id: 'founder_review_hold', label: 'founder review hold', pattern: /\bfounder review hold\s*:/i },
  { id: 'safe_debrief_note', label: 'SAFE_DEBRIEF_NOTE', pattern: /\bSAFE_DEBRIEF_NOTE\b/ },
];

const betaFinanceContractReviewerNoteRequiredFields = [
  { id: 'reviewer_role', label: 'reviewer role', pattern: /\breviewer role\s*:/i },
  { id: 'tester_role', label: 'tester role', pattern: /\btester role\s*:/i },
  { id: 'flow', label: 'flow', pattern: /\bflow\s*:/i },
  { id: 'checkpoint', label: 'checkpoint', pattern: /\bcheckpoint\s*:/i },
  { id: 'request_id', label: 'request ID', pattern: /\brequest[-_ ]?ids?\s*:/i },
  { id: 'boundary_response', label: 'boundary response', pattern: /\bboundary response\s*:/i },
  { id: 'stop_gate_state', label: 'stop gate state', pattern: /\bstop gate state\s*:/i },
  { id: 'next_safe_action', label: 'next safe action', pattern: /\bnext safe action\s*:/i },
  { id: 'safe_reviewer_note', label: 'SAFE_REVIEWER_NOTE', pattern: /\bSAFE_REVIEWER_NOTE\b/ },
];

const betaFinanceContractQuickstartAcknowledgementRequiredFields = [
  { id: 'tester_role', label: 'tester role', pattern: /\btester role\s*:/i },
  { id: 'flow', label: 'flow', pattern: /\bflow\s*:/i },
  { id: 'checkpoint', label: 'checkpoint', pattern: /\bcheckpoint\s*:/i },
  { id: 'request_id', label: 'request ID', pattern: /\brequest[-_ ]?ids?\s*:/i },
  { id: 'quickstart_understood', label: 'quickstart understood', pattern: /\bquickstart understood\s*:/i },
  { id: 'allowed_local_action', label: 'allowed local action', pattern: /\ballowed local action\s*:/i },
  { id: 'blocked_live_interpretation', label: 'blocked live interpretation', pattern: /\bblocked live interpretation\s*:/i },
  { id: 'next_local_action', label: 'next local action', pattern: /\bnext local action\s*:/i },
  { id: 'finance_contract_tester_quickstart', label: 'FINANCE_CONTRACT_TESTER_QUICKSTART', pattern: /\bFINANCE_CONTRACT_TESTER_QUICKSTART\b/ },
];

const betaFinanceContractLiveConfusionRequiredFields = [
  { id: 'reviewer_role', label: 'reviewer role', pattern: /\breviewer role\s*:/i },
  { id: 'tester_role', label: 'tester role', pattern: /\btester role\s*:/i },
  { id: 'flow', label: 'flow', pattern: /\bflow\s*:/i },
  { id: 'checkpoint', label: 'checkpoint', pattern: /\bcheckpoint\s*:/i },
  { id: 'request_id', label: 'request ID', pattern: /\brequest[-_ ]?ids?\s*:/i },
  { id: 'confusion_signal', label: 'confusion signal', pattern: /\bconfusion signal\s*:/i },
  { id: 'stop_script_response', label: 'stop script response', pattern: /\bstop script response\s*:/i },
  { id: 'safe_issue_handoff', label: 'safe issue handoff', pattern: /\bsafe issue handoff\s*:/i },
  { id: 'next_local_action', label: 'next local action', pattern: /\bnext local action\s*:/i },
  { id: 'live_confusion_review_only', label: 'LIVE_CONFUSION_REVIEW_ONLY', pattern: /\bLIVE_CONFUSION_REVIEW_ONLY\b/ },
];

const betaFinanceContractSessionSafetyRequiredFields = [
  { id: 'reviewer_role', label: 'reviewer role', pattern: /\breviewer role\s*:/i },
  { id: 'tester_role', label: 'tester role', pattern: /\btester role\s*:/i },
  { id: 'phase', label: 'phase', pattern: /\bphase\s*:/i },
  { id: 'flow', label: 'flow', pattern: /\bflow\s*:/i },
  { id: 'checkpoint', label: 'checkpoint', pattern: /\bcheckpoint\s*:/i },
  { id: 'request_id', label: 'request ID', pattern: /\brequest[-_ ]?ids?\s*:/i },
  { id: 'safe_evidence_summary', label: 'safe evidence summary', pattern: /\bsafe evidence summary\s*:/i },
  { id: 'stop_state', label: 'stop state', pattern: /\bstop state\s*:/i },
  { id: 'next_local_action', label: 'next local action', pattern: /\bnext local action\s*:/i },
  { id: 'finance_contract_session_safety', label: 'FINANCE_CONTRACT_SESSION_SAFETY', pattern: /\bFINANCE_CONTRACT_SESSION_SAFETY\b/ },
];

const betaFinanceContractDebriefBlockedLiveActions = [
  'external_send',
  'sensitive_data_storage',
  'payment_charge',
  'loan_approval',
  'escrow_release',
  'signed_contract_creation',
  'xpr_signature',
  'provider_commitment',
  'legal_decision',
  'public_beta_flip',
  'production_release',
];

const betaFinanceContractLiveConfusionBlockedActions = [
  ...betaFinanceContractDebriefBlockedLiveActions,
  'public_beta_flip',
  'external_followup',
  'stablecoin_settlement',
  'token_collateral_lock',
  'auth_rls_change',
  'provider_submission',
  'production_availability_claim',
];

const betaFinanceContractDebriefDraftInputLimits = {
  draft_text_max_characters: 4000,
  draft_text_max_lines: 60,
  safe_excerpt_max_characters: 120,
};

const traditionalFirstPublicCopyRequiredFields = [
  { id: 'construction_trust_positioning', label: 'construction trust platform positioning', pattern: /\b(construction trust|contractor matching|project records|milestone evidence|dispute readiness|admin review)\b/i },
  { id: 'demo_or_local_review_scope', label: 'demo-only or local review scope', pattern: /\b(demo[- ]only|local review|workflow review|controlled demo|no real money)\b/i },
  { id: 'no_live_finance_boundary', label: 'no live finance or real-money boundary', pattern: /\b(no real[- ]money|no live finance|no real loans|no payment movement|no escrow release)\b/i },
  { id: 'founder_review_before_publish', label: 'founder review before publish', pattern: /\b(founder review|review required|not production|before publish|before public use)\b/i },
];

const traditionalFirstPublicCopyBlockedActions = [
  'public_website_edit',
  'external_send',
  'external_provider_claim',
  'public_beta_flip',
  'payment_charge',
  'loan_approval',
  'escrow_release',
  'signed_contract_creation',
  'xpr_signature',
  'fio_registration',
  'stablecoin_settlement',
  'token_collateral_lock',
  'provider_commitment',
  'legal_decision',
  'production_release',
];

const homepagePublicationDecisionRecommendedPhrases = [
  'APPROVE_TRADITIONAL_FIRST_HOMEPAGE_DIRECTION',
  'APPROVE_HIDDEN_FUTURE_INFRASTRUCTURE_LANGUAGE',
  'ACCEPT_LOCAL_BROWSER_QA_EVIDENCE',
  'REQUIRE_COMPILED_PUBLIC_CSS',
  'KEEP_PUBLIC_REPLACEMENT_ON_HOLD',
];

const homepagePublicationDecisionOptionalPhrases = [
  'PUBLICATION_GO',
];

const homepagePublicationDecisionBlockedActions = [
  'public_homepage_replacement',
  'public_whitepaper_edit',
  'deploy_setting_change',
  'public_url_share',
  'tester_invite',
  'public_beta_launch',
  'real_payment',
  'real_loan',
  'real_escrow',
  'stablecoin_settlement',
  'token_collateral_lock',
  'xpr_signature',
  'fio_registration',
  'provider_commitment',
  'legal_decision',
  'production_release',
];

function scanBetaFinanceContractDebriefDraftText(draftText) {
  const lines = String(draftText || '').split(/\r?\n/);
  const scanDefinitions = [
    {
      id: 'secret_or_key_reference',
      label: 'Secret, token, or key reference',
      severity: 'blocked',
      pattern: /\b(password|passcode|access token|auth token|bearer token|service[-_\s]?role|api\s*key|apikey|private\s*key|seed phrase|bearer|jwt|database url|supabase url)\b|eyJ[A-Za-z0-9_-]{20,}/i,
    },
    {
      id: 'sensitive_payment_or_identity_data',
      label: 'Sensitive payment or identity data',
      severity: 'blocked',
      pattern: /\b(card number|credit card|debit card|routing number|bank account|account number|ssn|social security)\b|\b\d{3}-\d{2}-\d{4}\b|\b(?:\d[ -]*?){13,16}\b/i,
    },
    {
      id: 'live_finance_or_contract_action',
      label: 'Live finance, contract, XPR, provider, legal, or production wording',
      severity: 'blocked',
      pattern: /\b(approve loan|loan approved|charge card|payment charge|release escrow|issue refund|sign contract|create signed contract|request XPR signature|use XPR signature|go live|production release|public beta flip|provider approved|legal approved|settle stablecoin|lock token collateral|move money)\b/i,
    },
  ];

  return scanDefinitions.flatMap((definition) => (
    lines
      .map((line, index) => ({ line, index }))
      .filter(({ line }) => definition.pattern.test(line))
      .map(({ line, index }) => ({
        id: definition.id,
        label: definition.label,
        severity: definition.severity,
        line_number: index + 1,
        safe_excerpt: line.trim().slice(0, 120),
      }))
  ));
}

function scanTraditionalFirstPublicCopyText(copyText) {
  const lines = String(copyText || '').split(/\r?\n/);
  const scanDefinitions = [
    {
      id: 'secret_or_key_reference',
      label: 'Secret, token, or key reference',
      severity: 'blocked',
      pattern: /\b(password|passcode|access token|auth token|bearer token|service[-_\s]?role|api\s*key|apikey|private\s*key|seed phrase|bearer|jwt|database url|supabase url)\b|eyJ[A-Za-z0-9_-]{20,}/i,
    },
    {
      id: 'sensitive_payment_or_identity_data',
      label: 'Sensitive payment or identity data',
      severity: 'blocked',
      pattern: /\b(card number|credit card|debit card|routing number|bank account|account number|ssn|social security)\b|\b\d{3}-\d{2}-\d{4}\b|\b(?:\d[ -]*?){13,16}\b/i,
    },
    {
      id: 'web3_or_token_public_claim',
      label: 'Blockchain, Web3, token, XPR, FIO, stablecoin, or LOAN-style public wording',
      severity: 'blocked',
      pattern: /\b(blockchain|smart contract|token|xpr|fio|stablecoin|metallicus|metal blockchain|web3|defi|dao|loan integration|loan-style|proton loan)\b/i,
    },
    {
      id: 'live_finance_provider_or_legal_claim',
      label: 'Live finance, provider, legal, launch, or production claim',
      severity: 'blocked',
      pattern: /\b(approve loan|loan approved|licensed lending|approved escrow|escrow provider approved|provider partnership|legal approved|compliance approved|payment live|real[- ]money pilot approved|public beta approved|production launch|production release|go live|settle stablecoin|lock token collateral|move money)\b/i,
    },
  ];

  return scanDefinitions.flatMap((definition) => (
    lines
      .map((line, index) => ({ line, index }))
      .filter(({ line }) => definition.pattern.test(line))
      .map(({ line, index }) => ({
        id: definition.id,
        label: definition.label,
        severity: definition.severity,
        line_number: index + 1,
        safe_excerpt: line.trim().slice(0, betaFinanceContractDebriefDraftInputLimits.safe_excerpt_max_characters),
      }))
  ));
}

function scanHomepagePublicationDecisionText(decisionText) {
  const lines = String(decisionText || '').split(/\r?\n/);
  const scanDefinitions = [
    {
      id: 'secret_or_key_reference',
      label: 'Secret, token, or key reference',
      severity: 'blocked',
      pattern: /\b(password|passcode|access token|auth token|bearer token|service[-_\s]?role|api\s*key|apikey|private\s*key|seed phrase|bearer|jwt|database url|supabase url)\b|eyJ[A-Za-z0-9_-]{20,}/i,
    },
    {
      id: 'sensitive_payment_or_identity_data',
      label: 'Sensitive payment or identity data',
      severity: 'blocked',
      pattern: /\b(card number|credit card|debit card|routing number|bank account|account number|ssn|social security)\b|\b\d{3}-\d{2}-\d{4}\b|\b(?:\d[ -]*?){13,16}\b/i,
    },
    {
      id: 'immediate_public_replacement_or_deploy_action',
      label: 'Immediate public replacement, deploy, URL share, tester invite, or public beta action',
      severity: 'blocked',
      pattern: /\b(replace|overwrite|publish|swap|edit)\b.{0,80}\b(index\.html|whitepaper\.html|homepage|public homepage|public site)\b|\b(deploy now|deploy to|change deploy settings|turn on github pages|turn on vercel|change dns|namecheap|share public url|invite testers|start public beta|production release|go live now)\b/i,
    },
    {
      id: 'live_finance_web3_or_provider_action',
      label: 'Live finance, Web3, provider, legal, or production action',
      severity: 'blocked',
      pattern: /\b(approve loan|loan approved|fund contractor|charge payment|move money|release escrow|settle stablecoin|lock token collateral|request xpr signature|fio registration|provider approved|legal approved|provider partnership|licensed lending approved|production launch)\b/i,
    },
  ];

  return scanDefinitions.flatMap((definition) => (
    lines
      .map((line, index) => ({ line, index }))
      .filter(({ line }) => definition.pattern.test(line))
      .map(({ line, index }) => ({
        id: definition.id,
        label: definition.label,
        severity: definition.severity,
        line_number: index + 1,
        safe_excerpt: line.trim().slice(0, betaFinanceContractDebriefDraftInputLimits.safe_excerpt_max_characters),
      }))
  ));
}

function getBetaFinanceContractDebriefDraftInputWarnings(draftText) {
  const warnings = [];
  if (draftText.length > betaFinanceContractDebriefDraftInputLimits.draft_text_max_characters) {
    warnings.push('draft_text_max_4000_exceeded');
  }
  if (String(draftText || '').split(/\r?\n/).length > betaFinanceContractDebriefDraftInputLimits.draft_text_max_lines) {
    warnings.push('draft_text_max_60_lines_exceeded');
  }
  return warnings;
}

function buildBetaFinanceContractDebriefDraftRecoveryActions(inputLimitWarnings, missingRequiredFields, blockedFindings) {
  const actions = [
    {
      id: 'trim_to_required_debrief_fields',
      label: 'Trim to required debrief fields',
      action_status: inputLimitWarnings.length ? 'recommended' : 'available',
      safe_next_action: 'Keep only role, flow, checkpoints, request ID, boundary clarity rating, triage labels, safe issue handoff, founder review hold, and SAFE_DEBRIEF_NOTE.',
    },
    {
      id: 'remove_secrets_sensitive_live_wording',
      label: 'Remove unsafe wording',
      action_status: blockedFindings.length ? 'required' : 'available',
      safe_next_action: 'Remove secrets, payment or identity data, and any wording that approves payment, loan, escrow, signed contract, XPR, provider, legal, public beta, or production actions.',
    },
    {
      id: 'complete_missing_debrief_fields',
      label: 'Complete missing fields',
      action_status: missingRequiredFields.length ? 'recommended' : 'available',
      safe_next_action: `Add missing fields before issue handoff: ${missingRequiredFields.join(', ') || 'none'}.`,
    },
  ];
  return actions;
}

function buildTraditionalFirstPublicCopyValidation(req) {
  const copyText = typeof req.body?.copy_text === 'string'
    ? req.body.copy_text
    : typeof req.body?.draft_text === 'string'
      ? req.body.draft_text
      : '';
  const sourceRequestId = typeof req.body?.source_request_id === 'string' ? req.body.source_request_id.slice(0, 120) : '';
  const hasCopyText = copyText.trim().length > 0;
  const blockedFindings = scanTraditionalFirstPublicCopyText(copyText);
  const requiredFields = traditionalFirstPublicCopyRequiredFields.map((field) => field.label);
  const presentRequiredFields = traditionalFirstPublicCopyRequiredFields
    .filter((field) => field.pattern.test(copyText))
    .map((field) => field.label);
  const missingRequiredFields = traditionalFirstPublicCopyRequiredFields
    .filter((field) => !field.pattern.test(copyText))
    .map((field) => field.label);
  const requiredFieldIssues = hasCopyText
    ? missingRequiredFields.map((field) => ({
      id: 'traditional_first_public_copy_required_field_missing',
      label: `Missing ${field}`,
      severity: 'review',
      line_number: null,
      safe_excerpt: field,
    }))
    : [];
  const issues = [...blockedFindings, ...requiredFieldIssues];
  const hasBlockedFindings = blockedFindings.length > 0;
  const status = !hasCopyText
    ? 'public_copy_missing'
    : hasBlockedFindings
      ? 'public_copy_blocked_for_redaction'
      : missingRequiredFields.length
        ? 'public_copy_required_fields_missing'
        : 'safe_traditional_first_public_copy';

  return {
    generated_at: new Date().toISOString(),
    request_id: req.id || null,
    mode: 'local_beta_traditional_first_public_copy_validation',
    validation_type: 'traditional_first_public_copy_validation',
    status,
    source_request_id: sourceRequestId || null,
    copy_character_count: copyText.length,
    copy_line_count: String(copyText || '').split(/\r?\n/).length,
    required_fields: requiredFields,
    present_required_fields: presentRequiredFields,
    missing_required_fields: missingRequiredFields,
    issues,
    issue_count: issues.length,
    internal_only_terms_until_review: ['blockchain', 'smart contract', 'token', 'XPR', 'FIO', 'stablecoin', 'Metallicus/LOAN-style path', 'Web3', 'DeFi', 'DAO', 'provider partnership', 'legal approval'],
    blocked_public_claims: ['live blockchain service', 'licensed lending provider', 'approved escrow provider', 'stablecoin settlement', 'token collateral', 'provider partnership', 'legal compliance approval', 'public beta approved', 'production launch'],
    blocked_live_actions: traditionalFirstPublicCopyBlockedActions,
    traditional_first_public_copy_gate: {
      local_validation: status === 'safe_traditional_first_public_copy' ? 'ready' : 'review',
      public_website_edit: 'blocked',
      external_send: 'blocked',
      external_provider_claim: 'blocked',
      public_beta_flip: 'blocked',
      live_finance: 'blocked',
      blockchain_or_web3_public_claim: 'blocked',
      provider_commitment: 'blocked',
      legal_decision: 'blocked',
      production_release: 'blocked',
      reason: 'This endpoint validates local public beta copy drafts only. It does not edit whitepaper.html, index.html, send external copy, make provider claims, approve public beta, approve live finance, or release production.',
    },
    safe_copy_summary: `traditional-first public copy ${status}; issues=${issues.length}; request_id=${req.id || 'pending'}; public website edits, external sends, provider claims, public beta flips, blockchain/Web3 claims, live finance, legal decisions, and production remain blocked.`,
    no_public_copy_storage: true,
    no_server_storage_attempted: true,
    no_public_website_edit_attempted: true,
    no_external_send_attempted: true,
    no_external_provider_claim_attempted: true,
    no_public_beta_flip_attempted: true,
    no_live_action_attempted: true,
    next_safe_steps: [
      'Use construction trust platform language for public beta copy.',
      'Remove blockchain, Web3, token, XPR, FIO, stablecoin, Metallicus/LOAN-style, provider partnership, legal approval, public beta approval, and production-launch claims from public-facing copy.',
      'Keep future Web3/blockchain integration wording internal or founder-review-only until legal/provider/founder gates are complete.',
      'Keep whitepaper.html and index.html unchanged until explicit founder publication approval.',
    ],
  };
}

function buildHomepagePublicationDecisionValidation(req) {
  const decisionText = typeof req.body?.decision_text === 'string'
    ? req.body.decision_text
    : typeof req.body?.founder_decision_text === 'string'
      ? req.body.founder_decision_text
      : '';
  const sourceRequestId = typeof req.body?.source_request_id === 'string' ? req.body.source_request_id.slice(0, 120) : '';
  const hasDecisionText = decisionText.trim().length > 0;
  const inputLimitWarnings = getBetaFinanceContractDebriefDraftInputWarnings(decisionText);
  const blockedFindings = scanHomepagePublicationDecisionText(decisionText);
  const acceptedRecommendedPhrases = homepagePublicationDecisionRecommendedPhrases.filter((phrase) => decisionText.includes(phrase));
  const missingRecommendedPhrases = homepagePublicationDecisionRecommendedPhrases.filter((phrase) => !decisionText.includes(phrase));
  const publicationGoDetected = decisionText.includes('PUBLICATION_GO');
  const acceptedPhrases = [
    ...acceptedRecommendedPhrases,
    ...homepagePublicationDecisionOptionalPhrases.filter((phrase) => decisionText.includes(phrase)),
  ];
  const inputLimitIssues = inputLimitWarnings.map((warning) => ({
    id: warning,
    label: 'Homepage decision input limit warning',
    severity: 'blocked',
    line_number: null,
    safe_excerpt: warning,
  }));
  const missingPhraseIssues = hasDecisionText
    ? missingRecommendedPhrases.map((phrase) => ({
      id: 'homepage_decision_recommended_phrase_missing',
      label: `Missing ${phrase}`,
      severity: 'review',
      line_number: null,
      safe_excerpt: phrase,
    }))
    : [];
  const issues = [...blockedFindings, ...inputLimitIssues, ...missingPhraseIssues];
  const status = !hasDecisionText
    ? 'homepage_decision_missing'
    : inputLimitWarnings.length
      ? 'homepage_decision_input_limit_exceeded'
      : blockedFindings.length
        ? 'homepage_decision_blocked_for_redaction'
        : publicationGoDetected
          ? 'homepage_publication_go_detected_review_only'
          : missingRecommendedPhrases.length
            ? 'homepage_decision_recommended_phrases_missing'
            : 'safe_local_homepage_decision_hold';
  const safeNextAction = status === 'safe_local_homepage_decision_hold'
    ? 'Record the local copy-direction decision metadata, keep public index.html and whitepaper.html unchanged, and continue final local QA/diff prep only.'
    : status === 'homepage_publication_go_detected_review_only'
      ? 'Treat PUBLICATION_GO as review-only evidence here; prepare an exact-file replacement package and rerun final public-file QA before any public edit, deploy setup, URL share, tester invite, or live action.'
      : status === 'homepage_decision_recommended_phrases_missing'
        ? 'Add the missing recommended founder phrases or keep homepage publication on hold; no public replacement is allowed from this validator.'
        : 'Remove secrets, sensitive data, immediate public replacement/deploy/share wording, live finance, Web3, provider, legal, or production action wording before using this decision text.';

  return {
    generated_at: new Date().toISOString(),
    request_id: req.id || null,
    mode: 'local_beta_homepage_publication_decision_validation',
    validation_type: 'homepage_publication_decision_validation',
    status,
    source_request_id: sourceRequestId || null,
    decision_character_count: decisionText.length,
    decision_line_count: String(decisionText || '').split(/\r?\n/).length,
    recommended_phrases: homepagePublicationDecisionRecommendedPhrases,
    optional_publication_phrase: 'PUBLICATION_GO',
    accepted_phrases: acceptedPhrases,
    missing_recommended_phrases: missingRecommendedPhrases,
    publication_go_detected: publicationGoDetected,
    requires_founder_review: status !== 'safe_local_homepage_decision_hold',
    input_limit_warnings: inputLimitWarnings,
    issues,
    issue_count: issues.length,
    safe_next_action: safeNextAction,
    blocked_publication_claims: [
      'copy approval as public replacement approval',
      'PUBLICATION_GO as deploy approval',
      'PUBLICATION_GO as public URL sharing approval',
      'PUBLICATION_GO as tester invite approval',
      'PUBLICATION_GO as live finance, provider, legal, or production approval',
    ],
    blocked_live_actions: homepagePublicationDecisionBlockedActions,
    homepage_publication_decision_gate: {
      local_validation: status === 'safe_local_homepage_decision_hold' ? 'ready_hold' : 'review',
      public_homepage_edit: 'blocked',
      public_whitepaper_edit: 'blocked',
      deploy_setting_change: 'blocked',
      public_url_share: 'blocked',
      tester_invite: 'blocked',
      public_beta_launch: 'blocked',
      live_finance: 'blocked',
      web3_or_provider_action: 'blocked',
      legal_decision: 'blocked',
      production_release: 'blocked',
      reason: 'This endpoint validates local founder decision phrases only. It does not store decision text, replace public files, change deploy settings, share public URLs, invite testers, approve beta launch, approve live finance, make provider/legal decisions, or release production.',
    },
    safe_copy_summary: `homepage publication decision validation ${status}; accepted_phrases=${acceptedPhrases.length}; missing_recommended=${missingRecommendedPhrases.length}; publication_go_detected=${publicationGoDetected}; request_id=${req.id || 'pending'}; public replacement, deploy, URL sharing, tester invites, beta launch, live finance, provider/legal decisions, and production remain blocked.`,
    no_decision_text_storage: true,
    no_server_storage_attempted: true,
    no_public_replacement_attempted: true,
    no_public_homepage_edit_attempted: true,
    no_public_whitepaper_edit_attempted: true,
    no_deploy_attempted: true,
    no_deploy_setting_change_attempted: true,
    no_url_share_attempted: true,
    no_public_url_share_attempted: true,
    no_tester_invite_attempted: true,
    no_public_beta_flip_attempted: true,
    no_live_action_attempted: true,
    next_safe_steps: [
      'Use the recommended five phrases for local copy-direction approval and hold public replacement.',
      'Treat standalone PUBLICATION_GO as a separate review signal that still requires exact-file replacement, rollback/archive, final claim-risk scan, final browser QA, and external deploy/share decisions.',
      'Keep public index.html and whitepaper.html unchanged until the exact public replacement package is approved.',
      'Stop before deploy settings, public URL sharing, tester invites, provider/legal commitments, live finance, Web3 signatures, or production release.',
    ],
  };
}

function buildBetaFinanceContractQuickstartAcknowledgementValidation(req) {
  const acknowledgementText = typeof req.body?.acknowledgement_text === 'string'
    ? req.body.acknowledgement_text
    : typeof req.body?.acknowledgement_note === 'string'
      ? req.body.acknowledgement_note
      : '';
  const sourceRequestId = typeof req.body?.source_request_id === 'string' ? req.body.source_request_id.slice(0, 120) : '';
  const hasAcknowledgementText = acknowledgementText.trim().length > 0;
  const blockedFindings = scanBetaFinanceContractDebriefDraftText(acknowledgementText);
  const requiredFields = betaFinanceContractQuickstartAcknowledgementRequiredFields.map((field) => field.label);
  const presentRequiredFields = betaFinanceContractQuickstartAcknowledgementRequiredFields
    .filter((field) => field.pattern.test(acknowledgementText))
    .map((field) => field.label);
  const missingRequiredFields = betaFinanceContractQuickstartAcknowledgementRequiredFields
    .filter((field) => !field.pattern.test(acknowledgementText))
    .map((field) => field.label);
  const requiredFieldIssues = hasAcknowledgementText
    ? missingRequiredFields.map((field) => ({
      id: 'quickstart_acknowledgement_required_field_missing',
      label: `Missing ${field}`,
      severity: 'review',
      line_number: null,
      safe_excerpt: field,
    }))
    : [];
  const issues = [...blockedFindings, ...requiredFieldIssues];
  const hasBlockedFindings = blockedFindings.length > 0;
  const status = !hasAcknowledgementText
    ? 'quickstart_acknowledgement_missing'
    : hasBlockedFindings
      ? 'quickstart_acknowledgement_blocked_for_redaction'
      : missingRequiredFields.length
        ? 'quickstart_acknowledgement_required_fields_missing'
        : 'safe_local_quickstart_acknowledgement';

  return {
    generated_at: new Date().toISOString(),
    request_id: req.id || null,
    mode: 'local_beta_finance_contract_quickstart_acknowledgement_validation',
    validation_type: 'tester_finance_contract_quickstart_acknowledgement_validation',
    status,
    source_request_id: sourceRequestId || null,
    acknowledgement_character_count: acknowledgementText.length,
    acknowledgement_line_count: String(acknowledgementText || '').split(/\r?\n/).length,
    required_fields: requiredFields,
    present_required_fields: presentRequiredFields,
    missing_required_fields: missingRequiredFields,
    issues,
    issue_count: issues.length,
    blocked_live_actions: betaFinanceContractLiveConfusionBlockedActions,
    quickstart_acknowledgement_gate: {
      local_validation: status === 'safe_local_quickstart_acknowledgement' ? 'ready' : 'review',
      server_storage: 'blocked',
      external_send: 'blocked',
      external_followup: 'blocked',
      public_beta_flip: 'blocked',
      payment_charge: 'blocked',
      loan_approval: 'blocked',
      escrow_release: 'blocked',
      signed_contract_creation: 'blocked',
      xpr_signature: 'blocked',
      stablecoin_settlement: 'blocked',
      token_collateral_lock: 'blocked',
      provider_submission: 'blocked',
      provider_commitment: 'blocked',
      legal_decision: 'blocked',
      production_release: 'blocked',
      reason: 'This endpoint validates a redacted FINANCE_CONTRACT_TESTER_QUICKSTART acknowledgement only. It does not store acknowledgement text, send follow-up, flip public beta, move money, approve loans, release escrow, create signed contracts, request XPR signatures, settle stablecoins, lock token collateral, approve provider/legal decisions, or release production.',
    },
    safe_copy_summary: `beta finance/contract quickstart acknowledgement ${status}; issues=${issues.length}; request_id=${req.id || 'pending'}; FINANCE_CONTRACT_TESTER_QUICKSTART local-only preflight; storage, external follow-up, public beta, and live actions remain blocked.`,
    no_acknowledgement_storage: true,
    no_server_storage_attempted: true,
    no_external_followup_attempted: true,
    no_public_beta_flip_attempted: true,
    no_live_action_attempted: true,
    next_safe_steps: [
      'If blocked issues are present, remove secrets, sensitive values, external-send wording, and live finance or contract actions.',
      'If required fields are missing, capture tester role, flow, checkpoint, request ID, quickstart understood, allowed local action, blocked live interpretation, next local action, and FINANCE_CONTRACT_TESTER_QUICKSTART.',
      'Keep acknowledgement notes local and copy only redacted metadata into tester reports.',
      'Stop before public beta flip, external follow-up, payment charge, loan approval, escrow release, signed contract creation, XPR signature, stablecoin settlement, token collateral lock, provider/legal decision, or production release.',
    ],
  };
}

function buildBetaFinanceContractReviewerNoteValidation(req) {
  const noteText = typeof req.body?.note_text === 'string'
    ? req.body.note_text
    : typeof req.body?.reviewer_note === 'string'
      ? req.body.reviewer_note
      : '';
  const sourceRequestId = typeof req.body?.source_request_id === 'string' ? req.body.source_request_id.slice(0, 120) : '';
  const hasNoteText = noteText.trim().length > 0;
  const blockedFindings = scanBetaFinanceContractDebriefDraftText(noteText);
  const requiredFields = betaFinanceContractReviewerNoteRequiredFields.map((field) => field.label);
  const presentRequiredFields = betaFinanceContractReviewerNoteRequiredFields
    .filter((field) => field.pattern.test(noteText))
    .map((field) => field.label);
  const missingRequiredFields = betaFinanceContractReviewerNoteRequiredFields
    .filter((field) => !field.pattern.test(noteText))
    .map((field) => field.label);
  const requiredFieldIssues = hasNoteText
    ? missingRequiredFields.map((field) => ({
      id: 'reviewer_note_required_field_missing',
      label: `Missing ${field}`,
      severity: 'review',
      line_number: null,
      safe_excerpt: field,
    }))
    : [];
  const issues = [...blockedFindings, ...requiredFieldIssues];
  const hasBlockedFindings = blockedFindings.length > 0;
  const status = !hasNoteText
    ? 'reviewer_note_missing'
    : hasBlockedFindings
      ? 'reviewer_note_blocked_for_redaction'
      : missingRequiredFields.length
        ? 'reviewer_note_required_fields_missing'
        : 'safe_local_reviewer_note';
  return {
    generated_at: new Date().toISOString(),
    request_id: req.id || null,
    mode: 'local_beta_finance_contract_reviewer_note_validation',
    validation_type: 'tester_finance_contract_reviewer_note_validation',
    status,
    source_request_id: sourceRequestId || null,
    note_character_count: noteText.length,
    note_line_count: String(noteText || '').split(/\r?\n/).length,
    required_fields: requiredFields,
    present_required_fields: presentRequiredFields,
    missing_required_fields: missingRequiredFields,
    issues,
    issue_count: issues.length,
    blocked_live_actions: betaFinanceContractDebriefBlockedLiveActions,
    reviewer_note_validation_gate: {
      local_validation: status === 'safe_local_reviewer_note' ? 'ready' : 'review',
      external_send: 'blocked',
      server_storage: 'blocked',
      payment_charge: 'blocked',
      loan_approval: 'blocked',
      escrow_release: 'blocked',
      signed_contract_creation: 'blocked',
      xpr_signature: 'blocked',
      provider_commitment: 'blocked',
      legal_decision: 'blocked',
      public_beta_flip: 'blocked',
      production_release: 'blocked',
      reason: 'This endpoint validates a redacted beta finance/contract SAFE_REVIEWER_NOTE only. It does not store reviewer notes, send reports, move money, approve loans, release escrow, create signed contracts, request XPR signatures, approve providers/legal decisions, flip public beta, or release production.',
    },
    safe_copy_summary: `beta finance/contract reviewer note validation ${status}; issues=${issues.length}; request_id=${req.id || 'pending'}; SAFE_REVIEWER_NOTE local-only reviewer handoff; storage, external send, and live actions remain blocked.`,
    no_reviewer_note_storage: true,
    no_server_storage_attempted: true,
    no_live_action_attempted: true,
    next_safe_steps: [
      'If blocked issues are present, remove secrets, sensitive values, external-send wording, and live finance or contract actions.',
      'If required fields are missing, capture reviewer role, tester role, flow, checkpoint, request ID, boundary response, stop gate state, next safe action, and SAFE_REVIEWER_NOTE.',
      'Keep reviewer notes local and copy only redacted metadata into issue logs.',
      'Stop before payment charge, loan approval, escrow release, signed contract creation, XPR signature, provider commitment, legal decision, public beta flip, or production release.',
    ],
  };
}

function buildBetaFinanceContractLiveConfusionValidation(req) {
  const noteText = typeof req.body?.confusion_note === 'string'
    ? req.body.confusion_note
    : typeof req.body?.note_text === 'string'
      ? req.body.note_text
      : '';
  const sourceRequestId = typeof req.body?.source_request_id === 'string' ? req.body.source_request_id.slice(0, 120) : '';
  const hasNoteText = noteText.trim().length > 0;
  const blockedFindings = scanBetaFinanceContractDebriefDraftText(noteText);
  const requiredFields = betaFinanceContractLiveConfusionRequiredFields.map((field) => field.label);
  const presentRequiredFields = betaFinanceContractLiveConfusionRequiredFields
    .filter((field) => field.pattern.test(noteText))
    .map((field) => field.label);
  const missingRequiredFields = betaFinanceContractLiveConfusionRequiredFields
    .filter((field) => !field.pattern.test(noteText))
    .map((field) => field.label);
  const requiredFieldIssues = hasNoteText
    ? missingRequiredFields.map((field) => ({
      id: 'live_confusion_required_field_missing',
      label: `Missing ${field}`,
      severity: 'review',
      line_number: null,
      safe_excerpt: field,
    }))
    : [];
  const issues = [...blockedFindings, ...requiredFieldIssues];
  const hasBlockedFindings = blockedFindings.length > 0;
  const status = !hasNoteText
    ? 'live_confusion_note_missing'
    : hasBlockedFindings
      ? 'live_confusion_blocked_for_redaction'
      : missingRequiredFields.length
        ? 'live_confusion_required_fields_missing'
        : 'safe_local_live_confusion_review';

  return {
    generated_at: new Date().toISOString(),
    request_id: req.id || null,
    mode: 'local_beta_finance_contract_live_confusion_validation',
    validation_type: 'tester_finance_contract_live_confusion_validation',
    status,
    source_request_id: sourceRequestId || null,
    note_character_count: noteText.length,
    note_line_count: String(noteText || '').split(/\r?\n/).length,
    required_fields: requiredFields,
    present_required_fields: presentRequiredFields,
    missing_required_fields: missingRequiredFields,
    issues,
    issue_count: issues.length,
    blocked_live_actions: betaFinanceContractLiveConfusionBlockedActions,
    live_confusion_validation_gate: {
      local_validation: status === 'safe_local_live_confusion_review' ? 'ready' : 'review',
      external_send: 'blocked',
      external_followup: 'blocked',
      server_storage: 'blocked',
      public_beta_flip: 'blocked',
      payment_charge: 'blocked',
      loan_approval: 'blocked',
      escrow_release: 'blocked',
      signed_contract_creation: 'blocked',
      xpr_signature: 'blocked',
      stablecoin_settlement: 'blocked',
      token_collateral_lock: 'blocked',
      provider_submission: 'blocked',
      provider_commitment: 'blocked',
      legal_decision: 'blocked',
      auth_rls_change: 'blocked',
      production_release: 'blocked',
      reason: 'This endpoint validates a redacted LIVE_CONFUSION_REVIEW_ONLY note only. It does not store notes, send follow-up, flip public beta, move money, approve loans, release escrow, create signed contracts, request XPR signatures, approve provider/legal decisions, change Auth/RLS, or release production.',
    },
    safe_copy_summary: `beta finance/contract live-confusion validation ${status}; issues=${issues.length}; request_id=${req.id || 'pending'}; LIVE_CONFUSION_REVIEW_ONLY local-only handoff; public beta, external follow-up, storage, and live actions remain blocked.`,
    no_live_confusion_note_storage: true,
    no_server_storage_attempted: true,
    no_public_beta_flip: true,
    no_external_followup: true,
    no_live_action_attempted: true,
    next_safe_steps: [
      'If blocked issues are present, remove secrets, sensitive values, external-send wording, and live finance or contract actions.',
      'If required fields are missing, capture reviewer role, tester role, flow, checkpoint, request ID, confusion signal, stop script response, safe issue handoff, next local action, and LIVE_CONFUSION_REVIEW_ONLY.',
      'Keep live-confusion notes local and copy only redacted metadata into issue logs.',
      'Stop before public beta flip, external follow-up, payment charge, loan approval, escrow release, signed contract creation, XPR signature, stablecoin settlement, token collateral lock, provider/legal decision, Auth/RLS change, or production release.',
    ],
  };
}

function buildBetaFinanceContractSessionSafetyValidation(req) {
  const noteText = typeof req.body?.session_safety_note === 'string'
    ? req.body.session_safety_note
    : typeof req.body?.note_text === 'string'
      ? req.body.note_text
      : '';
  const sourceRequestId = typeof req.body?.source_request_id === 'string' ? req.body.source_request_id.slice(0, 120) : '';
  const hasNoteText = noteText.trim().length > 0;
  const blockedFindings = scanBetaFinanceContractDebriefDraftText(noteText);
  const requiredFields = betaFinanceContractSessionSafetyRequiredFields.map((field) => field.label);
  const presentRequiredFields = betaFinanceContractSessionSafetyRequiredFields
    .filter((field) => field.pattern.test(noteText))
    .map((field) => field.label);
  const missingRequiredFields = betaFinanceContractSessionSafetyRequiredFields
    .filter((field) => !field.pattern.test(noteText))
    .map((field) => field.label);
  const requiredFieldIssues = hasNoteText
    ? missingRequiredFields.map((field) => ({
      id: 'session_safety_required_field_missing',
      label: `Missing ${field}`,
      severity: 'review',
      line_number: null,
      safe_excerpt: field,
    }))
    : [];
  const issues = [...blockedFindings, ...requiredFieldIssues];
  const hasBlockedFindings = blockedFindings.length > 0;
  const status = !hasNoteText
    ? 'session_safety_note_missing'
    : hasBlockedFindings
      ? 'session_safety_blocked_for_redaction'
      : missingRequiredFields.length
        ? 'session_safety_required_fields_missing'
        : 'safe_local_session_safety_review';

  return {
    generated_at: new Date().toISOString(),
    request_id: req.id || null,
    mode: 'local_beta_finance_contract_session_safety_validation',
    validation_type: 'tester_finance_contract_session_safety_validation',
    status,
    source_request_id: sourceRequestId || null,
    note_character_count: noteText.length,
    note_line_count: String(noteText || '').split(/\r?\n/).length,
    required_fields: requiredFields,
    present_required_fields: presentRequiredFields,
    missing_required_fields: missingRequiredFields,
    issues,
    issue_count: issues.length,
    blocked_live_actions: [
      ...betaFinanceContractLiveConfusionBlockedActions,
      'raw_artifact_export',
      'payment_data_storage',
      'sensitive_data_collection',
    ],
    session_safety_validation_gate: {
      local_validation: status === 'safe_local_session_safety_review' ? 'ready' : 'review',
      server_storage: 'blocked',
      external_send: 'blocked',
      external_followup: 'blocked',
      public_beta_flip: 'blocked',
      payment_charge: 'blocked',
      loan_approval: 'blocked',
      escrow_release: 'blocked',
      signed_contract_creation: 'blocked',
      xpr_signature: 'blocked',
      stablecoin_settlement: 'blocked',
      token_collateral_lock: 'blocked',
      raw_artifact_export: 'blocked',
      sensitive_data_collection: 'blocked',
      provider_commitment: 'blocked',
      legal_decision: 'blocked',
      production_release: 'blocked',
      reason: 'This endpoint validates a redacted FINANCE_CONTRACT_SESSION_SAFETY note only. It does not store notes, send follow-up, flip public beta, collect sensitive data, move money, approve loans, release escrow, create signed contracts, request XPR signatures, settle stablecoins, lock token collateral, approve provider/legal decisions, or release production.',
    },
    safe_copy_summary: `beta finance/contract session safety validation ${status}; issues=${issues.length}; request_id=${req.id || 'pending'}; FINANCE_CONTRACT_SESSION_SAFETY local-only handoff; server storage, external follow-up, public beta, and live actions remain blocked.`,
    no_session_safety_note_storage: true,
    no_server_storage_attempted: true,
    no_external_followup_attempted: true,
    no_public_beta_flip: true,
    no_live_action_attempted: true,
    next_safe_steps: [
      'If blocked issues are present, remove secrets, sensitive values, external-send wording, and live finance or contract actions.',
      'If required fields are missing, capture reviewer role, tester role, phase, flow, checkpoint, request ID, safe evidence summary, stop state, next local action, and FINANCE_CONTRACT_SESSION_SAFETY.',
      'Keep session-safety notes local and copy only redacted metadata into issue logs.',
      'Stop before server storage, external follow-up, public beta flip, payment charge, loan approval, escrow release, signed contract creation, XPR signature, stablecoin settlement, token collateral lock, sensitive data collection, provider/legal decision, or production release.',
    ],
  };
}

function buildBetaFinanceContractDebriefDraftValidation(req) {
  const draftText = typeof req.body?.draft_text === 'string'
    ? req.body.draft_text
    : typeof req.body?.draft === 'string'
      ? req.body.draft
      : '';
  const sourceRequestId = typeof req.body?.source_request_id === 'string' ? req.body.source_request_id.slice(0, 120) : '';
  const hasDraftText = draftText.trim().length > 0;
  const inputLimitWarnings = getBetaFinanceContractDebriefDraftInputWarnings(draftText);
  const blockedFindings = scanBetaFinanceContractDebriefDraftText(draftText);
  const requiredFields = betaFinanceContractDebriefDraftRequiredFields.map((field) => field.label);
  const presentRequiredFields = betaFinanceContractDebriefDraftRequiredFields
    .filter((field) => field.pattern.test(draftText))
    .map((field) => field.label);
  const missingRequiredFields = betaFinanceContractDebriefDraftRequiredFields
    .filter((field) => !field.pattern.test(draftText))
    .map((field) => field.label);
  const requiredFieldIssues = hasDraftText
    ? missingRequiredFields.map((field) => ({
      id: 'required_field_missing',
      label: `Missing ${field}`,
      severity: 'review',
      line_number: null,
      safe_excerpt: field,
    }))
    : [];
  const issues = [...blockedFindings, ...requiredFieldIssues];
  const hasBlockedFindings = blockedFindings.length > 0;
  const hasInputLimitWarnings = inputLimitWarnings.length > 0;
  const status = !hasDraftText
    ? 'draft_missing'
    : hasInputLimitWarnings
      ? 'input_limit_exceeded'
      : hasBlockedFindings
      ? 'blocked_for_redaction'
      : missingRequiredFields.length
        ? 'needs_required_fields'
        : 'safe_local_debrief_review';
  const draftValidationSections = [
    {
      id: 'draft_input_limits',
      title: 'Draft input limits',
      status: hasInputLimitWarnings ? 'blocked' : 'ready',
      detail: hasInputLimitWarnings
        ? 'Draft exceeds local debrief limits. Trim it to the required safe fields before validation or issue handoff.'
        : 'Draft stays within local debrief length and line-count limits.',
      evidence_required: ['input_limits', 'input_limit_warnings'],
    },
    {
      id: 'draft_redaction_scan',
      title: 'Draft redaction scan',
      status: hasBlockedFindings ? 'blocked' : 'ready',
      detail: hasBlockedFindings
        ? 'Draft includes forbidden secret-looking, payment, identity, live finance, contract, XPR, provider, legal, or production wording.'
        : 'Draft does not include scanner-detected secrets, payment data, identity data, live finance, contract, XPR, provider, legal, or production wording.',
      evidence_required: ['issues', 'redaction_confirmed'],
    },
    {
      id: 'required_field_presence',
      title: 'Required debrief fields',
      status: missingRequiredFields.length ? 'review' : 'ready',
      detail: missingRequiredFields.length
        ? `Missing required safe debrief fields: ${missingRequiredFields.join(', ')}.`
        : 'Draft includes role, flow, checkpoint labels, request IDs, boundary clarity rating, triage labels, safe issue handoff, founder review hold, and SAFE_DEBRIEF_NOTE.',
      evidence_required: requiredFields,
    },
    {
      id: 'local_only_handoff_boundary',
      title: 'Local-only handoff boundary',
      status: 'blocked_for_live',
      detail: 'Validation only prepares a redacted local issue-handoff note. It does not store drafts, send externally, charge payments, approve loans, release escrow, create signed contracts, request XPR signatures, approve providers/legal items, flip public beta, or release production.',
      evidence_required: ['no_server_storage', 'no_live_action_attempted'],
    },
  ];

  return {
    generated_at: new Date().toISOString(),
    request_id: req.id || null,
    mode: 'local_beta_finance_contract_debrief_validation',
    validation_type: 'tester_finance_contract_debrief_draft_validation',
    status,
    source_request_id: sourceRequestId || null,
    draft_character_count: draftText.length,
    draft_line_count: String(draftText || '').split(/\r?\n/).length,
    input_limits: betaFinanceContractDebriefDraftInputLimits,
    input_limit_warnings: inputLimitWarnings,
    required_fields: requiredFields,
    present_required_fields: presentRequiredFields,
    missing_required_fields: missingRequiredFields,
    draft_validation_sections: draftValidationSections,
    issues,
    issue_count: issues.length,
    blocked_live_actions: betaFinanceContractDebriefBlockedLiveActions,
    debrief_draft_recovery_actions: buildBetaFinanceContractDebriefDraftRecoveryActions(
      inputLimitWarnings,
      missingRequiredFields,
      blockedFindings
    ),
    debrief_validation_gate: {
      local_validation: status === 'safe_local_debrief_review' ? 'ready' : 'review',
      external_send: 'blocked',
      server_storage: 'blocked',
      sensitive_data_storage: 'blocked',
      payment_charge: 'blocked',
      loan_approval: 'blocked',
      escrow_release: 'blocked',
      signed_contract_creation: 'blocked',
      xpr_signature: 'blocked',
      provider_commitment: 'blocked',
      legal_decision: 'blocked',
      public_beta_flip: 'blocked',
      production_release: 'blocked',
      reason: 'This endpoint validates a redacted beta finance/contract debrief draft only. It does not store draft text, send reports, move money, approve loans, release escrow, create signed contracts, request XPR signatures, approve providers/legal decisions, flip public beta, or release production.',
    },
    safe_copy_summary: `beta finance/contract debrief draft validation ${status}; issues=${issues.length}; request_id=${req.id || 'pending'}; SAFE_DEBRIEF_NOTE local-only handoff; external send, storage, and live actions remain blocked.`,
    no_server_storage: true,
    no_server_storage_attempted: true,
    no_live_action_attempted: true,
    next_safe_steps: [
      'If blocked issues are present, remove secrets, private values, payment/identity data, and live approval wording before using the debrief note.',
      'If input limit warnings are present, trim the draft to the required safe debrief fields before issue handoff.',
      'Keep the debrief local and copy only redacted issue metadata, request IDs, clarity rating, triage labels, and founder-review holds into issue logs.',
      'Stop before external send, sensitive data storage, payment charge, loan approval, escrow release, signed contract creation, XPR signature, provider commitment, legal decision, public beta flip, or production release.',
    ],
  };
}

app.post('/api/admin/beta-readiness/finance-contract-quickstart/acknowledgement/validate', (req, res) => {
  const validation = buildBetaFinanceContractQuickstartAcknowledgementValidation(req);
  const statusCode = ['quickstart_acknowledgement_missing', 'quickstart_acknowledgement_blocked_for_redaction'].includes(validation.status) ? 400 : 200;
  res.status(statusCode).json(validation);
});

app.post('/api/admin/beta-readiness/public-copy/validate', (req, res) => {
  const validation = buildTraditionalFirstPublicCopyValidation(req);
  const statusCode = ['public_copy_missing', 'public_copy_blocked_for_redaction'].includes(validation.status) ? 400 : 200;
  res.status(statusCode).json(validation);
});

app.post('/api/admin/beta-readiness/homepage-publication-decision/validate', (req, res) => {
  const validation = buildHomepagePublicationDecisionValidation(req);
  const statusCode = ['homepage_decision_missing', 'homepage_decision_input_limit_exceeded', 'homepage_decision_blocked_for_redaction'].includes(validation.status) ? 400 : 200;
  res.status(statusCode).json(validation);
});

app.post('/api/admin/beta-readiness/finance-contract-walkthrough/debrief/validate', (req, res) => {
  const validation = buildBetaFinanceContractDebriefDraftValidation(req);
  const statusCode = ['draft_missing', 'blocked_for_redaction', 'input_limit_exceeded'].includes(validation.status) ? 400 : 200;
  res.status(statusCode).json(validation);
});

app.post('/api/admin/beta-readiness/finance-contract-walkthrough/reviewer-note/validate', (req, res) => {
  const validation = buildBetaFinanceContractReviewerNoteValidation(req);
  const statusCode = ['reviewer_note_missing', 'reviewer_note_blocked_for_redaction'].includes(validation.status) ? 400 : 200;
  res.status(statusCode).json(validation);
});

app.post('/api/admin/beta-readiness/finance-contract-walkthrough/live-confusion/validate', (req, res) => {
  const validation = buildBetaFinanceContractLiveConfusionValidation(req);
  const statusCode = ['live_confusion_note_missing', 'live_confusion_blocked_for_redaction'].includes(validation.status) ? 400 : 200;
  res.status(statusCode).json(validation);
});

app.post('/api/admin/beta-readiness/finance-contract-walkthrough/session-safety/validate', (req, res) => {
  const validation = buildBetaFinanceContractSessionSafetyValidation(req);
  const statusCode = ['session_safety_note_missing', 'session_safety_blocked_for_redaction'].includes(validation.status) ? 400 : 200;
  res.status(statusCode).json(validation);
});

function buildSmartContractorWorkflowReadiness() {
  const workflowSteps = [
    {
      id: 'homeowner_project_request',
      label: 'Homeowner project request',
      owner_view: 'Homeowner creates a local project request with trade, location, budget, and scope notes.',
      product_value: 'Starts the Construction Trust Infrastructure record without publishing a real lead or binding contract.',
      required_api_routes: [
        '/api/smartcontractor/jobs',
        '/api/smartcontractor/homeowners',
      ],
      required_ui_surfaces: [
        'Homeowner project form',
        'Demo Run Order',
        'Demo Safety Boundary Strip',
      ],
      live_action_status: 'BLOCKED_FOR_LIVE',
      blocked_live_actions: [
        'publish_real_lead',
        'bind_homeowner',
        'start_escrow',
      ],
    },
    {
      id: 'contractor_bid_review',
      label: 'Contractor bid review',
      owner_view: 'Contractor reviews a local project request and submits a demo bid with timeline and amount.',
      product_value: 'Creates comparable contractor records without creating a real commitment or license verification decision.',
      required_api_routes: [
        '/api/smartcontractor/bids',
        '/api/smartcontractor/contractors',
      ],
      required_ui_surfaces: [
        'Contractor bid form',
        'Contractor verification status',
      ],
      live_action_status: 'BLOCKED_FOR_LIVE',
      blocked_live_actions: [
        'verify_license_final',
        'guarantee_price',
        'bind_contractor',
      ],
    },
    {
      id: 'project_contract_record',
      label: 'Project contract record',
      owner_view: 'Admin or homeowner drafts a local project contract record from a selected bid.',
      product_value: 'Turns project scope into an auditable construction record before licensed escrow or lending partners are involved.',
      required_api_routes: [
        '/api/smartcontractor/project-contracts',
      ],
      required_ui_surfaces: [
        'Project contract status',
        'Admin review queue',
      ],
      live_action_status: 'BLOCKED_FOR_LIVE',
      blocked_live_actions: [
        'execute_signature',
        'create_legal_contract',
        'activate_provider_terms',
      ],
    },
    {
      id: 'escrow_ready_milestones',
      label: 'Escrow-ready milestones',
      owner_view: 'Project milestones record visible work progress, amount, work status, and payment status.',
      product_value: 'Prepares milestone evidence for future licensed escrow review without holding or releasing funds.',
      required_api_routes: [
        '/api/smartcontractor/milestones',
        '/api/payments/intents',
      ],
      required_ui_surfaces: [
        'Milestone tracker',
        'Payment Router demo-only warning',
      ],
      live_action_status: 'BLOCKED_FOR_LIVE',
      blocked_live_actions: [
        'hold_escrow',
        'release_escrow',
        'move_payment',
      ],
    },
    {
      id: 'partner_reviewed_working_capital',
      label: 'Partner-reviewed working capital',
      owner_view: 'Contractor working-capital request stays a local review record with repayment waterfall context.',
      product_value: 'Shows how verified project data can support future lender review without GCSC approving or funding a loan.',
      required_api_routes: [
        '/api/smartcontractor/loans',
        '/api/admin/contract-backed-loan/repayment-waterfall/review-packet',
      ],
      required_ui_surfaces: [
        'Loan request demo-only warning',
        'Repayment waterfall review packet',
      ],
      live_action_status: 'BLOCKED_FOR_LIVE',
      blocked_live_actions: [
        'approve_real_loan',
        'fund_contractor',
        'route_real_repayment',
      ],
    },
    {
      id: 'dispute_evidence_packet',
      label: 'Dispute evidence packet',
      owner_view: 'Homeowner, contractor, or reviewer records local dispute notes, evidence, and peer-review recommendations.',
      product_value: 'Builds a structured dispute packet without deciding liability, refunds, or legal outcome.',
      required_api_routes: [
        '/api/smartcontractor/disputes',
        '/api/smartcontractor/disputes/:disputeId/evidence',
        '/api/smartcontractor/disputes/:disputeId/reviews',
      ],
      required_ui_surfaces: [
        'Dispute Center demo-only warning',
        'Peer review panel',
      ],
      live_action_status: 'BLOCKED_FOR_LIVE',
      blocked_live_actions: [
        'decide_legal_liability',
        'issue_refund',
        'override_escrow',
      ],
    },
    {
      id: 'admin_founder_review',
      label: 'Admin and founder review',
      owner_view: 'Admin workspace shows readiness, request IDs, founder gates, smart contract demo gates, and blocked live actions.',
      product_value: 'Gives the founder a control plane for deciding what is ready for beta, legal/provider review, or future build work.',
      required_api_routes: [
        '/api/admin/beta-readiness',
        '/api/admin/ai-agents/workflows',
        '/api/admin/smartcontractor-workflow-readiness',
      ],
      required_ui_surfaces: [
        'Admin Console demo-only warning',
        'Founder Gate Snapshot',
        'Smart Contract Demo Gate',
      ],
      live_action_status: 'BLOCKED_FOR_LIVE',
      blocked_live_actions: [
        'change_live_rls',
        'assign_live_admin_role',
        'approve_production_release',
      ],
    },
  ];

  const workflowStepIds = workflowSteps.map((step) => step.id);
  const blockedLiveActions = [...new Set(workflowSteps.flatMap((step) => step.blocked_live_actions))].sort();
  const apiRoutes = [...new Set(workflowSteps.flatMap((step) => step.required_api_routes))].sort();
  const uiSurfaces = [...new Set(workflowSteps.flatMap((step) => step.required_ui_surfaces))].sort();

  return {
    status: 'local_demo_ready',
    positioning: 'Construction Trust Infrastructure',
    workflow_steps: workflowSteps,
    summary: {
      total_steps: workflowSteps.length,
      live_blocked_steps: workflowSteps.filter((step) => step.live_action_status === 'BLOCKED_FOR_LIVE').length,
      api_route_count: apiRoutes.length,
      ui_surface_count: uiSurfaces.length,
    },
    review_metrics: {
      total_steps: workflowSteps.length,
      blocked_live_step_count: workflowSteps.filter((step) => step.live_action_status === 'BLOCKED_FOR_LIVE').length,
      blocked_live_action_count: blockedLiveActions.length,
      api_route_count: apiRoutes.length,
      ui_surface_count: uiSurfaces.length,
      workflow_step_ids: workflowStepIds,
    },
    demo_only_boundaries: [
      'no_real_payments',
      'no_live_loan_approval',
      'no_escrow_release',
      'no_token_collateral_lock',
      'no_legal_decision',
      'no_provider_commitment',
      'no_production_release',
    ],
    go_no_go: {
      current_state: 'GO_LOCAL_DEMO_ONLY',
      public_beta_state: 'REVIEW_FOUNDER_AUTH_AND_QA',
      real_money_state: 'NO_GO_BLOCKED_FOR_LIVE',
      required_before_public_beta: [
        'Founder Auth/Admin smoke evidence',
        'SmartContractor frontend workflow readiness panel review',
        'No-real-money beta QA pass',
      ],
      blocked_live_actions: [
        'real_payments',
        'live_loan_approval',
        'escrow_release',
        'token_collateral_lock',
      ],
    },
    ui_next_integration: {
      target_panel: 'Admin workflow readiness panel',
      recommended_method: 'GET /api/admin/smartcontractor-workflow-readiness',
      must_preserve: [
        'X-Request-Id',
        'request_id response body',
        'BLOCKED_FOR_LIVE labels',
        'demo-only user-facing language',
      ],
    },
    next_safe_code_tasks: [
      'Wire this endpoint into the SmartContractor frontend Admin workflow readiness panel.',
      'Add frontend counts for workflow steps, blocked live actions, API routes, and UI surfaces.',
      'Keep real payment, loan, escrow, token collateral, provider, and production actions blocked.',
    ],
  };
}

function smartContractExportNames(exportMap, matcher) {
  return Object.keys(exportMap).filter(matcher).sort();
}

function smartContractHelperCategory(exportMap, {
  id,
  label,
  description,
  reviewTarget,
  localCheck,
  match,
}) {
  const names = smartContractExportNames(exportMap, match);
  return {
    id,
    label,
    description,
    helper_exports: names.filter((name) => /^(apply|create|calculate|serialize)/.test(name)),
    demo_fixture_exports: names.filter((name) => name.startsWith('DEMO_')),
    blocked_live_flag_exports: names.filter((name) => name.startsWith('BLOCKED_')),
    export_count: names.length,
    review_target: reviewTarget,
    local_check: localCheck,
    local_only: true,
    deployment_status: 'BLOCKED_FOR_LIVE',
  };
}

function buildSmartContractHelperIndex(exportMap, options = {}) {
  const helperExports = smartContractExportNames(exportMap, (name) => /^(apply|create|calculate|serialize)/.test(name));
  const demoFixtures = smartContractExportNames(exportMap, (name) => name.startsWith('DEMO_'));
  const blockedLiveFlagGroups = smartContractExportNames(exportMap, (name) => name.startsWith('BLOCKED_'));
  const replayExports = smartContractExportNames(exportMap, (name) => name.includes('LOCAL_REPLAY'));
  const requestedCategoryFilter = typeof options.category_filter === 'string' ? options.category_filter.trim() : '';

  const helperCategories = [
    smartContractHelperCategory(exportMap, {
      id: 'audit_authority_helpers',
      label: 'Audit and authority helpers',
      description: 'Local serialization, pause, authority, and audit-event helpers for future smart contract review.',
      reviewTarget: 'authority_audit_review_ready',
      localCheck: 'npm run check:smart-contract-helper-index-local',
      match: (name) => /AUDIT|AUTHORITY|serializeSmartContractAuditEvent|applyAuthorityTransition/.test(name),
    }),
    smartContractHelperCategory(exportMap, {
      id: 'escrow_loan_repayment_helpers',
      label: 'Escrow, loan, and repayment helpers',
      description: 'Local milestone, loan ledger, repayment waterfall, repayment failure, and adverse-action helpers.',
      reviewTarget: 'repayment_waterfall_review_packet',
      localCheck: 'npm run check:smart-contract-local-replay',
      match: (name) => /ESCROW|LOAN_LEDGER|REPAYMENT|ADVERSE_ACTION|calculateDraftRepaymentWaterfall|createRepaymentFailureState|createAdverseActionNoticeState/.test(name),
    }),
    smartContractHelperCategory(exportMap, {
      id: 'collateral_review_helpers',
      label: 'Collateral and peer-review helpers',
      description: 'Local token-collateral estimate and peer-review reward-placeholder helpers with provider gates blocked.',
      reviewTarget: 'founder_authority_ready',
      localCheck: 'npm run check:smart-contract-state-helpers-local',
      match: (name) => /COLLATERAL|PEER_REVIEW|applyCollateralEstimateTransition|applyPeerReviewRewardTransition/.test(name),
    }),
    smartContractHelperCategory(exportMap, {
      id: 'local_replay_approval_helpers',
      label: 'Local replay and approval helpers',
      description: 'Local replay packet, evidence, live-gate, approval, decision, and external-owner response helpers.',
      reviewTarget: 'local_replay_founder_packet',
      localCheck: 'npm run check:smart-contract-local-replay',
      match: (name) => name.includes('LOCAL_REPLAY') || name.includes('createLocalReplay'),
    }),
  ];
  const allCategoryFilter = {
    id: 'all_helper_categories',
    label: 'All helper categories',
    description: 'Show every local helper category without enabling live XPR, payment, loan, escrow, stablecoin, token collateral, provider, legal, or production actions.',
  };
  const selectedHelperCategoryFilter = !requestedCategoryFilter || requestedCategoryFilter === allCategoryFilter.id
    ? allCategoryFilter
    : helperCategories.find((category) => category.id === requestedCategoryFilter) || null;
  const filteredHelperCategories = !selectedHelperCategoryFilter
    ? []
    : selectedHelperCategoryFilter.id === allCategoryFilter.id
    ? helperCategories
    : helperCategories.filter((category) => category.id === selectedHelperCategoryFilter.id);
  const localReplayReviewRoutes = filteredHelperCategories.map((category) => ({
    category_id: category.id,
    label: category.label,
    review_target: category.review_target,
    local_check: category.local_check,
    export_count: category.export_count,
    ready_for_local_replay_review: category.export_count > 0,
    blocked_for_live_replay: true,
    no_live_replay_action_attempted: true,
  }));
  const localReplayReadinessSummary = {
    mode: 'local_replay_readiness_summary',
    local_only: true,
    selected_filter: selectedHelperCategoryFilter?.id || null,
    local_replay_review_route_count: localReplayReviewRoutes.length,
    ready_for_local_replay_review: localReplayReviewRoutes.filter((route) => route.ready_for_local_replay_review).length,
    blocked_for_live_replay: true,
    no_live_replay_action_attempted: true,
    review_routes: localReplayReviewRoutes,
    blocked_live_actions: [
      'xpr_contract_deployment',
      'xpr_signature_request',
      'live_replay_execution',
      'real_payment',
      'real_loan_approval',
      'escrow_release',
      'stablecoin_settlement',
      'token_collateral_lock',
      'provider_commitment',
      'legal_decision',
      'production_release',
    ],
  };

  return {
    mode: 'smart_contract_helper_index',
    local_only: true,
    deployment_status: 'BLOCKED_FOR_LIVE',
    source_module: 'construction-ai/src/smart-contracts/index.mjs',
    selected_helper_category_filter: selectedHelperCategoryFilter,
    valid_helper_category_filter_ids: [allCategoryFilter.id, ...helperCategories.map((category) => category.id)],
    summary: {
      total_export_count: Object.keys(exportMap).length,
      helper_export_count: helperExports.length,
      demo_fixture_count: demoFixtures.length,
      blocked_live_flag_group_count: blockedLiveFlagGroups.length,
      local_replay_export_count: replayExports.length,
      helper_category_count: helperCategories.length,
      filtered_helper_category_count: filteredHelperCategories.length,
    },
    helper_categories: helperCategories,
    filtered_helper_categories: filteredHelperCategories,
    local_replay_readiness_summary: localReplayReadinessSummary,
    safe_scope: [
      'This endpoint reads local helper exports only.',
      'It does not deploy contracts.',
      'It does not request XPR signatures.',
      'It does not move money, approve loans, release escrow, settle stablecoins, or lock token collateral.',
      'It does not create provider, legal, finance, or production commitments.',
    ],
    blocked_live_actions: [
      'xpr_contract_deployment',
      'xpr_signature_request',
      'real_payment',
      'real_loan_approval',
      'escrow_release',
      'stablecoin_settlement',
      'token_collateral_lock',
      'provider_commitment',
      'legal_decision',
      'production_release',
    ],
    next_safe_steps: [
      'Review helper categories in the Admin workspace.',
      'Run local replay and helper-index validators before any founder/security review packet.',
      'Keep all live XPR, payment, loan, escrow, stablecoin, token collateral, provider, legal, and production actions blocked.',
    ],
  };
}

function buildSmartContractLocalReplayDryRun(exportMap, options = {}) {
  const helperIndex = buildSmartContractHelperIndex(exportMap, options);
  const scenarioBundle = exportMap.DEMO_LOCAL_REPLAY_SCENARIO_BUNDLE || {};
  const scenarioSteps = Array.isArray(scenarioBundle.steps) ? scenarioBundle.steps : [];
  const helperCategories = helperIndex.filtered_helper_categories || [];
  const selectedFilterId = helperIndex.selected_helper_category_filter?.id || options.category_filter || 'all_helper_categories';
  const dryRunSteps = scenarioSteps.map((step) => ({
    step_id: step.step_id,
    sequence: step.sequence,
    module: step.module,
    fixture_index: step.fixture_index,
    fixture_status: step.fixture_status,
    expected_result: step.expected_result,
    dry_run_result: step.fixture_status === 'BLOCKED_FOR_LIVE' && step.expected_result === 'PASS_LOCAL_ONLY'
      ? 'pass_local_only'
      : 'review_required',
    helper_category_matches: helperCategories
      .filter((category) => (
        category.id === 'local_replay_approval_helpers' ||
        category.id === 'all_helper_categories' ||
        (step.module && category.id.includes(step.module))
      ))
      .map((category) => ({
        category_id: category.id,
        review_target: category.review_target,
        local_check: category.local_check,
        export_count: category.export_count,
      })),
    blocked_live_actions: [
      'xpr_contract_deployment',
      'xpr_signature_request',
      'live_replay_execution',
      'real_payment',
      'real_loan_approval',
      'escrow_release',
      'stablecoin_settlement',
      'token_collateral_lock',
      'provider_commitment',
      'legal_decision',
      'production_release',
    ],
  }));
  const reviewRequiredSteps = dryRunSteps.filter((step) => step.dry_run_result !== 'pass_local_only');
  const blockedLiveActions = [
    ...new Set([
      ...(helperIndex.blocked_live_actions || []),
      ...(helperIndex.local_replay_readiness_summary?.blocked_live_actions || []),
      'live_replay_execution',
      'xpr_contract_deployment',
      'xpr_signature_request',
      'real_payment',
      'real_loan_approval',
      'escrow_release',
      'repayment_routing',
      'stablecoin_settlement',
      'token_collateral_lock',
      'provider_commitment',
      'legal_decision',
      'production_release',
    ]),
  ].sort();

  return {
    mode: 'smart_contract_local_replay_dry_run',
    status: reviewRequiredSteps.length ? 'local_replay_dry_run_review_required' : 'local_replay_dry_run_passed',
    local_only: true,
    deployment_status: 'BLOCKED_FOR_LIVE',
    source_module: helperIndex.source_module,
    selected_helper_category_filter: helperIndex.selected_helper_category_filter,
    valid_helper_category_filter_ids: helperIndex.valid_helper_category_filter_ids,
    category_filter: selectedFilterId,
    scenario_bundle_id: scenarioBundle.scenario_bundle_id || 'local_replay_scenario_bundle_missing',
    replay_id: scenarioBundle.replay_id || null,
    replay_packet_request_id: scenarioBundle.request_id || null,
    module_order: scenarioBundle.module_order || [],
    dry_run_steps: dryRunSteps,
    helper_categories: helperCategories.map((category) => ({
      id: category.id,
      label: category.label,
      review_target: category.review_target,
      local_check: category.local_check,
      export_count: category.export_count,
      deployment_status: category.deployment_status,
    })),
    summary: {
      dry_run_step_count: dryRunSteps.length,
      pass_local_only_step_count: dryRunSteps.filter((step) => step.dry_run_result === 'pass_local_only').length,
      review_required_step_count: reviewRequiredSteps.length,
      helper_category_count: helperCategories.length,
      local_replay_review_route_count: helperIndex.local_replay_readiness_summary?.local_replay_review_route_count || 0,
      blocked_live_action_count: blockedLiveActions.length,
    },
    dry_run_gate: {
      local_dry_run: reviewRequiredSteps.length ? 'review_required' : 'passed',
      server_storage: 'blocked',
      live_replay_execution: 'blocked',
      xpr_contract_deployment: 'blocked',
      xpr_signature_request: 'blocked',
      payment_movement: 'blocked',
      real_loan_approval: 'blocked',
      escrow_release: 'blocked',
      repayment_routing: 'blocked',
      stablecoin_settlement: 'blocked',
      token_collateral_lock: 'blocked',
      provider_commitment: 'blocked',
      legal_decision: 'blocked',
      production_release: 'blocked',
      reason: 'This dry run checks local demo replay metadata only. It does not execute replay steps, deploy XPR contracts, request signatures, move money, approve loans, release escrow, route repayment, settle stablecoins, lock token collateral, create provider/legal commitments, or release production.',
    },
    blocked_live_actions: blockedLiveActions,
    next_safe_steps: [
      'Use this dry-run report to confirm local replay metadata is internally consistent before founder/security review.',
      'Run npm run check:smart-contract-local-replay and related local validators before any review packet.',
      'Keep live replay, XPR deployment, signatures, payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, provider/legal commitments, and production blocked.',
    ],
    no_server_storage_attempted: true,
    no_live_replay_action_attempted: true,
    no_live_action_attempted: true,
  };
}

function buildSmartContractLocalReplayDryRunEvidencePacket(exportMap, options = {}) {
  const dryRun = buildSmartContractLocalReplayDryRun(exportMap, options);
  const dryRunSteps = Array.isArray(dryRun.dry_run_steps) ? dryRun.dry_run_steps : [];
  const helperCategories = Array.isArray(dryRun.helper_categories) ? dryRun.helper_categories : [];
  const packetGate = {
    local_packet_review: dryRun.status === 'local_replay_dry_run_passed' ? 'ready_for_founder_security_review' : 'review_required',
    server_storage: 'blocked',
    external_send: 'blocked',
    live_replay_execution: 'blocked',
    xpr_contract_deployment: 'blocked',
    xpr_signature_request: 'blocked',
    payment_movement: 'blocked',
    real_loan_approval: 'blocked',
    escrow_release: 'blocked',
    repayment_routing: 'blocked',
    stablecoin_settlement: 'blocked',
    token_collateral_lock: 'blocked',
    provider_commitment: 'blocked',
    legal_decision: 'blocked',
    production_release: 'blocked',
  };
  const packetSections = [
    {
      id: 'dry_run_summary',
      title: 'Dry Run Summary',
      status: dryRun.status,
      lines: [
        `Mode: ${dryRun.mode}`,
        `Selected helper filter: ${dryRun.selected_helper_category_filter?.id || dryRun.category_filter || 'pending'}`,
        `Scenario bundle: ${dryRun.scenario_bundle_id || 'pending'}`,
        `Replay ID: ${dryRun.replay_id || 'pending'}`,
        `dry_run_steps: ${dryRun.summary?.dry_run_step_count || 0}`,
        `pass_local_only_step_count: ${dryRun.summary?.pass_local_only_step_count || 0}`,
        `review_required_step_count: ${dryRun.summary?.review_required_step_count || 0}`,
      ],
    },
    {
      id: 'dry_run_gate',
      title: 'Dry Run Gate',
      status: 'BLOCKED_FOR_LIVE',
      lines: Object.entries(packetGate).map(([key, value]) => `${key}: ${value}`),
    },
    {
      id: 'helper_category_metadata',
      title: 'Helper Category Metadata',
      status: 'metadata_only',
      lines: helperCategories.length
        ? helperCategories.map((category) => `${category.id} | ${category.review_target} | ${category.local_check} | exports=${category.export_count || 0}`)
        : ['No helper categories selected for this packet.'],
    },
    {
      id: 'dry_run_step_results',
      title: 'Dry Run Step Results',
      status: 'metadata_only',
      lines: dryRunSteps.length
        ? dryRunSteps.map((step) => `${step.sequence}. ${step.step_id} | module=${step.module} | result=${step.dry_run_result} | fixture_status=${step.fixture_status}`)
        : ['No dry-run steps were available in the local replay scenario bundle.'],
    },
    {
      id: 'blocked_live_actions',
      title: 'Blocked Live Actions',
      status: 'BLOCKED_FOR_LIVE',
      lines: dryRun.blocked_live_actions || [],
    },
    {
      id: 'founder_security_handoff',
      title: 'Founder/Security Handoff',
      status: 'local_review_only',
      lines: [
        'Use this packet for local founder/security review only.',
        'Do not treat this packet as deployment, signature, payment, loan, escrow, repayment, stablecoin, token collateral, provider, legal, or production approval.',
        ...(dryRun.next_safe_steps || []),
      ],
    },
  ];
  const redactionAttestation = {
    mode: 'redaction_attestation',
    raw_replay_payload_included: false,
    helper_source_code_included: false,
    secrets_included: false,
    payment_data_included: false,
    wallet_private_data_included: false,
    live_authority_included: false,
    safe_for_local_founder_security_review: true,
  };
  const copyableMarkdown = [
    '# Smart Contract Local Replay Dry Run Evidence Packet',
    '',
    `Generated scope: local_review_only`,
    `Selected helper filter: ${dryRun.selected_helper_category_filter?.id || dryRun.category_filter || 'pending'}`,
    `Status: ${dryRun.status}`,
    `No dry-run packet content stored on the server: true`,
    `No live smart contract replay action attempted: true`,
    '',
    ...packetSections.flatMap((section) => [
      `## ${section.title}`,
      `Status: ${section.status}`,
      ...(section.lines || []).map((line) => `- ${line}`),
      '',
    ]),
    '## Redaction Attestation',
    ...Object.entries(redactionAttestation).map(([key, value]) => `- ${key}: ${value}`),
  ].join('\n');

  return {
    mode: 'smart_contract_local_replay_dry_run_evidence_packet',
    status: dryRun.status === 'local_replay_dry_run_passed'
      ? 'local_replay_dry_run_evidence_packet_ready'
      : 'local_replay_dry_run_evidence_packet_review_required',
    local_only: true,
    deployment_status: 'BLOCKED_FOR_LIVE',
    source_mode: dryRun.mode,
    source_module: dryRun.source_module,
    selected_helper_category_filter: dryRun.selected_helper_category_filter,
    valid_helper_category_filter_ids: dryRun.valid_helper_category_filter_ids,
    category_filter: dryRun.category_filter,
    dry_run_summary: dryRun.summary,
    scenario_bundle_id: dryRun.scenario_bundle_id,
    replay_id: dryRun.replay_id,
    packet_sections: packetSections,
    packet_gate: packetGate,
    redaction_attestation: redactionAttestation,
    copyable_markdown: copyableMarkdown,
    no_server_storage_attempted: true,
    no_dry_run_packet_content_stored: true,
    no_live_replay_action_attempted: true,
    no_live_action_attempted: true,
  };
}

function buildDisputeEvidenceReadiness() {
  const readinessChecks = [
    readinessItem(
      'dispute_intake_check',
      'Dispute intake validation',
      'ready',
      'Dispute create requests validate job, contractor, opener role, title, and description before any Supabase write attempt.'
    ),
    readinessItem(
      'evidence_metadata_check',
      'Evidence metadata validation',
      'ready',
      'Evidence requests accept only photo, video, document, link, or note metadata and keep private files outside public reports.'
    ),
    readinessItem(
      'peer_review_check',
      'Peer review validation',
      'ready',
      'Peer review requests validate reviewer contractor identity, recommendation values, quality score, demo reward, and bounded notes before write attempts.'
    ),
    readinessItem(
      'request_trace_check',
      'Request trace for founder/tester reports',
      'ready',
      'Dispute, evidence, review, and readiness responses include request_id so issues can be reported without exposing secrets.'
    ),
    readinessItem(
      'legal_escrow_payment_block',
      'Legal, escrow, and payment decision block',
      'blocked',
      'This readiness surface prepares local review packets only; it cannot decide liability, release escrow, issue refunds, move money, override escrow, or make legal decisions.',
      'founder/legal/provider'
    ),
  ];

  const evidenceChecklist = [
    readinessItem(
      'evidence_type_metadata_check',
      'Allowed evidence type recorded',
      'ready',
      'Photo, video, document, link, and note evidence types are represented as metadata only.'
    ),
    readinessItem(
      'redaction_check',
      'Private evidence redaction reminder',
      'review',
      'Screenshots, recordings, IDs, addresses, payment details, and private customer facts must be redacted before beta, partner, grant, investor, or public sharing.'
    ),
    readinessItem(
      'milestone_context_check',
      'Milestone context linked',
      'review',
      'Dispute packet review should connect the dispute to milestone scope, work status, payment status, and visible progress evidence.'
    ),
    readinessItem(
      'peer_review_packet_check',
      'Peer review packet linked',
      'review',
      'Peer contractor findings and recommendations should be captured as local review inputs, not legal or payment decisions.'
    ),
    readinessItem(
      'no_live_dispute_outcome_check',
      'No live dispute outcome approval',
      'blocked',
      'Founder/legal/provider review is required before any refund, escrow release, liability assignment, or external dispute outcome.',
      'founder/legal/provider'
    ),
  ];
  const disputeReviewActionQueue = [
    {
      id: 'dispute_intake_packet_review',
      label: 'Dispute intake packet review',
      owner: 'founder/admin',
      action_live_status: 'BLOCKED_FOR_LIVE',
      next_safe_action: 'Review local dispute title, opener role, job context, contractor context, and bounded description before any outcome discussion.',
      required_evidence: [
        'dispute_intake_summary',
        'job_context_summary',
        'opened_by_role_attestation',
      ],
      blocked_live_actions: [
        'decide_legal_liability',
        'override_escrow',
        'release_escrow',
        'issue_refund',
      ],
    },
    {
      id: 'evidence_redaction_packet_review',
      label: 'Evidence redaction packet review',
      owner: 'founder/admin',
      action_live_status: 'BLOCKED_FOR_LIVE',
      next_safe_action: 'Confirm dispute evidence is metadata-only, redacted, and safe for founder/tester review before any external packet or beta evidence sharing.',
      required_evidence: [
        'allowed_evidence_type_summary',
        'redacted_evidence_metadata',
        'raw_media_redaction_attestation',
      ],
      blocked_live_actions: [
        'publish_raw_evidence',
        'external_packet_send',
        'provider_submission',
        'production_release',
      ],
    },
    {
      id: 'peer_review_packet_review',
      label: 'Peer review packet review',
      owner: 'founder/admin',
      action_live_status: 'BLOCKED_FOR_LIVE',
      next_safe_action: 'Review local peer contractor recommendation, quality score, and bounded notes as advisory inputs only, not legal/payment decisions.',
      required_evidence: [
        'peer_reviewer_role_summary',
        'quality_score_summary',
        'redacted_peer_review_notes',
      ],
      blocked_live_actions: [
        'decide_legal_liability',
        'approve_or_deny_refund',
        'release_escrow',
        'move_money',
      ],
    },
    {
      id: 'legal_escrow_payment_gate_review',
      label: 'Legal/escrow/payment gate review',
      owner: 'founder/legal/provider',
      action_live_status: 'BLOCKED_FOR_LIVE',
      next_safe_action: 'Keep dispute outcomes, refund instructions, escrow release, payment movement, provider commitments, legal conclusions, and production handoff blocked until external review is complete.',
      required_evidence: [
        'founder_go_no_go',
        'legal_review_and_dispute_policy',
        'licensed_escrow_payment_provider_review',
      ],
      blocked_live_actions: [
        'decide_legal_liability',
        'release_escrow',
        'issue_refund',
        'route_real_payment',
        'production_release',
      ],
    },
  ];

  return {
    mode: 'dispute_evidence_readiness',
    status: 'local_review_ready',
    local_only: true,
    readiness_checks: readinessChecks,
    evidence_checklist: evidenceChecklist,
    dispute_review_action_queue: disputeReviewActionQueue,
    summary: readinessSummary(readinessChecks),
    evidence_summary: readinessSummary(evidenceChecklist),
    action_queue_summary: {
      queue_item_count: disputeReviewActionQueue.length,
      blocked_for_live_count: disputeReviewActionQueue.filter((item) => item.action_live_status === 'BLOCKED_FOR_LIVE').length,
      required_evidence_count: disputeReviewActionQueue.reduce((sum, item) => sum + item.required_evidence.length, 0),
      blocked_live_action_count: [...new Set(disputeReviewActionQueue.flatMap((item) => item.blocked_live_actions))].length,
    },
    source_routes: [
      '/api/smartcontractor/disputes',
      '/api/smartcontractor/disputes/:disputeId/evidence',
      '/api/smartcontractor/disputes/:disputeId/reviews',
      '/api/admin/dispute-evidence-readiness',
    ],
    public_beta_gate: {
      demo_dispute_packet: 'review',
      live_dispute_decision: 'blocked',
      escrow_release: 'blocked',
      refund_issue: 'blocked',
      legal_liability: 'blocked',
      reason: 'Use local evidence packets for founder/tester review only until legal, escrow/payment provider, Auth/admin, and QA gates are cleared.',
    },
    safe_report_fields: {
      request_id: 'safe to share',
      dispute_id: 'safe if it is a demo/local id',
      evidence_type: 'safe metadata only',
      reviewer_role: 'role label only',
      redacted_notes: 'summary only; no private IDs, addresses, payment data, secrets, or raw files',
    },
    blocked_live_actions: [
      'decide_legal_liability',
      'release_escrow',
      'issue_refund',
      'override_escrow',
      'move_money',
      'route_real_payment',
      'make_legal_decision',
      'provider_commitment',
      'production_release',
    ],
    next_safe_steps: [
      'Use this Admin panel to verify dispute intake, evidence metadata, peer review, and milestone context before a controlled demo.',
      'Collect only redacted local evidence summaries and request IDs in founder/tester reports.',
      'Keep refunds, escrow release, liability decisions, provider commitments, real payments, and legal conclusions blocked until founder/legal/provider review.',
    ],
  };
}

function buildDisputeEvidenceReviewPacket() {
  const readiness = buildDisputeEvidenceReadiness();
  const packetSections = [
    {
      id: 'dispute_readiness_checks',
      label: 'Dispute readiness checks',
      source: 'readiness_checks',
      item_count: (readiness.readiness_checks || []).length,
      blocked_item_count: (readiness.readiness_checks || []).filter((item) => item.status === 'blocked').length,
      summary: 'Dispute intake, evidence metadata, peer review, request trace, and legal/escrow/payment gates for local review only.',
    },
    {
      id: 'dispute_evidence_checklist',
      label: 'Dispute evidence checklist',
      source: 'evidence_checklist',
      item_count: (readiness.evidence_checklist || []).length,
      blocked_item_count: (readiness.evidence_checklist || []).filter((item) => item.status === 'blocked').length,
      summary: 'Redacted dispute evidence checklist for founder/legal/provider preparation without private IDs, addresses, payment data, wallet data, secrets, raw media, or live provider values.',
    },
    {
      id: 'dispute_review_action_queue',
      label: 'Dispute review action queue',
      source: 'dispute_review_action_queue',
      item_count: (readiness.dispute_review_action_queue || []).length,
      blocked_item_count: (readiness.dispute_review_action_queue || [])
        .filter((item) => item.action_live_status === 'BLOCKED_FOR_LIVE').length,
      summary: 'Dispute intake packet, evidence redaction packet, peer review packet, and legal/escrow/payment gate actions remain blocked for live use.',
    },
    {
      id: 'dispute_blocked_live_gate',
      label: 'Dispute blocked live gate',
      source: 'public_beta_gate',
      item_count: (readiness.blocked_live_actions || []).length,
      blocked_item_count: (readiness.blocked_live_actions || []).length,
      summary: 'Liability decisions, escrow release, refunds, escrow overrides, money movement, real payment routing, provider commitments, legal decisions, and production release remain blocked.',
    },
  ];
  const copyableMarkdown = [
    '# Dispute Evidence Review Packet',
    '',
    `Status: ${readiness.status}`,
    `Mode: dispute_evidence_review_packet`,
    `Readiness checks: ${(readiness.readiness_checks || []).length}`,
    `Evidence checklist items: ${(readiness.evidence_checklist || []).length}`,
    `Review action queue items: ${(readiness.dispute_review_action_queue || []).length}`,
    `Blocked live actions: ${(readiness.blocked_live_actions || []).join(', ')}`,
    '',
    '## Packet Sections',
    ...packetSections.map((section) => (
      `- ${section.label}: ${section.item_count} item(s), ${section.blocked_item_count} blocked; ${section.summary}`
    )),
    '',
    '## Redaction Attestation',
    'Use request IDs and redacted summaries only. Do not include private IDs, addresses, payment data, wallet data, raw media, provider credentials, secrets, legal conclusions, liability decisions, refund approvals, escrow releases, payment routing, stablecoin settlement, token collateral locks, or production approvals.',
  ].join('\n');

  return {
    mode: 'dispute_evidence_review_packet',
    status: 'local_packet_ready',
    local_only: true,
    source_mode: readiness.mode,
    packet_sections: packetSections,
    readiness_summary: readiness.summary,
    evidence_summary: readiness.evidence_summary,
    action_queue_summary: readiness.action_queue_summary,
    redaction_attestation: {
      request_ids_only: true,
      redacted_summaries_only: true,
      private_identifiers: 'blocked',
      addresses: 'blocked',
      payment_data: 'blocked',
      wallet_data: 'blocked',
      raw_media: 'blocked',
      provider_credentials: 'blocked',
      secrets: 'blocked',
    },
    copyable_markdown: copyableMarkdown,
    review_packet_gate: {
      local_packet_review: 'ready',
      external_send: 'blocked',
      provider_submission: 'blocked',
      liability_decision: 'blocked',
      escrow_release: 'blocked',
      refund_issue: 'blocked',
      payment_movement: 'blocked',
      payment_routing: 'blocked',
      stablecoin_settlement: 'blocked',
      token_collateral_lock: 'blocked',
      legal_decision: 'blocked',
      auth_rls_change: 'blocked',
      production_release: 'blocked',
      reason: 'This dispute evidence packet is a local review artifact only. It cannot decide liability, release escrow, issue refunds, move payments, route payments, submit provider packets, make legal/provider decisions, change Auth/RLS, or release production.',
    },
    safe_report_fields: readiness.safe_report_fields,
    blocked_live_actions: [
      ...new Set([
        ...(readiness.blocked_live_actions || []),
        'external_send',
        'provider_submission',
        'liability_decision',
        'auth_rls_change',
      ]),
    ].sort(),
    no_server_storage_attempted: true,
    no_dispute_review_packet_content_stored: true,
    no_live_action_attempted: true,
  };
}

function buildMilestoneEvidenceReadiness() {
  const readinessChecks = [
    readinessItem(
      'project_contract_context_check',
      'Project contract context',
      'review',
      'Milestone evidence should be tied to a local project contract or selected job before founder/provider review.'
    ),
    readinessItem(
      'milestone_scope_check',
      'Milestone scope and amount validation',
      'ready',
      'Milestone create requests validate job, title, sequence, positive amount, work status, payment status, and bounded notes before any Supabase write attempt.'
    ),
    readinessItem(
      'work_progress_evidence_check',
      'Visible work progress evidence',
      'review',
      'Founder/tester review should capture redacted photos, notes, scope match, and completion status before any future payment-provider review.'
    ),
    readinessItem(
      'repayment_waterfall_context_check',
      'Repayment waterfall context',
      'review',
      'Milestone payments can be reviewed beside local loan and repayment-waterfall records, but no real repayment routing is enabled.'
    ),
    readinessItem(
      'payment_escrow_release_block',
      'Payment and escrow release block',
      'blocked',
      'This readiness surface cannot hold funds, release escrow, move payments, settle stablecoins, route repayment, lock token collateral, or make legal/provider decisions.',
      'founder/legal/provider'
    ),
  ];

  const milestoneEvidenceChecklist = [
    readinessItem(
      'scope_match_evidence',
      'Scope match evidence',
      'review',
      'Record whether visible work matches approved scope, milestone title, sequence, and notes without making a legal completion decision.'
    ),
    readinessItem(
      'photo_video_metadata',
      'Photo/video metadata redaction',
      'review',
      'Use redacted evidence metadata only; do not store private addresses, IDs, payment data, raw recordings, or customer secrets in shared reports.'
    ),
    readinessItem(
      'payment_status_boundary',
      'Payment status boundary',
      'blocked',
      'Payment status can be displayed for demo review, but the panel cannot mark funds as released, refunded, repaid, or settled.',
      'founder/legal/provider'
    ),
    readinessItem(
      'escrow_provider_review',
      'Escrow provider review required',
      'blocked',
      'Licensed escrow/payment provider review is required before any held funds, escrow release, refund, charge, or payout instruction.',
      'founder/legal/provider'
    ),
  ];
  const milestoneReviewActionQueue = [
    {
      id: 'scope_evidence_packet_review',
      label: 'Scope evidence packet review',
      owner: 'founder/admin',
      action_live_status: 'BLOCKED_FOR_LIVE',
      next_safe_action: 'Compare local milestone title, sequence, scope notes, job context, and redacted evidence summaries before any acceptance or provider discussion.',
      required_evidence: [
        'milestone_scope_summary',
        'job_context_summary',
        'redacted_scope_match_notes',
      ],
      blocked_live_actions: [
        'approve_milestone_live',
        'create_signed_change_order',
        'release_escrow',
        'move_payment',
      ],
    },
    {
      id: 'visible_progress_packet_review',
      label: 'Visible progress packet review',
      owner: 'founder/admin',
      action_live_status: 'BLOCKED_FOR_LIVE',
      next_safe_action: 'Collect redacted photo/video/note metadata and visible-work progress summaries without storing raw private media or deciding legal completion.',
      required_evidence: [
        'redacted_photo_video_metadata',
        'visible_work_progress_summary',
        'raw_media_redaction_attestation',
      ],
      blocked_live_actions: [
        'decide_legal_completion',
        'publish_raw_media',
        'release_escrow',
        'provider_submission',
      ],
    },
    {
      id: 'payment_status_boundary_review',
      label: 'Payment status boundary review',
      owner: 'founder/admin',
      action_live_status: 'BLOCKED_FOR_LIVE',
      next_safe_action: 'Confirm local payment status is demo metadata only and cannot mark funds released, refunded, repaid, settled, or moved.',
      required_evidence: [
        'demo_payment_status_note',
        'no_payment_authority_attestation',
        'repayment_waterfall_context_note',
      ],
      blocked_live_actions: [
        'move_payment',
        'route_real_repayment',
        'settle_stablecoin',
        'issue_refund',
      ],
    },
    {
      id: 'escrow_release_gate_review',
      label: 'Escrow release gate review',
      owner: 'founder/legal/provider',
      action_live_status: 'BLOCKED_FOR_LIVE',
      next_safe_action: 'Keep escrow release, payment movement, repayment routing, stablecoin settlement, token collateral, provider submission, and legal decisions blocked until external gates are cleared.',
      required_evidence: [
        'founder_go_no_go',
        'licensed_escrow_payment_provider_review',
        'legal_review_and_qa_clearance',
      ],
      blocked_live_actions: [
        'hold_escrow',
        'release_escrow',
        'move_payment',
        'lock_token_collateral',
        'production_release',
      ],
    },
  ];

  return {
    mode: 'milestone_evidence_readiness',
    status: 'local_review_ready',
    local_only: true,
    readiness_checks: readinessChecks,
    milestone_evidence_checklist: milestoneEvidenceChecklist,
    milestone_review_action_queue: milestoneReviewActionQueue,
    summary: readinessSummary(readinessChecks),
    evidence_summary: readinessSummary(milestoneEvidenceChecklist),
    action_queue_summary: {
      queue_item_count: milestoneReviewActionQueue.length,
      blocked_for_live_count: milestoneReviewActionQueue.filter((item) => item.action_live_status === 'BLOCKED_FOR_LIVE').length,
      required_evidence_count: milestoneReviewActionQueue.reduce((sum, item) => sum + item.required_evidence.length, 0),
      blocked_live_action_count: [...new Set(milestoneReviewActionQueue.flatMap((item) => item.blocked_live_actions))].length,
    },
    source_routes: [
      '/api/smartcontractor/project-contracts',
      '/api/smartcontractor/milestones',
      '/api/payments/intents',
      '/api/smartcontractor/loans',
      '/api/admin/milestone-evidence-readiness',
    ],
    release_gate: {
      local_milestone_review: 'review',
      live_escrow_release: 'blocked',
      live_payment_movement: 'blocked',
      live_repayment_routing: 'blocked',
      stablecoin_settlement: 'blocked',
      token_collateral_lock: 'blocked',
      reason: 'Milestone evidence is local review material only until founder, legal, escrow/payment provider, Auth/admin, and QA gates are cleared.',
    },
    safe_report_fields: {
      request_id: 'safe to share',
      job_id: 'safe if it is a demo/local id',
      milestone_id: 'safe if it is a demo/local id',
      work_status: 'safe metadata only',
      payment_status: 'safe demo status only; not payment authority',
      redacted_evidence_summary: 'summary only; no private IDs, addresses, payment data, secrets, raw files, or live provider values',
    },
    blocked_live_actions: [
      'hold_escrow',
      'release_escrow',
      'issue_refund',
      'move_payment',
      'route_real_repayment',
      'settle_stablecoin',
      'lock_token_collateral',
      'provider_commitment',
      'legal_decision',
      'production_release',
    ],
    next_safe_steps: [
      'Use this Admin panel to verify local milestone scope, visible progress evidence, and payment-status boundaries before a controlled demo.',
      'Collect only redacted local evidence summaries and request IDs for founder/tester reports.',
      'Keep escrow release, refunds, payment movement, repayment routing, stablecoin settlement, token collateral, provider commitments, and legal decisions blocked until external review.',
    ],
  };
}

function buildMilestoneEvidenceReviewPacket() {
  const readiness = buildMilestoneEvidenceReadiness();
  const packetSections = [
    {
      id: 'milestone_readiness_checks',
      label: 'Milestone readiness checks',
      source: 'readiness_checks',
      item_count: (readiness.readiness_checks || []).length,
      blocked_item_count: (readiness.readiness_checks || []).filter((item) => item.status === 'blocked').length,
      summary: 'Project contract context, milestone scope, visible work progress, repayment waterfall, and payment/escrow release gates for local review only.',
    },
    {
      id: 'milestone_evidence_checklist',
      label: 'Milestone evidence checklist',
      source: 'milestone_evidence_checklist',
      item_count: (readiness.milestone_evidence_checklist || []).length,
      blocked_item_count: (readiness.milestone_evidence_checklist || []).filter((item) => item.status === 'blocked').length,
      summary: 'Redacted milestone evidence checklist for founder/legal/provider preparation without private IDs, addresses, payment data, wallet data, secrets, raw media, or live provider values.',
    },
    {
      id: 'milestone_review_action_queue',
      label: 'Milestone review action queue',
      source: 'milestone_review_action_queue',
      item_count: (readiness.milestone_review_action_queue || []).length,
      blocked_item_count: (readiness.milestone_review_action_queue || [])
        .filter((item) => item.action_live_status === 'BLOCKED_FOR_LIVE').length,
      summary: 'Scope evidence packet, visible progress packet, payment status boundary, and escrow release gate actions remain blocked for live use.',
    },
    {
      id: 'milestone_blocked_live_gate',
      label: 'Milestone blocked live gate',
      source: 'release_gate',
      item_count: (readiness.blocked_live_actions || []).length,
      blocked_item_count: (readiness.blocked_live_actions || []).length,
      summary: 'Milestone acceptance, escrow release, refunds, payment movement, repayment routing, stablecoin settlement, token collateral, provider/legal decisions, and production release remain blocked.',
    },
  ];
  const copyableMarkdown = [
    '# Milestone Evidence Review Packet',
    '',
    `Status: ${readiness.status}`,
    `Mode: milestone_evidence_review_packet`,
    `Readiness checks: ${(readiness.readiness_checks || []).length}`,
    `Evidence checklist items: ${(readiness.milestone_evidence_checklist || []).length}`,
    `Review action queue items: ${(readiness.milestone_review_action_queue || []).length}`,
    `Blocked live actions: ${(readiness.blocked_live_actions || []).join(', ')}`,
    '',
    '## Packet Sections',
    ...packetSections.map((section) => (
      `- ${section.label}: ${section.item_count} item(s), ${section.blocked_item_count} blocked; ${section.summary}`
    )),
    '',
    '## Redaction Attestation',
    'Use request IDs and redacted summaries only. Do not include private IDs, addresses, payment data, wallet data, raw media, provider credentials, secrets, legal decisions, milestone acceptance, escrow releases, refunds, payment movement, repayment routing, stablecoin settlement, token collateral locks, or production approvals.',
  ].join('\n');

  return {
    mode: 'milestone_evidence_review_packet',
    status: 'local_packet_ready',
    local_only: true,
    source_mode: readiness.mode,
    packet_sections: packetSections,
    readiness_summary: readiness.summary,
    evidence_summary: readiness.evidence_summary,
    action_queue_summary: readiness.action_queue_summary,
    redaction_attestation: {
      request_ids_only: true,
      redacted_summaries_only: true,
      private_identifiers: 'blocked',
      addresses: 'blocked',
      payment_data: 'blocked',
      wallet_data: 'blocked',
      raw_media: 'blocked',
      provider_credentials: 'blocked',
      secrets: 'blocked',
    },
    copyable_markdown: copyableMarkdown,
    review_packet_gate: {
      local_packet_review: 'ready',
      external_send: 'blocked',
      provider_submission: 'blocked',
      milestone_acceptance: 'blocked',
      escrow_release: 'blocked',
      refund_issue: 'blocked',
      payment_movement: 'blocked',
      repayment_routing: 'blocked',
      stablecoin_settlement: 'blocked',
      token_collateral_lock: 'blocked',
      legal_decision: 'blocked',
      auth_rls_change: 'blocked',
      production_release: 'blocked',
      reason: 'This milestone evidence packet is a local review artifact only. It cannot approve milestones, release escrow, issue refunds, move payments, route repayment, settle stablecoins, lock token collateral, submit provider packets, make legal/provider decisions, change Auth/RLS, or release production.',
    },
    safe_report_fields: readiness.safe_report_fields,
    blocked_live_actions: [
      ...new Set([
        ...(readiness.blocked_live_actions || []),
        'external_send',
        'provider_submission',
        'milestone_acceptance',
        'auth_rls_change',
      ]),
    ].sort(),
    no_server_storage_attempted: true,
    no_milestone_review_packet_content_stored: true,
    no_live_action_attempted: true,
  };
}

function buildWorkingCapitalReadiness() {
  const readinessChecks = [
    readinessItem(
      'contractor_identity_credit_check',
      'Contractor identity and credit context',
      'review',
      'Founder/tester review should confirm local contractor identity, business profile, EIN/license/compliance evidence, ratings, dispute history, and repayment history before any lender/provider packet.'
    ),
    readinessItem(
      'project_contract_collateral_check',
      'Project contract and collateral context',
      'review',
      'Working-capital review should be tied to a local project contract, milestone scope, job budget, and any demo collateral reference without creating a lien, pledge, escrow hold, or token lock.'
    ),
    readinessItem(
      'risk_score_affordability_check',
      'Risk score and affordability preview',
      'ready',
      'Loan scoring displays local UBI/EIN/license/rating/repayment/dispute factors and estimated affordability only; it is not credit approval or adverse-action output.'
    ),
    readinessItem(
      'repayment_waterfall_readiness_check',
      'Repayment waterfall review context',
      'review',
      'Use the local repayment-waterfall review packet to inspect principal, outstanding balance, milestone payment context, and blocked routing before any provider/legal review.'
    ),
    readinessItem(
      'funding_approval_block',
      'Funding and loan approval block',
      'blocked',
      'This readiness surface cannot approve credit, fund a contractor, originate a loan, route repayment, move payments, release escrow, settle stablecoins, lock token collateral, or make legal/provider decisions.',
      'founder/legal/provider'
    ),
  ];

  const workingCapitalChecklist = [
    readinessItem(
      'identity_compliance_evidence',
      'Identity and compliance evidence',
      'review',
      'Record only redacted contractor/business evidence and request IDs; do not store private IDs, tax data, service-role values, provider credentials, or wallet secrets in shared reports.'
    ),
    readinessItem(
      'signed_project_contract_context',
      'Signed project contract context',
      'review',
      'Confirm the local project contract, job scope, homeowner/contractor IDs, terms summary, and milestone schedule before using a starter-loan review draft.'
    ),
    readinessItem(
      'milestone_funding_scope',
      'Milestone funding scope',
      'review',
      'Tie requested working capital to visible milestone needs, materials/start-work purpose, and demo amount boundaries without treating the amount as approved financing.'
    ),
    readinessItem(
      'repayment_waterfall_preview',
      'Repayment waterfall preview',
      'review',
      'Review whether future milestone payments could repay principal first in a local draft only; no payment routing, balance reduction, or repayment instruction is executed.'
    ),
    readinessItem(
      'no_live_funding_approval',
      'No live funding approval',
      'blocked',
      'Founder, legal, lender/provider, Auth/admin, RLS, and QA gates are required before any real credit decision, funding, repayment routing, collateral lock, or adverse-action workflow.',
      'founder/legal/provider'
    ),
  ];
  const workingCapitalReviewActionQueue = [
    {
      id: 'identity_packet_review',
      label: 'Identity packet review',
      owner: 'founder/admin',
      action_live_status: 'BLOCKED_FOR_LIVE',
      next_safe_action: 'Collect redacted contractor identity, EIN/license/compliance, rating, dispute, and repayment-history notes for local founder review only.',
      required_evidence: [
        'redacted_contractor_profile',
        'license_or_compliance_status_note',
        'repayment_and_dispute_summary',
      ],
      blocked_live_actions: [
        'verify_identity_final',
        'approve_real_loan',
        'fund_contractor',
        'provider_submission',
      ],
    },
    {
      id: 'contract_packet_review',
      label: 'Project contract packet review',
      owner: 'founder/admin',
      action_live_status: 'BLOCKED_FOR_LIVE',
      next_safe_action: 'Confirm local project contract, job scope, homeowner/contractor IDs, and milestone schedule before any lender/provider draft packet.',
      required_evidence: [
        'local_project_contract_id',
        'job_scope_summary',
        'milestone_schedule_summary',
      ],
      blocked_live_actions: [
        'create_legal_contract',
        'start_escrow',
        'activate_provider_terms',
        'provider_submission',
      ],
    },
    {
      id: 'milestone_scope_review',
      label: 'Milestone funding scope review',
      owner: 'founder/admin',
      action_live_status: 'BLOCKED_FOR_LIVE',
      next_safe_action: 'Tie requested working capital to visible milestone needs and demo materials/start-work purpose without treating the amount as approved financing.',
      required_evidence: [
        'milestone_scope_summary',
        'visible_work_or_material_need',
        'demo_amount_boundary',
      ],
      blocked_live_actions: [
        'approve_material_draw',
        'release_escrow',
        'move_payment',
        'fund_contractor',
      ],
    },
    {
      id: 'repayment_waterfall_packet_review',
      label: 'Repayment waterfall packet review',
      owner: 'founder/admin',
      action_live_status: 'BLOCKED_FOR_LIVE',
      next_safe_action: 'Open the local repayment-waterfall review packet and verify principal-first milestone payment assumptions before founder/legal/provider review.',
      required_evidence: [
        'repayment_waterfall_review_packet',
        'principal_first_preview',
        'blocked_routing_attestation',
      ],
      blocked_live_actions: [
        'route_real_repayment',
        'reduce_balance',
        'settle_stablecoin',
        'move_payment',
      ],
    },
    {
      id: 'funding_gate_review',
      label: 'Funding gate review',
      owner: 'founder/legal/provider',
      action_live_status: 'BLOCKED_FOR_LIVE',
      next_safe_action: 'Keep the item blocked until founder, legal, lender/payment provider, Auth/admin, RLS, and QA gates are explicitly cleared outside autonomous Codex.',
      required_evidence: [
        'founder_go_no_go',
        'legal_provider_review',
        'auth_admin_rls_qa_clearance',
      ],
      blocked_live_actions: [
        'approve_real_loan',
        'originate_loan',
        'fund_contractor',
        'lock_token_collateral',
        'production_release',
      ],
    },
  ];
  const repaymentWaterfallBoard = [
    {
      id: 'contractor_identity_gate',
      label: 'Contractor identity gate',
      board_state: 'REVIEW',
      required_evidence: [
        'verified_business_profile',
        'license_or_compliance_note',
        'no_private_ids_in_chat',
      ],
      next_safe_action: 'Confirm local contractor identity evidence is present before any working-capital review packet is trusted.',
      blocked_live_actions: [
        'approve_credit',
        'fund_contractor',
        'originate_loan',
        'move_payment',
      ],
    },
    {
      id: 'signed_project_contract_gate',
      label: 'Signed project contract gate',
      board_state: 'HOLD_FOR_CONTRACT_REVIEW',
      required_evidence: [
        'project_contract_record',
        'homeowner_contractor_scope',
        'milestone_schedule',
      ],
      next_safe_action: 'Review the local project contract and milestone scope before any repayment waterfall draft is considered.',
      blocked_live_actions: [
        'create_signed_contract',
        'start_escrow',
        'release_escrow',
        'route_repayment',
      ],
    },
    {
      id: 'milestone_evidence_gate',
      label: 'Milestone evidence gate',
      board_state: 'REVIEW',
      required_evidence: [
        'visible_progress_evidence',
        'homeowner_signal',
        'dispute_status',
      ],
      next_safe_action: 'Compare milestone evidence with requested release and dispute status before drafting repayment routing notes.',
      blocked_live_actions: [
        'approve_milestone',
        'release_payment',
        'issue_refund',
        'route_repayment',
      ],
    },
    {
      id: 'repayment_waterfall_gate',
      label: 'Repayment waterfall gate',
      board_state: 'BLOCKED_FOR_LIVE',
      required_evidence: [
        'loan_balance_snapshot',
        'repayment_priority_rule',
        'provider_legal_review',
      ],
      next_safe_action: 'Keep repayment waterfall as local review text until provider/legal review and founder approval exist.',
      blocked_live_actions: [
        'route_repayment',
        'settle_stablecoin',
        'lock_token_collateral',
        'provider_commitment',
      ],
    },
    {
      id: 'funding_gate',
      label: 'Funding gate',
      board_state: 'BLOCKED_FOR_LIVE',
      required_evidence: [
        'founder_decision_log',
        'legal_provider_clearance',
        'strict_admin_evidence',
      ],
      next_safe_action: 'Hold all contractor funding and live loan approval until founder/legal/provider/Auth gates are cleared.',
      blocked_live_actions: [
        'approve_live_loan',
        'fund_contractor',
        'move_money',
        'production_release',
      ],
    },
  ];

  return {
    mode: 'working_capital_readiness',
    status: 'local_review_ready',
    local_only: true,
    readiness_checks: readinessChecks,
    working_capital_checklist: workingCapitalChecklist,
    working_capital_review_action_queue: workingCapitalReviewActionQueue,
    working_capital_repayment_waterfall_board: repaymentWaterfallBoard,
    repayment_waterfall_board_note: 'No live repayment waterfall action can be approved, routed, funded, settled, collateralized, or released from this local readiness board.',
    summary: readinessSummary(readinessChecks),
    evidence_summary: readinessSummary(workingCapitalChecklist),
    action_queue_summary: {
      queue_item_count: workingCapitalReviewActionQueue.length,
      blocked_for_live_count: workingCapitalReviewActionQueue.filter((item) => item.action_live_status === 'BLOCKED_FOR_LIVE').length,
      required_evidence_count: workingCapitalReviewActionQueue.reduce((sum, item) => sum + item.required_evidence.length, 0),
      blocked_live_action_count: [...new Set(workingCapitalReviewActionQueue.flatMap((item) => item.blocked_live_actions))].length,
    },
    source_routes: [
      '/api/smartcontractor/loans',
      '/api/smartcontractor/project-contracts',
      '/api/smartcontractor/milestones',
      '/api/admin/contract-backed-loan/repayment-waterfall/review-packet',
      '/api/admin/ai-agents/recommendations',
      '/api/admin/working-capital-readiness',
    ],
    funding_gate: {
      local_credit_review: 'review',
      live_loan_approval: 'blocked',
      contractor_funding: 'blocked',
      repayment_routing: 'blocked',
      payment_movement: 'blocked',
      escrow_release: 'blocked',
      stablecoin_settlement: 'blocked',
      token_collateral_lock: 'blocked',
      reason: 'Working-capital records are local review material only until founder, legal, lender/payment provider, Auth/admin, RLS, and QA gates are cleared.',
    },
    safe_report_fields: {
      request_id: 'safe to share',
      contractor_id: 'safe if it is a demo/local id',
      loan_id: 'safe if it is a demo/local id',
      project_contract_id: 'safe if it is a demo/local id',
      risk_score: 'demo preview only; not approval or denial',
      redacted_review_summary: 'summary only; no private IDs, tax data, payment data, secrets, raw files, or live provider values',
    },
    blocked_live_actions: [
      'approve_real_loan',
      'fund_contractor',
      'originate_loan',
      'move_payment',
      'route_real_repayment',
      'release_escrow',
      'settle_stablecoin',
      'lock_token_collateral',
      'provider_commitment',
      'legal_decision',
      'production_release',
    ],
    next_safe_steps: [
      'Use this Admin panel to verify local contractor identity, project contract context, risk preview, and repayment-waterfall readiness before a controlled demo.',
      'Collect only redacted local review summaries and request IDs for founder/tester reports.',
      'Keep credit approval, funding, repayment routing, escrow release, payment movement, stablecoin settlement, token collateral, provider commitments, and legal decisions blocked until external review.',
    ],
  };
}

function buildWorkingCapitalReviewPacket() {
  const readiness = buildWorkingCapitalReadiness();
  const packetSections = [
    {
      id: 'working_capital_readiness_checks',
      label: 'Working capital readiness checks',
      source: 'readiness_checks',
      item_count: (readiness.readiness_checks || []).length,
      blocked_item_count: (readiness.readiness_checks || []).filter((item) => item.status === 'blocked').length,
      summary: 'Contractor identity, project contract/collateral, risk score, repayment waterfall, and funding approval gates for local review only.',
    },
    {
      id: 'working_capital_evidence_checklist',
      label: 'Working capital evidence checklist',
      source: 'working_capital_checklist',
      item_count: (readiness.working_capital_checklist || []).length,
      blocked_item_count: (readiness.working_capital_checklist || []).filter((item) => item.status === 'blocked').length,
      summary: 'Redacted evidence checklist for founder/legal/provider preparation without private IDs, tax data, payment data, wallet data, secrets, raw files, or live provider values.',
    },
    {
      id: 'working_capital_review_action_queue',
      label: 'Working capital review action queue',
      source: 'working_capital_review_action_queue',
      item_count: (readiness.working_capital_review_action_queue || []).length,
      blocked_item_count: (readiness.working_capital_review_action_queue || [])
        .filter((item) => item.action_live_status === 'BLOCKED_FOR_LIVE').length,
      summary: 'Identity packet, project contract packet, milestone scope, repayment waterfall packet, and funding gate actions remain blocked for live use.',
    },
    {
      id: 'working_capital_repayment_waterfall_board',
      label: 'Working capital repayment waterfall board',
      source: 'working_capital_repayment_waterfall_board',
      item_count: (readiness.working_capital_repayment_waterfall_board || []).length,
      blocked_item_count: (readiness.working_capital_repayment_waterfall_board || [])
        .filter((item) => item.board_state === 'BLOCKED_FOR_LIVE').length,
      summary: 'Contractor identity, signed project contract, milestone evidence, repayment waterfall, and funding gates stay local while repayment routing and funding remain blocked.',
    },
    {
      id: 'working_capital_blocked_live_gate',
      label: 'Working capital blocked live gate',
      source: 'funding_gate',
      item_count: (readiness.blocked_live_actions || []).length,
      blocked_item_count: (readiness.blocked_live_actions || []).length,
      summary: 'Credit approval, contractor funding, loan origination, payment movement, repayment routing, escrow release, stablecoin settlement, token collateral, provider/legal decisions, and production release remain blocked.',
    },
  ];
  const copyableMarkdown = [
    '# Working Capital Review Packet',
    '',
    `Status: ${readiness.status}`,
    `Mode: working_capital_review_packet`,
    `Readiness checks: ${(readiness.readiness_checks || []).length}`,
    `Evidence checklist items: ${(readiness.working_capital_checklist || []).length}`,
    `Review action queue items: ${(readiness.working_capital_review_action_queue || []).length}`,
    `Repayment waterfall board rows: ${(readiness.working_capital_repayment_waterfall_board || []).length}`,
    `Blocked live actions: ${(readiness.blocked_live_actions || []).join(', ')}`,
    '',
    '## Packet Sections',
    ...packetSections.map((section) => (
      `- ${section.label}: ${section.item_count} item(s), ${section.blocked_item_count} blocked; ${section.summary}`
    )),
    '',
    '## Redaction Attestation',
    'Use request IDs and redacted summaries only. Do not include private IDs, tax data, payment data, wallet data, raw evidence, provider credentials, secrets, legal decisions, credit approvals, escrow releases, repayment routing, stablecoin settlement, token collateral locks, or production approvals.',
  ].join('\n');

  return {
    mode: 'working_capital_review_packet',
    status: 'local_packet_ready',
    local_only: true,
    source_mode: readiness.mode,
    packet_sections: packetSections,
    readiness_summary: readiness.summary,
    evidence_summary: readiness.evidence_summary,
    action_queue_summary: readiness.action_queue_summary,
    redaction_attestation: {
      request_ids_only: true,
      redacted_summaries_only: true,
      private_identifiers: 'blocked',
      tax_data: 'blocked',
      payment_data: 'blocked',
      wallet_data: 'blocked',
      raw_evidence: 'blocked',
      provider_credentials: 'blocked',
      secrets: 'blocked',
    },
    copyable_markdown: copyableMarkdown,
    review_packet_gate: {
      local_packet_review: 'ready',
      external_send: 'blocked',
      provider_submission: 'blocked',
      credit_approval: 'blocked',
      contractor_funding: 'blocked',
      loan_origination: 'blocked',
      payment_movement: 'blocked',
      repayment_routing: 'blocked',
      escrow_release: 'blocked',
      stablecoin_settlement: 'blocked',
      token_collateral_lock: 'blocked',
      legal_decision: 'blocked',
      auth_rls_change: 'blocked',
      production_release: 'blocked',
      reason: 'This working-capital packet is a local review artifact only. It cannot approve credit, fund contractors, originate loans, move payments, route repayment, release escrow, settle stablecoins, lock token collateral, submit provider packets, make legal/provider decisions, change Auth/RLS, or release production.',
    },
    safe_report_fields: readiness.safe_report_fields,
    blocked_live_actions: [
      ...new Set([
        ...(readiness.blocked_live_actions || []),
        'external_send',
        'provider_submission',
        'credit_approval',
        'auth_rls_change',
      ]),
    ].sort(),
    no_server_storage_attempted: true,
    no_review_packet_content_stored: true,
    no_live_action_attempted: true,
  };
}

function buildContractorReputationReadiness() {
  const readinessChecks = [
    readinessItem(
      'completed_job_history_check',
      'Completed job history',
      'review',
      'Founder/tester review should compare completed jobs, milestone records, visible progress evidence, and project contract context before trusting any local reputation summary.'
    ),
    readinessItem(
      'rating_review_check',
      'Rating and review context',
      'review',
      'Ratings and reviews can be shown as local demo signals only; they need Auth, ownership, moderation, appeal, and abuse controls before public scoring.'
    ),
    readinessItem(
      'dispute_repayment_signal_check',
      'Dispute and repayment signals',
      'review',
      'Dispute history, peer review, repayment history, and payment exceptions should be reviewed as context, not automatic credit, legal, provider, or trust decisions.'
    ),
    readinessItem(
      'bid_accuracy_response_check',
      'Bid accuracy and response behavior',
      'review',
      'Bid accuracy, response time, timeline accuracy, and completion quality should stay local review metadata until analytics, consent, and audit rules are approved.'
    ),
    readinessItem(
      'reputation_decision_block',
      'Public score and decision block',
      'blocked',
      'This readiness surface cannot publish reputation scores, approve credit, deny contractors, assign contractors, route leads, make legal/provider decisions, or create adverse-action outputs.',
      'founder/legal/provider'
    ),
  ];

  const reputationChecklist = [
    readinessItem(
      'identity_binding_check',
      'Identity binding evidence',
      'review',
      'Confirm each reputation signal belongs to the correct local contractor profile and does not mix unrelated homeowner, worker, payment, or wallet data.'
    ),
    readinessItem(
      'completed_work_evidence',
      'Completed work evidence',
      'review',
      'Use redacted milestone, project contract, and completion evidence summaries only; do not expose private addresses, IDs, payment data, raw media, or customer secrets.'
    ),
    readinessItem(
      'review_moderation_boundary',
      'Review moderation boundary',
      'review',
      'Moderation, appeals, defamation review, and abuse handling must be founder/legal reviewed before public review or trust-score use.'
    ),
    readinessItem(
      'credit_decision_boundary',
      'Credit decision boundary',
      'blocked',
      'Reputation signals can inform local readiness packets only; they cannot approve loans, deny credit, produce adverse-action reasons, or replace lender/provider review.',
      'founder/legal/provider'
    ),
    readinessItem(
      'public_score_boundary',
      'Public reputation score boundary',
      'blocked',
      'No public reputation score, badge, ranking, lead-routing boost, or contractor eligibility decision is enabled from this local surface.',
      'founder/legal/provider'
    ),
  ];
  const reputationReviewActionQueue = [
    {
      id: 'reputation_signal_packet_review',
      label: 'Reputation signal packet review',
      owner: 'founder/admin',
      action_live_status: 'BLOCKED_FOR_LIVE',
      next_safe_action: 'Collect redacted completed-job, rating, dispute, repayment, bid-accuracy, and response-time notes for local founder review only.',
      required_evidence: [
        'redacted_completed_job_summary',
        'rating_review_context',
        'dispute_repayment_signal_summary',
      ],
      blocked_live_actions: [
        'publish_reputation_score',
        'rank_contractors_publicly',
        'route_real_leads',
        'assign_contractor',
      ],
    },
    {
      id: 'moderation_appeal_packet_review',
      label: 'Moderation and appeal packet review',
      owner: 'founder/legal',
      action_live_status: 'BLOCKED_FOR_LIVE',
      next_safe_action: 'Confirm moderation, appeal, abuse-handling, and defamation review requirements before any public trust-score or review display.',
      required_evidence: [
        'moderation_rule_summary',
        'appeal_path_summary',
        'abuse_handling_boundary',
      ],
      blocked_live_actions: [
        'publish_public_reviews',
        'remove_or_hide_reviews_live',
        'make_legal_decision',
        'production_release',
      ],
    },
    {
      id: 'credit_boundary_packet_review',
      label: 'Credit boundary packet review',
      owner: 'founder/legal/provider',
      action_live_status: 'BLOCKED_FOR_LIVE',
      next_safe_action: 'Keep reputation signals separated from lender/provider decisions and adverse-action outputs until external review clears the model.',
      required_evidence: [
        'credit_use_boundary_note',
        'provider_review_required',
        'adverse_action_block_attestation',
      ],
      blocked_live_actions: [
        'approve_real_loan',
        'deny_credit',
        'generate_adverse_action',
        'provider_commitment',
      ],
    },
    {
      id: 'public_score_gate_review',
      label: 'Public score gate review',
      owner: 'founder/legal/provider',
      action_live_status: 'BLOCKED_FOR_LIVE',
      next_safe_action: 'Keep public badges, rankings, lead-routing boosts, eligibility decisions, and production release blocked until founder/legal/provider gates are cleared.',
      required_evidence: [
        'founder_go_no_go',
        'legal_provider_review',
        'privacy_moderation_qa_clearance',
      ],
      blocked_live_actions: [
        'publish_reputation_score',
        'rank_contractors_publicly',
        'route_real_leads',
        'production_release',
      ],
    },
  ];
  const contractorReputationPublicScoreBoard = [
    {
      id: 'signal_ownership_gate',
      label: 'Signal ownership gate',
      board_state: 'REVIEW',
      required_evidence: [
        'local_contractor_profile_match',
        'completed_job_signal_summary',
        'no_cross_user_signal_mixing',
      ],
      next_safe_action: 'Confirm each local reputation signal belongs to the correct contractor before any public-score draft is trusted.',
      blocked_live_actions: [
        'publish_reputation_score',
        'rank_contractors_publicly',
        'route_real_leads',
        'assign_contractor',
      ],
    },
    {
      id: 'privacy_moderation_gate',
      label: 'Privacy and moderation gate',
      board_state: 'HOLD_FOR_MODERATION_REVIEW',
      required_evidence: [
        'redacted_review_summary',
        'appeal_path_summary',
        'abuse_handling_boundary',
      ],
      next_safe_action: 'Review privacy, moderation, appeal, and abuse-handling notes before any public review or badge language is drafted.',
      blocked_live_actions: [
        'publish_public_reviews',
        'remove_or_hide_reviews_live',
        'make_legal_decision',
        'production_release',
      ],
    },
    {
      id: 'credit_use_boundary_gate',
      label: 'Credit use boundary gate',
      board_state: 'BLOCKED_FOR_LIVE',
      required_evidence: [
        'credit_use_boundary_note',
        'provider_review_required',
        'adverse_action_block_attestation',
      ],
      next_safe_action: 'Keep reputation signals out of credit approval, denial, and adverse-action outputs until provider/legal review clears the model.',
      blocked_live_actions: [
        'approve_real_loan',
        'deny_credit',
        'generate_adverse_action',
        'provider_commitment',
      ],
    },
    {
      id: 'lead_routing_gate',
      label: 'Lead routing gate',
      board_state: 'BLOCKED_FOR_LIVE',
      required_evidence: [
        'lead_routing_policy_note',
        'contractor_eligibility_boundary',
        'founder_go_no_go',
      ],
      next_safe_action: 'Keep lead-routing priority and contractor assignment as local review notes until founder/legal/provider gates are cleared.',
      blocked_live_actions: [
        'route_real_leads',
        'rank_contractors_publicly',
        'assign_contractor',
        'production_release',
      ],
    },
    {
      id: 'public_score_release_gate',
      label: 'Public score release gate',
      board_state: 'BLOCKED_FOR_LIVE',
      required_evidence: [
        'founder_decision_log',
        'legal_provider_clearance',
        'privacy_moderation_qa_clearance',
      ],
      next_safe_action: 'Hold public reputation score, badge, ranking, and production release until founder/legal/provider/Auth gates are cleared.',
      blocked_live_actions: [
        'publish_reputation_score',
        'publish_public_reviews',
        'rank_contractors_publicly',
        'production_release',
      ],
    },
  ];

  return {
    mode: 'contractor_reputation_readiness',
    status: 'local_review_ready',
    local_only: true,
    readiness_checks: readinessChecks,
    reputation_checklist: reputationChecklist,
    reputation_review_action_queue: reputationReviewActionQueue,
    contractor_reputation_public_score_board: contractorReputationPublicScoreBoard,
    public_score_board_note: 'No live public reputation score action can publish scores, rank contractors, route leads, approve or deny credit, assign contractors, or release production from this local board.',
    summary: readinessSummary(readinessChecks),
    evidence_summary: readinessSummary(reputationChecklist),
    action_queue_summary: {
      queue_item_count: reputationReviewActionQueue.length,
      blocked_for_live_count: reputationReviewActionQueue.filter((item) => item.action_live_status === 'BLOCKED_FOR_LIVE').length,
      required_evidence_count: reputationReviewActionQueue.reduce((sum, item) => sum + item.required_evidence.length, 0),
      blocked_live_action_count: [...new Set(reputationReviewActionQueue.flatMap((item) => item.blocked_live_actions))].length,
    },
    source_routes: [
      '/api/smartcontractor/contractors',
      '/api/smartcontractor/jobs',
      '/api/smartcontractor/bids',
      '/api/smartcontractor/milestones',
      '/api/smartcontractor/loans',
      '/api/smartcontractor/disputes',
      '/api/admin/contractor-reputation-readiness',
    ],
    reputation_gate: {
      local_reputation_review: 'review',
      public_reputation_score: 'blocked',
      credit_decision_use: 'blocked',
      contractor_eligibility_decision: 'blocked',
      lead_routing_priority: 'blocked',
      adverse_action_output: 'blocked',
      legal_provider_decision: 'blocked',
      reason: 'Contractor reputation signals remain local review metadata until founder, legal, provider, Auth/admin, ownership, moderation, privacy, and QA gates are cleared.',
    },
    safe_report_fields: {
      request_id: 'safe to share',
      contractor_id: 'safe if it is a demo/local id',
      completed_job_count: 'local aggregate only',
      rating_summary: 'local aggregate only; not public score',
      dispute_summary: 'local aggregate only; not legal decision',
      repayment_summary: 'local aggregate only; not credit approval',
      redacted_reputation_summary: 'summary only; no private IDs, addresses, payment data, raw media, wallet data, secrets, or live provider values',
    },
    blocked_live_actions: [
      'publish_reputation_score',
      'rank_contractors_publicly',
      'route_real_leads',
      'approve_real_loan',
      'deny_credit',
      'generate_adverse_action',
      'assign_contractor',
      'make_legal_decision',
      'provider_commitment',
      'production_release',
    ],
    next_safe_steps: [
      'Use this Admin panel to verify local contractor reputation signals before a controlled demo.',
      'Collect only redacted local reputation summaries and request IDs for founder/tester reports.',
      'Keep public scores, contractor ranking, lead routing, credit decisions, adverse-action output, provider commitments, and legal decisions blocked until external review.',
    ],
  };
}

function buildContractorReputationReviewPacket() {
  const readiness = buildContractorReputationReadiness();
  const packetSections = [
    {
      id: 'contractor_reputation_readiness_checks',
      label: 'Contractor reputation readiness checks',
      source: 'readiness_checks',
      item_count: (readiness.readiness_checks || []).length,
      blocked_item_count: (readiness.readiness_checks || []).filter((item) => item.status === 'blocked').length,
      summary: 'Completed job history, ratings, dispute and repayment signals, bid accuracy, response behavior, and public score/credit/legal gates for local review only.',
    },
    {
      id: 'contractor_reputation_checklist',
      label: 'Contractor reputation checklist',
      source: 'reputation_checklist',
      item_count: (readiness.reputation_checklist || []).length,
      blocked_item_count: (readiness.reputation_checklist || []).filter((item) => item.status === 'blocked').length,
      summary: 'Redacted contractor reputation checklist for founder/legal/provider preparation without private IDs, addresses, payment data, wallet data, raw media, secrets, or live provider values.',
    },
    {
      id: 'contractor_reputation_review_action_queue',
      label: 'Contractor reputation review action queue',
      source: 'reputation_review_action_queue',
      item_count: (readiness.reputation_review_action_queue || []).length,
      blocked_item_count: (readiness.reputation_review_action_queue || [])
        .filter((item) => item.action_live_status === 'BLOCKED_FOR_LIVE').length,
      summary: 'Reputation signal packet, moderation and appeal packet, credit boundary packet, and public score gate actions remain blocked for live use.',
    },
    {
      id: 'contractor_reputation_public_score_board',
      label: 'Contractor reputation public score board',
      source: 'contractor_reputation_public_score_board',
      item_count: (readiness.contractor_reputation_public_score_board || []).length,
      blocked_item_count: (readiness.contractor_reputation_public_score_board || [])
        .filter((item) => item.board_state === 'BLOCKED_FOR_LIVE').length,
      summary: 'Signal ownership, privacy/moderation, credit-use, lead-routing, and public-score release gates stay local while public scoring and routing remain blocked.',
    },
    {
      id: 'contractor_reputation_blocked_live_gate',
      label: 'Contractor reputation blocked live gate',
      source: 'reputation_gate',
      item_count: (readiness.blocked_live_actions || []).length,
      blocked_item_count: (readiness.blocked_live_actions || []).length,
      summary: 'Public scores, rankings, real lead routing, credit approval or denial, adverse-action outputs, contractor assignment, provider/legal decisions, and production release remain blocked.',
    },
  ];
  const copyableMarkdown = [
    '# Contractor Reputation Review Packet',
    '',
    `Status: ${readiness.status}`,
    `Mode: contractor_reputation_review_packet`,
    `Readiness checks: ${(readiness.readiness_checks || []).length}`,
    `Reputation checklist items: ${(readiness.reputation_checklist || []).length}`,
    `Review action queue items: ${(readiness.reputation_review_action_queue || []).length}`,
    `Public score board rows: ${(readiness.contractor_reputation_public_score_board || []).length}`,
    `Blocked live actions: ${(readiness.blocked_live_actions || []).join(', ')}`,
    '',
    '## Packet Sections',
    ...packetSections.map((section) => (
      `- ${section.label}: ${section.item_count} item(s), ${section.blocked_item_count} blocked; ${section.summary}`
    )),
    '',
    '## Redaction Attestation',
    'Use request IDs and redacted summaries only. Do not include full private IDs, private addresses, payment data, wallet data, raw media, provider credentials, secrets, public reputation scores, rankings, lead-routing decisions, credit approvals or denials, adverse-action outputs, contractor assignments, provider commitments, legal decisions, Auth/RLS changes, or production approvals.',
  ].join('\n');

  return {
    mode: 'contractor_reputation_review_packet',
    status: 'local_packet_ready',
    local_only: true,
    source_mode: readiness.mode,
    packet_sections: packetSections,
    readiness_summary: readiness.summary,
    evidence_summary: readiness.evidence_summary,
    action_queue_summary: readiness.action_queue_summary,
    redaction_attestation: {
      request_ids_only: true,
      redacted_summaries_only: true,
      private_identifiers: 'blocked',
      addresses: 'blocked',
      payment_data: 'blocked',
      wallet_data: 'blocked',
      raw_media: 'blocked',
      provider_credentials: 'blocked',
      secrets: 'blocked',
    },
    copyable_markdown: copyableMarkdown,
    review_packet_gate: {
      local_packet_review: 'ready',
      external_send: 'blocked',
      provider_submission: 'blocked',
      public_reputation_score: 'blocked',
      contractor_ranking: 'blocked',
      lead_routing_priority: 'blocked',
      credit_decision: 'blocked',
      contractor_eligibility_decision: 'blocked',
      adverse_action_output: 'blocked',
      contractor_assignment: 'blocked',
      auth_rls_change: 'blocked',
      legal_decision: 'blocked',
      production_release: 'blocked',
      reason: 'This contractor reputation packet is a local review artifact only. It cannot publish scores, rank contractors, route real leads, approve or deny credit, create adverse-action output, assign contractors, submit provider packets, make legal/provider decisions, change Auth/RLS, or release production.',
    },
    safe_report_fields: readiness.safe_report_fields,
    blocked_live_actions: [
      ...new Set([
        ...(readiness.blocked_live_actions || []),
        'external_send',
        'provider_submission',
        'auth_rls_change',
      ]),
    ].sort(),
    no_server_storage_attempted: true,
    no_review_packet_content_stored: true,
    no_contractor_reputation_review_packet_content_stored: true,
    no_live_action_attempted: true,
  };
}

function buildContractorVerificationReadiness() {
  const readinessChecks = [
    readinessItem(
      'license_evidence_check',
      'License evidence readiness',
      'review',
      'Founder/tester review should confirm local contractor license number format, jurisdiction label, expiration metadata, and redacted evidence before any live provider lookup.'
    ),
    readinessItem(
      'insurance_evidence_check',
      'Insurance evidence readiness',
      'review',
      'Insurance status, policy metadata, certificate notes, and coverage summary stay local review metadata until a provider, legal, and founder process is approved.'
    ),
    readinessItem(
      'business_identity_check',
      'Business identity readiness',
      'review',
      'Business name, EIN/UBI style fields, address metadata, profile binding, and owner/contact context must be redacted and tied to the local contractor profile before external review.'
    ),
    readinessItem(
      'compliance_provider_boundary_check',
      'Compliance provider boundary',
      'blocked',
      'No government, insurance, KYB/KYC, credit, or compliance provider lookup is executed from this readiness surface.',
      'founder/legal/provider'
    ),
    readinessItem(
      'verification_decision_block',
      'Verification and eligibility decision block',
      'blocked',
      'This readiness surface cannot verify a contractor live, approve or deny contractor eligibility, route real leads, change Auth roles, update RLS, make legal decisions, or commit to providers.',
      'founder/legal/provider'
    ),
  ];

  const verificationChecklist = [
    readinessItem(
      'license_metadata_redaction',
      'License metadata redaction',
      'review',
      'Keep only local/demo license metadata and redacted notes in founder/tester reports; do not expose full IDs, private addresses, provider credentials, or external account values.'
    ),
    readinessItem(
      'insurance_certificate_summary',
      'Insurance certificate summary',
      'review',
      'Use summarized certificate status, coverage type, and expiration metadata only; no insurance-provider verification or coverage decision is made.'
    ),
    readinessItem(
      'business_profile_binding',
      'Business profile binding',
      'review',
      'Confirm the business identity evidence belongs to the selected local contractor profile and does not mix homeowner, worker, wallet, payment, or unrelated business records.'
    ),
    readinessItem(
      'provider_lookup_boundary',
      'Provider lookup boundary',
      'blocked',
      'Founder/legal/provider approval is required before KYB/KYC, license registry, insurance, government, credit, or compliance provider integrations are used.',
      'founder/legal/provider'
    ),
    readinessItem(
      'eligibility_decision_boundary',
      'Eligibility decision boundary',
      'blocked',
      'Local verification notes cannot approve contractor eligibility, reject contractors, prioritize lead routing, create adverse-action outputs, or replace legal/provider review.',
      'founder/legal/provider'
    ),
  ];
  const verificationReviewActionQueue = [
    {
      id: 'license_packet_review',
      label: 'License packet review',
      owner: 'founder/admin',
      action_live_status: 'BLOCKED_FOR_LIVE',
      next_safe_action: 'Collect redacted local license number format, jurisdiction, expiration metadata, and evidence notes before any provider or government lookup discussion.',
      required_evidence: [
        'redacted_license_metadata',
        'jurisdiction_label',
        'expiration_metadata',
      ],
      blocked_live_actions: [
        'verify_contractor_live',
        'call_license_registry',
        'approve_contractor_eligibility',
        'route_real_leads',
      ],
    },
    {
      id: 'insurance_packet_review',
      label: 'Insurance packet review',
      owner: 'founder/admin',
      action_live_status: 'BLOCKED_FOR_LIVE',
      next_safe_action: 'Summarize local insurance status, certificate metadata, coverage type, and expiration notes without contacting insurance providers or approving coverage.',
      required_evidence: [
        'redacted_insurance_summary',
        'coverage_type_metadata',
        'certificate_expiration_note',
      ],
      blocked_live_actions: [
        'verify_insurance_live',
        'approve_coverage',
        'activate_provider_verification',
        'provider_commitment',
      ],
    },
    {
      id: 'business_identity_packet_review',
      label: 'Business identity packet review',
      owner: 'founder/admin',
      action_live_status: 'BLOCKED_FOR_LIVE',
      next_safe_action: 'Confirm business name, EIN/UBI style fields, address metadata, profile binding, and owner/contact context are redacted and tied to the local contractor profile.',
      required_evidence: [
        'redacted_business_identity_summary',
        'profile_binding_evidence',
        'owner_contact_context_boundary',
      ],
      blocked_live_actions: [
        'run_kyb_kyc_lookup',
        'verify_tax_identity_live',
        'change_auth_role',
        'change_rls_policy',
      ],
    },
    {
      id: 'provider_boundary_packet_review',
      label: 'Provider boundary packet review',
      owner: 'founder/legal/provider',
      action_live_status: 'BLOCKED_FOR_LIVE',
      next_safe_action: 'Keep license registry, insurance, KYB/KYC, government, credit, and compliance-provider integrations blocked until founder/legal/provider review selects a reviewed process.',
      required_evidence: [
        'provider_review_required_note',
        'no_provider_lookup_attestation',
        'privacy_redaction_boundary',
      ],
      blocked_live_actions: [
        'activate_provider_verification',
        'submit_provider_packet',
        'make_provider_commitment',
        'production_release',
      ],
    },
    {
      id: 'eligibility_gate_review',
      label: 'Eligibility gate review',
      owner: 'founder/legal/provider',
      action_live_status: 'BLOCKED_FOR_LIVE',
      next_safe_action: 'Keep contractor eligibility approval, denial, lead-routing priority, adverse-action output, Auth/RLS changes, and production release blocked until external gates are cleared.',
      required_evidence: [
        'founder_go_no_go',
        'legal_provider_review',
        'auth_rls_qa_clearance',
      ],
      blocked_live_actions: [
        'approve_contractor_eligibility',
        'deny_contractor_eligibility',
        'route_real_leads',
        'generate_adverse_action',
        'production_release',
      ],
    },
  ];
  const contractorVerificationEligibilityBoard = [
    {
      id: 'license_evidence_gate',
      label: 'License evidence gate',
      board_state: 'REVIEW',
      required_evidence: [
        'redacted_license_metadata',
        'jurisdiction_label',
        'expiration_metadata',
      ],
      next_safe_action: 'Confirm local license metadata is redacted and tied to the selected contractor before any registry lookup discussion.',
      blocked_live_actions: [
        'verify_contractor_live',
        'call_license_registry',
        'approve_contractor_eligibility',
        'route_real_leads',
      ],
    },
    {
      id: 'insurance_evidence_gate',
      label: 'Insurance evidence gate',
      board_state: 'REVIEW',
      required_evidence: [
        'redacted_insurance_summary',
        'coverage_type_metadata',
        'certificate_expiration_note',
      ],
      next_safe_action: 'Review insurance metadata as local evidence only before any coverage or provider-verification discussion.',
      blocked_live_actions: [
        'verify_insurance_live',
        'approve_coverage',
        'activate_provider_verification',
        'provider_commitment',
      ],
    },
    {
      id: 'business_identity_gate',
      label: 'Business identity gate',
      board_state: 'REVIEW',
      required_evidence: [
        'redacted_business_identity_summary',
        'profile_binding_evidence',
        'owner_contact_context_boundary',
      ],
      next_safe_action: 'Confirm business identity evidence belongs to the local contractor profile and does not mix user, wallet, payment, or unrelated business records.',
      blocked_live_actions: [
        'run_kyb_kyc_lookup',
        'verify_tax_identity_live',
        'change_auth_role',
        'change_rls_policy',
      ],
    },
    {
      id: 'provider_lookup_gate',
      label: 'Provider lookup gate',
      board_state: 'BLOCKED_FOR_LIVE',
      required_evidence: [
        'provider_review_required_note',
        'no_provider_lookup_attestation',
        'privacy_redaction_boundary',
      ],
      next_safe_action: 'Keep all license, insurance, KYB/KYC, government, credit, and compliance provider lookups blocked until founder/legal/provider review selects a process.',
      blocked_live_actions: [
        'activate_provider_verification',
        'submit_provider_packet',
        'run_kyb_kyc_lookup',
        'provider_commitment',
      ],
    },
    {
      id: 'eligibility_auth_rls_gate',
      label: 'Eligibility/Auth/RLS gate',
      board_state: 'BLOCKED_FOR_LIVE',
      required_evidence: [
        'founder_go_no_go',
        'legal_provider_review',
        'auth_rls_qa_clearance',
      ],
      next_safe_action: 'Hold contractor eligibility approval, denial, lead routing, Auth/RLS changes, adverse-action output, and production release until external gates are cleared.',
      blocked_live_actions: [
        'approve_contractor_eligibility',
        'deny_contractor_eligibility',
        'change_auth_role',
        'change_rls_policy',
        'production_release',
      ],
    },
  ];

  return {
    mode: 'contractor_verification_readiness',
    status: 'local_review_ready',
    local_only: true,
    readiness_checks: readinessChecks,
    verification_checklist: verificationChecklist,
    verification_review_action_queue: verificationReviewActionQueue,
    contractor_verification_eligibility_board: contractorVerificationEligibilityBoard,
    eligibility_board_note: 'No live contractor verification action can verify contractors, run KYB/KYC, approve eligibility, deny eligibility, route leads, change Auth/RLS, submit provider packets, or release production from this local board.',
    summary: readinessSummary(readinessChecks),
    evidence_summary: readinessSummary(verificationChecklist),
    action_queue_summary: {
      queue_item_count: verificationReviewActionQueue.length,
      blocked_for_live_count: verificationReviewActionQueue.filter((item) => item.action_live_status === 'BLOCKED_FOR_LIVE').length,
      required_evidence_count: verificationReviewActionQueue.reduce((sum, item) => sum + item.required_evidence.length, 0),
      blocked_live_action_count: [...new Set(verificationReviewActionQueue.flatMap((item) => item.blocked_live_actions))].length,
    },
    source_routes: [
      '/api/smartcontractor/contractors',
      '/api/verification/checks',
      '/api/verification/webhook',
      '/api/auth/profile',
      '/api/admin/contractor-verification-readiness',
    ],
    verification_gate: {
      local_verification_review: 'review',
      live_license_verification: 'blocked',
      live_insurance_verification: 'blocked',
      provider_verification: 'blocked',
      contractor_eligibility_decision: 'blocked',
      lead_routing_priority: 'blocked',
      auth_role_change: 'blocked',
      rls_policy_change: 'blocked',
      legal_compliance_decision: 'blocked',
      reason: 'Contractor verification evidence remains local review metadata until founder, legal, provider, Auth/admin, ownership, privacy, RLS, and QA gates are cleared.',
    },
    safe_report_fields: {
      request_id: 'safe to share',
      contractor_id: 'safe if it is a demo/local id',
      license_status: 'local metadata only; not live verification',
      insurance_status: 'local metadata only; not coverage approval',
      business_identity_summary: 'redacted summary only',
      verification_notes: 'summary only; no private IDs, addresses, payment data, secrets, provider credentials, or live account values',
    },
    blocked_live_actions: [
      'verify_contractor_live',
      'approve_contractor_eligibility',
      'deny_contractor_eligibility',
      'route_real_leads',
      'activate_provider_verification',
      'change_auth_role',
      'change_rls_policy',
      'make_legal_decision',
      'provider_commitment',
      'production_release',
    ],
    next_safe_steps: [
      'Use this Admin panel to verify local contractor license, insurance, business identity, and compliance evidence readiness before a controlled demo.',
      'Collect only redacted local verification summaries and request IDs for founder/tester reports.',
      'Keep live license checks, insurance verification, KYB/KYC, government/compliance provider calls, eligibility decisions, Auth/RLS changes, lead routing, provider commitments, and legal decisions blocked until external review.',
    ],
  };
}

function buildContractorVerificationReviewPacket() {
  const readiness = buildContractorVerificationReadiness();
  const packetSections = [
    {
      id: 'contractor_verification_readiness_checks',
      label: 'Contractor verification readiness checks',
      source: 'readiness_checks',
      item_count: (readiness.readiness_checks || []).length,
      blocked_item_count: (readiness.readiness_checks || []).filter((item) => item.status === 'blocked').length,
      summary: 'License evidence, insurance evidence, business identity, provider boundary, and eligibility/Auth/RLS gates for local review only.',
    },
    {
      id: 'contractor_verification_checklist',
      label: 'Contractor verification checklist',
      source: 'verification_checklist',
      item_count: (readiness.verification_checklist || []).length,
      blocked_item_count: (readiness.verification_checklist || []).filter((item) => item.status === 'blocked').length,
      summary: 'Redacted contractor verification checklist for founder/legal/provider preparation without private IDs, addresses, payment data, wallet data, provider credentials, secrets, raw evidence, or live provider values.',
    },
    {
      id: 'contractor_verification_review_action_queue',
      label: 'Contractor verification review action queue',
      source: 'verification_review_action_queue',
      item_count: (readiness.verification_review_action_queue || []).length,
      blocked_item_count: (readiness.verification_review_action_queue || [])
        .filter((item) => item.action_live_status === 'BLOCKED_FOR_LIVE').length,
      summary: 'License packet, insurance packet, business identity packet, provider boundary packet, and eligibility gate actions remain blocked for live use.',
    },
    {
      id: 'contractor_verification_eligibility_board',
      label: 'Contractor verification eligibility board',
      source: 'contractor_verification_eligibility_board',
      item_count: (readiness.contractor_verification_eligibility_board || []).length,
      blocked_item_count: (readiness.contractor_verification_eligibility_board || [])
        .filter((item) => item.board_state === 'BLOCKED_FOR_LIVE').length,
      summary: 'License evidence, insurance evidence, business identity, provider lookup, and eligibility/Auth/RLS gates stay local while live verification remains blocked.',
    },
    {
      id: 'contractor_verification_blocked_live_gate',
      label: 'Contractor verification blocked live gate',
      source: 'verification_gate',
      item_count: (readiness.blocked_live_actions || []).length,
      blocked_item_count: (readiness.blocked_live_actions || []).length,
      summary: 'Live contractor verification, eligibility approval or denial, lead routing, provider activation, Auth/RLS changes, legal decisions, and production release remain blocked.',
    },
  ];
  const copyableMarkdown = [
    '# Contractor Verification Review Packet',
    '',
    `Status: ${readiness.status}`,
    `Mode: contractor_verification_review_packet`,
    `Readiness checks: ${(readiness.readiness_checks || []).length}`,
    `Verification checklist items: ${(readiness.verification_checklist || []).length}`,
    `Review action queue items: ${(readiness.verification_review_action_queue || []).length}`,
    `Eligibility board rows: ${(readiness.contractor_verification_eligibility_board || []).length}`,
    `Blocked live actions: ${(readiness.blocked_live_actions || []).join(', ')}`,
    '',
    '## Packet Sections',
    ...packetSections.map((section) => (
      `- ${section.label}: ${section.item_count} item(s), ${section.blocked_item_count} blocked; ${section.summary}`
    )),
    '',
    '## Redaction Attestation',
    'Use request IDs and redacted summaries only. Do not include full private IDs, private addresses, payment data, wallet data, raw evidence, provider credentials, secrets, live registry results, eligibility approvals or denials, Auth/RLS changes, provider commitments, legal decisions, or production approvals.',
  ].join('\n');

  return {
    mode: 'contractor_verification_review_packet',
    status: 'local_packet_ready',
    local_only: true,
    source_mode: readiness.mode,
    packet_sections: packetSections,
    readiness_summary: readiness.summary,
    evidence_summary: readiness.evidence_summary,
    action_queue_summary: readiness.action_queue_summary,
    redaction_attestation: {
      request_ids_only: true,
      redacted_summaries_only: true,
      private_identifiers: 'blocked',
      addresses: 'blocked',
      payment_data: 'blocked',
      wallet_data: 'blocked',
      raw_evidence: 'blocked',
      provider_credentials: 'blocked',
      live_registry_results: 'blocked',
      secrets: 'blocked',
    },
    copyable_markdown: copyableMarkdown,
    review_packet_gate: {
      local_packet_review: 'ready',
      external_send: 'blocked',
      provider_submission: 'blocked',
      live_license_verification: 'blocked',
      live_insurance_verification: 'blocked',
      kyb_kyc_lookup: 'blocked',
      eligibility_decision: 'blocked',
      lead_routing_priority: 'blocked',
      auth_role_change: 'blocked',
      rls_policy_change: 'blocked',
      legal_decision: 'blocked',
      production_release: 'blocked',
      reason: 'This contractor verification packet is a local review artifact only. It cannot verify contractors live, submit provider packets, run KYB/KYC, approve or deny eligibility, route real leads, change Auth/RLS, make legal/provider decisions, or release production.',
    },
    safe_report_fields: readiness.safe_report_fields,
    blocked_live_actions: [
      ...new Set([
        ...(readiness.blocked_live_actions || []),
        'external_send',
        'provider_submission',
        'kyb_kyc_lookup',
        'eligibility_decision',
      ]),
    ].sort(),
    no_server_storage_attempted: true,
    no_contractor_verification_review_packet_content_stored: true,
    no_live_action_attempted: true,
  };
}

function getReadinessReviewActionQueue(report = {}) {
  return (
    report.verification_review_action_queue ||
    report.reputation_review_action_queue ||
    report.working_capital_review_action_queue ||
    report.milestone_review_action_queue ||
    report.dispute_review_action_queue ||
    report.review_action_queue ||
    []
  );
}

function buildAdminReadinessOverview(options = {}) {
  const reports = [
    {
      id: 'contractor_verification',
      label: 'Contractor Verification',
      endpoint: '/api/admin/contractor-verification-readiness',
      panel_anchor: '#contractorVerificationReadinessSummary',
      blocked_until: 'founder/legal/provider/Auth/RLS/QA review',
      next_review_action: 'Review license, insurance, business identity, compliance evidence, and provider boundary before any eligibility discussion.',
      report: buildContractorVerificationReadiness(),
    },
    {
      id: 'contractor_reputation',
      label: 'Contractor Reputation',
      endpoint: '/api/admin/contractor-reputation-readiness',
      panel_anchor: '#contractorReputationReadinessSummary',
      blocked_until: 'founder/legal/provider/moderation/privacy/QA review',
      next_review_action: 'Review completed jobs, ratings, disputes, repayment signals, bid accuracy, and public-score boundary before trust-score discussion.',
      report: buildContractorReputationReadiness(),
    },
    {
      id: 'working_capital',
      label: 'Working Capital',
      endpoint: '/api/admin/working-capital-readiness',
      panel_anchor: '#workingCapitalReadinessSummary',
      blocked_until: 'founder/legal/lender/payment-provider/Auth/RLS/QA review',
      next_review_action: 'Review contractor identity, project contract context, risk preview, and repayment-waterfall boundary before lending-provider discussion.',
      report: buildWorkingCapitalReadiness(),
    },
    {
      id: 'milestone_evidence',
      label: 'Milestone Evidence',
      endpoint: '/api/admin/milestone-evidence-readiness',
      panel_anchor: '#milestoneEvidenceReadinessSummary',
      blocked_until: 'founder/legal/escrow-payment-provider/Auth/QA review',
      next_review_action: 'Review milestone scope, visible progress evidence, payment status, and escrow/payment/repayment boundary before release discussion.',
      report: buildMilestoneEvidenceReadiness(),
    },
    {
      id: 'dispute_evidence',
      label: 'Dispute Evidence',
      endpoint: '/api/admin/dispute-evidence-readiness',
      panel_anchor: '#disputeEvidenceReadinessSummary',
      blocked_until: 'founder/legal/escrow-payment-provider/Auth/QA review',
      next_review_action: 'Review dispute intake, evidence metadata, milestone context, peer review, and legal/escrow/payment boundary before outcome discussion.',
      report: buildDisputeEvidenceReadiness(),
    },
  ];

  const readinessSurfaceFilters = [
    {
      id: 'all_readiness_surfaces',
      label: 'All readiness surfaces',
      surface_ids: reports.map((item) => item.id),
      live_action_status: 'blocked',
    },
    ...reports.map((item) => ({
      id: item.id,
      label: item.label,
      surface_ids: [item.id],
      live_action_status: 'blocked',
    })),
  ];
  const requestedReadinessSurfaceFilter = typeof options.surface_filter === 'string' && options.surface_filter.trim()
    ? options.surface_filter.trim()
    : 'all_readiness_surfaces';
  const selectedReadinessSurfaceFilter = readinessSurfaceFilters.find((filter) => filter.id === requestedReadinessSurfaceFilter) || null;
  const selectedReports = selectedReadinessSurfaceFilter
    ? reports.filter((item) => selectedReadinessSurfaceFilter.surface_ids.includes(item.id))
    : reports;

  const readinessSurfaces = selectedReports.map((item) => ({
    id: item.id,
    label: item.label,
    mode: item.report.mode,
    status: item.report.status,
    endpoint: item.endpoint,
    panel_anchor: item.panel_anchor,
    local_only: item.report.local_only === true,
    readiness_check_count: (item.report.readiness_checks || []).length,
    blocked_readiness_check_count: (item.report.readiness_checks || []).filter((check) => check.status === 'blocked').length,
    checklist_count: (
      item.report.verification_checklist ||
      item.report.reputation_checklist ||
      item.report.working_capital_checklist ||
      item.report.milestone_evidence_checklist ||
      item.report.evidence_checklist ||
      []
    ).length,
    review_action_queue_count: getReadinessReviewActionQueue(item.report).length,
    blocked_review_action_queue_count: getReadinessReviewActionQueue(item.report)
      .filter((action) => action.action_live_status === 'BLOCKED_FOR_LIVE').length,
    review_action_queue_ids: getReadinessReviewActionQueue(item.report)
      .map((action) => action.id),
    blocked_live_action_count: (item.report.blocked_live_actions || []).length,
    blocked_until: item.blocked_until,
    next_review_action: item.next_review_action,
    safe_report_fields: item.report.safe_report_fields || {},
  }));

  const blockedLiveActions = [...new Set(selectedReports.flatMap((item) => item.report.blocked_live_actions || []))].sort();
  const reviewActionQueueRollup = selectedReports.flatMap((item) => (
    getReadinessReviewActionQueue(item.report).map((action) => ({
      surface_id: item.id,
      surface_label: item.label,
      endpoint: item.endpoint,
      panel_anchor: item.panel_anchor,
      action_id: action.id,
      label: action.label,
      owner: action.owner,
      action_live_status: action.action_live_status || 'BLOCKED_FOR_LIVE',
      next_safe_action: action.next_safe_action,
      required_evidence_count: (action.required_evidence || []).length,
      blocked_live_action_count: (action.blocked_live_actions || []).length,
      blocked_live_actions: action.blocked_live_actions || [],
    }))
  ));
  const totalChecks = readinessSurfaces.reduce((sum, item) => sum + item.readiness_check_count, 0);
  const blockedChecks = readinessSurfaces.reduce((sum, item) => sum + item.blocked_readiness_check_count, 0);
  const reviewActionQueueCount = reviewActionQueueRollup.length;
  const blockedReviewActionQueueCount = reviewActionQueueRollup.filter((item) => item.action_live_status === 'BLOCKED_FOR_LIVE').length;

  return {
    mode: 'admin_readiness_overview',
    status: 'local_review_ready',
    local_only: true,
    surface_filter: requestedReadinessSurfaceFilter,
    requested_readiness_surface_filter: requestedReadinessSurfaceFilter,
    selected_readiness_surface_filter: selectedReadinessSurfaceFilter,
    valid_readiness_surface_filter_ids: readinessSurfaceFilters.map((filter) => filter.id),
    readiness_surface_filters: readinessSurfaceFilters,
    readiness_surfaces: readinessSurfaces,
    review_action_queue_rollup: reviewActionQueueRollup,
    summary: {
      readiness_surface_count: readinessSurfaces.length,
      local_only_surface_count: readinessSurfaces.filter((item) => item.local_only).length,
      readiness_check_count: totalChecks,
      blocked_readiness_check_count: blockedChecks,
      review_action_queue_count: reviewActionQueueCount,
      blocked_review_action_queue_count: blockedReviewActionQueueCount,
      review_action_queue_surface_count: readinessSurfaces.filter((item) => item.review_action_queue_count > 0).length,
      blocked_live_action_count: blockedLiveActions.length,
      endpoint_count: readinessSurfaces.length,
    },
    overview_gate: {
      local_admin_review: 'ready',
      provider_legal_money_boundary: 'blocked',
      live_provider_actions: 'blocked',
      live_money_actions: 'blocked',
      legal_decisions: 'blocked',
      auth_role_changes: 'blocked',
      rls_policy_changes: 'blocked',
      review_action_queue_live_actions: 'blocked',
      production_release: 'blocked',
      reason: 'This overview only aggregates local Admin readiness surfaces. It cannot verify providers, approve eligibility, approve credit, release escrow, move money, change Auth/RLS, make legal decisions, or ship production.',
    },
    blocked_live_actions: blockedLiveActions,
    next_safe_steps: [
      'Use this overview to decide which local readiness panel needs founder/tester review next.',
      'Keep reports redacted and tied to request IDs only.',
      'Escalate live provider, legal, money, Auth/RLS, and production decisions to founder-approved external review.',
    ],
    no_live_action_attempted: true,
  };
}

function buildAdminReadinessOverviewReviewPacket(options = {}) {
  const overview = buildAdminReadinessOverview(options);
  const packetSections = [
    {
      id: 'readiness_overview_surface_index',
      label: 'Readiness overview surface index',
      source: 'readiness_surfaces',
      item_count: (overview.readiness_surfaces || []).length,
      blocked_item_count: (overview.readiness_surfaces || []).filter((surface) =>
        surface.blocked_readiness_check_count > 0 || surface.blocked_review_action_queue_count > 0
      ).length,
      summary: 'Selected local Admin readiness surfaces with endpoints, anchors, blocked-until gates, and next review actions for founder/legal/provider preparation only.',
    },
    {
      id: 'readiness_overview_review_action_queue_rollup',
      label: 'Readiness overview review action queue rollup',
      source: 'review_action_queue_rollup',
      item_count: (overview.review_action_queue_rollup || []).length,
      blocked_item_count: (overview.review_action_queue_rollup || [])
        .filter((action) => action.action_live_status === 'BLOCKED_FOR_LIVE').length,
      summary: 'Blocked-live review actions across selected contractor verification, contractor reputation, working-capital, milestone evidence, and dispute evidence readiness surfaces.',
    },
    {
      id: 'readiness_overview_filter_context',
      label: 'Readiness overview filter context',
      source: 'selected_readiness_surface_filter',
      item_count: (overview.valid_readiness_surface_filter_ids || []).length,
      blocked_item_count: 0,
      summary: `Selected surface filter ${overview.selected_readiness_surface_filter?.id || overview.requested_readiness_surface_filter || 'all_readiness_surfaces'} stays local-only and cannot trigger provider, legal, money, Auth/RLS, or production actions.`,
    },
    {
      id: 'readiness_overview_blocked_live_gate',
      label: 'Readiness overview blocked live gate',
      source: 'overview_gate',
      item_count: (overview.blocked_live_actions || []).length,
      blocked_item_count: (overview.blocked_live_actions || []).length,
      summary: 'Provider verification, eligibility/credit decisions, escrow release, payment movement, legal decisions, Auth/RLS changes, external sends, and production release remain blocked.',
    },
  ];
  const copyableMarkdown = [
    '# Admin Readiness Overview Review Packet',
    '',
    `Status: ${overview.status}`,
    `Mode: admin_readiness_overview_review_packet`,
    `Selected filter: ${overview.selected_readiness_surface_filter?.id || overview.requested_readiness_surface_filter || 'all_readiness_surfaces'}`,
    `Readiness surfaces: ${(overview.readiness_surfaces || []).length}`,
    `Review action queue items: ${(overview.review_action_queue_rollup || []).length}`,
    `Blocked live actions: ${(overview.blocked_live_actions || []).join(', ')}`,
    '',
    '## Packet Sections',
    ...packetSections.map((section) => (
      `- ${section.label}: ${section.item_count} item(s), ${section.blocked_item_count} blocked; ${section.summary}`
    )),
    '',
    '## Redaction Attestation',
    'Use request IDs, selected surface IDs, endpoint paths, panel anchors, counts, and redacted summaries only. Do not include private IDs, addresses, payment data, wallet data, raw evidence, raw media, provider credentials, secrets, provider submissions, credit approvals or denials, escrow releases, payment movement, legal decisions, Auth/RLS changes, or production approvals.',
  ].join('\n');

  return {
    mode: 'admin_readiness_overview_review_packet',
    status: 'local_packet_ready',
    local_only: true,
    source_mode: overview.mode,
    requested_readiness_surface_filter: overview.requested_readiness_surface_filter,
    selected_readiness_surface_filter: overview.selected_readiness_surface_filter,
    valid_readiness_surface_filter_ids: overview.valid_readiness_surface_filter_ids,
    packet_sections: packetSections,
    overview_summary: overview.summary,
    review_action_queue_summary: {
      queue_item_count: (overview.review_action_queue_rollup || []).length,
      blocked_for_live_count: (overview.review_action_queue_rollup || [])
        .filter((action) => action.action_live_status === 'BLOCKED_FOR_LIVE').length,
      readiness_surface_count: (overview.readiness_surfaces || []).length,
      blocked_live_action_count: (overview.blocked_live_actions || []).length,
    },
    redaction_attestation: {
      request_ids_only: true,
      redacted_summaries_only: true,
      private_identifiers: 'blocked',
      addresses: 'blocked',
      payment_data: 'blocked',
      wallet_data: 'blocked',
      raw_evidence: 'blocked',
      raw_media: 'blocked',
      provider_credentials: 'blocked',
      secrets: 'blocked',
    },
    copyable_markdown: copyableMarkdown,
    review_packet_gate: {
      local_packet_review: 'ready',
      external_send: 'blocked',
      provider_submission: 'blocked',
      provider_legal_money_boundary: 'blocked',
      live_provider_actions: 'blocked',
      live_money_actions: 'blocked',
      credit_approval: 'blocked',
      escrow_release: 'blocked',
      payment_movement: 'blocked',
      auth_rls_change: 'blocked',
      legal_decision: 'blocked',
      production_release: 'blocked',
      reason: 'This admin readiness overview packet is a local review artifact only. It cannot send packets externally, submit provider data, approve eligibility or credit, release escrow, move payments, make legal/provider decisions, change Auth/RLS, or release production.',
    },
    readiness_surfaces: overview.readiness_surfaces,
    review_action_queue_rollup: overview.review_action_queue_rollup,
    blocked_live_actions: [
      ...new Set([
        ...(overview.blocked_live_actions || []),
        'external_send',
        'provider_submission',
        'auth_rls_change',
      ]),
    ].sort(),
    no_server_storage_attempted: true,
    no_review_packet_content_stored: true,
    no_admin_readiness_overview_review_packet_content_stored: true,
    no_live_action_attempted: true,
  };
}

function buildProviderEvidencePacket(options = {}) {
  const overview = buildAdminReadinessOverview(options);
  const packetSections = (overview.readiness_surfaces || []).map((surface) => ({
    id: `${surface.id}_packet_section`,
    label: `${surface.label} evidence packet`,
    mode: surface.mode,
    endpoint: surface.endpoint,
    panel_anchor: surface.panel_anchor,
    evidence_status: 'local_review_only',
    readiness_check_count: surface.readiness_check_count,
    checklist_count: surface.checklist_count,
    blocked_readiness_check_count: surface.blocked_readiness_check_count,
    blocked_live_action_count: surface.blocked_live_action_count,
    blocked_until: surface.blocked_until,
    next_review_action: surface.next_review_action,
    redacted_field_keys: Object.keys(surface.safe_report_fields || {}),
    provider_review_questions: [
      'What evidence would your organization need before this surface could be reviewed externally?',
      'Which fields must be removed, masked, or summarized before provider/legal review?',
      'Which actions remain prohibited until a written provider/legal/founder decision exists?',
    ],
  }));
  const redactionChecklist = [
    readinessItem(
      'private_identifier_redaction',
      'Private identifier redaction',
      'review',
      'Remove or mask personal IDs, tax IDs, account IDs, customer addresses, full license numbers, and unrelated profile identifiers before sharing a packet.'
    ),
    readinessItem(
      'payment_wallet_secret_redaction',
      'Payment, wallet, and secret redaction',
      'blocked',
      'Never include payment data, bank/card details, wallet private keys, seed phrases, service-role keys, provider credentials, API keys, auth tokens, or production account values.',
      'founder/security'
    ),
    readinessItem(
      'raw_media_redaction',
      'Raw media and location redaction',
      'review',
      'Use summaries or redacted screenshots instead of raw photos, videos, job addresses, customer contact details, or unapproved recordings.'
    ),
    readinessItem(
      'claims_and_decisions_boundary',
      'Claims and decisions boundary',
      'blocked',
      'The packet cannot claim provider approval, legal approval, credit approval, escrow authority, payment movement, contractor eligibility, or production readiness.',
      'founder/legal/provider'
    ),
  ];
  const blockedLiveActions = [
    ...new Set([
      ...(overview.blocked_live_actions || []),
      'provider_submission',
      'external_packet_send',
      'live_provider_lookup',
      'provider_commitment',
      'legal_decision',
      'credit_approval',
      'escrow_release',
      'payment_movement',
      'auth_role_change',
      'rls_policy_change',
      'production_release',
    ]),
  ].sort();

  return {
    mode: 'provider_evidence_packet',
    status: 'local_packet_ready',
    local_only: true,
    surface_filter: overview.surface_filter,
    requested_readiness_surface_filter: overview.requested_readiness_surface_filter,
    selected_readiness_surface_filter: overview.selected_readiness_surface_filter,
    valid_readiness_surface_filter_ids: overview.valid_readiness_surface_filter_ids,
    readiness_surface_filters: overview.readiness_surface_filters,
    packet_sections: packetSections,
    redaction_checklist: redactionChecklist,
    summary: {
      packet_section_count: packetSections.length,
      redaction_check_count: redactionChecklist.length,
      blocked_redaction_check_count: redactionChecklist.filter((item) => item.status === 'blocked').length,
      blocked_live_action_count: blockedLiveActions.length,
      selected_surface_filter: overview.selected_readiness_surface_filter?.id || null,
    },
    packet_gate: {
      local_packet_review: 'ready',
      provider_submission: 'blocked',
      external_packet_send: 'blocked',
      live_provider_lookup: 'blocked',
      provider_commitment: 'blocked',
      legal_decision: 'blocked',
      money_movement: 'blocked',
      auth_rls_change: 'blocked',
      production_release: 'blocked',
      reason: 'This packet is a local redacted evidence template only. It cannot send data externally, run provider lookups, make legal or credit decisions, move money, change Auth/RLS, or release production.',
    },
    safe_report_fields: {
      request_id: 'safe to share',
      surface_filter: 'safe local filter id',
      packet_section_count: 'safe aggregate only',
      blocked_live_action_count: 'safe aggregate only',
      redacted_summary: 'summary only; no private IDs, payment data, wallet data, raw media, secrets, provider credentials, or production account values',
    },
    blocked_live_actions: blockedLiveActions,
    next_safe_steps: [
      'Use this packet as an internal checklist for founder/legal/provider questions only.',
      'Copy only redacted summaries and request IDs into external review drafts after founder approval.',
      'Keep provider submission, legal decisions, credit approval, escrow release, payment movement, Auth/RLS changes, and production release blocked.',
    ],
    no_server_storage_attempted: true,
    no_live_action_attempted: true,
  };
}

function buildProviderEvidencePacketPrintTemplate(options = {}) {
  const packet = buildProviderEvidencePacket(options);
  const selectedFilterId = packet.selected_readiness_surface_filter?.id || packet.requested_readiness_surface_filter || 'all_readiness_surfaces';
  const sectionLines = (packet.packet_sections || []).map((section) => (
    `- ${section.label}: ${section.mode}; checks ${section.readiness_check_count}; blocked checks ${section.blocked_readiness_check_count}; blocked until ${section.blocked_until}.`
  ));
  const redactionLines = (packet.redaction_checklist || []).map((item) => (
    `- ${item.label}: ${item.status}; owner ${item.owner || 'founder_review'}.`
  ));
  const markdownPreview = [
    '# Provider Evidence Packet Print Template',
    '',
    `Request filter: ${selectedFilterId}`,
    `Mode: provider_evidence_packet_print_template`,
    '',
    '## Safety Boundary',
    'Local print/export draft only. Do not send externally, run live provider lookups, approve credit, release escrow, move payments, change Auth/RLS, make legal decisions, or release production.',
    '',
    '## Packet Sections',
    ...(sectionLines.length ? sectionLines : ['- No local packet sections selected.']),
    '',
    '## Redaction Checklist',
    ...(redactionLines.length ? redactionLines : ['- Review redaction before any draft.']),
    '',
    '## Blocked Live Actions',
    `- ${(packet.blocked_live_actions || []).join(', ')}`,
  ].join('\n');

  return {
    mode: 'provider_evidence_packet_print_template',
    status: 'local_print_template_ready',
    local_only: true,
    template_format: 'markdown_redacted_local_only',
    surface_filter: packet.surface_filter,
    requested_readiness_surface_filter: packet.requested_readiness_surface_filter,
    selected_readiness_surface_filter: packet.selected_readiness_surface_filter,
    valid_readiness_surface_filter_ids: packet.valid_readiness_surface_filter_ids,
    print_template_sections: [
      {
        id: 'packet_section_summary',
        title: 'Packet section summary',
        body: 'Summarize only local readiness section labels, modes, counts, blocked gates, panel anchors, and provider review questions.',
        source_count: packet.packet_sections.length,
        allowed_fields: ['label', 'mode', 'endpoint', 'panel_anchor', 'counts', 'blocked_until', 'next_review_action', 'provider_review_questions'],
        blocked_fields: ['private identifiers', 'payment data', 'wallet data', 'raw media', 'secrets', 'provider credentials', 'production account values'],
      },
      {
        id: 'redaction_attestation',
        title: 'Redaction attestation',
        body: 'Confirm the print/export draft excludes private identifiers, payment/wallet data, raw evidence, secrets, provider credentials, live account values, and unapproved claims.',
        source_count: packet.redaction_checklist.length,
        allowed_fields: ['check id', 'label', 'status', 'owner', 'blocked_until'],
        blocked_fields: ['PII', 'tax IDs', 'license numbers', 'addresses', 'card/bank data', 'private keys', 'auth tokens', 'API keys'],
      },
      {
        id: 'provider_question_prompt',
        title: 'Provider question prompt',
        body: 'Collect founder/legal/provider questions without claiming provider approval, legal approval, credit approval, eligibility, escrow authority, or production readiness.',
        source_count: packet.packet_sections.reduce((count, section) => count + (section.provider_review_questions || []).length, 0),
        allowed_fields: ['question text', 'surface label', 'blocked action category'],
        blocked_fields: ['provider commitments', 'legal conclusions', 'credit decisions', 'eligibility approvals'],
      },
      {
        id: 'blocked_live_action_summary',
        title: 'Blocked live action summary',
        body: 'List blocked actions as a safety boundary for review packets and founder reports.',
        source_count: packet.blocked_live_actions.length,
        allowed_fields: ['blocked action id', 'blocked status', 'manual review owner'],
        blocked_fields: ['instructions to execute live actions', 'approval language', 'signatures', 'payment routing'],
      },
    ],
    print_redaction_attestation: {
      no_private_identifiers_in_template: true,
      no_payment_or_wallet_data_in_template: true,
      no_secrets_in_template: true,
      no_raw_media_in_template: true,
      no_provider_commitments_in_template: true,
      no_legal_or_credit_decisions_in_template: true,
      no_live_action_authority_in_template: true,
      required_manual_review_before_external_use: ['founder', 'legal', 'provider', 'security'],
    },
    export_gate: {
      local_print_export: 'ready',
      local_copy_preview: 'ready',
      external_send: 'blocked',
      provider_submission: 'blocked',
      live_provider_lookup: 'blocked',
      provider_commitment: 'blocked',
      legal_decision: 'blocked',
      credit_approval: 'blocked',
      escrow_release: 'blocked',
      payment_movement: 'blocked',
      auth_rls_change: 'blocked',
      production_release: 'blocked',
      reason: 'This print template is a local redacted draft helper only. External sharing and every live-risk action require founder/legal/provider/security approval outside this API.',
    },
    packet_gate: packet.packet_gate,
    blocked_live_actions: packet.blocked_live_actions,
    copyable_markdown_preview: markdownPreview,
    next_safe_steps: [
      'Use the markdown preview for internal founder review only.',
      'Redact again before any legal/provider packet draft leaves local review.',
      'Keep external send, provider submission, live lookup, legal, credit, escrow, payment, Auth/RLS, and production actions blocked.',
    ],
    no_server_storage_attempted: true,
    no_live_action_attempted: true,
  };
}

function buildProviderEvidencePacketRedactionQa(options = {}) {
  const template = buildProviderEvidencePacketPrintTemplate(options);
  const preview = template.copyable_markdown_preview || '';
  const scanDefinitions = [
    {
      id: 'secret_phrase_scan',
      label: 'Secret-looking phrase scan',
      patterns: ['sk_live_', 'service_role=', 'private_key=', 'seed phrase:', 'bearer token:', 'auth token:', 'password='],
      recommendation: 'Remove API keys, service-role keys, private keys, seed phrases, bearer tokens, auth tokens, and password-like values before any review draft.',
    },
    {
      id: 'private_identifier_scan',
      label: 'Private identifier scan',
      patterns: ['ssn:', 'ein:', 'tax id:', 'license number:', 'account id:', 'customer address:'],
      recommendation: 'Remove or summarize personal IDs, tax IDs, full license numbers, account IDs, and customer addresses.',
    },
    {
      id: 'payment_wallet_scan',
      label: 'Payment and wallet data scan',
      patterns: ['card number:', 'bank account:', 'routing number:', 'private wallet:', 'wallet seed:', 'payment token:'],
      recommendation: 'Remove bank/card data, wallet secrets, payment provider tokens, and settlement instructions.',
    },
    {
      id: 'raw_media_location_scan',
      label: 'Raw media and location scan',
      patterns: ['raw photo url:', 'raw video url:', 'gps:', 'latitude:', 'longitude:', 'street address:'],
      recommendation: 'Use redacted screenshots and summaries instead of raw media URLs, GPS, or customer/job addresses.',
    },
    {
      id: 'approval_claim_scan',
      label: 'Approval and commitment claim scan',
      patterns: ['provider approved:', 'legal approved:', 'credit approved:', 'escrow release approved:', 'production ready:', 'external send approved:'],
      recommendation: 'Remove approval, commitment, legal, credit, escrow, payment, or production-readiness claims unless founder/legal/provider evidence exists.',
    },
  ];
  const redactionFindings = scanDefinitions.map((definition) => {
    const matchedTerms = definition.patterns.filter((pattern) => preview.toLowerCase().includes(pattern.toLowerCase()));
    return {
      id: definition.id,
      label: definition.label,
      status: matchedTerms.length ? 'review_required' : 'pass',
      matched_count: matchedTerms.length,
      matched_terms: matchedTerms,
      recommendation: definition.recommendation,
    };
  });
  const forbiddenPhraseScan = {
    source: 'copyable_markdown_preview',
    matched_count: redactionFindings.reduce((count, finding) => count + finding.matched_count, 0),
    finding_ids_requiring_review: redactionFindings.filter((finding) => finding.status !== 'pass').map((finding) => finding.id),
  };
  const hasReviewFindings = forbiddenPhraseScan.matched_count > 0;

  return {
    mode: 'provider_evidence_packet_redaction_qa',
    status: hasReviewFindings ? 'local_redaction_review_required' : 'local_redaction_qa_passed',
    local_only: true,
    surface_filter: template.surface_filter,
    requested_readiness_surface_filter: template.requested_readiness_surface_filter,
    selected_readiness_surface_filter: template.selected_readiness_surface_filter,
    valid_readiness_surface_filter_ids: template.valid_readiness_surface_filter_ids,
    redaction_findings: redactionFindings,
    forbidden_phrase_scan: forbiddenPhraseScan,
    print_template_status: template.status,
    print_template_section_count: template.print_template_sections.length,
    print_redaction_attestation: template.print_redaction_attestation,
    redaction_qa_gate: {
      local_redaction_qa: hasReviewFindings ? 'review_required' : 'passed',
      blocked_external_use: 'blocked',
      external_send: 'blocked',
      provider_submission: 'blocked',
      live_provider_lookup: 'blocked',
      provider_commitment: 'blocked',
      legal_decision: 'blocked',
      credit_approval: 'blocked',
      escrow_release: 'blocked',
      payment_movement: 'blocked',
      auth_rls_change: 'blocked',
      production_release: 'blocked',
      reason: 'Redaction QA only checks a local copyable preview. It cannot approve external use, send packets, run live provider lookups, make legal or credit decisions, move money, change Auth/RLS, or release production.',
    },
    blocked_external_use: true,
    blocked_live_actions: template.blocked_live_actions,
    next_safe_steps: [
      'If any finding is review_required, revise the local print template before founder/legal/provider review.',
      'If findings pass, keep the preview internal until founder approves any external review packet.',
      'Keep external send, provider submission, live lookup, legal, credit, escrow, payment, Auth/RLS, and production actions blocked.',
    ],
    no_server_storage_attempted: true,
    no_live_action_attempted: true,
  };
}

function buildProviderEvidenceReviewChain(options = {}) {
  const packet = buildProviderEvidencePacket(options);
  const template = buildProviderEvidencePacketPrintTemplate(options);
  const qa = buildProviderEvidencePacketRedactionQa(options);
  const selectedFilterId = packet.selected_readiness_surface_filter?.id || packet.requested_readiness_surface_filter || 'all_readiness_surfaces';
  const blockedLiveActions = [
    ...new Set([
      ...(packet.blocked_live_actions || []),
      ...(template.blocked_live_actions || []),
      ...(qa.blocked_live_actions || []),
      'external_review_chain_send',
      'provider_submission',
      'live_provider_lookup',
      'provider_commitment',
      'legal_decision',
      'credit_approval',
      'escrow_release',
      'payment_movement',
      'auth_role_change',
      'rls_policy_change',
      'production_release',
    ]),
  ].sort();
  const chainSteps = [
    {
      id: 'provider_evidence_packet',
      label: 'Provider Evidence Packet',
      mode: packet.mode,
      status: packet.status,
      endpoint: '/api/admin/provider-evidence-packet',
      selected_filter_id: selectedFilterId,
      local_only: true,
      output_counts: {
        packet_section_count: packet.packet_sections.length,
        redaction_check_count: packet.redaction_checklist.length,
        blocked_live_action_count: (packet.blocked_live_actions || []).length,
      },
      review_status: 'local_metadata_ready',
      no_server_storage_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'provider_evidence_packet_print_template',
      label: 'Provider Evidence Packet Print Template',
      mode: template.mode,
      status: template.status,
      endpoint: '/api/admin/provider-evidence-packet/print-template',
      selected_filter_id: selectedFilterId,
      local_only: true,
      output_counts: {
        print_template_section_count: template.print_template_sections.length,
        markdown_preview_available: Boolean(template.copyable_markdown_preview),
        blocked_live_action_count: (template.blocked_live_actions || []).length,
      },
      review_status: 'local_metadata_ready',
      no_server_storage_attempted: true,
      no_live_action_attempted: true,
    },
    {
      id: 'provider_evidence_packet_redaction_qa',
      label: 'Provider Evidence Packet Redaction QA',
      mode: qa.mode,
      status: qa.status,
      endpoint: '/api/admin/provider-evidence-packet/redaction-qa',
      selected_filter_id: selectedFilterId,
      local_only: true,
      output_counts: {
        redaction_finding_count: qa.redaction_findings.length,
        review_required_finding_count: qa.redaction_findings.filter((finding) => finding.status !== 'pass').length,
        forbidden_phrase_match_count: qa.forbidden_phrase_scan?.matched_count ?? 0,
      },
      review_status: qa.redaction_qa_gate?.local_redaction_qa || 'pending',
      no_server_storage_attempted: true,
      no_live_action_attempted: true,
    },
  ];
  const redactionReviewRequiredCount = qa.redaction_findings.filter((finding) => finding.status !== 'pass').length;

  return {
    mode: 'provider_evidence_review_chain',
    status: redactionReviewRequiredCount > 0 ? 'local_review_chain_review_required' : 'local_review_chain_ready',
    local_only: true,
    surface_filter: packet.surface_filter,
    requested_readiness_surface_filter: packet.requested_readiness_surface_filter,
    selected_readiness_surface_filter: packet.selected_readiness_surface_filter,
    valid_readiness_surface_filter_ids: packet.valid_readiness_surface_filter_ids,
    readiness_surface_filters: packet.readiness_surface_filters,
    chain_steps: chainSteps,
    summary: {
      chain_step_count: chainSteps.length,
      packet_section_count: packet.packet_sections.length,
      print_template_section_count: template.print_template_sections.length,
      redaction_finding_count: qa.redaction_findings.length,
      redaction_review_required_count: redactionReviewRequiredCount,
      blocked_live_action_count: blockedLiveActions.length,
      selected_surface_filter: selectedFilterId,
    },
    review_gate: {
      local_review_chain: 'ready',
      packet_review: packet.packet_gate?.local_packet_review || 'ready',
      print_template_review: template.export_gate?.local_print_export || 'ready',
      redaction_qa_review: qa.redaction_qa_gate?.local_redaction_qa || 'pending',
      server_storage: 'blocked',
      external_send: 'blocked',
      provider_submission: 'blocked',
      live_provider_lookup: 'blocked',
      provider_commitment: 'blocked',
      legal_decision: 'blocked',
      credit_approval: 'blocked',
      escrow_release: 'blocked',
      payment_movement: 'blocked',
      auth_rls_change: 'blocked',
      production_release: 'blocked',
      reason: 'This review chain only aggregates local metadata from packet, print template, and redaction QA steps. It cannot store content server-side, send packets externally, run provider lookups, make legal or credit decisions, move money, change Auth/RLS, or release production.',
    },
    safe_report_fields: {
      request_id: 'safe to share',
      surface_filter: 'safe local filter id',
      chain_step_count: 'safe aggregate only',
      packet_section_count: 'safe aggregate only',
      print_template_section_count: 'safe aggregate only',
      redaction_finding_count: 'safe aggregate only; no finding content or matched terms',
      blocked_live_action_count: 'safe aggregate only',
    },
    blocked_live_actions: blockedLiveActions,
    next_safe_steps: [
      'Use this review chain to confirm packet, print template, and redaction QA metadata are locally ready before founder review.',
      'Do not store packet sections, markdown previews, redaction findings, matched terms, raw evidence, secrets, payment data, wallet data, provider submissions, legal decisions, credit approvals, escrow releases, Auth/RLS changes, or production approvals.',
      'Keep external send, provider submission, live lookup, legal, credit, escrow, payment, Auth/RLS, and production actions blocked.',
    ],
    no_server_storage_attempted: true,
    no_live_action_attempted: true,
  };
}

function buildSmartContractReviewWorkbench(exportMap, options = {}) {
  const helperIndex = buildSmartContractHelperIndex(exportMap, options);
  const dryRun = buildSmartContractLocalReplayDryRun(exportMap, options);
  const evidencePacket = buildSmartContractLocalReplayDryRunEvidencePacket(exportMap, options);
  const selectedFilterId = helperIndex.selected_helper_category_filter?.id || dryRun.selected_helper_category_filter?.id || options.category_filter || 'all_helper_categories';
  const blockedLiveActions = [
    ...new Set([
      ...(helperIndex.blocked_live_actions || []),
      ...(dryRun.blocked_live_actions || []),
      ...(evidencePacket.packet_sections || [])
        .filter((section) => section.id === 'blocked_live_actions')
        .flatMap((section) => section.lines || []),
      'live_replay_execution',
      'xpr_contract_deployment',
      'xpr_signature_request',
      'real_payment',
      'payment_movement',
      'real_loan_approval',
      'escrow_release',
      'repayment_routing',
      'stablecoin_settlement',
      'token_collateral_lock',
      'provider_commitment',
      'legal_decision',
      'production_release',
    ]),
  ].sort();
  const reviewGate = {
    helper_index_review: helperIndex.selected_helper_category_filter ? 'ready_for_local_review' : 'invalid_filter_review_required',
    local_dry_run: dryRun.dry_run_gate?.local_dry_run || 'review_required',
    dry_run_packet_review: evidencePacket.packet_gate?.local_packet_review || 'review_required',
    server_storage: 'blocked',
    live_replay_execution: 'blocked',
    xpr_contract_deployment: 'blocked',
    xpr_signature_request: 'blocked',
    payment_movement: 'blocked',
    real_loan_approval: 'blocked',
    escrow_release: 'blocked',
    repayment_routing: 'blocked',
    stablecoin_settlement: 'blocked',
    token_collateral_lock: 'blocked',
    provider_commitment: 'blocked',
    legal_decision: 'blocked',
    production_release: 'blocked',
    reason: 'This workbench summarizes local helper index, replay dry-run, and evidence packet metadata only. It cannot store server-side review content, execute replay, deploy XPR contracts, request signatures, move payments, approve loans, release escrow, route repayment, settle stablecoins, lock token collateral, commit providers, make legal decisions, or release production.',
  };

  return {
    mode: 'smart_contract_review_workbench',
    status: helperIndex.selected_helper_category_filter
      ? 'smart_contract_review_workbench_ready'
      : 'smart_contract_review_workbench_filter_review_required',
    local_only: true,
    deployment_status: 'BLOCKED_FOR_LIVE',
    source_module: helperIndex.source_module,
    selected_helper_category_filter: helperIndex.selected_helper_category_filter,
    valid_helper_category_filter_ids: helperIndex.valid_helper_category_filter_ids,
    category_filter: selectedFilterId,
    review_gate: reviewGate,
    workbench_cards: [
      {
        id: 'helper_index',
        title: 'Helper Index',
        status: helperIndex.mode || 'smart_contract_helper_index',
        summary: [
          `helper_export_count=${helperIndex.summary?.helper_export_count || 0}`,
          `demo_fixture_count=${helperIndex.summary?.demo_fixture_count || 0}`,
          `filtered_helper_category_count=${(helperIndex.filtered_helper_categories || []).length}`,
        ],
        blocked_live_actions: helperIndex.blocked_live_actions || [],
      },
      {
        id: 'local_replay_dry_run',
        title: 'Local Replay Dry Run',
        status: dryRun.status || 'local_replay_dry_run_review_required',
        summary: [
          `dry_run_step_count=${dryRun.summary?.dry_run_step_count || 0}`,
          `pass_local_only_step_count=${dryRun.summary?.pass_local_only_step_count || 0}`,
          `review_required_step_count=${dryRun.summary?.review_required_step_count || 0}`,
        ],
        blocked_live_actions: dryRun.blocked_live_actions || [],
      },
      {
        id: 'dry_run_evidence_packet',
        title: 'Dry Run Evidence Packet',
        status: evidencePacket.status || 'local_replay_dry_run_evidence_packet_review_required',
        summary: [
          `packet_section_count=${(evidencePacket.packet_sections || []).length}`,
          `copyable_markdown=${evidencePacket.copyable_markdown ? 'ready' : 'pending'}`,
          `redaction_safe=${evidencePacket.redaction_attestation?.safe_for_local_founder_security_review ?? true}`,
        ],
        blocked_live_actions: blockedLiveActions,
      },
      {
        id: 'blocked_live_actions',
        title: 'Blocked Live Actions',
        status: 'BLOCKED_FOR_LIVE',
        summary: blockedLiveActions,
        blocked_live_actions: blockedLiveActions,
      },
      {
        id: 'next_safe_actions',
        title: 'Next Safe Actions',
        status: 'local_review_only',
        summary: [
          'Use this workbench for founder/security local review before any external decision packet.',
          'Run npm run check:smart-contract-local-replay, npm run check:smartcontractor, and npm run check:auth before handoff.',
          'Keep live replay, XPR deployment, signatures, payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, provider/legal commitments, and production blocked.',
        ],
        blocked_live_actions: blockedLiveActions,
      },
    ],
    helper_index_summary: helperIndex.summary,
    dry_run_summary: dryRun.summary,
    dry_run_packet_summary: {
      packet_section_count: (evidencePacket.packet_sections || []).length,
      redaction_attestation: evidencePacket.redaction_attestation,
      packet_gate: evidencePacket.packet_gate,
    },
    blocked_live_actions: blockedLiveActions,
    next_safe_steps: [
      'Review this local workbench with helper index, dry-run, and dry-run evidence packet together.',
      'Use request IDs and local check names in founder/security handoff notes.',
      'Do not treat this workbench as live replay, XPR deploy, signature, payment, loan, escrow, repayment, stablecoin, token collateral, provider, legal, or production approval.',
    ],
    no_server_storage_attempted: true,
    no_live_replay_action_attempted: true,
    no_live_action_attempted: true,
  };
}

function buildSmartContractReviewWorkbenchHandoffSummary(exportMap, options = {}) {
  const workbench = buildSmartContractReviewWorkbench(exportMap, options);
  const workbenchCards = Array.isArray(workbench.workbench_cards) ? workbench.workbench_cards : [];
  const blockedLiveActions = Array.isArray(workbench.blocked_live_actions) ? workbench.blocked_live_actions : [];
  const handoffGate = {
    local_handoff_summary: workbench.selected_helper_category_filter ? 'ready_for_founder_security_review' : 'invalid_filter_review_required',
    server_storage: 'blocked',
    external_send: 'blocked',
    live_replay_execution: 'blocked',
    xpr_contract_deployment: 'blocked',
    xpr_signature_request: 'blocked',
    payment_movement: 'blocked',
    real_loan_approval: 'blocked',
    escrow_release: 'blocked',
    repayment_routing: 'blocked',
    stablecoin_settlement: 'blocked',
    token_collateral_lock: 'blocked',
    provider_commitment: 'blocked',
    legal_decision: 'blocked',
    production_release: 'blocked',
  };
  const handoffSummarySections = [
    {
      id: 'workbench_summary',
      title: 'Workbench Summary',
      status: workbench.status,
      lines: [
        `Mode: ${workbench.mode}`,
        `Selected helper filter: ${workbench.selected_helper_category_filter?.id || workbench.category_filter || 'pending'}`,
        `workbench_card_count: ${workbenchCards.length}`,
        `blocked_live_action_count: ${blockedLiveActions.length}`,
        `helper_export_count: ${workbench.helper_index_summary?.helper_export_count || 0}`,
        `dry_run_step_count: ${workbench.dry_run_summary?.dry_run_step_count || 0}`,
        `dry_run_packet_section_count: ${workbench.dry_run_packet_summary?.packet_section_count || 0}`,
      ],
    },
    {
      id: 'review_gate',
      title: 'Review Gate',
      status: 'BLOCKED_FOR_LIVE',
      lines: Object.entries(handoffGate).map(([key, value]) => `${key}: ${value}`),
    },
    {
      id: 'workbench_cards',
      title: 'Workbench Cards',
      status: 'metadata_only',
      lines: workbenchCards.length
        ? workbenchCards.map((card) => `${card.id} | ${card.title} | ${card.status} | summary=${(card.summary || []).join('; ')}`)
        : ['No workbench cards were available for this handoff summary.'],
    },
    {
      id: 'blocked_live_actions',
      title: 'Blocked Live Actions',
      status: 'BLOCKED_FOR_LIVE',
      lines: blockedLiveActions,
    },
    {
      id: 'founder_security_handoff',
      title: 'Founder/Security Handoff',
      status: 'local_review_only',
      lines: [
        'Use this summary for local founder/security handoff only.',
        'Do not send externally until the founder decides the recipient, scope, redaction, and legal/provider routing.',
        'Do not treat this summary as live replay, XPR deploy, signature, payment, loan, escrow, repayment, stablecoin, token collateral, provider, legal, or production approval.',
        ...(workbench.next_safe_steps || []),
      ],
    },
  ];
  const redactionAttestation = {
    mode: 'redaction_attestation',
    raw_replay_payload_included: false,
    helper_source_code_included: false,
    secrets_included: false,
    payment_data_included: false,
    wallet_private_data_included: false,
    provider_submission_included: false,
    legal_decision_included: false,
    live_authority_included: false,
    safe_for_local_founder_security_review: true,
  };
  const copyableMarkdown = [
    '# Smart Contract Review Workbench Handoff Summary',
    '',
    'Generated scope: local_founder_security_review_only',
    `Selected helper filter: ${workbench.selected_helper_category_filter?.id || workbench.category_filter || 'pending'}`,
    `Status: ${workbench.status}`,
    'No handoff summary content stored on the server: true',
    'No live smart contract replay action attempted: true',
    '',
    ...handoffSummarySections.flatMap((section) => [
      `## ${section.title}`,
      `Status: ${section.status}`,
      ...(section.lines || []).map((line) => `- ${line}`),
      '',
    ]),
    '## Redaction Attestation',
    ...Object.entries(redactionAttestation).map(([key, value]) => `- ${key}: ${value}`),
  ].join('\n');

  return {
    mode: 'smart_contract_review_workbench_handoff_summary',
    status: workbench.selected_helper_category_filter
      ? 'smart_contract_review_workbench_handoff_summary_ready'
      : 'smart_contract_review_workbench_handoff_summary_filter_review_required',
    local_only: true,
    deployment_status: 'BLOCKED_FOR_LIVE',
    source_mode: workbench.mode,
    source_module: workbench.source_module,
    selected_helper_category_filter: workbench.selected_helper_category_filter,
    valid_helper_category_filter_ids: workbench.valid_helper_category_filter_ids,
    category_filter: workbench.category_filter,
    workbench_summary: {
      workbench_card_count: workbenchCards.length,
      blocked_live_action_count: blockedLiveActions.length,
      helper_export_count: workbench.helper_index_summary?.helper_export_count || 0,
      dry_run_step_count: workbench.dry_run_summary?.dry_run_step_count || 0,
      dry_run_packet_section_count: workbench.dry_run_packet_summary?.packet_section_count || 0,
    },
    handoff_summary_sections: handoffSummarySections,
    handoff_gate: handoffGate,
    redaction_attestation: redactionAttestation,
    copyable_markdown: copyableMarkdown,
    blocked_live_actions: blockedLiveActions,
    next_safe_steps: [
      'Use this handoff summary for local founder/security review only.',
      'Keep external send, live replay, XPR deployment, signatures, payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, provider/legal commitments, and production blocked.',
      'Use the source workbench request ID and local validators before any founder-approved external packet.',
    ],
    no_server_storage_attempted: true,
    no_handoff_summary_content_stored: true,
    no_live_replay_action_attempted: true,
    no_live_action_attempted: true,
  };
}

function buildSmartContractReviewWorkbenchGateMatrix(exportMap, options = {}) {
  const requestedCategoryFilter = typeof options.category_filter === 'string' ? options.category_filter.trim() : '';
  const helperIndex = buildSmartContractHelperIndex(exportMap, {
    category_filter: requestedCategoryFilter || 'all_helper_categories',
  });
  const filterIds = helperIndex.valid_helper_category_filter_ids || ['all_helper_categories'];
  const selectedFilterIds = !helperIndex.selected_helper_category_filter
    ? []
    : helperIndex.selected_helper_category_filter.id === 'all_helper_categories'
      ? filterIds
      : [helperIndex.selected_helper_category_filter.id];
  const gateMatrixRows = selectedFilterIds.map((filterId, index) => {
    const workbench = buildSmartContractReviewWorkbench(exportMap, { category_filter: filterId });
    const handoffSummary = buildSmartContractReviewWorkbenchHandoffSummary(exportMap, { category_filter: filterId });
    const reviewGate = workbench.review_gate || {};
    const blockedLiveActions = workbench.blocked_live_actions || [];
    return {
      id: `gate_matrix_${filterId}`,
      filter_id: filterId,
      label: workbench.selected_helper_category_filter?.label || filterId,
      review_priority: index + 1,
      status: workbench.status,
      deployment_status: workbench.deployment_status || 'BLOCKED_FOR_LIVE',
      selected_helper_category_filter: workbench.selected_helper_category_filter,
      workbench_card_count: (workbench.workbench_cards || []).length,
      handoff_summary_section_count: (handoffSummary.handoff_summary_sections || []).length,
      helper_export_count: workbench.helper_index_summary?.helper_export_count || 0,
      demo_fixture_count: workbench.helper_index_summary?.demo_fixture_count || 0,
      dry_run_step_count: workbench.dry_run_summary?.dry_run_step_count || 0,
      dry_run_packet_section_count: workbench.dry_run_packet_summary?.packet_section_count || 0,
      blocked_live_action_count: blockedLiveActions.length,
      review_gate: {
        helper_index_review: reviewGate.helper_index_review || 'review_required',
        local_dry_run: reviewGate.local_dry_run || 'review_required',
        dry_run_packet_review: reviewGate.dry_run_packet_review || 'review_required',
        server_storage: reviewGate.server_storage || 'blocked',
        live_replay_execution: reviewGate.live_replay_execution || 'blocked',
        xpr_contract_deployment: reviewGate.xpr_contract_deployment || 'blocked',
        xpr_signature_request: reviewGate.xpr_signature_request || 'blocked',
        payment_movement: reviewGate.payment_movement || 'blocked',
        real_loan_approval: reviewGate.real_loan_approval || 'blocked',
        escrow_release: reviewGate.escrow_release || 'blocked',
        repayment_routing: reviewGate.repayment_routing || 'blocked',
        stablecoin_settlement: reviewGate.stablecoin_settlement || 'blocked',
        token_collateral_lock: reviewGate.token_collateral_lock || 'blocked',
        provider_commitment: reviewGate.provider_commitment || 'blocked',
        legal_decision: reviewGate.legal_decision || 'blocked',
        production_release: reviewGate.production_release || 'blocked',
      },
      next_safe_action: `Open local review workbench for ${filterId} before founder/security handoff.`,
      no_server_storage_attempted: true,
      no_gate_matrix_content_stored: true,
      no_live_replay_action_attempted: true,
      no_live_action_attempted: true,
    };
  });
  const blockedLiveActions = [
    ...new Set(gateMatrixRows.flatMap((row) => [
      ...Object.entries(row.review_gate)
        .filter(([, value]) => value === 'blocked')
        .map(([key]) => key),
      'external_send',
      'live_replay_execution',
      'xpr_contract_deployment',
      'xpr_signature_request',
      'payment_movement',
      'real_loan_approval',
      'escrow_release',
      'repayment_routing',
      'stablecoin_settlement',
      'token_collateral_lock',
      'provider_commitment',
      'legal_decision',
      'production_release',
    ])),
  ].sort();
  const recommendedReviewOrder = gateMatrixRows.map((row) => ({
    filter_id: row.filter_id,
    label: row.label,
    review_priority: row.review_priority,
    next_safe_action: row.next_safe_action,
    workbench_endpoint: `/api/admin/smart-contract-review-workbench?category_filter=${encodeURIComponent(row.filter_id)}`,
    dry_run_endpoint: `/api/admin/smart-contract-local-replay-dry-run?category_filter=${encodeURIComponent(row.filter_id)}`,
    dry_run_packet_endpoint: `/api/admin/smart-contract-local-replay-dry-run/evidence-packet?category_filter=${encodeURIComponent(row.filter_id)}`,
    handoff_summary_endpoint: `/api/admin/smart-contract-review-workbench/handoff-summary?category_filter=${encodeURIComponent(row.filter_id)}`,
    local_review_route_set: true,
    local_only: true,
    live_actions_blocked: true,
  }));
  const routeSetEndpointTypes = [
    'workbench_endpoint',
    'dry_run_endpoint',
    'dry_run_packet_endpoint',
    'handoff_summary_endpoint',
  ];
  const routeSetSummary = {
    route_set_count: recommendedReviewOrder.length,
    local_only_route_set_count: recommendedReviewOrder.filter((route) => route.local_only === true).length,
    live_blocked_route_set_count: recommendedReviewOrder.filter((route) => route.live_actions_blocked === true).length,
    available_endpoint_types: routeSetEndpointTypes,
    selected_filter_id: helperIndex.selected_helper_category_filter?.id || requestedCategoryFilter || 'all_helper_categories',
    first_filter_id: recommendedReviewOrder[0]?.filter_id || helperIndex.selected_helper_category_filter?.id || 'all_helper_categories',
    local_review_route_set: true,
    local_only: true,
    live_actions_blocked: true,
  };
  return {
    mode: 'smart_contract_review_workbench_gate_matrix',
    status: 'smart_contract_review_workbench_gate_matrix_ready',
    local_only: true,
    deployment_status: 'BLOCKED_FOR_LIVE',
    source_module: helperIndex.source_module,
    selected_helper_category_filter: helperIndex.selected_helper_category_filter,
    category_filter: helperIndex.selected_helper_category_filter?.id || requestedCategoryFilter || 'all_helper_categories',
    valid_helper_category_filter_ids: filterIds,
    gate_matrix_rows: gateMatrixRows,
    gate_matrix_summary: {
      row_count: gateMatrixRows.length,
      review_required_row_count: gateMatrixRows.filter((row) => row.status !== 'smart_contract_review_workbench_ready').length,
      blocked_live_action_count: blockedLiveActions.length,
      helper_export_total: gateMatrixRows.reduce((sum, row) => sum + row.helper_export_count, 0),
      dry_run_step_total: gateMatrixRows.reduce((sum, row) => sum + row.dry_run_step_count, 0),
      handoff_summary_section_total: gateMatrixRows.reduce((sum, row) => sum + row.handoff_summary_section_count, 0),
    },
    route_set_summary: routeSetSummary,
    gate_matrix_gate: {
      local_gate_matrix_review: helperIndex.selected_helper_category_filter ? 'ready_for_founder_security_review' : 'invalid_filter_review_required',
      server_storage: 'blocked',
      external_send: 'blocked',
      live_replay_execution: 'blocked',
      xpr_contract_deployment: 'blocked',
      xpr_signature_request: 'blocked',
      payment_movement: 'blocked',
      real_loan_approval: 'blocked',
      escrow_release: 'blocked',
      repayment_routing: 'blocked',
      stablecoin_settlement: 'blocked',
      token_collateral_lock: 'blocked',
      provider_commitment: 'blocked',
      legal_decision: 'blocked',
      production_release: 'blocked',
      reason: 'This gate matrix aggregates local review metadata across helper filters only. It cannot store matrix content server-side, send externally, execute replay, deploy XPR contracts, request signatures, move payments, approve loans, release escrow, route repayment, settle stablecoins, lock token collateral, commit providers, make legal decisions, or release production.',
    },
    recommended_review_order: recommendedReviewOrder,
    blocked_live_actions: blockedLiveActions,
    next_safe_steps: [
      'Use the matrix to scan all local smart contract review gates before opening individual workbench views.',
      'Open only local helper index, dry-run, evidence packet, workbench, and handoff summary routes for the selected filter.',
      'Keep external send, live replay, XPR deployment, signatures, payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, provider/legal commitments, and production blocked.',
    ],
    no_server_storage_attempted: true,
    no_gate_matrix_content_stored: true,
    no_live_replay_action_attempted: true,
    no_live_action_attempted: true,
  };
}

app.get('/api/admin/smart-contract-helper-index', requireAdminPermissions(['loan_review_prepare']), async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-SmartContractor-Demo-Only', 'true');
  res.setHeader('X-SmartContractor-Live-Actions', 'blocked');

  try {
    const smartContracts = await import('./src/smart-contracts/index.mjs');
    const categoryFilter = Array.isArray(req.query.category_filter) ? req.query.category_filter[0] : req.query.category_filter;
    const helperIndex = buildSmartContractHelperIndex(smartContracts, {
      category_filter: typeof categoryFilter === 'string' ? categoryFilter : '',
    });
    if (typeof categoryFilter === 'string' && categoryFilter.trim() && !helperIndex.selected_helper_category_filter) {
      return res.status(400).json({
        error: 'Unsupported smart contract helper category_filter',
        request_id: req.id || null,
        status: 'smart_contract_helper_index_filter_error',
        category_filter: categoryFilter,
        valid_helper_category_filter_ids: helperIndex.valid_helper_category_filter_ids,
        deployment_status: 'BLOCKED_FOR_LIVE',
        details: [
          'Use one of the local-only smart contract helper category filter ids.',
          'No live helper-index action was attempted.',
        ],
        safe_scope: helperIndex.safe_scope,
        no_live_action_attempted: true,
      });
    }
    res.json({
      request_id: req.id || null,
      generated_at: new Date().toISOString(),
      ...helperIndex,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Smart contract helper index unavailable',
      request_id: req.id || null,
      status: 'smart_contract_helper_index_error',
      deployment_status: 'BLOCKED_FOR_LIVE',
      details: [
        error?.message || 'Unable to load local smart contract helper exports.',
        'No live helper-index action was attempted.',
      ],
      safe_scope: [
        'No helper-index approval is created.',
        'No XPR deploy, signature, payment, loan, escrow, token collateral, provider, legal, production, or money movement action is attempted.',
      ],
      no_live_action_attempted: true,
    });
  }
});

app.get('/api/admin/smart-contract-local-replay-dry-run', requireAdminPermissions(['loan_review_prepare']), async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-SmartContractor-Demo-Only', 'true');
  res.setHeader('X-SmartContractor-Live-Actions', 'blocked');

  try {
    const smartContracts = await import('./src/smart-contracts/index.mjs');
    const categoryFilter = Array.isArray(req.query.category_filter) ? req.query.category_filter[0] : req.query.category_filter;
    const dryRun = buildSmartContractLocalReplayDryRun(smartContracts, {
      category_filter: typeof categoryFilter === 'string' ? categoryFilter : '',
    });
    if (typeof categoryFilter === 'string' && categoryFilter.trim() && !dryRun.selected_helper_category_filter) {
      return res.status(400).json({
        error: 'Unsupported smart contract local replay dry run category_filter',
        request_id: req.id || null,
        status: 'smart_contract_local_replay_dry_run_filter_invalid',
        category_filter: categoryFilter,
        valid_helper_category_filter_ids: dryRun.valid_helper_category_filter_ids,
        smart_contract_local_replay_dry_run_filter_recovery_actions: dryRun.valid_helper_category_filter_ids.map((id) => ({
          id,
          label: `Apply safe replay dry-run filter: ${id}`,
          action: 'reload_local_replay_dry_run_only',
        })),
        dry_run_gate: dryRun.dry_run_gate,
        details: [
          'Use one of the local-only smart contract helper category filter ids.',
          'No live smart contract replay action attempted.',
          'No server storage, XPR deploy, signature request, payment, loan, escrow, stablecoin, token collateral, provider, legal, production, or money movement action was attempted.',
        ],
        no_server_storage_attempted: true,
        no_live_replay_action_attempted: true,
        no_live_action_attempted: true,
      });
    }
    res.json({
      request_id: req.id || null,
      generated_at: new Date().toISOString(),
      ...dryRun,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Smart contract local replay dry run unavailable',
      request_id: req.id || null,
      status: 'smart_contract_local_replay_dry_run_error',
      deployment_status: 'BLOCKED_FOR_LIVE',
      details: [
        error?.message || 'Unable to build local smart contract replay dry-run metadata.',
        'No live smart contract replay action attempted.',
      ],
      dry_run_gate: {
        local_dry_run: 'blocked',
        server_storage: 'blocked',
        live_replay_execution: 'blocked',
        xpr_contract_deployment: 'blocked',
        xpr_signature_request: 'blocked',
        payment_movement: 'blocked',
        real_loan_approval: 'blocked',
        escrow_release: 'blocked',
        token_collateral_lock: 'blocked',
        provider_commitment: 'blocked',
        legal_decision: 'blocked',
        production_release: 'blocked',
      },
      no_server_storage_attempted: true,
      no_live_replay_action_attempted: true,
      no_live_action_attempted: true,
    });
  }
});

app.get('/api/admin/smart-contract-local-replay-dry-run/evidence-packet', requireAdminPermissions(['loan_review_prepare']), async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-SmartContractor-Demo-Only', 'true');
  res.setHeader('X-SmartContractor-Live-Actions', 'blocked');

  try {
    const smartContracts = await import('./src/smart-contracts/index.mjs');
    const categoryFilter = Array.isArray(req.query.category_filter) ? req.query.category_filter[0] : req.query.category_filter;
    const evidencePacket = buildSmartContractLocalReplayDryRunEvidencePacket(smartContracts, {
      category_filter: typeof categoryFilter === 'string' ? categoryFilter : '',
    });
    if (typeof categoryFilter === 'string' && categoryFilter.trim() && !evidencePacket.selected_helper_category_filter) {
      return res.status(400).json({
        error: 'Unsupported smart contract local replay dry run evidence packet category_filter',
        request_id: req.id || null,
        status: 'smart_contract_local_replay_dry_run_evidence_packet_filter_invalid',
        category_filter: categoryFilter,
        valid_helper_category_filter_ids: evidencePacket.valid_helper_category_filter_ids,
        smart_contract_local_replay_dry_run_evidence_packet_filter_recovery_actions: evidencePacket.valid_helper_category_filter_ids.map((id) => ({
          id,
          label: `Apply safe dry-run packet filter: ${id}`,
          action: 'reload_local_replay_dry_run_evidence_packet_only',
        })),
        packet_gate: evidencePacket.packet_gate,
        details: [
          'Use one of the local-only smart contract helper category filter ids.',
          'No live smart contract replay action attempted.',
          'No dry-run packet content stored on the server.',
          'No XPR deploy, signature request, payment, loan, escrow, repayment routing, stablecoin, token collateral, provider, legal, production, or money movement action was attempted.',
        ],
        no_server_storage_attempted: true,
        no_dry_run_packet_content_stored: true,
        no_live_replay_action_attempted: true,
        no_live_action_attempted: true,
      });
    }
    res.json({
      request_id: req.id || null,
      generated_at: new Date().toISOString(),
      ...evidencePacket,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Smart contract local replay dry run evidence packet unavailable',
      request_id: req.id || null,
      status: 'smart_contract_local_replay_dry_run_evidence_packet_error',
      deployment_status: 'BLOCKED_FOR_LIVE',
      details: [
        error?.message || 'Unable to build local smart contract replay dry-run evidence packet metadata.',
        'No live smart contract replay action attempted.',
      ],
      packet_gate: {
        local_packet_review: 'blocked',
        server_storage: 'blocked',
        external_send: 'blocked',
        live_replay_execution: 'blocked',
        xpr_contract_deployment: 'blocked',
        xpr_signature_request: 'blocked',
        payment_movement: 'blocked',
        real_loan_approval: 'blocked',
        escrow_release: 'blocked',
        token_collateral_lock: 'blocked',
        provider_commitment: 'blocked',
        legal_decision: 'blocked',
        production_release: 'blocked',
      },
      no_server_storage_attempted: true,
      no_dry_run_packet_content_stored: true,
      no_live_replay_action_attempted: true,
      no_live_action_attempted: true,
    });
  }
});

app.get('/api/admin/smart-contract-review-workbench', requireAdminPermissions(['loan_review_prepare']), async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-SmartContractor-Demo-Only', 'true');
  res.setHeader('X-SmartContractor-Live-Actions', 'blocked');

  try {
    const smartContracts = await import('./src/smart-contracts/index.mjs');
    const categoryFilter = Array.isArray(req.query.category_filter) ? req.query.category_filter[0] : req.query.category_filter;
    const workbench = buildSmartContractReviewWorkbench(smartContracts, {
      category_filter: typeof categoryFilter === 'string' ? categoryFilter : '',
    });
    if (typeof categoryFilter === 'string' && categoryFilter.trim() && !workbench.selected_helper_category_filter) {
      return res.status(400).json({
        error: 'Unsupported smart contract review workbench category_filter',
        request_id: req.id || null,
        status: 'smart_contract_review_workbench_filter_invalid',
        category_filter: categoryFilter,
        valid_helper_category_filter_ids: workbench.valid_helper_category_filter_ids,
        smart_contract_review_workbench_filter_recovery_actions: workbench.valid_helper_category_filter_ids.map((id) => ({
          id,
          label: `Apply safe workbench filter: ${id}`,
          action: 'reload_smart_contract_review_workbench_only',
        })),
        review_gate: workbench.review_gate,
        details: [
          'Use one of the local-only smart contract helper category filter ids.',
          'No live smart contract replay action attempted.',
          'No server storage, XPR deploy, signature request, payment, loan, escrow, repayment routing, stablecoin, token collateral, provider, legal, production, or money movement action was attempted.',
        ],
        no_server_storage_attempted: true,
        no_live_replay_action_attempted: true,
        no_live_action_attempted: true,
      });
    }
    res.json({
      request_id: req.id || null,
      generated_at: new Date().toISOString(),
      ...workbench,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Smart contract review workbench unavailable',
      request_id: req.id || null,
      status: 'smart_contract_review_workbench_error',
      deployment_status: 'BLOCKED_FOR_LIVE',
      details: [
        error?.message || 'Unable to build local smart contract review workbench metadata.',
        'No live smart contract replay action attempted.',
      ],
      review_gate: {
        helper_index_review: 'blocked',
        local_dry_run: 'blocked',
        dry_run_packet_review: 'blocked',
        server_storage: 'blocked',
        live_replay_execution: 'blocked',
        xpr_contract_deployment: 'blocked',
        xpr_signature_request: 'blocked',
        payment_movement: 'blocked',
        real_loan_approval: 'blocked',
        escrow_release: 'blocked',
        repayment_routing: 'blocked',
        stablecoin_settlement: 'blocked',
        token_collateral_lock: 'blocked',
        provider_commitment: 'blocked',
        legal_decision: 'blocked',
        production_release: 'blocked',
      },
      no_server_storage_attempted: true,
      no_live_replay_action_attempted: true,
      no_live_action_attempted: true,
    });
  }
});

app.get('/api/admin/smart-contract-review-workbench/handoff-summary', requireAdminPermissions(['loan_review_prepare']), async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-SmartContractor-Demo-Only', 'true');
  res.setHeader('X-SmartContractor-Live-Actions', 'blocked');

  try {
    const smartContracts = await import('./src/smart-contracts/index.mjs');
    const categoryFilter = Array.isArray(req.query.category_filter) ? req.query.category_filter[0] : req.query.category_filter;
    const handoffSummary = buildSmartContractReviewWorkbenchHandoffSummary(smartContracts, {
      category_filter: typeof categoryFilter === 'string' ? categoryFilter : '',
    });
    if (typeof categoryFilter === 'string' && categoryFilter.trim() && !handoffSummary.selected_helper_category_filter) {
      return res.status(400).json({
        error: 'Unsupported smart contract review workbench handoff summary category_filter',
        request_id: req.id || null,
        status: 'smart_contract_review_workbench_handoff_summary_filter_invalid',
        category_filter: categoryFilter,
        valid_helper_category_filter_ids: handoffSummary.valid_helper_category_filter_ids,
        smart_contract_review_workbench_handoff_summary_filter_recovery_actions: handoffSummary.valid_helper_category_filter_ids.map((id) => ({
          id,
          label: `Apply safe workbench handoff filter: ${id}`,
          action: 'reload_smart_contract_review_workbench_handoff_summary_only',
        })),
        handoff_gate: handoffSummary.handoff_gate,
        details: [
          'Use one of the local-only smart contract helper category filter ids.',
          'No live smart contract replay action attempted.',
          'No handoff summary content stored on the server.',
          'No external send, XPR deploy, signature request, payment, loan, escrow, repayment routing, stablecoin, token collateral, provider, legal, production, or money movement action was attempted.',
        ],
        no_server_storage_attempted: true,
        no_handoff_summary_content_stored: true,
        no_live_replay_action_attempted: true,
        no_live_action_attempted: true,
      });
    }
    res.json({
      request_id: req.id || null,
      generated_at: new Date().toISOString(),
      ...handoffSummary,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Smart contract review workbench handoff summary unavailable',
      request_id: req.id || null,
      status: 'smart_contract_review_workbench_handoff_summary_error',
      deployment_status: 'BLOCKED_FOR_LIVE',
      details: [
        error?.message || 'Unable to build local smart contract review workbench handoff summary metadata.',
        'No live smart contract replay action attempted.',
      ],
      handoff_gate: {
        local_handoff_summary: 'blocked',
        server_storage: 'blocked',
        external_send: 'blocked',
        live_replay_execution: 'blocked',
        xpr_contract_deployment: 'blocked',
        xpr_signature_request: 'blocked',
        payment_movement: 'blocked',
        real_loan_approval: 'blocked',
        escrow_release: 'blocked',
        repayment_routing: 'blocked',
        stablecoin_settlement: 'blocked',
        token_collateral_lock: 'blocked',
        provider_commitment: 'blocked',
        legal_decision: 'blocked',
        production_release: 'blocked',
      },
      no_server_storage_attempted: true,
      no_handoff_summary_content_stored: true,
      no_live_replay_action_attempted: true,
      no_live_action_attempted: true,
    });
  }
});

app.get('/api/admin/smart-contract-review-workbench/gate-matrix', requireAdminPermissions(['loan_review_prepare']), async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-SmartContractor-Demo-Only', 'true');
  res.setHeader('X-SmartContractor-Live-Actions', 'blocked');

  try {
    const smartContracts = await import('./src/smart-contracts/index.mjs');
    const categoryFilter = Array.isArray(req.query.category_filter) ? req.query.category_filter[0] : req.query.category_filter;
    const gateMatrix = buildSmartContractReviewWorkbenchGateMatrix(smartContracts, {
      category_filter: typeof categoryFilter === 'string' ? categoryFilter : '',
    });
    if (typeof categoryFilter === 'string' && categoryFilter.trim() && !gateMatrix.selected_helper_category_filter) {
      return res.status(400).json({
        error: 'Unsupported smart contract review workbench gate matrix category_filter',
        request_id: req.id || null,
        status: 'smart_contract_review_workbench_gate_matrix_filter_invalid',
        category_filter: categoryFilter,
        valid_helper_category_filter_ids: gateMatrix.valid_helper_category_filter_ids,
        smart_contract_review_workbench_gate_matrix_filter_recovery_actions: gateMatrix.valid_helper_category_filter_ids.map((id) => ({
          id,
          label: `Apply safe gate matrix filter: ${id}`,
          action: 'reload_smart_contract_review_workbench_gate_matrix_only',
        })),
        gate_matrix_gate: gateMatrix.gate_matrix_gate,
        details: [
          'Use one of the local-only smart contract helper category filter ids.',
          'No gate matrix content stored on the server.',
          'No live smart contract replay action attempted.',
          'No external send, XPR deploy, signature request, payment, loan, escrow, repayment routing, stablecoin, token collateral, provider, legal, production, or money movement action was attempted.',
        ],
        no_server_storage_attempted: true,
        no_gate_matrix_content_stored: true,
        no_live_replay_action_attempted: true,
        no_live_action_attempted: true,
      });
    }
    res.json({
      request_id: req.id || null,
      generated_at: new Date().toISOString(),
      ...gateMatrix,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Smart contract review workbench gate matrix unavailable',
      request_id: req.id || null,
      status: 'smart_contract_review_workbench_gate_matrix_error',
      deployment_status: 'BLOCKED_FOR_LIVE',
      details: [
        error?.message || 'Unable to build local smart contract review workbench gate matrix metadata.',
        'No gate matrix content stored on the server.',
        'No live smart contract replay action attempted.',
      ],
      gate_matrix_gate: {
        local_gate_matrix_review: 'blocked',
        server_storage: 'blocked',
        external_send: 'blocked',
        live_replay_execution: 'blocked',
        xpr_contract_deployment: 'blocked',
        xpr_signature_request: 'blocked',
        payment_movement: 'blocked',
        real_loan_approval: 'blocked',
        escrow_release: 'blocked',
        repayment_routing: 'blocked',
        stablecoin_settlement: 'blocked',
        token_collateral_lock: 'blocked',
        provider_commitment: 'blocked',
        legal_decision: 'blocked',
        production_release: 'blocked',
      },
      no_server_storage_attempted: true,
      no_gate_matrix_content_stored: true,
      no_live_replay_action_attempted: true,
      no_live_action_attempted: true,
    });
  }
});

app.get('/api/admin/dispute-evidence-readiness', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-SmartContractor-Demo-Only', 'true');
  res.setHeader('X-SmartContractor-Live-Actions', 'blocked');
  res.json({
    request_id: req.id || null,
    generated_at: new Date().toISOString(),
    ...buildDisputeEvidenceReadiness(),
  });
});

app.get('/api/admin/dispute-evidence-readiness/review-packet', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-SmartContractor-Demo-Only', 'true');
  res.setHeader('X-SmartContractor-Live-Actions', 'blocked');
  res.json({
    request_id: req.id || null,
    generated_at: new Date().toISOString(),
    ...buildDisputeEvidenceReviewPacket(),
  });
});

app.get('/api/admin/milestone-evidence-readiness', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-SmartContractor-Demo-Only', 'true');
  res.setHeader('X-SmartContractor-Live-Actions', 'blocked');
  res.json({
    request_id: req.id || null,
    generated_at: new Date().toISOString(),
    ...buildMilestoneEvidenceReadiness(),
  });
});

app.get('/api/admin/milestone-evidence-readiness/review-packet', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-SmartContractor-Demo-Only', 'true');
  res.setHeader('X-SmartContractor-Live-Actions', 'blocked');
  res.json({
    request_id: req.id || null,
    generated_at: new Date().toISOString(),
    ...buildMilestoneEvidenceReviewPacket(),
  });
});

app.get('/api/admin/working-capital-readiness', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-SmartContractor-Demo-Only', 'true');
  res.setHeader('X-SmartContractor-Live-Actions', 'blocked');
  res.json({
    request_id: req.id || null,
    generated_at: new Date().toISOString(),
    ...buildWorkingCapitalReadiness(),
  });
});

app.get('/api/admin/working-capital-readiness/review-packet', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-SmartContractor-Demo-Only', 'true');
  res.setHeader('X-SmartContractor-Live-Actions', 'blocked');
  res.json({
    request_id: req.id || null,
    generated_at: new Date().toISOString(),
    ...buildWorkingCapitalReviewPacket(),
  });
});

app.get('/api/admin/contractor-reputation-readiness', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-SmartContractor-Demo-Only', 'true');
  res.setHeader('X-SmartContractor-Live-Actions', 'blocked');
  res.json({
    request_id: req.id || null,
    generated_at: new Date().toISOString(),
    ...buildContractorReputationReadiness(),
  });
});

app.get('/api/admin/contractor-reputation-readiness/review-packet', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-SmartContractor-Demo-Only', 'true');
  res.setHeader('X-SmartContractor-Live-Actions', 'blocked');
  res.json({
    request_id: req.id || null,
    generated_at: new Date().toISOString(),
    ...buildContractorReputationReviewPacket(),
  });
});

app.get('/api/admin/contractor-verification-readiness', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-SmartContractor-Demo-Only', 'true');
  res.setHeader('X-SmartContractor-Live-Actions', 'blocked');
  res.json({
    request_id: req.id || null,
    generated_at: new Date().toISOString(),
    ...buildContractorVerificationReadiness(),
  });
});

app.get('/api/admin/contractor-verification-readiness/review-packet', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-SmartContractor-Demo-Only', 'true');
  res.setHeader('X-SmartContractor-Live-Actions', 'blocked');
  res.json({
    request_id: req.id || null,
    generated_at: new Date().toISOString(),
    ...buildContractorVerificationReviewPacket(),
  });
});

app.get('/api/admin/readiness-overview', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-SmartContractor-Demo-Only', 'true');
  res.setHeader('X-SmartContractor-Live-Actions', 'blocked');
  const surfaceFilter = Array.isArray(req.query.surface_filter) ? req.query.surface_filter[0] : req.query.surface_filter;
  const overview = buildAdminReadinessOverview({
    surface_filter: typeof surfaceFilter === 'string' ? surfaceFilter : '',
  });
  if (typeof surfaceFilter === 'string' && surfaceFilter.trim() && !overview.selected_readiness_surface_filter) {
    return res.status(400).json({
      error: 'Unsupported readiness overview surface_filter',
      request_id: req.id || null,
      status: 'readiness_overview_filter_invalid',
      surface_filter: surfaceFilter,
      valid_readiness_surface_filter_ids: overview.valid_readiness_surface_filter_ids,
      overview_gate: overview.overview_gate,
      details: [
        'Use one of the local-only readiness overview surface filter ids.',
        'No provider, legal, money, Auth/RLS, production, or other live action was attempted.',
      ],
      no_live_action_attempted: true,
    });
  }
  res.json({
    request_id: req.id || null,
    generated_at: new Date().toISOString(),
    ...overview,
  });
});

app.get('/api/admin/readiness-overview/review-packet', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-SmartContractor-Demo-Only', 'true');
  res.setHeader('X-SmartContractor-Live-Actions', 'blocked');
  const surfaceFilter = Array.isArray(req.query.surface_filter) ? req.query.surface_filter[0] : req.query.surface_filter;
  const overview = buildAdminReadinessOverview({
    surface_filter: typeof surfaceFilter === 'string' ? surfaceFilter : '',
  });
  if (typeof surfaceFilter === 'string' && surfaceFilter.trim() && !overview.selected_readiness_surface_filter) {
    return res.status(400).json({
      error: 'Unsupported readiness overview surface_filter',
      request_id: req.id || null,
      status: 'readiness_overview_review_packet_filter_invalid',
      surface_filter: surfaceFilter,
      valid_readiness_surface_filter_ids: overview.valid_readiness_surface_filter_ids,
      review_packet_gate: {
        ...(overview.overview_gate || {}),
        external_send: 'blocked',
        provider_submission: 'blocked',
      },
      details: [
        'Use one of the local-only readiness overview surface filter ids before loading a review packet.',
        'No provider, legal, money, Auth/RLS, production, external-send, or other live action was attempted.',
      ],
      no_live_action_attempted: true,
    });
  }
  res.json({
    request_id: req.id || null,
    generated_at: new Date().toISOString(),
    ...buildAdminReadinessOverviewReviewPacket({
      surface_filter: typeof surfaceFilter === 'string' ? surfaceFilter : '',
    }),
  });
});

app.get('/api/admin/provider-evidence-packet', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-SmartContractor-Demo-Only', 'true');
  res.setHeader('X-SmartContractor-Live-Actions', 'blocked');
  const surfaceFilter = Array.isArray(req.query.surface_filter) ? req.query.surface_filter[0] : req.query.surface_filter;
  const packet = buildProviderEvidencePacket({
    surface_filter: typeof surfaceFilter === 'string' ? surfaceFilter : '',
  });
  if (typeof surfaceFilter === 'string' && surfaceFilter.trim() && !packet.selected_readiness_surface_filter) {
    return res.status(400).json({
      error: 'Unsupported provider evidence packet surface_filter',
      request_id: req.id || null,
      status: 'provider_evidence_packet_filter_invalid',
      surface_filter: surfaceFilter,
      valid_readiness_surface_filter_ids: packet.valid_readiness_surface_filter_ids,
      packet_gate: packet.packet_gate,
      details: [
        'Use one of the local-only provider evidence packet surface filter ids.',
        'No provider submission, external packet send, legal decision, money movement, Auth/RLS change, production release, or other live action was attempted.',
      ],
      no_live_action_attempted: true,
    });
  }
  res.json({
    request_id: req.id || null,
    generated_at: new Date().toISOString(),
    ...packet,
  });
});

app.get('/api/admin/provider-evidence-packet/print-template', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-SmartContractor-Demo-Only', 'true');
  res.setHeader('X-SmartContractor-Live-Actions', 'blocked');
  const surfaceFilter = Array.isArray(req.query.surface_filter) ? req.query.surface_filter[0] : req.query.surface_filter;
  const template = buildProviderEvidencePacketPrintTemplate({
    surface_filter: typeof surfaceFilter === 'string' ? surfaceFilter : '',
  });
  if (typeof surfaceFilter === 'string' && surfaceFilter.trim() && !template.selected_readiness_surface_filter) {
    return res.status(400).json({
      error: 'Unsupported provider evidence packet print template surface_filter',
      request_id: req.id || null,
      status: 'provider_evidence_packet_print_template_filter_invalid',
      surface_filter: surfaceFilter,
      valid_readiness_surface_filter_ids: template.valid_readiness_surface_filter_ids,
      export_gate: template.export_gate,
      details: [
        'Use one of the local-only provider evidence packet print template surface filter ids.',
        'No provider submission, external packet send, live provider lookup, legal decision, credit approval, escrow release, payment movement, Auth/RLS change, production release, or other live action was attempted.',
      ],
      no_live_action_attempted: true,
    });
  }
  res.json({
    request_id: req.id || null,
    generated_at: new Date().toISOString(),
    ...template,
  });
});

app.get('/api/admin/provider-evidence-packet/redaction-qa', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-SmartContractor-Demo-Only', 'true');
  res.setHeader('X-SmartContractor-Live-Actions', 'blocked');
  const surfaceFilter = Array.isArray(req.query.surface_filter) ? req.query.surface_filter[0] : req.query.surface_filter;
  const qa = buildProviderEvidencePacketRedactionQa({
    surface_filter: typeof surfaceFilter === 'string' ? surfaceFilter : '',
  });
  if (typeof surfaceFilter === 'string' && surfaceFilter.trim() && !qa.selected_readiness_surface_filter) {
    return res.status(400).json({
      error: 'Unsupported provider evidence packet redaction qa surface_filter',
      request_id: req.id || null,
      status: 'provider_evidence_packet_redaction_qa_filter_invalid',
      surface_filter: surfaceFilter,
      valid_readiness_surface_filter_ids: qa.valid_readiness_surface_filter_ids,
      redaction_qa_gate: qa.redaction_qa_gate,
      details: [
        'Use one of the local-only provider evidence packet redaction qa surface filter ids.',
        'No provider submission, external packet send, live provider lookup, legal decision, credit approval, escrow release, payment movement, Auth/RLS change, production release, or other live action was attempted.',
      ],
      no_live_action_attempted: true,
    });
  }
  res.json({
    request_id: req.id || null,
    generated_at: new Date().toISOString(),
    ...qa,
  });
});

app.get('/api/admin/provider-evidence-review-chain', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-SmartContractor-Demo-Only', 'true');
  res.setHeader('X-SmartContractor-Live-Actions', 'blocked');
  const surfaceFilter = Array.isArray(req.query.surface_filter) ? req.query.surface_filter[0] : req.query.surface_filter;
  const reviewChain = buildProviderEvidenceReviewChain({
    surface_filter: typeof surfaceFilter === 'string' ? surfaceFilter : '',
  });
  if (typeof surfaceFilter === 'string' && surfaceFilter.trim() && !reviewChain.selected_readiness_surface_filter) {
    return res.status(400).json({
      error: 'Unsupported provider evidence review chain surface_filter',
      request_id: req.id || null,
      status: 'provider_evidence_review_chain_filter_invalid',
      surface_filter: surfaceFilter,
      valid_readiness_surface_filter_ids: reviewChain.valid_readiness_surface_filter_ids,
      provider_evidence_review_chain_filter_recovery_actions: reviewChain.valid_readiness_surface_filter_ids.map((id) => ({
        id,
        label: `Apply safe review chain filter: ${id}`,
        action: 'reload_local_review_chain_only',
      })),
      review_gate: reviewChain.review_gate,
      details: [
        'Use one of the local-only provider evidence review chain surface filter ids.',
        'No live provider review chain action attempted.',
        'No server storage, external export, provider submission, live provider lookup, legal decision, credit approval, escrow release, payment movement, Auth/RLS change, production release, or other live action was attempted.',
      ],
      no_server_storage_attempted: true,
      no_live_action_attempted: true,
    });
  }
  res.json({
    request_id: req.id || null,
    generated_at: new Date().toISOString(),
    ...reviewChain,
  });
});

app.get('/api/admin/smartcontractor-workflow-readiness', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-SmartContractor-Demo-Only', 'true');
  res.setHeader('X-SmartContractor-Live-Actions', 'blocked');
  const queueFilter = Array.isArray(req.query.queue_filter) ? req.query.queue_filter[0] : req.query.queue_filter;
  const readiness = smartContractorWorkflowReadiness.buildSmartContractorWorkflowReadiness({
    queue_filter: typeof queueFilter === 'string' ? queueFilter : '',
  });
  if (typeof queueFilter === 'string' && queueFilter.trim() && !readiness.selected_checkpoint_queue_filter) {
    return res.status(400).json({
      error: 'Unsupported workflow readiness queue_filter',
      request_id: req.id || null,
      status: 'BLOCKED_FOR_LIVE',
      queue_filter: queueFilter,
      valid_checkpoint_queue_filter_ids: readiness.valid_checkpoint_queue_filter_ids,
      details: [
        'Use one of the local-only checkpoint queue filter ids.',
        'No live workflow action was attempted.',
      ],
      demo_only_boundaries: readiness.demo_only_boundaries,
      no_live_action_attempted: true,
    });
  }
  res.json({
    request_id: req.id || null,
    generated_at: new Date().toISOString(),
    ...readiness,
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
    request_id: req.id || null,
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
  const weekTwoBoard = weekTwoFounderActionBoard();
  const summary = readinessSummary(actions);
  const weekTwoSummary = readinessSummary(weekTwoBoard);
  const weekTwoPhaseCounts = groupByStatus(weekTwoBoard, 'phase');
  const weekTwoStatusCounts = groupByStatus(weekTwoBoard, 'status');
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
  const weekTwoNextActions = weekTwoBoard
    .filter((item) => ['blocked', 'review', 'missing'].includes(item.status))
    .map(({ id, phase, label, status, owner, founder_decision_needed, codex_next_safe_action }) => ({
      id,
      phase,
      label,
      status,
      owner,
      founder_decision_needed,
      codex_next_safe_action,
    }));

  res.json({
    generated_at: new Date().toISOString(),
    request_id: req.id || null,
    mode: 'founder_action_center',
    summary,
    actions,
    next_actions: nextActions,
    week_two_founder_action_board: weekTwoBoard,
    week_two_summary: weekTwoSummary,
    week_two_board_count: weekTwoBoard.length,
    week_two_phase_counts: weekTwoPhaseCounts,
    week_two_status_counts: weekTwoStatusCounts,
    week_two_next_actions: weekTwoNextActions,
    week_two_next_action_count: weekTwoNextActions.length,
    no_week_two_live_action_attempted: true,
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
    request_id: req.id || null,
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

async function buildFounderAuthSetupReport(req) {
  const [membershipSummary, authBinding] = await Promise.all([
    getAdminMembershipSummary(),
    getAuthProfileBindingStatus(req),
  ]);
  const sessionState = authBinding.authenticated
    ? authBinding.profile_linked
      ? authBinding.admin_roles_active?.includes('founder')
        ? 'founder_admin_membership_active'
        : 'profile_linked_admin_membership_needs_founder_approval'
      : 'authenticated_profile_link_needed'
    : 'magic_link_session_needed';
  const reportSections = [
    {
      id: 'magic_link_session_report',
      title: 'Magic Link session',
      status: authBinding.authenticated ? 'ready' : 'blocked',
      detail: authBinding.authenticated
        ? `Browser session is authenticated as ${maskEmail(authBinding.user?.email || '')}.`
        : 'Send Magic Link, open the email link in this same browser, then refresh this report.',
      next_safe_step: authBinding.authenticated ? 'Check profile binding.' : 'Use the Magic Link controls; do not paste the email link or token into chat.',
    },
    {
      id: 'profile_binding_report',
      title: 'Profile binding',
      status: authBinding.profile_linked ? 'ready' : 'review',
      detail: authBinding.profile_linked
        ? 'A SmartContractor profile is linked to the current Auth user.'
        : 'Create or link one founder SmartContractor profile while logged in before strict RLS smoke tests.',
      next_safe_step: authBinding.profile_linked ? 'Prepare founder admin membership approval evidence.' : 'Use local profile controls only; no live admin role insert is allowed from this report.',
    },
    {
      id: 'founder_admin_membership_report',
      title: 'Founder admin membership',
      status: authBinding.admin_roles_active?.includes('founder') ? 'ready' : 'review',
      detail: authBinding.admin_roles_active?.includes('founder')
        ? 'Current Auth user has active founder role.'
        : 'Founder must explicitly approve any admin_memberships insert using the real non-secret Auth user evidence.',
      next_safe_step: 'If approval is needed, capture non-secret user/profile/request-id evidence and stop before any live write.',
    },
    {
      id: 'strict_rls_smoke_report',
      title: 'Strict RLS smoke readiness',
      status: authBinding.admin_roles_active?.includes('founder') && membershipSummary.reachable ? 'review' : 'blocked',
      detail: 'Strict RLS smoke testing remains blocked until founder Auth user, profile binding, and admin membership evidence are ready.',
      next_safe_step: 'Prepare smoke commands and evidence; do not apply RLS or deploy settings from this report.',
    },
  ];
  const founderAuthLiveActionGateBoard = [
    {
      id: 'same_browser_magic_link_gate',
      label: 'Same-browser Magic Link gate',
      board_state: authBinding.authenticated ? 'REVIEW' : 'BLOCKED_FOR_LIVE',
      owner: 'founder',
      current_signal: authBinding.authenticated ? 'same_browser_session_seen' : 'magic_link_session_needed',
      next_safe_action: authBinding.authenticated
        ? 'Refresh Founder Auth Setup in the same browser and keep only masked status plus request IDs in notes.'
        : 'Send Magic Link from the local Auth panel and open it in this same browser; do not paste Magic Link URLs or tokens into chat.',
      evidence_required: ['same-browser session state', 'request_id', 'masked email only if visible'],
      blocked_live_actions: [
        'paste_magic_link_url',
        'paste_bearer_token',
        'reuse_forwarded_magic_link',
        'admin_memberships_insert',
      ],
    },
    {
      id: 'profile_binding_gate',
      label: 'Profile binding gate',
      board_state: authBinding.profile_linked ? 'REVIEW' : 'BLOCKED_FOR_LIVE',
      owner: 'founder+codex',
      current_signal: authBinding.profile_linked ? 'profile_linked' : 'profile_binding_needed',
      next_safe_action: authBinding.profile_linked
        ? 'Capture non-secret profile-linked status and request ID before any admin activation request.'
        : 'Use local profile controls only; stop before profile repair writes until founder approval and current evidence exist.',
      evidence_required: ['profile linked yes/no', 'request_id', 'selected-user confirmation'],
      blocked_live_actions: [
        'profile_repair_write',
        'change_auth_role',
        'admin_memberships_insert',
        'strict_rls_apply',
      ],
    },
    {
      id: 'admin_membership_approval_gate',
      label: 'Admin membership approval gate',
      board_state: authBinding.admin_roles_active?.includes('founder') ? 'REVIEW' : 'BLOCKED_FOR_LIVE',
      owner: 'founder',
      current_signal: authBinding.admin_roles_active?.includes('founder') ? 'founder_role_visible' : 'founder_role_not_active',
      next_safe_action: authBinding.admin_roles_active?.includes('founder')
        ? 'Prepare strict admin smoke evidence, keeping service-role values and tokens out of reports.'
        : 'Request explicit founder approval only after current same-browser evidence and selected founder user are confirmed.',
      evidence_required: ['visible founder role state', 'membership summary', 'current request_id'],
      blocked_live_actions: [
        'admin_memberships_insert',
        'use_service_role_key_in_chat',
        'approve_founder_admin_membership',
        'run_strict_admin_smoke_as_approval',
      ],
    },
    {
      id: 'strict_rls_and_deploy_gate',
      label: 'Strict RLS and deploy gate',
      board_state: 'BLOCKED_FOR_LIVE',
      owner: 'founder+codex',
      current_signal: 'strict_rls_and_deploy_not_approved',
      next_safe_action: 'Prepare local smoke evidence only; strict RLS, deploy settings, and public beta flips need separate founder-controlled decisions.',
      evidence_required: ['strict-gates output summary', 'strict-admin-smoke output summary', 'no-secret confirmation'],
      blocked_live_actions: [
        'strict_rls_apply',
        'deploy_setting_change',
        'public_beta_flip',
        'live_supabase_change',
      ],
    },
    {
      id: 'regulated_finance_action_gate',
      label: 'Regulated finance action gate',
      board_state: 'BLOCKED_FOR_LIVE',
      owner: 'founder/legal/provider',
      current_signal: 'regulated_actions_not_approved',
      next_safe_action: 'Keep Auth/Admin prep separate from finance, escrow, token, provider, legal, XPR, and production approvals.',
      evidence_required: ['founder decision record', 'legal/provider review status', 'disabled real-money confirmation'],
      blocked_live_actions: [
        'payment_loan_escrow_token_action',
        'real_payment',
        'real_loan',
        'escrow_release',
        'stablecoin_settlement',
        'token_collateral_lock',
        'xpr_signature',
        'legal_decision',
        'provider_commitment',
        'production_release',
      ],
    },
  ];
  const copyableFounderSteps = [
    'Founder Auth Setup Report',
    `Request ID: ${req.id || 'pending'}`,
    `Session state: ${sessionState}`,
    `Live action gate rows: ${founderAuthLiveActionGateBoard.length}`,
    '',
    '1. Send Magic Link to the founder email from the local SmartContractor Auth panel.',
    '2. Open the Magic Link in this same browser session.',
    '3. Click Check Session, Check Linked Profile, and Refresh Setup Report.',
    '4. If profile is missing, create or link one founder SmartContractor profile while logged in.',
    '5. Stop before any admin_memberships insert until the founder explicitly approves the non-secret auth_user_id evidence.',
    '6. Stop before strict RLS, deploy, provider, legal, payment, loan, escrow, token collateral, XPR signature, or production action.',
  ].join('\n');

  return {
    generated_at: new Date().toISOString(),
    request_id: req.id || null,
    mode: 'founder_auth_setup_report',
    status: sessionState,
    session_state: sessionState,
    membership_summary: membershipSummary,
    current_session: authBinding,
    report_sections: reportSections,
    founder_auth_live_action_gate_board: founderAuthLiveActionGateBoard,
    founder_auth_live_action_gate_board_note: 'No live founder auth action can paste Magic Link URLs or tokens, repair profiles, insert admin_memberships, change Auth roles, apply strict RLS, change deploy settings, flip public beta, approve regulated finance, request XPR signatures, make legal/provider decisions, or release production from this local report.',
    copyable_founder_steps: copyableFounderSteps,
    report_gate: {
      local_report: 'ready',
      founder_admin_membership_approval_blocked: 'blocked',
      admin_membership_insert: 'blocked',
      profile_repair_write: 'blocked',
      strict_rls_apply: 'blocked',
      live_supabase_change: 'blocked',
      deploy_setting_change: 'blocked',
      provider_action: 'blocked',
      legal_decision: 'blocked',
      payment_loan_escrow_token_action: 'blocked',
      production_release: 'blocked',
      reason: 'This report is read-only founder workflow guidance. It cannot approve, insert, repair, migrate, deploy, or change live systems.',
    },
    safe_report_fields: {
      request_id: 'safe request id only',
      masked_email: 'masked email only when available',
      session_state: 'safe status only',
      report_sections: 'safe local checklist',
      copyable_founder_steps: 'safe local instructions; no tokens or secrets',
    },
    no_live_action_attempted: true,
    next_safe_steps: [
      'Use the copyable steps for founder-present local workflow notes.',
      'Capture only non-secret request IDs and masked status for evidence.',
      'Stop before admin membership insert, strict RLS, deploy, external account, legal/provider, payment, loan, escrow, token collateral, XPR signature, or production actions.',
    ],
  };
}

async function buildFounderAuthSetupPrintTemplate(req) {
  const report = await buildFounderAuthSetupReport(req);
  const session = report.current_session || {};
  const reportGate = report.report_gate || {};
  const reportSectionLines = (report.report_sections || []).map((section) => (
    `- ${section.title}: ${section.status}; ${section.next_safe_step}`
  ));
  const blockedGateLines = [
    ['admin_membership_insert', reportGate.admin_membership_insert],
    ['profile_repair_write', reportGate.profile_repair_write],
    ['strict_rls_apply', reportGate.strict_rls_apply],
    ['live_supabase_change', reportGate.live_supabase_change],
    ['deploy_setting_change', reportGate.deploy_setting_change],
    ['provider_action', reportGate.provider_action],
    ['legal_decision', reportGate.legal_decision],
    ['payment_loan_escrow_token_action', reportGate.payment_loan_escrow_token_action],
    ['production_release', reportGate.production_release],
  ].map(([label, status]) => `- ${label}: ${status || 'blocked'}`);
  const markdownPreview = [
    '# Founder Auth Setup Print Template',
    '',
    `Request ID: ${req.id || 'pending'}`,
    'Mode: founder_auth_setup_print_template',
    `Session state: ${report.session_state}`,
    '',
    '## Safety Boundary',
    'Local print/export draft only. Do not send externally, paste Magic Link URLs, expose tokens/secrets, insert admin_memberships, repair profiles, apply strict RLS, change deploy settings, or touch payment/loan/escrow/token/production systems.',
    '',
    '## Founder Session Evidence',
    `- Authenticated: ${session.authenticated ? 'yes' : 'no'}`,
    `- Masked email: ${maskEmail(session.user?.email || '') || 'not_available'}`,
    `- Profile linked: ${session.profile_linked ? 'yes' : 'no'}`,
    `- Active admin roles: ${(session.admin_roles_active || []).join(', ') || 'none'}`,
    '',
    '## Report Sections',
    ...(reportSectionLines.length ? reportSectionLines : ['- No report sections returned.']),
    '',
    '## Blocked Live Actions',
    ...blockedGateLines,
  ].join('\n');

  return {
    generated_at: new Date().toISOString(),
    request_id: req.id || null,
    mode: 'founder_auth_setup_print_template',
    status: 'local_print_template_ready',
    local_only: true,
    template_format: 'markdown_founder_auth_local_only',
    source_report_summary: {
      mode: report.mode,
      status: report.status,
      session_state: report.session_state,
      report_section_count: report.report_sections.length,
      safe_report_fields: report.safe_report_fields,
    },
    print_template_sections: [
      {
        id: 'founder_session_evidence',
        title: 'Founder session evidence',
        body: 'Capture only request ID, same-browser session status, masked email, profile-linked status, and active role labels.',
        source_count: 4,
        allowed_fields: ['request_id', 'session_state', 'masked_email', 'profile_linked', 'admin_roles_active labels'],
        blocked_fields: ['Magic Link URLs', 'bearer tokens', 'raw auth_user_id screenshots for chat', 'service-role keys', 'passwords', 'raw .env values'],
      },
      {
        id: 'profile_binding_evidence',
        title: 'Profile binding evidence',
        body: 'Summarize profile-linked status and next safe local step without authorizing profile repair writes.',
        source_count: report.report_sections.filter((section) => section.id === 'profile_binding_report').length,
        allowed_fields: ['profile linked yes/no', 'next safe step', 'request id'],
        blocked_fields: ['profile repair SQL', 'live database writes', 'private profile identifiers for external sharing'],
      },
      {
        id: 'admin_membership_gate',
        title: 'Admin membership gate',
        body: 'Show founder admin membership status and blocked admin_memberships insert until explicit founder approval with current non-secret evidence.',
        source_count: report.report_sections.filter((section) => section.id === 'founder_admin_membership_report').length,
        allowed_fields: ['role label status', 'blocked gate status', 'approval-needed note'],
        blocked_fields: ['approval phrase generation', 'admin_memberships insert SQL execution', 'role assignment'],
      },
      {
        id: 'strict_rls_smoke_boundary',
        title: 'Strict RLS smoke boundary',
        body: 'Keep strict RLS apply, deploy settings, live Supabase changes, and production release blocked from the print/export flow.',
        source_count: blockedGateLines.length,
        allowed_fields: ['blocked action label', 'blocked status', 'safe next step'],
        blocked_fields: ['RLS apply command execution', 'deploy setting changes', 'production release approval'],
      },
    ],
    evidence_redaction_attestation: {
      no_magic_link_urls_in_template: true,
      no_bearer_tokens_in_template: true,
      no_service_role_keys_in_template: true,
      no_database_passwords_in_template: true,
      no_raw_env_values_in_template: true,
      no_payment_or_wallet_data_in_template: true,
      no_legal_or_provider_commitments_in_template: true,
      no_live_action_authority_in_template: true,
      required_manual_review_before_external_use: ['founder', 'security', 'legal_if_external'],
    },
    export_gate: {
      local_print_export: 'ready',
      local_copy_preview: 'ready',
      external_send: 'blocked',
      admin_membership_insert: 'blocked',
      profile_repair_write: 'blocked',
      strict_rls_apply: 'blocked',
      live_supabase_change: 'blocked',
      deploy_setting_change: 'blocked',
      provider_action: 'blocked',
      legal_decision: 'blocked',
      payment_loan_escrow_token_action: 'blocked',
      production_release: 'blocked',
      reason: 'This print template is a local evidence helper only. External sharing and live changes require separate founder approval outside this API.',
    },
    report_gate: report.report_gate,
    copyable_markdown_preview: markdownPreview,
    no_live_action_attempted: true,
    next_safe_steps: [
      'Use the markdown preview for internal founder-present notes only.',
      'Do not paste Magic Link URLs, tokens, service-role keys, passwords, raw .env values, or live Auth secrets.',
      'Stop before admin_memberships insert, profile repair write, strict RLS apply, deploy setting changes, external send, legal/provider decisions, real payments, real loans, escrow, token collateral, XPR signatures, or production release.',
    ],
  };
}

app.get('/api/admin/founder-auth-setup/report', async (req, res) => {
  res.json(await buildFounderAuthSetupReport(req));
});

app.get('/api/admin/founder-auth-setup/print-template', async (req, res) => {
  res.json(await buildFounderAuthSetupPrintTemplate(req));
});

async function buildStrictAdminSmokeReadiness(req) {
  const [founderReport, membershipSummary] = await Promise.all([
    buildFounderAuthSetupReport(req),
    getAdminMembershipSummary(),
  ]);
  const boundaryStatus = supabaseBoundaryStatus();
  const session = founderReport.current_session || {};
  const hasFounderMembership = Boolean(session.admin_roles_active?.includes('founder'));
  const serviceRoleReady = boundaryStatus.service_role === 'configured_server_only';
  const adminMode = adminEnforcementMode();
  const routeMode = routeProtectionMode();
  const smokeStatus = hasFounderMembership && serviceRoleReady ? 'review' : 'blocked';
  const smokeSections = [
    {
      id: 'same_browser_founder_session',
      title: 'Same-browser founder session',
      status: session.authenticated ? 'ready' : 'blocked',
      detail: session.authenticated
        ? 'Founder browser session is authenticated; keep evidence non-secret and same-browser only.'
        : 'Send Magic Link and open it in this same browser before any strict admin smoke run.',
      evidence_required: ['request_id', 'same_browser_check_time', 'masked_email', 'session_state'],
      blocked_until: session.authenticated ? 'profile_and_membership_review' : 'fresh_magic_link_session',
    },
    {
      id: 'founder_profile_binding',
      title: 'Founder profile binding',
      status: session.profile_linked ? 'ready' : 'review',
      detail: session.profile_linked
        ? 'Current Auth session has a linked SmartContractor profile.'
        : 'Profile binding evidence is required before strict admin smoke tests can be treated as meaningful.',
      evidence_required: ['profile_linked yes/no', 'request_id', 'same-browser setup result'],
      blocked_until: session.profile_linked ? 'founder_admin_membership_review' : 'profile_link_or_repair_approval',
    },
    {
      id: 'founder_admin_membership',
      title: 'Founder admin membership',
      status: hasFounderMembership ? 'ready' : 'review',
      detail: hasFounderMembership
        ? 'Active founder role is visible for the current Auth session.'
        : 'Strict admin smoke needs an active founder admin_memberships row; this endpoint cannot insert or approve it.',
      evidence_required: ['visible founder role state', 'membership summary', 'request_id'],
      blocked_until: hasFounderMembership ? 'strict_smoke_command_review' : 'explicit_founder_admin_membership_approval',
    },
    {
      id: 'service_role_boundary',
      title: 'Service-role boundary',
      status: serviceRoleReady ? 'review' : 'blocked',
      detail: serviceRoleReady
        ? 'Server-only service-role boundary appears configured; smoke commands still require founder-present evidence review.'
        : 'Strict admin public beta remains blocked until service-role key is configured server-side only.',
      evidence_required: ['service_role configured/missing status only', 'no secret values', 'request_id'],
      blocked_until: serviceRoleReady ? 'strict_smoke_command_review' : 'server_only_service_role_setup',
    },
    {
      id: 'strict_smoke_command_order',
      title: 'Strict smoke command order',
      status: 'review',
      detail: 'Run local smoke validators only after same-browser founder session, profile binding, admin membership, and service-role evidence are ready.',
      evidence_required: ['npm run check:strict-gates output', 'npm run check:strict-admin-smoke output', 'request_id'],
      blocked_until: 'do_not_apply_strict_rls_or_deploy_from_this_endpoint',
    },
  ];
  const strictAdminSmokeEvidenceGateBoard = [
    {
      id: 'same_browser_session_evidence_gate',
      label: 'Same-browser session evidence gate',
      board_state: session.authenticated ? 'REVIEW' : 'BLOCKED_FOR_LIVE',
      owner: 'founder',
      current_signal: session.authenticated ? 'same_browser_session_seen' : 'magic_link_session_needed',
      next_safe_action: session.authenticated
        ? 'Record same-browser status, masked email, and request ID before local smoke output capture.'
        : 'Complete Magic Link in the same browser before treating strict admin smoke output as meaningful.',
      evidence_required: ['same-browser session state', 'masked email', 'request_id', 'check time'],
      blocked_live_actions: [
        'paste_magic_link_url',
        'paste_bearer_token',
        'run_strict_smoke_as_approval',
        'admin_memberships_insert',
      ],
    },
    {
      id: 'admin_membership_evidence_gate',
      label: 'Admin membership evidence gate',
      board_state: hasFounderMembership ? 'REVIEW' : 'BLOCKED_FOR_LIVE',
      owner: 'founder+codex',
      current_signal: hasFounderMembership ? 'founder_membership_visible' : 'founder_membership_not_active',
      next_safe_action: hasFounderMembership
        ? 'Use local smoke commands to collect request IDs and redacted summaries only.'
        : 'Stop before strict admin smoke approval until founder admin membership evidence is current and founder-approved.',
      evidence_required: ['visible founder role state', 'membership summary', 'request_id'],
      blocked_live_actions: [
        'admin_memberships_insert',
        'approve_founder_admin_membership',
        'change_auth_role',
        'strict_rls_apply',
      ],
    },
    {
      id: 'service_role_boundary_evidence_gate',
      label: 'Service-role boundary evidence gate',
      board_state: serviceRoleReady ? 'REVIEW' : 'BLOCKED_FOR_LIVE',
      owner: 'founder+codex',
      current_signal: serviceRoleReady ? 'service_role_boundary_configured' : 'service_role_boundary_missing',
      next_safe_action: serviceRoleReady
        ? 'Record configured/missing status only; never copy service-role values into notes or screenshots.'
        : 'Keep strict admin smoke review blocked until server-only service-role setup is founder-controlled and non-secret evidence is current.',
      evidence_required: ['configured/missing label', 'no secret values', 'request_id'],
      blocked_live_actions: [
        'paste_service_role_key',
        'expose_env_values',
        'live_supabase_change',
        'deploy_setting_change',
      ],
    },
    {
      id: 'strict_command_output_gate',
      label: 'Strict command output gate',
      board_state: 'REVIEW',
      owner: 'codex+founder',
      current_signal: 'local_command_output_capture_only',
      next_safe_action: 'Run only local validators and capture redacted exit codes, request IDs, and safe summaries.',
      evidence_required: ['npm run check:strict-gates output', 'npm run check:strict-admin-smoke output', 'redaction confirmed'],
      blocked_live_actions: [
        'strict_rls_apply',
        'live_supabase_change',
        'deploy_setting_change',
        'public_beta_flip',
      ],
    },
    {
      id: 'post_smoke_live_action_stop_gate',
      label: 'Post-smoke live-action stop gate',
      board_state: 'BLOCKED_FOR_LIVE',
      owner: 'founder/legal/provider',
      current_signal: 'smoke_output_does_not_grant_live_authority',
      next_safe_action: 'Treat passing smoke output as local evidence only; require separate founder/legal/provider decisions for every live-risk action.',
      evidence_required: ['founder decision record', 'strict RLS decision packet', 'disabled real-money confirmation'],
      blocked_live_actions: [
        'admin_memberships_insert',
        'profile_repair_write',
        'strict_rls_apply',
        'live_supabase_change',
        'deploy_setting_change',
        'public_beta_flip',
        'real_payment',
        'real_loan',
        'escrow_release',
        'stablecoin_settlement',
        'token_collateral_lock',
        'xpr_signature',
        'legal_decision',
        'provider_commitment',
        'production_release',
      ],
    },
  ];
  const copyableSmokeCommands = [
    'Strict Admin Smoke Readiness',
    `Request ID: ${req.id || 'pending'}`,
    `Readiness status: ${smokeStatus}`,
    `Evidence gate rows: ${strictAdminSmokeEvidenceGateBoard.length}`,
    '',
    'cd construction-ai',
    'npm run check:strict-gates',
    'npm run check:strict-admin-smoke',
    '',
    'Stop before admin_memberships insert, profile repair write, strict RLS apply, deploy setting change, public beta flip, real payment, real loan, escrow, stablecoin settlement, token collateral, XPR signature, legal decision, or provider commitment.',
  ].join('\n');

  return {
    generated_at: new Date().toISOString(),
    request_id: req.id || null,
    mode: 'strict_admin_smoke_readiness',
    status: smokeStatus,
    admin_enforcement_mode: adminMode,
    route_protection_mode: routeMode,
    founder_auth_setup_status: founderReport.status,
    membership_summary: membershipSummary,
    supabase_boundary_status: boundaryStatus,
    smoke_readiness_sections: smokeSections,
    strict_admin_smoke_evidence_gate_board: strictAdminSmokeEvidenceGateBoard,
    strict_admin_smoke_evidence_gate_board_note: 'No live strict admin smoke action can paste Magic Link URLs, paste tokens or service-role keys, insert admin_memberships, repair profiles, change Auth roles, apply strict RLS, change deploy settings, flip public beta, touch finance/token/XPR/provider/legal systems, or release production from this local readiness board.',
    strict_admin_smoke_gate: {
      local_smoke_plan: 'ready',
      same_browser_founder_session_required: session.authenticated ? 'ready' : 'blocked',
      founder_profile_binding_required: session.profile_linked ? 'ready' : 'review',
      founder_admin_membership_required: 'blocked_or_review',
      service_role_boundary_required: serviceRoleReady ? 'review' : 'blocked',
      strict_gates_command: 'review',
      strict_admin_smoke_command: 'review',
      admin_membership_insert: 'blocked',
      profile_repair_write: 'blocked',
      strict_rls_apply: 'blocked',
      live_supabase_change: 'blocked',
      deploy_setting_change: 'blocked',
      public_beta_flip: 'blocked',
      real_money_or_token_action: 'blocked',
      legal_or_provider_commitment: 'blocked',
      production_release: 'blocked',
      reason: 'This readiness surface prepares local smoke evidence only. It cannot grant roles, repair profiles, apply RLS, deploy, flip public beta, or touch live-risk systems.',
    },
    safe_report_fields: {
      request_id: 'safe request id only',
      smoke_readiness_sections: 'safe local checklist',
      copyable_smoke_commands: 'local commands only',
      membership_summary: 'aggregate role counts only',
      supabase_boundary_status: 'configured/missing only; no secrets',
    },
    copyable_smoke_commands: copyableSmokeCommands,
    no_live_action_attempted: true,
    next_safe_steps: [
      'Use the command block only after same-browser founder/Auth evidence is current.',
      'Record request IDs and validator output locally without secrets.',
      'Stop before any admin role insert, profile repair, strict RLS apply, deploy setting change, public beta flip, payment, loan, escrow, token collateral, XPR signature, legal/provider commitment, or production release.',
    ],
  };
}

app.get('/api/admin/strict-admin-smoke-readiness', async (req, res) => {
  res.json(await buildStrictAdminSmokeReadiness(req));
});

async function buildStrictAdminSmokeOutputTemplate(req) {
  const readiness = await buildStrictAdminSmokeReadiness(req);
  const gate = readiness.strict_admin_smoke_gate || {};
  const outputSections = [
    {
      id: 'strict_gates_output_capture',
      title: 'Strict gates output capture',
      command: 'npm run check:strict-gates',
      required_fields: ['started_at', 'completed_at', 'exit_code', 'request_id', 'stdout_summary', 'stderr_summary', 'secret_redaction_confirmed'],
      blocked_fields: ['bearer tokens', 'Magic Link URLs', 'service-role keys', 'raw env values', 'database passwords', 'private auth URLs'],
      pass_signal: 'Protected strict-mode route failures echo safe X-Request-Id values and optional founder token checks stay local.',
    },
    {
      id: 'strict_admin_smoke_output_capture',
      title: 'Strict admin smoke output capture',
      command: 'npm run check:strict-admin-smoke',
      required_fields: ['started_at', 'completed_at', 'exit_code', 'request_id', 'admin_mode', 'route_mode', 'stdout_summary', 'secret_redaction_confirmed'],
      blocked_fields: ['admin role SQL execution', 'raw auth_user_id screenshots for chat', 'tokens', 'service-role keys', 'provider credentials'],
      pass_signal: 'Local strict admin checklist validates evidence and stop boundaries before any live admin/RLS action.',
    },
    {
      id: 'failure_triage_capture',
      title: 'Failure triage capture',
      command: 'Record failed command, exit code, request ID, non-secret failure label, and next local-only fix.',
      required_fields: ['failed_check', 'exit_code', 'request_id', 'non_secret_failure_label', 'blocked_live_action_confirmed'],
      blocked_fields: ['secrets', 'private account screenshots', 'unredacted logs', 'live SQL actions', 'deploy changes'],
      pass_signal: 'Failures remain local triage work and do not become approval to repair profiles, grant roles, apply RLS, or deploy.',
    },
  ];
  const copyableOutputTemplate = [
    '# Strict Admin Smoke Output Template',
    '',
    `Request ID: ${req.id || 'pending'}`,
    `Readiness status: ${readiness.status}`,
    '',
    '## Command 1',
    'Command: npm run check:strict-gates',
    'Started at:',
    'Completed at:',
    'Exit code:',
    'Request ID:',
    'Safe stdout summary:',
    'Safe stderr summary:',
    'Secret redaction confirmed: yes/no',
    '',
    '## Command 2',
    'Command: npm run check:strict-admin-smoke',
    'Started at:',
    'Completed at:',
    'Exit code:',
    'Request ID:',
    'Safe stdout summary:',
    'Safe stderr summary:',
    'Secret redaction confirmed: yes/no',
    '',
    '## Stop Boundary',
    'No admin_memberships insert, profile repair write, strict RLS apply, live Supabase change, deploy setting change, public beta flip, payment, loan, escrow, stablecoin settlement, token collateral, XPR signature, legal decision, provider commitment, or production release was attempted.',
  ].join('\n');

  return {
    generated_at: new Date().toISOString(),
    request_id: req.id || null,
    mode: 'strict_admin_smoke_output_template',
    status: 'local_output_capture_template_ready',
    source_readiness_status: readiness.status,
    output_template_sections: outputSections,
    output_capture_gate: {
      local_output_capture: 'ready',
      external_send: 'blocked',
      admin_membership_insert: 'blocked',
      profile_repair_write: 'blocked',
      strict_rls_apply: 'blocked',
      live_supabase_change: 'blocked',
      deploy_setting_change: 'blocked',
      public_beta_flip: 'blocked',
      real_money_or_token_action: 'blocked',
      legal_or_provider_commitment: 'blocked',
      production_release: 'blocked',
      reason: 'This template captures local validator output only. It cannot execute commands, approve roles, apply RLS, deploy, or touch live-risk systems.',
    },
    redaction_requirements: {
      no_magic_link_urls: true,
      no_bearer_tokens: true,
      no_service_role_keys: true,
      no_database_passwords: true,
      no_raw_env_values: true,
      no_private_account_screenshots: true,
      no_payment_or_wallet_data: true,
    },
    strict_admin_smoke_gate: gate,
    copyable_output_template: copyableOutputTemplate,
    no_live_action_attempted: true,
    next_safe_steps: [
      'Run local smoke commands manually only after founder/Auth evidence is current.',
      'Paste only redacted summaries, exit codes, and request IDs into the template.',
      'Stop before admin role insert, profile repair, strict RLS apply, deploy setting change, public beta flip, payment, loan, escrow, token collateral, XPR signature, legal/provider commitment, or production release.',
    ],
  };
}

app.get('/api/admin/strict-admin-smoke-output-template', async (req, res) => {
  res.json(await buildStrictAdminSmokeOutputTemplate(req));
});

function validateStrictAdminSmokeOutputDraftText(draftText) {
  const text = String(draftText || '').slice(0, 12000);
  const lines = text.split(/\r?\n/);
  const scanDefinitions = [
    {
      id: 'magic_link_url',
      label: 'Magic Link or private auth URL',
      severity: 'blocked',
      pattern: /https?:\/\/\S*(magic|access_token|refresh_token|token_hash|type=recovery|type=magiclink)\S*/i,
    },
    {
      id: 'bearer_token',
      label: 'Bearer token',
      severity: 'blocked',
      pattern: /\bBearer\s+[A-Za-z0-9._-]{12,}/i,
    },
    {
      id: 'jwt_like_token',
      label: 'JWT-like token',
      severity: 'blocked',
      pattern: /\beyJ[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{8,}\b/i,
    },
    {
      id: 'service_role_key',
      label: 'Service-role key reference with value',
      severity: 'blocked',
      pattern: /\b(SUPABASE_SERVICE_ROLE_KEY|service[-_ ]role key)\s*[:=]\s*\S{8,}/i,
    },
    {
      id: 'raw_env_secret',
      label: 'Raw secret-like env assignment',
      severity: 'blocked',
      pattern: /\b[A-Z0-9_]*(SECRET|PRIVATE|PASSWORD|TOKEN|KEY)\b\s*=\s*["']?[A-Za-z0-9_./:+-]{8,}/i,
    },
    {
      id: 'database_url',
      label: 'Database connection URL',
      severity: 'blocked',
      pattern: /\b(postgres|postgresql):\/\/\S+/i,
    },
    {
      id: 'private_key_or_seed',
      label: 'Private key or seed phrase content',
      severity: 'blocked',
      pattern: /(-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|\bseed phrase\b\s*[:=]|\bprivate key\b\s*[:=])/i,
    },
    {
      id: 'live_action_approval_language',
      label: 'Live-action approval language',
      severity: 'blocked',
      pattern: /\b(approved|approve|enabled|enable|apply now|deploy now|publish now|send externally|ready for live|go live)\b.*\b(admin_memberships|profile repair|strict RLS|live Supabase|deploy|public beta|payment|loan|escrow|stablecoin|token collateral|XPR signature|provider|production)\b/i,
    },
  ];

  return scanDefinitions.flatMap((definition) => (
    lines
      .map((line, index) => ({ line, index }))
      .filter(({ line }) => definition.pattern.test(line))
      .map(({ line, index }) => ({
        id: definition.id,
        label: definition.label,
        severity: definition.severity,
        line_number: index + 1,
        safe_excerpt: line.trim().slice(0, 120),
      }))
  ));
}

async function buildStrictAdminSmokeOutputDraftValidation(req) {
  const draftText = typeof req.body?.draft_text === 'string' ? req.body.draft_text : '';
  const sourceRequestId = typeof req.body?.source_request_id === 'string' ? req.body.source_request_id.slice(0, 120) : '';
  const outputTemplate = await buildStrictAdminSmokeOutputTemplate(req);
  const findings = validateStrictAdminSmokeOutputDraftText(draftText);
  const hasDraftText = draftText.trim().length > 0;
  const hasBlockedFindings = findings.some((finding) => finding.severity === 'blocked');
  const hasRequestId = /\brequest id\s*:/i.test(draftText) || /\brequest_id\b/i.test(draftText);
  const hasStrictGatesOutput = /npm run check:strict-gates/i.test(draftText);
  const hasStrictAdminSmokeOutput = /npm run check:strict-admin-smoke/i.test(draftText);
  const hasStopBoundary = /No admin_memberships insert.*production release was attempted/i.test(draftText.replace(/\r?\n/g, ' '));
  const status = !hasDraftText
    ? 'draft_missing'
    : hasBlockedFindings
      ? 'blocked_for_redaction'
      : 'local_validation_ready';
  const validationSections = [
    {
      id: 'draft_redaction_scan',
      title: 'Draft redaction scan',
      status: hasBlockedFindings ? 'blocked' : 'ready',
      detail: hasBlockedFindings
        ? 'Draft includes forbidden secret-looking or live-approval content. Redact before founder notes or external use.'
        : 'Draft does not include scanner-detected Magic Link URLs, bearer tokens, service-role key values, raw env secrets, database URLs, private keys, seed phrases, or live-action approval language.',
      evidence_required: ['forbidden_content_findings', 'redaction_confirmed'],
    },
    {
      id: 'command_output_presence',
      title: 'Command output presence',
      status: hasStrictGatesOutput || hasStrictAdminSmokeOutput ? 'ready' : 'review',
      detail: 'Draft should include redacted local command output summaries for strict-gates and/or strict-admin-smoke checks.',
      evidence_required: ['npm run check:strict-gates', 'npm run check:strict-admin-smoke', 'exit_code'],
    },
    {
      id: 'request_id_presence',
      title: 'Request ID presence',
      status: hasRequestId || sourceRequestId ? 'ready' : 'review',
      detail: 'Founder notes should include safe request IDs for traceability without tokens, private URLs, or raw Auth data.',
      evidence_required: ['request_id', 'source_request_id'],
    },
    {
      id: 'stop_boundary_confirmation',
      title: 'Stop boundary confirmation',
      status: hasStopBoundary ? 'ready' : 'review',
      detail: 'Draft should explicitly confirm no admin membership insert, profile repair, strict RLS apply, deploy, public beta flip, payment, loan, escrow, token collateral, XPR signature, legal/provider commitment, or production release was attempted.',
      evidence_required: ['blocked_live_action_confirmation'],
    },
  ];

  return {
    generated_at: new Date().toISOString(),
    request_id: req.id || null,
    mode: 'strict_admin_smoke_output_draft_validation',
    status,
    source_request_id: sourceRequestId || outputTemplate.request_id,
    draft_character_count: draftText.length,
    draft_validation_sections: validationSections,
    forbidden_content_findings: findings,
    forbidden_content_finding_count: findings.length,
    draft_validation_gate: {
      local_validation: hasDraftText && !hasBlockedFindings ? 'ready' : 'review',
      external_send: 'blocked',
      server_storage: 'blocked',
      admin_membership_insert: 'blocked',
      profile_repair_write: 'blocked',
      strict_rls_apply: 'blocked',
      live_supabase_change: 'blocked',
      deploy_setting_change: 'blocked',
      public_beta_flip: 'blocked',
      real_money_or_token_action: 'blocked',
      legal_or_provider_commitment: 'blocked',
      production_release: 'blocked',
      reason: 'This endpoint validates a redacted local draft only. It does not store draft text, execute commands, send reports, grant roles, apply RLS, deploy, or touch live-risk systems.',
    },
    safe_copy_summary: `strict admin smoke draft validation ${status}; findings=${findings.length}; request_id=${req.id || 'pending'}; external send and live actions remain blocked.`,
    output_template_status: outputTemplate.status,
    no_server_storage_attempted: true,
    no_live_action_attempted: true,
    next_safe_steps: [
      'If findings are present, remove secrets, private URLs, raw env values, or live-approval wording before using the draft.',
      'Keep draft content local/founder-only and use redacted summaries plus request IDs only.',
      'Stop before external send, admin role insert, profile repair, strict RLS apply, deploy setting change, public beta flip, payment, loan, escrow, token collateral, XPR signature, legal/provider commitment, or production release.',
    ],
  };
}

app.post('/api/admin/strict-admin-smoke-output-draft/validate', async (req, res) => {
  res.json(await buildStrictAdminSmokeOutputDraftValidation(req));
});

function normalizeRequestTraceIds(input) {
  const rawItems = Array.isArray(input)
    ? input
    : String(input || '').split(/[\s,;]+/);
  const cleaned = rawItems
    .map((item) => String(item || '').trim())
    .filter(Boolean)
    .map((item) => item.replace(/[^A-Za-z0-9._:-]/g, '').slice(0, 120))
    .filter(Boolean);

  return [...new Set(cleaned)].slice(0, 20);
}

function getRequestTraceRawItems(input) {
  const rawItems = Array.isArray(input)
    ? input
    : String(input || '').split(/[\s,;]+/);

  return rawItems
    .map((item) => String(item || '').trim())
    .filter(Boolean);
}

function normalizeRequestTraceSourceSurface(value) {
  const cleaned = String(value || 'general_admin')
    .trim()
    .replace(/[^A-Za-z0-9._:-]/g, '')
    .slice(0, 80);
  return cleaned || 'general_admin';
}

async function buildRequestTraceReport(req) {
  const rawRequestIdsInput = req.body?.request_ids ?? req.body?.request_ids_text;
  const rawRequestIdItems = getRequestTraceRawItems(rawRequestIdsInput);
  const rawRequestIdsText = Array.isArray(rawRequestIdsInput)
    ? rawRequestIdsInput.map((item) => String(item || '')).join('\n')
    : String(rawRequestIdsInput || '');
  const safeRequestIds = normalizeRequestTraceIds(rawRequestIdsInput);
  const sourceSurface = normalizeRequestTraceSourceSurface(req.body?.source_surface);
  const rawReportNotes = typeof req.body?.report_notes === 'string' ? req.body.report_notes : '';
  const reportNotes = rawReportNotes.slice(0, 4000);
  const inputLimitWarnings = [];
  if (rawRequestIdItems.length > 20) {
    inputLimitWarnings.push({
      id: 'request_ids_trimmed_to_20',
      label: 'Request IDs trimmed to first 20 safe local values',
      severity: 'review',
      original_count: rawRequestIdItems.length,
      allowed_count: 20,
      safe_excerpt: `${rawRequestIdItems.length} request IDs provided; only first 20 sanitized IDs are included.`,
    });
  }
  const oversizedRequestIdCount = rawRequestIdItems.filter((item) => item.length > 120).length;
  if (oversizedRequestIdCount) {
    inputLimitWarnings.push({
      id: 'request_ids_truncated_to_120',
      label: 'Long request IDs truncated to 120 characters',
      severity: 'review',
      original_count: oversizedRequestIdCount,
      allowed_count: 120,
      safe_excerpt: `${oversizedRequestIdCount} request ID value(s) exceeded the local safe length limit.`,
    });
  }
  if (rawReportNotes.length > 4000) {
    inputLimitWarnings.push({
      id: 'report_notes_truncated_to_4000',
      label: 'Report notes truncated to 4000 characters',
      severity: 'review',
      original_count: rawReportNotes.length,
      allowed_count: 4000,
      safe_excerpt: 'Local report notes exceeded the safe preview limit; notes were truncated before markdown generation.',
    });
  }
  const scanText = [sourceSurface, rawRequestIdsText, safeRequestIds.join('\n'), reportNotes].join('\n');
  const findings = validateStrictAdminSmokeOutputDraftText(scanText);
  const hasBlockedFindings = findings.some((finding) => finding.severity === 'blocked');
  const hasInputLimitWarnings = inputLimitWarnings.length > 0;
  const status = !safeRequestIds.length
    ? 'request_ids_missing'
    : hasBlockedFindings
      ? 'blocked_for_redaction'
      : hasInputLimitWarnings
        ? 'local_report_ready_with_input_limits'
        : 'local_report_ready';
  const generatedAt = new Date().toISOString();
  const gate = {
    local_report: safeRequestIds.length && !hasBlockedFindings ? 'ready' : 'review',
    external_send: 'blocked',
    server_storage: 'blocked',
    live_supabase_change: 'blocked',
    auth_role_write: 'blocked',
    admin_membership_insert: 'blocked',
    profile_repair_write: 'blocked',
    strict_rls_apply: 'blocked',
    deploy_setting_change: 'blocked',
    public_beta_flip: 'blocked',
    real_money_or_token_action: 'blocked',
    legal_or_provider_commitment: 'blocked',
    production_release: 'blocked',
    reason: 'This endpoint builds a local request trace report only. It does not store report content, send externally, query live logs, grant roles, apply RLS, deploy, or touch live-risk systems.',
  };
  const sections = [
    {
      id: 'request_id_collection',
      title: 'Request ID collection',
      status: safeRequestIds.length ? 'ready' : 'review',
      detail: safeRequestIds.length
        ? `Collected ${safeRequestIds.length} sanitized request ID(s) for local founder/tester trace review.`
        : 'Add at least one local request ID before using the report.',
      evidence_required: ['safe_request_ids', 'source_surface'],
    },
    {
      id: 'redaction_scan',
      title: 'Redaction scan',
      status: hasBlockedFindings ? 'blocked' : 'ready',
      detail: hasBlockedFindings
        ? 'Report inputs include forbidden secret-looking or live-approval content. Redact before copying.'
        : 'Report inputs did not match scanner rules for secrets, private URLs, raw env values, payment/wallet data, or live-action approval language.',
      evidence_required: ['forbidden_content_findings'],
    },
    {
      id: 'request_trace_report_input_limits',
      title: 'Input limit review',
      status: hasInputLimitWarnings ? 'review' : 'ready',
      detail: hasInputLimitWarnings
        ? 'One or more local request trace inputs exceeded safe preview limits and were trimmed before markdown generation. Regenerate after trimming browser-local fields if the omitted values are needed.'
        : 'Request trace report inputs stayed within local preview limits.',
      evidence_required: ['input_limit_warnings', 'safe_request_ids', 'no_server_storage_attempted'],
    },
    {
      id: 'safe_scope_confirmation',
      title: 'Safe scope confirmation',
      status: 'blocked_for_live_actions',
      detail: 'Report generation is limited to local request trace notes. External send, server storage, live Supabase changes, Auth role writes, strict RLS apply, deploy settings, public beta flips, money/token actions, legal commitments, provider commitments, and production release stay blocked.',
      evidence_required: ['request_trace_report_gate', 'no_server_storage_attempted', 'no_live_action_attempted'],
    },
    {
      id: 'copyable_report_markdown',
      title: 'Copyable report markdown',
      status: safeRequestIds.length && !hasBlockedFindings ? 'ready' : 'review',
      detail: 'Use the markdown only after confirming request IDs are safe and all sensitive/live-risk content is redacted.',
      evidence_required: ['copyable_report_markdown'],
    },
  ];
  const safeRequestIdLines = safeRequestIds.length
    ? safeRequestIds.map((id) => `- ${id}`)
    : ['- none_provided'];
  const copyableReportMarkdown = [
    '# Request Trace Report',
    '',
    `Generated at: ${generatedAt}`,
    `Endpoint request ID: ${req.id || 'pending'}`,
    `Source surface: ${sourceSurface}`,
    `Status: ${status}`,
    '',
    '## Safe Request IDs',
    ...safeRequestIdLines,
    '',
    '## Local Notes',
    reportNotes.trim() || 'No notes provided.',
    '',
    '## Redaction Scan',
    `Forbidden content findings: ${findings.length}`,
    '',
    '## Input Limit Warnings',
    `Input limit warnings: ${inputLimitWarnings.length}`,
    '',
    '## Stop Boundary',
    'No external send, server storage, live Supabase change, Auth role write, admin_memberships insert, profile repair, strict RLS apply, deploy setting change, public beta flip, payment, loan, escrow, stablecoin settlement, token collateral, XPR signature, legal decision, provider commitment, or production release was attempted.',
  ].join('\n');

  return {
    generated_at: generatedAt,
    request_id: req.id || null,
    mode: 'request_trace_report',
    status,
    source_surface: sourceSurface,
    safe_request_ids: safeRequestIds,
    request_trace_report_sections: sections,
    forbidden_content_findings: findings,
    forbidden_content_finding_count: findings.length,
    input_limit_warnings: inputLimitWarnings,
    input_limit_warning_count: inputLimitWarnings.length,
    request_trace_report_gate: gate,
    copyable_report_markdown: copyableReportMarkdown,
    safe_copy_summary: `request trace report ${status}; request_ids=${safeRequestIds.length}; findings=${findings.length}; request_id=${req.id || 'pending'}; external send, server storage, and live actions remain blocked.`,
    no_server_storage_attempted: true,
    no_live_action_attempted: true,
    next_safe_steps: [
      'Keep the report local/founder-only unless explicitly approved through a separate founder decision.',
      'Remove any scanner findings before copying report text into founder notes.',
      'Stop before external send, live Supabase change, Auth role write, admin membership insert, profile repair, strict RLS apply, deploy setting change, public beta flip, payment, loan, escrow, token collateral, XPR signature, legal/provider commitment, or production release.',
    ],
  };
}

app.post('/api/admin/request-trace-report', async (req, res) => {
  res.json(await buildRequestTraceReport(req));
});

function normalizeAdminEvidenceExportSourceFilter(value) {
  const cleaned = String(value || 'all_evidence_sources')
    .trim()
    .replace(/[^A-Za-z0-9._:-]/g, '')
    .slice(0, 80);
  return cleaned || 'all_evidence_sources';
}

function buildAdminEvidenceExportPreview(req) {
  const generatedAt = new Date().toISOString();
  const metadataAllowlist = [
    'generated_at',
    'request_id',
    'status',
    'source_surface',
    'source_request_id',
    'safe_request_ids',
    'forbidden_content_finding_count',
    'validation_section_count',
    'gate_summary',
    'no_server_storage_attempted',
    'no_live_action_attempted',
  ];
  const blockedFields = [
    'raw_draft_text',
    'draft_text',
    'report_notes',
    'copyable_report_markdown',
    'magic_link_url',
    'bearer_token',
    'service_role_key',
    'raw_env_value',
    'private_url',
    'raw_public_copy_draft',
    'public_copy_draft',
    'copy_text',
    'raw_founder_decision_text',
    'decision_text',
    'founder_decision_text',
    'publication_go_text',
    'raw_reviewer_note',
    'raw_live_confusion_note',
    'reviewer_note',
    'note_text',
    'issue_excerpt',
    'live_confusion_issue_excerpt',
    'safe_excerpt',
    'raw_payment_reference',
    'payment_reference',
    'payment_tx_hash',
    'transaction_hash',
    'tx_hash',
    'loan_id',
    'real_loan_id',
    'borrower_identity_data',
    'contractor_identity_data',
    'payment_data',
    'wallet_data',
    'wallet_address',
    'repayment_readiness_approval',
    'repayment_routing_approval',
    'escrow_release_approval',
    'contractor_payout_approval',
    'real_repayment_routing',
    'real_payment_movement',
    'real_escrow_release',
    'identity_data',
    'signed_contract_text',
    'xpr_signature',
    'payment_or_wallet_data',
    'legal_or_provider_decision',
    'public_replacement_approval',
    'deploy_approval',
    'url_share_approval',
    'tester_invite_approval',
    'provider_submission',
    'public_beta_approval',
    'production_approval',
    'live_action_approval',
  ];
  const reviewTargetBySource = {
    strict_admin_smoke_draft_validation_history: {
      id: 'strict_admin_smoke_draft_validation_history_target',
      source_id: 'strict_admin_smoke_draft_validation_history',
      title: 'Strict admin smoke draft validation history',
      ui_anchor: 'strictAdminSmokeDraftValidationHistoryGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review redacted strict admin smoke draft validation metadata before any founder handoff.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    request_trace_report_history: {
      id: 'request_trace_report_history_target',
      source_id: 'request_trace_report_history',
      title: 'Request trace report history',
      ui_anchor: 'requestTraceReportHistoryGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review local request trace report metadata and redaction findings before copying summaries.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    admin_local_evidence_timeline: {
      id: 'admin_local_evidence_timeline_target',
      source_id: 'admin_local_evidence_timeline',
      title: 'Admin local evidence timeline',
      ui_anchor: 'adminLocalEvidenceTimelineGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review browser-local metadata timeline entries and keep raw drafts, notes, markdown, secrets, and live approvals out of handoff.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    supabase_boundary: {
      id: 'supabase_boundary_target',
      source_id: 'supabase_boundary',
      title: 'Supabase Boundary',
      ui_anchor: 'supabaseBoundaryGrid',
      local_check: 'npm run check:auth',
      next_review_action: 'Review publishable-client, service-role, Auth/RLS/admin, strict beta, and no-live-Supabase boundary metadata before founder/deploy handoff.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    mobile_install_readiness: {
      id: 'mobile_install_readiness_target',
      source_id: 'mobile_install_readiness',
      title: 'Mobile install readiness',
      ui_anchor: 'mobileInstallReadinessGrid',
      local_check: 'npm run check:mobile-install-readiness',
      next_review_action: 'Review PWA shell files, manifest identity, service-worker API cache boundary, offline shell, screenshot evidence, and store-release blockers before founder mobile QA.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    founder_auth_next_step_readiness: {
      id: 'founder_auth_next_step_readiness_target',
      source_id: 'founder_auth_next_step_readiness',
      title: 'Founder Auth next-step readiness',
      ui_anchor: 'betaReadinessGrid',
      local_check: 'npm run check:auth',
      next_review_action: 'Review Magic Link same-browser status, profile binding evidence, founder admin activation stop gate, and no-live-action blocker metadata before founder Auth/Admin review.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    founder_auth_setup: {
      id: 'founder_auth_setup_target',
      source_id: 'founder_auth_setup',
      title: 'Founder Auth setup',
      ui_anchor: 'founderAuthSetupGrid',
      local_check: 'npm run check:auth',
      next_review_action: 'Review founder Auth setup checklist metadata, same-browser session status, profile/admin membership readiness state, and no-live-action gates before founder Auth/Admin handoff.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    founder_auth_setup_report: {
      id: 'founder_auth_setup_report_target',
      source_id: 'founder_auth_setup_report',
      title: 'Founder Auth setup report',
      ui_anchor: 'founderAuthSetupGrid',
      local_check: 'npm run check:auth',
      next_review_action: 'Review founder Auth setup report metadata, live action gate counts, report gate state, same-browser/profile/admin blockers, and no-live-action gates before copying founder Auth setup notes.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    founder_auth_setup_print_template: {
      id: 'founder_auth_setup_print_template_target',
      source_id: 'founder_auth_setup_print_template',
      title: 'Founder Auth setup print template',
      ui_anchor: 'founderAuthSetupGrid',
      local_check: 'npm run check:auth',
      next_review_action: 'Review founder Auth print-template metadata, redaction requirements, same-browser evidence, profile/admin membership blocker state, and no-live-action gates before copying any founder Auth setup notes.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    strict_admin_smoke_readiness: {
      id: 'strict_admin_smoke_readiness_target',
      source_id: 'strict_admin_smoke_readiness',
      title: 'Strict admin smoke readiness',
      ui_anchor: 'strictAdminSmokeReadinessGrid',
      local_check: 'npm run check:auth',
      next_review_action: 'Review same-browser session, founder admin membership, service-role boundary, strict command output, and post-smoke live-action stop metadata before any strict admin smoke handoff.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    strict_admin_smoke_output_template: {
      id: 'strict_admin_smoke_output_template_target',
      source_id: 'strict_admin_smoke_output_template',
      title: 'Strict admin smoke output template',
      ui_anchor: 'strictAdminSmokeReadinessGrid',
      local_check: 'npm run check:auth',
      next_review_action: 'Review output capture template metadata, redaction requirements, local command labels, and no-live-action gates before copying any redacted strict smoke summaries.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    deployment_next_step_readiness: {
      id: 'deployment_next_step_readiness_target',
      source_id: 'deployment_next_step_readiness',
      title: 'Deployment next-step readiness',
      ui_anchor: 'betaReadinessGrid',
      local_check: 'npm run check:auth',
      next_review_action: 'Review deployment target, external account session, public beta URL smoke intake, Supabase redirect/env owner, and no-live-action blocker metadata before founder deploy review.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    founder_action_center: {
      id: 'founder_action_center_target',
      source_id: 'founder_action_center',
      title: 'Founder Action Center',
      ui_anchor: 'founderActionGrid',
      local_check: 'npm run check:auth',
      next_review_action: 'Review owner-only founder action metadata, connector status, safety rules, and blocked-live boundaries before founder handoff.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    founder_handoff_today: {
      id: 'founder_handoff_today_target',
      source_id: 'founder_handoff_today',
      title: 'Founder handoff today',
      ui_anchor: 'betaReadinessGrid',
      local_check: 'npm run check:auth',
      next_review_action: 'Review Auth/Admin, deploy/public URL, homepage publication, contract review, and legal/provider finance blocker metadata before founder review.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    week_one_closeout_handoff: {
      id: 'week_one_closeout_handoff_target',
      source_id: 'week_one_closeout_handoff',
      title: 'Week 1 closeout handoff',
      ui_anchor: 'betaReadinessGrid',
      local_check: 'npm run check:auth',
      next_review_action: 'Review Week 1 completed local surfaces, Week 2 Auth/Admin evidence start, deploy/public beta hold, and legal/provider review prep before any live action.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    investor_founder_package_readiness: {
      id: 'investor_founder_package_readiness_target',
      source_id: 'investor_founder_package_readiness',
      title: 'Investor/founder package readiness',
      ui_anchor: 'betaReadinessGrid',
      local_check: 'npm run check:investor-founder-package',
      next_review_action:
        'Review internal package readiness, evidence freshness, claim review, and external-send stop gate before any investor, grant, partner, provider, attorney, or founder-forwarded packet action.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    founder_live_blocker_handoff_pack: {
      id: 'founder_live_blocker_handoff_pack_target',
      source_id: 'founder_live_blocker_handoff_pack',
      title: 'Founder live blocker handoff pack',
      ui_anchor: 'betaReadinessGrid',
      local_check: 'npm run check:auth',
      next_review_action: 'Review Auth/Admin, deploy, public beta invite, contract review, legal/provider, payment, loan, escrow, token collateral, XPR, and production blocker metadata before founder evening review.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    traditional_first_public_copy_validation_history: {
      id: 'traditional_first_public_copy_validation_history_target',
      source_id: 'traditional_first_public_copy_validation_history',
      title: 'Traditional-first public copy validation history',
      ui_anchor: 'traditionalFirstPublicCopyValidationHistoryGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review local public copy validation metadata and no-storage/no-public-edit/no-live-action gates before founder/public beta handoff.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    homepage_publication_decision_validation_history: {
      id: 'homepage_publication_decision_validation_history_target',
      source_id: 'homepage_publication_decision_validation_history',
      title: 'Homepage publication decision validation history',
      ui_anchor: 'homepagePublicationDecisionValidationHistoryGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review local homepage decision validation metadata and no-storage/no-public-replacement/no-deploy/no-share/no-live-action gates before founder publication handoff.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    homepage_publication_evidence_checklist: {
      id: 'homepage_publication_evidence_checklist_target',
      source_id: 'homepage_publication_evidence_checklist',
      title: 'Homepage publication evidence checklist',
      ui_anchor: 'betaReadinessGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review homepage publication checklist metadata, required evidence counts, viewport guard state, and no-public/no-deploy/no-share/no-live gates before founder publication handoff.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    homepage_publication_sequence_gate: {
      id: 'homepage_publication_sequence_gate_target',
      source_id: 'homepage_publication_sequence_gate',
      title: 'Homepage publication sequence gate',
      ui_anchor: 'betaReadinessGrid',
      local_check: 'npm run check:auth',
      next_review_action: 'Review copy direction, PUBLICATION_GO, exact public file replacement, deploy setup, URL smoke, and invite/share sequencing as separate founder-controlled gates before homepage publication handoff.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    homepage_publication_review_packet: {
      id: 'homepage_publication_review_packet_target',
      source_id: 'homepage_publication_review_packet',
      title: 'Homepage publication review packet',
      ui_anchor: 'betaReadinessGrid',
      local_check: 'npm run check:auth',
      next_review_action: 'Review safe public promise, required founder decisions, required evidence sources, blocked public claims, and no-public/no-deploy/no-share/no-live gates before founder publication review.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    homepage_publication_decision_summary: {
      id: 'homepage_publication_decision_summary_target',
      source_id: 'homepage_publication_decision_summary',
      title: 'Homepage publication decision summary',
      ui_anchor: 'betaReadinessGrid',
      local_check: 'npm run check:auth',
      next_review_action: 'Review local-ready/public-blocked state, recommended founder response phrases, unchanged public state, remaining blockers, and next safe actions before founder publication handoff.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    homepage_static_asset_candidate: {
      id: 'homepage_static_asset_candidate_target',
      source_id: 'homepage_static_asset_candidate',
      title: 'Homepage static asset candidate',
      ui_anchor: 'betaReadinessGrid',
      local_check: 'npm --prefix construction-ai run check:homepage-v1-3-static-draft',
      next_review_action: 'Review static candidate file, no-external-asset posture, desktop/mobile Browser evidence, clean-session caveat, and public replacement blockers before founder publication handoff.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    homepage_publication_final_qa_hold: {
      id: 'homepage_publication_final_qa_hold_target',
      source_id: 'homepage_publication_final_qa_hold',
      title: 'Homepage final QA hold',
      ui_anchor: 'betaReadinessGrid',
      local_check: 'npm run check:auth',
      next_review_action: 'Review homepage final QA hold metadata, exact candidate file, required final QA evidence, and no-public/no-archive/no-deploy/no-share/no-live gates before any PUBLICATION_GO handoff.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    beta_finance_contract_reviewer_note_validation_history: {
      id: 'beta_finance_contract_reviewer_note_validation_history_target',
      source_id: 'beta_finance_contract_reviewer_note_validation_history',
      title: 'Beta finance/contract reviewer note validation history',
      ui_anchor: 'betaFinanceContractReviewerNoteValidationHistoryGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review local SAFE_REVIEWER_NOTE validation metadata and no-storage/no-live-action gates before founder/tester handoff.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    beta_finance_contract_live_confusion_validation_history: {
      id: 'beta_finance_contract_live_confusion_validation_history_target',
      source_id: 'beta_finance_contract_live_confusion_validation_history',
      title: 'Beta finance/contract live-confusion validation history',
      ui_anchor: 'betaFinanceContractLiveConfusionValidationHistoryGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review local LIVE_CONFUSION_REVIEW_ONLY validation metadata and no-storage/no-live-action gates before founder/tester handoff.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    beta_finance_contract_session_safety_validation_history: {
      id: 'beta_finance_contract_session_safety_validation_history_target',
      source_id: 'beta_finance_contract_session_safety_validation_history',
      title: 'Beta finance/contract session-safety validation history',
      ui_anchor: 'betaFinanceContractSessionSafetyValidationHistoryGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review local FINANCE_CONTRACT_SESSION_SAFETY validation metadata and no-storage/no-live-action gates before founder/tester handoff.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    beta_finance_contract_safe_handoff_report_history: {
      id: 'beta_finance_contract_safe_handoff_report_history_target',
      source_id: 'beta_finance_contract_safe_handoff_report_history',
      title: 'Beta finance/contract safe handoff report history',
      ui_anchor: 'betaFinanceContractSafeHandoffReportHistoryGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review local safe handoff report metadata and request IDs without markdown, raw notes, issue excerpts, external export, or live-action approvals before founder/tester handoff.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    job_fit_snapshot_history: {
      id: 'job_fit_snapshot_history_target',
      source_id: 'job_fit_snapshot_history',
      title: 'Job fit snapshot history',
      ui_anchor: 'jobFitSnapshotHistoryGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review local job fit snapshot metadata and request IDs without raw job details, real lead routing, contractor assignment approvals, or live matching evidence.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    bid_readiness_comparison_history: {
      id: 'bid_readiness_comparison_history_target',
      source_id: 'bid_readiness_comparison_history',
      title: 'Bid readiness comparison history',
      ui_anchor: 'bidReadinessComparisonHistoryGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review local bid readiness comparison metadata and request IDs without raw bid details, winning bid selection, contractor assignment approvals, or live selection evidence.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    dispute_evidence_review_packet_history: {
      id: 'dispute_evidence_review_packet_history_target',
      source_id: 'dispute_evidence_review_packet_history',
      title: 'Dispute evidence review packet history',
      ui_anchor: 'disputeEvidenceReviewPacketHistoryGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review local dispute evidence review packet metadata and request IDs without packet sections, markdown, redaction values, raw evidence, liability decisions, escrow/refund/payment actions, provider/legal/Auth/RLS changes, or live-action evidence.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    milestone_evidence_review_packet_history: {
      id: 'milestone_evidence_review_packet_history_target',
      source_id: 'milestone_evidence_review_packet_history',
      title: 'Milestone evidence review packet history',
      ui_anchor: 'milestoneEvidenceReviewPacketHistoryGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review local milestone evidence review packet metadata and request IDs without packet sections, markdown, redaction values, raw evidence, milestone approvals, escrow/payment/repayment actions, stablecoin settlement, token collateral, provider/legal/Auth/RLS changes, or live-action evidence.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    working_capital_review_packet_history: {
      id: 'working_capital_review_packet_history_target',
      source_id: 'working_capital_review_packet_history',
      title: 'Working capital review packet history',
      ui_anchor: 'workingCapitalReviewPacketHistoryGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review local working-capital review packet metadata and request IDs without packet sections, markdown, redaction values, contractor identity, credit approvals, funding, loan origination, repayment routing, provider/legal/Auth/RLS changes, or live-action evidence.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    contractor_reputation_review_packet_history: {
      id: 'contractor_reputation_review_packet_history_target',
      source_id: 'contractor_reputation_review_packet_history',
      title: 'Contractor reputation review packet history',
      ui_anchor: 'contractorReputationReviewPacketHistoryGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review local contractor reputation review packet metadata and request IDs without packet sections, markdown, redaction values, raw media/evidence, public score approvals, contractor rankings, credit decisions, adverse-action output, contractor assignments, provider/legal/Auth/RLS changes, or live-action evidence.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    contractor_verification_review_packet_history: {
      id: 'contractor_verification_review_packet_history_target',
      source_id: 'contractor_verification_review_packet_history',
      title: 'Contractor verification review packet history',
      ui_anchor: 'contractorVerificationReviewPacketHistoryGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review local contractor verification review packet metadata and request IDs without packet sections, markdown, redaction values, raw evidence, eligibility approvals/denials, real lead routing, provider/legal/Auth/RLS changes, or live-action evidence.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    readiness_overview_review_packet_history: {
      id: 'readiness_overview_review_packet_history_target',
      source_id: 'readiness_overview_review_packet_history',
      title: 'Admin readiness overview review packet history',
      ui_anchor: 'readinessOverviewReviewPacketHistoryGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review local readiness overview review packet metadata and request IDs without packet sections, markdown, redaction values, raw evidence, provider submissions, legal decisions, credit approvals, escrow releases, Auth/RLS changes, or live-action evidence.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    provider_evidence_packet_history: {
      id: 'provider_evidence_packet_history_target',
      source_id: 'provider_evidence_packet_history',
      title: 'Provider evidence packet history',
      ui_anchor: 'providerEvidencePacketHistoryGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review local provider evidence packet metadata and request IDs without packet sections, markdown previews, redaction findings, raw evidence, provider submissions, legal decisions, credit approvals, escrow releases, Auth/RLS changes, or live-action evidence.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    provider_evidence_packet_print_template_history: {
      id: 'provider_evidence_packet_print_template_history_target',
      source_id: 'provider_evidence_packet_print_template_history',
      title: 'Provider evidence packet print template history',
      ui_anchor: 'providerEvidencePacketPrintTemplateHistoryGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review local provider evidence packet print template metadata and request IDs without print template sections, markdown previews, redaction attestations, raw packet content, provider submissions, legal decisions, credit approvals, escrow releases, Auth/RLS changes, or live-action evidence.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    provider_evidence_packet_redaction_qa_history: {
      id: 'provider_evidence_packet_redaction_qa_history_target',
      source_id: 'provider_evidence_packet_redaction_qa_history',
      title: 'Provider evidence packet redaction QA history',
      ui_anchor: 'providerEvidencePacketRedactionQaHistoryGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review local provider evidence packet redaction QA metadata and request IDs without redaction finding details, matched terms, forbidden phrase source text, markdown previews, print template sections, redaction attestations, raw packet content, provider submissions, legal decisions, credit approvals, escrow releases, Auth/RLS changes, or live-action evidence.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    provider_evidence_review_chain_history: {
      id: 'provider_evidence_review_chain_history_target',
      source_id: 'provider_evidence_review_chain_history',
      title: 'Provider evidence review chain history',
      ui_anchor: 'providerEvidenceReviewChainHistoryGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review local provider evidence review chain metadata and request IDs without chain step details, packet sections, print template sections, redaction findings, matched terms, raw evidence, provider submissions, legal decisions, credit approvals, escrow releases, Auth/RLS changes, external sends, or live-action evidence.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    smart_contract_local_replay_dry_run_history: {
      id: 'smart_contract_local_replay_dry_run_history_target',
      source_id: 'smart_contract_local_replay_dry_run_history',
      title: 'Smart contract local replay dry-run history',
      ui_anchor: 'smartContractLocalReplayDryRunHistoryGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review local smart contract replay dry-run metadata and request IDs without dry-run steps, helper exports, demo fixtures, signatures, finance actions, provider/legal decisions, or live-action evidence.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    smart_contract_local_replay_dry_run_evidence_packet_history: {
      id: 'smart_contract_local_replay_dry_run_evidence_packet_history_target',
      source_id: 'smart_contract_local_replay_dry_run_evidence_packet_history',
      title: 'Smart contract local replay dry-run evidence packet history',
      ui_anchor: 'smartContractLocalReplayDryRunEvidencePacketHistoryGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review local smart contract replay dry-run evidence packet metadata and request IDs without packet sections, markdown previews, redaction values, helper payloads, external sends, or live-action evidence.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    smart_contract_review_workbench_history: {
      id: 'smart_contract_review_workbench_history_target',
      source_id: 'smart_contract_review_workbench_history',
      title: 'Smart contract review workbench history',
      ui_anchor: 'smartContractReviewWorkbenchHistoryGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review local smart contract review workbench metadata and request IDs without workbench card details, helper exports, demo fixtures, dry-run steps, packet/handoff content, signatures, finance actions, provider/legal decisions, or live-action evidence.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    smart_contract_review_workbench_handoff_summary_history: {
      id: 'smart_contract_review_workbench_handoff_summary_history_target',
      source_id: 'smart_contract_review_workbench_handoff_summary_history',
      title: 'Smart contract review workbench handoff summary history',
      ui_anchor: 'smartContractReviewWorkbenchHandoffSummaryHistoryGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review local smart contract review workbench handoff summary metadata and request IDs without handoff sections, markdown previews, redaction values, workbench card details, helper exports, demo fixtures, dry-run steps, packet content, signatures, finance actions, provider/legal decisions, or live-action evidence.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    smart_contract_review_workbench_gate_matrix_history: {
      id: 'smart_contract_review_workbench_gate_matrix_history_target',
      source_id: 'smart_contract_review_workbench_gate_matrix_history',
      title: 'Smart contract review gate matrix history',
      ui_anchor: 'smartContractReviewWorkbenchGateMatrixHistoryGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review local smart contract review gate matrix metadata and request IDs without gate matrix row details, review gate row details, recommended order details, helper exports, demo fixtures, dry-run steps, packet/handoff content, signatures, finance actions, provider/legal decisions, or live-action evidence.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    repayment_allocation_preview_history: {
      id: 'repayment_allocation_preview_history_target',
      source_id: 'repayment_allocation_preview_history',
      title: 'Repayment allocation preview history',
      ui_anchor: 'repaymentAllocationPreviewHistoryGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review local repayment allocation preview metadata and request IDs without raw payment references, loan IDs, approvals, or live-action evidence.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    milestone_acceptance_snapshot_history: {
      id: 'milestone_acceptance_snapshot_history_target',
      source_id: 'milestone_acceptance_snapshot_history',
      title: 'Milestone acceptance snapshot history',
      ui_anchor: 'milestoneAcceptanceSnapshotHistoryGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review local milestone acceptance snapshot metadata and request IDs without raw evidence, approval history, escrow release, payment movement, or live-action evidence.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
    repayment_readiness_snapshot_history: {
      id: 'repayment_readiness_snapshot_history_target',
      source_id: 'repayment_readiness_snapshot_history',
      title: 'Repayment readiness snapshot history',
      ui_anchor: 'repaymentReadinessSnapshotHistoryGrid',
      local_check: 'npm run check:smartcontractor',
      next_review_action: 'Review local repayment readiness snapshot metadata and request IDs without raw payment references, loan IDs, approvals, or live-action evidence.',
      safe_review_router: 'local_ui_navigation_only',
      no_server_storage_attempted: true,
      no_external_export_attempted: true,
      no_live_action_attempted: true,
    },
  };
  const evidenceSources = [
    {
      id: 'strict_admin_smoke_draft_validation_history',
      title: 'Strict admin smoke draft validation history',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: metadataAllowlist,
      blocked_fields: ['raw_draft_text', 'draft_text', 'magic_link_url', 'bearer_token', 'service_role_key', 'raw_env_value', 'live_action_approval'],
      review_targets: [reviewTargetBySource.strict_admin_smoke_draft_validation_history],
    },
    {
      id: 'request_trace_report_history',
      title: 'Request trace report history',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: metadataAllowlist,
      blocked_fields: ['report_notes', 'copyable_report_markdown', 'magic_link_url', 'private_url', 'payment_or_wallet_data', 'legal_or_provider_decision'],
      review_targets: [reviewTargetBySource.request_trace_report_history],
    },
    {
      id: 'admin_local_evidence_timeline',
      title: 'Admin local evidence timeline',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: metadataAllowlist,
      blocked_fields: blockedFields,
      review_targets: [reviewTargetBySource.admin_local_evidence_timeline],
    },
    {
      id: 'supabase_boundary',
      title: 'Supabase Boundary',
      storage_scope: 'server_readonly_metadata',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'boundary_item_count',
        'boundary_status_counts',
        'publishable_client_status',
        'service_role_boundary_status',
        'auth_admin_boundary_status',
        'strict_admin_public_beta_gate',
        'live_supabase_change_status',
        'safe_report_fields',
        'safe_scope_count',
        'evidence_checklist_count',
        'required_evidence',
        'blocked_live_actions',
        'next_safe_action',
        'local_check',
        'no_secret_requested',
        'no_service_role_key_exposed',
        'no_raw_env_value_exposed',
        'no_database_password_exposed',
        'no_auth_token_exposed',
        'no_magic_link_url_exposed',
        'no_admin_membership_insert_attempted',
        'no_profile_repair_attempted',
        'no_strict_rls_apply_attempted',
        'no_live_supabase_change_attempted',
        'no_deploy_setting_change_attempted',
        'no_public_beta_flip_attempted',
        'no_server_storage_attempted',
        'no_external_export_attempted',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No service-role keys, database passwords, raw env values, Supabase access tokens, Magic Link URLs, Auth/session tokens, admin_memberships insert approvals or SQL, profile repair approvals, strict RLS apply approvals, live Supabase changes, Supabase project settings, deploy/public beta approvals, payment/wallet data, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this Supabase Boundary preview.',
      blocked_fields: [
        'service_role_key',
        'database_password',
        'database_url',
        'raw_env_value',
        'supabase_access_token',
        'supabase_refresh_token',
        'supabase_project_jwt_secret',
        'supabase_anon_key_raw',
        'magic_link_url',
        'auth_token',
        'bearer_token',
        'refresh_token',
        'session_cookie',
        'browser_session_cookie',
        'admin_memberships_insert_sql',
        'admin_membership_insert_approval',
        'profile_repair_approval',
        'profiles_auth_user_id_update_approval',
        'auth_role_change_approval',
        'strict_rls_apply_approval',
        'rls_policy_live_apply_approval',
        'live_supabase_change_approval',
        'supabase_project_setting_change_approval',
        'supabase_redirect_update_approval',
        'deploy_setting_change_approval',
        'public_beta_approval',
        'public_url_share_approval',
        'tester_invite_approval',
        'payment_data',
        'wallet_data',
        'payment_or_wallet_data',
        'provider_commitment',
        'legal_or_provider_decision',
        'legal_decision',
        'production_approval',
        'external_send_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.supabase_boundary],
    },
    {
      id: 'mobile_install_readiness',
      title: 'Mobile install readiness',
      storage_scope: 'server_readonly_metadata',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'pwa_file_count',
        'pwa_check_count',
        'evidence_checklist_count',
        'release_gate_status',
        'local_pwa_demo_status',
        'native_wrapper_testing_status',
        'app_store_submission_status',
        'play_console_submission_status',
        'real_money_mobile_release_status',
        'manifest_identity_status',
        'service_worker_api_boundary_status',
        'offline_shell_status',
        'mobile_viewport_evidence_status',
        'safe_report_fields',
        'validation_commands',
        'next_safe_step',
        'blocked_until_founder',
        'required_evidence',
        'blocked_live_actions',
        'local_check',
        'no_store_submission_attempted',
        'no_app_store_submission_attempted',
        'no_play_console_submission_attempted',
        'no_native_wrapper_release_attempted',
        'no_public_release_attempted',
        'no_real_money_mobile_release_attempted',
        'no_payment_action_attempted',
        'no_loan_action_attempted',
        'no_escrow_release_attempted',
        'no_stablecoin_settlement_attempted',
        'no_token_collateral_lock_attempted',
        'no_xpr_signature_attempted',
        'no_external_account_change_attempted',
        'no_server_storage_attempted',
        'no_external_export_attempted',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No app-store approvals, Play Console approvals, signing keys, certificates, provisioning profiles, keystores, external account sessions, production deploy approvals, public release approvals, payment/wallet data, real loan approvals, escrow release approvals, stablecoin settlement approvals, token collateral approvals, XPR signatures, legal/provider decisions, server storage, external sends, or live-action approvals are exported from this Mobile Install Readiness preview.',
      blocked_fields: [
        'app_store_submission_approval',
        'play_console_submission_approval',
        'store_listing_content',
        'native_wrapper_release_approval',
        'certificate',
        'provisioning_profile',
        'signing_key',
        'app_signing_key',
        'keystore',
        'apple_developer_account_session',
        'play_console_account_session',
        'external_account_session',
        'production_deploy_approval',
        'public_release_approval',
        'public_beta_approval',
        'public_url_share_approval',
        'tester_invite_approval',
        'raw_mobile_screenshot',
        'screenshot_file',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'payment_data',
        'wallet_data',
        'payment_or_wallet_data',
        'loan_approval',
        'escrow_release_approval',
        'stablecoin_settlement_approval',
        'token_collateral_lock_approval',
        'xpr_signature',
        'xpr_signature_approval',
        'provider_commitment',
        'legal_or_provider_decision',
        'legal_decision',
        'production_approval',
        'external_send_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.mobile_install_readiness],
    },
    {
      id: 'founder_auth_next_step_readiness',
      title: 'Founder Auth next-step readiness',
      storage_scope: 'server_readonly_metadata',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'auth_item_count',
        'readiness_state_counts',
        'required_evidence_count',
        'required_evidence',
        'blocked_live_actions',
        'evidence_source',
        'next_safe_action',
        'owner',
        'route',
        'no_secret_requested',
        'no_profile_repair_attempted',
        'no_admin_membership_insert_attempted',
        'no_strict_rls_apply_attempted',
        'no_deploy_setting_change_attempted',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No Magic Link URLs, Auth tokens, session cookies, raw founder identity data, profile repair approvals, admin_memberships insert approvals, service-role keys, strict RLS apply approvals, deploy setting approvals, public beta approvals, payment data, wallet data, legal/provider decisions, server storage, external sends, or live-action approvals are exported from this founder Auth next-step readiness preview.',
      blocked_fields: [
        'magic_link_url',
        'auth_token',
        'bearer_token',
        'refresh_token',
        'session_cookie',
        'browser_session_cookie',
        'mfa_code',
        'raw_founder_identity_data',
        'private_identity_document',
        'profile_repair_approval',
        'profiles_auth_user_id_update_approval',
        'admin_membership_insert_approval',
        'admin_memberships_insert_sql',
        'admin_role_assignment_approval',
        'service_role_key',
        'raw_env_value',
        'strict_rls_apply_approval',
        'rls_policy_live_apply_approval',
        'deploy_setting_change_approval',
        'public_beta_approval',
        'public_url_share_approval',
        'tester_invite_approval',
        'payment_data',
        'wallet_data',
        'payment_or_wallet_data',
        'stablecoin_settlement_approval',
        'token_collateral_lock_approval',
        'provider_commitment',
        'legal_or_provider_decision',
        'legal_decision',
        'production_approval',
        'external_send_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.founder_auth_next_step_readiness],
    },
    {
      id: 'founder_auth_setup',
      title: 'Founder Auth setup',
      storage_scope: 'server_readonly_metadata',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'setup_checklist_count',
        'setup_summary_counts',
        'membership_summary_status',
        'current_session_status',
        'safe_scope_count',
        'required_evidence',
        'blocked_live_actions',
        'next_safe_action',
        'local_check',
        'no_secret_requested',
        'no_magic_link_url_paste_attempted',
        'no_auth_token_paste_attempted',
        'no_service_role_key_paste_attempted',
        'no_admin_membership_insert_attempted',
        'no_profile_repair_attempted',
        'no_auth_role_change_attempted',
        'no_strict_rls_apply_attempted',
        'no_live_supabase_change_attempted',
        'no_deploy_setting_change_attempted',
        'no_public_beta_flip_attempted',
        'no_server_storage_attempted',
        'no_external_export_attempted',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No Magic Link URLs, Auth tokens, session cookies, raw founder identity data, raw current_session payloads, selected-user screenshots, service-role keys, raw env values, admin_memberships insert approvals or SQL, profile repair approvals, Auth role change approvals, strict RLS apply approvals, live Supabase changes, deploy/public beta approvals, payment/loan/escrow/token/XPR approvals, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this founder Auth setup preview.',
      blocked_fields: [
        'current_session',
        'raw_current_session',
        'auth_binding_payload',
        'raw_founder_identity_data',
        'selected_user_screenshot',
        'magic_link_url',
        'auth_token',
        'bearer_token',
        'refresh_token',
        'session_cookie',
        'browser_session_cookie',
        'mfa_code',
        'service_role_key',
        'database_password',
        'raw_env_value',
        'admin_memberships_insert_sql',
        'admin_membership_insert_approval',
        'profile_repair_approval',
        'profiles_auth_user_id_update_approval',
        'auth_role_change_approval',
        'strict_rls_apply_approval',
        'rls_policy_live_apply_approval',
        'live_supabase_change_approval',
        'deploy_setting_change_approval',
        'public_beta_approval',
        'public_url_share_approval',
        'tester_invite_approval',
        'payment_data',
        'wallet_data',
        'payment_or_wallet_data',
        'payment_or_loan_action_approval',
        'escrow_release_approval',
        'stablecoin_settlement_approval',
        'token_collateral_lock_approval',
        'xpr_signature',
        'xpr_signature_approval',
        'provider_commitment',
        'legal_or_provider_decision',
        'legal_decision',
        'production_approval',
        'external_send_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.founder_auth_setup],
    },
    {
      id: 'founder_auth_setup_report',
      title: 'Founder Auth setup report',
      storage_scope: 'server_readonly_metadata',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'report_section_count',
        'live_action_gate_board_count',
        'report_gate_status',
        'safe_report_fields',
        'required_evidence',
        'blocked_live_actions',
        'next_safe_action',
        'local_check',
        'no_secret_requested',
        'no_magic_link_url_paste_attempted',
        'no_auth_token_paste_attempted',
        'no_service_role_key_paste_attempted',
        'no_admin_membership_insert_attempted',
        'no_profile_repair_attempted',
        'no_auth_role_change_attempted',
        'no_strict_rls_apply_attempted',
        'no_live_supabase_change_attempted',
        'no_deploy_setting_change_attempted',
        'no_public_beta_flip_attempted',
        'no_server_storage_attempted',
        'no_external_export_attempted',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No copyable founder steps, report sections, founder Auth live action gate board details, Magic Link URLs, Auth tokens, session cookies, raw founder identity data, selected-user screenshots, service-role keys, raw env values, admin_memberships insert approvals or SQL, profile repair approvals, Auth role change approvals, strict RLS apply approvals, live Supabase changes, deploy/public beta approvals, payment/loan/escrow/token/XPR approvals, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this founder Auth setup report preview.',
      blocked_fields: [
        'copyable_founder_steps',
        'report_sections',
        'founder_auth_live_action_gate_board',
        'raw_report_payload',
        'raw_founder_identity_data',
        'selected_user_screenshot',
        'magic_link_url',
        'auth_token',
        'bearer_token',
        'refresh_token',
        'session_cookie',
        'browser_session_cookie',
        'service_role_key',
        'database_password',
        'raw_env_value',
        'admin_memberships_insert_sql',
        'admin_membership_insert_approval',
        'profile_repair_approval',
        'profiles_auth_user_id_update_approval',
        'auth_role_change_approval',
        'strict_rls_apply_approval',
        'rls_policy_live_apply_approval',
        'live_supabase_change_approval',
        'deploy_setting_change_approval',
        'public_beta_approval',
        'public_url_share_approval',
        'tester_invite_approval',
        'payment_data',
        'wallet_data',
        'payment_or_wallet_data',
        'payment_or_loan_action_approval',
        'escrow_release_approval',
        'stablecoin_settlement_approval',
        'token_collateral_lock_approval',
        'xpr_signature',
        'xpr_signature_approval',
        'provider_commitment',
        'legal_or_provider_decision',
        'legal_decision',
        'production_approval',
        'external_send_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.founder_auth_setup_report],
    },
    {
      id: 'founder_auth_setup_print_template',
      title: 'Founder Auth setup print template',
      storage_scope: 'server_readonly_metadata',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'print_template_section_count',
        'print_export_gate_status',
        'redaction_requirement_count',
        'evidence_redaction_attestation',
        'required_evidence',
        'blocked_live_actions',
        'next_safe_action',
        'local_check',
        'no_secret_requested',
        'no_magic_link_url_paste_attempted',
        'no_auth_token_paste_attempted',
        'no_service_role_key_paste_attempted',
        'no_admin_membership_insert_attempted',
        'no_profile_repair_attempted',
        'no_auth_role_change_attempted',
        'no_strict_rls_apply_attempted',
        'no_live_supabase_change_attempted',
        'no_deploy_setting_change_attempted',
        'no_public_beta_flip_attempted',
        'no_server_storage_attempted',
        'no_external_export_attempted',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No copyable markdown preview, print template sections, Magic Link URLs, Auth tokens, session cookies, raw founder identity data, selected-user screenshots, service-role keys, raw env values, admin_memberships insert approvals or SQL, profile repair approvals, Auth role change approvals, strict RLS apply approvals, live Supabase changes, deploy/public beta approvals, payment/loan/escrow/token/XPR approvals, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this founder Auth setup print template preview.',
      blocked_fields: [
        'copyable_markdown_preview',
        'print_template_sections',
        'raw_print_template',
        'raw_markdown_preview',
        'raw_founder_identity_data',
        'selected_user_screenshot',
        'magic_link_url',
        'auth_token',
        'bearer_token',
        'refresh_token',
        'session_cookie',
        'browser_session_cookie',
        'service_role_key',
        'database_password',
        'raw_env_value',
        'admin_memberships_insert_sql',
        'admin_membership_insert_approval',
        'profile_repair_approval',
        'profiles_auth_user_id_update_approval',
        'auth_role_change_approval',
        'strict_rls_apply_approval',
        'rls_policy_live_apply_approval',
        'live_supabase_change_approval',
        'deploy_setting_change_approval',
        'public_beta_approval',
        'public_url_share_approval',
        'tester_invite_approval',
        'payment_data',
        'wallet_data',
        'payment_or_wallet_data',
        'payment_or_loan_action_approval',
        'escrow_release_approval',
        'stablecoin_settlement_approval',
        'token_collateral_lock_approval',
        'xpr_signature',
        'xpr_signature_approval',
        'provider_commitment',
        'legal_or_provider_decision',
        'legal_decision',
        'production_approval',
        'external_send_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.founder_auth_setup_print_template],
    },
    {
      id: 'strict_admin_smoke_readiness',
      title: 'Strict admin smoke readiness',
      storage_scope: 'server_readonly_metadata',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'strict_smoke_gate_count',
        'strict_admin_smoke_evidence_gate_count',
        'strict_admin_smoke_evidence_gate_board',
        'strict_admin_smoke_gate',
        'required_evidence',
        'blocked_live_actions',
        'next_safe_action',
        'local_check',
        'no_secret_requested',
        'no_magic_link_url_paste_attempted',
        'no_service_role_key_paste_attempted',
        'no_admin_membership_insert_attempted',
        'no_profile_repair_attempted',
        'no_auth_role_change_attempted',
        'no_strict_rls_apply_attempted',
        'no_live_supabase_change_attempted',
        'no_deploy_setting_change_attempted',
        'no_public_beta_flip_attempted',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No Magic Link URLs, Auth tokens, session cookies, service-role keys, raw env values, raw strict admin smoke command output, admin_memberships insert approvals or SQL, profile repair approvals, Auth role change approvals, strict RLS apply approvals, live Supabase changes, deploy/public beta approvals, payment/loan/escrow/token/XPR approvals, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this strict admin smoke readiness preview.',
      blocked_fields: [
        'magic_link_url',
        'auth_token',
        'bearer_token',
        'refresh_token',
        'session_cookie',
        'service_role_key',
        'raw_env_value',
        'raw_command_output',
        'strict_admin_smoke_raw_output',
        'admin_memberships_insert_sql',
        'admin_membership_insert_approval',
        'profile_repair_approval',
        'profiles_auth_user_id_update_approval',
        'auth_role_change_approval',
        'strict_rls_apply_approval',
        'rls_policy_live_apply_approval',
        'live_supabase_change_approval',
        'deploy_setting_change_approval',
        'public_beta_approval',
        'payment_data',
        'wallet_data',
        'payment_or_wallet_data',
        'payment_or_loan_action_approval',
        'escrow_release_approval',
        'stablecoin_settlement_approval',
        'token_collateral_lock_approval',
        'xpr_signature',
        'xpr_signature_approval',
        'provider_commitment',
        'legal_or_provider_decision',
        'legal_decision',
        'production_approval',
        'external_send_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.strict_admin_smoke_readiness],
    },
    {
      id: 'strict_admin_smoke_output_template',
      title: 'Strict admin smoke output template',
      storage_scope: 'server_readonly_metadata',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'source_readiness_status',
        'output_template_section_count',
        'output_capture_gate_status',
        'redaction_requirement_count',
        'strict_admin_smoke_gate',
        'required_fields',
        'blocked_fields',
        'local_check',
        'next_safe_steps',
        'no_magic_link_urls',
        'no_bearer_tokens',
        'no_service_role_keys',
        'no_database_passwords',
        'no_raw_env_values',
        'no_private_account_screenshots',
        'no_payment_or_wallet_data',
        'no_server_storage_attempted',
        'no_external_export_attempted',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No copyable output template text, raw strict admin smoke command output, stdout/stderr details, Magic Link URLs, Auth tokens, session cookies, service-role keys, raw env values, admin_memberships insert approvals or SQL, profile repair approvals, strict RLS apply approvals, live Supabase changes, deploy/public beta approvals, payment/loan/escrow/token/XPR approvals, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this strict admin smoke output template preview.',
      blocked_fields: [
        'copyable_output_template',
        'output_template_sections',
        'raw_output_template',
        'raw_command_output',
        'command_output',
        'raw_stdout',
        'raw_stderr',
        'stdout_summary',
        'stderr_summary',
        'strict_admin_smoke_raw_output',
        'magic_link_url',
        'auth_token',
        'bearer_token',
        'refresh_token',
        'session_cookie',
        'service_role_key',
        'database_password',
        'raw_env_value',
        'private_account_screenshot',
        'admin_memberships_insert_sql',
        'admin_membership_insert_approval',
        'profile_repair_approval',
        'profiles_auth_user_id_update_approval',
        'auth_role_change_approval',
        'strict_rls_apply_approval',
        'rls_policy_live_apply_approval',
        'live_supabase_change_approval',
        'deploy_setting_change_approval',
        'public_beta_approval',
        'payment_data',
        'wallet_data',
        'payment_or_wallet_data',
        'payment_or_loan_action_approval',
        'escrow_release_approval',
        'stablecoin_settlement_approval',
        'token_collateral_lock_approval',
        'xpr_signature',
        'xpr_signature_approval',
        'provider_commitment',
        'legal_or_provider_decision',
        'legal_decision',
        'production_approval',
        'external_send_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.strict_admin_smoke_output_template],
    },
    {
      id: 'deployment_next_step_readiness',
      title: 'Deployment next-step readiness',
      storage_scope: 'server_readonly_metadata',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'deployment_item_count',
        'readiness_state_counts',
        'required_evidence_count',
        'required_evidence',
        'blocked_live_actions',
        'evidence_source',
        'next_safe_action',
        'owner',
        'no_external_account_change_attempted',
        'no_deploy_setting_change_attempted',
        'no_dns_change_attempted',
        'no_supabase_redirect_change_attempted',
        'no_public_url_share_attempted',
        'no_tester_invite_attempted',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No external account login/session details, Vercel account connections, GitHub Pages setting approvals, DNS/Namecheap changes, production env values, service-role keys, Supabase redirect approvals, real public URLs, URL-share approvals, tester-invite approvals, payment data, wallet data, legal/provider decisions, server storage, external sends, or live-action approvals are exported from this deployment next-step readiness preview.',
      blocked_fields: [
        'external_account_login',
        'account_session',
        'browser_session_cookie',
        'mfa_code',
        'billing_plan_change',
        'team_or_org_invite',
        'vercel_account_connection',
        'vercel_import_approval',
        'github_pages_setting_change_approval',
        'dns_change_approval',
        'namecheap_change_approval',
        'production_env_var_value',
        'production_env_var_change_approval',
        'service_role_key',
        'raw_env_value',
        'supabase_redirect_update_approval',
        'payment_provider_secret_entry',
        'real_public_url',
        'public_url',
        'private_url',
        'public_url_share_approval',
        'tester_invite_approval',
        'deploy_approval',
        'production_deploy_approval',
        'payment_data',
        'wallet_data',
        'payment_or_wallet_data',
        'stablecoin_settlement_approval',
        'token_collateral_lock_approval',
        'provider_commitment',
        'legal_or_provider_decision',
        'legal_decision',
        'public_beta_approval',
        'production_approval',
        'external_send_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.deployment_next_step_readiness],
    },
    {
      id: 'founder_action_center',
      title: 'Founder Action Center',
      storage_scope: 'server_readonly_metadata',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'action_item_count',
        'action_phase_counts',
        'action_status_counts',
        'owner_action_count',
        'blocked_action_count',
        'week_two_board_count',
        'week_two_phase_counts',
        'week_two_status_counts',
        'week_two_next_action_count',
        'founder_decision_needed',
        'codex_next_safe_action',
        'evidence_sources',
        'connector_status',
        'safety_rule_count',
        'required_evidence',
        'blocked_live_actions',
        'next_safe_action',
        'local_check',
        'no_secret_requested',
        'no_external_account_change_attempted',
        'no_service_role_key_paste_attempted',
        'no_admin_membership_insert_attempted',
        'no_live_supabase_change_attempted',
        'no_deploy_setting_change_attempted',
        'no_public_beta_flip_attempted',
        'no_week_two_live_action_attempted',
        'no_server_storage_attempted',
        'no_external_export_attempted',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No founder secrets, passwords, API keys, service-role keys, wallet keys, raw env values, external account session data, connector tokens, Magic Link URLs, Auth tokens, live Supabase approvals, admin membership approvals, deploy/share/invite approvals, payment/loan/escrow/token/XPR approvals, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this founder Action Center preview.',
      blocked_fields: [
        'founder_secret',
        'password',
        'api_key',
        'private_key',
        'seed_phrase',
        'wallet_private_key',
        'service_role_key',
        'database_password',
        'raw_env_value',
        'external_account_session',
        'connector_token',
        'supabase_access_token',
        'magic_link_url',
        'auth_token',
        'bearer_token',
        'refresh_token',
        'session_cookie',
        'admin_memberships_insert_sql',
        'admin_membership_insert_approval',
        'live_supabase_write_approval',
        'live_supabase_write',
        'live_supabase_change_approval',
        'deploy_account_approval',
        'deploy_setting_change_approval',
        'public_url_share_approval',
        'tester_invite_approval',
        'public_beta_approval',
        'week_two_live_approval',
        'app_store_submission_approval',
        'play_console_submission_approval',
        'public_release_approval',
        'payment_or_loan_action_approval',
        'escrow_release_approval',
        'stablecoin_settlement_approval',
        'token_collateral_lock_approval',
        'xpr_signature',
        'xpr_signature_approval',
        'provider_commitment',
        'legal_or_provider_decision',
        'legal_decision',
        'production_approval',
        'external_send_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.founder_action_center],
    },
    {
      id: 'founder_handoff_today',
      title: 'Founder handoff today',
      storage_scope: 'server_readonly_metadata',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'handoff_item_count',
        'handoff_state_counts',
        'required_report_fields',
        'blocked_live_actions',
        'evidence_source',
        'next_safe_action',
        'owner',
        'no_secret_requested',
        'no_live_supabase_write_attempted',
        'no_external_account_change_attempted',
        'no_public_file_edit_attempted',
        'no_public_url_share_attempted',
        'no_tester_invite_attempted',
        'no_live_finance_action_attempted',
        'no_legal_provider_decision_attempted',
        'no_production_release_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No founder secrets, Magic Link URLs, Auth tokens, raw founder notes, live Supabase writes, admin membership approvals, deploy approvals, public URL-share approvals, tester-invite approvals, public file replacement approvals, legal/provider decisions, payment data, wallet data, server storage, external sends, or live-action approvals are exported from this founder handoff today preview.',
      blocked_fields: [
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'raw_founder_notes',
        'founder_secret',
        'auth_user_id',
        'admin_membership_approval',
        'admin_memberships_insert_approval',
        'strict_rls_apply_approval',
        'live_supabase_write_approval',
        'deploy_approval',
        'public_url_share_approval',
        'tester_invite_approval',
        'public_file_replacement_approval',
        'public_index_html_replacement_approval',
        'provider_commitment',
        'legal_or_provider_decision',
        'legal_decision',
        'payment_data',
        'wallet_data',
        'payment_or_wallet_data',
        'xpr_signature',
        'public_beta_approval',
        'production_approval',
        'external_send_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.founder_handoff_today],
    },
    {
      id: 'week_one_closeout_handoff',
      title: 'Week 1 closeout handoff',
      storage_scope: 'server_readonly_metadata',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'closeout_item_count',
        'closeout_state_counts',
        'completed_evidence',
        'required_report_fields',
        'blocked_live_actions',
        'evidence_source',
        'next_safe_action',
        'owner',
        'no_secret_requested',
        'no_live_supabase_write_attempted',
        'no_external_account_change_attempted',
        'no_deploy_setting_change_attempted',
        'no_public_file_edit_attempted',
        'no_public_url_share_attempted',
        'no_tester_invite_attempted',
        'no_live_finance_action_attempted',
        'no_legal_provider_decision_attempted',
        'no_production_release_attempted',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No founder secrets, Magic Link URLs, Auth tokens, raw founder notes, live Supabase writes, admin membership approvals, deploy approvals, public URL-share approvals, tester-invite approvals, public file replacement approvals, legal/provider decisions, payment data, wallet data, XPR signatures, server storage, external sends, or live-action approvals are exported from this Week 1 closeout handoff preview.',
      blocked_fields: [
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'raw_founder_notes',
        'founder_secret',
        'auth_user_id',
        'admin_membership_approval',
        'admin_memberships_insert_approval',
        'strict_rls_apply_approval',
        'live_supabase_write_approval',
        'deploy_approval',
        'deploy_setting_change_approval',
        'production_env_var_value',
        'supabase_redirect_update_approval',
        'public_url_share_approval',
        'tester_invite_approval',
        'public_file_replacement_approval',
        'public_index_html_replacement_approval',
        'provider_commitment',
        'legal_or_provider_decision',
        'legal_decision',
        'payment_data',
        'wallet_data',
        'payment_or_wallet_data',
        'stablecoin_settlement_approval',
        'token_collateral_lock_approval',
        'xpr_signature',
        'public_beta_approval',
        'production_approval',
        'external_send_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.week_one_closeout_handoff],
    },
    {
      id: 'investor_founder_package_readiness',
      title: 'Investor/founder package readiness',
      storage_scope: 'server_readonly_metadata',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'readiness_item_count',
        'readiness_state_counts',
        'package_scope',
        'required_artifacts',
        'required_report_fields',
        'blocked_claims',
        'required_phrase',
        'blocked_live_actions',
        'evidence_source',
        'next_safe_action',
        'owner',
        'no_secret_requested',
        'no_external_send_attempted',
        'no_public_file_edit_attempted',
        'no_public_url_share_attempted',
        'no_deploy_setting_change_attempted',
        'no_live_finance_action_attempted',
        'no_legal_provider_decision_attempted',
        'no_production_release_attempted',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No founder secrets, recipient names, private recipient contact data, investor notes, Magic Link URLs, Auth tokens, raw founder notes, live Supabase writes, external sends, deck/PDF/email/social publication approvals, public URL-share approvals, provider commitments, legal/provider decisions, payment data, wallet data, XPR signatures, server storage, or live-action approvals are exported from this investor/founder package readiness preview.',
      blocked_fields: [
        'recipient_name',
        'recipient_email',
        'recipient_phone',
        'private_investor_notes',
        'provider_contact',
        'attorney_contact',
        'magic_link_url',
        'auth_token',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'raw_founder_notes',
        'founder_secret',
        'external_send_approval',
        'investor_outreach_approval',
        'grant_submission_approval',
        'partner_outreach_approval',
        'provider_commitment',
        'legal_or_provider_decision',
        'legal_decision',
        'deck_publication_approval',
        'pdf_publication_approval',
        'email_campaign_approval',
        'social_post_approval',
        'public_claim_approval',
        'public_url_share_approval',
        'production_approval',
        'payment_data',
        'wallet_data',
        'payment_or_wallet_data',
        'xpr_signature',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.investor_founder_package_readiness],
    },
    {
      id: 'founder_live_blocker_handoff_pack',
      title: 'Founder live blocker handoff pack',
      storage_scope: 'server_readonly_metadata',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'blocker_item_count',
        'blocker_group_count',
        'founder_review_state',
        'required_report_fields',
        'blocked_live_actions',
        'next_safe_action',
        'owner',
        'no_secret_requested',
        'no_live_supabase_write_attempted',
        'no_external_account_change_attempted',
        'no_deploy_setting_change_attempted',
        'no_public_file_edit_attempted',
        'no_public_url_share_attempted',
        'no_tester_invite_attempted',
        'no_live_finance_action_attempted',
        'no_legal_provider_decision_attempted',
        'no_xpr_signature_attempted',
        'no_production_release_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No founder secrets, Magic Link URLs, Auth tokens, raw founder notes, private IDs, live Supabase writes, admin membership approvals, deploy approvals, public URL-share approvals, tester-invite approvals, public file replacement approvals, legal/provider decisions, payment data, wallet data, XPR signatures, XPR registration approvals, server storage, external sends, or live-action approvals are exported from this founder live blocker handoff pack preview.',
      blocked_fields: [
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'private_identifier',
        'raw_founder_notes',
        'founder_secret',
        'auth_user_id',
        'admin_membership_approval',
        'admin_memberships_insert_approval',
        'strict_rls_apply_approval',
        'live_supabase_write_approval',
        'deploy_approval',
        'deploy_setting_change_approval',
        'public_url_share_approval',
        'tester_invite_approval',
        'public_file_replacement_approval',
        'public_index_html_replacement_approval',
        'provider_commitment',
        'legal_or_provider_decision',
        'legal_decision',
        'payment_data',
        'wallet_data',
        'payment_or_wallet_data',
        'stablecoin_settlement_approval',
        'token_collateral_lock_approval',
        'xpr_signature',
        'xpr_registration_approval',
        'public_beta_approval',
        'production_approval',
        'external_send_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.founder_live_blocker_handoff_pack],
    },
    {
      id: 'traditional_first_public_copy_validation_history',
      title: 'Traditional-first public copy validation history',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'request_id_header',
        'validation_type',
        'issue_count',
        'issue_ids',
        'missing_required_field_count',
        'present_required_field_count',
        'copy_character_count',
        'copy_line_count',
        'no_public_copy_storage',
        'no_public_website_edit_attempted',
        'no_external_send_attempted',
        'no_external_provider_claim_attempted',
        'no_public_beta_flip_attempted',
        'public_copy_validation_metadata_history_only',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No raw public copy drafts, issue excerpts, secrets, payment data, identity data, provider/legal decisions, public beta approvals, production approvals, external sends, or live-action approvals are stored in this history.',
      blocked_fields: [
        'raw_public_copy_draft',
        'public_copy_draft',
        'copy_text',
        'issue_excerpt',
        'safe_excerpt',
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'payment_data',
        'identity_data',
        'payment_or_wallet_data',
        'provider_commitment',
        'legal_or_provider_decision',
        'legal_decision',
        'public_beta_approval',
        'production_approval',
        'external_send_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.traditional_first_public_copy_validation_history],
    },
    {
      id: 'homepage_publication_decision_validation_history',
      title: 'Homepage publication decision validation history',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'homepage_publication_decision_validation_metadata_history_only',
        'request_id_header',
        'validation_type',
        'accepted_phrase_count',
        'missing_recommended_phrase_count',
        'publication_go_detected',
        'requires_founder_review',
        'issue_count',
        'issue_ids',
        'input_limit_warning_count',
        'no_decision_text_storage',
        'no_public_replacement_attempted',
        'no_public_homepage_edit_attempted',
        'no_public_whitepaper_edit_attempted',
        'no_deploy_attempted',
        'no_deploy_setting_change_attempted',
        'no_url_share_attempted',
        'no_public_url_share_attempted',
        'no_tester_invite_attempted',
        'no_public_beta_flip_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No raw founder decision text, PUBLICATION_GO text, issue excerpts, secrets, payment data, identity data, provider/legal decisions, public replacement approvals, deploy approvals, URL-share approvals, tester-invite approvals, production approvals, external sends, or live-action approvals are stored in this history.',
      blocked_fields: [
        'raw_founder_decision_text',
        'decision_text',
        'founder_decision_text',
        'publication_go_text',
        'issue_excerpt',
        'safe_excerpt',
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'secret',
        'payment_data',
        'identity_data',
        'payment_or_wallet_data',
        'public_replacement_approval',
        'deploy_approval',
        'url_share_approval',
        'tester_invite_approval',
        'provider_submission',
        'provider_commitment',
        'legal_or_provider_decision',
        'legal_decision',
        'production_approval',
        'external_send_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.homepage_publication_decision_validation_history],
    },
    {
      id: 'homepage_publication_evidence_checklist',
      title: 'Homepage publication evidence checklist',
      storage_scope: 'server_readonly_metadata',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'checklist_item_count',
        'evidence_state_counts',
        'required_before_values',
        'required_evidence_count',
        'viewport_guard_present',
        'required_browser_viewports',
        'no_public_homepage_edit_attempted',
        'no_public_whitepaper_edit_attempted',
        'no_deploy_setting_change_attempted',
        'no_public_url_share_attempted',
        'no_tester_invite_attempted',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No public replacement approval, PUBLICATION_GO approval text, raw founder notes, screenshot files, deploy approvals, URL-share approvals, tester-invite approvals, legal/provider decisions, payment data, wallet data, server storage, external sends, or live-action approvals are exported from this homepage publication evidence checklist preview.',
      blocked_fields: [
        'public_replacement_approval',
        'publication_go_approval',
        'publication_go_text',
        'raw_founder_notes',
        'raw_browser_screenshot',
        'screenshot_file',
        'deploy_approval',
        'url_share_approval',
        'tester_invite_approval',
        'provider_commitment',
        'legal_or_provider_decision',
        'legal_decision',
        'payment_data',
        'wallet_data',
        'payment_or_wallet_data',
        'public_beta_approval',
        'production_approval',
        'external_send_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.homepage_publication_evidence_checklist],
    },
    {
      id: 'homepage_publication_sequence_gate',
      title: 'Homepage publication sequence gate',
      storage_scope: 'server_readonly_metadata',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'sequence_gate_count',
        'gate_state_counts',
        'required_decisions',
        'required_decision_count',
        'required_evidence',
        'required_evidence_count',
        'next_safe_actions',
        'next_safe_action_count',
        'evidence_sources',
        'evidence_source_count',
        'blocked_live_actions',
        'blocked_live_action_count',
        'no_public_homepage_edit_attempted',
        'no_public_whitepaper_edit_attempted',
        'no_deploy_setting_change_attempted',
        'no_public_url_share_attempted',
        'no_tester_invite_attempted',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No PUBLICATION_GO approval text, public replacement approval, copy direction approval, exact file replacement approval, deploy setup approval, URL-share approval, tester-invite approval, raw founder notes, raw homepage copy, final copy approvals, screenshot files, legal/provider decisions, payment data, wallet data, server storage, external sends, or live-action approvals are exported from this homepage publication sequence gate preview.',
      blocked_fields: [
        'publication_go_approval',
        'publication_go_text',
        'copy_direction_approval',
        'public_replacement_approval',
        'public_file_replacement_approval',
        'public_index_html_replacement_approval',
        'public_whitepaper_edit_approval',
        'exact_file_replacement_approval',
        'deploy_setup_approval',
        'deploy_approval',
        'deploy_setting_change_approval',
        'url_smoke_approval',
        'url_share_approval',
        'public_url_share_approval',
        'tester_invite_approval',
        'public_beta_invite_approval',
        'final_copy_approval',
        'raw_founder_notes',
        'raw_homepage_copy',
        'raw_browser_screenshot',
        'screenshot_file',
        'provider_commitment',
        'legal_or_provider_decision',
        'legal_decision',
        'payment_data',
        'wallet_data',
        'payment_or_wallet_data',
        'real_loan_approval',
        'escrow_release_approval',
        'stablecoin_settlement_approval',
        'token_collateral_lock_approval',
        'public_beta_approval',
        'production_approval',
        'external_send_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.homepage_publication_sequence_gate],
    },
    {
      id: 'homepage_publication_review_packet',
      title: 'Homepage publication review packet',
      storage_scope: 'server_readonly_metadata',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'packet_state',
        'founder_question',
        'safe_public_promise',
        'required_decisions',
        'required_decision_count',
        'required_evidence_sources',
        'required_evidence_source_count',
        'blocked_public_claims',
        'blocked_public_claim_count',
        'blocked_live_actions',
        'blocked_live_action_count',
        'no_public_homepage_edit_attempted',
        'no_public_whitepaper_edit_attempted',
        'no_deploy_setting_change_attempted',
        'no_public_url_share_attempted',
        'no_tester_invite_attempted',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No PUBLICATION_GO approval text, public replacement approval, raw founder notes, raw homepage copy, final copy approvals, public claim approvals, deploy/share/invite approvals, legal/provider decisions, payment data, wallet data, server storage, external sends, or live-action approvals are exported from this homepage publication review packet preview.',
      blocked_fields: [
        'publication_go_approval',
        'publication_go_text',
        'copy_direction_approval',
        'public_replacement_approval',
        'public_file_replacement_approval',
        'public_index_html_replacement_approval',
        'public_whitepaper_edit_approval',
        'final_copy_approval',
        'public_claim_approval',
        'raw_founder_notes',
        'raw_homepage_copy',
        'raw_browser_screenshot',
        'screenshot_file',
        'deploy_approval',
        'deploy_setting_change_approval',
        'url_share_approval',
        'public_url_share_approval',
        'tester_invite_approval',
        'provider_commitment',
        'legal_or_provider_decision',
        'legal_decision',
        'payment_data',
        'wallet_data',
        'payment_or_wallet_data',
        'real_loan_approval',
        'escrow_release_approval',
        'stablecoin_settlement_approval',
        'token_collateral_lock_approval',
        'public_beta_approval',
        'production_approval',
        'external_send_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.homepage_publication_review_packet],
    },
    {
      id: 'homepage_static_asset_candidate',
      title: 'Homepage static asset candidate',
      storage_scope: 'server_readonly_metadata',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'static_candidate_count',
        'candidate_state',
        'source_file',
        'validator',
        'evidence_source',
        'asset_posture',
        'asset_posture_count',
        'browser_evidence',
        'browser_evidence_count',
        'current_blocker',
        'next_safe_action',
        'qa_caveat',
        'blocked_live_actions',
        'no_public_homepage_edit_attempted',
        'no_public_whitepaper_edit_attempted',
        'no_deploy_setting_change_attempted',
        'no_public_url_share_attempted',
        'no_tester_invite_attempted',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No PUBLICATION_GO approval text, public replacement approval, raw founder notes, raw HTML/CSS contents, screenshot files, external asset upload approvals, deploy/share/invite approvals, legal/provider decisions, payment data, wallet data, server storage, external sends, or live-action approvals are exported from this homepage static asset candidate preview.',
      blocked_fields: [
        'publication_go_approval',
        'publication_go_text',
        'public_replacement_approval',
        'public_file_replacement_approval',
        'public_index_html_replacement_approval',
        'public_whitepaper_edit_approval',
        'raw_founder_notes',
        'raw_homepage_html',
        'raw_html_contents',
        'raw_css_contents',
        'raw_browser_screenshot',
        'screenshot_file',
        'external_asset_upload_approval',
        'external_asset_url',
        'tailwind_cdn_approval',
        'google_fonts_approval',
        'aos_asset_approval',
        'archive_execution_approval',
        'deploy_approval',
        'deploy_setting_change_approval',
        'url_share_approval',
        'public_url_share_approval',
        'tester_invite_approval',
        'provider_commitment',
        'legal_or_provider_decision',
        'legal_decision',
        'payment_data',
        'wallet_data',
        'payment_or_wallet_data',
        'real_loan_approval',
        'escrow_release_approval',
        'stablecoin_settlement_approval',
        'token_collateral_lock_approval',
        'public_beta_approval',
        'production_approval',
        'external_send_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.homepage_static_asset_candidate],
    },
    {
      id: 'homepage_publication_decision_summary',
      title: 'Homepage publication decision summary',
      storage_scope: 'server_readonly_metadata',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'summary_state',
        'current_candidate',
        'recommended_founder_response',
        'recommended_founder_response_count',
        'current_public_state',
        'ready_local_evidence',
        'ready_local_evidence_count',
        'remaining_blockers',
        'remaining_blocker_count',
        'next_safe_actions',
        'next_safe_action_count',
        'source_docs',
        'source_doc_count',
        'blocked_live_actions',
        'no_public_homepage_edit_attempted',
        'no_public_whitepaper_edit_attempted',
        'no_deploy_setting_change_attempted',
        'no_public_url_share_attempted',
        'no_tester_invite_attempted',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No PUBLICATION_GO approval text, public replacement approval, raw founder notes, final copy approvals, screenshot files, deploy/share/invite approvals, legal/provider decisions, payment data, wallet data, server storage, external sends, or live-action approvals are exported from this homepage publication decision summary preview.',
      blocked_fields: [
        'publication_go_approval',
        'publication_go_text',
        'public_replacement_approval',
        'public_file_replacement_approval',
        'public_index_html_replacement_approval',
        'public_whitepaper_edit_approval',
        'final_copy_approval',
        'raw_founder_notes',
        'raw_homepage_copy',
        'raw_browser_screenshot',
        'screenshot_file',
        'deploy_approval',
        'deploy_setting_change_approval',
        'url_share_approval',
        'public_url_share_approval',
        'tester_invite_approval',
        'provider_commitment',
        'legal_or_provider_decision',
        'legal_decision',
        'payment_data',
        'wallet_data',
        'payment_or_wallet_data',
        'real_loan_approval',
        'escrow_release_approval',
        'stablecoin_settlement_approval',
        'token_collateral_lock_approval',
        'public_beta_approval',
        'production_approval',
        'external_send_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.homepage_publication_decision_summary],
    },
    {
      id: 'homepage_publication_final_qa_hold',
      title: 'Homepage final QA hold',
      storage_scope: 'server_readonly_metadata',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'final_qa_hold_item_count',
        'hold_state_counts',
        'candidate_file',
        'public_target_file',
        'whitepaper_target_file',
        'publication_allowed',
        'required_before_publication_go',
        'already_prepared_local_evidence_count',
        'source_docs',
        'blocked_live_actions',
        'no_public_homepage_edit_attempted',
        'no_public_whitepaper_edit_attempted',
        'no_archive_execution_attempted',
        'no_deploy_setting_change_attempted',
        'no_public_url_share_attempted',
        'no_tester_invite_attempted',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No PUBLICATION_GO approval text, public replacement approval, raw founder notes, screenshot files, archive execution approvals, deploy/share/invite approvals, legal/provider decisions, payment data, wallet data, server storage, external sends, or live-action approvals are exported from this homepage final QA hold preview.',
      blocked_fields: [
        'public_replacement_approval',
        'publication_go_approval',
        'publication_go_text',
        'raw_founder_notes',
        'raw_browser_screenshot',
        'screenshot_file',
        'archive_execution_approval',
        'archive_file_write_approval',
        'public_file_replacement_approval',
        'public_index_html_replacement_approval',
        'public_whitepaper_edit_approval',
        'deploy_approval',
        'deploy_setting_change_approval',
        'url_share_approval',
        'public_url_share_approval',
        'tester_invite_approval',
        'provider_commitment',
        'legal_or_provider_decision',
        'legal_decision',
        'payment_data',
        'wallet_data',
        'payment_or_wallet_data',
        'stablecoin_settlement_approval',
        'token_collateral_lock_approval',
        'public_beta_approval',
        'production_approval',
        'external_send_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.homepage_publication_final_qa_hold],
    },
    {
      id: 'beta_finance_contract_reviewer_note_validation_history',
      title: 'Beta finance/contract reviewer note validation history',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'validation_type',
        'issue_count',
        'missing_required_field_count',
        'present_required_field_count',
        'note_character_count',
        'note_line_count',
        'no_reviewer_note_storage',
        'reviewer_note_validation_metadata_history_only',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No raw reviewer notes, issue excerpts, secrets, payment data, identity data, signed contract text, XPR signatures, provider/legal decisions, public beta approvals, production approvals, external sends, or live-action approvals are stored in this history.',
      blocked_fields: [
        'raw_reviewer_note',
        'note_text',
        'reviewer_note',
        'issue_excerpt',
        'safe_excerpt',
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'payment_or_wallet_data',
        'identity_data',
        'signed_contract_text',
        'xpr_signature',
        'legal_or_provider_decision',
        'public_beta_approval',
        'production_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.beta_finance_contract_reviewer_note_validation_history],
    },
    {
      id: 'beta_finance_contract_live_confusion_validation_history',
      title: 'Beta finance/contract live-confusion validation history',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'request_id_header',
        'validation_type',
        'issue_count',
        'missing_required_field_count',
        'present_required_field_count',
        'note_character_count',
        'note_line_count',
        'no_live_confusion_note_storage',
        'no_public_beta_flip',
        'no_external_followup',
        'live_confusion_validation_metadata_history_only',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No raw live-confusion notes, issue excerpts, secrets, payment data, identity data, signed contract text, XPR signatures, provider/legal decisions, public beta approvals, external follow-up approvals, production approvals, external sends, or live-action approvals are stored in this history.',
      blocked_fields: [
        'raw_live_confusion_note',
        'live_confusion_note',
        'confusion_note',
        'note_text',
        'live_confusion_issue_excerpt',
        'issue_excerpt',
        'safe_excerpt',
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'payment_data',
        'identity_data',
        'signed_contract_text',
        'xpr_signature',
        'stablecoin_settlement',
        'token_collateral_lock',
        'payment_or_wallet_data',
        'provider_submission',
        'provider_commitment',
        'legal_or_provider_decision',
        'legal_decision',
        'external_followup_approval',
        'public_beta_approval',
        'production_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.beta_finance_contract_live_confusion_validation_history],
    },
    {
      id: 'beta_finance_contract_session_safety_validation_history',
      title: 'Beta finance/contract session-safety validation history',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'request_id_header',
        'validation_type',
        'issue_count',
        'missing_required_field_count',
        'present_required_field_count',
        'note_character_count',
        'note_line_count',
        'no_session_safety_note_storage',
        'no_external_followup_attempted',
        'no_public_beta_flip',
        'session_safety_validation_metadata_history_only',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No raw session-safety notes, issue excerpts, secrets, payment data, identity data, signed contract text, XPR signatures, stablecoin settlement approvals, token collateral approvals, provider/legal decisions, public beta approvals, external follow-up approvals, production approvals, external sends, or live-action approvals are stored in this history.',
      blocked_fields: [
        'raw_session_safety_note',
        'session_safety_note',
        'note_text',
        'session_safety_issue_excerpt',
        'issue_excerpt',
        'safe_excerpt',
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'payment_data',
        'identity_data',
        'signed_contract_text',
        'xpr_signature',
        'stablecoin_settlement_approval',
        'token_collateral_approval',
        'payment_or_wallet_data',
        'provider_commitment',
        'legal_or_provider_decision',
        'legal_decision',
        'external_followup_approval',
        'public_beta_approval',
        'production_approval',
        'external_send_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.beta_finance_contract_session_safety_validation_history],
    },
    {
      id: 'beta_finance_contract_safe_handoff_report_history',
      title: 'Beta finance/contract safe handoff report history',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'request_id_header',
        'history_scope',
        'storage_mode',
        'report_code',
        'summary_state',
        'source_counts',
        'required_source_count',
        'safe_request_id_count',
        'safe_request_ids',
        'latest_status_parts',
        'blocked_live_actions',
        'blocked_live_action_count',
        'safe_handoff_report_metadata_history_only',
        'no_copyable_markdown_storage',
        'no_raw_note_storage',
        'no_issue_excerpt_storage',
        'no_server_storage_attempted',
        'no_external_followup_attempted',
        'no_external_export_attempted',
        'no_public_beta_flip_attempted',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No copyable markdown, raw notes, issue excerpts, secrets, payment data, identity data, signed contract text, XPR signatures, stablecoin approvals, token collateral approvals, provider/legal decisions, public beta approvals, production approvals, external sends, server storage, or live-action approvals are stored in this history.',
      blocked_fields: [
        'copyable_markdown',
        'markdown',
        'raw_notes',
        'raw_reviewer_note',
        'raw_live_confusion_note',
        'raw_session_safety_note',
        'note_text',
        'draft_text',
        'issue_excerpts',
        'issue_excerpt',
        'safe_excerpt',
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'payment_data',
        'identity_data',
        'signed_contract_text',
        'xpr_signature',
        'stablecoin_approval',
        'stablecoin_settlement_approval',
        'token_collateral_approval',
        'payment_or_wallet_data',
        'provider_approval',
        'provider_commitment',
        'legal_or_provider_decision',
        'legal_decision',
        'public_beta_approval',
        'production_approval',
        'external_send_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.beta_finance_contract_safe_handoff_report_history],
    },
    {
      id: 'job_fit_snapshot_history',
      title: 'Job fit snapshot history',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'request_id_header',
        'selected_job_id',
        'job_trade',
        'contractor_trade',
        'fit_score',
        'factor_count',
        'job_fit_snapshot_metadata_history_only',
        'no_real_lead_routing_history_stored',
        'no_live_matching_action_attempted',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No raw job details, real lead routing history, contractor assignment approvals, live matching actions, external sends, server storage, or live-action approvals are stored in this history.',
      blocked_fields: [
        'raw_job_details',
        'raw_job_description',
        'job_description',
        'raw_lead',
        'lead_routing_history',
        'real_lead_routing',
        'real_lead_routing_approval',
        'contractor_assignment',
        'contractor_assignment_approval',
        'live_matching_action',
        'live_matching_approval',
        'signed_contract_creation',
        'escrow_start',
        'live_license_verification',
        'credit_or_loan_decision',
        'payment_or_token_action',
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'payment_or_wallet_data',
        'identity_data',
        'signed_contract_text',
        'xpr_signature',
        'legal_or_provider_decision',
        'external_send_approval',
        'public_beta_approval',
        'production_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.job_fit_snapshot_history],
    },
    {
      id: 'bid_readiness_comparison_history',
      title: 'Bid readiness comparison history',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'request_id_header',
        'selected_job_id',
        'bid_id',
        'bid_amount_usd',
        'timeline_days',
        'contractor_rating',
        'readiness_score',
        'factor_count',
        'bid_readiness_comparison_metadata_history_only',
        'no_winning_bid_history_stored',
        'no_live_selection_action_attempted',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No raw bid details, winning bid selection history, contractor assignment approvals, live selection actions, external sends, server storage, or live-action approvals are stored in this history.',
      blocked_fields: [
        'raw_bid_details',
        'raw_bid_message',
        'bid_message',
        'raw_bid_notes',
        'bid_notes',
        'winning_bid_history',
        'winning_bid_selection',
        'winning_bid_approval',
        'contractor_assignment',
        'contractor_assignment_approval',
        'live_selection_action',
        'live_selection_approval',
        'signed_contract_creation',
        'escrow_start',
        'live_license_verification',
        'credit_or_loan_decision',
        'payment_or_token_action',
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'payment_or_wallet_data',
        'identity_data',
        'signed_contract_text',
        'xpr_signature',
        'legal_or_provider_decision',
        'external_send_approval',
        'public_beta_approval',
        'production_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.bid_readiness_comparison_history],
    },
    {
      id: 'dispute_evidence_review_packet_history',
      title: 'Dispute evidence review packet history',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'request_id_header',
        'source_mode',
        'packet_section_count',
        'redaction_attestation_field_count',
        'blocked_live_action_count',
        'dispute_evidence_review_packet_metadata_history_only',
        'no_server_storage_attempted',
        'no_dispute_review_packet_content_stored',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No dispute evidence packet sections, markdown previews, redaction attestation values, raw evidence, peer review details, secrets, payment data, wallet data, provider submissions, legal decisions, liability decisions, escrow releases, refund issues, payment movements, payment routing approvals, Auth/RLS changes, or production approvals are stored in this dispute evidence review packet history.',
      blocked_fields: [
        'packet_sections',
        'copyable_markdown',
        'redaction_attestation',
        'redaction_attestation_values',
        'raw_packet_content',
        'packet_markdown',
        'markdown_preview',
        'raw_evidence',
        'evidence_body',
        'peer_review_details',
        'raw_peer_review',
        'raw_media',
        'photo_url',
        'video_url',
        'private_identifier',
        'address',
        'payment_data',
        'wallet_data',
        'wallet_address',
        'payment_or_wallet_data',
        'provider_submission',
        'provider_commitment',
        'legal_decision',
        'legal_or_provider_decision',
        'liability_decision',
        'escrow_release',
        'refund_issue',
        'payment_movement',
        'payment_routing',
        'payment_routing_approval',
        'auth_rls_change',
        'production_release',
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'signed_contract_text',
        'xpr_signature',
        'external_send_approval',
        'public_beta_approval',
        'production_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.dispute_evidence_review_packet_history],
    },
    {
      id: 'milestone_evidence_review_packet_history',
      title: 'Milestone evidence review packet history',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'request_id_header',
        'source_mode',
        'packet_section_count',
        'redaction_attestation_field_count',
        'blocked_live_action_count',
        'milestone_evidence_review_packet_metadata_history_only',
        'no_server_storage_attempted',
        'no_milestone_review_packet_content_stored',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No milestone evidence packet sections, markdown previews, redaction attestation values, raw evidence, secrets, payment data, wallet data, provider submissions, legal decisions, milestone approvals, escrow releases, payment movements, repayment routing approvals, stablecoin settlements, token collateral locks, Auth/RLS changes, or production approvals are stored in this milestone evidence review packet history.',
      blocked_fields: [
        'packet_sections',
        'copyable_markdown',
        'redaction_attestation',
        'redaction_attestation_values',
        'raw_packet_content',
        'packet_markdown',
        'markdown_preview',
        'raw_evidence',
        'evidence_body',
        'raw_media',
        'photo_url',
        'video_url',
        'private_identifier',
        'address',
        'payment_data',
        'wallet_data',
        'wallet_address',
        'payment_or_wallet_data',
        'provider_submission',
        'provider_commitment',
        'legal_decision',
        'legal_or_provider_decision',
        'milestone_acceptance',
        'milestone_approval',
        'escrow_release',
        'refund_issue',
        'payment_movement',
        'repayment_routing',
        'repayment_routing_approval',
        'stablecoin_settlement',
        'token_collateral_lock',
        'auth_rls_change',
        'production_release',
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'signed_contract_text',
        'xpr_signature',
        'external_send_approval',
        'public_beta_approval',
        'production_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.milestone_evidence_review_packet_history],
    },
    {
      id: 'working_capital_review_packet_history',
      title: 'Working capital review packet history',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'request_id_header',
        'source_mode',
        'packet_section_count',
        'redaction_attestation_field_count',
        'blocked_live_action_count',
        'working_capital_review_packet_metadata_history_only',
        'no_server_storage_attempted',
        'no_working_capital_review_packet_content_stored',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No working-capital review packet sections, markdown previews, redaction attestation values, contractor identity data, project contract details, repayment waterfall details, funding approval evidence, secrets, payment data, wallet data, provider submissions, legal decisions, credit approvals, contractor funding actions, loan originations, payment movements, repayment routing approvals, escrow releases, stablecoin settlements, token collateral locks, Auth/RLS changes, or production approvals are stored in this working-capital review packet history.',
      blocked_fields: [
        'packet_sections',
        'copyable_markdown',
        'redaction_attestation',
        'redaction_attestation_values',
        'raw_packet_content',
        'packet_markdown',
        'markdown_preview',
        'contractor_identity_data',
        'project_contract_details',
        'repayment_waterfall',
        'repayment_waterfall_details',
        'funding_approval',
        'funding_approval_evidence',
        'credit_approval',
        'contractor_funding',
        'loan_origination',
        'raw_evidence',
        'raw_media',
        'private_identifier',
        'tax_id',
        'address',
        'payment_data',
        'wallet_data',
        'wallet_address',
        'payment_or_wallet_data',
        'provider_submission',
        'provider_commitment',
        'legal_decision',
        'legal_or_provider_decision',
        'payment_movement',
        'repayment_routing',
        'repayment_routing_approval',
        'escrow_release',
        'stablecoin_settlement',
        'token_collateral_lock',
        'auth_rls_change',
        'production_release',
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'signed_contract_text',
        'xpr_signature',
        'external_send_approval',
        'public_beta_approval',
        'production_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.working_capital_review_packet_history],
    },
    {
      id: 'contractor_reputation_review_packet_history',
      title: 'Contractor reputation review packet history',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'request_id_header',
        'source_mode',
        'packet_section_count',
        'redaction_attestation_field_count',
        'blocked_live_action_count',
        'contractor_reputation_review_packet_metadata_history_only',
        'no_server_storage_attempted',
        'no_contractor_reputation_review_packet_content_stored',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No contractor reputation packet sections, markdown previews, redaction attestation values, raw media, raw evidence, secrets, payment data, wallet data, provider submissions, legal decisions, public score approvals, contractor rankings, credit approvals, credit denials, adverse-action outputs, contractor assignments, Auth/RLS changes, or production approvals are stored in this contractor reputation review packet history.',
      blocked_fields: [
        'packet_sections',
        'copyable_markdown',
        'redaction_attestation',
        'redaction_attestation_values',
        'raw_packet_content',
        'packet_markdown',
        'markdown_preview',
        'raw_media',
        'raw_evidence',
        'evidence_body',
        'photo_url',
        'video_url',
        'private_identifier',
        'address',
        'payment_data',
        'wallet_data',
        'wallet_address',
        'payment_or_wallet_data',
        'provider_submission',
        'provider_commitment',
        'legal_decision',
        'legal_or_provider_decision',
        'public_score_approval',
        'contractor_ranking',
        'credit_approval',
        'credit_denial',
        'adverse_action_output',
        'contractor_assignment',
        'real_lead_routing',
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'signed_contract_text',
        'xpr_signature',
        'auth_rls_change',
        'production_release',
        'external_send_approval',
        'public_beta_approval',
        'production_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.contractor_reputation_review_packet_history],
    },
    {
      id: 'contractor_verification_review_packet_history',
      title: 'Contractor verification review packet history',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'request_id_header',
        'source_mode',
        'packet_section_count',
        'redaction_attestation_field_count',
        'blocked_live_action_count',
        'contractor_verification_review_packet_metadata_history_only',
        'no_server_storage_attempted',
        'no_contractor_verification_review_packet_content_stored',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No contractor verification packet sections, markdown previews, redaction attestation values, raw evidence, secrets, payment data, wallet data, provider submissions, legal decisions, eligibility approvals, eligibility denials, real lead routing, Auth/RLS changes, or production approvals are stored in this contractor verification review packet history.',
      blocked_fields: [
        'packet_sections',
        'copyable_markdown',
        'redaction_attestation',
        'redaction_attestation_values',
        'raw_packet_content',
        'packet_markdown',
        'markdown_preview',
        'raw_evidence',
        'evidence_body',
        'raw_media',
        'photo_url',
        'video_url',
        'private_identifier',
        'license_number',
        'insurance_policy_number',
        'tax_id',
        'ein',
        'address',
        'payment_data',
        'wallet_data',
        'wallet_address',
        'payment_or_wallet_data',
        'provider_submission',
        'provider_commitment',
        'provider_packet',
        'kyb_kyc_lookup',
        'legal_decision',
        'legal_or_provider_decision',
        'eligibility_approval',
        'eligibility_denial',
        'contractor_verification_approval',
        'contractor_verification_denial',
        'real_lead_routing',
        'contractor_assignment',
        'auth_rls_change',
        'auth_role_change',
        'production_release',
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'signed_contract_text',
        'xpr_signature',
        'external_send_approval',
        'public_beta_approval',
        'production_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.contractor_verification_review_packet_history],
    },
    {
      id: 'readiness_overview_review_packet_history',
      title: 'Admin readiness overview review packet history',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'request_id_header',
        'source_mode',
        'selected_surface_filter',
        'readiness_surface_count',
        'review_queue_item_count',
        'blocked_review_queue_count',
        'packet_section_count',
        'redaction_attestation_field_count',
        'blocked_live_action_count',
        'readiness_overview_review_packet_metadata_history_only',
        'no_server_storage_attempted',
        'no_admin_readiness_overview_review_packet_content_stored',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No readiness overview packet sections, markdown previews, redaction attestation values, raw evidence, secrets, payment data, wallet data, provider submissions, legal decisions, credit approvals, escrow releases, Auth/RLS changes, or production approvals are stored in this readiness overview review packet history.',
      blocked_fields: [
        'packet_sections',
        'copyable_markdown',
        'redaction_attestation',
        'redaction_attestation_values',
        'raw_packet_content',
        'packet_markdown',
        'markdown_preview',
        'raw_evidence',
        'evidence_body',
        'raw_media',
        'photo_url',
        'video_url',
        'private_identifier',
        'address',
        'payment_data',
        'wallet_data',
        'wallet_address',
        'payment_or_wallet_data',
        'provider_submission',
        'provider_commitment',
        'provider_packet',
        'legal_decision',
        'legal_or_provider_decision',
        'credit_approval',
        'contractor_funding',
        'loan_origination',
        'escrow_release',
        'refund_issue',
        'payment_movement',
        'repayment_routing',
        'stablecoin_settlement',
        'token_collateral_lock',
        'auth_rls_change',
        'auth_role_change',
        'production_release',
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'signed_contract_text',
        'xpr_signature',
        'external_send_approval',
        'public_beta_approval',
        'production_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.readiness_overview_review_packet_history],
    },
    {
      id: 'provider_evidence_packet_history',
      title: 'Provider evidence packet history',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'request_id_header',
        'selected_surface_filter',
        'packet_section_count',
        'redaction_check_count',
        'blocked_readiness_check_count',
        'blocked_live_action_count',
        'safe_report_field_count',
        'provider_submission',
        'external_packet_send',
        'live_provider_lookup',
        'legal_decision',
        'money_movement',
        'auth_rls_change',
        'production_release',
        'provider_packet_metadata_history_only',
        'no_server_storage_attempted',
        'no_provider_evidence_packet_content_stored',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No packet sections, markdown previews, redaction findings, raw evidence, secrets, payment data, wallet data, provider submissions, legal decisions, credit approvals, escrow releases, Auth/RLS changes, or production approvals are stored in this history.',
      blocked_fields: [
        'packet_sections',
        'copyable_markdown',
        'copyable_markdown_preview',
        'redaction_checklist',
        'redaction_findings',
        'redaction_finding_details',
        'raw_packet_content',
        'packet_markdown',
        'markdown_preview',
        'raw_evidence',
        'evidence_body',
        'raw_media',
        'photo_url',
        'video_url',
        'private_identifier',
        'address',
        'payment_data',
        'wallet_data',
        'wallet_address',
        'payment_or_wallet_data',
        'provider_submission',
        'provider_commitment',
        'provider_packet',
        'legal_decision',
        'legal_or_provider_decision',
        'credit_approval',
        'escrow_release',
        'refund_issue',
        'payment_movement',
        'auth_rls_change',
        'auth_role_change',
        'production_release',
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'signed_contract_text',
        'xpr_signature',
        'external_send_approval',
        'public_beta_approval',
        'production_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.provider_evidence_packet_history],
    },
    {
      id: 'provider_evidence_packet_print_template_history',
      title: 'Provider evidence packet print template history',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'request_id_header',
        'selected_surface_filter',
        'print_template_section_count',
        'redaction_attestation_count',
        'blocked_live_action_count',
        'safe_report_field_count',
        'external_send',
        'provider_submission',
        'live_provider_lookup',
        'provider_commitment',
        'legal_decision',
        'credit_approval',
        'escrow_release',
        'payment_movement',
        'auth_rls_change',
        'production_release',
        'provider_print_template_metadata_history_only',
        'no_server_storage_attempted',
        'no_provider_print_template_content_stored',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No print template sections, markdown previews, redaction attestations, raw packet content, secrets, payment data, wallet data, provider submissions, legal decisions, credit approvals, escrow releases, Auth/RLS changes, or production approvals are stored in this print template history.',
      blocked_fields: [
        'print_template_sections',
        'copyable_markdown',
        'copyable_markdown_preview',
        'redaction_attestation',
        'redaction_attestation_values',
        'raw_packet_content',
        'packet_markdown',
        'markdown_preview',
        'raw_evidence',
        'evidence_body',
        'raw_media',
        'photo_url',
        'video_url',
        'private_identifier',
        'address',
        'payment_data',
        'wallet_data',
        'wallet_address',
        'payment_or_wallet_data',
        'provider_submission',
        'provider_commitment',
        'provider_packet',
        'legal_decision',
        'legal_or_provider_decision',
        'credit_approval',
        'escrow_release',
        'refund_issue',
        'payment_movement',
        'auth_rls_change',
        'auth_role_change',
        'production_release',
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'signed_contract_text',
        'xpr_signature',
        'external_send_approval',
        'public_beta_approval',
        'production_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.provider_evidence_packet_print_template_history],
    },
    {
      id: 'provider_evidence_packet_redaction_qa_history',
      title: 'Provider evidence packet redaction QA history',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'request_id_header',
        'selected_surface_filter',
        'redaction_finding_count',
        'review_required_finding_count',
        'forbidden_phrase_matched_count',
        'finding_ids_requiring_review_count',
        'print_template_status',
        'print_template_section_count',
        'blocked_live_action_count',
        'local_redaction_qa',
        'blocked_external_use',
        'external_send',
        'provider_submission',
        'live_provider_lookup',
        'legal_decision',
        'credit_approval',
        'escrow_release',
        'payment_movement',
        'auth_rls_change',
        'production_release',
        'provider_redaction_qa_metadata_history_only',
        'no_server_storage_attempted',
        'no_provider_redaction_qa_content_stored',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No redaction finding details, matched terms, forbidden phrase source text, markdown previews, print template sections, redaction attestations, raw packet content, secrets, payment data, wallet data, provider submissions, legal decisions, credit approvals, escrow releases, Auth/RLS changes, or production approvals are stored in this redaction QA history.',
      blocked_fields: [
        'redaction_findings',
        'redaction_finding_details',
        'matched_terms',
        'forbidden_phrase_source_text',
        'finding_ids_requiring_review',
        'print_template_sections',
        'copyable_markdown',
        'copyable_markdown_preview',
        'redaction_attestation',
        'redaction_attestation_values',
        'raw_packet_content',
        'packet_markdown',
        'markdown_preview',
        'raw_evidence',
        'evidence_body',
        'raw_media',
        'photo_url',
        'video_url',
        'private_identifier',
        'address',
        'payment_data',
        'wallet_data',
        'wallet_address',
        'payment_or_wallet_data',
        'provider_submission',
        'provider_commitment',
        'provider_packet',
        'legal_decision',
        'legal_or_provider_decision',
        'credit_approval',
        'escrow_release',
        'refund_issue',
        'payment_movement',
        'auth_rls_change',
        'auth_role_change',
        'production_release',
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'signed_contract_text',
        'xpr_signature',
        'external_send_approval',
        'public_beta_approval',
        'production_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.provider_evidence_packet_redaction_qa_history],
    },
    {
      id: 'provider_evidence_review_chain_history',
      title: 'Provider evidence review chain history',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'request_id_header',
        'source_mode',
        'selected_surface_filter',
        'chain_step_count',
        'blocked_live_action_count',
        'local_review_chain',
        'packet_review',
        'print_template_review',
        'redaction_qa_review',
        'server_storage',
        'external_send',
        'provider_submission',
        'live_provider_lookup',
        'provider_commitment',
        'legal_decision',
        'credit_approval',
        'escrow_release',
        'payment_movement',
        'auth_rls_change',
        'production_release',
        'provider_review_chain_metadata_history_only',
        'no_server_storage_attempted',
        'no_provider_review_chain_content_stored',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No provider review chain step details, packet sections, print template sections, redaction finding details, matched terms, markdown previews, redaction attestations, raw evidence, secrets, payment data, wallet data, provider submissions, legal decisions, credit approvals, escrow releases, Auth/RLS changes, production approvals, external sends, or live-action approvals are stored in this provider review chain history.',
      blocked_fields: [
        'review_chain_steps',
        'chain_steps',
        'chain_step_details',
        'packet_sections',
        'print_template_sections',
        'copyable_markdown',
        'copyable_markdown_preview',
        'redaction_attestation',
        'redaction_attestation_values',
        'redaction_findings',
        'redaction_finding_details',
        'matched_terms',
        'forbidden_phrase_source_text',
        'raw_packet_content',
        'packet_markdown',
        'markdown_preview',
        'raw_evidence',
        'evidence_body',
        'raw_media',
        'photo_url',
        'video_url',
        'private_identifier',
        'address',
        'payment_data',
        'wallet_data',
        'wallet_address',
        'payment_or_wallet_data',
        'provider_submission',
        'provider_commitment',
        'provider_packet',
        'legal_decision',
        'legal_or_provider_decision',
        'credit_approval',
        'escrow_release',
        'refund_issue',
        'payment_movement',
        'auth_rls_change',
        'auth_role_change',
        'production_release',
        'external_send',
        'external_review_chain_send',
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'signed_contract_text',
        'xpr_signature',
        'external_send_approval',
        'public_beta_approval',
        'production_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.provider_evidence_review_chain_history],
    },
    {
      id: 'smart_contract_local_replay_dry_run_history',
      title: 'Smart contract local replay dry-run history',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'request_id_header',
        'source_mode',
        'selected_category_filter',
        'scenario_bundle_id',
        'replay_id_present',
        'replay_packet_request_id_present',
        'dry_run_step_count',
        'pass_local_only_step_count',
        'review_required_step_count',
        'helper_category_count',
        'helper_export_count',
        'demo_fixture_count',
        'local_replay_review_route_count',
        'blocked_live_action_count',
        'local_dry_run',
        'server_storage',
        'live_replay_execution',
        'xpr_contract_deployment',
        'xpr_signature_request',
        'payment_movement',
        'real_loan_approval',
        'escrow_release',
        'repayment_routing',
        'stablecoin_settlement',
        'token_collateral_lock',
        'provider_commitment',
        'legal_decision',
        'production_release',
        'smart_contract_local_replay_dry_run_metadata_history_only',
        'no_server_storage_attempted',
        'no_smart_contract_local_replay_dry_run_content_stored',
        'no_live_replay_action_attempted',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No local replay dry-run step details, helper exports, demo fixtures, evidence packet sections, handoff summary sections, workbench card details, raw smart-contract helper payloads, secrets, signatures, payment data, loan approvals, escrow releases, repayment routing approvals, stablecoin settlements, token collateral locks, provider commitments, legal decisions, production approvals, external sends, or live-action approvals are stored in this smart contract local replay dry-run history.',
      blocked_fields: [
        'dry_run_steps',
        'dry_run_step_details',
        'helper_exports',
        'helper_export_details',
        'demo_fixtures',
        'fixture_payloads',
        'local_replay_routes',
        'evidence_packet_sections',
        'packet_sections',
        'copyable_markdown',
        'markdown_preview',
        'handoff_summary_sections',
        'handoff_summary_markdown',
        'workbench_card_details',
        'workbench_cards',
        'review_gate_rows',
        'gate_matrix_rows',
        'raw_smart_contract_helper_payloads',
        'raw_helper_payload',
        'raw_contract_replay_payload',
        'scenario_payload',
        'replay_payload',
        'secrets',
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'signed_contract_text',
        'xpr_signature',
        'xpr_signature_request',
        'signature_request',
        'payment_data',
        'wallet_data',
        'wallet_address',
        'payment_or_wallet_data',
        'payment_movement',
        'real_payment_movement',
        'loan_approval',
        'real_loan_approval',
        'escrow_release',
        'repayment_routing_approval',
        'stablecoin_settlement',
        'token_collateral_lock',
        'provider_commitment',
        'provider_submission',
        'legal_decision',
        'legal_or_provider_decision',
        'production_release',
        'external_send',
        'external_send_approval',
        'public_beta_approval',
        'production_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.smart_contract_local_replay_dry_run_history],
    },
    {
      id: 'smart_contract_local_replay_dry_run_evidence_packet_history',
      title: 'Smart contract local replay dry-run evidence packet history',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'request_id_header',
        'source_mode',
        'source_dry_run_mode',
        'selected_category_filter',
        'scenario_bundle_id',
        'replay_id_present',
        'packet_section_count',
        'copyable_markdown_ready',
        'copyable_markdown_stored',
        'redaction_attestation_field_count',
        'redaction_attestation_values_stored',
        'dry_run_step_count',
        'pass_local_only_step_count',
        'review_required_step_count',
        'helper_category_count',
        'local_replay_review_route_count',
        'blocked_live_action_count',
        'local_packet_review',
        'server_storage',
        'external_send',
        'live_replay_execution',
        'xpr_contract_deployment',
        'xpr_signature_request',
        'payment_movement',
        'real_loan_approval',
        'escrow_release',
        'repayment_routing',
        'stablecoin_settlement',
        'token_collateral_lock',
        'provider_commitment',
        'legal_decision',
        'production_release',
        'smart_contract_local_replay_dry_run_evidence_packet_metadata_history_only',
        'no_server_storage_attempted',
        'no_dry_run_packet_content_stored',
        'no_live_replay_action_attempted',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No dry-run packet sections, markdown previews, redaction attestation values, local replay dry-run step details, helper exports, demo fixtures, workbench card details, handoff summary sections, raw smart-contract helper payloads, secrets, signatures, payment data, loan approvals, escrow releases, repayment routing approvals, stablecoin settlements, token collateral locks, provider commitments, legal decisions, production approvals, external sends, or live-action approvals are stored in this smart contract local replay dry-run evidence packet history.',
      blocked_fields: [
        'packet_sections',
        'dry_run_packet_sections',
        'packet_section_details',
        'copyable_markdown',
        'copyable_markdown_preview',
        'markdown_preview',
        'redaction_attestation',
        'redaction_attestation_values',
        'redaction_findings',
        'dry_run_steps',
        'dry_run_step_details',
        'helper_exports',
        'helper_export_details',
        'demo_fixtures',
        'fixture_payloads',
        'local_replay_routes',
        'workbench_card_details',
        'workbench_cards',
        'handoff_summary_sections',
        'handoff_summary_markdown',
        'review_gate_rows',
        'gate_matrix_rows',
        'raw_smart_contract_helper_payloads',
        'raw_helper_payload',
        'raw_contract_replay_payload',
        'raw_packet_content',
        'packet_markdown',
        'scenario_payload',
        'replay_payload',
        'secrets',
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'signed_contract_text',
        'xpr_signature',
        'xpr_signature_request',
        'signature_request',
        'payment_data',
        'wallet_data',
        'wallet_address',
        'payment_or_wallet_data',
        'payment_movement',
        'real_payment_movement',
        'loan_approval',
        'real_loan_approval',
        'escrow_release',
        'repayment_routing_approval',
        'stablecoin_settlement',
        'token_collateral_lock',
        'provider_commitment',
        'provider_submission',
        'legal_decision',
        'legal_or_provider_decision',
        'production_release',
        'external_send',
        'external_send_approval',
        'public_beta_approval',
        'production_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.smart_contract_local_replay_dry_run_evidence_packet_history],
    },
    {
      id: 'smart_contract_review_workbench_history',
      title: 'Smart contract review workbench history',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'request_id_header',
        'source_mode',
        'selected_category_filter',
        'scenario_bundle_id',
        'workbench_card_count',
        'helper_category_count',
        'helper_export_count',
        'demo_fixture_count',
        'dry_run_step_count',
        'evidence_packet_section_count',
        'review_gate_status',
        'local_review_route_count',
        'blocked_live_action_count',
        'local_workbench_review',
        'server_storage',
        'live_replay_execution',
        'xpr_contract_deployment',
        'xpr_signature_request',
        'payment_movement',
        'real_loan_approval',
        'escrow_release',
        'repayment_routing',
        'stablecoin_settlement',
        'token_collateral_lock',
        'provider_commitment',
        'legal_decision',
        'production_release',
        'smart_contract_review_workbench_metadata_history_only',
        'no_server_storage_attempted',
        'no_smart_contract_review_workbench_content_stored',
        'no_live_replay_action_attempted',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No workbench card details, helper exports, demo fixtures, dry-run step details, evidence packet sections, handoff summary sections, raw smart-contract helper payloads, secrets, signatures, payment data, loan approvals, escrow releases, repayment routing approvals, stablecoin settlements, token collateral locks, provider commitments, legal decisions, production approvals, external sends, or live-action approvals are stored in this smart contract review workbench history.',
      blocked_fields: [
        'workbench_cards',
        'workbench_card_details',
        'helper_exports',
        'helper_export_details',
        'demo_fixtures',
        'fixture_payloads',
        'dry_run_steps',
        'dry_run_step_details',
        'evidence_packet_sections',
        'packet_sections',
        'packet_section_details',
        'copyable_markdown',
        'markdown_preview',
        'handoff_summary_sections',
        'handoff_summary_markdown',
        'handoff_summary_section_details',
        'review_gate_rows',
        'gate_matrix_rows',
        'local_replay_routes',
        'raw_smart_contract_helper_payloads',
        'raw_helper_payload',
        'raw_contract_replay_payload',
        'raw_packet_content',
        'packet_markdown',
        'scenario_payload',
        'replay_payload',
        'secrets',
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'signed_contract_text',
        'xpr_signature',
        'xpr_signature_request',
        'signature_request',
        'payment_data',
        'wallet_data',
        'wallet_address',
        'payment_or_wallet_data',
        'payment_movement',
        'real_payment_movement',
        'loan_approval',
        'real_loan_approval',
        'escrow_release',
        'repayment_routing_approval',
        'stablecoin_settlement',
        'token_collateral_lock',
        'provider_commitment',
        'provider_submission',
        'legal_decision',
        'legal_or_provider_decision',
        'production_release',
        'external_send',
        'external_send_approval',
        'public_beta_approval',
        'production_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.smart_contract_review_workbench_history],
    },
    {
      id: 'smart_contract_review_workbench_handoff_summary_history',
      title: 'Smart contract review workbench handoff summary history',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'request_id_header',
        'source_mode',
        'source_workbench_mode',
        'selected_category_filter',
        'scenario_bundle_id',
        'handoff_section_count',
        'handoff_summary_section_count',
        'copyable_markdown_ready',
        'copyable_markdown_stored',
        'redaction_attestation_field_count',
        'redaction_attestation_values_stored',
        'workbench_card_count',
        'helper_category_count',
        'helper_export_count',
        'demo_fixture_count',
        'dry_run_step_count',
        'evidence_packet_section_count',
        'blocked_live_action_count',
        'local_handoff_review',
        'local_handoff_summary',
        'server_storage',
        'external_send',
        'live_replay_execution',
        'xpr_contract_deployment',
        'xpr_signature_request',
        'payment_movement',
        'real_loan_approval',
        'escrow_release',
        'repayment_routing',
        'stablecoin_settlement',
        'token_collateral_lock',
        'provider_commitment',
        'legal_decision',
        'production_release',
        'smart_contract_review_workbench_handoff_summary_metadata_history_only',
        'no_server_storage_attempted',
        'no_handoff_summary_content_stored',
        'no_smart_contract_review_workbench_handoff_summary_content_stored',
        'no_live_replay_action_attempted',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No handoff summary section details, markdown previews, redaction attestation values, workbench card details, helper exports, demo fixtures, dry-run step details, evidence packet sections, raw smart-contract helper payloads, secrets, signatures, payment data, loan approvals, escrow releases, repayment routing approvals, stablecoin settlements, token collateral locks, provider commitments, legal decisions, production approvals, external sends, or live-action approvals are stored in this smart contract review workbench handoff summary history.',
      blocked_fields: [
        'handoff_summary_sections',
        'handoff_summary_section_details',
        'handoff_sections',
        'handoff_summary_markdown',
        'copyable_markdown',
        'copyable_markdown_preview',
        'markdown_preview',
        'redaction_attestation',
        'redaction_attestation_values',
        'redaction_findings',
        'workbench_cards',
        'workbench_card_details',
        'helper_exports',
        'helper_export_details',
        'demo_fixtures',
        'fixture_payloads',
        'dry_run_steps',
        'dry_run_step_details',
        'evidence_packet_sections',
        'packet_sections',
        'packet_section_details',
        'review_gate_rows',
        'gate_matrix_rows',
        'local_replay_routes',
        'raw_smart_contract_helper_payloads',
        'raw_helper_payload',
        'raw_contract_replay_payload',
        'raw_packet_content',
        'packet_markdown',
        'scenario_payload',
        'replay_payload',
        'secrets',
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'signed_contract_text',
        'xpr_signature',
        'xpr_signature_request',
        'signature_request',
        'payment_data',
        'wallet_data',
        'wallet_address',
        'payment_or_wallet_data',
        'payment_movement',
        'real_payment_movement',
        'loan_approval',
        'real_loan_approval',
        'escrow_release',
        'repayment_routing_approval',
        'stablecoin_settlement',
        'token_collateral_lock',
        'provider_commitment',
        'provider_submission',
        'legal_decision',
        'legal_or_provider_decision',
        'production_release',
        'external_send',
        'external_send_approval',
        'public_beta_approval',
        'production_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.smart_contract_review_workbench_handoff_summary_history],
    },
    {
      id: 'smart_contract_review_workbench_gate_matrix_history',
      title: 'Smart contract review gate matrix history',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'request_id_header',
        'source_mode',
        'selected_category_filter',
        'gate_matrix_row_count',
        'review_required_row_count',
        'blocked_live_action_count',
        'helper_export_total',
        'dry_run_step_total',
        'handoff_summary_section_total',
        'recommended_review_order_count',
        'local_gate_matrix_review',
        'server_storage',
        'external_send',
        'live_replay_execution',
        'xpr_contract_deployment',
        'xpr_signature_request',
        'payment_movement',
        'real_loan_approval',
        'escrow_release',
        'repayment_routing',
        'stablecoin_settlement',
        'token_collateral_lock',
        'provider_commitment',
        'legal_decision',
        'production_release',
        'smart_contract_review_gate_matrix_metadata_history_only',
        'no_server_storage_attempted',
        'no_gate_matrix_content_stored',
        'no_smart_contract_review_gate_matrix_content_stored',
        'no_live_replay_action_attempted',
        'no_live_action_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No gate matrix row details, review gate row details, recommended review order details, helper exports, demo fixtures, dry-run steps, evidence packet sections, handoff summary sections, raw smart-contract helper payloads, secrets, signatures, payment data, loan approvals, escrow releases, repayment routing approvals, stablecoin settlements, token collateral locks, provider commitments, legal decisions, production approvals, external sends, or live-action approvals are stored in this smart contract review gate matrix history.',
      blocked_fields: [
        'gate_matrix_rows',
        'gate_matrix_row_details',
        'review_gate_rows',
        'review_gate_row_details',
        'recommended_review_order',
        'recommended_review_order_details',
        'local_review_route_set',
        'route_set_details',
        'workbench_endpoint_details',
        'dry_run_endpoint_details',
        'dry_run_packet_endpoint_details',
        'handoff_summary_endpoint_details',
        'helper_exports',
        'helper_export_details',
        'demo_fixtures',
        'fixture_payloads',
        'dry_run_steps',
        'dry_run_step_details',
        'evidence_packet_sections',
        'packet_sections',
        'packet_section_details',
        'handoff_summary_sections',
        'handoff_summary_section_details',
        'workbench_cards',
        'workbench_card_details',
        'raw_smart_contract_helper_payloads',
        'raw_helper_payload',
        'raw_contract_replay_payload',
        'raw_packet_content',
        'scenario_payload',
        'replay_payload',
        'secrets',
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'signed_contract_text',
        'xpr_signature',
        'xpr_signature_request',
        'signature_request',
        'payment_data',
        'wallet_data',
        'wallet_address',
        'payment_or_wallet_data',
        'payment_movement',
        'real_payment_movement',
        'loan_approval',
        'real_loan_approval',
        'escrow_release',
        'repayment_routing_approval',
        'stablecoin_settlement',
        'token_collateral_lock',
        'provider_commitment',
        'provider_submission',
        'legal_decision',
        'legal_or_provider_decision',
        'production_release',
        'external_send',
        'external_send_approval',
        'public_beta_approval',
        'production_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.smart_contract_review_workbench_gate_matrix_history],
    },
    {
      id: 'repayment_allocation_preview_history',
      title: 'Repayment allocation preview history',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'request_id_header',
        'loan_repayment_hold_usd',
        'contractor_remainder_usd',
        'loan_remaining_after_preview_usd',
        'invoice_gap_after_payment_usd',
        'repayment_allocation_preview_metadata_history_only',
        'no_raw_payment_references_stored',
        'no_payment_tx_hashes_stored',
        'no_loan_ids_stored',
        'no_real_repayment_routing_history_stored',
        'no_payment_movement_history_stored',
        'no_escrow_release_history_stored',
        'no_real_repayment_routing_attempted',
        'no_payment_movement_attempted',
        'no_escrow_release_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No raw payment references, payment tx hashes, loan IDs, borrower identity data, payment data, wallet data, repayment routing approvals, escrow release approvals, contractor payout approvals, legal/provider decisions, external sends, server storage, or live-action approvals are stored in this history.',
      blocked_fields: [
        'raw_payment_reference',
        'payment_reference',
        'payment_tx_hash',
        'transaction_hash',
        'tx_hash',
        'loan_id',
        'real_loan_id',
        'borrower_identity_data',
        'contractor_identity_data',
        'payment_data',
        'wallet_data',
        'wallet_address',
        'payment_or_wallet_data',
        'repayment_routing_approval',
        'escrow_release_approval',
        'contractor_payout_approval',
        'loan_approval',
        'real_repayment_routing',
        'real_payment_movement',
        'real_escrow_release',
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'signed_contract_text',
        'xpr_signature',
        'legal_or_provider_decision',
        'external_send_approval',
        'public_beta_approval',
        'production_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.repayment_allocation_preview_history],
    },
    {
      id: 'milestone_acceptance_snapshot_history',
      title: 'Milestone acceptance snapshot history',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'request_id_header',
        'selected_job_id',
        'milestone_id',
        'milestone_title',
        'acceptance_score',
        'factor_count',
        'evidence_count',
        'requested_release_usd',
        'milestone_approval',
        'escrow_release',
        'payment_movement',
        'no_milestone_approval_history_stored',
        'no_escrow_release_history_stored',
        'no_payment_movement_history_stored',
        'no_milestone_approval_attempted',
        'no_escrow_release_attempted',
        'no_payment_movement_attempted',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No raw milestone evidence, milestone approval history, escrow release history, payment movement history, repayment routing approvals, external sends, server storage, or live-action approvals are stored in this history.',
      blocked_fields: [
        'raw_milestone_evidence',
        'raw_evidence',
        'evidence_body',
        'evidence_url',
        'photo_url',
        'video_url',
        'raw_notes',
        'milestone_approval_history',
        'milestone_approval_record',
        'escrow_release_history',
        'escrow_release_record',
        'payment_movement_history',
        'payment_movement_record',
        'repayment_routing',
        'repayment_routing_approval',
        'refund_issue',
        'signed_change_order',
        'raw_payment_reference',
        'payment_reference',
        'payment_tx_hash',
        'transaction_hash',
        'tx_hash',
        'wallet_data',
        'payment_or_wallet_data',
        'provider_submission',
        'legal_or_provider_decision',
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'xpr_signature',
        'external_send_approval',
        'public_beta_approval',
        'production_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.milestone_acceptance_snapshot_history],
    },
    {
      id: 'repayment_readiness_snapshot_history',
      title: 'Repayment readiness snapshot history',
      storage_scope: 'local_browser_only',
      export_scope: 'metadata_only',
      allowed_fields: [
        ...metadataAllowlist,
        'source_request_id',
        'request_id_header',
        'readiness_score',
        'readiness_factors',
        'factor_count',
        'evidence_status',
        'dispute_status',
        'payment_status',
        'demo_only_repayment_readiness_gate',
        'history_boundary',
        'no_raw_payment_references_stored',
        'no_payment_tx_hashes_stored',
        'no_loan_ids_stored',
        'no_repayment_readiness_approvals_stored',
        'no_real_repayment_routing_history_stored',
        'no_payment_movement_history_stored',
        'no_escrow_release_history_stored',
        'no_real_repayment_routing_attempted',
        'no_payment_movement_attempted',
        'no_escrow_release_attempted',
        'repayment_readiness_snapshot_metadata_history_only',
        'raw_content_storage_boundary',
      ],
      raw_content_storage_boundary:
        'No raw payment references, payment tx hashes, loan IDs, borrower identity data, payment data, wallet data, repayment readiness approvals, repayment routing approvals, escrow release approvals, contractor payout approvals, legal/provider decisions, external sends, server storage, or live-action approvals are stored in this history.',
      blocked_fields: [
        'raw_payment_reference',
        'payment_reference',
        'payment_tx_hash',
        'transaction_hash',
        'tx_hash',
        'loan_id',
        'real_loan_id',
        'borrower_identity_data',
        'contractor_identity_data',
        'payment_data',
        'wallet_data',
        'wallet_address',
        'payment_or_wallet_data',
        'repayment_readiness_approval',
        'repayment_routing_approval',
        'escrow_release_approval',
        'contractor_payout_approval',
        'real_repayment_routing',
        'real_payment_movement',
        'real_escrow_release',
        'magic_link_url',
        'bearer_token',
        'service_role_key',
        'raw_env_value',
        'private_url',
        'signed_contract_text',
        'xpr_signature',
        'legal_or_provider_decision',
        'external_send_approval',
        'public_beta_approval',
        'production_approval',
        'live_action_approval',
      ],
      review_targets: [reviewTargetBySource.repayment_readiness_snapshot_history],
    },
  ];
  const selectedSourceFilter = normalizeAdminEvidenceExportSourceFilter(req.query?.source_filter);
  const validSourceFilters = ['all_evidence_sources', ...evidenceSources.map((source) => source.id)];
  const invalidSourceFilter = !validSourceFilters.includes(selectedSourceFilter);
  const selectedEvidenceSources = invalidSourceFilter
    ? []
    : selectedSourceFilter === 'all_evidence_sources'
      ? evidenceSources
      : evidenceSources.filter((source) => source.id === selectedSourceFilter);
  const selectedReviewTargets = selectedEvidenceSources.flatMap((source) => source.review_targets || []);
  const exportGate = {
    local_preview: invalidSourceFilter ? 'blocked' : 'ready',
    local_browser_storage: 'review_only',
    metadata_only: 'required',
    external_send: 'blocked',
    server_storage: 'blocked',
    live_supabase_change: 'blocked',
    admin_membership_insert: 'blocked',
    strict_rls_apply: 'blocked',
    real_money_or_token_action: 'blocked',
    legal_or_provider_commitment: 'blocked',
    production_release: 'blocked',
    reason: 'This preview lists safe local metadata fields before founder handoff. It does not export raw drafts, notes, markdown, secrets, live approvals, payment data, legal/provider decisions, or perform any server storage or live action.',
  };
  const previewSections = [
    {
      id: 'admin_evidence_export_source_filter',
      title: 'Evidence source filter review',
      status: invalidSourceFilter ? 'blocked' : 'ready',
      detail: invalidSourceFilter
        ? `Rejected source_filter "${selectedSourceFilter}". Use only local evidence source filters from valid_source_filters.`
        : `Selected source_filter "${selectedSourceFilter}" for local metadata-only preview.`,
      evidence_required: ['selected_source_filter', 'valid_source_filters', 'no_live_action_attempted'],
    },
    {
      id: 'local_storage_scope_review',
      title: 'Local storage scope review',
      status: 'review_only',
      detail: 'Evidence history remains in browser localStorage as review-only metadata. The preview does not read, upload, persist, or send local browser content.',
      evidence_required: ['local_browser_only', 'metadata_only', 'no_server_storage_attempted'],
    },
    {
      id: 'metadata_allowlist_review',
      title: 'Metadata allowlist review',
      status: 'ready',
      detail: 'Only generated time, request IDs, source surface, safe request IDs, finding counts, section counts, gate summaries, and no-storage/no-live-action booleans are allowed for local founder handoff.',
      evidence_required: ['metadata_allowlist', 'safe_request_ids', 'gate_summary'],
    },
    {
      id: 'blocked_fields_review',
      title: 'Blocked fields review',
      status: 'blocked_for_raw_content',
      detail: 'Raw draft text, notes, copyable markdown, Magic Link URLs, bearer tokens, service-role keys, raw env values, private URLs, payment/wallet data, legal/provider decisions, and live-action approval language stay out of metadata export.',
      evidence_required: ['blocked_fields', 'raw_draft_text', 'copyable_report_markdown'],
    },
    {
      id: 'external_handoff_gate',
      title: 'External handoff gate',
      status: 'blocked',
      detail: 'External send, server storage, live Supabase changes, admin membership insert, strict RLS apply, money/token actions, legal/provider commitments, and production release require separate founder approval.',
      evidence_required: ['export_gate', 'no_live_action_attempted'],
    },
  ];
  const reviewRouter = {
    mode: 'admin_evidence_export_preview_review_router',
    scope: 'local_ui_navigation_only',
    safe_review_router: 'local_ui_navigation_only',
    route_count: selectedReviewTargets.length,
    targets: selectedReviewTargets,
    no_server_storage_attempted: true,
    no_external_export_attempted: true,
    no_live_action_attempted: true,
    blocked_actions: [
      'server_storage',
      'external_export',
      'live_supabase_change',
      'auth_rls_change',
      'money_or_token_action',
      'legal_or_provider_commitment',
      'production_release',
    ],
  };

  return {
    generated_at: generatedAt,
    request_id: req.id || null,
    mode: 'admin_evidence_export_preview',
    status: invalidSourceFilter
      ? 'invalid_source_filter'
      : selectedSourceFilter === 'all_evidence_sources'
        ? 'local_preview_ready'
        : 'local_preview_filtered',
    selected_source_filter: selectedSourceFilter,
    rejected_source_filter: invalidSourceFilter ? selectedSourceFilter : null,
    valid_source_filters: validSourceFilters,
    filtered_evidence_source_count: selectedEvidenceSources.length,
    evidence_sources: selectedEvidenceSources,
    review_router: reviewRouter,
    metadata_allowlist: metadataAllowlist,
    blocked_fields: blockedFields,
    preview_sections: previewSections,
    export_gate: exportGate,
    safe_copy_summary: `admin evidence export preview ${invalidSourceFilter ? 'invalid_source_filter' : 'local_preview_ready'}; source_filter=${selectedSourceFilter}; sources=${selectedEvidenceSources.length}; allowlist=${metadataAllowlist.length}; blocked_fields=${blockedFields.length}; request_id=${req.id || 'pending'}; external send, server storage, and live actions remain blocked.`,
    no_server_storage_attempted: true,
    no_live_action_attempted: true,
    next_safe_steps: [
      'Use the metadata allowlist before copying local evidence summaries into founder notes.',
      'Remove raw drafts, report notes, copyable markdown, secrets, private URLs, payment/wallet data, legal/provider decisions, and live-action approval wording.',
      'Stop before external send, server storage, live Supabase change, admin membership insert, strict RLS apply, money/token action, legal/provider commitment, or production release.',
    ],
  };
}

app.get('/api/admin/admin-evidence-export-preview', (req, res) => {
  const preview = buildAdminEvidenceExportPreview(req);
  res.status(preview.status === 'invalid_source_filter' ? 400 : 200).json(preview);
});

app.get('/api/admin/supabase-boundary', (req, res) => {
  const status = supabaseBoundaryStatus();
  const boundaryChecks = [
    readinessItem(
      'browser_publishable_only_check',
      'Browser publishable-only boundary',
      supabaseAuth ? 'ready' : 'missing',
      supabaseAuth
        ? 'Browser-facing Auth can use only the publishable Supabase client; service-role keys stay server-only.'
        : 'SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY is missing or placeholder, so browser Auth remains local-demo only.'
    ),
    readinessItem(
      'service_role_server_only_check',
      'Service role server-only check',
      supabaseAdmin ? 'ready' : 'review',
      supabaseAdmin
        ? 'Backend has a server-only Supabase admin client for trusted database checks without returning the key.'
        : 'Public beta strict admin/RLS remains blocked until SUPABASE_SERVICE_ROLE_KEY is configured only in backend/deploy secrets.',
      'founder+codex'
    ),
    readinessItem(
      'secret_redaction_check',
      'Secret redaction check',
      'ready',
      'This endpoint reports configured/missing modes only and never returns service-role keys, passwords, bearer tokens, database URLs, or raw env values.'
    ),
    readinessItem(
      'strict_admin_public_beta_gate',
      'Strict admin public beta gate',
      supabaseAdmin ? 'review' : 'blocked',
      supabaseAdmin
        ? 'Service-role boundary is available, but strict admin smoke tests and founder admin membership evidence are still required before public beta.'
        : 'Strict admin public beta is blocked until service-role boundary, founder admin membership, and strict route smoke evidence are ready.',
      'founder+codex'
    ),
    readinessItem(
      'live_supabase_change_block',
      'Live Supabase change block',
      'blocked',
      'No live Supabase migration, RLS apply, admin membership insert, service-role secret update, production deploy setting, or public beta flip is allowed from this endpoint.',
      'founder'
    ),
  ];
  const publicBetaGate = {
    local_demo: supabaseAuth ? 'ready' : 'review',
    strict_admin_public_beta_gate: supabaseAdmin ? 'review' : 'blocked',
    live_supabase_change: 'blocked',
    real_money_data_paths: 'blocked',
    reason: 'Supabase boundary evidence is read-only. Founder approval, real Auth user evidence, admin membership approval, strict smoke tests, and explicit live-change approval are required before public beta or production changes.',
  };

  res.json({
    generated_at: new Date().toISOString(),
    request_id: req.id || null,
    mode: 'supabase_service_role_boundary',
    status,
    summary: readinessSummary(boundaryChecks),
    boundary_checks: boundaryChecks,
    public_beta_gate: publicBetaGate,
    safe_scope: [
      'Secret values are never returned.',
      'Browser code must use only SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.',
      'Server-side trusted database operations prefer SUPABASE_SERVICE_ROLE_KEY when configured.',
      'Publishable fallback is local-demo only and blocks public launch.',
      'This endpoint is read-only and cannot change Supabase Auth, RLS, admin roles, deployment secrets, or production data.',
    ],
    safe_report_fields: {
      auth_client: 'configured/missing only',
      database_client_mode: 'service_role_server_only/publishable_demo_fallback/missing',
      service_role: 'configured_server_only/missing_or_placeholder only',
      strict_admin_public_beta_gate: 'ready/review/blocked',
      request_id: 'safe request ID only',
    },
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
    request_id: req.id || null,
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
    request_id: req.id || null,
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
  const magicLinkValidation = validateMagicLinkInput(req.body);
  if (magicLinkValidation.errors.length) return validationError(res, magicLinkValidation.errors);
  if (!requireSupabaseAuth(res)) return;

  const authMode = process.env.SMARTCONTRACTOR_AUTH_MODE || 'undecided';
  if (authMode !== 'magic_link') {
    return res.status(409).json({
      error: 'Magic Link auth is not enabled yet',
      selected_mode: authMode,
      next_step: 'Founder should approve Magic Link, then set SMARTCONTRACTOR_AUTH_MODE=magic_link in the backend environment.',
      request_id: res.req?.id || null,
    });
  }

  const normalizedEmail = magicLinkValidation.email.trim().toLowerCase();
  const redirectTo = magicLinkValidation.redirectTo;
  const { error } = await supabaseAuth.auth.signInWithOtp({
    email: normalizedEmail,
    options: redirectTo ? { emailRedirectTo: redirectTo } : undefined,
  });
  if (error) return res.status(502).json({ error: error.message, request_id: res.req?.id || null });

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
    request_id: req.id || null,
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
  if (profileError) return databaseError(res, profileError);

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
    if (homeownerResult.error) return databaseError(res, homeownerResult.error);
    if (contractorResult.error) return databaseError(res, contractorResult.error);
    homeowner = homeownerResult.data;
    contractor = contractorResult.data;
  }

  res.json({
    authenticated: true,
    request_id: req.id || null,
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
    request_id: req.id || null,
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
    request_id: req.id || null,
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
  if (error) return databaseError(res, error);
  res.json({ verification_checks: data, request_id: req.id || null });
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

  if (error) return databaseWriteError(res, error);
  await recordAuditEvent({
    actor_type: 'system',
    action: 'verification_check_created',
    entity_type: 'verification_check',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ verification_check: data, request_id: req.id || null });
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

  if (eventError) return databaseWriteError(res, eventError);

  let updatedCheck = null;
  if (verification_check_id && status) {
    const { data, error } = await supabase
      .from('verification_checks')
      .update({ status, provider_reference })
      .eq('id', verification_check_id)
      .select('id,subject_type,subject_id,provider,check_type,status,updated_at')
      .single();
    if (error) return databaseWriteError(res, error);
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

  res.status(202).json({ verification_event: event, verification_check: updatedCheck, request_id: req.id || null });
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
  if (error) return databaseError(res, error);
  res.json({ price_snapshots: data, request_id: req.id || null });
});

app.post('/api/collateral/price-snapshots', async (req, res) => {
  const priceSnapshotValidation = validatePriceSnapshotInput(req.body);
  if (priceSnapshotValidation.errors.length) return validationError(res, priceSnapshotValidation.errors);

  if (!requireSupabase(res)) return;

  const { token_symbol, source, provider_reference, raw_result, price } = priceSnapshotValidation;

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

  if (error) return databaseWriteError(res, error);
  await recordAuditEvent({
    actor_type: 'admin',
    action: 'token_price_snapshot_created',
    entity_type: 'token_price_snapshot',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ price_snapshot: data, request_id: req.id || null });
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
  if (error) return databaseError(res, error);
  res.json({ collateral_locks: data, request_id: req.id || null });
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
    if (snapshotError) return databaseWriteError(res, snapshotError);
    snapshotId = snapshot.id;
  }

  if (snapshotId && effectivePrice === 0) {
    const { data: snapshot, error: snapshotError } = await supabase
      .from('token_price_snapshots')
      .select('price_usd')
      .eq('id', snapshotId)
      .single();
    if (snapshotError) return databaseError(res, snapshotError);
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

  if (error) return databaseWriteError(res, error);
  await recordAuditEvent({
    actor_type: 'contractor',
    actor_id: data.contractor_id,
    action: 'token_collateral_lock_created',
    entity_type: 'token_collateral_lock',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ collateral_lock: data, request_id: req.id || null });
});

// SmartContractor MVP API: jobs, bids, paid bid unlocks, and contractor credit.
app.post('/api/smartcontractor/profiles', async (req, res) => {
  const profileValidationErrors = validateProfileCreateInput(req.body);
  if (profileValidationErrors.length) return validationError(res, profileValidationErrors);

  if (!requireSupabase(res)) return;

  const authResult = await getOptionalAuthenticatedUser(req);
  if (authResult.error) return authError(res, authResult.status, authResult.error);

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

  if (error) return databaseWriteError(res, error);
  await recordAuditEvent({
    actor_type: role,
    actor_id: authResult.user?.id || null,
    action: 'profile_created',
    entity_type: 'profile',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ profile: data, request_id: req.id || null });
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

  if (error) return databaseWriteError(res, error);
  await recordAuditEvent({
    actor_type: 'contractor',
    actor_id: data.id,
    action: 'contractor_created',
    entity_type: 'contractor',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ contractor: data, request_id: req.id || null });
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

  if (error) return databaseWriteError(res, error);
  await recordAuditEvent({
    actor_type: 'homeowner',
    actor_id: data.id,
    action: 'homeowner_created',
    entity_type: 'homeowner',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ homeowner: data, request_id: req.id || null });
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
  if (error) return databaseError(res, error);
  res.json({ jobs: data, request_id: req.id || null });
});

function normalizeFitText(value) {
  return String(value || '').trim().toLowerCase();
}

function numericFitValue(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function booleanFitFlag(value) {
  return ['1', 'true', 'yes', 'y', 'confirmed', 'complete', 'completed'].includes(normalizeFitText(value));
}

const jobFitNumberValidationMessages = {
  budget_min_usd: 'budget_min_usd must be a non-negative finite number',
  budget_max_usd: 'budget_max_usd must be a non-negative finite number',
  available_working_capital_usd: 'available_working_capital_usd must be a non-negative finite number',
};
const jobFitRatingValidationMessage = 'contractor_rating must be a number from 0 to 5';
const jobFitBudgetOrderValidationMessage = 'budget_max_usd must be greater than or equal to budget_min_usd';

function validateJobFitNonNegativeNumber(query, fieldName, errors, maxValue = 10000000) {
  const value = query?.[fieldName];
  if (value === undefined || value === null || value === '') return;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    errors.push(jobFitNumberValidationMessages[fieldName] || `${fieldName} must be a non-negative finite number`);
    return;
  }
  if (number > maxValue) {
    errors.push(`${fieldName} must be ${maxValue} or less`);
  }
}

function validateJobFitSnapshotQuery(query = {}) {
  const errors = [];

  validateOptionalString(query.job_id, 'job_id', errors, 120);
  validateOptionalString(query.job_trade, 'job_trade', errors, 80);
  validateOptionalString(query.trade, 'trade', errors, 80);
  validateOptionalString(query.job_state, 'job_state', errors, 40);
  validateOptionalString(query.location_state, 'location_state', errors, 40);
  validateOptionalString(query.job_zip, 'job_zip', errors, 20);
  validateOptionalString(query.location_zip, 'location_zip', errors, 20);
  validateOptionalString(query.contractor_trade, 'contractor_trade', errors, 80);
  validateOptionalString(query.contractor_state, 'contractor_state', errors, 40);
  validateOptionalString(query.license_state, 'license_state', errors, 40);
  validateOptionalString(query.contractor_zip, 'contractor_zip', errors, 20);
  validateJobFitNonNegativeNumber(query, 'budget_min_usd', errors);
  validateJobFitNonNegativeNumber(query, 'budget_max_usd', errors);
  validateJobFitNonNegativeNumber(query, 'available_working_capital_usd', errors);

  const contractorRatingRaw = query.contractor_rating;
  if (contractorRatingRaw !== undefined && contractorRatingRaw !== null && contractorRatingRaw !== '') {
    const contractorRating = Number(contractorRatingRaw);
    if (!Number.isFinite(contractorRating) || contractorRating < 0 || contractorRating > 5) {
      errors.push(jobFitRatingValidationMessage);
    }
  }

  const budgetMinRaw = query.budget_min_usd;
  const budgetMaxRaw = query.budget_max_usd;
  if (budgetMinRaw !== undefined && budgetMinRaw !== null && budgetMinRaw !== '' && budgetMaxRaw !== undefined && budgetMaxRaw !== null && budgetMaxRaw !== '') {
    const budgetMin = Number(budgetMinRaw);
    const budgetMax = Number(budgetMaxRaw);
    if (Number.isFinite(budgetMin) && Number.isFinite(budgetMax) && budgetMax < budgetMin) {
      errors.push(jobFitBudgetOrderValidationMessage);
    }
  }

  return errors;
}

function jobFitSnapshotValidationError(res, errors) {
  return res.status(400).json({
    error: 'Validation failed',
    mode: 'job_fit_snapshot_validation_error',
    details: Array.isArray(errors) ? errors : [errors],
    request_id: res.req?.id || null,
    demo_only_matching_gate: {
      real_lead_routing: 'blocked',
      contractor_assignment: 'blocked',
      signed_contract_creation: 'blocked',
      escrow_start: 'blocked',
      live_license_verification: 'blocked',
      credit_or_loan_decision: 'blocked',
      payment_or_token_action: 'blocked',
      legal_or_provider_commitment: 'blocked',
      production_release: 'blocked',
      reason: 'The request failed local preflight validation. It cannot route real leads, assign contractors, verify licensing, approve credit, start escrow, move money, trigger token actions, make legal/provider commitments, or release production features.',
    },
    safe_copy_summary: 'Job fit snapshot validation failed; no real lead routing, contractor assignment, matching, payment, legal/provider, or production action was attempted.',
    no_real_lead_routing_attempted: true,
    no_contractor_assignment_attempted: true,
    no_live_matching_action_attempted: true,
    no_live_action_attempted: true,
  });
}

const milestoneAcceptanceIntegerValidationMessages = {
  evidence_count: 'evidence_count must be a non-negative finite integer',
  photo_count: 'photo_count must be a non-negative finite integer',
  video_count: 'video_count must be a non-negative finite integer',
  note_count: 'note_count must be a non-negative finite integer',
};

const milestoneAcceptanceNumberValidationMessages = {
  requested_release_usd: 'requested_release_usd must be a non-negative finite number',
};
const milestoneAcceptanceWorkStatusValidationMessage = 'work_status must be one of: submitted, approved, completed, needs_rework';
const milestoneAcceptancePaymentStatusValidationMessage = 'payment_status must be one of: funded, not_funded, released, disputed';
const repaymentAllocationPositiveNumberMessage = 'milestone_payment_usd must be a positive finite number';
const repaymentAllocationNonNegativeNumberMessages = {
  loan_outstanding_usd: 'loan_outstanding_usd must be a non-negative finite number',
  contractor_invoice_usd: 'contractor_invoice_usd must be a non-negative finite number',
};
const repaymentReadinessEvidenceStatusValidationMessage = 'evidence_status must be one of: missing, partial, submitted, verified';
const repaymentReadinessDisputeStatusValidationMessage = 'dispute_status must be one of: none, open, unresolved';
const repaymentReadinessPaymentStatusValidationMessage = 'payment_status must be one of: not_funded, funded, disputed, released';

function validateMilestoneAcceptanceNonNegativeInteger(query, fieldName, errors, maxValue = 1000) {
  const value = query?.[fieldName];
  if (value === undefined || value === null || value === '') return;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || !Number.isInteger(number)) {
    errors.push(milestoneAcceptanceIntegerValidationMessages[fieldName] || `${fieldName} must be a non-negative finite integer`);
    return;
  }
  if (number > maxValue) {
    errors.push(`${fieldName} must be ${maxValue} or less`);
  }
}

function validateMilestoneAcceptanceNonNegativeNumber(query, fieldName, errors, maxValue = 1000000) {
  const value = query?.[fieldName];
  if (value === undefined || value === null || value === '') return;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    errors.push(milestoneAcceptanceNumberValidationMessages[fieldName] || `${fieldName} must be a non-negative finite number`);
    return;
  }
  if (number > maxValue) {
    errors.push(`${fieldName} must be ${maxValue} or less`);
  }
}

function validateMilestoneAcceptanceSnapshotQuery(query = {}) {
  const errors = [];
  const allowedWorkStatuses = ['submitted', 'approved', 'completed', 'needs_rework'];
  const allowedPaymentStatuses = ['funded', 'not_funded', 'released', 'disputed'];
  const allowedBooleanValues = ['1', '0', 'true', 'false', 'yes', 'no', 'y', 'n', 'confirmed', 'complete', 'completed'];

  validateOptionalString(query.job_id, 'job_id', errors, 120);
  validateOptionalString(query.milestone_id, 'milestone_id', errors, 120);
  validateOptionalString(query.milestone_title, 'milestone_title', errors, 160);
  validateOptionalString(query.title, 'title', errors, 160);
  validateOptionalString(query.scope_summary, 'scope_summary', errors, 500);
  validateOptionalString(query.description, 'description', errors, 500);
  validateMilestoneAcceptanceNonNegativeInteger(query, 'evidence_count', errors);
  validateMilestoneAcceptanceNonNegativeInteger(query, 'photo_count', errors);
  validateMilestoneAcceptanceNonNegativeInteger(query, 'video_count', errors);
  validateMilestoneAcceptanceNonNegativeInteger(query, 'note_count', errors);
  validateMilestoneAcceptanceNonNegativeNumber(query, 'requested_release_usd', errors);

  const workStatus = normalizeFitText(query.work_status || 'submitted');
  const paymentStatus = normalizeFitText(query.payment_status || 'funded');
  if (query.work_status !== undefined && query.work_status !== null && query.work_status !== '' && !allowedWorkStatuses.includes(workStatus)) {
    errors.push(milestoneAcceptanceWorkStatusValidationMessage);
  }
  if (query.payment_status !== undefined && query.payment_status !== null && query.payment_status !== '' && !allowedPaymentStatuses.includes(paymentStatus)) {
    errors.push(milestoneAcceptancePaymentStatusValidationMessage);
  }

  for (const fieldName of ['homeowner_confirms_visible_work', 'contractor_reports_complete', 'dispute_open']) {
    const value = query?.[fieldName];
    if (value !== undefined && value !== null && value !== '') {
      const normalizedValue = normalizeFitText(value);
      if (!allowedBooleanValues.includes(normalizedValue)) {
        errors.push(`${fieldName} must be one of: yes, no, true, false, 1, 0`);
      }
    }
  }

  return errors;
}

function milestoneAcceptanceSnapshotValidationError(res, errors) {
  return res.status(400).json({
    error: 'Validation failed',
    mode: 'milestone_acceptance_snapshot_validation_error',
    details: Array.isArray(errors) ? errors : [errors],
    request_id: res.req?.id || null,
    demo_only_acceptance_gate: {
      milestone_approval: 'blocked',
      escrow_release: 'blocked',
      payment_movement: 'blocked',
      repayment_routing: 'blocked',
      signed_change_order: 'blocked',
      legal_liability_decision: 'blocked',
      provider_commitment: 'blocked',
      production_release: 'blocked',
      reason: 'The request failed local preflight validation. It cannot approve milestones, release escrow, move payments, route repayment, sign change orders, make legal/provider commitments, or release production features.',
    },
    safe_copy_summary: 'Milestone acceptance snapshot validation failed; no milestone approval, escrow release, payment movement, repayment routing, legal/provider, or production action was attempted.',
    no_milestone_approval_attempted: true,
    no_escrow_release_attempted: true,
    no_payment_movement_attempted: true,
    no_live_action_attempted: true,
  });
}

function validateRepaymentAllocationPreviewQuery(query = {}) {
  const errors = [];
  const milestonePayment = Number(query.milestone_payment_usd);
  if (!Number.isFinite(milestonePayment) || milestonePayment <= 0) {
    errors.push(repaymentAllocationPositiveNumberMessage);
  }

  for (const fieldName of ['loan_outstanding_usd', 'contractor_invoice_usd']) {
    const value = query?.[fieldName];
    if (value === undefined || value === null || value === '') continue;
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0) {
      errors.push(repaymentAllocationNonNegativeNumberMessages[fieldName]);
    }
  }

  return errors;
}

function repaymentAllocationPreviewValidationError(res, errors) {
  return res.status(400).json({
    error: 'Validation failed',
    mode: 'repayment_allocation_preview_validation_error',
    details: Array.isArray(errors) ? errors : [errors],
    request_id: res.req?.id || null,
    demo_only_repayment_allocation_gate: {
      repayment_routing: 'blocked',
      payment_movement: 'blocked',
      escrow_release: 'blocked',
      loan_approval: 'blocked',
      contractor_payout: 'blocked',
      legal_or_provider_decision: 'blocked',
      reason: 'The request failed local preflight validation. It cannot route repayment, move payment, release escrow, pay contractors, approve loans, or make legal/provider decisions.',
    },
    safe_copy_summary: 'Repayment allocation preview validation failed; no repayment routing, payment movement, escrow release, contractor payout, loan approval, or live action was attempted.',
    history_boundary: {
      mode: 'repayment_allocation_preview_history',
      scope: 'local_history_only',
      storage: 'browser_localStorage_only',
      retention: 'last_five_metadata_only',
      storage_mode: 'repayment_allocation_preview_metadata_history_only',
      metadata_only: true,
      raw_payment_references: 'not_stored',
      payment_tx_hashes: 'not_stored',
      loan_ids: 'not_stored',
      borrower_identity_data: 'not_stored',
      payment_data: 'not_stored',
      wallet_data: 'not_stored',
      repayment_routing_approvals: 'not_stored',
      escrow_release_approvals: 'not_stored',
      contractor_payout_approvals: 'not_stored',
      no_raw_payment_references_stored: true,
      no_payment_tx_hashes_stored: true,
      no_loan_ids_stored: true,
      no_real_repayment_routing_history_stored: true,
      no_payment_movement_history_stored: true,
      no_escrow_release_history_stored: true,
      reason: 'The UI may save only local repayment allocation metadata. It must not store raw payment references, payment tx hashes, loan IDs, borrower identity data, payment data, wallet data, routing approvals, escrow release approvals, payout approvals, or trigger live actions.',
    },
    no_real_repayment_routing_attempted: true,
    no_payment_movement_attempted: true,
    no_escrow_release_attempted: true,
    no_live_action_attempted: true,
  });
}

function validateRepaymentReadinessSnapshotQuery(query = {}) {
  const errors = validateRepaymentAllocationPreviewQuery(query);
  const allowedEvidenceStatuses = ['missing', 'partial', 'submitted', 'verified'];
  const allowedDisputeStatuses = ['none', 'open', 'unresolved'];
  const allowedPaymentStatuses = ['not_funded', 'funded', 'disputed', 'released'];
  const evidenceStatus = normalizeFitText(query.evidence_status || 'submitted');
  const disputeStatus = normalizeFitText(query.dispute_status || 'none');
  const paymentStatus = normalizeFitText(query.payment_status || 'funded');

  if (query.evidence_status !== undefined && query.evidence_status !== null && query.evidence_status !== '' && !allowedEvidenceStatuses.includes(evidenceStatus)) {
    errors.push(repaymentReadinessEvidenceStatusValidationMessage);
  }
  if (query.dispute_status !== undefined && query.dispute_status !== null && query.dispute_status !== '' && !allowedDisputeStatuses.includes(disputeStatus)) {
    errors.push(repaymentReadinessDisputeStatusValidationMessage);
  }
  if (query.payment_status !== undefined && query.payment_status !== null && query.payment_status !== '' && !allowedPaymentStatuses.includes(paymentStatus)) {
    errors.push(repaymentReadinessPaymentStatusValidationMessage);
  }

  return errors;
}

function repaymentReadinessSnapshotValidationError(res, errors) {
  return res.status(400).json({
    error: 'Validation failed',
    mode: 'repayment_readiness_snapshot_validation_error',
    details: Array.isArray(errors) ? errors : [errors],
    request_id: res.req?.id || null,
    demo_only_repayment_readiness_gate: {
      repayment_routing: 'blocked',
      payment_movement: 'blocked',
      escrow_release: 'blocked',
      loan_approval: 'blocked',
      contractor_payout: 'blocked',
      legal_or_provider_decision: 'blocked',
      reason: 'The request failed local preflight validation. It cannot route repayment, move payment, release escrow, pay contractors, approve loans, or make legal/provider decisions.',
    },
    safe_copy_summary: 'Repayment readiness snapshot validation failed; no repayment routing, payment movement, escrow release, contractor payout, loan approval, or live action was attempted.',
    no_real_repayment_routing_attempted: true,
    no_payment_movement_attempted: true,
    no_escrow_release_attempted: true,
    no_live_action_attempted: true,
  });
}

function buildRepaymentAllocationPreview(req) {
  const query = req.query || {};
  const milestonePaymentUsd = numericFitValue(query.milestone_payment_usd, 0);
  const loanOutstandingUsd = Math.max(0, numericFitValue(query.loan_outstanding_usd, 0));
  const contractorInvoiceUsd = Math.max(0, numericFitValue(query.contractor_invoice_usd, milestonePaymentUsd));
  const loanRepaymentHoldUsd = Math.min(milestonePaymentUsd, loanOutstandingUsd);
  const contractorRemainderUsd = Math.max(milestonePaymentUsd - loanRepaymentHoldUsd, 0);
  const loanRemainingAfterPreviewUsd = Math.max(loanOutstandingUsd - loanRepaymentHoldUsd, 0);
  const invoiceGapAfterPaymentUsd = Math.max(contractorInvoiceUsd - milestonePaymentUsd, 0);
  const status = loanOutstandingUsd <= 0
    ? 'contractor_payment_clear_preview'
    : loanRemainingAfterPreviewUsd === 0
      ? 'loan_paid_off_preview'
      : 'partial_loan_repayment_hold_preview';

  return {
    mode: 'repayment_allocation_preview',
    status,
    generated_at: new Date().toISOString(),
    request_id: req.id || null,
    inputs: {
      milestone_payment_usd: milestonePaymentUsd,
      loan_outstanding_usd: loanOutstandingUsd,
      contractor_invoice_usd: contractorInvoiceUsd,
    },
    allocation: {
      loan_repayment_hold_usd: loanRepaymentHoldUsd,
      contractor_remainder_usd: contractorRemainderUsd,
      loan_remaining_after_preview_usd: loanRemainingAfterPreviewUsd,
      invoice_gap_after_payment_usd: invoiceGapAfterPaymentUsd,
    },
    allocation_order: [
      {
        step: 1,
        id: 'loan_repayment_hold_usd',
        label: 'Loan repayment hold preview',
        amount_usd: loanRepaymentHoldUsd,
        status: loanRepaymentHoldUsd > 0 ? 'preview_only_hold' : 'not_required',
      },
      {
        step: 2,
        id: 'contractor_remainder_usd',
        label: 'Contractor remainder preview',
        amount_usd: contractorRemainderUsd,
        status: contractorRemainderUsd > 0 ? 'preview_only_remainder' : 'no_remainder',
      },
    ],
    demo_only_repayment_allocation_gate: {
      repayment_routing: 'blocked',
      payment_movement: 'blocked',
      escrow_release: 'blocked',
      loan_approval: 'blocked',
      contractor_payout: 'blocked',
      legal_or_provider_decision: 'blocked',
      reason: 'This endpoint previews local repayment allocation math only. It cannot route repayment, move payment, release escrow, pay contractors, approve loans, or make legal/provider decisions.',
    },
    history_boundary: {
      mode: 'repayment_allocation_preview_history',
      scope: 'local_history_only',
      storage: 'browser_localStorage_only',
      retention: 'last_five_metadata_only',
      storage_mode: 'repayment_allocation_preview_metadata_history_only',
      metadata_only: true,
      raw_payment_references: 'not_stored',
      payment_tx_hashes: 'not_stored',
      loan_ids: 'not_stored',
      borrower_identity_data: 'not_stored',
      payment_data: 'not_stored',
      wallet_data: 'not_stored',
      repayment_routing_approvals: 'not_stored',
      escrow_release_approvals: 'not_stored',
      contractor_payout_approvals: 'not_stored',
      no_raw_payment_references_stored: true,
      no_payment_tx_hashes_stored: true,
      no_loan_ids_stored: true,
      no_real_repayment_routing_history_stored: true,
      no_payment_movement_history_stored: true,
      no_escrow_release_history_stored: true,
      reason: 'The UI may save only local repayment allocation metadata. It must not store raw payment references, payment tx hashes, loan IDs, borrower identity data, payment data, wallet data, routing approvals, escrow release approvals, payout approvals, or trigger live actions.',
    },
    safe_copy_summary: `repayment allocation preview ${status}; loan_repayment_hold_usd=${loanRepaymentHoldUsd}; contractor_remainder_usd=${contractorRemainderUsd}; real repayment routing and payment movement remain blocked.`,
    no_real_repayment_routing_attempted: true,
    no_payment_movement_attempted: true,
    no_escrow_release_attempted: true,
    no_live_action_attempted: true,
  };
}

function buildRepaymentReadinessSnapshot(req) {
  const query = req.query || {};
  const milestonePaymentUsd = numericFitValue(query.milestone_payment_usd, 0);
  const loanOutstandingUsd = Math.max(0, numericFitValue(query.loan_outstanding_usd, 0));
  const contractorInvoiceUsd = Math.max(0, numericFitValue(query.contractor_invoice_usd, milestonePaymentUsd));
  const evidenceStatus = normalizeFitText(query.evidence_status || 'submitted');
  const disputeStatus = normalizeFitText(query.dispute_status || 'none');
  const paymentStatus = normalizeFitText(query.payment_status || 'funded');
  const readinessFactors = [];

  readinessFactors.push({
    id: 'payment_context',
    label: 'Milestone payment context',
    status: milestonePaymentUsd > 0 ? 'ready' : 'blocked',
    score_contribution: milestonePaymentUsd > 0 ? 20 : 0,
    max_score: 20,
    detail: `milestone_payment_usd=${milestonePaymentUsd}; loan_outstanding_usd=${loanOutstandingUsd}; contractor_invoice_usd=${contractorInvoiceUsd}. Local readiness only; no repayment routing is attempted.`,
  });

  const evidenceScores = {
    verified: 30,
    submitted: 22,
    partial: 12,
    missing: 0,
  };
  readinessFactors.push({
    id: 'evidence_status',
    label: 'Evidence status',
    status: evidenceStatus === 'verified' || evidenceStatus === 'submitted' ? 'ready' : evidenceStatus === 'partial' ? 'review' : 'blocked',
    score_contribution: evidenceScores[evidenceStatus] ?? 0,
    max_score: 30,
    detail: evidenceStatus === 'verified'
      ? 'Milestone evidence is marked verified for local readiness review only.'
      : evidenceStatus === 'submitted'
        ? 'Milestone evidence is submitted and should be reviewed before any future live routing.'
        : evidenceStatus === 'partial'
          ? 'Milestone evidence is partial; keep repayment routing blocked.'
          : 'Milestone evidence is missing; keep repayment routing blocked.',
  });

  const disputeScores = {
    none: 25,
    open: 5,
    unresolved: 0,
  };
  readinessFactors.push({
    id: 'dispute_status',
    label: 'Dispute status',
    status: disputeStatus === 'none' ? 'ready' : disputeStatus === 'open' ? 'review' : 'blocked',
    score_contribution: disputeScores[disputeStatus] ?? 0,
    max_score: 25,
    detail: disputeStatus === 'none'
      ? 'No open dispute is marked in this local snapshot.'
      : disputeStatus === 'open'
        ? 'Open dispute requires local review before any future repayment routing.'
        : 'Unresolved dispute blocks repayment routing, payment movement, and escrow release.',
  });

  const paymentScores = {
    funded: 25,
    released: 15,
    not_funded: 5,
    disputed: 0,
  };
  readinessFactors.push({
    id: 'payment_status',
    label: 'Payment status',
    status: paymentStatus === 'funded' ? 'ready' : paymentStatus === 'released' || paymentStatus === 'not_funded' ? 'review' : 'blocked',
    score_contribution: paymentScores[paymentStatus] ?? 0,
    max_score: 25,
    detail: paymentStatus === 'funded'
      ? 'Milestone payment is marked funded for local review only.'
      : paymentStatus === 'released'
        ? 'Payment is already marked released; verify no duplicate routing before any future live process.'
        : paymentStatus === 'not_funded'
          ? 'Payment is not funded; keep repayment routing blocked.'
          : 'Payment is disputed; keep repayment routing, movement, and escrow release blocked.',
  });

  const readinessScore = readinessFactors.reduce((sum, factor) => sum + Number(factor.score_contribution || 0), 0);
  const status = disputeStatus !== 'none' || paymentStatus === 'disputed' || evidenceStatus === 'missing'
    ? 'blocked_for_repayment_review'
    : readinessScore >= 80
      ? 'ready_for_local_repayment_review'
      : 'needs_local_repayment_review';

  return {
    mode: 'repayment_readiness_snapshot',
    status,
    generated_at: new Date().toISOString(),
    request_id: req.id || null,
    snapshot_context: {
      milestone_payment_usd: milestonePaymentUsd,
      loan_outstanding_usd: loanOutstandingUsd,
      contractor_invoice_usd: contractorInvoiceUsd,
      evidence_status: evidenceStatus,
      dispute_status: disputeStatus,
      payment_status: paymentStatus,
    },
    readiness_score: readinessScore,
    readiness_factors: readinessFactors,
    demo_only_repayment_readiness_gate: {
      local_snapshot: 'ready',
      repayment_routing: 'blocked',
      payment_movement: 'blocked',
      escrow_release: 'blocked',
      loan_approval: 'blocked',
      contractor_payout: 'blocked',
      legal_or_provider_decision: 'blocked',
      production_release: 'blocked',
      reason: 'This endpoint creates a local repayment readiness snapshot only. It cannot route repayment, move payment, release escrow, approve credit, pay contractors, make legal/provider decisions, or release production features.',
    },
    history_boundary: {
      mode: 'repayment_readiness_snapshot_history',
      scope: 'local_history_only',
      storage: 'browser_localStorage_only',
      retention: 'last_five_metadata_only',
      storage_mode: 'repayment_readiness_snapshot_metadata_history_only',
      no_raw_payment_references_stored: true,
      no_payment_tx_hashes_stored: true,
      no_loan_ids_stored: true,
      no_repayment_readiness_approvals_stored: true,
      no_real_repayment_routing_history_stored: true,
      no_payment_movement_history_stored: true,
      no_escrow_release_history_stored: true,
      reason: 'The UI may save only local repayment readiness metadata. It must not store raw payment references, payment tx hashes, loan IDs, borrower identity data, payment data, wallet data, repayment readiness approvals, routing approvals, escrow release approvals, payout approvals, legal/provider decisions, external sends, server storage, or trigger live actions.',
    },
    safe_copy_summary: `repayment readiness snapshot ${status}; readiness_score=${readinessScore}; evidence_status=${evidenceStatus}; dispute_status=${disputeStatus}; payment_status=${paymentStatus}; repayment routing, payment movement, escrow release, and live actions remain blocked.`,
    no_real_repayment_routing_attempted: true,
    no_payment_movement_attempted: true,
    no_escrow_release_attempted: true,
    no_live_action_attempted: true,
  };
}

function buildJobFitSnapshot(req) {
  const query = req.query || {};
  const jobTrade = normalizeFitText(query.job_trade || query.trade);
  const contractorTrade = normalizeFitText(query.contractor_trade);
  const jobState = normalizeFitText(query.job_state || query.location_state);
  const contractorState = normalizeFitText(query.contractor_state || query.license_state);
  const jobZip = String(query.job_zip || query.location_zip || '').trim();
  const contractorZip = String(query.contractor_zip || '').trim();
  const budgetMin = numericFitValue(query.budget_min_usd, 0);
  const budgetMax = numericFitValue(query.budget_max_usd, 0);
  const contractorRating = numericFitValue(query.contractor_rating, 0);
  const availableWorkingCapital = numericFitValue(query.available_working_capital_usd, 0);
  const fitFactors = [];

  let tradeScore = 10;
  let tradeStatus = 'review';
  let tradeDetail = 'Trade context is partial; use this as a local review signal only.';
  if (jobTrade && contractorTrade && jobTrade === contractorTrade) {
    tradeScore = 30;
    tradeStatus = 'ready';
    tradeDetail = 'Contractor trade matches the selected job trade.';
  } else if (jobTrade && contractorTrade) {
    tradeScore = 8;
    tradeStatus = 'review';
    tradeDetail = 'Contractor trade differs from the selected job trade; founder/tester should review scope before any bid.';
  }
  fitFactors.push({
    id: 'trade_match',
    label: 'Trade match',
    status: tradeStatus,
    score_contribution: tradeScore,
    max_score: 30,
    detail: tradeDetail,
  });

  let locationScore = 8;
  let locationStatus = 'review';
  let locationDetail = 'Location context is partial; use state/ZIP only as local demo hints.';
  if (jobZip && contractorZip && jobZip.slice(0, 3) === contractorZip.slice(0, 3)) {
    locationScore = 20;
    locationStatus = 'ready';
    locationDetail = 'Contractor ZIP prefix is near the selected job ZIP.';
  } else if (jobState && contractorState && jobState === contractorState) {
    locationScore = 14;
    locationStatus = 'ready';
    locationDetail = 'Contractor state matches the selected job state.';
  } else if (jobState && contractorState) {
    locationScore = 4;
    locationStatus = 'review';
    locationDetail = 'Contractor state differs from the selected job state.';
  }
  fitFactors.push({
    id: 'location_fit',
    label: 'Location fit',
    status: locationStatus,
    score_contribution: locationScore,
    max_score: 20,
    detail: locationDetail,
  });

  const materialNeed = budgetMax > 0 ? Math.round(budgetMax * 0.18) : 0;
  let capitalScore = 10;
  let capitalStatus = 'review';
  let capitalDetail = 'Budget or working-capital context is partial; no financing decision is made.';
  if (materialNeed > 0 && availableWorkingCapital >= materialNeed) {
    capitalScore = 20;
    capitalStatus = 'ready';
    capitalDetail = 'Available working capital appears sufficient for a local material-start estimate.';
  } else if (materialNeed > 0 && availableWorkingCapital > 0) {
    capitalScore = 12;
    capitalStatus = 'review';
    capitalDetail = 'Available working capital is present but below the local material-start estimate.';
  }
  fitFactors.push({
    id: 'working_capital_readiness',
    label: 'Working-capital readiness',
    status: capitalStatus,
    score_contribution: capitalScore,
    max_score: 20,
    detail: capitalDetail,
    local_material_start_estimate_usd: materialNeed,
  });

  let ratingScore = 6;
  let ratingStatus = 'review';
  let ratingDetail = 'Contractor rating is missing or low; keep as local review only.';
  if (contractorRating >= 4.5) {
    ratingScore = 15;
    ratingStatus = 'ready';
    ratingDetail = 'Contractor rating is strong for local demo scoring.';
  } else if (contractorRating >= 4) {
    ratingScore = 12;
    ratingStatus = 'ready';
    ratingDetail = 'Contractor rating is acceptable for local demo scoring.';
  } else if (contractorRating >= 3.5) {
    ratingScore = 8;
    ratingStatus = 'review';
    ratingDetail = 'Contractor rating needs review before any real-world use.';
  }
  fitFactors.push({
    id: 'reputation_signal',
    label: 'Reputation signal',
    status: ratingStatus,
    score_contribution: ratingScore,
    max_score: 15,
    detail: ratingDetail,
  });

  fitFactors.push({
    id: 'demo_safety_boundary',
    label: 'Demo safety boundary',
    status: 'blocked_for_live',
    score_contribution: 15,
    max_score: 15,
    detail: 'Snapshot is local/demo-only and cannot route a real lead, assign a contractor, start escrow, create a signed contract, approve credit, verify licensing, or trigger payment.',
  });

  const fitScore = Math.max(0, Math.min(100, Math.round(
    fitFactors.reduce((total, factor) => total + Number(factor.score_contribution || 0), 0)
  )));
  const status = fitScore >= 75
    ? 'strong_local_fit'
    : fitScore >= 50
      ? 'review_local_fit'
      : 'weak_local_fit';

  return {
    request_id: req.id || null,
    generated_at: new Date().toISOString(),
    mode: 'job_fit_snapshot',
    status,
    job_context: {
      job_id: String(query.job_id || '').slice(0, 120),
      trade: jobTrade || 'unknown',
      location_state: jobState || 'unknown',
      location_zip: jobZip || 'unknown',
      budget_min_usd: budgetMin,
      budget_max_usd: budgetMax,
    },
    contractor_context: {
      contractor_trade: contractorTrade || 'unknown',
      contractor_state: contractorState || 'unknown',
      contractor_zip: contractorZip || 'unknown',
      contractor_rating: contractorRating,
      available_working_capital_usd: availableWorkingCapital,
    },
    fit_score: fitScore,
    fit_factors: fitFactors,
    demo_only_matching_gate: {
      local_snapshot: 'ready',
      real_lead_routing: 'blocked',
      contractor_assignment: 'blocked',
      signed_contract_creation: 'blocked',
      escrow_start: 'blocked',
      live_license_verification: 'blocked',
      credit_or_loan_decision: 'blocked',
      payment_or_token_action: 'blocked',
      legal_or_provider_commitment: 'blocked',
      production_release: 'blocked',
      reason: 'This endpoint calculates a local job-fit preview only. It cannot route real leads, assign contractors, verify licensing, approve credit, start escrow, move money, trigger token actions, make legal/provider commitments, or release production features.',
    },
    history_boundary: {
      mode: 'job_fit_snapshot_history',
      scope: 'local_history_only',
      storage: 'browser_localStorage_only',
      retention: 'last_five_metadata_only',
      metadata_only: true,
      raw_job_details: 'not_stored',
      no_real_lead_routing_history_stored: true,
      no_live_matching_action_attempted: true,
      reason: 'The UI may save only local metadata for recent snapshots. It must not store raw lead routing history, assign contractors, or trigger live matching actions.',
    },
    safe_copy_summary: `job fit snapshot ${status}; fit_score=${fitScore}; job_id=${String(query.job_id || 'pending').slice(0, 120)}; real lead routing and live actions remain blocked.`,
    no_real_lead_routing_attempted: true,
    no_live_action_attempted: true,
  };
}

app.get('/api/smartcontractor/job-fit-snapshot', (req, res) => {
  const jobFitValidationErrors = validateJobFitSnapshotQuery(req.query);
  if (jobFitValidationErrors.length) {
    return jobFitSnapshotValidationError(res, jobFitValidationErrors);
  }
  res.json(buildJobFitSnapshot(req));
});

const bidReadinessNumberValidationMessages = {
  budget_min_usd: 'budget_min_usd must be a non-negative finite number',
  budget_max_usd: 'budget_max_usd must be a non-negative finite number',
  bid_amount_usd: 'bid_amount_usd must be a non-negative finite number',
  amount_usd: 'amount_usd must be a non-negative finite number',
};
const bidReadinessTimelineValidationMessage = 'timeline_days must be a non-negative finite integer';
const bidReadinessRatingValidationMessage = 'contractor_rating must be a number from 0 to 5';
const bidReadinessBudgetOrderValidationMessage = 'budget_max_usd must be greater than or equal to budget_min_usd';

function validateBidReadinessNonNegativeNumber(query, fieldName, errors, maxValue = 10000000) {
  const value = query?.[fieldName];
  if (value === undefined || value === null || value === '') return;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    errors.push(bidReadinessNumberValidationMessages[fieldName] || `${fieldName} must be a non-negative finite number`);
    return;
  }
  if (number > maxValue) {
    errors.push(`${fieldName} must be ${maxValue} or less`);
  }
}

function validateBidReadinessTimeline(query, errors, maxValue = 3650) {
  const value = query?.timeline_days;
  if (value === undefined || value === null || value === '') return;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || !Number.isInteger(number)) {
    errors.push(bidReadinessTimelineValidationMessage);
    return;
  }
  if (number > maxValue) {
    errors.push(`timeline_days must be ${maxValue} or less`);
  }
}

function validateBidReadinessComparisonQuery(query = {}) {
  const errors = [];

  validateOptionalString(query.job_id, 'job_id', errors, 120);
  validateOptionalString(query.bid_id, 'bid_id', errors, 120);
  validateOptionalString(query.job_trade, 'job_trade', errors, 80);
  validateOptionalString(query.trade, 'trade', errors, 80);
  validateOptionalString(query.contractor_trade, 'contractor_trade', errors, 80);
  validateBidReadinessNonNegativeNumber(query, 'budget_min_usd', errors);
  validateBidReadinessNonNegativeNumber(query, 'budget_max_usd', errors);
  validateBidReadinessNonNegativeNumber(query, 'bid_amount_usd', errors);
  validateBidReadinessNonNegativeNumber(query, 'amount_usd', errors);
  validateBidReadinessTimeline(query, errors);

  const contractorRatingRaw = query.contractor_rating;
  if (contractorRatingRaw !== undefined && contractorRatingRaw !== null && contractorRatingRaw !== '') {
    const contractorRating = Number(contractorRatingRaw);
    if (!Number.isFinite(contractorRating) || contractorRating < 0 || contractorRating > 5) {
      errors.push(bidReadinessRatingValidationMessage);
    }
  }

  const budgetMinRaw = query.budget_min_usd;
  const budgetMaxRaw = query.budget_max_usd;
  if (budgetMinRaw !== undefined && budgetMinRaw !== null && budgetMinRaw !== '' && budgetMaxRaw !== undefined && budgetMaxRaw !== null && budgetMaxRaw !== '') {
    const budgetMin = Number(budgetMinRaw);
    const budgetMax = Number(budgetMaxRaw);
    if (Number.isFinite(budgetMin) && Number.isFinite(budgetMax) && budgetMax < budgetMin) {
      errors.push(bidReadinessBudgetOrderValidationMessage);
    }
  }

  return errors;
}

function bidReadinessComparisonValidationError(res, errors) {
  return res.status(400).json({
    error: 'Validation failed',
    mode: 'bid_readiness_comparison_validation_error',
    details: Array.isArray(errors) ? errors : [errors],
    request_id: res.req?.id || null,
    demo_only_selection_gate: {
      winning_bid_selection: 'blocked',
      contractor_assignment: 'blocked',
      signed_contract_creation: 'blocked',
      escrow_start: 'blocked',
      loan_or_credit_decision: 'blocked',
      payment_or_token_action: 'blocked',
      legal_or_provider_commitment: 'blocked',
      production_release: 'blocked',
      reason: 'The request failed local preflight validation. It cannot select a winning bid, assign a contractor, create a signed contract, start escrow, approve credit, move money, trigger token actions, make legal/provider commitments, or release production features.',
    },
    safe_copy_summary: 'Bid readiness comparison validation failed; no winning bid selection, contractor assignment, live selection, payment, legal/provider, or production action was attempted.',
    no_winning_bid_selected: true,
    no_contractor_assignment_attempted: true,
    no_live_selection_action_attempted: true,
    no_live_action_attempted: true,
  });
}

function buildBidReadinessComparison(req) {
  const query = req.query || {};
  const jobTrade = normalizeFitText(query.job_trade || query.trade);
  const contractorTrade = normalizeFitText(query.contractor_trade);
  const budgetMin = numericFitValue(query.budget_min_usd, 0);
  const budgetMax = numericFitValue(query.budget_max_usd, 0);
  const bidAmount = numericFitValue(query.bid_amount_usd || query.amount_usd, 0);
  const timelineDays = numericFitValue(query.timeline_days, 0);
  const contractorRating = numericFitValue(query.contractor_rating, 0);
  const readinessFactors = [];

  let budgetScore = 8;
  let budgetStatus = 'review';
  let budgetDetail = 'Budget or bid amount context is partial; no winner is selected.';
  if (budgetMax > 0 && bidAmount > 0 && bidAmount >= budgetMin && bidAmount <= budgetMax) {
    budgetScore = 30;
    budgetStatus = 'ready';
    budgetDetail = 'Bid amount is inside the selected job budget range.';
  } else if (budgetMin > 0 && bidAmount > 0 && bidAmount < budgetMin) {
    budgetScore = 20;
    budgetStatus = 'review';
    budgetDetail = 'Bid amount is below the local budget range; scope clarity should be reviewed.';
  } else if (budgetMax > 0 && bidAmount > 0 && bidAmount <= Math.round(budgetMax * 1.15)) {
    budgetScore = 16;
    budgetStatus = 'review';
    budgetDetail = 'Bid amount is above budget but within a local review buffer.';
  } else if (budgetMax > 0 && bidAmount > 0) {
    budgetScore = 6;
    budgetStatus = 'blocked_for_live';
    budgetDetail = 'Bid amount is materially above budget; keep as local review only.';
  }
  readinessFactors.push({
    id: 'budget_fit',
    label: 'Budget fit',
    status: budgetStatus,
    score_contribution: budgetScore,
    max_score: 30,
    detail: budgetDetail,
  });

  let timelineScore = 8;
  let timelineStatus = 'review';
  let timelineDetail = 'Timeline is missing or partial; no schedule commitment is created.';
  if (timelineDays > 0 && timelineDays <= 30) {
    timelineScore = 20;
    timelineStatus = 'ready';
    timelineDetail = 'Timeline is inside the local demo review range.';
  } else if (timelineDays > 30 && timelineDays <= 60) {
    timelineScore = 12;
    timelineStatus = 'review';
    timelineDetail = 'Timeline is longer than the demo target range and needs review.';
  } else if (timelineDays > 60) {
    timelineScore = 5;
    timelineStatus = 'blocked_for_live';
    timelineDetail = 'Timeline is long enough that founder/tester review should happen before any real-world discussion.';
  }
  readinessFactors.push({
    id: 'timeline_fit',
    label: 'Timeline fit',
    status: timelineStatus,
    score_contribution: timelineScore,
    max_score: 20,
    detail: timelineDetail,
  });

  let tradeScore = 6;
  let tradeStatus = 'review';
  let tradeDetail = 'Trade scope context is partial; compare scope before using this bid in a demo.';
  if (jobTrade && contractorTrade && jobTrade === contractorTrade) {
    tradeScore = 15;
    tradeStatus = 'ready';
    tradeDetail = 'Contractor trade aligns with the selected job trade.';
  } else if (jobTrade && contractorTrade) {
    tradeScore = 4;
    tradeStatus = 'review';
    tradeDetail = 'Contractor trade differs from job trade; scope should be reviewed.';
  }
  readinessFactors.push({
    id: 'trade_scope_alignment',
    label: 'Trade scope alignment',
    status: tradeStatus,
    score_contribution: tradeScore,
    max_score: 15,
    detail: tradeDetail,
  });

  let ratingScore = 6;
  let ratingStatus = 'review';
  let ratingDetail = 'Contractor rating is missing or needs local review.';
  if (contractorRating >= 4.5) {
    ratingScore = 15;
    ratingStatus = 'ready';
    ratingDetail = 'Contractor rating is strong for local bid review.';
  } else if (contractorRating >= 4) {
    ratingScore = 12;
    ratingStatus = 'ready';
    ratingDetail = 'Contractor rating is acceptable for local bid review.';
  } else if (contractorRating >= 3.5) {
    ratingScore = 8;
    ratingStatus = 'review';
    ratingDetail = 'Contractor rating should be reviewed before any real-world use.';
  }
  readinessFactors.push({
    id: 'reputation_signal',
    label: 'Reputation signal',
    status: ratingStatus,
    score_contribution: ratingScore,
    max_score: 15,
    detail: ratingDetail,
  });

  readinessFactors.push({
    id: 'demo_safety_boundary',
    label: 'Demo safety boundary',
    status: 'blocked_for_live',
    score_contribution: 20,
    max_score: 20,
    detail: 'Comparison is local/demo-only and cannot select a winning bid, assign a contractor, create a signed contract, start escrow, approve credit, or trigger payment.',
  });

  const readinessScore = Math.max(0, Math.min(100, Math.round(
    readinessFactors.reduce((total, factor) => total + Number(factor.score_contribution || 0), 0)
  )));
  const status = readinessScore >= 75
    ? 'strong_bid_readiness'
    : readinessScore >= 50
      ? 'review_bid_readiness'
      : 'weak_bid_readiness';

  return {
    request_id: req.id || null,
    generated_at: new Date().toISOString(),
    mode: 'bid_readiness_comparison',
    status,
    comparison_context: {
      job_id: String(query.job_id || '').slice(0, 120),
      bid_id: String(query.bid_id || '').slice(0, 120),
      job_trade: jobTrade || 'unknown',
      contractor_trade: contractorTrade || 'unknown',
      budget_min_usd: budgetMin,
      budget_max_usd: budgetMax,
      bid_amount_usd: bidAmount,
      timeline_days: timelineDays,
      contractor_rating: contractorRating,
    },
    readiness_score: readinessScore,
    readiness_factors: readinessFactors,
    demo_only_selection_gate: {
      local_comparison: 'ready',
      winning_bid_selection: 'blocked',
      contractor_assignment: 'blocked',
      signed_contract_creation: 'blocked',
      escrow_start: 'blocked',
      loan_or_credit_decision: 'blocked',
      payment_or_token_action: 'blocked',
      legal_or_provider_commitment: 'blocked',
      production_release: 'blocked',
      reason: 'This endpoint compares a bid locally only. It cannot select a winner, assign a contractor, create a signed contract, start escrow, approve credit, move money, trigger token actions, make legal/provider commitments, or release production features.',
    },
    history_boundary: {
      mode: 'bid_readiness_comparison_history',
      scope: 'local_history_only',
      storage: 'browser_localStorage_only',
      retention: 'last_five_metadata_only',
      metadata_only: true,
      raw_bid_details: 'not_stored',
      no_winning_bid_history_stored: true,
      no_live_selection_action_attempted: true,
      reason: 'The UI may save only local metadata for recent bid comparisons. It must not store winning-bid history, assign contractors, select winners, or trigger live selection actions.',
    },
    safe_copy_summary: `bid readiness comparison ${status}; readiness_score=${readinessScore}; bid_id=${String(query.bid_id || 'draft_bid').slice(0, 120)}; winning bid selection and live actions remain blocked.`,
    no_winning_bid_selected: true,
    no_contractor_assignment_attempted: true,
    no_live_action_attempted: true,
  };
}

app.get('/api/smartcontractor/bid-readiness-comparison', (req, res) => {
  const bidReadinessValidationErrors = validateBidReadinessComparisonQuery(req.query);
  if (bidReadinessValidationErrors.length) {
    return bidReadinessComparisonValidationError(res, bidReadinessValidationErrors);
  }
  res.json(buildBidReadinessComparison(req));
});

function buildMilestoneAcceptanceSnapshot(req) {
  const query = req.query || {};
  const evidenceCount = Math.max(0, Math.round(numericFitValue(query.evidence_count, 0)));
  const photoCount = Math.max(0, Math.round(numericFitValue(query.photo_count, 0)));
  const videoCount = Math.max(0, Math.round(numericFitValue(query.video_count, 0)));
  const noteCount = Math.max(0, Math.round(numericFitValue(query.note_count, 0)));
  const requestedReleaseUsd = Math.max(0, numericFitValue(query.requested_release_usd, 0));
  const milestoneTitle = String(query.milestone_title || query.title || '').trim().slice(0, 160);
  const scopeSummary = String(query.scope_summary || query.description || '').trim().slice(0, 500);
  const workStatus = normalizeFitText(query.work_status || 'submitted');
  const paymentStatus = normalizeFitText(query.payment_status || 'funded');
  const homeownerConfirmsVisibleWork = booleanFitFlag(query.homeowner_confirms_visible_work);
  const contractorReportsComplete = booleanFitFlag(query.contractor_reports_complete);
  const disputeOpen = booleanFitFlag(query.dispute_open);
  const acceptanceFactors = [];

  const hasScopeContext = milestoneTitle.length >= 4 && scopeSummary.length >= 20;
  acceptanceFactors.push({
    id: 'scope_match',
    label: 'Scope match',
    status: hasScopeContext ? 'ready' : 'review',
    score_contribution: hasScopeContext ? 20 : 8,
    max_score: 20,
    detail: hasScopeContext
      ? 'Milestone title and scope summary are present for local homeowner review.'
      : 'Milestone scope context is partial; collect clearer scope before any real-world acceptance discussion.',
  });

  let evidenceScore = 6;
  let evidenceStatus = 'review';
  let evidenceDetail = 'Evidence metadata is partial; no milestone approval is created.';
  if (evidenceCount >= 3 && (photoCount > 0 || videoCount > 0)) {
    evidenceScore = 25;
    evidenceStatus = 'ready';
    evidenceDetail = 'Evidence metadata includes multiple items and visible work media for local review.';
  } else if (evidenceCount >= 2) {
    evidenceScore = 16;
    evidenceStatus = 'review';
    evidenceDetail = 'Evidence metadata exists but should be strengthened before any live workflow discussion.';
  }
  acceptanceFactors.push({
    id: 'visible_work_evidence',
    label: 'Visible work evidence',
    status: evidenceStatus,
    score_contribution: evidenceScore,
    max_score: 25,
    detail: evidenceDetail,
  });

  const acceptanceSignalScore = homeownerConfirmsVisibleWork && contractorReportsComplete
    ? 20
    : homeownerConfirmsVisibleWork || contractorReportsComplete
      ? 12
      : 4;
  acceptanceFactors.push({
    id: 'homeowner_acceptance_signal',
    label: 'Homeowner acceptance signal',
    status: homeownerConfirmsVisibleWork && contractorReportsComplete ? 'ready' : 'review',
    score_contribution: acceptanceSignalScore,
    max_score: 20,
    detail: homeownerConfirmsVisibleWork && contractorReportsComplete
      ? 'Homeowner visible-work confirmation and contractor completion signal are both present locally.'
      : 'Local acceptance signal is incomplete; keep as review only.',
  });

  const workPaymentReady = ['submitted', 'approved', 'completed'].includes(workStatus) && ['funded', 'not_funded'].includes(paymentStatus);
  acceptanceFactors.push({
    id: 'work_payment_status_review',
    label: 'Work/payment status review',
    status: workPaymentReady ? 'ready' : 'review',
    score_contribution: workPaymentReady ? 15 : 8,
    max_score: 15,
    detail: workPaymentReady
      ? 'Local work and payment statuses are readable for review; payment release remains blocked.'
      : 'Work/payment statuses need review before local acceptance evidence can be trusted.',
  });

  acceptanceFactors.push({
    id: 'dispute_safety_boundary',
    label: 'Dispute safety boundary',
    status: disputeOpen ? 'blocked_for_live' : 'ready',
    score_contribution: disputeOpen ? 0 : 10,
    max_score: 10,
    detail: disputeOpen
      ? 'A dispute is open; milestone acceptance must stay blocked for dispute review.'
      : 'No dispute was marked open in this local snapshot.',
  });

  acceptanceFactors.push({
    id: 'payment_release_boundary',
    label: 'Payment release boundary',
    status: 'blocked_for_live',
    score_contribution: 10,
    max_score: 10,
    detail: 'This snapshot cannot approve milestones, release escrow, move payments, route repayment, or make legal/provider decisions.',
  });

  const acceptanceScore = Math.max(0, Math.min(100, Math.round(
    acceptanceFactors.reduce((total, factor) => total + Number(factor.score_contribution || 0), 0)
  )));
  const status = disputeOpen
    ? 'blocked_for_dispute_review'
    : acceptanceScore >= 75
      ? 'ready_for_homeowner_review'
      : acceptanceScore >= 50
        ? 'needs_more_evidence_review'
        : 'incomplete_milestone_evidence';

  return {
    request_id: req.id || null,
    generated_at: new Date().toISOString(),
    mode: 'milestone_acceptance_snapshot',
    status,
    milestone_context: {
      job_id: String(query.job_id || '').slice(0, 120),
      milestone_id: String(query.milestone_id || '').slice(0, 120),
      milestone_title: milestoneTitle || 'unknown',
      scope_summary_present: scopeSummary.length > 0,
      evidence_count: evidenceCount,
      photo_count: photoCount,
      video_count: videoCount,
      note_count: noteCount,
      homeowner_confirms_visible_work: homeownerConfirmsVisibleWork,
      contractor_reports_complete: contractorReportsComplete,
      work_status: workStatus || 'unknown',
      payment_status: paymentStatus || 'unknown',
      requested_release_usd: requestedReleaseUsd,
      dispute_open: disputeOpen,
    },
    acceptance_score: acceptanceScore,
    acceptance_factors: acceptanceFactors,
    demo_only_acceptance_gate: {
      local_snapshot: 'ready',
      milestone_approval: 'blocked',
      escrow_release: 'blocked',
      payment_movement: 'blocked',
      repayment_routing: 'blocked',
      signed_change_order: 'blocked',
      legal_liability_decision: 'blocked',
      provider_commitment: 'blocked',
      production_release: 'blocked',
      reason: 'This endpoint previews local milestone acceptance evidence only. It cannot approve milestones, release escrow, move payments, route repayment, sign change orders, make legal/provider commitments, or release production features.',
    },
    history_boundary: {
      mode: 'milestone_acceptance_snapshot_history',
      scope: 'local_history_only',
      storage: 'browser_localStorage_only',
      retention: 'last_five_metadata_only',
      metadata_only: true,
      raw_milestone_evidence: 'not_stored',
      no_milestone_approval_history_stored: true,
      no_escrow_release_history_stored: true,
      no_payment_movement_history_stored: true,
      reason: 'The UI may save only local metadata for recent milestone acceptance snapshots. It must not store approval history, escrow release history, payment movement history, repayment routing, legal decisions, provider commitments, or live-action history.',
    },
    safe_copy_summary: `milestone acceptance snapshot ${status}; acceptance_score=${acceptanceScore}; milestone_id=${String(query.milestone_id || 'draft_milestone').slice(0, 120)}; milestone approval, escrow release, and payment movement remain blocked.`,
    no_milestone_approval_attempted: true,
    no_escrow_release_attempted: true,
    no_payment_movement_attempted: true,
    no_live_action_attempted: true,
  };
}

app.get('/api/smartcontractor/milestone-acceptance-snapshot', (req, res) => {
  const milestoneAcceptanceValidationErrors = validateMilestoneAcceptanceSnapshotQuery(req.query);
  if (milestoneAcceptanceValidationErrors.length) {
    return milestoneAcceptanceSnapshotValidationError(res, milestoneAcceptanceValidationErrors);
  }
  res.json(buildMilestoneAcceptanceSnapshot(req));
});

app.get('/api/smartcontractor/repayment-allocation-preview', (req, res) => {
  const repaymentAllocationValidationErrors = validateRepaymentAllocationPreviewQuery(req.query);
  if (repaymentAllocationValidationErrors.length) {
    return repaymentAllocationPreviewValidationError(res, repaymentAllocationValidationErrors);
  }
  res.json(buildRepaymentAllocationPreview(req));
});

app.get('/api/smartcontractor/repayment-readiness-snapshot', (req, res) => {
  const repaymentReadinessValidationErrors = validateRepaymentReadinessSnapshotQuery(req.query);
  if (repaymentReadinessValidationErrors.length) {
    return repaymentReadinessSnapshotValidationError(res, repaymentReadinessValidationErrors);
  }
  res.json(buildRepaymentReadinessSnapshot(req));
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

  if (error) return databaseWriteError(res, error);
  await recordAuditEvent({
    actor_type: 'homeowner',
    actor_id: data.homeowner_id,
    action: 'job_created',
    entity_type: 'job',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ job: data, request_id: req.id || null });
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

  if (error) return databaseWriteError(res, error);
  await recordAuditEvent({
    actor_type: 'contractor',
    actor_id: data.contractor_id,
    action: 'bid_submitted',
    entity_type: 'bid',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ bid: data, request_id: req.id || null });
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
  if (error) return databaseError(res, error);
  res.json({ bids: data, request_id: req.id || null });
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
  if (error) return databaseError(res, error);
  res.json({ project_contracts: data, request_id: req.id || null });
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

  if (error) return databaseWriteError(res, error);
  await recordAuditEvent({
    actor_type: 'homeowner',
    actor_id: data.homeowner_id,
    action: 'project_contract_created',
    entity_type: 'project_contract',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ project_contract: data, request_id: req.id || null });
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
  if (error) return databaseError(res, error);
  res.json({ milestones: data, request_id: req.id || null });
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

  if (error) return databaseWriteError(res, error);
  await recordAuditEvent({
    actor_type: 'system',
    action: 'milestone_created',
    entity_type: 'milestone',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ milestone: data, request_id: req.id || null });
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

  if (error) return databaseWriteError(res, error);
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

  if (error) return databaseWriteError(res, error);
  await recordAuditEvent({
    actor_type: 'contractor',
    actor_id: data.contractor_id,
    action: 'loan_requested',
    entity_type: 'contractor_loan',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ loan: data, request_id: req.id || null });
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
  if (error) return databaseError(res, error);
  res.json({ loans: data, request_id: req.id || null });
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

  if (loanError) return databaseError(res, loanError);

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

  if (repaymentError) return databaseWriteError(res, repaymentError);

  const { data: updatedLoan, error: updateError } = await supabase
    .from('contractor_loans')
    .update({ outstanding_usd: newOutstanding, status: nextStatus })
    .eq('id', req.params.loanId)
    .select('id,principal_usd,outstanding_usd,status')
    .single();

  if (updateError) return databaseWriteError(res, updateError);
  await recordAuditEvent({
    actor_type: 'contractor',
    action: 'loan_repayment_recorded',
    entity_type: 'loan_repayment',
    entity_id: repayment.id,
    old_value: { loan },
    new_value: { repayment, loan: updatedLoan },
    req,
  });
  res.status(201).json({ repayment, loan: updatedLoan, request_id: req.id || null });
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
  if (error) return databaseError(res, error);
  res.json({ disputes: data, request_id: req.id || null });
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
      return res.status(400).json({
        error: 'homeowner_id is required for authenticated homeowner disputes',
        request_id: res.req?.id || null,
      });
    }
    if (homeowner_id) {
      const ownership = await assertOwnedRoleRecord(req, 'homeowners', homeowner_id, 'homeowner_id');
      if (!ownership.allowed) return rejectOwnership(res, ownership);
    }
  }
  if (opened_by_role === 'contractor') {
    if (getBearerToken(req) && !contractor_id) {
      return res.status(400).json({
        error: 'contractor_id is required for authenticated contractor disputes',
        request_id: res.req?.id || null,
      });
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

  if (error) return databaseWriteError(res, error);
  await recordAuditEvent({
    actor_type: opened_by_role,
    actor_id: opened_by_role === 'homeowner' ? data.homeowner_id : data.contractor_id,
    action: 'dispute_opened',
    entity_type: 'dispute',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ dispute: data, request_id: req.id || null });
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
    if (auth.error) return authError(res, auth.status, auth.error);
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('auth_user_id', auth.user.id)
      .maybeSingle();
    if (profileError) return databaseError(res, profileError);
    if (!profile) return authError(res, 403, 'Authenticated user does not have a linked profile for evidence upload');
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

  if (error) return databaseWriteError(res, error);
  await recordAuditEvent({
    actor_type: 'homeowner',
    actor_id: uploaded_by_profile_id,
    action: 'dispute_evidence_added',
    entity_type: 'dispute_evidence',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ evidence: data, request_id: req.id || null });
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

  if (error) return databaseWriteError(res, error);
  await recordAuditEvent({
    actor_type: 'peer_reviewer',
    actor_id: data.reviewer_contractor_id,
    action: 'dispute_peer_review_submitted',
    entity_type: 'dispute_review',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ review: data, request_id: req.id || null });
});

// ─── Slack Bot Endpoint ────────────────────────────────────────────────────────
// Setup: create Slack app at api.slack.com → Event Subscriptions → set Request URL
// to https://your-domain.com/api/slack/events
// Required scopes: app_mentions:read, chat:write, channels:history
// Set SLACK_BOT_TOKEN in .env
app.post('/api/slack/events', async (req, res) => {
  const slackValidation = validateSlackEventInput(req.body);
  if (slackValidation.errors.length) return validationError(res, slackValidation.errors);
  const { type, challenge, event } = slackValidation;

  // Step 1: Slack URL verification
  if (type === 'url_verification') {
    return res.json({ challenge, request_id: req.id || null });
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
  const webhookValidation = validateAutomationWebhookInput(req.body);
  if (webhookValidation.errors.length) return validationError(res, webhookValidation.errors);
  const { action, question, document_type, context, source, user_type } = webhookValidation;

  try {
    if (action === 'ask') {
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
        request_id: req.id || null,
      });
    }

    if (action === 'generate') {
      let prompt = `Generate a complete, professional ${document_type.replace('_', ' ')} template. Use [PLACEHOLDER] format for variable fields. Make it legally sound and industry-standard.`;
      if (context) prompt += `\n\nContext: ${context}`;

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
        request_id: req.id || null,
      });
    }

    if (action === 'suggest') {
      const response = await openai.chat.completions.create({
        model: 'anthropic/claude-haiku-4-5',
        max_tokens: 300,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Generate 5 proactive construction tips or action items for a ${user_type} today. Format as a JSON array of strings.` },
        ],
      });

      return res.json({
        success: true,
        action,
        suggestions: response.choices[0]?.message?.content,
        request_id: req.id || null,
      });
    }

    return res.status(400).json({
      error: `Unknown action: ${action}. Use: ask | generate | suggest`,
      request_id: res.req?.id || null,
    });

  } catch (err) {
    console.error('Webhook error:', err.message);
    serverError(res, 'Service temporarily unavailable');
  }
});

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    request_id: req.id || null,
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
      'job-fit-snapshot',
      'bid-readiness-comparison',
      'milestone-acceptance-snapshot',
      'repayment-allocation-preview',
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
      'founder-auth-setup-report',
      'founder-auth-setup-print-template',
      'strict-admin-smoke-readiness',
      'strict-admin-smoke-output-template',
      'strict-admin-smoke-output-draft-validation',
      'request-trace-report',
      'profile-ownership-binding',
      'role-ownership-guards',
      'supabase-service-role-boundary',
      'mobile-install-readiness',
      'controlled-beta-readiness',
      'smartcontractor-workflow-readiness',
      'dispute-evidence-readiness',
      'milestone-evidence-readiness',
      'working-capital-readiness',
      'contractor-reputation-readiness',
      'contractor-verification-readiness',
      'admin-readiness-overview',
      'provider-evidence-packet',
      'provider-evidence-packet-print-template',
      'provider-evidence-packet-redaction-qa',
      'provider-evidence-review-chain',
      'smart-contract-helper-index',
      'smart-contract-local-replay-dry-run',
      'smart-contract-local-replay-dry-run-evidence-packet',
      'smart-contract-review-workbench',
      'smart-contract-review-workbench-handoff-summary',
      'smart-contract-review-workbench-gate-matrix',
      'ai-agent-workflow-catalog',
      'ai-agent-local-recommendation',
      'repayment-waterfall-draft-review',
      'repayment-waterfall-review-packet',
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
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🏗️  GCSC BuilderAI running on http://localhost:${PORT}`);
    console.log(`📡  API: http://localhost:${PORT}/api/chat`);
    console.log(`🔧  Demo: http://localhost:${PORT}\n`);
  });
}

module.exports = app;
