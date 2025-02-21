<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useProfileStore } from "@/stores/profile.store";
import Button from "@/components/button.vue";
import { useUserStore } from "@/stores/user.store";
import { getMe, getUserById, postMe } from "@/api/api";
import { useMiniApp } from "vue-tg";

const router = useRouter();
const route = useRoute();
const profileStore = useProfileStore();
const goToChats = () => {
  router.push("/chats");
};

const currentUser = useUserStore();
const userId = route.params.id as string;
const isCurrentUserProfile = ref(false);
const initData = useMiniApp().initData;

const textareaRef = ref<HTMLTextAreaElement | null>(null);

function autoResize() {
  if (!textareaRef.value) return;
  textareaRef.value.style.height = "auto";
  textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 200)}px`;
}

const limitNewlines = (event: KeyboardEvent) => {
  const value = profileStore.editFieldProfile.bio;
  if (value != null) {
    const newlines = (value.match(/\n/g) || []).length;
    if (event.key === "Enter" && newlines >= 6) {
      event.preventDefault();
    }
  }
};

async function RefreshProfile() {
  if (isCurrentUserProfile.value) {
    const fetchedUserData = await getMe(initData);
    if (fetchedUserData !== null) {
      profileStore.profile = fetchedUserData;
      profileStore.editFieldProfile = { ...fetchedUserData };
    }
  } else {
    const fetchedUserData = await getUserById(initData, userId);
    if (fetchedUserData !== null) {
      profileStore.profile = fetchedUserData;
      profileStore.editFieldProfile = { ...fetchedUserData };
    }
  }
}

const saveChanges = async () => {
  try {
    await postMe(initData, profileStore.editFieldProfile);
    await RefreshProfile();
    profileStore.toggleEditMode();
  } catch (error) {
    console.error("Ошибка при сохранении изменений:", error);
  }
};

onMounted(async () => {
  console.log(profileStore);
  console.log(userId);
  isCurrentUserProfile.value = currentUser.id === userId;
  await RefreshProfile();
});
</script>

<template>
  <div class="w-full flex flex-col h-full items-center p-4">
    <div class="w-full">
      <div class="flex flex-col items-center">
        <img
          class="w-28 h-28 rounded-full object-cover"
          :src="`https://${profileStore.profile.avatar}`"
          alt="User Avatar"
        />

        <div v-if="!profileStore.editMode" class="flex flex-row items-center gap-[10px] mt-[17px]">
          <p class="font-semibold text-[20px text-center">
            {{ profileStore.profile.firstName }} {{ profileStore.profile.lastName }}
          </p>
          <img
            v-if="isCurrentUserProfile"
            src="/src/assets/edit_24.svg"
            alt=""
            srcset=""
            @click="profileStore.toggleEditMode"
          />
        </div>
        <div v-else>
          <button
            v-if="profileStore.isChanged"
            @click="saveChanges"
            class="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Сохранить
          </button>
        </div>

        <p v-if="!profileStore.editMode" class="text-gray-500">
          {{ `@${profileStore.profile.telegramUsername}` }}
        </p>
      </div>

      <Button
        v-if="!profileStore.editMode"
        class="flex flex-row mt-[10px] items-center gap-[6px] m-auto"
      >
        Написать <img class="w-4 h-4" src="/src/assets/tg_white.svg" alt="Telegram" />
      </Button>

      <div v-if="!profileStore.editMode">
        <div class="mt-6 p-4 rounded-lg">
          <h2 class="text-sm px-[16px] font-semibold mb-2">ABOUT</h2>
          <div class="bg-form px-[16px] rounded-[12px]">
            <div class="border-b py-[12px] border-tint">
              <p class="text-xs text-hint">Место работы</p>
              <p class="">{{ profileStore.profile.company }}</p>
            </div>

            <div class="py-[12px] border-b border-tint">
              <p class="text-xs text-hint">Должность</p>
              <p class="whitespace-pre-line">{{ profileStore.profile.role }}</p>
            </div>

            <div class="py-2">
              <p class="text-xs text-hint">Описание</p>
              <p class="text-sm whitespace-pre-line">
                {{ profileStore.profile.bio }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="w-full flex flex-col mt-6 p-4 rounded-lg gap-[25px]">
        <section>
          <h2 class="text-sm px-[16px] font-semibold mb-2">Персональные данные</h2>
          <fieldset
            class="border-2 rounded-xl p-3 relative transition-all duration-100 focus-within:border-[#007aff] focus-within:text-[#007aff] border-gray-300 text-gray-400"
          >
            <legend class="px-2 text-sm transition-all duration-100">Имя</legend>
            <input
              type="text"
              maxlength="40"
              v-model="profileStore.editFieldProfile.firstName"
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
              v-model="profileStore.editFieldProfile.lastName"
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
              v-model="profileStore.editFieldProfile.company"
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
              v-model="profileStore.editFieldProfile.role"
              class="w-full outline-none py-1 bg-transparent text-main px-[16px]"
            />
          </fieldset>

          <fieldset
            class="border-2 rounded-xl p-3 relative border-gray-300 focus-within:border-[#007aff] focus-within:text-[#007aff] text-gray-400"
          >
            <legend class="px-2 text-sm">Описание</legend>
            <textarea
              ref="textareaRef"
              v-model="profileStore.editFieldProfile.bio"
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

    <Button v-if="!profileStore.editMode" @click="goToChats">GOTO CHATS</Button>
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
