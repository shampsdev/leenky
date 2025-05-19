import { create } from "zustand";
import { initDataStartParam } from "@telegram-apps/sdk-react";

const useStartParamStore = create(() => ({
  startParam: initDataStartParam(),
}));

export default useStartParamStore;
