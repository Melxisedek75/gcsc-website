# GCSC Core Contracts

Core smart contracts forming the GCSC DAO protocol backbone, compiled with **proton-tsc** and deployed on **XPR Network testnet**.

## Accounts & Contracts

| Contract File | Account | Purpose |
|---|---|---|
| `gcsctoken111.contract.ts` | `gcsctoken111` | GCSC utility token (GCSC, 4 dec, 1B max) |
| `gcscmember11.contract.ts` | `gcscmember11` | DAO membership tiers & on-chain profiles |
| `gcsclead1111.contract.ts` | `gcsclead1111` | Leadership & multi-sig governance |
| `gcscstake111.contract.ts` | `gcscstake111` | Token staking — 12% APY, 30-day lock |
| `gcsctreasry1.contract.ts` | `gcsctreasry1` | Multi-sig treasury & fund management |
| `gcscrealty11.contract.ts` | `gcscrealty11` | Real-estate tokenisation & fractional NFTs |
| `gcscinsure11.contract.ts` | `gcscinsure11` | On-chain insurance (Health/Life/Property/General) |
| `gcscrow1111.contract.ts` | `gcscrow1111` | Milestone escrow for homeowner-funded construction projects |
| `gcscstable11.contract.ts` | `gcscstable11` | GCST stablecoin accounting contract |
| `gcscadvance1.contract.ts` | `gcscadvance1` | Demo/MVP gate for escrow-backed contractor advance requests |

## gcscadvance1 Safety Scope

`gcscadvance1` records contractor advance requests against funded escrow references. It is intentionally limited to demo/MVP coordination:

- No token transfers.
- No live loan issuance.
- No repayment routing.
- No liquidation.
- No insurance claim handling.
- State availability must be explicitly enabled by admin/legal review hash.
- Contractor verification must be explicitly recorded before request.
- Requested and approved amounts are capped by the smallest of:
  - 20% of escrow amount
  - 50% of milestone amount
  - configured risk limit

This module is a guard rail and audit trail for future legal/provider review, not a production real-money credit product.

## Build

```bash
npm install
npm run build          # compiles all core contracts
```

Individual contracts:
```bash
npm run build:token    # gcsctoken111
npm run build:member   # gcscmember11
npm run build:lead     # gcsclead1111
npm run build:stake    # gcscstake111
npm run build:treasury # gcsctreasry1
npm run build:realty   # gcscrealty11
npm run build:insure   # gcscinsure11
npm run build:escrow   # gcscrow1111
npm run build:stable   # gcscstable11
npm run build:advance  # gcscadvance1
```

## Deploy (XPR Testnet)

```bash
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
```
