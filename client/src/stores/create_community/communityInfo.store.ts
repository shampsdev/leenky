import { create } from "zustand";
import { Field } from "../../types/fields/field.interface";

interface CommunityInfoStore {
  description: string;
  fields: Field[];
  chatRequired: boolean;
  chatId: string;

  setDescription: (v: string) => void;
  setFields: (fields: Field[]) => void;
  setChatRequired: (v: boolean) => void;
  setChatId: (v: string) => void;

  resetStore: () => void;
}

const useCommunityInfoStore = create<CommunityInfoStore>((set) => ({
  description: "",
  fields: [],
  chatRequired: false,
  chatId: "",

  setDescription: (v) => set({ description: v }),
  setFields: (fields) => set({ fields }),
  setChatRequired: (v) => set({ chatRequired: v }),
  setChatId: (v) => set({ chatId: v }),

  resetStore: () =>
    set({
      description: "",
      fields: [],
      chatRequired: false,
      chatId: "",
    }),
}));

export default useCommunityInfoStore;
