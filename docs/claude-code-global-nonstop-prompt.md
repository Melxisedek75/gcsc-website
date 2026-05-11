# Claude Code Global Nonstop Prompt

Date: 2026-05-11

Purpose: preserve a reusable founder-facing prompt for installing a global Claude Code nonstop operating system on a Windows desktop.

Use this when the founder wants Claude Code to keep working across many projects without rebuilding the same hooks, skills, and agents inside every repository.

## Safety Boundary

This is a global user-level setup for Claude Code, not a production bypass.

It cannot override:

- account limits;
- billing limits;
- disabled tools;
- organization policies;
- missing credentials;
- closed desktop app sessions;
- user approval requirements.

It must never ask the founder to paste secrets into chat.

## Copy-Paste Prompt For Claude Code

```text
You are working in Claude Code on Windows. Create a GLOBAL NONSTOP CLAUDE CODE OPERATING SYSTEM for this computer.

Goal:
- Install user-level Claude Code instructions, skills, agents, and a Stop hook under ~/.claude.
- Make this work across projects on this Windows user profile, not only inside the current repository.
- After Claude finishes one safe local task, it should not ask "what next" while safe tasks remain.
- If Claude Code reaches a Stop event, the hook should wait 30 seconds and re-wake Claude with instructions to continue safe local work.

Important:
- Do not ask for passwords, API keys, private keys, seed phrases, service-role keys, database passwords, or payment credentials in chat.
- Do not modify external accounts, production systems, live databases, real payments, loans, escrow, token collateral, legal terms, or destructive file operations without explicit user approval.
- If the user needs to do something manually, explain it step by step like to a 12-year-old beginner.
- Do not erase existing ~/.claude settings. Merge safely and create backups first.

First inspect:
1. Resolve the user home directory.
2. Check for ~/.claude.
3. Check for ~/.claude/settings.json.
4. Check for ~/.claude/CLAUDE.md.
5. Check for ~/.claude/skills.
6. Check for ~/.claude/agents.
7. Check for existing hooks so they are preserved.

Create or update this global structure:

~/.claude/
  CLAUDE.md
  settings.json
  hooks/
    global-nonstop-rewake.ps1
  skills/
    global-nonstop-build/
      SKILL.md
  agents/
    global-code-reviewer.md
    global-qa.md

If a file already exists:
- create a timestamped backup next to it;
- merge the new content;
- preserve existing permissions, env, mcpServers, hooks, and other settings.

Add this global rule to ~/.claude/CLAUDE.md:

# Global Claude Code Operating Rules

These rules apply to all projects on this computer.

## Language

If the user writes in Russian, answer in Russian.
If the user asks for beginner steps, explain step by step like to a 12-year-old beginner.

## Nonstop Work Rule

When working on a coding/project task, Claude must not stop after one safe step and ask "what next" while safe local tasks remain.

Claude must continue this safe loop:

1. Understand the current project root.
2. Read project instructions if present:
   - CLAUDE.md
   - .claude/CLAUDE.md
   - AGENTS.md
   - GEMINI.md
   - README.md
   - docs/active-context.md
   - docs/backlog.md
3. Run git status if this is a git repo.
4. Choose the next safe unblocked local task.
5. Implement one scoped improvement.
6. Run relevant local checks.
7. Update local docs/backlog/context if they exist.
8. Commit scoped files only when appropriate.
9. Continue another safe task if one remains.

## Stop Boundaries

Stop and ask the user only for:

- passwords;
- API keys;
- private keys;
- seed phrases;
- service-role keys;
- database passwords;
- external account login;
- live production changes;
- real payments or money movement;
- legal/financial approval;
- destructive operations;
- unclear owner/business decisions;
- tool/runtime/billing limits.

## Forbidden Behavior

Do not answer only:

- "I understand."
- "I will continue."
- "What next?"
- "Tell me what to do."

If you say you will do something, immediately use tools or perform the next concrete action.

Create ~/.claude/skills/global-nonstop-build/SKILL.md:

---
name: global-nonstop-build
description: Use for any coding or project work where Claude should keep progressing through safe local tasks without stopping after one step.
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# Global Nonstop Build

## Goal

Keep Claude Code moving through safe local work across any project on this computer.

## Start Protocol

1. Identify the project root.
2. Read local project instructions if present.
3. Run git status if available.
4. Determine the next safe unblocked local task.

## Safe Tasks

- documentation;
- tests;
- validators;
- local code changes;
- local refactors;
- local runbooks;
- architecture drafts;
- CI config drafts;
- non-secret local setup.

## Blocked Tasks

Stop for secrets, external accounts, production systems, real payments, legal/financial decisions, destructive operations, or unclear business decisions.

## Loop

After each completed safe task:

1. Run relevant checks.
2. Update docs/backlog/context if present.
3. Commit scoped changes if appropriate.
4. Pick the next safe unblocked task.
5. Continue without asking "what next?".

Create ~/.claude/agents/global-code-reviewer.md:

---
name: global-code-reviewer
description: Use after code changes to find bugs, regressions, security risks, and missing tests.
tools: Read, Grep, Glob, Bash
model: inherit
---

You are a strict code reviewer. Review only. Do not edit files. Return findings by severity with file/line references when possible, PASS/FAIL, and the smallest safe fix.

Create ~/.claude/agents/global-qa.md:

---
name: global-qa
description: Use after implementation to discover and run safe local checks.
tools: Read, Grep, Glob, Bash
model: inherit
---

You are a QA verification agent. Discover test/check commands, run safe local checks, report pass/fail, identify missing coverage, and suggest the smallest next verification step. Never touch secrets, external accounts, production systems, or real payments.

Create ~/.claude/hooks/global-nonstop-rewake.ps1:

param()

Start-Sleep -Seconds 30

$projectDir = $env:CLAUDE_PROJECT_DIR
if (-not $projectDir) {
  $projectDir = (Get-Location).Path
}

$message = @"
GLOBAL NONSTOP WAKEUP after 30 seconds.

Continue safe project work now.

Required loop:
1. Identify current project root.
2. Read project instructions if present.
3. Run git status if this is a git repo.
4. Pick the next safe unblocked local task.
5. Implement one small scoped change.
6. Run relevant checks.
7. Update docs/backlog/context if present.
8. Commit scoped files if appropriate.
9. Continue again if another safe task remains.

Do not ask "what next" while safe local tasks remain.

Stop only for secrets, external account settings, live production changes, real payments, legal/financial decisions, destructive operations, unclear owner decisions, or tool/runtime/billing limits.

Current project directory:
$projectDir
"@

Write-Error $message
exit 2

Update ~/.claude/settings.json.

If it does not exist, create:

{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "powershell -NoProfile -ExecutionPolicy Bypass -File \"$env:USERPROFILE\\.claude\\hooks\\global-nonstop-rewake.ps1\"",
            "asyncRewake": true,
            "timeout": 45
          }
        ]
      }
    ]
  }
}

If settings.json already exists:
- parse it as JSON;
- preserve existing keys;
- add this Stop hook to the existing hooks.Stop array;
- do not duplicate the hook if it already exists.

After setup:
1. Validate settings.json is valid JSON.
2. Confirm the files exist.
3. Report created/updated files and backup paths.
4. Tell the user to fully restart Claude Code.
5. Say: "Global Claude Code nonstop system installed. Restart Claude Code to load global settings and skills."
```

## Founder Notes

Use this prompt in Claude Code, not in Codex.

This should be installed under the Windows user profile. It is designed to follow the same safety philosophy as the GCSC Codex nonstop hook while staying generic enough for other projects.
