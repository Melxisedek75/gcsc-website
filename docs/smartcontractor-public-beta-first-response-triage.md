# SmartContractor Public Beta First Response Triage

Status: INTERNAL_FIRST_RESPONSE_TRIAGE_ONLY

This triage packet is not approval for Codex to reply to testers, send invites, share a public beta URL, open external accounts, change deploy settings, change Supabase redirects, set up providers, publish publicly, use app stores, or enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral.

## Purpose

Give Codex and the founder one safe way to classify the first tester responses after the founder-controlled invite send.

The packet converts redacted tester-code-only feedback into a local issue routing decision while preserving request IDs, issue IDs, support ownership, rollback ownership, no-real-money boundaries, and stop conditions for private tester data, raw URLs, legal/provider scope, live systems, and money movement.

## Source Documents

- `docs/smartcontractor-public-beta-invite-post-send-intake.md`
- `docs/smartcontractor-public-beta-invite-founder-send-checklist.md`
- `docs/smartcontractor-beta-triage-rubric.md`
- `docs/smartcontractor-beta-issue-log-template.md`
- `docs/smartcontractor-public-beta-known-issues.md`
- `docs/smartcontractor-public-beta-support-queue.md`
- `docs/smartcontractor-public-beta-incident-response.md`

## What This Does Not Approve

This triage packet does not approve:

- replying to testers from Codex;
- raw public beta URL storage;
- private tester names, emails, phone numbers, addresses, account IDs, or wallet IDs;
- external account changes;
- deploy setting changes;
- Supabase redirect changes;
- live Supabase writes;
- provider setup;
- real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral;
- legal decisions or provider commitments;
- public launch or app store work;
- destructive actions.

## Required Triage Fields

Record only redacted metadata in this format:

```text
response_batch_id:
invite_batch_id:
tester_code:
received_at_label:
channel_label:
flow_area:
safe_request_id:
safe_issue_id:
severity: P0, P1, P2, or P3
trust_category:
reported_expected_result:
reported_actual_result:
redacted_screenshot_status:
support_owner:
rollback_owner:
triage_state: ACCEPTED_FOR_LOCAL_FIX, QUEUED_FOR_REVIEW, HOLD_FOR_REDACTION, HOLD_FOR_RECHECK, HOLD_FOR_FOUNDER_REPLY, or BLOCKED_FOR_EXTERNAL_ACTION
next_safe_action:
```

## Severity Routing

Use `P0` when a response blocks the demo path, suggests private data exposure, suggests live-risk behavior, breaks auth/session, breaks admin/risk review, or confuses no-real-money status.

Use `P1` when a response weakens contractor trust, homeowner trust, dispute evidence, payment simulation clarity, peer review, support flow, or rollback confidence without blocking the whole demo.

Use `P2` when a response is usability friction, unclear copy, missing empty state, mobile/PWA polish, or low-risk workflow friction.

Use `P3` when a response is a future suggestion, visual polish request, or roadmap idea that does not affect first-batch beta safety.

## Trust Categories

Use one primary category:

- auth/session;
- contractor trust;
- homeowner trust;
- payment simulation;
- dispute evidence;
- peer review;
- admin/risk review;
- mobile/PWA;
- support/rollback;
- privacy/redaction;
- public beta access.

## Triage States

Use `ACCEPTED_FOR_LOCAL_FIX` when the issue is redacted, reproducible enough, local-only, and safe for Codex to address without external account changes, live Supabase writes, money features, legal/provider decisions, public launch, or destructive action.

Use `QUEUED_FOR_REVIEW` when the issue is valid but needs founder prioritization, product wording review, or batching with other beta feedback before implementation.

Use `HOLD_FOR_REDACTION` when any raw URL, tester identity, contact detail, account ID, wallet ID, cookie, Authorization header, Magic Link URL, raw response body, private screenshot, payment data, or secret-looking value appears in tracked evidence.

Use `HOLD_FOR_RECHECK` when request ID evidence is missing for API behavior, the source commit is unclear, the invite batch is not tied to the post-send intake, no-real-money evidence is stale, or reproduction steps are incomplete.

Use `HOLD_FOR_FOUNDER_REPLY` when a human response to the tester is needed, including scheduling, apology wording, expectation-setting, tester scope correction, or any message that could expose the beta URL.

Use `BLOCKED_FOR_EXTERNAL_ACTION` when the next step requires Codex to reply to testers, send invites, share URLs, open dashboards, change account settings, deploy, change Supabase redirects, enter secrets, set up providers, enable money features, make legal/provider commitments, publish publicly, use app stores, or perform destructive actions.

## Safe Evidence Rules

Safe evidence may include tester codes, channel labels, flow area, safe request IDs, safe issue IDs, severity, trust category, redacted expected/actual result text, redacted screenshot status, support owner, rollback owner, and next safe action.

Do not store raw URLs, tester names, tester emails, phone numbers, addresses, account IDs, wallet IDs, cookies, Authorization headers, Magic Link URLs, raw response bodies, private screenshots, payment data, passwords, private keys, seed phrases, service-role keys, database URLs, bearer tokens, or any secret-looking value.

## Required Checks

```powershell
npm run check:public-beta-first-response-triage
npm run check:public-beta-invite-post-send-intake
npm run check:public-beta-invite-founder-send-checklist
npm run check:beta-triage-rubric
npm run check:beta-issue-log
npm run check:public-beta-known-issues
npm run check:public-beta-support-queue
npm run check:public-beta-incident-response
npm run check:real-status-audit
npm run check
```

## Acceptance Check

This triage packet is accepted only when local docs and validators prove that first tester responses remain redacted, tester-code-only, request-id-based, issue-id-based, severity-routed, support-owned, rollback-owned, and blocked from raw URL storage, private tester data, Codex replies to testers, external account changes, deploy changes, Supabase redirects, live Supabase writes, provider setup, real-money actions, legal/provider commitments, public launch, app stores, or destructive actions.
