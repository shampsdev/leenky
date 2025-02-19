<script setup lang="ts">
import { useMiniApp } from "vue-tg";
import { useRoute } from "vue-router";
const miniApp = useMiniApp();
const route = useRoute();
const initData = miniApp.initData;
const initDataUnsafe = miniApp.initDataUnsafe;
const chatId = route.params.id;
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
  <p>{{ initDataUnsafe.start_param }} {{ chatId }}</p>
</template>
<style scoped>
h1 {
  color: blueviolet;
}
</style>
