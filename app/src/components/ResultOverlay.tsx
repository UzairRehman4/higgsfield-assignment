import { useEffect } from "react";
import type { Generation } from "../lib/types";
import { ASPECT_RATIOS, STYLES } from "../lib/types";
import { useAppStore } from "../store/useAppStore";

function formatDate(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function ResultOverlay({
  generation,
  onClose,
}: {
  generation: Generation;
  onClose: () => void;
}) {
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const removeGeneration = useAppStore((s) => s.removeGeneration);
  const isFavorite = useAppStore(
    (s) => Boolean(s.generations.find((g) => g.id === generation.id)?.favorite)
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const styleLabel = STYLES.find((s) => s.key === generation.style)?.label ?? generation.style;
  const ratio = ASPECT_RATIOS[generation.aspectRatio];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm fade-up"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex min-h-0 flex-1 items-center justify-center bg-black/40 p-4">
          <img
            src={generation.imageDataUrl}
            alt={generation.prompt}
            className="max-h-full max-w-full rounded-lg object-contain"
            style={{ aspectRatio: `${ratio.w} / ${ratio.h}` }}
          />
        </div>

        <div className="flex w-full flex-col gap-4 overflow-y-auto p-5 md:w-80">
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-display text-xl italic leading-snug">Generation details</h2>
            <button
              onClick={onClose}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-faint transition-colors hover:bg-surface-raised hover:text-ink"
            >
              ✕
            </button>
          </div>

          <p className="rounded-lg border border-border-soft bg-canvas/60 px-3 py-2 text-sm leading-relaxed text-ink">
            {generation.prompt}
          </p>

          <dl className="grid grid-cols-2 gap-y-2 text-xs">
            <dt className="text-faint">Style</dt>
            <dd className="text-right text-muted">{styleLabel}</dd>
            <dt className="text-faint">Aspect ratio</dt>
            <dd className="text-right text-muted">{generation.aspectRatio}</dd>
            <dt className="text-faint">Reference used</dt>
            <dd className="text-right text-muted">{generation.referenceUsed ? "Yes" : "No"}</dd>
            <dt className="text-faint">Cost</dt>
            <dd className="text-right text-muted">{generation.cost} credits</dd>
            <dt className="text-faint">Seed</dt>
            <dd className="text-right text-muted">{generation.seed}</dd>
            <dt className="text-faint">Created</dt>
            <dd className="text-right text-muted">{formatDate(generation.createdAt)}</dd>
          </dl>

          <div className="mt-auto flex flex-col gap-2 pt-2">
            <a
              href={generation.imageDataUrl}
              download={`lumen-${generation.id.slice(0, 8)}.jpg`}
              className="rounded-xl bg-accent px-4 py-2.5 text-center text-sm font-semibold text-black transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              Download image
            </a>
            <button
              onClick={() => toggleFavorite(generation.id)}
              className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                isFavorite
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-border bg-surface-raised text-ink hover:border-accent/40"
              }`}
            >
              {isFavorite ? "★ Saved to favorites" : "☆ Save to favorites"}
            </button>
            <button
              onClick={() => {
                removeGeneration(generation.id);
                onClose();
              }}
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-faint transition-colors hover:border-danger/40 hover:text-danger"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
