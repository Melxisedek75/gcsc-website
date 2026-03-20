# GCSC Meme & Incentive Contracts

Three smart contracts for GCSC Builder meme token, weekly lottery, and social-media bounty system. Deployed on **XPR Network testnet**.

## Accounts & Contracts

| Contract File | Account | Purpose |
|---|---|---|
| `gcscbuild11.contract.ts` | `gcscbuild11` | GCSCBLD meme token (4 dec, 1 Trillion max) |
| `gcscticket1.contract.ts` | `gcscticket1` | Lottery NFT tickets — 1M GCSCBLD = 1 ticket, weekly draws |
| `gcscbounty1.contract.ts` | `gcscbounty1` | Social-media bounty — earn GCSCBLD for promotion |

## Token Details

| Field | Value |
|---|---|
| Name | GCSC Builder |
| Symbol | `GCSCBLD` |
| Precision | 4 |
| Max Supply | 1,000,000,000,000.0000 (1 Trillion) |

## Lottery Flow

1. User transfers `N × 1,000,000.0000 GCSCBLD` to `gcscticket1`
2. Contract auto-mints `N` ticket NFTs to the sender
3. Admin calls `draw()` weekly — picks 3 winners by deterministic seed
4. Prize split: **50%** (1st) / **30%** (2nd) / **20%** (3rd) in GCSC + USDT
5. Winners call `claimprize(ticket_id)` to collect

## Bounty Flow

1. Admin creates campaigns via `createcamp()`
2. Admin funds campaigns via `fundcamp()`  
3. Users submit social-media proof via `submit(campaign_id, proof_url)`
4. Compliance Agent calls `verify()` or `reject()`
5. Approved users call `claim()` to receive GCSCBLD

## Build

```bash
npm install
npm run build            # compiles all 3 contracts
npm run build:token      # gcscbuild11 only
npm run build:lottery    # gcscticket1 only
npm run build:bounty     # gcscbounty1 only
```

## Deploy (XPR Testnet)

```bash
proton contract:set gcscbuild11 build/gcscbuild11
proton contract:set gcscticket1 build/gcscticket1
proton contract:set gcscbounty1 build/gcscbounty1
```
