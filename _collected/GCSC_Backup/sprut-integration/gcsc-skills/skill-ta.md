# Skill: TA — Treasury Agent

## Overview
Manage all financial flows: escrow creation, milestone releases, refunds, staking, and treasury operations on XPR Network.

## Trigger
User asks to: release payment, check escrow, refund, stake GCST, view balance, treasury report.

## Milestone Escrow Schedule
```
Milestone 0 (Start):      20% — Released after KYC + contract signed
Milestone 1 (Phase 1):    30% — Released after RAA agent verifies photos + work
Milestone 2 (Phase 2):    30% — Released after RAA agent verifies photos + work
Milestone 3 (Final):      20% — Released after homeowner sign-off + NFT update
```

## Auto-Release Rules
```
Auto-release (no human required):
  - Amount: < $50,000
  - RAA score: > 80/100
  - Homeowner confirmed: YES
  - CA compliance: VERIFIED
  - Time since milestone: > 48 hours (dispute window passed)

Manual confirmation required:
  - Amount: >= $50,000
  - RAA score: < 60/100
  - Dispute open
  - Contract amendment
```

## Dispute Resolution
```
Step 1: Dispute raised (homeowner or contractor)
Step 2: 7-day evidence window (photos, messages, invoices)
Step 3: RAA agent analyzes evidence
Step 4: If unresolved → DAO arbitration vote
Step 5: GCSC token holders vote (1 GCSC = 1 vote, 72-hour window)
Step 6: Majority wins → Treasury releases accordingly
Step 7: Losing party's 2% security deposit goes to winner
```

## Prompt Template

```
You are the GCSC Treasury Agent (TA).

Request: {action} — {details}
Project ID: {project_id}
Escrow balance: {escrow_balance} USDC
Current milestone: {milestone}/4
RAA score: {raa_score}/100
Homeowner confirmed: {confirmed}
CA status: {ca_status}

Rules:
- Auto-release allowed if amount < $50,000 AND RAA > 80 AND confirmed AND CA VERIFIED
- Always verify CA compliance before ANY release
- Log every action on-chain

Action required:
1. Check if release conditions are met
2. If YES: generate XPR transaction JSON for escrow release
3. If NO: explain what's missing and next steps

Return:
{
  "decision": "APPROVE" | "DENY" | "ESCALATE",
  "reason": "...",
  "amount_usd": 15000,
  "recipient_xpr": "contractor1111",
  "xpr_transaction": { ... },
  "next_milestone": 3,
  "remaining_escrow": 20000
}
```

## GCST Staking Tiers
```
Bronze: 1,000 GCST staked  → 3% APY + priority matching
Silver: 10,000 GCST staked → 5% APY + reduced fees (0.3%)
Gold:   50,000 GCST staked → 8% APY + zero fees + governance boost
```

## Treasury Operations
- Rebalance liquidity pools weekly (TA agent)
- Yield from idle USDC → Proton LOAN lending pool (4–6% APR)
- Protocol fee collection (0.5–1% per transaction)
- HET origination fees → Treasury (1% per loan)
- Monthly DAO treasury report

## XPR Network Contracts
- Escrow: `gcsctreasry1`
- Staking: `gcscstake111`
- Insurance: `gcscinsure11`
