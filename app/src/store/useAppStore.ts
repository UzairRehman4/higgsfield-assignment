import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Generation } from "../lib/types";

const STARTING_CREDITS = 12;
export const GENERATION_COST = 2;

interface AppState {
  credits: number;
  generations: Generation[];
  spendCredits: (amount: number) => boolean;
  addGeneration: (gen: Generation) => void;
  toggleFavorite: (id: string) => void;
  removeGeneration: (id: string) => void;
  topUp: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      credits: STARTING_CREDITS,
      generations: [],
      spendCredits: (amount) => {
        const { credits } = get();
        if (credits < amount) return false;
        set({ credits: credits - amount });
        return true;
      },
      addGeneration: (gen) =>
        set((state) => ({ generations: [gen, ...state.generations] })),
      toggleFavorite: (id) =>
        set((state) => ({
          generations: state.generations.map((g) =>
            g.id === id ? { ...g, favorite: !g.favorite } : g
          ),
        })),
      removeGeneration: (id) =>
        set((state) => ({
          generations: state.generations.filter((g) => g.id !== id),
        })),
      topUp: () => set({ credits: STARTING_CREDITS }),
    }),
    { name: "higgsfield-clone-store" }
  )
);
