# SmartContractor Deployment Live Action Decision Packet

Status: INTERNAL_DEPLOYMENT_LIVE_ACTION_DECISION_PACKET_ONLY. This is not approval to connect Vercel, GitHub Pages, Namecheap, Supabase, DNS, payment providers, app stores, or any other external account. It is not approval to deploy production, enter secrets, change Supabase Auth redirects, publish a public beta URL, not approval to enable real payments, enable real loans, enable real escrow, enable repayment routing, enable stablecoin settlement, enable token collateral, or make legal/provider commitments.

Purpose: give the founder one safe evening decision packet for deployment live actions. It separates what Codex can prepare internally from what the founder must do directly in external accounts.

## Source Documents

Use these documents before any deployment action:

- `docs/smartcontractor-deployment-decision-prep.md`
- `docs/smartcontractor-deploy-platform-decision-brief.md`
- `docs/smartcontractor-vercel-preflight.md`
- `docs/smartcontractor-vercel-env-matrix.md`
- `docs/smartcontractor-vercel-postdeploy-checklist.md`
- `docs/smartcontractor-public-beta-env-report-template.md`
- `docs/smartcontractor-founder-auth-admin-live-decision-packet.md`
- `docs/smartcontractor-public-beta-founder-execution-plan.md`
- `docs/smartcontractor-public-beta-first-cohort-launch-packet.md`

## Recommended Decision

Use Vercel as the first hosted SmartContractor public beta demo target after local checks, Founder Auth/Admin review, demo-only scope, no-real-money flags, and rollback readiness are confirmed.

Use GitHub Pages only for static docs, static landing pages, public whitepaper mirrors, or read-only public information that does not need API/Auth behavior.

Keep local-only if founder Auth/Admin evidence is incomplete, environment variables are not ready, Supabase redirect URLs are not planned, or the founder is not ready to manage external account setup.

## Decision States

| State | Meaning | Allowed Next Step |
| --- | --- | --- |
| READY_FOR_FOUNDER_EXTERNAL_SETUP | Local checks pass, deployment target is selected, environment names are known, demo-only scope is clear, and rollback gates are ready | Founder may open the external deployment account and perform setup directly |
| NOT_READY_FOR_DEPLOY | Local checks, Auth/Admin review, env matrix, beta scope, or rollback plan are incomplete | Continue internal prep only |
| BLOCKED_FOR_EXTERNAL_ACTION | The next step requires account login, GitHub/Vercel import, DNS, env secret entry, Supabase dashboard change, public launch, or payment/provider setup | Codex stops and waits for founder action |

## Founder External Setup Checklist

When ready, the founder controls the external setup:

1. Choose deploy mode: Vercel demo app first, GitHub Pages docs-only, or local-only.
2. Open the external dashboard personally.
3. Import/connect the GitHub repository only if ready.
4. Enter environment variables inside the deploy dashboard personally.
5. Keep service-role, payment, lender, provider, database, private key, and token values out of chat.
6. After the deployed URL exists, decide whether Supabase Auth redirect settings should be updated.
7. Run post-deploy smoke checks before any tester invite.
8. Keep public beta demo-only until live-risk gates are separately approved.

## Codex Internal Scope

Codex may prepare:

- deployment decision docs;
- Vercel preflight checklists;
- environment variable name matrix with no values;
- post-deploy smoke command list;
- public beta environment report template;
- rollback and incident response docs;
- no-real-money public beta boundaries;
- scoped commits and pushes after checks pass.

Codex may not autonomously:

- connect Vercel;
- change GitHub Pages settings;
- change Namecheap or DNS settings;
- enter environment variable values;
- change Supabase Auth redirect URLs;
- add service-role keys;
- trigger production deploys;
- publish public beta links;
- send tester invites;
- enable production payment capture;
- enable real loans, real escrow, repayment routing, stablecoin settlement, or token collateral.

## Environment Boundary

Environment names may be documented, but values must be entered only by the founder inside the chosen external platform.

Demo-safe names:

- `PUBLIC_SITE_URL`
- `ALLOWED_ORIGINS`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SMARTCONTRACTOR_AUTH_MODE`
- `SMARTCONTRACTOR_ROUTE_PROTECTION`
- `SMARTCONTRACTOR_ADMIN_ENFORCEMENT_MODE`
- `GCSC_XPR_RECEIVER_ACCOUNT`
- `METAL_PAY_CONNECT_ENV`

Founder-only secret values:

- `SUPABASE_SERVICE_ROLE_KEY`
- payment-provider secrets;
- lender/provider credentials;
- database passwords;
- private keys;
- seed phrases;
- signing keys;
- raw access tokens.

## Environment Value Provenance Boundary

Codex may name environment variable categories and placeholders only. Codex must not collect, infer, store, paste, or verify real production values in chat, docs, commits, screenshots, logs, or generated packets.

Founder-controlled provenance rules:

- the founder must enter actual production values directly in the external dashboard;
- Do not paste .env values, API keys, service-role keys, passwords, tokens, webhook secrets, or raw provider credentials into chat or docs;
- demo-safe variables can be documented only as categories, not real production values;
- public/client environment values still need founder review before deploy because URLs, project IDs, and redirect origins can reveal account structure or route traffic incorrectly;
- any environment value mismatch stays BLOCKED_FOR_EXTERNAL_ACTION until founder-controlled setup is corrected and rechecked.

## Public Beta No-Real-Money Gate

The first hosted beta must remain demo-only:

- no production payment capture;
- no real contractor loans;
- no real escrow or stored-value flow;
- no real repayment routing;
- no stablecoin settlement;
- no token collateral locking, liquidation, or settlement;
- no automatic admin assignment;
- no legal/provider claims;
- no public launch announcement without separate approval.

## Rollback Gate

Before founder external setup is considered ready, confirm:

- owner who can pause or revert the deployment;
- last known good commit;
- rollback command or dashboard path;
- post-deploy smoke checklist;
- incident response doc;
- tester communication boundary;
- no-real-money flags remain disabled.

## Founder Deployment External Action Approval Phrase Boundary

External deployment setup cannot move beyond internal prep unless the founder records the exact standalone phrase below with the required non-secret fields. This phrase is for founder-controlled setup readiness only, not broad production launch or money-flow approval.

`DEPLOYMENT_EXTERNAL_ACTION_RECORDED`

Exact phrase must be a standalone line, not embedded in a longer sentence or checklist note.

Required non-secret fields:

- deployment_external_action_platform: Vercel demo app, GitHub Pages docs-only, local-only hold, or other founder-selected host;
- deployment_external_action_scope: account review, repository import, environment-name review, preview deploy, post-deploy smoke, Supabase redirect review, or rollback review;
- deployment_external_action_owner: founder, deployment account owner, environment owner, rollback owner, or HOLD_FOR_OWNER;
- deployment_external_action_evidence_file: local checklist, redacted setup report, smoke evidence template, or founder report-back path;
- deployment_external_action_blocked_action: Do not treat this phrase as approval to enter secrets, service-role keys, payment-provider credentials, lender/provider credentials, private keys, seed phrases, database passwords, change DNS, change Supabase Auth redirects, enable payments, originate loans, hold escrow, route repayments, settle stablecoins, lock token collateral, make legal/provider commitments, or launch publicly.

## Required Checks

Before treating this packet as complete, run:

```powershell
npm run check:deployment-live-action-decision-packet
npm run check:deployment-decision-prep
npm run check:deploy-brief
npm run check:vercel-preflight
npm run check:vercel-env-matrix
npm run check:vercel-postdeploy
npm run check:public-beta-env-report
npm run check:public-beta-founder-execution-plan
npm run check:public-beta-first-cohort-launch-packet
npm run check:real-status-audit
npm run check
```

## Acceptance Check

This packet passes only when the deployment decision path is clear, Vercel/GitHub Pages/local-only roles are separated, founder-only external actions are explicit, environment values stay out of docs and chat, public beta remains no-real-money, rollback is required before tester invites, and all external accounts, DNS, Supabase redirects, secrets, production deploys, payment/provider actions, legal/provider commitments, and public launch actions remain blocked until separate founder-controlled approval.
