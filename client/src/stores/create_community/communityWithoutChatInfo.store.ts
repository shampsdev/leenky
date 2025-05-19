import { create } from "zustand";
import { Field } from "../../types/fields/field.interface";

interface CommunityInfoStore {
  description: string;
  fields: Field[];
  chatRequired: boolean;
  chatId: string;
  name: string;
  avatar: File | null;

  setDescription: (v: string) => void;
  setFields: (fields: Field[]) => void;
  setChatRequired: (v: boolean) => void;
  setChatId: (v: string) => void;
  setName: (name: string) => void;
  setAvatar: (img: File) => void;
  resetStore: () => void;
}

const useCommunityWithoutChatInfoStore = create<CommunityInfoStore>((set) => ({
  description: "",
  fields: [],
  chatRequired: false,
  name: "",
  chatId: "",
  avatar: null,

  setDescription: (v) => set({ description: v }),
  setFields: (fields) => set({ fields }),
  setChatRequired: (v) => set({ chatRequired: v }),
  setChatId: (v) => set({ chatId: v }),
  setName: (name: string) => set({ name: name }),
  setAvatar: (img: File) => set({ avatar: img }),
  resetStore: () =>
    set({
      description: "",
      fields: [],
      chatRequired: false,
      chatId: "",
      name: "",
      avatar: null,
    }),
}));

export default useCommunityWithoutChatInfoStore;
