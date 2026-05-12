# GCSC / SmartContractor Real Status Audit

Date: 2026-05-11 PT

Purpose: honest founder-facing snapshot of what is ready, what is only prepared, what is blocked, and what remains before demo, public beta, real-money pilot, and mature product launch.

## Bottom Line

SmartContractor is no longer just an idea or landing page. It has a clickable MVP, backend scaffolding, Supabase database direction, Auth scaffolding, admin/risk console, payment-router scaffolding, dispute flow, peer-review flow, mobile/PWA prep, runbooks, validators, and CI-style checks.

But it is not yet a public real-money construction finance product.

The honest current state:

- Local/demo MVP: mostly ready.
- Public beta without real money: close, but blocked by founder account/deploy/Auth steps.
- Real-money loans, escrow, payment release, token collateral: not production-ready until legal, compliance, provider onboarding, strict RLS, admin activation, and security review are finished.
- Native Android/iOS apps: planned/preflighted, but not built and tested as native store-ready apps.

## Backlog Count

From `docs/smartcontractor-backlog.md`:

| Status | Count | Meaning |
|--------|------:|---------|
| DONE | 158 | Implemented or documented with local validation |
| REVIEW | 12 | Prepared, but needs founder/legal/live-system review before activation |
| BLOCKED | 3 | Needs founder account, external account, legal/provider action, or paid/controlled setup |
| LATER | 2 | Planned after beta readiness |
| TOTAL | 175 | Current tracked backlog items |

Raw backlog completion by item count: 158 / 175 = about 90%.

Important: 90% is not the same as 90% production-ready. Several remaining items are high-risk gates: Auth, strict RLS, admin membership, deployment, legal review, payment provider setup, and real loan/escrow decisions.

## Readiness By Launch Level

| Launch Level | Honest Readiness | Why |
|--------------|-----------------:|-----|
| Local clickable demo | 85-90% | Main flows exist and `npm run check` passes. Needs founder Magic Link/profile/admin test and live walkthrough QA. |
| Public beta demo, no real money | 60-70% | Code/runbooks are prepared, but deploy account, production env, Auth redirects, strict admin checks, and public URL QA remain. |
| Small controlled pilot with real users, no real loan/escrow movement | 45-55% | Needs stricter RLS, user onboarding, admin activation, real Supabase Auth users, production monitoring, support process, and clearer beta scope. |
| Real-money construction finance pilot | 25-35% | Legal, escrow/payment provider structure, lending compliance, payment provider onboarding, identity/verification provider, risk policy, and security review are still not finished. |
| Native Android/iOS store launch | 20-30% | PWA and runbooks are ready, but Capacitor native build, emulator QA, Apple account/certs, app store assets, and mobile release evidence are not complete. |
| Mature full platform vision | 10-15% | The architecture is broad: marketplace, loans, escrow, token collateral, AI agents, smart contracts, mobile apps, DAO/treasury, real estate, insurance, compliance. This is multi-phase work. |

## What Is Actually Done

Product/demo:

- SmartContractor clickable MVP.
- Open jobs/bids.
- Submit bid flow.
- Starter loan screen and scoring display.
- Project contracts and milestones.
- Dispute center.
- Evidence upload simulation.
- Peer review flow.
- Admin/Risk Console MVP.
- Founder Action Center.
- Production Readiness Gate.
- Mobile responsive PWA shell.

Backend/safety:

- API validation.
- Invalid JSON guard.
- Unknown API route JSON guard.
- Security headers.
- Request ID tracing.
- Audit/event ledger.
- Payment intent/event ledger.
- Multi-provider payment router scaffold.
- Metal Pay signature scaffold.
- Verification provider abstraction.
- Auth scaffold with Magic Link endpoints.
- Magic Link rate limiting.
- Role ownership guards.
- Strict route gate smoke tests.

Supabase/database:

- Supabase project exists and is active.
- Important tables have RLS enabled.
- Missing FK indexes were applied live.
- `admin_memberships` table exists live.
- Strict RLS replacement draft exists and validates locally.
- Payment ownership draft exists and validates locally.

Docs/process:

- Target architecture.
- Active context.
- Nonstop hook docs.
- Automation health validator.
- Founder admin activation runbook.
- Deploy decision brief.
- Vercel preflight/env/postdeploy docs.
- Public beta handoff checklist.
- Legal/financial review checklist.
- AI agent workflow scaffold.
- Smart contract design docs.
- Microsoft/Azure startup application text.
- Founder one-pager/demo script.

Validation:

- `npm run check` passes end-to-end as of this audit.

## What Is Prepared But Not Safe To Activate Yet

These are not failures; they are gates that must stay controlled:

- Founder/admin live activation: prepared, but needs real Magic Link user and explicit founder approval.
- Strict RLS replacement: prepared, but should not be applied until real Auth/admin smoke tests pass.
- Service-role boundary: prepared, but real service-role key must be set only in deployment/server environment.
- Payment intent ownership model: prepared, but live apply needs review.
- Loan/escrow/token collateral smart contract designs: drafted, but not legally/security approved.
- Legal/financial review checklist: ready, but attorney/provider decisions are still pending.

## What Is Still Blocked

Founder/external account blockers:

1. Decide and connect deploy platform, likely Vercel first for public beta.
2. Complete real Supabase Magic Link founder login.
3. Approve adding the real founder `auth_user_id` to `admin_memberships`.
4. Configure production environment variables without exposing secrets.
5. Set Supabase Auth redirect URLs for deployed domain.
6. Submit Microsoft/Azure startup application if still desired.
7. Apple account/certificates for iOS.

Legal/provider blockers:

1. Attorney review for starter loans, contractor credit, escrow/payment handling, lien waivers, token collateral, and "business control" language.
2. Payment provider onboarding for cards/debit/ACH/Metal Pay/Stripe/PayPal/Coinbase/BTCPay choices.
3. Verification provider selection for identity/business/license/insurance/bank checks.
4. Clear policy on whether GCSC is only software/marketplace, or touches regulated lending/escrow/payment movement.

Engineering blockers before public beta:

1. Real Auth session test with founder.
2. Admin membership activation.
3. Strict admin smoke tests with local env token.
4. Strict RLS apply plan and rollback.
5. Public deploy with correct ENV.
6. Public URL QA for app shell, auth redirect, security headers, request ID, readiness endpoints.

## Real Timeline Estimate

Assuming founder is available for account/login/legal/provider decisions:

- Local founder Auth/admin activation: 1 evening to 1 day.
- Public beta demo with no real money: 3-7 focused days.
- Controlled beta with a few test users and no real money movement: 1-3 weeks.
- Controlled pilot with real contractors/homeowners but manual/off-platform money handling: 3-6 weeks.
- Real-money loan/escrow/payment release pilot: 2-4 months minimum, because legal/provider/security work cannot be skipped.
- Native Android app wrapper and QA: 1-3 weeks after public web beta is stable.
- iOS wrapper/App Store path: 2-6 weeks after Apple account and certificates are ready.
- Mature production platform: 9-18 months for serious market-ready system; 24-36 months for the full original DAO/DeFi/AI/real-estate vision.

## Real Risk Assessment

Biggest risk is not code speed. Biggest risk is launching money, credit, escrow, or token collateral before legal/provider/security readiness.

Top five risks:

1. Regulatory risk around lending, escrow, payment handling, and token collateral.
2. Security risk if Supabase RLS/admin/service-role boundaries are rushed.
3. Product trust risk if homeowners/contractors can use flows before verification and dispute policies are clear.
4. Payment provider risk if Stripe/Metal Pay/PayPal/Coinbase onboarding is delayed or restricted.
5. Scope risk if the project tries to build marketplace, bank-like credit, escrow, token economy, DAO, AI agents, and native apps all at once.

## Recommended Next 7 Days

Day 1:

- Finish founder Magic Link.
- Link founder profile.
- Activate founder admin membership.
- Run strict admin smoke tests.

Day 2:

- Apply or rehearse strict RLS package only after tests pass.
- Fix any Auth/RLS breakage.

Day 3:

- Deploy public beta demo to chosen platform.
- Configure public environment variables and Supabase Auth redirect URLs.

Day 4:

- Run public URL QA.
- Fix mobile/PWA/public beta issues.

Day 5:

- Create beta-safe demo mode and founder/investor walkthrough.
- Keep real loans, escrow, and token collateral disabled.

Day 6:

- Prepare legal/provider review packet from existing docs.
- Choose payment/verification provider order.

Day 7:

- Start controlled user test plan: 1 homeowner scenario, 1 contractor scenario, 1 dispute scenario, 1 admin review scenario.

## Current Next Best Action

Complete Founder Auth Setup:

1. Start local backend.
2. Open SmartContractor MVP.
3. Send Magic Link to founder email.
4. Open the Magic Link in the same browser.
5. Click `Check Founder Auth Setup`.
6. Confirm authenticated/profile/admin status.
7. Only then approve live founder admin membership activation.

This is the highest-leverage next step because strict RLS, admin testing, public beta deployment, and production safety all depend on it.
