import { defineStore } from 'pinia';
import type { ChatData, UserData } from '@/types/user.interface';
import type { ProfileUserData } from '@/types/user.interface';
import { getMe, postMe } from '@/api/api';

export const useChatsSearchStore = defineStore('chatsSearch', {
  state: () => ({
    searchQuery: '',
    chatsData: [] as ChatData[],
  }),

  actions: {
    setQuery(query: string) {
      this.searchQuery = query;
    },
    setChats(newChats: ChatData[]) {
      this.chatsData = newChats;
    },
    resetQuery() {
      this.searchQuery = '';
    },
    resetChatsData() {
      this.chatsData = [] as ChatData[];
    },
  },
});
