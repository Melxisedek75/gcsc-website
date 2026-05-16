# SmartContractor Deployment Founder External Setup Closeout

Status: INTERNAL_EXTERNAL_SETUP_CLOSEOUT_ONLY

Purpose: close out the internal deployment prep package before the founder opens Vercel, GitHub Pages, Namecheap, Supabase, DNS, app store, payment provider, or any other external account. This closeout confirms that Codex has prepared only local docs/checks, named environment categories without values, demo-only beta scope, rollback gates, and post-deploy smoke evidence requirements.

This does not approve connecting Vercel, GitHub Pages, Namecheap, Supabase, DNS, app stores, payment providers, external accounts, production deploy, entering secrets, changing Supabase Auth redirects, publishing a public beta URL, sending tester invites, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, legal/provider decisions, public launch, or destructive actions.

## Source Documents

Use this source set before external setup:

- `docs/smartcontractor-deployment-decision-prep.md`
- `docs/smartcontractor-deployment-founder-env-map.md`
- `docs/smartcontractor-deployment-live-action-decision-packet.md`
- `docs/smartcontractor-deploy-platform-decision-brief.md`
- `docs/smartcontractor-vercel-preflight.md`
- `docs/smartcontractor-vercel-founder-setup-walkthrough.md`
- `docs/smartcontractor-vercel-env-matrix.md`
- `docs/smartcontractor-vercel-postdeploy-checklist.md`
- `docs/smartcontractor-public-beta-env-report-template.md`
- `docs/smartcontractor-public-beta-smoke-commands.md`
- `docs/smartcontractor-public-beta-url-smoke-evidence-intake.md`
- `docs/smartcontractor-public-beta-deploy-to-invite-handoff.md`

## Closeout States

| State | Meaning | Allowed Next Step |
| --- | --- | --- |
| READY_FOR_FOUNDER_EXTERNAL_SETUP | Local checks pass, host decision is understood, environment names are categorized with no values, demo-only scope is clear, rollback gates are defined, and smoke evidence requirements are ready | Founder may personally open the external account and perform setup |
| NOT_READY_FOR_DEPLOY | Local checks, host decision, environment categories, no-real-money scope, rollback gates, or smoke evidence requirements are incomplete | Continue internal prep only |
| HOLD_FOR_ENV_VALUE_REDACTION | Any real env value, secret-looking value, token, password, service-role key, webhook secret, database URL, private key, seed phrase, or raw `.env` content appears in docs/evidence | Redact locally and repeat safe prep |
| HOLD_FOR_ACCOUNT_OWNERSHIP_REVIEW | Account owner, browser profile, billing exposure, MFA, workspace/repo scope, or external setup owner is unclear | Founder resolves account ownership outside Codex |
| HOLD_FOR_SMOKE_EVIDENCE | Preview/public URL exists but smoke evidence, request ID sample, no-real-money checks, security headers, rollback owner, or tested routes are missing | Run founder-controlled smoke evidence before tester invites |
| BLOCKED_FOR_EXTERNAL_ACTION | The next step requires external account login, import, DNS, env entry, Supabase dashboard change, production deploy, public link sharing, tester invite, payment/provider setup, legal/provider commitment, or real-money activation | Stop for founder-controlled external/live/legal/money action |

## Required Founder-Controlled Evidence

Record only non-secret status:

```text
deployment_mode_selected:
external_account_owner_confirmed:
account_browser_profile_confirmed:
billing_plan_reviewed:
mfa_status_confirmed:
github_repository_scope_confirmed:
environment_names_reviewed_no_values:
founder_enters_values_directly:
supabase_redirect_change_needed:
preview_or_public_url_status:
postdeploy_smoke_status:
request_id_sample_present:
no_real_money_flags_confirmed:
rollback_owner_confirmed:
tester_invites_status:
closeout_state:
```

## Automatic HOLD Rules

Return NOT_READY or a HOLD state when any of these appear:

- deployment host is unclear;
- external account owner is unclear;
- browser profile or workspace ownership is unclear;
- MFA status is missing;
- billing exposure is unknown;
- GitHub repository/project scope is mismatched or unclear;
- environment names are missing;
- any environment value appears in chat, docs, screenshots, logs, or commits;
- service-role key, API key, token, password, webhook secret, database URL, private key, seed phrase, or raw `.env` content appears;
- preview/public URL exists without post-deploy smoke evidence;
- request ID sample is missing;
- no-real-money flags are missing;
- rollback owner or rollback trigger is missing;
- tester invites are requested before smoke evidence is closed.

Return BLOCKED_FOR_EXTERNAL_ACTION when the next requested action is to:

- connect Vercel;
- change GitHub Pages settings;
- change Namecheap or DNS;
- import/connect a repository in an external dashboard;
- enter environment variable values;
- change Supabase Auth redirect URLs;
- enter service-role keys;
- trigger production deploys;
- publish public beta links;
- send tester invites;
- enable production payment capture;
- enable real loans;
- enable real escrow;
- enable repayment routing;
- enable stablecoin settlement;
- enable token collateral;
- make legal/provider commitments;
- launch publicly;
- perform destructive action.

## Founder Copy/Paste Closeout

```text
Deployment founder external setup closeout
deployment_mode_selected: [Vercel demo app / GitHub Pages docs-only / local-only / unknown]
external_account_owner_confirmed: [yes / no / unknown]
account_browser_profile_confirmed: [yes / no / unknown]
billing_plan_reviewed: [yes / no / unknown]
mfa_status_confirmed: [yes / no / unknown]
github_repository_scope_confirmed: [yes / no / unknown]
environment_names_reviewed_no_values: [yes / no]
founder_enters_values_directly: [yes / no]
supabase_redirect_change_needed: [yes / no / later / unknown]
preview_or_public_url_status: [none / preview exists / public URL exists / unknown]
postdeploy_smoke_status: [not run / passed / failed / unknown]
request_id_sample_present: [yes / no]
no_real_money_flags_confirmed: [yes / no]
rollback_owner_confirmed: [yes / no]
tester_invites_status: [not sent / requested / sent / unknown]
closeout_state: [READY_FOR_FOUNDER_EXTERNAL_SETUP / NOT_READY_FOR_DEPLOY / HOLD_FOR_ENV_VALUE_REDACTION / HOLD_FOR_ACCOUNT_OWNERSHIP_REVIEW / HOLD_FOR_SMOKE_EVIDENCE / BLOCKED_FOR_EXTERNAL_ACTION]
```

## Required Checks

Run these before marking the internal deployment prep package ready for founder-controlled external setup:

```powershell
npm run check:deployment-founder-external-setup-closeout
npm run check:deployment-live-action-decision-packet
npm run check:deployment-decision-prep
npm run check:deployment-founder-env-map
npm run check:deploy-brief
npm run check:vercel-preflight
npm run check:vercel-founder-setup-walkthrough
npm run check:vercel-env-matrix
npm run check:vercel-postdeploy
npm run check:public-beta-env-report
npm run check:public-beta-smoke-commands
npm run check:public-beta-url-smoke-evidence-intake
npm run check:public-beta-deploy-to-invite-handoff
npm run check:real-status-audit
npm run check
```

## Acceptance Check

The internal deployment prep package is ready only when `npm run check:deployment-founder-external-setup-closeout` passes and the closeout state is READY_FOR_FOUNDER_EXTERNAL_SETUP. External setup, deploy, Supabase redirect changes, public URL sharing, tester invites, provider setup, legal decisions, real-money features, and destructive actions still require founder-controlled action outside this local closeout.
