import { defineStore } from "pinia";

interface UserDataInterface {
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  role: string | null;
  bio: string | null;
  company: string | null;
}

export const useUserStore = defineStore("user", {
  state: (): UserDataInterface => ({
    username: null,
    firstName: null,
    lastName: null,
    avatar: null,
    role: null,
    bio: null,
    company: null,
  }),

  actions: {
    setUserData(user: Partial<UserDataInterface>) {
      Object.assign(this, user);
    },
  },
});
