<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMiniApp } from "vue-tg";

const router = useRouter();

const goToMain = () => {
  router.push("/");
};
</script>

<template>
  <button @click="goToMain">GoToMain</button>
</template>

<style scoped></style>
