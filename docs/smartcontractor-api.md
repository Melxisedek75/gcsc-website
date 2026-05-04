# SmartContractor MVP API

Date: 2026-05-03

Backend folder:

```text
C:\gcsc\construction-ai
```

Local backend URL:

```text
http://localhost:3002
```

Start backend:

```powershell
cd C:\gcsc\construction-ai
npm start
```

Open MVP workspace:

```text
http://localhost:3002/smartcontractor.html
```

Create one complete demo path:

```powershell
node C:\gcsc\execution\smartcontractor-demo-seed.mjs
```

The script creates:

- homeowner profile;
- homeowner account;
- job;
- contractor profile;
- contractor account;
- bid;
- starter loan;
- milestone repayment;
- dispute;
- evidence;
- peer review.

## Payment Providers

```http
GET /api/payments/providers
```

Returns the currently supported payment rails:

- Metal Pay Connect;
- XPR Network / WebAuth;
- Stripe;
- PayPal Pay with Crypto;
- Coinbase Commerce;
- BTCPay Server.

## Metal Pay Connect Signature

```http
GET /api/payments/metal-pay/signature
```

Requires server-side environment variables:

```text
METAL_PAY_CONNECT_API_KEY
METAL_PAY_CONNECT_SECRET_KEY
METAL_PAY_CONNECT_ENV
```

This endpoint generates the HMAC signature needed by the Metal Pay Connect frontend SDK. The secret key is never sent to the browser.

## Create Payment Intent

```http
POST /api/payments/intents
```

Body:

```json
{
  "provider": "metal_pay",
  "amount_usd": 50,
  "currency": "USD",
  "purpose": "lead_token",
  "payer_role": "contractor",
  "reference_id": "OPTIONAL_JOB_LOAN_BID_OR_DISPUTE_ID"
}
```

See full payment strategy:

```text
C:\gcsc\docs\smartcontractor-payments.md
```

## List Payment Intents

```http
GET /api/payments/intents
```

Optional filters:

```text
?provider=xpr_network
?status=created
?reference_id=JOB_OR_LOAN_ID
```

## List Payment Events

```http
GET /api/payments/events
```

Optional filters:

```text
?provider=xpr_network
?external_intent_id=PROVIDER_INTENT_ID
?payment_intent_id=PAYMENT_INTENT_UUID
```

## Payment Webhook Skeleton

```http
POST /api/payments/webhooks/PROVIDER_ID
```

MVP body:

```json
{
  "external_intent_id": "PROVIDER_OR_GCSC_INTENT_ID",
  "event_type": "payment_succeeded",
  "status": "paid",
  "amount_usd": 50,
  "provider_reference": "provider_receipt_or_charge_id",
  "tx_hash": "optional_crypto_transaction_hash"
}
```

Supported `PROVIDER_ID` values:

```text
metal_pay
xpr_network
stripe
paypal_crypto
coinbase_commerce
btcpay
```

The webhook skeleton records a `payment_events` row, updates the matching `payment_intents.status` when possible, and writes an audit event. Production provider signature verification must be added before public launch.

## List Audit Events

```http
GET /api/audit/events
```

Optional filters:

```text
?entity_type=contractor_loan
?entity_id=UUID
?action=loan_requested
?actor_type=contractor
```

Audit events are written for core MVP actions: profiles, homeowners, contractors, jobs, bids, bid unlocks, loans, repayments, disputes, evidence, peer reviews, and payment intents.

## Admin / Risk Console

```http
GET /api/admin/risk-console
```

Returns the founder review dashboard for:

- pending contractor loans;
- active loan exposure;
- open disputes;
- payment exceptions;
- pending verification checks;
- token collateral items for review;
- payment provider setup status;
- recent audit events.

The MVP UI also adds a local admin review layer:

- filters by loans, disputes, payments, verification, collateral, and provider setup;
- click-to-review detail panel;
- draft status values such as `needs_founder_review`, `ready_for_legal_review`, and `blocked_by_provider_keys`;
- local browser-only decision notes.

This endpoint is for local MVP review. Draft notes do not approve loans, move money, release collateral, or create legal decisions. Before public launch it must be protected by Supabase Auth, strict RLS, and admin role checks.

## Production Readiness Gate

```http
GET /api/admin/launch-readiness
```

Returns a launch preflight report for:

- demo launch status;
- public launch status;
- real-money launch status;
- production domain / HTTPS review;
- Supabase public config;
- Supabase Auth and strict RLS review state;
- required payment provider configuration without exposing secrets;
- PWA/mobile readiness;
- admin console readiness;
- blocked legal items for real loans, escrow, and token collateral.

The endpoint returns only `ready`, `review`, `blocked`, or `missing` statuses. It never returns secret values.

Real-money launch is intentionally blocked until legal, payment provider, auth, RLS, and production deployment reviews are complete.

## Auth Decision Package

```http
GET /api/admin/auth-readiness
```

Returns the founder decision package for Supabase Auth:

- recommended MVP mode: `magic_link`;
- alternative mode: `password`;
- selected mode from `SMARTCONTRACTOR_AUTH_MODE`, or `undecided`;
- founder next action;
- implementation checklist;
- safe scope statement confirming that Auth and RLS are not enabled by this endpoint.

The endpoint is safe to run locally. It does not expose secrets, does not enable Supabase Auth, and does not apply RLS policies.

Detailed document:

```text
C:\gcsc\docs\smartcontractor-auth-decision-package.md
```

## Auth Implementation Scaffold

```http
POST /api/auth/magic-link
```

Body:

```json
{
  "email": "gcsc@xprnet.org",
  "redirect_to": "http://localhost:3002/smartcontractor.html"
}
```

This endpoint validates the email and redirect URL, then asks Supabase to send a Magic Link only when:

```text
SMARTCONTRACTOR_AUTH_MODE=magic_link
```

Safe redirect origins:

- `localhost`;
- `127.0.0.1`;
- `https://xprnet.org`;
- `https://www.xprnet.org`;
- `PUBLIC_SITE_URL`;
- comma-separated `ALLOWED_AUTH_REDIRECT_ORIGINS`.

It never uses or exposes the service-role key.

```http
GET /api/auth/session-check
```

Header:

```http
Authorization: Bearer SUPABASE_ACCESS_TOKEN
```

Returns the authenticated Supabase user id, email, and role. Without a valid bearer token it returns `401`.

```http
GET /api/auth/profile
```

Header:

```http
Authorization: Bearer SUPABASE_ACCESS_TOKEN
```

Returns:

- authenticated Supabase user;
- linked SmartContractor `profile` where `profiles.auth_user_id = auth.users.id`;
- linked `homeowner` record if the profile owns one;
- linked `contractor` record if the profile owns one;
- a safe message when no SmartContractor profile is linked yet.

When the frontend has an access token, `POST /api/smartcontractor/profiles` now stores:

```text
profiles.auth_user_id = authenticated Supabase user id
```

The database review draft is:

```text
C:\gcsc\docs\smartcontractor-profile-ownership-draft.sql
```

This draft is not applied live yet.

## Role Ownership Guards

When a request includes:

```http
Authorization: Bearer SUPABASE_ACCESS_TOKEN
```

the backend now verifies ownership before user-owned writes.

Protected examples:

- `profile_id` must belong to the authenticated user when creating homeowner/contractor role records;
- `homeowner_id` must belong to the authenticated user when creating jobs and project contracts;
- `contractor_id` must belong to the authenticated user when submitting bids, requesting loans, unlocking bids, or locking token collateral;
- `reviewer_contractor_id` must belong to the authenticated user when submitting peer reviews;
- `uploaded_by_profile_id` must belong to the authenticated user when adding dispute evidence.

Without a bearer token, local demo mode still works for MVP testing. This is temporary and must be replaced by required Auth + strict RLS before public launch.

Detailed guard document:

```text
C:\gcsc\docs\smartcontractor-role-ownership-guards.md
```

## Auth Smoke Tests

```powershell
cd C:\gcsc\construction-ai
npm run check:auth
```

The smoke harness checks auth endpoints, health feature flags, and role ownership guard coverage without requiring secrets.

Optional real Supabase session checks can be enabled later with local PowerShell environment variables:

```powershell
$env:SMARTCONTRACTOR_SMOKE_ACCESS_TOKEN="TEST_ACCESS_TOKEN"
$env:SMARTCONTRACTOR_SMOKE_FOREIGN_HOMEOWNER_ID="FOREIGN_HOMEOWNER_UUID"
$env:SMARTCONTRACTOR_SMOKE_FOREIGN_CONTRACTOR_ID="FOREIGN_CONTRACTOR_UUID"
npm run check:auth
```

Do not paste tokens into chat and do not commit them.

Detailed smoke-test document:

```text
C:\gcsc\docs\smartcontractor-auth-smoke-tests.md
```

## Verification Providers

```http
GET /api/verification/providers
```

Returns provider adapters for:

- manual review;
- Stripe Identity;
- Persona;
- Plaid;
- Middesk;
- state license board;
- insurance carrier;
- Metal Pay;
- XPR Network.

## Create Verification Check

```http
POST /api/verification/checks
```

Body:

```json
{
  "subject_type": "contractor",
  "subject_id": "CONTRACTOR_UUID",
  "provider": "manual",
  "check_type": "license",
  "status": "verified",
  "confidence_score": 92,
  "provider_reference": "WA-DEMO123",
  "result_summary": "Washington contractor license reviewed for MVP demo.",
  "evidence_url": "https://example.com/license-check",
  "expires_at": "2027-05-03T00:00:00Z"
}
```

## List Verification Checks

```http
GET /api/verification/checks
```

Optional filters:

```text
?subject_type=contractor
?subject_id=CONTRACTOR_UUID
?provider=manual
?check_type=license
?status=verified
```

## Verification Webhook Skeleton

```http
POST /api/verification/webhooks/PROVIDER_ID
```

MVP body:

```json
{
  "verification_check_id": "VERIFICATION_CHECK_UUID",
  "provider_reference": "provider_event_or_case_id",
  "event_type": "verification.completed",
  "status": "verified"
}
```

The webhook skeleton records a provider event, updates the matching verification check status when possible, and writes an audit event. Production provider signature verification must be added before public launch.

## Create Token Price Snapshot

```http
POST /api/collateral/price-snapshots
```

Body:

```json
{
  "token_symbol": "GCSC",
  "price_usd": 0.25,
  "source": "manual",
  "provider_reference": "admin-demo-price"
}
```

## List Token Price Snapshots

```http
GET /api/collateral/price-snapshots
```

Optional filter:

```text
?token_symbol=GCSC
```

## Create Token Collateral Lock

```http
POST /api/collateral/locks
```

Body:

```json
{
  "contractor_id": "CONTRACTOR_UUID",
  "loan_id": "OPTIONAL_LOAN_UUID",
  "wallet_account": "xprwallet",
  "token_symbol": "GCSC",
  "token_amount": 20000,
  "price_usd": 0.25,
  "ltv_percent": 25,
  "status": "proposed",
  "risk_note": "MVP collateral proposal only."
}
```

The MVP calculates:

```text
collateral_value_usd = token_amount * price_usd
max_borrow_usd = collateral_value_usd * ltv_percent / 100
```

No automatic liquidation is implemented. Token collateral must stay conservative until legal, oracle, custody, and smart contract review are complete.

## List Token Collateral Locks

```http
GET /api/collateral/locks
```

Optional filters:

```text
?contractor_id=CONTRACTOR_UUID
?loan_id=LOAN_UUID
?token_symbol=GCSC
?status=proposed
```

## Health

```http
GET /api/health
```

Expected:

```json
{
  "status": "ok",
  "service": "GCSC BuilderAI"
}
```

## Create Profile

```http
POST /api/smartcontractor/profiles
```

Body:

```json
{
  "role": "homeowner",
  "email": "owner@example.com",
  "full_name": "Demo Owner",
  "xpr_account": "demoowner111"
}
```

Roles:

- `homeowner`
- `contractor`
- `admin`

## Create Homeowner

```http
POST /api/smartcontractor/homeowners
```

Body:

```json
{
  "profile_id": "PROFILE_UUID",
  "display_name": "Demo Owner",
  "default_zip": "98101",
  "subscription_tier": "basic"
}
```

## Create Contractor

```http
POST /api/smartcontractor/contractors
```

Body:

```json
{
  "profile_id": "PROFILE_UUID",
  "business_name": "Demo Construction LLC",
  "license_number": "DEMO123",
  "license_state": "WA",
  "insurance_status": "pending"
}
```

## List Jobs

```http
GET /api/smartcontractor/jobs
```

Optional filters:

```text
?status=open&trade=remodeling&state=WA&zip=98101
```

## Create Job

```http
POST /api/smartcontractor/jobs
```

Body:

```json
{
  "homeowner_id": "HOMEOWNER_UUID",
  "title": "Kitchen remodel",
  "description": "Replace cabinets, flooring, and lighting.",
  "trade": "remodeling",
  "location_city": "Seattle",
  "location_state": "WA",
  "location_zip": "98101",
  "budget_min_usd": 5000,
  "budget_max_usd": 12000
}
```

## Submit Bid

```http
POST /api/smartcontractor/bids
```

Body:

```json
{
  "job_id": "JOB_UUID",
  "contractor_id": "CONTRACTOR_UUID",
  "amount_usd": 9800,
  "timeline_days": 21,
  "message": "Licensed contractor available for this scope."
}
```

## List Bids

```http
GET /api/smartcontractor/bids
```

Optional filters:

```text
?job_id=JOB_UUID
?contractor_id=CONTRACTOR_UUID
```

## Create Project Contract

```http
POST /api/smartcontractor/project-contracts
```

Body:

```json
{
  "job_id": "JOB_UUID",
  "accepted_bid_id": "BID_UUID",
  "homeowner_id": "HOMEOWNER_UUID",
  "contractor_id": "CONTRACTOR_UUID",
  "title": "Kitchen remodel agreement",
  "terms_summary": "Milestone-based project contract with payment hold, dispute window, and loan-first repayment waterfall.",
  "total_amount_usd": 9800,
  "platform_fee_usd": 490,
  "status": "pending_signature"
}
```

## List Project Contracts

```http
GET /api/smartcontractor/project-contracts
```

Optional filters:

```text
?job_id=JOB_UUID
?contractor_id=CONTRACTOR_UUID
?homeowner_id=HOMEOWNER_UUID
?status=active
```

## Create Milestone

```http
POST /api/smartcontractor/milestones
```

Body:

```json
{
  "project_contract_id": "PROJECT_CONTRACT_UUID",
  "job_id": "JOB_UUID",
  "title": "Materials purchased and delivered",
  "description": "Contractor buys required materials and uploads receipts/photos.",
  "sequence_number": 1,
  "amount_usd": 2500,
  "payment_status": "not_funded",
  "work_status": "not_started"
}
```

## List Milestones

```http
GET /api/smartcontractor/milestones
```

Optional filters:

```text
?project_contract_id=PROJECT_CONTRACT_UUID
?job_id=JOB_UUID
?work_status=in_progress
?payment_status=funded
```

## Unlock Competitor Bid

```http
POST /api/smartcontractor/bids/BID_UUID/unlock
```

Body:

```json
{
  "contractor_id": "CONTRACTOR_UUID",
  "price_usd": 5,
  "payment_tx_hash": "optional_xpr_or_card_payment_reference"
}
```

## Request Contractor Loan

```http
POST /api/smartcontractor/loans
```

Body:

```json
{
  "contractor_id": "CONTRACTOR_UUID",
  "job_id": "JOB_UUID",
  "principal_usd": 2500,
  "apr_percent": 2,
  "risk_score": 72,
  "purpose": "Materials and labor mobilization before first milestone payment."
}
```

MVP UI scoring factors:

- UBI / business registration number;
- EIN / tax identity;
- license verification status;
- dispute history;
- repayment history;
- optional token collateral estimate;
- conservative LTV preview.

## List Contractor Loans

```http
GET /api/smartcontractor/loans
```

Optional filters:

```text
?contractor_id=CONTRACTOR_UUID
?job_id=JOB_UUID
?status=all
```

## Record Loan Repayment

```http
POST /api/smartcontractor/loans/LOAN_UUID/repayments
```

Body:

```json
{
  "amount_usd": 1000,
  "source": "milestone_payment",
  "payment_tx_hash": "optional_xpr_or_escrow_reference"
}
```

The MVP subtracts the repayment from `outstanding_usd`. If the balance reaches zero, the loan status becomes `repaid`.

## List Disputes

```http
GET /api/smartcontractor/disputes
```

Optional filters:

```text
?status=open&job_id=JOB_UUID
```

## Open Dispute

```http
POST /api/smartcontractor/disputes
```

Body:

```json
{
  "job_id": "JOB_UUID",
  "homeowner_id": "HOMEOWNER_UUID",
  "contractor_id": "CONTRACTOR_UUID",
  "opened_by_role": "homeowner",
  "title": "Tile work does not match agreed scope",
  "description": "Homeowner says the installed tile is uneven and different from the approved material."
}
```

## Add Dispute Evidence

```http
POST /api/smartcontractor/disputes/DISPUTE_UUID/evidence
```

Body:

```json
{
  "uploaded_by_profile_id": "PROFILE_UUID",
  "evidence_type": "photo",
  "evidence_url": "https://example.com/photo.jpg",
  "notes": "Photo of bathroom wall tile after contractor marked milestone complete."
}
```

Evidence types:

- `photo`
- `video`
- `document`
- `link`
- `note`

## Submit Peer Contractor Review

```http
POST /api/smartcontractor/disputes/DISPUTE_UUID/reviews
```

Body:

```json
{
  "reviewer_contractor_id": "CONTRACTOR_UUID",
  "review_type": "remote",
  "quality_score": 72,
  "finding": "Tile alignment is visibly inconsistent in two corners, but most work is acceptable.",
  "recommendation": "request_rework",
  "token_reward_amount": 25,
  "rating_points_awarded": 1,
  "loan_score_points": 1
}
```

Recommendations:

- `release_payment`
- `request_rework`
- `partial_refund`
- `full_refund`
- `needs_onsite_inspection`

## Current MVP Security

Temporary development write policies are enabled in Supabase so the MVP can be tested before full authentication is connected.

Before public launch:

- replace broad dev write policies with authenticated user-owned RLS policies;
- connect Supabase Auth;
- map `auth.uid()` to `profiles.auth_user_id`;
- keep backend role ownership guards active for every user-owned write;
- run `npm run check:auth` in default and real test-user modes;
- protect contractor loan approval actions behind admin or treasury permissions;
- add payment verification before bid unlocks;
- add rate limits to SmartContractor endpoints.
