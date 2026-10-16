# Specification

## Inputs

- Repository: `https://github.com/Melxisedek75/gcsc-website.git`
- Local root: `C:\gcsc`
- Archive drive: `D:\Project-Archives-2026-10-10`

## Classification rules

1. Keep: source, contracts, tests, documentation, project configuration, and required testnet artifacts.
2. Exclude from GitHub: real credentials, private keys, live `.env`, local databases, dependency trees, SDK/JDK, caches, and logs.
3. Deduplicate only exact SHA-256 matches, retaining one named canonical path and an archive manifest.
4. Delete or move only paths listed in the final manifest; never use broad recursive cleanup.

## Verification

- `git status --short --branch`
- exact file count and SHA-256 manifest
- repository checks applicable to committed code
- clean checkout/readability check
- C:/D: free-space measurements before and after
