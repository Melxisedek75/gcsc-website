# SmartContractor Smart Contract Design Draft

Date: 2026-05-04

Status: architecture draft only. Not deployed. Not legal advice.

## Purpose

This document defines the first smart-contract direction for SmartContractor before coding WASM contracts.

The goal is to avoid building disconnected contracts. SmartContractor smart contracts should mirror the business workflow already modeled in the backend:

```text
job -> bid -> project contract -> milestone -> payment/escrow -> loan repayment -> dispute/review -> reward/audit
```

## Design Rules

1. Keep real-world legal contracts off-chain as signed documents or backend records.
2. Put only verifiable settlement state, balances, hashes, references, and events on-chain.
3. Do not store raw private documents, SSNs, IDs, bank data, or homeowner personal data on-chain.
4. Use backend/Supabase as the MVP coordination layer first.
5. Move only stable, repeatable settlement rules to smart contracts.
6. Treat lending and escrow as legally sensitive. Deploy only after attorney and compliance review.

## Contract Modules

Recommended first modules:

| Module | Purpose |
|---|---|
| `gcscrow1111` | Project milestone escrow and release ledger |
| `gcscloan111` | Contractor loan ledger and repayment events |
| `gcsccollat1` | Token collateral lock/release/default state |
| `gcscreview1` | Peer review reward and reputation event hook |

Account names are draft placeholders. Final XPR account names must be checked for availability and created by the founder.

## Shared Concepts

### Asset Symbols

Initial accepted symbols:

- `XPR`;
- `GCSC`;
- `GCST`;
- later `GCSCBUILD` if useful for rewards.

### External References

Every on-chain record should include a backend reference:

- `job_id`;
- `project_contract_id`;
- `milestone_id`;
- `loan_id`;
- `dispute_id`;
- `review_id`;
- `payment_intent_id`.

These can be stored as strings or checksum/hash values depending on RAM/storage needs.

### Event Strategy

Every important action should emit an on-chain action trace and also be mirrored into backend `audit_events`.

Examples:

- `milestone_funded`;
- `milestone_released`;
- `loan_opened`;
- `loan_repaid`;
- `collateral_locked`;
- `review_rewarded`.

## Module 1: Project Escrow Contract

Draft account:

```text
gcscrow1111
```

### Problem

Homeowners need protection from uncontrolled upfront deposits. Contractors need confidence that approved work will be paid.

### Core Tables

#### `escrows`

Fields:

- `escrow_id`;
- `project_contract_id`;
- `job_id`;
- `homeowner`;
- `contractor`;
- `asset_symbol`;
- `total_amount`;
- `funded_amount`;
- `released_amount`;
- `refunded_amount`;
- `status`;
- `created_at`;
- `updated_at`.

Statuses:

- `draft`;
- `funded`;
- `partially_released`;
- `held`;
- `disputed`;
- `completed`;
- `cancelled`.

#### `milestones`

Fields:

- `milestone_id`;
- `escrow_id`;
- `backend_milestone_id`;
- `sequence_number`;
- `amount`;
- `work_status`;
- `payment_status`;
- `evidence_hash`;
- `dispute_id`;
- `submitted_at`;
- `approved_at`;
- `released_at`.

### Actions

#### `createescrow`

Creates an escrow shell linked to a backend project contract.

Required authority:

- platform admin/multisig in MVP;
- later homeowner and contractor signatures.

#### `fund`

Records escrow funding after asset transfer.

Funding options:

- direct token transfer to escrow contract;
- backend-confirmed payment intent mirrored on-chain;
- future provider bridge event.

#### `submitwork`

Contractor marks milestone as submitted and stores evidence hash/reference.

#### `approve`

Homeowner or authorized inspector approves milestone.

#### `release`

Releases milestone amount according to waterfall:

1. platform fee;
2. loan repayment allocation;
3. contractor payout;
4. treasury/burn allocation if applicable.

#### `hold`

Places milestone in hold/dispute state.

#### `refund`

Refunds allowed amount to homeowner when rules permit.

### Safety Notes

- Do not call this "licensed escrow" unless a licensed escrow/payment partner is used.
- In early launch, call it a milestone payment ledger or smart-contract-controlled settlement layer.
- Real fiat/card payments may stay with licensed providers while the blockchain mirrors status.

## Module 2: Contractor Loan Ledger Contract

Draft account:

```text
gcscloan111
```

### Problem

Contractor credit must be auditable and tied to platform performance.

### Core Tables

#### `loans`

Fields:

- `loan_id`;
- `backend_loan_id`;
- `contractor`;
- `job_id`;
- `project_contract_id`;
- `principal`;
- `outstanding`;
- `apr_bps`;
- `status`;
- `risk_score`;
- `credit_tier`;
- `opened_at`;
- `due_at`;
- `closed_at`.

Statuses:

- `requested`;
- `approved`;
- `funded`;
- `active`;
- `repaid`;
- `defaulted`;
- `rejected`;
- `cancelled`.

#### `repayments`

Fields:

- `repayment_id`;
- `loan_id`;
- `amount`;
- `source`;
- `payment_reference`;
- `created_at`.

Sources:

- `manual`;
- `milestone_payment`;
- `escrow_release`;
- `token_collateral`;
- `admin_adjustment`.

### Actions

#### `openloan`

Creates loan record after backend risk review.

#### `fundloan`

Marks loan funded and increases outstanding amount.

#### `repay`

Applies repayment and updates outstanding balance.

#### `markdefault`

Marks default after backend/legal process.

#### `close`

Closes repaid or cancelled loan.

### Safety Notes

- This contract should not decide legal loan eligibility by itself.
- Backend/RAA/Compliance Agent should calculate eligibility.
- Human/legal review is required before real lending.

## Module 3: Token Collateral Lock Contract

Draft account:

```text
gcsccollat1
```

### Problem

Proven contractors may later use eligible GCSC or related token holdings to support larger business loans.

### Core Tables

#### `locks`

Fields:

- `lock_id`;
- `backend_lock_id`;
- `contractor`;
- `loan_id`;
- `token_symbol`;
- `token_amount`;
- `price_snapshot_hash`;
- `collateral_value_usd`;
- `ltv_bps`;
- `max_borrow_usd`;
- `status`;
- `locked_at`;
- `released_at`.

Statuses:

- `proposed`;
- `locked`;
- `partially_released`;
- `released`;
- `called`;
- `defaulted`;
- `cancelled`.

### Actions

#### `lock`

Locks eligible tokens for a loan.

#### `release`

Returns collateral after repayment or approved partial release.

#### `callmargin`

Flags collateral review if LTV becomes unsafe.

#### `markdefault`

Marks collateral as defaulted after loan default process.

### Oracle And Pricing

Do not make the smart contract trust arbitrary price input.

MVP options:

- backend/manual snapshot hash only;
- admin/multisig-controlled price snapshot;
- later oracle/provider adapter.

### Safety Notes

- Never promise token price appreciation.
- Use conservative LTV.
- Add explicit volatility disclosures in UI/docs.
- Do not auto-liquidate before legal and oracle design are reviewed.

## Module 4: Peer Review Reward Hook

Draft account:

```text
gcscreview1
```

### Problem

Peer contractors can add value by reviewing disputed work, but rewards must be trackable and abuse-resistant.

### Core Tables

#### `reviews`

Fields:

- `review_id`;
- `backend_review_id`;
- `dispute_id`;
- `reviewer`;
- `contractor_reviewed`;
- `quality_score`;
- `recommendation`;
- `reward_amount`;
- `reputation_points`;
- `loan_score_points`;
- `status`;
- `created_at`.

Statuses:

- `submitted`;
- `accepted`;
- `rejected`;
- `rewarded`;
- `clawed_back`.

### Actions

#### `recordreview`

Records review metadata and evidence hash/reference.

#### `approvereview`

Approves review for reward after conflict-of-interest checks.

#### `reward`

Issues reward amount or records reward payable.

#### `clawback`

Marks reward review as invalid if fraud/collusion is found.

### Abuse Controls

Peer review must check:

- reviewer is a verified contractor;
- reviewer is not the disputed contractor;
- reviewer is not linked to homeowner or contractor;
- review quality score is within range;
- duplicate review prevention;
- unusual voting/review patterns.

## Backend-To-Chain Bridge

Before writing contracts, backend should define stable mapping:

```text
Supabase table -> smart contract table/action -> audit event
```

Example:

| Backend Event | Chain Action | Audit Event |
|---|---|---|
| `milestone created` | `createescrow` / milestone row | `milestone_created` |
| `payment intent paid` | `fund` | `milestone_funded` |
| `loan repayment recorded` | `repay` | `loan_repaid` |
| `dispute review submitted` | `recordreview` | `review_submitted` |
| `token collateral lock created` | `lock` | `collateral_locked` |

## Build Order

Recommended order:

1. Finish backend and RLS safety.
2. Finalize action/table names.
3. Build `gcscloan111` as a ledger-only contract first.
4. Build `gcsccollat1` as a lock-only contract.
5. Build `gcscreview1` as reward ledger.
6. Build `gcscrow1111` only after payment/escrow legal review.

Why this order:

- loan/collateral/review ledger contracts can start as audit mirrors;
- escrow touches money movement more directly and needs more legal/compliance care.

## Open Questions For Founder Later

1. Which XPR account names should be created?
2. Which token is used first for rewards: GCSC, GCSCBUILD, or GCST?
3. Should milestone funds be actually held on-chain in phase 1, or only mirrored from provider payments?
4. Who signs admin actions: founder account, DAO multisig, or treasury multisig?
5. Which state/legal structure will govern contractor financing first?

## Non-Goals For First Contract Version

- no real consumer lending;
- no automatic legal judgment;
- no raw document storage;
- no automatic token liquidation;
- no promise of token price growth;
- no external payment provider custody replacement.
