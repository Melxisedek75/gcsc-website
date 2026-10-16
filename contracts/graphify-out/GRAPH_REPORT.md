# Graph Report - C:\gcsc\contracts  (2026-07-15)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 874 nodes · 1321 edges · 30 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1c9de3af`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- devDependencies
- gcscinsure11
- gcscrow1111
- gcscrow1111
- gcsctreasry1
- gcscrealty11
- devDependencies
- gcscadvance1
- gcsccredit11
- gcscworkcap1
- gcscworkcap1
- gcsclead1111
- gcscbounty1
- gcscclaim111
- gcscmember11
- gcscstake111
- scripts
- gcscrow1111.test.ts
- compilerOptions
- compilerOptions
- gcscticket1
- gcscadvance1.test.ts
- gcsccredit11.test.ts
- gcscworkcap1.test.ts
- gcscclaim111.test.ts
- gcsctoken111
- gcsctoken111
- gcscbuild11
- gcscstable11
- gcscstable11.contract.ts

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `compilerOptions` - 18 edges
3. `gcscstable11` - 17 edges
4. `scripts` - 17 edges
5. `gcscrow1111` - 16 edges
6. `gcscrow1111` - 16 edges
7. `gcscadvance1` - 15 edges
8. `gcsccredit11` - 15 edges
9. `gcscworkcap1` - 15 edges
10. `gcscworkcap1` - 15 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (30 total, 0 thin omitted)

### Community 0 - "devDependencies"
Cohesion: 0.04
Nodes (48): dependencies, proton-tsc, devDependencies, chai, cross-env, cross-fetch, globby, @greymass/abi2core (+40 more)

### Community 1 - "gcscinsure11"
Cohesion: 0.09
Nodes (14): Claim, Config, gcscinsure11, InsurancePool, InsuranceProduct, Policy, sendTransfer(), Transfer (+6 more)

### Community 2 - "gcscrow1111"
Cohesion: 0.10
Nodes (13): Config, Escrow, gcscrow1111, Milestone, sendTransfer(), TOKEN_CONTRACT, Transfer, action (+5 more)

### Community 3 - "gcscrow1111"
Cohesion: 0.10
Nodes (13): Config, Escrow, gcscrow1111, Milestone, sendTransfer(), TOKEN_CONTRACT, Transfer, action (+5 more)

### Community 4 - "gcsctreasry1"
Cohesion: 0.09
Nodes (14): Approval, Budget, Config, Expense, gcsctreasry1, Leader, sendTransfer(), Transfer (+6 more)

### Community 5 - "gcscrealty11"
Cohesion: 0.11
Nodes (13): Config, gcscrealty11, Investment, Property, sendTransfer(), STATUS_LISTING(), Transfer, action (+5 more)

### Community 6 - "devDependencies"
Cohesion: 0.06
Nodes (35): devDependencies, chai, cross-env, cross-fetch, globby, @greymass/abi2core, @greymass/eosio, mocha (+27 more)

### Community 7 - "gcscadvance1"
Cohesion: 0.11
Nodes (10): AdvanceRequest, Config, gcscadvance1, StateGate, action, contract, primary, secondary (+2 more)

### Community 8 - "gcsccredit11"
Cohesion: 0.11
Nodes (10): Config, CreditRequest, gcsccredit11, StateGate, action, contract, primary, secondary (+2 more)

### Community 9 - "gcscworkcap1"
Cohesion: 0.11
Nodes (10): Config, gcscworkcap1, StateGate, action, contract, primary, secondary, table (+2 more)

### Community 10 - "gcscworkcap1"
Cohesion: 0.11
Nodes (10): Config, gcscworkcap1, StateGate, action, contract, primary, secondary, table (+2 more)

### Community 11 - "gcsclead1111"
Cohesion: 0.11
Nodes (10): Config, gcsclead1111, Leader, Proposal, action, contract, primary, secondary (+2 more)

### Community 12 - "gcscbounty1"
Cohesion: 0.10
Nodes (12): BountyConfig, Campaign, gcscbounty1, PendingReward, sendTransfer(), Submission, Transfer, action (+4 more)

### Community 13 - "gcscclaim111"
Cohesion: 0.12
Nodes (9): ClaimAdvance, Config, gcscclaim111, StateGate, action, contract, primary, secondary (+1 more)

### Community 14 - "gcscmember11"
Cohesion: 0.13
Nodes (11): Config, gcscmember11, Member, sendTransfer(), Transfer, action, contract, packer (+3 more)

### Community 15 - "gcscstake111"
Cohesion: 0.14
Nodes (11): Config, gcscstake111, RewardPool, sendTransfer(), Stake, Transfer, action, contract (+3 more)

### Community 16 - "scripts"
Cohesion: 0.07
Nodes (27): dependencies, proton-tsc, engines, node, npm, engineStrict, proton-tsc, license (+19 more)

### Community 17 - "gcscrow1111.test.ts"
Cohesion: 0.09
Nodes (20): addMilestone(), { Asset, Name }, {
    Blockchain,
    nameToBigInt,
    protonAssert,
    symbolCodeToBigInt,
}, buildArtifacts(), cleanGenerated(), CORE_DIR, createEscrow(), createFundedEscrowWithMilestone() (+12 more)

### Community 18 - "compilerOptions"
Cohesion: 0.08
Nodes (25): compilerOptions, allowJs, alwaysStrict, baseUrl, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, module (+17 more)

### Community 19 - "compilerOptions"
Cohesion: 0.08
Nodes (25): compilerOptions, allowJs, alwaysStrict, baseUrl, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, module (+17 more)

### Community 20 - "gcscticket1"
Cohesion: 0.12
Nodes (11): Draw, gcscticket1, LotteryConfig, sendTransfer(), Ticket, Transfer, action, contract (+3 more)

### Community 21 - "gcscadvance1.test.ts"
Cohesion: 0.10
Nodes (15): ADVANCE_DIR, { Asset, Name }, { Blockchain, protonAssert }, buildArtifacts(), cleanGenerated(), CORE_DIR, { execFileSync }, { expect } (+7 more)

### Community 22 - "gcsccredit11.test.ts"
Cohesion: 0.11
Nodes (14): { Blockchain, protonAssert }, buildArtifacts(), cleanGenerated(), CORE_DIR, CREDIT_DIR, { execFileSync }, { expect }, findArtifact() (+6 more)

### Community 23 - "gcscworkcap1.test.ts"
Cohesion: 0.11
Nodes (14): { Blockchain, protonAssert }, buildArtifacts(), cleanGenerated(), CORE_DIR, { execFileSync }, { expect }, findArtifact(), fs (+6 more)

### Community 24 - "gcscclaim111.test.ts"
Cohesion: 0.11
Nodes (14): { Blockchain, protonAssert }, buildArtifacts(), CLAIM_DIR, cleanGenerated(), CORE_DIR, { execFileSync }, { expect }, findArtifact() (+6 more)

### Community 25 - "gcsctoken111"
Cohesion: 0.16
Nodes (7): Account, CurrencyStats, gcsctoken111, action, contract, primary, table

### Community 26 - "gcsctoken111"
Cohesion: 0.16
Nodes (7): Account, CurrencyStats, gcsctoken111, action, contract, primary, table

### Community 27 - "gcscbuild11"
Cohesion: 0.16
Nodes (7): Account, CurrencyStats, gcscbuild11, action, contract, primary, table

### Community 28 - "gcscstable11"
Cohesion: 0.24
Nodes (3): gcscstable11, action, contract

### Community 29 - "gcscstable11.contract.ts"
Cohesion: 0.19
Nodes (6): Account, CurrencyStats, Minter, Reserve, primary, table

## Knowledge Gaps
- **159 isolated node(s):** `TOKEN_CONTRACT`, `name`, `version`, `license`, `build:token` (+154 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `scripts`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `TOKEN_CONTRACT`, `name`, `version` to the rest of the system?**
  _159 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._
- **Should `gcscinsure11` be split into smaller, more focused modules?**
  _Cohesion score 0.08859357696567 - nodes in this community are weakly interconnected._
- **Should `gcscrow1111` be split into smaller, more focused modules?**
  _Cohesion score 0.10121457489878542 - nodes in this community are weakly interconnected._
- **Should `gcscrow1111` be split into smaller, more focused modules?**
  _Cohesion score 0.10121457489878542 - nodes in this community are weakly interconnected._
- **Should `gcsctreasry1` be split into smaller, more focused modules?**
  _Cohesion score 0.09246088193456614 - nodes in this community are weakly interconnected._