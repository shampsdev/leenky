<script setup lang="ts">
// WE NEEEED A HUUUUUGE REFACTOR IN HERE

import { ref } from "vue";
import { useRouter } from "vue-router";
import { useProfileStore } from "@/stores/profile.store";
import { useMiniApp } from "vue-tg";
import { postMe } from "@/api/api";

import Button from "@/components/button.vue";
const router = useRouter();
const profileStore = useProfileStore();
const avatar = useMiniApp().initDataUnsafe.user?.photo_url;
const initData = useMiniApp().initData;
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const goToChats = () => {
  router.push("/chats");
};
function autoResize() {
  if (!textareaRef.value) return;

  textareaRef.value.style.height = "auto";
  textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 200)}px`;
}

const limitNewlines = (event: KeyboardEvent) => {
  const value = profileStore.profile.bio;
  if (value != null) {
    const newlines = (value.match(/\n/g) || []).length;
    if (event.key === "Enter" && newlines >= 6) {
      event.preventDefault();
    }
  }
};

const goBack = () => {
  router.back();
};

const updateProfie = async () => {
  const userData = await postMe(initData, profileStore.profile);

  if (userData) {
    profileStore.setProfile(userData);
  } else {
    console.error("Ошибка: данные пользователя не загружены");
  }
};
</script>

<template>
  <div class="w-full flex flex-col h-full items-center p-4">
    <div class="w-[90%]">
      <div class="flex flex-col items-center">
        <img
          class="w-28 h-28 rounded-full object-cover"
          :src="`https://${profileStore.profile.avatar}`"
          alt="User Avatar"
        />
      </div>
      <button
        v-if="profileStore.isChanged"
        @click="
          () => {
            updateProfie();
            goBack();
          }
        "
        class="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Сохранить
      </button>

      <div class="w-full flex flex-col mt-6 p-4 rounded-lg gap-[25px]">
        <section>
          <h2 class="text-sm px-[16px] font-semibold mb-2">Персональные данные</h2>
          <fieldset
            class="border-2 rounded-xl p-3 relative transition-all duration-100 focus-within:border-[#007aff] focus-within:text-[#007aff] border-gray-300 text-gray-400"
          >
            <legend class="px-2 text-sm transition-all duration-100">Имя</legend>
            <input
              type="text"
              maxlength="40"
              v-model="profileStore.profile.firstName"
              class="w-full text-main outline-none px-2 py-1 bg-transparent"
            />
          </fieldset>

          <fieldset
            class="w-full border-2 rounded-xl p-3 relative transition-all duration-100 focus-within:border-[#007aff] focus-within:text-[#007aff] border-gray-300 text-gray-400"
          >
            <legend class="px-2 text-sm transition-all duration-100">Фамилия</legend>
            <input
              type="text"
              maxlength="40"
              v-model="profileStore.profile.lastName"
              class="w-full outline-none px-2 py-1 bg-transparent text-main"
            />
          </fieldset>
        </section>
        <section>
          <h2 class="text-sm px-[16px] font-semibold mb-2">Краткое описание</h2>
          <fieldset
            class="border-2 rounded-xl p-3 relative transition-all duration-100 focus-within:border-[#007aff] focus-within:text-[#007aff] border-gray-300 text-gray-400"
          >
            <legend class="px-2 text-sm transition-all">Место работы</legend>
            <input
              type="text"
              maxlength="40"
              v-model="profileStore.profile.company"
              class="w-full outline-none px-2 py-1 bg-transparent text-main"
            />
          </fieldset>

          <fieldset
            class="border-2 rounded-xl p-3 relative transition-all duration-100 focus-within:border-[#007aff] focus-within:text-[#007aff] border-gray-300 text-gray-400"
          >
            <legend class="px-2 text-sm transition-all duration-100 focus-within:border-[#007aff]">
              Должность
            </legend>
            <input
              type="text"
              maxlength="40"
              v-model="profileStore.profile.role"
              class="w-full outline-none py-1 bg-transparent text-main px-[16px]"
            />
          </fieldset>

          <fieldset
            class="border-2 rounded-xl p-3 relative border-gray-300 focus-within:border-[#007aff] focus-within:text-[#007aff] text-gray-400"
          >
            <legend class="px-2 text-sm">Описание</legend>
            <textarea
              ref="textareaRef"
              v-model="profileStore.profile.bio"
              @input="autoResize"
              @keydown="limitNewlines"
              maxlength="230"
              rows="1"
              class="resize-none w-full outline-none text-main px-[16px]"
            ></textarea>
          </fieldset>
        </section>
      </div>
    </div>
    <Button @click="goToChats">GOTO CHATS</Button>
  </div>
</template>

<style scoped>
fieldset {
  border-radius: 12px;
  margin: 0;
  padding: 0;
}
legend {
  margin-left: 12px;
  padding: 0 4px;
}
</style>
