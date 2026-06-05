# GCSC Whitepaper v1.3 Licensed Partner Architecture Map

Status: internal architecture map. Research-only. No provider outreach, legal conclusion, provider commitment, external account setup, live API use, live Supabase change, real payment, real loan, escrow custody, stablecoin settlement, token collateral, FIO registration, XPR signature, public publication, or partnership claim is approved.

## Purpose

This map defines the Web2 and regulated-provider-first architecture for GCSC v1.3. It keeps SmartContractor positioned as Construction Trust Infrastructure that organizes project records, evidence, request IDs, and review packets while licensed partners control regulated actions.

## Architecture Principle

GCSC should integrate licensed partners before any value-bearing Web3 rail.

SmartContractor may prepare local records and API-neutral packet specs. Licensed partners, attorneys, payment providers, lenders, escrow providers, insurers, appraisers, KYC/KYB providers, and compliance reviewers must control regulated decisions after founder-approved review.

## Layer 0: Local Product Records

| Record | GCSC Role | Allowed Now | Blocked Now |
|---|---|---|---|
| Project intake | Capture homeowner request, scope, location context, and request ID | Local/demo record and review packet | Binding legal contract or public guarantee |
| Contractor profile | Store business profile, license reference, insurance reference, rating context, and request ID | Local readiness status | Live certification, eligibility approval, or real lead routing |
| Bid and project contract record | Organize bid terms, selected scope, milestone plan, and audit trail | Draft project contract record | Enforceable legal contract automation |
| Milestone evidence | Store progress evidence references, inspection notes, dispute state, and request ID | Escrow-ready milestone record | Escrow release, refund, chargeback, or payment movement |
| Working-capital readiness | Prepare contractor/project evidence for future review | Readiness packet only | Loan origination, approval, funding, servicing, collection, or adverse action |
| Payment intent | Record intended payment rail, amount context, reconciliation note, and no-live status | Demo-only payment record | Card charge, ACH transfer, XPR transfer, stablecoin settlement, or payout |
| Dispute packet | Organize evidence, roles, notes, and review status | Local dispute review packet | Legal liability decision or fund-release decision |

## Layer 1: Licensed Partner Services First

| Partner Category | Partner-Controlled Function | GCSC Allowed Function | Required Review Before Live Use |
|---|---|---|---|
| Licensed escrow provider | Fund custody, release, refund, dispute hold, and escrow terms | Provide milestone records and status references | Escrow provider review, legal review, state launch review, dispute rule review |
| Licensed lender or embedded finance provider | Underwriting, approval, decline, funding, servicing, disclosures, adverse action | Provide working-capital readiness packet | Lender agreement, finance counsel, disclosure review, adverse-action process |
| Payment processor or bank rails provider | Card, ACH, payout, reconciliation, chargeback, support, and rollback | Create payment intent and reconciliation records | Payment provider review, money-transmission analysis, support/rollback plan |
| KYC/KYB/AML and fraud provider | Identity, business, sanction, fraud, wallet-risk, and verification decisions | Store consent, status, evidence references, and request IDs | Privacy review, data minimization, user consent, vendor terms |
| Insurance or bonding provider | Coverage, bonding, quote, broker workflow, and claims process | Store COI reference, project risk context, and evidence references | Insurance/broker review, approved copy, state/broker review |
| Valuation or appraisal provider | Appraisal, valuation, data model, property estimate, and collateral review | Store property context and before/after evidence references | Appraisal/legal review, disclaimer review, lender review |
| Contractor licensing or compliance provider | License verification, compliance status, complaint checks, and renewal status | Store license references and review status | Provider review, contractor licensing counsel, public-copy review |
| Privacy and security reviewer | Data sharing scope, retention, redaction, vendor risk, and audit review | Provide data inventory and redacted packet examples | Privacy counsel, security review, vendor data processing terms |

## Packet Flow

1. SmartContractor creates a local product record with request ID.
2. Admin review marks the record as `LOCAL_RECORD_ONLY`.
3. Codex may prepare an API-neutral `PACKET_SPEC_READY` draft.
4. Founder reviews scope and recipient category.
5. Legal/provider/privacy review defines minimum data and blocked fields.
6. Founder records a separate send decision outside autonomous Codex.
7. Partner controls any regulated action and returns status through an approved channel.
8. SmartContractor stores status references only; it does not control funds, credit, escrow, insurance, appraisal, licensing, or compliance decisions.

## State Model

| State | Meaning | Allowed Transition |
|---|---|---|
| `LOCAL_RECORD_ONLY` | Internal SmartContractor record only | Codex may prepare local docs and validators |
| `PACKET_SPEC_READY` | API-neutral packet spec exists | Founder may review scope |
| `FOUNDER_REVIEW_REQUIRED` | Recipient category or scope needs founder choice | Founder action only |
| `LEGAL_PROVIDER_REVIEW_REQUIRED` | Legal/provider/privacy review must define rules | External reviewer action only |
| `BLOCKED_NO_OUTREACH` | No send decision exists | No provider contact |
| `BLOCKED_LIVE_ACTIONS` | Live regulated action remains disabled | No payment, loan, escrow, insurance, appraisal, KYC/KYB, or payout action |

## Data Minimization Boundary

Allowed local packet fields:

- project ID;
- profile ID;
- milestone ID;
- payment intent ID;
- dispute ID;
- request ID;
- status value;
- consent status;
- evidence reference;
- redaction status;
- no-live-action flag;
- reviewer category;
- owner and timestamp.

Blocked fields until review:

- passwords, API keys, private keys, seed phrases, service-role keys, database credentials, provider credentials, webhook secrets;
- SSN, raw identity documents, bank account data, card data, unredacted KYC/KYB documents, private customer evidence, private wallet data;
- legal conclusions, lending decisions, escrow decisions, payment settlement instructions, insurance coverage decisions, appraisal values, contractor licensing determinations.

## Provider API Boundary

GCSC may design local API-neutral packet shapes. It must not autonomously:

- call provider APIs;
- create provider accounts;
- request provider API keys;
- upload evidence to provider portals;
- send emails or packets to providers;
- record provider commitments;
- record legal clearance;
- move money;
- originate or service credit;
- hold escrow;
- settle stablecoins;
- lock token collateral;
- connect live wallets;
- sign XPR actions.

## Required Cross References

- `docs/whitepaper-v1-3-provider-question-register.md`
- `docs/whitepaper-v1-3-provider-handoff-packet-map.md`
- `docs/whitepaper-v1-3-legal-provider-review-packet.md`
- `docs/whitepaper-v1-3-smartcontractor-product-integration-map.md`
- `docs/whitepaper-v1-3-regulated-web3-architecture-map.md`
- `docs/whitepaper-v1-3-publication-evidence-current-status.md`

## Relationship To Future Web3 Rails

Licensed partner architecture comes first. Future Web3 rails may later support non-value audit proofs, identity UX, digital construction records, or provider-reviewed settlement paths only after founder, legal, provider, privacy, security, technical, and publication gates are complete.

This map does not approve FIO registration, XPR signatures, WebAuth wallet connection, Metal/Metallicus integration, stablecoin settlement, token collateral, DeFi lending, public Web3 finance claims, or provider partnership claims.

## Stop Boundary

Do not use this map to contact providers, create accounts, request credentials, send packets, upload documents, make legal/provider decisions, approve credit, hold escrow, release funds, move payments, settle stablecoins, lock token collateral, register FIO names, sign XPR actions, connect live wallets, replace public files, publish a PDF, deploy production, invite testers, or claim partnership approval.
