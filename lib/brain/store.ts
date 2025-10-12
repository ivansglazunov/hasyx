import { create } from 'zustand';

type BrainContextState = {
  availableNames: string[];
  setAvailableNames: (names: string[]) => void;
};

export const useBrainContextStore = create<BrainContextState>((set) => ({
  availableNames: [],
  setAvailableNames: (names) => set({ availableNames: Array.from(new Set(names)).sort() })
}));


