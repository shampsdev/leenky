import { create } from "zustand";
import { UserData } from "../types/user.interface";

interface UserState {
  userData: UserData;
  updateUserData: (userData: UserData) => void;
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
  updateUserData: (userData: UserData) => set({ userData }),
}));
export default useUserStore;
