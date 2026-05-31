# GCSC Whitepaper v1.3 Integration Roadmap

Status: internal implementation roadmap. No provider is approved or integrated by this document.

## Phase 0: Local Strategy And Validators

Owner: Codex.

Allowed:

- local docs;
- validators;
- SmartContractor demo wording;
- no-real-money product surfaces.

Blocked:

- external accounts;
- real payments;
- real loans;
- real escrow;
- token collateral;
- FIO registrations;
- Metallicus/XPR live actions.

## Phase 1: Safe Product MVP

Goal: prove construction trust workflow without regulated financial activity.

Build:

- project requests;
- contractor profile records;
- bid records;
- project-contract records;
- milestone evidence;
- dispute packets;
- admin review;
- request IDs;
- no-real-money payment intent records.

Checks:

- `npm run check:smartcontractor`
- `npm run check:auth`
- `npm run check:beta-readiness`

## Phase 2: Part I Provider Research

Categories:

| Category | Candidate Type | Status |
|---|---|---|
| Escrow | Escrow.com, licensed construction escrow, bank/custodian partner | Research only |
| Payments | Stripe Connect, Modern Treasury, Dwolla, bank rails | Research only |
| KYB/KYC | Middesk, Persona, Sardine, Alloy, Sumsub | Research only |
| Lending | licensed lender, embedded finance partner, lender-direct | Research only |
| Insurance | licensed broker, MGA, Next/CoverWallet-style partners | Research only |
| Valuation | HouseCanary, Clear Capital, ATTOM, appraisal partners | Research only |
| Documents | DocuSign, Dropbox Sign, PandaDoc | Research only |
| Disputes | construction mediator, AAA/ADR, attorney network | Research only |

## Phase 3: Part II Web3 Research

Categories:

| Category | Candidate | Status |
|---|---|---|
| Smart contracts | XPR Network, proton-tsc | Local/testnet only |
| Wallet/signing | WebAuth Wallet | Research/testnet only |
| Web3 identity/payment requests | FIO Protocol | Research only |
| Digital asset infrastructure | Metal Blockchain, Metallicus ecosystem | Research only |
| DeFi context | Metal X, LOAN Protocol | Research only |
| Stable-value settlement | XMD, USDC via licensed partner | Legal/provider review required |
| AML/wallet risk | Chainalysis, TRM Labs, Elliptic | Research only |
| Custody | Fireblocks, BitGo, qualified custodian | Research only |

## Phase 4: Review Packets

Required before live integration:

- legal review packet;
- lending provider review packet;
- escrow provider review packet;
- payment/stablecoin provider review packet;
- securities counsel review packet;
- tax/accounting review packet;
- technical/security review packet;
- founder approval record.

## Phase 5: Controlled Pilot

Allowed only after recorded approval:

- limited no-real-money beta;
- then limited partner pilot;
- then limited live workflow with rollback;
- then expansion by state and provider.

## Never Skip

No live integration may bypass:

- written provider approval;
- legal classification;
- consumer disclosures;
- audit logging;
- rollback plan;
- support/escalation plan;
- founder approval.
