import { defineStore } from "pinia";
import type { ProfileUserData } from "@/types/user.interface";
import { getMe, postMe } from "@/api/api";

export const useProfileStore = defineStore("profile", {
  state: () => ({
    editMode: false as boolean,

    profile: <ProfileUserData>{
      firstName: "",
      lastName: "",
      role: "",
      company: "",
      bio: "",
      avatar: "",
      telegramUsername: "",
    },

    editFieldProfile: <ProfileUserData>{
      firstName: "",
      lastName: "",
      role: "",
      company: "",
      bio: "",
      avatar: "",
      telegramUsername: "",
    },
  }),

  getters: {
    isChanged(): boolean {
      const isChanged =
        this.profile.firstName !== this.editFieldProfile.firstName ||
        this.profile.lastName !== this.editFieldProfile.lastName ||
        this.profile.role !== this.editFieldProfile.role ||
        this.profile.company !== this.editFieldProfile.company ||
        this.profile.bio !== this.editFieldProfile.bio;

      console.log(isChanged);
      return isChanged;
    },
  },

  actions: {
    setProfile(newProfile: ProfileUserData) {
      this.editFieldProfile = { ...newProfile };
      this.profile = { ...newProfile };
    },

    toggleEditMode() {
      if (!this.editMode) {
        this.editFieldProfile = { ...this.profile };
      }
      this.editMode = !this.editMode;
    },
  },
});
