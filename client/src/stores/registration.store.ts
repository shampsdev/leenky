import { defineStore } from 'pinia';
import type { ProfileUserData } from '@/types/user.interface';

export const useRegistrationStore = defineStore('registration', {
  state: () => ({
    editMode: false as boolean,

    profile: <ProfileUserData>{
      firstName: '',
      lastName: '',
      role: '',
      company: '',
      bio: '',
      avatar: '',
      telegramUsername: '',
    },

    editFieldProfile: <ProfileUserData>{
      firstName: '',
      lastName: '',
      role: '',
      company: '',
      bio: '',
      avatar: '',
      telegramUsername: '',
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
    isFilled(): boolean {
      try {
        if (
          this.profile.firstName !== null &&
          this.profile.lastName !== null &&
          this.profile.bio !== null &&
          this.profile.role !== null &&
          this.profile.company !== null
        ) {
          if (
            this.profile.firstName?.length > 0 &&
            this.profile.lastName?.length > 0 &&
            this.profile.bio.length > 0 &&
            this.profile.company.length > 0 &&
            this.profile.role.length > 0
          ) {
            return true;
          }
          return false;
        }
      } catch (error) {
        return false;
      }

      return false;
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
