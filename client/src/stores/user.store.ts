import { create } from "zustand";
import { User } from "../types/user/user.interface";

interface UserState {
  userData: User;
  setUserData: (data: User) => void;
}

const useUserStore = create<UserState>((set) => ({
  userData: {
    avatar: "",
    firstName: "",
    lastName: "",
    id: "",
    telegramId: 0,
    telegramUsername: "",
  },
  setUserData: (data: User) => set(() => ({ userData: data })),
}));

export default useUserStore;
