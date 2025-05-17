import { create } from "zustand";
import { Field } from "../../types/fields/field.interface";

interface CommunityInfoStore {
  description: string;
  fields: Field[];
  chatRequired: boolean;
  communityId: string;

  setDescription: (v: string) => void;
  setFields: (fields: Field[]) => void;
  setChatRequired: (v: boolean) => void;
  setCommunityId: (communityId: string) => void;

  resetStore: () => void;
}

const useCommunityWithChatInfoStore = create<CommunityInfoStore>((set) => ({
  description: "",
  fields: [],
  chatRequired: false,
  chatId: "",
  communityId: "",

  setDescription: (v) => set({ description: v }),
  setFields: (fields) => set({ fields }),
  setChatRequired: (v) => set({ chatRequired: v }),
  setCommunityId: (communityId: string) => set({ communityId: communityId }),

  resetStore: () =>
    set({
      description: "",
      fields: [],
      chatRequired: false,
      communityId: "",
    }),
}));

export default useCommunityWithChatInfoStore;
