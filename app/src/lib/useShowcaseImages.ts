import { useMemo } from "react";
import { renderGenerativeImage } from "./generative";
import { SHOWCASE_ITEMS, type ShowcaseItem } from "./showcase";

export interface ShowcaseRendered extends ShowcaseItem {
  imageDataUrl: string;
}

export function useShowcaseImages(): ShowcaseRendered[] {
  return useMemo(
    () =>
      SHOWCASE_ITEMS.map((item) => ({
        ...item,
        imageDataUrl: renderGenerativeImage({
          prompt: item.prompt,
          aspectRatio: item.aspectRatio,
          style: item.style,
          seed: item.seed,
          maxDimension: 700,
        }),
      })),
    []
  );
}
