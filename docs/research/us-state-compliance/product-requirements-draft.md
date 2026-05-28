# SmartContractor Product Requirements Draft

## Document Information

| Field | Value |
|-------|-------|
| **Status** | DRAFT - MVP/Demo Planning Only |
| **Disclaimer** | Not legal advice. All features require licensed attorney review. |
| **Last Updated** | 2025-05-28 |
| **Research Base** | 50-state compliance analysis across all state files in `states/` directory |
| **Products Covered** | 5 (Token-Collateral Equipment Credit, ClaimBridge Emergency Advance, Escrow-Backed Contractor Advance, Contract-Backed Contractor Working Capital, State-Aware Dashboard and Contract Rules) |
| **Authorized Use** | Internal MVP/demo planning and technical architecture only |

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Cross-Cutting Requirements](#cross-cutting-requirements)
3. [Product 1: Token-Collateral Equipment Credit](#product-1-token-collateral-equipment-credit)
4. [Product 2: ClaimBridge Emergency Advance](#product-2-claimbridge-emergency-advance)
5. [Product 3: Escrow-Backed Contractor Advance](#product-3-escrow-backed-contractor-advance)
6. [Product 4: Contract-Backed Contractor Working Capital](#product-4-contract-backed-contractor-working-capital)
7. [Product 5: State-Aware Dashboard and Contract Rules](#product-5-state-aware-dashboard-and-contract-rules)
8. [50-State Compliance Matrix Summary](#50-state-compliance-matrix-summary)
9. [Appendix](#appendix)

---

## Executive Summary

SmartContractor is planning 4 future financial products for the construction and insurance restoration ecosystem, plus a foundational state-aware compliance dashboard. All products are in research/MVP/demo phase only. No real-money production deployment is authorized without passing all legal, provider, security, and audit gates documented herein.

### Products Overview

| # | Product | Target User | Core Mechanism | Status |
|---|---------|-------------|---------------|--------|
| 1 | Token-Collateral Equipment Credit | Licensed contractors | GCSC token collateral for equipment financing | Research / MVP planning |
| 2 | ClaimBridge Emergency Advance | Homeowners post-insured-event | Advance against expected insurance claim payout | Research / MVP planning |
| 3 | Escrow-Backed Contractor Advance | Contractors + Homeowners | Advance against locked escrow funds | Research / MVP planning |
| 4 | Contract-Backed Contractor Working Capital | Licensed contractors | Advance against verified construction contract | Research / MVP planning |
| 5 | State-Aware Dashboard and Contract Rules | All users | Automatic regulatory adaptation per state | Research / MVP planning |

### Critical Global Constraint

**ALL live-money activity is BLOCKED in ALL 50 states until:**
1. State-by-state licensed attorney review is completed
2. Required state licenses are obtained (lending, money transmission, escrow, digital assets where applicable)
3. Provider partnerships are executed (licensed lenders, escrow agents, custodians)
4. Security audits of all smart contracts are completed
5. Insurance for collateral custody is arranged
6. State-specific disclosure language is drafted and approved by counsel

This document consolidates findings from 50 individual state compliance files into unified product requirements. Each state file contains detailed statutory analysis, regulator contacts, enforcement actions, and open questions for licensed attorneys. This document does NOT replace those state files — it synthesizes them into actionable product requirements.

### Key Cross-Cutting Findings from 50-State Research

**Token Collateral is the Most Universally Challenged Product.** Every state presents significant barriers to token-collateralized lending. Key findings include:
- **California**: DFAL (Digital Financial Assets Law) effective July 1, 2026 — requires license, $500K+ bond, $100K/day penalties for unlicensed activity. Salt Lending consent order ($300K+ penalties) establishes enforcement precedent.
- **New York**: BitLicense required — only ~30 issued since 2015. 23 NYCRR 200.9(c) prohibits using customer virtual currency as security, creating structural incompatibility with collateral lending model.
- **Texas**: Non-stablecoin crypto is NOT "money" under MSMA (favorable), but 10% constitutional usury ceiling and OCCC licensing requirements create barriers.
- **Florida**: HB 273 effective January 1, 2023 — custodial virtual currency intermediaries require money transmitter license.
- **Illinois**: DACPA (Digital Assets and Consumer Protection Act) signed August 2025 — registration required by July 1, 2027; 1:1 reserve and custody obligations apply.
- **Louisiana**: Virtual Currency Business Act (VCBA) requires comprehensive licensing through OFI.
- **Nevada**: NFID makes licensing determinations case-by-case; money transmission and/or trust company licensing likely required.
- **Wyoming**: Most crypto-friendly state but token-collateralized lending still requires legal review under consumer lending frameworks.

**ClaimBridge Faces AOB Barriers in Most Major Markets.** Assignment of Benefits restrictions vary dramatically:
- **Prohibited/Functionally Dead**: Florida (SB 2-A, 2022), Texas (HB 2103 + Stonewater Roofing v. TDI 2024), Louisiana (Act 364 of 2023)
- **Heavily Restricted**: California, Illinois (815 ILCS 513/18), Arizona (A.R.S. 20-1122 series), Georgia, North Carolina
- **Permitted with Safeguards**: Nevada (common law), Colorado (post-loss generally permitted), South Carolina, Indiana
- **Status Unknown/Requires Counsel**: New York, Oregon, Massachusetts, most northeastern states

**Escrow-Backed Advances Show the Most Viable Path.** Of all product concepts, escrow-backed advances against verified milestones with licensed escrow agents show the clearest regulatory pathway in the most states — but still require substantial licensing infrastructure:
- Licensed escrow agent required in nearly all states (California BRE, Texas TDSML, Florida DBPR, Nevada NRED, etc.)
- Consumer lending analysis required if advance is characterized as a loan
- UCC Article 9 perfection may be required for assignment of payment rights
- Smart contract should function as attestation/milestone-recording layer only; licensed escrow agent must execute actual disbursement

**Contractor Licensing Verification is Universally Required.** Every state requires some form of contractor licensing verification:
- **State-level license required**: California (CSLB), Florida (CILB/DBPR), Nevada (NSCB), Louisiana (LSBPE), Arizona (ROC), most states
- **Local/municipal only**: Texas (no state GC license), New York (NYC DCWP and other local authorities), Illinois (local level for general contractors)
- **Specialty trades state-licensed**: Electrical, plumbing, HVAC, roofing licensed at state level in most states regardless of general contractor rules

---

## Cross-Cutting Requirements

### Universal Backend Requirements (All Products)

| Requirement | Priority | Description |
|-------------|----------|-------------|
| 50-State Compliance Matrix API | P0 | Real-time API returning product eligibility, blocked actions, required disclosures, and license status for any state |
| Contractor License Verification | P0 | Integration with state contractor licensing boards (CSLB, CILB, NSCB, etc.) and municipal systems |
| Public Adjuster License Verification | P1 | Integration with state insurance departments for PA license verification where applicable |
| KYC/Identity Verification | P0 | Multi-tier identity verification for contractors and homeowners |
| Audit Logging Service | P0 | Immutable, tamper-evident logging of all eligibility checks, state gate evaluations, and transaction attempts |
| Legal Approval Status Oracle | P0 | On-chain/off-chain oracle tracking legal review status per state per product |
| Rate/Usury Limit Service | P1 | State-specific maximum rate calculation engine |
| Money Transmitter License Check | P1 | Verification of MT license status per state before any funds movement |

### Universal Frontend Requirements (All Products)

| Requirement | Priority | Description |
|-------------|----------|-------------|
| State Auto-Detection | P0 | Auto-detect user state via IP geolocation, address validation, and phone area code |
| State Selection Fallback | P0 | Manual state selection with clear jurisdiction warnings |
| Eligibility Wizard | P0 | Step-by-step wizard that checks state rules and displays product availability |
| Required Disclosure Display | P0 | Dynamic display of COUNSEL_APPROVED_TEXT_REQUIRED disclosures per state |
| "Attorney Review Required" Banners | P0 | Prominent banners on all demo interfaces indicating legal review status |
| Product Status Dashboard | P1 | Real-time display of which products are available/blocked/restricted in user's state |
| Demo Mode Indicator | P0 | Unmistakable visual indicator when operating in demo/simulation mode |
| Blocked Action Messaging | P1 | Clear user messaging when actions are blocked with reason and pathway |

### Universal Smart Contract Requirements (All Products)

| Requirement | Priority | Description |
|-------------|----------|-------------|
| State Gate Modifier | P0 | All state-sensitive functions must check state gate before execution |
| Admin Override with Multi-Sig | P0 | Emergency override capability requiring multi-signature + legal approval proof |
| Audit Event Emission | P0 | Every function call emits structured event for audit trail |
| Demo-Only Mode Flag | P0 | Global demo mode flag preventing any real-money transaction |
| Legal Approval Status Check | P0 | On-chain check of legal review oracle before sensitive operations |
| Borrower Consent Recording | P1 | On-chain recording of borrower consent to terms and disclosures |
| Pause/Unpause Mechanism | P0 | Circuit breaker pattern for emergency stops per state per product |
| Upgrade Proxy Pattern | P1 | Upgradeable proxy pattern for legal compliance updates |

---

## Product 1: Token-Collateral Equipment Credit

### Problem Solved

Contractors need working capital for equipment, tools, materials, and transportation. Traditional lending is slow, collateral-intensive, and often inaccessible to small and mid-sized contractors. SmartContractor enables contractors to stake GCSC tokens as collateral for limited credit, providing faster access to capital with blockchain-based transparency.

### User Flow

1. **Contractor Verification**: Contractor creates account and completes identity verification + contractor license verification
2. **State Eligibility Check**: System auto-detects state and runs 50-state compliance matrix check
3. **Product Selection**: Contractor selects equipment/purpose and desired advance amount
4. **Collateral Calculation**: SmartContractor calculates maximum advance based on:
   - Collateral value (token price * quantity)
   - State-specific LTV limits
   - State-specific usury/rate caps
   - Contractor verification status
   - Risk parameters
5. **Token Lock**: Contractor locks GCSC tokens in smart contract (testnet only for MVP)
6. **Advance Issuance**: Credit issued as demo/test tokens (no real money in MVP)
7. **Fund Usage**: Contractor uses funds for approved purpose (tracked in demo)
8. **Repayment**: Contractor repays according to generated schedule
9. **Collateral Release**: Upon full repayment, collateral is released from smart contract
10. **Liquidation (if default)**: Collateral liquidated according to state-specific rules and oracle price feeds

### Backend Requirements

#### State-Aware Eligibility Engine
- Query 50-state compliance matrix for token-collateral product status per state
- Return: `BLOCKED`, `DEMO_ONLY`, `LEGAL_REVIEW_REQUIRED`, or `CONDITIONAL`
- Check contractor license status via state board APIs
- Verify no outstanding sanctions, disciplinary actions, or license suspensions
- Calculate state-specific maximum LTV ratio
- Calculate state-specific maximum APR/finance charge
- Check money transmitter license requirements for token custody/transmission
- Check digital asset licensing requirements (DFAL, BitLicense, VCBA, DACPA, etc.)

#### Collateral Valuation and LTV Calculation
- Real-time token price oracle integration (multiple oracle sources for redundancy)
- LTV calculation: `ltv_ratio = advance_amount / (token_collateral_value * collateral_factor)`
- Maximum LTV thresholds vary by state and risk profile:
  - Conservative default: 50% maximum LTV
  - State-specific overrides where legally permissible
  - Volatility-adjusted LTV with haircuts for token price volatility
- Liquidation threshold: typically 75-85% LTV (state-specific)
- Margin call notification at intermediate threshold (typically 65% LTV)

#### Repayment Schedule Generation
- Standard amortization schedule generation
- State-specific maximum term limits
- State-specific payment frequency requirements
- Grace period calculation per state rules
- Late fee calculation respecting state usury limits
- Prepayment policy per state requirements

#### Liquidation Trigger Logic with State Gates
- Automated liquidation ONLY when ALL of the following are true:
  - LTV exceeds liquidation threshold
  - Oracle price has been stable for minimum confirmation period
  - State gate permits liquidation in borrower's state
  - Multi-sig admin approval has been obtained
  - Legal approval status oracle shows `APPROVED` for liquidation in state
- Liquidation execution via DEX integration or approved liquidation service
- Surplus return to borrower after debt repayment and liquidation fees

#### Contractor License Verification Integration
| State | License Board | API Available | Verification Fields |
|-------|--------------|---------------|---------------------|
| CA | CSLB | Yes | License number, classification, bond status, workers' comp, suspension status |
| FL | DBPR/CILB | Yes | License number, type (certified/registered), county, complaint history |
| TX | TDLR (trades only) | Yes | License type, expiration, continuing education status |
| NY | NYC DCWP / Local | Limited | License number, expiration (varies by municipality) |
| NV | NSCB | Yes | License class, monetary limit, workers' comp, bond status |
| IL | IDFPR (roofing) / Local | Partial | License type, expiration |
| AZ | ROC | Yes | License number, classification, complaint history |
| LA | LSBPE | Yes | License classification, monetary limit, status |
| CO | DORA / Local | Partial | Status varies by municipality |

#### Audit Log for All Actions
- Every eligibility check with input parameters and result
- Every collateral lock/unlock attempt with transaction hash
- Every state gate evaluation with rule version and outcome
- Every admin approval/denial with signers and timestamps
- All repayment events with amounts and remaining balance
- All liquidation events with price data and calculations
- All oracle price updates with source and timestamp

### Frontend Requirements

#### State Selection / Auto-Detection
- IP geolocation with VPN/proxy detection for initial state guess
- Address validation integration for confirmation
- Phone area code cross-check
- Manual override with explicit jurisdiction acknowledgment
- State flag display with regulatory status color coding

#### Eligibility Wizard with State-Specific Warnings
- Step 1: State selection and jurisdiction confirmation
- Step 2: Contractor license input and verification
- Step 3: Equipment/purpose selection
- Step 4: Desired amount input
- Step 5: Collateral calculation and LTV display
- Step 6: State-specific warnings and required disclosures
- Step 7: Demo mode acknowledgment
- Step 8: Summary and mock approval/denial

#### Collateral Lock Interface (BLOCKED for live until legal approval)
- Testnet-only token lock interface
- Prominent "DEMO MODE — TESTNET ONLY" banner
- Token amount selection with USD value display
- LTV ratio display with color coding
- Liquidation threshold display
- State-specific risk disclosure display
- Multi-step confirmation with acknowledgment checks
- BLOCKED overlay if state status is `BLOCKED` or `LEGAL_REVIEW_REQUIRED`

#### Repayment Dashboard
- Mock repayment schedule display
- Payment history (demo transactions)
- Current LTV ratio with trend
- Collateral value tracking
- Margin call warnings if applicable
- State-specific payment instructions

#### Liquidation Warnings
- Progressive warning system as LTV approaches thresholds
- State-specific liquidation procedure disclosures
- Time-to-liquidation estimates
- Options to add collateral or make payment
- Clear explanation of liquidation process and consequences

#### Required Disclosure Display (COUNSEL_APPROVED_TEXT_REQUIRED)
- Digital asset risk disclosure (all states)
- State-specific lending license disclosure
- Collateral volatility risk
- Liquidation risk and procedure
- Not FDIC insured disclosure
- State-specific usury/compliance disclosure
- Military lending act disclosure where applicable

### Smart Contract Requirements (NOT CODE — requirements only)

#### Token Lock/Unlock Mechanism with Admin Guardrails
- `lockCollateral()` function: Locks specified token amount, records state code, records borrower consent hash
- `unlockCollateral()` function: Releases collateral only when repayment verified and state gate passes
- `addCollateral()` function: Allows borrower to add collateral to improve LTV
- Admin guardrail: All collateral operations require `LEGAL_APPROVED` status for state
- Emergency release: Multi-sig admin can release collateral in emergency with legal approval proof

#### LTV Threshold Checks
- `checkLTV()` function: Returns current LTV ratio based on oracle price
- `isMarginCall()` function: Returns true if LTV > margin_call_threshold
- `isLiquidatable()` function: Returns true if LTV > liquidation_threshold AND all state gates pass
- Threshold parameters: Configurable per state, per asset class
- Price staleness check: Reject liquidation if oracle price is stale

#### Liquidation Trigger with Multi-Sig Approval
- `initiateLiquidation()` function: Callable only when isLiquidatable() is true
- Requires multi-sig approval from designated guardians
- Requires legal approval oracle status = `APPROVED`
- Requires state gate evaluation = `PERMITTED`
- Emits detailed LiquidationInitiated event
- `executeLiquidation()` function: Swaps collateral via approved DEX, repays debt, returns surplus

#### State-Specific Blocking Logic
```
state_gate_check(state_code, action_type):
  1. Look up state status in compliance matrix
  2. If status == BLOCKED: revert with BLOCKED_REASON
  3. If status == DEMO_ONLY: allow only if demo_mode == true
  4. If status == LEGAL_REVIEW_REQUIRED: revert with LEGAL_REVIEW_REQUIRED
  5. If status == CONDITIONAL: check all conditions
  6. If all conditions met: allow
  7. Emit StateGateEvaluated event
```

#### Audit Event Emission for All Actions
- `CollateralLocked(borrower, amount, token_type, state_code, ltv_ratio)`
- `CollateralUnlocked(borrower, amount, repayment_tx_hash)`
- `LiquidationInitiated(borrower, collateral_amount, debt_amount, ltv_ratio, oracle_price)`
- `LiquidationExecuted(borrower, collateral_sold, debt_repaid, surplus_returned)`
- `RepaymentReceived(borrower, amount, remaining_balance)`
- `StateGateEvaluated(state_code, action_type, result, rule_version)`
- `MarginCallTriggered(borrower, current_ltv, threshold)`

#### Borrower Consent Recording
- `recordConsent(borrower, disclosure_hash, timestamp)` function
- Stores hash of all disclosures shown to borrower
- Requires explicit acknowledgment before collateral lock
- Emits `ConsentRecorded` event
- Used for regulatory compliance evidence

### Oracle/Off-Chain Requirements

#### Token Price Feed
- Multiple redundant oracle sources (Chainlink, Band Protocol, etc.)
- Price staleness detection and circuit breaker
- Volatility-adjusted pricing with TWAP (Time-Weighted Average Price)
- Manipulation detection with deviation thresholds
- State-specific oracle requirements (some states may require specific price verification methods)

#### Contractor License Verification Oracle
- Real-time API integrations with state licensing boards
- Cached results with periodic refresh
- Expiration date tracking with automatic alerts
- Disciplinary action monitoring
- Multi-state license aggregation for contractors licensed in multiple states

#### State Rule Lookup Service
- 50-state compliance matrix as queryable service
- Version-controlled rule sets with update tracking
- A/B testing support for rule changes
- Legislative change monitoring with automatic alerts
- Integration with state legislative tracking services

#### Legal Approval Status Oracle
- On-chain oracle tracking legal review status per state per product
- Updated only by authorized legal team multi-sig
- Immutable history of status changes
- Integration with off-chain legal workflow management

### Escrow/Provider Requirements

#### Token Custody Mechanism
- Non-custodial model preferred: smart contract holds tokens, not platform
- Multi-sig option for enhanced security
- State-specific custody requirements (DFAL, BitLicense, VCBA compliance)
- Cold storage integration for institutional-grade security
- Insurance coverage for custody risk

#### Collateral Insurance (if applicable)
- Smart contract risk insurance
- Custody insurance for held assets
- Oracle failure coverage
- State-specific insurance requirements

#### Liquidation Execution Service
- Integration with DEX aggregators for best-price execution
- Slippage protection and maximum impact limits
- Time-delayed execution for large liquidations
- MEV (Miner Extractable Value) protection
- State-specific execution requirements

### Audit Log Requirements

| Event Category | Events to Log | Retention |
|----------------|--------------|-----------|
| Eligibility | All eligibility checks with inputs/outputs | 7 years |
| Collateral | All lock/unlock/liquidation attempts | 7 years |
| State Gates | All state gate evaluations with rule version | 7 years |
| Admin | All approval/denial actions with signers | 7 years |
| Repayment | All payment events with amounts/dates | 7 years |
| Oracle | All price updates with source/timestamp | 7 years |
| Consent | All disclosure consents with hash/timestamp | 7 years |
| Access | All system access attempts | 3 years |

### Blocked-Live Gates

| Gate | Requirement | Status |
|------|-------------|--------|
| `legal_approval` | Licensed attorney review completed for state | BLOCKED in all states |
| `provider_approval` | Licensed lending partner confirmed for state | BLOCKED in all states |
| `security_audit` | Smart contract security audit completed | BLOCKED |
| `state_specific_counsel_review` | State-qualified counsel issued written opinion | BLOCKED in all states |
| `token_collateral_legal_review` | Specific legal review of token collateral mechanism | BLOCKED |
| `MT_license_check` | Money transmitter license verified if required | BLOCKED in MT-requiring states |
| `court_order_or_contractual_trigger` | Liquidation only with proper trigger | BLOCKED |
| `legal_review_liquidation` | Liquidation procedure reviewed by counsel | BLOCKED |
| `repayment_routing_insurance` | No repayment routing from insurance proceeds | BLOCKED |

### Legal Review Gates

| Review Type | Scope | Estimated Timeline |
|-------------|-------|-------------------|
| State-by-state licensed attorney review | All 50 states + DC | 12-18 months |
| Money transmitter license analysis | All 50 states | 6-12 months |
| Securities law analysis | Federal + all states | 6-9 months |
| Usury/compliance analysis | All 50 states | 3-6 months |
| Consumer protection review | All 50 states | 3-6 months |
| Digital asset licensing analysis | States with specific regimes (CA, NY, FL, IL, LA, etc.) | 6-12 months |

### MVP/Demo-Only Scope

| Feature | MVP Scope | Notes |
|---------|-----------|-------|
| Eligibility Wizard | Mock wizard with state-specific warnings | Demo data only |
| Collateral Lock | Testnet-only token lock | No real value at risk |
| Repayment Schedule | Simulated schedule display | No real payments |
| State-Aware Dashboard | Full dashboard with warnings | Shows hypothetical status |
| Audit Records | Hash-only reference records | No PII in demo |
| LTV Calculator | Working calculator with demo prices | Educational purpose |
| Disclosure Display | Template disclosures with COUNSEL_APPROVED_TEXT_REQUIRED | Placeholder text |

### Real-Money Launch Blockers

| Blocker | Description | Mitigation |
|---------|-------------|------------|
| Legal review in all target states | Each target state requires licensed counsel opinion | Budget $50K-$150K per state for legal review |
| Money transmitter licenses | Required in most states for token custody/transmission | Apply through NMLS; 6-18 month timeline |
| Digital asset licenses | CA DFAL, NY BitLicense, LA VCBA, etc. | State-specific applications; significant capital requirements |
| Provider partnerships | Licensed lenders, escrow agents, custodians | Negotiate partnership agreements |
| Security audit | Full audit of all smart contracts | Engage top-tier audit firm; 3-6 months |
| Insurance | Collateral custody insurance, smart contract insurance | Negotiate with specialty insurers |
| State lending licenses | Consumer/commercial lending licenses where required | NMLS application where applicable |

---

## Product 2: ClaimBridge Emergency Advance

### Problem Solved

Homeowners face immediate expenses after insured events (fire, flood, storm, hail, roof damage, smoke damage, mold, tree damage) but insurance claims take weeks or months to process. Living expenses, emergency repairs, and contractor deposits must be paid before claim proceeds arrive. ClaimBridge provides a fast emergency advance against expected claim payout to bridge this gap.

### User Flow

1. **Event Reporting**: Homeowner reports insured event through ClaimBridge interface
2. **Policy Documentation**: Homeowner uploads insurance policy info and claim documentation
3. **Damage Assessment**: Homeowner selects damage types (fire, water, flood, storm, roof, smoke, mold, tree)
4. **State Eligibility Check**: System checks state rules for claim advance products
5. **Advance Calculation**: SmartContractor calculates expected advance based on:
   - Policy coverage limits
   - Damage type and estimated severity
   - State-specific advance rules (some states mandate insurer advances)
   - Mortgagee/loss draft status
   - Public adjuster involvement
   - State AOB/assignment rules
6. **Disclosure and Consent**: Homeowner signs required state-specific disclosures
7. **Assignment (where permitted)**: Homeowner signs assignment of claim proceeds where state law permits
8. **Advance Issuance**: Advance issued as demo/test tokens only for MVP
9. **Repayment**: Repayment comes from insurance claim proceeds (BLOCKED until legal review)
10. **Shortfall Handling**: Any shortfall between advance and claim payout is homeowner's responsibility

### Backend Requirements

#### State-Aware AOB/Assignment Eligibility
- Query 50-state compliance matrix for AOB/assignment rules
- Return: `PERMITTED`, `PROHIBITED`, `RESTRICTED`, `UNKNOWN_REQUIRES_COUNSEL`
- If PROHIBITED: Block all assignment features
- If RESTRICTED: Apply state-specific restrictions (disclosures, cancellation windows, fee caps, etc.)
- If PERMITTED: Enable assignment with standard safeguards
- If UNKNOWN: Block and display attorney review required message

#### Insurance Policy Parsing
- OCR and structured data extraction from insurance policy documents
- Coverage limit identification (dwelling, other structures, personal property, ALE)
- Deductible amount extraction
- Policy date validation (issue date vs. loss date for grandfathered policies)
- Mortgagee identification for loss draft detection
- Anti-assignment clause detection

#### Damage Assessment Integration
- Structured damage type classification (fire, water, flood, storm, roof, smoke, mold, tree)
- Severity estimation based on homeowner input and photo analysis
- Estimated repair cost calculation using industry pricing data
- Coverage applicability analysis (is damage type covered by policy?)

#### Claim Payout Estimation
- Policy coverage minus deductible = maximum claim estimate
- State-specific advance rules (e.g., California mandates 4-month ALE + 30% contents for declared disasters)
- Mortgagee priority deduction
- Depreciation/ACV vs. RCV analysis
- realistic advance limit: typically 10-25% of estimated claim

#### Mortgagee/Loss Draft Detection
- Mortgagee name and address extraction from policy
- Loss draft probability calculation based on claim amount and mortgage status
- Mortgage servicer communication protocol (where legally permitted)
- Endorsement requirement detection

#### Public Adjuster Interaction Firewall
- PA license verification if PA is involved
- Firewall preventing GCSC from any claim negotiation activity
- Clear role definition: GCSC provides financing only, not claim services
- State-specific PA fee cap verification
- Dual-role prohibition check (PA cannot be contractor on same claim in many states)

#### Audit Logging
- All advance applications with state gate results
- All policy parsing results (metadata only, no PII)
- All state AOB eligibility determinations
- All assignment document records (hashes)
- All repayment events
- All default events

### Frontend Requirements

#### Event Type Selection
- Visual selection interface for damage types:
  - Fire
  - Water damage
  - Flood
  - Storm/hail/wind
  - Roof damage
  - Smoke damage
  - Mold
  - Tree/impact damage
  - Other (with text input)
- Severity assessment for each type
- Photo upload for documentation

#### Policy Upload and Parsing
- Secure document upload with encryption
- Progress indicator for parsing
- Extracted data display for homeowner verification
- Coverage summary visualization
- Missing information identification

#### State-Specific AOB Disclosure Display
- Dynamic disclosure based on state AOB status:
  - **Prohibited states**: Clear prohibition notice with statutory citation
  - **Restricted states**: Full restriction details with compliance requirements
  - **Permitted states**: Standard AOB disclosure with rights explanation
  - **Unknown states**: Attorney review required notice

#### "Attorney Review Required" Banners
- Persistent banner on all ClaimBridge demo interfaces
- State-specific attorney contact recommendations
- Expected timeline for legal review
- Option to receive notification when review complete

#### Advance Calculator (Demo)
- Policy coverage input
- Deductible input
- Damage estimate input
- State-specific advance limit calculation
- Visualization of advance amount vs. estimated claim
- Clear labeling as "Demo Calculator — Not a Binding Offer"

#### Repayment Tracking
- Mock repayment schedule
- Claim status tracking (informational only, not claim negotiation)
- Repayment source visualization
- Shortfall scenario display
- State-specific repayment term disclosures

### Smart Contract Requirements (NOT CODE — requirements only)

#### Advance Recording with State Gate
- `recordAdvance()` function: Records advance amount, state code, borrower, collateral (if any)
- State gate check: Only permitted if state status != BLOCKED
- Legal approval check: Only permitted if legal oracle shows APPROVED
- Emits `AdvanceRecorded` event with all parameters

#### Assignment of Claim Proceeds (State-Specific)
- `recordAssignment()` function: Records assignment of claim proceeds where permitted
- Checks state AOB status before allowing
- Records assignment document hash
- Emits `AssignmentRecorded` event
- Blocked in PROHIBITED states

#### Repayment Trigger from Claim Proceeds
- `recordRepayment()` function: Records repayment from claim proceeds
- Only callable when claim proceeds received
- Validates repayment amount against outstanding balance
- Emits `RepaymentRecorded` event
- BLOCKED until legal review of repayment routing

#### Default Handling
- `recordDefault()` function: Records default event
- Triggers state-specific default procedures
- Calculates default amount and fees (respecting state limits)
- Emits `DefaultRecorded` event
- Triggers collection procedures per state requirements

#### Audit Events
- `AdvanceApplicationSubmitted(applicant, state_code, amount, timestamp)`
- `AdvanceRecorded(advance_id, borrower, amount, state_code)`
- `AssignmentRecorded(advance_id, assignment_hash, state_code)`
- `RepaymentRecorded(advance_id, amount, remaining_balance)`
- `DefaultRecorded(advance_id, default_amount, state_code)`
- `StateGateEvaluated(state_code, action_type, result, rule_version)`

### Oracle/Off-Chain Requirements

#### Insurance Claim Status Oracle
- Integration with insurance company claim status APIs (where available)
- Public adjuster status updates (if PA involved and consents)
- Claim payment tracking
- State-specific claim timing requirements
- NOTE: GCSC does NOT negotiate claims — only tracks status for repayment purposes

#### State AOB Rule Lookup
- Real-time query of 50-state AOB compliance matrix
- Version-controlled rule tracking
- Legislative change monitoring
- Integration with legal workflow for rule updates

#### Legal Approval Status
- On-chain oracle for legal review status per state
- Updated only by authorized legal team
- Tracks which states are approved for claim advance products

#### Mortgagee/Loss Draft Check
- Property records integration for mortgage identification
- Loss draft probability calculation
- Mortgage servicer information lookup
- State-specific mortgagee rights display

### Escrow/Provider Requirements

#### Claim Proceeds Tracking
- Integration with payment tracking services
- ACH/wire transfer monitoring
- Check deposit tracking
- State-specific proceeds handling requirements

#### Mortgage Servicer Coordination
- Standard industry practice coordination (GCSC does NOT negotiate with servicers)
- Document provision for servicer requirements
- Milestone verification for draw releases
- State-specific servicer timing rules

#### Insurance Company Communication (Limited to Avoid PA Issues)
- GCSC does NOT communicate with insurance companies on homeowner's behalf
- Informational status checks only (where homeowner has provided authorization)
- No claim negotiation, no coverage interpretation, no dispute involvement
- Clear firewall preventing any PA-like activity

### Audit Log Requirements

| Event Category | Events to Log | Retention |
|----------------|--------------|-----------|
| Advance Applications | All applications with state, amount, damage type | 7 years |
| State Gate Decisions | All state gate evaluations with rule version | 7 years |
| Assignment Documents | Document hashes, state, timestamp | 7 years |
| Repayment Events | All repayment transactions | 7 years |
| Default Events | All default recordings with state-specific handling | 7 years |
| Policy Parsing | Parse results (metadata, no PII) | 7 years |
| Consent Records | Disclosure consent hashes | 7 years |

### Blocked-Live Gates

| Gate | Requirement | Status |
|------|-------------|--------|
| `legal_approval` | Legal review completed for claim advance product in state | BLOCKED all states |
| `state_counsel_review` | State-qualified counsel issued written opinion | BLOCKED all states |
| `AOB_legal_review_per_state` | AOB/assignment legality confirmed per state | BLOCKED in restrictive states |
| `repayment_routing_legal_review` | Repayment from insurance proceeds reviewed | BLOCKED |
| `PA_license` | Public adjuster license if any claim involvement | BLOCKED — GCSC will not be licensed PA |

### Legal Review Gates

| Review Type | Scope | Priority |
|-------------|-------|----------|
| AOB legality per state | Whether assignment of claim proceeds is permitted | CRITICAL |
| Public adjuster restrictions | States where GCSC activity may constitute unlicensed PA practice | CRITICAL |
| Assignment of claim proceeds rules | Enforceability and priority of assignment | HIGH |
| Consumer lending characterization | Whether claim advance constitutes consumer loan | CRITICAL |
| Mortgagee rights | Priority of mortgagee over claim advance repayment | HIGH |
| Unfair claims practices compliance | Whether product implicates unfair claims practices | HIGH |
| Insurance premium financing | Whether product resembles regulated premium financing | MEDIUM |

### MVP/Demo-Only Scope

| Feature | MVP Scope | Notes |
|---------|-----------|-------|
| Advance Calculator | Mock calculator with demo data | Shows hypothetical advance amount |
| Claim Workflow | Simulated claim workflow | Step-by-step demo without real claim |
| State Disclosure Display | Template disclosures per state | COUNSEL_APPROVED_TEXT_REQUIRED |
| Assignment Templates | Template documents (COUNSEL_APPROVED) | Draft only, not for execution |
| Educational Content | Claims process education | General information, not advice |
| Damage Assessment | Mock damage assessment tool | Demo scoring only |

### Real-Money Launch Blockers

| Blocker | Description | Mitigation |
|---------|-------------|------------|
| State-by-state AOB analysis | Confirm AOB permitted in target states | Legal review in each state |
| Public adjuster compliance | Ensure product design avoids PA licensing | Product design review by insurance counsel |
| Consumer lending license analysis | Determine if advance = loan requiring license | Structure as non-loan where possible |
| Mortgage servicer partnerships | Coordinate loss draft handling | Partnership agreements with major servicers |
| Insurance company coordination | Claim status integration | API integrations where available |
| Claim advance legality | Some states only permit insurers to issue advances | Confirm third-party advances permitted |

---

## Product 3: Escrow-Backed Contractor Advance

### Problem Solved

Contractors need working capital to start work, but homeowners want work completed before making full payment. An escrow-backed advance lets contractors access limited funds against locked escrow while protecting homeowners through milestone-based disbursement. This creates trust and enables projects to begin without either party taking excessive risk.

### User Flow

1. **Contract Execution**: Homeowner and contractor enter construction contract
2. **Escrow Funding**: Homeowner deposits funds into escrow account with licensed escrow agent
3. **Escrow Confirmation**: Escrow agent confirms funds are locked
4. **Advance Calculation**: SmartContractor calculates maximum advance:
   - Rule: `max_advance = min(20% * escrow_balance, 50% * next_milestone_value, risk_limit)`
   - State-specific advance limit rules applied
   - Usury/compliance analysis performed
5. **Disclosure and Consent**: Contractor signs state-specific disclosures and consent
6. **Advance Issuance**: Advance issued against escrow (demo only for MVP)
7. **Milestone Completion**: As milestones complete, inspection/verification triggers repayment
8. **Repayment Waterfall**: From approved milestone releases:
   - First: Repay outstanding advance
   - Second: Release remaining milestone funds to contractor
9. **Advance Repaid**: After advance fully repaid, remaining escrow releases normally
10. **Dispute Handling**: Any dispute freezes disbursement until resolution

### Backend Requirements

#### Escrow Balance Integration
- Integration with licensed escrow agent systems
- Real-time (or near-real-time) escrow balance queries
- Funding confirmation workflow
- Multi-currency support if applicable
- State-specific escrow agent licensing verification

#### Milestone Tracking
- Milestone definition and agreement workflow
- Milestone completion verification integration
- Inspector/verifier assignment and scheduling
- Photo/documentation upload for milestone evidence
- Dispute flagging and freeze mechanism

#### Advance Eligibility Engine
- State-specific advance calculation rules
- Maximum advance percentage limits per state
- Contractor verification status check
- Escrow funding confirmation check
- Contract dispute status check
- Legal approval status check for state

#### Repayment Waterfall Logic
```
milestone_release_amount = approved_milestone_value
if outstanding_advance > 0:
    repayment = min(outstanding_advance, milestone_release_amount)
    outstanding_advance -= repayment
    contractor_release = milestone_release_amount - repayment
else:
    contractor_release = milestone_release_amount
```
- State-specific waterfall rules may modify this logic
- Priority of advance repayment vs. other obligations
- Surplus handling if milestone exceeds advance

#### Dispute/Freeze Handling
- Dispute initiation by homeowner or contractor
- Automatic freeze of all disbursements upon dispute
- Dispute resolution workflow tracking
- Escrow agent coordination for dispute resolution
- State-specific dispute resolution requirements
- Release of freeze upon resolution

#### State-Specific Lending Analysis
- Whether advance constitutes consumer lending per state law
- Whether business-purpose exemption applies
- Usury limit analysis for any fees/charges
- Licensing requirement determination
- Exemption analysis (de minimis, commercial purpose, etc.)

#### Contractor Verification
- Same contractor license verification as Product 1
- Additional bond/insurance verification for escrow-backed work
- Disciplinary history check
- Prior project completion verification
- State-specific contractor qualification requirements

### Frontend Requirements

#### Escrow Balance Display
- Real-time escrow balance display (from escrow agent integration)
- Funding status indicator
- Milestone allocation visualization
- Available advance amount display
- State-specific escrow information

#### Milestone Progress Tracker
- Visual milestone timeline
- Completion status for each milestone
- Inspector verification status
- Photo/documentation gallery per milestone
- Next milestone preview

#### Advance Calculator with Rule Display
- Escrow balance input
- Next milestone value input
- Risk limit display
- Real-time max advance calculation with formula display
- State-specific limit application display
- Clear "Demo Calculator" labeling

#### Contractor and Homeowner Disclosure Pages
- Separate disclosure flows for each party
- State-specific disclosure content
- Escrow agent information and licensing verification
- Milestone disbursement terms
- Dispute resolution procedures
- Cancellation rights per state

#### Dispute/Freeze Alert Interface
- Active dispute status display
- Freeze reason and duration
- Dispute resolution steps
- Contact information for dispute resolution
- State-specific dispute rights information

#### "Attorney Review Required" Banners
- Persistent banner on all escrow advance interfaces
- State-specific legal status
- Expected review timeline
- Notification signup for status changes

### Smart Contract Requirements (NOT CODE — requirements only)

#### Escrow Balance Verification
- `verifyEscrowBalance()` function: Verifies escrow funding via oracle
- Requires confirmation from licensed escrow agent
- State-specific escrow requirements check
- Emits `EscrowVerified` event

#### Milestone Completion Oracle
- `recordMilestoneCompletion()` function: Records milestone completion
- Requires verification from authorized inspector/escrow agent
- Multiple attestation option (contractor + homeowner + inspector)
- State-specific milestone requirements
- Emits `MilestoneCompleted` event

#### Advance Issuance with State Gate
- `issueAdvance()` function: Issues advance against verified escrow
- Checks: escrow funded, contractor verified, no dispute, state gate passes
- Records advance amount, state code, repayment terms
- Emits `AdvanceIssued` event
- BLOCKED if state status != PERMITTED

#### Repayment Waterfall (Escrow -> Advance Repayment -> Contractor Release)
- `processMilestoneRelease()` function: Processes milestone payment
- Waterfall logic: advance repayment first, then contractor release
- State-specific waterfall rules applied
- Emits `RepaymentProcessed` and `ContractorPaid` events

#### Freeze on Dispute
- `freezeDisbursements()` function: Freezes all disbursements
- Callable by: homeowner, contractor, escrow agent, admin
- Requires dispute reason recording
- `resolveDispute()` function: Unfreezes after dispute resolution
- Emits `DisputeFrozen` and `DisputeResolved` events

#### Audit Events
- `EscrowVerified(escrow_id, balance, escrow_agent, state_code)`
- `MilestoneCompleted(milestone_id, escrow_id, verifier, completion_hash)`
- `AdvanceIssued(advance_id, contractor, amount, state_code)`
- `RepaymentProcessed(advance_id, amount, remaining_balance)`
- `ContractorPaid(milestone_id, amount)`
- `DisputeFrozen(escrow_id, reason, initiator)`
- `DisputeResolved(escrow_id, resolution, resolver)`

### Oracle/Off-Chain Requirements

#### Escrow Balance Oracle
- Integration with licensed escrow agent systems
- Real-time balance queries
- Funding confirmation
- Disbursement tracking
- State-specific escrow agent verification

#### Milestone Completion Verification
- Inspector verification integration
- Photo/documentation evidence storage (hash only on-chain)
- Multi-party attestation collection
- Escrow agent confirmation
- State-specific verification requirements

#### State Rule Lookup
- 50-state escrow-backed advance compliance matrix
- Real-time rule queries
- Legislative change monitoring

#### Legal Approval Status
- On-chain oracle for legal review status per state
- Tracks which states permit escrow-backed advances

#### Contractor License Verification
- Same as Product 1

### Escrow/Provider Requirements

#### Escrow Account Integration
- API integration with licensed escrow agents
- State-specific escrow agent licensing requirements:
  | State | Regulator | License Required | Notes |
  |-------|-----------|------------------|-------|
  | CA | BRE | Yes | $25K net worth, fidelity bond, escrow officers |
  | TX | TDSML | Yes | Escrow officer license, $25K net worth |
  | FL | DBPR | Limited | No standalone escrow license for construction escrows |
  | NV | NRED | Yes | Under NRS 645A |
  | NY | DFS (indirect) | Via MTL or licensed lender | No standalone escrow license |
  | IL | IDFPR | Via MTL or licensed lender | Non-real-estate escrow regulated via other licenses |
  | CO | DORA/Real Estate Commission | Yes for real estate transactions | Construction escrow may not require license |
  | AZ | DIFI | Limited | Construction escrow may not require standalone license |

#### Milestone Inspection/Approval Service
- Licensed inspector network
- Photo/video documentation requirements
- State-specific inspection standards
- Digital evidence storage and attestation

#### Dispute Resolution Process
- State-specific dispute resolution procedures
- Mediation/arbitration options where required
- Escrow agent role in dispute resolution
- Timeline requirements per state

#### Licensed Escrow Agent Partnership
- Partnership agreements with licensed escrow agents in target states
- Service level agreements for balance verification and disbursement
- API integration specifications
- Compliance audit rights

### Audit Log Requirements

| Event Category | Events to Log | Retention |
|----------------|--------------|-----------|
| Escrow Balance Checks | All balance queries and results | 7 years |
| Milestone Approvals | All milestone completions with verifier | 7 years |
| Advance/Freeze Events | All advance issuances and freeze events | 7 years |
| Repayment Waterfall | All waterfall processing details | 7 years |
| Dispute Events | All dispute initiations and resolutions | 7 years |
| Consent Records | All disclosure consents | 7 years |

### Blocked-Live Gates

| Gate | Requirement | Status |
|------|-------------|--------|
| `legal_approval` | Legal review completed for escrow advance in state | BLOCKED all states |
| `escrow_funded` | Escrow account confirmed funded by licensed agent | BLOCKED (demo) |
| `contractor_verified` | Contractor license verified and active | BLOCKED (demo) |
| `contract_not_disputed` | No active dispute on contract | BLOCKED (demo) |
| `legal_review` | General legal review of escrow advance product | BLOCKED |
| `milestone_approved` | Milestone completion verified by authorized party | BLOCKED (demo) |
| `dispute_resolution_complete` | No freeze bypass without completed dispute resolution | BLOCKED |

### Legal Review Gates

| Review Type | Scope | Priority |
|-------------|-------|----------|
| Consumer lending characterization | Whether advance constitutes consumer loan per state | CRITICAL |
| Escrow agent licensing requirements | Whether licensed escrow agent required, and what type | CRITICAL |
| UCC Article 9 perfection | Whether security interest in escrow rights must be perfected | HIGH |
| Assignment of payment rights | Analysis of assignment structure for advance repayment | HIGH |
| Homeowner protection requirements | State-specific homeowner protection laws | HIGH |
| Dispute/freeze/refund rules | State-specific rules for handling disputes and refunds | HIGH |
| Construction lien priority | Whether mechanics lien affects advance repayment priority | MEDIUM |

### MVP/Demo-Only Scope

| Feature | MVP Scope | Notes |
|---------|-----------|-------|
| Mock Escrow Balance | Simulated escrow display | Demo data only |
| Demo Advance Calculator | Working calculator with escrow rules | Educational |
| Simulated Milestone Tracking | Mock milestone workflow | Shows intended flow |
| State Disclosure Display | Template disclosures per state | COUNSEL_APPROVED_TEXT_REQUIRED |
| Repayment Waterfall Demo | Visual waterfall demonstration | Shows allocation logic |
| Escrow Agent Directory | Display of licensed escrow agents by state | Informational only |

### Real-Money Launch Blockers

| Blocker | Description | Mitigation |
|---------|-------------|------------|
| State-by-state lending analysis | Determine if advance = loan in each target state | Legal review; structure as true purchase if possible |
| Escrow agent partnerships | Licensed escrow agents in all target states | Negotiate partnerships; verify licenses |
| UCC perfection process | File UCC-1 financing statements if required | Establish filing process |
| Homeowner protection compliance | State-specific consumer protections | Legal review; build compliance into product |
| Dispute resolution framework | Establish dispute resolution procedures | Partner with mediation services; build into smart contract |

---

## Product 4: Contract-Backed Contractor Working Capital

### Problem Solved

Contractors need working capital beyond equipment purchases — for payroll, materials, permits, and operational expenses. A verified construction contract with a homeowner can serve as backing for advances tied to contract milestones, providing contractors with predictable cash flow without waiting for milestone payments.

### User Flow

Similar to Product 3 (Escrow-Backed Contractor Advance) but using verified construction contract value rather than escrow balance as the basis for advance calculation.

1. **Contract Verification**: Contractor uploads signed construction contract
2. **Contract Validation**: SmartContractor validates contract terms, parties, and amount
3. **Milestone Definition**: Contract milestones defined and agreed
4. **Advance Calculation**: Maximum advance based on:
   - Rule: `max_advance = min(15% * contract_value, 50% * next_milestone_value, risk_limit, contractor_history_adjustment)`
5. **State Eligibility Check**: State-specific contract advance rules applied
6. **Disclosure and Consent**: Contractor signs required disclosures
7. **Advance Issued**: Against contract value (demo only for MVP)
8. **Milestone Tracking**: As milestones complete, repayment allocated
9. **Repayment**: From milestone payments by homeowner
10. **Contract Complete**: After final milestone, any remaining advance repaid

### Requirements

All requirements from Product 3 apply, with the following modifications:

#### Modified Backend Requirements
- **Contract Value Integration**: Instead of escrow balance, use verified contract value
- **Contract Verification**: Document verification and authentication workflow
- **Homeowner Credit Assessment**: Lightweight assessment of homeowner ability to pay
- **Milestone Payment Tracking**: Track incoming milestone payments from homeowner
- **Contract Change Order Handling**: Process for handling contract modifications

#### Modified Collateral Basis
| Product | Collateral Base | Advance Limit Basis |
|---------|----------------|---------------------|
| Product 3 | Escrow balance | Escrow funds already deposited |
| Product 4 | Contract value | Promise of future payment |

#### Additional Risk Considerations
- Contract default risk (homeowner doesn't pay milestone)
- Contract dispute risk
- Change order complexity
- Mechanic's lien priority analysis
- Contractor performance risk

#### Modified Smart Contract Requirements
- `verifyContract()` function: Validates construction contract
- `recordMilestonePayment()` function: Records incoming milestone payment from homeowner
- Repayment waterfall may differ from escrow model (no escrow agent intermediary)
- Stronger state gate requirements due to higher risk profile

#### State-Specific Considerations
- Some states may treat contract-backed advances more strictly than escrow-backed
- UCC Article 9 perfection may be more critical for contract-backed advances
- Assignment of payment rights analysis required in all states
- Homeowner credit check requirements may apply in some states

### Blocked-Live Gates

Same as Product 3, plus:
| Gate | Requirement | Status |
|------|-------------|--------|
| `contract_verification` | Contract verification process legally reviewed | BLOCKED |
| `homeowner_credit_check` | Homeowner payment ability assessment | BLOCKED |
| `mechanics_lien_analysis` | Priority of mechanics lien vs. advance analyzed | BLOCKED |

### MVP/Demo-Only Scope

Same as Product 3, plus:
| Feature | MVP Scope | Notes |
|---------|-----------|-------|
| Contract Upload Demo | Simulated contract verification | Shows intended workflow |
| Contract Value Calculator | Demo advance calculation based on contract | Educational |
| Milestone Payment Simulation | Mock homeowner payment tracking | Demo only |

---

## Product 5: State-Aware Dashboard and Contract Rules

### Problem Solved

All SmartContractor products must automatically adapt to each state's regulatory environment. A single unified dashboard must detect user location, display appropriate warnings, block prohibited actions, show required disclosures, flag items requiring attorney review, and display product status per state — all in real-time with accurate, up-to-date regulatory data.

### Dashboard Requirements

#### Auto-Detect User State
- **IP Geolocation**: Primary detection method with VPN/proxy detection
- **Address Validation**: User-provided address cross-checked with USPS database
- **Phone Area Code**: Secondary validation via phone number area code
- **License Information**: Contractor license state as confirmation
- **Manual Selection**: Fallback with explicit jurisdiction acknowledgment
- **Confidence Score**: Combined confidence scoring with low-confidence warnings

#### Display State-Specific Warnings
| Warning Type | Display Condition | Example |
|--------------|-------------------|---------|
| **BLOCKED** | All live actions blocked in state | "All live products are BLOCKED in [State] pending legal review." |
| **LEGAL_REVIEW_REQUIRED** | Legal review pending | "This product requires attorney review in [State]. Expected completion: [Date]." |
| **DEMO_ONLY** | Demo permitted, live blocked | "This product is available in DEMO MODE only in [State]." |
| **CONDITIONAL** | Available with conditions | "This product is available in [State] subject to: [conditions]." |
| **PERMITTED** | Fully permitted | "This product is available in [State]." |

#### Block Actions Not Permitted in State
- Real-time blocking of prohibited actions at UI level
- Smart contract-level blocking as secondary defense
- Clear explanation of why action is blocked
- Pathway information for unblocking (legal review timeline, required licenses)
- Option to receive notification when status changes

#### Show Required Disclosures
- Dynamic disclosure rendering based on state + product combination
- COUNSEL_APPROVED_TEXT_REQUIRED placeholders where counsel review pending
- Multi-layer disclosure: general (all states) + state-specific + product-specific
- Acknowledgment tracking with consent recording
- Disclosure version tracking and update notifications

#### Flag "Attorney Review Required" Items
- Visual flag system for items requiring legal review
- Flag categories:
  - **RED**: Cannot proceed without attorney clearance
  - **YELLOW**: Proceed with caution; legal review recommended
  - **GREEN**: Cleared by counsel
  - **GRAY**: Status unknown; legal review pending
- Filter and search by flag status
- Legal team workflow integration

#### Display Product Status Per State
- Comprehensive status matrix view:

| State | Product 1 | Product 2 | Product 3 | Product 4 | Overall |
|-------|-----------|-----------|-----------|-----------|---------|
| CA | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED |
| TX | BLOCKED | BLOCKED | DEMO_ONLY | DEMO_ONLY | RESTRICTED |
| FL | BLOCKED | BLOCKED | DEMO_ONLY | DEMO_ONLY | RESTRICTED |
| NY | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED |
| NV | LEGAL_REVIEW | LEGAL_REVIEW | CONDITIONAL | CONDITIONAL | RESTRICTED |
| AZ | LEGAL_REVIEW | LEGAL_REVIEW | CONDITIONAL | CONDITIONAL | RESTRICTED |
| CO | LEGAL_REVIEW | LEGAL_REVIEW | CONDITIONAL | CONDITIONAL | RESTRICTED |
| IL | BLOCKED | BLOCKED | DEMO_ONLY | DEMO_ONLY | RESTRICTED |
| LA | BLOCKED | BLOCKED | LEGAL_REVIEW | LEGAL_REVIEW | RESTRICTED |

- Click-through to state file for detailed analysis
- Export capability for compliance reporting
- Historical status tracking

### Smart Contract State Gates

#### State Code Storage Per User/Contract
- `userState` mapping: Stores verified state code per user
- `contractState` mapping: Stores applicable state code per contract
- State code validation against authorized list
- State code change workflow with re-verification

#### State-Specific Blocking Rules
```solidity
// Conceptual structure — NOT CODE
struct StateRule {
    string stateCode;
    mapping(string => ProductStatus) productStatus;  // product => status
    mapping(string => mapping(string => bool)) blockedActions;  // product => action => blocked
    string[] requiredDisclosures;
    bool legalReviewComplete;
    uint256 ruleVersion;
    uint256 effectiveDate;
}
```

#### Admin Override with Legal Approval
- Emergency override capability for critical situations
- Multi-signature requirement (minimum 3 of 5 guardians)
- Legal approval proof required (hash of legal opinion)
- Override reason recording
- Automatic notification to compliance team
- Override expiration (time-limited)

#### Audit of All Gate Decisions
- Every state gate evaluation recorded
- Input parameters, rule version, and outcome stored
- Appeals process for disputed decisions
- Compliance reporting data export

### Backend State Service

#### 50-State Compliance Matrix API
```
GET /api/v1/compliance/{state_code}
Response:
{
  "state_code": "CA",
  "state_name": "California",
  "regulatory_tier": "CRITICAL",
  "products": {
    "token_collateral": {
      "status": "BLOCKED",
      "reason": "DFAL license required effective July 1, 2026",
      "blocked_actions": ["live_loan_creation", "token_lock", "liquidation"],
      "required_licenses": ["CFLL", "DFAL"],
      "required_disclosures": ["COUNSEL_APPROVED"],
      "effective_date": "2025-01-01",
      "rule_version": "2025.06.01"
    },
    ...
  }
}
```

#### Real-Time Rule Lookup
- Sub-100ms response time for state rule queries
- Cached rules with Redis/Memcached
- Cache invalidation on rule updates
- Bulk query support for dashboard matrix
- GraphQL endpoint for flexible querying

#### Legislative Change Monitoring
- Automated monitoring of state legislature websites
- Regulatory agency RSS feed aggregation
- Bill tracking with relevance scoring
- Alert system for bills affecting SmartContractor products
- Integration with legal research services (Westlaw, LexisNexis)
- Weekly legislative change summary report

#### State-Specific Disclosure Delivery
- Dynamic disclosure generation based on state + product
- Multi-format delivery (HTML, PDF, email)
- Version tracking and acknowledgment
- Accessibility compliance (WCAG 2.1 AA)
- Multi-language support for states with language requirements

### Dashboard UI/UX Requirements

#### Responsive Design
- Desktop, tablet, and mobile optimized
- Progressive web app capability
- Offline mode with cached state rules

#### Accessibility
- WCAG 2.1 AA compliance
- Screen reader optimization
- Keyboard navigation support
- Color-blind friendly status indicators (not just color)

#### Performance
- Initial load < 3 seconds
- State rule updates < 1 second
- Dashboard matrix render < 500ms
- Real-time status badge updates

#### Security
- Role-based access control (RBAC)
- Audit logging of all dashboard interactions
- Rate limiting on API endpoints
- DDoS protection
- Data encryption at rest and in transit

---

## 50-State Compliance Matrix Summary

### Status Distribution

| Status Category | Count | States |
|-----------------|-------|--------|
| **BLOCKED** | ~25 | CA, NY, TX, FL, IL, LA, MA, CT, NJ, PA, MD, WA, OR, MN, MO, KS, IA, OK, AR, MS, AL, WV, VT, NH, ME |
| **HIGH LEGAL REVIEW** | ~15 | NV, AZ, CO, GA, NC, SC, VA, OH, IN, WI, MI, UT, NM, NE, RI |
| **MODERATE REVIEW** | ~8 | ND, SD, MT, WY, ID, AK, HI, DE |
| **LOW RESTRICTION** | ~2 | KY, TN |

### Critical Regulatory Themes Across 50 States

1. **Consumer lending licensing** is required or likely required in 45+ states for homeowner-facing products
2. **Money transmitter licensing** is triggered by token custody in 40+ states
3. **Digital asset-specific licensing** exists or is emerging in CA (DFAL), NY (BitLicense), LA (VCBA), IL (DACPA), and others
4. **AOB/Assignment of Benefits** is prohibited or heavily restricted in FL, TX, LA, and restricted in most other major markets
5. **Public adjuster licensing** prevents any claim negotiation activity by GCSC or contractors in all 50 states
6. **Contractor licensing verification** is universally required
7. **Usury/interest rate caps** vary dramatically: 9% (IL), 10% (TX), 12% (CO supervised), 16% (NY), 18% (FL), no cap (NV) — making national pricing extremely challenging
8. **Escrow licensing** is required or likely required for any funds-holding activity in 35+ states

### Product Viability Summary

| Product | Most Viable States | Least Viable States | Overall Assessment |
|---------|-------------------|---------------------|-------------------|
| Token-Collateral Credit | WY, SD, MT (few barriers) | CA, NY, IL, LA (specific digital asset licensing) | Challenging nationwide; state-by-state licensing required |
| ClaimBridge | NV, CO, IN (AOB permitted) | FL, TX, LA (AOB prohibited) | Very challenging; AOB barriers in largest markets |
| Escrow-Backed Advance | NV, AZ, CO, WY (clearer path) | CA, NY (escrow licensing barriers) | Most viable overall but still requires substantial licensing |
| Contract-Backed Capital | Same as Escrow-Backed | Same as Escrow-Backed | Same as Product 3 with additional risk |

---

## Appendix

### A. Status Legend

| Status | Meaning | Action Required |
|--------|---------|-----------------|
| **BLOCKED** | Live operations prohibited | Legal review + licensing required |
| **DEMO_ONLY** | Demonstration/MVP only | Legal review before any real-money activity |
| **LEGAL_REVIEW_REQUIRED** | Status uncertain pending counsel | Obtain written legal opinion |
| **CONDITIONAL** | Available with specific conditions | Meet all conditions; monitor compliance |
| **PERMITTED** | Generally permitted | Standard compliance monitoring |

### B. Glossary

| Term | Definition |
|------|------------|
| **AOB** | Assignment of Benefits — transfer of insurance claim rights to third party |
| **APR** | Annual Percentage Rate |
| **CFLL** | California Finance Lenders License |
| **DACPA** | Digital Assets and Consumer Protection Act (Illinois) |
| **DFAL** | Digital Financial Assets Law (California) |
| **DPT** | Direction to Pay (not an assignment) |
| **LTV** | Loan-to-Value ratio |
| **MTL** | Money Transmitter License |
| **NMLS** | Nationwide Multistate Licensing System |
| **PA** | Public Adjuster |
| **UPPA** | Unauthorized Practice of Public Adjusting |
| **VCBA** | Virtual Currency Business Act (Louisiana) |
| **UDAAP** | Unfair, Deceptive, or Abusive Acts or Practices |

### C. Directory Structure Reference

```
docs/research/us-state-compliance/
  README.md                                # Research overview
  master-matrix.csv                        # All 50 states as CSV
  master-matrix.json                       # All 50 states as JSON
  product-requirements-draft.md            # This file
  states/
    AL.md — WY.md                          # 50 individual state files
```

### D. Contributing Guidelines

- All changes must cite official sources
- Mark uncertain information as "Not confirmed"
- Do not add legal conclusions without attorney review
- Update master-matrix.csv and master-matrix.json when state files change
- This document is regenerated from state files; prefer updating state files for state-specific changes

### E. Research Sources

All factual claims in this document and the underlying state files are sourced from:
- Official state regulatory agency websites
- State statutes and administrative codes
- Federal agency guidance (CFPB, SEC, CFTC, Treasury)
- Court decisions and case law
- Official regulatory enforcement actions
- Industry associations (NAIC, ABA, state bar associations)

### F. Review and Update Schedule

| Activity | Frequency | Responsible Party |
|----------|-----------|-------------------|
| State file review | Quarterly | Compliance Research Team |
| Legislative change monitoring | Weekly | Automated + Legal Team |
| Product requirements update | Monthly | Product + Legal Team |
| Master matrix regeneration | After any state file change | Compliance Research Team |
| Full legal review | Annually | Licensed attorneys per state |

### G. Contact and Ownership

| Role | Responsibility |
|------|---------------|
| Product Team | Feature prioritization, MVP scoping, user flow design |
| Legal Team | State-by-state legal review, disclosure approval, licensing strategy |
| Engineering Team | Technical implementation, smart contract development, oracle integration |
| Compliance Team | Regulatory monitoring, state file maintenance, audit coordination |
| Executive Team | Go/no-go decisions, licensing budget, partnership strategy |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2025-05-28 | GCSC Compliance Research Team | Initial consolidated requirements draft |

---

*This document is for research and MVP planning purposes only. It does not constitute legal advice. All product features described herein are blocked for live deployment until all legal, provider, security, and audit gates are passed. All disclosures require COUNSEL_APPROVED_TEXT_REQUIRED before use in any customer-facing context.*

*Research compiled from 50 state compliance files. For state-specific details, consult the relevant state file in the `states/` directory.*

*Last updated: 2025-05-28*
