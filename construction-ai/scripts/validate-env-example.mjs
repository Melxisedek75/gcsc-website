import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const envPath = resolve('.env.example');
const env = readFileSync(envPath, 'utf8');

function fail(message) {
  console.error(`Env example validation failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function parseEnv(content) {
  const values = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (!match) continue;
    values[match[1].trim()] = match[2].trim();
  }
  return values;
}

const values = parseEnv(env);

const requiredKeys = [
  'PORT',
  'PUBLIC_SITE_URL',
  'ALLOWED_ORIGINS',
  'ALLOWED_AUTH_REDIRECT_ORIGINS',
  'ANTHROPIC_API_KEY',
  'SUPABASE_URL',
  'SUPABASE_PUBLISHABLE_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SMARTCONTRACTOR_AUTH_MODE',
  'SMARTCONTRACTOR_ROUTE_PROTECTION',
  'SMARTCONTRACTOR_ADMIN_ENFORCEMENT_MODE',
  'GCSC_XPR_RECEIVER_ACCOUNT',
  'METAL_PAY_CONNECT_API_KEY',
  'METAL_PAY_CONNECT_SECRET_KEY',
  'METAL_PAY_CONNECT_ENV',
  'STRIPE_SECRET_KEY',
  'PAYPAL_CLIENT_ID',
  'PAYPAL_CLIENT_SECRET',
  'COINBASE_COMMERCE_API_KEY',
  'BTCPAY_SERVER_URL',
  'BTCPAY_API_KEY',
  'PERSONA_API_KEY',
  'PLAID_CLIENT_ID',
  'PLAID_SECRET',
  'MIDDESK_API_KEY',
  'SLACK_BOT_TOKEN',
];

for (const key of requiredKeys) {
  assert(Object.hasOwn(values, key), `.env.example must include ${key}`);
}

const placeholderRequired = [
  'ANTHROPIC_API_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'METAL_PAY_CONNECT_API_KEY',
  'METAL_PAY_CONNECT_SECRET_KEY',
  'STRIPE_SECRET_KEY',
  'PAYPAL_CLIENT_ID',
  'PAYPAL_CLIENT_SECRET',
  'COINBASE_COMMERCE_API_KEY',
  'BTCPAY_API_KEY',
  'PERSONA_API_KEY',
  'PLAID_CLIENT_ID',
  'PLAID_SECRET',
  'MIDDESK_API_KEY',
  'SLACK_BOT_TOKEN',
];

for (const key of placeholderRequired) {
  const value = values[key] || '';
  assert(
    /your_|sk_test_your_|xoxb-your/i.test(value),
    `${key} must be a placeholder in .env.example`
  );
}

assert(values.SMARTCONTRACTOR_AUTH_MODE === 'magic_link', 'Magic Link should be the MVP auth mode in .env.example');
assert(values.SMARTCONTRACTOR_ROUTE_PROTECTION === 'draft', 'Route protection should default to draft in .env.example');
assert(values.SMARTCONTRACTOR_ADMIN_ENFORCEMENT_MODE === 'draft', 'Admin enforcement should default to draft in .env.example');
assert(values.METAL_PAY_CONNECT_ENV === 'dev', 'Metal Pay Connect should default to dev in .env.example');
assert(values.GCSC_XPR_RECEIVER_ACCOUNT === 'gcsctoken111', 'GCSC receiver account should be gcsctoken111');
assert(values.PUBLIC_SITE_URL === 'https://xprnet.org', 'PUBLIC_SITE_URL should point to the production domain');

const allowedOrigins = values.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim());
const allowedRedirectOrigins = values.ALLOWED_AUTH_REDIRECT_ORIGINS.split(',').map((origin) => origin.trim());

for (const origin of ['http://localhost:3002', 'https://xprnet.org', 'https://www.xprnet.org']) {
  assert(allowedOrigins.includes(origin), `ALLOWED_ORIGINS must include ${origin}`);
  assert(allowedRedirectOrigins.includes(origin), `ALLOWED_AUTH_REDIRECT_ORIGINS must include ${origin}`);
}

assert(
  /Server-side only\. Never expose this to browser code\./i.test(env),
  '.env.example must warn that service-role key is server-side only'
);
assert(
  /Keep all secret keys server-side only\./i.test(env),
  '.env.example must warn that payment provider keys are server-side only'
);

const forbiddenRealSecretPatterns = [
  /sk_live_[a-z0-9]/i,
  /xox[baprs]-[0-9]/i,
  /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
  /eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/,
];

for (const pattern of forbiddenRealSecretPatterns) {
  assert(!pattern.test(env), `.env.example appears to contain a real secret matching ${pattern}`);
}

console.log(JSON.stringify({
  status: 'passed',
  file: envPath,
  required_keys_checked: requiredKeys.length,
  placeholder_keys_checked: placeholderRequired.length,
}, null, 2));
