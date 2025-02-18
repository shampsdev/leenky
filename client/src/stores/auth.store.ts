import { defineStore } from "pinia";
import { computed, ref } from "vue";

interface AuthStoreData {
  isAuthorized: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthStoreData => ({
    isAuthorized: false,
  }),
  actions: {
    checkAuth() {
      this.isAuthorized = false;
    },
  },
});
