import { defineStore } from "pinia";
import type { UserData } from "@/api/api";
import { getMe, postMe } from "@/api/api";

export const useProfileStore = defineStore("profile", {
  state: () => ({
    editMode: false as boolean,

    profile: <UserData>{
      firstName: "",
      lastName: "",
      role: "",
      company: "",
      bio: "",
      avatar: "",
    },

    initialProfile: <UserData>{
      firstName: "",
      lastName: "",
      role: "",
      company: "",
      bio: "",
      avatar: "",
    },
  }),

  getters: {
    isChanged: (state): boolean => {
      return JSON.stringify(state.profile) !== JSON.stringify(state.initialProfile);
    },
  },

  actions: {
    setProfile(newProfile: UserData) {
      this.initialProfile = { ...newProfile };
      this.profile = { ...newProfile };
    },

    resetProfile() {
      this.profile = { ...this.initialProfile };
      this.editMode = false;
    },

    toggleEditMode() {
      this.editMode = !this.editMode;
    },

    async loadProfile(token: string) {
      try {
        const data = await getMe(token);
        this.setProfile(data);
      } catch (error) {
        console.error("Ошибка при загрузке профиля", error);
      }
    },

    async updateProfile(initData: string) {
      try {
        const data = await postMe(initData, this.profile);
        if (data !== undefined) this.setProfile(data);
      } catch (error) {
        console.error("Ошибка при сохранении профиля", error);
      }
    },
  },
});
