# Product judgement — Lumen (Higgsfield-inspired image studio)

See `recon/NOTES.md` for the authenticated research this is based on. This
file is the "why we built what we built" — the KEEP / CUT / CHANGE / ADD
reasoning the evaluator explicitly asked for.

## KEEP (patterns worth reproducing)

- **Chip-based settings row** for aspect ratio and style — fast to scan,
  fast to change, doesn't bury controls in a modal.
- **Inline credit cost on the Generate button** — cost is visible before you
  commit, not revealed after.
- **Result view as a first-class screen**, not a bare image: prompt,
  metadata, and actions together (modeled on Higgsfield's community project
  page and video History panel — recon 3.6/3.7).
- **Date-grouped history grid** as the single way past work is organized.

## CUT (deliberately not built)

Video, audio, 3D, Motion Control, Canvas/Layers, the "Factory" verticals
(Marketing/Lipsync/Photodump/Fashion/UGC), Contests, Academy, MCP/API,
real billing/plan tiers, and Higgsfield's ~20-item navigation. All real
features of the original product; all secondary to a single polished
creation loop, and individually low-value to half-build under a 24h
deadline. Building one thing well beats scaffolding ten things badly.

## CHANGE (reinterpreted, not copied)

- **Generation engine:** Higgsfield calls real external models. We do not
  call any external AI API — see the Technical decision note below for why.
  Instead, "generate" runs a deterministic, seeded generative-art renderer
  in the browser. It is presented honestly as what it is (see the empty
  state and this doc), not disguised as a real diffusion model.
- **Credits:** real product has real billing tiers and a hard paywall that
  (per recon) dominates the free-tier experience. We kept the *mechanic*
  (visible balance, cost-per-generation, blocked generation at zero) but
  replaced real billing with an explicit, labeled local reset — honest
  about being a demo balance, not disguised as real payment.
- **Navigation:** collapsed from ~20 top-level items to two: Create and
  Library.

## ADD (fixes to friction found during recon)

- Recon found an upsell modal that could interrupt an unrelated interaction
  (opening a dropdown) and a terms-consent dialog rendered behind another
  open overlay. Lumen has no unprompted modals: the only overlay is the
  result detail view, opened by explicit user action, closable by click-out
  or Escape.
- Recon found that clicking an asset thumbnail in the global library
  scrubbed a video instead of opening a detail view, while the real detail
  view only existed inside a specific tool's History tab. In Lumen, every
  thumbnail (library grid or inline result) opens the same one detail view.

## Technical decision: why no external AI image API

The assignment requires the app to: run for an unauthenticated evaluator,
not depend on the builder's private account, not require the evaluator to
configure API keys, and not expose secrets. A real text-to-image API would
mean either shipping a personal API key (a secret, and a billing liability
tied to my account) or asking the evaluator to bring their own key (setup
friction that risks a broken demo). A deterministic, seeded, in-browser
generative-art renderer sidesteps all of that: it is reliable, free to run,
requires nothing from the evaluator, and is explicitly presented as a
generation *simulation* rather than passed off as a real model call.
