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
- protect contractor loan approval actions behind admin or treasury permissions;
- add payment verification before bid unlocks;
- add rate limits to SmartContractor endpoints.
