<script setup lang="ts">
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user.store";
const router = useRouter();
const currentUser = useUserStore();
const goToProfile = () => {
  router.push(`/profile/${currentUser.id}`);
};
</script>
<template>
  <div class="absolute top-[15px] right-[23px] z-10" @click="goToProfile">
    <img class="w-[30px] h-[30px]" src="/src/assets/Profile.svg" alt="" />
  </div>
</template>
