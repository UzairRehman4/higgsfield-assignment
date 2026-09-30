import type { AspectRatioKey } from "../lib/types";
import { ASPECT_RATIOS } from "../lib/types";

const ICONS: Record<AspectRatioKey, { w: number; h: number }> = {
  "1:1": { w: 14, h: 14 },
  "16:9": { w: 18, h: 11 },
  "9:16": { w: 11, h: 18 },
  "4:3": { w: 16, h: 13 },
};

export function AspectRatioPicker({
  value,
  onChange,
}: {
  value: AspectRatioKey;
  onChange: (v: AspectRatioKey) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(ASPECT_RATIOS) as AspectRatioKey[]).map((key) => {
        const icon = ICONS[key];
        const active = value === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors ${
              active
                ? "border-accent/50 bg-accent/10 text-accent"
                : "border-border bg-surface text-muted hover:border-border-soft hover:text-ink"
            }`}
          >
            <span
              className={`inline-block shrink-0 rounded-[2px] border ${
                active ? "border-accent" : "border-faint"
              }`}
              style={{ width: icon.w, height: icon.h }}
            />
            {key}
          </button>
        );
      })}
    </div>
  );
}
