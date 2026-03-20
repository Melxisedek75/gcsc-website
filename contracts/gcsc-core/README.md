# GCSC Core Contracts

Seven smart contracts forming the GCSC DAO protocol backbone, compiled with **proton-tsc** and deployed on **XPR Network testnet**.

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

## Build

```bash
npm install
npm run build          # compiles all 7 contracts
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
```
