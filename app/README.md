# Lumen — AI Image Studio

**Live:** https://app-one-eta-89.vercel.app
**Repo:** https://github.com/UzairRehman4/higgsfield-assignment

A focused, Higgsfield-inspired AI image creation product, built for the 8x
"clone a live product in 24 hours" assignment. Not a pixel clone — see
`../recon/NOTES.md` for the authenticated product research this is based on,
and the product-judgement writeup for what was deliberately built vs. cut.

## What this is

A single, polished creation loop: **prompt → settings → generate → loading →
result → actions → history**, plus a client-side credit system. There is no
backend and no external AI API — every "generation" is a deterministic,
seeded generative-art render produced entirely in the browser via `<canvas>`
(see `src/lib/generative.ts`). This is an intentional choice, not a shortcut
disguised as a real model: the assignment explicitly asked for a convincing,
reliable demo that a stranger can run with zero setup, no API keys, and no
billing risk, rather than a wrapper around a paid API someone else has to
configure and pay for.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Zustand (with `persist`) for credits + generation history, stored in
  `localStorage` — everything is per-browser, nothing is sent to a server.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview   # serve the production build locally
```

Output is a static `dist/` folder — deployable to Vercel, Netlify, GitHub
Pages, or any static host. No environment variables, no secrets, no API keys.

## Structure

- `src/lib/generative.ts` — the seeded generative-art renderer (palettes,
  composition, style/keyword biasing).
- `src/lib/types.ts` — aspect ratios, styles, the `Generation` model.
- `src/store/useAppStore.ts` — credits + generation history, persisted.
- `src/components/CreateWorkspace.tsx` — the main creation flow and its
  loading/result/error state machine.
- `src/components/ResultOverlay.tsx` — the full detail view (also used from
  the library).
- `src/components/LibraryView.tsx` — date-grouped history grid with a
  favorites filter.
