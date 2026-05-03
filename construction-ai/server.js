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

// SmartContractor MVP API: jobs, bids, paid bid unlocks, and contractor credit.
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
  res.status(201).json({ bid: data });
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
  res.status(201).json({ loan: data });
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
