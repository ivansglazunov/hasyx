import { create } from 'zustand';

type BrainContextState = {
  // Map: brain_name -> full brain_string option object (if any)
  // Expected fields at least: id, item_id, string_value, user_id, updated_at
  availableNames: Record<string, any>;
  setAvailableNames: (names: Record<string, any>) => void;
};

export const useBrainContextStore = create<BrainContextState>((set) => ({
  availableNames: {},
  setAvailableNames: (names) => set({ availableNames: { ...names } })
}));


