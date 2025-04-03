import { create } from "zustand";

interface ChatSearchState {
  searchQuery: string;
  chatID: string;
  scroll: number;
  setSearchQuery: (query: string) => void;
  setChatID: (chatId: string) => void;
  setScroll: (scroll: number) => void;
}

const useChatSearchStore = create<ChatSearchState>((set) => ({
  searchQuery: "",
  chatID: "",
  scroll: 0,
  setScroll: (scroll: number) => set(() => ({ scroll: scroll })),
  setSearchQuery: (query: string) => set(() => ({ searchQuery: query })),
  setChatID: (chatID: string) => set(() => ({ chatID: chatID })),
}));

export default useChatSearchStore;
