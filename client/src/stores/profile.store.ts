import { defineStore } from "pinia";
import type { ProfileUserData } from "@/types/user.interface";
import { getMe, postMe } from "@/api/api";

export const useProfileStore = defineStore("profile", {
  state: () => ({
    editMode: false as boolean,

    profile: <ProfileUserData>{
      firstName: null,
      lastName: null,
      role: null,
      company: null,
      bio: null,
      avatar: null,
    },

    editFieldProfile: <ProfileUserData>{
      firstName: null,
      lastName: null,
      role: null,
      company: null,
      bio: null,
      avatar: null,
    },
  }),

  getters: {
    isChanged: (state): boolean => {
      return JSON.stringify(state.profile) !== JSON.stringify(state.editFieldProfile);
    },
  },

  actions: {
    setProfile(newProfile: ProfileUserData) {
      this.editFieldProfile = { ...newProfile };
      this.profile = { ...newProfile };
    },

    toggleEditMode() {
      this.editMode = !this.editMode;
    },
  },
});
