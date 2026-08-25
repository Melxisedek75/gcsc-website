# GCSC Scalper Terminal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an isolated Windows desktop DEMO/paper/replay terminal around the existing scalper core, with normalized multi-exchange instruments, concurrent workspaces, charts/order book/risk panels, and a permanently fail-closed LIVE capability.

**Architecture:** The service lives at `C:\gcsc\services\gcsc-scalper-bot\`. Typed domain modules separate catalogs, market data, paper brokerage, risk, workspaces, journal, and PySide6 UI. Exchange adapters emit normalized events; only the broker boundary can change orders, and the first release exposes `PaperBroker` only.

**Tech Stack:** Python 3.13+ (archive-compatible with >=3.12), PySide6, pyqtgraph, Pydantic, PyYAML, websockets, SQLite, pytest/pytest-asyncio, PyInstaller, PowerShell.

---

## Scope boundary

This plan delivers a working local terminal with DEMO/paper/replay features. It creates interfaces and visible locked states for LIVE, futures, margin, leverage, and target venues, but it does not add real order placement, credentials, withdrawals, or autonomous capital movement. Those require a separate live-certification plan after independent review and founder approval.

## File map

- `services/gcsc-scalper-bot/pyproject.toml`: isolated package and pinned dependencies.
- `services/gcsc-scalper-bot/src/scalper/catalog/`: normalized venues and instruments.
- `services/gcsc-scalper-bot/src/scalper/terminal/`: commands, events, workspaces, modes, replay.
- `services/gcsc-scalper-bot/src/scalper/ui/`: PySide6 window and panels.
- `services/gcsc-scalper-bot/src/scalper/exchanges/`: public data adapters and locked live descriptors.
- `services/gcsc-scalper-bot/tests/`: imported tests plus catalog, controller, UI, and failure tests.
- `services/gcsc-scalper-bot/scripts/setup.ps1`: isolated venv and offline verification.
- `services/gcsc-scalper-bot/scripts/run-terminal.ps1`: DEMO launcher.
- `services/gcsc-scalper-bot/config/terminal-demo.yaml`: safe defaults with no credentials.

### Task 1: Quarantine and import the existing core

**Files:** create `services/gcsc-scalper-bot/` from the validated ZIP; create its `.gitignore`; add `tests/test_archive_manifest.py`.

- [ ] Write a manifest test that rejects absolute paths, `..` segments, symlinks, nested archives, and files outside `src`, `tests`, `scripts`, `config`, `docs`, and root metadata.
- [ ] Verify the ZIP SHA-256 before extraction. Expected: `B184E5BD990455BF233548C6763CBAF81BB18CF16CD6CB5FB464A88B81654287`.
- [ ] Extract directly into `C:\gcsc\services\gcsc-scalper-bot`, never into `construction-ai`, `_collected`, or the repository root; do not execute source files.
- [ ] Add local ignores for `.venv/`, `.env*`, `data/`, `*.db`, `*.jsonl`, `*.gz`, caches, `*.egg-info/`, and `dist/`.
- [ ] Run `py -3.13 -m pytest services/gcsc-scalper-bot/tests/test_archive_manifest.py -q` and commit with `git add -- services/gcsc-scalper-bot` followed by `git commit -m "Import scalper paper core into isolated service"`.

### Task 2: Add fail-closed modes and DEMO configuration

**Files:** create `src/scalper/terminal/mode.py`, `tests/terminal/test_mode.py`, and `config/terminal-demo.yaml`; modify `pyproject.toml`.

- [ ] Write failing tests for DEMO default, LIVE gate rejection, and mode-change rejection with open orders/inventory.
- [ ] Implement `TradingMode.DEMO`, `TradingMode.LIVE_LOCKED`, `MarketType.SPOT/FUTURES/MARGIN/LEVERAGED`, and `CapabilityGate` reason codes.
- [ ] Set paper mode, no keys, no leverage, $100 demo capital, and conservative loss limits. Load only service-local configuration.
- [ ] Run `py -3.13 -m pytest services/gcsc-scalper-bot/tests/terminal/test_mode.py -q`; commit the mode model.

### Task 3: Normalize instrument catalogs

**Files:** create `src/scalper/catalog/models.py`, `service.py`, `static_demo.py`, and `tests/catalog/test_catalog.py`.

- [ ] Test normalized IDs, venue/market-type filters, tradability, increments, min/max size, favorites, sorting, and unsupported products.
- [ ] Implement immutable Pydantic `Venue`, `Instrument`, `OrderConstraints`, `FeeSchedule`, and explicit trading statuses.
- [ ] Implement `list_instruments(venue=None, market_type=None, query="", tradable_only=False)`, `get(instrument_id)`, and favorites.
- [ ] Include representative DEMO products for spot/futures/margin/leverage without claiming live availability; run catalog tests and commit.

### Task 4: Add public adapter boundaries

**Files:** create `src/scalper/exchanges/adapter_contracts.py`, `catalog_sources.py`, `coinbase.py`, `robinhood_crypto.py`; modify `kraken.py` and `binance_us.py`; add `tests/exchanges/test_adapter_contracts.py`.

- [ ] Test normalized product metadata, public book/trade events, health, bounded reconnect, and absence of DEMO order submission.
- [ ] Implement `PublicMarketDataAdapter`, `CatalogSource`, `ConnectionHealth`, and `LockedLiveCapability`; locked capabilities return structured reasons and have no order method.
- [ ] Preserve Kraken checksum/Decimal handling and emit explicit stale/desync events. Add read-only catalog/data shells for Coinbase, Binance US, and Robinhood Crypto using injected clients; never read credentials.
- [ ] Run exchange tests and commit the adapter boundaries.

### Task 5: Add concurrent paper workspaces

**Files:** create `src/scalper/terminal/events.py`, `commands.py`, `workspace.py`, `src/scalper/execution/paper_broker.py`, and `tests/terminal/test_workspace.py`.

- [ ] Test workspace creation, start/pause/stop, paper flatten, concurrent isolation, cancellation scope, and mode lock.
- [ ] Define commands `CreateWorkspace`, `SelectInstrument`, `Start`, `Pause`, `Stop`, `FlattenPaper`, `SetMode`, `ToggleFavorite` and events for state, snapshots, orders, risk, and journal.
- [ ] Adapt the simulator/ledger behind `PaperBroker.submit/cancel/flatten/snapshot`; attach session/workspace IDs.
- [ ] Give each workspace its own adapter task, strategy session, broker, risk manager, and cancellation token; run tests and commit.

### Task 6: Build the professional PySide6 UI

**Files:** create `src/scalper/ui/main_window.py`, `theme.py`, `catalog_dialog.py`, `app.py`, panel modules for chart, order book, risk, orders, tape, and P&L, plus `tests/ui/test_ui_models.py`.

- [ ] Test DEMO/LIVE display state, catalog filtering, formatting, book colors, disabled LIVE action, and event-to-panel updates headlessly.
- [ ] Implement dark layout: top venue tabs and mode banner; left risk panel; central pyqtgraph chart; right ladder; bottom tape/orders/fills/P&L; red `FLATTEN ALL` sends only `FlattenPaper` in DEMO.
- [ ] Implement exchange/market-type/search/favorites/tradable-only catalog selection and explicit locked reasons.
- [ ] Wire controller events through bounded Qt signals/slots so disconnect/replay does not freeze the UI. Run UI tests and `py -3.13 -c "from scalper.ui.app import build_app; print('ui-import-ok')"`; commit.

### Task 7: Add journals and replay controls

**Files:** modify `src/scalper/storage/sqlite.py` and `journal.py`; create `src/scalper/terminal/session_manifest.py`, `replay_controller.py`, and tests for both.

- [ ] Test session/config/build IDs, decisions/rejections/risk events, crash markers, clean shutdown, export, replay bounds, pause, and deterministic rerun.
- [ ] Persist runtime data only under `%LOCALAPPDATA%\\GCSCScalper`; store config hash/app version and never read the root `.env`.
- [ ] Implement replay file/range/speed/play/pause/stop and progress events. Run storage/replay tests and commit.

### Task 8: Add Windows setup, launcher, and packaging

**Files:** create `scripts/setup.ps1`, `run-terminal.ps1`, `verify-terminal.ps1`, `docs/windows-setup.md`, `tests/test_launch_config.py`; modify `pyproject.toml`.

- [ ] Test explicit Python selection, DEMO config passing, missing-config failure, and root `.env` isolation.
- [ ] Make `setup.ps1` create `.venv`, install pinned service dependencies, and run offline tests. Make `run-terminal.ps1` resolve its own root, select `.venv\\Scripts\\python.exe`, pass `config/terminal-demo.yaml`, and fail if `LIVE_TRADING=true`.
- [ ] Make `verify-terminal.ps1` run tests, compile checks, secret scan, and UI import; configure PyInstaller one-folder output and `%LOCALAPPDATA%` data paths.
- [ ] Run verification and commit the Windows delivery scripts.

### Task 9: End-to-end paper verification and handoff

**Files:** create `tests/integration/test_terminal_flow.py`, `docs/terminal-user-guide.md`, and `docs/adapter-status.md`.

- [ ] Test a deterministic fake feed through select pair → start DEMO → book/trade → paper fill → pause → flatten → export → restart.
- [ ] Run from `C:\gcsc\services\gcsc-scalper-bot`: `..\.venv\Scripts\python.exe -m pytest -q` and `..\.venv\Scripts\python.exe -m compileall -q src scripts tests`; expect no network or keys required.
- [ ] Manually confirm DEMO banner, catalog filters, two isolated workspaces, paper flatten, journal export, and locked LIVE.
- [ ] Document that live routing, authenticated reconciliation, and venue-specific futures/margin/leverage execution remain locked; commit the verified handoff.

## Plan self-review

- Spec coverage: UI, catalogs, multi-venue boundaries, market types, concurrent workspaces, DEMO/LIVE gates, failure handling, persistence, Windows delivery, and verification each map to a task.
- Placeholder scan: no `TBD`, `TODO`, or unassigned step appears in this plan.
- Type consistency: modes and market types precede catalog, adapters, controller, broker, and UI consumers.
- Safety consistency: no task enables real order placement or reads credentials; LIVE remains locked pending a new approved plan.
