import { create } from "zustand";
import { initData } from "@telegram-apps/sdk-react";

const useInitDataStore = create(() => ({
  initData: initData.raw() ?? "",
}));

export default useInitDataStore;
