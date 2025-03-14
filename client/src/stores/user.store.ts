import { create } from "zustand";
import { UserData } from "../types/user.interface";

interface UserState {
  isAuthenticated: boolean;
  userData: UserData;
  updateUserData: (userData: UserData) => void;
  authenticate: () => void;
}

const useUserStore = create<UserState>((set) => ({
  userData: {
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
  isAuthenticated: false,
  authenticate: () => set((state) => ({ ...state, isAuthenticated: true })),
  updateUserData: (userData: UserData) => set({ userData }),
}));
export default useUserStore;
