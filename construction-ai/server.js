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

  return {
    mode: 'working_capital_readiness',
    status: 'local_review_ready',
    local_only: true,
    readiness_checks: readinessChecks,
    working_capital_checklist: workingCapitalChecklist,
    working_capital_review_action_queue: workingCapitalReviewActionQueue,
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

  return {
    mode: 'contractor_reputation_readiness',
    status: 'local_review_ready',
    local_only: true,
    readiness_checks: readinessChecks,
    reputation_checklist: reputationChecklist,
    reputation_review_action_queue: reputationReviewActionQueue,
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

  return {
    mode: 'contractor_verification_readiness',
    status: 'local_review_ready',
    local_only: true,
    readiness_checks: readinessChecks,
    verification_checklist: verificationChecklist,
    verification_review_action_queue: verificationReviewActionQueue,
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
    request_id: req.id || null,
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
  const copyableFounderSteps = [
    'Founder Auth Setup Report',
    `Request ID: ${req.id || 'pending'}`,
    `Session state: ${sessionState}`,
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
  const copyableSmokeCommands = [
    'Strict Admin Smoke Readiness',
    `Request ID: ${req.id || 'pending'}`,
    `Readiness status: ${smokeStatus}`,
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
    'payment_or_wallet_data',
    'legal_or_provider_decision',
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
