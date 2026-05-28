# SmartContractor Smart Contract Module Recommendations

## Document Information

| Field | Value |
|-------|-------|
| **Status** | DRAFT - Requirements Only |
| **Code Status** | No smart contract code included |
| **Last Updated** | 2025-05-28 |
| **Version** | 1.0.0 |
| **Classification** | Internal - Engineering & Legal Review |
| **Review Cycle** | Requires quarterly legal review and update |

### Document Purpose

This document serves as the authoritative requirements specification for all future smart contract modules supporting the SmartContractor platform. It is intended for consumption by engineering leadership, legal counsel, compliance officers, and external security auditors. No production code should be derived from this document without explicit legal sign-off on a per-module basis.

### Scope

This specification covers nine core modules and their interdependencies, state compliance integration points, security guardrails, and administrative controls. It does not contain implementation code, pseudocode, or algorithmic logic sufficient for direct deployment.

### Assumptions

- All modules will be deployed on an EVM-compatible blockchain network.
- SmartContractor maintains a native utility token referred to as GCSC.
- A state compliance oracle service exists and is maintained off-chain.
- Multi-signature wallet infrastructure is available for administrative actions.
- Legal review and approval is a prerequisite for any module transitioning from testnet to mainnet.
- All financial products require state-by-state legal analysis before activation.
- The platform serves verified contractors and property owners within the United States.

---

## Overview

SmartContractor's product roadmap requires a suite of on-chain modules to manage insurance claim advances, token-collateralized credit facilities, escrow-backed contractor advances, and supporting infrastructure for contractor verification, audit logging, and administrative governance. Each module is designed to operate within a tightly controlled legal and compliance framework where state-specific rules dictate availability and behavior.

This document outlines the smart contract modules needed to support SmartContractor's future products. All modules require legal review before implementation. The architecture prioritizes safety, transparency, and regulatory compliance over feature velocity. Every financial action is gated by state compliance checks, legal approval flags, and multi-signature administrative controls.

The nine modules described herein are:

1. **ClaimBridge Module (gcscclaim111)** - Insurance claim advance management
2. **Token Collateral Credit Module (gcsccredit11)** - Token-collateralized lending
3. **Escrow-Backed Advance Module (gcscadvance1)** - Milestone-based escrow advances
4. **Escrow Integration (gcscrow1111)** - Escrow system integration layer
5. **Staking Integration (gcscstake111)** - Staking module integration layer
6. **Token Integration (gcsctoken111)** - GCSC token operations interface
7. **Contractor Verification Module** - License and eligibility verification
8. **Admin/Legal Guard Rails** - Centralized governance and approval system
9. **Audit Events** - Comprehensive on-chain event logging

Each module specification includes purpose, functional requirements, data requirements, state compliance gates, administrative controls, anti-backdoor requirements, and integration points.

---

## Module 1: ClaimBridge Module (gcscclaim111)

### Purpose

The ClaimBridge Module handles insurance claim advance requests, assignment of benefits (where permitted by state law), and repayment from claim proceeds. This module serves as the on-chain coordination layer between contractors requesting advances against pending insurance claims and the SmartContractor platform managing those advances.

Insurance claim advances represent a regulated financial product that varies dramatically in permissibility and structure across U.S. jurisdictions. Some states permit assignment of benefits (AOB) freely; others restrict or prohibit it entirely. Some states require specific disclosures; others mandate particular fee structures or cap advance amounts. The ClaimBridge Module must account for this regulatory diversity through robust state gating.

### Functional Requirements

The ClaimBridge Module shall implement the following functional requirements:

**FR-1.1: Advance Request Recording**
- The module must record advance requests submitted by verified contractors.
- Each request must capture a unique identifier, state code, policy information hash, event type, estimated payout, and requested advance amount.
- Requests must be recorded on-chain with an immutable timestamp.
- Requests in blocked states must be rejected at the point of submission.

**FR-1.2: Assignment of Benefits Management**
- Where state law permits AOB, the module must support recording of assignment document hashes.
- AOB functionality must be completely disabled in states where assignment is prohibited.
- Assignment documents must be stored as hashes only; no document content resides on-chain.
- Revocation of assignment must be supported where legally permissible.

**FR-1.3: Claim Advance Status Tracking**
- The module must maintain a comprehensive status lifecycle for each advance.
- Valid statuses: `pending`, `approved`, `denied`, `repaid`, `defaulted`.
- Status transitions must follow a defined state machine with no unauthorized skips.
- All status changes must emit audit events.

**FR-1.4: Live Advance Blocking**
- No advance may proceed to live issuance until the `legal_approval_flag` is set to true.
- The legal approval flag requires explicit action by the legal team multi-sig.
- Advances in demo or test mode may bypass the legal approval flag only within designated test environments.
- Test mode advances must be clearly marked and excluded from production reporting.

**FR-1.5: Audit Event Emission**
- Every action within the module must emit a corresponding audit event.
- Events must include: timestamp, actor address, action type, advance identifier, state code, and result.
- Events must be immutable and permanently queryable.
- No action may occur without a corresponding event emission.

**FR-1.6: State Compliance Oracle Integration**
- The module must integrate with the state compliance oracle for all state gate checks.
- Oracle responses must be recorded on-chain for audit purposes.
- Oracle failures must result in default-deny behavior.
- The module must support oracle updates without contract redeployment.

**FR-1.7: Demo/Test Mode Support**
- The module must support a demo/test mode for product demonstrations and integration testing.
- Test mode must be clearly distinguishable from live operations.
- Test mode operations must not affect live financial metrics or compliance reporting.
- Test mode must be activatable only by authorized admin roles.

### Data Requirements

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `advance_id` | Unique Identifier | Unique identifier for each advance request | Auto-generated, immutable |
| `state_code` | String | Two-letter U.S. state code of the requesting user | Must be valid U.S. state or territory code |
| `policy_info_hash` | Hash | Hashed representation of insurance policy information | SHA-256 hash, never store plaintext policy data |
| `event_type` | Enum | Type of insurable event causing the claim | Values: fire, water, flood, storm, roof, smoke, mold, tree |
| `estimated_payout` | Decimal | Estimated insurance payout from assessment | Must be positive, derived from licensed adjuster assessment |
| `advance_amount` | Decimal | Calculated advance amount | Must not exceed platform-defined percentage of estimated payout |
| `assignment_document_hash` | Hash (Optional) | Hash of assignment of benefits document, where applicable | Null if AOB not permitted or not used |
| `status` | Enum | Current status of the advance request | Values: pending, approved, denied, repaid, defaulted |
| `legal_approval_flag` | Boolean | Indicates whether legal team has approved this product in this state | Default: false, set by legal_team multi-sig only |
| `created_at` | Timestamp | When the advance request was recorded | Immutable, set at creation |
| `updated_at` | Timestamp | When the advance record was last modified | Updated on every state transition |
| `requester_address` | Address | On-chain address of the requesting contractor | Must be a verified contractor address |
| `mortgagee_loss_draft_flag` | Boolean | Indicates if mortgagee/loss draft requirements apply | Checked against state compliance oracle |
| `public_adjuster_involved` | Boolean | Indicates if a public adjuster is involved in the claim | True value blocks advance issuance |

### State Gates

The ClaimBridge Module must enforce the following state gating logic for every advance operation:

**SG-1.1: Blocked State Check**
- Query the state compliance oracle to determine if the requesting user's state permits claim advances.
- If the state is on the blocked states list, reject the request with a clear reason code.
- The blocked states list must be maintained by the compliance officer role and legal team.
- Blocked status must be hardcoded for states with statutory prohibitions (not admin-overridable).

**SG-1.2: Legal Approval Verification**
- Verify the `legal_approval_flag` is set to true before any live advance issuance.
- The legal approval flag is set per state and per product type.
- Legal approval must be recorded on-chain with approving signatures and timestamp.
- No admin action may bypass a false legal approval flag for live operations.

**SG-1.3: Assignment of Benefits Status Check**
- Query the state compliance oracle for AOB permissibility in the user's state.
- If AOB is prohibited, reject any request containing an assignment document hash.
- If AOB is permitted with restrictions, verify compliance with those restrictions.
- If AOB is permitted, verify the assignment document format complies with state requirements.

**SG-1.4: Mortgagee/Loss Draft Handling**
- Check if the state or insurance policy requires mortgagee notification or loss draft processing.
- If mortgagee requirements apply, verify mortgagee notification has been completed off-chain.
- Record mortgagee notification completion hash on-chain where required.
- Block advance issuance if mortgagee requirements are unmet.

**SG-1.5: Public Adjuster Detection**
- Check if a public adjuster is involved in the claim.
- If public adjuster involvement is detected, block the advance request.
- Public adjuster involvement must be self-reported by the contractor and verified where possible.
- This gate exists to prevent conflicts of interest and comply with state public adjuster regulations.

### Admin Controls

| Control | Role Required | Description | Conditions |
|---------|--------------|-------------|------------|
| `legal_team_approval` | legal_team multi-sig | Approve a product for live use in a specific state | Requires minimum 2 of 3 legal team signatures |
| `state_rule_update` | admin only | Update state-specific rules in the compliance oracle | Must be pre-approved by compliance_officer |
| `emergency_pause` | multi-sig | Pause all operations in the module | Requires 2 of 5 admin roles |
| `audit_log_export` | admin | Export audit events for external review | Read-only operation, no signatures required |
| `blocked_states_update` | legal_team + compliance_officer | Add or remove states from the blocked list | Cannot override statutory prohibitions |
| `test_mode_toggle` | admin | Enable or disable test mode for the module | Requires security_admin approval |
| `oracle_address_update` | multi-sig | Update the state compliance oracle address | Requires 3 of 5 admin roles |

### Anti-Backdoor Requirements

The following requirements exist specifically to prevent hidden administrative access or bypass mechanisms:

**AB-1.1: No Single-Admin Bypass**
- No single administrative address may bypass state gates under any circumstances.
- All state gate overrides require multi-signature approval with on-chain recording.
- The system must not contain any "god mode" or super-admin function that bypasses compliance checks.

**AB-1.2: On-Chain Legal Approval Recording**
- Every legal approval must be recorded on-chain with the approving addresses, timestamp, and scope of approval.
- Legal approvals must be queryable by external auditors.
- Revocation of legal approval must be equally visible and recorded.

**AB-1.3: Override Audit Events**
- Any override of normal business logic must emit a high-priority audit event.
- Override events must include the full justification, approving parties, and expected duration.
- Override events must trigger off-chain notifications to the full admin team.

**AB-1.4: Timelock on Rule Changes**
- All state rule changes must pass through a mandatory timelock period before taking effect.
- Minimum timelock duration: 48 hours.
- During the timelock period, the change is visible on-chain but not active.
- Emergency bypass of timelock requires 4 of 5 admin roles.

**AB-1.5: No Hidden Functions**
- The module must not contain any functions not documented in this specification.
- All functions must be visible in the public interface.
- No delegatecall patterns to unverified contracts.
- All external calls must be to audited and approved contract addresses.

---

## Module 2: Token Collateral Credit Module (gcsccredit11)

### Purpose

The Token Collateral Credit Module manages token collateral lock, credit issuance, repayment, and liquidation. This module enables verified contractors to obtain credit facilities by locking GCSC tokens as collateral, creating a secured lending product that is regulated differently across U.S. jurisdictions.

Token-collateralized credit introduces several regulatory considerations: money transmitter licensing requirements, usury rate limitations, secured lending disclosures, and securities law implications depending on token characteristics. The module must navigate this complexity through comprehensive state gating and conservative legal defaults.

### Functional Requirements

**FR-2.1: Token Lock Mechanism**
- The module must support locking GCSC tokens as collateral for credit facilities.
- Token lock must be reversible only upon full repayment or authorized liquidation.
- Locked tokens must be held in a segregated contract address, not commingled with operational funds.
- The lock mechanism must record the token quantity, USD value at lock time, and lock timestamp.

**FR-2.2: Loan-to-Value (LTV) Threshold Management**
- The module must enforce a maximum LTV ratio at credit issuance.
- Initial LTV threshold shall be set conservatively (recommendation: not exceeding 50% at launch).
- LTV is calculated as: `credit_amount_usd / collateral_value_usd * 100`.
- LTV thresholds must be updatable via multi-sig but subject to timelock.

**FR-2.3: Credit Issuance with State Gate**
- Credit may only be issued to borrowers in states where token-collateralized credit is permitted.
- Credit issuance requires the `legal_approval_flag` to be true for the borrower's state.
- Borrower must be a verified contractor (see Module 7).
- Credit issuance must record all terms on-chain: amount, interest rate, repayment schedule hash, and liquidation trigger price.

**FR-2.4: Repayment Schedule Tracking**
- The module must track repayment against the agreed schedule.
- Partial repayments must be supported.
- Early repayment must be supported without penalty (subject to state law).
- Repayment status must be updated in real-time and emit audit events.

**FR-2.5: Liquidation Trigger with Multi-Sig Approval**
- Liquidation may be triggered when collateral value falls below the liquidation threshold.
- Liquidation requires multi-signature approval (minimum 3 of 5 admins).
- A price oracle must confirm collateral value is below the threshold.
- Liquidation must follow the liquidation safety rules defined below.

**FR-2.6: State-Specific Blocking Logic**
- Credit issuance must be blocked in states where token-collateralized lending is prohibited or requires unobtained licenses.
- The state compliance oracle must be queried before every credit issuance.
- State blocking must default to conservative (block if uncertain).
- State-specific interest rate caps must be enforced.

**FR-2.7: Collateral Release on Repayment**
- Full repayment must automatically trigger collateral release.
- Collateral release must transfer locked tokens back to the borrower's address.
- Partial collateral release may be supported for partial repayments (future enhancement).
- Collateral release must emit audit events.

**FR-2.8: Borrower Consent Recording**
- Every credit facility must be accompanied by recorded borrower consent.
- Consent is recorded as a hash of the disclosure and agreement documents.
- Consent must include acknowledgment of collateral lock, liquidation risk, and repayment terms.
- No credit may be issued without recorded consent.

### Data Requirements

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `credit_id` | Unique Identifier | Unique identifier for each credit facility | Auto-generated, immutable |
| `borrower_address` | Address | On-chain address of the borrower | Must be verified contractor address |
| `state_code` | String | Two-letter U.S. state code of the borrower | Must pass state compliance gate |
| `collateral_amount` | Integer | Amount of GCSC tokens locked as collateral | Must be positive |
| `collateral_value_usd` | Decimal | USD value of collateral at lock time | Determined by price oracle at lock |
| `credit_amount_usd` | Decimal | USD value of credit issued | Must not exceed LTV threshold |
| `ltv_ratio` | Decimal | Loan-to-value ratio at issuance | Recorded at issuance, checked against threshold |
| `interest_rate` | Decimal | Annual interest rate on the credit facility | Must comply with state usury caps |
| `repayment_schedule_hash` | Hash | Hash of the repayment schedule agreement | Must be generated before issuance |
| `status` | Enum | Current status of the credit facility | Values: pending, active, repaid, liquidated, defaulted |
| `liquidation_trigger_price` | Decimal | Collateral USD value at which liquidation may be triggered | Calculated at issuance based on LTV |
| `legal_approval_flag` | Boolean | Legal approval for this product in borrower's state | Default: false |
| `consent_document_hash` | Hash | Hash of borrower's consent and disclosure documents | Required before issuance |
| `issuance_timestamp` | Timestamp | When the credit facility was created | Immutable |
| `last_updated_timestamp` | Timestamp | When the credit record was last modified | Updated on every state transition |
| `liquidation_approvers` | Address Array | Addresses that approved a liquidation (if applicable) | Populated only on liquidation |
| `total_repaid` | Decimal | Cumulative amount repaid | Updated on each repayment |

### State Gates

**SG-2.1: Token Collateral Status Check**
- Query the state compliance oracle for whether token-collateralized credit is permitted.
- If the state status is "blocked", reject the credit request.
- Status values: permitted, restricted, blocked, analysis_pending.
- Analysis_pending must be treated as blocked.

**SG-2.2: Legal Approval Verification**
- Verify the `legal_approval_flag` is true for the borrower's state.
- Legal approval must be specific to token-collateralized credit products.
- Legal approval must not be older than 90 days without renewal.
- Expired legal approvals must be treated as false.

**SG-2.3: Money Transmitter License Check**
- Query whether SmartContractor holds a money transmitter license in the borrower's state.
- If the state requires a license and none is held, block the credit request.
- License status must be verified against an off-chain registry.
- License expiration must be tracked and enforced.

**SG-2.4: Contractor Verification Check**
- Verify the borrower is a verified contractor through Module 7.
- Verification must be active (not expired or revoked).
- Contractor must be licensed in the state matching the credit request.
- Verification check must be performed at issuance and may be re-verified periodically.

**SG-2.5: Usury Cap Check**
- Calculate the effective APR of the credit facility.
- Compare against the usury cap for the borrower's state.
- If the usury cap would be exceeded, block the credit request or reduce the interest rate.
- Usury calculation must include all fees and charges.

**SG-2.6: Business Purpose Certification**
- Verify the borrower has certified the credit is for business purposes.
- Consumer-purpose lending may trigger additional regulatory requirements.
- Business purpose certification must be recorded as a document hash.
- Misrepresentation of business purpose must be grounds for immediate default.

### Liquidation Safety Rules

The following rules govern all liquidation actions and must be implemented as hard requirements:

**LR-2.1: Multi-Signature Approval**
- Liquidation requires approval from minimum 3 of 5 designated admin addresses.
- Approval must be recorded on-chain with all approving addresses and timestamps.
- No single admin may trigger liquidation.
- Emergency liquidation procedures (if any) require 4 of 5 roles.

**LR-2.2: Price Oracle Confirmation**
- A price oracle must confirm that the collateral USD value has fallen below the liquidation trigger price.
- Oracle price must be no older than 1 hour at the time of liquidation confirmation.
- Oracle failure or stale price must block liquidation.
- Multiple oracle sources are recommended for price verification.

**LR-2.3: Notice Period**
- Where legally required, a 24-hour notice period must elapse between liquidation notification and execution.
- The borrower must receive off-chain notification of impending liquidation.
- Notice period may be waived only with 4 of 5 admin approval and legal team sign-off.
- Notice must include the trigger price, current price, and borrower's options to add collateral or repay.

**LR-2.4: Borrower Notification**
- Borrower notification must occur via the off-chain notification service.
- Notification must include all relevant liquidation details.
- Notification delivery must be logged for audit purposes.
- Failed notification must not block liquidation if notice period has elapsed and delivery was attempted.

**LR-2.5: Proceeds Distribution**
- Liquidation proceeds must be distributed in the following order:
  1. First: repayment of outstanding credit principal and accrued interest
  2. Second: liquidation fees (capped at platform maximum)
  3. Third: remainder returned to the borrower
- Distribution must be atomic (all steps succeed or none do).
- Distribution must emit detailed audit events.

**LR-2.6: Dispute Period Protection**
- No liquidation may occur during an active legal dispute period.
- Dispute period is triggered by borrower filing via the off-chain process.
- Dispute filing must be recorded on-chain within 24 hours.
- Dispute resolution must follow state-specific procedures.

**LR-2.7: State-Specific Liquidation Rules**
- Some states have specific liquidation notice requirements, redemption periods, or judicial requirements.
- State-specific rules must be checked and applied before liquidation execution.
- The state compliance oracle must provide state-specific liquidation parameters.
- Violation of state-specific rules must block liquidation.

### Admin Controls

| Control | Role Required | Description | Conditions |
|---------|--------------|-------------|------------|
| `ltv_threshold_update` | multi-sig | Update the maximum LTV ratio | Requires 3 of 5 roles, subject to 48-hour timelock |
| `liquidation_execution` | multi-sig | Approve and execute liquidation | Requires 3 of 5 roles plus oracle confirmation |
| `state_rule_update` | admin | Update state-specific rules | Must be pre-approved by compliance_officer |
| `emergency_pause` | multi-sig | Pause all credit operations | Requires 2 of 5 roles |
| `collateral_emergency_release` | multi-sig + legal | Emergency release of collateral to borrower | Requires 3 of 5 roles plus legal_team approval |
| `interest_rate_update` | admin | Update base interest rate | Subject to state usury compliance check |
| `oracle_address_update` | multi-sig | Update price oracle address | Requires 4 of 5 roles |

---

## Module 3: Escrow-Backed Advance Module (gcscadvance1)

### Purpose

The Escrow-Backed Advance Module manages escrow-backed contractor advances with milestone-based repayment. This module provides advances to contractors against funds held in escrow for construction or restoration projects, with repayment occurring automatically as project milestones are completed and approved.

Escrow-backed advances occupy a unique regulatory position. They are not traditional loans in many jurisdictions because they are secured by escrowed funds and repaid from construction proceeds. However, some states may classify them as lending products, contractor financing, or regulated escrow activities. The module must implement conservative state gating until legal clarity is achieved.

### Functional Requirements

**FR-3.1: Escrow Balance Verification**
- The module must verify escrow balance before approving any advance.
- Escrow balance is read from the Escrow Integration Module (gcscrow1111).
- Balance verification must occur at advance issuance and may be re-verified periodically.
- Insufficient escrow balance must block advance issuance.

**FR-3.2: Milestone Tracking and Completion**
- The module must track project milestones and their completion status.
- Milestone completion is verified through the Escrow Integration Module.
- Each milestone must have a defined payment amount and completion criteria.
- Milestone tracking must be immutable once recorded.

**FR-3.3: Advance Issuance with State Gate**
- Advance issuance requires the borrower's state to permit escrow-backed advances.
- The `legal_approval_flag` must be true for the state.
- Advance amount must not exceed the calculated advance limit.
- Both homeowner disclosure and contractor consent must be recorded.

**FR-3.4: Repayment Waterfall Logic**
- On each milestone approval, the module must execute the following waterfall:
  1. Check if an advance is outstanding for the escrow contract.
  2. If outstanding: allocate a defined portion of the milestone payment to advance repayment.
  3. Calculate the remaining amount after repayment allocation.
  4. Release the remaining amount to the contractor.
  5. Emit audit events for each step of the waterfall.
- On the final milestone: the full outstanding advance must be repaid before the contractor receives any remaining funds.

**FR-3.5: Freeze Mechanism on Dispute**
- The module must implement a freeze mechanism that halts all advance activity when a dispute is flagged.
- Freeze applies to: new advance issuance, milestone processing, and repayment releases.
- Freeze may only be lifted through the dispute resolution process.
- Freeze state must emit immediate audit events and off-chain notifications.

**FR-3.6: State-Specific Lending Analysis Gate**
- The module must check whether escrow-backed advances trigger lending regulations in the borrower's state.
- If lending regulations apply, verify all applicable license and disclosure requirements are met.
- State-specific lending analysis must be performed before the `legal_approval_flag` may be set.
- Lending analysis results must be recorded on-chain.

**FR-3.7: Homeowner Disclosure Recording**
- Every escrow-backed advance requires recorded homeowner disclosure.
- Disclosure must explain the advance mechanism, repayment terms, and impact on project funds.
- Homeowner disclosure is stored as a document hash on-chain.
- No advance may proceed without recorded homeowner disclosure.

**FR-3.8: Contractor Consent Recording**
- Every escrow-backed advance requires recorded contractor consent.
- Consent must acknowledge the repayment waterfall, freeze mechanism, and dispute process.
- Contractor consent is stored as a document hash on-chain.
- No advance may proceed without recorded contractor consent.

### Data Requirements

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `advance_id` | Unique Identifier | Unique identifier for each escrow-backed advance | Auto-generated, immutable |
| `escrow_contract_id` | Identifier | Reference to the escrow contract | Must exist in Escrow Integration Module |
| `contractor_address` | Address | Contractor's on-chain address | Must be verified |
| `homeowner_address` | Address | Homeowner's on-chain address | Required for disclosure tracking |
| `state_code` | String | Two-letter state code | Must pass state compliance gate |
| `escrow_balance` | Decimal | Verified escrow balance at advance issuance | Read from escrow oracle |
| `advance_amount` | Decimal | Amount of the advance issued | Must not exceed advance limit |
| `advance_limit` | Decimal | Calculated maximum advance amount | Formula: min(20% of escrow, 50% of milestone value, risk_limit) |
| `milestones` | Array | Array of milestone objects | Each milestone contains: id, amount, criteria_hash, status |
| `repayment_status` | Enum | Status of advance repayment | Values: outstanding, repaid, defaulted |
| `dispute_flag` | Boolean | Indicates active dispute | True triggers immediate freeze |
| `freeze_reason` | String | Reason for freeze (if applicable) | Set when dispute_flag becomes true |
| `legal_approval_flag` | Boolean | Legal approval for this product in this state | Default: false |
| `homeowner_disclosure_hash` | Hash | Hash of homeowner disclosure documents | Required before issuance |
| `contractor_consent_hash` | Hash | Hash of contractor consent documents | Required before issuance |
| `created_at` | Timestamp | When the advance was created | Immutable |
| `updated_at` | Timestamp | Last modification time | Updated on every change |

### Milestone Object Structure

| Field | Type | Description |
|-------|------|-------------|
| `milestone_id` | Unique Identifier | Unique identifier within the advance |
| `description_hash` | Hash | Hash of milestone description and completion criteria |
| `milestone_amount` | Decimal | Payment amount allocated to this milestone |
| `completion_status` | Enum | Values: pending, submitted, approved, rejected |
| `completion_timestamp` | Timestamp | When milestone was marked complete (if applicable) |
| `approver_address` | Address | Address that approved the milestone (if applicable) |
| `repayment_allocation` | Decimal | Portion of milestone payment allocated to advance repayment |

### Repayment Waterfall Specification

The repayment waterfall must be implemented exactly as follows:

**Step 1: Outstanding Check**
- On milestone approval, query the current advance balance.
- If no advance is outstanding, skip to Step 4 (release full milestone to contractor).
- If advance is outstanding, proceed to Step 2.

**Step 2: Repayment Allocation**
- Calculate the repayment amount from the milestone payment.
- Default allocation: 100% of milestone payment goes to advance repayment until advance is fully repaid.
- Alternative allocations may be defined per contract but must be recorded at advance creation.
- Allocation may not exceed the milestone payment amount.

**Step 3: Remaining Calculation**
- Calculate: `remaining = milestone_payment - repayment_allocation`.
- If remaining is positive, proceed to Step 4.
- If remaining is zero or negative, no funds are released to the contractor from this milestone.

**Step 4: Release to Contractor**
- Transfer the remaining amount to the contractor's designated address.
- Update the advance balance to reflect repayment.
- If advance is fully repaid, update `repayment_status` to `repaid`.

**Step 5: Final Milestone Requirement**
- On the final milestone, verify the advance is fully repaid.
- If outstanding balance remains, deduct it from the final milestone payment.
- Only release final milestone remainder to contractor after advance is satisfied.
- If final milestone is insufficient to cover outstanding balance, flag for manual review.

**Step 6: Audit Events**
- Emit `MilestoneApproved` event with milestone details.
- Emit `RepaymentReceived` event with repayment amount.
- Emit `AdvanceRepaid` event if advance is fully satisfied.
- Emit `FundsReleased` event with contractor release amount.

### State Gates

**SG-3.1: Escrow Advance Status Check**
- Query the state compliance oracle for escrow-backed advance permissibility.
- States where this product is blocked or under analysis must reject advance requests.
- Status must be checked at issuance and may be re-checked on milestone processing.

**SG-3.2: Legal Approval Verification**
- Verify `legal_approval_flag` is true for the borrower's state.
- Legal approval must specifically cover escrow-backed advances.
- Approval must be current (not expired).

**SG-3.3: Contractor License Check**
- Verify the contractor holds an active license through Module 7.
- License must be valid in the state where the project is located.
- License type must match the project scope.

**SG-3.4: Escrow Funding Verification**
- Verify the escrow contract is fully funded.
- Funding verification occurs through the Escrow Integration Module.
- Unfunded or partially funded escrows must block advance issuance.

**SG-3.5: Contract Dispute Check**
- Verify no active dispute exists on the escrow contract.
- Dispute check must query both on-chain and off-chain dispute records.
- Active disputes block advance issuance and trigger freeze on existing advances.

**SG-3.6: Milestone Validity Check**
- Verify milestones are properly defined and approved before advance issuance.
- Milestones must have clear completion criteria and payment allocations.
- Invalid or undefined milestones block advance issuance.

**SG-3.7: Homeowner Disclosure Check**
- Verify `homeowner_disclosure_hash` is recorded and not null.
- Disclosure must be current (not expired where applicable).
- Unsigned or missing disclosure blocks advance issuance.

**SG-3.8: Contractor Consent Check**
- Verify `contractor_consent_hash` is recorded and not null.
- Consent must be current and specific to the advance terms.
- Unsigned or missing consent blocks advance issuance.

### Freeze/Dispute Rules

**FD-3.1: Automatic Freeze on Dispute**
- When `dispute_flag` is set to true, all advance activity for the affected escrow contract must freeze immediately.
- Freeze must occur atomically with the dispute flag being set.
- Freeze affects: new advance issuance, milestone processing, fund releases.

**FD-3.2: Dispute Resolution Authority**
- Only the legal_team role, combined with signatures from both contractor and homeowner, may resolve a dispute.
- Resolution must be recorded on-chain with all party signatures.
- Resolution may result in: advance continuation, advance termination with refund, or advance modification.

**FD-3.3: On-Chain Resolution Recording**
- All dispute resolutions must be permanently recorded on-chain.
- Resolution record must include: dispute reason, resolution type, party signatures, timestamp.
- Resolution record is immutable once submitted.

**FD-3.4: Refund Handling**
- If a contract is cancelled, refund handling must follow state-specific rules.
- Refunds may include: return of unspent advance amounts, pro-rata refund calculations, or retention of earned amounts.
- Refund distribution must be recorded on-chain.
- Refund rules are provided by the state compliance oracle.

**FD-3.5: State-Specific Refund Rules**
- Some states require specific refund timelines or calculations.
- State-specific refund rules must be applied automatically.
- Violation of refund rules must block the refund transaction.

---

## Module 4: Escrow Integration (gcscrow1111)

### Purpose

The Escrow Integration Module provides a standardized interface between SmartContractor's on-chain modules and external escrow systems. It handles escrow balance verification, milestone status tracking, and compliance verification for escrow agents. This module does not hold funds; it serves as an oracle and integration layer.

### Functional Requirements

**FR-4.1: Escrow Balance Reading**
- The module must read escrow balances from off-chain escrow providers.
- Balance reading must support multiple escrow providers.
- Balance data must include: total funded amount, released amount, remaining balance.
- Balance reads must be timestamped and recorded for audit.

**FR-4.2: Milestone Status Reading**
- The module must read milestone status from off-chain escrow providers.
- Milestone data must include: milestone identifier, description hash, amount, completion status.
- Milestone status updates must trigger on-chain notifications to dependent modules.
- Milestone reads must support both polling and push mechanisms.

**FR-4.3: Escrow Agent Licensing Verification**
- The module must verify escrow agents are licensed where state law requires.
- Licensing verification must query state escrow licensing databases.
- Unlicensed escrow agents must trigger warnings and may block operations.
- Licensing status must be cached and refreshed periodically.

**FR-4.4: Fund Segregation Confirmation**
- The module must confirm escrowed funds are held in segregated accounts.
- Segregation confirmation comes from escrow provider attestation.
- Lack of segregation must trigger compliance alerts.
- Segregation status must be recorded on-chain.

**FR-4.5: Multi-Provider Support**
- The module must support integration with multiple escrow providers.
- Each provider must be registered with its own configuration.
- Provider switching must be supported without module redeployment.
- Provider failures must not cascade to dependent modules.

**FR-4.6: State-Specific Escrow Rule Compliance**
- The module must apply state-specific escrow rules.
- Rules may include: licensing requirements, fee caps, disclosure requirements, timing rules.
- State rules are provided by the state compliance oracle.
- Rule changes must be picked up without module redeployment.

### Integration Points

| Consumer Module | Data Provided | Trigger | Frequency |
|----------------|--------------|---------|-----------|
| gcscadvance1 | Escrow balance | Advance issuance request | Per request |
| gcscadvance1 | Milestone completions | Milestone approval event | Event-driven |
| gcscclaim111 | Escrow balance (for claim-related repairs) | Claim advance request | Per request |
| gcsccredit11 | Escrow balance (as supplementary collateral info) | Credit issuance request | Per request |

### Data Requirements

| Field | Type | Description |
|-------|------|-------------|
| `escrow_contract_id` | Unique Identifier | Reference to the escrow contract |
| `provider_id` | Identifier | Escrow provider identifier |
| `balance_total` | Decimal | Total funded amount |
| `balance_released` | Decimal | Amount already released |
| `balance_remaining` | Decimal | Remaining available balance |
| `milestone_count` | Integer | Number of milestones defined |
| `milestones_completed` | Integer | Number of completed milestones |
| `agent_license_number` | String | Escrow agent license number |
| `agent_license_status` | Enum | Values: active, expired, suspended, unknown |
| `funds_segregated` | Boolean | Whether funds are in segregated accounts |
| `last_balance_update` | Timestamp | When balance was last read from provider |
| `last_milestone_update` | Timestamp | When milestones were last read from provider |

---

## Module 5: Staking Integration (gcscstake111)

### Purpose

The Staking Integration Module provides integration between the token staking system and the collateral management system. It enables staked tokens to be locked as collateral for credit facilities, tracks staking rewards during the collateral lock period, and handles token unlocking on repayment or liquidation.

### Functional Requirements

**FR-5.1: Staked Token Lock as Collateral**
- The module must support locking staked tokens as collateral for credit facilities.
- Lock mechanism must prevent unstaking while tokens serve as collateral.
- Lock must record: token amount, lock timestamp, associated credit_id, unlock conditions.
- Lock must be reversible only upon satisfying unlock conditions.

**FR-5.2: Staking Reward Tracking During Lock**
- The module must track staking rewards that accrue during the collateral lock period.
- Reward accrual must not be interrupted by the collateral lock.
- Reward distribution must follow the staking protocol's normal schedule.
- Reward handling during liquidation must be defined and documented.

**FR-5.3: Reward Distribution During Collateral Lock**
- Staking rewards may accrue to the borrower during the collateral lock period.
- Reward claims must not affect the collateral value securing the credit facility.
- Reward distribution must be separate from collateral management.
- Reward claims must be recorded for audit.

**FR-5.4: Token Unlock on Repayment**
- Full repayment of the credit facility must automatically trigger collateral unlock.
- Unlock must restore the borrower's full staking rights.
- Unlock must be atomic with repayment confirmation.
- Failed unlock must trigger admin alert and manual resolution process.

**FR-5.5: Emergency Unlock Procedures**
- Emergency unlock procedures must exist for exceptional circumstances.
- Emergency unlock requires multi-sig approval (minimum 4 of 5 admins) plus legal_team approval.
- Emergency unlock must be recorded with full justification.
- Emergency unlock must not be used for routine operations.

### Integration Points

| Consumer Module | Action | Description |
|----------------|--------|-------------|
| gcsccredit11 | Lock tokens | gcsccredit11 calls gcscstake111 to lock staked tokens as collateral |
| gcsccredit11 | Unlock tokens | gcsccredit11 calls gcscstake111 to unlock tokens on repayment |
| gcsccredit11 | Query rewards | gcsccredit11 may query accrued rewards during lock |
| gcsccredit11 | Liquidation unstake | gcsccredit11 may trigger unstaking during liquidation |

### Data Requirements

| Field | Type | Description |
|-------|------|-------------|
| `collateral_lock_id` | Unique Identifier | Unique identifier for each collateral lock |
| `credit_id` | Identifier | Reference to the associated credit facility |
| `stake_position_id` | Identifier | Reference to the staking position |
| `locked_amount` | Integer | Number of tokens locked |
| `locked_at` | Timestamp | When the lock was created |
| `unlock_conditions` | Enum | Values: repayment, liquidation, emergency_unlock |
| `rewards_accrued` | Decimal | Rewards accrued during lock period |
| `rewards_claimed` | Decimal | Rewards claimed during lock period |
| `lock_status` | Enum | Values: active, unlocked, liquidated |

---

## Module 6: Token Integration (gcsctoken111)

### Purpose

The Token Integration Module provides a standardized interface for all GCSC token operations across SmartContractor's module suite. It handles token transfers, locks, valuations, and distributions. All modules reference this module for token-related operations to ensure consistency and auditability.

### Functional Requirements

**FR-6.1: Token Transfer for Collateral**
- The module must handle token transfers for collateral purposes.
- Transfers must be recorded with: sender, recipient, amount, purpose, timestamp.
- Collateral transfers must be distinguishable from standard transfers.
- Transfer failures must be handled gracefully with error reporting.

**FR-6.2: Token Lock/Unlock**
- The module must support token locking and unlocking operations.
- Locked tokens must be held in a designated contract address.
- Lock/unlock operations must be atomic and emit events.
- Lock records must include: owner, amount, lock reason, unlock conditions.

**FR-6.3: Token Valuation via Price Oracle**
- The module must provide token valuation through a price oracle.
- Valuation must return USD value for a given token amount.
- Oracle price must be fresh (stale prices must be rejected).
- Valuation must be used by gcsccredit11 for LTV calculations.

**FR-6.4: Token Burning**
- The module must support token burning where applicable (e.g., liquidation scenarios).
- Burning must be irreversible.
- Burning must be authorized by multi-sig for non-trivial amounts.
- Burning must emit detailed audit events.

**FR-6.5: Token Distribution**
- The module must support token distribution for rewards and incentives.
- Distribution must be recorded with: recipient, amount, distribution type, timestamp.
- Distribution must comply with any applicable securities regulations.
- Distribution must be integrated with the staking module for reward distribution.

### Integration Points

| Consumer Module | Action | Description |
|----------------|--------|-------------|
| gcsccredit11 | Transfer tokens | Transfer tokens for collateral lock and release |
| gcsccredit11 | Query valuation | Get USD value of collateral tokens |
| gcscstake111 | Transfer tokens | Transfer tokens for staking operations |
| gcsccredit11 | Burn tokens | Burn tokens during liquidation (if applicable) |
| All modules | Query balance | Query token balances |

### Data Requirements

| Field | Type | Description |
|-------|------|-------------|
| `operation_id` | Unique Identifier | Unique identifier for each token operation |
| `operation_type` | Enum | Values: transfer, lock, unlock, burn, distribute |
| `from_address` | Address | Sender address |
| `to_address` | Address | Recipient address (if applicable) |
| `amount` | Integer | Token amount |
| `usd_value_at_operation` | Decimal | USD value at time of operation |
| `purpose` | Enum | Values: collateral, repayment, reward, liquidation, fee |
| `operation_timestamp` | Timestamp | When the operation occurred |
| `authorized_by` | Address | Address that authorized the operation |

---

## Module 7: Contractor Verification Module

### Purpose

The Contractor Verification Module verifies contractor licenses and eligibility on a state-by-state basis. It serves as the identity and licensing backbone for all contractor-facing financial products, ensuring that only properly licensed contractors may access platform services.

### Functional Requirements

**FR-7.1: License Information Storage**
- The module must store contractor license information per state.
- Storage must include: license number, license type, license status, expiration date.
- License information must be linked to the contractor's on-chain address.
- Historical license information must be retained for audit.

**FR-7.2: License Status Verification**
- The module must verify license active status through off-chain oracles.
- Verification must query state contractor licensing boards where available.
- Verification must occur at onboarding and periodically thereafter.
- Expired or revoked licenses must trigger automatic blocking.

**FR-7.3: License Expiration Tracking**
- The module must track license expiration dates.
- Expiration warnings must be emitted 30 days, 14 days, and 7 days before expiration.
- Operations using an expired license must be blocked.
- Renewal verification must be supported.

**FR-7.4: Unlicensed Contractor Blocking**
- Contractors without valid licenses must be blocked from all financial operations.
- Blocking must be automatic based on license status.
- Blocked contractors must receive clear notification of the reason.
- Reinstatement must require re-verification of license.

**FR-7.5: State-Specific License Requirements**
- The module must apply state-specific license requirements.
- Requirements may include: license type, minimum experience, insurance requirements, bond requirements.
- State requirements are provided by the state compliance oracle.
- Requirements must be checked before any financial operation.

**FR-7.6: State Licensing Board Integration**
- The module must integrate with state contractor licensing boards where APIs are available.
- Integration must support real-time license verification.
- Integration failures must default to blocking until resolved.
- New state integrations must be addable without module redeployment.

### Data Requirements

| Field | Type | Description |
|-------|------|-------------|
| `contractor_address` | Address | Contractor's on-chain address |
| `state_code` | String | Two-letter state code for the license |
| `license_number` | String | Official license number |
| `license_type` | String | Type of contractor license (e.g., general, roofing, electrical) |
| `license_status` | Enum | Values: active, expired, suspended, revoked, pending_verification |
| `license_expiration_date` | Date | When the license expires |
| `verification_timestamp` | Timestamp | When license was last verified |
| `verification_source` | String | Source of verification (e.g., state_board_api, manual_review) |
| `verification_hash` | Hash | Hash of verification response for audit |
| `insurance_on_file` | Boolean | Whether required insurance is documented |
| `bond_on_file` | Boolean | Whether required bond is documented |
| `years_experience` | Integer | Reported years of experience |
| `background_check_status` | Enum | Values: pending, passed, failed, expired |

---

## Module 8: Admin/Legal Guard Rails

### Purpose

The Admin/Legal Guard Rails Module provides centralized administrative and legal approval governance for all SmartContractor modules. It implements role-based access control, multi-signature requirements, legal approval workflows, and emergency controls. This module is the security and compliance backbone of the platform.

### Functional Requirements

**FR-8.1: Multi-Signature Admin Approval**
- All critical actions require multi-signature approval.
- Signature requirements vary by action type (see Required Approvals table).
- Signatures must be recorded on-chain with timestamps.
- Signature requirements must be updatable via super_admin with appropriate safeguards.

**FR-8.2: Legal Approval Recording**
- Legal approvals must be recorded per state and per product.
- Approval record must include: approving legal team members, timestamp, scope, expiration.
- Approvals must be queryable by external auditors.
- Approval revocation must be equally visible and recorded.

**FR-8.3: State Rule Management**
- State rules must be manageable through this module.
- Rule updates require legal_team + compliance_officer approval.
- Rules must be versioned with full history retained.
- Rule changes are subject to the timelock mechanism.

**FR-8.4: Emergency Pause Functionality**
- The module must support emergency pause of any or all modules.
- Pause requires 2 of 5 admin roles.
- Unpause requires 3 of 5 admin roles.
- Pause state must be immediately visible and emit alerts.

**FR-8.5: Audit Log for Admin Actions**
- Every admin action must be recorded in an immutable audit log.
- Audit log entries must include: actor, action, target, timestamp, transaction hash.
- Audit log must be exportable for external review.
- Audit log must be permanently retained.

**FR-8.6: Role-Based Access Control**
- The module must implement role-based access control.
- Roles are defined below with their respective permissions.
- Role assignment requires super_admin approval.
- Role revocation requires super_admin approval.

### Admin Roles

| Role | Responsibilities | Assignment Authority |
|------|-----------------|---------------------|
| `super_admin` | System setup, role assignment, critical parameter changes | Initial deployment only, then 4 of 5 multi-sig |
| `legal_team` | State rule updates, legal approvals, dispute resolution | super_admin assignment, requires legal credential verification |
| `compliance_officer` | State gate monitoring, compliance reporting, blocked states management | super_admin assignment, requires compliance credential verification |
| `security_admin` | Emergency pause, oracle management, security incident response | super_admin assignment, requires security credential verification |
| `provider_admin` | Escrow provider integrations, oracle provider management, external service configuration | super_admin assignment |

### Required Approvals

| Action | Required Approvals | Timelock | Notes |
|--------|-------------------|----------|-------|
| Live loan creation | legal_team + provider_admin | None | Both roles must approve each live state activation |
| Liquidation | legal_team + 2 security_admins | 24 hours where required | Oracle confirmation also required |
| State rule change | legal_team + compliance_officer | 48 hours | Rule history retained permanently |
| Emergency pause | Any 2 of 5 roles | None | Immediate effect |
| Emergency unpause | 3 of 5 roles | None | Higher threshold than pause |
| LTV threshold update | 3 of 5 roles | 48 hours | Must include legal_team |
| Legal approval grant | 2 of 3 legal_team members | None | Per state, per product |
| Legal approval revoke | 2 of 3 legal_team members | None | Per state, per product |
| Oracle address change | 4 of 5 roles | 48 hours | Security-critical |
| Role assignment | super_admin | 48 hours | Requires credential verification |
| Emergency collateral release | 3 of 5 roles + legal_team | None | Exceptional circumstances only |
| Contract upgrade | 4 of 5 roles + legal_team | 72 hours | If upgradeable pattern used |

---

## Module 9: Audit Events

### Purpose

The Audit Events Module defines the comprehensive event logging standard for all smart contract actions across the SmartContractor platform. These events provide an immutable, queryable record of all significant actions for compliance, security, and operational monitoring.

### Functional Requirements

**FR-9.1: State Gate Check Events**
- Every state gate check must emit an event.
- Event must include: state_code, action being gated, check result, reason for result.
- Failed gates must emit high-priority events.
- All state gate events must be permanently retained.

**FR-9.2: Approval/Denial Events**
- Every approval or denial decision must emit an event.
- Event must include: decision type, approver addresses, target, timestamp, reason.
- Multi-sig approvals must include all signing addresses.
- Denials must include clear reason codes.

**FR-9.3: Collateral Change Events**
- Every collateral change (lock, release, liquidation) must emit an event.
- Event must include: credit_id, amount, action type, timestamp, resulting collateral balance.
- Collateral changes must be traceable from initial lock to final disposition.
- Liquidation events must include detailed distribution information.

**FR-9.4: Liquidation Step Events**
- Every step in the liquidation process must emit an event.
- Events must cover: trigger confirmation, approval, notice period, execution, distribution.
- Liquidation events must include the full approval chain.
- Failed liquidation steps must emit error events.

**FR-9.5: Admin Action Events**
- Every admin action must emit an event.
- Event must include: actor address, action performed, target, timestamp.
- Role changes must emit specialized events.
- Emergency actions must emit high-priority events with full justification.

**FR-9.6: Event Immutability and Queryability**
- All events must be immutable once emitted.
- Events must be queryable by: timestamp range, actor, action type, state_code, result.
- Event queries must support efficient filtering for audit purposes.
- Events must be exportable in standard formats.

**FR-9.7: Event Standard Format**
- All events must include: timestamp, actor address, action description, state_code, result.
- Events should follow a consistent naming convention.
- Events should include indexed parameters for efficient querying.
- Events should include human-readable descriptions where possible.

### Event Types

| Event Name | Parameters | Description | Priority |
|-----------|-----------|-------------|----------|
| `StateGateChecked` | `state_code`, `action`, `result`, `reason` | Emitted when any state gate is evaluated | Normal |
| `LegalApprovalRecorded` | `state_code`, `product`, `approved_by[]`, `timestamp` | Emitted when legal approval is granted | High |
| `LegalApprovalRevoked` | `state_code`, `product`, `revoked_by[]`, `timestamp`, `reason` | Emitted when legal approval is revoked | High |
| `CollateralLocked` | `credit_id`, `amount`, `ltv`, `timestamp` | Emitted when collateral is locked | Normal |
| `CollateralReleased` | `credit_id`, `amount`, `timestamp` | Emitted when collateral is released | Normal |
| `LiquidationTriggered` | `credit_id`, `trigger_price`, `approved_by[]`, `timestamp` | Emitted when liquidation is initiated | Critical |
| `LiquidationExecuted` | `credit_id`, `execution_price`, `proceeds_distribution`, `timestamp` | Emitted when liquidation completes | Critical |
| `AdvanceIssued` | `advance_id`, `amount`, `state_code`, `timestamp` | Emitted when an advance is issued | Normal |
| `MilestoneApproved` | `advance_id`, `milestone_id`, `amount`, `timestamp` | Emitted when a milestone is approved | Normal |
| `RepaymentReceived` | `credit_id` or `advance_id`, `amount`, `timestamp` | Emitted when repayment is received | Normal |
| `DisputeFrozen` | `advance_id`, `reason`, `timestamp` | Emitted when dispute freeze is activated | High |
| `DisputeResolved` | `advance_id`, `resolution_type`, `resolved_by[]`, `timestamp` | Emitted when dispute is resolved | High |
| `AdminAction` | `actor`, `action`, `target`, `timestamp` | Emitted for all admin actions | Normal |
| `RoleAssigned` | `role`, `assignee`, `assigned_by`, `timestamp` | Emitted when role is assigned | High |
| `RoleRevoked` | `role`, `revokee`, `revoked_by`, `timestamp` | Emitted when role is revoked | High |
| `EmergencyPaused` | `module`, `paused_by[]`, `timestamp`, `reason` | Emitted when emergency pause is activated | Critical |
| `EmergencyUnpaused` | `module`, `unpaused_by[]`, `timestamp` | Emitted when emergency pause is lifted | Critical |
| `OracleUpdated` | `oracle_type`, `old_address`, `new_address`, `updated_by[]`, `timestamp` | Emitted when oracle address is changed | High |
| `ThresholdUpdated` | `parameter`, `old_value`, `new_value`, `updated_by[]`, `timestamp` | Emitted when threshold is changed | High |
| `ContractorVerified` | `contractor_address`, `state_code`, `license_number`, `timestamp` | Emitted when contractor is verified | Normal |
| `ContractorBlocked` | `contractor_address`, `state_code`, `reason`, `timestamp` | Emitted when contractor is blocked | High |

---

## Integration Matrix

The following matrix describes the cross-module integration relationships:

| Module | gcscclaim111 | gcsccredit11 | gcscadvance1 | gcscrow1111 | gcscstake111 | gcsctoken111 |
|--------|-------------|-------------|-------------|-------------|-------------|-------------|
| **gcscclaim111** | - | shares state svc | shares state svc | reads escrow | - | - |
| **gcsccredit11** | shares state svc | - | - | - | locks/unlocks | transfers |
| **gcscadvance1** | shares state svc | - | - | reads escrow | - | - |
| **gcscrow1111** | - | - | provides balance | - | - | - |
| **gcscstake111** | - | locks/unlocks | - | - | - | - |
| **gcsctoken111** | - | transfers | - | - | - | - |

### Integration Descriptions

**gcscclaim111 <-> gcsccredit11: State Service Sharing**
- Both modules query the same state compliance oracle service.
- Shared state rules ensure consistent gating across products.
- Legal approvals are tracked per product but validated through shared infrastructure.

**gcscclaim111 <-> gcscadvance1: State Service Sharing**
- Both modules share state compliance infrastructure.
- Consistent state gating prevents regulatory gaps between products.

**gcscclaim111 <-> gcscrow1111: Escrow Reading**
- gcscclaim111 may reference escrow balances for claim-related repair projects.
- This enables coordination between insurance claim advances and escrow-funded repairs.

**gcsccredit11 <-> gcscstake111: Collateral Lock/Unlock**
- gcsccredit11 calls gcscstake111 to lock staked tokens when issuing credit.
- gcsccredit11 calls gcscstake111 to unlock tokens on full repayment.
- gcscstake111 manages the staking mechanics while gcsccredit11 manages the credit terms.

**gcsccredit11 <-> gcsctoken111: Token Transfers**
- gcsccredit11 uses gcsctoken111 for all collateral token transfers.
- gcsctoken111 provides standardized transfer, lock, and valuation functions.

**gcscadvance1 <-> gcscrow1111: Balance Reading**
- gcscadvance1 reads escrow balances from gcscrow1111 for advance limit calculations.
- gcscadvance1 reads milestone completions from gcscrow1111 for repayment waterfall.
- gcscrow1111 is the authoritative source for escrow data.

---

## Security Requirements

The following security requirements apply to all modules described in this document:

**SR-1: Security Audit Requirement**
- All modules must pass a comprehensive security audit by a reputable third-party auditor before deployment to mainnet.
- Audit scope must include: code review, formal verification (where applicable), economic attack analysis, and access control review.
- Audit findings must be remediated before deployment.
- Audit reports must be retained and made available to relevant regulators upon request.

**SR-2: No Single Point of Failure**
- No single administrative address or key may control critical functions.
- All critical functions require multi-signature approval.
- Oracle failures must default to safe states (typically denial of operation).
- Redundancy must be considered for oracle and off-chain services.

**SR-3: Multi-Signature for Critical Actions**
- Critical actions are defined as: parameter changes, legal approvals, liquidations, emergency controls, contract upgrades.
- Multi-signature requirements are defined in Module 8.
- Signature thresholds must not be reducible below minimums.
- Signature addresses must be held by verified individuals with appropriate credentials.

**SR-4: Timelock on Parameter Changes**
- All parameter changes must pass through a mandatory timelock period.
- Minimum timelock: 48 hours for standard changes, 72 hours for contract upgrades.
- Timelock period allows for review and potential intervention.
- Emergency bypass of timelock requires elevated approval thresholds.

**SR-5: No Backdoor Functions**
- No module may contain undocumented functions.
- No module may contain functions that bypass security controls.
- No module may use delegatecall to unverified contracts.
- All functions must be visible in the public interface.

**SR-6: Audit Event Emission**
- All admin actions must emit audit events as defined in Module 9.
- All security-relevant actions must emit audit events.
- Event emission must be atomic with the action.
- Missing event emission must be treated as a critical bug.

**SR-7: Emergency Pause Capability**
- All modules must support emergency pause as defined in Module 8.
- Pause must be activatable within one block time.
- Pause must halt all state-changing operations.
- Pause must not affect read-only query functions.

**SR-8: Formal Verification Recommendation**
- Formal verification is strongly recommended for financial modules (gcsccredit11, gcscadvance1, gcscclaim111).
- Formal verification should cover: fund flow correctness, access control enforcement, state transition validity.
- Formal verification reports should be retained with audit reports.

**SR-9: Access Control Enforcement**
- All functions must enforce appropriate access controls.
- Access control failures must revert transactions.
- Role definitions must follow the Module 8 specification.
- No function may be accessible to unintended callers.

**SR-10: Oracle Security**
- Price oracles must be manipulation-resistant.
- State compliance oracles must be authoritative and tamper-evident.
- Oracle updates must require multi-signature approval.
- Stale oracle data must be rejected.

---

## State Compliance Integration

The following requirements govern how all modules integrate with state compliance infrastructure:

**SC-1: Mandatory State Compliance Query**
- All modules must query the state compliance service before executing financial actions.
- Query must include: state_code, product_type, action_type.
- Response must be recorded on-chain for audit.
- Compliance failures must result in operation denial.

**SC-2: Updatable State Rules**
- State rules must be updatable without contract redeployment.
- Updates must follow the approval workflow in Module 8.
- Update mechanism must be through the state compliance oracle or authorized oracle update.
- Rule version history must be retained.

**SC-3: Hardcoded State Blocking**
- State-specific blocking for statutory prohibitions must be hardcoded.
- Hardcoded blocks must not be admin-overridable.
- Hardcoded blocks protect against accidental or malicious activation in prohibited jurisdictions.
- Hardcoded blocks may only be changed through contract upgrade with legal_team approval.

**SC-4: On-Chain Legal Approval Recording**
- Legal approval must be recorded on-chain before live operations.
- Approval record must be queryable and immutable.
- Approval must specify: approving parties, product scope, state scope, effective date, expiration date.
- Expired approvals must be treated as absent (default deny).

**SC-5: Compliance Oracle Integration Pattern**
- Modules should call the compliance oracle through a standardized interface.
- Oracle interface must be defined in a shared library or interface contract.
- Oracle address must be manageable through Module 8 governance.
- Oracle failures must default to deny.

**SC-6: State Rule Caching**
- State rules may be cached locally to reduce oracle query costs.
- Cached rules must have a maximum age before refresh.
- Critical operations must always query the oracle directly.
- Cache staleness must be detectable and handled.

**SC-7: Cross-Border Protection**
- Operations must be blocked if the user's state cannot be determined.
- Operations must be blocked if there is ambiguity about applicable state law.
- Multi-state projects must identify a primary state for compliance purposes.
- State determination must use verified address or KYC information.

**SC-8: Regulatory Change Monitoring**
- The platform must monitor for regulatory changes in all active states.
- New regulations that affect product permissibility must trigger legal review.
- Automated alerts must notify legal_team and compliance_officer of relevant regulatory changes.
- Products may be automatically paused in states where new regulations create uncertainty.

**SC-9: Compliance Reporting**
- The platform must generate compliance reports on demand.
- Reports must include: operations by state, legal approval status, blocked operations, dispute summaries.
- Reports must be exportable in standard formats.
- Reports must be retained for the period required by applicable law.

**SC-10: Integration with Legal Workflow**
- State compliance integration must support the legal workflow.
- Legal team must be able to review and approve state rules before activation.
- Legal approval must be a prerequisite for rule changes affecting live operations.
- Legal workflow must be auditable and reportable.

---

## Appendix A: Glossary

| Term | Definition |
|------|-----------|
| **AOB** | Assignment of Benefits - a legal transfer of insurance claim rights from policyholder to contractor |
| **GCSC** | SmartContractor's native utility token |
| **LTV** | Loan-to-Value ratio - the ratio of credit amount to collateral value |
| **Multi-sig** | Multi-signature - requiring multiple parties to approve an action |
| **Oracle** | An off-chain data source that provides information to on-chain contracts |
| **State Gate** | A compliance check that determines whether an operation is permitted in a given state |
| **Timelock** | A mandatory delay period before a parameter change takes effect |
| **USD Value** | United States Dollar value, typically determined by a price oracle |
| **Waterfall** | A sequential distribution logic that prioritizes certain payments over others |

## Appendix B: Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-05-28 | SmartContractor Engineering | Initial draft requirements specification |

## Appendix C: Review Checklist

Before any module transitions from requirements to implementation, the following checklist must be completed:

- [ ] Legal review completed for the module's target states
- [ ] Compliance officer sign-off on state gating logic
- [ ] Security architect review of access control design
- [ ] External counsel opinion on regulatory classification
- [ ] Money transmitter license analysis (where applicable)
- [ ] Usury analysis for lending products
- [ ] Securities law analysis for token-related products
- [ ] Insurance regulation analysis for claim advance products
- [ ] Contractor licensing requirement analysis
- [ ] Escrow regulation analysis (where applicable)
- [ ] Multi-sig wallet setup and key custody procedures
- [ ] Oracle provider selection and due diligence
- [ ] Incident response procedures documented
- [ ] Audit firm engagement letter signed
- [ ] Testnet deployment plan approved

---

*This document contains requirements and specifications only. No smart contract code is included. All modules described herein require legal review before implementation. This document does not constitute legal advice and should be reviewed by qualified legal counsel before any development or deployment activities.*
