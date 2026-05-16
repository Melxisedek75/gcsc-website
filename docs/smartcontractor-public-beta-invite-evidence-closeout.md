# SmartContractor Public Beta Invite Evidence Closeout

Status: INTERNAL_INVITE_EVIDENCE_CLOSEOUT_ONLY

## Purpose

Close the local evidence checklist that must be complete before Codex may ask the founder for a first demo-only public beta invite release decision.

This closeout connects deployment closeout, URL smoke evidence, deploy-to-invite handoff, first cohort scope, tester-code rules, support/rollback ownership, and the exact founder approval phrase without sending invites or sharing a public URL.

## What This Does Not Approve

This closeout is not approval to publish or share a public beta URL.

This closeout is not approval to send tester invites.

This closeout is not approval to change Vercel, GitHub Pages, Namecheap, Supabase, DNS, Auth redirects, payment providers, app stores, billing, teams, or external account settings.

This closeout is not approval to perform a production deploy, enter secrets, update Supabase redirects, change live RLS, activate founder admin roles, enable production provider calls, or modify live systems.

This closeout is not approval to enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, token collateral, legal/provider commitments, financial commitments, public launch, or destructive actions.

## Source Documents

- `docs/smartcontractor-deployment-founder-external-setup-closeout.md`
- `docs/smartcontractor-deployment-live-action-decision-packet.md`
- `docs/smartcontractor-public-beta-invite-release-decision-packet.md`
- `docs/smartcontractor-public-beta-url-smoke-evidence-intake.md`
- `docs/smartcontractor-public-beta-deploy-to-invite-handoff.md`
- `docs/smartcontractor-public-beta-first-cohort-launch-packet.md`
- `docs/smartcontractor-public-beta-founder-execution-plan.md`
- `docs/smartcontractor-beta-tester-invite.md`
- `docs/smartcontractor-public-beta-smoke-commands.md`
- `docs/smartcontractor-beta-issue-log-template.md`

## Closeout States

| State | Meaning | Allowed Next Step |
| --- | --- | --- |
| READY_TO_REQUEST_INVITE_APPROVAL | All required local evidence is complete, redacted, demo-only, tied to the expected deployed commit, and support/rollback owners are known | Ask founder for the exact invite-release approval phrase |
| NOT_READY_FOR_INVITES | One or more evidence fields are missing, stale, unclear, unreviewed, private, or tied to the wrong environment | Continue internal prep only |
| HOLD_FOR_URL_SMOKE_EVIDENCE | URL smoke evidence is missing, stale, wrong-commit, missing request IDs, missing headers, or missing Auth/no-real-money checks | Re-run founder-controlled smoke evidence |
| HOLD_FOR_NO_REAL_MONEY_RECHECK | Any page, API, wording, or tester instruction appears to enable live payment, loan, escrow, repayment, stablecoin, or token collateral behavior | Recheck and block invite release |
| HOLD_FOR_SUPPORT_ROLLBACK_OWNER | Support owner, response window, rollback owner, or hold decision owner is missing | Founder names owners before invite approval request |
| HOLD_FOR_TESTER_SCOPE_REVIEW | Tester batch is larger than 3-5 people, uses real identities in tracked docs, or includes unreviewed testers | Re-scope to tester codes only |
| BLOCKED_FOR_EXTERNAL_ACTION | The next step requires invites, URL sharing, external account changes, live deploy/account settings, secrets, legal/provider commitments, public launch, or money actions | Stop for founder-controlled action |

## Required Evidence Fields

Use this tracked, redacted record before requesting founder invite approval:

```text
deploy_closeout_state:
public_beta_url_status:
url_smoke_checked_at:
deployed_commit_confirmed:
request_id_sample_present:
security_headers_checked:
auth_redirect_status:
no_real_money_banner_visible:
disabled_payment_loan_actions_confirmed:
support_owner_confirmed:
rollback_owner_confirmed:
tester_batch_scope:
tester_code_only_confirmed:
redaction_status:
founder_invite_release_phrase_status:
invite_closeout_state:
```

Keep real URLs, tester names, tester emails, phone numbers, addresses, account IDs, wallet IDs, cookies, Authorization headers, Magic Link URLs, private screenshots, raw response bodies, payment data, and secret-looking values out of tracked docs.

## Automatic HOLD Rules

Use HOLD or BLOCKED when any of these are true:

- URL smoke evidence is missing, stale, unreviewed, private, tied to the wrong commit, or tied to the wrong environment.
- The deployed commit is unknown or not confirmed against the reviewed source commit.
- A safe request ID sample is missing.
- security headers are not checked.
- Auth redirect status is unknown or includes Magic Link URLs, cookies, tokens, or private Auth data.
- no-real-money banner or demo-only boundary is missing.
- payment actions, loan actions, escrow, repayment routing, stablecoin settlement, or token collateral actions appear enabled.
- support owner, response window, rollback owner, or hold decision owner is missing.
- tester batch is larger than 3-5 people or includes unreviewed testers.
- tracked docs contain real tester identities, private contact data, raw URLs, private screenshots, raw response bodies, or secret-looking values.
- invite wording omits demo-only, no real payment, no real loan, no real escrow, no repayment routing, no stablecoin settlement, no token collateral, or no legal decision boundaries.
- the founder approval phrase is bundled with other approvals, copied from an old packet, or not recorded as a fresh standalone invite-release decision.

## Founder Approval Boundary

Exact future phrase from the invite release decision packet:

```text
I approve releasing the first demo-only public beta invite batch using the reviewed URL evidence and tester-code list only.
```

This phrase can release only the reviewed first demo-only invite batch after evidence is complete. It is not approval for production launch, public announcement, DNS changes, Supabase Auth redirect changes, payment/provider setup, real loans, escrow, repayment routing, stablecoin settlement, token collateral, app store release, legal/provider commitments, or adding unreviewed testers.

## Required Checks

Run these before requesting invite approval:

```powershell
npm run check:public-beta-invite-evidence-closeout
npm run check:deployment-founder-external-setup-closeout
npm run check:deployment-live-action-decision-packet
npm run check:public-beta-url-smoke-evidence-intake
npm run check:public-beta-deploy-to-invite-handoff
npm run check:public-beta-invite-release-decision-packet
npm run check:public-beta-first-cohort-launch-packet
npm run check:public-beta-founder-execution-plan
npm run check:public-beta-smoke-commands
npm run check:real-status-audit
npm run check
```

## Acceptance Check

This closeout is accepted only when the repo has a local validator, context, backlog, and real-status audit entry proving the invite evidence gate is ready for a founder approval request while public URL sharing, tester invites, external accounts, production deploy, Supabase redirects, provider setup, real-money features, legal/provider commitments, public launch, and destructive actions remain blocked.
