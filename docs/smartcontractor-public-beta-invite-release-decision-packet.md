# SmartContractor Public Beta Invite Release Decision Packet

Status: INTERNAL_PUBLIC_BETA_INVITE_RELEASE_DECISION_ONLY

## Decision Goal

Define the exact future founder decision needed before the first demo-only SmartContractor public beta invite batch can move from reviewed prep to invite release.

This packet is an internal gate. It does not send invites, does not share a URL, does not change external accounts, and does not activate live money or production systems.

## Source Documents

- `docs/smartcontractor-public-beta-first-cohort-launch-packet.md`
- `docs/smartcontractor-public-beta-invite-batches.md`
- `docs/smartcontractor-beta-tester-invite.md`
- `docs/smartcontractor-public-beta-review-packet.md`
- `docs/smartcontractor-deployment-decision-prep.md`
- `docs/smartcontractor-deployment-founder-env-map.md`

## What This Does Not Approve

This packet is not approval to send tester invites.

This packet is not approval to share a public beta URL.

This packet is not approval to change Vercel, GitHub Pages, Namecheap, Supabase, DNS, Auth redirects, payment providers, app stores, or external account settings.

This packet is not approval to enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, token collateral, production provider API calls, or public launch.

## Ready State

Use `READY_TO_REQUEST_PUBLIC_BETA_INVITE_RELEASE` only when all of these are true:

- founder-controlled deployed URL smoke evidence exists;
- public beta URL smoke evidence records app shell, /api/health, security headers, request ID, Auth redirect status, no-real-money banner, disabled payment/loan actions, result, and rollback_or_hold_decision;
- first tester wave remains 3-5 people;
- tester identities and private contact details stay outside tracked repo docs;
- tester codes are used instead of names, emails, phones, addresses, or account IDs;
- support intake and issue logs use redacted request IDs or tester codes only;
- no-real-money scope is visible in the invite;
- legal/provider/public-launch questions are not represented as approved.

## Not Ready States

Use `NOT_READY` when any evidence item is missing, stale, unclear, unreviewed, or tied to the wrong deployment target.

Keep the invite batch in `HOLD` or `REVIEW` if the deployed URL is not smoke-checked, the tester-code list is incomplete, support ownership is unclear, redaction status is unknown, or the invite wording does not clearly say demo only.

## Blocked For Live Action

Use `BLOCKED_FOR_LIVE_ACTION` when the next step would require any of these:

- sending the actual invite;
- posting or sharing a public beta URL;
- changing DNS, Vercel, GitHub Pages, Supabase Auth redirects, app store settings, provider settings, payment settings, or production environment values;
- enabling real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, or production provider API calls;
- making legal, compliance, investment, lending, yield, insurance, or provider commitment claims.

## Founder Evidence Record

Use this record before asking for the release decision:

```text
invite_release_recorded_at:
source_commit:
public_beta_url_label:
smoke_evidence_id:
tester_batch_id:
tester_count:
redaction_status:
support_owner:
rollback_or_hold_owner:
decision: HOLD, REVIEW, or READY_TO_REQUEST_PUBLIC_BETA_INVITE_RELEASE
```

Do not put the real public URL, tester names, tester emails, phone numbers, account IDs, wallet IDs, Magic Link URLs, private job details, payment data, or secret values in this tracked record.

## Invite Release Approval Phrase

Exact future phrase:

```text
I approve releasing the first demo-only public beta invite batch using the reviewed URL evidence and tester-code list only.
```

This phrase is not approval for production launch, public announcement, DNS changes, Supabase Auth redirect changes, payment/provider setup, real loans, escrow, repayment routing, stablecoin settlement, token collateral, app store release, legal/provider commitments, or adding unreviewed testers.

## Invite Batch Rules

- Batch 1 is limited to 3-5 testers.
- Any tester outside the reviewed tester-code list defaults to HOLD_FOR_TESTER_REVIEW.
- If the URL changes, expires, rotates, points to a different commit, loses request-id/security/no-real-money evidence, or shows live-risk capability, the batch returns to HOLD_FOR_RESMOKE.
- Do not paste tester private identity/contact maps into tracked docs, chat, screenshots, or issue logs.
- If private identity data appears in tracked evidence, stop and create a redacted replacement before continuing.

## Safe Send/Hold Sequence

1. Confirm local checks pass.
2. Confirm founder-controlled URL smoke evidence exists.
3. Confirm tester-code list and batch count.
4. Confirm invite copy says demo only and no real money.
5. Confirm support owner and rollback_or_hold_owner.
6. Ask for the exact approval phrase only if the evidence record is complete.
7. Keep the decision in `HOLD` if any evidence is missing, stale, private, or live-risk.

## Required Checks

- `npm run check:public-beta-invite-release-decision-packet`
- `npm run check:public-beta-first-cohort-launch-packet`
- `npm run check:public-beta-invite-batches`
- `npm run check:beta-tester-invite`
- `npm run check:deployment-decision-prep`
- `npm run check:deployment-founder-env-map`
- `npm run check:real-status-audit`
- `npm run check`

## Acceptance Check

The founder has one conservative invite-release decision gate with exact approval wording, reviewed URL evidence fields, tester-code-only batch rules, redaction/support/rollback owners, and HOLD/BLOCKED states before any tester invite, public beta URL share, external account change, app store action, provider/legal commitment, real-money action, or public launch.
