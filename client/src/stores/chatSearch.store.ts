import { defineStore } from 'pinia';
import type { ChatData, UserData } from '@/types/user.interface';
import type { ProfileUserData } from '@/types/user.interface';
import { getMe, postMe } from '@/api/api';

export const useChatSearchStore = defineStore('chatSearch', {
  state: () => ({
    searchQuery: '',
    chatData: {} as ChatData,
  }),

  actions: {
    setQuery(query: string) {
      this.searchQuery = query;
    },
    setUsers(newUsers: UserData[]) {
      this.chatData.users = newUsers;
    },
    setChatData(newChatData: ChatData) {
      this.chatData = newChatData;
    },
    resetQuery() {
      this.searchQuery = '';
    },
    resetChatData() {
      this.chatData = {} as ChatData;
    },
  },
});
