import { defineStore } from 'pinia';
import type { ChatData, UserData } from '@/types/user.interface';
import type { ProfileUserData } from '@/types/user.interface';
import { getMe, postMe } from '@/api/api';

export const useChatSearchStore = defineStore('chatSearch', {
  state: () => ({
    searchQuery: '',
    scrollY: 0,
    chatData: {} as ChatData,
  }),

  actions: {
    setQuery(query: string) {
      this.searchQuery = query;
    },
    setUsers(newUsers: UserData[]) {
      this.chatData.users = newUsers;
    },
    setScrollY(scroll: number) {
      this.scrollY = scroll;
    },
    setChatData(newChatData: ChatData) {
      this.chatData = newChatData;
    },
    resetScrollY() {
      this.scrollY = 0;
    },
    resetQuery() {
      this.searchQuery = '';
    },
  },
});
