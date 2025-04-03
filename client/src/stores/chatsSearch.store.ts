import { create } from "zustand";

interface ChatsSearchState {
  searchQuery: string;
  scroll: number;
  setSearchQuery: (query: string) => void;
  setScroll: (scroll: number) => void;
}

const useChatsSearchStore = create<ChatsSearchState>((set) => ({
  searchQuery: "",
  scroll: 0,
  setScroll: (scroll: number) => set(() => ({ scroll: scroll })),
  setSearchQuery: (query: string) => set(() => ({ searchQuery: query })),
}));
export default useChatsSearchStore;
