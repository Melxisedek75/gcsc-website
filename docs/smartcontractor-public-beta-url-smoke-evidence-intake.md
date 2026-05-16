# SmartContractor Public Beta URL Smoke Evidence Intake

Status: INTERNAL_PUBLIC_BETA_URL_SMOKE_EVIDENCE_INTAKE_ONLY

## Purpose

Give the founder one redacted intake record for public beta URL smoke evidence before any first-batch invite release decision is requested.

This intake turns the read-only smoke command output into a safe tracked summary. It keeps the real URL, private tester data, cookies, tokens, and raw response bodies out of repo docs.

## What This Does Not Approve

This intake is not approval to deploy.

This intake is not approval to share a public beta URL.

This intake is not approval to send tester invites.

This intake is not approval to change Vercel, GitHub Pages, Namecheap, Supabase, DNS, Auth redirects, payment providers, app stores, or external account settings.

This intake is not approval to enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, token collateral, production provider API calls, or public launch.

## Source Documents

- `docs/smartcontractor-deployment-decision-prep.md`
- `docs/smartcontractor-public-beta-smoke-commands.md`
- `docs/smartcontractor-public-beta-invite-release-decision-packet.md`
- `docs/smartcontractor-public-beta-first-cohort-launch-packet.md`

## Evidence Fields

Use this record in tracked docs or founder-facing summaries:

```text
url_evidence_recorded_at:
public_beta_url_label:
deployment_platform:
deployed_commit:
environment_label:
smoke_checked_at:
smoke_owner:
app_shell_result:
api_health_result:
beta_readiness_result:
mobile_install_readiness_result:
production_readiness_result:
security_headers_result:
request_id_sample:
auth_redirect_status:
no_real_money_banner_result:
payment_actions_disabled_result:
loan_actions_disabled_result:
escrow_disabled_result:
token_collateral_disabled_result:
rollback_or_hold_decision:
decision: HOLD_FOR_PUBLIC_BETA_URL_REVIEW, HOLD_FOR_RESMOKE, REVIEW, or READY_FOR_INVITE_RELEASE_REVIEW
```

The real URL may stay in founder-controlled private notes; tracked docs should use public_beta_url_label or url_id only.

## Required Smoke Results

Before a public beta URL can support invite-release review, the founder-controlled smoke record should confirm:

- app shell reachable;
- `/api/health` reachable;
- `/api/admin/beta-readiness` reachable or intentionally blocked with safe request ID;
- `/api/admin/mobile-install-readiness` reachable or intentionally blocked with safe request ID;
- `/api/admin/production-readiness` reachable or intentionally blocked with safe request ID;
- `X-Request-Id` present in responses or safe JSON body;
- security headers checked, including Content-Security-Policy or documented equivalent, Referrer-Policy, Permissions-Policy, and X-Frame-Options;
- Auth redirect status checked without pasting Magic Link URLs or tokens;
- no-real-money banner or demo-only boundary visible;
- payment actions disabled or clearly simulated;
- loan actions disabled or clearly simulated;
- escrow disabled;
- token collateral disabled;
- rollback_or_hold_decision recorded.

## Decision States

Use `HOLD_FOR_PUBLIC_BETA_URL_REVIEW` when evidence is missing, stale, unreviewed, private, or not tied to the expected commit.

Use `HOLD_FOR_RESMOKE` when a URL changes, expires, rotates, points to a different commit, changes environment, loses request-id/security/no-real-money evidence, or shows live-risk capability.

Use `REVIEW` when smoke evidence is mostly complete but the founder must inspect one open item before invite-release approval can be requested.

Use `READY_FOR_INVITE_RELEASE_REVIEW` only when evidence is complete, redacted, demo-only, and tied to the expected deployed commit.

## HOLD Defaults

Missing deployed_commit, smoke_checked_at, request_id_sample, disabled real-money evidence, or rollback_or_hold_decision defaults to HOLD_FOR_PUBLIC_BETA_URL_REVIEW.

If the URL changes, expires, rotates, points to a different commit, changes environment, loses request-id/security/no-real-money evidence, or shows live-risk capability, use HOLD_FOR_RESMOKE.

If a smoke record includes a real public URL, tester identity, contact detail, cookie, Authorization header, Magic Link URL, Supabase key, service-role key, payment key, wallet data, or customer address, stop and create a redacted replacement before continuing.

## Redaction Rules

Do not paste real public beta URLs, tester names, tester contact details, cookies, Authorization headers, Magic Link URLs, Supabase keys, service-role keys, database URLs, payment provider keys, wallet data, customer addresses, screenshots with private data, or raw response bodies into tracked docs.

Allowed tracked evidence:

- public_beta_url_label or url_id;
- deployed_commit;
- environment_label;
- smoke_checked_at;
- smoke_owner role;
- pass/fail/blocked statuses;
- safe request ID sample;
- redacted screenshot status;
- rollback_or_hold_decision.

## Safe Founder Report Back

```text
Public beta URL smoke evidence intake
Scope: demo only
public_beta_url_label:
deployment_platform:
deployed_commit:
environment_label:
smoke_checked_at:
smoke_owner:
app_shell_result:
api_health_result:
beta_readiness_result:
mobile_install_readiness_result:
production_readiness_result:
security_headers_result:
request_id_sample:
auth_redirect_status:
no_real_money_banner_result:
payment_actions_disabled_result:
loan_actions_disabled_result:
escrow_disabled_result:
token_collateral_disabled_result:
rollback_or_hold_decision:
decision:
Redaction confirmed: yes / no / review
Live-risk actions taken: none
```

## Invite Release Linkage

This intake can support asking for the invite release approval phrase only after every evidence field is complete and redacted.

This intake does not replace the exact invite release approval phrase.

Do not ask for invite release if the decision is `HOLD_FOR_PUBLIC_BETA_URL_REVIEW`, `HOLD_FOR_RESMOKE`, or `REVIEW`.

## Required Checks

- `npm run check:public-beta-url-smoke-evidence-intake`
- `npm run check:public-beta-smoke-commands`
- `npm run check:deployment-decision-prep`
- `npm run check:public-beta-invite-release-decision-packet`
- `npm run check:public-beta-first-cohort-launch-packet`
- `npm run check:real-status-audit`
- `npm run check`

## Acceptance Check

The founder has one safe, redacted intake record that can prove whether a public beta URL is ready for invite-release review without storing real URLs, secrets, tester identities, private contact details, live-money evidence, external account settings, or public launch approval in tracked docs.
