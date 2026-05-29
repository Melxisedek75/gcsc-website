# GCSC Core Contract Deployment Readiness

Date: 2026-05-29

Scope: deployment readiness record for `contracts/gcsc-core` smart contracts. This document does not approve mainnet launch or real-money operation. It records build/test status, expected accounts, permissions, transfer notifications, and remaining deployment blockers.

## Local Verification Evidence

Repository:

```text
C:\gcsc-website
```

Branch and commit inspected:

```text
main
f2a96ad feat: add contract backed working capital gate
```

Commands run from `contracts/gcsc-core`:

```powershell
npm install --package-lock=false
npm run build
npm test
```

Results:

- `npm run build`: passed.
- Contracts compiled by `proton-asc`: 13.
- `npm test`: passed.
- Test count: 31 passing.

Warnings recorded:

- `npm install` reported 27 dependency vulnerabilities: 11 low, 8 moderate, 7 high, 1 critical.
- Build emitted Node deprecation warnings from the current `assemblyscript` dependency path.
- Test emitted a Node `punycode` deprecation warning.

No automatic dependency upgrade was applied because `proton-tsc`, `@proton/vert`, and AssemblyScript versions are sensitive contract toolchain dependencies. Dependency remediation must be handled as a controlled compatibility task.

## Contract Accounts

| Contract | Account | Purpose | Current readiness |
|---|---|---|---|
| `gcsctoken111.contract.ts` | `gcsctoken111` | GCSC utility token | Builds locally |
| `gcscmember11.contract.ts` | `gcscmember11` | DAO membership tiers and member profiles | Builds locally |
| `gcsclead1111.contract.ts` | `gcsclead1111` | Leadership DAO governance | Builds locally |
| `gcscstake111.contract.ts` | `gcscstake111` | GCSC staking | Builds locally |
| `gcsctreasry1.contract.ts` | `gcsctreasry1` | Treasury budgets, approvals, expenses | Builds locally |
| `gcscrealty11.contract.ts` | `gcscrealty11` | Real estate DAO coordination | Builds locally |
| `gcscinsure11.contract.ts` | `gcscinsure11` | Insurance policy and claim coordination | Builds locally |
| `gcscrow1111.contract.ts` | `gcscrow1111` | Milestone escrow | Builds and tests locally |
| `gcscstable11.contract.ts` | `gcscstable11` | GCST stablecoin accounting | Builds locally |
| `gcscadvance1.contract.ts` | `gcscadvance1` | Escrow-backed contractor advance demo gate | Builds and tests locally |
| `gcsccredit11.contract.ts` | `gcsccredit11` | Token-collateral equipment credit demo gate | Builds and tests locally |
| `gcscclaim111.contract.ts` | `gcscclaim111` | ClaimBridge emergency advance demo gate | Builds and tests locally |
| `gcscworkcap1.contract.ts` | `gcscworkcap1` | Contract-backed working capital demo gate | Builds and tests locally |

## Test Coverage Present

`npm test` currently covers:

- `gcscrow1111` milestone escrow:
  - create escrow;
  - fund escrow via token transfer with `project_id` memo;
  - add milestone before funding;
  - contractor submit;
  - homeowner approve and release;
  - dispute flow;
  - duplicate funding failure;
  - release without approval failure.
- `gcscadvance1` demo gate:
  - request, state gate, contractor verification, cap rule, approve, reject.
- `gcsccredit11` demo gate:
  - request, state gate, contractor verification, LTV cap, approve, reject.
- `gcscclaim111` demo gate:
  - request, state gate, payout cap, approve, reject.
- `gcscworkcap1` demo gate:
  - request, state gate, contractor verification, contract advance cap, approve, reject.

Coverage gaps before production:

- Token issue/transfer/open/close regression tests.
- Stablecoin reserve/minter/issue cap tests.
- Governance proposal/vote/execute tests.
- Staking reward and lock-period tests.
- Treasury multi-approval tests.
- Insurance reserve and claim payout tests.
- Real estate investment/income/refund tests.

## Deployment Commands

Expected testnet deployment commands after account ownership is confirmed:

```powershell
proton contract:set gcsctoken111 build/gcsctoken111
proton contract:set gcscmember11 build/gcscmember11
proton contract:set gcsclead1111 build/gcsclead1111
proton contract:set gcscstake111 build/gcscstake111
proton contract:set gcsctreasry1 build/gcsctreasry1
proton contract:set gcscrealty11 build/gcscrealty11
proton contract:set gcscinsure11 build/gcscinsure11
proton contract:set gcscrow1111 build/gcscrow1111
proton contract:set gcscstable11 build/gcscstable11
proton contract:set gcscadvance1 build/gcscadvance1
proton contract:set gcsccredit11 build/gcsccredit11
proton contract:set gcscclaim111 build/gcscclaim111
proton contract:set gcscworkcap1 build/gcscworkcap1
```

Do not run deployment commands until:

- the deployer wallet is confirmed;
- each account exists on the intended network;
- account permissions are reviewed;
- contract build artifacts are freshly generated from the reviewed commit;
- deployment target is explicitly testnet or mainnet;
- founder confirms deployment approval for that network.

## Required Account Permissions

Minimum deployment control:

- Each contract account must be controlled by the founder/deployer permission set.
- Each contract account must have enough CPU/NET/RAM for deployment and runtime table writes.
- Contract `active` permission must allow `set contract`.

Inline transfer contracts:

- `gcscrow1111`
- `gcscinsure11`
- `gcscmember11`
- `gcscrealty11`
- `gcscstake111`
- `gcsctreasry1`

Before using inline transfers in production, confirm the account permission structure supports the intended inline action pattern on XPR Network. Do not grant broad permissions without a dedicated review.

Admin-controlled contracts:

- `gcscadvance1`
- `gcsccredit11`
- `gcscclaim111`
- `gcscworkcap1`
- `gcscmember11`
- `gcsclead1111`
- `gcsctreasry1`

Admin actions must be initialized with founder-controlled admin accounts before any public use.

## Transfer Notify Expectations

`gcsctoken111`:

- Standard token transfer notify action.
- Used by other contracts as the token contract for inline transfer flows.

`gcscstable11`:

- Standard stablecoin transfer notify action for GCST accounting.

`gcscrow1111`:

- Listens for token transfer notification.
- Ignores transfers where `to != this.receiver`.
- Uses memo as `project_id`.
- Funding succeeds only against a matching draft escrow.
- Duplicate funding must fail because the escrow is no longer draft after funding.
- Milestone release uses inline transfer from escrow contract to contractor.

Backend/frontend integration must keep memo format aligned with the contract:

```text
<project_id>
```

## Network Status Checklist

Testnet:

- [ ] Confirm each account exists on XPR testnet explorer.
- [ ] Confirm deployed code hash or last deployment transaction for each account.
- [ ] Confirm `gcscrow1111` transfer notify behavior on testnet.
- [ ] Confirm `gcscstable11` create/reserve/minter/issue behavior on testnet.
- [ ] Confirm finance gate contracts stay demo-only with no token movement.

Mainnet:

- [ ] Do not deploy until legal, security, and founder approvals are complete.
- [ ] Do not enable real-money escrow until signed transaction flow and rollback plan are verified.
- [ ] Do not enable lending, credit, insurance finance, or stablecoin issuance without legal/provider review.

## Deployment Blockers

These blockers must be cleared before pilot or production settlement:

1. Confirm actual deployed testnet status for all accounts through explorer or Proton CLI.
2. Resolve or formally accept current dependency audit findings with a contract toolchain compatibility plan.
3. Add missing regression tests for token, stablecoin, governance, staking, treasury, insurance, and realty modules.
4. Verify `gcscrow1111` account permissions for inline transfer behavior.
5. Create a rollback plan for contract deployment.
6. Record deployment evidence with tx ids after any testnet deployment.

Resolved during readiness work:

- Backend and frontend WebAuth transaction payloads were aligned to contract action names: `submitms`, `approvems`, `releasems`, `disputems`.
- Backend commit: `d83701b fix: align xpr escrow actions with contract`.
- Frontend commit: `356bbae fix: align webauth escrow actions with contract`.

## Go/No-Go Status

Build readiness:

```text
PASS
```

Local test readiness:

```text
PASS
```

Deployment readiness:

```text
BLOCKED
```

Reason:

```text
Contracts compile and covered tests pass locally, but deployed account status, permission structure, dependency audit remediation, missing module regression tests, and deployment rollback/evidence procedures are not yet complete.
```
