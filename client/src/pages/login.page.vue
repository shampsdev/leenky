<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const goToMain = () => {
  router.push("/");
};
</script>
<template>
  <div>Login Page</div>
  <button @click="goToMain"></button>
</template>
