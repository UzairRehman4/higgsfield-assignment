import { useState } from "react";
import { useAppStore } from "../store/useAppStore";

export function CreditsBadge() {
  const credits = useAppStore((s) => s.credits);
  const topUp = useAppStore((s) => s.topUp);
  const [open, setOpen] = useState(false);
  const low = credits <= 2;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
          low
            ? "border-danger/40 bg-danger/10 text-danger"
            : "border-border bg-surface-raised text-ink hover:border-accent/40"
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${low ? "bg-danger" : "bg-accent"}`} />
        {credits} {credits === 1 ? "credit" : "credits"}
      </button>
      {open && (
        <div
          className="fade-up absolute right-0 top-11 z-30 w-64 rounded-xl border border-border bg-surface-raised p-4 shadow-2xl shadow-black/50"
          onMouseLeave={() => setOpen(false)}
        >
          <p className="text-sm text-muted">
            This is a local demo balance stored in your browser — no real billing.
          </p>
          <button
            onClick={() => {
              topUp();
              setOpen(false);
            }}
            className="mt-3 w-full rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Reset to 12 credits
          </button>
        </div>
      )}
    </div>
  );
}
