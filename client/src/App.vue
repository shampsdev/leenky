<script setup lang="ts">
import { useThemeSync } from "./utils/useThemeSync";

useThemeSync(); // Обновляет Telegram-тему
</script>

<template>
  <div class="h-screen flex flex-col items-center justify-center bg-tg text-tg">
    <h1 class="text-3xl font-bold">Telegram Mini App</h1>
    <router-view />
  </div>
</template>

<style scoped>
@import "tailwindcss";
</style>
