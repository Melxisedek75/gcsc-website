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

- `GET /api/smartcontractor/jobs`
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

