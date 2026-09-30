import { hashString, mulberry32 } from "./seed";
import type { AspectRatioKey, StyleKey } from "./types";
import { ASPECT_RATIOS } from "./types";

interface Palette {
  name: string;
  bg: [string, string];
  blobs: string[];
  keywords: string[];
}

const PALETTES: Palette[] = [
  {
    name: "cinematic-teal-orange",
    bg: ["#0b1c22", "#1a1210"],
    blobs: ["#ff8a4c", "#2fb8b0", "#ffd08a"],
    keywords: ["city", "street", "rain", "noir", "film"],
  },
  {
    name: "ember",
    bg: ["#1a0d08", "#050303"],
    blobs: ["#ff5a36", "#ff9d42", "#7a1f12"],
    keywords: ["fire", "lava", "ember", "flame", "volcano", "burning"],
  },
  {
    name: "deep-space",
    bg: ["#0a0b1a", "#03030a"],
    blobs: ["#6a5cff", "#b389ff", "#2a2560"],
    keywords: ["space", "galaxy", "stars", "cosmic", "night", "moon", "nebula", "astronaut"],
  },
  {
    name: "arctic",
    bg: ["#0a1620", "#03080d"],
    blobs: ["#6fd8ff", "#c9f2ff", "#2c5f78"],
    keywords: ["ocean", "sea", "water", "ice", "snow", "winter", "arctic", "glacier", "cold"],
  },
  {
    name: "emerald-forest",
    bg: ["#08170f", "#030a06"],
    blobs: ["#3fd68a", "#a6ff9e", "#0f4a30"],
    keywords: ["forest", "jungle", "green", "leaf", "nature", "trees", "moss"],
  },
  {
    name: "golden-desert",
    bg: ["#1c1305", "#0d0803"],
    blobs: ["#ffcf6b", "#ff9d3d", "#6b4514"],
    keywords: ["desert", "gold", "sand", "dune", "sun", "sunset", "dusk"],
  },
  {
    name: "sunset-coral",
    bg: ["#210f1a", "#0c0508"],
    blobs: ["#ff6f91", "#ffb56b", "#7a2454"],
    keywords: ["sunset", "coral", "pink", "romance", "warm", "beach"],
  },
  {
    name: "neon-cyber",
    bg: ["#0a0616", "#05030c"],
    blobs: ["#ff2fd6", "#3ffaff", "#5c1fae"],
    keywords: ["neon", "cyber", "future", "robot", "tech", "synth", "grid"],
  },
  {
    name: "pastel-dream",
    bg: ["#1a1420", "#0d0a12"],
    blobs: ["#c9a4ff", "#ffc9e6", "#9adfff"],
    keywords: ["dream", "pastel", "soft", "fairy", "cloud", "gentle"],
  },
  {
    name: "monochrome-slate",
    bg: ["#141416", "#08080a"],
    blobs: ["#9a9aa2", "#e8e8ea", "#4a4a50"],
    keywords: ["monochrome", "gray", "shadow", "minimal"],
  },
];

const STYLE_POOL: Record<StyleKey, string[]> = {
  cinematic: ["cinematic-teal-orange", "ember", "emerald-forest", "golden-desert"],
  vivid: ["sunset-coral", "golden-desert", "neon-cyber", "ember"],
  monochrome: ["monochrome-slate"],
  dreamy: ["pastel-dream", "arctic", "deep-space"],
  cyberpunk: ["neon-cyber", "deep-space"],
};

function pickPalette(prompt: string, style: StyleKey, rand: () => number): Palette {
  const pool = STYLE_POOL[style].map((n) => PALETTES.find((p) => p.name === n)!);
  const lower = prompt.toLowerCase();
  const scored = pool.map((p) => ({
    p,
    score: p.keywords.reduce((acc, k) => acc + (lower.includes(k) ? 1 : 0), 0),
  }));
  const best = scored.filter((s) => s.score > 0);
  const source = best.length > 0 ? best : scored;
  const idx = Math.floor(rand() * source.length);
  return source[idx].p;
}

function hexToRgb(hex: string): [number, number, number] {
  const v = hex.replace("#", "");
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  const c = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

function mix(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return rgbToHex([
    ca[0] + (cb[0] - ca[0]) * t,
    ca[1] + (cb[1] - ca[1]) * t,
    ca[2] + (cb[2] - ca[2]) * t,
  ]);
}

export interface GenerateOptions {
  prompt: string;
  aspectRatio: AspectRatioKey;
  style: StyleKey;
  seed: number;
  referenceColor?: string | null;
  maxDimension?: number;
}

/** Renders a deterministic, seeded piece of generative art to a data URL. Not a real AI model. */
export function renderGenerativeImage(opts: GenerateOptions): string {
  const { w, h } = ASPECT_RATIOS[opts.aspectRatio];
  const maxDim = opts.maxDimension ?? 900;
  const scale = maxDim / Math.max(w, h);
  const cw = Math.round(w * scale);
  const ch = Math.round(h * scale);

  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d")!;

  const rand = mulberry32(hashString(`${opts.prompt}::${opts.style}::${opts.aspectRatio}::${opts.seed}`));
  let palette = pickPalette(opts.prompt, opts.style, rand);

  let blobColors = palette.blobs;
  if (opts.referenceColor) {
    blobColors = [opts.referenceColor, ...palette.blobs.map((c) => mix(c, opts.referenceColor!, 0.35))];
  }

  // Background gradient
  const bgAngle = rand() * Math.PI * 2;
  const bx = cw / 2 + Math.cos(bgAngle) * cw * 0.3;
  const by = ch / 2 + Math.sin(bgAngle) * ch * 0.3;
  const bgGrad = ctx.createRadialGradient(bx, by, 0, cw / 2, ch / 2, Math.max(cw, ch) * 0.8);
  bgGrad.addColorStop(0, palette.bg[0]);
  bgGrad.addColorStop(1, palette.bg[1]);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, cw, ch);

  // Cyberpunk grid
  if (opts.style === "cyberpunk") {
    ctx.save();
    ctx.strokeStyle = "rgba(63, 250, 255, 0.08)";
    ctx.lineWidth = 1;
    const step = Math.max(24, Math.round(cw / 24));
    for (let x = 0; x < cw; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ch);
      ctx.stroke();
    }
    for (let y = 0; y < ch; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(cw, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Soft glowing blobs
  const blobCount = 4 + Math.floor(rand() * 3);
  const blurAmount = opts.style === "dreamy" ? 70 : opts.style === "cinematic" ? 45 : 55;
  ctx.filter = `blur(${Math.round(blurAmount * scale * 1.4)}px)`;
  ctx.globalCompositeOperation = "lighten";
  for (let i = 0; i < blobCount; i++) {
    const color = blobColors[i % blobColors.length];
    const r = (0.18 + rand() * 0.28) * Math.max(cw, ch);
    const cx = rand() * cw;
    const cy = rand() * ch;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    const alpha = opts.style === "vivid" ? 0.95 : 0.7;
    grad.addColorStop(0, hexWithAlpha(color, alpha));
    grad.addColorStop(1, hexWithAlpha(color, 0));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.filter = "none";
  ctx.globalCompositeOperation = "source-over";

  // Fine light rays for cinematic/cyberpunk
  if (opts.style === "cinematic" || opts.style === "cyberpunk") {
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = "#ffffff";
    const rays = 6;
    const originX = cw * (0.2 + rand() * 0.6);
    const originY = -ch * 0.2;
    for (let i = 0; i < rays; i++) {
      const angle = (Math.PI / 2) + (i - rays / 2) * 0.12 + (rand() - 0.5) * 0.05;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX + Math.cos(angle) * ch * 1.6, originY + Math.sin(angle) * ch * 1.6);
      ctx.lineWidth = ch * 0.02;
      ctx.stroke();
    }
    ctx.restore();
  }

  // Grain
  const grainCount = Math.round(cw * ch * 0.02);
  ctx.save();
  ctx.globalAlpha = 0.05;
  for (let i = 0; i < grainCount; i++) {
    const x = rand() * cw;
    const y = rand() * ch;
    const shade = rand() > 0.5 ? "#ffffff" : "#000000";
    ctx.fillStyle = shade;
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.restore();

  // Vignette
  const vign = ctx.createRadialGradient(cw / 2, ch / 2, Math.max(cw, ch) * 0.35, cw / 2, ch / 2, Math.max(cw, ch) * 0.75);
  vign.addColorStop(0, "rgba(0,0,0,0)");
  vign.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = vign;
  ctx.fillRect(0, 0, cw, ch);

  if (opts.style === "monochrome") {
    const imgData = ctx.getImageData(0, 0, cw, ch);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const g = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
      d[i] = g;
      d[i + 1] = g;
      d[i + 2] = g;
    }
    ctx.putImageData(imgData, 0, 0);
  }

  return canvas.toDataURL("image/jpeg", 0.92);
}

function hexWithAlpha(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Samples the average color of an uploaded reference image for a subtle palette nudge. */
export function averageColorFromImage(img: HTMLImageElement): string {
  const canvas = document.createElement("canvas");
  const size = 32;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;
  let r = 0, g = 0, b = 0, n = 0;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    n++;
  }
  return rgbToHex([r / n, g / n, b / n]);
}
