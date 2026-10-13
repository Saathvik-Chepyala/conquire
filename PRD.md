# Conquire — Frontend Prototype PRD

**Version:** 0.2 (approved with edits) · **Date:** 2026-10-13 · **Owner:** Saathvik (Prototype / Solution, with Chesson) · **Course:** ADV 332D

---

## 1. Summary

A clickable, local-only frontend prototype of **Conquire**, a marketplace where owners of very small businesses (valued under $100K) list without a broker, and first-time buyers browse anonymous teasers, sign a mock NDA, and read an AI-drafted memorandum.

- **Frontend only.** No backend, no real auth, no real AI, no payments.
- **All listings come from one JSON file** (`src/data/listings.json`). Add, remove, or edit a listing there and the site updates on reload.
- **Looks like the pitch deck** (teal / gold palette, serif headings) so the demo and the slides read as one product.
- **Runs with one command** on localhost.

Source documents: the site-layout outline ("Untitled document (14).pdf") and the ADV332D pitch deck.

### Decisions log (v0.1 → v0.2)
| Question | Decision |
|---|---|
| Launch wedge threshold | **Under $100K valuation**, not revenue. Sample valuations all sit below $100K; revenue varies. |
| Stack | **Vite + React + TypeScript + React Router** (plain web). |
| Logo | **Create one** (see §7.1). Text wordmark + mark, SVG, used in header, landing, favicon. |
| Seller submissions in buyer grid | **No.** Buyer grid reads sample data only. Wizard ends at memo preview + success state. |
| Operator table view | **Out of v0.** |
| Page size / sample count | 8 per page, 14 listings. |

---

## 2. Goals and non-goals

### Goals
1. Demonstrate the three flows from the layout doc end to end:
   - Landing → choose Buyer or Seller
   - Buyer marketplace → listing teaser → NDA checkbox → confidential memo
   - Seller login → listing intake form → AI-memo preview
2. Make sample data trivially editable without touching code.
3. Match the deck's visual language, with a real logo.
4. Work on a laptop screen for the pitch and degrade gracefully on a phone.

### Non-goals (v0)
Real authentication, e-signature NDA, real valuation/memo generation, QuickBooks/Stripe/Shopify connections, messaging, data room, LOI templates, seller Q&A threads, saved searches, operator table view, seller submissions feeding the buyer grid, persistence to a backend. Where the deck promises these, they appear as labeled placeholders.

---

## 3. Users (from the deck)

| Persona | Who | What they need from the prototype |
|---|---|---|
| **Buyer** | First-timer "buying a job," shops within ~20 miles, distrusts broker numbers | Plain-English metrics, anonymous teaser, numbers that cite a source, a clear "what do I unlock after NDA" moment |
| **Seller** | Owner of a business worth under $100K (eCommerce or service), no idea what it is worth, can't pay a $10–25K broker minimum | A guided form that collects everything a buyer will see and shows a valuation range + memo draft at the end |

Launch wedge (deck slide 4, corrected): businesses **valued under $100K**, eCommerce and service first, Texas as a possible first market. **Sample data reflects this**: Texas-heavy, mostly eCommerce and service, every valuation range tops out below $100K.

---

## 4. Routes and pages

| Route | Page | Source |
|---|---|---|
| `/` | Landing — pick Buyer or Seller | Layout §1 |
| `/buy` | Buyer home — marketplace grid, survey pop-up, filters, pagination | Layout §2a–c |
| `/buy/:id` | Listing teaser → NDA gate → confidential memo | Layout §2d |
| `/sell` | Seller login (mock) | Layout §3a |
| `/sell/new` | Seller intake wizard → memo preview | Layout §3b, deck slides 5–7 |

Persistent header on every page except landing: Conquire logo (links to `/`), "Browse" (`/buy`), "Sell a business" (`/sell`).

Persistent footer: "Valuations are estimates, not appraisals. Conquire is not a licensed broker." plus a "Reset demo" link (clears NDA and buy-box state).

---

## 5. Functional requirements

### 5.1 Landing (`/`)
- Conquire logo + headline **"Selling a very small business shouldn't need a broker."**
- Two large cards: **I'm buying** → `/buy` · **I'm selling** → `/sell`.
- Row of three stat tiles from the deck beneath (35% of owners had no idea what their business was worth · $10–25K typical broker minimum · 90% vs 29% on seller financing). Static.

### 5.2 Buyer home (`/buy`) — "Facebook Marketplace format"
**Buy-box survey (pop-up)**
- Opens automatically on first visit; dismissible; re-openable via an "Edit my buy box" button in the filter bar.
- Three questions (layout §2b):
  1. **What type of businesses?** multi-select chips: eCommerce, Service, Retail, Food & Beverage, Digital, Other
  2. **Financial profile:** budget (one of: under $25K · $25–50K · $50–100K) and minimum annual owner earnings (SDE), optional number
  3. **Industry:** multi-select chips built from the industries present in the JSON
- Answers are the buyer's **buy box**, saved in `localStorage`. They pre-fill the filter bar and drive the **match score** on each card (deck slide 9).
- Match score (0–100): business-type match 40 · industry match 30 · valuation overlaps budget 30. Shown as a chip ("92% match"). Hidden until a buy box exists.

**Filter bar** (always visible, wraps on mobile)
- Business type · Industry · State · Price (valuation) · Min owner earnings (SDE) · Min gross margin · Sort (Best match / Newest / Price low→high / Price high→low)
- "Clear filters" link. Filters apply client-side to the JSON array.

**Listing grid**
- Responsive cards: 4 columns ≥1280px, 3 at ≥960px, 2 at ≥640px, 1 below.
- Card content (teaser only, **no business name, no URL**): category cover (color + icon by category, no photos), category + platform badges, **tagline**, **valuation range**, location, revenue range, growth-trend arrow, age, match score chip.
- Click → `/buy/:id`.
- **Pagination:** 8 per page (one constant), prev / next + numbered pages, scrolls to top on change.
- Empty state when filters exclude everything, with a "Clear filters" action.

### 5.3 Listing teaser (`/buy/:id`)
**Teaser section (always visible)** — the seven items from layout §2d(i) plus deck slide 8 teaser fields:
- Hero: category, tagline, location, platform, age, reason for sale.
- **Valuation range** card (deck slide 6): "$20K – $35K", a range bar with a marker, **Confidence: Low / Medium / High** with a one-line explanation, and the "estimate, not an appraisal" label.
- Metric grid: Revenue (TTM) · Margin profile (gross %, SDE %) · Revenue streams / products (name + % share as small bars) · YoY growth · Years in business · Location · Hours per week to run.
- "What pushes this value up or down" bullets from the JSON.

**NDA gate** (layout §2d(ii))
- Panel: short NDA summary, checkbox **"I agree to the Conquire NDA and will keep this information confidential"**, button **Unlock confidential details** (disabled until checked).
- On unlock: confidential section expands in place; a "NDA signed" badge appears. State saved in `localStorage` per listing so refresh keeps it unlocked; footer "Reset demo" clears it.

**Confidential section (after NDA)**
- **Business name** (and URL if present).
- **Confidential Information Memorandum** — "Drafted by Conquire AI · confirmed by seller on <date>" badge. Sections (deck slide 7): Executive summary · Business overview · Industry & market · Growth opportunities · Transition plan · Draft asking price. A **Key figures** table lists each headline number with its **source** ("Shopify payouts, Jan–Dec 2025") to show the deck's "every number links to a source" promise. A **Flagged, not guessed** list shows any gaps the seller still owes.
- **More specifics** (layout §2d(ii)3): Customer profiles · Revenues (table, last 3 years) · Expenses (table by category) · Ownership · Headwinds / Tailwinds (two columns).
- **Serious-buyer next steps** (deck slide 8, col 3): Data room · Call with the seller · LOI template — disabled "Coming soon" buttons.

### 5.4 Seller login (`/sell`)
- Email + password fields, **Log in** and **Create account** buttons. Any non-empty input proceeds to `/sell/new`. A note says it is a demo login.

### 5.5 Seller intake wizard (`/sell/new`)
Mirrors the deck's five-step flow (slide 5) and collects every field the buyer can see.

| Step | Title | Fields |
|---|---|---|
| 1 | Basics | Business name, URL (optional), business type, industry, city/state, year founded, platform, tagline, reason for sale |
| 2 | Financials | Trailing-12-month revenue, gross margin %, owner earnings (SDE), YoY growth %, revenue streams (name + %) · "Connect financials" row with QuickBooks / Stripe / Shopify placeholder buttons |
| 3 | Operations | Hours per week to run, ownership, customer profiles, headwinds, tailwinds |
| 4 | Confidential details | Expenses by category, add-backs (owner salary, one-time expenses), anything to flag as unverified |
| 5 | Review & memo preview | Computed **valuation range** (SDE × low/high multiple; confidence rises with completeness), auto-assembled **memo draft**, checkbox "I confirm these financials and add-backs," button **Submit for sign-off** → success state |

- Progress indicator (1–5), back/next, values persist across steps within the session.
- Submission does **not** feed the buyer grid (decision above).

---

## 6. Data model — `src/data/listings.json`

One array of listing objects. Everything on the site derives from this file. TypeScript types live in `src/data/types.ts`; a small runtime validator runs on load and throws a readable error naming the listing id and the bad field, so a typo in the JSON fails loudly instead of rendering blank.

```jsonc
{
  "id": "tx-candle-01",                 // unique, used in the URL
  "createdAt": "2026-09-28",            // drives "Newest" sort
  "teaser": {
    "category": "eCommerce",            // eCommerce | Service | Retail | Food & Beverage | Digital | Other
    "industry": "Home goods",           // free text; filters are built from the values present
    "tagline": "Profitable Shopify candle brand with 38% repeat customers",
    "location": { "city": "Austin", "state": "TX" },
    "platform": "Shopify",
    "yearsInBusiness": 4,
    "reasonForSale": "Owner relocating abroad",
    "revenueRange": "$60K–$80K",
    "profitRange": "$20K–$30K",
    "growthTrend": "up",                // up | flat | down
    "valuation": { "low": 42000, "high": 61000, "confidence": "Medium",
                   "confidenceNote": "Verified Shopify data; few comparable sales in this niche." },
    "metrics": {
      "revenueTTM": 71400, "grossMarginPct": 62, "sdeMarginPct": 34,
      "revenueStreams": [ { "name": "Online store", "sharePct": 78 }, { "name": "Wholesale", "sharePct": 22 } ],
      "yoyGrowthPct": 18, "hoursPerWeek": 12
    },
    "valueDrivers": [ "38% repeat-customer rate", "Top customer is 4% of revenue" ]
  },
  "confidential": {
    "businessName": "Hill Country Wick Co.",
    "url": "hillcountrywick.com",
    "memo": {
      "confirmedOn": "2026-10-02",
      "executiveSummary": "...", "businessOverview": "...", "industryAndMarket": "...",
      "growthOpportunities": [ "..." ], "transitionPlan": "...",
      "askingPrice": 55000,
      "keyFigures": [ { "label": "Revenue (TTM)", "value": "$71,400", "source": "Shopify payouts, Jan–Dec 2025" } ],
      "flaggedGaps": [ "2023 tax return not yet uploaded" ],
      "sources": [ "Shopify payouts, Jan–Dec 2025", "2025 Schedule C" ]
    },
    "customerProfiles": [ "..." ],
    "revenues": [ { "year": 2023, "amount": 48200 }, { "year": 2024, "amount": 60500 }, { "year": 2025, "amount": 71400 } ],
    "expenses": [ { "category": "COGS", "amount": 27100 } ],
    "ownership": "Single owner, 100%",
    "headwinds": [ "..." ], "tailwinds": [ "..." ]
  }
}
```

**Sample set:** 14 listings (two pages at 8 per page). Mix: ~8 eCommerce, ~4 service, ~2 other; ~10 in Texas, ~4 elsewhere; **every valuation high end < $100K**; revenue anywhere from ~$20K to ~$180K; confidence spread across Low / Medium / High; growth spread across up / flat / down.

Image handling: no photos. Each category maps to a color + icon cover so adding a listing never requires an asset.

---

## 7. Design

- **Palette (sampled from the deck):** teal `#1B4D4C` (headings, primary buttons), deep teal `#143B3A` (dark panels), page background `#E9EEF0`, card white, gold `#B5924C` (accents, match score, value marker), ink `#1F2A2A`, muted `#5C6B6B`, red only for flagged/unverified.
- **Type:** Lora (serif) for headings, Inter for body and numbers. Loaded from Google Fonts.
- **Components:** rounded 16px tiles with no border and a soft shadow (deck tiles), pill chips for badges/filters, number-first stat tiles.
- **Layout:** max content width 1200px, 24px gutters, 16px on mobile.

### 7.1 Logo
- **Mark:** two overlapping circles lifted from the deck's title slide. Gold circle = seller, teal circle = buyer, the deep-teal lens where they overlap = the deal. Reads at 16px (favicon) and 40px (header).
- **Wordmark:** "Conquire" in Lora bold, teal.
- **Files:** `src/components/Logo.tsx` (inline SVG, sizes: header / hero), `public/logo.svg` (standalone, for slides), `public/favicon.svg` (mark only).

---

## 8. Tech stack and local run

**Vite + React 19 + TypeScript + React Router 7.** No UI library; plain CSS with custom properties. Dependencies: react, react-dom, react-router-dom (runtime); vite, @vitejs/plugin-react, typescript (dev).

```bash
cd "ADV 332D/conquire"
npm install
npm run dev        # http://localhost:5173
```

`npm run build` type-checks and produces a static `dist/` that can be dropped on any static host later. No environment variables, no services, no accounts.

---

## 9. Project structure

```
ADV 332D/
├── PRD.md                        ← this document
└── conquire/
    ├── index.html                fonts, favicon, root div
    ├── package.json · vite.config.ts · tsconfig.json
    ├── public/logo.svg · public/favicon.svg
    └── src/
        ├── main.tsx · App.tsx    router + layout shell
        ├── pages/                Landing, BuyHome, ListingDetail, SellLogin, SellNew
        ├── components/           Logo, Header, Footer, ListingCard, FilterBar, BuyBoxModal,
        │                         ValuationRange, StatTile, Pagination, NdaGate, MemoView, Chip, Wizard steps
        ├── data/
        │   ├── listings.json     ← EDIT THIS to change sample listings
        │   ├── types.ts          Listing type
        │   ├── validate.ts       runtime check with readable errors
        │   └── categories.ts     category → color / icon
        ├── lib/                  filters.ts, matchScore.ts, valuation.ts, storage.ts, format.ts
        └── styles/global.css     tokens + base + component styles
```

Git: this folder is inside a repository rooted at the home directory. The app gets its own `git init` inside `conquire/` so its history stays separate.

---

## 10. Acceptance criteria

1. `npm run dev` serves the site on localhost with no console errors; `npm run build` passes typecheck.
2. Landing shows the logo and two choices; each routes to the right page.
3. `/buy` opens the survey once, filters and match scores reflect the answers, cards never show a business name, and pagination works across the 14 listings.
4. Every filter in the bar changes the grid; "Clear filters" restores it.
5. `/buy/:id` shows the seven teaser metrics and the valuation range with confidence; the confidential block is hidden until the NDA box is checked and the button pressed, then shows name, memo with sourced key figures, and the five "more specifics" groups.
6. NDA state survives refresh; "Reset demo" clears it.
7. `/sell` accepts any input; `/sell/new` walks five steps, computes a valuation range, previews a memo, and ends in a success state.
8. Editing or adding a listing in `src/data/listings.json` (and nothing else) changes the site after reload; a malformed listing fails with a message naming the id and field.
9. Every sample valuation stays under $100K.
10. Layout holds at 1440px, 1024px, and 375px widths.

## 11. Later (not in v0)
Operator table view · saved searches · side-by-side compare · due-diligence checklist · seller Q&A thread · data room · LOI template · real NDA signature · seller submissions feeding the grid · backend persistence · AI valuation and memo generation.
