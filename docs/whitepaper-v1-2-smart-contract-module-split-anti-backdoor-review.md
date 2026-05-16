# GCSC Whitepaper v1.2 Smart Contract Module Split And Anti-Backdoor Review

Status: internal smart contract architecture review only.

This review is not legal advice, not securities advice, not tax advice, not provider approval, not security-audit approval, not approval to deploy live XPR contracts, not approval to launch real escrow, not approval to launch real loans, not approval to launch real repayment routing, not approval to launch stablecoin settlement, not approval to launch token collateral, not approval to move real money, and not approval to publish public wording.

## Purpose

This document locks the founder-present evening direction for the next smart contract architecture step: GCSC must not become one large contract with broad owner powers. It must be split into small modules with explicit authority, audit trails, pause controls, state transition guards, and anti-backdoor rules before any local coding, public whitepaper wording, live XPR deployment, or real-money action.

Source documents:

- `docs/gcsc-v1-2-core-architecture-package.md`
- `docs/whitepaper-v1-2-smart-contract-architecture-draft.md`
- `docs/smartcontractor-smart-contract-authority-model.md`
- `docs/smartcontractor-smart-contract-audit-event-map.md`
- `docs/smartcontractor-smart-contract-implementation-gate.md`
- `docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md`

## Module Split Decision

The future smart contract architecture should be a coordinated module system, not one monolith.

| Module | Core responsibility | Must depend on | Must not do |
| --- | --- | --- | --- |
| Authority And Role Module | Roles, multisig, provider signer, security signer, pause authority, upgrade authority, protected action permissions. | Audit registry, founder/security/provider review evidence. | Hidden owner-only drain, frontend-controlled authority, unaudited role changes, single-key production deployment. |
| Project Contract Registry | Accepted project relationship, participant roles, signed agreement references, milestone references, status history. | Authority module, audit registry, backend project contract records. | Claim the chain record is the signed legal contract before legal/provider review. |
| Milestone And Escrow-Ready State Machine | Evidence submission, review, approval, dispute hold, release eligibility, refund/adjustment labels, archive state. | Project registry, dispute module, audit registry, provider/payment gates. | Claim live escrow, release funds before approval, bypass dispute hold. |
| Contract-Backed Loan Ledger | Working-capital request state, provider review state, approved-principal reference, outstanding balance, repayment event records, closeout. | Project registry, repayment router, authority module, audit registry. | Originate real loans, approve borrowers, create legal collateral status, change repayment history without audit. |
| Repayment Waterfall Router | Deterministic draft allocation after approved milestone and no-dispute checks. | Milestone state machine, loan ledger, payment/provider terms, audit registry. | Route real repayments, overpay above outstanding balance, create negative contractor payout, run while disputed. |
| Collateral And Risk Module | Future collateral references, LTV policy references, oracle snapshot references, risk labels, disabled/enabled collateral state. | Authority module, audit registry, legal/provider/custody/oracle evidence. | Lock real token collateral, auto-liquidate, trust arbitrary oracle data, mutate collateral balances. |
| Reputation And Review Ledger | Completed work signals, review outcomes, dispute ratio, repayment behavior where legally usable, fraud flags, correction path. | Milestone state machine, dispute module, audit registry. | Illegal blacklisting, unexplained automated denial, AI-only final negative decision. |
| Dispute And Human Override Module | Dispute pause, review route, resolution record, refund/adjustment labels, human/admin/provider override record. | Authority module, milestone state machine, audit registry. | Release or repay while dispute is active, let one party self-resolve critical disputes. |
| Audit And Compliance Registry | Append-only non-secret evidence of roles, actions, state transitions, blocked-live flags, request IDs, approvals, and review references. | Every module. | Store secrets, raw identity documents, private keys, service-role keys, SSNs, raw bank data, or mutable history. |

## Authority Model Requirements

Production authority must be least-privilege and role-specific:

- homeowner or project owner can approve draft project records and review milestone evidence in the app, but cannot directly release live funds;
- contractor can accept terms and submit evidence, but cannot self-approve milestone release, loan approval, repayment routing, or dispute resolution;
- inspector, peer reviewer, or admin can record review evidence and recommendations, but cannot move funds directly;
- platform admin can pause local flows, flag disputes, and prepare review records, but cannot replace founder/legal/provider approval;
- founder multisig signer is required for deployment, authority changes, upgrade actions, unpause actions, and live-risk enablement decisions;
- provider signer is required for future regulated payment, escrow, lending, stablecoin, or repayment routing workflows;
- security signer is required for deployment, upgrade, authority change, emergency recovery, and post-audit approval.

Unpause must require stronger approval than pause. Emergency pause may stop new actions, but it must not move funds, approve loans, release escrow, route repayments, liquidate collateral, or rewrite history.

## Anti-Backdoor Rules

No module may include:

- hidden owner-only drain;
- arbitrary balance mutation;
- hidden upgrade path;
- unaudited authority change;
- frontend-controlled protected authority;
- contractor self-approval;
- AI-only final approval;
- dispute-to-release bypass;
- repayment routing while disputed;
- repayment above outstanding balance;
- negative contractor payout;
- auto-liquidation of real token collateral;
- arbitrary oracle trust;
- mutable audit history;
- secret storage on-chain;
- service-role key in browser code;
- public claim that a roadmap feature is live.

Any future code review must fail the module if one of these patterns is found.

## Emergency Pause Settlement Boundary

Emergency pause is not a settlement primitive. It may stop new protected actions while founder, provider, security, and legal/provider reviewers inspect evidence, but pause cannot approve loans, release escrow, route repayments, liquidate collateral, mutate balances, upgrade contracts, or rewrite audit history.

During a pause, paused modules may record append-only audit events and blocked-live evidence only. They may not change economic state, clear disputes, mark repayment complete, unlock token collateral, alter authority, or convert draft records into live approvals.

Unpause requires founder multisig, provider review where money flows are involved, security review, and an audit event. Unpause must restore the prior safe state or route to a separately approved recovery plan; it must never silently settle funds or erase the reason for the pause.

## State Transition Guards

Every state transition must be explicit and replayable.

Required transition guards:

- project registry cannot create a live legal collateral claim;
- milestone state cannot move from evidence submitted to release eligible without review, approval, no active dispute, and audit event;
- loan ledger cannot move from requested to funded without external provider review evidence and blocked-live gate clearance;
- repayment router cannot compute live routing without approved milestone, no active dispute, outstanding-balance cap, provider/payment/legal terms, and audit event;
- collateral module cannot enable token collateral without custody, oracle, LTV, liquidation, legal, provider, security, and founder approvals;
- reputation module must preserve correction/review path;
- dispute module must block release and repayment until resolution conditions are recorded;
- audit registry must record actor, role, request ID, previous state, next state, safety gate, and approval status.

## Audit Trail Requirements

Every module must emit audit events for:

- role grants, role revokes, authority changes, multisig evidence, provider gate evidence, security gate evidence;
- project creation, milestone creation, evidence submission, review, approval recommendation, dispute pause, dispute resolution, archive;
- loan request, score recommendation, provider review record, offer draft, repayment plan draft, repayment allocation draft, closeout label;
- collateral estimate, price snapshot, LTV check, collateral blocked/unblocked status, liquidation blocked status;
- reputation review, score record, abuse flag, correction record;
- emergency pause, unpause, upgrade proposal, upgrade approval, rollback or recovery action.

Audit events must be append-only and non-secret. They must include request ID, module, action name, actor role, previous state, next state, safety gate, provider review status, founder approval status, legal/provider status, and created timestamp where applicable.

## Deployment And Live-Use Gates

Smart contract modules remain local-only until all required gates are recorded outside the autonomous system:

- founder scope approval;
- legal/provider review;
- finance-provider review where contractor credit or repayment is involved;
- escrow/payment provider review where funds or custody are involved;
- stablecoin/provider/compliance review where settlement is involved;
- token collateral legal/custody/oracle/LTV/liquidation review where collateral is involved;
- security review;
- no-real-money local tests;
- XPR account creation and authority setup by the founder;
- multisig threshold approval;
- public wording review;
- final deployment approval.

Until then, the correct status is `LOCAL_ONLY`, `PASS_LOCAL_ONLY`, or `BLOCKED_FOR_LIVE`, never `APPROVED_FOR_LIVE`.

## Required Review Fixtures

The module split review must be covered by local fixtures that prove:

1. A single-key deploy path is rejected.
2. Hidden owner-only drain is rejected.
3. Arbitrary balance mutation is rejected.
4. Hidden upgrade path is rejected.
5. Contractor self-approval is rejected.
6. AI-only final approval is rejected.
7. Dispute-to-release bypass is rejected.
8. Repayment above outstanding balance is rejected.
9. Negative contractor payout is rejected.
10. Token collateral live enablement is rejected.
11. Authority change without audit event is rejected.
12. Live deployment remains `BLOCKED_FOR_LIVE` without external founder/legal/provider/security/XPR evidence.

## Required Checks

- `npm run check:whitepaper-v1-2-smart-contract-module-split-anti-backdoor`
- `npm run check:whitepaper-v1-2-smart-contract-architecture`
- `npm run check:smart-contract-authority-model`
- `npm run check:smart-contract-audit-event-map`
- `npm run check:smart-contract-implementation-gate`
- `npm run check:whitepaper-v1-2-contract-backed-loan-technical-requirements`
- `npm run check`
