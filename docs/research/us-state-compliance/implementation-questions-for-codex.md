# Implementation Questions for Codex

## Document Information
- **Status:** DRAFT
- **Purpose:** Technical questions for the development team after compliance research
- **Last updated:** 2025-05-28
- **Research input:** US State-by-State Compliance Research for SmartContractor
- **Audience:** Engineering team (Codex), Product, Legal, Compliance
- **Document owner:** Compliance Research Team
- **Next review date:** 2025-06-11

---

## Introduction

This document captures every open technical question that the engineering team must answer before any compliance-related code can be written or deployed. It is organized by architectural layer—starting with the existing contract inventory, moving through new modules, off-chain vs on-chain decisions, frontend gates, backend APIs, testing, deployment blockers, and ending with known unknowns and risks.

Each question is tagged with:
- **Priority:** P0 (blocker), P1 (needed for MVP), P2 (enhancement)
- **Owner:** Team responsible (Engineering, Legal, Product, DevOps)
- **Status:** OPEN, IN-REVIEW, RESOLVED

All questions in this document start as **OPEN**.

---

## Section 1: Existing Contracts Assessment

### 1.1 Contract Inventory

| ID | Question | Priority | Owner | Status |
|----|----------|----------|-------|--------|
| C1 | What contracts currently exist in the SmartContractor ecosystem? | P0 | Engineering | OPEN |

#### Sub-questions for C1:

1.1.1 **gcscrow1111 (escrow contract)**
- What external functions does it expose?
- What is the ABI (Application Binary Interface)?
- What events does it emit?
- What state variables are stored?
- What is the deployed version and when was it last updated?
- Is there a deployed testnet version for integration testing?
- What is the maximum escrow value it has handled in production?
- Are there any known bugs or vulnerabilities?
- What is the contract's balance history and usage pattern?

1.1.2 **gcscstake111 (staking contract)**
- What staking functions are available (stake, unstake, claim)?
- What is the reward calculation formula?
- Are rewards auto-compounding or manual claim?
- What lock-up periods exist?
- What events are emitted for staking operations?
- Is there a slashing mechanism?
- What is the total value locked (TVL) historically?
- Are there emergency withdrawal functions?

1.1.3 **gcsctoken111 (token contract)**
- What token standard does it implement? (ERC-20, ERC-721, ERC-1155, native chain token)
- What is the total supply and distribution?
- Are there mint/burn functions?
- Is the token transferable without restrictions?
- What transfer hooks or tax mechanisms exist?
- Is there a pause function?
- What integrations does the token have (DEXs, bridges)?
- What is the token utility beyond governance?

1.1.4 **Other contracts**
- Is there an admin or governance contract?
- Is there a registry or factory contract?
- Is there an oracle integration contract?
- Are there any upgrade proxy contracts?
- Is there a timelock contract?
- Are there any vesting or distribution contracts?

---

### 1.2 Contract Architecture

| ID | Question | Priority | Owner | Status |
|----|----------|----------|-------|--------|
| C2 | What is the current contract architecture and upgrade pattern? | P0 | Engineering | OPEN |

#### Sub-questions for C2:

1.2.1 **Upgradeability**
- Are contracts deployed behind a proxy pattern (EIP-1967, EIP-1822, custom)?
- If upgradeable, who controls the upgrade (single admin, multi-sig, DAO)?
- What is the upgrade history (past upgrades and what changed)?
- Is there a timelock on upgrades?
- Can individual contracts be upgraded independently or is it an all-or-nothing bundle?
- Is there a shadow deployment or blue-green pattern for zero-downtime upgrades?

1.2.2 **Admin structure**
- What is the current admin key structure?
- Is there a multi-signature wallet (Gnosis Safe, etc.)?
- How many signers are required and who are they?
- Is there a DAO governance mechanism?
- What is the emergency pause capability and who can trigger it?
- Is there a circuit breaker pattern implemented?

1.2.3 **Audit events**
- What events are currently emitted for compliance-relevant actions?
- Is there a structured event schema or is it ad-hoc?
- Are events indexed for efficient querying?
- Is there an event monitoring system in place?
- What is the retention policy for event logs?

1.2.4 **Oracle integrations**
- What oracles are currently integrated (Chainlink, Band, custom)?
- What data feeds are used and how frequently are they updated?
- What is the oracle fallback mechanism if a feed fails?
- What is the maximum acceptable staleness for oracle data?
- Is there a decentralized oracle network or single source?

---

### 1.3 Data Storage Model

| ID | Question | Priority | Owner | Status |
|----|----------|----------|-------|--------|
| C3 | What data is currently stored on-chain vs off-chain? | P0 | Engineering | OPEN |

#### Sub-questions for C3:

1.3.1 **User profiles**
- What user data is stored on-chain (wallet address, role, reputation)?
- What user data is stored off-chain (name, email, KYC documents)?
- How is the on-chain/off-chain identity link maintained?
- Is there a privacy-preserving identity solution?
- What GDPR/CCPA implications exist for user data storage?

1.3.2 **Escrow data**
- What escrow metadata is on-chain (amount, parties, status)?
- What escrow metadata is off-chain (contract terms, SOW documents)?
- How are escrow disputes currently handled?
- What is the dispute resolution mechanism?
- How is escrow balance proven to third parties?

1.3.3 **Milestone data**
- How are milestones represented on-chain?
- What milestone status values exist?
- Who can approve milestone completion?
- Is milestone approval single-party or multi-party?
- What happens if a milestone is disputed?

1.3.4 **Transaction history**
- Is full transaction history stored on-chain or reconstructed from events?
- What indexing solution is used (The Graph, custom indexer)?
- What is the query latency for historical data?
- How far back does reliable history go?

---

### 1.4 Permission Model

| ID | Question | Priority | Owner | Status |
|----|----------|----------|-------|--------|
| C4 | What is the current permission model? | P0 | Engineering | OPEN |

#### Sub-questions for C4:

1.4.1 **Admin functions**
- What functions are restricted to admin?
- Is there a role-based access control (RBAC) system?
- What OpenZeppelin Access Control patterns are used (Ownable, AccessControl, etc.)?
- Can roles be granted/revoked dynamically?
- Is there a super-admin or root role that cannot be revoked?

1.4.2 **State rule enforcement**
- Are there any state-specific checks currently in the contracts?
- How are geographic restrictions currently enforced (if at all)?
- Is there an IP-based or KYC-based location verification?
- Can users bypass location checks with VPNs?
- What is the current approach to sanctions list screening (OFAC)?

---

## Section 2: New Modules Needed

### 2.1 State Compliance Service

| ID | Question | Priority | Owner | Status |
|----|----------|----------|-------|--------|
| M1 | How should the 50-state compliance matrix be stored and queried? | P0 | Engineering + Legal | OPEN |

#### Sub-questions for M1:

2.1.1 **Storage strategy**
- Should the full compliance matrix live on-chain, off-chain, or hybrid?
- What is the estimated gas cost for on-chain storage of all 50 states x 10 products?
- If off-chain, what database technology is appropriate (PostgreSQL, Redis, document store)?
- If hybrid, what goes on-chain and what stays off-chain?
- How is data integrity verified (Merkle proofs, signed attestations)?
- What is the backup and disaster recovery plan for compliance data?

2.1.2 **Update mechanism**
- How frequently do state laws change (estimated update cadence)?
- Who is authorized to update state rules (legal team, governance vote, oracle)?
- What is the review and approval workflow for rule changes?
- How are rule updates propagated to all running services?
- Is there a staged rollout for rule changes (preview → test → production)?
- How are rule changes audited and logged?

2.1.3 **Caching strategy**
- What caching layer should be used for state lookups (Redis, in-memory, CDN)?
- What is the cache invalidation strategy when rules change?
- What is the acceptable staleness for cached compliance data?
- How is cache coherence maintained across multiple service instances?
- What is the fallback if the cache is unavailable?

2.1.4 **Data schema**
- What is the canonical schema for a state compliance rule?
- How are rule dependencies represented (e.g., if A then B)?
- How are rule exceptions handled?
- What versioning system is used for rules?
- How are rule changes tracked historically?

---

### 2.2 ClaimBridge Module (gcscclaim111)

| ID | Question | Priority | Owner | Status |
|----|----------|----------|-------|--------|
| M2 | How should the ClaimBridge module be architected? | P0 | Engineering + Product | OPEN |

#### Sub-questions for M2:

2.2.1 **Contract structure**
- Should ClaimBridge be a standalone contract or integrated into gcscrow1111?
- If standalone, what is the interface between escrow and ClaimBridge?
- If integrated, what is the impact on existing escrow functionality?
- Can ClaimBridge be deployed incrementally or must it be bundled?
- What is the migration path for existing escrow data?

2.2.2 **Document storage**
- How should assignment documents be stored (IPFS, Arweave, hash on-chain + document off-chain)?
- What is the document retention requirement per state?
- How is document authenticity verified?
- What encryption is applied to sensitive documents?
- Who has decryption access?
- What is the cost comparison of IPFS vs Arweave for expected document volume?

2.2.3 **Insurance oracle**
- What insurance companies/oracle providers are potential partners?
- What API standard do they use (REST, GraphQL, webhook)?
- What authentication mechanism is required?
- What is the latency and reliability of claim status APIs?
- What is the fallback if the insurance oracle is unavailable?
- How is the oracle data validated before being recorded on-chain?

2.2.4 **Mortgagee/loss draft detection**
- How is mortgagee presence detected (document parsing, API lookup, user input)?
- What data sources identify if a property has a mortgage?
- How is loss draft payment (two-party check) handled?
- What happens if mortgagee disputes the claim assignment?
- How are force-placed insurance scenarios handled?

---

### 2.3 Token Collateral Credit Module (gcsccredit11)

| ID | Question | Priority | Owner | Status |
|----|----------|----------|-------|--------|
| M3 | How should the Token Collateral Credit module work? | P0 | Engineering + Product | OPEN |

#### Sub-questions for M3:

2.3.1 **Price oracle integration**
- Which price oracle should be used (Chainlink, Pyth, DIA, custom)?
- What token pairs need price feeds?
- What is the acceptable staleness for price data?
- What happens if the price feed is stale or unavailable?
- How is oracle manipulation prevented (TWAP, multi-source aggregation)?
- What is the price update frequency and who pays for it?

2.3.2 **LTV calculation**
- What is the formula for Loan-to-Value ratio calculation?
- What is the maximum LTV allowed (e.g., 50%, 70%)?
- How frequently is LTV recalculated?
- Is LTV calculated at origination only or monitored continuously?
- What buffer is required above liquidation threshold?
- How is collateral value denominated (USD stablecoin, native token, oracle price)?

2.3.3 **Liquidation mechanism**
- What triggers liquidation (price-based LTV breach, time-based expiry, both)?
- Who can initiate liquidation (anyone, keeper network, automated)?
- What is the liquidation penalty/bonus structure?
- What happens to liquidated collateral?
- Is there a grace period before liquidation?
- Can the borrower add collateral to avoid liquidation?
- What happens in a flash crash scenario (oracle vs market price divergence)?

2.3.4 **Staking rewards during collateral lock**
- Do staking rewards continue to accrue while tokens are locked as collateral?
- Can accrued rewards be claimed during the lock period?
- What happens to rewards if liquidation occurs?
- Are rewards redirected to the protocol or remain with the borrower?
- How is the reward rate affected by collateral lock?

---

### 2.4 Escrow-Backed Advance Module (gcscadvance1)

| ID | Question | Priority | Owner | Status |
|----|----------|----------|-------|--------|
| M4 | How should the Escrow-Backed Advance module work? | P0 | Engineering + Product | OPEN |

#### Sub-questions for M4:

2.4.1 **Escrow balance verification**
- How is the escrow balance verified (direct contract call, oracle, proof)?
- What prevents the escrow balance from being withdrawn after an advance is issued?
- Is there a lien or lock mechanism on the escrow?
- How is the escrow priority order established (advance repayment before release)?
- What happens if escrow balance decreases below advance amount?

2.4.2 **Milestone completion verification**
- Who approves milestone completion (contractor, client, third party, oracle)?
- What proof is required for milestone completion?
- Is there a multi-sig approval process?
- What happens if milestone completion is disputed?
- How is milestone verification latency minimized?

2.4.3 **Repayment waterfall**
- What is the repayment priority order (advance → escrow → contractor)?
- How are partial repayments handled?
- What interest or fee accrues on the advance?
- How is repayment schedule calculated?
- What happens if the advance cannot be repaid from escrow?
- Is there a repayment deadline or does it float with escrow milestones?

2.4.4 **Dispute and freeze**
- Who can initiate a freeze on the advance?
- What conditions trigger an automatic freeze?
- How long can an advance remain frozen?
- What is the unfreeze process?
- What happens to accrued interest during a freeze?
- How is the client/contractor notified of a freeze?

---

### 2.5 Contractor Verification Module

| ID | Question | Priority | Owner | Status |
|----|----------|----------|-------|--------|
| M5 | How should contractor license verification work? | P0 | Engineering + Legal | OPEN |

#### Sub-questions for M5:

2.5.1 **License data storage**
- Where is contractor license data stored (on-chain hash, off-chain DB, both)?
- What fields are stored (license number, state, type, expiration, status)?
- How is license data privacy maintained?
- What is the retention policy for expired licenses?
- How is license data updated?

2.5.2 **State licensing board integration**
- What APIs are available from state licensing boards?
- Are APIs standardized or custom per state?
- What authentication is required for API access?
- What is the API rate limit and cost?
- What is the fallback if a state's API is unavailable?
- Is there a commercial aggregator (e.g., BuildZoom, Angi) that provides unified API access?

2.5.3 **License refresh frequency**
- How often should license status be refreshed (real-time, daily, weekly)?
- What triggers an immediate refresh (user action, scheduled job, event)?
- What happens if a license expires between refreshes?
- How is the refresh process optimized to minimize API calls?
- What is the cost model for license verification at scale?

---

## Section 3: Off-Chain vs On-Chain Functions

### 3.1 Must Stay Off-Chain

| ID | Question | Priority | Owner | Status |
|----|----------|----------|-------|--------|
| O1 | What functions must stay off-chain and why? | P0 | Engineering | OPEN |

3.1.1 **State compliance rule lookups**
- Are state compliance rules too dynamic for on-chain storage?
- What is the cost of updating on-chain rules vs off-chain?
- Can a hybrid approach work (rule hash on-chain, full rules off-chain)?
- What is the latency requirement for rule lookups?
- How is the off-chain rule service secured against tampering?

3.1.2 **Contractor license verification**
- What API calls are required to verify a license?
- Can license verification be done on-chain via oracle?
- What is the latency of license verification APIs?
- How is API authentication handled securely?
- What is the fallback if the API is down?

3.1.3 **Insurance claim status**
- What insurance company APIs provide claim status?
- What authentication and legal agreements are needed?
- How frequently does claim status change?
- What is the latency requirement for claim status updates?
- How is claim status data validated?

3.1.4 **Legal approval workflow**
- What does the legal approval workflow look like (manual review, checklist, AI-assisted)?
- Who are the legal reviewers?
- What is the SLA for legal review?
- How is approval recorded and audited?
- What happens if legal review rejects a request?

3.1.5 **Price oracles**
- What is the current oracle architecture?
- Should price feeds remain off-chain with signed attestations?
- What is the trusted execution environment for oracle computations?
- How is oracle consensus achieved?

---

### 3.2 Can Safely Go On-Chain

| ID | Question | Priority | Owner | Status |
|----|----------|----------|-------|--------|
| O2 | What data and logic can safely go on-chain? | P0 | Engineering | OPEN |

3.2.1 **User state code**
- Should the user's state code be stored on-chain (in user profile or mapping)?
- Who sets the state code (user, KYC oracle, admin)?
- Can the state code be updated and by whom?
- What prevents a user from setting a false state code?
- What is the gas cost of storing state per user?
- How is state code privacy maintained?

3.2.2 **Product status flags**
- Should product availability per state be stored on-chain?
- What is the data structure for product flags (bitmap, mapping, struct)?
- Who can update product flags?
- How are product flags queried efficiently?
- What happens to in-flight transactions when a product flag changes?

3.2.3 **Audit events**
- What compliance-related events must be on-chain for immutability?
- What is the event schema for compliance actions?
- How are events indexed for efficient querying?
- What is the event retention and archival strategy?
- How are on-chain events correlated with off-chain audit logs?

3.2.4 **Consent signatures**
- Should consent signatures be stored as hashes on-chain?
- What consent types need recording (terms of service, state disclosures, product-specific)?
- How is consent revocation handled?
- What is the legal validity of on-chain consent?
- How are consent records correlated with off-chain legal documents?

3.2.5 **Collateral lock/unlock records**
- Should every collateral lock/unlock be recorded on-chain?
- What metadata accompanies a lock record (amount, timestamp, LTV, oracle price)?
- How are lock records queried for liquidation checks?
- What is the gas cost per lock/unlock operation?
- How are lock records archived or pruned?

---

### 3.3 Hybrid Functions

| ID | Question | Priority | Owner | Status |
|----|----------|----------|-------|--------|
| O3 | What functions require a hybrid on-chain/off-chain approach? | P0 | Engineering | OPEN |

3.3.1 **Eligibility checks**
- How should the hybrid eligibility check work (off-chain rule lookup → on-chain result storage)?
- What is the latency budget for a full eligibility check?
- How is the off-chain result authenticated for on-chain consumption?
- Can eligibility results be cached?
- What happens if the off-chain service is unavailable?

3.3.2 **Milestone completion**
- How is milestone completion verified off-chain and recorded on-chain?
- Who are the off-chain verifiers?
- What proof format is required?
- How is verification consensus achieved?
- What is the dispute window after on-chain recording?

3.3.3 **Legal approval**
- How does the human review off-chain → approval flag on-chain flow work?
- What is the legal review queue and SLA?
- How is the approval signed and submitted on-chain?
- Can legal approval be revoked?
- What happens if legal approval expires?

---

## Section 4: Frontend State Gates

### 4.1 Dashboard Requirements

| ID | Question | Priority | Owner | Status |
|----|----------|----------|-------|--------|
| F1 | How should state compliance be integrated into the user dashboard? | P0 | Product + Engineering | OPEN |

4.1.1 **State auto-detection**
- What methods are used for state detection (IP geolocation, browser location API, user input, KYC data)?
- What is the fallback priority if methods disagree?
- How accurate is IP geolocation for state-level detection?
- What happens if the user is using a VPN or proxy?
- Can the user manually override auto-detected state?
- Is KYC-based state detection the authoritative source?

4.1.2 **Undetermined state handling**
- What happens if state cannot be determined with reasonable confidence?
- Is access blocked or restricted?
- What messaging is shown to the user?
- Is there a manual verification workflow?
- How often is state re-evaluated?

4.1.3 **Blocked UI elements**
- How should blocked buttons be displayed (disabled, hidden, with tooltip/explanation)?
- What copy is shown explaining why an action is blocked?
- Is there a link to more information or support?
- How is the blocked state communicated to accessibility tools (screen readers)?
- What analytics are collected on blocked interactions?

4.1.4 **Disclosure display system**
- What types of disclosures need to be displayed (state-specific, product-specific, general legal)?
- When are disclosures shown (first visit, pre-transaction, post-login)?
- How are disclosures acknowledged (checkbox, signature, scroll-to-accept)?
- Where are disclosure acknowledgments stored (on-chain, off-chain)?
- How are disclosure versions tracked?
- What happens when a disclosure is updated?

4.1.5 **Attorney review banners**
- When are "Attorney review required" banners displayed?
- What is the visual design and prominence of these banners?
- What actions are blocked while attorney review is pending?
- How is the user notified when review is complete?
- What is the estimated review time communicated to users?

4.1.6 **Mobile experience**
- How are state-specific warnings displayed on mobile?
- Are banners dismissible or persistent?
- How is critical information prioritized on small screens?
- What is the tap target size for compliance-related actions?
- How are disclosures presented on mobile (modal, inline, separate screen)?

---

### 4.2 State-Specific UI Components

| ID | Question | Priority | Owner | Status |
|----|----------|----------|-------|--------|
| F2 | What reusable UI components are needed for state compliance? | P1 | Product + Engineering | OPEN |

4.2.1 **Eligibility wizard**
- What is the step-by-step flow of the eligibility wizard?
- How does the wizard adapt per state (dynamic questions, branching logic)?
- What states require additional verification steps?
- How is the wizard result communicated (inline, redirect, summary)?
- Can the wizard be exited and resumed?
- What analytics track wizard completion and abandonment?

4.2.2 **Disclosure viewer**
- What is the design of the disclosure viewer component?
- How is state-specific content loaded dynamically?
- What format is disclosure content in (Markdown, HTML, JSON)?
- How is disclosure content versioned and updated?
- Is there a search or filter capability for disclosures?
- How are long disclosures handled (pagination, scroll, collapse)?

4.2.3 **Warning banners**
- What are the different warning levels (info, warning, critical, blocked)?
- What states trigger each warning level?
- How are warning banners styled per level?
- Can users dismiss non-critical warnings?
- How often are warnings re-shown after dismissal?

4.2.4 **Blocked state messaging**
- What is the exact copy for "Blocked in your state" messaging?
- Is there a waitlist or notification feature for when the product becomes available?
- What alternatives are suggested for blocked users?
- How is the blocked state communicated empathetically?
- What is the escalation path for blocked users who believe it's an error?

4.2.5 **Legal approval progress indicators**
- What states does the legal approval progress indicator show (pending, in-review, approved, rejected)?
- How is progress communicated (stepper, percentage, estimated time)?
- What actions can the user take while waiting?
- How is rejection handled and communicated?
- Is there an appeal process?

---

## Section 5: Backend APIs Needed

### 5.1 API Endpoints

| ID | Question | Priority | Owner | Status |
|----|----------|----------|-------|--------|
| A1 | What API endpoints are needed for compliance? | P0 | Engineering | OPEN |

5.1.1 **Compliance endpoints**
- `GET /api/v1/compliance/state/{state_code}` - What is the response schema? What caching headers? What auth?
- `GET /api/v1/compliance/eligibility?user_state={state}&product={product}` - What is the eligibility scoring logic? What is the response time SLA?
- `POST /api/v1/compliance/attorney-review` - What is the request body? What is the queue mechanism? What notifications are sent?
- `GET /api/v1/compliance/disclosure/{state_code}/{product}` - What content format? What i18n support? What versioning?
- `GET /api/v1/compliance/states` - What filtering and pagination? What is the refresh cadence?

5.1.2 **Contractor endpoints**
- `GET /api/v1/contractor/verify/{license_number}/{state}` - What is the response schema? What is the verification SLA? What is the rate limit?
- `GET /api/v1/contractor/{contractor_id}/licenses` - How are multiple licenses handled? What is the validation status?
- `POST /api/v1/contractor/refresh-license` - Who can trigger this? What is the async pattern?

5.1.3 **Escrow endpoints**
- `GET /api/v1/escrow/balance/{escrow_id}` - What is the balance proof format? What is the staleness tolerance?
- `POST /api/v1/escrow/milestone/{milestone_id}/approve` - Who is authorized? What is the multi-sig flow?
- `GET /api/v1/escrow/{escrow_id}/milestones` - What is the milestone schema? What filtering?
- `POST /api/v1/escrow/{escrow_id}/dispute` - What is the dispute initiation flow? What evidence is required?

5.1.4 **Insurance endpoints**
- `GET /api/v1/insurance/claim-status/{claim_id}` - What is the claim status enum? What is the data source SLA?
- `POST /api/v1/insurance/claim-subscribe` - What is the webhook/async notification pattern?
- `GET /api/v1/insurance/claims?contractor={id}` - What filtering and pagination?

5.1.5 **Advance endpoints**
- `POST /api/v1/advance/request` - What is the request validation? What is the async processing flow?
- `GET /api/v1/advance/status/{advance_id}` - What status values exist? What is the polling vs push strategy?
- `POST /api/v1/advance/{advance_id}/repay` - What repayment methods? What is the confirmation flow?
- `POST /api/v1/advance/{advance_id}/dispute` - What dispute grounds? What is the freeze mechanism?

5.1.6 **General API concerns**
- What authentication mechanism (JWT, API key, wallet signature)?
- What rate limiting strategy (per user, per IP, per endpoint)?
- What is the API versioning strategy?
- What is the error response format (RFC 7807, custom)?
- What observability (logging, metrics, tracing) is required?
- What is the API documentation standard (OpenAPI, Postman, custom)?

---

### 5.2 Data Models

| ID | Question | Priority | Owner | Status |
|----|----------|----------|-------|--------|
| A2 | What data models are needed? | P0 | Engineering | OPEN |

5.2.1 **StateComplianceRule**
- Fields: `state_code`, `product`, `status`, `blocked_actions`, `disclosures`, `last_updated`, `updated_by`, `version`
- What is the full schema? What indexes? What constraints?
- How is the model versioned? How are migrations handled?

5.2.2 **ContractorLicense**
- Fields: `state`, `license_number`, `license_type`, `status`, `expiration_date`, `holder_name`, `verified_at`
- What additional fields are needed (bond amount, insurance, classification)?
- How is license history maintained?

5.2.3 **EscrowAccount**
- Fields: `id`, `balance`, `milestones`, `status`, `created_at`, `updated_at`
- What is the relationship to on-chain escrow contract?
- How is data consistency between on-chain and off-chain maintained?

5.2.4 **AdvanceRequest**
- Fields: `id`, `state`, `amount`, `status`, `legal_approval_status`, `requested_at`, `approved_at`
- What is the state machine for advance status?
- How is legal approval linked to the advance?

5.2.5 **AuditLog**
- Fields: `timestamp`, `actor`, `action`, `state`, `result`, `tx_hash`, `ip_address`, `user_agent`
- What is the retention policy? What is the query pattern? What compliance requirements apply?
- How is log integrity ensured (tamper-evident, WORM storage)?

5.2.6 **Additional models needed**
- UserConsent (user_id, consent_type, version, timestamp, signature)
- StateRuleChange (rule_id, old_value, new_value, changed_by, approved_by, effective_date)
- LegalReviewQueue (request_id, request_type, state, assigned_to, status, submitted_at, completed_at)
- OracleResponse (oracle_type, request_id, response_data, timestamp, latency_ms, status)

---

## Section 6: Testing Requirements

### 6.1 Unit Tests

| ID | Question | Priority | Owner | Status |
|----|----------|----------|-------|--------|
| T1 | What unit tests are needed? | P0 | Engineering + QA | OPEN |

6.1.1 **State gate logic**
- How should state gate logic be tested for all 50 states?
- What is the test matrix (state x product x user type)?
- How are edge cases handled (state changes, new states, territories)?
- What is the expected code coverage threshold?
- How are state rule changes tested without modifying production data?

6.1.2 **Eligibility calculation**
- What are the edge cases for eligibility calculation?
- How are boundary conditions tested (exact thresholds, just above/below)?
- What happens with invalid or missing input data?
- How are race conditions in eligibility checks handled?

6.1.3 **LTV calculation**
- What precision is required for LTV calculation?
- How are decimal/floating point issues handled?
- What test cases cover extreme market conditions?
- How is oracle price staleness factored into tests?

6.1.4 **Repayment waterfall**
- What test scenarios cover the repayment waterfall?
- How are partial repayments, overpayments, and underpayments tested?
- What happens with zero-balance edge cases?
- How is rounding handled in repayment distribution?

6.1.5 **Liquidation triggers**
- What are all the conditions that can trigger liquidation?
- How are trigger thresholds tested at boundary values?
- What is the grace period behavior in tests?
- How are flash crash scenarios simulated?

---

### 6.2 Integration Tests

| ID | Question | Priority | Owner | Status |
|----|----------|----------|-------|--------|
| T2 | What integration tests are needed? | P0 | Engineering + QA | OPEN |

6.2.1 **Oracle integration**
- How is price oracle integration tested (mock oracle, testnet, fork)?
- How is license verification API integration tested (mock server, sandbox)?
- How is escrow balance oracle tested?
- What happens when oracle returns invalid data?
- What happens when oracle is unreachable?

6.2.2 **Multi-sig flows**
- How are multi-sig admin flows tested?
- What scenarios cover different threshold configurations?
- How is a rejected signature tested?
- What happens if a signer loses their key?

6.2.3 **Emergency controls**
- How is emergency pause tested?
- How is unpause tested (who can unpause, timelock)?
- What is the recovery procedure after emergency activation?
- How is the circuit breaker pattern validated?

6.2.4 **Cross-module interactions**
- How do escrow, advance, and credit modules interact in tests?
- What is the happy path integration test?
- What failure cascades are tested?
- How is module isolation maintained during testing?

6.2.5 **State rule updates**
- How is the state rule update process tested end-to-end?
- What is the rollback procedure if an update causes issues?
- How is cache invalidation tested?
- How is the update audit trail verified?

---

### 6.3 End-to-End Tests

| ID | Question | Priority | Owner | Status |
|----|----------|----------|-------|--------|
| T3 | What end-to-end tests are needed? | P1 | Engineering + QA | OPEN |

6.3.1 **Token collateral flow (demo mode)**
- What is the full user journey for token collateral credit?
- How is demo mode different from production (test tokens, mock oracle)?
- What are the key user assertions (balance changes, events, UI state)?
- How long does the full flow take?

6.3.2 **Escrow-backed advance flow (demo mode)**
- What is the full user journey for escrow-backed advance?
- How are milestones created, funded, completed, and advanced against?
- What is the repayment verification?
- How is the advance status tracked in the UI?

6.3.3 **ClaimBridge flow (demo mode)**
- What is the full user journey for ClaimBridge?
- How is an insurance claim linked to the assignment?
- How is the mortgagee detected and handled?
- How is the claim status tracked end-to-end?

6.3.4 **State change mid-flow**
- What happens if a user's state changes mid-transaction?
- How is an in-progress advance handled if state rules change?
- What is the migration path for users moving between states?
- How are grandfathered transactions handled?

6.3.5 **Dispute and freeze handling**
- What is the full dispute lifecycle?
- How is the freeze communicated to all parties?
- What is the unfreeze and resolution flow?
- How is the UI updated during a freeze?

---

### 6.4 Security Tests

| ID | Question | Priority | Owner | Status |
|----|----------|----------|-------|--------|
| T4 | What security tests are needed? | P0 | Engineering + Security | OPEN |

6.4.1 **State gate bypass**
- How can state gate checks be bypassed (front-running, direct contract call, replay)?
- What penetration tests validate state gate enforcement?
- How is client-side validation supplemented by server-side and on-chain validation?
- What happens if a user changes state after passing a gate?

6.4.2 **Admin privilege escalation**
- What tests validate role-based access control?
- How is unauthorized admin action prevented?
- What is the blast radius if an admin key is compromised?
- How is the principle of least privilege enforced?

6.4.3 **Oracle manipulation**
- What tests validate oracle data integrity?
- How is a compromised oracle detected?
- What is the impact of stale or manipulated oracle data?
- How are multiple oracle sources used for cross-validation?

6.4.4 **Reentrancy and other attack vectors**
- Are there any reentrancy risks in the new modules?
- What other attack vectors apply (front-running, sandwich attacks, griefing)?
- How are these tested (fuzzing, symbolic execution, manual review)?
- What is the incident response plan if an attack is detected?

6.4.5 **Access control bypass**
- How is unauthorized function call prevented?
- What tests validate permission checks at every entry point?
- How are delegate call and proxy patterns secured?
- What is the upgrade authorization testing?

---

## Section 7: Live Deployment Blockers

### 7.1 Pre-Deployment Checklist

| ID | Question | Priority | Owner | Status |
|----|----------|----------|-------|--------|
| D1 | What must be resolved before any live deployment? | P0 | All | OPEN |

7.1.1 **Legal review**
- Has legal review been completed in ALL target states, not just some?
- What is the legal sign-off process?
- Are there any states with pending legal opinions?
- What is the process for updating legal review when laws change?

7.1.2 **Money transmitter license**
- Has money transmitter license (MTL) analysis been completed?
- Which states require MTL for SmartContractor's products?
- What is the application timeline and cost per state?
- Is there a legal opinion letter confirming MTL is not required in any state?

7.1.3 **Provider partnerships**
- Are escrow provider partnerships secured?
- Are insurance provider partnerships secured?
- Are lending/credit facility partnerships secured?
- What are the SLA and liability terms with each provider?
- What is the fallback if a provider terminates the partnership?

7.1.4 **Security audit**
- Has a third-party security audit been completed?
- What is the audit scope (contracts, backend, frontend, infrastructure)?
- What is the severity threshold for blocking deployment?
- Have all critical and high findings been remediated?
- Is there a plan for continuous security monitoring post-deployment?

7.1.5 **Penetration testing**
- Has penetration testing been completed?
- What was the scope (web app, APIs, contracts, infrastructure)?
- What vulnerabilities were found and what is the remediation status?
- Is there a retest scheduled?

7.1.6 **Insurance**
- Is insurance for custody/collateral arranged?
- What coverage limits exist?
- What exclusions apply?
- What is the claims process?

7.1.7 **Compliance monitoring**
- Is the compliance monitoring system operational?
- What alerts are configured for rule violations?
- Who receives alerts and what is the escalation process?
- What dashboards are available for real-time monitoring?

7.1.8 **Incident response**
- Is the incident response plan documented?
- Has the incident response team been trained?
- What is the communication plan for incidents?
- What is the rollback procedure?

7.1.9 **Regulatory registration**
- Is regulatory registration complete where required?
- What registrations are pending?
- What is the timeline for completing pending registrations?
- What are the ongoing compliance obligations post-registration?

7.1.10 **Legal documents**
- Have terms of service been reviewed by counsel?
- Has the privacy policy been reviewed by counsel?
- Are state-specific addendums included?
- Are disclosure documents complete and accurate?
- Have user consent flows been validated by legal?

---

### 7.2 State-by-State Rollout Plan

| ID | Question | Priority | Owner | Status |
|----|----------|----------|-------|--------|
| D2 | What is the state-by-state rollout plan? | P0 | Product + Legal + Engineering | OPEN |

7.2.1 **Tier 1 states (lowest risk)**
- Which states are classified as tier 1 (lowest compliance risk)?
- What criteria define tier 1 (clear regulations, no MTL needed, favorable legal opinion)?
- What is the deployment timeline for tier 1?
- What is the user acquisition strategy for tier 1 states?

7.2.2 **Tier 2 states (additional legal work)**
- Which states require additional legal work before deployment?
- What is the nature of the additional work (MTL application, product modification, partnership)?
- What is the estimated timeline for tier 2 states?
- What is the cost estimate for tier 2 preparation?

7.2.3 **Blocked states**
- Which states are blocked indefinitely?
- What is the criteria for indefinite blocking (hostile regulation, MTL required but uneconomical, legal risk too high)?
- Is there a process for revisiting blocked states?
- How are blocked states communicated to users?

7.2.4 **Rollout timeline**
- What is the overall timeline from first state to nationwide coverage?
- What are the key milestones and dependencies?
- What is the contingency plan for delays?
- How is rollout success measured?

---

## Section 8: Unknowns and Risks

### 8.1 Technical Unknowns

| ID | Question | Priority | Owner | Status |
|----|----------|----------|-------|--------|
| R1 | What technical unknowns exist? | P0 | Engineering | OPEN |

8.1.1 **Contract extension vs new deployment**
- Can existing contracts be extended with new functionality, or do new contracts need deployment?
- What is the gas cost of adding compliance checks to existing contracts?
- Is a contract migration required and what is the cost/risk?
- Can compliance logic be added via a proxy upgrade or does it require new storage layout?

8.1.2 **Gas cost estimates**
- What is the gas cost estimate for state gate checks on every relevant function call?
- How does the gas cost scale with number of states and products?
- What is the worst-case gas cost scenario?
- How can gas costs be optimized (batching, caching, offloading)?

8.1.3 **Immutable contract challenge**
- How will state rule updates work with immutable contracts?
- If rules are stored on-chain, how are they updated without contract redeployment?
- Is there an admin-controlled update mechanism and what are the trust assumptions?
- Can rules be structured as a linked list or Merkle tree for efficient updates?

8.1.4 **Oracle latency**
- What is the expected latency for each oracle type (price, license, escrow, insurance)?
- What is the maximum acceptable latency for user-facing operations?
- How is latency managed (async processing, loading states, polling)?
- What is the fallback when latency exceeds acceptable thresholds?

---

### 8.2 Legal Unknowns

| ID | Question | Priority | Owner | Status |
|----|----------|----------|-------|--------|
| R2 | What legal unknowns exist? | P0 | Legal | OPEN |

8.2.1 **Lender registration**
- Will any state require SmartContractor to register as a lender?
- What triggers lender registration (interest charged, credit extended, amount threshold)?
- What is the process and timeline for lender registration?
- What are the ongoing compliance obligations as a registered lender?

8.2.2 **Money transmitter license**
- Will any state require a money transmitter license?
- Does the token collateral product trigger MTL requirements?
- Does the escrow-backed advance trigger MTL requirements?
- What is the legal opinion on the Howey test and securities law applicability?

8.2.3 **Rule change monitoring**
- How will state rule changes be monitored?
- Is there a legal research service or internal monitoring team?
- What is the SLA for detecting and responding to rule changes?
- How are rule changes communicated to engineering?

8.2.4 **Liability exposure**
- What is the liability exposure for incorrect state gate decisions?
- What happens if a user in a blocked state accesses the product due to a bug?
- What is the legal protection if the user provided false state information?
- What insurance covers regulatory enforcement actions?

---

### 8.3 Business Unknowns

| ID | Question | Priority | Owner | Status |
|----|----------|----------|-------|--------|
| R3 | What business unknowns exist? | P1 | Product + Business | OPEN |

8.3.1 **Provider partnerships**
- What provider partnerships are needed and what is the status of each?
- What are the commercial terms (revenue share, flat fee, minimums)?
- What is the provider onboarding timeline?
- What is the competitive landscape for partnerships?

8.3.2 **Legal review cost**
- What is the cost of legal review per state?
- What is the total budget for nationwide legal review?
- Are there economies of scale or bulk pricing?
- What is the ongoing cost for legal monitoring and updates?

8.3.3 **Timeline to first live state**
- What is the realistic timeline to first live state?
- What are the critical path items?
- What are the risks that could delay launch?
- What is the minimum viable product for first state launch?

8.3.4 **Revenue model**
- What revenue model works within regulatory constraints?
- Are there revenue caps or restrictions in any state?
- How does the fee structure need to adapt per state?
- What is the unit economics per product per state?

---

## Appendix A: Cross-Reference to Compliance Research

| Research Finding | Related Questions | Impact |
|-----------------|-------------------|--------|
| Three-tier state classification (A/B/C) | M1, D2, F1 | Determines rollout order |
| gcscrow1111 escrow contract exists | C1, M2, M4 | Base for advance and ClaimBridge |
| Staking contract exists | C1, M3 | Base for token collateral |
| Money transmitter risk in 12 states | D1, R2 | May require MTL application |
| Attorney review required in 8 states | M5, F1, A1 | Adds legal queue dependency |
| ClaimBridge depends on insurance oracle | M2 | Requires provider partnership |
| Token collateral requires price oracle | M3 | Requires oracle selection |

---

## Appendix B: Decision Log

| Date | Decision | Rationale | Decision Maker |
|------|----------|-----------|----------------|
| 2025-05-28 | Document created | Compliance research complete, engineering questions needed | Research Team |
| | | | |
| | | | |

---

## Appendix C: Glossary

| Term | Definition |
|------|------------|
| **ClaimBridge** | Module for assigning insurance claim proceeds to contractors |
| **Escrow-Backed Advance** | Short-term funding backed by verified escrow balances |
| **LTV** | Loan-to-Value ratio, the ratio of loan amount to collateral value |
| **Merkle Proof** | Cryptographic proof that a piece of data is part of a larger dataset |
| **Money Transmitter License (MTL)** | State license required for businesses that transfer funds |
| **Oracle** | External data source that provides information to smart contracts |
| **Proxy Pattern** | Design pattern allowing smart contract upgrades without changing the contract address |
| **State Gate** | A check that enforces geographic compliance before allowing a transaction |
| **Token Collateral Credit** | Credit line secured by locked token collateral |
| **TWAP** | Time-Weighted Average Price, used to prevent oracle manipulation |

---

*End of Document*
