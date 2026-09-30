import type { StyleKey } from "../lib/types";
import { STYLES } from "../lib/types";

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
            className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors ${
              active
                ? "border-accent/50 bg-accent/10"
                : "border-border bg-surface hover:border-border-soft"
            }`}
          >
            <span>
              <span className={`block text-sm font-medium ${active ? "text-accent" : "text-ink"}`}>
                {s.label}
              </span>
              <span className="block text-xs text-faint">{s.blurb}</span>
            </span>
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${active ? "bg-accent" : "bg-transparent"}`}
            />
          </button>
        );
      })}
    </div>
  );
}
