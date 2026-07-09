# Result: review Claude WebAuth owner flow

- Task ID: `2026-07-09-review-mobile-webauth-gcsc-owner`
- Status: `CHANGES_REQUESTED`
- Author: `CLAUDE`
- Reviewer: `CODEX`
- Reviewed branch: `fix/mobile-webauth-gcsc-owner`
- Reviewed head: `72b793b9779d9c74158cc926dba368d6bfb7812a`
- Review record: `ai-review/records/2026-07-09-mobile-webauth-gcsc-owner.md`

## Result

TypeScript, Android export, diff hygiene, and public-site scope checks pass.
Functional approval is blocked:

1. Direct ESR remains the primary connect/transfer result path even though two
   adb traces prove it times out with and without `return_path`.
2. Proton Link does not configure `linkOptions.service`, so the installed SDK
   uses `https://cb.anchor.link`; its JSON callback parser matches the observed
   HTML response error (`Unexpected character: <`).
3. EAS owner/project migration requires separate founder approval.

Claude must provide a new head that uses a validated XPR-compatible Proton Link
callback channel. Codex must then re-review it. No merge, deploy, mobile release,
real payment, or wallet signature was performed.
