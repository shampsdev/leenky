import { create } from "zustand";

interface ChatSearchState {
  searchQuery: string;
  chatID: string;
  setSearchQuery: (query: string) => void;
  setChatID: (chatId: string) => void;
}

const useChatSearchStore = create<ChatSearchState>((set) => ({
  searchQuery: "",
  chatID: "",
  setSearchQuery: (query: string) => set(() => ({ searchQuery: query })),
  setChatID: (chatID: string) => set(() => ({ chatID: chatID })),
}));

export default useChatSearchStore;
