# SmartContractor Public Beta Invite Post-Send Intake

Status: INTERNAL_POST_SEND_INTAKE_ONLY

This intake is not approval for Codex to send invites, share a public beta URL, open external accounts, change deploy settings, change Supabase redirects, set up providers, publish publicly, use app stores, or enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral.

## Purpose

Capture a safe, redacted founder report-back after the founder sends the first public beta invite batch outside Codex.

The tracked record stays tester-code-only, request-id-based, issue-id-based, support-owned, rollback-owned, and blocked from private tester data, raw URLs, account secrets, money features, legal decisions, provider commitments, public launch, and destructive actions.

## Source Documents

- `docs/smartcontractor-public-beta-invite-founder-send-checklist.md`
- `docs/smartcontractor-public-beta-invite-approval-request-draft.md`
- `docs/smartcontractor-public-beta-invite-evidence-closeout.md`
- `docs/smartcontractor-public-beta-invite-release-decision-packet.md`
- `docs/smartcontractor-public-beta-first-cohort-launch-packet.md`
- `docs/smartcontractor-beta-tester-invite.md`
- `docs/smartcontractor-beta-issue-log-template.md`

## What This Does Not Approve

This intake does not approve:

- Codex-sent invites;
- raw public beta URL storage;
- private tester names, emails, phone numbers, addresses, account IDs, or wallet IDs;
- external account changes;
- deploy setting changes;
- Supabase redirect changes;
- provider setup;
- real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral;
- legal decisions or provider commitments;
- public launch or app store work;
- destructive actions.

## Required Intake Fields

Record only redacted metadata in this format:

```text
invite_batch_id:
approval_phrase_recorded_at:
founder_send_confirmed_at:
source_commit:
public_beta_url_label:
tester_codes_sent:
tester_count:
channel_label:
sent_by_founder:
support_owner:
rollback_owner:
first_checkin_window:
safe_request_ids:
safe_issue_ids:
known_issue_link_label:
redaction_status:
post_send_state: SENT_BY_FOUNDER_RECORDED, HOLD_FOR_REDACTION, HOLD_FOR_RECHECK, HOLD_FOR_TESTER_SCOPE_REVIEW, or BLOCKED_FOR_EXTERNAL_ACTION
```

## State Options

Use `SENT_BY_FOUNDER_RECORDED` only when the founder confirmed the send outside Codex, the source commit still matches the reviewed evidence, the batch remains 3-5 reviewed testers, the tracked record contains tester codes only, safe request IDs or issue IDs are available when reported, support owner and rollback owner are named, and redaction status is clean.

Use `HOLD_FOR_REDACTION` when any raw URL, tester identity, contact detail, account ID, wallet ID, cookie, Authorization header, Magic Link URL, raw response body, private screenshot, payment data, or secret-looking value appears in tracked evidence.

Use `HOLD_FOR_RECHECK` when the public beta URL label changed, source commit does not match, no-real-money evidence is missing, disabled payment or loan behavior is uncertain, support or rollback owner is missing, or the first check-in window is not recorded.

Use `HOLD_FOR_TESTER_SCOPE_REVIEW` when the batch is larger than 3-5 testers, includes unreviewed testers, mixes real identities into tracked docs, or lacks tester-code-only mapping discipline.

Use `BLOCKED_FOR_EXTERNAL_ACTION` when the next step requires Codex to send invites, share URLs, open dashboards, change external account settings, deploy, change Supabase redirects, enter secrets, set up providers, enable money features, make legal/provider commitments, publish publicly, use app stores, or perform destructive actions.

## Safe Evidence Rules

Safe evidence may include:

- tester codes;
- channel labels;
- redacted send status;
- support owner;
- rollback owner;
- first check-in window;
- safe request IDs;
- safe issue IDs;
- known issue link labels;
- redacted screenshot status.

Do not store raw URLs, tester names, tester emails, phone numbers, addresses, account IDs, wallet IDs, cookies, Authorization headers, Magic Link URLs, raw response bodies, private screenshots, payment data, passwords, private keys, seed phrases, service-role keys, database URLs, bearer tokens, or any secret-looking value.

## Required Checks

```powershell
npm run check:public-beta-invite-post-send-intake
npm run check:public-beta-invite-founder-send-checklist
npm run check:public-beta-invite-approval-request-draft
npm run check:public-beta-invite-evidence-closeout
npm run check:public-beta-invite-release-decision-packet
npm run check:public-beta-first-cohort-launch-packet
npm run check:beta-tester-invite
npm run check:beta-issue-log
npm run check:real-status-audit
npm run check
```

## Acceptance Check

This intake is accepted only when local docs and validators prove that the post-send record is founder-reported, redacted, tester-code-only, request-id-based, issue-id-based, support-owned, rollback-owned, and blocked from raw URL storage, private tester data, Codex-sent invites, external account changes, deploy changes, Supabase redirects, provider setup, real-money actions, legal/provider commitments, public launch, app stores, or destructive actions.
