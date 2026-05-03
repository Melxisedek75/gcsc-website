# SmartContractor Supabase Backend

Date: 2026-05-03

## Supabase Project

- Organization: Melxisedek75's Org
- Project: smartcontractor-gcsc
- Project ref: uhixuyurxsrxayhghjzm
- Region: us-east-1
- Public URL: https://uhixuyurxsrxayhghjzm.supabase.co

## Database Tables

- profiles
- contractors
- homeowners
- jobs
- bids
- bid_unlocks
- contractor_loans
- loan_repayments
- ratings

## Product Logic Covered

- Homeowners can create construction jobs.
- Contractors can submit bids.
- Contractors can unlock competitor bid details as a paid platform action.
- Contractors can request working-capital loans tied to company history, credit tier, risk score, and optional job.
- Loan repayments can be recorded from milestone payments, escrow releases, manual payments, or admin adjustments.

## Backend API Added

Backend folder: `C:\gcsc\construction-ai`
MVP browser page: `http://localhost:3002/smartcontractor.html`

- `GET /api/smartcontractor/jobs`
- `POST /api/smartcontractor/profiles`
- `POST /api/smartcontractor/contractors`
- `POST /api/smartcontractor/homeowners`
- `POST /api/smartcontractor/jobs`
- `POST /api/smartcontractor/bids`
- `POST /api/smartcontractor/bids/:bidId/unlock`
- `POST /api/smartcontractor/loans`
- `GET /api/health`

## Local Environment

The backend `.env` now includes public Supabase values:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

Do not put Supabase service-role keys in public frontend code.

## Verification

Completed checks:

- Supabase migration applied successfully.
- Supabase security advisor: clean.
- Missing foreign-key indexes fixed.
- Remaining performance messages are only `unused index`, expected on an empty new database.
- `node -c server.js` passed.
- Local backend started on port `3002`.
- `GET http://localhost:3002/api/health` returned `status: ok`.
- `GET http://localhost:3002/api/smartcontractor/jobs` returned an empty jobs list from Supabase.
- Full workflow test passed through the local API:
  homeowner profile -> homeowner -> job -> contractor profile -> contractor -> bid -> contractor loan.
- `GET http://localhost:3002/smartcontractor.html` returned HTTP 200.

## Current MVP Security Note

Temporary dev write policies are enabled so the MVP can be tested before full Supabase Auth is wired into the frontend.
Before public launch, replace these broad dev policies with user-owned RLS rules tied to `auth.uid()`.
