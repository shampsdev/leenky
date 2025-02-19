import { defineStore } from "pinia";
import { computed, reactive } from "vue";

export const useProfileStore = defineStore("profile", {
  state: () => ({
    editMode: false,

    initialProfile: {
      firstName: "mike",
      lastName: "de geofroy",
      job: "FullStack Developer",
      workplace: "@shamps.dev",
      description: "some description here",
    },

    profile: {
      firstName: "mike",
      lastName: "de geofroy",
      job: "FullStack Developer",
      workplace: "@shamps.dev",
      description: "some description here",
    },
  }),

  getters: {
    isChanged: (state) => {
      return JSON.stringify(state.profile) !== JSON.stringify(state.initialProfile);
    },
  },

  actions: {
    toggleEditMode() {
      this.editMode = !this.editMode;
    },

    saveProfile() {
      this.initialProfile = { ...this.profile };
      this.editMode = false;
    },

    resetProfile() {
      this.profile = { ...this.initialProfile };
    },
  },
});
