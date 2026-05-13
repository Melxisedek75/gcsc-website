# SmartContractor Smart Contract Action Register

Status: internal action naming draft only.

This action register does not approve real escrow, does not approve real loans, does not approve token collateral, does not approve production payments, and does not approve live XPR contract deployment.

## Purpose

Define draft action names, table names, and audit event names for future XPR smart contract modules before any code is written or deployed.

The register keeps smart contract naming aligned with SmartContractor project contracts, milestones, contractor credit, repayment waterfalls, disputes, token collateral labels, peer review, authority controls, and no-real-money test fixtures.

## Project Escrow Actions

| Draft action | Draft table | Audit event | Local-only meaning |
|--------------|-------------|-------------|--------------------|
| createproj | projects | contract.project.created | Create a local project contract fixture from an accepted bid |
| addmile | milestones | contract.milestone.added | Add a local milestone fixture to a project |
| submitev | evidence | contract.milestone.evidence_submitted | Attach milestone evidence metadata |
| markreview | reviews | contract.milestone.review_recorded | Record inspector or peer review recommendation |
| pauseproj | pauses | contract.project.paused | Pause milestone release while a dispute or safety review is active |
| resolveproj | disputes | contract.project.dispute_resolved | Record dispute outcome recommendation without moving real funds |

## Loan Ledger Actions

| Draft action | Draft table | Audit event | Local-only meaning |
|--------------|-------------|-------------|--------------------|
| reqloan | loans | loan.request.recorded | Record contractor credit request fixture |
| scoreloan | scores | loan.score.recorded | Record risk score snapshot from backend or RAA fixture |
| offerloan | offers | loan.offer.recorded | Record provider-reviewed offer label, not a real loan approval |
| repayplan | waterfalls | loan.repayment_plan.recorded | Record repayment-first waterfall terms |
| repayevt | repayments | loan.repayment_event.recorded | Record simulated milestone repayment allocation |
| defaultln | defaults | loan.default_label.recorded | Record local default label only |

## Token Collateral Actions

| Draft action | Draft table | Audit event | Local-only meaning |
|--------------|-------------|-------------|--------------------|
| lockdemo | collateral | collateral.demo_lock.recorded | Record demo-only collateral lock label |
| snapprice | prices | collateral.price_snapshot.recorded | Record placeholder oracle snapshot label |
| ltvcheck | ltvchecks | collateral.ltv_check.recorded | Record local LTV label and margin status |
| releasecol | releases | collateral.release_label.recorded | Record demo release label |
| blockliq | safeguards | collateral.liquidation_blocked | Record that auto-liquidation is blocked |

## Peer Review Reward Actions

| Draft action | Draft table | Audit event | Local-only meaning |
|--------------|-------------|-------------|--------------------|
| submitrev | peerreviews | peer.review.submitted | Record peer review score and evidence reference |
| scorerev | repscores | peer.review.score_recorded | Record reputation impact label |
| rewardrev | rewards | peer.review.reward_label.recorded | Record demo reward label without issuing real tokens |
| flagabuse | abuseflags | peer.review.abuse_flagged | Record reviewer abuse or conflict flag |
| pauserev | reviewpauses | peer.review.paused | Pause reward hook while admin review is active |

## Authority And Safety Actions

| Draft action | Draft table | Audit event | Local-only meaning |
|--------------|-------------|-------------|--------------------|
| pausemod | modulepauses | authority.module.paused | Pause a local module fixture |
| unpausemod | modulepauses | authority.module.unpaused | Record stronger approval to resume a local module fixture |
| setauth | authchanges | authority.changed | Record draft authority mapping change |
| setmsig | multisigs | authority.multisig.recorded | Record local multisig threshold label |
| emergstop | emergencystops | authority.emergency_pause.recorded | Record emergency pause without moving funds |

## Naming Rules

- Action names must stay short enough for XPR-style action naming.
- Table names must map back to backend table names or documented local fixture names.
- Audit events must use dotted names with module, object, and past-tense verb.
- Every action must map to a caller role in `docs/smartcontractor-smart-contract-authority-model.md`.
- Every local fixture action must map to a no-real-money scenario in `docs/smartcontractor-smart-contract-test-fixtures.md`.
- No action may imply real loan approval, real escrow release, real repayment routing, real token collateral lock, real stablecoin settlement, or auto-liquidation.

## Required Before Coding

- Backend-to-chain mapping is reviewed.
- Authority model is reviewed.
- Local no-real-money fixtures are reviewed.
- Audit event mapping is reviewed.
- Founder approves exact module scope.
- Legal/provider review confirms public wording and live-risk boundaries.
- Security review confirms action permissions, pause controls, and upgrade boundaries.

## Required Checks

- `npm run check:smart-contract-action-register`
- `npm run check:smart-contract-test-fixtures`
- `npm run check:smart-contract-authority-model`
- `npm run check:smart-contract-implementation-gate`
- `npm run check`
