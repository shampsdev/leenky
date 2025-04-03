import { create } from "zustand";

interface InviteStoreState {
  showedOnce: boolean;
  setShowedOnce: () => void;
}

const useInviteStore = create<InviteStoreState>((set) => ({
  showedOnce: false,
  setShowedOnce: () => set({ showedOnce: true }),
}));

export default useInviteStore;
