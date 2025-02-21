<script setup lang="ts">
import { getMe } from "@/api/api";
import { useMiniApp } from "vue-tg";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
const miniApp = useMiniApp();
const initData = miniApp.initData;
const router = useRouter();
const isRegistered = false;

onMounted(async () => {
  const userData = await getMe(initData);
  if (userData === null) {
    console.log("USERDATA IS NULLL");
    router.replace("/about/1");
  } else {
    router.replace("/chats");
  }
});
</script>
<template></template>
