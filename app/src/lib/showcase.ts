import type { AspectRatioKey, StyleKey } from "./types";

export interface ShowcaseItem {
  id: string;
  category: string;
  prompt: string;
  style: StyleKey;
  aspectRatio: AspectRatioKey;
  seed: number;
}

/**
 * A fixed, curated set of prompts spanning the categories the landing page
 * showcases. Rendered through the same generative engine used by the app —
 * this is the product's own output, not stock photography.
 */
export const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: "cinematic",
    category: "Cinematic",
    prompt: "A rain-soaked street at night, neon signage reflected in puddles",
    style: "cinematic",
    aspectRatio: "16:9",
    seed: 118822,
  },
  {
    id: "portrait",
    category: "Portrait",
    prompt: "A close portrait lit by a single warm lamp, soft shadow falling across the face",
    style: "dreamy",
    aspectRatio: "4:3",
    seed: 552210,
  },
  {
    id: "architecture",
    category: "Architecture",
    prompt: "Brutalist concrete forms at golden hour, long dramatic shadows",
    style: "cinematic",
    aspectRatio: "4:3",
    seed: 90911,
  },
  {
    id: "futuristic",
    category: "Futuristic",
    prompt: "A neon skyline over a synthetic future city, dense with light",
    style: "cyberpunk",
    aspectRatio: "9:16",
    seed: 447712,
  },
  {
    id: "editorial",
    category: "Editorial",
    prompt: "A minimal fashion editorial composition, bold coral and gold tones",
    style: "vivid",
    aspectRatio: "4:3",
    seed: 33210,
  },
  {
    id: "abstract",
    category: "Abstract",
    prompt: "Soft pastel clouds drifting through a dreamlike gradient sky",
    style: "dreamy",
    aspectRatio: "1:1",
    seed: 771123,
  },
  {
    id: "nature",
    category: "Nature",
    prompt: "Deep emerald forest canopy, light breaking through morning mist",
    style: "cinematic",
    aspectRatio: "1:1",
    seed: 66234,
  },
  {
    id: "hero",
    category: "Hero",
    prompt: "A lone figure on a cliff at dusk, two moons rising over a still ocean",
    style: "cinematic",
    aspectRatio: "16:9",
    seed: 918273,
  },
  {
    id: "monochrome",
    category: "Monochrome",
    prompt: "A quiet monochrome study of light and shadow across empty architecture",
    style: "monochrome",
    aspectRatio: "4:3",
    seed: 40040,
  },
];
