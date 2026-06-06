# SmartContractor Week 2 Deployment/Public Beta Recheck

Status: LOCAL_RECHECK_ONLY.

Date: 2026-06-06 PT.

Purpose: give the founder one local-only reading order and report-back block for deployment/public beta prep before any Vercel, GitHub Pages, DNS, Namecheap, Supabase redirect, production env, public URL share, tester invite, or production action.

This recheck does not approve deployment, public beta, external account work, live Supabase changes, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, legal/provider decisions, public launch, or production.

## Source Documents And Surfaces

Read in this order:

1. `docs/smartcontractor-deployment-decision-prep.md`
2. `docs/smartcontractor-vercel-founder-setup-walkthrough.md`
3. `docs/smartcontractor-vercel-preflight.md`
4. `docs/smartcontractor-vercel-env-matrix.md`
5. `docs/smartcontractor-vercel-postdeploy-checklist.md`
6. `docs/smartcontractor-public-beta-url-smoke-evidence-intake.md`
7. `docs/smartcontractor-public-beta-invite-founder-send-checklist.md`
8. `docs/smartcontractor-public-beta-founder-execution-plan.md`
9. `docs/smartcontractor-week-two-auth-admin-readiness-recheck-2026-06-06.md`

Local Admin surfaces:

- `/api/admin/deployment-next-step-readiness`
- `/api/admin/week-two-deployment-public-beta-readiness`
- `/api/admin/week-two-deployment-public-beta-execution-checklist`
- `/api/admin/admin-evidence-export-preview?source_filter=week_two_deployment_public_beta_readiness`
- `/api/admin/admin-evidence-export-preview?source_filter=week_two_deployment_public_beta_execution_checklist`

## Week 2 Deployment Recheck Sequence

1. Confirm the deployment target label: `Vercel`, `GitHub Pages docs/static-only`, `local-only hold`, or another founder-owned host.
2. Confirm the external account session owner and browser profile owner without recording passwords, cookies, tokens, MFA codes, billing details, or account screenshots.
3. Confirm the repository/project scope and root directory plan. For Vercel, root directory remains `construction-ai`.
4. Confirm the latest local check run owner and result before any external setup review.
5. Confirm environment variable names only. Do not record production values or secrets.
6. Confirm Supabase redirect owner, but do not update Supabase redirects from this recheck.
7. Confirm a redacted public URL smoke evidence path using `public_beta_url_label` or `url_id`, not a real URL in tracked docs.
8. Confirm no-real-money evidence before any invite-release review.
9. Confirm rollback owner and rollback/hold decision before any tester invite review.

## Current Hold State Matrix

| Area | Current local state | Required founder-controlled evidence | Default if missing |
| --- | --- | --- | --- |
| Deploy target | Review prepared | host label and account owner | NOT_READY_FOR_DEPLOYMENT |
| External account session | Founder-only | browser profile, MFA/billing awareness, workspace owner | BLOCKED_FOR_EXTERNAL_ACTION |
| Env names | Local names prepared | env owner and reviewed names only | HOLD_FOR_ENV_OWNER_REVIEW |
| Supabase redirect | Founder-only | deployed URL exists, redirect owner, rollback owner | HOLD_FOR_AUTH_REDIRECT_REVIEW |
| Public URL smoke | Redacted intake prepared | `public_beta_url_label`, deployed commit, smoke owner, request ID, disabled real-money evidence | HOLD_FOR_PUBLIC_BETA_URL_REVIEW |
| URL rotation | Not shareable by default | fresh smoke record tied to current commit and environment | HOLD_FOR_RESMOKE |
| Tester invite | Separate approval only | complete redacted smoke evidence and invite-release review | HOLD_FOR_INVITE_RELEASE_REVIEW |

## Founder Safe Report-Back

Use this exact shape after the founder reviews account/deployment readiness. Do not paste secrets or real public URLs.

```text
Deployment/Public Beta Week 2 Recheck
Scope: demo only, no real money
deploy_target_label:
account_owner_role:
browser_profile_owner_role:
repository_scope_checked:
root_directory_plan:
latest_local_check_run:
environment_names_reviewed:
environment_values_pasted_to_chat: no
supabase_redirect_owner_role:
supabase_redirect_changed: no
public_beta_url_label_or_url_id:
real_public_url_pasted_to_chat_or_tracked_docs: no
smoke_checked_at:
request_id_sample:
no_real_money_banner_result:
payment_actions_disabled_result:
loan_actions_disabled_result:
escrow_disabled_result:
token_collateral_disabled_result:
rollback_or_hold_decision:
tester_invite_requested: no
decision:
Live-risk actions taken: none
```

## Decision State Matrix

Use `READY_FOR_FOUNDER_ACCOUNT_REVIEW` only when host label, account owner, browser profile owner, repository/project scope, env owner, latest local check run, no-real-money scope, and rollback owner are recorded.

Use `READY_FOR_PUBLIC_URL_SMOKE_REVIEW` only after founder-controlled deployment creates a URL and the tracked evidence uses `public_beta_url_label` or `url_id`, deployed commit, smoke timestamp, safe request ID, disabled real-money evidence, and rollback/hold decision.

Use `READY_FOR_INVITE_RELEASE_REVIEW` only after public URL smoke evidence is complete, redacted, current, demo-only, and tied to the expected deployed commit.

Use `NOT_READY_FOR_DEPLOYMENT` when host, account owner, root directory, env owner, local checks, Auth/Admin readiness, no-real-money scope, or rollback owner is missing.

Use `BLOCKED_FOR_EXTERNAL_ACTION` when the next step is Vercel import, GitHub Pages setting change, DNS/Namecheap change, production env value entry, Supabase redirect update, public URL share, tester invite send, production deploy, or external dashboard action.

## Supabase Redirect And Env Boundary

Supabase redirect review remains separate from deployment target review.

Do not update Supabase Auth redirects until a founder-controlled deployed URL exists and the founder records the exact app origin, callback path, redirect owner, smoke evidence file, request ID sample, and rollback owner.

Do not paste `SUPABASE_SERVICE_ROLE_KEY`, database passwords, Magic Link URLs, Authorization headers, cookies, payment-provider keys, private keys, seed phrases, raw tokens, or raw `.env` values into chat or tracked docs.

## Public URL And Invite Boundary

Do not paste a real public beta URL into chat or tracked docs.

Tracked docs may use only `public_beta_url_label` or `url_id`.

Old preview links, screenshots, copied browser tabs, expired deployments, forwarded links, wrong-branch builds, missing request IDs, or stale smoke records are not share approval.

Tester invite release remains a separate founder decision. This recheck cannot approve invite sending, public URL sharing, public beta launch, production deploy, legal/provider commitments, or any real-money feature.

## Codex Scope

Codex may update local docs, validators, Admin readiness surfaces, and smoke templates.

Codex must stop before external account login, Vercel import, GitHub Pages settings, DNS/Namecheap changes, production env value entry, Supabase dashboard changes, public URL sharing, tester invites, live Supabase writes, strict RLS apply, real finance, legal/provider decisions, XPR signatures, production deploy, or public launch.

## Required Checks

Run from `C:\gcsc\construction-ai`:

```powershell
npm run check:week-two-deployment-public-beta-recheck
npm run check:deployment-decision-prep
npm run check:vercel-founder-setup-walkthrough
npm run check:vercel-preflight
npm run check:vercel-env-matrix
npm run check:vercel-postdeploy
npm run check:public-beta-url-smoke-evidence-intake
npm run check:smartcontractor
npm run check:auth
```

## Acceptance Check

This recheck passes only when the founder has one local-only deployment/public beta reading order, a safe no-secret report-back block, READY/NOT_READY/BLOCKED states, Supabase redirect/env boundaries, public URL smoke HOLD defaults, invite-release separation, and explicit no-external-account, no-deploy, no-public-URL-share, no-tester-invite, no-live-Supabase, no-real-money, no-legal/provider, no-XPR-signature, no-public-launch, and no-production boundaries.
