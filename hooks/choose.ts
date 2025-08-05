import { create } from 'zustand';

interface ChooseStore {
  choose: string[] | undefined;
  setChoose: (choose: string[] | undefined) => void;
  toggleChoose: (id: string) => void;
  addChoose: (id: string) => void;
  removeChoose: (id: string) => void;
  clearChoose: () => void;
  isChosen: (id: string) => boolean;
}

export const useChoose = create<ChooseStore>((set, get) => ({
  choose: undefined,
  
  setChoose: (choose) => {
    set({ choose });
  },
  
  toggleChoose: (id: string) => {
    const { choose } = get();
    if (!choose) {
      set({ choose: [id] });
    } else {
      const newChoose = choose.includes(id) 
        ? choose.filter(item => item !== id)
        : [...choose, id];
      set({ choose: newChoose.length > 0 ? newChoose : undefined });
    }
  },
  
  addChoose: (id: string) => {
    const { choose } = get();
    if (!choose) {
      set({ choose: [id] });
    } else if (!choose.includes(id)) {
      set({ choose: [...choose, id] });
    }
  },
  
  removeChoose: (id: string) => {
    const { choose } = get();
    if (choose) {
      const newChoose = choose.filter(item => item !== id);
      set({ choose: newChoose.length > 0 ? newChoose : undefined });
    }
  },
  
  clearChoose: () => {
    set({ choose: undefined });
  },
  
  isChosen: (id: string) => {
    const { choose } = get();
    return choose ? choose.includes(id) : false;
  }
})); 