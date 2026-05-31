# GCSC FIO Protocol Integration Brief

Status: internal research and architecture brief. No FIO domain, handle, transaction, integration, or customer-facing Web3 workflow is approved by this document.

## Role In GCSC

FIO Protocol is a future Web3 usability layer for human-readable handles, payment requests, and encrypted metadata.

It is not:

- KYC;
- KYB;
- AML;
- escrow;
- lending;
- custody;
- securities compliance;
- contractor licensing;
- legal approval;
- payment approval.

## Candidate Use Cases

| Use Case | Example | Phase |
|---|---|---|
| Contractor handle | `contractor@gcsc` | Future optional profile |
| Inspector handle | `inspector@gcsc` | Future optional profile |
| Project handle | `project-123@gcsc` | Research only |
| Milestone payment request | request tied to milestone id | Future legal/provider review |
| Encrypted memo | project id and invoice reference | Future technical review |
| Wallet address abstraction | prevent wrong-address copy/paste | Future UX review |

## Technical Research Questions

1. Can FIO Handles map safely to GCSC profile IDs?
2. Can FIO Requests carry a safe milestone reference without exposing private data?
3. How should encrypted FIO Data be stored in GCSC audit logs?
4. Can FIO coexist with WebAuth and XPR account names?
5. What happens if a contractor loses or changes a FIO Handle?
6. What user consent is required before a FIO Handle is shown publicly?
7. What states or countries create extra payment-request risk?

## Safe Pilot Order

1. Documentation-only design.
2. Internal admin-only test handle.
3. Testnet/no-real-money request simulation.
4. Optional contractor profile field.
5. Provider-reviewed payment request flow.

## Blocked Until Review

- registering a public GCSC FIO domain;
- asking users to create FIO Handles;
- sending real payment requests;
- exposing handles publicly;
- tying FIO requests to real escrow, loans, stablecoin settlement, or token collateral.
