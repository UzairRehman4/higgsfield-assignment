import type { Generation } from "../lib/types";

interface ResultStageProps {
  stage: "idle" | "loading" | "result" | "error";
  stepIndex: number;
  steps: string[];
  errorMsg: string;
  current: Generation | null;
  ratio: { w: number; h: number };
  onRetry: () => void;
  onRegenerate: () => void;
  onFavorite: () => void;
  onExpand: () => void;
  isFavorite: boolean;
}

export function ResultStage({
  stage,
  stepIndex,
  steps,
  errorMsg,
  current,
  ratio,
  onRetry,
  onRegenerate,
  onFavorite,
  onExpand,
  isFavorite,
}: ResultStageProps) {
  const aspect = `${ratio.w} / ${ratio.h}`;

  if (stage === "loading") {
    return (
      <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-6">
        <div
          className="shimmer relative w-full max-w-md overflow-hidden rounded-2xl border border-border-soft bg-surface"
          style={{ aspectRatio: aspect }}
        >
          <div className="absolute inset-0 grid place-items-center">
            <div className="pulse-ring relative h-14 w-14 rounded-full border border-accent/40" />
          </div>
        </div>
        <div className="w-full max-w-md">
          <div className="mb-2 h-1 w-full overflow-hidden rounded-full bg-surface-raised">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
              style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
          <p className="text-center text-sm text-muted">{steps[stepIndex]}…</p>
        </div>
      </div>
    );
  }

  if (stage === "error") {
    return (
      <div className="mx-auto flex h-full max-w-md flex-col items-center justify-center gap-4 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full border border-danger/40 bg-danger/10 text-danger">
          !
        </div>
        <p className="text-sm text-muted">{errorMsg}</p>
        <button
          onClick={onRetry}
          className="rounded-xl border border-border bg-surface-raised px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-accent/40"
        >
          Try again
        </button>
      </div>
    );
  }

  if (stage === "result" && current) {
    return (
      <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-4 fade-up">
        <button
          onClick={onExpand}
          className="group relative w-full max-w-md overflow-hidden rounded-2xl border border-border-soft bg-surface"
          style={{ aspectRatio: aspect }}
        >
          <img
            src={current.imageDataUrl}
            alt={current.prompt}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <span className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/40 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="rounded-lg bg-black/60 px-2.5 py-1 text-xs font-medium text-ink backdrop-blur">
              View details
            </span>
          </span>
        </button>

        <div className="flex w-full max-w-md items-center justify-between gap-2">
          <button
            onClick={onFavorite}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
              isFavorite
                ? "border-accent/40 bg-accent/10 text-accent"
                : "border-border bg-surface text-muted hover:text-ink"
            }`}
          >
            {isFavorite ? "★ Saved" : "☆ Save"}
          </button>
          <a
            href={current.imageDataUrl}
            download={`lumen-${current.id.slice(0, 8)}.jpg`}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-muted transition-colors hover:text-ink"
          >
            Download
          </a>
          <button
            onClick={onRegenerate}
            className="flex-1 rounded-lg bg-surface-raised px-3 py-2 text-xs font-semibold text-ink transition-colors hover:bg-surface-hover"
          >
            Regenerate
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full max-w-md flex-col items-center justify-center gap-3 text-center">
      <div
        className="w-full max-w-sm rounded-2xl border border-dashed border-border-soft bg-surface/50"
        style={{ aspectRatio: aspect }}
      />
      <p className="text-sm text-faint">Your generation will appear here</p>
    </div>
  );
}
