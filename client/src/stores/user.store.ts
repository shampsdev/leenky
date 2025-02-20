import { defineStore } from "pinia";
import type { UserData } from "@/types/user.interface";
export const useUserStore = defineStore("user", {
  state: (): UserData => ({
    firstName: null,
    lastName: null,
    company: null,
    role: null,
    avatar: null,
    telegramUsername: null,
    bio: null,
    id: null,
    telegramId: null,
  }),

  actions: {
    logIn(user: UserData) {
      this.firstName = user.firstName || "";
      this.lastName = user.lastName || "";
      this.company = user.company || "";
      this.role = user.role || "";
      this.avatar = user.avatar || "";
      this.telegramUsername = user.telegramUsername || "";
      this.bio = user.bio || "";
      this.id = user.id || "";
      this.telegramId = user.telegramId || "";
    },
  },
});
