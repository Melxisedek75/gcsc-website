# SmartContractor Public Beta Deploy-To-Invite Handoff

Status: INTERNAL_DEPLOY_TO_INVITE_HANDOFF_ONLY

## Purpose

Give the founder one calm internal sequence from future deployment setup to the first demo-only public beta invite release request.

This handoff connects deployment prep, Vercel setup, environment report, smoke commands, URL smoke evidence intake, invite release decision, first cohort packet, and launch decision record without approving any live action.

## What This Does Not Approve

This handoff is not approval to deploy.

This handoff is not approval to share a public beta URL.

This handoff is not approval to send tester invites.

This handoff is not approval to change Vercel, GitHub Pages, Namecheap, Supabase, DNS, Auth redirects, payment providers, app stores, billing, teams, or external account settings.

This handoff is not approval to enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, token collateral, production provider API calls, or public launch.

## Source Documents

- `docs/smartcontractor-deployment-decision-prep.md`
- `docs/smartcontractor-vercel-founder-setup-walkthrough.md`
- `docs/smartcontractor-public-beta-env-report-template.md`
- `docs/smartcontractor-public-beta-smoke-commands.md`
- `docs/smartcontractor-public-beta-url-smoke-evidence-intake.md`
- `docs/smartcontractor-public-beta-invite-release-decision-packet.md`
- `docs/smartcontractor-public-beta-first-cohort-launch-packet.md`
- `docs/smartcontractor-public-beta-launch-decision-record.md`

## Four Gate Sequence

| Gate | State | Goal | Stop Condition |
| --- | --- | --- | --- |
| 1 | `HOLD_FOR_EXTERNAL_SETUP` | Founder performs external setup directly if ready | any account, secret, billing, deploy, DNS, redirect, provider, or live setting action |
| 2 | `HOLD_FOR_PUBLIC_BETA_URL_REVIEW` or `HOLD_FOR_RESMOKE` | Founder captures redacted URL smoke evidence | missing commit, request ID, security/no-real-money evidence, rollback owner, or redaction |
| 3 | `READY_FOR_INVITE_RELEASE_REVIEW` | Codex may ask for invite-release review only if smoke evidence is complete | evidence is stale, private, wrong environment, or tied to wrong commit |
| 4 | `READY_TO_REQUEST_PUBLIC_BETA_INVITE_RELEASE` | Founder may use the exact approval phrase for the first demo-only invite batch | tester list, support, known issues, consent/privacy, or redaction is unclear |

## Gate 1: Founder External Setup

Use this gate only when the founder is present and decides to proceed.

- founder opens Vercel or selected host directly;
- Codex does not click external dashboards, enter secrets, connect accounts, change DNS, change Supabase redirects, or deploy;
- founder keeps passwords, keys, cookies, billing details, tokens, and service-role values out of chat;
- if the founder cannot finish safely, stay in `HOLD_FOR_EXTERNAL_SETUP`.

## Gate 2: URL Smoke Evidence

After a deployed demo URL exists, do not share it yet.

Collect redacted evidence only:

- PUBLIC_SITE_URL is labeled, not pasted as a raw tracked URL;
- deployed_commit is recorded;
- environment label is recorded;
- `/api/health` is checked;
- beta readiness and production readiness are checked;
- request_id_sample is present;
- security headers are checked;
- Auth redirect status is checked without Magic Link URLs;
- real payments disabled, real loans disabled, escrow disabled, and token collateral disabled are confirmed;
- rollback_or_hold_decision is recorded.

Use `HOLD_FOR_PUBLIC_BETA_URL_REVIEW` when required evidence is missing.

Use `HOLD_FOR_RESMOKE` when the URL changed, expired, rotated, points to the wrong commit, or loses safety evidence.

## Gate 3: Invite Release Review

Move to `READY_FOR_INVITE_RELEASE_REVIEW` only when:

- URL smoke evidence intake is complete and redacted;
- deployment/environment report is complete and redacted;
- public beta launch decision record is not No-Go;
- first cohort packet still uses 3-5 demo-only testers;
- invite wording stays demo only and no real money;
- support owner and rollback owner are known.

This gate allows Codex to prepare the founder-facing request. It does not allow sending invites.

## Gate 4: First Batch Send/Hold

The founder may proceed only after using the exact invite release approval phrase:

```text
I approve releasing the first demo-only public beta invite batch using the reviewed URL evidence and tester-code list only.
```

Before that phrase is valid:

- first batch remains 3-5 testers;
- tester-code list is reviewed;
- private tester identity/contact map stays outside tracked docs;
- support_owner is known;
- known issues are acceptable for demo-only testing;
- consent, privacy notice, tester FAQ, and quickstart are ready;
- public launch approval: no;
- live-risk actions taken: none.

If any tester is outside the reviewed list, use `HOLD_FOR_TESTER_REVIEW`.

If private tester identity data appears in tracked evidence, use `HOLD_FOR_REDACTION`.

## Founder Copy/Paste Status

```text
SmartContractor deploy-to-invite handoff
Scope: demo only
Gate 1 external setup: HOLD_FOR_EXTERNAL_SETUP / completed by founder / blocked
Gate 2 URL smoke evidence: HOLD_FOR_PUBLIC_BETA_URL_REVIEW / HOLD_FOR_RESMOKE / complete
Gate 3 invite release review: READY_FOR_INVITE_RELEASE_REVIEW / review / blocked
Gate 4 first batch decision: READY_TO_REQUEST_PUBLIC_BETA_INVITE_RELEASE / HOLD_FOR_TESTER_REVIEW / HOLD_FOR_REDACTION / blocked
public_beta_url_label:
deployed_commit:
smoke_evidence_id:
tester_batch_id:
tester_count:
support_owner:
rollback_or_hold_owner:
public launch approval: no
live-risk actions taken: none
```

## Automatic HOLD Rules

If the deployed URL changes, expires, rotates, points to a different commit, loses request-id/security/no-real-money evidence, or shows live-risk capability, return to Gate 2 and use HOLD_FOR_RESMOKE.

If tester names, emails, phone numbers, addresses, account IDs, wallet data, Magic Link URLs, cookies, Authorization headers, or unredacted screenshots enter tracked docs, use HOLD_FOR_REDACTION.

If any real payment, real loan, escrow, repayment routing, stablecoin settlement, token collateral, provider credential, legal decision, DNS change, Supabase redirect change, app store setting, or public launch step is needed, stop before live action.

## Stop Before These Actions

Stop before:

- clicking deploy, connect, import, publish, send, invite, launch, enable, approve, or save inside an external dashboard;
- entering secrets, service-role keys, provider keys, billing details, cookies, tokens, Magic Link URLs, or passwords;
- changing DNS, Supabase Auth redirects, Vercel settings, GitHub Pages settings, payment/provider settings, or app store settings;
- sending tester invites or posting a public beta URL;
- enabling real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, or provider APIs;
- making legal, lender, provider, securities, tax, insurance, investment, or compliance claims.

## Required Checks

- `npm run check:public-beta-deploy-to-invite-handoff`
- `npm run check:deployment-decision-prep`
- `npm run check:vercel-founder-setup-walkthrough`
- `npm run check:public-beta-env-report`
- `npm run check:public-beta-smoke-commands`
- `npm run check:public-beta-url-smoke-evidence-intake`
- `npm run check:public-beta-invite-release-decision-packet`
- `npm run check:public-beta-first-cohort-launch-packet`
- `npm run check:public-beta-launch-decision-record`
- `npm run check:real-status-audit`
- `npm run check`

## Acceptance Check

The founder has one internal bridge from future deployment setup to invite-release review with four explicit gates, exact HOLD states, exact approval phrase linkage, redacted evidence rules, and stop boundaries before deploy, URL sharing, tester invites, external account changes, secrets, legal/provider commitments, money actions, or public launch.
