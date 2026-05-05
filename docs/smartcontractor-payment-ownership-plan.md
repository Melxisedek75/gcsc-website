# SmartContractor Payment Ownership Plan

Date: 2026-05-04

## Status

Prepared locally only. Nothing was applied to live Supabase.

## Problem

`payment_intents` currently stores payment purpose and generic references, but it does not strongly identify which user or project entity owns the payment row.

That is not enough for strict RLS because a policy cannot safely answer:

- which homeowner can read this payment;
- which contractor can read this payment;
- which project contract or milestone this payment belongs to;
- whether a loan repayment belongs to the current contractor.

## Decision

Add typed ownership/reference columns to `payment_intents`:

- `payer_profile_id`;
- `homeowner_id`;
- `contractor_id`;
- `job_id`;
- `loan_id`;
- `project_contract_id`;
- `milestone_id`.

This lets the platform show payment status to the correct participant without exposing every payment row to every authenticated user.

## Prepared SQL

`docs/smartcontractor-payment-intent-ownership-draft.sql`

The draft:

- adds typed nullable FK columns;
- adds indexes for RLS and lookup performance;
- documents the columns;
- replaces the temporary `payment_intents_select_none_from_browser` policy with a participant-based select policy;
- keeps browser insert/update closed because payment creation and provider webhooks must remain backend-controlled.

## Backend Rule

Payment rows should be created by backend endpoints only.

Frontend should send business intent, for example:

- lead token purchase;
- membership payment;
- milestone payment;
- loan repayment;
- bid unlock;
- token collateral lock.

Backend should then:

1. verify the authenticated user owns the referenced role/entity;
2. create a `payment_intents` row with typed ownership columns;
3. call the selected provider adapter;
4. write an audit event;
5. update the payment row from webhook/provider confirmation.

## Why This Matters

This prevents a common marketplace security bug: payments appear harmless, but payment metadata can reveal project value, loan amount, contractor activity, homeowner activity, disputes, and business volume.

For GCSC, payment data is sensitive because it connects to:

- contractor credit;
- loan repayment;
- milestone progress;
- lead purchases;
- token collateral;
- future DAO revenue and treasury reporting.

## Next Step

After founder review, combine this draft with the strict RLS package and test with:

1. founder/admin user;
2. homeowner test user;
3. contractor test user;
4. anonymous user.

