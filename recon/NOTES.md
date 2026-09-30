# Higgsfield Recon — Authenticated Pass (2026-09-30)

Observed directly with an authenticated Playwright session against https://higgsfield.ai
(account: `responsivecapybara_nitro`, Free Plan, 0/2 credits remaining). Screenshots in
this folder, prefixed `auth-*`. An earlier logged-out pass is preserved below under
"Logged-out pass" for reference.

## 1. Product overview

Higgsfield is a broad "AI-native creative suite": text/image-to-image, text/image-to-video,
audio, a community/explore feed, a marketing-studio vertical, a 3D tool, a canvas/layers
editor, an MCP/API surface for agent integration, and a project/asset library — all bolted
onto a hard credit-metered paywall. The site's own nav lists ~20 top-level destinations,
which is itself a finding (see "Opportunities to improve").

## 2. Core user journey (as designed)

1. Land on `/` → browse Explore feed / promo carousel.
2. Pick a tool (Image or Video) from top nav.
3. Type a prompt, optionally attach references, tune settings chips (model, aspect ratio,
   quality/resolution, duration for video).
4. Hit Generate → spend credits → see a queued/loading state → get a result.
5. Act on the result: favourite, download, extend/edit, or send to another tool.
6. Everything generated is auto-saved into Assets (library), organized by date and by
   user-created "projects" (folders).

## 3. Major screens and flows inspected

### 3.1 Home / Explore (`/`)
- Authenticated header differs from logged-out: "Login/Sign up" buttons are replaced by
  an **Assets** shortcut, a **Notifications** bell, and an **Account menu** avatar.
- Promo banner ("Offer expires in HH:MM:SS … 54% OFF") persists across nearly every page,
  authenticated or not — it's global chrome, not page content.
- Hero is a rotating promo carousel (API cashback, MCP bundle, GPT-6 Astra ads, Genjutsu),
  not product explanation — a marketing-first landing page, not an onboarding flow.

### 3.2 Image generation tool (`/ai/image?model=...`)
- Empty state: near-blank dark canvas, prompt bar docked to the bottom.
- Prompt bar: textarea ("Describe the scene you imagine"), `+`/`@` reference/element
  attach buttons, then a horizontally scrollable row of setting chips: model picker,
  aspect ratio, quality, resolution, an "Auto" chip, and a count stepper (1/4).
- **Aspect ratio** opens a dropdown with icon + label per ratio: Auto, 1:1, 3:2, 2:3,
  16:9, 9:16, 4:3, 3:4, 21:9 — each icon literally shaped like the ratio.
- **Generate button shows live credit cost** inline, including a struck-through original
  price next to a discounted price (e.g. `8.5` → `6.5`), reinforcing the promo constantly.
- Switching models (GPT Image 2 → Nano Banana) changes the whole settings row (Nano
  Banana drops quality/resolution chips, adds a "Draw" mode instead).

### 3.3 Paywall / monetization surfaces (major finding)
On a **Free Plan account with 0 credits**, nearly every meaningful action triggers a
paywall rather than the actual product:
- Clicking Generate on **GPT Image 2** → "Unlock GPT Image 2.0" plan modal (Basic/Pro/Max
  tiers, annual/monthly toggle, promo code auto-applied, countdown timer).
- Clicking Generate on **Nano Banana** (nominally a lower-tier model) → same paywall
  pattern, "Unlock Nano Banana."
- A **toast** ("Credits are running low! All credits used" + Upgrade button) is present
  persistently in the bottom-right across every authenticated page, not just generation
  screens.
- An **unprompted upsell modal** ("Plans with up to 2,000 bonus credits") appeared while
  simply trying to open the aspect-ratio dropdown — it was not triggered by any specific
  action, just page load / navigation.
- Account menu shows **Credits: 0 left** with a dotted progress bar and a "Go Premium /
  Upgrade" row baked directly into account navigation.
- **Result: we could not complete a real end-to-end generation** with the available
  account. Result/processing/error states below are reconstructed from the video tool's
  History (a pre-existing successful generation) and the public community project pages,
  not from a live generation on this account.

### 3.4 Consent / legal gate (bug found)
- A "Our terms have changed" consent dialog (checkbox + "I agree") appeared once, but
  its DOM node was marked `aria-hidden="true"` and rendered **behind** an open
  aspect-ratio dropdown — a real accessibility/z-index bug. Closing the dropdown first
  was required to interact with the dialog.

### 3.5 Assets / library (`/assets`, `/asset/all`)
- Left rail: **Assets** vs **Favourites** counts, a **Tools** section breaking counts
  down by type (Image / Video / Audio), and a per-user **projects** tree (folders,
  each with its own count) — e.g. "New project", "First project" ×2.
- Main panel: a **date-grouped grid** ("December 15, 2025" header with a select-all
  checkbox), each card showing a hover-scrub video preview, a favourite heart, a
  checkbox for bulk select, and a "..." overflow menu.
- Grid supports a **card-size slider** and a "Fit previews" toggle (top-right).
- Clicking a card did **not** open a dedicated lightbox/detail route in this account —
  it scrubbed the inline video preview instead. (A full detail/result view does exist —
  see 3.6 — reached via the tool's own History tab, not from the global Assets page.)

### 3.6 Video generation tool (`/ai/video`) — richest surface observed
- Three-tab left panel: **Create Video / Edit Video / Motion Control**.
- "Create Video" shows a selected style/preset (e.g. "GENERAL — Seedance 2.5") with a
  "Change" affordance, then **References vs Extend Video** sub-tabs, an "Add references"
  drop zone (Image/Video/Audio), a prompt box with placeholder guidance text, a
  Model picker, then chips for duration (5s), aspect ratio (16:9), resolution (1080p),
  and a separate Bitrate row (High). Generate shows the credit cost inline (80→60).
- Right side of the screen is a **canvas + History/"How it works" tab bar**. Selecting
  **History** shows the account's one real prior result full-size, with a play-button
  overlay, and a right-hand rail of **Transitions** (alternate-take thumbnails) plus
  quick metadata (resolution, duration) and the date group — this is the actual
  "generated result" viewer pattern for video.
- **Edit Video** tab reframes the same canvas as a tool picker: Edit Video (targeted
  changes), Extend Video, Reframe, Upscale, Remove Background (NEW), SDR to HDR (NEW),
  FPS Boost (NEW), Depth Map (NEW). This is the refinement/post-processing surface.

### 3.7 Public community project page (`/@user/projects/slug`)
No auth/credits required, and the richest **result page** pattern seen:
video player with brand watermark overlay, title, author card with Follow button,
an Information block (Views, Generations, Created time), a "Powered by <tool>" credit,
engagement row (likes, comments, Share, overflow menu), and a "Recommended" sidebar of
other projects. This is a good reference for what a polished, shareable result page
looks like, decoupled from the paywalled creation flow.

### 3.8 Pricing (`/pricing`)
Three tiers (Basic/Pro/Max) with monthly/annual toggle, credit allotments translated
into rough model-generation equivalents ("= 300 Nano Banana Pro Generations", "~ 27
Seedance 2.0 videos"), bonus credits with an explicit expiry date, and a promo code
banner state that persists from the generation paywall modals.

## 4. Key UI patterns

- **Chip-based settings row** for every generation tool (model / ratio / quality /
  resolution / duration), horizontally scrollable, each chip opens its own small popover
  — not a single settings panel.
- **Credit cost shown inline on the primary action button** at all times (struck-through
  original price + discounted price), not on a separate summary step.
- **Global floating toast** for account-state nudges (low credits), independent of
  whatever page/tool is active.
- **Tabs for creation mode** (Create / Edit / Motion Control for video) rather than
  separate top-level pages — keeps the user in one workspace.
- **Date-grouped history/grid** as the universal way past work is organized, both in the
  global Assets library and inside a specific tool's History tab.
- Dark, near-black canvas as the default backdrop for every creation surface.

## 5. Important interaction/state behavior

- **Empty state:** near-blank canvas + prompt bar only; no onboarding walkthrough beyond
  a dismissible "Don't know where to start? Go to the Academy" banner.
- **Loading state:** page-level route transitions show a centered spinner (captured on
  `/assets`); a generation-in-progress state (queued/spinner card) was observed in the
  earlier logged-out pass but not re-triggered here since credits are exhausted.
- **Paywall state:** the dominant "error-like" state for a free account — modal takeover
  with pricing tiers, not a small inline error. This is arguably a UX/business decision
  more than a bug, but it does mean the *product* experience for a free user is mostly
  about plans, not about creating.
- **Result state (video, from History):** large canvas preview, play affordance,
  transitions rail, resolution/duration metadata, grouped by date.
- **Consent-gate state:** one-time modal, but has a z-index/aria bug (see 3.4).

## 6. Feature inventory (what exists)

Explore feed, Image generation (multiple models: GPT Image 2, Nano Banana, Nano Banana
Pro, Seedream, Flux Kontext, Wan 2.2, etc.), Video generation (Seedance 2.5/2.0, Kling,
Veo, Sora 2, MiniMax, Genjutsu "reality manipulation" presets), Video edit/refinement
suite (edit, extend, reframe, upscale, remove background, SDR→HDR, FPS boost, depth map),
Motion Control, Audio, Cinema Studio, Marketing Studio, Lipsync Studio, Photodump Studio,
Fashion Factory, UGC Factory, Storyboard ("Popcorn"), Canvas/Layers editor, Soul
(character/persona) system, 3D Jutsu, Effects preset library, Contests, Community/Explore
feed with per-project public pages, Academy (learning content), Creator Hub / Help
Center, Enterprise/Team plans, MCP server + CLI + API + ChatGPT plugin, browser
reference extension, Assets/library with projects/folders, Notifications, Account/
billing management, Affiliate program.

## 7. What we should build for the assignment

Given a ~24h window and the evaluator's explicit "don't just clone the UI" instruction,
the highest-value slice to reproduce is the **core creation loop**, done well, not the
full surface area:

- A single, polished **prompt-to-image generation flow**: prompt input, a small number
  of real settings (aspect ratio + one style/model choice), a Generate action with a
  visible cost/limit concept, a genuine loading state, and a real rendered result.
- A **result view** modeled after the community project page (3.7) and the video
  History panel (3.6): big preview, clear metadata, obvious next actions (favourite,
  download, "make another"), rather than a bare image dump.
- A **lightweight history/library** (date-grouped grid, like 3.5), since that's what
  makes the tool feel like a real product rather than a single-shot demo.
- A simple, honest **credit/usage mechanic** (even if just a soft local counter) — the
  assignment's own product clearly treats this as core to the experience, and it's cheap
  to build well if scoped small (no real billing, just a visible, correctly-behaving
  counter and a clear empty/zero state).

## 8. What we should deliberately leave out

- Video generation, audio, 3D, Motion Control, Canvas/Layers editor, Marketing/Lipsync/
  Photodump/Fashion/UGC "Factories", Storyboard, Contests, Academy, Affiliate program,
  Enterprise/Team plans, MCP/API/ChatGPT plugin, browser extension, multi-model catalog
  (20+ image/video models) — all real Higgsfield features, all secondary to the core
  loop, and individually low-value to reproduce under a 24h deadline.
- Real payment processing / plan tiers — fake a credit counter instead of building
  Basic/Pro/Max billing.
- The ~20-item top nav — collapse to the handful of routes we actually implement.

## 9. Opportunities to improve the original UX

- **Nav overload:** ~20 top-level items competing for attention on first load; a focused
  product should expose 3–5 clear destinations.
- **Paywall-as-primary-experience:** for a free user, the dominant "state" of the product
  is upsell modals, not creation. A friendlier free tier (even a tiny one) would make the
  product feel usable rather than gated.
- **Unprompted upsell modal timing:** the "2,000 bonus credits" modal fired without a
  clear user-triggered cause, interrupting a settings interaction — better UX would tie
  upsells to a specific blocked action, not ambient page state.
- **Consent dialog z-index/aria bug** (3.4): should never render behind another open
  overlay or be marked `aria-hidden` while functionally requesting input.
- **Assets grid affordance:** clicking a thumbnail scrubs the video instead of opening a
  clear "view details" action — the actual rich result view is hidden inside each tool's
  own History tab instead of being reachable from the global library, which is
  inconsistent and easy to miss.

## 10. Recommended MVP implementation order

1. App shell: layout, nav (Create / Library), dark theme baseline.
2. Prompt input + minimal settings (aspect ratio, one model/style toggle) + Generate
   button with inline cost display.
3. Client-side credit/usage counter with a real zero-credit state (styled, not a raw
   error) — mirrors the one authentic mechanic we can fully control end-to-end.
4. Generation pipeline: submit → loading/queued state → real result (via a real image
   generation API) rendered in a result view (big preview + metadata + actions).
5. Library/history: date-grouped grid of past generations, favourite toggle.
6. Polish pass: transitions/animation, empty states, error states, responsive check.
7. Only if time remains: a second creation mode (e.g. simple image-to-image edit) reusing
   the same result/library plumbing.

## 11. Screenshots captured (this pass)

- `auth-01-home.png` — authenticated home, header differences.
- `auth-02-image-tool.png` — Image tool empty state, cookie dialog.
- `auth-03-image-prompt-filled.png` — prompt entered.
- `auth-04-aspect-ratio-menu.png` — aspect ratio dropdown + hidden terms dialog bug.
- `auth-05-stuck-overlay.png` / `auth-06-generating.png` — unprompted upsell modal, then
  "Unlock GPT Image 2.0" paywall on Generate.
- `auth-07-nanobanana.png` — Nano Banana empty state + "all credits used" toast.
- `auth-08-no-credits-error.png` — "Unlock Nano Banana" paywall.
- `auth-09-assets-library.png` / `auth-10-assets-loaded.png` — Assets loading → loaded
  (date-grouped grid, sidebar counts/projects).
- `auth-11-asset-detail.png` / `auth-12-asset-click-result.png` — hover controls and
  scrub behavior on an asset card.
- `auth-13-community-project-detail.png` — public project/result page pattern.
- `auth-14-video-tool.png` — Create Video panel.
- `auth-15-video-history-tab.png` — real result viewer (History tab).
- `auth-16-video-edit-tab.png` — refinement tool menu.
- `auth-17-pricing.png` — pricing tiers.
- `auth-18-account-menu.png` — account menu, 0 credits, Free Plan.

---

## Logged-out pass (2026-09-30, earlier — preserved for reference)

Observed directly with Playwright at https://higgsfield.ai. Screenshots `recon-*`.

### Landing / Explore (`/`)
- Cookie consent dialog covers bottom-right and **intercepts clicks on the Generate button** until dismissed.
- Promo bar ("additional discount after signing up"), then a top nav with ~20 items: Explore, Image, Video,
  Audio, MCP, API, ChatGPT Plugin, Genjutsu, Effects, Cinema Studio, Contests, Marketing Studio,
  Supercomputer, 3D Jutsu, Edit, Academy, Community, Plugins, Canvas, Originals. Nav overflows/clips at 1680px.
- Hero area is a carousel of promo cards (API cashback, skills bundle, ...), not an explanation of the product.

### Image tool (`/ai/image?model=gpt_image_2`) (01-02)
- Empty state: a spinner, then a mostly empty dark canvas with the prompt bar docked to the bottom.
- Prompt bar: textarea ("Describe the scene you imagine"), `+` references, `@` elements, then chips:
  model (GPT Image 2), aspect ratio (Auto), quality (High), resolution (2K), an unlabeled "Auto" chip, count (1/4 stepper).
- **Generate button shows credit cost inline** (8.5 struck through, 6.5 shown = discounted).
- Console shows 7 errors on load (not ours to fix, but noted).

### Generate while logged out (03-04)
- Clicking Generate works without an account: a placeholder card appears with an "In queue" spinner.
- After ~8s the result is **blurred behind "Create an account to see generated image / Sign up for free"**.
  The wall is a conversion mechanic: user invests a prompt, then is gated at the payoff moment.
