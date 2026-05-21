# SmartContractor Public Beta Founder Execution Plan

Status: INTERNAL_PUBLIC_BETA_EXECUTION_PLAN_ONLY

Purpose: give the founder one ordered plan for running a demo-only public beta decision session without hunting through many separate launch, support, QA, Auth, and deployment documents.

This plan is internal founder-present work. It is not a production launch approval, not a legal decision, not a payment-provider approval, and not permission to enable live money movement.

## What This Does Not Approve

This plan does not approve:

- production deploy settings;
- Vercel account import or project connection;
- GitHub Pages settings changes;
- DNS or Namecheap changes;
- production environment variables;
- Supabase Auth redirect changes;
- live Supabase SQL or RLS changes;
- `admin_memberships` inserts or updates;
- public launch;
- real payments;
- real loans;
- real escrow;
- real repayment routing;
- stablecoin settlement;
- token collateral;
- legal/provider commitments.

## Execution Order

1. Confirm the current local commit is clean enough for review and run the required local checks.
2. Review `docs/smartcontractor-deployment-decision-prep.md`; Vercel remains the recommended public beta target, but connecting the Vercel account is founder-only.
3. Review `docs/smartcontractor-founder-auth-admin-activation-prep.md`; Magic Link and admin activation remain live-boundary steps until the founder chooses the real Auth user and confirms the safe `admin_memberships` action.
4. Review `docs/smartcontractor-public-beta-launch-readiness.md` for the current Go / Review / No-Go snapshot.
5. Review `docs/smartcontractor-public-beta-review-packet.md` for the full demo-safe launch packet.
6. Decide the first tester cohort size; default recommendation is 3-5 people.
7. Use the approved launch message, tester FAQ, consent acknowledgement, and privacy notice before sharing anything with testers.
8. Capture only non-secret evidence: public URL status, request IDs, screenshots without private data, support issue IDs, known-issue IDs, and check command output.
9. Fill `docs/smartcontractor-public-beta-launch-decision-record.md` before sending tester invites or sharing the public beta link.
10. Monitor the support queue, daily status, weekly closeout, known issues, metrics snapshot, and go/no-go scorecard during the beta window.

## Founder Decision Gates

The founder must decide:

- public beta URL target and timing;
- demo-only beta scope;
- first tester cohort size and role mix;
- support owner and response window;
- known-issue tolerance before invites;
- Go / Review / No-Go launch decision.

These decisions can be discussed and documented internally during evening founder-present mode. They still do not grant live money, legal, deployment-account, DNS, Supabase, or provider authority.

## Founder Evening Demo Decision Gate

EVENING_DEMO_DECISION_GATE is the compact founder-present demo-only beta decision checkpoint for an evening session.

Use `Go/Review/Hold` only for internal readiness:

- `Go`: local checks pass, demo scope is clear, support owner is named, known issues are acceptable, and the next step is still only an internal demo decision record.
- `Review`: one evidence, owner, support, Auth, deployment, privacy, or known-issue question needs a named owner before the founder can decide.
- `Hold`: any live-risk, secret, legal/provider, real-money, public-sharing, or deployment-account question is unresolved.

For every `Go/Review/Hold` entry, record evidence source, owner, rollback owner, and blocked next action.

No tester invites, public link sharing, production deploy changes, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, legal decisions, or provider commitments are allowed from this gate.

## Tonight Go Review Hold Record

Use this compact record during founder-present evening mode before the founder fills the formal launch decision record.

| Tonight Field | Required Value |
| --- | --- |
| tonight_decision_state | GO_INTERNAL_DEMO_REVIEW, REVIEW_BLOCKERS, HOLD_FOR_LIVE_BOUNDARY, or NO_GO |
| tonight_evidence_source | Local check output, launch readiness snapshot, review packet, known-issue id, support queue id, or deployment/Auth prep doc |
| tonight_support_owner | Founder, Codex-local, support owner pending, or HOLD_FOR_OWNER |
| tonight_rollback_owner | Founder, Codex-local, deploy owner pending, or HOLD_FOR_ROLLBACK_OWNER |
| tonight_blocked_next_action | Do not send invites or share a public URL from this record; use it only to decide whether the formal launch decision record is ready |

## Founder Evening Public Beta Invite Readiness Record

Use this record during founder-present evening mode to decide whether public beta invite prep is ready to move into the formal launch decision record, not to invite testers.

| Founder Evening Public Beta Invite Field | Required Value |
| --- | --- |
| evening_invite_readiness_state | READY_FOR_FORMAL_LAUNCH_DECISION_RECORD, REVIEW_TESTER_SCOPE, HOLD_FOR_PUBLIC_URL_SMOKE, HOLD_FOR_AUTH_ADMIN, HOLD_FOR_SUPPORT_OWNER, or NO_GO |
| evening_invite_readiness_evidence | Local check output, public beta launch readiness, public beta review packet, known-issue id, support queue id, deployment decision prep, Founder Auth/Admin activation prep, or launch decision draft |
| evening_invite_readiness_owner | Founder, Codex-local, deployment owner pending, Auth/Admin owner pending, support owner pending, tester-scope owner pending, or HOLD_FOR_OWNER |
| evening_invite_readiness_blocked_action | Do not invite testers, share a public beta URL, change deploy settings, connect external accounts, change Supabase Auth redirects, apply live SQL or RLS, insert admin memberships, enable payments, approve loans, release escrow, route repayments, settle stablecoins, lock token collateral, make legal/provider commitments, or launch publicly from this record |

## Demo-Safe Scope

Allowed demo-safe scope:

- clickable SmartContractor MVP walkthrough;
- homeowner, contractor, bid, starter loan, milestone, dispute, peer-review, admin, and readiness flows in demo mode;
- no-real-money public beta language;
- demo-only support intake;
- aggregate metrics without private tester data;
- non-secret screenshots and request IDs;
- local validation output.

## Blocked Live Actions

Stop before:

- Vercel import or account connection;
- GitHub Pages setting changes;
- DNS or Namecheap updates;
- production environment variable setup;
- Supabase Auth redirect updates;
- live Supabase SQL or RLS apply;
- `admin_memberships` insert/update;
- production deploy or public launch;
- real payments;
- real loans;
- real escrow;
- real repayment routing;
- stablecoin settlement;
- token collateral;
- legal/provider commitments.

## Required Evidence

Collect only:

- command output from the required local checks;
- current commit hash;
- public beta URL status if one exists;
- `X-Request-Id` values from smoke checks;
- redacted screenshots;
- support issue IDs;
- known-issue IDs;
- launch decision record state;
- daily/weekly beta summaries.

Do not collect or paste secrets, database URLs, API keys, service-role keys, Magic Link tokens, private contact details, payment data, wallet data, raw legal notes, or raw provider credentials.

## Existing Documents To Use

- `docs/smartcontractor-public-beta-review-packet.md`
- `docs/smartcontractor-public-beta-launch-readiness.md`
- `docs/smartcontractor-public-beta-launch-decision-record.md`
- `docs/smartcontractor-public-beta-handoff-checklist.md`
- `docs/smartcontractor-public-launch-runbook.md`
- `docs/smartcontractor-demo-script.md`
- `docs/smartcontractor-controlled-user-test-plan.md`
- `docs/smartcontractor-beta-session-runbook.md`
- `docs/smartcontractor-beta-session-summary-template.md`
- `docs/smartcontractor-beta-decision-log.md`
- `docs/smartcontractor-public-beta-known-issues.md`
- `docs/smartcontractor-public-beta-support-queue.md`
- `docs/smartcontractor-beta-go-no-go-scorecard.md`
- `docs/smartcontractor-deployment-decision-prep.md`
- `docs/smartcontractor-founder-auth-admin-activation-prep.md`

## Go / Review / No-Go Rule

Choose `GO` only when the local checks pass, demo-only scope is clear, support is ready, known issues are acceptable, no secrets are exposed, and real payments, real loans, real escrow, real repayment routing, stablecoin settlement, and token collateral remain disabled.

Choose `REVIEW` when the product is useful for a founder walkthrough but one or more tester-facing, support, Auth, deployment, privacy, or known-issue questions still need a founder decision.

Choose `NO-GO` when there is any exposed secret, unclear beta scope, missing support owner, broken MVP flow, unresolved P0 known issue, unclear consent/privacy language, or pressure to enable live money or legal/provider commitments.

## Founder Evening Checklist

- Read this execution plan first.
- Read the launch readiness snapshot second.
- Read the public beta review packet third.
- Confirm whether the next session is `GO`, `REVIEW`, or `NO-GO`.
- If `GO`, fill the launch decision record before sending invites.
- If `REVIEW`, list the exact blocker and owner.
- If `NO-GO`, do not share the public beta link.

## Required Checks

- `npm run check:public-beta-founder-execution-plan`
- `npm run check:public-beta-review-packet`
- `npm run check:public-beta-launch-readiness`
- `npm run check:public-beta-launch-decision-record`
- `npm run check:public-beta-handoff`
- `npm run check:public-launch-runbook`
- `npm run check:deployment-decision-prep`
- `npm run check:real-status-audit`
- `npm run check`

## Acceptance Check

The founder can open this file and see the exact public beta execution order, decision gates, live-risk stops, existing source documents, evidence rules, and required checks without enabling any live/external/legal/money action.
