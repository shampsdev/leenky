import { create } from "zustand";
import { ProfileUserData, UserData } from "../types/user.interface";

interface CurrentProfileState {
  isEditing: boolean;
  isChanged: boolean;
  profileData: ProfileUserData;
  updateIsEditing: (isEditing: boolean) => void;
  updateProfileData: (data: UserData) => void;
  updateIsChanged: (isChanged: boolean) => void;
  reset: () => void;
}

const useCurrentProfileStore = create<CurrentProfileState>((set) => ({
  isEditing: false,
  isChanged: false,
  profileData: {
    firstName: null,
    lastName: null,
    company: null,
    role: null,
    avatar: null,
    telegramUsername: null,
    bio: null,
    id: null,
    telegramId: null,
  },
  reset: () =>
    set({
      profileData: {
        firstName: null,
        lastName: null,
        company: null,
        role: null,
        avatar: null,
        telegramUsername: null,
        bio: null,
      },
      isChanged: false,
      isEditing: false,
    }),
  updateProfileData: (data: UserData) =>
    set((state) => ({
      profileData: data,
    })),
  updateIsEditing: (isEditing: boolean) => set({ isEditing }),
  updateIsChanged: (isChanged: boolean) => set({ isChanged }),
}));

interface EditProfileState {
  profileData: ProfileUserData;
  setProfileData: (data: ProfileUserData) => void;
  reset: () => void;
}
export const useEditProfileStore = create<EditProfileState>((set) => ({
  profileData: {
    firstName: null,
    lastName: null,
    company: null,
    role: null,
    avatar: null,
    telegramUsername: null,
    bio: null,
  },

  setProfileData: (data: ProfileUserData) =>
    set((state) => ({
      profileData: data,
    })),

  reset: () =>
    set({
      profileData: {
        firstName: null,
        lastName: null,
        company: null,
        role: null,
        avatar: null,
        telegramUsername: null,
        bio: null,
      },
    }),
}));
export default useCurrentProfileStore;
