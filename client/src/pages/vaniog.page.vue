<script setup lang="ts">
import { useMiniApp } from "vue-tg";
import { useRoute } from "vue-router";
import { getChats, getChat, getMe } from "@/api/api";
import { ref, onMounted } from "vue";
const miniApp = useMiniApp();
const route = useRoute();
const initData = miniApp.initData;
const initDataUnsafe = miniApp.initDataUnsafe;
const chatId = initDataUnsafe.start_param;

const chatsInfo = ref(null);
const chatInfo = ref(null);
const profileInfo = ref(null);

onMounted(async () => {
  try {
    chatsInfo.value = await getChats(initData);
    console.log(chatInfo.value);
    if (chatId) {
      chatInfo.value = await getChat(initData, chatId);
    }
    profileInfo.value = await getMe(initData);
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
  }
});
</script>
<template>
  <h1>Init Data Unsafe</h1>
  <p>
    {{ initDataUnsafe }}
  </p>
  <h1>Init Data</h1>
  <p>
    {{ initData }}
  </p>
  <h1>start data</h1>
  <p>{{ chatId }}</p>

  <h1>chat info</h1>
  <p>{{ chatInfo }}</p>

  <h1>chatS info</h1>
  <p>
    {{ chatsInfo }}
  </p>

  <h1>My Profile:</h1>
  <p>{{ profileInfo }}</p>
</template>
<style scoped>
h1 {
  color: blueviolet;
}
</style>
