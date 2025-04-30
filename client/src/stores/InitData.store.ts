// stores/InitData.store.ts
import { create } from "zustand";
import {
  initData,
  initDataStartParam,
  initDataUser,
} from "@telegram-apps/sdk-react";

interface InitDataState {
  initData: string;
  initDataUser: ReturnType<typeof initDataUser> | null;
  initDataStartParam: ReturnType<typeof initDataStartParam> | null;
  initialized: boolean;
  initialize: () => void;
}

const useInitDataStore = create<InitDataState>((set) => ({
  initData: "",
  initDataUser: null,
  initialized: false,
  initDataStartParam: null,
  initialize: () => {
    const raw = initData.raw();
    const user = initDataUser();
    const startParam = initDataStartParam();
    set({
      initData: raw ?? "",
      initDataUser: user ?? null,
      initDataStartParam: startParam ?? null,
      initialized: true,
    });
  },
}));

export default useInitDataStore;
