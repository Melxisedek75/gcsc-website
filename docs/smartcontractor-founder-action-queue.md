# SmartContractor Founder Action Queue

Date: 2026-05-11 PT

Purpose: keep the founder-only next actions clear without asking for passwords, secrets, or live-risk approvals in chat.

## Use This Queue When

- Codex has finished the safe local work it can do alone.
- A task requires an external account, real deployment setting, Supabase live change, payment provider, legal review, or founder business decision.
- The founder is present at the computer and can approve or perform the external step directly.

## Current Founder Actions

1. Decide deploy platform timing.
   - Recommended first target: Vercel for the SmartContractor public beta backend/frontend.
   - Do not connect paid services or production domains until the founder is ready.
   - Keep real payments, real loans, escrow, and token collateral disabled.

2. Complete Supabase Auth founder login test.
   - Use Magic Link, not a password pasted into chat.
   - Confirm the browser has a valid session.
   - Confirm Founder Auth Setup can see session, profile binding, and admin-role status.

3. Approve founder admin activation only after reviewing the prepared runbook.
   - Use `docs/smartcontractor-founder-admin-activation-runbook.md`.
   - Live admin membership insert requires the real Supabase Auth user id.
   - Do not paste service-role keys, database passwords, or raw tokens into chat.

4. Review strict RLS replacement before any live apply.
   - Use `docs/smartcontractor-strict-rls-replacement-draft.sql`.
   - Live apply requires explicit founder approval while logged into Supabase.
   - Keep rollback steps visible before applying anything.

5. Start legal and provider review before real-money features.
   - Attorney review is required for contractor credit, escrow/payment handling, token collateral, and business-control language.
   - Payment provider onboarding is required before Metal Pay, Stripe, PayPal, Coinbase, BTCPay, ACH, or open-banking production mode.
   - AI recommendations must stay assistive, not autonomous legal, lending, escrow, or payment approvals.

6. Submit Microsoft/Azure startup application packet.
   - Use the prepared application and submission packet docs.
   - Do not claim guaranteed token price, investment return, or production lending approval.
   - Keep the ask focused on Azure AI, backend hosting, storage, testing, and responsible AI work.

## What Codex Can Still Do Without Founder Approval

- Improve validators, CI, local smoke tests, runbooks, and demo-safe documentation.
- Harden local backend/frontend behavior without changing live accounts.
- Prepare draft SQL, architecture plans, whitepaper sections, mobile/PWA planning, and smart-contract design docs.
- Update backlog, active context, and real-status audit after safe scoped work.

## Stop Conditions

Codex must stop and ask for founder presence before:

- entering or handling passwords, API keys, private keys, seed phrases, database passwords, or service-role keys;
- changing Namecheap, GitHub Pages, Vercel, Supabase production settings, payment provider settings, or external accounts;
- applying live Supabase migrations or strict RLS;
- enabling real loans, real escrow, real payments, real token collateral, or automatic payment release;
- making legal, lending, investment, insurance, or business-control decisions.

## Safe Report-Back Format

When a founder action is needed, Codex should report:

```text
Blocked founder step:
1. Open: [exact page or document]
2. Click/read: [exact item]
3. Do not paste secrets into chat.
4. Send me only non-secret status: done / blocked / screenshot without sensitive values.
```
