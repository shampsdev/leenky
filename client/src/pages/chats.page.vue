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
  <Button
    @click="
      () => {
        router.push('/vaniog');
      }
    "
    >ВАНЯЯЯ</Button
  >
  <KeepAlive>
    <div class="max-w-[95%] mx-auto px-4">
      <header class="flex items-center justify-between gap-[15px] py-4 mt-[25px]">
        <h1 class="text-xl font-semibold">
          Чаты
          <p @click="addBot">add</p>
        </h1>
        <Profile />
      </header>

      <div class="relative flex items-center gap-[8px] bg-gray-100 rounded-lg px-3 py-2 mb-4">
        <button>
          <img src="/src/assets/search_transparent.svg" alt="mic" class="w-5 h-5" />
        </button>
        <input
          @input="filterChats"
          v-model="searchQuery"
          type="text"
          placeholder="Поиск"
          class="flex-1 outline-none text-gray-700 placeholder-gray-400"
        />
      </div>

      <ul v-if="filteredChats.length" class="divide-y divide-gray-200">
        <li
          v-for="chat in filteredChats"
          :key="chat.id"
          class="flex items-center py-3 cursor-pointer"
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
            class="w-12 h-12 rounded-full object-cover mr-4"
          />

          <div class="flex-1">
            <p class="font-medium">{{ chat.name }}</p>
            <p class="text-sm text-gray-500">{{ chat.members }} участников</p>
          </div>

          <div
            @click="
              () => {
                leaveChatHandler(chat.id);
                filterChats();
              }
            "
            class="text-gray-400 text-xl"
          >
            LEAVE
          </div>
        </li>
      </ul>
      <p v-else>Нет найденных чатов</p>
    </div></KeepAlive
  >
</template>
// СДЕЛАТЬ АПДЕЙТ СТОРА ПРИ НАЖАТИИ НА ЧАТ
