<script setup>
import { ref, watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { computed, onMounted } from 'vue';
import { getChat, getChats, searchChats, leaveChat } from '@/api/api';
import { useMiniApp, useBackButton } from 'vue-tg';
import Profile from '@/components/profile.vue';
import Button from '@/components/button.vue';
import { useChatSearchStore } from '@/stores/chatSearch.store';
import { useChatsSearchStore } from '@/stores/chatsSearch.store';
import { searchInChat } from '@/api/api';
const chats = ref([]);
const searchQuery = ref('');
const chatsSearchStore = useChatsSearchStore();
const chatSearchStore = useChatSearchStore();
const router = useRouter();

const miniApp = useMiniApp();

const initData = miniApp.initData;

const filterChats = async () => {
  if (searchQuery.value === chatsSearchStore.searchQuery) {
    chats.value = chatsSearchStore.chatsData;
  } else {
    const fetchedChats = await searchChats(initData, searchQuery.value);
    chatsSearchStore.chatsData = fetchedChats ?? [];
    chatsSearchStore.setQuery(searchQuery.value);
    chats.value = chatsSearchStore.chatsData;
  }
};

const leaveChatHandler = async chatId => {
  const response = await leaveChat(initData, chatId);
  if (response) {
    chats.value = chats.value.filter(item => item.id !== chatId);
    chatsSearchStore.chatsData = chats.value.filter(item => item.id !== chatId);
  }
  console.log(response, 'LEAVED');
};

onMounted(async () => {
  chatSearchStore.resetQuery();
  chatSearchStore.resetChatData();

  searchQuery.value = chatsSearchStore.searchQuery;

  if (chatsSearchStore.chatsData.length !== 0) {
    if (chatsSearchStore.searchQuery === searchQuery.value) {
      searchQuery.value = chatsSearchStore.searchQuery;
      chats.value = chatsSearchStore.chatsData;
    } else {
      searchQuery.value = chatsSearchStore.searchQuery;
      const searchedChats = await searchChats(initData, searchQuery.value);
      if (searchedChats !== null) {
        chats.value = searchedChats;
        chatsSearchStore.chatsData = searchedChats;
      }
    }
  } else {
    const fetchedChats = await getChats(initData);
    if (fetchedChats !== null) {
      chatsSearchStore.chatsData = await getChats(initData);
      chats.value = chatsSearchStore.chatsData;
    }
  }
});

const addBot = () => {
  miniApp.openTelegramLink('https://t.me/leenky_bot?startgroup=');
};
const filteredChats = computed(() => chats.value);

watchEffect(() => {
  chats.value = chatsSearchStore.chatsData;
});
</script>

<template>
  <transition name="slide-up">
    <div class="max-w-[95%] h-[100%] overflow-auto scroll-container mx-auto px-4">
      <!-- Ваши элементы и контент -->
      <div class="flex items-center justify-between gap-[15px] py-4 pt-[25px]">
        <div class="flex gap-[10px] items-center">
          <h1 class="text-xl font-semibold">Чаты</h1>
          <img class="w-[15px] h-[15px]" src="/src/assets/add_green.svg" @click="addBot" />
        </div>
        <Profile />
      </div>

      <div class="relative flex items-center gap-[8px] bg-[#EEEEEF] rounded-lg px-3 py-2 mb-4">
        <button>
          <img src="/src/assets/search_transparent.svg" alt="search" class="w-5 h-5" />
        </button>
        <input
          @input="filterChats"
          v-model="searchQuery"
          type="text"
          placeholder="Поиск"
          class="flex-1 outline-none text-gray-700 placeholder-gray-400"
        />
      </div>

      <ul v-if="filteredChats.length" class="flex flex-col gap-0 mt-[25px]">
        <li
          v-for="(chat, chatIndex) in filteredChats"
          :key="chat.id"
          class="flex w-full flex-row items-center gap-[7px] cursor-pointer slide-in"
        >
          <img
            @click="
              () => {
                chatsSearchStore.chatsData = chats;
                router.push(`/chat/${chat.id}`);
              }
            "
            :src="chat.avatar"
            alt="Avatar"
            class="max-w-[60px] max-h-[60px] rounded-full aspect-square object-cover"
          />

          <div
            :class="[
              ' flex flex-row w-full pl-[3px] justify-between py-[12px] items-center gap-[10px] border-b-[#c8d4d9]',
              chatIndex <= filteredChats.length - 2 ? 'border-b-1' : '',
            ]"
          >
            <div class="flex flex-col gap-[2px]">
              <p class="font-normal text-[17px]">{{ chat.name }}</p>
              <p class="text-hint font-light text-[15px]">{{ chat.users_amount }} участников</p>
            </div>
            <img
              src="/src/assets/navigation.svg"
              @click="leaveChatHandler(chat.id)"
              class="text-gray-400 text-xl"
            />
          </div>
        </li>
      </ul>
      <p v-else>Нет найденных чатов</p>
    </div>
  </transition>
</template>

<style scoped></style>
