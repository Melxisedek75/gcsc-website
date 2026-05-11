# SmartContractor Vercel Environment Matrix

Date: 2026-05-11

Purpose: define which environment variables are safe to prepare for the first Vercel public beta, which are founder-only secrets, and which should remain disabled until legal/payment/security review.

This document does not contain real secrets and must never be used as a place to store credentials.

## Demo-Safe Variables

These may be configured first for a non-real-money public beta after founder review:

| Variable | Draft Value / Source | Scope | Notes |
|----------|----------------------|-------|-------|
| `PUBLIC_SITE_URL` | deployed beta URL | Production / Preview | Used for links and redirects. |
| `ALLOWED_ORIGINS` | deployed beta URL plus local dev origins | Production / Preview | Keep tight; do not use wildcard origins. |
| `SUPABASE_URL` | Supabase project URL | Production / Preview | Public project URL, not a secret. |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key | Production / Preview | Browser-safe publishable key only. |
| `SMARTCONTRACTOR_AUTH_MODE` | `magic_link` | Production / Preview | Preferred MVP auth path. |
| `SMARTCONTRACTOR_ROUTE_PROTECTION` | `draft` first, `strict` after tests | Production / Preview | Do not switch to strict until founder/admin smoke tests pass. |
| `SMARTCONTRACTOR_ADMIN_ENFORCEMENT_MODE` | `draft` first, `strict` after tests | Production / Preview | Founder/admin role activation required before strict mode. |
| `GCSC_XPR_RECEIVER_ACCOUNT` | `gcsctoken111` | Production / Preview | Public recipient account, not a private key. |
| `METAL_PAY_CONNECT_ENV` | `dev` | Production / Preview | Keep Metal Pay in dev/test mode until partner credentials and payment review are complete. |

## Founder-Only Secret Variables

Only the founder should enter these directly inside the deployment platform. Do not paste them into chat, screenshots, frontend files, docs, or public GitHub.

| Variable | Status Before Public Beta | Notes |
|----------|---------------------------|-------|
| `SUPABASE_SERVICE_ROLE_KEY` | Blocked until strict Auth/RLS/admin review | Server-side only. Never expose to browser code. |
| `METAL_PAY_CONNECT_API_KEY` | Keep disabled/test until partner approval | Server-side payment integration credential. |
| `METAL_PAY_CONNECT_SECRET_KEY` | Keep disabled/test until partner approval | Server-side signing credential. |
| `STRIPE_SECRET_KEY` | Disabled/test only | No production capture before legal/payment review. |
| `PAYPAL_CLIENT_SECRET` | Disabled/test only | No production payment mode before review. |
| `COINBASE_COMMERCE_API_KEY` | Disabled/test only | Crypto payment capture must remain disabled for beta. |
| `BTCPAY_API_KEY` | Disabled/test only | Server-side only. |
| `PERSONA_API_KEY` | Optional later | Identity provider choice still requires review. |
| `PLAID_SECRET` | Optional later | Bank/financial data integration requires legal/security review. |
| `MIDDESK_API_KEY` | Optional later | Business verification provider choice still requires review. |
| `ANTHROPIC_API_KEY` | Server-side only if AI routes are enabled | Current local server uses the OpenAI SDK against OpenRouter; never expose model keys client-side. |
| `SLACK_BOT_TOKEN` | Optional later | Not needed for public beta. |

## Must Stay Disabled For First Beta

Do not configure production mode for:

- real contractor loans;
- real escrow or stored-value flows;
- automatic payment release;
- token collateral locking, liquidation, or settlement;
- production Stripe/PayPal/Coinbase/BTCPay payment capture;
- production payment capture of any kind;
- Metal Pay production mode;
- automatic admin role assignment;
- broad Supabase RLS policies such as `USING true`.

## Safe Vercel Setup Order

1. Import GitHub repository.
2. Set root directory to `construction-ai`.
3. Add demo-safe variables only.
4. Run `npm run check`.
5. Verify `/api/admin/launch-readiness`.
6. Verify `/api/admin/mobile-install-readiness`.
7. Configure Supabase Auth redirect URL only while founder is present.
8. Add service-role/payment secrets only after strict Auth/RLS/admin/legal/payment review.

## Acceptance Criteria

The Vercel environment is ready for a non-real-money beta when:

- demo-safe variables are configured;
- founder-only secrets are still absent or explicitly reviewed;
- route/admin protection remains draft unless founder/admin smoke tests pass;
- payment providers remain disabled/test mode;
- no secret value appears in frontend code, screenshots, chat, docs, or public GitHub.
