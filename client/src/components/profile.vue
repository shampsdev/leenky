<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user.store';
const router = useRouter();
const currentUser = useUserStore();
const goToProfile = () => {
  router.push(`/profile/${currentUser.id}`);
};
</script>
<template>
  <div class="" @click="goToProfile">
    <img
      class="w-[36px] h-[36px]"
      :src="currentUser.avatar ?? '/src/assests/chat_avatar_example.png'"
      alt=""
    />
  </div>
</template>
