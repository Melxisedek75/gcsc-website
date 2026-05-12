# SmartContractor Public Beta Environment Report Template

Purpose: give the founder one safe report format after preparing a public beta environment such as Vercel. This keeps deployment setup reviewable without exposing secrets.

This template does not connect external accounts, change Vercel settings, change Supabase production settings, approve service-role key use, activate production payments, activate real loans, activate escrow, or activate token collateral.

## No Secrets

Do not paste or attach:

- Supabase service-role key, database password, JWT secret, API keys, provider secrets, private keys, seed phrases, or signing keys;
- Magic Link URLs, authorization headers, cookies, raw tokens, or full request bodies;
- customer emails, phone numbers, addresses, wallet details, payment data, or unredacted screenshots.

## Safe Report-Back

Use this exact short format:

```text
SmartContractor public beta environment:
Platform: Vercel / other / not selected
PUBLIC_SITE_URL: set / not set / blocked
CORS origins: set / not set / blocked
Supabase Auth redirect: set / not set / blocked
Magic Link: tested / not tested / blocked
service-role key: stored server-side only / not configured / blocked
real payments disabled: confirmed / not confirmed
real loans disabled: confirmed / not confirmed
escrow disabled: confirmed / not confirmed
token collateral disabled: confirmed / not confirmed
request ID: none / safe request ID only
Founder Decision: Go / Review / No-Go
Notes: one short sentence, no secrets
```

## Environment Gates

| Gate | Safe evidence | Founder Decision |
|------|---------------|------------------|
| Platform | Vercel or other deployment target selected by founder | Go / Review / No-Go |
| PUBLIC_SITE_URL | Public URL exists and matches the deployed beta domain | Go / Review / No-Go |
| CORS origins | Local and public origins are listed without wildcards | Go / Review / No-Go |
| Supabase Auth redirect | Public callback/redirect URL is configured by founder | Go / Review / No-Go |
| Magic Link | Login email can be requested and opened in the same browser | Go / Review / No-Go |
| service-role key | Stored only in server-side env, never in frontend or chat | Go / Review / No-Go |
| request ID | API responses expose safe request ID for debugging | Go / Review / No-Go |
| real payments disabled | Public beta cannot capture real payments | Go / Review / No-Go |
| real loans disabled | Public beta cannot originate real loans | Go / Review / No-Go |
| escrow disabled | Public beta cannot release escrow | Go / Review / No-Go |
| token collateral disabled | Public beta cannot lock, liquidate, or promise token collateral | Go / Review / No-Go |

## Automatic No-Go

Public beta environment is No-Go if any of these are true:

- service-role key appears in frontend code, browser console, screenshots, GitHub, chat, or public logs;
- Supabase Auth redirect is missing for the deployed public URL;
- PUBLIC_SITE_URL is wrong or points to localhost in public beta;
- CORS origins use an unsafe wildcard for public beta;
- Magic Link cannot be tested safely;
- real payments disabled is not confirmed;
- real loans disabled is not confirmed;
- escrow disabled is not confirmed;
- token collateral disabled is not confirmed;
- any screenshot or log contains secrets, raw tokens, private contact data, wallet data, payment data, or unredacted request bodies.

## Recommended Current Decision

Recommended current state: Review.

Reason: the local code and runbooks are ready, but deploy account connection, public environment variables, Supabase Auth redirect setup, server-only secret placement, and demo-only real-money disablement proof are founder-controlled steps.
