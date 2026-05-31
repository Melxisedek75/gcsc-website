# GCSC Whitepaper v1.3 Product Integration Placeholder Plan

Status: internal product placeholder plan. This does not approve provider integrations, external account setup, API keys, live Supabase changes, payments, loans, escrow, stablecoin settlement, token collateral, FIO registrations, or XPR signatures.

## Goal

Add product placeholders only where they help SmartContractor explain future integrations without pretending they are live.

## Placeholder Rules

Every placeholder must include:

- `future`;
- `provider-reviewed`;
- `not live`;
- `no real money`;
- `founder/legal/provider approval required`.

## Candidate Product Placeholders

| Area | Placeholder | Live Action Allowed |
|---|---|---|
| Escrow | "Escrow-ready milestone records for licensed partner review" | No |
| Lending | "Working-capital readiness packet for licensed lender review" | No |
| KYB/KYC | "Verification provider pending review" | No |
| Insurance | "Insurance/COI review placeholder" | No |
| Valuation | "Improvement-value context pending appraisal/provider review" | No |
| FIO | "Future optional FIO Handle field" | No |
| XPR/WebAuth | "Future optional wallet/audit hash path" | No |
| Metallicus/Metal | "Future infrastructure research candidate" | No |

## Files To Consider Later

- `construction-ai/public/smartcontractor.html`
- `construction-ai/scripts/validate-smartcontractor.mjs`
- `docs/smartcontractor-api.md`
- `docs/smartcontractor-product-map.md`
- `docs/smartcontractor-backend-to-chain-map.md`
- `docs/smartcontractor-public-beta-review-packet.md`

## Do Not Add Yet

- provider logos;
- partner claims;
- API key fields;
- live payment buttons;
- live FIO registration;
- live wallet signing;
- live escrow release;
- live loan submission;
- token collateral lock;
- stablecoin settlement.

## Acceptance Check

Any future product placeholder must pass:

- `npm run check:smartcontractor`;
- `npm run check:whitepaper-v1-3-plan`;
- founder/publication wording review if visible to external users.
