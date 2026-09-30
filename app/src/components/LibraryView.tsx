import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Generation } from "../lib/types";
import { useAppStore } from "../store/useAppStore";

function dateGroupLabel(ts: number): string {
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  if (sameDay(d, today)) return "Today";
  if (sameDay(d, yesterday)) return "Yesterday";
  return d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}

export function LibraryView({
  onOpen,
  onStartCreating,
}: {
  onOpen: (gen: Generation) => void;
  onStartCreating: () => void;
}) {
  const generations = useAppStore((s) => s.generations);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const [filter, setFilter] = useState<"all" | "favorites">("all");

  const filtered = filter === "favorites" ? generations.filter((g) => g.favorite) : generations;

  const groups = useMemo(() => {
    const map = new Map<string, Generation[]>();
    for (const gen of filtered) {
      const label = dateGroupLabel(gen.createdAt);
      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(gen);
    }
    return Array.from(map.entries());
  }, [filtered]);

  if (generations.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl border border-dashed border-border-soft text-xl text-faint">
          ◇
        </div>
        <div>
          <p className="text-sm font-medium text-ink">Your library is empty</p>
          <p className="mt-1 text-sm text-faint">Everything you generate is saved here automatically.</p>
        </div>
        <button
          onClick={onStartCreating}
          className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Start creating
        </button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-5 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Library</h1>
        <div className="flex gap-1 rounded-lg border border-border bg-surface p-1">
          <FilterTab active={filter === "all"} onClick={() => setFilter("all")}>
            All ({generations.length})
          </FilterTab>
          <FilterTab active={filter === "favorites"} onClick={() => setFilter("favorites")}>
            Favorites ({generations.filter((g) => g.favorite).length})
          </FilterTab>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-faint">No favorites yet — tap the star on any generation to save it here.</p>
      ) : (
        <div className="flex flex-col gap-8">
          {groups.map(([label, items]) => (
            <section key={label}>
              <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-faint">{label}</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {items.map((gen, i) => (
                  <motion.button
                    key={gen.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(i, 8) * 0.04 }}
                    onClick={() => onOpen(gen)}
                    className="group relative overflow-hidden rounded-xl border border-border-soft bg-surface text-left transition-colors hover:border-border"
                  >
                    <img
                      src={gen.imageDataUrl}
                      alt={gen.prompt}
                      className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                    <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/70 to-transparent px-2 py-2 text-[11px] text-ink opacity-0 transition-opacity group-hover:opacity-100">
                      {gen.prompt}
                    </span>
                    <span
                      role="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(gen.id);
                      }}
                      className={`absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full text-xs backdrop-blur transition-all ${
                        gen.favorite
                          ? "bg-accent text-black opacity-100"
                          : "bg-black/50 text-ink opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      {gen.favorite ? "★" : "☆"}
                    </span>
                  </motion.button>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
        active ? "bg-surface-raised text-ink" : "text-faint hover:text-muted"
      }`}
    >
      {children}
    </button>
  );
}
