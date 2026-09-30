import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AppShell, type View } from "./components/AppShell";
import { CreateWorkspace } from "./components/CreateWorkspace";
import { LibraryView } from "./components/LibraryView";
import { ResultOverlay } from "./components/ResultOverlay";
import { Landing } from "./components/Landing";
import { Toast } from "./components/Toast";
import { useAppStore } from "./store/useAppStore";
import type { Generation } from "./lib/types";

type Route = "landing" | View;

export default function App() {
  const [route, setRoute] = useState<Route>("landing");
  const [openGeneration, setOpenGeneration] = useState<Generation | null>(null);
  const historyCount = useAppStore((s) => s.generations.length);

  if (route === "landing") {
    return (
      <div className="h-screen">
        <Landing onStartCreating={() => setRoute("create")} onExploreLibrary={() => setRoute("library")} />
        <Toast />
      </div>
    );
  }

  return (
    <>
      <AppShell view={route} onNavigate={setRoute} onHome={() => setRoute("landing")} historyCount={historyCount}>
        {route === "create" ? (
          <CreateWorkspace onOpenResult={setOpenGeneration} />
        ) : (
          <LibraryView onOpen={setOpenGeneration} onStartCreating={() => setRoute("create")} />
        )}
        <AnimatePresence>
          {openGeneration && (
            <ResultOverlay
              key={openGeneration.id}
              generation={openGeneration}
              onClose={() => setOpenGeneration(null)}
            />
          )}
        </AnimatePresence>
      </AppShell>
      <Toast />
    </>
  );
}
