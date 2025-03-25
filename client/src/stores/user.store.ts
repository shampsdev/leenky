import { create } from "zustand";
import { UserData } from "../types/user.interface";

interface UserState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userData: Omit<UserData, "isRegistered">;
  updateUserData: (userData: Omit<UserData, "isRegistered">) => void;
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
  updateUserData: (userData: Omit<UserData, "isRegistered">) =>
    set({ userData }),
  setIsLoading: (isLoading: boolean) => set(() => ({ isLoading: isLoading })),
}));
export default useUserStore;
