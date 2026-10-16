# WebAuth root-cause repair handoff

This folder contains the source files and tests changed in the isolated branch
`codex/webauth-root-cause-repair` as of 2026-08-30.

Included files:

- `mobile/smartcontractor/lib/payments.ts`
- `mobile/smartcontractor/lib/wallet-auth-flow.ts`
- `mobile/smartcontractor/lib/wallet-auth-flow.test.ts`
- `mobile/smartcontractor/lib/webauth.ts`
- `mobile/smartcontractor/lib/webauth-transaction.ts`
- `mobile/smartcontractor/lib/webauth-transaction.test.ts`
- `mobile/smartcontractor/lib/api-config.ts`
- `mobile/smartcontractor/lib/api-config.test.ts`
- `mobile/smartcontractor/lib/api-runtime.ts`
- `mobile/smartcontractor/lib/android-build-config.test.ts`
- `mobile/smartcontractor/package.json`
- `execution/local-wallet-auth-test-server.mjs`
- `execution/local-wallet-auth-test-server.test.mjs`

Excluded intentionally: generated Gradle logs and the zero-byte APK from the
failed build. This handoff does not represent a release build.
