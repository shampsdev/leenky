<script setup>
import { useInviteStore } from "@/stores/invite.store";
import Button from "./button.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const inviteStore = useInviteStore();
const accept = () => {
  inviteStore.close();
  router.push("/profile");
};
</script>

<template>
  <div class="fixed inset-0 backdrop-blur-md d flex justify-center items-center">
    <div class="bg-main w-[90%] max-w-[400px] p-6 rounded-2xl shadow-lg text-center">
      <p class="font-semibold text-[20px]">Новое приглашение!</p>
      <p class="text-hint text-[17px] mt-2">
        Добавьте чат, чтобы другие участники смогли посмотреть ваш профиль
      </p>

      <div class="flex items-center gap-[10px] rounded-lg mt-[36px]">
        <img
          src="/src/assets/chat_avatar_example.png"
          alt="Аватар чата"
          class="w-12 h-12 rounded-full"
        />
        <div class="ml-3 text-left">
          <p class="font-medium text-black">Шампиньоны (мини) хакатон</p>
          <p class="text-gray-500 text-sm">7 участников</p>
        </div>
      </div>

      <div class="flex justify-center gap-[16px] mt-[36px]">
        <Button variant="secondary" @click="inviteStore.close"> Отклонить </Button>
        <Button @click="accept"> Добавить </Button>
      </div>
    </div>
  </div>
</template>
