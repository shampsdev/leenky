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
            class="flex-1 outline-none placeholder-[#838388] text-main"
          />
        </div>

        <ul
          v-show="filteredChats.length"
          name="chat"
          tag="ul"
          class="flex flex-col gap-0 mt-[25px]"
        >
          <li
            v-for="(chat, chatIndex) in filteredChats"
            :key="chat.id"
            class="chat-item rounded-[15px] relative flex w-full items-center gap-[7px] cursor-pointer overflow-hidden"
          >
            <div
              class="chat-bg absolute top-0 left-0 w-full h-full bg-[#EEEEEF] transition-all duration-300"
            ></div>

            <button
              class="delete-btn absolute right-0 top-0 h-full w-[80px] bg-transparent flex-col flex justify-center items-center transition-all duration-300"
              @pointerup.stop="leaveChatHandler(chat.id)"
              :class="{ 'show-delete': swipedChatId === chat.id }"
            >
              <img src="/src/assets/bin.svg" alt="" />
              <p class="font-medium text-[13px]">Удалить</p>
            </button>

            <div
              @click="
                () => {
                  chatsSearchStore.setChats(chats);
                  chatsSearchStore.setQuery(searchQuery);
                  router.push(`/chat/${chat.id}`);
                }
              "
              class="chat-content flex items-center gap-[7px] w-full transition-transform duration-300"
              :class="{ swiped: swipedChatId === chat.id }"
            >
              <img
                :src="chat.avatar"
                @error="handleImageError"
                class="w-[60px] h-[60px] rounded-full aspect-square object-cover"
              />
              <div
                class="flex flex-row w-full pl-[3px] justify-between py-[12px] items-center gap-[10px]"
              >
                <div class="flex flex-col gap-[2px]">
                  <p class="font-normal text-[17px]">{{ chat.name }}</p>
                  <p class="text-hint font-light text-[15px]">{{ chat.usersAmount }} участников</p>
                </div>
                <img
                  @mousedown="startSwipe(chat.id, $event)"
                  @mousemove="onSwipeMove($event)"
                  @mouseup="endSwipe"
                  @mouseleave="endSwipe"
                  @touchstart="startSwipe(chat.id, $event)"
                  @touchmove="onSwipeMove($event)"
                  @touchend="endSwipe"
                  src="/src/assets/navigation.svg"
                  class="text-gray-400 pr-[5px] text-xl"
                />
              </div>
            </div>
          </li>
        </ul>
        <div
          v-if="!filteredChats.length && !isLoading"
          class="flex w-full flex-col items-center text-center mt-[120px] gap-[20px]"
        >
          <img src="/src/assets/notFound.svg" />

          <div class="flex flex-col items-center text-center gap-[8px]">
            <h1 class="font-semibold text-[20px]">Тут пока ничего нет</h1>
            <p class="text-hint text-[17px]">
              Но вы можете исправить это! Добавьте чаты, чтобы видеть информацию о других участниках
            </p>
          </div>
        </div>
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
};

const closeKeyboard = event => {
  event.target.blur();
};

onMounted(async () => {
  isLoading.value = true;
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

const swipedChatId = ref(null);
const startX = ref(0);
const currentX = ref(0);
const threshold = 200;

const startSwipe = (chatId, event) => {
  startX.value = event.touches ? event.touches[0].clientX : event.clientX;
  currentX.value = startX.value;
  swipedChatId.value = chatId;
};

const onSwipeMove = event => {
  if (!swipedChatId.value) return;
  currentX.value = event.touches ? event.touches[0].clientX : event.clientX;
};

const endSwipe = () => {
  if (!swipedChatId.value) return;
  const deltaX = startX.value - currentX.value;
  if (deltaX > threshold) {
    swipedChatId.value = swipedChatId.value;
  } else {
    swipedChatId.value = null;
  }
};

onMounted(() => {
  animateScreenEntry();
});
</script>

<style scoped>
.screen-container {
  opacity: 0.5;
}

.chat-content {
  background-color: white;
  transform: translateX(0);
}

.swiped {
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
  transform: translateX(-130px);
}

.delete-btn {
  opacity: 0;
  pointer-events: none;
}

.chat-bg {
  z-index: 0;
  opacity: 1;
  transition: opacity 0.3s;
}

.show-delete {
  opacity: 1;
  pointer-events: all;
}
</style>
