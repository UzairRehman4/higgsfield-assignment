# Higgsfield recon (logged-out pass, 2026-09-30)

Observed directly with Playwright at https://higgsfield.ai. Screenshots in this folder.

## Landing / Explore (`/`)
- Cookie consent dialog covers bottom-right and **intercepts clicks on the Generate button** until dismissed.
- Promo bar ("additional discount after signing up"), then a top nav with ~20 items: Explore, Image, Video,
  Audio, MCP, API, ChatGPT Plugin, Genjutsu, Effects, Cinema Studio, Contests, Marketing Studio,
  Supercomputer, 3D Jutsu, Edit, Academy, Community, Plugins, Canvas, Originals. Nav overflows/clips at 1680px.
- Hero area is a carousel of promo cards (API cashback, skills bundle, ...), not an explanation of the product.

## Image tool (`/ai/image?model=gpt_image_2`)  (01-02)
- Empty state: a spinner, then a mostly empty dark canvas with the prompt bar docked to the bottom.
- Prompt bar: textarea ("Describe the scene you imagine"), `+` references, `@` elements, then chips:
  model (GPT Image 2), aspect ratio (Auto), quality (High), resolution (2K), an unlabeled "Auto" chip, count (1/4 stepper).
- **Generate button shows credit cost inline** (8.5 struck through, 6.5 shown = discounted).
- Console shows 7 errors on load (not ours to fix, but noted).

## Generate while logged out (03-04)
- Clicking Generate works without an account: a placeholder card appears with an "In queue" spinner.
- After ~8s the result is **blurred behind "Create an account to see generated image / Sign up for free"**.
  The wall is a conversion mechanic: user invests a prompt, then is gated at the payoff moment.

## Not yet explored (needs an account)
History/library, result actions, download, editing/refinement, error states, settings, video tool.
