# Conquire — frontend prototype

Clickable, local-only prototype for the ADV 332D pitch. Frontend only: no backend, no real auth, no real AI.
Spec: `../PRD.md`.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
```

`npm run build` type-checks and writes a static `dist/` you can drop on any static host.

## Change the sample listings

Edit **`src/data/listings.json`** and save. Nothing else needs to change.

- The field shape is documented in `src/data/types.ts`.
- A validator runs on load; if a listing is malformed, the site shows an error page naming the listing id and the bad field.
- Rules the validator enforces: unique `id`, `valuation.high` under $100,000, revenue stream shares add to 100, and no business name inside the teaser (teasers must stay anonymous).
- Filters (industry, state) are built from whatever values are present in the file.
- Listings per page is `PAGE_SIZE` in `src/lib/filters.ts`.

## Routes

| Route | Page |
|---|---|
| `/` | Landing: buyer or seller |
| `/buy` | Marketplace grid, buy-box survey, filters, pagination |
| `/buy/:id` | Teaser → NDA checkbox → confidential memo |
| `/sell` | Demo login (any input works) |
| `/sell/new` | 5-step seller wizard → valuation range + memo preview |

"Reset demo" in the footer clears the saved buy box and NDA state.

## Logo

`public/logo.svg` (wordmark + mark, for slides) and `public/favicon.svg` (mark only). The React version is `src/components/Logo.tsx`.
