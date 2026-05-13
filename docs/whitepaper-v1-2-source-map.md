# GCSC Whitepaper v1.2 Source Map

Status: planning document only. Founder approval required before any published whitepaper edit.

## Purpose

This source map tells the next editor where each approved v1.2 idea should land in the future whitepaper update.

Do not edit `whitepaper.html` yet. This file is only a bridge between the founder-review drafts and a later scoped whitepaper edit.

## Source Documents

- `docs/whitepaper-v1-2-restructure-draft.md`
- `docs/whitepaper-v1-2-founder-review-checklist.md`
- `docs/whitepaper-v1-2-edit-plan.md`
- current published whitepaper source after founder confirms the target file

## Section Mapping

| Future section | Source input | Edit intent |
|----------------|--------------|-------------|
| Executive Summary | restructure draft purpose | Lead with GCSC as construction-financial infrastructure, not a token-first project |
| Construction Trust Problem | current whitepaper plus SmartContractor notes | Keep delayed payment, fraud, deposit risk, weak reputation, and dispute opacity |
| SmartContractor Marketplace | Part 1 draft and edit plan | Explain property owners, contractors, bids, project contracts, milestones, and escrow-ready coordination |
| Project Contracts And Milestones | SmartContractor architecture section | Move database-first contract and milestone workflow before token or DAO sections |
| Escrow-Ready Payment Coordination | payment router and legal review docs | Say escrow-ready, not live escrow, until provider/legal/founder approval |
| Contractor Credit | contractor credit whitepaper section | Present as deposit-risk reduction and working-capital preparation, not automatic real lending |
| Contractor Reputation Layer | Part 2 draft | Make completed jobs, disputes, reviews, repayment, bid accuracy, licenses, and insurance the trust layer |
| AI Boundaries And Compliance | AI workflow and legal review docs | Keep AI as assistant for scope, evidence, risk, and dispute triage, not final legal or money authority |
| Digital Asset Market Clarity Act | CLARITY framing draft | Mention evolving regulation carefully with compliance-ready language and no legal conclusion |
| GCSC/GCST Token Economics | current token sections | Move after product, trust, compliance, and safety language unless founder chooses otherwise |
| Stablecoin Settlement | Part 3 draft | Present as future regulated settlement infrastructure, not available in every jurisdiction |
| Real Estate DAO | current ecosystem sections | Move to later expansion unless founder approves main-body placement |
| Risk Factors And Launch Gates | edit plan | Add legal, provider, custody, AML, smart contract audit, RLS/admin, and public beta evidence gates |

## Language Migration Rules

Use:

- SmartContractor Marketplace;
- project contracts;
- milestones;
- escrow-ready;
- contractor credit workflow;
- Contractor Reputation Layer;
- AI Boundaries;
- Compliance;
- GCSC/GCST Token Economics;
- Stablecoin Settlement;
- Real Estate DAO;
- Risk Factors.

Avoid:

- token price promise;
- automatic loan approval;
- automatic escrow release;
- automatic token collateral liquidation;
- legal conclusion from pending legislation;
- claims that stablecoin settlement is available everywhere.

## Safety Boundaries

Every published edit must preserve:

- no real escrow;
- no real lending;
- no real token collateral;
- no token price promise;
- attorney/provider/founder approval before regulated financial workflows;
- founder approval required before public use.

## Verification

Before any future whitepaper publish, run:

```bash
npm run check:whitepaper-sections
npm run check:whitepaper-v1-2-restructure
npm run check:whitepaper-v1-2-founder-review
npm run check:whitepaper-v1-2-edit-plan
npm run check:whitepaper-v1-2-source-map
npm run check
```
