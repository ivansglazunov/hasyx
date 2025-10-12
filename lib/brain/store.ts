import { create } from 'zustand';

type BrainContextState = {
  // Map: brain_name -> string_value of its brain_string result (if any)
  availableNames: Record<string, string | undefined>;
  setAvailableNames: (names: Record<string, string | undefined>) => void;
};

export const useBrainContextStore = create<BrainContextState>((set) => ({
  availableNames: {},
  setAvailableNames: (names) => set({ availableNames: { ...names } })
}));


