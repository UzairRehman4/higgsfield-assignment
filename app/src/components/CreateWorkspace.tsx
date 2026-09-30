import { useEffect, useRef, useState } from "react";
import type { AspectRatioKey, Generation, StyleKey } from "../lib/types";
import { ASPECT_RATIOS } from "../lib/types";
import { averageColorFromImage, renderGenerativeImage } from "../lib/generative";
import { GENERATION_COST, useAppStore } from "../store/useAppStore";
import { AspectRatioPicker } from "./AspectRatioPicker";
import { StylePicker } from "./StylePicker";
import { ReferenceUpload } from "./ReferenceUpload";
import { ResultStage } from "./ResultStage";

type Stage = "idle" | "loading" | "result" | "error";

const PROGRESS_STEPS = ["Reading your prompt", "Composing the scene", "Rendering light & color", "Finishing details"];

export function CreateWorkspace({
  onOpenResult,
}: {
  onOpenResult: (gen: Generation) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatioKey>("1:1");
  const [style, setStyle] = useState<StyleKey>("cinematic");
  const [refThumb, setRefThumb] = useState<string | null>(null);
  const [refColor, setRefColor] = useState<string | null>(null);

  const [stage, setStage] = useState<Stage>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [current, setCurrent] = useState<Generation | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const timers = useRef<number[]>([]);
  const credits = useAppStore((s) => s.credits);
  const spendCredits = useAppStore((s) => s.spendCredits);
  const addGeneration = useAppStore((s) => s.addGeneration);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const isFavorite = useAppStore((s) =>
    current ? Boolean(s.generations.find((g) => g.id === current.id)?.favorite) : false
  );

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const canAfford = credits >= GENERATION_COST;
  const canGenerate = prompt.trim().length > 0 && canAfford && stage !== "loading";

  function runGeneration(basePrompt: string, ar: AspectRatioKey, st: StyleKey, parentId?: string) {
    setStage("loading");
    setStepIndex(0);
    setErrorMsg("");
    timers.current.forEach(clearTimeout);
    timers.current = [];

    PROGRESS_STEPS.forEach((_, i) => {
      const t = window.setTimeout(() => setStepIndex(i), i * 480);
      timers.current.push(t);
    });

    const finalize = window.setTimeout(() => {
      const failed = Math.random() < 0.08;
      if (failed) {
        setStage("error");
        setErrorMsg("Generation failed — the render pipeline hiccuped. No credits were used.");
        return;
      }
      const ok = spendCredits(GENERATION_COST);
      if (!ok) {
        setStage("error");
        setErrorMsg("Not enough credits to complete this generation.");
        return;
      }
      const seed = Math.floor(Math.random() * 1_000_000_000);
      const imageDataUrl = renderGenerativeImage({
        prompt: basePrompt,
        aspectRatio: ar,
        style: st,
        seed,
        referenceColor: refColor,
      });
      const gen: Generation = {
        id: crypto.randomUUID(),
        prompt: basePrompt,
        aspectRatio: ar,
        style: st,
        seed,
        cost: GENERATION_COST,
        createdAt: Date.now(),
        imageDataUrl,
        favorite: false,
        referenceUsed: Boolean(refColor),
        parentId,
      };
      addGeneration(gen);
      setCurrent(gen);
      setStage("result");
    }, PROGRESS_STEPS.length * 480 + 350);
    timers.current.push(finalize);
  }

  function handleGenerate() {
    if (!canGenerate) return;
    runGeneration(prompt.trim(), aspectRatio, style);
  }

  function handleRegenerate() {
    if (!current) return;
    if (credits < GENERATION_COST) {
      setStage("error");
      setErrorMsg("Not enough credits to regenerate.");
      return;
    }
    runGeneration(current.prompt, current.aspectRatio, current.style, current.id);
  }

  const ratio = ASPECT_RATIOS[aspectRatio];

  return (
    <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[360px_1fr]">
      <aside className="flex min-h-0 flex-col gap-5 overflow-y-auto border-b border-border-soft p-5 lg:border-b-0 lg:border-r">
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-faint">
            Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A lone lighthouse on a cliff at dusk, storm rolling in over the sea…"
            rows={4}
            className="w-full resize-none rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-faint focus:border-accent/50 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-faint">
            Reference
          </label>
          <ReferenceUpload
            thumb={refThumb}
            onAdd={(dataUrl, img) => {
              setRefThumb(dataUrl);
              setRefColor(averageColorFromImage(img));
            }}
            onRemove={() => {
              setRefThumb(null);
              setRefColor(null);
            }}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-faint">
            Aspect ratio
          </label>
          <AspectRatioPicker value={aspectRatio} onChange={setAspectRatio} />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-faint">
            Style
          </label>
          <StylePicker value={style} onChange={setStyle} />
        </div>

        <div className="mt-auto pt-2">
          {!canAfford && (
            <p className="mb-2 text-xs text-danger">
              Not enough credits. Open the credits menu in the header to reset your balance.
            </p>
          )}
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
              canGenerate
                ? "bg-accent text-black hover:scale-[1.01] active:scale-[0.99]"
                : "cursor-not-allowed bg-surface-raised text-faint"
            }`}
          >
            {stage === "loading" ? "Generating…" : "Generate"}
            <span
              className={`rounded-md px-1.5 py-0.5 text-xs font-bold ${
                canGenerate ? "bg-black/15" : "bg-black/20"
              }`}
            >
              {GENERATION_COST} credits
            </span>
          </button>
        </div>
      </aside>

      <section className="relative min-h-0 overflow-y-auto p-5 sm:p-8">
        <ResultStage
          stage={stage}
          stepIndex={stepIndex}
          steps={PROGRESS_STEPS}
          errorMsg={errorMsg}
          current={current}
          ratio={ratio}
          onRetry={() => runGeneration(prompt.trim() || current?.prompt || "", aspectRatio, style)}
          onRegenerate={handleRegenerate}
          onFavorite={() => current && toggleFavorite(current.id)}
          isFavorite={isFavorite}
          onExpand={() => current && onOpenResult(current)}
        />
      </section>
    </div>
  );
}
