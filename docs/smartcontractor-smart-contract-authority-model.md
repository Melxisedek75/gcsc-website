# SmartContractor Smart Contract Authority Model

Status: internal design draft only.

This authority model does not approve real escrow, does not approve real loans, does not approve token collateral, does not approve production payments, and does not approve live XPR contract deployment.

## Purpose

Define who can call future XPR smart contract actions for SmartContractor before any code is written or deployed.

The goal is to keep authority, multisig, pause controls, dispute controls, upgrade controls, and emergency controls explicit before project escrow, loan ledger, token collateral lock, or peer review reward hook modules move beyond design.

## Module Authority Matrix

| Module | Draft actions | Allowed caller in local tests | Production authority gate |
|--------|---------------|-------------------------------|---------------------------|
| Project escrow contract | createproject, funddemo, markmilestone, pauseproject, resolvedispute | local fixture accounts only | Founder approval, legal/provider review, escrow/payment provider review, security review, approved multisig |
| Loan ledger contract | recordrequest, recordoffer, recordrepay, markdefault, pauseloan | local fixture accounts only | Founder approval, lending legal review, finance-provider review, security review, approved multisig |
| Token collateral lock | lockdemo, valuedemo, releasecoll, pausecollateral | local fixture accounts only | Founder approval, token-collateral approval, oracle review, legal/provider review, security review, approved multisig |
| Peer review reward hook | submitreview, scorework, rewarddemo, slashdemo, pausereview | local fixture accounts only | Founder approval, abuse controls, reviewer policy review, legal/provider review, security review, approved multisig |

## Required Roles

- homeowner or project owner: can approve draft project creation and submit milestone evidence in the app; cannot directly release live funds.
- contractor: can accept project terms, submit milestone proof, and view repayment waterfall state; cannot self-approve payment release.
- inspector or peer reviewer: can submit review evidence and score recommendations; cannot make final legal, payment, or loan decisions.
- platform admin: can pause local test flows, flag disputes, and prepare review records; cannot replace founder/legal/provider approval.
- founder multisig signer: required for production deployment, pause/unpause, upgrade, and live-risk enablement decisions.
- provider signer: required for any future regulated payment, escrow, lending, or stablecoin settlement workflow when a provider is responsible for that function.
- security signer: required after audit or security review for deployment, upgrade, authority change, and emergency recovery approval.

## Multisig And Pause Rules

- Production deployment must require approved multisig, not a single developer key.
- Upgrade actions must be separated from daily operating actions.
- Pause actions must exist for escrow, loan ledger, collateral lock, and peer review reward hook modules.
- Unpause actions must require stronger approval than pause actions.
- Emergency pause can stop new live-risk actions, but it must not move real funds, approve real loans, release real escrow, or liquidate token collateral.
- Authority changes must be recorded in an audit event mapping and reviewed before deployment.

## Not Allowed

- Single-key production deployment.
- Developer-only owner authority for live smart contracts.
- AI-only release, approval, default, liquidation, or dispute decisions.
- Contractor self-release of milestone payments.
- Homeowner unilateral final dispute judgment when provider/legal review is required.
- Auto-liquidation of real token collateral.
- Real repayment routing without payment/provider approval.
- Any claim that SmartContractor is a licensed lender, bank, escrow agent, payment provider, underwriter, broker, or legal advisor.

## Required Before Coding

- Backend-to-chain mapping for every planned action name and table name.
- Audit event mapping for authority changes, pauses, unpauses, disputes, repayment events, collateral events, and reward events.
- Local no-real-money test fixture accounts.
- Draft XPR account names or local placeholder names.
- Founder approval of module scope.
- Legal/provider review checklist for live-risk actions.
- Security review checklist for action permissions and authority boundaries.

## Required Before Deployment

- Founder approves final account names and authority model.
- XPR account names are confirmed and created by the founder.
- Multisig threshold is approved and documented.
- Attorney/provider review is complete for escrow, lending, payment, stablecoin, and token-collateral language.
- Security review is complete.
- No-real-money local tests pass.
- Production payment, escrow, finance, and stablecoin providers are selected and approved where required.
- Public wording matches the actual approved implementation.

## Required Linked Files

- `docs/smartcontractor-smart-contract-design.md`
- `docs/smartcontractor-smart-contract-implementation-gate.md`
- `docs/smartcontractor-loan-legal-risk-model.md`
- `docs/whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix.md`
- `docs/whitepaper-v1-2-contract-backed-loan-implementation-blocker-register.md`
- `docs/whitepaper-v1-2-contract-backed-loan-approval-evidence-template.md`

## Required Checks

- `npm run check:smart-contract-authority-model`
- `npm run check:smart-contract-implementation-gate`
- `npm run check:contract-docs`
- `npm run check`
