# SmartContractor Beta Evidence Checklist

Date: 2026-05-11 PT

Purpose: keep controlled beta evidence useful for engineering review without collecting secrets, sensitive personal data, or real-money commitments.

Use this with:

- `docs/smartcontractor-beta-session-runbook.md`
- `docs/smartcontractor-beta-session-summary-template.md`
- `docs/smartcontractor-beta-issue-log-template.md`
- `docs/smartcontractor-beta-go-no-go-scorecard.md`
- `npm run check`

## Purpose

Every beta session should produce enough non-secret evidence to reproduce bugs, judge trust blockers, and decide whether the demo can move forward.

The evidence must prove what happened without exposing passwords, Magic Link URLs, tokens, private keys, payment card data, bank details, database credentials, service-role keys, or real loan/escrow/payment information.

## What To Capture

Capture only demo-safe proof:

- screenshot of the page or panel where the issue happened;
- short screen recording if the bug depends on clicks, scrolling, mobile layout, or timing;
- browser console error text;
- network response status, route, and safe response body;
- `request_id` from response headers or JSON response;
- user role used in the test: homeowner, contractor, peer reviewer, or admin;
- device class: desktop, tablet, mobile viewport, Android browser, iPhone browser, or PWA install flow;
- exact local/public URL path without query secrets;
- expected result and actual result;
- linked issue-log row or beta session summary row.

## Evidence Naming

Use simple names so files can be matched to issues later:

```text
YYYY-MM-DD_beta-session_issue-P1_homeowner-submit-bid_request-id.png
YYYY-MM-DD_beta-session_issue-P0_auth-session_mobile-recording.mp4
YYYY-MM-DD_beta-session_issue-P2_admin-readiness_console.txt
```

If there is no issue, label the evidence as proof:

```text
YYYY-MM-DD_beta-session_pass_contractor-bid-flow_desktop.png
YYYY-MM-DD_beta-session_pass_dispute-evidence_mobile.png
```

## What Not To Capture

Do not capture, paste, email, or upload:

- passwords or database password screens;
- Magic Link URLs;
- Supabase service-role keys or JWT tokens;
- private keys, seed phrases, wallet recovery phrases, or WebAuth secrets;
- real payment card numbers, bank routing/account data, or payment provider secrets;
- real payment confirmation for production money movement;
- no real payment confirmation for production money movement;
- real loan approval, real escrow release, or real token collateral transaction;
- no real loan approval, no real escrow release, and no token collateral transaction;
- legal identity documents unless a future provider-approved secure process exists;
- homeowner address or contractor personal data beyond demo-safe test values.

If evidence accidentally contains any of the above, stop and create a new sanitized screenshot or recording.

## Session Checklist

Before the session:

- confirm the test is demo-only;
- confirm real payment, real loan, real escrow, and token collateral actions are disabled;
- run `npm run check`;
- open the beta session runbook;
- prepare the beta issue log template.

During the session:

- capture a screenshot for each key flow: homeowner post, contractor bid, starter loan simulation, milestone/payment simulation, dispute evidence, peer review, admin/risk review;
- capture at least one mobile viewport screenshot;
- copy `request_id` for every failed API call;
- record browser console and network response when a bug appears;
- mark whether the issue is P0, P1, P2, or P3 using the triage rubric.

After the session:

- fill in the beta session summary template;
- add issues to the beta issue log template;
- update the beta decision log only after reviewing evidence;
- use the go/no-go scorecard before sharing any wider public beta link.

## Acceptance Criteria

The evidence package is ready when:

- every P0/P1 issue has screenshot or screen recording evidence;
- every backend issue includes a safe `request_id`;
- mobile/PWA problems include viewport or device notes;
- no secrets or sensitive personal data are present;
- no real payment, real loan, real escrow, or token collateral action was performed;
- the session summary, issue log, and decision log can be reviewed without asking the tester for missing context.
