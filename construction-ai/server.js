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
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY)
  : null;

function requireSupabase(res) {
  if (supabase) return true;
  res.status(503).json({ error: 'Supabase is not configured' });
  return false;
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
    request_id: req?.headers?.['x-request-id'] || null,
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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: '50kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── Rate Limiting ─────────────────────────────────────────────────────────────
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute window
  max: 20,                    // 20 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a moment.' },
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
  if (!requireSupabase(res)) return;

  const { provider } = req.params;
  const providerConfig = paymentProviders.find((item) => item.id === provider);
  if (!providerConfig) {
    return res.status(400).json({ error: `Unsupported provider: ${provider}` });
  }

  const {
    external_intent_id,
    event_type = 'provider_webhook_received',
    status,
    amount_usd,
    provider_reference,
    tx_hash,
  } = req.body;

  const errors = [];
  if (!isNonEmptyString(external_intent_id)) errors.push('external_intent_id is required');
  validateOptionalString(event_type, 'event_type', errors, 80);
  validateOptionalEnum(status, ['created', 'provider_setup_required', 'pending', 'paid', 'failed', 'refunded', 'disputed', 'cancelled'], 'status', errors);
  validateOptionalString(provider_reference, 'provider_reference', errors, 160);
  validateOptionalString(tx_hash, 'tx_hash', errors, 160);
  let amount = null;
  if (amount_usd !== undefined && amount_usd !== null && amount_usd !== '') {
    amount = parsePositiveNumber(amount_usd, 'amount_usd', errors);
  }
  if (errors.length) return validationError(res, errors);

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

async function safeConsoleQuery(name, queryBuilder) {
  try {
    const { data, error } = await queryBuilder();
    if (error) return { name, data: [], error: error.message };
    return { name, data: data || [], error: null };
  } catch (error) {
    return { name, data: [], error: error.message };
  }
}

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

  const errors = [];
  if (!isNonEmptyString(subject_type)) errors.push('subject_type is required');
  if (!isNonEmptyString(check_type)) errors.push('check_type is required');
  validateOptionalString(subject_id, 'subject_id', errors, 120);
  validateOptionalString(provider, 'provider', errors, 80);
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
  if (errors.length) return validationError(res, errors);

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
  if (!requireSupabase(res)) return;

  const { provider } = req.params;
  const {
    verification_check_id,
    provider_reference,
    event_type = 'verification_provider_event_received',
    status,
  } = req.body;

  const errors = [];
  validateOptionalString(verification_check_id, 'verification_check_id', errors, 120);
  validateOptionalString(provider_reference, 'provider_reference', errors, 160);
  validateOptionalString(event_type, 'event_type', errors, 80);
  validateOptionalEnum(status, ['pending', 'in_review', 'verified', 'rejected', 'expired', 'needs_more_info', 'failed'], 'status', errors);
  if (errors.length) return validationError(res, errors);

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
  if (!requireSupabase(res)) return;

  const { role, email, full_name, phone, xpr_account, wallet_public_key } = req.body;
  if (!role || !email) {
    return res.status(400).json({ error: 'role and email are required' });
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert({ role, email, full_name, phone, xpr_account, wallet_public_key })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  await recordAuditEvent({
    actor_type: role,
    action: 'profile_created',
    entity_type: 'profile',
    entity_id: data.id,
    new_value: data,
    req,
  });
  res.status(201).json({ profile: data });
});

app.post('/api/smartcontractor/contractors', async (req, res) => {
  if (!requireSupabase(res)) return;

  const {
    profile_id,
    business_name,
    ein,
    license_number,
    license_state,
    insurance_status,
  } = req.body;

  if (!profile_id || !business_name) {
    return res.status(400).json({ error: 'profile_id and business_name are required' });
  }

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
  if (!requireSupabase(res)) return;

  const { profile_id, display_name, default_zip, subscription_tier } = req.body;
  if (!profile_id) {
    return res.status(400).json({ error: 'profile_id is required' });
  }

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

  if (!homeowner_id || !title || !description) {
    return res.status(400).json({ error: 'homeowner_id, title, and description are required' });
  }

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
  if (!requireSupabase(res)) return;

  const { job_id, contractor_id, amount_usd, timeline_days, message } = req.body;
  if (!job_id || !contractor_id || amount_usd === undefined) {
    return res.status(400).json({ error: 'job_id, contractor_id, and amount_usd are required' });
  }

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

  if (!job_id || !homeowner_id || !contractor_id || !title || total_amount_usd === undefined) {
    return res.status(400).json({ error: 'job_id, homeowner_id, contractor_id, title, and total_amount_usd are required' });
  }

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

  if (!job_id || !title || amount_usd === undefined) {
    return res.status(400).json({ error: 'job_id, title, and amount_usd are required' });
  }

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
  if (!requireSupabase(res)) return;

  const { contractor_id, payment_tx_hash, price_usd = 5 } = req.body;
  if (!contractor_id) {
    return res.status(400).json({ error: 'contractor_id is required' });
  }

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
  if (!requireSupabase(res)) return;

  const { contractor_id, job_id, principal_usd, apr_percent = 2, purpose, risk_score } = req.body;
  if (!contractor_id || !principal_usd) {
    return res.status(400).json({ error: 'contractor_id and principal_usd are required' });
  }

  const { data, error } = await supabase
    .from('contractor_loans')
    .insert({
      contractor_id,
      job_id,
      principal_usd,
      outstanding_usd: principal_usd,
      apr_percent,
      purpose,
      risk_score,
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
  if (!requireSupabase(res)) return;

  const { amount_usd, source = 'milestone_payment', payment_tx_hash } = req.body;
  const errors = [];
  const repaymentAmount = parsePositiveNumber(amount_usd, 'amount_usd', errors);
  validateOptionalString(source, 'source', errors, 80);
  validateOptionalString(payment_tx_hash, 'payment_tx_hash', errors, 160);
  if (errors.length) return validationError(res, errors);

  const { data: loan, error: loanError } = await supabase
    .from('contractor_loans')
    .select('id,outstanding_usd,status')
    .eq('id', req.params.loanId)
    .single();

  if (loanError) return res.status(500).json({ error: loanError.message });

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
  if (!requireSupabase(res)) return;

  const {
    job_id,
    homeowner_id,
    contractor_id,
    opened_by_role,
    title,
    description,
  } = req.body;

  if (!job_id || !opened_by_role || !title || !description) {
    return res.status(400).json({ error: 'job_id, opened_by_role, title, and description are required' });
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
  if (!requireSupabase(res)) return;

  const { uploaded_by_profile_id, evidence_type, evidence_url, notes } = req.body;
  if (!evidence_type && !notes) {
    return res.status(400).json({ error: 'evidence_type or notes is required' });
  }

  const { data, error } = await supabase
    .from('dispute_evidence')
    .insert({
      dispute_id: req.params.disputeId,
      uploaded_by_profile_id,
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

  if (!reviewer_contractor_id || !finding || !recommendation) {
    return res.status(400).json({ error: 'reviewer_contractor_id, finding, and recommendation are required' });
  }

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

// ─── Start (local) / Export (Vercel) ──────────────────────────────────────────
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n🏗️  GCSC BuilderAI running on http://localhost:${PORT}`);
    console.log(`📡  API: http://localhost:${PORT}/api/chat`);
    console.log(`🔧  Demo: http://localhost:${PORT}\n`);
  });
}

module.exports = app;
