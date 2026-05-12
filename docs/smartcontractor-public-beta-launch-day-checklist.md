# SmartContractor Public Beta Launch Day Checklist

## Purpose

This checklist gives the founder a safe launch-day order for SmartContractor public beta in demo only scope. It converts the launch decision record into a practical sequence for founder preflight, smoke checks, monitoring, stop conditions, rollback drill readiness, and incident response readiness.

This checklist does not approve production launch, live Supabase changes, external account changes, legal decisions, provider commitments, real payments, real loans, escrow, token collateral, or money movement.

## Launch Day Order

1. Confirm the launch decision record says Go for demo only public beta.
2. Confirm QA signoff says Go and references homeowner, contractor, peer reviewer, and founder/admin role coverage.
3. Confirm the go/no-go scorecard and launch readiness documents do not show open P0 or sensitive unresolved P1 issues.
4. Run `npm run check` locally before sharing the public beta URL.
5. Confirm the public beta URL loads and returns expected read-only smoke check results.
6. Confirm the launch message, tester FAQ, consent acknowledgement, privacy notice, support queue, known issues, daily status, weekly closeout, rollback drill, and incident response documents are ready.
7. Share only the approved launch message and demo only public beta URL.
8. Monitor support queue, known issues, daily status, weekly closeout, and go/no-go scorecard during launch day.
9. Stop sharing immediately if any stop condition appears.

## Founder Preflight

| Item | Required Status |
|------|-----------------|
| Launch decision record | Go |
| QA signoff | Go |
| Go/no-go scorecard | Go |
| Launch readiness | Go |
| Public beta URL | Checked |
| Launch message | Approved |
| Tester FAQ | Approved |
| Consent acknowledgement | Ready |
| Privacy notice | Ready |
| Support queue | Ready |
| Known issues | Current |
| Daily status | Ready |
| Weekly closeout | Ready |
| Rollback drill | Ready |
| Incident response | Ready |
| Disabled gates | real payments disabled, real loans disabled, escrow disabled, token collateral disabled |

## Smoke Checks

Before sending testers the link, record safe evidence only:

- public beta URL checked status;
- app shell loads for homeowner, contractor, peer reviewer, and founder/admin demo paths;
- readiness endpoints respond without exposing secrets;
- response headers include safe X-Request-Id examples;
- support queue and known issues links are available to founder/admin;
- launch message and tester FAQ do not promise loan approval, investment return, escrow, payment release, token appreciation, or provider approval;
- consent acknowledgement and privacy notice are visible before collecting tester feedback;
- real payments disabled, real loans disabled, escrow disabled, and token collateral disabled remain true.

## Monitoring Cadence

| Time | Check |
|------|-------|
| Before launch message | Run `npm run check`, confirm Go decision inputs, confirm public beta URL |
| First 15 minutes | Watch support queue, known issues, request failures, and X-Request-Id examples |
| Every hour on launch day | Update daily status, support queue, known issues, and go/no-go scorecard |
| End of day | Update weekly closeout if needed and record safe next actions |

## Stop Conditions

Pause public beta sharing when any of these appear:

- open P0 affecting homeowner, contractor, peer reviewer, or founder/admin trust;
- sensitive P1 not routed to product fix, technical fix, founder review, legal review, provider review, or blocked;
- support queue has unresolved founder review, legal review, provider review, or blocked items;
- launch readiness, QA signoff, or go/no-go scorecard changes to Review or No-Go;
- public beta URL smoke checks fail;
- tester evidence includes SQL, secrets, private contact details, email addresses, phone numbers, calendar links, meeting links, raw recordings, unredacted screenshots, real customer addresses, payment data, wallet data, database URLs, API keys, Magic Link tokens, or service-role keys;
- real payments disabled, real loans disabled, escrow disabled, or token collateral disabled is not true.

## Rollback And Incident Readiness

Keep these ready before the first invite goes out:

- rollback drill owner and trigger conditions;
- incident response owner and first 15 minute steps;
- support queue route for P0, P1, founder review, legal review, provider review, and blocked items;
- known issues update path;
- daily status update path;
- go/no-go scorecard update path;
- approved safe wording for pausing tester access without exposing private evidence.

## Launch Day Template

```text
SmartContractor public beta launch day
Scope: demo only
Launch decision record: Go / Review / No-Go
QA signoff:
Go/no-go scorecard:
Launch readiness:
Public beta URL:
Launch message:
Tester FAQ:
Consent acknowledgement:
Privacy notice:
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
Blocked items:
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
