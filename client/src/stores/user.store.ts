import { create } from "zustand";
import { UserData } from "../types/user.interface";

interface UserState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userData: UserData;
  updateUserData: (userData: UserData) => void;
  setIsLoading: (isLoading: boolean) => void;
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
  isLoading: true,
  isAuthenticated: false,
  authenticate: () => set(() => ({ isAuthenticated: true })),
  updateUserData: (userData: UserData) => set({ userData }),
  setIsLoading: (isLoading: boolean) => set(() => ({ isLoading: isLoading })),
}));
export default useUserStore;
