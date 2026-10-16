# Intent: Untracked repository recovery

## Outcome

Make the GitHub private repository a usable source of truth for the current GCSC testnet work, preserve needed local material on D:, and reclaim C: space by removing only verified duplicates and regenerable artifacts.

## Boundaries

- Work only in `C:\gcsc` and the verified archive on `D:`.
- Do not touch mainnet credentials, production systems, payments, or live chain actions.
- Preserve the existing dirty worktree until a verified preservation copy exists.
- Do not publish real secrets, even to a private repository.

## Acceptance

- A complete inventory separates project candidates, duplicates, generated artifacts, and excluded secrets.
- Needed project files are committed on a dedicated branch and pushed or submitted as a GitHub PR after review gates.
- A clean checkout can read the committed project material.
- C: cleanup is evidenced by before/after free space and an exact deletion manifest.
- D: archive remains readable and is not removed.
