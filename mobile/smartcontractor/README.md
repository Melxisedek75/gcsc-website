# SmartContractor (Mobile)

React Native + Expo Router mobile app for the GCSC SmartContractor marketplace. Homeowners post construction jobs, contractors bid, milestone payments settle on XPR Network.

---

## Quick start

Requirements: Node 18+, Expo Go on a physical iOS or Android device (recommended for WebAuth payment testing).

```powershell
cd C:\gcsc\mobile\smartcontractor
npm install
npx expo start
```

Scan the QR code with the Expo Go app. WebAuth payment signing requires a real device — the iOS Simulator / Android Emulator cannot deep-link to the WebAuth wallet.

---

## Project layout

```
mobile/smartcontractor/
├── app/                          # Expo Router file-based routes
│   ├── _layout.tsx               # Root layout — session restore, onboarding gate
│   ├── index.tsx                 # Role select (homeowner vs contractor)
│   ├── onboarding.tsx            # 4-slide first-launch intro
│   ├── dispute.tsx               # Universal dispute form (reachable from milestones)
│   ├── notifications.tsx         # Unified activity feed (jobs + bids + leads + disputes)
│   ├── settings.tsx              # Notification opt-ins, theme, language, reset
│   ├── (auth)/
│   │   ├── sign-in.tsx           # Email/password login
│   │   ├── sign-up.tsx           # Register with role select
│   │   ├── verify.tsx            # OTP email/SMS code entry
│   │   └── connect-wallet.tsx    # WebAuth pairing + PUT profile.wallet
│   ├── (homeowner)/
│   │   ├── _layout.tsx           # Tab bar
│   │   ├── jobs.tsx              # My posted jobs list
│   │   ├── post-job.tsx          # New job form + 25 XPR publish fee
│   │   ├── milestones.tsx        # Approve/release flow
│   │   ├── chat.tsx              # Thread list
│   │   ├── chat/[id].tsx         # Single conversation
│   │   ├── profile.tsx           # Account + wallet status + actions
│   │   ├── job/[id].tsx          # Job detail with milestone plan
│   │   └── job/[id]/bids.tsx     # Bids on this job, accept one
│   └── (contractor)/
│       ├── _layout.tsx           # Tab bar
│       ├── jobs.tsx              # Available jobs feed (filters + bookmarks)
│       ├── bid.tsx               # My bids + buy Lead Tokens
│       ├── bid-submit/[jobId].tsx# Submit bid form
│       ├── milestones.tsx        # Upload proof flow
│       ├── chat.tsx              # Thread list
│       ├── chat/[id].tsx         # Single conversation
│       └── profile.tsx           # Profile with reviews block
├── components/                   # Shared UI primitives (Button, Card, Header, Screen, etc.)
├── lib/                          # Domain modules
│   ├── api.ts                    # Typed HTTP client + JWT/AsyncStorage
│   ├── auth.ts                   # login / register / verify / fetchProfile / updateProfile
│   ├── webauth.ts                # ESR signing requests, deep links to WebAuth
│   ├── payments.ts               # 402 Payment-Required flow, livePayment + demoPayment
│   ├── jobs.ts                   # AsyncStorage-backed homeowner jobs
│   ├── bids.ts                   # AsyncStorage-backed contractor bids + accept
│   ├── leads.ts                  # AsyncStorage-backed purchased Lead Tokens
│   ├── disputes.ts               # AsyncStorage-backed dispute records
│   ├── chat.ts                   # Mock chat histories
│   ├── notifications.ts          # Aggregates jobs+bids+leads+disputes into a feed
│   ├── settings.ts               # User preferences (notif opt-ins, theme, lang)
│   ├── onboarding.ts             # First-launch completion flag
│   ├── saved.ts                  # Contractor bookmarked job ids
│   ├── reviews.ts                # Mock reviews + rating summary
│   ├── job-templates.ts          # Curated quick-start renovation templates
│   ├── tokens.ts                 # Design tokens (colors, spacing, typography, radius)
│   └── mock.ts                   # Legacy mock fixtures (jobs, threads, contractors)
└── package.json
```

---

## AsyncStorage keys

All keys are namespaced under `@gcsc/`:

| Key | Owner | Shape |
|-----|-------|-------|
| `@gcsc/auth/token` | `lib/api.ts` | JWT string |
| `@gcsc/auth/user` | `lib/api.ts` | JSON `AuthUser` |
| `@gcsc/webauth/session` | `lib/webauth.ts` | JSON `{account, permission, connectedAt}` |
| `@gcsc/jobs/local` | `lib/jobs.ts` | JSON `LocalJob[]` |
| `@gcsc/bids/local` | `lib/bids.ts` | JSON `LocalBid[]` |
| `@gcsc/leads/local` | `lib/leads.ts` | JSON `LocalLead[]` |
| `@gcsc/disputes/local` | `lib/disputes.ts` | JSON `LocalDispute[]` |
| `@gcsc/saved-jobs` | `lib/saved.ts` | JSON `string[]` (job ids) |
| `@gcsc/settings` | `lib/settings.ts` | JSON `UserSettings` |
| `@gcsc/onboarding/completed` | `lib/onboarding.ts` | String `'true'` |

Settings → "Clear local data" wipes jobs/bids/leads/disputes. "Sign out" clears auth + webauth.

---

## Backend

Backend lives at `https://gcsc-backend-production.up.railway.app/` (Railway). The mobile app calls:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/register` | POST | Create account (email/password/role) |
| `/api/auth/login` | POST | JWT |
| `/api/verify` | POST | OTP verification |
| `/api/auth/profile` | GET / PUT | Read or update profile (wallet binding) |
| `/api/payment/job-posting` | POST | 25 XPR publish fee (402 → tx → 200) |
| `/api/payment/lead-token` | POST | 50 XPR Lead Token (requires JWT) |

Endpoints not yet implemented on backend (mobile uses local AsyncStorage):
- `/api/jobs` (cross-role job feed)
- `/api/bids` (cross-role bid feed)
- `/api/milestones` (server-side milestone state)
- `/api/disputes` (cross-role disputes)
- Real-time chat (currently mock)

---

## Payment flow (402 Payment Required)

1. Mobile calls `POST /api/payment/X` with JWT in `Authorization: Bearer`.
2. Backend responds `402` with `WWW-Authenticate: Payment recipient="..." amount="..."`.
3. Mobile builds an ESR signing request, deep-links to WebAuth wallet.
4. User approves with biometric. Wallet signs and broadcasts `eosio.token::transfer` on XPR Network.
5. Wallet returns control via `smartcontractor://webauth-callback?tx=...&sa=...`.
6. Mobile calls `POST /api/payment/X` again with `Authorization: Payment <txHash>` and JWT in `X-Auth-Token`.
7. Backend verifies the transaction via Hyperion and returns `200 + Payment-Receipt`.

See `lib/payments.ts` for implementation, `lib/webauth.ts` for the WebAuth side.

---

## Testnet accounts

| Account | Role | Used for |
|---------|------|----------|
| `gcscbuild11` | builder/dev | source for funding tests (held GCSCBUILD contract) |
| `ownerstest15` | homeowner | E2E homeowner flow (500 XPR funded) |
| `contructor15` | contractor | E2E contractor flow (500 XPR funded) |

Real on-chain account names (12 chars max). Display names in WebAuth differ.

---

## Development workflow

```powershell
# Type-check (run before every commit)
npx tsc --noEmit

# Start dev server with QR code
npx expo start

# Clear Metro cache if something hot-reloads stale
npx expo start --clear
```

`gcsc-website/main` is the only branch. Push directly after `tsc --noEmit` passes — CI runs the same type-check.

---

## Out of scope (for now)

- Test framework (jest / vitest) — not installed. `lib/*.ts` are pure functions; add tests when stakes warrant it.
- Server-side rendering — Expo Router supports SSR but we ship mobile-only.
- i18n — strings hardcoded in English. `lib/settings.ts` has a language field that does not switch anything yet.
- Push notifications — `notifyMessages` etc. in settings persist preferences but no Expo Notifications wiring yet.
- Dark / light theme switching — `theme` field in settings persists but app is currently dark-only.

---

## Related docs

- `docs/app-store-listing.md` — App Store / Play Store submission copy
- `docs/site-copy.md` — Marketing site copy
- `docs/PAYMENT-402-PATCH.md` — Backend 402 flow details
- `docs/mppx-xpr-network.md` — Machine Payments Protocol notes
- `_kimi-inbox/` — Handoff folder for Kimi-generated UI / content
