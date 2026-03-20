# GCSC — Global Construction Smart Contract

> A decentralised construction ecosystem built on **XPR Network**, powered by AI agents, on-chain governance, and a full suite of smart contracts.

[![XPR Network](https://img.shields.io/badge/Chain-XPR%20Network-blue)](https://xprnetwork.org)
[![Testnet](https://img.shields.io/badge/Network-Testnet-orange)](https://testnet.xprnetwork.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Contracts](https://img.shields.io/badge/Contracts-10-brightgreen)](#smart-contracts)

---

## Table of Contents

- [Overview](#overview)
- [Smart Contracts](#smart-contracts)
  - [Core Protocol (gcsc-core)](#core-protocol--gcsc-core)
  - [Meme & Incentive Layer (gcsc-meme)](#meme--incentive-layer--gcsc-meme)
- [Repository Structure](#repository-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Deployed Addresses](#deployed-addresses-xpr-testnet)
- [Contract Architecture](#contract-architecture)
- [Contributing](#contributing)

---

## Overview

GCSC is a full-stack decentralised autonomous organisation (DAO) for the global construction industry. It combines:

- **On-chain token economics** — GCSC utility token + GCSCBLD meme/reward token
- **DAO governance** — membership tiers, leadership councils, multi-sig treasury
- **Real-world asset tokenisation** — fractional property & construction project NFTs
- **DeFi primitives** — staking (12% APY), insurance pools, on-chain claim processing
- **Incentive mechanics** — weekly lottery, social-media bounty campaigns
- **AI agent compliance** — automated verification of bounty submissions

---

## Smart Contracts

### Core Protocol — `gcsc-core`

Seven production contracts deployed to XPR Network testnet. Source: [`contracts/gcsc-core/`](contracts/gcsc-core/)

| Contract | Account | Symbol | Description |
|---|---|---|---|
| `gcsctoken111.contract.ts` | `gcsctoken111` | `GCSC` | Utility token — 1B max supply, 4 decimals |
| `gcscmember11.contract.ts` | `gcscmember11` | — | DAO membership tiers, on-chain profiles, KYC flags |
| `gcsclead1111.contract.ts` | `gcsclead1111` | — | Leadership council, proposal voting, multi-sig governance |
| `gcscstake111.contract.ts` | `gcscstake111` | — | Staking — 12% APY, 30-day lock, inline reward distribution |
| `gcsctreasry1.contract.ts` | `gcsctreasry1` | — | Multi-sig treasury — fund requests, threshold approvals |
| `gcscrealty11.contract.ts` | `gcscrealty11` | — | Real-estate tokenisation — fractional NFTs, investment tracking |
| `gcscinsure11.contract.ts` | `gcscinsure11` | — | Insurance — Health / Life / Property / General policies & claims |

**Initialised on-chain:**
- GCSC token created: `1,000,000,000.0000 GCSC` max supply
- `100,000,000 GCSC` minted to `gcscstake111` reward pool
- Insurance products configured: 4 types, reserve ratio 20%
- Staking: 12% APY, 100 GCSC minimum, 30-day lock

---

### Meme & Incentive Layer — `gcsc-meme`

Three contracts for viral growth and community incentives. Source: [`contracts/gcsc-meme/`](contracts/gcsc-meme/)

| Contract | Account | Symbol | Description |
|---|---|---|---|
| `gcscbuild11.contract.ts` | `gcscbuild11` | `GCSCBLD` | Meme token — 1 Trillion max supply, 4 decimals |
| `gcscticket1.contract.ts` | `gcscticket1` | — | Lottery — 1M GCSCBLD = 1 weekly ticket NFT |
| `gcscbounty1.contract.ts` | `gcscbounty1` | — | Bounty — earn GCSCBLD for social media promotion |

**Initialised on-chain:**
- `800,000,000,000 GCSCBLD` minted (200B to bounty pool, 100B to lottery reserve)
- Lottery configured: weekly draws, 3 winners (50/30/20% split), prizes in GCSC + USDT
- 3 active bounty campaigns: Twitter (500 GCSCBLD), Reddit (1K GCSCBLD), YouTube (5K GCSCBLD)

---

## Repository Structure

```
gcsc-website/
├── contracts/
│   ├── gcsc-core/                      # Core GCSC protocol (7 contracts)
│   │   ├── gcsctoken111.contract.ts    # GCSC Utility Token
│   │   ├── gcscmember11.contract.ts    # DAO Membership
│   │   ├── gcsclead1111.contract.ts    # Leadership & Governance
│   │   ├── gcscstake111.contract.ts    # Token Staking
│   │   ├── gcsctreasry1.contract.ts    # Treasury Management
│   │   ├── gcscrealty11.contract.ts    # Real Estate NFTs
│   │   ├── gcscinsure11.contract.ts    # Insurance System
│   │   ├── build/
│   │   │   ├── gcsctoken111/           # *.wasm + *.abi
│   │   │   ├── gcscmember11/
│   │   │   ├── gcsclead1111/
│   │   │   ├── gcscstake111/
│   │   │   ├── gcsctreasry1/
│   │   │   ├── gcscrealty11/
│   │   │   └── gcscinsure11/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── gcsc-meme/                      # Meme + incentive layer (3 contracts)
│       ├── gcscbuild11.contract.ts     # GCSCBLD Meme Token
│       ├── gcscticket1.contract.ts     # Lottery NFT Tickets
│       ├── gcscbounty1.contract.ts     # Social Media Bounty
│       ├── build/
│       │   ├── gcscbuild11/            # *.wasm + *.abi
│       │   ├── gcscticket1/
│       │   └── gcscbounty1/
│       ├── package.json
│       └── tsconfig.json
├── index.html                          # Landing page
├── whitepaper.html                     # GCSC Whitepaper
├── .gitignore
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Blockchain | XPR Network (Antelope / EOSIO protocol) |
| Smart Contracts | [proton-tsc](https://github.com/nicholasgasior/proton-tsc) (AssemblyScript → WASM) |
| Contract CLI | `@proton/cli` — `proton contract:set`, `proton action` |
| Compiler | `proton-asc` — compiles `.contract.ts` → `.wasm` + `.abi` |
| Testnet Endpoint | `https://api-xprnetwork-test.saltant.io` |
| Explorer | `https://testnet.explorer.xprnetwork.org` |

---

## Getting Started

### Prerequisites

```bash
node >= 16
npm >= 7
npm install -g @proton/cli
```

### Build Core Contracts

```bash
cd contracts/gcsc-core
npm install
npm run build          # compiles all 7 contracts → build/*/
```

### Build Meme Contracts

```bash
cd contracts/gcsc-meme
npm install
npm run build          # compiles all 3 contracts → build/*/
```

### Deploy to XPR Testnet

```bash
# Core
proton contract:set gcsctoken111 contracts/gcsc-core/build/gcsctoken111
proton contract:set gcscmember11 contracts/gcsc-core/build/gcscmember11
proton contract:set gcsclead1111 contracts/gcsc-core/build/gcsclead1111
proton contract:set gcscstake111 contracts/gcsc-core/build/gcscstake111
proton contract:set gcsctreasry1 contracts/gcsc-core/build/gcsctreasry1
proton contract:set gcscrealty11 contracts/gcsc-core/build/gcscrealty11
proton contract:set gcscinsure11 contracts/gcsc-core/build/gcscinsure11

# Meme + incentive
proton contract:set gcscbuild11 contracts/gcsc-meme/build/gcscbuild11
proton contract:set gcscticket1 contracts/gcsc-meme/build/gcscticket1
proton contract:set gcscbounty1 contracts/gcsc-meme/build/gcscbounty1
```

---

## Deployed Addresses (XPR Testnet)

| Account | Role | Explorer |
|---|---|---|
| `gcsctoken111` | GCSC Utility Token | [View](https://testnet.explorer.xprnetwork.org/account/gcsctoken111) |
| `gcscmember11` | Membership | [View](https://testnet.explorer.xprnetwork.org/account/gcscmember11) |
| `gcsclead1111` | Leadership DAO | [View](https://testnet.explorer.xprnetwork.org/account/gcsclead1111) |
| `gcscstake111` | Staking | [View](https://testnet.explorer.xprnetwork.org/account/gcscstake111) |
| `gcsctreasry1` | Treasury | [View](https://testnet.explorer.xprnetwork.org/account/gcsctreasry1) |
| `gcscrealty11` | Real Estate NFTs | [View](https://testnet.explorer.xprnetwork.org/account/gcscrealty11) |
| `gcscinsure11` | Insurance | [View](https://testnet.explorer.xprnetwork.org/account/gcscinsure11) |
| `gcscbuild11` | GCSCBLD Meme Token | [View](https://testnet.explorer.xprnetwork.org/account/gcscbuild11) |
| `gcscticket1` | Lottery Tickets | [View](https://testnet.explorer.xprnetwork.org/account/gcscticket1) |
| `gcscbounty1` | Social Bounty | [View](https://testnet.explorer.xprnetwork.org/account/gcscbounty1) |

---

## Contract Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GCSC DAO ECOSYSTEM                       │
├──────────────────────┬──────────────────────────────────────┤
│   CORE PROTOCOL      │     MEME / INCENTIVE LAYER          │
│                      │                                      │
│  gcsctoken111        │  gcscbuild11  (GCSCBLD token)       │
│  ┌─GCSC Token──┐     │  ┌─1 Trillion meme supply──┐        │
│  │ 1B max      │◄────┼──│ Bounty rewards          │        │
│  │ 4 decimals  │     │  │ Lottery fuel            │        │
│  └─────────────┘     │  └──────────────┬──────────┘        │
│         │            │                 │                    │
│  gcscmember11        │  gcscticket1   gcscbounty1          │
│  gcscstake111        │  ┌─Weekly──┐   ┌─Campaigns──┐       │
│  gcsctreasry1        │  │ Lottery │   │ Twitter    │       │
│  gcscrealty11        │  │ 3 prize │   │ YouTube    │       │
│  gcsclead1111        │  │ tiers   │   │ Reddit     │       │
│  gcscinsure11        │  └─────────┘   └────────────┘       │
└──────────────────────┴──────────────────────────────────────┘
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-change`
3. Make your changes and run `npm run build` to verify compilation
4. Commit: `git commit -m "feat: describe your change"`
5. Push and open a Pull Request

Please follow the existing code style — all contracts use **proton-tsc** syntax (AssemblyScript decorators: `@contract`, `@table`, `@action`, `@primary`, `@secondary`).

---

*Built with ❤️ by the GCSC DAO team — [gcscdao@gmail.com](mailto:gcscdao@gmail.com)*
