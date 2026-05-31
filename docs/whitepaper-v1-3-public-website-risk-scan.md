# GCSC Whitepaper v1.3 Public Website Risk Scan

Status: internal scan. This does not approve public website edits, publication, deletion, replacement, legal claims, provider commitments, live payments, live loans, escrow, stablecoin settlement, token collateral, FIO actions, Metallicus claims, or XPR signatures.

Scan date: 2026-05-31 PT.

Files scanned:

- `whitepaper.html`
- `index.html`

Command used:

```powershell
rg -n "investment|investor|staking|yield|instant loan|loan|AI-managed|AI managed|DAO|NFT|guaranteed|guarantee|token appreciation|appreciation|escrow|stablecoin|DeFi|buyback|burn|rewards|passive income|risk-free|SEC-approved|regulator-approved|Metallicus|FIO|WebAuth|XPR|Metal" whitepaper.html index.html
```

## Executive Finding

The current public website and v1.0 whitepaper still use token-first and crypto-first language. This is not aligned with v1.3.

The riskiest pattern is that `whitepaper.html` presents GCSC as a decentralized protocol with DAO, NFTs, staking/yield, DeFi lending, token collateral, automatic AI agents, tokenomics, burns, buybacks, and contractor loans. Under the v1.3 direction, those concepts must move into future regulated roadmap language or be removed from public-facing claims until reviewed.

`index.html` has fewer issues, but still says construction reputation becomes a financial asset, smart escrow releases payments on blockchain, every payment/reputation score is recorded immutably, and reputation works as collateral. Those claims need softer, provider-reviewed wording.

## Highest-Risk `whitepaper.html` Findings

| Line | Current Wording Pattern | Risk | v1.3 Replacement Direction |
|---|---|---|---|
| 7 | decentralized ecosystem on XPR Network | crypto-first public positioning | Construction Trust Infrastructure with future regulated Web3 layer |
| 42, 96, 198, 288-294 | DAO governance / Real Estate DAO | governance, securities, custody, property claims | future reviewed governance/RWA roadmap |
| 56, 68 | decentralized construction ecosystem | token-first positioning | construction trust infrastructure |
| 68 | DAO governed by AI agents and smart contracts | autonomous legal/finance decision risk | AI-assisted review with human/provider gates |
| 69 | code-enforced guarantees | consumer protection / guarantee risk | structured records, review gates, and partner workflows |
| 75 | NFC tokens minted as NFTs | NFT/security/speculation risk | future digital construction records after review |
| 89, 110-114 | Metal, XPR, WebAuth, Proton Loan as coherent financial ecosystem | partnership/live-finance implication | candidate infrastructure paths, not approved partners |
| 130, 366 | DAO treasury, yield optimization, buyback | securities/yield/buyback risk | future treasury research, review-required |
| 147 | 100% contract guarantee | guarantee/consumer risk | demo guarantee removed or provider-reviewed offer |
| 163, 186 | GCSC tokens/equipment NFTs as collateral | lending/securities/collateral risk | future token-collateral review only |
| 171, 183-184 | contractor requests small business loan through GCSC, funds released, repayment routing | lending/license/money movement risk | lender/provider-reviewed working-capital readiness |
| 194 | automatic staking into 401K pool | securities/retirement/tax risk | worker benefits research only |
| 250, 269-281 | yield, burn, buyback, stakers, loan interest revenue | investment/token economics risk | token utility roadmap, not public return model |
| 348 | NFT reputation badges | NFT/gamification/speculation risk | contractor performance credentials |
| 377 | token classification subject to CLARITY Act, KYC/AML implemented, insured through InsurAce/Nexus | overclaiming compliance/insurance | designed for review under evolving rules |
| 391 | tokenomics ensure sustainable growth, AI agents operate autonomously, distributing value | investment/autonomous control risk | staged product roadmap with human/provider review |

## Highest-Risk `index.html` Findings

| Line | Current Wording Pattern | Risk | v1.3 Replacement Direction |
|---|---|---|---|
| 7 | decentralized infrastructure for construction payments, escrow, reputation on XPR | public live-finance implication | construction trust infrastructure for project records and future regulated settlement |
| 66 | reputation into a financial asset, smart escrow, all on blockchain | collateral/security/escrow risk | verified reputation records and escrow-ready milestones |
| 105, 122, 147, 160 | blockchain escrow releases payments | unlicensed escrow/payment-release implication | escrow-ready records for licensed partners |
| 128 | self-evolving AI economic system | autonomous finance implication | AI-assisted construction workflow research |
| 147 | every contract, payment, reputation score recorded immutably | privacy/finality/live-blockchain implication | future audit references where approved |
| 180-181 | reputation as collateral | lending/collateral risk | reputation as lender-ready underwriting data |
| 199 | decentralized infrastructure for construction finance | finance-platform implication | construction trust infrastructure |

## Safe Replacement Principles

1. Replace "decentralized construction ecosystem" with "Construction Trust Infrastructure."
2. Replace "blockchain escrow releases payment" with "escrow-ready milestone records for licensed partner review."
3. Replace "GCSC loans" with "lender/provider-reviewed working-capital readiness."
4. Replace "NFT" with "future digital construction record" or "contractor performance credential."
5. Replace "staking/yield/buyback/burn" with "future token utility roadmap after review."
6. Replace "DAO governance" with "future reviewed governance framework."
7. Replace "AI-managed/autonomous" with "AI-assisted, human/provider-reviewed."
8. Replace "reputation as collateral" with "reputation as underwriting data."
9. Replace "guarantee" with "structured records, evidence, and review gates."
10. Replace "Metallicus/XPR/WebAuth integration" claims with "candidate infrastructure path" unless written approval exists.

## Recommended Next File

Create `docs/whitepaper-v1-3-public-html-replacement-plan.md` with section-by-section replacement instructions before editing any public HTML.

## Stop Boundary

Do not edit `whitepaper.html` or `index.html` until:

- public replacement plan exists;
- archive/rollback plan exists;
- public-safe draft exists;
- founder approves public wording direction;
- publication gate moves beyond default NO-GO.
