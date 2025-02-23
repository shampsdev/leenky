<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user.store';
import { onMounted } from 'vue';
import { useMiniApp } from 'vue-tg';
import { handleImageError } from '@/utils/errorHandlers';
const router = useRouter();
const currentUser = useUserStore();
const avatar = useMiniApp().initDataUnsafe.user?.photo_url;
const goToProfile = () => {
  router.push(`/profile/${currentUser.id}`);
};
</script>
<template>
  <div class="" @click="goToProfile">
    <img class="w-[36px] h-[36px]" :src="avatar" @error="handleImageError" />
  </div>
</template>
