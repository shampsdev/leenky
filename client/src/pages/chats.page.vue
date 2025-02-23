<template>
  <div class="screen-container">
    <transition name="fade" @before-enter="animateScreenEntry" @enter="animateScreenEntry">
      <div class="max-w-[95%] max-h-[100vh] overflow-auto scroll-container mx-auto px-4">
        <div class="flex items-center justify-between gap-[15px] py-4 pt-[25px]">
          <div class="flex gap-[12px] items-center">
            <h1 class="text-xl font-semibold">Чаты</h1>
            <img class="w-[22px] h-[22px]" src="/src/assets/add_green.svg" @click="addBot" />
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
            @keydown.enter="closeKeyboard"
            type="text"
            placeholder="Поиск"
            class="flex-1 outline-none placeholder-[#838388] rounded-full text-main"
          />
        </div>

        <ul name="chat" tag="ul" class="flex flex-col gap-0 mt-[25px]">
          <li
            @click="() => router.push(`/chat/${chat.id}`)"
            v-if="!isLoading"
            v-for="(chat, chatIndex) in filteredChats"
            :key="chat.id"
            class="chat-item flex w-full flex-row items-center gap-[7px] cursor-pointer"
          >
            <img
              :src="chat.avatar"
              @error="handleImageError"
              class="w-[60px] h-[60px] rounded-full aspect-square object-cover"
            />
            <div
              :class="[
                'flex flex-row w-full pl-[3px] justify-between py-[12px] items-center gap-[10px] border-b-[#c8d4d9]',
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
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useChatsSearchStore } from '@/stores/chatsSearch.store';
import { getChats, searchChats, leaveChat } from '@/api/api';
import { useMiniApp } from 'vue-tg';
import { animate } from 'motion';
import Profile from '@/components/profile.vue';
import { handleImageError } from '@/utils/errorHandlers';
const chats = ref([]);
const searchQuery = ref('');
const chatsSearchStore = useChatsSearchStore();
const router = useRouter();

const miniApp = useMiniApp();
const initData = miniApp.initData;

const isLoading = ref(true);

const filterChats = async () => {
  isLoading.value = true;
  if (searchQuery.value.trim() === '') {
    const fetchedChats = await getChats(initData);
    if (fetchedChats !== null) {
      chatsSearchStore.chatsData = fetchedChats;
      chats.value = chatsSearchStore.chatsData;
    }

    isLoading.value = false;
    return;
  }

  if (searchQuery.value === chatsSearchStore.searchQuery) {
    chats.value = chatsSearchStore.chatsData;
    chatsSearchStore.searchQuery = searchQuery.value;
  } else {
    const fetchedChats = await searchChats(initData, searchQuery.value);
    chatsSearchStore.chatsData = fetchedChats ?? [];
    chatsSearchStore.setQuery(searchQuery.value);
    chats.value = chatsSearchStore.chatsData;
    chatsSearchStore.searchQuery = searchQuery.value;
  }
  isLoading.value = false;
};

const leaveChatHandler = async chatId => {
  const response = await leaveChat(initData, chatId);
  if (response) {
    chats.value = chats.value.filter(item => item.id !== chatId);
    chatsSearchStore.chatsData = chats.value.filter(item => item.id !== chatId);
  }
};

const closeKeyboard = event => {
  event.target.blur();
};

onMounted(async () => {
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
      chatsSearchStore.chatsData = fetchedChats;
      chats.value = chatsSearchStore.chatsData;
    }
  }
  isLoading.value = false;
});

const addBot = () => {
  miniApp.openTelegramLink('https://t.me/leenky_bot?startgroup=');
};

const filteredChats = computed(() => chats.value);

watchEffect(() => {
  chats.value = chatsSearchStore.chatsData;
});

const animateScreenEntry = () => {
  animate(
    '.screen-container',
    {
      opacity: [0, 1],
      scale: [0.9, 1],
    },
    {
      ease: 'circInOut',
      duration: 0.5,
    }
  );
};

onMounted(() => {
  animateScreenEntry();
});
</script>

<style scoped>
.screen-container {
  opacity: 0.5;
}

/* .chat-enter-active,
.chat-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.chat-enter,
.chat-leave-to {
  opacity: 0;
  transform: translateY(50px);
} */
</style>
