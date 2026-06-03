---
name: xprclaw-autonomous-builder
description: Autonomous builder for the XPRClaw static/PWA website. Use when founder asks Claude Code to continue, improve, commit, push, verify, or prepare deploy for XPRClaw.
---

# XPRClaw Autonomous Builder

## Goal

Move the XPRClaw website forward with safe autonomy:
read the local site, choose one useful improvement, implement it, verify it, commit scoped XPRClaw files, push when Git access works, and prepare deploy only inside founder-approved boundaries.

## Project Paths

Project folder:
C:\gcsc\xprclaw

Git root:
C:\gcsc

Primary files:
- xprclaw\index.html
- xprclaw\manifest.json
- xprclaw\sw.js
- xprclaw\vercel.json
- xprclaw\favicon.ico
- xprclaw\og-image-1200x630.png
- xprclaw\icons\*

## Start Every Run

1. cd C:\gcsc
2. git status --short --branch
3. git remote -v
4. git branch --show-current
5. Get-ChildItem -Force C:\gcsc\xprclaw
6. Read the relevant XPRClaw files before editing.

## Access Discovery

Check available tools without exposing secrets:

Get-Command git,gh,vercel,netlify,firebase,supabase -ErrorAction SilentlyContinue

If gh exists:
gh auth status

If vercel exists:
vercel whoami

Never print secrets, tokens, .env values, private keys, service-role keys, cookies, wallet keys, or passwords.

## Allowed Autonomous Work

Allowed without asking founder:
- HTML/CSS/JS fixes inside xprclaw.
- Responsive/mobile UI improvements.
- PWA manifest and service worker improvements.
- SEO/meta/Open Graph improvements.
- Accessibility improvements.
- Performance and image loading improvements.
- Local static checks.
- Preview/deploy preparation docs.
- Scoped commit and push, if Git already works.

## Commit And Push Rules

- Commit from C:\gcsc.
- Stage only exact XPRClaw files.
- Never use git add .
- Never reset, force push, destructive clean, or revert unrelated files.
- Preserve unrelated dirty/untracked files.
- Push only if existing Git authorization works without asking for a new secret.

Recommended commit style:

git add xprclaw\index.html xprclaw\manifest.json xprclaw\sw.js xprclaw\vercel.json
git commit -m "Improve XPRClaw site readiness"
git push origin main

## Deploy Rules

Default:
prepare and verify deploy readiness only.

Allowed:
- local checks;
- Vercel/Netlify/GitHub Pages readiness review;
- preview deploy only if CLI is already authorized and founder has not forbidden it.

Blocked until explicit founder approval:
- production deploy;
- DNS/domain changes;
- Vercel project settings;
- env var changes;
- public website replacement;
- paid services;
- external account changes;
- legal/business launch decisions.

Before production deploy, show:
- platform;
- command;
- branch;
- latest commit;
- changed files;
- checks passed;
- rollback step.

## Stop Boundaries

Stop and ask founder if the next step requires:
- login;
- password;
- token;
- API key;
- paid service;
- external account setting;
- DNS/domain;
- production deploy;
- destructive action;
- legal/business decision;
- touching files outside xprclaw without explicit request.

## Checks

Use the strongest available cheap checks:
- node --check xprclaw\sw.js
- PowerShell JSON parse for manifest.json
- local browser/manual static check if available
- screenshot desktop/mobile if browser tool is available
- git diff --check

If no automated checks exist, create a small local validation script only if useful and keep it scoped to xprclaw.

## Output Format

Always answer in Russian:

Сделано:
- ...

Проверено:
- ...

Commit/push:
- ...

Deploy:
- ...

Нужен founder:
- ...

Следующий безопасный шаг:
- ...

## Never

- Never work on SmartContractor as part of this skill.
- Never work on smart-contract folders as part of this skill.
- Never touch construction-ai as part of this skill.
- Never expose secrets.
- Never use git add .
- Never deploy production without founder approval.
