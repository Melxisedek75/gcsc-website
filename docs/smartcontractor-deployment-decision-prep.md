# SmartContractor Deployment Decision Prep

Date: 2026-05-13 PT

Status: INTERNAL_DEPLOYMENT_DECISION_PREP_ONLY

Purpose: give the founder one practical deployment decision packet for the first SmartContractor public beta without connecting external accounts, changing DNS, setting secrets, changing Supabase Auth redirects, enabling production payments, enabling real loans, enabling escrow, enabling repayment routing, enabling stablecoin settlement, enabling token collateral, or launching publicly.

## Current Recommendation

Use Vercel as the first public beta host for the SmartContractor no-real-money demo.

Reason: SmartContractor is not only a static website. It has backend routes, readiness endpoints, Auth/Admin preparation, request IDs, security headers, demo payment/provider boundaries, and future server-side integrations. Vercel is the cleanest first target for a hosted demo with environment-variable separation and GitHub-based preview deployments.

GitHub Pages can still be useful later for static public documents, a landing page, or whitepaper mirrors, but it should not be the first host for the app backend.

## What This Does Not Approve

This packet is not approval to:

- connect Vercel, GitHub Pages, Namecheap, Supabase, payment providers, or any other external account;
- deploy production;
- change domain or DNS settings;
- enter secrets or service-role keys;
- change Supabase Auth redirect URLs;
- enable real payments;
- enable real loans;
- enable real escrow;
- enable real repayment routing;
- enable stablecoin settlement;
- enable token collateral;
- announce public launch;
- make legal, lender, provider, securities, tax, or compliance decisions.

## Deployment Options

| Option | Best use | Strength | Risk / limit | Current decision |
| --- | --- | --- | --- | --- |
| Vercel | First SmartContractor public beta demo | Supports hosted web app, backend-like routes, server-only environment variables, preview deploys, HTTPS, and GitHub import | Requires founder account connection, careful secret entry, Supabase Auth redirect setup, usage/cost awareness, and rollback discipline | Recommended first app host |
| GitHub Pages | Static docs, public whitepaper mirror, simple landing page | Simple, low-cost, GitHub-native static publishing | Static-only; not enough for Auth/Admin/API behavior unless APIs live elsewhere | Use for docs/landing only |
| Local-only | Founder/admin testing before public beta | Safest while Auth/Admin, service-role boundary, and no-real-money gates are being checked | Not public and cannot support outside beta testers | Keep until founder chooses host |
| Later platform | VPS, Cloudflare, Render, Azure, Supabase Edge Functions | Useful after the first beta when backend needs become clearer | More setup, more account/provider decisions, more security review | Defer |

## Recommended Decision Path

1. Keep local-only until `npm run check` passes and Founder Auth/Admin prep is understood.
2. Select Vercel for the first no-real-money SmartContractor public beta app.
3. Use GitHub Pages only for static docs, whitepaper, or public landing material.
4. Do not select a custom VPS, Render, Cloudflare, Azure, or Supabase Edge Functions path until the first beta proves what the backend needs.

## Founder Decisions Needed Later

The founder must decide or perform these items directly, with no secrets pasted into chat:

1. Confirm deployment host: Vercel first, GitHub Pages docs-only, or local-only for now.
2. Confirm domain strategy: Vercel preview URL first, `xprnet.org`, `www.xprnet.org`, or another domain.
3. Confirm public beta scope: demo-only, no real payments, no real loans, no real escrow, no token collateral.
4. Confirm who enters environment variables inside the deploy platform.
5. Confirm Supabase Auth redirect URL after the deployed URL exists.
6. Confirm rollback owner and rollback trigger before inviting testers.

## Blocked Live Actions

Codex must stop before:

- Vercel import or account connection;
- GitHub Pages repository settings;
- Namecheap, DNS, or custom domain changes;
- environment variable entry inside any external dashboard;
- Supabase Auth redirect changes;
- service-role key setup;
- payment-provider credential setup;
- production deploy;
- public launch or public launch message.

## Environment Categories

Demo-safe values may be prepared as names and descriptions only:

- `PUBLIC_SITE_URL`
- `ALLOWED_ORIGINS`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SMARTCONTRACTOR_AUTH_MODE`
- `SMARTCONTRACTOR_ROUTE_PROTECTION`
- `SMARTCONTRACTOR_ADMIN_ENFORCEMENT_MODE`
- `GCSC_XPR_RECEIVER_ACCOUNT`
- `METAL_PAY_CONNECT_ENV`

Founder-only/server-side values must not be pasted into chat, screenshots, frontend files, docs, or public GitHub:

- `SUPABASE_SERVICE_ROLE_KEY`
- payment-provider secrets
- lender/provider credentials
- private keys, signing keys, seed phrases, database passwords, or raw tokens

Disabled real-money flags must stay disabled or simulated for the first beta:

- real contractor loans;
- real escrow or stored-value handling;
- real repayment routing;
- stablecoin settlement;
- token collateral locking, liquidation, or settlement;
- production payment capture;
- automatic admin assignment.

## Deployment Gates

The first public beta deployment is not ready until:

- local checks pass with `npm run check`;
- deployment target is selected by the founder;
- Founder Auth/Admin activation prep is reviewed;
- strict admin smoke plan is ready;
- service-role key handling is server-only and founder-controlled;
- Supabase Auth redirect update is planned for the selected deployed URL;
- legal/provider real-money blocks remain explicit;
- public beta scope is demo-only and no-real-money;
- rollback owner and rollback command path are known;
- post-deploy checklist is ready before tester invites.

## Preview Smoke Evidence Boundary

Preview smoke evidence is internal evidence only and is not approval for production deploy, tester invites, public launch, domain changes, DNS changes, Supabase redirect changes, payment provider setup, real loans, real escrow, repayment routing, stablecoin settlement, or token collateral.

Each preview smoke record must capture deploy_target, preview_url, commit_sha, check_run, tested_routes, auth_mode, route_protection_mode, admin_enforcement_mode, request_id_sample, security_headers_result, no_real_money_flags_result, tester_invite_status, rollback_status, owner, and decision.

Missing commit_sha, missing check_run, missing tested_routes, missing request_id_sample, missing security_headers_result, or missing no_real_money_flags_result defaults the preview decision to BLOCKED_FOR_EXTERNAL_ACTION.

Preview smoke evidence may support READY_FOR_FOUNDER_EXTERNAL_SETUP only after local checks pass, demo-only scope is confirmed, service-role/provider secrets remain founder-controlled, and rollback owner is recorded.

## No-Real-Money Public Beta Policy

The first public beta may show project contracts, bids, milestones, loan readiness, payment/provider options, disputes, admin review, and readiness endpoints as demo workflows only.

It must not originate loans, move escrow, route repayments, capture production payments, lock token collateral, settle stablecoins, promise lender availability, promise regulatory approval, or claim the system is production finance infrastructure.

## Founder Handoff Sequence

When the founder is ready to deploy:

1. Open the deployment decision packet and confirm Vercel or another host.
2. Run `npm run check` from `C:\gcsc\construction-ai`.
3. Open Vercel and import the GitHub repository.
4. Set root directory to `construction-ai`.
5. Add demo-safe environment variables first.
6. Keep service-role and provider secrets out until strict Auth/Admin and legal/payment gates are reviewed.
7. Use the deployed URL to configure Supabase Auth redirect while the founder is present.
8. Run the post-deploy checklist before inviting any tester.
9. Fill the public beta environment report template without secrets.

## Required Checks

Run from `C:\gcsc\construction-ai`:

```powershell
npm run check:deployment-decision-prep
npm run check:deploy-brief
npm run check:vercel-preflight
npm run check:vercel-env-matrix
npm run check:vercel-postdeploy
npm run check:public-beta-env-report
npm run check:real-status-audit
npm run check
```

## Acceptance Check

Deployment decision prep is ready when the founder can understand:

- why Vercel is the recommended first app host;
- why GitHub Pages is docs/landing only;
- why local-only remains safest before external setup;
- what decisions the founder must make later;
- which live actions are blocked;
- which environment variables are demo-safe versus founder-only;
- what gates must pass before tester invites or public launch.
