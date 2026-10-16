# GCSC Agents — Rules & Architecture

## Agent Execution Order
CA → REA → CMA → RAA → TA → MASTER

Always verify compliance (CA) before matching or releasing funds.

## Security Rules
| Action | Limit | Confirmation Required |
|--------|-------|-----------------------|
| Auto escrow release | < $50,000 | RAA score > 80 + homeowner approved |
| Large transaction | ≥ $50,000 | Human confirmation via Telegram |
| KYC bypass | NEVER | Prohibited |
| Seed phrase storage | NEVER | Prohibited |

## Agent Specs

### CMA — Contractor Matching
- Scoring: 30% rating + 25% experience + 20% response time + 15% completion + 10% price
- Minimum match score: 65/100
- Return top 3–5 matches max
- Cache results: 1 hour TTL

### RAA — Risk Assessment
- Auto-block if risk score > 80
- Alert if risk score > 60
- Monitor every 3600 seconds
- Factors: contractor (40%) + project (35%) + financial (25%)

### CA — Compliance
- KYC required for ALL users
- License check for 50 US states
- AML: OFAC, UN, EU, UK sanctions lists
- WebAuth identity verification

### TA — Treasury
- Milestone splits: 20% / 30% / 30% / 20%
- Dispute window: 48 hours after milestone
- DAO arbitration: 72-hour vote window
- Auto-release: amount < $50K AND RAA > 80 AND CA verified

### REA — Real Estate Oracle
- Sources: Zillow + ATTOM + Redfin
- Max LTV: 70%
- Collateral factor: 65%
- Valuation valid: 90 days
- Update trigger: >10% price change or renovation completed

## Memory Protocol
- Contractor scores: decay -0.02/day inactive
- Property valuations: expire after 90 days
- KYC status: expire after 365 days
- Project history: permanent

## Telegram Commands
```
/match [project description]  — Find contractors
/assess [project_id]          — Risk assessment
/value [address]              — Property valuation
/escrow [project_id]          — Escrow status
/release [project_id] [milestone] — Release payment
/status                       — Agent status
/help                         — All commands
```
