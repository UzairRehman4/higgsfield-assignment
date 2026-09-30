import type { StyleKey } from "../lib/types";
import { STYLES } from "../lib/types";

const SWATCH: Record<StyleKey, string> = {
  cinematic: "linear-gradient(135deg, #ff8a4c, #2fb8b0)",
  vivid: "linear-gradient(135deg, #ff6f91, #ffcf6b)",
  monochrome: "linear-gradient(135deg, #e8e8ea, #4a4a50)",
  dreamy: "linear-gradient(135deg, #c9a4ff, #9adfff)",
  cyberpunk: "linear-gradient(135deg, #ff2fd6, #3ffaff)",
};

export function StylePicker({
  value,
  onChange,
}: {
  value: StyleKey;
  onChange: (v: StyleKey) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-1.5">
      {STYLES.map((s) => {
        const active = value === s.key;
        return (
          <button
            key={s.key}
            onClick={() => onChange(s.key)}
            className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
              active
                ? "border-accent/50 bg-accent/10"
                : "border-border bg-surface hover:border-border-soft"
            }`}
          >
            <span
              className="h-6 w-6 shrink-0 rounded-full ring-1 ring-white/10"
              style={{ background: SWATCH[s.key] }}
            />
            <span className="min-w-0 flex-1">
              <span className={`block text-sm font-medium ${active ? "text-accent" : "text-ink"}`}>
                {s.label}
              </span>
              <span className="block truncate text-xs text-faint">{s.blurb}</span>
            </span>
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full transition-opacity ${
                active ? "bg-accent opacity-100" : "opacity-0"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
