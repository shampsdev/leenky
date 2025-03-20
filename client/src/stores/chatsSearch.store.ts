import { create } from "zustand";

interface ChatsSearchState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const useChatsSearchStore = create<ChatsSearchState>((set) => ({
  searchQuery: "",
  setSearchQuery: (query: string) => set(() => ({ searchQuery: query })),
}));
export default useChatsSearchStore;
