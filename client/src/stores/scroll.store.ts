import { defineStore } from "pinia";
import type { ProfileUserData } from "@/types/user.interface";
import { getMe, postMe } from "@/api/api";
import { ref } from "vue";
export const useScrollStore = defineStore("scroll", {
  state: () => ({
    scrollY: 0,
    scrollContainer: ref<HTMLDivElement | null>(null),
  }),

  actions: {
    setScrollY(containerScrollY: number) {
      this.scrollY = containerScrollY;
    },
    resetScroll() {
      this.scrollY = 0;
    },
    setScrollContainer() {},
  },
});
