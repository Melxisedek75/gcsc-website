# SmartContractor Public Beta Founder Dashboard Checklist

Purpose: give the founder one short daily dashboard routine for public beta without exposing secrets, changing live systems, or enabling real money.

Use this when a public beta URL exists, or when preparing the founder dashboard before sharing a beta link.

## No Secrets

Do not paste or store secrets in this checklist, screenshots, issue reports, or chat.

Do not include:

- database connection strings;
- service-role keys;
- API keys;
- wallet private keys or seed phrases;
- raw Magic Link URLs;
- raw Supabase Auth tokens;
- private customer contact details;
- payment card, bank, or wallet balances.

Allowed values are safe status words like `Passed`, `Failed`, `Blocked`, `Not checked`, a public `PUBLIC_SITE_URL`, and a safe `X-Request-Id`.

## Daily Checks

1. Open the current `PUBLIC_SITE_URL`.
2. Confirm the SmartContractor landing/app shell loads.
3. Open the admin/readiness area only if the founder is signed in with the correct Magic Link browser session.
4. Check the public beta support queue summary.
5. Check the known issues list before answering testers.
6. Confirm tester reports include a safe `X-Request-Id` when available.
7. Confirm real payments disabled.
8. Confirm real loans disabled.
9. Confirm escrow disabled.
10. Confirm token collateral disabled.

If any real-money gate appears enabled by mistake, stop public beta sharing until the issue is fixed.

## Readiness Checks

Review these before sending a beta link:

- `PUBLIC_SITE_URL` opens without a 404.
- Security headers are present in public smoke checks.
- Request tracing returns `X-Request-Id`.
- Magic Link flow is still the chosen MVP login path.
- Supabase Auth redirect URL matches the deployed public URL.
- Admin access is founder-controlled.
- Demo data is clearly not real customer money or real loan approval.
- Mobile/PWA install path is treated as beta, not store-ready production.

## Support Checks

Use the support queue to separate issues:

- P0: app unavailable, Auth/admin ambiguity, secret leak risk, payment/loan/escrow/token collateral appears enabled, private data exposed.
- P1: tester cannot complete homeowner, contractor, bid, dispute, peer review, or admin review demo flow.
- P2: wording, layout, mobile polish, missing explanation, minor known issues.

Each support entry should include:

- role: homeowner, contractor, peer reviewer, founder/admin, or observer;
- page or flow;
- safe `X-Request-Id` if visible;
- short symptom;
- screenshot status: redacted, not shared, or not needed;
- route: founder, legal, provider, product, or technical.

Never ask testers for SQL output, database URLs, service keys, payment data, private wallet data, or personal ID documents during public beta.

## Stop Conditions

Stop public beta sharing and route to founder review if any of these happen:

- a tester sees another user's private data;
- admin pages are visible to a non-founder;
- Magic Link or Supabase Auth behavior is unclear;
- real payments disabled is no longer true;
- real loans disabled is no longer true;
- escrow disabled is no longer true;
- token collateral disabled is no longer true;
- a screenshot contains secrets or private data;
- legal language sounds like a real loan, escrow, investment return, or guaranteed token appreciation;
- a provider integration asks for live credentials;
- a tester issue requires no SQL or no secrets boundaries to be broken.

## Founder-Only Actions

Only the founder can approve:

- external account changes;
- Supabase Auth redirect changes;
- live SQL, RLS, or admin membership changes;
- service-role key placement;
- payment provider setup;
- loan, escrow, or token collateral activation;
- legal wording;
- provider onboarding;
- public claims about launch readiness, token value, credit approval, or regulated services.

Codex can prepare docs, validators, runbooks, local code, and review packets, but it must not approve these founder-only actions.

## Safe Report-Back

Use this exact format for a daily public beta dashboard update:

```text
Date:
PUBLIC_SITE_URL:
App shell: Passed / Failed / Not checked
Magic Link: Passed / Failed / Blocked / Not checked
Supabase Auth redirect: Passed / Failed / Blocked / Not checked
Admin access: Founder only / Failed / Blocked / Not checked
Support queue: P0 __ / P1 __ / P2 __
Known issues reviewed: Yes / No
Latest safe X-Request-Id:
Real payments disabled: Yes / No
Real loans disabled: Yes / No
Escrow disabled: Yes / No
Token collateral disabled: Yes / No
Needs founder/legal/provider review:
Next safe action:
```

If the answer to any disabled real-money gate is `No`, do not continue beta testing until founder review is complete.
