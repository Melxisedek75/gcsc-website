# GCSC × Metallicus — Partnership Deck

**Подготовлено для:** Marshall Hayner, Co-Founder & CEO, Metallicus (X: [@MarshallHayner](https://x.com/MarshallHayner))
**От:** GCSC Founder
**Дата:** 2026-06-26
**Объём:** 14 слайдов + appendix

---

## Стратегическое позиционирование

**Не продаём ему наш token. Продаём ему use case для его инфраструктуры.**

Marshall построил Metallicus как compliance-first банковский рельс. Его боль: банки и fintech не знают что строить ПОВЕРХ его инфраструктуры. GCSC — конкретный, осязаемый, $13T-рынок продукт, который идеально ложится на Metal Blockchain + Metal X lending + FedNow rails.

**Что мы НЕ говорим:** «помоги нам запустить token»
**Что мы говорим:** «у нас живой продукт в Seattle, $50K через эскроу, 100 контракторов; нам нужен banking rail с лицензией — твоя инфраструктура решает это идеально; вот предложение по revenue split»

---

## Slide 1 — Title

**GCSC × Metallicus**
**A construction industry banking rail.**

Tagline: «$13 trillion industry. Zero modern financial infrastructure. Built-in TAM for Metal Blockchain.»

Bottom: founder name + title + date.

---

## Slide 2 — Why this email lands in your inbox

- You built the only blockchain rail FedNow-certified.
- You wrote the Crypto Act of 2020 because regulation matters.
- You've said it publicly: **banks need use cases, not just infrastructure.**

We have a use case at scale that nobody else is solving.

---

## Slide 3 — The $13 trillion problem nobody fixed

- **$13T** global construction industry
- **Late payments:** average **90+ days** between work completion and payment
- **Fraud:** 1 in 6 home renovation projects involves a dispute, scammer, or disappeared contractor
- **Worker benefits:** ~70% of construction workers in US have **no retirement plan**
- **Banking:** small contractors are **underserved by traditional credit** — the unbanked of trades

Traditional response: invoice factoring (predatory), surety bonds (expensive), credit cards (high rates).

What's missing: **trust infrastructure between homeowner ↔ contractor with regulated banking rails.**

---

## Slide 4 — What GCSC built

**SmartContractor** — marketplace + escrow platform for construction work.

1. Homeowner posts a job, funds escrow milestone-by-milestone
2. Verified contractors submit bids
3. Contractor wins, completes work milestone
4. AI Compliance Agent verifies proof (photos, geo-tag, materials receipts)
5. Homeowner approves → funds release

**Key invariant:** homeowner never pays upfront, contractor never works unpaid.

**Current state:**
- Live testnet on XPR Network
- Mobile app (iOS/Android) MVP shipped
- 11 smart contracts deployed
- Seattle pilot launching Q4 2026
- Backend on Railway, Postgres, Stripe Connect (test mode)
- 5 AI agents in Python (CMA, RAA, CA, TA, REA)

We are **not** a crypto experiment. Working product with crypto infrastructure under the hood.

---

## Slide 5 — Where Metallicus fits — the 3 rails

| GCSC need | What we currently use | What Metallicus provides |
|---|---|---|
| **Real-time settlement** milestone payments | Stripe Connect (US-only, T+2) | **FedNow** through Metal — instant, regulated |
| **Stablecoin escrow** between accept and approval | XPR testnet | **TDBN** — compliance-built stablecoin |
| **Contractor working-capital loans** | Manual + Stripe Capital | **Metal X lending pool** — DeFi with BSA compliance |

One architecture, one partner.

---

## Slide 6 — The contractor lending problem (centerpiece)

**The gap:**
- Roofer needs $3,000 for materials before job
- Job worth $15,000, homeowner won't pay upfront (correctly)
- Bank: declines (no W-2, no credit history)
- Credit card: 24% APR, $5K limit
- Hard money: 30% APR + fees

Result: contractor skips, takes upfront from homeowner (fraud risk), or razor margins.

**GCSC + Metal X solves:**
- Contractor has GCSC reputation score (jobs, on-time, disputes, license verified) — **on-chain, portable, auditable**
- RAA generates credit risk based on real performance, not FICO
- **Metal X lending pool funds at 8-12% APR** vs 24% credit card
- Milestone payments repay loan first, remainder to contractor
- BSA-compliant base layer
- GCSC = first vertical-specific lending channel for Metal X

---

## Slide 7 — Revenue split — both win

**Year 1 (Seattle + Portland, conservative):**
- 200 active contractors
- 8 jobs/year × 200 = 1,600 jobs
- Avg $8,000 per job
- 40% take working-capital = 80 borrowers
- $2,500 × 3 cycles = $600K originated annually
- At 10% APR = **$60K interest revenue year 1**

**Split proposal:**
- 70% Metal X pool depositors
- 20% Metallicus origination + servicing fee
- 10% GCSC sourcing + risk monitoring

**Year 3 (5 US markets, 2,000 contractors):**
- $15M originated annually
- $1.5M interest
- Metallicus: $300K | GCSC: $150K | Pool: $1.05M

**10x cheaper CAC than direct Metal X marketing.**

---

## Slide 8 — The FedNow angle

Metallicus = **only** blockchain certified FedNow provider. Your moat.

**How GCSC weaponizes it:**
- Homeowner approves milestone in mobile
- Backend triggers FedNow through Metallicus
- Contractor receives funds **within 20 seconds**
- ACH: T+2 to T+3

**Competitive math:**
- Stripe Connect: T+2, $0.25 + 1.5%
- Wise: $10-20 fee, hours-to-days
- **FedNow via Metal:** instant, sub-cent fees, compliance built-in

Construction workers = perfect FedNow use case. Job-to-job life. 20 seconds vs 2 days = rent or no rent.

Co-marketing headline: **«The first construction industry banking rail with instant settlement, powered by Metallicus.»**

---

## Slide 9 — Post-CLARITY / Post-GENIUS Act roadmap

After regulatory clarity:

**For Metallicus:**
- TDBN = de-facto B2B settlement rail
- Metal X retail lending with BSA compliance
- Banks integrate Metal Blockchain as standard
- Fed relationship extends beyond FedNow

**For GCSC:**
- GCSC utility token launch (compliance-first, registered)
- GCST stablecoin pegged USD, backed by Metal X reserves (joint backing proposal)
- Construction industry DAO governance
- Real Estate DAO for tokenized projects

**Partnership:** GCSC = first vertical marketplace natively on Metallicus rails. We're a poster child for B2B narrative. You're embedded banking for our marketplace.

---

## Slide 10 — Joint technical architecture

```
┌─────────────────────────────────────────────────────┐
│           GCSC SmartContractor App                  │
│       (Mobile + Web, AI agents, marketplace)        │
└──────────────┬──────────────────────┬───────────────┘
               │                      │
               ▼                      ▼
┌──────────────────────┐   ┌─────────────────────────┐
│   GCSC Backend       │   │   GCSC Smart Contracts  │
│   (escrow, jobs,     │   │   (proton-tsc on XPR)   │
│    AI agents)        │   │                         │
└──────┬───────────────┘   └─────────────────────────┘
       │
       ├─► Metal Blockchain (Layer 0)
       │     - Asset tokenization
       │     - BSA compliance layer
       │
       ├─► Metal X Lending Pool
       │     - Contractor working capital
       │     - Risk-scored by GCSC RAA
       │
       ├─► FedNow via Metallicus
       │     - Instant homeowner ↔ contractor
       │
       └─► TDBN Stablecoin
             - Escrow holding currency
             - Cross-border future
```

GCSC: marketplace + reputation + dispute. Metallicus: banking infrastructure. Clean split.

---

## Slide 11 — Why now

1. **Regulatory window opening.** CLARITY/GENIUS momentum. First-mover on compliance-built vertical.
2. **Construction industry bleeding cash.** 2025 data: 30% YoY increase in contractor bankruptcies.
3. **You're the only FedNow blockchain provider.** Window before traditional banks build their own.

Right startup × right infrastructure × right macro = right time.

---

## Slide 12 — The ask

Not funding. **Integration + joint pilot.**

**Phase 1 (Q4 2026):**
- Technical integration sandbox with Metal Blockchain testnet
- 5 Seattle pilot contractors use Metal X for working capital
- Joint announcement post-pilot

**Phase 2 (Q1 2027):**
- Production FedNow rail for milestone payments
- Open to all Seattle GCSC contractors
- Co-marketing: case studies, podcasts, press

**Phase 3 (2027+):**
- Portland, Austin, Denver, Miami expansion
- Joint token launch (post-regulatory)
- Metallicus = default banking rail GCSC nationally

---

## Slide 13 — What GCSC brings

| Contribution | Value |
|---|---|
| Vertical marketplace + brand | Distribution into $13T industry |
| AI credit scoring (RAA) | Better risk model than FICO for trades |
| Live testnet + roadmap to mainnet | De-risked integration |
| Compliance-first design from day one | Aligned values, easy due diligence |
| Construction industry domain expertise | Founder + advisory team |
| Open-source contracts | Auditable, transparent, no lock-in |
| Seattle pilot data | Concrete numbers within 90 days |

---

## Slide 14 — Next steps

1. **15-minute intro call** in next 2 weeks
2. **Technical diligence** by your team on contracts + backend
3. **Non-binding term sheet** for pilot, 30-day window
4. **Launch pilot Q4 2026**

Contact: [founder email] / [Twitter] / [website]
GitHub: https://github.com/Melxisedek75/gcsc-website
Whitepaper: https://github.com/Melxisedek75/gcsc-website/blob/main/whitepaper.html

---

## Appendix A — Marshall Hayner intel

**Background:**
- Co-Founder + CEO Metallicus (2017)
- Crypto pioneer since 2009 — built QuickCoin (early social Bitcoin wallet)
- Early Stellar contributor
- Board member, Dogecoin Foundation (2023)
- Co-sponsored Cryptocurrency Act of 2020 with Rep. Paul Gosar (AZ-4)

**What he cares about:**
- Compliance-first infrastructure for institutions
- "Onboarding next gen of crypto users" via simple UX
- Banks, credit unions, fintechs as customers
- Regulatory clarity via congressional engagement
- FedNow rail as Metal's moat

**Pain points voiced:**
- Banks don't know what to build on his infrastructure
- Adoption slower than tech capability
- Marketing complex infra to non-crypto business leaders

**Channels:**
- X: [@MarshallHayner](https://x.com/MarshallHayner) — responds to substantive DMs
- LinkedIn: [marshallhayner](https://www.linkedin.com/in/marshallhayner/) — 2nd-degree intros
- Press kit: https://cdn.metalpay.com/Marshall_Hayner_Press_Kit_2025.pdf
- Podcasts: Wharton FinTech, Milkroad, Yahoo Finance — слушать 1-2 перед звонком для tone matching

---

## Appendix B — How to send this

**DO NOT** send full 14-slide deck cold.

**DO:**
1. **Cold DM on X** — 4-6 sentences:
   > "Marshall — built a construction marketplace in Seattle using XPR rails. Live testnet, mobile app shipped, 11 contracts on chain. The boring B2B angle: $13T industry, contractors can't get working capital, your Metal X lending pool fits perfectly. 15 min to share a 1-page brief?"
2. If response → **2-page executive summary** (slides 1-5 condensed)
3. If interest → 15-min call
4. After call → full deck
5. After deck → technical diligence

**DON'T:**
- Lead with crypto/token language
- Ask for funding
- Bury FedNow / Metal X angle — crown jewels
- Send 50-page docs

---

## Appendix C — Checklist ДО отправки

- [ ] Бета-метрики Seattle (10 contractors, $X через эскроу) — реальные цифры
- [ ] Demo video (2-3 мин) — обязательно
- [ ] One-page executive summary для cold DM follow-up
- [ ] Полный 14-slide deck в Gamma/Canva/PPTX
- [ ] Technical one-pager про escrow контракт (для due diligence)
- [ ] Twitter / LinkedIn profile почищен и обновлён
- [ ] Repo gcsc-website в чистом состоянии (он будет смотреть)

---

## Appendix D — Worst case scenario

Если не отвечает или «not now»:
1. **Не сжигать мост.** Один follow-up через 2 мес с апдейтом (mainnet launch, цифры).
2. **Альтернативные partners:**
   - Stellar Development Foundation (Marshall ex-employee, может intro)
   - Avalanche (Layer 1 с subnet model)
   - Polygon (CDK chains для regulated finance)
3. **Trad-fi альтернативы:**
   - Mercury Bank (contractor accounts)
   - Goldfinch (decentralized lending)
   - Maple Finance (institutional lending)

Metallicus — лучший fit. Альтернативы — backup.
