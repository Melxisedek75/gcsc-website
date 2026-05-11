# SmartContractor Deploy Platform Decision Brief

Date: 2026-05-06

Purpose: give the founder a short, non-technical deploy-platform decision packet before public beta setup. This document does not require secrets, account access, live Supabase changes, payments, loans, escrow, or token actions.

## Recommendation

Use Vercel for the first public SmartContractor web app deployment.

Reason: SmartContractor is already a Node/Express-style local MVP with backend routes, environment variables, auth callbacks, admin checks, and future payment-provider adapters. Vercel is the most direct path for a public beta that needs server-side API routes and strict environment-variable separation.

## Founder Action

1. Open `vercel.com`.
2. Sign in with the GitHub account that owns the GCSC repository.
3. Import the GCSC repository.
4. Set the app root to the SmartContractor app folder if Vercel asks for a project directory.
5. Add only placeholder or reviewed environment variables first.
6. Do not paste `SUPABASE_SERVICE_ROLE_KEY` until strict Auth/RLS/admin checks are ready and the founder is present.
7. Keep payment providers in test or disabled mode.

## Platform Options

| Option | Fit For MVP | Use Now? | Notes |
|--------|-------------|----------|-------|
| Vercel | Strong | Yes | Best first target for web app + backend API routes + env management. |
| GitHub Pages | Weak | No | Good for static landing pages, not enough for backend Auth/admin/payment routes. |
| Supabase Edge Functions | Medium | Later | Useful for isolated backend functions after Auth/RLS is settled. |
| Azure App Service | Medium | Later | Good for Microsoft/startup path, but heavier setup for first public beta. |

## Safety Boundaries

Do not enable these during the first deploy-platform setup:

- real contractor loans;
- real escrow or stored-value flows;
- production payment provider mode;
- automatic payment release;
- token collateral locking, liquidation, or settlement;
- broad RLS policies such as `USING true`;
- service-role keys in frontend files, screenshots, chat, or public GitHub files.

## Acceptance Check

The deploy-platform decision is ready when:

- Vercel is selected as the first public beta target, or the founder intentionally chooses another platform;
- the selected platform can store server-only environment variables;
- the selected platform supports SmartContractor backend routes;
- Supabase Auth redirect URLs can be configured for the deployed domain;
- `npm run check` passes before connecting real users.

