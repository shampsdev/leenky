<script setup lang="ts">
import { getChat, getMe, joinMe } from "@/api/api";
import { useMiniApp } from "vue-tg";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { useUserStore } from "@/stores/user.store";
const miniApp = useMiniApp();
const initData = miniApp.initData;
const router = useRouter();
const currentUser = useUserStore();
const startData = miniApp.initDataUnsafe.start_param || "";
onMounted(async () => {
  const userData = await getMe(initData);
  if (userData !== null) {
    currentUser.logIn(userData);
    if (miniApp.initDataUnsafe.start_param !== undefined) {
      const getChatResponse = await getChat(initData, startData);
      if (getChatResponse) {
        router.replace(`/chats`);
        setTimeout(() => {
          router.push(`/chat/${startData}`);
        }, 100);
      } else {
        router.replace("/invite");
      }
    } else {
      router.replace("/chats");
    }
  } else {
    router.replace("/about/1");
  }
});
</script>
<template></template>
