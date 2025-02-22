import type { ChatData, ChatPreviewData } from '@/types/user.interface';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

interface InviteStoreData {
  isModalClosed: boolean;
  chat: ChatPreviewData | null;
}

export const useInviteStore = defineStore('invite', {
  state: (): InviteStoreData => ({
    isModalClosed: false,
    chat: null,
  }),
  actions: {
    closeModal() {
      this.isModalClosed = true;
    },
    openModal() {
      this.isModalClosed = false;
    },
    setChat(chat: ChatPreviewData) {
      this.chat = chat;
    },
  },
});
