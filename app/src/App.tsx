import { useState } from "react";
import { AppShell, type View } from "./components/AppShell";
import { CreateWorkspace } from "./components/CreateWorkspace";
import { LibraryView } from "./components/LibraryView";
import { ResultOverlay } from "./components/ResultOverlay";
import { useAppStore } from "./store/useAppStore";
import type { Generation } from "./lib/types";

export default function App() {
  const [view, setView] = useState<View>("create");
  const [openGeneration, setOpenGeneration] = useState<Generation | null>(null);
  const historyCount = useAppStore((s) => s.generations.length);

  return (
    <AppShell view={view} onNavigate={setView} historyCount={historyCount}>
      {view === "create" ? (
        <CreateWorkspace onOpenResult={setOpenGeneration} />
      ) : (
        <LibraryView onOpen={setOpenGeneration} />
      )}
      {openGeneration && (
        <ResultOverlay generation={openGeneration} onClose={() => setOpenGeneration(null)} />
      )}
    </AppShell>
  );
}
