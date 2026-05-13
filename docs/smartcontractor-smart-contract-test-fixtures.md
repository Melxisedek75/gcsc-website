# SmartContractor Smart Contract Test Fixtures

Status: internal local test fixture plan only.

This fixture plan does not approve real escrow, does not approve real loans, does not approve token collateral, does not approve production payments, and does not approve live XPR contract deployment.

## Purpose

Define the local no-real-money fixture data needed before future XPR smart contract modules are coded or deployed.

The fixtures are meant to test action shape, state transitions, authority checks, audit event mapping, repayment waterfall logic, dispute pause behavior, collateral state labels, and peer review reward hooks without touching real funds, real XPR accounts, live escrow, live loans, or production providers.

## Fixture Accounts

| Fixture account | Role | Allowed local use |
|-----------------|------|-------------------|
| demoowner111 | homeowner or project owner | Create local project fixtures, submit milestone approval evidence, open disputes |
| democontr111 | contractor | Accept draft project terms, submit milestone proof, view repayment waterfall state |
| demoinspect1 | inspector or peer reviewer | Submit local review recommendations and inspection scores |
| demoadmin111 | platform admin | Pause local fixtures, flag disputes, create review records |
| demoprovidr1 | provider signer | Simulate payment, escrow, lending, stablecoin, or finance-provider approval records |
| demosecurty1 | security signer | Simulate security review approval and emergency pause evidence |
| demomulti111 | multisig placeholder | Simulate approved multisig authority in local tests only |

## Fixture Objects

- project fixture: accepted bid, homeowner, contractor, project contract id, milestone list, status, and request id.
- milestone fixture: sequence number, description, demo amount label, completion evidence, review state, dispute state, and release recommendation.
- loan fixture: requested amount label, underwriting status, provider review status, repayment priority, repayment waterfall state, and default label.
- collateral fixture: token estimate label, LTV label, oracle snapshot placeholder, lock status, release status, and liquidation blocked flag.
- peer review fixture: reviewer id, evidence id, score, recommendation, abuse flag, reward label, and reputation impact label.
- audit fixture: actor, action name, table name, request id, previous state, next state, and safety gate note.

## Required Test Scenarios

1. Project escrow happy path: project created, milestone submitted, review completed, release recommended, but no real payment moves.
2. Dispute pause path: dispute opens before milestone release, release is paused, reviewer evidence is recorded, admin review is required.
3. Loan repayment waterfall path: milestone payment event is simulated, repayment-first allocation is calculated, contractor remainder is labeled, but no real loan or payment is approved.
4. Collateral lock path: token collateral status is recorded as demo-only, oracle snapshot is placeholder-only, liquidation remains blocked.
5. Peer review reward path: review recommendation is accepted, reward label is calculated, but no real token reward is issued.
6. Authority failure path: contractor self-release, single-key deployment, AI-only approval, and unauthorized unpause attempts are rejected.
7. Emergency pause path: admin or security signer pauses local module state without moving funds, approving loans, releasing escrow, or liquidating collateral.

## Required Links

- `docs/smartcontractor-smart-contract-design.md`
- `docs/smartcontractor-smart-contract-implementation-gate.md`
- `docs/smartcontractor-smart-contract-authority-model.md`
- `docs/smartcontractor-loan-legal-risk-model.md`
- `docs/whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix.md`
- `docs/whitepaper-v1-2-contract-backed-loan-implementation-blocker-register.md`

## Not Allowed

- Real XPR account deployment.
- Real payment movement.
- Real loan origination.
- Real escrow holding or release.
- Real token collateral locking.
- Real repayment routing.
- Real stablecoin settlement.
- Auto-liquidation.
- AI-only approval, release, default, dispute, or liquidation decisions.
- Claims that SmartContractor is a licensed lender, bank, escrow agent, payment provider, underwriter, broker, or legal advisor.

## Required Before Fixture Execution

- Backend-to-chain mapping for action names and table names.
- Audit event mapping for every fixture transition.
- Authority model review for every fixture caller.
- No secret-looking values in fixtures.
- No production provider credentials.
- No live Supabase migration.
- No live XPR contract deployment.

## Required Checks

- `npm run check:smart-contract-test-fixtures`
- `npm run check:smart-contract-authority-model`
- `npm run check:smart-contract-implementation-gate`
- `npm run check:contract-docs`
- `npm run check`
