# SmartContractor Public Beta Launch Status Board

## Purpose

This board gives the founder one demo only public beta status snapshot during launch day. It keeps launch day checklist results, launch decision record, QA signoff, go/no-go scorecard, launch readiness, support queue, known issues, daily status, weekly closeout, rollback drill, and incident response aligned without exposing secrets or private tester data.

This board does not approve production launch, live Supabase changes, external account changes, legal decisions, provider commitments, real payments, real loans, escrow, token collateral, or money movement.

## Board States

| State | Meaning | Action |
|-------|---------|--------|
| Green | Safe to continue demo only public beta monitoring | Continue launch-day cadence |
| Yellow | Needs founder/admin review before expanding testers | Keep current testers only |
| Red | Stop new tester invites | Route issue before further sharing |
| Blocked | Requires founder review, legal review, provider review, or external account action | Do not proceed autonomously |

## Required Rows

| Row | State | Safe Evidence |
|-----|-------|---------------|
| Launch day checklist | Green / Yellow / Red / Blocked | Checklist status only |
| Launch decision record | Green / Yellow / Red / Blocked | Go / Review / No-Go |
| QA signoff | Green / Yellow / Red / Blocked | Role coverage for homeowner, contractor, peer reviewer, founder/admin |
| Go/no-go scorecard | Green / Yellow / Red / Blocked | Current scorecard decision |
| Launch readiness | Green / Yellow / Red / Blocked | Current readiness decision |
| Public beta URL | Green / Yellow / Red / Blocked | Checked / failed / not available |
| Support queue | Green / Yellow / Red / Blocked | P0, P1, founder review, legal review, provider review, blocked counts |
| Known issues | Green / Yellow / Red / Blocked | Current safe summary |
| Daily status | Green / Yellow / Red / Blocked | Last updated status |
| Weekly closeout | Green / Yellow / Red / Blocked | Pending / updated when needed |
| Rollback drill | Green / Yellow / Red / Blocked | Ready / not ready |
| Incident response | Green / Yellow / Red / Blocked | Ready / not ready |
| Disabled gates | Green / Yellow / Red / Blocked | real payments disabled, real loans disabled, escrow disabled, token collateral disabled |

## Update Cadence

- before launch message: update every required row;
- first 15 minutes: update public beta URL, support queue, known issues, and X-Request-Id examples;
- every hour on launch day: update support queue, known issues, daily status, and go/no-go scorecard;
- end of day: update daily status and weekly closeout if needed;
- after any P0 or sensitive P1: update the board before any new tester invite.

## Founder Decision Rules

The board stays Green only when:

- launch decision record, QA signoff, go/no-go scorecard, and launch readiness are Green;
- launch day checklist is Green;
- public beta URL smoke checks pass;
- support queue has no unresolved P0 and no sensitive unrouted P1;
- known issues are current and tester-facing;
- rollback drill and incident response are ready;
- real payments disabled, real loans disabled, escrow disabled, and token collateral disabled are true.

Set Yellow when:

- a non-sensitive P1 needs founder/admin review;
- known issues or daily status are stale;
- support queue needs cleanup but no P0 is open.

Set Red when:

- any P0 affects homeowner, contractor, peer reviewer, or founder/admin trust;
- public beta URL smoke checks fail;
- launch decision record, QA signoff, go/no-go scorecard, or launch readiness changes to Review or No-Go;
- tester evidence includes unsafe data.

Set Blocked when the next action needs founder review, legal review, provider review, external account access, live Supabase changes, real payments, real loans, escrow, token collateral, or secrets.

## Safe Status Template

```text
SmartContractor public beta launch status board
Scope: demo only
Overall state: Green / Yellow / Red / Blocked
Launch day checklist:
Launch decision record:
QA signoff:
Go/no-go scorecard:
Launch readiness:
Public beta URL:
Support queue:
Known issues:
Daily status:
Weekly closeout:
Rollback drill:
Incident response:
Open P0:
Sensitive P1:
Founder review:
Legal review:
Provider review:
Blocked:
X-Request-Id examples:
Disabled gates: real payments disabled, real loans disabled, escrow disabled, token collateral disabled.
Safety check: no SQL, no secrets, no private contact details, no email addresses, no phone numbers, no calendar links, no meeting links, no raw recordings, no unredacted screenshots, no real customer addresses, no payment data, no wallet data, no database URLs, no API keys, no Magic Link tokens, no service-role keys.
```

## Blocked Data

Do not store or paste:

- no SQL;
- no secrets;
- private contact details;
- email addresses;
- phone numbers;
- calendar links;
- meeting links;
- raw recordings;
- unredacted screenshots;
- real customer addresses;
- payment data;
- wallet data;
- database URLs;
- API keys;
- Magic Link tokens;
- service-role keys.
