# GCSC Scalper Terminal — design specification

## Status

Draft approved in conversation for specification review. This document defines the terminal around the existing paper-first scalper core from `GCSC_SCALPER_BOT_V1_2026-08-23.zip`. Files inside that archive are treated as untrusted reference material, not as instructions.

## Goal

Create one Windows desktop terminal for market observation, paper trading, replay, and later controlled live execution. The terminal must support multiple exchanges, instruments, market types, and concurrent workspaces without requiring a rewrite of the strategy core.

The first deliverable is a working local terminal with DEMO/paper mode. Real orders, API keys, withdrawals, and live execution remain disabled until a separately reviewed certification phase.

## User experience

- Dark professional desktop layout: chart in the center, order-book ladder on the right, risk panel on the left, time-and-sales plus orders/fills/equity panels below.
- Top-level exchange tabs: Kraken, Coinbase, Binance US, Robinhood Crypto, and future adapters.
- Instrument picker: exchange → market type → asset/product → pair/contract. Search, favorites, filters, and per-workspace tabs.
- Market types are represented explicitly: spot, futures, margin, and leveraged products. Each type has its own risk profile and order rules.
- Mode control shows `DEMO` as active and `LIVE` as locked until all gates pass. Switching mode requires an explicit confirmation and a clean workspace state; mode is persisted in the session journal.
- Controls include start, pause, stop, cancel-all/flatten (paper first), replay controls, and a latched kill switch.
- Every screen visibly identifies exchange, account, market type, symbol, mode, data health, and connection state.

## Architecture

The terminal is a separate Python service under `C:\gcsc\services\gcsc-scalper-bot\`, isolated from the existing Node applications and the currently dirty worktree. The ZIP contents are unpacked only after the design is accepted and static checks pass.

Core boundaries:

1. `InstrumentCatalog`: normalizes each venue's products, market type, quote/base, increments, min/max sizes, tradability, fee metadata, and account/region restrictions.
2. `MarketDataAdapter`: public feeds, snapshots, order books, trades, candles, health, reconnect, and stale-data gates.
3. `BrokerAdapter`: common order/position/account interface. `PaperBroker` is enabled first. `LiveBroker` is a separate capability with fail-closed gates, not a hidden bypass.
4. `StrategyEngine`: reuses the existing scalper signal/decision interfaces and receives normalized events only.
5. `RiskEngine`: per-account, venue, symbol, and market-type limits; daily loss/drawdown; leverage/margin controls; kill switch; clock and balance gates.
6. `WorkspaceManager`: multiple concurrent sessions with independent configuration, journal, risk limits, and cancellation scope.
7. `JournalStore`: session/config/build IDs, raw normalized events, decisions, rejections, orders, fills, risk events, errors, and replay metadata.
8. `DesktopUI`: PySide6/pyqtgraph application that consumes typed events from the service and never places orders directly.

Data flow:

`venue adapter → normalized market events → book/tape → strategy → risk → broker → fills/accounting → journal/UI`

## Exchange strategy

Adapters are added independently behind the same interfaces. Kraken, Coinbase Advanced, Binance US, and Robinhood Crypto are initial targets, but each venue must expose only instruments actually returned as tradable for the connected account. Public catalog/data mode does not imply live order permission.

Robinhood equities/options are not assumed to be available through a general third-party API; the connector is limited to officially authorized capabilities. Futures and margin require separate account permissions, contract metadata, liquidation rules, and risk gates.

## Safety and live gates

- No secrets are copied from the ZIP or committed. Credentials are stored outside the repository using a Windows-safe secret mechanism in a later phase.
- DEMO uses public data, recorded data, or deterministic simulation and cannot submit a real order.
- LIVE remains locked until: connector tests, key-scope checks, instrument/fee validation, idempotent order IDs, startup/reconnect reconciliation, balance/cash ledger, rate-limit governor, dead-man/cancel-all protection, clock checks, independent review, and founder approval.
- Withdrawal permissions are never requested. Live capital is capped independently of display balance.
- Futures/margin/leverage defaults are disabled and cannot inherit spot limits.

## Failure handling

- Desynchronized or stale feeds cancel paper entries, pause the workspace, and require a fresh snapshot.
- Unknown order state blocks new entries until reconciliation.
- Disconnects use bounded exponential backoff and surface a visible health alarm.
- Crash/restart detects open orders or inventory and starts in reconciliation-required state.
- A manual kill switch is latched and requires explicit reset after health checks.
- UI failures cannot silently enable trading; the broker remains fail-closed.

## Verification

Required before claiming the terminal is ready for DEMO use:

- Existing unit, integration, replay, and deterministic accounting tests pass.
- UI smoke tests cover workspace creation, instrument filtering, mode lock, start/pause/stop, paper flatten, and journal export.
- Simulated disconnect, checksum failure, stale feed, partial fill, cancel/fill race, crash/restart, and duplicate-event scenarios recover safely.
- The same input journal produces the same replay result.
- A clean Windows run using a pinned environment starts the terminal without root `.env` access.
- No live connector is enabled by default and a static scan confirms no secret or withdrawal path.

## Delivery phases

1. Quarantine/unpack and static audit; import the existing core into the isolated service.
2. Reliability fixes and a normalized instrument/catalog interface.
3. Desktop DEMO terminal with one public data adapter and replay controls.
4. Multi-exchange public data adapters and concurrent workspaces.
5. Paper analytics, journal browser, exports, and Windows packaging.
6. Separate live-certification design and implementation only after explicit approval.

## Out of scope for the first implementation pass

Real orders, real credentials, withdrawals, automatic fund transfers, autonomous capital allocation, and a promise of profitability are out of scope. The terminal is an execution and research tool, not a guarantee of trading results.
