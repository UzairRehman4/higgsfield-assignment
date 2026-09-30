import type { ReactNode } from "react";
import { CreditsBadge } from "./CreditsBadge";

export type View = "create" | "library";

interface AppShellProps {
  view: View;
  onNavigate: (v: View) => void;
  onHome: () => void;
  historyCount: number;
  children: ReactNode;
}

export function AppShell({ view, onNavigate, onHome, historyCount, children }: AppShellProps) {
  return (
    <div className="flex h-screen min-h-0 flex-col bg-canvas text-ink">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border-soft px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <button onClick={onHome} className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-accent text-[13px] font-bold text-black">
              ◆
            </span>
            <span className="font-display text-lg italic tracking-tight">Lumen</span>
          </button>
          <nav className="hidden items-center gap-1 sm:flex">
            <NavButton active={view === "create"} onClick={() => onNavigate("create")}>
              Create
            </NavButton>
            <NavButton active={view === "library"} onClick={() => onNavigate("library")}>
              Library
              {historyCount > 0 && (
                <span
                  className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[11px] font-normal ${
                    view === "library" ? "bg-black/20 text-ink" : "bg-white/8 text-muted"
                  }`}
                >
                  {historyCount}
                </span>
              )}
            </NavButton>
          </nav>
        </div>
        <CreditsBadge />
      </header>

      <nav className="flex shrink-0 items-center gap-1 border-b border-border-soft px-4 py-2 sm:hidden">
        <NavButton active={view === "create"} onClick={() => onNavigate("create")}>
          Create
        </NavButton>
        <NavButton active={view === "library"} onClick={() => onNavigate("library")}>
          Library {historyCount > 0 && `(${historyCount})`}
        </NavButton>
      </nav>

      <main className="min-h-0 flex-1">{children}</main>
    </div>
  );
}

function NavButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        active ? "bg-surface-raised text-ink" : "text-muted hover:text-ink"
      }`}
    >
      {children}
      {active && <span className="absolute inset-x-3 -bottom-2.25 h-0.5 rounded-full bg-accent" />}
    </button>
  );
}
