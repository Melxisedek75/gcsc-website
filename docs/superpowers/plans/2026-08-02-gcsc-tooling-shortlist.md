# GCSC Tooling Shortlist, Verified 2026-08-03

This is a shortlist for founder review, not an instruction to install everything. Star count demonstrates broad interest, not security, suitability, licence compatibility, or production readiness. GitHub metadata was queried on 2026-08-03; npm figures cover 2026-07-03 through 2026-08-01 where a relevant public npm package exists.

## Current Codex capabilities worth adopting selectively

The current Codex manual documents these capabilities that are directly relevant to GCSC:

1. Worktrees for isolated parallel fixes and reviews.
2. Custom skills for repeatable GCSC workflows.
3. Plugins for bundled skills, tools, hooks, and MCP configuration.
4. Hooks that can block unsafe tool actions or enforce local checks.
5. Multi-agent operations with isolated subagent tasks.
6. Cross-repository code review.
7. Codex Security scanning from terminal, CI, and TypeScript.
8. Browser developer mode for local web-flow diagnosis.
9. GitHub Action and non-interactive `codex exec` for controlled CI tasks.
10. Scheduled tasks for safe recurring checks.

Recommended now: worktrees, cross-review, skills, a narrow required-check hook, and local browser testing. Defer plugins that require third-party accounts, automatic security scanning uploads, hosted tasks, and all deployment integrations until founder approval.

## 23 GitHub projects with over 100,000 stars

| # | Project | Stars | Adoption signal | GCSC use | Recommendation |
| --- | --- | ---: | --- | --- | --- |
| 1 | `microsoft/vscode` | 188,222 | Broad editor ecosystem | Debugging, extensions, tasks | Already compatible; no migration needed. |
| 2 | `facebook/react` | 246,918 | npm `react`: 656.3M/30d | Web UI only if a web client is formalized | Defer until web app source is reconciled. |
| 3 | `vercel/next.js` | 141,302 | npm `next`: 204.2M/30d | Public/admin web application | Consider only after local API contract is stable. |
| 4 | `microsoft/TypeScript` | 110,045 | npm `typescript`: 995.5M/30d | Mobile/API/contract type safety | Keep and pin in every TS package. |
| 5 | `nodejs/node` | 118,681 | Runtime, not a comparable npm package | Current Express/tooling runtime | Pin Node 20 in CI; do not chase latest blindly. |
| 6 | `electron/electron` | 122,297 | npm `electron`: 20.5M/30d | Desktop operator app | Defer; mobile/web have priority. |
| 7 | `facebook/react-native` | 126,274 | npm `react-native`: 43.1M/30d | Current Expo mobile app | Keep; add tests before upgrades. |
| 8 | `flutter/flutter` | 178,138 | Multi-platform SDK | Alternative mobile stack | Do not add: a second mobile stack would delay MVP. |
| 9 | `mrdoob/three.js` | 114,194 | npm `three`: 50.1M/30d | Visual construction/3D roadmap | Defer to a defined 3D requirement. |
| 10 | `axios/axios` | 109,166 | npm `axios`: 448.4M/30d | HTTP clients | Do not replace native `fetch` without a concrete need. |
| 11 | `kubernetes/kubernetes` | 124,196 | Infrastructure standard | Future self-hosted operations | Defer; not an MVP dependency. |
| 12 | `tensorflow/tensorflow` | 196,755 | ML framework | Future risk/compliance models | Defer until labelled data and model-evaluation plan exist. |
| 13 | `langchain-ai/langchain` | 143,265 | npm `langchain`: 11.1M/30d | Controlled AI assistant workflows | Pilot locally only after data/redaction policy. |
| 14 | `denoland/deno` | 107,967 | Secure JS/TS runtime | Small isolated tools | Defer; Node is already the project runtime. |
| 15 | `rust-lang/rust` | 115,112 | Systems language ecosystem | Performance/security tools | Defer; no Rust component is justified yet. |
| 16 | `tauri-apps/tauri` | 109,819 | npm CLI: 7.6M/30d | Lightweight desktop admin shell | Defer; choose only if Electron is rejected later. |
| 17 | `angular/angular` | 100,698 | npm `@angular/core`: 23.0M/30d | Enterprise web UI alternative | Do not add; React/Expo remains the local pattern. |
| 18 | `microsoft/terminal` | 104,446 | Windows developer tooling | Better local workflows | Optional local productivity only. |
| 19 | `freeCodeCamp/freeCodeCamp` | 453,374 | Large learning/community codebase | UX, curriculum, contribution patterns | Reference only. |
| 20 | `donnemartin/system-design-primer` | 360,174 | Architecture reference | Design reviews and API boundaries | Reference only; not a dependency. |
| 21 | `github/gitignore` | 175,102 | Widely reused templates | Ignore rules review | Compare selectively; never overwrite current ignore file wholesale. |
| 22 | `goldbergyoni/nodebestpractices` | 105,467 | Node operational guidance | Express hardening, logging, tests | Use as a review checklist, not copied code. |
| 23 | `TheAlgorithms/Python` | 223,414 | Large algorithm corpus | Learning/prototype reference | Reference only; not a production dependency. |

## Shortlist decisions

- Adopt now: Codex worktrees/reviews/skills; Node 20 + TypeScript consistency; React Native test tooling; API contract testing; Node best-practice checklist.
- Evaluate later in isolated proof-of-concepts: Next.js, LangChain, Three.js, Tauri.
- Do not adopt for the MVP: Flutter, Electron, Angular, Kubernetes, Rust, TensorFlow. They expand scope without solving a verified current blocker.
- Never install based only on stars or downloads. Before any adoption, record licence, maintainer status, security advisories, lockfile change, test plan, cost/account requirement, data exposure, and a rollback path.

## Sources

- Official Codex Manual: `https://developers.openai.com/codex/codex-manual.md`
- GitHub repository metadata: `https://api.github.com/repos/{owner}/{repo}`
- npm public download API: `https://api.npmjs.org/downloads/point/last-month/{package}`
