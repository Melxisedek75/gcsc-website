# SmartContractor US State Compliance Research

## Purpose

This research directory contains a comprehensive 50-state compliance analysis for SmartContractor's future product features. The goal is to build **state-aware logic** into the dashboard, documents, escrow, verification, lending/advance eligibility, and smart-contract guard rails so that product behavior, disclosures, warnings, and blocked actions automatically adapt based on the state of the user, contractor, or property.

## Products Under Evaluation

### 1. Token-Collateral Equipment Credit

A contractor stakes GCSC tokens as collateral to receive limited credit for equipment, tools, materials, and transportation. The tokens remain locked in a smart contract until repayment conditions are met.

**Status:** MVP/demo planning only. No real-money lending, token collateral lock, liquidation, or repayment routing is active.

### 2. ClaimBridge Emergency Advance

After an insured event (fire, water damage, flood, storm, roof damage, smoke damage, mold, tree damage), a homeowner may receive a fast advance against the expected insurance claim payout.

**Status:** MVP/demo planning only. No live insurance claim advance, assignment of benefits, claim financing, or repayment routing from insurance proceeds is active.

### 3. Escrow-Backed Contractor Advance

A homeowner and contractor enter a construction contract. The homeowner deposits funds into an escrow account. When escrow confirms funds are locked, SmartContractor may issue the contractor a limited advance to begin work or purchase materials. Repayment comes from future approved milestones: first repay the advance, then release remaining milestone funds to the contractor.

**Example:**
- Escrow balance: $50,000
- Advance limit: $10,000
- Rule idea: max advance = min(20% escrow balance, 50% next milestone, risk limit)
- Advance cannot be issued if: contractor not verified, contract disputed, escrow not funded, milestone invalid, legal review missing, or state rules block it.

**Status:** MVP/demo planning only. No real-money production.

### 4. Contract-Backed Contractor Working Capital

A contractor receives working capital advances secured by a verified construction contract and tracked milestones.

**Status:** MVP/demo planning only. No real-money production.

## Important Disclaimers

1. **Not Legal Advice.** This research does not constitute legal advice, legal opinion, or a determination that any product is lawful in any state.
2. **Attorney Review Required.** All findings marked "Requires licensed attorney review" must be reviewed by counsel licensed in the relevant state(s) before any product decision.
3. **No Secret Handling.** This repository contains no secrets, env variables, tokens, or private keys.
4. **No Smart Contract Code Changes.** This research informs future design but does not modify deployed smart contract code. No smart contract code is written in this research.
5. **Official Sources Only.** All factual claims are sourced from official state regulators, federal agencies, statutes, and court/government/legislative pages. Where information is unavailable or unclear, it is marked "Not confirmed."
6. **Blocked Live Gates.** All live-money actions remain blocked until legal, provider, security, and audit gates are passed.
7. **Dynamic Research.** State laws change frequently. This research is a snapshot and must be refreshed before any product launch.

## Directory Structure

```
docs/research/us-state-compliance/
  README.md                                # This file
  master-matrix.csv                        # All 50 states as CSV
  master-matrix.json                       # All 50 states as JSON
  product-requirements-draft.md            # Unified product requirements
  smart-contract-module-recommendations.md # Future module specs
  implementation-questions-for-codex.md    # Technical questions for Codex
  states/
    AL.md                                  # Alabama
    AK.md                                  # Alaska
    ...                                    # (50 state files)
    WY.md                                  # Wyoming
```

## How to Read a State File

Each state file follows a standard 10-section structure:

| Section | Content |
|---------|---------|
| 1. Executive Summary | Theoretical launch status for each product |
| 2. Contractor / Home Improvement Rules | Licensing, disclosures, contract terms |
| 3. Lending / Credit Rules | Consumer vs. commercial, usury, licensing, MCA/factoring |
| 4. Escrow-Backed Contractor Advance Rules | Escrow control, assignment of payment rights, UCC Article 9 |
| 5. Token Collateral / Digital Asset Risk | Money transmitter, virtual currency, collateral, liquidation |
| 6. Insurance Claim Advance / ClaimBridge Risk | AOB, public adjuster, claim proceeds, loss draft |
| 7. Dashboard Logic Recommendation | UI/UX warnings, blocked buttons, disclosures, state gates |
| 8. Smart Contract Implications | Off-chain checks, blocked actions, audit events, admin approvals |
| 9. Open Questions For Licensed Attorney | Specific questions for counsel |
| 10. Sources | Official source links |

## Status Legend

- **Low local issue found** -- Minor compliance items; likely manageable with standard disclosures.
- **Medium legal review needed** -- State has notable regulatory requirements; counsel should review.
- **High legal review needed** -- Significant regulatory barriers; detailed legal analysis required.
- **Blocked until licensed attorney review** -- Major legal or regulatory blockers; cannot proceed without counsel.
- **Not confirmed** -- Information unavailable or unclear from official sources.

## Contributing

- All changes must cite official sources.
- Mark uncertain information as "Not confirmed."
- Do not add legal conclusions without attorney review.
- Update the master-matrix.csv and master-matrix.json when state files change.

---

*Last updated: 2025-05-28*
*Research by: GCSC/SmartContractor Compliance Research Team*
