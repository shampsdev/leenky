<script setup lang="ts">
// WE NEEEED A HUUUUUGE REFACTOR IN HERE

import { ref, watch, nextTick, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useProfileStore } from "@/stores/profile.store";
import Button from "@/components/button.vue";
import { useMiniApp } from "vue-tg";
const router = useRouter();
const profileStore = useProfileStore();
const avatar = useMiniApp().initDataUnsafe.user?.photo_url;
const initData = useMiniApp().initData;
const goToChats = () => {
  router.push("/chats");
};

const tgUsername = useMiniApp().initDataUnsafe.user?.username;

onMounted(() => {
  profileStore.loadProfile(initData);
});
</script>

<template>
  <div class="w-full flex flex-col h-full items-center p-4">
    <div class="w-full" v-if="!profileStore.editMode">
      <div class="flex flex-col items-center">
        <img class="w-28 h-28 rounded-full object-cover" :src="avatar" alt="User Avatar" />
        <div class="flex flex-row items-center gap-[10px] mt-[17px]">
          <p class="font-semibold text-[20px text-center">
            {{ profileStore.profile.firstName }} {{ profileStore.profile.lastName }}
          </p>
          <img
            src="/src/assets/edit_24.svg"
            alt=""
            srcset=""
            @click="
              () => {
                profileStore.toggleEditMode;
                router.push('/profile/edit');
              }
            "
          />
        </div>
        <p class="text-gray-500">{{ `@${tgUsername}` }}</p>
      </div>

      <Button class="flex flex-row mt-[10px] items-center gap-[6px] m-auto">
        Написать <img class="w-4 h-4" src="/src/assets/tg_white.svg" alt="Telegram" />
      </Button>

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
