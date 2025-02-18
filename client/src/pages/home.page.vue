<script lang="ts" setup>
import { watchEffect, ref } from "vue";
import { MainButton, useWebAppPopup } from "vue-tg";
import { useUserStore } from "@/stores/user.store";
import { useMiniApp } from "vue-tg";
import { secureRedirect } from "@/utils/secureRedirect";
import { useRouter } from "vue-router";
const { showAlert } = useWebAppPopup();

const userStore = useUserStore();
const initData = useMiniApp().initDataUnsafe;
const router = useRouter();

watchEffect(() => {
  if (initData.user && userStore.firstName === null) {
    userStore.setUserData({
      lastName: initData.user.last_name,
      firstName: initData.user.first_name,
      avatar: initData.user.photo_url,
      username: initData.user.username,
    });
  }
});

const firstNameInput = ref(userStore.firstName || "");

const updateFirstName = () => {
  userStore.setUserData({ firstName: firstNameInput.value });
};
const routeToChats = () => {
  secureRedirect(router, "/chats");
};
</script>

<template>
  <div class="absolute">{{ userStore.username }}</div>
  <img :src="userStore.avatar || ''" alt="" srcset="" />
  <div>{{ userStore.avatar }}</div>
  <div>{{ userStore.firstName }}</div>
  <div>{{ userStore.lastName }}</div>

  <input v-model="firstNameInput" type="text" placeholder="Введите имя" />

  <button @click="updateFirstName">Submit</button>

  <p><strong>Текущее имя:</strong> {{ userStore.firstName }}</p>
  <button @click="routeToChats">GoToChats</button>

  <MainButton text="Open alert" @click="() => showAlert('Hello!')" />
</template>
