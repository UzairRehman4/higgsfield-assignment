import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useShowcaseImages } from "../lib/useShowcaseImages";

const WORKFLOW = [
  { step: "01", title: "Imagine", copy: "Describe the scene, mood, or subject in your own words." },
  { step: "02", title: "Create", copy: "Choose an aspect ratio and a style, then generate." },
  { step: "03", title: "Refine", copy: "Adjust the prompt or style and generate again." },
  { step: "04", title: "Keep", copy: "Save what works to your personal library." },
];

const CAPABILITIES = [
  { title: "Prompt-based creation", copy: "Describe what you want in plain language." },
  { title: "Style direction", copy: "Five distinct visual directions, from cinematic to cyberpunk." },
  { title: "Aspect ratios", copy: "Square, widescreen, portrait, and classic framing." },
  { title: "Reference images", copy: "Attach a reference to nudge the palette toward it." },
  { title: "Instant generation", copy: "No queue, no wait — results render in your browser." },
  { title: "Personal library", copy: "Every generation is saved and organized by date." },
];

export function Landing({
  onStartCreating,
  onExploreLibrary,
}: {
  onStartCreating: () => void;
  onExploreLibrary: () => void;
}) {
  const showcase = useShowcaseImages();
  const hero = showcase.find((s) => s.id === "hero")!;
  const grid = showcase.filter((s) => s.id !== "hero");

  const heroRef = useRef<HTMLDivElement>(null);
  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const translateX = useMotionTemplate`${mx}px`;
  const translateY = useMotionTemplate`${my}px`;

  function handleMouseMove(e: React.MouseEvent) {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(relX * -18);
    my.set(relY * -18);
  }

  return (
    <div className="h-full overflow-y-auto bg-canvas text-ink">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-accent text-[13px] font-bold text-black">
            ◆
          </span>
          <span className="font-display text-lg italic tracking-tight">Lumen</span>
        </div>
        <button
          onClick={onStartCreating}
          className="rounded-lg border border-border bg-surface-raised px-3.5 py-1.5 text-sm font-medium transition-colors hover:border-accent/40"
        >
          Open app
        </button>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 py-10 sm:px-8 sm:py-16 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-faint">
            A focused AI image studio
          </p>
          <h1 className="font-display text-4xl italic leading-[1.05] sm:text-5xl">
            AI image creation,
            <br />
            designed around your ideas.
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
            Lumen turns a short description into a fully rendered image in
            seconds — no queue, no external service, nothing to configure.
            Pick a style, set a ratio, and see it come together.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={onStartCreating}
              className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Start creating
            </button>
            <button
              onClick={onExploreLibrary}
              className="rounded-xl border border-border px-5 py-3 text-sm font-medium text-muted transition-colors hover:border-border-soft hover:text-ink"
            >
              Explore library
            </button>
          </div>
        </motion.div>

        <motion.div
          ref={heroRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            mx.set(0);
            my.set(0);
          }}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mx-auto aspect-video w-full max-w-xl overflow-hidden rounded-2xl border border-border-soft shadow-2xl shadow-black/40"
        >
          <motion.img
            src={hero.imageDataUrl}
            alt="A rendered Lumen generation"
            style={{ x: translateX, y: translateY, scale: 1.08 }}
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="text-xs text-ink/80">“{hero.prompt}”</p>
          </div>
        </motion.div>
      </section>

      {/* Showcase */}
      <Section title="From the studio" subtitle="A sample of what Lumen renders across styles.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {grid.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
              className={`group relative overflow-hidden rounded-xl border border-border-soft bg-surface ${
                i === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              <img
                src={item.imageDataUrl}
                alt={item.prompt}
                className="aspect-square h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              />
              <span className="absolute left-2 top-2 rounded-md bg-black/50 px-2 py-0.5 text-[11px] font-medium text-ink/90 backdrop-blur">
                {item.category}
              </span>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Workflow */}
      <Section title="How it works" subtitle="One loop, four steps.">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WORKFLOW.map((w, i) => (
            <motion.div
              key={w.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <span className="font-display text-2xl italic text-accent">{w.step}</span>
              <h3 className="mt-2 text-base font-semibold">{w.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{w.copy}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Capabilities */}
      <Section title="What Lumen supports" subtitle="Deliberately small, and complete.">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((c) => (
            <div key={c.title} className="border-t border-border-soft pt-4">
              <h3 className="text-sm font-semibold text-ink">{c.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{c.copy}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-24 pt-8 sm:px-8 sm:pb-32">
        <div className="flex flex-col items-start gap-5 rounded-2xl border border-border-soft bg-surface px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div>
            <h2 className="font-display text-2xl italic">Ready when you are.</h2>
            <p className="mt-1 text-sm text-muted">Your first twelve credits are on the house.</p>
          </div>
          <button
            onClick={onStartCreating}
            className="shrink-0 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Start creating
          </button>
        </div>
      </section>

      <footer className="border-t border-border-soft px-5 py-6 text-center text-xs text-faint sm:px-8">
        Lumen — a focused AI image studio, built as a product design exercise.
      </footer>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <div className="mb-8">
        <h2 className="font-display text-2xl italic">{title}</h2>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}
