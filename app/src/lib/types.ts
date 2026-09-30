export type AspectRatioKey = "1:1" | "16:9" | "9:16" | "4:3";

export const ASPECT_RATIOS: Record<AspectRatioKey, { w: number; h: number; label: string }> = {
  "1:1": { w: 1024, h: 1024, label: "Square" },
  "16:9": { w: 1152, h: 648, label: "Widescreen" },
  "9:16": { w: 648, h: 1152, label: "Portrait" },
  "4:3": { w: 1024, h: 768, label: "Classic" },
};

export type StyleKey = "cinematic" | "vivid" | "monochrome" | "dreamy" | "cyberpunk";

export const STYLES: { key: StyleKey; label: string; blurb: string }[] = [
  { key: "cinematic", label: "Cinematic", blurb: "Moody light, filmic contrast" },
  { key: "vivid", label: "Vivid", blurb: "Saturated, high-energy color" },
  { key: "monochrome", label: "Monochrome", blurb: "Tonal, near black & white" },
  { key: "dreamy", label: "Dreamy", blurb: "Soft focus, pastel haze" },
  { key: "cyberpunk", label: "Cyberpunk", blurb: "Neon glow, deep shadow" },
];

export interface Generation {
  id: string;
  prompt: string;
  aspectRatio: AspectRatioKey;
  style: StyleKey;
  seed: number;
  cost: number;
  createdAt: number;
  imageDataUrl: string;
  favorite: boolean;
  referenceUsed: boolean;
  parentId?: string;
}
