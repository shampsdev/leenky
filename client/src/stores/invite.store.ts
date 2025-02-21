import type { ChatData } from "@/types/user.interface";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

interface InviteStoreData {
  isModalClosed: boolean;
  chat: ChatData | null;
}

export const useInviteStore = defineStore("invite", {
  state: (): InviteStoreData => ({
    isModalClosed: false,
    chat: null,
  }),
  actions: {
    close() {
      this.isModalClosed = true;
    },
    open() {
      this.isModalClosed = false;
    },
  },
});
