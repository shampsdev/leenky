<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user.store';
import { onMounted } from 'vue';
import { useMiniApp } from 'vue-tg';
const router = useRouter();
const currentUser = useUserStore();
const avatar = useMiniApp().initDataUnsafe.user?.photo_url;
const goToProfile = () => {
  router.push(`/profile/${currentUser.id}`);
};
</script>
<template>
  <div class="" @click="goToProfile">
    <img
      class="w-[36px] h-[36px] rounded-full"
      :src="avatar ?? '/src/assests/chat_avatar_example.png'"
      alt=""
    />
  </div>
</template>
