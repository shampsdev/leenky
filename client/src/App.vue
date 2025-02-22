<script setup lang="ts">
import { useBackButton, useMiniApp } from "vue-tg";
import { useRouter, useRoute } from "vue-router";
import { useProfileStore } from "./stores/profile.store";
const backButton = useBackButton();
const router = useRouter();
const route = useRoute();
const miniApp = useMiniApp();
const profileStore = useProfileStore();
if (backButton?.show) {
  backButton.show();
}

if (backButton?.onClick) {
  backButton.onClick(() => {
    if (route.fullPath === "/chats") {
      miniApp.close();
    }
    if (profileStore.editMode) {
      profileStore.editMode = !profileStore.editMode;
      router.push("/profile");
    } else {
      router.back();
    }
  });
}
</script>

<template>
  <div class="bg-main w-[100vw] h-[100vh] overflow-auto">
    <router-view />
  </div>
</template>

<style scoped>
@import "tailwindcss";

@font-face {
  font-family: "SF";
  src: url("/src/assets/fonts/SFProText-Regular.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "SF";
  src: url("/src/assets/fonts/SFProText-Bold.ttf") format("truetype");
  font-weight: bold;
  font-style: normal;
}

/* Add additional font weights as needed */
@font-face {
  font-family: "SF";
  src: url("/src/assets/fonts/SFProText-Light.ttf") format("truetype");
  font-weight: 300;
  font-style: normal;
}

@font-face {
  font-family: "SF";
  src: url("/src/assets/fonts/SFProText-Regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: "SF";
  src: url("/src/assets/fonts/SFProText-Medium.ttf") format("truetype");
  font-weight: 500;
  font-style: normal;
}

@font-face {
  font-family: "SF";
  src: url("/src/assets/fonts/SFProText-Semibold.ttf") format("truetype");
  font-weight: 600;
  font-style: normal;
}

* {
  font-family: "SF";
  font-weight: 400;
}
</style>
