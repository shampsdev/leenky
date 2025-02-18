import { useAuthStore } from "@/stores/auth.store";
import type { Router } from "vue-router";

export const secureRedirect = (router: Router, to: string) => {
  const authStore = useAuthStore();
  if (!authStore.isAuthorized) {
    router.push("/login");
  } else {
    router.push(to);
  }
};
