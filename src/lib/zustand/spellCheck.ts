import { create } from 'zustand';

interface SpellCheckStore {
  content: string;
  setContent: (content: string) => void;
  clearContent: () => void;
}

export const useSpellCheckStore = create<SpellCheckStore>(set => ({
  content: '',
  setContent: (content: string) => set({ content }),
  clearContent: () => set({ content: '' }),
}));
