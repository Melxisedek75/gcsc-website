# GCSC Whitepaper v1.3 Provider Handoff Packet Map

Status: internal provider handoff map only. This map does not approve provider outreach, legal conclusions, provider commitments, external account setup, live Supabase changes, real payments, real loans, escrow custody, stablecoin settlement, token collateral, FIO registration, wallet signatures, XPR signatures, public publication, or partnership claims.

## Purpose

This map defines API-neutral packet boundaries for future licensed partner review. It keeps SmartContractor and the v1.3 whitepaper aligned around Construction Trust Infrastructure first, while preserving a future regulated Web3 path only after founder, legal, provider, privacy, security, and technical review.

## Packet Map

| Packet | Provider Category | GCSC Allowed Inputs | Provider Decision Owner | Current Status |
|---|---|---|---|---|
| Escrow-ready milestone packet | licensed escrow provider, bank, custodian, construction escrow counsel | project ID, milestone ID, scope, amount, evidence references, dispute state, request ID, draft release condition | escrow provider and legal reviewer | LOCAL_PACKET_SPEC_ONLY / PENDING_PROVIDER_REVIEW / BLOCKED_NO_OUTREACH / BLOCKED_LIVE_ACTIONS |
| Working-capital readiness packet | licensed lender, embedded finance provider, finance counsel | contractor profile reference, project contract reference, milestone plan, repayment context, rating context, dispute history, request ID | licensed lender/provider and finance counsel | LOCAL_PACKET_SPEC_ONLY / PENDING_PROVIDER_REVIEW / BLOCKED_NO_OUTREACH / BLOCKED_LIVE_ACTIONS |
| KYC/KYB/AML verification packet | KYC/KYB/AML provider, fraud provider, privacy counsel | profile ID, business ID, license reference, insurance reference, consent status, review status, request ID | KYC/KYB/AML provider and privacy reviewer | LOCAL_PACKET_SPEC_ONLY / PENDING_PROVIDER_REVIEW / BLOCKED_NO_OUTREACH / BLOCKED_LIVE_ACTIONS |
| Payment processing/reconciliation packet | payment processor, bank rails provider, treasury operations reviewer | payment intent ID, project ID, milestone ID, provider status placeholder, reconciliation note, request ID | payment processor and finance operations owner | LOCAL_PACKET_SPEC_ONLY / PENDING_PROVIDER_REVIEW / BLOCKED_NO_OUTREACH / BLOCKED_LIVE_ACTIONS |
| Insurance/bonding context packet | licensed insurance broker, MGA, bonding provider, risk reviewer | contractor business reference, COI reference, project type, claim/dispute context, request ID | licensed broker/provider and insurance reviewer | LOCAL_PACKET_SPEC_ONLY / PENDING_PROVIDER_REVIEW / BLOCKED_NO_OUTREACH / BLOCKED_LIVE_ACTIONS |
| Valuation/appraisal context packet | appraisal provider, valuation data provider, appraisal counsel | property context reference, project scope, before/after evidence references, appraisal reference, request ID | appraisal/valuation provider and legal reviewer | LOCAL_PACKET_SPEC_ONLY / PENDING_PROVIDER_REVIEW / BLOCKED_NO_OUTREACH / BLOCKED_LIVE_ACTIONS |
| Web3 audit proof packet | smart-contract security reviewer, Web3 compliance reviewer, technical reviewer | non-value record hash, timestamp, signer role reference, chain/testnet reference, request ID | security, legal, and technical reviewers | LOCAL_PACKET_SPEC_ONLY / PENDING_PROVIDER_REVIEW / BLOCKED_NO_OUTREACH / BLOCKED_LIVE_ACTIONS |
| FIO UX review packet | FIO Protocol technical reviewer, Web3 UX reviewer, legal reviewer | future handle/request UX description, routing context, non-payment demo flow, request ID | founder, legal reviewer, and FIO/UX technical reviewer | LOCAL_PACKET_SPEC_ONLY / PENDING_PROVIDER_REVIEW / BLOCKED_NO_OUTREACH / BLOCKED_LIVE_ACTIONS |
| XPR/WebAuth/Metallicus technical review packet | XPR/WebAuth/Metal/Metallicus technical reviewer, security reviewer, legal reviewer | testnet/local architecture reference, non-value contract record path, wallet UX boundary, request ID | founder, security, legal, and technical reviewers | LOCAL_PACKET_SPEC_ONLY / PENDING_PROVIDER_REVIEW / BLOCKED_NO_OUTREACH / BLOCKED_LIVE_ACTIONS |

## Data Minimization Rules

- Include only project IDs, request IDs, internal record IDs, status fields, consent status, evidence references, non-value hashes, and packet scope.
- Do not include secrets, private keys, seed phrases, API keys, database credentials, payment credentials, raw bank data, SSNs, raw KYC documents, unredacted identity documents, or unredacted sensitive evidence.
- Do not send private homeowner, contractor, lender, insurer, reviewer, provider, or regulator data outside the local repo until legal/provider privacy review defines the minimum required payload.
- Use redacted references first; attach original evidence only after founder-controlled redaction review and provider/legal privacy scope.

## Required Before Any Send

Before any packet can leave local-only status:

1. Founder selects the recipient category and purpose.
2. Redaction review is completed.
3. Legal/provider packet scope is defined.
4. Data minimization is confirmed.
5. Founder send decision is recorded.
6. Recipient channel and response intake target are recorded.
7. No autonomous outreach occurs; provider or reviewer contact remains founder-controlled. The required packet state is no autonomous outreach until the founder records a separate send decision.

## Blocked Decisions

GCSC cannot make, imply, record, or claim these decisions from this map:

- loan approval, denial, funding, servicing, adverse action, or repayment collection;
- escrow custody, escrow release, refund, chargeback, settlement, or fund movement;
- payment processing approval, card charge, ACH movement, XPR transfer, stablecoin settlement, or treasury movement;
- KYC/KYB/AML approval, compliance pass, fraud pass, or provider verification badge;
- insurance coverage, bonding approval, claim approval, or broker decision;
- appraisal, valuation conclusion, future value increase, or collateral amount;
- legal conclusion, tax conclusion, securities conclusion, lending conclusion, money-transmission conclusion, insurance conclusion, appraisal conclusion, or contractor-licensing conclusion;
- FIO registration, live FIO payment request, wallet signature, XPR signature, token collateral, minting, staking, bridge, swap, or transfer;
- provider partnership, endorsement, integration approval, production release, or public publication.

## Cross References

- `docs/whitepaper-v1-3-provider-question-register.md`
- `docs/whitepaper-v1-3-provider-question-status-matrix.md`
- `docs/whitepaper-v1-3-provider-response-intake-template.md`
- `docs/whitepaper-v1-3-legal-provider-review-packet.md`
- `docs/whitepaper-v1-3-reviewer-packet-send-readiness-checklist.md`
- `docs/whitepaper-v1-3-reviewer-question-mapping-matrix.md`
- `docs/whitepaper-v1-3-smartcontractor-product-integration-map.md`
- `docs/whitepaper-v1-3-regulated-web3-architecture-map.md`
- `docs/whitepaper-v1-3-publication-evidence-current-status.md`

## Stop Boundary

Do not use this map to contact providers, send packets, upload documents, create accounts, make legal/provider decisions, claim provider responses, activate production integrations, replace public files, publish a PDF, release SmartContractor, move money, approve loans, hold escrow, settle stablecoins, lock token collateral, register FIO names, sign XPR actions, connect live wallets, or claim partnership approval.
