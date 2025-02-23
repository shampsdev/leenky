<script setup>
import { useInviteStore } from '@/stores/invite.store';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user.store';
import { getChat, joinMe, getChatPreview } from '@/api/api';
import { useMiniApp } from 'vue-tg';
import { onMounted } from 'vue';
const router = useRouter();
const inviteStore = useInviteStore();
const currentUser = useUserStore();
const initData = useMiniApp().initData;
const miniapp = useMiniApp();
const chatId = useMiniApp().initDataUnsafe.start_param;
const accept = async () => {
  const userData = await joinMe(initData, chatId);
  if (userData !== null) {
    router.replace(`/chats`);
    setTimeout(() => {
      router.push(`/chat/${chatId}`);
    }, 100);
  }
};

const decline = () => {
  miniapp.close();
};

onMounted(async () => {
  console.log(miniapp.initData);
  const chat = await getChatPreview(initData, miniapp.initDataUnsafe.start_param);
  if (chat) {
    console.log(chat);
    inviteStore.chat = chat;
    console.log(chat);
  }
});
</script>

<template>
  <div class="flex flex-col justify-center text-center max-w-[90%] mx-auto h-full gap-[40px]">
    <div class="flex flex-col items-center">
      <p class="font-semibold text-[20px]">Расскажите о себе!</p>
      <p class="text-hint font-normal text-[17px] mt-2 max-w-[80%]">
        Участники этого чата хотят узнать о вас больше
      </p>
    </div>

    <div v-if="inviteStore.chat" class="flex flex-col gap-[10px] items-center rounded-lg">
      <img
        :src="inviteStore.chat.avatar"
        alt="Аватар чата"
        class="w-[116px] h-[116px] rounded-full"
      />
      <div class="flex flex-col gap-0 max-w-[80%]">
        <p class="font-normal mt-[17px] text-black">{{ inviteStore.chat.name }}</p>
        <p class="text-hint text-[15px]">Число участников: {{ inviteStore.chat.users_amount }}</p>
      </div>
    </div>

    <div class="flex justify-center">
      <button
        class="px-[30px] py-[12px] bg-[#20C86E] rounded-[30px] text-white font-semibold"
        @click="accept"
      >
        Хорошо 🤝
      </button>
    </div>
  </div>
</template>
