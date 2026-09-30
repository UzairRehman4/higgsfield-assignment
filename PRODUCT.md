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

## Final UX decisions (visual/product-quality pass)

After the core loop was working end-to-end, we did a dedicated design pass
rather than shipping the first working version as final.

**Landing page.** The app initially opened straight into the workspace,
which meant an evaluator's first impression was an empty prompt box with no
context. We added a real landing page: a hero with a generated centerpiece
image, a showcase grid across six visual categories (all rendered by our
own engine, not stock photography), an "Imagine → Create → Refine → Keep"
workflow explainer, an honest capability list (only things that actually
exist), and a final CTA — closing with "Start creating," which leads
straight into the real workspace so the promise and the product are the
same screen system, not a disconnected marketing site.

**Kept:** the chip-based settings row, inline cost-on-button, and
date-grouped library from the first pass — those already tested well.

**Changed:**
- Style picker gained a color swatch per option (a quick visual preview of
  what each style tends to produce) instead of text-only rows.
- The result and detail views moved from a plain metadata table to pill-style
  tags (style / ratio / cost), which scan faster and match the chip language
  used everywhere else in the app.
- Added `⌘/Ctrl + Enter` to generate from the prompt box, and a lightweight
  toast for download/delete feedback, since silent actions felt incomplete.
- Replaced the plain "not enough credits" line with a bordered callout that
  matches the visual weight of an actual blocking state, not an afterthought.
- Empty library state now has an icon, one line of copy, and a direct
  "Start creating" CTA instead of a bare sentence.

**Fixed during this pass:** the create workspace's two-panel grid used
independent `overflow-y-auto` scroll regions sized for desktop; on mobile
(single-column) this clipped content instead of scrolling, because neither
panel had a bounded height to scroll within. Fixed by making the whole
workspace scroll as one column on mobile and only splitting into two
independently-scrolling panes at the desktop breakpoint.

**Visual identity — explicit override, documented for transparency.** The
brief for this assignment (and our own earlier product-judgement writeup
above) explicitly said not to copy Higgsfield's colors or visual identity.
Later in the project the user explicitly asked to match Higgsfield's actual
look and, when told this contradicted the brief, confirmed they wanted to
override it anyway. We pulled the real values via computed styles on
higgsfield.ai rather than guessing: background `#0F1113`, text `#F7F7F8`,
brand accent `#D1FE17` (their exact lime-green), body font Inter (already
matched), and heading font Space Grotesk (bold, not italic — swapped from
the original Instrument Serif). This is a deliberate, requested departure
from the brief's own instruction, made with the tradeoff stated plainly
rather than silently — worth knowing if this is reviewed against the
original brief text.

**Deliberately not done:** no new features were added to make the product
look bigger (per the explicit instruction) — every change in this pass is
either presentation of existing functionality (landing page, motion,
metadata layout) or a genuine bug fix (mobile scroll). The generation
engine, credit mechanic, and navigation scope are unchanged from the
original MVP decision.

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

We did check for a genuinely free, no-key alternative mid-project
(Pollinations.ai). It works and needs no API key, but its free tier forces
a visible third-party watermark on every image (`nologo=true` returns
`402 Payment Required`) and it's an unauthenticated public rate-limited
service — both directly conflict with "recognizable as Lumen" and with
demo reliability for the evaluator, so we kept the in-house engine as the
only generation path.
