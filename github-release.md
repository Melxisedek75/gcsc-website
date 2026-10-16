# GitHub Release & PR — Ready-to-use texts

---

## 🔀 Pull Request

### Title
```
chore: update whitepaper to v1.1 — hybrid credit & AI external brain
```

### Description (paste into PR body)
```markdown
## Summary

This PR publishes GCSC Whitepaper v1.1 — a significant protocol update introducing three production-ready infrastructure layers.

**Key additions:**
- **Hybrid Credit Infrastructure** — regulated lending + DeFi liquidity pools (0.5–2% APR, up to $500K, Equipment NFT collateral)
- **AI Credit Engine** — RAA ML underwriting with XGBoost + SHAP explainability, 5-signal credit scoring
- **External Brain** — LightRAG + Neo4j Knowledge Graph + MCP for persistent agent memory across sessions
- Updated System Architecture, Tokenomics distribution, Roadmap (Phase 1–4), and Risk Management sections
- Added Open Graph / Twitter Card meta tags for social sharing
- OG preview image (`assets/og-image.png`, 1200×630px)

**Files changed:**
- `whitepaper.html` — full v1.1 rewrite with 15 sections + OG meta tags
- `assets/og-image.png` — social preview image (new)
- `whitepaper-v1.1.pdf` — PDF version (attach to GitHub Release separately)

**After merge:**
1. Enable GitHub Pages: Settings → Pages → Branch: main → Folder: /root
2. Whitepaper URL: `https://melxisedek75.github.io/gcsc-website/whitepaper.html`
3. Verify OG preview: [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## Test plan

- [ ] Open `whitepaper.html` locally — verify all 15 sections render correctly
- [ ] Verify OG image loads at: `https://raw.githubusercontent.com/Melxisedek75/gcsc-website/main/assets/og-image.png`
- [ ] Check GitHub Pages URL after Pages is enabled
- [ ] Paste whitepaper URL into Twitter Card Validator — confirm preview shows image + correct title
- [ ] Paste whitepaper URL into Facebook Sharing Debugger — confirm OG tags parse correctly

🤖 Co-authored with Claude (Anthropic)
```

---

## 🏷 GitHub Release

### Tag
```
v1.1
```

### Release Title
```
Whitepaper v1.1 — Hybrid Credit · AI Underwriting · External Brain
```

### Release Body (paste into GitHub Release description)
```markdown
## GCSC Whitepaper v1.1

This release publishes the GCSC Whitepaper v1.1 — a major update to the protocol documentation and web publication.

### What's new in v1.1

**Hybrid Credit Infrastructure**
- Regulated lending rail (KYC/AML compliant) + DeFi liquidity pool (GCST + USDC)
- Loan tiers: Tier 1 ($50K, 0.5–1%) / Tier 2 ($150K, 1–1.5%) / Tier 3 ($500K, 1.5–2%)
- Equipment NFT collateral with IoT tracking
- <60 second disbursement via mppx-xpr-network machine payments

**AI Credit Engine**
- Risk Assessment Agent (RAA): XGBoost ML default prediction
- 5-signal credit scoring (payment history, project completion, collateral, license, staking)
- SHAP-based explainability for every credit decision
- Loans >$50K require human DAO committee approval

**External Brain**
- LightRAG: <200ms document retrieval, indexes all contracts + decisions
- Neo4j Knowledge Graph: entities, relationships, project history
- MCP (Model Context Protocol): persistent agent memory across sessions

### Assets

| File | Description |
|------|-------------|
| `whitepaper-v1.1.pdf` | Full whitepaper PDF (attach manually) |
| `whitepaper.html` | Web version (published via GitHub Pages) |
| `assets/og-image.png` | Social preview image 1200×630 |

### Deployment Status

- ✅ `gcsctoken111` — deployed on Proton Testnet
- ✅ `gcscmember11`, `gcscstake111`, `gcscinsure11`, `gcsctreasry1`, `gcsclead1111`, `gcscrealty11` — compiled
- ⏳ `gcscbuild11`, `gcscticket1`, `gcscbounty1` — compiled, accounts pending creation

### Links

- 📄 Whitepaper: https://melxisedek75.github.io/gcsc-website/whitepaper.html
- 🐙 Repository: https://github.com/Melxisedek75/gcsc-website
- 📧 Contact: gcscdao@gmail.com
```

---

## 🖥 Git Commands (run locally in your repo folder)

```bash
# 1. Убедитесь что вы в папке репозитория
cd /path/to/gcsc-website

# 2. Создайте ветку для обновления
git checkout -b update/whitepaper-v1.1

# 3. Добавьте новые файлы (уже находятся в папке)
git add whitepaper.html assets/og-image.png whitepaper-v1.1.pdf

# 4. Коммит
git commit -m "chore: update whitepaper to v1.1 — hybrid credit & AI external brain"

# 5. Пуш ветки
git push origin update/whitepaper-v1.1

# 6. Создайте тег релиза
git tag -a v1.1 -m "Whitepaper v1.1 — Hybrid credit & AI external brain"
git push origin v1.1
```

**После этого:**
1. GitHub.com → ваш репо → Pull Requests → New PR из `update/whitepaper-v1.1` в `main`
2. Вставьте PR description выше
3. После merge → Releases → Draft new release → тег `v1.1`
4. Вставьте Release Body выше, прикрепите `whitepaper-v1.1.pdf`
5. Settings → Pages → Branch: main → Save

---

## ✅ Publication Checklist

- [ ] `whitepaper.html` добавлен в репо
- [ ] `assets/og-image.png` добавлен в репо
- [ ] `whitepaper-v1.1.pdf` добавлен в репо
- [ ] PR открыт и слит в `main`
- [ ] Тег `v1.1` создан и запушен
- [ ] GitHub Release опубликован с PDF как attachment
- [ ] GitHub Pages включён (Settings → Pages → main / root)
- [ ] OG preview проверен: https://cards-dev.twitter.com/validator
- [ ] Facebook OG проверен: https://developers.facebook.com/tools/debug/
- [ ] Twitter нить опубликована (из social-posts.md)
- [ ] Pikabu пост опубликован (из social-posts.md)
- [ ] Telegram пост опубликован (из social-posts.md)
- [ ] Pinned tweet закреплён
