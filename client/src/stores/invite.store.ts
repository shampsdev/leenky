import { defineStore } from "pinia";
import { computed, ref } from "vue";

interface InviteStoreData {
  isModalClosed: boolean;
}

export const useInviteStore = defineStore("invite", {
  state: (): InviteStoreData => ({
    isModalClosed: false,
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
