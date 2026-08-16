# GCSC Metallicus, XPR, Metal, And WebAuth Integration Brief

Date: 2026-07-02 PT

Status: internal research and architecture brief. This document does not claim a GCSC partnership, endorsement, approval, integration, account setup, lending commitment, escrow relationship, stablecoin approval, or live production use.

Boundary summary: GCSC does not claim partnership, approval, integration, or live production use with Metallicus, XPR, Metal, or WebAuth. Everything below describes a candidate infrastructure path only. Do not claim Metallicus approval without written permission.

## Safe Technical Path

The Safe Technical Path is research, documentation, and local prototypes only: no external accounts, no live rails, no provider commitments until founder, legal, and provider review approve each step.

## Executive Conclusion

The Metallicus ecosystem is currently the closest publicly documented infrastructure match for the future regulated Web3 layer described in GCSC Whitepaper v1.3.

It may eventually provide or connect:

- XPR-native smart contracts and token records;
- EVM-compatible smart contracts and institution-specific subnets;
- WebAuth wallet and transaction signing;
- digital identity and KYC/AML controls;
- bank and credit-union connectivity;
- FedNow, ACH, card, and digital-wallet payment rails;
- institution-issued stablecoin pilots;
- custody, fiat connectivity, lending, and digital-asset APIs;
- bank-core integration through publicly announced Metallicus partners.

This is a strong technical and strategic fit, but it is not a complete GCSC operating stack. Public Metallicus materials do not establish a construction escrow provider, contractor-license verification provider, construction inspection network, lien-waiver system, appraisal provider, construction insurer, or dispute-resolution provider for GCSC.

The recommended strategy is therefore:

```text
XPR Network for GCSC application contracts and canonical token records
+ Metallicus and Metal infrastructure for future bank connectivity
+ a licensed credit-union or bank lender
+ a separate licensed construction escrow and payment-control provider
+ separate construction compliance, appraisal, insurance, and dispute partners
```

## Current GCSC Relationship Status

| Organization or network | Verified current relationship | Not established |
|---|---|---|
| XPR Network | GCSC contract code and testnet direction use XPR tooling and proton-tsc | Production approval, mainnet value flow, or official XPR endorsement |
| WebAuth | Candidate wallet and signing layer; local/testnet integration work exists | Required production wallet flow or value-bearing approval |
| Metal Blockchain | Architecture and institutional-infrastructure research candidate | GCSC subnet, production deployment, or written partnership |
| Metallicus | Preferred ecosystem research candidate in Whitepaper v1.3 | Written partnership, provider agreement, or permission to claim endorsement |
| Metallicus financial institutions | Publicly disclosed members of Metallicus programs may be future candidates | Any institution has agreed to lend to, bank, custody for, or service GCSC |

GCSC must continue to use the terms `candidate`, `research-only`, `future reviewed integration`, or `proposed pilot` until written agreements exist.

## Blockchain And Product Layer Map

| Component | Candidate GCSC role | Current readiness | Main boundary |
|---|---|---|---|
| XPR Network | Canonical GCSC token, project registry, milestones, audit hashes, settlement references | Existing direction; local/testnet only | No production value flow before audit and approval |
| WebAuth | Optional wallet, identity link, and signing UX | Research/testnet | WebAuth does not replace legal KYC/KYB or consumer disclosures |
| Metal Blockchain A-Chain | XPR/Antelope execution inside the Metal architecture | Architecture candidate | Do not assume automatic production migration or portability |
| Metal Blockchain C-Chain | Solidity/EVM contracts and institutional integrations | Research only | Separate contracts, security model, deployment, and audit required |
| Metal Subnets / TDBN | Institution-specific or permissioned blockchain environment | Future-only | Validator, governance, cost, data, and regulatory obligations |
| Metal Pay Enterprise API | Fiat and digital-asset API, custody, transaction processing, KYC/AML | Candidate provider | Product eligibility, jurisdiction, pricing, and contract required |
| Metallicus Identity / MemberPass | On-chain and biometric identity | Candidate identity layer | Contractor KYB, state-license verification, and consent still required |
| FedNow integration | Instant send, receive, liquidity, and request-for-payment flows | Public Metallicus capability | Access must come through an eligible financial institution |
| Metal Dollar / XMD | Stable-value settlement research candidate | Future provider-reviewed path | Legal treatment, issuer status, reserves, custody, and redemption review |
| Institution-issued stablecoin | Bank or credit-union settlement token | Sandbox and pilot evidence exists in the ecosystem | No GCSC issuer role or live settlement approval |
| Metal X / LOAN Protocol | DeFi and lending research context | Reference-only | Not a substitute for licensed construction or consumer lending |

Metal Blockchain documentation describes four primary chains: XPR Network/A-Chain for Antelope and TypeScript contracts, C-Chain for EVM and Solidity, P-Chain for validators and subnets, and X-Chain for digital assets. This creates a technically compatible path for GCSC, but cross-chain token movement and bank-subnet access still require explicit integration design and approval.

## Publicly Disclosed Metallicus Infrastructure Partners

The following list includes the publicly disclosed partners most relevant to GCSC. It is not represented as a complete list of every private or program relationship.

| Partner or program | Publicly described capability | Potential GCSC relevance | Current GCSC status |
|---|---|---|---|
| DaLand CUSO | Coin2Core bank-core bridge, institution stablecoins, custody, settlement, tokenized lending and payment products | Strong candidate bridge between GCSC records and a regulated financial institution | Research-only |
| Payfinia | Instant-payment infrastructure for U.S. credit unions | Bank-to-project payment requests and settlement | Research-only |
| Fiserv integration | Card and ACH processing capabilities | Fiat funding and payout rails | Research-only |
| InvestiFi | Bank-core and digital-banking integrations with custodial partners | Stablecoin-to-USD conversion and institution-facing token access | Research-only |
| Velera Digital Asset Lab | Credit-union digital-asset evaluation environment | Institutional distribution and pilot access | Research-only |
| CrossState Credit Union Association | Innovation Program 2.0 with an initial cohort of 50 credit unions | Large regulated pilot network in New Jersey and Pennsylvania | Research-only |
| GoWest Solutions | Credit-union access to blockchain innovation programs | Western U.S. institutional introductions and pilots | Research-only |
| MD/DC Credit Union Association | Program access for member credit unions | Institutional education and future pilot access | Research-only |
| Cornerstone League | Stablecoin innovation access for credit unions | Additional institutional pilot channel | Research-only |
| Bonifii / MemberPass | Biometric identity technology acquired by Metallicus | Member and signer authentication | Research-only |
| Metallicus Stablecoin Pilot | Simulated institution-branded stablecoins without real funds or custody | Safe model for a future no-real-money GCSC settlement pilot | Research-only |

Metallicus states that its broader platform supports stablecoins, custody, wallets, fiat connectivity, payments, lending, swaps, compliance controls, and blockchain rails. These are platform capabilities, not proof that every capability is generally available to GCSC or licensed for every GCSC use case.

## Publicly Named Financial Institutions In The Ecosystem

Public Metallicus announcements identify or reference financial institutions including:

- Gesa Credit Union;
- GreenState Credit Union;
- TDECU;
- Vibrant Credit Union;
- Empower Federal Credit Union;
- KeyPoint Credit Union;
- Bay Federal Credit Union;
- Excite Credit Union;
- FAIRWINDS Credit Union;
- Meritrust Credit Union;
- Mocse Credit Union;
- Arizona Financial Credit Union;
- One Nevada Credit Union;
- St. Cloud Financial Credit Union;
- additional institutions participating through CrossState and other credit-union associations.

Enrollment in an innovation or stablecoin program does not establish that an institution offers GCSC-compatible underwriting, construction loans, contractor working capital, escrow custody, nationwide coverage, API access, or sponsor-bank services.

## Best Initial Lending Candidate: Gesa Credit Union

Gesa is the strongest publicly identifiable first research candidate for a Washington-focused GCSC pilot because:

- it is headquartered in Washington and is federally insured by NCUA;
- it publicly reports approximately USD 6.7 billion in assets and more than 320,000 members;
- it is a publicly announced Metal Blockchain Banking Innovation Program participant;
- it offers business lines of credit starting at USD 10,000;
- it offers commercial real-estate and construction financing;
- it offers Home Equity Loans and HELOC products for renovation and other purposes;
- its property coverage includes Washington, Oregon, and Idaho for the cited home-equity products;
- it combines relevant lending products, local decision-making, and direct exposure to the Metallicus ecosystem.

Potential GCSC pilot fit:

| GCSC need | Possible Gesa product context | Required confirmation |
|---|---|---|
| Homeowner renovation funding | Home Equity Loan or HELOC | Eligibility, disclosures, project controls, API/referral model |
| Contractor working capital | Business line of credit | Contractor eligibility, underwriting, guarantees, repayment structure |
| New construction | Construction and commercial real-estate products | Residential/small-business scope and milestone draw controls |
| Bank settlement | Credit-union account and payment rails | FedNow/ACH/API availability through Metallicus stack |
| Blockchain pilot | Existing Metal Blockchain program participation | Gesa interest, compliance ownership, sandbox scope, and written approval |

Gesa has not publicly committed to GCSC. It must be described only as a high-fit research and outreach candidate.

## GCSC Functional Coverage Assessment

| Required capability | Metallicus ecosystem coverage | Assessment |
|---|---|---|
| Smart contracts and token records | XPR Network plus Metal C-Chain/subnets | Strong technical fit |
| Wallet and signing | WebAuth | Strong technical fit |
| Digital identity | Metallicus Identity and MemberPass | Strong candidate, diligence required |
| KYC/AML and transaction monitoring | Metallicus platform claims integrated coverage | Strong candidate, scope and KYB depth must be confirmed |
| Fiat connectivity | FedNow, ACH/card, Payfinia, Fiserv, bank-core integrations | Strong candidate |
| Stablecoin sandbox | Metallicus pilot and institution-issued token model | Strong research fit |
| Custody | Metallicus Enterprise and DaLand descriptions include custody | Candidate; legal entity and service terms required |
| General lending infrastructure | Metallicus stack, Metal X, LOAN context, and credit-union network | Partial fit; not construction underwriting approval |
| Washington lending candidate | Gesa products and Metal program participation | High-fit research candidate |
| Construction escrow | No confirmed dedicated provider found in reviewed public ecosystem materials | Critical external gap |
| Contractor license verification | No confirmed construction-specific provider found | External gap |
| Milestone inspection | No confirmed construction inspection network found | External gap |
| Lien waivers and title controls | No confirmed construction-specific integration found | External gap |
| Property appraisal and value-change evidence | No confirmed GCSC-ready provider found | External gap |
| Construction insurance | No confirmed insurer or MGA fit established | External gap |
| Mediation and arbitration | No confirmed construction dispute provider found | External gap |
| E-sign and project contracts | No dedicated fit established through Metallicus | External provider still required |

Estimated fit: Metallicus can plausibly cover approximately 60-70% of the future financial and Web3 infrastructure categories, subject to contracts and legal diligence. It does not replace the construction-specific regulated and operational partners.

## Recommended GCSC Architecture

```text
Homeowner and Contractor
        |
        v
SmartContractor product and evidence layer
        |
        +--> KYC/KYB, contractor license, insurance, appraisal
        |
        +--> Licensed lender or credit union
        |
        +--> Licensed construction escrow or bank-controlled account
        |
        +--> XPR contracts: project, milestone, evidence hash, dispute hold
        |
        +--> Metallicus/DaLand/TDBN: bank-core and digital-settlement adapter
        |
        +--> FedNow/ACH/stablecoin: provider-controlled settlement
```

### Canonical Token Rule

GCSC should initially maintain one canonical GCSC token record on XPR Network. It should not issue independent copies across XPR, Metal C-Chain, and private subnets without a formally audited bridge or issuer-controlled mint/burn model.

An XPR token does not automatically become available on an EVM chain, bank subnet, or credit-union platform. Every wrapped or bridged representation introduces custody, supply-integrity, smart-contract, sanctions, and recovery risks.

### Stablecoin Rule

GCSC should not initially issue GCST as an independently managed U.S. payment stablecoin. The lower-risk path is:

1. use fiat in a regulated bank or escrow account;
2. evaluate a permitted third-party stablecoin such as USDC where approved;
3. evaluate XMD only after issuer, reserve, custody, redemption, and legal review;
4. evaluate an institution-issued stablecoin through a participating bank or credit union;
5. keep GCSC as a utility, access, governance, or evidence-layer token only if legal review supports the exact design and distribution.

## Proposed Pilot Sequence

### Stage 0: Current Local Work

- keep XPR contracts on local/testnet paths;
- complete security, authority, dispute-hold, and repayment-waterfall tests;
- keep all public partnership and live-finance claims blocked;
- prepare a no-secret architecture and provider question packet.

### Stage 1: Metallicus Architecture Review

Subject to founder approval for outreach, request a technical and business-development review covering:

- XPR/A-Chain roadmap and production support;
- TDBN and permissioned-subnet access;
- Metal Pay Enterprise API eligibility;
- KYC/KYB, custody, and transaction-monitoring scope;
- FedNow and bank-core access model;
- DaLand integration path;
- institution-issued stablecoin sandbox eligibility;
- credit-union introduction process;
- pricing, contractual obligations, security, and support.

### Stage 2: Washington Lending Research

Subject to founder and legal approval for outreach, evaluate Gesa or another Washington lender for:

- homeowner renovation financing;
- contractor business working capital;
- construction draw and milestone controls;
- referral, embedded-finance, or data-package integration;
- adverse-action and consumer-compliance ownership;
- no-custody GCSC operating model;
- sandbox participation with Metallicus.

### Stage 3: Separate Escrow Procurement

Select a licensed construction escrow, bank-controlled account, or comparable regulated payment-control provider. Do not treat a wallet, stablecoin contract, multisig contract, or Metallicus payment rail as a legal substitute for escrow.

### Stage 4: No-Real-Money Sandbox

Test fake or provider-issued sandbox balances with:

- project creation;
- milestone evidence;
- lender decision references;
- simulated funding confirmation;
- dispute hold;
- simulated repayment waterfall;
- provider receipt and on-chain audit hash;
- manual rollback and reconciliation.

### Stage 5: Limited Regulated Pilot

Only after legal, lender, escrow, security, provider, and founder approvals:

- one state;
- one lender;
- one escrow/payment-control provider;
- one approved settlement rail;
- capped project and transaction amounts;
- manual review and emergency pause;
- no public investment-token claims;
- no autonomous AI credit, release, liquidation, or dispute decisions.

## Questions That Must Be Answered Before Outreach Becomes Integration

1. Is Metallicus willing to support a construction-finance workflow rather than only a financial-institution product?
2. Which legal entity contracts with GCSC for identity, custody, payments, and digital-asset services?
3. Can a fintech such as GCSC enter the program directly, or must access come through a credit union or CUSO?
4. Which APIs, sandboxes, SLAs, security reports, and pricing are currently available?
5. Can XPR smart contracts receive institution-stablecoin events without an unaudited bridge?
6. Which party performs KYC, business KYB, sanctions screening, wallet screening, and ongoing monitoring?
7. Which party owns loan underwriting, disclosures, adverse action, servicing, collections, and complaints?
8. Can Gesa or another institution support contractor lines, homeowner renovation financing, and milestone-controlled disbursement?
9. Which licensed provider holds funds and executes construction escrow or payment-control obligations?
10. What data may be recorded on-chain, and what must remain encrypted off-chain?

## Non-Negotiable Public Wording Boundaries

Do not publish any of these statements without written evidence:

- `GCSC is partnered with Metallicus.`
- `Metallicus approved GCSC.`
- `Gesa will finance GCSC projects.`
- `GCSC stablecoin is bank-backed.`
- `GCSC provides licensed escrow.`
- `GCSC tokens automatically work across all Metal networks.`
- `Metal X or LOAN Protocol provides approved contractor loans.`

Allowed internal wording:

- `Metallicus is a high-fit infrastructure research candidate.`
- `Gesa is a high-fit Washington lending research candidate.`
- `GCSC is evaluating a partner-first regulated architecture.`
- `All live lending, escrow, custody, settlement, and token functions remain subject to written approvals.`

## Blocked Until Founder/Legal/Provider Approval

The following decision gates remain mandatory before any external, value-bearing, or public action.

- founder approval before external outreach;
- legal review before lending, escrow, stablecoin, token, custody, or public claims;
- written provider approval before integration claims;
- security audit before value-bearing contract deployment;
- data-protection review before identity or financial-data exchange;
- one-state pilot scope before expansion;
- documented rollback and incident-response owners;
- separate approval for any public whitepaper or website change.

## Primary Sources Reviewed

- Metallicus full-stack digital-dollar infrastructure, 2026-06-23: https://www.metallicus.com/blog/metallicus-reinforces-its-full-stack-digital-dollar-infrastructure-for-banks-and-credit-unions
- Metallicus 2026 Q1 report: https://www.metallicus.com/blog/metallicus---2026-q1-report
- CrossState and Metallicus 50-credit-union pilot: https://www.metallicus.com/blog/crossstate-metallicus-launch-pilot-program-with-50-credit-unions
- Metallicus and DaLand partnership: https://www.metallicus.com/blog/metallicus-partners-with-daland-cuso
- Payfinia and Metallicus partnership: https://www.metallicus.com/blog/payfinia
- InvestiFi and Metallicus alliance: https://www.metallicus.com/blog/metallicus-investifi-stablecoin-alliance
- Metallicus FedNow Request for Payment certification: https://www.metallicus.com/blog/metallicus-expands-fednow-service-capabilities-with-request-for-payment-rfp-certification
- Metallicus Enterprise API: https://www.metallicus.com/crypto-banking-api
- Metallicus Identity: https://identity.metallicus.com/
- Metallicus Stablecoin Pilot: https://www.metallicus.com/stablecoin-pilot
- Metal Dollar: https://www.metallicus.com/metal-dollar
- Metal Blockchain architecture: https://docs.metalblockchain.org/intro
- Metal Blockchain subnets: https://docs.metalblockchain.org/subnets
- XPR Network developer documentation: https://docs.xprnetwork.org/
- Gesa participation in Metal Blockchain program: https://www.metallicus.com/banking-innovation-program-members-press-releases/gesa-credit-union-blockchain
- Gesa institutional profile: https://www.gesa.com/fact-sheets/who-we-are/
- Gesa business lines of credit: https://www.gesa.com/contents/business-term-loans-and-lines/
- Gesa Home Equity and HELOC products: https://www.gesa.com/contents/home-equity-loan/

## Closeout Status

```text
research_status: COMPLETE_AS_OF_2026_07_02
partnership_status: NOT_ESTABLISHED
provider_outreach_approved: no
live_integration_approved: no
real_lending_approved: no
real_escrow_approved: no
stablecoin_settlement_approved: no
token_bridge_approved: no
public_claim_approval: no
next_safe_step: founder review of a future no-secret outreach packet
```
