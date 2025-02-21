<script setup>
import { useInviteStore } from "@/stores/invite.store";
import Button from "@/components/button.vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user.store";
import { getChat, joinMe } from "@/api/api";
import { useMiniApp } from "vue-tg";
import { onMounted } from "vue";
const router = useRouter();
const inviteStore = useInviteStore();
const currentUser = useUserStore();
const initData = useMiniApp().initData;
const miniapp = useMiniApp();
const chatId = useMiniApp().initDataUnsafe.start_param;
const accept = async () => {
  const userData = await joinMe(initData, chatId);
  if (userData !== null) {
    currentUser.logIn(userData);
    inviteStore.close();
    router.push(`/chats/${currentUser.id}`);
  }
};

const decline = () => {
  miniapp.close();
};

onMounted(async () => {
  const chat = await getChat(initData, miniapp.initDataUnsafe.start_param);
  if (chat) {
    console.log(chat);
    inviteStore.chat = chat;
  }
});
</script>

<template>
  <div class="fixed inset-0 backdrop-blur-md d flex justify-center items-center">
    <div class="bg-main w-[90%] max-w-[400px] p-6 rounded-2xl shadow-lg text-center">
      <p class="font-semibold text-[20px]">Новое приглашение!</p>
      <p class="text-hint text-[17px] mt-2">
        Добавьте чат, чтобы другие участники смогли посмотреть ваш профиль
      </p>

      <div v-if="inviteStore.chat" class="flex items-center gap-[10px] rounded-lg mt-[36px]">
        <img :src="inviteStore.chat.avatar" alt="Аватар чата" class="w-12 h-12 rounded-full" />
        <div class="ml-3 text-left">
          <p class="font-medium text-black">{{ inviteStore.chat.name }}</p>
          <p class="text-gray-500 text-sm">
            Количество участников: {{ inviteStore.chat.users.length }}
          </p>
        </div>
      </div>

      <div class="flex justify-center gap-[16px] mt-[36px]">
        <Button variant="secondary" @click="decline"> Отклонить </Button>
        <Button @click="accept"> Добавить </Button>
      </div>
    </div>
  </div>
</template>
