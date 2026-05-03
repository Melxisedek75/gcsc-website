# Hooks And Automation Plan

Date: 2026-05-03

## Goal

Create a lightweight automation layer so GCSC keeps moving even when the founder is away.

This document is a plan. Do not enable paid services or external account access without founder approval.

## Local Hooks

### 1. Pre-Commit Safety Hook

Purpose:

- prevent broken JavaScript from being committed;
- reduce secret leakage risk;
- remind Codex to keep commits scoped.

Recommended checks:

```powershell
C:\gcsc\execution\pre-commit-safety.ps1
```

Future checks:

- scan for `SMTP_PASS=`, `service_role`, private keys, seed phrases;
- run API smoke tests;
- run frontend lint/build once a build system exists.

Status:

```text
SCRIPT CREATED: C:\gcsc\execution\pre-commit-safety.ps1
```

### 2. Backend Health Check Hook

Purpose:

- verify local backend is reachable;
- verify `/api/health` lists expected SmartContractor features.

Command:

```powershell
Invoke-WebRequest -Uri "http://localhost:3002/api/health" -UseBasicParsing
```

Status:

```text
READY TO RUN MANUALLY
```

### 3. Email Status Hook

Purpose:

- send important project status to `gcsc@xprnet.org`.

Existing script:

```text
C:\gcsc\execution\send-email.ps1
```

Rules:

- never print SMTP password;
- send only high-signal summaries;
- attach no secrets.

Status:

```text
AVAILABLE
```

## GitHub Actions Plan

### Basic CI

Trigger:

```text
on push and pull_request
```

Checks:

- install construction-ai dependencies;
- run `node -c server.js`;
- check docs links later;
- run frontend build when app build exists.

Status:

```text
PLANNED
```

### Deploy Hook

Possible platforms:

- GitHub Pages for static site;
- Vercel if connector/account works;
- Azure App Service if Microsoft credits are approved;
- Supabase Edge Functions later for API pieces.

Status:

```text
BLOCKED: founder must choose/authorize deployment platform
```

## Codex Automations Plan

These should be created only when the founder approves.

### Daily Morning Project Status

Schedule:

```text
Every day at 8:00 AM local time
```

Actions:

- check Git status;
- check latest commits;
- check local plan/backlog;
- prepare short status;
- optionally email `gcsc@xprnet.org`.

Value:

- founder starts the day with "what changed / what next."

### Daily Site And Backend Health

Schedule:

```text
Every day at 9:00 AM local time
```

Actions:

- check `https://xprnet.org`;
- check `http://localhost:3002/api/health` if local backend is expected to run;
- report only if broken.

Value:

- catches domain, HTTPS, and backend failures early.

### Weekly Supabase Review

Schedule:

```text
Every Saturday
```

Actions:

- run Supabase security advisors;
- run Supabase performance advisors;
- list warnings;
- recommend fixes.

Value:

- keeps database from becoming unsafe while MVP grows.

### Weekly Grant And Partner Prep

Schedule:

```text
Every Friday
```

Actions:

- update Microsoft/Azure grant draft;
- update project progress section;
- prepare founder-ready submission checklist.

Value:

- keeps funding/application work moving with product progress.

## External Service Watch Rule

When a new service, plugin, connector, MCP tool, Codex feature, or OpenAI update appears, follow Rule 5 in `AGENTS.md`:

1. Tell the founder what appeared.
2. Explain it simply.
3. Explain how it helps GCSC.
4. Explain cost/risk/limits.
5. Ask before permanent adoption.

## Recommended Next Hook To Implement

First implement:

```text
pre-commit safety hook
```

Reason:

- it is local;
- it is free;
- it reduces mistakes;
- it does not require new accounts.
