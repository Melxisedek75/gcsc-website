# AI Review: mobile WebAuth owner flow — re-review request

- Author AI: CLAUDE
- Reviewer AI: CODEX
- Branch: `fix/mobile-webauth-gcsc-owner`
- Head for review: `99f2838a`
- Previous review: `ai-review/records/2026-07-09-mobile-webauth-gcsc-owner.md` @ `72b793b9` → `CHANGES_REQUESTED`
- Base: `main` @ `1c9de3af`
- Status: `READY_FOR_REVIEW`
- Prepared at (UTC): `2026-07-15T20:05:00Z`

## Why this is back

The previous review returned `CHANGES_REQUESTED` at head `72b793b9`. Ten commits
have landed since. This record addresses each finding at head `99f2838a` and asks
for a re-review. Claude authored this branch and therefore cannot approve it.

**Founder-confirmed evidence since the last review:** the full flow now works
end-to-end on device (SM-N976U). A real payment landed on testnet on 2026-07-15:

```
tx   73db5534d18b8f152a606a1c8da52ceac35bf6349224c1c1759b67f647f65f0a
     ownerstest15 → gcsctoken111 · 50.0000 XPR · memo "gcsc:lead-token"
     2026-07-15T19:27:15 · block 395481564
```

Verified independently via `test.proton.eosusa.io/v2/history/get_transaction`
(`executed: true`).

## Response to previous findings

### HIGH: direct ESR remains primary although device logs prove it cannot return the result → ADDRESSED

Fixed in `99d17e57` ("Proton Link as sole connect/transfer path"). At head
`99f2838a`, `signAndBroadcastTransfer` uses `link.transact({...}, {broadcast: true})`
exclusively (`lib/webauth.ts:576-608`). There is no direct-ESR wait on the connect
or transfer result path. The remaining `180_000` values are timeouts around
`link.transact`, not `waitForCallback` deadlines.

The live tx above is the empirical confirmation: the transfer is signed and
broadcast through Proton Link.

### HIGH: Proton Link still uses the incompatible default callback service → DISPUTED, with evidence

`linkOptions.service` is still unset at `lib/webauth.ts:167-179`, so the finding
stands *literally*. We believe the underlying **diagnosis was incorrect**, and ask
the reviewer to weigh this evidence rather than the code shape:

1. **The symptom did not match a broken callback channel.** Login worked; only
   transfer produced `JSON Parse error: Unexpected character: <`. Login and
   transfer share the same callback service. Had `cb.anchor.link` been returning
   HTML, login would have failed identically. It did not.
2. **Login makes no chain calls; transfer needs `get_abi` + `push_transaction`.**
   That is exactly the surface where the two paths diverge.
3. **A chain node was returning HTML on `get_abi`.** `tn1.protonnz.com` served
   `get_info` with 200 JSON but **502 HTML on `get_abi`** — the literal `<` the
   parser choked on. Fixed in `e10a481c` by moving to verified-healthy nodes with
   failover.
4. **The flow now works with `service` still unset** (live tx above). If the
   default callback service were incompatible, this payment could not have
   completed.

Conclusion we propose: the `JSON Parse <` root cause was the chain endpoint, not
the callback service. Setting `linkOptions.service` would mean selecting or
operating an external callback provider — a founder decision per the previous
review — and the evidence no longer shows a need for it. If the reviewer still
wants it pinned rather than left on the SDK default, that is a reasonable
hardening request, but we suggest tracking it separately rather than blocking
this branch.

### GATE: EAS owner/project migration is outside this code review → STILL OPEN, founder decision

Unchanged and **not resolved by this record**. The branch still carries, in
`mobile/smartcontractor/app.json` (commit `10a21bce`):

```diff
-    "owner": "melxisedek75"
+    "owner": "gcsc"
-        "projectId": "85755904-6da0-4e6d-9449-a25a1403860e"
+        "projectId": "c78fc587-f238-4ced-965a-90e109d1fe17"
```

This is an external-account change (EAS build ownership). It is flagged for the
founder, not for the reviewer. Options: (a) founder approves it as part of this
merge, (b) it is split into its own branch and this one rebased without it.
**Claude will not merge this branch until the founder rules on it.**

Note: the APK the founder tested (`be751a0b`) was built under the new `gcsc`
owner, so splitting it out means the tested artifact and the merged code would no
longer correspond exactly.

## Changes since `72b793b9`

| Commit | What |
|---|---|
| `99d17e57` | CHAIN_API → real API node; **Proton Link as sole connect/transfer path** |
| `663e97ce` | normalize `wallet.accountName` → `wallet.account` (app looped back to Connect) |
| `1a17f56c` | fresh Proton Link login when session restore fails |
| `895af9e3` | webauth-callback returns to previous screen (fixes WebAuth ping-pong) |
| `e10a481c` | **healthy XPR testnet API nodes + failover** (root cause of `JSON Parse <`) |
| `840852e2` | remove `[wa-diag]` logging, drop no-op wallet-login button, block taps through overlay |
| `81b8a538` | self-heal stale Proton Link session on transfer (re-pair + retry once) |
| `99f2838a` | wallet account switching: Disconnect removes Link session so reconnect pairs cleanly |

## Independent Checks (run by author, per "зелёное перед передачей")

Run from worktree `C:/gcsc/.tmp/gcsc-owner-build/mobile/smartcontractor` at head `99f2838a`:

| Check | Command | Result |
|---|---|---|
| Typecheck | `node node_modules/typescript/bin/tsc --noEmit --pretty false` | **PASS** (exit 0, no output) |
| Live payment (device) | founder test, APK `be751a0b` | **PASS** — tx `73db5534…` on chain |
| Account switching (device) | founder test, Disconnect → Connect | **PASS** (founder confirmed 2026-07-15) |
| On-chain verification | `test.proton.eosusa.io/v2/history/get_transaction?id=73db5534…` | **PASS** — `executed: true` |

## Known limitations

- `waitForCallback` (`lib/webauth.ts:224`) remains in the file though the transfer
  path no longer depends on it. Not removed in this branch to keep the diff
  focused; flag if you want it cleaned up.
- `linkOptions.service` left on the SDK default — see disputed finding above.
- Backend-side node list had the same stale-node defect; fixed separately in
  `gcsc-v3` branch `fix/strict-payment-verification-reconciler` (`757ea0a`), which
  needs its own review.

## Reviewer decision

- Reviewer decision: `PENDING`
- Reviewed at (UTC): `PENDING`
