import { create } from "zustand";

export interface UIChatSearchData {
  searchQuery: string;
  scroll: number;
}

interface ChatsDataStore {
  chats: Map<string, UIChatSearchData>;

  saveChatData: (chatId: string, data: Partial<UIChatSearchData>) => void;
  saveSearchQuery: (chatId: string, query: string) => void;
  saveScroll: (chatId: string, scroll: number) => void;

  getScroll: (chatId: string) => number;
  getSearchQuery: (chatId: string) => string;
}

const useChatSearchStore = create<ChatsDataStore>((set, get) => ({
  chats: new Map(),

  saveChatData: (chatId, data) =>
    set((state) => {
      const prev = state.chats.get(chatId) || { searchQuery: "", scroll: 0 };
      const updated = { ...prev, ...data };
      const newMap = new Map(state.chats);
      newMap.set(chatId, updated);
      return { chats: newMap };
    }),

  saveSearchQuery: (chatId, query) => {
    get().saveChatData(chatId, { searchQuery: query });
  },

  saveScroll: (chatId, scroll) => {
    get().saveChatData(chatId, { scroll });
  },

  getScroll: (chatId) => {
    return get().chats.get(chatId)?.scroll ?? 0;
  },

  getSearchQuery: (chatId) => {
    return get().chats.get(chatId)?.searchQuery ?? "";
  },
}));

export default useChatSearchStore;
