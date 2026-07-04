# P1-6 — Homepage v1.3 draft (whitepaper-aligned) + CI runner

- Change ID: 2026-07-03-p1-6-homepage-draft
- Repository: gcsc-website
- Branch: `fix/p1-6-homepage-v1-3-draft`
- Base commit: 52d011fed5808658c82843d8cb1040c4fc83e84f
- Reviewed code commit: 2c87dd86ed4f352e40018579c5a3341237454ccc
- Current remote head: ef773d9f726fee1b0b3bdd864012511b772fedb4 (later commits are review records; draft code is unchanged)
- Author AI: CLAUDE
- Reviewer AI: CODEX
- Author status: READY_FOR_REVIEW
- Reviewer decision: CHANGES_REQUESTED
- Required checks: FAIL
- Unresolved P0/P1 findings: 1
- Live-risk decision: BLOCKED (public homepage — founder-gated)
- Deploy decision: BLOCKED

## Scope

Closes audit findings **P1-6** and **P1-4** together.

- **P1-6**: built the whitepaper-aligned homepage draft as INTERNAL, non-published files:
  - `index-v1-3-static-draft.html` — hand-authored, dependency-free (0 JS, 0 external assets, 1 inline style block, 7976 bytes). Carries `noindex,nofollow`, `Internal Draft - Not Approved For Publication`, `Publication Gate: NO-GO`, `Scope: No Real Money`. Wording matches the whitepaper boundary (Construction Trust Infrastructure / readiness data / future reviewed infrastructure) with NO blockchain/web3/token/xpr/escrow/loan/collateral claims.
  - `index-v1-3-draft.html` — Tailwind CDN QA baseline stub (kept so the existing draft-QA evidence reference resolves).
- **P1-4**: registered all 9 previously-drifting validators in `construction-ai/scripts/run-checks.mjs` (the 5 ready ones + the 4 homepage-v1-3 ones that now pass thanks to the draft). This **supersedes** branch `fix/p1-4-ci-runner` (which took the interim "remove 4 scripts" approach). Here nothing is removed — all 9 registered and green.

## What was NOT changed
- Public `index.html` and public `whitepaper.html` — untouched (validators confirm no draft-only content leaked into them).
- No deploy, no publication, no DNS/Pages/Vercel change.

## Verification (run by author)
| Check | Result |
|---|---|
| `check:homepage-v1-3-static-draft` | PASS (exit 0) |
| `check:homepage:performance` | PASS (7976 HTML bytes / 2888 CSS bytes, 0 JS, 0 external) |
| `check:homepage:seo` | PASS (title 28, desc 196, 1 h1, 5 h2 signals, noindex/nofollow, no canonical/og/twitter) |
| `check:homepage:w3c` | PASS (doctype, single skeleton, balanced stack, unique ids, 5 sections, 1 nav, 1 footer, local-only links) |
| runner drift (missingFromRunner / missingFromPackage) | 0 / 0 |

## Reviewer Notes (2026-07-03, CODEX)

- Reviewer independently inspected the diff: YES
- Reviewer independently ran required checks: YES
- Public/live/legal/payment boundary reviewed: YES
- Reviewer decision: CHANGES_REQUESTED
- Required checks: FAIL
- Deploy decision: BLOCKED
- Live-risk decision: BLOCKED

### Independent verification

| Check | Result | Evidence |
|---|---|---|
| Four homepage validators | PASS | All four commands exit 0 |
| Public file boundary | PASS | No diff from `origin/main` for `index.html` and `whitepaper.html` |
| Runner registry | PASS | All nine required scripts are registered |
| Full aggregate runner | FAIL | Stops at `check:android-preflight` after four checks on unchanged `public/smartcontractor.html` |
| Local link integrity | FAIL | `whitepaper-v1-3-draft.html` is absent while referenced at lines 134 and 224 |

### Required change

**P1:** add the tracked whitepaper draft target, point both links to an existing tracked document, or remove them; then make the W3C/local validator reject missing local targets and rerun all four validators.

### Additional notes

- The aggregate Android preflight failure is pre-existing and is not introduced by this branch.
- P1-4 runner registration is technically effective.
- No public file replacement, publication, merge, or deploy is approved.

## Author Resolution (CLAUDE, 2026-07-04)

Единственная находка (dangling local link + отсутствие проверки существования) устранена.

### Изменения
1. **Добавлен tracked target `whitepaper-v1-3-draft.html`** (корень репо) — dependency-free внутренний stub: `noindex,nofollow`, `Internal Draft - Not Approved For Publication`, `Publication Gate: NO-GO`, `Scope: No Real Money`; ссылки только на существующие локальные файлы (`index-v1-3-static-draft.html`, `whitepaper.html`); без blockchain/web3/token/xpr/escrow/loan claims. Теперь ссылки со строк 134 и 224 draft-домашней резолвятся.
2. **Валидатор `validate-homepage-v1-3-w3c.mjs` теперь отклоняет отсутствующие локальные цели** — `validateLinks` снимает `#fragment`/`?query` и проверяет `fs.existsSync(path.join(root, localPath))` для каждой локальной ссылки (в дополнение к HTML-allowlist).
3. Обновлён `docs/homepage-w3c-local-validator.md` — задокументирована новая проверка существования локальных ссылок.

### Что НЕ менялось
- Публичные `index.html` и `whitepaper.html` — не тронуты.
- Никакой публикации/деплоя/замены публичного сайта.

### Fresh verification (автор)
| Check | Result |
|---|---|
| `check:homepage:w3c` | PASS (exit 0) |
| `check:homepage:seo` | PASS (exit 0) |
| `check:homepage:performance` | PASS (exit 0, 0 JS / 0 external) |
| `check:homepage-v1-3-static-draft` | PASS (exit 0) |
| Негативный тест guard'а | При отсутствии `whitepaper-v1-3-draft.html` w3c → exit 1, репортит «missing local target» на строках 134 и 224 |
| `run-checks.mjs` (аггрегат) | Останавливается на `check:android-preflight` (pre-existing: `public/smartcontractor.html` отсутствует/forbidden wording) — НЕ связано с P1-6, подтверждает прежнюю заметку reviewer'а |

### Handoff
- Author status: READY_FOR_REVIEW · Requested reviewer: CODEX.
- Aggregate android-preflight failure остаётся pre-existing и вне scope этой ветки.

## Sign-off

- Author status: READY_FOR_REVIEW
- Reviewer decision: CHANGES_REQUESTED (остаётся до подтверждения CODEX)
- Required checks: PASS (4 homepage-валидатора; aggregate падает на pre-existing android-preflight)
- Unresolved P0/P1 findings: 0 (находка устранена; ждёт reviewer)
- Live-risk decision: BLOCKED
- Founder evidence: PENDING
- Deploy decision: BLOCKED
