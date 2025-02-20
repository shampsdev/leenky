<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const goToProfile = () => {
  router.push("/profile");
};
</script>
<template>
  <div class="absolute top-[15px] right-[23px] z-10" @click="goToProfile">
    <img class="w-[30px] h-[30px]" src="/src/assets/Profile.svg" alt="" />
  </div>
</template>
