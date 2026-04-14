# Automotive Marketplace Demo

Demo-ready buyer/seller marketplace for automotive file exchange.

## What Works

- Buyer and seller workspace toggle in the header.
- Buyer request creation with file upload.
- Seller blind bidding on open requests.
- Buyer offer acceptance and demo checkout (no real payment).
- Seller delivery upload and buyer file download.
- Buyer-seller request thread messaging.
- Delivery confirmation and dispute creation.
- Admin dispute status workflow.
- Local persistence in browser `localStorage`.

## Tech

- React + TypeScript + Vite
- Vercel-friendly SPA deployment
- Supabase client scaffold included (`src/lib/supabase.ts`)

## Local Run

1. Install dependencies:
   - `npm install`
2. Create env file:
   - `cp .env.example .env`
3. Start app:
   - `npm run dev`

## Build & Quality Checks

- `npm run lint`
- `npm run build`

## Supabase / Vercel Notes

- Configure on Vercel project:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Current demo works without backend writes by using local browser persistence.
