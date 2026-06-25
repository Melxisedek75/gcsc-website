# SmartContractor Mobile MVP

Expo React Native scaffold matching the orchestrator's plan
(Taskade project `19k7jDM1LMJzfJuA` — "📱 SmartContractor Mobile MVP").

## Setup (founder, one time)

```powershell
cd C:\gcsc\mobile\smartcontractor
npm install
npx expo start
```

Press `i` for iOS simulator, `a` for Android emulator, or scan the QR with
Expo Go on your phone.

## Structure (Expo Router file-based)

| Path | Story (from Taskade backlog) |
|------|------------------------------|
| `app/index.tsx` | Onboarding + role selection |
| `app/(auth)/sign-in.tsx` | Auth shell + biometric login |
| `app/(homeowner)/jobs.tsx` | Homeowner: browse contractors |
| `app/(homeowner)/post-job.tsx` | Homeowner: post job |
| `app/(homeowner)/milestones.tsx` | Milestone approve / reject |
| `app/(homeowner)/chat.tsx` | In-app chat |
| `app/(homeowner)/profile.tsx` | Profile + KYC light |
| `app/(contractor)/jobs.tsx` | Contractor: browse jobs |
| `app/(contractor)/bid.tsx` | Contractor: bid submission |
| `app/(contractor)/milestones.tsx` | Milestone proof upload |
| `app/(contractor)/chat.tsx` | In-app chat |
| `app/(contractor)/profile.tsx` | Profile + KYB status |

Each screen is a stub — UI placeholder, no business logic yet.
Next iteration: wire navigation, then implement screens one by one.

## Hard rules (from hybrid model)

- No real payments. Stripe **test mode** only when implemented.
- No tokens / GCST / wallet signing in this MVP. WebAuth testnet only.
- No App Store / Google Play publish without founder approval.
- No lending / insurance / DeFi features.
